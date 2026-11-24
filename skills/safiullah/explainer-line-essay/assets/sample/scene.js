// "Desire paths" — line-essay sample (vertical 1080×1920, one continuous take, no cuts).
// Planner's path = blue, machine-ruled · the worn diagonal = drawn live by the pen (white until examined, then amber).
X.boot(async (X) => {
  await X.loadVO();
  const K = LineEssayKit(X);
  K.setup();
  const C = K.C, Wd = K.world, HUD = K.hud, tl = X.tl;
  const ln = (id) => X.line(id), wd = (id, w, n) => X.word(id, w, n), we = (id, w, n) => X.wordEnd(id, w, n);
  const DUR = X.vo.duration || 56.6;

  // ------------------------------------------------------------------ geometry (world = screen at s = 1)
  const TL = [260, 593], TR = [820, 593], BR = [820, 1153], BL = [260, 1153];
  const A = [272, 605], B = [808, 1141];                       // diagonal: entrance corner → exit corner
  const bump = (u) => 24 * Math.exp(-(((u - 0.36) / 0.1) ** 2));   // bends away from the puddle
  const split = (u) => (u > 0.54 && u < 0.78 ? -15 * Math.sin(Math.PI * (u - 0.54) / 0.24) : 0);
  const ref = K.cl.line(A, B, 3.5);
  const diagPts = K.hand(ref, { wob: 2.4, trem: 1.1, seed: 3, offset: (u) => bump(u) });
  const splitRoute = K.hand(ref, { wob: 2.4, trem: 1.1, seed: 3, offset: (u) => bump(u) + split(u) });
  const N = ref.length, iu = (u) => Math.round(u * (N - 1));
  const DIAG = { kind: 'white', w: 2.6, minScreenW: 2.2, steps: { spacing: 14, offset: 7, r: 1.35, seed: 4 } };

  const tiles = X.svg('g', {}, Wd);                 // copy grid sits under the original lawn
  const lawn = X.svg('g', {}, Wd);
  const border = K.stroke(lawn, K.cl.poly([TL, TR, BR, BL, TL], 3), { kind: 'blue', w: 1.1, uw: 1.3, uo: 0.35, cap: 'butt', minScreenW: 1.0 });
  border.style.opacity = 0.6;
  const bandPts = [[272, 593], [272, 1141], [820, 1141]];
  const band = K.ruled(lawn, bandPts, { gap: 24, minScreenW: 1.1 });
  const diag = K.stroke(lawn, diagPts, DIAG);
  const fx = X.svg('g', {}, Wd);                    // marks, labels that live in the world

  // ================================================================== 1 · HOOK: the pen draws the worn line
  const L1 = ln('hook1');
  K.penDraw(diag, -0.25, 3.25, { enter: 0.45, exit: 0.6, ease: 'sine.inOut' });
  K.label(fx, 'PEOPLE', 540, 1206, wd('hook1', 'people') - 0.05, { out: ln('hook2').start - 0.1 });

  // ================================================================== 2 · the path they were given (machine)
  const L2 = ln('hook2'), tThis = wd('hook2', 'this'), tPath = wd('hook2', 'path'), tGiven = wd('hook2', 'given');
  K.camTo(L2.start - 0.15, 1.1, { x: 540, y: 873, s: 0.94 }, 'power2.inOut');
  const ch = K.crosshair(fx, 272, 593, tThis - 0.05, { out: wd('copies', 'same') - 0.05 });
  X.sfx(tThis - 0.05, 'blip_up', { gain: 0.18 });
  K.label(fx, 'PLAN', 272, 556, tThis + 0.02, { out: wd('copies', 'same') - 0.05 });
  K.anim(border, tThis + 0.12, 0.62, 'draw', { ease: 'none' });
  K.ruledAnim(band, tPath - 0.05, 0.85, 'draw', { ease: 'power2.inOut' });
  K.walker(fx, band.mid.pts, tPath - 0.05, 0.85, { kind: 'blue', trail: 30, w: 0.6, ease: 'power2.inOut' });
  X.sfx(tPath - 0.05, 'slide', { gain: 0.16, dur: 0.8 });
  const am = K.angleMark(fx, 284, 1129, tGiven - 0.05, { size: 16, dx: 1, dy: -1 });
  const deg = K.label(fx, '90°', 318, 1098, tGiven, { anchor: 'start', size: 20, color: C.labelBlue });
  K.label(fx, 'a² + b² = c²', 540, 1206, tGiven + 0.25, { color: C.labelBlue, out: wd('copies', 'same') - 0.05 });

  // ================================================================== 3 · perfect, every time
  const tPerf = wd('plan', 'perfect'), tAng = wd('plan', 'angles'), tSame = wd('copies', 'same');
  const passT = [0, 1, 2, 3].map((k) => tPerf - 0.12 + k * 0.62);
  passT.forEach((t, k) => { K.walker(fx, band.mid.pts, t, 0.5, { kind: 'blue', trail: 46, w: 1.2 }); X.sfx(t, 'blip', { gain: 0.08, pitch: 1 + k * 0.06 }); });
  K.liveText(fx, 820, 556, (t) => (t >= passT[0] && t < tSame - 0.05 ? 'PASS 0' + passT.filter((p) => t >= p).length : ''), { anchor: 'end', size: 20, ls: 4.6 });
  K.label(fx, 'DEVIATION 0.00 PX', 540, 1248, tPerf + 0.12, { size: 19, color: C.labelAmber, out: tSame - 0.05 });
  const prot = K.stroke(fx, K.cl.arc(284, 1129, 46, -Math.PI / 2, 0, 3), { kind: 'blue', w: 1.3, uw: 1.5 });
  K.anim(prot, tAng - 0.05, 0.32, 'draw', { ease: 'power2.inOut' });
  K.anim(prot, tSame - 0.05, 0.05, 'hide');
  tl.set(deg, { opacity: 0 }, tAng - 0.05);
  K.label(fx, '90.00°', 318, 1098, tAng + 0.12, { anchor: 'start', size: 20, color: C.labelBlue, out: tSame - 0.05 });
  K.anim(am, tSame - 0.05, 0.05, 'hide');

  // ================================================================== 4 · the same plan, poured in park after park (copies)
  const tLook = ln('look').start, tThis2 = wd('look', 'this'), tOne = we('look', 'one');
  const sym = X.svg('g', { id: 'tileSym' }, X.defs);
  X.svg('rect', { x: -280, y: -280, width: 560, height: 560, fill: C.tile, stroke: C.tileLine, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, sym);
  for (const o of [-12, 12]) X.svg('path', { d: `M${-268 + o},-280V${548 - 280 + o}H280`, fill: 'none', stroke: C.blueU, 'stroke-width': 1, 'vector-effect': 'non-scaling-stroke' }, sym);
  const I0 = 11, J0 = 17, PITCH = 640, tileList = [];
  for (let i = 0; i < 32; i++) for (let j = 0; j < 32; j++) {
    if (i === I0 && j === J0) continue;
    const u = X.svg('use', { href: '#tileSym', x: 540 + (i - I0) * PITCH, y: 873 + (j - J0) * PITCH }, tiles);
    u.style.opacity = 0; tileList.push({ u, k: Math.max(Math.abs(i - I0), Math.abs(j - J0)), o: 0 });
  }
  const GRID = { x: 540 + (15.5 - I0) * PITCH, y: 873 + (15.5 - J0) * PITCH, s: 0.0365 };
  K.camTo(tSame - 0.02, 2.3, { x: GRID.x, y: GRID.y, s: GRID.s, pin: [540, 873] }, 'power2.inOut');
  X.sfx(tSame - 0.02, 'woosh_low', { gain: 0.22, dur: 1.6 });
  let tileCount = 1;
  const tileFadeT = tThis2 + 0.02;
  K.every((t) => {
    const on = t > tSame - 0.1 && t < tThis2 + 0.4;
    if (!on) { if (tiles.style.display !== 'none') tiles.style.display = 'none'; return; }
    tiles.style.display = '';
    const s = K.cam.s, R = 560, fo = 1 - K.cl01((t - tileFadeT) / 0.16), st = K.cam;
    tiles.style.fillOpacity = (0.1 + 0.6 * K.cl01((0.3 - s) / 0.2)).toFixed(2);
    let n = 1;
    for (const T of tileList) {
      const v = K.cl01((R - T.k * PITCH * s) / 90);
      if (v > 0.5) n++;
      const ys = K.FOCUS.y + s * (+T.u.getAttribute('y') - st.y);
      const o = Math.round(v * fo * K.cl01((1380 - ys) / 130) * K.cl01((ys - 250) / 130) * 20) / 20;
      if (o !== T.o) { T.u.style.opacity = o; T.o = o; }
    }
    tileCount = n;
  });
  [0.3, 0.62, 0.88, 1.1, 1.3, 1.47, 1.62, 1.75, 1.86].forEach((d, k) => X.sfx(tSame + d, 'blip', { gain: 0.07, pitch: 0.9 + k * 0.07 }));
  K.liveText(HUD, 540, 1286, (t) => (t >= tSame + 0.15 && t < tThis2 ? tileCount.toLocaleString('en-US') : ''), { size: 36, ls: 2 });
  K.label(HUD, 'IDENTICAL PLANS', 540, 1322, tSame + 0.2, { size: 14, color: C.labelDim, out: tThis2 });
  K.label(HUD, '32 × 32', 540, 466, tSame + 1.95, { size: 18, color: C.labelDim, out: tThis2 });

  // ================================================================== 5 · but look at this one → zoom-through
  const brk = K.brackets(HUD, 0, 0, 46, 46, tLook + 0.12, { out: tThis2 + 0.28 });
  K.every((t) => {
    if (t < tLook || t > tThis2 + 0.6) return;
    const [x, y] = K.toScreen([540, 873], t), sz = Math.max(46, 560 * K.cam.s + 22);
    brk.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(sz / 46).toFixed(3)})`);
  });
  const lookLab = K.label(HUD, 'THIS ONE', 0, 0, tLook + 0.24, { anchor: 'end', size: 18, color: C.labelAmber, out: tThis2 + 0.1 });
  K.every((t) => { if (t < tLook || t > tThis2 + 0.2) return; const [x, y] = K.toScreen([540, 873], t); lookLab.setAttribute('x', (x - 40).toFixed(1)); lookLab.setAttribute('y', (y - 30).toFixed(1)); });
  K.camTo(tThis2 + 0.1, 0.46, { x: 540, y: 873, s: 0.94, pin: [540, 873] }, 'expo.inOut');
  K.camBlur(tThis2 + 0.12, 0.42, 3.5);
  X.sfx(tThis2 + 0.06, 'whoosh', { gain: 0.38, dur: 0.5 });
  K.tint(diag, tOne + 0.05, 0.5, 'amber');
  tl.to(lawn.querySelectorAll(':scope > g:not(:last-child)'), { opacity: 0.5, duration: 0.5 }, tOne + 0.05);

  // ================================================================== 6 · it cuts the corner — a diagonal is shorter
  const tCorner = wd('f1', 'corner'), tDiag = wd('f1', 'diagonal'), tShort = wd('f1', 'shorter'), tF2 = ln('f2').start;
  K.label(fx, 'a + b = 2.00', 540, 1206, tCorner + 0.05, { color: C.labelBlue, out: tF2 - 0.1 });
  tl.to(band, { opacity: 1, duration: 0.15, yoyo: true, repeat: 1 }, tCorner);
  const nUR = [Math.SQRT1_2, -Math.SQRT1_2];
  const A2 = [A[0] + nUR[0] * 44, A[1] + nUR[1] * 44], B2 = [B[0] + nUR[0] * 44, B[1] + nUR[1] * 44];
  const meas = K.stroke(fx, K.cl.line(A2, B2, 4), { kind: 'amber', w: 1.2, uw: 1.4, uo: 0.4, cap: 'butt' });
  const capA = K.stroke(fx, [[A2[0] - 7, A2[1] - 7], [A2[0] + 7, A2[1] + 7]], { kind: 'amber', w: 1.2, uw: 1.2, cap: 'butt' });
  const capB = K.stroke(fx, [[B2[0] - 7, B2[1] - 7], [B2[0] + 7, B2[1] + 7]], { kind: 'amber', w: 1.2, uw: 1.2, cap: 'butt' });
  K.anim(capA, tDiag - 0.15, 0.08, 'draw'); K.anim(meas, tDiag - 0.1, 0.38, 'draw', { ease: 'power2.inOut' }); K.anim(capB, tDiag + 0.26, 0.08, 'draw');
  [meas, capA, capB].forEach((g) => K.anim(g, tF2 - 0.1, 0.05, 'hide'));
  K.label(fx, 'c = √2 ≈ 1.41', 604, 792, tDiag + 0.12, { anchor: 'start', color: C.labelAmber, out: tF2 - 0.1 });
  K.label(fx, '−29 %', 672, 840, tShort + 0.02, { anchor: 'start', size: 30, color: C.labelAmber, out: tF2 - 0.1 });

  // ================================================================== 7 · it bends where the rain collects
  const tBends = wd('f2', 'bends'), tRain = wd('f2', 'rain'), tF3 = ln('f3').start;
  K.camTo(tBends - 0.2, 0.85, { x: 478, y: 808, s: 1.16 }, 'power2.inOut');
  K.ticks(fx, ref, diagPts, tBends - 0.04, { from: iu(0.2), to: iu(0.53), every: 5, amp: 3, out: tF3 - 0.06 });
  X.sfx(tBends - 0.04, 'tick', { gain: 0.12 });
  K.label(fx, 'BEND ×3', 690, 676, tBends + 0.1, { anchor: 'start', size: 20, out: tF3 - 0.06 });
  const pc = [494, 770];
  const puddle = X.svg('g', { transform: `rotate(-45 ${pc[0]} ${pc[1]})` }, fx);
  [[31, 16], [21, 10], [11, 5]].forEach(([rx, ry], k) => {
    const pr = K.stroke(puddle, K.hand(K.cl.arc(pc[0], pc[1], rx, -2.6, -2.6 + Math.PI * 2.04, 2.5, ry), { wob: 0.8, trem: 0.5, seed: 40 + k }), { kind: 'white', w: 1.1, uw: 1.4, uo: 0.35 });
    pr.style.opacity = 0.75 - k * 0.15;
    K.anim(pr, tRain - 0.1 + k * 0.09, 0.42, 'draw', { ease: 'power2.out' });
    K.anim(pr, ln('turn').start - 0.45, 0.3, 'fade');
  });
  [[-12, 4, 0.18], [10, -3, 0.5], [-2, 7, 0.82], [14, 5, 1.15]].forEach(([dx, dy, d]) => {
    K.ring(puddle, pc[0] + dx, pc[1] + dy, tRain + d, { r0: 1, r1: 9, color: C.white, dur: 0.6, sw: 1, op: 0.7 });
    X.sfx(tRain + d, 'drop', { gain: 0.07, pitch: 1.2 + dx / 40 });
  });
  K.label(fx, 'WET', 560, 724, tRain + 0.2, { anchor: 'start', size: 18, color: C.labelDim, out: tF3 - 0.06 });

  // ================================================================== 8 · wider where strangers stepped aside
  const tWider = wd('f3', 'wider'), tStr = wd('f3', 'strangers'), tAside = wd('f3', 'aside'), tPass = wd('f3', 'pass'), tN = ln('none').start;
  K.camTo(tWider - 0.12, 0.55, { x: 620, y: 945, s: 1.9 }, 'power2.inOut');
  X.sfx(tWider - 0.12, 'zoom_in', { gain: 0.16 });
  const ext = (p, d, k) => [p[0] + d[0] * k, p[1] + d[1] * k];
  const DIR = [Math.SQRT1_2, Math.SQRT1_2];
  const SPD = 2.5;                                   // seconds for one full crossing
  const w1Pts = [...K.cl.line(ext(A, DIR, -260), A, 6).slice(0, -1), ...diagPts, ...K.cl.line(B, ext(B, DIR, 260), 6).slice(1)];
  const w2Route = [...K.cl.line(ext(B, DIR, 260), B, 6).slice(0, -1), ...splitRoute.slice().reverse(), ...K.cl.line(A, ext(A, DIR, -260), 6).slice(1)];
  const meet = 0.66, wPre = 260 / (758 + 520);       // fraction of the route spent off the lawn
  const frac = (u) => wPre + u * (1 - 2 * wPre);
  K.walker(fx, w1Pts, tAside - frac(meet) * SPD, SPD, { trail: 60 });
  const w2t0 = tAside - frac(1 - meet) * SPD;
  K.walker(fx, w2Route, w2t0, SPD, { trail: 60 });
  X.sfx(tStr, 'swoosh', { gain: 0.1, dur: 0.6 });
  const strandPts = splitRoute.slice(iu(0.53), iu(0.79) + 1).reverse();
  const strand = K.stroke(lawn, strandPts, { kind: 'amber', w: 2.1, minScreenW: 1.8, steps: { spacing: 15, offset: 5, r: 1.7, seed: 6 } });
  K.anim(strand, w2t0 + frac(1 - 0.79) * SPD, (frac(1 - 0.53) - frac(1 - 0.79)) * SPD, 'draw', { ease: 'none' });
  const mi = iu(meet), pM = diagPts[mi], pS = splitRoute[mi];
  const wb = K.stroke(fx, [pM, pS], { kind: 'amber', w: 1.0, uw: 1.0, cap: 'butt' });
  K.anim(wb, tPass - 0.18, 0.15, 'draw'); K.anim(wb, tN - 0.08, 0.05, 'hide');
  K.label(fx, 'WIDTH ×2', pS[0] + 26, pS[1] - 22, tPass - 0.1, { anchor: 'start', size: 13, color: C.labelAmber, out: tN - 0.08 });

  // ================================================================== 9 · nobody planned it — the crowd
  const tPlanned = wd('none', 'planned'), tVoted = wd('none', 'voted'), tSteps = ln('steps').start;
  K.camTo(tN - 0.35, 0.85, { x: 540, y: 873, s: 0.86 }, 'power2.inOut');
  X.sfx(tN - 0.35, 'woosh_low', { gain: 0.2, dur: 0.8 });
  const w1Rev = w1Pts.slice().reverse();
  const crowd = [[-0.3, 0, 1.9], [-0.1, 1, 1.7], [0.12, 0, 2.1], [0.3, 1, 1.8], [0.5, 0, 1.6], [0.68, 1, 2.0], [0.86, 0, 1.8], [1.05, 1, 1.7], [1.22, 0, 1.9], [1.4, 1, 1.6], [1.58, 0, 1.8], [1.75, 1, 1.9], [1.95, 0, 1.7], [2.12, 1, 1.6]];
  crowd.forEach(([d, rev, dur], k) => { K.walker(fx, rev ? w1Rev : w1Pts, tN + d, dur, { trail: 54, r: 3.2 }); if (k % 3 === 0) X.sfx(tN + d + 0.3, 'swoosh', { gain: 0.05, dur: 0.5 }); });
  K.label(HUD, 'PLANNED BY  —', 540, 520, tPlanned - 0.02, { size: 20, out: tSteps - 0.06 });
  K.label(HUD, 'VOTES  0', 540, 556, tVoted - 0.02, { size: 20, out: tSteps - 0.06 });

  // ================================================================== 10 · each walker pressed the grass a little flatter
  const tWalker = wd('steps', 'walker'), tPressed = wd('steps', 'pressed'), tName = ln('name').start;
  const gr = X.rand(55), grass = X.svg('g', {}, lawn), near = [];
  const dist = (p) => { const v = [p[0] - A[0], p[1] - A[1]], u = (v[0] * DIR[0] + v[1] * DIR[1]) / 758; const q = diagPts[iu(Math.max(0, Math.min(1, u)))]; return [Math.hypot(p[0] - q[0], p[1] - q[1]), u]; };
  for (let gx = 0; gx < 17; gx++) for (let gy = 0; gy < 17; gy++) {
    const p = [TL[0] + 18 + gx * 32.5 + (gr() - 0.5) * 16, TL[1] + 18 + gy * 32.5 + (gr() - 0.5) * 16];
    const [dd, u] = dist(p);
    if (p[0] < 290 && p[1] > 580) continue;        // keep the paved band clear
    if (p[1] > 1120) continue;
    const ln2 = X.svg('line', { x1: p[0], y1: p[1], x2: p[0] + 1.6, y2: p[1] - 9, 'stroke-width': 1.3, 'stroke-linecap': 'round' }, grass);
    ln2.style.stroke = '#b7b0b4'; ln2.style.opacity = 0;
    const delay = Math.hypot(p[0] - 540, p[1] - 873) / 400 * 0.35;
    tl.to(ln2, { opacity: 0.32, duration: 0.25 }, tWalker - 0.1 + delay);
    if (dd < 20) near.push({ el: ln2, p, u, lean: 0 });
  }
  tl.to(grass, { opacity: 0.35, duration: 0.5 }, tName);
  tl.to(grass, { opacity: 0, duration: 0.35 }, ln('turn').start - 0.45);
  const passes = [tPressed - 0.35, tPressed + 0.45, tPressed + 1.2];
  passes.forEach((t0, k) => {
    K.walker(fx, w1Pts, t0, 1.35, { trail: 60 });
    K.width(diag, t0 + frac(0.5) * 1.35 - 0.2, 0.4, 2.6 + 0.55 * (k + 1));
    X.sfx(t0 + 0.4, 'tick', { gain: 0.06 });
  });
  K.every((t) => {
    if (t < passes[0] || t > tName + 1) return;
    for (const g of near) {
      let lv = 0;
      for (const t0 of passes) lv += K.cl01((t - (t0 + frac(g.u) * 1.35)) / 0.18);
      if (lv === g.lean) continue;
      g.lean = lv;
      const a = (lv / 3) * 72;
      g.el.setAttribute('transform', `rotate(${a.toFixed(1)} ${g.p[0]} ${g.p[1]})`);
      g.el.style.opacity = (0.32 - 0.22 * lv / 3).toFixed(3);
    }
  });
  // wear graph (HUD): staircase drawn by a tracer, one step per pass
  const gx0 = 300, gx1 = 780, gyB = 1238;
  const tSpan = [passes[0], passes[2] + 1.0], xs = (t) => gx0 + (gx1 - gx0) * (t - tSpan[0]) / (tSpan[1] - tSpan[0]);
  const stair = [[gx0, gyB]];
  passes.forEach((t0, k) => { const x = xs(t0 + frac(0.5) * 1.35); stair.push([x, gyB - k * 15], [x, gyB - (k + 1) * 15]); });
  stair.push([gx1, gyB - 45]);
  const stairPts = K.cl.poly(stair, 3);
  const wear = K.stroke(HUD, stairPts, { kind: 'amber', w: 1.6, uw: 1.8 });
  K.anim(wear, tSpan[0], tSpan[1] - tSpan[0], 'draw', { ease: 'none' });
  K.anim(wear, tName - 0.06, 0.05, 'hide');
  K.walker(HUD, stairPts, tSpan[0], tSpan[1] - tSpan[0], { trail: 1, w: 0.5, r: 3 });
  K.label(HUD, 'WEAR', gx0, 1182, tWalker, { anchor: 'start', size: 18, out: tName - 0.06 });
  K.label(HUD, '+1 / PASS', gx1, 1182, tWalker + 0.3, { anchor: 'end', size: 18, color: C.labelDim, out: tName - 0.06 });

  // ================================================================== 11 · planners have a name for it: desire paths
  const tNm = wd('name', 'name'), tDes = wd('name', 'desire'), tPaths = wd('name', 'paths'), tTurn = ln('turn').start;
  const mid = diagPts[iu(0.5)];
  const leader = K.stroke(fx, K.cl.poly([[mid[0] + 8, mid[1] - 8], [640, 700], [640, 578]], 3), { kind: 'amber', w: 1.2, uw: 1.3, uo: 0.4, cap: 'butt' });
  K.anim(leader, tNm - 0.05, 0.38, 'draw', { ease: 'power2.inOut' });
  K.anim(leader, tTurn - 0.5, 0.05, 'hide');
  K.label(fx, 'DESIRE PATH', 640, 546, tDes - 0.04, { size: 30, color: C.labelAmber, out: tTurn - 0.5 });
  K.label(fx, 'ALSO CALLED A DESIRE LINE', 640, 506, tPaths + 0.05, { size: 15, color: C.labelDim, out: tTurn - 0.5 });
  K.flare(fx, mid[0], mid[1], tPaths, { w: 760 });

  // ================================================================== 12 · that's the thing about people (line → person)
  const tPeople = wd('turn', 'people');
  K.ruledAnim(band, tTurn - 0.5, 0.42, 'undraw', { ease: 'power2.in' });
  K.anim(border, tTurn - 0.5, 0.42, 'undraw', { ease: 'power2.in' });
  K.anim(strand, tTurn - 0.5, 0.3, 'collapse', { ease: 'power2.in' });
  K.anim(diag, tTurn - 0.42, 0.55, 'collapse', { ease: 'power2.in' });
  X.sfx(tTurn - 0.45, 'blip_down', { gain: 0.14 });
  K.camTo(tTurn - 0.45, 0.6, { x: 540, y: 873, s: 1 }, 'power2.inOut');
  const fig1 = K.bust(Wd, 540, 700, { r: 58, seed: 21 });
  K.bustDraw(fig1, tTurn + 0.12, { headDur: 0.72, bodyDur: 0.62, enter: 0.35 });

  // ================================================================== 13 · we don't walk where we're told
  const tTh = ln('thesis').start, tTold = wd('thesis', 'told'), tMean = wd('thesis', 'mean'), tGo = wd('thesis', 'go');
  tl.to(fig1, { x: -170, y: -24, scale: 0.78, svgOrigin: '540 873', duration: 0.6, ease: 'power2.inOut' }, tTh - 0.12);
  X.sfx(tTh - 0.12, 'swoosh', { gain: 0.1 });
  const tgt = X.svg('g', {}, Wd);
  const tRing = K.stroke(tgt, K.hand(K.cl.circle(790, 640, 15, -1.6, 1.0, 2), { wob: 0.3, trem: 0.3, seed: 70 }), { kind: 'amber', w: 1.6, uw: 2 });
  K.anim(tRing, tTh + 0.35, 0.3, 'draw');
  const tDot = X.svg('circle', { cx: 790, cy: 640, r: 4, fill: C.amber }, tgt);
  X.pop(tDot, tTh + 0.55, { sfx: 'blip', gain: 0.12 });
  K.label(Wd, 'DESTINATION', 790, 600, tTh + 0.45, { size: 18, color: C.labelAmber, out: ln('close').start - 0.3 });
  const told = K.ruled(Wd, [[500, 948], [790, 948], [790, 666]], { gap: 18, minScreenW: 1.0 });
  K.ruledAnim(told, tTold - 0.5, 0.72, 'draw', { ease: 'power2.inOut' });
  K.walker(Wd, told.mid.pts, tTold - 0.5, 0.72, { kind: 'blue', trail: 20, w: 0.6, ease: 'power2.inOut' });
  X.sfx(tTold - 0.5, 'slide', { gain: 0.14, dur: 0.7 });
  const toldMark = K.angleMark(Wd, 778, 936, tTold + 0.15, { size: 13, dx: -1, dy: -1 });
  K.label(Wd, 'TOLD', 645, 984, tTold + 0.05, { size: 18, color: C.labelBlue, out: ln('close').start - 0.3 });
  const meantPts = K.hand(K.cl.bez([500, 905], [580, 860], [700, 700], [776, 653], 80), { wob: 2.2, trem: 1.0, seed: 81 });
  const meant = K.stroke(Wd, meantPts, { kind: 'amber', w: 2.5, minScreenW: 2, steps: { spacing: 15, offset: 6, r: 1.8, seed: 82 } });
  K.penDraw(meant, tMean - 0.25, 0.85, { enter: 0.3, exit: 0.45, ease: 'power1.inOut' });
  K.label(Wd, 'MEANT', 590, 752, tMean + 0.05, { size: 18, color: C.labelAmber, out: ln('close').start - 0.3 });
  tl.to(told, { opacity: 0.42, duration: 0.4 }, tGo);

  // ================================================================== 14 · a worn path is proof someone was here, and the next person agreed
  const tProof = wd('proof', 'proof'), tSomeone = wd('proof', 'someone'), tNext = wd('proof', 'next'), tAgreed = wd('proof', 'agreed');
  K.width(meant, tProof - 0.05, 0.3, 3.3);
  K.flare(Wd, 646, 772, tProof, { w: 520, sfx: false, ring: false, hold: 0.25 });
  X.sfx(tProof, 'sparkle', { gain: 0.16 });
  const h1 = [370, 717];
  K.ring(Wd, h1[0], h1[1], tSomeone, { r0: 48, r1: 120, color: C.amberU, dur: 0.9, sw: 1.4 });
  K.ring(Wd, h1[0], h1[1], tSomeone + 0.16, { r0: 48, r1: 92, color: C.amber, dur: 0.8, sw: 1 });
  K.flare(Wd, h1[0], h1[1], tSomeone + 0.02, { w: 640, ring: false, gain: 0.24 });
  K.camTo(tNext - 0.4, 0.6, { x: 478, y: 873, s: 1 }, 'power2.inOut');
  const fig2 = K.bust(Wd, 166, 815, { r: 36, seed: 31 });
  K.bustDraw(fig2, tNext - 0.3, { headDur: 0.42, bodyDur: 0.4, enter: 0.3, exit: 0.4 });
  K.walker(Wd, meantPts, tAgreed - 0.2, 0.95, { trail: 64 });
  K.ring(Wd, 500, 905, tAgreed - 0.2, { r0: 6, r1: 34, color: C.amberU, dur: 0.5 });
  K.width(meant, tAgreed + 0.3, 0.35, 4.0);
  K.label(Wd, '×2', 700, 805, tAgreed + 0.25, { size: 22, color: C.labelAmber, anchor: 'start', out: ln('close').start - 0.3 });
  K.ring(Wd, 790, 640, tAgreed + 0.72, { r0: 12, r1: 44, color: C.amberU, dur: 0.6 });

  // ================================================================== 15 · a plan can be copied anywhere — the reasons can't
  const tCopied = wd('copy', 'copied'), tReasons = wd('copy', 'reasons'), tCant = wd('copy', "can't"), tCl = ln('close').start;
  const scan = X.svg('g', {}, HUD);
  const scanLine = X.svg('rect', { x: 120, y: -1, width: 840, height: 2, fill: C.blue }, scan);
  X.svg('rect', { x: 120, y: -8, width: 840, height: 16, fill: C.blueU, opacity: 0.25 }, scan);
  gsap.set(scan, { opacity: 0 });
  tl.fromTo(scan, { y: 560, opacity: 0 }, { y: 1240, opacity: 1, duration: 0.95, ease: 'none', immediateRender: false }, tCopied - 0.35);
  tl.to(scan, { opacity: 0, duration: 0.1 }, tCopied + 0.6);
  X.sfx(tCopied - 0.35, 'slide', { gain: 0.18, dur: 0.9 }); void scanLine;
  const copies = [115, 230].map((dy, k) => {
    const c = K.ruled(Wd, [[440, 948 + dy], [790, 948 + dy], [790, 666 + dy]], { gap: 18, minScreenW: 1.0 });
    c.style.opacity = 0.8 - k * 0.2;
    const tReach = tCopied - 0.35 + 0.95 * ((666 + dy) - 560) / (1240 - 560);
    K.ruledAnim(c, tReach, 0.32, 'draw', { ease: 'power2.out' });
    X.sfx(tReach, 'shutter', { gain: 0.12 });
    return c;
  });
  K.label(Wd, 'COPY 1:1', 832, 1214, tCopied + 0.3, { anchor: 'end', size: 18, color: C.labelBlue, out: tCl - 0.3 });
  const reasons = [[370, 905, 'HOME', 952], [166, 930, 'A FRIEND', 972]], reasonDots = [];
  reasons.forEach(([x, y, txt, ly], k) => {
    const dot = X.svg('g', {}, Wd);
    X.svg('circle', { cx: x, cy: y, r: 16, fill: C.amberU, opacity: 0.22 }, dot);
    X.svg('circle', { cx: x, cy: y, r: 5.5, fill: '#fff3dc' }, dot);
    X.pop(dot, tReasons - 0.05 + k * 0.14, { sfx: 'sparkle', gain: 0.12, ease: 'back.out(3)' });
    reasonDots.push(dot);
    K.label(Wd, txt, x, ly, tReasons + 0.08 + k * 0.14, { size: 15, color: C.labelAmber, out: tCl - 0.3 });
  });
  K.label(Wd, 'REASON  —', 832, 1250, tCant - 0.05, { anchor: 'end', size: 18, color: C.labelBlue, out: tCl - 0.3 });
  tl.to(copies, { opacity: 0.15, duration: 0.08, yoyo: true, repeat: 3 }, tCant + 0.05);

  // ================================================================== 16 · straightest lines by planners, truest by people (the city)
  const tStraight = wd('close', 'straightest'), tCity = wd('close', 'city'), tPlanners = wd('close', 'planners'), tTruest = wd('close', 'truest'), tPeople2 = wd('close', 'people'), tCta = ln('cta').start;
  const S_CITY = 0.36;
  K.camTo(tCl - 0.4, 0.9, { x: 540, y: 873, s: S_CITY }, 'power2.inOut');
  X.sfx(tCl - 0.4, 'woosh_low', { gain: 0.24, dur: 0.9 });
  const tSt = Math.max(tStraight - 0.15, tCl + 0.2);
  const people = [fig1, fig2, tgt, told, meant, toldMark, ...copies, ...reasonDots];
  tl.to(people, { opacity: 0, duration: 0.6 }, tSt + 0.25);   // figures shrink with the camera, fade as the grid draws over them
  const city = X.svg('g', {}, Wd);
  const streets = [];
  [-420, 220, 860, 1500].forEach((x) => streets.push(K.ruled(city, [[x, -727], [x, 1833]], { gap: 30, w: 1.6, uw: 2, minScreenW: 1.6 })));
  [-727, -87, 553, 1193, 1833].forEach((y) => streets.push(K.ruled(city, [[-1000, y], [2080, y]], { gap: 30, w: 1.6, uw: 2, minScreenW: 1.6 })));
  streets.forEach((s, k) => { K.ruledAnim(s, tSt + k * 0.075, 0.42, 'draw', { ease: 'power2.inOut' }); });
  city.style.opacity = 0.78;
  [0, 3, 6].forEach((k) => X.sfx(tSt + k * 0.075, 'slide', { gain: 0.1, dur: 0.4 }));
  K.label(HUD, 'CITY GRID', 540, 262, tCity - 0.05, { size: 20, color: C.labelBlue, out: tCta - 0.3 });
  tl.fromTo(city, { opacity: 0.78 }, { opacity: 0.34, duration: 0.6, immediateRender: false }, tTruest - 0.1);
  // desire paths across the blocks (block corners ± 40 from street centres); the centre block gets the original line back
  const blk = (bx, by) => [[-420, 220, 860, 1500][bx] + 40, [-727, -87, 553, 1193][by] + 40];
  const cityPaths = [];
  const spec = [[0, 0, 0, 1], [1, 1, 1, 0], [2, 0, 0, 1], [0, 2, 1, 0], [2, 2, 0, 1], [1, 0, 1, 1], [0, 1, 0, 0], [2, 1, 1, 1], [1, 3, 0, 1], [0, 3, 1, 0], [2, 3, 0, 0]];
  spec.forEach(([bx, by, flip, bend], k) => {
    const o = blk(bx, by), sz = 560;
    const a = flip ? [o[0] + sz - 12, o[1] + 12] : [o[0] + 12, o[1] + 12], b = flip ? [o[0] + 12, o[1] + sz - 12] : [o[0] + sz - 12, o[1] + sz - 12];
    const pts = K.hand(K.cl.line(a, b, 8), { wob: 6, trem: 2.4, seed: 100 + k, offset: (u) => (bend ? 40 : -30) * Math.sin(Math.PI * u) });
    const s = K.stroke(city.parentNode, pts, { kind: 'amber', w: 2.3, uw: 2.8, minScreenW: 2.3, steps: { spacing: 15 / S_CITY * 0.6, offset: 6 / S_CITY * 0.7, r: 1.5 / S_CITY * 0.7, seed: 120 + k } });
    const t0 = tTruest - 0.15 + (k % 6) * 0.11 + Math.floor(k / 6) * 0.05;
    K.anim(s, t0, 1.05, 'draw', { ease: 'none' });
    K.walker(city.parentNode, pts, t0, 1.05, { trail: 1, w: 0.1, r: 3.4 / S_CITY });
    cityPaths.push(s);
  });
  X.sfx(tTruest - 0.15, 'scribble', { gain: 0.14, dur: 1.2 });
  // the centre block: the original worn line returns (pen-width kept on screen by minScreenW)
  K.tint(diag, tTruest - 0.3, 0.05, 'amber');
  K.width(diag, tTruest - 0.3, 0.05, 2.8);
  K.anim(diag, tTruest - 0.1, 1.05, 'draw', { ease: 'none' });
  K.walker(lawn, diagPts, tTruest - 0.1, 1.05, { trail: 1, w: 0.1, r: 3.4 / S_CITY });
  K.label(HUD, 'DRAWN BY PEOPLE', 540, 1270, tPeople2 - 0.35, { size: 20, color: C.labelAmber, out: tCta - 0.3 });
  K.flare(HUD, 540, 873, tPeople2 + 0.05, { w: 980, gain: 0.26 });

  // ================================================================== 17 · CTA, dissolve, and the pen loops back to frame one
  const tFollow = wd('cta', 'follow'), tNotice = wd('cta', 'noticing');
  K.camTo(tCta - 0.4, 0.8, { x: 540, y: 873, s: 1 }, 'power2.inOut');
  X.sfx(tCta - 0.4, 'zoom_in', { gain: 0.16 });
  tl.to(city, { opacity: 0, duration: 0.35 }, tCta - 0.4);
  tl.to(cityPaths, { opacity: 0, duration: 0.35 }, tCta - 0.4);
  K.flare(Wd, B[0], B[1], tFollow, { w: 700, gain: 0.3 });
  K.pill({ t: tFollow + 0.1, text: 'FOLLOW FOR MORE', icon: 'plus', tFlip: tNotice + 0.3, text2: 'WALK YOUR OWN LINE', icon2: 'check', tOut: DUR - 1.05 });
  K.anim(diag, DUR - 1.7, 0.65, 'dissolve');
  X.sfx(DUR - 1.7, 'sparkle', { gain: 0.14 });
  const loop = K.stroke(Wd, diagPts, DIAG);
  K.penDraw(loop, DUR - 0.25, 3.25, { enter: 0.62, exit: 0.6, ease: 'sine.inOut', sfx: false });

  await K.captions('script.json', { lastOut: DUR - 1.0 });
  K.finish();
  X.end(DUR);
});
