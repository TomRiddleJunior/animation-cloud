/* Veritasium-style animated insert (glow-sim-on-black look): "Adding light can make the wall darker" —
 * two-slit interference, computed per frame (Huygens sum over each slit, phasors precomputed, τ from a sim clock),
 * then single-photon hits sampled from the same computed intensity. Grey cards stand in for the live-action shots. */
X.boot(async (X) => {
  await X.loadVO();
  const C = V.C, tl = X.tl, W = (id, w, n) => X.word(id, w, n), Ls = (id) => X.line(id).start;
  const END = X.vo.duration || 74;

  // ------------------------------------------------------------------ beat times (all from the narration)
  const T = {
    cut1: Ls('one'), light: W('one', 'light'), slitLab: W('one', 'narrow'), wallA: W('one', 'and'), wallLab: W('one', 'wall'), lights: W('one', 'lights'),
    back: Ls('two'), open: W('two', 'second'), wallB: W('two', 'and'), get: W('two', 'get'), darker: W('two', 'darker'),
    split: Ls('how'), less: W('how', 'less'),
    cut2: Ls('wave'), crest: W('wave', 'crests'), trough: W('wave', 'troughs'),
    slitB: W('add', 'second') + 0.12, tilt: W('add', 'ripples'),
    grey: W('lines', 'grey'), barely: W('lines', 'barely'),
    freeze: W('freeze', 'freeze') + 0.05, point: W('freeze', 'point'), half: W('freeze', 'half'), farther: W('freeze', 'farther'),
    crestA: W('cancel', 'crest'), always: W('cancel', 'always'), cancel: W('cancel', 'cancel'),
    here: Ls('double'), whole: W('double', 'whole'), cc: W('double', 'crest'), twice: W('double', 'twice'),
    avg: Ls('avg'), bands: W('avg', 'bands'), b1: W('avg', 'bright'), b2: W('avg', 'dark'), b3: W('avg', 'bright', 1),
    cut3: Ls('plot'), dark: W('plot', 'dark'), dimmer: W('plot', 'dimmer'),
    cut4: Ls('twist'), send: W('twist', 'send'), photon: W('twist', 'photon'), single: W('twist', 'single'),
    ramp: Ls('build'), bandsP: W('build', 'dark'),
    cut5: Ls('card2'),
  };

  // ------------------------------------------------------------------ physics (world units = px at zoom 1)
  const LAM = 80, D2 = 160, SLIT = 80, WALL = 1140;                 // λ, half slit spacing, slit width, barrier→wall
  const A = [0, -D2], B = [0, D2];
  const subs = (cy) => Array.from({ length: 5 }, (_, i) => [0, cy + (i - 2) * SLIT / 5]);
  const F = V.waveField({ lambda: LAM, groups: [{ subs: subs(-D2), x0: 0 }, { subs: subs(D2), x0: 0 }], box: [-4, -1400, WALL + 12, 1150], step: 4, comp: 0.32 });
  // exact complex amplitudes along the wall (time-averaged intensity I = |a1 + s·a2|²)
  const NV = 541, VR = 540, wallV = Array.from({ length: NV }, (_, i) => -VR + 2 * VR * i / (NV - 1));
  const wa = wallV.map((v) => F.amp(0, WALL, v)), wb = wallV.map((v) => F.amp(1, WALL, v));
  const Iw = (i, s) => (wa[i][0] + s * wb[i][0]) ** 2 + (wa[i][1] + s * wb[i][1]) ** 2;
  const I2 = wallV.map((_, i) => Iw(i, 1)), I1 = wallV.map((_, i) => Iw(i, 0));
  const Imax = Math.max(...I2);
  const iv = (v) => Math.max(0, Math.min(NV - 1, Math.round((v + VR) / (2 * VR) * (NV - 1))));
  const ext = (sign) => wallV.filter((v, i) => i > 0 && i < NV - 1 && sign * (I2[i] - I2[i - 1]) > 0 && sign * (I2[i] - I2[i + 1]) >= 0);
  const minima = ext(-1), maxima = ext(1);
  const vDark = minima.filter((v) => v < 0).sort((a, b) => b - a)[0];            // first dark band above centre
  const vBright = maxima.filter((v) => v <= 0).sort((a, b) => b - a);            // 0, then the next one up

  // sim clock: Hz of the displayed wave (T_sim = 1). Slow-mo, speed-up, freeze — playback speed only.
  let PHI0 = 0;
  const tau = V.simClock([[T.cut2, 1.5], [T.slitB, 1.5], [T.slitB + 0.4, 2.4], [T.tilt + 1.4, 2.4], [T.grey + 0.5, 1.1], [T.freeze - 0.6, 0.9], [T.freeze, 0.9], [T.freeze, 0], [T.always, 0], [T.always + 0.5, 0.55], [END, 0.55]]);
  const tauA = -2.6, tauB = tau(T.slitB);                                       // slit A already radiating at the cut

  // ------------------------------------------------------------------ layers
  const field = V.canvasLayer({ res: [640, 360], bloom: 10, bloomOpacity: 0.8 });
  const simWins = [[T.cut1, T.wallA], [T.back, T.wallB], [T.cut2, T.cut3]];
  V.showAt(field.wrap, simWins);
  const cam = V.planeCam({ ox: 440, oy: 0, z: 1, pitch: 0, rot: 0, D: 1900 });
  const st = { s: 0, bright: 0, mix: 0.8, wave: 0, dim: 1, wallGlow: 1, inc: 0.42 };

  // camera + state tweens (absolute times on the master timeline)
  tl.set(cam, { ox: 470, oy: -30, z: 1.32, pitch: 0.98, rot: -0.36 }, T.cut2);
  tl.set(st, { mix: 0, wave: 1, s: 0 }, T.cut2);
  tl.to(cam, { ox: 440, oy: 0, z: 1, pitch: 0, rot: 0, duration: 1.5, ease: 'power2.inOut' }, T.tilt);
  X.sfx(T.tilt + 0.1, 'woosh_low', { dur: 1.3, gain: 0.25 });
  // light on in the hook, then the second slit opens (amplitude of slit 2 grows as the shutter slides)
  tl.fromTo(st, { bright: 0 }, { bright: 1, duration: 0.25, ease: 'none', immediateRender: false }, T.light);
  tl.fromTo(st, { s: 0 }, { s: 1, duration: 0.45, ease: 'none', immediateRender: false }, T.open + 0.15);

  const app = V.showAt(X.svg('g', { id: 'app' }), simWins);
  const glowS = V.bloom('vb-silver', 4, true);
  const seg = (w = 3, col = C.silver) => X.svg('line', { stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', filter: glowS }, app);
  const barrier = [seg(), seg(), seg()], wallLine = seg(3), shutter = seg(6, '#B9BCB2');
  const slitNum = [V.math(app, 0, 0, ['1'], { size: 38, color: C.grey, anchor: 'end' }), V.math(app, 0, 0, ['2'], { size: 38, color: C.grey, anchor: 'end' })];
  slitNum.forEach((e) => gsap.set(e, { opacity: 0 }));
  tl.to(slitNum, { opacity: 1, duration: 0.2, ease: 'none' }, T.point - 0.2);
  const shut = { dy: 0 };
  tl.fromTo(shut, { dy: 0 }, { dy: 104, duration: 0.4, ease: 'power2.inOut', immediateRender: false }, T.open + 0.05);
  X.sfx(T.open + 0.05, 'slide', { dur: 0.4, gain: 0.35 });
  const P = (x, y) => cam.project(x, y);
  const setLine = (el, a, b) => { const p = P(a[0], a[1]), q = P(b[0], b[1]); el.setAttribute('x1', p[0]); el.setAttribute('y1', p[1]); el.setAttribute('x2', q[0]); el.setAttribute('y2', q[1]); };

  // ------------------------------------------------------------------ HOOK: front-loaded hard cuts between three screens
  // schematic (top-down) ↔ the wall seen face-on ↔ a split-screen comparison; every cut lands on a clause start.
  const hookWins = [[T.cut1, T.wallA], [T.back, T.wallB]];
  const hook = V.showAt(X.svg('g', { id: 'hook' }), hookWins);
  const lampXY = cam.project(-330, 0);
  X.svg('circle', { cx: lampXY[0], cy: lampXY[1], r: 46, fill: C.yellow, opacity: 0.18, filter: V.bloom('vb-lamp', 14) }, hook);
  const lampCore = X.svg('circle', { cx: lampXY[0], cy: lampXY[1], r: 15, fill: '#FFF6DF', stroke: C.silver, 'stroke-width': 3, filter: V.bloom('vb-lamp2', 6) }, hook);
  gsap.set(lampCore, { opacity: 0.35 });
  tl.to(lampCore, { opacity: 1, duration: 0.12, ease: 'none' }, T.light);
  X.sfx(T.light, 'click', { gain: 0.35 });
  const profFill = X.svg('path', { fill: C.yellow, opacity: 0.16 }, hook);
  const prof = X.svg('path', { fill: 'none', stroke: C.yellow, 'stroke-width': 3, filter: V.bloom('vb-prof', 4) }, hook);
  const profK = { k: 0 };
  tl.fromTo(profK, { k: 0 }, { k: 1, duration: 0.6, ease: 'power2.out', immediateRender: false }, T.light + 0.3);
  const slitXY = cam.project(0, -D2);
  const cSlit = V.callout(hook, 'slit', { size: 40 }); cSlit.move(slitXY[0] + 70, slitXY[1] - 120, slitXY[0] + 6, slitXY[1] - 4);
  const cLight = V.label(hook, 'light', lampXY[0], lampXY[1] + 92, { size: 40, anchor: 'middle' });
  [cSlit.line, cSlit.dot].forEach((e) => gsap.set(e, { opacity: 0 }));
  V.type(cLight, T.light + 0.1); V.type(cSlit.label, T.slitLab + 0.08); tl.to([cSlit.line, cSlit.dot], { opacity: 0.85, duration: 0.15, ease: 'none' }, T.slitLab + 0.08);
  const cOpen = V.label(hook, 'open', slitXY[0] + 70, slitXY[1] + 2 * D2 + 130, { size: 40 });
  gsap.set(cOpen, { opacity: 0 }); tl.set(cOpen, { opacity: 1 }, T.open + 0.1); V.type(cOpen, T.open + 0.1);

  // the wall, face-on (same box the photon screen uses later, so it is recognised when it returns)
  const R = { x: 160, y: 236, w: 1600, h: 620 }, SIG = 0.5;              // screen box; vertical spread of the light
  const wallFace = (parent, box, title, tTitle) => {
    const g = X.svg('g', {}, parent);
    X.svg('rect', { x: box[0], y: box[1], width: box[2], height: box[3], fill: '#18191D' }, g);
    const g1 = V.profileGlow(g, box, I1, Imax, { gamma: 0.55, bloom: 6, sigma: SIG }), g2 = V.profileGlow(g, box, I2, Imax, { gamma: 0.55, bloom: 6, sigma: SIG });
    X.svg('rect', { x: box[0], y: box[1], width: box[2], height: box[3], fill: 'none', stroke: C.silver, 'stroke-width': 3, filter: V.bloom('vb-silver', 4, true) }, g);
    const lab = V.label(g, title, box[0], box[1] - 28, { size: 40 });
    if (tTitle != null) V.type(lab, tTitle);
    return { g, g1, g2, lab };
  };
  const vx = (v) => R.x + (v + VR) / (2 * VR) * R.w;
  const face1 = wallFace(V.showAt(X.svg('g', { id: 'face1' }), [[T.wallA, T.back]]), [R.x, R.y, R.w, R.h], 'wall', T.wallLab + 0.05);
  gsap.set(face1.g2, { opacity: 0 }); gsap.set(face1.g1, { opacity: 0 });
  tl.to(face1.g1, { opacity: 1, duration: 1.0, ease: 'power1.inOut' }, T.wallLab + 0.1);
  X.sfx(T.wallLab + 0.1, 'blip_up', { gain: 0.22, pitch: 0.8 });
  const face2 = wallFace(V.showAt(X.svg('g', { id: 'face2' }), [[T.wallB, T.split]]), [R.x, R.y, R.w, R.h], 'wall', null);
  gsap.set(face2.g2, { opacity: 0 });
  tl.to(face2.g2, { opacity: 1, duration: 0.35, ease: 'none' }, T.get);
  tl.to(face2.g1, { opacity: 0, duration: 0.35, ease: 'none' }, T.get);
  const ring = X.svg('ellipse', { cx: vx(vDark), cy: R.y + R.h / 2, rx: 44, ry: 172, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, face2.g);
  X.drawOn(ring, T.darker + 0.06, 0.4, 'power2.out'); X.sfx(T.darker + 0.06, 'blip', { gain: 0.35 });
  const dLab = V.label(face2.g, 'darker', vx(vDark), R.y + R.h + 66, { size: 40, anchor: 'middle' }); V.type(dLab, T.darker + 0.1);
  // split screen with a dashed divider: one slit | two slits, the same spot ringed on both
  const sp = V.showAt(X.svg('g', { id: 'split' }), [[T.split, T.cut2]]);
  const half = [[80, 300, 860, 480], [980, 300, 860, 480]];
  const fl = wallFace(sp, half[0], '1 slit', T.split + 0.05), fr = wallFace(sp, half[1], '2 slits', T.split + 0.2);
  gsap.set(fl.g2, { opacity: 0 }); gsap.set(fr.g1, { opacity: 0 });
  fr.lab.setAttribute('fill', C.yellow);
  X.svg('line', { x1: 960, y1: 150, x2: 960, y2: 930, stroke: C.ink, 'stroke-width': 3, 'stroke-dasharray': '16 14', opacity: 0.8 }, sp);
  half.forEach((hb, i) => {
    const xr = hb[0] + (vDark + VR) / (2 * VR) * hb[2];
    const e = X.svg('ellipse', { cx: xr, cy: hb[1] + hb[3] / 2, rx: 30, ry: 134, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, sp);
    X.drawOn(e, T.less + i * 0.25, 0.35, 'power2.out'); X.sfx(T.less + i * 0.25, i ? 'tock' : 'tick', { gain: 0.3 });
  });

  // ------------------------------------------------------------------ FIELD SIM (tilted → top-down, then the freeze)
  const fs = X.scene('fieldsim', T.cut2, T.cut3);
  // crest / trough callouts ride one crest (r = λ(n + τ)) and one trough
  const nC = Math.round(0.55 * (tau(T.crest) - tauA) - tau(T.crest)), nT = Math.round(0.42 * (tau(T.trough) - tauA) - tau(T.trough)) + 0.5;
  const dirC = [Math.cos(0.5), Math.sin(0.5)], dirT = [Math.cos(-0.15), Math.sin(-0.15)];
  const cCrest = V.callout(fs, 'crest', { size: 40, color: C.red }), cTrough = V.callout(fs, 'trough', { size: 40, color: C.blue });
  [cCrest.g, cTrough.g].forEach((g) => gsap.set(g, { opacity: 0 }));
  tl.set(cCrest.g, { opacity: 1 }, T.crest + 0.05); V.type(cCrest.label, T.crest + 0.05); X.sfx(T.crest + 0.05, 'tick', { gain: 0.25 });
  tl.set(cTrough.g, { opacity: 1 }, T.trough + 0.05); V.type(cTrough.label, T.trough + 0.05); X.sfx(T.trough + 0.05, 'tock', { gain: 0.25 });
  tl.to([cCrest.g, cTrough.g], { opacity: 0, duration: 0.2, ease: 'none' }, T.slitB - 0.1);
  X.sfx(T.slitB, 'blip_up', { gain: 0.3 });
  // nodal lines |r1 − r2| = (m + ½)λ, drawn on as dashed grey curves
  const xs = Array.from({ length: 96 }, (_, i) => 6 + i * (WALL - 6) / 95);
  const nodal = [];
  [0.5, 1.5, 2.5, 3.5].forEach((m, k) => [1, -1].forEach((sg) => {
    const pts = V.hyperbola(A, B, sg * m * LAM, xs, sg);
    const el = X.svg('path', { fill: 'none', stroke: '#9AA0AE', 'stroke-width': 2.5, 'stroke-dasharray': '12 9', opacity: 0.95 }, fs);
    const pr = { p: 0 };
    tl.fromTo(pr, { p: 0 }, { p: 1, duration: 0.9, ease: 'power1.inOut', immediateRender: false }, T.grey + 0.05 + k * 0.1 + (sg < 0 ? 0.05 : 0));
    nodal.push({ pts, el, pr });
  }));
  X.sfx(T.grey + 0.05, 'blip', { gain: 0.25, pitch: 0.9 });
  tl.to(nodal.map((n) => n.el), { opacity: 0.35, duration: 0.2, ease: 'none' }, T.point);
  tl.to(nodal.map((n) => n.el), { opacity: 0, duration: 0.3, ease: 'none' }, T.avg);
  // freeze: a quiet pause glyph, zoom in on the geometry (change of scale = the only camera move)
  const pause = X.svg('g', { opacity: 0 }, fs);
  X.svg('rect', { x: 120, y: 112, width: 12, height: 44, fill: C.ink }, pause); X.svg('rect', { x: 144, y: 112, width: 12, height: 44, fill: C.ink }, pause);
  V.label(pause, 'time frozen', 180, 150, { size: 36, color: C.grey });
  tl.set(pause, { opacity: 1 }, T.freeze); tl.set(pause, { opacity: 0 }, T.always);
  X.sfx(T.freeze, 'tock', { gain: 0.45 });
  tl.to(cam, { ox: 300, oy: 40, z: 1.55, duration: 1.0, ease: 'power2.inOut' }, T.freeze + 0.15);
  tl.to(st, { dim: 0.42, duration: 0.17, ease: 'none' }, T.point);
  tl.to(cam, { ox: 440, oy: 0, z: 1, duration: 1.2, ease: 'power2.inOut' }, T.avg + 0.05);
  tl.to(st, { dim: 1, mix: 1, inc: 0, duration: 0.8, ease: 'none' }, T.avg + 0.1);
  X.sfx(T.avg + 0.1, 'woosh_low', { dur: 0.9, gain: 0.25 });

  // probe points: P on the first dark curve (r1 − r2 = λ/2), Q on the first bright one (r1 − r2 = λ)
  const PX = 560, Pp = V.hyperbola(A, B, LAM / 2, [PX], 1)[0], Qp = V.hyperbola(A, B, LAM, [PX], 1)[0];
  // phase offset (= a shift of the time origin): at the freeze, slit 1's wave is exactly at a crest on P (slit 2's at a trough)
  const r1P = Math.hypot(Pp[0] - A[0], Pp[1] - A[1]);
  PHI0 = ((r1P / LAM - tau(T.freeze)) % 1 + 1) % 1;
  const probe = (pt, t0, t1, deltaParts, tDelta, tArr, tSum, sumText) => {
    const g = X.scene('probe' + Math.round(t0), t0, t1, null, fs);
    const lines = [X.svg('line', { stroke: C.ink, 'stroke-width': 2.5, opacity: 0.85 }, g), X.svg('line', { stroke: C.ink, 'stroke-width': 2.5, opacity: 0.85 }, g)];
    const lp = { p: 0 }; tl.fromTo(lp, { p: 0 }, { p: 1, duration: 0.5, ease: 'power2.inOut', immediateRender: false }, t0 + 0.25);
    const rl = [V.math(g, 0, 0, ['r', { t: '1', sub: 1 }], { size: 40 }), V.math(g, 0, 0, ['r', { t: '2', sub: 1 }], { size: 40 })];
    rl.forEach((e) => { gsap.set(e, { opacity: 0 }); tl.to(e, { opacity: 1, duration: 0.15, ease: 'none' }, t0 + 0.6); });
    const halo = X.svg('circle', { r: 30, fill: C.ink, opacity: 0.18, filter: V.bloom('vb-probe', 8) }, g);
    const dot = X.svg('circle', { r: 0, fill: C.bg, stroke: C.ink, 'stroke-width': 3 }, g);
    tl.fromTo(dot, { attr: { r: 0 } }, { attr: { r: 11 }, duration: 0.17, ease: 'back.out(1.4)', immediateRender: false }, t0 + 0.02); X.sfx(t0 + 0.02, 'pop', { gain: 0.3 });
    const dl = V.math(g, 0, 0, deltaParts, { size: 48 }); gsap.set(dl, { opacity: 0 }); tl.to(dl, { opacity: 1, duration: 0.12, ease: 'none' }, tDelta); X.sfx(tDelta, 'tick', { gain: 0.3 });
    // sine-envelope arrow arrays along both paths (value = cos(k s − ωτ), colour = sign)
    const arr = V.arrows(g, 140, { width: 2.5, head: 8 });
    const rv = { p: 0 }; tl.fromTo(rv, { p: 0 }, { p: 1, duration: 0.9, ease: 'none', immediateRender: false }, tArr);
    X.sfx(tArr, 'swoosh', { dur: 0.8, gain: 0.18 });
    // readout: wave from slit 1, from slit 2, and their sum at the probe point
    const bars = X.svg('g', { opacity: 0 }, g);
    tl.to(bars, { opacity: 1, duration: 0.15, ease: 'none' }, tArr + 0.5);
    const base = X.svg('line', { stroke: C.grey, 'stroke-width': 2 }, bars);
    const br = [0, 1, 2].map(() => X.svg('rect', { width: 30 }, bars));
    const bl = ['1', '2', 'sum'].map((s) => V.label(bars, s, 0, 0, { size: 36, color: C.grey, anchor: 'middle' }));
    const sumL = V.math(bars, 0, 0, [sumText], { size: 44 }); gsap.set(sumL, { opacity: 0 });
    tl.set(sumL, { opacity: 1 }, tSum); X.sfx(tSum, sumText === '= 0' ? 'blip_down' : 'blip_up', { gain: 0.35 });
    const paths = [A, B].map((S) => { const dx = pt[0] - S[0], dy = pt[1] - S[1], L = Math.hypot(dx, dy); return { S, L, u: [dx / L, dy / L], n: [dy / L, -dx / L] }; });  // n points screen-up: + = up
    X.every((t) => {
      if (t < t0 || t >= t1) return;
      const ph = 2 * Math.PI * (tau(t) + PHI0), k = 2 * Math.PI / LAM, pp = P(pt[0], pt[1]);
      paths.forEach((q, i) => {
        const a = P(q.S[0], q.S[1]), f = lp.p;
        lines[i].setAttribute('x1', a[0]); lines[i].setAttribute('y1', a[1]);
        lines[i].setAttribute('x2', a[0] + (pp[0] - a[0]) * f); lines[i].setAttribute('y2', a[1] + (pp[1] - a[1]) * f);
        const m = P(q.S[0] + q.u[0] * q.L * 0.5, q.S[1] + q.u[1] * q.L * 0.5);
        rl[i].setAttribute('x', m[0] - 14); rl[i].setAttribute('y', m[1] + (i === 0 ? -22 : 52));
      });
      halo.setAttribute('cx', pp[0]); halo.setAttribute('cy', pp[1]); dot.setAttribute('cx', pp[0]); dot.setAttribute('cy', pp[1]);
      dl.setAttribute('x', pp[0] - 30); dl.setAttribute('y', pp[1] - 190);
      let n = 0; const vals = [];
      paths.forEach((q) => {
        const step = LAM / 9, cnt = Math.floor((q.L - 24) / step);
        for (let j = 0; j <= cnt; j++) {
          const s = q.L - j * step;                 // walk back from the probe so an arrow sits exactly on it
          if (s < 24 || s > rv.p * q.L + 0.5) continue;
          const v = Math.cos(k * s - ph), len = 30 * v;
          const bx = q.S[0] + q.u[0] * s, by = q.S[1] + q.u[1] * s;
          const a = P(bx, by), b = P(bx + q.n[0] * len, by + q.n[1] * len);
          if (n < 140) arr.set(n++, a[0], a[1], b[0], b[1], v >= 0 ? C.red : C.blue, j === 0 ? 1 : 0.9);
        }
        vals.push(Math.cos(k * q.L - ph));
      });
      arr.hideFrom(n);
      const bx0 = pp[0] + 90, by0 = pp[1] + 6;
      base.setAttribute('x1', bx0 - 10); base.setAttribute('x2', bx0 + 2 * 82 + 40); base.setAttribute('y1', by0); base.setAttribute('y2', by0);
      [vals[0], vals[1], vals[0] + vals[1]].forEach((v, i) => {
        const h = Math.abs(v) * 55, x = bx0 + i * 82;
        br[i].setAttribute('x', x); br[i].setAttribute('y', v >= 0 ? by0 - h : by0); br[i].setAttribute('height', Math.max(h, 0.01));
        br[i].setAttribute('fill', v >= 0 ? C.red : C.blue);
        bl[i].setAttribute('x', x + 15); bl[i].setAttribute('y', by0 + 150);
      });
      sumL.setAttribute('x', bx0 + 2 * 82 + 56); sumL.setAttribute('y', by0 + 16);
    });
    return g;
  };
  probe(Pp, T.point, T.here, ['r', { t: '1', sub: 1 }, { t: ' − r', after: 1 }, { t: '2', sub: 1 }, { t: ' = ½ ', after: 1 }, { t: 'λ', c: C.ink }], T.half, T.farther, T.cancel + 0.05, '= 0');
  probe(Qp, T.here, T.avg + 0.1, ['r', { t: '1', sub: 1 }, { t: ' − r', after: 1 }, { t: '2', sub: 1 }, { t: ' = 1 ', after: 1 }, { t: 'λ', c: C.ink }], T.whole, T.cc, T.twice + 0.05, '× 2');

  // bright / dark / bright marks on the wall after the time average
  const marks = [[vBright[0], T.b1, 'tick', true], [vDark, T.b2, 'tock', false], [vBright[1], T.b3, 'tick', true]];
  const camTop = V.planeCam({ ox: 440, oy: 0, z: 1, D: 1900 });                // the camera is back here by then
  marks.forEach(([v, t, sfx, br]) => {
    const [mx, my] = camTop.project(WALL - 26, v);
    const e = X.svg('circle', { cx: mx, cy: my, r: 14, fill: br ? C.yellow : 'none', stroke: br ? C.yellow : C.ink, 'stroke-width': 3, filter: br ? V.bloom('vb-mark', 5) : '' }, fs);
    X.pop(e, t + 0.05, { dur: 0.16, ease: 'back.out(1.4)', sfx, gain: 0.3 });
  });

  X.every((t) => {
    if (!field.on()) return;
    // apparatus (projected through the camera)
    setLine(barrier[0], [0, -1400], [0, -D2 - SLIT / 2]); setLine(barrier[1], [0, -D2 + SLIT / 2], [0, D2 - SLIT / 2]); setLine(barrier[2], [0, D2 + SLIT / 2], [0, 1150]);
    setLine(wallLine, [WALL + 4, -1400], [WALL + 4, 1150]);
    setLine(shutter, [-7, D2 - SLIT / 2 - 8 + shut.dy], [-7, D2 + SLIT / 2 + 8 + shut.dy]);
    [A, B].forEach((S, i) => { const p = P(S[0] - 22, S[1] + 14); slitNum[i].setAttribute('x', p[0]); slitNum[i].setAttribute('y', p[1]); });
    const T_ = tau(t), inWave = t >= T.cut2;
    V.renderWaves(field, cam, F, {
      phase: 2 * Math.PI * (T_ + PHI0), amps: [1, inWave ? 1 : st.s],
      fronts: inWave ? [LAM * (T_ - tauA), t >= T.slitB ? LAM * (T_ - tauB) : -1] : [Infinity, Infinity],
      mix: st.mix, wave: st.wave, gain: 0.8, igain: inWave ? 0.55 : 0.75, bright: st.bright * (inWave ? 1.2 : 1), dim: st.dim,
      incident: inWave ? { amp: st.inc, half: 300, xmin: -900, soft: 140 } : { amp: 0.9, half: 250, xmin: -330, cone: true },
      wall: { x: WALL, glow: 1 }, depth: true,
    });
    if (t < T.cut2) {           // hook profile (time-averaged brightness along the wall)
      const pts = []; const k = profK.k * 190 / Imax;
      for (let i = 0; i < NV; i += 3) { const p = P(WALL + 20 + k * Iw(i, st.s), wallV[i]); pts.push(p); }
      prof.setAttribute('d', V.pathD(pts));
      const a = P(WALL + 20, -VR), b = P(WALL + 20, VR);
      profFill.setAttribute('d', V.pathD(pts) + `L${b[0]},${b[1]}L${a[0]},${a[1]}Z`);
    } else {
      if (t < T.slitB) {
        const rc = LAM * (nC + T_ + PHI0), rt = LAM * (nT + T_ + PHI0);
        const pc = P(A[0] + dirC[0] * rc, A[1] + dirC[1] * rc), pt = P(A[0] + dirT[0] * rt, A[1] + dirT[1] * rt);
        cCrest.move(pc[0] + 60, pc[1] + 110, pc[0], pc[1]); cTrough.move(pt[0] + 40, pt[1] - 80, pt[0], pt[1]);
      }
      for (const n of nodal) {
        const m = Math.max(2, Math.round(n.pr.p * n.pts.length));
        n.el.setAttribute('d', n.pr.p <= 0 ? '' : V.pathD(n.pts.slice(0, m).map((q) => P(q[0], q[1]))));
      }
    }
  });

  // ------------------------------------------------------------------ GRAPH (hard cut: brightness along the wall)
  X.scene('graph', T.cut3, T.cut4, (g, t0) => {
    const ax = V.axes(g, { x: 330, y: 230, w: 1240, h: 540, xr: [-VR, VR], yr: [0, 1.12], xLabel: 'position on wall', yLabel: 'brightness', t: t0 + 0.05, xTicks: [[0, '0']] });
    const two = V.plot(ax, wallV.map((v, i) => [v, I2[i] / Imax]), { color: C.yellow, width: 4, glow: true });
    V.reveal(two, t0 + 0.35, 2.0, [300, 150, 1340, 700]);
    const one = V.plot(ax, wallV.map((v, i) => [v, I1[i] / Imax]), { color: C.grey, width: 3.5, dash: '14 10' });
    V.reveal(one, T.dark - 0.05, 1.3, [300, 150, 1340, 700]);
    const lt = V.label(g, '2 slits', ax.X(46), ax.Y(1.02), { size: 40, color: C.yellow }); V.type(lt, t0 + 0.6);
    const lo = V.label(g, '1 slit', ax.X(VR) + 14, ax.Y(I1[NV - 1] / Imax) + 14, { size: 40, color: C.grey }); V.type(lo, T.dark + 0.4);
    minima.filter((v) => I2[iv(v)] < I1[iv(v)]).forEach((v, i) => {
      const c = X.svg('circle', { cx: ax.X(v), cy: ax.Y(I2[iv(v)] / Imax), r: 18, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, g);
      X.pop(c, T.dimmer + i * 0.1, { dur: 0.17, ease: 'back.out(1.4)', sfx: i % 2 ? false : 'blip', gain: 0.22, pitch: 1 + i * 0.05 });
    });
  });

  // ------------------------------------------------------------------ PHOTONS (hard cut: the wall seen face-on)
  const pick = V.sampler(I2, -VR, VR, 21), rg = X.rand(77);
  const gauss = () => { let s = 0; for (let i = 0; i < 4; i++) s += rg(); return (s - 2) / 0.577; };
  const NPH = 32000, pts = Array.from({ length: NPH }, () => { let y; do { y = gauss() * SIG; } while (Math.abs(y) > 0.97); return [vx(pick()), R.y + R.h / 2 + y * R.h / 2]; });
  const ph = X.scene('photons', T.cut4, T.cut5);
  // the wall returns lit as in the hook; the light is then turned down to single photons
  const face3 = wallFace(ph, [R.x, R.y, R.w, R.h], 'wall', null);
  gsap.set(face3.g1, { opacity: 0 }); gsap.set(face3.lab, { opacity: 0 });
  tl.to(face3.g2, { opacity: 0, duration: 0.9, ease: 'power1.in' }, T.send);
  X.sfx(T.send, 'woosh_low', { dur: 0.9, gain: 0.18, pitch: 0.8 });
  tl.set(face3.g, { autoAlpha: 0 }, T.send + 0.95);                          // its opaque backdrop would hide the hit canvas
  X.svg('rect', { x: R.x, y: R.y, width: R.w, height: R.h, fill: 'none', stroke: C.silver, 'stroke-width': 3, filter: glowS }, ph);
  const hits = V.hitLayer(pts, { size: 3, alpha: 0.38, bloom: 5, bloomOpacity: 0.7, under: [R.x, R.y, R.w, R.h, '#18191D'], lead: { n: 14, r: 5 } });
  hits.show(T.cut4, T.cut5);
  // countable arrivals first (one, then a few per second), then the exponential speed ramp
  const slowT = []; for (let tt = T.photon + 0.25, dt = 0.7; tt < T.ramp; tt += dt, dt = Math.max(0.09, dt * 0.84)) slowT.push(tt);
  const count = V.rampCount({ slow: slowT, t0: T.ramp + 0.1, dur: 2.5, n1: NPH, k: 9 });
  const ctr = V.counter(ph, { label: 'photons', x: R.x, y: 118, size: 72 });
  X.every((t) => { if (t < T.cut4 || t >= T.cut5) return; const n = count(t); hits.draw(n); ctr.num.textContent = n.toLocaleString('en-US'); });
  slowT.forEach((ts, i) => {
    const [x, y] = pts[i];
    // the photon flies in along the line of sight (camera at the slits): a shrinking glow that lands on its spot
    const inc = X.svg('circle', { cx: x, cy: y, r: 110, fill: C.yellow, opacity: 0, filter: V.bloom('vb-inc', 10) }, ph);
    tl.fromTo(inc, { attr: { r: 110 }, opacity: 0 }, { attr: { r: 5 }, opacity: 0.5, duration: 0.24, ease: 'power2.in', immediateRender: false }, ts - 0.24);
    tl.set(inc, { opacity: 0 }, ts);
    const disc = X.svg('circle', { cx: x, cy: y, r: 22, fill: C.yellow, opacity: 0, filter: V.bloom('vb-flash2', 8) }, ph);
    const fl = X.svg('circle', { cx: x, cy: y, r: 6, fill: 'none', stroke: C.yellow, 'stroke-width': 3, opacity: 0, filter: V.bloom('vb-flash', 4) }, ph);
    tl.fromTo(disc, { opacity: 0.9, attr: { r: 22 } }, { opacity: 0, attr: { r: 6 }, duration: 0.35, ease: 'power2.out', immediateRender: false }, ts);
    tl.fromTo(fl, { attr: { r: 6 }, opacity: 1 }, { attr: { r: 46 }, opacity: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, ts);
    if (i < 6) X.sfx(ts, 'tick', { gain: 0.28 - i * 0.03, pitch: 0.9 + 0.04 * (i % 5) });
  });
  X.sfx(T.ramp + 0.1, 'riser', { dur: 2.4, gain: 0.22 });
  const over = X.svg('path', { d: V.pathD(wallV.map((v, i) => [vx(v), R.y + R.h - 20 - (R.h - 70) * I2[i] / Imax])), fill: 'none', stroke: C.yellow, 'stroke-width': 3.5, filter: V.bloom('vb-over', 4) }, ph);
  V.reveal(over, T.bandsP, 0.9, [R.x - 10, R.y - 10, R.w + 20, R.h + 20]);
  X.sfx(T.bandsP, 'chime', { dur: 0.8, gain: 0.25 });

  // ------------------------------------------------------------------ live-action placeholders (cut out / cut back)
  V.brollCard(0, T.cut1, { id: 'card-in' });
  V.brollCard(T.cut5, END + 1, { id: 'card-out' });
  X.end(END);
});
