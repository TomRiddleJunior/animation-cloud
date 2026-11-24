/* Mark Rober-style animation layer — original sample "The Ravine Runner".
 * An invented build: a rope-riding delivery robot that carries a pizza 150 m across a ravine.
 * Beats: annotated "footage" cold open → rewind → map (crow line vs 4 km drive) → the whole plan (flat sky-blue,
 * tracking camera, scale cuts) → CAD orbit flurry + sensor field-of-view volume → physics insert (weight vs
 * tension, arrow length = force, big white number) → failure / success footage tags → mono sign-off.
 * Physics: point load W = 10 kg × 9.81 = 98.1 N at mid-span of a 150 m rope with 3 m sag:
 *   sin θ = 3 / √(75² + 3²) = 0.03997 → T = W / (2 sin θ) = 1227 N (276 lbf, 12.5 × W). Rope weight ignored (on screen).
 * Footage plates are illustrated stand-ins for live action (rasterised once, then given handheld drift + push).
 */
X.boot(async (X) => {
  await X.loadVO();
  const C = K.C, tl = X.tl, S = (t, a, p) => X.svg(t, a, p);
  const W = (id, w, n = 0) => X.word(id, w, n), WE = (id, w, n = 0) => X.wordEnd(id, w, n), Ln = (id) => X.line(id);
  const END = Math.min(65.0, X.vo.duration || 65);

  // ------------------------------------------------------------------ cut list (every boundary is a hard cut)
  const T = {
    ravine: 0,
    pizza: W('hook_a', 'pizza') - 0.08,
    rope: Ln('hook_b').start - 0.1,
    deck: W('hook_b', 'right') - 0.04,
    shop: Ln('rewind').start - 0.12,
    map: Ln('map_a').start - 0.12,
    mapWide: W('map_b', 'driving') - 0.06,
    plan: Ln('plan_a').start - 0.12,
    close: W('plan_b', 'motors') - 0.08,
    track: WE('plan_b', 'second') + 0.22,
    wide2: W('plan_d', 'zips') - 0.06,
    cad: Ln('cad').start - 0.12,
    stage: W('cad', 'sensor') - 0.08,
    phys: Ln('phys_a').start - 0.12,
    creek: Ln('end_a').start - 0.1,
    win: Ln('end_b').start - 0.1,
    card: Ln('end_b').end + 0.3,
    end: END,
  };
  window.__T = T;

  // grain only on "footage" (the flat 2D layer has no texture)
  const grain = X.grain(0.0, 12);
  const footageOn = (t) => tl.set(grain, { opacity: 0.075 }, t), footageOff = (t) => tl.set(grain, { opacity: 0 }, t);

  // ------------------------------------------------------------------ local defs for rasterised plates
  let uid = 0;
  const D = (plate) => {
    const defs = S('defs', {}, plate), id = (p) => `${p}${uid++}`;
    const grad = (tag, stops, attrs) => {
      const i = id('g'), g = S(tag, { id: i, ...attrs }, defs);
      stops.forEach(([o, c, a = 1]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, g));
      return `url(#${i})`;
    };
    return {
      lin: (stops, x1 = 0, y1 = 0, x2 = 0, y2 = 1) => grad('linearGradient', stops, { x1, y1, x2, y2 }),
      linU: (stops, x1, y1, x2, y2) => grad('linearGradient', stops, { x1, y1, x2, y2, gradientUnits: 'userSpaceOnUse' }),
      rad: (stops, cx = 0.5, cy = 0.5, r = 0.5) => grad('radialGradient', stops, { cx, cy, r }),
      radU: (stops, cx, cy, r) => grad('radialGradient', stops, { cx, cy, r, gradientUnits: 'userSpaceOnUse' }),
      blur: (std) => { const i = id('b'), f = S('filter', { id: i, x: '-30%', y: '-30%', width: '160%', height: '160%' }, defs); S('feGaussianBlur', { stdDeviation: std }, f); return `url(#${i})`; },
    };
  };
  /** An illustrated "footage" plate: drawn once, rasterised, then handheld + pushed like a real camera shot. */
  const plate = async (name, t0, t1, draw, fx = {}) => {
    const sc = X.scene(name, t0, t1);
    const cam = S('g', {}, sc), content = S('g', {}, cam);
    const dd = D(content);
    draw(content, dd);
    content.setAttribute('filter', dd.blur(fx.soft ?? 0.8));
    await K.rasterize(content);
    const live = S('g', {}, cam);
    K.footage(cam, { seed: fx.seed || 1, t0, t1, amp: (fx.amp ?? 7) * 1.45, push: fx.push || [1.035, 1.075], pan: fx.pan, rot: fx.rot });
    K.vignette(sc, fx.vig ?? 0.42);
    const over = S('g', {}, sc);
    footageOn(t0);
    return { sc, cam, live, over };
  };

  // ------------------------------------------------------------------ painterly scenery helpers (plates only)
  const ridge = (y0, amp, seed, step = 60, x0 = -40, x1 = 1960) => {
    const r = X.rand(seed); let d = `M${x0},1100 L${x0},${y0}`;
    for (let x = x0; x <= x1; x += step) d += ` L${x},${(y0 - amp * (0.5 + 0.5 * Math.sin(x * 0.004 + seed) * Math.sin(x * 0.0013 + seed * 2)) - r() * amp * 0.25).toFixed(1)}`;
    return d + ` L${x1},1100 Z`;
  };
  const blades = (p, n, area, cols, seed, hMin = 10, hMax = 28, op = 0.8) => {
    const r = X.rand(seed); let ds = cols.map(() => '');
    for (let i = 0; i < n; i++) {
      const x = area.x + r() * area.w, y = area.y(x) + r() * area.h, h = hMin + r() * (hMax - hMin), lean = (r() - 0.5) * h * 0.6, k = Math.floor(r() * cols.length);
      ds[k] += `M${(x - 1.6).toFixed(1)},${y.toFixed(1)} L${(x + lean).toFixed(1)},${(y - h).toFixed(1)} L${(x + 1.6).toFixed(1)},${y.toFixed(1)}Z`;
    }
    ds.forEach((d, k) => S('path', { d, fill: cols[k], opacity: op }, p));
  };
  const foliage = (p, cx, cy, R, seed, pal, sx = 1.25, sy = 0.8) => {
    const r = X.rand(seed);
    pal.forEach((col, li) => {
      for (let i = 0; i < 16; i++) {
        const a = r() * Math.PI * 2, dd = R * (0.15 + r() * 0.8) * (1 - li * 0.08);
        S('circle', { cx: (cx + Math.cos(a) * dd * sx - li * R * 0.07).toFixed(1), cy: (cy + Math.sin(a) * dd * sy - li * R * 0.09).toFixed(1), r: (R * (0.2 + r() * 0.16) * (1 - li * 0.12) + 8).toFixed(1), fill: col }, p);
      }
    });
  };
  const LEAVES = ['#36523A', '#4C6F45', '#668A52', '#86A866'];
  const trunk = (p, d, x, yb, yt, wb, wt) => {
    S('path', { d: `M${x - wb},${yb} C${x - wb * 0.7},${yb - (yb - yt) * 0.45} ${x - wt * 1.1},${yt + (yb - yt) * 0.3} ${x - wt},${yt} L${x + wt},${yt} C${x + wt * 1.1},${yt + (yb - yt) * 0.3} ${x + wb * 0.7},${yb - (yb - yt) * 0.45} ${x + wb},${yb} Z`, fill: d.lin([[0, '#4A372A'], [0.45, '#7A5C45'], [0.8, '#8C6B50'], [1, '#4A372A']], 0, 0, 1, 0) }, p);
    for (let k = 0; k < 6; k++) S('path', { d: `M${x - wt * 0.5 + k * wt * 0.25},${yt + 10} q${(k % 2 ? 4 : -4)},${(yb - yt) * 0.4} ${(k % 2 ? -2 : 3)},${(yb - yt) * 0.85}`, stroke: '#3E2E22', 'stroke-width': 2, fill: 'none', opacity: 0.45 }, p);
  };
  const planks = (p, d, x, y, w, h, n, o = {}) => {
    const g = S('g', {}, p);
    for (let i = 0; i < n; i++) {
      const px = x + (w / n) * i;
      S('rect', { x: px + 1, y, width: w / n - 2, height: h, fill: d.lin([[0, o.hi || '#B8946B'], [1, o.lo || '#8C6A48']]) }, g);
    }
    return g;
  };
  /** The real (shaded) robot for footage plates — origin = rope contact point. */
  const realRobot = (p, d, x, y, s = 1, o = {}) => {
    const g = S('g', { transform: `translate(${x},${y}) rotate(${o.rot || 0}) scale(${s})` }, p);
    const metal = d.lin([[0, '#F4F6F8'], [0.45, '#CDD2D7'], [1, '#8C939A']]), dark = d.lin([[0, '#5D6268'], [1, '#232629']]);
    const rubber = d.rad([[0, '#55585B'], [0.65, '#2A2C2E'], [1, '#121314']]);
    S('rect', { x: -40, y: -27, width: 80, height: 36, rx: 6, fill: dark }, g);
    for (const wx of [-24, 24]) { S('circle', { cx: wx, cy: -14, r: 15, fill: rubber }, g); S('circle', { cx: wx, cy: -14, r: 5.5, fill: '#C3C8CD' }, g); S('circle', { cx: wx - 1.5, cy: -15.5, r: 2, fill: '#fff', opacity: 0.7 }, g); }
    S('rect', { x: -49, y: 5, width: 98, height: 42, rx: 9, fill: metal }, g);
    S('rect', { x: -45, y: 8, width: 90, height: 8, rx: 4, fill: '#fff', opacity: 0.45 }, g);
    S('line', { x1: -8, y1: 14, x2: -8, y2: 44, stroke: '#8A9096', 'stroke-width': 1.3 }, g);
    S('rect', { x: -45, y: 17, width: 21, height: 19, rx: 4, fill: dark }, g);
    S('rect', { x: 24, y: 17, width: 21, height: 19, rx: 4, fill: dark }, g);
    S('rect', { x: 45, y: 18, width: 13, height: 17, rx: 3, fill: '#E8C21B' }, g);
    S('circle', { cx: 53, cy: 26.5, r: 4.4, fill: '#1B1D20' }, g); S('circle', { cx: 54.3, cy: 25.2, r: 1.5, fill: '#fff' }, g);
    S('circle', { cx: -32, cy: 41, r: 2.6, fill: '#62FF91' }, g);
    S('circle', { cx: 0, cy: 51, r: 8, fill: dark }, g);
    if (o.box !== false) {
      const L = o.drop ?? 28;
      S('line', { x1: 0, y1: 57, x2: 0, y2: 57 + L, stroke: '#1E1E1E', 'stroke-width': 1.8 }, g);
      pizzaBox(g, d, 0, 57 + L, 1);
    }
    return g;
  };
  const pizzaBox = (p, d, x, y, s = 1, o = {}) => {
    const g = S('g', { transform: `translate(${x},${y}) scale(${s}) rotate(${o.rot || 0})` }, p);
    S('rect', { x: -36, y: 0, width: 72, height: 21, rx: 2, fill: d.lin([[0, '#E6C48F'], [1, '#B78C56']]) }, g);
    S('rect', { x: -36, y: 0, width: 72, height: 5, fill: '#F3DAAB' }, g);
    S('rect', { x: -36, y: 16, width: 72, height: 5, fill: '#9F7646', opacity: 0.55 }, g);
    S('circle', { cx: 15, cy: 11, r: 4.2, fill: '#C8452F', opacity: 0.9 }, g);
    return g;
  };
  const rope = (p, pts, w = 3.4, col = '#2B2623') => {
    let d = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const a = pts[i - 1], b = pts[i]; d += ` Q${(a[0] + b[0]) / 2},${(a[1] + b[1]) / 2 + 6} ${b[0]},${b[1]}`; }
    S('path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, p);
    S('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': w * 0.25, opacity: 0.25, transform: 'translate(0,-1)' }, p);
  };

  // ================================================================== 1 · COLD OPEN — annotated "footage"
  const P1 = await plate('ravine', T.ravine, T.pizza, (g, d) => {
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: d.lin([[0, '#6C9BC3'], [0.5, '#B7D0DF'], [0.62, '#E8E5D6'], [1, '#E8E5D6']]) }, g);
    S('circle', { cx: 1700, cy: 230, r: 760, fill: d.rad([[0, '#FFF3D4', 0.8], [1, '#FFF3D4', 0]]) }, g);
    S('path', { d: ridge(520, 70, 3), fill: '#9EB4BE', filter: d.blur(3) }, g);
    S('path', { d: ridge(575, 45, 5, 50), fill: '#7F99A2', filter: d.blur(2) }, g);
    const tr = X.rand(8); let tdots = '';
    for (let x = -20; x < 1960; x += 18) { const yy = 612 - tr() * 22; tdots += `M${x},${yy} a${14 + tr() * 10},${16 + tr() * 12} 0 1 0 0.1,0Z`; }
    S('path', { d: tdots, fill: '#5A7A60', filter: d.blur(1.6) }, g);
    // left bank, ravine walls, creek, right bank (looking up the gorge)
    S('path', { d: 'M-20,640 L905,612 L380,1100 L-20,1100Z', fill: d.lin([[0, '#93B26A'], [0.55, '#6D8E4B'], [1, '#4B6A36']]) }, g);
    S('path', { d: 'M905,612 L946,634 L805,1100 L380,1100Z', fill: d.linU([[0, '#C9AE8B'], [0.55, '#9B8064'], [1, '#55463A']], 700, 620, 600, 1100) }, g);
    const fr = X.rand(44);
    // rock facets: irregular patches placed in (depth u, across v) wall coordinates, sized by perspective
    const facets = (lip0, lip1, fl0, fl1, cols, n) => {
      for (let i = 0; i < n; i++) {
        const u = Math.pow(fr(), 0.7), v = fr(), P = (uu, vv) => { const lx = K.lerp(lip0[0], lip1[0], uu), ly = K.lerp(lip0[1], lip1[1], uu), fx = K.lerp(fl0[0], fl1[0], uu), fy = K.lerp(fl0[1], fl1[1], uu); return [K.lerp(lx, fx, vv), K.lerp(ly, fy, vv)]; };
        const du = 0.02 + fr() * 0.05, dv = 0.12 + fr() * 0.2, pts = [P(u, v), P(u + du, v + dv * 0.2), P(u + du * 1.2, v + dv), P(u + du * 0.1, v + dv * 0.9)];
        S('polygon', { points: pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' '), fill: cols[Math.floor(fr() * cols.length)], opacity: 0.3 + fr() * 0.35 }, g);
      }
    };
    facets([905, 612], [380, 1100], [946, 634], [805, 1100], ['#E0C9A6', '#7C6450', '#5E4B3A', '#B89C7A'], 170);
    S('path', { d: 'M1002,612 L974,634 L1125,1100 L1580,1100Z', fill: d.linU([[0, '#7C6B59'], [0.6, '#54483D'], [1, '#2F2822']], 1200, 620, 1300, 1100) }, g);
    facets([1002, 612], [1580, 1100], [974, 634], [1125, 1100], ['#2A231D', '#6E5E4E', '#3E342B', '#8A7762'], 170);
    S('path', { d: 'M946,634 L974,634 L1125,1100 L805,1100Z', fill: d.lin([[0, '#B9D3DA'], [0.4, '#7FA9B5'], [1, '#3F6E7D']]) }, g);
    S('path', { d: 'M946,634 L960,634 L860,1100 L805,1100Z', fill: '#2E2620', opacity: 0.35 }, g);
    const wr = X.rand(21);
    for (let i = 0; i < 30; i++) { const yy = 650 + wr() * 430, k = (yy - 634) / 466, cx = 960 + (wr() - 0.5) * (20 + 260 * k); S('ellipse', { cx, cy: yy, rx: 6 + 24 * k * wr(), ry: 1.2 + 2 * k, fill: '#fff', opacity: 0.35 + wr() * 0.3 }, g); }
    for (let i = 0; i < 9; i++) { const yy = 700 + wr() * 360, k = (yy - 634) / 466; S('ellipse', { cx: 835 + k * 10 + wr() * 30, cy: yy, rx: 12 + 26 * k, ry: 7 + 15 * k, fill: '#6F6457' }, g); }
    S('path', { d: 'M1002,612 L1940,628 L1940,1100 L1580,1100Z', fill: d.lin([[0, '#A2BC72'], [0.5, '#77994E'], [1, '#527239']]) }, g);
    S('path', { d: 'M905,612 L380,1100 L360,1100 L898,610Z', fill: '#C7D99A', opacity: 0.7 }, g);
    blades(g, 2200, { x: -20, w: 640, y: (x) => 640 + (x / 905) * -28 + 6, h: 440 }, ['#5E7F40', '#87A85E', '#4A6A33'], 4, 8, 22, 0.55);
    blades(g, 2200, { x: 1300, w: 640, y: () => 640, h: 440 }, ['#668A45', '#93B468', '#50703A'], 5, 8, 22, 0.55);
    for (let i = 0; i < 5; i++) foliage(g, 840 - i * 95, 660 + i * 95, 22 + i * 8, 40 + i, ['#3F5E36', '#58784A']);
    for (let i = 0; i < 4; i++) foliage(g, 1060 + i * 110, 680 + i * 100, 24 + i * 9, 60 + i, ['#2F4A2C', '#46653D']);
    // treehouse (right)
    trunk(g, d, 1725, 820, 160, 46, 30);
    S('rect', { x: 1470, y: 556, width: 470, height: 22, fill: d.lin([[0, '#B48F65'], [1, '#7D5E40']]) }, g);
    for (let k = 0; k < 9; k++) S('rect', { x: 1480 + k * 52, y: 500, width: 7, height: 58, fill: '#7D5E40' }, g);
    S('rect', { x: 1470, y: 496, width: 470, height: 9, fill: '#94714D' }, g);
    S('path', { d: 'M1500,578 L1700,700 L1712,688 L1520,570Z', fill: '#6E5238' }, g);
    S('rect', { x: 1770, y: 410, width: 180, height: 148, fill: d.lin([[0, '#C2A07A'], [1, '#97765A']], 0, 0, 1, 0) }, g);
    S('path', { d: 'M1750,414 L1870,330 L1960,400 L1960,414Z', fill: '#6E5547' }, g);
    S('rect', { x: 1800, y: 450, width: 46, height: 40, fill: '#3B2E25' }, g);
    foliage(g, 1700, 150, 230, 12, LEAVES, 1.4, 0.85);
    S('circle', { cx: 1700, cy: 430, r: 9, fill: '#C8C8C8' }, g);
    // my deck (left foreground)
    S('rect', { x: -20, y: 560, width: 320, height: 26, fill: d.lin([[0, '#B48F65'], [1, '#7D5E40']]) }, g);
    for (const px of [20, 140, 260]) S('rect', { x: px, y: 586, width: 18, height: 320, fill: d.lin([[0, '#7D5E40'], [1, '#5A4330']], 0, 0, 1, 0) }, g);
    for (let k = 0; k < 6; k++) S('rect', { x: -10 + k * 52, y: 500, width: 8, height: 60, fill: '#8C6A48' }, g);
    S('rect', { x: -20, y: 492, width: 320, height: 10, fill: '#A07D58' }, g);
    S('rect', { x: 262, y: 380, width: 16, height: 182, fill: d.lin([[0, '#8C6A48'], [1, '#5A4330']], 0, 0, 1, 0) }, g);
    S('circle', { cx: 270, cy: 395, r: 7, fill: '#C8C8C8' }, g);
    // rope + robot + pizza
    rope(g, [[270, 395], [985, 452], [1700, 430]], 3.6);
    realRobot(g, d, 985, 452, 1.3);
    // foreground grass (out of focus)
    const fg = S('g', { filter: d.blur(5) }, g);
    blades(fg, 260, { x: -40, w: 2000, y: () => 1010, h: 90 }, ['#2F4524', '#3E5A2E'], 9, 40, 110, 0.95);
  }, { seed: 2, amp: 6, push: [1.04, 1.075] });
  gsap.set(P1.sc, { autoAlpha: 1 }); gsap.set(grain, { opacity: 0.075 });        // a set at exactly t = 0 never renders on seek(0)
  K.pointer(P1.over, { x: 958, y: 800, angle: 62, len: 250 }, W('hook_a', 'ravine') - 0.04, T.pizza, 18);

  const P1b = await plate('pizzaclose', T.pizza, T.rope, (g, d) => {
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: d.lin([[0, '#5F92BF'], [0.7, '#A9C6DA'], [1, '#DCE3DC']]) }, g);
    const bk = S('g', { filter: d.blur(14) }, g);
    foliage(bk, 1700, 220, 340, 33, ['#3E5E3F', '#557A4C', '#6E9358'], 1.3, 0.9);
    S('path', { d: ridge(900, 90, 13), fill: '#7E9A86' }, bk);
    S('path', { d: ridge(980, 60, 14), fill: '#6C8C55' }, bk);
    const bo = X.rand(17);
    for (let i = 0; i < 14; i++) S('circle', { cx: 1350 + bo() * 560, cy: bo() * 520, r: 18 + bo() * 30, fill: '#FFF6DC', opacity: 0.18 + bo() * 0.2, filter: d.blur(3) }, g);
    rope(g, [[-30, 318], [900, 362], [1950, 300]], 9);
    realRobot(g, d, 900, 362, 4.2, { drop: 26 });
  }, { seed: 9, amp: 9, push: [1.03, 1.08], soft: 0.6 });
  K.pointer(P1b.over, { x: 700, y: 772, angle: 12, len: 260, seed: 4 }, T.pizza + 0.04, T.rope, 16);

  const P2 = await plate('alongrope', T.rope, T.deck, (g, d) => {
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: d.lin([[0, '#6596C0'], [0.45, '#B4CEDD'], [0.56, '#E9E3D0']]) }, g);
    S('circle', { cx: 1500, cy: 260, r: 700, fill: d.rad([[0, '#FFF1CF', 0.75], [1, '#FFF1CF', 0]]) }, g);
    S('path', { d: ridge(470, 60, 7), fill: '#9BB2BC', filter: d.blur(3) }, g);
    S('path', { d: ridge(520, 40, 9, 50), fill: '#7D97A0', filter: d.blur(2) }, g);
    // far bank top + far wall (lit rock) + ravine floor
    S('path', { d: 'M-20,560 C400,545 900,548 1940,530 L1940,640 L-20,660Z', fill: d.lin([[0, '#9AB66D'], [1, '#6E8F4A']]) }, g);
    S('path', { d: 'M-20,655 C500,640 1100,644 1940,632 L1940,860 C1300,880 600,885 -20,880Z', fill: d.lin([[0, '#C9AE8A'], [0.6, '#9C8165'], [1, '#6F5A47']]) }, g);
    for (let k = 0; k < 9; k++) S('path', { d: `M-20,${680 + k * 22} C600,${668 + k * 24} 1200,${672 + k * 23} 1940,${660 + k * 24}`, stroke: '#7A644E', 'stroke-width': 2, fill: 'none', opacity: 0.3 }, g);
    const vr = X.rand(52);
    for (let k = 0; k < 40; k++) { const x = vr() * 1960; S('path', { d: `M${x},${650 + vr() * 20} l${(vr() - 0.5) * 30},${70 + vr() * 60} l${(vr() - 0.5) * 24},${60 + vr() * 50}`, stroke: '#5E4A38', 'stroke-width': 2 + vr() * 2, fill: 'none', opacity: 0.45 }, g); }
    S('path', { d: 'M-20,800 C600,810 1300,800 1940,786 L1940,862 C1300,880 600,885 -20,880Z', fill: '#2E241C', opacity: 0.45 }, g);
    for (let i = 0; i < 10; i++) foliage(g, 80 + i * 190, 650 + (i % 3) * 30, 34 + (i % 4) * 8, 80 + i, ['#3F5E36', '#5B7C4A', '#77985A']);
    S('path', { d: 'M-20,875 C600,880 1300,875 1940,856 L1940,930 L-20,940Z', fill: d.lin([[0, '#88AFBA'], [1, '#527F8E']]) }, g);
    S('path', { d: 'M-20,935 C700,925 1300,930 1940,925 L1940,1100 L-20,1100Z', fill: d.lin([[0, '#5D4D3E'], [1, '#2E261F']]) }, g);
    // treehouse on the far bank
    trunk(g, d, 1420, 600, 250, 26, 17);
    S('rect', { x: 1250, y: 462, width: 290, height: 13, fill: '#8C6A48' }, g);
    for (let k = 0; k < 8; k++) S('rect', { x: 1256 + k * 40, y: 430, width: 5, height: 34, fill: '#7D5E40' }, g);
    S('rect', { x: 1250, y: 428, width: 290, height: 6, fill: '#94714D' }, g);
    S('rect', { x: 1450, y: 372, width: 110, height: 92, fill: '#B39272' }, g);
    S('path', { d: 'M1438,375 L1505,320 L1572,375Z', fill: '#6E5547' }, g);
    foliage(g, 1420, 230, 150, 15, LEAVES, 1.35, 0.8);
    foliage(g, 300, 470, 110, 16, ['#4A6A44', '#5E7F4F', '#7A9A5E'], 1.4, 0.6);
    // the rope runs from my deck (bottom-left, near) to the treehouse (far)
    S('path', { d: 'M150,1010 L1405,418 L1407,421 L162,1022Z', fill: '#2B2623' }, g);
    realRobot(g, d, 612, 795, 0.78, { rot: -25 });
    // my deck rail, out of focus in the foreground
    const fg = S('g', { filter: d.blur(6) }, g);
    S('rect', { x: -40, y: 960, width: 700, height: 40, fill: '#7D5E40', transform: 'rotate(-8 0 980)' }, fg);
    S('rect', { x: 120, y: 900, width: 46, height: 220, fill: '#5E4532' }, fg);
  }, { seed: 3, amp: 7, push: [1.05, 1.085] });
  // dashed planned path along the rope + formulas (appear 5 frames apart)
  const path2 = S('path', { d: 'M650,780 L1380,432', fill: 'none', stroke: '#fff', 'stroke-width': 5, 'stroke-dasharray': '18 16', opacity: 0.85, 'stroke-linecap': 'round' }, P2.over);
  gsap.set(path2, { autoAlpha: 0 }); tl.set(path2, { autoAlpha: 1 }, W('hook_b', 'fly'));
  tl.fromTo(path2, { strokeDashoffset: 300 }, { strokeDashoffset: 0, duration: 1.2, ease: 'none', immediateRender: false }, W('hook_b', 'fly'));
  const f1 = K.formula(P2.over, 'T = W / 2sinθ', 170, 250, { rot: -5, size: 96 });
  const f2 = K.formula(P2.over, 'ΣF = 0', 1180, 190, { rot: 4, size: 96 });
  const f3 = K.formula(P2.over, 'v = 4 m/s', 1120, 790, { rot: -3, size: 88 });
  K.scribbleIn([f1, f2, f3], W('hook_b', 'physics') - 0.05);

  const P3 = await plate('deck', T.deck, T.shop, (g, d) => {
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#3A2C21' }, g);
    for (let i = 0; i < 14; i++) {           // planks in perspective, narrowing toward the top
      const y0 = 1080 * Math.pow(i / 14, 1.25) - 40, y1 = 1080 * Math.pow((i + 1) / 14, 1.25) - 46;
      S('rect', { x: -40, y: y0, width: 2000, height: Math.max(8, y1 - y0 - 5), fill: d.lin([[0, i % 3 ? '#B48E63' : '#A9845A'], [1, '#8A6845']]) }, g);
      const gr = X.rand(100 + i);
      for (let k = 0; k < 6; k++) S('path', { d: `M${-40 + gr() * 400},${y0 + 4 + gr() * (y1 - y0 - 10)} q600,${(gr() - 0.5) * 8} 1400,${(gr() - 0.5) * 6}`, stroke: '#7A5A3B', 'stroke-width': 1.4, fill: 'none', opacity: 0.4 }, g);
    }
    const lr = X.rand(31), light = S('g', { filter: d.blur(26), opacity: 0.55 }, g);
    for (let i = 0; i < 9; i++) S('ellipse', { cx: lr() * 1920, cy: 200 + lr() * 880, rx: 90 + lr() * 140, ry: 40 + lr() * 60, fill: '#FFE7B5' }, light);
    for (let i = 0; i < 14; i++) { const x = lr() * 1920, y = 300 + lr() * 760; S('path', { d: `M${x},${y} q14,-18 34,-4 q-16,18 -34,4Z`, fill: ['#7C8F3E', '#B7952F', '#5F7A3A'][i % 3], transform: `rotate(${lr() * 360} ${x} ${y})` }, g); }
    const fg = S('g', { filter: d.blur(7) }, g);
    S('rect', { x: 1720, y: -40, width: 70, height: 1200, fill: '#5E4532' }, fg);
    S('rect', { x: 1600, y: 120, width: 400, height: 40, fill: '#6E5238' }, fg);
  }, { seed: 4, amp: 8, push: [1.04, 1.09] });
  const xmark = K.redX(P3.over, 960, 650, 260);
  K.stamp(xmark, W('hook_b', 'here') - 0.03);

  // ================================================================== 2 · REWIND — workshop plate
  const P4 = await plate('shop', T.shop, T.map, (g, d) => {
    const wall = S('g', { filter: d.blur(2.2) }, g);
    S('rect', { x: 0, y: 0, width: 1920, height: 720, fill: d.lin([[0, '#BFA57E'], [1, '#A68C66']]) }, wall);
    let holes = '';
    for (let y = 30; y < 560; y += 34) for (let x = 20; x < 1920; x += 34) holes += `M${x},${y} m-3.5,0 a3.5,3.5 0 1 0 7,0 a3.5,3.5 0 1 0 -7,0`;
    S('path', { d: holes, fill: '#6E5A40', opacity: 0.6 }, wall);
    const tool = (dd, fill) => S('path', { d: dd, fill }, wall);
    tool('M300,90 l26,0 l0,260 l-26,0Z M282,80 l62,0 l0,34 l-62,0Z', '#8A9096');                  // wrench-ish
    tool('M420,100 l90,0 l0,40 l-90,0Z M455,140 l20,0 l0,230 l-20,0Z', '#5D6268');                 // hammer head
    S('rect', { x: 455, y: 200, width: 20, height: 170, fill: '#B07A45' }, wall);
    tool('M610,110 l16,0 l26,230 l-16,0Z M680,110 l-16,0 l-26,230 l16,0Z', '#C0392B');            // pliers
    S('circle', { cx: 645, cy: 110, r: 16, fill: '#7E858C' }, wall);
    for (let k = 0; k < 6; k++) { S('rect', { x: 800 + k * 46, y: 90, width: 18, height: 120, rx: 6, fill: ['#E8C21B', '#3F6FE0', '#C0392B', '#2E8B57', '#E8C21B', '#555'][k] }, wall); S('rect', { x: 805 + k * 46, y: 210, width: 8, height: 110, fill: '#B5BBC1' }, wall); }
    S('circle', { cx: 1240, cy: 200, r: 70, fill: 'none', stroke: '#C9A15A', 'stroke-width': 18 }, wall);    // coil of rope
    S('circle', { cx: 1240, cy: 200, r: 46, fill: 'none', stroke: '#B48E4E', 'stroke-width': 14 }, wall);
    S('rect', { x: 1400, y: 120, width: 300, height: 30, fill: '#7E858C' }, wall);
    for (let k = 0; k < 14; k++) S('path', { d: `M${1405 + k * 21},150 l10,22 l10,-22Z`, fill: '#7E858C' }, wall);
    S('rect', { x: 1700, y: 128, width: 120, height: 14, fill: '#B07A45' }, wall);
    S('rect', { x: 0, y: 560, width: 1920, height: 22, fill: '#8C6A48' }, wall);
    for (let k = 0; k < 9; k++) { S('path', { d: `M${40 + k * 210},582 l170,0 l-10,110 l-150,0Z`, fill: d.lin([[0, '#F08A3A'], [1, '#C45F1E']]) }, wall); S('rect', { x: 90 + k * 210, y: 600, width: 70, height: 14, rx: 3, fill: '#fff', opacity: 0.6 }, wall); }
    S('circle', { cx: 300, cy: 120, r: 900, fill: d.radU([[0, '#FFE2A8', 0.45], [1, '#FFE2A8', 0]], 300, 120, 900) }, g);
    // bench
    S('path', { d: 'M-20,760 L1940,740 L1940,1100 L-20,1100Z', fill: d.lin([[0, '#C79E6E'], [1, '#8E6A44']]) }, g);
    S('rect', { x: -20, y: 720, width: 1960, height: 46, fill: d.lin([[0, '#D8B282'], [1, '#A47D53']]) }, g);
    const sh = (x, y, w, h) => S('ellipse', { cx: x, cy: y, rx: w, ry: h, fill: '#000', opacity: 0.22, filter: d.blur(8) }, g);
    // laptop with a CAD view
    sh(470, 1000, 330, 30);
    S('path', { d: 'M180,990 L760,990 L800,1030 L140,1030Z', fill: '#9EA4AA' }, g);
    S('path', { d: 'M210,640 L730,640 L742,990 L198,990Z', fill: '#2B2F33' }, g);
    S('path', { d: 'M226,656 L714,656 L724,972 L216,972Z', fill: d.lin([[0, '#FDFDFD'], [1, '#E2E5E9']]) }, g);
    S('path', { d: 'M400,780 l80,-40 l80,40 l0,90 l-80,40 l-80,-40Z', fill: '#B9BEC4', stroke: '#33373B', 'stroke-width': 2 }, g);
    S('path', { d: 'M400,780 l80,40 l80,-40 M480,820 l0,90', fill: 'none', stroke: '#33373B', 'stroke-width': 2 }, g);
    S('rect', { x: 226, y: 656, width: 488, height: 18, fill: '#EEF0F2' }, g);
    // half-built robot, wheels, battery, a pizza box (obviously)
    sh(1080, 985, 210, 26);
    realRobot(g, d, 1080, 860, 2.0, { box: false });
    S('rect', { x: 1020, y: 862, width: 100, height: 40, fill: '#2C6E49', opacity: 0.9 }, g);
    for (let k = 0; k < 5; k++) S('path', { d: `M${1030 + k * 18},880 q${10 + k * 4},${50 + k * 6} ${60 + k * 10},${70 + k * 4}`, stroke: ['#C0392B', '#222', '#E8C21B', '#3F6FE0', '#C0392B'][k], 'stroke-width': 3, fill: 'none' }, g);
    for (const [wx, wy] of [[1390, 960], [1470, 975]]) { sh(wx, wy + 34, 44, 10); S('circle', { cx: wx, cy: wy, r: 40, fill: d.rad([[0, '#55585B'], [0.7, '#2A2C2E'], [1, '#121314']]) }, g); S('circle', { cx: wx, cy: wy, r: 13, fill: '#C3C8CD' }, g); }
    sh(1640, 1010, 120, 18);
    S('rect', { x: 1560, y: 920, width: 170, height: 80, rx: 8, fill: d.lin([[0, '#3D5A80'], [1, '#22344D']]) }, g);
    S('rect', { x: 1580, y: 940, width: 60, height: 14, rx: 3, fill: '#E8C21B' }, g);
    sh(1830, 940, 140, 20);
    S('path', { d: 'M1700,880 L1960,860 L1960,930 L1700,950Z', fill: d.lin([[0, '#E6C48F'], [1, '#B78C56']]) }, g);
    S('path', { d: 'M1700,880 L1960,860 L1960,872 L1700,892Z', fill: '#F3DAAB' }, g);
  }, { seed: 5, amp: 5, push: [1.03, 1.08] });
  X.sfx(W('rewind', 'rewind'), 'zoom_out', { gain: 0.25, dur: 0.5 });

  // ================================================================== 3 · MAP — crow line vs the drive
  {
    const sc = X.scene('map', T.map, T.plan);
    footageOff(T.map); K.cut(T.map, 'whoosh', 0.18);
    const cam = S('g', {}, sc);
    K.mapBase(cam);
    const r = X.rand(77);
    // building footprints for texture
    let bl = '';
    for (let i = 0; i < 420; i++) { const x = r() * 3840, y = r() * 2160; if (Math.abs(x - (1930 + 60 * Math.sin(y / 300))) < 190) continue; bl += `M${x.toFixed(0)},${y.toFixed(0)}h${(30 + r() * 40).toFixed(0)}v${(24 + r() * 30).toFixed(0)}h-${(30 + r() * 40).toFixed(0)}Z`; }
    S('path', { d: bl, fill: '#E6E6E3' }, cam);
    S('rect', { x: 2900, y: 1250, width: 360, height: 260, fill: C.park, rx: 8 }, cam);
    S('rect', { x: 700, y: 500, width: 300, height: 220, fill: C.park, rx: 8 }, cam);
    const rav = 'M1880,-150 C1990,300 1830,700 1950,1100 S2030,1700 1950,2350';
    S('path', { d: rav, fill: 'none', stroke: C.park, 'stroke-width': 230 }, cam);
    S('path', { d: rav, fill: 'none', stroke: C.water, 'stroke-width': 16 }, cam);
    const roads = ['M-100,220 L3940,220', 'M1500,-100 L1500,2300', 'M2500,-100 L2500,2300', 'M1500,1700 L1820,1700', 'M1500,1150 L1770,1150',
      'M1500,650 L1790,650', 'M600,-100 L600,2300', 'M-100,1420 L1500,1420', 'M1000,220 L1000,2300', 'M2140,1690 L2500,1690', 'M2110,1180 L2500,1180',
      'M2500,880 L3940,880', 'M3150,220 L3150,2300', 'M2500,1960 L3940,1960', 'M-100,900 L1500,900', 'M2500,560 L3940,560'];
    roads.forEach((dd, i) => K.mapRoad(cam, dd, i < 3 ? 34 : 24));
    for (const [x, y] of [[1820, 1700], [1770, 1150], [1790, 650], [2140, 1690], [2110, 1180]]) S('circle', { cx: x, cy: y, r: 26, fill: '#fff' }, cam);
    K.mapLabel(cam, 'Ridge Rd', 2240, 200, 0, { size: 34 });
    K.mapLabel(cam, 'Old Mill Rd', 1475, 1980, -90, { size: 34 });
    K.mapLabel(cam, 'Hollow Ln', 2475, 1350, -90, { size: 34 });
    K.mapLabel(cam, 'Maple Ct', 1660, 1680, 0, { size: 30 });
    K.mapLabel(cam, 'Fern Ct', 2330, 1672, 0, { size: 30 });
    K.mapLabel(cam, 'Creekside Park', 1990, 1420, -78, { size: 34, color: '#5E8F5E', weight: 600 });
    S('circle', { cx: 1180, cy: 980, r: 18, fill: '#E8893A' }, cam); K.mapLabel(cam, 'Corner Cafe', 1180, 1030, 0, { size: 28, color: '#C46B22' });
    S('circle', { cx: 2860, cy: 1180, r: 18, fill: '#33A3A0' }, cam); K.mapLabel(cam, 'Pine School', 2860, 1230, 0, { size: 28, color: '#2A8784' });
    K.houseDiamond(cam, 1820, 1700, 1.25);
    const pin = S('g', {}, cam); K.mapPin(pin, 2140, 1690, '#D9472F', 1.3);
    gsap.set(pin, { autoAlpha: 0 }); tl.set(pin, { autoAlpha: 1 }, W('map_a', 'theo'));
    tl.fromTo(pin, { y: -14 }, { y: 0, duration: 0.12, ease: 'power2.in', immediateRender: false }, W('map_a', 'theo'));
    X.sfx(W('map_a', 'theo'), 'pop', { gain: 0.3 });
    const crow = S('path', { d: 'M1820,1700 L2140,1690', stroke: '#3B4652', 'stroke-width': 7, 'stroke-dasharray': '16 12', fill: 'none', 'stroke-linecap': 'round' }, cam);
    const crowMask = S('path', { d: 'M1820,1700 L2140,1690', stroke: '#fff', 'stroke-width': 12, fill: 'none' }, X.svg('mask', { id: 'crowmask' }, X.defs));
    crow.setAttribute('mask', 'url(#crowmask)');
    X.drawOn(crowMask, W('map_b', 'crow'), 0.5, 'power1.inOut');
    X.sfx(W('map_b', 'crow'), 'swoosh', { gain: 0.25, dur: 0.4 });
    // route: densified GPS fixes along the 4 km drive
    const R0 = [[1820, 1700], [1500, 1700], [1500, 220], [2500, 220], [2500, 1690], [2140, 1690]], pts = [R0[0]];
    for (let i = 1; i < R0.length; i++) { const a = R0[i - 1], b = R0[i], n = Math.max(1, Math.round(Math.hypot(b[0] - a[0], b[1] - a[1]) / 520)); for (let k = 1; k <= n; k++) pts.push([a[0] + (b[0] - a[0]) * k / n, a[1] + (b[1] - a[1]) * k / n]); }
    const tStart = W('map_b', 'driving') + 0.05, step = Math.min(0.5, (T.plan - 0.35 - tStart) / (pts.length - 1));
    const track = K.gpsTrack(cam, pts, tStart, step, { width: 15 });
    gsap.set(track.g, { autoAlpha: 0 }); tl.set(track.g, { autoAlpha: 1 }, T.mapWide);
    // camera: tight crop on the two houses, then a hard-cut reframe to the whole drive
    X.every((t) => {
      if (t < T.map || t > T.plan) return;
      const wide = t >= T.mapWide;
      const s = wide ? K.lerp(0.58, 0.63, K.prog(t, T.mapWide, T.plan - T.mapWide, 'sine.inOut')) : K.lerp(1.42, 1.66, K.prog(t, T.map, T.mapWide - T.map, 'sine.inOut'));
      const fx = wide ? 2010 : 1985, fy = wide ? 950 : 1650;
      cam.setAttribute('transform', `translate(960,540) scale(${s}) translate(${-fx},${-fy})`);
    });
    const hud = S('g', {}, sc);
    K.disclaimer(hud, "(not theo's actual house)");
    const c150 = K.chip(hud, '150 m', 960, 560, { size: 30 });
    gsap.set(c150, { autoAlpha: 0 }); tl.set(c150, { autoAlpha: 1 }, W('map_b', 'hundred')); tl.set(c150, { autoAlpha: 0 }, T.mapWide);
    X.sfx(W('map_b', 'hundred'), 'pop', { gain: 0.25 });
    const c4 = K.chip(hud, '4 km', 1370, 300, { size: 30 });
    gsap.set(c4, { autoAlpha: 0 }); tl.set(c4, { autoAlpha: 1 }, W('map_b', 'four'));
    X.sfx(W('map_b', 'four'), 'pop', { gain: 0.25 });
    X.sfx(T.mapWide, 'click', { gain: 0.2 });
  }

  // ================================================================== 4 · THE PLAN — flat sky-blue world
  const RA = [462, 530], RB = [1600, 530], SPAN = RB[0] - RA[0], SAGPX = (3 / 150) * SPAN;
  const ropeY = (x) => { const u = K.clamp((x - RA[0]) / SPAN, 0, 1); return RA[1] + SAGPX * 4 * u * (1 - u); };
  /** Flat outline-free robot (pictogram of the real one). Origin = rope contact point. */
  const flatRobot = (p, x, y, s = 1) => {
    const g = S('g', {}, p), body = S('g', {}, g);
    S('rect', { x: -36, y: -24, width: 72, height: 30, rx: 5, fill: '#7E8489' }, body);
    const spokes = [-22, 22].map((wx) => {
      const w = S('g', { transform: `translate(${wx},-13)` }, body);
      S('circle', { r: 13, fill: '#3B3F42' }, w);
      const sp = S('g', {}, w);
      S('rect', { x: -10, y: -2, width: 20, height: 4, fill: '#6B7075' }, sp);
      S('rect', { x: -2, y: -10, width: 4, height: 20, fill: '#6B7075' }, sp);
      S('circle', { r: 4, fill: '#A3A9AD' }, w);
      return sp;
    });
    S('rect', { x: -42, y: 4, width: 84, height: 36, rx: 7, fill: '#D2D6D8' }, body);
    S('rect', { x: -38, y: 12, width: 18, height: 16, rx: 3, fill: '#626669' }, body);
    S('rect', { x: 20, y: 12, width: 18, height: 16, rx: 3, fill: '#626669' }, body);
    S('rect', { x: 40, y: 14, width: 9, height: 14, rx: 2, fill: C.cadYellow }, body);
    S('circle', { cx: 0, cy: 41, r: 7, fill: '#626669' }, body);
    const hang = S('g', {}, g);
    const str = S('line', { x1: 0, y1: 0, x2: 0, y2: 10, stroke: '#3D4144', 'stroke-width': 2 }, hang);
    const box = S('g', {}, hang);
    S('rect', { x: -27, y: 0, width: 54, height: 16, rx: 2, fill: '#C9A26B' }, box);
    S('rect', { x: -27, y: 0, width: 54, height: 5, rx: 2, fill: '#DDBA82' }, box);
    const R = {
      g, box, str, hang, s, x, y, L: 10, sw: 0,
      apply() { g.setAttribute('transform', `translate(${R.x.toFixed(2)},${R.y.toFixed(2)}) scale(${s})`); str.setAttribute('y2', R.L.toFixed(2)); box.setAttribute('transform', `translate(0,${R.L.toFixed(2)})`); hang.setAttribute('transform', `translate(0,41) rotate(${R.sw.toFixed(2)})`); },
      spin(deg) { spokes.forEach((sp) => sp.setAttribute('transform', `rotate(${deg.toFixed(1)})`)); },
    };
    R.apply();
    return R;
  };
  const flatBox = (p, x, y) => { const g = S('g', { transform: `translate(${x},${y})` }, p); S('rect', { x: -27, y: 0, width: 54, height: 16, rx: 2, fill: '#C9A26B' }, g); S('rect', { x: -27, y: 0, width: 54, height: 5, rx: 2, fill: '#DDBA82' }, g); return g; };

  // robot timeline (world x) — accelerate, cruise, brake at the reflector, winch down, zip home
  const tHook = W('plan_b', 'hooks'), tGo = W('plan_b', 'and') + 0.05, tBrake = W('plan_c', 'brakes'), tSpot = W('plan_c', 'spots');
  const tWinch = W('plan_c', 'winch'), tLand = W('plan_c', 'deck') + 0.05, tRel = W('plan_d', 'then') - 0.12, tZip = W('plan_d', 'zips') + 0.02;
  const X0 = RA[0] + 20, XS = 1430, ACC = 1.0, DEC = 0.6;
  const V = (XS - X0) / (0.5 * ACC + (tBrake - tGo - ACC) + 0.5 * DEC);
  const robotX = (t) => {
    if (t < tGo) return X0;
    if (t < tGo + ACC) { const u = t - tGo; return X0 + 0.5 * (V / ACC) * u * u; }
    const xa = X0 + 0.5 * V * ACC;
    if (t < tBrake) return xa + V * (t - tGo - ACC);
    const xb = xa + V * (tBrake - tGo - ACC);
    if (t < tBrake + DEC) { const u = t - tBrake; return xb + V * u - 0.5 * (V / DEC) * u * u; }
    if (t < tZip) return XS;
    return K.lerp(XS, X0, K.prog(t, tZip, 1.35, 'power2.inOut'));
  };
  const L_LAND = 690 - 62 - ropeY(XS);
  const dropL = (t) => {
    if (t < tWinch) return 10;
    if (t < tRel) return K.lerp(10, L_LAND, K.prog(t, tWinch, tLand - tWinch, 'sine.inOut'));
    return K.lerp(L_LAND, 10, K.prog(t, tRel + 0.05, 0.25, 'power1.in'));
  };
  const swing = (t) => {
    if (t < tGo) return 0;
    if (t < tBrake) return -7 * K.prog(t, tGo, 0.8, 'sine.inOut');
    const u = t - tBrake, w = (2 * Math.PI) / 0.95, e = Math.exp(-u / 0.55);
    return -7 * e * Math.cos(w * u) + 20 * e * Math.sin(w * u);
  };

  let planCam = { x: 0, y: 0 };
  {
    const sc = X.scene('plan', T.plan, T.cad);
    footageOff(T.plan); K.cut(T.plan, 'whoosh', 0.22);
    K.skyField(sc);
    K.clouds(sc, { n: 4, seed: 3, speed: -26, yMin: 80, yMax: 260, sMin: 0.45, sMax: 0.65, cam: () => planCam, parallax: 0.25 });
    K.clouds(sc, { n: 4, seed: 4, speed: -48, yMin: 250, yMax: 430, sMin: 0.75, sMax: 1.0, cam: () => planCam, parallax: 0.45 });
    const world = S('g', {}, sc);
    // ground + ravine notch + creek
    S('path', { d: 'M-2000,860 L600,860 L800,1090 L1120,1090 L1320,860 L3920,860 L3920,3000 L-2000,3000Z', fill: C.ground }, world);
    S('path', { d: 'M600,860 L1320,860 L1120,1090 L800,1090Z', fill: C.groundDeep }, world);
    S('path', { d: 'M600,860 L690,860 L850,1090 L800,1090Z', fill: C.groundDk }, world);
    S('path', { d: 'M838,1052 L1082,1052 L1074,1090 L846,1090Z', fill: '#6E9FB4' }, world);
    // my house + deck + anchor mast
    K.flatHouse(world, 40, 860, { w: 290, h: 250 });
    S('rect', { x: 330, y: 700, width: 150, height: 16, fill: C.wood }, world);
    for (const px of [340, 462]) S('rect', { x: px, y: 716, width: 10, height: 144, fill: C.woodDk }, world);
    S('rect', { x: 330, y: 660, width: 150, height: 6, fill: C.woodDk }, world);
    for (let k = 0; k < 5; k++) S('rect', { x: 336 + k * 34, y: 666, width: 5, height: 34, fill: C.woodDk }, world);
    S('rect', { x: 455, y: RA[1] - 12, width: 14, height: 700 - RA[1] + 12, fill: C.woodDk }, world);
    // treehouse
    const tree = K.flatTree(world, 1625, 860, { h: 520, trunk: 54, r: 175, seed: 6 });
    S('rect', { x: 1330, y: 700, width: 470, height: 18, fill: C.wood }, world);
    S('path', { d: 'M1350,718 L1600,820 L1600,800 L1380,718Z', fill: C.woodDk }, world);
    for (const px of [1342, 1786]) S('rect', { x: px, y: 718, width: 10, height: 142, fill: C.woodDk }, world);
    for (const px of [1555, 1585]) S('rect', { x: px, y: 718, width: 7, height: 142, fill: C.woodDk }, world);
    for (let k = 0; k < 5; k++) S('rect', { x: 1555, y: 740 + k * 26, width: 37, height: 5, fill: C.woodDk }, world);
    S('rect', { x: 1665, y: 600, width: 125, height: 100, fill: '#B79A7B' }, world);
    S('polygon', { points: '1650,604 1727,548 1805,604', fill: '#7C6A5C' }, world);
    S('rect', { x: 1700, y: 630, width: 34, height: 34, fill: '#8FB0BE' }, world);
    S('rect', { x: 1385, y: 690, width: 90, height: 10, fill: C.pink }, world);
    S('circle', { cx: 1604, cy: 566, r: 13, fill: '#E9E2DA' }, world);
    S('circle', { cx: 1604, cy: 566, r: 7, fill: C.coral }, world);
    // rope: straight draw-on, then the loaded (V) rope that follows the robot
    const ropeDraw = S('path', { d: `M${RA[0]},${RA[1]} L${RB[0]},${RB[1]}`, stroke: '#3D4144', 'stroke-width': 4, fill: 'none' }, world);
    X.drawOn(ropeDraw, W('plan_a', 'rope'), 0.55, 'power1.inOut');
    X.sfx(W('plan_a', 'rope'), 'swoosh', { gain: 0.25, dur: 0.5 });
    const ropeLive = S('path', { stroke: '#3D4144', 'stroke-width': 4, fill: 'none' }, world);
    const c150 = K.chip(world, '150 m', 1030, 488, { size: 22 });
    gsap.set(c150, { autoAlpha: 0 }); tl.set(c150, { autoAlpha: 1 }, W('plan_a', 'treehouse')); tl.set(c150, { autoAlpha: 0 }, tHook - 0.3);
    X.sfx(W('plan_a', 'treehouse'), 'pop', { gain: 0.22 });
    // sensor beam (translucent coral wedge) on "spots"
    const beam = S('polygon', { fill: C.coral, opacity: 0.38 }, world);
    gsap.set(beam, { autoAlpha: 0 }); tl.set(beam, { autoAlpha: 1 }, tSpot); tl.set(beam, { autoAlpha: 0 }, tBrake + 0.35);
    X.sfx(tSpot, 'blip_up', { gain: 0.3 });
    const padBox = flatBox(world, XS, 690 - 16);
    gsap.set(padBox, { autoAlpha: 0 }); tl.set(padBox, { autoAlpha: 1 }, tRel);
    const streak = K.streaks(world, { n: 4, len: 120, spread: 12, seed: 4 });
    const rob = flatRobot(world, X0, -200, 1);
    X.every((t) => {
      if (t < T.plan || t > T.cad) return;
      const onRope = t >= tHook;
      const rx = robotX(t);
      rob.x = rx;
      rob.y = onRope ? ropeY(rx) : K.lerp(-120, ropeY(rx), K.prog(t, tHook - 0.32, 0.32, 'power2.in'));
      rob.L = dropL(t); rob.sw = t < tWinch ? swing(t) : swing(t) * Math.max(0, 1 - (t - tWinch) / 0.5);
      rob.apply();
      rob.spin(((rx - X0) / 13) * 57.3);
      gsap.set(rob.g, { autoAlpha: t >= tHook - 0.32 ? 1 : 0 });
      rob.box.style.display = t >= tRel ? 'none' : '';
      ropeDraw.style.display = onRope ? 'none' : '';
      ropeLive.style.display = onRope ? '' : 'none';
      if (onRope) ropeLive.setAttribute('d', `M${RA[0]},${RA[1]} L${rx.toFixed(1)},${ropeY(rx).toFixed(1)} L${RB[0]},${RB[1]}`);
      const sx = rx + 49, sy = ropeY(rx) + 21;
      beam.setAttribute('points', `${sx},${sy - 4} 1604,${566 - 20} 1604,${566 + 20} ${sx},${sy + 4}`);
      const moving = (t > tGo + 0.4 && t < tBrake) || (t > tZip + 0.15 && t < tZip + 1.2);
      streak.style.display = moving ? '' : 'none';
      const back = t > tZip;
      streak.setAttribute('transform', `translate(${back ? rx + 46 : rx - 46},${ropeY(rx) + 20}) rotate(${back ? 0 : 180})`);
      // camera: wide → (close-up scene on top) → tracking at 2× → wide
      let s = 1, fx = 960, fy = 540;
      if (t >= T.track && t < T.wide2) { s = 2.0; fx = K.clamp(rx + 90, 480, 1440); fy = 610; }
      world.setAttribute('transform', `translate(960,540) scale(${s}) translate(${-fx},${-fy})`);
      planCam = { x: (fx - 960) * s, y: (fy - 540) * s };
    });
    X.sfx(tHook, 'click', { gain: 0.35 }); X.sfx(tHook + 0.02, 'boing', { gain: 0.22, pitch: 1.3 });
    X.sfx(tGo, 'blip_up', { gain: 0.2, pitch: 0.8 });
    X.sfx(T.track, 'zoom_out', { gain: 0.2, dur: 0.35 });
    X.sfx(tBrake, 'slide', { gain: 0.3, pitch: 0.6, dur: 0.4 });
    for (let k = 0; k < 6; k++) X.sfx(tWinch + k * ((tLand - tWinch) / 6), 'tick', { gain: 0.16, pitch: 1.2 });
    X.sfx(tLand, 'ding', { gain: 0.35 });
    X.sfx(tRel + 0.05, 'blip_down', { gain: 0.2 });
    X.sfx(tZip, 'swoosh', { gain: 0.32, dur: 0.6 });
  }
  // the scale cut: robot close-up while it drives (clouds and rope marks stream past)
  {
    const sc = X.scene('closeup', T.close, T.track);
    K.cut(T.close, 'zoom_in', 0.25);
    K.skyField(sc, { id: 'skyclose' });
    K.clouds(sc, { n: 5, seed: 21, speed: -1100, yMin: 40, yMax: 980, sMin: 0.9, sMax: 1.5, opacity: 0.9 });
    const RY = 330;
    S('line', { x1: -50, y1: RY, x2: 1970, y2: RY, stroke: '#3D4144', 'stroke-width': 12 }, sc);
    const marks = S('line', { x1: -50, y1: RY, x2: 1970, y2: RY, stroke: '#5B6064', 'stroke-width': 12, 'stroke-dasharray': '10 90' }, sc);
    X.every((t) => marks.setAttribute('stroke-dashoffset', ((t * 1100) % 100).toFixed(1)));
    K.streaks(sc, { x: 900 - 250, y: 520, dir: 180, len: 420, n: 6, spread: 40, seed: 9 });
    const rob = flatRobot(sc, 900, RY, 5.5);
    rob.L = 8;
    X.every((t) => {
      if (t < T.close || t > T.track) return;
      rob.y = RY + Math.sin(t * 47) * 1.2; rob.sw = -8 + Math.sin(t * 5.2) * 1.5; rob.apply();
      rob.spin(t * 1100 / 13 * 57.3 / 5.5);
    });
    const c4 = K.chip(sc, '4 m/s', 1480, 210, { size: 34 });
    gsap.set(c4, { autoAlpha: 0 }); tl.set(c4, { autoAlpha: 1 }, W('plan_b', 'four'));
    X.sfx(W('plan_b', 'four'), 'pop', { gain: 0.25 });
  }

  // ================================================================== 5 · CAD — orbit flurry, then the field-of-view volume
  const robotParts = (white) => {
    const body = white ? '#F2F2F2' : '#B9BEC4', plate = white ? '#E2E2E2' : '#9AA0A6', dark = white ? '#4A4D50' : '#55595D';
    return [
      K.box([0, -40, 0], [170, 62, 74], body),
      K.box([0, 12, 42], [150, 74, 8], plate), K.box([0, 12, -42], [150, 74, 8], plate),
      K.cyl([-46, 34, 0], 27, 32, 'z', dark, { cap: white ? '#6A6D70' : '#6A6F74' }),
      K.cyl([46, 34, 0], 27, 32, 'z', dark, { cap: white ? '#6A6D70' : '#6A6F74' }),
      K.cyl([-46, 34, 60], 17, 30, 'z', white ? '#D0D0D0' : '#7A8087', { n: 14 }),
      K.cyl([46, 34, 60], 17, 30, 'z', white ? '#D0D0D0' : '#7A8087', { n: 14 }),
      K.box([97, -40, 0], [26, 32, 44], C.cadYellow),
      K.cyl([0, -84, 0], 15, 54, 'z', white ? '#DADADA' : '#8E949A', { n: 14 }),
      K.box([0, -112, 0], [10, 40, 10], white ? '#CFCFCF' : '#7E848A'),
      K.cyl([0, 65, 0], 4.5, 760, 'x', '#3A3D40', { n: 8 }),
    ];
  };
  {
    const sc = X.scene('cad', T.cad, T.stage);
    K.cut(T.cad, null);
    K.cadUI(sc);
    const model = K.cad3d(sc, robotParts(false), { grid: K.grid3d(-150, 420, 60, '#D3D7DC'), edgeWidth: 1.8 });
    const views = [[-38, 16], [64, 30], [150, 8], [236, 44], [322, -14], [28, 22]];
    const fl = 0.2;
    views.forEach((_, k) => { if (k) X.sfx(T.cad + k * fl, 'click', { gain: 0.22, pitch: 1 + k * 0.05 }); });
    X.every((t) => {
      if (t < T.cad - 0.01 || t > T.stage) return;
      const k = Math.floor((t - T.cad) / fl);
      let yaw, pitch;
      if (k < views.length - 1) [yaw, pitch] = views[Math.max(0, k)];
      else { const u = t - T.cad - fl * (views.length - 1); yaw = 28 + u * 9; pitch = 22 + u * 1.5; }
      model.render(yaw, pitch, 2.5, 1090, 600);
    });
  }
  {
    const sc = X.scene('stage', T.stage, T.phys);
    K.cut(T.stage, 'whoosh', 0.18);
    K.cadStage(sc);
    const parts = robotParts(true);
    const fr = K.frustum([110, -40, 0], 10, 15, 11, C.cadRed, { alpha: 0.4 });
    const refl = K.cyl([690, -40, 0], 36, 6, 'x', '#D24A3C', { n: 20, cap: '#E9E2DA' });
    refl.hidden = true;
    parts.pop();                               // no long rope here: the volume is the subject
    parts.push(refl, fr);
    const model = K.cad3d(sc, parts, { edgeWidth: 1.6, translucentBias: 400 });
    const tGrow = W('cad', 'angled') - 0.05;
    const base = fr.v.map((p) => p.slice());
    const c10 = K.chip(sc, '10 m', 0, 0, { size: 30 });
    gsap.set(c10, { autoAlpha: 0 }); tl.set(c10, { autoAlpha: 1 }, W('cad', 'ten'));
    X.sfx(tGrow, 'zoom_in', { gain: 0.2, dur: 0.4 }); X.sfx(W('cad', 'ten'), 'pop', { gain: 0.25 });
    X.every((t) => {
      if (t < T.stage - 0.01 || t > T.phys) return;
      const len = K.lerp(10, 580, K.prog(t, tGrow, 0.4, 'power2.out'));
      const tx = Math.tan((15 * Math.PI) / 180), ty = Math.tan((11 * Math.PI) / 180);
      for (let i = 4; i < 8; i++) { const sgnz = base[i][2] < 0 ? -1 : 1, sgny = base[i][1] < -40 ? -1 : 1; fr.v[i] = [110 + len, -40 + sgny * ty * len, sgnz * tx * len]; }
      refl.hidden = t < tGrow + 0.3;
      const u = t - T.stage, yaw = 22 + u * 9, pitch = 20 + u * 1.2;
      model.render(yaw, pitch, 1.55, 600, 600);
      const p = model.project([700, 30, 0], yaw, pitch, 1.55, 600, 600);
      c10.setAttribute('transform', `translate(${p[0].toFixed(1)},${(p[1] - 40).toFixed(1)})`);
    });
  }

  // ================================================================== 6 · PHYSICS INSERT — weight vs tension
  {
    const sc = X.scene('phys', T.phys, T.creek);
    K.cut(T.phys, 'whoosh', 0.22);
    K.skyField(sc, { id: 'skyphys' });
    K.clouds(sc, { n: 4, seed: 8, speed: -30, yMin: 70, yMax: 220, sMin: 0.45, sMax: 0.65 });
    K.clouds(sc, { n: 4, seed: 18, speed: -58, yMin: 230, yMax: 470, sMin: 0.75, sMax: 1.0 });
    const A = [150, 600], B = [1770, 600], MID = [960, 600 + (3 / 150) * (B[0] - A[0])];
    // ground, ravine, creek
    S('path', { d: 'M-50,930 L560,930 L760,1090 L1160,1090 L1360,930 L1970,930 L1970,1100 L-50,1100Z', fill: C.ground }, sc);
    S('path', { d: 'M560,930 L1360,930 L1160,1090 L760,1090Z', fill: C.groundDeep }, sc);
    S('path', { d: 'M560,930 L650,930 L810,1090 L760,1090Z', fill: C.groundDk }, sc);
    S('path', { d: 'M790,1062 L1130,1062 L1124,1090 L796,1090Z', fill: '#6E9FB4' }, sc);
    // left: my deck + mast (anchor A)
    const mast = S('g', {}, sc);
    S('rect', { x: -60, y: 470, width: 110, height: 460, fill: '#D8D2C6' }, sc);
    S('polygon', { points: '-80,474 60,474 -80,380', fill: '#7C6A5C' }, sc);
    S('rect', { x: 50, y: 700, width: 150, height: 18, fill: C.wood }, sc);
    for (const px of [64, 182]) S('rect', { x: px, y: 718, width: 10, height: 212, fill: C.woodDk }, sc);
    S('rect', { x: 143, y: 588, width: 14, height: 114, fill: C.woodDk }, mast);
    // right: the tree (anchor B)
    const tree = S('g', {}, sc);
    S('path', { d: 'M1758,930 L1768,420 L1808,420 L1822,930Z', fill: C.bark }, tree);
    const tr = X.rand(12);
    for (let i = 0; i < 8; i++) S('circle', { cx: 1830 + (tr() - 0.4) * 260, cy: 320 + (tr() - 0.5) * 200, r: 90 + tr() * 50, fill: C.leaf }, tree);
    for (let i = 0; i < 5; i++) S('circle', { cx: 1800 + (tr() - 0.4) * 220, cy: 290 + (tr() - 0.5) * 160, r: 60 + tr() * 30, fill: C.leafHi }, tree);
    S('rect', { x: 1815, y: 720, width: 140, height: 18, fill: C.wood }, sc);
    // rope + dashed unloaded line + sag tag
    const ropeP = S('path', { stroke: '#3D4144', 'stroke-width': 5, fill: 'none' }, sc);
    const unl = S('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: '#fff', 'stroke-width': 3, 'stroke-dasharray': '14 12', opacity: 0.7 }, sc);
    const dim = S('g', {}, sc);
    S('line', { x1: 1090, y1: 600, x2: 1090, y2: 627, stroke: '#fff', 'stroke-width': 4 }, dim);
    S('line', { x1: 1078, y1: 600, x2: 1102, y2: 600, stroke: '#fff', 'stroke-width': 4 }, dim);
    S('line', { x1: 1078, y1: 627, x2: 1102, y2: 627, stroke: '#fff', 'stroke-width': 4 }, dim);
    const sagChip = K.chip(sc, '3 m sag', 1190, 560, { size: 26 });
    const kgChip = K.chip(sc, '10 kg', 1110, 720, { size: 26 });
    // forces (behind the robot so they grow out of it)
    const forces = S('g', {}, sc);
    const SC = 812 / 1227;                                              // px per newton: length IS the quantity
    const ang = Math.atan2(A[1] - MID[1], A[0] - MID[0]) * 57.2958;
    const tA = K.forceArrow(forces, { x: MID[0], y: MID[1], angle: ang, shaft: 26, head: 62, headLen: 38 });
    const tB = K.forceArrow(forces, { x: MID[0], y: MID[1], angle: 180 - ang, shaft: 26, head: 62, headLen: 38 });
    let ropeX = MID[0];
    const rob = flatRobot(sc, MID[0], MID[1], 1.5);
    rob.L = 10; rob.apply();
    // the robot rides in and brakes at mid-span (the worst case), then the box keeps a small pendulum sway
    const tIn = T.phys + 0.15, DIN = 2.0, sagAt = (x) => { const u = (x - A[0]) / (B[0] - A[0]); return A[1] + (MID[1] - A[1]) * 4 * u * (1 - u); };
    const pin = K.streaks(sc, { n: 4, len: 160, spread: 16, seed: 14 });
    X.every((t) => {
      if (t < T.phys || t > T.creek) return;
      const x = K.lerp(380, MID[0], K.prog(t, tIn, DIN, 'power2.out')), u = t - tIn - DIN * 0.55;
      rob.x = x; rob.y = sagAt(x);
      rob.sw = u < 0 ? -6 * K.prog(t, tIn, 0.5) : 12 * Math.exp(-u / 0.9) * Math.sin(u * 3.3) + 2.2 * Math.sin((t - T.phys) * 3.3) * (1 - Math.exp(-u / 0.9));
      rob.apply(); rob.spin(((x - 380) / 13) * 57.3);
      pin.style.display = t < tIn + DIN * 0.6 ? '' : 'none';
      pin.setAttribute('transform', `translate(${x - 60},${rob.y + 28}) rotate(180)`);
      ropeX = x;
    });
    const wA = K.forceArrow(sc, { x: MID[0], y: MID[1] + 1.5 * 67 + 6, angle: 90, shaft: 26, head: 62, headLen: 38 });
    const lbW = K.label(sc, 'weight', 960, 880, { size: 50 });
    const lbT = K.label(sc, 'tension', 560, 560, { size: 50 });
    const tW = W('phys_b', 'ninety'), tT = W('phys_c', 'flat') - 0.05, tNum = W('phys_d', 'twelve') - 0.03, tYank = W('phys_d', 'yanked');
    wA.to(tW, 9 / 30, 98.1 * SC, 'power2.out');
    tA.to(tT, 1.7, 1227 * SC, 'power1.in'); tB.to(tT, 1.7, 1227 * SC, 'power1.in');
    const show = (el, t0, t1, fade = 0.2) => { gsap.set(el, { autoAlpha: 0 }); tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: fade, ease: 'none', immediateRender: false }, t0); if (t1) tl.set(el, { autoAlpha: 0 }, t1); };
    show(kgChip, W('phys_b', 'ten'), tW - 0.05, 0.08);
    show(wA.g, tW, tNum, 0.01);
    show(lbW, tW + 0.5, tNum, 0.25);
    show(unl, W('phys_c', 'sags'), tT + 0.3, 0.15); show(dim, W('phys_c', 'sags'), tT + 0.3, 0.15); show(sagChip, W('phys_c', 'sags'), tT + 0.3, 0.08);
    show(forces, tT, tNum, 0.01);
    show(lbT, tT + 1.7 + 0.45, tNum, 0.25);
    X.sfx(T.phys + 0.15, 'swoosh', { gain: 0.25, dur: 0.6 }); X.sfx(T.phys + 1.4, 'slide', { gain: 0.2, pitch: 0.6, dur: 0.35 });
    X.sfx(W('phys_b', 'ten'), 'pop', { gain: 0.22 });
    X.sfx(tW, 'pop', { gain: 0.32, pitch: 0.9 }); X.sfx(tW + 0.5, 'tick', { gain: 0.18 });
    X.sfx(W('phys_c', 'sags'), 'pop', { gain: 0.22, pitch: 1.1 });
    X.sfx(tT, 'riser', { gain: 0.32, dur: 1.75 }); X.sfx(tT + 2.15, 'tick', { gain: 0.18 });
    X.sfx(tYank, 'thud', { gain: 0.45 });
    // the anchors get yanked (rigid lean toward the load), rope follows
    const rot = (p, c, deg) => { const a = (deg * Math.PI) / 180; return [c[0] + (p[0] - c[0]) * Math.cos(a) - (p[1] - c[1]) * Math.sin(a), c[1] + (p[0] - c[0]) * Math.sin(a) + (p[1] - c[1]) * Math.cos(a)]; };
    X.every((t) => {
      if (t < T.phys || t > T.creek) return;
      const y = Math.sin(Math.PI * K.prog(t, tYank, 0.4, 'none')) * 2.4;
      mast.setAttribute('transform', `rotate(${y} 150 700)`); tree.setAttribute('transform', `rotate(${-y} 1790 930)`);
      const a = rot(A, [150, 700], y), b = rot(B, [1790, 930], -y);
      ropeP.setAttribute('d', `M${a[0].toFixed(1)},${a[1].toFixed(1)} L${ropeX.toFixed(1)},${(A[1] + (MID[1] - A[1]) * 4 * ((ropeX - A[0]) / (B[0] - A[0])) * (1 - (ropeX - A[0]) / (B[0] - A[0]))).toFixed(1)} L${b[0].toFixed(1)},${b[1].toFixed(1)}`);
    });
    // the big white number snaps in (no ease) once the narration lands on it
    const big = K.bigNumber(sc, { x: 470, y: 352, value: '1,227', unit: 'newtons', conv: '(276 lbf)', size: 190 });
    gsap.set(big, { autoAlpha: 0 }); tl.set(big, { autoAlpha: 1 }, tNum);
    X.sfx(tNum, 'ding', { gain: 0.45 });
    const f1 = K.figure(sc, { x: 860, y: 548, h: 210 }), f2 = K.figure(sc, { x: 950, y: 548, h: 200, shirt: '#B4B8BB', pants: '#55595D' });
    gsap.set([f1, f2], { autoAlpha: 0 });
    tl.set(f1, { autoAlpha: 1 }, W('phys_d', 'two')); tl.set(f2, { autoAlpha: 1 }, W('phys_d', 'two') + 0.14);
    X.sfx(W('phys_d', 'two'), 'pop', { gain: 0.25 }); X.sfx(W('phys_d', 'two') + 0.14, 'pop', { gain: 0.25, pitch: 1.12 });
    const note = S('text', { x: 1890, y: 1050, 'text-anchor': 'end', 'font-family': 'Inter', 'font-weight': 500, 'font-size': 24, fill: '#fff', opacity: 0.85, text: "(rope's own weight ignored)" }, sc);
    gsap.set(note, { autoAlpha: 0 }); tl.set(note, { autoAlpha: 1 }, tT);
  }

  // ================================================================== 7 · ENDING — failure, success, sign-off
  const P5 = await plate('creek', T.creek, T.win, (g, d) => {
    const bg = S('g', { filter: d.blur(4) }, g);
    S('rect', { x: 0, y: 0, width: 1920, height: 560, fill: d.lin([[0, '#DCE6E8'], [1, '#9DB3B5']]) }, bg);
    S('path', { d: 'M-20,0 L620,0 C560,200 700,380 600,560 L-20,600Z', fill: d.lin([[0, '#7B6A57'], [1, '#4A3F34']], 0, 0, 1, 0) }, bg);
    S('path', { d: 'M1940,0 L1300,0 C1380,220 1240,400 1340,560 L1940,600Z', fill: d.lin([[0, '#3F362E'], [1, '#6C5C4B']], 0, 0, 1, 0) }, bg);
    foliage(bg, 520, 120, 120, 50, ['#2F4A2C', '#46653D', '#5E7F4C']);
    foliage(bg, 1400, 90, 130, 51, ['#2F4A2C', '#46653D', '#5E7F4C']);
    S('rect', { x: -20, y: 520, width: 1960, height: 600, fill: d.lin([[0, '#7FA2A4'], [0.35, '#4F7B80'], [1, '#2B4F55']]) }, g);
    const wr = X.rand(5);
    for (let i = 0; i < 60; i++) { const y = 540 + wr() * 540, k = (y - 520) / 560; S('ellipse', { cx: wr() * 1920, cy: y, rx: 20 + 80 * k * wr(), ry: 1.5 + 4 * k, fill: '#D6ECEE', opacity: 0.18 + wr() * 0.25 }, g); }
    S('path', { d: 'M-20,700 C120,640 300,660 360,760 C420,860 260,980 -20,1000Z', fill: d.lin([[0, '#8E8A82'], [1, '#4E4B46']]) }, g);
    S('path', { d: 'M-20,700 C80,660 200,668 260,700 C180,690 80,700 -20,730Z', fill: '#6E8A4E', opacity: 0.8 }, g);
    S('path', { d: 'M1940,760 C1800,700 1620,730 1580,820 C1540,920 1700,1040 1940,1040Z', fill: d.lin([[0, '#85817A'], [1, '#45423E']]) }, g);
    // snapped rope dangling into the water
    S('path', { d: 'M1110,-20 C1100,200 1130,380 1090,560 l-6,10 l4,-2 l-1,9', fill: 'none', stroke: '#2B2623', 'stroke-width': 4.5 }, g);
    // robot on its back in the shallows, pizza box floating open
    realRobot(g, d, 760, 690, 1.9, { rot: 158, box: false });
    S('ellipse', { cx: 760, cy: 700, rx: 140, ry: 16, fill: '#2B4F55', opacity: 0.55 }, g);
    const bx = S('g', { transform: 'translate(1080,770) rotate(-7)' }, g);
    S('path', { d: 'M-130,-140 L130,-140 L150,-12 L-150,-12Z', fill: d.lin([[0, '#E3C08A'], [1, '#C29A63']]) }, bx);
    S('rect', { x: -150, y: -14, width: 300, height: 44, fill: d.lin([[0, '#D2AE78'], [1, '#9C7546']]) }, bx);
    S('ellipse', { cx: 0, cy: -12, rx: 128, ry: 26, fill: '#E9A33C' }, bx);
    S('ellipse', { cx: 0, cy: -14, rx: 112, ry: 21, fill: '#F2C254' }, bx);
    for (const [px, py] of [[-60, -16], [-10, -8], [40, -18], [70, -6], [-35, -2], [20, -24]]) S('ellipse', { cx: px, cy: py, rx: 14, ry: 5, fill: '#B8352A' }, bx);
    S('ellipse', { cx: 0, cy: 34, rx: 190, ry: 12, fill: '#2B4F55', opacity: 0.5 }, bx);
  }, { seed: 6, amp: 6, push: [1.04, 1.07] });
  {
    const rip = []; for (let i = 0; i < 3; i++) rip.push(S('ellipse', { cx: 1080, cy: 805, rx: 200, ry: 22, fill: 'none', stroke: '#E4F2F3', 'stroke-width': 3 }, P5.live));
    X.every((t) => { if (t < T.creek || t > T.win) return; rip.forEach((e, i) => { const ph = ((t * 0.55 + i / 3) % 1); e.setAttribute('rx', (200 + ph * 260).toFixed(1)); e.setAttribute('ry', (22 + ph * 30).toFixed(1)); e.setAttribute('stroke-opacity', (0.5 * (1 - ph)).toFixed(3)); }); });
    K.tag(P5.over, 'attempt 1');
    K.pointer(P5.over, { x: 1010, y: 640, angle: 32, len: 250, seed: 7 }, W('end_a', 'creek') - 0.04, T.win, 16);
    X.sfx(T.creek + 0.05, 'bubble', { gain: 0.3 });
  }
  const P6 = await plate('win', T.win, T.card, (g, d) => {
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: d.lin([[0, '#7FA6C4'], [0.45, '#F1D9A6'], [0.7, '#F6C77E']]) }, g);
    S('circle', { cx: 380, cy: 520, r: 600, fill: d.rad([[0, '#FFF2C4', 0.95], [0.25, '#FFE09A', 0.6], [1, '#FFE09A', 0]]) }, g);
    S('path', { d: ridge(610, 50, 11), fill: '#B9A58C', filter: d.blur(3) }, g);
    foliage(g, 1620, 120, 300, 70, LEAVES, 1.3, 0.8);
    trunk(g, d, 1660, 1100, 120, 70, 48);
    // rope from top-left to the trunk, robot hanging above the deck, string slack
    rope(g, [[-20, 210], [1000, 382], [1620, 430]], 4.4);
    realRobot(g, d, 1000, 382, 1.9, { box: false });
    // deck planks in low-angle perspective, pink pad, pizza box on it
    for (let i = 0; i < 9; i++) { const y0 = 760 + Math.pow(i / 9, 1.4) * 340, y1 = 760 + Math.pow((i + 1) / 9, 1.4) * 340; S('rect', { x: -20, y: y0, width: 1960, height: y1 - y0 - 3, fill: d.lin([[0, '#C99A62'], [1, '#9C7144']]) }, g); }
    S('rect', { x: -20, y: 720, width: 1960, height: 44, fill: '#7D5A3A' }, g);
    for (let k = 0; k < 12; k++) S('rect', { x: 30 + k * 160, y: 560, width: 16, height: 170, fill: '#6E4F33' }, g);
    S('rect', { x: -20, y: 548, width: 1960, height: 18, fill: '#86613F' }, g);
    S('path', { d: 'M700,880 L1220,880 L1290,960 L630,960Z', fill: d.lin([[0, '#D9B6CF'], [1, '#B78FAC']]) }, g);
    S('path', { d: 'M630,960 L1290,960 L1290,982 L630,982Z', fill: '#9E7792' }, g);
    pizzaBox(g, d, 960, 838, 3.4);
    S('ellipse', { cx: 960, cy: 912, rx: 150, ry: 10, fill: '#000', opacity: 0.18, filter: d.blur(6) }, g);
    S('circle', { cx: 380, cy: 520, r: 130, fill: '#FFF8E0', opacity: 0.85, filter: d.blur(30) }, g);
  }, { seed: 7, amp: 6, push: [1.04, 1.08] });
  {
    const steam = [];
    for (let i = 0; i < 4; i++) steam.push(S('path', { fill: 'none', stroke: '#fff', 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0.4 }, P6.live));
    X.every((t) => {
      if (t < T.win || t > T.card) return;
      steam.forEach((e, i) => {
        const ph = (t * 0.6 + i / 4) % 1, x = 880 + i * 52, y = 820 - ph * 200;
        e.setAttribute('d', `M${x},${y} q${18 * Math.sin(t * 3 + i)},-30 0,-60 q${-18 * Math.sin(t * 3 + i)},-30 0,-60`);
        e.setAttribute('opacity', (0.45 * Math.sin(Math.PI * ph)).toFixed(3));
      });
    });
    K.tag(P6.over, 'attempt 2');
    K.pointer(P6.over, { x: 820, y: 860, angle: 18, len: 250, seed: 11 }, W('end_b', 'pizza') - 0.04, T.card, 16);
    X.sfx(T.win + 0.05, 'success', { gain: 0.28 });
  }
  {
    const sc = X.scene('card', T.card, null);
    footageOff(T.card);
    K.monoCard(sc, '(theo did not share)');
  }
  X.end(T.end);
});
