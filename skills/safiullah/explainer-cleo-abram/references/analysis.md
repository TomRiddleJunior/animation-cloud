# Cleo Abram ("Huge If True") — animation layer inside a live-action science show

Scope: the user asked for the **animated material only**. Live action (host to camera, interviews, field
footage) is described only where it sets the rhythm the animation has to fit into.

## 1. Identity

A fast, optimistic host-led show in which **semi-realistic 3D explainer renders and one signal-lime graphic
kit** cut in every 15–20 s. You know it by: (a) **lime chips** (#C6F80A box, near-black heavy caps) and lime
arrows pinned to real objects and people; (b) clean "toy-real" 3D renders: glowing suns, accretion discs,
cutaway engines, curling sheets on flat saturated blue, all with soft studio light; (c) a **paper-collage
mode** for history and theory: off-white paper, pencil diagrams, black-and-white archive cut-outs, page-peel
wipes; (d) chunky lime 3D display words with a dark extrusion used as chapter cards; (e) an imagined
second-person journey ("you and I get into a magical spaceship") that turns the animation into a place you
travel through. Animation is never decoration. Each insert answers the question the host has just asked,
then hands back to a face within 4–7 s.

## 2. Sources analysed

| id | title | dur s | cuts/min | median shot s | motion | colourful | WPM | LUFS | animation share* |
|---|---|---|---|---|---|---|---|---|---|
| BKIkTKqWMfg | What If I Fell Into A Black Hole? | 1178 | 10.64 | 4.05 | 6.57 | 44.3 | 177 | −13.8 | 42 % (53 inserts) |
| VJgdOMXhEj0 | Formula 1 Cars, Explained with Max Verstappen | 1420 | 25.74 | 1.42 | 16.24 | 36.9 | 196 | −13.6 | 17 % (23 inserts) |
| p60I9LNHNxg | Why This Olympic Sport Bothers Physicists | 976 | 22.50 | 1.79 | 15.12 | 44.4 | 178 | −14.6 | 25 % (35 inserts) |
| eNkxTjirY-Q | The Sun Is Weirder Than You Think (2026-09) | 1094 | 15.41 | 2.94 | 8.64 | 61.8 | 159 | −12.9 | 35 % (59 inserts) |

\*The `animated_frac` metric (0.46 / 0.35 / 0.33 / 0.38) counts flat-lit live action too: grey garages, ice, studio
walls. I re-ran the flat-second detector, kept only runs I checked by eye as graphics or renders, and measured
insert lengths, cuts inside the inserts and cuts at their edges (scratch scripts, 1 fps). Photoreal NASA imagery
and grainy renders are partly missed, so read these shares as ±20 % relative.

## 3. Measured pacing

| measure | range across 4 videos | rule for a rebuild |
|---|---|---|
| hard cuts / min (whole video) | 10.6 – 25.7 | 15–22 for a science topic; up to 26 for "access/tour" topics |
| median shot | 1.4 – 4.1 s | live shots 2.0–3.3 s mean |
| cuts in first 15 s | 1 – 15 | either one long animated POV shot (black hole: first cut at 13.6 s) or a montage at ~1 cut/s |
| motion, first decile vs mean | 1.27 – 1.5 × | the hook is the most energetic tenth; the last tenth is the calmest (black hole 4.6 vs 6.6 mean) |
| animation share of runtime | 17 – 42 % | 25–40 % for space/physics, 15–20 % when the subject can be filmed |
| animation inserts per minute | 0.97 – 3.2 | one insert every 14–22 s (median gap between insert starts) |
| insert length | median 4–7 s; p10 1–2 s; p90 13–18 s; max 35–72 s | most inserts are 3–8 s. Once per video there is a long sequence (F1 engine 72 s, black hole 53 s, Sun 35 s) |
| shots per insert | 2.0 – 2.9 | an insert is 2–3 shots of the same 3D world (camera re-angle cuts) |
| cut rate inside animation vs live | 6.6–13.7 vs 13.6–28.6 / min | animation shots are held **1.3–1.7× longer** than live shots (2.7–4.6 s vs 2.0–3.3 s) |
| how inserts start / end | hard cut in 60–91 %, out 68–83 % | the default is a hard cut. The rest are match dissolves, page peels, magnifier zooms or cuts into the next insert |
| hold_frac | 0.04 – 0.11 | almost nothing is static. Even "held" graphics keep a slow push, a bob or a drift |
| WPM | 159 – 196 | animation must read at ~3 words/s: one label per idea |

In practice the animation is a second voice that interrupts at the same tempo as the edit. Inserts are short
because the host or an expert has to come back on screen. The one long sequence per video is the "deep dive"
centrepiece, a single 3D environment re-angled every 3–8 s.

## 4. Script & narrative structure

**Hook, 0–60/85 s (5–9 % of runtime).** Spoken in the second person, three escalating superlatives with
numbers, a twist and a promise:
- Black hole: "Imagine that you're flying through space…", then 3 sensations, then size superlatives with numbers,
  then a "…or can it?" twist and the promise of an expert answer. Pictures: an unbroken animated POV of an
  astronaut drifting into a ring of light (0–13.6 s), then a montage of interview quotes.
- Sun: "If you dove into the Sun…", then 3 layered facts, then a promise that you will see the Sun differently.
  Pictures: a 0.5 s talking head, then a probe animation alternating with NASA footage every 0.8–1.3 s.
- Curling: provocation, then social proof of the mockery shown as **stacked comment cards**, then a "you don't
  know enough yet" promise.
- F1: a footage montage at 15 cuts in 15 s, then the stakes (cars reframed as team science projects), then the
  access promise.

**Title sting** at 50–84 s (3.5–8.6 %), ~3.5 s, followed straight away by a sponsor line if there is one
("Made possible by…", Sun 66 s).

**Body, 8–90 %.** There are 9–20 chapters and **every chapter title is a question** ("What is spaghettification?",
"Why do they sweep in curling?"), each ~55–110 s. The beat inside a chapter goes:
1. the host asks the question (talking head or field),
2. an expert soundbite (interview / video call),
3. a **3–8 s animation insert** that shows the answer, with a lime label landing on the key noun,
4. the host's reaction (a laugh or "wait, what?"),
5. the next question.
Black hole and Sun use a spatial journey (outside, then the edge, then inside, then the centre), so the animation
progresses through space as the video progresses through time. Section hand-over is usually the host's next
question to camera. Some sections open with a **3D word chapter card** ("THE GAME", "THE ENGINE", "CUTTING EDGE
OF BLACK HOLES").

**Ending, last 5–10 %.** A reflective "why this matters" monologue about curiosity, collaboration and optimism.
Motion drops to its lowest decile. Then thanks, a subscribe request framed as supporting the show, a sponsor
repeat, and an **end card**: deep-teal background, coral text chips ("…please consider subscribing."), lime
arrows, a lime "SUBSCRIBE!" and a credits panel (role in a lime chip, names in white).

## 5. Visual system

### Palette roles (sampled from frames)
| role | hex | where |
|---|---|---|
| signal accent | **#C6F80A** (range #C4EA11–#C9F60F) | chips, arrows, highlight marker, data numbers, name supers |
| chip text / outline | #1A1A1A | text inside lime chips, 2–3 px dark outline on lime display words |
| brand dark | #1C3F43 (#193C40) | title/end-card background, extrusion colour of lime words |
| brand light | #B1BBB0 | title-sting background, paper-grey |
| brand alt BGs | #0462FC electric blue, #663852 mauve | title-sting colour flips |
| end-card chip | #F5845F coral | subscribe chips |
| space background | #070F14 → #0E253A | black hole and Sun scenes |
| space grid | #245D8F / #1B354C | perspective floor grid (a "spacetime" plane) |
| hot body | #E8B61F, #ED7C13, #A93311, #F5C43E | sun, accretion discs, flares |
| cool accent | #52BCEA / #4080F3 | magnetosphere lines, blue discs, "low pressure" chips |
| studio light grey | #DADDE1 / #E4E8EC | F1 car-on-floor renders |
| engine studio | #2C2D30 → #484A4E | dark charcoal 3D stage |
| diagram sky | #5998FD / #005AFD | curling-sheet and friction scenes (flat saturated blue backdrop) |
| ice / rings | #DADCE8 ice, #D73B2F red ring, #193753 navy button | curling diagrams |
| paper | #ECE4DC / #ECECEC with #555245 pencil | paper-collage mode |
| white | #FFFFFF | leader lines, secondary captions, arrows on dark |

### Shape language and line work
- 3D renders: rounded and bevelled, with soft contact shadows. There are no outlines on the 3D objects themselves.
- Overlay graphics are **flat and outline-free**: lime chips are plain rectangles with square corners (no radius,
  no shadow). Arrows are thick filled arrows (shaft ~18–22 px, head ~2.2× shaft width at 1080p), lime on footage,
  white or red on paper.
- Leader lines: 2–3 px white or lime, straight, ending in a 6–8 px dot on the object. They are drawn on (see §8).
- Paper mode: graphite-grey pencil strokes 2–4 px with rough ends, faint grid/axis lines, hand-lettered
  equations, red tick arrows (#C0392B-ish) and a lime "?".
- Measurement graphics: a double-headed white arrow across the object with a lime number above it ("~40", "100X").

### Texture, lighting, depth
- Renders: emissive glow is everywhere (sun bloom, accretion-disc bloom, neon rings), lit like a soft studio
  with a rim light, plus film grain/noise on dark space shots. A blue perspective grid floor recedes to a
  horizon at ~60 % frame height.
- Paper mode: a visible paper fibre texture, a slight vignette and drop shadows under the photo cut-outs.
- Depth comes from 3D camera moves (push-in, orbit, lateral truck for size comparisons) and from layered
  composites over footage. There is no flat parallax cut-paper rig.

### Composition
- The subject sits centred or at the left/right third. Labels sit beside it with a leader line, never on top of it.
- Data numbers sit in the lower third (y ≈ 600–730 px of 1080). Name supers sit lower-left (x ≈ 120 px, y ≈ 870–930
  px) with a small lime asterisk-like bullet in front. On paper diagrams a **PiP of the interview** can sit top-left
  (~18 % width) so the speaker stays present.
- Small corner tags ("CLEO'S VIEW", "YOUR VIEW", "PAUSE ⏸") sit top-centre or top-left, ~20 px caps.

### Typography (measured at 1080p)
| element | look | size | free look-alike |
|---|---|---|---|
| lime chip label | heavy grotesque, ALL CAPS, dark on lime | chip 230–530 × 85–107 px (primary), 290–380 × 98 px (parts), 310 × 62 px (data). Cap height ≈ 45–55 % of chip height. Padding ≈ 0.4 × chip height | **Archivo Black** / Archivo ExtraBold |
| free-floating lime caption over footage | same face, lime with dark drop shadow (3 px, 45°) | cap height ≈ 56 px | Archivo Black |
| kinetic display word / chapter card | chunky rounded ultra-bold, lime fill, 2–3 px dark outline, 8–14 px dark-teal extrusion, often warped on an arc | cap height 100–137 px | **Bowlby One** or **Lilita One** |
| data number | same display face, lime | cap height 90–130 px, white unit sub-line ~20 px ("67,000 MPH") | Bowlby One + Inter SemiBold |
| name super | lime caps + small white role line | ~34 px + 16 px | Archivo Black + Inter |
| historical / paper labels | handwritten equations, typewriter captions | 30–50 px | Caveat / Special Elite |
Text density: **1–3 words per label**, one or two labels on screen at a time, dual units in small type underneath
(°C and °F; KPH and MPH).

## 6. Characters & objects

- **Avatar astronaut** (the "you" in the imagined journey): a stylised 3D figure with a big round white helmet, a
  purple/plum suit and chunky gloves. Toy proportions, about 3 heads tall. It appears in third person (floating
  toward a black hole, standing on a platform before the Sun) and as **first-person gloved hands** at the bottom
  of the frame (the POV fall). It barely acts: a float drift, a slow arm reach.
- **Generic people** (curling team): simple 3D mannequins in coloured team shirts (blue vs green), lined up on
  the sheet for counting. They pop on in a row.
- **Mascot props**: curling stones with big cartoon eyes appear for one chapter card. Characters are otherwise rare.
- **Real objects as clean renders**: race car, engine, tyres, curling stone and broom, spacecraft, Earth, planets,
  the Sun. They are semi-photoreal, sit on a neutral or flat-colour stage, and behave like product shots.
  Cutaways show internal states in flat colour fills: intake air blue #3D8DE6, compression/combustion red,
  exhaust yellow-orange, gas flow as chevron arrows.
- **Archival media** is framed as objects: rounded-corner photo cards with a lime caption chip, B&W portraits
  as paper cut-outs, news articles and YouTube comments recreated as white UI cards.
- Icon style: minimal flat white or lime glyphs (eye = observer, arrows, chevrons, question mark).

## 7. Camera & transitions catalogue

Durations are given at 24 fps (×1.25 for 30 fps).

| # | transition | how it is built (from 8 fps / native strips) | duration | frequency |
|---|---|---|---|---|
| T1 | **hard cut footage → render** | straight cut on a sentence boundary. The first label lands 12–17 frames after the cut | 0 f | 60–91 % of insert entries |
| T2 | **re-angle cut inside the render world** | the same 3D scene from a new angle or scale (wide → close-up of a sun limb) | 0 f | 1–2 per insert |
| T3 | **match dissolve on a shape** | a round studio prop behind the guests becomes a CG sun: the CG fades in over the prop while the studio fades out and the grid floor fades up (black hole 1:39.2 → 1:40.0) | 18–20 f | rare, signature |
| T4 | **page peel / paper sweep** | an off-white paper sheet peels in from the bottom-right corner on a diagonal fold with a soft shadow, covering a render (80 % covered in ~6 f, settles by ~16 f). It then slides off left, revealing a paper backdrop with a photo card. The next card slides in from the right in ~5 f | 16 f in, ~48 f total | in paper sections |
| T5 | **magnifier zoom-through** | a circle inset (white fill, 6 px blue #1E6AE8 ring) is anchored by a lime dot and a faint light cone on the object in footage. It scales up to fill the frame (power2.in), then cuts to a full-frame flat micro-world | 6–8 f | 1–3 per video |
| T6 | **push-in to a sketch** | cut from a wide paper collage to a tight crop of one diagram on it (scale ×2–3) | 0 f | paper sections |
| T7 | **camera dive through a layer** | the camera pushes straight down a vertical guide line into the next solar layer while colour shifts | 1–3 s continuous | journey sections |
| T8 | **lateral size-comparison truck** | objects stand in a row on the grid, the camera trucks right to reveal ever bigger ones, a lime number with an arrow names the scale | 1–2 s | 1–2 per space video |
| T9 | **colour-state cross-fade** | an archival image grades from warm yellow to grey (or fluid blue → red → yellow in a cutaway) while geometry stays put | 12–24 f | frequent in cutaways |
| T10 | **ghost / x-ray dissolve** | a rendered car fades to a translucent wireframe "ghost" | ~24 f | rare |
| T11 | **title sting** | see §8 (colour-flip squash-and-stretch word) | ~84 f | once |
| T12 | **graphic bridges a cut** | a UI card (comment, article) stays over a cut from B-roll to the talking head | — | hook sections |

Camera moves inside renders: a slow push-in (≈3–5 % scale per second) on every hold, a slow orbit on
product-style objects (~10–15°/s) and a pull-back reveal for scale. Cuts inside renders are **2.7–4.6 s apart**.

## 8. Motion grammar

- **Easing family**: snappy ease-out for entries (power3.out / back.out(1.7–2.5)), sine.inOut for idle loops,
  power2.in for zoom-throughs. There is no elastic wobble except on the kinetic display words.
- **Label entry (lime chip)**: appears complete in 1–2 frames (a hard pop, no visible scale-up at 24 fps) or
  scales 0.85 → 1.0 in 4–6 f. It lands 12–17 f after the cut and **on the stressed noun**: "DOWNFORCE" on
  "downforce", "DR. BRIAN COX" on the name.
- **Arrow + label pair**: the arrow enters first, sliding 20–40 px toward the target in 3–4 f, and settles. The
  label follows **+12 f**.
- **Idle on arrows**: a bob along the arrow axis, ±6–10 px, period ≈ 12–14 f (0.5–0.6 s), sine.inOut yoyo. Every
  arrow keeps moving while it is on screen.
- **Chevron flow rows** (air/gas flow composited over footage): 15–20 chevrons drawn left → right with a 1 f
  stagger (a row completes in ~14 f). Colour runs along the row as a gradient (green #3BD12A → yellow #F2E71A),
  then the row loops forward (each chevron advances one slot every 4–6 f). The "HIGH PRESSURE" chip appears
  ~5 f after the first chevron. The second chip ("LOW PRESSURE") waits until the narration says it (~2.4 s later).
- **Line draw-on** (track maps, leader lines): stroke-dash reveal over 1.0–1.5 s (power1.inOut) from a lime start
  dot. It is followed by a zoom into one segment (~0.5 s), then colour-coding of segments by category (blue
  "cornering", pink "straight line") with a tiny legend chip top-left.
- **Build-on order**: object → arrow/flow → primary chip → secondary chip → measurement. Each new element waits
  for its spoken word, so build-ons are spaced 0.5–2.5 s apart, not on a fixed stagger.
- **Holds**: a chip stays 2–4 s, then the whole insert cuts away. Chips fade out (6 f) only when the scene
  continues without them.
- **Kinetic words**: words slam in at 120 % and settle (back.out(3), 6–8 f). They squash/stretch on emphasis.
  "SPACE" + "TIME" slide together and merge into one word that wobbles for 4–6 f.
- **Comment/article cards**: they stack in one by one every 6–8 f, each scaling 0.9 → 1 with a slight random
  rotation (±1.5°). The hero card then scales up to centre (~10 f) and a **lime highlighter wipes left → right
  behind a phrase** in ~12 f. The background footage dims ~30 % and blurs.
- **Title sting** (~84 f): a background-colour flip from a 4-colour set (dark teal, light grey, blue, mauve)
  every 3–8 f. The word scales from ~10 % to overfilling the frame in 6–8 f, then the letterforms
  squash/stretch frame by frame (scaleY up to 2.5×, letters condensing into vertical bars) and spring back to
  normal. A dark extruded duplicate is offset 6–8 px. A field of ~30 scattered glyph stamps fills the frame for
  12–16 f. It ends on a tiny tagline held 6–10 f. Animated **on ones**.
- **Secondary motion**: glow flicker on suns and discs, slow particle drift in space, a disc rotating (~6°/s),
  clouds/plasma churning (noise scroll).
- **Rhythm vs narration**: motion lands on the stressed word. Inserts start at a sentence boundary and last one or
  two sentences (≈10–25 words at 178 WPM = 4–8 s), which matches the measured insert lengths.

## 9. Sound (inferred; audio not heard)

- **VO**: the host, a bright, conversational, wonder-led delivery ("Holy…", "Wait, what?"). 159–196 WPM, among
  the fastest in the set. Expert interviews are interleaved; the host's question is often re-voiced over the
  animation.
- **Music**: a continuous bed (silence_s = 0 in 3 of 4 videos, 0.7 s in the fourth). Integrated loudness
  −12.9 to −14.6 LUFS, i.e. mastered loud. Inferred style: modern cinematic-electronic / light synth pulses under
  the explanations, swelling for the journey moments.
- **SFX (inferred)**: frame-exact pops suggest a whoosh/pop on every chip entry, risers into the title sting,
  impact hits on the size-reveal numbers and a sonification moment ("what does the Sun sound like" with a lime
  waveform on screen).
- **Ducking (inferred)**: the music sits under the VO at roughly −18 to −22 dB relative and pushes up for 1–2 s
  on the title sting and journey reveals.

## 10. Do / Don't

**Do**
1. Cut to animation every **14–22 s**, usually with a hard cut on a sentence boundary.
2. Keep inserts **3–8 s** (2–3 shots); allow **one** 35–70 s deep-dive sequence per video.
3. Hold animated shots 1.3–1.7× longer than live shots.
4. Use **one signal accent colour** for every label, arrow, number and highlight; never mix accents.
5. Land each chip on its spoken noun, 12–17 f after the cut.
6. Pair arrow → chip with a 12 f lag; keep the arrow bobbing (±8 px, 0.55 s).
7. Give every real-world scale a comparison: a lineup truck, a double-arrow measure, a "for scale, here's Earth" tag.
8. Show both units in small type under big numbers.
9. Switch to a paper-collage mode for history and theory, and use the page peel to enter it.
10. Frame the explanation as a journey the viewer takes ("you and I"), with the camera physically moving deeper.
11. Use magnifier circles to go from the visible to the microscopic.
12. End inserts by handing back to a human face; keep the last 10 % calm and reflective.

**Don't**
1. Don't put paragraphs on screen: 1–3 words per chip, two chips at most.
2. Don't outline the chips or round their corners, and don't use gradients on chips.
3. Don't ease chips in slowly (>8 f); they pop.
4. Don't leave a static frame (hold_frac ≤ 0.11). Always push, bob or drift.
5. Don't run several unrelated graphic styles in one insert; pick render, paper or UI-card mode per insert.
6. Don't cover the subject with labels; use leader lines to the side.
7. Don't use flat 2D vector characters as the main look; this style is 3D renders plus flat overlays.
8. Don't reuse the channel's wordmark, its asterisk motif or its exact lime-on-teal brand pairing in an original
   piece. Keep the *system* and choose your own signal hue and title glyph.
9. Don't let animation run longer than one or two narrated sentences, except in the single deep dive.
10. Don't dissolve everywhere: match dissolves are rare signature moments, and hard cuts are the default.
11. Don't use muted palettes for space scenes; colourfulness runs 37–62 and the hot bodies glow.
12. Don't skip the "for scale" or data moment in a size claim.

## 11. Replication recipe (code)

**Layer stack** (1920×1080, 24 fps, rendered frame by frame from a paused GSAP master timeline):
```
L0  plate        : <video>/image sequence of footage OR full-frame scene <svg> (render mode / paper mode)
L1  grade        : CSS filter on plate (brightness .7 + blur 6px when UI cards are on top)
L2  scene FX     : SVG glow (feGaussianBlur stdDeviation 8–20 + feMerge), grain (feTurbulence baseFrequency .9,
                   numOctaves 2, opacity .06, re-seeded every frame), vignette radialGradient
L3  annotations  : arrows, chevrons, leader lines, measurement arrows (SVG paths)
L4  chips/text   : lime chips (rect + text), display words (text + offset extrusion copies), name supers
L5  UI cards     : HTML divs (comment / article cards) with drop shadow 0 12px 30px rgba(0,0,0,.35)
```

**Render-mode fakes in SVG**
- *Space grid floor*: lines converging to a vanishing point at (960, 640). Line colour #245D8F, opacity fades with
  distance via a linearGradient mask. To fake a gravity well, displace grid vertices with `y += k/(r+ε)` around
  the mass.
- *Glowing star*: a circle with a radialGradient (#FFF6C8 0 % → #F5C43E 35 % → #ED7C13 70 % → #A93311 100 %),
  a surface of feTurbulence (baseFrequency .02, animate the `seed`) composited `in` the circle, and bloom from a
  blurred copy at 40 % opacity.
- *Accretion disc*: 6–10 concentric ellipses (ry/rx = .22) with stroke gradients orange→white, stroke widths
  4–18 px, feGaussianBlur 3, rotating dash offsets for flow. Draw the near half over the black sphere and the far
  half under it.
- *Cutaway object*: flat fills on a side-view silhouette. Animate the state fill colour (blue → red → yellow, 0.5 s
  cross-fade) with chevron arrows for flow.
- If true 3D is allowed, swap L0 for a three.js canvas with a PBR material and a bloom pass. The overlay layers
  stay the same.

**Paper mode**: background #ECE4DC with feTurbulence (baseFrequency .8, type fractalNoise) multiplied at 12 %
opacity and a 12 % edge vignette. Pencil strokes are paths with stroke #555245, width 2.5, linecap round,
drawn on via stroke-dashoffset (0.8–1.2 s, power1.inOut). Add feDisplacementMap scale 1.2 for wobble and
re-seed it every 2 frames for a slight boil. Photo cut-outs are images with filter `grayscale(1) contrast(1.1)`,
a 4 px white border and a drop shadow.

**Page peel (T4)**: an SVG polygon clip on a paper layer, animated from the bottom-right corner to cover the
frame. Fold shading is a linearGradient along the fold line (dark 25 % → 0). 16 f, power2.out.

**Magnifier (T5)**:
```js
tl.from(lens,{scale:0,duration:.25,ease:"back.out(2)"},t)          // circle r=150, stroke #1E6AE8 6px
  .to(lens,{scale:13,duration:.28,ease:"power2.in"},t+1.6)         // fills frame
  .set(microScene,{autoAlpha:1},t+1.88).set(footage,{autoAlpha:0},t+1.88)
```

**Chip component**
```js
function chip(text,{x,y,h=96}){ // lime rect, dark caps, padding .4h, Archivo Black, cap ≈ .5h
  const g = svg.group(); g.rect(textWidth(text,h*.5)+h*.8, h).fill('#C6F80A');
  g.text(text).font({family:'Archivo Black',size:h*.62}).fill('#1A1A1A').move(h*.4,h*.18);
  return g.move(x,y);
}
tl.from(arrow,{x:-30,autoAlpha:0,duration:.15,ease:"power3.out"},word("downforce"))
  .from(chipG,{scale:.85,autoAlpha:0,transformOrigin:"50% 50%",duration:.2,ease:"back.out(2)"},"+=.5")
  .to(arrow,{y:"+=8",duration:.28,ease:"sine.inOut",yoyo:true,repeat:-1});
```
(`word()` returns the TTS word timestamp from the Kokoro alignment.)

**Chevron flow over footage**: N = 18 chevron paths along a spline, fill interpolated #3BD12A → #F2E71A, entry
stagger 0.042 s, then a looping `offset += 1 slot / 0.2 s`.

**Display word with extrusion**: render the text 8 times offset (+1,+1)…(+8,+8) in #1C3F43 under the lime
fill, add a 3 px #1A1A1A stroke (paint-order stroke), enter with `scale 1.2 → 1, back.out(3), 0.3 s`. Use a
textPath on an arc for curved "170,000 YEARS"-type words.

**Minimal insert skeleton**
```js
const ins = gsap.timeline();
ins.set(scene,{autoAlpha:1})                                   // T1 hard cut on sentence boundary
   .fromTo(cam,{scale:1},{scale:1.04,duration:dur,ease:"none"}) // slow push the whole insert
   .add(enterArrowAndChip("CORONA"), word("corona"))
   .add(drawMeasure("~40"), word("forty"))
   .add(reAngleCut(scene2), sentenceEnd(1))                    // T2 second shot of same world
   .set(scene,{autoAlpha:0}, sentenceEnd(2));                  // back to host (hard cut)
```

**The 5 defining shots and how to build them**
1. **Footage + lime callout**: an interview or field plate (L0), an arrow sliding in on the name, a lime name
   caption +12 f, an arrow bob. Or a product plate with downforce arrows and a chip.
2. **Space-grid render with data chip**: a dark navy background, a perspective grid, a glowing body or disc, a white
   leader line to a lime chip ("≈ 10 MILLION °C" plus a small °F line), a slow push. The second shot is a lateral truck
   to a bigger object with a lime "100,000×".
3. **Cutaway machine**: a charcoal stage, a side-cut object, state colours cycling blue → red → yellow with
   chevrons, part chips with leader lines appearing one per spoken noun, a gauge ring with a big lime number.
4. **Paper collage**: a page peel in, a B&W portrait cut-out left, pencil diagram draw-ons, lime and blue display
   words merging, a push-in cut to one sketch.
5. **Magnifier dive**: a circle inset on footage scales through to a full-frame flat micro-world (pale blue
   scalloped ice pebbles, red jump arrows), then a hard cut back to the host.

## 12. Per-video notes (animation only)

- **BKIkTKqWMfg, black hole (42 %).** The most animated video. Its cold open is a single 13.6 s animated POV (avatar
  astronaut, gloved hands, a purple-cyan ring). Space-grid world throughout; accretion discs in orange and in cyan;
  size lineups ("100,000" suns, "~40" solar systems). The paper-collage chapter on spacetime uses a B&W physicist
  cut-out, sketched gravity wells, and "SPACE" + "TIME" merging. A detective-board desk (pinned photos, sticky notes,
  a hammer cracking an orange sphere) carries the information paradox. A funnel diagram has a blue → red gradient
  scale bar ("less distortion / more distortion"). Atoms spaghettify as falling particle streaks. The one long
  sequence is 53 s.
- **VJgdOMXhEj0, F1 (17 %).** Access footage dominates (25.7 cuts/min). The animation is engineering explainer
  work: track maps drawn as white lines on a dark grid, then colour-coded; downforce arrows on a car over a light
  studio floor; an airliner comparison (lift up vs downforce down); chevron airflow composited over **real garage
  footage** with high/low-pressure chips; a ground-effect cross-section with orange/blue airflow ribbons; a DRS
  wing opening with cyan flow; IndyCar on blue with a ghost dissolve; a 72 s engine cutaway (4-stroke, then V6 vs
  V8, then an RPM gauge, then turbo, battery and motor, then a reveal into the full car). Split-screen
  driver-comparison footage carries lime name chips. A 3D-text chapter card ("THE ENGINE") sits in a white garage
  environment.
- **p60I9LNHNxg, curling (25 %).** A flat saturated-blue backdrop with a white 3D sheet; lime labels with a dark
  outline ("THE HACK", "HOG LINE", "THE BUTTON"); team mannequins counted with "8 + 8"; a top-down house diagram
  with "+1"/"+0" scoring rings; a scoreboard table filling in. A hand-painted 2D geology cross-section ("~60
  MILLION YEARS AGO", magma rising into a "GRANITE PLUG") is the only fully 2D painted look across the four videos.
  Magnifier circles show ice pebbles and scratches. A friction demo uses a glass on wood against flat blue.
  Comment-card and news-article stacks with a lime highlighter carry social proof. A cartoon-eyed stones chapter
  card opens "The science of rubbing". Also has a sponsor/partner disclosure line at top.
- **eNkxTjirY-Q, Sun (35 %).** The most colourful (61.8). Journey structure (heliosphere → corona → photosphere →
  radiative zone → core). It mixes real NASA SDO imagery (gold), stylised 3D (spacecraft with yellow thrusters,
  magnetosphere cyan field lines), flat cutaways (a sun halved yellow/orange with red compression arrows), an H-R
  diagram as a glowing chart with an "OUR SUN" callout, fusion particles (blue/red spheres with labels) and a lime
  waveform over a B&W sun photo for the sound segment. Curved display text follows the solar limb. Video-call
  interviews carry lime name supers. Sponsor read straight after the title sting (66 s).

## 13. Source-list issues

- The vidpros list names three Cleo videos (black hole, F1, curling). **eNkxTjirY-Q (Sun) is our addition** as the
  recent example, not from the article.
- **animated_frac overstates animation** in F1 (0.35 against ~0.17 real), curling (0.33 against ~0.25) and slightly in
  the Sun video. Grey studios, ice and blank walls read as flat. Use the verified shares in §2.
- Three of the four are **partner or sponsored** productions (F1 is Red Bull access; curling is with NBC/YouTube; the
  Sun video is sponsored by a telecom). Fine as style sources, but brand-owned renders (team car models) appear
  inside the animation. Don't treat those assets as the show's own style.
- The vidpros subscriber counts are stale (7.51 M listed; 8.91 M at download).
