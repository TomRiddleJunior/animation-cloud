---
name: vertical-reels
description: Turn a finished 16:9 film (music video, explainer, documentary) into polished 9:16 1080x1920 versions for Instagram Reels, YouTube Shorts and TikTok, and write the post captions. The full frame stays uncropped in the middle, so on-screen facts, sources and credits survive. A blurred moving background fills the canvas, a title block in the film's own fonts sits in the top band, and large word-by-word karaoke captions from the lyric/narration timings (or an .srt) sit in the bottom band, all inside the apps' safe zones. Films over 3:00 get Shorts-length cuts on musical boundaries, and audio is verified to about −14 LUFS and ≤ −1 dBTP after AAC encoding. Use it whenever someone asks for reels, shorts, TikTok, vertical, 9:16, "portrait version", "make it postable on Instagram/YouTube Shorts", or for post captions, titles, descriptions or hashtags for a video, even if they only say "make versions for social".
---

# Vertical reels and post captions

`scripts/make_reel.py` is a CPU-only builder (ffmpeg + libass). `references/configs/*.reel.json` holds the configs of three shipped films. `references/captions-guide.md` covers how to write the Instagram and YouTube copy.

## Why frame instead of crop

Code-rendered films put information all over the 16:9 frame: lyrics top-left, data panels on the right, source lines under the numbers. A centre crop to 9:16 keeps only 32% of the width and throws most of that away.

The film was also laid out for landscape, so re-rendering it vertically means redesigning every chapter. Framing it instead keeps every fact intact and readable at full screen. The added bands (title above, big captions below) are what make it work on a phone.

## Layout (1080×1920)

| Element | Where |
|---|---|
| Background | the film itself, scaled to cover, blurred, `eq` darkened, **luma capped** (`lutyuv=y=min(val,92)`), then bands at about 50–55% black. Bright plates would otherwise wash out the text. |
| The film | full frame, 1080×608 at y 656–1264 |
| Title | flush-left at x 60, two separate lines (tight leading), the film's own display face, bottom near y 512 |
| Sub-line | accent colour lightened about 22%, mono, 36 px (44 for fonts with tall metrics), under the title |
| Note line | the **AI disclosure** ("MUSIC: MINIMAX-MUSIC3 (AI-GENERATED)", "NARRATION: … (AI VOICE)"), 28–34 px, full opacity |
| Accent rules | 120×6 px at x 60, just above and below the frame |
| Captions | `\an7\pos(60,1296)`, right margin 150 (the like/comment column), at most 2 lines, never past y about 1500 (app UI below). Karaoke: ghost until sung, then white. |
| End note | for fact films: "Every number is sourced on screen." after the last line |

Safe zones assumed: the top 0–250 px and bottom 1550–1920 px are covered by app UI, and the right 150 px column carries buttons from y about 900.

## The config (`reel.json`)

```json
{
  "key": "ai", "name": "the-state-of-ai-oct-2026",
  "master": "out/the-state-of-ai-oct-2026.mp4",
  "lines": "data/lyrics.json",
  "fonts": "app/public/fonts",
  "title": ["THE STATE", "OF AI"], "title_font": "Inter Tight Black", "title_size": 122,
  "sub": "OCTOBER 2026 · EVERY NUMBER SOURCED", "sub_font": "JetBrains Mono SemiBold",
  "note": "MUSIC: MINIMAX-MUSIC3 (AI-GENERATED)",
  "cap_font": "Inter Tight ExtraBold", "cap_size": 78, "accent": "#E8553D",
  "end_note": "Every number is sourced on screen.",
  "cuts": {"shorts": [[0.0, 175.0]], "full": [[0.0, 175.0]]}
}
```

- **Paths** resolve against the config's folder; absolute paths work too.
- **`lines`** takes any of three formats:
  - gmv `data/lyrics.json` (`lines[].words[]`);
  - a narration `vo.json` (sentences under `words`);
  - an `.srt` file (word times are then spread evenly through each cue).
- **Font names** are libass's internal family names, not file names: "Inter Tight Black", "Newsreader" with `"title_bold": true`, "Baloo 2 ExtraBold". Read them with fontTools `name` IDs 1, 2 and 4. A missing face fails the build, since the builder greps libass warnings.
- **Optional keys:** `title_bold`, `cap_bold`, `sub_size`, `note_size` (raise them for fonts with tall win-metrics, such as Baloo or Atkinson, which libass renders small), `end_note`, `ffmpeg`.
- **`cuts`** are film-time windows that get concatenated. Each is snapped to 24 fps frame boundaries, so audio stays frame-locked across a splice.

Run: `python make_reel.py reel.json --cut shorts [--out DIR] [--preview 20]`. A 3-minute film takes about a minute on the 14900K.

## 3-minute cuts (Shorts and Reels cap at 3:00; TikTok is fine longer)

- **First trim dead air:** silent pre-rolls, and tails after the audio decays. Find them with the lyric times and `astats` / RMS.
- **Still too long?** Choose cuts on **musical boundaries**:
  - **End a cut after a complete sung line**, never mid-word. Check the next line's first word time.
  - **For a splice**, cut out a whole section (for example a verse). Use the film's own segment cuts as the cut points, and choose two points with the **same beat phase**: both one beat before a downbeat, a whole number of bars apart. Confirm no sung line crosses either point. The World film dropped verse 2 (104.03 → 150.99 s, 19 bars at 97 BPM) and kept its ending.
  - Prefer keeping the opening, the hook and the ending. Tell the user exactly what was removed.
- **Also offer a full-length 9:16 version** for TikTok, or for a regular vertical upload.

## Audio verification (why there is a loop)

The limiter (`alimiter limit 0.72`) catches sample peaks, but AAC encoding can overshoot on a transient. Earlier, mixing audio and video in one concat also padded audio to frame-quantised video segments and spiked a single sample to +1.5 dBTP. So the builder:
1. renders the audio on its own;
2. encodes it to AAC;
3. measures **true peak with ffmpeg's `loudnorm` summary** (a hand-rolled mono peak read once gave a wrong answer);
4. re-encodes with less gain until it is ≤ −1.0 dBTP;
5. muxes it with the silent video render.

Results so far: −13.5 to −14.2 LUFS for the songs, −16 for the narrated explainer, at full gain.

## QA checklist (a QA pass found all of these in the first version)

- **No two caption events overlap** (`t1 = min(t1, next_t0 − 0.02)`, applied last). Without `\pos`, libass collision-stacks overlapping cues and pushes captions into the bottom UI.
- **Balanced cue splits:** keep a line whole if it fits about 52 characters. Never leave an orphan chunk under 15 characters, and never split two Capitalised words ("Hugging Face").
- **One alignment axis**, with no hard WordArt-style drop shadow on the title.
- **The disclosure note is legible on a phone**: 28 px or more at full opacity.
- **Contrast over the brightest scenes**, especially white or cream plates, which is what the luma cap is for.
- **The ending fades** (0.7 s on picture, 0.6 s on audio); no dead air.
- **Spot-check frames** every 4 s plus the first and last 3 s, and check the durations.

## Captions for posting

Write one file per film with:
- an Instagram Reels caption;
- a YouTube Shorts title and description;
- a posting checklist: AI-content labels, licence cautions, a suggested cover frame.

Follow `references/captions-guide.md`.
