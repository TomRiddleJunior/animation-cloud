/* 纸上谈钱 · 马克 — "When a banknote was worth less than paper": Germany's 1923 hyperinflation as a paper dossier.
 * Style: dossier-editorial (desk of protest posters, whip pans with motion blur, red judgement stamps, bilingual
 * Chinese + English documents, word-card montage, isotype on a tilted plane, torn-hole iris, nested pull-back,
 * one-character certificate title). All facts are standard textbook figures; maps / notes / notice are schematic. */
X.boot(async (X) => {
  await X.loadVO();
  DK.init(X);
  const C = DK.C, F = DK.F, tl = X.tl;
  const L = (id) => X.line(id), W = (id, p, n = 0) => DK.word(id, p, n), WE = (id, p, n = 0) => DK.wordEnd(id, p, n);
  const END = X.vo.duration || 70;
  const R = (deg) => (deg * Math.PI) / 180;
  const toWorld = (s, lx, ly) => { const a = R(s.rot || 0), dx = lx - s.w / 2, dy = ly - s.h / 2; return [s.x + dx * Math.cos(a) - dy * Math.sin(a), s.y + dx * Math.sin(a) + dy * Math.cos(a)]; };

  // ================================================================ key times (on narration phrases)
  const T = {};
  T.iris = 0.25; T.slug = 0.8;
  T.rup = L('hook').end + 0.14;
  T.feizhi = W('hook2', '废纸');
  T.er = L('rate1').start - 0.42;
  T.gm = L('ruhr').start - 0.36;
  T.ruhrWord = W('ruhr', '鲁尔区');
  T.zoom = WE('ruhr', '鲁尔区') + 0.12;
  T.c1 = L('strike').start - 0.12; T.c2 = W('strike', '工人') - 0.06; T.c3 = W('strike', '工资') - 0.06;
  T.c4 = L('print').start - 0.1; T.yin = W('print', '印');
  T.ns = L('prices').start - 0.42;
  T.iso = L('losers').start - 0.36;
  T.hole = L('winners').start - 0.22;
  T.rd = L('renten').start - 0.36;
  T.cap = W('renten', '限死');
  T.ch = T.cap + 0.5;
  T.stop = W('stop', '停');
  T.pb = L('trust').start - 0.08;
  T.dive = L('trust').end + 0.06;
  T.title = T.dive + 0.36;

  // ================================================================ world: desk + camera
  const cam = DK.camera({ x: -1500, y: -1000, s: 1, r: -0.6, rate: 0.0095, rd: 0.12 });
  const world = cam.g;
  DK.desk(world, { seed: 41 });

  // ---------------------------------------------------------------- 1 · the banknote under the iris
  const N = { x: -1500, y: -1000, w: 820, h: 430, rot: -4 };
  const noteArt = X.svg('g', { id: 'noteArt' }, X.defs);
  X.svg('rect', { width: N.w, height: N.h, fill: DK.pat('note') }, noteArt);
  DK.guilloche(noteArt, 0, 0, N.w, N.h, { color: C.noteInk, op: 0.6, band: 24, per: 22 });
  DK.rosette(noteArt, 175, 215, 118, { color: C.noteInk, op: 0.75, k: 0.42 });
  DK.text(noteArt, 175, 228, 'M', { f: 'lat', size: 54, fill: C.noteInk, anchor: 'middle' });
  DK.text(noteArt, 330, 190, '1 000 000', { f: 'lat', size: 84, fill: C.noteInk, ls: 2 });
  DK.text(noteArt, 334, 268, 'MARK', { f: 'lat', size: 62, fill: C.noteInk, ls: 16 });
  DK.text(noteArt, 336, 316, 'EINE MILLION MARK', { f: 'mono', size: 22, fill: C.noteInk, ls: 4 });
  DK.text(noteArt, 336, 360, 'Berlin, 1923', { f: 'lat', size: 22, style: 'italic', weight: 400, fill: C.noteInk });
  DK.text(noteArt, 780, 70, 'No 4 271 908', { f: 'mono', size: 20, fill: C.brown, anchor: 'end' });
  for (let k = 0; k < 5; k++) X.svg('line', { x1: 600, y1: 300 + k * 14, x2: 770, y2: 300 + k * 14, stroke: C.noteInk, 'stroke-width': 3, opacity: 0.35 }, noteArt);
  const noteG = X.svg('g', { transform: `translate(${N.x},${N.y}) rotate(${N.rot}) translate(${-N.w / 2},${-N.h / 2})` }, world);
  const zig = []; for (let i = 0; i <= 16; i++) zig.push([430 - i * 2.6 + (i % 2 ? 20 : -20), -12 + i * (N.h + 24) / 16]);
  const cpL = X.svg('clipPath', { id: 'noteL' }, X.defs), cpR = X.svg('clipPath', { id: 'noteR' }, X.defs);
  X.svg('path', { d: `M-20,-20 ${zig.map((p) => `L${p[0]},${p[1]}`).join(' ')} L-20,${N.h + 20}Z` }, cpL);
  X.svg('path', { d: `M${N.w + 20},-20 ${zig.map((p) => `L${p[0]},${p[1]}`).join(' ')} L${N.w + 20},${N.h + 20}Z` }, cpR);
  const half = (cp) => { const g = X.svg('g', { filter: 'url(#dkSh)' }, noteG); X.svg('use', { href: '#noteArt', 'clip-path': `url(#${cp})` }, g); return g; };
  const nL = half('noteL'), nR = half('noteR');
  const whole = X.svg('g', { filter: 'url(#dkSh)' }, noteG); X.svg('use', { href: '#noteArt' }, whole);
  gsap.set([nL, nR], { opacity: 0 }); tl.set([nL, nR], { opacity: 1 }, T.rup); tl.set(whole, { opacity: 0 }, T.rup);
  // the typed slug label under the note
  const slugS = DK.sheet(world, { x: -1520, y: -715, w: 560, h: 64, rot: -3, edge: 'torn', jag: 4, seed: 12, paper: 'card' });
  DK.type(slugS, 30, 43, 'BERLIN · NOVEMBER 1923', T.slug, { size: 28, ls: 3, cps: 16, gain: 0.25 });

  // ---------------------------------------------------------------- 2 · rupture: flash, tear, plates slam in
  const plateDefs = {
    queue: DK.halftone((c, w, h, r) => {
      DK.ill.sky(c, w, h, '#f0f0f0', '#c4c4c4', 0.62); DK.ill.ground(c, w, h, h * 0.78, '#9a9a9a', '#4a4a4a');
      c.fillStyle = '#5a5a5a'; c.fillRect(w * 0.55, h * 0.2, w * 0.45, h * 0.6); c.fillStyle = '#d9d9d9'; c.fillRect(w * 0.6, h * 0.32, w * 0.32, h * 0.3);
      for (let k = 0; k < 7; k++) { c.fillStyle = k % 2 ? '#e0e0e0' : '#7a7a7a'; c.fillRect(w * 0.55 + k * w * 0.065, h * 0.18, w * 0.065, h * 0.07); }
      for (let i = 0; i < 11; i++) DK.ill.person(c, w * 0.08 + i * w * 0.05, h * 0.86 + (r() - 0.5) * 6, h * (0.42 + r() * 0.1), { hat: r() < 0.5, cap: r() >= 0.5, flip: true });
    }, 560, 390, { seed: 3, cell: 6 }),
    press: DK.halftone((c, w, h) => { DK.ill.sky(c, w, h, '#cfcfcf', '#8a8a8a', 1); DK.ill.press(c, w * 0.42, h * 0.86, 0.62); DK.ill.person(c, w * 0.13, h * 0.9, h * 0.5, { cap: true }); }, 560, 380, { seed: 4, cell: 6 }),
    factory: DK.halftone((c, w, h) => { DK.ill.sky(c, w, h, '#f4f4f4', '#bdbdbd', 0.7); DK.ill.factory(c, w * 0.06, h * 0.8, w * 0.88, h * 0.26, {}); DK.ill.ground(c, w, h, h * 0.8, '#8c8c8c', '#3a3a3a'); for (let i = 0; i < 4; i++) DK.ill.soldier(c, w * (0.58 + i * 0.09), h * 0.95, h * 0.42, {}); }, 600, 400, { seed: 5, cell: 6 }),
    notes: DK.halftone((c, w, h) => { c.fillStyle = '#9a9a9a'; c.fillRect(0, 0, w, h); DK.ill.notes(c, w * 0.5, h * 0.55, 0.85, X.rand(12)); }, 520, 360, { seed: 6, cell: 6 }),
    crowd: DK.halftone((c, w, h, r) => { DK.ill.sky(c, w, h, '#ededed', '#bcbcbc', 0.6); c.fillStyle = '#3c3c3c'; c.fillRect(w * 0.05, h * 0.18, w * 0.12, h * 0.62); c.fillRect(w * 0.83, h * 0.18, w * 0.12, h * 0.62); c.fillRect(w * 0.05, h * 0.12, w * 0.9, h * 0.08); DK.ill.ground(c, w, h, h * 0.8, '#8c8c8c', '#3a3a3a'); for (let i = 0; i < 12; i++) DK.ill.person(c, w * 0.12 + i * w * 0.068 + (r() - 0.5) * 10, h * (0.9 + (i % 2) * 0.05), h * (0.5 + r() * 0.08), { cap: true, arms: 'folded', flip: i % 2 }); }, 980, 680, { seed: 7, cell: 7 }),
    facade: DK.halftone((c, w, h, r) => { DK.ill.sky(c, w, h, '#f0f0f0', '#cdcdcd', 0.75); DK.ill.facade(c, w * 0.12, h * 0.78, w * 0.76, h * 0.42); DK.ill.ground(c, w, h, h * 0.78, '#a0a0a0', '#585858'); for (let i = 0; i < 3; i++) DK.ill.person(c, w * (0.38 + i * 0.1), h * 0.93, h * 0.36, { hat: true }); }, 600, 420, { seed: 8, cell: 6 }),
    pressBig: DK.halftone((c, w, h) => { DK.ill.sky(c, w, h, '#d6d6d6', '#7a7a7a', 1); DK.ill.press(c, w * 0.36, h * 0.9, 1.25); DK.ill.person(c, w * 0.08, h * 0.95, h * 0.55, { cap: true }); DK.ill.person(c, w * 0.9, h * 0.95, h * 0.5, { cap: true, flip: true }); }, 1700, 900, { seed: 9, cell: 8 }),
  };
  const slam = (el, t, ox, oy) => { gsap.set(el, { opacity: 0 }); tl.fromTo(el, { opacity: 0.5, scale: 1.22, svgOrigin: `${ox} ${oy}` }, { opacity: 1, scale: 1, duration: 3 / 30, ease: 'power3.out', immediateRender: false }, t); X.sfx(t, 'shutter', { gain: 0.35 }); X.sfx(t + 0.02, 'thud', { gain: 0.3 }); };
  [['queue', -2130, -1330, 520, 360, -7], ['press', -860, -1390, 500, 340, 6], ['factory', -1000, -560, 560, 380, -3], ['notes', -2060, -610, 470, 330, 5]].forEach(([k, x, y, w, h, rot], i) => {
    const p = DK.plate(world, plateDefs[k], { x, y, w, h, rot, seed: 20 + i, tape: true });
    slam(p.outer, T.rup + 0.05 + i * 0.07, x, y);
  });
  const noteWrap = X.svg('g', {}, world); noteWrap.appendChild(noteG); // note stays on top of the slammed plates
  tl.fromTo(noteWrap, { y: 0 }, { y: -5, duration: 1.4, ease: 'sine.inOut', immediateRender: false }, 0.2); // idle paper lift
  // tear apart
  tl.fromTo(nL, { x: 0, y: 0, rotation: 0, svgOrigin: '200 215' }, { x: -175, y: -45, rotation: -13, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.rup);
  tl.fromTo(nR, { x: 0, y: 0, rotation: 0, svgOrigin: '620 215' }, { x: 205, y: 70, rotation: 11, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.rup);
  const shr = X.rand(31);
  for (let i = 0; i < 7; i++) {
    const s = X.svg('path', { d: X.torn(40 + shr() * 40, 26 + shr() * 30, 9, 40 + i, 6), fill: DK.pat('note'), filter: 'url(#dkShS)', transform: `translate(${410 + (shr() - 0.5) * 40},${40 + i * 52})` }, noteG);
    gsap.set(s, { opacity: 0 });
    tl.fromTo(s, { opacity: 1, x: 0, y: 0, rotation: 0 }, { opacity: 1, x: (shr() - 0.5) * 520, y: (shr() - 0.35) * 380, rotation: (shr() - 0.5) * 340, duration: 0.7, ease: 'power3.out', immediateRender: false }, T.rup);
  }
  X.sfx(T.rup, 'paper', { dur: 0.45, gain: 0.8 }); X.sfx(T.rup, 'impact', { dur: 1.0, gain: 0.45 });
  cam.move(T.rup, 0.7, { x: -1480, y: -990, s: 0.9, r: 0.4 }, 'power3.out');
  cam.move(T.rup + 0.75, T.feizhi - T.rup - 0.85, { x: -1330, y: -940, s: 0.95, r: -0.6 }, 'sine.inOut');   // truck across the collage
  // second wave of plates on the narration
  [['crowd', -620, -820, 520, 360, -5, W('hook2', '钞票')], ['facade', -2300, -980, 460, 330, 7, W('hook2', '不如')]].forEach(([k, x, y, w, h, rot, t], i) => {
    const p = DK.plate(world, plateDefs[k], { x, y, w, h, rot, seed: 30 + i, tape: true }); slam(p.outer, t, x, y); });
  world.appendChild(noteWrap);
  DK.stamp(world, '废纸', -1420, -960, T.feizhi, { size: 130, rot: -8, sub: 'WASTE PAPER', cam });

  // ---------------------------------------------------------------- 3 · exchange-rate card + counter
  const ERs = { x: -150, y: -1050, w: 1100, h: 660, rot: 2 };
  cam.whip(T.er, { x: -150, y: -1035, s: 1, r: 0.6 }, { rotKick: 1.5 });
  const er = DK.sheet(world, { ...ERs, paper: 'card', lines: { y0: 170, step: 58 }, margin: 230 });
  DK.type(er, 60, 82, 'EXCHANGE RATE · MARKS PER US DOLLAR', T.er + 0.45, { size: 28, ls: 2, cps: 42, gain: 0.25 });
  DK.type(er, 62, 126, '汇率 · 每 1 美元可兑换的马克', T.er + 0.75, { f: 'zhs', size: 26, weight: 500, cps: 18, cursor: false, sfx: false, fill: C.ink2 });
  const popIn = (el, t, o = {}) => { gsap.set(el, { opacity: 0 }); tl.fromTo(el, { opacity: 0, scale: o.from ?? 1.25, transformOrigin: o.origin || '0% 100%' }, { opacity: 1, scale: 1, duration: o.dur ?? 0.22, ease: o.ease || 'back.out(2)', immediateRender: false }, t); if (o.sfx !== false) X.sfx(t, o.sfx || 'click', { gain: 0.3 }); return el; };
  popIn(DK.text(er, 60, 300, '1914', { f: 'lat', size: 50 }), W('rate1', '一九一四') - 0.05);
  popIn(DK.text(er, 290, 316, '4.2', { f: 'lat', size: 124 }), W('rate1', '四点二'), { sfx: 'pop' });
  popIn(DK.text(er, 520, 300, 'MARK · 马克', { f: 'mono', size: 24, ls: 2, fill: C.ink2 }), W('rate1', '马克'));
  popIn(DK.text(er, 60, 504, '1923.11', { f: 'lat', size: 50 }), L('rate2').start - 0.05);
  const cnt = DK.text(er, 290, 512, '4.2', { f: 'lat', size: 74, fill: C.red });
  const grp = (v) => (v < 100 ? v.toFixed(1) : Math.round(v).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' '));
  gsap.set(cnt, { opacity: 0 }); tl.set(cnt, { opacity: 1 }, W('rate2', '要换') - 0.05);
  DK.counter(cnt, 4.2, 4.2e12, W('rate2', '要换'), WE('rate2', '万亿') - W('rate2', '要换') + 0.05, { log: true, fmt: grp, ease: 'power1.in' });
  { const [qx, qy] = toWorld(ERs, 600, 400); cam.move(W('rate2', '要换') - 0.25, 0.7, { x: qx, y: qy, s: 1.12, r: 1.2 }, 'power2.inOut'); }
  const brk = X.svg('path', { d: 'M292,548 v16 h712 v-16', fill: 'none', stroke: C.red, 'stroke-width': 3 }, er);
  X.drawOn(brk, WE('rate2', '万亿') + 0.12, 0.3);
  popIn(DK.text(er, 1004, 612, '= 4.2 万亿 · ×1 万亿倍', { f: 'zh', size: 36, fill: C.red, anchor: 'end' }), WE('rate2', '万亿') + 0.32, { origin: '100% 100%', sfx: 'pop' });
  const usd = DK.sheet(world, { x: 300, y: -1290, w: 200, h: 100, rot: 9, paper: 'note', edge: 'deckle', seed: 4 });
  DK.text(usd, 24, 66, '$1', { f: 'lat', size: 50, fill: C.green }); DK.text(usd, 104, 46, 'ONE', { f: 'mono', size: 16, fill: C.green, ls: 2 }); DK.text(usd, 104, 70, 'DOLLAR', { f: 'mono', size: 16, fill: C.green, ls: 2 });
  DK.pin(usd, 100, 10, 10);

  // ---------------------------------------------------------------- 4 · Germany map plate → zoom into the Ruhr
  const GMs = { x: 1450, y: -850, w: 1250, h: 900, rot: -1.5 };
  cam.whip(T.gm, { x: 1450, y: -840, s: 1, r: -0.4 }, { rotKick: -1.2 });
  const gm = DK.sheet(world, { ...GMs, paper: 'land2', big: true });
  X.svg('rect', { x: 24, y: 24, width: GMs.w - 48, height: GMs.h - 48, fill: 'none', stroke: C.ink, 'stroke-width': 1.6 }, gm);
  X.svg('rect', { x: 32, y: 32, width: GMs.w - 64, height: GMs.h - 64, fill: 'none', stroke: C.ink, 'stroke-width': 0.8 }, gm);
  const PG = (lon, lat) => [(lon - 14.0) * 88 * 0.63 + 650, -(lat - 51.3) * 88 + 492];
  const poly = (pts, prj) => 'M' + pts.map(([a, b]) => prj(a, b).map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
  const line = (pts, prj) => 'M' + pts.map(([a, b]) => prj(a, b).map((v) => v.toFixed(1)).join(',')).join('L');
  const mapClip = X.svg('clipPath', { id: 'gmClip' }, X.defs); X.svg('rect', { x: 33, y: 33, width: GMs.w - 66, height: GMs.h - 66 }, mapClip);
  const mg = X.svg('g', { 'clip-path': 'url(#gmClip)' }, gm);
  const northSea = [[2, 51.2], [3.4, 51.35], [4.2, 52.0], [4.7, 52.9], [5.0, 53.35], [6.0, 53.48], [7.0, 53.62], [8.0, 53.66], [8.6, 53.9], [8.9, 54.3], [8.6, 54.9], [8.1, 55.5], [8.1, 56.5], [8.6, 57.1], [10.0, 57.6], [10.6, 57.8], [10.6, 59], [2, 59]];
  const baltic = [[10.6, 59], [10.6, 57.8], [10.5, 57.2], [10.9, 56.4], [10.2, 56.0], [10.3, 55.3], [10.0, 54.95], [10.2, 54.45], [10.95, 54.35], [10.85, 54.05], [11.45, 53.95], [12.1, 54.18], [12.9, 54.45], [13.4, 54.65], [13.8, 54.25], [14.25, 53.95], [15.4, 54.15], [16.2, 54.3], [17.0, 54.65], [17.7, 54.8], [18.5, 54.8], [18.7, 54.38], [19.6, 54.45], [19.95, 54.62], [19.9, 54.95], [20.55, 54.95], [21.1, 55.3], [21.1, 56.0], [21.0, 56.8], [21.6, 57.5], [23, 57.6], [23, 59]];
  const sweden = [[12.6, 59], [12.4, 56.6], [12.9, 55.4], [14.2, 55.4], [14.5, 56.1], [16.0, 56.2], [16.5, 57.0], [16.6, 59]];
  const zealand = [[11.0, 55.4], [11.9, 54.6], [12.5, 55.0], [12.6, 55.7], [12.2, 56.1], [11.3, 55.9]];
  const ger = [[7.2, 53.25], [7.2, 53.6], [8.0, 53.7], [8.3, 53.5], [8.6, 53.85], [9.0, 53.9], [8.85, 54.1], [8.6, 54.35], [8.9, 54.5], [8.6, 54.9], [9.45, 54.82], [9.95, 54.75], [10.2, 54.45], [10.95, 54.35], [10.85, 54.05], [11.45, 53.95], [12.1, 54.18], [12.9, 54.45], [13.4, 54.65], [13.8, 54.2], [14.25, 53.95], [15.4, 54.15], [16.2, 54.3], [17.0, 54.65], [17.7, 54.78], [17.45, 54.4], [17.3, 53.95], [17.2, 53.55], [16.7, 53.3], [16.3, 53.1], [15.95, 52.75], [15.75, 52.4], [15.85, 52.05], [16.1, 51.8], [16.6, 51.6], [17.2, 51.4], [17.6, 51.2], [18.2, 50.9], [18.6, 50.55], [18.75, 50.25], [18.55, 50.05], [18.05, 50.05], [17.65, 50.25], [17.1, 50.4], [16.7, 50.2], [16.3, 50.65], [15.8, 50.75], [15.2, 50.98], [14.8, 50.85], [14.3, 51.05], [13.8, 50.75], [13.0, 50.45], [12.5, 50.35], [12.1, 50.25], [12.4, 49.95], [12.6, 49.5], [13.0, 49.3], [13.5, 48.95], [13.8, 48.78], [13.45, 48.55], [12.95, 48.2], [12.95, 47.7], [13.05, 47.5], [12.4, 47.68], [11.6, 47.58], [11.1, 47.4], [10.45, 47.55], [9.95, 47.55], [9.55, 47.53], [9.0, 47.68], [8.55, 47.65], [7.6, 47.58], [7.55, 48.0], [7.75, 48.5], [8.1, 48.95], [7.65, 49.05], [7.3, 49.12], [6.95, 49.2], [6.55, 49.42], [6.37, 49.47], [6.5, 49.8], [6.13, 50.13], [6.4, 50.33], [6.15, 50.55], [6.02, 50.75], [6.0, 51.0], [6.15, 51.2], [6.05, 51.6], [5.95, 51.8], [6.4, 51.85], [6.8, 51.98], [6.75, 52.25], [7.05, 52.4], [7.0, 52.65], [7.2, 53.0]];
  const eprus = [[19.4, 54.4], [19.6, 54.45], [19.95, 54.62], [19.9, 54.95], [20.55, 54.95], [21.05, 55.25], [21.25, 55.1], [22.15, 55.05], [22.85, 54.8], [22.8, 54.35], [22.35, 53.95], [21.6, 53.45], [20.8, 53.3], [20.0, 53.2], [19.6, 53.45], [19.25, 53.75], [19.2, 54.1]];
  [northSea, baltic].forEach((p) => { X.svg('path', { d: poly(p, PG), fill: DK.pat('sea'), stroke: C.seaLine, 'stroke-width': 10, 'stroke-opacity': 0.35 }, mg); });
  [sweden, zealand].forEach((p) => X.svg('path', { d: poly(p, PG), fill: C.land2, stroke: C.faint, 'stroke-width': 1 }, mg));
  [ger, eprus].forEach((p) => { X.svg('path', { d: poly(p, PG), fill: DK.pat('land'), stroke: C.ink, 'stroke-width': 1.8, 'stroke-linejoin': 'round' }, mg); });
  const rhine = [[7.6, 47.6], [7.55, 48.0], [7.75, 48.5], [8.1, 48.95], [8.45, 49.45], [8.35, 49.95], [8.0, 50.0], [7.6, 50.35], [7.25, 50.6], [6.96, 50.94], [6.77, 51.23], [6.73, 51.45], [6.45, 51.7], [6.1, 51.85], [5.6, 51.95]];
  X.svg('path', { d: line(rhine, PG), fill: 'none', stroke: '#7f98a1', 'stroke-width': 2.2 }, mg);
  const lab = (g, x, y, t, o = {}) => DK.text(g, x, y, t, { f: 'mono', size: o.size ?? 15, ls: 4, fill: o.fill || C.faint, anchor: 'middle', weight: 700, ...o });
  [['NETHERLANDS', 5.2, 52.4], ['BELGIUM', 4.6, 50.6], ['FRANCE', 5.8, 48.6], ['SWITZERLAND', 8.2, 47.1], ['AUSTRIA', 14.2, 47.6], ['CZECHOSLOVAKIA', 15.6, 49.7], ['POLAND', 19.0, 52.3], ['DENMARK', 9.3, 56.0], ['NORTH SEA', 6.0, 54.9], ['BALTIC SEA', 17.0, 55.6]].forEach(([t, a, b]) => { const [x, y] = PG(a, b); lab(mg, x, y, t, { fill: t.includes('SEA') ? '#7f98a1' : C.faint }); });
  const cities = [['BERLIN', 13.4, 52.52], ['Hamburg', 9.99, 53.55], ['München', 11.58, 48.14], ['Köln', 6.96, 50.94], ['Leipzig', 12.37, 51.34], ['Königsberg', 20.5, 54.71], ['Breslau', 17.04, 51.11], ['Frankfurt', 8.68, 50.11]];
  cities.forEach(([n, a, b]) => { const [x, y] = PG(a, b); if (n === 'BERLIN') { DK.text(mg, x, y + 9, '★', { f: 'zhs', size: 26, anchor: 'middle' }); DK.text(mg, x + 18, y - 10, 'BERLIN 柏林', { f: 'lat', size: 20 }); } else { X.svg('circle', { cx: x, cy: y, r: 4, fill: C.ink }, mg); DK.text(mg, x + 8, y - 6, n, { f: 'lat', size: 15, style: 'italic', weight: 400, fill: C.ink2 }); } });
  const dotR = X.rand(5); for (let i = 0; i < 260; i++) { const a = 6.2 + dotR() * 16.5, b = 47.6 + dotR() * 7; const [x, y] = PG(a, b); X.svg('circle', { cx: x, cy: y, r: 1.4, fill: C.ink2, opacity: 0.25 }, mg); }
  // cartouche
  X.svg('rect', { x: 60, y: 60, width: 560, height: 150, fill: DK.pat('card'), stroke: C.ink, 'stroke-width': 1.4 }, gm);
  DK.text(gm, 84, 132, 'GERMANY', { f: 'lat', size: 54, ls: 8 }); DK.text(gm, 96 + DK.measure('GERMANY', 54, F.lat, 700, 8), 132, '1923', { f: 'lat', size: 30, weight: 400, style: 'italic' });
  DK.text(gm, 86, 180, 'the Weimar Republic · 德国（示意）', { f: 'lat', size: 22, style: 'italic', weight: 400, fill: C.ink2 });
  DK.pin(gm, 44, 40); DK.pin(gm, GMs.w - 44, 40);
  const [ex, ey] = PG(7.1, 51.47);
  const ruhrDot = X.svg('circle', { cx: ex, cy: ey, r: 12, fill: C.red, opacity: 0.9 }, gm);
  popIn(ruhrDot, T.ruhrWord - 0.05, { origin: '50% 50%', from: 0, sfx: 'pop' });
  for (let k = 0; k < 2; k++) { const ring = X.svg('circle', { cx: ex, cy: ey, r: 12, fill: 'none', stroke: C.red, 'stroke-width': 3, opacity: 0 }, gm); tl.fromTo(ring, { attr: { r: 12 }, opacity: 0.9 }, { attr: { r: 150 }, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, T.ruhrWord + k * 0.25); }
  const rl = X.svg('g', {}, gm); DK.text(rl, ex - 30, ey - 34, 'RUHR · 鲁尔区', { f: 'zh', size: 30, fill: C.red, anchor: 'end' });
  popIn(rl, T.ruhrWord + 0.1, { origin: '100% 100%', sfx: false });
  // zoom punch through the Ruhr onto the regional sheet
  const [rwx, rwy] = toWorld(GMs, ex, ey);
  cam.zoom(T.zoom, { x: rwx, y: rwy, s: 6 }, { dur: 0.3 });
  const RMs = { x: 4300, y: 300, w: 2300, h: 1400, rot: 0 };
  cam.cut(T.zoom + 0.3, { x: RMs.x, y: RMs.y, s: 0.66, r: 0 });
  cam.move(T.zoom + 0.3001, 0.36, { x: RMs.x, y: RMs.y, s: 1, r: 0.3 }, 'power3.out');

  // ---------------------------------------------------------------- 5 · the Ruhr regional map (desk-free sheet)
  const rm = DK.sheet(world, { ...RMs, paper: 'land2', shadow: false });
  const PR = (lon, lat) => [(lon - 7.25) * 1500 * 0.63 + 1150, -(lat - 51.45) * 1500 + 700];
  const rg = X.svg('g', {}, rm);
  for (let a = 6.25; a <= 8.5; a += 0.25) { const [x] = PR(a, 51); X.svg('line', { x1: x, y1: 0, x2: x, y2: 1400, stroke: C.rule, 'stroke-width': 1, 'stroke-dasharray': '4 10', opacity: 0.6 }, rg); }
  for (let b = 51; b <= 51.95; b += 0.15) { const [, y] = PR(7, b); X.svg('line', { x1: 0, y1: y, x2: 2300, y2: y, stroke: C.rule, 'stroke-width': 1, 'stroke-dasharray': '4 10', opacity: 0.6 }, rg); }
  const occ = [[6.55, 51.2], [7.0, 51.13], [7.6, 51.24], [7.95, 51.45], [7.75, 51.72], [7.05, 51.78], [6.6, 51.7], [6.48, 51.45]];
  const hatchP = X.svg('pattern', { id: 'occHatch', patternUnits: 'userSpaceOnUse', width: 22, height: 22, patternTransform: 'rotate(35)' }, X.defs);
  X.svg('line', { x1: 0, y1: 0, x2: 0, y2: 22, stroke: C.red, 'stroke-width': 5, opacity: 0.5 }, hatchP);
  const occFill = X.svg('path', { d: poly(occ, PR), fill: 'url(#occHatch)', opacity: 0 }, rg);
  const occEdge = X.svg('path', { d: poly(occ, PR), fill: 'none', stroke: C.red, 'stroke-width': 4 }, rg);
  const occEdgeD = X.svg('path', { d: poly(occ, PR), fill: 'none', stroke: DK.C.land2, 'stroke-width': 5, 'stroke-dasharray': '6 12' }, rg);
  gsap.set(occEdge, { opacity: 0 }); gsap.set(occEdgeD, { opacity: 0 });
  const tOcc = W('ruhr', '占领') - 0.55;
  tl.set([occEdge, occEdgeD], { opacity: 1 }, tOcc); X.drawOn(occEdge, tOcc, 0.5);
  tl.fromTo(occFill, { opacity: 0 }, { opacity: 1, duration: 0.4, immediateRender: false }, tOcc + 0.35);
  const riv = (pts, wdt) => { const p = X.svg('path', { d: line(pts, PR), fill: 'none', stroke: '#8ea6ae', 'stroke-width': wdt, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, rg); X.drawOn(p, T.zoom + 0.35, 0.8, 'power2.out'); };
  riv([[6.98, 50.95], [6.86, 51.12], [6.77, 51.23], [6.73, 51.33], [6.74, 51.43], [6.68, 51.55], [6.6, 51.66], [6.45, 51.75], [6.2, 51.86]], 12);
  riv([[8.3, 51.35], [7.95, 51.44], [7.7, 51.42], [7.5, 51.38], [7.3, 51.41], [7.1, 51.4], [6.95, 51.39], [6.82, 51.42], [6.74, 51.44]], 6);
  riv([[8.4, 51.68], [7.9, 51.64], [7.6, 51.63], [7.35, 51.66], [7.1, 51.66], [6.85, 51.64], [6.62, 51.66]], 5);
  const rc = [['杜伊斯堡', 'DUISBURG', 6.76, 51.43, -1], ['埃森', 'ESSEN', 7.01, 51.46, 1], ['波鸿', 'BOCHUM', 7.22, 51.48, 1], ['多特蒙德', 'DORTMUND', 7.47, 51.51, 1], ['杜塞尔多夫', 'DÜSSELDORF', 6.78, 51.23, -1], ['盖尔森基兴', 'GELSENKIRCHEN', 7.1, 51.55, 1]];
  rc.forEach(([zh, la, a, b, side], i) => {
    const [x, y] = PR(a, b), g = X.svg('g', {}, rg);
    X.svg('circle', { cx: x, cy: y, r: 9, fill: C.ink }, g); X.svg('circle', { cx: x, cy: y, r: 15, fill: 'none', stroke: C.ink, 'stroke-width': 1.5 }, g);
    DK.text(g, x + side * 26, y - 6, zh, { size: 34, anchor: side > 0 ? 'start' : 'end' });
    DK.text(g, x + side * 28, y + 24, la, { f: 'mono', size: 16, ls: 3, anchor: side > 0 ? 'start' : 'end', fill: C.ink2 });
    popIn(g, T.zoom + 0.45 + i * 0.07, { origin: '50% 50%', from: 0.4, sfx: i % 2 ? false : 'tick' });
  });
  const mine = (g, x, y, s = 1) => { const m = X.svg('g', { transform: `translate(${x},${y}) scale(${s})`, fill: 'none', stroke: C.ink2, 'stroke-width': 2.4 }, g); X.svg('path', { d: 'M-14,0 L0,-34 L14,0 M-8,-14 L8,-14 M0,-34 L0,0' }, m); X.svg('circle', { cx: 0, cy: -38, r: 6 }, m); return m; };
  const mr = X.rand(8); for (let i = 0; i < 16; i++) { const [x, y] = PR(6.7 + mr() * 1.15, 51.33 + mr() * 0.33); popIn(mine(rg, x, y, 0.9), T.zoom + 0.8 + i * 0.03, { origin: '50% 100%', from: 0, sfx: false }); }
  X.svg('rect', { x: 260, y: 380, width: 690, height: 150, fill: DK.pat('card'), stroke: C.ink, 'stroke-width': 1.4, filter: 'url(#dkShS)' }, rm);
  DK.text(rm, 288, 452, 'THE RUHR', { f: 'lat', size: 54, ls: 8 }); DK.text(rm, 302 + DK.measure('THE RUHR', 54, F.lat, 700, 8), 452, '1923', { f: 'lat', size: 30, style: 'italic', weight: 400 });
  DK.text(rm, 290, 498, '鲁尔区 · 德国煤与钢的心脏（示意）', { f: 'zhs', size: 26, weight: 500, fill: C.ink2 });
  const arrow = (x0, y0, x1, y1, t, label, lab2) => {
    const g = X.svg('g', {}, rm);
    const p = X.svg('path', { d: `M${x0},${y0} Q${(x0 + x1) / 2},${Math.min(y0, y1) - 60} ${x1},${y1}`, fill: 'none', stroke: C.ink, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    X.drawOn(p, t, 0.45, 'power2.out');
    const a = Math.atan2(y1 - (Math.min(y0, y1) - 60), x1 - (x0 + x1) / 2), hx = x1, hy = y1;
    const head = X.svg('path', { d: `M${hx},${hy} L${hx - 34 * Math.cos(a - 0.5)},${hy - 34 * Math.sin(a - 0.5)} L${hx - 34 * Math.cos(a + 0.5)},${hy - 34 * Math.sin(a + 0.5)}Z`, fill: C.ink }, g);
    popIn(head, t + 0.42, { origin: '50% 50%', from: 0, sfx: false });
    const tg = X.svg('g', {}, g); DK.text(tg, x0 + 10, y0 + 56, label, { size: 36 }); DK.text(tg, x0 + 12, y0 + 86, lab2, { f: 'mono', size: 18, ls: 4, fill: C.ink2 });
    popIn(tg, t + 0.1, { sfx: 'swoosh' });
  };
  arrow(250, 960, 820, 820, W('ruhr', '法国') - 0.1, '法军', 'FRENCH TROOPS');
  arrow(250, 560, 760, 640, W('ruhr', '比利时') - 0.1, '比军', 'BELGIAN TROOPS');
  DK.tag(rm, '1923.1.11', 'OCCUPATION BEGINS', 1430, 300, Math.max(W('ruhr', '一九二三年一月') - 0.1, T.zoom + 0.7), { size: 50, rot: 3 });
  DK.tag(rm, '战争赔偿', 'REPARATIONS · IN DEFAULT', 1430, 980, W('ruhr', '赔偿') - 0.15, { size: 52, rot: -2.5, from: 'right' });
  DK.stamp(rm, '占领', 1270, 760, W('ruhr', '占领'), { size: 140, rot: -7, sub: 'OCCUPIED', cam });
  cam.move(T.zoom + 0.75, 0.6, { x: RMs.x + 160, y: RMs.y - 140, s: 1.05, r: 0.8 }, 'power2.inOut');
  cam.move(W('ruhr', '法国') - 0.4, 0.55, { x: RMs.x - 240, y: RMs.y + 40, s: 1.08, r: -0.6 }, 'power3.inOut');
  cam.move(W('ruhr', '占领') - 0.55, 0.5, { x: RMs.x + 80, y: RMs.y + 60, s: 1.12, r: 0.4 }, 'power3.inOut');

  // ---------------------------------------------------------------- 6 · word-card montage (hard cuts)
  DK.card(T.c1, T.c2, { ground: 'black', word: '消极抵抗', gloss: 'PASSIVE RESISTANCE', size: 190, wy: 560, plate: plateDefs.factory, pw: 820, ph: 560, px: 1420, py: 540, prot: -2, seed: 41,
    gag: (g, t0) => { // two CLOSED tapes slap over the plate
      [[-14, 470], [12, 610]].forEach(([rot, y], i) => { const tg = X.svg('g', { transform: `translate(1420,${y}) rotate(${rot})` }, g); X.svg('rect', { x: -470, y: -34, width: 940, height: 68, fill: '#efe2b8', opacity: 0.94, filter: 'url(#dkShO)' }, tg); for (let k = -3; k <= 3; k++) DK.text(tg, k * 150, 12, 'CLOSED', { f: 'mono', size: 30, ls: 6, fill: C.ink, anchor: 'middle' }); gsap.set(tg, { opacity: 0 }); tl.fromTo(tg, { opacity: 1, scale: 1.4, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 3 / 30, ease: 'power3.out', immediateRender: false }, t0 + 0.45 + i * 0.22); X.sfx(t0 + 0.45 + i * 0.22, 'slide', { gain: 0.4, dur: 0.2 }); });
    } });
  DK.card(T.c2, T.c3, { ground: 'paper', word: '罢工', gloss: 'STRIKE', strip: true, brush: true, size: 230, wy: 610, plate: plateDefs.crowd, px: 1360, py: 520, prot: 1.5, seed: 42 });
  DK.card(T.c3, T.c4, { ground: 'verm', word: '工资照发', gloss: 'WAGES STILL PAID', size: 180, wy: 560, plate: plateDefs.notes, pw: 820, ph: 580, px: 1420, py: 520, prot: 2, seed: 43,
    gag: (g, t0, t1) => { const nr = X.rand(17); for (let i = 0; i < 14; i++) { const n = X.svg('g', {}, g); X.svg('rect', { x: -58, y: -30, width: 116, height: 60, fill: '#e3e5d4', stroke: C.noteInk, 'stroke-width': 2 }, n); X.svg('rect', { x: -46, y: -20, width: 92, height: 40, fill: 'none', stroke: C.noteInk, 'stroke-width': 1 }, n); DK.text(n, 0, 9, '1000', { f: 'lat', size: 20, fill: C.noteInk, anchor: 'middle' }); const x0 = 1040 + nr() * 780, r0 = (nr() - 0.5) * 60; gsap.set(n, { x: x0, y: -300 }); tl.fromTo(n, { x: x0, y: -80 - nr() * 400, rotation: r0 }, { x: x0 + (nr() - 0.5) * 160, y: 1180, rotation: r0 + (nr() - 0.5) * 400, duration: 1.3 + nr() * 0.5, ease: 'none', immediateRender: false }, t0 + nr() * 0.4); } } });
  const c4 = DK.card(T.c4, T.ns, { ground: 'black', word: '', gloss: '', plate: plateDefs.pressBig, pw: 1760, ph: 940, px: 960, py: 548, prot: -0.8, seed: 44 });
  { // printed sheets stream out of the press + label strip + 印
    const sr = X.rand(23);
    for (let i = 0; i < 18; i++) { const s = X.svg('rect', { x: -70, y: -45, width: 140, height: 90, fill: '#f3eee2', stroke: '#c9c1ad', 'stroke-width': 1.5, filter: 'url(#dkShO)' }, c4); const t0 = T.c4 + 0.1 + i * 0.09; gsap.set(s, { opacity: 0, x: 1040, y: 640 }); tl.fromTo(s, { x: 1040, y: 640, rotation: -10, scale: 0.6, opacity: 0 }, { x: 2100 + sr() * 200, y: 300 + sr() * 600, rotation: 40 + sr() * 200, scale: 1.1, opacity: 1, duration: 1.0, ease: 'power1.in', immediateRender: false }, t0); }
    const lab4 = X.svg('g', { transform: 'translate(150,140) rotate(-2)' }, c4);
    X.svg('path', { d: X.torn(560, 110, 4, 3, 10), fill: DK.pat('card', true), filter: 'url(#dkShO)' }, lab4);
    DK.text(lab4, 36, 76, '印钞机', { size: 64 }); DK.type(lab4, 250, 70, 'PRINTING PRESS', T.c4 + 0.15, { size: 26, ls: 4, cps: 30, cursor: false, sfx: false });
    DK.stamp(c4, '印', 1430, 330, T.yin, { size: 260, rot: -9, ovl: true, sub: 'PRINT' });
  }
  X.sfx(T.c1, 'impact', { gain: 0.35, dur: 0.8 });

  // ---------------------------------------------------------------- 7 · the shop notice (typewriter + highlight + 作废)
  const NSs = { x: -1600, y: 1050, w: 1150, h: 520, rot: -3 };
  cam.cut(T.ns, { x: -1590, y: 1040, s: 1.0, r: -0.5 });
  DK.plate(world, plateDefs.queue, { x: -880, y: 760, w: 520, h: 360, rot: 7, seed: 51 });
  const ns = DK.sheet(world, { ...NSs, edge: 'torn', jag: 8, seed: 33, paper: 'slip' });
  DK.type(ns, 64, 76, 'NOTICE · BERLIN · AUTUMN 1923', T.ns + 0.3, { size: 22, ls: 3, cps: 40, fill: C.ink2, gain: 0.2 });
  const l1 = DK.type(ns, 64, 186, "Today's prices are", L('prices').start + 0.05, { size: 54, cps: 22 });
  const tl2 = L('prices').start + 0.05 + l1.dur + 0.1;
  const l2 = DK.type(ns, 64, 262, 'valid until noon.', tl2, { size: 54, cps: 22 });
  const hlw = DK.measure('valid until noon.', 54, F.mono, 700);
  const hl = X.svg('rect', { x: 56, y: 222, width: hlw + 18, height: 54, fill: C.hilite, opacity: 0.55 }, ns);
  ns.insertBefore(hl, l2);
  gsap.set(hl, { scaleX: 0, transformOrigin: '0% 50%' });
  const thl = tl2 + l2.dur + 0.15;
  tl.fromTo(hl, { scaleX: 0 }, { scaleX: 1, duration: 10 / 30, ease: 'none', immediateRender: false }, thl); X.sfx(thl, 'scribble', { dur: 0.33, gain: 0.3 });
  DK.type(ns, 66, 352, '告示：今日价格，只到中午有效。', W('prices', '早上') - 0.1, { f: 'zhs', size: 36, weight: 500, cps: 13, cursor: false, sfx: false, fill: C.ink2 });
  DK.type(ns, 66, 420, '— 商店告示（示意）', W('prices', '早上') + 1.0, { f: 'zhs', size: 22, weight: 400, cps: 14, cursor: false, sfx: false, fill: C.faint });
  [0, 1, 2].forEach((k) => popIn(DK.text(ns, 1075, 150 + k * 92, '×2', { f: 'zh', size: 58, fill: C.red, anchor: 'middle' }), W('prices', '翻一倍') + k * 0.16, { origin: '50% 50%', from: 1.6, sfx: 'pop' }));
  DK.stamp(ns, '作废', 780, 335, W('prices', '作废'), { size: 140, rot: -8, sub: 'VOID', cam });
  cam.move(T.ns + 0.35, W('prices', '作废') - T.ns - 0.45, { x: NSs.x + 70, y: NSs.y - 20, s: 1.08, r: 0.6 }, 'sine.inOut');
  { const [qx, qy] = toWorld(NSs, 700, 300); cam.move(W('prices', '作废') - 0.06, 0.28, { x: qx, y: qy, s: 1.2, r: -0.8 }, 'power3.out'); }

  // ---------------------------------------------------------------- 8 · isotype: savings (CSS-3D tilted desk)
  const iso = DK.iso({ cols: 20, rows: 5, gap: 70, rowGap: 132, fh: 96, tilt: 46, roll: -6, gy: 10, gx: 0, titleDY: -125, titleDX: -30, bigDX: -40, bigDY: -60,
    titleHTML: `<div style="font:900 104px ${F.zh};color:${C.ink};letter-spacing:6px;text-shadow:0 6px 10px rgba(40,30,20,.25)">存款 <span style="font:700 40px ${F.mono};letter-spacing:8px;color:${C.ink2}">SAVINGS</span></div><div style="font:500 34px ${F.zhs};color:${C.ink2};margin-top:6px">存款 · 养老金 · 债券（每个小人 = 1%）</div>`,
    bigHTML: `<div id="isoBig" style="font:700 170px ${F.lat};color:${C.red};text-shadow:0 8px 12px rgba(60,20,10,.25)">0%</div><div style="font:900 40px ${F.zh};color:${C.red};margin-top:-10px">购买力损失 <span style="font:700 26px ${F.mono};letter-spacing:5px">LOST</span></div>` });
  iso.show(T.iso, T.hole);
  iso.cam(T.iso - 0.01, { x: 1900, y: 70, z: -40, blur: 30 }, 0.001).cam(T.iso, { x: 0, y: 70, z: -40, blur: 0 }, 0.42, 'expo.out');
  iso.cam(T.iso + 0.42, { x: -190, y: 10, z: 150, roll: -4.5 }, T.hole - 0.5 - T.iso - 0.42, 'sine.inOut');
  X.sfx(T.iso + 0.02, 'whoosh', { dur: 0.45, gain: 0.5 });
  iso.figs.forEach((f) => { f.inT = T.iso + 0.32 + f.row * 0.07 + f.col * 0.012; });
  for (let r = 0; r < 5; r++) X.sfx(T.iso + 0.32 + r * 0.06, 'tick', { gain: 0.18 });
  iso.titleIn = T.iso + 0.6; iso.bigIn = W('losers', '一辈子') - 0.1;
  const r0 = W('losers', '一辈子'), r1 = WE('losers', '债券');
  iso.figs.forEach((f) => { f.redT = r0 + ((f.col + f.row * 0.25) / 21) * (r1 - r0); });
  X.sfx(r0, 'scribble', { dur: r1 - r0, gain: 0.25 });
  const bigEl = iso.big.querySelector('#isoBig');
  { const e = gsap.parseEase('power1.inOut'); let last = ''; X.every((t) => { const p = Math.min(1, Math.max(0, (t - r0) / (r1 - r0))); const s = p >= 1 ? '≈100%' : `${Math.round(e(p) * 100)}%`; if (s !== last) { bigEl.textContent = s; last = s; } }); }
  const tFall = W('losers', '化为乌有');
  iso.figs.forEach((f) => { f.fallT = tFall + f.col * 0.014 + f.row * 0.03; });
  X.sfx(tFall, 'paper', { dur: 0.6, gain: 0.5 }); X.sfx(tFall + 0.1, 'thud', { gain: 0.35 });
  iso.labelsOut = T.hole - 0.45;
  const ofr = X.rand(9); iso.figs.forEach((f) => { f.outT = T.hole - 0.5 + ofr() * 0.12; });
  iso.cam(T.hole - 0.42, { tilt: 0, roll: 0, z: 0 }, 0.36, 'power2.inOut');

  // ---------------------------------------------------------------- 9 · torn-hole iris → "who gained" newspaper page
  const WPs = { x: 520, y: 1500, w: 2200, h: 1450, rot: 0 };
  cam.cut(T.iso + 0.6, { x: WPs.x, y: WPs.y + 10, s: 0.94, r: 0 });
  cam.move(T.hole + 0.1, 1.2, { s: 1.0, r: 0.4 }, 'power2.out');
  const wp = DK.sheet(world, { ...WPs, paper: 'ivory', shadow: false });
  const colBars = (x0, x1, y0, y1, seed) => { const r = X.rand(seed); for (let y = y0; y < y1; y += 22) X.svg('rect', { x: x0, y, width: (x1 - x0) * (y % 220 > 190 ? 0.5 : 0.82 + r() * 0.18), height: 8, fill: '#b9b1a2', opacity: 0.75 }, wp); };
  colBars(190, 520, 430, 1180, 3); colBars(1700, 2020, 430, 1180, 4);
  DK.text(wp, 1100, 300, 'THE LEDGER · 账本', { f: 'lat', size: 66, ls: 10, anchor: 'middle' });
  X.svg('line', { x1: 160, y1: 330, x2: 2040, y2: 330, stroke: C.ink, 'stroke-width': 3 }, wp); X.svg('line', { x1: 160, y1: 340, x2: 2040, y2: 340, stroke: C.ink, 'stroke-width': 1 }, wp);
  DK.text(wp, 200, 382, 'BERLIN · 1923', { f: 'mono', size: 20, ls: 3, fill: C.ink2 }); DK.text(wp, 2000, 382, 'No. 1923-11', { f: 'mono', size: 20, ls: 3, fill: C.ink2, anchor: 'end' });
  DK.text(wp, 570, 470, '谁赢了？', { size: 84 }); DK.text(wp, 935, 466, 'WHO GAINED', { f: 'lat', size: 40, ls: 8, fill: C.ink2 });
  const fp = DK.plate(wp, plateDefs.facade, { x: 860, y: 780, w: 600, h: 420, rot: -3, seed: 61 });
  DK.tag(wp, '欠钱的人', 'DEBTORS GAIN', 1560, 400, W('winners', '欠钱的人') - 0.1, { size: 52, rot: 3 });
  DK.tag(wp, '政府', 'THE STATE', 620, 900, W('winners', '政府') - 0.1, { size: 56, rot: -4, from: 'left' });
  const LCs = { x: 1390, y: 820, w: 640, h: 500, rot: 2.5 };
  const lc = DK.sheet(wp, { ...LCs, paper: 'card', lines: { y0: 150, step: 52 }, margin: 54 });
  DK.text(lc, 74, 70, 'WAR DEBT (DOMESTIC)', { f: 'mono', size: 26, ls: 2 }); DK.text(lc, 74, 112, '国内战争债 · 示意', { f: 'zhs', size: 26, weight: 500, fill: C.ink2 });
  DK.text(lc, 74, 214, '名义 NOMINAL', { f: 'zhs', size: 22, weight: 500 }); X.svg('rect', { x: 74, y: 228, width: 500, height: 46, fill: C.ink }, lc);
  DK.text(lc, 74, 344, '实际价值 REAL VALUE', { f: 'zhs', size: 22, weight: 500 });
  const realBar = X.svg('rect', { x: 74, y: 358, width: 500, height: 46, fill: C.green }, lc);
  const ts = W('winners', '它在'), te = W('winners', '一笔勾销');
  tl.fromTo(realBar, { attr: { width: 500 } }, { attr: { width: 4 }, duration: te - ts, ease: 'power2.in', immediateRender: false }, ts);
  X.sfx(ts, 'slide', { dur: te - ts, gain: 0.3 });
  popIn(DK.text(lc, 100, 396, '≈ 0', { f: 'lat', size: 40, fill: C.red }), te - 0.1, { sfx: 'pop' });
  DK.stamp(lc, '勾销', 380, 300, W('winners', '勾销'), { size: 120, rot: -7, sub: 'WRITTEN OFF', cam });
  cam.move(W('winners', '政府') - 0.25, 0.55, { x: WPs.x - 230, y: WPs.y + 140, s: 1.12, r: -0.8 }, 'power3.inOut');
  cam.whip(W('winners', '它在') - 0.32, { x: WPs.x + 230, y: WPs.y + 150, s: 1.12, r: 0.9 }, { dur: 0.3, overshoot: 0.05, gain: 0.35 });
  // the hole cover: the flat desk exactly as the un-tilted iso plane leaves it
  DK.hole(T.hole, { cx: 960, cy: 560, seed: 8, paint: (g) => { const s = iso.stateAt(T.hole); X.svg('image', { href: DK.deskURL, x: 960 - DK.deskW / 2 + s.x, y: 540 - DK.deskH / 2 + s.y, width: DK.deskW, height: DK.deskH, preserveAspectRatio: 'none' }, g); } });

  // ---------------------------------------------------------------- 10 · Rentenmark: the new note, the equation, the cap
  cam.whip(T.rd, { x: 1330, y: 230, s: 1.1, r: 0.5 }, { dur: 0.4, rotKick: 1.8 });
  cam.whip(W('renten', '一个新马克') - 0.4, { x: 1640, y: 330, s: 1.04, r: -0.4 }, { dur: 0.32, gain: 0.35 });
  const RNs = { x: 1130, y: 130, w: 720, h: 390, rot: -6 };
  const rn = DK.sheet(world, { ...RNs, paper: 'renten' });
  DK.guilloche(rn, 0, 0, RNs.w, RNs.h, { color: C.brown, op: 0.6, band: 22, per: 20 });
  DK.rosette(rn, 165, 195, 112, { color: C.brown, op: 0.7, k: 0.36 });
  DK.text(rn, 165, 250, '1', { f: 'lat', size: 150, fill: C.brown, anchor: 'middle' });
  DK.text(rn, 318, 172, 'RENTENMARK', { f: 'lat', size: 42, ls: 5, fill: C.brown });
  DK.text(rn, 324, 216, '15 NOVEMBER 1923', { f: 'mono', size: 22, ls: 3, fill: C.brown });
  DK.text(rn, 324, 262, '地租马克 · 原创示意', { f: 'zhs', size: 22, weight: 500, fill: C.brown });
  DK.text(rn, 690, 360, 'No 000 001', { f: 'mono', size: 18, fill: C.brown, anchor: 'end' });
  DK.pin(rn, 360, 16);
  gsap.set(rn.outer, { opacity: 0 });
  tl.fromTo(rn.outer, { y: -380, rotation: 8, opacity: 1, svgOrigin: `${RNs.x} ${RNs.y}` }, { y: 0, rotation: 0, opacity: 1, duration: 0.42, ease: 'back.out(1.2)', immediateRender: false }, W('renten', '新货币') - 0.1);
  X.sfx(W('renten', '新货币') - 0.1, 'paper', { gain: 0.5 });
  const EQs = { x: 1790, y: 430, w: 920, h: 540, rot: 2.5 };
  const eq = DK.sheet(world, { ...EQs, paper: 'card', lines: { y0: 150, step: 56 }, margin: 44 });
  const tEq = W('renten', '一个新马克') - 0.1;
  DK.type(eq, 66, 108, '1 RENTENMARK', tEq, { size: 46, cps: 26 });
  DK.type(eq, 66, 176, '= 1 000 000 000 000 MARK', tEq + 0.55, { size: 46, cps: 30 });
  DK.type(eq, 68, 236, '1 新马克 = 1 万亿 旧马克', tEq + 1.45, { f: 'zhs', size: 34, weight: 500, cps: 14, cursor: false, sfx: false, fill: C.ink2 });
  const eqB = X.svg('path', { d: 'M128,192 v12 h460 v-12', fill: 'none', stroke: C.red, 'stroke-width': 3 }, eq); X.drawOn(eqB, WE('renten', '旧马克') - 0.2, 0.3);
  X.svg('rect', { x: 66, y: 300, width: 560, height: 120, fill: 'none', stroke: C.ink, 'stroke-width': 2, 'stroke-dasharray': '10 7' }, eq);
  DK.text(eq, 92, 352, 'ISSUE CAP', { f: 'mono', size: 30, ls: 4 }); DK.text(eq, 92, 396, '发行上限', { f: 'zhs', size: 30, weight: 500, fill: C.ink2 });
  X.svg('rect', { x: 540, y: 330, width: 56, height: 56, fill: 'none', stroke: C.ink, 'stroke-width': 3 }, eq);
  // the hovering wooden stamp (indecision under the spotlight) → slam
  const tHover = W('renten', '发行量') - 0.15;
  const [bx, by] = toWorld(EQs, 360, 360);
  const wood = X.svg('g', {}, world);
  const woodSh = X.svg('ellipse', { cx: bx + 40, cy: by + 60, rx: 150, ry: 70, fill: '#1a120a', opacity: 0.32, filter: 'url(#dkShL)' }, wood);
  const woodTop = X.svg('g', {}, wood);
  X.svg('rect', { x: bx - 140, y: by - 95, width: 280, height: 170, rx: 18, fill: '#8a5a34', stroke: '#5b3a20', 'stroke-width': 4 }, woodTop);
  X.svg('rect', { x: bx - 128, y: by - 83, width: 256, height: 146, rx: 12, fill: 'none', stroke: '#a8774c', 'stroke-width': 3, opacity: 0.6 }, woodTop);
  X.svg('circle', { cx: bx, cy: by - 10, r: 52, fill: '#6b4426', stroke: '#4a2d16', 'stroke-width': 4 }, woodTop);
  X.svg('circle', { cx: bx - 16, cy: by - 28, r: 16, fill: '#c39466', opacity: 0.6 }, woodTop);
  gsap.set(wood, { opacity: 0 });
  tl.fromTo(wood, { x: 380, y: -420, opacity: 1 }, { x: 0, y: 0, opacity: 1, duration: 0.45, ease: 'power3.out', immediateRender: false }, tHover);
  X.every((t) => { if (t < tHover || t > T.cap + 0.6) return; const b = Math.sin((t - tHover) * Math.PI * 2 * 1.6) * 7; woodTop.setAttribute('transform', `translate(0,${(-24 + b).toFixed(2)})`); woodSh.setAttribute('opacity', (0.28 - b * 0.004).toFixed(3)); });
  tl.fromTo(wood, { x: 0, y: 0, rotation: 0 }, { x: 260, y: -520, rotation: 14, duration: 0.3, ease: 'power2.in', immediateRender: false }, T.cap + 0.08);
  DK.stamp(eq, '封顶', 330, 362, T.cap, { size: 110, rot: -6, sub: 'CAPPED', cam, shake: 7 });
  const vig = DK.vignette({ r: 0, dark: 1, soft: 0.5 });
  vig.to(T.iris, 0.32, { r: 560, dark: 0.95 }, 'power2.out');
  DK.flash(T.rup, { peak: 0.65, dur: 0.1 });
  vig.to(T.rup, 0.07, { r: 2600, dark: 0 }, 'power1.in');
  vig.to(T.ns, 0.001, { r: 1000, dark: 0.42, soft: 0.55 });
  vig.to(T.iso, 0.2, { dark: 0 });
  { const s = cam.stateAt(tHover + 0.5), a = R(s.r), dx = (bx - s.x) * s.s, dy = (by - s.y) * s.s; const sx = 960 + dx * Math.cos(a) - dy * Math.sin(a), sy = 540 + dx * Math.sin(a) + dy * Math.cos(a);
    vig.to(tHover + 0.05, 0.001, { cx: sx, cy: sy, r: 2600, dark: 0, soft: 0.6 }).to(tHover + 0.06, 0.22, { r: 470, dark: 0.74 }, 'power2.out'); }
  vig.to(T.cap + 0.22, 0.3, { r: 2600, dark: 0 }, 'power2.in');
  X.sfx(tHover + 0.05, 'heartbeat', { gain: 0.35, dur: 0.6 });

  // ---------------------------------------------------------------- 11 · log chart of the mark: rockets, then stops
  const CHs = { x: -620, y: -20, w: 1500, h: 900, rot: -3 };
  cam.whip(T.ch, { x: -600, y: -10, s: 1.0, r: -0.4 }, { rotKick: -1.5 });
  const ch = DK.sheet(world, { ...CHs, paper: 'graph' });
  DK.text(ch, 70, 82, 'THE PAPER MARK · MARKS PER US DOLLAR, 1914–1924', { f: 'mono', size: 28, ls: 1 });
  DK.text(ch, 72, 124, '纸马克兑美元汇率 · 对数坐标 · 月均近似值（示意）', { f: 'zhs', size: 24, weight: 500, fill: C.ink2 });
  const X0 = 170, X1 = 1400, Y0 = 790, Y1 = 190;
  const px = (yr) => X0 + ((yr - 1914) / 10.5) * (X1 - X0), py = (v) => Y0 - (Math.log10(v) / 13) * (Y0 - Y1);
  X.svg('line', { x1: X0, y1: Y0, x2: X1, y2: Y0, stroke: C.ink, 'stroke-width': 2 }, ch); X.svg('line', { x1: X0, y1: Y0, x2: X0, y2: Y1 - 20, stroke: C.ink, 'stroke-width': 2 }, ch);
  [[1, '1'], [1e3, '10³'], [1e6, '10⁶'], [1e9, '10⁹'], [1e12, '10¹²']].forEach(([v, s]) => { X.svg('line', { x1: X0 - 8, y1: py(v), x2: X1, y2: py(v), stroke: C.ink, 'stroke-width': 0.8, opacity: 0.25 }, ch); DK.text(ch, X0 - 16, py(v) + 8, s, { f: 'lat', size: 22, anchor: 'end', weight: 400 }); });
  [1914, 1916, 1918, 1920, 1922, 1924].forEach((y) => DK.text(ch, px(y), Y0 + 36, String(y), { f: 'lat', size: 22, anchor: 'middle', weight: 400 }));
  const data = [[1914.5, 4.2], [1916.5, 5.4], [1918.85, 7.4], [1919.5, 15], [1919.95, 47], [1920.1, 99], [1920.5, 39], [1921.0, 65], [1921.5, 76], [1921.87, 263], [1922.0, 192], [1922.55, 493], [1922.87, 7100], [1923.04, 17972], [1923.25, 21000], [1923.46, 110000], [1923.54, 353000], [1923.62, 4.6e6], [1923.71, 9.9e7], [1923.79, 2.5e10], [1923.88, 4.2e12]];
  const flat = [[1923.88, 4.2e12], [1924.5, 4.2e12]];
  const dl = X.svg('path', { d: 'M' + data.map(([y, v]) => `${px(y).toFixed(1)},${py(v).toFixed(1)}`).join('L'), fill: 'none', stroke: C.ink, 'stroke-width': 4.5, 'stroke-linejoin': 'round' }, ch);
  const df = X.svg('path', { d: 'M' + flat.map(([y, v]) => `${px(y).toFixed(1)},${py(v).toFixed(1)}`).join('L'), fill: 'none', stroke: C.ink, 'stroke-width': 4.5 }, ch);
  const vl = X.svg('line', { x1: px(1923.88), y1: Y0, x2: px(1923.88), y2: Y1 - 10, stroke: C.ink2, 'stroke-width': 1.6, 'stroke-dasharray': '6 6', opacity: 0 }, ch);
  const vlab = X.svg('g', {}, ch); DK.text(vlab, px(1923.88) - 12, Y0 - 30, '15.11.1923 · 地租马克', { f: 'zhs', size: 20, weight: 500, anchor: 'end', fill: C.ink2 });
  const token = X.svg('g', {}, ch); X.svg('circle', { r: 24, fill: C.kraft, stroke: C.brown, 'stroke-width': 2.5, filter: 'url(#dkShS)' }, token); DK.text(token, 0, 9, 'M', { f: 'lat', size: 24, fill: C.brown, anchor: 'middle' });
  const tD0 = T.ch + 0.32, tD1 = T.stop, tF1 = T.stop + 0.4;
  const Ld = dl.getTotalLength(), Lf = df.getTotalLength();
  dl.setAttribute('stroke-dasharray', `${Ld} ${Ld + 10}`); df.setAttribute('stroke-dasharray', `${Lf} ${Lf + 10}`);
  const eD = gsap.parseEase('power1.in'), eF = gsap.parseEase('power2.out');
  X.every((t) => {
    const p = Math.min(1, Math.max(0, (t - tD0) / (tD1 - tD0))), q = Math.min(1, Math.max(0, (t - tD1) / (tF1 - tD1)));
    const pe = eD(p), qe = eF(q);
    dl.setAttribute('stroke-dashoffset', (Ld * (1 - pe)).toFixed(1)); df.setAttribute('stroke-dashoffset', (Lf * (1 - qe)).toFixed(1));
    const pt = q > 0 ? df.getPointAtLength(Lf * qe) : dl.getPointAtLength(Ld * pe);
    token.setAttribute('transform', `translate(${pt.x.toFixed(1)},${pt.y.toFixed(1)})`);
    token.setAttribute('opacity', t < tD0 ? 0 : 1);
    vl.setAttribute('opacity', t >= tD1 ? 0.8 : 0);
    vlab.setAttribute('opacity', t >= tD1 + 0.1 ? 1 : 0);
  });
  X.sfx(tD0, 'riser', { dur: tD1 - tD0, gain: 0.35 });
  cam.move(T.ch + 0.55, T.stop - T.ch - 0.55, { x: CHs.x + 150, y: CHs.y - 70, s: 1.07, r: 0.6 }, 'power1.in');
  const [stx, sty] = [px(1922.4), py(3e10)];
  DK.stamp(ch, '止', stx, sty, T.stop, { size: 150, rot: -8, sub: 'HALT', cam, shake: 7 });
  const [swx, swy] = toWorld(CHs, stx + 70, sty + 120);
  cam.move(T.stop + 0.5, 0.6, { x: swx, y: swy, s: 1.9, r: -1 }, 'power3.inOut');

  // ---------------------------------------------------------------- 12 · nested pull-back (chart ⊂ ledger page ⊂ street desk) → dive → 信
  const pbG = X.svg('g', {}, world);
  gsap.set(pbG, { opacity: 0 }); tl.set(pbG, { opacity: 1 }, T.pb - 0.25);
  const holeMask = (id, w, h, hw, hh, seed) => {
    const m = X.svg('mask', { id, maskUnits: 'userSpaceOnUse', x: -w / 2, y: -h / 2, width: w, height: h }, X.defs);
    X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: '#fff' }, m);
    const r = X.rand(seed), pts = []; for (let i = 0; i < 40; i++) { const a = (i / 40) * Math.PI * 2; pts.push([Math.cos(a) * hw * (1 + (r() - 0.5) * 0.12), Math.sin(a) * hh * (1 + (r() - 0.5) * 0.12)]); }
    const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
    X.svg('path', { d, fill: '#000' }, m);
    return d;
  };
  const midG = X.svg('g', { transform: `translate(${CHs.x},${CHs.y}) rotate(1)` }, pbG);
  const dMid = holeMask('pbMid', 2700, 1700, 700, 420, 4);
  const midPage = X.svg('g', { mask: 'url(#pbMid)' }, midG);
  X.svg('rect', { x: -1350, y: -850, width: 2700, height: 1700, fill: DK.pat('ivory'), filter: 'url(#dkShL)' }, midPage);
  const mr2 = X.rand(6); for (let y = -800; y < 820; y += 26) { X.svg('rect', { x: -1300, y, width: 420 * (0.8 + mr2() * 0.2), height: 9, fill: '#b9b1a2', opacity: 0.7 }, midPage); X.svg('rect', { x: 880, y, width: 420 * (0.8 + mr2() * 0.2), height: 9, fill: '#b9b1a2', opacity: 0.7 }, midPage); }
  DK.text(midPage, 0, -640, 'THE LEDGER · 账本', { f: 'lat', size: 80, ls: 12, anchor: 'middle' });
  X.svg('path', { d: dMid, fill: 'none', stroke: '#f6f1e6', 'stroke-width': 7, filter: 'url(#dkShS)' }, midG);
  const outG = X.svg('g', { transform: `translate(${CHs.x},${CHs.y})` }, pbG);
  const dOut = holeMask('pbOut', 7000, 4400, 1450, 880, 9);
  const outL = X.svg('g', { mask: 'url(#pbOut)' }, outG);
  X.svg('image', { href: DK.deskURL, x: -3500, y: -2200, width: 7000, height: 4400, preserveAspectRatio: 'none', transform: 'rotate(180)' }, outL);
  X.svg('path', { d: dOut, fill: 'none', stroke: '#efe7d6', 'stroke-width': 9, filter: 'url(#dkShL)' }, outG);
  cam.move(T.pb, 2.0, { x: CHs.x + 10, y: CHs.y + 40, s: 0.6, r: 1.2 }, 'expo.out');
  X.sfx(T.pb, 'zoom_out', { dur: 0.9, gain: 0.35 });
  const pbTag = (g, zh, en, x, y, t, rot) => { const tg = DK.tag(g, zh, en, x, y, t, { size: 96, rot, from: 'top' }); return tg; };
  pbTag(ch, '钞票', 'MONEY', 330, 600, T.pb + 0.55, -3);
  pbTag(midG, '国债', 'PUBLIC DEBT', -1180, -380, T.pb + 0.85, -4);
  pbTag(outG, '街头', 'THE STREET', 1180, -740, T.pb + 1.15, 3);
  cam.move(T.pb + 2.0, T.dive - T.pb - 2.05, { x: CHs.x - 70, y: CHs.y + 70, s: 0.68, r: -0.4 }, 'sine.inOut');
  cam.zoom(T.dive, { x: CHs.x + 10, y: CHs.y + 20, s: 3.6, r: 2 }, { dur: 0.42 });

  // ---------------------------------------------------------------- 13 · the title certificate: 信
  const tc = DK.titleCard(T.title, { char: '信', title: 'CREDIT', sub: 'from Latin crēdere — to believe', promise: '钞票，是一份大家都相信的承诺',
    kicker: 'CERTIFICATE · 凭证', serial: 'No. 15-11-1923 · SERIES R', micro: 'A CURRENCY IS A PROMISE · 钞票是一份承诺 · ', tGlyph: L('end').start - 0.04 });
  const vt = DK.vignette();
  vt.to(T.title + 1.2, 0.001, { r: 1700, dark: 0, soft: 0.6 }).to(T.title + 1.25, 3.6, { r: 1050, dark: 0.5 }, 'sine.inOut');

  // ---------------------------------------------------------------- HUD + source lines
  const hud = DK.hud('纸上谈钱', '马克 · 开场');
  hud.slug(0, '1923.11 · 柏林').slug(T.er, '1914 → 1923 · 汇率').slug(T.gm, '1923.01 · 鲁尔区').slug(T.ns, '1923 秋 · 柏林')
    .slug(T.iso, '1923 · 储户').slug(T.hole, '1923 · 国债').slug(T.rd, '1923.11.15 · 柏林').slug(T.ch, '1914 — 1924 · 汇率');
  hud.source(T.rup, '钞票为原创示意图 · 1923 年 11 月，1 美元约兑 4.2 万亿纸马克')
    .source(T.er, '汇率：1914 年约 4.2 马克/美元；1923.11.20 约 4.2 万亿马克/美元')
    .source(T.gm, '1923.1.11 法国、比利时出兵鲁尔区 · 地图为示意，非精确边界')
    .source(T.c1, '插图为原创半调示意，非历史照片')
    .source(T.ns, '告示为示意，非真实文物 · 1923 年秋，物价数日翻一倍')
    .source(T.iso, '小人为示意，每个代表 1% 的马克存款购买力')
    .source(T.hole, '以马克计价的政府国内债务，随恶性通胀实际价值趋近于零')
    .source(T.rd, '1923.11.15 发行地租马克：1 地租马克 = 1 万亿纸马克 · 钞票为原创示意')
    .source(T.ch, '对数坐标 · 月均汇率近似值，示意')
    .source(T.title, '');
  hud.hide(0, T.rup).hide(T.c1, T.ns).hide(T.title, END + 1);
  hud.colorAt.push([T.c1, T.c2], [T.c3, T.ns]);

  X.grain(0.045, 12);
  X.end(END);
});
