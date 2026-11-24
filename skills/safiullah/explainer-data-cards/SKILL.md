---
name: explainer-data-cards
description: "Vertical 9:16 data-journalism reel in a fixed card system — one cream ruled paper sheet with a chrome that never moves (| INVESTIGATION / EXPLAINER label top-left, outlet logo top-right, SOURCE / … footer whose orange underline is a progress bar) and a left-aligned content stack that builds on, holds dead still and fades out as one block, one card per sentence: heavy condensed Anton-like headlines rising out of masks beside a thin burnt-orange rule, letter-spaced brown labels, huge count-ups (\"NEARLY 4,000,000,000\"), labelled comparison bars (grey reference, orange subject), dot matrices (\"each dot = 1,000\"), a screenshot card with a Ken-Burns drift and highlight box, a twist word struck through, a 3-step numbered list under a dark 3-D render insert with a red laser line, an arrow connector + rotated stamp label (\"BLACKLISTED BY THE U.S.\"), a log-card panel, a two-part question ending and a silent logo card; calm newsreader VO ~113 WPM over a music bed, 0 cuts. Use for 'Instagram investigation reel', 'data reel', 'news explainer reel', 'fidato-style', 'stat cards video', 'report summary reel', 'shorts / TikTok explainer with big numbers', 'count-up numbers on paper', 'one fact per card'. Builds on explainer-engine."
---
# Data-cards — vertical investigation data reel

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A report turned into **a stack of still, sourced cards**: one sentence of narration → one card → one orange number
or word. The sheet of cream ruled paper and its chrome never move; only the content block changes — lines rise out
of masks, numbers count to the spoken figure, bars grow, dots fill, then the block fades to empty paper and the next
card builds in the same place. The one image on the paper is a dark 3-D render that crossfades into the top half to
explain a mechanism. Calm, sourced, faintly ominous; it ends on a two-part question and a logo in silence.
Built from frame analysis of 1 source reel (references/sources.md, references/analysis.md). **Original work only**:
your own topic and verified facts, your own invented outlet name and mark, code-drawn stand-ins for screenshots
(never a real brand's page or logo), no real people's words.

**Format: vertical 1080×1920, 30 fps.** For a 16:9 version: `data-size="1920x1080"`, keep the chrome at the same
relative positions (header 6.5 % H, footer 92 % H), widen the column to x 240–1680 and put the device (bars, dots,
screenshot) in a right-hand column beside the headline stack; scale type by H (cap heights in §4 are % of H).

## 1. Signature traits
- **Fixed chrome on cream ruled paper**: `| LABEL` (Inter 600, +0.3 em, brown, orange tick) top-left, outlet logo
  top-right, `SOURCE / …` footer with a hairline whose **orange underline grows with the runtime** (progress bar).
  Smooth radial paper gradient + faint 90 px grid; no grain; frames hold pixel-still.
- **One card per sentence, built in place**: spaced-caps label → heavy condensed caps headline beside a thin orange
  side rule → one data device → small grey caption. Left-aligned on an 8.3 % margin, centred around 45–48 % H.
- **Line rise**: each headline line slides up out of a mask in 4–5 f, 6 f stagger; labels/captions only fade (4 f).
- **Count-ups land on the spoken number** (appear at the start value, hold 5 f, power3/expo.out tail); "NEARLY"
  before rounded numbers; suffixes (%, M, +) stay on.
- **Burnt orange `#c14800` only on the point**: the subject's number/bar, the verb, step 03, the second question word,
  the strike, the stamp — with a thin dark lower-right edge. References are grey `#948a7b`, caveats warm grey.
- **Clear = whole block fades (10 f) → 4–5 f empty paper → next card.** 0 cuts, no camera.
- **Device menu** (each once or twice): hero count · twist word + strike-through · screenshot card (blind reveal led by
  an orange line, 108→100 % drift, highlight box) · scale count with underline · comparison bars + caveat footnote ·
  two-colour name + descriptor · dark render insert + 3-step list · arrow connector + stamp · log panel · dot matrix ·
  two-part question · silent logo card.

## 2. Target metrics
Source: De690_AsmTt (94.6 s). Sample: `the sample film (the render is not included in this repository)` (70.4 s).

| metric | source | target | sample |
|---|---|---|---|
| cuts / min | 0 | 0 | 0 |
| scene changes / min · median | 1.27 · 32.7 s | 1.2–2 (insert in/out only) | 1.70 · 21.2 s |
| cards | 16 / 94.6 s (5.9 s each) | one per sentence, 3–11 s | 10 + logo / 70.4 s |
| motion mean / p90 | 1.57 / 4.84 | 1.3–1.8 / 4–5 | 1.50 / 4.28 |
| hold_frac | 0.594 | 0.55–0.70 | 0.661 |
| flat_mean | 0.689 | ≥ 0.6 | 0.651 |
| colourfulness · saturation · brightness | 23.8 · 0.13 · 0.84 | 20–27 · 0.12–0.15 · 0.82–0.86 | 23.4 · 0.134 · 0.831 |
| WPM overall | 112.9 | 105–120 | 113.4 |
| LUFS | −14.1 | −14 ± 1 | −14.3 |

Deliberate deviations: scene changes read slightly higher than the source because a 70 s reel with the same single
insert has fewer minutes to spread it over; hold_frac sits a little above the source because the sample has one
screenshot card (the source has two, and their drift is what keeps its hold_frac below 0.6) — add a second figure /
screenshot card in longer reels.

## 3. Script formula
One sentence per card, ~10–16 cards in 60–95 s. Beat map (% runtime):

| % | beat | device | sample line (ozone sample) |
|---|---|---|---|
| 0–9 | **hook = the headline number** | ruled kicker + NEARLY + hero count (orange) + label + tag | "One treaty has phased out nearly 99 percent of the ozone-destroying chemicals it banned." |
| 9–14 | **twist line** ending on a strikeable word | lead-in + giant word + strike + orange caps | "And not a single country stayed out." |
| 14–22 | **the source document** | label + name + screenshot card + caption | "The Montreal Protocol was signed on September 16th, 1987." |
| 22–30 | **actor / culprit** | two-colour name (+ figure card) + descriptor | "Its main target: CFCs, from fridges and spray cans." |
| 30–40 | **mechanism** | dark render insert + 3-step list (03 orange) | "In the stratosphere, sunlight splits them, and their chlorine destroys ozone, again and again." |
| 40–48 | **scale / reach** | count + dot matrix ("each dot = …") | "In 2009 it became the first UN treaty ratified by every country." |
| 48–65 | **comparison** | label + ruled head + divider + 2–3 bar rows + caveat footnote | "…around 2040 for most of the world, 2045 over the Arctic, and 2066 over Antarctica." |
| 65–80 | **link chain / consequence** | name → arrow connector → name → stamp + footnote | "Their substitutes, HFCs, spare the ozone but heat the planet. So in 2016 the Kigali Amendment…" |
| 80–87 | **caveat / human-scale record** | log panel (or greyed-last-line caveat card) | "But the Antarctic hole still opens every spring." |
| 87–96 | **two-part question** | lead-in + black word / short rule / lead-in + orange word + tiny caps | "So, was the ozone layer a one-off? Or proof the world can act, again?" |
| 96–100 | **logo card**, music stops | `DC.endCard` | — |

- Hook opens on the number (count lands ~2–3 s in, on the spoken figure). Every fact checkable — list them in
  `FACTS.md`; use "nearly", "projected", "an estimated" exactly where the source does; footnote caveats on screen.
- **Voice**: Kokoro `am_michael`, speed **1.08** (≈ 144 WPM while speaking), gaps 0.6–1.0 s, lead 0.35, tail ~3.4 →
  ~113 WPM overall. Kokoro pauses ~1.3 s after a comma that follows a year ("In 2009, …") — drop that comma.
  Acronyms read fine as written (CFCs, HFCs, UN).

## 4. Visual system
**Palette (`DC.C`)**: paper `#ebe2d3` → edges `#dfd2bf` · grid lines ~6 levels darker · ink `#111010` · **orange
`#c14800`** (+ edge shadow `#5a2206` 55 %) · label brown `#76603a` · warm grey `#5b5143` (captions, NEARLY, caveat
line) · light grey `#7d7262` (footnotes) · bar grey `#948a7b` / track `#dcd0bc` · divider `#c8bead` · hairline
`#d6cab6` · panel `#ddd1bd` · insert `#0a0a0b → #1c1d20`, laser `#ff3b2f`, red box `#d8382c` · logo disc `#d4361d` /
navy `#1b2440` (invented mark).

**Typography** (cap heights @1080×1920; `DC.headText` = Oswald 700 + 3.4 % same-colour stroke + 0.93 condense ≈ Anton):

| role | font | cap px (% H) |
|---|---|---|
| hero number | head, orange | 370–383 (19–20 %) |
| giant twist word | head | 280 (14.6 %) |
| count number | head | 248–250 (13 %) |
| question words / panel word | head | 143–150 (7.5 %) |
| card headline (1–3 lines, leading 1.24) | head | 100–132 (5.5–6.9 %) |
| kicker headline | head | 78 (4 %) |
| bar value / bar name | head | 112–130 / 62–66 |
| list item | head | 54–56 (2.9 %) |
| labels | Inter 600, +0.3 em, brown | font 29 (cap 21) |
| header / footer | Inter 600, +0.3 em | font 25 |
| lead-in sentence | Inter 500, warm grey | font 38–41 |
| caption / footnote | Inter 400 | font 27–33 |
| screenshot body | Lora 400 | font 31 |

**Grid**: column x 90 → 990 (side-rule blocks indent to 127); numbers right-align on 990. Header baseline y 134,
logo box 862–998 × 64–200, footer text 1776, hairline/progress 1797. Content 22–86 % H; insert 0–60 % H with the list
at 63–86 % H. Keep labels and captions out of the right 12 % rail and the bottom 18 % (only the footer lives there).

## 5. Characters & objects
No characters. Objects are data devices (`DC.stack` methods, §9) plus two image types:
- **Screenshot / figure cards** — `s.doc({...})` (document page: nav strip, mono kicker, boxed condensed title, serif
  body on cream) and `s.figure({draw})` (white web page with a nav bar; you draw the content, e.g. code-drawn products).
  Both reveal with an orange leading line, drift 108 → 100 % and draw an orange highlight box. Use generic, factual
  stand-ins — never a real organisation's page, logo or a fabricated record.
- **Dark render insert** — `DC.insert(t0, tOut, draw)`; draw with `DC.ill.sphere` (3-D shaded balls), `ill.planetLimb`
  (planet from orbit + shell), `ill.laser` (red line), `ill.redBox`, `ill.glowDot` (pulsing red point), `ill.stars`.
  Grammar from the source: two objects, a red line between them, a red box on the target, a glowing red dot.
- **Outlet mark** — `DC.logoMark(parent, x, y, s, brand)`: vermilion disc + navy ÷ + heavy wordmark. Invent per project.

## 6. Motion grammar
| move | GSAP / kit | frames |
|---|---|---|
| line rise (mask) | `riser` power3.out | 5–6 f, stagger 6 f (`DC.T.stagger` 0.2 s) |
| side rule grow | attr height power2.out | 3–4 f per line |
| label / caption / lead-in | opacity power1.out | 4 f |
| count-up | appear 3 f, hold 5 f, `power3.out` | 1.2–2.5 s |
| bar fill | scaleX power3.out, synced to its count | 1.1–1.7 s |
| dot matrix | ghost 13 % → solid in reading order, power3.out | 2.2–2.5 s |
| strike-through | scaleX power2.inOut | 6–7 f |
| screenshot reveal / drift / box | clip power2.out 15–18 f · scale 1.08→1 linear over the hold · drawOn 12 f | — |
| connector | drawOn power2.out + arrowhead fade | 12 f |
| stamp | scale 1.18 → 1 + fade, power2.in, −2.2°, tiny 1.5 % rebound | 4 f + 3 f |
| clear | whole block opacity → 0, linear | 10 f, then 4–5 f empty |
| insert | crossfade power1.inOut + linear 4.5 % push | 10 f |
| end | chrome fade 8 f → logo 96→100 % + fade 9 f → underline from centre 10 f | — |
**Holds are frozen** — no breathing, no grain, no idle wobble on text cards (hold_frac ≈ 0.6 is part of the look).
Visual events land 2–4 f before the stressed word.

## 7. Transitions
1. **Block clear → empty paper → build-on** (every card change): `DC.card(id, t0, tOut, build)` fades at `tOut`;
   start the next card ≥ 0.15 s after the fade ends. Use `tOut = nextLine.start − 0.55`.
2. **Insert crossfade** (once, for the mechanism): `DC.insert(t0, tOut, draw)` + a `DC.card(..., {top: 1206})` list
   below it, both leaving on the same `tOut`.
3. **Chrome-out → logo** (once, at the end): `DC.endCard(t)`; set the question card's `tOut = t` with `fade: 0.27`.

## 8. Sound
`sound.json`: `{"preset": "doc-pulse", "bpm": 96, "sections": [{"t":0,"energy":1},{"t":~23 % runtime,"energy":2},
{"t":~82 %,"energy":1},{"t":logo − 0.2,"energy":0}], "end_hit": false, "music_under_voice_db": -15, "sfx_db": -9,
"lufs": -14}` — a steady bed that lifts a layer at ~25 % (the source's sub-bass entry) and **stops at the logo**.
SFX are near-silent (the source has none audible): the kit adds soft `tick` (bar counts), `click` (list rows),
`swoosh` (strike), `paper` / `slide` (screenshot reveals), `stamp`, `woosh_low` (insert) — keep `sfx_db` ≤ −8.
VO: calm, even newsreader; numbers spoken in full.

## 9. Build recipe
1. Copy `assets/template/` → your project (it holds `kit.js`; keep it in sync with `assets/kit.js`).
2. Write `FACTS.md` (claim · wording · source), then `script.json`: one line per card, ids per beat.
3. `ENGINE/make.sh <project> --draft --workers 3` to get `data/vo.json`; read word times; place builds on words.
4. In `scene.js`: `DC.init(X, {label, source, brand})`, `DC.progressBar(0.05, tLogo)`, then per beat
   `DC.card(id, line.start − 0.2, out(next), s => { … })` with
   - hook: `s.ruleOn(); s.head([...]); s.ruleOff(); s.head(['NEARLY'], t, {color: C.greyNum}); s.number(t, {to, color: C.orange, fmt}); s.head([...]); s.tag(...)`
   - twist: `s.lead('…'); const [w] = s.head(['WORD.'], t, {cap: 286}); s.strike(w, t2); s.label('…', t3, {color: C.orange})`
   - document: `s.label; s.head; s.doc({t, tag, kicker, title, sub, body, boxT, hold}); s.body(caption)`
   - culprit: `s.head([black, orange], t, {colors}); s.figure({t, draw, box, boxT, hold}); s.lead(descriptor)`
   - mechanism: `DC.insert(t0, tOut, draw)` + `DC.card(..., s => { s.label; s.list([{text,t},…,{text,t,color: C.orange, sub}]) }, {top: 1206})`
   - reach: `s.number(t, {to}); s.lead(sub); s.dots({cols, rows, n, accent, t, dur}); s.body('Each dot = …')`
   - comparison: `s.ruleOn(); s.label; s.head; s.ruleOff(); s.divider(t); s.barRow({...}) ×2–3; s.body(caveat)`
   - chain: `s.head; s.lead; s.connector('LINKED TO', t); s.head; s.lead; s.stamp('…', t); s.body(footnote)`
   - record: `s.panel(t, p => { p.label; p.head; p.divider; p.label; p.head(..., {color: C.orange}) })`
   - question: `s.lead; s.head(['…?']); s.shortRule(t); s.lead; s.head(['…?'], t, {color: C.orange}); s.label`
   then `DC.endCard(tLogo)` and `X.end(...)`.
5. `node ENGINE/render.mjs <project> --stills …` at every build → LOOK; then `ENGINE/make.sh <project> --skip-tts --workers 3`.

## 10. QA checklist
- Stills: mid-rise of a headline (mask edge clean), mid-count, mid-clear (block greyed, chrome untouched), the empty
  paper frame between cards, screenshot reveal edge, insert at full opacity (header still legible on the top fade),
  the stamp, the end card.
- Metric gates (§2): cuts 0; motion 1.3–1.8; hold 0.55–0.70; colourfulness 20–27; brightness 0.82–0.86; WPM 105–120;
  LUFS −14 ± 1. If hold_frac is too high add a screenshot/figure card or lengthen counts — never add idle wobble.
- Do: one orange thing per card; "NEARLY"/caveats; numbers on their spoken word; one device per card; footnotes.
- Don't: cuts, camera moves, slides from the side, pops/bounces on text, grain, gradients on type, more than one
  accent colour, real screenshots or logos, unverified figures, text in the right rail or under the bottom 18 %.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
