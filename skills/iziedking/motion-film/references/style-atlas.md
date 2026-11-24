# Style atlas

Use this to offer directions that are really different, and to name a look precisely enough to build it. Pick directions from different families. Every look below can be built with the engines in this skill.

## How a look is specified

Six choices define a look. Write all six for each direction.

1. **Ground:** white stage, near-black, paper, colour field, photographic or rendered plate.
2. **Palette:** ground, ink, one accent, at most one second accent. Hex values.
3. **Texture:** none, film grain, paper fibre, halftone dots, glow, noise gradient, pencil boil.
4. **Depth:** flat, layered 2.5D with parallax, true 3D with lights and materials.
5. **Type:** family class, weights, scale, how words arrive.
6. **Motion character:** snappy and precise, soft and floating, hand-made and stepped, cinematic and slow.

## Families

| Family | Signature | Good for | Engines |
|---|---|---|---|
| White-stage product | White ground, one soft colour bloom, large grotesque type arriving by word, real UI at large scale, a few 3D inserts | Fintech, consumer apps, launch ads | Canvas or DOM, Blender inserts |
| Dark UI glow | Near-black, hairline borders, soft gradient glows, tilted panels, monochrome plus one accent | Developer tools, infrastructure, AI products | DOM with CSS 3D, shader glow |
| Mesh gradient and grain | Slow flowing colour fields, visible grain, big type | Brand films, event openers, backgrounds for any family | Fragment shader, FFmpeg grain |
| Glass | Frosted panels, blur behind, light edges, depth by layering | Operating-system style product films | DOM (`backdrop-filter`), three.js |
| Kinetic typography | Type is the picture; words scale, mask, track and change weight | Manifestos, audio-led ads, quotes | DOM with a timeline library, opentype outlines |
| Flat vector explainer | Solid fills, geometric shapes, 3 or 4 colours, diagram logic | Explainers, process, finance and protocol flows | Canvas, Manim |
| Line art | Monoline strokes drawing on, one accent fill | Technical explainers, premium minimal brands | SVG stroke animation, canvas |
| Isometric | 30 degree grid, stacked blocks, systems as places | Infrastructure, logistics, marketplaces | Canvas transforms, three.js orthographic, Blender |
| 2.5D parallax | Flat layers at different depths, camera dolly, soft shadows | Storytelling with illustration, photo treatments | CSS 3D, three.js, depth-map parallax |
| Hand-drawn and boiled | Wobbling outlines redrawn every 2 or 3 frames, paper ground, textured fills, characters | Education, culture, warm brands, children | Canvas or p5 with seeded jitter, textures |
| Paper and collage | Cut-out photos, torn edges, tape, stepped 12 fps timing | Editorial, culture, campaigns with attitude | Canvas, layered images |
| Halftone and risograph | Dot screens, two or three inks, slight misregistration | Posters in motion, music, fashion | Shader or SVG filter |
| Brutalist editorial | Raw grid, monospace or heavy grotesque, hard cuts, black plus one colour | Agencies, tools with opinions | DOM |
| Data-driven | Charts, counters and maps as the hero | Reports, fundraising, product metrics | D3 by frame, Manim |
| Retro pixel and CRT | Low resolution scaled up, scanlines, dither | Games, nostalgia, developer humour | Shader, canvas with nearest-neighbour scaling |
| Soft 3D and clay | Rounded forms, matte materials, soft shadows, pastel | Friendly consumer brands, onboarding | Blender, three.js |
| Photoreal product | Studio lighting, real materials, macro, shallow focus, light sweeps | Hardware, packaging, luxury, anything with a physical product | Blender Cycles |
| Cinematic live action | Real footage, a single grade, grain, music-led cutting | Events, testimonials, brand stories | FFmpeg edit, client footage or stock |
| Screen-first demo | Real captures, zoom and pan, smooth cursor, callouts | Tutorials, changelogs, feature releases | Scripted capture, virtual camera |
| Gameplay and listicle | Clip segments, number cards, lower thirds, energetic cuts | Game promos, rankings, community videos | FFmpeg edit, authored cards |
| Mixed media | Two families cut together on purpose (live action with drawn overlays, 3D inside a flat world) | Films that need a signature | Any two engines, unified in the finish |

## Recipes

Short, buildable descriptions. Durations are at 30 fps.

**White-stage product.** Ground `#FFFFFF`. A radial colour bloom at 15 to 25% opacity behind the subject, slowly breathing. Type in near-black, 7 to 10% of frame height, words entering one at a time 3 to 4 frames apart with a 10-frame fade and 20 px rise; earlier words dim to 60% as later ones arrive. UI drawn at 2 to 3 times real size, cropped so only the active control is in frame. One custom cursor with eased arcs. 3D inserts on transparent ground composited over the stage. Hard cuts on beats; one morph per film.

**Dark UI glow.** Ground `#08090B` to `#0E1014`. Panels `#111318` with 1 px borders at 8 to 12% white. One accent. Glow is a blurred copy of the accent shape at 30 to 50% opacity, screen-blended. Panels tilt 8 to 18 degrees in perspective and settle flat for reading. Grain at low strength to stop banding.

**Mesh gradient and grain.** Three or four colour points moving on slow noise paths (period 8 to 20 s), blended in a fragment shader with `u_time = frame / fps`. Grain added once in the finish. Type sits in white or black with generous margins.

**Hand-drawn and boiled.** Paper ground with a scanned or generated fibre texture at low contrast. Shapes drawn as paths whose points are offset by seeded noise; reseed every 2 or 3 frames so the line "boils". Fills are slightly offset from outlines. Characters use few parts with strong poses, blink and squash. Animate on twos (hold each drawing for two frames) at 24 fps. Scenes change with a colour wipe or an iris, never a dissolve.

**Photoreal product.** Dark or seamless ground. An 85 to 100 mm lens, f/4 to f/8. Large soft key, weak fill, a strip rim light for the edge highlight; light the reflections, not the object. Slow orbits and focus pulls. Reveal by sweeping a light across a dark product before the full view. See `engines-3d.md` and `cinematography.md`.

**Cinematic live action.** Conform all clips to one frame rate. Shots of 0.6 to 2.5 s in montage, with a longer breath every 6 to 8 shots. Alternate wide, medium and detail; cut on movement. One grade and one grain pass for everything. Titles in one family, small, held 2 s. See `live-action-edit.md`.

**Screen-first demo.** Capture at 2 times device scale. The camera pushes to 150 to 300% on the active area before each action and pulls back after; moves take 20 to 30 frames with ease-in-out. The cursor travels on a slight arc and slows before clicking; a ripple marks the click. Hide everything not in the story. See `product-demo.md`.

**Gameplay and listicle.** Number cards of 1 to 1.5 s with a hit sound. Each clip opens on its most active second. Lower third with the title for the first 3 s of each segment. Keep added graphics out of the game's HUD areas. Normalise loudness per clip before the mix.

## Picking directions for a brief

1. Start from the product: a physical thing suggests photoreal or soft 3D; a screen product suggests white-stage, dark UI or screen-first; an idea suggests kinetic type, flat vector or hand-drawn.
2. Take one direction the audience expects, one from a neighbouring family, and one that is a deliberate contrast.
3. Check each against the machine (`doctor.json`) and the budget before offering it. A direction the machine cannot render is offered with its cost, not hidden.
4. Describe each direction with the six choices at the top of this file.

## Things that read as amateur in any family

- Linear motion, especially on the camera.
- Everything entering at once, or everything with the same delay.
- Text that moves while it should be read.
- More than one accent colour doing the same job.
- Glows, gradients and orbs standing in for an idea.
- 3D with flat white lights and no shadow contact.
- Stock or generated shots that do not share a grade with the rest.
- A logo sting longer than the message.
