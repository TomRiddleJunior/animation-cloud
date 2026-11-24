# Animation & video skill library — router

204 agent skills from 15 vetted upstream repos, vendored under `skills/<vendor>/<skill>/SKILL.md`.
Do not load everything: read this router, load only the SKILL.md files the task needs, and follow
their own `references/` links when a step requires it. Full provenance (HEAD SHAs, licenses,
security vetting): `deliverables/vetting-report.md` and `deliverables/skill-registry.json`.

## Route by intent

| Intent | Load first |
|---|---|
| Render any coded video end-to-end (HTML → MP4, deterministic frame-by-frame) | `hyperframes/hyperframes` — root composition is `index.html`, scenes in `compositions/`, default 1920×1080 @30 fps |
| Video as React code; product/SaaS video; docs-from-code; captions; maps | `remotion/remotion-best-practices` (routes to the other 13 Remotion skills) |
| Web/UI/scroll motion (not video render) | `gsap/gsap-core`, then `gsap-timeline`, `gsap-scrolltrigger`, `gsap-react`, `gsap-performance`, `gsap-plugins` as needed |
| Explainer video in a proven house style (24 style families) | `safiullah/<style>` e.g. `explainer-kurzgesagt-style`, `explainer-vox`, `explainer-veritasium` |
| Episode from a style template (5 Pro templates) | `hyperframes/style-sampling` (paid feature; free path: pair a safiullah style with hyperframes) |
| Product promo from a real website/screenshots | `visualx/video-shotcraft` (124 shot recipe cards) or `faisal/product-launch-video`; single-purpose code video: `winhao/code-video` |
| Reverse-engineer a reference video | `hyperframes/reverse-any-video` (Pro/paid) or the free method in `deliverables/re-toolkit.md` |
| Kinetic typography (one effect) | `visualx/kinetic-type-vault` effects: `blur-glow`, `dash-cascade`, `flip-type`, `glitch-word`, `ink-flood`, `liquid-metal`, `ransom-note`, `shutter-type`, `smear-type`, `word-carousel` … |
| Full kinetic-type reel in code (Canvas 2D + WebGL + beat-locked score) | `visualx/kinetic-reel` |
| Math / physics / CS animation | `hmzbo/manim` (ManimCE via uv; optional LaTeX); 2D code-driven: `hmzbo/motion-canvas`; 3D: `hmzbo/threejs` |
| Blender / 3D production | `visualx/blender-core`, `blender-animation`, `blender-lighting-lookdev`, `blender-rendering`; cinematic 3D video: `cumalibilgic/cinematic-3d-video` |
| Animated diagrams, lower thirds, data viz on video | `visualx/animated-diagrams`, `visualx/lower-thirds`, `faisal/motion-graphics` |
| Why motion looks right (fundamentals, transferring to any tool) | `visualx/motion-design-principles` (LottieFiles), `visualx/animate`/`choreograph`/`animation-vocabulary` (Emil Kowalski), `visualx/motion-art-direction`, `visualx/shot-composition`, `visualx/beat-sync-editing`, `visualx/color-motion`, `visualx/diagram-animation`, `visualx/isometric-animation`, `frankxai/*` |
| Shorts / faceless channels / animated stories | `madhav/*` (16 production skills), `mromidev/claude-animated-shorts`, `faisal/reels`, `faisal/faceless-explainer` |
| Captions / subtitles / voice sync | `remotion/remotion-captions`, `hyperframes/captions-overlay`, `faisal/captions-overlay`, `faisal/embedded-captions`, `visualx/voice-subtitle-sync` |
| Motion-graphics site (graphic-design skill) | `hculap/motion-graphic` |
| Motion-film single skill (concept → shot list) | `iziedking/motion-film` |
| Production QA and release checks | `visualx/video-release-qa`, `faisal/qa`, `visualx/video-workflow` |
| Effects before hand-writing one | `hyperframes/hyperframes-registry` + `hyperframes/<block>` (7 installed showcase blocks) |

## Conventions

- A skill's folder is self-contained: `SKILL.md` plus its `references/`, `examples/`, `assets/`.
  Copy the pattern of the vendor you are working in; do not cross-link between vendors.
- Heavy media was excluded on install (contact sheets, sample audio, video assets). If a step
  demands upstream media, fetch it from the pinned upstream commit listed in
  `deliverables/skill-registry.json` — never re-clone at latest.
- Upstream updates: re-clone the repo at the pinned SHA, diff the SKILL.md set, update the
  registry via `node scripts/verify-skills.mjs --write-registry`.
- Trust notes that change how you run skills (telemetry beacons, paid features, one repo whose
  root `AGENTS.md` pushes a private "taste kernel"): `deliverables/vetting-report.md`.
