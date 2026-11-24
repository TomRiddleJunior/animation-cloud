---
name: explainer-dossier-editorial
description: "Paper-dossier political-economy / history explainer in code — every frame is a document on a desk of torn protest posters (pinned map plates, ruled index cards, typewritten slips, halftone 'archival' plates, graph-paper charts, a guilloche certificate); the camera whip-pans between them with heavy motion blur, punches through maps with zoom blur, breathes on every hold; red is rationed to rubber-stamp judgement words that slam in over 2 frames; typography is bilingual (heavy Chinese Song + English/French typewriter and small caps) with a dossier HUD and a source line on every sheet; a hard-cut word-card montage, an isotype grid on a CSS-3D tilted desk, a torn-hole iris, a nested pull-back and a one-character title card. Use for '正确君-style', 'dossier / case-file explainer', 'paper documents on a desk', 'political economy explainer', 'history of a crisis', 'red stamp' or 'bilingual Chinese explainer', 'HyperFrames-style paper video', Mandarin-narrated or music-only cold opens. Builds on explainer-engine."
---
# Dossier-editorial — paper-dossier political-economy explainer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A political-economy story told as **a reporter's dossier spread across a desk**: each shot is one paper document,
the camera whips across a cluttered desk from sheet to sheet, and the editor's verdict lands as a **red rubber stamp**.
Chinese headlines in heavy Song with a smaller second-language gloss typed under them; a HUD (programme · chapter /
date · place / source line) makes it read as sourced journalism. Built from frame analysis of 1 source video — a 95 s
music-only cold open made with Claude + HyperFrames for the Chinese channel 正确君 (references/sources.md,
references/analysis.md). **Original work only**: your own story, your own fictional programme name, documents drawn
in code (halftone *illustrations*, never scraped photos or real people's faces — politicians are anonymous silhouettes).

## 1. Signature traits
- **Desk of torn posters** (beige / grey / slate / salmon paper, huge cropped serif words, grey text bars) under every
  document — soft and low-contrast; documents sharp with drop shadows, pins, tape.
- **Whip pan with directional motion blur** between documents on one continuous desk (11–12 frames, expo.inOut + a
  4-frame overshoot settle), plus **zoom punches** with radial ghosts through maps onto a desk-free sheet.
- **Red only for judgement**: 2-frame stamp slams (130 % ghost → 100 %, −3…−8°, distressed ink, thud), red counters,
  the red pin / thread, the isotype fill. Everything else is ink, paper and one cool data colour.
- **Bilingual typography**: Noto Serif SC 900 headlines + Courier/Libre Baskerville glosses typed on; every chart,
  map, plate carries a source / 示意 line bottom-left; HUD top-left and top-right.
- **Breathing camera** on every hold (0.6–1 %/s push + slow roll) — hold_frac ≈ 0.
- **Set pieces**: iris-open spotlight hook → flash/tear rupture → word-card montage (hard cuts) → typewriter slip with
  highlighter → isotype on a tilted 3-D desk (fill + fall) → torn-hole iris → vignette spotlight on a hovering stamp →
  graph-paper chart with a token riding the line head → nested pull-back → one-character certificate title.

## 2. Target metrics
Source: x_2114927236335972357 (95 s). Sample: `the sample film (the render is not included in this repository)` (70 s).

| metric | source | target | sample |
|---|---|---|---|
| scene_changes_per_min (median scene s) | 9.42 (3.5) | 8–11 (3–5) | **10.28** (5.67) |
| cuts_per_min (hard cuts) | 3.77 | 3–6 (montage only) | 5.14 |
| motion_mean / p90 | 7.56 / 20.9 | 6–9 / 15–24 | **7.16** / 13.2 |
| hold_frac | 0.002 | ≤ 0.03 | **0.012** |
| colourfulness / saturation | 23.0 / 0.13 | 18–28 / ≤ 0.18 | 20.1 / 0.13 |
| brightness | 0.78 | 0.68–0.80 | 0.73 |
| narration (CJK chars/min) | — (music-only) | 220–260 overall | 229 (298 while speaking) |
| LUFS integrated | −17.1 | −16 ± 1 | **−16.0** |

**Deliberate deviations:** the sample is narrated in Mandarin (the source is music-led), so each document holds
4–6 s for one spoken sentence (median scene 5.7 s vs 3.5 s), word cards are VO-paced (0.8–1.8 s instead of
0.43–0.67 s), the montage sits at 33 % instead of 13 % (cuts in the first 15 s: 1 vs 5), and motion p90 is 13 vs 21
(fewer, longer whips; camera pushes/pans inside the holds bring the *mean* to the source's 7.2). A music-only cut
can follow the source exactly: 1–2 bars per document at 96 BPM. Music sits 14 dB under the voice. The analyzer's
`animated_frac` and `wpm_overall` are meaningless here (paper texture; CJK captions have no spaces) — read
`data/vo.json` (`wpm_overall` = characters/min).

## 3. Script formula
| % runtime | beat | sample "纸上谈钱 · 马克" (Weimar hyperinflation, 1923) |
|---|---|---|
| 0–4 | **iris hook**: one symbolic paper object under a spotlight, a typed date-line slug | a 1 000 000-mark note, "BERLIN · NOVEMBER 1923" |
| 4–10 | **rupture**: flash, the object tears, halftone plates slam in; first stamp on the judgement word | 废纸 (waste paper) |
| 10–30 | **where / how**: one data card (red counter) → map plate → zoom → local map; tags + stamp | 4.2 → 4 200 000 000 000; Ruhr; 占领 |
| 30–42 | **word-card montage**: 3–4 hard cuts (huge Song word + typed gloss + halftone plate + flat gag), last card ends on a stamp | 消极抵抗 · 罢工 · 工资照发 · 印 |
| 42–50 | **the voice on paper**: typewriter slip + highlighter + translation, then a stamp | "valid until noon." · 作废 |
| 50–58 | **who lost**: isotype on the tilted desk, red fill + counter, figures fall | 100 figures = 100 %, ≈100 % |
| 58–68 | **who gained**: torn-hole iris to a ledger page; tags; a bar collapses; stamp | 勾销 |
| 68–80 | **the fix**: new document, equation typed, vignette spotlight on a hovering stamp → slam | 封顶 |
| 80–86 | **the data proof**: chart draws with a token riding the line, stamp on the turn | 止 |
| 86–93 | **nested pull-back** recap (tags on each layer) → dive | 钞票 / 国债 / 街头 |
| 93–100 | **one-character certificate** with bilingual gloss, closing vignette | 信 · CREDIT |

- **One sentence per document**; the stamp lands on the stressed judgement word (use `DK.word(id,'废纸')`).
- **Voice**: Kokoro `zm_yunjian` (calm male; `zm_yunxi` / `zf_xiaobei` also fine), `speed 0.92`, `lead 0.9`, gaps
  0.6–0.9 s between documents, 0.35 s inside a montage, `tail` ≈ 4 s for the title hold. ≈ 230 chars/min overall.
- **Mandarin gotchas**: write years as 一九二三, numbers as 四点二万亿; **drop the line-final 。** (tts.py otherwise
  trims the last syllable — see §10); verify with Whisper `small` (`language='zh'`).
- **Facts**: textbook-solid numbers only; maps, notes and notices are labelled 示意 (schematic) in the source line;
  write quotes as unattributed documents (a shop notice), never as words of a real person.
- **Music-only variant** (like the source): delete script.json, give every beat a fixed fallback time via
  `DK.at(line, phrase, fallbackSeconds)`, set `music_alone_db` −9 and place stamps / whips on the score's bar lines
  (96 BPM → one bar = 2.5 s; 9–10 scene changes per minute = a new document every 1–2 bars).

## 4. Visual system
| role | hex (`DK.C`) | use |
|---|---|---|
| desk base / posters | `desk #d6ccb8`, `paperMid #d1c5a9`, `beige #c4bbad`, `grey #8e857a`, `grey2 #706f69`, `slate #7d8593`, `salmon #bb8574`, `mustard #cfae6a` | `DK.desk()` collage, blurred, +20 % cream wash |
| sheets | `cream #ece3d1`, `ivory #f1eadb`, `slip #e6dcc7`, `card #f4efe4` | documents (patterns `DK.pat('cream')`…) |
| map | `land #e6dbba`, `land2 #efe8d2`, `sea #c9d3d6` + coastline halo | plates |
| graph / pink / cert | `graph #ece7da` (30 px grid), `pink #ebd3c4` (markets), `cert #d5dbcd` + `guil #4d7f73` | charts, finance pages, title certificate |
| ink | `ink #23211e`, `ink2 #3b3732`, `hud #6b665e` | text, bars, rules |
| **judgement red** | `red #c13a2d`, stamp ink `redInk #c4342a`, card ground `verm #8d281b` | stamps, counters, pins, fills — nothing else |
| data cool | `green #2d5b4e`, `noteInk #3f5a52`, `brown #7a5232` | one bar / banknote inks |

Typography (`DK.F`): **zh** Noto Serif SC 900 (headlines 70–130 px, montage words 180–260 px, stamps 100–150 px,
title glyph 640 px) · **lat** Libre Baskerville 700 tracked +8 (plate titles 54–84 px, counters 74–150 px) ·
**mono** Courier New bold (slugs 22–30 px, glosses 40 px tracked +8, quotes 50–54 px) · **zhs** Noto Sans SC 500
(translations 26–36 px, HUD 21 px, source line 16 px). `<html lang="zh">` is required for the CJK faces.
Composition: one document per frame at 50–75 % width, offset so a tag/counter fits the free side; HUD at x 120 /
y 52, source line y 992; stamps overlap a label or an edge. Texture: `X.paper` patterns on every sheet, halftone
dots (6–8 px cell, 45°) on plates, distressed stamp ink (`#dkInk`), grain 0.045.

## 5. Characters & objects (kit.js)
No characters. People are **halftone illustrations** (`DK.ill.person/soldier` silhouettes, caps/hats, folded arms) or
**isotype pictograms** on the 3-D plane. Objects: `DK.sheet` (torn / clean / deckle, ruled lines + red margin),
`DK.pin`, `DK.tape`, `DK.tag` (zh word + mono gloss strip, slides in and settles), `DK.stamp`, `DK.plate`
(torn white border photo plate from `DK.halftone(draw,w,h)`), `DK.guilloche`, `DK.rosette`, `DK.counter`
(linear/log, tick SFX), `DK.type` (typewriter + block cursor + SFX). Painters for plates: `DK.ill.sky/ground/person/
soldier/factory/smoke/facade/press/notes`. A wooden rubber stamp seen from above (see sample §10) for suspense.

## 6. Motion grammar
| element | build | frames @30 | ease |
|---|---|---|---|
| whip pan | `cam.whip(t,{x,y,r},{rotKick})` | 11 + 4 settle | expo.inOut → sine.out |
| zoom punch | `cam.zoom(t,{x,y,s:6},{dur:.3})` then `cam.cut` + `cam.move` s .66→1 | 9 + 11 | expo.in / power3.out |
| stamp slam | `DK.stamp(...)` | 2 (+3 rebound) | power4.in |
| tag slide | `DK.tag(...)` | 10 | back.out(1.3) |
| pop (numbers, pins, icons) | scale 1.25→1 | 7 | back.out(2) |
| typewriter | 22–42 cps slugs/quotes, 13–18 cps Chinese | — | none |
| highlighter | rect scaleX 0→1 | 10 | none |
| counter | log for exponential money | 1–2 s | power1.in / power2.out |
| breathing | automatic between camera moves | +0.75 %/s, 0.07°/s | linear |
| isotype | figures pop row by row (70 ms/row, 12 ms/col), red sweep L→R over the phrase, fall + fade 0.32 s | — | back.out(2), power2.in |
Rules: a visual change lands on (or 2–4 frames before) the stressed phrase; documents are in place when a whip lands and
their text starts typing ≈ 0.45 s later; nothing holds > 1 s without breathing or idle (hovering stamp bob 1.6 Hz ±7 px).

## 7. Transitions
| name | build | when |
|---|---|---|
| iris open | `DK.vignette({r:0,dark:1}).to(0.25,0.32,{r:560,dark:.95})` | the first 0.3 s |
| flash + tear | `DK.flash(t)`, vignette → 0 in 2 f, two clipPath halves fly + 7 shreds, plates slam (`scale 1.22→1`, 3 f, 70 ms stagger) | hook rupture |
| whip | `cam.whip` (auto `whoosh`) — vary direction: L, R, diagonal; land with 1–2° roll | every document change |
| zoom through | `cam.zoom` into a map point → `cam.cut` to a frame-filling desk-free sheet → `cam.move` | map → local map |
| hard-cut word card | `DK.card(t0,t1,{ground:'verm'|'black'|'paper', word, gloss, plate, strip, brush, gag})` | one montage of 3–4 nouns |
| torn-hole iris | `DK.hole(t,{paint: g => draw what is on screen})` (burst 4 f, creep 19 f, punch 6 f) | changing layer (street → state) |
| spotlight | `vig.to(t,.22,{cx,cy,r:470,dark:.74})`, release `.to(t,.3,{r:2600,dark:0})` | one suspense beat |
| plane tilt | `DK.iso(...)`, `iso.cam(t,{tilt:0,roll:0},.36)` to flatten before leaving | isotype in / out |
| push → pull-back | `cam.move` s 1→1.9 on the stamp, then s→0.6 (expo.out 2 s) through masked layers with tags | recap |
| dive → title | `cam.zoom` s→3.6 (0.42 s) then `DK.titleCard` (lands at 62 % and settles in 0.62 s) | ending |

## 8. Sound
`sound.json`: `doc-pulse` at 96 BPM (the source's measured tempo). Energy map: 1 under the iris → 3 on the rupture →
2 for the data cards → 3 on the montage → 1 under the typewriter slip → 2 for the isotype/ledger → 1 under the
spotlight (riser builds) → 3 on the stamp → 2 for the pull-back → 0 at the title (end hit). `music_under_voice_db −14`,
`duck_db 6`, `sfx_db −3`, `lufs −16` (`music_alone_db −9` for music-only). SFX: whip `whoosh`, zoom `zoom_in/out`,
stamp `stamp` (+ camera shake 5–7 px), typing `type`, tags/sheets `paper`, plates `shutter`+`thud`, counters `tick`,
highlighter/sweeps `scribble`, collapse `slide`, suspense `heartbeat`, title `stamp`(pitch .7)+`impact`.

## 9. Build recipe
1. Copy `assets/template/` (index.html with `#svg / #iso / #ovl / #hud`, kit.js, scene.js, script.json, sound.json).
   `ENGINE/make.sh <project> --draft` runs as-is (16 s demo; delete script.json for the music-only variant).
2. Write the beat sheet (§3), one sentence per document, stamp words chosen first. Mandarin VO: no line-final 。.
3. `make.sh --draft`, then lay documents out at **desk coordinates** (desk spans ±2600 × ±1600; frame at s=1 is
   1920×1080). Keep frame-filling sheets (local maps, ledger pages) off-desk or clear of other documents, and check
   that no later document overlaps a frame you will whip to.
4. Times: `DK.word(line,'短语')` / `DK.wordEnd` (CJK phrase matcher — `X.word` only matches single characters).
5. Per beat: `cam.whip` → `DK.sheet` + content → `DK.type` slugs → `DK.counter` / `DK.tag` → `DK.stamp` on the word;
   montage with `DK.card`; isotype with `DK.iso` (+ per-figure `inT/redT/fallT/outT`); `DK.hole` to change layer;
   `DK.vignette` for iris / spotlight / end; `DK.titleCard` last; `DK.hud(...).slug().source().hide()`.
6. Stills at every beat (`render.mjs --stills`), fix overlaps; full render `make.sh <project> --skip-tts --workers 3`.

## 10. QA checklist
- Stills: iris frame (black outside the pool, slug typing), rupture (plates inside frame), each whip landing (no
  foreign sheet on a frame-filling map), montage cards (no stray pre-start elements at 0,0 — `gsap.set` them
  off-frame), isotype (title above the grid, counter clear of the HUD), hole, spotlight, chart token, title glyph.
- Metrics vs §2: scene changes 8–11/min, hold_frac ≈ 0, motion 6–9, colourfulness ≤ 28, LUFS −16.
- Red audit: red appears only on stamps, counters, pins, judgement fills.
- Every map / note / notice / chart has a 示意 or data source line; every Chinese label has a second-language gloss.
- **Engine notes**: tts.py's CJK time estimate gives the line-final punctuation a pause weight inside the voiced span,
  so the trim cuts the last syllable — end Mandarin lines without 。！？; `X.word` cannot match multi-character CJK
  phrases (each character is a "word") — use `DK.word`. CSS-3D layers (`#iso`) render fine in headless Edge; keep
  `filter` off the 3-D containers (it flattens preserve-3d) except during whips.

## English edition
Sample: `assets/sample-en/` ("THE STRAIT FILE · TOLL", 93 s: Hormuz → oil → diesel → the midterms), with its
own `kit.js` copy (header lists the changes). Same grammar, same palette; only type, stamp words, HUD and voice change.

- **Font swap** (`DK.F`): the heavy-display role `zh` → **Playfair Display 900** (headlines 54–120 px, montage words
  200–230 auto-fit with `DK.card({maxW})`, stamps 92–170 px tracked ≈ size × 0.07, counters 150–230 px, title word
  420 px); `dm` **DM Serif Display** for mastheads (MEMORANDUM); **Libre Baskerville** 700 caps tracked +8…12 as the
  "small caps" (plate titles, BULLETIN, GENERAL ELECTION) and 400 italic for glosses / "schematic" notes; **Roboto Mono**
  600 for every typewriter slug (20–46 px, +2…4); **Inter** 500 16 px for the source line. `<html lang="en">` — no CJK
  fonts load. The gloss under a heavy word becomes a typed **fact slug**, not a translation
  (`DIESEL` / `MOVES THE TRUCKS`, `8 MARCH` / `FIRST IN FOUR YEARS`).
- **Stamp words**: one English word or two short ones, ≤ 10 letters, red only — `NO PASSAGE · CLOSED · VOID · RECORD ·
  VOTE` (+ `VOTE` again for a second country); the typed sub-line carries the fact (`WITHIN HOURS OF THE STRIKES`,
  `ALL-TIME HIGH FOR DIESEL`, `STRAIT CLOSED AGAIN DAYS LATER`). Six stamps in 93 s; two slams 0.9 s apart on
  "Each **time**, the strait **closed** again" read as a double verdict.
- **HUD wording**: left `THE STRAIT FILE / THE WATER` in tracked Roboto Mono, chapter swapped per section with
  `hud.chapter(t, text)` (THE WAR · THE MARKETS · THE TRUCE · THE SEA LANES · THE PUMP · THE VOTE); right slug
  `28 FEB 2026 · IRAN`; bottom-left source line on every sheet = publication + date (+ "schematic" for drawn maps,
  ledgers, memoranda, chart lines). Under a dark spotlight push the HUD light: `hud.colorAt.push([t0, t1])`.
- **Voice**: Kokoro `bm_george`, `speed 1.12` (hook 0.98, close 1.0 per line), `lead 0.9`, gaps 0.3–0.45 inside a
  thought / 0.55–0.8 between documents, `tail 4.2` → 165 wpm while speaking, 137 overall (212 words, 93 s). At 0.95 the
  same script ran 102 s and dragged. Whisper `small` confirmed "Reuters Ipsos", "Islamabad", "twenty-eighth".
  `X.word` works on English but prefix-matches (`'a'` hits "about") — anchor on distinctive words or `X.wordEnd`.
- **Current-affairs sourcing — a `FACTS.md` per film**: a table `# · fact as used · source (publication, date)` checked
  on the day; every narrated number and every number drawn on a document must trace to a row (supporting figures such
  as the $5.85 record, poll dates and n are fine if they are rows); list what was deliberately left out (conflicting
  counts, motives, forecasts). Drawn documents never carry invented clauses or quotes: memoranda get grey text bars and
  "schematic — not the text", radio warnings are "paraphrased — not verbatim", ledgers are "schematic, entries
  illustrative", isotypes say "one figure = one seat" / "each dot = 1 %". No portraits, no party or brand logos,
  no claims about motives.
- **Kit additions worth reusing**: `DK.isoRows` (one inline SVG per figure row: 470 seat figures cost about what 100
  did) with flat documents on the plane via `<use href="#docOuter">`; `DK.card` auto-fit / multi-line words;
  `DK.titleCard({word})` lays out a word plus a right-hand column; `DK.ill.sea/tanker/warship/skyline/smokeColumn/
  truck/pump/boxes`; the torn-hole cover can be the frozen frame itself (`<use href="#deskImg">` + `<use
  href="#ledgerOuter">` under the camera transform at the hole time); hide a document until its beat
  (`showAt(doc.outer, t)`) so neighbouring frames don't spoil it.
- **Measured** (`assets/sample/out/qa/metrics.json`, 93 s): scene changes 9.0/min (median 4.2 s) · cuts 4.5/min (radio hard cut + 4-card montage + cut back) · motion 7.3 / p90 13.7 · hold_frac 0.011 · colourfulness 23.2, saturation 0.14, brightness 0.78 · −16.0 LUFS · 137 wpm overall. A hard cut into a spotlight only registers as a cut if the vignette is already dark on the first frame (no ramp).

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
