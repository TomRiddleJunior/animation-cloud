# Veritasium — animated material inside a live-action science channel

Scope: the user asked for the **animation only**. Veritasium is a presenter-led documentary channel. Animation is the
explanatory core, but there is **no single house animation style**: each video commissions its own look (retro
pixel-game for game theory, glowing 3D field simulations for electricity, algorithm-on-a-darkened-map by the
collaborator channel 2swap for Google Maps). What stays the same is **how** the animation is used and cut in. The rules
below describe that grammar plus the three looks, so an original video can borrow one look and the shared grammar.

Evidence used: metrics.json, timeline/strips/opening/animated/shots sheets, transcripts, plus my own extra frame grabs
(5 s contact sheets of every video, 8–12 fps bursts around transitions, k-means palettes of single animation frames).
Shot categories below were **labelled by hand** from those 4–5 s contact sheets, because the automatic `animated_frac`
does not work for this channel (see §3).

---

## 1. Identity

A single curious narrator (160–179 WPM) tells a historical story, then stops the story to *show the mechanism*:
the picture cuts hard from a presenter, archival photo or interview to a clean, self-contained animated "model" of
the idea. That model stays on screen for minutes, building step by step in time with the narration (a payoff matrix,
a graph being searched, field arrows flowing round a circuit). The animation is diagrammatic, not decorative. Few
saturated state colours on a dark or flat stage, real data (OpenStreetMap roads, historical warhead counts), LaTeX
maths type, and very long holds. Each look is bespoke, but you can always tell it apart by three things: a
**lecture-length animation block in the middle**, **thin-line diagrams whose colours carry meaning**, and **motion that
moves only when the narration states a new fact**.

## 2. Sources analysed

| id | title (upload) | dur s | cuts/min | median shot s | motion | colourful | WPM | LUFS | metric `animated_frac` | hand-labelled animation share |
|---|---|---|---|---|---|---|---|---|---|---|
| mScpHTIi-kM | Once you understand game theory, you understand the world (2023-12) | 1638 | 8.79 | 4.09 | 6.50 | 50.3 | 160 | −13.4 | 0.408 | **38 %** animation + 3 % text cards |
| bHIhgxav9LY | The Biggest Misconception About Electricity (2021-11) | 888 | 5.41 | 4.17 | 5.13 | 30.7 | 166 | −15.9 | 0.486 | **39 %** animation + 5 % graphics composited on live |
| kS-CGkiPetQ | Google Maps is unreasonably fast. Let me explain (2026-05) | 1794 | 7.46 | 3.34 | 6.73 | 35.6 | 179 | −15.3 | 0.577 | **51 %** animation + 9 % satellite/globe fly-throughs + 2 % composites |
| 2Vrhk5OjBP8 | I bought 1000 meters of wire to settle a physics debate (2021-12) — **AlphaPhoenix, not Veritasium** | 1368 | 1.89 | 7.38 | 4.07 | 35.0 | 165 | −27.0 | 0.044 | ~14 % animation + ~5 % annotated oscilloscope / overlay |

Full runtime breakdown from the hand labels (each label = one 4–5 s sample):

| video | animation | presenter | expert interviews | live/stock footage | archival photo/doc | text cards | sponsor |
|---|---|---|---|---|---|---|---|
| Game theory | 38 % | 16 % | 13 % | 17 % | 9 % | 3 % | 4 % |
| Electricity | 39 % (+5 % composites) | 23 % | 6 % | 9 % | 9 % | — | 9 % |
| Google Maps | 51 % (+11 % map renders/composites) | 12 % | 4 % | 9 % | 7 % | — | 4 % (+2 % UI) |

## 3. Measured pacing

- **The metric trap.** `animated_frac` counts a frame as "flat" when most pixels have near-zero gradient. The presenter's
  dark studio backdrop scores 0.67 flatness, so it counts as animation. The pixel-game animation (CRT texture,
  scanlines, vignette) scores only 0.21–0.34, so it does not. The two errors happen to cancel out for game theory.
  **Always hand-label this kind of channel.**
- **How often animation is cut in (hand-labelled runs, 4–5 s resolution, so inserts under ~4 s are under-counted):**
  - Game theory: 30 runs, 1.1 per minute. Median length 15 s (p10 5 s, p90 41 s, max 100 s). Mean gap between runs 34 s.
  - Electricity: 12 runs, 0.8 per minute. Median 14 s (p90 64 s, **max 144 s**). Mean gap 45 s.
  - Google Maps: 29 runs, 1.0 per minute. Median 10 s (p90 80 s, **max 200 s**). Mean gap 30 s.
  - Shape: **short 5–15 s illustrative inserts throughout, plus 1–3 "lecture blocks" of 1.5–3.5 min** in the middle third
    (game theory 7:32–9:12, electricity 6:02–8:26, Google Maps 3:22–6:42 and 21:07–23:52). The blocks carry the explanation.
- Cuts: 5.4–8.8/min overall. Median shot 3.3–4.2 s; p90 13–20 s (long animated holds). Hooks are front-loaded:
  6–9 cuts in the first 15 s, about 3–5× the body rate.
- Motion 5.1–6.7 mean (calm), p90 10–19. `hold_frac` 0.12–0.30: Google Maps 0.30, because graphs sit still while the
  narration explains. Motion deciles start highest (10.8 / 6.8 / 11.0 in the hook), sag to ~5 in the middle, and rise
  again at the end (outro, sponsor). Google Maps decile 8 = 1.15: a near-static 3-minute graph block.
- Practical targets for a rebuild: **one animated insert every 30–45 s, median 10–15 s, plus one or two 90–200 s
  animated lectures**; a hard cut every 7–11 s across the whole film, but within animation blocks scene changes come
  only every 10–40 s.

## 4. Script and narrative structure

**Three hook patterns (first 45 s):**
1. *Thesis plus montage* (game theory). Thesis in the first 3 s ("This is a video about the most famous problem in
   game theory"). Then 8 shots at 0.5–2 s each: the animated banker and gold chest, the pixel game, chess, a shark,
   a Truman/Stalin split screen, a sink of dishes, a TV game show. Stakes rise as a triple ("life and death, war and
   peace…"), the payoff word lands ("cooperation"), and a music sting at 0:30 introduces Chapter 1.
2. *Thought experiment plus quiz* (electricity). A 3 s sponsor ident over an Earth zoom. An animated circuit setup.
   A multiple-choice card A–E on a starfield. "Commit to an answer and put it down in the comments." The answer is
   withheld until **80 % of runtime** (11:54 of 14:47), so the whole video is an open loop.
3. *Absurd number plus question* (Google Maps). An everyday task, then 10^220 routes and 10^200 years shown as
   handwritten text on a darkened globe. Then the contrast ("And yet … four seconds"), the question at 0:41
   ("So how is that possible?"), a collaborator credit, and a dated historical anecdote (Amsterdam, 1956).

**Body beat map (repeats per chapter, about 2–3.5 min each; game theory has 14 chapters, Google Maps 9):**
`human story (archival + presenter, 20–40 %) → mechanism (animation block, 30–50 %) → expert interview reaction
(5–15 %) → real-world consequence (live/stock footage) → twist that opens the next chapter`.
- Chapter titles are on-screen cards in game theory only ("CHAPTER 1 / THE CURIOUS ORIGINS OF THE PRISONER'S DILEMMA").
  The other videos signal chapters with YouTube chapter metadata and music changes.
- Music cue tags in the captions mark section turns every 4–12 min ("(bright music)" 4:42; "(gentle music)" 5:35;
  "(upbeat music)" 17:05).
- Animation recurs as a **visual motif**: the same pixel matrix or map returns later in the video, already learned,
  so a new idea can be added on top of it.

**Sponsor:** mid-roll at ~29 % (Google Maps 8:41–9:39, 58 s) or end-roll (game theory 25:37–27:15, 98 s; electricity
13:39–14:46, 67 s), plus an opening 3 s mention in electricity. The sponsor's UI screen recordings are flat and bright;
do not count them as animation.

**Ending:** a wider moral ("beyond zero-sum"), thanks for watching, then patron credits. Two outro looks: the live
frame shrinks into a white-bordered card and flies back over a blue wireframe terrain under stars (credits in serif);
or a gag line followed by black credits (Google Maps ends on a sat-nav voice: "You have arrived at your destination").

## 5. Visual system

There is no house palette; each video picks one of these looks. Hex values are from k-means on single frames.

| role | A: Retro game-show (game theory) | B: Glow-sim on black (electricity) | C: Map algorithm (Google Maps) |
|---|---|---|---|
| background | split cyan `#97E8E3` / pink `#E099CB`; arena sky-blue `#75BFD8`, centre `#8BCAE2` | near-black `#141415` / `#161517`; navy variant `#020620` / `#010D3F` | navy-tinted satellite `#181F3E` / `#122159`; flat navy `#0D124C`; pure black `#000000` |
| primary | centre band yellow `#F9DC17`; gold panel `#D7BD6B` | glowing silver wire `#D0D5B0` with bloom | white nodes `#E2E3E8`, grey edges `#6A6E90` |
| secondary | matrix triangles magenta / cyan / blue / pink | magnetic blue `#39629A` / `#1D85C7` | explored-road fill red over grey roads `#878989` |
| accent / state | green token (Cooperate) ≈ `#45C25A`, red token (Defect) ≈ `#D9443A` | electric red `#B0494A` / `#7F2D1D`, "+" red, "−" green, Poynting yellow `#D79E38` | current/frontier red ≈ `#E53935`, settled teal-green ≈ `#2E9E7A`, goal yellow ≈ `#F2D23C`, backward-search violet ≈ `#7B83F0` (approx.) |
| shadow | black CRT border `#060606` | none (emissive look) | 70–85 % navy multiply over imagery |
| text | cream `#F7F9E5` pixel font with dark outline; orange-gradient names | white condensed caps; LaTeX serif with coloured symbols (S yellow, E red, B blue) | white handwritten marker; white label boxes with black sans |
| characters / other | cream bean people `#F7F9E5`; parchment chart `#D0C8B8` with brown hatch `#BE7C5A` / `#8B4525` | — | illustration lavender `#CFC8DE`, slate `#555B8B`, skin `#936C5C` |

Shared rules:
- **Meaning-coded colour, at most 3–4 saturated hues per scene.** Red = active / defect / positive / frontier.
  Green = settled / cooperate. Blue = magnetic field / second search. Yellow = highlight / goal / energy flow.
  Everything else is grey or white.
- **Line work:** diagrams are thin. Edges 1–1.5 px at 480p, about **3 px at 1080p**, round caps. Circuit loops are
  2–3 px rounded rectangles (corner radius ~6 % of loop height). Nodes are circles 18–40 px at 1080p with a 2 px
  white or grey stroke and serif numerals inside (~22 px). Arrowheads are small filled triangles. Field-line arrays
  are dozens of 2 px arrows forming a sine envelope.
- **Texture:** A = CRT curvature (rounded screen corners, radius ~4 % of width, barrel bulge, vignette, faint
  scanlines). B = glossy 3D with emissive bloom, no grain. C = real satellite / OSM imagery under a tint. Grain is
  never used as decoration.
- **Lighting:** B and C rely on glow halos (radius ~2–3× the dot) on red and green dots over black. A is flat, with
  dimming used to spotlight: non-focus elements drop to ~25 % brightness.
- **Depth:** mostly 2D. 3D only where space matters: tilted road-network plane with a perspective camera (Google Maps
  11:07–12:12); glossy arrow ribbons and wire (electricity).
- **Composition:** one model centred, filling 60–75 % of width, with 8–12 % margins. Labels sit next to their objects,
  not in legends. Comparisons are split screens: a dashed vertical divider for Dijkstra vs A*; "Team Nice | Team
  Nasty"; VS screens with a diagonal yellow lightning bolt.
- **Typography (free look-alikes, sizes at 1080p):**
  - Maths, node numbers, axis labels, plain word cards ("Nice" at ~200 px): Latin Modern / CMU Serif.
  - Condensed bold caps labels ("POYNTING VECTOR", "300,000 KM", ~70 px): Oswald or Bebas Neue.
  - Pixel UI ("CHOOSE YOUR CHARACTER!", ~60 px, outlined): Press Start 2P / Silkscreen / Pixelify Sans.
  - Map captions, ~60–80 px: Gochi Hand / Caveat / Patrick Hand.
  - Chapter cards: humanist sans caps, "CHAPTER 1" ~34 px over a 2-line title ~56 px, dark grey `#2A2A2A`, on the frame
    washed to ~70 % white with faint doodle watermarks.
  - Source credits ("Map data from OpenStreetMap"): ~14 px bottom-left.
  - Text is sparse: 0–6 words per screen, apart from leaderboards and tables.
- **Archival treatment:** B&W photos and newspapers on a dark textured backdrop, slow drift; names in italic serif or
  condensed caps bottom-left; a red hand-drawn ellipse draws around a headline.

## 6. Characters and objects

- **Bean people (look A):** cream fill `#F7F9E5`, thin dark contour, round head about 1/3 of total height, two dot eyes
  and a short mouth, mitten hands, stub legs, no clothes. **Identity comes from a hat** (cowboy, beanie, crown, top
  hat, cap), so strategies become costumes. They hold round tokens on sticks (green "C", red "D"). Acting is limited:
  2–3 drawn poses (arm down / arm raised), swapped on twos (12 changes/s).
- **Illustrated story cast (look C):** mid-century magazine illustration. Soft painterly flat shading, no outlines,
  realistic proportions (head about 1/7.5 of height). Limited animation: blinks, head turns, slow camera pans. Speech
  appears as handwritten subtitles plus a small source line ("From … Turing Award speech, 1972").
- **Separate cartoon register for one-off gags:** the banker with top hat and gold chest is a brighter, outlined
  cartoon with a sky and grass backdrop, used in the hook and as a recurring prop.
- **Objects / icons:** coin counters (gold disc plus pixel numeral) top corners; 8–12-slot round-history boards (gold
  frame, yellow empty dots turning green or red); leaderboards with pastel rainbow bars; battery, switch, bulb
  schematic glyphs; a 3D cartoon hand for the right-hand rule; map pins; white place-name label boxes.

## 7. Camera and transitions catalogue

| # | transition | how it is built (from 8–12 fps strips) | duration | use |
|---|---|---|---|---|
| 1 | **Hard cut live ↔ animation** | no effect; the cut lands at the start of the sentence that introduces the model | 0 | ~90 % of all entries and exits |
| 2 | **Hard cut between animated "screens"** | e.g. Team Nice / Nasty → round board (game theory 13:57.3 → 13:57.4) | 0 | within blocks |
| 3 | **Earth zoom with schematic overlay** | drone top-down → scale-out with radial blur → satellite → planet. A white 2-line circuit schematic stays locked on top at constant screen size; arrow labels "← 300,000 KM →" ride along | 2–3 s, accelerating (ease-in), blur peaks mid-move | hook, recap |
| 4 | **Continuous 3D camera pull-out** | close-up of glowing wire with charges → wire shrinks to a line → full circuit (electricity 6:58.0 → 6:59.1) | ~1.1 s = 26 f @24, power2.inOut | change of scale |
| 5 | **Tint cross-fade** | navy overlay fades away to reveal true-colour satellite while node dots grow into haloed circles (Google Maps 2:15.5 → 2:16.6) | ~0.6 s = 14 f | map ↔ graph |
| 6 | **Dim-to-focus** | everything except the matrix drops to ~25 % brightness; counters keep ticking | 4–6 f fade, then holds tens of seconds | spotlight |
| 7 | **Slide-in element** | payoff diamond drops into the yellow centre band from the top (game theory 2:46.2) | ~8 f | object entry |
| 8 | **Typewriter text** | "Strategies" appears 2–3 characters per frame at 12 fps (whole word ~0.33 s); "Tester" the same | ~8 f per word | labels, titles |
| 9 | **Split-screen slide** | second archival portrait slides in from the right to make a side-by-side (game theory 0:07) | ~6 f | comparison |
| 10 | **Annotate-on** | red marker ellipse draws round a newspaper headline while the camera drifts (game theory 1:52); white hand-drawn arrows | ~12 f draw, then holds | archival |
| 11 | **Label wipe-on** | white label box extends left→right, text appears inside (Google Maps 0:12) | ~6–8 f | map callouts |
| 12 | **Graph morph** | nodes glide to new positions (force-layout feel) while edges stay attached (Google Maps 22:16) | 1–2 s, linear/ease | restructure |
| 13 | **Composited AR overlay** | line-art transformer floats beside the presenter (2:26); a 3D E/B wave composited across the presenter and his hands at dusk (5:02–5:18); a coloured equation pinned top-right | whole shot | bridges live ↔ model |
| 14 | **PIP shrink into outro** | live frame gains a white border, shrinks and flies back over a blue wireframe terrain (electricity 13:26.2 → 13:27.0) | ~0.75 s = 18 f, ease-in | outro only |

Camera inside animation is mostly locked off. Moves happen only to change scale (zoom to a city, pull out to a
continent) or to tilt a 3D map. No handheld wobble, no constant parallax drift.

## 8. Motion grammar

- **Narration-locked state changes.** Something changes only when the narrator states a new fact: "three coins" →
  the 3|3 cell lights; "defect" → the token flips red. Between facts the frame **holds 2–10 s** (hold_frac up to 0.30).
- **Sequential build at a countable rate:** history dots fill one per round at 4–8 per second; counters tick at about
  12 increments per second; graph search runs one node per 0.5–1 s at first ("current node turns red → neighbours
  update → node turns green").
- **Speed ramp to show scale:** after 3–5 slow, narrated steps the same algorithm accelerates exponentially to
  thousands of nodes per second ("Nodes explored 44,614" counter, flood fills across a continent in 3–7 s).
- **Easing families:** linear for data, scrolls, travelling waves and flood fills. `power2.inOut` for camera moves
  (0.6–1.2 s). Quick pops for markers (`back.out(1.4)`, 4–6 frames). State colour changes usually **snap** (no tween),
  so they read as discrete algorithm steps.
- **Idle and secondary motion is minimal and physical:** travelling E-field waves loop forever along the wire; the
  right-hand-rule hand slowly curls; glow halos pulse very slightly. No bouncing for decoration.
- **Stagger:** label lists and leaderboards build top-down at 2–4 frames per row. Tournament matchups advance one
  round per ~0.15 s once explained.
- **Rhythm with voice:** the animation **trails** the words by 0–6 frames (the noun is heard, then it appears) rather
  than leading them. The quiz uses the opposite: the question card is on screen before the explanation starts.

## 9. Sound (inferred from transcripts and metrics; I cannot hear the audio)

- VO: one male host narrator, conversational, curious, fast (160–179 WPM), with first-person asides. Interview clips of
  experts are cut into the narration. One collaborator voice acts a historical figure ("[Casper's Dijkstra Impression]").
- Music: captions tag cue changes at structural points: "(upbeat music)" title sting at 0:30; "(bright music)",
  "(gentle music)", "(jaunty music)" at chapter turns. Inferred: light electronic / orchestral-pop beds, 90–120 BPM,
  ducked well under the voice. Game theory's pixel look is very likely paired with chip-tune-style bleeps.
- Loudness is loud and consistent: −13.4 to −15.9 LUFS. Silence: game theory has 13.8 s of near-silence (dramatic
  pauses before reveals); the others under 4 s.
- SFX (inferred): whoosh or rumble on the Earth zoom; ticks on counters; UI blips in the game screens.

## 10. Do / Don't

**Do**
1. Build each explanation as **one persistent model** that stays on screen while narration adds facts to it.
2. Use **3–4 saturated state colours with fixed meanings** across the whole film; everything else grey or white.
3. Keep lines thin (~3 px at 1080p) and nodes small; let negative space carry the frame.
4. Hold still for 2–10 s when the narration is explaining; motion means new information.
5. Show 3–5 algorithm steps slowly, then **speed-ramp** to show scale, with a counter.
6. Use real data and credit it in small type bottom-left (OSM, historical archives).
7. Put maths in LaTeX serif and colour each symbol to match its on-screen object.
8. Cut in and out of animation with **hard cuts on sentence starts**; save continuous zooms for changes of scale.
9. Bring the same model back later in the video so the viewer recognises it instantly.
10. Open with a number or question that the animation will answer, and pay it off late (60–80 % of runtime).
11. Use split screens with a dashed divider for "method A vs method B".
12. Give characters identity through one prop (a hat), not through faces.

**Don't**
1. Don't add decorative motion: no idle bobbing, floating particles or constant camera drift.
2. Don't use more than one look per film. The three looks never mix inside a video.
3. Don't fill the screen with text: at most 6 words per animated screen, outside tables.
4. Don't tween discrete algorithm state changes; snap them.
5. Don't use thick cartoon outlines on diagrams (only the gag cartoons have outlines).
6. Don't cut away from a lecture block faster than every ~10 s; the blocks are allowed to breathe.
7. Don't use gradients as decoration. Gradients come from light (glow, bloom) or real imagery.
8. Don't rely on legends; label objects in place.
9. Don't let the hook run longer than ~45 s before the story starts.
10. Don't trust `animated_frac` for presenter channels; label shots by hand.
11. Don't copy the channel's logo, the "Ve" mark, the wireframe-terrain outro or specific characters; build an original
    equivalent.
12. Don't animate a sponsor's UI in the same style as the explainer; keep it visually separate.

## 11. Replication recipe (SVG/HTML + GSAP, frame-by-frame render, Kokoro VO)

**Layer stack (bottom → top):**
`bg` (solid, gradient or satellite image) → `tint` (navy rect with `mix-blend-mode:multiply`, opacity 0.75) →
`world` group (map roads / circuit / arena, with the camera transform here) → `edges` → `nodes` / `characters` →
`fx` (glow via `feGaussianBlur` stdDeviation 4–8 merged over the source; bloom = blurred copy at opacity 0.6 with
`screen` blend) → `labels` (screen-space, not camera-scaled) → `crt` (look A only: rounded-rect mask, barrel via
`feDisplacementMap` with a radial gradient map scale 12–20, a repeating 2 px scanline pattern at 6 % opacity, and a
radial vignette).

**Timing source:** Kokoro TTS gives word timestamps. Every state change is a GSAP label at `wordStart(noun) + 2 frames`.

```js
// 30 fps, 1920x1080, deterministic: tl.pause(); for f in frames: tl.seek(f/30); capture()
const C = {red:'#E53935', green:'#2E9E7A', white:'#E2E3E8', edge:'#6A6E90', navy:'#0D124C', gold:'#F2D23C'};
const tl = gsap.timeline({paused:true});

// Shot "algorithm on a darkened map"
tl.set('#tint', {opacity:0.8})
  .from('.node', {scale:0, transformOrigin:'50% 50%', duration:0.2, ease:'back.out(1.4)', stagger:0.03}, at('nodes'))
  .from('.edge', {drawSVG:'0%', duration:0.4, ease:'none', stagger:0.02}, '<0.2');   // or animate stroke-dashoffset

// slow narrated steps: snap colours, no tween
steps.slice(0,4).forEach((s,i)=>{
  tl.set(`#n${s.cur}`, {fill:C.red}, at(`step${i}`));
  s.relaxed.forEach(n=> tl.set(`#w${n}`, {textContent:s.dist[n]}, `>+0.15`));
  tl.set(`#n${s.cur}`, {fill:C.green}, `>+0.4`);
});
// speed ramp: remaining 40k steps over 5 s, exponential
tl.to(rampProxy, {p:1, duration:5, ease:'expo.in', onUpdate:()=>paintExplored(rampProxy.p)}, at('scale'));

// change of scale: camera pull-out (one continuous move, not a cut)
tl.to('#world', {scale:0.12, x:860, y:420, duration:1.1, ease:'power2.inOut'}, at('continent'));
```

**Camera rig:** one `<g id="world">` whose `transform` is driven by `{x, y, scale, rotate}`. Labels live outside it and
are repositioned each frame from the world→screen matrix, so text stays at a constant size. For the Earth zoom,
crossfade 3–4 pre-rendered image tiles of increasing scale, and add a radial blur: a zoom-blur shader, or 6 stacked
copies at scale 1.00–1.06, each at opacity 0.15.

**Character rig (bean people):** an SVG `<symbol>` with groups `body`, `head`, `armR` (pivot at the shoulder),
`token`. Two arm poses swapped with `tl.set` (no tween) on twos. A hat is a separate `<use>` swapped per character.
Tokens are a circle plus a letter, colour from the state map.

**The 5 shots that define the style, and how to build each:**
1. **Algorithm on a darkened map.** Satellite or OSM raster plus a navy multiply tint (0.75–0.85). Graph overlay with
   3 px edges and 24–36 px nodes containing serif numerals. Red / green / white states snapped per step. Handwritten
   caption top-left ("Dijkstra's Algorithm / >65,000 nodes"). Speed ramp with a live counter. Small OSM credit
   bottom-left.
2. **Retro game-show model.** CRT-masked screen split cyan/pink with a yellow centre band. 45°-rotated diamond payoff
   matrix (four coloured triangles, pixel digits). Two bean players raising C/D tokens. Coin counters ticking in the
   top corners. Dim-to-focus when the matrix is explained. Follow-ups: "CHOOSE YOUR CHARACTER" roster, a VS screen
   with a diagonal lightning split (blue `#70BCD6` vs gold `#D7BD6B`, bolt `#F9F909`), round-history boards filling
   green/red, a leaderboard with pastel bars.
3. **Glow sim on black.** Silver tube wire (linear-gradient stroke plus bloom). Red "+" and green "−" charge glyphs
   marching along it. E and B fields as arrays of 2 px arrows whose lengths follow a travelling sine (red E, blue B),
   updated every frame with `phase = t*ω − x*k`. Blue ellipse rings with arrowheads for magnetic loops, orange-red
   curves for electric field lines. A LaTeX equation top-right with symbols coloured to match.
4. **Earth zoom with locked schematic.** Live drone top-down → zoom-out through image tiles with radial blur → planet.
   A white 3 px schematic and "← 300,000 KM →" condensed-caps labels stay locked in screen space over the move.
5. **Annotated archival plus data re-plot.** B&W photo or newspaper on a dark textured board, Ken-Burns 1.00 → 1.06
   over 4 s. A red marker ellipse draws on in 12 frames (`stroke-dashoffset`, slightly wobbly path). Name in italic
   serif bottom-left. Data charts re-plotted on parchment (`#D0C8B8`) with a hatched brown fill growing left→right
   (clip-path width 0 → 100 % linear over 2–3 s) and LaTeX-style axis labels.

**Edit skeleton for a 12-minute original:** 0:00–0:40 hook (montage at 0.5–2 s per shot or a quiz card) → chapters of
2–3 min, each `story 40 s → model 60–90 s → reaction/real-world 30 s`. One 2–3 min lecture block at 35–60 %. Payoff
at 70–80 %. Outro 20 s.

## 12. Per-video notes (animation only)

- **Game theory (mScpHTIi-kM).** The most "designed" look. A retro-arcade world (CRT-masked cyan/pink arena, bean
  people with hat identities, pixel fonts) carries the whole tournament: 1:42 of continuous animation (7:32–9:12) plus
  around 25 shorter returns. A separate cartoon register (banker, gold chest) for the setup. A parchment area chart
  with LaTeX axes for warhead inventories. A Lotka-Volterra-style "proportion of population vs generations" chart on a
  dark teal panel `#2B4654` with pastel lines. Plain serif word cards ("Nice", "Forgiving"). Chapter cards over washed-
  out frames. Interviews (webcam, 13 %) are cut into the animation blocks as reaction beats.
- **Electricity (bHIhgxav9LY).** 3D-rendered physics on black and navy. Glowing wire, charge glyphs, sine arrow-arrays
  for E/B, Poynting vector in yellow, field-line portraits of the full circuit (6:02–8:26 is one 144 s animation
  block). The best example of **live/animation compositing**: line-art beside the presenter, a 3D wave across his
  hands, the Earth-zoom opening with a locked schematic. The quiz card (A–E on a starfield) opens the question and
  closes it again at 11:46.
- **Google Maps (kS-CGkiPetQ).** Animation co-produced with the simulation channel 2swap (credited at 0:44). Graphs on
  navy-tinted satellite imagery of the Netherlands. Dijkstra vs A* split screen with a dashed divider. Black-background
  heuristic diagrams with glowing red/green dots. A 3D tilted continent network. Contraction-hierarchy diagrams on flat
  navy `#0D124C` (21:07–23:52). Green flood-fill over a black North America silhouette. A flat stylised road-map look
  (grey roads, white streets, yellow restriction zones) for turn-cost examples. Mid-century illustrated vignettes with
  handwritten subtitles for the Dijkstra biography. The on-camera presenter is a team member driving a Jeep; the
  founder narrates the opening ("[Derek]" tags).
- **Wire experiment (2Vrhk5OjBP8, AlphaPhoenix).** Not Veritasium (see §13), and animation is sparse:
  - About 14 % of runtime, in three blocks (6:52–7:32, 9:56–11:08, 16:44–17:40).
  - Look: a cyan beaded wire loop (`#46D9D5`) with schematic glyphs on a grey cardboard texture (`#39342D`–`#706D67`).
  - Block arrows for wavefronts; starburst sprites (blue / magenta) with radial arrows for charge fields.
  - Annotated oscilloscope captures, and a few text banners over live footage.
  - Mostly a single-take bench experiment and desk talk: 1.9 cuts/min, median shot 7.4 s.
  - Upload is very quiet: −27 LUFS.

## 13. Source-list issues

- **2Vrhk5OjBP8 is credited to the wrong channel.** The vidpros article lists "I bought 1000 meters of wire to settle
  a physics debate" as one of 3 Veritasium starter videos, and `sources.json` / `metrics_table.md` group it under
  Veritasium. Three checks say it is AlphaPhoenix:
  - Download metadata: uploader / channel AlphaPhoenix, `@AlphaPhoenixChannel`, channel id `UCCWeRTgd79JL0ilH0ZywSJA`.
  - Frames: a burning-paper "ALPHA PHOENIX" title card at 1:48, and a different presenter throughout.
  - Transcript: at 0:24.8 the presenter says "two weeks ago … derrick over on veritasium proposed…". It is a
    response / replication of bHIhgxav9LY.

  Drop it from the Veritasium group (or re-label it AlphaPhoenix). Its 0.044 `animated_frac` is not representative of
  Veritasium.
- **`animated_frac` misleads for this channel.** The dark presenter backdrop reads as "flat" and the textured pixel-art
  animation does not. Use the hand-labelled shares in §2.
- **The animation looks are commissioned per video, not a house style.** The Google Maps animation is by a collaborator
  (2swap). Treat "Veritasium style" as a grammar of how animation is used, plus three interchangeable looks.
- Minor title drift: vidpros shows older titles ("This game theory problem will change the way you see the world";
  "The Big Misconception About Electricity"). The current titles are in §2. Same videos, retitled.
- kS-CGkiPetQ was added as a recent upload (`listed:false`); it is not in the article. Recent uploads run 20–58 min
  (median 2005 s in `channel_listing.txt`), so long-form is the norm.
