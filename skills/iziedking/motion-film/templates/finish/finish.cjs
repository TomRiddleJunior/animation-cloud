'use strict';
/* Finishing for any film, whatever engines made its shots.

   node finish.cjs master  [finish.json]   grade, grain, add the mix -> output/<title>_master.mov (ProRes 422 HQ)
   node finish.cjs deliver [finish.json]   every delivery listed in finish.json, from its own source or the master
   node finish.cjs qc <file> [finish.json] measured checks, contact sheet, safe-zone image -> <file>.qc.json

   finish.json (see finish.example.json):
     title, fps, width, height
     picture      the assembled picture (a .mov, or a frame pattern such as frames/f_%05d.png)
     audio        the finished mix (.wav), optional
     grade        { contrast, saturation, curves, colorbalance, look } all optional; look is a .cube or a Hald .png
     grain        0 to 12, default 0
     vignette     true | false
     loudness     { integrated, truePeak } used by qc
     deliveries[] { name, codec: h264|h265|av1|prores, source?, crf?, maxMb?, safeZone?: "vertical" }

   Needs FFmpeg and FFprobe on PATH. */

const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const { spawnSync } = require('node:child_process');

const mode = process.argv[2];
const rest = process.argv.slice(3);
const cfgPath = path.resolve(rest.find((a) => a.endsWith('.json')) || 'finish.json');
const cfg = fs.existsSync(cfgPath) ? JSON.parse(fs.readFileSync(cfgPath, 'utf8')) : null;
const base = path.dirname(cfgPath);
const rel = (p) => path.resolve(base, p);
const out = cfg ? rel(cfg.output || 'output') : process.cwd();

function run(cmd, args, { allowFail = false } = {}) {
  const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  if (r.status !== 0 && !allowFail) throw new Error(`${cmd} failed:\n${(r.stderr || '').slice(-3000)}`);
  return r;
}
const TAGS = ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709', '-color_range', 'tv'];
const need = () => { if (!cfg) throw new Error(`finish.json not found at ${cfgPath}`); };

function gradeChain() {
  const g = cfg.grade || {};
  const f = ['format=gbrp16le'];
  if (g.look) f.push(g.look.toLowerCase().endsWith('.cube') ? `lut3d=file='${rel(g.look).replace(/\\/g, '/').replace(/:/g, '\\:')}':interp=tetrahedral` : null);
  if (g.contrast != null || g.saturation != null) f.push(`eq=contrast=${g.contrast ?? 1}:saturation=${g.saturation ?? 1}`);
  if (g.curves) f.push(`curves=m='${g.curves}'`);
  if (g.colorbalance) f.push(`colorbalance=${g.colorbalance}`);
  if (cfg.vignette) f.push('vignette=angle=PI/5');
  if (cfg.grain) f.push(`noise=alls=${cfg.grain}:allf=t+u`);   // once, last, over everything
  f.push('scale=out_color_matrix=bt709:out_range=tv', 'format=yuv422p10le');
  return f.filter(Boolean).join(',');
}

function master() {
  need();
  fs.mkdirSync(out, { recursive: true });
  const target = path.join(out, `${cfg.title}_master.mov`);
  const isFrames = /%0?\d*d/.test(cfg.picture);
  const args = ['-hide_banner', '-loglevel', 'error', '-y'];
  if (isFrames) args.push('-framerate', String(cfg.fps));
  args.push('-i', rel(cfg.picture));
  const g = cfg.grade || {};
  const hald = g.look && !g.look.toLowerCase().endsWith('.cube') ? rel(g.look) : null;
  if (hald) args.push('-i', hald);
  if (cfg.audio) args.push('-i', rel(cfg.audio));
  const audioIndex = hald ? 2 : 1;
  if (hald) {
    // A Hald image carries the look; apply it first, then the rest of the chain.
    args.push('-filter_complex', `[0:v]format=gbrp16le[b];[b][1:v]haldclut[h];[h]${gradeChain()}[v]`, '-map', '[v]');
  } else {
    args.push('-vf', gradeChain(), '-map', '0:v:0');
  }
  if (cfg.audio) args.push('-map', `${audioIndex}:a:0`, '-c:a', 'pcm_s24le', '-ar', '48000');
  else args.push('-an');
  args.push('-r', String(cfg.fps), '-c:v', 'prores_ks', '-profile:v', '3', '-vendor', 'apl0', '-pix_fmt', 'yuv422p10le', ...TAGS, target);
  run('ffmpeg', args);
  console.log(`Master written: ${target}`);
}

function deliveryArgs(d, input, target) {
  const a = ['-hide_banner', '-loglevel', 'error', '-y', '-i', input];
  const audio = ['-c:a', 'aac', '-b:a', '256k', '-ar', '48000'];
  if (d.codec === 'h264') return [...a, '-c:v', 'libx264', '-preset', 'slow', '-crf', String(d.crf ?? 16), '-profile:v', 'high', '-pix_fmt', 'yuv420p', ...TAGS, ...audio, '-movflags', '+faststart', target];
  if (d.codec === 'h265') return [...a, '-c:v', 'libx265', '-preset', 'slow', '-crf', String(d.crf ?? 18), '-pix_fmt', 'yuv420p10le', '-tag:v', 'hvc1', '-x265-params', 'colorprim=bt709:transfer=bt709:colormatrix=bt709:range=limited', ...audio, '-movflags', '+faststart', target];
  if (d.codec === 'av1') return [...a, '-c:v', 'libsvtav1', '-preset', '5', '-crf', String(d.crf ?? 30), '-g', '240', '-pix_fmt', 'yuv420p10le', ...TAGS.slice(0, 6), ...(d.silent ? ['-an'] : ['-c:a', 'libopus', '-b:a', '128k']), '-movflags', '+faststart', target];
  if (d.codec === 'prores') return [...a, '-c:v', 'prores_ks', '-profile:v', '3', '-vendor', 'apl0', '-pix_fmt', 'yuv422p10le', ...TAGS, '-c:a', 'pcm_s24le', target];
  throw new Error(`Unknown codec ${d.codec}`);
}

function deliver() {
  need();
  const masterFile = path.join(out, `${cfg.title}_master.mov`);
  const results = [];
  for (const d of cfg.deliveries || []) {
    const input = d.source ? rel(d.source) : masterFile;
    if (!fs.existsSync(input)) throw new Error(`${d.name}: source ${input} not found. Each ratio is re-composed and mastered on its own; a crop of the 16:9 master is not a delivery.`);
    const ext = d.codec === 'prores' ? 'mov' : 'mp4';
    const target = path.join(out, `${cfg.title}_${d.name}_${d.codec}.${ext}`);
    run('ffmpeg', deliveryArgs(d, input, target));
    const mb = fs.statSync(target).size / 1024 / 1024;
    const over = d.maxMb && mb > d.maxMb;
    results.push({ file: path.basename(target), mb: +mb.toFixed(1), overLimit: !!over });
    console.log(`${path.basename(target)}  ${mb.toFixed(1)} MB${over ? `  OVER the ${d.maxMb} MB limit: raise crf or use a two-pass capped encode` : ''}`);
    qc(target, { ...d, checkSize: !d.source });
  }
  fs.writeFileSync(path.join(out, 'deliveries.json'), JSON.stringify(results, null, 2));
}

function qc(file, d = {}) {
  if (!file || !fs.existsSync(file)) throw new Error('Usage: node finish.cjs qc <file> [finish.json]');
  const probe = JSON.parse(run('ffprobe', ['-v', 'error', '-count_frames', '-show_streams', '-show_format', '-of', 'json', file]).stdout);
  const v = probe.streams.find((s) => s.codec_type === 'video');
  const a = probe.streams.find((s) => s.codec_type === 'audio');
  const duration = Number(probe.format.duration);
  const [n, den] = v.r_frame_rate.split('/').map(Number);
  const fps = n / (den || 1);
  const failures = [];
  const warnings = [];

  // Size is checked only for deliveries made from the main master; other ratios have their own masters.
  if (cfg && d.checkSize) {
    if (v.width !== cfg.width || v.height !== cfg.height) failures.push(`dimensions ${v.width}x${v.height}, expected ${cfg.width}x${cfg.height}`);
  }
  if (cfg && Math.abs(fps - cfg.fps) > 0.01) failures.push(`frame rate ${fps.toFixed(3)}, expected ${cfg.fps}`);
  const frames = Number(v.nb_read_frames);
  if (Math.abs(frames - Math.round(duration * fps)) > 1) failures.push(`frame count ${frames} does not match duration ${duration.toFixed(3)} s at ${fps.toFixed(3)} fps`);
  for (const [key, want] of [['color_primaries', 'bt709'], ['color_transfer', 'bt709'], ['color_space', 'bt709']]) {
    if (v[key] !== want) warnings.push(`${key} is ${v[key] || 'untagged'}, expected ${want}`);
  }

  const decode = run('ffmpeg', ['-v', 'error', '-i', file, '-f', 'null', '-'], { allowFail: true });
  if (decode.status !== 0 || decode.stderr.trim()) failures.push('decoder reported errors');

  const det = run('ffmpeg', ['-hide_banner', '-i', file, '-vf', 'blackdetect=d=0.1:pix_th=0.02,freezedetect=n=0.001:d=1.5', '-an', '-f', 'null', '-'], { allowFail: true }).stderr;
  const black = [...det.matchAll(/black_start:([\d.]+)/g)].map((m) => Number(m[1]));
  const freeze = [...det.matchAll(/freeze_start: ?([\d.]+)/g)].map((m) => Number(m[1]));
  if (black.length) warnings.push(`black frames from ${black.map((t) => t.toFixed(2)).join(', ')} s: confirm they are intended`);
  if (freeze.length) warnings.push(`frozen picture from ${freeze.map((t) => t.toFixed(2)).join(', ')} s: confirm these are intended holds`);

  let I = null, peak = null;
  if (a) {
    const loud = run('ffmpeg', ['-hide_banner', '-i', file, '-af', 'ebur128=peak=true', '-f', 'null', '-'], { allowFail: true }).stderr;
    fs.writeFileSync(`${file}.audio-qc.txt`, loud);
    const mi = (loud.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop();
    const mp = (loud.match(/Peak:\s+(-?[\d.]+) dBFS/g) || []).pop();
    I = mi ? Number(mi.match(/-?[\d.]+/)[0]) : null;
    peak = mp ? Number(mp.match(/-?[\d.]+/)[0]) : null;
    const want = cfg && cfg.loudness;
    if (want && I != null && Math.abs(I - want.integrated) > 1) failures.push(`loudness ${I} LUFS, target ${want.integrated}`);
    if (want && peak != null && peak > want.truePeak + 0.1) failures.push(`true peak ${peak} dBTP, limit ${want.truePeak}`);
  } else {
    warnings.push('no audio stream');
  }

  const cols = 4, rows = Math.ceil(Math.min(24, Math.max(4, duration)) / cols);
  run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', file, '-vf', `fps=${(cols * rows) / duration},scale=480:-2,tile=${cols}x${rows}`, '-frames:v', '1', `${file}.contact.jpg`], { allowFail: true });
  if (d.safeZone === 'vertical' || v.height > v.width) {
    // Top 14%, bottom 35% and 6% each side are where platform controls sit on vertical video.
    const z = 'drawbox=x=0:y=0:w=iw:h=ih*0.14:color=red@0.35:t=fill,drawbox=x=0:y=ih*0.65:w=iw:h=ih*0.35:color=red@0.35:t=fill,drawbox=x=0:y=0:w=iw*0.06:h=ih:color=red@0.35:t=fill,drawbox=x=iw*0.94:y=0:w=iw*0.06:h=ih:color=red@0.35:t=fill';
    for (const share of [0.15, 0.5, 0.9]) {
      run('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-ss', String(duration * share), '-i', file, '-vf', z, '-frames:v', '1', `${file}.safezone-${Math.round(share * 100)}.jpg`], { allowFail: true });
    }
  }

  const report = {
    file: path.basename(file), passed: failures.length === 0, failures, warnings,
    width: v.width, height: v.height, codec: v.codec_name, pixelFormat: v.pix_fmt, fps: +fps.toFixed(3),
    frames, duration: +duration.toFixed(3), audioCodec: a ? a.codec_name : null,
    loudnessLUFS: I, truePeakDb: peak, bytes: Number(probe.format.size),
    sha256: crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'),
  };
  fs.writeFileSync(`${file}.qc.json`, JSON.stringify(report, null, 2));
  console.log(`QC ${report.passed ? 'passed' : 'FAILED'}: ${path.basename(file)}${failures.length ? `\n  ${failures.join('\n  ')}` : ''}${warnings.length ? `\n  note: ${warnings.join('\n  note: ')}` : ''}`);
  if (failures.length) process.exitCode = 1;
  return report;
}

try {
  if (mode === 'master') master();
  else if (mode === 'deliver') deliver();
  else if (mode === 'qc') qc(rest.find((a) => !a.endsWith('.json')));
  else throw new Error('Usage: node finish.cjs master|deliver|qc');
} catch (e) { console.error(e.message || e); process.exit(1); }
