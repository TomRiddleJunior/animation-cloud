# Line-essay — glowing-pen-on-black vertical reel essay (human vs machine, drawn live)

Analysed 2026-10-27 from `insta/frames/De900n3zh4j/` (metrics, sheets) plus my own measurements on the 720×1280 30 fps
MP4: a 2 fps contact sheet of the whole reel, 10–30 fps strips around every transition, draw-on, caption swap and the
CTA (`samples/line-essay/scratch/src/sheet2_*.jpg`, `ev_A…M_00.jpg`, `capz_sheet.png`, `lab_sheet.png`), full-res
crops for stroke texture, pixel sampling of every colour role (`tools/colors*.py`), per-frame motion split into
background vs content (`tools/motion6.py`, `tools/bg.py`), caption geometry from row profiles, and RMS / band-energy /
onset / YIN-pitch analysis of the soundtrack (`tools/audio.py`). Values marked *inferred* could not be measured.

---

## 1. Identity

A 57-second **motivational micro-essay told as one continuous drawing**. On a near-black, faintly mottled ground a
**pen** (an outline stylus with a spark at its nib) draws a hand-wobbly circle live while a calm voice opens a
contrast-pair hook (human first). A machine then draws its circle the machine way — a radius arm sweeps a perfect
blue circle in 12 frames — and copies it a million times. On the turn back, the camera dives
back into the human circle and **measures its flaws** with tiny letter-spaced mono labels (DEVIATION ×4, SHAKE ×3,
±7.3 PX, GAP 28 PX), each flaw tied to a human cause. The circle becomes a person (head-and-shoulders line figure),
a perfect blue head is tried on and lifted off, sparks scribble the head full of amber, a blue scan copies the figure
but not the glowing "why" in its chest, and the figure ends "1 OF 1" under a lens flare. The drawing resolves into a
spiral, a cream pill CTA pops under the caption, the spiral dissolves to dots and the pen comes back — **the last
frame is the first frame** (a seamless loop).

The look is minimal and technical at once: **every line carries a halftone glow** (a blurred halo seen through a
screen-aligned dot grid), colour is semantic and rationed (**white = neutral, amber = human, blue = machine, teal =
everyone else**), and **nothing ever cuts** — objects draw on, shrink, multiply, morph, slide and the camera pushes or
dives inside one space. Karaoke captions (Poppins, grey → white per spoken word, keywords bold with a glow) sit at
75 % of the frame height.

## 2. Source analysed

| id | account · reel | dur (s) | cuts/min | scene changes/min | median scene (s) | motion mean / p90 | hold_frac | colourfulness | brightness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| De900n3zh4j | i7_____nr · instagram.com/reel/De900n3zh4j · ~108.9 k likes · "Original audio" · no caption text | 57.03 | **0** | **0** | 57.03 (one take) | **1.24 / 2.19** | **0.003** | **3.6** | 0.067 | **163** (196 while speaking) | **−14.1** |

Other facts: 720×1280, 30 fps, HE-AAC 44.1 kHz stereo; saturation 0.226; dark-frame fraction 1.0; flat_mean 0.43
(`animated_frac` 0.60 — the grain and halftone make 40 % of seconds read as "textured"; the whole reel is code-like
motion graphics). Palette (k-means): `#0c0f10` 41 % · `#0b0d0c` 21 % · `#0a0c0f` 16 % · `#090b0c` 11 % · `#080a0a` 7 % ·
`#252528` 1.8 % · `#595554` 1.1 % · `#c0bcbc` 0.4 % — i.e. 97 % near-black ground, 3 % line work and text.
The voice-over runs about 155 words.

## 3. Measured pacing

| quantity | value | what it means in practice |
|---|---|---|
| hard cuts / scene changes | **0 / 0** | the colour histogram never jumps: one dark ground, small bright lines, so even big zooms are not "scene changes" |
| motion_mean / p90 | **1.24 / 2.19** | very low, *but never zero*: split into **0.65 from the ground** (the mottled texture re-rolls) + **0.59 from content** |
| hold_frac | **0.003** | no frozen 1/6-s step in 57 s — the ground boils even when the drawing holds |
| motion by decile | 1.19 · 0.99 · 1.18 · 1.20 · 1.52 · 1.10 · 1.35 · 0.86 · 1.37 · 1.63 | flat; bumps at the comet ring (40–50 %), the scribble/copy (60–70 %) and the spiral + CTA (90–100 %) |
| ground boil | blotch layer (std 1.4 grey at 20-px blocks, range 9.5–20.5) changes every ~4 frames, lag-10 corr 0.95 | ≈ 7.5 fps stepped texture loop, fine grain static (frame-to-frame corr 0.97) |
| caption chunks | ≈ 30 in 57 s → one every **1.9 s**, 2–7 words | the caption is the fastest-changing element; the art changes every 1–3 s |
| visual events | ≈ 75 (draw-ons, label type-ons, zooms, swaps, flares) | one new mark on (or 2–4 frames before) almost every stressed word |

**Shot list (one take; t in s).**
0.0 pen already drawing at 11 o'clock, white wobbly circle counter-clockwise, nib spark + halftone halo · 2.0 `HUMAN`
types under it · 2.6 caption swap · 3.0–3.7 circle closes (with a gap), pen lifts and exits up-right along its axis,
fading · 4.3–5.2 circle shrinks ×0.55 and glides left · 6.2 dot → 6.3 crosshair → 6.4–6.6 `COMPUTER` types (1 char / f)
· 6.5–6.9 radius line grows up from the centre · **7.05–7.45 radius arm sweeps 360° drawing the blue circle (12 f)** ·
7.4–7.7 `x² + y² = r²` types · 8.4–10.4 the arm keeps turning like a clock hand, `ERROR 0.000 PX`, `RUN 2 … RUN 4` ·
**10.5–12.5 multiply**: 1 → 4 → 9 copies pop in (1.15× → 1) from off-frame, then 16 → 36 → 256 → 6,561 → 96,100 →
1,000,000 (always n²) as the grid shrinks to a mesh and then a **solid dark-blue square**; counter + `IDENTICAL COPIES`,
`1000 × 1000` types on top (12.7); the human circle is now a dot at the left · **13.33 viewfinder brackets snap on the
dot** + amber `HUMAN · 1` · 13.80 square vanishes (2 f) · **13.87–14.13 zoom-through** into the human circle (8 f, smeared)
· 14.9–15.5 circle **turns amber**, `DEVIATION ×4` types (right-anchored), radial deviation ticks grow around it ·
15.6–16.6 `SHAKE ×3` waveform drawn by a glowing tracer under the circle, `±7.3 PX` · 17.0–19.0 amber diameters +
`W 476 PX`, `H 444 PX` (lopsided) · 18.5–19.5 a **teal comet** curls in from the top-left (the second flaw's
cause) · 20.53 annotations vanish (1–2 f) · **20.6–21.1 push-in ×1.9** to the top of the circle (15 f), `GAP 28 PX` with a
bracket, `SPEED ×2.4` · **23.5–24.3 pull-out** (24 f) while teal comets fly in from the edges and draw 8 small teal
circles in a ring inside a big thin `EARTH` ring · 26.0–26.5 the others shrink away · 27.0–29.0 the pen re-enters and
draws a second attempt over the first (`ATTEMPT 2`, `Δ 24 PX`) · 29.4–29.8 the attempt slides right and fades ·
29.6–30.0 the circle shrinks into a head · **30.1–30.6 neck, then shoulders draw down both sides at once** ·
31.4–32.0 a perfect blue head descends onto the body pushing the human head out, `r 74.000`, body dims · 33.5–33.9 the
blue head rises off · 34.5–35.0 halo ring · 35.5–36.0 push-in ×1.4 · **36.4–37.1 four or five sparks race around the
head scribbling it full of amber** · 38.3 horizontal lens flare through the head · 39.1–39.3 figure shrinks left ·
**39.2–40.4 a blue scan line descends and reveals a blue copy** (`COPY 1:1`) · 41.5–43.0 amber sparks fall into the amber
figure's chest: glowing `WHY` dot; the copy's chest is an empty ring · 44.5 dotted halo · 46.4–47.3 identical blue
copies drop in from the top, each pushing the last out (`COPY #001 → #003`) · 47.4–47.6 the copy slides off the bottom
· 47.6–47.8 amber figure to centre · **47.8–48.3 lens flare + expanding halo rings, `1 OF 1`** · 48.5–48.8 the body
retracts up into the head · 48.8–49.1 the head grows into a big circle · 49.5–51.5 a spark draws an outward **spiral**
with a dotted orbit guide · **52.13 flare + ring burst at the spiral's end · 52.20–52.33 pill pops** (1.45×, blurred,
grey → 1×, sharp) · **53.40–53.53 the pill flips** (scaleY → 0.05 → 1) to `✓ GROW, NOT PERFECT`, the check draws ·
55.1–55.5 the spiral dissolves into dots · 55.6–56.3 the pen re-enters from the top-right, the pill blurs out ·
56.4–57.0 the pen starts drawing — identical to frame 0.

## 4. Script & narrative structure

The source's transcript (about 155 words) is not reproduced here; the beat table below gives its structure.

| % runtime | s | beat | device |
|---|---|---|---|
| 0–13 | 0–7.4 | **Contrast-pair hook**: one sentence frame said twice, human first, then computer | the same object drawn twice, each in its own manner, each labelled |
| 13–23 | 7.8–13.3 | **Machine escalation**: flawless repeats → a million copies | readout `ERROR 0.000`, multiply-to-solid with a counter |
| 23–40 | 13.3–23.0 | **The turn back to the human drawing** — three flaws, each with a human cause | dive back in; one measurement annotation per flaw |
| 40–50 | 23.4–28.8 | **Uniqueness**: no one could repeat it, not even the person who drew it | others' attempts (teal), a second attempt |
| 50–62 | 28.8–35.0 | **Turn to people + inverted thesis** (value comes from imperfection, stated as an inversion) | the object becomes a person; perfect part tried on and removed |
| 62–83 | 35.5–47.1 | **Proof & the copy**: flaws prove presence; a copy gets the *what* but not the *why* | scribble fill, scan-copy, chest dot vs empty ring, conveyor of copies |
| 83–85 | 47.5–48.0 | **Two-word landing line** | flare + halo + `1 OF 1` |
| 85–100 | 48.0–57.0 | **CTA**: growth image + keyword + pill, dissolve, loop | spiral, pill pop + flip, dots, pen returns |

- **Sentence engine**: short declaratives, second person, parallel triples (three flaws, each with a human cause),
  one inversion as the thesis, a short 2–3-word answer line.
- **WPM** 163 overall, 196 while speaking; 19 pauses > 0.25 s (mean 0.43 s) — almost every sentence gets one breath.
- **Ending**: comment-keyword bait (reproduce only as a neutral follow/save CTA in original work).

## 5. Visual system

**Palette roles (sampled; the compressed video desaturates thin lines — the "tint" column is the most chromatic 1 %).**

| role | core (line centre) | tint / halo | use |
|---|---|---|---|
| ground | `#0c0e0f` (12, 14, 15) — blotches 9.5–20.5 grey | — | everything sits on it |
| neutral line | `#dfd7da` | `#908588` (mauve) | first drawing, anything not yet examined |
| human / amber | `#f7e4c8` cream | `#c1ab7a`–`#c6ac7a` amber | examined human line, scribble, spiral, flares |
| machine / blue | `#a0a8b6`–`#9eadc2` | `#6d8194`, `#3c5c74` | computer circle, blue head, scan, copies |
| everyone else / teal | `#cacdce` | `#5f9f90` | other people's circles, the stray thought |
| solid copy block | `#1c2430` *(by eye)* | — | the million copies |
| label white | `#e7e5e8` (halo `#a7a0a5`) | — | mono labels |
| readout cream | `#f0e7da` / `#c4b084` | — | `ERROR`, `GAP` numbers |
| equation blue-grey | `#b7bac0` | — | `x² + y² = r²` |
| caption lit / unlit | `#fefbfc` / `#635d65` (`#5c565e`) | white glow on bold words | karaoke |
| pill | `#f1f1ed`–`#fffffa`, ink `#141414` | soft white outer glow | CTA |

**Line work.** Core 1.5–2 px @720 (2.2–3 px @1080) with **high-frequency tremor** (±1 px every 2–3 px of length)
on human lines, perfectly smooth on machine lines. **Halftone glow**: a blurred halo (≈ 8–10 px each side @720) seen
through a **regular dot screen** (pitch ≈ 4 px @720 = 6 px @1080) whose dots grow with intensity; the screen is fixed to
the frame (it does not scale when the camera zooms — at the ×1.9 push the dots stay the same size). Small soft bloom on
the core. The pen nib spark and flares are the only bright blobs.

**Ground.** Mottled near-black: two octaves of soft blotches (std ≈ 1.4 grey at 20-px blocks) + fine grain (std 1.5,
static), the blotch layer steps every ~4 frames through a short loop → the ground "boils" faintly (this is half of the
measured motion and why hold_frac ≈ 0).

**Typography.**

| role | source look | engine font | size (fraction of H) | @1080×1920 |
|---|---|---|---|---|
| caption | Poppins Regular, keyword Bold | **Poppins 400 / 700** | ascender–baseline 26 px @720 → font ≈ **2.8 % H** | **54 px**, line pitch 69 px (1.28 em) |
| labels | small mono caps, tracked ≈ 0.25 em (Space-Mono-like) | **Roboto Mono 500** | cap height 9 px @720 → font ≈ **1.0 % H** | 19–22 px |
| counters | mono, white | Roboto Mono 500 | ≈ 1.4 % H | 27–36 px, sub-label 13–15 px |
| pill text | Poppins Bold caps, +0.05 em | Poppins 700 | ≈ 1.8 % H | 31–35 px |

Labels type **one character per frame** (30 cps): centred labels grow from their centre (`text-anchor: middle`),
labels to the right of the drawing are right-anchored, readouts left-anchored. No cursor.

**Layout grid and safe zones (720×1280 → 1080×1920).**
- Art centre at **0.46–0.47 H** (circle centre 600/1280), art zone ≈ 0.20–0.70 H; main object ≈ 0.44 W across
  (circle r = 0.22 W); labels sit 20–40 px off the object.
- Captions: two centred lines, block centre **0.75 H** (line-1 baseline 0.741 H, line-2 0.777 H; single line 0.759 H);
  max line ≈ 59 % W (≤ 25 characters).
- Pill centre **0.853 H**, 60 × 333 px @720 (90 × 500 @1080).
- Nothing important right of 0.88 W (Instagram's rail) except thin lines; nothing below 0.88 H.

## 6. Characters & objects

- **The pen**: outline-only stylus (long body, ferrule line, hex cap, cone nib), ≈ 0.34 W long, held at ≈ −58° (nib
  bottom-left, cap up-right), dark fill so it occludes lines behind it; a white spark with a 4-ray glint at the nib only
  while drawing. It enters along its own axis already drawing and leaves the same way, fading.
- **Human line**: wobbly, never closes exactly, overshoots or leaves a gap; drawn at hand speed (a full circle ≈ 2.8 s).
- **Machine line**: drawn by a mechanism, not a pen — a radius arm, a ruler head, a scan line; ≤ 12–15 frames.
- **Bust**: wobbly head circle (r ≈ 0.053 W), parallel neck lines, sloping shoulders that turn into straight arms to
  the bottom of the art zone; drawn head first (pen), then both sides of the body at once.
- **Others**: teal comets (bright head + short curved trail) that draw their own small circles.
- **Readouts**: crosshair, radius arm, measurement brackets with end ticks, deviation ticks (×4 amplified), a
  waveform with a tracer dot, viewfinder corner brackets, counters.
- **Acting** = drawing behaviour: shake (tremor), overshoot, a gap at the end, scribble fill, retract into a point,
  shrink to make room, slide off-frame, get copied.

## 7. Camera & transitions catalogue

| # | move | construction (from 10–30 fps strips) | frames @30 | easing | count |
|---|---|---|---|---|---|
| 1 | **Live pen draw** | head of the stroke = pen nib; pen enters 0.4 s before along its axis, lifts 0.6 s after | full circle 85 f; short marks 12–25 f | sine-ish in-out, slight hesitations | 5 |
| 2 | **Machine draw** | radius arm sweep / ruler head / scan line; the label types first | 12 f (circle), 36 f (scan) | power2.inOut / linear | 4 |
| 3 | **Shrink-and-slide** | existing drawing scales ×0.5–0.8 and glides aside to make room | 25–30 f | power2.inOut | 3 |
| 4 | **Multiply to solid** | copies pop at 1.15× → 1, grid re-flows n² while shrinking, mesh fills into a block, counter counts n² | 60 f | expo-like acceleration | 1 |
| 5 | **Brackets + zoom-through** | 4 corner brackets snap (1.9× → 1, 4 f) on a tiny target, the rest vanishes (2 f), 8-f dive with smear | 4 + 2 + 8 f | back.out / expo.inOut | 1 |
| 6 | **Push-in / pull-out** | camera scale ×1.4–1.9 about a detail; pull-outs reveal new elements arriving from the edges | 15 f in, 24 f out | power2.inOut | 4 |
| 7 | **Annotation cut-off** | all labels / ticks of a beat disappear in 1–2 frames when the next beat starts | 1–2 f | — | ~8 |
| 8 | **Recolour in place** | white → amber (human examined), body → grey-blue (machine part attached) | 15–18 f | linear-ish | 3 |
| 9 | **Comets in** | teal heads with curved trails fly in from the frame edges and draw | 20–30 f | power2.out | 2 |
| 10 | **Vertical swap** | a replacement descends from above / rises out; conveyor of identical copies | 12–18 f each | power2.inOut | 4 |
| 11 | **Object → person** | circle shrinks to head size, neck + shoulders draw down both sides at once | 12 + 15 f | power1.inOut | 1 |
| 12 | **Scan copy** | horizontal blue line descends; the copy appears behind it | 36 f | linear | 1 |
| 13 | **Retract & regrow** | a figure undraws into its head, the head grows into the next object | 9 + 9 f | power2.in / out | 1 |
| 14 | **Flare + ring burst** | anamorphic horizontal streak through a point + expanding ring, chime | streak 3 f in, 15 f out | expo.out | 3 |
| 15 | **Dissolve + loop** | the last drawing breaks into dots (dash pattern opens) and fades; pen returns to frame-0 pose | 12 f + 25 f | — | 1 |
| 16 | **Caption swap** | 3 f blur-out (0 → 6 px) + fade, 1 empty frame, 3 f blur-in (8 → 0 px) + fade | 7 f | — | ≈ 30 |
| 17 | **Pill pop / flip** | pop: 1.45× blurred grey → 1× sharp in 4 f; flip: scaleY 1 → 0.05 (3 f) → 1 (4 f) with new text, check draws | 4 / 7 f | expo.out / back.out | 1 + 1 |

## 8. Motion grammar

- **On the word**: a mark lands on (or 2–4 frames before) the stressed word; labels start typing on the noun they name.
- **Karaoke**: each word fades grey → white over 3 frames at its start time; bold keywords also grow a white glow
  (≈ 4 frames, peak blur ≈ 16 px). Grey words carry a faint grey glow too.
- **Typing**: 1 character per frame; 0.2–0.4 s per label; numbers as live readouts.
- **Holds**: the art holds 0.5–2 s between moves but never freezes (ground boil, clock-hand arm, tracer dots).
- **Secondary life**: pen angle wobble while drawing, spark glint, rotating radius arm, comet trails, dotted orbit guide.
- **Stagger**: copies 2–3 f apart, deviation ticks 1 f apart, sparks 3–5 f apart.
- **Ease vocabulary**: hand draws sine/power1.inOut; machine draws power2.inOut or linear; zooms power2.inOut, dives
  expo.inOut; pops expo.out / back.out; exits power2.in.

## 9. Sound

*Analysed numerically (RMS, band energy, onsets, YIN pitch); not listened to.*

- **Loudness** −14.1 LUFS integrated; speech frames median −18.5 dB RMS, pauses −23 dB (−36 dB in the first pause).
- **Music**: no bed under the hook (0–6 s); a **sub-bass drone** (energy at 55 Hz = A1 and 73.4 Hz = D2) enters with
  the computer (~6 s) and holds to the CTA, drops at 52 s, returns faintly — a dark D-minor pad/drone, no beat
  (the 185-BPM autocorrelation peak is the syllable rate).
- **SFX**: broadband pen-scratch noise while the pen draws (0.4 s, 56.4 s; centroid 4.5–5.8 kHz), a noise whoosh on
  the zoom-through (13.9 s, centroid 5.4 kHz), **tonal chimes at D5/D6 (587 / 1175 Hz)** on the halo (the landing line,
  47.9 s) and the CTA flare (52.0–52.2 s), soft UI transients on the pill pop (52.08) and flip (53.51). ≈ 79 strong
  onsets overall, most of them speech.
- **VO**: one calm, close voice, 163 WPM overall / 196 while speaking, ~0.4 s breaths between sentences; median F0
  ≈ 165–187 Hz (octave-ambiguous; *inferred* a soft synthetic voice).

## 10. Do / Don't

**Do**
1. Keep one continuous take: every change is a draw, shrink, slide, multiply, recolour or camera move — never a cut.
2. Let the pen draw the human thing live, wobbly, with a gap or overshoot; let a mechanism draw the machine thing fast.
3. Give every line a halftone glow fixed to the screen; keep the ground mottled and faintly boiling.
4. Ration colour by meaning: white (unexamined) → amber (human) · blue (machine) · teal (others).
5. Annotate like an engineer: tiny tracked mono labels, measured numbers, ticks, brackets, crosshairs — 1 char / frame.
6. Make every number on screen describe the drawing itself (px, ×, counts of what is drawn) or a checkable fact.
7. Drive captions as karaoke chunks of 2–7 words at 0.75 H with bold glowing keywords.
8. Turn the object into a person around the 50 % mark and keep the line language.
9. Land a 2–3-word answer line with a flare, a halo and a chime.
10. End with a pill CTA under the caption and loop the last frame back to the first.

**Don't**
1. Don't fill shapes or use gradients as backgrounds — lines and dots only (the one solid is the "million copies" block).
2. Don't put text larger than the caption anywhere; labels stay tiny.
3. Don't hold a frame dead still; don't animate labels with fades — they type.
4. Don't let anything sit under the caption block or right of 0.88 W.
5. Don't use more than one bright flare per beat or more than ~3 in a reel.
6. Don't copy the source's circle story, its comment-bait keyword or its affirmation promise.

## 11. Replication recipe (code)

Layer stack: stage `#0c0e0f` → **ground** (4 pre-rendered 1080×1920 mottled canvases swapped at 7.5 fps) → one SVG with
an **art group under a screen-space halftone filter** (`feGaussianBlur` 9 → alpha × 3.4 → `feImage` radial dot tile 6 px
+ `feTile` → `feComposite arithmetic k2=1 k3=1 k4=−1` (dot radius grows with intensity) → alpha slope 2.6 → colour of the
blur `in` the mask → merge with a soft bloom and the source) containing the **camera group** (world) and a **HUD**
group (screen-space labels) → HTML **caption layer** (per-word spans, colour/glow/blur set per frame) → HTML **pill**.
Everything time-dependent is evaluated in one `X.every` pass (camera, stroke windows via `stroke-dasharray`/offset,
pen pose, walkers, captions, pill) so any frame renders identically in any worker. Kit: `skills/explainer-line-essay/
assets/kit.js`.

## 12. Formation rules (to make another reel like it)

1. Pick **one simple drawable object** both a person and a machine can make (a circle, a path, a signature, a line).
2. Hook = the contrast pair, both drawn in the first 7 s: human first (pen, live, wobbly, white), machine second
   (mechanism, 12 frames, blue, with a formula or spec label).
3. Escalate the machine once (repeat / copy / multiply with a counter) — 5 s.
4. The turn back — dive back into the human drawing with brackets + zoom-through; recolour it amber.
5. Three flaws, three causes, one measurement each (ticks, waveform, bracket, px readouts); push in for the last one.
6. Uniqueness: others (teal) or a second attempt can't reproduce it.
7. At ~50 %, turn the object into a person (bust) and state the inverted thesis.
8. Machine tries to replace / copy the person (blue head, scan copy) — and misses the "why" (an inner glow).
9. Land a 2–3-word line with a flare + halo + chime.
10. Resolve the drawing into a growth shape, pop a pill CTA under the caption, flip it once, dissolve, pen returns to
    the frame-0 pose.
11. Script: 150–160 words for ~57 s, short declaratives in second person, parallel triples, one inversion; 160–165 WPM
    overall with a breath after almost every sentence; captions in 2–7-word chunks.
12. Sound: no music under the hook, then a dark sub-drone/pad bed; pen scratch under every live draw, whoosh on the
    dive, chimes on flares, soft clicks on the pill. Mix to −14 LUFS.

## 13. Sample built from this analysis

`samples/line-essay/` — "Desire paths", 56.7 s, 1080×1920: the planner's ruled path (blue) vs the worn diagonal
(drawn by the pen, white → amber, footstep stipple) — multiply into 1,024 identical plans → bracket + zoom-through →
three measured "flaws" (cuts the corner √2 ≈ 1.41 / −29 %, bends where rain collects, wider where strangers passed) →
crowd of walkers → wear graph → "desire path" callout → line becomes a person → told vs meant route → second person →
scan copy without reasons → city grid with desire paths → pill `FOLLOW FOR MORE` → `✓ WALK YOUR OWN LINE` → dissolve →
pen loop. QA: see `skills/explainer-line-essay/SKILL.md` §2.
