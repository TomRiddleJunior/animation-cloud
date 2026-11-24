/* School-of-Life-style essay-film kit for the explainer engine (window.K).
 *
 * The FORMAT is the core (ident sting -> essay voice -> one drawn metaphor per sentence -> numbered chapter cards ->
 * quiet ending card); the LOOK is a swappable layer. This kit ships one look ("ink & cream": flat outlined figures,
 * tube limbs, tiny heads, single-line faces, cream paper, saturated chapter fields), driven by K.LOOK.
 *
 * Hand-drawn feel:
 *   - everything on the master timeline is sampled ON TWOS: K.init wraps X.tl.seek so time snaps to 1/12 s
 *     (render at --fps 24 -> every drawing is held for exactly 2 frames);
 *   - paper: one static X.paper sheet under the world + a grey fibre layer multiplied over everything whose 4 variants
 *     cycle every drawing (re-boiled grain, keeps flat_mean / hold_frac in the source range) + light X.grain at 12 Hz;
 *   - ink line boil: X.boil displacement filter on the world and card layers, stepping at 12 Hz;
 *   - strokes draw on with X.drawOn; figures are procedural puppets re-drawn from a pose each drawing.
 *
 * Load order in index.html: gsap (+MorphSVGPlugin), /engine/lib/explainer.js, kit.js, scene.js.
 * Call K.init(X) first inside X.boot (after X.loadVO()).
 */
(function () {
  const K = (window.K = {});

  // ------------------------------------------------------------------ look (swap this block for another drawn look)
  K.LOOK = {
    name: 'ink-and-cream',
    paper: '#E7E1D7',          // cream ground (measured #DCD4CA..#EEEDE9)
    paperStrength: 0.03,       // static blotches of the X.paper ground
    fibre: 0.018,              // strength of the re-boiled fibre layer (motion floor on holds ~0.3-0.5)
    vignette: 0.26,            // corner darkening (measured 15-20 %)
    vignetteColor: '#3c2a1c',
    boil: 2.0,                 // line-boil displacement px (mode A 2-3, ink-on-kraft 4-6)
    boilFreq: 0.018,
    grain: 0.02,
    lw: 6,                     // outline width at 1080p (measured 6-7 px)
    serif: 'Libre Baskerville',
  };
  const C = (K.C = {
    ink: '#1A1612', cream: '#E7E1D7', light: '#F2EFE9', warm: '#CBC4BB', floor: '#D6CEC2',
    skin: '#F3EBE0', terracotta: '#A24530', red: '#B1393A', olive: '#4E7225', oliveDk: '#3A463A',
    ochre: '#C49A45', tan: '#B18B52', mustard: '#B6AA45', lilac: '#B49AC8', peri: '#7B77CC', brown: '#6F392C',
    ultra: '#3625D2', dotRed: '#BB0019', slate: '#383E48', stone: '#8E96A0', sea: '#7B77CC', sky: '#EEEDE9',
    white: '#FBF8F2', ticket: '#F4EADA', rose: '#DDB09C', lilacBg: '#BEA8D2', sage: '#ADBB84', grass: '#6E8B3D',
  });

  // ------------------------------------------------------------------ time on twos
  K.FPS_DRAW = 12;
  K.q = (t) => Math.floor(t * K.FPS_DRAW + 1e-6) / K.FPS_DRAW;
  K._mods = []; K._figs = []; K._hooks = []; K._after = [];
  K.every = (fn) => K._hooks.push(fn);            // hook receives the QUANTISED time (runs before figures update)
  K.after = (fn) => K._after.push(fn);            // runs after figures update (read fig.handAt here)
  /** idle bob on twos: returns a wrapper group translated by amp*sin each drawing (put GSAP-animated things inside) */
  K.bobber = (parent, amp = 6, period = 1.8, phase = 0) => {
    const g = K.X.svg('g', {}, parent);
    K.every((tq) => g.setAttribute('transform', `translate(0,${(amp * Math.sin((2 * Math.PI * tq) / period + phase)).toFixed(1)})`));
    return g;
  };

  // ------------------------------------------------------------------ init: layers, paper, boil, vignette, grain
  K.init = (X, o = {}) => {
    K.X = X;
    Object.assign(K.LOOK, o);
    const L = K.LOOK;
    if (L.onTwos !== false) {
      const seek0 = X.tl.seek.bind(X.tl);
      X.tl.seek = (t, s) => seek0(K.q(t), s);
    }
    document.getElementById('stage').style.background = L.paper;
    // ground: one static X.paper sheet (blotches) under the world ...
    K.bg = X.svg('g', { id: 'paper' });
    X.svg('image', { href: X.paper(L.paper, 960, 540, L.paperStrength, 11), x: 0, y: 0, width: 1920, height: 1080, preserveAspectRatio: 'none' }, K.bg);
    // ... and a paper-fibre layer multiplied over EVERYTHING (cards and coloured sets too), re-drawn every drawing
    const fib = [0, 1, 2, 3].map((i) => X.html('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: 40, mixBlendMode: 'multiply',
      backgroundImage: `url(${K.fibre(960, 540, L.fibre, 101 + i * 13)})`, backgroundSize: '1920px 1080px', opacity: i ? 0 : 1 } }));
    const boil = X.boil('solBoil', L.boil, K.FPS_DRAW, L.boilFreq);
    // pin the filter region to the frame: the default (bbox ±5 %) grows with every off-screen/zoomed set and Chrome
    // then clips or down-samples the filter (missing strips of floor, soft lines)
    const bf = X.defs.querySelector('#solBoil');
    for (const [a, v] of Object.entries({ filterUnits: 'userSpaceOnUse', x: -40, y: -40, width: 2000, height: 1160 })) bf.setAttribute(a, v);
    K.world = X.svg('g', { id: 'world', filter: boil });
    K.cards = X.svg('g', { id: 'cards', filter: boil });
    K.top = X.svg('g', { id: 'top' });
    const vg = X.radial('solVig', [[0, L.vignetteColor, 0], [0.5, L.vignetteColor, 0], [1, L.vignetteColor, L.vignette]], 0.5, 0.5, 0.62);
    X.svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: vg, 'pointer-events': 'none' }, K.top);
    if (L.grain) X.grain(L.grain, K.FPS_DRAW);
    X.every((t) => {
      const tq = K.q(t);
      const k = Math.floor(tq * K.FPS_DRAW + 1e-6) % 4;
      fib.forEach((p, i) => { p.style.opacity = i === k ? 1 : 0; });
      for (const h of K._hooks) h(tq);
      for (const f of K._figs) f.update(tq);
      for (const h of K._after) h(tq);
    });
    return K;
  };

  /** grey paper-fibre texture (white = no change) for a multiply overlay: fixed soft blotches + per-seed fibres */
  K.fibre = (w, h, strength = 0.05, seed = 1) => {
    const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'), img = g.createImageData(w, h), rb = K.X.rand(777), rf = K.X.rand(seed);
    const cell = 30, bw = Math.ceil(w / cell) + 2, big = Array.from({ length: bw * (Math.ceil(h / cell) + 2) }, () => rb());
    for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
      const bx = x / cell, by = y / cell, ix = Math.floor(bx), iy = Math.floor(by), fx = bx - ix, fy = by - iy;
      const b = big[iy * bw + ix] * (1 - fx) * (1 - fy) + big[iy * bw + ix + 1] * fx * (1 - fy) + big[(iy + 1) * bw + ix] * (1 - fx) * fy + big[(iy + 1) * bw + ix + 1] * fx * fy;
      const f = rf(), streak = rf() < 0.004 ? 0.6 : 0;
      const v = 255 * (1 - strength * (0.35 * b + 0.65 * f + streak));
      const i = (y * w + x) * 4; img.data[i] = v; img.data[i + 1] = v * 0.995; img.data[i + 2] = v * 0.985; img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  };
  /** explicit transform proxy (use instead of GSAP transforms when the pivot matters or the element was transformed before):
   *  tween the returned object's {x, y, s, sx, sy, r, ls}; pivot (px, py) is in the element's own coordinates. */
  K.xf = (el, px = 0, py = 0, init = {}) => {
    const o = Object.assign({ x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, ls: 0 }, init);   // ls = log-scale (exp(ls) multiplies s): tween it for perceptually even zooms
    const f = (v) => (Math.round(v * 10000) / 10000).toString();
    const apply = () => { const S = o.s * Math.exp(o.ls); el.setAttribute('transform', `translate(${f(o.x + px)},${f(o.y + py)}) rotate(${f(o.r)}) scale(${f(S * o.sx)},${f(S * o.sy)}) translate(${f(-px)},${f(-py)})`); };
    apply(); K.every(apply);
    return o;
  };

  // ------------------------------------------------------------------ small helpers
  const n1 = (v) => (Math.round(v * 10) / 10).toString();
  const P = (p) => n1(p[0]) + ',' + n1(p[1]);
  const nrm = (x, y) => { const l = Math.hypot(x, y) || 1; return [x / l, y / l]; };
  const dir = (a) => { const r = (a * Math.PI) / 180; return [Math.sin(r), Math.cos(r)]; }; // 0 = down, + = toward +x
  K.dir = dir;
  K.ink = (o = {}) => ({ stroke: C.ink, 'stroke-width': o.sw ?? K.LOOK.lw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
  /** <path> with ink outline. o: {sw, stroke, op} */
  K.path = (parent, d, fill = 'none', o = {}) => {
    const el = K.X.svg('path', { d, fill, ...K.ink(o) }, parent);
    if (o.stroke) el.setAttribute('stroke', o.stroke);
    if (o.op != null) el.setAttribute('opacity', o.op);
    if (o.sw === 0) el.setAttribute('stroke', 'none');
    return el;
  };
  K.circle = (parent, cx, cy, r, fill = 'none', o = {}) => K.path(parent, `M${n1(cx - r)},${n1(cy)}a${n1(r)},${n1(r)} 0 1,0 ${n1(2 * r)},0a${n1(r)},${n1(r)} 0 1,0 ${n1(-2 * r)},0Z`, fill, o);
  K.ellipse = (parent, cx, cy, rx, ry, fill = 'none', o = {}) => K.path(parent, `M${n1(cx - rx)},${n1(cy)}a${n1(rx)},${n1(ry)} 0 1,0 ${n1(2 * rx)},0a${n1(rx)},${n1(ry)} 0 1,0 ${n1(-2 * rx)},0Z`, fill, o);
  K.rect = (parent, x, y, w, h, fill = 'none', o = {}) => {
    const r = o.r || 0;
    const d = r ? `M${x + r},${y}H${x + w - r}Q${x + w},${y} ${x + w},${y + r}V${y + h - r}Q${x + w},${y + h} ${x + w - r},${y + h}H${x + r}Q${x},${y + h} ${x},${y + h - r}V${y + r}Q${x},${y} ${x + r},${y}Z`
      : `M${x},${y}H${x + w}V${y + h}H${x}Z`;
    return K.path(parent, d, fill, o);
  };
  /** a group whose local origin sits at (x,y): animate it with svgOrigin '0 0' for pivots. */
  K.at = (parent, x, y, s = 1, rot = 0) => {
    const outer = K.X.svg('g', { transform: `translate(${x},${y}) rotate(${rot}) scale(${s})` }, parent);
    return K.X.svg('g', {}, outer);
  };
  K.text = (parent, x, y, str, o = {}) => K.X.svg('text', {
    x, y, text: str, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || K.LOOK.serif, 'font-weight': o.weight ?? 700,
    'font-size': o.size || 96, fill: o.fill || C.ink, 'font-style': o.italic ? 'italic' : 'normal', 'letter-spacing': o.track || 0,
  }, parent);
  /** smooth curve through points (Catmull-Rom -> cubic) */
  K.smooth = (pts, closed = false) => {
    const p = closed ? [pts[pts.length - 1], ...pts, pts[0], pts[1]] : [pts[0], ...pts, pts[pts.length - 1]];
    let d = `M${P(p[1])}`;
    for (let i = 1; i < p.length - 2; i++) {
      const a = p[i - 1], b = p[i], c = p[i + 1], e = p[i + 2];
      d += `C${P([b[0] + (c[0] - a[0]) / 6, b[1] + (c[1] - a[1]) / 6])} ${P([c[0] - (e[0] - b[0]) / 6, c[1] - (e[1] - b[1]) / 6])} ${P(c)}`;
    }
    return d + (closed ? 'Z' : '');
  };
  /** tube along 3 points with widths (rounded caps, soft joint) — limbs, sleeves, trousers, ropes */
  K.limbD = (p, ws) => {
    const n = p.length, Lp = [], Rp = [];
    for (let i = 0; i < n; i++) {
      let t;
      if (i === 0) t = nrm(p[1][0] - p[0][0], p[1][1] - p[0][1]);
      else if (i === n - 1) t = nrm(p[n - 1][0] - p[n - 2][0], p[n - 1][1] - p[n - 2][1]);
      else { const a = nrm(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]), b = nrm(p[i + 1][0] - p[i][0], p[i + 1][1] - p[i][1]); t = nrm(a[0] + b[0], a[1] + b[1]); }
      const nx = -t[1], ny = t[0], w = ws[i] / 2;
      Lp.push([p[i][0] + nx * w, p[i][1] + ny * w]); Rp.push([p[i][0] - nx * w, p[i][1] - ny * w]);
    }
    const mid = (a, b) => [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
    const e = n - 1;
    let d = `M${P(Lp[0])}`;
    for (let i = 1; i < e; i++) d += `L${P(mid(Lp[i - 1], Lp[i]))}Q${P(Lp[i])} ${P(mid(Lp[i], Lp[i + 1]))}`;
    d += `L${P(Lp[e])}A${n1(ws[e] / 2)},${n1(ws[e] / 2)} 0 0 0 ${P(Rp[e])}`;
    for (let i = e - 1; i > 0; i--) d += `L${P(mid(Rp[i + 1], Rp[i]))}Q${P(Rp[i])} ${P(mid(Rp[i], Rp[i - 1]))}`;
    d += `L${P(Rp[0])}A${n1(ws[0] / 2)},${n1(ws[0] / 2)} 0 0 0 ${P(Lp[0])}Z`;
    return d;
  };

  // ------------------------------------------------------------------ figures (procedural puppets, re-drawn per drawing)
  K.FIG = {
    woman: { thigh: 205, shin: 198, T: 205, hw: 56, sw: 84, upper: 146, fore: 134, neck: 30, hrx: 31, hry: 39,
      legW: [62, 56, 70], armW: [54, 46, 38], hair: 'bob', jumper: C.ochre, trousers: C.terracotta, shoes: C.ink, scarf: C.peri, skin: C.skin },
    man: { thigh: 212, shin: 204, T: 222, hw: 62, sw: 94, upper: 156, fore: 142, neck: 30, hrx: 32, hry: 40,
      legW: [62, 58, 54], armW: [58, 50, 40], hair: 'short', glasses: true, jumper: C.brown, trousers: C.oliveDk, shoes: C.peri, scarf: null, skin: C.skin },
  };
  K.POSE = { x: 960, y: 960, s: 1, flip: 1, lt: -3, lk: 0, rt: 3, rk: 0, la: -9, le: 5, ra: 9, re: -5, lean: 0, hd: 0, turn: 0, blink: 0, smile: 0, bob: 0, wind: 0.7, op: 1 };

  /**
   * K.figure(parent, {type:'woman'|'man', dims:{...}, pose:{...}, colors:{jumper,...}})
   * pose angles in degrees, 0 = hanging straight down, positive = tip swings toward +x (screen right):
   *   lt/rt thigh, lk/rk knee bend (relative), la/ra upper arm, le/re elbow bend (relative), lean (torso, about hips),
   *   hd head tilt, turn -1..1 face turn (1 = profile facing local +x), blink 0 open / 1 closed / 2 laughing,
   *   smile 0..1 (2 = open laugh), bob vertical px, flip -1 mirrors, wind = scarf flutter amount.
   * slots: fig.back (behind body), fig.mid (between jumper and arms), fig.hold (over hands), fig.front, fig.pattern (clipped to jumper)
   */
  K.figure = (parent, o = {}) => {
    const X = K.X;
    const D = Object.assign({}, K.FIG[o.type || 'woman'], o.dims || {}, o.colors || {});
    const pose = Object.assign({}, K.POSE, o.pose || {});
    const sw = (o.lw || K.LOOK.lw) / pose.s;
    const st = { stroke: C.ink, 'stroke-width': sw, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' };
    const mk = (par, fill) => X.svg('path', { fill, ...st }, par);
    const root = X.svg('g', { class: 'fig' }, parent);
    const back = X.svg('g', {}, root);
    const legs = X.svg('g', {}, root);
    const torso = X.svg('g', {}, root);
    const front = X.svg('g', {}, root);
    const legL = mk(legs, D.trousers), legR = mk(legs, D.trousers), shoeL = mk(legs, D.shoes), shoeR = mk(legs, D.shoes);
    const tback = X.svg('g', {}, torso);
    const tail = D.scarf ? mk(torso, D.scarf) : null;
    const T = D.T, hw = D.hw, swd = D.sw;
    const jumperD = `M${-hw},8L${hw},8C${hw + 4},${n1(-T * 0.35)} ${swd + 6},${n1(-T * 0.62)} ${swd},${-T + 26}Q${swd - 4},${-T} ${swd - 46},${-T}L${-(swd - 46)},${-T}Q${-(swd - 4)},${-T} ${-swd},${-T + 26}C${-(swd + 6)},${n1(-T * 0.62)} ${-(hw + 4)},${n1(-T * 0.35)} ${-hw},8Z`;
    const jumper = mk(torso, D.jumper); jumper.setAttribute('d', jumperD);
    const cid = 'jclip' + K._figs.length;
    const cp = X.svg('clipPath', { id: cid }, X.defs); X.svg('path', { d: jumperD }, cp);
    const pattern = X.svg('g', { 'clip-path': `url(#${cid})` }, torso);
    const jumperLine = X.svg('path', { d: jumperD, fill: 'none', ...st }, torso);
    const head = X.svg('g', {}, torso);
    const hc = [0, -(D.neck + D.hry - 8)];
    const neck = mk(head, D.skin); neck.setAttribute('d', `M-11,10L-11,${-D.neck - 4}L11,${-D.neck - 4}L11,10Z`);
    const skull = mk(head, D.skin);
    const hair = mk(head, C.ink);
    const brows = X.svg('path', { fill: 'none', ...st, 'stroke-width': sw * 0.6 }, head);
    const eyeL = X.svg('path', { ...st, 'stroke-width': sw * 0.55 }, head), eyeR = X.svg('path', { ...st, 'stroke-width': sw * 0.55 }, head);
    const mouth = X.svg('path', { fill: 'none', ...st, 'stroke-width': sw * 0.55 }, head);
    const glasses = D.glasses ? X.svg('path', { fill: 'none', ...st, 'stroke-width': sw * 0.5 }, head) : null;
    const collar = mk(torso, D.scarf || D.jumper);
    collar.setAttribute('d', D.scarf
      ? `M-36,${-T - 4}Q0,${-T + 12} 36,${-T - 4}L33,${-T + 16}Q0,${-T + 32} -33,${-T + 16}Z`
      : `M-26,${-T + 1}Q0,${-T + 20} 26,${-T + 1}L22,${-T - 4}Q0,${-T + 10} -22,${-T - 4}Z`);
    const mid = X.svg('g', {}, torso);
    const armL = mk(torso, D.jumper), armR = mk(torso, D.jumper), handL = mk(torso, D.skin), handR = mk(torso, D.skin);
    const hold = X.svg('g', {}, torso);
    const handD = 'M-14,-6C-17,10 -13,25 0,27C13,25 17,10 14,-6Z';
    handL.setAttribute('d', handD); handR.setAttribute('d', handD);
    const fig = { pose, D, root, back, tback, front, mid, hold, pattern, torso, mods: [], att: [], hands: { l: [0, 0, 0], r: [0, 0, 0] }, ep: pose };

    const hairD = (o2) => D.hair === 'bob'
      ? `M${-38 + o2},14C${-45 + o2},-18 ${-37 + o2},-50 ${o2},-50C${37 + o2},-50 ${45 + o2},-18 ${38 + o2},14C${36 + o2},21 ${28 + o2},21 ${27 + o2},14C${29 + o2},-6 ${23 + o2},-22 ${8 + o2},-28C${-6 + o2},-20 ${-19 + o2},-18 ${-29 + o2},-11C${-30 + o2},1 ${-28 + o2},8 ${-27 + o2},14C${-28 + o2},21 ${-36 + o2},21 ${-38 + o2},14Z`
      : `M${-33 + o2},-4C${-38 + o2},-36 ${-20 + o2},-50 ${2 + o2},-50C${26 + o2},-50 ${38 + o2},-34 ${33 + o2},-4C${30 + o2},-14 ${26 + o2},-22 ${17 + o2},-26C${8 + o2},-19 ${-10 + o2},-19 ${-22 + o2},-24C${-28 + o2},-18 ${-31 + o2},-12 ${-33 + o2},-4Z`;

    fig.update = (tq) => {
      const p = Object.assign({}, pose);
      for (const m of fig.mods) m(tq, p);
      fig.ep = p;
      root.setAttribute('transform', `translate(${n1(p.x)},${n1(p.y + p.bob)}) scale(${(p.s * p.flip).toFixed(4)},${p.s.toFixed(4)})`);
      root.setAttribute('opacity', p.op);
      const hipY = -(D.thigh + D.shin + 14);
      const leg = (h, a1, a2) => { const d1 = dir(a1), k = [h[0] + d1[0] * D.thigh, h[1] + d1[1] * D.thigh], d2 = dir(a1 + a2); return [h, k, [k[0] + d2[0] * D.shin, k[1] + d2[1] * D.shin]]; };
      const LL = leg([-hw + 27, hipY], p.lt, p.lk), RL = leg([hw - 27, hipY], p.rt, p.rk);
      legL.setAttribute('d', K.limbD(LL, D.legW)); legR.setAttribute('d', K.limbD(RL, D.legW));
      const prof = Math.abs(p.turn) > 0.5, fs = prof ? Math.sign(p.turn) : 0;
      const shoe = 'M-20,-10C-22,6 -16,14 0,14L34,14C46,14 50,4 42,-4C34,-10 16,-10 6,-14Z';
      shoeL.setAttribute('d', shoe); shoeR.setAttribute('d', shoe);
      shoeL.setAttribute('transform', `translate(${P(LL[2])}) scale(${fs || -0.8},1)`);
      shoeR.setAttribute('transform', `translate(${P(RL[2])}) scale(${fs || 0.8},1)`);
      torso.setAttribute('transform', `translate(0,${hipY}) rotate(${n1(p.lean)})`);
      head.setAttribute('transform', `translate(0,${-T + 4}) rotate(${n1(p.hd)})`);
      const o2 = p.turn * 10;
      skull.setAttribute('d', `M${n1(hc[0] - D.hrx)},${n1(hc[1])}a${D.hrx},${D.hry} 0 1,0 ${2 * D.hrx},0a${D.hrx},${D.hry} 0 1,0 ${-2 * D.hrx},0Z`);
      hair.setAttribute('transform', `translate(${n1(hc[0] - o2 * 0.35)},${n1(hc[1])})`);
      hair.setAttribute('d', hairD(0));
      const fx = hc[0] + o2, fy = hc[1];
      brows.setAttribute('d', `M${n1(fx - 20)},${n1(fy - 9)}Q${n1(fx - 12)},${n1(fy - 15)} ${n1(fx - 4)},${n1(fy - 10)}L${n1(fx - 2)},${n1(fy + 9)}Q${n1(fx + 2)},${n1(fy + 12)} ${n1(fx + 7)},${n1(fy + 9)}M${n1(fx + 6)},${n1(fy - 11)}Q${n1(fx + 13)},${n1(fy - 15)} ${n1(fx + 20)},${n1(fy - 10)}`);
      const eye = (el, ex) => {
        const ey = fy - 1;
        if (p.blink < 0.5) { el.setAttribute('d', `M${n1(ex - 3.6)},${n1(ey)}a3.6,3.6 0 1,0 7.2,0a3.6,3.6 0 1,0 -7.2,0Z`); el.setAttribute('fill', C.ink); }
        else if (p.blink < 1.5) { el.setAttribute('d', `M${n1(ex - 6)},${n1(ey)}Q${n1(ex)},${n1(ey + 4)} ${n1(ex + 6)},${n1(ey)}`); el.setAttribute('fill', 'none'); }
        else { el.setAttribute('d', `M${n1(ex - 6)},${n1(ey + 2)}Q${n1(ex)},${n1(ey - 5)} ${n1(ex + 6)},${n1(ey + 2)}`); el.setAttribute('fill', 'none'); }
      };
      eye(eyeL, fx - 12); eye(eyeR, fx + 13);
      if (p.smile > 1.5) { mouth.setAttribute('d', `M${n1(fx - 9)},${n1(fy + 19)}Q${n1(fx)},${n1(fy + 32)} ${n1(fx + 9)},${n1(fy + 19)}Z`); mouth.setAttribute('fill', C.ink); }
      else { mouth.setAttribute('d', `M${n1(fx - 7)},${n1(fy + 21)}Q${n1(fx)},${n1(fy + 21 + 6 * p.smile)} ${n1(fx + 7)},${n1(fy + 21)}`); mouth.setAttribute('fill', 'none'); }
      if (glasses) glasses.setAttribute('d', `M${n1(fx - 22)},${n1(fy - 1)}a10,10 0 1,0 20,0a10,10 0 1,0 -20,0M${n1(fx + 3)},${n1(fy - 1)}a10,10 0 1,0 20,0a10,10 0 1,0 -20,0M${n1(fx - 2)},${n1(fy - 3)}L${n1(fx + 3)},${n1(fy - 3)}`);
      // arms
      const arm = (sh, a1, a2) => { const d1 = dir(a1), e = [sh[0] + d1[0] * D.upper, sh[1] + d1[1] * D.upper], d2 = dir(a1 + a2); return [sh, e, [e[0] + d2[0] * D.fore, e[1] + d2[1] * D.fore]]; };
      const AL = arm([-(swd - 22), -T + 30], p.la, p.le), AR = arm([swd - 22, -T + 30], p.ra, p.re);
      armL.setAttribute('d', K.limbD(AL, D.armW)); armR.setAttribute('d', K.limbD(AR, D.armW));
      handL.setAttribute('transform', `translate(${P(AL[2])}) rotate(${n1(-(p.la + p.le))})`);
      handR.setAttribute('transform', `translate(${P(AR[2])}) rotate(${n1(-(p.ra + p.re))})`);
      const hd = (A, a) => { const d = dir(a); return [A[2][0] + d[0] * 14, A[2][1] + d[1] * 14, a]; };
      fig.hands.l = hd(AL, p.la + p.le); fig.hands.r = hd(AR, p.ra + p.re);
      // scarf tail flutter (on twos)
      if (tail) {
        const N = 9, Ln = 200 * (0.55 + 0.45 * Math.min(1, p.wind)), ph = tq * 2 * Math.PI * 1.15;
        const base = [-24, -T + 14], pts = [], ws = [];
        for (let i = 0; i <= N; i++) {
          const k = i / N;
          pts.push([base[0] - k * Ln, base[1] + k * Ln * 0.22 + p.wind * 14 * k * Math.sin(ph - i * 0.85)]);
          ws.push(26 - 10 * k);
        }
        let L = [], R = [];
        for (let i = 0; i <= N; i++) {
          const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)], t = nrm(b[0] - a[0], b[1] - a[1]);
          L.push([pts[i][0] - t[1] * ws[i] / 2, pts[i][1] + t[0] * ws[i] / 2]); R.push([pts[i][0] + t[1] * ws[i] / 2, pts[i][1] - t[0] * ws[i] / 2]);
        }
        const last = pts[N];
        tail.setAttribute('d', K.smooth(L) + `L${P([last[0] - 8, last[1] + 4])}L${P(R[N])}` + K.smooth(R.slice().reverse()).replace(/^M[^C]+/, 'L' + P(R[N])) + 'Z');
      }
      for (const a of fig.att) {
        const h = fig.hands[a.side];
        a.el.setAttribute('transform', `translate(${n1(h[0] + (a.dx || 0))},${n1(h[1] + (a.dy || 0))}) rotate(${n1((a.follow ? -h[2] : 0) + (a.rot || 0))})`);
      }
    };
    /** torso-local point -> figure parent coordinates (uses the pose of the last drawing) */
    fig.toParent = (pt) => {
      const e = fig.ep, a = (e.lean * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), hipY = -(D.thigh + D.shin + 14);
      const rx = pt[0] * c - pt[1] * s, ry = pt[0] * s + pt[1] * c + hipY;
      return [e.x + rx * e.s * e.flip, e.y + e.bob + ry * e.s];
    };
    fig.handAt = (side) => fig.toParent(fig.hands[side]);
    /** where a hand WOULD be for a given pose (pure, no DOM) — for hand-offs that must stay deterministic */
    fig.handFor = (side, over = {}) => {
      const e = Object.assign({}, pose, over), L = side === 'l';
      const sh = [L ? -(swd - 22) : swd - 22, -T + 30], a1 = L ? e.la : e.ra, a2 = L ? e.le : e.re;
      const d1 = dir(a1), d2 = dir(a1 + a2), w = [sh[0] + d1[0] * D.upper + d2[0] * (D.fore + 14), sh[1] + d1[1] * D.upper + d2[1] * (D.fore + 14)];
      const a = (e.lean * Math.PI) / 180, c = Math.cos(a), s = Math.sin(a), hipY = -(D.thigh + D.shin + 14);
      return [e.x + (w[0] * c - w[1] * s) * e.s * e.flip, e.y + e.bob + (w[0] * s + w[1] * c + hipY) * e.s];
    };
    /** pin an element (in fig.hold / fig.mid) to a hand each drawing */
    fig.attach = (el, side = 'r', o3 = {}) => { fig.att.push({ el, side, ...o3 }); return el; };
    K._figs.push(fig);
    return fig;
  };
  /** tween a pose (sampled on twos by the master clock). Default: slow sine in-out, as in the source. */
  K.pose = (fig, t, pose, dur = 0.7, ease = 'sine.inOut') => K.X.tl.to(fig.pose, { ...pose, duration: dur, ease }, t);
  K.set = (fig, t, pose) => K.X.tl.set(fig.pose, pose, t);
  /** profile walk cycle facing local +x; travels speed px/s in world x (dir = flip). */
  K.walk = (fig, t0, t1, o = {}) => {
    const cyc = o.cycle || 1.0, speed = o.speed ?? 150, amp = o.amp || 22, dirx = o.dir || 1;
    fig.mods.push((tq, e) => {
      if (tq < t0) return;
      const tt = Math.min(tq, t1) - t0;
      e.x += speed * tt * dirx;
      if (tq > t1) return;
      const w = Math.max(0, Math.min(1, tt / 0.25, (t1 - tq) / 0.25));
      const ph = (2 * Math.PI * tt) / cyc, s = Math.sin(ph), c = Math.cos(ph);
      const mix = (k, v) => { e[k] = e[k] * (1 - w) + v * w; };
      mix('lt', amp * s); mix('rt', -amp * s);
      mix('lk', -36 * Math.max(0, c)); mix('rk', -36 * Math.max(0, -c));
      if (o.arms !== false) { mix('la', -amp * 0.7 * s); mix('ra', amp * 0.7 * s); mix('le', 12); mix('re', 12); }
      e.bob += w * (7 * Math.abs(s) - 3);
    });
  };
  /** small repeated gesture (polishing, waving): adds sin offsets to pose keys between t0 and t1, on twos */
  K.wobble = (fig, t0, t1, keys, period = 0.5) => {
    fig.mods.push((tq, e) => {
      if (tq < t0 || tq > t1) return;
      const w = Math.max(0, Math.min(1, (tq - t0) / 0.2, (t1 - tq) / 0.2)), s = Math.sin((2 * Math.PI * (tq - t0)) / period);
      for (const [k, a] of Object.entries(keys)) e[k] += a * s * w;
    });
  };

  // ------------------------------------------------------------------ props (all drawn in the same outlined flat style)
  /** museum plinth with a glass bell jar and a cushion; returns {g, inside} (inside = group under the glass) */
  K.plinth = (parent, x, y, o = {}) => {
    const w = o.w || 220, h = o.h || 330, g = K.at(parent, x, y);
    K.rect(g, -w / 2, -h, w, h, o.fill || C.warm);
    K.rect(g, -w / 2 - 18, -h - 26, w + 36, 26, o.top || C.light);
    K.rect(g, -w / 2 - 12, -20, w + 24, 20, o.top || C.light);
    if (o.placard !== false) { K.rect(g, -44, -h + 70, 88, 52, C.light, { sw: 4 }); K.path(g, `M-28,${-h + 88}H28M-28,${-h + 104}H14`, 'none', { sw: 3 }); }
    const inside = K.X.svg('g', {}, g);
    K.path(inside, `M-46,${-h - 26}C-46,${-h - 52} 46,${-h - 52} 46,${-h - 26}Z`, o.cushion || C.terracotta);
    const jh = o.jar || 220;
    K.path(g, `M-82,${-h - 26}L-82,${-h - 26 - jh * 0.55}C-82,${-h - 26 - jh * 1.05} 82,${-h - 26 - jh * 1.05} 82,${-h - 26 - jh * 0.55}L82,${-h - 26}`, 'rgba(255,255,255,0.18)');
    K.path(g, `M-56,${-h - 60}L-56,${-h - 26 - jh * 0.6}C-54,${-h - 26 - jh * 0.82} -36,${-h - 26 - jh * 0.92} -14,${-h - 26 - jh * 0.95}`, 'none', { stroke: C.white, sw: 5 });
    K.rect(g, -16, -h - 26 - jh * 0.97 - 18, 32, 20, C.light, { r: 6 });
    return { g, inside, top: -h - 26 };
  };
  /** brass posts with a swag rope */
  K.rope = (parent, x1, x2, y, o = {}) => {
    const g = K.X.svg('g', {}, parent), h = o.h || 210;
    for (const x of [x1, x2]) { K.rect(g, x - 9, y - h, 18, h, C.tan); K.rect(g, x - 30, y - 16, 60, 16, C.tan, { r: 6 }); K.circle(g, x, y - h - 12, 16, C.tan); }
    const rope = K.path(g, `M${x1},${y - h + 14}Q${(x1 + x2) / 2},${y - h + 110} ${x2},${y - h + 14}`, 'none', { stroke: C.ink, sw: 20 });
    K.path(g, `M${x1},${y - h + 14}Q${(x1 + x2) / 2},${y - h + 110} ${x2},${y - h + 14}`, 'none', { stroke: o.color || C.red, sw: 11 });
    return { g, rope };
  };
  /** chest of drawers; returns {g, drawers:[{g, front, gap}]}; open a drawer: tween its .g y/scale */
  K.drawers = (parent, x, y, o = {}) => {
    const w = o.w || 520, h = o.h || 520, n = o.n || 4, g = K.at(parent, x, y);
    K.rect(g, -w / 2 + 26, -24, 34, 24, C.ink); K.rect(g, w / 2 - 60, -24, 34, 24, C.ink);
    K.rect(g, -w / 2, -h, w, h - 20, o.fill || C.olive);
    K.rect(g, -w / 2 - 16, -h - 24, w + 32, 26, o.top || C.oliveDk);
    const dh = (h - 20 - 30) / n, drawers = [];
    for (let i = 0; i < n; i++) {
      const y0 = -h + 15 + i * dh;
      const gap = K.rect(g, -w / 2 + 22, y0 + 4, w - 44, dh - 8, C.ink, { sw: 0 });
      const dg = K.X.svg('g', {}, g);
      const front = K.rect(dg, -w / 2 + 22, y0 + 4, w - 44, dh - 8, o.front || C.olive);
      K.circle(dg, 0, y0 + dh / 2, 13, C.ochre, { sw: 4 });
      drawers.push({ g: dg, front, gap, y: y0, h: dh, w: w - 44 });
    }
    return { g, drawers, w, h };
  };
  /** ticket stub (centered at origin) */
  K.ticket = (parent, x, y, o = {}) => {
    const w = o.w || 170, h = o.h || 92, g = K.at(parent, x, y, o.s || 1, o.rot || 0), r = 14;
    K.path(g, `M${-w / 2},${-h / 2}H${w / 2}V${-r}A${r},${r} 0 0 0 ${w / 2},${r}V${h / 2}H${-w / 2}V${r}A${r},${r} 0 0 0 ${-w / 2},${-r}Z`, o.fill || C.ticket);
    K.path(g, `M${w / 2 - 44},${-h / 2 + 8}V${h / 2 - 8}`, 'none', { sw: 3 }).setAttribute('stroke-dasharray', '7 7');
    K.path(g, `M${-w / 2 + 22},${-14}H${w / 2 - 66}M${-w / 2 + 22},${8}H${w / 2 - 90}`, 'none', { sw: 4 });
    K.circle(g, w / 2 - 22, 0, 9, C.red, { sw: 3 });
    return g;
  };
  K.pebbleD = (r) => `M${-r},${r * 0.1}C${-r},${-r * 0.55} ${-r * 0.45},${-r * 0.78} ${r * 0.1},${-r * 0.74}C${r * 0.75},${-r * 0.7} ${r * 1.04},${-r * 0.3} ${r},${r * 0.12}C${r * 0.96},${r * 0.55} ${r * 0.5},${r * 0.72} ${-r * 0.05},${r * 0.7}C${-r * 0.6},${r * 0.68} ${-r},${r * 0.5} ${-r},${r * 0.1}Z`;
  K.pebble = (parent, x, y, r = 30, o = {}) => {
    const g = K.at(parent, x, y, 1, o.rot || 0);
    K.path(g, K.pebbleD(r), o.fill || C.stone);
    K.path(g, `M${-r * 0.55},${-r * 0.18}Q${-r * 0.4},${-r * 0.5} ${-r * 0.02},${-r * 0.52}`, 'none', { stroke: C.white, sw: Math.max(3, r * 0.12) });
    return g;
  };
  /** old key pointing +x, origin at the bow centre */
  K.key = (parent, x, y, o = {}) => {
    const s = o.s || 1, g = K.at(parent, x, y, s, o.rot || 0), sw = (o.sw || K.LOOK.lw) / s;
    const f = o.fill || C.red;
    K.path(g, `M30,-10H190V-2H206V-22H222V-2H232V10H30Z`, f, { sw });
    K.path(g, `M194,10V28H206V10Z`, f, { sw });
    K.path(g, `M212,10V36H226V10Z`, f, { sw });
    K.circle(g, 0, 0, 40, f, { sw });
    K.circle(g, 0, 0, 16, C.cream, { sw });
    return g;
  };
  /** big single-line face in profile looking right (Cocteau-like), returns {g, line, fill} — line is draw-on-able */
  K.profile = (parent, x, y, s = 1, o = {}) => {
    const g = K.at(parent, x, y, s);
    const d = 'M-260,420C-300,300 -330,140 -300,10C-270,-140 -170,-250 -20,-262C120,-272 230,-200 262,-90C276,-40 268,-4 280,30C292,62 330,92 322,112C314,130 284,128 284,150C284,170 300,180 292,196C284,212 268,210 270,228C272,250 290,262 276,286C262,312 220,312 186,312C150,312 136,350 130,420';
    const fill = K.path(g, d + 'Z', o.fill || C.light, { sw: 0 });
    const line = K.path(g, d, 'none', { sw: (o.sw || 7) / s });
    const eye = K.path(g, 'M180,40Q206,26 232,40Q206,50 180,40Z', 'none', { sw: 5 / s });
    const brow = K.path(g, 'M168,12Q206,-8 244,8', 'none', { sw: 5 / s });
    return { g, line, fill, eye, brow };
  };
  /** picture frame: returns {g, inner} where inner is clipped to the picture area (origin = frame centre) */
  K.frame = (parent, x, y, w, h, o = {}) => {
    const g = K.at(parent, x, y, 1, o.rot || 0), b = o.border || 16;
    K.rect(g, -w / 2 - b, -h / 2 - b, w + 2 * b, h + 2 * b, o.color || C.tan);
    const id = 'fr' + Math.floor(x) + '_' + Math.floor(y) + '_' + (K._fid = (K._fid || 0) + 1);
    const cp = K.X.svg('clipPath', { id }, K.X.defs);
    K.X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h }, cp);
    K.rect(g, -w / 2, -h / 2, w, h, o.bg || C.light, { sw: 4 });
    const inner = K.X.svg('g', { 'clip-path': `url(#${id})` }, g);
    K.rect(g, -w / 2, -h / 2, w, h, 'none', { sw: 4 });
    return { g, inner };
  };
  /** little seaside picture (sky, sun, sea stripes, sand, umbrella) drawn into a w x h box centred at origin */
  K.seaside = (parent, w, h, o = {}) => {
    const g = K.X.svg('g', {}, parent), sw = o.sw ?? 4;
    K.rect(g, -w / 2 - 4, -h / 2 - 4, w + 8, h + 8, o.sky || C.sky, { sw: 0 });
    const sun = K.circle(g, w * 0.22, -h * 0.2, Math.min(w, h) * 0.13, o.sunColor || C.red, { sw });
    const sea = K.X.svg('g', {}, g);
    K.rect(sea, -w / 2 - 4, h * 0.02, w + 8, h * 0.3, o.seaColor || C.sea, { sw: 0 });
    for (let i = 0; i < 3; i++) {
      const yy = h * 0.08 + i * h * 0.08, pts = [];
      for (let x = -w / 2; x <= w / 2 + 1; x += w / 8) pts.push([x, yy + ((x / (w / 8)) % 2 ? -h * 0.012 : h * 0.012)]);
      K.path(sea, K.smooth(pts), 'none', { stroke: C.white, sw: sw * 0.8 });
    }
    K.path(g, `M${-w / 2 - 4},${h * 0.02}H${w / 2 + 4}`, 'none', { sw });
    const sand = K.rect(g, -w / 2 - 4, h * 0.32, w + 8, h * 0.2, o.sandColor || C.ochre, { sw: 0 });
    K.path(g, `M${-w / 2 - 4},${h * 0.32}H${w / 2 + 4}`, 'none', { sw });
    const um = K.X.svg('g', {}, g);
    if (o.umbrella !== false) {
      K.path(um, `M${-w * 0.22},${h * 0.42}L${-w * 0.27},${h * 0.12}`, 'none', { sw });
      K.path(um, `M${-w * 0.42},${h * 0.16}Q${-w * 0.3},${-h * 0.06} ${-w * 0.12},${h * 0.07}Z`, o.umbrellaColor || C.terracotta, { sw });
    }
    return { g, sun, sea, sand, um };
  };
  K.bird = (parent, x, y, s = 1, o = {}) => {
    const g = K.at(parent, x, y, s);
    K.path(g, 'M-26,-4Q-12,-16 0,2Q12,-16 26,-4', 'none', { sw: (o.sw || 5) / s });
    return g;
  };
  K.flower = (parent, x, y, s = 1, o = {}) => {
    const g = K.at(parent, x, y, s), sw = (o.sw || 5) / s;
    K.path(g, 'M0,0C-4,-40 6,-80 0,-120', 'none', { sw });
    K.path(g, 'M0,-50C-30,-62 -42,-50 -48,-34C-30,-30 -12,-36 0,-50Z', o.leaf || C.olive, { sw });
    const head = K.X.svg('g', { transform: 'translate(0,-132)' }, g);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      K.ellipse(head, Math.sin(a) * 20, -Math.cos(a) * 20, 15, 15, o.color || C.red, { sw });
    }
    K.circle(head, 0, 0, 11, o.centre || C.ochre, { sw });
    return g;
  };
  /** short emphasis/strain marks around a point (3 dashes fanning out) */
  K.marks = (parent, x, y, o = {}) => {
    const g = K.at(parent, x, y, 1, o.rot || 0), r0 = o.r0 || 30, r1 = o.r1 || 56;
    for (const a of o.angles || [-40, 0, 40]) {
      const d = dir(180 + a);
      K.path(g, `M${n1(d[0] * r0)},${n1(d[1] * r0)}L${n1(d[0] * r1)},${n1(d[1] * r1)}`, 'none', { sw: o.sw || 5 });
    }
    return g;
  };
  /** small classical museum building (base at origin) */
  K.museum = (parent, x, y, s = 1, o = {}) => {
    const g = K.at(parent, x, y, s), sw = (o.sw || 5) / s;
    K.rect(g, -170, -30, 340, 30, C.light, { sw }); K.rect(g, -150, -50, 300, 22, C.light, { sw });
    for (let i = 0; i < 4; i++) K.rect(g, -125 + i * 74, -230, 30, 180, C.light, { sw });
    K.rect(g, -160, -258, 320, 30, C.light, { sw });
    K.path(g, 'M-170,-258L0,-340L170,-258Z', o.roof || C.lilac, { sw });
    return g;
  };
  /** free-standing door: returns {g, panel (hinged at left, tween scaleX with svgOrigin), opening (clipped group, origin = doorway centre), keyhole} */
  K.door = (parent, x, y, o = {}) => {
    const w = o.w || 250, h = o.h || 500, g = K.at(parent, x, y), sw = o.sw || K.LOOK.lw;
    const id = 'door' + Math.round(x);
    const cp = K.X.svg('clipPath', { id }, K.X.defs); K.X.svg('rect', { x: -w / 2, y: -h, width: w, height: h }, cp);
    K.rect(g, -w / 2 - 26, -h - 26, w + 52, h + 26, o.frame || C.light, { sw });
    K.rect(g, -w / 2, -h, w, h, C.ink, { sw: 0 });
    const opening = K.X.svg('g', { 'clip-path': `url(#${id})` }, g);
    const og = K.X.svg('g', { transform: `translate(0,${-h / 2})` }, opening);
    K.rect(g, -w / 2, -h, w, h, 'none', { sw });
    const panel = K.X.svg('g', {}, g);
    K.rect(panel, -w / 2, -h, w, h, o.color || C.terracotta, { sw });
    K.rect(panel, -w / 2 + 34, -h + 40, w - 68, h * 0.36, 'none', { sw: sw * 0.7 });
    K.rect(panel, -w / 2 + 34, -h * 0.5 + 10, w - 68, h * 0.36, 'none', { sw: sw * 0.7 });
    K.circle(panel, w / 2 - 34, -h * 0.5, 13, C.ochre, { sw: 4 });
    const keyhole = K.path(panel, `M${w / 2 - 38},${-h * 0.5 + 30}h8v18h-8Z`, C.ink, { sw: 2 });
    return { g, panel, opening: og, w, h };
  };
  /** decorative scalloped frame (stroke only) centred at cx,cy */
  K.scallopD = (cx, cy, w, h, bump = 22) => {
    let d = '';
    const edge = (x0, y0, x1, y1, first) => {
      const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / (bump * 2))), ux = (x1 - x0) / L, uy = (y1 - y0) / L;
      for (let i = 0; i < n; i++) {
        const a = [x0 + ux * (L * i / n), y0 + uy * (L * i / n)], b = [x0 + ux * (L * (i + 1) / n), y0 + uy * (L * (i + 1) / n)];
        const m = [(a[0] + b[0]) / 2 + uy * bump * 0.8, (a[1] + b[1]) / 2 - ux * bump * 0.8];
        d += (first && i === 0 ? `M${P(a)}` : '') + `Q${P(m)} ${P(b)}`;
      }
    };
    const x0 = cx - w / 2, y0 = cy - h / 2, x1 = cx + w / 2, y1 = cy + h / 2;
    edge(x0, y0, x1, y0, true); edge(x1, y0, x1, y1); edge(x1, y1, x0, y1); edge(x0, y1, x0, y0);
    return d + 'Z';
  };
  /** loose hand-drawn squiggle across a box (seeded), returns path d */
  K.squiggleD = (seed = 1, box = [80, 80, 1840, 1000], n = 9) => {
    const r = K.X.rand(seed), pts = [];
    for (let i = 0; i < n; i++) pts.push([box[0] + (box[2] - box[0]) * (i / (n - 1)) + (r() - 0.5) * 160, box[1] + r() * (box[3] - box[1])]);
    return K.smooth(pts);
  };

  // ------------------------------------------------------------------ type
  /** one keyword, set as type when spoken: serif, fades + rises 12 px over 0.3 s (on twos) */
  K.keyword = (parent, x, y, str, t, o = {}) => {
    const el = K.text(parent, x, y, str, { size: o.size || 72, fill: o.fill || C.ink, anchor: o.anchor });
    K.X.tl.fromTo(el, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }, t);
    if (o.out != null) K.X.tl.to(el, { opacity: 0, duration: 0.3, ease: 'power1.in' }, o.out);
    return el;
  };

  // ------------------------------------------------------------------ chapter card (colour-field wipe with a wavy edge)
  /**
   * K.card(tIn, tOut, {n:1, title:'The Evidence', field, text, num, line, seed})
   * field rises from the bottom with a wavy leading edge (0.45 s power2.out), a squiggle draws across (1.2 s),
   * "-n-" + serif title resolve at +0.35 s, holds, then the whole card slides off left (0.42 s power2.in) at tOut.
   */
  /** full-frame colour field with a wavy hand-drawn top and right edge (the chapter-card field, reusable as a set wipe) */
  K.fieldD = (seed = 5) => {
    const r = K.X.rand(seed), top = [], right = [];
    for (let x = -60; x <= 2000; x += 120) top.push([x, -34 + (r() - 0.5) * 30 + 16 * Math.sin(x / 190)]);
    for (let y = -34; y <= 1180; y += 120) right.push([1950 + 16 * Math.sin(y / 170) + (r() - 0.5) * 24, y]);
    return K.smooth(top) + 'L' + P(right[0]) + K.smooth(right).replace(/^M[^C]+/, '') + 'L-60,1200Z';
  };
  /** colour-field wipe: a wavy-edged field rises from the bottom (0.7 s power2.inOut) — set changes between colour grounds */
  K.wipeUp = (parent, color, t, o = {}) => {
    const g = K.X.svg('g', {}, parent);
    K.X.svg('path', { d: K.fieldD(o.seed || 7), fill: color }, g);
    K.X.tl.fromTo(g, { y: 1180 }, { y: 0, duration: o.dur || 0.7, ease: 'power2.inOut' }, t);
    return g;
  };
  K.card = (tIn, tOut, o = {}) => {
    const X = K.X, g = X.svg('g', {}, K.cards);
    gsap.set(g, { autoAlpha: 0 });
    X.tl.set(g, { autoAlpha: 1 }, tIn - 0.01);
    X.tl.set(g, { autoAlpha: 0 }, tOut + 0.5);
    const fieldD = K.fieldD(o.seed || 5);
    const inner = X.svg('g', {}, g);
    X.svg('path', { d: fieldD, fill: o.field || C.ultra }, inner);
    const sq = X.svg('path', { d: K.squiggleD(o.seed || 5, [60, 60, 1860, 1020], 8), fill: 'none', stroke: o.line || C.lilac, 'stroke-width': 5, 'stroke-linecap': 'round' }, inner);
    const num = K.text(inner, 960, 440, `-${o.n}-`, { size: 104, fill: o.num || o.text || C.white });
    const tt = K.text(inner, 960, 600, o.title || '', { size: o.size || 118, fill: o.text || C.white });
    X.tl.fromTo(inner, { y: 1180 }, { y: 0, duration: 0.7, ease: 'power2.inOut' }, tIn);
    X.drawOn(sq, tIn + 0.15, 1.2, 'power1.inOut');
    X.tl.fromTo([num, tt], { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out', stagger: 0.08 }, tIn + 0.45);
    X.tl.to(inner, { x: -2050, duration: 0.5, ease: 'power2.inOut' }, tOut);
    X.sfx(tIn, 'paper', { dur: 0.5, gain: 0.22 });
    X.sfx(tOut, 'slide', { dur: 0.45, gain: 0.14 });
    return g;
  };

  // ------------------------------------------------------------------ camera moves (sampled on twos via the master clock)
  /** make g a camera group (pivot = frame centre unless o.origin) */
  K.cam = (g, origin = '960 540') => { gsap.set(g, { svgOrigin: origin }); return g; };
  /** slow push on a hold: +rate per second (measured 0.7-1.2 %/s), sine in-out */
  K.drift = (g, t0, t1, o = {}) => {
    const s0 = o.from ?? 1, s1 = s0 + (o.rate ?? 0.01) * (t1 - t0);
    K.X.tl.fromTo(g, { scale: s0, x: 0, y: 0 }, { scale: s1, x: o.x || 0, y: o.y || 0, duration: t1 - t0, ease: 'sine.inOut', immediateRender: false }, t0);
  };
  /** camera travel to a new set on the same paper: gOut leaves, gIn arrives (dx,dy = travel), power2.inOut */
  K.travel = (gOut, gIn, t, dur = 1.0, dx = 1920, dy = 0) => {
    if (gOut) K.X.tl.fromTo(gOut, { x: 0, y: 0 }, { x: -dx, y: -dy, duration: dur, ease: 'power2.inOut', immediateRender: false }, t);
    if (gIn) K.X.tl.fromTo(gIn, { x: dx, y: dy }, { x: 0, y: 0, duration: dur, ease: 'power2.inOut' }, t);
  };

  // ------------------------------------------------------------------ opening sting (original): dot rows build, stack pushes up, zoom out, dots shrink away
  K.dotSting = (parent, t0, o = {}) => {
    const X = K.X, g = K.cam(X.svg('g', {}, parent));
    const cols = o.colors || [C.red, C.mustard, C.lilac, C.peri], per = o.per || 8, d = 240, rr = 100;
    const rows = [];
    cols.forEach((col, ri) => {
      const row = X.svg('g', {}, g), dots = [];
      for (let i = 0; i < per; i++) {
        const c = X.svg('circle', { cx: 120 + i * d, cy: 300 + ri * d, r: rr, fill: col }, row);
        gsap.set(c, { scale: 0, transformOrigin: '50% 50%' });
        X.tl.to(c, { scale: 1, duration: 0.3, ease: 'back.out(1.4)' }, t0 + ri * 0.42 + i * 0.045);
        dots.push(c);
      }
      rows.push({ row, dots });
    });
    X.tl.to(g, { y: -240, duration: 0.42, ease: 'power2.inOut' }, t0 + 1.26);
    X.tl.to(g, { scale: 0.52, duration: 0.8, ease: 'power2.inOut' }, t0 + 1.55);
    const all = rows.flatMap((r, ri) => r.dots.map((c, i) => ({ c, k: ri + i })));
    all.forEach(({ c, k }) => X.tl.to(c, { scale: 0, duration: 0.25, ease: 'power2.in' }, t0 + 2.1 + k * 0.03));
    return g;
  };

  // ------------------------------------------------------------------ release: objects become birds and fly off (gentle particle dissolve)
  K.release = (parent, items, t, o = {}) => {
    const X = K.X, r = X.rand(o.seed || 9);
    items.forEach((it, i) => {
      const ti = t + i * (o.stagger ?? 0.12);
      X.tl.to(it.el, { scale: 0, duration: 0.35, ease: 'power1.in', transformOrigin: '50% 50%' }, ti);
      const b = K.bird(parent, it.x, it.y, 0.6 + r() * 0.5);
      gsap.set(b, { opacity: 0 });
      X.tl.set(b, { opacity: 1 }, ti + 0.2);
      const dx = (o.dx ?? 520) + (r() - 0.3) * 400, dy = (o.dy ?? -700) - r() * 300;
      X.tl.to(b, { x: dx, y: dy, duration: o.dur || 2.6, ease: 'sine.in' }, ti + 0.2);
      X.tl.fromTo(b, { scaleY: 1 }, { scaleY: -0.4, duration: 0.25, ease: 'none', repeat: Math.floor((o.dur || 2.6) / 0.25), yoyo: true, transformOrigin: '50% 50%' }, ti + 0.2);
    });
  };
})();
