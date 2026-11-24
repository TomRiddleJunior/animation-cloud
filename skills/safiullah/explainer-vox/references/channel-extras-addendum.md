# Additional channel videos — addendum for school-of-life, vox, big-think

**Scope.** Five videos not covered in the first pass, now analysed with the same tool:
- `O4FjeAYDRMQ` and `1bmUWt9wejI` (The School of Life, 2026);
- `B9tbTY6dtG8` (Vox, 2026);
- `SrDEtSlqJC4` (listed under Vox, uploaded by Johnny Harris, 2021);
- `YBr-dz44Bwo` (Big Think, 2026).

**Evidence.** I read `timeline`, `strips` and `opening` for every video, `animated.jpg` for the three footage-led ones, the transcripts and `info.json`. Scratch work is in `scratch_saas_extras/`:
- `twos.py`, a frame-to-frame difference test at native 24 fps for on-twos timing and boil;
- `s3.jpg` and `s4.jpg`, 30-fps contact sheets;
- `bt_cuts_*.txt`, a low-threshold cut re-detection.

Every rule cited below is quoted from the skill's own `SKILL.md`, with its section number.

| id | title | uploader (date) | dur s | scenes /min | scene med s | cuts /min | motion | hold | colour­ful | bright | dark | WPM | LUFS | fps |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| O4FjeAYDRMQ | Why Heartbreak Can Be the Making of You | The School of Life (2026-10-21) | 222.1 | 9.19 | 4.67 | 7.84 | 8.00 | 0.074 | 56.7 | 0.81 | 0.07 | 165.6 | −16.3 | 24 |
| 1bmUWt9wejI | Don't Despair | The School of Life (2026-09-09) | 162.8 | 7.00 | 5.34 | 5.53 | 2.51 | 0.647 | 67.9 | 0.89 | 0.00 | 160.7 | −16.4 | 24 |
| B9tbTY6dtG8 | How new wearable tech is changing horse racing | Vox (2026-10-01) | 584.4 | 12.42 | 3.67 | 12.94 | 8.97 | 0.117 | 30.2 | 0.44 | 0.16 | 175.8 | −23.9 | 23.98 |
| SrDEtSlqJC4 | The REAL Reason McDonalds Ice Cream Machines Are Always Broken | **Johnny Harris** (2021-04-23) | 1785.4 | 11.36 | 2.84 | 13.21 | 8.85 | 0.107 | 26.8 | 0.47 | 0.46 | 182.4 | −18.3 | 23.98 |
| YBr-dz44Bwo | You have more power over reality than you think (Lisa Feldman Barrett) | Big Think (2026-10-26) | 381.7 | 4.87 ‡ | 7.83 ‡ | 3.93 ‡ | 4.33 | 0.169 | 36.7 | 0.29 | 0.76 | 121.5 | −18.6 | 23.98 |

‡ **These Big Think figures are an analyser blind spot.** A re-detection at scene score 0.10–0.15 finds 97–113 cuts: **15.2–17.8 cuts/min, median shot 2.25–2.69 s** (`bt_cuts_*.txt`). See §3.

---

## 1. explainer-school-of-life (O4FjeAYDRMQ "Heartbreak", 1bmUWt9wejI "Don't Despair")

Both are 2026 shorts (163 s and 222 s). The skill was built from three 447–476 s films.

### Confirms

- **"The three films each credit a different animator — the constant is the FORMAT, not one look"** (intro). Strongly confirmed: two more looks, each consistent within its own film.
  - **Heartbreak: "ink line + one cyan spot"**:
    - black marker line art with white fills;
    - one spot colour, cyan `#07CACB` (12 % of pixels);
    - black (`#000101`, 12 %) or cyan full-frame grounds for the bleakest beats;
    - every cut-out drawing gets a thick white "sticker" border when it sits on black or cyan (0:04.7, 0:47.1, 1:20.1).
  - **Don't Despair: "riso gouache panels"**:
    - no outlines; flat fills with crayon/riso grain;
    - palette peach `#F7B29C`, red `#E84B46`, olive `#90946A`, brown `#463327`, teal accents;
    - the pictures sit in **rectangular deckle-edged panels (33–70 % W) on a cream page** `#FBEBD6`, so the page margin is always visible.

  Neither film uses the skill's built "ink & cream outlined figure" look. **That supports keeping the look swappable.**
- **"On twos: … render 24 fps → each drawing held 2 frames"** (§1, §6; QA "fps must be 24"). Confirmed:
  - Both films are 24 fps.
  - During the Heartbreak walk (1:24–1:26) and the Don't Despair car drive (0:04–0:06), frame-to-frame differences are non-zero only on every second frame: 24 of 47 steps are exactly 0 (`twos.py`).
  - **New detail:** cross-dissolves run on ones. The tail of the ident-to-first-drawing fade in Heartbreak (0:04.0–0:04.45) changes on every frame.
- **"One literal metaphor per sentence, held 2–6 s"** (§1). Confirmed: scene_len_median is 4.67 s and 5.34 s.
  - Heartbreak: a bed card cracked down the middle for "broken heart" (0:04.5–0:05.0), and an ankle shackled to a cyan ball for inhibition (1:57.4).
  - Don't Despair: a woman weeping at a car wheel for despair (0:10–0:13), and a small figure cradling a dark crystal ball for clairvoyance (0:41.4).
- **Inclusive "we" voice, essay register, consolation ending** (§3). Confirmed. Heartbreak closes on a reframe; Don't Despair closes on "a modest, sceptical awe" line.
- **Ident length "≤ 3 s"** (§3). About right: the 2026 ident is 3.5 s (0.0–3.5), six coloured product squares at 0.5 s each.
  - The skill already forbids copying it ("never the channel's ident, product squares").
  - **New:** the last square becomes the first picture.
    - Heartbreak 3.2–4.0: the square tilts about 8° and becomes the bed drawing while the ground fades white → grey → black over about 0.6–0.75 s (the fade runs on ones).
    - Don't Despair 3.5: a cross-dissolve into the first panel.
- **Ink boil on twos** (§1 "ink lines boil"). Confirmed for Heartbreak: even "static" shots change by 1–2 grey levels on every second frame (2:45–2:47, `twos.py`).

### Contradicts (2026 format drift)

- **Numbered chapter cards are absent.** The skill lists them in §1 ("numbered chapter cards ("-1-" + serif title …)"), §3 ("2–4 numbered chapters (card read aloud …)") and §7 ("chapter card | every chapter"). Neither 2026 film has one: 0 cards across 385 s of timeline samples and transcripts. They are replaced by:
  - **a spoken pivot** (Heartbreak 2:21.2, "Another motive lurks behind artistic greatness"), marked by a one-beat full-frame red `#9B0B0A` flash (2:26.1);
  - **a refrain** (Don't Despair). "It's too early to tell" is spoken 4 times (1:14, 1:38, 1:51, 2:16), and the last time it is shown as a red pill (2:16.3).

  **Suggested rule:** chapter cards for films over 4 min; under 4 min, a refrain or a single pivot line.
- **Hard cuts are the default transition, not the exception.** The skill says "hard cut | ≤ 1 per film" (§7) and "cuts/min (hard) 0.13–2.44" (§2). The 2026 films measure 7.84 and 5.53 cuts/min, and scene changes run 9.19 and 7.00/min against the skill's 1.76–5.91. Panels and plates abut on hard cuts. Heartbreak also hard-cuts between white, black and cyan grounds.
- **"WPM overall 139–150"** (§2). The 2026 films run 165.6 and 160.7, so the voice is about 15 WPM faster.
- **"Quiet: −21 LUFS"** (§1; §2 range −20.0 to −24.7). Both measure −16.3 and −16.4, about 5 LU louder. The new masters are mixed for phones.
- **"motion 3.2–4.5", "hold_frac 0.1–0.35"** (§2). The 2026 films fall outside on *opposite* sides:
  - Heartbreak: motion 8.0, hold 0.074 (busy line drawings, constant boil).
  - Don't Despair: motion 2.51, hold 0.647 (frozen panels).

  Gate per look instead: line-boil looks 6–9 / ≤ 0.1, panel looks 2–3 / 0.5–0.7.
- **"paper fibre re-boils each drawing" and "drift on every hold"** (§1, §6 "slow push … `K.drift`"). Contradicted for the panel look. Don't Despair holds are truly frozen: frame difference 0.0 for 2 s at 2:16.5 and at 1:01–1:02. There is no boil and no creeping push.
- **"One serif keyword per scene, set on the spoken noun"** (§1). Contradicted.
  - Don't Despair uses **hand-lettered condensed caps**: big words beside a figure ("AM SURE" 0:24.2; "ZHOU ENLAI 周恩来" 1:09; "SOPHOCLES / ancient Greek tragedian" 2:21.6), and **rounded speech pills** for questions and refrains ("HOW CAN WE KNOW?" teal 0:20.7; "HOW WAS TODAY?" 1:43.6; "IT'S TOO EARLY TO TELL" red 2:16.3).
  - Heartbreak has almost no on-screen words.
- **"no statistics, no quotes"** (§3 Voice). Contradicted.
  - Both films quote named authorities with a name card: Emerson in Heartbreak (2:07–2:16), Zhou Enlai and Sophocles in Don't Despair.
  - Heartbreak also lists named real works and artists (Dante, Goethe, Kierkegaard, Proust, Dylan, Fleetwood Mac, Phil Collins; 0:20–0:33).

  Our originality rule can stay ("never put words in a real person's mouth"), but quoting well-attested public-domain lines is part of the format.
- **End card "no brand, no shop, no subscribe"** (§3). The channel now ends on a 7–10 s **yellow own-app promo card**: "Brought to you by The School of Life App", a phone mockup and download copy (Heartbreak 3:32–3:42; Don't Despair 2:35–2:43).
  - Keep our rule for originality.
  - If a client needs a CTA, the observed structure is: last picture shrinks into a framed thumbnail on a saturated yellow field, plus a device mockup, plus 2 lines of copy.
- **"Saturated colour is saved for the chapter-card fields"** (§1). Contradicted in both looks.
  - Heartbreak's cyan works as a spot colour on grounds and objects throughout.
  - Don't Despair's panels are fully saturated (colourfulness 67.9, above the 45–46 of the flat source modes).

### New mechanics (for references/analysis.md)

- **Panel-on-page layout** (Don't Despair):
  - One picture per shot inside a rectangular deckle-edged panel on a cream page. Panel size varies per shot (33–70 % W) and position is off-centre.
  - Text lives on the page *outside* the panel, beside it.
  - Build: SVG `clipPath` rect with a rough edge (feTurbulence displacement 2–3 px) over a `#FBEBD6` page.
- **Stepped push inside a panel** (Don't Despair 0:10–0:12).
  - The panel frame stays fixed while its contents re-crop in **3 discrete jumps about 0.85 s apart**: frame-diff spikes of 15.8 / 16.4 / 14.1 every 19–22 frames, with exactly 0 in between.
  - It is a staccato zoom to the weeping face, more picture-book than camera.
  - Build: 3 `gsap.set` keyframes, no tween.
- **Panel grid montage** (Don't Despair 1:54.0–1:57.4 and 2:04.3–2:07.8). 2 panels, then 4, then 6 in a 3×2 grid, each popping in on a hard frame about 0.5 s apart, summarising a list of possibilities.
- **Quote-reversal recolour** (Don't Despair 2:21.6–2:28.5).
  - A red monochrome bust of the author with the quote in a teal pill.
  - When the narrator inverts the quote, the bust recolours red → teal and the pill text changes.
- **Authority name card** (Heartbreak 2:07.3–2:16).
  - A sepia aged-paper portrait with the name in huge black letters arching around it.
  - Then the quote on the same aged paper in cyan handwriting italic, in 3 centred lines.
  - Don't Despair's version: a full-colour bust plus hand-lettered name plus a one-line role ("ancient Greek tragedian").
- **Crack draw-on and half-vanish** (Heartbreak 0:04.5–0:09.5).
  - A jagged line draws down the middle of the bed drawing (about 12 drawings).
  - Then the partner's half fades out (9.0–9.5) while the sleeper's half stays: a literal "split".
- **Shaped vignette masks.**
  - Heartbreak: double-oval "heart" frame around a couple (2:30.8); mouse-ear circles (1:20.1).
  - Don't Despair: binocular mask (0:38.0).
- **Cyan rain-hatch light wedge** (Heartbreak 0:10.0–0:14.1). A door-light wedge drawn as diagonal cyan dashes swings across the black ground while the ground lifts black → grey → white over 1.5 s. This is the "dawn" turn.

---

## 2. explainer-vox (B9tbTY6dtG8 horse racing; SrDEtSlqJC4 = Johnny Harris)

**SrDEtSlqJC4 uploader confirmed: Johnny Harris.**
- `info.json` gives `uploader: "Johnny Harris"`, uploaded 2021-04-23, 13.6 M views, 29.8 min, with sponsor Policygenius.
- vidpros listed it under Vox (`sources.json`: `"channel":"Vox","listed":true`).
- The skill's `sources.md` already flags it ("SrDEtSlqJC4 is not a Vox video"). This addendum confirms that from the actual metadata.

**B9tbTY6dtG8** is a genuine Vox upload: 2026, "PRESENTED BY Colgate Total" in the corner bug, and a 37-s ad read at 5:23–6:00.

### Confirms

- **Document focus: "clipping/scan … yellow highlighter sweeping the spoken phrase"** (§1). Confirmed in both.
  - B9tb 4.0–9.0: three newspaper clippings, each with the word "DEATH" highlighted in yellow (eyeballed `#F2E600`), with the creeping push (§1 "0.25–0.30 % scale/s").
  - JH: highlighted lines in scanned manuals, SEC filings and emails (14:33, 18:59, 19:50 "Service Menu" set black-on-yellow, 26:21).
- **"Sparse colour: one accent + one secondary"** (§1) and **"Build order = sentence order (object → label → value → comparison)"** (§6). Confirmed by the only designed graphic in B9tb (2:39–2:46, `s3.jpg`):
  - a horse-and-jockey photo cut-out (159.0);
  - it turns into a yellow duotone silhouette (159.5);
  - blue sensor dots pop, and leader lines run to the right;
  - a label appears ("Skin temperature"), then a mini area chart fills;
  - the next sensor follows 0.6–0.8 s later, and four stacked charts are complete by 164.0.

  That is two hues, built in sentence order, and then held.
- **"No chapter cards, sentences on screen"** (§10 Don't). Confirmed in B9tb: no cards, and on-screen text is limited to lower thirds, the chart labels and third-party chyrons.
- **"Credits on dark grey with a yellow rule"** (§1). Confirmed in a close variant: B9tb 9:31–9:44 has a left credit column on black separated by a thin **yellow vertical rule**, the wordmark, and the sponsor line, for 13 s.
- **"No spoken CTA"** (§1). Confirmed for both. JH's only CTA is the mid-roll sponsor read.
- **Own small wordmark top-right** (§4 Composition). Confirmed: the Vox bug is top-right for the whole runtime, alternating with the sponsor bug.
- **"Format drift … current uploads are mostly 20–55 min series episodes … Take references from the archive"** (`sources.md`). Confirmed: the 2026 upload is a host-led field report, not a graphics-led explainer.

### Contradicts (or out of the skill's scope)

- **Most of the 2026 film is talking heads.** The skill's premise is "Evidence + annotation … on one flat designed ground" (§1). In B9tb, 25 of 48 timeline samples (52 %) are talking heads (a producer-host to camera, plus three remote or field interviewees), 16 (33 %) are footage, 4 (8 %) are the sponsor ad, **1 (2 %) is a designed graphic**, and 2 are credits.
  - JH: host to camera 25/48 (52 %); documents, web pages and screens ≈ 14/48 (29 %); footage and archival ≈ 7/48 (15 %).
  - The skill forbids fabricating interviewees (§10 Don't), so this format can't be built in code without real footage. **Keep the skill on the archive format.**
- **"One flat ground (slate `#2B3340` …)"** (§1). Neither film has a slate.
  - B9tb's graphic sits on a light-grey paper grid with a ghosted photo behind it.
  - JH shows evidence full-frame: white documents, and web pages inside browser chrome.
- **"logo sting at 17–25 %"** (§1, §7 "sting … covers into the slate"). B9tb's sting is at 74.0 s, **12.7 %**, on live racing footage.
  - The white serif wordmark sits over the shot. At +1.2 s a "PRESENTED BY [sponsor]" lockup fades in under it, and the pair holds about 2 s.
  - There is no cover-to-slate.
- **"one-line kicker that trails off"** (§3). B9tb ends instead on an interviewee's joke and laugh (9:27–9:30), then credits: a human-moment kicker.
- **Metrics are all outside the skill's gates** (§2). The skill's ranges are valid only for the graphics-led archive format.

  | metric | skill gate | B9tb | JH |
  |---|---|---|---|
  | scene changes/min | 5–7 | 12.42 | 11.36 |
  | scene_len_median s | 5–7 | 3.67 | 2.84 |
  | cuts/min | 5–8 | 12.94 | 13.21 |
  | motion | 3.5–5.3 | 8.97 | 8.85 |
  | hold | 0.35–0.50 | 0.117 | 0.107 |
  | WPM | 150–155 | 175.8 | 182.4 |
  | LUFS | −17 | −23.9 | −18.3 |

- **The description's "Johnny-Harris-like"** (front-matter). JH's grammar overlaps with Vox only on the highlighter. Everything else is a different dialect (listed below). Either qualify the trigger ("Vox-archive / annotated-evidence style; for Johnny Harris's host-led vlog look see notes") or add a JH module.

### New mechanics

- **Anaphoric clipping montage** (B9tb 4.0–9.0). The same keyword is highlighted in 3 different clippings, 1.5–2 s each, joined by hard cuts, all with the creeping push. It is a hook device that fits the skill's "hook montage" slot (§3, 0–3 %). Build: 3 torn plates from `VK.plate` plus `VK.highlight` on the same word.
- **Interview lower third, 2026** (B9tb 0:37 host; 3:37 "Michaela Keener"):
  - white bold serif name (≈ 42 px at 1080) over a small sans role line;
  - a **3-px yellow vertical rule** to the left; no plate;
  - x ≈ 11 % W, name baseline ≈ 82 % H;
  - holds ≥ 2 s, and only on the first appearance.
- **Sensor-callout anatomy** (B9tb 2:39–2:46). A duotone cut-out, dots on body points, leader lines out to a right-hand column of 4 stacked mini area charts, each with a title. About 5.5 s to build. It is a layout to add next to `VK.chart`.
- **Third-party chyron footage kept as evidence** (B9tb 0:09–0:15). A local-news clip keeps its own chyron ("HISA: RATE OF HORSE RACING FATALITIES UP IN 2025") and broadcaster bug. It is "evidence framing": the source's own graphics prove the claim. In code, build an invented broadcaster.
- **Johnny Harris dialect** (for a possible separate module; all from SrDEtSlqJC4):
  - **Evidence inside browser chrome** (0:00–0:04.5): a third-party video playing inside a full YouTube page capture, with the page UI visible.
  - **Condensed white caps subtitles for quoted speech** in clips ("OR NEXT WEEK, I DONT KNOW." 0:38; "SO YOU'RE STILL FROM TAYLOR?" 13:55): bottom-centre, no plate.
  - **White line-art "hologram" over footage** (0:10.0–0:13.5):
    - a technical wireframe of the machine dissolves over the host shot;
    - then the logo arches draw as glowing white lines with a cyan halo;
    - they hold their screen position while the host turns to camera.
  - **VHS archival** with colour bleed and soft glow (0:05.0–0:07.5).
  - **2×2 checkerboard block wipe** in the sponsor colour (7:10.9–7:11.4, about 12 frames).
  - **Video-call interviews** inside a framed window with a name lower third (1:16).
  - **Host-to-camera in a map-wall studio** about 52 % of the time, plus handheld car vlog shots (5:03).

---

## 3. explainer-big-think (YBr-dz44Bwo, Lisa Feldman Barrett, 2026)

A sponsored series episode: "We created this video in partnership with Unlikely Collaborators"; the series card reads "Episode 2 · Seeing Red · a Big Think original series".

### Confirms

- **"Cut every 2–3 s on the stressed word … punch-ins"** (§1). **Confirmed, but only after re-detection.**
  - At the standard 0.33 threshold the analyser reports 3.93 cuts/min and 4.87 scenes/min (scene median 7.83 s). A real Big Think film would therefore *fail* the skill's own gate ("scene_changes_per_min 15–23", §2/§10).
  - At scene score 0.10–0.15: **15.2–17.8 cuts/min, median shot 2.25–2.69 s**. The first cuts fall at 3.6, 5.7, 11.6, 23.0, 27.2, 30.2, 32.5 and 33.8 s, which match the wide/medium changes seen in `opening.jpg`.
  - Cause: the set is dark and single-hued, so wide and medium share one 64-bin histogram. The skill already notes this for medium ↔ punch-in (§10); in a dark set it also applies to wide ↔ medium.
  - **Add a QA caveat:** for dark sets, measure cuts at score 0.10–0.15.
- **"Label tapes … grow left→right (lower-third …)"** (§1; §6 "tape grow 6–9 f"). Confirmed (83.4–90.4, `s4.jpg`):
  - the name, white serif on a black tape, grows in about 6 f;
  - the italic role on a white tape follows about 6 f later;
  - the pair holds about 6 s across two framing cuts and exits by shrinking right→left.
  - **Deviation:** role and name shrink *together* (about 6 f), not "role first" (§6).
- **"Word-synced kinetic serif … blur/fade-in on the syllable"** (§1). Confirmed: "Is" (0.0), "this rose" (0.5, entering lower and grey, then rising), "objectively" (1.5), "red?" (2.0). The line is complete at 2.0 s and holds to the cut at 3.6 s.
- **"Text behind an object"** (§1). Confirmed: "objectively" is partly hidden behind the expert's head and rose (2.0–3.5).
- **"Monochrome boxed-monogram bug top-right, always on"** (§1). Confirmed, with two additions:
  - the bug **draws on**, outline box then letters, over about 0.8 s (0.5–1.0; again at 75.4–76.2 after the cards);
  - it **alternates with the partner's logo bug** in the same slot (24–33 s, 1:37–1:53, 4:19, 5:08).
- **"Series card + topic card at 15–21 %"** (§3). Confirmed in position: series card 71.0–74.6 s (18.6 %), definition card 75.0–83.0 s (19.7–21.7 %).
- **"Ends abruptly on the best line"** (§3). Confirmed: the last line is at 6:11.8, followed by a hard cut to credits at 6:15.6.

### Contradicts

- **"Interview set within a set: white seamless backdrop + roll tube in a warm loft"** (§1). Replaced by a **dark ornate parlour** with practical table lamps, armchairs and a patterned rug. There is no backdrop.
  - Wide shot: the subject centred at ≈ 25 % of frame height, chair on the rug.
  - Medium shot: chest-up, with two lamp bokeh discs at shoulder height left and right.
  - Measured: brightness 0.285 and dark frames 0.762, against the skill's 0.40–0.55 and 0.15–0.25.
- **"Paper cards … roll down from the top"** (§1, §7). Absent. Replaced by:
  - an **iridescent series card** (71.0–74.6): an oil-slick swirl ground panning slowly, "[partner] presents / Episode 2 / *Seeing Red* / a BIG THINK original series" in serif;
  - a **definition card** (75.0–83.0): "Relational realism:" in bold serif plus a 3-line, 22-word sans definition on a dark ground of slowly moving iridescent contour lines, held 8 s;
  - the hand-over between the two is a **pixel-block mosaic wipe** (74.2–74.6, about 10 f).
- **"Colour comes only from 'footage'"** (§1) and **"colourfulness 21–30"** (§2). The film measures 36.7. Colour sources:
  - the iridescent graphics grounds (series and definition cards, 2:26 eye/cone diagram, 4:03–4:19 baby + sound-wave collage);
  - a **red key word**: "red?" at 2.0 s is set in the hero prop's red (eyeballed `#D7191F`), and "signals coming off the object" flips white → red at 26.0 s when the idea is restated.
- **"Archival in a physical frame" (slide projector, 35 mm strip) and "stock CGI neurons"** (§1). Neither appears. Instead:
  - stock-photo collages on the iridescent ground: a 2×2 expression grid on coral (3:14.6); a face photo next to a white silhouette figure (3:22.8);
  - an illustrated metaphor plate (0:40–0:56): a white line-art rose whose "light" streams into a white profile head holding a rainbow brain swirl.
- **"medium + lower-third at ~0.8 s"** (§3). The lower third first appears at 83.4 s (22 %), after the series and definition cards. The cold open runs 71 s with no name on screen.
- **"CTA in a second voice"** (§3, "credits and a different-voice CTA"). Absent. The credits on black list stock sources ("Courtesy of …") with the partner and channel logos, and there is no voice.
- **Other measured gaps** (§2):

  | metric | skill target | this film | note |
  |---|---|---|---|
  | WPM | 141–148 | 121.5 | a slower, more deliberate expert |
  | LUFS | −15 | −18.6 | |
  | motion | 7–14 | 4.33 | dark frames carry little luminance change |
  | hold | 0.06–0.2 | 0.169 | ✓ |
  | interview on screen | 36–55 % | 65 % (31/48 samples) | |
  | designed graphics | 14–23 % | 23 % (11/48) | at the top of the range |
  | stock b-roll | — | 10 % (5/48) | |
  | insert sequences | 3.4–6.4 /min | ≈ 1.7 /min | |

### New mechanics

- **Hero prop held by the expert.** The thesis object (a red rose) stays in the expert's hands for the whole interview. It is the only saturated object in the set, it reappears in graphics (as a white line-art rose; as a rose next to the cone diagram, 2:34), and its red is reused for key words. Rule: one physical prop per film, matched to the key-word colour.
- **List items on alternating frames.** A 3-item list is split across framings:
  - "signals coming off the object", top of the wide (24.5);
  - "receptors in your retina", bottom of the medium, scaling from about 60 % → 100 % in about 12 f (27.5–28.0);
  - "signals in your brain.", top of the wide (31.0).

  Each item lands on the cut that introduces it.
- **Centred bottom serif statement on the medium** ("What is out there." 2:50.3): white serif, about 6 % H, centred across the subject's chest. The skill's kinetic stack sits on the empty side of the wide; this is the medium-shot counterpart.
- **Macro b-roll with focus-pull punch-ins** (4:46.0–4:46.2 chips; 5:09.9–5:10.0 apples): a slow-motion macro jumps about 1.3× with a focus rack in 2–3 frames, landing on the stressed word.
- **Co-branded series wrapper**: partner bug alternation, plus the "partner presents / Episode n / title / a [channel] original series" card. This is relevant when the user has a sponsor.
