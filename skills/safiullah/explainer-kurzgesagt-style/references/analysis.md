# Kurzgesagt – In a Nutshell: style analysis

Flat-vector science animation. This covers the animated content only: sponsor screen recordings and live-action shop B-roll are excluded from the style rules but are flagged where they distort the metrics.

Measurement note. The numbers come from `frames/<id>/metrics.json`, plus my own extra pass over the MP4s in `research/media/`. That pass used the *editorial segment only*: ON 0–350 s, Egg 0–454 s, Fermi 0–358 s, PXbV 0–108 s (the animated half), Trees 0–578 s. It measured:
- **Hue share**: share of each hue among saturated pixels (S > 0.45, V > 0.25).
- **Gradient texture**: Sobel magnitude on a 320×180 blur, split into flat < 0.35 / smooth gradient 0.35–3 / edge ≥ 3.
- **Camera motion**: ECC affine fit at 6 fps, split into zoom / pan / local animation / hold / cut. This is a rough estimate.
- **Dark↔bright flips**: scene median luma crossing < 60 → > 120.
- **Narration rhythm**: from the word-timed auto captions (`*.en-orig.vtt`).

Abbreviations: ON = Optimistic Nihilism, Egg = The Egg, Fermi = The Fermi Paradox, PXbV = You Will Only Like Half of This Video, Trees = Why Are There No Holes Around Trees?

---

## 1. Identity

You recognise a Kurzgesagt frame by three things:
- **Colour.** A saturated "neon night" palette: deep indigo-violet backgrounds (never pure black). Out of them glow magenta, violet, cyan and amber shapes. About 75–80% of saturated pixels are cool (violet/blue/magenta), and a warm amber/orange accent supplies the contrast.
- **Shape.** Everything is built from soft, outline-free, rounded geometry: circles, blobs, capsules, scalloped clusters.
- **Light.** Small light sources do the lighting: stars, glowing orbs, screens, rim-light slivers, stepped halos.

The camera rarely cuts. In the 2015–2019 videos the world flows through continuous zooms between scales ("planet → solar system → galaxy"), shape-mask reveals, white-outs and morphs. Optimistic Nihilism runs 350 s with **zero hard cuts**. Recurring round, big-eyed birds act as audience stand-ins.

Over all of this runs a calm, articulate male narrator. He delivers dense facts at about 160–180 WPM, uses "But…" pivots, and ends on an uplifting, humanist line.

The 2026 videos keep the palette and add three things: painterly textures, depth-of-field blur, and noticeably more hard cuts (4–8 per minute).

---

## 2. Sources analysed

| id | title | year | dur s | cuts/min | median shot s | motion (mean/p90) | colourful | WPM (overall / editorial) | LUFS |
|---|---|---|---|---|---|---|---|---|---|
| sNhhvQGsMEc | The Fermi Paradox (1/2) | 2015 | 380 | 0.16 | 190.2 | 6.49 / 18.7 | **51.8** | 167 / 167 | −13.3 |
| MBRqu0YOH14 | Optimistic Nihilism | 2017 | 446 | 0.81 (0 in editorial) | 17.9 | 7.88 / 21.8 | **103.9** | 145 / **182** | −14.8 |
| h6fcK_fRYaI | The Egg – A Short Story | 2019 | 486 | 4.44 | 2.44 | 5.68 / 12.7 | 75.3 | 112 / 118 | −16.1 |
| pHJIhxZEoxg | Why Are There No Holes Around Trees? | 2026-01 | 680 | 5.03 | 8.65 | 7.97 / 20.8 | 84.3 | 160 / 161 | −16.0 |
| PXbVn-f_wuM | You Will Only Like Half of This Video | 2026-10 | 213 | 12.09 (~8 in animated half) | 2.87 | 10.31 / 24.2 | 90.9 | 138 / 147 | −15.2 |

Notes on these numbers:
- ON's overall WPM is diluted by an uncaptioned shop advert that was inserted later (5:50–7:13). Speech ends at 5:49, and the editorial rate is 182 WPM.
- The Egg's 36 cuts are clustered: about 20 of them fall in two montages (2:50–2:55 and 5:52–5:59).
- PXbV's cuts come mainly from its live-action half (1:47–3:19).

### Additional measurements (editorial segments)

| | Fermi 2015 | ON 2017 | Egg 2019 | Trees 2026 | PXbV 2026 |
|---|---|---|---|---|---|
| saturated-pixel share | 0.19 | 0.66 | 0.49 | 0.62 | 0.70 |
| hue share: violet / magenta / blue | 0.01 / 0.05 / 0.41 | 0.39 / 0.17 / 0.18 | 0.37 / 0.21 / 0.23 | 0.28 / 0.08 / 0.19 | 0.10 / 0.17 / 0.35 |
| hue share: cyan / green | 0.13 / 0.03 | 0.05 / 0.00 | 0.05 / 0.01 | 0.17 / 0.14 | 0.17 / 0.07 |
| hue share: red / orange / yellow | 0.12 / 0.08 / 0.16 | 0.04 / 0.09 / 0.09 | 0.03 / 0.08 / 0.03 | 0.04 / 0.07 / 0.04 | 0.03 / 0.06 / 0.06 |
| pixels flat / smooth-gradient / edge | 0.48 / 0.21 / 0.31 | 0.55 / 0.22 / 0.23 | 0.63 / 0.19 / 0.19 | **0.37 / 0.30 / 0.32** | 0.40 / 0.28 / 0.32 |
| steps with camera zoom+pan (ECC, approx.) | ~15% | ~44% | ~32% | ~42% | ~30% |
| hold (no change) | 31% | 18% | 20% | 18% | 4.5% |
| dark↔bright scene flips / min | 4.4 | 1.7 | 2.9 | 4.5 | 0.6 |
| frames with median luma < 60 | 62% | 62% | 68% | 55% | 45% |
| pauses > 0.75 s / min | 10.6 | 17.7 | 29.5 | 10.9 | 16.1 |
| median words per phrase (split at gaps > 0.45 s) | 3 | 4 | 2 | 3 | 2 |
| median sentence length (punctuated transcripts) | – | 14 words | – | 18 words | 17 words |

---

## 3. Measured pacing

**Target ranges for an "in-the-style" explainer.** These follow the 2017–2026 mainline. Treat Fermi 2015 as a variant.

| parameter | target | evidence |
|---|---|---|
| hard cuts | **0–1/min** (classic continuous style) or **4–6/min** (2026 style); never > 8/min in animation | ON 0 in 350 s; Fermi 1; Trees ~4/min; PXbV animated half ~8/min |
| shot length between hard cuts | median 8–20 s; long takes up to 60–190 s | Trees 8.65 s, ON 17.9 s, Fermi 190 s |
| new visual event (label, morph, object, camera beat) | **every 2–3 s** in explainers, 4–6 s in narrative pieces | Trees 0–16 s: events at 4.0, 6.0, 7.4, 8.4, 13.0 s; ON at 6, 7.9, 9.7, 12.2, 14.7 s; Egg at 5.2, 13.0 s |
| motion_mean / p90 | 6–10 / 18–24 | all four explainers |
| hold_frac | 0.12–0.18 | idle motion everywhere (twinkle, bob, drift) |
| camera drift share | 30–45% of time has a coherent zoom or pan running | ECC estimate |
| zoom speed for drifts | 2–6% scale per second; dives accelerate to 15–25% per step at 6 fps just before the swap | Trees 0:00–0:03.7: 1.5–3.6% per 1/6 s, then 5→20% in the final 0.5 s |
| lateral truck speed | ~100–135 px/s at 1080p for the midground layer | ECC median, Egg/Trees/Fermi |
| hook length | 33–44 s (6–10% of runtime) before title or logo | Fermi 35 s, ON 35 s, Trees 44 s |
| end card | 11–17 s | ON 12, Egg 11, Trees 15, PXbV 14, Fermi 17 |
| loudness | −14 to −16 LUFS integrated | −13.3 … −16.1 |

**Pacing curve.** The motion deciles show two patterns:
- **Front-loaded:** Trees runs 9–11 in deciles 1–5, then 4.3 in the last.
- **Late crescendo** at 70–85% of runtime: Egg 12.35 in decile 8 (the "you are everyone" montage); ON 12.7 in decile 9.

Four of five videos *end calm* (last decile 3.0–4.4). ON's 9.85 is the inserted advert. Rule: build the densest sequence (fastest cuts, montage, biggest light burst) at about 75–85% of runtime, then decelerate into one long, slow, wide shot under the closing line.

**Light rhythm.** Scenes alternate between dark "space/inside" scenes and bright "day/outside" scenes. In Trees and Fermi this happens 4.4–4.5 times per minute; ON is calmer at 1.7. Use the swap as punctuation, timed to a new sentence or section.

### Era comparison (2015 → 2017/19 → 2026)

| aspect | 2015 (Fermi) | 2017–2019 (ON, Egg) | 2026 (Trees, PXbV) |
|---|---|---|---|
| palette | Muted navy space `#132533` + off-white info panels `#EBEAE8`. Pastel salmon/teal/mustard. Blue dominant, almost no violet. Colourfulness 52, sat-share 0.19. | "Neon night": indigo `#100635` + violet/magenta (56–58% of saturated px) + amber. Colourfulness 75–104, sat-share 0.49–0.66. | The same night palette plus naturalistic greens and cyans (green 14%, cyan 17%). More daylight scenes. Colourfulness 84–91. |
| rendering | Pure flat fills, small icon-like objects, lots of edges (0.31). No gradients on objects. | Large flat fields (55–63% flat) + soft background gradients. Tone-on-tone patterns (swirls, wave hatching, dot grids). Rim lights. | **Painterly**: brush-textured shapes, scalloped multi-value foliage, 3–4 value steps, **depth-of-field blur**, bloom flashes. Flat share drops to 0.37–0.40, gradient share rises to 0.28–0.30. |
| lighting | Concentric translucent rings, white star dots, no bloom. | Stepped halos, warm rim slivers, light cones, sparkle stars. | All of 2017's lighting plus additive bloom, god-ray fans, glowing neon outlines and screen-glow on characters. |
| information design | Info-graphic **panels**: chamfered banner tags ("THE UNIVERSE"), stacked number bands, multi-panel grids, speech bubbles. | Mostly pure illustration. Rare big typographic moments ("5,200 WEEKS" on an LED dot grid, a custom title). | Colour-coded **pill labels** with connector lines, data discs ("82%"), word-by-word title cards. |
| density | Many small objects on a big neutral field. | Fewer, bigger, more decorative elements. | Dense, detailed full-bleed environments. |
| camera/cuts | 0.16 cuts/min. Transitions are panel slides with sawtooth edges and scale morphs. Hold 31% (static info frames). | 0–2 cuts/min (outside montages). Continuous zooms and mask reveals. Hold 18–20%. | 4–8 cuts/min, but still with long continuous camera moves (~42%) and dive transitions. Hold 4.5–18%. |
| narration | 167 WPM, few pauses (10.6/min), lists and enumeration (numbered possibilities). | 182 WPM with frequent short pauses (17.7/min), philosophical. Egg: 118 WPM dialogue. | 160 WPM, 18-word sentences, extended industrial/city metaphors for biology, and an explicit mid-video "second half" hand-over. |

---

## 4. Script & narrative structure

**Beat map** (percentages of the editorial runtime, i.e. before the sponsor/support block):

| % | beat | examples |
|---|---|---|
| 0–8% | **Hook** (33–44 s). One of three forms: (a) an opening question; (b) a superlative fact → tangible comparison → contradiction → explicit question; (c) a "we/you" mythic frame that is then reversed. | Fermi opens on a one-line question about whether we are alone. Trees: the heaviest living thing → its mass in blue whales → "then where are the holes?" → "How does this work?" ON: a short statement that existence is frightening, then a comforting myth that the world was made for us, then a "But…" reversal at 0:35. |
| 6–10% | **Title / logo sting**. A 4–6 s music-only gap (Fermi 0:35–0:41, captioned "[Music]"), or a title card with a word-by-word build (Trees 0:44). | |
| 10–55% | **Escalating explanation**. Scale ladders (planet → group → supercluster), numbers anchored to human comparisons (Fermi turns a star count into "a hundred lifetimes" of counting), and zoom-in camera dives announced in the narration. | |
| ~55% | **Naming the concept** mid-video, at the turning point. Fermi drops its giant title at 3:26 (57%), the moment the narrator names the paradox; ON at 3:15 (55%). | |
| 55–90% | **Enumerated possibilities or the second half**. Numbered options ending in "one final thought" (Fermi). "But this is only half of the story" (Trees 5:11 = 53%). Argument and counter-argument (ON). | |
| 90–100% | **Humanist uplift**. A short closing line, often a reframing of the viewer's place in the universe. ON closes on doing what makes you happy; Trees on how wild trees are and how much is left to learn. | |
| after | **Sponsor/support block** bridged by a related fact (Trees: fungi breakthrough → "problem-solving skills" → sponsor), 80–90 s. Then a **12–17 s end card**. | |

**Sentence craft:**
- Median sentence 14–18 words, with frequent 3–6-word one-liners ("This is a lot.").
- About 1 rhetorical question per 2 minutes.
- Section hand-overs are verbal connectives: "But…", "Let's zoom into…", "So…", "One final thought…", "So, wrapping up…".
- Big numbers always arrive with a human-scale analogy in the same or the next sentence.
- Wry, deadpan asides puncture the gravity. Examples: listing finishing video games among humanity's goals, or describing the early galaxy as a place where things kept exploding.

**Narrative short (The Egg).** It differs on every axis:
- Second-person, in-medias-res opening that tells the viewer they have just died in an accident.
- Dialogue beats at 2 words per phrase and 29.5 pauses per minute.
- No labels or numbers.
- The **title card comes at the end** (7:34 = 93%, after the twist), followed by a support card and the end card.
- The visuals are mostly two characters in a black void, punctuated by colourful life vignettes and two rapid montages.

**Self-referential hook (PXbV 2026).** It opens with an imperative wake-up shout, then immediately comments on its own hook. This is a channel-message format, not an explainer.

---

## 5. Visual system

### 5.1 Palette roles (hex)

**Night / space mode (default; 55–68% of frames have median luma < 60):**

| role | hex | notes |
|---|---|---|
| background deep | `#0E0D2B`, `#100635`, `#111233`, `#070815` | indigo-violet at L* ≈ 5–12. Never `#000000`. |
| background mid / vignette centre | `#24187E`, `#2C275B`, `#23347F`, `#140845` | radial gradient centre, horizon band, far silhouettes |
| primary violet | `#8321BD`, `#86319E`, `#3C0FB1` | big shapes, "x-ray" mode, nebula blobs |
| magenta / crimson (character bodies) | `#CF3067`, `#A62764`, `#9A146E`, `#E61DAD`, `#F91E8E` (highlight) | most frequent character colour |
| warm accent | `#F8AE1C` / `#FCB80B` amber, `#F0710E` / `#F56131` orange, `#F1BF5F` | rim lights, beaks, suns, alarm |
| cool glow | `#2C9ADA`, `#2D9ADA`, `#74D4E7`, `#25E8F1`, `#18DBD5` | glows, water, energy, UI neon |
| green (2026 nature) | `#59C963`, `#79A22B`, `#61AD36`, `#B1E92E` (highlight), `#1B6D5B` (shadow) | foliage in 3–4 value steps |
| highlight / cream | `#F3EAC2`, `#DFD5AE`, `#E7F3EB`, `#EFF2F2` | star cores, label text, sclera |
| shadow | `#090815`, `#450C5C`, `#5F1265` | shadows are darker *and more violet*, never grey |
| text | `#FFFFFF` on pills; `#EFF2F2` on dark | |

**Day mode:**
- Sky gradient from `#B1D0FB`/`#74D4E7` at the top to near-white `#E7F3EB` at the horizon.
- Amber ground `#FCB80B` with tone-on-tone swirl pattern `#F8AE1C`.
- Characters in saturated complementary hues: magenta faces on amber, blue hair.

**2015 information palette:** navy `#132533`, near-black `#041118`, panel off-white `#EBEAE8`, teal band `#76B1B8`, slate blue `#234069`, warm grey `#676262`, salmon `#EA8D7F`/`#F96569`, mustard `#EBBE2D`.

**Colour rules:**
1. Keep 70–80% of saturated pixels in hue 200–345° (blue → violet → magenta). Add one warm accent (15–20%), complementary to the dominant hue.
2. Push saturation to 0.65–0.85. Mean frame saturation measured 0.67–0.84 for 2017+.
3. Shade by hue shift. Shadows go darker and toward violet/blue; highlights go lighter and toward yellow/pink. Example: magenta body `#9A146E` → shadow `#450C5C` → highlight `#F91E8E`.
4. Each character or object gets one body hue, unrelated to real life: green, blue or magenta skin; purple trees in "inside view" scenes.
5. Use colour-swap scenes for meaning: daylight → violet "x-ray" palette when showing inner workings; red background for danger.

### 5.2 Shape language
- **Rounded everywhere.** Circles (planets, eyes, cells, heads, orbs) dominate. Blobs with organic wobble. Capsules (labels, speed streaks, limbs). Scalloped clusters (clouds, foliage, smoke). Tapered tubes (roots, branches, tentacles).
- Architecture keeps right angles but rounds corners at ~10–15% of the side length.
- Decorative "cosmic confetti" fills space: tiny ringed planets, spiral galaxies, faceted hexagonal crystals, 4-point sparkles.
- Patterns inside large fields: tone-on-tone swirls (ON landscapes), parallel wavy hatching (ON ocean), dot grids / LED matrix, honeycomb cells (2026 catalogue grid).

### 5.3 Line work
- **No outlines** on characters or objects. Form comes from fill shapes only.
- Strokes appear only as:
  - **Rim-light slivers**: 3–7 px at 1080p, warm on dark bodies.
  - **Connector lines** for labels: 3–5 px, round caps, ending in a 10–14 px ring dot at the anchor.
  - **Neon highlight outlines**: 5–7 px white core plus a 20–30 px blurred glow, used around the part being explained.
  - **"Vessel" frames**: 20–28 px strokes with gradient colour around shape-windows (ON hourglass window, red → blue).
  - **Orbit / trajectory lines**: 2–3 px, 40–60% opacity.
  - 2026 foliage and bark: thin darker interior contour strokes.
- All stroke ends use round caps and joins.

### 5.4 Texture / grain
- 2015: none.
- 2017–2019: no noise. Texture is graphic, from patterns (swirls, hatching, star specks inside silhouettes).
- 2026:
  - Painterly brush texture inside large shapes: foliage clumps with stipple highlights, bark streaks, soft mottled skies.
  - Subtle noise at ~3–6% opacity.
  - **Depth-of-field blur** on far backgrounds and near foreground in close-ups (Trees bird at 1:18, forest at 0:00), roughly Gaussian 6–12 px at 1080p.
  - Atmospheric perspective: far layers lighter, bluer and less contrasted.

### 5.5 Lighting recipe
1. **Background gradient.** Radial: the centre or horizon is 1–2 steps lighter (`#2C275B`), the edges darkest (`#0E0D2B`). Add a gentle corner vignette.
2. **Two-tone form shading.** Characters and planets get a crisp curved terminator, not a smooth gradient: the lit half plus a shadow half 15–25% darker and violet-shifted (Egg portraits, the planets in all eras). 2026 objects add a third, highlight step and a texture.
3. **Rim light.** On dark figures against dark backgrounds, a thin warm sliver (`#EA9B4D`/`#F8AE1C`) runs along the edge facing an implied light behind. Build it as the silhouette minus a copy offset by 4–8 px.
4. **Stepped halo / posterized glow.** 4–5 concentric wobbly blob rings around an energy source. Each ring is about 1.25× larger and blends 20% further toward the background colour (Egg 3:47 cyan rings `#25E8F1` → `#18DBD5` → `#0DB8BE` → `#0193C1`). The rings breathe in scale by ±3% with phase offsets.
5. **Additive bloom** (strongest in 2026). A hot white core, a soft radial falloff over 40–120 px, 8–12 tapered rays in amber/yellow, and a ring of 4-point sparkles (Trees 4:15). Screen blend.
6. **Light cones.** Semi-transparent white trapezoids at 20–35% opacity from headlights, windows and screens. The source disc is pure white with a 15–25 px bloom.
7. **God-ray fan behind the subject.** Alternating radial wedges at +8–12% lightness rotate slowly (~2–4°/s) behind an "important" subject (PXbV 0:33, Trees 2:18).
8. **Screen glow.** A character in a dark room is lit by the device in front: the cyan/green screen colour tints the near side.

### 5.6 Depth / parallax
- **3–5 planes.** A dark, out-of-focus foreground silhouette (pines, leaves, plants), the subject plane, a midground and a far background. Sky and stars sit on a near-static plane.
- Foreground moves 1.5–2.5× the subject plane; the far background moves 0.2–0.5×.
- In the Trees opening fly-through, the global affine fit leaves about 50% of the frame change unexplained because of this layered parallax.
- Foreground framing elements sit in the corners and exit first when the camera moves (ON 0:08 leaves, Trees 0:08 dark pines sliding out as the split panel enters).

### 5.7 Composition
- **Centre-weighted hero objects:** planets, trees, molecules, cross-sections, the head in a nebula. The subject is 30–60% of frame height, with large dark negative space around it.
- **Character close-ups crop boldly.** A giant head is cut by the frame edge (Egg 0:26, PXbV 0:09) and paired with an object on the other third.
- **Two-subject comparisons:** a diagonal split screen (2026), or side-by-side circles / panels (2015).
- Margins: labels and banners sit ≥ 5% from the frame edge. 2015 banners are flush to the top-left corner.

### 5.8 Typography
Text is sparse: about 1–2 text elements on screen at a time, ≤ 3 words each, appearing on the spoken noun.

| use | look | free look-alike | size at 1080p | behaviour |
|---|---|---|---|---|
| object label (2026) | white bold rounded geometric sans, Title Case, on a **colour-coded pill** (fill = subject colour: green "Plants", orange "Bacteria", teal "Fungi", magenta "Animals") with a slightly darker bottom lip | Nunito ExtraBold / Fredoka SemiBold | cap height 28–45 px; pill height 55–100 px, horizontal padding ≈ 0.8× height | the pill grows from its centre in width (mask reveal, ~8–9 frames at 30 fps); the connector line draws 3–5 frames later |
| data numbers | very heavy rounded sans, white, inside a textured disc or capsule | Fredoka Bold / Baloo 2 ExtraBold | 120–220 px | pops with overshoot; disc sizes are proportional to the values |
| section header ribbon | bold sans, white, on a horizontal gradient ribbon fading in from transparent (left) to violet (right) | Nunito Bold | cap 45–55 px | slides in from the frame edge |
| title card (2026) | wide-tracked bold caps, stacked and centred, alternating sizes (small "HOW TO" ~50 px, large "EAT AIR" ~90–110 px) | Montserrat ExtraBold, tracking 0.12–0.2 em | 50–110 px | **one word per spoken word**, appearing ~0.2 s (6 frames) after word onset, over a radial particle tunnel |
| title card (narrative) | very wide-tracked caps, white, with a small byline below | Montserrat Bold, tracking 0.35–0.45 em | ~110 px / 30 px | slow 2–3% scale drift over 2.5 s, blue ray glow behind |
| one-off display titles (2017) | custom hand-made lettering per video (monoline with dots and swashes; condensed caps), split-colour letterforms on a dot-matrix panel | build bespoke; approximate with Comfortaa / Fredoka plus hand-drawn details | 100–200 px | scale-up 0.6 → 1 inside an expanding dark void, ~0.7 s |
| 2015 tags | uppercase geometric sans in a **chamfered banner** (rectangle with a 45° cut on the right end), dark navy or salmon fill | Montserrat SemiBold caps | cap 40–50 px | slides in from the left edge |
| 2015 numbers | white bold rounded sans on stacked teal bands, soft drop shadow | Nunito Bold | 90–130 px | bands drop in one per phrase, ~1–1.5 s apart |
| speech bubble (2015) | white rounded rectangle with a tail, dark bold sans, 1–6 words | Nunito Bold | 30–36 px | pops with overshoot |
| kinetic exclamation (2026) | white italic heavy caps, tilted ~10°, comic-style | Fredoka Bold Italic (synthetic) | 70–90 px | letter-by-letter in 2–3 frames each |

---

## 6. Characters & objects

Kurzgesagt's own birds are trademarked mascots. **Do not reproduce them** (no specific body/beak colour combinations, no black-hooded white bird, no astronaut-helmet bird). The rules below describe the construction spirit, so you can design an original species.

### 6.1 Round bird-like stand-in (construction rules)
- **Body:** a single bean, pear or teardrop blob with head and body merged. There is no neck, or the neck is implied by a shading break. Height:width ≈ 1.3–1.6. The silhouette must read as one shape in solid black.
- **Head:** the top 35–45% of the blob. In variants with a separate head, the head is ≥ 50% of the body width.
- **Eye:** one large white disc about 18–25% of head width, set high and near the front.
  - *Expression by cropping*, not by eyebrows:
    - flat top edge (lid) = bored or skeptical
    - lower-arc crop = happy (the "^" smile-eye)
    - full disc = alert or surprised
    - 2-frame squash = blink
  - Option: a small dark pupil touching the disc edge in the look direction.
- **Beak:** one rounded cone or teardrop in a warm complementary colour, protruding 20–35% of head width. It can be split into upper and lower halves for "talking" (rotate the lower half 10–20°). It doubles as the mouth.
- **Wing:** a darker leaf shape on the flank, rotated for gestures.
- **Feet:** two small warm 3-toed shapes, or none. Legs are thin tapered tubes ~4–6% of body height in width.
- **Colour:** a single saturated body hue (pick an original combination) and a belly/face patch 1–2 steps lighter. The shadow side is darker and violet-shifted, split by a soft curved terminator. Beak and feet are complementary warm.
- **No outlines, no mouth, no nose, no texture.** 2026 adds a soft highlight blob and occasional props (cap, lab coat, laptop).
- **Variants seen:** a box-shaped robot-bird (rounded square body, two antenna nubs, arc eyes); tall pear-shaped birds; tiny 2-colour birds used as a crowd (2015: oval body, merged head, dot eye, triangle beak).

### 6.2 Human figures
- **2017 style:**
  - U-shaped or rounded-rectangle face; huge flat hair mass that frames the face.
  - Almond "lens" eyes with white sclera and an iris circle sitting low; a flat heavy upper lid gives a calm, half-lidded look.
  - No mouth, no nose, occasional blush circles.
  - Skin from the palette (magenta, green, blue, yellow); simple trapezoid shoulders.
- **2019 "mannequin" style (Egg):**
  - Round head with circle ears and two white-ringed dot eyes; a pink oval specular highlight on the upper cranium.
  - A dark band where the neck meets the body (contact shadow), pear torso, tube limbs, mitten hands.
  - Monochrome magenta in three values plus an orange rim light.
  - A "cosmic being" variant is a dark silhouette filled with star specks and edged with a warm rim.
- **Portrait template for montages:**
  - A centred bust with the face split into a lit and a shadow half by a curved terminator.
  - Dot eyes, no mouth, hair as one cap shape, trapezoid shoulders.
  - Swap the hair, clothing and the historical/cultural backdrop per shot. The same template is cut 12 times in 6.5 s.
- **2026 style:**
  - Rounder, friendlier proportions; small dot eyes with highlights and a tiny mouth.
  - Head ≈ 1/4 of the height for adults; slightly larger for kids.
  - More naturalistic hair colours.

### 6.3 Acting and rig
- **Cut-out / puppet rig** (After-Effects style): rigid shapes rotating about pivots, plus shape-morph for squash and replacement for eyes and beaks. Big actions get cel-like replacement drawings, e.g. the bear rising (ON 0:12) takes 2–3 drawings in 0.25 s.
- **No line boil**, no frame-by-frame wobble.
- **Idle motion is always on:**
  - vertical bob ±1.5–3% of height, sine, 2–3 s period
  - head tilt ±3°
  - blink every 2.5–5 s (4–5 frames)
  - floating objects drift and rotate ±2–5°
- **Emotion through eye crop and posture.** Slumped body plus flat-lid eye = bored. Head jerk plus full eye = surprise, landing with a 1-frame squash.

### 6.4 Recurring props and icon style
- Planets: flat discs with 2–4 horizontal terrain bands and a half-shadow, sometimes rings.
- Galaxies: spiral dot swirls with a glowing core.
- Stars: 4-point sparkles.
- Crystals: faceted hexagons in 2–3 tones.
- Molecules: ball-and-stick with glowing spheres.
- Cells: rounded rectangles with inner blobs.
- Devices: rounded-corner phones and laptops whose screens emit colour.
- Books, papers and stacks are cartoon-simplified with 2–3 tones.
- Every icon is centre-weighted, symmetric, 2–4 flat values, no outline.

---

## 7. Camera & transitions catalogue

Frame counts are given at 24 / 30 fps. Durations were measured from the 8 fps strips and my 3–8 fps strips (±1 sample).

| # | transition | how it is built | duration | easing | frequency |
|---|---|---|---|---|---|
| T1 | **Continuous scale zoom ("powers of ten")** | One unbroken camera scale move between levels (cosmos → face, galaxy → group). New elements fade or pop in at the edges as the camera passes. | 2–8 s | `sine.inOut` drift; accelerates into the next transition | the main carrier in 2015–2019; ~30–45% of time has a drift |
| T2 | **Dive-through / zoom-into-object** | The camera accelerates into an object (eye, leaf, hourglass, window). Scale per frame grows from ~0.5% to 20% in the last 0.3–0.5 s. The object's interior is the next scene, which settles from ~1.3× to 1× with ease-out. | in: 0.8–1.5 s (19–36 / 24–45 f); settle 0.5–0.8 s | `power3.in` → `expo.out` | 2–5 per video |
| T3 | **Shape-mask iris** | A circle (with a white 6–8 px border) or a custom shape (head, hourglass) grows from a point to full frame, revealing the next scene inside. | ~0.375 s (9 / 11 f) | `power2.in` (accelerating) | 1–3 per video |
| T4 | **Silhouette reveal pull-back** | Start inside a texture (star field). A silhouette edge darkens over ~1 s, the camera pulls back to show it was the inside of a head/body, the surroundings appear, then the eyes open. | 2–2.5 s (48–60 / 60–75 f) | `sine.out` | signature, 1 per video |
| T5 | **White-out (light takeover)** | A light source (headlight, sun, orb) grows and blooms to fill the frame, holds pure white 0.2–0.5 s, then the next scene fades up from white. | ramp ~0.6–0.7 s (15 / 20 f); hold 5–12 f; fade-in 12–15 f | `power2.in` ramp, linear fade | 1–3 per video |
| T6 | **Burst flash** | A small bright point → full-frame bloom with an 8–10-ray starburst → reveal. | ~0.5–0.6 s (12–14 / 15–18 f) | `expo.out` | 1–2 per video (2026) |
| T7 | **Relight / palette swap** | The same composition stays; background and object colours switch (day → violet x-ray, black → white background) with a luminance ramp. Particles or rays appear on the new palette. | 0.25–0.4 s (6–10 / 8–12 f) | linear or `sine.inOut` | 2–6 per video |
| T8 | **Colour-wash "infection"** | A coloured region with a glowing contour line sweeps across a character or scene, recolouring it (pink → toxic green). Cards then pop in around it. | ~0.5 s (12 / 15 f) | `power1.inOut` | rare, 2026 |
| T9 | **Split-screen panel slide** | A diagonal-edged panel slides in from the frame edge; foreground silhouettes on that side exit simultaneously. | 0.35–0.45 s (9–11 / 11–14 f) | `power3.out` (strong deceleration) | comparisons |
| T10 | **2015 panel wipe** | A white info panel slides up or down over the space scene with a sawtooth or scalloped leading edge; stacked teal bands drop in one per phrase. | ~0.375 s (9 / 11 f) per panel; bands ~0.3 s each | `power2.out` | the main 2015 device, ~every 20–40 s |
| T11 | **Radial burst tunnel** | Concentric coloured rings and streaks rush outward from the centre, then the frame resolves to a new glowing scene. | ~0.5 s (12 / 15 f) | `expo.in` | climactic moments |
| T12 | **Match cut by shape** | Cut between two similar silhouettes (head → round cell, planet → eye, ring → ring). | 1 f | – | Egg, Trees |
| T13 | **Hard cut** | Three uses: (a) a threat or punchline (the creature peeks for 2 frames, then cut to a closer shot with a danger-red background); (b) an accelerating montage (shots shrink from ~1.2 s to ~0.3 s); (c) section change to a title card; (d) 2026 general pacing. | – | – | 0 (2017) … 4–8/min (2026) |
| T14 | **Particle assemble / disperse** | Particles swirl into text or objects (water drops → "PHOTO-SYNTHESIS" rotating in from edge-on), or objects explode into a flurry (papers) before cutting to a cleaned-up composition. | assemble 0.6–0.8 s; flurry 1.5 s | `power2.out` | 1–3 per video |
| T15 | **Parallax truck** | Slow lateral move across a layered landscape; foreground 2× faster, sky still. | 3–8 s at ~100–135 px/s (midground, 1080p) | `sine.inOut` | establishing shots |
| T16 | **Travel streaks** | Diagonal capsule streaks in 2–3 parallax layers suggest flight through space while the character floats. | holds 3–10 s | linear | travel beats |

**Hold-to-move ratio.** Camera moves sit *under* narration. Hard cuts and flashes land on sentence starts. A dive is timed so the swap frame coincides with the first stressed word of the new sentence.

---

## 8. Motion grammar

- **Easing families:**
  - Camera drifts: `sine.inOut` / `power1.inOut`.
  - Arrivals (panels, labels, objects sliding in): `power3.out` / `expo.out`.
  - Dives and light ramps: `power2.in`–`power3.in` (accelerate into the swap).
  - Pops (icons, sparkles, speech bubbles, cards): `back.out(1.7)` — scale 0 → 1.08–1.12 → 1.
- **Pop timing:** 8–10 frames at 30 fps (0.27–0.33 s), with a 3–4-frame settle.
- **Stagger:**
  - Cards, icons and confetti: 0.12–0.2 s apart (PXbV: ~5–6 photo cards per second).
  - Title words: one per spoken word (~0.3 s).
  - 2015 data bands: one per phrase (1–1.5 s).
  - Build order: background → hero object → secondary objects → label → connector → sparkle.
- **Label sequence (2026):**
  1. The camera pushes ~10–15% toward the part over ~0.6 s.
  2. The neon highlight outline fades on (4–6 f).
  3. The pill grows from its centre in width (8–9 f).
  4. The connector line draws (3–5 f).
  5. Hold while relevant (2–6 s).
  6. Exit by reverse scale, or carried off by the next camera move.
- **Idle / secondary motion** (keeps hold_frac at 0.12–0.18):
  - stars twinkle (opacity 0.3 ↔ 1, random phase, 1–3 s)
  - floating bob (±4–8 px, 2–4 s)
  - slow rotation of planets, crystals and ray fans (2–6°/s)
  - halo breathing (±3% scale)
  - particles drifting along curves
  - foliage sway (±2°, 3–5 s)
- **Holds:** fully static frames are rare (12–18% of 1/6-s steps, mostly ≤ 1 s); 2015 info panels hold longer (31%). A "breather" in narrative work is a still wide shot of 2–4 s with only twinkle.
- **Sync to narration:**
  - Scene objects and comparison panels arrive **0–0.5 s before** the noun that names them. In Trees, the "2,000 t" pill swaps in at ~7.3 s against "2,000 tons" at ~7.0–7.7 s, and the whale panel slides in at 8.35–8.7 s before "10 blue whales" at 8.96–9.7 s.
  - Kinetic title words appear **~0.2 s after** the word onset.
  - Rule: lead objects by 6–12 frames; land text on the word with a 4–6-frame lag.
  - Big transitions (white-out, dive, burst) peak on the first stressed syllable of a new sentence or section.

---

## 9. Sound (inferred — audio not heard)

- **Voice.** One adult male narrator; calm, articulate, neutral/mid-Atlantic English, warm with dry humour (inferred from the transcript register and general knowledge of the channel).
  - Explainers run 160–182 WPM editorial, with a pause > 0.75 s every 3.4–5.7 s (10.6–17.7/min), roughly one per sentence. Phrases have a median of 3–4 words between micro-pauses (> 0.45 s).
  - The narrative short is slower: 118 WPM with 29.5 pauses per minute, many 1.2–2 s pauses (4.4/min) and 2-word phrases (dialogue timing).
  - Kokoro TTS: use a calm male voice (e.g. `bm_george` or `am_michael`) at speed 1.0–1.08 to reach ~165 WPM. Insert 0.35–0.6 s silences at sentence ends, 0.8–1.2 s at section hand-overs, and 1.5–2 s before the closing line.
- **Music (inferred).**
  - A continuous ambient-orchestral / synth bed: pads, plucks or mallets, and swelling strings for the uplift.
  - Silence is near zero in explainers (Trees 0 s, Fermi 1.6 s, ON 4.4 s); the bed runs under everything.
  - A 4–6 s music-only sting at the title/logo (Fermi 0:35–0:41).
  - Swells into the late crescendo, with a soft resolve under the final line.
  - The Egg leaves 13.6 s of near-silence for dramatic beats.
  - Tempo guess: 70–100 BPM, felt rather than driving.
- **SFX (inferred, dense).**
  - Soft pops or blips for every label and icon pop.
  - Whooshes for dives, slides and panel wipes; shimmer or chime for sparkles and glows.
  - A low boom or riser for white-outs and bursts; small Foley-like cartoon sounds for character actions.
  - Expect 10–25 SFX per minute, mixed 12–18 dB under the VO.
- **Mix.** −14 to −16 LUFS integrated (measured −13.3 … −16.1). The music ducks ~6–9 dB under the voice; SFX sit just above the music.

---

## 10. Do / Don't

**Do**
1. Use deep indigo-violet backgrounds (`#0E0D2B`–`#24187E`) with a lighter radial centre; never pure black.
2. Keep ~75% of saturated colour in blue → violet → magenta and add one warm amber/orange accent.
3. Build every object from rounded, outline-free fills with 2–4 values and hue-shifted shadows.
4. Light scenes from small sources: rim slivers, stepped halos, bloom cores, light cones, sparkles.
5. Carry the story with continuous camera moves (scale zooms, dives, mask reveals); cut only for punchlines, montages and section changes.
6. Give every frame idle motion (twinkle, bob, drift) so that < 20% of time is static.
7. Change something on screen every 2–3 s in explainers, timed to the noun being spoken.
8. Label with ≤ 3-word colour-coded pills plus a connector line, and pair big numbers with human-scale comparisons.
9. Use a palette swap (day → violet x-ray) to signal "now we look inside".
10. Put the densest montage or burst at ~75–85% of runtime, then end slow and wide under a humanist closing line.
11. Use parallax foreground silhouettes in the corners for depth, exiting first when the camera moves.
12. Design original round stand-in creatures with one big white eye, a complementary-colour beak or feature, and no mouth.

**Don't**
1. Don't copy the channel's bird mascots, logo, end-card layout, "Human Era" branding or exact characters.
2. Don't use outlines/strokes around characters, or a black-line cartoon look.
3. Don't use grey, desaturated or photographic textures (the 2026 painterly texture is subtle and tinted).
4. Don't put pure-black shadows or neutral-grey shading on coloured objects.
5. Don't fill the screen with text: no bullet lists, no paragraphs, no lower-third captions of the narration.
6. Don't cut on every sentence (> 8 cuts/min breaks the "flowing world" feel).
7. Don't use bouncy elastic easing on camera moves; reserve overshoot for small pops.
8. Don't scatter random rainbow colours; each scene has one dominant hue family plus one accent.
9. Don't leave static slides longer than ~2 s without twinkle or drift.
10. Don't let narration race without sentence pauses; keep ~1 pause every 4–5 s.
11. Don't use realistic human proportions, faces with full features, or naturalistic skin tones (2017–2019 look).
12. Don't use hard-edged geometric "corporate" icons with sharp corners.

---

## 11. Replication recipe (code: SVG/HTML + GSAP, rendered frame by frame)

### 11.1 Layer stack (back → front, inside a 1920×1080 SVG)
```
<svg viewBox="0 0 1920 1080">
  <defs> gradients, masks, filters </defs>
  <g id="camera">                         <!-- global zoom/pan rig -->
    <g class="plane" data-depth="0.05"> L0 background radial gradient + vignette </g>
    <g class="plane" data-depth="0.15"> L1 star field (3 sizes) + cosmic confetti </g>
    <g class="plane" data-depth="0.35"> L2 far silhouettes / nebula blobs (low contrast, blurred in 2026) </g>
    <g class="plane" data-depth="0.7">  L3 midground scenery </g>
    <g class="plane" data-depth="1.0">  L4 subject (character/object) + shading layers + rim </g>
    <g class="plane" data-depth="1.0">  L5 glow/bloom (screen blend) </g>
    <g class="plane" data-depth="1.8">  L6 foreground silhouettes (dark, blurred) </g>
    <g class="plane" data-depth="1.2">  L7 particles / dust </g>
  </g>
  <g id="hud"> L8 labels, pills, title text (screen-space or attached to anchors) </g>
  <rect L9 grain overlay (2026 only) /> <rect L10 vignette />
</svg>
```

### 11.2 Recipes
- **Background:** `radialGradient` (cx 50%, cy 55%, r 75%) stops `#2C275B` 0% → `#141040` 55% → `#0E0D2B` 100%. Vignette: radial transparent → `#000` at 35% opacity in the corners.
- **Star field:** 200–300 circles, r = 1–1.5 px (70%), 2–3 px (25%), plus 5–10 four-point sparkle paths at 10–18 px with `feGaussianBlur stdDeviation=3` glow behind. Opacity 0.4–1. Twinkle with `gsap.to(star, {opacity: 0.3, repeat: -1, yoyo: true, duration: random(1, 3), delay: random(0, 3)})`.
- **Two-tone shading:** base path filled with the body colour, plus a shadow path clipped to the body (`clip-path`) filled with a darker violet-shifted tone. Its terminator is a big ellipse offset 30–40% of the body width toward the light. Add a highlight blob (lighter, toward yellow/pink) in 2026.
- **Rim light:** `<mask>` = white body path minus a black copy translated (−6, −6) toward the light. Fill a rect with `#F8AE1C` through that mask. Optional `feGaussianBlur 1`.
- **Stepped halo:** 5 copies of a wobbly blob path with `scale(1, 1.25, 1.56, 1.95, 2.44)`, fills interpolated from `#BBF4F8` (inner) → `#0193C1` (outer). Animate `scale` ±3% with `yoyo`, staggered by 0.3 s.
- **Bloom:** duplicate the bright shapes into a group with `filter: feGaussianBlur(stdDeviation 18–40)` and `mix-blend-mode: screen`, opacity 0.6–0.9. Rays are 10 tapered triangles rotating at 3°/s.
- **God-ray fan:** 12–16 wedges alternating white at 8–12% opacity, rotating slowly behind the subject.
- **Neon highlight outline:** a `rect`/`path` with stroke `#FFFFFF` 6 px, round joins, plus a copy with stroke 20 px, blur 8, opacity 0.6.
- **Pill label:** `rect rx = h/2` filled with the subject colour; a second rect offset y = +4 px, 18% darker, behind it (the lip); white text in Nunito ExtraBold. Reveal: `clipPath` rect width 0 → 100% from the centre, `power3.out`, 0.28 s. Then the connector `path` with `stroke-dashoffset` animated to 0 over 0.12 s; the ring dot pops with `back.out`.
- **2026 grain:** `feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"` → `feColorMatrix` to grey → a full-frame rect at opacity 0.04, `mix-blend-mode: multiply`. Painterly fills: `pattern` tiles of soft stipple dots and short strokes in the highlight colour at 15–30% opacity, clipped into foliage clumps.
- **Depth of field (2026):** `feGaussianBlur stdDeviation 6–10` on L2 and L6 in close-ups.
- **Tone-on-tone pattern (2017):** a swirl or wave `pattern` in a colour 6–10% lighter than its field.

### 11.3 Camera rig
```js
const cam = { x: 960, y: 540, z: 1 };            // world point at screen centre, zoom
function applyCamera() {
  document.querySelectorAll('.plane').forEach(p => {
    const d = +p.dataset.depth;
    const z = 1 + (cam.z - 1) * d;               // depth-scaled zoom = parallax on dolly
    const ox = (cam.x - 960) * d, oy = (cam.y - 540) * d;
    p.setAttribute('transform', `translate(960 540) scale(${z}) translate(${-960 - ox} ${-540 - oy})`);
  });
}
// drift:   tl.to(cam, {z: 1.12, x: '+=40', duration: 6, ease: 'sine.inOut', onUpdate: applyCamera})
// dive:    tl.to(cam, {z: 9, x: target.x, y: target.y, duration: 1.2, ease: 'power3.in', onUpdate: applyCamera})
//          .call(swapScene)                       // swap exactly at the peak frame
//          .fromTo(cam, {z: 1.35}, {z: 1, duration: 0.7, ease: 'expo.out', onUpdate: applyCamera})
// truck:   tl.to(cam, {x: '+=600', duration: 5, ease: 'sine.inOut', onUpdate: applyCamera})
```

### 11.4 Character rig
- Build the SVG as nested groups with explicit `transform-origin`: `body` (pivot at the feet) > `head` (pivot at the neck line) > `eye` (with a `lid` clip rect), `beakTop`, `beakBottom` (pivot at the hinge), `wingL/R` (pivot at the shoulder), `footL/R`.
- Idle loops with deliberately incommensurate periods:
  - `body y ±1.5% height, 2.4 s, sine.inOut, yoyo`
  - `head rotate ±3°, 3.1 s`
  - `wing rotate ±4°, 2.7 s`
- Blink: every `random(2.5, 5)` s, lid clip height 0 → 100% → 0 over 2 + 2 frames.
- Talk: `beakBottom rotate 0 ↔ 14°`, toggled on syllable timings from the TTS word boundaries, 3–4 frames per open.
- Expressions: swap the eye-crop shapes (flat lid / happy arc / full disc). Surprise = head `y −8%` in 3 f with `power2.out`, then a 1-frame squash (`scaleY 0.92`) on landing.

### 11.5 Minimal scene skeleton (pseudo-code)
```js
// one beat = one narration sentence; durations come from Kokoro word timestamps
const tl = gsap.timeline({ paused: true });
const S = words;                                        // [{word, start, end}]
const at = w => S.find(x => x.word === w).start;

tl.add(scene('space', { bg: 'night', stars: 260 }), 0)
  .to(cam, { z: 0.55, duration: 7, ease: 'sine.inOut', onUpdate: applyCamera }, 0)   // T1 pull-back
  .from('#planet', { scale: 0, duration: 0.3, ease: 'back.out(1.7)' }, at('planet') - 0.3)
  .add(pill('#planet', 'Home Planet', '#2C9ADA'), at('planet') - 0.1)
  .from('.moon', { scale: 0, stagger: 0.15, duration: 0.28, ease: 'back.out(1.7)' }, at('moons') - 0.4)
  .to(cam, { z: 10, x: eye.x, y: eye.y, duration: 1.2, ease: 'power3.in', onUpdate: applyCamera }, at('inside') - 1.2) // T2
  .call(() => swapScene('cell-interior'), null, at('inside'))
  .fromTo(cam, { z: 1.35 }, { z: 1, duration: 0.7, ease: 'expo.out', onUpdate: applyCamera }, at('inside'))
  .add(relight('day', 'xray', 0.35), at('glows'));      // T7 palette swap

for (let f = 0; f < totalFrames; f++) { tl.seek(f / 30); applyCamera(); await capture(f); }  // Puppeteer → PNG → ffmpeg (30 fps, or 25 for the classic look)
```

### 11.6 The five shots that define the style (and how to build each)
1. **Cosmic pull-back with glowing confetti.** A tiny planet in an indigo star field; the camera pulls back continuously (z 1 → 0.2 over 6–8 s, `sine.inOut`) while orbit lines, a sun with a stepped halo, then galaxies pop in at the edges. One pill label per level. Build: T1 + star field + stepped halos + parallax depths 0.05–1.0.
2. **Cosmos inside a silhouette.** An original character silhouette filled (via mask) with a star field and galaxies, set against a warm amber patterned world (swirl pattern) with corner foliage silhouettes. Open on the star field alone, darken the silhouette edge, pull back (T4), and open the eyes on the stressed word. Maximises the warm/cool contrast that drives the 75–104 colourfulness.
3. **Cutaway diagram with neon highlight.** An isometric cross-section (stacked rounded-cell layers in green/teal/violet) on a violet field. The camera pushes 12%, a white neon outline frames one layer, the pill label grows from its centre and the connector draws. A day → x-ray palette swap (T7) introduces it.
4. **Round creature lit by a screen.** An original bird-like creature in a dark room (`#0E1048`), body in a saturated hue and a warm beak, lit by the cyan glow of a device (screen-glow tint on the near side). Big close-up crop, head cut by the frame. A kinetic exclamation word pops; idle bob and blink run throughout.
5. **Comparison and data moment.** Either a diagonal split panel sliding in with `power3.out` (scene A vs a mass-equivalent scene B, each with a pill), or a data card: big textured discs sized to their values with heavy rounded numbers and colour-coded pills, on an amber or indigo field. Pops staggered at 0.15 s.

Bonus signature: **light takeover** (T5/T6). A headlight or orb blooms to white over 0.65 s, holds 8 frames, and the next scene fades in from white; or a burst flash with 10 rays and sparkle stars.

---

## 12. Per-video notes

**sNhhvQGsMEc – The Fermi Paradox (2015)**
- The early "infographic" era. Navy space alternates with off-white info panels (4.4 dark↔bright flips per minute). Hold share 31% and colourfulness only 51.8: half the vividness of the later videos.
- One hard cut in 380 s. Transitions are panel slides with sawtooth or scalloped leading edges (~0.375 s), stacked number bands, multi-panel grids with rounded grey gutters, and scale morphs (the universe circle shrinking from the opening shot).
- Chamfered banner tags ("THE UNIVERSE", "KARDASHEV SCALE"), tiny flat birds as a Greek chorus with speech bubbles, and simple 2-colour aliens with large single eyes.
- The title drops at 57% when the paradox is named. 2015 end card: a Patreon grid of supporter birds, a subscribe tile and an external article link.

**MBRqu0YOH14 – Optimistic Nihilism (2017)**
- The peak of the colour era: colourfulness 103.9 (highest of all ~55 sources), saturation 0.84, violet 39% plus magenta 17% of saturated pixels.
- **Zero hard cuts in the 350 s editorial.** Everything is continuous zooms, silhouette reveals, shape windows (an hourglass/bottle-shaped vessel with a thick gradient stroke) and the dive through the hourglass (~0.5 s).
- Large tone-on-tone swirl patterns, almond-eyed humans with palette skin colours, the "5,200 WEEKS" dot-matrix typographic moment, and a custom quirky title lettering at 55%.
- The current download contains a **later-inserted ~83 s shop advert (5:50–7:13, "Advertisement" watermark)** made in the 2020s house style (bright orange workshop interiors, birds), plus a modern end card. Both distort cuts/min, WPM and motion deciles 8–10.

**h6fcK_fRYaI – The Egg (2019, narrative adaptation)**
- 46% dark frames; most of the film is two figures in a black void lit only by rim light and halos.
- Colourful "life" vignettes and two montages: the 12-shot portrait template montage at 5:52–5:59 with shot length accelerating from ~1.2 s to 0.3 s, and the 2:50 life montage. These produce most of the 36 cuts.
- Transitions:
  - White-out from headlights at 0:04.5–0:05.4.
  - Background black → white recolour at 0:55.8.
  - Radial ring burst into a cyan stepped-halo nebula at 3:44.5–3:45.4.
  - Match cuts from head to cell.
- Slow dialogue delivery (118 WPM, 29.5 pauses per minute, 13.6 s near-silence). The title card comes at the end (93%). Captions are auto-generated (no punctuation).

**pHJIhxZEoxg – Why Are There No Holes Around Trees? (2026)**
- The modern explainer template:
  - 44 s hook ending in an explicit question.
  - Word-by-word title card on a radial particle tunnel.
  - Two halves (crown, then roots) joined by a "half of the story" hand-over; sponsor bridge by a related fact.
- Painterly rendering and DOF blur: flat share 0.37, the lowest. The opening is a forest fly-through dolly with strong parallax accelerating into a sun flash (0:00–0:04).
- Colour-coded pill labels, isometric cross-sections with neon highlight outlines, day ↔ violet x-ray palette swaps (2:15.5, ~0.35 s), and particle-to-text assembly ("PHOTO-SYNTHESIS", 4:00).
- An anthropomorphic tree with a carved face is a rare "object character".
- ~13% of runtime is a sponsor block with white app screen-recordings.

**PXbVn-f_wuM – You Will Only Like Half of This Video (2026-10)**
- A channel/shop fundraising message, not a science explainer. 0:00–1:47 is animated (still a useful 2026 reference), and 1:47–3:19 is **live-action product B-roll** (calendar, artbook, studio). That explains animated_frac 0.54 and 12 cuts/min.
- The animated half has the highest motion and lowest hold of the set (hold 4.5%, motion 10.3): a pink bird in an armchair lit by a laptop, a green "infection" colour wash with photo cards popping at 0.15–0.2 s, a glowing robot-bird orb with bloom rays, and a data capsule ("> 40 BILLION") with slime drips.
- The end card uses a crossed-out word gag over a navy field with a glowing globe and product button.

---

## 13. Source-list issues

1. **"Colourfulness 75–104, far above every other source" is only partly true.**
   - Fermi (2015) measures **51.8**, below TED-Ed EMbZ72cCAzI (61.7) and Cleo Abram eNkxTjirY-Q (61.8).
   - The School of Life k-J9BVBjK3o (88.5) beats Trees (84.3).
   - The Infographics Show sits at 70.9–79.8.
   - Kurzgesagt's 2017+ videos are the most vivid group (ON 103.9 is the maximum), but the 2015 era is not.
2. **animated_frac understates Kurzgesagt.**
   - The flat-shading detector misreads gradient- and texture-heavy frames: Trees (100% animated editorial) scores 0.61, ON 0.78.
   - Sponsor screen recordings and live action pull the numbers further down.
   - Don't use animated_frac to judge this channel.
3. **MBRqu0YOH14 is not the 2017 cut.** It contains a later-inserted ~83 s shop advertisement and a modern end card. cuts/min (0.81), overall WPM (145 vs 182 editorial) and motion deciles 8–10 reflect the ad, not the film.
4. **PXbVn-f_wuM is self-promotion.** It is a shop/fundraising pitch with ~50% live-action B-roll, not an explainer. Its cuts/min (12.09), animated_frac and palette entries `#4E7B56`/`#9F8DAF` come largely from live-action. Only 0:00–1:47 is valid style reference. It was "listed: false" (added by the curator as a recent upload).
5. **h6fcK_fRYaI is a narrative adaptation** of a third-party short story, not an explainer. Its 111.8 WPM, 4.44 cuts/min (montage-driven) and title-at-end structure should not set targets for explainer builds.
6. **pHJIhxZEoxg** includes an ~85 s sponsor block (9:38–11:05) of white app screenshots that adds cuts, brightness and white palette share.
7. **The Egg and Fermi captions are auto-generated** (no punctuation, some proper names mangled), so sentence-length stats were computed only for ON, Trees and PXbV.
8. **The fps of the downloads differs** (Fermi/Egg 25 fps, ON/Trees/PXbV 30 fps). Frame counts in section 7 are given for both 24 and 30 fps.
