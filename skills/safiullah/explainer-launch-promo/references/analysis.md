# Launch / hype promo — music-led kinetic type, dark-mode UI, continuous morph camera

Analysed 2026-10-27. Source list: whatastory.agency "18 Best Animated Explainer Video Examples to Watch in 2026"
(`raw/whatastory.txt`, entries #6, #15, #16). Inputs per video: `frames/<id>/` (metrics, timeline, opening, strips,
shots, ending, animated) plus my own frame-accurate contact sheets cut from the 1280×720 MP4s with OpenCV
(every 1–4 frames around each transition, at native 30 fps). Frame counts below are measured at 30 fps; the
"@24" figure is the same duration at 24 fps. Sound is never heard: anything about audio is *inferred* from
transcripts, loudness and silence metrics.

---

## 1. Identity

A 60–135 s launch film in which **every narrated phrase becomes a typographic or UI event and nothing ever stops
moving** (hold_frac 3–5 %, the lowest of the article). Three sub-flavours share one grammar:

- **Timeliner (Flash Motion):** a "dark-mode glow" look. Near-black violet space, eclipse-like rim-light arcs,
  magenta bloom, glossy 3D icons and an oversized violet cursor. Word-by-word kinetic type is hard-cut on the
  stressed syllable ("Exciting", "BOOM"). Real dark product UI is tilted in 3D perspective.
- **KGeN (What a Story):** a "soft-shaded HUD" look. A muted sage/teal world with one acid-lime accent, condensed
  extruded headlines framed by HUD corner brackets, and one glowing lime orb that travels through every scene.
  Shapes morph into each other inside one continuous camera move (2 hard cuts in 90 s).
- **Kartel (What a Story):** a "black glass + emerald neon" look. Charcoal concentric-ring backgrounds, a green
  spotlight, dark UI windows with thick neon-green bevels, photo-card walls and carousels, random-decode and
  typewriter text. Zero hard cuts, yet the highest motion in the whole article (17.3).

The recognisable signature: **a typographic hook in the first 5 s, chaos then reveal at 25–35 %, dark UI with
neon edges, a callback joke or pun on the end card, and a music bed that never drops out.**

## 2. Sources analysed

| id | title (uploader) | dur (s) | fps | cuts/min | median shot (s) | motion mean / p90 | hold | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|
| 5bP-hRzKoK4 | Hype Promo SaaS Motion Graphics Video, Timeliner (Flash Motion, 2025) | 133.6 | 30 | 7.63 | 4.58 | 11.71 / 26.42 | 0.036 | 47.5 | 134.3 | −17.3 |
| pUsreu5dTJ0 | INSANE Motion Graphics Explainer Video / 2D Animation for Gaming Technology, KGeN (What a Story, 2024) | 90.1 | 30 | 1.33 | 14.82 | 7.58 / 16.67 | 0.031 | 31.2 | 137.9 | −17.6 |
| x_tCThgCepU | Best Product Launch Video for AI Marketplace, Kartel (What a Story, 2025) | 60.1 | 30 | 0.00 | 60.09 | 17.29 / 37.18 | 0.053 | 39.5 | 101.8 | −13.0 |

Other measured facts:

| | Timeliner | KGeN | Kartel |
|---|---|---|---|
| hard cuts / first cut | 17 / 6.3 s | 2 / 12.3 s | 0 / none |
| animated_frac | 0.843 (the rest is stock footage inside a video-review UI) | 1.0 | 0.70 (the rest is photo/AI-image cards) |
| brightness / dark-frame share | 0.42 / 0.37 | 0.48 / 0.09 | 0.20 / 0.87 |
| silence | 2.7 s | 1.1 s | 0 s |
| motion deciles | 15.3 16.2 16.3 9.7 13.3 13.0 13.1 8.3 8.7 3.3 | 8.0 8.5 9.8 8.8 12.8 6.1 4.5 7.0 7.3 2.9 | 39.5 26.3 5.4 10.0 17.5 20.5 14.1 19.6 19.2 0.9 |
| caption words | 299 | 207 | 102 |

## 3. Measured pacing

| quantity | target range | what it means in practice |
|---|---|---|
| motion mean | 8–17 (p90 17–37) | a frantic baseline compared with an editorial explainer (about 3–6). Always something translating, scaling or decoding. |
| hold_frac | ≤ 5 % | no true holds. Every "held" title keeps drifting (a scale change of −10…−15 % or a pan of 3–5 % W over the hold). Backgrounds keep moving: particles, speed lines, a breathing glow, a rotating carousel. |
| hard cuts | 0–8 /min, used either everywhere on the beat (Timeliner) or almost never (KGeN, Kartel) | choose one regime per film. The "no-cut" regime still feels fast because each beat transitions by morph, zoom-through, decode or light sweep in 8–20 frames. |
| text-card hold (fully legible) | 0.6–1.2 s; 1.6–2.0 s for a whole beat incl. in/out | Timeliner "Exciting" 0.93 s, "BOOM" 1.1 s; KGeN headline 1.0 s legible inside a 1.9 s beat; Kartel lines 0.4–1.0 s |
| new visual idea | every 2–3 s (Timeliner) to every 4–6 s (KGeN) | one VO clause = one picture |
| motion curve | first decile 1.0–2.3× the mean; last decile 0.05–0.4× the mean | open hot (chaos montage, card wall); finish on a calm end card. The quietest stretch before the end card is the product/belief section. |
| speech | 130–140 WPM when VO-led; about 100 WPM when music-led (Kartel), with a 4–8 s VO gap carried by music | the music never stops (silence ≤ 2.7 s) |
| loudness | −13 to −17.6 LUFS | louder than editorial explainers; Kartel is mastered like an ad (−13) |
| palette brightness | dark-first: 9–87 % dark frames | glow needs a dark ground. Light frames are used as flashes (white light sweeps, the bright envelope). |

## 4. Script & narrative structure

**Beat map (percent of runtime; Timeliner timestamps in brackets from its chapters):**

| % | beat | what happens | examples |
|---|---|---|---|
| 0–8 | **Hook** | a provocative claim, an ironic setup or a price paradox, delivered as kinetic type word by word | Timeliner: "So, you've got a new project. Exciting, right?" then "BOOM" (0–9 s). KGeN: a dare aimed at big tech (0–4 s), then a stat in brackets "30% LEANER" (6–10 s). Kartel: "A Super Bowl ad for $5,000 in 5 days." (0–4 s) |
| 8–33 | **Chaos / problem montage** (Timeliner 0–44 s) or **"how?" pivot** | notification floods, multiplying files, tool lists read as staccato nouns, the client's voice note; or the question "so how are we doing this?" | Timeliner lists seven tool categories in 5 s, then "Too many tools, zero efficiency." |
| 25–35 | **Brand reveal** | a logo sting on a dark field with a pill-highlighted promise ("Everything you need") | Timeliner "Meet timeliner.io" at 44.6 s (33 %); KGeN "We are KGeN" at 25.9 s (29 %); Kartel puts the brand at 4–10 s (7–16 %) because the film is only 60 s long |
| 35–80 | **Feature / mechanism run** | one feature per 5–10 s on tilted UI or as a system diagram; jokes as subordinate clauses ("if you like pretending you're in control") | Timeliner chapters at 60 s (feedback) and 83 s (finalising); KGeN engine and five dimensions (36–56 s); Kartel three-step process (11–28 s), marketplace (28–35 s), proof claims "10 times the speed" (36–46 s) |
| 80–90 | **Aphorism / belief / recap** | a two-part antithesis on kinetic type | Timeliner "editing isn't the hard part. Managing the mess is." (2:00–2:03); KGeN "do you see it?" recap (56 s) and belief line (75 s); Kartel "Your marketing will never be the same." (46–51 s) |
| 88–100 | **End card** | logo build, URL, CTA pill/button, plus a **callback to the hook** or a pun | Timeliner: "Try it free today" plus the opening voice-note gag; KGeN: a pun sign-off ("we're game") then a 3 s logo; Kartel: wordmark, URL, phone number and a "To Get Started" button (52–60 s) |

**Hook pattern (first 15 s):** 2nd-person address or an adversary ("big tech"), a number in the first 10 s
(inbox counter 59+ → 96+; "30%"; "$5,000 in 5 days"), at least 3 typographic slams or decodes, and the music
already running at 0 s (KGeN captions "[Music]" at 0.4 s). Timeliner's slams in the first 10 s ("Exciting"
4.57 s, "Right?" 5.5 s, "BOOM" 8.17 s) each sit inside the caption line that speaks that word. Exact syllable sync
is *inferred*, because captions are phrase-timed.

**Hand-overs between sections:** never a dip to a neutral slate. Timeliner uses a hard cut to a kinetic-type card
(white text on purple), so the type card is the section divider. KGeN zooms through an object (the node becomes
the screen colour, then the next object grows out of a dot). Kartel dissolves text into a line that becomes the
next object (letters → sine ribbon → AI waveform orb → gooey liquid → UI card edge).

**Ending:** all three end with a 6–12 s lockup on the calmest background of the film. Motion in the last decile is
0.9–3.3. A CTA is always visible for ≥ 4 s.

## 5. Visual system

### Palettes (hex from `metrics.json` k-means unless marked *eyeballed*)

| role | Timeliner (dark glow) | KGeN (soft HUD) | Kartel (black glass + neon) |
|---|---|---|---|
| background | #0a080d (24 %), #1c1223 (19 %) | #416862 (24 %) radial to #325554 / #1c363a at the edges | #0d0e0e (30 %), #161c19 (31 %), #010202 |
| primary | #612896 violet | #81ae9c light sage | #2c482d deep green |
| secondary | #361059 deep purple | #5e8a77 mid sage, #264547 deep teal | #429460 emerald (glows) |
| accent | #b253e1 orchid; hot spot about #e15cff *eyeballed* | #86f11b acid lime (only 1.2 % of pixels) | neon rim about #3ddc84 *eyeballed*; tag pills the same |
| highlight / glow | white bloom #f4edf4 | pale mint #aececc | mint #a8ccac |
| text | #f4edf4 white-lilac; pill text #2a1238 *eyeballed* | #dff2ee pale mint *eyeballed*, extruded | #ffffff + emerald accent words |
| UI chrome | #0f0f12 panels, #45433c / #95958a greys | — | #111312 panels *eyeballed* |
| photo content | stock footage inside UI | — | warm AI-image cards (#926444 skin tones) |

Rules: **one hue family plus neutrals**. The accent covers ≤ 2 % of pixels (KGeN lime) up to about 10 % (Timeliner
orchid). Colour variety is imported only through embedded photos/footage (Kartel's "vibrant" look is the photo
mosaics; the graphics themselves are monochrome green).

### Shape language

- **Timeliner:** big soft circles and arcs (the eclipse horizon: two concentric glowing arcs top and bottom,
  radius about 1.1 × frame width), rounded rectangles (radius about 22 % of height for pills, 24–32 px for device
  frames), glossy extruded 3D icons (file icons, envelope, app bubbles, cursor). No outlines; edges come from
  light.
- **KGeN:** octagons and capsules (HUD frames, chamfered pills), circles (nodes, dials with knurled edges, orbs),
  orthogonal connector lines with rounded corners, organic blob silhouettes. Objects are 2.5D: a soft inner
  gradient, a drop shadow offset about 12 px down at 30 % opacity with a 24 px blur, and a specular dot on spheres.
- **Kartel:** rectangles in perspective (UI windows, photo cards), circles (avatars, orb, concentric rings),
  liquid metaballs. Every card carries a neon-green bevel or rim.

### Line work

Mostly **no stroke**. Exceptions: HUD lines and brackets (KGeN): 4 px at 1080p for brackets, 1.5–2 px for grid and
connector lines, round caps; neon rims (Kartel): 2 px on photo cards, 18–24 px glossy bevel on hero UI windows;
the eclipse arcs (Timeliner): a 3–4 px bright core plus a 40–80 px bloom.

### Texture, lighting, depth

- **Glow is the lighting model.** Bloom = a duplicate layer blurred 20–60 px and screened at 50–80 %. Hot spots
  are placed off-centre (top-left magenta in Timeliner; a green spotlight from the top on Kartel's end card).
- **Light sweeps:** a white or neon diagonal gradient band crosses a panel in 4–8 frames (Timeliner 0:36.9;
  Kartel 51.6–52.0 s).
- **Chromatic aberration** on impact words: R/B offset ±6–10 px decaying to ±2 px in 6 frames.
- **Particles:** a sparse starfield (1–3 px dots, 30–60 per frame) drifts constantly in Timeliner. KGeN has
  floating lime ring-dots (8–14 px) at the frame edges.
- **Grain:** none visible at 720p. Optionally add 2–4 % noise to hide banding in big gradients.
- **Depth:** real CSS-style 3D perspective. UI at rotateY ±20–35° and rotateX 8–20°. Kartel's photo carousel sits
  on a cylinder, and its opening card wall sits on a curved surface that the camera dollies through. Out-of-focus
  giant ghost letters (blurred 20–30 px, green at about 20 %) sit behind Kartel's first titles.
- **Vignette:** strong. Corners are 40–60 % darker than the centre in all three.

### Composition

Centred, symmetric framing for type (titles are centred on the vertical axis 80 % of the time). UI panels fill
70–95 % of the width, entering tilted and settling flat. Margins of about 5 % W. Negative space is dark and lit by
a radial glow behind the subject. Timeliner frames centre text inside a large thin glowing ring (diameter about
1150 px at 1080p).

### Typography (sizes at 1080p)

| use | Timeliner | KGeN | Kartel |
|---|---|---|---|
| free look-alike | Inter (500/600) | Anton (or Oswald 700) | Montserrat 800 |
| slam word | cap height 110–180 px at impact, settling to about 120 px; "BOOM" about 270 px → 180 px | — | — |
| headline line | 60–80 px cap height; key word in a gradient pill (pill height about 170 px, text 75 px) | 120–130 px, all caps, condensed, pale-mint face with a dark extrude/drop shadow (offset 0 10 px, blur 24 px, rgba(10,30,30,.45)) | 40–50 px cap height, all caps, tracking +2 %, white + green accent word |
| labels | 18–22 px UI text | 18–22 px tracked caps ("OWN / FLEX / MONETIZE") | 16–22 px UI text; pill tags 22 px |
| end card | wordmark about 60 px; CTA pill "free" | logo only | wordmark about 75 px; URL / phone 26 px; outlined button with a glow |

How much text: Timeliner puts a large share of the VO on screen as type (about 30 % of the timeline frames are
type cards, plus the dim voice-note captions). KGeN shows only stats and key nouns (about 10 words in 90 s, plus labels). Kartel shows one sentence per
beat (13 lines in 60 s). The typed phone number and URL repeat on the end card.

## 6. Characters & objects

**Characters are replaced by props, UI and photo avatars.** None of the three has a rigged illustrated human.

- KGeN uses **abstract mascots**: dark-teal blob silhouettes with lime rim strokes, two white slit eyes and no
  limbs. They bulge, merge and pop like soft bodies (path morphs, about 12 frames). Gamer silhouettes appear only
  as images masked inside letters ("POG" letters fill with figures rising from below, 24 frames).
- **Hero token:** KGeN's lime glowing orb (a sphere with a specular highlight and a 30–60 px glow) appears in
  about 15 scenes: slider knob, ping-pong ball, node, atom nucleus, heartbeat blip. It leads the camera from scene
  to scene. **Build one recurring token for continuity.**
- **Glossy cursor (Timeliner):** an oversized violet 3D cursor (about 115 px at 1080p, extruded, with a specular
  highlight) acts as the "user". It travels in arcs between targets over 8–12 frames (power2.inOut) and clicks
  with a 3–4 frame squash (scale 0.85) plus a ripple.
- **Photo avatars (Kartel):** circular crops (180–220 px) with green rims, arranged in floating clusters; they
  bob 6–10 px in 2–3 s sine loops.
- **Recurring props:** notification banners, voice-note chips with live waveforms, file icons multiplying into a
  grid ("Final_final" gag), envelope with a rolling counter, spreadsheet in perspective, network graphs of user
  nodes, dials and sliders, an AI orb with a sine-line hologram inside, photo cards with @handle and category
  tags.
- **Icon style:** filled glossy 3D for "objects" (Timeliner); flat soft-shaded with an inner gradient and a drop
  shadow (KGeN); real UI screenshots with photos (Kartel). Real third-party brand icons appear in Timeliner
  (mail/chat apps). Replace them with generic glyphs in original work.

## 7. Camera & transitions catalogue

Durations are measured on frame sheets at 30 fps.

| # | transition | frame-by-frame build | duration @30 (@24) | easing | frequency |
|---|---|---|---|---|---|
| T1 | **Slam-in word on a cut** (Timeliner "Exciting", 4.57 s) | hard cut on the stressed syllable to the word at about 400 % scale with heavy motion blur; down to 100 % by frame 4; then continuous drift (scale −15 %, x +5 % W) over the hold; radial speed lines zoom behind; a sparkle glyph grows on the first letter from frame 10; exit = hard cut | in 4 f (3); hold 27 f (22) | expo.out in, linear drift | about 8× in Timeliner (So / Exciting / Right? / BOOM / Too many tools / Smarter / Cleaner / Managing…) |
| T2 | **RGB-split impact** ("BOOM", 8.17 s) | hard cut to chroma-split, bloom-white text with a vertical light beam behind; R/B offset ±8 px decays to ±2 px by frame 6; text rises 8 % H and shrinks 25 % over the hold | 32 f (26) | expo.out (split), linear drift | 1–2× per film, on the single biggest word |
| T3 | **Pill-highlight word swap** (47.0–49.0 s) | two-word line; word 1 in a gradient pill (violet → lilac), word 2 plain lilac; word 2 slides in from +40 px with a fade in 2 f; the next phrase replaces the line with a 3 f blur cross-fade; its 2nd word follows 8 f later; the group drifts; exit = 1–2 f blur-out, then a hard cut | in 2 f, word stagger 8 f, hold 18–35 f | power3.out | about 10× (the house style for slogans) |
| T4 | **3D UI tilt-in / settle** | a dark UI panel enters at rotateY −30°, rotateX 15°, translateY +20 % and flattens to 0° while scaling from 115 % to 100 %; sub-panels populate with a 2–3 f stagger; the cursor starts moving at frame 10 | 10–14 f (8–11) | power3.out / expo.out | every UI beat (about 25 in Timeliner, about 12 in Kartel) |
| T5 | **White light-sweep wipe** (0:36.9) | a bright diagonal gradient band crosses the outgoing panel; the next panel is revealed behind it, already tilted | 4–6 f (3–5) | power2.in | 3–4× |
| T6 | **UI pull-back to isolate** (1:23.3) | the whole UI scales 100 → 55 % and slides down; the purple background is revealed; the selected element stays centred and becomes the next shot | 12 f (10) | power3.inOut | 3× |
| T7 | **Counter roll** (envelope 59+ → 96+) | the number ticks +1 every 2 frames while the object scales up 10 % | 45 f (36) | linear ticks | 1× |
| T8 | **Logo echo build** (2:02.7) | a circle pops (scale 0 → 1.1 → 1, 6 f); two echo circles slide out to the right overlapping it (8 f); the group shifts left; the wordmark types on at 2 frames per character | about 50 f (40) total | back.out(1.7), then steps | end card |
| T9 | **HUD bracket + glyph-scramble headline** (KGeN 5.9–9.5 s) | corner brackets open from about 360 px to full text width (22 f); characters tumble in left to right at about 1 char per frame (each is a rotated, tinted block that resolves into a letter in 3–4 f); the brackets "breathe" to a taller box (+15 %, 8 f) and back; exit = letters collapse to the centre (4 f) while the brackets shrink to a small [ ] (6 f); the next headline reuses the same brackets | in 16–22 f, legible hold 30 f, out 10 f | back.out(1.4) brackets; steps for glyphs | every stat / title in KGeN |
| T10 | **Shape morph** (keyhole → creature, KGeN 2.4–2.8 s) | the keyhole path morphs into a blob silhouette while the circular frame expands beyond the frame edges (iris-out); the background lightens | 12 f (10) | power2.inOut | 4–5× |
| T11 | **Match-scale zoom-through** (KGeN 37.0–37.8 s) | a node scales about ×15 in 8 f until its flat fill covers the frame; 4 f of a flat colour field; the next object grows from a dot at the centre in 8 f, its outer ring overshooting past the frame; green speed lines radiate | 20 f (16) | expo.in → expo.out | 5–6× (it replaces cuts) |
| T12 | **3D extruded letter flip** ("POG", KGeN 43.6–45.6 s) | the container squashes to a pill, then a small octagon (16 f) and re-expands; letters spin in on Y with thick extrusion and exaggerated perspective, overshoot to about 160 % and settle; then pictures rise inside the letters (letter as mask) | about 60 f (48) | back.out(2) | 1× (mid-film peak, decile 5) |
| T13 | **Orb / comet follow** (KGeN 1:14.7) | the hero orb shoots off with a curved tail; horizontal streaks blur the frame and the real hard cut is hidden under the streaks; the orb arrives centred in the new scene | 10 f (8) | expo.inOut | 2× (the only 2 measured cuts) |
| T14 | **Random-decode line** (Kartel) | characters of the line appear in random order at about 1 char per frame; accent words resolve in green; the line is complete in 16–20 f; exit = reverse decode in 6–8 f or scatter (T16) | 16–20 f (13–16) | steps (seeded random) | every headline (13×) |
| T15 | **Typewriter** (Kartel phone number, end card) | left-to-right at 3 frames per character (10 cps), no cursor; used for information the viewer must read | 3 f per char | steps | 3× |
| T16 | **Text → sine ribbon → waveform** (Kartel 14.3–15.2 s) | the letters lift onto 3 intertwined sine curves (15 f), travel along them, then the curves flatten into a thin glowing line inside the AI orb (10 f) | 25 f (20) | sine.inOut | 1× (the signature move) |
| T17 | **Gooey liquid connector** (Kartel 17–23 s) | metaball blobs pulse along a horizontal channel between the avatar circle and the orb (pulse period about 0.6 s); the liquid then funnels into the left edge of a UI card, which slides in from the right (12 f) | continuous; funnel 12 f | sine pulses | 1× |
| T18 | **Card-wall fly-through** (Kartel 0.5–4.5 s) | about 40 photo cards on a curved wall around the camera; the camera dollies forward and rolls 3–5°; the title decodes in the centre; at 4.4 s the wall flies apart and the next title decodes on black | 120 f (96) | power1.inOut dolly | 1× (the hook) |
| T19 | **Carousel under window** (Kartel 5.2–8 s) | the UI window rises from the bottom (12 f, power3.out) while photo cards on a cylinder of radius about 1.5 W rotate beneath it at about 10° per second | rise 12 f (10) | power3.out; linear rotation | 1× |
| T20 | **Dip-to-dark with a light sweep** (Kartel 51.6 s) | a green light band sweeps across the last card while everything darkens to near-black over 8 f | 8 f (6) | power2.in | 1× (into the end card) |
| T21 | **Glitch-decode wordmark** (Kartel 52.1–53.7 s) | the wordmark flickers through blurred, malformed glyphs and resolves left to right; sub-lines then decode (15 f) and type (25 f); the button outline draws and pulses | 48 f (38) wordmark | steps + opacity jitter | end card |
| C1 | **Camera drift** | all three keep a slow push or pan of 1–3 % per second under every hold | continuous | linear | always |

## 8. Motion grammar

- **Easing families:** expo.out / power4.out for arrivals (the first 25 % of the move covers about 75 % of the
  distance). expo.in for exits and zoom-throughs. back.out(1.4–2) for brackets, pills and logo pops (overshoot
  6–10 %). Linear for drifts, carousel rotation and particles. sine.inOut for liquids, orbs and bobbing.
- **Overshoot / settle:** pops overshoot to 106–110 % and settle in 4–6 f. Extruded letters overshoot to about
  160 % (KGeN). Text slams use no overshoot; they decelerate from huge.
- **Stagger:** UI sub-elements 2–3 f; avatars and pills 4–6 f; words of a slogan 6–8 f; decoded characters
  1 per frame; typed information 3 f per character.
- **Build-on order:** background glow → container (bracket, pill, window) → text → accent word colour → secondary
  label → particles. Exits reverse in a third of the time.
- **Idle / secondary motion:** the starfield drifts at 0.5–1 % W/s; glows breathe ±10 % opacity over 2 s; orbs
  bob 6–10 px; the carousel rotates; concentric rings pulse outward (Kartel) every 1.5–2 s.
- **Holds:** 0.6–1.2 s legible for a type card; 2.5–6 s for a UI beat (the cursor keeps acting); the end card
  holds 6–8 s with only glow motion.
- **Rhythm vs narration:** cuts and slams land **on the stressed word** of the VO. Timeliner's type cards change
  word by word in step with the caption phrases ("Exciting", "Right?", "BOOM", "Too many / tools", "Smarter",
  "Cleaner"); syllable-exact sync is *inferred*. Decodes start 2–4 f before the word is spoken
  and complete on it. During the music-only gap (Kartel 28–36 s) motion speeds up to carry the beat (deciles 5–6
  rise to about 18–20).
- **Never fully still:** if an element must be read, it still drifts in scale or position; if the picture must
  rest, the background moves.

## 9. Sound (inferred)

- **VO:** a single narrator, energetic and conversational, at 134–138 WPM (Timeliner, KGeN); in the music-led
  version 102 WPM with 3–8 s VO gaps (Kartel 28.0–36.3 s). Timeliner adds a second "client" voice inside the
  voice-note chip (0:14–0:20, a rambling vague brief), and its sarcastic asides suggest a dry comic read. KGeN
  uses gamer slang and a dare aimed at big tech. Kartel delivers ad-copy claims.
- **Music:** continuous from frame 0 (silence 0–2.7 s across all three). Genre *inferred*: modern electronic /
  future-bass or trap with big drops, about 120–140 BPM. Timeliner's 4.8 s caption gap at 1:46–1:51 implies a
  musical sting under the spreadsheet gag. The final auto-caption of Kartel is a famous pop-song hook, which
  suggests the bed quotes or imitates a commercial song. Do not replicate that.
- **SFX density:** high. Every slam gets a whoosh + impact; "BOOM" a sub-drop; notification floods get pings;
  decodes get glitch ticks; typewriter text gets key clicks; zoom-throughs get risers. Expect about 1 SFX per
  second in the hook and chaos sections. KGeN's description explicitly sells "music & SFX".
- **Ducking:** music sits about 8–10 dB under the VO and swells in VO gaps; masters at −13 to −17.6 LUFS.

## 10. Do / Don't

**Do**
1. Put a number or a paradox on screen within 5 s ("$5,000 in 5 days", "30% leaner", an inbox counter).
2. Hard-cut or slam type exactly on the stressed syllable of the VO.
3. Keep the hold share under 5 %: drift every held element by 10–15 % scale or 3–5 % W.
4. Build one dominant hue family plus neutrals; spend the accent on ≤ 10 % of pixels.
5. Light with glow: bloom layers, rim arcs, light sweeps, a vignette 40–60 % darker in the corners.
6. Show product UI tilted in perspective (rotateY 20–35°) and settle it flat in 10–14 frames.
7. Use one recurring hero token (orb, cursor, ribbon) that physically carries the viewer between scenes.
8. Replace cuts with zoom-throughs, morphs, decodes or light sweeps when going "no-cut"; keep each transition
   8–20 frames.
9. Highlight the key word of every slogan (gradient pill or accent colour); one highlight per line.
10. Reveal the brand at 25–35 % of the runtime (earlier, about 10 %, in a 60 s cut).
11. End on the calmest frame of the film: wordmark, URL, CTA, plus a callback to the hook; hold ≥ 4 s.
12. Run music from frame 0 to the end with no silence longer than about 1 s; give the music one VO-free stretch
    of 4–8 s in the middle.

**Don't**
1. Don't let anything sit perfectly still for more than 6 frames (except the final 2 s of the end card).
2. Don't mix the hard-cut regime and the morph regime inside one film.
3. Don't use more than one hue family plus one accent; colour variety comes only from embedded photos.
4. Don't outline shapes in black. Edges come from light, rims and glow.
5. Don't put more than one sentence on screen at once (except the end card stack).
6. Don't type body text slower than 10 cps or decode headlines slower than about 1 char per frame.
7. Don't show flat, straight-on UI screenshots for long. Tilt, push or isolate them.
8. Don't use real third-party app logos, brand icons or real people's photos. Use generic glyphs and
   illustrated placeholder portraits.
9. Don't burn a studio watermark into frames (Timeliner carries one on every frame).
10. Don't use a slow, soft VO in this style. 130–140 WPM, or let the music lead at about 100 WPM.
11. Don't fade to black between sections. Hand over through a type card, a zoom-through or a light sweep.
12. Don't sample or imitate a recognisable commercial song.

## 11. Replication recipe (code)

**Rendering model.** HTML + SVG scene, a GSAP master timeline (`paused: true`), and a Playwright loop that calls
`tl.seek(f / FPS)` and screenshots each frame at 1920×1080, 30 fps. Every visual state must be a pure function of
time. Derive scramble letters, particle positions and wobble from `t` and a seeded PRNG, never from counters
incremented in `onUpdate`. For motion blur on slams and zoom-throughs, render 4–8 sub-frames per frame
(seek t + k/(FPS·n)) and average them (accumulation blur). This is the most convincing route for T1, T11 and T18.

**Layer stack (back to front):**
1. `bg`: a radial gradient (`#1c1223` centre → `#0a080d` edges) or concentric rings
   (`repeating-radial-gradient(circle at 50% 60%, #151716 0 22px, #0e0f0f 22px 44px)` for the Kartel look) plus
   a vignette.
2. `fx-far`: starfield canvas (seeded points; drift x += 0.6 % W/s) or a HUD grid (1.5 px lines every 300 px at
   8 % opacity).
3. `glow`: eclipse arcs (two SVG circles r = 1.1 W, stroke 4 px `#e9b8ff` with a duplicate `feGaussianBlur
   stdDeviation=40` screened behind) or a spotlight (radial `rgba(61,220,132,.35)` → 0).
4. `world`: a 3D container `perspective: 1400px; transform-style: preserve-3d` holding UI panels, card walls and
   carousels (card i: `rotateY(i*θ) translateZ(-R)`).
5. `type`: the headline layer (HTML text, so SplitText can split it); chroma copies for impacts.
6. `fx-near`: speed lines, light sweeps (`linear-gradient(115deg, transparent 40%, rgba(255,255,255,.85) 50%,
   transparent 60%)` with `mix-blend-mode: screen`, translated across in 4–6 f), sparkles.
7. `grade`: vignette + 3 % noise (`feTurbulence baseFrequency=0.9`, opacity .03).

**Filter recipes**

```html
<!-- bloom: blurred copy screened over the original -->
<filter id="bloom"><feGaussianBlur stdDeviation="18" result="b"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<!-- gooey liquid (T17): blur, then alpha threshold -->
<filter id="goo"><feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b"/>
  <feColorMatrix in="b" mode="matrix" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 24 -10" result="g"/>
  <feComposite in="SourceGraphic" in2="g" operator="atop"/></filter>
```

- **Chromatic aberration (T2):** three stacked copies of the word, filled `#ff2a6d`, `#2af5ff` and `#ffffff`,
  with `mix-blend-mode: screen`; animate the red copy to x −8 → −2 and the cyan copy to x +8 → +2 over 6 f
  (expo.out), plus `filter: blur()` 6 → 0.
- **Neon bevel window (Kartel):** `border-radius: 28px; border: 3px solid #3ddc84; box-shadow: 0 0 0 14px
  rgba(61,220,132,.25), 0 0 60px rgba(61,220,132,.55), inset 0 0 0 1px rgba(255,255,255,.2)`. Panel fill
  `#111312`.
- **Extruded condensed headline (KGeN):** Anton, fill `#dff2ee`; extrusion = 6 stacked copies offset (0, 1…6 px)
  filled `#2b4a46`; drop shadow `0 10px 24px rgba(10,30,30,.45)`.
- **Gradient pill:** `background: linear-gradient(90deg, #7a2ff0, #c98bff 60%, #f2e2ff)`, radius 22 % of
  height, padding 0.35 em 0.6 em, text `#2a1238`.

**Camera rig.** Wrap the world in `<g id="cam" transform="translate(960 540) scale(z) rotate(r)
translate(-cx -cy)">` and animate `{cx, cy, z, r}` with GSAP. Zoom-through (T11) = tween z from 1 to 15 on the
target node (expo.in, 8 f), swap the scene while the frame is a flat colour, then tween the new scene's z from
0.05 to 1 (expo.out, 8 f). For 3D UI use CSS transforms on the panel, not the camera.

**Core helpers (pseudo-code)**

```js
const FPS = 30, F = n => n / FPS;            // durations in frames
const rng = seed => () => (seed = (seed * 16807) % 2147483647) / 2147483647;

function slamWord(el, at, holdF = 27) {        // T1
  return gsap.timeline()
    .set(el, { autoAlpha: 1, scale: 4, filter: "blur(14px)" }, at)
    .to(el, { scale: 1, filter: "blur(0px)", duration: F(4), ease: "expo.out" }, at)
    .to(el, { scale: 0.85, x: "+=96", duration: F(holdF), ease: "none" }, at + F(4))
    .set(el, { autoAlpha: 0 }, at + F(4 + holdF));
}

function decode(el, text, at, { perChar = 1, random = true, seed = 7 } = {}) {   // T14/T15/T9
  const order = [...text].map((_, i) => i);
  if (random) { const r = rng(seed); order.sort(() => r() - 0.5); }  // fixed seed = deterministic
  const p = { v: 0 }, glyphs = "#%&@$ABCDEFGHJKLMNPRSTUVWXYZ0123456789";
  return gsap.to(p, { v: text.length, duration: F(text.length * perChar), ease: "none",
    onUpdate() {                       // state derived from progress only
      const shown = new Set(order.slice(0, Math.floor(p.v)));
      const r = rng(Math.floor(p.v * 997) + seed);
      el.textContent = [...text].map((c, i) => shown.has(i) || c === " " ? c
        : (order.indexOf(i) < p.v + 3 ? glyphs[Math.floor(r() * glyphs.length)] : " ")).join("");
    } }, at);
}

function uiTiltIn(panel, at) {                 // T4
  return gsap.fromTo(panel, { rotateY: -30, rotateX: 15, yPercent: 20, scale: 1.15, autoAlpha: 0 },
    { rotateY: 0, rotateX: 0, yPercent: 0, scale: 1, autoAlpha: 1, duration: F(12), ease: "power3.out" }, at);
}

function cursorTo(cur, x, y, at, click = true) {
  const tl = gsap.timeline().to(cur, { x, y, duration: F(10), ease: "power2.inOut" }, at);
  if (click) tl.to(cur, { scale: 0.85, duration: F(2), yoyo: true, repeat: 1 }, at + F(10));
  return tl;
}

// master: hook → chaos → reveal → features → aphorism → end card (cue times from Kokoro word timestamps)
const tl = gsap.timeline({ paused: true });
cues.forEach(c => tl.add(BEATS[c.type](c), c.t - F(2)));   // land 2 f before the stressed syllable
```

**Defining shots and how to build them**

1. **Slam word in a speed tunnel** (Timeliner 4.6 s). The background is 120 radial lines (SVG, stroke 2 px,
   `#b253e1` at 40 %) whose dash offset animates outward while the group scales 1 → 1.3 over the hold. The word
   uses T1 with accumulation blur. A 4-point sparkle glyph scales 0 → 1 on the first letter at frame 10.
2. **Slogan pill inside a glowing ring** (Timeliner 43 s, 48 s). A thin ring (r = 575 px, 2 px stroke + bloom)
   sits centred. Line = [pill word][plain word] in Inter 500 with a 75 px cap height. Animate with T3, add a
   linear group drift of −20 px y over the hold, then a hard cut to UI.
3. **Tilted dark UI with a hero cursor** (Timeliner 50–110 s; Kartel 22–47 s). A 1500 px-wide original
   dashboard mock (dark `#0f0f12`, 1 px `#2a2a30` dividers, a violet or emerald active state) enters with T4.
   The cursor visits 2–3 targets per beat (T4 + `cursorTo`). Items highlight with a 4 f glow pulse. Exit with a
   light sweep (T5) or a pull-back (T6).
4. **HUD-bracket stat** (KGeN 6–10 s). A sage radial background, a 300 px grid and 4 lime ring-dots drifting. The
   brackets are four L-paths (4 px, 105 px legs) animated to the text bbox ±60 px. The headline is Anton
   extruded, revealed with `decode(…, {random: false, perChar: 1})` while each character also tweens rotation
   90 → 0 and a fill from `#86f11b` to `#dff2ee` over 3 f.
5. **Decode → ribbon → liquid → card** (Kartel 11–23 s). The line decodes inside a dark orb circle (T14). Then
   SplitText characters follow `y = A·sin(kx + ωt + φi)` on 3 phases (MotionPath, 15 f) while A tweens 40 → 0 px,
   leaving a 2 px glowing line. Blobs (circles 20–60 px, `#3ddc84`) travel along a channel under
   `filter: url(#goo)`, and the channel widens into a trapezoid that meets the incoming UI card's left edge.

**End card template:** dark field; top spotlight (radial, 35 % accent); wordmark decode (T21, 48 f); URL line
decode (15 f); CTA typed (25 f); button outline drawn (DrawSVG, 12 f) then a glow pulse every 1.0 s; hold to the
end with only the glow breathing.

**Audio build (synthesised):** a 124 BPM bed (kick on quarters, sidechained pad, plucked arp), a 2-bar riser into
the brand reveal, a sub-drop on the impact word, an impact + reverse-cymbal on each slam cut, glitch ticks
(white-noise bursts of 15–30 ms, band-passed at 3–6 kHz) per decoded character group, key clicks at 10 cps for
the typewriter. Kokoro VO at speed 1.05–1.1, with word timestamps driving the cues; duck the music 9 dB under
the voice; master to about −14 LUFS.

## 12. Per-video notes

**Timeliner (Flash Motion, 134 s)**
- Every frame carries a burned-in "Animated & Designed by Flash Motion" badge (top-left): an agency portfolio
  upload, not the client's channel.
- About 56 % of the 48 timeline frames are product UI, and about 44 % are kinetic type or abstract set pieces.
  The 16 % "non-animated" share is stock footage playing inside the video-review player (talking heads,
  podcast), so this is still a fully designed piece.
- Comic devices: a client voice note shown as a waveform chip with dim, large lilac caption text behind it; a
  hand-drawn scribble underline under "What does that even mean??"; a single file icon multiplying into a
  40-file grid; notification banners stacking on a phone with app bubbles flying past (0:09.5–0:11).
- The opening is an "eclipse": two glowing arcs frame "So…"; a falling light point streaks down and becomes a
  laptop UI in perspective (2.5–4.0 s).
- The motion curve is front-loaded (the problem act is the most kinetic, deciles 1–3 at about 16) and the end
  card is calm (3.3).

**KGeN (What a Story, 90 s)**
- One continuous camera journey: only 2 measured cuts (12.3 s and 1:15.1), both hidden under orb streaks.
- The palette is muted (colourfulness 31.2) with the neon used as a 1.2 % accent. It reads as "gaming" through
  shapes (HUD brackets, octagons, controller glyphs, an atom, a heartbeat line) more than through colour.
- Soft-shaded 2.5D objects (inner gradients, drop shadows, specular orbs, knurled dials) rather than pure flat
  vector.
- The mid-film peak is the "POG" extruded letter flip (decile 5 = 12.8). The finale is a ring of controller
  glyphs that morphs into a glass torus, then the logo (1:18–1:27).

**Kartel (What a Story, 60 s)**
- Zero hard cuts. All 13 text beats decode or type in; transitions are fly-throughs, liquid morphs and light
  sweeps. The opening 6 s card wall gives the article's highest decile (39.5).
- Mostly dark (87 % dark frames) and monochrome emerald; the "vibrant" impression comes from the AI-image photo
  cards.
- The headline type is modest (about 45 px cap height). It feels "bold" through weight, caps and the green accent
  word, not through size.
- It contains a 4 s VO-free music stretch (32–36 s) and ends on an end card with phone number and URL typed out.

## 13. Source-list issues

- **The publisher's own work in the list.** KGeN (#15) and Kartel (#16) are What a Story's own client work, uploaded to the
  publisher's channel. So are two other entries in the same article: Synoptix (#9, gVcyghMTrtU) and Elevate/
  Membrain (#4, 2yL0LhyxOGk). That is 4 of 18 entries, while the intro frames the list as videos "recognized … by
  marketers". Kartel's heading "Best Product Launch Video" copies What a Story's own YouTube title, and its
  description advertises "a Super Bowl quality ad for just $5,000".
- **Timeliner is another agency's portfolio piece** (Flash Motion; burned-in watermark; agency links in the
  description). The article credits no studio for any entry and files Timeliner under "SaaS Product Demos & UI
  Visualization". That category also fits: about 56 % of the runtime is UI.
- **KGeN claims vs frames:** "neon visuals" is overstated (neon lime = 1.2 % of pixels; colourfulness 31.2, muted
  sage). "Fast-paced transitions" contradicts the measurements: 1.33 cuts/min, a median shot of 14.8 s and a
  moderate motion of 7.6. The transitions are smooth morphs and zoom-throughs.
- **Kartel claims vs frames:** "vibrant color palettes" is not true of the graphics (dark, monochrome green;
  brightness 0.20). "Fast transitions" is true in motion terms (17.3, highest of the 15 measured article videos)
  but there are zero hard cuts. "Bold typography" is weight, not size.
- **Timeliner claims** hold up: high energy (motion 11.7), crisp UI, bold transitions. The stated duration
  (2:13) matches.
- **Possible music licensing issue:** Kartel's last auto-caption is a famous pop-song hook. Treat the soundtrack
  as non-reusable reference.
- **Auto-captions misspell brands** ("kjan" for KGeN, "Cartel" for Kartel). Rely on titles, not captions, for
  names.


---

## Appendix — music-led "launch film" sub-variant B (moved here from the saas-ui analysis)

Clay (sjRKMbmeXnw, 90 s, no VO, LUFS −11.8, hold 0.37) and Microsoft 365 Copilot (B4mJO6F5kok, 60 s, song vocals, 19 cuts/min) are the music-led SaaS launch films. Their extra devices: on-screen user text is the script (prompt chips typed at ~20 cps, message bubbles), glyph-assembly logo at 8–12 %, a confetti burst + hyperspace-tunnel transition, emoji/object "noun" beats alone on black, a short serif tagline alone before the logo, SFX ~1 per 1.5–2 s, music as the lead (no ducking).

### Beat map, variant B (Clay 90 s; Copilot 60 s)

| % | beat |
|---|---|
| 0–8 % | **Cinematic metaphor without words.** Clay shows glass bubbles holding social-network glyphs and contact photos drifting through a nebula ("your network is scattered"). Copilot shows a 3D desk with a typed prompt chip, "Hey Copilot, what have you been up to…" |
| 8–12 % | Logo (Clay assembles it from stroke fragments at 7–8 s) **or** stat slams (Copilot 3–9 s: "2x faster responses", "70% of the Fortune 500") |
| 12–90 % | **Chapters driven by on-screen user text**, 8–15 s each. Clay runs one mini-story (a friend moves to New York; the user notices, messages, notes a reminder, searches, attends a party, forms a group), and each story step introduces a feature. Copilot runs 5 prompts ("can you prioritize my inbox?", "make this presentation", "helping my team with some research?", "delegate this task", "turn this business process into an agent?"), each answered by a UI panel. |
| 90–100 % | A short tagline alone (Clay: a serif line, "It's who you know.", held 1.5 s on black), then logo + URL + "Available for iOS, Mac and Web". Copilot: the product mark on white, then the corporate logo. |

