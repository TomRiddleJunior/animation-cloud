# CrashCourse: style analysis (animated parts only)

CrashCourse is a **host-led** classroom series. The host talks fast to camera from a themed set, and the show cuts away to animated inserts and motion graphics roughly every 20–45 s.

This file describes **only the animated layer**: what the inserts look like, how long they run, how they enter and leave the host footage, and which graphic overlays sit on top of the host. Host performance and set design are covered only where they shape the inserts.

Four videos are analysed across three eras:
- 2012 (World History, Biology);
- 2014 (Psychology);
- 2026 (Geology).

The animation studio changes per series, and the 2026 episode is mostly stock footage plus collage cards. So "CrashCourse animation" is really four sub-styles sharing one integration grammar.

**Measurement notes**
- Source files are 854×480 at 23.976 fps. Pixel values are converted to **1080p (×2.25)**. Frame counts are at 24 fps.
- My extra passes over `research/media/<id>/<id>.mp4`:
  - **Host vs insert classification** every 0.5 s (HSV-histogram similarity to 5–7 host-set reference frames, threshold 0.55). This gives insert runs of 1 s or more.
  - **Board detector** for Biology (parchment/pink paper pixel share > 55%).
  - **Dense 24 fps strips** around every transition type.
  - **k-means palettes** on cards.
  - **Frame-cadence tests.**
  - **Narration-only WPM.**

Abbreviations:
- **WH** = World History #1 (Yocja_N5s1I)
- **PSY** = Psychology #1 (vo4pMVb0R6M)
- **BIO** = Biology #1 (QnQe0xW_JY4)
- **GEO** = Geology #22 (uJA1qZirWVc)

---

## 1. Identity

Three things make a CrashCourse video recognisable:
1. **The rhythm.** A fast-talking host (170–205 WPM) jump-cuts between a wide and a close framing. Every 20–45 s, a hard cut or a graphic swipe hands over to a full-frame flat-colour insert. The insert runs 3–20 s, or 50–90 s for a narrative "thought bubble" segment. Then the show snaps back to the host mid-sentence.
2. **The graphic vocabulary of the 2012–2014 era**:
   - candy-bright flat vector illustration with no outlines;
   - **diagonal-stripe swipes** and **light-leak flash dissolves** into full-frame keyword cards set in condensed bold caps;
   - **diamond-shaped badges** that pop in beside the host;
   - false-colour historical portrait "bio cards".
3. **The 2026 era vocabulary**:
   - tactile collage: torn-paper cards on patterned borders, the host cropped into a paper-edged inset panel beside a definition card, words appearing in sync with speech;
   - stock footage tagged with small rounded location labels.

Every era has a verbal hand-off into the big animated segment ("Let's go to the…") and a verbal thank-you out of it. Every episode ends with the host thanking the crew over a credit panel and an end screen.

---

## 2. Sources analysed

| id | title (year) | dur | cuts/min | median shot s | motion | colourful | WPM overall / narration | LUFS | non-host share (mine) | inserts ≥ 1 s | insert median / p90 s |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Yocja_N5s1I | The Agricultural Revolution: World History #1 (2012) | 11:10 | 4.74 | 8.32 | 8.22 | 49.0 | 202 / 204 | −14.0 | 38% (≈2/3 animation, 1/3 stock) | 25 | 6.5 / 19.6 |
| vo4pMVb0R6M | Intro to Psychology: Psychology #1 (2014) | 10:54 | 3.76 | 14.31 | 6.88 | 49.4 | 185 / 188 | −14.1 | 30% (almost all animation and cards) | 24 | 5.5 / 18.4 |
| QnQe0xW_JY4 | Carbon… SO SIMPLE: Biology #1 (2012) | 11:56 | 4.36 | 9.05 | 6.81 | 35.2 | 195 / 196 | −20.0 | 35% drawn boards + 11 s intro + biography bit | 15 boards | 12.5 / 30 |
| uJA1qZirWVc | How do we Mine Minerals?: Geology #22 (2026) | 10:22 | 10.23 | 4.38 | 6.78 | 40.7 | 172 / 172 | −15.9 | 44% (≈55% stock footage with tags, ≈45% graphics/animation) | 19 | 14.5 / 29.6 |

(The analyzer's `animated_frac` values, 0.67 / 0.17 / 0.54 / 0.11, are misleading. See section 13.)

---

## 3. Measured pacing

- **Insert frequency**: about 1.3–2.2 inserts per minute.
  - WH 25 in 11.2 min; PSY 24 in 10.9 min; BIO 15 boards in 11.9 min; GEO 19 in 10.4 min.
  - In practice: **the host never talks for more than about 45 s without a graphic.**
  - Host-run medians: WH 6.5 s, PSY 14.2 s, GEO 16.5 s, BIO about 26–44 s (BIO relies on long host stretches with a small changing inset icon on the set wall).
- **Insert length distribution** (2012–2014):
  - many short cards of 1.5–5 s (keyword cards, stripe cards, question cards, pop-in diamonds);
  - medium animated explanations of 10–26 s;
  - **one long narrative "thought bubble" segment of 50–90 s per episode** (WH 2:16–3:39 = 83 s, the longest; PSY's longest animation runs are 20–26 s, at 2:23 and 3:45).
  - BIO boards hold 5–30 s each (median 12.5 s). Several boards chain into one 60 s run (7:29–8:31).
- **Share of runtime**: graphics and animation take about 25–38% of runtime in every era. Stock footage adds about 12% (WH) and about 25% (GEO).
- **Inside inserts**:
  - WH's thought bubble changes composition every 5.6 s (median; 9.6 per min).
  - PSY's animation changes every 3.8–6.2 s.
  - BIO boards every ~9 s (each board builds up by write-on, then cuts).
  - GEO's felt-card collage every ~5.5 s.
  - This is the same 5–6 s "visual idea" rhythm as other explainers, packed under 190+ WPM narration. **Each composition carries 15–20 words.**
- **Cuts per minute**: 3.8–4.7 in 2012–2014, mostly host jump cuts plus insert boundaries. **10.2 in 2026**: stock-footage montage with label tags, cut every 1.7–10 s.
- **Cold open, then theme sting**:
  - WH: 55 s cold open, then a 9 s intro;
  - PSY: 2:11 cold open (includes a definition card and question cards), then a 10 s intro;
  - BIO: 19.5 s cold open, then an 11 s intro;
  - GEO: 28 s cold open (includes an 8.5–23 s stock montage), then a 5 s intro.
  - Rule: **cold open 20–130 s (3–20% of runtime), theme sting 5–11 s.**
- **Motion energy**: mean 6.8–8.2, higher than TED-Ed because the host gestures constantly. WH's motion peaks (p90 19.5) are stripe swipes and the thought bubble.
- **Animation cadence**: inserts are tweened on **ones** (24 fps After-Effects-style puppet and transform animation), alternating with full holds. Examples:
  - WH thought bubble: bursts of `xxxx` with `....` holds;
  - BIO boards: static holds broken by write-on bursts;
  - GEO felt cards: holds plus cuts.
  - Nothing is on twos.
- **Loudness**: −14 LUFS (WH, PSY), −15.9 (GEO), −20 (BIO, an old mix). Total silence is 6.8–8.7 s: natural speech pauses and gag beats.

---

## 4. Script & narrative structure (as it drives the inserts)

**Beat map** (all four episodes)

| % runtime | beat | animated content |
|---|---|---|
| 0–3…20 | **Cold open**: direct address; framing joke; big questions; second-person hook ("No matter where you are, what device you're watching this on…", GEO 0:00) | 2012–14: definition card, question cards, a "past-self student" interjection (WH 0:12, a second host costume on a hard cut). 2026: a 1–2 s stock montage illustrating each listed item. |
| +5–11 s | **Theme sting** | Animated logo or series-title sequence (WH: flat-vector timeline montage with "Did you know?" pop-up panels ending on a starfield logo; PSY: logo build on black, then an episode-title card; BIO: banner on cyan; GEO: badge on a sandstone texture with a serif subject word). |
| ~10–85 | **Body**: host exposition interleaved with inserts every 20–45 s | Keyword cards on each new term, maps and timelines for places and dates, bio cards for historical figures, one long narrative animation, comedic recurring bits |
| ~15–35 (once) | **Narrative animated segment** (the "thought bubble") | The host's verbal cue: "Let's go to the Thought Bubble." Then a swipe and a title banner. The animation is VO-narrated by the host for 50–90 s. Cue out: "Thanks, Thought Bubble." Then a hard cut to the host. |
| ~55–65 | **Recurring comedic bit** | WH: a letter-to-an-animal segment on a second set (fireplace chair) with its own stripe swipe and a graph overlay. BIO: a biography corner (host in an armchair in front of a sepia patterned backdrop, with a big script word and scrolling cursive text). |
| 85–95 | **Wrap-up**: the big idea restated; "Next week / Next time we'll…" | GEO: a lower-third "next time: <topic>" label. 2012–14: none. |
| 95–100 | **Credits and CTA**: host thanks the crew and patrons over a credit panel, then an end screen | WH: credits crawl to the right of the host, then an end screen with subscribe and the next episode. PSY: a purple credit panel at the right, then an end screen with 2 video tiles and subscribe. BIO: a table-of-contents panel (chapter links) beside the host. GEO: split credit card, then a company logo sting. |

**Verbal hooks that trigger graphics** (the integration contract):
- **New term** → full-frame keyword card or definition card, within 0–0.5 s of the word.
  - WH: "Advantage: …" stripe cards.
  - PSY: "…to free associate" → FREE ASSOCIATE card.
  - GEO: "minerals" → definition card.
- **Historical person** → bio card (PSY: Aristotle, Titchener, William James, Skinner) or a pop-in diamond.
- **Place** → map (WH world maps; GEO world map with dotted supply-chain route).
- **Number** → kinetic number over the host (GEO "15,000", "40x higher") or icon tonnage cards (GEO "1 ton" vs "200 tons").
- **Rhetorical question list** → black question cards, one per question (PSY 1:36–1:54).
- **List of items** → one stock clip per item (GEO cold open: buildings, food packaging, toothpaste, solar, wind, EVs).

Quotes kept short:
- the hand-off cue "Let's go to the Thought Bubble." (WH 2:14)
- the sign-off "Thanks, Thought Bubble." (WH 3:37)

---

## 5. Visual system (animated layer)

### 5a. Four sub-styles

| | **A. Flat-vector "thought bubble" (WH 2012)** | **B. Textured-card vector (PSY 2014)** | **C. Marker-on-paper boards (BIO 2012)** | **D. Paper collage + footage (GEO 2026)** |
|---|---|---|---|---|
| Field colours | Mint/aqua #87FCE0 / #59CEC1 / #56FCBA; white map #F5F8F8 | Saturated textured fields, one per card: red #B73039, orange #F49D34, cyan #13C6D2, purple, magenta #BA0175, coral #F38464; hot-pink scenes #F273C5 / #E80C89 | Parchment #E5CFA4 / #F4E2BF / #D3B584 (vignetted edges #B69162); pink paper #EFBDCC / #DD8DA8 | Cream card #E6D6C7; mustard topographic border #EAC177 / #B69262; felt green #325B2B; navy panel #274067; map teal #16655C / land #3DB554 |
| Darks | #231F21; forest green #407E53 / #21412E | Question cards: near-black maroon #0F0001 → #20000A with a radial red glow | Marker black #170F0B | Ink #231A13; host-set green #3A4E47 |
| Accents | Coral-red banner #D26251; pink X #DC3A71; stripe magenta #D82A51 on aubergine #2F1944; stripe orange #F29227 on red #E43333 | Highlight words in yellow, pink, cyan or violet; false-colour portraits (teal skin + orange hair; purple skin + green coat) | Pale cyan electrons; salmon/green nucleus dots; pink dress | Tile cyan #9FE6F1; flag stickers; pink-stripe border #A0374A; rounded label tags (dark green / violet) |
| Line | **No outlines.** Flat fills with one darker tone. | No outlines. Soft gradients and noise textures. | **Black marker strokes** of about 6–7 px at 1080p, round caps and joins, slightly wobbly | No outlines. Collage objects have **white paper borders** of about 10–12 px (sticker look) and torn edges. |
| Texture | Very light. Diagonal hatch fills on clouds and side panels. Rounded "projector" frames with dark inner vignette on maps. | Fine scribble/glyph noise on card fields, radial centre glow, kaleidoscopic or "fur" textures behind bio cards | Paper grain plus a strong edge vignette | Paper fibre, felt, topographic contour lines, torn-paper edges |
| Lighting | Flat | Light-leak flashes, bloom | None | Soft drop shadows under cards (2–4 px blur) |

### 5b. Typography (free look-alikes)

- **A/B condensed caps**:
  - Look-alikes: **Bebas Neue**, **League Gothic**, Oswald SemiBold. Always uppercase, white.
  - Stripe-card word: cap height about **30% of frame height** (≈ 320 px at 1080p), about 80% of frame width, centred.
  - PSY keyword card: cap height ≈ 18–20% of frame height, ~70% width, centred, with a thin underline (5–6 px) about 0.15 cap-heights below the baseline.
  - PSY definition card:
    - small italic serif label "Definition:" (look-alike: Crimson Pro Italic, ~30 px);
    - the term in condensed caps ~120 px, underlined;
    - a one-line sentence below in condensed regular ~45 px with key words tinted.
    - Left-aligned at x ≈ 4% of frame width, top at ≈ 22%.
  - Question cards: condensed caps ~45 px, 2–3 lines, left-aligned in a block about 45% of frame width. Key words coloured.
- **Bio card**: "Fig. 1.x" in italic serif (~34 px) above the NAME in condensed caps (~85 px), both centred in a coloured diamond at the lower left-centre. An aside callout box (pale tint, dashed underline under a condensed-caps header plus 2–3 lines of italic serif ~22 px) sits at the upper right of the portrait.
- **C, handwritten marker**: look-alikes **Patrick Hand**, **Kalam Bold**, Gochi Hand. Titles ~90–110 px; labels ~45 px. A script face for the biography bit: **Pacifico** / Dancing Script Bold, white, ~200 px, partly cropped by the frame edge.
- **D, soft bold serif lowercase** for card titles. Look-alikes: **Fraunces Bold** (soft), Recoleta-like. Card title ~50 px, ink #231A13. Definition in a humanist sans (**Nunito** / Source Sans 3) ~32 px, dark grey. Kinetic lower text over the host in white bold serif ~90 px with a soft shadow. Location tags are 22 px white sans in dark rounded pills (radius 8 px) at the top-left, 3% margin.

### 5c. Composition rules

- Full-frame inserts: subject centred, about 40–60% of frame height. Generous flat field. Text either centred (keyword cards) or in the left/top third (definition and question cards).
- **Overlays on host footage** use the side of the frame the host is not occupying. Hosts sit centre or centre-right. Overlays take the left 30–35% (diamond badge, flags), the top-right corner (book icons, inset box), or the bottom 20% (kinetic numbers, lower-third label).
- GEO split card (measured): host footage in a left panel x 18–413 of 854 (2–48%, full height minus 10 px margins), card panel x 444–830 (52–97%), on a patterned border background. Both panels have torn-paper edges.

---

## 6. Characters & objects

- **A (WH thought bubble)**:
  - Tall, thin, flat figures. Head is a rounded rectangle about 1/5 of body height; body a simple tunic shape; stick limbs; no hands or feet detail; dot eyes or no face.
  - Characters are mostly static props that slide, bob and pivot (puppet tweens) rather than act.
  - Icon language: round white badges holding simple glyphs (food bowl, music notes, check marks), floating hearts, skeleton x-ray with check-mark badges, big pink X over a figure.
  - Maps: flat land on white sea (or the reverse) inside a rounded frame, with red dots popping on.
- **B (PSY)**:
  - Caricatured historical figures with oversized heads (head ≈ 1/3 of figure height): round glasses, beards built from simple white masses, cigar props.
  - Mid-shots of a couch-and-therapist scene with icons popping in thought circles above heads.
  - A diagonal split reveals a big close-up portrait on the right.
  - Mini host-avatar figures sit inside diamond badges.
  - **Bio cards**: a public-domain portrait or bust photo with a two-tone false-colour treatment (gradient map on face vs hair/clothes), cut out over a moving textured background, plus the diamond nameplate and an aside callout.
- **C (BIO)**:
  - Stick figures with atom heads (a nucleus of coloured dots plus orbit ellipses), dresses and simple faces, drawn in marker.
  - Atoms as concentric shell circles with electron dots.
  - Labels and arrows handwritten.
  - The host-set wall is itself a drawn molecular network with a framed inset box (top-right) whose icon changes per topic (an atom-headed figure, a salt shaker, H₂O).
- **D (GEO)**:
  - No drawn characters. Objects are photo cut-outs with paper borders: mineral specimens in mock social-media post frames on green felt, national-flag stickers, periodic-table tiles, a coin-stack icon labelled "1 ton".
  - A cut-out world map with a factory icon and dotted shipping route.
  - Host stays on screen in inset panels.
- **Movement**:
  - All eras: transform-only puppet animation (position, scale, rotation) on ones; pop-ins with slight overshoot; no frame-by-frame acting.
  - BIO: **stroke write-on** (each marker stroke draws over 0.4–0.7 s, linear).

---

## 7. Camera & transitions catalogue (host ↔ animation integration)

| # | Transition | Frame-by-frame build (24 fps) | Duration | Ease | Era / frequency |
|---|---|---|---|---|---|
| X1 | **Hard cut host ↔ insert** | Instant. Lands on the keyword or right after the cue sentence. | 0 | — | All eras. The default in BIO and GEO; about half of WH/PSY insert boundaries. |
| X2 | **Diagonal stripe swipe into a keyword card** | 45° stripes in two colours (≈10 stripe pairs across the frame; each stripe ≈ 65–70 px perpendicular) sweep in from the corners. They cover the host in **4 frames** (WH f5368–5371). The stripe field becomes the card background. At about +6 frames the word **pops from ~40% to 100% scale in 2 frames** (no visible overshoot). Hold 1.2–1.8 s. Exit: the stripes break into separate bars that slide out at staggered speeds over **4–9 frames**, revealing the host already mid-gesture. | in 4f, pop 2f, hold ~1.4 s, out 4–9f | expo.out in; power2.in out | WH: 6 × ADVANTAGE/DISADVANTAGE cards, plus the bit opener |
| X3 | **Stripe curtain into the narrative segment** | Same swipe in the segment's colours (orange on red). It covers in 3 frames (135.64–135.76), holds the stripes 0.45 s, then wipes off in 3 frames to reveal the **segment title card** (mint field, coral banner strip with the title in white condensed caps, small episode tag, page-curl corner). The title holds about 2 s, then cuts or pans into the animation. | ~0.6 s curtain + 2 s title | | WH: once per episode |
| X4 | **Light-leak flash dissolve into a keyword card** | The host frame tints toward the card colour while brightness lifts (additive warm glow). The card word fades in through it with slight blur, fully on after **8 frames** (PSY f7852–7860). Exit: the card blooms toward white and crossfades back to the host in about 6–8 frames (PSY 8:29.9–8:30.2). | 8f in, 6–8f out, hold 1.5–3 s | sine.inOut | PSY: about 8 cards |
| X5 | **Shape-stack wipe into a bio card** | 2–3 large overlapping rhombi (yellow, purple, magenta) slide diagonally across the host. The textured bio-card background and the portrait appear behind them. The nameplate diamond settles last. Full in about **6 frames** (PSY 59.39–59.64). | ~6f in, ~6f out, hold 5–9 s | power3.out | PSY: 4 bio cards |
| X6 | **Corner badge pop-in over the host** | A rotated-square (diamond) badge with a pattern fill, or a figure on a solid fill, grows from a point (or slides from the frame edge) to full size in **4–5 frames** with slight overshoot (≈105% then 100%). A tinted side panel may slide in behind it from the left edge. Holds while the host talks (3–8 s), then exits in reverse. | 4–5f | back.out(1.4) | WH (diamonds, hatch side-panel with icons), PSY (avatar diamond, book icons top-right) |
| X7 | **Hatch side-panel slide** | A triangle filled with cyan diagonal hatch enters from the right edge, carrying 3–4 white circular icons in a column (WH 1:04–1:11). | ~6f | power2.out | WH |
| X8 | **Host-inset split card (2026)** | Hard cut to a layout: host cropped into the left panel, cream card at the right, on a patterned border. Then the **title word fades and un-blurs in 6 frames**. Definition words appear **one at a time in sync with speech** (each word 3–4 frames fade plus blur-to-sharp, roughly 0.2–0.3 s apart). Card variants: tonnage icons (1 ton vs 200 / 1500 tons, swapped on the number words), quote card (blue-wave border with big quote marks). | 0f cut; text 3–6f per element | power1.out | GEO: ~6 host-inset instances + 2 photo-inset variants |
| X9 | **Torn-paper diagonal wipe (2026)** | A solid shape with a torn edge (felt green, navy or teal) sweeps from the lower-left corner to the upper-right over **6–8 frames** (GEO 259.38–259.63, 301.63–302.01). The graphic is revealed on it. Labels write on 3–5 frames later. | 6–8f | power2.inOut | GEO: 3–4 |
| X10 | **Kinetic text over the host (2026)** | White bold serif number or phrase at bottom centre. Words fade and blur in left to right; the full phrase builds in about 8 frames (GEO "40x higher", 287.25–287.50). Holds about 2–3 s. Hard off at the next cut. | ~8f | power1.out | GEO: 3 |
| X11 | **Sticker pop over the host (2026)** | Flag stickers with white paper borders pop in one by one around the host (scale 0→1 with ~5° rotation), then a second sticker set replaces them. | ~4f each, 6–10f stagger | back.out | GEO: 2 sets |
| X12 | **Lower-third "next time" label (2026)** | A dark-green rounded rectangle with two lines of white text fades and slides up about 20 px in 3–4 frames at the lower-left third. Holds about 6 s. | 3–4f | power2.out | GEO: once |
| X13 | **Stock footage with location tag (2026)** | A hard cut to a clip. A small rounded tag (dark green or violet pill, white text) sits fixed at the top-left from the clip's first frame. On-screen words (e.g. "underground", "surface mining") fade in centre-frame in white bold serif. | — | — | GEO: about 25% of runtime |
| X14 | **Write-on board** | A board cuts in blank or partly drawn. Strokes draw on with a dash-offset (each 0.4–0.7 s, linear); the nucleus dots pop (2f). The handwritten title writes on in about 8 frames (BIO 117.7–118.4). The next board is a hard cut. | 0.4–0.7 s per stroke | linear | BIO: all boards |
| X15 | **Theme intro bookends** | Cold open → hard cut to the theme sting. The sting ends with a 2-frame dip to black, then a hard cut to the host (WH 63.98–64.15). | 5–11 s sting | | All |
| X16 | **Jump-cut punch-in on the host** | Wide ↔ close-up framing switch every 5–15 s (the most frequent "transition" in the edit; it carries the energy between inserts). | 0 | — | All |
| X17 | **Inside narrative animations** | Camera pans and slow zooms across a long flat-vector backdrop; soft-edged diagonal gradient wipes between scenes (≈4 frames, WH 56.4 s); diagonal split to a close-up (PSY Freud); shape-masked reveals. | 4–12f | power2.inOut | WH, PSY |

---

## 8. Motion grammar

- **Eases**:
  - Entries are fast and snappy: expo.out or back.out(1.2–1.6) over **3–6 frames**.
  - Exits are faster or equal: power2.in, 3–9 frames.
  - Camera moves inside the narrative segments use power2.inOut over 1–3 s.
  - The 2026 register is gentler: power1/power2 fades with blur, almost no overshoot.
- **Text pops**: 2-frame scale pops (2012 stripe cards); 8-frame flash dissolves (2014); word-by-word 3–4-frame fades synced to speech (2026).
- **Build-on order**: matches the narration word for word. List items appear on their noun, roughly 0.3–0.6 s apart at 190 WPM. Numbers swap exactly on the spoken number.
- **Holds**:
  - Keyword cards hold 1.2–3 s, just long enough to read 1–3 words.
  - Definition cards hold 4–7 s while the definition is read.
  - Board compositions hold 5–30 s while elements accumulate.
  - Narrative-segment compositions hold about 5.6 s each (median).
- **Idle and secondary motion**:
  - Thought-bubble scenes: small bobs and loops (birds, smoke, hearts floating up), each 1–2 s.
  - PSY bio cards: a slowly animated texture background.
  - Otherwise elements sit still between moves. Energy comes from the host and the cutting, not from constant motion.
- **Comedy timing**: visual gags land on the punchline word: hearts on "skoodilypooping" (the host's own coined word in WH), a skeleton check-marking "healthier bones", the pink X on a figure, "WEEE!!" text flying in on the host's pun (GEO 8:06). About **one visual gag every 30–60 s.**
- **Overlay discipline**: overlays never cover the host's face. They sit in the empty third and leave before the next jump cut.

---

## 9. Sound (inferred: audio not heard)

- **VO**:
  - The host's own voice in both host shots and inserts. The narrative segments are narrated live by the host, not a separate narrator.
  - Conversational, comic and very fast: **172–204 WPM** (2012 is the fastest), with sarcastic asides, pop-culture jokes and self-interruptions.
  - Total silence 6.8–8.7 s, from gag pauses.
  - Kokoro: a lively voice at speed 1.10–1.20 to reach about 185 WPM, with minimal inter-sentence gaps (≤ 200 ms) and occasional deliberate 0.5–0.8 s beats before punchlines.
- **Music**:
  - A theme music sting at the intro (5–11 s). Captions mark "[theme music]", "[Intro]", "[Music]".
  - Under narrative animations, a light underscore (inferred: upbeat, playful, about 110–130 BPM, synth or acoustic).
  - Host stretches are largely dry or have a very low bed (inferred from the speech-dominated loudness and natural silences).
  - The 2026 auto-captions mark "[music]" under some host lines, so a light bed appears throughout.
- **SFX**: comedic stingers on gags ("[music, horse hooves]" for a recurring line in WH 5:53 and 6:02); whooshes on stripe swipes (inferred); pops on badges (inferred). Density about 1 per 20–40 s.
- **Loudness**: −14 LUFS for 2012–2014 (loud, YouTube-era mastering); −15.9 for 2026. Use −14 to −16 LUFS.

---

## 10. Do / Don't

**Do**
1. Cut away from the host to a graphic at least every 45 s. Aim for 1.5–2.2 inserts per minute and 25–38% of runtime in graphics.
2. Trigger graphics from the script: new term → keyword or definition card; person → bio card; place → map; number → kinetic number; list → one visual per item.
3. Give each episode **one** long narrative animated segment (50–90 s), with a verbal cue in, a title card, and a verbal thanks out.
4. Make keyword cards huge and short: 1–3 words of condensed caps, 1.2–3 s on screen.
5. Enter cards with a fast graphic transition: a 4-frame stripe swipe (2012), an 8-frame flash dissolve (2014), or a 6–8-frame torn-paper wipe (2026). Leave just as fast.
6. Put overlays in the empty third of the host frame (diamond badges, side panels, stickers, lower-thirds), and pop them in with a 4–5-frame back.out.
7. Keep animation flat and outline-free (A/B), marker-drawn (C) or paper-collage (D). Pick one per series and stay in it.
8. Use one saturated field colour per card, with 1–2 accent colours for highlighted words.
9. Land a visual gag on punchline words about every 30–60 s.
10. Sync text builds word-for-word to the VO (2026-style) for definitions.
11. Bookend with a cold open (20–130 s), a 5–11 s theme sting, and credits plus an end screen with the next episode.
12. Narrate fast (170–200 WPM) and change the composition every ~5–6 s inside inserts.

**Don't**
1. Don't let an animated insert run with no host return for more than about 90 s. The host is the spine.
2. Don't use slow dissolves (> 12 frames) or lingering fades between host and graphics.
3. Don't cover the host's face with overlays, or keep an overlay through a jump cut.
4. Don't put sentences on keyword cards. One concept per card (definition cards may carry one short sentence).
5. Don't mix sub-styles within an episode, e.g. marker boards alongside glossy vector cards.
6. Don't add outlines or realistic shading to A/B-style vector art.
7. Don't animate on twos or with hand-drawn line boil. These inserts are clean tweened motion on ones.
8. Don't introduce a big animated segment without a verbal hand-off line, or leave it without a sign-off.
9. Don't use more than 2 font families per sub-style (condensed caps plus italic serif; or marker plus script; or soft serif plus sans).
10. Don't copy the series' logos, the segment names ("Thought Bubble", "Open Letter", "Brain Fart", "Secret Compartment"), the stripe-banner title design or the hosts' sets. Build equivalents with original names and colours.
11. Don't fill a whole episode with stock footage carrying only labels (the 2026 drift). Animated explanation is the identity.
12. Don't leave a definition on screen after the host has moved on. Cut back on the next sentence.

---

## 11. Replication recipe (code: SVG/HTML + GSAP, rendered frame by frame)

**Assumption**: the host plate is real footage (user-supplied) or a placeholder layer. Everything below is the animated layer composited over it, or full-frame between host segments. For a host-less variant, replace the host with an illustrated presenter card, keep the cut-away rhythm, and narrate everything in the "host" voice.

**Global**
- 1920×1080, 24 fps. The VO has word timestamps (Kokoro plus forced alignment).
- A `cues[]` list is generated from the script by rules: term → card; person → bio; place → map; number → kinetic; list → per-item visuals; gag → icon pop.

**Layer stack**: `host` (video) → `hostOverlay` (badges, stickers, kinetic text, lower-thirds) → `fullFrameInsert` (cards, animations, boards) → `transitionFX` (stripes, flash, torn paper, shape stack) → `grain` (D only).

**Transition builders** (durations in frames, f = 1/24 s)
```js
// X2 stripe swipe: 45° stripes as one big <pattern>-filled rect, skewed, translated along the diagonal
function stripeSwipe(tl, at, colA="#D82A51", colB="#2F1944", word="ADVANTAGE", hold=1.4){
  const S = svgRect({w:3200,h:3200, fill:stripePattern(colA,colB,135/*px period*/), rotate:45});
  tl.fromTo(S,{x:-2600,y:2600},{x:0,y:0,duration:4/24,ease:"expo.out"},at)       // cover in 4f
    .fromTo(wordEl(word,{font:"Bebas Neue",capH:320}),{scale:0.4,opacity:0},
            {scale:1,opacity:1,duration:2/24,ease:"none"},at+6/24)              // pop in 2f
    .to(splitIntoBars(S,10),{x:i=>2600+i*80,y:i=>-2600-i*80,duration:i=>(4+i%5)/24,
            ease:"power2.in",stagger:0},at+6/24+hold)                           // bars exit 4–9f
    .set(wordEl(word),{opacity:0},at+6/24+hold);
}
// X4 flash dissolve
function flashCard(tl, at, field="#F49D34", word="FREE ASSOCIATE", hold=2){
  tl.to(hostTint,{opacity:0.6,backgroundColor:field,mixBlendMode:"screen",duration:6/24},at)
    .fromTo(card,{opacity:0,filter:"blur(8px) brightness(1.6)"},{opacity:1,filter:"blur(0) brightness(1)",duration:8/24,ease:"sine.inOut"},at)
    .to(card,{filter:"brightness(2.2)",opacity:0,duration:7/24,ease:"sine.in"},at+8/24+hold)
    .set(hostTint,{opacity:0},at+15/24+hold);
}
// X6 diamond badge pop
function badge(tl, at, side="left", dur=5){
  tl.fromTo(diamond,{scale:0,rotation:45},{scale:1,rotation:45,duration:5/24,ease:"back.out(1.4)"},at)
    .fromTo(sidePanel,{x:"-100%"},{x:"0%",duration:6/24,ease:"power2.out"},at)
    .to([diamond,sidePanel],{scale:0,x:"-100%",duration:4/24,ease:"power2.in"},at+dur);
}
// X8 host-inset split card with word-synced definition
function splitCard(tl, at, title, words /*[{w,t}] from VO*/){
  tl.set(layout,{opacity:1},at)                                     // hard cut
    .fromTo(titleEl,{opacity:0,filter:"blur(6px)"},{opacity:1,filter:"blur(0)",duration:6/24},at+0.3);
  words.forEach(({w,t})=>tl.fromTo(span(w),{opacity:0,filter:"blur(4px)"},{opacity:1,filter:"blur(0)",duration:3/24,ease:"power1.out"},t));
}
// X9 torn-paper wipe: polygon with jittered edge (generate once with noise), translate along the diagonal
// X14 write-on: path.style.strokeDasharray = L; tween strokeDashoffset L→0 over 0.4–0.7 s, ease "none"
```

**Texture recipes**
- **B card field**: base colour, plus a radial gradient (centre +12% lightness), plus a "scribble glyph" layer (tiny random strokes at 6% opacity, `feTurbulence baseFrequency 0.02` displacement), plus a vignette.
- **C paper**: parchment base #E9D3A8, `feTurbulence fractalNoise 0.8` at 10% multiply, a radial vignette to #B69162 at 35%. Pink variant base #EDB8C8.
- **D**: a cream card with a torn-edge clipPath (a jittered polygon of 120 points with noise amplitude 6 px) and `drop-shadow(0 3px 4px rgba(0,0,0,.25))`. Border background: mustard #EAC177 with concentric contour lines (`<path>` iso-lines from a noise field, stroke #B69262, 3 px).
- **Bio-card false colour**: a portrait image → SVG `feColorMatrix` to grey → `feComponentTransfer` gradient map (2 stops, e.g. #13CEB9 → #793E61), masked by face vs hair/clothes regions, each region with its own map.

**Minimal episode skeleton (pseudo)**
```js
episode = {
  era: "2014",                                    // "2012" | "2014" | "2012-boards" | "2026"
  segments: [
    {type:"host", t:[0,95], overlays:[{at:35,kind:"defCard",term:"…"},{at:57,kind:"badge"}]},
    {type:"sting", t:[95,105]},                   // 5–11 s theme
    ...interleave(hostRuns(mean=18), inserts),    // insert every 20–45 s
    {type:"narrative", cueIn:"Let's go to the …", title:"…", t:[x, x+75], scenes: every(5.6)},
    {type:"host", t:[…], overlays:[{kind:"kinetic", text:"40x higher", at:"forty"}]},
    {type:"credits", t:[end-30,end-12]}, {type:"endScreen", t:[end-12,end]}
  ],
  transitions: {card: era==="2012"?"stripe": era==="2014"?"flash":"torn", insert:"cut"}
};
```

**The 5 shots that define the style, and how to build them**
1. **Stripe-swipe keyword card (2012).** Host mid-sentence, then 4-frame 45° stripes (magenta on aubergine), then a 2-frame pop of one condensed-caps word at 30% frame height, a 1.4 s hold, and staggered bars exiting over 4–9 frames back to the host. Repeat as "pro/con" pairs in alternating colours.
2. **Narrative-segment opener.** The cue line, a stripe curtain in the segment colours (orange on red, 0.6 s), a title card (mint field, coral banner, white condensed caps, small episode tag), then a pan across a flat-vector landscape with figures and icon badges. A new composition every ~5.6 s for 50–90 s, the sign-off line, then a hard cut to the host.
3. **Textured flash keyword or definition card (2014).** 8-frame warm light-leak dissolve from the host to a saturated noise-textured field: "Definition:" italic serif, an underlined condensed-caps term, a sentence with tinted keywords. Hold while read, bloom back out.
4. **False-colour bio card (2014).** 6-frame rhombus-stack wipe to a cut-out portrait with a two-tone gradient map over a slowly moving textured background. Diamond nameplate "Fig. 1.x / NAME" at the lower left, a joke callout at the upper right. Hold 5–9 s.
5. **Host-inset definition card (2026).** Hard cut to the host in a torn-edge left panel and a cream card at the right on a mustard topographic border. The serif title fades in, then the definition builds word by word on the VO timestamps. Swap the card's icon on each number word (1 ton → 200 tons). Cut back to the full host on the next sentence.

(For a BIO-style variant, swap shots 3–5 for **write-on marker boards**: parchment or pink paper, black 6 px marker strokes drawing over 0.4–0.7 s, a handwritten title written on in 8 frames, hard cut between boards, plus a small framed inset icon on the host set wall that changes per topic.)

---

## 12. Per-video notes

**Yocja_N5s1I: World History #1 (2012)**
- Bright high-key set: pale cyan-white seamless #E3F6FC, globe, desk. Brightness 0.78 and only 2% dark frames. Animation by a credited studio, named on screen as the "Thought Bubble creative team".
- The cold open includes a hard-cut "past-self student" character interjecting from a school desk.
- The theme sting is a flat-vector timeline montage with pop-up "Did you know?" panels, ending on a starfield logo, a 2-frame dip to black, then the host.
- Narrative segment 2:16–3:39 (83 s): foragers in a mint forest; huts; skeleton x-ray with check badges; a hearts gag; world maps with a pink X. It is entered via the X3 stripe curtain and title banner.
- ADVANTAGE/DISADVANTAGE stripe cards alternate magenta and orange schemes (3:44–4:10).
- The comedic letter bit (6:39–7:50) moves to a second set (fireplace chair) and adds a diamond badge with a graph overlay beside the host.
- A kinetic-type list card (8:01) in a rounded green frame builds 3 hypotheses line by line, with highlight colours and footnote marks.
- Stock clips (burger, wheat, cattle, snail, oil rig) are about 1/3 of the non-host time.
- Credits crawl to the right of the host, then the end screen.

**vo4pMVb0R6M: Psychology #1 (2014)**
- Warm wood-panel set with framed inkblots, so the host shots are brown (#68442A / #946148). The graphic team is credited as a different studio from WH.
- A long cold open (2:11): two definition cards, an Aristotle bio card (0:59), five black question cards (1:36–1:54) with coloured keywords, then a logo build on black and an episode-title card.
- Keyword cards (PSYCHOANALYSIS, STRUCTURES, STRUCTURALISM, FUNCTIONALISM, FREE ASSOCIATE, UNCONSCIOUS MOTIVES, OBSERVABLE BEHAVIOUR, PSYCHODYNAMIC THEORIES) each use a different saturated textured field and the X4 flash dissolve.
- Animated scenes: a couch/therapist scene with icons popping in thought circles, and a diagonal split to a big caricature portrait (2:23–2:43, 3:45–4:11).
- Small book-cover icons pop in at the top-right of host shots when a book is named.
- Ends with a purple credit panel at the right, then an end screen on a purple brain-pattern field.

**QnQe0xW_JY4: Biology #1 (2012)**
- **No thought-bubble animation.** The visual explanations are hand-drawn **marker boards** on parchment and pink paper, with write-on strokes:
  - atom shells;
  - Lewis dot structures as text lists;
  - bonds drawn as overlapping shell circles;
  - an atom-headed stick-figure "character".
- The host set is a white wall with a drawn molecular network and a framed inset that changes icon per topic. Some close-ups are on a black backdrop.
- A biography bit (4:45–5:56) uses a different look: host in an armchair with a book, in front of a sepia/peach diagonal-pattern backdrop. Large white script words overlay the picture, and cursive narration text scrolls.
- Ends with a table-of-contents panel (chapter links) beside the host on black. The loudness of −20 LUFS is anomalous.

**uJA1qZirWVc: Geology #22 (2026)**
- Era comparison: **cuts/min more than doubles (10.2 vs 3.8–4.7)** and the median shot halves (4.4 s).
- Non-host time is mostly **stock footage with location pills and centred serif keywords**.
- The animated or graphic share is about 20% of runtime:
  - definition and tonnage split cards with the host inset;
  - a mineral "social-post" card collage on green felt (0:54–1:15);
  - periodic tiles on navy;
  - a cut-out world map with a dotted supply route;
  - flag stickers around the host;
  - kinetic numbers;
  - a "next time" lower-third.
- Palette is muted and earthy (colourfulness 40.7; host set forest green #3A4E47).
- Transitions are hard cuts plus torn-paper wipes; there are no stripe swipes or flash dissolves.
- Ends with split-card credits (a top-half card for patrons and merch, a bottom-half credit list), then a colourful company logo sting on cyan and navy.

**Era comparison (summary)**

| | 2012 WH | 2014 PSY | 2012 BIO | 2026 GEO |
|---|---|---|---|---|
| Insert look | Flat vector, mint/aqua | Textured saturated cards + caricature | Marker on paper | Paper collage + stock |
| Card transition | Stripe swipe (4f) | Flash dissolve (8f) | Hard cut | Hard cut / torn wipe (6–8f) |
| Overlays on host | Diamonds, hatch panel | Diamonds, book icons | Wall inset icon | Inset split cards, stickers, kinetic text, lower-third |
| Narrative segment | 83 s, named, cued in and out | 20–26 s animations, unnamed | None | None |
| Cuts/min | 4.7 | 3.8 | 4.4 | 10.2 |
| WPM | 204 | 188 | 196 | 172 |
| LUFS | −14.0 | −14.1 | −20.0 | −15.9 |

---

## 13. Source-list issues

- **`animated_frac` is wrong in both directions for CrashCourse.**
  - WH (0.67) is inflated: the pale cyan seamless set makes host shots read as "flat".
  - BIO (0.54) is inflated by the white doodle wall and black-backdrop close-ups.
  - PSY (0.17) and GEO (0.11) are closer to reality, but GEO's non-host time is mostly live stock footage.
  - Use the non-host shares in section 2 (38 / 30 / 35 / 44%) and the insert-type split instead.
- **"Thought bubble" style is not uniform.**
  - Only WH has a named, cued narrative segment.
  - PSY's graphics come from a different credited studio and look different.
  - BIO has no thought-bubble animation at all: it uses marker boards.
  - GEO is barely animated.
- **GEO (2026) is a weak example of "animated inserts".** It is a useful era contrast (collage cards, inset split screens, word-synced text) but not representative of the classic look. It is also the only one produced under the newer company branding.
- **BIO's title** ("SO SIMPLE") and its auto-generated, lowercase, unpunctuated captions make the transcript harder to segment. The cue words for graphics must be inferred from the content.
- **WPM**: `wpm_overall` and narration WPM agree within 2% here, because the host talks over the intro and outro. Unlike TED-Ed, this figure is reliable.
- **Brand-specific segments** (named animated segment, letter bit, secret-compartment gag, "Brain Fart" bio callouts, series logos) are signature IP. A skill should reproduce their *function and timing* with original names and graphics, never the names or artwork themselves.
