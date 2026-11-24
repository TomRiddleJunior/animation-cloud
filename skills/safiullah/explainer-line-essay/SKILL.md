---
name: explainer-line-essay
description: "Vertical 9:16 reel essays drawn live in one continuous take on a near-black boiling ground — a glowing pen with a spark at its nib draws hand-wobbly lines, machine lines rule themselves ruler-straight, every line carries a screen-aligned HALFTONE glow, tiny letter-spaced mono labels type on one character per frame (DEVIATION ×4, ±7.3 PX, x² + y² = r²), amber = human, blue = machine, white = unexamined, teal = everyone else; copies multiply into a solid, brackets snap and the camera dives in, the drawing turns into a head-and-shoulders person, karaoke captions (Poppins, grey → white per word) sit at 75 % height and a cream pill CTA pops under them before the last frame loops back to the first. Use for 'human vs machine / AI' motivational reels, 'line essay', 'drawn-live Instagram essay', 'glowing pen on black', 'minimal technical line animation with captions', 'imperfection is human' or any reflective 45–60 s TikTok/Reels/Shorts essay about one drawable idea. Builds on explainer-engine."
---
# Line-essay — glowing pen on black, one take, human vs machine

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A 45–60 s reflective essay told as **one continuous drawing**: the pen draws the human version of one simple thing live
(wobbly, white until examined, then amber), a mechanism draws the machine version (perfect, blue, 12 frames), the camera
dives back into the human one and *measures* its flaws with tiny engineering labels, the thing becomes a person, and a
quiet two- or three-word line lands under a lens flare before a pill CTA. Nothing ever cuts. Built from frame analysis
of 1 source reel (Instagram, i7_____nr, `De900n3zh4j`, 57 s; references/sources.md, references/analysis.md).
**Original work only**: your own drawable subject and script, never the source's circle story, comment-bait keyword
or affirmation offer. Format is **vertical 1080×1920, 30 fps** (16:9 notes in §9).

## 1. Signature traits
- **One take, zero cuts**: objects draw on, shrink aside, multiply, recolour, slide off, retract; the camera pushes,
  pulls and dives — scene_changes = 0, hold_frac ≈ 0.
- **The pen**: outline stylus at −58°, nib spark + glint only while drawing; it enters along its axis already drawing
  and lifts off the same way. Frame 0 = pen mid-stroke; the last frame matches it (seamless loop).
- **Halftone glow on every line**: blurred halo seen through a 6-px dot screen fixed to the frame (dots grow with
  intensity, don't scale on zoom) + tremor on human lines (±1 px every 3 px).
- **Semantic colour**: white (neutral) → amber (human, on the zoom back in) · blue (machine) · teal (others).
  97 % of every frame is near-black `#0c0e0f` with a faintly boiling mottle.
- **Engineer's annotation**: 18–22 px tracked mono caps typed 1 char / frame; readouts in px, ×, counts; crosshairs,
  brackets, deviation ticks, a tracer graph — and every number describes the drawing or a checkable fact.
- **Karaoke captions**: 2–7-word chunks, Poppins 54 px at 0.75 H, grey → white per word, bold keywords glow; 3-frame
  blur swaps.
- **Set pieces**: multiply-to-solid with a counter → bracket + zoom-through → three measured flaws → object becomes a
  bust → machine copy misses the "why" → flare + halo on the landing line → pill pop + flip → dissolve → pen loop.

## 2. Target metrics
Source: De900n3zh4j (57.0 s, 720×1280). Sample: `the sample film (the render is not included in this repository)` (56.7 s, 1080×1920).

| metric | source | target | sample |
|---|---|---|---|
| cuts_per_min / scene_changes_per_min | 0 / 0 | 0 / 0 | **0 / 0** |
| scene_len_median (s) | 57.0 (one take) | = runtime | 56.7 |
| motion_mean / p90 | 1.24 / 2.19 | 1.0–1.5 / 1.8–2.6 | **1.31 / 2.35** |
| hold_frac | 0.003 | ≤ 0.01 | **0.003** |
| colourfulness / saturation | 3.6 / 0.23 | 3–5 / ≤ 0.26 | 3.9 / 0.25 |
| brightness | 0.067 | 0.06–0.08 | 0.068 |
| flat_mean | 0.43 | 0.40–0.46 | 0.432 |
| WPM overall (while speaking) | 163 (196) | 155–170 (190–210) | **164** (208) |
| LUFS integrated | −14.1 | −14 ± 0.5 | **−14.1** |
| runtime (s) | 57 | 45–60 | 56.7 |

**Deliberate deviations:** the multiply beat is a full-frame mesh zoom (32 × 32 tiles), so motion decile 3 reads 2.5 vs
1.2 in the source — the mean still lands. `animated_frac` 0.88 vs 0.60 (flatness hovers just above the analyzer's 0.42
threshold; `flat_mean` matches). Labels stay 15–22 px although the engine's QA rule says ≥ 36 px: in this style they
are decorative readouts and the captions carry every word. About half of motion_mean is the boiling ground
(`K.ground`: blotch layer re-rolled at 7.5 fps, `boil` 0.27) — tune that first if motion is off.

## 3. Script formula
| % runtime | beat | sample "Desire paths" |
|---|---|---|
| 0–12 | **contrast-pair hook**: same object, human then machine | "This line was drawn by thousands of people who never met. And this is the path they were given." |
| 12–23 | **machine escalation** (perfect, repeated, copied) | "The paved one is perfect. Right angles, every time. The same plan, poured in park after park." |
| 23–41 | **the turn back to the human thing** + three flaws × three causes, each measured | cuts the corner (a diagonal is shorter) · bends where the rain collects · wider where strangers stepped aside |
| 41–52 | **uniqueness / authorship** | "Nobody planned it. Nobody voted on it. Each walker just pressed the grass a little flatter. Planners even have a name for it. Desire paths." |
| 52–62 | **turn to people + thesis** | "That's the thing about people. We don't walk where we're told. We walk where we mean to go." |
| 62–83 | **proof · the copy misses the why** | "A worn path is proof that someone was here… A plan can be copied anywhere. The reasons we walk can't." |
| 83–92 | **quiet landing line** (flare + halo) | "The straightest lines in a city are drawn by planners. The truest ones are drawn by people." |
| 92–100 | **CTA + loop** | "Follow for more things worth noticing." · pill `FOLLOW FOR MORE` → `✓ WALK YOUR OWN LINE` |

- 150–160 words for ~57 s; second person or "we", short declaratives, parallel triples, one inversion.
- **Kokoro**: `af_heart`, speed **1.06**, `gap` 0.32–0.42 per line, `lead` 0.3 (the pen is already drawing), `tail` 2.0
  (dissolve + pen return) → 164 WPM overall. A male alternative: `am_michael` at 1.04.
- script.json adds two caption keys per line (ignored by tts.py): `"chunks": ["line one|line two", "next chunk"]`
  (`|` = line break, ≤ 25 characters per line, words in order) and `"bold": ["word", "word:1"]` (`:n` = nth occurrence).
- **Facts in the sample** (all checkable): "desire path / desire line" is the planning term for an informal path worn by
  people choosing their own route; a square's diagonal is √2 ≈ 1.41 sides vs 2 sides along the edges (≈ 29 % shorter);
  trampling compacts soil and wears grass into a visible track. Every other on-screen number describes the drawing
  itself: 1,024 = the 32 × 32 tiles drawn, `DEVIATION 0.00 PX` (the ruled line is straight), `90°`, `a + b = 2.00` (unit
  square), `BEND ×3` / `WIDTH ×2` (amplification and lane width of the drawn path), `VOTES 0`. No statistics, no quotes.

## 4. Visual system
| role | hex | use |
|---|---|---|
| ground | `#0c0e0f`, blotches ±5, grain 2-px cells | stage + `K.ground()` (4 canvases, 7.5 fps) |
| neutral core / halo | `#efe8ec` / `#b4a9b0` | first drawing, puddles, unexamined |
| human core / halo | `#f5e8cf` / `#cfa874` | examined line, persons, flares |
| machine core / halo | `#cad5e4` / `#6a8aae` | ruled paths, scan heads, copies, street grid |
| others core / halo | `#d2f1e9` / `#4fbea5` | other people's attempts (use sparingly) |
| tile fill / line | `#121922` / `#3f5876` | the multiplied copies (fill only when tiny) |
| labels | `#ebe6ea`, dim `#8e8890`, amber `#f3dcae`, blue `#aec0d8` | mono readouts |
| caption on / off | `#fdfbfc` / `#5f5961` | karaoke |
| pill / ink | `#f2efe8` / `#151515` | CTA |

- **Type**: captions Poppins 400/700, 54 px, line pitch 69 px, block centre y = 1440 (0.75 H), max 25 chars/line ·
  labels Roboto Mono 500, 18–22 px (callout up to 30 px), letter-spacing 0.24 em, caps · counters Roboto Mono 36 px +
  14 px sub-label · pill Poppins 700 31 px caps, +0.045 em, 92 px tall, centre y = 1638 (0.853 H).
- **Line**: human core 2.4–2.6 px + under-stroke +2.8 px at 55 %; machine 1.6–2 px, butt caps, ruled bands of two lines
  18–30 px apart; footstep stipple dots r 1.35 alternating ±7 px every 14 px at 62 %.
- **Halftone** (`K.halftone`): blur 9 → alpha × 3.4 → dot tile 6 px (radial) → arithmetic threshold → slope 2.6 → colour
  of the blur → + soft bloom 2 px at 55 % → + source. Applied to the untransformed `#art` group so dots stay screen-fixed.
- **Grid**: art centre (540, 873) = 0.455 H; main object ≈ 0.45–0.52 W; labels 30–60 px off the object; nothing but
  thin lines right of x = 950 or under the caption block (y > 1330); pill and caption are the only things below 0.70 H.

## 5. Characters & objects (kit.js)
- `K.penDraw(g, t0, dur, {enter, exit, ease})` — the pen rides the head; consecutive draws < `enter` s apart make the pen
  hop from one stroke end to the next start instead of leaving.
- `K.stroke(parent, pts, {kind, w, minScreenW, steps})` + `K.hand(K.cl.line/arc/circle/bez/poly(...), {wob, trem,
  offset(u)})` — human line with tremor and a designed bend (`offset`). `minScreenW` keeps a pen-width on screen when
  the camera zooms far out. `steps:{spacing, offset, r}` = footstep stipple.
- `K.ruled(parent, polyline, {gap})` + `K.ruledAnim` — machine path (two crisp lines, mitred corners); `band.mid.pts`
  carries a scan head: `K.walker(parent, band.mid.pts, t, dur, {kind:'blue', trail:30, w:0.6})`.
- `K.bust(parent, cx, cy, {r})` + `K.bustDraw(b, t)` — head (pen) then neck + shoulders + arms both sides at once.
- `K.walker(parent, pts, t0, dur, {trail})` — comet spark (people walking, tracers, scan heads); linear speed.
- Marks: `K.label` (typed), `K.liveText` (counters), `K.crosshair`, `K.angleMark`, `K.brackets`, `K.ticks(ref, act)`
  (deviation ×amp), `K.ring`, `K.flare` (anamorphic streak + ring + chime).

## 6. Motion grammar
| move | GSAP ease | frames @30 |
|---|---|---|
| pen draws a long human line / circle | `sine.inOut` | 85–100 (2.8–3.3 s); short marks 12–25 |
| pen enter / lift-off along its axis | `power3.out` / `power2.in` | 12–14 / 16–18 |
| machine rule / sweep | `power2.inOut` | 12–25 |
| label type-on | linear, 1 char / frame | 4–20 |
| caption word grey → white | linear | 3 (glow 4) |
| caption chunk swap | blur 6 → out, 1 empty frame, blur 8 → in | 3 + 1 + 3 |
| push-in to a detail / pull-out | `power2.inOut` | 15–17 / 24–26 |
| zoom-through (brackets first) | `expo.inOut` + smear blur 3.5 | brackets 6 (`back.out(2)`), dive 12–14 |
| shrink-and-slide / figure move | `power2.inOut` | 18–27 |
| recolour white → amber | `power1.inOut` | 15 |
| collapse / undraw | `power2.in` | 12–17 |
| flare | streak `expo.out` 10, hold 13, fade 21 | — |
| pill pop / flip | `expo.out` 6 · scaleY 3 `power2.in` + 4 `back.out(1.7)` | — |
| dissolve to dots | dash pattern opens, fade | 20 |

Stagger 2–4 frames (ticks 0.4 f, copies by ring). Every mark lands on or 2–4 frames before its word. Holds 0.5–2 s,
never frozen (ground boil, walkers, tracer dots). Annotations of a beat vanish together in 1–2 frames.

## 7. Transitions (all in-camera)
1. **Live draw** — `K.penDraw`; the pen exits up-right. Opening + loop.
2. **Machine draw** — label → crosshair → `K.ruledAnim` + scan-head walker (0.6–0.9 s).
3. **Multiply to solid** — `<use>` tiles of a `<symbol>` (non-scaling strokes) revealed ring by ring as the camera
   log-zooms out (`K.camTo(..., {s: 0.0365, pin: original})`), fill-opacity rising as they shrink; counter = tiles
   shown; finish with a size label (`32 × 32`).
4. **Brackets + zoom-through** — HUD brackets track the original's screen box (`K.toScreen`), other tiles fade in
   5 frames, `K.camTo(t, 0.46, {..., s: 0.94, pin}, 'expo.inOut')` + `K.camBlur`.
5. **Push-in / pull-out** — `K.camTo` with `power2.inOut`; pull-outs bring walkers in from beyond the frame.
6. **Recolour** — `K.tint(g, t, 0.5, 'amber')` right after the zoom back in.
7. **Collapse into a person** — `K.anim(line, t, 0.55, 'collapse')` → `K.bustDraw`.
8. **Scan copy** — HUD scan rect descends linearly 0.95 s; copies draw as it reaches them.
9. **Landing** — `K.flare` + two `K.ring`s on the head / line end.
10. **Dissolve + loop** — `K.anim(g, DUR-1.7, 0.65, 'dissolve')`; a fresh copy of the opening stroke with
    `K.penDraw(loop, DUR-0.25, sameDur)` so the last frame equals frame 0.

## 8. Sound
- `sound.json`: `{"preset": "ambient-space", "key": 0, "sections": [{"t":0,"energy":0},{"t":<machine enters>,"energy":1},
  {"t":<CTA>,"energy":0}], "music_under_voice_db": -8, "duck_db": 3, "sfx_db": -6, "lufs": -14, "end_hit": true}` —
  no bed under the hook, a dark D-minor pad/bass bed from the machine's entrance (the source's 55/73 Hz drone), out at
  the CTA with the end pad + bell.
- SFX map: pen draw → `scribble` 0.16 (auto in `K.penDraw`) · label → `type` 0.07 (auto) · machine rule → `slide` 0.15 ·
  crosshair → `blip_up` · copies → rising `blip`s 0.07 · brackets → `click` (auto) · zoom-through → `whoosh` 0.38 ·
  push-in → `zoom_in` · pull-out → `woosh_low` · ticks → `tick` · ripples → `drop` · walkers → quiet `swoosh` ·
  flare → `chime` (auto) · dots / dissolve → `sparkle` · scan copy → `slide` + `shutter` · pill → `pop`, flip → `click` +
  `blip_up` (auto).
- VO: calm, close, unhurried — one breath after almost every sentence.

## 9. Build recipe
1. Copy `assets/template/` (index.html with `data-size="1080x1920"`, kit.js, scene.js, script.json, sound.json).
2. Pick one drawable subject with a human and a machine version; write ~150 words on the §3 beat map; add `chunks`
   and `bold` per line; run `ENGINE/make.sh <project> --draft --workers 3` (voice first) and read `data/vo.json`.
3. In scene.js: `K.setup()` → hook (`K.penDraw` from t = −0.25) → machine (`K.ruled`/`K.walker`/`K.label`) →
   escalation (`<use>` tiles + log-zoom) → `K.brackets` + zoom-through + `K.tint` → three flaws (one measurement
   each: `K.ticks`, a tracer graph, a bracket + px label; one `K.camTo` push) → crowd (`K.walker`s) → `K.bust` →
   machine copy vs the inner "why" → flare landing → `K.pill` → dissolve → pen loop → `await K.captions('script.json')`
   → `K.finish()` (always last) → `X.end(X.vo.duration)`.
4. `node ENGINE/render.mjs <project> --stills ...` at every beat, read the PNGs; then the full render with
   `make.sh <project> --skip-tts --workers 3` and compare `out/qa/metrics.json` with §2.
5. **16:9 version**: `data-size="1920x1080"`, stage/viewBox 1920×1080, then after `LineEssayKit(X)` set
   `K.FOCUS = {x: 700, y: 470}; K.CAP_Y = 900; K.PILL_Y = 1000;` and call `K.captions('script.json', {size: 52})`;
   keep the art in the left 2/3 with labels to its right, captions bottom-centre.
- Gotchas: tween a stroke's *outer* group opacity freely (the kit writes window opacity on `g.inner`); call `K.width`
  in time order; strokes nested in transformed groups still get a correct pen/walker position (`K.pointOn` uses CTMs);
  world strokes shrink with the camera — give long-lived lines `minScreenW`; the copy grid must be `<use>` +
  `vector-effect: non-scaling-stroke` or it vanishes at s ≈ 0.04.

## 10. QA checklist
- Stills: frame 0 (pen mid-stroke), each beat's peak, the multiply end, the zoom-through midpoint, the bust, the pill
  flip, the last frame (= frame 0). Look for labels touching the caption block or x > 950, leftovers from earlier beats
  (everything must vanish together), unreadable 2-px text, the pen occluding a label.
- Gates: cuts 0, scene changes 0, motion_mean 1.0–1.5, hold_frac ≤ 0.01, colourfulness ≤ 5, brightness ≤ 0.08,
  WPM 155–170, LUFS −14 ± 0.5.
- Do: draw every human thing with the pen, live; make numbers describe the drawing; one bright flare per beat at most;
  loop the ending. Don't: cut, fade between scenes, fill shapes, put big text in the art, copy the source's subject,
  keyword CTA or affirmation offer.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
