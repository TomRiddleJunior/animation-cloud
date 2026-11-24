'use strict';
/* Scripted capture of a real product for a demo film. It takes sharp stills
   at each step and records where the action happened, so the compositor can
   add the camera moves, the cursor and the typing afterwards. It does not
   record real-time video.

   node demo-capture.cjs steps.json [--out demo]

   steps.json:
   {
     "url": "http://localhost:3000/app",
     "viewport": { "width": 1440, "height": 900 }, "scale": 2,
     "hideCss": ".chat-widget, .cookie-banner { display: none !important }",
     "steps": [
       { "name": "open-composer", "click": "[data-test=compose]" },
       { "name": "type-request", "type": { "selector": "textarea", "text": "Send $50 to @fredy" }, "everyChars": 4 },
       { "name": "send", "click": "button[type=submit]", "waitFor": ".receipt" },
       { "name": "result", "focus": ".receipt", "wait": 400 }
     ]
   }

   Use a demo account with invented data. Signing in is the user's job: run
   this against an environment that is already reachable, or pass a saved
   session with "storageState": "session.json".

   Needs `npm i playwright-core` and a Chromium (`npx playwright install chromium`). */

const fs = require('node:fs');
const path = require('node:path');

const args = process.argv.slice(2);
const specPath = args.find((a, i) => !a.startsWith('--') && args[i - 1] !== '--out');
const outDir = path.resolve(args.includes('--out') ? args[args.indexOf('--out') + 1] : 'demo');
if (!specPath) { console.error('Usage: node demo-capture.cjs steps.json [--out demo]'); process.exit(1); }
const spec = JSON.parse(fs.readFileSync(specPath, 'utf8'));
const shotsDir = path.join(outDir, 'shots');
fs.mkdirSync(shotsDir, { recursive: true });

const pad = (n) => String(n).padStart(3, '0');

async function main() {
  const { chromium } = require('playwright-core');
  const browser = await chromium.launch({ headless: true, executablePath: process.env.CHROMIUM_PATH || undefined, args: ['--hide-scrollbars', '--force-color-profile=srgb'] });
  const viewport = spec.viewport || { width: 1440, height: 900 };
  const context = await browser.newContext({
    viewport, deviceScaleFactor: spec.scale || 2, reducedMotion: 'reduce',
    storageState: spec.storageState && fs.existsSync(spec.storageState) ? spec.storageState : undefined,
  });
  const page = await context.newPage();
  await page.goto(spec.url, { waitUntil: 'networkidle' });
  if (spec.hideCss) await page.addStyleTag({ content: spec.hideCss });
  // Stop CSS animation so a re-capture matches; the film adds its own motion.
  await page.addStyleTag({ content: '*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }' });

  let counter = 0;
  const still = async (label) => {
    const file = `${pad(++counter)}-${label}.png`;
    await page.screenshot({ path: path.join(shotsDir, file), type: 'png' });
    return file;
  };
  const boxOf = async (selector) => {
    const el = page.locator(selector).first();
    await el.waitFor({ state: 'visible', timeout: 15000 });
    await el.scrollIntoViewIfNeeded();
    const b = await el.boundingBox();
    return b ? { x: Math.round(b.x), y: Math.round(b.y), width: Math.round(b.width), height: Math.round(b.height) } : null;
  };
  const centre = (b) => (b ? { x: Math.round(b.x + b.width / 2), y: Math.round(b.y + b.height / 2) } : null);

  const events = [];
  for (const step of spec.steps) {
    const ev = { name: step.name, kind: null, target: null, cursor: null, before: null, after: null, typing: null };

    if (step.click) {
      ev.kind = 'click';
      ev.target = await boxOf(step.click);
      ev.cursor = centre(ev.target);
      ev.before = await still(`${step.name}-before`);
      await page.locator(step.click).first().click();
    } else if (step.type) {
      ev.kind = 'type';
      ev.target = await boxOf(step.type.selector);
      ev.cursor = centre(ev.target);
      ev.before = await still(`${step.name}-before`);
      const el = page.locator(step.type.selector).first();
      await el.click();
      const text = step.type.text;
      const every = Math.max(1, step.everyChars || 4);
      ev.typing = [];
      for (let i = 0; i < text.length; i += every) {
        const chunk = text.slice(i, i + every);
        await el.pressSequentially(chunk);
        ev.typing.push({ chars: Math.min(text.length, i + every), still: await still(`${step.name}-type-${pad(ev.typing.length + 1)}`) });
      }
    } else if (step.focus) {
      ev.kind = 'focus';
      ev.target = await boxOf(step.focus);
    } else if (step.goto) {
      ev.kind = 'goto';
      await page.goto(step.goto, { waitUntil: 'networkidle' });
      if (spec.hideCss) await page.addStyleTag({ content: spec.hideCss });
    }

    if (step.waitFor) await page.locator(step.waitFor).first().waitFor({ state: 'visible', timeout: 30000 });
    if (step.wait) await page.waitForTimeout(step.wait);
    ev.after = await still(`${step.name}-after`);
    events.push(ev);
    console.log(`${step.name}: ${ev.kind}${ev.target ? ` at ${ev.target.x},${ev.target.y} ${ev.target.width}x${ev.target.height}` : ''}`);
  }

  await browser.close();
  const result = { url: spec.url, viewport, scale: spec.scale || 2, capturedAt: new Date().toISOString(), events };
  fs.writeFileSync(path.join(outDir, 'events.json'), JSON.stringify(result, null, 2));
  console.log(`\n${counter} stills in ${shotsDir}\nevents.json holds the target box and cursor point of each step, in CSS pixels (multiply by scale for image pixels).`);
  console.log('Check every still for personal data, secrets and unreleased features before using it.');
}

main().catch((e) => { console.error(e.message || e); process.exit(1); });
