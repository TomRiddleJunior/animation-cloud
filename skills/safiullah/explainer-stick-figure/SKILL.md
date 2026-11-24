---
name: explainer-stick-figure
description: "Makes a didactic stick-figure analogy explainer in the manner of \"Tea Consent\" (Blue Seat Studios) — black monoline marker drawings on pure white, held dead still and swapped whole in one frame on the narration beat, one red reserved for judgement (a circle-and-slash drawn over the wrong thing, single red verdict words, the line on a hand-drawn graph), grey only for steam and glints, and a fast deadpan narrator who walks one everyday analogy through a list of escalating cases before mapping it back onto the real topic. Use it for \"stick-figure explainer\", \"Tea Consent style\", \"simple hand-drawn analogy video\", \"explain X as if it were Y\", \"deadpan whiteboard-ish explainer\", \"doodle explainer with a red X\", a rule or habit (security, health, etiquette, safety) taught through an analogy, or any classroom-friendly piece where simplicity and humour carry the point. Builds on explainer-engine."
---
# Stick-figure analogy explainer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).
A deadpan analogy lecture: one British (or US) narrator reads a list of "if this, then that" cases very fast over
minimal ink drawings that never move — each drawing is swapped in complete on the stressed word and held through
a comic pause. The comedy is the gap between the flat read and the absurdly literal pictures; the teaching is the
case structure, the refrains (same words + same drawing), and an explicit mapping card at the end. Red ink is the
only thing that ever draws on, and it only ever means "judgement". Built from frame analysis of 1 source video
(references/sources.md) plus a per-frame change profile; the sample `samples/stick-figure` ("Passwords are keys",
66 s) was built with this kit. Original work only — find your own analogy and props; never reuse the tea, its gags
or its title lettering.

## 1. Signature traits
- **Pure white ground (#fbfbfb), black monoline marker (5 px @1080p, round caps, slight wobble, no boil)**, grey
  #bab6b6 only for steam/glints, red #e20a22 only for judgement. Nothing else: no fills, shading, texture or camera.
- **Held drawings swapped hard in ONE frame** on the first stressed word of the clause (84 % of frames are exact holds).
- **Red judgement marks draw on**: a loose circle (≈ 22 f, counter-clockwise from the top, overshoot tail) then a
  slash (≈ 4 f); red verdict words pop whole in 1 f; a red data line draws left→right on a hand-drawn graph.
- **Big-headed stick figures** (head ≈ 0.24 of height, dot eyes, line/solid mouths, hook hands, short feet) acting by
  pose swap; reaction **close-ups cropped by the frame edge**; **props drawn with more lines than people**.
- **Fat outlined bubble-capital title** (84 % of the width) + hand-lettered subtitle, held while sentence 1 states
  the whole analogy; ends on a hand-lettered **mapping card** and a bubble-letter **moral card**, then a tag joke
  over the opening prop.
- **Fast deadpan VO (≈ 190 WPM overall, ≈ 240 while speaking) with 0.6–1.1 s silences** after every absurd image;
  music only as a tiny button at the end (or none).

## 2. Target metrics
The QA tool's cut/scene metrics are blind to this style (black line drawing → black line drawing on the same white
never moves the colour histogram): they read **0** on the source and must read 0 on yours. Measure swaps with the
per-frame change profile instead: `python -I assets/framediff.py out/<name>.mp4 out/qa/fd 24 0.03` (full swaps =
events > 3 % of pixels) and `... 24 0.004` (all change events).

| metric | source (Tea Consent) | target | sample (66 s) |
|---|---|---|---|
| duration | 171 s | 50–200 s | 65.9 s |
| full drawing swaps / min (framediff > 3 %) | 15.1 (43) | 12–20 (≤ 22 under 70 s) | 21.9 (24) |
| gap between swaps median (p10 / p90) | 3.4 s (0.42 / 7.35) | 2.5–4 s | 2.48 s (0.70 / 4.44) |
| all change events / min (> 0.4 %) | 44.7 | 40–70 | ≈ 67 |
| exact-hold frames (framediff) | 83.5 % | 75–90 % | 83.3 % |
| `cuts_per_min` / `scene_changes_per_min` | 0.0 / 0.0 | 0 / 0 (blind spot) | 0.0 / 0.0 |
| `motion_mean` / `motion_p90` | 0.57 / 1.37 | < 1.5 / < 2 | 0.69 / 0.72 |
| `hold_frac` | 0.845 | 0.75–0.90 | 0.868 |
| `colourfulness` / `saturation` | 6.3 / 0.003 | 2–10 / < 0.01 | 3.5 / 0.002 |
| `brightness` | 0.971 | > 0.94 | 0.958 |
| `wpm_overall` | 191.2 | 175–200 | 187.6 |
| `silence_s` | 27.4 s (16 %) | 12–20 % of runtime | 11.4 s (17 %) |
| `loudness_lufs` | −21.7 | −16 to −22 | −18.8 |

Deliberate deviations: swaps/min sits just above 20 because a 66 s film still needs every case beat (the source
spends 171 s on six cases); hold two clauses on one drawing if you need to come down. Colourfulness is lower than
the source because the sample uses red on ~10 % of frames vs ~15 % there — add a red mark per case to raise it.

## 3. Script formula
Beat map (sample timings in brackets):

| % | beat | picture |
|---|---|---|
| 0–9 | **title + the whole analogy in sentence 1**, a dry aside ("That's it. That's the whole video." … "Well. Nearly.") | bubble title + subtitle, held |
| 9–20 | **case 1, the plain truth** ("You've got a house. The house has a lock. You've got a key. Lovely.") + a rapid list (one drawing per noun, 0.5 s each) | prop hero, delighted figure, list props |
| 20–24 | **refrain drawing** stated ("Very convenient. One key. Everything opens.") | the drawing you will reuse |
| 24–45 | **the complication, escalating** ("…loses its box of spare keys … They've got your car. And your office. And your house. And your bike. Which is, frankly, the least of your problems.") | one absurd literal drawing per item, comic pause after the last |
| 45–50 | **the verdict**: refrain drawing returns, red circle-and-slash ("Bit of a design flaw, the one key.") | T3 stamp |
| 50–60 | **the objection + reaction close-up**, then the mechanism ("But nobody wants my key, you say. I'm boring." → "They try them in every door.") | close-up + bubble, tally burst |
| 60–66 | **the trend** on a hand-drawn graph | T5 red line |
| 66–80 | **the rule** (red verdict word) → second objection → the fix | doors + "ONE EACH.", buried figure, key box + "NOWHERE ELSE." |
| 82–86 | **mapping card**: the real topic said for the first time ("It's exactly the same with passwords.") | hand-lettered line + bubble word |
| 86–91 | **moral card**, one line on screen | bubble letters + hand-lettered line |
| 91–100 | **tag joke over the opening prop** + one more red mark | prop hero reused, stamp + red word |

- Case template "If/when X, then Y"; order from obvious to absurd; keep the real topic out of everything except the
  title until the mapping card. Sentences short and clipped; one shouted line per minute ("But I can't carry eighty keys!").
- Kokoro **`bm_george` speed 1.36** (≈ 240 WPM while speaking). bm_george's speed is not linear: 1.16 → 188,
  1.30 → 210, 1.36 → 240, 1.40 → 247 WPM. `lead` 1.0, `tail` 2.3. Gaps: 0.05–0.2 inside a list, 0.5–0.8 after a
  punchline (tts adds ≈ 0.2 s of its own to every gap).

## 4. Visual system
| role | hex | use |
|---|---|---|
| ground | `#fbfbfb` | the whole frame, flat (no paper texture) |
| ink | `#1a1a1a` | every line, eye dots, solid mouths, mask band |
| grey | `#bab6b6` | steam, glints, bike spokes, secondary detail |
| red | `#e20a22` | ONLY circle-and-slash, verdict words, data line, the bad outcome ("click!") |

- **Line**: `K.LW = 5` px, round caps/joins, wobble `K.AMP = 1.3` px (two sine octaves + a slight bow, applied once at
  build time: drawings are identical frame to frame). Small details 3–4 px. Red marker 11–15 px, tapered.
- **Type**: title `K.title` = Fredoka 700 inflated (white fill, ≈ 9–10 px outline, letters overlap and wander,
  static displacement wobble) at ≈ 84 % width; subtitles/cards `K.scrawl` Patrick Hand caps 70–105 px with per-letter
  jitter; bubbles Caveat 46–60 px; red verdict words Caveat 700 caps 90–105 px; graph labels Caveat 46–48 px.
- **Composition**: one drawing idea per frame, centred or on a third, ink box 40–85 % of the height, huge negative
  space; full figures 600–700 px tall (feet ≈ y 900); close-ups use `h ≈ 2300` with the head at y ≈ 420 so the body
  runs off the bottom. Bubbles and red words sit in empty space beside the head.

## 5. Characters & objects
- `K.fig(parent, {x, y, h, pose, face, brows, look, flip, mask, arms, legs, armsAbs, legsAbs, neck, hip, lean})` —
  poses `stand cheer shrug hip point hold aloft raise up behind`; faces `smile line grin open o frown smirk worry`;
  brows `worried angry up`; `mask: true` adds a bandit eye-mask with knot tails (the one identity marker the sample
  needed — only add markers a case needs). Limb points are offsets in figure heights; `armsAbs/legsAbs` take stage
  points (riding a bike, feet on a desk). `fig.at` gives hands, head, hip for attaching props.
- Head = one loop with overshoot and white fill (occludes what is behind); eyes 3.6–9 px dots whatever the scale.
- Props (local coords, origin bottom-centre, `s` scale): `K.key` (bows round/square/clover, seeded teeth, split
  ring, tag text, `mark`), `K.lock` close-up, `K.door` (`open`), `K.house` (`.smoke`), `K.car` (`.win` for clipping a
  driver), `K.office`, `K.bike` (`.saddle .bars .pedal .pedalB`), `K.lockers`, `K.desk` (`.mug`), `K.sofa`
  (`.seat`), `K.keyBox`, `K.doorRow`, `K.graph` (axes, ticks, labels, end faces, returns `P(u,v)`), `K.bubble`.
- Build your own props with `K.ink / K.white / K.solid / K.grey` on path strings or point lists with `T:{x,y,s,r}` —
  give props 2–3× the line count of a figure (patterns, grooves, screws, vents).
- **Reuse = identical**: call `K.seed(n)` before a drawing you will show again (refrains, close-up + bubble pairs,
  the tag over the opening prop). `K.shot` seeds every shot from its name, so redraws never boil.

## 6. Motion grammar
| move | how | frames @24 |
|---|---|---|
| drawing swap (everything black) | `K.shot(id, K.at(X.word(...)), next)` — lands 1 f before the word | 1 |
| red circle | `K.stamp` circle, `power1.out`, constant-width taper | 22 |
| red slash | after a 3 f beat, `none` | 4 |
| red data line + arrowhead | `K.redLine`, `power1.inOut`, arrowhead 2 f after | 26–28 + 3 |
| red verdict word | `K.redWord` — appears whole | 1 |
| idle loop (steam, glints, a shrug, a spoon) | `K.cycle(frames, t0, t1, 4)` (on fours = 6 drawings/s; 6 for slow) | continuous |
| action burst (sparks, cutting) | `K.burst(frames, t0, 2)` then hold the last | 12–30 |
| tally fill (crosses under doors, ticks) | `K.burst(overlays, t0, 5)` over a static drawing | 15–20 |

Timing over easing: almost nothing tweens. Holds 0.5 s (list beats) to 4.5 s (refrain under a long sentence).
Loops only on holds > 2 s, and never on cards. Variant frames come from `K.variants(parent, n, draw, seed)` so only
the moving limb changes.

## 7. Transitions
| # | name | build | when |
|---|---|---|---|
| T1 | hard drawing swap | `K.shot` with the next shot's start as its end | every new idea |
| T2 | cut-in by redraw | same subject redrawn closer (full figure → `closeup` with `h 2300`) | reaction / "you say" beats |
| T3 | red judgement stamp | `K.stamp(g, cx, cy, rx, ry, t)` over a held drawing | the verdict on each case |
| T4 | red word pop | `K.redWord(g, 'ONE EACH.', x, y, t)` | the rule, the bad outcome |
| T5 | graph draw-on | `K.graph` swaps in; `K.redLine(g, pts, t)` while the trend is said | one per film |
| T6 | action burst | `K.burst(frames, t, 2)` | the gag that needs motion |
| T7 | idle loop | `K.cycle(K.steam(...)/K.glints(...)/K.variants(...), t0, t1, 4)` | long holds |
| T8 | card | `K.title` / `K.scrawl` on white, swapped hard, held 2–5 s | title, mapping, moral |
Never: camera moves, zooms, pans, fades, wipes, slides, black lines drawing on.

## 8. Sound
- `sound.json`: `{"preset": "playful-bounce", "bpm": 100, "sections": [{"t": 0, "energy": 0}, {"t": <tag start − 1>,
  "energy": 1}], "music_under_voice_db": -32, "duck_db": 0, "sfx_db": -6, "lufs": -19, "end_hit": true, "reverb": 0.15}`
  → silence under the whole lesson (the pauses must be truly quiet), a pizzicato button under the tag + end chord.
  Note: sound.py measures the music gain over ALL speech, so a bed that plays under only one line comes out ≈ 10 dB
  hotter than `music_under_voice_db` — −32 lands it ≈ 20 dB under the voice.
- SFX (sparse, ≈ 1 per 3 s, all at low gain): `click` when a key goes into a lock / a box opens, `scribble` under every
  red draw (added automatically by `K.stamp`, `K.redLine`, `K.redWord`), `tick` per tally mark, a bell `ding` for
  the bike, `scribble` 0.8 s for grinding. **Never** a whoosh — nothing moves.
- VO: deadpan and fast; let the drawing land on the noun, then a beat of silence.

## 9. Build recipe
1. `cp -r assets/template <project>`; write the beat sheet (§3) and `script.json` (one line per clause group, ids
   you can name in `X.word`). Run `ENGINE/make.sh <project> --draft --workers 3` once to get `data/vo.json`.
2. In `scene.js`, `add(id, W(line, word), draw)` one shot per drawing; the list becomes hard swaps automatically.
   Typical calls per beat: title `K.title + K.scrawl`; prop hero `K.key/your prop + K.cycle(K.glints|K.steam)`;
   case figures `K.fig` + props; refrain = a function with `K.seed(n)` reused twice; verdict `K.stamp`;
   close-up `K.fig({h: 2300})` + `K.bubble`; mechanism burst `K.burst`; graph `K.graph + K.redLine`; rule
   `K.redWord`; mapping `K.scrawl + K.title`; moral `K.title + K.scrawl`; tag = prop hero again + `K.stamp/K.redWord`.
3. `node ENGINE/render.mjs <project> --stills t1,t2,...` at every beat; tile and LOOK (line weight, one idea per
   frame, red only on judgement, nothing clipped).
4. `ENGINE/make.sh <project> --skip-tts --fps 24 --workers 3`, then framediff (§2) and `out/qa/timeline.jpg`
   next to the source's timeline.

## 10. QA checklist
- `cuts_per_min` = 0 and `scene_changes_per_min` = 0 (if not, something faded, slid or moved).
- framediff: full swaps 12–20/min, event length median 1 f, exact holds 75–90 %; no 1-frame "boil" events on
  holds (a reused drawing redrawn with different seeds shows up as an extra event — fix with `K.seed`).
- Stills: every shot has ONE idea; figures 55–80 % of the frame height or cropped close-ups; text ≥ 36 px;
  margins ≥ 96 px except deliberate edge crops; red appears only on judgement frames.
- Audio: `silence_s` ≥ 12 % of runtime, no music under the lesson, LUFS −16…−22, WPM 175–200.
- Do: state the analogy in sentence 1; refrains reuse the same drawing; pause after each absurd image; say the real
  topic only on the mapping card; end on a one-line moral and a tag. Don't: subtitle the narration, add colour
  fills, line boil, camera moves or whooshes, put two drawing ideas on screen, or copy the source's tea, lines or lettering.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/framediff.py · assets/template/
