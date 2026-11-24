#!/usr/bin/env node
// Mission 00 — verify every SKILL.md under skills/ is loadable and (with
// --write-registry) regenerate deliverables/skill-registry.json.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, dirname, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const LIB = join(here, '..', 'skills');
const REGISTRY = join(here, '..', 'deliverables', 'skill-registry.json');

// Pinned provenance captured at install time (git ls-remote / rev-parse, 2026-11-25).
const SOURCES = [
  { vendor: 'remotion',    repo: 'remotion-dev/skills',                     sha: 'a3f4098a2afd0e13f6a6f8c8760e275f75457ea9', license: 'Remotion license (see remotion-dev/remotion); no LICENSE file in skills repo', upstream_skills: 14,  trust: [] },
  { vendor: 'hyperframes', repo: 'heygen-com/hyperframes',                  sha: '36d57639584d0534c32e816c87d9baf2a1683fd0', license: 'Apache-2.0',  upstream_skills: 29,  trust: ['telemetry beacon (npx hyperframes events/usage)', 'reverse + style templates are paid Pro features'] },
  { vendor: 'gsap',        repo: 'greensock/gsap-skills',                   sha: 'aed9cfd3277740755f6bfc1155c7aa645403b760', license: 'MIT',         upstream_skills: 8,   trust: [] },
  { vendor: 'faisal',      repo: 'faisalfaisu/claude-video-skills',         sha: '67b36164386277703c5cfbdf2c6f66f8856f6cc5', license: 'MIT',         upstream_skills: 41,  trust: ['curated install: 33 of 41 (asset-heavy skills excluded)'] },
  { vendor: 'hmzbo',       repo: 'Hmzbo/animation-skills',                  sha: '42dd41ec0b700999d2d013f19affa3c72333f265', license: 'MIT',         upstream_skills: 6,   trust: [] },
  { vendor: 'visualx',     repo: 'VisualxIntelligence/motion-tools-and-skills', sha: '69eb0c3d362d4740cacf7b619b1bdf40d3c2c752', license: 'MIT',     upstream_skills: 143, trust: ['some skills upsell "Creator MCP" for rendered exports', 'curated install: 74 of 143'] },
  { vendor: 'mromidev',    repo: 'mromidev/claude-animated-shorts',         sha: 'e3b817b6afc6cd413466d43f11ba31209e034bbf', license: 'MIT',         upstream_skills: 1,   trust: ['16 MB reference contact sheets excluded'] },
  { vendor: 'nessalazne',  repo: 'nessalazne/animation-agent-skill',        sha: '51c22ed815ff799222d1d9a6883734245e25692f', license: 'MIT',         upstream_skills: 1,   trust: ['wraps the HyperFrames engine (telemetry beacon)'] },
  { vendor: 'madhav',      repo: 'madhavsomani/animation-skills',           sha: 'd2b562dd4a0aa1a8cf7d6a35b6719318cf372c51', license: 'MIT',         upstream_skills: 16,  trust: [] },
  { vendor: 'cumalibilgic',repo: 'cumalibilgic/cinematic-3d-video',         sha: 'ef6cbdc15c55788348402aa42f1caab8396bb496', license: 'MIT',         upstream_skills: 1,   trust: [] },
  { vendor: 'safiullah',   repo: 'Safiullah-Rahu/claude-video-skills',      sha: '3842756bd657b227e2b791024358abb92f714d78', license: 'MIT',         upstream_skills: 62,  trust: ['curated install: 22 style skills of 62 total'] },
  { vendor: 'winhao',      repo: 'Win-Hao/code-video',                      sha: '6e806a5a14d7270f5e726cd07d16b4ef7fb4d2c9', license: 'MIT',         upstream_skills: 1,   trust: [] },
  { vendor: 'hculap',      repo: 'hculap/skill-motion-graphic',             sha: '8f710eeef1aad6468286848a391638bc2ad7b3f2', license: 'MIT',         upstream_skills: 1,   trust: [] },
  { vendor: 'iziedking',   repo: 'Iziedking/motion-film-skill',             sha: 'b2dcf5c5121a9c20da713e63c525f6c8f8e6df8d', license: 'MIT',         upstream_skills: 1,   trust: [] },
  { vendor: 'frankxai',    repo: 'frankxai/awesome-motion-design-agent-skills', sha: 'e7dc6e2e728c918ffcea5edb2d7c94e2a6f7785d', license: 'Apache-2.0 (grant language detected; verify upstream)', upstream_skills: 5, trust: ["repo root AGENTS.md pushes a private 'taste kernel' — NOT installed; the 5 skills are self-contained"] },
  { vendor: '(catalog)',   repo: 'clonn/awesome-agent-video-skills',        sha: '5747288335fffc2f599cde0d41f0dd54d700f51d', license: 'MIT',         upstream_skills: 0,   trust: ['discovery catalog only — nothing installed'] },
];

function walk(dir, out = []) {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name === 'SKILL.md') out.push(p);
  }
  return out;
}

function frontmatter(text) {
  const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
  if (!m) return null;
  const fm = { name: undefined, description: undefined };
  const lines = m[1].split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const km = /^(name|description):\s*(.*)$/.exec(lines[i]);
    if (!km) continue;
    let v = km[2].trim();
    if (v === '>' || v === '|' || v === '>-' || v === '|-') {
      const buf = [];
      for (let j = i + 1; j < lines.length && (/^\s+\S/.test(lines[j]) || lines[j].trim() === ''); j++) {
        buf.push(lines[j].trim());
        i = j;
      }
      v = buf.join(' ');
    }
    v = v.replace(/^["']|["']$/g, '');
    fm[km[1]] = v;
  }
  return fm;
}

const files = walk(LIB);
const problems = [];
const skills = [];
for (const f of files) {
  const rel = relative(LIB, f).split(sep).join('/');
  const vendor = rel.split('/')[0];
  const text = readFileSync(f, 'utf8');
  const fm = frontmatter(text);
  if (!fm) { problems.push(`${rel}: no frontmatter block`); continue; }
  if (!fm.name) problems.push(`${rel}: frontmatter missing 'name'`);
  if (!fm.description) problems.push(`${rel}: frontmatter missing 'description'`);
  if (fm.name && !text.includes(fm.name) === false && fm.name.length > 80) problems.push(`${rel}: name suspiciously long`);
  skills.push({
    vendor,
    path: `skills/${rel}`,
    name: fm.name || null,
    description: (fm.description || '').slice(0, 300),
  });
}

const perVendor = {};
for (const s of skills) perVendor[s.vendor] = (perVendor[s.vendor] || 0) + 1;

console.log(`Scanned ${skills.length} SKILL.md files under skills/`);
for (const [v, n] of Object.entries(perVendor).sort((a, b) => b[1] - a[1])) console.log(`  ${String(n).padStart(3)}  ${v}`);
if (problems.length) {
  console.log(`\nFAIL — ${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log('\nPASS — every SKILL.md parses (--- frontmatter with name + description)');

if (process.argv.includes('--write-registry')) {
  mkdirSync(dirname(REGISTRY), { recursive: true });
  const registry = {
    mission: 'Mission 00 — animation skill arsenal',
    generated_at: new Date().toISOString(),
    library: { root: 'skills/', total_skills: skills.length, loader: 'skills/AGENTS.md router' },
    method: 'shallow clones at pinned HEAD SHAs, SKILL.md frontmatter vetted and copied into vendor namespaces',
    sources: SOURCES.map((s) => ({ ...s, installed: perVendor[s.vendor] || 0 })),
    skills,
  };
  writeFileSync(REGISTRY, JSON.stringify(registry, null, 2) + '\n');
  console.log(`Wrote ${relative(here, REGISTRY)} (${skills.length} skills, ${SOURCES.length} sources)`);
}
