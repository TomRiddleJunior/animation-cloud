# 3D engines

Use 3D when the shot needs real light on real materials (a product, coins, glass, liquid), a camera moving through depth, or simulation. Use it sparingly: a few strong 3D inserts in a 2D film usually beat a film that is 3D throughout.

## Which 3D

| Need | Use |
|---|---|
| Material is the hero: metal, glass, liquid, soft shadows, macro, shallow focus | Blender, Cycles |
| Stylised or long 3D and a GPU is present | Blender, EEVEE |
| Light depth inside a 2D film: tilted cards, device tilt, extruded logo, particles | three.js in the capture loop |
| Real-time 3D scripted as text files, GPU present | Godot `--write-movie` |
| No GPU | Blender Cycles on CPU only. Time one frame first. |

## Blender, headless

Always run it from scripts, in the background:

```bash
blender -b --factory-startup --python-exit-code 1 -P build_scene.py -- --out //render/f_ --frames 120
blender -b scene.blend -f 1                                   # one test frame first, always
blender -b scene.blend -E CYCLES -o //render/f_#### -F PNG -x 1 -s 1 -e 120 -a
```

Arguments run in order, so `-a` or `-f` comes last. `--factory-startup` ignores user preferences and add-ons. `--python-exit-code 1` makes a script error fail the process. Everything after `--` is for the script.

`templates/blender/product_shot.py` builds a lit product shot from nothing: a model or a placeholder, a floor, softbox lighting, an 85 mm camera with depth of field, a turntable or an orbit, Cycles with denoising, transparent film on request. Start from it.

### Blender 5.x API notes

Most examples online target 2.8 to 4.x and fail on 5.x. Write for 5.x and guard the differences.

| Old | Now (5.x) |
|---|---|
| `scene.node_tree` for the compositor | `scene.compositing_node_group` (a `CompositorNodeTree` from `bpy.data.node_groups`) |
| `material.use_nodes = True` required | A no-op; harmless to keep for 4.x |
| Engine id `BLENDER_EEVEE_NEXT` (4.2 to 4.5) | `BLENDER_EEVEE` |
| Set `image_settings.file_format` directly | Set `image_settings.media_type` first, then `file_format` |
| Pass names `Z`, `DiffCol` | `Depth`, `Diffuse Color` |
| Editing `action.fcurves` for interpolation | Set `preferences.edit.keyframe_new_interpolation_type` before keying, or use the layered action API |
| `gpencil` data | `grease_pencil` (rewritten in 4.3) |

Guard with `hasattr` and `try` so one script runs on 4.2 LTS and 5.x:

```python
im = scene.render.image_settings
if hasattr(im, "media_type"): im.media_type = 'IMAGE'
im.file_format = 'PNG'
```

Principled BSDF sockets (4.x and later): `Base Color`, `Metallic`, `Roughness`, `IOR`, `Alpha`, `Transmission Weight`, `Subsurface Weight`, `Coat Weight`, `Sheen Weight`, `Emission Color`, `Emission Strength`.

### Cycles or EEVEE

- **Cycles** traces paths. Correct glass, reflections, soft shadows and subsurface. Runs on any CPU; much faster on a GPU (OptiX or CUDA for NVIDIA, HIP for AMD, oneAPI for Intel, Metal for Apple).
- **EEVEE** rasterises. Seconds per frame, but it needs a GPU and is weaker on refraction and contact shadows. Good for stylised work and previews.

Starting settings for a product shot in Cycles:

| Setting | GPU | CPU |
|---|---|---|
| Samples | 128 to 256 | 48 to 96 |
| Adaptive sampling threshold | 0.01 to 0.03 | 0.02 to 0.03 |
| Denoiser | OpenImageDenoise, albedo and normal passes | same |
| Max bounces | 8 (glossy 4, transmission 8 to 12) | same |
| Clamp indirect | 10 | 10 |
| Persistent data | on for animations | on |

Method, every time:

1. Render one frame at final settings. Note the time.
2. Multiply by the frame count. If it does not fit, change the plan (`toolchain.md`).
3. Render ten consecutive frames and check for denoise flicker. If it flickers, raise samples.
4. Render the full range to frames. A crash loses nothing; bad frames can be re-rendered alone.

### Lighting recipes

Lights are area lights unless stated. Sizes are relative to a product about 15 cm tall; scale with the product.

- **Soft product (default):** large key (60 by 90 cm) at 45 degrees and above; weak fill opposite at a fifth of the key; a narrow strip behind for the edge highlight; a soft top light. Dark ground.
- **Glossy objects:** you are lighting the reflections. Use big softboxes and long strips to make clean gradients on the surface, and black cards to carve dark edges. Put a gradient on each softbox (an emission ramp); flat white rectangles look fake.
- **Glass:** bright-field (backlight through a diffuser, dark cards at the sides) or dark-field (dark ground, edge strips). Give glass real thickness.
- **Gold and coins:** a warm key, a cooler rim, and a studio HDRI for reflections; metals show their surroundings, so an empty world makes them look black.
- **Light-sweep reveal:** start dark; animate a strip light or the HDRI rotation across the product; cut to the full view.
- **HDRI studio:** use an HDRI for fill and reflections, then add area lights for intent. Rotate the HDRI to place highlights.

Ratios and theory are in `cinematography.md`.

### Camera

- 85 to 100 mm for products; 35 to 50 mm for scenes. Keep the sensor at 36 mm and move the camera instead of using extreme fields of view.
- Depth of field through `cam.data.dof` with a focus object; f/4 to f/8 for products, lower for macro.
- Motion blur on, shutter 0.5 (a 180 degree shutter).
- Animate an empty and parent or track the camera to it. Bezier easing for moves; linear only for a constant turntable.

### Materials, quickly

- **Anodised or brushed metal:** Metallic 1, Roughness 0.2 to 0.4, a little Coat.
- **Gold:** Metallic 1, Base Color about (1.0, 0.77, 0.34), Roughness 0.15 to 0.3.
- **Glass:** Transmission Weight 1, Roughness 0 to 0.05, IOR 1.45 to 1.52.
- **Plastic:** Roughness 0.3 to 0.5, Coat for gloss.
- **Soft clay look:** Roughness 0.7 to 0.9, Subsurface Weight 0.1 to 0.3, pastel colours, soft light.
- **Screens:** an emission shader carrying a real UI capture as an image texture, strength near 1 so it does not blow out.

### Brand colour and colour management

- The default view transform (AgX) desaturates bright saturated colours. Exact brand colours and logos should be composited in 2D afterwards, or rendered in a separate pass with the Standard view.
- Render 3D that will sit over 2D with a transparent film (`scene.render.film_transparent = True`) to 16-bit PNG, or multilayer EXR when a compositor will work on passes.
- After the grade, sample brand-colour pixels and compare with the hex in the brief.

### Type, logos, icons in 3D

- Text: a font curve (`bpy.data.curves.new(type='FONT')`) with a loaded font, extruded and bevelled.
- SVG logos and icons: `bpy.ops.import_curve.svg(filepath=...)`, then extrude, bevel and convert to mesh. This is how to build tilted icon tiles: a rounded box with the icon curve as a raised or printed face.
- Many copies, arcs and staggered motion: Geometry Nodes, or plain Python loops that key each object with an offset.

### Coins, objects, simple physics

A coin is a bevelled cylinder with an embossed mark and a ridged edge. For a ring of spinning coins around a headline, key each coin's rotation and position with offsets and render on a transparent film; simulation is not needed. Use rigid bodies only when things must collide, and bake them before rendering in the background (`bpy.ops.ptcache.bake_all(bake=True)`).

Fluid and smoke simulation is slow on a CPU. For ads, prefer faked effects: animated noise volumes, particles, or a 2D layer.

### Assets

CC0 first: Poly Haven (HDRIs, textures, models), ambientCG (materials), Kenney (low-poly kits). Import glTF where possible (`bpy.ops.import_scene.gltf`); also USD, FBX, OBJ. Record the source URL and licence of every downloaded asset in `provenance.json`. Refuse non-commercial, no-derivatives and unknown licences. Build a generic device instead of using a recognisable phone or laptop model.

### Remote and GPU rendering

The same headless commands run on any machine. On a rented GPU machine: install Blender from the tarball, copy the project, render frames, copy frames back. Ask before spending, and do not send confidential work to a volunteer farm.

## three.js in the capture loop

For light 3D that must share a timeline with 2D layers.

```js
import * as THREE from 'three';
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
renderer.setPixelRatio(1); renderer.setSize(1920, 1080, false);
// build scene, camera, lights ...
window.ready = Promise.all([document.fonts.ready, loadAssets()])
  .then(() => renderer.compileAsync(scene, camera))
  .then(() => ({ width: 1920, height: 1080, fps: 30, frames: 180 }));
window.renderFrame = (i) => { const t = i / 30; update(t); renderer.render(scene, camera); };
```

- Update animation mixers with absolute time (`mixer.setTime(t)`), never deltas.
- Use an environment map for reflections; without one, metals look flat.
- On a machine without a GPU, Chromium needs software GL (see `engines-2d.md`); it works but is slow. Keep geometry and post-processing light, or move the shot to Blender.
- A tilted icon tile is a `RoundedBoxGeometry` with the icon as a texture; a dock of app tiles is a row of them with a soft contact shadow.

## Godot

Scenes and scripts are text files, so an agent can author them. `godot --path project --write-movie out.avi --fixed-fps 30` writes frame-exact video (or a PNG sequence). It needs a GPU or software graphics, and the quality ceiling is below Cycles. Use it for game-like real-time shots.

## Compositing 3D with 2D

1. Render the 3D on a transparent film at the film's size and frame rate.
2. Encode ProRes 4444 with alpha, or keep PNG frames.
3. Overlay on the 2D plate in FFmpeg (`finishing.md`), then apply the single grade and grain so both sources share one finish.
4. Match the light: the 2D shadow direction and the 3D key should agree.
