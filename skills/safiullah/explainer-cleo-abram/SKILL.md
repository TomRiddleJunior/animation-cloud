---
name: explainer-cleo-abram
description: "Builds the animated layer of an optimistic, fast-cut science/technology explainer in the manner of Cleo Abram's \"Huge If True\" videos. It uses one lime chip-and-arrow callout system pinned to pseudo-3D \"renders\" (glowing sun, perspective space grid, a rotating spacecraft, a toy astronaut, gradient planets), magnifier zoom-throughs into micro worlds, page-peel wipes into a paper-collage history mode, chunky extruded lime display words and numbers, and a colour-flip title sting. Use it when someone asks for a Cleo Abram style, a \"Huge If True\" style, an optimistic or hopeful science explainer, a YouTube science deep dive animation, lime labels or callouts, space or physics explainer inserts, 3–8 s animation inserts, or a single 35–72 s animated deep dive. Builds on explainer-engine."
---
# Cleo Abram–style animation layer (optimistic science deep dive)

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

This style is the animation that interrupts a fast, host-led, wonder-driven science show. Inserts of 3–8 s (2–3 shots of
one 3D world) arrive every 14–22 s, and once per video there is a 35–72 s animated deep dive. One signal-lime overlay
system labels everything. Objects are "toy-real" stylised renders under soft studio light. History switches to a
paper-collage mode, and the viewer is taken on a second-person journey ("you and I…"). This skill rebuilds that layer
in code: SVG pseudo-3D (gradients, projected geometry), GSAP timing and Kokoro narration. It was built from frame
analysis of 4 source videos (references/sources.md, references/analysis.md). **Original work only.** Do not copy the
channel's wordmark, asterisk glyph, lime-on-teal brand pairing, avatar, intros or end cards. Choose your own title word,
glyph and sting colours, and never use a real person's likeness.

## 1. Signature traits
- **One accent, everywhere.** Lime `#C9F31D` is used for every chip, arrow, data number, highlighter and path.
  Chips are flat, square-cornered rectangles 85–107 px tall, with near-black heavy caps (Archivo Black), no outline,
  no shadow and no gradient. Labels are 1–3 words, with at most 2 on screen.
- **Arrow → chip choreography.** The thick filled arrow slides 30 px toward its target in 4 f. The chip pops 12 f
  later, on the stressed noun, 12–17 f after the cut. The arrow bobs ±8 px along its axis every 0.55 s for as long as
  it is on screen.
- **Toy-real pseudo-3D.** Gradient spheres have an off-centre highlight, a terminator and a rim light. The sun is
  granulated and churning, with bloom and limb darkening. A blue perspective "spacetime" grid recedes to a horizon. The
  square solar sail is projected and spins with live facet shading and glints. The astronaut is a toy figure. 3D
  objects never get outlines.
- **Hard cuts on sentence boundaries,** with re-angle cuts inside one world every 2.7–4.6 s. Every held shot keeps
  pushing (about 3 %/s), bobbing or drifting, so there are no static frames.
- **Paper-collage mode** for history and theory. It uses textured off-white paper, boiling graphite pencil, B&W
  engraving cut-outs with white borders, torn typewriter strips, red pencil arrows and Caveat handwriting. A **page
  peel** always opens it. An archive "page card" over a dimmed backdrop gets a **lime highlighter wipe**.
- **Magnifier zoom-through.** A lime anchor dot sits on the object, a faint light cone leads to a white lens with a
  blue ring, the lens scales ×14 with power2.in, and the shot cuts to a flat, saturated micro world.
- **Data and scale moments.** Lime extruded display numbers carry tiny white unit lines. Every size or time claim
  gets a "for scale" device: a lateral truck, a double-arrow measure or a log timeline.
- **Colour-flip title sting** animated on ones. Small honesty tags (`NOT TO SCALE`, `LOG SCALE`, `PAUSED`) sit top-left.

## 2. Target metrics
QA (`out/qa/metrics.json`) is compared against this table. The source values are whole videos that include live
action. The targets are for an all-animation deep dive.

| metric | source range (4 videos) | target | sample (68.4 s) |
|---|---|---|---|
| scene_changes_per_min | 9.4 – 17.7 | **15 – 18** | 15.8 |
| scene_len_median s | 2.2 – 4.6 | 3 – 4 | 3.3 |
| cuts_per_min | 10.6 – 25.7 | 12 – 22 | 19.3 |
| shot_len_median s | 1.4 – 4.1 (animation shots 2.7–4.6) | 2.7 – 4.0 | 3.07 |
| motion_mean | 6.6 – 16.2 | 7 – 12 | 9.7 |
| hold_frac | 0.04 – 0.11 | ≤ 0.11 | 0.005 |
| colourfulness | 36.9 – 61.8 | 40 – 62 | 60.7 |
| brightness | 0.36 – 0.57 | 0.40 – 0.57 | 0.55 |
| WPM overall | 159 – 196 | 165 – 190 | 171 |
| LUFS | −14.6 – −12.9 | −13 to −14 | −13.6 |
| silence_s | 0 – 0.7 | 0 | 0 |

Deliberate deviations:
- The brief asked for the title sting to open the piece, so the first decile of motion runs at about 4× the mean.
  The source hooks run at 1.3–1.5×, with the sting at 50–84 s.
- hold_frac sits below the source range because there is no live action to hold on and every shot pushes.

**Scene changes count only when the palette changes.** The colour histogram is compared 1 s apart, so a dark-space
→ dark-space re-angle cut is invisible to the metric. To reach 15+/min, alternate the plates: dark space, blue
nebula, sun limb, electric-blue diagram, light studio, micro world, paper, dimmed page card. The sample went from 9.7
to 15.8/min this way without adding cuts.

## 3. Script formula
Beat map for a 55–70 s deep dive. An insert is the same grammar compressed to 1–2 sentences.

| % runtime | beat | pattern | sample |
|---|---|---|---|
| 0–5 | title sting (3.2 s, music + SFX only) | one topic word + tiny tagline | "SOLAR SAIL" / "HOW LIGHT CAN FLY A SPACESHIP" |
| 5–17 | second-person hook | "Imagine a ___ with no ___ and no ___, that ___." → "You and I are going to ___." | "Imagine a spaceship with no engine and no fuel, that never stops speeding up." |
| 17–45 | mechanism, 4–5 shots | weird fact → mechanism (magnifier dive) → "2×" beat → everyday comparison → consequence | "On real sails, that push is less than the weight of a paperclip." |
| 45–65 | history in paper mode, 3–4 shots | "And this idea is old!" → name + date → prediction → measurement | "Four centuries ago, Kepler saw comet tails point away from the Sun…" |
| 65–90 | proof, then the "huge if true" future | real mission (date chip) → proposal → scale comparison | "…fast enough to reach the nearest stars in about twenty years. At Voyager's speed? Tens of thousands." |
| 90–100 | calm, reflective close | one sentence of wonder; no CTA, no branding | "Light, the same stuff warming your face right now, could one day carry us to another star." |

- Write one sentence per shot, 7–25 words each. Insert a rhetorical question or a "Wait—" turn every 15–20 s. Use
  only facts you are sure of, attribute proposals as "proposed", and invent no quotes.
- Voice: **Kokoro `af_heart`, speed 1.18** (≈200 wpm while speaking, ≈171 overall), `gap` 0.2, `lead` 3.3 so the
  voice starts after the sting, `tail` 1.5. Give a paper-mode entry 0.4 s of gap.
- Numbers: years work as digits ("1870s", "2010"). Check unusual names with misaki G2P first (`Ikaros` → ɪkˈæɹOz).

## 4. Visual system
**Palette** (`K.C` in kit.js):

| role | hex | use |
|---|---|---|
| signal accent | `#C9F31D` lime | chips, arrows, numbers, highlighter, paths, sting word |
| chip text / outlines | `#15191C` ink | chip caps, display-word stroke |
| extrusion | `#0E1F2E` navy | display-word depth (not the source's teal) |
| space | `#050B11 → #0D2236`, grid `#245D8F`, horizon `#4C8FD0` | render plates |
| blue nebula | `#0A2350 → #1C58AE` | warm/cool re-angle plate |
| diagram blue | `#2B6FF5 → #1646C4`, white grid at 0.42 opacity | flat chart/diagram plates |
| hot body | `#FFF9DC → #FFD65E → #F7A024 → #C2461A` | suns, glows |
| cool accent | `#52BCEA`, lasers `#7FF3FF` | beams, rim lights |
| studio | `#F3F5F7 → #C9CED5` | product-shot comparisons |
| micro world | `#3C7DFF → #1A4CD4`, atoms `#FFF → #7489A8`, film `#F4C064 → #7A3D0E` | magnified surfaces |
| paper | `#ECE4DC`, pencil `#555245`, red `#C8432F` | collage mode |
| lens ring | `#1E6AE8` | magnifier |
| sting set (yours) | `#0E1F2E #2D5BFF #F06A3A #E6E1D6` | colour flips |

**Type** (engine fonts):
- Chips: Archivo Black at font size 0.62 h, with padding 0.4 h on each side.
- Display words and numbers: Archivo Black at 110–260 px, with a 5 px ink stroke (paint-order stroke) and an 8–12 step
  navy extrusion.
- Unit lines and lane captions: Inter 700–800 caps at 26–30 px, tracking 0.1 em. Tags: Inter 800 at 21 px, tracking
  0.14 em, with a lime square bullet.
- Paper mode: Caveat at 52–190 px for handwriting, Roboto Mono for typewriter strips, Libre Baskerville italic for
  printed equations.

**Composition:**
- Put the subject at the centre or on a third. Labels go beside it on a leader line, never over it.
- Data numbers sit in the lower third (y 720–850), and tags sit top-left at (96, 92).
- Keep a safe margin of at least 96 px. Text at 1080p is at least 26 px.

## 5. Characters & objects (kit.js)
| function | construction |
|---|---|
| `K.space(p,{grid,horizon,top,mid,bottom,nebula,drift,scrollZ,scrollX,win})` | gradient, 2 radial nebula blobs, seeded twinkling stars (drift wraps around for trucks), optional `K.grid` |
| `K.grid(p,{horizon,color,gridOp,floor,scrollZ,scrollX})` | perspective floor with lines at y = hz + A/Z and x = vx + B·X/Z, masked fade, scroll for forward or lateral travel |
| `K.sun(p,{cx,cy,r,halo,churn,texture})` | halo + bloom + gradient body + two counter-scrolling feTurbulence layers clipped to the disc + limb darkening + flicker |
| `K.sphere(p,{cx,cy,r,base,hi,dark,light,atmo,atmoR,surface,spin})` | focal-offset radial gradient, terminator overlay, rim stroke, atmosphere; `surface: K.earthSurface(seed,{land,continents,clouds})` scrolls a 4r-wide repeating strip (fake spin). For huge planets use `atmoR` 1.03–1.07 |
| `K.sail(p,{size,billow,light,pose(t)→{cx,cy,spin,tilt,yaw,unfurl,scale},glintGain})` | **the rotating 3D object**: 4 billowed petals projected every frame (perspective f=2600), Lambert + Blinn shading, a moving sheen band, thin-film panel strips, tip masses, a gold hub drum (convex hull), depth sorting and a sparkle glint at the brightest facet. `unfurl` 0.2→1 with back.out(1.4) for a deploy |
| `K.astronaut(p,{x,y,s,rot,phase})` | ~3 heads tall: white suit gradients, orange accents, backpack, a chest panel, a big helmet with a dark gradient visor and highlight; idle float and drift |
| `K.photons(p,{from,dir/dirFn,n,speed,len,size})` | glowing core + glow + tapered tail streams |
| `K.chevrons(p,{x0,y0,x1,y1,n,size,t})` | flow row: 1 f entry stagger, advances one slot every 0.17 s, green→yellow along the row |
| `K.paperclip`, `K.sparkle`, `K.blob` | metal Gem clip; 4-point glint; smooth random blobs |
| `K.microWorld(g,{x,y,w,h,s,surf,win,photons})` | flat magnified surface: atoms on film, photons bounce, a lime push arrow flashes and the surface nudges |

Build a new object the same way: base gradient, then shading overlay, then rim light, then a contact shadow (studio)
or glow (space). Never outline a 3D object, and give it an idle motion.

## 6. Motion grammar (30 fps)
| element | ease | duration | notes |
|---|---|---|---|
| chip entry | `back.out(2.2)` 0.86→1, or a 1-frame hard pop (`mode:'cut'`) | 5 f | lands 12–17 f after the cut, on the noun |
| arrow entry | `power3.out` slide 30 px + fade | 4 f | then a ±8 px sine bob, period 0.55 s, until the cut |
| arrow → chip lag | — | 12 f | `K.arrow(t)` then `K.chip(t+0.4)` |
| leader line | dot pops `back.out(3)`, line `power2.out` | 6–7 f | chip lands as the line arrives (`K.label`) |
| display word / number | `back.out(3)` 1.25→1 | 8 f | stamp or impact SFX; a count-up uses `power2.in` |
| camera hold | `none` | whole shot | `K.push` ≈ +3 %/s (rate 0.028–0.03); reverse it on micro worlds |
| pull-back reveal | `power2.inOut` | 27 f | zoom 2.0 → 1.0 when the object unfurls or appears |
| page peel | `power3.out` | 19 f | 80 % covered by about 8 f |
| magnifier | lens `back.out(2)` in 8 f; zoom `power2.in` ×14 in 8 f | — | cut to the micro world at zoom + 0.28 s |
| highlighter wipe | `power2.out` | 12 f | lime rect behind the phrase |
| idle | sine | continuous | sun flicker, star twinkle, sail spin 0.3–0.8 rad/s, astronaut float, grid scroll |

Build-on order: object → arrow or flow → primary chip → secondary chip → measurement. Each one waits for its spoken
word (spacing 0.5–2.5 s, not a fixed stagger). Chips hold 2–4 s and leave with the cut. Fade them (6 f) only when the
shot continues without them, for example `out: T.zoom` before a zoom-through.

## 7. Transitions
| name | build | frames | when |
|---|---|---|---|
| T1 hard cut | `shot()` boundary + `K.cut(t)` whoosh | 0 | default (≈80 %) |
| T2 re-angle | same world, new framing or scale | 0 | 1–2 per insert; **change the plate palette** so it reads as a scene change |
| T4 page peel | `K.pagePeel(sceneGroup, t, {dur:0.62})`; keep the outgoing shot alive until t + 0.62 | 19 | always into paper mode |
| T5 magnifier | `K.magnifier(cam,{anchor,c,r,t,tLens,tZoom,content:(g,cx,cy,r)=>K.microWorld(...)})` | 8 + 8 | visible → microscopic, 1–3 per video |
| T6 push-in to sketch | hard cut to a tighter paper composition of the same diagram | 0 | inside paper mode |
| T8 lateral truck | `K.grid` scrollX + `K.space` drift, or a nested truck group `x` tween along a log axis | 30–45 | speed and scale claims |
| T11 title sting | `K.titleSting(X.root, 0, {word, tagline, colors, dur:3.2})` | 96 | once |
| card slide | archive card from x +900, `power3.out` | 6 | paper / UI-card beats |
| pull-back | nested zoom group (see sample s10) | 27 | reveals |

## 8. Sound
- `sound.json`: preset **`tech-glow`** at bpm 104, `music_under_voice_db` −17, `sfx_db` −3, **`lufs` −13.5**,
  `end_hit: true`.
- Energy sections follow the story. Sting 3 → hook 1 → mechanism 2 → paper 1 → proof 2 → future reveal 3 (the impact
  is automatic) → close 0.
- SFX map:
  - every cut: `whoosh` 0.12 s before.
  - chip: `pop` at pitch 1.3.
  - arrow: soft `swoosh`.
  - display word: `stamp`. Data number: `impact`.
  - count-up: `tick` ×6, with a `riser` under the speed build.
  - pencil: `scribble`. Peel and cards: `paper`. Torn strip: `type`.
  - magnifier: `blip_up` + `pop` + `zoom_in`.
  - glints and unfurls: `sparkle` + `whoosh`. Lasers: `zoom_out` + `impact`.
  - sting: `impact`, `boing`, `blip`s, `stamp`, `ding`.
- VO delivery is bright and quick, with questions that rise. The music bed never stops (silence_s = 0).

## 9. Build recipe
1. Copy `assets/template/` (index.html, kit.js, scene.js, script.json, sound.json) to the project folder. kit.js
   must sit inside the project, because the renderer serves only the project and `/engine/`.
2. Write `script.json` from §3, one id per shot. Run `ENGINE/make.sh <proj> --draft --workers 3` and read
   `data/vo.json` word times.
3. In `scene.js`, build a cut map `T` from `X.line(id).start/end` and `X.word(...)`. Cut 0.1–0.2 s before a line
   starts. Note that `X.word` matches by prefix ("at" also matches "atom"), so pick distinctive words.
4. Use one `shot(name, t0, t1, build, {push})` per shot (see the template helper). Calls per beat:
   - **hook:** `K.space({grid})` + `K.sun` + `K.sail` + `K.arrow`/`K.chip` pairs + `K.tag('NOT TO SCALE')`.
   - **you-journey:** `K.astronaut` + `K.arrow(down)` + `K.chip('YOU')` 12 f after the cut.
   - **fact:** a big `K.sun` limb + `K.photons` + a hero object + `K.label` (leader) + an arrow and chip.
   - **dive:** `K.magnifier` with `K.microWorld` content, then a micro-world shot with a `2×`-style chip and bobbing
     measure arrows.
   - **comparison:** a studio plate + `K.paperclip`/objects + a `K.display('<')` glyph + chips. On light plates use
     dark-slate arrows (`#39424E`).
   - **flow:** `K.chevrons` rows into the object.
   - **speed:** a diagram-blue plate + `K.grid({scrollX})` + streaks + `K.dataNumber` + `K.countDisplay` + segment bar.
   - **history:** `K.pagePeel` → `K.paperBG` + `K.pencil` + `K.display('400 YEARS AGO')` + `K.cutout(draw)` +
     `K.chip('NAME, YEAR')` → push-in sketch with `K.write` handwriting + red pencil arrows → page card over a
     dimmed backdrop with a highlighter wipe → `K.torn` caption.
   - **proof:** a pull-back reveal + `K.dataNumber('2010','JAPAN')` + a moving leader.
   - **future:** beams and probe → streak shot with `K.dataNumber('~20 YEARS', …)` → log-scale lanes + truck.
   - **close:** a big `K.sphere` Earth + a distant star + a tiny glinting sail + one chip, `push {to:1.05}`.
5. Never tween the same group twice on the same property (for example a push plus a truck). Put trucks and zooms on
   a nested group. Pass `win: [t0, t1]` to every kit object so per-frame work stops while it is hidden.
6. Iterate with `node ENGINE/render.mjs <proj> --stills …`, then render the final with
   `ENGINE/make.sh <proj> --skip-tts --workers 3` and check QA.

## 10. QA checklist
- **Stills** at every chip landing, at the peel midpoint (+0.25 s), at the zoom (tZoom + 0.14) and on the first frame
  of each paper shot. Check that:
  - no chips overlap, even after the camera push;
  - anchor dots sit on the object;
  - leader lines still meet a moving target;
  - text is at least 26 px.
- **Gates:** scene changes 15–18/min · shot median 2.7–4.0 s · hold ≤ 0.11 · colourfulness 40–62 · brightness
  0.40–0.57 · WPM 165–190 · LUFS −13 to −14.
- `strips.jpg` must show the arrow before the chip, a page peel with a lit flap and shadow, and continuous motion.
- **Do:**
  - one accent;
  - 1–3 words per chip;
  - a for-scale device on every big number;
  - honesty tags;
  - a calm final 10 %;
  - a new plate palette on each re-angle.
- **Don't:**
  - rounded or outlined chips;
  - slow chip fades (more than 8 f);
  - outlines on 3D objects;
  - mixing render, paper and UI modes inside one shot;
  - paragraphs on screen;
  - real-person portraits;
  - the source's wordmark, asterisk, or lime-on-teal end card.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/ (runnable 14 s demo;
reference sample: `assets/sample/` → `out/cleo-abram.mp4`)
