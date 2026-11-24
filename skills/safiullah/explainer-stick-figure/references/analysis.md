# Stick-figure analogy explainer: ink on white, held drawings swapped on the beat, one red accent

Analysed 2026-10-27. Source: "Tea Consent" (Blue Seat Studios, 2015, `oQbei5JGiT8`), picked in the Reddit thread
as an all-time favourite didactic explainer and praised for its simplicity, humour, structure and teaching
principles. The poster says they show it to students. Inputs: `frames/oQbei5JGiT8/` (metrics, timeline, opening,
strips, ending, transcript); frame-exact strips at 2-frame steps (`scratch_reddit/tea_a.jpg`, `tea_b.jpg`); a
per-frame change profile (`tea_fd`, `tea_events.txt`), needed because both cut metrics read zero on this film;
ink-coverage and stroke-width measurements on decoded frames. Audio was never heard.

**Note on scope.** One video defines this style. Its numbers are exact for that film; the target ranges below
widen them by judgement and say so. The content (sexual consent) is the source's subject; the style itself is
topic-neutral. It suits any rule or behaviour explained through an everyday analogy.

---

## 1. Identity

A 2–3 minute **analogy lecture** read fast and deadpan by a single British narrator over **minimal hand-drawn
black-ink stick figures and props on pure white**. Each drawing is **held completely still** (84 % of frames are
pixel-identical to the previous one) and **swapped in whole, in one frame, on the narration beat**. There are no
camera moves, fades or slides. The only colour is **one red ink** reserved for judgement: a circle-and-slash
drawn over a forbidden act, single words such as "SAFE", "NOW" and "NO TEA", and the line on a hand-drawn graph.
Comedy comes from the gap between the deadpan read and the absurd literal pictures (someone pouring tea down an
unconscious person's throat). The script is a **list of cases, each a rule**, escalating in absurdity, with
refrains, and it ends by **mapping the analogy back onto the real topic** in two hand-lettered cards.

## 2. Sources analysed

| id | title (uploader, year) | dur s | fps | cuts/min | median shot s | scenes/min | motion mean / p90 | hold | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|---|
| oQbei5JGiT8 | Tea Consent (Blue Seat Studios, 2015) | 170.7 | 24 | **0.0** | 170.7 | **0.0** | **0.57 / 1.37** | **0.845** | **6.3** | **191.2** | −21.7 |

| frame-change profile (`framediff.py`, 320 px greyscale, 24 fps) | value |
|---|---|
| exact-hold frames | **83.5 %** (86.8 % below 0.05 % pixel change) |
| full drawing swaps (> 3 % of pixels change in one frame) | **43 = 15.1/min**; gap between swaps median **3.4 s** (p10 0.42 s, p90 7.35 s) |
| all change events (> 0.4 % pixels) | 127 = 44.7/min; 125 of them last 1–2 frames (instant swaps) |
| cadence inside the small loops | a change every 4 frames (= 6 drawings/s, "on fours") for hand waves and steam; on twos for short actions |
| ink coverage | 1–4 % of pixels per frame |
| other metrics | brightness 0.971, saturation 0.003, silence **27.4 s (16 %)**, 5 YouTube chapters |

**Why the metrics read zero:** a cut is detected from the frame-to-frame scene score, and a scene change from a
colour histogram. A black line drawing replaced by another black line drawing on the same white ground moves
neither. Count single-frame changes above 3 % of pixels instead.

## 3. Measured pacing

| quantity | Tea Consent | target for the style | practice |
|---|---|---|---|
| duration | 171 s | 90–200 s | long enough for 4–7 cases, short enough to share |
| drawing swaps | 15/min, median 3.4 s | 12–20/min | a new drawing per clause; reuse drawings for refrains |
| motion | 0.57 mean | < 1.5 | the drawing holds; only tiny loops (steam, a wave) move |
| exact holds | 84 % | 75–90 % | stillness is the joke's straight face |
| speech | **191 WPM** while silences total 16 % | 175–200 WPM, with 0.5–1.5 s comic pauses | fast, clipped, deadpan sentences, then a held beat after each absurd image |
| colour | 6.3 colourfulness | < 10 | red on < 1 % of pixels overall, ≈ 3 % on the frames that use it |
| loudness | −21.7 LUFS | −16 to −20 | voice-first; music is light or absent |

## 4. Script & narrative structure

**Beat map (170.7 s)**

| s | % | beat | picture |
|---|---|---|---|
| 0–5.3 | 0–3 | **title + the whole analogy in sentence 1** ("imagine instead of X, you're making them a cup of tea") | an outlined bubble-letter title (84 % of the width) with a hand-lettered subtitle, held 5.3 s |
| 5–15 | 3–9 | case 1: an enthusiastic yes → then you know | a teacup on a saucer with grey steam; an ecstatic figure with arms out and an open black mouth |
| 15–38 | 9–22 | case 2: unsure → you may make it, but **don't make them drink it**; making it does not entitle you to watch | a "hmmm…" bubble figure; a figure and a side table with "meh."; a **red circle-and-slash drawn over** two figures (33.1–34.3 s) |
| 38–49 | 22–29 | case 3: "no thank you" → don't make it, don't be annoyed | a close-up head with a raised hand; a red slash over the cup; a forced-drinking action burst |
| 49–77 | 29–45 | case 4: said yes, then changed their mind | a happy close-up "mmm tea!"; a kettle; milk pouring (on twos); **a graph "interest in tea" vs "time" whose red line draws on** (75.0–76.3 s) |
| 77–126 | 45–74 | case 5: unconscious → don't make them tea; make sure they're safe; escalation (said yes earlier, then passed out mid-cup) | a figure lying down; a red "SAFE"; a "Do you want tea?!?" bubble to a limp figure; pouring down a throat; red "NOW" / "NO TEA" |
| 126–146 | 74–86 | case 6: past consent ≠ ongoing consent ("you wanted tea last week") | a calendar filling with tick marks; a figure at a door with a shouted bubble; a bed scene |
| 146–160 | 86–94 | **the mapping**: if you understand how ludicrous forced tea is, how hard is it with the real topic? | a hand-lettered card ("IT'S THE SAME WITH…"), then the bubble title variant ("… IS EVERYTHING.") |
| 160–171 | 94–100 | tag joke + credits | the teacup again; handwritten credits (script, video, narrator, animation) |

**Hook (first 15 s):** no music and no logo. The analogy is stated before anything else, and the title card holds
while it is said. By 15 s the viewer has seen the first full case resolve.

**Structural devices**
- **Case template:** "If they say/are X, then Y." Six cases, ordered from obvious to absurd.
- **Refrains:** key rules return 3–4 times verbatim ("don't make them drink it", "unconscious people don't want
  tea"), each time with the **same drawing reused**, so a visual refrain matches the verbal one.
- **Escalation:** the pictures get more literal and more ridiculous while the read stays flat.
- **Mapping:** the last 10 % says the real topic out loud for the first time, on a card, then gives the one-line
  moral.
- **Tag:** a throwaway self-referential line after the moral, over the opening prop.

## 5. Visual system

### Palette
| role | hex | share |
|---|---|---|
| ground | #fbfbfb (pure white paper, no texture) | 94 % |
| ink | #1a1a1a | 1–4 % |
| secondary grey (steam, liquid, minor props) | #bab6b6 | ≈ 1 % |
| judgement red | ≈ #e20a22 sampled at full saturation (the k-means mix with white reads #a04e50) | < 1 % overall, ≈ 3 % on red frames |

Only these four colours appear. Red is never used for decoration, only for marks of judgement and data lines.

### Line work (1080p)
- One monoline marker for everything: **≈ 4–6 px** wide (≈ 3–4 px at 720p, from a distance-transform measurement),
  round caps, slightly wobbly hand-drawn paths, no tapering. There is no line boil: held drawings are identical
  frame to frame.
- Solid black fills only for open mouths (and eye dots). Title bubble letters use a heavier ≈ 8 px outline.
- The red marker is the same width; circles are drawn in one loose stroke with an overshoot tail, and the slash
  overshoots the circle.

### Figures and props
- **Stick figure:** a near-circular head drawn as one loop (diameter ≈ 0.22–0.30 of the figure's height: a big
  head); a single-line spine; arms and legs as single lines with tiny hook hands and short foot lines. The face is
  two dot eyes, plus a line mouth or a solid open mouth (joy, shock), occasionally brows. No hair, clothes or
  gender markers by default.
- **Scale:** a full figure fills 60–80 % of the frame height; reaction close-ups crop to head and shoulders (the
  head ≈ 40–45 % of the frame height, extending off the bottom edge).
- **Props carry detail:** the teacup has a wavy rim, polka dots, a saucer ellipse and grey steam wisps; there is a
  kettle with a black handle, a milk jug, a calendar grid, a door with trees, a bed in perspective. Props are drawn
  with more lines than people. That is where the eye rests.
- **Graph:** hand-drawn axes with tick marks, tiny handwritten axis labels, smiley and frowny faces as end labels,
  and a red curve with an arrowhead.

### Composition
One drawing per frame, centred or on a third. The ink bounding box spans 37–87 % of the height, so there is huge
negative space. Speech/thought bubbles are hand-drawn ellipses with tails in the space next to the head. Red words
sit in empty space to the right of the figure.

### Typography
| use | look | free look-alike | size at 1080p |
|---|---|---|---|
| title | fat outlined hand-drawn bubble capitals, slightly irregular baselines | hand-trace a heavy rounded font as outlines (e.g. Fredoka 700 converted to a stroke-only outline, then wobble it) | ≈ 380 px cap height; 84 % of the width |
| subtitle and cards | hand-lettered caps, uneven | Patrick Hand / Caveat Bold | 50–90 px; the mapping keyword ≈ 200 px in outlined caps |
| bubbles | handwritten lowercase ("hmmm…", "meh.", "mmm tea!") | Caveat | 36–48 px |
| red judgement words | quick capitals ("SAFE", "NOW", "NO TEA") | Permanent Marker or Caveat Bold in red | 60–90 px |
| credits | handwritten lowercase lines | Caveat | ≈ 36 px |

## 6. Characters & objects

- **Acting by pose swap.** Every emotion is a new drawing, with no in-betweens: arms out = delight, hand on hip =
  unsure, hand raised = refusal, lying flat = unconscious.
- **Limited animation bursts** happen only when the joke needs motion: forced drinking (≈ 8 drawings over 0.75 s,
  on twos/threes, with splash drops), milk pouring (on twos for ≈ 1 s with the steam alternating), a calendar
  filling with ticks. They last 0.5–1.5 s and then hold.
- **Loops on fours** (6 drawings/s) keep a held figure barely alive when the hold is long: a waving hand, steam.
- **Red marks draw on:** the circle-and-slash takes ≈ 22 f for the circle (one stroke, counter-clockwise from the
  top) and ≈ 3 f for the slash; the graph's red curve draws in ≈ 26 f and gets its arrowhead at the end. Black
  drawings never draw on: they swap in complete.

## 7. Camera & transitions catalogue

| # | transition | build | duration @24 | frequency |
|---|---|---|---|---|
| T1 | **Hard drawing swap** | the next drawing replaces the current one completely in a single frame, with no motion before or after | 1 f | all 43 full swaps; the remaining change events are loops, bursts and red draws |
| T2 | **Cut-in by redraw** | the same subject redrawn at a closer crop (full figure → head close-up) and swapped hard; it reads as a camera cut-in, but it is a new drawing | 1 f | ≈ 8× |
| T3 | **Red judgement stamp** | over a held drawing, a red circle draws in one stroke (≈ 22 f, ease-out), then the slash (≈ 3 f) | ≈ 25 f | ≈ 6× |
| T4 | **Red word pop** | a red word appears whole beside the held figure in 1 f | 1 f | ≈ 4× |
| T5 | **Graph draw-on** | axes are already there; the red curve draws left to right (≈ 26 f), then the arrowhead appears | ≈ 28 f | 1× |
| T6 | **Action burst** | 6–10 drawings on twos or threes, then a hold on the last pose | 12–30 f | ≈ 5× |
| T7 | **Idle loop on fours** | 2–3 drawings alternating every 4 f (a wave, steam) while a figure holds | continuous | in long holds |
| T8 | **Card** | a hand-lettered text card on white, swapped hard and held 2–5 s | 1 f in | title, mapping, moral |

There are **no** camera moves, zooms, pans, fades, wipes or slides anywhere.

## 8. Motion grammar

- **Timing over easing.** Almost nothing tweens. Change is instantaneous, so the craft is *when*, not *how*.
- **Swap placement:** a new drawing lands on the first stressed word of the clause it illustrates (or 1–2 frames
  before it). A punchline drawing lands on the punchline word and then **holds through a silence of 0.5–1.5 s**
  (the film is silent for 16 % of its runtime).
- **Hold lengths:** 0.4 s for rapid list beats, 3–4 s typical, up to 7–8 s for a refrain under a long sentence.
- **Red draws are the only eased motion:** ease-out strokes at constant marker speed (≈ 1,500 px/s at 1080p).
- **Reuse:** the same drawing returns for the same rule. Viewers learn the visual vocabulary within a minute.

## 9. Sound (inferred)

- **VO:** a single male British narrator, very fast (191 WPM overall, even with 16 % silence, so ≈ 225 WPM while
  speaking), deadpan, with sudden exasperated emphasis on capitals in the script ("LOVE", "BUT YOU WANTED TEA
  LAST WEEK") and dry asides. Pick Kokoro `bm_george` or `bm_lewis` at speed 1.15–1.2.
- **Music:** none or a barely-there ukulele/pizzicato bed (*inferred* from the long silences and −21.7 LUFS); the
  pauses must stay truly quiet for the jokes to land.
- **SFX:** sparse (*inferred*): a pen squeak under red draw-ons, a pour, a gulp, a thud for the collapsed figure.
  Never a whoosh, because nothing moves.

## 10. Do / Don't

**Do**
1. State the analogy in the first sentence over a hand-lettered title card.
2. Write the script as a list of cases ("if they… then…"), from obvious to absurd.
3. Swap whole drawings on the beat in a single frame; hold them still.
4. Keep the ink monoline (≈ 5 px), black on pure white, with round caps and a slight wobble.
5. Give the props more detail than the people.
6. Reserve one red for judgement: circle-and-slash, single words, the data line.
7. Draw the red marks on (≈ 1 s for a circle); never draw the black lines on.
8. Reuse the same drawing whenever a rule repeats.
9. Leave 0.5–1.5 s of silence after each absurd image.
10. Use reaction close-ups (head cropped by the frame edge) for "meh" and "hmm" beats.
11. Map the analogy to the real topic explicitly in the last 10 % and end on a one-line moral card.
12. Add a short tag joke after the moral, over the opening prop.

**Don't**
1. Don't move a camera, slide, fade or zoom; every change is a swap.
2. Don't add colour fills, shading, gradients, paper texture or line boil.
3. Don't use red for anything except judgement and data.
4. Don't animate in-betweens for simple pose changes; only animate the gag beats.
5. Don't put more than one drawing idea on screen at once.
6. Don't subtitle the narration; text is the title, bubbles, red words and the cards only.
7. Don't give figures hair, clothes or identity markers unless the case needs them.
8. Don't play music under the pauses.
9. Don't reveal the real topic before the mapping beat, apart from the title.
10. Don't read slowly; the deadpan speed is half the humour.
11. Don't copy the source's figures, title lettering or tea-specific gags for another topic; find a new analogy
    with its own props.
12. Don't let the moral be ambiguous; say it in words on screen.

## 11. Replication recipe (code)

**Rendering:** SVG on a white `#stage`, 1920×1080, 24 fps, sound preset `none` (or a very quiet bed). No camera
group is needed.

**Drawing approach:** author each drawing as an SVG group of hand-wobbled paths. Write a `wobble(path, amp=1.2,
seed)` that resamples a clean path every 12 px and offsets the points by seeded noise, so the shapes look
marker-drawn. Apply it once at build time, not per frame (no boil). Use stroke 5, `#1a1a1a`, round caps and joins,
no fill.

```js
const FPS = 24, F = n => n / FPS;
const show = (g, at, until) => { X.tl.set(g, { autoAlpha: 1 }, at); X.tl.set(g, { autoAlpha: 0 }, until); };  // T1 hard swap
function redStamp(target, at) {                       // T3
  const circle = X.svg("path", { d: looseCircle(target.getBBox(), X.rand(2)), stroke: "#e20a22", "stroke-width": 6,
                                 fill: "none", "stroke-linecap": "round" }, overlay);
  X.drawOn(circle, at, F(22));
  const slash = X.svg("path", { d: slashThrough(target.getBBox()), stroke: "#e20a22", "stroke-width": 6, "stroke-linecap": "round" }, overlay);
  X.drawOn(slash, at + F(22), F(3)); X.sfx(at, "scribble", { gain: -12 });
}
function loopOnFours(frames, t0, t1) {                // T7: frames = array of <g>, swap every 4 f
  X.every(t => { if (t < t0 || t > t1) return; const k = Math.floor((t - t0) * FPS / 4) % frames.length;
                 frames.forEach((g, i) => g.style.visibility = i === k ? "visible" : "hidden"); });
}
// schedule: each drawing's start = the first stressed word of its clause (from vo.json); end = the next drawing's start
beats.forEach((b, i) => show(drawings[b.id], X.word(b.line, b.word) - F(1), beats[i + 1]?.at ?? X.end()));
```

**Script tooling:** in `script.json`, put comic pauses as `gap: 0.8–1.4` after punchline lines. Write shouted
lines in capitals for emphasis (adjust the Kokoro speed per line if needed). Aim for ≈ 190 WPM overall.

**Defining shots and how to build them**
1. **Title card:** an outlined bubble-letter word at 84 % width with a hand-lettered subtitle, held while the
   analogy sentence plays.
2. **Prop hero:** the analogy's object drawn with care (rim, pattern, saucer) and grey steam on a 2-frame-swap
   loop on fours, centred.
3. **Reaction pair:** a full figure in a pose plus a bubble ("meh."), then a hard swap to a head close-up cropped by
   the bottom edge.
4. **Red verdict:** a red circle drawn over the forbidden act, slashed, held 2–3 s in silence.
5. **The graph:** hand-drawn axes with tiny labels and smiley/frowny end markers; a red curve draws on with an
   arrowhead while the VO states the trend.
6. **Mapping cards:** two hand-lettered cards — the bridge sentence and the moral — swapped hard, then the tag over
   the opening prop.

## 12. Per-video notes

**Tea Consent (170.7 s)**
- 43 full drawing swaps and 0 detected cuts: the strongest example in the corpus of the metrics' blind spot for
  line-on-white work.
- 27.4 s of silence. The pauses are part of the script, not dead air.
- The only eased motion is red ink (circle, slash, graph line). Everything black swaps.
- The credits are handwritten and name the script's original author (a blog post), the studio, the narrator and
  the animator.

## 13. Source-list issues

- The thread comment links the video without naming it ("my all-time favourite didactical explainer"); the
  identity comes from oEmbed.
- `scene_changes_per_min = 0.0` and `cuts_per_min = 0.0` are measurement artefacts, not facts about the film (see
  §2). Use the frame-change profile for this style's QA.
