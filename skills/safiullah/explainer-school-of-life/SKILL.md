---
name: explainer-school-of-life
description: "Calm philosophical / psychological essay films in the format of The School of Life — an essayist's voice, one literal drawn metaphor per sentence, hand-drawn animation on twos (12 drawings/s, paper and line boil), numbered chapter cards (\"-1-\" + serif title on a saturated wavy-edged colour field), long pauses, a very quiet piano bed and a quiet ending card. Use when someone asks for a School of Life style / \"like The School of Life\" / Alain-de-Botton-style essay animation, an illustrated essay, emotional-intelligence or philosophy explainer, consoling \"why we feel X\" film, numbered-rules or \"signs that…\" list film with drawn metaphors. Builds on explainer-engine."
---
# School of Life — illustrated essay film

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A slow, consoling lecture illustrated by one picture-book artist: an essay voice states a universal truth about inner
life while a single flat, outlined figure on a paper ground acts out a literal metaphor, sentence by sentence; numbered
chapter cards wipe in on saturated colour fields; nothing moves fast; the mix is quiet. Built from frame analysis of 3
source films (references/sources.md, details in references/analysis.md). **The three films each credit a different
animator — the constant is the FORMAT, not one look.** This skill makes the format the core and ships one coherent look
("ink & cream", the flat-outlined-figure mode) as a swappable layer (`K.LOOK`, `K.C`, `K.FIG` in assets/kit.js).
Original work only: own topic, own characters, own sting and ending — never the channel's ident, product squares,
shop/subscribe card, texts, or a commissioned artist's characters.

## 1. Signature traits
- **Format:** ≤ 3 s original sting → title → first words by ~3 s → one universal claim + a concrete list → 2–4
  numbered chapters (card read aloud: "One. The evidence.") → a consolation that reframes → quiet end card.
- **One literal metaphor per sentence**, held 2–6 s: a giant ticket held overhead with an afternoon inside, a head full
  of framed memories, a stone pinning down fluttering papers, a memory balloon tied to a pebble, a door with the sea behind it.
- **On twos**: every tween, pose and camera move is sampled at 12 drawings/s (render 24 fps → each drawing held 2 frames);
  paper fibre re-boils each drawing; ink lines boil (displacement 2 px).
- **Flat outlined figures**: tube limbs with soft joints, very long legs, tiny head (≈1:8), single-line face
  (eyebrow→nose stroke, dot eyes), flared trousers, one cloth flutter (a scarf) as the only idle life.
- **Paper grounds + flat colour sets** (cream, dusty rose, lilac, sage) with a 15–25 % corner vignette; no gradients,
  glows, 3-D or shadows. Saturated colour is saved for the chapter-card fields.
- **One serif keyword** per scene, set on the spoken noun ("Clutter", "Memory"); no subtitles, no bullets.
- **Quiet**: −21 LUFS, a sparse e-piano bed at energy 1, almost no SFX (paper on card wipes, a soft pop or click).

## 2. Target metrics
| metric | source range (3 films) | target | sample (`samples/school-of-life`) |
|---|---|---|---|
| duration | 447–476 s (channel median now 263 s) | 60–75 s for a sample | 73.6 s |
| cuts/min (hard) | 0.13–2.44 | ≤ 2.4 | 2.45 (card 1 in/out + 1 hard cut) |
| scene changes/min | 1.76–5.91 | ~6 | 8.2 (see note) |
| scene_len median | 6.8–23 s | ≥ 3.5 s | 3.5 s |
| motion mean / p90 | 3.2–4.4 / 7.4–9.8 | 3.2–4.5 | 4.35 / 12.6 |
| hold_frac | 0.09–0.38 | 0.1–0.35 | 0.16 |
| animated_frac | 0.99–1.0 | ≥ 0.95 | 1.0 |
| colourfulness | 45–46 (flat modes), 88 (neon numerals) | 35–50 | 38 |
| brightness | 0.72–0.73 (light modes) | 0.70–0.75 | 0.72 |
| WPM overall | 139–150 (speech span 143–164) | 135–150 | 133 (speech span 145) |
| LUFS | −20.0 to −24.7 | −21 | −20.9 |

Deliberate deviations: **scene changes/min** — every chapter card is two scene changes (in + out); three numbered
chapters in a 74 s film give ~5/min from cards alone (the sources have 9 cards in 7.5 min). Keep cards, keep everything
else card-free. **WPM** — in a 75 s piece the sting, title and end card are 10 % of runtime; bm_george at 1.04 speaks
~175 wpm, so with 0.5–0.9 s pauses the overall reads ~133 while the speech span is in range. For 139+ run longer
(≥ 2 min) rather than cutting the pauses. **Colourfulness** — the sample keeps chapter 3 + ending on plain cream (the
"travelling light" return); put more of the film on colour sets to reach 45.

## 3. Script formula
| % runtime | beat | how |
|---|---|---|
| 0–4 | sting | `K.dotSting` (rows of dots build, stack pushes up, zoom out, dots shrink) → `K.wipeUp` colour field → title in a scalloped frame |
| 4–20 | hook | sentence 1 = an intimate universal claim the viewer recognises ("Nearly all of us keep a small museum that no one else would want to visit."); sentence 2 = a concrete triad, one object per clause |
| 20–90 | 2–4 chapters | card line read aloud ("Two. Holding on.") + 3–4 sentences; each: aphorism, then a qualifier that complicates it; paradox and gentle humour allowed |
| last chapter | consolation | the reframe ("Yet the object was never the memory. It was only a door.") + a soft imperative ("Keep the few things that still open something.") |
| 95–100 | end card | silent hold 2–3 s: scalloped frame, serif title, one italic line, a bird crossing. No brand, no shop, no subscribe |

Voice: Kokoro **bm_george** (or bm_lewis), `speed` 1.0–1.04, `lead` 2.6, `tail` 3.0–3.4, `gap` 0.5–0.6 inside a
chapter, 0.9 before a card line, 0.6–0.8 after it. Second person / inclusive "we", no statistics, no quotes. 160–170
words per 75 s. Read the card titles aloud (the sources do).

## 4. Visual system
| role | hex | use |
|---|---|---|
| paper | `#E7E1D7` (+ X.paper blotches + re-boiled fibre ⇒ ≈ `#DCD4CA` on screen) | ground, vignette `#3c2a1c` @ 0.26 corners |
| ink | `#1A1612` | all outlines 6 px (8 px in medium shots), round joins |
| sets | rose `#DDB09C`, lilac `#BEA8D2`, sage `#ADBB84`, floor bands olive `#4E7225` / grass `#6E8B3D` / dark `#3A463A` | one set per chapter |
| figure (Ada) | jumper ochre `#C49A45`, trousers terracotta `#A24530`, scarf periwinkle `#7B77CC`, skin `#F3EBE0`, hair ink | protagonist |
| figure (stranger) | brown `#6F392C`, dark olive `#3A463A`, periwinkle shoes, glasses | second character |
| props | lilac `#B49AC8`, red `#B1393A` (keys), stone `#8E96A0`, ticket `#F4EADA`, tan `#B18B52` (frames) | |
| card fields | ultramarine `#3625D2` (+ coral title `#EF5B45`), terracotta `#A24530` (+ cream), lilac `#B49AC8` (+ white, red squiggle `#BB0019`) | chapters |

Type: **Libre Baskerville Bold** (engine font) — card "-n-" 104 px over title 118 px, centred at y 440/600; title card
104 px in ultramarine; keywords 72–84 px; end title 78 px + italic 40 px. Composition: ground line at y 960 (89 %),
one subject, 40–60 % negative space; medium shots put the feet off-frame (`y: 1220, s: 1.42`).

## 5. Characters & objects (assets/kit.js)
- `K.figure(parent, {type:'woman'|'man', pose, colors, dims, lw})` — procedural puppet re-drawn every drawing. Pose keys
  (degrees, 0 = hanging down, + = tip toward screen-right): `lt lk rt rk` thighs/knees, `la le ra re` arms/elbows,
  `lean hd turn(−1..1) blink(0/1/2) smile(0..2) bob wind flip x y s`. Slots: `back tback mid hold front pattern`
  (pattern is clipped to the jumper — put a picture "inside" a person).
- `K.pose(fig, t, {...}, dur=0.7, 'sine.inOut')`, `K.set`, `K.walk(fig, t0, t1, {speed, cycle, dir, arms})`,
  `K.wobble(fig, t0, t1, {la: 7}, period)` (polishing, waving), `fig.attach(el, 'l'|'r')`, `fig.handAt(side)`,
  `fig.handFor(side, pose)` (deterministic hand-offs).
- Props: `K.plinth` (bell jar), `K.rope`, `K.drawers`, `K.ticket`, `K.pebble`/`K.pebbleD`, `K.key`, `K.profile`
  (Cocteau head, draw-on line), `K.frame` (clipped picture), `K.seaside`, `K.door` (hinged panel + clipped opening),
  `K.museum`, `K.flower`, `K.bird`, `K.marks` (strain/emphasis dashes), `K.scallopD`, `K.squiggleD`, `K.limbD`.

## 6. Motion grammar (all sampled on twos)
| move | ease | duration | note |
|---|---|---|---|
| pose change | `sine.inOut` | 0.5–0.8 s (6–10 drawings) | once per sentence, 0.2–0.35 s before the stressed word |
| emphasis (squeeze, laugh) | `power2.out` | 0.25–0.35 s | then settle back |
| object arrival | `back.out(1.2–1.6)` | 0.4–0.7 s | only small decorative pops overshoot |
| keyword | fade + 12 px rise, `power2.out` | 0.3 s | on the noun, out when the idea changes |
| slow push | `sine.inOut` | whole hold | `K.drift(g,t0,t1,{rate:0.006–0.01})` |
| travel to next set | `power2.inOut` | 0.9 s | `K.travel(out, in, t, 0.9, dx, dy)` |
| travel zoom | `sine.inOut` on log-scale | ≥ 1.5 s | `K.xf(g, px, py)` and tween `ls`; ≤ ~0.1 ln per drawing or QA counts a cut |
| idle | scarf flutter `wind 0.7`, `K.bobber` ≤ 4 px | — | otherwise stillness; holds are the style |

## 7. Transitions
| name | build | frames @24 | when |
|---|---|---|---|
| chapter card | `K.card(tIn, tOut, {n, title, field, text, num, line, seed})`: wavy field rises 0.7 s, squiggle draws 1.2 s, "-n-"+title at +0.45 s, slides off left 0.5 s | 17 in / 12 out | every chapter, tIn = line start − 0.5, tOut = next line − 0.45 |
| colour-field set wipe | `K.wipeUp(g, color, t)` | 17 | sting → title, any change of ground colour |
| camera travel | `K.travel` (x for pans, `dy:-1080` = tilt up) | 22 | between sentences on the same set |
| travel zoom + dissolve | zoom into a picture (`K.xf` ls → ln 4.6), 0.35 s dissolve to a rhyming close-up, log pull-out over 2.5 s | 40 + 8 + 60 | once per film, the turning point |
| hard cut | scene windows abut | 0 | ≤ 1 per film, to a full-colour close-up |
| release | `K.release(g, items, t)` objects shrink to 0 and become birds | ~60 | consoling ending |
| tilt to end card | scene `y → +1080`, card `−1080 → 0`, `power2.inOut` 1.1 s | 26 | last line + 0.25 s |

## 8. Sound
`sound.json`: `{"preset":"lofi-piano","bpm":66,"sections":[{"t":0,"energy":1},{"t":<end card>,"energy":0}],
"music_under_voice_db":-22,"duck_db":6,"sfx_db":-8,"lufs":-21,"end_hit":true,"reverb":0.4}` — never raise energy
(rising energy adds a riser). SFX (gain 0.05–0.25): `paper` on card/field wipes, `slide` on card exits, `pop` (0.1)
on object arrivals, `scribble` on a draw-on correction, `thud` when something lands, `click` for keys, `bubble`,
`chime` (0.06) on titles. Nothing on most changes.

## 9. Build recipe
1. `cp -r assets/template my-film` (it carries a copy of `kit.js`; `assets/kit.js` is the master — keep them in sync).
2. Write `script.json` (§3): ~160 words / 75 s; card lines as separate ids (`c1`, `c2`…).
3. `ENGINE/make.sh my-film --draft` once for vo.json; read word times; then build `scene.js` block per sentence:
   `scene(name,t0,t1)` (outer for travel, cam for drift) → set (`bgField`, `floor`) → figure + prop → `K.pose` on the
   stressed word → `K.keyword` on the noun → `K.drift`. Always time with `X.word`, never constants (a TTS re-run
   with another `speed` shifts every word).
4. Chapter cards with `K.card`; change ground colour only where a card or cut already changes the picture.
5. `node ENGINE/render.mjs my-film --stills ...` at every sentence; fix composition.
6. `ENGINE/make.sh my-film --skip-tts --fps 24 --workers 3`; compare `out/qa/metrics.json` with §2.

## 10. QA checklist
- Stills: figure ground line at y≈960, head ≥ 60 px, keyword ≥ 64 px, nothing held overlapping a hand that should be on top
  (create big props BEFORE the figure), key/scarf colours distinct from the jumper.
- `fps` must be 24 (12 drawings/s × 2). `strips.jpg`: card wipe has the wavy edge, drawings step (no smear).
- Gates: cuts/min ≤ 2.5, motion 3.2–4.5, hold_frac ≥ 0.1, animated_frac ≥ 0.95, LUFS −20…−22.
- Gotchas: `fig.attach` overwrites the element's transform (animate an inner group); GSAP `svgOrigin`/% origins on a
  `fromTo` with a pre-scaled from-state bake an offset (use `K.xf` for pivots); fibre overlay > 0.03 breaks flatness
  and the motion floor; a fast zoom on twos reads as a cut; on a travel between two sets of the same colour the
  incoming set's field covers the outgoing floor — make floors exactly as wide as fields (−400…2320) and give the
  incoming cam the outgoing cam's drift scale, or the ground line steps at the seam; create big props before figures
  (z-order = DOM order).
- Don't: smooth 30 fps tweening, glows/shadows/gradients (vignette only), subtitles, more than one keyword per scene,
  upbeat music or risers, the channel's ident/shop/subscribe cards, mixing illustration modes in one film.

**Swapping the look:** keep §1/§3/§6/§7, replace `K.LOOK`/`K.C`/`K.FIG` — e.g. ink-on-kraft (paper `#BAB297`, boil 4–5,
lw 5, black ink figures with big heads, one neon numeral per list item) or slate silhouettes (ground `#162023`,
mustard/teal/coral silhouettes without outline, boil 0–1). Those looks are documented in references/analysis.md §5 but
not built in this kit.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/

## Later evidence
Added after the skill was written (read when extending the style):
- `references/channel-extras-addendum.md` — 2026 shorts: no chapter cards, 5.5–7.8 cuts/min, 161–166 WPM, −16 LUFS
