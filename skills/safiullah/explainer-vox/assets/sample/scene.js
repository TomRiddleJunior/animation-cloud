/* "The day of two noons" — a Vox-style annotated-evidence explainer (original; all evidence built in code).
 * Facts: railroads' standard time zones began 18 Nov 1883 (New York clocks set back ~4 min at noon); solar noon shifts
 * 4 min per degree of longitude; International Meridian Conference, Washington, Oct 1884 (25 nations) chose Greenwich;
 * the Standard Time Act made zones federal law in 1918. Clipping masthead, railroad and timetable are invented. */
X.boot(async (X) => {
  await X.loadVO();
  VK.init(X);
  const C = VK.C, tl = X.tl;
  const W = (id, w, n = 0) => X.word(id, w, n), L = (id) => X.line(id);
  const SERIF = "'Libre Baskerville', Georgia, serif", DISPLAY = "'Playfair Display', Georgia, serif", COND = "Oswald, 'Barlow Condensed', sans-serif";
  const pad2 = (n) => String(Math.round(n)).padStart(2, '0');

  // ---------------------------------------------------------------- evidence plates (rendered once per worker)
  const evT = EV.tower(), evF = EV.face(), evW = EV.watch(), evL = EV.loco(), evS = EV.station(), evP = EV.portico();
  const [imT, imF, imW, imL, imS, imP] = await Promise.all([
    VK.photo(evT.svg, { sat: 1.28, contrast: 1.08, vignette: 0.32, exposure: 0.9, warm: [1.08, 1.0, 0.9], cool: [0.9, 1.0, 1.12], seed: 1 }),
    VK.photo(evF.svg, { sat: 1.28, contrast: 1.1, vignette: 0.5, exposure: 0.86, warm: [1.08, 1.0, 0.88], cool: [0.92, 1.0, 1.08], seed: 2 }),
    VK.photo(evW.svg, { sat: 1.2, contrast: 1.12, vignette: 0.5, warm: [1.08, 1.0, 0.86], seed: 3 }),
    VK.photo(evL.svg, { mode: 'halftone', pitch: 6.5, contrast: 1.1, seed: 4 }),
    VK.photo(evS.svg, { sat: 1.28, contrast: 1.1, vignette: 0.46, exposure: 0.9, warm: [1.1, 1.0, 0.84], cool: [0.9, 1.0, 1.1], res: 1.3, seed: 5 }),
    VK.photo(evP.svg, { mode: 'mono', w: 800, h: 800, contrast: 1.15, tint: [1.0, 0.98, 0.95], vignette: 0.2, seed: 6 }),
  ]);

  // ---------------------------------------------------------------- timing (every cut sits on the narration)
  const tCut1 = 0.62, tCut2 = 1.25, tTower = 1.88;
  const tFace = W('noon', 'set') - 0.05;
  const tNews = L('known').start - 0.1;
  const tSting = L('known').end + 0.08;
  const tSlate = tSting + 0.3;
  const tStation = L('chaos').start - 0.15;
  const tMap = L('zones').start - 0.2;
  const tTime = L('meridian').start - 0.1;
  const tPhone = L('kicker').start - 0.12;
  const tCred = L('kicker').end + 0.55;
  const END = tCred + 3.45;

  X.svg('rect', { width: 1920, height: 1080, fill: C.ground });

  /** vector clock hands whose minute offset follows f(t) (minutes); h0/m0 = shown time at offset 0 */
  const liveHands = (parent, cx, cy, Lh, h0, m0, f, o = {}) => {
    const g = X.svg('g', { transform: `translate(${cx} ${cy})` }, parent);
    const mh = `M${-Lh * 0.035},${Lh * 0.16} L${-Lh * 0.02},${-Lh * 0.8} L0,${-Lh * 0.86} L${Lh * 0.02},${-Lh * 0.8} L${Lh * 0.035},${Lh * 0.16}Z`;
    const hh = `M${-Lh * 0.05},${Lh * 0.12} L${-Lh * 0.03},${-Lh * 0.42} L${-Lh * 0.075},${-Lh * 0.47} L0,${-Lh * 0.57} L${Lh * 0.075},${-Lh * 0.47} L${Lh * 0.03},${-Lh * 0.42} L${Lh * 0.05},${Lh * 0.12}Z`;
    const layers = [];
    if (o.shadow !== false) layers.push([X.svg('g', { transform: `translate(${Lh * 0.02} ${Lh * 0.03})`, opacity: 0.35, filter: 'url(#vkSoft)' }, g), '#000']);
    layers.push([X.svg('g', o.soft === false ? {} : { filter: 'url(#vkSoft)' }, g), o.ink ?? '#1E1B18']);
    const hands = layers.map(([lg, fill]) => [X.svg('path', { d: hh, fill }, lg), X.svg('path', { d: mh, fill }, lg)]);
    X.svg('circle', { r: Lh * 0.06, fill: o.ink ?? '#1E1B18' }, g);
    X.every((t) => {
      const m = m0 + f(t), am = m * 6, ah = (h0 % 12) * 30 + m * 0.5;
      for (const [hp, mp] of hands) { hp.setAttribute('transform', `rotate(${ah.toFixed(2)})`); mp.setAttribute('transform', `rotate(${am.toFixed(2)})`); }
    });
    return g;
  };
  /** small flat clock medallion (white face, slate ring) used on diagrams */
  const miniClock = (parent, cx, cy, r, h, m, f = () => 0) => {
    const g = X.svg('g', { transform: `translate(${cx} ${cy})` }, parent);
    const inner = X.svg('g', {}, g);
    X.svg('circle', { r, fill: C.white, stroke: C.ground, 'stroke-width': r * 0.12, filter: 'url(#vkShadowSm)' }, inner);
    for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180; X.svg('line', { x1: Math.sin(a) * r * 0.78, y1: -Math.cos(a) * r * 0.78, x2: Math.sin(a) * r * 0.64, y2: -Math.cos(a) * r * 0.64, stroke: C.ground, 'stroke-width': r * 0.06 }, inner); }
    liveHands(inner, 0, 0, r * 0.95, h, m, f, { shadow: false, soft: false, ink: C.ground });
    return { g, inner };
  };

  // ================================================================ 1. COLD OPEN — montage of evidence
  const sLoco = X.scene('s-loco', 0, tCut1, (g) => {
    const cam = VK.camera(g).cut(0, { s: 1.03, cx: 975, cy: 545 }, { rate: 0.003 });
    VK.image(cam.g, imL);
  });
  X.scene('s-watch', tCut1, tCut2, (g) => {
    const cam = VK.camera(g).cut(tCut1, { s: 1.05, cx: 1000, cy: 556 }, { rate: 0.003 });
    VK.image(cam.g, imW);
    X.sfx(tCut1, 'click', { gain: 0.12 });
  });
  X.scene('s-flash', tCut2, tTower, (g) => {
    const cam = VK.camera(g).cut(tCut2, { s: 1.75, cx: 960, cy: 400 }, { rate: 0.003 });
    VK.image(cam.g, imS, { w: 1920, h: 1080 });
    X.sfx(tCut2, 'click', { gain: 0.12 });
  });

  // ---------------------------------------------------------------- the clock tower, named
  X.scene('s-tower', tTower, tFace, (g, t0) => {
    const k = evT.clock;
    const cam = VK.camera(g).cut(t0, { s: 1.04, cx: 926, cy: 530 }, { rate: 0.0027 });
    VK.image(cam.g, imT);
    liveHands(cam.g, k.cx, k.cy, k.r, 11, 58, () => 0);
    const tc = W('hook', 'clocks');
    VK.ellipse(cam.g, tc - 0.18, { cx: k.cx + 4, cy: k.cy + 6, rx: 168, ry: 182, rot: -10, seed: 4 });
    VK.tag(cam.g, tc + 0.32, 'New York City', { x: 560, y: 668, rot: -4 });
    VK.subTag(cam.g, W('hook', 'strange') + 0.15, 'Nov. 18, 1883', { x: 760, y: 742, rot: -3 });
    X.sfx(t0, 'click', { gain: 0.12 });
  });

  // ---------------------------------------------------------------- close-up: noon, set back four minutes, noon again
  X.scene('s-face', tFace, tNews, (g, t0) => {
    const k = evF.clock;
    const cam = VK.camera(g).cut(t0, { s: 1.02, cx: 950, cy: 540 }, { rate: 0.0027 });
    VK.image(cam.g, imF);
    const tBack = W('noon', 'about') - 0.05, tFwd = W('noon', 'noon', 1) - 0.05;
    const minutes = VK.track(0, [[tBack, 0.8, -4, 'power2.inOut'], [tFwd, 0.85, 0, 'power1.inOut']]);
    liveHands(cam.g, k.cx, k.cy, k.r, 12, 0, minutes);
    for (let i = 0; i < 5; i++) X.sfx(tBack + i * 0.16, 'tick', { gain: 0.26, pitch: 1.3 });
    for (let i = 0; i < 5; i++) X.sfx(tFwd + i * 0.17, 'tick', { gain: 0.22, pitch: 1.15 });
    X.sfx(tFwd + 0.85, 'chime', { gain: 0.32, dur: 1.4 });
    // annotation: counter-clockwise arrow on the rim, value tag, then "noon again"
    const Rr = k.r * 0.925, a0 = -3, a1 = -40, pts = [];
    for (let i = 0; i <= 24; i++) { const a = ((a0 + (a1 - a0) * (i / 24)) * Math.PI) / 180; pts.push([k.cx + Math.sin(a) * Rr, k.cy - Math.cos(a) * Rr]); }
    const arc = X.svg('path', { d: VK.smooth(pts), fill: 'none', stroke: C.ellipse, 'stroke-width': 10, 'stroke-linecap': 'round' }, cam.g);
    VK.drawOn(arc, tBack, 0.6, 'power1.inOut');
    const e = pts[pts.length - 1], p2 = pts[pts.length - 3], ang = Math.atan2(e[1] - p2[1], e[0] - p2[0]);
    const hd = X.svg('path', { d: `M${e[0] + Math.cos(ang + 2.5) * 34},${e[1] + Math.sin(ang + 2.5) * 34} L${e[0]},${e[1]} L${e[0] + Math.cos(ang - 2.5) * 34},${e[1] + Math.sin(ang - 2.5) * 34}`, fill: 'none', stroke: C.ellipse, 'stroke-width': 10, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, cam.g);
    VK.drawOn(hd, tBack + 0.55, 0.12, 'power1.out');
    X.sfx(tBack, 'swoosh', { gain: 0.14, dur: 0.6 });
    VK.tag(cam.g, W('noon', 'four') - 0.05, '−4 minutes', { x: 300, y: 150, rot: -4, size: 58 });
    VK.subTag(cam.g, W('noon', 'second') - 0.05, 'Noon, again', { x: 1290, y: 930, rot: -3, size: 44 });
  });

  // ---------------------------------------------------------------- the clipping (document focus)
  X.scene('s-news', tNews, tSlate + 0.05, (g, t0) => {
    const cam = VK.camera(g).cut(t0, { s: 1.1, cx: 900, cy: 470, r: -0.6 }, { rate: 0.003, dx: 30, dy: 3 });
    const w = cam.g;
    const P = VK.plate(w, { x: 210, y: 60, w: 1500, h: 1260, shape: 'torn', seed: 8, jag: 9, color: '#EEE3CD', tex: 0.75, shadowId: 'vkShadowLg' });
    const b = P.body, mid = 750, ink = '#1E1C1A';
    const T = (x, y, text, o) => X.svg('text', { x, y, text, fill: ink, 'font-family': o.family ?? SERIF, 'font-size': o.size, 'font-weight': o.weight ?? 400, 'font-style': o.style ?? 'normal', 'text-anchor': o.anchor ?? 'start', 'letter-spacing': o.ls ?? 0, filter: 'url(#vkInk)' }, b);
    T(mid, 180, 'The Evening Meridian', { family: DISPLAY, size: 104, weight: 900, anchor: 'middle' });
    X.svg('rect', { x: 60, y: 214, width: 1380, height: 3, fill: ink }, b); X.svg('rect', { x: 60, y: 222, width: 1380, height: 7, fill: ink }, b);
    T(70, 262, 'NEW YORK, SATURDAY, NOVEMBER 17, 1883.', { size: 22, ls: 1.5 });
    T(1430, 262, 'PRICE TWO CENTS.', { size: 22, ls: 1.5, anchor: 'end' });
    X.svg('rect', { x: 60, y: 282, width: 1380, height: 3, fill: ink }, b);
    const H = 'TWO NOONS TOMORROW', hs = 136, hw = VK.measure(H, hs, 700, COND), hx = mid - hw / 2;
    T(mid, 438, H, { family: COND, size: hs, weight: 700, anchor: 'middle', ls: 0 });
    const D1 = 'City clocks to be set back nearly four minutes', D2 = 'as the railroads adopt standard time', ds = 42;
    T(mid, 512, D1, { size: ds, style: 'italic', anchor: 'middle' });
    T(mid, 566, D2, { size: ds, style: 'italic', anchor: 'middle' });
    X.svg('rect', { x: mid - 120, y: 600, width: 240, height: 3, fill: ink }, b);
    const body = [
      'At twelve o\'clock by the sun, the public', 'clocks of this city will be turned back', 'nearly four minutes, and the hour of noon', 'will be struck a second time by the time',
      'of the seventy-fifth meridian. Jewellers', 'and the observatory will give the new', 'signal to all who wish to correct their', 'watches. From that hour the railroads of',
      'the East will run their trains by one', 'standard, and the many local times now', 'printed in the time-tables will be', 'retired. Cities to the west will keep',
      'the hour of the ninetieth meridian, and', 'beyond them the hours of the hundred and', 'fifth and the hundred and twentieth.', 'Each section differs from the next by one',
      'full hour. Travellers are advised to', 'set their watches by the station clock,', 'and to read the new tables with care.', 'The sun, it is said, will not be consulted.',
    ];
    const cols = [70, 530, 990], lh = 34;
    cols.forEach((cx, c) => { for (let r = 0; r < 16; r++) T(cx, 660 + r * lh, body[(c * 7 + r) % body.length], { size: 19.5 }); });
    for (const x of [505, 965]) X.svg('rect', { x, y: 636, width: 2, height: 560, fill: ink, opacity: 0.6 }, b);
    // highlights land on the spoken words; then the rest dims to ~40 %
    const pre = (s, k, size, fam, wt, st) => VK.measure(s.slice(0, k), size, wt, fam, st);
    const twoNoons = VK.measure('TWO NOONS', hs, 700, COND);
    VK.highlight(b, W('known', 'two') - 0.12, { x: hx - 8, y: 438 - hs * 0.8, w: twoNoons + 14, h: hs * 0.86, dur: 0.5 });
    const d2w = VK.measure(D2, ds, 400, SERIF, 'italic'), d2x = mid - d2w / 2, k0 = D2.indexOf('the railroads'), k1 = D2.length;
    const hx2 = d2x + pre(D2, k0, ds, SERIF, 400, 'italic'), hw2 = VK.measure(D2.slice(k0, k1), ds, 400, SERIF, 'italic');
    VK.highlight(b, W('known', 'railroads') - 0.32, { x: hx2 - 6, y: 566 - ds * 0.82, w: hw2 + 12, h: ds * 1.08, dur: 0.55 });
    X.sfx(t0, 'paper', { gain: 0.3 });
  });

  // ================================================================ 2. MECHANISM — slate ground: local noon → scale-chase chart
  X.scene('s-slate', tSlate, tStation, (g, t0) => {
    const fade = X.svg('g', {}, g);
    X.svg('rect', { x: -2000, y: -2000, width: 6000, height: 6000, fill: C.ground }, fade);
    const cam = VK.camera(fade).cut(t0, { s: 1.0, cx: 960, cy: 520 }, { rate: 0.0026 });
    // --- paper card: three towns, three local times, the sun at its highest
    const CX = 260, CY = 150, CW = 1400, CH = 660, base = 575;
    const card = VK.plate(cam.g, { x: CX, y: CY, w: CW, h: CH, color: C.paperCool, rx: 4 });
    VK.fadeIn(card.g, tSting + 0.75, 0.4);
    const cid = VK.uid('cardclip'), cp = X.svg('clipPath', { id: cid }, X.defs);
    X.svg('rect', { width: CW, height: CH }, cp);
    const inCard = X.svg('g', { 'clip-path': `url(#${cid})` }, card.body);
    const towns = [260, 700, 1140], offs = [-12, 0, 12];
    const tSlideA = W('slide', 'noon') - 0.15, tSlideB = W('slide', 'west') + 0.35;
    const shift = VK.track(0, [[tSlideA, tSlideB - tSlideA, -440, 'power2.inOut']]);
    const tickOn = VK.track(0, [[tSlideA, tSlideB - tSlideA, 12, 'power2.inOut']]);
    // sun arc + sun (moves as one group, clipped to the card)
    const sunG = X.svg('g', {}, inCard);
    const arcPts = []; for (let i = 0; i <= 40; i++) { const a = Math.PI - (Math.PI * i) / 40; arcPts.push([700 + 430 * Math.cos(a), base - 410 * Math.sin(a)]); }
    const arc = X.svg('path', { d: VK.smooth(arcPts), fill: 'none', stroke: C.ground, 'stroke-opacity': 0.45, 'stroke-width': 4, 'stroke-dasharray': '4 14', 'stroke-linecap': 'round' }, sunG);
    VK.fadeIn(arc, t0 + 0.5, 0.5);
    const sun = X.svg('g', {}, sunG);
    X.svg('circle', { r: 40, fill: C.orangeDeep }, sun);
    for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180; X.svg('line', { x1: Math.cos(a) * 54, y1: Math.sin(a) * 54, x2: Math.cos(a) * 70, y2: Math.sin(a) * 70, stroke: C.orangeDeep, 'stroke-width': 7, 'stroke-linecap': 'round' }, sun); }
    const tRise = L('before').start + 0.1, tTop = W('before', 'highest');
    const sunA = VK.track(172, [[tRise, tTop - tRise, 90, 'power1.out']]);
    X.every((t) => {
      const a = (sunA(t) * Math.PI) / 180;
      sun.setAttribute('transform', `translate(${(700 + 430 * Math.cos(a)).toFixed(1)} ${(base - 410 * Math.sin(a)).toFixed(1)})`);
      sunG.setAttribute('transform', `translate(${shift(t).toFixed(1)} 0)`);
    });
    VK.fadeIn(sun, tRise - 0.3, 0.3);
    VK.ellipse(sunG, tTop - 0.2, { cx: 700, cy: base - 410, rx: 98, ry: 92, rot: -8, seed: 7, width: 8 });
    VK.tag(sunG, tTop + 0.18, 'Local noon', { x: 820, y: base - 440, rot: -4, size: 46 });
    // horizon + towns (each with a steeple and its own clock)
    X.svg('rect', { x: 0, y: base, width: CW, height: CH - base, fill: C.ground, opacity: 0.9 }, inCard);
    towns.forEach((x, i) => {
      const R = X.rand(30 + i); let d = `M${x - 200},${base}`, cx = x - 200;
      while (cx < x + 200) { const w = 44 + R() * 36, h = 46 + R() * 54, rf = 18 + R() * 22; d += `L${cx.toFixed(0)},${(base - h).toFixed(0)}L${(cx + w / 2).toFixed(0)},${(base - h - rf).toFixed(0)}L${(cx + w).toFixed(0)},${(base - h).toFixed(0)}`; cx += w; }
      d += `L${cx.toFixed(0)},${base}Z`;
      X.svg('path', { d, fill: C.ground }, inCard);
      X.svg('path', { d: `M${x - 30},${base} V${base - 175} L${x},${base - 290} L${x + 30},${base - 175} V${base}Z`, fill: C.ground }, inCard);
      const mc = miniClock(inCard, x + 130, base - 225, 44, 12, offs[i], tickOn);
      X.pop(mc.inner, W('before', 'own') - 0.1 + i * 0.12, { dur: 0.25, ease: 'back.out(1.6)', gain: 0.16 });
    });
    // --- the chart (below the card in world space; camera travels down to it)
    // linear travel (a truck, not a whip): the card leaves frame gradually, so it reads as one continuous set
    const tDown = tSlideB + 0.05;
    cam.move(tDown, 2.6, { cy: 1560, cx: 960 }, 'none');
    X.sfx(tDown, 'woosh_low', { gain: 0.22, dur: 2.0 });
    const lon = { Chicago: 87.63, Indianapolis: 86.16, Cincinnati: 84.51, Columbus: 83.0, Pittsburgh: 80.0, Harrisburg: 76.88, Philadelphia: 75.17, 'New York': 74.01, Boston: 71.06 };
    const data = Object.entries(lon).map(([name, l]) => ({ x: +(87.63 - l).toFixed(2), y: +((87.63 - l) * 4).toFixed(1), label: name, labelDy: ['Indianapolis', 'Columbus', 'New York'].includes(name) ? 32 : 0 }));
    const fmt = (v) => { const m = Math.round(v), h = 12 + Math.floor(m / 60); return `${h > 12 ? h - 12 : h}:${pad2(m % 60)}`; };
    const tDraw = tDown + 1.15;
    const ch = VK.chart(cam.g, { areaOp: 0.42, x: 360, y: 1320, w: 1280, h: 500, data, t0: tDraw, dur: 2.7, yMaxStart: 6, fmtY: fmt, steps: [1, 2, 5, 10, 15, 20, 30],
      title: 'Local sun time when it was noon in Chicago', source: 'Source: computed from each city’s longitude (1° = 4 minutes)' });
    VK.text(cam.g, 1640, 1320 + 500 + 112, 'degrees of longitude east of Chicago →', { size: 24, weight: 400, style: 'italic', fill: C.grey, anchor: 'end' });
    const ease = gsap.parseEase('power1.inOut'), xMax = data[data.length - 1].x;
    data.forEach((dp, i) => { let lo = 0, hi = 1; for (let k = 0; k < 20; k++) { const m = (lo + hi) / 2; if (ease(m) * xMax < dp.x) lo = m; else hi = m; } X.sfx(tDraw + lo * 2.7, 'blip', { gain: 0.1, pitch: 1 + i * 0.04 }); });
    VK.chip(cam.g, W('slide', 'degree') + 0.05, '1° = 4 min', { x: 640, y: 1395, fill: C.sage, size: 36 });
    const pc = ch.pt(0), pp = ch.pt(4);
    VK.tag(cam.g, W('pitt', 'Chicago') - 0.05, 'Chicago: noon', { x: pc[0] + 16, y: pc[1] - 64, rot: -4, size: 40 });
    VK.ellipse(cam.g, W('pitt', 'Pittsburgh') - 0.3, { cx: pp[0], cy: pp[1], rx: 62, ry: 54, rot: -8, seed: 12, width: 7 });
    VK.tag(cam.g, W('pitt', 'Pittsburgh') + 0.05, 'Pittsburgh: 12:30', { x: pp[0] - 60, y: pp[1] - 112, rot: -4, size: 44 });
  });

  // ================================================================ 3. THE PROBLEM — one clock per railroad
  X.scene('s-station', tStation, tMap + 0.6, (g, t0) => {
    const cam = VK.camera(g).cut(t0, { s: 1.03, cx: 960, cy: 552 }, { rate: 0.0027 });
    VK.image(cam.g, imS);
    X.sfx(t0, 'click', { gain: 0.14 });
    const tPush = W('chaos', 'railroads') - 0.15;
    cam.move(tPush, 1.15, { s: 1.3, cy: 440 });
    X.sfx(tPush, 'woosh_low', { gain: 0.22, dur: 0.9 });
    const names = [['Philadelphia time', C.orange], ['Pittsburgh time', C.sage], ['Columbus time', C.orange]];
    evS.clocks.forEach((c, i) => {
      VK.ellipse(cam.g, W('clocks', 'railroad') - 0.1 + i * 0.28, { cx: c.cx, cy: c.cy, rx: c.r + 42, ry: c.r + 36, rot: -8 + i * 5, seed: 20 + i, width: 7, gain: 0.12 });
      VK.tag(cam.g, W('clocks', 'separate') - 0.05 + i * 0.3, names[i][0], { x: c.cx, y: c.cy + 150 + (i % 2) * 16, anchor: 'middle', rot: -4, size: 34, fill: names[i][1] });
    });
  });

  // ================================================================ 4. THE FIX — four zones, measured from Greenwich
  X.scene('s-map', tMap, tPhone, (g, t0) => {
    const fade = X.svg('g', {}, g);
    VK.fadeIn(fade, t0, 0.5);
    X.svg('rect', { x: -4000, y: -4000, width: 12000, height: 10000, fill: C.ground }, fade);
    const cam = VK.camera(fade).cut(t0, { s: 1.0, cx: 960, cy: 545 }, { rate: 0.0025 });
    X.sfx(t0, 'woosh_low', { gain: 0.3, dur: 0.7 });
    const K = 30, CL = Math.cos((38 * Math.PI) / 180), px = (lo) => 960 + (lo + 96) * K * CL, py = (la) => 540 - (la - 38) * K;
    const poly = (pts) => 'M' + pts.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`).join('L') + 'Z';
    const US = [[-124.7, 48.4], [-122.8, 49], [-95.2, 49], [-94.6, 48.7], [-93, 48.6], [-91.5, 48.1], [-89.6, 48], [-88.4, 47.3], [-86.5, 46.6], [-84.6, 46.5], [-83.6, 45.8], [-82.5, 45.3], [-82.4, 43], [-83.1, 42.1], [-82.4, 41.7], [-79, 42.8], [-79.2, 43.5], [-76.5, 43.6], [-75.3, 44.8], [-74.7, 45], [-71.5, 45], [-70.7, 45.4], [-70, 46.7], [-69.2, 47.45], [-68.2, 47.3], [-67.8, 47.1], [-67.8, 45.7], [-67, 44.9], [-68.2, 44.3], [-69.8, 43.8], [-70.6, 43.1], [-70.8, 42.5], [-70, 41.8], [-70.5, 41.5], [-71.4, 41.4], [-72.9, 41.25], [-73.7, 40.85], [-74, 40.6], [-74.1, 40], [-74.4, 39.4], [-74.95, 38.93], [-75.1, 38.6], [-75.2, 38], [-75.9, 37.2], [-76, 36.9], [-75.9, 36.5], [-75.5, 35.3], [-76.5, 34.7], [-77.9, 33.9], [-79.2, 33.2], [-80, 32.6], [-81.1, 32], [-81.4, 30.9], [-81.3, 29.9], [-80.6, 28.4], [-80.1, 26.9], [-80.1, 25.8], [-80.4, 25.2], [-81.1, 25.1], [-81.7, 25.9], [-82.2, 26.7], [-82.6, 27.5], [-82.8, 28.2], [-83.7, 29.9], [-84.4, 29.9], [-85.4, 29.7], [-86.5, 30.4], [-88, 30.4], [-89.4, 30.2], [-89.6, 29.3], [-89.2, 29], [-90.2, 29.1], [-91.3, 29.3], [-92.5, 29.6], [-93.8, 29.7], [-94.8, 29.3], [-96.4, 28.4], [-97.2, 27.6], [-97.4, 26], [-98.3, 26.1], [-99.1, 26.4], [-99.5, 27.5], [-100.3, 28.3], [-101, 29.4], [-102.4, 29.8], [-103.1, 29], [-104, 29.4], [-104.7, 30.1], [-106.5, 31.8], [-108.2, 31.8], [-108.2, 31.33], [-111.1, 31.33], [-114.8, 32.5], [-114.7, 32.7], [-117.1, 32.5], [-117.3, 33], [-118.3, 33.7], [-118.9, 34], [-120.6, 34.5], [-120.7, 35.2], [-121.9, 36.6], [-122.5, 37.6], [-123, 38], [-123.7, 39], [-124.4, 40.4], [-124.2, 41.8], [-124.5, 42.8], [-124, 44.6], [-123.9, 46.2], [-124.1, 47]];
    const GB = [[-5.7, 50.05], [-4.2, 50.35], [-3.5, 50.6], [-2, 50.6], [-1.1, 50.75], [0.3, 50.75], [1, 51], [1.4, 51.4], [0.9, 51.7], [1.75, 52.6], [1.3, 52.95], [0.3, 53], [0, 53.6], [-0.6, 54.5], [-1.3, 54.9], [-1.6, 55.6], [-2.1, 55.9], [-2.6, 56.05], [-2.6, 56.3], [-1.8, 57.5], [-3.3, 57.7], [-4, 57.6], [-3, 58.6], [-5, 58.6], [-5.6, 57.6], [-5.9, 56.8], [-5.6, 56], [-5.7, 55.3], [-4.9, 55.7], [-5, 54.85], [-3.6, 54.9], [-3.2, 54.4], [-3, 53.9], [-3, 53.4], [-4.2, 53.3], [-4.6, 52.8], [-4.1, 52.4], [-5.2, 51.8], [-4.2, 51.6], [-3.2, 51.4], [-2.7, 51.5], [-3.4, 51.2], [-4.5, 51], [-5, 50.6]];
    const IE = [[-6.2, 53.3], [-6, 54], [-5.5, 54.6], [-6.3, 55.25], [-7.3, 55.35], [-8.3, 55.15], [-8.6, 54.6], [-10, 54.2], [-10.1, 53.4], [-9.2, 53.1], [-9.9, 52.6], [-10.4, 52.1], [-9.8, 51.6], [-9.5, 51.45], [-8.5, 51.6], [-7, 52.1], [-6.4, 52.2]];
    const EU = [[-1.8, 43.4], [-1.2, 44.6], [-1.1, 45.6], [-2.2, 47.1], [-4.5, 47.8], [-4.8, 48.4], [-3, 48.8], [-1.6, 48.7], [-1.9, 49.7], [-1.2, 49.4], [0.1, 49.5], [1.6, 50.2], [1.6, 50.9], [2.5, 51.1], [3.6, 51.4], [4.2, 52], [4.7, 52.9], [6, 53.4], [8, 53.6], [9, 54], [8.6, 55.5], [8.1, 56.6], [10, 57.6], [14, 57], [14, 36], [-5.6, 36], [-6.3, 36.8], [-7.4, 37.2], [-8.9, 37], [-8.8, 38.5], [-9.5, 38.7], [-8.9, 41], [-8.9, 42.1], [-9.3, 43], [-8, 43.7], [-5.8, 43.6], [-3.8, 43.45]];
    const land = X.svg('g', {}, cam.g);
    for (const pts of [EU, IE, GB]) { X.svg('path', { d: poly(pts), fill: C.paper, filter: 'url(#vkShadowSm)' }, land); X.svg('path', { d: poly(pts), fill: 'url(#vkPaper)', opacity: 0.6, style: { mixBlendMode: 'multiply' } }, land); }
    const usD = poly(US), clipId = VK.uid('us'), cp = X.svg('clipPath', { id: clipId }, X.defs);
    X.svg('path', { d: usD }, cp);
    X.svg('path', { d: usD, fill: C.paper, filter: 'url(#vkShadow)' }, land);
    const zonesG = X.svg('g', { 'clip-path': `url(#${clipId})` }, land);
    // wobbly zone boundaries (real lines followed railroad division points, not meridians)
    const R = X.rand(77), bounds = [-112.5, -97.5, -82.5].map((lo) => { const pts = []; for (let la = 50; la >= 23.5; la -= 1.3) pts.push([lo + (R() - 0.5) * 1.6, la]); return pts; });
    const edge = (pts) => pts.map(([lo, la]) => `${px(lo).toFixed(1)},${py(la).toFixed(1)}`);
    const bandD = (a, b) => 'M' + edge(a).join('L') + 'L' + edge(b.slice().reverse()).join('L') + 'Z';
    const left = [[-130, 50], [-130, 23.5]], right = [[-60, 50], [-60, 23.5]];
    const B = [left, ...bounds, right], zoneFill = ['#C4DCE0', '#F0D9C0', '#C4DCE0', '#F0D9C0'];
    const zoneEls = zoneFill.map((fill, i) => X.svg('path', { d: bandD(B[i], B[i + 1]), fill, opacity: 0 }, zonesG));
    X.svg('path', { d: usD, fill: 'url(#vkPaper)', opacity: 0.6, style: { mixBlendMode: 'multiply' } }, land);
    const tZones = W('zones', 'four') - 0.1;
    zoneEls.forEach((z, i) => tl.fromTo(z, { opacity: 0 }, { opacity: 1, duration: 0.3, ease: 'none', immediateRender: false }, tZones + (3 - i) * 0.1));
    bounds.forEach((pts, i) => { const p = X.svg('path', { d: 'M' + edge(pts).join('L'), fill: 'none', stroke: C.ground, 'stroke-width': 4, 'stroke-linejoin': 'round' }, zonesG); VK.drawOn(p, tZones + (2 - i) * 0.1, 0.45, 'power2.out'); });
    X.sfx(tZones, 'slide', { gain: 0.2 });
    const zoneNames = ['PACIFIC', 'MOUNTAIN', 'CENTRAL', 'EASTERN'], centers = [-119, -105, -90, -77.5], hours = [9, 10, 11, 12];
    centers.forEach((lo, i) => {
      const lab = VK.text(land, i === 3 ? px(-75.5) : px(lo), 925, zoneNames[i], { size: 30, weight: 800, anchor: 'middle', fill: C.white, ls: 3 });
      VK.fadeIn(lab, tZones + 0.15 + (3 - i) * 0.1, 0.25);
      const mc = miniClock(land, px(lo), 150, 50, hours[i], 0);
      X.pop(mc.inner, W('zones', 'one') - 0.08 + (3 - i) * 0.12, { dur: 0.26, ease: 'back.out(1.6)', gain: 0.18 });
    });
    // pull back: the zones are hours behind Greenwich
    const gx = px(0), gy = py(51.48), tOut = W('zones', 'measured') - 0.12;
    cam.move(tOut, 1.15, { s: 0.55, cx: 1790, cy: 430 });
    X.sfx(tOut, 'zoom_out', { gain: 0.3, dur: 1.1 });
    const mer = X.svg('line', { x1: gx, x2: gx, y1: -420, y2: 1300, stroke: C.grey, 'stroke-width': 5, 'stroke-dasharray': '18 16', opacity: 0 }, cam.g);
    VK.fadeIn(mer, tOut + 0.3, 0.4);
    const merL = VK.text(cam.g, gx + 24, 1240, '0°', { size: 60, weight: 800, fill: C.grey });
    VK.fadeIn(merL, tOut + 0.4, 0.4);
    const gLayer = X.svg('g', {}, cam.g);
    const gdot = X.svg('circle', { cx: gx, cy: gy, r: 22, fill: C.orange, stroke: C.white, 'stroke-width': 6 }, gLayer);
    X.pop(gdot, W('zones', 'Greenwich') - 0.15, { dur: 0.25, ease: 'back.out(1.6)', gain: 0.2 });
    VK.tag(gLayer, W('zones', 'Greenwich') - 0.02, 'Greenwich', { x: gx - 190, y: py(35), anchor: 'end', rot: -4, size: 92 });
    VK.arrow(gLayer, W('zones', 'England') - 0.05, { from: [gx - 60, gy + 40], to: [px(-74), py(41) - 40], bend: 0.18, width: 14, head: 46, dur: 0.6 });
    [5, 6, 7, 8].forEach((hrs, i) => { const t = VK.text(cam.g, px(-75 - 15 * i), 990, `−${hrs} h`, { size: 64, weight: 800, anchor: 'middle', fill: C.orange }); VK.fadeIn(t, W('zones', 'England') + 0.1 + i * 0.1, 0.3); });
    // back in: inside a zone every clock agrees; cross a line and the time jumps an hour
    const tIn = L('agree').start - 0.45;
    cam.move(tIn, 1.0, { s: 1.0, cx: 1010, cy: 548 });
    VK.fadeOut(gLayer, tIn, 0.4);
    X.sfx(tIn, 'zoom_in', { gain: 0.26, dur: 0.9 });
    const dimD = [0, 1, 3].map((i) => bandD(B[i], B[i + 1]));
    const dims = dimD.map((d) => X.svg('path', { d, fill: C.ground, opacity: 0 }, zonesG));
    const tDim = W('agree', 'zone') - 0.1;
    dims.forEach((d) => tl.fromTo(d, { opacity: 0 }, { opacity: 0.55, duration: 0.35, ease: 'sine.inOut', immediateRender: false }, tDim));
    const cities = [['Chicago', -87.63, 41.88, 14, 40, C.ground], ['St. Louis', -90.2, 38.63, 18, 9, C.ground], ['New Orleans', -90.07, 29.95, 18, 12, C.white]];
    cities.forEach(([n, lo, la, dx, dy, col], i) => {
      const t = W('agree', 'every') - 0.05 + i * 0.14;
      const dot = X.svg('circle', { cx: px(lo), cy: py(la), r: 9, fill: C.ground }, land);
      X.pop(dot, t, { dur: 0.2, sfx: false });
      VK.chip(land, t + 0.05, '11:00', { x: px(lo) - 70, y: py(la) - 2, fill: C.ground, size: 30, sfx: 'blip' });
      const nm = VK.text(land, px(lo) + dx, py(la) + dy, n, { size: 26, weight: 800, fill: col });
      VK.fadeIn(nm, t + 0.05, 0.2);
    });
    const tCross = W('agree', 'Cross') - 0.1;
    tl.fromTo(dims[2], { opacity: 0.55 }, { opacity: 0, duration: 0.35, ease: 'sine.inOut', immediateRender: false }, tCross);
    const pit = [px(-80.0), py(40.44)];
    const pdot = X.svg('circle', { cx: pit[0], cy: pit[1], r: 9, fill: C.ground }, land);
    X.pop(pdot, tCross + 0.4, { dur: 0.2, sfx: false });
    VK.arrow(cam.g, tCross, { from: [px(-87.63) + 6, py(41.88) - 22], to: [pit[0] - 12, pit[1] - 16], bend: -0.5, width: 8, head: 26, dur: 0.55 });
    VK.chip(land, W('agree', 'jumped') - 0.15, '12:00', { x: pit[0] + 72, y: pit[1] + 4, fill: C.orangeDeep, size: 30 });
    const pn = VK.text(land, pit[0], pit[1] + 46, 'Pittsburgh', { size: 26, weight: 800, fill: C.ground, anchor: 'middle' });
    VK.fadeIn(pn, tCross + 0.4, 0.2);
    VK.tag(cam.g, W('agree', 'jumped') + 0.05, '+1 hour', { x: pit[0] - 30, y: pit[1] - 120, rot: -4, size: 50 });

    // ============================================================== 5. TIMELINE — same ground, below the map: 1883 → 1884 → 1918
    // (a long camera move down into a new set instead of a cut: one continuous graphic sequence, as Vox builds them)
    const mapG = X.svg('g', {}, null);
    while (cam.g.firstChild) mapG.appendChild(cam.g.firstChild);
    cam.g.appendChild(mapG);
    const OY = 1150, tg = X.svg('g', { transform: `translate(0 ${OY})` }, cam.g);
    const tM = tTime - 0.75, tP = tM + 2.6, TRUCK = 8;
    cam.hold(tM, { rate: 0 });
    cam.move(tM, 2.6, { s: 1.25, cx: 560, cy: 520 + OY }, 'none');
    VK.fadeOut(mapG, tP + 0.3, 0.3);
    cam.push(tP, { rate: 0.0026, dx: TRUCK });
    X.sfx(tM, 'whoosh', { gain: 0.24, dur: 1.4 });
    const AY = 640, ax = VK.axis(tg, { x0: 0, y: AY, from: 1878, to: 1922, px: 90, every: 5, size: 30 });
    const Xy = ax.X;
    // 1883 — with a cut-out of the evidence pinned beside it
    const ev = VK.plate(tg, { x: 34, y: 286, w: 372, h: 214, shape: 'torn', seed: 5, jag: 6, color: '#E9E4D6', rot: -3 });
    VK.image(ev.body, imL, { x: 8, y: 8, w: 356, h: 198 });
    X.svg('circle', { cx: Xy(1883), cy: AY, r: 17, fill: C.orange, stroke: C.ground, 'stroke-width': 5 }, tg);
    X.svg('line', { x1: Xy(1883), x2: Xy(1883), y1: AY + 20, y2: AY + 112, stroke: C.grey, 'stroke-width': 3 }, tg);
    VK.text(tg, Xy(1883) - 18, AY + 150, 'Railroad time zones', { size: 34, weight: 800, anchor: 'end' });
    VK.text(tg, Xy(1883) - 18, AY + 190, 'Nov. 18, 1883', { size: 26, weight: 500, anchor: 'end', fill: C.grey });
    // 1884: 25 nations, Washington, Greenwich
    const m84 = X.svg('circle', { cx: Xy(1884), cy: AY, r: 17, fill: C.sage, stroke: C.ground, 'stroke-width': 5 }, tg);
    X.pop(m84, W('meridian', 'year') - 0.05, { dur: 0.22, ease: 'back.out(1.6)', gain: 0.18 });
    VK.chip(tg, W('meridian', '25') - 0.05, '25 nations', { x: 300, y: 206, fill: C.sage, size: 36 });
    const stalk = X.svg('line', { x1: Xy(1884), x2: Xy(1884), y1: AY - 20, y2: 480, stroke: C.grey, 'stroke-width': 3 }, tg);
    VK.drawOn(stalk, W('meridian', 'Washington') - 0.35, 0.25, 'power2.out');
    const med = VK.medallion(tg, imP, { cx: Xy(1884), cy: 365, r: 118, ring: C.orange, label: 'WASHINGTON · 1884' });
    X.pop(med, W('meridian', 'Washington') - 0.12, { dur: 0.3, ease: 'back.out(1.4)', gain: 0.22 });
    VK.subTag(tg, W('meridian', 'Greenwich') - 0.05, 'Prime meridian: Greenwich', { x: 640, y: 560, size: 36 });
    // truck to 1918: the act
    const tGo = L('law').start - 0.05;
    cam.move(tGo, 2.3, { cx: Xy(1918) + 20 - TRUCK * (tGo + 2.3 - tP), cy: 520 + OY });
    X.sfx(tGo, 'whoosh', { gain: 0.24, dur: 1.4 });
    const doc = VK.plate(tg, { x: Xy(1918) - 78, y: 300, w: 156, h: 200, color: C.white, rx: 3 });
    for (let i = 0; i < 7; i++) X.svg('rect', { x: 22, y: 34 + i * 18, width: i === 0 ? 112 : 96 + ((i * 13) % 20), height: 6, fill: '#9aa0a6' }, doc.body);
    X.svg('circle', { cx: 116, cy: 168, r: 18, fill: C.orangeDeep }, doc.body);
    X.pop(doc.g, W('law', 'write') - 0.05, { dur: 0.26, ease: 'back.out(1.4)', sfx: 'stamp', gain: 0.3 });
    X.svg('line', { x1: Xy(1918), x2: Xy(1918), y1: AY - 20, y2: 505, stroke: C.grey, 'stroke-width': 3 }, tg);
    const m18 = X.svg('circle', { cx: Xy(1918), cy: AY, r: 17, fill: C.orange, stroke: C.ground, 'stroke-width': 5 }, tg);
    X.pop(m18, W('law', 'write') - 0.05, { dur: 0.22, ease: 'back.out(1.6)', sfx: false });
    VK.tag(tg, W('law', 'standard') + 0.12, 'Standard Time Act', { x: Xy(1918) - 108, y: 330, anchor: 'end', rot: -4, size: 50 });
    VK.chip(tg, W('law', '1918') - 0.08, '1918', { x: Xy(1918), y: AY + 58, fill: C.hilite, color: C.ink, size: 34 });
    // pull back: thirty-five years
    const tBack = W('law', 'thirty') - 0.35;
    cam.move(tBack, 1.1, { s: 0.5, cx: 1880 - TRUCK * (tBack + 1.1 - tP), cy: 600 + OY });
    X.sfx(tBack, 'zoom_out', { gain: 0.26, dur: 1.0 });
    VK.bracket(tg, W('law', 'thirty') - 0.05, { x0: Xy(1883), x1: Xy(1918), y: 940, h: -200, width: 10, dur: 0.55 });
    VK.tag(tg, W('law', 'thirty') + 0.12, '35 years', { x: (Xy(1883) + Xy(1918)) / 2 + 20, y: 1030, anchor: 'middle', rot: -3, size: 104 });
  });

  // ================================================================ 6. KICKER — your phone, on the timetable
  X.scene('s-phone', tPhone, tCred, (g, t0) => {
    const cam = VK.camera(g).cut(t0, { s: 1.1, cx: 1090, cy: 610, r: 0 }, { rate: 0.0027 });
    X.sfx(t0, 'click', { gain: 0.14 });
    X.svg('rect', { x: -3000, y: -3000, width: 8000, height: 8000, fill: C.ground }, cam.g);
    const tt = VK.plate(cam.g, { x: -760, y: -470, w: 3440, h: 2030, shape: 'torn', seed: 15, jag: 14, step: 16, color: '#EFE4CE', tex: 0.8, shadowId: 'vkShadowLg' });
    const b = X.svg('g', { transform: 'translate(760 470)' }, tt.body), ink = '#1E1C1A';
    const T = (x, y, text, o) => X.svg('text', { x, y, text, fill: ink, 'font-family': o.family ?? SERIF, 'font-size': o.size, 'font-weight': o.weight ?? 400, 'font-style': o.style ?? 'normal', 'text-anchor': o.anchor ?? 'start', 'letter-spacing': o.ls ?? 0, filter: 'url(#vkInk)' }, b);
    T(960, -330, 'GREAT LAKES & PRAIRIE RAIL ROAD', { family: DISPLAY, size: 124, weight: 900, anchor: 'middle', ls: 2 });
    T(960, -215, 'TIME-TABLE No. 47', { family: COND, size: 72, weight: 600, anchor: 'middle', ls: 6 });
    T(960, -122, 'Taking effect Sunday, November 18, 1883, at 12 o’clock noon.', { size: 54, style: 'italic', anchor: 'middle' });
    const ST = 'ALL TRAINS RUN BY STANDARD TIME — 90th MERIDIAN', sts = 80, stw = VK.measure(ST, sts, 700, COND);
    T(960, 0, ST, { family: COND, size: sts, weight: 700, anchor: 'middle', ls: 0 });
    X.svg('rect', { x: -620, y: 50, width: 3160, height: 5, fill: ink }, b);
    X.svg('rect', { x: -620, y: 62, width: 3160, height: 2, fill: ink }, b);
    const stations = ['Chicago', 'Blue Island', 'Joliet', 'Morris', 'Ottawa', 'La Salle', 'Princeton', 'Kewanee', 'Galesburg', 'Burlington'];
    const block = (x0, title, dir) => {
      T(x0, 150, title, { family: COND, size: 52, weight: 700, ls: 3 });
      ['No. 1', 'No. 3', 'No. 5'].forEach((n, j) => T(x0 + 640 + j * 250, 150, n, { family: COND, size: 46, weight: 600, anchor: 'end' }));
      X.svg('rect', { x: x0, y: 172, width: 1180, height: 3, fill: ink }, b);
      const st = dir > 0 ? stations : stations.slice().reverse(), base = [7 * 60 + 15, 11 * 60 + 40, 16 * 60 + 5];
      st.forEach((s, i) => {
        T(x0, 240 + i * 74, s, { size: 40 });
        base.forEach((m0, j) => { const m = m0 + i * 23 + j * 2, h = Math.floor(m / 60), hh = h > 12 ? h - 12 : h; T(x0 + 640 + j * 250, 240 + i * 74, `${hh}.${pad2(m % 60)} ${h >= 12 ? 'p.m.' : 'a.m.'}`, { size: 38, anchor: 'end' }); });
      });
    };
    block(-600, 'GOING WEST', 1);
    block(1360, 'GOING EAST', -1);
    X.svg('rect', { x: 960, y: 120, width: 3, height: 800, fill: ink, opacity: 0.5 }, b);
    // the phone (die-cut sticker)
    const ph = X.svg('g', { transform: 'translate(1095 615) rotate(7)' }, cam.g);
    const body = `M-196,-350 Q-196,-404 -142,-404 H142 Q196,-404 196,-350 V350 Q196,404 142,404 H-142 Q-196,404 -196,350Z`;
    const dc = VK.dieCut(ph, null, body, { width: 13 });
    X.svg('path', { d: body, fill: '#15181C' }, dc.body);
    X.svg('rect', { x: -180, y: -388, width: 360, height: 776, rx: 44, fill: '#2F4253' }, dc.body);
    X.svg('rect', { x: -180, y: 60, width: 360, height: 328, fill: '#3B5263', opacity: 0.7 }, dc.body);
    X.svg('path', { d: 'M-180,170 Q-60,90 40,150 T180,110 V388 H-180Z', fill: '#24323E', opacity: 0.8 }, dc.body);
    X.svg('rect', { x: -52, y: -372, width: 104, height: 30, rx: 15, fill: '#0B0D10' }, dc.body);
    VK.text(dc.body, 0, -306, 'Sunday, November 18', { size: 26, weight: 500, anchor: 'middle', fill: '#E9EEF2' });
    VK.text(dc.body, 0, -166, '12:00', { size: 124, weight: 300, anchor: 'middle', fill: '#F4F7F9', ls: -2 });
    for (const x of [-120, 120]) X.svg('circle', { cx: x, cy: 330, r: 30, fill: '#000', opacity: 0.35 }, dc.body);
    VK.ellipse(ph, W('kicker', 'hour') - 0.2, { cx: 0, cy: -200, rx: 200, ry: 80, rot: -5, seed: 33, width: 9 });
    // pull back: it sits on a railroad timetable
    const tOut = W('kicker', 'started') - 0.12;
    cam.move(tOut, 1.5, { s: 0.47, cx: 960, cy: 545 }, 'sine.inOut');
    X.sfx(tOut, 'zoom_out', { gain: 0.28, dur: 1.1 });
    VK.highlight(b, W('kicker', 'schedule') - 0.25, { x: 960 - stw / 2 - 12, y: -sts * 0.84, w: stw + 24, h: sts * 0.98, dur: 0.6 });
  });

  // ================================================================ brand (own wordmark) + sting + credits
  const sBug = X.scene('s-bug', 0, tCred, (g) => VK.bug('footnote', { parent: g }));
  gsap.set([sLoco, sBug], { autoAlpha: 1 });
  VK.sting(tSting, 1.15, 'footnote', { cover: true });
  X.scene('s-credits', tCred, null, (g, t0) => {
    VK.credits(g, [['Script, design & animation', 'Claude'], ['Narration', 'Kokoro TTS · af_heart'], ['Music & sound', 'synthesized in code'], ['Photographs & documents', 'illustrations made for this film']]);
    X.sfx(t0, 'click', { gain: 0.1 });
  });
  X.end(END);
});
