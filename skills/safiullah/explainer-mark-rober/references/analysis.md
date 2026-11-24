# Mark Rober: the animation layer inside engineering-build videos

Scope: only the **animated and graphic material** is analysed, as the user asked. The surrounding live action
(builds, tests, reactions) appears only where it sets the timing the graphics must fit.

## 1. Identity

Rober's graphics are the **engineer's whiteboard, made to move**. They come in four kinds:
- **flat, outline-free 2D physics cartoons** on a dusty sky-blue field (figure, force arrows, one big number);
- **mission-profile animations** in which a flat camera tracks a balloon or rocket up through an atmosphere gradient
  into a starfield;
- **real engineering screens** (sketch scans, CAD orbits, CFD flow plots, translucent field-of-view volumes);
- **annotations drawn over footage**: a thick coral-red pointer arrow, handwritten physics formulas, a red X, maps
  with a moving GPS dot.

None of it is glossy. It looks like a smart friend's quick After Effects pass that serves one point and then gets
out
of the way. Graphics are rare (about 10 % of runtime) but they land at the exact moments where the build stops
making sense on its own: the plan, the physics, the tracking.

## 2. Sources analysed

| id | title | dur s | cuts/min | median shot s | motion | colourful | WPM | LUFS | real graphics share* |
|---|---|---|---|---|---|---|---|---|---|
| xoxhDk-hwuo | Glitter Bomb 1.0 vs Porch Pirates | 490 | 15.91 | 2.42 | 9.37 | 32.7 | 168 | −13.1 | ≈ 10 % (9 inserts, 48 s) |
| BYVZh5kqaFg | Egg Drop From Space | 1616 | 22.09 | 1.92 | 14.49 | 41.3 | 195 | −15.1 | ≈ 10 % (16 inserts, 168 s); 2D-flat only 6 % |
| ZKbv4cnVa3c | Saving Our Oceans With a LEGO Machine (**RJMBricks**, not Rober) | 640 | 10.68 | 3.73 | 18.02 | 60.2 | 188 | −8.8 | ≈ 3 % (meme captions, text cards) |

\*The `animated_frac` metric reports 0.36 and 0.32 for the two Rober videos. Both figures are inflated: night-vision and
dark onboard camera footage (glitter bomb), and plain sky and space shots (egg drop), score as "flat". I re-ran the
flat-second detector and kept only runs that I confirmed by eye as graphics. Insert lengths and the cuts at their
edges were measured from those runs.

## 3. Measured pacing

| measure | value | rule for a rebuild |
|---|---|---|
| hard cuts / min (whole) | 15.9 – 22.1 | 16–22 |
| median shot | 1.9 – 2.4 s | live shots ≈ 2.5 s mean |
| graphics share | ≈ 10 % | 8–12 %. Graphics are a seasoning, not the meal |
| inserts per minute | 0.6 – 1.1 | about one graphic insert every 30–45 s (median gap 32 s and 39 s) |
| insert length | median 3 s (glitter) / 7.5 s (egg); p90 13–25 s; max 17–33 s | 3–10 s, plus **one 20–30 s "plan" animation** near the start |
| cut rate inside graphics vs live | 9.3–12.5 vs 16.3–23.6 / min | graphic shots last 1.5–2× longer (≈ 4 s against 2.5 s) |
| how inserts start | hard cut 94–100 % | always a hard cut in |
| how inserts end | hard cut 56–89 % | graphics often hand off to look-alike footage (sky to real sky), where the cut barely registers |
| hold_frac | 0.07 – 0.16 | more static holds than Cleo Abram, because the reveal/comedy beats sit on stillness |
| silence | 3.1 – 3.3 s total | short dead-air beats before reveals and punchlines |
| motion curve | climax decile peaks at 1.5–2× the mean (glitter decile 7 = 15.3; egg decile 9 = 22.2) | build tension toward the payoff; the final decile is calm (glitter 2.2) |

In practice the video is a build/test log edited at YouTube speed. A graphic appears when the viewer needs a model
in their head ("how will this work?", "why does it fall at 120 mph?", "where is the package now?"). It lasts one
narrated sentence or two, then cuts back to hands, faces or hardware.

## 4. Script & narrative structure

| % of runtime | beat | animation role |
|---|---|---|
| 0–3 % | **Cold open on the payoff**: "This is space, and this is an egg…" / "This guy took a package… now he's about to open it." | red pointer arrows synced to the nouns; formula scribbles over footage |
| ~3 % | **Rewind hook**: "first, we need to rewind a bit." | none |
| 3–15 % | Backstory, motivation (felt powerless, so he over-engineers a fix), credentials (NASA/JPL hardware), then **the plan** | **one 20–30 s mission-profile animation** covering the whole plan end to end (egg drop 0:44–1:09) |
| 15–80 % | The problem is broken into smaller steps: test, fail, fix loops, with friends and experts | short 2D physics inserts (terminal velocity), CAD/CFD screens, test-rig diagrams, maps, "ATTEMPT 2" tags |
| 80–95 % | **Climax**: the drop, or the thief opening the box | multi-cam split screens, captions, almost no animation |
| 95–100 % | **Moral** (don't steal / learn from failure, plus tenacity), then CTA | sponsor or own-product segment (egg drop: about 100 s, 6 %), or a "please consider subscribing" mono caption on black |

Section handovers are spoken ("the next step in our DIY space program") and land on a hard cut.
Failures are played for comedy, often with a held silent beat followed by a reaction.

## 5. Visual system

### Palette roles (sampled from frames)
| role | hex | where |
|---|---|---|
| sky field (main 2D background) | **#88B6CA** (variation #7AA5B8 – #8DBACF) | physics cartoons, mission profile |
| cloud | #F1F7FA – #FFFFFF, flat | drifting cloud puffs |
| ground | #567D64 green strip | horizon / landing zone |
| upper atmosphere → space | #88B6CA → #357E90 → #0C252E → #010303 (vertical gradient) | altitude transitions |
| force / pointer arrows | **#DD6751** coral red (pointer arrows on footage are a pure red, #E8322A) | arrows, X marks |
| big numbers / labels | #FFFFFF bold, small #FFFFFF caps | "120 MPH", "GRAVITY" |
| figure | skin #E8C8A0, clothes #626669 grey | the stick-style person |
| rocket | body gradient #66E47C → #F2D06B, fins #B6C7C0 grey | rocket close-ups |
| balloon | #D2D6D8 light grey | ascent |
| landing target | #CAA7C1 pink mattress | the payoff object |
| map ocean / land | #1E5A72 teal / #558968 stipple dots | world map |
| street map | #F2F2F1 base, #C1DFB8 parks, white roads, orange route ≈ #F0782D, blue house diamond | GPS tracking |
| CAD stage | #707070 → #B6B2B2 grey gradient; translucent red volumes ≈ #C0392B @ 45 %; yellow faces #E8C21B | design-intent diagrams |
| desk cut-out board | #A38668 wood, #D57B26 orange accents | "theirs vs mine" comparisons |

### Shape language and line work
- 2D cartoons: **flat fills, no outlines, no gradients** except the rocket body. Shapes are simple primitives:
  circles (heads, clouds), rounded rectangles (torsos), trapezoids (fins), a teardrop (balloon).
- Arrows: a filled rectangular shaft plus a triangular head, no stroke. Force arrows are about 96 px wide at the
  head and about 200 px long at 1080p. Their **length encodes magnitude** and grows as the magnitude grows.
- Pointer arrows on footage: a thick, slightly hand-drawn coral or pure-red arrow (YouTube-thumbnail style),
  about 120–160 px long.
- Handwritten overlays: a white marker or chalk script, stroke weight about 4–6 px, set at an angle.
- Engineering screens are shown as they are: CAD software UI chrome, CFD colour legends, real sketches on paper.

### Texture, lighting, depth
- 2D scenes have no texture and no lighting, just flat colour. The only atmospheric touches are white
  semi-transparent speed-streak wedges around a fast object and the sky-to-space gradient.
- Depth comes from **parallax clouds** (2–3 speeds) and a **tracking camera** that follows the payload.
- CAD diagrams use the software's own grey gradient background and translucent volumes.

### Composition
- The payload sits centred or slightly left; forces are drawn vertically through it; labels sit at the arrow tips.
- The big number goes **left of the subject** at about x = 330–660, cap height about 148 px, with a unit line of
  about 100 px and a conversion line of about 25 px underneath ("120 / MPH / (200 km/h)").
- Footage tags such as "ATTEMPT 2" sit lower-left in white bold caps, about 30 px.
- Dialogue captions: white sans, bottom-centre. Stage directions go in asterisks ("*glitter spin*").

### Typography (estimated at 1080p)
| element | look | size | free look-alike |
|---|---|---|---|
| big number | geometric bold sans, white | 148 px digits + 100 px unit + 25 px conversion | **Montserrat ExtraBold** |
| force labels | geometric sans caps, white, letter-spaced | ~20 px | Montserrat Bold |
| formulas on footage | handwritten white marker | 40–60 px | **Caveat** / Kalam |
| scale tags in diagrams ("SPACE", "10,000 ft") | small white caps in a dark chip | ~16 px | Montserrat Bold |
| footage tags ("ATTEMPT 2") | bold condensed caps, white | ~30 px | Oswald Bold |
| comedy captions / subscribe | lowercase monospace, white on black | ~20 px | IBM Plex Mono |
| map disclaimer | tiny black sans, top-left ("(not my actual house location)") | ~14 px | Inter |

## 6. Characters & objects

- **Person (physics cartoon)**: about 4 heads tall. A beige circle head with **no face**, a grey rounded-rectangle
  torso, and rectangle limbs set in fixed poses. Acting is **rigid-body only**: the whole figure tips from
  standing to a belly-down skydive pose over about 1 s (pose swap plus rotation, no limb rig). There is no line
  boil and no squash.
- **Payloads**: balloon, rocket and egg as flat icons. In close-up the rocket shows its fins, gradient body and an
  orange nose. There is a comparison "exploded" stack (two rockets side by side, stages separating vertically).
- **Infrastructure icons**: laptop, pole with red flags (wind socks), mattress, house diamond, map pins.
- **Real objects stay real**: when the actual device matters (the bait package, the fin servo), it is either filmed
  or shown as a CAD render, never cartooned. The cartoon layer is only for the abstract system.
- **The red arrow** is the recurring "character" on footage. It points at the egg, at a person in a crowd, at a
  balloon tear.

## 7. Camera & transitions catalogue

Frame counts are at 24 fps; multiply by 1.25 for 30 fps.

| # | transition / move | construction | duration | frequency |
|---|---|---|---|---|
| R1 | **hard cut footage → 2D** | straight cut, often on "So…" or "And…"; the graphic is already complete in its first frame | 0 f | ~100 % of entries |
| R2 | **look-alike exit** | the 2D sky cuts to a real sky shot of the same colour, so the cut barely reads | 0 f | about 40 % of exits |
| R3 | **tracking ascent** | the camera follows the payload upward; clouds stream down; the sky gradient darkens to black over about 2–3 s; stars fade in at roughly 60 % of the climb | 5–8 s | once per plan sequence |
| R4 | **scale cut** | cut from a tiny far payload to a close-up of the same object (the rocket fills 40 % of the frame), and back out | 0 f | 2–3 per sequence |
| R5 | **wide atmosphere strip** | a very wide horizontal cross-section of the layers, a dashed "SPACE" line, a balloon rising, a small scale tag appearing | 4–6 s | rare |
| R6 | **map zoom / route draw** | a street map with a pulsing orange dot; the route line draws on in GPS-update steps (one segment every 0.5–1 s); the map re-frames by hard cuts to tighter crops | 10–15 s | glitter-bomb tracking |
| R7 | **CAD orbit flurry** | 4–6 screen-recorded CAD views at 6 f each, ending on a held render | ~1–1.5 s | design beats |
| R8 | **sketch scan hold** | a scanned paper sketch letterboxed on black with a slow push of about 3 % | 1–2 s | before CAD |
| R9 | **annotation pop on footage** | arrows, formulas and X marks appear in 1–3 f with no motion blur | — | hook and reveal beats |
| R10 | **multi-cam grid** | 2–4 synced camera feeds tiled edge to edge with no gutters, captions underneath | long holds | climaxes |

## 8. Motion grammar

- **Easing**: plain and functional. Linear for drifts and tracking; ease-in-out (sine/power1) for pose rotations
  and camera moves; **no overshoot** on 2D elements. Pops on footage annotations are instant.
- **Force arrows**: they grow from the body outward. The `scaleY` origin is at the body, 0 → full in 6–10 f.
  A resistance arrow keeps growing over about 40 f as speed builds (the length is the data). Its label fades in
  12–20 f **after** the arrow appears, once the narration names it. When both forces are equal, the arrows match
  length; speed streaks then appear (white wedges at 30–40 % opacity, slight flicker) and the big number
  replaces the arrows.
- **Clouds**: drift at a constant speed, 20–60 px/s depending on the layer. While the camera tracks a fall or
  ascent, clouds stream past at 300–600 px/s.
- **Pointer arrows on footage**: they appear on the spoken noun (each one on screen about 22 f) and drift 10–20 px
  toward the target while visible. A second arrow follows the second noun ("space" → "egg").
- **Formula scribbles**: 2–3 equations appear one after another, 5 f apart (fade or slide in from the right over
  3 f). They are held about 10 f, then a hard cut lands on a red X stamped on the ground (pop with scale
  1.2 → 1 over 3 f).
- **Build-on order**: scene → subject → first force → its label → second force → its label → result number.
  Each step waits for its word, so spacing runs 0.5–1.5 s.
- **Holds**: completed diagrams are held 2–4 s; the big number is held 1.5–2 s before the cut back to footage.
- **Map**: the GPS dot pulses with a ring (scale 1 → 2, opacity 0.6 → 0, 0.8 s loop). Each route segment draws
  in about 8 f.
- **Rhythm vs narration**: every graphic event lands on a noun or number in the VO. Inserts last one or two
  sentences (about 15–25 words at 170–195 WPM, so 5–8 s).

## 9. Sound (inferred; audio not heard)

- **VO**: Rober himself, an energetic, joke-dense, conversational delivery at 168–195 WPM. Self-deprecating
  asides land in silence beats (3.1–3.3 s of total silence).
- **Music**: caption tags mark "(upbeat music)", "(dramatic music)" and "(uplifting music)", so there are bed
  changes per act: upbeat for the build, dramatic for the attempt, uplifting for the moral. Integrated loudness is
  −13.1 to −15.1 LUFS.
- **SFX**: caption-tagged practical sound ("(motor spinning)", "(rocket crashing)", "(impact)", "(wind rushing)",
  "(chicken squawking)") and **censor bleeps** (14 "(beep)" tags in the glitter-bomb video). For the 2D inserts,
  infer soft whooshes on scale cuts and a "ding" or pop on the big number.
- **Ducking (inferred)**: the music drops under the VO and comes back up in the silent reaction beats.

## 10. Do / Don't

**Do**
1. Keep graphics to about 10 % of runtime, one insert every 30–45 s.
2. Put the **whole plan** in one 20–30 s mission-profile animation near the start.
3. Use flat, outline-free shapes on a single dusty sky-blue field.
4. Make force-arrow **length carry the quantity**, and grow it live.
5. Finish each physics insert with one big white number and its unit conversion underneath.
6. Track the payload with the camera and let the sky gradient tell you the altitude.
7. Point at things in footage with a thick red arrow, timed to the noun.
8. Show the real engineering tools (sketch → CAD → CFD) as screen captures; that honesty is part of the style.
9. Hard-cut into graphics; where you can, exit to footage of a similar colour.
10. Add human jokes to diagrams in small type ("not my actual house location").
11. Hold completed diagrams for 2–4 s so the idea lands.
12. Animate only what the narration names, in narration order.

**Don't**
1. Don't add outlines, textures, shading or lighting to the 2D shapes.
2. Don't give the cartoon figure a face, expressions or limb rigs. It is a moving pictogram.
3. Don't overshoot, bounce or elastic-ease the diagrams.
4. Don't put more than two labels on a diagram.
5. Don't run long animated sequences in the middle of a video. The build footage is the star.
6. Don't cartoon the real device. Film it or show its CAD.
7. Don't use the punchy accent palette of the 3D-explainer channels. Keep it muted: sky blue, coral, white.
8. Don't put graphics on climax footage. Let reactions play, with captions only.
9. Don't fade between footage and graphics. Use hard cuts.
10. Don't copy the creator's logos, his product branding or his recurring props. Rebuild the grammar with
    original objects.

## 11. Replication recipe (code)

**Layer stack** (1920×1080, 24 or 30 fps, GSAP master timeline seeked frame by frame):
```
L0  world      : <g id="world"> tall SVG (1920 × 12000) holding the sky gradient, clouds, ground, stars
L1  camera     : transform on #world (translateY follows payload; scale for scale-cuts)
L2  subject    : payload / figure group (pivot at centre of mass)
L3  forces     : arrow groups (rect shaft + polygon head), transform-origin at body
L4  labels     : white Montserrat text, big-number block
L5  footage    : <video> plate for annotation shots with SVG overlay (red arrow, handwriting, X)
```

**Sky world**: a linearGradient on the tall rect with stops 0 % #010303, 35 % #0C252E, 55 % #357E90,
75 % #88B6CA, 100 % #88B6CA. Clouds are groups of 3–5 overlapping white circles in 3 layers; give each layer a
parallax factor (0.3 / 0.6 / 1.0) applied against the camera Y. Stars are 200 random 2–3 px circles whose opacity
is tied to camera altitude.

**Figure rig**: `<g id="person">` containing a circle (r = 18, #E8C8A0) and rounded rects (torso 30 × 60, #626669;
legs 10 × 50). For the pose change, rotate the group −80° about its centre over 1 s (sine.inOut) while swapping
the leg/arm sub-groups at the midpoint.

**Force arrows**
```js
function forceArrow(dir, color="#DD6751"){ // shaft 34px wide, head 96x60
  const g = draw.group(); g.rect(34,140).move(-17,0).fill(color); g.polygon('-48,140 48,140 0,200').fill(color);
  if(dir==="up") g.rotate(180,0,0); return g;
}
tl.fromTo(gravity,{scaleY:0},{scaleY:1,duration:.3,ease:"power2.out",transformOrigin:"50% 0%"}, word("gravity"))
  .from(gravLabel,{autoAlpha:0,duration:.25}, "+=.6")
  .fromTo(drag,{scaleY:.05},{scaleY:1,duration:1.7,ease:"power1.in",transformOrigin:"50% 0%"}, word("air"))
  .from(dragLabel,{autoAlpha:0,duration:.25}, "<+.8")
  .from(streaks,{autoAlpha:0,duration:.3}, word("balances"))
  .set([gravity,drag,gravLabel,dragLabel],{autoAlpha:0}, word("120"))
  .from(bigNumber,{autoAlpha:0,duration:.08}, "<");                 // snap in, no ease
```

**Mission-profile camera**
```js
tl.to(payload,{y:-9000,duration:6,ease:"power1.inOut"},t)
  .to(world,{y:9000,duration:6,ease:"power1.inOut"},t)            // camera locked on payload
  .to(stars,{opacity:1,duration:2},t+3.5)
  .set(cam,{scale:4},t+8)                                          // scale cut to rocket close-up
  .to(rocket,{rotation:-6,yoyo:true,repeat:3,duration:.4,ease:"sine.inOut"},t+8);
```

**Footage annotations**
```js
tl.set(redArrow,{autoAlpha:1,x:60},word("space")).to(redArrow,{x:40,duration:.9,ease:"none"},"<")
  .set(redArrow,{autoAlpha:0},word("egg")).set(redArrow2,{autoAlpha:1},"<")
  .from(["#f1","#f2","#f3"],{autoAlpha:0,x:30,duration:.12,stagger:.2},word("math"))   // Caveat formulas
  .fromTo(redX,{scale:1.25,autoAlpha:0},{scale:1,autoAlpha:1,duration:.12},word("here"));
```

**Map tracker**: a neutral map base drawn from simple shapes (do not copy a real map provider's styling or tiles):
off-white #F2F2F1, white road strokes 10 px, green park rects #C1DFB8. The route is a polyline with
stroke #F0782D, width 8 and linecap round; reveal it with stroke-dashoffset in steps (`ease:"steps(1)"` per
segment, one segment every 0.6 s). Add a pulsing dot and a blue diamond for "home", plus a tiny joke disclaimer
top-left.

**CAD look without CAD**: a grey linearGradient background (#707070 → #B6B2B2), the white part as faceted
polygons (3 greys for faces), translucent red frustums (fill #C0392B, opacity .45, stroke none) projecting from
sensor faces in yellow. Orbit by animating a pseudo-3D projection, or use three.js with flat shading.

**The 5 defining shots and how to build them**
1. **Falling-figure force diagram**: a sky field, drifting clouds, the figure tipping into a skydive, gravity and
   drag arrows growing to equal length, speed streaks, then a hard swap to "120 MPH (200 km/h)" at left.
2. **Mission profile**: a balloon lifting the payload through the gradient, stars appearing, release, a scale cut to
   the rocket close-up with fins steering, payload released over the pink target. One 20–30 s insert.
3. **Annotated footage hook**: a real hero shot with red pointer arrows on "this is…" nouns, then 2–3 white
   handwritten formulas appearing over a landscape and a red X on the target spot.
4. **Engineering screen montage**: a scanned sketch (push), 4–6 quick CAD orbit views, a translucent-volume
   diagram explaining coverage, a CFD-style flow plot (particles coloured by speed with a legend).
5. **Map chase**: a neutral street map, a pulsing dot moving in GPS jumps, the route drawing on, cut-ins to the
   driver reacting.

## 12. Per-video notes (graphics only)

- **xoxhDk-hwuo, Glitter Bomb 1.0 (≈ 10 %, 9 inserts, median 3 s).** Graphics follow the design story: a sketch scan
  on black (1:10), a Fusion-style CAD orbit flurry (1:11.5–1:12.8), a translucent red camera-coverage cone diagram
  (2:21.5–2:23.8, 2.3 s), and a staged shipping-label insert with a film-reference gag. Map tracking runs
  4:38–5:09 and 5:49–5:53 (orange route, pulsing dot, joke disclaimer). The climax is a **4-up onboard camera grid**
  with white dialogue captions and asterisk stage directions. It ends on a lowercase mono "please consider
  subscribing". `animated_frac` 0.36 is mostly dark onboard footage and black frames.
- **BYVZh5kqaFg, Egg Drop From Space (≈ 10 %; flat 2D ≈ 6 %).** The cold open has red pointer arrows (0:00.6–0:02.5)
  and formula scribbles plus a red X (0:06.6–0:07.6). The 24 s mission-profile animation runs 0:44.5–1:08.5. The
  terminal-velocity figure diagram (1:21–1:35) ends on "120 MPH". There is an atmosphere-layer strip (3:09–3:14),
  a rocket fall close-up, a fin-servo side diagram with red target rings (4:53–4:57), and a telemetry/flags test-rig
  diagram (8:41–8:49). A **stippled-dot world map** appears at 9:04–9:11. Other graphics: CFD flow screens
  (7:19, 15:24), a "theirs vs mine" rocket comparison on a wood-board background (15:23), a rocket-stack
  comparison on sky blue (17:44–17:53), CAD renders of the release mechanism (18:29), red arrows on mission-control
  footage, and "ATTEMPT 2" tags. There are no chapters. The own-product promo runs about 100 s at the end.
- **ZKbv4cnVa3c, LEGO ocean machine (RJMBricks, ≈ 3 %).** Amateur meme-edit graphics: bold white italic
  "UNDERWEAR" with a curved red arrow over footage (0:06.5), a clip-art rock with a hand-lettered "You" and a red
  arrow (0:11, a "living under a rock" gag), a borrowed campaign card (0:14), a calendar UI, a crossed-out trash-bag
  clip-art icon (0:44), white captions over footage ("Pieces get pushed away"), plain black text cards ("It would
  be so cool :)", "Please subscribe. 1 sub = 1 cent"). It runs 640×360 at 30 fps and is mastered at −8.8 LUFS
  (very loud, not normalised). None of this is Rober's graphic language.

## 13. Source-list issues

- **ZKbv4cnVa3c is misattributed.** The vidpros article lists "Saving Our Oceans With a LEGO Machine" as one of three
  Mark Rober starter videos. The download metadata shows uploader and channel **RJMBricks** (@RJMBricks,
  channel UCwsvtU88eu2-fqQhTqrbwWw), against Rober's UCY1kMZp36IQSyNx_9h4mpCg. The description says "Current sub
  count: 2,086" and tags Rober and MrBeast. It is a small creator's fan entry for the TeamSeas campaign, made in a
  different style. Exclude it from the Rober style sample; if a third Rober video is wanted, pick another build
  video from his own channel.
- **`animated_frac` misleads for both real Rober videos** (0.36 and 0.32, against about 0.10 real). Dark onboard
  camera footage, black frames and empty sky register as flat. Use the verified shares in §2.
- **Mark Rober is a live-action build creator.** His animation is functional and sparse. As a source of "animated
  explainer style" he contributes a *diagram-insert grammar*, not a full animated look.
- The vidpros subscriber count is stale (73.7 M listed; 84.8 M at download).
