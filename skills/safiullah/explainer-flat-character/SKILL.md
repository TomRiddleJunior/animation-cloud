---
name: explainer-flat-character
description: "VO-led 2D flat illustrated product explainer told through characters — a relatable protagonist with a problem, the product as the turning point, a visual metaphor that makes the benefit concrete, a happy resolution and a logo + CTA resolve — in the soft pastel \"grain-gradient\" look (stippled highlight fills, rounded shapes, simple-faced cut-out characters, lavender blobs, continuous morphs/whips/iris wipes). Use when someone asks for a flat character explainer, animated SaaS/app/startup explainer, \"Loomly-style\", \"Ahrefs-style\", \"Breeze-style\", \"like those agency explainer videos\", a character-driven product video, problem→solution animation, or a 45–90 s pastel 2D promo with a friendly narrator; also covers the outlined line-icon dialect (5 px navy stroke) as a style swap. Builds on explainer-engine."
---
# Flat character explainer (grain-pastel)

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A 50–75 s narrator-led explainer drawn as **one illustrated vignette per VO sentence on a light ground, each changing
into the next by a continuous move** (pull-back, whip-pan, push-through, colour iris, shape wipe) — almost never a
hard cut. Characters are slim cut-out puppets with dot eyes and no outlines; every fill's lit side dissolves into
1–2 px stipple grain. The story is **problem → turn → product → features → resolution → proof → logo/CTA**, carried
by one protagonist and one visual metaphor (here: invoices behave like a wandering flock; the product is the pup that
herds them home). Built from frame analysis of 3 source videos plus one poster (references/sources.md); the grammar
comes from the Loomly film, the line-icon swap from Ahrefs, the metaphor idea from the Breeze poster. **Original work
only** — own characters, own brand, own metaphor; never copy logos, mascots, taglines or real icons.

## 1. Signature traits
- **Grain-gradient fills**: base colour + a highlight copy whose gradient is thresholded against static noise
  (`K.gshape`), so highlights dissolve into stipple. No outlines, no glossy gradients, no drop shadows.
- **Pastel palette on near-white**: ground `#fbfaff`, lavender blob behind every vignette, one dark anchor (teal
  `#2f716b`), accents coral/peach/butter/mint < 5 % of pixels each.
- **Cut-out characters** ~7 heads tall, small heads, dot eyes, brow strokes, tiny nose line, blush, hair as one dark
  mass with 2 white highlight strokes; one emotion per beat, a 3-key gesture, auto blink + breathe; speech bubbles
  carry inner monologue (no lip-sync).
- **One centred vignette per sentence** on an amoeba blob that slowly morphs; 50–60 % empty ground.
- **Continuous canvas**: pull-back from a texture to open, whip-pans with 2–3 blank frames, push-through into an
  element until the frame is a flat colour field, colour iris into the pivot, shape wipe back out.
- **The noun drives the pop**: objects, badges and bubbles overshoot-pop (back.out ≈ 2) on the word that names them.
- **One colour-field scene** (teal) for the pivot question + product name; logo resolves on the light ground.

## 2. Target metrics
| metric | source range (Loomly · Ahrefs · Dropbox) | target | sample (Tallypup) |
|---|---|---|---|
| scene_changes_per_min | 4.99 · 1.98 · 11.25 | 4–11 | 7.63 |
| scene_len_median s | 7.5 · 23.2 · 3.2 | 4–8 | 5.17 |
| cuts_per_min | 0.83 · 1.98 · 4.5 | 0–2 | 0.0 |
| motion_mean | 8.3 · 2.9 · 11.1 | 3–9 | 4.7 |
| hold_frac | 0.076 · 0.337 · 0.075 | 0.07–0.35 | 0.093 |
| colourfulness | 40.1 · 31.9 · 69.8 | 30–45 | 33.0 |
| brightness | 0.93 · 0.85 · 0.72 | ≥ 0.85 | 0.906 |
| WPM overall | 139.8 · 135.7 · 172 | 135–145 | 138 |
| LUFS | −17.7 · −12.4 · −10.9 | −14 to −16 | −15.1 |
| logo tail after last VO | 7.2 s · 6 s | 6–8 s | 6.6 s |

Deliberate deviations: **motion 4.7 < Loomly 8.3** (inside the analysis range; our whips are 0.27 s and characters
idle gently — lengthen whips/push-throughs or add camera travel to raise it). **Scene changes 7.6 > Loomly 5.0**
because a character story needs more vignettes than a feature list. **Characters on screen ~80 %** (Loomly ~20 %):
asked for character-driven; keep UI vignettes for the feature beats.

## 3. Script formula
| % runtime | beat | pattern / sample line |
|---|---|---|
| 0–2 | canvas wakes | pull-back from a texture; VO starts in the first second, no title card |
| 0–25 | **problem** via the protagonist | "Meet Maya. She draws beautiful things for a living. But the hardest part of her week isn't the drawing. It's getting paid." then 3 pains as questions → 3 bubbles |
| 22–33 | **metaphor** | "Her invoices act like a flock of sheep. They wander off, and Maya spends her evenings chasing them." (abstract pain → concrete picture; Breeze: football for cybersecurity) |
| 33–40 | **pivot + name** on the colour field | "So what if someone else did the chasing? Meet Tallypup." |
| 40–65 | **features**, one sentence/clause each, parallel grammar, each its own vignette | "sends each invoice… / follows up with friendly reminders… / lets clients pay in a single tap. / Every payment lands in one tidy dashboard…" |
| 65–74 | **resolution = metaphor payoff** | "Now the flock comes home on its own, and Maya gets her evenings back." |
| 74–83 | **proof** crowd + result bubbles | "Freelancers everywhere are spending less time on admin…" (no invented statistics) |
| 83–100 | **CTA + logo** (VO ends 6–8 s before the end) | "Tallypup. Invoices that come home. Try it free today." |

Kokoro `af_heart` (warm, friendly), speed **0.92**, gaps 0.3–0.7 s (0.6–0.7 before a vignette change), `lead` 0.9 →
~184 wpm while speaking, **≈138 overall** with a 6.6 s logo tail. ~145 words for 63 s. Natural read, never hard-sell.

## 4. Visual system
| role | hex | use |
|---|---|---|
| ground | `#fbfaff` | every light vignette |
| blob / blob2 | `#efedfb` / `#e6e3f8` | morphing amoeba behind each vignette (60–85 % W) |
| dark anchor | teal `#2f716b` (mid `#4e9a85`, hi `#8fd0b4`) | desks, monitors, the pivot colour field, wordmark |
| primary character | lavender `#9a8de3` / hi `#cfc8f6` | the protagonist's sweater (one hero colour all film) |
| accents | coral `#ef8f7a`, peach `#f3bd93`, butter `#f5d07a`, green `#5cb27a`, mint `#e3f3dd` | badges, bubbles, props |
| hair / ink text | `#2b2420` / `#24423e` | |
Typography: **Poppins** (engine font) 600–700; bubbles 34–36 px white on green/teal; headline 92 px two lines,
key word in butter; UI labels ≥ 32 px (use grey bars for fake text); wordmark lowercase 150 px teal with stroke
draw-on; tagline 46 px 500. Shapes: rounded rects r 12–36, circles, pills, amoeba blobs, rolling grain hills.
Texture: grain only via `K.gshape` highlights (static per shape — never crawl). Composition: one centred vignette,
safe margin ≥ 96 px, characters on thirds, bubbles at 10/2/7 o'clock around the head. Give **each vignette a distinct
coloured mass** (teal desk, mint hills, teal field, mint phone field, warm sunset sky) — light-only vignettes look
alike and undercount scene changes.

## 5. Characters & objects (assets/kit.js)
- `K.character(parent, {x,y,scale, skin, skinShade, hair, hairStyle: long|bob|bun|short|curly|wrap, top, topHi, bottom,
  bottomHi, sleeves, look -1..1, beard, glasses, pose, mouth, eyes})` → rig. Origin between the feet, 400 units tall
  (hero waist-up ≈ scale 2.2, full figure 1.2–1.5). Pivot groups: hips→knees, torso (lean), head (tilt, `look` shifts
  the face for a 3/4 turn), shoulders→elbows→hands. Poses: `idle talk explain point pointL celebrate slump headHold
  headHold2 shrug hold hold2 wave yay chest draw` (`K.POSES`, angles outward-positive). Methods: `pose(name|obj,t,dur)`,
  `face(t,{mouth: smile|open|grin|flat|frown|o, brows: neutral|up|worried, eyes: open|happy|closed})`,
  `walk(t0,t1,{run,dir})`, `talk(t0,t1)`, `wave(t0,t1)`, `hop(t,n,h)`, `look(t,v)`, `attach(side)` (upright group in the
  hand for held props: phone, mug). Auto: seeded blink every 2.3–4.2 s, breathe, idle arm sway, hair sway.
- `K.crowd(parent,n,x0,x1,y,scale,seed)` diverse presets (`K.SKINS`, `K.OUTFITS`); `K.avatar(parent,cx,cy,r,charOpts)`.
- `K.pup` (side-view dog: `trot`, `wag`), `K.pupMark` (front-face mark in a ring), `K.sheep` (invoice-sheep: `trot`, `hop`)
  — examples of a **metaphor prop with its own tiny rig**; build yours the same way (body group + legs pivot + X.every).
- Props: `desk monitor laptop plant mug lamp shelf sticky window cloud sun hills invoice phone card pill paperPlane coin
  fence sparkle`; `K.badge(parent,x,y,r,glyph)` with generic glyphs (`check bell coin dollar card bank clock mail plane
  chart calendar heart star paw doc smile question tap`); `K.bubble(parent,tailX,tailY,text,{side,up})`; `K.blob`,
  `K.floaters`, `K.label`, `K.textW`.
- Hand position for camera targets: shoulder (±37,−314), elbow 66 below, hand centre 72 below the elbow; screen-right
  arm angles are negated (`actual = −rSh`, `−rEl`).

## 6. Motion grammar
| move | GSAP ease | frames @30 |
|---|---|---|
| pop (badge, bubble, prop) | back.out(2.2), overshoot ≤ 15 % | 11–14 |
| bubble pop from its tail | back.out(2.2) via `K.pop(el,t,{ox,oy})` | 12 |
| character dolly-in from the foreground (×2.5 scale, blur 16→0) | power3.out | 27 |
| pose change | power2.inOut | 10–12 |
| pull-back reveal (z 5.4→1) | expo.out | 70 |
| push-through (pure zoom ×60, blur outside the camera) | expo.in | 15 |
| whip-pan out / blank / in | power2.in 8 f / 3 f / power3.out 14 f | 25 |
| swing-in card | power3.out (rot −18°, skew 18°) | 19 |
| camera drift during holds | sine.inOut, z +4–8 % | whole vignette |
| idles | sine (bob ±5–7 px, 2–2.8 s; blob 0.06–0.13 Hz) | always |
Stagger: props 3–4 f, orbit badges 6 f, letters 1–2 f, bubbles on each VO question. Build order: blob → main object →
details → character → bubbles/badges → doodles. Holds 1.5–4 s, never frozen (blink, bob, blob, camera breathe).

## 7. Transitions (kit calls)
| name | build | frames | when |
|---|---|---|---|
| T1 pull-back from texture | `K.camera(wrap,{z:5.4,cx,cy})` on a detail + `cam.to(0.05,{z:1,…},2.4,'expo.out')` + blur on the camera group 9→0 + props pop as the frame widens | 70 | opening |
| T2 dolly from foreground | `tl.fromTo(rig.g,{x,y:2600,scale:5.4},{…,duration:.9,ease:'power3.out'})` + `K.blur('xy')` 16→0 | 27 | hero entrance |
| T4 whip-pan | `K.whip(t, outWrap, null)`; next scene starts at t+0.37 with `fromTo(wrap,{x:1300},{x:0})` + x-blur 50→0 | 25 | between sets |
| colour iris (pivot) | `K.iris(g, x, y, P.teal, t, .5)` from a diegetic object (the moon) | 15 | into the colour field |
| shape wipe out | `K.irisClose(g, cx, cy, t, .75, {to: markR, ease:'power1.inOut'})`; outgoing scene must be **above** the incoming one in the DOM | 22 | field → light ground; field → next vignette |
| T6 push-through | centre the camera on the element during the hold, then `cam.to(t,{z:60},.5,'expo.in')`, blur on the scene group; next scene starts on the same flat colour and grows its card | 15 + 3 | into a screen/phone |
| zoom-match pull-back | next scene opens at z = (prev size / element size) on an identical element, `expo.out` 1.4 s | 42 | out of a screen into a dashboard |
| whip-zoom | `cam.to(t,{z:3.6, cx/cy: face},.32,'expo.in')` + blur; next scene from z 1.9 → 1 `expo.out` | 10 + 24 | into the proof crowd |
| T12 word-by-word headline | `K.headline(g,960,560,[{w,t,color,br}],{size:92})` | per word | pivot question |
| T7 logo resolve | `K.iris` ground → mark pop → slide left + scale .62 → `K.wordmark` draw-on → tagline fade → `K.pill` CTA pop | ~80 | end |

## 8. Sound
`sound.json`: `corporate-pluck` 108 bpm (or `playful-bounce` for a sillier tone); sections energy 1 (problem +
metaphor) → 2 at the product name (auto riser into it) → 3 at the resolution (impact) → 2 at the logo → 1 → 0 ~3 s
before the end (end hit rings out); `music_under_voice_db −17`, `duck_db 10`, `sfx_db −4`, `lufs −15`.
SFX map: pop → badges/bubbles/props (gain 0.2–0.45, pitch rising through a stagger), whoosh → whips/push, woosh_low →
iris/wipes, zoom_out/zoom_in → camera reveals, paper → invoices/cards, boing → hops, notif/ding → notifications,
click → taps, success → checks, coin → payments, chime → product name/logo, scribble → wordmark, sparkle → twinkles.
About one SFX per 1–2 s; never an SFX without a visual.

## 9. Build recipe
1. Copy `assets/template/` (index.html, kit.js, scene.js, script.json, sound.json) to the project; keep `kit.js` beside
   index.html (the renderer serves only the project and `/engine/`).
2. Write the beat sheet (§3) and `script.json`; run `python ENGINE/audio/tts.py <proj>` and read the word times.
3. One `X.scene` per vignette with a `K.camera`; derive every time from `X.line/X.word` (time map at the top of scene.js).
4. Per beat: problem → `K.character` + pull-back + dolly + `K.bubble`s; metaphor → custom prop rig + walk/run + light
   change; pivot → `K.iris` + `K.headline` + `K.pupMark`-style mark; features → UI vignettes (`K.laptop/phone/card/pill`,
   `K.badge` orbit) with push-through/zoom-match links; resolution → reprise the metaphor set; proof → `K.crowd` + bubbles;
   end → logo resolve (§7).
5. `ENGINE/make.sh <proj> --draft --workers 3`, `render.mjs --stills …` at every beat, LOOK, fix; then the full render.
6. Line-icon swap (Ahrefs dialect): call `K.lineMode(true)` before building — `K.gshape` then draws flat fills with a
   uniform **5 px navy `#1d3c6e` stroke, round caps/joins, `vector-effect: non-scaling-stroke`** (constant width under
   camera zoom) and no grain; `K.inkAll(group)` outlines raw-SVG prop parts too; add `K.stack()` offset copies (8/16 px, `#d4e5f1`/`#9cb5cc`) for depth, a dashed ground
   line under each object, lowercase navy captions, 8–14 drifting doodles (`K.floaters` rings/dots/sparkles), and
   swap transitions for the T8 coral-square morph (MorphSVG, power2.inOut 12 f + squash/stretch). Avatars become
   busts in circles. (A dedicated line-icon skill may follow.)

## 10. QA checklist
- Stills at: 0.3 s (texture), hero landing, each bubble, metaphor wide, iris mid-way, headline, every feature
  vignette, push-through end (must be a flat field), resolution, crowd with all bubbles, logo final.
- Gates: scene changes 4–11/min, cuts ≤ 2/min, colourfulness 30–45, brightness ≥ 0.85, hold ≤ 0.35, WPM 135–145,
  LUFS −14…−16, text ≥ 32 px, nothing in the 96 px margin except bleeding scenery.
- Gotchas: blur on a camera group scales with zoom (put it on the scene group for screen-space blur); pan + zoom on
  the same expo ease swings the target off-screen (centre first, then zoom); scenes stack in creation order
  (`insertBefore` when the outgoing scene wipes over the incoming one); fast-ending wipes read as hard cuts (use
  power1.inOut ≥ 0.5 s); objects parked off-frame with `y:-700` can peek in under camera moves (park ≥ 1300 px away);
  `K.bob` keeps the element's own transform but never bob an element GSAP also transforms — wrap it.
- Don't: hard-cut between vignettes, subtitle the VO, mix outline styles, use real app icons, lip-sync, overshoot
  > 15 %, end on a cut to black.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/

## Later evidence
Added after the skill was written (read when extending the style):
- `references/reddit-saas-addendum.md` — hybrids (Icons8, Mailmodo)
