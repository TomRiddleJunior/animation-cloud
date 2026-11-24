/* explainer-vox starter: annotated evidence still → scale-chase chart on the slate → credits card.
 * Replace the narration in script.json, then swap the plate, the labels and the data. Every move sits on a word. */
X.boot(async (X) => {
  await X.loadVO();
  VK.init(X);
  const C = VK.C, W = (id, w, n = 0) => X.word(id, w, n), L = (id) => X.line(id);

  // evidence: an illustrated SVG rasterised into a graded photograph (never a real photo you don't own)
  const ev = EV.tower();
  const photo = await VK.photo(ev.svg, { sat: 1.25, contrast: 1.08, vignette: 0.32, exposure: 0.9, warm: [1.08, 1, 0.9], cool: [0.9, 1, 1.12] });

  const tChart = L('chart').start - 0.15, tCred = (L('chart').end || 9) + 0.8, END = tCred + 2.8;
  X.svg('rect', { width: 1920, height: 1080, fill: C.ground });

  // ---- 1. annotated still: creeping push, ellipse on the noun, tilted tag, sage sub-tag ~2 s later
  const s1 = X.scene('s-still', 0, tChart, (g, t0) => {
    const cam = VK.camera(g).cut(t0, { s: 1.04, cx: 926, cy: 530 }, { rate: 0.0027 });
    VK.image(cam.g, photo);
    const k = ev.clock;
    X.svg('g', {}, cam.g).innerHTML = EV.hands(k.cx, k.cy, k.r, 11, 58);
    const tw = W('still', 'clock');
    VK.ellipse(cam.g, tw - 0.18, { cx: k.cx + 4, cy: k.cy + 6, rx: 168, ry: 182, rot: -10 });
    VK.tag(cam.g, tw + 0.3, 'Town Hall clock', { x: 560, y: 668 });
    VK.subTag(cam.g, W('still', 'watches') + 0.1, 'Built 1871', { x: 760, y: 742 });
  });
  gsap.set(s1, { autoAlpha: 1 }); // a tl.set at t = 0 does not fire on the first seek

  // ---- 2. scale-chase chart straight on the slate (kit A): the y-axis rescales while the line draws
  X.scene('s-chart', tChart, tCred, (g, t0) => {
    const cam = VK.camera(g).cut(t0, { s: 1.0, cx: 960, cy: 560 }, { rate: 0.0026 });
    X.sfx(t0, 'click', { gain: 0.14 });
    const data = [0, 2, 4, 6, 8, 10, 12, 14].map((d) => ({ x: d, y: d * 4, label: `${d}°` }));
    const ch = VK.chart(cam.g, { x: 360, y: 330, w: 1240, h: 500, data, t0: t0 + 0.4, dur: 2.7, yMaxStart: 6, areaOp: 0.42, steps: [1, 2, 5, 10, 15, 20, 30],
      fmtY: (v) => `+${Math.round(v)} min`, title: 'How much later local noon arrives', source: 'Source: 1° of longitude = 4 minutes of solar time' });
    const p = ch.pt(7);
    VK.ellipse(cam.g, W('chart', 'degree') - 0.2, { cx: p[0], cy: p[1], rx: 60, ry: 52, width: 7 });
    VK.tag(cam.g, W('chart', 'west') - 0.1, '+56 min', { x: p[0] - 230, y: p[1] - 70, size: 46 });
  });

  // ---- 3. own wordmark bug + credits card (no spoken CTA)
  const bug = X.scene('s-bug', 0, tCred, (g) => VK.bug('footnote', { parent: g }));
  gsap.set(bug, { autoAlpha: 1 });
  X.scene('s-credits', tCred, null, (g) => VK.credits(g, [['Script & animation', 'Your name'], ['Narration', 'Kokoro TTS'], ['Images', 'illustrations made in code']]));
  X.end(END);
});
