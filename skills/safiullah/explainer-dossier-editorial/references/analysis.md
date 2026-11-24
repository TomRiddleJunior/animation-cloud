# Dossier-editorial — paper-dossier political-economy explainer (bilingual CJK + European typography, red stamps)

Analysed 2026-10-27 from `frames/x_2114927236335972357/` (metrics, sheets) plus my own measurements on the 1920×1080
30 fps MP4: frame-accurate strips at 6–30 fps around every motion peak and cut (`samples/dossier-editorial/scratch/src/s01…s21_*.jpg`),
per-frame motion / sharpness / vignette / red-pixel probes (`probe.py`, `events.py`), phase-correlation and
scale-fit drift measurement on holds (`drift.py`, `drift2.py`), patch colour sampling on full-res stills, and an
onset / RMS analysis of the soundtrack (`audio.py`). Values marked *inferred* could not be measured.

---

## 1. Identity

A political-economy story told as **a reporter's dossier spread across a desk**. Every frame is a paper document —
a pinned map plate, a classroom seating plan, a lined budget index card, a typewritten wire quote on torn paper,
halftone press photos with torn white borders, a pink financial-pages chart on graph paper, a bond certificate —
lying on a **desk of overlapping protest posters** (torn beige / grey / slate-blue / salmon paper with huge cropped
serif words and grey placeholder text lines). The camera never stops: it **whip-pans with heavy directional motion
blur** from one document to the next across one continuous desk, punches into maps with zoom blur, and in between
it breathes (0.6–1.0 % scale per second). Typography is **bilingual**: heavy Chinese serif (宋体/明朝 black) headlines
and stamp words over letter-spaced French small caps and typewriter slug lines. **Red is rationed to judgement**:
rough-ink rubber stamps (乱 · 缺 · 冲突 · 国粹 · 预算 · NON · 反转) slam in over 2 frames, red counters, the one red
thread of a timeline. A persistent dossier HUD (programme / chapter top-left, date · place top-right in mono, a source
and licence line bottom-left) makes it read as sourced journalism. The 95 s excerpt is **music-led** (no narration):
the score and paper / stamp / whoosh SFX carry the rhythm, and the piece ends on a one-character title card (债) on a
guilloche certificate.

## 2. Sources analysed

| id | title | dur (s) | cuts/min | scene changes/min | median shot / scene (s) | motion mean / p90 | hold_frac | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|
| x_2114927236335972357 | Archer/张狗剩 (@goshenggo) — excerpt of a 正确君 programme on France's Gen Z protests and public debt, "from start to finish only with Claude + HyperFrames" (X post, 2026-10-27) | 95.5 | 3.77 | 9.42 | 2.23 / 3.5 | 7.56 / 20.88 | 0.002 | 23.0 | 10.1 (Whisper hallucination on music; real WPM = 0) | −17.1 |

Other facts: 1920×1080, 30 fps, AAC 48 kHz stereo; brightness 0.776; saturation 0.132; dark-frame fraction 0.021;
`animated_frac` 0.095 (the flat-shading detector reads paper texture + halftone as "photographic" — every frame is in
fact code-rendered HTML; see §13). Palette (k-means): `#ddd0be` 24 % · `#e5dfcc` 23 % · `#c1bbab` 15 % · `#eeeade` 13 % ·
`#a6998a` 10 % · `#272726` 7 % · `#706f69` 7 % · `#bb4739` 0.9 % (the vermilion). Whisper returned only a lyric-site
boilerplate line (【未经许可,不得翻唱或使用】) every 10 s — the classic music-only hallucination. The post text says
prompting combines an "art direction" (美术调性) with a "camera language" (镜头语言) and that one should feed Claude a
< 1 min reference whose aesthetics one admires.

## 3. Measured pacing

| quantity | value | what it means in practice |
|---|---|---|
| scene changes | **9.4 / min**, median scene 3.5 s | a new document every 3–7 s; the colour-histogram counter sees whips and torn-hole wipes as changes |
| hard cuts | 3.8 / min, **5 in the first 15 s** (all in one burst at 12.9–17.1 s) | hard cuts are reserved for the **word-card montage**; everything else is camera travel |
| median shot (hard cuts) | 2.2 s, p10 0.55 s, p90 37.8 s | bimodal: 0.43–0.67 s montage cards vs 30–40 s continuous desk travel |
| motion_mean / p90 | **7.6 / 20.9** | 2× Vox (3.4–5.2): whips peak at 30–57 mean-abs-diff, the 0.6–1 %/s breathing push never stops |
| hold_frac | **0.002** | effectively no frozen frame in 95 s — even the end card pushes and vignettes |
| motion by decile | 10.4 · 13.5 · 12.2 · 6.3 · 7.1 · 8.7 · 3.6 · 2.3 · 4.5 · 6.9 | front-loaded: street chaos (0–30 %) is frantic, politics (30–60 %) medium, the markets chart (60–80 %) calm and analytic, the pull-back + title (80–100 %) rises again |
| colourfulness / saturation | **23 / 0.13**, brightness 0.78 | a pale, warm, desaturated paper world; red pixels are 0–1 % of most frames, 3–12 % only on stamp / isotype-fill / 纵火 frames |
| loudness | −17.1 LUFS integrated; RMS swings −8 dB (montage) … −37 dB (before the quote) | dynamic music-led mix, ~3 dB under −14 |
| silence | 1.0 s total | the score never drops out |

**Event density** (from my shot list below): 15 lateral / diagonal whip pans, 5 zoom moves with radial blur, 6 hard
cuts, 2 torn-hole irises, 3 vignette spotlights, 10 red stamps (one every 9.5 s), 3 count-ups, 5 typewriter runs.

**Shot list (source, s):** 0.2 iris opens on the tricolour (pinhole → spotlight in 9 f) · 0.7–1.9 slug types
"LA FRANCE · OCTOBRE 2025" · 2.20 flash + flag tears on a zigzag · 2.27 collage burst: brush stamp 乱, flag shreds
fly, halftone riot photos slam in · 3.10–3.45 whip L → "LA FRANCE" map plate pinned with two red pins · 4.10–4.35
zoom punch (radial blur) → Paris line map; departments grow, two fill pale vermilion (4.9), pin drops on 克雷泰伊
(5.5), label types (5.8) · 6.63–6.95 diagonal whip → PLAN DE CLASSE seating plan; counter 24→36 (7.2–7.9); 缺 stamp
(8.05) + protest-sign photo sticker (7.98) · 9.1–9.6 zoom-out (radial blur) → France map, radar ring, red dots spread,
counter 627→1207 (10.6–12.5) · **12.90 hard cut 纵火 / INCENDIES** (vermilion ground, 13 f) · 13.33 **打砸抢 / PILLAGES**
(black ground, 19 f) · 13.97 **烧汽车 / VOITURES BRÛLÉES** (paper ground, 20 f) · 14.63 **学生 × 防暴警察** torn street
photo, tear-gas blobs, riot shields; **冲突** stamp (16.2) · 17.07 cut → desk + torn quote card under vignette;
typewriter quote 17.8–19.2, highlighter 19.2–19.5, Chinese translation 19.5–20.3 · 21.3–28.2 truck along a red-thread
timeline of history plates 1789 → 1830 → 1848 → 1871, **国粹** stamp (27.23), 1968 crowd · 31.9–33.8 two-step pan →
isotype grid on a perspective-tilted plane; title types 35.5; red fill 23 %→87 % (37.7–38.4) · 40.0–41.4 plane
flattens, figures scatter, **torn-hole iris** → newspaper page with a dotted hemicycle · 42.5 whip → "两年" timeline;
four portrait cut-outs pop (44.4–45.3), topple (46.4–47.2), **预算** stamp (49.12) · 49.9 whip → BUDGET DE L'ÉTAT index
card: bars grow, red deficit gap (51.3), 养老金 tag + **NON** (52.6), 加税 + **NON** (54.1), DÉCISION box, a rubber
stamp hovers under a closing **vignette spotlight** (54.6–56.6) · 57.2–58.2 torn-hole iris → pink MARCHÉS page;
kraft podium (59.6), country silhouettes drop (60.0–60.3) · 61.5 whip → credit-rating ladder; bracket "高出 3 级" ·
64.6 whip → 10-year yield chart on graph paper, two lines draw with the country silhouettes riding the line heads
(65.2–69.0), stamp 欧元诞生以来最大 (73.0), push to 2012 (74.4), spread fill (76.4), whip (80.7), **反转** stamp (81.82)
· 84.5–86.3 pull-back through nested torn holes (chart ⊂ newspaper ⊂ desk), recap tags 政治 · 街头 · 88.7–89.4 dive
(radial blur) → bond certificate · 91.03 **债** lands, LA DETTE / THE DEBT types (91.5), PROMISE TO PAY · 承诺偿还
(92.4), vignette closes to 95.5.

## 4. Script & narrative structure

Music-only, so the "script" is the **sequence of documents and stamp words**. Read as a narration it is a
three-layer descent: street → politics → markets → the theme word.

| % runtime | beat | documents | stamp / red word |
|---|---|---|---|
| 0–3 % | **Iris hook**: one symbolic object under a spotlight, a typed date-line | flag on the desk | — |
| 3–4 % | **Rupture**: flash, tear, collage burst | torn flag, riot photos | 乱 (brush) |
| 4–13 % | **Where / how it started**: map → zoom → local map → one concrete document → counter of spread | France map, Paris map, seating plan | 缺, red counter |
| 13–18 % | **Word-card montage**: 3–4 hard-cut cards, each = Chinese word + French gloss + halftone photo + a flat graphic gag (paper flames, glass shards, brush underline, gas clouds) | 纵火 · 打砸抢 · 烧汽车 · 学生×防暴警察 | 冲突 |
| 18–23 % | **Voice of the street**: a typewritten wire quote, highlighted, translated | AFP-style slip | yellow highlight |
| 23–35 % | **History rhymes**: truck along a timeline of archival plates | 1789 · 1830 · 1848 · 1871 · 1968 | 国粹 |
| 35–42 % | **Who**: isotype grid with a % fill | protester pictograms | red 87 % |
| 42–60 % | **Politics**: parliament, governments falling, the budget that cannot pass | hemicycle, portrait timeline, budget card | 预算 · NON · NON |
| 60–88 % | **Markets**: rankings, ratings, the yield chart, the reversal | podium, ladder, chart | 欧元诞生以来最大 · 反转 |
| 88–94 % | **Pull-back recap** through every layer | nested torn holes, recap tags | — |
| 94–100 % | **Theme-word card**, slow vignette | bond certificate | 债 (black, not red) |

- **Hook pattern (first 15 s).** Iris-open spotlight on one object (0.2 s), a typed date / place slug, a hard
  rupture at 2.2 s, then *location first*: country map → zoom → local map → one human-scale document (a classroom
  with 36 seats) → back out to the national count. Five hard cuts land in 12.9–15 s as the montage.
- **Hand-overs.** Every section hands over by camera: whip to the next paper on the same desk, zoom through a map,
  torn hole opening into the next sheet. A section ends on a **stamp** about 0.5–1.5 s before the move.
- **Ending.** No CTA or logo: pull back through all layers (recap), dive, one-character title card held 4.5 s with a
  closing vignette — a chapter opener ("开场" in the HUD tells us this is the programme's cold open).
- **For a narrated build** (our sample): keep the beat map, put one VO sentence per document, let stamps land on
  the stressed word, and use the word-card montage for a fast list (3–4 nouns at ~0.5 s each).

## 5. Visual system

**Palette roles (sampled hex).**

| role | hex | use |
|---|---|---|
| desk paper, light | `#e5dbc6` · `#ece3d1` · `#eeeade` | quote slip, page grounds |
| desk paper, mid | `#ddd0be` · `#d1c5a9` · `#c4bbad` · `#c1bbab` | torn poster layers |
| desk grey poster | `#8e857a` · `#7c7770` · `#706f69` | big poster blocks, cropped words |
| desk slate blue | `#7d8593` (paler `#9aa3b5`) | poster blocks |
| desk salmon | `#bb8574` · `#bb846f` | poster blocks |
| desk mustard | `#d8b56a` *(sampled by eye)* | occasional poster |
| map land / sea | `#e6dbba` / `#c9d3d6` | map plates (sea has a coastline halo, land has fine black borders) |
| financial pink | `#ebd3c4` · `#e8d2c3` | MARCHÉS pages (FT-pink cue) |
| graph paper | `#ebe6da` with `#d9d3c4` grid | charts |
| certificate green | `#ccd2c5` / `#bec3b9`, guilloche `#4d7f73` | bond card |
| ink | `#272726` · `#101212` | text, black bars, portraits |
| **judgement red** | **`#bb4739`** (stamp ink `#c4342a`–`#c85446`) | stamps, red counters, red thread, deficit gap, isotype fill |
| card vermilion ground | `#8d281b` | 纵火 card only |
| card black ground | `#141414` + grain | 打砸抢 card |
| flame orange / yellow | `#e2702a` *(by eye)* / `#f6c241` | paper-cut flames |
| data green / blue | `#2d5b4e` (budget bar), `#2e8a5a` (Italy), `#2f45b8` (France) | the only cool accents, on charts |
| highlighter | `#f2c94c`-ish yellow | one quote highlight |

**Shape language.** Rectangles of paper, always slightly rotated (−6°…+5°), with torn or deckle edges on photos and
slips, straight edges on index cards and plates. Circles only for pins, the radar ring, the rosette seal.
Pictograms (isotype figures, country silhouettes) are flat paper cut-outs that stand up and cast shadows.

**Line work (1080p).** Map borders 1–1.5 px ink; department lines 1 px; coastline halo 6–10 px pale blue; chart
lines 2–3 px; timeline thread 3 px red with red glass-headed pins (Ø 22 px, specular dot); stamp borders 4–6 px
double rule, 8–10 px gap; ruled index-card lines 1 px blue-grey + a 1.5 px red margin line.

**Texture.** Everything is paper: mottled fibre noise on every sheet (±6 % luminance blotches), halftone dots on
photos (visible at ~6 px pitch, 45°), stamp ink is distressed (speckled voids, uneven density), a fine global grain.
The desk background is slightly soft and lower in contrast than the documents (depth-of-field cue).

**Lighting.** Soft drop shadows under every sheet (offset 6–14 px down-right, blur 10–18 px, 25–35 % black); stand-up
cut-outs cast long skewed shadows on the plane; **vignette spotlights** (centre lit, rim at 25–35 % brightness) open
the film, isolate the quote, and isolate the hesitating rubber stamp; the end card gets a slow corner darkening.

**Depth.** 2.5-D: desk layer (soft) → document layer (sharp, shadowed) → stand-up cut-outs (shadows) → stamps
(topmost). The isotype and the final nested holes are seen on a **perspective-tilted plane** (rotateX ≈ 35–45°,
rotateZ ≈ −8°). Documents drift slightly against the desk (parallax).

**Composition.** One document per frame, filling 50–75 % of the width, offset to one side so a tag, sticker or
counter can sit in the free side. Text margins: HUD at x = 120 px / y = 67 px; source line at y ≈ 1005 px. Big
counters sit right of their document (serif numerals 100–140 px). Stamps overlap the document edge or a label.

**Typography (free look-alikes in the engine).**

| role | source look | engine font | size @1080p |
|---|---|---|---|
| Chinese headline / montage word | heavy 宋体 / Song black | **Noto Serif SC 900** | 90–130 px (titles), 260–300 px (montage word) |
| Chinese stamp word | same, red, inside double rule | Noto Serif SC 900 | 70–110 px |
| plate titles in Latin caps | old-style serif caps, tracked +8 % | **Libre Baskerville 700** | 60–80 px, italic subtitle 26 px |
| typewriter slugs, French glosses, quotes | Courier-like slab mono, bold | **Courier New bold** (fallback Roboto Mono 600) | 22–32 px slugs, 40–44 px quote |
| Chinese body / translation | Song or Hei regular | Noto Sans SC 400/500 | 22–28 px |
| HUD | Hei + mono | Noto Sans SC 500 / Roboto Mono 500 | 20 px, grey `#6b675f` |
| counters | high-contrast serif numerals, red | Libre Baskerville 700 | 100–140 px |
| title character | heavy Song with guilloche lines inside | Noto Serif SC 900 | ≈ 560 px glyph |

Text appears **only as labels, glosses, counters, stamp words and one quote**. Every Chinese label has a smaller
French (second-language) gloss under or beside it, typed on; every chart has a source line.

## 6. Characters & objects

- **No characters.** People appear only as (a) halftone press photos with torn borders, (b) portrait cut-outs with a
  white border and drop shadow, named in Chinese + Latin small caps with a black **redaction bar**, (c) isotype
  pictograms (round head, arms out, flat, white or red), (d) silhouettes inside illustrations. For original work:
  anonymous silhouettes / halftone *illustrations* drawn in code, never real faces.
- **Prop kit**: pinned map plate with title cartouche; Paris departments map; seating plan grid with a dashed
  "BUREAU DU PROFESSEUR"; protest sign photo sticker; typewritten wire slip (slug "AFP · PARIS · 09.10.2025");
  engraving plates and daguerreotype in a brass oval; year tags (serif italic on white slips, red pin);
  red thread timeline; ruled index card with green / black bars and a dashed red gap; paper tags ("养老金 RETRAITES")
  that slide in like taped strips; a DÉCISION checkbox; a wooden rubber stamp seen from above; kraft-paper podium;
  country silhouettes as tokens; a ladder of ratings; graph paper chart; bond certificate with guilloche border,
  serial number, spirograph rosette.
- **Acting** = paper physics: things slide in and settle with a 2–4° rotation overshoot, topple (portraits rotate
  −20…−35° and drop 30 px), scatter (pictograms fly like confetti), tear (flag on a zigzag), hover (the rubber stamp
  bobs ±6 px under the spotlight for 2 s — indecision), ride (country tokens ride the heads of chart lines).

## 7. Camera & transitions catalogue

| # | move / transition | construction (from 30 fps strips) | duration @30 fps | easing | count |
|---|---|---|---|---|---|
| 1 | **Whip pan with motion blur** | camera translates 1–1.4 frame-widths across the continuous desk (horizontal or 30–45° diagonal), often with 2–6° rotation; directional blur ramps 0 → ~60–120 px streak → 0; lands with a 2–4 f overshoot settle | **10–12 f** (f93–f104 at 3.1 s: 2 f accel, 7 f full blur, 2 f decel, settle) | power3/expo.inOut + back-settle | 15 |
| 2 | **Zoom punch (radial blur)** | scale ×3–6 toward a map point; radial streaks; lands on a different, desk-free sheet (Paris map) | 6–8 f in; out-zoom 12–15 f | expo.in for the dive, power3.out landing | 5 (in 4.1, out 9.1, push 74.4, pull-back 84.5, dive 88.7) |
| 3 | **Hard cut word-card** | full-frame card change on a beat; ground colour alternates vermilion / black / paper / photo | cards held 13–20 f; last one 73 f | — | 4 + 1 out |
| 4 | **Torn-hole iris** | a jagged paper hole (white fibrous rim, inner shadow) bursts open from a point to ~70 % of frame in 4 f, creeps 20 f, then the camera punches through in 5–6 f | ≈ 1.0–1.1 s | power4.out burst, linear creep, expo.in punch | 2 |
| 5 | **Iris spotlight open / close** | black frame → feathered circle grows from a pinhole (r 0 → 520 px in 9 f) and holds as a vignette; later a vignette closes from full light to a pool (rim 25 %) over 6 f | 9 f open, 6 f close, holds 2 s | power2.out | 3 |
| 6 | **Flash + tear rupture** | 2 f overexposure (vignette lifts, image 60 % white), the object splits along a zigzag, shreds fly + rotate, photos slam in with 2 f stagger | 2 f flash, 10 f burst | expo.out | 1 |
| 7 | **Timeline truck** | camera slides left along a red thread in eased steps (0.6–1 s each), holds 1–3 s on each plate; small blur on faster steps | 31 f per step | power2.inOut | 1 sequence (6 steps) |
| 8 | **Plane tilt / un-tilt** | grid seen in perspective; before leaving, the plane flattens to front-on (8–10 f) and its pieces scatter | 8–10 f | power2.inOut | 1 |
| 9 | **Push to detail** | slow ×1.6 push into a chart region | 15–20 f | power3.inOut | 1 |
| 10 | **Nested pull-back** | camera retreats ×4–5 through holes: inner doc ⊂ page hole ⊂ desk hole, tags pop on each layer | ≈ 55 f (1.8 s) | expo.out | 1 |
| 11 | **Breathing push** (idle) | continuous scale-up 0.6–1.0 %/s + ≤ 0.2°/s rotation on every hold (measured: 1789 plate 0.84 %/s, 1968 1.0 %/s, chart 0.57 %/s, title 0.63 %/s) | whole hold | linear | always |
| 12 | **Title-card land** | the theme glyph appears at ~104 % with 80 % opacity, settles to 100 % in 5 f; Latin title types after 15 f | 5 f | power3.out | 1 |

## 8. Motion grammar

- **Stamp slam** (measured on 反转 81.82, 预算 49.12): frame N empty → N+1 stamp at **125–130 % scale, ~60 % opacity,
  rotated −6…−8°** (ghost) → N+2 at 100 %, full ink, rotated −3…−5° → 1–2 f micro rebound (101 %) → static. No fade.
  Paired with a thud SFX on N+1 (transients at 81.78, 72.92, 54.08, 52.52, 7.94 s).
- **Count-ups**: 0.6–2 s, power2.out; numbers in red serif; digits change every frame (24→36 in 0.7 s,
  627→1207 in 1.9 s, 23 %→87 % in 0.6 s while figures flip red left→right).
- **Typewriter**: ~32 characters / s for quotes (43 chars in 1.33 s), 12–20 cps for slugs/glosses; block cursor while
  typing; the slip is already in place before typing starts (≈ 0.7 s after the cut).
- **Highlighter**: one yellow sweep left→right, 10 f, after the quote completes.
- **Build-ons**: labels type, tags slide in from the frame edge (8–12 f, power3.out, settle with 2° rotation
  overshoot); stickers pop (scale 0 → 1.05 → 1 in 6 f); pins drop with a 3 f squash; portraits pop with ~0.3 s stagger.
- **Map builds**: border network scales up from the target point (15 f), fills fade in (8 f), pin drops (6 f),
  radar ring expands (r ×3 over 20 f, fading), dots spawn outward over 2 s.
- **Holds**: 1.5–4 s after a build, always under the breathing push. Nothing is ever static (hold_frac 0.002).
- **Secondary life**: slight flag wave, hovering rubber stamp, figures casting shadows, country tokens riding lines,
  smoke blobs expanding. Paper grain re-rolls (*inferred* 12 fps).
- **Rhythm**: events land on the music's transients (spectral-flux peaks at 0.19, 12.88, 13.33, 17.07, 17.81, 19.2,
  25.43, 26.02, 26.62, 27.2, 37.72, 44.72, 52.52, 54.08, 72.92, 81.78, 91.05 s all coincide with a cut, whip, stamp
  or fill). The tempo autocorrelation peaks at ≈ 191 / 2 ≈ **96 BPM** (*inferred*).

## 9. Sound

*Audio was analysed numerically (RMS, spectral centroid, spectral flux); it was not listened to.*

- **No voice-over** in the excerpt (Whisper hallucinated a lyric boilerplate on music). A narrated version of the
  same grammar (the full 正确君 programme) would use a calm, dry Mandarin VO at ~250–280 characters/min *(inferred)*.
- **Music**: tense documentary score, centroid ~2 kHz most of the time (piano/strings/percussion range *inferred*),
  **≈ 96 BPM**; dynamic arcs: loud opening hit (−10 dB RMS at 2–4 s), loudest montage (−8 dB at 14–16 s), near
  silence before the quote (−37 dB at 20–22 s), low drone under the markets chart (low/high band ratio jumps to 19 at
  75–80 s), swell to the title (−10 dB at ~90 s), then fade.
- **SFX** on almost every visual event: stamp thuds, whooshes on whips, typewriter clicks, paper slides
  (*inferred* from transients aligning with events; ≈ 40 strong transients in 95 s).
- **Loudness** −17.1 LUFS; music is the reference (no ducking needed).

## 10. Do / Don't

**Do**
1. Make every frame a paper object on one continuous desk; let the camera travel between them.
2. Whip with real directional blur (10–12 frames) and a small overshoot settle; vary direction (L, R, diagonal).
3. Keep red for judgement only: stamps, the key counter, the red thread, a deficit gap, the fill that carries the point.
4. Pair every Chinese label with a smaller second-language gloss (French in the source; English works) typed on.
5. Slam stamps over 2 frames (130 % ghost → 100 %) with a thud, rotated −3…−8°, distressed ink.
6. Run the persistent HUD: programme / chapter top-left, date · place top-right (mono), source line bottom-left.
7. Put a source / licence / "示意" note on every chart, map and photo plate.
8. Use one hard-cut word-card montage (3–4 cards × 0.4–0.7 s) for a fast list of nouns; alternate card grounds.
9. Breathe on every hold (0.6–1 %/s push, tiny rotation) — never freeze.
10. Use vignette spotlights for the hook and for one moment of suspense.
11. Use torn-hole irises and nested pull-backs to change layer (street → politics → markets).
12. End on one big theme character on a certificate-like document, with its gloss.

**Don't**
1. Don't use clean flat vector grounds or gradients — everything needs paper fibre, halftone or ink texture.
2. Don't fade between scenes; cuts only in the montage, otherwise camera moves.
3. Don't spread colour: no rainbow charts, no saturated backgrounds outside the one vermilion card.
4. Don't use real photos of identifiable people or scraped imagery in original work — draw halftone illustrations
   and silhouettes in code.
5. Don't hold a document without motion for > 1 s.
6. Don't animate stamps with a soft scale-pop or fade-in; they slam.
7. Don't set Chinese headlines in a light or sans weight — the identity is the heavy Song.
8. Don't over-text: no subtitles, no paragraphs; one quote at most per section.
9. Don't let the desk background compete: keep it softer and lower-contrast than the documents.
10. Don't invent numbers; schematic graphics must say 示意 (schematic) in the source line.
11. Don't copy the source's channel bug, its episode content or its sequence; build your own dossier.
12. Don't make whips without blur (reads as a slide) or longer than ~15 f (reads as a pan).

## 11. Replication recipe (code)

**Layer stack** (bottom → top): stage background `#d9cfbc` → **camera group** (`X.cam`) containing the **desk**
(one pre-rendered canvas image ≈ 4200×2600 px: 60–80 torn poster rectangles in the desk palette, cropped serif words
280–520 px, grey text-line bars, tape, then a 1.5 px blur and −10 % contrast) and **documents placed at desk
coordinates** (each a `<g>` with a paper-texture `<image>` clipped by a torn path, a drop-shadow filter, then its
content) → stamps (inside the document groups, topmost) → **overlays outside the camera**: vignette rect (radial
gradient, `r` tweened), flash rect, word-card layer (for hard cuts), HUD (HTML, sharp), grain (`X.grain(0.05)`).

**Recipes.**
- Paper: `X.paper('#e9e0cc', w, h, 0.07, seed)` per sheet; torn edge `X.torn(w, h, 7, seed, 12)` as clipPath;
  shadow `X.shadow('sh', 8, 12, 14, '#2a2018', 0.3)`.
- Halftone plate (archival look without photos): draw the illustration on a canvas with gradients (silhouettes,
  buildings, crowds), convert to dots (cell 6–7 px, 45° grid, radius ∝ √darkness), ink `#1d1b18` on `#efe7d6`, then a
  torn white border (`X.torn` with jag 9) and a tape strip.
- Stamp: `<g>` with two `rect` rules (stroke 5 / 2.5 px, 10 px apart) + Noto Serif SC 900 text, fill `#c4342a`, with
  an ink filter: `feTurbulence(baseFrequency .9, octaves 2)` → `feColorMatrix` alpha threshold → `feComposite in`
  (speckled voids) + `feDisplacementMap scale 2` (wobbly edges); `mix-blend-mode: multiply` look via 0.92 opacity.
- Motion blur: one `<filter>` with `feGaussianBlur stdDeviation="bx by"` on the camera group; `X.every(t => …)`
  computes the blur from the registered whips (pure function of t: `b = k·sin(πp)^2`, direction from the move vector).
- Zoom blur: during a zoom, show 3 `<use href="#cam">` copies at scale 1.04/1.08/1.12 (about the zoom centre) with
  opacity 0.35/0.25/0.15 plus a 4–8 px isotropic blur; hide them after.
- Perspective plane: project grid points by hand (`s = D / (D + v·sinθ)`, `y = cy + v·cosθ·s`), scale each upright
  figure by `s`, draw its shadow as a skewed, squashed, blurred copy; rotate the whole plane −8°.
- Torn-hole iris: a path built from a jagged polygon (24–40 vertices, radius noise ±12 %), used as a **mask hole**
  on the current sheet plus a white rim stroke 6 px + inner shadow; tween its scale 0 → 0.7 (4 f, power4.out) →
  0.85 (20 f) → 3.5 (6 f, expo.in) while the next sheet sits below.
- Typewriter: `X.typeOn` on Courier New bold + a block-cursor rect that follows `getComputedTextLength()`; `type` SFX
  for the duration.

**Camera rig.** One camera group; documents live at desk coordinates (e.g. map at (−1400, 300), notice at (2100, −500));
`K.whip(cam, t, x, y, {rot, dur:0.37})` tweens `x/y/rotation` with `expo.inOut` and registers blur;
`K.breathe(cam, t0, t1, 0.8 %/s)` adds a linear scale drift; `K.zoom(cam, t, scale, cx, cy)` for punches.

**Minimal skeleton.**
```js
X.boot(async X => {
  await X.loadVO();
  const K = DossierKit(X);                 // assets/kit.js
  const cam = K.camera();                  // desk + blur filter + breathing
  K.hud('纸上谈钱', '马克 · 开场', '1923.11 · 柏林');
  const note = K.sheet(cam, {x: 0, y: 0, w: 900, h: 460, rot: -3, paper: '#e8e2cf'});
  K.iris(0.2, 0.5);                        // pinhole → spotlight
  K.typeSlug(note, 'BERLIN · NOVEMBER 1923', 40, 420, X.line('hook').start + 0.4);
  K.stamp(note, '废纸', 520, 200, X.word('hook2', '废纸'), {rot: -6});
  const map = K.sheet(cam, {x: 2300, y: 400, w: 1100, h: 800, rot: 2});
  K.whip(cam, X.line('map').start - 0.25, 2300, 400, {rot: 2});
  ...
  K.titleCard('信', 'TRUST', 'A CURRENCY IS A PROMISE · 钞票是一种承诺', t);
});
```

**The 5 shots that define the style.**
1. **Iris-open object + typed slug** — dark frame, feathered spotlight grows on one symbolic paper object, slug types.
2. **Whip from document to document** — 11 f blur across the desk, landing with settle and an immediate label/type.
3. **Stamp slam on a judgement word** — 2-frame slam, thud, held to the end of the shot.
4. **Word-card montage** — 3–4 hard cuts: huge Chinese Song word + typed gloss + halftone plate + flat paper gag.
5. **Theme-word certificate** — one huge black character with guilloche lines on a guilloche-bordered document,
   bilingual gloss, closing vignette.

## 12. Per-video notes

- The excerpt is the **cold open** of a longer 正确君 programme (HUD reads "国债 · 开场" = "national debt · opening").
  The HUD's right slug changes per section (2026.09 下旬 · 巴黎 → 1789 → 2026 · 巴黎 → 2026.10 · 法国 → 2026.10 · 预算),
  so it doubles as a chapter / date tracker.
- **Honesty layer**: the bottom-left source line credits public-domain / CC0 images (Delacroix 1830, Thibault 1848
  daguerreotype, 1871 barricade photo, Natural Earth map data) and states caveats ("小人为示意，每个代表约 1%",
  "账页为示意"). This is unusual for motion graphics and is part of the look.
- Uses real archival photos and real politicians' portraits (four French prime ministers) — for original work replace
  with code-drawn halftone illustrations and anonymous silhouettes.
- **HyperFrames** (the HTML→video renderer named in the post) explains the look: DOM/SVG documents, CSS 3D planes,
  CSS filters for blur — exactly what our engine can do.
- Colour alternates by layer: street = warm paper + vermilion; politics = cream paper + black; markets = pink paper +
  blue/green data; title = pale green certificate. The palette shift is the chapter signal.
- The motion curve's quiet 60–80 % (chart section, motion 2–4) shows the style slows down when it argues with data.

## 13. Source-list issues

- `animated_frac` 0.095 is misleading: the whole piece is code-rendered motion graphics; paper texture, halftone
  dots and motion blur defeat the flat-shading detector. Treat it as 1.0 (fully designed frames).
- `wpm_overall` 10.1 is a Whisper hallucination on music; the true narration WPM is 0.
- `cuts_per_min` 3.77 undercounts transitions: 15 whips + 5 zooms + 2 torn holes are scene changes, which
  `scene_changes_per_min` (9.42) captures better.
- It is a 95 s **excerpt** posted on X, not a full episode; structure statements about the full programme are inferred.

---

## Comparison: what makes "dossier-editorial" a distinct type

| axis | **Vox** (`vox.md`) | **Collage brand** (`collage-brand.md`) | **Dossier-editorial** (this) |
|---|---|---|---|
| ground | one flat slate / black ground; evidence laid on it | flat axonometric sets on slate-violet; greyscale halftone cut-outs in 3-value architecture | **a desk of torn protest posters**; every element is a paper document with fibre texture and shadow |
| what moves | creeping push 0.25 %/s on stills; annotation strokes draw | slow trucks / build-in-place; colour seeps into the "product" | **whip pans with heavy motion blur every 3–7 s**; zoom punches; breathing push 0.6–1 %/s |
| pacing | cuts 4–9/min, motion 3.4–5.2, holds 0.30–0.54 | cuts 2.6/min, motion 4.6, holds 0.13 | scene changes 9.4/min, **motion 7.6 (p90 20.9), holds 0.002** |
| colour rule | one accent + one secondary per episode, yellow annotation | grey world, colour only on the product, then a full flood | **warm paper world; red only for judgement** (stamps, counters, thread); palette shifts by layer (pink markets, green certificate) |
| annotation device | hand-drawn yellow ellipses, tilted name tags, highlighter | none until the logo lockup | **rubber stamps** (2-frame slam), typed glosses, taped tags, red pins and thread |
| typography | bold grotesque labels, sentence case | almost no text | **bilingual: heavy Chinese Song + French / English small caps + typewriter slugs**; HUD + source line |
| voice | reporter VO ~155 WPM + interview bites | brand VO ~128 WPM | **music-led** (or calm Mandarin VO); SFX on every event |
| cuts | hard cuts are the base edit | camera travels, 5 cuts | **hard cuts only for the word-card montage** |
| ending | credits card with yellow rule | product lockup + logo | **one-character theme card on a certificate** |
| evidence | real footage, scans, interviews | stock photo cut-outs | archival plates + data documents, every one sourced in a footnote line |

**In one sentence:** Vox annotates evidence on a slate, the collage brand film paints colour into a grey cut-out
world, and dossier-editorial **flips through a stamped paper dossier at speed** — the camera is a reporter's hand
whipping across a cluttered desk, the red ink is the editor's verdict, and every sheet speaks two languages.
