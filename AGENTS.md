# OSS workspace

Two separate projects live here:

1. **Animation skill library** (`skills/`) — 204 vetted agent skills for animation,
   motion design and video, installed by Mission 00 (2026-11-25). When any task
   involves animation, motion, video, explainer, reels, kinetic type, 3D or
   reverse-engineering a reference video, read `skills/AGENTS.md` first: it routes
   the task to the right `skills/<vendor>/<skill>/SKILL.md`. Machine-readable
   registry: `deliverables/skill-registry.json`. Mission docs: `deliverables/`.
2. **omnitrix-api/** — private LLM gateway (New API + Postgres + Redis + Caddy on
   a VPS). Its own docs apply; unrelated to the skill library.
