---
name: explainer-ted-ed
description: "Makes a TED-Ed-style animated lesson in code — the fixed lesson wrapper (neutral ident on white, epigraph card in thin grey sans, one white frame, fade from white, black credit bar) around ONE question answered by a calm narrator through a 4–6-step cause-and-effect chain that zooms macro → micro and back, opening on a dated anecdote and ending on a callback line; the illustration style is a swappable layer (soft-glow pastel cel on twos, retro comic, painted multiplane, geometric motion graphics, isometric neon). Trigger on \"TED-Ed style\", \"TED Ed lesson\", \"animated lesson\", \"educational animation like TED-Ed\", \"why does X happen? explainer\", \"epigraph + narrated lesson\", classroom/science/history explainers. Builds on explainer-engine."
---
# TED-Ed-style animated lesson

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

TED-Ed is a **format, not a house style**: a different studio illustrates every lesson, but the wrapper, the script
architecture and the pacing never change. One unseen, warm narrator answers one question (the title, never shown or read
aloud) at 120–150 WPM; one visual idea every ~5 s, carried by camera moves, painted wipes and zoom-throughs rather than
hard cuts; almost no on-screen text except one or two labels drawn in the lesson's own art style. This skill reproduces the
formula with original elements only (own ident, own badge, fictional credits, your own epigraph or a verified public-domain
quote) — never the source wordmark, red badge or credit layout. Built from frame analysis of 5 source videos
(references/sources.md, details in references/analysis.md). Sample: `the sample film (the render is not included in this repository)` (penicillin, S1).

## 1. Signature traits
- **Wrapper, timed to the frame**: ident on white 0–1.21 s (29 f @24) → hard cut to a white epigraph card until 5.80 s →
  1 pure-white frame → 16–26-frame fade from white (to black if scene 1 is dark) → VO in at ~7.0 s → black credit bar
  (180 px, 5 columns, round badge at x = 94 %) hard-on for the last 8–10 s, pages swapping hard.
- **One question, never stated as a title**: cold-open on a dated, named anecdote; a one-line pivot ("So how does it…?");
  a 4–6-link causal chain, each link its own picture; a short callback line to the opening image.
- **Scale storytelling**: zoom in to explain (room → object → cell → molecule), pull out to conclude.
- **Personified abstractions** (microbes, enzymes, molecules, chips) acting as simple characters in the lesson's style.
- **6–9-colour lesson palette**, one dominant field (25–40 % of pixels), **one hot accent** reserved for the key agent.
- **Soft light, not hard shading**: glow, vignette, haze; hand-made sub-styles add grain + line boil and act **on twos**.
- **Deliberate, not bouncy**: sine/power2 camera drifts, power2/3-out entrances, back.out ≤ 1.2 only on tiny pops.
- No host, no captions, no lower-thirds, no chapter cards, no subscribe/end card; a continuous ducked music bed.

## 2. Target metrics
Sources: 854×480 @ 23.976 fps. `scene changes` = 1-s colour-histogram events (wipes + camera moves + cuts).

| metric | source range (5 videos) | target | sample (penicillin, 72.6 s) |
|---|---|---|---|
| scene_changes_per_min | 4.96–11.19 (Nail 9.85, Lake 10.32, Micro 11.19) | 9–12 | 11.6 |
| scene_len_median s | 3.75–10.0 (hand-made 4.8–5.3) | 4.5–6 | 4.7 |
| cuts_per_min (hard) | 0.91–7.57 | 1–8 | 1.65 |
| motion_mean / p90 | 4.34–6.26 / 6.9–14.6 | 4.4–5.5 / ≥ 7 | 4.4 / 8.0 |
| hold_frac | 0.098–0.357 (hand-made 0.10–0.15) | 0.08–0.15 | 0.08 |
| colourfulness | 33.9–61.7 (S1 39.9) | 34–45 for S1 | 35.7 |
| brightness | 0.415–0.656 | 0.55–0.62 for S1 | 0.60 |
| dark_frame_frac | 0.054–0.302 | 0.10–0.25 | 0.21 |
| WPM overall (narration-only) | 108–144 (118–153) | 118–135 (≤ 153) | 121 (150) |
| LUFS integrated | −16.3 … −16.8 | −16.5 | −16.5 |
| motion last decile | 1.6–5 (calmest decile) | calmest | 1.2 |

Deliberate deviations (sample): 72 s instead of 4:30–6:30, so the fixed 7 s wrapper is 10 % of runtime (white frames pull
colourfulness/motion/hold toward the wrapper's values; the body alone runs motion ≈ 4.8); the pivot lands at 36 % of
runtime / 33 % of narration because a dated anecdote cannot fit in the first 10 s after a 7 s wrapper (it sits at 14 %
in a 5-minute lesson). hold_frac sits at the floor because grain re-rolls at 12 fps under every shot. `animated_frac`
reads ~0.08 because grain defeats the flat-fill detector — the analysis already flags that metric as unreliable for TED-Ed.

## 3. Script formula
**Beat map (5-min lesson; condensed 60–75 s version in brackets)**

| % runtime | beat | rule |
|---|---|---|
| 0–2 [0–10] | wrapper | ident, epigraph, white frame, fade. Music only. Epigraph never explained or quoted in VO. |
| 2–14 [10–25] | cold-open anecdote | past tense, a date + a named person + a sensory detail, or a startling number. Delay the key noun: "Its name? Penicillin." |
| 12–16 [25–36] | pivot | ONE short line turns story into question: "So how does it kill germs, but leave us unharmed?" |
| 16–60 [36–70] | mechanism chain | 4–6 links, each 1–3 sentences + one picture; macro → micro. Verbal hinges: "Zoom in on…", "To grow…", "Once in the body…", "But…" |
| 60–85 [70–78] | complication / myth / consequence | what goes wrong, edge case, misconception corrected |
| 85–95 [78–88] | resolution, wider frame | treatment, solution, society; camera pulls back to the widest view |
| 95–100 [88–90] | callback button | one wry short line returning to the opening image ("Not bad, for one messy bench."), then credits |

**The six explanation rules** (the channel's own meta-lesson, use as a generator): spark curiosity before explaining ·
introduce building blocks one at a time and NAME each · one metaphor + one strong example per block · open a knowledge gap
the blocks can't yet explain · reveal the big idea only after the blocks are in place, then restate how they built it ·
never skip a block (curse of knowledge).

**Numbers**: ~120 words per minute of TOTAL runtime (650–720 words for 5–6 min; 140–150 for 72 s). Narration 120–153 WPM
with 0.3–0.6 s sentence gaps. Kokoro: `af_heart` (warm, clear) or `bf_emma` / `am_michael`, `speed` 0.92–0.95, first line
`"at": 7.0`, `gap` 0.4–0.6 (0.55–0.7 before the pivot and the callback), `tail` 7–8 s (credits hold). Spell years in words
("nineteen twenty-eight"); facts must be certain — no invented statistics, no fake quotes.

## 4. Visual system
**Shared**: full-bleed 16:9 illustration; no persistent UI; one subject per frame on a third or centred, 30–60 % of frame
height, big negative space (flat field / sky / water); split panels only for comparisons. Text ≈ 1 label per 30–90 s,
≤ 25 % of width, drawn in the art style (S1: thin condensed caps with glow + boil — `K.label`, Oswald 300, 70–118 px).

**Wrapper typography** (`K.ident`, `K.epigraph`, `K.credits`): epigraph Inter 300, 66 px, #4C4C4C on #FFFFFF, line
pitch 1.6, block centred at y = 46 %, up to 83 % width; attribution 26 px #8C8C8C "– Author, *Work*". Credit bar #000,
180 px (223 if names wrap), columns at x = 4.9 / 24.7 / 40.7 / 54.6 / 69.2 %, role regular + name bold, Inter 26–28 px
#F4F2F2, badge Ø 122 px centred (1805, 986) — in your own colour and glyph (kit: teal lamp `#1E7F7A`).

**Sub-style catalogue** (pick ONE per lesson; `K.PAL.S1…S5` hold the measured palettes)

| # | sub-style (source) | palette | shape & line | texture & light | camera / transitions | cadence | kit support |
|---|---|---|---|---|---|---|---|
| S1 | soft-glow pastel cel (rusty nail) | mauve #B08EAB, teal #B3CCCF/#CFD9DD, night #1A111F, ochre #AD823F, sky #9EAED8, cream #EDDFD5, brick #A8525F, hot pink #E24398 | no outlines; cream rim glow (~6 px + 10 px halo); round heads, noodle limbs, white knob ends | heavy 2-px grain, vignette, speckled watercolour fills | flat staging, painted brush wipes, ink-edge drops, slide-offs, panel splits | **twos** (12 fps) | full (sample) |
| S2 | retro mid-century comic (microwave) | browns #1F1E16/#423F2D, radar green #559A5E, cream #CECAB9, steel #8DA3AC, navy #2E3443, teal #5C9393, parchment #DAD0B2, red #C65D61 | brown-black ink outlines 3–4 px, 2-tone cel, 7-head realistic adults | paper grain boil every frame, warm lamp pools | slow push-ins, diagonal split (white 8 px bar), pans to parchment boards, zoom-through match cuts | ones | palette, `zoomThrough`, `brushWipe(twos:false)`; outlines = stroke #2A2018 3.5 px |
| S3 | painted multiplane (lake) | murk #48553E/#7D855D, water #5B7D8D/#486373, deep #1F2A29/#0D100E, diagram #4BD0DF/#216EB6/#D7FCFD | gouache cut-outs, no outlines, organic silhouettes | painted texture everywhere, optical depth of field, light shafts, 26 % dark | drifts, rack focus (`K.blur`), dissolves, dip-to-black (`K.dip`), microscope circles | twos | palette, `dip`, `blur`, `motes` |
| S4 | geometric flat motion graphics (meta-lesson) | lavender #C190F9 field, purple #5600AC, blue #3F54F7, magenta #EC14CE, red #D31C2C, yellow #FADB2E | pure primitives, dot-face circles, node graphs; Poppins ExtraBold 2-line stacks | perfectly flat, no grain | shape grow-wipe (`K.shapeGrow`), iris close (`K.iris`), long holds | ones | palette, `shapeGrow`, `iris` |
| S5 | isometric neon 2.5D (AI data centres) | indigo #30397F/#5464AC/#14153F, violet #4423AF/#7746D2, circuit #1E5A4F/#45916F, heat #C9302C/#F3B777 | 30° isometric halls/racks/chips, faceted figures, extruded numerals | gradients + bloom, light rays, haze | continuous fly-through (camera only), radial zoom-blur whips, light-burst reveals | ones | palette; build iso with skewed `<g>` + `X.glow` |

**S1 in detail (the sample)** — roles: dominant field per shot (mauve / teal / sand / sky), night #1A111F for reveal
"planets" and dark beats, cream #EDDFD5 + glow #FFF6EC for every character, brick #A8525F speckled for the antagonist,
hot pink #E24398 ONLY for the hero agent (here penicillin), plum #50393E / cloth #3B3240 for silhouettes and clothes.
Fields may be pushed ~10 % more saturated than the measured hexes to reach colourfulness ≥ 34 in a short film (sample:
#B784AA, #A3CBD1, #93A6E2, #D3B677, #96485A). Grain overlay 0.12 at 2-px grain (`K.look`), vignette 0.42, line boil 2.6 px
at 12 fps on characters and labels. Iconic S1 frames: a glowing speckled circle ("planet") on night with a hand-lettered
label beneath; a cream figure on a flat colour field; a 2–3-panel split.

## 5. Characters & objects
- **Humans** (`K.person`): head ≈ 40 % of height, one shape for the body (coat/tunic), 1-segment noodle legs, 2-segment noodle
  arms with knob hands, dot eyes, nose hook, cheek blush, mouths `smile|flat|oh|worry` (`K.mouth`). Built 400 units tall,
  feet at origin; joints are nested groups. Act pose-to-pose with `K.pose(rig, t, {armF, foreF, armB, foreB, head, lean, x, y, mouth})`
  (degrees; negative arm = forward for either facing), `K.walk(rig, t0, t1, {dx, holdFront})`, `K.blink(rig, [t…])`.
  Props ride on `rig.handF` (counter-rotate them: `rotate(130) translate(0,-16)` for a raised hand).
- **Personified agents**: `K.coccus` (round speckled microbe with wall ring + face, mouths incl. `zig`), `K.enzyme` (cream blob
  with a square notch = active site, two forward arms that clamp), `K.token({kind:'link'|'drug'})` (square-headed building
  block; the drug is the β-lactam square fused to a 5-ring, hot pink with glow), `K.mold` (cotton blob + hyphae), `K.dish`
  (petri dish top view with seeded colonies and their distances from a point).
- **Props/sets**: `K.flask`, `K.dishStack`, `K.bottle`, `K.bed`, `K.lamp`, `K.rooftops` (seeded skyline with windows that can
  light up), `K.field` / `K.stage` (field colour + paper texture + camera group), `K.motes` (drifting dust/spores/droplets).
- Every prop follows the character rules: no outlines, translucent glass, cream rim glow, flat fills + speckle.
- Never tween `x/y` on an element that carries a `transform` attribute (placement groups) — wrap it and tween the child.

## 6. Motion grammar
| move | GSAP ease | frames @24 | where |
|---|---|---|---|
| camera drift through a hold | sine.inOut | whole sentence, 2–8 % scale + 40–200 px truck | every shot (`K.push`) |
| stressed-noun reframe | power2.inOut | 14–16 | the reveal word ("around", "name", "enzymes") |
| zoom-through | power2.in | 10 (×1.6–1.7) then cut | macro → micro |
| element entrance | power2.out / power3.out | 4–8 | labels 0.9 → 1 over 8 f (`K.labelIn`) |
| pose change | power2.inOut | 6–10, sampled on twos | characters |
| tiny pop | back.out(1.2) | 4–6 | beads, people icons |
| wipes | power2.out (T3), power1.in (T4), power3.out (T6) | 5–12 | see §7 |
Stagger build-ons at speech pace (0.06–0.15 s per item, 0.4–0.8 s per named item). After each key fact hold the finished
composition 1–2 s with idle motion only. Idle life everywhere: blinks every 3–5 s, breathing 3 %, drifting motes
1–3 % width/s, grain at 12 fps, smoke/water loops 2–4 s. **Twos**: `K.initTwos(12)` creates `K.twos`, re-sampled at
floor(t·12)/12 each frame — put all character/object acting and painted wipes on it; camera stays on `X.tl` (ones).

## 7. Transitions
| id | name | kit call | frames | use |
|---|---|---|---|---|
| T1 | hard cut | `X.scene` boundaries | 0 | between scales/locations, on a sentence start (1–8/min) |
| T2 | fade from white | `K.whiteFade({t:5.8, frames:20})` | 16–26 | once, wrapper → scene 1 |
| T3 | painted brush wipe | `K.brushWipe(sceneG, t, {frames:8})` (incoming scene created later = on top; outgoing ends at t+dur) | 6–10 | S1 default between sets |
| T4 | ink-edge drop | `K.inkDrop(t, {color: night})`, next dark scene starts at t+12 f | 12 | into a night/reveal beat |
| T5 | slide-off | `K.slideOff(group, t, {dir:'down'})` (incoming scene created BEFORE = underneath) | 8–12 | reveal an empty field / next set |
| T6 | panel split | `K.panel(parent,{x,y,w,h,fill})` + `K.panelUp(p, t)` | 4–6 | comparisons, the pivot question |
| T7 | push-in zoom-through + cut | `K.zoomThrough(cam, t, {cx, cy, scale:1.65, base, center:true})` | 10 | macro → micro |
| T8 | diagonal split (S2) | two clipped groups + 8-px white bar at ~60°, sweep 8–12 f power2.inOut | — | S2 comparisons |
| T9 | horizontal pan to a board | wide strip inside the camera, `x: -1920` over 8–9 f power3.inOut | 5–9 | "then → now", factory → ward |
| T10 | radial zoom-blur whip (S5) | scale ×3 in 3 f + stacked blurred copies, expo.in→out | 5 | S5 |
| T11 | light-burst reveal (S5) | `X.glow` rays scale up, new scene fades behind | 12–15 | S5 |
| T12 | continuous fly-through (S5) | one world, camera only, sine.inOut 3–8 s | — | S5 default |
| T13 | shape grow-wipe (S4) | `K.shapeGrow(t, {shape:'triangle', color})` | 9 | S4 |
| T14 | iris ring close (S4) | `K.iris(t, {color, ring:'#fff'})` | 16 | S4 |
| T15 | dip to black / rack focus (S3) | `K.dip(t)` + `K.blur` on far layers | 12–24 | S3 default |
| T16 | kinetic numeral assembly (S5) | glyphs slide in one by one, back.out small | ~26 | S5 opening |

## 8. Sound
`sound.json`: `{"preset":"curious-marimba","bpm":96,"sections":[{t:0,e:1},{t:<first mechanism>,e:2},{t:<resolution>,e:1}],
"end_hit":true,"music_under_voice_db":-17,"duck_db":10,"sfx_db":-6,"lufs":-16.5}` — the bed carries the 7 s wrapper alone,
ducks ~10 dB under speech, swells under the credits; energy follows the story (low throughout, one step up for the chain).
Other sub-styles: S2 `doc-pulse`/`lofi-piano`, S3 `ambient-space`, S4 `corporate-pluck`, S5 `tech-glow`.
SFX (1 cue per 5–10 s, low gain 0.08–0.25, always on a visual event): brush wipe `paper` · ink drop `woosh_low` · slide-off
`swoosh` · panels `slide` · zoom-through/reframe `zoom_in` · label `sparkle` · growth `bubble` · snap `tock` · stitch `click`
· jam `thud` · burst `pop` + `woosh_low` · pan `whoosh` · cure `chime`. VO: calm, even, warm; never shouted.

## 9. Build recipe
1. `cp -r assets/template <project>` (it carries `kit.js`; re-copy `assets/kit.js` if the kit changes). Runnable as-is: a 37 s demo (stale bread).
2. Choose the question; write the anecdote (date + name + sensory detail), the one-line pivot, 4–6 chain links, the
   callback. Budget ~2 words per second of runtime. Put it in `script.json` (first line `"at": 7.0`, speed 0.95).
3. `ENGINE/make.sh <project> --draft` once to get `data/vo.json`; list each line's start and its stressed words.
4. In `scene.js` keep the wrapper block; derive every beat time from words (`w(id,'word') - 0.2…0.45`); one `K.stage`
   per picture, ~5 s each; choose its entrance from the sub-style's transitions (S1: T3/T4/T5/T6/T7, a T1 now and then);
   add a slow `K.push` to every shot and a quick reframe on the stressed noun of long shots.
5. Per beat: S1 cast/props from §5, staggered build-ons on `K.twos`, one label at most per 30 s, idle motes/blinks.
6. Callback shot = the opening location revisited (sample: the same bench at night), slow pull-out, credits at END − 8.5 s.
7. `--stills` at every beat start + mid-beat, LOOK at them; then `ENGINE/make.sh <project> --fps 24 --workers 3`.
8. Compare `out/qa/metrics.json` with §2; low motion → longer camera travel + reframes + motes; low colourfulness →
   push fields ~10 % more saturated and give the hot accent more area; scene changes > 12/min → merge beats.

## 10. QA checklist
- Stills: 0.5 (ident), 3 (epigraph legible, nothing else), 6.2 (fade under way), first VO beat, the pivot, each chain
  link, the label frames, the callback + credit bar (columns aligned, badge not clipped, text ≥ 25 px).
- Gates: scene changes 9–12/min, median scene 4.5–6 s, motion mean ≥ 4.4, colourfulness ≥ 34 (S1), WPM 118–153,
  LUFS −16.5 ± 0.3, last decile the calmest, no shot > 12 s without camera travel.
- Do: one sub-style per lesson, one hot accent, labels in the art style, picture change on clause starts, callback ending.
- Don't: show/read the title, add captions or a host, bounce with big overshoot, cut faster than 8/min, end with a
  subscribe card, reuse the source ident/badge/credit names, quote the epigraph in the VO, let text exceed ~8 words.
- Watch for elements with a `transform` attribute being tweened on x/y (they jump to the origin), clip/z-order mistakes
  in wipes (T3 incoming on top, T5 incoming underneath), and twos tweens that should be camera moves on ones.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
