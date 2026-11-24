# Skill registry — Mission 00

204 agent skills for animation / motion / video, vendored under `skills/<vendor>/<skill>/SKILL.md`.
Machine-readable twin: `skill-registry.json` (regenerate with `node scripts/verify-skills.mjs --write-registry`).
Router: `skills/AGENTS.md`. Snapshot date: 2026-11-25.

Count by vendor:

| # | Vendor namespace | Upstream repo | Installed / upstream | License | Pinned HEAD SHA |
|---|---|---|---|---|---|
| 1 | `remotion/` | remotion-dev/skills | 14 / 14 | Remotion license¹ | `a3f4098a2afd0e13f6a6f8c8760e275f75457ea9` |
| 2 | `hyperframes/` | heygen-com/hyperframes | 22 / 29 | Apache-2.0 | `36d57639584d0534c32e816c87d9baf2a1683fd0` |
| 3 | `gsap/` | greensock/gsap-skills | 8 / 8 | MIT | `aed9cfd3277740755f6bfc1155c7aa645403b760` |
| 4 | `faisal/` | faisalfaisu/claude-video-skills | 33 / 41 | MIT | `67b36164386277703c5cfbdf2c6f66f8856f6cc5` |
| 5 | `hmzbo/` | Hmzbo/animation-skills | 4 / 6² | MIT | `42dd41ec0b700999d2d013f19affa3c72333f265` |
| 6 | `visualx/` | VisualxIntelligence/motion-tools-and-skills | 74 / 143 | MIT | `69eb0c3d362d4740cacf7b619b1bdf40d3c2c752` |
| 7 | `mromidev/` | mromidev/claude-animated-shorts | 1 / 1 | MIT | `e3b817b6afc6cd413466d43f11ba31209e034bbf` |
| 8 | `nessalazne/` | nessalazne/animation-agent-skill | 1 / 1 | MIT | `51c22ed815ff799222d1d9a6883734245e25692f` |
| 9 | `madhav/` | madhavsomani/animation-skills | 16 / 16 | MIT | `d2b562dd4a0aa1a8cf7d6a35b6719318cf372c51` |
| 10 | `cumalibilgic/` | cumalibilgic/cinematic-3d-video | 1 / 1 | MIT | `ef6cbdc15c55788348402aa42f1caab8396bb496` |
| 11 | `safiullah/` | Safiullah-Rahu/claude-video-skills | 22 / 62 | MIT | `3842756bd657b227e2b791024358abb92f714d78` |
| 12 | `winhao/` | Win-Hao/code-video | 1 / 1 | MIT | `6e806a5a14d7270f5e726cd07d16b4ef7fb4d2c9` |
| 13 | `hculap/` | hculap/skill-motion-graphic | 1 / 1 | MIT | `8f710eeef1aad6468286848a391638bc2ad7b3f2` |
| 14 | `iziedking/` | Iziedking/motion-film-skill | 1 / 1 | MIT | `b2dcf5c5121a9c20da713e63c525f6c8f8e6df8d` |
| 15 | `frankxai/` | frankxai/awesome-motion-design-agent-skills | 5 / 5³ | Apache-2.0⁴ | `e7dc6e2e728c918ffcea5edb2d7c94e2a6f7785d` |
| — | *(catalog, nothing installed)* | clonn/awesome-agent-video-skills | 0 / 0 | MIT | `5747288335fffc2f599cde0d41f0dd54d700f51d` |
| | | | **204** | | |

¹ `remotion-dev/skills` ships no LICENSE file; the skills reference the Remotion company license (free for individuals/small teams, paid for larger companies). See `remotion/remotion-license/SKILL.md` and check before commercial use.
² hmzbo also ships `skills/agents/*` (non-SKILL.md prompt bundles) and `shared/` assets — installed under `hmzbo/shared/`.
³ frankxai indexes ~30 third-party repos; only its 5 first-party skills are installed.
⁴ Grant language detected, but verify the exact Apache-2.0 text in the repo LICENSE before redistribution.

## Curated exclusions (heavy assets, not skills)

- `hyperframes/changelog-video/assets/` — sample media for one showcase skill (skill doc installed).
- `mromidev/claude-animated-shorts/references/sheets/` — 16 MB of reference contact-sheet JPEGs.
- `safiullah/` and `faisal/` asset-heavy skills not selected (sample audio/video and demo projects for styles we did not take; e.g. `explainer-engineering-hud` sample audio alone is multi-MB).
- All `.git` dirs (≈2.4 GB total) — deleted at install; the pinned SHAs above are the provenance.

## Duplicate names across repos (resolved by namespacing)

13 SKILL.md folder names collide across repos (e.g. `captions-overlay`, `motion-doctrine`, `cut-the-curve`, `slideshow`, `oversized-cursor`, `seam-craft`, `figma`, `video-shotcraft`, `animate`, `painted-animation`, `remotion-to-hyperframes`, `changelog-video`, `skill`). The `<vendor>/` namespace keeps every copy; prefer `hyperframes/` for shared-name doctrine skills (it is the origin), `faisal/` for production skills.

## Update procedure

1. `git clone --depth 1 <repo>` a fresh copy; `git rev-parse HEAD`.
2. If the SHA differs from the pinned one above, diff the `skills/` trees; re-run the relevant block of `.scratch-mission00/install.sh` (kept as the canonical installer).
3. `node scripts/verify-skills.mjs --write-registry` and commit the refreshed JSON.

## Runtime note (this machine)

This CLI (ML AI Code) does not auto-load project-local skills; its own 61 built-in runtime skills live in app-managed storage and cannot be extended from a project. The fallback the mission prescribes is what we built: a project-local `skills/` library plus a workspace `AGENTS.md` router that any agent reads first. When this workspace's tasks touch animation/video, load the routed SKILL.md files as context.
