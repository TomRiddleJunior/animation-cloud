/* explainer-cleo-abram kit — the animated layer of an optimistic, fast-cut science/tech explainer:
 * ONE lime overlay system (flat chips with dark caps, thick bobbing arrows, white leader lines, lime data numbers),
 * pseudo-3D "renders" (gradient spheres, a glowing sun, a perspective space grid, a projected rotating solar sail,
 * a toy astronaut), a paper-collage mode (texture, boiling pencil, B&W cut-outs, page-peel wipe), magnifier
 * zoom-throughs, chevron flow rows and a colour-flip title sting. Original designs only.
 *
 * Load after /engine/lib/explainer.js:  <script src="kit.js"></script>   → window.K
 * Every per-frame function is a pure function of t (X.every); nothing reads the clock.
 *
 * Overlays   K.chip  K.chipIn  K.arrow  K.leader  K.label  K.display  K.slam  K.dataNumber  K.tag  K.measure  K.fadeOut
 * Renders    K.space  K.grid  K.sun  K.sphere  K.sail  K.astronaut  K.photons  K.chevrons  K.sparkle  K.paperclip  K.blob
 * Paper      K.paperBG  K.pencil  K.write  K.cutout  K.torn  K.pagePeel
 * Camera/fx  K.push  K.cut  K.magnifier  K.microWorld  K.titleSting  K.vignette  K.live
 */
(function () {
  const K = (window.K = {});
  const C = (K.C = {
    lime: '#C9F31D', ink: '#15191C', navy: '#0E1F2E', white: '#FFFFFF',
    space0: '#050B11', space1: '#0D2236', grid: '#245D8F', cool: '#52BCEA',
    studio: '#DADDE1', diagram: '#1D5CF0', paper: '#ECE4DC', pencil: '#555245', red: '#C8432F', lens: '#1E6AE8',
    orange: '#F07F2A',
  });
  let uid = 0;
  const id = (p = 'k') => `${p}${++uid}`;
  K.id = id;
  const clamp = (K.clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v)));
  const lerp = (K.lerp = (a, b, k) => a + (b - a) * k);
  const E = (K.E = {
    o2: gsap.parseEase('power2.out'), o3: gsap.parseEase('power3.out'), i2: gsap.parseEase('power2.in'),
    io: gsap.parseEase('sine.inOut'), io2: gsap.parseEase('power2.inOut'), back: gsap.parseEase('back.out(2)'), back14: gsap.parseEase('back.out(1.4)'),
  });
  const hex = (h) => { if (h[0] === 'r') return h.match(/\d+/g).slice(0, 3).map(Number); h = h.replace('#', ''); return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16)); };
  K.mix = (a, b, k) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * clamp(k))).join(',')})`; };
  /** X.every limited to a time window (saves work while a scene is hidden). */
  K.live = (t0, t1, fn) => X.every((t) => { if (t < t0 - 0.04 || t > t1 + 0.04) return; fn(t); });
  const at = (el, o) => { for (const k in o) el.setAttribute(k, o[k]); };
  K.at = at;
  const f2 = (v) => (+v).toFixed(2);

  // ======================================================================== camera & cuts
  /** Slow linear push on a camera group (X.cam) — every held shot keeps moving. */
  K.push = (cam, t0, t1, o = {}) => {
    X.tl.fromTo(cam, { scale: o.from ?? 1, x: o.x0 ?? 0, y: o.y0 ?? 0, rotation: o.r0 ?? 0 },
      { scale: o.to ?? 1.05, x: o.x1 ?? 0, y: o.y1 ?? 0, rotation: o.r1 ?? 0, duration: Math.max(0.05, t1 - t0), ease: o.ease || 'none', immediateRender: false }, t0);
  };
  /** Whoosh on a hard cut (call with the cut time). */
  K.cut = (t, o = {}) => X.sfx(Math.max(0, t - (o.lead ?? 0.12)), o.type || 'whoosh', { dur: o.dur ?? 0.38, gain: o.gain ?? 0.42, pitch: o.pitch ?? 1 });
  K.vignette = (parent, op = 0.45, color = '#000') =>
    X.svg('rect', { width: 1920, height: 1080, fill: X.radial(id('vig'), [[0.55, color, 0], [1, color, op]], 0.5, 0.5, 0.75), 'pointer-events': 'none' }, parent);

  // ======================================================================== overlay system (the single lime accent)
  /** Flat lime chip, square corners, dark heavy caps. y = vertical centre. h 85–107 primary, ~62 data. */
  K.chip = (parent, text, o = {}) => {
    const h = o.h ?? 96, fs = h * 0.62;
    const wrap = X.svg('g', {}, parent);
    const el = X.svg('g', {}, wrap);
    const rect = X.svg('rect', { height: h, fill: o.fill || C.lime }, el);
    const tx = X.svg('text', { 'font-family': 'Archivo Black', 'font-size': fs, fill: o.color || C.ink, x: h * 0.4, y: h / 2 + fs * 0.355, 'letter-spacing': '0.01em', text }, el);
    const w = Math.ceil(tx.getComputedTextLength() + h * 0.8);
    rect.setAttribute('width', w);
    const x = (o.x ?? 0) + (o.anchor === 'middle' ? -w / 2 : o.anchor === 'end' ? -w : 0), y = (o.y ?? 0) - h / 2;
    wrap.setAttribute('transform', `translate(${f2(x)},${f2(y)})`);
    gsap.set(el, { autoAlpha: 0, svgOrigin: `${w / 2} ${h / 2}` });
    const c = { wrap, el, w, h, x, y, cx: x + w / 2, cy: y + h / 2 };
    if (o.t != null) K.chipIn(c, o.t, o);
    if (o.out != null) K.fadeOut(el, o.out);
    return c;
  };
  /** Chip entry: a hard pop (mode 'cut', 1 frame) or 0.86→1 in 5 frames with overshoot. */
  K.chipIn = (c, t, o = {}) => {
    if (o.mode === 'cut') X.tl.set(c.el, { autoAlpha: 1 }, t);
    else X.tl.fromTo(c.el, { autoAlpha: 0, scale: 0.86 }, { autoAlpha: 1, scale: 1, duration: 0.17, ease: 'back.out(2.2)', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'pop', { gain: o.gain ?? 0.3, pitch: o.pitch ?? 1.3 });
  };
  K.fadeOut = (el, t, dur = 0.2) => X.tl.to(el, { autoAlpha: 0, duration: dur, ease: 'power1.out' }, t);
  /** Thick filled arrow; tip at (x,y), pointing along `angle` (deg, 0 = right). Slides 30 px in (4 f), then bobs ±8 px / 0.55 s. */
  K.arrow = (parent, o) => {
    const len = o.len ?? 120, s = o.shaft ?? 20, hw = s * 2.2, hl = hw * 0.9;
    const wrap = X.svg('g', { transform: `translate(${o.x},${o.y}) rotate(${o.angle ?? 0})` }, parent);
    const el = X.svg('g', { visibility: 'hidden' }, wrap);
    if (o.shadow !== false) X.svg('path', { d: arrowD(len, s, hw, hl), fill: '#000', opacity: 0.28, transform: 'translate(3,4)' }, el);
    X.svg('path', { d: arrowD(len, s, hw, hl), fill: o.color || C.lime }, el);
    const t0 = o.t, t1 = o.out ?? 1e9, slide = o.slide ?? 30, bob = o.bob ?? 8, per = o.period ?? 0.55;
    X.every((t) => {
      if (t < t0 || t >= t1) { el.setAttribute('visibility', 'hidden'); return; }
      const k = clamp((t - t0) / 0.13);
      const off = -slide * (1 - E.o3(k)) + (t > t0 + 0.13 ? bob * Math.sin((2 * Math.PI * (t - t0 - 0.13)) / per) : 0);
      at(el, { visibility: 'visible', transform: `translate(${f2(off)},0)`, opacity: f2(clamp((t - t0) / 0.07)) });
    });
    if (o.sfx !== false) X.sfx(t0, o.sfx || 'swoosh', { dur: 0.2, gain: o.gain ?? 0.2, pitch: 1.5 });
    return { wrap, el };
  };
  const arrowD = (len, s, hw, hl) => `M0,0 L${-hl},${-hw / 2} L${-hl},${-s / 2} L${-len},${-s / 2} L${-len},${s / 2} L${-hl},${s / 2} L${-hl},${hw / 2} Z`;
  /** White (or lime) leader line from an object point to a label; a dot pops on the object, the line draws on. */
  K.leader = (parent, o) => {
    const g = X.svg('g', {}, parent);
    const line = X.svg('line', { x1: o.from[0], y1: o.from[1], x2: o.to[0], y2: o.to[1], stroke: o.color || '#fff', 'stroke-width': o.w ?? 3, 'stroke-linecap': 'round' }, g);
    const dot = X.svg('circle', { cx: o.from[0], cy: o.from[1], r: o.r ?? 8, fill: o.dot || o.color || '#fff' }, g);
    X.pop(dot, o.t, { sfx: false, dur: 0.18, ease: 'back.out(3)' });
    X.drawOn(line, o.t + 0.03, o.dur ?? 0.24, 'power2.out');
    if (o.out != null) K.fadeOut(g, o.out);
    return g;
  };
  /** Leader + chip: the label lands when the line arrives (on the spoken noun). */
  K.label = (parent, o) => {
    const h = o.h ?? 90;
    K.leader(parent, { from: o.at, to: o.end || o.chip, t: o.t - 0.24, color: o.color, out: o.out, dot: o.dot });
    return K.chip(parent, o.text, { x: o.chip[0], y: o.chip[1], h, anchor: o.anchor, t: o.t, out: o.out, sfx: o.sfx });
  };
  /** Chunky lime display word with a stacked dark extrusion and ink outline (chapter cards, kinetic words, numbers). */
  K.display = (parent, text, o = {}) => {
    const size = o.size ?? 140, ext = o.extrude ?? 10;
    const wrap = X.svg('g', { transform: `translate(${o.x ?? 960},${o.y ?? 540}) rotate(${o.rot ?? 0})` }, parent);
    const el = X.svg('g', {}, wrap);
    const a = { 'font-family': o.font || 'Archivo Black', 'font-size': size, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls ?? '-0.01em' };
    for (let i = ext; i >= 1; i--) X.svg('text', { ...a, x: i * 0.75, y: i, fill: o.extrudeColor || C.navy, stroke: o.extrudeColor || C.navy, 'stroke-width': (o.sw ?? 5) + 2, 'stroke-linejoin': 'round', text }, el);
    const face = X.svg('text', { ...a, x: 0, y: 0, fill: o.fill || C.lime, stroke: o.stroke || C.ink, 'stroke-width': o.sw ?? 5, 'paint-order': 'stroke', 'stroke-linejoin': 'round', text }, el);
    gsap.set(el, { autoAlpha: 0, svgOrigin: `0 ${-size * 0.36}` });
    const d = { wrap, el, face };
    if (o.t != null) K.slam(el, o.t, o);
    if (o.out != null) K.fadeOut(el, o.out, 0.15);
    return d;
  };
  /** Display-word entry: 120 % → 100 % with back.out(3) in 8 frames. */
  K.slam = (el, t, o = {}) => {
    X.tl.fromTo(el, { autoAlpha: 0, scale: o.from ?? 1.25 }, { autoAlpha: 1, scale: 1, duration: 0.27, ease: 'back.out(3)', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'stamp', { gain: o.gain ?? 0.38 });
  };
  /** Lime data number (display face) + small white unit/sub line — sits in the lower third. */
  K.dataNumber = (parent, big, sub, o = {}) => {
    const g = X.svg('g', {}, parent);
    const d = K.display(g, big, { x: o.x ?? 960, y: o.y ?? 720, size: o.size ?? 130, extrude: o.extrude ?? 8, anchor: o.anchor, t: o.t, sfx: o.sfx ?? 'impact', gain: o.gain ?? 0.34 });
    if (sub) {
      const s = X.svg('text', { x: o.x ?? 960, y: (o.y ?? 720) + (o.subDy ?? 52), 'text-anchor': o.anchor || 'middle', 'font-family': 'Inter', 'font-weight': 700, 'font-size': o.subSize ?? 30, 'letter-spacing': '0.1em', fill: '#fff', text: sub }, g);
      gsap.set(s, { autoAlpha: 0 });
      X.tl.fromTo(s, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.2, immediateRender: false }, (o.t ?? 0) + 0.12);
      if (o.out != null) K.fadeOut(s, o.out, 0.15);
    }
    if (o.out != null) K.fadeOut(d.el, o.out, 0.15);
    return { g, d };
  };
  /** Count a K.display / dataNumber face (and its extrusion copies) from → to. */
  K.countDisplay = (d, from, to, t, dur = 1.2, fmt = (v) => Math.round(v).toLocaleString('en-US'), ease = 'power2.in') => {
    const texts = [...d.el.querySelectorAll('text')], o = { v: from };
    texts.forEach((tx) => (tx.textContent = fmt(from)));
    X.tl.fromTo(o, { v: from }, { v: to, duration: dur, ease, immediateRender: false, onUpdate: () => texts.forEach((tx) => (tx.textContent = fmt(o.v))) }, t);
  };
  /** Small corner tag (e.g. NOT TO SCALE, PAUSED, LOG SCALE): ~20 px caps with a lime square bullet. */
  K.tag = (parent, text, o = {}) => {
    const g = X.svg('g', { transform: `translate(${o.x ?? 96},${o.y ?? 92})` }, parent);
    X.svg('rect', { x: 0, y: -15, width: 14, height: 14, fill: C.lime }, g);
    X.svg('text', { x: 24, y: 0, 'font-family': 'Inter', 'font-weight': 800, 'font-size': o.size ?? 21, 'letter-spacing': '0.14em', fill: o.color || '#fff', opacity: 0.85, text }, g);
    if (o.t != null) { gsap.set(g, { autoAlpha: 0 }); X.tl.set(g, { autoAlpha: 1 }, o.t); }
    return g;
  };
  /** Double-headed white measuring arrow with a lime number above it. */
  K.measure = (parent, o) => {
    const g = X.svg('g', {}, parent), y = o.y, x0 = o.x0, x1 = o.x1, hh = 14;
    const line = X.svg('path', { d: `M${x0},${y} L${x1},${y} M${x0 + hh},${y - hh} L${x0},${y} L${x0 + hh},${y + hh} M${x1 - hh},${y - hh} L${x1},${y} L${x1 - hh},${y + hh}`, stroke: '#fff', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    X.drawOn(line, o.t, 0.3, 'power2.out');
    if (o.label) K.display(g, o.label, { x: (x0 + x1) / 2, y: y - 26, size: o.size ?? 64, extrude: 5, sw: 3, t: o.t + 0.2, sfx: 'pop' });
    return g;
  };

  // ======================================================================== render-mode plates
  /** Deep-space plate: gradient, nebula haze, seeded twinkling stars, optional perspective grid floor. */
  K.space = (parent, o = {}) => {
    const g = X.svg('g', {}, parent);
    X.svg('rect', { x: -400, y: -300, width: 2720, height: 1680, fill: X.linear(id('sp'), [[0, o.top || C.space0], [0.55, o.mid || '#091726'], [1, o.bottom || C.space1]]) }, g);
    const r = X.rand(o.seed ?? 5);
    for (const [cx, cy, rx, col, op] of o.nebula ?? [[1500, 260, 700, '#3B2A7A', 0.28], [380, 820, 640, '#0E4C7A', 0.3]])
      X.svg('ellipse', { cx, cy, rx, ry: rx * 0.55, fill: X.radial(id('neb'), [[0, col, op], [1, col, 0]]) }, g);
    const tw = [], all = [], hz = o.grid ? (o.horizon ?? 640) : 1380;
    for (let i = 0; i < (o.stars ?? 190); i++) {
      const big = r() < 0.07, x0 = -300 + r() * 2520, depth = 0.4 + r() * 0.6;
      const c = X.svg('circle', { cx: x0, cy: -200 + r() * (hz + 200), r: big ? 2.3 : 0.7 + r() * 1.2, fill: r() < 0.15 ? '#CFE6FF' : '#fff', opacity: 0.25 + r() * 0.65 }, g);
      all.push([c, x0, depth]);
      if (r() < 0.35) tw.push([c, +c.getAttribute('opacity'), r() * 6.3, 1.5 + r() * 3]);
    }
    const win = o.win || [0, 1e9];
    K.live(win[0], win[1], (t) => {
      tw.forEach(([c, b, ph, sp]) => c.setAttribute('opacity', f2(b * (0.55 + 0.45 * Math.sin(ph + t * sp)))));
      if (o.drift) { const dx = o.drift(t); all.forEach(([c, x0, dp]) => c.setAttribute('cx', f2((((x0 + 300 - dx * dp) % 2520) + 2520) % 2520 - 300))); }
    });
    if (o.grid) K.grid(g, o);
    return g;
  };
  /** Perspective grid floor receding to a horizon ("spacetime plane"). scrollZ(t)/scrollX(t) move it (forward / lateral truck). */
  K.grid = (parent, o = {}) => {
    const hz = o.horizon ?? 640, vx = o.vx ?? 960, A = (1080 - hz) * 0.9, B = o.B ?? 330;
    const mid = id('gm'), m = X.svg('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -400, y: 0, width: 2720, height: 1500 }, X.defs);
    X.svg('rect', { x: -400, y: hz - 2, width: 2720, height: 1500, fill: X.linear(id('gmg'), [[0, '#fff', 0], [0.05, '#fff', 0.35], [0.35, '#fff', 0.9], [1, '#fff', 1]]) }, m);
    const g = X.svg('g', { mask: `url(#${mid})` }, parent);
    if (o.floor !== false) X.svg('rect', { x: -400, y: hz, width: 2720, height: 1200, fill: X.linear(id('gfl'), [[0, o.floorTop || '#0E2C48', 0.9], [1, o.floorBottom || '#081420', 0.6]]) }, g);
    X.svg('line', { x1: -400, y1: hz, x2: 2320, y2: hz, stroke: o.horizonColor || '#4C8FD0', 'stroke-width': 2, opacity: 0.8 }, g);
    const col = o.color || C.grid, nH = 30, nV = 49, dz = 0.42, dx = 0.5;
    g.setAttribute('opacity', o.gridOp ?? 1);
    const hl = Array.from({ length: nH }, () => X.svg('line', { x1: -400, x2: 2320, stroke: col }, g));
    const vl = Array.from({ length: nV }, () => X.svg('line', { stroke: col, 'stroke-width': 1.6 }, g));
    const sZ = o.scrollZ || (() => 0), sX = o.scrollX || (() => 0), win = o.win || [0, 1e9];
    const draw = (t) => {
      const z0 = ((sZ(t) % dz) + dz) % dz, x0 = ((sX(t) % dx) + dx) % dx;
      hl.forEach((l, k) => { const Z = 0.55 + k * dz - z0, y = hz + A / Z; at(l, { y1: f2(y), y2: f2(y), 'stroke-width': f2(clamp(2.6 / Z, 0.5, 2.6)) }); });
      vl.forEach((l, k) => { const Xw = (k - (nV - 1) / 2) * dx - x0; at(l, { x1: f2(vx + (B * Xw) / 0.45), y1: f2(hz + A / 0.45), x2: f2(vx + (B * Xw) / 60), y2: f2(hz + A / 60) }); });
    };
    draw(win[0]);
    K.live(win[0], win[1], draw);
    return g;
  };
  /** Glowing star: halo + bloom + gradient body + scrolling granulation + limb darkening + flicker. */
  K.sun = (parent, o = {}) => {
    const cx = o.cx ?? 960, cy = o.cy ?? 540, r = o.r ?? 200, g = X.svg('g', {}, parent);
    const halo = X.svg('circle', { cx, cy, r: r * (o.halo ?? 2.6), fill: X.radial(id('halo'), [[0, '#FFB347', 0.5], [0.4, '#F27A1A', 0.18], [1, '#F27A1A', 0]]) }, g);
    const glow = X.svg('circle', { cx, cy, r: r * 1.32, fill: X.radial(id('glow'), [[0.7, '#FFE6A0', 0.95], [0.8, '#FFB02E', 0.55], [1, '#FF8A1F', 0]]) }, g);
    X.svg('circle', { cx, cy, r, fill: X.radial(id('sunb'), [[0, '#FFF9DC'], [0.45, '#FFD65E'], [0.78, '#F7A024'], [0.94, '#E76A1A'], [1, '#C2461A']]) }, g);
    if (o.texture !== false) {
      const cid = id('sunc'), cp = X.svg('clipPath', { id: cid }, X.defs);
      X.svg('circle', { cx, cy, r }, cp);
      const tg = X.svg('g', { 'clip-path': `url(#${cid})` }, g);
      const fid = id('gran'), f = X.svg('filter', { id: fid, x: 0, y: 0, width: 1, height: 1 }, X.defs);
      X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: o.freq ?? clamp(5.5 / r, 0.006, 0.05), numOctaves: 3, seed: o.seed ?? 3, result: 'n' }, f);
      X.svg('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 0.62  0 0 0 0 0.16  0 0 0 0 0.02  -3.2 0 0 0 1.6' }, f);
      const big = r * 2.6;
      const layA = X.svg('rect', { x: cx - big / 2, y: cy - big / 2, width: big, height: big, filter: `url(#${fid})`, opacity: o.texOp ?? 0.5 }, tg);
      const layB = X.svg('rect', { x: cx - big / 2, y: cy - big / 2, width: big, height: big, filter: `url(#${fid})`, opacity: (o.texOp ?? 0.5) * 0.6, transform: 'rotate(90)' }, tg);
      const win = o.win || [0, 1e9], sp = o.churn ?? r * 0.02;
      K.live(win[0], win[1], (t) => {
        layA.setAttribute('transform', `translate(${f2(Math.sin(t * 0.21) * r * 0.25 + t * sp)},${f2(Math.cos(t * 0.17) * r * 0.2)})`);
        layB.setAttribute('transform', `rotate(90 ${cx} ${cy}) translate(${f2(-t * sp * 0.8)},${f2(Math.sin(t * 0.23) * r * 0.2)})`);
      });
      X.svg('circle', { cx, cy, r, fill: X.radial(id('limb'), [[0.62, '#7A1E05', 0], [0.9, '#9C2E08', 0.32], [1, '#6E1804', 0.6]]) }, g);
    }
    const win = o.win || [0, 1e9];
    K.live(win[0], win[1], (t) => {
      const fl = 0.9 + 0.06 * Math.sin(t * 7.3) * Math.sin(t * 3.1) + 0.04 * Math.sin(t * 13.7);
      glow.setAttribute('opacity', f2(fl)); halo.setAttribute('opacity', f2((o.haloOp ?? 1) * (0.92 + 0.08 * Math.sin(t * 2.3))));
    });
    return { g, glow, halo };
  };
  /** Gradient-shaded planet: off-centre highlight, terminator, rim light, atmosphere, optional scrolling surface (fake spin). */
  K.sphere = (parent, o) => {
    const { cx, cy, r } = o, g = X.svg('g', {}, parent);
    const lx = o.light?.[0] ?? -0.55, ly = o.light?.[1] ?? -0.4;
    if (o.atmo) X.svg('circle', { cx, cy, r: r * (o.atmoR ?? 1.13), fill: X.radial(id('atm'), [[0.84, o.atmo, o.atmoOp ?? 0.6], [1, o.atmo, 0]]) }, g);
    const gid = id('sph'), gr = X.svg('radialGradient', { id: gid, cx: 0.5 + lx * 0.22, cy: 0.5 + ly * 0.22, r: 0.78, fx: 0.5 + lx * 0.42, fy: 0.5 + ly * 0.42 }, X.defs);
    [[0, o.hi || '#FFFFFF'], [0.28, o.base || '#3F7FD8'], [1, o.dark || '#0A1630']].forEach(([of, c]) => X.svg('stop', { offset: of, 'stop-color': c }, gr));
    X.svg('circle', { cx, cy, r, fill: `url(#${gid})` }, g);
    let surf = null;
    if (o.surface) {
      const cid = id('sphc'), cp = X.svg('clipPath', { id: cid }, X.defs);
      X.svg('circle', { cx, cy, r }, cp);
      const cg = X.svg('g', { 'clip-path': `url(#${cid})` }, g);
      surf = X.svg('g', {}, cg);
      o.surface(surf, cx, cy, r);
      if (o.spin) { const win = o.win || [0, 1e9]; K.live(win[0], win[1], (t) => surf.setAttribute('transform', `translate(${f2(-((t * o.spin) % (o.period ?? 4 * r)))},0)`)); }
    }
    const tid = id('term'), tg = X.svg('linearGradient', { id: tid, x1: 0.5 + lx * 0.5, y1: 0.5 + ly * 0.5, x2: 0.5 - lx * 0.5, y2: 0.5 - ly * 0.5 }, X.defs);
    [[0, '#000', 0], [o.termStart ?? 0.45, '#000', 0], [0.78, o.night || '#020611', 0.62], [1, o.night || '#020611', 0.88]].forEach(([of, c, a]) => X.svg('stop', { offset: of, 'stop-color': c, 'stop-opacity': a }, tg));
    X.svg('circle', { cx, cy, r, fill: `url(#${tid})` }, g);
    const rid = id('rim'), rg = X.svg('linearGradient', { id: rid, x1: 0.5 + lx * 0.5, y1: 0.5 + ly * 0.5, x2: 0.5, y2: 0.5 }, X.defs);
    [[0, o.rim || '#FFFFFF', 0.85], [1, o.rim || '#FFFFFF', 0]].forEach(([of, c, a]) => X.svg('stop', { offset: of, 'stop-color': c, 'stop-opacity': a }, rg));
    X.svg('circle', { cx, cy, r: r - 1.5, fill: 'none', stroke: `url(#${rid})`, 'stroke-width': clamp(r * 0.025, 2, 7) }, g);
    return { g, surf };
  };
  /** Smooth random blob path (continents, clouds, rocks). */
  K.blob = (cx, cy, r, seed = 1, n = 9, jag = 0.35, sx = 1, sy = 1) => {
    const rr = X.rand(seed), pts = [];
    for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2, k = 1 - jag / 2 + rr() * jag; pts.push([cx + Math.cos(a) * r * k * sx, cy + Math.sin(a) * r * k * sy]); }
    let d = '';
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      if (!i) d += `M${f2(p1[0])},${f2(p1[1])}`;
      d += `C${f2(p1[0] + (p2[0] - p0[0]) / 6)},${f2(p1[1] + (p2[1] - p0[1]) / 6)} ${f2(p2[0] - (p3[0] - p1[0]) / 6)},${f2(p2[1] - (p3[1] - p1[1]) / 6)} ${f2(p2[0])},${f2(p2[1])}`;
    }
    return d + 'Z';
  };
  /** Earth surface painter for K.sphere({surface}) — ocean + seeded continents + clouds, in a strip 4r wide that repeats. */
  K.earthSurface = (seed = 11, o = {}) => (g, cx, cy, r) => {
    const rr = X.rand(seed), W = 4 * r, ls = o.land ?? 1;
    const land = [];
    for (let c = 0; c < (o.continents ?? 5); c++) {
      const ccx = rr() * W, ccy = cy - r * 0.75 + rr() * 1.5 * r, col = ['#3F8A4C', '#5E9446', '#4C7F3E', '#B9A26A'][Math.floor(rr() * 4)];
      for (let k = 0; k < 7; k++) land.push([ccx + (rr() - 0.5) * r * 0.55 * ls, ccy + (rr() - 0.5) * r * 0.4 * ls, r * (0.05 + rr() * 0.1) * ls, seed + c * 13 + k, k === 6 ? '#C2AE74' : col]);
    }
    const cloud = Array.from({ length: o.clouds ?? 26 }, (_, i) => [rr() * W, cy - r + rr() * 2 * r, r * (0.05 + rr() * 0.09), seed + 90 + i, (rr() - 0.5) * 30, 0.35 + rr() * 0.4]);
    for (let rep = -1; rep < 3; rep++) {
      const ox = cx - r + rep * W, lg = X.svg('g', {}, g);
      land.forEach(([x, y, rad, sd, col]) => X.svg('path', { d: K.blob(ox + x, y, rad, sd, 10, 0.7, 1.5, 1), fill: col }, lg));
      cloud.forEach(([x, y, rad, sd, rot, op]) => X.svg('path', { d: K.blob(ox + x, y, rad, sd, 9, 0.6, 3.2, 0.42), fill: '#fff', opacity: op, transform: `rotate(${rot.toFixed(1)} ${(ox + x).toFixed(1)} ${y.toFixed(1)})` }, g));
    }
  };

  // ------------------------------------------------------------------------ projected rotating solar sail (fake 3D)
  const v3 = {
    rx: (p, a) => [p[0], p[1] * Math.cos(a) - p[2] * Math.sin(a), p[1] * Math.sin(a) + p[2] * Math.cos(a)],
    ry: (p, a) => [p[0] * Math.cos(a) + p[2] * Math.sin(a), p[1], -p[0] * Math.sin(a) + p[2] * Math.cos(a)],
    rz: (p, a) => [p[0] * Math.cos(a) - p[1] * Math.sin(a), p[0] * Math.sin(a) + p[1] * Math.cos(a), p[2]],
    sub: (a, b) => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
    cross: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
    dot: (a, b) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
    norm: (a) => { const l = Math.hypot(a[0], a[1], a[2]) || 1; return [a[0] / l, a[1] / l, a[2] / l]; },
  };
  K.v3 = v3;
  /** Square, spin-deployed solar sail (four billowed mirror petals, thin-film panels, tip masses, gold hub), projected
   * every frame. pose(t) → {cx, cy, scale, spin, tilt, yaw, unfurl(0..1)}  (radians). size = hub-to-corner px. */
  K.sail = (parent, o) => {
    const g = X.svg('g', {}, parent), S = o.size ?? 300, bil = o.billow ?? 0.2, hubR = S * 0.06, hubH = S * 0.045;
    const L = v3.norm(o.light || [-0.75, -0.35, 0.55]), H = v3.norm([L[0], L[1], L[2] + 1]);
    const petals = [0, 1, 2, 3].map((i) => {
      const pg = X.svg('g', {}, g);
      const sid = id('sheen'), sg = X.svg('linearGradient', { id: sid, gradientUnits: 'userSpaceOnUse' }, X.defs);
      const stops = [0, 1, 2].map(() => X.svg('stop', { 'stop-color': '#fff' }, sg));
      return {
        i, pg, sg, stops,
        poly: X.svg('polygon', { 'stroke-linejoin': 'round' }, pg),
        sheen: X.svg('polygon', { fill: `url(#${sid})` }, pg),
        panel: X.svg('polygon', { 'stroke-width': 1 }, pg),
        panel2: X.svg('polygon', {}, pg),
        edge: X.svg('polyline', { fill: 'none', stroke: '#F4F8FB', 'stroke-width': 1.6, 'stroke-linejoin': 'round' }, pg),
      };
    });
    const hubG = X.svg('g', {}, g);
    const hubSide = X.svg('polygon', { fill: '#9C6B1C' }, hubG), hubBack = X.svg('polygon', { fill: '#7A5214' }, hubG);
    const hubFront = X.svg('polygon', { fill: X.linear(id('hubg'), [[0, '#FFE7A3'], [0.5, '#E3AE45'], [1, '#A8741F']], 0, 0, 1, 1) }, hubG);
    const hubRing = X.svg('polygon', { fill: 'none', stroke: '#5E3D0E', 'stroke-width': 2 }, hubG);
    const tips = [0, 1, 2, 3].map(() => X.svg('circle', { fill: X.radial(id('tipg'), [[0, '#BFC7CF'], [1, '#3A424B']], 0.35, 0.35, 0.7) }, g));
    const glint = K.sparkle(g, { r: S * 0.16, fill: '#fff' });
    const win = o.win || [0, 1e9];
    const draw = (t) => {
      const P = o.pose(t), u = P.unfurl ?? 1, f = o.persp ?? 2600, sc = P.scale ?? 1;
      const T = (p) => { let q = v3.rz(p, P.spin ?? 0); q = v3.rx(q, P.tilt ?? 0); q = v3.ry(q, P.yaw ?? 0); return q; };
      const pr = (q) => { const k = f / (f - q[2]); return [P.cx + q[0] * k * sc, P.cy + q[1] * k * sc]; };
      const cs = [0, 1, 2, 3].map((i) => { const a = (i * Math.PI) / 2; return [Math.cos(a) * S * u, Math.sin(a) * S * u, bil * S * u * u]; });
      const hubPt = (a, z) => [Math.cos(a) * hubR, Math.sin(a) * hubR, z];
      const nPlane = v3.norm(T([0, 0, 1]));
      const front = nPlane[2] >= 0;
      let best = null;
      const order = petals.map((p) => {
        const i = p.i, c0 = cs[i], c1 = cs[(i + 1) % 4], a0 = (i * Math.PI) / 2, a1 = a0 + Math.PI / 2;
        const W = [hubPt(a0, 0), c0, c1, hubPt(a1, 0)].map(T);
        let n = v3.norm(v3.cross(T(c0), T(c1)));
        const back = n[2] < 0; if (back) n = n.map((v) => -v);
        const lam = Math.abs(v3.dot(n, L)), spec = Math.pow(Math.max(0, v3.dot(n, H)), 28);
        const sp = W.map(pr);
        p.poly.setAttribute('points', sp.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
        p.poly.setAttribute('fill', back ? K.mix('#4A3E2A', '#C9B184', 0.2 + 0.7 * lam) : K.mix(K.mix('#4F607A', '#F4F7FA', 0.12 + 0.78 * lam), '#FFFFFF', spec * 0.8));
        p.sheen.setAttribute('points', p.poly.getAttribute('points'));
        const mid = pr(T([(c0[0] + c1[0]) / 2, (c0[1] + c1[1]) / 2, (c0[2] + c1[2]) / 2])), hub = pr(T([0, 0, 0]));
        at(p.sg, { x1: f2(hub[0]), y1: f2(hub[1]), x2: f2(mid[0]), y2: f2(mid[1]) });
        const band = (((P.spin ?? 0) / Math.PI + i * 0.27 + t * 0.05) % 1 + 1) % 1;
        at(p.stops[0], { offset: 0, 'stop-opacity': 0 });
        at(p.stops[1], { offset: f2(0.15 + band * 0.7), 'stop-opacity': f2(clamp(0.2 + spec * 0.9, 0, 0.8)) });
        at(p.stops[2], { offset: 1, 'stop-opacity': 0 });
        const pq = (a, s) => pr(T([a * lerp(c0[0], c1[0], s), a * lerp(c0[1], c1[1], s), a * lerp(c0[2], c1[2], s)]));
        const pan = [pq(0.8, 0.12), pq(0.9, 0.12), pq(0.9, 0.88), pq(0.8, 0.88)], pan2 = [pq(0.24, 0.42), pq(0.38, 0.42), pq(0.38, 0.58), pq(0.24, 0.58)];
        p.panel.setAttribute('points', pan.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
        p.panel.setAttribute('fill', back ? '#5A4A2C' : K.mix('#1B2C48', '#6F93C4', 0.15 + 0.55 * lam + spec));
        p.panel.setAttribute('stroke', back ? '#6B5732' : '#8FB0D8');
        p.panel2.setAttribute('points', pan2.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
        p.panel2.setAttribute('fill', back ? '#6A5834' : K.mix('#33465F', '#9DB4D2', 0.2 + 0.5 * lam));
        p.edge.setAttribute('points', [sp[1], sp[2]].map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
        p.edge.setAttribute('opacity', f2(0.35 + 0.5 * lam));
        p.panel.setAttribute('visibility', u > 0.5 ? 'visible' : 'hidden'); p.panel2.setAttribute('visibility', u > 0.5 ? 'visible' : 'hidden');
        const zc = (W[1][2] + W[2][2]) / 2;
        if (!back && (!best || spec > best.spec)) best = { spec, at: pr(T([(c0[0] + c1[0]) * 0.33, (c0[1] + c1[1]) * 0.33, (c0[2] + c1[2]) * 0.33])) };
        return { p, z: zc };
      });
      order.sort((a, b) => a.z - b.z).forEach((o2) => g.insertBefore(o2.p.pg, hubG));
      cs.forEach((c, i) => { const q = pr(T(c)); at(tips[i], { cx: f2(q[0]), cy: f2(q[1]), r: f2(S * 0.03 * sc + 1) }); });
      const zf = front ? hubH : -hubH;
      const ring = (z) => Array.from({ length: 20 }, (_, k) => pr(T(hubPt((k / 20) * Math.PI * 2, z))));
      const rb = ring(0), rf = ring(zf), all = rb.concat(rf);
      hubSide.setAttribute('points', hull(all).map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
      hubBack.setAttribute('points', rb.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
      hubFront.setAttribute('points', rf.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
      hubRing.setAttribute('points', rf.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' '));
      if (front) g.appendChild(hubG); else g.insertBefore(hubG, g.firstChild);
      tips.forEach((tp) => g.appendChild(tp));
      g.appendChild(glint.g);
      if (best && o.glint !== false) {
        const s = clamp((best.spec - 0.25) * 1.6) * (o.glintGain ?? 1);
        at(glint.g, { transform: `translate(${f2(best.at[0])},${f2(best.at[1])}) rotate(${f2(t * 40)}) scale(${f2(0.2 + s)})`, opacity: f2(s) });
      } else glint.g.setAttribute('opacity', 0);
    };
    draw(win[0]);
    K.live(win[0], win[1], draw);
    return { g };
  };
  function hull(pts) {
    const p = pts.slice().sort((a, b) => a[0] - b[0] || a[1] - b[1]);
    const cr = (o, a, b) => (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
    const lo = [], up = [];
    for (const q of p) { while (lo.length >= 2 && cr(lo[lo.length - 2], lo[lo.length - 1], q) <= 0) lo.pop(); lo.push(q); }
    for (const q of p.reverse()) { while (up.length >= 2 && cr(up[up.length - 2], up[up.length - 1], q) <= 0) up.pop(); up.push(q); }
    return lo.slice(0, -1).concat(up.slice(0, -1));
  }
  /** Four-point sparkle (glints, title-sting glyph field). */
  K.sparklePath = (r, k = 0.16) => `M0,${-r} Q${r * k},${-r * k} ${r},0 Q${r * k},${r * k} 0,${r} Q${-r * k},${r * k} ${-r},0 Q${-r * k},${-r * k} 0,${-r}Z`;
  K.sparkle = (parent, o = {}) => {
    const g = X.svg('g', { opacity: o.op ?? 1 }, parent);
    if (o.glow !== false) X.svg('circle', { r: (o.r ?? 30) * 0.55, fill: X.radial(id('spg'), [[0, o.fill || '#fff', 0.8], [1, o.fill || '#fff', 0]]) }, g);
    X.svg('path', { d: K.sparklePath(o.r ?? 30, o.k), fill: o.fill || '#fff' }, g);
    return { g };
  };
  /** Toy-3D astronaut (~3 heads tall): white suit, orange accents, big helmet, dark visor with reflections. Idle float. */
  K.astronaut = (parent, o = {}) => {
    const wrap = X.svg('g', {}, parent), g = X.svg('g', {}, wrap), A = o.accent || C.orange;
    const suit = (gid) => { const gr = X.svg('radialGradient', { id: gid, cx: 0.38, cy: 0.32, r: 0.8, fx: 0.32, fy: 0.25 }, X.defs); [[0, '#FFFFFF'], [0.55, '#E4E9EE'], [1, '#9FAAB6']].forEach(([of, c]) => X.svg('stop', { offset: of, 'stop-color': c }, gr)); return `url(#${gid})`; };
    const accentF = X.radial(id('acc'), [[0, '#FFB06A'], [1, '#C2551A']], 0.35, 0.35, 0.75);
    const cap = (x1, y1, x2, y2, w, fill) => { const L = Math.hypot(x2 - x1, y2 - y1), a = (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI; return X.svg('rect', { x: -w / 2, y: -w / 2, width: L + w, height: w, rx: w / 2, fill, transform: `translate(${x1},${y1}) rotate(${a})` }, g); };
    X.svg('rect', { x: -74, y: 18, width: 118, height: 132, rx: 24, fill: X.linear(id('pack'), [[0, '#D3DAE0'], [1, '#7D8893']], 0, 0, 1, 1) }, g);
    cap(-48, 62, -88, 118, 40, suit(id('su'))); cap(-88, 118, -96, 160, 36, suit(id('su')));
    X.svg('circle', { cx: -97, cy: 166, r: 21, fill: accentF }, g);
    cap(-24, 150, -40, 236, 46, suit(id('su'))); X.svg('rect', { x: -66, y: 226, width: 54, height: 34, rx: 14, fill: X.linear(id('boot'), [[0, '#A4AEB8'], [1, '#56606A']]) }, g);
    cap(26, 150, 44, 228, 46, suit(id('su'))); X.svg('rect', { x: 20, y: 220, width: 54, height: 34, rx: 14, fill: X.linear(id('boot'), [[0, '#A4AEB8'], [1, '#56606A']]) }, g);
    X.svg('path', { d: 'M-58,52 Q-62,38 -44,34 L44,34 Q62,38 58,52 L54,150 Q52,168 34,168 L-34,168 Q-52,168 -54,150 Z', fill: suit(id('su')) }, g);
    X.svg('rect', { x: -56, y: 138, width: 110, height: 13, fill: A, opacity: 0.95 }, g);
    X.svg('rect', { x: -27, y: 70, width: 54, height: 42, rx: 8, fill: '#26313D' }, g);
    X.svg('circle', { cx: -12, cy: 84, r: 6, fill: A }, g); X.svg('circle', { cx: 6, cy: 84, r: 6, fill: '#52BCEA' }, g);
    X.svg('rect', { x: -15, y: 97, width: 30, height: 6, rx: 3, fill: '#8A97A5' }, g);
    X.svg('ellipse', { cx: 0, cy: 38, rx: 46, ry: 13, fill: '#A9B4BF' }, g);
    X.svg('circle', { cx: 0, cy: -10, r: 64, fill: suit(id('su')) }, g);
    X.svg('circle', { cx: 0, cy: -10, r: 63, fill: 'none', stroke: '#8FD3FF', 'stroke-width': 3, opacity: 0.55, 'stroke-dasharray': '120 400', transform: 'rotate(-20 0 -10)' }, g);
    X.svg('path', { d: 'M-34,-30 Q-30,-52 6,-50 Q46,-48 52,-16 Q56,14 30,26 Q0,36 -24,22 Q-44,6 -34,-30Z', fill: X.linear(id('vis'), [[0, '#081220'], [0.6, '#173A58'], [1, '#3F86B8']], 0, 0, 0.3, 1) }, g);
    X.svg('path', { d: 'M-24,-30 Q-18,-44 8,-43', stroke: '#fff', 'stroke-width': 7, 'stroke-linecap': 'round', fill: 'none', opacity: 0.8 }, g);
    X.svg('circle', { cx: 30, cy: -26, r: 6, fill: '#FFC560', opacity: 0.9 }, g);
    X.svg('circle', { cx: -56, cy: -18, r: 7, fill: A }, g);
    cap(48, 60, 92, 98, 40, suit(id('su'))); cap(92, 98, 128, 70, 36, suit(id('su')));
    X.svg('rect', { x: 112, y: 54, width: 14, height: 30, fill: A, transform: 'rotate(-38 119 69)' }, g);
    X.svg('circle', { cx: 134, cy: 64, r: 22, fill: accentF }, g);
    const x = o.x ?? 960, y = o.y ?? 540, s = o.s ?? 1, win = o.win || [0, 1e9], ph = o.phase ?? 0;
    const draw = (t) => wrap.setAttribute('transform', `translate(${f2(x + Math.sin(t * 0.7 + ph) * 8 + (o.vx ?? 0) * (t - win[0]))},${f2(y + Math.sin(t * 1.1 + ph) * 10)}) rotate(${f2((o.rot ?? -8) + Math.sin(t * 0.6 + ph) * 4)}) scale(${s})`);
    draw(win[0]); K.live(win[0], win[1], draw);
    return { wrap, g };
  };
  /** Stream of glowing photons (core + glow + tapered tail) travelling along `dir` from seeded start points. */
  K.photons = (parent, o) => {
    const g = X.svg('g', {}, parent), r = X.rand(o.seed ?? 21), n = o.n ?? 14, size = o.size ?? 6, len = o.len ?? 1400;
    const tg = X.linear(id('ptail'), [[0, o.color || '#FFD36B', 0], [1, o.color || '#FFF3C4', 0.9]], 0, 0, 1, 0);
    const gl = X.radial(id('pglow'), [[0, o.color || '#FFE08A', 0.85], [1, o.color || '#FFB02E', 0]]);
    const ps = Array.from({ length: n }, (_, i) => {
      const e = X.svg('g', {}, g), st = o.from(i, r), off = r(), sp = 1 + (r() - 0.5) * 0.3, sz = size * (0.7 + r() * 0.6);
      const dir = o.dirFn ? o.dirFn(i, st, r) : o.dir, ang = (Math.atan2(dir[1], dir[0]) * 180) / Math.PI;
      X.svg('polygon', { points: `${-sz * (o.tail ?? 14)},0 0,${-sz * 0.7} 0,${sz * 0.7}`, fill: tg }, e);
      X.svg('circle', { r: sz * 3.2, fill: gl }, e);
      X.svg('circle', { r: sz, fill: '#FFFDF2' }, e);
      return { e, st, off, sp, dir, ang };
    });
    const win = o.win || [0, 1e9], speed = o.speed ?? 600;
    const draw = (t) => ps.forEach((p) => {
      const ph = ((((t - win[0]) * speed * p.sp) / len + p.off) % 1 + 1) % 1, d = ph * len;
      const op = clamp(ph / 0.08) * clamp((1 - ph) / 0.12) * (o.op ?? 1);
      at(p.e, { transform: `translate(${f2(p.st[0] + p.dir[0] * d)},${f2(p.st[1] + p.dir[1] * d)}) rotate(${f2(p.ang)})`, opacity: f2(op) });
    });
    draw(win[0]); K.live(win[0], win[1], draw);
    return { g };
  };
  /** Chevron flow row (air / light flow): N chevrons drawn in with a 1-frame stagger, then advancing one slot every
   * `period` s; colour runs along the row (green → yellow by default). */
  K.chevrons = (parent, o) => {
    const g = X.svg('g', {}, parent), n = o.n ?? 16, s = o.size ?? 26, L = Math.hypot(o.x1 - o.x0, o.y1 - o.y0), ang = (Math.atan2(o.y1 - o.y0, o.x1 - o.x0) * 180) / Math.PI;
    const cols = o.colors || ['#3BD12A', '#F2E71A'], per = o.period ?? 0.17, sp = L / n;
    const pts = `${-0.55 * s},${-0.85 * s} ${0.05 * s},${-0.85 * s} ${0.62 * s},0 ${0.05 * s},${0.85 * s} ${-0.55 * s},${0.85 * s} ${0.02 * s},0`;
    const ch = Array.from({ length: n }, () => X.svg('polygon', { points: pts }, g));
    const t0 = o.t, t1 = o.out ?? 1e9;
    X.every((t) => {
      if (t < t0 - 0.05 || t > t1 + 0.3) { g.setAttribute('visibility', 'hidden'); return; }
      g.setAttribute('visibility', 'visible');
      const adv = Math.max(0, t - t0 - n / 30) / per;
      ch.forEach((c, i) => {
        const vis = t >= t0 + i / 30 && t < t1 + i / 60;
        const slot = (i + adv) % n, d = slot * sp, k = slot / (n - 1);
        at(c, { transform: `translate(${f2(o.x0 + Math.cos((ang * Math.PI) / 180) * d)},${f2(o.y0 + Math.sin((ang * Math.PI) / 180) * d)}) rotate(${f2(ang)})`, fill: K.mix(cols[0], cols[1], k), opacity: vis ? f2(clamp(slot / 0.8) * clamp((n - 0.2 - slot) / 0.8)) : 0 });
      });
    });
    if (o.sfx !== false) X.sfx(t0, 'swoosh', { dur: 0.45, gain: 0.25, pitch: 0.8 });
    return { g };
  };
  /** Metal paperclip (Gem shape) with a gradient wire + highlight; ~350×110 px at s=1, centred. */
  K.paperclip = (parent, o = {}) => {
    const g = X.svg('g', { transform: `translate(${o.x ?? 960},${o.y ?? 540}) rotate(${o.rot ?? -12}) scale(${o.s ?? 1})` }, parent);
    const d = 'M250,30 L60,30 A25,25 0 0 0 60,80 L310,80 A35,35 0 0 0 310,10 L40,10 A45,45 0 0 0 40,100 L290,100';
    const inner = X.svg('g', { transform: 'translate(-170,-55)' }, g);
    X.svg('path', { d, fill: 'none', stroke: '#59636D', 'stroke-width': 15, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', transform: 'translate(2,4)', opacity: 0.35 }, inner);
    X.svg('path', { d, fill: 'none', stroke: X.linear(id('clip'), [[0, '#7D8893'], [0.45, '#F5F8FA'], [0.6, '#C3CBD3'], [1, '#6B7580']], 0, 0, 0.2, 1), 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, inner);
    X.svg('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.75, transform: 'translate(-1,-2.5)' }, inner);
    return g;
  };

  // ======================================================================== paper-collage mode
  let paperURL = null;
  K.paperBG = (parent, o = {}) => {
    const g = X.svg('g', {}, parent);
    paperURL = paperURL || X.paper(o.color || C.paper, 960, 540, 0.1, o.seed ?? 3);
    X.svg('image', { href: paperURL, x: -200, y: -120, width: 2320, height: 1320, preserveAspectRatio: 'none' }, g);
    if (o.grid) {
      const gg = X.svg('g', { stroke: '#B9AE9F', 'stroke-width': 1, opacity: 0.35 }, g);
      for (let x = -200; x <= 2120; x += 60) X.svg('line', { x1: x, y1: -120, x2: x, y2: 1200 }, gg);
      for (let y = -120; y <= 1200; y += 60) X.svg('line', { x1: -200, y1: y, x2: 2120, y2: y }, gg);
    }
    X.svg('rect', { x: -200, y: -120, width: 2320, height: 1320, fill: X.radial(id('pvig'), [[0.55, '#5A4628', 0], [1, '#5A4628', 0.26]], 0.5, 0.5, 0.72) }, g);
    return g;
  };
  let boilF = null;
  /** Graphite pencil stroke with a slight boil; drawn on at t over dur (scribble sfx). */
  K.pencil = (parent, d, o = {}) => {
    boilF = boilF || X.boil('pboil', 2.2, 8, 0.03);
    const p = X.svg('path', { d, fill: o.fill || 'none', stroke: o.color || C.pencil, 'stroke-width': o.w ?? 3.4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', filter: boilF, opacity: o.op ?? 0.92 }, parent);
    if (o.t != null) { X.drawOn(p, o.t, o.dur ?? 0.8, 'power1.inOut'); if (o.sfx !== false) X.sfx(o.t, 'scribble', { dur: Math.min(1.2, o.dur ?? 0.8), gain: o.gain ?? 0.22 }); }
    return p;
  };
  /** Hand-lettering reveal: wipes a text element on left → right like writing. */
  K.write = (el, t, dur = 0.7) => {
    const bb = el.getBBox(), cid = id('wr'), cp = X.svg('clipPath', { id: cid }, X.defs);
    const r = X.svg('rect', { x: bb.x - 10, y: bb.y - 20, width: 0, height: bb.height + 40 }, cp);
    el.setAttribute('clip-path', `url(#${cid})`);
    X.tl.fromTo(r, { attr: { width: 0 } }, { attr: { width: bb.width + 30 }, duration: dur, ease: 'none', immediateRender: false }, t);
    X.sfx(t, 'scribble', { dur: Math.min(1.2, dur), gain: 0.2 });
  };
  /** B&W photo/engraving card with white border + drop shadow, sliding in from the right in ~6 frames. */
  K.cutout = (parent, o) => {
    const w = o.w ?? 520, h = o.h ?? 380, b = o.border ?? 12;
    const wrap = X.svg('g', { transform: `translate(${o.x ?? 960},${o.y ?? 540}) rotate(${o.rot ?? 3})` }, parent);
    const el = X.svg('g', {}, wrap);
    X.svg('rect', { x: -w / 2 - b + 8, y: -h / 2 - b + 14, width: w + 2 * b, height: h + 2 * b, fill: '#2B2013', opacity: 0.3, filter: K.softShadow() }, el);
    X.svg('rect', { x: -w / 2 - b, y: -h / 2 - b, width: w + 2 * b, height: h + 2 * b, fill: '#FBF8F2' }, el);
    const cid = id('cut'), cp = X.svg('clipPath', { id: cid }, X.defs);
    X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h }, cp);
    const content = X.svg('g', { 'clip-path': `url(#${cid})`, filter: K.bw() }, el);
    if (o.draw) o.draw(content, -w / 2, -h / 2, w, h);
    gsap.set(el, { autoAlpha: 0 });
    if (o.t != null) { X.tl.fromTo(el, { autoAlpha: 0, x: o.fromX ?? 700, rotation: 6 }, { autoAlpha: 1, x: 0, rotation: 0, duration: 0.22, ease: 'power3.out', immediateRender: false }, o.t); X.sfx(o.t, 'paper', { dur: 0.35, gain: 0.35 }); }
    return { wrap, el, content };
  };
  let ssF = null, bwF = null;
  K.softShadow = () => { if (!ssF) { const f = X.svg('filter', { id: 'kss', x: '-20%', y: '-20%', width: '140%', height: '140%' }, X.defs); X.svg('feGaussianBlur', { stdDeviation: 9 }, f); ssF = 'url(#kss)'; } return ssF; };
  K.bw = () => { if (!bwF) { const f = X.svg('filter', { id: 'kbw' }, X.defs); X.svg('feColorMatrix', { type: 'saturate', values: 0 }, f); const ct = X.svg('feComponentTransfer', {}, f); ['R', 'G', 'B'].forEach((c) => X.svg('feFunc' + c, { type: 'linear', slope: 1.15, intercept: -0.06 }, ct)); bwF = 'url(#kbw)'; } return bwF; };
  /** Torn-paper strip with a typewriter caption. */
  K.torn = (parent, text, o = {}) => {
    const fs = o.size ?? 30, g = X.svg('g', { transform: `translate(${o.x ?? 960},${o.y ?? 540}) rotate(${o.rot ?? -2})` }, parent);
    const tx = X.svg('text', { x: 0, y: fs * 0.35, 'text-anchor': 'middle', 'font-family': 'Roboto Mono', 'font-weight': 600, 'font-size': fs, fill: '#2A2722', 'letter-spacing': '0.04em', text }, g);
    const w = tx.getComputedTextLength() + fs * 1.6, h = fs * 2;
    const p = X.svg('path', { d: X.torn(w, h, 5, o.seed ?? 4, 10), transform: `translate(${-w / 2},${-h / 2})`, fill: '#F7F2E7', filter: K.softShadow() }, g);
    const p2 = X.svg('path', { d: X.torn(w, h, 5, o.seed ?? 4, 10), transform: `translate(${-w / 2},${-h / 2})`, fill: '#F7F2E7' }, g);
    g.insertBefore(p2, tx); g.insertBefore(p, p2); p.setAttribute('opacity', 0.35);
    gsap.set(g, { autoAlpha: 0 });
    if (o.t != null) { X.tl.fromTo(g, { autoAlpha: 0, scale: 1.08 }, { autoAlpha: 1, scale: 1, duration: 0.12, immediateRender: false }, o.t); X.sfx(o.t, 'type', { dur: 0.4, gain: 0.3 }); }
    return g;
  };
  /** Page peel (T4): `incoming` (a scene group) is revealed by an off-white sheet sweeping in from the bottom-right
   * corner on a diagonal fold — 80 % covered in ~8 f, settled by ~19 f — with a lit folded flap and a cast shadow. */
  K.pagePeel = (incoming, t0, o = {}) => {
    const dur = o.dur ?? 0.62, W = 1920, H = 1080, corner = [W, H], u = (() => { const l = Math.hypot(W, H); return [-W / l, -H / l]; })();
    const Dmax = W * -u[0] + H * -u[1] + 40;
    const cid = id('peel'), cp = X.svg('clipPath', { id: cid, clipPathUnits: 'userSpaceOnUse' }, X.defs), poly = X.svg('polygon', { points: '0,0' }, cp);
    incoming.setAttribute('clip-path', `url(#${cid})`);
    const fx = X.svg('g', { visibility: 'hidden' }, o.top || X.root);
    const shG = X.svg('linearGradient', { id: id('pshg'), gradientUnits: 'userSpaceOnUse' }, X.defs);
    X.svg('stop', { offset: 0, 'stop-color': '#000', 'stop-opacity': 0.45 }, shG); X.svg('stop', { offset: 1, 'stop-color': '#000', 'stop-opacity': 0 }, shG);
    const flG = X.svg('linearGradient', { id: id('pflg'), gradientUnits: 'userSpaceOnUse' }, X.defs);
    [[0, '#FFFFFF'], [0.35, '#F3EEE6'], [1, '#C9BFB1']].forEach(([of, c]) => X.svg('stop', { offset: of, 'stop-color': c }, flG));
    const shadow = X.svg('polygon', { fill: `url(#${shG.id})` }, fx), flap = X.svg('polygon', { fill: `url(#${flG.id})` }, fx);
    const rect = [[0, 0], [W, 0], [W, H], [0, H]];
    const proj = (q) => (q[0] - corner[0]) * u[0] + (q[1] - corner[1]) * u[1];
    const band = (a, b) => clipHalf(clipHalf(rect, (q) => proj(q) - b), (q) => a - proj(q));
    const pts = (P) => P.map((q) => f2(q[0]) + ',' + f2(q[1])).join(' ') || '0,0';
    const pt = (d) => [corner[0] + u[0] * d, corner[1] + u[1] * d];
    X.every((t) => {
      if (t < t0) { poly.setAttribute('points', '0,0'); fx.setAttribute('visibility', 'hidden'); return; }
      if (t >= t0 + dur) { poly.setAttribute('points', pts(rect)); fx.setAttribute('visibility', 'hidden'); return; }
      const d = E.o3((t - t0) / dur) * Dmax, fw = Math.min(d * 0.3, 260);
      poly.setAttribute('points', pts(band(-10, d)));
      flap.setAttribute('points', pts(band(d - fw, d)));
      shadow.setAttribute('points', pts(band(d, d + 46)));
      const a = pt(d), b = pt(d - fw), c = pt(d + 46);
      at(flG, { x1: f2(a[0]), y1: f2(a[1]), x2: f2(b[0]), y2: f2(b[1]) });
      at(shG, { x1: f2(a[0]), y1: f2(a[1]), x2: f2(c[0]), y2: f2(c[1]) });
      fx.setAttribute('visibility', 'visible');
    });
    X.sfx(t0, 'paper', { dur: 0.5, gain: 0.5 }); X.sfx(t0, 'swoosh', { dur: 0.4, gain: 0.3, pitch: 0.8 });
    return fx;
  };
  function clipHalf(P, f) { // keep f(q) <= 0
    const out = [];
    for (let i = 0; i < P.length; i++) {
      const a = P[i], b = P[(i + 1) % P.length], fa = f(a), fb = f(b);
      if (fa <= 0) out.push(a);
      if ((fa < 0 && fb > 0) || (fa > 0 && fb < 0)) { const k = fa / (fa - fb); out.push([a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]); }
    }
    return out;
  }

  // ======================================================================== magnifier zoom-through (T5)
  /** Lime anchor dot on the object → faint light cone → white lens with a blue ring showing the micro world →
   * at tZoom the lens scales ×14 (power2.in, 0.28 s); cut to the full-frame micro scene at tZoom + 0.28. */
  K.magnifier = (parent, o) => {
    const g = X.svg('g', {}, parent), [ax, ay] = o.anchor, [cx, cy] = o.c, r = o.r ?? 165;
    const dx = cx - ax, dy = cy - ay, D = Math.hypot(dx, dy), a = Math.atan2(dy, dx), be = Math.asin(Math.min(0.99, r / D)), T = Math.sqrt(Math.max(1, D * D - r * r));
    const tp = (s) => [ax + Math.cos(a + s * be) * T, ay + Math.sin(a + s * be) * T];
    const p1 = tp(1), p2 = tp(-1);
    const cone = X.svg('polygon', { points: `${ax},${ay} ${f2(p1[0])},${f2(p1[1])} ${f2(p2[0])},${f2(p2[1])}`, fill: X.linear(id('cone'), [[0, '#fff', 0.05], [1, '#fff', 0.3]], ax < cx ? 0 : 1, ay < cy ? 0 : 1, ax < cx ? 1 : 0, ay < cy ? 1 : 0) }, g);
    const dot = X.svg('circle', { cx: ax, cy: ay, r: 11, fill: C.lime, stroke: C.ink, 'stroke-width': 3 }, g);
    const lens = X.svg('g', {}, g);
    X.svg('circle', { cx, cy, r: r + 9, fill: '#000', opacity: 0.25, transform: 'translate(4,8)' }, lens);
    X.svg('circle', { cx, cy, r, fill: '#fff' }, lens);
    const cid = id('lens'), cp = X.svg('clipPath', { id: cid }, X.defs);
    X.svg('circle', { cx, cy, r }, cp);
    const content = X.svg('g', { 'clip-path': `url(#${cid})` }, lens);
    if (o.content) o.content(content, cx, cy, r);
    X.svg('circle', { cx, cy, r, fill: 'none', stroke: o.ring || C.lens, 'stroke-width': 7 }, lens);
    gsap.set(cone, { autoAlpha: 0 }); gsap.set(lens, { svgOrigin: `${cx} ${cy}`, scale: 0 });
    X.pop(dot, o.t, { sfx: 'blip_up', dur: 0.2, gain: 0.25 });
    X.tl.fromTo(cone, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.15, immediateRender: false }, o.tLens);
    X.tl.fromTo(lens, { scale: 0 }, { scale: 1, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, o.tLens);
    X.sfx(o.tLens, 'pop', { gain: 0.3, pitch: 0.9 });
    if (o.tZoom != null) {
      X.tl.to(lens, { scale: o.zoomScale ?? 14, duration: 0.28, ease: 'power2.in' }, o.tZoom);
      X.tl.to([cone, dot], { autoAlpha: 0, duration: 0.1 }, o.tZoom);
      X.sfx(o.tZoom, 'zoom_in', { dur: 0.4, gain: 0.45 });
    }
    return { g, lens, content };
  };

  // ======================================================================== magnified micro world (after a magnifier zoom-through)
  /** Flat micro-world: saturated blue "vacuum", a row of silver atoms (gradient spheres) on an amber film, glowing photons
   * that arrive diagonally, bounce off and leave; on each bounce a lime push arrow flashes and the surface nudges.
   * o: {x, y, w, h, s (scale), surf (0..1 surface height), win:[t0,t1], photons:[{x, delay, period, A, B, kick, until}]} */
  K.microWorld = (g, o) => {
    const { x, y, w: W, h: H, s } = o, win = o.win, sy = y + H * (o.surf ?? 0.7), R = 50 * s;
    X.svg('rect', { x, y, width: W, height: H, fill: X.linear(K.id('mbg'), [[0, '#3C7DFF'], [1, '#1A4CD4']]) }, g);
    const br = X.rand(o.seed ?? 3);
    for (let i = 0; i < 12; i++) X.svg('circle', { cx: x + br() * W, cy: y + br() * (sy - y - R), r: (6 + br() * 14) * s, fill: '#fff', opacity: 0.08 + br() * 0.08 }, g);
    X.svg('rect', { x, y: sy + 0.55 * R, width: W, height: H, fill: X.linear(K.id('film'), [[0, '#F4C064'], [0.2, '#DB8A2D'], [1, '#7A3D0E']]) }, g);
    X.svg('rect', { x, y: sy + 0.55 * R, width: W, height: 8 * s, fill: '#FFE3A6', opacity: 0.6 }, g);
    const atoms = X.svg('g', {}, g);
    const ag = X.radial(K.id('atom'), [[0, '#FFFFFF'], [0.45, '#DDE7F3'], [1, '#7489A8']], 0.36, 0.3, 0.72);
    for (let ax = x - 2 * R; ax < x + W + 2 * R; ax += R * 1.82) X.svg('circle', { cx: ax + R * 0.91, cy: sy + R * 0.42, r: R * 0.9, fill: '#7F94B3' }, atoms);
    for (let ax = x - 2 * R; ax < x + W + 2 * R; ax += R * 1.82) X.svg('circle', { cx: ax, cy: sy, r: R, fill: ag }, atoms);
    const pgl = X.radial(K.id('mph'), [[0, '#FFFDF0', 1], [0.28, '#FFE27A', 1], [0.5, '#FFB52E', 0.5], [1, '#FF9A1F', 0]]);
    const ad = `M0,0 L${-30 * s},${-36 * s} L${-12 * s},${-36 * s} L${-12 * s},${-96 * s} L${12 * s},${-96 * s} L${12 * s},${-36 * s} L${30 * s},${-36 * s} Z`;
    const ph = (o.photons || []).map((p) => {
      const arr = X.svg('g', {}, g);
      X.svg('path', { d: ad, fill: '#000', opacity: 0.3, transform: `translate(${3 * s},${4 * s})` }, arr);
      X.svg('path', { d: ad, fill: C.lime }, arr);
      const gh = [0.55, 0.35, 0.2].map((op) => X.svg('circle', { r: 30 * s, fill: '#FFE8A0', opacity: op }, g));
      const e = X.svg('g', {}, g);
      X.svg('circle', { r: 84 * s, fill: pgl }, e); X.svg('circle', { r: 20 * s, fill: '#FFFDF4' }, e);
      return { ...p, e, gh, arr };
    });
    K.live(win[0], win[1], (t) => {
      let nudge = 0;
      ph.forEach((p) => {
        const P = p.period ?? 1.3, t0 = win[0] + (p.delay ?? 0), on = t >= t0 && t < (p.until ?? 1e9);
        const q = ((((t - t0) / P) % 1) + 1) % 1, ix = p.x, iy = sy - R - 26 * s, A = (p.A ?? 380) * s, B = (p.B ?? 560) * s;
        const pos = (qq) => (qq < 0.5 ? [lerp(ix - A, ix, qq / 0.5), lerp(iy - B, iy, qq / 0.5)] : [lerp(ix, ix + A, (qq - 0.5) / 0.5), lerp(iy, iy - B, (qq - 0.5) / 0.5)]);
        const [px, py] = pos(q);
        K.at(p.e, { transform: `translate(${px.toFixed(1)},${py.toFixed(1)})`, opacity: on ? 1 : 0 });
        p.gh.forEach((c, j) => { const qq = q - (j + 1) * 0.035, [gx, gy] = pos(Math.max(0, qq)); K.at(c, { cx: gx.toFixed(1), cy: gy.toFixed(1), visibility: on && qq > 0 && (qq < 0.5) === (q < 0.5) ? 'visible' : 'hidden' }); });
        const k = (q - 0.5) / 0.3, av = on && q >= 0.5 && q < 0.8;
        K.at(p.arr, { transform: `translate(${ix},${(sy + 1.5 * R).toFixed(1)}) scale(${(0.6 + 0.4 * E.o3(Math.min(1, k * 3))).toFixed(2)})`, opacity: av ? (1 - k * k).toFixed(2) : 0 });
        if (on && q >= 0.5) nudge += (p.kick ?? 7) * s * Math.exp(-(q - 0.5) * P * 9);
      });
      atoms.setAttribute('transform', `translate(0,${nudge.toFixed(2)})`);
    });
    return { sy, R };
  };

  // ======================================================================== colour-flip title sting (T11)
  /** ~3 s sting animated on ones: background flips through a 4-colour set every 3–8 f; the title word scales from
   * 10 % to overfilling the frame, its letters squash into vertical bars and spring back; a field of ~30 sparkle
   * glyphs stamps the frame; the word returns and settles; a tiny tagline holds ~12 f. Your own colours + glyph. */
  K.titleSting = (parent, t0, o = {}) => {
    const dur = o.dur ?? 3.2, cols = o.colors || ['#0E1F2E', '#2D5BFF', '#F06A3A', '#E6E1D6'];
    const g = X.scene(id('sting'), t0, t0 + dur, null, parent);
    const bg = X.svg('rect', { x: -50, y: -50, width: 2020, height: 1180, fill: cols[0] }, g);
    const flips = o.flips || [[0, 0], [5, 1], [9, 2], [14, 0], [18, 3], [24, 1], [29, 2], [33, 0], [38, 1], [44, 3], [50, 0], [56, 2], [62, 1], [68, 0], [74, 2], [82, 3]];
    const word = o.word || 'TITLE', size = o.size ?? 250, base = 540 + size * 0.36;
    const wg = X.svg('g', {}, g);
    const tmp = X.svg('text', { 'font-family': 'Archivo Black', 'font-size': size, text: 'M' }, g);
    const adv = [...word].map((ch) => { tmp.textContent = ch === ' ' ? 'I' : ch; return ch === ' ' ? size * 0.28 : tmp.getComputedTextLength() - size * 0.02; });
    tmp.remove();
    const total = adv.reduce((a, b) => a + b, 0);
    let x = 960 - total / 2;
    const letters = [...word].map((ch, i) => {
      const lw = adv[i], lg = X.svg('g', {}, wg), cxl = x + lw / 2;
      if (ch !== ' ') {
        for (let k = 7; k >= 1; k--) X.svg('text', { x: cxl + k, y: base + k, 'text-anchor': 'middle', 'font-family': 'Archivo Black', 'font-size': size, fill: o.extrude || '#0A1119', stroke: o.extrude || '#0A1119', 'stroke-width': 8, 'stroke-linejoin': 'round', text: ch }, lg);
        X.svg('text', { x: cxl, y: base, 'text-anchor': 'middle', 'font-family': 'Archivo Black', 'font-size': size, fill: o.fill || C.lime, stroke: C.ink, 'stroke-width': 6, 'paint-order': 'stroke', 'stroke-linejoin': 'round', text: ch }, lg);
      }
      x += lw;
      return { lg, cx: cxl, i };
    });
    const r = X.rand(o.seed ?? 77), glyphs = Array.from({ length: o.glyphs ?? 30 }, (_, i) => {
      const gg = X.svg('g', {}, g), gr = 30 + r() * 80;
      X.svg('path', { d: K.sparklePath(gr, 0.2), fill: i % 3 === 2 ? '#fff' : (o.fill || C.lime), stroke: C.ink, 'stroke-width': 4 }, gg);
      return { gg, x: 80 + r() * 1760, y: 70 + r() * 940, rot: r() * 90, d: Math.floor(r() * 6), s: 0.8 + r() * 0.4 };
    });
    const tag = X.svg('text', { x: 960, y: 548, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 800, 'font-size': o.tagSize ?? 30, 'letter-spacing': '0.22em', fill: o.tagColor || C.ink, text: o.tagline || '' }, g);
    const tagGlyph = X.svg('path', { d: K.sparklePath(18, 0.2), fill: o.fill || C.lime, stroke: C.ink, 'stroke-width': 3, transform: 'translate(960,488)' }, g);
    const F = (t) => Math.floor((t - t0) * 30 + 1e-4);
    X.every((t) => {
      if (t < t0 || t >= t0 + dur) return;
      const f = F(t);
      let ci = 0; for (const [ff, c] of flips) if (f >= ff) ci = c;
      bg.setAttribute('fill', cols[ci]);
      // word scale: 0.1 → 1.22 in 7 f, settle to 1.0 by f 13; hidden f40–55; back f56 with a wobble; hidden from f80
      let ws = 1, rot = 0, vis = true;
      if (f < 7) ws = 0.1 + 1.12 * E.o3(f / 7); else if (f < 13) ws = 1.22 - 0.22 * E.o2((f - 7) / 6);
      if (f >= 40 && f < 56) vis = false;
      if (f >= 56) { const k = f - 56; ws = 1 + 0.16 * Math.exp(-k / 5) * Math.cos(k * 0.9); rot = 3 * Math.exp(-k / 6) * Math.sin(k * 1.1); }
      if (f >= 82) vis = false;
      wg.setAttribute('visibility', vis ? 'visible' : 'hidden');
      wg.setAttribute('transform', `translate(960 540) rotate(${f2(rot)}) scale(${f2(ws)}) translate(-960 -540)`);
      letters.forEach((L) => { // squash/stretch wave f 10–38: letters condense into tall bars and spring back
        const k = f - 10 - L.i * 1.6; let sy = 1, sx = 1;
        if (k > 0 && k < 14) { const b = Math.sin((Math.PI * k) / 14); sy = 1 + 1.5 * b; sx = 1 / (1 + 1.6 * b); }
        else if (k >= 14 && k < 22) { const b = Math.sin((Math.PI * (k - 14)) / 8) * 0.25; sy = 1 - b; sx = 1 + b * 0.8; }
        L.lg.setAttribute('transform', `translate(${f2(L.cx)} ${base}) scale(${f2(sx)} ${f2(sy)}) translate(${f2(-L.cx)} ${-base})`);
      });
      glyphs.forEach((G) => {
        const k = f - 40 - G.d, on = k >= 0 && f < 56;
        G.gg.setAttribute('visibility', on ? 'visible' : 'hidden');
        if (on) G.gg.setAttribute('transform', `translate(${f2(G.x)},${f2(G.y)}) rotate(${f2(G.rot + k * 9)}) scale(${f2(G.s * (k < 2 ? 1.35 - k * 0.15 : 1))})`);
      });
      const tv = f >= 83;
      tag.setAttribute('visibility', tv ? 'visible' : 'hidden'); tagGlyph.setAttribute('visibility', tv ? 'visible' : 'hidden');
    });
    X.sfx(t0, 'impact', { gain: 0.5 }); X.sfx(t0 + 0.02, 'whoosh', { dur: 0.3, gain: 0.45, pitch: 1.2 });
    X.sfx(t0 + 10 / 30, 'boing', { dur: 0.6, gain: 0.28, pitch: 1.3 });
    [5, 14, 24, 33, 62, 68].forEach((f) => X.sfx(t0 + f / 30, 'blip', { gain: 0.12, pitch: 1 + (f % 3) * 0.25 }));
    X.sfx(t0 + 40 / 30, 'stamp', { gain: 0.45 }); X.sfx(t0 + 41 / 30, 'sparkle', { dur: 0.5, gain: 0.3 });
    X.sfx(t0 + 56 / 30, 'whoosh', { dur: 0.3, gain: 0.4, pitch: 1.3 }); X.sfx(t0 + 57 / 30, 'impact', { gain: 0.3 });
    X.sfx(t0 + 83 / 30, 'ding', { gain: 0.25 });
    return g;
  };
})();
