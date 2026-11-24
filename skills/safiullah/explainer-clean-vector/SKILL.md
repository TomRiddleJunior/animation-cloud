---
name: explainer-clean-vector
description: "Object-led clean-vector app/product explainer in the mid-2010s announcement idiom — one hero object (a phone or browser hub) dead centre on near-white whose cards blow up into full-bleed flat colour-field worlds and fold back, primitive-shape morphs that carry the story with no cuts (circle → pill → object, hub → paper plane, dot → logo), confetti that never stops drifting, squash/stretch, anticipation, overshoot, follow-through and arcs on every move, a palette-swap hard cut for a night/dark feature, off-screen-voice gags, fireworks finale and a dot-bounce logo resolve. Use when someone asks for a clean vector explainer, \"Reddit mobile app video style\", \"Ahrefs-style\" object/icon explainer (not character-led), \"like those 2016 app launch videos\", a hub-and-cards product tour, a feature-list app announcement, flat colour-field motion design with \"real motion principles\", or a 45–95 s friendly VO app explainer with no protagonist. For a person-with-a-problem story use explainer-flat-character instead. Builds on explainer-engine."
---
# Clean-vector hub explainer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A 45–95 s narrator-led app/product explainer in which **one hero object sits dead centre on near-white and acts as
home base**. Every topic is a card inside the hub; the card **blows up into a full-bleed flat colour field** where a
tiny icon story plays, then **folds back into the hub**. Everything is built from geometric primitives that obey
classic motion principles and **morph into each other**, so the film is one continuous canvas with at most one hard
cut (a palette swap). Confetti drifts at the edges so the frame never freezes; worlds are perfectly flat (no
gradients, glows, grain or shadows). Built from frame analysis of 2 source videos (references/sources.md); the
grammar comes from the Reddit mobile-app announcement, the outline dialect from Ahrefs. **Original work only** —
own product, brand, mascot, icons and lines; never copy logos, store badges, screenshots or taglines.

**Split rule vs `explainer-flat-character`:** a person with a problem drives the film → flat-character. A product,
an app or a list of things drives it, and the motion craft is the show → this skill.

## 1. Signature traits
- **Hub dead centre** on `#f9f9f9`: a phone ≈ 22 % W × 48 % H (250 × 520 px) with domed caps, a white screen of
  stacked cards and a thin teal cable to a 220 px ground line. The film returns to it every 2–3 vignettes.
- **Card → world blow-up (T2) and fold-back (T3)**: the card's image block *is* the seed of a full-bleed field in the
  same colour; caps fly out (expo.in) and slide back (back.out). One field colour per topic, max 4 colours.
- **Primitive morphs carry the story**: mailbox → pill → hub; hub → paper plane; dot → balloon → heart → house →
  plane → star → envelope; mailbox → dot → logo. Never a cross-fade.
- **Visible motion principles**: 2 f squash on contact (1.3/0.7), stretch on fast travel, 3–4 f anticipation before
  every launch or strike, 10–20 % back.out overshoot, lagging secondary parts (flame, string, flag), arcs only.
- **Confetti + doodles always drifting** (dots, rings, 4-point sparkles, dashes, capsules, curls; paper-plane flybys
  with dashed trails); dense "space" field in the opening, two rising side bands elsewhere, white specks in worlds.
- **One palette-swap hard cut** (day → night) with the hub in exactly the same place.
- **Gags**: an off-screen voice asks, the narrator answers, a one-word visual payoff (confetti, a rosette, a stamp).
- **Finale + resolve**: hub → launch, dashed-concentric-ring fireworks, then everything collapses to a dot that
  bounces into the logo mark; wordmark letters bounce in; 6–8 s end card on the ground colour.

## 2. Target metrics
| metric | source range (Reddit · Ahrefs) | target | sample (Postpop) |
|---|---|---|---|
| duration s | 75.5 · 91.1 | 45–95 | 70.2 |
| scene_changes_per_min | 7.95 · 1.98 (histogram blind to white-on-white morphs) | 6–10 | 8.55 |
| scene_len_median s | 5.33 · 23.2 (hand count ≈ 3.5 · 5) | 3–6 | 3.0 |
| cuts_per_min | 0.80 · 1.98 | 0–2 (palette swap only) | 0.85 (the night cut) |
| motion_mean | 4.62 · 2.89 | 3–5 | 3.9 |
| motion_p90 | 8.58 · 6.38 | 6–9 | 3.3 (deviation, below) |
| hold_frac | 0.265 · 0.337 | 0.26–0.36 | 0.35 |
| colourfulness | 61.0 · 31.9 | 30–60 | 48.7 |
| brightness / dark frames | 0.893 / 6.7 % · 0.849 / 0 | ≥ 0.85 / ≤ 8 % | 0.935 / 2.9 % |
| WPM overall | 146.3 · 135.7 | 135–150 | 135 |
| LUFS | −22.5 · −12.4 | −14 to −16 | −14.2 |
| logo tail after last VO | 7.9 s · 6 s | 6–8 s | 6.3 s |

Deviations: **motion_p90 3.3** — p90 is set by how many full-frame colour swaps there are; Reddit has ~19 vignettes,
the sample has 13 field swaps and keeps the editor/stamp/print beats inside the hub on white. Raise it with more
card → world swaps or 12 f T2/T3. **hold_frac** sat at 0.60 with a calm hub until the confetti was made to stream
(rising side bands, drifting world specks, a streaming "space" field) and every 2–3 s gap got a secondary action
(flyby, plant sway, shy envelope wiggle): white frames with only 4–10 px sine drift read as holds at 6 fps.

## 3. Script formula
| % runtime | beat | pattern / sample line |
|---|---|---|
| 0–13 | **premise** (no title card, first object by 0.5 s) | a universal truth with the brand idea as icons: "There's a tiny thrill in finding real mail in your mailbox. Not a bill. Not a flyer. Something someone picked out, just for you." |
| 13–23 | **product name → hub birth** | "That's the feeling behind Postpop. Postpop turns your phone photos into real, printed postcards." (morph into the hub, T1 split-open) |
| 23–42 | **example montage**, one world per clause | "The beach on your last night away, / the birthday cake that almost made it, / or the first tomato from your balcony." + **gag 1** (≈ 35 %) |
| 42–68 | **features inside the hub**, one per sentence | "Add a note, a doodle, and tap send." **gag 2** "Wait, do I need a stamp?" — "Nope." / "We print it, stamp it, and post it for you." / "Send one, or send it to the whole family." / "Follow it on a map, and get a ping when it lands." / "Last-minute person? Schedule cards weeks ahead." (night cut) |
| 68–78 | **quick list** 0.6–1.2 s per item (iris world + morph chain) | "Birthdays. Thank yous. Grandparents. Long-distance friends. Or just because." + **gag 3** (whisper) |
| 80–87 | **finale** | "So go on. Make someone's mailbox the best part of their day." |
| 87–100 | **resolve** (VO ends 6–8 s before the end) | "Postpop. Real mail, from your phone." |

Kokoro narrator `am_michael` speed 1.02, default gap 0.12 (Kokoro adds ~0.2 s per line, so real gaps are 0.3–0.5 s),
`lead` 0.7, `tail` 6.2 → 175 wpm speaking, **135 overall**. Gag voices per line: `af_bella`, `bm_lewis`, `af_nicole`
(whisper) at speed 1.05–1.1 with gap 0.35 before them. ~155 words for 70 s. Warm, conversational, never ad-read.
Every visual change lands on the noun (`X.word`), starting in the breath before it.

## 4. Visual system
| role | hex | use |
|---|---|---|
| ground | `#f9f9f9` (night `#1f1d2b`) | every hub scene; 85–95 % negative space |
| hub | violet `#6a4cf5`, dark `#4a31cf`, light `#a493ff`, pale `#eeebff` | phone caps, mailbox, logo disc, app bar |
| field worlds (one topic each) | sky `#2ea7f0`, sun `#f7c11a`, mint `#13d9b2`, coral `#ff6a4d` | full-bleed, flat, edge to edge |
| accents | teal `#1fcfae` (3–4 px lines: cable, ground, trails, curls), pink `#ff9fc2`, lavender `#8f9cf7` | < 5 % of pixels on white |
| ink / UI | ink `#2a2840`, bars `#cfd2d9` / `#e6e8ec`, grey text `#6d717c` | microtext bars, wordmark |
Typography: almost none. UI microtext = grey bars; labels ≥ 24 px inside UI ("send", "Delivered" in **Fredoka 600**);
end card = lowercase wordmark Fredoka 600 118 px, tagline **Nunito 600** 40 px grey, availability 30 px light grey.
Shapes: circles, pills, rounded rects (r 6–20), domed arches, triangles, stars, hearts — each object 2–5 primitives,
8–15 % of frame width, centred in its world. Line: solid-fill dialect = no outlines on solids, accent strokes 3–6 px
round caps; outline dialect = `K.outline('#0e3e7c', 5)` before building (uniform non-scaling 5 px stroke on every
`K.shape`). Never mix dialects. Texture/light: none. Composition: hub at (960, 440); world icon at frame centre;
confetti avoids the hub column (x 680–1240) and the end-card text.

## 5. Characters & objects (assets/kit.js, `window.K`)
No protagonist. Objects act; avatars are generic busts in circles.
- **Hub** `K.hub(parent, {cx, cy, w, h, capH, r, color, groundY})` → `H` with `top`, `bot` (cap groups), `screen`,
  `scrBg`, `appbarBg`, `view`, `base` (`ground`, `cable`, `plug`), `sil` (silhouette path, `H.pillD`, `H.bodyD`).
  Feed: `H.addCard({color, avatar, motif(g,cx,cy)})` (block colour = its world), `H.focus(i,t)`, `H.setFocus(i,t)`,
  `H.drift(t,dur,dy)` (idle scroll), `H.box()` (focused block, the T2/T3 seed). Pages: `H.page(name)`,
  `H.showPage(name,t)` (app-style slide), `H.setPage(name,t)`, `H.pageBox`. States: `H.closed()`, `H.resetOut(t)`.
- **World** `K.world(parent, color, {seed, specks, stream})` → `W.content` (build the icon here), `W.openFrom(box,t)`,
  `W.closeTo(box,t)`, `W.irisFrom(cx,cy,r0,t)`, `W.irisTo`, `W.show/hide`. Streaming white specks are built in.
- **Objects**: `K.mailbox` (arch box on a post; `rise`, `open`, `close`, `flagUp`, `flagDown`), `K.envelope`,
  `K.plane` (paper plane, pointing right), `K.postcard` (photo + lines + `stampAt`), `K.stamp` (perforated),
  `K.avatar`, `K.pin`, `K.cloud`, `K.mark` (logo disc + tilted stamp; `stamp`, `sun` parts), `K.wordmark`.
- **Paths** `K.P.*` (all cubic/line, morph-ready): `circle ellipse rrect(x,y,w,h,rTop,rBottom) pill heart star
  sparkle house balloon plane planeWing pin loaf wave`.
- Build order per object: silhouette lands → details pop (2 f stagger) → secondary lines draw → confetti if payoff.
  Scene-specific props (cake tiers, tomato plant, bee, rosette) live in scene.js and follow the same rules.

## 6. Motion grammar (24 fps; `K.F(n)` = n frames)
| move | kit call | GSAP ease | frames |
|---|---|---|---|
| pop in | `K.popIn(el,t,{rot})` | back.out(2.4) (+ rotation settle) | 9 |
| pop out | `K.popOut` | back.in(2) | 6 |
| land | `K.land(el,t,{dy,fall})` | power2.in fall (stretched 0.84/1.22) → squash 1.3/0.7 → elastic.out(1,0.42) | 6–7 + 2 + 12 |
| squash | `K.squash(el,t,{sx,sy,origin})` | power2.out → elastic | 2 + 12 |
| hop | `K.hop(el,t,{h})` | anticipation squash → power2.out up → power2.in down → squash | 3 + 6 + 5 + 2 + 10 |
| launch | `K.launch(el,t,pts,{back})` | counter-move + squash, then motionPath power2.in | 4 + 14 |
| arc travel | `K.arc(el,t,dur,pts)` (offsets from start, curviness 1.25) | power1/2 | 12–18 |
| morph | `K.morph(el,d,t,dur)` | power2.inOut (back.in for collapses) | 6–10 |
| line draw | `K.draw / K.undraw / K.dashed(...).draw/erase` | power1.inOut / none | 6–12 |
| shake / wobble | `K.shake(el,t,{n,a})` | sine.inOut → back.out | 2–3 per swing |
Stagger: cards 3 f, details 2 f, confetti births 1 f, list items 0.6–1.2 s. Holds: a built world holds 1.5–4 s, but
fill any gap > 2 s with a secondary action (sway, hop, flyby, bee, wiggle). Idle: `K.bob` on a wrapper (never on an
element GSAP also moves), confetti `stream`, `H.drift`. Secondary parts lag 2–4 f (flame rotation, balloon string
`X.every` with a phase lag, flag overshoot).

## 7. Transitions
| # | name | build | frames | use |
|---|---|---|---|---|
| T1 | hub split-open | `H.sil` pill lands (`K.land`/morph), then `H.splitOpen(t)`: caps out back.out(1.6), screen scaleY, cable shortens, cards pop | 7 + cards | hub birth |
| T2 | card blow-up | `H.focus(i)` then `H.blowUp(world,t)`: 2 f squeeze, caps fly ±780 expo.in, clip grows from `H.box()` | 10 | house transition |
| T3 | fold back | `H.collapse(world,t)`: clip shrinks, content scales into the card, caps back.out(1.25) | 9 | every 2–3 vignettes |
| T4 | push-through | `H.pushThrough(world,t)`: hub ×2.3 expo.in, scaled card becomes the world | 11 | 1–2× (map) |
| T5 | close → dot → iris | `const d = H.closeToDot(t)` then `W.irisFrom(d.x,d.y,d.r,d.t)` | 9 + 12 | into a quick list |
| T6 | world → world iris | the world's round object (sun) is the iris: `NEXT.irisFrom(sunX,sunY,sunR,t)` | 12 | beach → cake |
| T7 | morph chain | `K.morph` one path through `K.P` shapes, details pop/undraw between | 8 per step | quick lists |
| T8 | hub → object | `H.morphTo(d,t)`: screen fills (2 f), body silhouette morphs; swap to a free object group after | 12 | finale |
| T9 | collapse → logo | morph to `K.P.circle(...,22)` back.in, hop + squash + teal trail, `K.mark` scales from 0.2 back.out(1.7), `K.wordmark` | ≈ 24 + 1 s | end |
| T10 | landing dust | `K.puffs(parent,x,y,t)`: lilac puffs balloon, teal curls draw/erase | 7 + 18 | heavy landings |
| T11 | emission | `emerge()` pattern in the sample: pop out of a point (door, slot) and arc away | 10–18 | opening, sends |
| T12 | palette-swap cut | `tl.set` ground/screen/cell fills + swap confetti layer for stars at one frame, layout unchanged | 0 | the only cut |
| C1 | idle field | `K.confetti({stream})`, `K.flyby`, `K.bob`, `H.drift` | continuous | always |

## 8. Sound
`sound.json`: `playful-bounce` (pizzicato) 120 bpm; sections 1 → 2 at the hub birth → 1 for the night feature → 2
for the list → **3 on the finale** → 0 at the logo (`end_hit`); `music_under_voice_db -16`, `duck_db 9`, `sfx_db -4`,
`lufs -14`. ~2 SFX/s during builds (kit calls add most of them): pop per primitive, whoosh per T2, swoosh per T3 /
arc, boing on landings and flag flips, thud/stamp on heavy contacts, zoom_in on irises, slide on scrolls/page swaps,
click on taps, ding on notifications, sparkle on confetti bursts, riser before the finale launch, chime on the logo,
tick/tock for nervous shakes, paper for flyers.

## 9. Build recipe
1. Copy `assets/template/` to the project (it holds `kit.js`, `index.html` with GSAP + MorphSVG + MotionPath).
2. Write `script.json` from §3 (one line per vignette; gag lines with their own `voice`), run
   `engine/make.sh <p> --draft --fps 24 --workers 3` once to get `data/vo.json`, then lay out every beat on `X.word`.
3. Layers back → front: ground rect, confetti, back (objects that hide behind the hub, flyby trails), hub, front,
   worlds, fx (bursts/rings), ui (end card).
4. Opening: dense streaming field + the brand-idea object acting (mailbox emitting mail). Morph it into `H.sil`,
   land, rise on the cable, `H.splitOpen`.
5. Per example: `H.focus` → `H.blowUp(W)` → build the icon in `W.content` (land/pop/draw, one secondary action) →
   next world by iris or `H.collapse` (always `H.setFocus` the matching card while covered).
6. Features inside the hub: `H.showPage` pages built at `H.pageBox` coordinates; put a page block at `H.box()` when
   it must blow up or push through. Night = T12 cut. Quick list = T5 + T7. Reset hidden state while covered
   (`H.resetOut`, `H.setPage`, palette back to day).
7. Finale `H.morphTo` + launches + `K.rings`/`K.burst`, then T9 and a 6–8 s end card.
8. `node engine/render.mjs <p> --stills …` at every beat and LOOK; full render `make.sh <p> --fps 24 --workers 3`.

## 10. QA checklist
- Stills: hub centred with confetti clear of it; each world shows exactly one centred icon; text ≥ 24 px in UI;
  nothing clipped; end card mark + wordmark + tagline readable.
- Metrics: scene changes 6–10/min, cuts ≤ 2/min (only the palette swap), motion 3–5, hold ≤ 0.36, colourfulness
  30–60, brightness ≥ 0.85, WPM 135–150, LUFS ≈ −14. To find dead stretches, profile holds per 2 s the way the
  analyzer does (mean grey diff of 160×90 frames at 6 fps; < 0.4 = hold): a window with ≥ 80 % holds needs a
  secondary action.
- Do: return to the hub every 2–3 worlds; land changes on nouns; one colour per topic; squash on every contact.
- Don't: cross-fade, slide things in linearly, add gradients/shadows/glows, put a protagonist in charge, mix
  outline and solid dialects, use > 4 field colours, subtitle the VO, copy a real app's UI, mascot or badges.
- Gotchas: MotionPath `relative:true` means relative to the *previous point* — `K.arc/K.launch` convert offsets from
  the start for you (`K.deltas`); a `<g>` with a transform attribute loses it when GSAP tweens `y` (wrap it);
  `autoAlpha` overrides an `opacity` attribute (use rgba fills for translucent shapes); worlds opened by iris must
  close with `closeTo` (it zeroes the circle clip).

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
