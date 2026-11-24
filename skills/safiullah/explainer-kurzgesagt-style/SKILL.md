---
name: explainer-kurzgesagt-style
description: "Makes flat-vector science animation in the \"neon night\" style of Kurzgesagt – In a Nutshell (2017–19 era): deep indigo night skies, violet/magenta shapes with one amber accent, small glowing light sources with rim lights and stepped halos, bloom and god-rays, layered parallax, continuous camera zooms and dives instead of cuts, round original big-eyed creature characters, calm curious narration. Use when someone asks for a \"Kurzgesagt-style\", \"In a Nutshell-like\", \"space/biology explainer like Kurzgesagt\", \"cosmic science animation\", \"flat neon science video\", or a science mini-episode with zooms from atoms to galaxies. A style homage only: no channel logo, birds, branding or intros. Builds on explainer-engine."
---
# Kurzgesagt-style "neon night" science explainer

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

This style is flat, outline-free rounded geometry lit by tiny light sources. Saturated violet and magenta glow out of deep indigo, set against warm amber worlds. One unbroken camera carries the viewer from a hand to an atom, to a star, to a galaxy and back. Under it runs a calm, dense, gently wry narration that ends on a humanist line. The skill was built from frame analysis of 5 source videos (references/sources.md, analysis in references/analysis.md). Produce original work only: your own creatures, topics and type, and never the channel's birds, logo, end card or catch-phrases.

Reference build: `assets/sample/` → `out\kurzgesagt.mp4`. It is "Made of Old Stars", 74 s, zero hard cuts, and the cleanest worked example of every recipe below.

## 1. Signature traits
- **Neon-night palette.** Indigo `#0E0D2B`–`#24187E` backgrounds (never black). Saturated violet `#8321BD`, magenta `#CF3067`/`#F91E8E` and cyan `#25E8F1` shapes. One warm amber accent `#F8AE1C`. Dark scenes alternate with amber "day" worlds that carry tone-on-tone swirl patterns.
- **Light from small sources.** Stepped (posterized) halos, rim-light slivers on every rounded object, soft bloom, god-ray fans and twinkling 4-point sparkles. Shadows are darker and more violet, never grey.
- **No outlines.** Everything is round fills in 2–4 values with a crisp curved terminator. Capsules, blobs, scallops and hexagon crystals; "cosmic confetti" fills the empty space.
- **Continuous camera, no cuts.** Powers-of-ten zooms, dives into objects, silhouette pull-backs, white-outs and palette swaps. A 6-minute 2017 film has 0 hard cuts.
- **3–5 parallax planes.** A near-static sky, far mountains, a mid layer, the subject, and dark foreground foliage in the corners.
- **Round stand-in creature.** One bean-shaped blob, one big white eye, a warm complementary nub, no mouth. It expresses emotion by cropping the eye.
- **Narration.** A calm male voice at ~160–180 WPM in short sentences, with "But…" pivots, big numbers paired with human-scale images, and a soft uplifting last line.

## 2. Target metrics
QA compares `out/qa/metrics.json` with this table. The source columns are ON 2017 / Trees 2026 / Fermi 2015 / Egg 2019 / PXbV 2026.

| metric | sources | target (2017–19 build) | reference sample |
|---|---|---|---|
| cuts_per_min | 0.81 (0 editorial) / 5.03 / 0.16 / 4.44 / 12.1 | **0–1** | 0.0 |
| scene_changes_per_min | 9.29 / 11.29 / 6.78 / 8.39 / 14.06 | 9–14 | 15.4 ¹ |
| scene_len_median s | 3.83 / 3.83 / 6.66 / 4.5 / 3.5 | 3.5–4.5 | 3.5 |
| motion_mean / p90 | 7.7/20.9 · 7.8/20.4 · 6.5/18.7 · 5.8/13.2 · 10.1/23.5 | 6–10 / 17–24 | 6.4 / 17.3 |
| hold_frac | 0.116 / 0.133 / 0.271 / 0.136 / 0.045 | 0.09–0.15 | 0.095 |
| colourfulness | **103.9** / 84.3 / 51.8 / 75.3 / 90.9 | **75–104** | 75.6 |
| saturation | 0.84 / 0.69 / 0.50 / 0.73 / 0.67 | ≥ 0.68 | 0.72 |
| brightness | 0.563 / 0.551 / 0.477 / 0.413 / 0.531 | 0.45–0.60 | 0.62 ² |
| loudness LUFS | −14.8 / −16.0 / −13.3 / −16.1 / −15.2 | −14 … −16 | −15.3 |
| WPM overall | 182 editorial / 160 / 167 / 118 / 147 | 160–180 | 160 |
| pauses > 0.75 s | 17.7/min (ON) · 10.9 (Trees) | one every 4–5 s | ≈12/min |

¹ A 74-s mini-episode squeezes a 6–8-minute arc, so palette events come at the top of the source range (PXbV level), while median scene length matches ON/Trees. Every full relight counts as an event. To come down, merge neighbouring relights (§7) or lengthen the episode.
² Amber day scenes measure 0.92–0.95 and violet mountains 0.6. Colourfulness and brightness trade off against each other, so keep deep-indigo edges (radial bgs, vignette) to pull brightness down.
Colourfulness per shot type, measured on the sample: amber world 110–125, star cutaway 92, supernova 75, x-ray spotlight tints 60–75, indigo gas 50–70, near-black beat 25–40. **Dark indigo frames sink the average.** Add saturated violet mountains, magenta glows and radial spotlight tints, never flat dark fills.

## 3. Script formula
**Beat map** for 60–75 s (scaled from the 6–8 min originals):

| % runtime | beat | sample ("Made of Old Stars") |
|---|---|---|
| 0–8 % | **Hook**: tangible action or superlative fact → contradiction → explicit question | "Hold out your hand. Nearly every atom in it is older than the Earth… But its carbon… didn't exist when the universe began. So where did it come from?" |
| 8–55 % | **Escalating explanation**, one scale jump per sentence, each with a camera move | young universe → dark gas → gravity → first stars → fusion inside a star → onion layers |
| ~55–60 % | **Name the concept / title moment**: a big typographic beat | "…the star explodes. A supernova" + a wide-tracked SUPERNOVA title |
| 60–85 % | **Densest sequence** (montage or rapid relights) at 75–85 % | dust → disk → Sun/Earth dive → x-ray montage: calcium / iron / oxygen |
| 85–100 % | **Humanist uplift**: a slow, wide, calm closing shot | "You don't just live in the universe. You're made of it. Old stardust, wondering where it came from." |

- **Sentences.** Mostly 8–15 words, with 2–4-word one-liners for punch ("The first stars."). Use the connectives "But…", "So…", "Until…", "And…". Pair every number with a picture; use no statistic you cannot verify.
- **WPM.** Aim for 160–180 overall, with a pause > 0.75 s every 4–5 s (put the pause between lines, not in the middle of a sentence).
- **Kokoro.** `am_michael` (calm, curious) at **speed 1.30–1.34**, `lead` 0.7, `tail` 2.4. am_michael at speed 1.0 speaks only ~165 wpm, so you need ≈1.32 for ~200 wpm while speaking and 160 overall. Kokoro adds ~0.2 s to every gap, so specify 0.15–0.45 inside a section, 0.6–0.8 at hand-overs and 0.85–1.0 before the closing lines. `bm_george` is the British alternative and needs a similar speed.
- **Facts.** Use only claims that are safe as worded: "nearly every", "most of its mass", "can briefly outshine". Write numbers as digits only if Kokoro reads them well; spell out acronyms.

## 4. Visual system
**Palette roles** (KZ.P in kit.js):

| role | hex |
|---|---|
| deep bg / vignette | `#0E0D2B` `#100635` `#070815`; radial centre `#2C275B` / `#3A22A0` |
| night mid / mountains | `#24187E`, saturated violet mountains `#7424C6` / `#5419AE`, magenta horizon glow `#D02F9E` |
| primary violet / magenta | `#8321BD` `#3C0FB1` · `#CF3067` `#9A146E` `#F91E8E` `#E61DAD` |
| warm accent | `#F8AE1C` `#FCB80B` amber, `#F0710E` orange, `#FFD36B` rim |
| cool glow | `#25E8F1` `#74D4E7` `#2C9ADA` `#18DBD5` |
| day world | sky `#F9A90E`→`#FFD866`, swirl `#FFC232`, mountains `#FDE4A6`/`#FBCE6A`, ground `#F8AE1C` + swirl `#FBC03E` |
| highlight / text | `#F3EAC2` cream, `#FFFFFF` on pills |
| shadow | `#090815` `#450C5C` `#5F1265`, always darker *and* more violet |

- **Colour rules.** Keep 70–80 % of saturated pixels blue→violet→magenta, with one warm accent per scene. Shade by shifting hue, not by greying. Use palette swaps for meaning: violet "x-ray" means looking inside, red means danger.
- **Typography** (engine fonts). Pills use **Nunito 900**, 34–40 px, white on a colour-coded capsule with a darker 5 px lip, ≤ 3 words. Element symbols on diagrams use Nunito 900, 26–44 px. The title moment uses **Montserrat 800**, 110–130 px, tracking 0.3 em, a white→pink gradient and a magenta glow, one letter every 45 ms starting 0.2 s after the word. Keep text to ≤ 1–2 items on screen.
- **Shapes and line.** Rounded fills only. Strokes appear only as rim slivers (body minus a copy offset 8 px from the light), connector lines (4 px, round caps, 11 px ring dot), orbit lines (2.5 px at 40 %) and neon highlight rings (5 px white + 18 px blurred).
- **Texture.** None in 2017 except graphic patterns: tone-on-tone swirls (`KZ.swirlPattern`), wave hatching and dot fields.
- **Composition.** The hero is centred and fills 30–60 % of frame height, with large dark negative space. Framing foliage sits in the corners on the foreground plane. Close-ups may crop the creature boldly. Keep labels ≥ 5 % from the edges.
- **Lighting recipe** (stack it on every hero):
  1. a radial background;
  2. a `KZ.glow` bloom behind the source;
  3. a `KZ.halo` of 4–5 posterized rings blending toward the background (`KZ.steps(col,bg)`);
  4. a core disc;
  5. `KZ.rays` god-rays at 0.1–0.2 opacity rotating 2–4°/s;
  6. sparkles.

  Objects get `KZ.orb` two-tone shading plus a rim on the side facing the light.

**Era variants (documented, not built here):**
- **2015 "infographic" (Fermi).** Muted navy `#132533` space with off-white panels `#EBEAE8`, pastel salmon/teal/mustard, colourfulness ~52, hold 0.27. Uses chamfered banner tags (Montserrat caps), stacked number bands and panel wipes with sawtooth edges (T10). It has small icon-like objects and no glow.
- **2026 "painterly" (Trees, PXbV).** The same night palette plus naturalistic greens and cyans. Adds brush texture in big shapes (stipple patterns at 15–30 %), 3–4 value steps, depth-of-field blur on far and near planes (feGaussianBlur 6–10), 3–6 % noise (`X.grain(0.04)`), additive bloom and colour-wash transitions. Colour-coded pills with connectors are common, and there are 4–8 hard cuts per minute. To get the 2026 look from this kit, add a blur filter to p1/p4, grain, and more pills.

## 5. Characters & objects
**Construction rules for an original creature:**
- One bean, pear or teardrop blob with head and body merged, height:width ≈ 1.3–1.6. It must read as a single shape in solid black.
- One big white eye high at the front, 18–27 % of head width, with a pupil touching the edge in the look direction.
- A warm complementary feature: beak, snout-nub or lamp. Stubby limbs or a leaf wing.
- No mouth, no outline.
- One saturated body hue, a belly patch 1–2 steps lighter, and a violet-shifted shadow behind a crisp terminator.
- Expression by eye crop: flat lid = skeptical or worried, lower arc = happy, full disc = alert. Blink is a 2-frame squash.

Do **not** copy the channel's birds (no black-hooded white bird, no helmet bird, none of their beak/body combos).

`KZ.critter(g, {x, y, s, amb, float, cosmos, xray, blinks, phase})` builds the sample's original **lantern critter**: a turquoise bean, an amber snout-nub and feet, a mitten arm, and an antenna bulb that is its own light source.
- **Channels:** `arm` (deg; 62 rest, −8 holding out a hand), `tilt`, `lookX/lookY`, `lid` (1 = flat lid, 2.4 = closed), `cheek` (1 = happy crop), `amb` (night ambient tint 0.3–0.45), `xray` + `bones`/`vessels`/`lungs`, `cosmos` (0→1 star-field fill wiping up from the feet; ON's cosmic silhouette).
- **Methods:** `c.to(channel, t, v, dur, ease)`, `c.hop(t, h)`, `c.blink(t…)`, `c.hand()`.
- **Idle:** bob ±4 px over a 2.4 s period, tilt ±1.2°, antenna lag ±3.5°, arm ±2°, lamp flicker.

**Other kit objects:**
- `KZ.orb` (planets, nuclei, rocks, with `bands`, `rim`, `hi`), `KZ.planetEarth`, `KZ.ringPlanet`, `KZ.galaxy`, `KZ.crystal`
- `KZ.stars` (twinkle field + sparkles), `KZ.foliage` (two-tone strap-leaf fan + dotted coral, sways)
- `KZ.world(planes, KZ.DAY|KZ.NIGHT, {cx, groundY})` for the full layered landscape; `KZ.sun`
- `KZ.pill(g, x, y, text, {fill, t, out, anchor, size, ink, sfx})`

The sample scene also contains reusable atoms (glow + stepped halo + orbit ellipses + a 7-ball nucleus), fusion events, an onion cutaway (quadrant clipPath + scaled rings) and supernova shells. Copy them from `assets/sample/scene.js`.

## 6. Motion grammar
| use | GSAP ease | duration @30 fps |
|---|---|---|
| camera drift / pan / truck | `sine.inOut` (rig default) | 3–8 s, 2–6 % zoom/s |
| dive into an object | `power3.in` with a pivot on the target | 0.8–1.5 s (24–45 f) |
| arrival settle after a dive | `expo.out` from z 1.6–1.8 → 1 | 0.6–0.9 s |
| pull-back out of an object | `power3.in` toward z 0.25–0.3, then the next scene `expo.out` from z 3.3–3.6 | 0.6 s + 0.8 s |
| silhouette pull-back (T4) | `sine.inOut`, z 8.5 → 1 | 2.4 s |
| pops (icons, atoms, stars, planets) | `back.out(1.6–2)`, scale 0 → 1 | 9–15 f, stagger 3–6 f |
| pill | width grows from centre `back.out(1.5)`; text +3 f; connector draws +4 f; ring dot +7 f | 9 f |
| implode / exit | `back.in(2)` to 0 + expanding ring + 6 sparkle shards | 10 f |
| light ramp / white-out | `power2.in` | 18–20 f |

- **Sync.** Objects arrive 0.15–0.35 s **before** their noun (`X.pop(el, W(line, 'noun') - 0.25)`). Pills and title letters land 0–0.2 s **after** the word. Big transitions peak on the first stressed word of the new sentence (dive swap = `L(next).start`).
- **Holds.** Use camera holds (repeat a key) while things are being named, so ~10 % of the time is still. Everything on screen > 2 s needs idle life: twinkle, bob, ray rotation, halo breathing ±3 %, foliage sway ±2°.
- **Determinism.** For anything that changes more than once, use `KZ.ch()` channels plus `X.every`, not repeated `.to()` calls on one property. `KZ.fade` sets `immediateRender:false`, so several fades on one element are safe.

## 7. Transitions
Every scene sits in its own `X.scene` with an inner `fg` group, its own `KZ.rig`, and fades of 0.3–0.36 s. Overlapping windows plus a crossfade at the dive peak keep the ffmpeg scene score under the cut threshold: the sample measures **0 cuts in 74 s**.

| name | build | frames | when |
|---|---|---|---|
| T1 continuous zoom | rig keys with log-space z, e.g. `{t, z: 0.93}` → `{t, z: 1.02}` | 90–240 | under explanation |
| T2 dive into object | `{t: tNext + 0.1, x, y, z: 30–80, ease: 'power3.in', pivot: [x, y]}`; next scene fades in from `tNext − 0.25` over 0.3 s, settling z 1.7 → 1 `expo.out` | 25–45 + 20 | hand → atoms, star → core, Earth → home |
| T2b pull out | outgoing rig `z → 0.3 power3.in` + fade out; incoming rig starts at z 3.3 on the matching point and settles `expo.out` | 20 + 25 | core → cutaway, atoms → night |
| T4 silhouette reveal | critter `cosmos0: 1`, rig z 8.5 → 1 over 2.4 s, then `cosmos → 0` and the eye opens | 72 | the opening (and `cosmos → 1` at the close) |
| T5 white-out | `whiteCh 0 → 1 power2.in` over 0.62 s + a core bloom r → 1700; hold 0.3 s; linear fade 0.6 s into the next scene | 19 + 9 + 18 | explosion, light takeover |
| T6 burst flash | a radial bloom overlay (not uniform white, which reads grey) to 0.95 over 0.18 s, plus 10 tapered rays scaling 0.1 → 1.5 `expo.out` | 15 | ignition |
| T7 relight / palette swap | stack a second opaque palette copy (`KZ.world` twice, same seeds) and crossfade its opacity; or full-frame radial tints under the subject | 7–24 (montage) / 45–84 (calm) | day→night, x-ray, danger red |
| T14 particle assemble | particles lerp from drift to orbit/clump targets on a spiral, `sine.inOut`, staggered 0–0.4 s | 60–75 | gravity, disk forming |
| T15 parallax pan-up | rig y −1000 `power2.in`; p4 leaves first, sky barely moves | 50 | "where did it come from?" → sky |
| T16 travel streaks | capsule streaks on p3 flying radially, fading | 30–50 | after the explosion |

Avoid uniform semi-transparent colour over amber (it goes muddy pink). Avoid relights back-to-back within 1.5 s unless they form the montage. A relight longer than 2.8 s that happens during a camera hold usually counts as one scene change.

## 8. Sound
`sound.json`: `{"preset": "ambient-space", "bpm": 80, "sections": [...], "music_under_voice_db": -17, "sfx_db": -4, "lufs": -15, "reverb": 0.5, "end_hit": true}`.
- **Energy map.** 1 for the hook; 2 from the first escalation; **3 exactly on the explosion or white-out** (auto riser + impact); 2 after it; 3 at the montage (75–85 %); 1 under the uplift; 0 for the last ~2.5 s (resolve chord).
- **SFX map.**
  - `woosh_low`: long pull-backs and gravity
  - `zoom_in` / `zoom_out`: dives
  - `pop`: atoms, planets, every other onion layer
  - `blip_up`: the first pill of a group only
  - `bubble`: implode
  - `sparkle`: star fields, cosmos fill
  - `chime`: a light source igniting
  - `impact` + `riser`: collapse → explosion
  - `thud` / `tock` / `blip_down`: the failed-fusion beat
  - `whoosh`: x-ray relights

  Keep it to ~40–50 cues per minute at gains 0.15–0.35; quiet ticks are fine, stacked pops are not.
- **VO.** Calm and curious with no hype. The music ducks under it; the impact lands in a gap before the next line.

## 9. Build recipe
1. Copy `assets/template/` to the new project folder (it includes `kit.js`; keep kit and scene together because the renderer serves only the project and `/engine/`).
2. Write `script.json` following the §3 beat map. Run `ENGINE/make.sh <proj> --draft` to synthesize the voice, then read `data/vo.json` word times.
3. Plan one **set** per scale jump. Per set: `X.scene(name, t0, t1)` → inner `fg` + `KZ.fade` → `KZ.rig(fg, keys)` → planes (`KZ.planes(rig)` + `KZ.world` for landscapes, or `rig.plane(0.1 / 0.3 / 1 / 1.6)` for space).
4. Light each hero (§4 recipe). Place creatures with `KZ.critter` and keyframe their channels on words.
5. Chain sets with T2/T2b/T5/T7 (§7). The dive swap time is the first word of the next line.
6. Add pills for 1–3-word names only. Use one big title moment at ~55 %.
7. `node ENGINE/render.mjs <proj> --stills …` at every beat and **look**. Then `ENGINE/make.sh <proj> --skip-tts --workers 3`.
8. Compare `out/qa/metrics.json` with §2, then iterate on colourfulness first, then scene changes and holds.

Beat-to-kit map from the sample:

| beat | kit calls |
|---|---|
| hook | T4 + `KZ.world(DAY)` + `KZ.sun` + `KZ.planetEarth` |
| inside | T2 into a hand → atoms (`KZ.halo` + `KZ.steps`) + pills → implode |
| question | T2b out to `KZ.world(NIGHT)`, critter `amb: 0.45`, looks up → T15 |
| gas | particles (glowFill) → T7 dark → T14 clumps → T6 |
| stars | `KZ.halo` blue-white + `KZ.rays` → T2 dive into the star |
| core | swirl bg + `KZ.orb` fusion events + light ring |
| cutaway | quadrant clip + rings + labels + `KZ.pill` → red T7 → collapse + shake → T5 |
| supernova | glowing shells + confetti streaks + title → T14 into a disk → planets + pills → T2 into Earth |
| home | x-ray T7 montage → night + ghost stars → day + confetti → `cosmos` fill → wide pull-back + night relight |

## 10. QA checklist
- **Stills to read:** the first frame (not black; for the first scene, `gsap.set(sceneG, {autoAlpha: 1})`), every dive midpoint and landing, the title, the montage, the last frame.
- **Gates:** `cuts_per_min ≤ 1`, `colourfulness ≥ 75`, `saturation ≥ 0.68`, `motion_mean 6–10`, `hold 0.09–0.15`, `LUFS −14…−16`, `WPM 160–180`, `scene_len_median 3.5–4.5`.
- **Do:**
  - Use indigo with saturated violet mountains and magenta glows.
  - Rim-light every rounded object.
  - Give each scene one dominant hue family plus amber.
  - Put the densest sequence at 75–85 %.
  - End slow and wide.
  - Fade the foreground plane during wide pull-backs: d > 1 planes shrink toward the centre.
- **Don't:**
  - Use outlines, grey shading or pure black.
  - Fill the screen with text.
  - Use hard cuts or elastic camera easing.
  - Leave flat dark frames without a light source.
  - Use uniform white flashes (they read grey).
  - Overlap two `.to()` calls on one attribute.
  - Copy the channel's birds, logo or outro.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/
