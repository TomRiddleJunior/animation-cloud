# Cinematography, lighting and editing

These rules apply to a virtual camera in a 2D or 3D scene as much as to a real one. Use them when writing the shot list and when lighting any 3D shot.

## Shot sizes and what they do

| Size | Shows | Use |
|---|---|---|
| Extreme wide | Place and scale | Openers, endings, "where are we" |
| Wide | Subject in its surroundings | Establishing a scene or a whole interface |
| Medium | Subject and its action | The working shot |
| Close-up | One thing | Emotion, the control being used, the result |
| Extreme close-up or macro | Texture and craft | Product details, material, a single number |

Change size at every cut. An ad often opens wide or on a mysterious macro, then alternates.

## Lenses

Full-frame equivalents. In 3D keep the sensor at 36 mm and choose by feel.

| Focal length | Feel | Use |
|---|---|---|
| 14 to 24 mm | Dramatic, stretched | Spaces, energy; distorts products |
| 35 mm | Natural, documentary | People in places |
| 50 mm | Neutral | General |
| 85 to 135 mm | Compressed, flattering | Products and portraits; the default for a packshot |
| 100 mm macro | Intimate detail, thin focus | Hero details at f/2.8 to f/8 |

## Camera moves and what they mean

| Move | Meaning |
|---|---|
| Locked off | Confidence, precision; lets the subject move |
| Push in | Rising importance, intimacy |
| Pull out | Reveal, context, an ending |
| Orbit or arc | Showing form |
| Truck (sideways) | Comparison, parallax, travel |
| Crane or boom up | Grandeur, closure |
| Tilt up | Power, scale |
| Handheld | Urgency, presence |
| Whip pan | Energy; hides a cut |
| Focus pull | Shifts attention without moving |

One motivated move per shot. Ease in and out. Do not combine a rotation, a zoom and a truck without a reason. A slow move (2 to 5% scale change over the shot) keeps a still frame alive.

## Composition

- One focal point per frame. The brightest, sharpest, most saturated or only moving thing wins the eye; make sure it is the right thing.
- Rule of thirds for off-centre subjects; dead centre and symmetry for hero product shots and end cards.
- Depth in three layers: foreground, subject, background. Shallow focus separates them.
- Leading lines and the direction of motion point at the subject.
- Leave room in front of anything moving or looking.
- Keep important content inside the safe areas for every delivery ratio (`delivery.md`).
- Screen direction: keep the camera on one side of the action so things keep moving the same way across cuts.

## Frame rate and shutter

- 24 or 25 fps reads as cinema; 30 as video and interface; 60 for sport, gameplay and very smooth UI.
- A 180 degree shutter (blur for half the frame interval) is the natural amount of motion blur. Use it for fast moves in 2D and 3D alike.

## Lighting

Three jobs:

- **Key** sets the shape. Usually 30 to 45 degrees off the camera axis and above.
- **Fill** sets the contrast by lifting the shadows.
- **Rim** (back or edge light) separates the subject from the ground.

Key-to-fill ratio:

| Ratio | Feel |
|---|---|
| 2:1 | Flat, friendly, beauty |
| 4:1 | Standard, shaped |
| 8:1 and above | Moody, dramatic |

Principles:

- **Size is softness.** A large source close to the subject gives soft shadows; a small or distant one gives hard shadows.
- **Motivate every light.** It should look as if it comes from somewhere plausible: a window, a screen, the sky.
- **Colour temperature.** About 3200 K is warm tungsten, 5600 K daylight, 6500 K and above cool. A small warm and cool split between key and fill adds depth. Keep product whites neutral.
- **Negative fill.** Black surfaces near the subject deepen shadows and define edges.
- **Glossy subjects reflect their lights.** Shape the reflections with large softboxes and strips; add gradients to the sources.
- **Glass.** Bright-field: light from behind through diffusion, dark cards at the sides for edges. Dark-field: dark ground, strips from the sides for glowing edges.
- **Vehicle or long glossy form.** A very large overhead source for one long highlight along the body, low strips for the lower edges, a dark environment, a reflective floor.
- **Screens.** An emissive screen lights the scene around it; let it spill a little.

2D films follow the same logic: one consistent light direction for every shadow, highlights on the side facing the light, and a shadow that touches the object it belongs to.

## Colour

- Decide the palette before lighting: ground, subject, accent.
- Warm subjects against cool grounds (or the reverse) separate well. Complementary grading suits scenes with skin tones against cool backgrounds. It is wrong when it shifts a brand colour, on product-only shots with their own palette, and on interface captures.
- Skin tones should sit on the skin-tone line of a vectorscope after any grade.
- Brand colours must measure correctly in the final file. Sample and compare.

## Editing

In priority order when choosing a cut: emotion, story, rhythm, where the eye is, the flat composition of the screen, spatial continuity. Give up the later ones first.

- **Cut on action.** Movement hides the cut.
- **Match cut.** A shape, position or motion continues across the cut; the strongest way to join two ideas.
- **J-cut and L-cut.** Sound leads or trails the picture and softens a scene change.
- **Montage.** Compress time by rhythm and repetition. Vary size and direction; keep one thing constant (a colour, a framing, a motion).
- **Pace.** A hook in the first 1 to 2 seconds. One idea per shot. Fast moves followed by long holds. The end card holds 2 to 3 seconds.
- **Silence and stillness** make the next move land harder.

## Product reveal conventions

- **Studio reveal:** dark or seamless ground, slow macro orbits along edges and materials, shallow focus with a pull, a light sweep that shows the silhouette before the whole, hard cuts on the beat, very little type.
- **Exploded view:** parts separate along one axis with staggered timing and a small overshoot, hold, then reassemble. Label only after motion stops.
- **Turntable:** constant speed, fixed lights so highlights travel across the surface, 4 to 8 seconds per rotation, loopable, camera 10 to 20 degrees above.
- **In use:** hands or a setting give scale; the product enters at the turn of the story.

## Sound to picture

- Cuts land on beats: `frame = round(beatTime * fps)`.
- An impact sounds on the frame of the visual hit or one frame after, never before.
- A whoosh leads a move and ends on the cut.
- A riser into a reveal, then a hit and a moment of near silence on the logo.

## Where to study

Named so an agent can point a client at examples; study them for structure and craft only.

| Source | Good for |
|---|---|
| StudioBinder's shot, lens and movement guides | Vocabulary with examples |
| American Cinematographer; Roger Deakins' forum | How working cinematographers light |
| Wandering DP | Commercial lighting breakdowns |
| Walter Murch, *In the Blink of an Eye* | Why and when to cut |
| School of Motion; Ben Marriott | Motion design fundamentals and technique |
| Motionographer; Stash; Vimeo Staff Picks | The current standard of commercial motion work |
| Art of the Title | Title design, type and pacing |
| Studio reels (Buck, Ordinary Folk, Giant Ant, ManvsMachine, Gunner, Oddfellows) | Distinct styles at a high level |
| Product launch films from Apple, Stripe, Linear, Vercel | Product choreography, interface motion, sound |
| Blender Guru; CG Cookie; Polygon Runway; Ducky 3D | Lighting, materials, stylised 3D, abstract loops |
| Corridor Crew; fxguide | What reads as fake, and how effects are built |
