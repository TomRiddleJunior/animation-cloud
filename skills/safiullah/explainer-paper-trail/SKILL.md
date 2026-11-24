---
name: explainer-paper-trail
description: "Vertical (9:16) satirical 'So you want to …?' how-to reel in code. A rhymed, numbered list of STEPS is rapped or chanted over an 88 BPM beat. Every line is backed by a paper document on a pale grey desk: a charter, ledger, share certificate, Act of Parliament, price chart, odometer counter, newspaper, verdict slip or order slip, with blurred sheets behind it. Each STEP opens on a full-bleed red card that splats in like spilt ink and is torn away. Captions are bold serif karaoke at 69 % height with a cream halo and one red word; red rubber stamps spatter ink, red marker notes and yellow highlighter mark the evidence, and a small 'STEP n' tag sits top-right. The reel opens on a dark cinematic line-art plate and ends with a do-nothing final step, a twist aimed at the viewer, and an ink-blot wipe to a poll card and wordmark. Use for 'belltake-style', 'so you want money from…', 'step-by-step satire', 'how the rich profit from X', 'rap explainer reel', 'documents on a desk' Instagram/TikTok/Shorts explainers, economics or history satire with sources, and 'paper trail' or 'evidence board' reels. Builds on explainer-engine."
---
# Paper-trail: a satirical "how-to" reel told in documents

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A sardonic second-person how-to ("So you want to …?") is delivered as a fast rhymed list of numbered **steps**. Each line is proven by a **paper document dropped on a pale grey desk**. Each step opens on a **red ink-splat STEP card** that is torn away, and the reel ends on a twist that implicates the viewer, then a **poll card**.

This skill was built from frame analysis of 1 source reel: @belltakesocial's "So you want money from war?" (166 s, 9:16; see references/sources.md and references/analysis.md). **Original work only**: use your own topic, script, document mastheads and wordmark. Never use real logos or portraits, and never quote or caricature living people.

**Format.** The format is **vertical 1080×1920 at 30 fps**: `<html data-size="1080x1920">`, `viewBox="0 0 1080 1920"`.
- For a 16:9 version, set 1920×1080. Keep documents at about 55 % of the frame height on the left two-thirds, and put the caption block at x 0.5 W, y 0.80 H with a max width of 0.6 W.
- The STEP card puts "STEP" top-left and the numeral at the right third. The kit's layout constants (`PT.stepCard`, `PT.captions({y,maxW})`, `PT.stepTag({x,y})`) take these values as options.

## 1. Signature traits
- **Desk:** one plain pale warm-grey desk (`#d6cfc1` → `#aba395`, fine horizontal streaks, screen-space light falloff). Every frame is a document or prop on it. 1–3 blurred sheets sit behind the hero sheet.
- **STEP cards:** a red droplet, then a blob with stepped rims covers the frame in 3–4 f. Cream "STEP" + underline + a 700 px numeral fade in, hold ≈ 1.25 s, and the sheet is **torn away upward** in 5 f.
- **Karaoke captions:** bold serif (Lora 700, 68 px) with a cream 10 px halo, centred at y 1335 (69.5 %). They are laid out for the full line and revealed word by word on the VO. **One red word** per line.
- **Red** belongs to judgement only: stamps with ink spatter, the caption keyword, marker notes, chart heads, price tags and the cards. Everything else is ink on paper, plus yellow highlighter and certificate green.
- **Constant camera:** the camera trucks or tilts along each document, documents **fall from the camera** (blurred and big → sharp, with the shadow tightening), whip pans move between documents, the camera re-frames on every new line, and stamps punch in.
- **Bookends:** a dark line-art plate (the hook; a late dark plate for the darkest step) at one end, and an ink-blot wipe to a poll card plus a small original wordmark at the other.

**How it differs from explainer-dossier-editorial**, the closest style (16:9 documents on a desk):

| | dossier-editorial | paper-trail |
|---|---|---|
| desk | torn-poster collage | one plain pale-grey desk |
| moving between documents | whip pans with heavy motion blur across one continuous desk | documents fall from the camera or slide in; the camera trucks or tilts along each one; steps change through red splat → card → rip |
| sound | music-led or calm narration, 9 scene changes/min | wall-to-wall rhymed VO on an 88 BPM grid, 18.5/min |
| words on screen | bilingual headings and a dossier HUD | karaoke captions plus a lone "STEP n" tag |
| structure | crisis narrative in chapters | a numbered list ending in a twist at the viewer and a poll |
| red | only stamps and counters | also full-bleed cards, caption keywords and marker notes |

Full comparison: references/analysis.md (end).

## 2. Target metrics
Source: De7LQ5tPx85 (165.5 s). Sample: `the sample film (the render is not included in this repository)` (70.8 s). The analyzer squashes 9:16 to 160×90 for motion and histograms, so compare only with vertical sources.

| metric | source | target | sample |
|---|---|---|---|
| scene_changes_per_min (median scene s) | 18.5 (2.41) | 16–20 (2.4–3.2) | **18.7** (2.84) |
| cuts_per_min (first 15 s) | 6.2 (3) | 5–8 (3) | 7.6 (3) |
| motion_mean / p90 | 11.8 / 23.4 | 10–13 / 15–24 | **10.9** / 15.0 |
| hold_frac | 0.053 | ≤ 0.06 | **0.052** |
| colourfulness / saturation | 22.8 / 0.17 | 20–28 / ≤ 0.21 | 27.6 / 0.205 |
| brightness / dark-frame frac | 0.745 / 0.067 | 0.70–0.78 / ≤ 0.09 | 0.738 / 0.085 |
| WPM overall (while speaking) | 185 (rap) | 135–185 | 138 (169) |
| LUFS integrated | −14.1 | −14 ± 1 | **−14.0** |

**Deliberate deviations**
- **WPM.** Kokoro cannot rap. Above speed ≈ 1.35 it blurs, so the sample delivers 3 bars per step at speeds of 1.06–1.35. That gives 169 WPM while speaking but 138 overall; Whisper `small` still transcribes it correctly. For the source's density, record a human, or accept a longer reel with 4-bar steps.
- **Colourfulness.** The red cards are held 1.25 s (the source holds 0.6–1.3 s) because the analyzer only counts a card's in and out as separate scene changes when they are ≥ 1.5 s apart (peak to peak). At 1 fps, each card is then sampled twice. With 1.1 s holds, colourfulness drops to 26 but scene changes fall to 16/min.
- **Motion p90** (15 vs 23). The source drops several documents per line; the sample drops about one.

## 3. Script formula

| % runtime | beat | sample: "So you want to run a bubble?" (South Sea Bubble) |
|---|---|---|
| 0–8 | **dark cinematic plate** + the title question in 2 lines (cream caption, red keyword) | line-art press slams → night London 1720, a bubble rises: "So you want to run a *bubble?* / Forget the ships. Forget the *spice.*" |
| 8–15 | desk intro: the premise in 1 couplet, 2–3 props | bill of lading struck out, price tags £100 → £200, SOLD AGAIN: "…selling a *price,* and a *fool* to pay it twice" |
| 15–77 | **numbered steps**: 1 step = 3–4 bars; line 1 starts "Step n:" on the downbeat (red card); 1 document per line; the last line is the joke | 1 charter 1711 · 2 swallow £31 m of debt (odometer) · 3 stock to ministers, nothing paid · 4 chart £128 → £1,000, Bubble Act · 5 crash to £150, Newton reportedly lost £20,000 |
| 77–86 | **the do-nothing final step** + consequence (one dark plate) | 1721 inquiry, the Chancellor to the Tower |
| 86–93 | **twist aimed at the viewer** | "a bubble needs no villain, just one more *buyer.* Check your portfolio…" |
| 93–100 | ink blot → **poll card** + wordmark, music resolves | "Who blows a bubble?" (4 options), "ledgerline" |

**Writing**
- Deadpan imperatives in the second person, with rhymed couplets (AABB) and short punch lines ("Who cares?", "Shut the gate.").
- Escalate from the personal to the systemic.
- Mark the red word in `cap` with `*…*`. Write numbers as words in `text` and as figures in `cap`, with `^n` when one caption token covers n spoken words (`£128.^2` = "one twenty-eight"). Hyphenated words are a single Kokoro token.
- Every figure must be in `FACTS.md`. Write "reportedly" for anecdotes. Do not use legends (for example the "nobody to know what it is" prospectus).

**Voice and grid**
- Kokoro `bm_george` (`am_michael` also works). Put each group's first line on a bar with `"at"` (88 BPM ⇒ bar = 2.727 s) and set `gap` to 0.06.
- Run `python assets/fit_speed.py <project>` after each TTS pass. It scales each group's speed (1.0–1.35) so the group fits before the next bar. Two or three passes converge.
- Leave a `tail` of ≈ 4 s for the poll.

## 4. Visual system (`PT.C`, `PT.F`)

| role | hex | use |
|---|---|---|
| desk / streak / bottom | `#cdc7b8` / `#e7e2d8` / falloff to `#aba395` | `PT.desk()` (overlapping tiles) + `PT.light` |
| paper / warm / cream / parchment / slip | `#eceae4` / `#ece7dd` / `#e9e2d3` / `#e3d7ba` / `#f1ede4` | alternate white and parchment between neighbouring documents (the colour histogram sees the swap) |
| certificate / manila / newsprint | `#d3dbbd` + green `#3d5544` / `#d9caa9` / `#cfc8b8` | |
| ink / ink2 / grey / bars / rule | `#1e1812` / `#3b352d` / `#8f877a` / `#cbc5ba` / `#d2cbbf` | |
| **red** caption / card / stamp | `#c13c24` / `#c73b1c` / `#c43d24` | judgement only |
| numeral / halo | `#f8efe4` / `#f3ece3` | |
| highlighter / odometer / gold | `#e3cf47` / `#1d1a16` / `#c9a54a` | |
| dark plate / silver line | `#25231f` gradient / `#bdb8ad` | hook and late plate |

**Typography**
- Captions: Lora 700, 68 px, line height 86, letter-spacing −1.
- Headlines: Archivo Black 54–130 px, tracked +2–6.
- Body: Libre Baskerville (italic sub-heads 26–38 px).
- Slugs and tables: Courier New bold 19–34 px.
- Notes: Caveat 700, 60–84 px.
- Card: Archivo Black, "STEP" 96 px, numeral 700 px.
- Tag: Inter 800, 32 px. Poll: Inter 40–52 px. Wordmark: Libre Baskerville 700.

**Grid (1080×1920)**
- Hero documents: y 0–1250, often bleeding off the top.
- Captions: first baseline 1335, max width 900, ≤ 2 lines.
- STEP tag: right edge 990, baseline 318.
- Nothing readable below y 1575 (the Instagram UI). The right rail x > 950 is used only by the small tag.

**Texture**
- Seamless paper tiles (`PT.pat`), JPEG desk tiles, grain 0.05.
- Shadow: blur 16, offset (4, 10), 30 %.
- Background sheets: `PT.ghost` (canvas pre-blurred at 7 px).

## 5. Characters & objects
There are no characters. People exist as roles in text ("a Minister", "the buyers") or as anonymous silhouettes. Kit objects:

**Paper**
- `PT.doc(parent,{x,y,w,h,rot,paper,edge:'clean'|'deckle'|'torn',border})` returns {g, m (mover), body, shadow}.
- Templates: `PT.docs.cert / act / notice / news` (fill-fitted titles).
- Text and marks: `PT.text`, `PT.lines` (grey text bars), `PT.rule`.

**Evidence marks**
- `PT.hl` (highlighter), `PT.hand` (red marker text, clip reveal), `PT.scrawl` (red strokes drawn on).
- `PT.stamp(parent,t,str|[l1,l2],x,y,{size,rot,color})`: 2-frame slam, ink spatter, shake and punch-in.

**Data**
- `PT.odometer(parent,x,y,{digits,prefix}).run(t,to,dur)`: rolling digits with carry.
- `PT.chart(parent,{x,y,w,h,vmin,vmax,data,grid,xlabels,fmt})`: draw with `.draw(t,toFrac,dur)`. A red dot and price tag ride the line head.

**Props**
- `PT.tag` (price tag on a string), `PT.seal` (wax seal + ribbon).
- Draw others inline (apple, paper boat, tower): flat fill + 3–5 px dark outline + soft shadow.

## 6. Motion grammar

| element | build | frames @30 | ease |
|---|---|---|---|
| document drop | `PT.drop(doc,t)`: scale 1.7 → 1, rot 9° → 0, blur 9 → 0, shadow tightens, 5 px skid | 7 + 8 | power2.in / power2.out |
| slide in / out | `PT.slide(doc,t,dir)` / `PT.out(doc,t,dir)`, blur 10 | 8–9 | power3.out / power2.in |
| camera travel per document | `PT.cam.to(t, frame(x0,y0,x1,y1,{top,s}), dur, 'sine.inOut')`: top edge 170 → −120 px, s 1.15 → 1.35 | 60–150 | sine.inOut |
| whip to the next document | `PT.cam.to(t, frame(...), 0.28, 'expo.inOut')` | 8 | expo.inOut |
| line re-frame | `PT.bump(t, ±90–150, ±60, 0.035–0.07)` on each caption chunk | 7 + 60 settle | cubic out, exp back |
| stamp | slam + 11 droplets (gravity) + 8 px shake + 5.5 % punch-in | 2 + 17 | power4.in |
| caption word | opacity 0 → 1 at the word onset − 0.04 s | 4 | power1.out |
| caption out | fade + rise 10 px | 3 | power1.in |
| odometer | count 0 → value | 50–90 | power2.out |
| drift | `PT.drift` amp 14 px, rotation 0.45°, zoom ±1.6 %: never a frozen frame | — | sines |

## 7. Transitions

| name | build | frames | when |
|---|---|---|---|
| **red splat → STEP card** | `PT.stepCard(T,{n,exit:T+1.25,x,y,seed})`; T = `X.line(id).start − 0.04`; vary the splat origin (x, y) | 4 + 3 fade | every step |
| **LAST / STEP** | `PT.stepCard(T,{big:true,small:'LAST',label:'STEP',exit})` | same | the turn |
| torn rip | built into `stepCard` (`exit`) | 5 | card → document |
| hard cut | scene groups `[t0,t1]` | 0 | hook press → night plate → desk; the late dark plate |
| ink-blot wipe | `PT.blot(t,{hold:0.13,x,y,rx,ry})`: cover, hold, recede to the opposite corner | 4 + 4 + 8 | before the poll |
| fall-from-camera / slide | see §6 | 7–9 | document swaps inside a step |
| whip pan | camera to the next document (place it ≈ 1000 px to the right on the desk) | 8 | 1–2 per step |
| pull-back over a pile | camera s 1.3 → 0.64 over scattered `PT.docs` + ghosts | 33 | the twist |
| author at the camera | `PT.atCam(parent, camState)`: children in frame pixels land where the camera will look | — | documents dropped mid-move (chart beats) |

## 8. Sound
`sound.json` uses `hype-trap` with `bpm 176` and `bars_per_chord 2`. That plays as an **88 BPM** boom-bap/trap feel: claps on 2 and 4, 808 bass, rolling hats.
- Energy 2 on the hook → 3 from the desk intro (an automatic riser and impact) → 1 under the twist (the beat drops out) → 0 for the poll (end hit).
- `music_under_voice_db −11`, `duck_db 4`, `sfx_db −4`, `lufs −14`.

| visual event | SFX |
|---|---|
| card splat | `drop` + `stamp` (pitch 0.7) |
| card rip | `paper` + `swoosh` |
| document drop | `paper` + `thud` |
| slide / whip | `swoosh` |
| stamp | `stamp` |
| highlight / hand / scrawl | `scribble` |
| odometer | `tick` ×8 |
| line re-frame | `woosh_low` (gain 0.12) |
| hook | `impact` + `stamp` + `bubble` / `sparkle` |
| poll options | `click` |

## 9. Build recipe
1. Copy `assets/template/` (index.html, kit.js, scene.js, script.json, sound.json). `ENGINE/make.sh <project> --draft --workers 3` runs as-is, producing a 14 s demo.
2. Write the steps and the `FACTS.md` table first. In script.json give one line per document, `at` on bar starts for every step, and `cap` with `*red*` and `^n`.
3. Run TTS (`make.sh --draft`), then `python assets/fit_speed.py <project>`, then TTS again until every group starts on its bar.
4. In scene.js, compute times: `T[k] = X.line('sNa').start − 0.04`, `E[k] = T[k] + 1.25`. Then add `PT.stepCard` and `PT.stepTag(E+0.12, nextT, 'STEP n')`.
5. For each step, create a `scene(T, nextT)` group:
   - a hero `PT.doc` (+ 1–2 `PT.ghost`)
   - camera `set` under the card → `to` (travel)
   - a whip to a second document placed about 1000 px away
   - `PT.stamp` on the red word, `PT.hl` / `PT.hand` on the evidence
   - alternate white and parchment papers
6. Bookends: a dark plate in `PT.plate` (screen space, line-art `#bdb8ad`), then `PT.blot` + `PT.poll` + a wordmark (`PT.mark` is an original glyph; write your own brand).
7. `PT.captions(script,{dark:[[plate ranges]], end: blotTime})`, then `PT.bump` on each chunk outside cards and plates.
8. Run `render.mjs --stills` at every beat, then the full `make.sh <project> --skip-tts --workers 3`, then compare `out/qa/metrics.json` with §2.

## 10. QA checklist
- **Stills:**
  - hook plate (caption cream, red word)
  - each card at full red + numeral, and its rip frame (no STEP tag yet)
  - each document landing (key text clear of the STEP tag and above y 1575)
  - stamp spatter, odometer final value, chart head tag, ink blot, poll
- **Metric gates:** scene changes 16–20/min (card in and out only count separately with holds ≥ 1.25 s), motion ≥ 10, hold_frac ≤ 0.06, LUFS −14.
- **Red audit:** red only on judgement. One red caption word per line.
- **Facts audit:** every figure on screen or in the VO is in FACTS.md. Illustrative documents say "illustration" or "paraphrased" in a mono footer.
- **Do not:** use real logos or portraits, copy the source's lyrics (including its repeated lyric formula) or wordmark, or let captions exceed 2 lines (the kit splits at punctuation).
- **Engine and kit notes:**
  - The analyzer resizes 9:16 to 160×90 (motion and histograms), so its values are comparable only with other vertical sources.
  - Chromium shows seams at SVG `<pattern>` tile edges under camera scale, so the desk uses overlapping `<image>` tiles.
  - A canvas `filter: blur()` fades each `drawImage`'s own edges, so blur a 3×3 mosaic once for seamless tiles.
  - Kokoro hyphenated numbers ("twenty-eight") are one word token; caption mapping uses `^n`.
  - Whisper checks need numpy audio input (ffmpeg is not on PATH).

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/fit_speed.py · assets/template/
