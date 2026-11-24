---
name: explainer-vox
description: "Vox-style documentary explainer (\"annotated evidence\" journalism) — reported narration over evidence laid on one flat slate ground and annotated on camera: hand-drawn yellow ellipses, tilted orange name tags with sage sub-tags, highlighter sweeps on documents and clippings, scale-chase charts whose axis rescales as the line draws, paper cut-out maps and timelines, creeping pushes on every still, sparse colour, own logo sting at ~20 %, yellow-rule credits. Use when someone asks for a Vox-like / Johnny-Harris-like / \"Vox explainer\" / news-explainer / policy or history explainer / data-journalism video, an annotated-photo or document-highlight sequence, or a 1–10 min reported explainer built in code. Builds on explainer-engine."
---
# Vox — annotated-evidence explainer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A Vox explainer is reported journalism dressed as a scrapbook: evidence (photos, clippings, documents, maps, charts) sits
on one flat designed ground and is **annotated on camera** while a journalist's voice carries the argument at ~160 WPM.
Colour is rationed to one accent plus one secondary, every still creeps forward at ~0.28 % scale per second, and graphic
sequences build inside long continuous shots. Built from frame analysis of 2 source videos (references/sources.md) —
the grammar is constant, the palette/type kit changes per episode. **Original work only**: your own topic, your own
evidence (built in code — never scraped photos or real news footage), your own wordmark (never the Vox bug or sting).

## 1. Signature traits
- **Evidence + annotation**: a "photo" or document, then a yellow hand-drawn ellipse (380°+, ends overlap), a tilted
  (−4°) orange tag naming it, a smaller sage sub-tag ~2 s later with the fact. Each lands within ±0.3 s of its word.
- **Creeping push on everything** (0.25–0.30 % scale/s, linear) — no still is ever frozen; holds stay "alive".
- **Scale-chase chart**: the line draws over ~2.7 s while the y-axis rescales under it; source line on every chart.
- **Document focus**: clipping/scan with −0.6° tilt, slow push + pan, yellow highlighter sweeping the spoken phrase.
- **One flat ground** (slate `#2B3340` in kit A, black + grid in kit B) carrying paper plates with soft cast shadows.
- **Sparse colour**: ~2–3 % saturated pixels median; orange = names/primary data, sage = secondary facts.
- **Structure**: concrete subject in 0–3 s → named by 5 s → paradox → logo sting at 17–25 % → mechanism in long
  graphic shots → policy/so-what → one-line kicker → credits on dark grey with a yellow rule. No spoken CTA.

## 2. Target metrics
Sources: t6V9i8fFADI (taxes, kit A) and BB3qNWRaxGE (guns, kit B). QA: `out/qa/metrics.json`.

| metric | source range | target | sample (74 s) |
|---|---|---|---|
| scene_changes_per_min | 4.91–7.10 | 5–7 | **6.45** |
| scene_len_median s | 5.09–7.17 | 5–7 | 5.83 |
| cuts_per_min | 4.42–9.11 | 5–8 | 6.45 |
| shot_len_median s (p10/p90) | 3.1–7.9 (0.6–1.1 / 15–26) | 3–8 | 3.87 (0.63 / 22.4) |
| cuts_first_15s | 5–7 | 5–7 | 5 |
| motion_mean / p90 | 3.41–5.25 / 7.4–10.5 | 3.5–5.3 / ≤11 | 5.25 / 13.6 |
| hold_frac | 0.30–0.54 | 0.35–0.50 | 0.436 |
| colourfulness / saturation | 31.6–33.0 / 0.16–0.30 | ≥28 / 0.2–0.3 | 26.7 / 0.275 |
| brightness (dark-frame frac) | 0.39–0.43 (0.37–0.41) | ≤0.45 | 0.457 (0.24) |
| WPM overall (in-span) | 154–155 (161–164) | 150–155 | 150.7 (~163) |
| LUFS integrated | −16.5 to −17.8 | −17 | −17.0 |

**Deliberate deviations (sample):** no interviews or real colour photos (Vox gets ~25 % of its colour from them), so
colourfulness sits ~5 under and paper documents push brightness slightly up; motion p90 is high because a 74 s film
spends a bigger share in the hook montage and pull-backs; credits are 3.5 s (proportional) instead of 17–20 s;
the music bed never drops to silence. Don't invent interviewees to close the gap — use documents and evidence plates.

## 3. Script formula
Beat map (% of runtime) — sample times in brackets:

| % | beat | sample "The day of two noons" |
|---|---|---|
| 0–3 | concrete subject on screen, music under; 3–4 photo cuts 0.6 s apart | locomotive, pocket watch, station clocks, clock tower [0–1.9 s] |
| 3–7 | **name it**: ellipse + tag + sub-tag | "New York City" / "Nov. 18, 1883" [3–5 s] |
| 7–20 | the surprising fact / paradox, a clipping as proof | clocks set back 4 minutes, noon struck twice; "TWO NOONS TOMORROW" [6–15 s] |
| ~20 | **logo sting** (own wordmark), then the mechanism | sting at 15.7 s, covers into the slate |
| 20–55 | mechanism in 2–3 long graphic shots; spoken bridge "And because…", "But for…" | sun card → scale-chase chart → station with one clock per railroad |
| 55–80 | the fix / turn: map, pull-back reveal | four zones → pull back to Greenwich → back in, "+1 hour" |
| 80–92 | policy / so-what on a timeline spine | 1884 conference → 1918 Standard Time Act, "35 years" bracket |
| 92–96 | kicker that trails off (pause before it) | "The hour on your phone … started with a train schedule." |
| 96–100 | credits card, music tail | yellow rule, right-aligned names |

- **Sentences**: short, declarative, concrete numbers ("four minutes", "25 nations", "1918"). One idea per line.
- **Hook pattern**: date/place + "did something strange" → the specific oddity → its name → "and the reason was…".
- **Hand-overs**: "And because…", "But for…", "So…", "A year later…" — no chapter cards, no on-screen sentences.
- **Facts**: only what you are certain of; compute numbers you can (longitude → minutes) and cite the method as the
  chart source. Invented mastheads/companies are fine for props; never put words in a real person's mouth.
- **Voice**: Kokoro `af_heart` (or `am_michael`), `speed 1.1`, `lead 0.5`, gaps 0.3–0.45 s, **1.1 s** before the
  post-sting line, **0.8 s** before the kicker. 187 words ≈ 70 s of VO at 150 WPM overall; budget ~150 × minutes words.
  Check pronunciation with Whisper (`soundfile` → numpy → `whisper.transcribe`, ffmpeg is not on PATH).

## 4. Visual system
**Kit A (default here) — slate + orange** (`VK.C`):

| role | hex | use |
|---|---|---|
| ground | `#2B3340` (alt `#242D38`) | every graphic set; the sting covers to it |
| paper plates | `#C7D8D8` cool, `#E8E9E8` neutral, `#ECE6D8`/`#EEE3CD` warm newsprint | cards, maps, clippings, timetables |
| accent | `#E5893C` (deep `#C6662A`) | name tags, chart line + area (35–45 %), markers, die-cut outlines |
| secondary | sage `#5E817F` | sub-tags, value chips, secondary markers |
| annotation | ellipse/arrow `#D6DE24`, highlighter `#ECF91F` (multiply on paper) | the only hand-drawn marks |
| neutral | `#A2A4A6` | axes, ticks, gridlines at 25 % |
| text | `#F5F5F3` on slate, `#23272D` ink on paper | |

Kit B swap (black `#020101` + 1 px grid, magenta `#C1227B`, typed monospace labels via `VK.typed`) — change `VK.C`
and the label calls; keep the grammar. Never more than two accent hues on screen.

**Type** (engine fonts): tags/labels/chart titles **Inter 800** (tags 46–58 px, sub-tags 34–44 px, chart title 40,
source 24 italic, ticks 26); documents **Playfair Display 900** mastheads, **Oswald 700** headlines, **Libre
Baskerville** body/italic decks; typed kit-B labels **Roboto Mono 700**. Text on screen = labels of 1–5 words, numbers,
titles, sources — plus document text, which is evidence.

**Shapes & line**: rectangles = labels/chips; circles = medallions, markers, clock faces; annotations 7–10 px round-cap
strokes; chart line 5 px; die-cut outlines 13 px. Flat fills only, soft drop shadows (`vkShadow*`), paper grain
(`url(#vkPaper)` multiplied). Photos may have gradients/grain — they are "photographs".

**Composition**: one subject, centred or left third; tags lower-left of the subject; charts ~70 % width with title
top-left; own small wordmark top-right (`VK.bug`); safe margin ≥96 px; check that pushes never expose plate edges.

## 5. Characters & objects
No drawn characters — people appear only inside evidence (silhouettes in photo plates via `EV.person`), never animated.

- **Photo stand-ins** (`assets/evidence.js` + `VK.photo`): write the scene as layered SVG (gradient sky, blurred
  far layers for depth of field, grime via `feTurbulence`, system fonts only), then `await VK.photo(svg, {mode})`:
  `'photo'` (colour, split-tone grade, grain, vignette, `exposure`), `'mono'` (greyscale/duotone `tint`), `'halftone'`
  (newsprint AM dots, `pitch` 6–7). Examples: `EV.tower()` (clock tower + anchor `clock`), `EV.face()`, `EV.watch()`,
  `EV.loco()` (halftone), `EV.station()` (three clocks, anchors `clocks[]`), `EV.portico()` (medallion photo),
  `EV.dial()/EV.hands()` for any clock. Render once in boot; cost ~0.3 s each.
- **Live parts over photos**: vector overlays (clock hands etc.) with `filter: url(#vkSoft)` and a soft shadow so they
  sit in the photo (see `liveHands` in the sample).
- **Paper props**: `VK.plate({shape:'rect'|'oval'|'torn'})` → `.body` for content; clippings and timetables are built as
  SVG text inside a torn plate (invented masthead/company, your own words, `filter:url(#vkInk)`).
- **Medallion**: `VK.medallion(parent, img, {cx,cy,r,label})` — greyscale photo in an accent ring, label on an arc.
- **Die-cut sticker**: `VK.dieCut(parent, href|null, pathD, {width:13})` — e.g. a phone cut-out with orange outline.
- **Maps**: lon/lat polygons → `px()/py()` equirectangular (`cos 38°`), land as paper with shadow; zones as clipped
  bands with wobbly boundaries; tints must stay inside the QA colour bins (all channels ≥192), e.g. `#C4DCE0` / `#F0D9C0`.
- **Timeline spine**: `VK.axis` (90 px/year), event markers (orange/sage circles), stalks, chips, a pinned evidence card.

## 6. Motion grammar (30 fps)

| element | duration | ease | kit call |
|---|---|---|---|
| creeping push on any hold | whole shot | none (0.0026–0.003 scale/s) | `cam.cut(t,{s,cx,cy},{rate})` |
| ellipse draw-on (starts 0.2 s before the noun) | 11 f (0.36 s) | power1.out | `VK.ellipse` |
| tag wipe-on (box+text together) | 7 f (0.22 s) | power2.out | `VK.tag` |
| sub-tag | +1.5–2 s after the tag | power2.out | `VK.subTag` |
| highlighter sweep | 15–18 f | power1.inOut | `VK.highlight` |
| arrow (shaft, then head) | 0.45–0.6 s | power1.inOut | `VK.arrow` |
| chip / marker pop | 7 f | back.out(1.6) | `VK.chip`, `X.pop` |
| medallion / document pop | 9 f | back.out(1.4) | `X.pop` |
| scale-chase chart | 81 f (2.7 s) | power1.inOut | `VK.chart` |
| motivated push to a detail | 33–35 f | power2.inOut | `cam.move(t,1.1,{s:1.3,cy})` |
| pull-back reveal | 33–45 f | power2/sine.inOut | `cam.move(t,1.1–1.5,{s:0.5})` |
| truck into a new set (same world) | 78 f (2.6 s) | **none** (linear) | `cam.hold` + `cam.move(…,'none')` |
| timeline truck while holding | continuous | none, dx 8 world px/s | `cam.push(t,{rate,dx})` |

Build order = sentence order (object → label → value → comparison). Final state holds 2–6 s under the push. No idle
wiggle, no bounce loops, no particles; graphics only appear, stack, slide and get labelled.

## 7. Transitions
| name | build | frames | when |
|---|---|---|---|
| hard cut | new `X.scene` (+ `click` sfx 0.12) | 0 | photo→photo, graphic→photo, hook montage every 18–38 f |
| creeping push | `cam.cut(...,{rate:0.0027})` | — | every photo and every hold |
| motivated push | `cam.move(t,1.1,{s,cx,cy},'power2.inOut')` | 33 | to the detail the VO names |
| pull-back reveal | `cam.move` to s≈0.5 | 33–45 | object → the field it belongs to (US → Greenwich, phone → timetable) |
| document focus | torn plate, camera `r:-0.6`, push 0.3 %/s + pan 30 px/s, `VK.highlight` | 3–5 s | clippings, scans |
| logo sting | `VK.sting(t,1.15,'yourmark',{cover:true})` — dims to the ground, wordmark wipes on behind an accent block; start the next slate scene 0.3 s in, under the cover | 35 | once, at 17–25 % |
| cross-dissolve photo→slate | next scene's inner group `VK.fadeIn(g,t,0.5)` | 15 | section starts |
| truck into a new set | content placed lower in the same camera world; `cam.hold(t,{rate:0})`, linear `cam.move` 2.6 s, then `VK.fadeOut` the old set off-screen | 78 | chart after diagram, timeline after map |
| typed label (kit B) | `VK.typed(parent,t,text,{cps:16})` | ~16 cps | lower thirds, captions on timelines |
| credits | `VK.credits(g, rows)` | hold | end |

## 8. Sound
`sound.json`: `{"preset":"doc-pulse","sections":[{"t":0,"energy":2},{"t":<sting>,"energy":3},{"t":<sting+1.4>,"energy":1},
{"t":<mechanism>,"energy":2},…,{"t":<kicker>,"energy":1}],"music_under_voice_db":-19,"music_alone_db":-9,"sfx_db":-4,
"lufs":-17,"end_hit":false}` — piano + ticking pulse, rising for the cold open, a hit on the sting, ducked under VO.

| visual event | sfx (gain) |
|---|---|
| photo cut | `click` 0.12–0.14 |
| ellipse | `scribble` 0.12–0.16 (in `VK.ellipse`) |
| tag wipe | `click` 0.2 pitch 1.25 (in `VK.tag`) |
| highlighter / arrow | `swoosh` 0.1–0.15 |
| chip / marker / chart point | `pop` / `blip` 0.1–0.2 |
| document / act appears | `stamp` 0.3; clipping cut `paper` 0.3 |
| camera moves | `woosh_low` (slow), `whoosh` (truck), `zoom_out` / `zoom_in` (pull-back / return) |
| clock hands moving | `tick` every 0.16 s, `chime` when they arrive |
| sting | `whoosh` + `thud` (in `VK.sting`) |

VO: one calm, brisk journalist read; no music stops except the brief silence before the kicker line.

## 9. Build recipe
1. `cp -r assets/template <project>` (it already holds `kit.js` + `evidence.js`; refresh them from `assets/` if edited).
2. Write `script.json` to the beat map (~150 words/min, `speed 1.1`); run
   `"$HOME/.generative-music-video/venv/Scripts/python.exe" ENGINE/audio/tts.py <project>` and read `data/vo.json`
   word times. Adjust words/gaps until VO end + 3.5 s credits ≈ target length.
3. In `scene.js`: `VK.init(X)`; render evidence plates (`await VK.photo(EV.x().svg, {...})`); derive every cut time from
   `X.line()/X.word()`; one `X.scene` per set, each with its own `VK.camera(g).cut(t0, …)`.
4. Per beat: hook montage (3–4 photo scenes) → annotated still (`VK.ellipse`, `VK.tag`, `VK.subTag`) → clipping
   (`VK.plate` torn + text + `VK.highlight`) → `VK.sting(..., {cover:true})` → slate world (card → linear truck →
   `VK.chart`) → photo with `cam.move` push and per-object ellipses/tags → map (`poly()` land, zone bands, `miniClock`
   legend, pull-back + `VK.arrow`) → `cam.hold` + truck to a `VK.axis` timeline (chips, `VK.medallion`, `VK.bracket`)
   → kicker object (`VK.dieCut`) with pull-back reveal → `VK.credits`. `VK.bug` across everything but credits.
5. `bash ENGINE/make.sh <project> --draft --skip-tts --workers 3`, stills at every beat
   (`node ENGINE/render.mjs <project> --stills 3,8,14,…`) — look at them.
6. Full render `bash ENGINE/make.sh <project> --skip-tts --workers 3`; compare `out/qa/metrics.json` with §2 and
   `timeline.jpg` / `strips.jpg` with the source sheets; iterate on the weakest shots.

## 10. QA checklist
- **Stills**: 0.0 s (first frame not blank), each tag landing, each chart end state, pull-back end states, credits.
- **Frame 0**: a scene that starts at t=0 is hidden by its `tl.set` until the first *change* — add
  `gsap.set(sceneGroup,{autoAlpha:1})` for every scene starting at 0 (engine quirk).
- **No dot before a draw-on**: use `VK.drawOn` (the engine's `X.drawOn` leaves a round-cap dot at the path start).
- **Edges**: for photo plates, `cx ± 960/s` and `cy ± 540/s` must stay inside the plate at the cut (push only grows s).
- **Scene changes** are colour-histogram jumps (4 levels/channel) between frames 1 s apart: dims that push paper below
  192, tints that leave the bin, fast pans off a big paper card, duotone backdrops sliding by — all count. Prefer
  in-bin tints, covering stings, linear trucks ≥2.4 s, and no dimming of whole documents.
- **Metric gates**: scene changes 5–7/min, cuts 5–8/min, hold 0.35–0.5, motion_mean ≤5.3, LUFS −17 ±1, WPM 150–155.
- **Do**: name within 5 s; annotate on the stressed word ±0.3 s; source line on every chart; long graphic shots
  (8–25 s) built in place; one accent + one secondary; own wordmark; documents in your own words.
- **Don't**: chapter cards, sentences on screen, gradients/glows on graphics, idle wiggle, a frozen still, more than two
  accents, a real channel's bug/sting/lower thirds, scraped photos or footage, fabricated quotes or interviewees.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/evidence.js · assets/template/

## Later evidence
Added after the skill was written (read when extending the style):
- `references/channel-extras-addendum.md` — 2026 Vox film (~52 % talking heads, logo sting at 12.7 %); Johnny Harris confirmation
