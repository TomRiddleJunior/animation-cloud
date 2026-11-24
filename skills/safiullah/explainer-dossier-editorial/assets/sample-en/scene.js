/* THE STRAIT FILE · TOLL — dossier-editorial, English edition.
 * The Strait of Hormuz, the 2026 war, oil and diesel prices and the US midterms, told as a paper dossier on one desk.
 * Every number on screen comes from FACTS.md (checked 27 Oct 2026). Maps, ledger, memorandum, notices and the Brent
 * line are schematic and say so in the source line. No portraits, no logos, no quotes: the radio warning is paraphrased. */
X.boot(async (X) => {
  await X.loadVO();
  DK.init(X);
  const C = DK.C, F = DK.F, tl = X.tl;
  const L = (id) => X.line(id), W = (id, p, n = 0) => X.word(id, p, n), WE = (id, p, n = 0) => X.wordEnd(id, p, n);
  const END = X.vo.duration || 93;
  const R = (deg) => (deg * Math.PI) / 180;
  const toWorld = (s, lx, ly) => { const a = R(s.rot || 0), dx = lx - s.w / 2, dy = ly - s.h / 2; return [s.x + dx * Math.cos(a) - dy * Math.sin(a), s.y + dx * Math.sin(a) + dy * Math.cos(a)]; };
  const popIn = (el, t, o = {}) => { gsap.set(el, { opacity: 0 }); tl.fromTo(el, { opacity: 0, scale: o.from ?? 1.25, transformOrigin: o.origin || '0% 100%' }, { opacity: 1, scale: 1, duration: o.dur ?? 0.22, ease: o.ease || 'back.out(2)', immediateRender: false }, t); if (o.sfx !== false) X.sfx(t, o.sfx || 'click', { gain: o.gain ?? 0.3 }); return el; };
  const showAt = (el, t) => { gsap.set(el, { opacity: 0 }); tl.set(el, { opacity: 1 }, t); return el; };
  const slam = (el, t, ox, oy) => { gsap.set(el, { opacity: 0 }); tl.fromTo(el, { opacity: 0.5, scale: 1.22, svgOrigin: `${ox} ${oy}` }, { opacity: 1, scale: 1, duration: 3 / 30, ease: 'power3.out', immediateRender: false }, t); X.sfx(t, 'shutter', { gain: 0.35 }); X.sfx(t + 0.02, 'thud', { gain: 0.3 }); };
  const bars = (g, x0, y0, x1, y1, step, seed, o = {}) => { const r = X.rand(seed); for (let y = y0; y < y1; y += step) X.svg('rect', { x: x0, y, width: (x1 - x0) * (r() < 0.14 ? 0.45 : 0.78 + r() * 0.22), height: o.h ?? 8, fill: o.fill || '#b9b1a2', opacity: o.op ?? 0.75 }, g); };
  const pathOf = (pts) => 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L');
  const polyOf = (pts) => pathOf(pts) + 'Z';
  const circ = (cx, cy, rx, ry, n = 18, jit = 0.12, seed = 3) => { const r = X.rand(seed), out = []; for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 1 + (r() - 0.5) * jit; out.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return out; };
  const catmull = (pts, seg = 12) => { const out = []; for (let i = 0; i < pts.length - 1; i++) { const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
    for (let k = 0; k < seg; k++) { const t = k / seg, t2 = t * t, t3 = t2 * t; out.push([0, 1].map((j) => 0.5 * ((2 * p1[j]) + (-p0[j] + p2[j]) * t + (2 * p0[j] - 5 * p1[j] + 4 * p2[j] - p3[j]) * t2 + (-p0[j] + 3 * p1[j] - 3 * p2[j] + p3[j]) * t3))); } } out.push(pts[pts.length - 1]); return out; };
  const offsetLine = (pts, d) => pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)], dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] + (dy / l) * d, p[1] - (dx / l) * d]; });

  // ================================================================ key times (on narration words)
  const T = {};
  T.iris = 0.25; T.slug = 0.62;
  T.zoom = L('hook').end - 0.26;
  T.fifth = WE('flow', 'day') - 0.36;
  T.war = L('war').start - 0.3;
  T.rup = W('war', 'struck') + 0.04;
  T.radio = L('radio').start - 0.3;
  T.nopass = W('radio', 'No');
  T.brent = L('brent').start - 0.36;
  T.cf = L('truce').start - 0.32;
  T.memo = W('truce', 'memorandum') - 0.34;
  T.each = L('void').start - 0.3;
  T.led = L('october').start - 0.36;
  T.hole1 = L('diesel').start - 0.32;
  T.c1 = L('trucks').start - 0.1; T.c2 = W('trucks', 'trucks') - 0.06; T.c3 = W('trucks', 'price') - 0.06; T.c4 = W('trucks', 'everything') - 0.06;
  T.ballot = L('ballot').start - 0.3;
  T.iso = W('ballot', 'all') + 0.04;
  T.hole2 = L('poll').start - 0.3;
  T.isr = L('israel').start - 0.36;
  T.pb = L('close').start - 0.1;
  T.dive = WE('close', 'box') - 0.66;
  T.title = T.dive + 0.36;

  // ================================================================ world: desk + camera
  const GM = { x: -1650, y: -1050, w: 1250, h: 860, rot: -2 };
  const cam = DK.camera({ x: GM.x + 10, y: GM.y + 40, s: 0.97, r: -0.6, rate: 0.0105, rd: 0.13 });
  const world = cam.g;
  const desk = DK.desk(world, { seed: 52, w: 5600, h: 3400,
    words: ['OIL', 'NO WAR', 'PRICES', 'VOTE', 'FUEL', 'PEACE', 'NOW', 'STRAIT', 'RENT', 'FREIGHT', 'DIESEL', 'BALLOT', 'JOBS', 'SHIPPING', 'TRUCE', 'GAS'],
    small: ['NOTICE', 'MEETING', 'TONIGHT', 'BULLETIN', 'TOWN HALL', 'HEARING', 'FREIGHT', 'NOTICE TO MARINERS', 'PRICES', 'DISPATCH'] });
  desk.setAttribute('id', 'deskImg');

  // ---------------------------------------------------------------- 1 · THE GULF map plate (iris hook)
  const gm = DK.sheet(world, { ...GM, paper: 'land2', big: true });
  const gmClip = X.svg('clipPath', { id: 'gmClip' }, X.defs); X.svg('rect', { x: 31, y: 31, width: GM.w - 62, height: GM.h - 62 }, gmClip);
  const PG = (lon, lat) => [625 + (lon - 54) * 95 * 0.894, 430 - (lat - 26.65) * 95];
  const mapG = X.svg('g', { 'clip-path': 'url(#gmClip)' }, gm);
  X.svg('rect', { x: 0, y: 0, width: GM.w, height: GM.h, fill: DK.pat('sea') }, mapG);
  const north = [[46.9, 30.1], [47.95, 30.05], [48.4, 29.95], [48.65, 29.98], [48.9, 30.35], [49.2, 30.45], [49.55, 30.0], [50.1, 30.15], [50.4, 29.6], [50.85, 28.95], [51.15, 28.4], [51.45, 28.0], [51.95, 27.82], [52.6, 27.45], [53.3, 26.95], [54.0, 26.7], [54.8, 26.55], [55.3, 26.78], [55.8, 27.02], [56.28, 27.2], [56.75, 27.1], [57.0, 26.8], [57.1, 26.4], [57.2, 26.1], [57.3, 25.8], [57.8, 25.66], [58.5, 25.55], [59.2, 25.42], [60.0, 25.35], [60.6, 25.28], [61.4, 25.15], [61.4, 31.4], [46.9, 31.4]];
  const south = [[46.9, 21.8], [46.9, 30.0], [47.95, 29.98], [47.75, 29.4], [48.1, 29.3], [48.4, 28.6], [48.55, 28.1], [48.9, 27.6], [49.3, 27.2], [49.65, 26.95], [50.1, 26.5], [50.2, 26.2], [50.15, 25.9], [50.45, 25.4], [50.75, 24.75], [50.85, 24.85], [50.8, 25.5], [51.05, 26.05], [51.25, 26.15], [51.55, 25.9], [51.6, 25.3], [51.6, 25.0], [51.45, 24.6], [51.6, 24.25], [52.0, 24.0], [52.6, 24.2], [53.4, 24.15], [54.2, 24.3], [54.6, 24.6], [55.1, 25.0], [55.35, 25.3], [55.6, 25.55], [55.95, 25.8], [56.1, 26.05], [56.25, 26.25], [56.42, 26.38], [56.48, 26.25], [56.38, 25.9], [56.3, 25.6], [56.35, 25.1], [56.4, 24.8], [56.7, 24.3], [57.2, 23.9], [57.9, 23.7], [58.6, 23.6], [58.9, 23.25], [59.5, 22.6], [59.8, 22.5], [59.85, 21.8]];
  const qeshmR = [[55.27, 26.55], [55.7, 26.66], [56.12, 26.76], [56.28, 26.96], [56.0, 26.95], [55.62, 26.83], [55.3, 26.66]];
  const bahrain = [[50.45, 26.05], [50.62, 26.25], [50.66, 26.15], [50.58, 25.85], [50.48, 25.9]];
  [north, south].forEach((p) => X.svg('path', { d: polyOf(p.map(([a, b]) => PG(a, b))), fill: DK.pat('land'), stroke: C.seaLine, 'stroke-width': 9, 'stroke-opacity': 0.35, 'paint-order': 'stroke' }, mapG));
  [north, south, qeshmR, bahrain].forEach((p) => X.svg('path', { d: polyOf(p.map(([a, b]) => PG(a, b))), fill: p === north || p === south ? 'none' : DK.pat('land'), stroke: C.ink, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }, mapG));
  const border = (pts) => X.svg('path', { d: pathOf(pts.map(([a, b]) => PG(a, b))), fill: 'none', stroke: C.ink2, 'stroke-width': 1.1, 'stroke-dasharray': '7 5', opacity: 0.55 }, mapG);
  border([[56.08, 26.03], [56.27, 25.64]]); border([[56.35, 24.95], [56.0, 24.6], [55.8, 24.2], [55.9, 23.9], [55.5, 23.6], [55.2, 22.7]]); border([[51.6, 24.25], [52.3, 22.95], [55.2, 22.7]]); border([[50.85, 24.85], [51.2, 24.3], [51.6, 24.25]]);
  const dotR = X.rand(5); for (let i = 0; i < 220; i++) { const a = 47 + dotR() * 14, b = 22.4 + dotR() * 8.5; const [x, y] = PG(a, b); X.svg('circle', { cx: x, cy: y, r: 1.3, fill: C.ink2, opacity: 0.16 }, mapG); }
  const mlab = (lon, lat, t, o = {}) => { const [x, y] = PG(lon, lat); return DK.text(mapG, x, y, t, { f: o.f || 'mono', size: o.size ?? 17, ls: o.ls ?? 5, fill: o.fill || C.ink2, anchor: 'middle', weight: o.weight ?? 600, style: o.style || 'normal', op: o.op ?? 1 }); };
  mlab(54.3, 29.3, 'IRAN', { size: 30, ls: 14, fill: C.ink }); mlab(57.4, 22.95, 'OMAN', { size: 26, ls: 12, fill: C.ink }); mlab(54.2, 23.55, 'U.A.E.', { size: 24, ls: 10, fill: C.ink });
  mlab(49.4, 24.0, 'SAUDI ARABIA', { size: 15, op: 0.6 }); mlab(51.25, 25.35, 'QATAR', { size: 12, ls: 3, op: 0.6 });
  mlab(52.4, 27.0, 'THE GULF', { f: 'lat', size: 22, ls: 7, fill: '#6f8a93', style: 'italic', weight: 400 }); mlab(58.6, 24.45, 'GULF OF OMAN', { f: 'lat', size: 19, ls: 5, fill: '#6f8a93', style: 'italic', weight: 400 });
  { const [sx, sy] = PG(56.45, 26.6), [lx, ly] = PG(57.5, 27.75);
    X.svg('path', { d: `M${sx + 8},${sy - 8} Q${sx + 40},${ly + 20} ${lx - 60},${ly + 6}`, fill: 'none', stroke: C.ink, 'stroke-width': 1.4 }, mapG);
    DK.text(mapG, lx - 54, ly + 12, 'STRAIT OF HORMUZ', { f: 'lat', size: 19, ls: 3, weight: 700 }); }
  X.svg('rect', { x: 24, y: 24, width: GM.w - 48, height: GM.h - 48, fill: 'none', stroke: C.ink, 'stroke-width': 1.6 }, gm);
  X.svg('rect', { x: 32, y: 32, width: GM.w - 64, height: GM.h - 64, fill: 'none', stroke: C.ink, 'stroke-width': 0.8 }, gm);
  X.svg('rect', { x: 60, y: 60, width: 520, height: 132, fill: DK.pat('card'), stroke: C.ink, 'stroke-width': 1.4 }, gm);
  DK.text(gm, 84, 126, 'THE GULF', { f: 'lat', size: 50, ls: 8 });
  DK.text(gm, 86, 168, 'the Strait of Hormuz · schematic map', { f: 'lat', size: 19, style: 'italic', weight: 400, fill: C.ink2 });
  DK.pin(gm, 44, 40); DK.pin(gm, GM.w - 44, 40);
  const [hzx, hzy] = PG(56.45, 26.6);
  const hzPin = DK.pin(gm, hzx, hzy - 4, 10); popIn(hzPin, 0.9, { origin: '50% 100%', from: 0, sfx: 'pop', gain: 0.25 });
  for (let k = 0; k < 2; k++) { const ring = X.svg('circle', { cx: hzx, cy: hzy, r: 10, fill: 'none', stroke: C.red, 'stroke-width': 2.5, opacity: 0 }, gm); tl.fromTo(ring, { attr: { r: 10 }, opacity: 0.9 }, { attr: { r: 90 }, opacity: 0, duration: 0.8, ease: 'power2.out', immediateRender: false }, 1.0 + k * 0.5); }
  const slugS = DK.sheet(world, { x: GM.x + 60, y: GM.y + 375, w: 900, h: 66, rot: -2.5, edge: 'torn', jag: 4, seed: 12, paper: 'card' });
  DK.type(slugS, 30, 44, 'STRAIT OF HORMUZ · ≈ 21 MILES AT ITS NARROWEST', T.slug, { size: 25, ls: 2, cps: 24, gain: 0.25 });
  tl.fromTo(gm.outer, { y: 0 }, { y: -4, duration: 2.6, ease: 'sine.inOut', immediateRender: false }, 0.2);
  // zoom punch through the strait
  const [zx, zy] = toWorld(GM, hzx, hzy);
  cam.move(0.3, T.zoom - 0.3, { x: zx - 30, y: zy - 20, s: 1.1, r: 0.3 }, 'sine.inOut');
  cam.zoom(T.zoom, { x: zx, y: zy, s: 6 }, { dur: 0.3 });

  // ---------------------------------------------------------------- 2 · the strait chart (desk-free, 2-mile lanes, tankers)
  const LC = { x: 4150, y: -950, w: 2300, h: 1400, rot: 0 };
  const PL = (lon, lat) => [1150 + (lon - 56.3) * 659, 700 - (lat - 26.5) * 737];
  const lcCam = (lon, lat) => { const [x, y] = PL(lon, lat); return [LC.x - LC.w / 2 + x, LC.y - LC.h / 2 + y]; };
  { const [cx, cy] = lcCam(56.42, 26.66); cam.cut(T.zoom + 0.3, { x: cx, y: cy, s: 0.66, r: 0 }); cam.move(T.zoom + 0.3001, 0.36, { x: cx, y: cy, s: 1, r: 0.3 }, 'power3.out');
    const [cx2, cy2] = lcCam(56.55, 26.6); cam.move(L('flow').start + 0.1, T.fifth - L('flow').start - 0.15, { x: cx2, y: cy2, s: 1.14, r: -0.5 }, 'sine.inOut'); }
  const lc = DK.sheet(world, { ...LC, paper: 'sea', shadow: false });
  const lcg = X.svg('g', {}, lc);
  for (let a = 54.75; a <= 58.25; a += 0.25) { const [x] = PL(a, 26); X.svg('line', { x1: x, y1: 0, x2: x, y2: LC.h, stroke: '#9fb2b9', 'stroke-width': 1, 'stroke-dasharray': '3 9', opacity: 0.7 }, lcg); }
  for (let b = 25.5; b <= 27.5; b += 0.25) { const [, y] = PL(56, b); X.svg('line', { x1: 0, y1: y, x2: LC.w, y2: y, stroke: '#9fb2b9', 'stroke-width': 1, 'stroke-dasharray': '3 9', opacity: 0.7 }, lcg); }
  const iranL = [[54.5, 26.62], [54.88, 26.56], [55.1, 26.66], [55.3, 26.8], [55.58, 26.96], [55.8, 27.05], [56.05, 27.12], [56.28, 27.2], [56.5, 27.15], [56.72, 27.1], [56.88, 27.0], [56.98, 26.85], [57.05, 26.65], [57.1, 26.4], [57.15, 26.15], [57.25, 25.95], [57.32, 25.8], [57.55, 25.74], [57.8, 25.68], [58.4, 25.6], [58.4, 27.7], [54.5, 27.7]];
  const qeshm = [[55.27, 26.55], [55.45, 26.6], [55.7, 26.66], [55.95, 26.7], [56.12, 26.76], [56.27, 26.88], [56.28, 26.96], [56.15, 26.98], [56.0, 26.95], [55.82, 26.9], [55.62, 26.83], [55.42, 26.74], [55.3, 26.66]];
  const southL = [[55.35, 25.3], [55.6, 25.55], [55.78, 25.68], [55.95, 25.8], [56.05, 25.95], [56.1, 26.07], [56.16, 26.15], [56.23, 26.2], [56.27, 26.28], [56.33, 26.33], [56.4, 26.36], [56.44, 26.39], [56.49, 26.36], [56.47, 26.3], [56.5, 26.24], [56.44, 26.18], [56.47, 26.1], [56.42, 25.98], [56.37, 25.85], [56.32, 25.72], [56.28, 25.62], [56.3, 25.5], [56.35, 25.3]];
  const islands = [circ(56.46, 27.06, 0.04, 0.035, 16, 0.2, 4), circ(56.36, 26.86, 0.032, 0.022, 14, 0.2, 5), circ(55.88, 26.64, 0.025, 0.018, 12, 0.2, 6), circ(56.53, 26.51, 0.014, 0.01, 10, 0.2, 7), circ(56.5, 26.475, 0.009, 0.007, 8, 0.2, 8)];
  [iranL, southL, qeshm, ...islands].forEach((p) => X.svg('path', { d: polyOf(p.map(([a, b]) => PL(a, b))), fill: DK.pat('land'), stroke: C.seaLine, 'stroke-width': 14, 'stroke-opacity': 0.4, 'paint-order': 'stroke' }, lcg));
  [iranL, southL, qeshm, ...islands].forEach((p) => X.svg('path', { d: polyOf(p.map(([a, b]) => PL(a, b))), fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-linejoin': 'round' }, lcg));
  X.svg('path', { d: pathOf([[56.08, 26.02], [56.27, 25.64]].map(([a, b]) => PL(a, b))), fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-dasharray': '9 6', opacity: 0.6 }, lcg);
  const dR = X.rand(9); for (let i = 0; i < 200; i++) { const a = 54.6 + dR() * 3.7, b = 26.9 + dR() * 0.8; const [x, y] = PL(a, b); X.svg('circle', { cx: x, cy: y, r: 1.4, fill: C.ink2, opacity: 0.2 }, lcg); }
  const llab = (lon, lat, t, o = {}) => { const [x, y] = PL(lon, lat); return DK.text(lcg, x, y, t, { f: o.f || 'mono', size: o.size ?? 26, ls: o.ls ?? 10, fill: o.fill || C.ink, anchor: o.anchor || 'middle', weight: o.weight ?? 600, style: o.style || 'normal' }); };
  llab(57.5, 26.72, 'IRAN', { size: 46, ls: 22 }); llab(56.29, 26.14, 'OMAN', { size: 24, ls: 6 }); llab(55.85, 25.66, 'U.A.E.', { size: 26, ls: 8 });
  llab(55.15, 26.2, 'THE GULF', { f: 'lat', size: 32, ls: 9, fill: '#5f7d87', style: 'italic', weight: 400 }); llab(56.95, 25.9, 'GULF OF OMAN', { f: 'lat', size: 30, ls: 7, fill: '#5f7d87', style: 'italic', weight: 400 });
  llab(56.27, 27.26, 'Bandar Abbas', { f: 'lat', size: 22, ls: 0, fill: C.ink2, style: 'italic', weight: 400, anchor: 'start' }); { const [x, y] = PL(56.27, 27.2); X.svg('circle', { cx: x, cy: y, r: 6, fill: C.ink }, lcg); }
  llab(56.18, 26.33, 'Musandam', { f: 'lat', size: 20, ls: 0, fill: C.ink2, style: 'italic', weight: 400, anchor: 'end' });
  // the two 2-mile lanes (traffic separation scheme, schematic)
  const cl = catmull([[57.25, 25.55], [57.15, 25.75], [56.95, 26.15], [56.72, 26.48], [56.5, 26.65], [56.25, 26.67], [55.95, 26.55], [55.6, 26.38], [55.2, 26.22], [54.6, 26.0]].map(([a, b]) => PL(a, b)), 10);
  const mi = 10.7; // px per mile at this scale
  const laneG = X.svg('g', {}, lc);
  const sepZone = X.svg('path', { d: pathOf(cl), fill: 'none', stroke: '#c9b9a0', 'stroke-width': 2 * mi, opacity: 0.55 }, laneG);
  const inL = offsetLine(cl, 2 * mi), outL = offsetLine(cl, -2 * mi);
  const laneEls = [];
  [inL, outL].forEach((pts) => {
    laneEls.push(X.svg('path', { d: pathOf(pts), fill: 'none', stroke: '#f3ecd9', 'stroke-width': 2 * mi, opacity: 0.85 }, laneG));
    laneEls.push(X.svg('path', { d: pathOf(offsetLine(pts, mi)), fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-dasharray': '10 6' }, laneG));
    laneEls.push(X.svg('path', { d: pathOf(offsetLine(pts, -mi)), fill: 'none', stroke: C.ink2, 'stroke-width': 1.6, 'stroke-dasharray': '10 6' }, laneG));
  });
  const laneMask = X.svg('mask', { id: 'laneMask', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: LC.w, height: LC.h }, X.defs);
  const lmPath = X.svg('path', { d: pathOf(cl), fill: 'none', stroke: '#fff', 'stroke-width': 120 }, laneMask);
  laneG.setAttribute('mask', 'url(#laneMask)');
  X.drawOn(lmPath, L('flow').start - 0.1, 0.9, 'power2.inOut');
  X.sfx(L('flow').start, 'scribble', { dur: 0.8, gain: 0.25 });
  // tankers riding the lanes (inbound west along +normal lane, outbound east)
  const mkLanePath = (pts) => X.svg('path', { d: pathOf(pts), fill: 'none', stroke: 'none' }, lc);
  const inP = mkLanePath(inL), outP = mkLanePath(outL), inLen = inP.getTotalLength(), outLen = outP.getTotalLength();
  const tankerSym = X.svg('g', { id: 'tankerSym' }, X.defs);
  X.svg('path', { d: 'M-26,-6 L20,-6 L28,0 L20,6 L-26,6 Z', fill: C.ink }, tankerSym);
  X.svg('rect', { x: -24, y: -4.5, width: 9, height: 9, fill: '#d9cfb8' }, tankerSym);
  X.svg('line', { x1: -12, y1: 0, x2: 18, y2: 0, stroke: '#d9cfb8', 'stroke-width': 1.2 }, tankerSym);
  const tankers = [];
  for (let i = 0; i < 6; i++) tankers.push({ p: inP, L: inLen, off: i / 6 + 0.03, dir: 1, el: X.svg('use', { href: '#tankerSym', filter: 'url(#dkShS)' }, lc) });
  for (let i = 0; i < 5; i++) tankers.push({ p: outP, L: outLen, off: i / 5 + 0.11, dir: -1, el: X.svg('use', { href: '#tankerSym', filter: 'url(#dkShS)' }, lc) });
  const tIn = L('flow').start + 0.4;
  X.every((t) => {
    if (t < T.zoom || t > T.fifth + 1) return;
    for (const k of tankers) {
      let u = (k.off + (t - 3) * 0.022) % 1; if (k.dir < 0) u = 1 - u;
      const a = k.p.getPointAtLength(u * k.L), b = k.p.getPointAtLength(Math.min(k.L, Math.max(0, u * k.L + k.dir * 3)));
      const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
      const vis = Math.min(1, Math.max(0, (t - tIn - k.off * 0.6) / 0.25));
      k.el.setAttribute('transform', `translate(${a.x.toFixed(1)},${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(${(0.6 + 0.4 * vis).toFixed(2)})`);
      k.el.setAttribute('opacity', vis.toFixed(2));
    }
  });
  // 21-mile measure across the narrows (Larak ↔ the Quoin islands)
  { const [ax, ay] = PL(56.375, 26.835), [bx, by] = PL(56.52, 26.525);
    const meas = X.svg('g', {}, lc);
    const ml = X.svg('line', { x1: ax, y1: ay, x2: bx, y2: by, stroke: C.ink, 'stroke-width': 3 }, meas);
    const ang = Math.atan2(by - ay, bx - ax), nx = -Math.sin(ang) * 16, ny = Math.cos(ang) * 16;
    [[ax, ay], [bx, by]].forEach(([x, y]) => X.svg('line', { x1: x - nx, y1: y - ny, x2: x + nx, y2: y + ny, stroke: C.ink, 'stroke-width': 3 }, meas));
    X.drawOn(ml, T.zoom + 0.42, 0.4, 'power2.out');
    const mt = X.svg('g', {}, lc); X.svg('rect', { x: ax - 290, y: ay - 22, width: 250, height: 58, fill: DK.pat('card'), stroke: C.ink, 'stroke-width': 1.4, filter: 'url(#dkShS)' }, mt);
    DK.text(mt, ax - 272, ay + 20, '≈ 21 MILES', { f: 'mono', size: 30, ls: 2 });
    popIn(mt, T.zoom + 0.62, { sfx: 'tick' }); }
  const tagIn = DK.tag(lc, 'INBOUND LANE', '≈ 2 MILES WIDE', ...PL(56.62, 27.0), W('flow', 'barrels') - 0.05, { size: 40, rot: -2.5 });
  const tagOut = DK.tag(lc, 'OUTBOUND LANE', '≈ 2 MILES WIDE', ...PL(56.62, 26.3), W('flow', 'passed') + 0.05, { size: 40, rot: 2, from: 'right' });
  // counter tag: 20 million barrels a day
  const ctr = X.svg('g', {}, lc); const [qx0, qy0] = PL(55.45, 27.08);
  const ctrIn = X.svg('g', { transform: `translate(${qx0},${qy0}) rotate(-2)` }, ctr);
  X.svg('path', { d: X.torn(520, 170, 3, 21, 9), fill: DK.pat('card'), filter: 'url(#dkShS)' }, ctrIn);
  const cnt20 = DK.text(ctrIn, 30, 84, '≈ 0 million', { size: 64, ls: 1 });
  DK.text(ctrIn, 32, 124, 'BARRELS OF OIL A DAY · 2024', { f: 'mono', size: 20, ls: 3, fill: C.ink2 });
  DK.text(ctrIn, 32, 152, 'through the strait, before the war', { f: 'lat', size: 18, style: 'italic', weight: 400, fill: C.ink2 });
  popIn(ctr, W('flow', 'about') - 0.1, { from: 1.15, sfx: 'paper' });
  DK.counter(cnt20, 0, 20000000, W('flow', 'twenty'), WE('flow', 'million') - W('flow', 'twenty') + 0.25, { fmt: (v) => '≈ ' + Math.round(v / 1e5) / 10 + ' million', ease: 'power2.out' });

  // ---------------------------------------------------------------- 3 · one fifth (barrel card) → the dispatch → rupture
  const BC = { x: 1500, y: -1150, w: 980, h: 560, rot: 2.5 };
  const DS = { x: 960, y: -770, w: 800, h: 236, rot: -4 };
  cam.whip(T.fifth, { x: BC.x + 10, y: BC.y + 10, s: 1.06, r: 0.8 }, { dur: 0.4, rotKick: 1.6 });
  // halftone plates that slam in on the strike (drawn first so the torn card stays on top)
  const plateDefs = {
    smoke: DK.halftone((c, w, h) => { DK.ill.sea(c, w, h, 0.66, { top: '#5a5a5a', sky: '#9a9a9a', sea1: '#5e5e5e', sea2: '#1a1a1a' }); DK.ill.skyline(c, w, h * 0.66, { h: 40, color: '#141414', tanks: 6, cranes: 2, seed: 4 }); DK.ill.smokeColumn(c, w * 0.42, h * 0.62, h * 0.9, { lean: 0.35, seed: 3 }); }, 560, 380, { seed: 3, cell: 6 }),
    flares: DK.halftone((c, w, h) => { const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#2a2a2a'); g.addColorStop(1, '#6a6a6a'); c.fillStyle = g; c.fillRect(0, 0, w, h); c.strokeStyle = 'rgba(255,255,255,0.9)'; c.lineCap = 'round'; for (let k = 0; k < 7; k++) { c.lineWidth = 3 + k % 3; c.beginPath(); c.moveTo(w * (0.1 + k * 0.12), h * 0.95); c.quadraticCurveTo(w * (0.2 + k * 0.1), h * 0.4, w * (0.35 + k * 0.08), h * (0.12 + (k % 3) * 0.08)); c.stroke(); } DK.ill.skyline(c, w, h * 0.96, { h: 26, color: '#0e0e0e', tanks: 2, cranes: 0, seed: 7 }); }, 500, 340, { seed: 4, cell: 6 }),
    tanker: DK.halftone((c, w, h) => { DK.ill.sea(c, w, h, 0.5, { seed: 2 }); DK.ill.smokeColumn(c, w * 0.82, h * 0.5, h * 0.55, { glow: false, shade: 70, lean: 0.4, seed: 9 }); DK.ill.tanker(c, w * 0.08, h * 0.68, w * 0.72, {}); }, 540, 360, { seed: 5, cell: 6 }),
    warship: DK.halftone((c, w, h) => { DK.ill.sea(c, w, h, 0.56, { top: '#dedede', sky: '#a9a9a9', seed: 6 }); DK.ill.warship(c, w * 0.12, h * 0.66, w * 0.74, {}); }, 520, 340, { seed: 6, cell: 6 }),
  };
  const ruptPlates = [['smoke', 600, -1250, 520, 360, -6], ['flares', 2150, -1390, 470, 320, 6], ['tanker', 2120, -640, 500, 340, 4], ['warship', 470, -600, 470, 310, -3]];
  ruptPlates.forEach(([k, x, y, w, h, rot], i) => { const p = DK.plate(world, plateDefs[k], { x, y, w, h, rot, seed: 20 + i, tape: true }); slam(p.outer, T.rup + 0.05 + i * 0.07, x, y); });
  // the barrel card (torn on the strike)
  const bcArt = X.svg('g', { id: 'bcArt' }, X.defs);
  X.svg('rect', { width: BC.w, height: BC.h, fill: DK.pat('card') }, bcArt);
  for (let yy = 150; yy < BC.h - 20; yy += 48) X.svg('line', { x1: 0, y1: yy, x2: BC.w, y2: yy, stroke: C.blueLine, 'stroke-width': 1.2, opacity: 0.8 }, bcArt);
  X.svg('line', { x1: 50, y1: 0, x2: 50, y2: BC.h, stroke: C.red, 'stroke-width': 1.6, opacity: 0.6 }, bcArt);
  const barrelSym = X.svg('g', { id: 'barrelSym' }, X.defs);
  X.svg('path', { d: 'M-52,-78 Q-62,0 -52,78 L52,78 Q62,0 52,-78 Z', fill: '#efe7d4', stroke: C.ink, 'stroke-width': 4 }, barrelSym);
  [-40, 40].forEach((y) => X.svg('path', { d: `M-58,${y} Q0,${y + 8} 58,${y}`, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, barrelSym));
  X.svg('ellipse', { cx: 0, cy: -78, rx: 52, ry: 9, fill: '#e3d9c2', stroke: C.ink, 'stroke-width': 3 }, barrelSym);
  const bcG = X.svg('g', { transform: `translate(${BC.x},${BC.y}) rotate(${BC.rot}) translate(${-BC.w / 2},${-BC.h / 2})` }, world);
  const zig = []; for (let i = 0; i <= 14; i++) zig.push([500 - i * 3 + (i % 2 ? 22 : -22), -14 + i * (BC.h + 28) / 14]);
  const cpL = X.svg('clipPath', { id: 'bcL' }, X.defs), cpR = X.svg('clipPath', { id: 'bcR' }, X.defs);
  X.svg('path', { d: `M-20,-20 ${zig.map((p) => `L${p[0]},${p[1]}`).join(' ')} L-20,${BC.h + 20}Z` }, cpL);
  X.svg('path', { d: `M${BC.w + 20},-20 ${zig.map((p) => `L${p[0]},${p[1]}`).join(' ')} L${BC.w + 20},${BC.h + 20}Z` }, cpR);
  const half = (cp) => { const g = X.svg('g', { filter: 'url(#dkSh)' }, bcG); X.svg('use', { href: '#bcArt', 'clip-path': `url(#${cp})` }, g); return g; };
  const bL = half('bcL'), bR = half('bcR');
  const bWhole = X.svg('g', { filter: 'url(#dkSh)' }, bcG); X.svg('use', { href: '#bcArt' }, bWhole);
  gsap.set([bL, bR], { opacity: 0 }); tl.set([bL, bR], { opacity: 1 }, T.rup); tl.set(bWhole, { opacity: 0 }, T.rup);
  // live content (drawn on top of the halves, tears with them)
  const bcLive = X.svg('g', {}, bcG);
  const liveL = X.svg('g', { 'clip-path': 'url(#bcL)' }, bcLive), liveR = X.svg('g', { 'clip-path': 'url(#bcR)' }, bcLive);
  const both = (fn) => [liveL, liveR].map(fn);
  const tBC = T.fifth + 0.5;
  both((g) => DK.type(g, 84, 84, 'SHARE OF WORLD OIL USE · 2024', tBC, { size: 28, ls: 2, cps: 40, gain: 0.22, sfx: g === liveL, cursor: g === liveL }));
  const brls = [];
  for (let i = 0; i < 5; i++) { const bx = 135 + i * 116, by = 285; both((g) => { const b = X.svg('g', { transform: `translate(${bx},${by}) scale(0.76)` }, g); const bi = X.svg('g', {}, b); X.svg('use', { href: '#barrelSym' }, bi); popIn(bi, tBC + 0.08 + i * 0.06, { origin: '50% 100%', from: 0.4, sfx: g === liveL && i % 2 === 0 ? 'tick' : false }); if (i === 0) { const f = X.svg('path', { d: 'M-52,-78 Q-62,0 -52,78 L52,78 Q62,0 52,-78 Z', fill: C.ink, opacity: 0 }, bi); brls.push(f); } }); }
  const tFifth = Math.max(W('flow', 'fifth'), tBC + 0.42);
  brls.forEach((f) => { gsap.set(f, { scaleY: 0, transformOrigin: '50% 100%' }); tl.fromTo(f, { scaleY: 0, opacity: 0.92 }, { scaleY: 1, opacity: 0.92, duration: 0.3, ease: 'power2.out', immediateRender: false }, tFifth - 0.05); });
  X.sfx(tFifth - 0.05, 'scribble', { dur: 0.3, gain: 0.3 });
  both((g) => popIn(DK.text(g, 935, 345, '≈ 1/5', { size: 108, anchor: 'end' }), tFifth + 0.05, { origin: '100% 100%', sfx: g === liveL ? 'pop' : false }));
  both((g) => DK.type(g, 86, 470, '≈ 20 % OF WORLD PETROLEUM LIQUIDS CONSUMPTION', W('flow', 'all') - 0.05, { size: 24, ls: 1, cps: 40, sfx: false, cursor: false, fill: C.ink2 }));
  DK.pin(bcG, BC.w / 2 + 120, 18, 11);
  // the dispatch slip (types the date + the strikes)
  const ds = DK.sheet(world, { ...DS, edge: 'torn', jag: 5, seed: 41, paper: 'slip' });
  DK.type(ds, 40, 62, 'DISPATCH · 28 FEBRUARY 2026', W('war', 'twenty-eighth') - 0.08, { size: 28, ls: 3, cps: 30, gain: 0.25 });
  const hd = DK.type(ds, 40, 150, 'US–ISRAELI STRIKES ON IRAN', W('war', 'United') - 0.05, { f: 'zh', size: 56, ls: 1, cps: 20, gain: 0.3 });
  DK.type(ds, 42, 205, 'within hours: radio warnings to shipping', W('war', 'Iran') + 0.2, { f: 'lat', size: 20, style: 'italic', weight: 400, cps: 40, sfx: false, cursor: false, fill: C.ink2 });
  world.appendChild(bcG); world.appendChild(ds.outer);
  cam.move(T.war, 0.6, { x: 1230, y: -930, s: 0.95, r: -0.6 }, 'power3.inOut');
  cam.move(T.war + 0.65, T.rup - T.war - 0.7, { x: 1170, y: -880, s: 1.0, r: -0.2 }, 'sine.inOut');
  // rupture: flash, card tears, shreds fly, plates slam, camera kicks back
  tl.fromTo(bL, { x: 0, y: 0, rotation: 0, svgOrigin: '250 280' }, { x: -190, y: -50, rotation: -12, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.rup);
  tl.fromTo(bR, { x: 0, y: 0, rotation: 0, svgOrigin: '740 280' }, { x: 210, y: 64, rotation: 10, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.rup);
  tl.fromTo(liveL, { x: 0, y: 0, rotation: 0, svgOrigin: '250 280' }, { x: -190, y: -50, rotation: -12, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.rup);
  tl.fromTo(liveR, { x: 0, y: 0, rotation: 0, svgOrigin: '740 280' }, { x: 210, y: 64, rotation: 10, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.rup);
  const shr = X.rand(31);
  for (let i = 0; i < 8; i++) { const s = X.svg('path', { d: X.torn(40 + shr() * 40, 26 + shr() * 30, 9, 40 + i, 6), fill: DK.pat('card'), filter: 'url(#dkShS)', transform: `translate(${480 + (shr() - 0.5) * 40},${30 + i * 64})` }, bcG);
    gsap.set(s, { opacity: 0 }); tl.fromTo(s, { opacity: 1, x: 0, y: 0, rotation: 0 }, { opacity: 1, x: (shr() - 0.5) * 560, y: (shr() - 0.35) * 420, rotation: (shr() - 0.5) * 340, duration: 0.7, ease: 'power3.out', immediateRender: false }, T.rup); }
  X.sfx(T.rup, 'paper', { dur: 0.45, gain: 0.8 }); X.sfx(T.rup, 'impact', { dur: 1.0, gain: 0.5 });
  cam.shake(T.rup + 0.02, 9);
  cam.move(T.rup, 0.7, { x: 1250, y: -930, s: 0.9, r: 0.5 }, 'power3.out');
  cam.move(T.rup + 0.72, T.radio - T.rup - 0.72, { x: 1300, y: -950, s: 0.93, r: -0.2 }, 'sine.inOut');

  // ---------------------------------------------------------------- 4 · the radio log slip (hard cut, spotlight, NO PASSAGE)
  const RS = { x: -1600, y: 1050, w: 1240, h: 600, rot: -2.5 };
  cam.cut(T.radio, { x: RS.x + 10, y: RS.y + 10, s: 1.0, r: -0.4 });
  cam.move(T.radio + 0.05, T.nopass - T.radio - 0.2, { x: RS.x + 60, y: RS.y + 20, s: 1.07, r: 0.4 }, 'sine.inOut');
  { const [qx, qy] = toWorld(RS, 760, 420); cam.move(T.nopass - 0.06, 0.28, { x: qx - 200, y: qy - 60, s: 1.16, r: -0.6 }, 'power3.out'); }
  const rs = DK.sheet(world, { ...RS, edge: 'torn', jag: 8, seed: 33, paper: 'slip' });
  for (let yy = 150; yy < RS.h - 30; yy += 62) X.svg('line', { x1: 50, y1: yy + 16, x2: RS.w - 50, y2: yy + 16, stroke: C.blueLine, 'stroke-width': 1, opacity: 0.5 }, rs);
  DK.type(rs, 62, 74, 'RADIO LOG · VHF MARINE BAND · 28 FEB 2026', L('radio').start - 0.1, { size: 24, ls: 3, cps: 44, fill: C.ink2, gain: 0.22 });
  X.svg('line', { x1: 60, y1: 96, x2: RS.w - 60, y2: 96, stroke: C.ink2, 'stroke-width': 1.2 }, rs);
  DK.type(rs, 62, 160, 'FROM:  IRAN’S REVOLUTIONARY GUARD (IRGC)', W('radio', "Iran's") - 0.05, { size: 30, cps: 40, gain: 0.28 });
  DK.type(rs, 62, 222, 'TO:    SHIPS IN THE STRAIT', W('radio', 'warning') - 0.05, { size: 30, cps: 40, sfx: false });
  DK.type(rs, 62, 284, 'WARNING (PARAPHRASED):', W('radio', 'ships') + 0.05, { size: 30, cps: 40, sfx: false });
  const q1 = W('radio', 'radio') + 0.02;
  const ql = DK.type(rs, 62, 368, 'NO SHIP WILL BE ALLOWED TO PASS.', q1, { size: 46, cps: 34, gain: 0.3 });
  const hlw = DK.measure('NO SHIP WILL BE ALLOWED TO PASS.', 46, F.mono, 600);
  const hl = X.svg('rect', { x: 54, y: 326, width: hlw + 18, height: 54, fill: C.hilite, opacity: 0.55 }, rs);
  rs.insertBefore(hl, ql);
  gsap.set(hl, { scaleX: 0, transformOrigin: '0% 50%' });
  const thl = q1 + ql.dur + 0.06;
  tl.fromTo(hl, { scaleX: 0 }, { scaleX: 1, duration: 9 / 30, ease: 'none', immediateRender: false }, thl); X.sfx(thl, 'scribble', { dur: 0.3, gain: 0.3 });
  DK.type(rs, 64, 552, 'paraphrase of reported VHF warnings — not verbatim', T.nopass + 0.35, { f: 'lat', size: 21, style: 'italic', weight: 400, cps: 40, sfx: false, cursor: false, fill: C.faint });
  DK.stamp(rs, 'NO PASSAGE', 850, 445, T.nopass, { size: 92, rot: -7, sub: 'WITHIN HOURS OF THE STRIKES', cam, shake: 7 });
  X.sfx(T.radio + 0.05, 'glitch', { dur: 0.35, gain: 0.18 }); X.sfx(W('radio', 'radio') - 0.1, 'glitch', { dur: 0.25, gain: 0.12 });
  DK.pin(rs, 600, 22, 11);

  // ---------------------------------------------------------------- 5 · pink markets page: the Brent chart ($100 → $126)
  const BP = { x: -60, y: 1100, w: 1680, h: 980, rot: 1.5 };
  cam.whip(T.brent, { x: BP.x - 180, y: BP.y - 80, s: 1.0, r: 0.5 }, { rotKick: -1.4 });
  const bp = DK.sheet(world, { ...BP, paper: 'pink', big: true });
  DK.text(bp, 80, 110, 'MARKETS', { f: 'lat', size: 66, ls: 12 });
  DK.text(bp, 110 + DK.measure('MARKETS', 66, F.lat, 700, 12), 106, 'commodities · crude oil', { f: 'lat', size: 26, style: 'italic', weight: 400, fill: C.ink2 });
  X.svg('line', { x1: 80, y1: 140, x2: BP.w - 80, y2: 140, stroke: C.ink, 'stroke-width': 3 }, bp); X.svg('line', { x1: 80, y1: 150, x2: BP.w - 80, y2: 150, stroke: C.ink, 'stroke-width': 1 }, bp);
  bars(bp, 80, 200, 330, 900, 22, 11, { fill: '#c9ab9b' });
  const GC = { x: 1000, y: 540, w: 1200, h: 740, rot: -1.2 };
  const gc = DK.sheet(bp, { ...GC, paper: 'graph' });
  DK.tape(gc, 120, 6, 120, -6); DK.tape(gc, GC.w - 110, 8, 110, 7);
  DK.type(gc, 60, 70, 'BRENT CRUDE · US$ PER BARREL · 2026', T.brent + 0.45, { size: 26, ls: 2, cps: 40, gain: 0.22 });
  DK.text(gc, 62, 104, 'schematic line · marked values are reported figures', { f: 'lat', size: 18, style: 'italic', weight: 400, fill: C.ink2 });
  const X0 = 110, X1 = 1110, Y0 = 660;
  const vy = (v) => 420 - (v - 100) * 8.1;
  X.svg('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: C.ink, 'stroke-width': 2 }, gc); X.svg('line', { x1: X0, y1: Y0, x2: X0, y2: 150, stroke: C.ink, 'stroke-width': 2 }, gc);
  const ref100 = X.svg('g', {}, gc); X.svg('line', { x1: X0, y1: vy(100), x2: X1, y2: vy(100), stroke: C.ink2, 'stroke-width': 1.6, 'stroke-dasharray': '8 7' }, ref100); DK.text(ref100, X0 - 12, vy(100) + 8, '$100', { f: 'mono', size: 22, anchor: 'end' });
  const ref126 = X.svg('g', {}, gc); X.svg('line', { x1: X0, y1: vy(126), x2: X1, y2: vy(126), stroke: C.red, 'stroke-width': 1.6, 'stroke-dasharray': '8 7', opacity: 0.8 }, ref126); DK.text(ref126, X0 - 12, vy(126) + 8, '$126', { f: 'mono', size: 22, anchor: 'end', fill: C.red });
  const pts = [[110, 73], [170, 72], [230, 75], [262, 74], [290, 85], [330, 91], [372, 96], [404, 101], [450, 108], [500, 104], [560, 113], [620, 110], [680, 119], [740, 116], [792, 126]].map(([x, v]) => [x, vy(v)]);
  const xWar = 262, x8 = 404;
  const vWar = X.svg('g', {}, gc); X.svg('line', { x1: xWar, y1: Y0, x2: xWar, y2: 170, stroke: C.ink2, 'stroke-width': 1.4, 'stroke-dasharray': '5 6' }, vWar); DK.text(vWar, xWar, Y0 + 34, '28 FEB', { f: 'mono', size: 20, anchor: 'middle' }); DK.text(vWar, xWar + 8, 186, 'war begins', { f: 'lat', size: 18, style: 'italic', weight: 400, fill: C.ink2 });
  const v8 = X.svg('g', {}, gc); X.svg('line', { x1: x8, y1: Y0, x2: x8, y2: 170, stroke: C.ink2, 'stroke-width': 1.4, 'stroke-dasharray': '5 6' }, v8); DK.text(v8, x8, Y0 + 34, '8 MAR', { f: 'mono', size: 20, anchor: 'middle' });
  popIn(vWar, T.brent + 0.6, { sfx: false }); popIn(v8, W('brent', 'March') - 0.05, { sfx: 'tick' });
  showAt(ref100, W('brent', 'hundred') - 0.3); showAt(ref126, W('brent', 'peaked'));
  const bl = X.svg('path', { d: pathOf(pts), fill: 'none', stroke: C.ink, 'stroke-width': 4.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, gc);
  const blL = bl.getTotalLength(); bl.setAttribute('stroke-dasharray', `${blL} ${blL + 10}`);
  const tokB = X.svg('g', {}, gc); X.svg('use', { href: '#barrelSym', transform: 'scale(0.26)' }, tokB);
  const lenAtX = (x) => { let lo = 0, hi = blL; for (let k = 0; k < 24; k++) { const m = (lo + hi) / 2; if (bl.getPointAtLength(m).x < x) lo = m; else hi = m; } return lo; };
  const k100 = lenAtX(x8), kWar = lenAtX(xWar);
  const tA = T.brent + 0.5, tB = W('brent', 'hundred'), tC = W('brent', 'peaked'), tD = WE('brent', 'twenty-six') - 0.1;
  const segs = [[tA, tB, 0, k100, 'power1.inOut'], [tB, tC, k100, lenAtX(640), 'sine.inOut'], [tC, tD, lenAtX(640), blL, 'power2.out']].map(([a, b, l0, l1, e]) => ({ a, b, l0, l1, e: gsap.parseEase(e) }));
  X.every((t) => {
    if (t < T.brent - 0.5 || t > T.cf + 1) return;
    let len = 0; for (const s of segs) { if (t >= s.a) len = s.l0 + (s.l1 - s.l0) * s.e(Math.min(1, (t - s.a) / (s.b - s.a))); }
    bl.setAttribute('stroke-dashoffset', (blL - len).toFixed(1));
    const p = bl.getPointAtLength(Math.max(0.01, len));
    tokB.setAttribute('transform', `translate(${p.x.toFixed(1)},${(p.y - 24).toFixed(1)})`); tokB.setAttribute('opacity', t < tA ? 0 : 1);
  });
  X.sfx(tC, 'riser', { dur: tD - tC, gain: 0.3 });
  const cntB = DK.text(gc, 1100, 610, '$100', { size: 150, fill: C.red, anchor: 'end' });
  popIn(cntB, tB - 0.04, { origin: '100% 100%', sfx: 'pop', from: 1.35 });
  DK.counter(cntB, 100, 126, tC + 0.15, tD - tC - 0.1, { fmt: (v) => '$' + Math.round(v), ease: 'power1.inOut' });
  DK.text(gc, 1098, 650, 'A BARREL', { f: 'mono', size: 20, ls: 4, anchor: 'end', fill: C.red });
  const ringB = X.svg('ellipse', { cx: 792, cy: vy(126), rx: 46, ry: 38, fill: 'none', stroke: C.red, 'stroke-width': 4, transform: `rotate(-12,792,${vy(126)})` }, gc);
  gsap.set(ringB, { opacity: 0 }); tl.set(ringB, { opacity: 1 }, tD + 0.05); X.drawOn(ringB, tD + 0.05, 0.35, 'power2.out'); X.sfx(tD + 0.05, 'scribble', { dur: 0.35, gain: 0.3 });
  { const pk = X.svg('g', {}, gc); DK.text(pk, 846, vy(126) - 18, 'PEAK', { f: 'mono', size: 22, ls: 4, fill: C.red }); popIn(pk, tD + 0.3, { sfx: false }); }
  DK.tag(bp, '8 MARCH', 'FIRST IN FOUR YEARS', ...toWorldLocal(GC, 262, 192), W('brent', 'first') - 0.12, { size: 46, rot: -3, from: 'left' });
  function toWorldLocal(s, lx, ly) { const a = R(s.rot || 0), dx = lx - s.w / 2, dy = ly - s.h / 2; return [s.x + dx * Math.cos(a) - dy * Math.sin(a), s.y + dx * Math.sin(a) + dy * Math.cos(a)]; }
  { const [ax, ay] = toWorld(BP, ...toWorldLocal(GC, 420, 380)), [bx, by] = toWorld(BP, ...toWorldLocal(GC, 760, 300)), [cx, cy] = toWorld(BP, ...toWorldLocal(GC, 905, 400));
    cam.move(T.brent + 0.55, tB - T.brent - 0.5, { x: ax, y: ay - 90, s: 1.04, r: -0.4 }, 'sine.inOut');
    cam.move(tB + 0.1, tC - tB - 0.1, { x: bx, y: by - 15, s: 1.08, r: 0.5 }, 'sine.inOut');
    cam.move(tC + 0.05, tD - tC + 0.2, { x: cx, y: cy + 50, s: 1.48, r: -0.6 }, 'power3.inOut'); }

  // ---------------------------------------------------------------- 6 · the truce: ceasefire bulletin → memorandum → CLOSED / VOID
  const CN = { x: 1500, y: 120, w: 900, h: 600, rot: -3 };
  const MP = { x: 1850, y: 700, w: 760, h: 980, rot: 3 };
  cam.whip(T.cf, { x: CN.x - 60, y: CN.y - 20, s: 1.02, r: -0.6 }, { rotKick: 1.4 });
  const cn = DK.sheet(world, { ...CN, paper: 'ivory' });
  X.svg('rect', { x: 0, y: 0, width: CN.w, height: 70, fill: C.ink }, cn);
  DK.text(cn, 40, 48, 'BULLETIN', { f: 'lat', size: 30, ls: 12, fill: '#efe7d6' });
  DK.type(cn, CN.w - 40, 48, '8 APRIL 2026', W('truce', 'ceasefire') - 0.05, { size: 28, ls: 3, cps: 26, fill: '#efe7d6', anchor: 'end', cursor: false, gain: 0.25 });
  DK.text(cn, 40, 170, 'TEMPORARY', { size: 74, ls: 2 }); DK.text(cn, 40, 252, 'CEASEFIRE', { size: 74, ls: 2 });
  DK.type(cn, 44, 320, 'INCLUDES REOPENING THE STRAIT', W('truce', 'April') - 0.1, { size: 28, ls: 1, cps: 38, sfx: false });
  bars(cn, 44, 360, 520, 560, 26, 21);
  DK.pin(cn, 300, 20, 11);
  cam.move(T.cf + 0.52, T.memo - T.cf - 0.55, { x: CN.x - 20, y: CN.y + 10, s: 1.07, r: 0.3 }, 'sine.inOut');
  cam.whip(T.memo, { x: MP.x - 40, y: MP.y - 70, s: 1.0, r: 1.2 }, { dur: 0.32, rotKick: -1.0, gain: 0.4 });
  const mp = DK.sheet(world, { ...MP, paper: 'cream', big: true });
  DK.text(mp, MP.w / 2, 130, 'MEMORANDUM', { f: 'dm', size: 80, anchor: 'middle', ls: 3 });
  X.svg('line', { x1: 90, y1: 160, x2: MP.w - 90, y2: 160, stroke: C.ink, 'stroke-width': 1.5 }, mp);
  DK.type(mp, MP.w / 2 - DK.measure('ISLAMABAD · 17 JUNE 2026', 28, F.mono, 600, 3) / 2, 214, 'ISLAMABAD · 17 JUNE 2026', W('truce', 'Islamabad') - 0.15, { size: 28, ls: 3, cps: 30, gain: 0.25 });
  DK.text(mp, MP.w / 2, 262, 'to end the war', { f: 'lat', size: 30, style: 'italic', weight: 400, anchor: 'middle', fill: C.ink2 });
  const mr = X.rand(14); for (let k = 0; k < 7; k++) { const y0 = 320 + k * 66; DK.text(mp, 90, y0 + 12, '§', { f: 'lat', size: 26, fill: C.ink2 }); for (let j = 0; j < 2; j++) X.svg('rect', { x: 130, y: y0 + j * 22, width: (MP.w - 220) * (j ? 0.5 + mr() * 0.4 : 0.92), height: 9, fill: '#b7ae9e', opacity: 0.8 }, mp); }
  [[100, 860], [420, 860]].forEach(([x, y], i) => { X.svg('line', { x1: x, y1: y, x2: x + 240, y2: y, stroke: C.ink, 'stroke-width': 1.5 }, mp); DK.text(mp, x, y + 30, 'for the parties', { f: 'lat', size: 17, style: 'italic', weight: 400, fill: C.ink2 });
    const sr = X.rand(60 + i); let d = `M${x + 18},${y - 12}`; for (let k = 0; k < 7; k++) d += ` c${4 + sr() * 6},${-14 - sr() * 10} ${12 + sr() * 8},${-12 - sr() * 8} ${16 + sr() * 8},${(sr() - 0.3) * 10}`; d += ` q20,6 60,-8`;
    const sig = X.svg('path', { d, fill: 'none', stroke: '#24324a', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, mp); X.drawOn(sig, W('truce', 'signed') + i * 0.25, 0.45, 'power1.inOut'); });
  X.sfx(W('truce', 'signed'), 'scribble', { dur: 0.7, gain: 0.3 });
  DK.text(mp, MP.w / 2, MP.h - 34, 'schematic — not the text of the memorandum', { f: 'lat', size: 16, style: 'italic', weight: 400, anchor: 'middle', fill: C.faint });
  cam.move(T.memo + 0.47, T.each - T.memo - 0.5, { x: MP.x - 10, y: MP.y - 40, s: 1.06, r: 0.6 }, 'sine.inOut');
  cam.move(T.each, 0.5, { x: 1640, y: 470, s: 0.84, r: -0.4 }, 'power3.inOut');
  DK.stamp(cn, 'CLOSED', 600, 250, W('void', 'time'), { size: 92, rot: -8, sub: 'THE STRAIT, AGAIN', cam, shake: 5 });
  DK.stamp(mp, 'VOID', 390, 560, W('void', 'closed'), { size: 170, rot: -11, sub: 'STRAIT CLOSED AGAIN DAYS LATER', cam, shake: 8 });
  DK.tag(world, '8 JULY', 'INTERIM TRUCE COLLAPSES', 900, 820, W('void', 'again') + 0.05, { size: 46, rot: 3 });

  // ---------------------------------------------------------------- 7 · October: the incident ledger
  const LG = { x: -250, y: -40, w: 1000, h: 1180, rot: -1.5 };
  cam.whip(T.led, { x: LG.x + 20, y: LG.y - 300, s: 1.04, r: -0.8 }, { dur: 0.4, rotKick: 1.5 });
  const lgOuter = X.svg('g', { id: 'lgOuter' }, world);
  const lg = DK.sheet(lgOuter, { ...LG, paper: 'card', margin: 64 });
  DK.text(lg, 96, 84, 'MARITIME SECURITY', { f: 'lat', size: 38, ls: 8 });
  DK.type(lg, 98, 124, 'INCIDENT LEDGER · STRAIT OF HORMUZ AND APPROACHES', T.led + 0.45, { size: 20, ls: 1, cps: 46, gain: 0.2 });
  DK.text(lg, 96, 200, 'OCTOBER 2026', { size: 64, ls: 2 });
  X.svg('line', { x1: 90, y1: 226, x2: LG.w - 60, y2: 226, stroke: C.ink, 'stroke-width': 2.5 }, lg);
  [['VESSEL', 100], ['AREA', 470], ['INCIDENT', 760]].forEach(([t, x]) => DK.text(lg, x, 262, t, { f: 'mono', size: 20, ls: 4, fill: C.ink2 }));
  X.svg('line', { x1: 90, y1: 276, x2: LG.w - 60, y2: 276, stroke: C.ink, 'stroke-width': 1.2 }, lg);
  const areas = ['STRAIT', 'GULF OF OMAN', 'APPROACHES', 'STRAIT', 'STRAIT', 'THE GULF', 'APPROACHES', 'STRAIT', 'GULF OF OMAN', 'STRAIT', 'STRAIT', 'APPROACHES', 'THE GULF', 'STRAIT', 'GULF OF OMAN', 'STRAIT', 'APPROACHES', 'STRAIT', 'STRAIT', 'THE GULF', 'STRAIT'];
  const rr = X.rand(77), rT0 = W('october', 'ship') - 0.1, rT1 = WE('october', 'day') + 0.1, NR = areas.length;
  for (let i = 0; i < NR; i++) {
    const y = 312 + i * 38, row = X.svg('g', {}, lg), t = rT0 + (i / NR) * (rT1 - rT0);
    X.svg('line', { x1: 90, y1: y + 12, x2: LG.w - 60, y2: y + 12, stroke: C.blueLine, 'stroke-width': 1 }, lg);
    X.svg('rect', { x: 100, y: y - 12, width: 180 + rr() * 150, height: 11, fill: '#7d766b', opacity: 0.7 }, row);
    DK.text(row, 470, y, areas[i], { f: 'mono', size: 17, ls: 1, fill: C.ink2 });
    DK.text(row, 760, y, 'STRUCK', { f: 'mono', size: 20, ls: 3, fill: C.red, weight: 700 });
    X.svg('path', { d: `M72,${y - 8} l8,10 l14,-20`, fill: 'none', stroke: C.red, 'stroke-width': 3 }, row);
    popIn(row, t, { from: 1.08, sfx: i % 2 ? false : 'tick', gain: 0.18, dur: 0.12 });
  }
  X.sfx(rT0, 'type', { dur: rT1 - rT0, gain: 0.2 });
  DK.type(lg, 98, LG.h - 44, 'OCTOBER: SHIP ATTACKS AT A RECORD — REUTERS', rT1 - 0.2, { size: 22, ls: 1, cps: 40, sfx: false, fill: C.ink });
  cam.move(T.led + 0.55, rT0 - T.led - 0.6, { x: LG.x + 10, y: LG.y - 250, s: 1.08, r: -0.2 }, 'sine.inOut');
  cam.move(rT0, T.hole1 - rT0 - 0.05, { x: LG.x - 10, y: LG.y + 230, s: 1.12, r: 0.5 }, 'power1.inOut');

  // ---------------------------------------------------------------- 8 · torn hole → the pump price card (RECORD, $3.62 → $6.28)
  const PC = { x: -300, y: -1150, w: 1100, h: 740, rot: -1.5 };
  cam.cut(T.hole1 + 0.03, { x: PC.x + 20, y: PC.y + 10, s: 0.97, r: 0 });
  cam.move(T.hole1 + 0.04, 1.1, { s: 1.02, r: 0.4 }, 'power2.out');
  const holeState = cam.stateAt(T.hole1 - 0.001);
  DK.hole(T.hole1, { cx: 960, cy: 560, seed: 12, paint: (g) => { const s = holeState; const gg = X.svg('g', { transform: `translate(960,540) rotate(${s.r}) scale(${s.s}) translate(${-s.x},${-s.y})` }, g); X.svg('use', { href: '#deskImg' }, gg); X.svg('use', { href: '#lgOuter' }, gg); } });
  const pc = DK.sheet(world, { ...PC, paper: 'ivory', big: true }); showAt(pc.outer, T.hole1);
  X.svg('rect', { x: 0, y: 0, width: PC.w, height: 92, fill: C.ink }, pc);
  DK.text(pc, 44, 60, 'U.S. PUMP PRICE', { f: 'lat', size: 36, ls: 10, fill: '#efe7d6' });
  DK.text(pc, PC.w - 44, 58, 'ON-HIGHWAY · PER GALLON', { f: 'mono', size: 20, ls: 3, fill: '#cfc6b3', anchor: 'end' });
  DK.text(pc, 60, 210, 'DIESEL', { size: 96, ls: 3 });
  const win = X.svg('g', {}, pc); X.svg('rect', { x: 56, y: 262, width: 640, height: 260, fill: '#ece5d2', stroke: C.ink, 'stroke-width': 3 }, win); X.svg('rect', { x: 68, y: 274, width: 616, height: 236, fill: 'none', stroke: C.ink, 'stroke-width': 1 }, win);
  const dash = DK.text(pc, 676, 470, '$ –.––', { size: 196, anchor: 'end', ls: 2, fill: '#c9c0ac' }); tl.set(dash, { opacity: 0 }, W('diesel', 'Last') - 0.05);
  const price = DK.text(pc, 676, 470, '$ –.––', { size: 196, anchor: 'end', ls: 2 });
  const priceLab = DK.text(pc, 60, 566, '', { f: 'mono', size: 24, ls: 3, fill: C.ink2 });
  const tY = W('diesel', 'Last') - 0.05, tCU = W('diesel', 'averaged') - 0.1, tCE = WE('diesel', 'twenty-eight') - 0.05;
  X.every((t) => { const lab = t < tY ? '' : t < tCU + 0.05 ? 'A YEAR EARLIER' : 'WEEK OF 19 OCT 2026 · U.S. AVERAGE'; if (priceLab.textContent !== lab) priceLab.textContent = lab; });
  tl.set(price, { attr: { fill: C.ink } }, 0); tl.set(price, { attr: { fill: C.red } }, tCU);
  { let last = ''; const e = gsap.parseEase('power2.inOut'); X.every((t) => { let s; if (t < tY) s = '$ –.––'; else if (t < tCU) s = '$3.62'; else { const p = Math.min(1, (t - tCU) / (tCE - tCU)); s = '$' + (3.62 + (6.28 - 3.62) * e(p)).toFixed(2); } if (s !== last) { price.textContent = s; last = s; } }); }
  popIn(price, tY - 0.02, { origin: '100% 100%', from: 1.15, sfx: 'pop' });
  for (let k = 0; k < Math.floor((tCE - tCU) / 0.08); k++) X.sfx(tCU + k * 0.08, 'tick', { gain: 0.12, pitch: 1 + k * 0.012 });
  const tDiff = W('diesel', 'sixty-six') - 0.12;
  const brk = X.svg('path', { d: 'M730,300 h26 v180 h-26', fill: 'none', stroke: C.red, 'stroke-width': 4 }, pc);
  gsap.set(brk, { opacity: 0 }); tl.set(brk, { opacity: 1 }, tDiff - 0.2); X.drawOn(brk, tDiff - 0.2, 0.25);
  popIn(DK.text(pc, 780, 420, '+$2.66', { size: 92, fill: C.red }), tDiff, { sfx: 'pop', from: 1.3 });
  DK.type(pc, 784, 466, 'MORE THAN A YEAR AGO', WE('diesel', 'more') - 0.1, { size: 20, ls: 2, cps: 40, sfx: false, cursor: false, fill: C.red });
  DK.text(pc, 60, 650, 'EIA weekly average: $6.276 (19 Oct 2026), +$2.656 on a year earlier', { f: 'lat', size: 19, style: 'italic', weight: 400, fill: C.ink2 });
  DK.stamp(pc, 'RECORD', 860, 196, W('diesel', 'record'), { size: 96, rot: -7, sub: 'ALL-TIME HIGH FOR DIESEL', cam, shake: 6 });
  DK.tag(world, '4 SEPTEMBER', 'RECORD $5.85 · ABOVE JUNE 2022’S $5.8159', -200, -1010, W('diesel', 'fourth') - 0.12, { size: 44, rot: 2.5 });
  DK.pin(pc, PC.w / 2, 18, 11);
  { const [ax, ay] = toWorld(PC, 820, 280), [bx, by] = toWorld(PC, 420, 420), [cx, cy] = toWorld(PC, 640, 420);
    cam.move(W('diesel', 'diesel') - 0.25, 0.6, { x: ax - 120, y: ay + 60, s: 1.08, r: -0.6 }, 'power3.inOut');
    cam.move(W('diesel', 'fourth') - 0.3, tY - W('diesel', 'fourth') + 0.1, { x: ax - 60, y: ay + 110, s: 1.03, r: 0.3 }, 'sine.inOut');
    cam.move(tY - 0.15, 0.55, { x: bx, y: by, s: 1.16, r: 0.6 }, 'power3.inOut');
    cam.move(tDiff - 0.45, 0.55, { x: cx, y: cy, s: 1.12, r: -0.5 }, 'power3.inOut'); }

  // ---------------------------------------------------------------- 9 · word-card montage (hard cuts): DIESEL · TRUCKS · THE PRICE · EVERYTHING
  const mplates = {
    nozzle: DK.halftone((c, w, h) => { DK.ill.sky(c, w, h, '#f2f2f2', '#b0b0b0', 0.84); DK.ill.ground(c, w, h, h * 0.84, '#7a7a7a', '#2a2a2a'); c.fillStyle = '#1e1e1e'; c.fillRect(0, 0, w, h * 0.1); c.fillStyle = '#5a5a5a'; c.fillRect(0, h * 0.1, w, h * 0.025); c.fillStyle = '#2a2a2a'; c.fillRect(w * 0.84, h * 0.1, w * 0.035, h * 0.74); DK.ill.pump(c, w * 0.66, h * 0.86, 0.72); DK.ill.pump(c, w * 0.3, h * 0.92, 1.2); }, 820, 560, { seed: 11, cell: 7 }),
    truck: DK.halftone((c, w, h) => { DK.ill.sky(c, w, h, '#f0f0f0', '#bdbdbd', 0.64); DK.ill.ground(c, w, h, h * 0.64, '#8a8a8a', '#3a3a3a'); c.fillStyle = '#e6e6e6'; for (let i = 0; i < 9; i++) c.fillRect(i * w * 0.12, h * 0.8, w * 0.06, 6); DK.ill.truck(c, w * 0.08, h * 0.76, w * 0.84, {}); }, 980, 640, { seed: 12, cell: 7 }),
    boxes: DK.halftone((c, w, h) => { c.fillStyle = '#3a3a3a'; c.fillRect(0, 0, w, h); const g = c.createLinearGradient(0, 0, 0, h); g.addColorStop(0, '#7a7a7a'); g.addColorStop(1, '#1a1a1a'); c.fillStyle = g; c.fillRect(w * 0.08, h * 0.06, w * 0.84, h * 0.9); DK.ill.boxes(c, w * 0.5, h * 0.95, 1.15, 8); }, 820, 580, { seed: 13, cell: 7 }),
  };
  DK.card(T.c1, T.c2, { ground: 'black', word: 'DIESEL', gloss: 'MOVES THE TRUCKS', size: 230, wy: 560, plate: mplates.nozzle, pw: 820, ph: 560, px: 1420, py: 540, prot: -2, seed: 41, maxW: 820 });
  DK.card(T.c2, T.c3, { ground: 'paper', word: 'TRUCKS', gloss: 'FREIGHT RUNS ON DIESEL', strip: true, brush: true, size: 230, wy: 600, plate: mplates.truck, pw: 900, ph: 600, px: 1400, py: 520, prot: 1.5, seed: 42, maxW: 800 });
  DK.card(T.c3, T.c4, { ground: 'verm', word: 'THE PRICE', gloss: 'RIDES ALONG', size: 200, wx: 130, wy: 380, maxW: 1060, seed: 43,
    gag: (g, t0) => { // a paper truck drives in carrying the price tag
      const road = X.svg('g', {}, g); X.svg('rect', { x: -20, y: 860, width: 1960, height: 120, fill: '#2a1410', opacity: 0.55 }, road); for (let i = 0; i < 12; i++) X.svg('rect', { x: i * 180, y: 914, width: 90, height: 10, fill: '#efe2cc', opacity: 0.7 }, road);
      const tr = X.svg('g', {}, g);
      X.svg('rect', { x: -560, y: -260, width: 560, height: 230, fill: DK.pat('kraft', true), stroke: '#3a2a1a', 'stroke-width': 4, filter: 'url(#dkShO)' }, tr);
      for (let k = 1; k < 8; k++) X.svg('line', { x1: -560 + k * 70, y1: -256, x2: -560 + k * 70, y2: -34, stroke: '#7a5a3a', 'stroke-width': 2, opacity: 0.6 }, tr);
      X.svg('path', { d: 'M10,-30 L10,-200 L120,-200 L176,-120 L210,-110 L210,-30 Z', fill: '#1d1b18', filter: 'url(#dkShO)' }, tr);
      X.svg('path', { d: 'M100,-186 L150,-124 L100,-124 Z', fill: '#cfc6b3' }, tr);
      [-500, -430, -110, 60, 170].forEach((x) => { X.svg('circle', { cx: x, cy: -20, r: 34, fill: '#141210' }, tr); X.svg('circle', { cx: x, cy: -20, r: 13, fill: '#9a9080' }, tr); });
      X.svg('line', { x1: -280, y1: -260, x2: -280, y2: -330, stroke: '#1d1b18', 'stroke-width': 3 }, tr);
      const tag = X.svg('g', { transform: 'translate(-280,-330) rotate(-6)' }, tr); X.svg('path', { d: 'M-150,-110 L130,-110 L170,-55 L130,0 L-150,0 Z', fill: DK.pat('card', true), stroke: C.ink, 'stroke-width': 2, filter: 'url(#dkShO)' }, tag); X.svg('circle', { cx: 132, cy: -55, r: 9, fill: '#8d281b' }, tag);
      DK.text(tag, -130, -36, '$6.28', { size: 74, fill: C.ink }); DK.text(tag, 92, -64, '/GAL', { f: 'mono', size: 18, fill: C.ink2, anchor: 'end' });
      gsap.set(tr, { x: -400, y: 880 }); tl.fromTo(tr, { x: -400, y: 880 }, { x: 1580, y: 880, duration: 1.0, ease: 'power3.out', immediateRender: false }, t0 + 0.05);
      tl.fromTo(tag, { rotation: -20, svgOrigin: '-280 -330' }, { rotation: 0, duration: 1.1, ease: 'elastic.out(1,0.35)', immediateRender: false }, t0 + 0.2);
      X.sfx(t0 + 0.05, 'woosh_low', { dur: 0.8, gain: 0.4 }); } });
  DK.card(T.c4, T.ballot, { ground: 'paper', word: 'EVERYTHING', gloss: 'THEY CARRY', size: 200, wy: 440, maxW: 900, plate: mplates.boxes, pw: 720, ph: 520, px: 1500, py: 520, prot: -1.8, seed: 44,
    gag: (g, t0) => { const lab = ['FOOD', 'PARCELS', 'MEDICINE', 'LUMBER', 'CLOTHES', 'PARTS', 'PAPER', 'FEED']; const br = X.rand(19);
      lab.forEach((t, i) => { const b = X.svg('g', {}, g); const w = 200 + br() * 60, h = 120 + br() * 30; X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: DK.pat('kraft', true), stroke: '#5a4028', 'stroke-width': 3, filter: 'url(#dkShO)' }, b); X.svg('rect', { x: -14, y: -h / 2, width: 28, height: h, fill: '#d8c49a', opacity: 0.7 }, b); DK.text(b, 0, 10, t, { f: 'mono', size: 26, ls: 3, anchor: 'middle', fill: '#2a1d10' });
        const x1 = 190 + (i % 4) * 245 + br() * 30, y1 = 900 - Math.floor(i / 4) * 128, r1 = (br() - 0.5) * 16, t1 = t0 + 0.25 + i * 0.12;
        gsap.set(b, { x: x1, y: -200 }); tl.fromTo(b, { x: x1 + (br() - 0.5) * 200, y: -200, rotation: (br() - 0.5) * 90 }, { x: x1, y: y1, rotation: r1, duration: 0.42, ease: 'bounce.out', immediateRender: false }, t1); if (i % 2 === 0) X.sfx(t1 + 0.3, 'thud', { gain: 0.25 }); }); } });
  X.sfx(T.c1, 'impact', { gain: 0.35, dur: 0.8 });

  // ---------------------------------------------------------------- 10 · the ballot (hard cut, VOTE) → isotype seats on the tilted desk
  const BS = { x: 650, y: 40, w: 700, h: 840, rot: 2 };
  cam.cut(T.ballot, { x: BS.x + 10, y: BS.y - 10, s: 1.0, r: 0.4 });
  cam.move(T.ballot + 0.02, T.iso - T.ballot, { x: BS.x + 30, y: BS.y + 30, s: 1.08, r: -0.4 }, 'sine.inOut');
  const bs = DK.sheet(world, { ...BS, paper: 'ivory' }); bs.outer.setAttribute('id', 'bsOuter'); showAt(bs.outer, T.ballot - 0.01);
  DK.text(bs, BS.w / 2, 86, 'SPECIMEN BALLOT', { f: 'lat', size: 30, ls: 9, anchor: 'middle' });
  DK.text(bs, BS.w / 2, 160, 'GENERAL ELECTION', { size: 54, anchor: 'middle', ls: 1 });
  DK.type(bs, BS.w / 2 - DK.measure('3 NOVEMBER 2026', 30, F.mono, 600, 4) / 2, 214, '3 NOVEMBER 2026', T.ballot + 0.3, { size: 30, ls: 4, cps: 24, gain: 0.25 });
  X.svg('line', { x1: 60, y1: 240, x2: BS.w - 60, y2: 240, stroke: C.ink, 'stroke-width': 2.5 }, bs);
  const section = (y, title, n) => { X.svg('rect', { x: 60, y, width: BS.w - 120, height: 44, fill: C.ink }, bs); DK.text(bs, 76, y + 29, title, { f: 'mono', size: 17, ls: 1, fill: '#efe7d6' });
    for (let k = 0; k < n; k++) { const yy = y + 90 + k * 62; X.svg('ellipse', { cx: 100, cy: yy - 8, rx: 22, ry: 13, fill: 'none', stroke: C.ink, 'stroke-width': 2.4 }, bs); X.svg('rect', { x: 150, y: yy - 16, width: 300 + k * 37 % 120, height: 12, fill: '#b9b1a2', opacity: 0.8 }, bs); } };
  section(272, 'U.S. HOUSE OF REPRESENTATIVES · VOTE FOR ONE', 3);
  section(540, 'U.S. SENATE · VOTE FOR ONE', 2);
  DK.text(bs, BS.w / 2, BS.h - 30, 'specimen — no candidates or parties shown', { f: 'lat', size: 16, style: 'italic', weight: 400, anchor: 'middle', fill: C.faint });
  DK.tag(world, 'IN ONE WEEK', 'MIDTERMS · 3 NOVEMBER 2026', BS.x + 370, BS.y - 360, W('ballot', 'one') - 0.1, { size: 44, rot: -3, from: 'top' });
  DK.stamp(bs, 'VOTE', 400, 470, W('ballot', 'vote'), { size: 150, rot: -9, sub: '435 HOUSE · 35 SENATE SEATS', cam, shake: 6 });
  // isotype plane
  const fsv = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  fsv.setAttribute('width', 820); fsv.setAttribute('height', 960); fsv.setAttribute('viewBox', `${BS.x - 410} ${BS.y - 480} 820 960`); fsv.style.overflow = 'visible'; fsv.style.display = 'block';
  X.svg('use', { href: '#bsOuter' }, fsv);
  const iso = DK.isoRows({ tilt: 50, roll: -6, persp: 1500, flat: [{ svg: fsv, x: -1060, y: 340, rot: -8 }],
    blocks: [{ cols: 29, rows: 15, gap: 36, rowGap: 40, fh: 48, gx: -120, gy: 40, stagger: 0.3 }, { cols: 7, rows: 5, gap: 36, rowGap: 40, fh: 48, gx: 650, gy: 240, stagger: 0.3 }],
    stand: [
      { x: -760, y: -700, html: `<div style="font:900 104px ${F.head};color:${C.ink};letter-spacing:2px;text-shadow:0 6px 10px rgba(40,30,20,.25)">THE MIDTERMS</div><div style="font:600 32px ${F.mono};color:${C.ink2};letter-spacing:5px;margin-top:4px">3 NOVEMBER 2026</div><div style="font:500 26px ${F.mono};color:${C.ink2};letter-spacing:4px;margin-top:2px">ONE FIGURE = ONE SEAT</div>` },
      { x: 170, y: -700, html: `<div style="display:flex;align-items:flex-end;gap:22px"><div id="c435" style="font:900 190px/0.9 ${F.head};color:${C.red};text-shadow:0 8px 12px rgba(60,20,10,.25)">0</div><div style="font:900 44px/1.05 ${F.head};color:${C.red};padding-bottom:18px">HOUSE<br>SEATS</div></div><div style="font:600 26px ${F.mono};color:${C.red};letter-spacing:4px">ALL OF THEM ON THE BALLOT</div>` },
      { x: 560, y: -190, html: `<div style="display:flex;align-items:flex-end;gap:16px"><div id="c35" style="font:900 150px/0.9 ${F.head};color:${C.red};text-shadow:0 8px 12px rgba(60,20,10,.25)">0</div><div style="font:900 38px/1.05 ${F.head};color:${C.red};padding-bottom:14px">SENATE<br>SEATS</div></div>` },
    ] });
  iso.show(T.iso, T.hole2);
  iso.cam(T.iso - 0.01, { x: 2000, y: 80, z: -150, blur: 30 }, 0.001).cam(T.iso, { x: 150, y: 80, z: -150, blur: 0 }, 0.42, 'expo.out');
  iso.cam(T.iso + 0.42, { x: 40, y: 30, z: -40, roll: -4.5 }, T.hole2 - 0.5 - T.iso - 0.42, 'sine.inOut');
  X.sfx(T.iso + 0.02, 'whoosh', { dur: 0.45, gain: 0.5 });
  const tPop = Math.max(W('ballot', 'four') - 0.12, T.iso + 0.3), tS35 = W('ballot', 'thirty-five', 1) - 0.1;
  iso.figs.forEach((f) => { f.inT = f.block === 0 ? tPop + f.rowIdx * 0.07 + f.col * 0.006 : tS35 + f.rowIdx * 0.06 + f.col * 0.012; });
  for (let r = 0; r < 15; r++) X.sfx(tPop + r * 0.07, 'tick', { gain: 0.15, pitch: 1 + r * 0.02 });
  for (let r = 0; r < 5; r++) X.sfx(tS35 + r * 0.06, 'tick', { gain: 0.15, pitch: 1.3 + r * 0.02 });
  const rH0 = W('ballot', 'House') - 0.12, rH1 = WE('ballot', 'seats') + 0.05, rS0 = W('ballot', 'Senate') - 0.15, rS1 = WE('ballot', 'Senate') + 0.1;
  iso.figs.forEach((f) => { f.redT = f.block === 0 ? rH0 + ((f.col + f.rowIdx * 0.3) / 33) * (rH1 - rH0) : rS0 + ((f.col + f.rowIdx * 0.3) / 8.5) * (rS1 - rS0); });
  X.sfx(rH0, 'scribble', { dur: rH1 - rH0, gain: 0.25 }); X.sfx(rS0, 'scribble', { dur: rS1 - rS0, gain: 0.22 });
  iso.standIn = [T.iso + 0.45, tPop, tS35];
  const c435 = iso.stands[1].querySelector('#c435'), c35 = iso.stands[2].querySelector('#c35');
  { const e = gsap.parseEase('power1.out'); let a = '', b = ''; X.every((t) => { const p = Math.min(1, Math.max(0, (t - tPop) / 1.15)), q = Math.min(1, Math.max(0, (t - tS35) / 0.45)); const s1 = String(Math.round(e(p) * 435)), s2 = String(Math.round(e(q) * 35)); if (s1 !== a) { c435.textContent = s1; a = s1; } if (s2 !== b) { c35.textContent = s2; b = s2; } }); }
  iso.standOut = T.hole2 - 0.45;
  const ofr = X.rand(9); iso.rows.forEach((r) => { r.outT = T.hole2 - 0.5 + ofr() * 0.12; });
  iso.cam(T.hole2 - 0.42, { tilt: 0, roll: 0, z: 0 }, 0.36, 'power2.inOut');

  // ---------------------------------------------------------------- 11 · torn hole → the poll page (Reuters/Ipsos 49 %, AP-NORC 8 in 10)
  const PP = { x: -2200, y: 2350, w: 2300, h: 1350, rot: 0 };
  cam.cut(T.iso + 0.6, { x: PP.x - 90, y: PP.y + 45, s: 0.95, r: 0 });
  cam.move(T.hole2 + 0.1, 1.2, { s: 1.0, r: 0.4 }, 'power2.out');
  DK.hole(T.hole2, { cx: 960, cy: 560, seed: 8, paint: (g) => { const s = iso.stateAt(T.hole2); X.svg('image', { href: DK.deskURL, x: 960 - DK.deskW / 2 + s.x, y: 540 - DK.deskH / 2 + s.y, width: DK.deskW, height: DK.deskH, preserveAspectRatio: 'none' }, g); } });
  const pp = DK.sheet(world, { ...PP, paper: 'ivory', shadow: false });
  bars(pp, 160, 420, 330, 1260, 22, 3); bars(pp, 2050, 420, 2200, 1260, 22, 4);
  DK.text(pp, 360, 345, 'OPINION POLL', { f: 'lat', size: 64, ls: 12 });
  X.svg('line', { x1: 160, y1: 372, x2: 2140, y2: 372, stroke: C.ink, 'stroke-width': 3 }, pp); X.svg('line', { x1: 160, y1: 382, x2: 2140, y2: 382, stroke: C.ink, 'stroke-width': 1 }, pp);
  DK.type(pp, 362, 428, 'REUTERS/IPSOS · 16–19 OCTOBER 2026 · 1,679 U.S. ADULTS', L('poll').start + 0.05, { size: 24, ls: 2, cps: 40, gain: 0.22 });
  const PCd = { x: 820, y: 830, w: 1080, h: 700, rot: -1.5 };
  const pcd = DK.sheet(pp, { ...PCd, paper: 'card', lines: { y0: 150, step: 50 }, margin: 50 });
  DK.type(pcd, 80, 86, 'SINGLE MOST IMPORTANT FACTOR', W('poll', 'Reuters') + 0.4, { size: 28, ls: 2, cps: 36, sfx: false });
  DK.type(pcd, 80, 128, 'IN THEIR CONGRESSIONAL VOTE:', W('poll', 'Reuters') + 1.25, { size: 28, ls: 2, cps: 36, sfx: false, cursor: false });
  const ans1 = DK.text(pcd, 80, 236, 'a candidate’s position on', { f: 'lat', size: 38, style: 'italic', weight: 400 });
  const ans2 = DK.text(pcd, 80, 300, 'THE COST OF LIVING', { f: 'zh', size: 62, ls: 1 });
  popIn(ans1, W('poll', 'named') - 0.1, { sfx: false }); popIn(ans2, W('poll', 'cost') - 0.08, { sfx: 'pop' });
  const hlc = X.svg('rect', { x: 72, y: 250, width: DK.measure('THE COST OF LIVING', 62, F.zh, 900, 1) + 18, height: 64, fill: C.hilite, opacity: 0.5 }, pcd); pcd.insertBefore(hlc, ans2);
  gsap.set(hlc, { scaleX: 0, transformOrigin: '0% 50%' }); tl.fromTo(hlc, { scaleX: 0 }, { scaleX: 1, duration: 10 / 30, ease: 'none', immediateRender: false }, WE('poll', 'living') + 0.02); X.sfx(WE('poll', 'living'), 'scribble', { dur: 0.33, gain: 0.3 });
  const cnt49 = DK.text(pcd, 1010, 560, '0%', { size: 230, fill: C.red, anchor: 'end' });
  const t49 = W('poll', 'forty-nine') - 0.05, t49e = WE('poll', 'percent');
  showAt(cnt49, t49 - 0.02);
  DK.counter(cnt49, 0, 49, t49, t49e - t49, { fmt: (v) => Math.round(v) + '%', ease: 'power2.out' });
  DK.text(pcd, 1008, 612, 'OF ADULTS', { f: 'mono', size: 22, ls: 4, anchor: 'end', fill: C.red });
  const dots = [];
  for (let j = 0; j < 10; j++) for (let i = 0; i < 10; i++) { const d = X.svg('circle', { cx: 100 + i * 34, cy: 390 + j * 28, r: 11, fill: 'none', stroke: C.ink2, 'stroke-width': 1.6 }, pcd); dots.push(d); }
  dots.forEach((d, k) => { const t = t49 + (k / 49) * (t49e - t49); if (k < 49) { tl.set(d, { attr: { fill: C.red, stroke: C.red } }, t); } });
  DK.text(pcd, 100, 690 - 12, 'each dot = 1 %', { f: 'lat', size: 18, style: 'italic', weight: 400, fill: C.ink2 });
  const AP = { x: 1760, y: 660, w: 640, h: 470, rot: 3 };
  const ap = DK.sheet(pp, { ...AP, paper: 'slip', edge: 'torn', jag: 5, seed: 71 });
  DK.pin(ap, AP.w / 2, 18, 11);
  DK.text(ap, 50, 86, 'AP-NORC · 8–12 OCT 2026', { f: 'mono', size: 24, ls: 2 });
  ['about 8 in 10 registered voters', 'want Congress to make', 'affordability a top priority'].forEach((t, i) => DK.text(ap, 50, 150 + i * 42, t, { f: 'lat', size: 30, style: 'italic', weight: 400 }));
  const tAP = W('poll', 'single') + 0.2;
  for (let i = 0; i < 10; i++) { const f = X.svg('g', { transform: `translate(${60 + i * 54},${300}) scale(0.62)` }, ap); X.svg('circle', { cx: 30, cy: 13, r: 12 }, f); X.svg('path', { d: 'M14 30 Q30 24 46 30 L58 52 L52 56 L44 44 L44 70 L41 116 L33 116 L30 82 L27 116 L19 116 L16 70 L16 44 L8 56 L2 52 Z' }, f); f.setAttribute('fill', '#d8cfbd'); tl.set(f, { attr: { fill: i < 8 ? C.ink : '#d8cfbd' } }, tAP + 0.3 + i * 0.07); popIn(f, tAP + 0.1 + i * 0.05, { origin: '50% 100%', from: 0.3, sfx: i % 3 ? false : 'tick', gain: 0.15 }); }
  DK.text(ap, 50, 420, 'supporting figure · not narrated', { f: 'lat', size: 16, style: 'italic', weight: 400, fill: C.faint });
  { const [ax, ay] = toWorld(PP, ...toWorldLocal(PCd, 760, 380)), [bx, by] = toWorld(PP, 1380, 640);
    cam.move(t49 - 0.35, 0.55, { x: ax - 40, y: ay - 60, s: 1.06, r: -0.5 }, 'power3.inOut');
    cam.move(tAP - 0.25, 0.6, { x: bx, y: by, s: 1.06, r: 0.6 }, 'power3.inOut'); }

  // ---------------------------------------------------------------- 12 · Israel votes today (VOTE) with the ballot box
  const IS = { x: -1650, y: 120, w: 1100, h: 640, rot: 2 };
  cam.whip(T.isr, { x: IS.x + 30, y: IS.y + 10, s: 1.04, r: 0.8 }, { dur: 0.42, rotKick: -1.6 });
  const is = DK.sheet(world, { ...IS, paper: 'cream', edge: 'deckle', seed: 18 }); showAt(is.outer, T.isr);
  DK.text(is, 60, 160, 'ISRAEL', { size: 120, ls: 3 });
  DK.text(is, 64, 222, 'GENERAL ELECTION', { f: 'lat', size: 34, ls: 9 });
  DK.type(is, 64, 290, '27 OCTOBER 2026 · TODAY', W('israel', 'today') - 0.1, { size: 30, ls: 3, cps: 26, gain: 0.25 });
  DK.type(is, 64, 350, 'the first since the war with Iran began', W('israel', 'first') - 0.05, { f: 'lat', size: 28, style: 'italic', weight: 400, cps: 34, sfx: false, cursor: false, fill: C.ink2 });
  bars(is, 64, 410, 560, 560, 26, 31);
  const BB = { x: 830, y: 410 };   // ballot box centre (local)
  const bbox = X.svg('g', { transform: `translate(${BB.x},${BB.y})` }, is);
  X.svg('path', { d: 'M-150,-60 L150,-60 L150,170 L-150,170 Z', fill: DK.pat('kraft'), stroke: '#3a2a1a', 'stroke-width': 4, filter: 'url(#dkSh)' }, bbox);
  X.svg('path', { d: 'M-150,-60 L-100,-130 L200,-130 L150,-60 Z', fill: '#cfae7c', stroke: '#3a2a1a', 'stroke-width': 4 }, bbox);
  X.svg('path', { d: 'M150,-60 L200,-130 L200,100 L150,170 Z', fill: '#9c7a4c', stroke: '#3a2a1a', 'stroke-width': 4 }, bbox);
  X.svg('path', { d: 'M-60,-98 L80,-98 L70,-88 L-70,-88 Z', fill: '#1d1408' }, bbox);
  DK.text(bbox, 0, 70, 'BALLOTS', { f: 'mono', size: 26, ls: 6, anchor: 'middle', fill: '#2a1d10' });
  const env = X.svg('g', {}, bbox); X.svg('rect', { x: -40, y: -170, width: 110, height: 80, fill: DK.pat('card'), stroke: C.ink2, 'stroke-width': 1.5, transform: 'rotate(-4)' }, env); X.svg('path', { d: 'M-40,-170 L15,-130 L70,-170', fill: 'none', stroke: C.ink2, 'stroke-width': 1.5, transform: 'rotate(-4)' }, env);
  const envClip = X.svg('clipPath', { id: 'envClip' }, X.defs); X.svg('rect', { x: -300, y: -600, width: 600, height: 505 }, envClip); env.setAttribute('clip-path', 'url(#envClip)');
  const envIn = X.svg('g', {}, env); [...env.childNodes].filter((n) => n !== envIn).forEach((n) => envIn.appendChild(n));
  tl.fromTo(envIn, { y: -80 }, { y: 0, duration: 0.35, ease: 'power2.out', immediateRender: false }, W('israel', 'Israel') - 0.15);
  tl.fromTo(envIn, { y: 0 }, { y: 160, duration: 0.4, ease: 'power2.in', immediateRender: false }, W('israel', 'votes') + 0.25);
  X.sfx(W('israel', 'votes') + 0.55, 'slide', { gain: 0.3, dur: 0.2 });
  DK.stamp(is, 'VOTE', 420, 470, W('israel', 'votes'), { size: 120, rot: -8, sub: 'ISRAEL · 27 OCTOBER 2026', cam, shake: 6 });
  cam.move(T.isr + 0.57, T.pb - T.isr - 0.6, { x: IS.x + 90, y: IS.y + 40, s: 1.09, r: -0.3 }, 'sine.inOut');

  // ---------------------------------------------------------------- 13 · nested pull-back (ballot ⊂ pump ⊂ strait) → bill into the box → dive → TOLL
  const pbG = X.svg('g', {}, world);
  gsap.set(pbG, { opacity: 0 }); tl.set(pbG, { opacity: 1 }, T.pb - 0.25);
  const holeMask = (id, w, h, hw, hh, seed) => {
    const m = X.svg('mask', { id, maskUnits: 'userSpaceOnUse', x: -w / 2, y: -h / 2, width: w, height: h }, X.defs);
    X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: '#fff' }, m);
    const r = X.rand(seed), pts2 = []; for (let i = 0; i < 44; i++) { const a = (i / 44) * Math.PI * 2; pts2.push([Math.cos(a) * hw * (1 + (r() - 0.5) * 0.12), Math.sin(a) * hh * (1 + (r() - 0.5) * 0.12)]); }
    const d = polyOf(pts2); X.svg('path', { d, fill: '#000' }, m); return d; };
  const midG = X.svg('g', { transform: `translate(${IS.x},${IS.y}) rotate(1)` }, pbG);
  const dMid = holeMask('pbMid', 3600, 2400, 780, 470, 4);
  const midPage = X.svg('g', { mask: 'url(#pbMid)' }, midG);
  X.svg('rect', { x: -1800, y: -1200, width: 3600, height: 2400, fill: DK.pat('ivory'), filter: 'url(#dkShL)' }, midPage);
  X.svg('rect', { x: -1800, y: -1000, width: 3600, height: 120, fill: C.ink }, midPage);
  DK.text(midPage, -1420, -918, 'U.S. PUMP PRICE · DIESEL', { f: 'lat', size: 48, ls: 10, fill: '#efe7d6' });
  DK.text(midPage, 1420, -620, '$6.28', { size: 230, anchor: 'end', fill: C.ink, op: 0.85 });
  const mr2 = X.rand(6); for (let y = -840; y < 1150; y += 26) { X.svg('rect', { x: -1420, y, width: 460 * (0.8 + mr2() * 0.2), height: 9, fill: '#b9b1a2', opacity: 0.7 }, midPage); if (y > -400) X.svg('rect', { x: 960, y, width: 460 * (0.8 + mr2() * 0.2), height: 9, fill: '#b9b1a2', opacity: 0.7 }, midPage); }
  X.svg('path', { d: dMid, fill: 'none', stroke: '#f6f1e6', 'stroke-width': 8, filter: 'url(#dkShS)' }, midG);
  const outG = X.svg('g', { transform: `translate(${IS.x},${IS.y})` }, pbG);
  const OW = 8000, OH = 5000;
  const dOut = holeMask('pbOut', OW, OH, 1640, 1000, 9);
  const outLay = X.svg('g', { mask: 'url(#pbOut)' }, outG);
  X.svg('rect', { x: -OW / 2, y: -OH / 2, width: OW, height: OH, fill: DK.pat('sea') }, outLay);
  { const S = 4.2, P2 = (lon, lat) => { const [x, y] = PG(lon, lat); return [(x - 625) * S + 576, (y - 430) * S - 871]; };
    [north, south, qeshmR].forEach((p) => X.svg('path', { d: polyOf(p.map(([a, b]) => P2(a, b))), fill: DK.pat('land'), stroke: C.ink, 'stroke-width': 4, 'stroke-linejoin': 'round' }, outLay));
    const [sx, sy] = P2(56.45, 26.6); DK.pin(outLay, sx, sy, 30);
    DK.text(outLay, sx + 50, sy + 110, 'HORMUZ', { f: 'lat', size: 70, ls: 10 }); }
  X.svg('path', { d: dOut, fill: 'none', stroke: '#efe7d6', 'stroke-width': 12, filter: 'url(#dkShL)' }, outG);
  cam.move(T.pb, 2.0, { x: IS.x + 30, y: IS.y + 60, s: 0.5, r: 1.2 }, 'expo.out');
  X.sfx(T.pb, 'zoom_out', { dur: 0.9, gain: 0.35 });
  DK.tag(is, 'THE VOTE', 'BALLOT BOX', 90, 560, T.pb + 0.45, { size: 80, rot: -3, from: 'top' });
  DK.tag(midG, 'THE PUMP', 'DIESEL · FREIGHT · PRICES', -1300, -560, T.pb + 0.8, { size: 120, rot: -4, from: 'top' });
  DK.tag(outG, 'THE STRAIT', 'TWENTY-ONE MILES OF WATER', -1850, 700, W('close', 'water') - 0.1, { size: 170, rot: 3, from: 'top' });
  // the bill slides into the ballot box
  const [bbx, bby] = toWorld(IS, BB.x + 10, BB.y - 100);
  const bill = X.svg('g', {}, world);
  const billIn = X.svg('g', { transform: `translate(${bbx},${bby})` }, bill);
  const billClip = X.svg('clipPath', { id: 'billClip' }, X.defs); X.svg('rect', { x: bbx - 200, y: bby - 600, width: 400, height: 602 }, billClip);
  bill.setAttribute('clip-path', 'url(#billClip)');
  const slip = X.svg('g', {}, billIn);
  X.svg('path', { d: X.torn(150, 230, 3, 88, 8), transform: 'translate(-75,-230)', fill: DK.pat('card'), stroke: '#c9c1ad', 'stroke-width': 1, filter: 'url(#dkShS)' }, slip);
  DK.text(slip, 0, -192, 'BILL', { f: 'mono', size: 30, ls: 6, anchor: 'middle', weight: 700 });
  ['FUEL', 'FREIGHT', 'FOOD'].forEach((t, i) => { DK.text(slip, -56, -146 + i * 34, t, { f: 'mono', size: 18, ls: 2 }); X.svg('rect', { x: 20, y: -158 + i * 34, width: 36, height: 8, fill: '#9a9282' }, slip); });
  X.svg('line', { x1: -56, y1: -40, x2: 56, y2: -40, stroke: C.ink, 'stroke-width': 1.5, 'stroke-dasharray': '4 4' }, slip);
  DK.text(slip, -56, -14, 'DUE', { f: 'mono', size: 20, ls: 3, weight: 700 });
  const tBill0 = W('close', 'bill') - 0.1, tBill1 = W('close', 'ballot') + 0.15;
  gsap.set(slip, { y: -900 }); showAt(billIn, tBill0);
  tl.fromTo(slip, { y: -900, rotation: -8 }, { y: -40, rotation: -2, duration: 0.45, ease: 'power3.out', immediateRender: false }, tBill0);
  tl.fromTo(slip, { y: -40, rotation: -2 }, { y: 250, rotation: 0, duration: tBill1 - tBill0 - 0.45, ease: 'power2.in', immediateRender: false }, tBill0 + 0.45);
  X.sfx(tBill0, 'paper', { gain: 0.45, dur: 0.3 }); X.sfx(tBill1 - 0.05, 'slide', { gain: 0.4, dur: 0.25 }); X.sfx(tBill1, 'thud', { gain: 0.35 });
  cam.move(W('close', 'And') - 0.1, T.dive - W('close', 'And') + 0.05 - 0.1, { x: bbx, y: bby + 30, s: 0.98, r: -0.4 }, 'sine.inOut');
  cam.zoom(T.dive, { x: bbx, y: bby + 4, s: 3.6, r: 2 }, { dur: 0.42 });

  // ---------------------------------------------------------------- 14 · title certificate: TOLL
  DK.titleCard(T.title, { word: 'TOLL', size: 420, gx: 120, gy: 760, ls: 6, maxW: 1080, kicker: 'CERTIFICATE OF PASSAGE', serial: 'No. 27-10-2026 · SERIES H',
    title: 'TOLL, n.', sub: 'a charge for passage;', sub2: 'the cost of a war, counted', promise: 'THE STRAIT FILE · 27 OCTOBER 2026', micro: 'THE STRAIT FILE · 21 MILES OF WATER · ', tGlyph: T.title + 0.5 });
  const vt = DK.vignette();
  vt.to(T.title + 1.2, 0.001, { r: 1700, dark: 0, soft: 0.6 }).to(T.title + 1.25, 3.4, { r: 1050, dark: 0.5 }, 'sine.inOut');

  // ---------------------------------------------------------------- vignette track: iris hook, radio spotlight
  const vig = DK.vignette({ r: 0, dark: 1, soft: 0.5 });
  vig.to(T.iris, 0.32, { r: 600, dark: 0.95 }, 'power2.out');
  vig.to(T.zoom - 0.05, 0.25, { r: 2600, dark: 0 }, 'power1.in');
  vig.to(T.radio, 0.001, { r: 760, dark: 0.7, soft: 0.6 }).to(T.radio + 0.02, 0.5, { r: 840, dark: 0.62 }, 'sine.out');
  vig.to(T.nopass - 0.1, 0.12, { r: 980, dark: 0.45 }, 'power2.out');
  vig.to(T.brent, 0.2, { r: 2600, dark: 0 }, 'power2.in');
  DK.flash(T.rup, { peak: 0.7, dur: 0.12 });

  // ---------------------------------------------------------------- HUD + source lines (every sheet cites FACTS.md)
  const hud = DK.hud('THE STRAIT FILE', 'THE WATER');
  hud.chapter(T.war, 'THE WAR').chapter(T.brent, 'THE MARKETS').chapter(T.cf, 'THE TRUCE').chapter(T.led, 'THE SEA LANES').chapter(T.hole1, 'THE PUMP').chapter(T.ballot, 'THE VOTE');
  hud.slug(0, 'STRAIT OF HORMUZ').slug(T.zoom, '2024 · STRAIT OF HORMUZ').slug(T.war, '28 FEB 2026 · IRAN').slug(T.radio, '28 FEB 2026 · VHF RADIO')
    .slug(T.brent, '8 MAR 2026 · OIL MARKETS').slug(T.cf, '8 APR 2026 · CEASEFIRE').slug(T.memo, '17 JUN 2026 · ISLAMABAD').slug(T.led, 'OCT 2026 · STRAIT OF HORMUZ')
    .slug(T.hole1, '19 OCT 2026 · UNITED STATES').slug(T.ballot, '3 NOV 2026 · UNITED STATES').slug(T.hole2, '16–19 OCT 2026 · UNITED STATES').slug(T.isr, '27 OCT 2026 · ISRAEL');
  hud.source(T.zoom, 'Strait ≈ 21 miles at its narrowest, each lane ≈ 2 miles — US EIA, World Oil Transit Chokepoints · ≈ 20 million b/d in 2024 — EIA Today in Energy (Jun 2025) · chart schematic')
    .source(T.fifth, '≈ 20 % of world petroleum liquids consumption, 2024 — US EIA, Today in Energy id=65504 (June 2025)')
    .source(T.war, '28 Feb 2026: US–Israeli strikes on Iran — Wikipedia, “2026 Strait of Hormuz crisis” · plates are original halftone drawings, not photographs')
    .source(T.radio, 'IRGC radio warning to ships, paraphrased — Wikipedia, “Timeline of the 2026 Iran war”; AP via Click2Houston, 2 Mar 2026')
    .source(T.brent, 'Brent above $100 on 8 Mar 2026, first time in four years; peak $126 — Wikipedia, “2026 Strait of Hormuz crisis” · line schematic')
    .source(T.cf, 'Ceasefire 8 Apr · Islamabad Memorandum 17 Jun · strait closed again days later · truce collapsed 8 Jul — Wikipedia · documents schematic')
    .source(T.led, 'A ship struck almost every day in October (IMO) — USNI News, 9 Oct 2026 · record attacks (Reuters) — The National, 13 Oct 2026 · ledger schematic')
    .source(T.hole1, 'Diesel $6.276/gal, week of 19 Oct 2026, +$2.656 y/y — US EIA (20 Oct 2026) · record $5.85 on 4 Sep 2026 — AAA via Fox Business')
    .source(T.c1, 'Illustrations are original halftone drawings · diesel $6.28/gal — US EIA, week of 19 Oct 2026')
    .source(T.ballot, '3 Nov 2026: all 435 House seats and 35 Senate seats — Sinclair Fact Check Team; Stony Brook Civic Justice guide · specimen ballot')
    .source(T.iso + 0.3, 'One figure = one seat · 435 House + 35 Senate seats on 3 Nov 2026 — Sinclair Fact Check Team; Stony Brook Civic Justice guide')
    .source(T.hole2, 'Reuters/Ipsos, 16–19 Oct 2026, 1,679 adults (via EconoTimes, UNI, ARY) · AP-NORC, 8–12 Oct 2026 (via Fox TV stations, Outlook India)')
    .source(T.isr, 'Israel general election, 27 Oct 2026, the first since the war with Iran began — CNN and NBC live blogs, 27 Oct 2026')
    .source(T.pb, 'THE STRAIT FILE · every figure from the fact sheet checked 27 Oct 2026 (FACTS.md)')
    .source(T.title, '');
  hud.hide(0, T.zoom + 0.25).hide(T.c1, T.ballot).hide(T.title, END + 1);
  hud.colorAt.push([T.c1, T.c2], [T.c3, T.c4], [T.radio, T.brent]);

  X.grain(0.045, 12);
  X.end(END);
});
