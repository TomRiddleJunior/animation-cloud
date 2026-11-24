# Toolchain

What to use, how to install it, and what each choice costs. Tools change quickly: this file was checked in November 2026. Before installing, confirm the current version (`npm view <pkg> version`, `pip index versions <pkg>`, the vendor's release page) and pin it in the project.

## Check the machine first

```bash
node templates/tools/doctor.cjs          # writes doctor.json and prints a table
```

It reports Node, FFmpeg and FFprobe, Chromium for Playwright, Python, Blender, Manim, ImageMagick, oiiotool, c2patool, Whisper tooling, free memory, CPU count, a visible GPU, and which API keys are present in the environment (names only, never values).

Plan from that report. A direction the machine cannot render is offered with its cost and options, not hidden.

## The core, always needed

| Tool | Install | Check |
|---|---|---|
| Node 18+ | `winget install OpenJS.NodeJS.LTS` / `brew install node` / distro package or nvm | `node -v` |
| FFmpeg and FFprobe | `winget install Gyan.FFmpeg` / `brew install ffmpeg` / `sudo apt install ffmpeg` | `ffmpeg -version` |
| Chromium for capture | `npm i playwright-core && npx playwright install chromium` | doctor |

Everything else is installed only when a chosen direction needs it.

## Engines by job

Realism rating: 5 means install and render fully from the command line, free, on Windows, macOS and Linux. 1 means a person must click, or a paid seat is required.

| Job | Tool | Install | Headless render | Licence catch | Rating |
|---|---|---|---|---|---|
| Vector, type, diagrams | Canvas template | in `templates/` | `node render.cjs render` | none | 5 |
| Any HTML page as film | Capture loop | in `templates/capture/` | `node capture.cjs` | none | 5 |
| HTML compositions, agent-first | HyperFrames | `npx hyperframes init my-video` | `npx hyperframes render` | Apache-2.0; still 0.x, pin it; some companion skills are paid | 5 |
| React, data-driven variants | Remotion | `npx create-video@latest` | `npx remotion render <entry> <id> out.mp4` | Free for individuals and companies of up to 3 people; larger companies need a paid licence. State this before choosing it. | 4 |
| Maths, charts, diagrams | Manim CE | `pip install manim` | `manim -qh scene.py Scene` | MIT; LaTeX only for `Tex` | 5 |
| Timeline choreography in DOM | GSAP | `npm i gsap` | seek a paused timeline per frame | Free but not open source; terms can change. Record the licence date. | 5 |
| Light timeline engine | anime.js v4 | `npm i animejs` | `.seek(ms)` per frame | MIT | 5 |
| Particles, sprites, filters | PixiJS v8 | `npm i pixi.js` | manual ticker per frame | MIT | 5 |
| Generative, hand-made | p5.js 2 | `npm i p5` | `noLoop()` plus `redraw()` per frame, seeded | LGPL-2.1 | 5 |
| Canvas without a browser | skia-canvas, @napi-rs/canvas | `npm i skia-canvas` | Node loop piping to FFmpeg | MIT | 5 |
| Shader looks | raw WebGL, ogl, regl | `npm i ogl` | `u_time = frame / fps` in capture loop | Do not paste Shadertoy code: most is non-commercial | 4 |
| Designer hand-off | lottie-web, Rive | `npm i lottie-web` | `goToAndStop(frame, true)`; Rive CLI screenshots | Check each file's own licence | 4 |
| Glyph outlines, morphs | opentype.js, flubber | `npm i opentype.js flubber` | inside any 2D engine | MIT | 5 |
| Charts | D3 | `npm i d3` | drive scales from the frame, not transitions | ISC | 5 |
| 3D, product, sims | Blender 5.2 LTS | see below | `blender -b -P script.py` | GPL tool; output is yours | 5 |
| Light 3D in a 2D film | three.js | `npm i three` | in the capture loop | MIT | 4 |
| Real-time 3D from text files | Godot 4 | `winget install GodotEngine.GodotEngine` / `brew install --cask godot` | `godot --path proj --write-movie out.avi --fixed-fps 30` | MIT; needs a GPU or software GL | 4 |
| Footage editing | FFmpeg | core | filtergraphs from a cut list | none | 5 |
| Stills, sheets | ImageMagick | `winget install ImageMagick.ImageMagick` / brew / apt | `magick` | none | 5 |
| EXR and colour transforms | OpenImageIO | `brew install openimageio` / `sudo apt install openimageio-tools` | `oiiotool` | none | 5 |
| Captions and word timings | faster-whisper, WhisperX, stable-ts | `pip install faster-whisper` | CLI or short script | MIT / BSD | 5 |
| Background removal | rembg | `pip install "rembg[cli]"` | `rembg i in.png out.png` | MIT; check the model's licence | 5 |
| Upscale, frame interpolation | Real-ESRGAN, RIFE (ncnn builds) | release binaries | CLI | BSD / MIT; needs Vulkan | 4 |
| Vectorise | vtracer | `cargo install vtracer` or release binary | `vtracer --input in.png --output out.svg` | MIT | 5 |
| Content credentials | c2patool | `cargo install c2patool` or release binary | `c2patool in.mp4 -m manifest.json -o out.mp4` | needs a real signing certificate for production | 4 |
| Generated image, video, voice, music | provider APIs | key supplied by the user | HTTPS | Paid; terms per provider and per model. See `generative.md`. | 3 |

## Tools to use only if the user already owns them

They need a paid seat, a login, or a visible application. Never plan around them unless the user confirms they are installed and licensed, and never sign in or accept terms for the user.

| Tool | Command-line path | Note |
|---|---|---|
| After Effects | `aerender -project p.aep -comp Main -output out.mov` | Windows and macOS only. Verify every frame: bad frames with a success exit code have been reported. |
| DaVinci Resolve | Scripting API | External scripting is Studio-only in recent versions. Treat the free edition as manual. |
| Houdini | `hython`, `husk` | Apprentice is non-commercial and watermarked. |
| Unreal Engine | Movie Render Queue from the command line | Very large install, strong GPU, scenes authored in the editor first. |
| Cinema 4D, Maya, Nuke | command-line renderers | Subscriptions. Nuke Non-commercial may not be used for paid work. |

## Tools that cannot be driven unattended

Cavalry, Jitter, Flourish, Rotato, Spline, TouchDesigner, Notch, Cascadeur. Use them as style references, or accept files a designer exported from them.

## Blender install

Pin 5.2 LTS unless the job needs something newer.

```bash
winget install -e --id BlenderFoundation.Blender      # Windows
brew install --cask blender                            # macOS
sudo snap install blender --classic                    # Linux desktop
# Linux server: download the pinned tarball from download.blender.org/release/, untar, run ./blender --version
# As a Python module (needs the exact Python version the wheel was built for)
uv run --python 3.13 --with bpy script.py
```

Always: `blender -b --factory-startup --python-exit-code 1 -P script.py -- <args>`. The API notes that matter are in `engines-3d.md`.

## MCP servers and agent tools

An MCP server can make a GUI application drivable (Blender, After Effects, Resolve, Figma) or wrap a provider (ElevenLabs, fal, Runway, Higgsfield, Google media). Rules:

- Rendering never depends on an MCP. The headless command line is the source of truth because it is reviewable and repeatable.
- A server that executes arbitrary code in an application (most Blender servers) is treated as remote code execution: localhost only, telemetry off, never while handling untrusted assets, and only with the user's consent. Check for open security advisories before recommending one.
- If a task needs a server that is not connected or not authorised, stop and ask the user to enable it. Never edit the user's MCP configuration.

## Hardware rules

| Situation | Do |
|---|---|
| Under 3 GB free memory | No local render. Stills only, or render remotely. |
| No GPU | Canvas, DOM (software GL), Manim, FFmpeg and Blender Cycles on CPU all work. Blender EEVEE, Godot and WebGPU do not. |
| Blender on CPU | Time one frame at final settings. A simple product shot can take minutes per frame, so a 10 s shot can take hours. Decide with the number in hand. |
| Long render | Frames to disk, resumable, one render at a time, a memory cap if in a container. |
| Too slow | Draft at half size for review; cut samples and denoise; shorten or flatten the 3D shots; then ask about a remote machine or rented GPU, with the estimated cost. |

Remote options the user must set up or approve: their own server, a rented GPU machine (run the same headless commands there), a managed render service. Never send confidential client assets to a volunteer render farm.

## Licence catches to state before choosing

- **Remotion:** paid above 3 people.
- **GSAP:** free, not open source, vendor can change terms.
- **p5.js:** LGPL. Fine to use; do not ship a modified copy without its source.
- **Shader snippets from sharing sites:** usually non-commercial. Write shaders from scratch.
- **Open model weights:** many are non-commercial or revenue-capped. See `generative.md`.
- **Fonts:** use the client's licensed fonts or open fonts (most Google Fonts are OFL). Record the font licence in `provenance.json`.
- **3D assets and textures:** CC0 sources first (Poly Haven, ambientCG, Kenney). CC-BY needs a credit. Refuse non-commercial, no-derivatives and unknown licences. Do not use recognisable real device models; build a generic device.

## Pinning and reproducibility

- Commit `package.json` and lock files; record tool versions in `doctor.json` next to the delivery.
- Pin the Chromium that Playwright downloads; pixel output changes between versions.
- For identical pixels across machines, run WebGL through software rendering and keep the same fonts installed.
