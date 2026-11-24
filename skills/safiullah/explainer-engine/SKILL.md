---
name: explainer-engine
description: "Shared code-video engine behind every explainer-* style skill — builds animated explainer / motion-graphics videos as SVG+HTML scenes on a seekable GSAP timeline, renders them frame-by-frame in headless Edge to MP4, with local Kokoro TTS voiceover, a synthesized music score and sound effects, and a frame-analysis QA tool that measures cuts, motion, palette, loudness and WPM. Use it whenever you build an animated explainer, product/SaaS explainer, motion-graphics promo, educational animation or channel-style video in code; load the matching explainer-<style> skill first for the look, then follow this for the mechanics. Also use it to analyse any reference video frame by frame (contact sheets, filmstrips, metrics)."
---

# Explainer engine

`ENGINE` below = the `engine/` folder next to this file (`~/.claude/skills/explainer-engine/engine`).

```
script.json ──tts.py──► audio/vo.wav + data/vo.json (word times)
                              │
index.html + scene.js ◄───────┘  (scene reads vo.json, places every move on a word)
        │ render.mjs --cues ──► data/cues.json (sfx list the scene declared)
        │ sound.py (sound.json) ─► audio/final.wav (score + sfx + ducked VO, loudnorm)
        └ render.mjs ──► out/<name>.mp4 ──qa/analyze_video.py──► out/qa/ (sheets + metrics.json)
```

## Setup (once per machine)
- `cd ENGINE && npm install` (gsap 3.13 with all plugins, playwright-core, ffmpeg-static). Uses installed **Edge** (or Chrome) headless — no browser download.
- Python for TTS/sound: any Python with `pip install kokoro soundfile scipy numpy` (+ `misaki[en]`; `misaki[zh]` / Hindi
  need extra packages, see Gotchas). Point `make.sh` at it with `EXPLAINER_PY=/path/to/python` (default: the venv at
  `~/.generative-music-video/venv` if present, else `python3`/`python` on PATH). Kokoro runs fine on CPU.
- ffmpeg: the engine's `ffmpeg-static` (from `npm install`); override with `FFMPEG_PATH`.
- QA analyzer needs only numpy + Pillow (any Python, run with `-I`).

## Project layout
```
my-video/
  index.html      stage + script tags (copy from a style skill's assets/template)
  scene.js        X.boot(async X => { ... })   ← the whole film
  script.json     narration lines (omit for music-only promos)
  sound.json      music preset + energy sections + loudness
  data/ audio/ out/   (generated)
```
`index.html` skeleton:
```html
<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="/engine/fonts/fonts.css">
<style>html,body{margin:0;background:#000;overflow:hidden}
#stage{position:absolute;left:0;top:0;width:1920px;height:1080px;transform-origin:0 0;overflow:hidden;background:#fff}
#svg{position:absolute;inset:0}</style></head>
<body><div id="stage"><svg id="svg" viewBox="0 0 1920 1080" width="1920" height="1080"><defs></defs></svg></div>
<script src="/engine/node_modules/gsap/dist/gsap.min.js"></script>
<script src="/engine/node_modules/gsap/dist/MorphSVGPlugin.min.js"></script>  <!-- + DrawSVGPlugin, SplitText, CustomEase, MotionPathPlugin as needed -->
<script src="/engine/lib/explainer.js"></script>
<script src="scene.js"></script></body></html>
```
The renderer serves the project at `/` and the engine at `/engine/`, so projects can live anywhere.

**Vertical reels (9:16):** declare the size on the root element — `<html lang="en" data-size="1080x1920">` — and make
`#stage` 1080×1920 and every `<svg>` `viewBox="0 0 1080 1920"`. `render.mjs` reads `data-size` for the viewport (so
`--draft` gives 540×960) and the runtime sets `X.W/X.H` from it. Keep text out of Instagram's UI: bottom ~18 % and
right ~12 % of the frame. Styles built vertical: line-essay, satire-cartoon, data-cards, psa-reel, paper-trail.

## Commands
```bash
ENGINE/make.sh <project> --draft          # voice → cues → sound → 960x540@15 out/draft.mp4 (seconds)
ENGINE/make.sh <project>                  # full 1920x1080@30 out/<name>.mp4 + QA into out/qa/
ENGINE/make.sh <project> --skip-tts       # reuse the voice after editing only visuals
node ENGINE/render.mjs <project> --stills 2.5,11,30.2   # PNG stills (check composition at key beats)
node ENGINE/render.mjs <project> --sheet 24             # out/sheet.jpg contact sheet
node ENGINE/render.mjs <project> --serve                # http://127.0.0.1:<port>/?play live preview with audio, ?t=12 freeze
python -I ENGINE/qa/analyze_video.py <video.mp4|media_dir> <out_dir>   # metrics + opening/timeline/strips/ending sheets
```
Speed on a 32-thread CPU without GPU: ~45 fps full-res (4 workers), ~90 fps draft. Kokoro ≈ 3-5× real time on CPU.

## scene.js API (`window.X`)
| call | does |
|---|---|
| `await X.loadVO()` | loads data/vo.json (silent animatic if missing) |
| `X.line(id)` / `X.word(id,'word',nth)` / `X.wordEnd(...)` | line {start,end,words}; start/end time of a word → **put moves on words** |
| `X.tl` | the paused master timeline — add tweens at absolute times: `X.tl.to(el,{x:100},t)` |
| `X.scene(name,t0,t1,build)` | `<g>` visible only in [t0,t1]; `build(g,t0,t1)` adds its tweens |
| `X.svg(tag,attrs,parent)` / `X.html(tag,attrs,parent)` | create elements (`text:` attr sets textContent) |
| `X.cam(g)` | make a group a camera (tween `scale/x/y/rotation` about frame centre) |
| `X.pop(el,t,{scale,dur,ease,sfx})` | overshoot scale-in + pop sfx |
| `X.drawOn(path,t,dur)` | stroke draw-on without plugins |
| `X.countUp(el,from,to,t,dur,fmt)` / `X.typeOn(el,text,t,cps)` | numbers / typewriter |
| `X.sfx(t,type,{dur,gain,pitch,pan})` | declare a sound effect (mixed by sound.py) |
| `X.every(fn(t))` | per-frame procedural hook (idle wobble, particles) — must be a pure function of t |
| `X.grain(op,fps)` / `X.paper(color)` / `X.boil(id,scale,fps)` | film grain overlay · paper texture data-URL · hand-drawn line boil filter |
| `X.glow(id,std,color)` / `X.shadow(id,dx,dy,blur,color,op)` / `X.linear(id,stops)` / `X.radial(id,stops)` | defs, return `url(#id)` |
| `X.torn(w,h,jag,seed)` | torn-paper path for collage cut-outs |
| `X.rand(seed)` | seeded PRNG (never `Math.random`) |
| `X.end(t)` | total duration (default: max(timeline, vo.duration)) |

Plugins (free since GSAP 3.13): `morphSVG` (paths only — convert shapes with `MorphSVGPlugin.convertToPath(el)`), `drawSVG`, `SplitText` (kinetic type), `CustomEase` (`CustomEase.create('snap','M0,0 C0.7,0 0.2,1 1,1')`), `motionPath`.

### The sync pattern (use it everywhere)
```js
X.boot(async (X) => {
  await X.loadVO();
  const s1 = X.line('problem');
  X.scene('problem', s1.start - 0.4, X.line('solution').start, (g, t0) => {
    const box = X.svg('rect', {x: 760, y: 380, width: 400, height: 300, rx: 24, fill: '#fff'}, g);
    X.pop(box, t0 + 0.1);
    const w = X.word('problem', 'scattered');            // the stressed word
    X.tl.to(box, {rotation: -6, x: -40, duration: 0.5, ease: 'back.out(3)'}, w);
    X.sfx(w, 'swoosh', {dur: 0.4});
  });
  X.end(X.vo.duration);
});
```
Rules of thumb that hold across every analysed style: a visual change lands on (or 2-4 frames before) the stressed word; build-ons stagger 3-6 frames; never a linear ease except for camera drifts and tickers; anything on screen > 4 s gets idle motion (drift, breathe, blink) unless the style deliberately holds.

## script.json / sound.json
```json
{"voice": "am_michael", "speed": 1.0, "lead": 0.8, "tail": 1.6,
 "lines": [{"id": "hook", "text": "…"}, {"id": "problem", "text": "…", "gap": 0.5}, {"id": "cta", "text": "…", "at": 52.0}]}
```
Voices: `af_heart af_bella af_nicole af_sarah am_michael am_adam am_fenrir am_puck am_echo am_eric bf_emma bf_isabella bm_george bm_lewis bm_daniel` (a=US, b=UK). Speed 1.0 ≈ 186 wpm while speaking; overall WPM = words / runtime — tune `speed` and `gap` to the style's target.
```json
{"preset": "corporate-pluck", "bpm": 112, "key": 0, "sections": [{"t": 0, "energy": 1}, {"t": 12, "energy": 2}, {"t": 44, "energy": 3}, {"t": 56, "energy": 0}],
 "music_under_voice_db": -18, "sfx_db": -2, "lufs": -14, "end_hit": true}
```
External music instead of a preset (e.g. a MiniMax-Music3 instrumental): `"music_file": "audio/bed.flac", "music_offset": 12.1, "music_trim": 0` — the track is resampled, placed at `music_offset`, ducked under the voice and levelled exactly like the synthesized score (`explainer-satire-globe` uses it).
Presets: `corporate-pluck` (SaaS, kalimba arps + claps), `tech-glow` (AI/product, saw arps + 808), `ambient-space` (science, pads + bells + timpani swells), `lofi-piano` (essay, e-piano), `doc-pulse` (journalism, piano + ticking pulse), `playful-bounce` (pizzicato, cartoon), `curious-marimba` (education), `hype-trap` (launch promo, 140 bpm), `none`. Energy 0–3 adds/removes layers; rising energy gets an automatic riser, energy 3 an impact.
SFX: `pop click swoosh whoosh woosh_low type ding notif success error tick tock thud impact riser paper scribble shutter boing glitch coin sparkle chime bubble blip blip_up blip_down beep zoom_in zoom_out slide stamp drop heartbeat`.

## 3D models: Polyfork (three.js styles)
Optional: Polyfork (https://polyfork.dev) low-poly three.js models can be fetched per film and used in any three.js-based
skill (low-poly skit, 3D diorama, survival, rules-horror, money-news…) instead of hand-modelling props, buildings,
vehicles and animals. Their licence forbids redistribution, so keep the `.mjs` files inside the film project, never
commit or publish them, and credit each model in the film's notes.

## QA loop (do not skip)
1. `--stills` at every beat → look at them (composition, text size ≥ 36 px, safe margins ≥ 96 px, nothing clipped).
2. Full render, then `out/qa/metrics.json` vs the style skill's **Target metrics** table (cuts/min, median shot, motion_mean, hold_frac, colourfulness, brightness, WPM, LUFS). Out of range → fix pacing/palette, not the targets.
3. Read `out/qa/strips.jpg` (8 fps filmstrips) to check easing and transitions look like the style's catalogue; `opening.jpg` for the hook.
4. Watch for: dead frames (> 2 s with no change unless the style holds), text appearing without motion, sfx without a visual, visuals that ignore the narration.

## Gotchas
- Everything must be a pure function of time: no CSS transitions/animations, no `setTimeout`, no `Math.random` (`X.rand(seed)`), no wall-clock.
- Workers start mid-timeline; GSAP renders children in order when jumping, so `.to()` chains are safe. Prefer `fromTo` for properties tweened more than once, and test `--stills` at out-of-order times.
- `morphSVG` cannot morph `<circle>/<rect>` — convert to paths first.
- `X.drawOn` replaces `stroke-dasharray`, so it cannot draw a dashed line: draw a solid copy inside a `<mask>` and
  apply the mask to the dashed line instead (or use DrawSVGPlugin on the mask path).
- Use `X.tl.set` (not `gsap.set`) for state that changes at a time; `gsap.set` only for the t=0 state.
- SVG rotation/scale origin: `transformOrigin: '50% 50%'` (own box) or `svgOrigin: 'x y'` (absolute) — not CSS `transform-origin`.
- Heavy SVG filters (blur ≥ 30, displacement on big groups) cost ~2–5 ms each per frame; fine, but rasterise static backgrounds as `<image href=X.paper(...)>`.
- HTML text (div) renders sharper for big paragraphs; SVG text for anything that moves with the camera.
- Mandarin (`zf_xiaobei`, `zf_xiaoni`, `zm_yunjian`, `zm_yunxi` …) and Japanese voices work but return no timestamps:
  tts.py then estimates per-character times across the voiced span (punctuation = short pause), so sync is approximate
  (±0.1 s); `X.word(id, '债务')` matches CJK words. Needs `ordered-set jieba pypinyin cn2an proces` in the venv
  (`uv pip install --python <venv python> --no-deps …`). WPM for CJK counts characters. For Chinese on-screen text
  set `<html lang="zh">` — only then does the runtime pre-load the 40 MB Noto Serif SC / Noto Sans SC faces.
- Hindi voices (`hf_alpha`, `hf_beta`, `hm_omega`, `hm_psi`, lang `h`) work with Devanagari text and also return no
  timestamps: tts.py estimates per-word times (±0.15 s). `X.word` keeps combining marks (`\p{M}`), so Devanagari
  vowel signs are part of the match. Romanised Hinglish belongs on screen, Devanagari in script.json.
- Kokoro speed is not linear (1.45 ≈ 258 wpm while speaking) and blurs above ~1.35; tts.py adds ~0.2 s around every
  line (0.06 s lead-in + 0.15 s tail kept from the trim), so a beat grid must subtract it from `gap`.
- `qa/analyze_video.py` measures on a 160×90 thumbnail, so 9:16 video is squashed: compare reels with reels, not with
  16:9 sources. One-frame white flashes count as cuts; a card's entry and exit count as separate scene changes only
  when they are ≥ 1.5 s apart.
- Kokoro mispronounces some acronyms/brands — spell them phonetically in script.json (e.g. "Ay Pee Eye"); numbers read fine as digits.
- CSS-3D planes (perspective + rotateX) larger than ~8000 px silently render black in headless Edge — keep tilted
  floors/maps ≤ 5600 px and scale the camera instead.
- WebGL works (three.js via ANGLE, even on an integrated GPU at ~15 fps 1080p): vendor the module into the project,
  create the renderer with `preserveDrawingBuffer: true` and call `renderer.render()` inside `X.every(t => …)` —
  no requestAnimationFrame loop. See the explainer-3d-diorama skill for the full route.
- A 404 for `favicon.ico` in the log is harmless.
