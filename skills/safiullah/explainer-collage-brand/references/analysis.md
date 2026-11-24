# Collage brand explainer — selective colour, photo cut-outs, flat architecture

Analysed 2026-10-27. Main source: HubSpot "Video Has Changed" (`frames/HDei5rr76ew/` plus direct measurements on
the 1280×720 MP4: ORB camera tracking, 4–8 fps frame sheets, k-means and saturated-pixel colour sampling).
Two Vimeo pieces are **style references only**: only poster frames were available (one poster frame and the
public oEmbed metadata for each). Nothing about their motion, timing or sound is measured. Values marked
*inferred* could not be measured.

---

## 1. Identity

A 2-minute brand manifesto built as a **paper-collage world with one colour switch**:

- **The world.** Greyscale, halftone-textured photo cut-outs (an astronaut, the moon, a footballer, news anchors,
  an office worker, a hand on a lever) are placed into flat, three-value axonometric architecture on a slate-violet
  ground. Stippled grain sprays stand in for smooth gradients around light and shadow.
- **The colour rule.** Saturated colour — a sunset gradient (pink → coral → peach) plus cyan — appears only where
  "video" lives: screens, a portal on a giant blank billboard, ribbons, the play-triangle motif. When the script
  turns to making video for today, the whole world flips to a saturated teal field. The saturated-pixel share jumps
  from 0–13 % to 67–93 %.
- **Motion.** The camera travels rather than cuts (2.6 cuts/min, first cut at 24 s). There is no on-screen text
  until the end lockup.

The Reddit opener praised exactly this: "selective use of colour, and the palette".

## 2. Sources analysed

| id | title | dur (s) | cuts/min | median shot (s) | motion mean / p90 | hold_frac | colourfulness | WPM (overall / speech span) | LUFS |
|---|---|---|---|---|---|---|---|---|---|
| HDei5rr76ew | HubSpot — Video Has Changed: Why Your Business Strategy Should Too (2018) | 116 | 2.58 | 14.77 | 4.57 / 11.84 | 0.125 | 53.2 | 127.5 / 138 | −23.1 |
| vimeo 367769463 | "Rutger Bregman on Taxes" — motion quote, Yaniv Fridman, personal project with Cypher (2019) | 78 | n/a (poster only) | n/a | n/a | n/a | n/a | n/a | n/a |
| vimeo 220330346 | "CNN Colorscope: Green" — animation Jorge R. Canedo E., design Rafael Mayani, for CNN International (2017) | 89 | n/a (poster only) | n/a | n/a | n/a | n/a | n/a | n/a |

HubSpot facts: 5 hard cuts; shot p10–p90 3.7–39.6 s; 247 caption words; 2.2 s total silence; dark-frame fraction 0.0;
`animated_frac` 1.0.

## 3. Measured pacing

| quantity | value | practice |
|---|---|---|
| hard cuts | 5 in 116 s (2.58/min); first at 23.9 s | build 3–4 "worlds" and travel inside each; cut only between acts |
| median shot | 14.8 s (p90 39.6 s) | one act is one continuous camera journey |
| motion | mean 4.57, p90 11.84 | calm baseline with sharp transition spikes (iris, pull-back, ribbon flight) |
| hold_frac | 0.125 | almost never static: drift trucks of 0.4 % W/s on "held" scenes (news desk 10–16 s), slow pull-outs of about 1 %/s (billboard 27–33 s) |
| fast moves | opening truck about 33 % W/s, linear (3.5–5.5 s); corridor pull-back 1 → 0.35× in 3 s with about 65 % of it in the first second | power3/expo.out reveals |
| colour arc (saturated-pixel share) | 0–64 s: 0–13 % (median about 2 %); 68–96 s: 67–93 %; 100–112 s: 2–5 % (colour only inside the play glyph); 113–116 s: logo on an orange field | colour is the plot, not the decoration |
| motion deciles | 7.1, 2.9, 6.9, 3.9, 5.9, 4.5, 1.9, 3.9, 5.5, 3.1 | a pulse alternating build / travel about every 12 s |
| speech | 247 words; 127.5 WPM overall, 138 WPM in the speech span (1.4–108.6 s) | slower than editorial explainers; lines land on the pictures |
| loudness | −23.1 LUFS; 2.2 s silence | quiet master, continuous music bed |

## 4. Script & narrative structure

**Manifesto in five acts** (116 s):

| time | % | act | picture | colour state |
|---|---|---|---|---|
| 0–15 s | 0–13 | **Hook: without video you would never have seen these sights** | a play glyph launches a dashed thread; the moon grows on it; astronaut, then footballer; a news desk of two eras | greyscale photos on gradient blobs (about 5–13 % colour) |
| 15–35 s | 13–30 | **How viewing changed**: many screens; anyone can make and distribute video | iris into an axonometric office; colour pops onto each device; pull back to a giant blank billboard where a gradient portal grows | colour only on screens and the portal |
| 35–58 s | 30–50 | **The problem**: business video strategy is stuck in 2008, left to big brands and agencies | a man in a white doorway; pull back into a dark labyrinth; industrial film machinery | fully grey (0 %) |
| 58–64 s | 50–55 | **The pivot**: leave the old approach behind | a photo hand pulls a lever; colour screens light up; a gradient cable runs out | colour seeps in |
| 64–96 s | 55–83 | **The new rules**: three parallel "video today should be…" claims (personal, short, part of the whole strategy) | saturated teal world: machines with glowing tubes; screens fill with collage (a dog and a man, a skateboarder, a palm); a billboard on a building | 67–93 % colour |
| 96–108 s | 83–93 | **Product reveal**: the new feature is introduced | ribbons trail a play triangle that flies in; ring burst to navy; the triangle fills with gradient blobs | navy with colour only inside the glyph |
| 108–116 s | 93–100 | **Tagline + lockup** | small tracked "INTRODUCING" over the product name (3.8 s); cut to the logo on an orange gradient field | brand colour |

**Rhetoric.** Three parallel then/now contrasts, then a triplet of "video today should be…" imperatives, each
followed by a one-line justification. Concrete cultural touchstones open the film (a moon landing,
a football goal, two eras of news anchors). The hook works by recognition: famous imagery whose meaning is "you
saw this because of video".

**CTA.** None spoken beyond the tagline. The end card is a product-name lockup, then the logo.

## 5. Visual system

**Palette roles (HubSpot)**

| role | hex | note |
|---|---|---|
| ground (old world) | slate-violet `#5F657A` / `#63667B` | the opening and corridor acts |
| deep shadow / navy | `#2E3D4E` / `#324052` (28 % of all pixels) | cast-shadow shapes, dark planes, end-card ground |
| light planes | `#DDDEE4` / `#E5E4E2` | tops of blocks, office walls |
| mid planes | `#A1A8B2` / `#9C9EAC` | side faces |
| cream / screen white | `#FCF6F0` | light doors, blank screens, play glyph |
| new-world field | teal `#2BC8A1` (on-screen); k-means `#1CB6A0` | act 4 ground |
| gradient (video) | pink `#E25B77` → coral `#F38465` / `#E67776` → peach `#EBA577`; with cyan `#8DD6DA` | screens, portals, ribbons, blobs |
| accent line | thin warm gold (*≈ `#E0B060`*) and dashed pink | the "thread" in the opening |
| photo cut-outs | greyscale with visible halftone / dither, sometimes a blue-grey tint | never coloured |

**Shape language.** Axonometric boxes (about 30° oblique). Each object has exactly three flat values: top light,
left mid, right dark. Soft organic blobs carry gradients. Circles are planets, rings and portholes. The triangle
play glyph is the hero motif. There are no outlines anywhere.

**Texture.** Halftone or dither on every photo. **Stipple spray** (dithered noise falloff) replaces smooth
gradients at light sources (the white doorway flood at 34–36 s) and at shadow edges. Concrete or wallpaper
surfaces carry faint photographic texture at low contrast.

**Lighting.** Flat values, plus one light source per scene expressed as a cream shape with a stipple halo. Cast
shadows are solid navy organic shapes (the floor shadow under the news desks).

**Depth.** Real axonometric depth in the architecture. Photo cut-outs are stood in it like stage flats. The camera
trucks and pulls back to reveal scale (a tiny man in front of a building-sized billboard).

**Composition.** Centred hero object with 30–50 % empty ground around it. A horizontal "thread" axis at
mid-height in the opening. Recurring big-small scale contrasts.

**Typography.** Only the end lockup: small tracked caps label ("INTRODUCING", about 1.2 % of frame height)
centred above a medium-bold humanist sans product name (about 4 % of frame height). Free look-alikes: Nunito Sans
SemiBold or Lexend Medium. Don't recreate the brand's wordmark.

**Vimeo references (posters only — style cues, not measurements)**

- **367769463, "Rutger Bregman on Taxes" (motion quote)**
  - Ground near-black `#010101` (89 % of the poster) with white dust speckle. Pure monochrome: white `#FDFDFD`,
    greys `#C9C9C8` / `#575757`.
  - Top row of small monospace caps in three slots (left: series name, centre: venue, right: "002 / 2019"),
    cap height about 2.2 % of frame height, at y ≈ 6 %.
  - Title: very wide-tracked monospace caps (about +300 tracking, cap height about 12 % of frame height), stacked
    in three lines. The key word is filled with scanned typewritten-document texture, with a slightly offset
    duplicate creating a xerox ghost.
  - A torn photocopy strip of noisy black-and-white texture runs along the bottom 4 % of the frame.
  - The look is xerox collage plus kinetic typography synced to a real speech excerpt. Free look-alikes: Space Mono,
    IBM Plex Mono, JetBrains Mono.
- **220330346, "CNN Colorscope: Green"**
  - **Single-hue palette.** Field `#157E43` (92 %), dark `#0D4728`, mid `#45B97D`, mint `#86DDAF` / `#C0E8D4`,
    off-white `#F7FAED`.
  - Flat vector, no outlines, isometric open book with sprouting leaves and stems; one centred object about 45 %
    of frame width.
  - It isn't collage. It is relevant only as the strictest form of palette discipline: one hue per episode, values
    doing all the work.

## 6. Characters & objects

- **People are photographs, never drawings.** Greyscale cut-outs of anonymous figures (anchors, an office worker,
  a man in a doorway, a footballer, an astronaut, a lone figure at a window, a hand on a lever). They are posed and
  static. They don't act: they appear, or the camera reveals them. Faces are small. The person is a symbol of an
  era or role, not a character.
- **Objects are flat axonometric constructions:**
  - news desks with studio lights (the lights themselves are halftone photo cut-outs);
  - an office;
  - an industrial building with a building-size blank billboard;
  - film-era machinery (reels, a conveyor, a camera);
  - a lever box;
  - retro tube-and-pipe "video machines";
  - screens on stands, phones, a billboard on a tower.
- **Hero motif.** A cream play-triangle with echo copies (pink, cream, outline) that launches the film, flies with
  gradient ribbons, and becomes the product glyph. In a rebuild, replace it with an original glyph for your own
  product or idea.

## 7. Camera & transitions catalogue

| # | move / transition | construction | duration (24 fps) | easing | count |
|---|---|---|---|---|---|
| 1 | **Thread launch + truck** | a glyph pulses (ring), echoes into 3 copies; a dashed line extends right; objects scale up from a point on the line (moon 0 → 1 in 16 f); camera trucks right at about 33 % W/s through a horizontal collage (moon → astronaut circle → lander → gradient swoosh → footballer) | about 8 s | grow: back.out(1.2) *(inferred)*; truck: linear | 1 (opening) |
| 2 | **Build in place** | locked camera; scene assembles in order: floor shadow → furniture → photo person → devices → colour pops on screens, one every 0.5–1 s | 4–6 s | power2.out pops | about 4 |
| 3 | **Drift hold** | after a build, slow truck of 0.4 % W/s | 4–6 s | linear | most holds |
| 4 | **Iris wipe** | a light circle grows from a point on an object to fill the frame and becomes the next scene's wall | about 10 f (0.4 s) | power2.in (accelerating) | 1 |
| 5 | **Pull-back reveal** | from an abstract surface (a grey gradient wall) to a giant billboard and building with a tiny figure; later from a lit doorway to a dark labyrinth | 2–3 s, then about 1 %/s continuing | expo/power3.out (65 % in first second) | 2 |
| 6 | **Stipple light-flood** | a cream light shape expands with a dithered noise halo until it fills the frame, then resolves to a doorway | about 1 s | sine.inOut | 1 |
| 7 | **Colour seep / colour pop** | grey screens or objects receive gradient fills one at a time (each pop about 6 f); in act 4 the whole ground switches to teal at a hard cut | 6 f each | power2.out | about 15 |
| 8 | **Slide to next set** (teal act) | camera slides horizontally from one machine vignette to the next | 0.5–1 s | power2.inOut | about 3 |
| 9 | **Ribbon flight** | 3–4 parallel rounded strokes in gradient colours trail a cream triangle along an S-curve; the triangle rotates to point right and settles centre; ribbons retract into it | about 1.5 s flight, 1 s retract | power2.inOut | 1 |
| 10 | **Ring burst** | navy circle grows from the glyph, two concentric rings expand past frame edge; navy fills the frame; the glyph fills with gradient blobs | about 12 f (0.5 s) | power2.out | 1 |
| 11 | **Hard cut** | between acts (24 s, 60 s, 64 s) and to the logo card (113 s) | — | — | 5 |
| 12 | **Lockup** | blob clusters drift in from top and bottom; tracked label and product name fade-slide in; hold 3.8 s; cut to a brand-colour field with logo build | 4–6 s | power2.out | 1 |

## 8. Motion grammar

- **Narration sync.** The hero object of each line appears on its noun. The moon grows during the first "look at
  this" line (1.4–3.5 s). The footballer slides in on the second one (4.8 s). Device colour pops follow the spoken
  list of screens. The lever is pulled as the VO consigns old video to the past. The world flips to colour on the
  line that starts the "video for today" section (64 s).
- **Ease families.** Arrivals ease out (power2/3.out) with a slight overshoot on circular "planet" grows (*inferred*).
  Reveals are expo.out pull-backs. Traveling trucks are linear. Wipes accelerate (power2.in).
- **Stagger.** 0.5–1 s between colour pops; scene-assembly parts 0.25–0.5 s apart in back-to-front order (shadow,
  structure, person, screens).
- **Idle.** Constant slow camera drift; gradient blobs may slowly morph (*inferred*). Photo people never move.
- **Holds** are short (hold_frac 0.125). Every scene keeps travelling. The longest locked-camera stretch is a build
  (office, 18.5–23.5 s: 0 % drift while colour pops).

## 9. Sound

*Audio inferred from transcript and metrics.*

- **VO.** One calm, warm corporate narrator, 138 WPM while speaking, with short pauses at the act breaks. The voice's
  gender and accent are unknown.
- **Music.** A continuous bed (only 2.2 s of silence in 116 s). *Inferred:* light electronic or indie pop at about
  100–120 BPM, rising at the 64 s colour switch and at the product reveal.
- **SFX** *(inferred)*: whooshes on the iris, ribbon flight and ring burst; soft pops on colour fills; a sting on the
  logo.
- **Mix.** −23.1 LUFS integrated (very quiet master; normalise to about −16 to −18 for web).

## 10. Do / Don't

**Do**

1. Write the film as a before/after argument and **encode it in colour**: the "before" world is greyscale or
   navy-slate (saturated pixels under 5–10 %), the "after" world fully saturated (above 60 %).
2. Let colour appear first only on the thing you are selling (screens, portals, a glyph), then flood the world at
   the pivot line.
3. Use greyscale, halftone photo cut-outs for people and iconic objects; never colour them.
4. Build architecture as flat axonometric boxes with exactly three values per object and no outlines.
5. Replace smooth gradients in lighting with stipple or dither spray. Keep gradients for the "video" colour only.
6. Travel instead of cutting: one camera journey per act, about 4 acts, about 5 hard cuts in 2 minutes.
7. Reveal scale with expo-out pull-backs (tiny figure, giant structure).
8. Assemble scenes on camera in back-to-front order, with colour pops 0.5–1 s apart, synced to a spoken list.
9. Give the film one recurring hero glyph that opens it, travels through it and becomes the end lockup.
10. Keep on-screen text to the final lockup. The VO and pictures carry the argument.
11. Open on universally recognisable imagery (built from your own or licensed photos) to set the theme in 5 s.
12. For a motion-quote variant: monochrome, monospace caps, scanned-paper texture inside letters, xerox strips,
    dust; words timed to the quote.

**Don't**

1. Don't colour everything from the start. You lose the switch, and the switch is the style.
2. Don't use outlines, cartoon faces or rigged character acting.
3. Don't use more than one gradient family (sunset + cyan) for the "colour" state.
4. Don't use smooth airbrush gradients for shadows. Use solid navy shapes and stipple.
5. Don't cut on every sentence or use fast montage.
6. Don't fill the frame. Keep 30–50 % calm ground around the hero.
7. Don't use bouncy UI easing on architecture. Bounce only the small circular grows.
8. Don't add text callouts, bullet lists or captions mid-film.
9. Don't copy the source's play-glyph-plus-ribbon motif, its logo sting or its orange brand field. Invent your own
   glyph and end colour.
10. Don't use recognisable real people or famous photos you have no rights to. Use licensed or original photos.
11. Don't put a real public figure's words in a motion quote without rights. Write an original quote or use your
    own speaker.
12. Don't master at −23 LUFS for web delivery.

## 11. Replication recipe (code)

**Layer stack** (1920×1080 SVG, GSAP paused timeline rendered per frame at 24 fps):

```
z0  ground     <rect fill="var(--ground)"/>        --ground animates #5F657A → #2BC8A1 at the pivot
z1  cam        <g id="cam">  (truck / pull rig)
      architecture  axonometric <polygon>s: top=var(--light) left=var(--mid) right=var(--dark)
      shadows       navy organic <path>s (#2E3D4E)
      photos        <image> cut-outs → filter #halftone (greyscale + dot screen)
      colour layer  screens/portals/blobs with <linearGradient id="video"> (#E25B77→#F38465→#EBA577, #8DD6DA)
      stipple       light halos: filter #stipple masked by radial gradient
z2  glyph/ribbons hero motif (own design)
z3  lockup        end card text
```

**Recipes**

- **Halftone photo.** Pre-process the photo in canvas: greyscale, then an ordered-dither or dot-screen threshold at a
  6–8 px cell, exported as PNG with alpha. Live SVG alternative: `feColorMatrix type="saturate" values="0"`, then
  `feComponentTransfer` with gamma for contrast, then `feComposite` against an `feImage` dot-pattern tile
  (`arithmetic k2=1 k3=1 k4=-0.5`) and a discrete `feComponentTransfer` (`tableValues="0 1"`) to threshold.
  Optional tint: `feColorMatrix` toward `#6F7BA0` at 15 %.
- **Stipple halo.** `feTurbulence baseFrequency="2.2" numOctaves="1"` → `feComponentTransfer type="discrete"
  tableValues="0 0 1"` (hard dots) → `feComposite in2=radialGradientMask operator="in"`; fill cream `#FCF6F0`.
- **Axonometric box helper.** `box(x, y, w, d, h)` returns three polygons using a 30° oblique projection; fills come
  from CSS variables so the colour switch can recolour the world in one tween:
  `gsap.to(root, {"--light": "#F7F3EC", "--mid": "#3B8682", "--dark": "#275258", "--ground": "#2BC8A1", duration: 0})`
  at a hard cut, or over 0.6 s for a seep.
- **Selective-colour state machine.** Keep every non-hero fill in a desaturated set. Hero fills use `url(#video)`
  with `opacity 0`; a pop is `opacity 0→1, scale 0.9→1, 0.25 s power2.out`. Track a `sat` budget per act
  (old ≤ 0.10, pivot ≤ 0.3, new ≥ 0.6) and verify by sampling rendered frames (share of pixels with HSV S > 0.4 and
  V > 0.4).
- **Iris wipe.** `<circle r=0>` at an object's screen position; `r → hypot(W, H)` in 0.4 s (`power2.in`); its fill
  becomes the next scene's wall colour.
- **Pull-back reveal.** `cam.s` from 2.9 → 1.0 in 3 s with `expo.out`, then continue `1.0 → 0.97` linear over 3 s.
- **Truck along a thread.** World laid out horizontally; `cam.cx += 0.33*W` per second (`ease: none`); objects spawn
  just before entering frame with `scale 0→1, back.out(1.2), 0.65 s`.
- **Ribbon flight.** 4 parallel offset paths (offset 14 px) along one S-curve; `strokeDashoffset` drives the trail
  length; the glyph follows the path (MotionPathPlugin, free since GSAP 3.13) with `autoRotate`, 1.5 s
  `power2.inOut`; retract by animating the dash offset forward 1 s.
- **Ring burst.** Navy circle `r 0 → 0.75·W` and two rings (`stroke 60 px`) `r 0 → 1.2·W`, 0.5 s `power2.out`,
  rings staggered 0.08 s.
- **Motion-quote variant** (Bregman-like, from the poster): `<text>` in a monospace font with letter-spacing 0.3 em;
  key word gets `fill="url(#scanPattern)"` where the pattern is a scanned typed-document image; a duplicate offset
  (4 px, 3 px) in black at 60 % behind it; a header row of three small caps labels; a bottom strip of xerox noise
  (feTurbulence with high contrast); per-frame dust (`seed = frame`). Reveal words on the quote's word timings
  (Kokoro TTS or your own recorded speaker), 2–4 f per letter, `steps()` easing.
- **Single-hue variant** (Colorscope-like): pick a hue H; derive 5 tints at HSL lightness 25/38/50/78/94 % and
  saturation 70/65/55/45/30 %; flat shapes only; one centred object; grow animations (stems as stroke draw-ons,
  leaves `scale 0→1 back.out`).

**Minimal skeleton**

```js
const tl = gsap.timeline({paused:true});
// ACT 1 – thread truck (0–15 s)
glyphPulse(tl, 0.0); echo(tl, 0.5, 3); dashedThread(tl, 1.0, {to: 6*W});
spawnOnThread(tl, [ {t:1.2, obj:photoCut("planet.png")}, {t:2.6, obj:photoCut("diver.png"), blob:"video"},
                   {t:4.8, obj:photoCut("runner.png"), blob:"video"} ]);
truck(tl, 2.0, 8.0, {speed:0.33*W});
buildScene(tl, 8.0, newsDesk, {order:["shadow","desks","people","lights","screens"], stagger:0.35});
drift(tl, 10, 16, {vx:0.004*W});
// ACT 2 – iris into office, colour pops on devices (spoken list)
iris(tl, 16.2, {from:deskLamp, to:"#DDDEE4"});
buildScene(tl, 16.6, office, {order:["wall","floor","door","desk","person","devices"]});
cues(["phones","tablets","computers","TVs","refrigerators"]).forEach(c => colourPop(tl, c.t, device[c.word]));
// ACT 3 – grey problem world, pull-back reveals
cut(tl, 23.9); pullBack(tl, 24.0, {from:2.9, to:1.0, dur:3, ease:"expo.out"});
// PIVOT – lever pulled, world flips to colour
cut(tl, 64.0); setWorld(tl, 64.0, NEW_PALETTE);   // ground → teal, planes → teal-greys
// REVEAL + LOCKUP
ribbonFlight(tl, 96.0); ringBurst(tl, 98.9); lockup(tl, 108.0, "INTRODUCING", "Your Product");
```

**The five shots that define the style**

1. **Grey room, coloured screen.** Axonometric office or news desk, greyscale photo person, gradient colour popping
   onto devices one by one.
2. **Thread truck.** Glyph-launched dashed line; halftone moon, astronaut and athlete cut-outs on gradient blobs,
   travelled past at constant speed.
3. **Scale reveal.** Expo-out pull-back from an abstract surface to a tiny figure before a building-size blank
   billboard, which then fills with a gradient portal.
4. **The colour switch.** Lever or trigger action, then a cut to a saturated teal world where machines feed
   gradient cables into screens filled with photo collage.
5. **Glyph finale.** Ribbon-trailed hero glyph flies in, ring burst to navy, tracked-caps lockup. (Variant: a
   motion-quote title card in monochrome xerox type.)

## 12. Per-video notes

**HDei5rr76ew — HubSpot "Video Has Changed"**

- B2B feature launch disguised as a manifesto.
- 247 words in about 107 s of speech. Only 5 hard cuts. Every person is a greyscale cut-out.
- The colour arc is measurable: 2 % → 0 % → 70–93 % → 3 % → brand orange.
- The play-triangle motif is the brand's own (a product glyph), so don't reuse it.
- The 720p source is sharper than the 480p editorial sources: halftone and stipple dots are visible.
- The colour switch at 64 s lands on the line that opens the "video for today" section.

**vimeo 367769463 — "Rutger Bregman on Taxes" (poster + oEmbed only)**

- 78 s personal "motion quote" project by Yaniv Fridman, made with Cypher. It sets an excerpt of a historian's
  2019 Davos remarks on wealth inequality and taxes.
- Poster style: monochrome black ground, wide-tracked monospace caps, scanned-document texture inside the key word,
  xerox strip, dust grain, a three-slot header like a document masthead.
- Treat as a typographic reference. Motion, timing and sound are unknown.

**vimeo 220330346 — "CNN Colorscope: Green" (poster + oEmbed only)**

- 89 s CNN International commission. Written and narrated by Dr. James Fox; animation by Jorge R. Canedo E.;
  design by Rafael Mayani; music by Giacomo Smith; sound design by Bryan Stone.
- Poster: one-hue flat vector (greens only), an isometric book sprouting leaves.
- A reference for single-hue palette discipline, not for collage.

## 13. Source-list issues

- **Grouping.** Colorscope: Green is flat single-hue vector, not mixed-media collage. It sits in this group only for
  its colour discipline. The Bregman piece is typographic xerox collage (kinetic type), not an explainer. The Reddit
  opener itself called it non-corporate.
- **Provenance in the Reddit thread.** HubSpot and Bregman come from the opening post. Colorscope comes from a
  later comment by a different user, who credits it as "J.R. Canest", the Vimeo handle of
  Jorge R. Canedo E. The same comment's "Yaniv Friedman" is spelled "Yaniv Fridman" on Vimeo.
- **Availability.** Only poster frames and public metadata were available for both Vimeo videos, so every
  statement about them is a still-frame inference.
- **Category label.** whatastory ranks HubSpot #14 under "brand-launch". That is accurate: it launches a product
  feature (HubSpot Video) and ends on the product lockup, though the first 95 s play as a category manifesto.
- **Rights.** HubSpot's motif and logo, and the Bregman piece's use of a real speaker's words, are not reusable. An
  original rebuild needs its own glyph, own brand colour and its own (or licensed) quote, voice and photos.
