/* explainer-isotype-narrative kit (IK) — ISOTYPE pictogram cast, flow chains and physical proxies on ONE vignetted
 * field, staged with focus-in entrances, glove hands, slam type, smoke puffs and starbursts. Original pictogram set.
 *
 * Load after /engine/lib/explainer.js (and MotionPathPlugin), call IK.init(X) first thing in X.boot.
 *   Field:   IK.field(p) · IK.iris(p, cx, cy, t, {open, dur, color}) · IK.dark(p, t, {to, dur})
 *   Cast:    IK.man/woman/child/dog/builder(p, {x, y, h, fill}) · IK.family(p, {x, y, h, fill}) → {g, members}
 *   Props:   IK.house · IK.bank · IK.centralBank · IK.coins · IK.card(kind: deposit|loan|apply) · IK.token · IK.stopwatch
 *            IK.bricks · IK.dial · IK.check · IK.sign · IK.tag (money tag with block slots: fill / drain)
 *   Hands:   IK.arm(p, {x, y, angle, s, len, kind: point|fist, t, tOut, hold})  long cream arm + white glove
 *   Type:    IK.text · IK.typeLine · IK.slam (T3) · IK.cloud (T10 body) · IK.chapter (T10) · IK.bubble (T9)
 *   Motion:  IK.focusIn / focusOut (signature DOF entrance) · IK.popIn · IK.dropIn / liftOut (T6) · IK.whipOut (T5)
 *            IK.bar / IK.route (T13 connectors) · IK.travel (object along a chain) · IK.pullBack (T7) · IK.dive (T4)
 *            IK.smoke (T8 / T2 cloud) · IK.burst (T2 starburst) · IK.trail (thought dots)
 * Units: every pictogram is drawn ONCE as a single path (one cream gradient per figure, lighter at the top) in a
 * 100-unit box with its feet at (0,0); holes are counter-wound sub-paths so the field shows through (no strokes).
 */
(function () {
  const IK = (window.IK = {});
  const F = (n) => n / 30;
  IK.F = F;
  const gp = (el, k) => +gsap.getProperty(el, k) || 0;
  const C = (IK.C = {
    fc: '#86bd2f', fm: '#6d9a27', fe: '#4a6820', fk: '#3b511b', // field centre / mid / edge / corner
    cream: '#e6ddb0', tan: '#c9c37e', white: '#fcfcfb', shade: '#dedbcf',
    ink: '#4b7a1e',      // icons + text on white grounds and inside clouds
    inkDeep: '#3d6418',
    tag: '#2d4a12',      // money tags, labels on cream
    boom: '#ffe81a', smoke: '#d8d3b0', smokeHi: '#ebe7cd', black: '#050703',
  });
  const SLAB = "'Archivo Black', 'Arial Black', sans-serif";
  const COND = "'Barlow Condensed', 'Arial Narrow', sans-serif";
  IK.SLAB = SLAB; IK.COND = COND;
  let X;

  // ------------------------------------------------------------------ path primitives (cw = fill, hole = ccw)
  const r2 = (v) => +(+v).toFixed(2);
  const P = (IK.P = {
    rect(x, y, w, h, r = 0, hole = false) {
      r = Math.min(r, w / 2, h / 2);
      if (!r) return hole ? `M${r2(x)},${r2(y)}V${r2(y + h)}H${r2(x + w)}V${r2(y)}Z` : `M${r2(x)},${r2(y)}H${r2(x + w)}V${r2(y + h)}H${r2(x)}Z`;
      const s = hole ? 0 : 1;
      if (hole) return `M${r2(x + r)},${r2(y)}A${r},${r} 0 0 0 ${r2(x)},${r2(y + r)}V${r2(y + h - r)}A${r},${r} 0 0 0 ${r2(x + r)},${r2(y + h)}H${r2(x + w - r)}A${r},${r} 0 0 0 ${r2(x + w)},${r2(y + h - r)}V${r2(y + r)}A${r},${r} 0 0 0 ${r2(x + w - r)},${r2(y)}Z`;
      return `M${r2(x + r)},${r2(y)}H${r2(x + w - r)}A${r},${r} 0 0 ${s} ${r2(x + w)},${r2(y + r)}V${r2(y + h - r)}A${r},${r} 0 0 ${s} ${r2(x + w - r)},${r2(y + h)}H${r2(x + r)}A${r},${r} 0 0 ${s} ${r2(x)},${r2(y + h - r)}V${r2(y + r)}A${r},${r} 0 0 ${s} ${r2(x + r)},${r2(y)}Z`;
    },
    ellipse(cx, cy, rx, ry, hole = false) {
      const s = hole ? 0 : 1;
      return `M${r2(cx - rx)},${r2(cy)}A${rx},${ry} 0 1 ${s} ${r2(cx + rx)},${r2(cy)}A${rx},${ry} 0 1 ${s} ${r2(cx - rx)},${r2(cy)}Z`;
    },
    circle(cx, cy, r, hole = false) { return P.ellipse(cx, cy, r, r, hole); },
    cap(x1, y1, x2, y2, w, hole = false) {
      const L = Math.hypot(x2 - x1, y2 - y1) || 1e-6, ux = (x2 - x1) / L, uy = (y2 - y1) / L, r = w / 2;
      const nx = uy * r, ny = -ux * r;
      const a = [x1 + nx, y1 + ny], b = [x2 + nx, y2 + ny], c = [x2 - nx, y2 - ny], d = [x1 - nx, y1 - ny];
      if (hole) return `M${r2(a[0])},${r2(a[1])}A${r},${r} 0 0 0 ${r2(d[0])},${r2(d[1])}L${r2(c[0])},${r2(c[1])}A${r},${r} 0 0 0 ${r2(b[0])},${r2(b[1])}Z`;
      return `M${r2(a[0])},${r2(a[1])}L${r2(b[0])},${r2(b[1])}A${r},${r} 0 0 1 ${r2(c[0])},${r2(c[1])}L${r2(d[0])},${r2(d[1])}A${r},${r} 0 0 1 ${r2(a[0])},${r2(a[1])}Z`;
    },
    poly(pts, hole = false) { const q = hole ? pts.slice().reverse() : pts; return 'M' + q.map((p) => r2(p[0]) + ',' + r2(p[1])).join('L') + 'Z'; },
    dome(cx, by, rx, ry) { return `M${r2(cx - rx)},${r2(by)}A${rx},${ry} 0 0 1 ${r2(cx + rx)},${r2(by)}Z`; },
  });

  // ------------------------------------------------------------------ init + field
  IK.init = (x) => {
    X = x;
    IK.creamFill = X.linear('ikCream', [[0, '#f1ebca'], [0.5, '#e4daaa'], [1, '#cbc483']]);
    IK.inkFill = X.linear('ikInk', [[0, '#5a8c24'], [1, '#41701a']]);
    IK.gloveFill = X.linear('ikGlove', [[0, '#ffffff'], [1, '#ecebe4']]);
    IK.armFill = X.linear('ikArm', [[0, '#f0e9c6'], [1, '#cfc88c']]);
    IK.tagFill = X.linear('ikTag', [[0, '#365a17'], [1, '#26400f']]);
    IK.puffFill = X.radial('ikPuff', [[0, '#f3efd9'], [0.55, '#e3dec2'], [1, '#c9c3a0']], 0.42, 0.38, 0.62);
    IK.puffFill2 = X.radial('ikPuff2', [[0, '#e9e4c8'], [0.6, '#d6d0b0'], [1, '#bdb792']], 0.4, 0.36, 0.64);
    return IK;
  };

  /** The one field for the whole film: a rasterised radial vignette (dithered, so h264 does not band). */
  IK.field = (p, o = {}) => {
    const W = 1920, H = 1080, sc = 0.5, w = W * sc, h = H * sc;
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d');
    const stops = o.stops || [[0, C.fc], [0.34, '#7cad29'], [0.54, '#628624'], [0.72, '#4a661e'], [0.88, '#3f561b'], [1, '#384c19']];
    // elliptical vignette: draw a circular gradient in a squashed space
    g.save(); g.translate(w * 0.5, h * (o.cy ?? 0.46)); g.scale(1, h / w);
    const rad = (o.r ?? 0.7) * w;
    const gr = g.createRadialGradient(0, 0, 0, 0, 0, rad);
    stops.forEach(([k, col]) => gr.addColorStop(k, col));
    g.fillStyle = gr; g.fillRect(-w, -w * 2, w * 2, w * 4); g.restore();
    const img = g.getImageData(0, 0, w, h), rnd = X.rand(11);
    for (let i = 0; i < img.data.length; i += 4) { const n = (rnd() - 0.5) * 3; img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; }
    g.putImageData(img, 0, 0);
    return X.svg('image', { href: c.toDataURL('image/png'), x: 0, y: 0, width: W, height: H, preserveAspectRatio: 'none' }, p);
  };

  /** T14 inverted ground: a white disc that blooms from (cx,cy) to cover the frame (open) or shrinks to a point. */
  IK.iris = (p, cx, cy, t, o = {}) => {
    const R = Math.hypot(Math.max(cx, 1920 - cx), Math.max(cy, 1080 - cy)) + 20;
    const c = o.el || X.svg('circle', { cx, cy, r: 0, fill: o.color || C.white }, p);
    if (o.el) { gsap.set(c, { attr: { cx, cy } }); }
    const dur = o.dur ?? F(12);
    if (o.open !== false) X.tl.fromTo(c, { attr: { r: 0, cx, cy } }, { attr: { r: R }, duration: dur, ease: o.ease || 'power1.inOut', immediateRender: false }, t);
    else X.tl.fromTo(c, { attr: { r: R, cx, cy } }, { attr: { r: 0 }, duration: dur, ease: o.ease || 'power1.inOut', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.open === false ? 'zoom_out' : 'zoom_in', { gain: 0.3, dur: dur + 0.1 });
    return c;
  };
  /** T15 go dark: a black sheet over the field (and optionally over a content group via `dim`). */
  IK.dark = (p, t, o = {}) => {
    const r = o.el || X.svg('rect', { width: 1920, height: 1080, fill: C.black, opacity: 0 }, p);
    X.tl.fromTo(r, { opacity: o.from ?? 0 }, { opacity: o.to ?? 1, duration: o.dur ?? F(24), ease: 'power1.inOut', immediateRender: false }, t);
    return r;
  };

  // ------------------------------------------------------------------ placement helper
  /** A positioned group (GSAP owns x/y/scale on the outer g) whose content is drawn in 100-unit space × s. */
  IK.put = (p, x, y, s = 1) => {
    const g = X.svg('g', {}, p);
    gsap.set(g, { x, y });
    const inner = X.svg('g', { transform: `scale(${r2(s)})` }, g);
    g.inner = inner;
    return g;
  };
  const fillOf = (o) => (o.fill === 'ink' ? IK.inkFill : o.fill || IK.creamFill);
  const shape = (p, d, o = {}) => X.svg('path', { d, fill: fillOf(o) }, p);
  /** A soft ground-contact shadow under a pictogram (units). */
  const ground = (g, w, o) => { if (o.fill === 'ink' || o.shadow === false) return; X.svg('ellipse', { cx: 0, cy: 1.5, rx: w, ry: 3.2, fill: '#1f300c', opacity: 0.22, style: { filter: 'blur(2px)' } }, g.inner); };

  // ------------------------------------------------------------------ the cast (100 units tall, feet at 0)
  const D = (IK.D = {
    man: () => [P.circle(0, -91.2, 8.3), P.rect(-14, -80, 28, 38, 7), P.rect(-13, -50, 11.4, 50, 5.6), P.rect(1.6, -50, 11.4, 50, 5.6),
      P.rect(-21.6, -79, 5.8, 37.5, 2.9), P.rect(15.8, -79, 5.8, 37.5, 2.9)].join(''),
    woman: () => [P.circle(0, -88.6, 7.7), P.rect(-10.5, -77.5, 21, 25, 6), P.poly([[-10.5, -60], [10.5, -60], [18.5, -30], [-18.5, -30]]),
      P.rect(-9.2, -33, 5.6, 33, 2.8), P.rect(3.6, -33, 5.6, 33, 2.8), P.cap(-14.4, -74, -19.2, -45, 5.2), P.cap(14.4, -74, 19.2, -45, 5.2)].join(''),
    child: () => [P.circle(0, -84, 12.5), P.rect(-13, -68, 26, 33, 8), P.rect(-12, -40, 10.4, 40, 5.2), P.rect(1.6, -40, 10.4, 40, 5.2),
      P.cap(-12.5, -63, -28, -90, 7.6), P.cap(12.5, -63, 28, -90, 7.6)].join(''),
    dog: () => [P.rect(-24, -32, 38, 15, 7.5), P.circle(17.5, -37, 8.8), P.rect(18, -40, 13.5, 8.2, 4), P.cap(14, -43.5, 11, -52, 6),
      P.cap(-21.5, -27, -30, -44, 4.6), P.cap(-19, -22, -20.5, -2.4, 5.2), P.cap(-11, -22, -11, -2.4, 5.2), P.cap(4.8, -22, 4.8, -2.4, 5.2), P.cap(11, -22, 12.5, -2.4, 5.2)].join(''),
    builder: () => [P.circle(0, -88.6, 7.3), P.dome(0, -99.6, 9.4, 8.2), P.rect(-13.5, -100, 27, 2.6, 1.3), P.rect(-14, -80, 28, 38, 7),
      P.rect(-13, -50, 11.4, 50, 5.6), P.rect(1.6, -50, 11.4, 50, 5.6), P.rect(-21.6, -79, 5.8, 37.5, 2.9), P.rect(15.8, -79, 5.8, 37.5, 2.9),
      P.rect(-6, -66, 12, 3.2, 1.6, true)].join(''), // hard hat + a pocket slot
    house: () => [P.poly([[-37, -60], [37, -60], [37, 0], [23, 0], [23, -27], [8, -27], [8, 0], [-37, 0]]), P.poly([[-49, -55], [0, -98], [49, -55]]),
      P.rect(17, -92, 11, 22), ...[[-24, -45], [-13.5, -45], [-24, -34.5], [-13.5, -34.5]].map(([x, y]) => P.rect(x, y, 8.5, 8.5, 0.6, true))].join(''),
    bank: () => {
      const d = [P.poly([[-53, -80], [0, -101], [53, -80]]), P.rect(-53, -80, 106, 10, 1), P.circle(0, -87.5, 3.6, true),
        P.rect(-51, -12, 102, 6, 1), P.rect(-56, -6, 112, 6, 1)];
      for (const cx of [-34, -11.5, 11.5, 34]) d.push(P.rect(cx - 8, -70, 16, 3.6, 1), P.rect(cx - 6, -67.5, 12, 56, 1.5));
      return d.join('');
    },
    centralBank: () => {
      const d = [P.dome(0, -86, 33, 27), P.rect(-35, -87, 70, 12, 1), P.rect(-3.6, -122, 7.2, 10, 1.5), P.circle(0, -124.5, 4.2),
        P.rect(-76, -78, 152, 5, 1.5), P.rect(-72, -74, 144, 9, 1), P.rect(-70, -12, 140, 6, 1), P.rect(-76, -6, 152, 6, 1),
        ...[-18, 0, 18].map((x) => P.rect(x - 2, -84, 4, 7, 1, true))];
      for (const cx of [-55, -33, -11, 11, 33, 55]) d.push(P.rect(cx - 7.5, -65, 15, 3.4, 1), P.rect(cx - 5.6, -62.5, 11.2, 51, 1.5));
      return d.join('');
    },
    coins: () => {
      const d = [];
      [[-26, 6], [0, 9], [26, 4]].forEach(([cx, n]) => { for (let i = 0; i < n; i++) d.push(P.rect(cx - 12, -5.6 * (i + 1), 24, 4.5, 2.2)); });
      return d.join('');
    },
    card: () => [P.rect(-50, -66, 100, 66, 7), P.rect(-40, -56, 34, 8, 4, true), P.rect(-40, -38, 80, 4.6, 2.3, true), P.rect(-40, -27, 80, 4.6, 2.3, true), P.rect(-40, -16, 52, 4.6, 2.3, true)].join(''),
    plain: () => P.rect(-50, -66, 100, 66, 7),
    token: () => [P.circle(0, 0, 30), P.circle(0, 0, 25.5, true), P.circle(0, 0, 22)].join(''),
    stopwatch: () => [P.circle(0, 0, 40), P.circle(0, 0, 32, true), P.rect(-7, -54, 14, 7, 2), P.rect(-3, -48, 6, 9), P.cap(26, -30, 32, -36, 6)].join(''),
    bricks: () => { const d = []; [[0, 3], [1, 3], [2, 3]].forEach(([row]) => { const off = row % 2 ? 13 : 0; for (let i = 0; i < (row % 2 ? 3 : 4); i++) d.push(P.rect(-52 + off + i * 26, -11 - row * 11.5, 24, 10, 1.5)); }); return d.join(''); },
    dial: () => [P.circle(0, -40, 40), P.circle(0, -40, 33, true), P.circle(0, -40, 30)].join(''),
    check: () => [P.circle(0, 0, 30), P.poly([[-14, -2], [-8, -8], [-3, -3], [10, -16], [16, -10], [-3, 9]], true)].join(''),
    sign: () => [P.rect(-3, -70, 6, 70, 2), P.rect(-34, -98, 68, 34, 3)].join(''),
  });

  /** Generic builder: IK.make(kind, parent, {x, y, h|w, fill, shadow}) — size h = px height (people) or w = px width. */
  IK.make = (kind, p, o = {}) => {
    const unitW = { house: 98, bank: 112, centralBank: 152, coins: 76, card: 100, plain: 100, token: 60, stopwatch: 80, bricks: 104, dial: 80, check: 60, sign: 68 }[kind];
    const s = o.s ?? (o.h ? o.h / 100 : o.w ? o.w / (unitW || 100) : 1);
    const g = IK.put(p, o.x ?? 0, o.y ?? 0, s);
    if (['man', 'woman', 'builder'].includes(kind)) ground(g, 18, o);
    else if (kind === 'dog') ground(g, 26, o);
    else if (kind === 'child') ground(g, 15, o);
    else if (['house', 'bank'].includes(kind)) ground(g, 52, o);
    else if (kind === 'centralBank') ground(g, 74, o);
    g.body = shape(g.inner, D[kind](), o);
    g.s = s; g.kind = kind;
    return g;
  };
  for (const k of ['man', 'woman', 'child', 'dog', 'builder', 'house', 'bank', 'centralBank', 'coins', 'token', 'stopwatch', 'bricks', 'check']) IK[k] = (p, o) => IK.make(k, p, o);

  /** Label text in a pictogram's 100-unit space (dark green on cream, or any fill). */
  IK.label = (g, text, o = {}) => X.svg('text', { x: o.x ?? 0, y: o.y ?? 0, 'text-anchor': 'middle', 'font-family': o.font || COND, 'font-weight': o.weight || 700,
    'font-size': o.size || 10, fill: o.fill || C.tag, 'letter-spacing': o.ls ?? '0.04em', text }, g.inner);

  IK.bank = (p, o = {}) => { const g = IK.make('bank', p, o); if (o.label) g.lab = IK.labelBelow(g, o.label, 0, o.labelDy ?? 36, o); return g; };
  IK.centralBank = (p, o = {}) => {
    const g = IK.make('centralBank', p, o);
    if (o.labelBelow) g.lab = IK.labelBelow(g, o.label || 'CENTRAL BANK', 0, o.labelDy ?? 38, o);
    else if (o.label !== false) IK.label(g, o.label || 'CENTRAL BANK', { y: -66.6, size: 7.2, ls: '0.12em', fill: o.fill === 'ink' ? '#ffffff' : C.tag });
    return g;
  };
  /** A cream (or ink) caps label under an object — screen px. */
  IK.labelBelow = (p, text, x, y, o = {}) => X.svg('text', { x, y, 'text-anchor': 'middle', 'font-family': COND, 'font-weight': 700, 'font-size': o.labelSize || 28,
    fill: o.fill === 'ink' ? C.ink : C.cream, 'letter-spacing': '0.08em', text }, p);

  /** Proxy cards: deposit (ledger lines), loan (LOAN), apply (house + LOAN?). w = px width. */
  IK.card = (p, o = {}) => {
    const kind = o.kind || 'deposit';
    const g = IK.make(kind === 'deposit' ? 'card' : 'plain', p, { ...o, w: o.w || 120 });
    const ink = o.fill === 'ink' ? '#ffffff' : C.tag;
    if (kind === 'loan') IK.label(g, o.text || 'LOAN', { y: -22, size: 30, fill: ink, font: SLAB, weight: 400, ls: '0.06em' });
    if (kind === 'apply') {
      shape(g.inner, P.poly([[-43, -36], [-31, -47], [-19, -36]]) + P.rect(-40, -37, 18, 16), { fill: o.fill === 'ink' ? '#ffffff' : C.tag });
      const lt = IK.label(g, o.text || 'LOAN?', { x: -12, y: -21, size: 23, fill: ink, font: COND, weight: 700 }); lt.setAttribute('text-anchor', 'start');
    }
    return g;
  };
  /** Reserve token: a coin with a letter. */
  IK.coin = (p, o = {}) => { const g = IK.make('token', p, { ...o, w: o.w || 64, shadow: false }); IK.label(g, o.text || 'R', { y: 11, size: 31, font: SLAB, weight: 400, ls: 0, fill: o.fill === 'ink' ? '#fff' : C.tag }); return g; };
  /** A paddle sign with caps text. */
  IK.sign = (p, o = {}) => { const g = IK.make('sign', p, o); g.txt = IK.label(g, o.text || 'FOR SALE', { y: -76, size: 13, ls: '0.06em', fill: o.fill === 'ink' ? '#fff' : C.tag }); return g; };
  /** A dial (gauge) with a % mark and a needle you can swing: g.needle. */
  IK.dial = (p, o = {}) => {
    const g = IK.make('dial', p, { ...o, shadow: false });
    const ink = o.fill === 'ink' ? '#ffffff' : C.tag;
    IK.label(g, '%', { y: -24, size: 22, font: SLAB, weight: 400, ls: 0, fill: ink });
    g.needle = X.svg('path', { d: P.cap(0, -40, 0, -64, 5), fill: ink }, g.inner);
    X.svg('circle', { cx: 0, cy: -40, r: 5, fill: ink }, g.inner);
    gsap.set(g.needle, { svgOrigin: '0 -40', rotation: -60 });
    return g;
  };
  IK.stopwatch = (p, o = {}) => {
    const g = IK.make('stopwatch', p, { ...o, shadow: false });
    g.hand = X.svg('path', { d: P.cap(0, 0, 0, -24, 5) + P.circle(0, 0, 4.5), fill: fillOf(o) }, g.inner);
    gsap.set(g.hand, { svgOrigin: '0 0', rotation: 0 });
    return g;
  };

  /** The family group (dog · man · child · woman), feet on y. Returns {g, members}. */
  IK.family = (p, o = {}) => {
    const h = o.h || 300, g = X.svg('g', {}, p);
    gsap.set(g, { x: o.x || 0, y: o.y || 0 });
    const k = h / 100, f = { fill: o.fill, shadow: o.shadow };
    const dog = IK.dog(g, { ...f, x: -118 * k, y: 0, h: h * 0.9 * (o.dogScale || 1) });
    const man = IK.man(g, { ...f, x: -38 * k, y: 0, h });
    const child = IK.child(g, { ...f, x: 8 * k, y: 0, h: h * 0.47 });
    const woman = IK.woman(g, { ...f, x: 52 * k, y: 0, h: h * 0.96 });
    const members = o.noDog ? [man, child, woman] : [dog, man, child, woman];
    if (o.noDog) dog.remove();
    return { g, members, man, woman, child, dog };
  };

  // ------------------------------------------------------------------ money tag (relative quantity = block count)
  /** A dark-green tag that extends from its left end; cream blocks fill in one by one. Screen px. */
  IK.tag = (p, o = {}) => {
    const slots = o.slots || 6, bh = o.h || 40, bw = bh * 0.55, gap = bh * 0.16, pad = bh * 0.3;
    const W = pad * 2 + bh * 0.62 + slots * (bw + gap);
    const g = X.svg('g', {}, p);
    gsap.set(g, { x: o.x || 0, y: o.y || 0 });
    const tin = X.svg('g', {}, g);
    g.inner = tin;
    const body = X.svg('rect', { x: 0, y: -bh / 2, width: W, height: bh, rx: bh * 0.22, fill: IK.tagFill }, tin);
    X.svg('text', { x: pad + bh * 0.28, y: bh * 0.27, 'text-anchor': 'middle', 'font-family': SLAB, 'font-size': bh * 0.72, fill: o.fill === 'ink' ? '#fff' : C.cream, text: '$' }, tin);
    const blocks = [];
    for (let i = 0; i < slots; i++) {
      const b = X.svg('rect', { x: pad + bh * 0.62 + i * (bw + gap), y: -bh * 0.3, width: bw, height: bh * 0.6, rx: bh * 0.08, fill: o.fill === 'ink' ? '#fff' : C.cream }, tin);
      gsap.set(b, { opacity: i < (o.start || 0) ? 1 : 0, transformOrigin: '50% 50%' });
      blocks.push(b);
    }
    g.blocks = blocks; g.W = W; g.n = o.start || 0;
    gsap.set(g, { transformOrigin: '0% 50%' });
    /** extend the tag (T12, 4 f) */
    g.show = (t) => { X.tl.fromTo(g, { scaleX: 0, opacity: 1 }, { scaleX: 1, duration: F(5), ease: 'power2.out', immediateRender: false }, t); gsap.set(g, { scaleX: 0 }); };
    /** add n blocks from t, `step` apart (type-in) */
    g.fill = (t, n, step = F(2), sfx = true) => {
      for (let k = 0; k < n && g.n < slots; k++, g.n++) {
        const b = blocks[g.n];
        X.tl.fromTo(b, { opacity: 0, scale: 1.6 }, { opacity: 1, scale: 1, duration: F(4), ease: 'back.out(2)', immediateRender: false }, t + k * step);
        if (sfx) X.sfx(t + k * step, 'blip', { gain: 0.16, pitch: 1 + g.n * 0.06 });
      }
      return t + n * step;
    };
    /** remove n blocks (last first) */
    g.drain = (t, n, step = F(3), sfx = false) => {
      for (let k = 0; k < n && g.n > 0; k++) {
        g.n--;
        const b = blocks[g.n];
        X.tl.fromTo(b, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.2, duration: F(5), ease: 'power2.in', immediateRender: false }, t + k * step);
        if (sfx) X.sfx(t + k * step, 'blip_down', { gain: 0.15 });
      }
    };
    return g;
  };

  // ------------------------------------------------------------------ glove hands on long arms (T11)
  /** Glove arm: the fingertip (point) / fist centre sits at (x,y); the arm runs off toward `angle` (deg, 0 = arm to the
   * right, i.e. enters from the right edge; 90 = from below; -90 = from above; 180 = from the left).
   * kind 'point' | 'fist'. hold(g) → a group in hand space to draw a held object into (behind the fist).
   * t: slide in (10 f, power3.out with ~5 % overshoot); tOut: slide back out. */
  IK.arm = (p, o = {}) => {
    const s = o.s || 1, len = o.len || 1400, kind = o.kind || 'point';
    const root = X.svg('g', { transform: `translate(${o.x},${o.y}) rotate(${o.angle || 0})` }, p);
    const slide = X.svg('g', {}, root);
    const hand = X.svg('g', { transform: `scale(${s})` }, slide);
    const held = X.svg('g', {}, hand); // objects held go behind the glove
    // arm (cream, separate gradient)
    X.svg('path', { d: P.rect(86, -14, len / s, 30, 14), fill: IK.armFill }, hand);
    const gl = [];
    if (kind === 'point') {
      gl.push(P.cap(5, 0, 40, 0, 17), P.rect(30, -15, 44, 42, 16), P.cap(50, -12, 36, -22, 13), P.rect(70, -22, 24, 54, 8));
    } else {
      gl.push(P.rect(26, -20, 48, 46, 17), P.cap(34, -18, 26, -30, 13), P.rect(70, -24, 24, 56, 8));
    }
    X.svg('path', { d: gl.join(''), fill: IK.gloveFill }, hand);
    const sh = { fill: 'none', stroke: C.shade, 'stroke-width': 2.4, 'stroke-linecap': 'round' };
    if (kind === 'point') {
      X.svg('path', { d: 'M34,8 Q44,12 58,9 M36,17 Q46,21 60,18 M70,-14 V26', ...sh }, hand);
      X.svg('path', { d: 'M48,-6 Q55,-4 62,-6', ...sh, stroke: '#e9e6dc' }, hand);
    } else {
      X.svg('path', { d: 'M30,-6 Q40,-3 50,-6 M30,4 Q40,7 50,4 M30,14 Q40,17 50,14 M70,-16 V24', ...sh }, hand);
    }
    root.slide = slide; root.held = held; root.hand = hand; root.s = s;
    const out = len + 200;
    gsap.set(slide, { x: o.t != null ? out : 0 });
    if (o.t != null) {
      X.tl.fromTo(slide, { x: out }, { x: 0, duration: o.dur ?? F(11), ease: 'back.out(1.15)', immediateRender: false }, o.t);
      if (o.sfx !== false) X.sfx(o.t, 'swoosh', { gain: 0.3, dur: 0.35 });
    }
    if (o.tOut != null) {
      X.tl.fromTo(slide, { x: 0 }, { x: out, duration: o.durOut ?? F(10), ease: 'power3.in', immediateRender: false }, o.tOut);
      if (o.sfx !== false) X.sfx(o.tOut, 'swoosh', { gain: 0.22, dur: 0.3, pitch: 0.85 });
    }
    return root;
  };

  // ------------------------------------------------------------------ type
  IK.text = (p, txt, o = {}) => X.svg('text', { x: o.x ?? 960, y: o.y ?? 540, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || SLAB,
    'font-weight': o.weight || 400, 'font-size': o.size || 120, fill: o.fill || C.cream, 'letter-spacing': o.ls ?? '0.07em', text: txt }, p);

  /** Slab caps typed on letter by letter (≈ 1 letter per frame), emerging from blur. Returns the <text>. */
  IK.typeLine = (p, txt, t, o = {}) => {
    const el = IK.text(p, txt, o);
    if ((o.anchor || 'middle') === 'middle') { // type from a fixed left edge so letters never re-centre while typing
      const w = el.getComputedTextLength();
      el.setAttribute('text-anchor', 'start'); el.setAttribute('x', (o.x ?? 960) - w / 2);
    }
    el.full = txt;
    X.typeOn(el, txt, t, o.cps || 30);
    if (o.focus !== false) X.tl.fromTo(el, { filter: 'blur(8px)', opacity: 0.4 }, { filter: 'blur(0px)', opacity: 1, duration: F(10), ease: 'power2.out', immediateRender: false }, t);
    if (o.sfx !== false) { const n = Math.ceil(txt.length / 3); for (let i = 0; i < n; i++) X.sfx(t + (i * 3) / (o.cps || 30), 'type', { gain: 0.12 }); }
    return el;
  };

  /** T3 slam: each item lands at item.t from camera depth (scale k → 1, expo.in, 4 f, blur). items: {text|el, t, x, y, size, font}. */
  IK.slam = (p, items, o = {}) => items.map((it) => {
    const el = it.el || IK.text(p, it.text, { ...o, ...it });
    gsap.set(el, { opacity: 0, transformOrigin: '50% 60%' });
    const d = it.dur ?? o.dur ?? F(4);
    X.tl.fromTo(el, { opacity: 0, scale: it.from ?? o.from ?? 7, filter: 'blur(10px)' },
      { opacity: 1, scale: 1, filter: 'blur(0px)', duration: d, ease: 'expo.in', immediateRender: false }, it.t - d);
    X.tl.set(el, { filter: 'none' }, it.t + F(1));
    if (o.sfx !== false && it.sfx !== false) X.sfx(it.t, it.sfx || 'thud', { gain: it.gain ?? 0.42, pitch: it.pitch ?? 1 });
    return el;
  });

  /** A white cumulus around caps text (green). Returns g with g.text; (x,y) = text centre. */
  IK.cloud = (p, txt, o = {}) => {
    const g = X.svg('g', {}, p);
    gsap.set(g, { x: o.x || 0, y: o.y || 0 });
    const size = o.size || 40;
    const inner = X.svg('g', {}, g);
    g.inner = inner;
    const tx = X.svg('text', { x: 0, y: size * 0.35, 'text-anchor': 'middle', 'font-family': o.font || COND, 'font-weight': 700, 'font-size': size,
      fill: o.color || C.ink, 'letter-spacing': '0.04em', text: txt }, inner);
    const w = Math.max(tx.getComputedTextLength(), size * 1.2) + size * 1.1, h = size * 1.55;
    const body = X.svg('g', {}, inner);
    inner.insertBefore(body, tx);
    const rnd = X.rand(o.seed || 5), d = [P.rect(-w / 2, -h / 2, w, h, h / 2)];
    const n = Math.max(3, Math.round(w / (size * 1.05)));
    for (let i = 0; i < n; i++) {
      const fx = -w / 2 + (w * (i + 0.5)) / n;
      d.push(P.circle(fx, -h / 2 + h * 0.1, h * (0.34 + rnd() * 0.16)));
      d.push(P.circle(fx + (rnd() - 0.5) * 10, h / 2 - h * 0.12, h * (0.26 + rnd() * 0.12)));
    }
    d.push(P.circle(-w / 2 + 4, 0, h * 0.42), P.circle(w / 2 - 4, 0, h * 0.42));
    X.svg('path', { d: d.join(''), fill: o.fill || C.white }, body);
    g.text = tx; g.w = w; g.h = h;
    return g;
  };

  /** Thought-trail dots from (x1,y1) toward (x2,y2): n dots of growing size popping in sequence. */
  IK.trail = (p, x1, y1, x2, y2, t, o = {}) => {
    const n = o.n || 5, dots = [];
    for (let i = 0; i < n; i++) {
      const k = (i + 1) / (n + 1), r = (o.r0 || 4) + ((o.r1 || 12) - (o.r0 || 4)) * k;
      const c = X.svg('circle', { cx: x1 + (x2 - x1) * k, cy: y1 + (y2 - y1) * k - Math.sin(k * Math.PI) * (o.arc || 0), r, fill: o.fill || C.white }, p);
      gsap.set(c, { scale: 0, transformOrigin: '50% 50%' });
      X.tl.fromTo(c, { scale: 0 }, { scale: 1, duration: F(5), ease: 'back.out(2.5)', immediateRender: false }, t + i * (o.step || F(1.6)));
      dots.push(c);
    }
    if (o.sfx !== false) X.sfx(t, 'bubble', { gain: 0.22 });
    return dots;
  };

  /** T10 chapter cloud: tiny narrator figure top-right, dots rise as a thought trail, a white cloud settles top-left
   * with the chapter title and stays until tOut. Returns {g, cloud}. */
  IK.chapter = (p, txt, t, o = {}) => {
    const g = X.svg('g', {}, p);
    const fig = IK.man(g, { x: o.figX ?? 1800, y: o.figY ?? 168, h: 66, shadow: false });
    IK.focusIn(fig, t, { blur: 6, sfx: false });
    const cl = IK.cloud(g, txt, { x: o.x ?? 330, y: o.y ?? 92, size: o.size ?? 40, seed: 9 });
    const cx = (o.x ?? 330) + cl.w / 2 + 40;
    const dots = IK.trail(g, (o.figX ?? 1800) - 10, (o.figY ?? 168) - 80, cx, (o.y ?? 92) + 10, t + F(4), { n: 6, r0: 5, r1: 15, step: F(1.5), arc: 30 });
    gsap.set(cl, { scale: 0, transformOrigin: '50% 50%' });
    X.tl.fromTo(cl, { scale: 0.2, opacity: 0 }, { scale: 1, opacity: 1, duration: F(12), ease: 'back.out(1.6)', immediateRender: false }, t + F(12));
    X.sfx(t + F(12), 'pop', { gain: 0.3, pitch: 0.8 });
    if (o.tOut != null) X.tl.fromTo(g, { y: 0, opacity: 1 }, { y: -260, opacity: 0, duration: F(8), ease: 'power3.in', immediateRender: false }, o.tOut);
    return { g, cloud: cl, fig, dots };
  };

  /** T9 speech bubble: a white rounded rect grows from its tail point; condensed caps type on. tail at (x,y). */
  IK.bubble = (p, txt, t, o = {}) => {
    const g = X.svg('g', {}, p);
    const size = o.size || 38;
    const meas = X.svg('text', { 'font-family': COND, 'font-weight': 700, 'font-size': size, text: txt }, g);
    const tw = meas.getComputedTextLength(); meas.remove();
    const w = tw + size * 1.0, h = size * 1.6, side = o.side || 'left'; // bubble sits to the left of the tail
    const bx = side === 'left' ? o.x - w + 30 : o.x - 30, by = o.y - h - 26;
    X.svg('path', { d: P.rect(bx, by, w, h, 12) + P.poly(side === 'left' ? [[o.x - 52, by + h - 2], [o.x - 14, by + h - 2], [o.x, o.y]] : [[o.x + 14, by + h - 2], [o.x + 52, by + h - 2], [o.x, o.y]]), fill: C.white }, g);
    const tx = X.svg('text', { x: bx + size * 0.5, y: by + h / 2 + size * 0.35, 'font-family': COND, 'font-weight': 700, 'font-size': size, fill: C.ink, 'letter-spacing': '0.03em' }, g);
    gsap.set(g, { scaleX: 0, svgOrigin: `${o.x} ${o.y}` });
    X.tl.fromTo(g, { scaleX: 0, scaleY: 0.6 }, { scaleX: 1, scaleY: 1, duration: F(6), ease: 'power2.out', immediateRender: false }, t);
    X.typeOn(tx, txt, t + F(6), o.cps || 28);
    X.sfx(t, 'pop', { gain: 0.25 });
    for (let i = 0; i < txt.length; i += 3) X.sfx(t + F(6) + i / (o.cps || 28), 'type', { gain: 0.1 });
    g.text = tx;
    return g;
  };

  // ------------------------------------------------------------------ motion
  /** The signature entrance: out of focus → sharp over ~9 f, slight scale settle. */
  IK.focusIn = (el, t, o = {}) => {
    gsap.set(el, { opacity: 0, transformOrigin: o.origin || '50% 100%' });
    X.tl.fromTo(el, { opacity: 0, filter: `blur(${o.blur ?? 12}px)`, scale: o.scale ?? 0.94 },
      { opacity: 1, filter: 'blur(0px)', scale: 1, duration: o.dur ?? F(9), ease: 'power2.out', immediateRender: false }, t);
    X.tl.set(el, { filter: 'none' }, t + (o.dur ?? F(9)) + F(1));
    if (o.sfx) X.sfx(t, o.sfx, { gain: o.gain ?? 0.2 });
    return el;
  };
  IK.focusOut = (el, t, o = {}) => {
    X.tl.fromTo(el, { opacity: 1, filter: 'blur(0px)' }, { opacity: 0, filter: `blur(${o.blur ?? 10}px)`, duration: o.dur ?? F(8), ease: 'power2.in', immediateRender: false }, t);
    return el;
  };
  /** Pop with overshoot (back.out ≈ 10 %) + a short focus pull. */
  IK.popIn = (el, t, o = {}) => {
    gsap.set(el, { scale: 0, transformOrigin: o.origin || '50% 100%' });
    X.tl.fromTo(el, { scale: 0, filter: 'blur(6px)' }, { scale: o.scale ?? 1, filter: 'blur(0px)', duration: o.dur ?? F(8), ease: o.ease || 'back.out(1.8)', immediateRender: false }, t);
    X.tl.set(el, { filter: 'none' }, t + (o.dur ?? F(8)) + F(1));
    if (o.sfx !== false) X.sfx(t, o.sfx || 'pop', { gain: o.gain ?? 0.24, pitch: o.pitch ?? 1 });
    return el;
  };
  /** T6 vertical drop-in from above with vertical blur. */
  IK.dropIn = (el, t, o = {}) => {
    const y0 = gp(el, 'y');
    gsap.set(el, { opacity: 0 });
    X.tl.fromTo(el, { opacity: 0, y: y0 - (o.dy ?? 300), filter: 'blur(8px)' }, { opacity: 1, y: y0, filter: 'blur(0px)', duration: o.dur ?? F(6), ease: 'power3.out', immediateRender: false }, t);
    X.tl.set(el, { filter: 'none' }, t + (o.dur ?? F(6)) + F(1));
    if (o.sfx) X.sfx(t, o.sfx, { gain: o.gain ?? 0.25 });
    return el;
  };
  /** T6 content leaves upward in 2–3 f. */
  IK.liftOut = (el, t, o = {}) => {
    const y0 = gp(el, 'y');
    X.tl.fromTo(el, { y: y0, opacity: 1 }, { y: y0 - (o.dy ?? 700), opacity: 0, duration: o.dur ?? F(3), ease: 'power3.in', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, 'whoosh', { gain: 0.3, dur: 0.3 });
  };
  /** Directional motion-blur filter (horizontal or vertical) whose strength is tweened. */
  let mbN = 0;
  IK.mblur = (axis = 'x') => {
    const id = 'ikmb' + mbN++;
    const f = X.svg('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' }, X.defs);
    const b = X.svg('feGaussianBlur', { stdDeviation: '0 0' }, f);
    return { url: `url(#${id})`, b, axis };
  };
  /** T5 whip-pan out: the group slides one frame width in 4 f with horizontal motion blur. */
  IK.whipOut = (el, t, o = {}) => {
    const mb = IK.mblur('x');
    const dx = o.dx ?? -1920, d = o.dur ?? F(4);
    X.tl.set(el, { attr: { filter: mb.url } }, t);
    const x0 = gp(el, 'x');
    X.tl.fromTo(el, { x: x0 }, { x: x0 + dx, duration: d, ease: 'power3.in', immediateRender: false }, t);
    const st = { v: 0 };
    X.tl.fromTo(st, { v: 0 }, { v: 60, duration: d, ease: 'power2.in', immediateRender: false, onUpdate: () => mb.b.setAttribute('stdDeviation', `${st.v.toFixed(1)} 0`) }, t);
    if (o.sfx !== false) X.sfx(t - F(1), 'whoosh', { gain: 0.42, dur: 0.4 });
    return t + d;
  };
  /** T5 whip-pan in: content arrives from the opposite side (last frames of the pan), then sharpens. */
  IK.whipIn = (el, t, o = {}) => {
    const mb = IK.mblur('x'), d = o.dur ?? F(5), dx = o.dx ?? 900;
    gsap.set(el, { opacity: 0 });
    X.tl.set(el, { attr: { filter: mb.url } }, t);
    const x0 = gp(el, 'x');
    X.tl.fromTo(el, { x: x0 + dx, opacity: 1 }, { x: x0, opacity: 1, duration: d, ease: 'power3.out', immediateRender: false }, t);
    const st = { v: 40 };
    X.tl.fromTo(st, { v: 40 }, { v: 0, duration: d + F(3), ease: 'power2.out', immediateRender: false, onUpdate: () => mb.b.setAttribute('stdDeviation', `${st.v.toFixed(1)} 0`) }, t);
    X.tl.set(el, { attr: { filter: 'none' } }, t + d + F(4));
    return t + d;
  };

  /** T13 connector bar: a thick rounded bar grows from (x1,y1) to (x2,y2); arrowhead pops at the end. */
  IK.bar = (p, x1, y1, x2, y2, t, o = {}) => {
    const w = o.w || 12, col = o.color || C.cream;
    const g = X.svg('g', {}, p);
    const ang = Math.atan2(y2 - y1, x2 - x1), ah = o.arrow === false ? 0 : w * 1.6;
    const ex = x2 - Math.cos(ang) * ah * 0.8, ey = y2 - Math.sin(ang) * ah * 0.8;
    const ln = X.svg('line', { x1, y1, x2: x1, y2: y1, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, g);
    gsap.set(ln, { opacity: 0 });
    X.tl.fromTo(ln, { opacity: 1, attr: { x2: x1, y2: y1 } }, { opacity: 1, attr: { x2: ex, y2: ey }, duration: o.dur ?? F(8), ease: 'power2.inOut', immediateRender: false }, t);
    if (ah) {
      const hd = X.svg('path', { d: `M0,${-ah} L${ah * 1.25},0 L0,${ah} Z`, fill: col, 'stroke-linejoin': 'round', stroke: col, 'stroke-width': w * 0.35 }, g);
      gsap.set(hd, { x: x2 - Math.cos(ang) * ah * 1.1, y: y2 - Math.sin(ang) * ah * 1.1, rotation: (ang * 180) / Math.PI, scale: 0, svgOrigin: '0 0' });
      X.tl.fromTo(hd, { scale: 0 }, { scale: 1, duration: F(5), ease: 'back.out(2.5)', immediateRender: false }, t + (o.dur ?? F(8)) - F(2));
    }
    if (o.sfx !== false) X.sfx(t, 'slide', { gain: 0.16, dur: 0.25 });
    return g;
  };
  /** T13 polyline route (L-shapes, loops): drawn on with X.drawOn; optional arrowhead at the end. pts [[x,y],...]. */
  IK.route = (p, pts, t, o = {}) => {
    const w = o.w || 12, col = o.color || C.cream;
    const g = X.svg('g', {}, p);
    const d = o.d || ('M' + pts.map((q) => q.join(',')).join(' L'));
    const path = X.svg('path', { d, fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    X.drawOn(path, t, o.dur ?? F(10), o.ease || 'power2.inOut');
    if (o.arrow) {
      const L = path.getTotalLength(), e = path.getPointAtLength(L), q = path.getPointAtLength(Math.max(0, L - 4)), ang = Math.atan2(e.y - q.y, e.x - q.x), ah = w * 1.6;
      const hd = X.svg('path', { d: `M0,${-ah} L${ah * 1.25},0 L0,${ah} Z`, fill: col, stroke: col, 'stroke-width': w * 0.35, 'stroke-linejoin': 'round' }, g);
      gsap.set(hd, { x: e.x, y: e.y, rotation: (ang * 180) / Math.PI, scale: 0, svgOrigin: '0 0' });
      X.tl.fromTo(hd, { scale: 0 }, { scale: 1, duration: F(5), ease: 'back.out(2.5)', immediateRender: false }, t + (o.dur ?? F(10)) - F(2));
    }
    if (o.sfx !== false) X.sfx(t, 'slide', { gain: 0.16, dur: 0.3 });
    g.path = path;
    return g;
  };
  /** Move an object (positioned via gsap x/y) along points (MotionPathPlugin), power2.inOut, with a small hop. */
  IK.travel = (el, pts, t, dur = F(16), o = {}) => {
    X.tl.to(el, { motionPath: { path: pts.map(([x, y]) => ({ x, y })), curviness: o.curviness ?? 0 }, duration: dur, ease: o.ease || 'power2.inOut' }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'swoosh', { gain: o.gain ?? 0.2, dur: Math.min(0.5, dur) });
  };
  /** T7 pull-back (or push-in) of a camera group made with X.cam: scale + optional pan, power2.inOut, 15 f. */
  IK.pullBack = (cam, t, o = {}) => {
    X.tl.to(cam, { scale: o.scale ?? 0.55, x: o.x ?? 0, y: o.y ?? 0, duration: o.dur ?? F(15), ease: 'power2.inOut' }, t);
    if (o.sfx !== false) X.sfx(t, (o.scale ?? 0.55) < 1 ? 'zoom_out' : 'zoom_in', { gain: 0.22, dur: (o.dur ?? F(15)) + 0.1 });
  };
  /** T4 dive: scale a group about (px,py) by `scale` while that point travels to frame centre (expo.in), with blur. */
  IK.dive = (g, px, py, t, o = {}) => {
    const S = o.scale ?? 40, d = o.dur ?? F(10), st = { k: 0 };
    const set = () => {
      const k = st.k, s = Math.exp(Math.log(S) * k), cx = px + (960 - px) * Math.min(1, k * 1.4), cy = py + (540 - py) * Math.min(1, k * 1.4);
      g.setAttribute('transform', `translate(${(cx - s * px).toFixed(2)},${(cy - s * py).toFixed(2)}) scale(${s.toFixed(4)})`);
      g.style.filter = k > 0.02 && k < 1 ? `blur(${(k * 6).toFixed(1)}px)` : 'none';
    };
    X.tl.fromTo(st, { k: 0 }, { k: 1, duration: d, ease: 'expo.in', immediateRender: false, onUpdate: set, onReverseComplete: set }, t);
    if (o.sfx !== false) X.sfx(t, 'zoom_in', { gain: 0.35, dur: d + 0.15 });
    return t + d;
  };

  /** Smoke: overlapping cream-grey circles bloom from (cx,cy) (sine.out), hold, then thin out (scale 1.3, fade).
   * Returns {g, tFull}. T8 magic: do the swap at tFull while the cloud hides it. */
  IK.smoke = (p, cx, cy, t, o = {}) => {
    const g = X.svg('g', {}, p), rnd = X.rand(o.seed || 3), n = o.n || 26;
    const grow = o.grow ?? F(15), hold = o.hold ?? F(4), clear = o.clear ?? F(20);
    const sx = o.sx ?? o.spread ?? 420, sy = o.sy ?? (o.spread ? o.spread * 0.6 : 260);
    g.style.filter = `blur(${o.blur ?? 5}px)`;
    const puffs = [];
    for (let i = 0; i < n; i++) {
      const a = rnd() * Math.PI * 2, rr = Math.sqrt(rnd());
      const x = cx + Math.cos(a) * sx * rr, y = cy + Math.sin(a) * sy * rr;
      const r = (o.rMin ?? 70) + rnd() * ((o.rMax ?? 170) - (o.rMin ?? 70));
      const c = X.svg('circle', { cx: x, cy: y, r, fill: rnd() < 0.55 ? (o.hi || IK.puffFill) : (o.color || IK.puffFill2), opacity: 0.97 }, g);
      gsap.set(c, { scale: 0, transformOrigin: '50% 50%' });
      const t0 = t + (i / n) * grow * 0.6;
      X.tl.fromTo(c, { scale: 0 }, { scale: 1, duration: grow * 0.7, ease: 'sine.out', immediateRender: false }, t0);
      X.tl.fromTo(c, { opacity: 0.96 }, { opacity: 0, scale: 1.3, x: (x - cx) * 0.15, y: (y - cy) * 0.15 - 20, duration: clear, ease: 'sine.in', immediateRender: false }, t + grow + hold + rnd() * F(6));
      puffs.push(c);
    }
    if (o.sfx !== false) X.sfx(t, 'woosh_low', { gain: 0.35, dur: 0.6 });
    return { g, puffs, tFull: t + grow * 0.85, tClear: t + grow + hold };
  };

  /** T2 starburst: jagged yellow stars with a white core pop ×4 in 8 f (power3.out; expo.out reads as a hard cut), then bloom out. */
  IK.burst = (p, cx, cy, t, o = {}) => {
    const g = X.svg('g', {}, p), rnd = X.rand(o.seed || 21);
    const mk = (R, r, n, fill) => {
      const pts = [];
      for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2 + rnd() * 0.08; const rr = i % 2 ? r * (0.85 + rnd() * 0.3) : R * (0.8 + rnd() * 0.4); pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); }
      return X.svg('path', { d: P.poly(pts), fill }, g);
    };
    (o.offsets || [[0, 0, 1]]).forEach(([dx, dy, k], i) => {
      const s = X.svg('g', {}, g);
      gsap.set(s, { x: cx + dx, y: cy + dy, scale: 0 });
      const R = (o.R || 160) * k;
      s.appendChild(mk(R, R * 0.6, 13, C.boom));
      s.appendChild(mk(R * 0.55, R * 0.36, 11, '#fff7a8'));
      const core = X.svg('circle', { r: R * 0.32, fill: '#ffffff', style: { filter: `blur(${R * 0.08}px)` } }, s);
      const t0 = t + i * F(2);
      X.tl.fromTo(s, { scale: 0.05, rotation: 0 }, { scale: o.scale ?? 4, rotation: 12, duration: o.dur ?? F(8), ease: 'power3.out', immediateRender: false }, t0);
      X.tl.fromTo(s, { opacity: 1 }, { opacity: 0, duration: o.fade ?? F(14), ease: 'power1.in', immediateRender: false }, t0 + (o.hold ?? F(8)));
    });
    if (o.sfx !== false) { X.sfx(t, 'impact', { gain: 0.55, dur: 1.0 }); X.sfx(t, 'thud', { gain: 0.4 }); }
    return g;
  };

  /** Camera creep: a slow linear push on a whole set (≈0.5–0.7 %/s) about (cx,cy). The style holds still between
   * builds, but a clean render holds harder than the soft 2009 master; this keeps long diagram holds alive without
   * reading as a move. Put it on the X.scene group (nothing else transforms it). */
  IK.creep = (g, t0, t1, o = {}) => {
    const r = o.rate ?? 0.006;
    X.tl.fromTo(g, { scale: 1 }, { scale: 1 + r * (t1 - t0), duration: t1 - t0, ease: 'none', svgOrigin: `${o.cx ?? 960} ${o.cy ?? 540}`, immediateRender: false }, t0);
  };
  /** Idle life (C1): floating props hover — a slow sine drift on an element whose transform attribute GSAP never
   * touches (pass a pictogram/cloud/tag group: its .inner is used). amp in px (5–8 reads at 1080p), hz 0.3–0.7.
   * axis 'y' (hover) or 'x' (a glove's pointing jab). Eased in/out over the window so it never pops. */
  IK.hover = (el, t0, t1, o = {}) => {
    const tgt = el.inner || el, base = tgt.getAttribute('transform') || '';
    const amp = o.amp ?? 6, hz = o.hz ?? 0.45, ph = o.phase ?? 0, ax = o.axis || 'y';
    X.every((t) => {
      if (t < t0 - 0.05 || t > t1 + 0.05) { if (tgt._hv) { tgt.setAttribute('transform', base); tgt._hv = 0; } return; }
      const env = Math.max(0, Math.min(1, (t - t0) / 0.6, (t1 - t) / 0.6));
      const v = Math.sin((t - t0) * hz * Math.PI * 2 + ph) * amp * env;
      tgt.setAttribute('transform', `translate(${ax === 'x' ? v.toFixed(2) : 0},${ax === 'y' ? v.toFixed(2) : 0}) ${base}`);
      tgt._hv = 1;
    });
  };

  // ------------------------------------------------------------------ the heraldic crest (T1), original emblem
  /** Builds the opening/closing crest centred on (cx,cy): rays, crossed keys, medallion with line 1, ribbon with line 2,
   * a bank pediment, houses + coin stacks, laurel leaves, small stars. Returns {g, parts}. t0 = first pop. */
  IK.crest = (p, t0, o = {}) => {
    const cx = o.cx ?? 960, cy = o.cy ?? 520, k = o.scale ?? 1, tl = X.tl;
    const g = X.svg('g', {}, p);
    gsap.set(g, { x: cx, y: cy, scale: k, svgOrigin: '0 0' });
    const rnd = X.rand(o.seed || 4);
    // rays
    const rays = X.svg('g', {}, g);
    const rd = []; for (let i = 0; i < 24; i++) { const a = (i / 24) * Math.PI * 2, a2 = a + 0.07; rd.push(P.poly([[0, 0], [Math.cos(a) * 470, Math.sin(a) * 470], [Math.cos(a2) * 470, Math.sin(a2) * 470]])); }
    X.svg('path', { d: rd.join(''), fill: C.cream, opacity: 0.16 }, rays);
    gsap.set(rays, { scale: 0, svgOrigin: '0 0' });
    tl.fromTo(rays, { scale: 0, rotation: -20 }, { scale: 1, rotation: 0, duration: F(16), ease: 'power2.out', immediateRender: false }, t0 + F(6));
    X.every((t) => { if (t > t0 + F(22)) rays.setAttribute('transform', `rotate(${((t - t0) * 4).toFixed(2)})`); });
    // crossed keys behind the medallion
    const keyD = () => [P.cap(0, 215, 0, -236, 15), P.circle(0, -262, 32), P.circle(0, -262, 17, true), P.rect(-3, 178, 36, 15, 3), P.rect(14, 150, 24, 13, 3), P.rect(-15, -205, 30, 9, 4)].join('');
    const keys = [];
    [-38, 38].forEach((ang, i) => {
      const kg = X.svg('g', {}, g);
      X.svg('path', { d: keyD(), fill: IK.creamFill }, kg);
      gsap.set(kg, { svgOrigin: '0 0', rotation: 0, y: 10, scale: 1, opacity: 0 });
      tl.fromTo(kg, { rotation: 0, opacity: 0 }, { rotation: ang, opacity: 1, duration: F(9), ease: 'power2.out', immediateRender: false }, t0 + F(8) + i * F(2));
      keys.push(kg);
    });
    X.sfx(t0 + F(8), 'swoosh', { gain: 0.3 });
    // pediment above
    const ped = IK.put(g, 0, -150, 2.3);
    shape(ped.inner, P.poly([[-60, -2], [0, -34], [60, -2]]) + P.rect(-62, -2, 124, 8, 1) + P.circle(0, -14, 5, true));
    gsap.set(ped, { opacity: 0 });
    tl.fromTo(ped, { y: -60, opacity: 0 }, { y: -150, opacity: 1, duration: F(10), ease: 'back.out(1.6)', immediateRender: false }, t0 + F(14));
    // houses + coins on flanks
    const flank = [];
    [[-318, 70, 'house', 132], [318, 70, 'house', 132], [-232, 165, 'coins', 104], [232, 165, 'coins', 104]].forEach(([x, y, kind, w], i) => {
      const it = IK.make(kind, g, { x, y, w, shadow: false });
      IK.popIn(it, t0 + F(16) + i * F(3), { sfx: i % 2 ? false : 'pop' });
      flank.push(it);
    });
    // laurels: leaves along two arcs under the medallion
    const leaves = X.svg('g', {}, g);
    for (let side of [-1, 1]) for (let i = 0; i < 9; i++) {
      const a = Math.PI / 2 + side * (0.25 + i * 0.16), R = 205;
      const x = Math.cos(a) * R, y = Math.sin(a) * R * 0.92 - 10;
      const lf = X.svg('path', { d: P.ellipse(0, 0, 26, 10), fill: IK.creamFill }, leaves);
      gsap.set(lf, { x, y, rotation: (a * 180) / Math.PI + side * 60, scale: 0, svgOrigin: '0 0' });
      tl.fromTo(lf, { scale: 0 }, { scale: 1, duration: F(6), ease: 'back.out(2)', immediateRender: false }, t0 + F(22) + i * F(1.2));
    }
    // medallion
    const med = X.svg('g', {}, g);
    X.svg('path', { d: P.circle(0, 0, 136) + P.circle(0, 0, 124, true) + P.circle(0, 0, 118), fill: IK.creamFill }, med);
    const notches = []; for (let i = 0; i < 48; i++) { const a = (i / 48) * Math.PI * 2; notches.push(P.circle(Math.cos(a) * 130, Math.sin(a) * 130, 2.2, true)); }
    X.svg('path', { d: notches.join(''), fill: C.fm, opacity: 0.55 }, med);
    if (o.l0) X.svg('text', { x: 0, y: -52, 'text-anchor': 'middle', 'font-family': SLAB, 'font-size': o.size0 || 24, fill: C.tag, 'letter-spacing': '0.3em', text: o.l0 }, med);
    const l1 = X.svg('text', { x: 0, y: -2, 'text-anchor': 'middle', 'font-family': SLAB, 'font-size': o.size1 || 40, fill: C.tag, 'letter-spacing': '0.04em', text: o.l1 || 'MAKING' }, med);
    X.svg('path', { d: P.rect(-70, 18, 140, 5, 2.5), fill: C.tag }, med);
    X.svg('text', { x: 0, y: 66, 'text-anchor': 'middle', 'font-family': SLAB, 'font-size': 30, fill: C.tag, text: o.mark || '$' }, med);
    gsap.set(med, { scale: 0, svgOrigin: '0 0' });
    tl.fromTo(med, { scale: 0, rotation: -40 }, { scale: 1, rotation: 0, duration: F(9), ease: 'back.out(1.7)', immediateRender: false }, t0);
    X.sfx(t0, 'pop', { gain: 0.4, pitch: 0.7 });
    // ribbon with spaced caps
    const rib = X.svg('g', {}, g);
    const rw = o.ribbonW || 520;
    X.svg('path', { d: P.poly([[-rw / 2 - 70, 196], [-rw / 2 + 10, 186], [-rw / 2 + 10, 246], [-rw / 2 - 70, 252], [-rw / 2 - 40, 222]]) + P.poly([[rw / 2 + 70, 196], [rw / 2 + 40, 222], [rw / 2 + 70, 252], [rw / 2 - 10, 246], [rw / 2 - 10, 186]]), fill: C.tan }, rib);
    X.svg('path', { d: `M${-rw / 2},178 Q0,150 ${rw / 2},178 L${rw / 2},238 Q0,210 ${-rw / 2},238 Z`, fill: IK.creamFill }, rib);
    const ribPath = X.svg('path', { id: 'ikRib' + (o.seed || 4), d: `M${-rw / 2 + 20},${219} Q0,${191} ${rw / 2 - 20},${219}`, fill: 'none' }, X.defs);
    const tp = X.svg('text', { 'font-family': SLAB, 'font-size': o.size2 || 34, fill: C.tag, 'letter-spacing': '0.32em', 'text-anchor': 'middle' }, rib);
    const tpp = X.svg('textPath', { href: '#' + ribPath.id, startOffset: '50%', text: o.l2 || 'OF MONEY' }, tp);
    gsap.set(rib, { scaleX: 0, svgOrigin: '0 210' });
    tl.fromTo(rib, { scaleX: 0 }, { scaleX: 1, duration: F(10), ease: 'power3.out', immediateRender: false }, o.tRibbon ?? t0 + F(26));
    X.sfx(o.tRibbon ?? t0 + F(26), 'paper', { gain: 0.3 });
    // stars
    const stars = [];
    for (let i = 0; i < 7; i++) {
      const a = Math.PI * (1.12 + i * 0.127), R = 300;
      const st = X.svg('path', { d: starD(14, 6), fill: C.white }, g);
      gsap.set(st, { x: Math.cos(a) * R, y: Math.sin(a) * R * 0.78 - 40, scale: 0, svgOrigin: '0 0' });
      tl.fromTo(st, { scale: 0, rotation: -90 }, { scale: 1, rotation: 0, duration: F(7), ease: 'back.out(2.5)', immediateRender: false }, t0 + F(32) + i * F(1.5));
      stars.push(st);
    }
    X.sfx(t0 + F(32), 'sparkle', { gain: 0.25 });
    return { g, med, rib, rays, keys, ped, flank, leaves, stars, l1, tp: tpp };
  };
  function starD(R, r) { const pts = []; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + (i * Math.PI) / 5, rr = i % 2 ? r : R; pts.push([Math.cos(a) * rr, Math.sin(a) * rr]); } return P.poly(pts); }
  IK.starD = starD;
})();
