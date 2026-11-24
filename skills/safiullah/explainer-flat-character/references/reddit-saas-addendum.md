# Reddit SaaS / product picks — addendum for saas-ui, launch-promo, flat-character

**Scope.** These are the 13 product videos that two commenters dropped into the r/MotionDesign thread "Best Explainer Videos
LET'S MAKE A LIST" (`raw/reddit.txt`):
- **A Content Beta commenter** posted 11 links (line 69). One of them, Fostr AI `Mq8vICOCQaU`, was not available for analysis.
- **What a Story's founder** posted 3 of the agency's own films (line 54).

`gVcyghMTrtU` (What a Story's upload of Synoptix, already a saas-ui source) is included only as a comparator.

**Evidence.** For every video I read `timeline`, `strips` and `opening` (plus `ending` and `animated` where they existed), the transcripts and `info.json`. On top of that, `scratch_saas_extras/` holds:
- frame-accurate 30 fps contact sheets of the key transitions (`s1.jpg`, `s2.jpg`);
- a frame-difference comparison of the two Synoptix files (`cmp_synoptix.py`);
- low-threshold cut re-detection (`low_*.txt`, `cursor_cuts_*.txt`);
- a rough tempo/cut-alignment check (`beat.py`).

**Units.** Pacing uses `scene_changes_per_min` / `scene_len_median`. Frame counts are given at 30 fps. Hex values are k-means palette entries unless marked *eyeballed*. All sound statements are inferred from LUFS, silence, captions and descriptions; I heard no audio.

---

## 1. All 13 videos: metrics and verdicts

| # | id | what it is | made by (uploader) | dur s | scenes /min | scene med s | cuts /min | motion | hold | colour­ful | bright | WPM | LUFS | verdict → skill |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | An8IM-kPyms | Introducing Cursor 2.0. Music only, typed caption cards + real IDE screen capture | Cursor (brand) | 64.5 | 0.93 | 32.2 | 0.93 (11 crop cuts at score 0.08 ≈ 10/min) | 2.47 | 0.63 | 5.2 | 0.92 | — | −29.3 | **New type**: caption-card screencast → saas-ui sub-variant C (§3.7) |
| 2 | bQnSSVESxl4 | Introducing Breakout Blocks (website AI agents). Music-led kinetic type + a mutating website mock | Breakout (brand, 262 subs) | 138.0 | 16.08 | 2.41 | 7.39 | 11.28 | 0.027 | 46.7 | 0.88 | — | −13.2 | **launch-promo**, light-violet skin (§4.1) |
| 3 | PAlJb3_RT-g | Icons8 Vector Creator. 17 s flat-character opener, then music-only caption-card screencast | Icons8 (brand) | 67.1 | 12.53 | 3.00 | 1.79 | 8.30 | 0.276 | 30.3 | 0.84 | — | −16.0 | hybrid: **flat-character** opener (§5) + saas-ui C |
| 4 | MgRh-vN9ZBg | Synoptix AI, the brand channel's copy | Synoptix AI (8 subs) | 68.1 | 2.64 | 7.45 | 0.0 | 5.52 | 0.078 | 29.2 | 0.98 | 132 | −11.6 | **duplicate** of gVcyghMTrtU (already a saas-ui A2 source) |
| — | gVcyghMTrtU | comparator: What a Story's upload of the same film | What a Story | 68.1 | 2.64 | 7.45 | 0.0 | 5.65 | 0.010 | 29.3 | 0.98 | 130 | −11.6 | (existing source) |
| 5 | YZ_f7ZXU6rE | Meet Kaily (AI support agent). VO, lavender UI + stock footage + smile-face mascot mark | Fynd Kaily (brand) | 157.6 | 4.95 | 5.42 | 0.0 | 5.95 | 0.111 | 27.4 | 0.91 | 109 | −17.4 | **saas-ui** A2 Gradient AI + footage (§3) |
| 6 | ftRpLmy0vGg | DAX Optimizer. VO, white/mint UI on 3D planes, green accent | Burnwe (studio) for Tabular Tools | 98.1 | 0.0 † | 98.1 † | 0.61 | 4.57 | 0.124 | 20.1 | 0.93 | 135 | −14.3 | **saas-ui** A2 (§3) |
| 7 | FZbICrBKWIU | CleanShot X for Mac. VO + real macOS recordings on a 3D laptop mockup | CleanShot X (brand) | 156.0 | 9.23 | 4.17 | 12.69 | 6.66 | 0.197 | 35.6 | 0.46 | 131 | −12.9 | **New type**: device-mockup screencast → saas-ui sub-variant D (§3.8) |
| 8 | ATM0EBHkGyU | Campaign Audience Builder (a Salesforce app). VO step tutorial, blue/white, hard-cut colour fields | Burnwe (studio) | 65.1 | 6.45 | 7.31 | 6.45 | 6.55 | 0.121 | 41.8 | 0.90 | 147 | −13.7 | **saas-ui** A2 (§3) |
| 9 | q19RtuCHt1Q | What is Slack? VO, greeked vector UI on brand-colour chapter grounds, photo avatars | Slack (brand) | 72.1 | 10.82 | 3.66 | 1.66 | 7.41 | 0.442 | 52.9 | 0.73 | 145 | −24.5 | **saas-ui** A1/A2 "brand grounds" (§3) |
| 10 | Ft3QhSJq2FQ | Mailmodo. VO, stock live action + UI screenshots + burned-in subtitles | Mailmodo (brand) | 90.0 | 12.66 | 2.16 | 12.66 | 7.45 | 0.333 | 26.6 | 0.77 | 154 | −15.7 | saas-ui footage hybrid (template-grade; harvest 3 devices only, §3.9) |
| 11 | -zjLUCwO9CM | Amoeboids company profile. Slow VO, 3D glass world, ultramarine monochrome, hero orb | What a Story | 118.1 | 10.16 | 3.83 | 0.51 | 8.48 | 0.110 | 75.5 | 0.66 | 91 | −16.7 | **launch-promo**, VO brand-profile variant (§4.2) |
| 12 | G490yBQ-Vlg | Ticketsoft (NFT ticketing). AI voiceover (disclosed), black ↔ white alternation, orange | What a Story | 56.6 | 10.60 | 5.96 | 8.48 | 9.14 | 0.021 | 30.2 | 0.68 | 134 | −26.1 | **launch-promo**, VO variant (§4.2) |
| 13 | YGhqDxQfvro | CallCoach (AI call-centre coach). VO, periwinkle Gradient AI skin, medallion hub | What a Story | 77.8 | 4.63 | 10.84 | 1.54 | 6.71 | 0.011 | 38.7 | 0.96 | 118 | −17.2 | **saas-ui** A2; it confirms the skill (§3, §6) |

† **DAX scenes = 0.** The analyser's 64-bin histogram never changes on a white/mint film. A re-detection at scene score 0.10 finds 6 hand-overs (3.7/min, median gap 17 s), and the film really is continuous.

Even at score 0.10, Kaily (0.4/min) and CallCoach (1.5/min) stay cut-free. Their hand-overs are camera moves and masks, as the saas-ui skill says.

**Tally.**

| target | videos |
|---|---|
| saas-ui core | 6 (Kaily, DAX, Campaign, Slack, CallCoach, plus the Synoptix duplicate) |
| launch-promo | 3 (Breakout, Amoeboids, Ticketsoft) |
| new screencast types | 2 (Cursor, CleanShot) |
| hybrids | 2 (Icons8, Mailmodo) |
| full flat-character films | 0 |

---

## 2. What each video really is (short notes)

- **Cursor 2.0.**
  - A brand channel launch film with 9.5 M views.
  - The look is near-greyscale: colourfulness 5.2, saturation 0.026, ground `#F3F3F2`/`#FAFAFA`, ink `#171510`.
  - No VO. The master is very quiet (−29.3 LUFS).
  - Structure: typed caption cards ("Introducing …", "Run a task across multiple models", "Review changes in a single place", "Work with a built-in browser") alternate with real recordings of the IDE in a window over a painted landscape wallpaper.
  - It holds 63 % of the time, the highest hold in this set.
  - It is not a vector rebuild, so it does not match saas-ui's "vector UI, not screen recordings" rule.
- **Breakout Blocks.**
  - The brand's own launch.
  - The script is on screen: a hook paradox, then a 7-persona anaphora ("Some want answers… / Some watch before they buy… / …And some just want the vibe").
  - Each persona card is followed by the same generic website mock adapting to that persona.
  - Kinetic type on violet fields `#685DDD`/`#3C37AF` alternates with white UI.
  - Grammar is launch-promo (holds 0.027, 16 scenes/min), but the skin is light and the type is calm (caret typing, grey-to-ink).
- **Icons8 Vector Creator.**
  - A 2019 tutorial-promo with a credited library track.
  - 0–17 s: a flat character vignette (desk, dog, thought bubble) in pastel peach `#F5BAA4` on `#FBEDEC`.
  - Then 3D-tilted dark-UI recordings separated by tiny coral caption cards ("Pick a style", "Add & arrange elements", "Export to PNG or SVG").
- **Synoptix ×2.**
  - `MgRh-vN9ZBg` is the same master as `gVcyghMTrtU`: same 1280×720, 30 fps, 2040 frames, and a mean absolute difference of 0.1–0.9 grey levels at every sampled second (`cmp_synoptix.py`).
  - hold_frac reads 0.078 vs 0.010 on the two encodes. **Treat hold differences under ~0.07 as encode noise.**
  - WPM 132 vs 130 differs only because the caption sources differ.
- **Kaily.**
  - 158 s, so twice the saas-ui spot length.
  - The product is personified as "she".
  - Problem act: a greyscale chatbot comedy (an irrelevant bot answer, then the user's "WTF??").
  - Reveal: a twisting tile tunnel, then the mark, then a smile-face mascot.
  - Body: lavender UI mixed with stock footage carrying glass UI pills.
  - The opening logo sequence returns as the end card. There is no URL or CTA button; the CTA is verbal only.
- **DAX Optimizer (Burnwe).**
  - "Burnwe" watermark top-left for the whole runtime.
  - Opens on a one-point-perspective corridor of code panels.
  - The lock-up docks left as the product enters right.
  - A glossy 3D icon-tile triad, then feature captions in mixed light/bold weight.
  - End: logo, "No More Slowing Down", a green "Try It Out Today" pill.
- **CleanShot X.**
  - A maker's VO ("I'm sure you will love it").
  - Real macOS recordings on a 3D MacBook in a white void, shot at 20–45° yaw with Dutch tilts and a fake depth-of-field falloff.
  - 12.7 hard cuts/min between angles.
  - A feature-sizzle cold open (0–8 s), then the app icon as the title.
- **Campaign Audience Builder (Burnwe).**
  - A how-to in imperative voice ("Start with… Add filters… Hit Run. Voilà!") with STEP labels.
  - The problem montage is driven by a cursor labelled with a role.
  - Hard cuts alternate white UI scenes with royal-blue `#1F5EA2` fields.
  - The benefit triad is three hard-cut word cards; the end card carries two CTAs.
- **What is Slack?**
  - Brand film.
  - Opens on a photo of a thinking woman that becomes the avatar of a message card.
  - Each chapter (the uploader's own chapter list: 0:00 / 0:16 / 0:32 / 0:50 / 1:01) gets a flat brand ground: aubergine `#4A1949`, cream `#F1E7DA`, teal `#0894A4`, pink `#D2ABB1`.
  - Includes an emoji hero cut, a 3D clay turntable plate, and VO interjections ("—oh hi!—", "—a ha!—").
- **Mailmodo.**
  - Stock actors play the persona "Jane": at least two different actresses (0:03.8 blazer vs 0:36.2 striped shirt) under one name.
  - UI screenshots pop out of a laptop screen.
  - A pictogram attrition grid; burned-in subtitles for every VO line.
  - Craft is template-level. Use it as a source of devices, not as a style model.
- **Amoeboids (What a Story).**
  - A "company profile": the brand narrates itself with stats (1,200+ customers, 82 countries).
  - One continuous camera: 0.51 cuts/min, while 10.2 scenes/min come from content.
  - A mint glass orb (eyeballed `#8FE3C0`) travels through every act.
  - Colourfulness 75.5, the most vivid in the set, comes from one saturated hue (`#282DBF`/`#2025A6`/`#3B42DE`), not from variety.
- **Ticketsoft (What a Story).**
  - The description says "AI Voiceover" and states that the client supplied the script.
  - Grounds alternate between black with an orange glow (`#1E1A17`; 35 % dark frames) and white with an orange corner gradient (`#F4BF9A`).
  - The T6 logo-matte zoom bookends the film.
  - Includes a zoom-through a letter's counter and a spotlight stage.
- **CallCoach (What a Story).**
  - A textbook saas-ui A2 film: periwinkle `#5E7AE6` on `#EAECFB`, hold 0.011.
  - A logo medallion with ripple rings acts as the hub and as an anchor.
  - Includes a stat ladder and a cursor-clicked CTA pill.
  - "WHAT A STORY" watermark top-left throughout.

---

## 3. Add to explainer-saas-ui

### 3.1 Metric notes (what the 7 new VO SaaS films change)

| metric | skill target | new VO films (Kaily, DAX, Campaign, Slack, CallCoach, CleanShot, Mailmodo) | note |
|---|---|---|---|
| scene_changes/min | 2–8 | 0 † – 12.7 (core five 0–10.8) | Slack reaches 10.8 with only 1.66 cuts/min because its flat chapter grounds flip the histogram. A white single-accent film (DAX) can read 0. |
| scene_len_median s | 5–10 | 3.7–10.8 (DAX 98 †) | |
| motion | 5–7 | 4.57–7.45 | confirms |
| hold | ≤ 0.10 (A2) | 0.011–0.124 for A2-type (Kaily, DAX, Campaign, CallCoach); Slack 0.44 = A1-like | DAX and Campaign sit at 0.12, just over the gate. Allow ≤ 0.13. |
| colourfulness | 15–30 | 20–42; Slack 52.9 | Brand-ground chapter colours push colourfulness above 30. Allowed in the "brand grounds" sub-skin (§3.4). |
| WPM | 130–150 | 109–154 | Kaily (109) and CallCoach (118) leave longer music-only UI stretches. Under 130 is acceptable when the film runs over 75 s. |
| LUFS | −12 to −15 | −12.9 to −24.5 | Brand-channel masters run quiet (Slack −24.5, Cursor −29.3). Loudness is not a style marker; keep −13.5 as the default. |
| first-decile motion | — | 1.85× the mean in both Slack (13.7 vs 7.4) and CleanShot (12.3 vs 6.7) | A **hot cold-open** (a busy problem or feature montage) followed by calmer feature beats is common. Allow a first-decile motion up to 2× the mean. |

### 3.2 Script beats (new)

1. **Three-step reversal hook** (Campaign 0.0–7.5 s):
   - The steps are pain question → wish → reversal, ending with "Meet X" at 13 % of runtime.
   - VO pattern: "Tired of…? / Wish it was automated? / Well, guess what? It can be."
   - The reversal is typed word by word on white (5.0–7.5 s) right before the logo reveal.
2. **Greyscale "bad version" comedy** (Kaily 0.5–9.5 s).
   - The problem is acted out *in the UI*: a grey chatbot gives an absurd, irrelevant answer and the user types "WTF??".
   - Every problem bubble is grey `#9A9A9A`, and the bot icon is grey. The only colour is the user's emoji.
   - The brand accent appears for the first time inside the reveal tunnel (§3.3 T-K1).
   - This is a selective-colour problem act, distinct from Marvin's dark→light inversion.
3. **Persona name for the product.** Kaily calls the product "she" all through the film ("She gets every question…"), and the mascot mark (a smile face) is her avatar in every chat. Use this for agent and assistant products.
4. **Imperative "recipe" voice for how-to tools** (Campaign 13.8–42.8 s):
   - Second person with step verbs, one UI action per verb.
   - VO pattern: "Let's name it… Start with… Add filters… Connect… Hit Run. Voilà!"
   - Add an on-screen `STEP n` label per page.
5. **"That's not all" second wind.** A bridge line that re-opens a second feature block:
   - DAX at 46.7 s (48 %), "but that's not all";
   - CleanShot at 66.4 s (43 %), "That's not all";
   - Kaily at 2:10 (82 %), "What's more?" as a centred pivot card with "more?" in the accent.
   - Use it once, at 40–55 %, in films over 75 s.
6. **Question → feature pairs + one quip** (CleanShot):
   - Each block opens with a viewer question ("Ever had a video ruined because of a pesky notification?"), then the feature demo, then a quip of 8 words or fewer ("You never looked better.").
   - Use about 4 pairs per 2.5 min.
7. **VO interjections on UI events** (Slack 38.8–48.5 s). The narrator reacts in character ("—oh hi!—", "—a ha!—", "—sigh of relief—") exactly when a huddle opens, a search hits, or focus mode switches on. Use one interjection per UI event and at most three per film.
8. **Self-aware meta hook** (Slack 0.2–7.2 s). The film asks the product-category question and jokes about it ("What is Slack? We ask ourselves that every day"). Use this for brands people already know.
9. **Benefit triad as hard-cut word cards** (Campaign 55.0 / 56.4 / 57.8 s). "Save time / Target precisely / Boost efficiency" each get a 1.4 s card (white 700-weight words plus an icon chip on a blue gradient), synced to the VO list. This is the only place the film cuts on consecutive words.

### 3.3 Hand-overs and transitions (new, frame-timed)

| # | name | build (evidence) | frames @30 | use |
|---|---|---|---|---|
| T-K1 | **Twisting nested-tile tunnel** | Kaily 9.20–10.80 (`s1.jpg`). The bubble's card grows into a white rounded tile (60 % W, r ≈ 12 % H) at 9.27. Then 4–6 lavender concentric rounded rects appear outside it, each rotated about 6–8° more than its inner neighbour and one tint darker toward the centre (*eyeballed* `#E9E5FB` → `#B9AEF0`). The white tile shrinks 60 % → 22 % W while rotating about −15° → +60° (≈ 55°/s, linear). The bubble text scales to 0 by 10.07. The rings keep expanding outward, so it reads as falling down a twisted corridor. At 10.80 the tile straightens and becomes the logo backplate. | 48 | Problem → name reveal, for brands without a two-part mark (an alternative to T6). |
| T-C1 | **Flood-to-tile logo reveal** | Campaign 7.95–8.85 (`s1.jpg`). A hard cut from a white caption to a full-frame brand cyan with a white logo glyph. The glyph's ring segments rotate about 30° in 0.35 s. At 8.45 the field shrinks into an app-icon tile: inset 4 % with square corners at 8.52, 10 % at 8.58, then a 45 % W tile at r ≈ 15 % (8.65), settling at 33 % W with r ≈ 22 % of the side (8.85). The glyph keeps its size. power3.out, and the corner radius grows in step with the shrink. | 3 (cut) + 12 | Name reveal. It is the inverse of an iris and gives one scene change for free. |
| T-C2 | **Lock-up docks, product enters** | Campaign 11.0–12.5 and DAX 12.5–14.5. The centred lock-up scales to about 0.55 and moves to the top-left (or left third). The tagline types under it with the accent on the last 2–3 words. At the same time a UI window slides in from the right edge (power3.out, about 15 f) and fills the right 55–60 %. | 15–20 | The step straight after the reveal: brand and product share one frame for 2–3 s. |
| T-S1 | **Iris-open from content, avatar carried over** | Slack 7.02–7.25 (`s2.jpg`). A cream disc grows from frame centre behind the message card: R ≈ 0.18 W (7.05), 0.30 (7.08), 0.45 (7.12), 0.62 (7.15), full (7.22), power2.in. The card shrinks to about 70 %, and its photo avatar is handed to a 90-px rounded tile at the left of the app window (7.15–7.25). | 7 | Hook card → product world. The opposite of T5 (iris closing onto an avatar). |
| T-H1 | **Hub-disc flood** | CallCoach 48.12–48.55 (`s2.jpg`). Orbit labels and satellites slide left and fade (power2.in, 6 f). The medallion's blue halo disc grows from R ≈ 0.12 W to full frame (11 f, power2.in), while the white medallion keeps its size and slides to x ≈ 0.68 W. The blue field becomes the next scene's ground. The reverse (white ground irising closed around the lock-up, then becoming the medallion ring) runs at 26.0–26.9. | 13 | Hub diagram → stat run. The hub survives as an anchor at the right third. |
| T-K2 | **Footage → vector dissolve, pill persists** | Kaily 25.7–26.5. A live-action shot (hands on a phone) with a glass UI pill ("Is my order delayed?") fades to the lavender ground in about 12 f. The pill does not move. The bot avatar and the reply pill then appear beside it. Repeated at 2:17.7–2:18.5: a video-call PIP tile empties into a lavender tile that later becomes the end icon. | 12 | Real-world context → product UI, without a cut. |
| T-C3 | **STEP carousel pan** | Campaign 14.2–19.3. A "STEP 1" header with one oversized button. The camera pans horizontally (power2.inOut, about 20 f) to the "STEP 2" page while the previous step's button stays visible at the left edge. | 20 | Multi-step setup flows. |
| T-C4 | **Caption completed by a UI element** | Campaign 37.5–40.6. "Time to see those results" types at about 17 cps. The line then slides left while a "Run" button pops in as the sentence's last word (back.out, about 8 f). The cursor clicks, the button turns into a "•••" loading pill (about 10 f), and the film hard-cuts to the results on the blue field. | ~95 | Typography hands over to UI. The click lands on the stressed verb. |
| T-D1 | **Code-corridor dolly** (hook) | DAX 2.1–10.4. A one-point-perspective corridor whose walls are code and UI panels. The camera dollies forward continuously (linear). Dark "Consultant" chips with a coin icon ride the panels to show the cost. It ends on a bright white "exit" into the logo. | ~250 | Pain = drowning in work. Gives a continuous-motion hook without cuts. |
| T-B1 | **Blur-back question** | Campaign 4.0–4.5. The busy problem UI gets about 20 px of Gaussian blur and −10 % brightness in about 8 f. The question line rises over it, with the product glyph popping (back.out) beside the question as a teaser before the reveal. | 8 | Last problem beat → question. |
| T-K3 | **Mark → mascot morph (bookend)** | Kaily 11.0–13.5 and 2:29.6–2:35.6. The two-arc logo mark → the wordmark types beside it → the wordmark fades → the mark's lower arc becomes a smile stroke → two eye strokes draw → the shape fills into the app-icon tile. Used at the reveal and again as the end card, like the T6 bookend. | ~75 | Brands with a mascot or icon. |
| T-S2 | **Emoji hero cut on a brand ground** | Slack 33.1–35.0. A hard cut from the UI to a full-frame emoji redrawn as a flat illustration on peach; it pops and turns its head in 3–4 f, then holds. | 0 + 4 | A T19 variant (Clay: emoji on black). Use the brand ground, not black. |

### 3.4 UI devices, layout and typography (new)

- **Persona cursor** (Campaign 0.0–4.0). The arrow carries a dark pill label with a role ("Marketing Manager") and moves through busy SQL and report UI. Use it for problem montages: it names who suffers without drawing a body. Add it to `K.cursor` as `{tag:'Role'}`.
- **Brand-colour chapter grounds** (Slack). One flat brand colour per chapter, hard-switched at the chapter boundary:

  | time | ground |
  |---|---|
  | 0–2 s | yellow (behind the photo) |
  | 2–7 s | aubergine |
  | 7–15 s | cream |
  | 15–33 s | teal |
  | 33–35 s | peach |
  | 36–50 s | pink |
  | 50–66 s | cream |
  | end | aubergine |

  The switches fall on the uploader's chapter marks (0:16, 0:32, 0:50, 1:01).

  - The app window floats on the field with photo-avatar tiles at its corners and emoji reaction pills popping around it.
  - This is a fourth skin worth adding: "**Brand grounds**", A1 calm UI plus 3–5 brand field colours. Measured: 10.8 scenes/min, colourfulness 52.9, hold 0.44.
- **Photo cut-out protagonist → avatar** (Slack 0–6.1 s). A real-person cut-out on a yellow field (1.5 s) becomes the avatar of a message card. The emoji reaction counts tick up (1 → 13 → 15 over 3 s) under "several people are typing…". In code, use an original illustrated bust in place of a photo.
- **Inline UI card inside a heading** (Kaily 1:13.5). "Custom [Define Persona card] persona": the card sits *between* two words of the line at text height × 3.
- **Heading rule → connector** (Kaily 1:30.2–1:36.9). "Simple no-code workflows ———": the rule after the heading grows right and becomes the first connector of the workflow node graph. "——— with MCP support" mirrors it from the left.
- **Weight-contrast caption** (DAX 35.3–1:29). The right-side caption is a 2–3-line stack: light weight for connector words and bold for the key noun ("Estimates / **CPU & RAM** / Consumption", "Optimize / **Resource Usage & Save Money**"). It types in and sits beside a 3D-tilted UI.
- **3D icon-tile triad** (DAX 18.7–20.8). Three glossy black rounded-square tiles, each with a 3D glyph in its own colour (green / yellow / blue) and a matching under-glow, labelled with the three promise adjectives. They pop with a 4–6 f stagger, then one tile's glyph morphs.
- **Oversized drop-target button** (DAX 20.8–22.8). A "+ Model" button at about 30 % W. The cursor drags a file icon onto it and a striped progress bar fills (22.8).
- **Medallion hub with ripple rings** (CallCoach 36.2–48.7):
  - The product glyph sits in a white disc with a blue glow.
  - 2–3 concentric rings expand and fade continuously (*eyeballed* period about 1.2 s).
  - Avatar satellites connect to it through dotted curved paths with travelling dots.
  - A cheap replacement for an orbit when there are fewer than 4 satellites.
- **Stat ladder beside a persistent medallion** (CallCoach 49.3–57.5):
  - White condensed 800-weight caps (eyeballed 110 px) slide in from the left on the blue field.
  - Each stat has a small animated glyph: "35% ↓" (the arrow drops), "✓", "↗" (draws).
  - Each card lasts about 1.6 s, and the medallion stays at the right third.
- **Clock-hand sweep over bars** (CallCoach 16.4–18.1). A thin clock hand sweeps across a bar chart with an avatar marker to show time running out. Use it as the pain visual for "takes too long".
- **Dual CTA end card** (Campaign 1:01.9). Logo + a marketplace pill + a solid green "Book a demo" pill. Two CTAs are acceptable when one of them is a store listing.
- **Studio watermark** (Burnwe on DAX and Campaign; What a Story on CallCoach) sits top-left for the whole runtime. It is a portfolio artefact. **Don't** replicate it.

### 3.5 Motion notes (new numbers)

| what | value | evidence |
|---|---|---|
| typed product-name header | ≈ 25–30 cps, phone-icon prefix, the UI card rises from bottom-left at the same time | CallCoach 58.7–59.0 |
| typed reversal line | word by word, ≈ 0.5 s per word | Campaign 5.0–7.5 |
| typed caption | ≈ 17 cps | Campaign 37.5–38.0 |
| problem-act word drop | each word enters 40–50 % of the line height *below* the baseline at about 40 % grey, then rises and darkens in about 8 f | Kaily 0.0–1.0 ("No matter how hard they try"); deeper than the skill's y +14 px kinetic word |
| count-up dashboard cards | lavender card pairs fly in from the right on about 15 f, then values count (CSAT 2.2 → 4.5) | Kaily 2:20–2:28 |

### 3.6 Sound (inferred)

- **AI voiceover is now disclosed by agencies.** What a Story's Ticketsoft description says "AI Voiceover", which makes Kokoro an honest stand-in.
- **WPM tracks VO coverage, not delivery speed.** Kaily speaks briskly but sits at 109 WPM because an estimated 25–30 % of the runtime is VO-free UI (caption gaps at 5.7–10.7, 37–51 and 2:30–2:37 s).
- **Quiet brand masters are common.** Slack −24.5 and Ticketsoft −26.1 LUFS. Keep −13.5 for our renders but don't treat louder sources as the reference.

### 3.7 Sub-variant C (new type): caption-card screencast (Cursor, Icons8)

A music-only release or tutorial film built from **typed caption cards alternating with real screen captures**. In code, use rebuilt UI rendered "flat", like a screen grab with no camera rig.

| | Cursor | Icons8 |
|---|---|---|
| caption card | black 400-weight sans (Inter-like) centred on `#F3F3F2`. One sentence (≤ 44 chars) typed with **no caret** at ≈ 45–55 cps (44 chars from 2.15 to 2.95 s; line 1 lands word by word every 3 f, then char by char). Holds 1.0–1.5 s. | small coral 600-weight text (eyeballed 30–34 px) on a pale-pink 1-px grid field `#FCEDEC`. 3–5 words, 1.5–2.5 s, about 12 f crossfade in and out. |
| card cadence | every 10–15 s (2.0, 8.5, 19.1, 34.0, 43.6 s) | every 5–8 s (22.7, 31.2, 36.8, 45.3, 59.5 s) |
| capture framing | the app window (about 95 % W) over a painted landscape wallpaper. **Crop cuts** to 2–3× details (11 cuts at scene score 0.08, ≈ 10/min, median about 5 s), which the 0.33 analyser misses. | dark-UI recordings on a 3D plane (eyeballed rotY −12°, rotX 8°) that slowly flattens (18.4–21.2 s) |
| proof beat | benchmark bars: grey rows fade in top-down (1 row per 2–3 f, `#D9D9D9`), then **the hero row darkens to ink and its label turns bold** (5.5 s). Highlight by value, never by colour. | — |
| end | hard cut to black. The white 3D cube mark rotates about 35° and shrinks from 25 % → 9 % H in 12 f (62.3–62.7), then the wordmark slides out (64.0). The only dark frames (3 %). | characters from the product appear with fireworks (1:03.7–1:05.1), then a very small logo plus URL (about 10 % W) held 5 s |
| metrics | scenes 0.93/min, motion 2.47, hold 0.63, colourfulness 5.2, −29.3 LUFS | scenes 12.5/min, motion 8.3, hold 0.28, colourfulness 30, −16 LUFS |

**Rules:**
- No VO and no cursor choreography beyond what the capture shows.
- One sentence per card, and the card is the chapter title.
- Monochrome or a single accent, 6–15 s between cards.
- A quiet music bed: −20 to −29 LUFS reads as "premium dev tool".

To pass QA, measure cuts at scene score 0.08–0.15, because light-on-light crops never reach 0.33.

### 3.8 Sub-variant D (new type): device-mockup screencast (CleanShot X)

A VO-led tour where the real (or rebuilt) UI plays on a **3D laptop in a white void** and the *camera* supplies the energy.

- **Angles.** Yaw 20–45°, Dutch tilt up to ±15°. Crops cut the laptop off at frame edges. The far half of the screen gets a blur gradient (fake depth of field, about 6 px at the far edge, *eyeballed*).
- **Cutting.** Hard cuts between angles: 12.7/min, scene median 4.2 s. Brightness 0.46 (dark desktop wallpaper).
- **Pull-back to device** (1:44.8–1:45.3). A full-screen desktop → the whole laptop on white in about 12–15 f (expo.out). This marks a section break.
- **Cold-open sizzle** (0–8 s). 4–5 features at steep angles with no VO explanation, then the app icon turning in 3D on white (8.0–9.0) as the title. First-decile motion is 1.85× the mean.
- **End.** The screen crossfades to white in about 12 f (2:29.6–2:29.9) and the app icon holds 6 s.
- **Script.** First-person maker voice, question → feature → quip (§3.2 items 6–7).

**Code.** Use a CSS 3D laptop: a screen plane with `perspective` and `rotateY/rotateX`, plus a `mask-image` linear-gradient blur copy for the depth falloff. Render the UI into the screen plane as an HTML texture, and put a static keyboard-deck SVG under it.

### 3.9 Footage hybrids (Kaily, Mailmodo): what is worth keeping

The flat-character appendix already covers tracked overlays on footage (Slack 2014). These films use **untracked stock B-roll** instead, with screen-fixed UI pills. Keep only these:

- **Screen pop-out** (Mailmodo 5.0–5.7). The UI window flies out of the laptop screen in the footage toward the camera, reaching about 70 % W in about 20 f (power3.out), with a soft shadow.
- **Attrition isotype grid** (Mailmodo 9.5–17.1):
  - A 4 × 13 grid of desk-worker pictograms.
  - As the VO lists the drop-off ("not all open… fewer click… even fewer wait"), coloured pictograms turn grey row by row, one VO clause per step.
  - It is the best funnel visual in the set and is also usable in flat-character.
- **Feature pill tag** (Mailmodo 41.9–1:18). A small accent pill in the top-right corner of each screenshot names the feature ("Multi Step Forms"). It replaces a heading.

Avoid the rest:
- burned-in full-VO subtitles;
- one persona played by several stock actors (Mailmodo "Jane");
- zoom-blur cuts (Mailmodo 49.0–49.5);
- giant stat type over unrelated footage ("3X", 1:18).

---

## 4. Add to explainer-launch-promo

### 4.1 Light-violet skin and calm kinetic type (Breakout Blocks)

**Measured:** 16.1 scenes/min (median 2.41 s), hold 0.027, motion 11.3, first decile 18.3 (1.6× the mean), colourfulness 46.7, brightness 0.88, −13.2 LUFS, no VO.

**Palette** (k-means):
- fields `#685DDD` / `#3C37AF` (violet gradient, lighter top-left);
- UI grounds `#F7F8F8` / `#F0F0F6` / `#DFDCF0`;
- type on fields white, on white `#111`;
- one accent (the violet) on keywords.

This is the light counterpart of the ember-dark skin: the same "one hue family plus neutrals" rule, with fields as dividers.

New mechanics:
- **Grey-to-ink word reveal** (128.02–128.38, `s1.jpg`):
  - A hard cut to white.
  - Word 1 fades from ~10 % to 45 % grey in 3 f. Word 2 enters 4 f later in light grey `#C8C8C8` while word 1 continues to ink `#111`. Each word reaches ink in about 7 f.
  - The line re-centres as word 2 arrives: word 1 shifts left by half of word 2's width over 6 f.
  - The full line is ink at +11 f.
  - This is the calm replacement for the ×4 slam.
- **Caret type-on on fields** ("Introducing|" 20.5; "That adapt your site to each visitor|" 29.3; "Adapts your site to |" 1:48.3). A thin white caret at ≈ 20 cps ("All. At. Once." takes 14 characters in about 0.7 s, 12.5–13.0 s). The caret stays blinking on the held line.
- **Slot-roll list** (3.5–8.0 s):
  - Huge type (eyeballed 150 px, clipped by the frame edges) runs a vertical drum of channel names. The current row is at 100 % white and the rows above and below at about 25 % opacity.
  - The drum steps up one row every 0.5–0.6 s ("LinkedIn Ads → Email Drip → AI Assistants → OOH → G2 Paid Listing").
  - Each row gets a representative screenshot card popping over the centre of the word (back.out, about 8 f).
  - The cards stay, pile into a collage (8.0–9.0), condense into a hub with channel pills on dotted connectors (11.0–12.0), and collapse into "All. At. Once." typed with a caret (12.5–13.0).
- **Teleprompter line** (14.0–15.5). A sentence wider than the frame ("Only to lead everyone… to the same page.") types while the camera tracks left with the caret, so the line scrolls through the frame. Pace is about 1.2–1.5 s for 44 characters (≈ 30–35 cps), with motion-smeared doubled letters during the track. The last two words land centred and bold.
- **Buzzword cloud** (1:01.5). The line "Some just hate buzzwords." is centred, with 6 grey buzzwords floating around it at about 30 % opacity and different sizes. They drift and fade as the line resolves.
- **Pipe line draws around the words** (2:12–2:13). "Your traffic pipeline." gets a 6-px rounded pipe stroke that draws around and under the words (stroke-dashoffset, about 20 f).
- **Typed CTA pill end card** (2:14–2:17):
  - The big gradient-indigo pill "Get started" with a white arrow disc. The label soft-reveals letter by letter.
  - The logo appears above the pill 1 s later and the URL types under it.
  - Hold 3 s.

### 4.2 VO-led variant (Ticketsoft, Amoeboids)

What a Story uses launch-promo grammar under a full VO:
- Ticketsoft: 134 WPM, hold 0.021, motion 9.1.
- Amoeboids: 91 WPM, hold 0.11, motion 8.5.

**Rule:** with VO, on-screen type shows only the **2–4-word key phrase of each VO sentence**, never the sentence. Examples: "Gain more **Control**", "The **Experience** is yours", "Premium **Loyalty Rewards**". The colour accent goes on the final key word.

Keep the beat map, except that **the brand reveal moves early** (the drop at 25–35 % only makes sense without VO):
- brand reveal at 4–7 % (Ticketsoft 3.8 s = 7 %; Amoeboids 5.0–7.5 s = 4–6 %), straight after a one-line question or premise hook;
- features as one key phrase plus one object;
- end card: logo + URL + "Visit our website today".

New mechanics:
- **Dual-ground alternation** (Ticketsoft). The film switches between black `#1E1A17` with an orange radial glow and white with an orange corner gradient `#F4BF9A` about every VO sentence group. Dark frames are 35 %. It acts as an "A/B" rhythm of mood (dark = experience/emotion, white = product/facts).
- **Letter-counter zoom-through** (Ticketsoft 10.55–11.22, `s2.jpg`):
  - Pre-roll: the orbit of role chips rotates out (0.25 s).
  - Then the camera pushes into the wordmark, aimed at the **counter of the 'o' in "Soft"**: scale ≈ 1.4× → 25× in 11 f, expo.in.
  - From 10.95 the next scene (a dark isometric stage with orange glow) is **already visible inside the counter**, which acts as a mask window. The letter body grows past the frame, and by 11.22 the counter fills the frame.
  - This differs from T11 (an element's flat fill covers the frame): there is no flat field, because the incoming scene is pre-revealed through the hole.
- **Logo-matte bookend with a radial tick burst** (Ticketsoft 3.70–4.05 and 51.10–51.70).
  - The giant 3-bar mark fills the frame as stripes (3.8), shrinks to about 10 % W (3.9), and **4–6 short radial dashes flick out** around it in about 4 f (4.0) instead of a glint.
  - The wordmark letters then track in with wide spacing ("S o f t", 4.8) and close up. The tracking collapses from about +60 % to 0 in about 15 f.
- **Spotlight stage** (Ticketsoft 44.2–47.8). Three white icon discs on black, each lit by a cone spotlight from a truss. The discs pop in turn, about 0.4 s apart, as the VO lists the rewards.
- **Ticket fan** (Ticketsoft 28.7–31.1). Five product cards fanned on an arc in 3D (±25° rotY at the ends) that slowly rotates.
- **Flash strobe** (Ticketsoft 24.7–25.0). Two alternating grey frames over the concert stage stand for a camera-flash hit, with one SFX.
- **Baseline-cascade word reveal** (Ticketsoft 41.8). In "Premium Loyalty Rewards", each later word arrives lower and fainter, then aligns. Total about 12 f.
- **Hero orb in a VO film** (Amoeboids). The mint glass orb is visible in about 14 of 48 timeline samples (≈ 30 %), and orb or sphere variants (blue orbs on a globe, product spheres) in about 45 %. It rests on a pedestal under the logo, rides orbits, and dots a globe. It confirms the hero-token rule also works at 91 WPM.
- **Cylinder fly-through of curved glass cards** (Amoeboids 2.8–3.7). Curved UI cards line the inside of a cylinder and the camera flies down its axis with motion blur, ending on the orb. It is the opening hook. First-decile motion is 24.6 (2.9× the mean), the hottest open in the set.
- **Mosaic-to-icon assembly** (Amoeboids 10.0–14.5). Scattered squares and quarter-circles converge into a 4×4 mosaic tile (12.5–13.0), which cross-dissolves (about 15 f) into a client or partner icon.
- **Tiny typed stat captions** (Amoeboids). White text at eyeballed 22–26 px, typed at about 30 cps ("Empowered 1,200+ Customers", "Across 82 Countries"), placed beside the object. The 3D world carries the scale and the type stays small.

**Sound (inferred).**
- Ticketsoft's AI voiceover over a quiet master (−26.1 LUFS) shows VO-variant loudness drifting low. Keep −13 to −16.
- Amoeboids' 91 WPM with 2.3 s of silence suggests a slow, cinematic "manifesto" read with long music gaps (Kokoro `am_michael` at speed 0.9 plus 0.8–1.0 s gaps).

### 4.3 Tempo note (low confidence)

An onset-autocorrelation estimate gives Breakout's track ≈ 115–120 BPM. Its 17 hard cuts do **not** cluster on that grid: 4/17 fall within ±15 % of a beat, which is about chance (`beat.py`). A music-led film can therefore cut on caption completion rather than on the beat. The skill's beat-grid rule is a choice, not a law of the genre.

---

## 5. Add to explainer-flat-character

None of the 13 is a full flat-character film. These devices come from the Icons8 opener and from character treatments in the SaaS films.

- **Thought-bubble expand transition** (Icons8 1.5–3.5):
  - The protagonist's thought bubble pops (about 8 f, back.out) holding 3–4 small images.
  - At 3.0 the bubble scales from about 25 % W to beyond the frame in about 8 f (expo.in) while its images fly outward into position.
  - The bubble's peach `#F5BAA4` becomes the ground of the imagined scene.
  - It is a diegetic iris that carries content, unlike the colour iris from the moon.
- **Furniture drop build** (Icons8 15.5). Desk, lamp and chair fall from above onto the ground line, each in about 6 f with a 3-f stagger and a small squash. The character drops in last. It is a fast way to re-establish a set after a caption card.
- **Push-into-monitor → real UI** (Icons8 16.8–17.5). The camera pushes into the navy desk monitor (about ×6 in 12 f, motion blur) until navy fills the frame, then hard-cuts to the dark product UI, whose chrome matches the navy. This is T6 push-through with a palette-matched exit into a screencast.
- **Colour-sweep text reveal** (Icons8 13.5–14.5). The line fades in warm grey `#5A4A4A`, then a coral fill sweeps left → right across the letters over about 1 s (clip-path on a coral copy). The product name sweeps first.
- **Two-tier caption** (Icons8 6.0–7.0). Line 1 is in at full ink; line 2 enters at about 40 % and reaches full ink in about 10 f. The second line is the payoff.
- **Persona narrative confirmed in another medium** (Mailmodo). The script follows the skill's problem → turn → product → features → resolution → proof formula almost exactly:
  - "Meet Jane" at 0 s;
  - attrition problem at 7–19 s;
  - "Here's an idea. Imagine if…" at 18.8 s (21 %);
  - "Presenting X" at 26.2 s (29 %);
  - "she can drag, drop, and get done" (features);
  - "three times more responses" (proof);
  - CTA.

  The beat percentages match the skill's map (pivot at 22–33 %).
- **Attrition isotype grid** (Mailmodo 9.5–17.1, see §3.9). It fits the "metaphor makes the pain concrete" beat. Draw the pictograms with `K.gshape` grain and grey out one row per VO clause.
- **Personified product** (Kaily). When the product is an assistant, make it the *second character*: a mascot face that is also the chat avatar. Its smile is the logo's lower arc (§3.3 T-K3), so the logo resolve is the character's face.
- **Photo cut-out protagonist** (Slack 0–1.5 s) as an alternative opening. A single waist-up person on a flat yellow field, thinking pose, 1.5 s, then they shrink into the avatar of a message card. In original work, use an illustrated bust in place of a photo.

---

## 6. Confirmations (already in the skills; do not re-add)

**saas-ui:**
- **T6 logo-matte zoom as a bookend**: Ticketsoft 3.7 s and 51.1 s.
- **Hub-and-orbit**:
  - CallCoach 44–48 s;
  - Campaign node graph 30–37 s;
  - Breakout channel hub 11–12 s;
  - Kaily channel row 1:40.
- **Typed feature headings**: DAX, Campaign, CallCoach.
- **Cursor glide, hover and click on the stressed noun**: Campaign, DAX. Slack uses a hand pointer instead.
- **One accent family on a neutral ground**:
  - DAX green, Campaign blue, CallCoach periwinkle, Kaily violet, Synoptix blue.
  - Slack is the exception (§3.4 brand grounds).
- **CTA pill clicked by the cursor**: CallCoach 1:14.0, Slack 1:10.1.
- **T19 emoji pivot**: Slack's unicorn, on peach.
- **Stat ring**: Kaily 2:20.4 ("30+").
- **The camera never stops (A2)**: Kaily, CallCoach and Synoptix all hold ≤ 0.11.

**launch-promo:**
- **Hero token** (Amoeboids orb).
- **Morph regime with about 1 hard cut**: Amoeboids 0.51 cuts/min.
- **Field dividers between UI beats**: Breakout's violet fields.
- **Brand reveal ≤ 35 % and a calm logo end card**: all three.

---

## 7. Source-list issues

1. **What a Story's founder posted the agency's own films, and said so in the comment.** All three are What a Story uploads.
   - Together with the 4 What a Story films already in the curated list (Elevate, Synoptix, KGeN, Kartel), that makes **7 What a Story films across the corpus**.
   - Ticketsoft's description discloses an AI voiceover and a client-written script.
2. **The Content Beta commenter's picks are other companies' films.**
   - Of the 11 links:
     - 8 are brand-channel uploads: Cursor, Breakout, Icons8, Kaily, CleanShot, Slack, Mailmodo, and the Synoptix copy.
     - 2 are portfolio uploads by another studio, **Burnwe**: DAX Optimizer ("for our partner company Tabular Tools") and Campaign Audience Builder.
     - 1, Fostr AI (`Mq8vICOCQaU`), was not available for analysis, so it is not analysed here. It is also #7 on the What a Story list.
   - None is a Content Beta production as far as the metadata shows.
3. **"Synoptix AI" appears twice in the corpus as two IDs of one film.** `MgRh-vN9ZBg` (brand channel, 675 views, uploaded 2025-04-04) and `gVcyghMTrtU` (What a Story, 30k views, 2025-04-21) are the same master (frame-diff ≤ 0.9 grey levels).
   - Count it once. Its metric differences (hold 0.078 vs 0.010) are encode noise.
4. **Cursor, Icons8 and CleanShot are not "explainer animations".** They are screencasts: real captures, in CleanShot's case on a device mockup. They belong in the corpus only as the new sub-variants C and D (§3.7–3.8).
5. **Mailmodo is a stock-footage template edit.** It is not a motion-design reference, despite sitting in a "well animated" thread. Its persona is played by more than one stock actress.
6. **Two thread picks are long for "explainers".** Kaily runs 158 s and CleanShot 156 s, against a corpus norm of 55–90 s for SaaS spots. Beat percentages still hold, but feature blocks repeat (the "that's not all" bridge, §3.2-5).
7. **Analyser blind spots this batch exposed.** Encode these as QA caveats in the skills:
   - single-hue light films read 0 scene changes (DAX);
   - white-on-white crop cuts need scene score 0.08 (Cursor: 11 cuts vs 1);
   - hold_frac moves by about 0.07 between encodes of the same master (Synoptix).
