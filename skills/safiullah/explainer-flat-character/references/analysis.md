# Flat illustrated product explainer — VO-led problem → solution, pastel/line-icon vector, continuous canvas

Analysed 2026-10-27. Source list: whatastory.agency "18 Best Animated Explainer Video Examples to Watch in 2026"
(`raw/whatastory.txt`, entries #2, #11, #12, #13, plus the live-action #17 and #18 in the appendix). Inputs:
`frames/<id>/` (metrics, timeline, opening, strips, shots, ending, animated), my own frame-accurate contact
sheets cut from the 1280×720 MP4s with OpenCV (every 1–3 frames around each transition), and full-resolution
stills for size measurements (sizes are scaled from 720p to 1080p). The Breeze Vimeo entry is poster frame only
(plus its public oEmbed metadata), so it is a **style reference only, and nothing about its motion, timing or sound
is measured.** Audio is never heard: anything about sound is *inferred*.

---

## 1. Identity

A 50–90 s narrator-led explainer drawn as **one illustrated vignette at a time, centred on a light ground, that
morphs, zooms or pans into the next vignette on every VO sentence**. Hard cuts are rare (0.8–2 /min). Four drawing
dialects share the grammar:

- **Grain-pastel (Loomly):** no outlines. Soft lavender, teal, coral and cream fills, with highlights that
  dissolve into stipple grain ("textured gradients"). Floating pale-lavender blobs sit behind each vignette.
  Slim, small-headed characters appear only at the opening (the frustrated user) and the closing (a happy crowd
  with speech bubbles).
- **Outlined line-icon (Ahrefs):** every object drawn with a uniform 5 px navy stroke with round caps, flat fills
  in teal, coral and yellow, stacked "paper" copies for depth, small lowercase captions under the object, and
  ambient doodles (rings, pills, sparkles, dashes) floating at the frame edges. Scenes are built by morphing a
  coral square into the next object. Two navy colour-field scenes carry the pivot question and the outro.
- **Inked cel-shaded editorial (Dropbox):** a thin 2 px ink outline, flat bright fills with one shadow tone,
  forced-perspective characters with huge hands, a retro-futurist city, and a continuous camera flying from the
  logo into the world, into rooms and into space.
- **Monochrome tonal flat (Breeze poster):** no outlines, 5–6 tints of one blue, an extreme worm's-eye low angle
  and elongated stylised anatomy.

The recognisable signature: **"Here's the problem" (or a list of pains), a pivot question, the product name, then
one feature per sentence each with its own object, social proof, and a 6–10 s logo resolve on the same light
ground.**

## 2. Sources analysed

| id | title (uploader) | dur (s) | fps | cuts/min | median shot (s) | motion mean / p90 | hold | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|
| gpttyWIflXw | Welcome to Loomly (Loomly, 2024) | 72.1 | 23.976 | 0.83 | 36.06 | 8.11 / 21.30 | 0.074 | 40.1 | 139.8 | −17.7 |
| krzF3YhmSMw | What is Ahrefs? (Ahrefs, 2016) | 91.1 | 30 | 1.98 | 23.20 | 2.86 / 6.32 | 0.337 | 31.9 | 135.7 | −12.4 |
| XSfMJB4np5g | Build the Future at Dropbox With Us, Life Inside Dropbox (Dropbox, 2022) | 53.3 | 24 | 4.50 | 9.75 | 11.17 / 26.45 | 0.075 | 69.8 | 172.2 | −10.9 |
| vimeo 1091562451 | Breeze – 2D Animated Explainer Video (Inflix Studios, Vimeo 2025) | 84 | n/a | poster only | n/a | n/a | n/a | n/a | n/a | n/a |

| | Loomly | Ahrefs | Dropbox |
|---|---|---|---|
| hard cuts | 1 (57.6 s, a whip-zoom into the closing duo) | 3 (31.6 s white → navy, 37.6 s navy → white, 76.3 s white → navy) | 4 (9.75 s and 11.4 s between typing characters; 52.4 s to black; one more) |
| brightness / dark frames | 0.93 / 0 % | 0.85 / 0 % | 0.72 / 13 % (space scenes) |
| animated_frac | 1.0 | 1.0 | 1.0 |
| silence | 0 s | 0.7 s | 0.8 s |
| motion deciles | 18.7 5.6 4.9 6.9 5.5 3.6 4.0 8.8 19.1 3.8 | 1.4 1.7 1.2 6.0 4.4 0.6 0.4 1.4 8.7 3.0 | 18.0 10.0 10.1 6.9 13.5 5.6 13.9 19.9 5.3 8.6 |
| caption words | 168 | 206 | 153 |

## 3. Measured pacing

| quantity | target range | practice |
|---|---|---|
| hard cuts | 0–2 /min (up to about 5 /min only inside a rhythm-cut run) | the canvas is continuous; scenes change by morph, zoom-through, whip-pan or a colour-field swap. Ahrefs' 3 cuts are all colour swaps hidden behind swoosh lines. |
| continuous "shot" | median 20–36 s | treat the film as 2–3 long takes |
| scene (vignette) length | 4–8 s; one per VO sentence | Loomly changes vignette 0.2–1.0 s after each sentence start (sentences at 10.0, 18.4, 26.5, 32.9, 40.2, 48.5, 53.1, 57.3 s; new vignettes at about 10.9, 18.3, 27.4, 32.5, 41.1, 48.8, 53.3, 57.6 s) |
| motion mean | 3–9 (≤ 12 for the cinematic Dropbox dialect) | calm. Energy is concentrated in transitions: Loomly's open and close deciles are about 19 against a middle of 4–7. |
| hold_frac | 8–35 % | Ahrefs holds 34 % of the time: a built object sits still while only the ambient doodles drift. Loomly and Dropbox hold about 7.5 %. |
| motion curve | peaks at the hook (the decile 1 reveal) and at the outro (decile 9: crowd, circuit traces, logo); a quiet middle | build the energy into the bookends |
| speech | 135–145 WPM (Dropbox's recruiting VO at 172 is an outlier) | almost wall-to-wall VO: silence ≤ 0.8 s; VO ends 6–8 s before the end, leaving the logo on the music |
| loudness | −11 to −17.7 LUFS | the older and corporate masters are loud (Ahrefs −12.4, Dropbox −10.9) |
| brightness / colourfulness | brightness ≥ 0.72; colourfulness 30–45 (70 for the bright editorial dialect) | a light ground is the default; dark is reserved for one "space" or pivot section |

## 4. Script & narrative structure

**Beat map (percent of runtime):**

| % | beat | what happens | examples |
|---|---|---|---|
| 0–2 | **Canvas wakes** | an empty light ground; doodles or a logo fragment pop in; the VO starts in the first second | Ahrefs: doodles drift in for 2 s; Dropbox: one diamond tumbles in; Loomly: a pull-back from an extreme close-up |
| 0–14 (Loomly) / 0–35 (Ahrefs) | **Problem** | either a rhetorical pain list in the 2nd person (Loomly asks if you are suffering from four named pains, each a speech bubble around a frustrated user) or a mini story of "you" (Ahrefs: you built a great site → nobody finds it → competitors win → no traffic / leads / sales) | Ahrefs opens on "Here's the problem:" |
| 14–41 | **Pivot + name** | a one-line turn to the product, often a question answered with "Easy:" on a colour-field scene | Ahrefs 31.6–37.5 s on navy: "How are you ever going to outrank your competitors? Easy:" then the brand. Loomly 10 s: "Take the stress out of social by using Loomly…" |
| 20–80 | **Feature list** | 4–6 features, one sentence each, built in parallel grammar ("all the keywords…", "every website…", "every SEO mistake…", "automatic reports…"); each gets its own object or UI vignette | Loomly: scheduling 18 s, approvals 26 s, media library 33 s, optimisation 40 s, replies 48 s, analytics 53 s |
| 75–88 | **Payoff / social proof** | the result in numbers or a crowd: a "+274 visitors" counter, "over 600 000 users" over circuit traces and testimonial cards, or a diverse crowd with result bubbles ("I saved 30 hours this week") | Ahrefs 68–85 s; Loomly 57–65 s |
| 88–100 | **CTA + logo resolve** | a single CTA line ("Start your free trial", "Try … for free today"), then the logo on the same ground with the music tail; 6–10 s | Loomly 64.8–72 s (10 %); Ahrefs 85–91 s (7 %) |

**Hook pattern (first 15 s):** no title card and no brand. The problem is said in the first sentence. Pictures are
literal and immediate: time + money, a website, four customer avatars; or a desk, a frustrated character and
four speech bubbles. A character, if any, appears by 5 s. **Hand-overs:** the next object grows out of the last
one (Ahrefs square morph), the camera pushes through an element into a blank field where the next vignette grows
(Loomly), or a diegetic event wipes the frame (Dropbox rocket smoke). **Ending:** the CTA as text or a pill, then
the logo resolve. Ahrefs and Loomly both return to a brand-colour ground for the outro.

**Recruiting variant (Dropbox):** belief statement → examples of products the staff built → "more than a pioneer"
→ culture/retention claim → "bring your big ideas" CTA → logo. The same visual grammar, but the content is
employer branding (see §13).

## 5. Visual system

### Palettes (hex from `metrics.json` unless marked *eyeballed*)

| role | Loomly (grain pastel) | Ahrefs (line-icon) | Dropbox (inked editorial) | Breeze poster (tonal) *eyeballed* |
|---|---|---|---|---|
| background | #fcfcfd white (36 %); blob #efeffb lavender (21 %) | #f5f6f9 (66 %); colour field #0e3e7c navy (23 %: 2 scenes) | #f2f0ed warm off-white (31 %); space #1b1919 | sky #a9c1f5, ground #dde7fb |
| primary | #4a8d74 teal-green (deeper #2f7a6e *eyeballed*) | navy outline about #1d3c6e *eyeballed* | sky cyan #71cde5 → pale #c1dfea | cobalt #2457d6 |
| secondary | periwinkle #acb5d6 / lavender #9b8fe0 *eyeballed* | teal #478a92 / bright teal #3ec1a0 *eyeballed* | lilac-grey #bfb4c0; lime #b8ba4b (wall lime #aed84f *eyeballed*) | mid blue #3f6fe0 |
| accent | peach #efb88f, coral #f08f7a *eyeballed*; bubble green #5dbb73 *eyeballed* | coral #d87c4d (rendered about #f05a4a), yellow #f5c242 *eyeballed* | brand-like cobalt #297de9 (avoid in original work), salmon #e9a59b *eyeballed* | brown ball #7a2e1c |
| shadow | none (grain instead) | stacked offset copies #d4e5f1 / #9cb5cc | one cel tone, 15–20 % darker than the base | navy #0d2a6b |
| highlight | grain-dissolved lighter tint of the base | white | white glints on glass | pale #c9d8fb |
| text | white on green bubbles; #2f7a6e headers | navy captions; white / teal / coral on navy | none on screen except the logo | none (studio watermark only) |
| line | none (white hair-highlight strokes only) | 5 px navy | 2 px ink #1b1919 | none |
| cream / paper | #f5edca, #f1fbe1 | #e6c39f sand | — | — |

Rules: **4–6 hues, all at similar lightness except one dark anchor** (teal, navy, ink or deep blue). Saturation
is kept low on large areas (Loomly saturation 0.13; Ahrefs 0.25; Dropbox 0.25 with colourfulness 70 from strong
complementary pairs). Accent colours cover < 5 % of pixels.

### Shape language

- **Loomly:** rounded rectangles (UI cards, radius 12–16 px), circles (social-style icon badges about 230 px),
  amoeba blobs behind each vignette (one blob 60–80 % of the frame width, slowly morphing), a looped ribbon
  stroke (about 42 px, grainy green) connecting icons. Desk props: monitor, laptop, plant, mug, sleeping cat.
- **Ahrefs:** a geometric icon kit (browser windows, laptop, monitor, magnifier, coins, hourglass, banknotes,
  avatars in circles) with 6–10 px corner radii. Every object sits on a dashed ground line (a 2 px dash pattern
  across 40–50 % W). Doodles: 12–16 px rings, 30×14 px pills, 4-point sparkles, 20–40 px dashes, wavy lines and
  small plus/x marks.
- **Dropbox:** architectural primitives (cubes, domes, pyramids, geodesic spheres, tubes), one-point-perspective
  rooms, an isometric (30°) tile floor with floating islands, puffy cloud borders.
- **Breeze:** long tapering limbs, a curved horizon, big simple silhouettes cropped by the frame.

### Line work (1080p)

| dialect | stroke | weight | caps / joins | notes |
|---|---|---|---|---|
| Loomly | none | — | — | 3 px white strokes only as hair/fold highlights |
| Ahrefs | uniform navy on every object, avatar and doodle | 5 px (about 3 px at 720p) | round / round | keep a constant width under zoom (`vector-effect: non-scaling-stroke`); stacked copies offset (8, 8) and (16, 16) px with a lighter fill |
| Dropbox | uniform ink outline + interior detail lines | 2–2.5 px | round | detail lines (knuckles, folds) at 1.5 px |
| Breeze | none | — | — | a few thin dark interior accent lines |

### Texture, lighting, depth

- **Grain gradients (Loomly):** the highlight side of a shape dissolves into speckles (dot size 1–2 px at 1080p),
  like a stipple brush. Applied to sweaters, UI bars, icon badges and blobs. No smooth gradients anywhere else.
- **Ahrefs:** perfectly flat, with no gradients. Depth comes only from stacked offset copies and object overlap.
- **Dropbox:** flat cel fills with one hard shadow shape per object; a vertical sky gradient (#71cde5 → #c1dfea);
  glass domes with a white rim highlight; a light-cone from the desk lamp at 20 % white.
- **Parallax:** Dropbox's city flight has 3–4 depth planes (fg buildings move about 2× the bg). Loomly and Ahrefs
  are single-plane; the camera zooms.
- **Composition:** one vignette **centred**, occupying 30–45 % of the width (Ahrefs objects about 630 px wide;
  Loomly vignettes 70–85 % including the blob), with a 12–20 % safe margin. Captions sit directly under the
  object (Ahrefs). Speech bubbles orbit the character at 3 points around the head (Loomly). Negative space is
  generous: Ahrefs leaves about 60 % of the frame as empty off-white at any time.

### Typography (sizes at 1080p)

| use | Loomly | Ahrefs | Dropbox |
|---|---|---|---|
| free look-alike | Montserrat 400/700 | Nunito 700 or Quicksand 700 (rounded humanist; Brandon-like) | none needed (no on-screen text) |
| captions / bubbles | white 30 px in green bubbles; one sentence per bubble | navy lowercase captions under objects, about 42 px cap height; letters bounce in one by one | — |
| headlines | "JANUARY" calendar header in 28 px bold caps | navy-scene headlines about 75 px; word-by-word reveal; key nouns in teal, brand in coral | — |
| end lockup | lowercase wordmark that draws on as a stroke; tagline 22 px green | lowercase wordmark, coral "a" + white | wordmark only |

Text quantity: low. On-screen words are labels, not subtitles. Ahrefs shows about 50 label and headline words in
91 s against 206 spoken; Loomly shows only bubble text and labels; Dropbox shows none (UI glyphs only).

## 6. Characters & objects

**Loomly-style figure (grain pastel)**
- Proportions about 7 heads tall for the crowd, slim torsos, long legs, small heads. The hero woman is framed
  waist-up, head about 1/4 of the visible height.
- Face: almond or dot eyes, short brow strokes, a tiny nose line, a small mouth, no outline. Hair is one dark mass
  (#2b2420 *eyeballed*) with 2–3 white 3 px highlight strokes. Skin is flat peach.
- Clothing: flat lavender, teal, coral or yellow with grain highlights. Hands are simple mittens with fingers
  suggested.
- Acting: one clear emotion per shot (overwhelm = hand on head, arm raised; the closing crowd = waving, thumbs-up,
  smiling). Loops of about 1.2 s. Speech bubbles carry the inner monologue instead of lip-sync.
- Movement: a **cut-out puppet** (rotation at shoulder, elbow, wrist, neck), with secondary hair sway. The
  entrance is a dolly from foreground scale (see T2). There is no line boil.

**Ahrefs-style avatar (line-icon)**
- Bust in a circle (about 185 px diameter): head about 70 % of the circle, big rounded hair shapes in yellow,
  orange or red, dot eyes, a simple smile, a 5 px navy outline. Four diverse avatars represent "customers".
- Acting: pop on, bob ±6 px, and float as thought-bubble chains. There is no body.
- Objects do the acting: coins stack, an hourglass flips, a magnifier sweeps, numbers count up ("visitors: +274").

**Dropbox-style figure (inked editorial)**
- Realistic-leaning proportions (7–7.5 heads). **Forced perspective**: hands typing at the desk are drawn about
  head-sized and fill the lower third. Faces have almond eyes with lid lines and lashes, defined noses, coloured
  lips, and accessories as identity (mirrored shades, headphones, hoop earrings, coloured nail polish matching the
  room's accent).
- Each character gets a **colour room**: a one-point-perspective box with a single wall colour (white, salmon,
  lime) and a window prop (skyline, sunset).
- Movement: the typing hands are **cel-animated on twos** (finger shapes change every 2 frames at 24 fps,
  measured 8.0–8.7 s). Heads are mostly held with small tilts. Isometric "team" scenes use a rigged cut-out.

**Breeze (poster):** elongated anatomy, a dramatic camera (worm's-eye looking up a kicking leg and cleat) and
clear sports-metaphor staging. Proportions cannot be judged from one frame.

**Recurring props:** monitors, laptops, phones, calendar grids, social-style icon badges (use generic glyphs,
not real logos), chat bubbles, paper planes for "send", charts with an arrow up, coins, hourglass, magnifier,
browser windows with star-ranked list rows, testimonial cards (avatar + two-colour text + thumbs-up).

## 7. Camera & transitions catalogue

Durations are measured on the source frame rate and given in frames at 24 fps (and 30 fps).

| # | transition | frame-by-frame build | duration @24 (@30) | easing | frequency |
|---|---|---|---|---|---|
| T1 | **Pull-back reveal from a texture** (Loomly 0.3–2.5 s) | open on an extreme close-up of one element (about 600 % scale) with radial zoom blur; the camera pulls out continuously to 100 %; props pop into the widening frame with a 3–4 f stagger (pencil cup, sticky notes, shelf, plant, cat) | 52 f (65) | expo.out (blur decays with velocity) | opening (1×) |
| T2 | **Character dolly from the foreground** (Loomly 5.4–6.4 s) | the character enters at about 250 % scale from the near-left, heavily blurred, and settles to 100 % in place; the arm action starts at about frame 10; bubbles pop after it lands | 24 f (30) | power3.out | 1–2× |
| T3 | **Bubble / badge pop** | scale 0 → 108 % → 100 % from the bubble tail or badge centre; staggered 0.5–1 s apart in sync with the VO list (bubbles) or 6 f apart (icon badges) | 4–5 f (5–6) | back.out(2) | every vignette (Loomly about 40 pops) |
| T4 | **Whip-pan exit** (Loomly 10.1–10.7 s) | the whole vignette slides left one frame width with horizontal blur; 2–3 f of blank ground; the next element swings in | 6 f + 3 f gap (8 + 4) | power2.in | 3× |
| T5 | **Unfold / swing-in card** (Loomly calendar 10.9–11.5 s) | a card rotates in from a corner with skew 20° → 0°; the grid lines draw; the header text fades in last; then badges pop around it | 15 f (19) | power3.out | 2× |
| T6 | **Push-through to a blank field** (Loomly 31.9–33.5 s) | the camera pushes into one element (the cat picture) with motion blur until the frame is a flat light field (12 f); the field is held 3 f; the next card grows from a centre dot (18 f); the content then populates | 33 f total (41) | expo.in → expo.out | 2× |
| T7 | **Logo resolve with a line-draw wordmark** (Loomly 65.1–67.6 s) | the mark pops large on white; a lavender grain blob grows behind it; the mark shrinks to about 45 % and slides left (30 f); the wordmark strokes draw on (24 f, stroke-dashoffset); the tagline fades in (12 f) | about 66 f (83) | power3.inOut; linear draw | end |
| T8 | **Primitive-square morph** (Ahrefs 4.8–5.9 s) | the outgoing illustration collapses into a coral square (8 f); the square squashes and stretches, then morphs into the incoming object's silhouette (12 f); details pop inside it with a 2 f stagger; the caption letters bounce in under it | about 27 f (34) | power2.inOut morph; back.out pops | the house transition (about 8×) |
| T9 | **Drop + squash/stretch** (Ahrefs 37.6–38.6 s) | the square falls in rotated 20° and lands (5 f); squash scaleY 0.6 / scaleX 1.3 (2–3 f); stretch scaleY 1.4 (2–3 f); settle; then it grows into a tall rect → monitor | 24 f (30) | power2.in fall, elastic-ish settle | 2× |
| T10 | **Motion-path pop** (Ahrefs avatars, 6.4–7.5 s) | a curved line draws in from offscreen (3 f) and ends in a circle that pops into an avatar (3 f); thought-bubble dots trail; the next avatar follows 5 f later | 6 f each, 5 f stagger (8 / 6) | power2.out | 4–6× |
| T11 | **Slide-off + swoosh cut to a colour field** (Ahrefs 30.9–31.6 s) | the objects exit left staggered over 14 f; 2–3 thin coloured swoosh strokes sweep across; a hard cut to the navy field while the swooshes continue, so the cut is masked by continuous line motion | 14 f + cut (18) | power2.in | all 3 hard cuts |
| T12 | **Word-by-word headline** (navy scenes) | each word appears as it is spoken (about 5 f per word at 140 WPM, about 3 f fade/slide-up 10 px); the key word in teal, the brand in coral | per VO | power2.out | 3 lines |
| T13 | **Circuit-trace pan** (Ahrefs 76–85 s) | orthogonal lines with rounded corners draw at about 800 px/s; nodes pop (rings, squares, x, squiggles); testimonial cards pop at line ends; the camera pans to follow the leading line | 9 s sequence | linear draw; power1.inOut pan | outro |
| T14 | **Logo-window iris** (Dropbox 0.0–2.4 s) | a single brand shape tumbles in (8 f), unfolds into the full mark (4 f), files arc out of it (16 f, cel tumble); the mark rushes toward camera (14 f) until its negative space becomes a window onto the world; a cloud-edged window expands to full frame (8 f) | 58 f (72) | expo.in rush, expo.out iris | opening |
| T15 | **Diegetic cloud wipe** (Dropbox 25.5–26.6 s) | rocket exhaust clouds billow to cover the frame (14 f) as the camera tilts up; the clouds part on a new scene (space) (8 f) | 22 f (28) | power2.inOut | 1× |
| T16 | **Screen-to-world pull-back** (Dropbox 38.1–40.5 s) | a glare sweep crosses the "space UI" (it is a screen); the camera pulls back to show the tablet bezel, then the person holding it, then rotates into an isometric team scene | 58 f (72) | power2.inOut | 1× |
| T17 | **Screen-as-portal push-in** (Dropbox 6.0–7.5 s) | a floating window in the city scene grows until its content (a character in a room) becomes the new frame | 36 f (45) | expo.in | 1× |
| T18 | **Rhythm cuts on action** (Dropbox 9.75, 11.4 s) | hard cuts between three characters in identical framing, each typing; continuity through matching poses | shots of 1.6–2.4 s | — | 1 run |
| C1 | **Idle canvas** | doodles drift ±6–10 px on 3–5 s sine loops; blobs morph at about 0.1 Hz; icons bob ±6 px over 2 s; the camera breathes ±1 % scale over 4 s | continuous | sine.inOut | always |

## 8. Motion grammar

- **Easing families:** power3.out for entrances; expo.out for big camera reveals (pull-backs); expo.in for
  push-throughs; back.out(1.7–2.2) for pops (overshoot 8–15 %); sine.inOut for idles. Ahrefs adds cartoon squash
  and stretch (±30–40 %) on landings. Linear only for stroke draws.
- **Stagger intervals:** details inside an object 2 f (Ahrefs); badges around a hub 6 f (0.25 s, Loomly
  calendar); avatars 5 f; bubbles timed to each VO list item (0.5–1.0 s); caption letters 1–2 f with a bounce.
- **Build-on order:** ground line / blob → main object (morph or swing-in) → interior details → caption → orbiting
  badges / avatars → connector lines and ambient doodles. Exits run in reverse, or the whole vignette leaves with
  the camera.
- **Holds:** the built vignette holds 1.5–4 s while the VO finishes the sentence (Ahrefs holds 34 % of all
  frames). Something small always idles; the hold is never totally frozen.
- **Rhythm vs narration:** **the noun drives the pop**. Objects and badges appear on the word that names them
  (avatars on "customers", "no traffic / no leads / no sales" one per word; the navy headline word-by-word). Scene
  changes land just after sentence starts (Loomly 0.2–1.0 s later). Transitions occupy the breath between sentences
  (0.3–1.0 s).
- **Secondary motion:** hair sway on character turns (2–4 f lag), bubble tails wobble, a coin flips while
  stacking, a cat tail on a 2 s loop (Loomly).
- **No line boil and no cel jitter** except Dropbox's hand-drawn hands. Everything else is clean keyframed vector.

## 9. Sound (inferred)

- **VO:** a single narrator, friendly and clear, almost wall-to-wall (silence 0–0.8 s), at 136–140 WPM (Loomly,
  Ahrefs). Dropbox is a brisk 172 WPM, captioned "[Narrator]". The Reddit thread's opening post singled out
  Ahrefs' VO as the weak point while praising its look (see §12), so use a natural, warm read rather than a
  hard-sell ad cadence.
- **Music:** a light, upbeat corporate bed (*inferred*: plucks, ukulele / marimba / glockenspiel, claps, about
  100–120 BPM). Dropbox's captions mark "(cheerful music)". The music carries the 6–8 s logo tail after the last
  VO line.
- **SFX:** soft pops for each badge / bubble (short sine blips), whooshes for whip-pans and push-throughs,
  paper / swish sounds for swing-ins, a ka-ching or tick for counters. About 1 SFX per 1–2 s, quieter than in the
  launch style.
- **Mix:** music ducked about 12 dB under the VO; masters vary (−10.9 to −17.7 LUFS). Target about −16 LUFS
  integrated for web.

## 10. Do / Don't

**Do**
1. State the problem in the first sentence, over a literal picture, with no title card.
2. Keep one centred vignette per VO sentence (4–8 s) and change it on the sentence start.
3. Let the next object grow out of the last one (square morph, push-through, screen-as-portal), so the canvas
   reads as one continuous take.
4. Pop objects on the noun that names them; stagger interior details by 2 frames and orbiting badges by 6 frames.
5. Commit to one drawing dialect: no-outline grain pastel, or uniform 5 px round-cap outlines, or 2 px ink + cel
   shade.
6. Keep a constant stroke width under camera zoom (`vector-effect: non-scaling-stroke`).
7. Keep 50–60 % of the frame as empty light ground; float 8–14 ambient doodles at the edges.
8. Use speech bubbles (inner monologue) instead of lip-sync for characters.
9. Save a colour-field scene (navy / brand colour) for the pivot question and the outro.
10. Show proof as a counter, a crowd with result bubbles or testimonial cards in the last 25 %.
11. End with one CTA line, then a 6–10 s logo resolve on the same ground with the music tail.
12. Bookend the energy: a moving reveal in the first 2 s and a lively outro; calm in the middle.

**Don't**
1. Don't hard-cut between vignettes (allowed only behind a colour-swap swoosh or in one rhythm-cut run).
2. Don't subtitle the VO; on-screen text is labels and key words only.
3. Don't mix stroke styles or weights between objects.
4. Don't use smooth glossy gradients, glows or drop shadows in the line-icon or grain dialects.
5. Don't fill more than about 45 % of the width with the main object.
6. Don't let pops run without overshoot, or overshoot by more than 15 %.
7. Don't animate characters with lip-sync or long dialogue acting. One emotion, one loop, one gesture.
8. Don't introduce more than one dark scene family in a light film.
9. Don't use real brand icons (social networks, chat apps), a client's logo shapes or existing mascots. Draw
   generic badges.
10. Don't read the VO above about 150 WPM for a product explainer (Dropbox's 172 works only for a manifesto).
11. Don't leave a vignette fully frozen. Idle doodles, bob and blob morph keep it alive at a motion of about 3.
12. Don't end on a hard cut to black right after the CTA. Resolve the logo on the ground first.

## 11. Replication recipe (code)

**Rendering model.** SVG scene in HTML, a GSAP master timeline (paused), Playwright frame-stepping
`tl.seek(f / FPS)` at 1920×1080, 24 fps (Loomly/Dropbox feel) or 30 fps (Ahrefs). All idles must be functions of
time (`sin(2π t / period + phase)`), never incremental. Use accumulation motion blur (4–6 sub-frames) for T1,
T2, T4 and T6 only. Everything else is crisp.

**Layer stack (back to front):** `ground` (flat colour) → `blobs` (1–2 amoeba paths, slow morph, grain) →
`cam` group {vignette groups: ground line, object, details, captions, badges, character} → `doodles`
(screen-space, not affected by the camera zoom) → `fx` (swoosh lines, sparkles) → optional `grain` overlay (none
for Ahrefs).

**Camera rig.** `<g id="cam" transform="translate(960 540) scale(z) translate(-cx -cy)">`. Each vignette lives at
its own world coordinate (for example a 4000 px-wide strip, vignettes 1600 px apart). Whip-pans tween cx (6 f,
power2.in) with a horizontal accumulation blur. Push-throughs tween z from 1 to 8 on the element's centre
(expo.in, 12 f). Pull-backs start at z = 6 (expo.out, 52 f).

**Stroke system (Ahrefs dialect)**

```css
.ink   { stroke:#1d3c6e; stroke-width:5; stroke-linecap:round; stroke-linejoin:round;
         vector-effect:non-scaling-stroke; }
.stack { transform: translate(8px,8px); fill:#d4e5f1; }       /* duplicate path, drawn behind */
.stack2{ transform: translate(16px,16px); fill:#9cb5cc; }
```

**Grain-gradient fill (Loomly dialect).** Draw the shape in its base colour. Draw a second copy in the highlight
colour and mask it with a gradient that is broken into speckles:

```html
<filter id="dither" x="0" y="0" width="1" height="1">
  <feTurbulence type="fractalNoise" baseFrequency="0.95" numOctaves="1" seed="4" result="n"/>
  <feComposite in="SourceGraphic" in2="n" operator="arithmetic" k1="0" k2="1" k3="0.7" k4="-0.35" result="s"/>
  <feComponentTransfer in="s"><feFuncA type="discrete" tableValues="0 1"/></feComponentTransfer>
</filter>
<mask id="m-sweater" style="mask-type:alpha">
  <rect width="100%" height="100%" fill="url(#fadeTopToBottom)" filter="url(#dither)"/>
</mask>
<path d="…sweater…" fill="#9b8fe0"/>
<path d="…sweater…" fill="#c9c2f2" mask="url(#m-sweater)"/>
```

The gradient alpha plus the noise is thresholded, so the highlight dissolves into 1–2 px dots. Tune k3 for the
speckle spread and baseFrequency (0.8–1.2) for the dot size. Verify on a rendered frame, since filter output
depends on the element bbox. Use a fixed seed per shape so the grain does not crawl between frames (Loomly's
grain is static on the shape).

**Ink + cel dialect (Dropbox).** Base fill + one shadow shape (`fill` 15–20 % darker, no blur) clipped to the
form; outline paths at 2 px `#1b1919`; hands as 3–4 drawn pose sprites swapped on twos (`Math.floor(t * 12) %
n`); rooms as one-point perspective trapezoids with a single wall colour.

**Core helpers (pseudo-code)**

```js
const FPS = 24, F = n => n / FPS;
const pop = (el, at) => gsap.fromTo(el, { scale: 0, transformOrigin: "50% 50%" },
  { scale: 1, duration: F(5), ease: "back.out(2.2)" }, at);

function morphPrimitive(fromGroup, square, toPath, details, at) {           // T8
  return gsap.timeline()
    .to(fromGroup, { scale: 0.2, autoAlpha: 0, duration: F(8), ease: "power2.in" }, at)
    .fromTo(square, { scale: 0 }, { scale: 1, duration: F(6), ease: "back.out(2)" }, at + F(4))
    .to(square, { scaleY: 0.6, scaleX: 1.3, duration: F(2), yoyo: true, repeat: 1 }, at + F(10))
    .to(square, { morphSVG: toPath, duration: F(12), ease: "power2.inOut" }, at + F(14)) // MorphSVG (free in GSAP 3.13+) or flubber
    .add(details.map((d, i) => pop(d, at + F(26 + 2 * i))), at + F(26));
}

function captionBounce(chars, at) {                                         // letters drop in
  return gsap.from(chars, { y: -30, autoAlpha: 0, duration: F(6), ease: "back.out(3)", stagger: F(1.5) }, at);
}

function doodleIdle(el, i) {           // pure function of time, called from a single ticker on seek
  return t => gsap.set(el, { x: 8 * Math.sin(2 * Math.PI * t / (3 + i % 3) + i),
                             y: 6 * Math.cos(2 * Math.PI * t / (4 + i % 2) + i * 1.7) });
}

// master: problem → pivot → features → proof → CTA → logo; cue times from Kokoro word timestamps
script.sentences.forEach(s => tl.add(VIGNETTES[s.id].build(s), s.start - F(4)));
script.nouns.forEach(n => tl.add(pop(n.el, n.t), n.t));
```

**Character rig (cut-out puppet).** Nested SVG groups: body → (neck → head → [hair, eyes, brows]), (shoulder →
upper arm → forearm → hand), with `transform-origin` at the joints. A blink every 2.5–4 s (eyes scaleY 1 → 0.1 →
1 over 4 f). The head tilts ±4° on emphasis words. A gesture loop is a 3-key cycle of about 1.2 s
(sine.inOut). Hair is a separate group lagging the head by 3 f. No mouth animation.

**Defining shots and how to build them**

1. **The pain vignette** (Loomly 4–10 s). A desk scene (monitor, laptop, shelf, plant, sleeping cat) on a
   lavender blob (about 75 % W). The character dollies in from the foreground (T2) and lands at a 1/3 offset,
   then a hand-to-head loop plays. Three green bubbles pop one per VO pain, placed at about 10, 2 and 7 o'clock
   around the head, each 280–360 px wide with 30 px white text.
2. **The centred line-icon object** (Ahrefs passim). A 600 px object in 5 px navy stroke sits on a dashed ground
   line at y = 62 % H; a lowercase caption 40 px below; 10 doodles at the edges idling; a stack copy offset for
   depth. Build by T8 from the previous object; detail pops every 2 f; caption letters bounce.
3. **Square-to-object morph** (Ahrefs 4.8–5.9 s, 37.6–40.4 s). A coral square falls, squashes and stretches,
   morphs into a monitor silhouette (MorphSVG), its screen fills with list rows that pop top to bottom, and an
   accessory (a mug) pops last.
4. **Hub and orbit badges** (Loomly 13–25 s, 41–56 s). A central card (calendar or post preview) swings in (T5).
   6–8 circular badges (about 230 px, grain-gradient fills, generic glyphs) pop around it at a 6 f stagger, each
   bobbing ±6 px; a grainy ribbon stroke loops between two badges (DrawSVG 18 f).
5. **Colour-field pivot and circuit outro** (Ahrefs 31.6–37.5 s, 76–91 s). The swoosh-masked cut (T11) lands on a
   navy field; a two-line question builds word by word (T12) with one teal and one coral word. The outro draws
   orthogonal traces (T13) that end in testimonial cards and a big "over 600 000 users"-style stat. The CTA pill
   is outlined in white with a coral key word.
6. *(Inked dialect)* **Colour room + forced perspective** (Dropbox 7–13 s). A one-point room box in a single wall
   colour, the character centred at the back, and huge cel hands typing in the foreground on twos. Use three of
   these as a rhythm-cut run of 1.6–2.4 s each, then exit through a screen-as-portal (T17) or a diegetic wipe
   (T15).

**Audio build (synthesised):** a 108 BPM bed (plucked marimba/ukulele chords, light claps on 2 and 4, glock
melody), sine blips for pops (900 → 1400 Hz, 40 ms, −18 dB), band-passed noise whooshes (150–250 ms) for whips
and pushes, a soft chime on the logo. Kokoro VO (a warm, natural voice; speed 1.0), word timestamps drive the noun
pops; duck the music 12 dB; master to about −16 LUFS.

## 12. Per-video notes

**Welcome to Loomly (72 s)**
- Characters are on screen only about 20 % of the runtime (about 5–11 s and 57–65 s). The middle is all object/UI
  vignettes (calendar, approvals, media library, optimisation, replies, analytics). "Character-driven" fits only
  the bookends.
- The grain gradients are the signature. The stipple is static on each shape; it does not crawl or boil.
- The single measured cut (57.6 s) is a fast zoom-blur into a close-up of two characters, effectively a
  whip-zoom. Everything else is pull-back, push-through, whip-pan and swing-in.
- Energy sits only in the bookends (deciles 1 and 9 about 19, middle 3.6–8.8).

**What is Ahrefs? (91 s)**
- The calmest film in the article (motion 2.86; hold 34 %). The style lives in the build moments: the
  square-morph transitions, squash and stretch, and letter-bounce captions.
- All 3 hard cuts are white ↔ navy colour swaps, masked by continuous swoosh lines.
- The Reddit thread's opening post praised its clean vector style and motion principles, pairing it with
  Reddit's mobile-app video, but disliked its VO. The Reddit video was not available for this pass, so that
  pairing could not be checked visually here (`explainer-clean-vector` confirms it later).
- The "characters" are avatar busts. The object kit carries the story.

**Dropbox – Build the Future at Dropbox With Us (53 s)**
- The most colourful film in the article (69.8) and the most cinematic camera: a logo-window iris, a city flight
  with parallax, rooms, a rocket, space, then a pull-back from a tablet screen into an isometric team.
- Hands are cel-animated on twos; everything else is a cut-out or camera move.
- Content is recruiting (see §13). It is useful here only as an inked editorial dialect and for its camera ideas.

**Breeze (Inflix Studios, 84 s): poster only**
- One frame: an extreme worm's-eye view of a kicking cleat, the ball in the distance, goalposts on a curved
  horizon, monochrome blues with a brown accent, no outlines. The studio watermark sits bottom-right.
- The article's football-metaphor description cannot be verified beyond this frame; no motion, pacing or sound
  data.

## 13. Source-list issues

- **Dropbox (#13) is not a product explainer.** The video is "Build the Future at Dropbox With Us | Life Inside
  Dropbox", a recruiting film whose description points to dropbox.com/jobs. The script is about employees and
  culture. The article's "Video Overview" ("explains how Dropbox helps teams store, organize, and share files…
  scattered documents") describes a different video, plausibly the classic "What is Dropbox?" explainer, which a
  commenter in the same Reddit research thread also cites. The article also files it under "Complex Tech & AI
  Simplification".
- **Loomly duration is wrong:** the article says 1 min 30 s; the video is 72 s. "Clean character animation" is
  thin: characters appear in about 20 % of the runtime. The "pastel palette, textured gradients" claim is
  accurate.
- **Ahrefs is a 2016 video** in a "to watch in 2026" list. Its "bright accent colors" are real but tiny (coral and
  teal together < 4 % of pixels; 66 % off-white + 23 % navy). It is icon-driven, not character-driven.
- **Breeze could not be analysed:** poster frame only, plus oEmbed metadata (84 s, Inflix Studios,
  an agency portfolio upload with a burned-in watermark).
- **Live-action entries in an "Animated" list:** Slack (#17, 2014, produced by Sandwich Video, credited on a title
  card at 0:36) is about 9 % flat graphics. 11ai (#18) has no UI overlays at all, despite the article's "clean UI
  overlays" (see the appendix). Its `animated_frac` of 0.364 is a false positive caused by shallow-depth-of-field
  footage.
- **No studio credits** anywhere in the article, while several entries are agency portfolio pieces.

---

## Appendix — "UI overlay on footage" module (from Slack #17 and 11ai #18)

| id | title | dur (s) | fps | cuts/min | median shot (s) | motion | colourfulness | WPM | LUFS | animated_frac |
|---|---|---|---|---|---|---|---|---|---|---|
| B6zVzWU95Sw | "So Yeah, We Tried Slack …" (Slack, 2014; Sandwich Video) | 140.3 | 23.976 | 27.81 | 1.88 | 10.56 | 32.5 | 163.0 | −15.0 | 0.093 |
| HOg8jPLTwLI | Introducing 11ai (ElevenLabs, 2025) | 65.6 | 25 | 17.37 | 3.02 | 8.69 | 21.3 | 133.5 | −17.5 | 0.364 (artifact) |

**How much is animated**
- **Slack:** full-frame graphics or UI cover about 9 % of the seconds: two logo cards (0:36–0:37, 2:17–2:20),
  screen-recording inserts (1:27–1:28, 1:43–1:44, 1:59–2:00) and phone-screen inserts shot practically. Overlays
  composited onto footage appear in about 45 % of the 66 shots (10 lower thirds, about 12 tracked message cards
  and channel tags, 3+ integration wordmarks, one card storm), but they cover only 5–20 % of the frame, so the
  flat-shade metric ignores them.
- **11ai:** a 1-fps scan of all 66 s shows **zero UI overlays**. The product (a voice assistant) is conveyed by
  the dialogue alone. The only graphics are end titles: the product name and tagline over a defocused plate
  (57.6–61.4 s) and the brand wordmark over the punchline shot (61.9–65.6 s). That is about 8 s, or 12 %, all
  type. The 0.364 animated share is shallow-depth-of-field bokeh read as flat shading.

**Overlay types and how they are built (Slack)**

| overlay | look | placement | timing (measured @23.976) |
|---|---|---|---|
| lower-third name tag | rounded-square photo avatar about 140 px (radius about 14 px, 4 px light border) + lowercase name in bold white (Lato-like, about 95 px font / 48 px x-height) + role line in regular white (about 40 px font); no plate, soft shadow (measured on a native 720p crop, scaled ×1.5) | avatar left edge at about 13 % W; name baseline about 82 % H, role baseline about 88 % H | appears 17 f (0.7 s) after the cut; 6 f fade + 10 px rise; holds to the end of the shot (2–3 s); only on a speaker's first appearance (10 people) |
| tracked message card | white rounded card about 735 × 165 px (radius about 9 px, 85–92 % opacity), photo avatar about 95 px + bold name (about 36 px cap height) + grey timestamp + message line (about 45 px font, dark grey) | in the negative space beside the face (subject on one third, card on the other); corner-pinned to a plane parallel to the monitor/window; tracked with the camera move | pop = scale 90 → 100 % + fade + 2 px blur → 0 in 4–6 f; text types at about 35–40 cps (33 characters in 20 f); a reply card stacks below about 1 s later; exit = fly toward camera with blur in 3–4 f, **or the card carries over the cut** and continues in the next shot |
| channel tag in 3D | teal pill "#channel" lying on the desk surface in perspective; in a wide shot a large white "# channel" label floating in room depth with a member list | anchored to real surfaces / room depth (motion-tracked) | types on at 1 char per frame (16 f); message card pops 8 f after; member rows pop every 8–12 f |
| card storm ("overload") | dozens of message cards streaming along diagonal perspective lines over a top-down shot, motion-blurred | full frame, following the desk perspective | 3.8 s (32.1–35.9 s), density ramps up, then a hard cut to the white logo card: the climax of the problem act |
| integration wordmark pop | a partner wordmark pops beside the speaker as the VO names it | upper-left or beside the head | about 1 s each, word-synced |
| logo card | white full frame, the mark assembles by rotating into place (about 8 f), credit line pops | centre | 1–3 s |

**Grade and integration rules:** warm tungsten office footage (brick, wood). Overlays stay neutral white with
grey text so they never fight the skin tones. No glows, no 3D extrusion. Every overlay respects the shot's
perspective and moves with the camera (2D corner-pin tracking is enough). Cards are never placed over faces.
Cuts stay fast (median shot 1.9 s); overlays add information without slowing the edit.

**11ai end-title rules:** after the last line of dialogue, rack or hold a defocused plate; the product name
(white, a bold grotesk, about 78 px cap height at 1080p, centred at 50 % H) decodes letter by letter (about 1 s);
the tagline (medium weight, about 36 px cap height, baseline at about 62 % H) fades in 0.5 s later; hold 1.5 s; the name decode-swaps into the company wordmark across a cut to a gag shot (about 12 f).

**Reusable module spec**
1. **Inputs:** footage clip + a track (four corner points per frame, or a 2D position/scale/rotation curve) +
   overlay content (avatar, name, message) + VO timestamps.
2. **Lower third:** start = cut + 0.7 s; fade/rise 6 f; hold to the shot end; avatar at 13 % W, name baseline
   82 % H; lowercase name at about 95 px bold + role at about 40 px regular; 140 px avatar square.
3. **Message card:** pop 5 f (back.out(1.4), scale 0.9 → 1); type-on at 36 cps; reply after 24 f; place on the
   empty third opposite the subject; corner-pin to the tracked plane; exit 3 f toward camera, or persist across the
   cut when the next shot continues the same conversation.
4. **Tag/label in space:** type-on 1 char/frame; anchored to a floor/desk plane; children pop every 10 f.
5. **Climax storm:** 30–60 cards on 3–4 perspective lanes, speeds 0.6–1.2 W/s, 3–4 s, then a hard cut to the
   logo card.
6. **Build in HTML/SVG:** render overlays as a transparent PNG sequence (`omitBackground: true` in Playwright),
   with each overlay's `matrix3d` computed per frame from the four tracked corners (a homography). Composite onto
   the footage with ffmpeg `overlay`, adding a 1 px blur and a 3 % grain match so the cards sit in the plate.
7. **Audio:** a soft notification tick on each card pop (−24 dB), typing ticks under fast type-ons, no music
   stingers; the VO and diegetic office sound lead.
