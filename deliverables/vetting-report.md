# Vetting report — Mission 00

Method: every candidate repo was shallow-cloned at its HEAD (SHAs pinned in `skill-registry.md`),
all 323 upstream SKILL.md frontmatter blocks inventoried, then skill folders were scanned for
dangerous instruction patterns and scripts before selection. 204 of 323 installed.

## Automated scans

- `curl … | sh` style chain-loaders in SKILL.md files: **0 hits**.
- Prompt-injection phrasing ("ignore previous instructions", exfiltration): **0 hits**.
- Secret/credential patterns (`.env`, `id_rsa`, keychain, `~/aws`) in SKILL.md files: **0 live hits** —
  remaining matches are benign (a skill warning users not to put keys in `.env`, a graphics API
  literally named `K.env`, and the clonn catalog itself flagging `curl | bash` as a red flag).
- Scripts inside skill folders: ~3,200 files, almost all `.tsx`/`.js` **example source code** that is
  the skill's payload (Remotion components, kinetic-type effects), not install-time executables.
  Shell scripts outside skill payloads: none executed during install; nothing was run from the repos.

## Per-repo trust findings

| Repo | Verdict | Notes |
|---|---|---|
| remotion-dev/skills | ✅ install (official) | Maintained by the Remotion team; references company licensing; `remotion-best-practices` is the router. |
| heygen-com/hyperframes | ✅ install (official) | **Telemetry**: skills direct the agent to run `npx hyperframes events --skill=<name>` ("usage note"), disclosed in-skill and skippable. **Paid features**: `reverse-any-video` and `style-sampling` require HyperFrames Pro; free fallbacks documented in `re-toolkit.md`. |
| greensock/gsap-skills | ✅ install (official) | GSAP team; note GSAP's own license changed in 2025 (no longer fully free) — check before commercial web work. |
| Hmzbo/animation-skills | ✅ install | Clean docs-only skills for Manim/Motion Canvas/Three.js; `shared/` holds asset packs. |
| VisualxIntelligence/motion-tools-and-skills | ✅ install (curated) | Largest set (143). Occasional upsell to their "Creator MCP" for rendered exports — ignorable; fundamentals guides are vendor-neutral. |
| mromidev/claude-animated-shorts | ✅ install | Single coherent skill; 16 MB contact sheets excluded. |
| nessalazne/animation-agent-skill | ✅ install (1 skill) | `animate` wraps the HyperFrames engine → inherits its telemetry/paid notes. |
| madhavsomani/animation-skills | ✅ install | 16 production skills; some reference external "pixinit" tooling — treat as optional. |
| cumalibilgic/cinematic-3d-video | ✅ install | Self-contained single skill. |
| Safiullah-Rahu/claude-video-skills | ✅ install (curated) | 62 skills; heavy sample audio/video in several → 22 style skills installed. |
| Win-Hao/code-video | ✅ install | Self-contained. |
| hculap/skill-motion-graphic | ✅ install | Graphic-design skill; repo contains an unrelated `notion*` helper alongside — only the motion-graphic skill was installed. |
| Iziedking/motion-film-skill | ✅ install | Self-contained single skill. |
| frankxai/awesome-motion-design-agent-skills | ⚠️ partial | **Repo-root `AGENTS.md` instructs agents to adopt a private "taste kernel" (brand/persona layer)** — not installed, not followed. The 5 first-party skills are self-contained and clean; catalog links to third-party repos were not pulled. |
| clonn/awesome-agent-video-skills | 📇 catalog only | Discovery/review catalog; nothing installable (its review queue itself flags a `curl \| bash` installer as untrusted). |

## Selection decisions

- Everything from official sources (remotion-dev, heygen, greensock) was installed in full, minus asset-heavy demo material.
- From aggregator repos, skills were chosen for coverage of the mission's surfaces (render engines, motion fundamentals, explainer styles, production/QA, RE) rather than volume.
- License posture: MIT everywhere except HyperFrames (Apache-2.0), frankxai (Apache-2.0 wording, verify), and Remotion (company license — check the `remotion-license` skill before commercial distribution of renders).

## Residual risk

Pinned SHAs are the mitigation for supply-chain drift: upstream can change skills under the same
URL at any time. Re-clone → diff → re-vet on every update (procedure in `skill-registry.md`).
Nothing from any of these repos was executed during this mission; install was file-copy only.
