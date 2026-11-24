"""Vertical 9:16 (1080x1920) Reels / Shorts / TikTok version of a finished 16:9 film, CPU-only with ffmpeg + libass.

Layout. Everything is flush-left on x=60, matching the films' own top-left type:
- A blurred, darkened copy of the film fills the canvas. Its luma is capped so text bands stay dark over white plates.
- The full 16:9 frame sits at 1080x608 (y 656–1264). Nothing is cropped, so every fact, source line and credit stays in frame.
- The top band (y ~290–620, below the apps' top UI) holds the title in the film's own face, an accent sub-line and the AI disclosure note.
- The bottom band (from y 1296, right margin 150 to clear the button column, never past ~1500) holds word-by-word karaoke captions from the aligned lyrics / narration. Every cue is explicitly \\pos'd, so libass never collision-stacks it.

Cuts. A cut is a list of film-time windows concatenated into the output (a splice is two windows). Lyric times are remapped.
The output ends on a 0.7 s fade of picture and sound, with a -1 dBTP limiter on the audio.

  python make_reel.py reel.json [--cut shorts|full] [--out DIR] [--preview 30]
Writes <out>/<name>.<cut>.reel.mp4 (+ <out>/_<key>_<cut>/reel.ass). The config format is in SKILL.md.
"""
import argparse, json, math, os, re, shutil, subprocess
from pathlib import Path

OUT = None
FF = r"ffmpeg-bin\node_modules\ffmpeg-static\ffmpeg.exe"   # any ffmpeg with libass; override with FFMPEG_PATH or "ffmpeg" in the config
W, H, FG_H, FG_Y = 1080, 1920, 608, 656
X0, CAP_Y, CAP_MR = 60, 1296, 150
ROOT = Path(".")


def ass_color(hexrgb, alpha=0):
    r, g, b = int(hexrgb[1:3], 16), int(hexrgb[3:5], 16), int(hexrgb[5:7], 16)
    return f"&H{alpha:02X}{b:02X}{g:02X}{r:02X}"


def lighten(hexrgb, k=0.22):
    r, g, b = (int(hexrgb[i:i + 2], 16) for i in (1, 3, 5))
    return "#%02X%02X%02X" % tuple(round(v + (255 - v) * k) for v in (r, g, b))


def curly(s):
    s = re.sub(r"(^|[\s(\[—-])\"", r"\1“", s)
    return s.replace('"', "”").replace("'", "’")


def load_srt(path):
    """SRT -> lines with evenly spread word times (for films without word-level timing)."""
    txt = (ROOT / path).read_text(encoding="utf-8-sig").replace("\r", "")
    out = []
    for blk in re.split(r"\n\s*\n", txt.strip()):
        rows = blk.split("\n")
        arrow = next((i for i, r in enumerate(rows) if "-->" in r), None)
        if arrow is None:
            continue
        m = re.match(r"(\d+):(\d+):(\d+)[,.](\d+)\s*-->\s*(\d+):(\d+):(\d+)[,.](\d+)", rows[arrow].strip())
        if not m:
            continue
        g = [int(x) for x in m.groups()]
        t0 = g[0] * 3600 + g[1] * 60 + g[2] + g[3] / 1000
        t1 = g[4] * 3600 + g[5] * 60 + g[6] + g[7] / 1000
        words = " ".join(rows[arrow + 1:]).split()
        if not words:
            continue
        step = (t1 - t0) / len(words)
        out.append({"words": [{"w": w, "start": t0 + i * step, "end": t0 + (i + 1) * step} for i, w in enumerate(words)]})
    return out


def load_lines(path):
    if str(path).lower().endswith(".srt"):
        return load_srt(path)
    d = json.loads((ROOT / path).read_text(encoding="utf-8"))
    lines = d["lines"] if "lines" in d else d["words"]  # vo.json keeps its sentences under "words"
    return [l for l in lines if l.get("words")]


def split_line(ws, max_chars):
    """Balanced split: keep the line whole if it fits ~2 caption lines; else the fewest near-equal chunks, preferring
    breaks after punctuation, never leaving a chunk under 15 characters / 2 words, never splitting two Capitalised words."""
    text = " ".join(w["w"] for w in ws)
    if len(text) <= max_chars or len(ws) < 4:
        return [ws]
    k = math.ceil(len(text) / (max_chars - 6))
    cum, n = [], 0
    for w in ws:
        n += len(w["w"]) + 1
        cum.append(n)
    out, start = [], 0
    for j in range(1, k):
        target = len(text) * j / k
        best, bs = None, None
        for i in range(start + 1, len(ws)):
            left = " ".join(w["w"] for w in ws[start:i]); right = " ".join(w["w"] for w in ws[i:])
            if len(left) < 15 or len(right) < 15 or i - start < 2 or len(ws) - i < 2:
                continue
            a, b = ws[i - 1]["w"], ws[i]["w"]
            if a[:1].isupper() and b[:1].isupper() and a[-1].isalpha():
                continue  # "Hugging Face", "Supreme Leader"
            score = abs(cum[i - 1] - target) - (14 if a[-1] in ",:;.?!—" else 0)
            if bs is None or score < bs:
                best, bs = i, score
        if best is None:
            break
        out.append(ws[start:best]); start = best
    out.append(ws[start:])
    return out


def cues(lines, max_chars):
    out = []
    for l in lines:
        out += split_line(l["words"], max_chars)
    return out


def remap(t, segs):
    """Film time -> output time (None if t falls in a cut-out part)."""
    acc = 0.0
    for a, b in segs:
        if a - 1e-6 <= t <= b + 1e-6:
            return acc + (t - a)
        acc += b - a
    return None


def ts(t):
    t = max(0.0, t)
    h, r = divmod(t, 3600); m, s = divmod(r, 60)
    return f"{int(h)}:{int(m):02d}:{s:05.2f}"


def build_ass(f, segs):
    dur = sum(b - a for a, b in segs)
    acc, sub_c = f["accent"], lighten(f["accent"])
    cap, sub_sz, note_sz = f["cap_size"], f.get("sub_size", 36), f.get("note_size", 28)
    head = f"""[Script Info]
ScriptType: v4.00+
PlayResX: {W}
PlayResY: {H}
WrapStyle: 0
ScaledBorderAndShadow: yes

[V4+ Styles]
Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding
Style: Title,{f['title_font']},{f['title_size']},&H00FFFFFF,&H00FFFFFF,&H00000000,&H00000000,{-1 if f.get('title_bold') else 0},0,0,0,100,100,-2,0,1,0,0,1,{X0},{X0},0
Style: Sub,{f['sub_font']},{sub_sz},{ass_color(sub_c)},&H00FFFFFF,&H70000000,&H00000000,0,0,0,0,100,100,3,0,1,1.5,0,7,{X0},{X0},0
Style: Note,{f['sub_font']},{note_sz},&H10FFFFFF,&H10FFFFFF,&H70000000,&H00000000,0,0,0,0,100,100,2,0,1,1.2,0,7,{X0},{X0},0
Style: Cap,{f['cap_font']},{cap},&H00FFFFFF,&H66FFFFFF,&H60000000,&H80000000,{-1 if f.get('cap_bold') else 0},0,0,0,100,100,0,0,1,3,2,7,{X0},{CAP_MR},0
Style: End,{f['cap_font']},{round(cap * 0.62)},&H00FFFFFF,&H00FFFFFF,&H60000000,&H80000000,{-1 if f.get('cap_bold') else 0},0,0,0,100,100,0,0,1,2,1,7,{X0},{CAP_MR},0
Style: Rule,Arial,10,{ass_color(acc)},{ass_color(acc)},&H00000000,&H00000000,0,0,0,0,100,100,0,0,1,0,0,7,0,0,0

[Events]
Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text
"""
    T = f["title_size"]
    base2 = 512                     # baseline-ish bottom of the 2nd title line (\an1 = bottom-left)
    base1 = base2 - round(T * 0.9)  # tight leading (~0.9 em)
    ev = [f"Dialogue: 2,{ts(0)},{ts(dur)},Title,,0,0,0,,{{\\an1\\pos({X0},{base1})}}{f['title'][0]}",
          f"Dialogue: 2,{ts(0)},{ts(dur)},Title,,0,0,0,,{{\\an1\\pos({X0},{base2})}}{f['title'][1]}",
          f"Dialogue: 2,{ts(0)},{ts(dur)},Sub,,0,0,0,,{{\\an7\\pos({X0},{base2 + 26})}}{f['sub']}",
          f"Dialogue: 2,{ts(0)},{ts(dur)},Note,,0,0,0,,{{\\an7\\pos({X0},{base2 + 26 + sub_sz + 16})}}{f['note']}",
          f"Dialogue: 1,{ts(0)},{ts(dur)},Rule,,0,0,0,,{{\\pos({X0},{FG_Y - 14})\\p1}}m 0 0 l 120 0 120 6 0 6{{\\p0}}",
          f"Dialogue: 1,{ts(0)},{ts(dur)},Rule,,0,0,0,,{{\\pos({X0},{FG_Y + FG_H + 10})\\p1}}m 0 0 l 120 0 120 6 0 6{{\\p0}}"]
    # caption cues in OUTPUT time; a cue that is not wholly inside one kept window is dropped
    raw = []
    for c in cues(load_lines(f["lines"]), max_chars=round(52 * 78 / cap)):
        s0, s1 = remap(c[0]["start"], segs), remap(c[-1]["end"], segs)
        if s0 is None or s1 is None or s1 < s0:
            continue
        raw.append((s0, c))
    last_end = 0.0
    for i, (s0, c) in enumerate(raw):
        shift = s0 - c[0]["start"]
        t0 = max(0.0, s0 - 0.12)
        nxt0 = (raw[i + 1][0] - 0.12) if i + 1 < len(raw) else dur
        t1 = max(c[-1]["end"] + shift + 0.45, c[-1]["start"] + shift + 0.25)
        t1 = min(t1, nxt0 - 0.02, dur)          # the clamp ALWAYS wins: cues never overlap
        t0, t1 = round(t0, 2), round(t1, 2)
        if t1 - t0 < 0.2:
            continue
        fade_out = 0 if (i + 1 < len(raw) and nxt0 - t1 < 0.2) else 90
        parts = [f"{{\\k{max(0, round((s0 - t0) * 100))}}}"]
        for j, w in enumerate(c):
            nxt = c[j + 1]["start"] if j + 1 < len(c) else w["end"]
            parts.append(f"{{\\k{max(1, round((nxt - w['start']) * 100))}}}{curly(w['w']).replace('{', '(').replace('}', ')')} ")
        ev.append(f"Dialogue: 3,{ts(t0)},{ts(t1)},Cap,,0,0,0,,{{\\an7\\pos({X0},{CAP_Y})\\fad(60,{fade_out})}}" + "".join(parts).rstrip())
        last_end = max(last_end, t1)
    if f.get("end_note") and dur - last_end > 1.5:
        ev.append(f"Dialogue: 3,{ts(last_end + 0.3)},{ts(dur)},End,,0,0,0,,{{\\an7\\pos({X0},{CAP_Y})\\fad(300,0)}}{f['end_note']}")
    return head + "\n".join(ev) + "\n", len(raw), dur


def main():
    global ROOT, OUT, FF
    ap = argparse.ArgumentParser()
    ap.add_argument("config", help="reel.json (see SKILL.md); relative paths inside it resolve against its folder")
    ap.add_argument("--cut", default="shorts"); ap.add_argument("--out", help="output folder (default: <config dir>/reels)")
    ap.add_argument("--preview", type=float, help="render only the first N output seconds (QA)")
    a = ap.parse_args()
    cfg_p = Path(a.config).resolve()
    f = json.loads(cfg_p.read_text(encoding="utf-8"))
    ROOT = cfg_p.parent
    OUT = Path(a.out).resolve() if a.out else ROOT / "reels"
    FF = os.environ.get("FFMPEG_PATH") or f.get("ffmpeg") or FF
    a.film = f.get("key", f["name"])
    # snap every cut to a 24 fps frame boundary, so audio and the frame-quantised video stay in exact sync across a splice
    segs = [(round(s * 24) / 24, round(e * 24) / 24) for s, e in f["cuts"][a.cut]]   # cuts: {"shorts": [[a, b], ...], "full": [...]}
    OUT.mkdir(parents=True, exist_ok=True)
    work = OUT / f"_{a.film}_{a.cut}"
    work.mkdir(exist_ok=True)
    ass_text, n, dur = build_ass(f, segs)
    (work / "reel.ass").write_text(ass_text, encoding="utf-8")
    fonts = work / "fonts"
    if fonts.exists():
        shutil.rmtree(fonts)
    fonts.mkdir()
    for p in (ROOT / f["fonts"]).rglob("*.ttf"):
        shutil.copy2(p, fonts / p.name)
    out_len = min(dur, a.preview) if a.preview else dur
    master = str(ROOT / f["master"])
    # 1) AUDIO, on its own: concat the kept windows (15 ms micro-fades at each join), limit, fade; encode; decode and
    #    verify the peak (AAC can overshoot on a transient), re-encoding with less gain if it exceeds -1 dBFS
    afc = [f"[0:a]atrim=start={s:.4f}:end={e:.4f},asetpts=PTS-STARTPTS,afade=t=in:d=0.015,"
           f"afade=t=out:st={max(0.0, e - s - 0.015):.4f}:d=0.015[a{i}]" for i, (s, e) in enumerate(segs)]
    afc.append("".join(f"[a{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=0:a=1[ca]")
    afc.append(f"[ca]alimiter=limit=0.72:attack=2:release=40:level=false,"
               f"afade=t=out:st={max(0.0, out_len - 0.6):.3f}:d=0.6,atrim=end={out_len:.4f}[aout]")
    subprocess.run([FF, "-y", "-v", "error", "-i", master, "-filter_complex", ";".join(afc), "-map", "[aout]",
                    "-c:a", "pcm_f32le", "-ar", "48000", str(work / "audio.wav")], check=True)
    gain, tp, lufs = 1.0, 0.0, 0.0
    for _ in range(4):
        subprocess.run([FF, "-y", "-v", "error", "-i", str(work / "audio.wav"), "-af", f"volume={gain:.4f}",
                        "-c:a", "aac", "-b:a", "192k", "-ar", "48000", str(work / "audio.m4a")], check=True)
        meas = subprocess.run([FF, "-hide_banner", "-i", str(work / "audio.m4a"), "-af", "loudnorm=print_format=summary",
                               "-f", "null", "-"], capture_output=True, text=True).stderr
        tp = float(re.search(r"Input True Peak:\s*([-+\d.]+)", meas).group(1))
        lufs = float(re.search(r"Input Integrated:\s*([-+\d.]+)", meas).group(1))
        if tp <= -1.0:
            break
        gain *= 10 ** ((-1.3 - tp) / 20)
    print(f"  audio after AAC: {lufs:.1f} LUFS, true peak {tp:+.1f} dBTP (gain {gain:.3f})", flush=True)
    # 2) VIDEO, silent: the same windows, then the vertical composite; muxed with the verified audio
    fc = [f"[0:v]trim=start={s:.4f}:end={e:.4f},setpts=PTS-STARTPTS[v{i}]" for i, (s, e) in enumerate(segs)]
    fc.append("".join(f"[v{i}]" for i in range(len(segs))) + f"concat=n={len(segs)}:v=1:a=0[cv]")
    fc.append("[cv]split=2[x][y]")
    fc.append(f"[x]scale=270:480:force_original_aspect_ratio=increase,crop=270:480,boxblur=10:2,scale={W}:{H},"
              f"eq=brightness=-0.2:saturation=0.7,lutyuv=y='min(val\\,92)',"
              f"drawbox=x=0:y=0:w={W}:h={FG_Y}:color=black@0.5:t=fill,"
              f"drawbox=x=0:y={FG_Y + FG_H}:w={W}:h={H - FG_Y - FG_H}:color=black@0.55:t=fill[bg]")
    fc.append(f"[y]scale={W}:{FG_H}:flags=lanczos[fg]")
    fc.append(f"[bg][fg]overlay=0:{FG_Y},subtitles=reel.ass:fontsdir=fonts,"
              f"fade=t=out:st={max(0.0, out_len - 0.7):.2f}:d=0.7,format=yuv420p[v]")
    suffix = f".{a.cut}.reel" + (".preview" if a.preview else "") + ".mp4"
    dst = OUT / (f["name"] + suffix)
    cmd = [FF, "-y", "-v", "warning", "-i", master, "-i", str(work / "audio.m4a"), "-filter_complex", ";".join(fc),
           "-map", "[v]", "-map", "1:a", "-t", f"{out_len:.3f}",
           "-c:v", "libx264", "-preset", "slow", "-crf", "20", "-maxrate", "12M", "-bufsize", "24M", "-r", "24",
           "-c:a", "copy", "-movflags", "+faststart", str(dst)]
    print(f"{a.film}/{a.cut}: {n} caption cues, {dur:.2f}s from {segs} -> {dst.name}", flush=True)
    r = subprocess.run(cmd, cwd=work, capture_output=True, text=True, encoding="utf-8", errors="replace")
    bad = [l for l in r.stderr.splitlines() if re.search(r"fontselect|[Gg]lyph .* not found|failed to find any fallback", l)]
    if r.returncode or bad:
        raise SystemExit(f"FAILED ({r.returncode}): " + "\n".join((bad or r.stderr.splitlines())[-12:]))


if __name__ == "__main__":
    main()
