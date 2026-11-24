# Motion grammar

Pick a grammar in the motion study and keep it for the whole film. These rules hold in every engine.

## Timing

Work in frames. Values below are for 30 fps; scale for other rates.

| Move | Frames | Seconds | Easing |
|---|---|---|---|
| Focus change (highlight, underline, colour) | 8 to 12 | 0.25 to 0.4 | ease-out cubic |
| Element entrance (card, label, row) | 12 to 20 | 0.4 to 0.7 | ease-out quint, optional small overshoot |
| Element exit | 9 to 15 | 0.3 to 0.5 | ease-in; about a quarter shorter than the entrance |
| Object transformation or morph | 27 to 48 | 0.9 to 1.6 | ease-in-out cubic |
| Camera move | 36 to 90 | 1.2 to 3 | ease-in-out, never linear |
| Stagger between siblings | 2 to 4 | 0.06 to 0.12 | same as the entrance; the last item lands within 0.6 s |
| Word-by-word type | 3 to 4 between words | 0.1 to 0.13 | each word 10 frames ease-out |
| Hold after a statement | | 0.3 per word, minimum 1.2 | none |

Contrast is the craft: a fast move, then a long hold. Even spacing reads as a template.

## Easing

```js
const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const P    = (t, a, b) => clamp((t - a) / (b - a));               // progress of t between a and b
const eo   = p => 1 - Math.pow(1 - p, 3);                          // ease-out cubic
const eo5  = p => 1 - Math.pow(1 - p, 5);                          // ease-out quint
const ei   = p => p * p * p;                                       // ease-in cubic
const eio  = p => p < .5 ? 4*p*p*p : 1 - Math.pow(-2*p + 2, 3)/2;  // ease-in-out cubic
const expo = p => p === 1 ? 1 : 1 - Math.pow(2, -10 * p);          // ease-out expo, for snappy entrances
const back = p => 1 + 2.6*Math.pow(p - 1, 3) + 1.6*Math.pow(p - 1, 2); // small overshoot
// spring as a function of seconds since the start: zeta 1 = no bounce, 0.5 = lively; freq in Hz sets the speed
function spring(t, { freq = 1.6, zeta = 0.7 } = {}) {
  if (t <= 0) return 0;
  const w = 2 * Math.PI * freq;
  if (zeta >= 1) return 1 - Math.exp(-w * t) * (1 + w * t);
  const wd = w * Math.sqrt(1 - zeta * zeta);
  return 1 - Math.exp(-zeta * w * t) * (Math.cos(wd * t) + (zeta * w / wd) * Math.sin(wd * t));
}
```

A scene reads only time: `const p = eo(P(t, 3.2, 3.8))`.

Conventions: entrances ease out, exits ease in, moves that start and end on screen ease in and out. Linear is for constant rotation, a marquee, or a scrub. Overshoot is for small, light things (a badge, a coin, an icon), never for text blocks or the camera.

## The twelve principles, applied

| Principle | In motion design |
|---|---|
| Squash and stretch | Scale 5 to 15% along the direction of travel, keeping area; tiny on interface elements |
| Anticipation | A small counter-move of 2 to 4 frames before a big move |
| Staging | One idea per shot; the moving thing is the important thing |
| Pose to pose | Design the key frames (style frames) first, then the motion between them |
| Follow-through and overlap | Children lag their parent by 2 to 4 frames; things overshoot and settle; parts stop at different times |
| Slow in and slow out | Ease everything |
| Arcs | Move on curves, not straight diagonals |
| Secondary action | Shadows, highlights, counters and background drift that support the main move |
| Timing | Fewer frames reads light and quick; more reads heavy |
| Exaggeration | Push the contrast of scale and speed further than feels safe, then hold |
| Solid drawing | One perspective, one light direction, one shadow logic |
| Appeal | Clear silhouettes, restrained palette, consistent radii and stroke weights |

## Continuity

Every transition preserves something.

- **Match cut:** the same shape, position or motion ends one shot and begins the next.
- **Morph:** one object changes content while keeping its place in the frame.
- **Carry:** an object travels across the boundary between scenes.
- **Camera move:** pull back to show where the object belongs, or push in to the detail that matters.
- **Container transform:** a card grows to become the whole screen.
- **Zoom-through:** push into a detail that becomes the next scene.
- **Mask or wipe:** a shape, a line of type or a colour field reveals the next scene.
- **Whip:** fast directional blur hides the cut.
- **Colour or sound bridge:** the accent colour, or a sound, continues across a hard cut.
- **Hard cut on the beat:** the default. Use one or two of the others as the film's signature.

A cut between unrelated cards with nothing carried is a slideshow.

## Motion blur

Fast position and rotation need blur or they strobe. Average sub-frames over half the frame interval (`engines-2d.md`), or turn on a 0.5 shutter in 3D. Never blur text the viewer must read.

## Typography

- One or two families, two or three weights. Large type for the idea, small type for labels.
- A scale on a ratio. For 1080p: 120, 84, 60, 42, 30, 22 px. Nothing under 22 px at 1080p.
- Sentence case. Tabular figures for numbers. Text inside the safe margins.
- Text arrives, then stays still while it is read. Animate masks, opacity, tracking and weight before position.
- Earlier words can dim as later ones arrive, so the eye follows the newest word.

## Composition

- One focal point per frame. If two things move, one is quieter.
- Generous empty space.
- Colour has a job: the accent marks the one selected thing or the action.

## Interface motion

- Punch in to 150 to 300% on the active area; flat and frontal for reading, tilted for hero shots.
- The cursor is an actor: eased arcs, a pause before the click, a ripple on it.
- Type-in text, counting numbers and state changes land on the beat.
- Shots of 1.5 to 4 s.

## Hand-made timing

For drawn and collage looks: 24 fps, drawings held for two frames ("on twos"), a new jitter seed per held drawing, stepped easing instead of smooth. Mixing smooth camera moves with stepped character motion is a deliberate choice; decide it in the study.

## Social cuts

Re-compose each scene for 9:16 and 1:1. Stack what sat side by side, enlarge type, move labels out of the platform's interface zones (`delivery.md`). Never centre-crop a 16:9 master.

## Things that read as amateur

- Linear motion, especially on the camera.
- Everything entering at once, or with the same delay.
- Text that moves while it should be read.
- Every object given the same spring.
- Floating cards with no relationship between them.
- A transition effect on every cut.
- A logo sting longer than the message.
