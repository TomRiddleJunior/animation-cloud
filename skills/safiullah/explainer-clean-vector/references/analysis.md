# Clean-vector hub explainer: one hero object on white, primitive morphs, colour-field portals, confetti

Analysed 2026-10-27 from the Reddit r/MotionDesign thread's opening post, which pairs these two videos as one style
(it praises the clean vector style and motion principles, and places Ahrefs in line with the Reddit mobile video).
Inputs: `frames/cCnTVd9nMoY/`, `frames/krzF3YhmSMw/`; frame-exact strips I cut at 2–3-frame steps
(`scratch_reddit/rm_a–d.jpg`); single-frame colour samples and crops (`rm_still_*.png`, `rm_crops.png`); a per-frame
change profile (`rm_fd.txt`, `ah_fd.txt`). Ahrefs' transitions were already measured frame by frame in
`flat-character.md` §7 (T8–T13) and are cross-referenced here rather than repeated (`flat-character.md` = the
`explainer-flat-character` skill's `references/analysis.md`). Audio was never heard.

**Relation to `flat-character`:** that skill is a character-led problem → solution story and keeps the Ahrefs look
as its "line-icon dialect". This style is the object-led sibling: no protagonist, one hub object, worlds behind
cards, and the motion craft is the show. Use flat-character when a person with a problem drives the film; use
this when a product, an app or a list of things drives it.

---

## 1. Identity

A 60–95 s, voice-over-led announcement or explainer in which **one hero object sits dead centre on near-white and
acts as the hub**. Reddit's is an orange-red phone; Ahrefs' is a browser window or monitor. Every topic is a card
inside the hub. The card **blows up into a full-bleed flat colour field** (mint, sky blue, sun yellow, charcoal,
navy) where a tiny icon story plays, then **collapses back into the hub**. Everything is built from geometric
primitives that obey classic motion principles: squash on landing, anticipation before launch, back-out pops,
overlapping secondary parts, arcs. The primitives **morph into each other**: circle → pill → gamepad; square →
monitor; phone → rocket; dot → logo. Confetti specks, rings, sparkles, dashes and dashed concentric rings drift
at the edges, so the frame never quite freezes. There are no protagonists: at most avatar busts or a small mascot.
The narrator may share the track with off-screen voices for running gags. The two dialects are **solid-fill**
(Reddit: no outlines, thin teal accent lines) and **outline** (Ahrefs: uniform 5 px navy stroke).

## 2. Sources analysed

| id | title (uploader, year) | dur s | fps | cuts/min | median shot s | scenes/min (histogram) | vignettes/min (by hand) | motion mean / p90 | hold | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| cCnTVd9nMoY | Reddit's New Mobile App (Reddit, 2016) | 75.5 | 24 | 0.80 | 37.7 | 7.95 (median 5.3 s) | **≈ 17** (19 vignettes before the logo, median ≈ 3.5 s) | 4.62 / 8.58 | 0.265 | 61.0 | 146.3 | −22.5 |
| krzF3YhmSMw | What is Ahrefs? (Ahrefs, 2016) | 91.1 | 30 | 1.98 | 23.2 | 1.98 (median 23.2 s) | **≈ 12** (17 vignettes in 85 s, median ≈ 5 s) | 2.89 / 6.38 | 0.337 | 31.9 | 135.7 | −12.4 |

| frame-change profile (native fps) | Reddit | Ahrefs |
|---|---|---|
| exact-hold frames (no pixel change) | 11 % | 2.4 % |
| near-hold frames (< 0.05 % pixels change) | 15.6 % | 18.9 % |
| motion bursts (> 0.4 % pixels changing) | 39.8/min (median 13 f long) | 36.3/min (median 5 f) |
| brightness / dark frames | 0.893 / 6.7 % (night theme) | 0.849 / 0 % |
| silence | 1.2 s | 0.7 s |
| motion deciles | 2.5 3.9 4.8 5.5 6.1 4.2 **9.6** 2.7 6.5 0.6 | 1.4 1.7 1.2 **6.1** 4.4 0.6 0.4 1.4 **8.7** 3.0 |

The histogram scene metric sees Reddit's colour-field swaps but not swaps on the same white ground; Ahrefs
changes vignette by morphing on white, so it reads only 1.98/min. The hand counts are the real pacing.

## 3. Measured pacing

| quantity | target | what it means in practice |
|---|---|---|
| duration | 60–95 s | announcement 75 s, explainer 90 s |
| hard cuts | 0–2/min | only for a white ↔ colour-field palette swap that keeps the layout (Reddit 47.75 s day → night theme; Ahrefs' three navy cuts hidden behind swoosh lines) |
| vignette change | every 3–6 s (12–17/min) | one card/world per listed item; quick lists (Reddit's "gaming, sports, astronomy, DIY") drop to 1–1.5 s per item |
| hub return | every 2–3 vignettes | the hub is home base; the viewer re-orients each time it comes back |
| motion mean | 3–5 (p90 6–9) | calm overall; energy sits in 10–20-frame transition bursts |
| exact freezes | ≤ 12 % | confetti and doodles drift, so `hold_frac` (26–34 %) overstates stillness |
| motion curve | two peaks: the middle colour-world run (Reddit decile 7) or the pivot (Ahrefs decile 4), then the finale (decile 9); the last decile is the calm logo hold | build the energy into a finale before the logo |
| brightness / colourfulness | ≥ 0.85 / 30–60 | white ground dominates; colourfulness 60 only when full-bleed colour fields are used |
| speech | 135–150 WPM, silence ≤ 1.2 s | wall-to-wall VO, but gags need 0.3–0.5 s beats |
| logo resolve | last 7–10 % | Reddit 67.6–75.5 s (10 %), Ahrefs 85–91 s (7 %) |

## 4. Script & narrative structure

**Two openings.** Premise-led (Reddit): a universal truth about the audience, then the product as the place
where it happens. Problem-led (Ahrefs; its beat map is in `flat-character.md` §4): "Here's the problem", a
navy-field question, the product, features, proof. Both have no title card. The first object is on screen by
2 s and the hub by 6–10 s (Ahrefs browser 5.8 s; Reddit phone 10.2 s).

**Reddit beat map (75.5 s)**

| s | % | beat | picture |
|---|---|---|---|
| 0–8 | 0–11 | premise: we all want community, sharing, everyone gets a vote | a white "space" of confetti, a UFO, a ringed planet with speech bubbles; the UFO's beam spits out up and down vote arrows (the brand idea as icons) |
| 8–10 | 11–13 | product name and promise | the phone falls onto a blue planet; a dust-cloud squash |
| 10–41 | 13–55 | community montage, one example per sentence (news + fitness, shower thoughts, cute animals, ask-me-anything) | card → full-bleed world per example: alien-landing post, mint shower world, mint "aww" world with the mascot, white AMA card, blue gamepad and solar-system worlds |
| 28.8–31.5, 39.8 | 38–42, 53 | **gags 1–2**: an off-screen voice asks a question, the narrator answers with a one-word visual payoff; a second voice adds "You can ask me anything" | confetti burst on the payoff word |
| 41.7–49 | 55–65 | feature list (card/compact views, image upload, night theme) | inside the hub; night theme = hard cut to charcoal with the hub in the same place |
| 49–64 | 65–85 | "never been easier": interest list (gaming, sports, astronomy, DIY, GIFs) | 1–2 s worlds via iris and morphs (sun, planet → hammer); **gag 3**: a GIF-pronunciation argument (59–63 s) |
| 64–67.6 | 85–90 | self-aware finale: a community "for climactic fireworks to end a short video" | the phone morphs into a rocket; fireworks of dashed concentric rings around the hub |
| 67.6–75.5 | 90–100 | resolve | the phone collapses to a dot; the dot bounces into the logo mark; wordmark, availability line, store badges |

**Hand-overs:** the hub card blows up (T2), the world collapses back (T3), primitives morph (T6–T8), a circle
irises open (T5). **Never a fade.**

**Gag grammar (Reddit):** 3 gags in 75 s (≈ one per 20–25 s), each a 2–4 s exchange between the narrator and an
off-screen voice, landing on a single word with a visual payoff (confetti, a mascot prop). Ahrefs has none, and
the thread's OP disliked its VO. Humour is optional, but a flat ad read hurts this look.

**Ending:** a CTA line (Ahrefs "Start your free trial" pill on navy) or availability text (Reddit), then the logo on
the ground colour.

## 5. Visual system

### Palette (single-frame samples, ±5 per channel after video compression)

| role | Reddit (solid-fill dialect) | Ahrefs (outline dialect, from `metrics.json`) |
|---|---|---|
| ground | #f9f9f9–#fcfcfc (96–98 % of a white frame) | #f5f6f9 (66 %) |
| hub / primary | orange-red #e93d06 (phone body; 1.5–3.5 % of pixels) | navy #0e3e7c (outline + fields, 23 %) |
| colour-field worlds (one per world) | mint #11eabe, sky #30a5ec, sun #f1c00e, night #202020 | navy #0e3e7c only |
| accents | teal #20dfb9 / #24d0b0 (lines, card headers), yellow #f3b110 (cards), coral #dc3e1a, lavender-blue arrow ≈ #7d8cf0 *eyeballed* | teal #478a92, coral #d87c4d, sand #e6c39f |
| depth / shadow | none | stacked offset copies #d4e5f1 / #9cb5cc |
| UI lines / text | grey #808684 microtext bars | navy captions |

Rules: one ground, one hub colour, 3–4 field colours, **each field colour owns one world** and comes back only for
the same topic. Fields are fully saturated, flat and edge to edge. On white scenes accents stay under 5 % of
pixels (Reddit saturation 0.316 overall, from big white areas plus small saturated shapes).

### Shape language
- **Hub:** Reddit's phone is 162 × 346 px at 720p (**≈ 243 × 519 px at 1080p: 22 % W, 48 % H**), centred at
  x = 50 %, y ≈ 42 %. The top and bottom bezels are domed caps (corner radius ≈ 30 % of the width); the screen
  between them holds 2–3 stacked cards (a teal header bar, an image block, grey text bars, small up/down arrows).
  A thin teal "cable" stem drops from the bottom cap to a ~200 px horizontal ground line. Ahrefs' browser/monitor
  is ≈ 630 px wide on a dashed ground line at 62 % H.
- **World icons:** each world holds one small object, 8–15 % of the width (gamepad ≈ 160 px wide at 1080p),
  centred, made of 2–5 primitives: circles, pills, rounded rectangles, triangles.
- **Confetti kit:** dots 6–12 px, rings 18–30 px, 4-point sparkles, 20–40 px dashes, arcs with motion trails,
  small capsules, dashed concentric rings (6–8 dash segments per ring) for fireworks. About 40–80 specks in the
  "space" opening, 10–20 elsewhere, always at the edges, never over the hub.

### Line work (1080p)
- Solid-fill dialect: **no outlines on solids**. Accent strokes are 3 px (2 px at 720p) teal with round caps:
  orbits, the cable, beams, trails, curly motion marks and dashed rings. Thin 45° highlight stripes appear on big
  spheres (the planet).
- Outline dialect: a uniform 5 px navy stroke with round caps and joins on every object (see `flat-character.md`
  §5). Keep it constant under zoom with `vector-effect: non-scaling-stroke`.

### Texture, lighting, depth
Perfectly flat: no gradients, glows, grain or drop shadows. Depth comes only from scale (the hub rushing toward
the camera), overlap and Ahrefs' offset stacks. Everything sits on a single plane.

### Composition
The hub is dead centre and fills 45–50 % of the height. A white frame is 85–95 % negative space. Colour worlds
centre one small icon in a sea of colour. A mascot, when present, enters bottom-centre, cropped at the chest
(Reddit "aww" world).

### Typography
- Solid-fill: almost no type. UI microtext lives inside the cards; the end card has a lowercase wordmark under the
  mark, a grey ~28 px availability line and two store badges.
- Outline: lowercase captions under objects (≈ 42 px cap height; letters bounce in) and word-by-word headlines on
  navy. Free look-alikes in the engine: **Nunito 700** or **Fredoka**.

## 6. Characters & objects

- **No protagonist.** Use an optional original mascot (a round white blob, two dot eyes, one antenna; give it props
  for gags: a hat, a monocle), avatar busts in circles (Ahrefs), or nothing.
- **Objects act** rather than sit. A UFO beams; a planet turns into a hammer and hammers; rockets dip, then launch;
  a coin stack grows; an hourglass flips. Every object is built so it can morph from the previous one's primitive.
- **Construction order:** silhouette primitive (circle, pill, rounded square) lands → interior details pop
  (2-frame stagger) → secondary bits draw on (cords, trails, ring orbits) → a confetti burst if it is a payoff.
- **Recurring props:** phone/browser hub, up/down arrows in circles, chat bubbles, gamepad, atom, ringed planet,
  sun, hammer, rockets, fireworks; Ahrefs' magnifier, coins, hourglass, browser lists and circuit traces.
- Never reuse the real app's mascot, logo shapes or screenshots. Reddit's finale shows real photos inside the phone
  UI; replace them with drawn placeholders.

## 7. Camera & transitions catalogue

Measured at 24 fps (Reddit) unless noted; Ahrefs at 30 fps (`flat-character.md` §7).

| # | transition | frame-by-frame build | duration | easing | frequency |
|---|---|---|---|---|---|
| T1 | **Hub split-open reveal** (10.21–11.08 s) | an orange rounded pill lands and squashes for 2 f; it splits at mid-height, top bezel up and bottom bezel down (6 f); the white screen appears in the gap; cards pop top to bottom (teal header, yellow image block) with a 2–3 f stagger | ≈ 21 f | back.out(2) caps; power3.out split | 1× (hub birth) |
| T2 | **Card blow-up to a full-bleed world** (14.46–15.0, 19.08–19.33 s) | the bezels fly out of frame top and bottom (3–4 f, expo.in); the chosen card stays and scales to fill the frame (5–6 f) with a 1-frame white margin before it covers; the world's icon builds inside | 10–12 f | expo.in → power3.out | the house transition (≈ 8×) |
| T3 | **World collapse back to the hub** (42.33–42.83 s) | the full-bleed field shrinks to card size (6 f) while the bezels slide in from top and bottom (4 f, overlapping); confetti reappears around the hub | ≈ 12 f | power3.inOut | ≈ 5× |
| T4 | **Hub push-through** (30.08–30.25 s) | the phone scales toward the camera (×2 in 4 f) until the card is the frame, then continues as T2 | 4 f + T2 | expo.in | 2× |
| T5 | **Hub close + iris into a new world** (52.25–53.0 s) | the bezels converge like a closing mouth (4 f); the phone shrinks to a capsule and then a dot (4 f); a colour circle grows from the dot past the frame diagonal (≈ 12 f); the circle *is* the next world's object (here the sun) | ≈ 20 f | back.in shrink; power2.in → out iris | 2× |
| T6 | **Line → primitive → object** (35.0–36.9 s) | a squiggle unwinds into a ring (8 f); the ring fills to a dot (4 f); the dot stretches into a pill (6 f); details pop with a 2 f stagger (buttons, d-pad); a squiggly cord draws above | ≈ 45 f | linear draw; back.out pops | 3–4× |
| T7 | **Morph, then action** (55.6–56.6 s) | the ringed planet morphs into a hammer head and handle (8 f), then the hammer swings: 3 f anticipation back, 4 f strike, 2 f squash on impact, recoil | 8 f + 12 f loop | power2.inOut morph; power4.in strike | 2× |
| T8 | **Hub → rocket** (61.83–62.6 s) | the screen goes solid orange (2 f); the body loses its round caps and tapers into a striped rocket (10 f); two small rockets pop either side (3 f stagger); 0.8 s later smoke puffs and a launch | ≈ 18 f | power2.inOut | 1× (finale) |
| T9 | **Collapse to dot → logo** (67.6–68.6 s) | the hub shrinks to a ≈ 40 px dot (8 f, back.in); the dot drops, squashes and bounces, trailing a short teal line; it grows into the round logo mark with overshoot; wordmark and badges fade/slide in over 1 s | ≈ 24 f + 1 s | back.in; bounce; back.out(1.7) | end |
| T10 | **Landing with a dust puff** (8.2–10.1 s) | the object descends onto a planet curve; white cloud puffs balloon out (6–8 f) and dissolve into teal line curls (10 f); squash on contact | ≈ 24 f | power2.in fall; elastic settle | 1–2× |
| T11 | **Beam emission** (4.6–6.6 s) | a UFO hovers on a sine; a beam of confetti particles; two arrow badges pop out (5 f each) and fly left and right on arcs | ≈ 48 f | back.out | 1× |
| T12 | **Palette-swap hard cut** (Reddit 47.75 s; Ahrefs 31.6, 37.6, 76.3 s) | the layout is identical across the cut and only the palette flips (day → night), or the cut hides behind swoosh lines that keep moving (Ahrefs) | 0 f | — | 1–3 per film |
| T13 | **Primitive-square morph** (Ahrefs) | see `flat-character.md` T8/T9: a coral square collapses, squashes and morphs into the next object | ≈ 27 f @30 | power2.inOut | Ahrefs' house transition |
| T14 | **Word-by-word headline / circuit-trace pan** (Ahrefs) | see `flat-character.md` T12/T13 | per VO | power2.out | pivot + outro |
| C1 | **Idle field** | confetti drifts 4–10 px on 2–4 s sines; some specks twinkle (scale 0.6 ↔ 1); rings rotate slowly; the UFO bobs ±8 px; the hub holds still | continuous | sine.inOut | always (exact freezes only 2–11 %) |

## 8. Motion grammar

- **Easing families:** back.out(2–3) for pops (10–20 % overshoot); expo.in for exits and push-throughs; power3.out
  for settles; one elastic bounce of 8–12 % on landings; linear only for line draws.
- **Motion principles, quantified:** squash 0.6 / 1.3 for 2–3 f on impact; stretch 1.3–1.4 along fast travel; a 3–4 f
  counter-move before every launch or strike; secondary parts (cords, antennae, trails) lag 2–4 f; arcs, never
  straight diagonals, for flying objects.
- **Stagger:** cards 2–3 f; details inside an object 2 f; confetti births 1 f at seeded positions; listed worlds
  1–1.5 s apart.
- **Build-on order:** primitive → details → secondary lines → confetti. Exits run in reverse, or the whole world
  collapses into the hub.
- **Rhythm against narration:** a world change starts in the breath before the sentence that names it and lands
  within 0–8 frames of the key noun (the "aww" world is fully open 8 f before the word). Gags hit the exact word.
  Feature names inside the hub pop on the spoken noun.
- **Holds:** a built world holds 1.5–4 s with idle drift, then moves on. Nothing is static for more than about
  0.5 s apart from the logo end card.

## 9. Sound (inferred)

- **VO:** Reddit has a friendly male narrator at 146 WPM plus 2–3 extra voices for gags (Whisper captions mark the
  exchanges). Ahrefs has one narrator at 136 WPM that the OP disliked. Use a warm, conversational read with
  room for a timed aside.
- **Music:** a bright, plucky indie bed (*inferred*: ukulele/glock/whistle or kalimba, claps, 110–125 BPM) that
  swells for the finale and resolves on the logo.
- **SFX:** dense and cartoony (*inferred*): a pop per primitive, a whoosh per card blow-up, a boing on landings,
  rising sweeps for launches, firework crackle and sparkle in the finale. About 1–2 SFX per second during builds.
- **Loudness:** masters differ a lot (Reddit −22.5, Ahrefs −12.4 LUFS). Target −16 LUFS, music ducked 12–15 dB
  under the VO.

## 10. Do / Don't

**Do**
1. Put one hub object dead centre (22 % W × 48 % H for a phone) and bring the film back to it every 2–3 vignettes.
2. Give every topic its own full-bleed flat colour world and reuse that colour only for that topic.
3. Blow worlds up out of the hub's card and collapse them back into it (T2/T3) instead of cutting.
4. Morph primitive to primitive (circle → pill → object; hub → rocket; dot → logo).
5. Apply visible motion principles: 2–3 f squash on landing, 3–4 f anticipation, 10–20 % overshoot, lagging
   secondary parts.
6. Keep confetti and doodles drifting at the edges so exact freezes stay under about 12 %.
7. Pop details inside an object with a 2-frame stagger after the silhouette lands.
8. Land the world change on the noun that names it; keep quick lists at 1–1.5 s per item.
9. Build a finale (fireworks, launch) at 85–90 %, then collapse to a dot and resolve the logo.
10. Keep the ground near-white (#f9f9f9) and the accents under 5 % of pixels on white scenes.
11. Choose one dialect: solids with thin 3 px accent lines, or a uniform 5 px outline on everything.
12. If you write gags, time them as 2–4 s exchanges about every 20–25 s, each with a one-word visual payoff.

**Don't**
1. Don't cross-fade or hard-cut between vignettes (a palette-swap cut with an unchanged layout is the only cut).
2. Don't add gradients, glows, grain or shadows; the look is perfectly flat.
3. Don't put a protagonist character in charge; that turns it into `flat-character`.
4. Don't let objects just slide in linearly; everything pops, squashes or arcs.
5. Don't fill the white frame: keep 85–95 % negative space.
6. Don't mix outline and no-outline objects in one film.
7. Don't put confetti over the hub or the world icon.
8. Don't subtitle the VO; text is microtext, labels or a headline at the pivot.
9. Don't use more than 4 field colours, or reuse one colour for two different topics.
10. Don't read faster than about 150 WPM or slower than 130; leave a 0.3–0.5 s beat before each gag.
11. Don't copy the brand's mascot, the real app UI, screenshots or store badges for another product's film.
12. Don't end on a fade to black; end on the logo, on the ground colour.

## 11. Replication recipe (code)

**Rendering:** SVG in the engine, 1920×1080, 24 fps (snappier poses) or 30 fps. Use the `playful-bounce` or
`corporate-pluck` preset. No filters are needed apart from an optional 3-sub-frame motion blur on T2/T4/T5.

**Layer stack (back → front):** `ground` (rect #f9f9f9) → `world` (full-bleed field rect, clipped by an animatable
`clipPath` rect; the world's icon group) → `hub` (bezelTop, bezelBottom, screen, cards[], cable, groundLine) →
`confetti` (screen space, outside the camera) → `fx` (rings, trails, swooshes) → `ui` (end-card type).

**The blow-up trick (T2/T3):** the world lives *inside* a clip rectangle that starts at the card's box and tweens
to the full frame. The card's fill colour is the world's colour, so the eye reads one object growing.

```js
const FPS = 24, F = n => n / FPS;
function blowUp(card, world, at) {                 // T2
  const b = card.getBBox();
  X.tl.to([hub.top], { y: -700, duration: F(4), ease: "expo.in" }, at)
      .to([hub.bottom, hub.cable], { y: 700, duration: F(4), ease: "expo.in" }, at)
      .fromTo(world.clip, { attr: { x: b.x, y: b.y, width: b.width, height: b.height, rx: 8 } },
              { attr: { x: -20, y: -20, width: 1960, height: 1120, rx: 0 }, duration: F(6), ease: "power3.inOut" }, at + F(3))
      .add(world.build(at + F(9)));
  X.sfx(at, "whoosh", { dur: 0.25 });
}
function collapse(world, card, at) { /* exact reverse of blowUp, bezels back in from ±700 over 4 f with a 2 f overlap */ }
function iris(color, cx, cy, at) {                 // T5
  const c = X.svg("circle", { cx, cy, r: 0, fill: color }, worldLayer);
  X.tl.to(c, { attr: { r: 1150 }, duration: F(12), ease: "power2.inOut" }, at);
}
function morphChain(el, paths, at, step = F(6)) {  // T6/T7/T8 (shapes converted to paths first)
  paths.forEach((d, i) => X.tl.to(el, { morphSVG: d, duration: step, ease: "power2.inOut" }, at + i * step));
}
function land(el, at) {                            // squash and stretch on contact
  X.tl.fromTo(el, { y: -400, scaleY: 1.3, scaleX: 0.8 }, { y: 0, duration: F(6), ease: "power2.in" }, at)
      .to(el, { scaleY: 0.6, scaleX: 1.3, duration: F(2), transformOrigin: "50% 100%" }, at + F(6))
      .to(el, { scaleY: 1, scaleX: 1, duration: F(6), ease: "elastic.out(1, 0.5)" }, at + F(8));
  X.sfx(at + F(6), "boing");
}
// confetti: 60 seeded specks, pure function of time
const R = X.rand(7); const specks = [...Array(60)].map(() => ({ x: R() * 1920, y: R() * 1080, p: 2 + R() * 2, a: 4 + R() * 6, ph: R() * 6.28 }));
X.every(t => specks.forEach((s, i) => s.el.setAttribute("transform",
  `translate(${s.x + s.a * Math.sin(t * 6.28 / s.p + s.ph)} ${s.y + s.a * Math.cos(t * 6.28 / (s.p + 1) + s.ph)})`)));
```

**Five defining shots and how to build them**
1. **The hub with stacked cards.** A centred phone (243 × 519 px) with domed orange caps, a white screen holding a
   teal header card, an image block and grey text bars, a teal cable stem to a 200 px ground line, and confetti
   at the edges. Build it with T1.
2. **Card → full-bleed world.** T2 into a mint field where one 160 px icon builds from a primitive (T6), holds
   2–3 s with idle drift, then T3 back to the hub.
3. **Morph-then-act.** A world object morphs into a tool that performs the verb (planet → hammer swings with
   anticipation and squash; T7), timed to the spoken noun.
4. **Iris world.** The hub closes like a mouth, shrinks to a dot, and the dot grows into a full-frame circle that
   becomes the next world's sun (T5).
5. **Finale + resolve.** The hub turns into a striped rocket flanked by two small ones (T8), launches on puffs,
   dashed concentric rings burst around it, then everything collapses to a bouncing dot that becomes the logo
   mark (T9). Hold the end card 6–8 s.

*Outline-dialect swap:* add `stroke:#0e3e7c; stroke-width:5; stroke-linecap:round` to every shape, replace the
colour worlds with a single navy field for the pivot and the outro, and use the coral-square morph as the house
transition (`flat-character.md` §11).

## 12. Per-video notes

**Reddit's New Mobile App (75.5 s)**
- One measured hard cut (47.75 s): the night-theme palette swap with the hub in the same place.
- 19 vignettes before the logo; the colour-field run (mint → blue → yellow) is the motion peak (decile 7 = 9.6).
- Three VO gags with off-screen voices. Whisper's captions garble the brand name, so trust the frames.
- The final hub shows real app screenshots with photos, and the end card carries store badges and legal text. Do
  not reproduce either.

**What is Ahrefs? (91.1 s)**
- The outline dialect. The calmest of the pair (motion 2.89, deciles near 1 except the pivot and the outro).
- Its colour worlds are reduced to one navy field used twice. Its hub is the browser/monitor that keeps returning.
- Its VO is loud (−12.4 LUFS) and ad-paced. The OP explicitly disliked it while praising the visuals.

## 13. Source-list issues

- The Reddit video was not available in the first pass (`flat-character.md` noted the pairing could not be
  checked). It was analysed later and confirms the pairing: same hub logic, same primitive morphs, same
  white ground.
- Ahrefs now feeds two skills. Keep the split rule (characters → flat-character; hub/objects → clean-vector) so
  the two skills do not compete.
- Both are 2016 videos. The look is a mid-2010s idiom, still common in app announcements.
