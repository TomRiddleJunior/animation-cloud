# UI-centric SaaS / AI product explainer: "the interface is the set"

Analysed 2026-10-27 from `frames/<id>/` (metrics, contact sheets, strips, transcripts), plus extra measurements
taken directly from the source MP4s: native-fps frame sheets (25–30 fps) for 16 transitions, and saturated-pixel
k-means colour sampling at 1 frame/s (pixels with HSV S > 35 % and V > 27 %). Claims are from the whatastory.agency
article "18 Best Animated Explainer Video Examples to Watch in 2026" (`raw/whatastory.txt`). Anything about audio
is marked *inferred*, because the audio could not be heard.

**Verdict on "one style or two":** this is **one style family with one shared staging grammar**, split into **two
sub-variants by narration mode**, not by light vs dark:

- **A: VO-led UI walkthrough** (Notion, Marvin, Synoptix, Elevate). 129–153 WPM of voice-over carries the information,
  and every clause gets one UI moment. It comes in three **skins**: A1 *Calm Workspace* (white, real-looking UI, no
  titles; Notion), A2 *Gradient AI* (white or lavender ground, kinetic headings, one glowing accent hue, hub-and-orbit
  diagrams; Synoptix, Marvin) and A3 *Dark Glow* (charcoal ground, teal/crimson corner glows, 3D-tilted dashboards;
  Elevate).
- **B: Music-led launch film** (Clay, plus Microsoft 365 Copilot as an outlier). There is no VO, and the on-screen UI
  copy (message bubbles, typed prompts, notes) is the script. The camera is more cinematic (fly-throughs, phone
  push-ins, a hyperspace tunnel, real 3D CG), and the sound design carries the energy.

The light/dark split the task suggested does not hold in the data. Elevate is dark (90 % dark frames) **with** VO, and
Copilot is light (brightness 0.87) **without** VO. Marvin uses both: a dark problem act, then a hard cut to a light
solution act. Clay alternates black app UI with white chat screens. Dark vs light is a **skin choice**, used
deliberately at act boundaries. It is not a style boundary.

Reddit (`cCnTVd9nMoY`) is **not included**: the Reddit video was not available for analysis.

---

## 1. Identity

The product interface is the set, the cast and the plot. Each video is a continuous camera ride across a rebuilt,
idealised version of the app: a blinking caret on a blank page, a sidebar cascading in, a cursor gliding on a curved
path, hovering, clicking, then a zoom into one component until it fills the frame. Hard cuts are almost absent (0–2.7
per minute). Scenes hand over through camera moves, masks and an *anchor object* that persists and transforms (a hub
icon, a stat ring, the logo mark). The palette is the most restrained in the 52-video corpus. Four of these videos are
the four least colourful of all 52 (colourfulness 14.4–19.2 vs a corpus median of 40.4), and saturated pixels cover
only 2.5–4.4 % of the frame. The look is neutral ground plus a single brand accent, which appears on the logo, the CTA,
one key word and the glow under a card. People appear only as avatars in circles, never as animated bodies. The film
ends on a still logo lock-up with a tagline and a single call to action.

## 2. Sources analysed

| id | title (uploader) | dur s | cuts/min | median shot s | motion mean / p90 | hold | colourful | sat-px share | bright / dark-frac | WPM | LUFS | sub-variant |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| oTahLEX3NXo | What is Notion? (Notion) | 154 | 2.73 | 20.18 | 5.63 / 14.83 | 0.449 | 14.4 | 0.044 | 0.93 / 0.00 | 134.0 | −16.3 | A1 Calm Workspace |
| 1L8wQqHK_u0 | Marvin AI (Burnwe, studio portfolio) | 62 | 1.93 | 4.60 | 8.05 / 19.37 | 0.094 | 19.2 | 0.026 | 0.81 / 0.11 | 152.6 | −12.8 | A2 Gradient AI (dark→light) |
| gVcyghMTrtU | Synoptix AI (What a Story) | 68 | 0.00 | 68.06 | 5.61 / 11.22 | 0.012 | 29.3 | 0.034 | 0.98 / 0.00 | 129.6 | −11.6 | A2 Gradient AI (light) |
| 2yL0LhyxOGk | "Elevate SaaS Explainer" = Membrain Elevate launch (What a Story) | 70 | 1.71 | 11.72 | 6.90 / 17.08 | 0.024 | 14.9 | 0.035 | 0.20 / 0.90 | 129.3 | −12.1 | A3 Dark Glow |
| sjRKMbmeXnw | Introducing Clay (Mesh, studio) | 90 | 1.33 | 24.02 | 6.39 / 15.24 | 0.359 | 14.5 | 0.025 | 0.26 / 0.77 | 0.7 (no VO) | −11.8 | B Music-led (dark) |
| B4mJO6F5kok | Microsoft 365 Copilot (Microsoft Copilot) | 60 | 18.98 | 2.03 | 12.03 / 30.65 | 0.053 | 30.7 | 0.071 | 0.87 / 0.00 | 33.0* | −16.0 | B outlier: 3D CG brand spot |

\* Copilot's 33 "WPM" are auto-captions of **song vocals** (the transcript is song lyrics).
The effective VO rate is 0, and the script is on-screen prompt text.
All sources are 1280×720. Marvin is 25 fps, Clay 29.97 fps, the rest 30 fps. `animated_frac` is 0.88–1.0 for all
of them. Copilot's 0.88 is photoreal 3D CG with depth of field, not live action (`animated.jpg` confirms it is all CG).

**What the detected "cuts" really are:** Notion's 7 are UI-state swaps on a click. Marvin's 2 are real cuts (into a
calendar stack at 4.6 s, and dark→light at 9.1 s). Elevate's 2 are **3D card flips** (56.8 s, 58.3 s), not cuts.
Clay's 2 are one cut to black at 24.0 s and a hyperspace-tunnel transition at 73.9 s. Synoptix has none. Only Copilot
is actually edited, with 20 shots.

## 3. Measured pacing

| quantity | A (VO walkthrough) | B (music-led) | what it means in practice |
|---|---|---|---|
| duration | 60–75 s (ad); 150 s for a "What is X?" long form | 60–90 s | the long form adds features, not slower pacing |
| hard cuts | 0–3 / min; first cut usually > 8 s | Clay 1.3 / min; Copilot 19 / min | a "shot" is a continuous camera ride of 5–25 s (median 4.6–24 s); cut only at act changes |
| motion mean / p90 | 5.6–8.0 / 11–19 | 6.4 / 15 (Clay); 12 / 31 (Copilot) | calm to moderate: short 0.3–0.7 s moves between readable states |
| hold_frac | A1: 0.30–0.45 (Notion 0.449, 2nd highest of 52); A2/A3: 0.01–0.10 | Clay 0.36 | A1 lets UI sit still while the VO finishes a clause; A2/A3 never fully stop (drift, breathing glows, rotating ring gradients) |
| colourfulness | 14–20 (Synoptix 29 because of its periwinkle wash) | 14.5 (Clay); 31 (Copilot) | neutral ground plus one accent family |
| saturated-pixel share | 2.6–4.4 % | 2.5 % (Clay); 7.1 % (Copilot) | **rule: ≤ 4.5 % of the frame may be saturated** |
| WPM | 129–153; VO runs ~95 % of runtime | 0 | the VO starts in the first 0.3–0.8 s; text-as-script in B |
| loudness | −11.6 to −16.3 LUFS (agency cuts −11.6/−12.1; Notion −16.3) | −11.8 / −16.0 | mix to −14 LUFS integrated as a middle target |
| last-decile motion | 1.7–5.6 | 1.9 (Clay); 9.0 (Copilot) | the end card is a near-still hold of ≥ 3 s |

**Energy curves** (`motion_curve_deciles`):
- Marvin is front-loaded (16.7 → 10.6 in the first 20 %: the dark problem montage is the busiest part).
- Elevate builds (2.1 at the start, rising to 10–13 at 60–90 %, where the product tour is busiest).
- Notion spikes once at 30–40 % (12.6, during the database-view switching and drag-and-drop) and is otherwise flat (1.6–8).
- Copilot crescendos at 80–90 % (20.6, the app-icon montage).
- Every video calms in its final 10 %.

Rule for A: open at moderate energy, peak at 60–85 %, then settle onto the logo.

## 4. Script & narrative structure

### Beat map, variant A (normalised to runtime; seconds are for a 65-s spot)

| % of runtime | 65-s spot | beat | evidence |
|---|---|---|---|
| 0–12 % | 0–8 s | **Hook.** One of three patterns: (a) pain as questions ("are you struggling with declining sales", Marvin); (b) a shocking stat ("81% of companies struggle with sales productivity", Elevate); (c) a contrarian line, "Not all AI is built equal." (Synoptix). Notion's long form uses (d) an aspiration, "we all crave clarity". The visuals are kinetic data (declining chart, stat ring, typed keyword) or an empty canvas, and the product name is not shown yet. | Marvin 0–7 s, Elevate 0–23 s, Synoptix 0–8 s, Notion 0–11 s |
| 12–18 % (Elevate: 33 %) | 8–12 s | **Name reveal.** A logo lock-up with a 3–4-word tagline, then a hard switch into the product world. | Marvin logo 7.4 s (12 %), Synoptix 8.2 s (12 %), Elevate 23.4 s (33 %); Notion names the product verbally at 11.4 s and shows no logo until the end |
| 18–80 % | 12–52 s | **Feature run.** 4–7 features in a 60–75 s spot (~15 in Notion's 154 s). Each is 5–9 s (Marvin ~10 s) and gets one heading or VO clause, one hero UI state and one micro-interaction (click, type, count-up, drag). | chapters: Marvin 5, Synoptix 5, Elevate 4 |
| 80–90 % | 52–59 s | **Proof / payoff.** Social-proof logos orbiting the app icon (Marvin), partner and model logos (Synoptix), or an emotional line ("Growth begins with your People", Elevate). Notion puts its **problem** statement here: an illustration of people juggling ten tool names, then a calm resolution. | Marvin 50–54 s, Elevate 61–64 s, Notion 2:16–2:28 |
| 90–100 % | 59–65 s | **End card.** Logo, tagline, one CTA (a pill button clicked by the cursor, or a URL in the accent colour), held 3–7 s. | all |

### Beat map, variant B (Clay 90 s; Copilot 60 s)

| % | beat |
|---|---|
| 0–8 % | **Cinematic metaphor without words.** Clay shows glass bubbles holding social-network glyphs and contact photos drifting through a nebula ("your network is scattered"). Copilot shows a 3D desk with a typed prompt chip, "Hey Copilot, what have you been up to…" |
| 8–12 % | Logo (Clay assembles it from stroke fragments at 7–8 s) **or** stat slams (Copilot 3–9 s: "2x faster responses", "70% of the Fortune 500") |
| 12–90 % | **Chapters driven by on-screen user text**, 8–15 s each. Clay runs one mini-story (a friend moves to New York; the user notices, messages, notes a reminder, searches, attends a party, forms a group), and each story step introduces a feature. Copilot runs 5 prompts ("can you prioritize my inbox?", "make this presentation", "helping my team with some research?", "delegate this task", "turn this business process into an agent?"), each answered by a UI panel. |
| 90–100 % | A short tagline alone (Clay: a serif line, "It's who you know.", held 1.5 s on black), then logo + URL + "Available for iOS, Mac and Web". Copilot: the product mark on white, then the corporate logo. |

### Hand-over devices (instead of cuts)

1. **Click-to-swap.** In Notion the VO clause boundary arrives as a cursor click, and the page content hard-swaps
   with a 6–10-frame upward settle drift (the 7 detected cuts).
2. **Anchor-object morph.** A persistent element survives the scene change and transforms. Elevate's dark stat card
   turns from a ring into a B&W portrait at 5.5 s. Marvin's gradient app icon appears in nearly every solution scene.
   Synoptix's "AI" badge becomes a skyline building, and the logo icon tumbles in 3D and lands on top of an isometric
   server stack.
3. **Camera zoom between levels**: page ↔ window ↔ desktop (Notion), phone ↔ screen (Clay).
4. **Mask transitions**: an iris onto an avatar (Notion), a logo-silhouette matte (Synoptix), a blob/glow wipe
   (Elevate), a hyperspace tunnel (Clay).
5. **Light/dark inversion at the problem → solution boundary**: Marvin hard-cuts from a dark aubergine ground to
   white at 9.1 s. Elevate flips to white cards at 56 s for the final "act" beat.

### Feature enumeration patterns

- **Parallel VO lists, one UI state per item** (Notion): "capture your thoughts / manage your projects / run an
  entire company". Each noun lands on its own page about 2.5–3 s apart.
- **Typed heading + hero card** (Marvin): "Simplify & Structure Your Business Problems" is typed above a white card.
- **Hub-and-orbit** (Synoptix, Marvin): the product icon sits at the centre, and integrations, personas or LLM
  providers ride an elliptical orbit with connector lines.
- **Labels in 3D space** (Elevate): small light captions ("See Performance at a Glance") decode beside tilted
  dashboards.
- **Story-first** (Clay): features appear when the protagonist needs them.
- **Prompt-as-chapter-title** (Copilot).

## 5. Visual system

### Palette roles per skin (M = measured k-means / saturated-pixel sampling; E = eyeballed from frames)

| role | A1 Calm Workspace (Notion) | A2 Gradient AI, light (Synoptix) | A2 Gradient AI, iridescent (Marvin) | A3 Dark Glow (Elevate) | B dark app (Clay) | B 3D brand (Copilot) |
|---|---|---|---|---|---|---|
| background | #FCFCFC (70 %) M | #FCFCFD (59 %) M | #F2F1F2 / #F5F5F5 M; problem act #150F14 M | #151619 (55 %) M | #000000 / #0A080D M | #E7DFDC / #F0EBE9 M |
| secondary surface | sidebar #F2F0ED M; page #FFFFFF | wash #F0F5FB, #E1EDFA M | card #FFFFFF E | card #303538, #1D2628 M | nebula #18131E M; chat screens white → #EAF3FB E | #DBCFCD, #C8B4BA M |
| primary accent | none: multicolour emoji icons, small | #2A6FF3 M | magenta #E71BED M | teal #46AF98 / #367D73 M | link/bubble blue #4CA9EA M | lavender #996ECC M |
| secondary accent | stage blue #54A3C7 (desktop backdrop) M | indigo #585AE7, sky #89B0EF M | orchid #E280F0, coral #E99082 M | crimson #D8216D, wine #5F2537 M | sky #78C2F1, navy #2B3157 M | coral #CD8073, plum #6C3781 M |
| glow / gradient | none | periwinkle #CCD8F4 corner washes M | magenta→coral→cyan chromatic glow under cards E | huge blurred corner blobs: teal #225751, wine #5F2537 M | white bloom behind the logo E | violet→blue→peach silk ribbons E |
| shadow | 0 20 60 rgba(0,0,0,.12) under the window E | soft blue 0 24 60 rgba(42,111,243,.12) E | coloured glow instead of grey shadow E | none (dark on dark) | none | photoreal DOF |
| text | #2C2B2B M; muted #AEABA8 M | #111827 E; key word #2A6FF3 | #150F14 E; muted #9C9AA5 E | #F1F1F4 M; muted #9C9496 M | #EBEFF2 M | #3A3A3A E on frosted chips |
| highlight / CTA | hover row #EFEEEC E | filled CTA pill #2A6FF3 | white pill with a rainbow glow under it | URL #D8216D | none | none |

**Colour rules (all skins):**
- Neutral ground covers ≥ 90 % of pixels.
- A single accent family (one hue, or one gradient run) takes 2.5–4.5 % of the frame.
- Accent goes on the logo, the CTA, the key word of a heading, the progress strokes and the glow under the hero card.
- Never fill a full frame with saturated colour. The only exceptions are the 0.2-s logo-matte wipe flash (Synoptix)
  and the blob-wipe peak (Elevate), both of which pass through an accent wash for ≤ 10 frames.

### Shape language

- Rounded rectangles everywhere: cards r = 16–24 px at 1080p, chips/pills fully rounded, app-icon tiles r ≈ 22 % of
  their side.
- Circles for avatars (white 4–6 px ring plus soft shadow), stat rings and orbit paths.
- No outlines on cards; separation comes from fill contrast and soft shadow or glow.
- Hairlines: dividers 1–2 px (#E9E9E7 light / #3A3D42 dark).
- Connector lines 2 px in #C9D3EA (light skin), with 8–10 px dot nodes and right-angle elbows of 12–16 px radius
  (Synoptix workflow graphs).
- Stat rings: 8–10 px stroke at 1080p, round caps, gradient stroke (crimson→teal in Elevate), with the gradient
  continuously rotating at about 55°/s.

### Line work and texture

Clean digital throughout: no grain, no paper, no line boil. Notion's illustrations are single-weight black ink lines
(~3–4 px at 1080p) with no fill except white. They appear only as accent moments (avatar heads, a closing group
illustration). On dark skins, add a 1.5–2 % monochrome noise layer **only** to prevent banding in the big blurred
glows. It must be invisible as texture.

### Lighting and depth

- **A1**: flat. A single soft drop shadow under the app window when zoomed out; the desktop backdrop is a flat blue.
  Depth comes from scale only (the camera zooms; nothing tilts).
- **A2**:
  - corner gradient washes (two radial blobs, ~60 % of frame width, 120–160 px blur);
  - chromatic glows under hero objects (Marvin);
  - isometric illustration plates at true 30° iso (Synoptix server stack, skyline);
  - UI panels shown in mild 3D, about rotateX 8–12° and rotateY −10 to −14°.
- **A3**:
  - two or three blurred corner glows (teal bottom-left, crimson top-right) on #151619;
  - spotlight cones from the top corners on the title and end cards;
  - dashboards on steep 3D planes (≈ rotateX 45–50°, rotateZ −14 to −16°) that bleed off the frame edges;
  - photo cards floating at different z-depths.
- **B**: real 3D (Copilot: photoreal CG with shallow DOF, glass, frosted panels). Clay fakes it with a photographic
  nebula, glass spheres and a starfield fly-through.

### Composition

- **Zoomed UI**: the camera sits 2–3× into the native UI, so body text reads 45–65 px tall at 1080p. One component
  fills 60–90 % of the frame and its neighbours bleed off the edges.
- **Context shots**: the app window at ~75 % frame width, centred, with 12 % side margins.
- **Statement beats**: centred, one line, with ≥ 50 % negative space.
- **Stat beats** (A3): the card in the left third and its text in the right third, vertically centred.
- **Hub diagrams**: the hub dead-centre, satellites on an ellipse spanning about 70 % × 45 % of the frame.

### Typography (free look-alikes; sizes at 1080p)

| use | look-alike | weight | size | case / behaviour |
|---|---|---|---|---|
| UI content (all) | Inter (Notion, Clay), Lato/Nunito Sans (Synoptix), DM Sans/Manrope (Marvin) | 400 body / 600–700 headings | body 45–65 px when zoomed; page titles 2.2× body | real UI copy with plausible fake data |
| kinetic statement (A2) | Lato / Nunito Sans | 500, key word 700 | 90–100 px line; key word 150–160 px (1.6×) in the accent colour | sentence case, one line, word-by-word, line re-centres |
| feature heading (A2 Marvin) | DM Sans | 600 | 52–60 px, with a 22–26 px muted sub-label | Title Case, typed at ~22–25 characters/s |
| A3 captions | Lato Light | 300 | 40–50 px statements, 18–22 px teal sub-labels | random-letter decode |
| A3 title card | Lato | 400 | 130–150 px, tagline 36 px light, words revealed one by one with full stops ("See. Coach. Grow") | |
| B prompt chip (Copilot) | Selawik / Open Sans | 400 | 44–48 px on a frosted chip (white 70 %, r = 8 px) | typed at ~20 characters/s |
| B tagline (Clay) | Newsreader / Source Serif 4 | 400 | ~56 px | sentence case, alone on black |
| A1 | — | — | — | **no titles at all**: the only on-screen text is UI content plus the final logo |

## 6. Characters & objects

- **No animated humans.** People appear as:
  - (a) circular avatar photos with a white ring (Elevate, Marvin, Synoptix, Clay), popping in with a back-out
    overshoot and sometimes trailing a comet streak (Elevate 12–13 s);
  - (b) one B&W stock portrait inside a dark card with a quote (Elevate's "sales leader");
  - (c) single-weight ink-line portrait heads in white discs, plus one closing group illustration (Notion). Build
    original faces; do not copy Notion's illustration style one-to-one.
- **The cursor is the protagonist.**
  - A1: the standard black OS arrow, with row hover highlights.
  - A2 (Synoptix): a brand-blue filled arrow with a soft shadow.
  - A3 (Elevate): a black arrow with a white outline.
  - Copilot: a gradient Copilot-style arrow.
  - Clay (mobile): no cursor at all. Rows highlight and text edits itself.
- **Recurring props:**
  - app-icon tile (glassy rounded square, gradient glyph, coloured glow behind);
  - stat ring with a counter;
  - declining or rising line/area chart (neon gradient stroke on dark, area fill fading to transparent);
  - calendar cards in a diagonal stack (time passing);
  - messy file folders (inefficiency);
  - an X-dial (failure);
  - glass bubbles holding brand glyphs (scattered network);
  - isometric server stacks / cubes (security, infrastructure);
  - glass tiles (Copilot);
  - integration and LLM logos on orbits. For original work, replace third-party logos with generic glyphs.
- **Icon style.** Emoji in real UI (A1). Line icons inside 40–48 px rounded colour squares (A2). Isometric
  blue-gradient blocks (A2 Synoptix). Glass 3D tiles (B).
- **UI construction.** Every source rebuilds or recomposites the UI rather than showing a raw screen recording.
  - Notion looks pixel-faithful, but list rows arrive with directional motion blur and staggers, layouts tween
    smoothly when content is inserted, and the cursor glides on bezier curves. All of that is composited animation of
    design files.
  - Marvin, Elevate and Synoptix use simplified vector mock-ups with greeked small text and believable large data.
  - Clay blows real app screens up to full frame and animates text edits (strike-through "San Francisco" → highlighted
    "New York City").
  - Copilot texture-maps real UI onto glass panels in 3D.

## 7. Camera & transitions catalogue

Durations are in frames at 30 fps, measured from native-fps sheets.

| # | transition | build, frame by frame | duration | easing | where / how often |
|---|---|---|---|---|---|
| T1 | **Caret open** | white frame, then a 2 px caret blinks (on 16 f / off 16 f) twice, then content builds | 1.0–1.6 s | — | Notion open **and** close (bookend) |
| T2 | **Cascade list build** | rows enter diagonally from (+220 px x, −60 px y) with horizontal motion blur that decays to sharp; the lower the row, the later it starts (diagonal wedge shape) | 10–12 f per row, 2-f stagger, whole list ~20 f | power3.out | Notion sidebar; any list or menu |
| T3 | **Click-to-swap** | cursor click, then hard swap of the page content; the new page drifts up 20–40 px | 0 f swap + 8–10 f settle | power2.out | Notion, ~7× in 154 s |
| T4 | **Zoom page ↔ window** | the camera scales 2.6× → 0.95× around the window centre; the window frame and its drop shadow come into view; slow push continues afterwards (+1–3 % per 2 s) | 16–20 f | power2.inOut (near-static first 8 f, fastest at mid) | Notion ×5; Clay screen ↔ phone (30 f) |
| T5 | **Iris onto an element** | circular clip shrinks from full frame to a 0-radius point, off-centre (13–15 f); the point re-expands as an avatar disc 0 → 1 with overshoot (3–4 f); hold ~1 s; then 15 more avatars pop with 2–3-f stagger | ~1.6 s total | power2.in, then back.out(2.2) | Notion 13.4–15.2 s |
| T6 | **Logo-matte zoom** | two accent triangles slide in from the top-right and bottom-left corners (4–5 f); they are the two halves of the logo mark at ~5× scale, and the old scene stays visible through the mark's counter; the mark shrinks 5× → 1× onto white while the old scene inside fades | ~20 f (4 in + 12 shrink + 4 settle) | power2.in → expo.out | Synoptix ×2 (logo reveal and end card) |
| T7 | **Blob / glow wipe** | the content fades and blurs (8 f) as a teal radial glow grows from a corner to fill the frame; full-frame teal–mauve wash holds 10 f; it darkens and recedes over ~12 f while the next element (ring + counter) fades up | ~30 f | power2.in / power2.out | Elevate ×2 (act break, end card) |
| T8 | **Anchor morph in a card** | a card keeps its position and size while its content crossfades (ring → portrait) and the card glides from centre to left third | 12–15 f | power2.inOut | Elevate, Marvin |
| T9 | **Tilt-up into a 3D plane** | the title card scrolls up out of frame (10 f) while a dashboard on a 45°-tilted plane rises from below; its counters count 0 → value over 27–36 f; then slow diagonal drift (~20 px/s) | 10 f + 27–36 f count | power2.out | Elevate ×3 |
| T10 | **3D card flip** | a light card in perspective (rotateX ~30°, rotateZ −12°) rotates 0 → 90° on Y (4–5 f), content swaps, then −90 → 0 (6–8 f); cursor follows | 10–13 f | power2.in / back.out(1.2) | Elevate 56–58 s (detected as 2 "cuts") |
| T11 | **Panel unfold** | the UI panel starts as a thin bar (scaleY 0.1, rotateX ~75°) and unfolds to rotateX 10°, rotateY −12° while rising, then keeps rotating 3–5° toward frontal over 2–3 s | 15 f + drift | power3.out | Synoptix chat, dashboards |
| T12 | **Hub-and-orbit build** | the hub icon pops (back.out); a thin elliptical orbit path draws (stroke-dashoffset, 15 f); satellites pop along it with 3-f stagger, then idle-orbit at ~6–10°/s; connector lines draw from hub to satellites | 1.2–1.8 s | back.out(1.7), sine idle | Synoptix ×3, Marvin ×2 |
| T13 | **Speed-burst zoom-through** | radial streak lines (60–80, 2–6 px) and tumbling 3D cubes fly outward; the central badge shrinks; streaks fade | ~30 f | expo.out | Synoptix 4–5 s |
| T14 | **Card-stack drop** | a new card drops from y −200 px into the front slot (5 f) and older cards shift one slot back diagonally (−40 px x, +40 px y, −15 % brightness); one card every 0.5 s | 5 f per card | expo.out | Marvin calendar (time passing) |
| T15 | **Problem → solution hard cut with inversion** | cut from a dark ground to white; the new scene is already mid-animation (typing "Loading…") | 0 f | — | Marvin 9.1 s |
| T16 | **Logo glint** | the logo appears overexposed with bloom (glow 3× → 1× over 8 f); a 4-point sparkle shrinks into a letter detail | 8–10 f | expo.out | Marvin 7.2–7.6 s |
| T17 | **Glyph assembly** | logo letters built from 3–6 stroke fragments each, sliding in from random offsets with 1–2-f staggers, bloom behind; then the camera pulls back to reveal the logo is on a phone screen (T4) | ~30 f + 30 f | power3.out | Clay 7–9 s |
| T18 | **Confetti + hyperspace tunnel** | a confetti burst (~400 accent-colour paper bits) fills the chat screen and lingers ~0.5 s; then a radial zoom blur stretches the screen into streaks toward the camera (6 f); black with red streaks (6 f), collapsing to a single red dot (+6 f) that becomes the next scene's anchor | ~0.5 s + 18 f | expo.in | Clay 73.2–74.2 s |
| T19 | **Emoji pivot** | an emoji in a message bubble flies to the centre as the UI fades to black, then rotates slowly alone on black (a "noun" beat) | 6–8 f | power2.out | Clay ×3 (wine glass, statue, magnifier) |
| T20 | **Blur-type slam** | hard cut into a stat line at ~4× scale, heavily motion-blurred and sweeping right-to-left; scale, blur and sweep resolve to sharp centred text | 10–12 f | expo.out | Copilot ×3 |
| T21 | **Beat-cut montage** | hard cuts every ~2.0 s median (p10 0.7 s, p90 6.5 s), plausibly one per musical bar (*inferred*) | — | — | Copilot only |

Camera rules:
- The camera is a 2D scale/translate rig in A1. A2 adds mild 3D on individual panels. A3 and B add real perspective
  planes.
- A camera move never rotates the frame (no roll).
- Between moves the camera keeps drifting:
  - A1: 0–2 % scale per 2 s, or fully static (holds of 1.5–3 s);
  - A2/A3: always drifting (hold_frac 0.01–0.10), with 10–25 px/s translation or 2–5° of slow panel rotation.

## 8. Motion grammar

- **Easing families**:
  - power2.inOut for camera moves;
  - power3.out / expo.out for elements entering;
  - back.out(1.7–2.2) for anything circular that pops (avatars, icons, hubs);
  - power2.in for exits and mask closings;
  - linear only for continuous idles (ring-gradient rotation, orbit drift).
- **Overshoot**: only on pops (avatars, app icons, CTA pill), 6–10 % overshoot settling in 4–6 frames. Cards and
  panels never overshoot. They decelerate (expo.out).
- **Staggers**:
  - list rows 2 f;
  - avatars 2–3 f;
  - orbit satellites 3 f;
  - typewriter characters 1/22 s (≈ 1.4 f);
  - decoded letters spread randomly over 12–15 f;
  - kinetic words: one per spoken word (≈ 0.25–0.4 s apart).
- **Build order**: container → structure (rows or axes) → content (text or data) → cursor enters → interaction →
  result (count-up, check mark, "Note saved" chip, 1.2 s).
- **Text behaviours**:
  - *typewriter* with caret (Marvin headings, Copilot prompts, Synoptix chat prompt, Clay notes), ~20–25 chars/s;
  - *word-by-word rise* (Synoptix): each word goes y +12 px → 0 with opacity 0 → 1 over 5–6 f. The whole line slides
    (8 f, with slight motion blur) to stay centred as it grows, and the key word's letters track in from wide spacing;
  - *random-letter decode* (Elevate);
  - *strike-through then retype* for data updates (Clay);
  - counters: power2.out over 1.0–1.5 s with the ring stroke synchronised. The "%" sign fades in after the number lands.
- **Idle and secondary motion**:
  - ring gradients rotate at ~55°/s;
  - glow blobs breathe (scale 1 ↔ 1.08, 6 s, sine.inOut);
  - orbit satellites drift;
  - the caret blinks at 530 ms;
  - after a typed prompt, a 3-dot typing indicator pulses (Clay).
- **Holds**: A1 holds each UI state 1.5–3 s after the interaction resolves (hold_frac 0.45). A2/A3 replace holds with
  drift. Every film holds its end card ≥ 3 s.
- **Rhythm against narration**:
  - UI changes land **on the stressed noun of the VO clause**. In Notion, "manage your projects" (25.4 s) → the board
    view is on screen by 26.1 s, and "run an entire company" (28.2 s) → the department pages by 29.4 s.
  - Marvin types the spoken keyword in sync with the VO ("Declining Sales" at 0.4 s, "Inefficiency" at 2.0 s, "Scaling
    Challenges" at 3.5 s).
  - Synoptix and Elevate show keywords within about ±0.5 s of being spoken.
  - Leave a 0.4–0.8 s VO breath at each feature boundary for the transition.
- **Music-led (B)**: transitions land on musical accents (*inferred*). The confetti/tunnel and logo assembly are
  clearly built as hit-points.

## 9. Sound (all *inferred*: audio not heard)

| | A1 Calm | A2 Gradient AI | A3 Dark Glow | B Music-led |
|---|---|---|---|---|
| VO | unhurried, warm, conversational, 134 WPM, with short pauses between list items (transcript cadence) | brisk ad read, 150–153 WPM (Marvin) or measured 130 WPM with dramatic pauses ("built for… you", Synoptix) | measured, stat-heavy, 129 WPM | none; Copilot uses a song with vocal chops |
| Kokoro suggestion | `af_heart` or `bf_emma`, speed 0.92–0.95 | `am_michael` / `af_bella` at 1.05 (fast) or `am_adam` at 0.95 (measured) | `bm_george` / `am_adam` at 0.95 | — |
| music | soft piano / marimba plucks, 85–95 BPM, low in the mix ("[Music]" tag at 0.4 s) | bright corporate electronic, 100–120 BPM, risers into the logo reveal and the CTA | dark cinematic synth pulses and sub hits, 90–110 BPM | Clay: ambient space pad → dramatic build → upbeat electronic; Copilot: electro-pop with vocal chops ~118–125 BPM (2.0-s median shot ≈ 1 bar) |
| SFX | soft UI clicks on every cursor click, a page-turn whoosh on zooms | click, soft whoosh per camera move, sparkle chime on the logo glint, typing ticks | low whoosh on blob wipes, counter ticks, deep hit on the logo | whooshes on fly-throughs, a confetti pop, a tunnel whoosh-boom, message send/receive blips |
| SFX density | ~1 per 4–6 s | ~1 per 2–3 s | ~1 per 3 s | ~1 per 1.5–2 s |
| ducking | music −14 to −18 dB under VO | −10 to −14 dB | −12 dB | none (music is the lead) |
| loudness | −16 LUFS (measured −16.3) | −12 to −13 (measured −11.6 / −12.8) | −12 (measured −12.1) | −12 (Clay −11.8), −16 (Copilot) |

## 10. Do / Don't

**Do**
1. Make the product UI the hero of ≥ 70 % of frames, and invent an original product, UI and data.
2. Rebuild the UI as SVG/HTML components at full resolution and shoot them 2–3× zoomed, so body text reads 45–65 px.
3. Keep ≥ 90 % of pixels neutral and cap saturated pixels at ≈ 4.5 %. Spend the accent on the logo, CTA, key word,
   progress strokes and the glow under the hero card.
4. Move between scenes with camera moves, masks and an anchor object that persists and transforms. Allow ≤ 3 hard
   cuts per minute (variant A and Clay-type B).
5. Choreograph the cursor: curved bezier paths of 0.5–0.8 s (power2.inOut), a hover state 4–6 f before the click, a
   2–3-f click squash (scale 0.86) plus a 12-f ripple ring.
6. Land each UI change on the stressed noun of the VO clause, and type spoken keywords on screen as they are said
   (A2).
7. Enumerate features with parallel structure: one feature = one hero UI state + one micro-interaction, 5–9 s.
8. Bookend the film with the same device at the open and the close (blank caret, falling → rising chart, the same
   logo-matte wipe, the same gradient title card).
9. Show stats as counters with rings or charts that build over 1.0–1.5 s with power2.out, the unit appearing last.
10. End on logo + 3–4-word tagline + one CTA, held ≥ 3 s with near-zero motion.
11. In dark skins, use 2–3 huge blurred corner glows that breathe slowly, and put dashboards on steep 3D planes that
    bleed off the frame.
12. Flip light/dark only at an act boundary (problem → solution, or the final call to act).

**Don't**
1. Don't use raw screen recordings (scroll jank, OS chrome, 12-px unreadable text, linear cursor jumps).
2. Don't fill frames with saturated colour, rainbow palettes or multiple competing accents (corpus-median
   colourfulness 40 is too loud for this style; stay at 14–30).
3. Don't animate full-body characters, rigs or walk cycles. People are avatars in circles or, at most, a static ink
   illustration.
4. Don't use whip pans, glitches, RGB split, camera shake or frame roll.
5. Don't caption every VO line. A1 has no titles; A2 has one heading per feature; A3 has short captions only.
6. Don't cut on every sentence. A cut must mean an act change.
7. Don't reveal more than one new UI region at a time. Isolate a single component with the camera.
8. Don't put strokes or outlines on cards, and don't use shadows darker than ~15 % opacity.
9. Don't add grain, paper or texture overlays. The look is clean digital (dark skins may use invisible anti-banding
   noise only).
10. Don't let the cursor move linearly or at constant speed, and don't use the OS cursor in brand-tinted A2 skins.
11. Don't copy the sources' logos, mascots, UI, illustration style or third-party brand marks on orbits. Use generic
    glyphs.
12. Don't exceed ~155 WPM or fill 100 % of the runtime with VO. Leave 0.4–0.8 s breaths for transitions, and don't
    let the end card carry VO for more than one short line.

## 11. Replication recipe (code)

### Layer stack (bottom → top), 1920×1080, 30 fps, GSAP timeline paused and seeked per frame

1. `bg`: a solid ground, plus 2–3 radial-gradient blobs (A2/A3) with `filter: blur(140px)`, breathing on a 6-s
   sine.inOut yoyo.
2. `backdrop`: optional plate (desktop blue for A1 context shots; nebula/starfield canvas for B; isometric SVG plate
   for A2).
3. `world`: the camera group, `transform-origin: 0 0`. It holds all UI, laid out at native scale on a large canvas
   (e.g. 5000×3000), so the camera can fly between components.
4. `planes`: individual 3D panels inside the world (`perspective: 1800px` on their parent, `transform-style:
   preserve-3d`).
5. `fx`: masks and wipes (iris clip-path, logo matte, blob, streaks, confetti).
6. `cursor`: in screen space (not inside `world`), so zooms do not scale it. Its target positions are converted from
   world to screen coordinates.
7. `type`: kinetic headings and captions in screen space.
8. `endcard`.

### Core helpers (pseudo-code)

```js
const W = 1920, H = 1080, FPS = 30;
const tl = gsap.timeline({ paused: true });            // renderer: for f in frames -> tl.seek(f / FPS); screenshot

// Camera: centre element `el` (world coords) at zoom `s`
function focus(el, s, at, dur = 0.6, ease = 'power2.inOut') {
  const r = worldRect(el);                               // x, y, w, h in world units
  tl.to(world, { scale: s, x: W/2 - (r.x + r.w/2)*s, y: H/2 - (r.y + r.h/2)*s, duration: dur, ease }, at);
  tl.to(world, { scale: `*=1.02`, duration: 2.0, ease: 'none' }, `>`); // slow push after landing (A1: omit for a true hold)
}

// Cursor: curved path, hover, click squash + ripple
function click(target, at) {
  const p = toScreen(target);
  tl.to(cursor, { motionPath: { path: [mid(cursorPos, p, 0.35, -60), p], curviness: 1.25 },
                  duration: 0.65, ease: 'power2.inOut' }, at)
    .to(target, { backgroundColor: '#EFEEEC', duration: 4/FPS }, '>-0.15')        // hover lands before click
    .to(cursor, { scale: 0.86, duration: 2/FPS, yoyo: true, repeat: 1 })
    .fromTo(ripple, { scale: 0, opacity: 0.45, x: p.x, y: p.y },
                    { scale: 1, opacity: 0, duration: 12/FPS, ease: 'power1.out' }, '<');
}

// T2 cascade list: directional blur via anisotropic SVG blur (stdDeviation "X 0")
tl.from(rows, { x: 220, y: -60, opacity: 0, duration: 11/FPS, ease: 'power3.out', stagger: 2/FPS }, 'sidebar');
tl.fromTo(rowBlur, { attr: { stdDeviation: '14 0' } }, { attr: { stdDeviation: '0 0' }, duration: 11/FPS }, 'sidebar');

// Typewriter (Marvin/Copilot/Clay) and decode (Elevate)
const typeOn = (chars, at, cps = 22) => tl.to(chars, { opacity: 1, duration: 0.001, stagger: 1/cps }, at);
const decode = (chars, at) => tl.to(chars, { opacity: 1, duration: 4/FPS, stagger: { each: 0.03, from: 'random' } }, at);

// Counter + ring
function countUp(numEl, ringEl, to, at) {
  const o = { v: 0 }, C = 2*Math.PI*ringEl.r.baseVal.value;
  tl.to(o, { v: to, duration: 1.2, ease: 'power2.out', onUpdate: () => {
      numEl.textContent = Math.round(o.v); ringEl.style.strokeDashoffset = C*(1 - o.v/100); } }, at)
    .from(pctSign, { opacity: 0, duration: 6/FPS }, '>-0.1');
}
```

### Recipes for looks and effects

- **Glass/white card with chromatic glow (A2 Marvin)**: `background:#fff; border-radius:20px; box-shadow:0 24px
  60px rgba(30,40,90,.10)`, plus a pseudo-element under it (`inset:auto 8% -18px 8%; height:44px;
  background:linear-gradient(90deg,#E71BED,#E99082,#41ACAE); filter:blur(30px); opacity:.55`).
- **Frosted panel (B Copilot-like)**: `background:rgba(255,255,255,.62); backdrop-filter:blur(24px) saturate(1.2);
  border:1px solid rgba(255,255,255,.7)`.
- **Dark-glow ground (A3)**: `#151619`, with `.blob{width:1100px;height:1100px;border-radius:50%;filter:blur(160px);
  opacity:.55}`; teal `#225751` at bottom-left (−300, +500 px off-frame) and wine `#5F2537` at top-right. Spotlight
  cones are conic or linear gradients from the top corners at 25 % opacity. Add 2 % feTurbulence noise
  (`baseFrequency .9`, `numOctaves 2`) at `opacity:.02` to stop banding.
- **Iris (T5)**: `clip-path: circle(R at cx cy)` with R animated from `hypot(W,H)` to 0 over 14 f (power2.in). Then
  the avatar group `scale 0→1, back.out(2.2), 4 f` at (cx, cy).
- **Logo-matte zoom (T6)**: an SVG `<mask>` (white full-frame rect, the logo mark's inner window in black) on a white
  plate above the old scene, so the old scene shows only through the window. The logo halves are layered on top. Tween
  the group `scale 5 → 1` (12 f, expo.out) after the halves slide in (4 f, power2.in); fade the old scene to 0 by f+16.
- **Blob wipe (T7)**: the teal blob goes `scale 1 → 6, x/y → centre` (8 f, power2.in) while the old scene goes
  `opacity → 0, blur 12px` (8 f). Hold 10 f, then the blob goes `scale → 1.2` back to its corner (12 f, power2.out)
  while the new scene fades in.
- **3D dashboard plane (A3)**: parent `perspective:1800px`; plane `transform: rotateX(48deg) rotateZ(-16deg)`; drift
  `x -=40, y -=20` over 2 s (linear).
- **Panel unfold (T11)**: `from {rotateX:75, scaleY:.1, y:+120, opacity:0}` → `{rotateX:10, rotateY:-12, scaleY:1,
  y:0}` in 15 f (power3.out), then to `{rotateX:5, rotateY:-6}` over 3 s (sine.inOut).
- **Speed burst / tunnel (T13, T18)**: a canvas of 80 radial segments whose inner radius grows and length stretches
  with velocity (expo); for the tunnel, also scale the old screen 1 → 6 with a radial zoom blur (simulate with 6
  stacked copies at increasing scale and decreasing opacity).
- **Motion blur**: frame-by-frame rendering has no shutter. For fast segments (T2, T4 mid-section, T6, T20), render 5
  sub-frames across a 180° shutter (t, t + 0.25/FPS, …) and average them, or use anisotropic SVG blur on the moving
  element.

### Minimal scene skeleton (variant A2, 65 s)

```js
// 0.0  hook: kinetic statement, word-synced to VO timestamps from Kokoro
words.forEach((w, i) => tl.from(w, { y: 12, opacity: 0, duration: 5/FPS, ease: 'power3.out' }, vo.t[i]));
tl.to(line, { x: () => recentreX(line), duration: 8/FPS, ease: 'power2.out' }, vo.t[2]);   // line re-centres
keyWord && tl.from(keyWord, { letterSpacing: '0.4em', scale: 0.8, color: '#9DB8F5', duration: 10/FPS }, vo.t[2]);
// 4.0  speed burst (T13) -> isometric plate builds (stagger 3f, back.out)
// 8.2  logo-matte zoom (T6) -> wordmark letters fade, stagger 2f; tagline at +0.6s
// 12   feature 1: panel unfold (T11) -> click(input) -> typeOn(prompt) -> result card expo.out
// 20   feature 2: hub-and-orbit (T12), satellites idle-orbit 8°/s
// 28   feature 3: kinetic heading + card grid (stagger 3f) -> focus(card[2], 1.8)
// 36   feature 4: workflow graph: connectors draw (stroke-dashoffset 15f), nodes pop
// 44   feature 5: dashboard counters (countUp) on a tilted plane, drift
// 52   payoff line (kinetic) + partner/proof chips orbit hub
// 59   logo-matte zoom (T6) -> lock-up -> CTA pill pops back.out(1.8) -> click(cta) -> hold 4s
```

### The five shots that define the style (build these first)

1. **Caret to workspace (A1 open).** 1.2 s white with a blinking caret. The sidebar cascades in (T2). The cursor
   enters from the bottom-right on a curve and hovers two rows (4-f highlight each), clicks, and the page swaps (T3).
   Zoom out to the window with shadow on a flat blue desktop (T4). Hold 1.5 s.
2. **Zoom into a component.** From a window context shot, `focus()` on one card at 2.5× (18 f, power2.inOut). The card
   performs one micro-interaction (a drag reorder with a lifted shadow, or a view switch table → board), then zooms
   back out. This is the backbone shot of every feature beat.
3. **Hub-and-orbit (A2).** The app-icon tile pops at centre with its glow. An ellipse path draws, and 6–8 generic
   integration glyphs or persona avatars pop along it (3-f stagger) and drift. Connector lines draw hub → satellite.
   A label chip appears under each persona.
4. **Stat-ring problem beat (A3).** On a dark-glow ground a dark card appears at centre; the ring draws and the counter
   counts to 81 %. The card glides to the left third while the text decodes to the right (T8). Then the card content
   morphs into a portrait with a quote, and the act ends with a blob wipe (T7).
5. **Logo-matte lock-up + CTA (close).** The last feature scene is swallowed by the logo mark (T6) or by a gradient
   wipe. The wordmark fades in with a 2-f letter stagger, the tagline types or fades 0.5 s later, the CTA pill pops
   (back.out 1.8) with an accent glow under it, the cursor glides in and clicks it (squash + ripple). Hold ≥ 3 s.

For variant B, replace shot 1 with a **cinematic metaphor plate** (3D fly-through of glass spheres or ribbons, 6–8
s, no words) and drive chapters with on-screen chat bubbles or prompts (typeOn 20 chars/s, a 3-dot typing indicator
for 0.8 s before replies). Use T17, T18 and T19 as the signature transitions.

## 12. Per-video notes

**oTahLEX3NXo, What is Notion? (A1)**
- The calmest film in the cluster: hold_frac 0.449 (2nd of 52), motion 5.63, no on-screen titles at all, and the only
  colour is emoji and the blue desktop backdrop (saturated share 4.4 %, mostly that backdrop).
- Structure is inverted: aspiration first, ~15-feature tour, and the *problem* (scattered tools, shown as an ink
  illustration of people juggling tool names) only at 2:16, then a caret bookend and a logo lock-up with no URL or CTA.
- Logo resolve: hard cut to white; the icon fades in over ~9 f; hold ~21 f; the icon slides left as the wordmark fades
  in (~9 f); then hold 2.5 s.
- The 7 "cuts" are click-to-swap UI changes.

**1L8wQqHK_u0, Marvin AI (A2, dark → light)**
- Studio portfolio piece with a "burnwe" watermark top-left for the whole runtime.
- Problem act on aubergine-black with neon magenta→orange line charts (−30 % → −54 % ticker), messy folders and a
  calendar stack (T14).
- Logo glint (T16), then a hard cut to the white solution world with an iridescent app icon and white cards with
  chromatic under-glows.
- Keyword headings are typed in sync with the VO.
- The closing rising area chart mirrors the opening decline (bookend), with social-proof chips before it.
- CTA: a white pill with a rainbow under-glow.
- The fastest VO in the cluster (153 WPM).

**gVcyghMTrtU, Synoptix AI (A2, light)**
- Zero hard cuts in 68 s and the brightest film in the corpus (0.978).
- Single royal-blue family (#2A6FF3 / #585AE7 / #89B0EF) on white with periwinkle corner washes.
- Word-synced kinetic hook. Isometric skyline and server-stack plates.
- Logo-matte zoom (T6) used as a bookend at 8.2 s and 60 s.
- Panel unfold (T11) for the chat UI. Three hub-and-orbit diagrams (integrations, personas, LLM providers). Workflow
  node graphs with right-angle connectors.
- Ends on a CTA pill that the cursor clicks (a blue filled arrow in the chat scenes, a dark arrow on the end card).
- "Futuristic, cinematic" in the article really means bright, flat and isometric.

**2yL0LhyxOGk, Membrain Elevate (A3)**
- Charcoal #151619 with teal and wine corner glows; stat rings with gradient strokes that rotate continuously.
- The text decodes letter by letter; avatars fly in with comet trails. Blob wipes mark the act breaks.
- The product tour is on steep 3D-tilted dark dashboards with floating photo cards. It flips to white cards for the
  final "act" beat (56–60 s, T10).
- End card: the same gradient-spotlight title card as the intro (bookend), with the URL in crimson.
- 33 % of the runtime is the stat-driven problem act, the longest in the cluster.

**sjRKMbmeXnw, Introducing Clay (B, dark)**
- No VO at all (1 caption word). The story is told in message bubbles and UI text edits.
- Opens on a nebula with glass bubbles holding network glyphs and contact photos. The logo assembles from glyph
  fragments; the camera pulls back from the phone screen and then pushes into full-frame UI.
- Alternates black app UI with white chat screens. Emoji pivots on black.
- Confetti + hyperspace tunnel into the "groups" chapter. Ends on a serif tagline, then logo + URL + platforms.
- hold_frac 0.36: UI text is held long enough to read without narration.

**B4mJO6F5kok, Microsoft 365 Copilot (B outlier)**
- Not a UI explainer in the same sense: a photoreal 3D CG brand spot, 19 cuts/min, music with vocals, motion 12.
- On-screen prompts in frosted chips act as the script; stat slams (T20); silk-ribbon and glass-tile interstitials;
  real UI texture-mapped onto glass panels.
- Only partially buildable in SVG/HTML: frosted panels and gradient ribbons can be faked with CSS 3D/canvas, but the
  CG desk and DOF cannot.
- Treat it as a reference for prompt-as-chapter structure and beat-cut pacing, not for the core look.

## 13. Source-list issues

1. **4 of the 18 picks are What a Story's own work.** In the public video metadata, the
   uploader "What a Story - The Video Partner for SaaS & AI" appears on:
   - #4 "Elevate SaaS Explainer" (`2yL0LhyxOGk`);
   - #9 Synoptix AI (`gVcyghMTrtU`);
   - #15 KGeN (`pUsreu5dTJ0`);
   - #16 Kartel (`x_tCThgCepU`).

   This sits against the article's statement that it is showing others' work "rather than showcasing only our own
   videos". That is technically true because of the word "only", but the four entries are captioned by client name
   with no "our work" label. Entry #16's heading "Best Product Launch Video" reproduces the agency's own YouTube title.
2. **Studio portfolio uploads, not brand channels.** Four more picks come from other animation studios' channels:
   Marvin (Burnwe; watermark visible), Clay (Mesh), Timeliner (Flash Motion) and Breeze (Vimeo, Inflix Studios). In
   total, 8 of 18 are agency or studio uploads and 8 are confirmed brand-channel uploads (Notion, Loomly, Microsoft
   Copilot, Ahrefs, Dropbox, HubSpot, Slack, ElevenLabs). The other 2 (Fostr, Reddit) could not be checked.
3. **"Elevate SaaS Explainer" is mislabelled.** The product is *Membrain* Elevate (the real title is "A Stunning Product
   Launch Video for Membrain's Business Intelligence / SaaS Explainer"). The article's overview says it bridges the gap
   "between leads and sales teams", but the VO is about **leadership** being disconnected from sales staff.
4. **Notion, "pacing is fast"**: refuted. 134 WPM, motion 5.63 (below the corpus median of 6.89), hold_frac 0.449
   (2nd highest of 52), 2.7 cuts/min. "Does not feel rushed" is right. "Instead of overwhelming the viewer with
   features" is debatable: it walks through ~15 features in 154 s, and the scattered-workflow framing appears only in
   the last 20 s.
5. **Marvin, "subtle gradients, minimal motion graphics"**: partly wrong. The gradients are saturated magenta → coral →
   cyan glows, the opening is a busy dark data montage (first-decile motion 16.7, the highest opening decile in the
   cluster),
   and there are two real hard cuts.
6. **Clay, "fast-paced product visuals" and "typography-led transitions"**: not supported. Motion 6.39, hold 0.36, 1.33
   cuts/min. Its transitions are camera moves (fly-through, phone push-in, tunnel) and emoji pivots; typography leads
   only the logo assembly and the closing serif line. "Without voiceover" is confirmed.
7. **Synoptix, "futuristic, cinematic tech-inspired visuals"**: it is the brightest video of 52 (0.978), flat-vector and
   isometric with zero cuts. Nothing about it is cinematic.
8. **Microsoft 365 Copilot filed under "Complex Tech & AI Simplification"**: it explains no mechanism. It has no VO, a
   music track with vocals (the "WPM 33" is lyric captions) and 19 cuts/min, so it is a brand montage. The "3D +
   typography + strong sound design" description is accurate.
9. **Dead or unavailable embeds.** #7 Fostr AI (`Mq8vICOCQaU`) is no longer available. #8 Reddit (`cCnTVd9nMoY`)
   was not available for analysis, so it is not analysed here.
10. **"Best … to Watch in 2026" uses old material.** Slack is 2014, Ahrefs 2016, HubSpot 2018 and Notion 2020, and the
    closing paragraph says "The videos of 2025 prove…".
11. **Outside this cluster (metadata and transcripts only, frames not checked here):**
    - #13 Dropbox is a recruiting / employer-brand film ("Build the Future at Dropbox With Us | Life Inside Dropbox";
      the VO is about Dropbox's people and culture), not the file-storage explainer the article describes.
    - #17 Slack (`animated_frac` 0.09) and #18 11ai (0.36) are mostly live action in an "animated explainer" list.
    - #2 Loomly is listed as 1:30 but runs 72 s.
    - The Clay entry is formatted as an H3 category heading (numbering glitch).
