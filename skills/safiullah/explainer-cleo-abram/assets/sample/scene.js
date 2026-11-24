/* "Sailing on Sunlight" — the animated deep dive of an optimistic science explainer (cleo-abram style sample).
 * Colour-flip title sting → render-mode journey (space grid, sun, rotating sail, toy astronaut) → magnifier
 * zoom-through into a micro world → studio comparison → chevron flow + lateral truck → page peel into paper-collage
 * history → hard cut back to renders → lasers, scale comparison → calm ending. One lime overlay system throughout. */
X.boot(async (X) => {
  await X.loadVO();
  const C = K.C, E = K.E, clamp = K.clamp, lerp = K.lerp;
  const L = (id) => X.line(id), w = (id, word, n) => X.word(id, word, n);

  // ---------------------------------------------------------------- cut map (every cut sits on a sentence boundary)
  const T = {
    s1: 3.2,
    s2: L('hook1').end + 0.14,
    s3: L('weird').start - 0.15,
    s4: L('bounce').start - 0.14,
    zoom: w('bounce', 'tiny') - 0.02,
    s6: L('tiny').start - 0.19,
    s7: L('build').start - 0.19,
    s8: w('build', 'so') - 0.22,
    p1: L('old').start - 0.2,
    p2: w('old', 'point') - 0.05,
    p3: L('maxwell').start - 0.14,
    p4: w('maxwell', 'and') - 0.19,
    s10: L('ikaros').start - 0.18,
    s11: w('ikaros', 'venus') - 0.27,
    s12: L('laser').start - 0.13,
    s13: L('stars').start - 0.17,
    s14: w('stars', 'at') - 0.09,
    s15: L('end').start - 0.23,
  };
  T.s5 = T.zoom + 0.28;
  const END = X.vo.duration || 68;
  const PEEL = 0.62;

  /** One shot = a scene group with a camera group (slow push) + a screen-space overlay group; whoosh on the cut. */
  const shot = (name, t0, t1, build, o = {}) => X.scene(name, t0, t1, (g) => {
    const cam = X.cam(X.svg('g', {}, g));
    const fg = X.svg('g', {}, g);
    build(cam, fg, t0, t1, [t0, t1]);
    if (o.push !== false) { const P = { from: 1, rate: 0.028, ...(o.push || {}) }; K.push(cam, t0, t1, { ...P, to: P.to ?? P.from + P.rate * (t1 - t0) }); }
    if (o.whoosh !== false) K.cut(t0);
  });

  // ================================================================ 0 · colour-flip title sting
  K.titleSting(X.root, 0, { word: 'SOLAR SAIL', tagline: 'HOW LIGHT CAN FLY A SPACESHIP', dur: T.s1, size: 245 });

  // ================================================================ 1 · hook, wide: a ship with no engine
  shot('s1', T.s1, T.s2, (cam, fg, t0, t1, win) => {
    const ts = w('hook1', 'speeding');
    const zf = (t) => (t - t0) * 0.35 + Math.pow(Math.max(0, t - ts), 2) * 1.1;
    K.space(cam, { grid: true, horizon: 720, seed: 3, win, scrollZ: zf });
    K.sun(cam, { cx: -40, cy: 290, r: 300, win });
    X.svg('polygon', { points: '180,150 180,470 1240,560 1240,380', fill: X.linear(K.id('beam'), [[0, '#FFD98A', 0.22], [1, '#FFD98A', 0]], 0, 0, 1, 0) }, cam);
    const streaks = X.svg('g', { opacity: 0 }, cam);
    const sr = X.rand(9), sl = Array.from({ length: 10 }, () => [X.svg('line', { stroke: '#CFE6FF', 'stroke-width': 2 + sr() * 2, 'stroke-linecap': 'round' }, streaks), 300 + sr() * 260, sr()]);
    K.live(t0, t1, (t) => {
      const k = clamp((t - ts) / 0.5); streaks.setAttribute('opacity', (k * 0.7).toFixed(2));
      sl.forEach(([l, y, ph], i) => { const x = 1100 - ((((t * 2.2 + ph) % 1) + 1) % 1) * 900; K.at(l, { x1: x, x2: x - 160 - 120 * k, y1: y + i * 9, y2: y + i * 9 }); });
    });
    K.sail(cam, { size: 260, win, pose: (t) => ({ cx: 1210 + (t - t0) * 14, cy: 470 + Math.sin(t * 0.8) * 6, spin: 0.3 * t, tilt: 1.02, yaw: -0.55 }) });
    const te = w('hook1', 'engine'), tf = w('hook1', 'fuel');
    K.arrow(cam, { x: 1262, y: 528, angle: -135, len: 130, t: te - 0.4 });
    K.chip(cam, 'NO ENGINE', { x: 1300, y: 660, t: te + 0.02 });
    K.chip(cam, 'NO FUEL', { x: 1300, y: 770, t: tf });
    K.tag(fg, 'NOT TO SCALE', { x: 96, y: 92 });
  });

  // ================================================================ 2 · re-angle: you, the ship, and sunlight
  shot('s2', T.s2, T.s3, (cam, fg, t0, t1, win) => {
    K.space(cam, { grid: true, horizon: 960, seed: 8, win, scrollZ: (t) => (t - t0) * 0.45, top: '#0A2350', mid: '#123F86', bottom: '#1C58AE', floorTop: '#1A4F96', floorBottom: '#0E2F66', nebula: [[1600, 200, 800, '#6A5BD6', 0.35], [300, 650, 700, '#3FA3E8', 0.35]] });
    const ts = w('hook2', 'sunlight');
    const wash = X.svg('rect', { x: -300, y: -200, width: 1700, height: 1500, fill: X.linear(K.id('wash'), [[0, '#FFE2A0', 0.75], [0.45, '#FFC46A', 0.18], [1, '#FFC46A', 0]], 0, 0, 1, 0.2) }, cam);
    gsap.set(wash, { autoAlpha: 0 });
    X.tl.fromTo(wash, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, ts - 0.15);
    K.photons(cam, { win: [ts - 0.15, t1], from: (i, r) => [-200 - r() * 300, 80 + r() * 820], dir: [1, 0.04], n: 18, speed: 1300, len: 2400, size: 5.5 });
    K.sail(cam, { size: 430, win, glintGain: 1.3, light: [-0.9, -0.2, 0.4], pose: (t) => ({ cx: 1330, cy: 470, spin: 0.3 * t, tilt: 0.95, yaw: -0.62 }) });
    K.astronaut(cam, { x: 640, y: 560, s: 1.05, win, rot: -10, phase: 1 });
    K.arrow(cam, { x: 648, y: 438, angle: 90, len: 130, t: t0 + 0.03 });
    K.chip(cam, 'YOU', { x: 648, y: 240, anchor: 'middle', t: t0 + 0.42 });
    K.arrow(cam, { x: 190, y: 880, angle: 180, len: 120, t: ts - 0.38 });
    K.chip(cam, 'SUNLIGHT', { x: 230, y: 880, t: ts + 0.02 });
    X.sfx(ts - 0.1, 'riser', { dur: 0.5, gain: 0.18 }); X.sfx(ts + 0.25, 'sparkle', { dur: 0.6, gain: 0.25 });
  }, { push: { from: 1.02, rate: 0.03, x0: 0, x1: -30 } });

  // ================================================================ 3 · the Sun's limb: light has no mass, but momentum
  shot('s3', T.s3, T.s4, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 12, win, stars: 150 });
    K.sun(cam, { cx: 80, cy: 560, r: 760, halo: 1.55, win, churn: 14 });
    K.photons(cam, { win, n: 26, speed: 760, len: 1500, size: 4.5, seed: 4, op: 0.85,
      from: (i, r) => { const a = -0.75 + r() * 1.5; return [80 + Math.cos(a) * 780, 560 + Math.sin(a) * 780]; },
      dirFn: (i, st) => { const dx = st[0] - 80, dy = st[1] - 560, l = Math.hypot(dx, dy); return [dx / l, dy / l]; } });
    const hero = X.svg('g', {}, cam);
    X.svg('circle', { r: 120, fill: X.radial(K.id('hg'), [[0, '#FFE9A8', 0.85], [0.4, '#FFB52E', 0.35], [1, '#FF9A1F', 0]]) }, hero);
    X.svg('circle', { r: 24, fill: '#FFFDF2' }, hero);
    X.svg('circle', { r: 50, fill: 'none', stroke: '#fff', 'stroke-width': 3, opacity: 0.85, 'stroke-dasharray': '10 9' }, hero);
    const hx = 1180, hy = 470;
    K.live(t0, t1, (t) => hero.setAttribute('transform', `translate(${(hx + (t - t0) * 6).toFixed(1)},${(hy + Math.sin(t * 2.1) * 6).toFixed(1)}) rotate(${(t * 30).toFixed(1)})`));
    X.sfx(t0 + 0.2, 'blip_up', { gain: 0.2 });
    const tl_ = w('weird', 'light'), tm = w('weird', 'mass'), tc = w('weird', 'carries'), tmo = w('weird', 'momentum');
    K.label(cam, { at: [hx + 34, hy - 36], end: [1360, 300], chip: [1360, 300], text: 'PHOTON', t: tl_ + 0.06, out: tc - 0.12 });
    K.chip(cam, 'NO MASS', { x: 1360, y: 410, t: tm + 0.05 });
    K.arrow(cam, { x: 1640, y: 640, angle: 0, len: 300, shaft: 24, t: tc - 0.02 });
    K.chip(cam, 'MOMENTUM', { x: 1340, y: 760, t: tmo + 0.02 });
    K.tag(fg, 'PAUSED', { x: 900, y: 92 });
  }, { push: { from: 1, rate: 0.03, x1: -20 } });

  // ================================================================ 4 · sail close-up + magnifier zoom-through
  shot('s4', T.s4, T.s5, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 15, win, stars: 130 });
    K.photons(cam, { win, from: (i, r) => [-300 + r() * 900, -260 + r() * 360], dir: [0.8, 0.6], n: 16, speed: 1000, len: 1500, size: 5 });
    K.sail(cam, { size: 1150, win, glintGain: 1.6, light: [-0.7, -0.5, 0.5], pose: (t) => ({ cx: 1500, cy: 980, spin: 0.55 + 0.06 * (t - t0), tilt: 0.85, yaw: -0.65 }) });
    const tp = w('bounce', 'photon'), th = w('bounce', 'hits'), tmi = w('bounce', 'mirror');
    K.magnifier(cam, {
      anchor: [1300, 800], c: [640, 420], r: 200, t: tp + 0.04, tLens: th, tZoom: T.zoom,
      content: (g, cx, cy, r) => K.microWorld(g, { x: cx - r, y: cy - r, w: 2 * r, h: 2 * r, s: r / 330, surf: 0.66, win, photons: [{ x: cx - 40, delay: 0.1, period: 1.1, A: 300, B: 480 }, { x: cx + 120, delay: 0.65, period: 1.1, A: 300, B: 480 }] }),
    });
    K.arrow(cam, { x: 1565, y: 488, angle: 95, len: 120, t: tmi - 0.38, out: T.zoom + 0.06 });
    K.chip(cam, 'MIRROR', { x: 1450, y: 290, t: tmi + 0.02, out: T.zoom });
  }, { push: { from: 1, rate: 0.03 } });

  // ================================================================ 5 · micro world: bounce = double the kick
  shot('s5', T.s5, T.s6, (cam, fg, t0, t1, win) => {
    const tb = w('double', 'bounce'), tbk = w('double', 'back'), td = w('double', 'double');
    K.microWorld(cam, {
      x: -120, y: -80, w: 2160, h: 1240, s: 1.55, surf: 0.66, win,
      photons: [
        { x: 360, delay: -0.62, period: 1.25, until: tb - 0.1 }, { x: 1500, delay: -0.15, period: 1.25, until: tb - 0.1 },
        { x: 960, delay: tbk - 0.62 - t0, period: 1.24, A: 0, B: 560, kick: 14, until: tbk + 0.6 },
        { x: 420, delay: td + 0.1 - t0, period: 1.3 }, { x: 1520, delay: td + 0.5 - t0, period: 1.3 },
      ],
    });
    K.tag(fg, 'SAIL SURFACE, MAGNIFIED', { x: 96, y: 92, t: t0 });
    K.chip(cam, '2× THE KICK', { x: 960, y: 170, anchor: 'middle', t: td + 0.02 });
    const lab = (txt, x, y, t) => { const e = X.svg('text', { x, y, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 800, 'font-size': 26, 'letter-spacing': '0.12em', fill: '#fff', text: txt }, cam); gsap.set(e, { autoAlpha: 0 }); X.tl.set(e, { autoAlpha: 1 }, t); };
    K.arrow(cam, { x: 1560, y: 560, angle: 90, len: 110, t: td + 0.18, sfx: false });
    K.arrow(cam, { x: 1760, y: 560, angle: 90, len: 220, t: td + 0.32 });
    lab('ABSORB  1×', 1560, 410, td + 0.18); lab('BOUNCE  2×', 1760, 300, td + 0.32);
  }, { push: { from: 1.06, rate: -0.03 } });

  // ================================================================ 6 · studio comparison: less than a paperclip
  shot('s6', T.s6, T.s7, (cam, fg, t0, t1, win) => {
    X.svg('rect', { x: -300, y: -200, width: 2520, height: 1480, fill: X.linear(K.id('st'), [[0, '#F3F5F7'], [0.62, '#DCE0E5'], [1, '#C9CED5']]) }, cam);
    X.svg('ellipse', { cx: 960, cy: 820, rx: 1100, ry: 260, fill: X.radial(K.id('pool'), [[0, '#FFFFFF', 0.75], [1, '#FFFFFF', 0]]) }, cam);
    X.svg('line', { x1: -300, y1: 760, x2: 2220, y2: 760, stroke: '#C2C8D0', 'stroke-width': 2, opacity: 0.6 }, cam);
    const sh = (cx, rx) => X.svg('ellipse', { cx, cy: 840, rx, ry: rx * 0.13, fill: X.radial(K.id('csh'), [[0, '#3A4450', 0.4], [1, '#3A4450', 0]]) }, cam);
    sh(520, 230); const clipSh = sh(1360, 260);
    K.sail(cam, { size: 190, win, light: [-0.6, -0.6, 0.5], glintGain: 1.4, pose: (t) => ({ cx: 520, cy: 480 + Math.sin(t * 1.3) * 8, spin: 0.5 * t, tilt: 1.1, yaw: -0.35 }) });
    const clipG = X.svg('g', {}, cam);
    K.paperclip(clipG, { x: 0, y: 0, s: 1.25, rot: -14 });
    K.live(t0, t1, (t) => { const b = Math.sin(t * 1.2) * 10; clipG.setAttribute('transform', `translate(1360,${(470 + b).toFixed(1)}) rotate(${(Math.sin(t * 0.8) * 4).toFixed(2)})`); clipSh.setAttribute('rx', (260 - b * 2).toFixed(1)); });
    const tpu = w('tiny', 'push'), tle = w('tiny', 'less'), twe = w('tiny', 'weight'), tpc = w('tiny', 'paperclip');
    K.arrow(cam, { x: 760, y: 480, angle: 0, len: 80, shaft: 14, t: tpu - 0.3 });
    K.chip(cam, 'SUNLIGHT PUSH', { x: 520, y: 230, anchor: 'middle', t: tpu + 0.04, h: 88 });
    K.display(cam, '<', { x: 950, y: 590, size: 260, extrude: 12, t: tle });
    K.arrow(cam, { x: 1360, y: 760, angle: 90, len: 170, shaft: 26, color: '#39424E', t: twe - 0.1 });
    K.chip(cam, 'PAPERCLIP', { x: 1360, y: 230, anchor: 'middle', t: tpc + 0.02, h: 88 });
  }, { push: { from: 1, rate: 0.03 } });

  // ================================================================ 7 · chevron flow: no friction, Sun never switches off
  shot('s7', T.s7, T.s8, (cam, fg, t0, t1, win) => {
    K.space(cam, { grid: true, horizon: 780, seed: 18, win, scrollZ: (t) => (t - t0) * 0.6 });
    const sun = K.sun(cam, { cx: -250, cy: 420, r: 430, win, texture: true });
    const tsun = w('build', 'sun');
    X.tl.fromTo(sun.g, { scale: 1 }, { scale: 1.07, duration: 0.25, yoyo: true, repeat: 1, ease: 'power2.out', svgOrigin: '-250 420', immediateRender: false }, tsun);
    K.sail(cam, { size: 260, win, light: [-0.95, -0.1, 0.3], pose: (t) => ({ cx: 1340, cy: 440 + Math.sin(t * 0.9) * 6, spin: 0.3 * t, tilt: 0.28, yaw: -1.2 }) });
    [330, 450, 570].forEach((y, i) => K.chevrons(cam, { x0: 260, y0: y, x1: 1170, y1: y + (i - 1) * 25, n: 15, size: 24, t: t0 + 0.12 + i * 0.05, sfx: i === 0 }));
    K.chip(cam, 'NO FRICTION', { x: 1340, y: 720, anchor: 'middle', t: w('build', 'friction') + 0.03 });
    K.arrow(cam, { x: 210, y: 690, angle: -130, len: 120, t: w('build', 'switches') - 0.4 });
    K.chip(cam, 'NEVER OFF', { x: 230, y: 800, t: w('build', 'switches') });
  }, { push: { from: 1, rate: 0.03, x1: 20 } });

  // ================================================================ 8 · lateral truck: speed keeps building
  shot('s8', T.s8, T.p1 + PEEL, (cam, fg, t0, t1, win) => {
    const sx = (t) => Math.pow(Math.max(0, t - t0), 2) * 2.2 + (t - t0) * 0.8;
    X.svg('rect', { x: -400, y: -300, width: 2720, height: 1680, fill: X.linear(K.id('d8'), [[0, '#2B6FF5'], [0.62, '#1F59E2'], [1, '#1646C4']]) }, cam);
    K.grid(cam, { horizon: 690, color: '#FFFFFF', gridOp: 0.42, floor: false, horizonColor: '#BFD6FF', scrollX: sx, win });
    K.vignette(cam, 0.35, '#0A2470');
    const streaks = X.svg('g', {}, cam), sr = X.rand(31);
    const sl = Array.from({ length: 14 }, () => [X.svg('line', { stroke: '#FFFFFF', 'stroke-width': 1.5 + sr() * 2.5, 'stroke-linecap': 'round' }, streaks), 120 + sr() * 520, sr()]);
    K.live(t0, t1, (t) => {
      const v = clamp((t - t0) / 1.8);
      streaks.setAttribute('opacity', (0.15 + 0.65 * v).toFixed(2));
      sl.forEach(([l, y, ph]) => { const x = 2000 - ((((t * (1.2 + 2.5 * v) + ph) % 1) + 1) % 1) * 2300; K.at(l, { x1: x, x2: x + 120 + 380 * v, y1: y, y2: y }); });
    });
    K.sail(cam, { size: 210, win, light: [-0.9, -0.3, 0.3], pose: (t) => ({ cx: 940 + Math.sin(t * 9) * clamp((t - t0) / 2) * 3, cy: 400, spin: 0.3 * t, tilt: 0.3, yaw: -1.15 }) });
    const tsp = w('build', 'speed');
    const num = K.dataNumber(cam, '1', 'DAYS OF SUNLIGHT', { x: 430, y: 850, size: 150, t: t0 + 0.12, sfx: 'pop' });
    K.countDisplay(num.d, 1, 365, t0 + 0.2, t1 - t0 - PEEL - 0.25, (v) => String(Math.round(v)), 'power2.in');
    [0.5, 0.9, 1.25, 1.5, 1.7, 1.85].forEach((dt) => X.sfx(t0 + dt, 'tick', { gain: 0.18, pitch: 1 + dt * 0.3 }));
    const sc = K.chip(cam, 'SPEED', { x: 1180, y: 800, t: tsp + 0.03 });
    const segs = Array.from({ length: 10 }, (_, i) => X.svg('rect', { x: 1180 + sc.w + 24 + i * 46, y: 770, width: 38, height: 60, fill: C.lime }, cam));
    segs.forEach((s, i) => { gsap.set(s, { autoAlpha: 0 }); X.tl.set(s, { autoAlpha: 1 }, tsp + 0.1 + i * 0.16); });
    X.sfx(tsp + 0.1, 'riser', { dur: 1.6, gain: 0.22 });
  }, { push: { from: 1, rate: 0.03 } });

  // ================================================================ P1 · page peel into paper mode: Kepler, comet tails
  const p1 = shot('p1', T.p1, T.p2, (cam, fg, t0, t1, win) => {
    K.paperBG(cam, {});
    K.pencil(cam, 'M330,480 m-120,0 a120,120 0 1,0 240,0 a120,120 0 1,0 -240,0', { t: t0 + 0.3, dur: 0.6 });
    const rays = Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return `M${330 + Math.cos(a) * 150},${480 + Math.sin(a) * 150} L${330 + Math.cos(a) * 205},${480 + Math.sin(a) * 205}`; }).join(' ');
    K.pencil(cam, rays, { t: t0 + 0.75, dur: 0.5, sfx: false });
    const sunTxt = X.svg('text', { x: 330, y: 700, 'text-anchor': 'middle', 'font-family': 'Caveat', 'font-weight': 700, 'font-size': 54, fill: C.pencil, text: 'the Sun' }, cam);
    K.write(sunTxt, t0 + 0.85, 0.4);
    const chart = X.svg('g', { opacity: 0.55 }, cam), cr = X.rand(23), stars = Array.from({ length: 9 }, () => [600 + cr() * 520, 360 + cr() * 520]);
    stars.forEach(([x, y]) => X.svg('circle', { cx: x, cy: y, r: 4 + cr() * 4, fill: C.pencil }, chart));
    K.pencil(chart, 'M' + stars.slice(0, 6).map((q) => q.join(',')).join(' L'), { t: t0 + 0.4, dur: 0.9, w: 2, sfx: false });
    K.display(cam, '400 YEARS AGO', { x: 960, y: 230, size: 116, extrude: 9, rot: -3, t: w('old', 'old') - 0.02 });
    const tk = w('old', 'kepler');
    K.cutout(cam, { x: 1320, y: 620, w: 560, h: 380, rot: 4, t: tk - 0.38, draw: engravingComet });
    K.chip(cam, 'KEPLER, 1619', { x: 1050, y: 852, t: tk + 0.04, h: 80 });
    const tc = w('old', 'comet');
    K.pencil(cam, 'M1720,330 Q1660,380 1610,450 M1610,450 l8,-34 M1610,450 l-32,-10', { t: tc - 0.05, dur: 0.35, color: C.red, w: 6 });
  }, { whoosh: false, push: { from: 1, to: 1.04 } });
  K.pagePeel(p1, T.p1, { dur: PEEL });

  function engravingComet(g, x, y, w, h) {
    X.svg('rect', { x, y, width: w, height: h, fill: X.linear(K.id('esky'), [[0, '#2A2A2A'], [1, '#6E6E6E']]) }, g);
    const hatch = X.svg('g', { stroke: '#111', 'stroke-width': 1.3, opacity: 0.55 }, g);
    for (let i = -h; i < w; i += 9) X.svg('line', { x1: x + i, y1: y, x2: x + i + h * 0.6, y2: y + h }, hatch);
    const r = X.rand(5);
    for (let i = 0; i < 40; i++) X.svg('circle', { cx: x + r() * w, cy: y + r() * h * 0.7, r: 0.8 + r() * 1.6, fill: '#fff', opacity: 0.8 }, g);
    X.svg('path', { d: `M${x + 170},${y + 150} Q${x + 330},${y + 40} ${x + 560},${y - 10} L${x + 560},${y + 130} Q${x + 330},${y + 120} ${x + 170},${y + 150}Z`, fill: X.linear(K.id('etail'), [[0, '#fff', 0.95], [1, '#fff', 0]], 0, 0.5, 1, 0.3) }, g);
    X.svg('circle', { cx: x + 170, cy: y + 150, r: 34, fill: X.radial(K.id('ehead'), [[0, '#fff', 1], [0.4, '#fff', 0.8], [1, '#fff', 0]]) }, g);
    X.svg('path', { d: `M${x},${y + h} L${x},${y + h - 70} Q${x + 120},${y + h - 120} ${x + 230},${y + h - 80} Q${x + 380},${y + h - 140} ${x + w},${y + h - 70} L${x + w},${y + h}Z`, fill: '#1A1A1A' }, g);
    const hh = X.svg('g', { stroke: '#555', 'stroke-width': 1.2 }, g);
    for (let i = 0; i < w; i += 7) X.svg('line', { x1: x + i, y1: y + h - 40, x2: x + i + 10, y2: y + h - 4 }, hh);
  }

  // ================================================================ P2 · push-in to the sketch: tails point away, pushed by sunlight?
  shot('p2', T.p2, T.p3, (cam, fg, t0, t1, win) => {
    K.paperBG(cam, {});
    K.pencil(cam, 'M60,540 m-300,0 a300,300 0 1,0 600,0 a300,300 0 1,0 -600,0', { t: t0 - 0.02, dur: 0.3, sfx: false });
    X.svg('circle', { cx: 60, cy: 540, r: 300, fill: X.radial(K.id('wsun'), [[0, '#F7D36A'], [1, '#EE8A3A']]), opacity: 0.55 }, cam);
    const tail = X.svg('g', {}, cam);
    gsap.set(tail, { svgOrigin: '1060 520' });
    K.pencil(tail, 'M1060,520 m-38,0 a38,38 0 1,0 76,0 a38,38 0 1,0 -76,0', { t: t0 + 0.08, dur: 0.3 });
    K.pencil(tail, 'M1090,490 Q1400,420 1820,360 M1096,520 Q1420,500 1840,500 M1090,550 Q1400,600 1820,650 M1095,505 Q1420,460 1830,430 M1095,535 Q1420,560 1830,575', { t: t0 + 0.3, dur: 0.6, sfx: false });
    K.chip(cam, 'TAIL POINTS AWAY', { x: 1440, y: 760, anchor: 'middle', t: w('old', 'away') + 0.02 });
    const tg = w('old', 'guessed'), tsl = w('old', 'sunlight'), tpu = w('old', 'pushing');
    const note = X.svg('text', { x: 520, y: 250, 'font-family': 'Caveat', 'font-weight': 700, 'font-size': 76, fill: C.pencil, text: 'pushed by sunlight?' }, cam);
    K.write(note, tg, 0.75);
    K.pencil(cam, 'M420,420 L900,470 M880,452 L905,471 L878,492 M440,560 L920,540 M896,522 L922,540 M898,560 L922,540 M420,690 L900,620 M875,612 L903,620 L885,642', { t: tsl - 0.05, dur: 0.5, color: C.red, w: 6 });
    K.display(cam, '?', { x: 1560, y: 300, size: 220, extrude: 10, rot: 8, t: tg + 0.15 });
    X.tl.fromTo(tail, { scaleX: 1 }, { scaleX: 1.12, duration: 0.5, ease: 'power2.out', immediateRender: false }, tpu);
  }, { push: { from: 1.02, rate: 0.03, x1: -40 } });

  // ================================================================ P3 · Maxwell: an archive page slides in, a lime highlighter wipes behind the key idea
  shot('p3', T.p3, T.p4, (cam, fg, t0, t1, win) => {
    K.paperBG(cam, { grid: true });
    X.svg('rect', { x: -300, y: -200, width: 2520, height: 1480, fill: '#17130E', opacity: 0.62 }, cam);
    const card = X.svg('g', { transform: 'translate(960,560) rotate(-2)' }, cam), cin = X.svg('g', {}, card);
    X.svg('rect', { x: -590, y: -372, width: 1180, height: 760, fill: '#000', opacity: 0.35, filter: K.softShadow() }, cin);
    X.svg('rect', { x: -600, y: -390, width: 1180, height: 760, fill: '#F4EFE2' }, cin);
    X.svg('image', { href: X.paper('#F4EFE2', 480, 320, 0.06, 9), x: -600, y: -390, width: 1180, height: 760, preserveAspectRatio: 'none', opacity: 0.8 }, cin);
    const gr = X.rand(14), bars = X.svg('g', { fill: '#9A9283' }, cin);
    for (let i = 0; i < 6; i++) { const wd = i === 5 ? 520 : 960 + gr() * 60; X.svg('rect', { x: -520, y: -320 + i * 34, width: wd, height: 11, rx: 5 }, bars); }
    for (let i = 0; i < 5; i++) { const wd = i === 4 ? 380 : 980 - gr() * 80; X.svg('rect', { x: -520, y: 150 + i * 34, width: wd, height: 11, rx: 5 }, bars); }
    const tpr = w('maxwell', 'predicted'), tpu = w('maxwell', 'push');
    const hl = X.svg('rect', { x: -330, y: -110, width: 0, height: 150, fill: C.lime }, cin);
    X.tl.fromTo(hl, { attr: { width: 0 } }, { attr: { width: 640 }, duration: 0.4, ease: 'power2.out', immediateRender: false }, tpr);
    X.sfx(tpr, 'scribble', { dur: 0.4, gain: 0.25 });
    X.svg('text', { x: -10, y: 0, 'text-anchor': 'middle', 'font-family': 'Libre Baskerville', 'font-style': 'italic', 'font-weight': 700, 'font-size': 120, fill: '#1E1B16', text: 'p = E / c' }, cin);
    X.svg('text', { x: -10, y: 92, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 700, 'font-size': 26, 'letter-spacing': '0.16em', fill: '#4A4438', text: 'MOMENTUM OF LIGHT = ENERGY ÷ SPEED OF LIGHT' }, cin);
    X.tl.fromTo(cin, { x: 900, rotation: 5 }, { x: 0, rotation: 0, duration: 0.2, ease: 'power3.out', immediateRender: false }, t0 + 0.02);
    X.sfx(t0 + 0.02, 'paper', { dur: 0.35, gain: 0.4 });
    K.chip(cam, 'MAXWELL, 1873', { x: 340, y: 960, t: w('maxwell', 'maxwell') + 0.04, h: 84 });
    K.arrow(cam, { x: 1500, y: 470, angle: 0, len: 150, t: tpu - 0.32 });
    K.chip(cam, 'LIGHT PUSHES', { x: 1560, y: 960, anchor: 'middle', t: tpu + 0.03 });
  }, { push: { from: 1, rate: 0.025 } });

  // ================================================================ P4 · around 1900: measured in the lab
  shot('p4', T.p4, T.s10, (cam, fg, t0, t1, win) => {
    K.paperBG(cam, {});
    K.pencil(cam, 'M520,820 L520,420 Q520,200 760,200 Q1000,200 1000,420 L1000,820 M470,820 L1050,820 L1050,860 L470,860 Z', { t: t0 + 0.05, dur: 0.6 });
    const bal = X.svg('g', {}, cam);
    gsap.set(bal, { svgOrigin: '760 520' });
    K.pencil(cam, 'M760,205 L760,520', { t: t0 + 0.3, dur: 0.3, sfx: false, w: 2 });
    K.pencil(bal, 'M580,520 L940,520 M580,450 L660,450 L660,590 L580,590 Z M860,450 L940,450 L940,590 L860,590 Z', { t: t0 + 0.4, dur: 0.4, sfx: false, w: 4 });
    const vf = X.svg('g', {}, bal);
    X.svg('rect', { x: 860, y: 450, width: 80, height: 140, fill: '#CFD8DE', opacity: 0.65 }, vf);
    X.svg('rect', { x: 580, y: 450, width: 80, height: 140, fill: '#CFD8DE', opacity: 0.4 }, vf);
    gsap.set(vf, { autoAlpha: 0 }); X.tl.fromTo(vf, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2, immediateRender: false }, t0 + 0.75);
    const t19 = w('maxwell', '1900'), tph = w('maxwell', 'physicists'), tme = w('maxwell', 'measured');
    K.pencil(cam, 'M1300,430 L960,490 M980,470 L956,491 L984,506 M1300,520 L966,520 M990,500 L962,520 L990,540 M1300,610 L960,550 M986,540 L958,550 L982,570', { t: tph - 0.1, dur: 0.45, color: C.red, w: 5.5 });
    X.tl.fromTo(bal, { scaleX: 1 }, { scaleX: 0.55, duration: 0.7, ease: 'power2.inOut', yoyo: true, repeat: 1, immediateRender: false }, tph + 0.25);
    K.torn(cam, 'LAB TEST, c.1900', { x: 760, y: 940, rot: -2, t: t19 + 0.05, size: 32 });
    K.chip(cam, 'MEASURED!', { x: 1420, y: 330, anchor: 'middle', t: tme + 0.02, sfx: 'stamp', gain: 0.4 });
  }, { push: { from: 1, rate: 0.03, y1: -15 } });

  // ================================================================ 10 · hard cut back to renders: the rotating sail unfurls (pull-back reveal)
  shot('s10', T.s10, T.s11, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 27, win, stars: 210, mid: '#120F33', bottom: '#1A1046', nebula: [[1450, 300, 900, '#6A2FB0', 0.5], [400, 760, 800, '#B0367A', 0.32]] });
    const tu = w('ikaros', 'unfurled'), zg = X.svg('g', {}, cam);
    const z = (t) => (t < tu ? lerp(2.0, 1.82, clamp((t - t0) / (tu - t0))) : lerp(1.82, 1.0, E.io2(clamp((t - tu) / 0.9))) - 0.04 * clamp((t - tu - 0.9) / 2));
    K.live(t0, t1, (t) => zg.setAttribute('transform', `translate(960 540) scale(${z(t).toFixed(4)}) translate(-960 -540)`));
    const unf = (t) => (t < tu ? 0.2 : 0.2 + 0.8 * E.back14(clamp((t - tu) / 0.75)));
    K.sail(zg, { size: 400, win, glintGain: 1.5, light: [-0.6, -0.55, 0.6], pose: (t) => ({ cx: 1040, cy: 500, spin: 0.8 * t, tilt: 0.92, yaw: 0.3, unfurl: unf(t) }) });
    X.sfx(tu, 'whoosh', { dur: 0.6, gain: 0.4, pitch: 0.8 }); X.sfx(tu + 0.35, 'sparkle', { dur: 0.7, gain: 0.3 });
    K.dataNumber(cam, '2010', 'JAPAN', { x: 330, y: 840, size: 140, t: w('ikaros', '2010') + 0.05 });
    const ti = w('ikaros', 'ikaros') + 0.03, tl0 = ti - 0.24, cp = [1380, 220];
    const hub = (t) => [960 + 80 * z(t), 540 - 40 * z(t)];
    const ln = X.svg('line', { stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, cam), dot = X.svg('circle', { r: 8, fill: '#fff' }, cam);
    K.live(t0, t1, (t) => {
      const on = t >= tl0 ? 'visible' : 'hidden', h = hub(t), k = E.o2(clamp((t - tl0) / 0.24));
      K.at(ln, { x1: h[0].toFixed(1), y1: h[1].toFixed(1), x2: lerp(h[0], cp[0], k).toFixed(1), y2: lerp(h[1], cp[1], k).toFixed(1), visibility: on });
      K.at(dot, { cx: h[0].toFixed(1), cy: h[1].toFixed(1), r: (8 * clamp((t - tl0) / 0.12)).toFixed(1), visibility: on });
    });
    K.chip(cam, 'IKAROS', { x: cp[0], y: cp[1], t: ti });
  }, { push: false });

  // ================================================================ 11 · on its way to Venus
  shot('s11', T.s11, T.s12, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 33, win, stars: 180 });
    const sx = 330, sy = 600;
    [[700, 230], [1000, 330]].forEach(([rx, ry]) => X.svg('ellipse', { cx: sx, cy: sy, rx, ry, fill: 'none', stroke: '#fff', 'stroke-width': 2, opacity: 0.3 }, cam));
    K.sun(cam, { cx: sx, cy: sy, r: 190, win, halo: 3.4 });
    const pt = (th, rad) => [sx + Math.cos(th) * rad, sy + Math.sin(th) * rad * 0.33];
    const path = [];
    for (let k = 0; k <= 60; k++) { const u = k / 60; path.push(pt(lerp(1.15, -0.45, u), lerp(1000, 700, E.io(u)))); }
    const [ex, ey] = path[0], [vx, vy] = path[60];
    K.sphere(cam, { cx: ex, cy: ey, r: 30, base: '#3F7FD8', hi: '#CFE9FF', dark: '#0A1630', atmo: '#7CC8FF', light: [-0.9, -0.2] });
    K.sphere(cam, { cx: vx, cy: vy, r: 40, base: '#E3C27E', hi: '#FFF6DA', dark: '#5A3A12', atmo: '#FFE0A0', atmoOp: 0.4, light: [-0.9, -0.1] });
    const pl = X.svg('path', { d: 'M' + path.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L'), fill: 'none', stroke: C.lime, 'stroke-width': 5, 'stroke-linecap': 'round' }, cam);
    X.svg('circle', { cx: ex, cy: ey, r: 9, fill: C.lime }, cam);
    const tp0 = t0 + 0.15, tdur = 2.1, cum = [0];
    for (let k = 1; k <= 60; k++) cum.push(cum[k - 1] + Math.hypot(path[k][0] - path[k - 1][0], path[k][1] - path[k - 1][1]));
    const at = (u) => { const d = u * cum[60]; let i = 0; while (i < 59 && cum[i + 1] < d) i++; const f = (d - cum[i]) / Math.max(1e-6, cum[i + 1] - cum[i]); return [lerp(path[i][0], path[i + 1][0], f), lerp(path[i][1], path[i + 1][1], f)]; };
    X.drawOn(pl, tp0, tdur, 'power2.inOut');
    K.sail(cam, { size: 34, win, glintGain: 2, pose: (t) => { const p = at(E.io2(clamp((t - tp0) / tdur))); return { cx: p[0], cy: p[1] - 22, spin: t, tilt: 0.6, yaw: -0.8 }; } });
    const tv = w('ikaros', 'venus');
    K.arrow(cam, { x: vx + 40, y: vy - 56, angle: 125, len: 120, t: t0 + 0.05 });
    K.chip(cam, 'VENUS', { x: vx + 70, y: vy - 200, t: tv + 0.1 });
    K.tag(fg, 'NOT TO SCALE', { x: 96, y: 92 });
  }, { push: { from: 1, rate: 0.03, x1: -30 } });

  // ================================================================ 12 · giant lasers push tiny probes
  shot('s12', T.s12, T.s13, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 41, win, stars: 200, nebula: [[1500, 200, 700, '#3B2A7A', 0.3]] });
    const ecx = 960, ecy = 2180, er = 1500;
    K.sphere(cam, { cx: ecx, cy: ecy, r: er, base: '#2F6FD0', hi: '#A6D8FF', dark: '#06122A', atmo: '#59B7FF', atmoOp: 0.8, atmoR: 1.035, light: [0.1, -1], termStart: 0.55, surface: K.earthSurface(5, { land: 0.22, continents: 14, clouds: 70 }), spin: 40, win });
    const tpr = w('laser', 'probes'), tpu = w('laser', 'pushed'), tgi = w('laser', 'giant');
    const px = 1180, py0 = 380;
    const pyF = (t) => py0 - Math.pow(Math.max(0, t - tpu), 2) * 200 + Math.sin(t * 1.4) * 6;
    const emit = Array.from({ length: 9 }, (_, i) => { const x = 700 + i * 65, y = ecy - Math.sqrt(er * er - (x - ecx) ** 2); return [x, y]; });
    const beams = X.svg('g', { style: 'mix-blend-mode:screen' }, cam);
    const lg = X.linear(K.id('lb'), [[0, '#7FF3FF', 0.95], [1, '#7FF3FF', 0.3]], 0, 1, 0, 0), lw = X.linear(K.id('lbw'), [[0, '#3FD8FF', 0.35], [1, '#3FD8FF', 0.05]], 0, 1, 0, 0);
    const bl = emit.map(() => [X.svg('polygon', { fill: lw }, beams), X.svg('polygon', { fill: lg }, beams)]);
    emit.forEach(([x, y]) => { X.svg('ellipse', { cx: x, cy: y, rx: 20, ry: 10, fill: '#9AA6B2' }, cam); X.svg('circle', { cx: x, cy: y - 7, r: 7, fill: '#DFFEFF' }, cam); X.svg('circle', { cx: x, cy: y - 7, r: 22, fill: X.radial(K.id('eg'), [[0, '#9FF6FF', 0.7], [1, '#9FF6FF', 0]]) }, cam); });
    const glow = X.svg('circle', { r: 110, fill: X.radial(K.id('pg'), [[0, '#BFFBFF', 0.9], [1, '#7FF3FF', 0]]) }, cam);
    K.sail(cam, { size: 54, win, light: [0, 0.9, 0.4], glintGain: 2, pose: (t) => ({ cx: px, cy: pyF(t), spin: 1.5 * t, tilt: -1.15, yaw: 0.2 }) });
    K.live(t0, t1, (t) => {
      const py = pyF(t), on = clamp((t - t0 - 0.3) / 0.6) * 0.35 + clamp((t - tpu) / 0.15) * 0.65, fl = t > tgi ? 1 + 0.5 * Math.exp(-(t - tgi) * 3) : 1;
      bl.forEach(([wide, core], i) => {
        const [x, y] = emit[i], op = (on * (0.85 + 0.15 * Math.sin(t * 30 + i))).toFixed(2);
        K.at(wide, { points: `${x - 14 * fl},${y - 6} ${x + 14 * fl},${y - 6} ${px + 6},${py} ${px - 6},${py}`, opacity: op });
        K.at(core, { points: `${x - 3.5 * fl},${y - 6} ${x + 3.5 * fl},${y - 6} ${px + 1},${py} ${px - 1},${py}`, opacity: op });
      });
      K.at(glow, { cx: px, cy: py.toFixed(1), opacity: (0.3 + 0.7 * on * fl).toFixed(2) });
    });
    X.sfx(tpu, 'zoom_out', { dur: 0.5, gain: 0.35 }); X.sfx(tpu + 0.05, 'impact', { gain: 0.3 });
    K.label(cam, { at: [px + 34, py0 - 14], end: [1420, 250], chip: [1420, 250], text: 'TINY PROBE', t: tpr + 0.05, out: tpu + 0.15 });
    K.arrow(cam, { x: 1080, y: 760, angle: 130, len: 130, t: tgi - 0.38 });
    K.chip(cam, 'GIANT LASERS', { x: 1110, y: 640, t: tgi + 0.03 });
  }, { push: { from: 1, rate: 0.03 } });

  // ================================================================ 13 · fast enough for the nearest stars
  shot('s13', T.s13, T.s14, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 47, win, stars: 240, drift: (t) => (t - t0) * 1600 });
    const streaks = X.svg('g', {}, cam), sr = X.rand(52);
    const sl = Array.from({ length: 22 }, () => [X.svg('line', { stroke: '#DDEBFF', 'stroke-width': 1 + sr() * 2.2, 'stroke-linecap': 'round', opacity: 0.25 + sr() * 0.5 }, streaks), 60 + sr() * 960, sr(), 1 + sr()]);
    K.live(t0, t1, (t) => sl.forEach(([l, y, ph, sp]) => { const x = 2100 - ((((t * 1.6 * sp + ph) % 1) + 1) % 1) * 2500; K.at(l, { x1: x, x2: x + 260 * sp, y1: y, y2: y }); }));
    X.svg('circle', { cx: 1640, cy: 360, r: 900, fill: X.radial(K.id('tsw'), [[0, '#7FB8FF', 0.55], [0.5, '#3D6FD0', 0.22], [1, '#3D6FD0', 0]]) }, cam);
    const star = X.svg('g', {}, cam);
    X.svg('circle', { r: 160, fill: X.radial(K.id('tsg'), [[0, '#DDF0FF', 0.8], [0.3, '#8CC8FF', 0.3], [1, '#8CC8FF', 0]]) }, star);
    X.svg('path', { d: K.sparklePath(110, 0.08), fill: '#EAF6FF' }, star);
    X.svg('circle', { r: 16, fill: '#fff' }, star);
    K.live(t0, t1, (t) => star.setAttribute('transform', `translate(1640,360) scale(${(0.6 + 0.5 * clamp((t - t0) / (t1 - t0))).toFixed(3)}) rotate(${(Math.sin(t * 2) * 3).toFixed(2)})`));
    const trail = X.svg('polygon', { points: '760,470 280,452 280,488', fill: X.linear(K.id('trl'), [[0, '#7FF3FF', 0], [1, '#E9FDFF', 0.85]], 0, 0, 1, 0) }, cam);
    X.svg('circle', { cx: 760, cy: 470, r: 70, fill: X.radial(K.id('pg2'), [[0, '#BFFBFF', 0.9], [1, '#7FF3FF', 0]]) }, cam);
    K.sail(cam, { size: 54, win, light: [-0.4, -0.5, 0.7], glintGain: 2, pose: (t) => ({ cx: 760, cy: 470 + Math.sin(t * 3) * 4, spin: 2 * t, tilt: 0.5, yaw: -1.0 }) });
    const tn = w('stars', 'nearest'), ttw = w('stars', 'twenty');
    K.arrow(cam, { x: 1560, y: 450, angle: -40, len: 120, t: tn - 0.3 });
    K.chip(cam, 'NEAREST STARS', { x: 1500, y: 560, anchor: 'end', t: tn + 0.08 });
    K.dataNumber(cam, '~20 YEARS', 'AT ONE-FIFTH THE SPEED OF LIGHT', { x: 760, y: 820, size: 140, t: ttw + 0.02 });
  }, { push: { from: 1, rate: 0.03 } });

  // ================================================================ 14 · lateral truck along a log timeline: laser sail vs Voyager
  shot('s14', T.s14, T.s15, (cam, fg, t0, t1, win) => {
    X.svg('rect', { x: -300, y: -200, width: 2520, height: 1480, fill: X.linear(K.id('dg'), [[0, '#2A6DF4'], [1, '#164AD0']]) }, cam);
    K.vignette(cam, 0.3, '#0A2470');
    const tr = X.svg('g', {}, cam), X0 = 200, PX = 560, xa = (yr) => X0 + Math.log10(yr) * PX;
    const lane = (y) => { X.svg('rect', { x: X0 - 30, y: y + 10, width: 3300, height: 56, rx: 28, fill: '#0E3AA8', opacity: 0.55 }, tr); X.svg('rect', { x: X0 - 30, y, width: 3300, height: 56, rx: 28, fill: X.linear(K.id('ln'), [[0, '#FFFFFF'], [1, '#D5DEEE']]) }, tr); };
    lane(400); lane(610);
    [1, 10, 100, 1000, 10000, 100000].forEach((yr, i) => {
      X.svg('line', { x1: xa(yr), y1: 360, x2: xa(yr), y2: 720, stroke: '#fff', 'stroke-width': 2, opacity: 0.35, 'stroke-dasharray': '6 8' }, tr);
      X.svg('text', { x: xa(yr), y: 770, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 800, 'font-size': 28, fill: '#fff', opacity: 0.9, text: yr.toLocaleString('en-US') + (i === 0 ? ' YR' : ' YRS') }, tr);
    });
    const cap = (txt, y) => X.svg('text', { x: X0 - 20, y: y - 22, 'font-family': 'Inter', 'font-weight': 800, 'font-size': 30, 'letter-spacing': '0.12em', fill: '#fff', text: txt }, tr);
    cap('LASER SAIL', 400); cap('VOYAGER', 610);
    const b1 = X.svg('rect', { x: X0 - 22, y: 408, height: 40, rx: 20, width: 40, fill: C.lime }, tr);
    const b2 = X.svg('rect', { x: X0 - 22, y: 618, height: 40, rx: 20, width: 40, fill: '#9AA9C4' }, tr);
    X.tl.fromTo(b1, { attr: { width: 40 } }, { attr: { width: xa(20) - X0 + 22 }, duration: 0.5, ease: 'power3.out', immediateRender: false }, t0 + 0.15);
    const tt = w('stars', 'tens'), tth = w('stars', 'thousands');
    X.tl.fromTo(b2, { attr: { width: 40 } }, { attr: { width: xa(75000) - X0 + 22 }, duration: tth + 0.15 - t0 - 0.3, ease: 'power2.in', immediateRender: false }, t0 + 0.3);
    K.chip(tr, '~20 YEARS', { x: xa(20) + 30, y: 330, t: t0 + 0.45, h: 80 });
    const sailIco = X.svg('g', {}, tr);
    X.svg('circle', { r: 44, fill: X.radial(K.id('sig'), [[0, '#F4FFB8', 0.8], [1, '#C9F31D', 0]]) }, sailIco);
    X.svg('path', { d: 'M0,-26 L26,0 L0,26 L-26,0 Z', fill: '#F2F6FA', stroke: '#9FB0C6', 'stroke-width': 2 }, sailIco);
    X.svg('circle', { r: 6, fill: '#E3AE45' }, sailIco);
    const voy = X.svg('g', {}, tr);
    X.svg('line', { x1: -10, y1: 0, x2: -58, y2: 22, stroke: '#E6ECF5', 'stroke-width': 3 }, voy);
    X.svg('rect', { x: -14, y: -10, width: 26, height: 20, fill: '#C9D2DE', stroke: '#6B7A90', 'stroke-width': 2 }, voy);
    X.svg('ellipse', { cx: 18, cy: 0, rx: 12, ry: 34, fill: X.linear(K.id('dish'), [[0, '#FFFFFF'], [1, '#AEB9C8']], 0, 0, 1, 0), stroke: '#6B7A90', 'stroke-width': 2 }, voy);
    K.live(t0, t1, (t) => {
      sailIco.setAttribute('transform', `translate(${(X0 - 22 + +b1.getAttribute('width')).toFixed(1)},428) rotate(${(t * 90) % 360})`);
      voy.setAttribute('transform', `translate(${(X0 - 22 + +b2.getAttribute('width') + 14).toFixed(1)},638) rotate(${(Math.sin(t * 2) * 6).toFixed(1)})`);
    });
    X.tl.fromTo(tr, { x: 0 }, { x: -1180, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, tt - 0.35);
    X.sfx(tt - 0.35, 'slide', { dur: 1.2, gain: 0.35 });
    K.chip(tr, 'TENS OF THOUSANDS', { x: xa(75000) + 10, y: 540, anchor: 'end', t: tth + 0.2, h: 80 });
    K.tag(fg, 'LOG SCALE', { x: 96, y: 92 });
  }, { push: { from: 1, rate: 0.03 } });

  // ================================================================ 15 · calm ending: the light on your face
  shot('s15', T.s15, END + 0.1, (cam, fg, t0, t1, win) => {
    K.space(cam, { seed: 58, win, stars: 220, nebula: [[1500, 250, 700, '#2E3F8A', 0.3], [300, 300, 600, '#7A3A2A', 0.18]] });
    K.sun(cam, { cx: -180, cy: -160, r: 380, win, haloOp: 0.9 });
    K.sphere(cam, { cx: 430, cy: 1190, r: 650, base: '#2F72D4', hi: '#BFE6FF', dark: '#05102A', atmo: '#6CC4FF', atmoOp: 0.75, atmoR: 1.07, light: [-0.55, -0.85], surface: K.earthSurface(9, { land: 1, continents: 6, clouds: 34 }), spin: 7, win });
    const warm = X.svg('circle', { cx: 430, cy: 1190, r: 655, fill: X.radial(K.id('warm'), [[0, '#FFB45A', 0], [0.7, '#FFB45A', 0.05], [1, '#FFC46A', 0.5]], 0.32, 0.18, 0.75) }, cam);
    gsap.set(warm, { autoAlpha: 0 });
    const twa = w('end', 'warming');
    X.tl.fromTo(warm, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.9, ease: 'sine.inOut', immediateRender: false }, twa - 0.2);
    const star = X.svg('g', { transform: 'translate(1590,300)' }, cam);
    X.svg('circle', { r: 90, fill: X.radial(K.id('es'), [[0, '#E6F4FF', 0.7], [1, '#8CC8FF', 0]]) }, star);
    const sp = X.svg('path', { d: K.sparklePath(60, 0.09), fill: '#F2FAFF' }, star);
    K.live(t0, t1, (t) => sp.setAttribute('transform', `scale(${(0.9 + 0.12 * Math.sin(t * 2.6)).toFixed(3)})`));
    K.sail(cam, { size: 40, win, glintGain: 2.2, light: [-0.6, -0.7, 0.4], pose: (t) => { const u = clamp((t - t0) / (t1 - t0)); return { cx: lerp(1020, 1330, u), cy: lerp(640, 430, u), spin: 0.7 * t, tilt: 0.7, yaw: -0.6 }; } });
    const ta = w('end', 'another');
    K.arrow(cam, { x: 1590, y: 395, angle: -90, len: 110, t: ta - 0.3 });
    K.chip(cam, 'ANOTHER STAR', { x: 1590, y: 560, anchor: 'middle', t: ta + 0.05 });
  }, { push: { from: 1, to: 1.05 } });

  X.grain(0.045, 12);
  X.end(END);
});
