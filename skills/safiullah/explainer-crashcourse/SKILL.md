---
name: explainer-crashcourse
description: "Animated layer of a CrashCourse-style host-led lesson — flat outline-free cartoon \"story segment\" inserts cued in and out by the host (\"Let's go to the …\" / \"Thanks, …\"), 45° diagonal-stripe swipes with huge condensed-caps keyword cards, diamond badges popping beside the host, light-leak flash cards (2014) and host-in-a-panel collage cards with torn-paper wipes (2026), narrated very fast (185–200 WPM) with jokes. Use when someone asks for a CrashCourse / Crash Course / \"thought-bubble\" / fast-talking-teacher / classroom-YouTube style explainer, a history or science lesson insert, a host-led educational video with animated cut-aways, or an illustrated stand-in for a presenter. Builds on explainer-engine."
---
# CrashCourse-style animated inserts

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

The animated half of a host-led lesson: a fast-talking presenter hands over to flat-colour cartoon inserts every
20–45 s and to one long cued story segment (50–90 s) per episode, then snaps back mid-sentence. This skill builds those
inserts, their era-specific transitions and the overlays that sit on the host — and an ORIGINAL illustrated host
stand-in when no footage exists. Built from frame analysis of 4 source videos (references/sources.md, analysis in
references/analysis.md). Original work only: never the series' logos, segment names ("Thought Bubble", "Open Letter"…),
hosts, sets, stripe-banner title art or end screens — evoke the grammar, invent the names (sample: "the Daydream").

## 1. Signature traits
- **Host spine + cut-aways.** Inserts are 1.5–26 s keyword cards/explanations plus ONE long story segment, always
  cued verbally in ("Let's go to the Daydream!") and out ("Thanks, Daydream!"). The host is never gone > ~90 s.
- **2012 flat vector (default).** Mint/aqua fields, sand, cream; flat fills with ONE darker tone, no outlines, light
  diagonal hatch on clouds/panels; tall thin puppet figures (rounded-rect head ≈ 1/5 height, stick limbs, dot eyes).
- **45° stripe swipe → 2-frame word pop.** Two-colour bars cover the frame in 4 frames, a condensed-caps word pops
  40→100 % in 2 frames at ~30 % frame height, holds ~1.4 s, bars break out at staggered speeds (4–9 f).
- **Story segment opener:** orange-on-red stripe curtain (3 f in, 0.45 s hold, 3 f off) → title card ~2 s.
- **Overlays in the host's empty third:** diamond badges (5 f back.out(1.4)) with hatch side panels; never on the face.
- **Very fast, jokey VO** (172–204 WPM), a visual gag on the punchline word every 30–60 s.
- **Era variants:** 2014 textured saturated keyword cards with an 8-frame light-leak flash dissolve; 2026 host cropped
  into a torn-paper panel beside a cream definition card whose words appear in sync with speech, torn-paper wipes.

## 2. Target metrics
Episode ranges are whole videos (host + inserts); "insert" = the 83 s story segment of WH alone (measured with the
engine analyzer on Yocja_N5s1I 2:16–3:39). A sample that is mostly insert should sit between the two.

| metric | episodes (4 src) | insert only (WH) | target | sample result |
|---|---|---|---|---|
| scene_changes_per_min | 4.0–8.8 | 11.6 | 7–10 | 9.99 |
| scene_len_median s | 3.7–10.2 | 2.7 | 3–5 | 3.33 |
| cuts_per_min (hard) | 3.8–4.7 (2026: 10.2) | 0.7 | 3–5 | 4.16 |
| motion_mean | 6.8–8.1 | 8.3 | ≥ 5 (see note) | 4.61 |
| hold_frac | 0.03–0.18 | 0.04 | ≤ 0.18 | 0.139 |
| colourfulness | 35–49 | 78 | 60–85 | 85.9 |
| brightness | 0.45–0.78 | 0.76 | 0.65–0.80 | 0.768 |
| WPM overall | 172–202 | — | 185–200 | 195.6 |
| LUFS | −14 … −16 (−20 old mix) | — | −14 | −14.3 |
| insert share of runtime | 30–44 % | — | episode: 30–44 %; this sample ≈ 85 % by request | — |

Deviations, deliberate: the sample IS the animated segment (user asked for the animated layer only), so colourfulness
and scene-change rate follow the insert column, not the episode column. motion_mean stays below the episode range
because source motion is dominated by live host footage (constant gesturing + compression noise); the illustrated
stand-in host and the story's holds-between-beats read calmer. Raise it with bigger camera pans if needed.

## 3. Script formula
Beat map of a full episode (inserts drive off the script): cold open 3–20 % (direct address, framing joke, question
cards) → 5–11 s theme sting → body with an insert every 20–45 s → **story segment at ~15–35 %** → recurring comic bit
→ wrap-up → credits. Integration contract: new term → keyword card within 0–0.5 s of the word; person → bio card or
diamond; place → map with red dots; number → kinetic number / count-up; list → one visual per item; gag → icon pop.

Story-segment sample (this skill's sample, 72 s):

| % | beat | content |
|---|---|---|
| 0–8 | host bookend + cue | hook question, one jokey line, "Let's go to the Daydream!" → curtain |
| 8–12 | title card | ribbon title + tag + italic subtitle, ~2.2 s, music lifts |
| 12–88 | story, a new composition every ~5–6 s, 15–20 words each | setting → nickname gag → map → observation → contrast → diagram → math → callback gag |
| 88–92 | sign-off | "Thanks, Daydream!" → stripe exit |
| 92–100 | host bookend | keyword stripe card + diamond badge on the button line |

Lines are short declaratives with a sarcastic aside every 2–3 sentences ("Rude. But fair." / "Ancient GPS was just a
guy. Walking. For weeks."). Avoid precise stats you cannot vouch for; say "about", "roughly", "somewhere between".
**Voice:** Kokoro `am_michael`, `speed 1.38` (≈ 228 WPM while speaking → 195 overall), `gap` 0.15–0.3 s, split a
punchline into its own line with `gap 0.4` for a beat, `gap ~2.3` before the first story line to leave room for
curtain + title. Kokoro mangles some names: write `[Syene](/sIˈini/)` (misaki phonemes: I = "eye", A = "ay").
Set `PYTHONIOENCODING=utf-8` before tts.py on Windows (it prints the phoneme text).

## 4. Visual system
Palette roles (kit `K.C`, sub-style A): field mint `#8DF2DA`, sea `#59CEC1`/`#3FBFC4`, sand `#F3D394`/`#E6BC72`/
`#CF9E55`, cream architecture `#FFF6E4`/`#EAD7B6`, ink `#231F21`, leaf `#3E9A5B`/`#2C7444`, accent coral `#D26251`,
pink X `#DC3A71`, yellow highlight `#FFE27A`, diagram field night `#1E2A33` + grid `#2B3A44`, math field orange
`#F29227`. Stripe pairs: magenta `#D82A51` on aubergine `#2F1944` (keyword), orange `#F29227` on red `#E43333`
(curtain/exit). 2014 fields `K.C14`, 2026 collage `K.C26` (cream card `#E6D6C7`, mustard topo border `#EAC177`).
Typography (2 families per era): **Bebas Neue** caps — stripe word 400–460 px (cap ≈ 30 % frame, ≤ 80 % width),
title 150 px, labels 46–64 px in coral pills; **Libre Baskerville italic** 30–40 px for "*not to scale", subtitles,
"Definition:". 2026: **DM Serif Display** lowercase titles 96 px + **Nunito** 46 px words.
Shapes: flat fills, one darker tone per object (right-hand side), round caps; light hatch (`K.hatch`) on clouds,
corners and side panels; rounded "projector" map frame with soft vignette. Composition: subject 40–60 % frame height,
generous flat field, text centred (cards) or upper-left third; safe margin ≥ 96 px after camera drift.

## 5. Characters & objects
- `K.figure(parent,{x,y,h,skin,skinDark,tunic,tunicDark,sash,belt,hairStyle:'bald'|'long'|'band'|'short',beard,
  beardLen,prop:'scroll'|'staff'|'jug',flip})` → `{g, body (timeline puppet), bob (walk), head, headPivot, armL, armR,
  legL, legR}`. Rotate limbs with `svgOrigin:'0 0'` (shoulder/hip). `K.walk(fig,t0,t1,{step,amp,keepArms})`.
- Host stand-in: `K.hostSet(parent)` → `{g, back, mid, front}`; `K.host(set.mid,{front:set.front, scale})` (arms in
  front of the desk; gestures: tween `arm.fore` rotation, `svgOrigin:'0 0'` = elbow); `K.hostTalk(host,[lineIds])`
  lip-flaps from VO word times, blinks, sways and gesticulates. Wide ↔ close jump cut = `X.tl.set(cam,{scale:1.75,
  x:-165,y:140}, t)`.
- Props/sets: `K.sun K.cloud K.palm K.dunes K.temple K.lighthouse K.well({cutaway}) K.globe K.pin K.badge K.pinkX
  K.check K.beta K.podium K.dartboard K.dart K.ruler K.scrollIcon K.stick K.mapFrame K.label K.birds`.
- Keep figures as props that slide, hop, bob and pivot (puppet tweens) — no frame-by-frame acting, no line boil.

## 6. Motion grammar
| move | GSAP | frames @24 |
|---|---|---|
| stripe bars cover | power3.out | 4 (curtain 3) |
| keyword pop | none, scale 0.4→1 | 2 |
| bars exit (staggered) | power2.in | 4–9 |
| badge / label / icon pop | back.out(1.4–1.8) | 4–5 |
| diamond badge | back.out(1.4) in, power2.in out | 5 / 4 |
| ribbon unfurl | back.out(1.5) scaleX | 6 |
| camera push / beat punch | power2.inOut | 8–22 |
| composition drift (`K.drift`) | linear scale +6–13 %, ±40–110 px | whole shot |
| 2014 flash in / out | sine.inOut / sine.in | 8 / 7 |
| 2026 word fade-unblur | power1.out | 3–4 per word, on the word |
Stagger build-ons 3–6 f on the nouns; counts land on the spoken number (`X.countUp`). Idle life: sun rays spin, clouds
and birds drift, palms sway, flames flicker, characters bob — but no constant jiggle; energy comes from cuts and moves.
Visual gag on the punchline word (podium + "?" on "second best", grumble cloud + camera shake on "Rude").

## 7. Transitions
| name | build | frames | use |
|---|---|---|---|
| X2 stripe keyword card | `K.stripeSwipe(Lfx,t,{word,hold,colA,colB})` | 4 + 2 + hold + 4–9 | new term over the host |
| X3 stripe curtain | `tReveal = K.stripeCurtain(Lfx,t)`; title card under it from t+3f, `at: tReveal-3f` | 3 + 0.45 s + 3 | into the story segment |
| stripe exit | `K.stripeOut(Lfx,t)` → `{tCovered}`; start the host scene at tCovered | 4 + 0.1 s + 4–9 | out of the segment |
| X17 soft diagonal wipe | `K.diagWipe(newSceneG,t,{frames:9–12,angle})` (new scene above the old; old ends after the wipe) | 9–12 | between story compositions (no hard cuts inside stories: source 0.7 cuts/min) |
| X17 pan across a long backdrop | one `world` group 2× wide, `X.tl.to(world,{x:0},t)` 1 s power2.inOut | 24 | same day, other place |
| X6 diamond badge | `K.diamond(Lover,t,t1,{x,y,fill,hatch,panel,icon})` | 5 / 4 | person, callback, button line |
| X16 jump cut | `X.tl.set(cam,{scale,x,y},t)` | 0 | host wide ↔ close every 5–15 s |
| X4 flash card (2014) | `K.flashCard(Lfx,t,{word|definition,field,hold})` | 8 in / 7 out | keyword/definition cards |
| X9 torn wipe (2026) | `K.tornWipe(parent,t,{color})` → `{g, content}` | 7 | into a collage graphic |
| X8 host-panel card (2026) | `K.hostPanelCard(parent,t0,t1,{title,words:[{w,t}],drawHost})` | 0 + 6 + 3/word | definition while host keeps talking |
| X10 kinetic text (2026) | `K.kinetic(parent,t,t1,'40x higher')` | ~8 | numbers over the host |
Pick ONE era per video (don't mix stripe swipes with flash cards or torn paper).

**2026 host-in-panel variant.** Hard cut to: mustard topographic border (`K.topoBorder`), the host cropped into a
torn-edge left panel (x 2–48 %), a cream card on the right (x 52–97 %) with 2–4 px drop shadows; the title fades and
un-blurs in 6 f at +0.3 s, then each word of the definition fades/unblurs (3–4 f) exactly on its VO timestamp; swap an
icon on each number word. Cut back to the full host on the next sentence. Stock clips get a small dark rounded location
pill top-left; flag stickers pop around the host with white paper borders (4 f, ~5° rotation, 6–10 f stagger).

## 8. Sound
`sound.json`: `playful-bounce` 118 BPM; energy 1 under the host, **2 from the curtain**, 3 on the climax composition
(automatic riser + impact), back to 2 for the callback, 1 for the host bookend, 0 at the button line (end hit);
`music_under_voice_db −19`, `sfx_db −3`, `lufs −14`. SFX map: whoosh on stripe cover + swoosh on bars out, pop on
badges/labels, stamp on keyword pop, slide on ribbons/podiums, ding on a revealed number/angle, error on the pink X,
boing on gags, sparkle on light/glints, riser + success on a big result, tick/type on counters, chime on the sign-off
wave. Keep gains 0.25–0.5 so the fast VO stays on top.

## 9. Build recipe
1. `cp -r assets/template <project>` (it already contains a copy of `kit.js`; refresh it from `assets/kit.js`).
   The template is a runnable 16 s demo (`make.sh <project> --draft`); its `ERA` constant switches the keyword card
   between the 2012 stripe swipe, the 2014 flash card and the 2026 torn-wipe + host-in-panel card.
2. Write `script.json`: host hook (2 lines) → cue line → story lines (15–20 words per composition) → sign-off → host
   button. Run `PYTHONIOENCODING=utf-8 ENGINE/audio/tts.py <project>`; check WPM 185–200, tune `speed`/`gap`.
3. In `scene.js`: layers `Lhost, Lstory, Lover, Lfx` (in that order). Host scene → `K.stripeCurtain` on the cue →
   `K.titleCard` → one `X.scene` per composition (build inside `K.drift(g0,t0,t1,{…})`, enter with `K.diagWipe`
   9–12 f) → `K.stripeOut` after the sign-off → host scene + `K.stripeSwipe` keyword card + `K.diamond`.
4. Put every move on a word: `X.word(id,'word')`; pops 2 f before the word.
5. `ENGINE/make.sh <project> --draft --skip-tts --workers 3` → `--stills` at each beat → fix → full
   `ENGINE/make.sh <project> --skip-tts --workers 3 --fps 24` (native 23.976).

## 10. QA checklist
- Stills: frame 0 (host visible — a scene starting at t = 0 needs `gsap.set(scene,{autoAlpha:1})`), the curtain,
  title, every composition at its END (max drift: nothing clipped, labels ≥ 96 px from edges), the keyword card.
- Metric gates: §2 target column; if scene changes > 10/min merge compositions into one palette set (the source story
  stays mint+sand for long stretches); if hard cuts > 5/min lengthen in-story wipes to 12 f.
- Do: one darker tone per shape; text only on cards/labels; verbal cue in + out; host returns ≤ 90 s.
- Don't: outlines, gradients on figures, line boil, slow dissolves (> 12 f), sentences on keyword cards, overlays on
  the host's face, real people/hosts/logos/segment names.
- Gotchas: `X.drawOn` replaces a dash pattern — use `K.drawMasked` for dashed strokes; GSAP x/y on a group that already
  has a `translate()` attribute are ABSOLUTE — wrap it (`K.g`) and tween the wrapper; never tween a group that
  `K.loop`/`K.walk` writes every frame (`fig.bob`, drift groups) — tween its parent/child instead; parallax tiles need
  2–3 px overlap to hide seams.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
