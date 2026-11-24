# Vox explainer style — "annotated evidence" mixed media

Analysed 2026-10-27 from `frames/<id>/` (metrics, contact sheets, strips, transcripts) plus extra measurements
taken directly from the source MP4s (ORB-feature camera tracking for push rates, 8–12 fps frame sheets for
transition timing, k-means / saturated-pixel colour sampling). Values marked *inferred* could not be measured.

---

## 1. Identity

A Vox explainer is reported journalism dressed as a scrapbook. Real evidence — press photos, news clips,
interview footage, scanned studies, newspaper columns, bill text — is placed on one flat designed ground
(dark slate or black, sometimes light grey) and **annotated on camera**: a hand-drawn yellow ellipse circles
the subject, a tilted colour tag names him, a highlighter stroke runs across the key phrase, a chart draws itself
while its axis rescales, a curved arrow points into a pile of paper cut-outs. Colour is rationed to one accent
plus one secondary per episode (median saturated-pixel share is only 2–3 % of the frame), and the camera never
stops: every still creeps forward at about 0.25 % scale per second. A reporter's voice at ~160 words per minute
carries the argument, with interview soundbites as the second voice. A per-episode kit (palette and type)
sits inside a constant grammar of labels, highlights, charts and credits. That grammar is what makes it recognisable.

## 2. Sources analysed

| id | title | dur (s) | cuts/min | median shot (s) | motion mean / p90 | hold_frac | colourfulness | WPM (overall / speech span) | LUFS |
|---|---|---|---|---|---|---|---|---|---|
| t6V9i8fFADI | How the rich avoid paying taxes (2021) | 367 | 4.42 | 7.90 | 3.42 / 7.48 | 0.536 | 33.0 | 154.9 / 164 | −17.8 |
| BB3qNWRaxGE | Why US gun laws get looser after mass shootings (2022) | 566 | 9.11 | 3.13 | 5.23 / 10.40 | 0.298 | 31.6 | 154.3 / 161 | −16.5 |
| SrDEtSlqJC4 | (Vox, vidpros list) | — | — | — | — | — | — | — | — |
| B9tbTY6dtG8 | How new wearable tech is changing horse racing (recent upload, 585 s) | — | — | — | — | — | — | — | — |

SrDEtSlqJC4 and B9tbTY6dtG8 were **not analysed** in this pass: neither was available for analysis (see
`channel-extras-addendum.md` for the later pass).

Source: 854×480, 23.98 fps. Dark-frame fraction is 0.37–0.41 and `animated_frac` 0.68–0.75. The flat-shaded
fraction counts dark graphic grounds, so read it as "share of designed frames", not as "animation".

## 3. Measured pacing

| quantity | target range | what it means in practice |
|---|---|---|
| hard cuts | 4–9 per min (27 and 86 cuts) | the density depends on how much documentary footage the story has, not on the graphics |
| cuts in first 15 s | 5–7 | the hook is a montage: photos and b-roll held for 0.5–1.5 s each (12–36 frames at 24 fps) |
| median shot | 3–8 s; p10 0.6–1.1 s; p90 15–26 s | graphic sequences build inside one long continuous shot (a 26 s chart build is normal) |
| motion_mean | 3.4–5.2 (p90 7.5–10.4) | calm; peaks come only from montages, camera reveals and dot-grid fills |
| hold_frac | 0.30–0.54 | see below: the frame is rarely really frozen |
| colourfulness / saturation | 32–33 / 0.16–0.30 | muted; saturated pixels are 2–3 % of the frame (median), 12–18 % at p90 |
| speech | 154 WPM overall, 161–164 WPM inside the speech span | brisk news-read pace; 4–11 s of total silence in 6–9 min |
| loudness | −16.5 to −17.8 LUFS integrated | about 3 dB under YouTube's −14; dynamic documentary mix |
| logo sting | at 17–25 % of runtime | after the cold open (1:33 of 6:07 and 1:38 of 9:26), never at 0:00 |
| credits | 17–20 s | on a dark grey card |

**Why hold_frac is high (0.30–0.54).** The analyser counts a 1/6 s step as a "hold" when almost nothing changes.
Vox stills are not frozen. They drift at **0.25–0.30 % scale per second**, measured with ORB tracking:

- Buffett press photo, 3.6–9.6 s: scale 1.6233 → 1.6497, i.e. +1.6 % in 6 s.
- Billboard photo, 1:56–2:01: 1.0015 → 1.0127, i.e. +1.1 % in 5 s.

At 1080p that moves the frame edge about 2.5 px per second, or 0.4 px per 1/6 s step, which is under the
threshold. So the "holds" are live, creeping frames. On top of that, every graphic builds and then sits for
2–6 s while the narrator finishes the sentence. The taxes video (more graphics, 65 % of sampled frames) holds
more than the gun video (44 % graphics, 27 % interview footage, where people move).

**Energy curve** (motion deciles). Taxes: 5.6 → 3.2 → 1.3 → 2.4 → 5.2 → 6.7 → 2.7 → 0.3 → 4.3 → 2.6.
Guns: 6.2 → 10.6 → 6.2 → 5.7 → 4.5 → 3.3 → 5.1 → 2.6 → 4.3 → 3.8. Energy is front-loaded (cold open, news
montage, dot-grid fill in deciles 1–2), then alternates between busy builds and near-static chart reading.
The 0.29 dip in taxes is the stepped-up-basis curve diagram: a static chart that is read slowly.

**Material mix** (48-frame timeline counts):

| | designed graphics | interview | photos / archival / b-roll | documents / headlines | credits |
|---|---|---|---|---|---|
| taxes | 65 % | 19 % | 10 % | 0 % | 6 % |
| guns | 44 % | 27 % | 13 % | 10 % | 4 % (+2 % screen recording) |

## 4. Script & narrative structure

**Beat map** (both videos fit it; percentages of runtime):

| % | beat | taxes (367 s) | guns (566 s) |
|---|---|---|---|
| 0–3 | **Concrete subject in frame within 0–3 s**, music under | ice-cream product photo, then cardboard cut-out of the investor, crowds (5 cuts in 2.5 s) | crime-scene tape, school exterior, sign (4 shots in 3.5 s) |
| 1–2 | **Name it** with a label | ellipse plus tag "Warren Buffett" at 2.5–3.4 s, net-worth sub-tag at 5.0 s | typed lower third "Flo Rice / SANTA FE, TEXAS" at 4.0–4.5 s |
| 3–12 | Context built from evidence | holdings on a paper oval, stock chart | survivor testimony, date tag, footage drains to B&W |
| 10–13 | **The conventional story / paradox** | archival clip: the billionaire says his secretary pays a higher tax rate than he does (0:45–0:53) | the cycle diagram, then a 6-clip news montage (1:00–1:12, about 1.5 s per clip) |
| 13–14 | **The turn** | income versus capital gains (1:00) | "But here's the thing:" (1:13) |
| 17–25 | **Logo sting** | 1:33, over the chart | 1:38, formed by the dot grid |
| 25–80 | Mechanism, in 2–4 chapters (YouTube chapters, **no on-screen chapter cards**) | capital gains → billionaires' piles → stepped-up basis → "buy, borrow, die" | the study → Texas history (timeline spine) → national hex map |
| 80–95 | Policy / so-what | proposal charts, revenue estimates | federal bill, states keep power |
| 92–97 | **Human or kicker close** | interviewee's last line, then a narrated kicker that trails off: the rich get richer, everyone else doesn't | the survivor again, on why she keeps campaigning |
| 95–100 | Credits, music tail | 17.5 s | 20 s |

- **Hook rule.** Show a person or place, name it, give one surprising number, then state the paradox inside 60 s.
  The thesis turn comes at 13–20 % of runtime and the logo sting follows it.
- **Hand-overs.** (a) Cut to an interview soundbite that finishes the narrator's thought. (b) A camera move out of
  one graphic reveals the next state. (c) A spoken bridge ("That's because...", "But...", "It's part of what's
  called..."). Section titles live only in YouTube chapters (4–6 per video).
- **No spoken CTA.** The end is credits only: small names right-aligned against a thin yellow vertical rule with
  dot terminals, at about 36 % of frame width, running about 90 % of frame height, on dark grey `#222222`.
- **Voice.** Short declarative sentences with concrete numbers ("$19", "240,000 shares", "3,000 laws").
  Interviewees supply emotion and authority; the narrator supplies structure.

## 5. Visual system

The grammar is constant. The palette and type kit change per episode. Two kits were observed.

**Kit A — "slate + orange" (taxes)**

| role | hex | use |
|---|---|---|
| background | `#2B3340` (52 % of pixels), alt `#242D38` | every graphic ground |
| paper plates | `#C7D8D8` / `#E8E9E8`, white `#F5F5F3` | ovals, stock certificates, cheques, with a soft cast shadow |
| primary accent | `#E5893C` bright, `#C6662A` fill | name tags, line-chart stroke, emphasised bar segment, photo die-cut outline |
| secondary | sage-teal `#5E817F` (bars), `#7F8A80` | data bars, secondary tags ("$400,000"), area fills |
| highlight | highlighter yellow `#ECF91F`; ellipse yellow `#D6DE24` | word highlight, hand-drawn circles and arrows |
| neutral | grey `#A2A4A6` | unemphasised bar tops, axes, gridlines (1 px, about 25 % opacity) |
| shadow | `#13120E` at 30–40 % opacity | blurred ellipse under objects |
| text | `#F5F5F3` on dark; white on orange or sage tags | |

**Kit B — "black + magenta" (guns)**

| role | hex | use |
|---|---|---|
| background | `#020101`, plus a faint grid (`#161616`, 1 px lines about every 40 px at 480p) and a ticked horizontal axis | diagram and timeline ground |
| light card | `#DFDFDF`–`#E7E6E7` with scan noise | charts, hex map |
| accent 1 | magenta `#C1227B` | "push for reform", dot-grid dots, pictogram frame, location tag |
| accent 2 | red `#B90F24` / blue `#0F60F3` | loosen / tighten; Republican / Democrat |
| data | green `#42C476` (line), dark green `#2D6C42` | chart line, "3,000 laws" |
| highlight | yellow `#F0DC15` | document highlights; year chip |
| marker | triangle with a yellow `#F0DC15` → red `#BB1A23` vertical gradient | event (mass shooting) markers |
| text | white `#F5F1F1`; grey for dimmed context | |

**Shape language.** Rectangles are labels. Circles are medallions, dot-grid units and event dots. Hexagons are
map tiles. Down-pointing triangles are event markers. The only hand-drawn marks are annotations (ellipses, arrows,
underlines); everything else is geometric.

**Line work** (scaled to 1080p from 480p measurements):

- Annotation strokes: 7–9 px, round caps, with a deliberately imperfect join (the ellipse overshoots its start by
  15–20°).
- Chart lines: 4–5 px. Gridlines: 1–2 px at low opacity.
- Photo cut-outs carry a solid 12–14 px die-cut outline in the accent colour (sticker look), round joins.

**Texture.**

- Kit A: clean vector, plus paper textures on the plates, torn edges on certificates and real halftone and colour in
  the photos.
- Kit B: scan or xerox noise on light cards, a grid on black, and a 1–2 px RGB chromatic fringe on dots.
- Documents are real scans: newspaper columns are shot with shallow depth of field (edges blurred).

**Lighting.** Flat. Only soft cast shadows (an ellipse under each object, 30–40 % black, blur about 10 px at 1080p).
Medallions put a greyscale photo inside a coloured circle.

**Depth.** Stacked paper plates; 2.5-D camera moves through layers (a second, larger plate rises behind the first
while the camera pushes in 15 %). There is no perspective 3-D.

**Composition.**

- One subject, centred or on the left third.
- Tags sit lower-left of the subject, rotated −3° to −5°.
- Charts fill about 80 % of the width with a left-aligned bold title and an italic source line at top-left.
- The channel bug sits top-right (don't copy any wordmark; use your own small bug or none).

**Typography.**

- Kit A: a bold grotesque for tags and chart labels, sentence case. Free look-alikes: Libre Franklin Bold,
  Work Sans Bold. Tag text cap height about 40 px at 1080p. Chart titles about 22–26 px bold, source lines
  16–18 px italic.
- Kit B: bold monospace, lowercase (look-alikes: Space Mono Bold, Courier Prime Bold), typed on.
  Headline cards reuse real publication typography, framed as scans.
- Text appears only as 1–5-word labels, numbers, chart titles and sources. There are no subtitles and no sentences
  on screen, except quoted documents and headlines.

## 6. Characters & objects

- **No drawn characters.** People are real: interview footage (taxes uses a webcam-quality remote interview with a
  bookshelf backdrop; guns uses lit two-camera sit-downs), archival clips, or **photo cut-outs** with an accent
  die-cut outline placed on the graphic ground. Cut-outs never animate their limbs. They pop or slide in and are
  carried by the camera.
- **Prop kit** (drawn as flat, semi-realistic paper objects):
  - stock certificate: white card, green guilloche border, torn right edge;
  - circular "tax" medallion: greyscale building photo in a circle, label set on an arc;
  - cheque; money bundles; bank façade;
  - gun pictograms in coloured circles;
  - a pink line-icon of a legislature in a rounded square;
  - value chips: sage or orange boxes with white numerals.
- **Mass as metaphor.** Wealth becomes a pile of 200+ certificate cut-outs on a soft shadow. Laws become a field of
  dots that zooms out to form a silhouette.
- **Acting** belongs to the interviewees. Graphic objects only appear, stack, slide and get labelled.

## 7. Camera & transitions catalogue

| # | transition / move | construction (from strips and 8–12 fps sheets) | duration | easing | frequency |
|---|---|---|---|---|---|
| 1 | **Hard cut** | photo → photo, footage → graphic | — | — | 27–86 per video; hook montage cuts every 12 frames |
| 2 | **Slow push on still** | uniform scale-up about the subject plus 0.05–0.1 % W/s drift | whole shot (3–10 s) | linear | every photo, document and many graphic holds |
| 3 | **Motivated push to a detail** | camera moves to the next data point (e.g. Berkshire plate +15 %; bars push to the "Top 1 %" bar, about 1.4×) | 0.9–1.3 s (22–31 f at 24 fps) | power2.inOut | 1–2 per minute |
| 4 | **Pull-back reveal** | close-up of one object pulls out 1.5–3× to show the mound / field it belongs to (certificate pile, cut-out in front of the stack) | about 1 s (24 f) | power2.inOut | 1 per minute (taxes) |
| 5 | **Cross-dissolve photo → graphic ground** | photo fades as the paper plate fades up on the slate | 0.5 s (12 f) | linear | at section starts |
| 6 | **Desaturate in place** | colour footage drains to greyscale, contrast +10 %, typed tags stay coloured | about 1.5 s | sine.inOut | cold open (guns) |
| 7 | **Timeline truck** | black grid, horizontal axis; camera trucks left at constant speed while events pin to the axis (triangle, red gun circle, green dot); typed captions; a dim (≈40 %) duotone photo or bill text behind | 2–4 s per event | linear (none) | one long sequence (3:12–4:30 in guns) |
| 8 | **Document focus** | scanned page with push, −0.6° rotation and pan about 2 % W/s; highlight sweep; un-highlighted text dims to ~40 % | 3–8 s | linear | 3–5 per video |
| 9 | **Colour flash** | full-frame red tint (about 30 % opacity) as "mass shooting" lands | about 1 s | quick in, fade out | rare (once) |
| 10 | **Dot-grid fill → zoom-out reveal** | dots stack up from the bottom while the camera tilts up; then zoom out until the dots read as a pistol silhouette, then the logo | about 14 s fill, about 2 s reveal | power2.inOut | once, as the logo sting |
| 11 | **Tile-map state change** | hex tiles cross-fade to new party colours; year label swaps 2002→2022; legend dims inactive categories | about 0.3 s per state change | linear | once |
| 12 | **Credits** | dark-grey card; yellow 2 px vertical rule with dot terminals; names right-aligned to the rule | 17–20 s hold | — | end |

## 8. Motion grammar

- **Sync rule.** An annotation lands within ±0.3 s of the stressed noun or number:
  - the VO names the subject at 2.8 s: ellipse completes at 2.9 s, tag at 3.15–3.4 s;
  - the "richest" line at 4.8 s: net-worth sub-tag at 5.0 s;
  - the half-million share price (VO 32.8–37 s): the chart line reaches its last point and the "$421,000" label pops
    at 35.3 s;
  - the highlighter crosses the key word of the clip ("undertaxed") as the speaker says it (1:10.2).
- **Build order follows sentence order.** Object, then label, then value chip, then comparison. Holdings logos pop
  one by one on the paper oval with about 0.5 s stagger, slightly ahead of the spoken list.
- **Durations** (24 fps):

  | element | duration | easing / notes |
  |---|---|---|
  | ellipse draw-on | 8–10 f | power1.out |
  | tag wipe-on (left→right mask, text revealed with the box) | 6 f | power2.out |
  | sub-tag | follows the tag by about 2 s | |
  | highlighter sweep | 16 f | close to linear |
  | arrow draw-on | 12 f | |
  | line-chart draw | about 65 f (2.7 s) | the y-axis keeps rescaling so the line always fits ("scale chase", tick labels change 350 → 400k) |
  | stacked bars rise | 8 f stagger, left→right | |
  | certificate pile | 2–3 f stagger per paper | |
  | logo / icon pops | about 6 f | small overshoot *(inferred, back.out(1.4))* |

- **Holds.** The final state of every build holds 2–6 s. The slow push continues under it, so nothing is dead.
- **Secondary motion.** None on the graphics themselves (no wiggle, no boil). Kit B adds a constant subtle
  scan-noise flicker and chromatic fringe.
- **Typewriter (kit B).** About 16 characters per second (8 chars in 0.5 s) behind a block cursor. The box grows
  with the text. Exit is a 0.3–0.5 s block-scramble wipe.
- **Montage rhythm.** About 0.5 s per photo in the hook and about 1.5 s per news clip in the "cycle" montage
  (*inferred* to be cut to the music pulse).

## 9. Sound

*All audio descriptions are inferred from transcripts, metrics and credits; the audio itself was not heard.*

- **VO.** One journalist narrator, conversational American news-read, 154 WPM overall and 161–164 WPM while
  speaking. Interview soundbites carry 19–27 % of runtime and are often cut mid-sentence into the narrator's line.
- **Music.** The cold open starts on music (the transcript shows "[Music]" at 0.5 s). *Inferred:* understated
  electronic or ambient pulse beds that rise for montages and drop under testimony. The credits list a separate
  "Music" block (library tracks).
- **SFX** *(inferred)*: soft whooshes or clicks on pops and camera moves; typing ticks on the monospace typewriter
  (kit B); a low hit on the red colour flash.
- **Mix.** −16.5 to −17.8 LUFS integrated; 4–11 s of total silence (the pause before a kicker line). Music ducks
  under interviews *(inferred)*.

## 10. Do / Don't

**Do**

1. Start on a concrete person or place in the first 3 s. Name it with a tag by 5 s.
2. Keep every still moving: a linear push of 0.25–0.3 % per second for the whole shot.
3. Annotate evidence. Hand-drawn ellipse (8–10 f draw), tilted colour tag (6 f wipe), sub-tag 2 s later.
4. Ration colour: one accent and one secondary per episode, with saturated pixels under 5 % of the frame on average.
5. Build charts on camera and let the axis rescale as the data grows. Put the source on every chart.
6. Land each annotation within ±0.3 s of the stressed word or number.
7. Use real documents: scan, push, sweep a yellow highlight, dim the rest to about 40 %.
8. Turn quantities into masses of paper cut-outs or dots, then pull back to reveal the total.
9. Put the thesis turn at 13–20 % of runtime and the channel sting right after it.
10. End on the human subject or a one-line kicker, then 15–20 s of credits. No spoken CTA.
11. Choose one type kit per film (grotesque labels or monospace typewriter) and keep it consistent.
12. Leave 3–6 s holds after each build so the VO can finish.

**Don't**

1. Don't cut graphics on every sentence. Graphic sequences run 8–26 s inside one shot.
2. Don't animate photo cut-outs' limbs or faces. They are evidence, not characters.
3. Don't add idle wiggle, bounce loops or particle sparkle.
4. Don't use gradients, glows, bevels or 3-D lighting. Only flat fills and soft drop shadows.
5. Don't put sentences on screen. Labels are 1–5 words.
6. Don't use more than two accent hues at once (kit B's red and blue are a semantic pair, not decoration).
7. Don't start with a logo or title card.
8. Don't show a source-less number.
9. Don't let the camera sit perfectly still on a photo.
10. Don't use chapter title cards (Vox uses YouTube chapters only).
11. Don't copy a news brand's wordmark, bug, lower-third design or real news footage. Shoot or license your own evidence.
12. Don't make every transition a move. Hard cuts are the default and moves are motivated.

## 11. Replication recipe (code)

**Layer stack** (inside a 1920×1080 SVG, rendered frame by frame with a paused GSAP timeline):

```
<svg 1920x1080>
  z0  <rect ground fill=#2B3340/>  (+ kit B: <g grid> 1px #161616 every 90px, axis line, scan-noise filter)
  z1  <g id="cam">                       ← camera rig, everything world-space lives here
        <g evidence>  photos/video frames/scans  (filter: saturate(), contrast())
        <g plates>    paper ovals, certificates (feTurbulence paper tex + feDropShadow)
        <g annotate>  ellipses, arrows, tags, highlights (move WITH the image)
      </g>
  z2  <g screen>  source line, bug, credits, typed lower thirds (screen-fixed)
</svg>
```

**Camera rig.** `cam.transform = translate(960,540) scale(s) rotate(r) translate(-cx,-cy)`. Animate `{s, cx, cy, r}`.

- Slow push: `tl.to(cam, {s: s0 * (1 + 0.0028*dur), duration: dur, ease: "none"}, t0)`, plus `cx += 0.0008*W*dur`.
- Motivated push: `ease: "power2.inOut", duration: 1.1`. Reveal pull-back: `s → s/2.2` over 1.0 s, power2.inOut.

**Recipes**

- **Paper plate.** Shape fill `#E8E6DF`; `<feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2"/>`
  → `feColorMatrix` to grey → `feBlend mode="multiply"` at 8 %; `<feDropShadow dx="0" dy="10" stdDeviation="10" flood-opacity="0.35"/>`.
- **Torn edge.** Generate the path edge with vertices every 6 px jittered ±3 px (seeded).
- **Die-cut photo.** `<clipPath>` from a traced silhouette path. Draw the same path underneath with
  `stroke=#E5893C stroke-width=26 stroke-linejoin=round` (it shows 13 px outside).
- **Hand-drawn ellipse.** Path = ellipse sampled at 64 points with radius noise ±2 %, spanning 380° so the ends
  overlap; `stroke-width 8; linecap round`. Draw-on: `strokeDashoffset len→0`, 0.38 s, `power1.out`.
- **Tag.** `<g rotate(-4)>` holding a rect `#E5893C` and bold white text. Clip rect width 0→W in 0.25 s (`power2.out`).
  Sub-tag: sage `#5E817F` rect, 70 % of the size, offset down-right, enters 2 s later.
- **Highlighter.** Rect `#ECF91F` behind the word. `scaleX 0→1`, `transformOrigin: left`, 0.66 s, `power1.inOut`.
  Use `mix-blend-mode: multiply` on paper scans; opaque behind caption text.
- **Scale-chase line chart.** `tl.to(state, {p: 1, duration: 2.7, ease: "power1.inOut", onUpdate})`. Each frame:
  visible = data[0..p·n], yMax = niceCeil(max(visible)·1.1); re-render the path, area (60 % opacity) and tick labels.
  Ends with a value tag popping at the last point.
- **Pile of cut-outs.** 150–250 certificate sprites with seeded positions in a mound; each drops 30 px with a
  `power2.out` 0.25 s tween and 0.08 s stagger.
- **Document focus.** Scan image in `cam`. Push 0.3 %/s, rotate −0.6°, pan 2 % W/s. Highlight sweep. A dim mask
  (black at 55 %) with a cut-out window over the highlighted line.
- **Typewriter lower third (kit B).** `text.slice(0, floor((t - t0)*16))` plus a block cursor `█` blinking at 2 Hz.
  The box width follows the measured text width. Exit: replace characters with blocks over 6 f, then collapse the box.
- **Desaturate in place.** Video layer `filter: saturate(1→0) contrast(1→1.1)` over 1.5 s, `sine.inOut`.
- **Kit B grain.** `feTurbulence baseFrequency=1.6` with `seed = frame` at 4 % opacity, plus an
  `feOffset dx=±1.5` red/blue split on the dot layer.

**Minimal scene skeleton** (pseudo-code):

```js
const tl = gsap.timeline({paused:true});
// SHOT 1 – annotated still (cue from TTS word timings)
shot(tl, 0.0, 7.0, () => {
  place(photo("crowd.jpg"), {fit:"cover"});
  slowPush(tl, 0.0, 7.0, {rate:0.0028, drift:[0.0008,0]});
  drawEllipse(tl, cue("Subject").t - 0.3, {cx:620, cy:430, rx:250, ry:300, dur:0.38});
  tag(tl, cue("Subject").t + 0.1, "Ada Lindqvist", {x:300, y:820, rot:-4, fill:ORANGE});
  subTag(tl, cue("richest").t, "Net worth: $9 billion", {fill:SAGE});
});
// SHOT 2 – dissolve to slate, paper plate, holdings pop in
dissolveTo(tl, 7.0, 0.5, GROUND);
plate(tl, 7.3, {shape:"oval"}); popLogos(tl, 7.8, ownIcons, {stagger:0.5});
motivatedPush(tl, 11.0, {s:1.15, dur:0.9});
// SHOT 3 – scale-chase chart, arrow + label
chart(tl, 13.0, data, {dur:2.7, endTag:"$421,000"});
arrow(tl, 17.0, {from:[300,420], to:[900,600], dur:0.5}); tag(tl, 17.2, "her wealth");
```

**The five shots that define the style**

1. **Annotated still.** Press photo, slow push 0.28 %/s, yellow ellipse, tilted orange name tag, sage fact tag.
2. **Scale-chase chart.** Line or area draws over 2.7 s while the axis rescales; value tag on the last point; a
   hand-drawn arrow and label point at the meaning.
3. **Document highlight.** Scanned study or clipping, slight rotation, push and pan, yellow sweep across the
   phrase, rest dimmed.
4. **Paper cut-out diagram.** Certificates, cheques and medallions on the slate ground with value chips;
   comparisons side by side; quantities become piles; pull back to reveal the whole mound.
5. **Timeline spine / dot grid.** Black grid, ticked axis, camera trucking left, events pinned as triangles and
   coloured circles with typed captions; or a dot field that zooms out into a silhouette.

## 12. Per-video notes

**t6V9i8fFADI — How the rich avoid paying taxes**

- Kit A. 27 cuts, 65 % graphics. One remote webcam interview (an investor) is reused in 9 of 48 timeline frames as
  the counter-intuitive voice.
- Archival news clips get the highlighter treatment *inside* their caption bar.
- Signature builds: the paper "holdings" oval, a 2.7 s stock chart that is then carpeted with certificate cut-outs
  ("Buffett's wealth" arrow), stacked 100 % bars with a push to the top-1 % bar, kinetic type for "stepped up basis"
  (words placed on steps, led by a swooping orange stroke), and an S-curve value diagram with "sell" / "inherited" brackets.
- Logo sting at 1:33 over the chart. Hold_frac 0.536 is the highest in the dataset family: graphics hold while
  slow pushes run underneath.

**BB3qNWRaxGE — Why US gun laws get looser after mass shootings**

- Kit B. 86 cuts (documentary density). Survivor testimony bookends the film.
- The cold open's footage drains to B&W while coloured typed tags stay.
- Monospace typewriter lower thirds (white name box, magenta location box).
- The academic paper is shown as a real scan with highlights, then becomes a grey-card line chart.
- About 14 s of magenta dot-grid fill turns into a pistol silhouette and the logo.
- A long timeline spine (1991–2022) with semantic markers; a party-control hex map 2002→2022; a screen recording of an
  online ammunition checkout as evidence.
- A red full-frame flash on "mass shooting" (0:56).

## 13. Source-list issues

- **Not "animated explainers" in the cartoon sense.** The vidpros list groups Vox with animation channels, but
  these are mixed-media documentaries: 25–32 % live action (interviews, b-roll, archival) and the rest designed
  graphics. `animated_frac` (0.68–0.75) overstates "animation" because dark graphic grounds count as flat.
- **The channel's current output is not this format.** `raw/channel_listing.txt` (the 25 most recent uploads,
  Oct 2026):
  - 10 are *The Gray Area* episodes (2,100–3,371 s) and 10 are *America, Actually* episodes (1,153–2,823 s);
  - the rest are three standalone long pieces (1,128–1,823 s), a 104 s show trailer, and one classic-length
    explainer (B9tbTY6dtG8, horse-racing wearables, 585 s);
  - median duration is 2,100 s (35 min); 21 of 25 exceed 25 min; only 2 are under 10 min.

  The short, graphics-led explainer documented here (2016–2022 era) is now a minority format on the channel. Take
  style references from the archive, not from the latest uploads.
- **Sample gaps.** B9tbTY6dtG8 is a recent upload (`listed: false`, added from the channel listing). It and the
  listed SrDEtSlqJC4 were not available for this pass, so this analysis rests on two videos with two
  different kits. Treat the palette and type tables as *examples* of per-episode kits, not as one fixed house palette.
- **Brand caution.** The channel bug, the logo sting and real news footage are brand or third-party assets.
  The rebuild should use original photos (or licensed and AI-free stock as policy dictates), an original bug and
  original typography.

---

## Cross-style comparison: Vox vs The School of Life vs collage brand film (HubSpot)

Detailed files: `analysis/school-of-life.md`, `analysis/collage-brand.md`.

**What they share**

- **A layered, cut-out world on a flat ground.** Paper plates and die-cut photos (Vox), cut-paper fields and figures
  on a vignetted paper ground (School of Life), greyscale photo cut-outs on flat axonometric planes (HubSpot).
  None uses perspective 3-D lighting. Depth comes from stacking and from camera scale.
- **Low motion energy and VO-led pacing.** motion_mean 3.2–5.2 across all six videos, compared with 7–17 for
  hype product films. The picture serves the narration, and visual events land on stressed words.
- **Colour discipline.** Each piece limits itself to a few roles (ground, one or two accents, neutral). Colour
  carries meaning, not decoration.
- **Texture over polish.** Paper grain, scans, halftone, stipple, xerox. Surfaces look printed or made, never glossy.
- **Few hard cuts.** Transitions are mostly camera travel, morphs, wipes or builds inside one shot (except Vox's
  documentary footage).

**What separates them**

| axis | Vox | The School of Life | HubSpot "Video Has Changed" |
|---|---|---|---|
| what the collage is made of | **real evidence** (press photos, news clips, scans, interviews) | **commissioned illustration**: flat outlined figures, silhouettes, or ink drawings (no photos in this sample) | **decorative photo cut-outs** (greyscale halftone) plus flat axonometric architecture |
| purpose of an image | prove and annotate a fact | embody a metaphor for an idea | dramatise a brand argument (old way → new way) |
| cuts/min, median shot | 4.4–9.1, 3–8 s | 0.13–2.44, 10–238 s (one continuous shot in 20 Signs) | 2.58, 14.8 s (first cut at 24 s) |
| how time moves | hard cuts + linear slow push (0.25–0.3 %/s) + motivated 1 s moves | animated **on twos** (12 drawings/s), slow push 0.7–1.2 %/s, morphs and colour-field wipes | continuous camera travel (truck 0.4 % W/s, pull-outs about 1 %/s), iris and ring-burst wipes |
| hold_frac | 0.30–0.54 (creeping stills) | 0.09–0.39 (texture boil keeps "holds" alive) | 0.125 (always travelling) |
| colour logic | one accent on a dark ground; saturated pixels ~2–3 % median | 3–5 flat fields on cream, dark or kraft paper; saturated colour reserved for chapter or number cards | **colour = the argument**: saturated pixels 0–13 % in the "old way" (0–64 s), 67–93 % in the "new way" teal act (68–96 s) |
| on-screen text | heavy and functional: tags, numbers, chart titles, sources, typed lower thirds | minimal: chapter cards (serif, numbered), single keywords | none until the end lockup |
| characters | real people only (interviews, cut-outs) | drawn characters; acting through slow gesture | anonymous greyscale photo people, posed, not acting |
| narrative shape | reported: person → paradox → "but here's the thing" → evidence → policy → human close; logo at 17–25 % | essay / list: universal claim or question → numbered propositions → consolation → shop CTA | manifesto: then vs now → problem (grey) → "let's start" (colour) → product reveal → logo |
| VO & mix | journalist, 161–164 WPM; −16.5 to −17.8 LUFS; interviews 19–27 % | single essayist voice, 143–164 WPM with long pauses (13–43 s silence); −20 to −24.7 LUFS | corporate VO, 138 WPM; continuous music bed (2.2 s silence); −23.1 LUFS |
| end | credits on dark grey with a yellow rule; no CTA | spoken CTA + shop or subscribe card | product name lockup → logo on brand colour |

**Choosing between them.** Use the **Vox** grammar when the content is factual and sourced (numbers, documents,
named people). Use the **School of Life** grammar when the content is reflective or abstract and one drawn
metaphor per sentence can carry it. Use the **HubSpot collage** grammar for a 60–120 s brand or product film where
a single visual switch (grey → colour) can embody the before/after promise.
