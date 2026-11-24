---
name: explainer-collage-brand
description: "Makes 45–120 s B2B brand / product-launch films in mixed-media paper collage with selective colour — greyscale halftone cut-outs on flat axonometric sets where colour lives only on \"the thing we sell\", then floods the whole world at the argument's turning line (grey old way → saturated new way → product lockup → logo card). Use when someone asks for a HubSpot \"Video Has Changed\"-style film, a selective-colour / grey-to-colour brand manifesto, a mixed-media or cut-out collage explainer, a halftone photo-collage brand video, a \"the old way vs the new way\" launch film, or a motion-quote / xerox kinetic-typography card (Rutger-Bregman-poster look). Builds on explainer-engine."
---
# Collage brand film — selective colour

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A calm, VO-led brand manifesto built as a **paper-collage world with one colour switch**. Greyscale, halftoned "photo"
cut-outs (people, clocks, lamps, plants) stand like stage flats in three-value axonometric architecture on a slate
ground; stipple sprays replace gradients for light. Saturated colour appears only where the product's value lives
(a screen, a card, a portal), stays near 2 % of the frame, then **floods the world on the turning line** and leads the
second half, ending in a navy glyph reveal, a tracked-caps lockup and a logo on a brand field. The camera travels
instead of cutting. Built from frame analysis of 3 source videos (references/sources.md; one fully measured, two
poster-only style references). Original work only: own brand, own glyph, own photos/figures, own words.

## 1. Signature traits
- **Colour is the plot.** Old world: saturated pixels 0–13 % (median ≈ 2 %), only on "the work" and the hero glyph.
  Turning word → hard flood to a saturated field (60–90 %). Reveal: navy with colour only inside the glyph. End: brand field.
- **People are halftone photographs, never drawings that act**: greyscale, dot-screened, cut out (optional cream
  scissor rim), posed and static; they appear or the camera reveals them. Never coloured, even in the colour act.
- **Flat axonometric architecture**, exactly three values per box (top light, left mid, right dark), no outlines,
  solid navy organic cast shadows (never blurred).
- **Stipple / dither sprays** for light (doorways, lamps, the flood) and texture; gradients are reserved for colour.
- **Travel, don't cut**: one camera journey per act (truck → build in place → drift hold → pull-back reveal), ≈ 2.6 hard cuts/min.
- **Collage tells**: torn-paper scraps with paper texture, translucent tape, a hand-drawn marker loop/cross/tick, a
  hand that tears the old world away.
- **No on-screen text until the lockup.** VO and pictures carry the argument.

## 2. Target metrics
| metric | source (HubSpot) | target | sample (`samples/collage-brand`) |
|---|---|---|---|
| duration | 116 s | 50–120 s | 65.7 s |
| scene changes / min · median scene len | 7.23 · 7.33 s | 6–8 · 6–8 s | 6.39 · 7.85 s |
| hard cuts / min · first cut | 2.58 · 23.9 s | 2–3 · > 15 s | 2.74 · 22.2 s |
| median shot | 14.8 s | 12–20 s | 18.9 s |
| motion mean · p90 | 4.62 · 11.99 | 4–5.5 · 10–12 | 5.36 · 11.26 |
| hold_frac | 0.126 | 0.10–0.18 | 0.16 |
| colourfulness | 53.2 | 45–58 | 51.1 |
| brightness | 0.59 | 0.55–0.66 | 0.653 |
| WPM overall (speech span) | 127.5 (138) | 125–130 | 128.7 |
| LUFS | −23.1 | **−16** (deliberate: platform delivery) | −16.0 |
| saturated share old / new act | 0–13 % / 67–93 % | ≤ 10 % / ≥ 60 % | ≈ 1–8 % / ≈ 70–90 % |
Deliberate deviations: loudness is mastered to −16 LUFS (the source's −23 is too quiet for web/social). A 60–70 s cut
compresses a 116 s story, so the big transitions (pull-backs, flood, tear, slides) sit closer together: motion runs
~15 % above the source. Brightness runs ~10 % high because the cobalt field and the marigold card are brighter than
HubSpot's teal and orange; darken the field (e.g. `#3A2FC4`) if you need 0.59. Keep motion in check by softening
pull-backs (start ≤ 2.5×, power3.out), keeping slides ≤ 0.5 s, and never stacking two big moves.

## 3. Script formula
Manifesto in seven beats (percent of runtime). One line per picture; the stressed noun gets the visual event.
| % | beat | picture | colour |
|---|---|---|---|
| 0–15 | **Hook by recognition**: "For a hundred years, X looked like this … and this." | glyph pulses, echoes, launches a dashed thread; iconic halftone objects grow on it (clock "moon", a commuter on a sunset disc) while the camera trucks; decelerate onto a build | glyph, thread, blobs behind cut-outs (≈ 5–10 %) |
| 15–33 | **How it changed**: "Instead of one A, we now have many: b, c, d …" | iris into a light set; rooms/desks build back-to-front; colour pops one per spoken noun | pops only (≈ 3–8 %) |
| 33–57 | **The problem**: "So why hasn't Y?" + two concrete symptoms | cut → pull-back scale reveal (tiny figure, giant billboard; the colour portal gets buried); stipple light-flood into a dark set; pull back into a labyrinth | 0 % |
| 57–63 | **The pivot**: "Let's leave/tear up Y …" | a physical act (hand tears the page, pulls a lever); colour seeps through the gap | seep (10–30 %) |
| 63–82 | **The new rules**: three parallel "Z today should be …" lines | HARD colour flood on the turning word; vignettes connected by quick slides | 60–90 % |
| 82–92 | **Product reveal**: "That's why we built P: …" | ribbon flight → ring burst to navy → glyph fills with collage → "INTRODUCING / Product" | colour inside glyph only |
| 92–100 | **Logo + tagline** (spoken once) | hard cut to brand field, glyph folds in, wordmark wipes, tagline | brand field |
Hook patterns: recognition ("you'd never have seen this without…"), then-and-now pairs, a rhetorical "so why hasn't…?".
Sample lines: "Work has come a long way, so why hasn't the meeting?" · "Work today should be visible, not reported."
VO: Kokoro `af_heart` speed 0.86 (≈ 173 wpm while speaking), `gap` 0.3–0.8 s (0.8–1.0 at act breaks), lead 1.2,
tail ≈ 3.3 s; ~140 words per 66 s. Brand names Kokoro doesn't know: hyphenate ("Open-fold").

## 4. Visual system
| role | hex | use |
|---|---|---|
| ground (old) | `#5E6478` | slate-violet field, opening + problem acts |
| light / mid / dark planes | `#DDDFE5` `#A3A9B4` `#6F7587` | box faces (`K.OLD`); desks `K.DESK` `#C9CFDA/#5D6F8C/#3E4D66` |
| light set ground | `#D8DAE0` | after the iris (the "how it changed" act) |
| deep / dark room | `#3A4255` `#2F3647` | problem interiors |
| navy shadow | `#2C3749` | organic cast shadows (`K.shadow`) |
| cream | `#FBF5EE` | glyph, doorway light, stipple, marker scribbles |
| colour family = "the work" | marigold `#FFC145` → tangerine `#FF7A3D` → pink `#F0478A`; violet `#7B61FF`, sky `#7FD8F0` | gradients `K.work`, `K.workH/V`, `K.cool`, `K.sunset` — the ONLY saturated fills before the pivot |
| new-world field | cobalt `#4236DE`; planes `#F4F0FF/#9C93F7/#2A22A6`; shadow `#1D1780` | after the flood (`K.NEW`, `K.NEWWARM`) |
| reveal navy · brand field · brand ink | `#231D5A` · `#FFC24A→#FFA51F` · `#2A2380` | lockup, logo card |
Pick ONE gradient family and one field hue per film; don't reuse HubSpot's teal/orange/play-triangle.
Typography (engine fonts): lockup label Inter 600, 30 px, tracking 0.32 em; product name Poppins 600, 92–96 px;
wordmark Poppins 600 150 px lowercase; tagline Inter 500 46 px. Motion-quote: Roboto Mono 500/700, 130–190 px, tracking
0.3 em, header slots 28 px at y 66. Composition: centred hero with 30–50 % calm ground; big/small scale contrast;
static paper-grain overlay (multiply, 0.32) for print feel.

## 5. Characters & objects
- **Figures** are painted greyscale on a canvas (`K.draw`) and turned into cut-outs by `K.cut(parent, canvas, {x, y, h,
  cell 3–6, mix 0.5, contrast 1.15–1.4, bright, rim 0–5, flip, anchor})` → light pass (left key, right/bottom shadow) →
  rotated dot-screen halftone + grain → optional cream rim → drop shadow. Silhouette in a doorway: `bright: -0.42`.
- Painters in `K.fig`: `man({hat, coat, briefcase, point, tone})`, `woman`, `seatedBack` (rows of desks),
  `seatedSide` (at a laptop), `hand` (grip/tear from top-right), `clock({h, m, hands:false})`, `punchClock`, `lamp`,
  `plant`, `reports`. Busts: `K.crop(K.fig.man(), 0, 0, 280, 420)`. Small faces: shading only, no drawn eyes.
- **Architecture**: `const iso = K.iso(ox, oy, s)` → `iso.box(g, x, y, z, w, d, h, K.OLD)`, `iso.floor`, `iso.wallX/Y`,
  `iso.poly`. Rooms = slab + two back walls; build order back to front. Flat art onto a wall: `K.planeY/planeX`.
- **Devices**: vector iso (`K.laptop`) with a grey screen and a gradient twin that `K.colourPop`s on its noun.
- **Collage pieces**: `K.scrap` (torn, paper-textured, shadowed), `K.tape`, `K.mark(parent, K.scribble.circle/
  cross/tick/talk/underline, t)`, `K.stipple({shape:'disc'|'rect'|'cone'})`, `K.blob` (idle-morphing gradient blob).
- **Hero glyph**: `K.glyph(parent, size)` — a page with a folded corner (gradient flap). Replace with your own mark; it
  opens the film, flies with the ribbons, fills with collage and becomes the logo.

## 6. Motion grammar
| move | ease (GSAP) | duration | notes |
|---|---|---|---|
| thread truck | power1.inOut | 3.8 s (≈ 670 px/s avg) | objects grow on the thread just before entering frame |
| round grow (clock, disc, blob) | back.out(1.2–1.3) | 0.6–0.7 s (18–21 f) | only small round things overshoot |
| architecture arrival (`K.rise`) | power3.out | 0.45–0.6 s, 36–60 px | stagger 0.06–0.07 s back→front; never bounce |
| colour pop | power2.out | 0.24 s (7 f), from scale 0.86 | 0.5–1 s apart, on the spoken list |
| drift hold (`K.drift`) | none | whole hold | 9–22 px/s + scale 1.06→1; nothing ever fully still |
| pull-back reveal (`K.pullBack`) | power3.out / expo.out | 3 s from 2.5×, then linear tail −4 % | tiny figure, giant structure |
| iris | power2.in | 0.42 s (13 f) | disc colour = next set's ground |
| stipple light-flood | sine.inOut / power3.out | 0.7–0.9 s grow, 0.75 s resolve | resolves into the lit doorway |
| tear (pivot) | power3.out grip 0.55 · power1.inOut tear 1.3 · power2.in yank 0.42 / fall 0.36 | ≈ 3.3 s | colour seeps, then floods |
| slide between colour vignettes | power2.inOut | 0.5 s (15 f) | + linear drift in each hold |
| ribbon flight → retract | power2.inOut → power2.in | 1.75 s → 0.55 s | glyph scales 0.6 → 1.9 |
| ring burst | power2.out | 0.55 s; rings +0.06/+0.16 s | navy disc fills frame |
| lockup / tagline | power2.out | 0.5–0.6 s fade-slide | label first, name +0.12 s |
Idle: blobs morph (`K.blob`, pure function of t), pendant lamps sway ±1.6°, clock hands spin on "hours", paper
pieces tilt; photo people never move.

## 7. Transitions
| name | build | frames | when |
|---|---|---|---|
| Thread launch + truck | glyph pop, ring pulse, echoes, dashed thread revealed by a growing clip; cam x tween | ≈ 7 s | opening only |
| Build in place | shadow → furniture → people → lamps drop → walls rise (`K.rise`, `K.grow`) | 4–6 s | each new set |
| Iris | `K.iris(g, t, x, y, nextGround)` from a lamp/object | 13 f | old set → light set |
| Hard cut + pull-back | new scene at 2.5×, `K.pullBack` | 90 f | act break into the problem |
| Stipple light-flood | `K.lightFlood(g, t, x, y, {dur, out:{t, x, y, r, dur}})` (HTML canvas, fixed dither map) | ≈ 45 f | into a dark interior |
| Labyrinth pull-back | `<use href="#room">` clones on an iso grid, faded in as the camera pulls 1.14 → 0.6 | 78 f | "everyone is doing this" |
| Tear reveal (pivot) | page in `<defs>`, two `<use>` halves clipped by one jagged line, fibre edge, `K.fig.hand` | ≈ 100 f | the turning line |
| Hard colour flood | the colour scene sits under the page; the last pieces leave on the turning word | 11 f | once |
| Slide | camera x keyframes between vignettes 1900 px apart | 15 f | colour act |
| Ribbon flight + ring burst | `K.ribbons(g, glyph, {d, t, dur, retract, settle})`, `K.ringBurst` | 70 f | product reveal |
| Lockup → logo card | `K.lockup`, then hard cut to brand field | 4–6 s | end |

## 8. Sound
`sound.json`: `corporate-pluck`, 104 bpm; sections `{0:1} {how-it-changed:2} {problem:1} {flood:3} {logo:0}` — the
automatic riser lands on the tear and the impact on the flood; energy 0 at the logo gives the end chord.
`music_under_voice_db −19`, `music_alone_db −9`, `sfx_db −4`, `lufs −16`. (`tech-glow` at energy 1→3 also fits.)
SFX map: glyph `pop`, ring `blip`, echoes `blip_up`, thread/slides `swoosh`/`slide`, grows `pop` (pitch 0.7), desks
`click`, walls `thud`, lamps `drop`, punch clock `stamp`, iris `zoom_in`, rooms `thud`, colour pops `bubble` (pitch
rising per item), clocks `tick`/`tock`, calendar stamps `stamp` every 5th, flood/pull-back `woosh_low`, scribbles
`scribble`, tear `paper` ×2 + `whoosh`, cards `pop`, reports fall `thud`, screens `sparkle`, wedge `ding`, ribbons
`whoosh`, ring burst `whoosh`, lockup/tagline `chime`. VO: calm, warm, unhurried; lines land on pictures.

## 9. Build recipe
1. Copy `assets/template/` to `<project>/` (it carries `kit.js`; keep it in sync with `assets/kit.js`).
2. Write the beat sheet (§3), then `script.json` (~2.1 words per second of runtime incl. gaps). Run
   `ENGINE/make.sh <project> --draft` once to get `data/vo.json`; read the word times.
3. In `scene.js` put every key time on a word (`X.word(id, 'noun')`) in a `T` table, one `X.scene` per act, each with
   its own ground rect and `X.cam` group. Order scenes so the colour act is created BEFORE the pivot scene (it sits
   underneath and is revealed by the tear).
4. Per beat: hook → `K.glyph`, thread clip, `K.cut(K.fig.clock())` + `K.grow`, commuter on a `K.sunset` disc;
   build → `K.iso` boxes + `K.rise`, `K.fig.seatedBack` rows, `K.fig.lamp` dropping; change → `K.iris`, rooms,
   `K.laptop` + `K.colourPop` per noun; problem → hard cut + `K.pullBack`, billboard via `K.planeY` buried by grey
   blocks, `K.lightFlood`, dark room + `<use>` labyrinth; pivot → tear; new rules → field + 3 vignettes, cards from
   `K.scrap`+`K.tape`, `K.mark` crosses/ticks; reveal → `K.ribbons`, `K.ringBurst`, glyph clip + blobs, `K.lockup`; logo card.
5. `node ENGINE/render.mjs <project> --stills ...` at every beat and LOOK; then `ENGINE/make.sh <project> --skip-tts --workers 3`.
6. Compare `out/qa/metrics.json` with §2; fix holds with drift, motion spikes by softening pull-backs, colour by
   enlarging warm masses in the colour act (never by colouring the old world).

## 10. QA checklist
- Stills: hook (glyph + thread + first cut-out), build complete, every colour pop, billboard reveal, flood mid-frame,
  dark room, labyrinth, tear at 50 %, first flood frame, each vignette, lockup, logo card.
- Old-world frames: only "the work" saturated (eyeball ≤ 10 %); problem act fully grey. Colour act ≥ 60 %.
- Gates: scene changes 6–8/min, cuts 2–3/min, hold_frac ≤ 0.18, motion 4–5.5, colourfulness ≥ 45, WPM 125–130, LUFS −16 ± 1.
- `rise()`/tweens on elements that already have a gsap x/y must go through `K.wrap` (otherwise they jump to y 0).
- Keep the stipple flood on the canvas helper (scaling a stipple image makes blocky pixels).
- Do: one gradient family, own glyph, original copy, halftone everything photographic, a drift in every hold.
- Don't: colour people, outline anything, blur shadows, add captions mid-film, bounce architecture, quote real people
  in the motion-quote variant, reuse HubSpot's play triangle / teal field / orange logo card.
- Motion-quote variant (`K.quote.*`): black ground, three-slot mono header, wide-tracked mono caps revealed letter by
  letter on the VO, key word filled with scanned typed-document texture + offset xerox ghost, torn xerox strip, dust.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
