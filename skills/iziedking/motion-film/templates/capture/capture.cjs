'use strict';
/* Renders any HTML page that meets the frame contract to frames or a video.

   The page must expose:
     window.ready        a promise resolving to { width, height, fps, frames } once fonts, images and shaders are loaded
     window.renderFrame  (i) => void | Promise<void>, drawing frame i (fractional i is allowed for motion blur)

   node capture.cjs shot.html --out frames/           PNG sequence f_00000.png ...
   node capture.cjs shot.html --out shot.mov          ProRes 422 HQ mezzanine
   node capture.cjs shot.html --out shot.mov --alpha  ProRes 4444 with transparency (page background must be transparent)
   node capture.cjs shot.html --out shot.mp4          H.264 review file
   Options:
     --from N --to N      frame range (to is exclusive); default the whole shot
     --blur N             N sub-frames per frame averaged over a 180 degree shutter (opaque output only)
     --selector CSS       capture one element instead of the viewport
     --gl swiftshader     software WebGL for machines without a GPU (slow)
     --scale N            device scale factor (default 1)

   Needs Node 18+, FFmpeg on PATH, `npm i playwright-core`, and a Chromium
   (`npx playwright install chromium`, or set CHROMIUM_PATH). */

const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { pathToFileURL } = require('node:url');

const args = process.argv.slice(2);
const has = (n) => args.includes(n);
const opt = (n, d) => { const i = args.indexOf(n); return i === -1 ? d : args[i + 1]; };
const pageArg = args.find((a, i) => !a.startsWith('--') && !(i > 0 && ['--out', '--from', '--to', '--blur', '--selector', '--gl', '--scale'].includes(args[i - 1])));
if (!pageArg || !opt('--out')) { console.error('Usage: node capture.cjs <page.html|url> --out <dir/|file.mov|file.mp4> [--alpha] [--blur N] [--from N --to N] [--selector CSS] [--gl swiftshader] [--scale N]'); process.exit(1); }

const outArg = opt('--out');
const alpha = has('--alpha');
const blur = Math.max(1, Number(opt('--blur', '1')));
const selector = opt('--selector', null);
const scale = Number(opt('--scale', '1'));
if (alpha && blur > 1) { console.error('--blur averages opaque frames; render alpha shots without it.'); process.exit(1); }

const url = /^https?:\/\//.test(pageArg) ? pageArg : pathToFileURL(path.resolve(pageArg)).href;
const ext = path.extname(outArg).toLowerCase();
const toDir = ext === '';

function encoderArgs(meta) {
  const inRate = String(meta.fps * blur);
  const base = ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-vcodec', 'png', '-framerate', inRate, '-i', 'pipe:0', '-an'];
  // With blur, every output frame is the mean of its N sub-frames: keep the last of each group after tmix.
  const blurVf = blur > 1 ? [`tmix=frames=${blur}`, `select='eq(mod(n\\,${blur})\\,${blur - 1})'`, `setpts=N/(${meta.fps}*TB)`] : [];
  const tags = ['-color_primaries', 'bt709', '-color_trc', 'bt709', '-colorspace', 'bt709'];
  if (toDir) {
    fs.mkdirSync(outArg, { recursive: true });
    const vf = blurVf.length ? ['-vf', blurVf.join(',')] : [];
    return [...base, ...vf, '-r', String(meta.fps), '-start_number', String(meta.first), path.join(outArg, 'f_%05d.png')];
  }
  fs.mkdirSync(path.dirname(path.resolve(outArg)), { recursive: true });
  if (ext === '.mov') {
    const pix = alpha ? 'yuva444p10le' : 'yuv422p10le';
    const vf = [...blurVf, alpha ? `format=${pix}` : `scale=out_color_matrix=bt709:out_range=tv,format=${pix}`].join(',');
    return [...base, '-vf', vf, '-r', String(meta.fps), '-c:v', 'prores_ks', '-profile:v', alpha ? '4' : '3', '-vendor', 'apl0', ...(alpha ? ['-alpha_bits', '16'] : []), ...tags, outArg];
  }
  if (ext === '.mp4') {
    const vf = [...blurVf, 'scale=out_color_matrix=bt709:out_range=tv,format=yuv420p'].join(',');
    return [...base, '-vf', vf, '-r', String(meta.fps), '-c:v', 'libx264', '-preset', 'slow', '-crf', '16', ...tags, '-color_range', 'tv', '-movflags', '+faststart', outArg];
  }
  throw new Error('--out must be a folder, a .mov or a .mp4');
}

async function main() {
  const { chromium } = require('playwright-core');
  const launchArgs = ['--disable-dev-shm-usage', '--font-render-hinting=none', '--force-color-profile=srgb', '--hide-scrollbars'];
  if (opt('--gl') === 'swiftshader') launchArgs.push('--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist');
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: launchArgs });
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: scale });
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.goto(url, { waitUntil: 'load' });
  const meta = await page.evaluate(() => window.ready);
  if (!meta || !meta.fps || !meta.frames) throw new Error('window.ready must resolve to { width, height, fps, frames }');
  if ((await page.evaluate(() => typeof window.renderFrame)) !== 'function') throw new Error('window.renderFrame(i) is missing');
  await page.setViewportSize({ width: meta.width, height: meta.height });

  meta.first = Number(opt('--from', '0'));
  const last = Number(opt('--to', String(meta.frames)));
  const target = selector ? await page.$(selector) : page;
  if (!target) throw new Error(`No element matches ${selector}`);

  const enc = spawn('ffmpeg', encoderArgs(meta), { stdio: ['pipe', 'ignore', 'pipe'] });
  let log = '';
  enc.stderr.on('data', (d) => (log += d));
  const done = once(enc, 'exit');
  const started = Date.now();

  for (let f = meta.first; f < last; f++) {
    for (let k = 0; k < blur; k++) {
      // Sub-frames cover the first half of the frame interval: a 180 degree shutter.
      const i = blur > 1 ? f + (k / blur) * 0.5 : f;
      await page.evaluate((n) => window.renderFrame(n), i);
      const png = await target.screenshot({ type: 'png', omitBackground: alpha });
      if (!enc.stdin.write(png)) await once(enc.stdin, 'drain');
    }
    const n = f - meta.first;
    if (n === 0) console.log(`first frame took ${((Date.now() - started) / 1000).toFixed(1)}s; ${last - meta.first} frames to render`);
    else if (n % (meta.fps * 2) === 0) console.log(`frame ${n}/${last - meta.first}, ${Math.round((Date.now() - started) / 1000)}s`);
  }
  enc.stdin.end();
  const [code] = await done;
  await browser.close();
  if (code !== 0) throw new Error(`ffmpeg failed:\n${log}`);
  if (errors.length) throw new Error(`page errors:\n${errors.join('\n')}`);
  console.log(`Rendered ${last - meta.first} frames to ${outArg} in ${Math.round((Date.now() - started) / 1000)}s`);
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
