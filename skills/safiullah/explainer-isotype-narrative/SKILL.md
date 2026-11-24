---
name: explainer-isotype-narrative
description: "Makes the ISOTYPE-pictogram system explainer, the format popularised by \"The Crisis of Credit Visualized\" (Jonathan Jarvis, 2009). A cast of cream silhouette pictograms (detached round heads, houses, columned banks, coin stacks, ledger cards) and their physical proxies sit on ONE radial-vignetted green field. The film runs as a single take with zero hard cuts: flow chains grow clause by clause, glove hands reach in on long arms, money tags count in blocks, heavy slab capitals slam in from camera depth, the camera dives through a letter, a smoke puff does the \"financial magic\", there is one inverted white-ground segment and one dark segment, a starburst wipe follows, and the loop closes on the title phrase under a heraldic crest. A calm narrator speaks at about 127 WPM over a beat that never stops. Use it for \"Crisis of Credit style\", \"isotype / pictogram explainer\", \"infographic narrative\", \"explain how a system works with flows between actors\", \"money flow animation\", \"how banks / insurance / payments / supply chains work\", \"Jonathan Jarvis style\", or \"the explainer that started the craze\". Builds on explainer-engine."
---
# Isotype narrative (pictogram system explainer)

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

This style explains **how a system works** in one patient take. Every actor group gets one anonymous cream pictogram
and every abstraction gets one countable physical proxy: a loan is a card, a deposit is a ledger card with a block
tag, reserves are a coin. The system is drawn as a flow chain (actor, thick bar, actor) that grows with each clause,
moves objects along itself, reveals a new actor with a camera tilt, and finally bends into a closed loop. Everything
happens on one vignetted green field, broken only by a short white "scheme" segment and a short black "collapse"
segment. The skill was built from a frame analysis of 1 measured source video plus 1 poster-only reference
(`references/sources.md`, full analysis in `references/analysis.md`). All output must be original: never trace the
source's crest, proxies or lettering.

Sample: `the sample film (the render is not included in this repository)`, "The Making of Money" (74.8 s). It shows how a
commercial bank creates a deposit by lending, how payments settle in central-bank reserves, what limits lending,
and how repayment destroys the money.

## 1. Signature traits
- **One field for the whole film.** A dithered radial vignette, bright lime centre (#86bd2f) falling to olive-black
  corners (#384c19). About 27 % of pixels sit near the corner tone. No other background ever appears, apart from one
  white segment (iris in and out) and one black segment.
- **Cream ISOTYPE cast.** People have a detached circular head (diameter ≈ 0.16 of height), rounded slab torso, and
  arms separated from the torso by a hairline gap. There are no faces, no outlines and no second figure colour. A
  family of four with its dog recurs. Each pictogram is ONE path with one top-light gradient, and holes are cut
  through so the field shows inside.
- **Physical proxies with relative quantity.** Money is a dark-green tag of cream blocks, so amounts are shown by
  block count (no invented statistics). Proxies are counted, stacked, passed, shrunk and popped.
- **The flow chain is the backbone.** Each "pays / moves / settles" clause gets a bar with an arrowhead, an object
  travelling along it and a consequence, followed by a hold.
- **Focus-in entrances.** Things arrive blurred (12 px) and sharpen over 9 f. Slab words slam from 7× depth in 4 f.
- **Glove hands.** Long cream arms end in white cartoon gloves that reach in from the nearest edge to point, stamp
  or present an object.
- **Chapter cloud.** A tiny narrator figure at top-right sends up a dotted thought trail. A white cloud settles at
  top-left and stays for the whole chapter.
- **No cuts ever.** Changes happen by whip-pan, vertical drop, pull-back or tilt, dive-through-letter, smoke puff,
  white iris, go-dark and starburst.

## 2. Target metrics
| metric | source (Crisis of Credit, 11 min) | target for 60–75 s | sample (74.8 s) |
|---|---|---|---|
| hard cuts / min | 0.00 | **0** | **0.00** |
| scene changes / min | 2.51 | 4–6.5 (see deviation note) | 6.42 |
| scene_len_median | 7.0 s | 5–8 s | 5.5 s |
| motion_mean / p90 | 2.94 / 7.96 | 2.5–4 / 6–9 | 3.41 / 6.1 |
| hold_frac (6 fps) | 0.354 | 0.35–0.48 | 0.452 |
| colourfulness | 48.9 | 44–52 | 46.0 |
| saturation | 0.595 | 0.58–0.66 | 0.646 |
| brightness | 0.535 | 0.51–0.56 | 0.550 |
| dark frames | 7.8 % | 3–8 % | 4.0 % |
| WPM overall | 127.1 | 120–135 | 125.2 |
| LUFS | −21.3 (old upload) | −15 to −16 | −15.7 |
| silence | 0 s | 0 s (music never stops) | 0 s |
| palette (k-means) | #435a1b 27 % · #5e7f21 25 % · #79a826 22 % · black 7 % · cream 6 % · white 6 % | same families | #587920 20 % · #48651c 19 % · #7fae2c 18 % · cream 7 % · white 7 % · black 4 % |

**Deliberate deviations.**
1. *Scene changes/min.* The QA counts every colour-histogram jump, and this formula has 7–8 compulsory ones: the
   crest starburst, the dive through the letter, the T8 smoke puff, white iris in, white iris out, go-dark, the
   starburst and smoke after the dark, and the final fade. The source spreads these over 11 minutes, while a 75 s
   film carries all of them. Do not drop formula beats to chase 2.5/min. Do start go-dark late enough (on the
   sentence's last noun) that dark and starburst sit within about 1.5 s of each other.
2. *hold_frac.* The source's "near-hold" frames partly come from a soft, noisy 2011 re-encode, so a clean render
   holds harder. The kit handles this with `IK.creep` (a linear push of 0.6–1 %/s on each set, invisible as a move)
   plus `IK.hover` on floating props. Prop hovers alone hardly move the metric, because only motion of the whole
   content registers. Never add grain to game it; the analysis says the style has none.

## 3. Script formula
Beat map for 60–75 s (the source's structure compressed; % of runtime):

| % | beat | picture (kit) |
|---|---|---|
| 0–5 | **heraldic title**: the narrator says the title | `IK.crest` builds medallion → keys → pediment → flank houses/coins → laurels → ribbon (on the title's last words) → stars; hold; `IK.burst` + `IK.smoke` |
| 5–12 | **question cascade**: "Where does X come from?", then a one-word verdict | `typeLine` question emerges from the smoke → everything blurs away except "?", which flies to centre ×3.4 → "?" flips into "$" → verdict letters slam one per frame-triple ("LOAN$!", with $ standing in for S) |
| 12–17 | **jargon named, to be decoded** ("You've heard the words: …") | type wall of 50–60 jargon words (mixed slab/condensed, some upside-down) pops in 0.7 s; spoken terms slam over it; `IK.dive` through the O |
| 17–23 | **who? → one-word answer; how? → "here's how"** | small slab question + 2-word slam stack; thought trail + two white clouds; glove arm points; `IK.whipOut` |
| 23–37 | **cast and proxies** | family + dog, banks drop in, builder + house + FOR SALE; then the proxy beat: 1 coin stack vs 11 ledger cards, push in on one card, a tag types its blocks |
| 37–55 | **chapter 1: the mechanism** (chapter cloud stays) | ask: bar + application card travels; glove stamps it; **smoke-puff magic**: deposit card + LOAN card appear, tags fill; pull-back to untouched savers; slam "BRAND-NEW / MONEY" |
| 55–71 | **the flow chain** | whip into the 4-actor row; per clause: bar → object travels → consequence (FOR SALE→SOLD); camera tilts down to reveal the central bank; L-routes; reserve coin travels A → CB → B |
| 71–80 | **the turn / the rules** on the **white ground** | corner figure asks in a speech bubble; cards multiply; `IK.iris` to white; the chain as small green icons + three limits with labels and dotted links; iris closes to a point |
| 80–87 | **collapse**: the thing disappears | "YEARS" + stopwatch drop; blocks fly and pop; go-dark; glowing dots; starburst + smoke wipe |
| 87–100 | **the loop closes on the title phrase** | 4 stations on a ring, an arc grows per word, the last arc closes it; the ring turns with stations upright; the crest reassembles in the middle; fade to black; credits as green slab caps on black |

- **Hook pattern.** The title is spoken, then questions are answered in one word each. Name the jargon so the film
  can promise to decode it. No character appears before about 23 % of runtime.
- **Sentence templates.** "Meet the cast: …", "X asks Y for …", "Then X pays Y. The Z moves to …", "So what stops
  …?", and a final loop of 4 one-word verbs ("Lend, spend, settle, repay. Round and round.") followed by the title
  phrase as the last line. There is no CTA.
- **Voice.** Kokoro `am_michael`, speed 1.0 (≈ 162 WPM while speaking), lead 1.2, tail 3.0, gaps 0.35–0.75 s, and
  a 1.5 s gap after the title for the crest burst. Overall WPM is 125. Keep it plain, measured and lightly wry
  ("then types the amount into their account").
- **Facts.** Only use mechanics you know solidly. Show quantities as block or pictogram counts, never as
  invented figures.

## 4. Visual system
| role | hex | use |
|---|---|---|
| field centre → corners | #86bd2f · #7cad29 · #628624 · #4a661e · #3f561b · #384c19 | `IK.field` (rasterised, dithered, r = 0.7 W, centre at 46 % H) |
| pictogram cream (gradient) | #f1ebca → #e4daaa → #cbc483 | `IK.creamFill` on every figure/prop |
| tan | #c9c37e | ribbon tails, wall words, stamp |
| white | #fcfcfb | clouds, bubbles, gloves, the inverted ground |
| ink (green on white / in clouds) | #4b7a1e (gradient #5a8c24 → #41701a) | `fill: 'ink'` pictograms, cloud text |
| tag dark green | #2d4a12 (gradient #365a17 → #26400f) | money tags, labels on cream |
| explosion | #ffe81a + #fff7a8 + white core | `IK.burst` only |
| smoke | radial #f3efd9 → #c9c3a0 | `IK.smoke` only |
| black | #050703 | go-dark, final fade, credits |

No other hues. A prop that "needs" brown or red is wrong; use tan or tag-green.

**Type.** Slab words: Archivo Black (the engine's stand-in for varsity/slab capitals), letter-spacing 0.05–0.09em.
Use 120–190 px for slams and 52–56 px for question lines. Clouds, bubbles and labels: Barlow Condensed 700, caps,
36–46 px in clouds and 28–36 px for labels under objects. Credits: Archivo Black, 24 px small-caps line over 44 px.
Text density is low: nouns, numbers, chapter names and one-word slams only.

**Composition.** The main group sits in the bright centre third. Chains run horizontally across 60–90 % W at 45–60 %
H. Chapter cloud at top-left, narrator figure at top-right. Keep a 96 px safe margin (watch the dog at the left of a
family row). Featured figures are 280–320 px tall, chain figures 190–250 px, crowds or savers 130–230 px, and icons
on white 90–160 px.

## 5. Characters & objects (kit.js, namespace `IK`)
All builders take `(parent, {x, y, h | w, fill, shadow})`. (x, y) is the **feet / baseline centre**; `h` is height
in px for people and `w` is width in px for props; `fill: 'ink'` makes the green-on-white version.
- People: `IK.man`, `IK.woman` (dress trapezoid), `IK.child` (raised arms, big head), `IK.dog`, `IK.builder` (hard
  hat + pocket slot), `IK.family({x, y, h, noDog})` → `{g, members, man, woman, child, dog}`.
- Buildings: `IK.house` (2×2 window holes + door notch + chimney), `IK.bank({label})` (pediment with oculus, 4
  columns, steps, cream label below), `IK.centralBank({labelBelow})` (dome + lantern + 6 columns).
- Proxies: `IK.card({kind: 'deposit'|'loan'|'apply'})`, `IK.tag({slots, start, h})` with `.show(t)` (extends, T12),
  `.fill(t, n, step)` and `.drain(t, n, step)`, `IK.coins` (cash stacks), `IK.coin({text: 'R'})`, `IK.sign({text})`
  (swap `.txt` textContent with `tl.set`), `IK.check`, `IK.bricks`, `IK.dial` (`.needle` swings),
  `IK.stopwatch` (`.hand`).
- Hands: `IK.arm({x, y, angle, s, len, kind: 'point'|'fist', t, tOut})`. (x, y) is the fingertip or fist; `angle`
  is the direction the arm runs off-screen (0 = from the right, 90 = from below, −90 = from above, 160 = from lower
  left). Draw held objects into `arm.held` in hand space (−x points away from the arm). Press by tweening `arm.slide`
  x by −40 px.
- Type and clouds: `IK.text`, `IK.typeLine` (types from a fixed left edge), `IK.slam(parent, [{text|el, t, x, y,
  size, from}])`, `IK.cloud(parent, text, {x, y, size})`, `IK.trail` (thought dots), `IK.chapter(parent, title, t,
  {tOut})`, `IK.bubble(parent, text, t, {x, y})` (tail at (x, y); the bubble sits to its left).
- Emblem: `IK.crest(parent, t0, {cx, cy, scale, l0, l1, l2, tRibbon})` → parts `{med, rib, keys, ped, flank,
  leaves, stars}`. Remove parts when you rebuild it smaller inside the closing loop.
- Construction rules for new pictograms: add a function to `IK.D` that returns ONE path string from `IK.P.rect /
  circle / ellipse / cap / poly / dome`, drawn clockwise; holes take `hole = true` and must sit over single coverage.
  The figure lives in a 100-unit box with its feet at (0, 0). Then register its unit width in `IK.make`.

## 6. Motion grammar
| move | GSAP | frames | notes |
|---|---|---|---|
| focus-in (signature) | `power2.out`, blur 12→0, scale 0.94→1 | 9 | `IK.focusIn`; stagger cast 3–4 f |
| pop | `back.out(1.8)` + blur 6→0 | 8 | `IK.popIn`; small props, tags, labels |
| slam word | `expo.in`, scale 7→1, blur 10→0 | 4 per word | lands ON the stressed syllable; 3 f between letters of a word |
| bar grows | `power2.inOut` | 8–9 | arrowhead pops at the end |
| object travels | `power2.inOut` along a curve (MotionPath, curviness 1.1–1.2) | 14–30 | coin uses `power1.inOut`, 30 f |
| whip-pan out | `power3.in`, x −1920, horizontal blur to 60 | 4 | the next set focus-ins (no whip-in needed) |
| vertical drop / lift | `power3.out` / `power3.in` with blur | 6 / 3 | swaps and banks arriving |
| pull-back / tilt | `power2.inOut` on an `X.cam` group | 15–16 | reveals savers or a new actor below |
| glove arm | `back.out(1.15)` in, `power3.in` out | 11 / 10 | overshoot ≈ 5 % |
| creep (idle) | `none`, scale +0.6–1 %/s on the X.scene group | whole set | keeps holds alive |
| hover (idle) | sine, 4–7 px, 0.45–0.7 Hz | — | floating cards, clouds, tags; child bounce 1.1 Hz |

Build order per clause: actor → label/tag → bar → travelling object → consequence, then **hold 1–3 s** while the
sentence ends. A build lands on its noun or verb, 2–4 frames early.

## 7. Transitions (no cuts; each built so the hard-cut detector stays at 0)
| # | name | kit | frames | when |
|---|---|---|---|---|
| T1 | heraldic crest build | `IK.crest` | ~3 s + hold | open; rebuilt small in the closing loop |
| T2 | starburst wipe | `IK.burst` (power3.out, 8 f; expo.out in 6 f reads as a cut) + `IK.smoke` | 30–40 | after the crest; out of the dark |
| T3 | slam stack | `IK.slam` | 4/word | verdict word, spoken terms, "BRAND-NEW / MONEY" |
| T4 | dive through a letter | `IK.dive(group, counterX, counterY, t, {scale: 48})` | 10 | ends the jargon wall |
| T5 | whip-pan | `IK.whipOut` + next set `IK.focusIn` | 4 + 9 | topic change |
| T6 | vertical drop / lift | `IK.dropIn` / `IK.liftOut` | 6 / 3 | cast → proxy, YEARS swap, banks arriving |
| T7 | pull-back / tilt | `IK.pullBack(cam, t, {scale, x, y})` | 15 | reveal savers, the central bank, push into a card |
| T8 | smoke-puff magic | `IK.smoke` in the fx layer, swap at `sm.tFull` | 35 | "types the amount" |
| T9 | speech bubble | `IK.bubble` | 6 + text | corner figure asks |
| T10 | chapter cloud | `IK.chapter` | 24 | each chapter |
| T11 | glove arm | `IK.arm` | 10–11 | point, stamp, present |
| T12 | money tag | `tag.show` + `tag.fill` | 5 + 2/block | every worked quantity |
| T13 | flow chain | `IK.bar`, `IK.route` (L-shapes and loop arcs via `d`), `IK.travel` | 8 per bar | the backbone |
| T14 | white ground | `IK.iris(layer, x, y, t)` open, later `{el, open: false}` | 13 + 13 | the scheme / rules segment (~5–8 % of runtime) |
| T15 | go dark | `IK.dark(bg, t, {el: darkRect, dur: F(12–24)})` + dim the set to 0.3 + glowing dots | 12–24 | the collapse |

Layer stack: `bg` (field + dark rect) → `world` (green-field sets) → `whiteL` (iris circle) → `whiteW` (ink set) →
`ui` (chapter cloud, bubbles) → `fx` (smoke, bursts) → `top` (final fade, credits).

## 8. Sound
`sound.json`: `{"preset": "lofi-piano", "bpm": 86, "key": -3, "music_under_voice_db": -15, "sfx_db": -5, "duck_db": 6,
"lufs": -15.5}`. At energy 3 this gives a downtempo beat (e-piano, bass, kick/snare, hats) that stands in for the
source's DJ beat. Sections: 2 (crest) → 3 at the first burst (the engine adds riser + impact) → 2 for the
mechanism → 1 for YEARS/dark → 3 at the closing starburst → 0 at the fade, where the end hit lands. Music never
drops to silence before the end.
SFX map: `pop` on pictogram focus/pops (gain 0.2–0.3), `thud` on slams, `whoosh` on whips/lifts, `swoosh` on glove
arms and travels, `type` on typed lines (every 3rd letter), `blip` per tag block, `bubble` on thought trails,
`stamp` on the stamp, `coin` + `ding` for the reserve coin, `sparkle` on new money and on the disappearance,
`tick`/`tock` on the stopwatch, `zoom_in`/`zoom_out` on dives and irises, `impact` + `thud` on starbursts, `drop`
on vertical drops.

## 9. Build recipe
1. Copy `assets/template/` (index.html with MotionPathPlugin, kit.js, scene.js, script.json, sound.json) into a new
   project. Pick a system whose mechanics you know accurately, with 3–5 actors.
2. Write script.json from the beat map (about 150 words for 72 s), then run `ENGINE/make.sh <proj> --draft` once to
   get `data/vo.json`. Retune `speed` and gaps until duration ≤ 75 s and WPM is 120–135.
3. In scene.js, add one `X.scene` per set in the right layer, and anchor every tween with `X.word(id, 'word', nth)`.
   Note `nth` for repeated words ("the", "bank").
4. Per beat: crest (`IK.crest`, `IK.burst`, `IK.smoke`) → question (`IK.text` start-anchored + `X.typeOn`, a "?"
   element, `IK.slam`) → wall + `IK.dive` → who/how (`IK.typeLine`, `IK.slam`, `IK.cloud`, `IK.arm`, `IK.whipOut`)
   → cast (`IK.family`, `IK.bank`, `IK.dropIn`) → proxies (`IK.card`, `IK.tag`, `IK.pullBack`) → chapter
   (`IK.chapter`, `IK.bar`, `IK.travel`, stamp arm, `IK.smoke` swap, pull-back, slam) → chain (bars, travels,
   `IK.route`, `IK.coin`) → white (`IK.iris`, ink icons, `IK.trail` dotted links) → dark (`IK.dark`, glowing dots,
   `IK.burst`) → loop (ring of stations, arcs via `IK.route(…, {d})`, ring + station counter-rotation, small crest)
   → fade + credits.
5. Add `IK.creep` to every set group and `IK.hover` to floating props.
6. Render stills at every beat (`render.mjs --stills`), tile them, look, and fix collisions. Then run
   `ENGINE/make.sh <proj> --workers 3` and compare `out/qa/metrics.json` with §2.

## 10. QA checklist
- Stills: crest at ~2.8 s (nothing visible at frame 0 except the field), the question line, the slam, the wall, the
  cast row (dog inside the safe area), the push-in (tag not over a neighbour card), every chain clause, the white
  segment, the dark, the loop mid-turn (labels stay outside the ring), credits (columns apart).
- Metrics gates: cuts/min = 0; motion 2.5–4; hold ≤ 0.48; brightness 0.51–0.56; colourfulness ≥ 44; WPM 120–135;
  LUFS −15 to −16; silence 0.
- **Hard-cut detector:** any one-frame change over about a third of the frame registers as a cut. Keep starbursts at
  8 f power3.out, irises at 12–13 f power1.inOut, fades ≥ 12 f, and whip/lift only the content, never the field.
- **Seekable timeline:** use `fromTo` with `immediateRender: false` for every later tween; never use relative
  (`+=`) values in fromTo (read the base with `gsap.getProperty` at build time instead, as the kit does); hide
  anything that tweens opacity in at build (`gsap.set(el, {opacity: 0})`); call `gsap.set(firstScene, {autoAlpha:
  1})`. Typed text must be start-anchored, or it re-centres as it types.
- Do: one field, one cream, one proxy per concept for the whole film, a hold after each build, chapter cloud per
  chapter, glove for every hand-over, title phrase as the last line.
- Don't: cut; add faces, outlines or new hues; show an abstraction as text when it can be a card, coin or tag;
  animate limbs; put a sentence on screen; invent statistics; copy the source's crest, proxies, signposts or
  lettering; add grain; add a CTA or logo sting.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
