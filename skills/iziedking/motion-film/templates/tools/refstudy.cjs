'use strict';
/* Measures a reference video so its craft can be studied: cuts and shot
   lengths, a contact sheet, one still per shot, the dominant palette and the
   loudness. It reads the reference and writes a study folder; no reference
   pixels belong in a finished film.

   node refstudy.cjs ref.mp4 [--out study/ref] [--threshold 0.3] [--max-shots 80]

   Needs FFmpeg and FFprobe on PATH. */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const args = process.argv.slice(2);
const opt = (name, fallback) => { const i = args.indexOf(name); return i === -1 ? fallback : args[i + 1]; };
// The video is the first argument that is neither an option nor an option's value.
const input = args.find((a, i) => !a.startsWith('--') && !(i > 0 && args[i - 1].startsWith('--')));
if (!input || !fs.existsSync(input)) { console.error('Usage: node refstudy.cjs <video> [--out dir] [--threshold 0.3] [--max-shots 80]'); process.exit(1); }

const out = path.resolve(opt('--out', path.join('study', path.basename(input, path.extname(input)).replace(/[^\w.-]+/g, '_'))));
const threshold = Number(opt('--threshold', '0.3'));
const maxShots = Number(opt('--max-shots', '80'));
fs.mkdirSync(path.join(out, 'shots'), { recursive: true });

function ff(cmd, a, { allowFail = false } = {}) {
  const r = spawnSync(cmd, a, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 && !allowFail) throw new Error(`${cmd} failed:\n${(r.stderr || '').slice(-2000)}`);
  return { stdout: r.stdout || '', stderr: r.stderr || '' };
}

// 1. Probe.
const probe = JSON.parse(ff('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', input]).stdout);
const v = probe.streams.find((s) => s.codec_type === 'video');
const a = probe.streams.find((s) => s.codec_type === 'audio');
if (!v) throw new Error('No video stream found.');
const duration = Number(probe.format.duration);
const [fn, fd] = v.r_frame_rate.split('/').map(Number);
const fps = fn / (fd || 1);
fs.writeFileSync(path.join(out, 'probe.json'), JSON.stringify({
  file: path.basename(input), duration, width: v.width, height: v.height, fps: +fps.toFixed(3),
  videoCodec: v.codec_name, audioCodec: a ? a.codec_name : null, bytes: Number(probe.format.size),
}, null, 2));

// 2. Cuts. Downscaled first so long files are quick; scene score is unaffected.
const scene = ff('ffmpeg', ['-hide_banner', '-i', input, '-vf', `scale=320:-2,select='gt(scene,${threshold})',showinfo`, '-an', '-f', 'null', '-']).stderr;
const cutTimes = [...scene.matchAll(/pts_time:([\d.]+)/g)].map((m) => Number(m[1])).filter((t) => t > 0.05 && t < duration - 0.05);
const bounds = [0, ...cutTimes, duration];
const shots = [];
for (let i = 0; i < bounds.length - 1; i++) {
  const len = bounds[i + 1] - bounds[i];
  if (len < 1.5 / fps) continue; // a one-frame "shot" is a flash or a detection echo
  shots.push({ n: shots.length + 1, start: +bounds[i].toFixed(3), end: +bounds[i + 1].toFixed(3), length: +len.toFixed(3), frames: Math.round(len * fps) });
}
fs.writeFileSync(path.join(out, 'cuts.json'), JSON.stringify({ threshold, cuts: cutTimes.map((t) => +t.toFixed(3)), shots }, null, 2));

// 3. Contact sheet of the whole film: 24 frames at even intervals.
const cols = 6, rows = 4;
ff('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-vf', `fps=${(cols * rows) / duration},scale=480:-2,tile=${cols}x${rows}`, '-frames:v', '1', '-q:v', '4', path.join(out, 'contact.jpg')]);

// 4. One still from the middle of each shot (evenly sampled if there are very many).
const step = Math.max(1, Math.ceil(shots.length / maxShots));
for (let i = 0; i < shots.length; i += step) {
  const s = shots[i];
  const mid = (s.start + s.end) / 2;
  ff('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', mid.toFixed(3), '-i', input, '-frames:v', '1', '-vf', 'scale=640:-2', '-q:v', '4', path.join(out, 'shots', `shot-${String(s.n).padStart(3, '0')}.jpg`)], { allowFail: true });
}

// 5. Dominant palette, shown as large swatches.
ff('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-vf', 'fps=1,scale=160:-2,palettegen=max_colors=8:reserve_transparent=0:stats_mode=full,scale=512:512:flags=neighbor', '-frames:v', '1', path.join(out, 'palette.png')], { allowFail: true });

// 6. Sound: loudness and a spectrogram.
let loud = { integrated: null, truePeak: null };
if (a) {
  const l = ff('ffmpeg', ['-hide_banner', '-i', input, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { allowFail: true }).stderr;
  fs.writeFileSync(path.join(out, 'loudness.txt'), l);
  const I = (l.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop();
  const P = (l.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop();
  loud = { integrated: I ? Number(I.match(/-?[\d.]+/)[0]) : null, truePeak: P ? Number(P.match(/-?[\d.]+/)[0]) : null };
  ff('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', input, '-lavfi', 'showspectrumpic=s=1600x400:legend=0', path.join(out, 'spectrum.png')], { allowFail: true });
}

// 7. Summary.
const lens = shots.map((s) => s.length).sort((x, y) => x - y);
const median = lens.length ? lens[Math.floor(lens.length / 2)] : duration;
const longest = shots.reduce((m, s) => (s.length > m.length ? s : m), shots[0] || { n: 1, start: 0, length: duration });
const summary = `# Reference study: ${path.basename(input)}

| Measure | Value |
|---|---|
| Duration | ${duration.toFixed(2)} s |
| Size and rate | ${v.width}x${v.height}, ${fps.toFixed(3)} fps |
| Shots detected (threshold ${threshold}) | ${shots.length} |
| Median shot | ${median.toFixed(2)} s |
| Shortest and longest shot | ${(lens[0] ?? duration).toFixed(2)} s and ${(lens[lens.length - 1] ?? duration).toFixed(2)} s |
| Longest hold | shot ${longest.n}, from ${longest.start.toFixed(2)} s |
| Cuts per 10 s | ${((cutTimes.length / duration) * 10).toFixed(1)} |
| Audio | ${a ? `${a.codec_name}, ${loud.integrated ?? '?'} LUFS integrated, ${loud.truePeak ?? '?'} dBFS peak` : 'none'} |

Few detected cuts in a busy film means it moves by morphs, wipes or continuous camera work: lower the
threshold (0.15 to 0.25) and look at the contact sheet.

Files: probe.json, cuts.json, contact.jpg, shots/, palette.png${a ? ', loudness.txt, spectrum.png' : ''}.

Next: look at the stills and fill in the written study in references/reference-study.md
(structure, picture, motion, sound, what makes it good), then the build plan table.
`;
fs.writeFileSync(path.join(out, 'summary.md'), summary);
console.log(summary);
console.log(`Study written to ${out}`);
