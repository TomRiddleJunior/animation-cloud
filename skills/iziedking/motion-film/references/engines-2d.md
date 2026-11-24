# 2D engines

Every 2D engine here obeys one contract, so shots from any of them can be cut together.

## The frame contract

A shot exposes a function that draws frame `i` and nothing else decides what is on screen.

```js
window.ready        // a promise that resolves to { width, height, fps, frames } once fonts, images and shaders are loaded
window.renderFrame  // (i) => void | Promise<void>; draws frame i, where t = i / fps
```

Rules:

- No `Date.now()`, `performance.now()` or `requestAnimationFrame` deltas in drawing code.
- Randomness comes from a seeded generator (`mulberry32(seed)`), reseeded from the frame index when a per-frame value is needed.
- Wait for `document.fonts.ready`, image decode and shader compilation before frame 0.
- Fixed viewport and device scale factor.
- CSS animations, transitions and video elements are paused and seeked, never left to play.

`templates/capture/capture.cjs` renders any page that meets this contract to a PNG sequence or straight into FFmpeg, with optional sub-frame motion blur. `templates/render.cjs` is the same idea specialised for the canvas template (`window.setTime(t)`).

## Canvas (the default for authored vector work)

`templates/film.js`. One file, a timeline of named beats, scenes that read `t`, small primitives. Best for flat and textured vector films, diagrams, type, simple UI, hand-drawn looks.

Add to it as the look demands:

- **Textures:** load a paper or grain image once, draw it with `globalCompositeOperation = 'multiply'` at low alpha.
- **Boiled line:** draw paths through points offset by seeded noise; reseed every 2 or 3 frames.

```js
function mulberry32(a){return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
const boil = (frame, hold = 3) => mulberry32(1000 + Math.floor(frame / hold));   // one generator per held drawing
```

- **Soft shadows and blur:** `ctx.filter = 'blur(24px)'` on an offscreen canvas, drawn once per frame.
- **Masks:** `ctx.clip()` for reveals; `destination-in` compositing for soft mattes.
- **Word-by-word type:** measure each word with `ctx.measureText`, lay out once, animate alpha and offset per word from its own start time.

For speed without a browser, the same drawing code runs on `skia-canvas` or `@napi-rs/canvas` in Node, piping raw frames to FFmpeg.

## DOM and CSS (real UI, glass, CSS 3D, rich type)

Use when the film shows real interface markup, needs `backdrop-filter`, variable fonts, CSS 3D transforms, or a timeline library.

Two ways:

1. **Own capture loop.** Build an HTML page. Drive it from one timeline that is paused and seeked:

```js
import gsap from 'gsap';
const tl = gsap.timeline({ paused: true });
tl.from('.word', { y: 20, opacity: 0, duration: 0.33, stagger: 0.1, ease: 'power3.out' })
  .to('.panel', { rotateY: 0, duration: 1.2, ease: 'power2.inOut' }, 0.8);
window.ready = document.fonts.ready.then(() => ({ width: 1920, height: 1080, fps: 30, frames: 300 }));
window.renderFrame = (i) => { tl.time(i / 30); };
```

CSS and Web Animations without a library:

```js
window.renderFrame = (i) => {
  const ms = (i / 30) * 1000;
  document.getAnimations().forEach(a => { a.pause(); a.currentTime = ms; });
};
```

2. **HyperFrames.** An open-source (Apache-2.0) tool that seeks plain HTML compositions frame by frame in headless Chrome and encodes with FFmpeg, with adapters for GSAP, CSS animation, Lottie, three.js and anime.js. `npx hyperframes init my-video`, then `npx hyperframes render`. Run `npx hyperframes render --help` for flags, and pin the version: it is still 0.x. Read its own agent skill before writing compositions for it.

Device frames: draw a generic device (rounded rectangle, bezel, shadow) in CSS or SVG and tilt it with `transform: perspective(1600px) rotateY(-14deg) rotateX(6deg)`. Do not use a manufacturer's product render.

## Remotion (React)

Use when the team already writes React, or the job is many variants from data. Motion must derive from `useCurrentFrame()`; CSS animations and timers break determinism.

```bash
npx create-video@latest
npx remotion render src/index.ts Main out/video.mp4 --props=props.json
```

Licence: free for individuals and for companies of up to 3 people; larger companies need a paid company licence. Say this before recommending it. Pass props as a file, since inline JSON fails in Windows shells. Remotion publishes its own agent skills; read them before writing rules of your own.

## Manim Community Edition (maths, charts, diagrams)

```bash
pip install manim
manim -qh scene.py SceneName          # 1080p; -qk for 4K; --format=png for frames
```

Clean flat explainer look, exact geometry, LaTeX when installed. Render with a transparent background (`-t`) to composite over another engine's plate.

## Shader layers (gradient fields, grain, liquid, halftone, glow)

A full-screen fragment shader drawn into a canvas behind or above other layers. Time is `u_time = frame / fps`.

```glsl
precision highp float;
uniform vec2 u_res; uniform float u_time;
float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1,311.7))) * 43758.5453); }
float noise(vec2 p){ vec2 i=floor(p), f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(hash(i),hash(i+vec2(1,0)),f.x), mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x), f.y); }
void main(){
  vec2 uv = gl_FragCoord.xy / u_res;
  float n = noise(uv*2.0 + vec2(u_time*0.05, 0.0)) * 0.6 + noise(uv*4.0 - vec2(0.0, u_time*0.04)) * 0.4;
  vec3 a = vec3(0.92,0.98,0.80), b = vec3(1.0), c = vec3(0.80,0.90,1.0);
  vec3 col = mix(mix(a,b,smoothstep(0.2,0.8,n)), c, smoothstep(0.5,1.0,uv.y)*0.35);
  gl_FragColor = vec4(col, 1.0);
}
```

Headless Chromium on a machine without a GPU needs software GL; launch with `--use-angle=swiftshader` (confirm the flag on the pinned Chromium; newer builds may also need `--enable-unsafe-swiftshader`). Software GL is slow, so keep shader layers cheap or pre-render them once as a plate. Write shaders from scratch: code copied from sharing sites is usually licensed non-commercial.

## Lottie and Rive (designer hand-off)

- Lottie: `anim = lottie.loadAnimation({ container, renderer: 'canvas', autoplay: false, animationData })`, then `anim.goToAndStop(i * anim.frameRate / fps, true)` in `renderFrame`.
- Rive: the web runtime in the capture loop with manual advance, or the Rive CLI's per-frame screenshots.

Lottie supports only part of what After Effects can do. Check the rendered frames against the designer's preview, and record each file's licence.

## Other libraries inside the contract

| Library | Use | Deterministic drive |
|---|---|---|
| anime.js v4 | Light vector and stagger work | `createTimeline({ autoplay: false })`, `.seek(ms)` |
| PixiJS v8 | Particles, sprites, displacement filters | stop the ticker; update from `i`; `app.renderer.render(app.stage)` |
| p5.js 2 | Generative and hand-made looks | `noLoop()`, `randomSeed()`, `noiseSeed()`, `redraw()` per frame |
| D3 | Charts and maps | compute from `i` with scales and interpolators; do not use `d3-transition` |
| opentype.js | Glyphs as paths: per-letter motion, outlines, morphs | pure functions of `i` |
| flubber | Shape-to-shape morphs | `interpolate(a, b)(p)` |
| SVG | Stroke draw-on, masks, text on a path | `svg.pauseAnimations(); svg.setCurrentTime(t)` or set attributes from `i` |

## Motion blur

Fast position and rotation look stroboscopic without blur. Render sub-frames and average them: `capture.cjs --blur 4` renders 4 sub-frames per output frame across a 180 degree shutter and blends them. Do not blur text that must be read; hold it still instead.

## Typography in motion

- Split by line or word; per letter only for short display words. Use `Intl.Segmenter` so splitting is safe for every script.
- Animate masks, opacity, tracking and variable-font axes (`font-variation-settings`) before position. Keep baselines stable.
- Largest type 7 to 12% of frame height; nothing under 2% of frame height at 1080p, and nothing under 4% in a vertical cut.
- Two families at most. Tabular figures for numbers that change.

## Alpha output for compositing

To lay a 2D shot over a 3D or footage plate, keep the page background transparent, capture PNG with alpha (`omitBackground: true`), and encode a ProRes 4444 mezzanine (`finishing.md`).
