'use strict';
/* Builds an edit of existing footage from a cut list, so the cut is data and
   the render is repeatable.

   node assemble.cjs cuts.json

   cuts.json (see cuts.example.json):
     fps, width, height        the film's format; every shot is conformed to it
     music, bpm, firstBeat     optional: a track, and a beat grid for shot lengths given in beats
     musicGain                 optional, default 0.8
     shots[]                   { src, in, beats | dur, speed?, audio?, gain?, fit? }
       in      start time in the source, seconds
       beats   length in beats of the music; or dur, length in seconds
       speed   0.5 is half speed, 2 is double (video only; clip sound is dropped when speed is not 1)
       audio   true to keep this shot's own sound
       fit     "fill" (default: crop to fill the frame) or "fit" (letterbox)

   Writes output/edit.mov (ProRes 422 HQ, with audio if any) and
   output/edit-map.json (the exact frame each shot starts on).

   Needs FFmpeg and FFprobe on PATH. */

const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const specPath = process.argv[2];
if (!specPath) { console.error('Usage: node assemble.cjs cuts.json'); process.exit(1); }
const base = path.dirname(path.resolve(specPath));
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const { fps, width, height } = spec;
if (!fps || !width || !height || !Array.isArray(spec.shots) || !spec.shots.length) throw new Error('cuts.json needs fps, width, height and shots');

const out = path.join(base, spec.output || 'output');
const tmp = path.join(out, 'segments');
fs.mkdirSync(tmp, { recursive: true });
const rel = (p) => path.resolve(base, p);

function ffmpeg(args) {
  const r = spawnSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...args], { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
  if (r.status !== 0) throw new Error(`ffmpeg failed:\n${r.stderr}`);
}
function hasAudio(file) {
  const r = spawnSync('ffprobe', ['-v', 'error', '-select_streams', 'a', '-show_entries', 'stream=index', '-of', 'csv=p=0', file], { encoding: 'utf8' });
  return r.status === 0 && r.stdout.trim().length > 0;
}

const beat = spec.bpm ? 60 / spec.bpm : null;
const map = [];
const audioClips = [];
let frameCursor = 0;

spec.shots.forEach((shot, i) => {
  const src = rel(shot.src);
  if (!fs.existsSync(src)) throw new Error(`Shot ${i + 1}: ${shot.src} not found`);
  const seconds = shot.beats != null ? (() => { if (!beat) throw new Error(`Shot ${i + 1} uses beats but cuts.json has no bpm`); return shot.beats * beat; })() : shot.dur;
  if (!seconds) throw new Error(`Shot ${i + 1} needs beats or dur`);
  const frames = Math.max(1, Math.round(seconds * fps));
  const speed = shot.speed || 1;
  const sourceSeconds = (frames / fps) * speed;
  const fit = shot.fit === 'fit'
    ? `scale=${width}:${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2`
    : `scale=${width}:${height}:force_original_aspect_ratio=increase,crop=${width}:${height}`;
  const seg = path.join(tmp, `seg-${String(i + 1).padStart(3, '0')}.mov`);
  // Trim on the input, retime, conform, and cut to an exact number of frames.
  ffmpeg(['-ss', String(shot.in || 0), '-t', String(sourceSeconds + 1 / fps), '-i', src,
    '-vf', `setpts=PTS/${speed},fps=${fps},${fit},setsar=1,format=yuv422p10le`,
    '-frames:v', String(frames), '-an',
    '-c:v', 'prores_ks', '-profile:v', '3', '-vendor', 'apl0',
    '-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', seg]);

  if (shot.audio && speed === 1 && hasAudio(src)) {
    const wav = path.join(tmp, `aud-${String(i + 1).padStart(3, '0')}.wav`);
    ffmpeg(['-ss', String(shot.in || 0), '-t', String(frames / fps), '-i', src, '-vn', '-ar', '48000', '-ac', '2',
      '-af', `afade=t=in:d=0.03,afade=t=out:st=${Math.max(0, frames / fps - 0.03)}:d=0.03,volume=${shot.gain ?? 1}`, '-c:a', 'pcm_s24le', wav]);
    audioClips.push({ wav, at: frameCursor / fps });
  }
  map.push({ shot: i + 1, src: shot.src, in: shot.in || 0, startFrame: frameCursor, frames, start: +(frameCursor / fps).toFixed(3), length: +(frames / fps).toFixed(3), speed });
  frameCursor += frames;
  console.log(`shot ${i + 1}: ${frames} frames from ${shot.src} @ ${shot.in || 0}s${speed !== 1 ? ` (speed ${speed})` : ''}`);
});

// Join the picture. Every segment shares codec, size, rate and pixel format, so a stream copy is exact.
const listFile = path.join(tmp, 'list.txt');
fs.writeFileSync(listFile, map.map((m) => `file '${path.join(tmp, `seg-${String(m.shot).padStart(3, '0')}.mov`).replace(/\\/g, '/').replace(/'/g, "'\\''")}'`).join('\n'));
const picture = path.join(out, 'edit-picture.mov');
ffmpeg(['-f', 'concat', '-safe', '0', '-i', listFile, '-c', 'copy', picture]);

const total = frameCursor / fps;
const edit = path.join(out, 'edit.mov');
const music = spec.music ? rel(spec.music) : null;

if (music || audioClips.length) {
  const inputs = [];
  const parts = [];
  const labels = [];
  let n = 0;
  if (music) {
    inputs.push('-i', music);
    parts.push(`[${n}:a]aresample=48000,aformat=channel_layouts=stereo,volume=${spec.musicGain ?? 0.8},atrim=0:${total},afade=t=out:st=${Math.max(0, total - 0.6)}:d=0.6[m]`);
    labels.push('[m]'); n++;
  }
  audioClips.forEach((c, i) => {
    inputs.push('-i', c.wav);
    const ms = Math.round(c.at * 1000);
    parts.push(`[${n}:a]adelay=${ms}|${ms}[c${i}]`);
    labels.push(`[c${i}]`); n++;
  });
  parts.push(`${labels.join('')}amix=inputs=${labels.length}:normalize=0,apad,atrim=0:${total}[a]`);
  const premix = path.join(out, 'edit-audio.wav');
  ffmpeg([...inputs, '-filter_complex', parts.join(';'), '-map', '[a]', '-ar', '48000', '-c:a', 'pcm_s24le', premix]);
  ffmpeg(['-i', picture, '-i', premix, '-c:v', 'copy', '-c:a', 'pcm_s24le', '-shortest', edit]);
} else {
  fs.copyFileSync(picture, edit);
}

fs.writeFileSync(path.join(out, 'edit-map.json'), JSON.stringify({ fps, width, height, frames: frameCursor, duration: +total.toFixed(3), bpm: spec.bpm || null, shots: map }, null, 2));
console.log(`\n${map.length} shots, ${frameCursor} frames (${total.toFixed(2)} s) -> ${edit}`);
console.log('This audio is a working mix. Finish the sound and loudness with references/sound-design.md before delivery.');
