# The School of Life — calm illustrated essay films

Analysed 2026-10-27 from `frames/<id>/` plus direct measurements on the source MP4s: frame-to-frame difference
patterns (to detect animating "on twos" and texture boil), ORB camera tracking (push rates), 8–12.5 fps frame
sheets (transition timing) and colour sampling. Values marked *inferred* could not be measured.

> **Headline finding.** The brief describes this channel as "vintage-art collage, cut-out animation". **None of the
> three measured films is collage.** Each credits a different commissioned animator (from the YouTube descriptions):
>
> - Natalia Ramos: flat outlined vector figures;
> - Vale Productions: 3-colour silhouette motion graphics;
> - Sophie Olga De Jong: hand-drawn ink on kraft paper.
>
> What is constant is the **format**: ident, essay voice, one metaphor per sentence, calm on-twos motion, chapter or
> number cards, quiet mix with long pauses, shop or subscribe ending. This file documents that format and the
> three illustration modes seen. A collage variant would follow the same timing rules, but its visual specifics
> cannot be derived from this sample.

---

## 1. Identity

A School of Life film reads as a slow, consoling lecture illustrated by a single picture-book artist. It opens
on the channel's ident sting (about 4.7 s, in 2 of 3 films; the third opens on its title), then one unhurried voice states a universal truth about inner life
while a single drawn figure on a paper-like ground acts out a literal metaphor:

- a woman holds up a vast pair of lips;
- a heart-shaped Venn diagram shows "Good Enough";
- a man stands inside a giant neon numeral.

Motion is gentle (3.2–4.4 mean), animated on twos (12 drawings per second, with paper texture re-boiling on each
drawing), and almost never cut (0.1–2.4 cuts per minute). Sections are announced by full-colour chapter cards or
big numerals that wipe or morph in. The mix is quiet (−20 to −25 LUFS) with long pauses. The film ends with a
spoken plug for the shop and a subscribe card.

## 2. Sources analysed

| id | title (year, animator) | dur (s) | cuts/min | median shot (s) | motion mean / p90 | hold_frac | colourfulness | WPM (overall / speech span) | LUFS |
|---|---|---|---|---|---|---|---|---|---|
| 1JCJVaK48RM | The Eight Rules of The School of Life (2020, Natalia Ramos) | 447 | 2.42 | 21.5 | 3.24 / 7.54 | 0.386 | 44.9 | 138.7 / 143 | −20.0 |
| oocunV4JX4w | Who Am I? (2016, Vale Productions) | 467 | 2.44 | 9.75 | 4.41 / 9.69 | 0.238 | 45.8 | 149.5 / 164 | −24.2 |
| k-J9BVBjK3o | 20 Signs You're Emotionally Mature (2019, Sophie Olga De Jong) | 476 | 0.13 | 238.2 | 3.43 / 8.54 | 0.092 | 88.5 | 147.2 / 152 | −24.7 |
| O4FjeAYDRMQ | Why Heartbreak Can Be the Making of You (recent, 223 s) | — | — | — | — | — | — | — | — |
| 1bmUWt9wejI | Don't Despair (recent, 163 s) | — | — | — | — | — | — | — | — |

The last two were **not analysed** in this pass: both were unavailable for analysis (see
`channel-extras-addendum.md` for the later pass).

Source files: 854×480. 1JCJ and oocun are 24 fps. k-J9 is published at **12.5 fps**, not 13.
Silence totals: 13.3 s, 34.5 s and 43.0 s.

## 3. Measured pacing

| quantity | target range | meaning |
|---|---|---|
| hard cuts | 0.1–2.4 per min (1–19 per film) | change the picture by wipe, morph or camera travel, not by cutting |
| cuts in first 15 s | 0–3 | mostly the ident's colour squares flipping every 0.5 s (Who Am I: one cut, title → first scene at 3.5 s) |
| median shot | 10–22 s; one continuous shot in 20 Signs | a scene evolves for tens of seconds |
| motion mean | 3.2–4.4 (p90 7.5–9.7) | very calm; peaks only in wipes and dissolves |
| hold_frac | 0.09–0.39 | *lower* than Vox although calmer: textures boil and drawings change on twos (below) |
| frame cadence | **on twos** | per-frame diffs at 24 fps alternate about 3.0 / 0.1 (moving) and 0.6 / 0.1 (still) → a new drawing every 2nd frame = 12 drawings/s |
| 20 Signs cadence | 12.5 fps file | diffs alternate 1.1 / 0.0 on action; on holds every frame differs by about 0.8 (hand-drawn line boil about 12 Hz) |
| speech | 139–150 WPM overall, 143–164 WPM in the speech span | measured, but not slow; pauses do the calming |
| silence | 13–43 s per film | 20 Signs: about 2 s of silence per list item; Who Am I: pauses after each rhetorical question |
| loudness | −20.0 to −24.7 LUFS | 6–10 dB quieter than mainstream explainers |
| colourfulness | 45–46 (flat palettes); 88.5 (neon numerals on kraft) | colour rises with the mode, not with the energy |
| camera drift on holds | 0.7–1.2 % scale/s | desk scene +11.8 % in 10 s, easing in and out; Who Am I lamp scene +5.6 % in 8 s |
| travel zoom | 1.0 → 3.1× in 4 s | Eight Rules 3:31 (+1 s 1.41×, +2 s 2.10×, +3 s 2.83×, +4 s 3.09×), ease-in-out |

**Energy curve** (motion deciles):

| film | deciles | pattern |
|---|---|---|
| Eight Rules | 6.8 → 4.3 → 2.0 → 3.2 → 3.6 → 2.4 → 1.9 → 2.8 → 3.7 → 1.8 | highest at the ident and dot intro, lowest on the end card |
| Who Am I | 5.8 → 4.1 → 6.0 → 4.1 → 4.9 → 3.3 → 4.7 → 5.3 → 3.8 → 2.1 | busier mid-film (thought-experiment set pieces), calm end |
| 20 Signs | 2.7–3.8 flat, last decile 5.8 | a uniform list rhythm, with the final item's juggling or unicycle action at the end |

**Section rhythm**

- Eight Rules: intro 36 s (8 %); 8 rules over 36–374 s, mean 42 s per rule (range 27–107 s); recap and CTA
  374–447 s (16 %).
- 20 Signs: title at 5–8.5 s; 20 items in 9–466 s, about 23 s each; end card 10 s.

**Channel drift.** The 25 most recent uploads (`raw/channel_listing.txt`, Oct 2026) have a median of **263 s**
(163–571 s). The sampled films (447–476 s, 2016–2020) are longer than today's norm.

## 4. Script & narrative structure

**Hook (0–15 s)**

- 0–4.7 s: channel ident. Replace with your own ≤ 5 s sting.
- First words at 3.4–4.5 s. Either the title read aloud (20 Signs), a universal observation about how much
  everyone changes over a lifetime (Who Am I), or a wry meta-confession that the channel has made too many films to
  remember (Eight Rules).
- There is no cold-open drama. The hook is an intimate claim the viewer recognises in themselves.

**Beat maps**

| % | Eight Rules (credo / list) | Who Am I? (philosophical inquiry) | 20 Signs (numbered list) |
|---|---|---|---|
| 0–1 | ident | ident-less; title "WHO AM I?" for 3 s | ident |
| 1–8 | why a short credo; dots intro | lifelong change (body, cells, memory) | title card at 5–8.5 s |
| 8–84 | 8 × [chapter card 2–3 s → 2–5 aphoristic sentences, one metaphor scene each] | the question, then candidate answers (body → brain/soul → memory → values), each tested with a thought experiment (body swap, amnesia, brain transplant) | 20 × [numeral morphs in → "You learn / realise that…" 1–3 sentences → characters act around the numeral] |
| 84–92 | recap card: 8 coloured bars stacked one by one, "-1- Accept Imperfection" … | consolation: a paradoxically cheering conclusion | final item (friendship as shared vulnerability) |
| 92–100 | spoken advice to rehearse the ideas, subscribe and shop plug; subscribe + product card | black shop card, then end screen with two video slots | spoken product plug (an "emotional barometer"), then a subscribe + product card on grey |

**Sentence craft.** Second person or inclusive "we". An aphorism followed by a qualifier that complicates it
(harder at first, richer in time). Paradox ("cheerful despair"). Gentle humour.
Each idea gets 2–5 sentences, and **each sentence gets one new image** (about one visual change per 6–10 s).

**Hand-overs**

- chapter cards (Eight Rules, 8 cards, plus "A Final Point:");
- a numeral morphing into the next numeral (20 Signs);
- a shape morph or particle disintegration (Who Am I).

**Ending.** A spoken CTA, then a static card (product photo, "SUBSCRIBE TO OUR CHANNEL", URL) held 10–20 s on mid
grey or black.

## 5. Visual system

**House constants.** A paper-like ground with grain re-randomised on every drawing; a soft vignette (corners
measured 15–20 % darker than centre in Eight Rules); flat fills with no gradients; one subject centred with
40–60 % negative space; figures standing on an implied ground line at about 85–90 % of frame height.

**Mode A — flat outlined vector figures (Eight Rules)**

| role | hex |
|---|---|
| ground | cream `#DCD4CA` (26 %), light `#EEEDE9`, warm grey `#CBC4BB`; vignette to about `#B7ABA6` |
| primary fills | terracotta `#A24530` / `#B1393A`, olive `#4E7225` / dark `#3A463A`, ochre `#B18B52` / `#B6AA45` |
| secondary fills | lilac `#B49AC8`, periwinkle `#7B77CC`, brown `#6F392C` |
| card fields | ultramarine `#3625D2` (rule 1), terracotta (rule 4), olive green (rule 5), red contour-line pattern on kraft (rule 7), lilac ("A Final Point"); some cards sit on cream with a decorative scalloped frame (rule 2) |
| other saturated | dot-intro red `#BB0019`; slate night ground `#383E48` |
| line / text | black outlines; chapter titles in a card-contrasting tint (e.g. `#7B4A2E` on kraft-orange) |

- Line work: black outline about 6–7 px at 1080p (3 px at 480p), round caps and joins, slight hand wobble, no
  hatching.
- Figures: tube limbs, small heads (head:body about 1:7–1:9 with very long legs), Matisse/Cocteau-like single-line
  faces (eyebrow-nose stroke, dot eyes).

**Mode B — 3-colour silhouette motion graphics (Who Am I?)**

| role | hex |
|---|---|
| ground | ink slate `#162023` (65 % of pixels) |
| figure colours | mustard `#E8BF6E`, teal `#4CD3A3` / `#50B8A9`, coral `#C64F62` / `#CC5B61` |
| support | deep blue-grey `#3A5767`, white, brown-black `#2E2C2C` |

- Figures are solid silhouettes with a negative-space face (hair shape plus one line for the nose) and no outline.
- Environments are thin line art: 2 px at 1080p, teal or coral lines on the dark ground.
- One device: a full-frame colour field flipping between the three hues as a scene change.
- Subtle grunge speckle on the fields; a single coral light cone as the only "lighting".

**Mode C — hand-drawn ink on kraft paper (20 Signs)**

| role | hex |
|---|---|
| ground | kraft parchment `#BAB297` / `#B5AE95` (56 %), `#B3A785`; darker paper edge; dust specks |
| ink | black `#1C1B12`, solid-black silhouettes for some figures |
| numerals (neon, one per item) | orange `#F07532`, green `#14FE5E`, magenta `#ED17F7`, cyan `#12F1F3`, yellow `#EDF829` |
| accents | a grey-green `#62685D` |

- Characters are wobbly ink outlines with big heads (1:4–1:5) and a recurring striped jumper.
- Lines are 4–6 px with variable weight and boil every frame.

**Typography**

| where | style | free look-alike | size and placement |
|---|---|---|---|
| chapter cards (A) | bold transitional serif, title case, centred, numbered with hyphens ("-4-" on its own line above) | Merriweather Bold, Domine Bold | title block 45–60 % of frame width; number line about 60 % of title cap height |
| keywords (A) | the same serif, white or tinted, inside a shape ("Ordinary" in a circle, "Perfection" / "Failure" in Venn lobes) | | |
| keywords (B) | thin geometric caps, wide tracking (+150 to +250), one palette colour ("WHO AM I?", "PERSONAL IDENTITY", "COULD I STILL BE") | Josefin Sans Light, Raleway Thin, Poiret One | cap height about 5–6 % of frame height |
| title (C) | hand-lettered thin condensed caps plus one ultra-bold slab word in orange and a rounded-bold cyan "20" | Alfa Slab One (slab word), Fraunces Black (numerals, soft) | |
| numerals (C) | soft-serif ultra-black with rough painted edges | Fraunces Black soft | fill 50–80 % of frame height |

Text quantity is minimal: the chapter or number, and at most one keyword per scene. There are no subtitles.

## 6. Characters & objects

- **One protagonist per scene, sometimes two in dialogue.** A crowd appears only as massed silhouettes (purple
  heads in A, black figures on a stage in C).
- **Acting.** Slow, legible poses held for 2–6 s: head in hand, arms raised, holding a giant object, a gentle
  stride. Gestures change once per sentence.
- **Movement types**
  - A: rigged-puppet-like cut-out limbs drawn on twos (the walk is a wide-stride cycle of about 8 drawings);
    objects pop or slide.
  - B: shape morphs (silhouette ↔ object), particle disintegration, smear morphs; figures rarely walk.
  - C: true cel animation on twos or fours with line boil. Big snappy moves in 2–3 drawings (a large figure
    strides in from frame edge in 3 frames).
- **Recurring props.** Literal metaphors for emotion: thrones, mirrors, Russian dolls, dartboards, giant lips,
  floating brains, scales, empty picture frames, books, Venn diagrams, dot fields, a lightbulb, coffins, hearts.
  Simple, iconic, drawn in the same line as the figures (never photographic).

## 7. Camera & transitions catalogue

| # | transition / move | construction | duration (frames at 24 fps) | easing | frequency |
|---|---|---|---|---|---|
| 1 | **Ident sting** | black square, type builds in, then coloured product squares flip every 12 f | 4.7 s | steps | every film (replace with your own) |
| 2 | **Colour-field chapter wipe** | a full-frame saturated field rises from the bottom (or slides from a side) with a wavy, hand-drawn leading edge; a decorative squiggle line crosses the card; serif title resolves in 6–8 f after the field settles; holds 2–3 s; exits by a side slide | in about 10 f; exit 8–12 f | power2.out in, power2.in out | 8–9 per film (mode A) |
| 3 | **Dot-row build** | rows of circles grow from 0 → 1 left to right (about 2 f stagger per dot); each new row pushes the stack up; then zoom out to reveal the grid; dots scatter | about 0.5 s per row; 7 s total | back.out-ish *(inferred)* | intro (A) |
| 4 | **Shape morph** | silhouette A interpolates into object B (head → full figure; text → paint smear → ring → iris) | 10–20 f | sine.inOut | the main scene change in B |
| 5 | **Particle disintegrate** | a figure or field breaks into irregular blobs that disperse and fade, revealing the dark ground; often combined with an iris circle | about 20 f | power1.in | 3–5 per film (B) |
| 6 | **Iris / porthole** | circle mask expands or contracts; a figure viewed inside a circle | 8–12 f | power2.inOut | B |
| 7 | **Venn / slide-in pair** | two circles slide in from the sides to overlap; the lens is filled black; a keyword fades into the lens | about 1 s, then hold | power2.out | A |
| 8 | **Pop-field** | circles of many colours pop in (scale 0 → 1) over a colour field at about 0.25 s stagger until it is full; keyword circle last | 2–3 s | back.out(1.5) *(inferred)* | A |
| 9 | **Travel zoom** | camera scales 1 → 3.1× in 4 s from a tiny figure to a medium shot; words float in around the figure | 96 f | power2.inOut | 1–2 per film |
| 10 | **Slow drift** | push 0.7–1.2 %/s with a tiny pan | whole hold | sine.inOut | most holds |
| 11 | **Numeral morph + hue shift** (C) | outgoing characters slide off; the numeral morphs into the next digit while its fill shifts hue through a desaturated midpoint (orange → ochre → green) | morph about 5 drawings (0.4 s); hue about 10 drawings (0.8 s) | linear | 19 per film |
| 12 | **Walk-through wipe** (C) | a large foreground figure strides in from the edge and changes the composition | 2–3 drawings | snap | several |
| 13 | **Hard cut** | rare; colour-field to colour-field (B) | — | — | 1–19 per film |

## 8. Motion grammar

- **Cadence.** Render at 24 fps but update drawings every 2nd frame (12 Hz), including camera moves in modes A
  and B. The texture boils at the same 12 Hz.
- **Easing.** Long sine and power2 in-outs. Arrivals settle without bounce, except for small decorative pops.
  No snappy UI eases except the cel snaps in mode C.
- **Stagger.** 2 f per dot in rows; 0.25 s per pop-field circle; recap bars added one per spoken item (about 1 s).
- **Hold lengths.** 2–6 s between gesture changes. Chapter cards 2–3 s. List numerals stay up the whole item
  (about 23 s) while characters act around them.
- **Narration sync.** A new image arrives on each sentence's key noun ("melancholy", "ordinary", "idiot"), and
  keywords are set as text at that moment. Pauses of 1–2 s after a sentence carry a hold or slow drift. Nothing
  moves fast during the pause.
- **Idle / secondary.** Paper-grain boil and, in C, line boil. Hair or cloth flutter in A (a ponytail waving on
  twos). Otherwise stillness.

## 9. Sound

*Audio inferred from transcripts, metrics and credits.*

- **VO.** A single essayist narrator (measured British delivery per the brief; not verifiable here), 139–150 WPM
  overall and 143–164 WPM while speaking, with long sentence-final pauses. Total silence of 13–43 s per film
  (about 3–9 % of runtime) is part of the style.
- **Music.** Who Am I credits a single track ("Woods" by Hawkin). *Inferred:* one sparse, gentle instrumental bed
  per film (piano, soft synth pads or acoustic guitar), 60–90 BPM, low in the mix, with no drops or builds.
- **SFX** *(inferred)*: very sparse. Soft paper or whoosh on wipes, a light chime on numerals or keywords, nothing
  on most scene changes.
- **Mix.** −20.0 to −24.7 LUFS integrated. Rebuilds can master to about −18 to −20 LUFS for YouTube parity but
  should keep the dynamic, quiet feel: VO peaks well above the music, music −20 to −24 dB under VO.

## 10. Do / Don't

**Do**

1. Open with a ≤ 5 s ident, then state one universal truth by 4.5 s.
2. Give every sentence exactly one literal visual metaphor, held 2–6 s.
3. Animate on twos (12 drawings/s) and boil the paper texture at the same rate.
4. Keep the ground paper-like (cream, kraft or ink slate) with a 15–20 % corner vignette.
5. Use a 3–6-colour flat palette per film and save the most saturated colours for chapter or number cards.
6. Announce sections with full-colour wipe cards (serif title, numbered "-n-"), or with big numerals in a list film.
7. Change scenes by morph, particle dissolve, iris or colour-field wipe. Hard cuts are rare.
8. Let pauses breathe: about 1–2 s after key sentences, with only a slow 0.7–1.2 %/s drift.
9. Keep the mix quiet with a single gentle bed and almost no SFX.
10. Close with a recap (list card), a gentle consolation and a spoken CTA, then a static card.
11. Keep figures simple: tube limbs and single-line faces, or silhouettes, or ink cartoons. Pick one per film.
12. Set the key abstract noun as type when it is spoken (one word, not sentences).

**Don't**

1. Don't cut faster than about 2.5 times per minute, or put several images on one sentence.
2. Don't use smooth 24/30 fps tweening everywhere. It reads as corporate motion graphics.
3. Don't use gradients, glows, 3-D or drop shadows (only the vignette and flat light cones).
4. Don't add subtitles or bullet text. Use at most one keyword per scene.
5. Don't bounce, squash or overshoot except on tiny decorative pops.
6. Don't use upbeat stock music or risers. No sound-design flourishes.
7. Don't master loud and compressed (aim −18 to −20 LUFS, not −14).
8. Don't open with a dramatic cold open or a question montage.
9. Don't mix illustration modes inside one film.
10. Don't copy the channel's ident, its product squares or a specific commissioned artist's characters.
    Build your own figure design inside the rules above.
11. Don't use photographs or real people (not seen in this sample).
12. Don't crowd the frame. Keep 40–60 % negative space around one subject.

## 11. Replication recipe (code)

**Global settings.** 1920×1080; timeline at 24 fps. Quantise animation time to twos:
`tq = Math.floor(t*12)/12; tl.seek(tq)`. Every 2nd output frame repeats, and the boil seed changes per drawing.

**Layer stack**

```
z0  ground   <rect fill=#DCD4CA/>  + paper: feTurbulence(fractalNoise, baseFrequency 0.65, octaves 3, seed=drawing)
              → feColorMatrix (grey, alpha 0.06) multiply
z1  cam      <g id="cam"> world: figures, props, keywords  (filter: boil)
z2  cards    chapter / number cards (full-frame, also boiled)
z3  vignette radial-gradient rect: transparent 55% → rgba(60,45,30,0.22) 100%  (mode B: rgba(0,0,0,0.35))
```

**Boil filter** (applied to z1–z2):

```html
<filter id="boil"><feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="2" seed="{drawing}"/>
<feDisplacementMap in="SourceGraphic" scale="2.5"/></filter>
```

Use scale 2–3 for mode A, 4–6 for mode C (stronger line wobble), and 0–1 for mode B (fields only).

**Figures**

- A: SVG groups with outlined tube limbs (`stroke #111, width 7, linecap round`) and bones as nested `<g>` with
  pivots. Pose to pose: 2–3 keyed poses per sentence, eased with `sine.inOut` over 0.5–1.0 s, sampled on twos.
- B: silhouettes as single paths. Morph between paths with GSAP MorphSVG (free since GSAP 3.13) or flubber.
- C: draw 2–3 hand-drawn variants of each pose and cycle them every 2 frames for boil.

**Effect recipes**

- **Chapter card.** Full-frame `<path>` whose top edge is a sine wave (amplitude 20 px, wavelength 400 px). Animate
  y from 1080 → 0 in 0.42 s (`power2.out`). A squiggle path draws with `strokeDashoffset` over 1.2 s. Title (serif)
  opacity 0 → 1 and y +12 → 0 in 0.3 s starting at 0.35 s. Hold 2.5 s. Exit: x 0 → −1920 in 0.4 s (`power2.in`).
- **Particle disintegrate.** Sample the silhouette into 300–600 blob particles (random 6–20 px circles). Each
  translates outward 40–200 px with slight upward drift and scales to 0 over 0.8 s (`power1.in`) with random
  0–0.3 s delays. Fade the silhouette at 0.1 s.
- **Numeral morph (C).** Two digit outlines from the same font, interpolated over 0.4 s. Fill interpolates in HSL
  through saturation 40 % at the midpoint, over 0.8 s. Rough edge: `feTurbulence + feDisplacementMap scale 3`.
- **Pop-field.** 25 circles with random radii 120–260 px from the palette; `scale 0→1, back.out(1.5)`, 0.35 s each,
  0.25 s stagger. The keyword circle is last, with its serif label.
- **Travel zoom.** `cam` scale 0.32 → 1.0 over 4 s (`power2.inOut`), sampled on twos.

**Minimal scene skeleton**

```js
const tl = gsap.timeline({paused:true});
ident(tl, 0, 4.7);                                   // own sting
const S = sentences(tts);                             // [{text, t0, t1, key}]
chapterCard(tl, S[0].t0 - 0.5, {n:1, title:"Accept Imperfection", field:"#3625D2"});
S.slice(1).forEach(s => {
  const scene = metaphorFor(s.key);                    // one drawn tableau per sentence
  morphOrWipe(tl, s.t0 - 0.3, scene, {dur:0.6});       // morph, particle or iris
  pose(tl, s.t0, scene.figure, scene.poses, {ease:"sine.inOut"});
  if (s.keyword) keyword(tl, s.tKey, s.keyword, {font:"Merriweather", fade:0.3});
  drift(tl, s.t0, s.t1 + s.pause, {rate:0.009});       // 0.9 %/s slow push
});
recapCard(tl, ...); endCard(tl, ...);
render(tl, {fps:24, quantize:12});                     // on twos
```

**The five shots that define the style**

1. **Chapter card.** A saturated colour field wipes up with a wavy edge; squiggle line; numbered serif title; hold
   2.5 s.
2. **Metaphor tableau.** One figure centred on cream paper with vignette, holding or standing in a giant symbolic
   object; slow push; one keyword in serif.
3. **Morph chain** (mode B). Text becomes a paint smear, the smear a ring, the ring an iris onto the next colour
   field; silhouettes dissolve into particles.
4. **Numeral list item** (mode C). A neon soft-slab numeral fills the frame; an ink character acts around and
   inside it; the numeral morphs into the next one while its hue shifts.
5. **Recap stack and end card.** Coloured bars with "-n- Rule name" stack one per spoken item; then a static
   product and subscribe card.

## 12. Per-video notes

**1JCJVaK48RM — The Eight Rules**

- Mode A, by Natalia Ramos; the title animation is credited to Vale Productions.
- 18 cuts, mostly chapter-card wipes. Opens with the dot-row build (7 rows of red, olive, lilac, blue, white and
  black dots), then a line-drawn face.
- 9 chapter cards (8 rules plus "A Final Point:"). Most sit on a different saturated field, each with its own
  decorative line pattern (free squiggle, contour lines); some sit on cream inside a scalloped frame.
- Venn "Perfection / Failure" with "Good Enough" in the black lens. Recap card stacks 8 coloured bars.
- Spoken shop and subscribe CTA at 7:03–7:18. Lowest motion of the three (3.24) and the loudest (−20.0 LUFS).

**oocunV4JX4w — Who Am I?**

- Mode B, by Vale Productions; music "Woods" by Hawkin.
- Dark-ground three-colour palette (mustard, teal, coral) with full-frame colour-field flips.
- Signature transitions: particle disintegration, paint-smear morphs, iris circles.
- Thin tracked caps for the questions ("AM I STILL MYSELF?").
- Thought-experiment set pieces (skull and devil imagery, a coffin, a body swap) raise mid-film motion (decile 3 = 6.0).
- Dark-frame fraction 0.63. 34.5 s of silence. Ends with a black shop card and an end screen.

**k-J9BVBjK3o — 20 Signs You're Emotionally Mature**

- Mode C, by Sophie Olga De Jong.
- **Not a slideshow.** The 12.5 fps file holds a continuous hand-drawn animation: drawings change every 1–2 frames,
  and line boil continues on holds (per-frame diff about 0.8). Only one hard cut was detected in 476 s.
- List format: 20 neon numerals, about 23 s per item.
- Colourfulness 88.5 comes entirely from the numerals; the kraft ground is muted.
- 43 s of silence: pauses between items. Ends with a spoken product plug and a grey product card.

## 13. Source-list issues

- **Style descriptor mismatch.** "Vintage-art collage, cut-out animation" does not describe any of the three
  measured films (flat vector, silhouette motion graphics, hand-drawn ink). The channel's look is commissioned
  per film; only the format is constant. Use these files for the format and treat any collage look as a separate,
  unmeasured variant.
- **"13 fps slideshow" hypothesis.** k-J9BVBjK3o is 12.5 fps but fully animated (frame-by-frame with boil).
  The low frame rate is the upload's, not a still-image list.
- **Dated sample.** The three films date from 2016–2020 and run 447–476 s. The channel's 25 latest uploads have a
  median of 263 s. The two recent films in the list (O4FjeAYDRMQ 223 s, 1bmUWt9wejI 163 s), which would show the
  current format, were unavailable for this pass (covered later in `channel-extras-addendum.md`).
- **Credits.** Each film names its animator in the description. The look belongs to those illustrators. Don't
  imitate a specific artist's characters; build original figures within the rules.
