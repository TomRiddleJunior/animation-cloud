---
name: explainer-mark-rober
description: "Builds the animated/graphic layer of a Mark Rober-style engineering-build video in code: the 20–30 s \"whole plan\" animation, flat outline-free physics inserts on dusty sky blue with coral force arrows whose length is the quantity and one big white number with its unit conversion, red pointer arrows and handwritten formulas over (illustrated stand-in) footage, a GPS map tracker, CAD orbit flurries and translucent field-of-view volumes. Trigger on \"Mark Rober style\", \"like the egg drop from space / glitter bomb graphics\", \"CrunchLabs-style build video\", \"backyard engineering video animations\", \"terminal velocity diagram\", \"force arrows + big number\", \"red arrows on footage\", \"map with a moving GPS dot\", \"explain my build plan as an animation\", or any science/engineering YouTube build log that needs diagram inserts. Builds on explainer-engine."
---
# Mark Rober — the engineering-build animation layer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

The engineer's whiteboard, made to move: functional After-Effects-style inserts that appear only where a build stops
explaining itself (the plan, the physics, the tracking), then get out of the way. Flat, outline-free pictograms on one
dusty sky-blue field; coral arrows whose length is the data; a big white number; red arrows and white handwriting over
footage; honest engineering screens. Built from frame analysis of 2 source videos (references/sources.md; a third
listed source was a mislabelled RJMBricks upload and is excluded). Original work only — no logos, channel props,
sponsor segments, likeness or catch-phrases; invent your own build, people and place names.

## 1. Signature traits
- **Sky-blue flat field** `#86B3C7` (family #7AA5B8–#8FBDD1) with scalloped two-tone clouds; no outlines, no texture,
  no lighting; a green ground strip; one muted accent per object.
- **Coral force arrows** `#DD6751` (rect shaft + triangle head) that **grow from the body and whose length is the
  quantity** — equal forces → equal arrows; a 12.5× force is a 12.5× arrow. Max two caps labels per diagram.
- **One big white number** to the left of the subject: digits / UNIT / (conversion), snapped in with no ease.
- **One "whole plan" animation** (20–30 s) near the start: a tracking camera follows the payload through the plan with
  2–3 hard **scale cuts** to a close-up of the device.
- **Annotations over footage**: thick pure-red pointer arrows `#E8322A` popping on the spoken noun and drifting toward
  it; 2–3 white Caveat formulas 5 frames apart; a red X stamped on the target; "ATTEMPT 2" tags lower-left.
- **Honest engineering screens**: CAD orbit flurry (5–6 views × 6 frames), grey-stage translucent red FOV volumes,
  a neutral street map with a stepping GPS dot and a tiny joke disclaimer.
- **Every boundary is a hard cut.** No fades, no wipes, no overshoot on diagrams.
- Deadpan human beats: a held silence before the punchline, a lowercase mono caption on black to sign off.

## 2. Target metrics
Whole-video numbers come from live footage + graphics; the graphics-only column (same analyzer method, inserts
only) is what an animation-only build must match. QA compares the sample against the last column.

| metric | source whole video | source graphics only | target (animation layer) | sample result |
|---|---|---|---|---|
| hard cuts / min | 15.9–22.1 | 9.3–12.5 | 9–14 | 10.2 |
| median shot s | 1.9–2.4 | ≈ 4 | 2.5–4 | 2.9 |
| scene changes / min | 12.5–21.2 | — | 10–16 | 12.0 |
| motion_mean | 9.4–14.5 | 1.3–4.9 (pooled 4.85) | 2.5–5 | 3.65 |
| hold_frac | 0.07–0.16 | 0.22–0.77 (pooled 0.41) | 0.3–0.5 | 0.413 |
| colourfulness | 32.7–41.3 | — | 32–42 | 38.8 |
| brightness | 0.39–0.53 | 2D frames ≈ 0.78 | 0.6–0.75 | 0.71 |
| WPM overall | 168–195 | — | 170–190 | 176 |
| LUFS | −13.1 to −15.1 | — | −14 | −14.2 |
| graphics share | ≈ 10 % | — | 100 % (layer only) | 100 % |

Deliberate deviations: brightness is above the whole-video range because there is no dark onboard/night footage —
the source's own sky-blue frames sit near V = 0.78. Cut rate and holds follow the graphics-only column because the
user-facing deliverable is the animated layer. If you cut the inserts into real footage, place one every 30–45 s and
the whole-video columns apply.

## 3. Script formula
Presenter voice: upbeat, nerdy, joke-dense, first person. Kokoro **`am_puck` speed 1.1** (≈ 207 wpm while speaking,
≈ 176 overall with gaps 0.2–0.35 s; `am_michael` is the calmer fallback). One graphic event per noun or number.

| % runtime | beat | animation role | sample line |
|---|---|---|---|
| 0–10 | **Cold open on the payoff**: "This is X. And this is Y." | footage plate, red arrow on each noun (cut to a close-up on Y), formulas on "physics", red X on "right here" | "This is a ravine. And this is a pizza." |
| 10–14 | **Rewind**: "But first, we need to rewind a bit." | workshop footage, no graphic | — |
| 14–26 | Motivation + where | map: tight crop → hard-cut reframe; crow line, GPS dot steps the long way | "As the crow flies, a hundred and fifty meters. Driving around? Four kilometers." |
| 26–52 | **The whole plan** ("So here's the plan.") | flat world, rope/route draws, device hooks on, scale cut to close-up, tracking camera, sensor beam, payoff | "Near the end, a sensor spots a reflector, it brakes, and a winch lowers the pizza onto his deck." |
| 52–60 | Design | CAD orbit flurry → grey stage FOV volume + scale chip | "I designed it in CAD, sensor angled to catch the reflector ten meters out." |
| 60–88 | **The problem / physics** ("But here's what almost wrecked everything.") | physics insert: subject → force 1 → label → force 2 grows → label → big number | "Each end gets yanked with over twelve hundred newtons. Like two adults hanging off it!" |
| 88–100 | Failure for comedy → retry → sign-off | "ATTEMPT 1" plate + arrow, held silence (0.6 s), "ATTEMPT 2" plate, mono caption on black | "Which explains why attempt one ended up in the creek. … Attempt two? Hot pizza, delivered." |

Rules: inserts last one or two sentences (15–25 words); section handovers are spoken and land on a hard cut; numbers
must be correct — state assumptions on screen in small type ("(rope's own weight ignored)", "(Cd ≈ 0.8, sea-level air)").

## 4. Visual system
**Palette (K.C)** — sky `#86B3C7` / hi `#8FBDD1` / lo `#7AA5B8` · cloud `#DCEAF1` + `#EDF5F9` · ground `#567D64`,
dark `#47695A`, ravine `#3B5A4C` · force coral `#DD6751` · pointer red `#E8322A` · white `#FFFFFF` · figure skin
`#E8C8A0`, shirt `#9EA2A5`, trousers `#626669` · wood `#A38668`/`#7E644C` · landing pink `#CAA7C1` · map base
`#F2F2F1`, park `#C1DFB8`, water `#AFD3E2`, route orange `#F0782D`, home diamond `#3F6FE0` · CAD red `#C0392B` @ .4,
sensor yellow `#E8C21B`, stage `#6E6E6E→#B8B4B4`.

**Typography (sizes at 1080p, measured from source frames)**
| element | font | size |
|---|---|---|
| big number digits / unit / conversion | Montserrat 700 / 700 / 600 | 190 / 118 / 51 px font-size (≈ 135 / 83 / 36 px caps) |
| force labels (WEIGHT, TENSION) | Montserrat 700 caps, +1.5 tracking | 50 |
| scale chips (150 M, 3 M SAG, 10 M) | Montserrat 700 caps in `#1C2930` @ .82 chip | 22–34 |
| formulas on footage | Caveat 700 white + soft shadow | 86–96, rotated ±3–5° |
| footage tags (ATTEMPT 2) | Oswald 600 caps | 64, x 96 / y 990 |
| map labels / disclaimer | Inter 500 / 400 | 28–34 world units / 30 |
| sign-off | Roboto Mono 400 lowercase on black | 40 |

Composition: subject centred or slightly left, forces drawn through it, labels at arrow tips, big number at
x ≈ 330–660. Diagrams keep ≥ 96 px margins. **Flat layer: no texture, no grain, no vignette. Footage plates: grain
0.075, vignette .42, depth-of-field blur, warm light, handheld.** That contrast is what tells the viewer which is which.

## 5. Characters & objects (assets/kit.js → `window.K`)
- `K.figure({x,y,h,pose})` faceless pictogram, ~4 heads tall, rigid poses (stand / skydive / hang); act by rotating
  the whole group — no faces, no limb rigs.
- `K.cloud`, `K.clouds({n,speed,parallax,cam,axis})` scalloped puffs; horizontal drift 20–60 px/s in two layers;
  `axis:'y'` with −300…−600 px/s when the camera tracks a fall.
- `K.flatTree`, `K.flatHouse`, `K.balloon`, `K.groundStrip`, `K.skyField` — flat infrastructure icons.
- Your device: draw a flat pictogram version (primitives, 3–4 greys + one accent, a hanging payload group you can
  `rotate()` for pendulum swing) for diagrams, and a shaded "real" version for footage plates and CAD — never the
  cartoon in footage (see `flatRobot` / `realRobot` in the sample's scene.js).
- `K.forceArrow({x,y,angle,len,shaft,head,headLen})` → `a.to(t, dur, len, ease)` keyframes evaluated per frame
  (seek-safe). Pick one px-per-unit scale per diagram and derive every length from it.
- `K.bigNumber({x,y,value,unit,conv,size})`, `K.label`, `K.chip`, `K.streaks` (white flicker wedges trailing motion).
- `K.pointer(parent,{x,y,angle,len},t0,t1,drift)` red arrow, tip at (x,y); `K.formula` + `K.scribbleIn`;
  `K.redX` + `K.stamp`; `K.tag`; `K.caption`; `K.monoCard`.
- `K.cad3d(parent, parts, {grid})` flat-shaded pseudo-3D with dark edges, `render(yaw,pitch,scale,cx,cy)` and
  `project(p,…)`; parts `K.box`, `K.cyl`, `K.frustum` (translucent, no culling), `K.grid3d`; chrome `K.cadUI`
  (generic light modelling app) and `K.cadStage` (grey gradient).
- Map: `K.mapBase`, `K.mapRoad`, `K.mapLabel`, `K.houseDiamond`, `K.mapPin`, `K.gpsTrack(parent, pts, t0, step)`
  (route draws in GPS steps, pulsing ring), `K.disclaimer`. Draw your own neutral map — never a provider's tiles/style.
- Footage stand-ins: build the plate in a group with local `<defs>`, `await K.rasterize(group)`, then
  `K.footage(cam,{t0,t1,amp,push})` + `K.vignette`. Rasterising makes heavy blur/DOF free per frame.

## 6. Motion grammar
| move | GSAP ease | frames @30 | notes |
|---|---|---|---|
| force arrow appears (from body outward) | power2.out | 8–10 | label fades in 12–20 f **after**, on its word |
| resistance / tension arrow grows with the quantity | power1.in | 45–55 | the growth is the data; ends equal or at the true ratio |
| big number | none (set) | 0 | snap in; hold 1.5–2 s before the cut |
| pointer arrow | set + linear drift | pop 1 f, on screen ≥ 22 f | drifts 10–20 px toward the tip |
| formulas | linear slide-in from right | 3 f each, 5 f apart | then hold ~10 f+ |
| red X stamp | none, scale 1.2 → 1 | 3 | `stamp` sfx |
| camera tracking / pans | none (linear) or sine.inOut | — | camera locked on the payload, clamp at world edges |
| payload accel / brake | analytic (constant accel / decel) | 18–30 | write x(t) as a pure function; pendulum swing = damped sine |
| winch / lower | sine.inOut | 45 | ticks while lowering, `ding` on touchdown |
| map GPS step | steps (set per fix) | one fix every 12–16 f | `blip` per fix, ring pulse 0.8 s |
| CAD flurry | hard set per view | 6 per view, 5–6 views | final view slow orbit 6–9 °/s |
Build-on order: scene → subject → force 1 → label → force 2 → label → number, each on its word (0.5–1.5 s apart).
**No overshoot, bounce or elastic on any diagram element.** Idle life on held diagrams = drifting clouds + a gentle
pendulum on hanging payloads; never wobble the diagram itself.

## 7. Transitions
| # | name | build | frames | when |
|---|---|---|---|---|
| R1 | hard cut footage → graphic | `X.scene(name,t0,t1)` boundaries; graphic complete on its first frame; `K.cut(t,'whoosh')` | 0 | every insert entry, on "So…/And…/But…" |
| R2 | look-alike exit | end a sky insert on a real-sky plate of the same colour | 0 | ≈ 40 % of exits |
| R3 | tracking ascent / traverse | world group transform follows payload x/y each frame; clouds parallax 0.25/0.45 | 5–8 s | once in the plan |
| R4 | scale cut | separate close-up scene of the device (rope marks + clouds streaming at 900–1100 px/s, streaks) | 0 | 2–3 per plan; `zoom_in`/`zoom_out` sfx |
| R5 | wide strip | very wide cross-section + dashed reference line + scale chip | 4–6 s | rare |
| R6 | map reframe | tight crop with slow sine push → hard cut to the wide route; GPS steps | 10–15 s | tracking beats |
| R7 | CAD orbit flurry | `cad.render()` at 5–6 views, 6 f each, `click` per view | 30–36 | design beats |
| R8 | sketch scan hold | paper image letterboxed on black, 3 % push | 30–60 | before CAD |
| R9 | annotation pop | pointer / formula / X appear in 1–3 f, no blur | — | hook and reveal |
| R10 | multi-cam grid | 2–4 plates tiled edge to edge, captions underneath | long | climaxes (no graphics) |

## 8. Sound
`sound.json`: `"preset": "playful-bounce", "bpm": 118`, sections follow the story — 2 (cold open) → 1 (rewind / map)
→ 2 (plan, CAD) → 1 (the problem) → **3 on the big number** (auto riser + impact) → 1 (failure gag, silence beat)
→ 2 (retry) → 0 (sign-off, `end_hit`). `music_under_voice_db −17`, `duck_db 7`, `sfx_db −3`, `lufs −14`.
SFX map: graphic entry `whoosh` (soft, .18–.22) · scale cut `zoom_in` / back `zoom_out` · pointer `pop` (pitch 1.15) ·
formulas `scribble` · X `stamp` · rope/route draw `swoosh` · device hooks on `click` + small `boing` · GPS fix `blip` ·
sensor `blip_up` · brake `slide` (pitch .6) · winch `tick`×6 · touchdown `ding` · CAD view `click` · arrow appears
`pop` · arrow grows `riser` (its duration) · label `tick` · anchor yank `thud` · big number `ding` · failure `bubble` ·
success `success`. ~1 cue per second of graphics is right; never an sfx without a visual.

## 9. Build recipe
1. Copy `assets/template/` (it runs as-is: a footage plate with pointers + a terminal-velocity insert) to your project.
   `kit.js` must sit next to `index.html` (the renderer only serves the project folder) — copy it from `assets/kit.js`.
2. Invent a physically sensible build. Do the maths first and write it in the scene.js header comment
   (sample: T = W / (2 sin θ), W = 98.1 N, 3 m sag on 150 m → 1227 N = 276 lbf = 12.5 W).
3. Write `script.json` to the beat map (§3); run `engine/make.sh <proj> --draft` once to get word times.
4. In `scene.js`: build the cut list `T` from `X.line/X.word` (every key is a hard cut), then one block per beat:
   plates (`plate()` helper pattern from the sample: draw → `K.rasterize` → `K.footage` → overlays), map
   (`K.gpsTrack`), plan (flat world + `x(t)` pure functions + camera in `X.every`), close-up scene for each scale cut,
   CAD (`K.cad3d` + `K.cadUI` / `K.cadStage`), physics insert (`K.forceArrow` lengths from one px-per-unit scale,
   `K.label` ×2 max, `K.bigNumber`), ending plates (`K.tag`, `K.pointer`), `K.monoCard`.
5. `sound.json` sections from the cut list (§8). `node engine/render.mjs <proj> --stills …` at every beat; look.
6. `engine/make.sh <proj> --skip-tts --workers 3`; compare `out/qa/metrics.json` with §2.

## 10. QA checklist
- Stills: first frame (t = 0) is the cold-open plate, not the empty stage; each pointer tip touches its noun; arrow
  lengths match the stated ratio (measure them); ≤ 2 labels per diagram; big number not colliding with the subject.
- Metric gates (§2): cuts 9–14/min, hold 0.3–0.5, motion 2.5–5, WPM 170–190, LUFS −14 ± 1.
- Gotchas found building the sample:
  - A `tl.set(...)` at exactly t = 0 does not render on `seek(0)` — `gsap.set` the first scene (and grain) visible.
  - GSAP `x/y` on an SVG element that has a `transform` attribute **replaces** that translate — animate a wrapper `<g>`.
  - Clean static vector frames diff to exactly 0 → hold_frac explodes. Give held diagrams two cloud layers at
    30–60 px/s and payload sway; give plates handheld amp ≈ 10 px and a 4–8 % push.
  - Same-colour cuts (sky → sky scale cuts, CAD views) are not counted as cuts by the analyzer; extra footage cuts
    on nouns (wide → close-up) are what move the cut rate.
  - Rasterise footage plates (blur filters per frame cost 5–10 ms); keep animated bits in a `live` group above.
- Do: animate only what the narration names, in its order; show real tools (CAD, map) honestly; keep jokes small.
- Don't: outlines, gradients or shading on flat shapes; faces on figures; fades between beats; graphics on the
  climax; copying any channel's logos, props, sponsor reads or map provider styling.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
