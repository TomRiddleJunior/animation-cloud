/* cleo-abram starter: colour-flip sting → render shot (space grid, sun, rotating sail, arrow→chip) → magnifier
 * zoom-through into the micro world → page peel into paper-collage mode. Replace the plates, keep the grammar:
 * hard cut on a sentence boundary, chip lands 12–17 f after the cut on the spoken noun, arrow leads its chip by 12 f. */
X.boot(async (X) => {
  await X.loadVO();
  const C = K.C, L = (id) => X.line(id), w = (id, word, n) => X.word(id, word, n);
  const shot = (name, t0, t1, build, o = {}) => X.scene(name, t0, t1, (g) => {
    const cam = X.cam(X.svg('g', {}, g)), fg = X.svg('g', {}, g);
    build(cam, fg, t0, t1, [t0, t1]);
    if (o.push !== false) { const P = { from: 1, rate: 0.028, ...(o.push || {}) }; K.push(cam, t0, t1, { ...P, to: P.to ?? P.from + P.rate * (t1 - t0) }); }
    if (o.whoosh !== false) K.cut(t0);
  });
  const T = { s1: 3.2, s2: L('photon').start - 0.15, zoom: w('photon', 'tiny') - 0.02, p1: L('kepler').start - 0.2 };
  T.s3 = T.zoom + 0.28;
  const END = X.vo.duration || 14, PEEL = 0.62;

  K.titleSting(X.root, 0, { word: 'SUN SAIL', tagline: 'A TINY PUSH THAT NEVER STOPS', dur: T.s1 });

  shot('s1', T.s1, T.s2, (cam, fg, t0, t1, win) => {
    K.space(cam, { grid: true, horizon: 720, win, scrollZ: (t) => (t - t0) * 0.4 });
    K.sun(cam, { cx: -40, cy: 300, r: 300, win });
    K.sail(cam, { size: 260, win, pose: (t) => ({ cx: 1200, cy: 470, spin: 0.3 * t, tilt: 1.0, yaw: -0.55 }) });
    const ts = w('hook', 'sunlight');
    K.arrow(cam, { x: 200, y: 880, angle: 180, len: 120, t: ts - 0.4 });
    K.chip(cam, 'SUNLIGHT', { x: 240, y: 880, t: ts + 0.02 });
    K.tag(fg, 'NOT TO SCALE');
  });

  shot('s2', T.s2, T.s3, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 15, win });
    K.photons(cam, { win, from: (i, r) => [-300 + r() * 900, -260 + r() * 360], dir: [0.8, 0.6], n: 14, speed: 1000, len: 1500 });
    K.sail(cam, { size: 1150, win, glintGain: 1.6, pose: (t) => ({ cx: 1500, cy: 980, spin: 0.55 + 0.06 * (t - t0), tilt: 0.85, yaw: -0.65 }) });
    K.magnifier(cam, { anchor: [1300, 800], c: [640, 420], r: 200, t: w('photon', 'photon') + 0.04, tLens: w('photon', 'bounces'), tZoom: T.zoom,
      content: (g, cx, cy, r) => K.microWorld(g, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, s: r / 330, surf: 0.66, win, photons: [{ x: cx - 40, delay: 0.1, period: 1.1, A: 300, B: 480 }] }) });
    const tm = w('photon', 'mirror');
    K.arrow(cam, { x: 1565, y: 488, angle: 95, len: 120, t: tm - 0.38, out: T.zoom + 0.06 });
    K.chip(cam, 'MIRROR', { x: 1450, y: 290, t: tm + 0.02, out: T.zoom });
  });

  shot('s3', T.s3, T.p1 + PEEL, (cam, fg, t0, t1, win) => {
    K.microWorld(cam, { x: -120, y: -80, w: 2160, h: 1240, s: 1.55, surf: 0.66, win, photons: [{ x: 600, delay: -0.6, period: 1.25 }, { x: 1400, delay: -0.1, period: 1.25 }] });
    K.chip(cam, 'TINY PUSH', { x: 960, y: 170, anchor: 'middle', t: w('photon', 'push') + 0.02 });
  }, { push: { from: 1.05, rate: -0.03 } });

  const p1 = shot('p1', T.p1, END + 0.1, (cam, fg, t0, t1, win) => {
    K.paperBG(cam, {});
    K.pencil(cam, 'M330,480 m-120,0 a120,120 0 1,0 240,0 a120,120 0 1,0 -240,0', { t: t0 + 0.3, dur: 0.6 });
    K.display(cam, '400 YEARS AGO', { x: 1000, y: 260, size: 116, rot: -3, t: w('kepler', 'four') });
    K.chip(cam, 'KEPLER, 1619', { x: 1000, y: 640, anchor: 'middle', t: w('kepler', 'kepler') + 0.04 });
  }, { whoosh: false, push: { from: 1, to: 1.04 } });
  K.pagePeel(p1, T.p1, { dur: PEEL });

  X.grain(0.045, 12);
  X.end(END);
});
