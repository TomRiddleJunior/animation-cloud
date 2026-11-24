---
name: explainer-veritasium
description: "Animated diagram / simulation inserts in the manner of a presenter-led science channel (Veritasium-like) — hard cuts from live action into a clean, self-contained model that builds step by step with the narration; thin lines, 3–4 colours with fixed meanings, long holds, motion only when a new fact is stated; looks = glowing field simulations on black, algorithm graphs on a navy map, or a retro pixel game-show. Use it for \"Veritasium style\", \"science YouTube animation\", \"explain this physics/maths idea with a simulation\", \"field lines / waves / interference / algorithm visualisation\", \"animated insert for my explainer\", \"2swap / 3D wave sim look\". Simulations are real maths computed per frame. Builds on explainer-engine."
---
# Veritasium-style animated inserts

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A curious first-person narrator stops a story to *show the mechanism*: the picture cuts hard (on a sentence start) from
a presenter or archival shot to one persistent, diagrammatic model that stays on screen for 10 s – 3 min and changes
only when the narration states a new fact. There is no house look — each film commissions one of three looks (A retro
game-show, B glow sim on black, C algorithm on a navy map); the **grammar** is what stays constant. This skill builds
the animated layer only (no presenter, no channel branding); grey B-roll cards mark where live action would sit. Built
from frame analysis of 3 source videos (references/sources.md). Original work only — never the channel's logo, the
"Ve" mark, its wireframe-terrain outro, or its characters.

## 1. Signature traits
- **Insert grammar**: hard cut in/out on the first word of the sentence that introduces the model; no wipes, no logo stings.
- **One persistent model per block**; new facts are *added to it* (a point, two paths, a label) rather than cutting away.
- **3–4 saturated state colours with fixed meanings for the whole film**, everything else white/grey (table in §4).
- **Thin line work**: 2.5–3 px edges, 18–40 px nodes, small filled arrowheads, sine envelopes of 2–3 px arrows.
- **Narration-locked motion**: a change lands 0–6 frames *after* its noun; between facts the frame holds 2–10 s.
- **Real data / real maths**: a field from an actual formula, an actual algorithm trace, counters with true counts.
- **Slow, countable steps, then a speed ramp** (expo) with a counter to show scale.
- **Change of scale is the only camera move** (pull-out / tilt / zoom to a point), power2.inOut, 1–1.5 s.

## 2. Target metrics
QA (`out/qa/metrics.json`) compares against this. Whole-film numbers include 50–60 % live action; the animation-block
column is the same analyzer run on the lecture blocks only (references/sources.md).

| metric | source whole film (3 videos) | source anim. block (B elec. / A game th.) | target for a 45–90 s insert block | sample |
|---|---|---|---|---|
| scene changes / min | 6.2 – 10.1 | 0.4 / 5.4 | 6 – 10 | 8.38 |
| hard cuts / min | 5.4 – 8.8 | 0.4 / 4.8 | 4 – 8 | 5.86 |
| cuts in first 15 s | 6 – 9 | — | 3 – 6 (front-loaded hook) | 4 |
| median shot s | 3.3 – 4.2 (p90 13–20) | — | 4 – 6 (p90 15–20) | 5.0 (p90 17.7) |
| scene_len_median s | 3.3 – 4.2 | — | 4 – 7 | 5.3 |
| motion_mean | 5.1 – 6.7 | 3.2 / 3.2 | 3.5 – 6 | 4.48 |
| hold_frac | 0.12 – 0.30 | 0.21 / 0.33 | 0.20 – 0.40 | 0.39 |
| colourfulness | 30.7 – 50.3 | 28.5 / 98.9 | look B 25 – 35 · look A 60+ | 27.3 |
| brightness | 0.39 – 0.53 | 0.17 / 0.73 | look B 0.14 – 0.22 | 0.173 |
| WPM overall | 160 – 179 | — | 160 – 180 | 165.9 |
| LUFS | −13.4 … −15.9 | — | −14 … −16 | −15.1 |

Deliberate deviations: brightness/colourfulness follow the *animation block* of the chosen look, not the whole film
(look B is near-black: 0.17 measured). hold_frac sits at the top of the range because the style holds while the
narrator explains (freeze-time, graph read-out, single photons) and thin-line build-ons do not register as motion in a
full-frame metric; motion_mean is between the block (3.2) and the film (5–7). Scene changes are condensed (a real
lecture block has ~0.4/min) because a 70 s sample must also carry the hook.

## 3. Script formula
Voice: Kokoro `am_michael`, speed 1.10–1.13, gaps 0.25–0.5 s, lead 0.4, tail 1.0 → ~190 wpm speaking, 160–170 overall.
Conversational, curious, first person ("still messes with my head", "let's model…"), short declaratives, one question.

| beat | % of block | what happens on screen | sample line |
|---|---|---|---|
| live-action lead-in | 0 – 5 | grey B-roll card (presenter) | "Here's an experiment that still messes with my head." |
| hook: setup + paradox | 5 – 20 | 3–5 hard cuts between 2–3 screens of the same apparatus, split screen for "A vs B" | "Shine light through one narrow slit… open a second slit… parts of the wall get darker." |
| the question | 18 – 21 | hold on the comparison | "More light, less brightness. How?" |
| model build | 20 – 40 | cut to the simulation; name each element as it appears (labels in its colour) | "Let's model light as a wave: crests in red, troughs in blue…" |
| mechanism | 40 – 65 | freeze / zoom to one point; add geometry; slow countable steps | "Freeze time and pick a point on one…" |
| payoff (60–80 %) | 65 – 75 | answer the hook question on the same model, then a graph | "Average over time… the dark spots are dimmer than one slit alone." |
| twist + scale | 75 – 92 | slow steps → expo speed ramp + counter | "Send light through one photon at a time… after thousands of them…" |
| cut back to live | 92 – 100 | B-roll card, wider moral / open loop | "…depends on both slits being open." |

Hook patterns from the sources: thesis + 0.5–2 s montage; thought experiment + quiz card (answer at ~80 %); absurd
number + "So how is that possible?". Keep facts verifiable; no invented statistics or quotes.

## 4. Visual system
Colour roles (`V.C`) — fixed for the whole film, ≤ 4 saturated hues per screen:

| role | hex | meaning |
|---|---|---|
| bg (look B) | `#111113` (canvas black `#000`) | stage |
| navy / navyDeep (look C) | `#0D124C` / `#070B30` | map tint, graph stage |
| ink | `#ECEDEF` | text, nodes, geometry lines |
| grey / dim | `#7C8090` / `#3A3D45` | reference curves, nodal lines, inactive edges |
| silver | `#D6D8CF` + glow | apparatus, wire, frames |
| red | `#E8433A` | + / crest / active / current node / frontier |
| blue | `#2A86D9` | − / trough / second field / second search |
| yellow | `#F0B53C` | brightness, energy, intensity, goal, highlight |
| green | `#2E9E7A` | settled / done (algorithms) |
| card / cardInk | `#5C5E62` / `#93959A` | B-roll placeholder only |

Typography (engine fonts): labels **Oswald** 500 caps 36–44 px, letter-spacing 2; maths **Libre Baskerville** italic
40–52 px with symbols coloured like their objects (`V.math`); axis titles Libre Baskerville italic 40 px; counters
Oswald 64–76 px (label 36 px grey caps above); map captions Caveat 60–80 px (look C). ≤ 6 words per screen.
Light: glow comes only from light (canvas bloom = blurred `screen` copy; `V.bloom` on strokes); no decorative gradients,
no grain. Composition: one model centred, 60–80 % of width, labels next to objects (no legends), 96 px safe margins.
Looks A/C: A = CRT-masked cyan/pink arena, pixel font, bean people with hat identities (analysis §6, §11 — not in the
kit); C = OSM/satellite raster under a 0.75–0.85 navy multiply, white nodes with serif numerals, handwritten caption.

## 5. Objects & kit functions (`assets/kit.js`, global `V`, needs explainer.js)
| graphic type | kit | notes |
|---|---|---|
| wave / scalar field sim | `V.waveField({lambda, groups, box, step})` + `V.canvasLayer({res, bloom})` + `V.renderWaves(L, cam, F, st)` | Huygens sum per slit, phasors precomputed per grid cell, so a frame is O(pixels): value = Σ C cos ωτ + S sin ωτ; `mix` 0→1 cross-fades to the time-averaged intensity (yellow). Fronts `r < λ(τ − τ_on)`, plane incident wave, wall glow. 640×360 canvas ≈ 30 fps render with 3 workers |
| sim time | `V.simClock([[t, rate], …])` | exact ∫rate: slow-mo, speed-up, freeze (two keys at one t, rate 0). Add a phase offset (time-origin shift) to land a freeze on a crest |
| 3D-ish camera | `V.planeCam({ox, oy, z, pitch, rot, D})` | tilted plane, project/unproject; tween its fields on `X.tl`; the canvas renderer and SVG overlays share it |
| field lines / vectors | `V.fieldLine(E, seed, {step, stop})` (RK4) · `V.arrows(parent, n)` | arrays of 2.5 px arrows whose length = field value along a path, colour = sign, + points screen-up |
| nodal / special curves | `V.hyperbola(A, B, Δ, xs, side)` | `|PA| − |PB| = Δ` by bisection |
| particles on a simulation | `V.flowParticles(parent, lines, {speed, t0})` · `V.sampler(pdf, x0, x1, seed)` · `V.hitLayer(pts, {lead, under})` | ride computed streamlines; Monte-Carlo hits drawn from the computed intensity, first n narrated hits as solid dots |
| graphs with labelled axes | `V.axes(parent, {x,y,w,h,xr,yr,xLabel,yLabel,xTicks,t})` · `V.plot(ax, f|pts, {color,dash,glow})` · `V.reveal(el, t, dur, box)` | axes draw 0.4 s, titles typed; curves revealed left→right linearly (works with dashes) |
| node-edge algorithms | `V.graph(parent, nodes, edges, {weights, labels})` · `V.dijkstra(n, edges, src)` · `V.playTrace(G, steps, times)` | states snap: idle · frontier · current (red + halo) · settled (green) · goal (yellow) · dim |
| step counters | `V.counter(parent, {label, x, y})` · `V.rampCount({slow:[t…], t0, dur, n1})` | narrated steps at explicit times, then `2^(k(p−1))` ramp |
| detector / screen glow | `V.profileGlow(parent, box, I, Imax, {gamma, sigma, bloom})` | a 1-D intensity drawn as a glowing band; stack two and cross-fade |
| labels | `V.label` · `V.callout` (label + leader + dot, `move()` per frame) · `V.math` · `V.type` | typewriter 30 cps for words; maths snaps on (typeOn would destroy tspans) |
| live-action placeholder | `V.brollCard(t0, t1, {text, drift})` | grey card + faint drifting hatch standing in for footage motion |
| visibility windows | `V.showAt(el, [[t0,t1], …])` | a model that returns after a cut-away |
| spotlight | `V.dim(el, t, 0.25)` or `st.dim` on the field | dim-to-focus in 4–6 frames |

## 6. Motion grammar
| move | GSAP / kit | frames @30 | when |
|---|---|---|---|
| state change (colour, node state, label value) | `X.tl.set` (snap) | 0 | every algorithm step / discrete fact |
| marker / node pop | `back.out(1.4)` scale or `attr:{r}` | 4–6 | new point, new node |
| label | `V.type` 30 cps | ~8 per word | when the word is said (+2 frames) |
| line / path draw | `X.drawOn(…, 'none')` or progress proxy | 12–27 | geometry, field lines (stagger 2–3 frames) |
| data curve | `V.reveal` linear | 40–60 | graphs |
| camera change of scale | `power2.inOut` on `planeCam` | 30–45 | tilt 3D→top-down, zoom to the probe point and back |
| cross-fade field → average | linear `mix` | 18–24 | "average over time" |
| speed ramp | `V.rampCount` expo (k≈9) | 60–90 | after 3–8 slow narrated steps |
| idle | physical only: travelling waves (sim clock), particles on streamlines | — | never bobbing, drift or parallax |

Holds: 2–10 s on a settled frame while the narrator explains. Slow algorithm steps 0.5–1 s each; arrivals countable
(1/s → 10/s) before the ramp. Animation trails the noun by 0–6 frames.

## 7. Transitions
| name | build | frames | use |
|---|---|---|---|
| hard cut live ↔ animation | scene windows starting at `X.line(id).start` / a clause start (`X.word(id,'and')`) | 0 | ~90 % of entries/exits |
| hard cut between screens of one model | `V.showAt` windows on schematic / face-on / split groups | 0 | hook montage, returns |
| split screen | two copies + dashed vertical divider (`stroke-dasharray 16 14`) | 0 (or 6 f slide) | "one slit vs two", "A vs B" |
| continuous 3D camera move | tween `cam.pitch/rot/z/ox/oy` | 36–45 | 3D intro → top-down working view |
| zoom to a point | tween `cam.z/ox/oy` | 30 | freeze-frame analysis |
| tint / field cross-fade | `st.mix` 0→1 | 18–24 | wave → time-average, map ↔ graph |
| dim-to-focus | `st.dim` 1→0.42 or `V.dim` | 5 | spotlight geometry over the field |
| label wipe / typewriter | `V.type` | 6–10 | names, titles |
| motif return | same box/colours as earlier screen (`R` reused) | 0 | the wall in the hook returns as the photon screen |

## 8. Sound
`sound.json`: `ambient-space` (or `doc-pulse`) at energy 1 throughout, energy 2 only under the speed ramp, 0 at the end;
`music_under_voice_db −21`, `sfx_db −5`, `lufs −15`, `end_hit true`. SFX only on new facts, gain 0.2–0.35:
light on → `click`; slit opens → `slide`; ring / new state → `blip`; labels named → `tick`/`tock`; source starts →
`blip_up`; camera change of scale → `woosh_low`; freeze → `tock`; probe point → `pop`; arrow arrays → `swoosh`;
cancels → `blip_down`; doubles → `blip_up`; first 6 hits → `tick` (falling gain); ramp → `riser`; pattern confirmed →
`chime`. ~1 cue per 2 s on average, none on hard cuts.

## 9. Build recipe
1. `cp -r assets/template <project>` (index.html, scene.js, kit.js, script.json, sound.json). Keep `kit.js` inside the
   project — the renderer only serves the project and `/engine/`.
2. Write `script.json` with the beat map (§3); run `ENGINE/audio/tts.py <project>`; tune `speed`/`gap` until
   `tts.py` reports 160–180 wpm overall.
3. In `scene.js` derive every time from words (`X.word`, `X.line`), as in the sample's `T = {...}` table.
4. Hook: 2–3 screens of the same apparatus with hard cuts on clause starts (schematic ↔ face-on ↔ split). Make the
   screens differ in large-area colour (e.g. a full-width glow vs a black schematic) or the scene metric will not see them.
5. Model block: `V.waveField` + `V.canvasLayer` + `V.renderWaves` driven by `V.simClock`; overlays (barrier, probe,
   arrows, hyperbolas, labels) projected through the same `V.planeCam` inside one `X.every`.
6. Mechanism: freeze (rate 0) + zoom + dim; probe geometry; `V.arrows` along both paths; a 3-bar read-out.
7. Payoff graph: `V.axes` + `V.plot` + `V.reveal`, rings on the points that answer the question.
8. Scale: `V.sampler` + `V.hitLayer` + `V.rampCount` + `V.counter`; reveal the predicted curve over the hits.
9. `ENGINE/make.sh <project> --skip-tts --workers 3`; read `out/qa/metrics.json`, `timeline.jpg`, `strips.jpg`.
Sample: `assets/sample/` (two-slit interference → single photons, 71.6 s).

## 10. QA checklist
- Stills at every beat (`render.mjs --stills`): labels ≥ 36 px, next to their object, ≤ 6 words; no legend boxes.
- Every colour keeps its meaning on every screen (red is never decoration; yellow always = brightness/energy).
- Physics check: the overlay geometry must sit on the computed field (nodal curves on the dark lanes, the probe's
  two arrows exactly opposite at a dark point). Narration states only what the model shows.
- Metrics vs §2: scene changes 6–10/min, cuts ≥ 3 in the first 15 s, WPM 160–180, LUFS −14…−16.
- Gotchas found building the sample:
  - SVG filters on perfectly vertical/horizontal lines make them vanish (zero-width bbox): use `V.bloom(id, std, true)`.
  - Canvas layers sit *under* the SVG — an opaque SVG rect hides them (hide it or draw the backdrop with `under`).
  - `X.pop` on an element repositioned in `X.every` scales about a stale origin; tween `attr:{r}` instead.
  - `X.typeOn` replaces textContent — never type a `V.math` label.
  - A `tl.set` at exactly t = 0 does not render on the first seek; `gsap.set` the initial state (`V.brollCard` does).
  - The motion / hold metrics are full-frame means at 160×90: thin build-ons register as holds.
- Do: hard cuts on sentence starts · persistent model · freeze to explain · slow steps then ramp · real numbers.
- Don't: decorative motion, camera drift, mixed looks, thick outlines on diagrams, tweened discrete states,
  gradients as decoration, cut away from a model in under ~10 s, channel logos/outros.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
