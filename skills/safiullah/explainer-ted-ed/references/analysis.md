# TED-Ed animated lessons: style analysis

TED-Ed is a **format, not one house style**. A different animator or studio makes each lesson, so the illustration changes from video to video. The wrapper and the script architecture stay the same: logo sting, epigraph card, one narrator, a single question answered in about 700 words, a callback ending and a black credit bar.

This file covers two things:
- the shared formula (sections 1–4 and 7–11);
- a catalogue of the five illustration sub-styles seen in the five sources (section 5b).

**Measurement notes**
- Source files are 854×480 at 23.976 fps. Pixel values below are converted to **1080p (×2.25)**.
- Extra measurements came from my own OpenCV passes over `research/media/<id>/<id>.mp4`:
  - frame-diff timing of the opening and the credits;
  - frame-cadence tests (animated on ones or on twos);
  - histogram scene-change counts (catching wipes and camera moves, not just hard cuts);
  - k-means palettes on key frames;
  - narration-only WPM taken from the transcript span.

Abbreviations:
- **Nail** = rusty nail (MzzOKh6gbGg)
- **Micro** = microwave (ZExGV6jSuBw)
- **Lake** = Lake Cadagno (KF6rClLH4n4)
- **Explain** = How to explain something complicated (EMbZ72cCAzI)
- **AI** = AI data centers (z3Y-gsBKChc)

---

## 1. Identity

A TED-Ed lesson always opens the same way:
- one second of the red-and-black logo on white;
- a hard cut to a **white card holding a one- or two-line literary or pop-culture epigraph** in a thin grey sans, with a small italic attribution;
- a fade up from white into a fully illustrated world.

From then on:
- one calm, unseen narrator answers **one question** (the video title, which never appears on screen) in about 650–720 words;
- the narration runs at about 120–150 WPM, roughly 25% slower than YouTube-explainer pace;
- there is no host, no chapter cards, no captions and almost no on-screen text, only a handful of hand-lettered labels drawn in the lesson's own art style.

The illustration is different every time: soft-glow pastel cel, retro mid-century comic, painted multiplane, geometric motion graphics, isometric neon. The pacing is constant: one visual idea every 5–6 s, carried by camera moves, wipes and match-cuts rather than rapid cutting.

It ends with a line that calls back to the opening anecdote. A **black credit bar** covers the bottom ~17% of the last 8–10 s, with a red circular badge at the right.

---

## 2. Sources analysed

| id | title | dur | cuts/min | median shot s | scene changes/min (mine) | motion | hold | colourful | WPM overall / narration | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|
| MzzOKh6gbGg | Why is it so dangerous to step on a rusty nail? (2024) | 4:46 | 3.77 | 9.68 | 8.7 | 4.94 | 0.10 | 39.9 | 136 / 153 | −16.3 |
| ZExGV6jSuBw | Why can't you put metal in a microwave? (2024) | 5:49 | 7.57 | 3.80 | 11.9 | 5.36 | 0.28 | 38.0 | 120 / 131 | −16.6 |
| KF6rClLH4n4 | Scientists are obsessed with this lake (2024) | 5:37 | 6.05 | 6.77 | 11.2 | 4.39 | 0.15 | 33.9 | 119 / 130 | −16.8 |
| EMbZ72cCAzI | How to explain something complicated (2026, meta-lesson) | 9:29 | 2.22 | 14.37 | 4.6 | 5.02 | 0.35 | 61.7 | 144 / 152 | −16.4 |
| z3Y-gsBKChc | Why are AI data centers using so much electricity? (2026) | 6:36 | 0.91 | 20.11 | 5.7 | 6.33 | 0.10 | 56.1 | 108 / 118 | −16.4 |

How the columns were measured:
- "Scene changes/min" is a 1 s-lag histogram drop (intersection < 0.55). It counts wipes, morphs and big camera moves as well as cuts.
- "Narration WPM" is caption words divided by the time from the first to the last narration line. It excludes the ~7 s music-only head and the 10–25 s tail.

---

## 3. Measured pacing

Target ranges for a rebuild:
- **Runtime**: 4:30–6:30 for a standard lesson. Meta and talk-analysis lessons run to 9:30.
- **Words**: 650–720 for a standard lesson, i.e. about 120 words per minute of total runtime.
- **Narration rate**: 120–150 WPM. At 6 s per scene that is about 12–15 words per visual beat.
  - Kokoro: speed 0.90–0.95 with a 350–600 ms gap between sentences.
- **Hard cuts**: 1–8 per minute. The median shot is long (4–20 s) because most scene changes are camera moves, wipes, pans or zoom-throughs inside one continuous shot. The extreme case is AI: 6 hard cuts in 6.6 minutes, with the camera flying through one isometric world.
- **Visual idea changes**: 5–12 per minute.
  - Median gap between changes: 3.8–6.5 s for illustrated lessons, 10.8 s for the meta-lesson.
  - p10 is about 1.8–3 s and p90 about 8–12 s.
  - Rule: **change the picture on every new sentence or clause, roughly every 5–6 s; never hold one composition past about 12 s unless the camera is moving.**
- **Motion energy**: mean 4.4–6.3, p90 7–15. This is calm. Big motion comes in short bursts on transitions.
  - The motion curve (deciles) is fairly flat with 2–3 peaks: at the first mechanism reveal (10–20%), mid-lesson (40–60%), and sometimes at the climax (80–90%).
  - The last decile is always the calmest (1.6–5), because the final shot holds under the credits.
- **Holds**: 10–35% of 1/6 s steps are static. Hand-drawn lessons sit at 10–15%: there is always something breathing, grain boiling or drifting. Motion-graphic lessons hold more (35%).
- **Animation cadence** (measured by frame-diff patterns):
  - Hand-crafted lessons animate characters on **twos (12 fps)**: Nail and Lake show a strict `x.x.x.` pattern.
  - Camera-move and motion-graphic lessons run on **ones**: Micro, AI and Explain.
  - Nail also uses mixed 2s/3s holds (`x.x..`) in slow acting.
- **Loudness**: −16.3 to −16.8 LUFS integrated on every lesson. This is a house master target; use **−16 LUFS** for a rebuild.
- **Silence**: about 0–1.7 s in total. A continuous music bed sits under everything.
- **Colourfulness**: 34–62, depending on the sub-style. Brightness 0.42–0.66. Dark-frame share 5–30%: the lake and night scenes are the dark ones.

**Fixed wrapper timings** (identical in all five, measured to the frame):

| element | in | out | duration | notes |
|---|---|---|---|---|
| Logo sting on white | 0.00 s | 1.21 s | 29 frames | Static centred wordmark. Box is 41% of frame width, centred vertically. |
| Epigraph card | 1.21 s (hard cut) | 5.80 s | 4.6 s | Static, white background. |
| Pure white frame | 5.80 s | — | 1 frame | |
| Fade from white into scene 1 | 5.80 s | 6.5–6.9 s | 16–26 frames | Linear-ish. Fades to black instead when scene 1 is dark (Lake). |
| VO starts | 6.8–7.6 s | | | About 1 s after the fade ends. |
| Credit bar | T−8.3 s (3 of 5); T−9.8 / T−10.5 s (2 of 5) | to end | 8–10.5 s | Hard on. 2–5 "pages" that swap hard every 1.7–4.2 s. |

---

## 4. Script & narrative structure

**Beat map** (percent of runtime; derived from all five transcripts)

| % | beat | what happens | examples |
|---|---|---|---|
| 0–2 | Wrapper | Logo, epigraph, fade from white. Music only. | All |
| 2–14 | **Cold-open anecdote** | A dated, named story or a startling scene, told in past tense with concrete sensory detail. | "In the 5th century, Greek physician Hippocrates…"; Percy Spencer's melted candy bar (1945); "Roughly 3 billion years ago…"; "Since 2019, over a thousand…" |
| ~12–16 | **Pivot to the question** | One short line turns the story into the lesson. | Micro: "So, how does it work?" (0:52). Nail: "Today, we know this account to be one of the first recorded cases…" |
| 16–60 | **Mechanism chain** | 4–6 causal steps, each 2–3 sentences with its own image. Scale moves macro → micro (body → bacteria → toxin → neurons) and back. | |
| 60–85 | **Complications, consequences, myths** | What goes wrong, edge cases, misconceptions corrected. | Tetanus symptoms progression; metal and arcing; the energy crisis |
| 85–95 | **Resolution and wider frame** | Treatment, solutions, research value, an open social question. | Vaccines and global infant deaths; small language models; bioconvection insight |
| 95–100 | **Callback button** | One wry line that returns to the opening image, then the music tail. | "…a rusty nail or a 2,400-year-old ship anchor"; "…another neat benefit of cooking with RADAR" |
| last 10–20 s | **CTA VO + credits** | Over the final (often callback) shot: "Learn more with our next video…", "Check out this video to…". | Auto-captions of Micro, Explain and AI. The official captions on Nail and Lake omit it (inferred to be present). |

**Hook pattern (first 15 s of picture, which is about the first 8 s of VO)**
- The epigraph sets a tone: wry (Micro), ominous (Nail), poetic (Lake, AI), on-topic (Explain). It is never explained.
- The VO opens in the middle of a story or a number. There is no "In this video…".
- Lake uses a **delayed-noun reveal**: it describes a poisonous, world-changing gas for 35 s and only then names it. It is the strongest hook pattern in the set:
  > "And the name of this powerful, poisonous, world-changing gas? Oxygen." (Lake, 0:41)
- The question in the video title is answered implicitly. The script **never reads the title aloud**.

**Section handovers**
- There are no chapter cards. (YouTube chapters exist only in the metadata.)
- Transitions are verbal hinges at the start of a sentence: "Once in the body…", "Typically…", "But fortunately…", "However…", "For example…", "Ultimately…".
- Each hinge usually coincides with a new composition. In Lake, 70% of scene changes fall within 0.6 s of a caption-line start (chance would be 28%). Elsewhere the effect is weaker: images change on phrase boundaries ±0.5–1.3 s, with no beat-locked cutting.

**Ending**
- The VO's final sentence is short and calls back to the hook.
- A recent-era CTA follows (10–20 s) over the held last shot.
- The credit bar covers the last 8–10 s. There is no end card, no "subscribe" and no logo outro.
- Lake and Micro repeat the **opening images** under the credits (the cell and the planet; Spencer's lab), so the video ends where it began.

**Meta-lesson rules** (Explain): the channel's own explanation recipe, which is directly usable as a script generator:
1. **Spark curiosity first.** Open with a question the audience cannot yet answer, and only start explaining once it has been posed.
2. **Introduce building-block concepts one at a time, and name each one** (prefrontal cortex → experience simulator → impact bias).
3. **Give each concept one metaphor and one strong example**: flight simulator; "liver-and-onion ice cream".
   > "Each bit gets stronger thanks to metaphors and examples." (Explain, 8:01)
4. **Open a knowledge gap.** Present a surprising fact the blocks cannot yet explain (lottery winners and paraplegics are equally happy), then fill it.
5. **Reveal the big idea only after the blocks are in place**, then restate how the blocks built it (7:04–7:28).
6. **Fight the curse of knowledge.** Ask what the audience already knows; never skip a block.

Visual translation in Explain: each named concept becomes a **geometric token** (a coloured circle with a label). The tokens accumulate on screen and stack into a "tower" at the end (8:01: a triangle-on-square building-block icon). Use this "concept-token stack" as a recurring motif in any TED-Ed-style rebuild.

---

## 5. Visual system

### 5a. Shared (all sub-styles)

- **Frame**: full-bleed 16:9 illustration. There is **no persistent UI, logo bug, lower-third or caption track** at any time.
- **Text use**: about 1 label every 30–90 s, usually a key term or a single stat. It is always **drawn in the lesson's art style**, never a generic caption font:
  - Nail: hand-lettered glowing caps such as "CLOSTRIDIUM TETANI";
  - Micro: retro condensed serif labels such as "RADAR";
  - Lake: small bold sans labels on diagrams ("Meromictic Lake");
  - Explain: heavy geometric sans ("Knowledge Gap");
  - AI: extruded 3D numerals ("2019") and small UI-chip labels ("GPU", "CPU", "PIC").
  - Labels occupy ≤ 25% of frame width, except a hero-stat moment (Nail 3:50, one stat as a full-frame hand-lettered card).
- **Wrapper typography** (measured):
  - **Epigraph**:
    - Light humanist/neo-grotesque sans. Look-alikes: Inter Light 300, Source Sans 3 Light, Helvetica Neue Light.
    - #4C4C4C on #FFFFFF. Centred, 1–2 lines.
    - Size ~64–68 px at 1080p; line pitch ~108 px (1.6). The text block is centred at y ≈ 46% (slightly above centre). Line width is up to 83% of frame width.
    - Attribution: ~26 px, #8C8C8C, "– Author, *Title*" with the work title in italic. Baseline about 75 px below the last quote line.
  - **Credit bar**:
    - Solid #000000, height 180 px (16.7%), or 223 px (20.6%) when names wrap to two lines.
    - 5 columns. Left edges at x ≈ 4.9%, 24.7%, 40.7%, 54.6%, 69.2% of frame width.
    - Role label in regular weight, name below in **bold**, both white (#F4F2F2), ~28 px, Arial/Helvetica-like.
    - A red circular badge (#E60005, Ø ≈ 122 px) is centred at x = 94%, y = 91% (1805, 986 px).
    - Page 1 credits the lesson: Educator, Director/studio, Narrator, Composer & Sound Designer. The following pages list channel staff.
    - In an original build, use your own badge colour and roles.
- **Composition**:
  - One subject per frame, usually centred or on a third.
  - Large negative space (flat colour field, sky or water). The subject fills 30–60% of frame height.
  - Split screens and panels are used for comparisons (two regions, two states, two people).

### 5b. Illustration sub-style catalogue

| # | Sub-style (source) | Palette (measured hex) | Shape & line | Texture & light | Depth & camera | Cadence |
|---|---|---|---|---|---|---|
| S1 | **Soft-glow pastel cel** (Nail) | Mauve field #B08EAB; pale teal #B3CCCF / #CFD9DD; night #1A111F / #0B001A; ochre deck #AD823F; sky #9EAED8; hot pink #E24398 (toxin); flesh/cream #EDDFD5; bacteria brick-red #A8525F | No black outlines. Every figure has a **cream/white soft rim glow** of about 6 px plus a 10 px blur halo at 1080p. Round heads, noodle limbs with round white "knob" ends. Personified abstractions: a diamond-headed doctor, sausage-shaped bacteria, a spiky pink toxin. | Heavy film grain (about 6–8% luma noise) and a vignette that darkens corners and blooms the centre. Bacteria are rendered as speckled watercolour. | Mostly flat staging against a colour field. Panel splits (3 panels, 3:02). Rough painted vertical wipes. | Twos (12 fps); 2s/3s in slow acting |
| S2 | **Retro mid-century comic** (Micro) | Lab browns #1F1E16 / #423F2D / #78765F; radar green #559A5E / #85CE8D; kitchen cream #CECAB9; wood #AD9674; steel blue #8DA3AC; navy #2E3443; science teal #5C9393 / #71ADAC / #8CC5BE; parchment #DAD0B2; accent red #C65D61 | **Brown-black ink outlines** of variable weight (about 3–4 px at 1080p, thinner on interior detail). 2-tone cel shading. Realistic adult proportions (7 heads tall), 1940s–60s costume and props. Science interludes switch to outline-free flat teal fields with cyan circle molecules and ± glyphs. | Paper-grain overlay changing every frame (texture boil), warm lamp gradients and pools of light, soft vignette. Labels have a faint glow. | Slow push-ins. Diagonal split-screens with a white divider. Horizontal pans to parchment "presentation" boards. Zoom-through match cuts from object to molecule. | Ones (grain plus camera) |
| S3 | **Painted multiplane / mixed media** (Lake) | Murky greens #48553E / #7D855D / #5B674A; underwater blue-greys #5B7D8D / #486373; deep #1F2A29 / #0D100E; diagram water #4BD0DF / #216EB6; diagram white #D7FCFD; banks #281A12; bacteria pink-violet; cell ochre #846F35 | Hand-painted gouache/watercolour cutouts with no outlines. Organic silhouettes (fish, plants, microbes). Diagrams are a painted cross-section on white with a simple bold sans label. | Painted texture everywhere. **Optical depth of field**: foreground and background layers blurred like a real lens. Hazy light shafts underwater. 26% dark frames. | Slow drifts and focus pulls. Dissolves and fades through black. Lens-like rack focus between layers. Microscope "circle" views. | Twos |
| S4 | **Geometric flat motion graphics** (Explain) | Lavender field #C190F9 (36% of pixels); deep purple #5600AC; electric blue #3F54F7; magenta #EC14CE; red #D31C2C; yellow #FADB2E; orange #DA8537; near-black #1D181C; white #F5F5F7 | Pure vector primitives: circles, triangles, dot rings, emoji-dot faces, "constellation" node graphs. No outlines, no gradients. Heavy geometric sans display type (look-alikes: Poppins ExtraBold, Manrope ExtraBold) set in tight 2-line stacks. | Perfectly flat, no grain. | Shape wipes (a triangle grows to fill the frame; iris rings close). Alternates with live talk footage (~40% of runtime) and archive slides of the talk (black slide, gold title bar). | Ones, with long holds (hold_frac 0.35) |
| S5 | **Isometric neon 2.5D** (AI) | Indigo/navy #30397F / #5464AC / #8399CA / #14153F / #070542; violet #4423AF / #7746D2 / #A575DA; circuit green #1E5A4F / #45916F; hot red-orange #C9302C / #F3B777; magenta #7E2663; cyan glow | Isometric (30°) architecture: server halls, racks, chips. Geometric faceted characters with glowing lenses. Bevelled extruded numerals (the "2019" assembles from fragments). | Gradients, **bloom/glow**, light rays and starburst flares, chromatic depth haze. Low flatness, which is why the metric calls it 19% "animated". | **Continuous camera fly-through**: 6 hard cuts in 6:36. Radial zoom-blur whips (5 frames). Light-burst transitions. | Ones |

**What stays constant across sub-styles** (the "TED-Ed look" independent of the artist):
- a limited 6–9 colour palette per lesson, with one dominant field colour taking 25–40% of pixels;
- one hot accent reserved for the "villain" or key agent: pink toxin, red molecule, orange heat;
- soft lighting (glow, vignette or haze) rather than hard cel shadows;
- metaphorical characters (personified microbes, molecules, chips);
- macro ↔ micro zooms;
- diagrams kept inside the art style rather than overlaid as infographics.

---

## 6. Characters & objects

- **Narration is third person, so characters are actors, not presenters.** There are two kinds:
  1. **Historical or everyday humans** in the anecdote (Hippocrates and the shipmaster; Percy Spencer; a 1950s cook couple; anonymous engineers).
  2. **Personified abstractions** (bacteria as red pill-shapes with tails; toxin as a pink spiky face; a doctor with a diamond head; GPUs as glowing chips; a concept as a coloured circle with a dot face).
- **Construction by sub-style**:
  - **S1**:
    - Head about 40% of total height. A single shape holds the body (tunic or rectangle).
    - Limbs are 1-segment noodles about 8% of head width thick, ending in white knobs. No fingers.
    - Face: 2 dot eyes plus an expression mark (jagged mouth for pain, red scribble cheeks).
    - Patients are pale cream with red scratch-mark "pain" textures.
  - **S2**: realistic cartoon proportions (6.5–7 heads), long faces, defined jaws. Shown in full scenes with props (lab coats, aprons, glasses, mid-century hair). Expressions are subtle: raised brows, smiles.
  - **S3**: almost no humans. Humans appear as painted silhouettes (swimmer, fisher, diver, scientist at a microscope). The "characters" are fish, microbes and cells, animated with cyclic swimming and undulating motion.
  - **S4**: 2–3 circles of different colours with minimal faces: two eyes plus a mouth line, or an emoji-type face. Emotion comes from face-glyph swaps (smile → zigzag mouth, question-mark pop) and from size and position changes.
  - **S5**: stylised faceted adult silhouettes with glowing glasses, used as crowds or "society". Hero objects are machines (a spinning fan-like "AI core", server racks, chips).
- **Acting**:
  - Limited acting on twos in S1 and S3: pose-to-pose with 2–4 key poses per sentence.
  - Puppet or cut-out rigging is evident: limbs rotate about joints without deformation. Exception: S1 spasm scenes, where the body arches through drawn poses.
  - Blinks and small head turns provide idle life.
- **Props and icons**: syringes, pill bottles, calendars with X marks, microwave ovens, forks, data-center racks, light bulbs, globes held in hands. Every prop is drawn in the lesson's style with the same line and texture rules as the characters.
- **Symbolic visual devices** that recur across lessons:
  - **Magnifier or microscope circle insets**: a circle mask showing the micro view over the macro scene (Nail 1:00, Lake 3:42).
  - **Cross-section diagrams** with arrows (Lake meromictic layers; Micro magnetron).
  - **Stage or "theatre" metaphors** (Nail 3:33: syringes as performers on a stage).
  - **Callback objects**: the ship anchor; the radar screen.

---

## 7. Camera & transitions catalogue

The frame numbers below come from 24 fps dense strips (`media` MP4s).

| # | Transition | Frame-by-frame build | Duration | Ease | Frequency |
|---|---|---|---|---|---|
| T1 | **Hard cut** | Instant. Usually on a sentence start, often between scales (macro → micro) or locations. | 0 | — | 1–8 per min (Micro is highest) |
| T2 | **Fade from white** (opening only) | Epigraph → 1 pure-white frame → scene opacity 0 → 1 under white. Luma drops ~3–5 levels per frame. | 16–26 frames (0.7–1.1 s) | linear / sine.out | Every lesson, once |
| T3 | **Painted panel reveal / vertical brush wipe** (S1) | The new scene appears inside a vertical strip with a rough painted edge that widens left→right (Nail 8.6 s: frames 206–212). | 6–10 frames | power2.out | 2–4 per lesson |
| T4 | **Torn/ink-edge vertical wipe** (S1) | A dark shape with a ragged horizontal edge descends top→bottom and covers the frame (Nail 45.0 s: about 1 edge-height per 2 frames). | ~12 frames (0.5 s) | power1.in | 1–3 |
| T5 | **Camera tilt or slide-off** | The scene content slides out of the bottom or side of the frame, revealing an empty field (Nail 1:29: leaves drop away, 8 frames). | 8–12 frames | power2.inOut | Frequent (S1, S2) |
| T6 | **Panel split / comic grid** (S1) | The frame divides into 2–3 rectangles. A new panel slides up into place (Nail 3:02, ~5 frames). | 4–6 frames | power3.out | 1–2 |
| T7 | **Push-in zoom-through, then match cut** (S2) | A fast scale-up on the object (×1.0 → ×1.6 over ~10 frames), then a cut to the micro view with the same composition (Micro 2:26.7: microwave food → teal molecule field). | ~10 frames, then cut | power2.in | 3–5 per lesson |
| T8 | **Diagonal split-screen** (S2) | A white diagonal bar (about 8 px at 1080p) separates two scenes at roughly 60°. The bar sweeps across to resolve to one side (Micro 3:27, 4:34). | Static split held 3–6 s; resolving sweep ~8–12 frames | power2.inOut | 2–3 |
| T9 | **Horizontal pan to a board** (S2) | The camera trucks right off the scene onto a parchment field. A new object (a fork) enters from the right edge (Micro 4:04: 5 frames for the pan). | 5–8 frames | power3.inOut | 1–3 |
| T10 | **Radial zoom-blur whip** (S5) | Zoom ×1 → ×3 with radial motion blur over 3 frames, then the new scene decelerates out of the blur (AI 0:26.9: frames 646–650). | 5 frames | expo.in → expo.out | 2–3 per lesson |
| T11 | **Light-burst reveal** (S5) | Light rays and particles bloom from the centre, the scene brightens, and the new environment fades in behind the flare as it decays (AI 2:17.0–2:17.6). | ~12–15 frames | power2.out | 2–4 |
| T12 | **Continuous fly-through** (S5) | No transition at all. The camera dollies through an isometric world to the next "room" (AI median shot 20 s). | 3–8 s moves | sine.inOut | The default in S5 |
| T13 | **Shape grow-wipe** (S4) | A small centred triangle scales up about ×1.6 per frame until its edge covers the frame. The new background colour equals the triangle's colour (Explain 3:47.1–3:47.5: 9 frames). | 9 frames | expo.in | 4–6 per lesson |
| T14 | **Iris ring close** (S4) | A circular mask on the footage shrinks, ringed by a white annulus on a yellow field, until the dot vanishes (Explain 6:39.0–6:39.9: about 16 frames). | 16 frames | power2.in | 2–3 |
| T15 | **Dissolve / fade through black, focus pull** (S3) | A 2-frame dip to black, then light gradually emerges with defocus (Lake 3:32). Elsewhere, cross-dissolves of 12–20 frames between painted plates with rack focus. | 12–24 frames | sine.inOut | Most S3 transitions |
| T16 | **Kinetic numeral assembly** (S5) | Extruded "2019" builds from fragments sliding into place one glyph at a time (AI 7.0–8.1 s), then dissolves into the next image (a character's face fades up through it). | ~1.1 s for the build | back.out (small) | Opening only |

**Camera habits**
- A slow push or drift of 2–6% scale over a sentence (3–6 s) on most holds.
- Parallax only in S3 and S5: 2–4 layers. Far layers move at 0.3–0.5× the foreground speed.
- No handheld shake and no Dutch angles. Exception: Nail tilts the ground plane for the spasm sequence (4:33) to make it feel off-balance.

---

## 8. Motion grammar

- **Eases**:
  - Gentle sine/power2 in-out for camera moves;
  - power2/3-out for elements entering;
  - expo-in for wipes;
  - expo in-out for whip-zooms.
  - Overshoot is rare: a small back.out (overshoot ≤ 1.2) only on pops in S4 and S5. The register is "deliberate, not bouncy".
- **Build-on order** follows narration order strictly. When the VO lists items ("gamma rays and X-rays… microwaves and radio waves"; "soil, manure, and dead leaves"), each item appears or highlights on its word, with a 0.4–0.8 s stagger, the pace of speech.
  - S4 tokens pop in on the concept's name. The label appears 4–8 frames after the shape.
- **Holds**: after each key fact, hold the completed composition about 1–2 s (motion drops to idle) before the next change. A full-frame hero stat holds 4–6 s.
- **Idle and secondary motion** keeps hand-made styles alive:
  - grain boil every frame (S1, S2);
  - wave and water loops (period 2–4 s);
  - drifting particles and molecules (speed 1–3% of frame width per second);
  - character blinks every 3–5 s;
  - slow light flicker (lamp glow in S2).
- **Rhythm vs narration**:
  - Scene changes land on clause or sentence starts: within ±0.6 s for 38–70% of changes, against 25–32% by chance.
  - There is no music-beat cutting.
  - Stressed nouns get the visual payoff: object revealed, zoom lands, label appears.
- **Scale storytelling**: zoom in to explain (macro → micro → molecular) and out to conclude (micro → society or planet). Resolution beats often pull the camera back to the widest view of the lesson.

---

## 9. Sound (inferred: audio not heard)

- **VO**:
  - One credited professional narrator per lesson. The narrator differs between lessons, so voice gender and accent vary.
  - Delivery is calm, warm and "documentary-teacher": even pitch, clear diction, no shouting or vocal fry.
  - 118–153 WPM, sentence pauses about 0.3–0.6 s (inferred from cue gaps).
  - The meta-lesson mixes the narrator with the TED speaker's original talk audio (quoted clips 10–85 s long).
  - Kokoro: a neutral mid-pitch voice (e.g. `af_heart` / `bf_emma` / `am_michael`), speed 0.92, with commas rendered as 150–250 ms gaps.
- **Music**:
  - Every lesson credits a *Composer & Sound Designer*, so each score is original and matched to the art style:
    - S1: soft pizzicato/plucked strings and light percussion (guess);
    - S2: retro swing-tinged orchestral cues;
    - S3: ambient pads and water textures;
    - S4: bright synth-pop plucks;
    - S5: pulsing electronic/arp.
  - Tempo guess 80–110 BPM.
  - The music carries the first ~7 s alone: a logo sting plus the epigraph bed. The bed is continuous under VO (silence ≤ 1.7 s in total) and ducked about 10–14 dB under speech.
  - Music swells in the 3–25 s gaps after the final line and under the credits.
- **SFX**: a designed SFX layer is present (implied by the credit):
  - soft whooshes on wipes and whip-zooms;
  - foley for actions (popping corn, crackling arcs, water);
  - sparkles or chimes on reveals.
  - Density is low to moderate, about 1 cue every 5–10 s, tied to transitions.
- **Loudness**: −16.5 ± 0.3 LUFS integrated, consistent across studios. Master to −16 LUFS / −1 dBTP.

---

## 10. Do / Don't

**Do**
1. Open with a ~1 s logo on white, then a 4.6 s white epigraph card (thin grey sans, italic attribution), then 1 white frame and a 0.7–1.0 s fade from white. Start the VO at about 7 s.
2. Pick **one question** and answer it in 650–720 words, at 120–150 WPM.
3. Start the script inside a story with a date, a named person and a sensory detail, or with a startling number. Delay the key noun for a reveal when you can.
4. Pivot to the explanation with one short line ("So, how does it work?").
5. Build the mechanism as a 4–6-step causal chain, one image per step, zooming macro → micro and back out.
6. Personify abstract agents (microbes, molecules, chips) as simple characters in the lesson's style.
7. Change the picture every 5–6 s, on clause starts, and move the camera slowly through holds.
8. Choose one illustration sub-style and keep it pure for the whole lesson: 6–9 colours, one dominant field, one hot accent for the key agent.
9. Draw any on-screen text in the art style, and keep it to key terms and one hero stat.
10. End on a short callback line to the opening anecdote, then a 10–20 s CTA over a held final shot, with a black credit bar (17% height, 5 columns, round badge at the right) for the last 8–10 s.
11. Animate characters on twos in hand-made styles. Keep camera and motion-graphic moves on ones.
12. Master to −16 LUFS with a continuous, ducked music bed.

**Don't**
1. Don't show the video title or question as a title card. The epigraph replaces it.
2. Don't use a host, a talking head, or second-person "In this video I'll…" framing.
3. Don't add chapter cards, lower-thirds, subtitles burned into the picture, progress bars or a logo bug.
4. Don't cut fast. Fewer than 8 hard cuts per minute; prefer wipes, pans and zoom-throughs.
5. Don't mix illustration styles within a lesson (exception: Explain's documented talk footage plus graphics).
6. Don't use bouncy, cartoony overshoot or squash-and-stretch gags. The register is calm.
7. Don't put generic sans captions over illustrations, or more than about 8 words of text on screen at once (except the epigraph or a hero stat).
8. Don't end with "like and subscribe" or a logo outro card.
9. Don't exceed about 155 WPM narration, and don't leave dead air: the music bed never stops.
10. Don't reproduce TED-Ed's wordmark, red badge or credit layout exactly in public work. Use an original badge and colour, keeping the same structure.
11. Don't over-explain the epigraph, and don't quote it again in the VO.
12. Don't let the final decile be busy. The last shot holds calmly under the credits.

---

## 11. Replication recipe (code: SVG/HTML + GSAP, rendered frame by frame)

**Project constants**
- 1920×1080, 24 fps (render at 24; character layers quantised to 12 fps).
- Lesson length 300–390 s. VO track from Kokoro, aligned with word timestamps.

**Layer stack per scene** (back to front):
1. `bg`: a flat field colour or painted plate (S3: blurred `<image>` or SVG with feTurbulence wash).
2. `far`: parallax layer (S3/S5) with `filter: blur(6–10px)` for depth of field.
3. `mid`: the set.
4. `actors`: rigged SVG groups.
5. `labels`: art-style text.
6. `fx`: glow, light rays, particles.
7. `grain` + `vignette` overlay (S1/S2/S3).
8. `wrapper`: epigraph, white flash, credit bar.

**Filter recipes**
```html
<!-- S1 rim glow: cream halo around every actor -->
<filter id="rimGlow" x="-20%" y="-20%" width="140%" height="140%">
  <feMorphology in="SourceAlpha" operator="dilate" radius="3" result="d"/>
  <feGaussianBlur in="d" stdDeviation="5" result="b"/>
  <feFlood flood-color="#FFF6EC" flood-opacity="0.9"/><feComposite in2="b" operator="in" result="glow"/>
  <feMerge><feMergeNode in="glow"/><feMergeNode in="SourceGraphic"/></feMerge>
</filter>
<!-- Film grain, re-seeded every frame (seed = frameIndex) for "boil" -->
<filter id="grain"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="0"/>
  <feColorMatrix type="saturate" values="0"/>
  <feComponentTransfer><feFuncA type="linear" slope="0.07"/></feComponentTransfer></filter>
<!-- Vignette: radial gradient overlay, centre transparent → edge rgba(20,10,30,0.35), plus soft-light blend -->
<!-- S2 paper: feTurbulence baseFrequency 0.04/0.6 mixed multiply at 12%; ink outlines via stroke #2A2018, 3.5px, round joins -->
<!-- S5 bloom: duplicate the bright layer → feGaussianBlur 12px → mix-blend-mode: screen at 0.6 -->
```

**Camera rig**: wrap each scene in `<g id="cam">` and drive `scale`, `x`, `y`.
- Default per hold: `gsap.to(cam,{scale:1.04,duration:sentenceDur,ease:"sine.inOut"})`.
- Zoom-through: `gsap.to(cam,{scale:1.6,duration:10/24,ease:"power2.in"})`, then hard-switch scene.
- Whip (S5): scale ×3 in 3 frames with a CSS `filter: blur()` on a radial-blur layer approximation (or pre-render 6 zoomed copies at decreasing opacity).

**Character rig**:
- SVG groups with transform-origins at joints (head, upper arm, forearm, thigh, shin).
- Pose library: 3–6 poses per character. Tween between poses with `ease:"power2.inOut"` over 6–10 frames, then **step to twos**: when rendering frame `f`, evaluate character timelines at `t = Math.floor(f/2)*2/24`.
- Blink: scaleY eyes 1 → 0.1 → 1 over 3 frames every 3–5 s (randomised).

**Wrapper timeline**
```js
const T = (f)=>f/24;                          // frames → seconds
tl.set(logo,{opacity:1}).set(logo,{opacity:0},T(29))           // 0–1.21 s
  .set(epigraph,{opacity:1},T(29)).set(epigraph,{opacity:0},T(139))  // to 5.80 s
  .set(whiteFlash,{opacity:1},T(139))
  .to(whiteFlash,{opacity:0,duration:T(20),ease:"sine.out"},T(140)) // fade from white
  .call(startVO,null,6.9);
// credits: last 8.3 s, hard on, pages swap hard
creditPages.forEach((p,i)=>tl.set(p,{opacity:1},END-8.3+i*PAGE).set(p,{opacity:0},END-8.3+(i+1)*PAGE));
```

**Scene scheduler**: split the script into sentences. Each sentence or clause gets a `beat` with:
- a composition id;
- an entry transition chosen from T1/T3/T5/T7/T13 by sub-style (S1: T3/T5/T6; S2: T1/T7/T8/T9; S3: T15; S4: T13/T14; S5: T10/T11/T12);
- `holdPush` = sentence duration.

Enforce a minimum of 1.8 s and a maximum of 12 s per composition (otherwise add a camera move).

**The 5 shots that define the style, and how to build them**
1. **Logo → epigraph → fade-from-white cold open.** White plate, centred wordmark for 29 frames. Epigraph in Inter Light 66 px #4C4C4C, line-height 1.6, centred at y = 46%; attribution 26 px #8C8C8C with italic title. Then 1 white frame and a 20-frame fade into the anecdote's establishing shot (ship on waves, sky with planes, starfield). VO in at 6.9 s.
2. **Anecdote establishing scene with a character.** A wide shot of the historical moment in the chosen sub-style. Slow 4% push over the 2–3 sentence setup. Then a T3/T5 move into a medium shot of the protagonist reacting (pose change on twos).
3. **Zoom-through into the micro world.** Push ×1.6 into the wound, food or chip over 10 frames, cut to a field of personified agents (bacteria and molecules as rim-glow capsules with dot faces). The agents enter with a 0.15 s stagger and drift idly. A magnifier circle inset can keep the macro context.
4. **In-style diagram with one label.** A cross-section (lake layers, oven cavity, server hall). Arrows and particles animate along paths (`MotionPathPlugin`, power1.inOut, 2–3 s loops). One hand-lettered key term fades and scales from 0.9 → 1 over 8 frames. Hold 1.5 s after the label lands.
5. **Callback final shot plus credit bar.** Return to the opening location or object (ship, lab, planet). Slow pull-out of 3–5%. Last line of VO, music swell, CTA VO, then the black 180 px bar with 5 credit columns and a round badge at x = 94%. Pages swap every 2.8 s.

**Minimal scene skeleton (pseudo)**
```js
lesson = {
  style: "S1",                     // one of S1..S5, fixes palette, filters, transitions, cadence
  palette: {field:"#B08EAB", night:"#1A111F", accent:"#E24398", cream:"#EDDFD5", ink:"#50393E"},
  beats: alignToVO(script).map(s => ({
     t0: s.start, t1: s.end,
     comp: pickComposition(s),     // establishing | character | micro | diagram | split | hero-stat
     enter: pickTransition(style, s), // T3/T5/T6 for S1
     camera: {scale:[1,1.04], ease:"sine.inOut"},
     label: s.keyTerm ? drawLabel(s.keyTerm, style) : null
  })),
  wrapper: {logo:1.21, epigraph:[1.21,5.80], fadeWhite:20, credits:{fromEnd:8.3, pages:3}}
};
renderFrames(lesson, {fps:24, characterFps:12, grainSeedPerFrame:true});
```

---

## 12. Per-video notes

**MzzOKh6gbGg: rusty nail (S1 soft-glow pastel cel)**
- Epigraph is an ancient medical quote with the source in italics.
- The cold open on a ship (Hippocrates) recurs at the 3:20 "in the days of Hippocrates" beat: the deck scene returns with the doctor character added. This is a mid-lesson callback.
- The macro → micro chain runs wound → spores in leaf litter → bacteria → toxin → neurons → spasm.
- The hero stat appears as a full-frame hand-lettered glowing card (3:50).
- A split-screen pairs two regions: South Asia | sub-Saharan Africa, painted textured towns with hand-lettered names.
- The spasm sequence tilts the ground plane.
- Ends on the patient's arched body under the credits. VO ends at 4:23; the music tail runs 23 s.
- Captions are official and omit any CTA.

**ZExGV6jSuBw: microwave (S2 retro comic)**
- The most cuts in the set (7.6 per min, median 3.8 s): it is edited like a comic, with T7 zoom-throughs and diagonal splits.
- Two parallel visual registers: illustrated 1940s–60s story scenes, and flat-teal "science" interludes (EM spectrum, rotating polar molecules with red rotation arrows, a magnetron cutaway).
- A recurring cast (a cook in a navy shirt, a woman with red hair and a tablet) runs a domestic experiment thread through the lesson.
- Ends back in the 1940s lab (callback) under the credits.
- The auto-captions reveal the CTA naming two follow-up lessons (5:27–5:40).

**KF6rClLH4n4: Lake Cadagno (S3 painted multiplane)**
- Darkest (26% dark frames) and least colourful (33.9).
- Painted cutouts with optical blur. Scene changes are tightly synced to narration lines (70%).
- The delayed "Oxygen" reveal at 0:41 is the hook.
- The meromictic/holomictic cross-section diagram returns three times, each time adding information (labels, then ions, then a magnifier on the bacterial layer). This is progressive diagram disclosure.
- Bookend: the cell and the planet from 0:14–0:21 return at 5:22–5:30 under the credits.

**EMbZ72cCAzI: How to explain something complicated (S4, meta)**
- A different format: a TED-Ed lesson analysing a TED talk.
  - About 40–44% live talk footage ("Recorded at TED"), plus original talk slides (black, gold title bar).
  - The narrator's commentary alternates with the speaker's clips.
- The animation is pure geometric motion graphics on a lavender field, with shape-wipe transitions.
- The concept-token stack motif makes the explanation structure visible.
- Hold fraction is the highest (0.35).
- Ends with a CTA to a related lesson and to a classroom programme URL.
- Its six rules are summarised in section 4.

**z3Y-gsBKChc: AI data centers (S5 isometric neon)**
- Continuous fly-through: 0.91 cuts per min, median shot 20 s.
- Bloom-heavy 2.5D with radial zoom-whips and light-burst transitions.
- The opening extruded "2019" numeral build is the only kinetic type in the set.
- Social-question ending ("…how many resources are we willing to spend…").
- A partner acknowledgement card ("This video was made in partnership with…") holds for the last ~20 s with the credit bar over it.
- The analyzer's animated_frac of 0.194 is wrong: the video is 100% animation.

---

## 13. Source-list issues

- **All five are genuine TED-Ed uploads**, but they are not one style. Treat TED-Ed as a *wrapper plus script formula* with interchangeable illustration sub-styles (S1–S5). A skill should expose the sub-style as a parameter.
- **EMbZ72cCAzI is not a standard animated lesson.** It is a talk-analysis or "student talks" format with about 40% live TED-talk footage and slide captures. Use it for its script advice and the S4 motion-graphics sub-style, not as a model for lesson structure (9.5 min, 1366 words, quoted speaker audio).
- **The `animated_frac` metric is unreliable for TED-Ed.**
  - It under-reports textured or gradient-lit animation: AI 0.19 and Micro 0.45, when both are 100% animated.
  - It over-reports Explain (0.81), which is about 40% live footage, because 480p stage footage has large flat dark areas.
- **`wpm_overall` understates narration speed.** About 7 s of music-only head and 10–25 s of tail are included. Narration-only rates are 118–153 WPM.
- **Captions differ by era.**
  - The 2024 videos use official captions without the closing CTA, so their endings look silent in the transcript.
  - The 2026 videos and Micro use auto-captions, which include the CTA and occasional mis-hearings ("ed.ed/" for the URL).
- **Hard-cut counts mislead for S5.** The cut detector fires on radial whip-zoom blur (AI 0:27). Most TED-Ed scene changes are wipes and camera moves that the hard-cut metric misses. Use the scene-change column in section 2.
- **Sponsorship**: AI carries a partner-institution acknowledgement card. It is not an ad read, but it is not part of the generic formula.
