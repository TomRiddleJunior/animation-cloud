# The Infographics Show: style formation rules

Analysed by reading timeline/opening/strips/shots/ending sheets and transcripts for all 4 videos. I also ran extra
measurements on the source MP4s (scripts live in the session scratchpad, not in the repo):
- **Camera vs local-motion classifier**: 6 fps, 320×180. For each step, LK optical flow plus a RANSAC similarity
  transform labels the step *hold*, *local* (acting or pop-ons on a static camera), *zoom*, *pan*, *fastcam*
  (whip/smash) or *swap*. A swap is a change too large for any camera transform to explain, i.e. a scene change
  done by an animated transition.
- **Native-30 fps diff curves** across about 15 transitions, to get frame counts.
- **Duplicate-frame cadence** (tells on-ones from on-twos).
- **EBU R128 loudness range** and a 100 ms RMS distribution.
- **Second-person / number / sentence-length counts** from the transcripts.
- **Word-timed auto-captions** (`*.en-orig.vtt`) for local WPM and the longest pause.

---

## 1. Identity

A fast, sardonic male voice says "you" about once every 20 words (scenario videos) over a bright, vivid flat-vector
world: about 75 colourfulness, nothing dark, no outlines. **The picture never stops changing, yet it almost never
hard-cuts.** Scenes are swapped every 3–4 s by 0.4–0.8 s animated transitions: whip-pans, smash-zooms,
zoom-throughs into screens and photos, foreground-occluder wipes, liquid/shape/shatter wipes. Between swaps a
virtual camera drifts or pushes for about 30–40 % of the runtime. Puppet-rigged characters always run an idle or
gesture loop. The cast is a generic "you" stand-in plus stock-library extras: tiny dot-eyes, oversized ball fists,
two-tone skin, no linework. Big kinetic type repeats the narration's punchline. The script turns a premise
("what if…", "could you…", "follow the math") into an escalating ladder of problems. Each rung is a hard number,
a grim workaround and a joke. The ending is a verdict (usually "you'd die / it's impossible"), a question to the
comments, and an end card.

## 2. Sources analysed

| id | title | dur | cuts/min | median shot | motion (mean / p90) | colourful | WPM (metrics) | LUFS / LRA |
|---|---|---|---|---|---|---|---|---|
| 4Fbu5vixROc | What to do if there is a nuclear explosion?! (2018-06) | 427 s | 0.0 | 427 s (one "shot") | 4.58 / 11.2 | 74.4 | 186.8 (≈211 from word-timed captions; the sponsor read is uncaptioned) | −14.6 / 2.1 |
| b-d_VfBCPCM | Could you live at the bottom of the Mariana Trench? (2019-07) | 536 s | 1.68 | 28.5 s | 11.94 / 27.8 | 79.8 | 192.2 | −14.0 / 2.4 |
| gvWQ2ZcjWnY | What if a whale accidentally swallowed you? (2018-11) | 467 s | 1.41 | 27.1 s | 14.58 / 38.2 | 70.9 | 209.4 | −15.8 / 2.0 |
| DRP7tRXts0Q | Renting vs Buying – Follow the Math! (2026-10) | 828 s | 0.29 | 109 s | 10.51 / 31.9 | 72.7 | 189.6 | −15.1 / 2.1 |

Other shared metrics: brightness 0.67–0.73; saturation 0.38–0.47; dark-frame fraction 0.2–7.9 % (whale stomach
scenes are the darkest); `silence_s` = 0 in all four; source resolution 640×360 or 854×480, 30 fps.

## 3. Measured pacing

### Extra measurements (my classifier, % of 1/6-s steps)

| id | hold | local | zoom | pan | fast-cam | swap | camera-move share of time | camera moves/min | **visual events/min** (any camera move or swap) | median gap between events | longest static stretch |
|---|---|---|---|---|---|---|---|---|---|---|---|
| nuclear 2018 | 32 % | 60 % | 1 % | 2 % | 1 % | 4 % | 3 % | 2.4 | **5.1** | 7.3 s | 42 s |
| Mariana 2019 | 4 % | 48 % | 23 % | 12 % | 3 % | 9 % | 38 % | 16.6 | **15.2** | 2.8 s | 17.5 s |
| whale 2018-11 | 8 % | 45 % | 13 % | 15 % | 7 % | 13 % | 34 % | 13.4 | **16.1** | 3.2 s | 23.5 s |
| data 2026 | 18 % | 45 % | 18 % | 4 % | 7 % | 8 % | 29 % | 10.4 | **12.8** | 3.3 s | 13.5 s |

More detail on camera moves (moves ≥ 0.67 s):
- **Median length**: 1.2–1.7 s; p90 is 3.3–3.8 s.
- **Zoom direction**: zoom-in beats zoom-out about 2:1 (Mariana 47:22, data 41:21). The whale video is balanced.
- **Size of move**: median scale change ×1.26 (Mariana), ×1.15 (data), ×1.04 (whale). Median pan travel is
  0.11–0.15 frame widths.
- **Speed profile**: Mariana moves peak mid-move (peak at 0.5 of the move; edge speed 0.59 of peak), which means
  sine/quad in-out easing. Data-video moves peak early with high edge speed (0.19 / 0.71), which means slow linear
  drifts and ease-out pushes.
- **Animation cadence**: every frame is unique at 30 fps (duplicate frames ≈ 0 per active second). Rigs and camera
  are keyframe-interpolated on ones, not cel animation on twos.

### What it means

- **"No cuts" is a measurement artefact.** The 0.33 scene-score detector misses scene changes that are spread over
  12–25 frames. In fact a new scene or layout arrives **11–17 times per minute** (2019/2026), and about 90 % of
  those arrive through a motivated transition, not a straight cut. The 2018 nuclear video is the slow outlier:
  about 5 changes/min, mostly flat shape wipes, with static staging (32 % hold).
- **Targets for a modern build**:
  - one visual event every **2.5–4 s** (never more than ~15 s without one);
  - camera moving **25–40 %** of the time;
  - hold fraction **< 10 %** (idle loops and particles keep the frame alive);
  - motion mean **10–15** (0–255 scale), p90 **28–38**.
- **Pacing is flat across the runtime.** Motion deciles stay in the 9–16 band from the first to the last tenth
  (whale peaks at 23 in the "inside the whale" climax at 30–40 %). There is no slow middle and no big finale
  ramp: the energy is constant.
- **Narration never stops.** WPM per 30-s window, from word-timed captions:
  - nuclear: median 214 (p10 186 – p90 227);
  - whale: median 212 (195–217);
  - data: median 190 (175–215).
  The longest gap between words is 1.0 s (2018) and 1.7 s (2026). Treat **200–215 WPM with ≤ 1 s gaps** as the
  house speed. The 2026 video runs slightly slower (≈ 190).

## 4. Script & narrative structure

### Script metrics

| | "you/your" per 1000 words | numbers per min | median sentence (words) | rhetorical "?" |
|---|---|---|---|---|
| nuclear (survival how-to) | 53 | 1.5 | 17 | 3 |
| Mariana (could you live…) | 46 | 1.8 | 25.5 | 3 |
| whale (what if…) | 18.5 | 2.3 | 16 | 6 |
| data (follow the math) | 11 | 2.8 | 13 | 4 |

"You" density **rises through the runtime** in the scenario videos. Per 100 words by decile:
- nuclear: 2.1, 0.6, 5.2, 5.3, 1.7, 10.4, 6.6, 8.0, 6.1, 8.7
- Mariana: 0.6, 3.6, 4.3, 1.9, 5.0, 5.5, 4.4, 7.3, 7.4, 5.3

So the opening is third-person context, and the back half is all "you". The whale video is a hybrid: "you" only
in the hook (deciles 0–2) and the science payoff (decile 7), with a third-person history story in between. The
2026 data video is third-person ("homeowners", "renters"). It drops "you" only at turning points ("If you rent,
you're just throwing money away", "it probably won't be to you").

### Beat map (scenario format; percentages of runtime)

| % | beat | what it looks like |
|---|---|---|
| 0–2 % (0–8 s), or up to 7 % (38 s) | **Sponsor pre-roll** (2018–19). Logo plus sponsor wordmark on a dark diagonal-stripe card, then the sponsor footage framed inside a cartoon phone held by a flat hand. | Comes BEFORE the hook. Absent in the 2026 sample, which instead has a corner "no AI / human-made" chip and a "narrated by" credit chip for ~5 s. |
| 2–8 % | **Cold-open hook** in second person or "imagine this": a sensory catastrophe ("A sudden bright light…") or a rapid list of related survival tips (lion → bear → shark, about 5 s each). | One continuous scene with escalating FX (sky tints orange, bomb drops, buildings tint red, people panic, fire spreads), or vignettes linked by whips. |
| 8–10 % (≈ 36–44 s) | **Title line**: "…in this episode of The Infographics Show, *[title]*", then channel sting plus title card. | About 2 s logo sting (mark assembles from particles or a diagonal split), about 3 s title card with the title in spaced caps. |
| 10–25 % | **Context and credentials of the premise**: scripture/myth, pop culture, records, "how big is it", 2–4 headline numbers with absurd comparisons ("Everest would still have 1.2 miles of water above it", "400 of your friends could fit in its mouth"). | Map zoom with a location ping and label; size-comparison gags; the first quote/question card ("But what if you wanted to … actually live there?"). |
| 25–85 % | **The ladder.** 4–6 problems in ascending severity, ordered by a physical path (mouth → teeth → oesophagus → enzymes → stomach → no air), a clock (before → flash → first 15 min → 48 h → 2 weeks → 30 days) or a needs hierarchy (shelter → water → food → heat → toilet). | Each rung, about 40–70 s: (1) naive solution, (2) a number kills it ("15,750 psi … your skull would implode"), (3) grim workaround (drink recycled urine, pedal forever), (4) a joke aside ("Mostly."). |
| 85–94 % | **Climax and verdict.** The grossest or deadliest rung ("the water would … cut your body in half"), then the summary verdict and a callback joke to the opening's pop-culture reference. | Meme insert (e.g. a "game over" overlay), a style-switch parody, a smash zoom-out. |
| 94–97 % | **Comment question**: "So, do you think you could survive…? Let us know in the comments." The 2018 nuclear video slips a ~50-s sponsor end-read between the question and the CTA. | Last scene, often with a speech bubble. |
| 97–100 % (~10–12 s) | **CTA plus end card**: "watch our other video called …", "like, share and subscribe, see you next time." | 2018–19: slate end card with "WATCH THIS:" and "SUBSCRIBE" video slots and a yellow bottom bar repeating the question. 2026: cyan gradient with a single "WATCH THIS:" slot. |

### Hook pattern (first 15 s after any sponsor)

- **Type A, "Imagine this"** (nuclear): one continuous second-person disaster sequence, 20 s, no text. Then
  rhetorical questions ("would a nuclear blast really spell the end of the world?").
- **Type B, "related tips montage"** (whale): 3 quick survival tips for nearby scenarios, each 4–6 s with the
  everyman reacting, ending with "Easier said than done, eh." Then the title line.
- **Type C, "the dream vs the nightmare"** (data 2026). The 0:00 thesis is a cliché ("supposed to be the American
  Dream"); by 0:05 it flips ("turning into a nightmare"), shown as a full-screen headline card; by 0:08–0:16 a
  three-item cost list types onto a paper bill. There is no title line and no channel sting.

### Section handover

- 2018–19 videos use spoken connectives: "Food and water are going to be next.", "Lastly, …", "But first up, …",
  "Now let's have a look at …".
- **2026 uses one-line "stinger" sentences**: about 30 short lines in 13.8 min. Examples: "But today, that's a
  pipe dream." / "So is it really worth it?" / "It won't." Each one closes a section and opens the next question.
  About 20 of them (roughly one every 40 s) are drawn as full-screen headline cards; 17 of 32 sampled stinger
  timestamps showed a card. A stinger is 3–10 words, usually starts with "But", "And" or
  "So", and is often a question or a flat contradiction.

### Voice of the script

- **Short declaratives plus asides.** The house joke is a sarcastic aside or correction ("sequels to his Fern Gully
  rip-off, we mean 'homage'") and a one-word button after a gross fact ("Mostly.").
- **Narrator as "we", the viewer as "you"**: "we certainly hope not", "We doubt…".
- **Brands, games and celebrities are name-dropped** for familiarity. In an original build, use generic or
  invented references instead.

## 5. Visual system

### Palette roles (sampled flat colours plus k-means)

| role | hex | notes |
|---|---|---|
| sky / open background | `#A4E4F4`, `#C4E4E4`, `#CCF4FC` (2018 sky), `#9CDCFC` (2026) | pale cyans; flat, no gradient |
| close-up colour field | `#04C4F4` (cyan), `#D4C404` (mustard), `#E05555` (coral type card), `#ECBF53` | **close-ups drop the environment** and sit on one saturated field |
| water / mid-depth | `#2878A2`, `#228EB2`, `#3484A4`, `#6EB9D2` | 2–3 blue steps for depth planes |
| ground | grass `#5CAC2C` / `#A4B434`; sand `#F4D47C` / `#ECBC4C` | low horizon, ground fills the bottom 20–30 % |
| map (2026 data) | land `#44D444` on sea `#1474D4` | cartoon geography, no borders except the highlighted state (red) |
| skin | everyman: lit `#EC9CA4`, shadow `#CC7C7C`; 2026 cast: peach `#F4A47C` | two tones: shadow side is ~20 % darker, same hue |
| clothing (hero) | shirt `#F4F4F4` / shadow `#E4E4E4`; trousers `#445464`; hair `#3D4A5A` (slate, never pure black in 2018–19; 2026 hair is `#040404`) | |
| accent / alarm | red `#E3201B` (keywords, stamps, X marks, chart lines); orange `#FC9C74`; hero-prop yellow `#E1BC11` | one hero-coloured prop per sequence (e.g. a yellow sub) |
| dark utility | ident / sponsor card `#1E2731` with 45° stripes 6 % lighter; end card `#2F4559`; 2026 headline card navy `#10285A → #1A3F8F` | the only dark surfaces |
| text | white `#FFFFFF` with a soft black shadow; black `#111` in white boxes; highlight bars yellow `#F5C400` and navy `#23305A`; question bar `#F2C40F` | |

### Shape and line language

- **No strokes on characters or scenery** in the house style. Shapes are flat fills with one shadow tone.
  Corners are rounded (radius ≈ 8–15 % of the shape's short side).
- **Organic blobs** for hair, bushes, clouds and smoke: overlapping circles.
- **Stock-library assets** (older 2018 video, some extras) sometimes carry thin same-hue darker contours. That
  mismatch is tolerated.
- **Strokes appear only in diagrams.** Chart axes are black, about 5 px at 1080p, with filled triangular
  arrowheads. Data lines are red, about 8 px, round caps, with an arrowhead at the end. Map pings are concentric
  white rings.

### Texture, lighting and depth

- **Texture**: none in 2018–19. The 2026 sample adds a faint noise or pattern on large fields (sea, navy cards)
  and wallpaper patterns in interiors.
- **Lighting**: flat. The exceptions are sun halos drawn as 2–3 concentric lighter rings, and occasional radial
  glows on fire or explosions. No rim lights and no long shadows. Global colour grades are used as storytelling:
  - the whole frame tints orange-red when the bomb goes off;
  - a 0.4-s orange multiply pulse plays for a "BATTERY LOW" alarm;
  - the frame dims to ~60 % before a zoom into a laptop screen.
- **Depth**: 3–5 flat parallax planes. Far planes are lighter and less saturated (atmospheric perspective), with
  a foreground occluder layer (tree trunks, bushes, seaweed) that sweeps past during pans and doubles as a wipe.
  Scale contrast is the big depth device: smash-zoom from a face ECU to a tiny figure in a vast scene.

### Composition

- **Wide shots**: subject centred or on a third, about 25–40 % of frame height, generous negative space.
- **Medium and close shots**: subject fills 60–100 % of height, often cropped at chest; background reduced to
  one colour field or a blurred plane.
- **Split screen** is used for comparisons: two side-by-side panels, or an inset panel taking 25–35 % of width.
- **First-person POV hands** (holding a phone, laptop or book) are the visual form of "you".

### Typography (1080p values; look-alike free fonts)

| element | font look-alike | size / case | behaviour |
|---|---|---|---|
| 2026 headline / stinger card | **Montserrat ExtraBold/Black** | cap height ≈ 9–10 % of frame height (~100 px; font-size ~140 px); line pitch ≈ 17 % (184 px); block ≈ 66 % of frame width; ALL CAPS, centred, 2–3 lines | white with soft drop shadow (offset 4 px, blur 8 px, black 45 %); one keyword in red `#E3201B`; background blurred (≈ 14–18 px gaussian) and darkened ~15 %, or a navy card |
| 2018–19 kinetic type | Montserrat Bold / ExtraBold | huge: hero word cap height 15–23 % of frame height; secondary line about 40 % of hero size; CAPS | words on a flat colour field or a blurred plate; often **rotated −12° to −20°**; highlighter bars behind words; per-letter pop |
| 2019 quote card | rounded geometric sans (Varela Round / Quicksand Bold) | cap height ≈ 11 % of frame height; sentence case; 5 lines, centred | white fill with a 3–4 px dark-blue outline on a blue vertical gradient |
| serif emphasis card (one-offs) | Bitter / Roboto Slab | mixed case; keyword in gold, ~1.6× larger | over blurred underwater footage |
| 2018 fact box | Montserrat SemiBold | ~40–42 px, sentence case, verbatim narration sentence | black on a white bar flush to the left frame edge (top-left or bottom-left), 24 px padding; typewriter reveal |
| speech bubble | Montserrat SemiBold / Bold | ~45–50 px, sentence case, ≤ 8 words | white rounded rect (radius ~8 px) with a short triangular tail; pops with back-out |
| chart titles and labels | Montserrat Regular → SemiBold | titles ~44 px CAPS (thin weights for titles, e.g. "ACTIVE MORTGAGES"); value labels ~56–80 px | letters pop in with random rotation, or type on |
| big numbers | Montserrat SemiBold | 80–120 px, e.g. "$2,400/YEAR", "$3,000/MONTH" | white with drop shadow over the illustration, or in a white price tag on a string, or a red label box ("7% INTEREST") |

### How much text

| video | share of timeline frames with on-screen text | of which numbers |
|---|---|---|
| Mariana | ≈ 17 % | |
| whale | ≈ 21 % | |
| nuclear | ≈ 37 % | persistent fact boxes |
| data 2026 | ≈ 54 % | ≈ 25 % |

- **2018–19**: a full-screen type card about once per 45–90 s.
- **2026**: a full-screen card about every 40 s.

## 6. Characters & objects

### The "you" stand-in (2018–19 house everyman)

Describe and rebuild the type; do not copy the exact character.
- **Proportions**: head ≈ 1/4.5–1/5 of standing height. Torso is a wide rounded trapezoid about 1.5 head-widths
  across. Legs are about 45 % of height. Neck is a short tube in the skin shadow tone, or none.
- **Hands are oversized balls** with no fingers: fist diameter 0.65–0.9 × head height, and in close-ups as big as
  the face. Arms are tapered "bendy" tubes (≈ 0.35 head-width at the shoulder, 0.25 at the wrist) with no visible
  elbow joint. Small dark rounded shoes.
- **Face**:
  - eyes: tiny dark dots or short dashes, about 6 % of head width;
  - brows: short angled bars that carry most of the emotion;
  - mouth: a small shape (closed dash, open oval, grimace);
  - no nose;
  - hair: a slate blob of 3–5 overlapping circles;
  - shading: the face's far side is in the darker skin tone (a hard two-tone split).
- **Wardrobe**: plain white T-shirt and dark trousers (neutral, so the viewer can project onto it).
- **Expressions (about 8 presets)**: neutral, smile, grin, worried (brows up, small open mouth), shocked (oval
  mouth), angry (brows down), sick/disgusted (puffed cheeks), panic (both fists on head). Plus blinks. **No
  lip-sync.** The narrator is off-screen. A mouth flap runs only when a character "speaks" a speech bubble.

### Other casts

- **Stock-library extras** (2018 nuclear; scientists, sailors and nobles in the whale video): Freepik-style flat
  people, ~1:5–1:6, with white eyes plus pupils, noses and some contour lines. Mixing these with the house
  everyman is normal.
- **2026 corporate cast**: big heads (~1:4.5–1:5), slim suits, helmet hair shapes in black or brown, large C-ears,
  dot eyes, wide "D" mouths showing white teeth, mitten hands with thumbs. No outlines. Emotion comes from mouth
  shape, brow tilt and tear drops (cyan droplets), and from props held up to camera (bills, phones, documents).

### Acting and rig

- **Puppet rig** (AE/Duik style): joints rotate about pivots and the whole figure translates. Gestures are
  2–3 key poses in 0.5–1.0 s with ease-in-out. Example: arm raises a glass in 0.5 s, holds 0.3 s, lowers 0.5 s.
- **Idle loops are always on**: torso breathing (scaleY 1.00↔1.02, 2 s), head tilt ±2–3° (1.5 s), weight shift,
  blinks every 2–4 s (3 frames closed).
- **Reactions**: a quick pose swap plus brow change, sometimes with 1–3 "?" marks popping above the head at
  3-frame intervals.
- **Characters rarely walk.** They are placed in poses, slid or popped in, and the camera does the travelling.

### Props and icons

- **Flat, chunky, slightly rounded**: banknote stacks (green, "$" medallion), documents with grey line-stripes and
  a red stamp, phones with tiny UI, porthole windows, submarine, bunker shelves of bottles and cans, maps with
  ping rings, calendar icons, balance scales, house pictograms, newspapers with a headline.
- **Props are the carriers of numbers** (see §8 data treatment).
- **Recurring gag inserts**: meme overlays (game-over text band), 8-bit pixel-art parody scene, white silhouette
  pictogram on dark grey (`#3C3F44`), newspaper clipping in greyscale.

## 7. Camera & transitions catalogue

Durations measured from native-30 fps diff curves. Frequencies come from 12 sampled scene changes per video.

| # | transition | build (frame by frame) | duration @30 fps | ease | where / how often |
|---|---|---|---|---|---|
| T1 | **Smash zoom-out / push-in** | camera scale 3–10× → 1× (or reverse) on a world group; peak velocity around frame 8 | 20–24 f | `expo.out` (out); `power2.inOut` (push-in) | very common 2019; whale and Mariana about 3–4/min |
| T2 | **Whip-pan / whip-tilt** | 2–4 frames of directional motion blur (or a full blurred smear frame), hard swap inside the blur, then settle | 4 f blur + 8–15 f settle | `power4.in` → `power3.out` | about 2/min (rocket launches up → globe; surface → underwater with light rays) |
| T3 | **Foreground-occluder wipe** | pan across a foreground layer (tree trunks, seaweed, a giant character) that briefly fills the frame; new scene behind it | 10–14 f | `power2.inOut` | whale and Mariana about 1/min |
| T4 | **Zoom-through** into a picture, screen, porthole or photo | scene dims ~40 %, camera pushes until the inner frame fills the screen; the inner content is the next scene | 15–20 f | `power3.in` | about 1/min; POV laptop/phone, photo of a whale |
| T5 | **Burst-through / portal** | a white disc with a coloured hole expands from a point; the character bursts toward camera; the disc becomes the new flat background; 4–6 paint-splat blobs fly off | 15 f | `back.out(1.4)` | openers, reveals |
| T6 | **Blink / iris** | black eyelids close from top and bottom with curved (almond) edges, 1 black frame, open onto the new view (optionally blurred, focusing in) | 22 f | `sine.inOut` | POV "you wake up / pass out" moments |
| T7 | **Push slide** | old panel slides out left while new slides in right, same speed | 24 f | bell-shaped velocity, `power2.inOut` | split-panel comparisons |
| T8 | **Flat shape wipe** (2018 pack): diagonal band, stacked colour blocks, circle burst, zig-zag, rising mountain, almond/eye, multi-stripe, rounded-rect + bars | cover phase (shapes fill the screen in 2–4 colours drawn from the palette) about 10 f, solid hold 2–4 f (scene swaps here), reveal phase about 10 f | 18–34 f (median about 24) | `power2.inOut` per phase; sibling shapes staggered 2–3 f | **the** transition of the 2018 nuclear video (about 75 % of changes, about 5/min) |
| T9 | **Liquid / splash wipe** | an organic wave or splash blob (water blue, coffee brown) sweeps across and erases the old scene; new scene under it | 13–16 f | `power2.out` | 2026: about 3/min |
| T10 | **Shatter / shard / torn-paper dissolve** | old frame breaks into 15–40 polygon shards or brush strokes that fly outward and rotate; new scene underneath | 20–22 f | `power2.in` | 2026: about 2–3/min |
| T11 | **Spiral / swirl wipe** | concentric rings or curved streaks rotate in and out | 13 f | `power3.inOut` | 2026 occasional |
| T12 | **Particle disintegrate / assemble** | old scene breaks into dots that blow away; new scene assembles from dots | 12–15 f | `power2.in` / `power2.out` | 2019 occasional |
| T13 | **Element fly-off** | foreground cards slide out of frame (to the right, or tilted off) to reveal the underlying blurred plate, then a new icon pops | 10–12 f | `power2.in` | data video between props |
| T14 | **Type exit / tunnel** | the camera rotates and zooms into one huge letter of the kinetic type until it fills the frame (counter becomes the next background); or letters scatter with rotation plus sparkle stars | 10–15 f | `power3.in` | whale and Mariana type cards |
| T15 | **Colour-field swap** | the screen floods with one flat colour (often the next card's background) | 6–8 f | `power2.inOut` | into type cards |
| T16 | **Fade to / from black** | rare; used for "inside the whale" darkness and a dim flicker | 6–10 f | linear | whale only |
| T17 | **Hard cut** | genuine, rare; 0–1.7 per minute, usually on a big beat or into the sponsor/ident | 0 f | — | |

**Camera between transitions.** A continuous drift is always running:
- slow push-in of 2–8 % over a 3–6 s hold (`sine.inOut`);
- follow-pans that track a moving subject (submarine, hamster ball) at 0.05–0.15 frame widths per second;
- re-framing moves of 1.2–1.7 s from one character to the next instead of a cut. Two-shot → close-up push-ins
  take 0.7–1.0 s.

## 8. Motion grammar

### Easing families

| motion | ease | duration |
|---|---|---|
| pop entrances | `back.out(1.7)`, scale 0 → 1.1 → 1.0 | 8–10 f |
| camera drifts | `sine.inOut` | 1.2–1.7 s |
| smash zooms | `expo.out` | 20–24 f |
| whips | `power4.in` 3–4 f, then `power3.out` | 8–15 f |
| physical props (balance beam, hanging tag) | `elastic.out(1, 0.4)` damped swing, 2–3 visible oscillations | about 1 s |
| shape wipes | `power2.inOut` per phase | |

### Stagger

- 2–3 frames between siblings: "?", "??", "???" at 3-frame steps; map pins "PAID OFF" at about 3 f; letters
  2 f apart in per-letter pops.
- Lists of props (supplies, costs) stagger 0.4–0.6 s apart, timed to each spoken item.

### Build-on order

1. Background (via transition).
2. Hero character or prop.
3. Supporting props.
4. Label/number.
5. Speech bubble or fact box.

Labels never precede the thing they label. Charts build axes, then title, then data (line draws left→right or the
donut arc sweeps clockwise from 12 o'clock), then value label, then an annotation card.

### Kinetic type mechanics

- **2026 headline**: background blur ramps 0 → full in about 4 frames, then text types on at **~1 character per
  frame**. Each glyph fades/scales in over ~3 f, so the leading edge is soft. A 3-line card of ~38 characters
  completes in ~1 s and holds about 1–2 s after the line is spoken.
- **2018–19 per-letter pop**: each glyph scales 0 → 1.15 → 1 with random rotation ±25° and a y-offset of
  10–20 px that settles in about 4 frames. Letters are 2 f apart and the secondary line follows. The whole block
  then tilts or the camera zooms into it as the exit.

### Idle and secondary motion

- Something always moves: character idle loops, bubbles, marine snow, flicker on fire and lights, drifting clouds.
- This is why hold_frac is only 2.5–5.6 % in the 2019 videos despite long "shots".
- Use a slow camera drift as the last-resort idle.

### Holds and rhythm vs narration

- A scene or layout lives **3–4 s** on average (median gap between events 2.8–3.3 s).
- A single illustration with internal moves can live 10–25 s (longest static stretch 13–24 s).
- **Visuals are literal and land on the spoken noun or number.**
  - Typed headlines lead the voice slightly: "NIGHTMARE" finishes typing ~0.3 s before the word is spoken.
  - Data reveals lag by 0.3–0.8 s ("60%": spoken 5:56.7, arc sweep 5:57.0, label 5:57.5).
  - Each listed item in the voice gets its own prop pop.
  - Stressed punchlines get a full-screen card or a smash zoom.

### Data/number treatment ("Follow the Math", 2026)

- **No equations or working are ever shown.** The narrator states the math; the screen shows the result as an
  object. About 2.8 spoken numbers per minute; about 25 % of frames show a number or chart.
- **Number containers**, in order of frequency:
  1. **Price tag on a string** hanging from a prop (white rounded tag, black text, types on in about 0.5 s:
     "$40" → "$400,000").
  2. **Phone/app readout** held in a hand: a big white figure on a green banking card, with a **tick-down
     counter** to dramatise loss ($10,400 → $10,024 → $4,533 → $25 over about 1.5 s).
  3. **Big white figure with a drop shadow** over the illustration, often with a money stack ("$2,400/YEAR" over
     a US map).
  4. **Red label box** with a white figure ("7% INTEREST").
  5. A rate chip in a corner ("INTEREST RATE 6.71%", "DATE September 2026") with a small icon.
- **Comparison devices**:
  - **balance scale** (RENTER vs HOMEOWNER labels on the pans, money pile drops on one side, beam tips with an
    elastic settle, ratio "40X" pops above);
  - **split screen** (city flat vs suburban house, both "$3,000/MONTH");
  - **before/after bar** (one red bar on bare axes, shrinks from "2017" to "2018");
  - **isotype people-pictograms** under calendar icons (34 M vs 14 M);
  - **house-shaped bars** (white tall house pictograms with a red "%" roof).
- **Charts are schematic**:
  - no gridlines, no tick values, no legends;
  - two black arrowed axes, one red series, uppercase title top-centre, one short CAPS annotation at the line's
    end ("BUYER'S MARKET");
  - the chart lives on a white card, a whiteboard or an easel, and **the camera pulls back to make it
    diegetic** (a presenter and an audience appear);
  - donuts sit on a blurred map: blue base ring, red arc for the share, label in the arc.
- **Maps**: flat green land on bright blue sea. The camera zooms to a region; the highlighted state turns red with
  a small black label; money stacks drop in staggered.

## 9. Sound (inferred where marked; I cannot hear the audio)

- **VO**: one adult male narrator, American, bright and sardonic, heavily compressed. **200–215 WPM** (2026:
  ~190), steady within ±10 % per 30 s window, no pause longer than ~1 s. Jokes are delivered deadpan at the same
  speed, with no comic pauses. Inferred from captions plus LRA 2.0–2.4 LU.
- **Loudness**: integrated −14.0 to −15.8 LUFS, LRA ≈ 2 LU (very dense; podcast/broadcast-style compression).
  `silence_s` = 0.
- **Music** (inferred): a continuous light, upbeat royalty-free underscore under the whole video, never stopping.
  Instrumentation is probably pizzicato, ukulele, light electronic or corporate-whimsical (guess); tempo
  ~100–120 BPM (guess).
  - The gaps between words (RMS p2) sit only 6–16 dB under the median VO level in 2018–19 (whale: about 6 dB), so
    the bed is mixed fairly hot.
  - In 2026 the p2 RMS drops to −41 dBFS vs −18 median, which suggests a much quieter bed or a dry VO.
- **SFX** (inferred from visual density): one whoosh per transition (about 11–17/min); soft pops or clicks on
  every element pop (several per minute); cartoon impacts on smash zooms and stamps; ambient beds per environment
  (bubbles, fire crackle, office hum); meme stings on gag inserts; alarm beeps with tint pulses. SFX never cover
  the VO.

## 10. Do / Don't

**Do**
1. Write in second person for scenario topics: about 45–55 "you" per 1000 words, density rising after the first
   20 % of runtime.
2. Build the body as a ladder of 4–6 problems ordered by a path, a clock or a needs hierarchy, each harsher than
   the last.
3. Give every rung a hard number plus an absurd everyday comparison (Everest, hamster ball, "400 of your friends").
4. Keep narration at ~200–210 WPM with no pause longer than about 1 s, over a never-silent music bed.
5. Change scene or layout every 2.5–4 s, and use a motivated animated transition (whip, smash zoom, zoom-through,
   occluder wipe, shape/liquid wipe) for about 90 % of the changes.
6. Keep a virtual camera moving 25–40 % of the time; push in more often than out (~2:1).
7. Keep every frame alive: idle loops on characters, particles, blinks. Hold fraction under 10 %.
8. Make visuals literal: show exactly the noun or number being said, within ±0.5 s.
9. Use saturated flat colour fields behind close-ups, and 3–5 parallax planes for wides.
10. Repeat the punchline sentence as a big kinetic-type card about every 30–60 s, with one keyword in a contrast
    colour.
11. Carry numbers on props (tags, phones, stacks, scales) and keep charts schematic: arrowed axes, one red series,
    no ticks.
12. End with a verdict, a callback joke, a direct question to the comments, and a ~10–12 s end card.
13. Use first-person POV hands (phone, laptop, book) to make "you" visual.

**Don't**
1. Don't use hard cuts as the default edit. Real cuts are 0–1.7/min.
2. Don't use dark, moody grades. Dark frames are < 8 % and only for literal darkness.
3. Don't outline characters or add texture, grain or realistic lighting.
4. Don't lip-sync the narrator or give characters long dialogue. Speech bubbles stay at ≤ 8 words.
5. Don't let a character walk across the screen for long. Pose it and move the camera.
6. Don't show equations, gridlines, tick labels or legends, even in a "math" video.
7. Don't slow down for jokes or add dramatic silences.
8. Don't hold a static frame for more than ~3 s without some motion.
9. Don't put more than ~10 words of body text on screen outside a dedicated type card.
10. Don't use more than one keyword colour per card, or more than 3 lines in a headline.
11. Don't copy the channel's logo, its blue-sphere mark, its striped ident card, the exact everyman design, or its
    end-card layout. Design an original mark and stand-in using the same construction rules.
12. Don't name real brands, games or celebrities in an original build just because the source does. Swap in
    generic or invented references.

## 11. Replication recipe (code)

### Stack

- SVG scenes in one HTML page at 1920×1080, GSAP 3 (`https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js`).
- One master timeline, seeked frame by frame at 30 fps (`tl.seek(f/30)`) and captured with a headless browser.
- Kokoro TTS at speed ≈ 1.15–1.25 to reach 200–210 WPM. Keep sentence gaps 0.15–0.35 s and paragraph gaps
  ≤ 0.6 s.
- Music: a looping 110-BPM pizzicato/marimba bed, normalised so gaps sit ~12 dB under VO.
- SFX: a whoosh library (5–8 variants) triggered at every transition start; pops on every `back.out` entrance.
- Master to −14 LUFS with a fast compressor/limiter (LRA ≈ 2 LU).

### Layer stack (bottom → top)

```
#stage (1920x1080, overflow hidden, background = scene colour field)
  #camera            <g> transform: translate/scale/rotate (the virtual camera)
    #bg-far          parallax 0.3   flat sky/sea, lighter + desaturated hills
    #bg-mid          parallax 0.6   buildings / reef / room walls
    #actors          parallax 1.0   puppets + props
    #fx              parallax 1.0   particles (bubbles, snow, fire flicker), ping rings
    #fg-occluder     parallax 1.4   trunks/seaweed/blurred giant objects (used for T3 wipes)
  #hud               (outside camera) fact boxes, value tags pinned in screen space, chart cards
  #typecard          full-screen kinetic type; when active, #camera gets filter: blur(16px) brightness(.85)
  #transition        full-frame wipe shapes / clipPath masks / shard groups
  #bug               (optional) your own small corner mark, bottom-left, 6 % of height
```

### Recipes

- **Parallax camera**: one function sets `#camera` scale/pos and offsets each depth layer by
  `(1 - parallax) * camX`, so that a pan of X moves far layers less.
- **Whip (T2)**: animate `camX` by ±1.2 frame widths in 0.13 s (`power4.in`), then from ∓0.4 fw to 0 in 0.4 s
  (`power3.out`) in the next scene. During the fast frames, draw 4 ghost copies of `#camera` offset along the
  motion vector at 0.5/0.3/0.2/0.1 opacity, or apply `<feGaussianBlur stdDeviation="40 0">`. Swap scenes on the
  blurriest frame.
- **Smash zoom (T1)**: `gsap.fromTo(cam,{scale:6, x:..., y:...},{scale:1, duration:0.75, ease:"expo.out"})` with
  the transform origin on the subject's face.
- **Zoom-through (T4)**: dim the scene (`brightness .6`, 0.2 s), scale the camera about the screen or photo centre
  until its inner rect equals the stage (0.55 s, `power3.in`). Then reveal the next scene, already sized to the
  inner rect, and settle at scale 1.
- **Shape wipe (T8)**: build 3–6 shapes in palette colours (diagonal rect rotated −30° and 1.6× the frame
  diagonal; or N circles at random points). Cover: `scale 0→1` or `x −W→0`, 0.33 s, `power2.inOut`, stagger
  0.07 s. Swap scenes at full cover (hold 3 f). Reveal: continue the motion off the other side, 0.33 s.
- **Liquid wipe (T9)**: one `<path>` blob with 3 keyframe shapes of equal point count. Interpolate the points
  manually (or with flubber via jsDelivr) over 0.5 s. Use the same path as a `clipPath` on the incoming scene.
- **Shatter (T10)**: precompute ~30 Voronoi cells (d3-delaunay). Clone the old scene into each cell's clipPath
  and tween each shard `x/y` outward along the centre→cell vector by 300–700 px, `rotation ±40°`, `opacity→0`,
  0.6 s `power2.in`, stagger by distance from the impact point.
- **Blink (T6)**: two black almond paths (top and bottom) whose inner edge is a quadratic curve. Close 0.3 s
  (`sine.in`), hold 1 f, open 0.4 s (`sine.out`) onto the next scene, starting at `blur(10px)` → 0.
- **Headline card (2026)**: on `#camera` tween `filter: blur(0→16px) brightness(1→.85)` in 4 f. Split the text into
  chars and `gsap.from(chars,{opacity:0, scale:.6, duration:.1, stagger:1/30})`. Keyword chars get
  `fill:#E3201B`. Hold until 1 s after the line is spoken, then reverse the blur under the next transition.
- **Per-letter pop (2018–19)**:
  `gsap.from(chars,{scale:0, rotation:()=>gsap.utils.random(-25,25), y:()=>gsap.utils.random(-20,20), duration:.14, ease:"back.out(2)", stagger:2/30})`.
  Set the whole block at −15°. Exit by zooming the camera ×12 into one letter's counter.
- **Fact box (2018)**: white rect anchored at x=0, width sized to the text plus 48 px. Slide in from −width
  (0.25 s, `power2.out`), then type on at 2 chars/frame. Black Montserrat SemiBold 42 px.
- **Value tag**: a rounded white rect hung by a 3-px line from a prop's anchor. Swing with `elastic.out(1,.4)`
  rotation ±8° → 0 over 1 s, and type on the digits (0.5 s). For a counter, tween a JS object 10400 → 25 over
  1.5 s (`power1.in`) and write `toLocaleString()` each frame.
- **Balance scale**: beam `<g>` rotates about the fulcrum: `rotation: 0 → 14°` (`elastic.out(1,.35)`, 1.2 s) when
  the money pile drops (pile pops with back.out, staggered bills). The ratio label pops above.
- **Schematic line chart**: two arrowed axes (5 px black, round joins); the series is a `<path>` with
  `stroke-dasharray` drawn over 1.0 s (`power1.inOut`); the arrowhead marker rides the end. Title and annotation
  letters pop. Then pull the camera back ×0.45 over 1.2 s to reveal the easel and audience.
- **Donut**: an SVG circle with `stroke-dasharray` arc tweened 0 → share × circumference, starting at 12 o'clock
  (rotate −90°), 0.7 s `power2.out`, on a blurred map plate.

### Character rig

A nested `<g>` puppet with `transform-origin` at the joints.

- **Torso**: a rounded trapezoid; the shadow side is a clipped duplicate in a 15 % darker tone.
- **Head**: a rounded rect/ellipse with a two-tone split. The hair blob is a union of circles.
- **Face** sub-group with expression variants:
  - `eyes` = 2 small ellipses, `brows` = 2 rounded bars;
  - `mouth` = path set {closed, smile, grin, O, grimace, sick};
  - 8 presets swap paths in 2 f.
- **Arms**: each arm is a single bendy tapered path recomputed every frame from shoulder → elbow → hand (a
  quadratic bezier through a virtual elbow). The hand is a circle of r ≈ 0.4 × head height.
- **Legs**: tapered paths; shoes are rounded rects.
- **Idle**:
  - torso `scaleY 1→1.02` yoyo 1 s, `sine.inOut`;
  - head `rotation ±2°` yoyo 1.5 s;
  - blink every `random(2,4)` s (eye scaleY → 0.1 for 3 f).
- **Gestures**: 2–3 key poses per action, 0.4–0.6 s each, `power2.inOut`, with a 2-frame overshoot on the hand.

### Minimal scene skeleton (pseudo-code)

```js
const FPS = 30, tl = gsap.timeline({paused:true});
// beats come from the TTS word timings: [{t, word}], plus a scene list
scenes.forEach((s, i) => {
  const t0 = s.start;                     // seconds, aligned to the first word of the beat
  tl.add(transition(s.transitionIn), t0 - s.transitionIn.dur / 2);   // swap at the cover midpoint
  tl.call(() => mountScene(s), null, t0);
  tl.add(cameraDrift(s.camera), t0);       // e.g. push 1.00→1.06 over s.dur, sine.inOut
  s.cues.forEach(c => {                    // every spoken noun/number gets a cue
    const at = wordTime(c.word) + (c.kind === 'number' ? 0.3 : -0.1);
    if (c.kind === 'prop')    tl.from(c.el, {scale:0, duration:.3, ease:"back.out(1.7)"}, at);
    if (c.kind === 'number')  tl.add(valueTag(c), at);
    if (c.kind === 'react')   tl.add(expression(c.actor, c.face), at);
    if (c.kind === 'stinger') tl.add(headlineCard(c.text, c.keyword), at - 0.3);
  });
});
// render: for (f = 0; f < dur * FPS; f++) { tl.seek(f / FPS); capture(); }
```

### The 5 defining shots and how to build each

1. **"You" in peril, wide.** The stand-in centred at about 35 % of frame height in a 4-plane environment (trench
   floor, burning city, savannah with lion). The danger enters from one side, the camera pushes in 6 % over 4 s,
   particles drift. *Build:* parallax camera, idle loop, one prop pop per spoken item.
2. **Smash zoom-out to scale.** From an ECU of the worried face on a flat colour field to a tiny figure in a vast
   blue void (or a sphere 4 ft wide at 36,000 ft). *Build:* T1, `expo.out` 0.75 s, colour field crossfading into
   the environment during the first 8 frames.
3. **Kinetic punchline card.** The stinger sentence typed one character per frame over the blurred scene
   (2026), or tilted per-letter-pop words on a coral/mustard field with highlighter bars (2018–19). Exit by
   zoom-into-letter or a liquid wipe.
4. **Number on a prop / schematic comparison.** Balance scale tipping with a "40X" label, price tag on a money
   stack, phone balance ticking down, donut on a blurred map, line chart that the camera pulls back from to
   reveal an easel. *Build:* §11 recipes; one red highlight per chart.
5. **POV hands plus zoom-through.** First-person hands hold a phone, laptop or book (big pink/peach hand shapes
   entering from the bottom corners, slight handheld bob ±4 px at 0.5 Hz). The camera zooms through the screen
   into the next scene. *Build:* T4.

Bonus establishing shot: **map ping.** A flat map tilts and zooms in 1.2 s (`power2.inOut`); a white double ring
pulses (scale 0.5 → 1.6, opacity 1 → 0, 0.8 s loop); the CAPS label types on next to it.

## 12. Per-video notes

**4Fbu5vixROc, nuclear (2018-06): the old, slower template.**
- Opens with a 7.6-s sponsor card. Then a 20-s single-scene "Imagine this" catastrophe with escalating global
  tints (sky → orange, buildings → red gradient wipe, fire FX).
- A channel sting at 35–39 s, assembling from particles, then a title card with a circular vignette illustration.
- The look is mostly stock vector characters and scenes.
- **Persistent white fact boxes** quote the narration verbatim (top-left or bottom-left) for long stretches.
- Transitions are almost all flat colour-shape wipes (T8, about 5/min).
- Hold fraction is 32 %, and the camera barely moves (3 % of time).
- Split screens: bomb factory | map; map | inset of ruined houses.
- The sponsor end-read (~50 s, uncaptioned, screen-recording with 3D-rotate blur transitions) sits between the
  comment question and the CTA. That is why caption WPM reads low (187 vs ~211) and animated_frac reads 0.84.

**b-d_VfBCPCM, Mariana (2019-07): the best template for "could you…" scenarios.**
- A 38-s sponsor pre-roll (live 3D game footage inside a cartoon phone) precedes everything, so the metrics'
  opening sheet shows only the ad.
- The hook question arrives as a navy type card at 66–69 s.
- Pure needs-ladder structure: shelter → water → food → warmth/power → toilet → verdict.
- Highest zoom share (23 %) with the largest moves (×1.26); hero everyman throughout; recurring yellow
  submarine/porthole set; colour-tint alarm pulses.
- Meme insert near the climax, plus a callback-joke ending.

**gvWQ2ZcjWnY, whale (2018-11): the camera-first house style at full speed.**
- Fastest narration (209–212 WPM) and highest motion (14.6).
- Hook is a 3-tip survival montage.
- The middle 40 % is a third-person history story (1891 sailor) with greyscale newspaper inserts, period-costume
  stock characters, an 8-bit pixel-art parody and a pictogram silhouette whale.
- The "you" ladder returns at 69–83 %. The darkest scenes (stomach, red-black) are the only dark section.
- Transition variety is the widest: burst-through, occluder pans, splash tilts, zoom-through photo, push slides,
  blink, whip-zoom past a giant foreground character.

**DRP7tRXts0Q, Renting vs Buying (2026-10): the current house style.**
- 2026 corporate flat cast (bigger heads, toothy D-mouths); persistent channel bug bottom-left for the whole
  runtime; "no AI / human created" and "narrated by" chips in the first 5 s.
- About 20 stinger lines drawn as blurred-background or navy headline cards. Transitions are a stock-feeling pack:
  liquid, coffee splash, swirl, shards, shatter.
- Numbers on props, schematic charts and balance scales throughout. No title line, no "like/share/subscribe", no
  comment question: just "Watch '…' … Or click on this." over a cyan "WATCH THIS:" end card.
- "Follow the Math" is a narrative essay with about 2.8 numbers per minute. No arithmetic is shown on screen.

## 13. Source-list issues

- **Era mismatch.** Three of the four sources are 2018–2019 uploads at 360p/480p. The channel's current (2026)
  look differs noticeably: corporate cast instead of the ball-fist everyman, transition packs instead of camera
  whips, headline cards, a persistent bug, no sponsor in this sample. A skill should pick one era deliberately.
  The 2019 "camera-first" era is the most distinctive; 2026 is the most data-friendly. Don't average them.
- **Sponsor contamination of hook metrics.** Nuclear (0–7.6 s plus a ~50-s end read) and Mariana (0–38 s of live
  3D game footage) begin with ads. `opening.jpg` and `cuts_first_15s` describe the sponsor, not the hook.
  Mariana's real hook starts at 0:38. Nuclear's caption-based WPM is understated because the sponsor read is
  uncaptioned. Nuclear's `animated_frac` (0.84) and data's (0.80) are lowered by screen-recordings and blurred
  plates, not live action: all four are 100 % animated.
- **"Puppet-rigged flat characters" is only partly true.** The 2018 nuclear video is built largely from stock
  vector characters and scenes, and stock extras appear in every video. The consistent element is the rigging
  and motion grammar, not one character design.
- **"Almost no hard cuts" is true but misleading.** Scene changes happen 11–17×/min (2019/2026) through 0.4–0.8 s
  animated transitions the scene detector cannot see. Only the 2018 nuclear video is slow (about 5/min).
- **"Follow the Math" is not a maths/chart-explainer format.** It is an opinion essay with numbers as props. Use
  it for number staging, not for chart-heavy layouts.
