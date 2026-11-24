# Data-cards — vertical "investigation" data reel (fixed card system on cream ruled paper)

Analysed 2026-10-27 from `insta/frames/De690_AsmTt/` (metrics, sheets) plus my own frame work on the 720×1280 30 fps
VP9 reel: 2 fps contact sheets of the whole reel (`samples/data-cards/scratch/src/sheet2fps_*.jpg`), 10–30 fps strips
around every build, count-up, clear, reveal and the insert (`s01…s17_*.jpg`, made with `scratch/strip.py`), 17 full-res
PNG frames for colour sampling and text-block measurement (`scratch/src/full/`), a per-frame diff probe (holds and
drift), a drift comparison of the screenshot cards (`drift_cmp.jpg`), and an RMS / onset / pitch / spectrogram look at
the soundtrack. Values marked *inferred* could not be measured.

---

## 1. Identity

A 95 s vertical **data-journalism reel** built as **one fixed card system**. Every frame is the same sheet of warm
cream paper with a faint ruled grid; a persistent chrome never moves (top-left `| INVESTIGATION` in letter-spaced brown
caps behind a thin burnt-orange tick, the outlet logo top-right, and a footer `SOURCE / CITIZEN LAB` whose thin orange
underline is a **progress bar** that grows with the runtime). Between them a left-aligned **content stack** builds
on, holds dead still, then **fades out as one block** before the next card builds in the same place: there are **no
cuts and no camera moves**. Each card is the same grammar — a spaced-caps brown label, a heavy condensed headline
(Anton-like) beside a thin orange rule, one data device (a huge count-up number, two labelled bars, a dot matrix, a
numbered list, a screenshot card, a log panel, a stamp), a small grey caption — and **burnt orange is rationed to the
one number or word that carries the point**. The single break in the paper world is a **dark 3-D render insert**
(phone + server rack, red laser line) that crossfades into the top half to explain the mechanism. A calm male VO
(~130 WPM while speaking, 113 overall) reads over a licensed chill-synth track; the reel ends on a two-part
question in big type and a centred logo card in silence.

## 2. Source analysed

| id | title | dur (s) | cuts/min | scene changes/min | median shot / scene (s) | motion mean / p90 | hold_frac | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|
| De690_AsmTt | fidato_09 (Instagram reel, 274 likes) — "INVESTIGATION": a Citizen Lab report on spyware delivered through ad bids, focus on Pakistan | 94.6 | 0 | **1.27** | 94.6 / **32.7** | **1.57 / 4.84** | **0.594** | **23.8** | **112.9** | **−14.1** |

Other facts: 720×1280, 30 fps, VP9; HE-AAC 44.1 kHz stereo. Brightness 0.843, saturation 0.131, dark-frame fraction 0,
`flat_mean` 0.689, `animated_frac` 1.0, silence 3.7 s (all at the end card). Palette (k-means): `#e6ddca` 39 % ·
`#e9e2d1` 28 % · `#e1d5c2` 18 % · `#181818` 5.5 % · `#925031` 2.9 % (orange, AA-mixed) · `#faf9f9` 2.8 % (screenshot
white) · `#a0988a` 2.6 % · `#f1eee5` 0.8 %. Audio credit: "Hotel Pools · Time" (licensed track). Caption opens with a
rhetorical what-if hook.

## 3. Measured pacing

| quantity | value | what it means in practice |
|---|---|---|
| scene changes | **1.27 / min**, median 32.7 s | the colour-histogram counter fires only on the dark insert (in at 33 s, out at 41.3 s); card swaps on the same paper do not register |
| hard cuts | **0** | every change is a fade-out of the content block + build-on of the next; chrome never changes |
| cards | **16 in 94.6 s** (one every 5.9 s; range 2.6–11 s) | one VO sentence (or clause pair) per card |
| motion_mean / p90 | **1.57 / 4.84** | low: only build-ons, count-ups, fades and two slow drifts move |
| hold_frac | **0.594** | 59 % of frames are frozen (no idle motion on text cards); the 41 % of motion is builds, counts, fades, the insert push and the Ken-Burns drift inside screenshot cards (diff 0.5–1.0 continuously while a screenshot is on screen) |
| motion by decile | 2.2 · 2.3 · 0.6 · 2.4 · 2.7 · 0.9 · 0.9 · 2.1 · 1.0 · 0.7 | bursts on count-up cards (hook, 4-billion, bars), the insert and the dot matrix |
| colourfulness / saturation | **23.8 / 0.13**, brightness 0.84 | a pale warm paper world; orange is 0–6 % of a frame |
| loudness | −14.1 LUFS, RMS −14…−18 dB the whole way | VO sits on top of a steady music bed; no dynamics until the end-card silence |
| WPM | 112.9 overall, ~130 while speaking, pauses 0.5–0.7 s | measured delivery; numbers spoken in full ("one hundred thirty-nine million") eat time |

**Shot list (source, s)** — `↑` = line rises out of a mask, `#` = count-up, `▤` = fade-out of the whole block.
0.13 orange rule grows · 0.23 ↑ ISRAELI SPYWARE- · 0.43 ↑ LINKED OPERATION · 2.43 "0M" fades in (3 f), holds 5 f ·
2.6–4.1 # 0→139M (orange, power-out) · 3.63 ↑ SUSPICIOUS / ADVERTISING BIDS · ~6.0 tag "—— INVOLVING PAKISTAN" ·
7.67 ▤ (10 f) · 8.13 small lead-in sentence fades (4 f) · 8.50 ↑ the big twist word (black, 280 px cap) ·
9.30 orange strike-through draws L→R (6 f) · 9.55 "ZERO-CLICK DELIVERY" (orange caps) · 10.27 ▤ · 10.77 label
OCTOBER 2026 INVESTIGATION · 10.93 ↑ CITIZEN LAB · 11.30 **screenshot card** reveals top→down from a hairline, an orange
line riding the reveal edge (15 f) · ~13 orange highlight box draws round the report title · screenshot drifts out
~4 % inside its frame · 14.5 caption "University of Toronto · …" · 15.33 ▤ · 15.73 SCALE OF THE DATA · 15.8 ↑ NEARLY ·
15.9–18.0 # 0→4,000,000,000 with an underline drawing under it · 16.9 "advertising bid records analysed" · 18.4 ▤ ·
18.9 GLOBAL EXPOSURE + rule · 19.07/19.27 ↑ SUSPICIOUS / AD BIDS · 19.2 YEMEN + empty bar track · 19.6 divider ·
20.07 MOST EXPOSED · 21.8–23.5 # 457M + grey bar grows · 25.4 PAKISTAN + track · 25.6–26.6 # 139M + **orange** bar ·
27.4 caveat "Figures refer to suspicious advertising bids, not confirmed device infections." · 28.6 ▤ · 29.2 THE
OPERATION WAS LINKED TO · 29.4 ↑ DISCOVER- (black) / TECH (orange) · 30.4 "Israeli surveillance company" · 32.9 ▤ ·
**33.0–33.35 dark render insert crossfades in** (top 55 %, fades to paper at its top and bottom) · 33.4 HOW IT ALLEGEDLY
WORKED · 34.1 01 AN ORDINARY ONLINE AD · 35.0–36.0 red laser draws phone→server, red dot glows · 36.3 02 DEVICE
INFORMATION COLLECTED · 38.5 03 POTENTIAL SPYWARE DELIVERY (orange) + "No user interaction required" · slow push all
the way · 41.2 ▤ insert and list together · 41.7 PAKISTANI TECHNOLOGY WEBSITE · 42.0–42.6 website screenshot reveals
L→R from a vertical line · 42.9–45.0 # 0→100,000 with an orange "+" · ~47 orange box round the site logo · screenshot
drifts out ~5 % over 7 s · 48.6 "• ACTIVITY ALSO DETECTED ON" (orange caps) · 48.9 ↑ GOVERNMENT-OPERATED / NETWORKS ·
51.9 ▤ · 52.4 SURVEILLANCE PLATFORM · 54.0 ↑ CONTROLIUM · 54.6 descriptor · 56.0 orange arrow draws down + "LINKED TO" ·
56.5 ↑ CANDIRU · 57.1 descriptor · **58.8 stamp "BLACKLISTED BY THE U.S."** (orange box, −2°, 3–4 f) · 59.4 footnote ·
61.3 ▤ · 61.6 CONTROLIUM ACCESS LOG · 61.8 log panel fades in (darker paper, orange left edge, "ACCOUNT NAME",
"● REC") · 62.3 ↑ PINDI (198 px cap) · 63.5 LOGIN LOCATION · 64.1 ↑ PAKISTAN ONLY (orange) · 64.6 caption · 66.4 ▤ ·
66.6 GLOBAL REACH · 66.7 ghost dot grid (20 × 10) · 66.8 ↑ NEARLY · 67.1–69.6 # 0→200,000 while the dots fill dark
row by row; last 4 dots orange · 68.1 "websites and mobile apps reached" · 69.0 "Each dot ≈ 1,000 websites and apps" ·
72.0 ▤ · 72.5 AFTER THE INVESTIGATION · 73.2 ↑ GOOGLE · 74.1 ↑ TERMINATED (orange) · 75.2 descriptor · 75.7 connector
"DISCOVER-TECH ——— AD EXCHANGE" · 76.7 orange ✕ lands mid-line · 78.6 ▤ · 79.3 ↑ NO CONFIRMED / INFECTIONS / IN
PAKISTAN (third line warm grey) · 82.0 short orange rule + a one-line bridge sentence (brown) ·
84.4 ▤ · 84.8 small lead-in (question part 1) · 85.0 ↑ big word (black) · 87.3 short orange rule · 87.6 small lead-in
(question part 2) · 87.9 ↑ big word (orange) · 88.4 small tail line · **90.8 everything fades, chrome included (8 f)** ·
91.2 logo fades in centred from 96 % · 91.6 orange underline grows from the centre · audio silent · end 94.6.

## 4. Script & narrative structure

Whisper transcript (178 words): one sentence per card, a fact-first hook, a short twist line, sourcing, scale,
comparison, actor, mechanism, local detail, link chain, a human-scale record, global reach, consequence, caveat,
two-part question.

| % runtime | beat | device |
|---|---|---|
| 0–8 % | **Hook = the headline number**: subject kicker, huge orange count-up, what it counts, a tag line | kicker + hero number + tag |
| 8–11 % | **Twist line**: a short sentence whose last word becomes a huge word, then struck through | lead-in + big word + strike |
| 11–16 % | **Who says so**: the report as a screenshot card | label + name + screenshot + caption |
| 16–19 % | **Scale**: one giant count with "NEARLY" | count + underline |
| 19–30 % | **Comparison**: two labelled bars, the subject in orange; caveat footnote | bars |
| 30–35 % | **Actor**: name in two colours + descriptor | headline + sub |
| 35–44 % | **Mechanism**: dark render + 3-step numbered list, step 3 orange | insert + list |
| 44–55 % | **Local evidence**: second screenshot + count | screenshot + count |
| 55–65 % | **Link chain**: A → linked to → B, stamp on B | connector + stamp |
| 65–70 % | **Human-scale record**: a log panel | panel |
| 70–76 % | **Global reach**: count + dot matrix | dots |
| 76–83 % | **Consequence**: actor + orange verb + severed connector | headline + ✕ connector |
| 83–89 % | **Caveat**: headline with a greyed last line + short rule + brown sentence | caveat card |
| 89–96 % | **Two-part question**: black word, orange word | question card |
| 96–100 % | **Logo card** in silence | logo |

- **Hook pattern**: the reel opens on the number, not on context — the count starts 2.4 s in and lands on the spoken
  number. The twist line is the second card (8 s) and is always a short sentence ending on a strikeable word.
- **Hand-over**: a card fades 0.4–0.6 s before the next sentence starts; the next label appears just before the first
  word; the stressed word triggers the headline or count.
- **Honesty layer**: a caveat footnote under the comparison ("…not confirmed device infections"), "NEARLY" before
  rounded numbers, "allegedly" in a label, "No confirmed infections" card before the question. Part of the look.
- **Ending**: a question in two lines (black / orange) and the logo; no CTA, no subscribe.

## 5. Visual system

**Palette roles (sampled hex on the full-res frames).**

| role | hex | use |
|---|---|---|
| paper, centre / edge | `#ebe2d3` / `#e0d4c1` | radial vignette ground (centre lighter, corners ~6 % darker) |
| ruled grid | `#e4dbca` on `#eae1d0` | 1 px lines every 60 px @720 (90 px @1080), Δ ≈ 6 levels — barely visible |
| ink | `#0a0704`–`#181818` | headlines, numbers, names |
| **accent burnt orange** | **`#c14800`** | the key number / word, side rule, header tick, progress bar, strike, stamp, bar fill, list number, short rules |
| orange edge shadow | `#5a2206` @ ~55 %, 2–3 px down-right | thin dark lower-right edge under every orange headline / number |
| label brown | `#695634` (rendered `#76603a`) | spaced caps labels, header, footer text |
| warm grey | `#5b5143` | captions, "NEARLY", greyed caveat line, lead-in sentences |
| bar grey / track | `#948a7b` / `#dbcfbb` | reference bar fill / empty track |
| divider / hairline | `#c4bbab` / `#dfd3c0` | row dividers / footer hairline |
| panel | `#dcd0bc` | log-card box (orange 3 px left edge) |
| screenshot white / frame | `#faf9f9` / `#1e2226` | screenshot cards |
| insert dark | `#0b0b0c` → `#1c1d20` | the render panel; red laser `#ff3b2f`, red box `#d8382c` |
| logo red / navy | `#e02a20` / `#1d2a4a` | outlet logo only |

**Shape language.** Rectangles and hairlines only: full-width bars (42 px @720 tall), 1 px dividers, a 2–3 px side
rule, short 80 px orange rules, an outlined stamp box, a darker panel, perfect dots. No rounded corners, no icons, no
illustration on the paper; illustration lives only in the dark insert (photoreal-ish 3-D render) and in screenshots.

**Typography (closest engine fonts; sizes as cap height, 720 → 1080 px, % of H).**

| role | source look | engine font | cap @720 | cap @1080 | % H |
|---|---|---|---|---|---|
| hero number | Anton-like heavy condensed, orange | **Oswald 700** + same-colour stroke 3.4 % + 0.93 condense | 255 | 383 | 19.9 |
| big word (CLICK.) | same, black | same | 187 | 280 | 14.6 |
| count numbers (200,000) | same | same | 165 | 248 | 12.9 |
| PINDI / question words | same | same | 132 / 95 | 198 / 143 | 10.3 / 7.4 |
| card headline | same, 1–3 lines, leading 1.24 × cap | same | 70–88 | 105–131 | 5.5–6.9 |
| kicker headline (hook) | same | same | 52 | 78 | 4.1 |
| bar value / bar name | same | same | 87 / 44 | 130 / 66 | 6.8 / 3.4 |
| list item | same | same | 37 | 55 | 2.9 |
| labels | grotesk semibold caps, tracking +0.3 em, brown | **Inter 600** | 14 | 21 (29 px font) | 1.1 |
| header / footer | same, smaller | Inter 600 | 12 | 18 (25 px font) | 0.9 |
| lead-in sentence | grotesk medium, warm grey | Inter 500 | ~19 | 28 (39 px font) | 1.5 |
| caption / footnote | grotesk regular, warm grey | Inter 400 | ~15 | 22 (32 px font) | 1.2 |
| screenshot body | text serif | Lora 400 | — | 31 px font | — |

Anton is not in the engine; Oswald 700 thickened with a same-colour stroke (`paint-order: stroke`) and condensed to
93 % is visually close (checked side by side).

**Texture & light.** Smooth paper gradient + grid, no grain, no shadows except the faint orange edge shadow and a soft
shadow under the stamp. Frames are pixel-still on holds.

## 6. Layout grid & safe zones (720 × 1280 → 1080 × 1920)

- **Column**: x = 60 → 660 @720 (8.3 % margins) → **90 → 990 @1080**. Everything is left-aligned on x = 90; numbers in
  bar rows right-align on x = 990. With a side rule the block indents 25 px @720 (37 @1080).
- **Header**: tick at x 60, label cap 77–89 @720 (6.0–7.0 % H) → baseline y ≈ 134 @1080. Logo box 575–665 × 45–135
  @720 → 862–998 × 68–202 @1080.
- **Footer**: text cap 1169–1183 @720 (91.3–92.4 % H) → baseline 1776 @1080; hairline + progress bar at y 1199 @720
  (93.7 %) → 1797 @1080. Progress = elapsed / runtime (measured 5.3 % at 5 s, 44 % at 40 s).
- **Content zone**: blocks start 22–37 % H and end ≤ 86 % H; the block is roughly centred on 45–48 % H. The insert
  occupies 0–55 % H (fades to paper over its last ~25 %), the list sits at 63–86 % H.
- **Instagram overlays**: the bottom ~18 % (y > 1050 @720) carries only the decorative footer; the right rail (x > 634)
  is touched only by right-aligned numbers and bars at mid-height — keep captions and labels out of it.

## 7. Caption system

No subtitles. On-screen text is **the card copy itself**: labels, headlines, captions and footnotes paraphrase the
VO sentence; the big word / number is the stressed word of that sentence. Lead-in sentences (the part of a VO
sentence before its stressed last word) are the only near-verbatim VO text, set small in Inter above the big word
they set up.

## 8. Motion grammar (frame counts @30 fps)

| move | construction | frames | ease |
|---|---|---|---|
| **line rise** | each headline line slides up out of a mask whose bottom is the line's baseline; lines stagger 6 f | 4–5 f | power3.out / expo.out |
| side rule | grows downward from the label top, extends as each line arrives | 3 f per segment | power2.out |
| label / caption / lead-in | opacity fade, no movement | 4 f | linear |
| count-up | number fades in at its start value (3 f), holds 5 f, then counts with a long decelerating tail | 1.4–2.5 s | power3/expo.out |
| bar grow | fill grows from the left in sync with its value count; track already visible | 1.2–1.7 s | power3.out |
| dot matrix | ghost grid at ~13 % opacity first, then dots turn solid in reading order with the count | ~2.5 s | expo.out |
| strike-through | thick orange bar (12 px @720) at ~45 % cap height, drawn L→R | 6 f | power2.inOut |
| screenshot reveal | clip opens top→down (or L→R) from a hairline, orange line on the leading edge | 15–18 f | power2.out |
| screenshot drift | content scales 107 → 100 % inside its frame over the hold | 4–7 s | sine.out |
| highlight box | orange 2 px box draws round the key element 1.5–3 s after the reveal | ~10 f | power2.inOut |
| connector arrow | orange line draws down, arrowhead pops, label fades | 12 f | power2.out |
| ✕ on connector | orange ✕ fades/pops mid-line | 4 f | — |
| stamp | outlined box + orange text, −2°, scale 118 → 100 % + fade | 3–4 f | power2.in |
| **clear** | the whole content block fades to paper (passes through a "greyed" mid-state), chrome stays | **10 f**, then 4–5 f empty | linear |
| insert in / out | dark panel crossfades over paper; slow push ~4 % over its 8 s | 10 f | power1.inOut |
| end | everything incl. chrome fades (8 f); logo fades in from 96 % (8 f); underline grows from centre (10 f) | — | power2.out |

Holds: 1.5–5 s after the last build of a card, perfectly still (no breathing, no grain). The only idle motion is the
screenshot drift, the insert push, the pulsing red dot and the progress bar.

## 9. Transition catalogue

1. **Block fade-out → empty paper → build-on** (all 14 paper-to-paper changes): 10 f fade, 4–5 f empty, next label
   fades and headline rises. The chrome is the continuity.
2. **Insert crossfade** (2): the dark render fades over the top of the paper while the list builds below; it leaves
   with the list in one 10 f fade.
3. **Chrome-out to logo card** (1): the only time header/footer disappear.

## 10. Sound

*Analysed numerically (RMS, onsets, spectrogram, pitch); not listened to.*

- **VO**: male (median f0 ≈ 140 Hz), calm newsreader delivery, ~130 WPM in phrases, 0.5–0.7 s pauses between
  sentences, 112.9 WPM overall. Sentences map 1:1 to cards.
- **Music**: licensed chill-synth bed ("Hotel Pools · Time"): a sustained pad around 400 Hz from the start, a soft low
  pulse, sub-bass entering at ~24 s (≈ 25 % runtime) and staying; music sits ~6–10 dB under the voice; RMS flat
  −14…−18 dB. **Hard stop at the logo card** (3.7 s digital silence).
- **SFX**: none detectable — no transients that are not syllables or the beat (*inferred*: at most very soft UI
  ticks). Keep SFX near-silent in replicas.
- **Loudness**: −14.1 LUFS integrated.

## 11. Formation rules (how to make another reel like it)

1. One sentence → one card. 10–16 cards per minute and a half; card length 3–11 s.
2. Fixed chrome: `| LABEL` top-left (brown spaced caps, orange tick), logo top-right, `SOURCE / …` footer with a
   hairline and an orange progress bar that tracks the runtime. Never move or recolour it.
3. Content stack on x = 8.3 % margin, left-aligned, centred around 45–48 % H: label → headline (side rule) → device →
   caption. Big numbers either hero-size (20 % H) or bar-row size (7 % H).
4. Orange only on the one thing that carries the point (the subject's number, its bar, the verb, the last step, the
   second question word). Comparison references are grey; caveat lines are warm grey.
5. Every line rises out of a mask in 4–5 f with a 6 f stagger; labels and captions only fade. No pops, no bounces,
   no slides from the side.
6. Every number counts up and lands on its spoken word; rounded numbers carry "NEARLY"; units/suffixes (M, +, %) stay
   on during the count.
7. Clear with a 10 f fade of the whole block, 4–5 f of empty paper, then build the next card in the same place.
8. Use each device once or twice: hero count, twist-word strike, screenshot card (with drift + highlight box), scale
   count with underline, two/three-row bars with a caveat footnote, two-colour name + descriptor, dark insert + 3-step
   list, arrow connector + stamp, log panel, dot matrix ("each dot = …"), severed connector ✕, caveat card,
   two-part question.
9. The dark insert is the only image on the paper: a dark 3-D-looking render with a red laser line, a red box and a
   glowing red dot, fading to paper at both ends, pushing in slowly.
10. Hold perfectly still between builds (hold_frac ≈ 0.6). No grain, no camera, no parallax.
11. End: question in two big lines (black / orange) with small lead-ins, then everything fades and the logo resolves
    in silence.
12. Facts: source line on every card, footnote caveats, no invented figures.

## 12. Per-video notes

- Screenshots in the source are real web pages (the Citizen Lab report, WhatMobile). For original work use code-drawn
  stand-ins (generic document / site mock-ups with factual text) — never a real brand's page or logo.
- The outlet logo is an illustrated knight with a red sun; original work needs its own simple mark.
- The header label stays "INVESTIGATION" for the whole reel (no chapter tracker).
- Two typography details sell the look: the thin dark lower-right edge on orange type, and the heavy stroke-thickened
  condensed caps — plain Oswald 700 reads too light.

## 13. Source-list issues

- `scene_changes_per_min` (1.27) counts only the insert; the real card rate is ~10 changes/min — use card count, not
  this metric, to pace a replica, and expect ~1.3–2 / min from the insert alone.
- Whisper writes "Kandiru" (Candiru), "DiscoverTech" (Discover-Tech), "What Mobile" (WhatMobile) — names on screen are
  authoritative.
- Music and VO overlap all the way; onset analysis cannot separate SFX from syllables, hence "SFX: none detectable".

---

## Comparison: what makes "data-cards" a distinct type

| axis | **Vox** (`vox.md`) | **Dossier-editorial** (`dossier-editorial.md`) | **Data-cards** (this) |
|---|---|---|---|
| frame | 16:9, slate ground, footage + annotation | 16:9 desk of paper documents | **9:16, one cream ruled sheet with fixed chrome** |
| what moves | creeping pushes, annotation strokes | whip pans with motion blur, stamps slam | **nothing but build-ons, count-ups and fades; holds are frozen** |
| pacing | cuts 4–9 / min | scene changes 9.4 / min | **0 cuts, 1.3 scene changes / min, a card every ~6 s** |
| colour rule | one accent + yellow annotation | red for judgement | **burnt orange for the one number / word per card** |
| devices | maps, footage, interviews | maps, stamps, word-card montage | **count-ups, bars, dot matrix, numbered list, screenshot card, log panel, connector, stamp** |
| type | bold grotesque | heavy Song + typewriter | **Anton-like condensed caps + spaced grotesk labels** |
| voice | reporter ~155 WPM | music-led | **calm newsreader ~113 WPM** |
| ending | credits card | one-character title card | **two-part question + logo in silence** |

**In one sentence:** Vox annotates footage, the dossier whips across a desk of papers, and data-cards **turns a
reporter's facts into a stack of still, sourced cards** — one sentence, one number, one orange word at a time, on a
sheet of paper that never moves.
