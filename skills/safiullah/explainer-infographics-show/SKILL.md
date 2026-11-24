---
name: explainer-infographics-show
description: "Makes fast, second-person \"What if you…?\" / \"Could you survive…?\" scenario explainers in the style of The Infographics Show — a sardonic narrator at ~210 WPM, a puppet-rigged flat \"you\" stand-in with ball fists, a ladder of escalating problems (number + grim workaround + joke), a virtual camera that never stops and animated transitions (smash zooms, whips, zoom-throughs, shape/liquid wipes, letter dives) instead of cuts, big tilted kinetic type and a question to the comments at the end. Trigger on \"Infographics Show style\", \"what if you…\", \"could you survive…\", \"survival scenario explainer\", \"follow the math\" style number essays (2026 variant), flat-vector YouTube explainer with a stick-on everyman. Builds on explainer-engine."
---
# Infographics-show what-if explainer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A bright flat-vector world (no outlines, two-tone shading, colourfulness ≈ 75), a neutral "you" stand-in who reacts while an
off-screen narrator talks to the viewer in second person, fast and deadpan. The body is a ladder of problems, each one worse
than the last. The picture never stops changing, but almost nothing is a hard cut: a new set arrives every 3–4 s through a
motivated animated transition, and between swaps the camera drifts, pushes and punches in. Built from frame analysis of 4
source videos (references/sources.md). The default is the classic 2018–19 look; the 2026 variant is documented in §11.
Original work only: your own topic, character, channel mark and end card.

## 1. Signature traits
- Second-person scenario ("You wake up on Mars…"), ~45–55 "you" per 1000 words, rising after the first 20 % of runtime.
- A ladder of 4–6 problems ordered by a path, a clock or a needs hierarchy; every rung = **hard number + grim workaround + one-line joke**.
- The "you" stand-in: plain tee, dark trousers, slate hair blob, dot eyes, brows that carry the emotion, **oversized ball fists**, no outline, no lip-sync.
- ~11–17 animated scene changes/min, hard cuts ≤ 1.7/min; the camera moves 25–40 % of the time and never holds > 3 s.
- Close-ups drop the environment and sit on ONE saturated field (cyan, mustard, coral, green); wides use 3–5 flat parallax planes.
- Big tilted (−10° to −15°) Montserrat Black kinetic type with per-letter pop and a highlighter bar, about every 30–60 s.
- Numbers live on props: value tags on strings, gauges, stopwatches, thermometers, calendars, stamps.
- Narration never stops (≤ 1 s gaps) over a never-silent light bed; one whoosh per transition, one pop per element.

## 2. Target metrics
Source values from `research/frames/<id>/metrics.json` (2018 nuclear · 2019 Mariana/whale · 2026 data). QA reads `out/qa/metrics.json`.

| metric | source range | target | sample build (72.5 s) |
|---|---|---|---|
| scene_changes_per_min | 4.6 (2018) · ≈15–16 visual events/min (2019, analysis classifier) · 13.7 (2026) | 13–17 | 17.4 |
| scene_len_median (s) | 11.0 (2018) · 3.3 (2026) | 3–4 | 3.1 |
| cuts_per_min | 0 – 1.68 | ≤ 1.7 | 1.66 (a whip + the letter dive) |
| motion_mean | 4.5 · 11.9–14.6 · 10.4 | 10–15 | 10.1 |
| motion_p90 | 11.1 · 27.8–38.2 · 31.4 | 25–38 | 20.3 ⚠ |
| hold_frac | 0.27 · 0.025–0.056 · 0.14 | < 0.10 | 0.023 |
| colourfulness | 70.9 – 79.8 | 70–80 | 73.6 |
| saturation | 0.38 – 0.47 | 0.38–0.48 | 0.50 ⚠ |
| brightness | 0.67 – 0.73 | 0.67–0.74 | 0.744 |
| dark_frame_frac | 0.002 – 0.079 | < 0.08 | 0.0 |
| WPM overall | ≈211 (2018 captions) · 192–209 · 190 (2026) | 200–215 | 207.8 |
| longest gap between words | 1.0 s (2018–19), 1.7 s (2026) | ≤ 1 s | 0.33 s |
| loudness LUFS / silence | −14.0 to −15.8 / 0 s | −14 / 0 | −14.3 / 0 |

Deliberate deviations (sample): **motion_p90 is low** — the sources are crowded stock-vector frames with many small high-contrast
details, so every camera move changes many pixels; a clean flat build reads ~10 mean / ~20 p90 at the same camera activity. To
close the gap: characters at 30–55 % of frame height in wides, lots of small props/rocks/particles, punch-ins on numbers, never
large empty fields. **Saturation 0.50** comes from the all-orange Mars palette; neutral greys/whites in the set fix it. The end card is
6 s (mini-episode) instead of 10–12 s, and there is no sponsor pre-roll.

## 3. Script formula
Beat map (60–75 s mini-episode; full episodes stretch the ladder to 4–6 rungs of 40–70 s each — see references/analysis.md §4):

| % runtime | beat | sample (Mars) |
|---|---|---|
| 0–15 | **Cold-open hook**, type A "Imagine this": one second-person catastrophe in 2–3 sets (or type B: 3 quick related tips, "Easier said than done, eh.") | "Imagine this: you wake up on Mars to a blaring alarm… Congratulations, you're now the loneliest person in the solar system." |
| 15–21 | **Title line** + 1–2 s channel sting | "So could you survive? Let's find out, on this episode of Worst Case." |
| 21–26 | **Premise** + preview of the rungs | "Mars looks friendly enough, but it's trying to kill you in at least four ways." |
| 26–83 | **Ladder**, 4 rungs × 8–12 s: "Problem N: <thing>." → number → workaround → button joke | "Step outside without a suit and you'd pass out in about fifteen seconds. So the helmet stays on, even when your nose itches." |
| 83–92 | **Verdict** + callback joke | "With tons of supplies and no sense of smell, maybe. But alone for three years? We wouldn't bet on it." |
| 92–100 | **Question to the comments** + end card | "Would you take a one-way trip to Mars? Let us know in the comments!" |

- Section handovers are spoken connectives ("First,", "Problem two:", "Next,", "Then there's the big one:"). One rung = one number;
  facts must be checkable (avoid precise stats you cannot verify; no fake quotes). Narrator is "we", the viewer is "you".
- Jokes are deadpan asides or one-word buttons at full speed — never a comic pause. Name-drop nothing real; invent references.
- **Voice**: Kokoro `am_puck`, `speed 1.28`, `lead 0.4`, `gap 0.06` (tts.py trims add ≈0.21 s, so the real pause is ≈0.27 s),
  `gap 0.12` between sections, `tail ≈ 2.6`. That gave 234 wpm while speaking, 208 overall, max gap 0.33 s. 250 words ≈ 72 s.
  Check per-15-s WPM stays within ±10 %.

## 4. Visual system
Palette (`K.C`, kit.js):

| role | hex |
|---|---|
| open sky / pale fields | `#A4E4F4` `#96D9EC` `#A2D9E8` (keep big fields ≤ 0.92 value or brightness overshoots) |
| close-up colour fields | cyan `#04C4F4`, gold `#ECBF53`, coral `#E05555`, green `#5CAC2C`, sand `#ECBC4C` |
| water steps | `#2878A2` `#228EB2` `#6EB9D2` |
| alarm / keyword | red `#E3201B`; highlight yellow `#F5C400`; navy bar `#23305A` |
| stand-in | skin `#F2A49C`/`#D9827E` (hard two-tone split), tee `#F6F4EF`/`#E2DED6`, trousers `#445464`/`#394656`, hair `#3D4A5A` (never black), shoes `#2C333D` |
| suit variant | `#EEF0F1`/`#D3D8DD`, orange `#F28C28`, gloves `#D7DCE3`, visor glass `#BDEBFA` at 32 % |
| Mars set (sample) | sky `#DFA170`, far mesas `#D18E63`/`#C98258`, dunes `#BD6E47`, ground `#A95C3D`/`#9A5135`, rocks `#7E3F28`/`#934B30` |
| dark utility | space `#2C3D86`, end card `#24435A` — the only dark surfaces |

- **Typography** (engine fonts): Montserrat 900 for kinetic type (hero 230–300 px, secondary 110–140 px, ALL CAPS, −10° to −15°,
  white + soft shadow `K.F.tshadow`, one keyword colour); Montserrat 700 42 px for fact boxes (black on white, flush left, typed 2 chars/f);
  speech bubbles 48–60 px ≤ 8 words; value tags 58–72 px 800; labels on props 30–46 px 800–900.
- **Shapes**: flat fills, one shadow tone, rounded corners (8–15 % of the short side), blobs = overlapping circles. No outlines on
  characters or scenery; strokes only in diagrams (orbits, arrows, gauge arcs). No texture, no grain, no gradients except sun halos.
- **Light**: flat; sun = disc + 2 lighter rings; colour grades as storytelling (`K.tint`, alarm pulses) — keep peaks ≤ 0.2.
- **Composition**: wides with the subject at 30–55 % height on a third; mediums crop at the chest; close-ups 60–100 % height on a
  single field; first-person POV hands (`K.tablet`) are the visual form of "you"; fact box top-left (y 96), safe margins ≥ 96 px.

## 5. Characters & objects
`P = K.guy(ctx, layer, {x, y, s, suit, helmet, face, flip, hands:{l,r}, pose, shirt})` — feet at (x, y); s = 1 is 590 px tall.
- Construction: head 114×130 rounded rect (≈1/4.5 of height) with a hard shadow split, swept-quiff hair from 6 circles + a swoop,
  C-ears, dot eyes 11×14, rounded-bar brows, small mouth shapes, no nose; trapezoid torso 180 wide; legs 45 % of height; tapered
  bendy arms recomputed every frame as a quadratic tube shoulder→hand (no elbow joint); **ball fists r = 40** with a crescent shadow.
- Idle (always on): breathing scaleY 1.8 % (2 s), head tilt ±2.2° (3 s), blinks every 2–4 s for 3 frames.
- `P.face(t, name)` swaps in 2 f: `neutral smile grin worried shocked angry sick woozy ko side smug` (brows rotate, mouth path swaps,
  eyes: dots / happy arcs / X / spinning spirals; `sick` adds green cheeks). `P.pose(t, K.POSE.x | {l:[x,y], r:[x,y], bl, br, lean}, dur)`
  with poses `rest wave waveB thumbs panic hug sign shrug chin point hips`; `P.hop(t, h)`, `P.shiver(t, dur, amp)`, `P.look(t, dx)`.
  Characters rarely walk: slide them in with a hop, pose them, move the camera. Put extras (clothespin…) in `P.extras`.
- Props (all flat, chunky, labelled): `K.hab K.rocket K.rover K.planet({face}) K.gauge K.molecule K.stopwatch K.thermo K.panel K.sun
  K.calendar+K.flipPages K.potato K.tray K.bucket(stink) K.crate(label) K.ice K.pickaxe K.pot(steam) K.tablet (POV hands) K.orbits
  K.devil K.mark`; environment `K.marsLand(ctx,{horizon,seed,sunX,sunY})` → `{sky, far, mid, near, act, fg}` parallax layers with
  craters, rocks, pebbles and wind specks; particles `K.dust`, `K.stars`. Numbers: `K.tag` (string tag, elastic swing), `K.bigNum`,
  `K.stamp`, gauge needle `elastic.out(1,0.45)`, `X.countUp` on stopwatches/counters.

## 6. Motion grammar
| motion | ease | duration @30 fps |
|---|---|---|
| pop entrance (`X.pop`, prop tf) | `back.out(2–2.6)` | 8–14 f |
| per-letter pop (`K.popText`) | `back.out(2.6)`, rot ±25°, y ±18 px, stagger 2 f (1.5 f for long words) | 5–6 f per glyph |
| camera re-frame (`K.move`) | `sine.inOut`, ×1.15–1.45 or 0.12–0.2 frame widths | 18–45 f |
| always-on drift (per set) | linear, `drift: [30 px/s, 0, 1.6 %/s]` | whole set |
| punch-in on a stressed number (`K.punch`) | 3 f in, quadratic decay | 21 f, ×1.10–1.14 |
| smash zoom-out / push-in | `expo.out` landing; dive `power3.in` via `K.zoomTo` | 24–30 f / 9 f + 18 f |
| whip | `power4.in` + 70 px blur, then `power3.out` | 4–5 f + 13 f |
| tags, needles, beams | `elastic.out(1, 0.35–0.45)` | 27–39 f |
| stamp slam | `power3.in` from 2.4× + shake 10–16 px | 5 f |
| gestures | `power2.inOut`, 2–3 key poses | 8–14 f each |
| drops | `bounce.out` | 12 f |
Stagger siblings 2–4 f ("?" "??" "???" at 3 f; chips 3 f; a dozen potatoes 2 f). Build order: background (via transition) → hero →
props → number → label/bubble; labels never precede their object. Visual lands on the spoken noun ±0.1 s; numbers 0.1–0.35 s after
the word. Something always moves: idle loops, particles, flames, steam, stink lines, flies, waves, rays.

## 7. Transitions (kit `K.tx.*`, analysis §7)
| # | name | call | frames | use |
|---|---|---|---|---|
| T1 | smash zoom-out | `smashOut(A,B,T,fx,fy,from 6–9)` | 24–30 | scale reveals, "alone", verdict pull-back |
| T1 | smash push-in | `smashIn(A,B,T,fx,fy,{k})` | 9 + 18 | into a close-up / planet surface |
| T2 | whip-pan / tilt | `whip(A,B,T,dir,vertical)` | 4 + 13 | topic jumps (≈1/min; registers as a hard cut) |
| T3 | foreground occluder | `occluder(A,B,T,build,dir)` | 16 | pans through one world |
| T4 | zoom-through | `zoomThrough(A,B,T,rect,{dim})` | 16 + 21 | POV screen / porthole / photo into the next set |
| T5 | burst-through | `burst(A,B,T,colour,x,y)` | 9 + 18 | openers, reveals |
| T6 | blink | `blink(A,B,T)` | 10 + 1 + 13 | pass out / wake up |
| T7 | push slide | `slide(A,B,T,dir)` | 24 | sequences, comparisons |
| T8 | shape wipes | `bands(A,B,T,colours)` · `circles(A,B,T,colours)` | 10 + 3 + 10 | rung changes |
| T9 | liquid / dust | `liquid(A,B,T,colour)` | 16 | weather, water, storms |
| T13 | element fly-off | tween the card `tf` off-frame (`power2.in`, 10 f) | 10 | type card → sting on the same field |
| T14 | letter dive + iris | `letterZoom(A,B,T,...glyphWorld(), {k:200–300})` | 12 + 14 | out of a type card |
| T15 | colour flood | `flood(A,B,T,colour,x,y)` (B's field = same colour) | 8 | into type cards |
Each carries its whoosh/zoom/pop SFX. Mix ≥ 8 kinds per minute; about 90 % of set changes animated.

## 8. Sound
`sound.json`: `{"preset":"playful-bounce","bpm":118,"sections":[{t:0,e:2},{title,e:3},{after sting,e:2},{last rung,e:3},{verdict,e:2},{end card,e:0}],
"music_under_voice_db":-14,"duck_db":6,"sfx_db":-3,"lufs":-14}` — a hot, continuous pizzicato bed; energy stays flat (style has no
slow middle). SFX map: transition → whoosh/zoom_in/zoom_out/swoosh (in kit); every pop → pop; "?" → blip_up; stamp → stamp + shake;
timers → tick/tock; alarms → beep + `K.tint`; ice/sun/frost → sparkle; gags/bonks → boing + thud; drops → thud; calendar → paper;
type-on → type; comment icon → notif; launches → riser + impact. VO: bright, sardonic, deadpan, same speed for jokes.

## 9. Build recipe
1. `cp -r assets/template <project>`; keep `kit.js` beside `index.html` (the renderer only serves the project and `/engine/`).
2. Write `script.json` first (beat map above, ~250 words for 70 s), run `ENGINE/make.sh <project> --draft` once for `data/vo.json`.
3. In `scene.js` define boundaries on spoken words (`X.word`), then one `K.set` per set, in order. Inside each build: layers →
   props/puppet → **incoming transition** (`K.tx.*(prev, S, T)`) → this set's `K.move`s in time order → `K.punch` on numbers.
4. Per beat: hook = `K.tablet` POV + `zoomThrough` → Mars/world wide (`K.marsLand`, `K.guy`) → `smashOut` to scale; title =
   `flood` + `K.typeCard` → fly-off → `K.mark` sting; each rung = `K.factBox('PROBLEM #n: …')` + one number prop + reaction face +
   joke gag (qmarks, bonk, stink); last number = `K.typeCard` on navy → `letterZoom`; verdict = `K.stamp` + `smashOut`; end card in `S.hud`.
5. `node ENGINE/render.mjs <project> --stills t1,t2,…` at every beat and transition midpoint; read the PNGs.
6. `ENGINE/make.sh <project> --skip-tts --workers 3`; compare `out/qa/metrics.json` with §2 and `timeline.jpg` / `strips.jpg` with
   `references/sources.md` sheets. Iterate on the weakest shots (≥ 2 rounds). Render: 72 s ≈ 70 s wall-clock on 3 workers.

## 10. QA checklist
- Stills: frame 0 not blank; every rung shows its number on a prop; text ≥ 36 px, nothing clipped by camera pushes (put fixed UI in `S.hud`);
  the stand-in readable in wides (≥ 30 % height); fact box never covers the character.
- Gates: scene changes 13–17/min, cuts ≤ 1.7/min, hold < 0.10, motion_mean ≥ 10, colourfulness 70–80, brightness ≤ 0.74, WPM 200–215, LUFS −14.
- **Gotchas (all hit while building the sample):**
  - A set starting at t = 0 is not shown by `seek(0)`: add `gsap.set(set.g, {autoAlpha: 1})`.
  - Transitions read `plan` state: call the incoming transition before B's own moves, and end A's moves before the outgoing one
    starts (whip 0.15 s, smashIn 0.3 s, letterZoom 0.4 s, zoomThrough 0.55 s, occluder 0.3 s before T). Overlapping rig tweens fight.
  - Diving into a point: use `K.zoomTo` (screen-space glide + exponential scale). Tweening x/y/s together drifts across other content.
  - `letterZoom` needs k so the glyph stem covers the frame several frames before T (k ≈ 1.5 × 1920 / stem px), else a hard cut is logged.
  - `K.tf` only drives opacity if `o` is in its init state (otherwise it would force hidden groups visible).
  - Framing changes between sky-heavy and ground-heavy views, tints > 0.2 and zooms that make one colour dominate all register as
    scene changes: budget them like set changes. Set `drift: [0,0,0]` on sets that end in an exact dive (zoomThrough / letterZoom).
  - Scratch files: other builders may share the scratchpad — use a private sub-folder.
- Don't: hard-cut as the default, dark/moody grades, outlines/texture/realistic light, lip-sync, long walks, equations/gridlines,
  > 10 words of body text outside a type card, > 1 keyword colour or > 3 lines per card, real brands/celebrities, the channel's logo,
  blue-sphere mark, striped ident, exact everyman design or end-card layout.

## 11. The 2026 variant ("Follow the Math", DRP7tRXts0Q) — alternative look
Use when the brief is a number-heavy opinion essay rather than a "you" scenario. Differences from the default:
- Third-person narration ("homeowners", "renters"), "you" only at turning points; ~190 WPM (Kokoro speed ≈ 1.15–1.2), gaps up to 1.7 s ok.
- ~30 one-line **stinger** sentences ("So is it really worth it?"), about every 40 s drawn as a headline card:
  `K.headline(ctx, ['SO IS IT REALLY', 'WORTH IT?'], t, {keyword:'WORTH', out})` — set blurs 16 px + dims in 4 f, 1 char/frame type-on, keyword red.
- Corporate cast: bigger heads (1:4.5), slim suits, black helmet hair `#040404`, wide toothy D-mouths (`face: 'grin'`), mitten hands;
  emotion from mouth/brow + tear drops; props held up to camera (bills, phones, documents). Restyle `K.guy` via `shirt` + palette overrides.
- Transition packs instead of camera whips: liquid/coffee splash (`K.tx.liquid`), swirl, shards/shatter (recipe in references/analysis.md §11).
- Numbers: price tags on strings, phone balance tick-downs (`X.countUp`), red label boxes, balance scales, schematic charts on a white card
  with the camera pulling back to an easel; no equations, gridlines or tick labels. Faint pattern on big fields is allowed.
- Persistent own corner bug bottom-left (6 % height) and a "narrated by" chip for the first 5 s; no title line, sting or comment question;
  end with a single "Watch …" slot. Metrics: scene changes ≈ 13.7/min (median 3.3 s), hold ≈ 0.14, motion ≈ 10.4, brightness ≈ 0.73.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/ (runnable 12-s demo: `make.sh assets/template --draft`)
