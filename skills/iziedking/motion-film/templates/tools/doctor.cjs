'use strict';
/* Reports what this machine can do for a film: tools, versions, memory, CPU,
   GPU, and which provider keys are present (names only, never values).

   node doctor.cjs            prints a table and writes doctor.json in the current folder
   node doctor.cjs --json     prints JSON only

   It installs nothing and changes nothing. */

const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const jsonOnly = process.argv.includes('--json');

function run(cmd, args, timeout = 15000) {
  try {
    const r = spawnSync(cmd, args, { encoding: 'utf8', timeout, windowsHide: true });
    if (r.error || r.status !== 0) return null;
    return `${r.stdout || ''}${r.stderr || ''}`.trim();
  } catch { return null; }
}
const firstLine = (s) => (s ? s.split(/\r?\n/)[0].trim() : null);
const version = (s) => (s ? (s.match(/\d+\.\d+(\.\d+)?/) || [null])[0] : null);

function tool(name, candidates, args = ['--version'], needs = '') {
  for (const cmd of candidates) {
    const out = run(cmd, args);
    if (out !== null) return { name, found: true, command: cmd, version: version(out), detail: firstLine(out), needs };
  }
  return { name, found: false, command: candidates[0], version: null, detail: null, needs };
}

function python() {
  for (const cmd of ['python3', 'python', 'py']) {
    const out = run(cmd, ['--version']);
    if (out !== null && /Python 3/.test(out)) return cmd;
  }
  return null;
}
function pyModule(py, mod) {
  if (!py) return { name: `python:${mod}`, found: false, version: null };
  const out = run(py, ['-c', `import importlib.metadata as m; print(m.version("${mod}"))`]);
  return { name: `python:${mod}`, found: out !== null, version: out ? firstLine(out) : null };
}

function chromium() {
  // Looks for a Playwright Chromium from the current project, without launching it.
  try {
    const pw = require(require.resolve('playwright-core', { paths: [process.cwd(), __dirname] }));
    const exe = pw.chromium.executablePath();
    return { name: 'chromium (playwright)', found: fs.existsSync(exe), command: exe, version: null, needs: '2D capture' };
  } catch {
    return { name: 'chromium (playwright)', found: false, command: 'npm i playwright-core && npx playwright install chromium', version: null, needs: '2D capture' };
  }
}

function gpu() {
  const nv = run('nvidia-smi', ['--query-gpu=name,memory.total', '--format=csv,noheader']);
  if (nv) return { found: true, kind: 'nvidia', detail: nv.split(/\r?\n/).map((s) => s.trim()) };
  if (process.platform === 'darwin') {
    const sp = run('system_profiler', ['SPDisplaysDataType'], 20000);
    const m = sp && sp.match(/Chipset Model: (.+)/);
    if (m) return { found: true, kind: /Apple/.test(m[1]) ? 'apple' : 'other', detail: [m[1].trim()] };
  }
  if (process.platform === 'win32') {
    const ps = run('powershell', ['-NoProfile', '-Command', '(Get-CimInstance Win32_VideoController).Name -join "|"'], 20000);
    if (ps) {
      const names = ps.split('|').map((s) => s.trim()).filter(Boolean);
      const real = names.filter((n) => !/Basic|Remote|Virtual|Hyper-V/i.test(n));
      return { found: real.length > 0, kind: real.length ? 'windows' : 'none', detail: names };
    }
  }
  const lspci = run('sh', ['-c', "lspci 2>/dev/null | grep -iE 'vga|3d|display'"]);
  if (lspci) return { found: !/llvmpipe|virtio|vmware|qxl|cirrus/i.test(lspci), kind: 'linux', detail: lspci.split(/\r?\n/) };
  return { found: false, kind: 'none', detail: [] };
}

const py = python();
const tools = [
  { name: 'node', found: true, command: process.execPath, version: process.versions.node, needs: 'everything' },
  tool('ffmpeg', ['ffmpeg'], ['-version'], 'everything'),
  tool('ffprobe', ['ffprobe'], ['-version'], 'everything'),
  chromium(),
  { name: 'python', found: !!py, command: py || 'python3', version: py ? version(run(py, ['--version'])) : null, needs: 'Manim, captions, cut-outs' },
  tool('blender', ['blender', 'C:\\Program Files\\Blender Foundation\\Blender 5.2\\blender.exe', 'C:\\Program Files\\Blender Foundation\\Blender 5.3\\blender.exe', '/Applications/Blender.app/Contents/MacOS/Blender'], ['--version'], '3D shots'),
  tool('manim', ['manim'], ['--version'], 'maths and chart shots'),
  tool('godot', ['godot', 'godot4'], ['--version'], 'real-time 3D'),
  tool('imagemagick', ['magick'], ['-version'], 'stills and sheets'),
  tool('oiiotool', ['oiiotool'], ['--version'], 'EXR and colour transforms'),
  tool('c2patool', ['c2patool'], ['--version'], 'content credentials'),
  tool('rembg', ['rembg'], ['--version'], 'cut-outs'),
  tool('whisperx', ['whisperx'], ['--help'], 'captions and word timings'),
  tool('vtracer', ['vtracer'], ['--version'], 'raster to vector'),
  tool('git', ['git'], ['--version'], 'history'),
];
const modules = ['bpy', 'manim', 'faster-whisper', 'stable-ts', 'rembg', 'opentimelineio'].map((m) => pyModule(py, m));

const KEY_NAMES = ['ELEVENLABS_API_KEY', 'FAL_KEY', 'RUNWAYML_API_SECRET', 'GEMINI_API_KEY', 'GOOGLE_API_KEY', 'OPENAI_API_KEY', 'REPLICATE_API_TOKEN', 'LUMA_API_KEY', 'PEXELS_API_KEY', 'PIXABAY_API_KEY'];
const keysPresent = KEY_NAMES.filter((k) => !!process.env[k]);

const freeGb = +(os.freemem() / 1024 ** 3).toFixed(1);
const totalGb = +(os.totalmem() / 1024 ** 3).toFixed(1);
const g = gpu();

const advice = [];
if (!tools[1].found || !tools[2].found) advice.push('Install FFmpeg and FFprobe: nothing renders without them.');
if (!tools[3].found) advice.push('Install Chromium for capture: npm i playwright-core && npx playwright install chromium');
if (freeGb < 3) advice.push(`Only ${freeGb} GB of memory is free: do not render here. Make stills only, or render on another machine.`);
if (!g.found) advice.push('No GPU found: Blender must use Cycles on the CPU (time one frame first). Blender EEVEE, Godot and WebGPU are not available; WebGL needs software rendering.');
if (!tools.find((t) => t.name === 'blender').found) advice.push('Blender is not installed: 3D shots need it (see references/toolchain.md).');
if (!keysPresent.length) advice.push('No provider keys in the environment: generated image, video, voice and music are unavailable until the user supplies one.');

const report = {
  checkedAt: new Date().toISOString(),
  platform: `${process.platform} ${os.release()} ${process.arch}`,
  cpus: os.cpus().length,
  memoryGb: { total: totalGb, free: freeGb },
  gpu: g,
  tools, pythonModules: modules,
  providerKeysPresent: keysPresent,
  advice,
};

if (jsonOnly) {
  process.stdout.write(JSON.stringify(report, null, 2));
} else {
  fs.writeFileSync(path.join(process.cwd(), 'doctor.json'), JSON.stringify(report, null, 2));
  const pad = (s, n) => String(s ?? '').padEnd(n);
  console.log(`${report.platform}, ${report.cpus} CPUs, ${freeGb} of ${totalGb} GB free, GPU: ${g.found ? g.detail.join('; ') : 'none found'}\n`);
  console.log(`${pad('Tool', 24)}${pad('Found', 7)}${pad('Version', 12)}Needed for`);
  for (const t of tools) console.log(`${pad(t.name, 24)}${pad(t.found ? 'yes' : 'no', 7)}${pad(t.version || '', 12)}${t.needs || ''}`);
  console.log('');
  for (const m of modules) console.log(`${pad(m.name, 24)}${pad(m.found ? 'yes' : 'no', 7)}${m.version || ''}`);
  console.log(`\nProvider keys present: ${keysPresent.length ? keysPresent.join(', ') : 'none'}`);
  if (advice.length) console.log(`\n${advice.map((a) => `- ${a}`).join('\n')}`);
  console.log('\nWrote doctor.json');
}
