/* explainer-clean-vector kit (window.K) — one hub object on near-white, cards that blow up into full-bleed flat
 * colour-field worlds, primitive → object morphs, confetti that never stops drifting, squash/stretch everywhere.
 * Load after GSAP (+ MorphSVGPlugin, MotionPathPlugin) and engine/lib/explainer.js; before scene.js.
 *
 *   timing      K.F(n) = n frames at 24 fps (the style's native rate; render with --fps 24)
 *   palette     K.PAL (solid-fill dialect)  ·  K.outline(color, width) switches every K.shape to the outline dialect
 *   paths       K.P.circle / ellipse / rrect / pill / heart / star / house / balloon / plane / pin / loaf (morph-ready)
 *   build       K.shape · K.text · K.textW · K.wrap · K.bob(idle) · K.sparkle
 *   motion      K.popIn · K.popOut · K.squash · K.land · K.hop · K.arc · K.launch · K.morph · K.draw · K.undraw
 *               K.shake · K.dashed (masked dashed line draw-on/erase)
 *   fx          K.confetti (drifting field) · K.burst (payoff confetti) · K.rings (dashed concentric fireworks)
 *               K.puffs (landing dust cloud → teal curls)
 *   hub/worlds  K.hub (phone hub: T1 splitOpen, T2 blowUp, T3 collapse, T4 pushThrough, T5 closeToDot, pages, feed)
 *               K.world (full-bleed colour field grown from a card box or irised from a dot)
 *   objects     K.envelope · K.plane · K.mailbox · K.stamp · K.postcard · K.avatar · K.pin · K.cloud · K.mark · K.wordmark
 * Everything is a pure function of time (seeded X.rand, tweens on X.tl, X.every for idle drift).
 */
(function () {
  const K = (window.K = {});
  const FPS = 24, F = (n) => n / FPS;
  K.FPS = FPS; K.F = F;
  let uid = 0;
  const id = (p) => `${p}${++uid}`;

  K.PAL = {
    ground: '#f9f9f9', night: '#1f1d2b', nightScreen: '#2b2840',
    hub: '#6a4cf5', hubDark: '#4a31cf', hubLight: '#a493ff', hubPale: '#eeebff',
    sky: '#2ea7f0', skyLand: '#5cbcf4', sun: '#f7c11a', mint: '#13d9b2', mintDark: '#07a688', coral: '#ff6a4d',
    coralDark: '#e2502f', teal: '#1fcfae', pink: '#ff9fc2', lav: '#8f9cf7', ink: '#2a2840',
    bar: '#cfd2d9', barLight: '#e6e8ec', greyText: '#6d717c', white: '#ffffff',
  };
  K.CONFETTI = ['#ff6a4d', '#f7c11a', '#1fcfae', '#2ea7f0', '#6a4cf5', '#ff9fc2', '#8f9cf7'];

  // ------------------------------------------------------------------ dialect
  let OUT = null;
  /** Outline dialect (Ahrefs-like): every K.shape gets a uniform stroke that stays constant under zoom. */
  K.outline = (color = '#0e3e7c', width = 5) => { OUT = color ? { color, width } : null; };
  const stroke = (el) => {
    if (!OUT) return el;
    el.setAttribute('stroke', OUT.color); el.setAttribute('stroke-width', OUT.width);
    el.setAttribute('stroke-linejoin', 'round'); el.setAttribute('stroke-linecap', 'round');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    return el;
  };

  // ------------------------------------------------------------------ morph-ready paths (all cubic / line segments)
  const kk = 0.5523, f1 = (v) => +v.toFixed(2);
  const P = (K.P = {});
  P.ellipse = (cx, cy, rx, ry) => `M${f1(cx - rx)},${f1(cy)}C${f1(cx - rx)},${f1(cy - kk * ry)} ${f1(cx - kk * rx)},${f1(cy - ry)} ${f1(cx)},${f1(cy - ry)}` +
    `C${f1(cx + kk * rx)},${f1(cy - ry)} ${f1(cx + rx)},${f1(cy - kk * ry)} ${f1(cx + rx)},${f1(cy)}C${f1(cx + rx)},${f1(cy + kk * ry)} ${f1(cx + kk * rx)},${f1(cy + ry)} ${f1(cx)},${f1(cy + ry)}` +
    `C${f1(cx - kk * rx)},${f1(cy + ry)} ${f1(cx - rx)},${f1(cy + kk * ry)} ${f1(cx - rx)},${f1(cy)}Z`;
  P.circle = (cx, cy, r) => P.ellipse(cx, cy, r, r);
  /** Rounded rect; rt = top corner radius, rb = bottom corner radius (default rt). */
  P.rrect = (x, y, w, h, rt = 0, rb = rt) => {
    rt = Math.min(rt, w / 2, h); rb = Math.min(rb, w / 2, h - rt);
    const c = (r) => r * (1 - kk);
    return `M${f1(x)},${f1(y + rt)}C${f1(x)},${f1(y + c(rt))} ${f1(x + c(rt))},${f1(y)} ${f1(x + rt)},${f1(y)}L${f1(x + w - rt)},${f1(y)}` +
      `C${f1(x + w - c(rt))},${f1(y)} ${f1(x + w)},${f1(y + c(rt))} ${f1(x + w)},${f1(y + rt)}L${f1(x + w)},${f1(y + h - rb)}` +
      `C${f1(x + w)},${f1(y + h - c(rb))} ${f1(x + w - c(rb))},${f1(y + h)} ${f1(x + w - rb)},${f1(y + h)}L${f1(x + rb)},${f1(y + h)}` +
      `C${f1(x + c(rb))},${f1(y + h)} ${f1(x)},${f1(y + h - c(rb))} ${f1(x)},${f1(y + h - rb)}Z`;
  };
  P.pill = (cx, cy, w, h) => P.rrect(cx - w / 2, cy - h / 2, w, h, Math.min(w, h) / 2);
  const poly = (cx, cy, s, pts) => 'M' + pts.map(([x, y]) => `${f1(cx + x * s)},${f1(cy + y * s)}`).join('L') + 'Z';
  const cub = (cx, cy, s, segs) => segs.map((g) => g[0] + g.slice(1).map(([x, y]) => `${f1(cx + x * s)},${f1(cy + y * s)}`).join(' ')).join('') + 'Z';
  /** s = width. */
  P.heart = (cx, cy, s) => cub(cx, cy, s, [['M', [0, 0.36]], ['C', [-0.1, 0.28], [-0.5, 0.02], [-0.5, -0.18]], ['C', [-0.5, -0.36], [-0.37, -0.46], [-0.25, -0.46]],
    ['C', [-0.13, -0.46], [-0.04, -0.39], [0, -0.29]], ['C', [0.04, -0.39], [0.13, -0.46], [0.25, -0.46]], ['C', [0.37, -0.46], [0.5, -0.36], [0.5, -0.18]], ['C', [0.5, 0.02], [0.1, 0.28], [0, 0.36]]]);
  P.star = (cx, cy, R, r, n = 5, rot = -90) => 'M' + Array.from({ length: n * 2 }, (_, i) => {
    const a = (rot + (i * 180) / n) * Math.PI / 180, rr = i % 2 ? r : R;
    return `${f1(cx + rr * Math.cos(a))},${f1(cy + rr * Math.sin(a))}`;
  }).join('L') + 'Z';
  /** 4-point sparkle (concave sides). */
  P.sparkle = (cx, cy, r) => cub(cx, cy, r, [['M', [0, -1]], ['C', [0.12, -0.25], [0.25, -0.12], [1, 0]], ['C', [0.25, 0.12], [0.12, 0.25], [0, 1]], ['C', [-0.12, 0.25], [-0.25, 0.12], [-1, 0]], ['C', [-0.25, -0.12], [-0.12, -0.25], [0, -1]]]);
  P.house = (cx, cy, s) => poly(cx, cy, s, [[-0.4, 0.42], [-0.4, -0.04], [0, -0.42], [0.4, -0.04], [0.4, 0.42]]);
  P.balloon = (cx, cy, s) => cub(cx, cy, s, [['M', [0, 0.44]], ['C', [-0.26, 0.38], [-0.4, 0.12], [-0.4, -0.08]], ['C', [-0.4, -0.32], [-0.22, -0.5], [0, -0.5]],
    ['C', [0.22, -0.5], [0.4, -0.32], [0.4, -0.08]], ['C', [0.4, 0.12], [0.26, 0.38], [0, 0.44]]]);
  /** Paper plane pointing right; s = length. */
  P.plane = (cx, cy, s) => poly(cx, cy, s, [[0.5, -0.02], [-0.5, -0.34], [-0.2, 0.04], [-0.34, 0.3]]);
  P.planeWing = (cx, cy, s) => poly(cx, cy, s, [[0.5, -0.02], [-0.2, 0.04], [-0.34, 0.3]]);
  P.pin = (cx, cy, s) => cub(cx, cy, s, [['M', [0, 0.5]], ['C', [-0.1, 0.3], [-0.34, 0.06], [-0.34, -0.15]], ['C', [-0.34, -0.36], [-0.19, -0.5], [0, -0.5]],
    ['C', [0.19, -0.5], [0.34, -0.36], [0.34, -0.15]], ['C', [0.34, 0.06], [0.1, 0.3], [0, 0.5]]]);
  /** Arch / loaf (mailbox front): fully rounded top. */
  P.loaf = (x, y, w, h, rb = 10) => P.rrect(x, y, w, h, w / 2, rb);
  /** Wavy line (open path) from x0 to x1 at y; amp, wavelength. */
  P.wave = (x0, x1, y, amp = 10, wl = 60) => {
    let d = `M${f1(x0)},${f1(y)}`;
    for (let x = x0; x < x1 - 1; x += wl / 2) {
      const xe = Math.min(x + wl / 2, x1), s = ((x - x0) / (wl / 2)) % 2 ? 1 : -1;
      d += `Q${f1((x + xe) / 2)},${f1(y + s * amp)} ${f1(xe)},${f1(y)}`;
    }
    return d;
  };

  // ------------------------------------------------------------------ building blocks
  K.shape = (parent, d, fill, attrs = {}) => stroke(X.svg('path', { d, fill, ...attrs }, parent));
  K.line = (parent, d, color, width = 3, attrs = {}) =>
    X.svg('path', { d, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...attrs }, parent);
  const cv = document.createElement('canvas').getContext('2d');
  K.textW = (str, size, weight = 600, family = 'Fredoka') => { cv.font = `${weight} ${size}px ${family}`; return cv.measureText(str).width; };
  K.text = (parent, x, y, str, o = {}) => X.svg('text', {
    x, y, text: str, 'font-family': o.family || 'Fredoka', 'font-size': o.size || 40, 'font-weight': o.weight || 600,
    fill: o.color || K.PAL.ink, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.spacing || 0,
  }, parent);
  /** Insert a wrapper <g> around el (for idle motion that must not fight GSAP transforms on el). */
  K.wrap = (el) => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.parentNode.insertBefore(g, el); g.appendChild(el); return g; };
  /** Idle drift on a wrapper: ay/ax px, period p s, rot deg about the element's own centre. */
  K.bob = (el, o = {}) => {
    const w = K.wrap(el), b = el.getBBox(), cx = o.cx ?? b.x + b.width / 2, cy = o.cy ?? b.y + b.height / 2;
    const ay = o.ay ?? 6, ax = o.ax ?? 0, p = o.p ?? 2.6, rot = o.rot ?? 0, ph = o.ph ?? 0, t0 = o.from ?? 0, t1 = o.to ?? 1e9;
    X.every((t) => {
      const tt = Math.min(Math.max(t, t0), t1) - t0, s = Math.sin((tt * 2 * Math.PI) / p + ph), c = Math.sin((tt * 2 * Math.PI) / (p * 1.3) + ph);
      w.setAttribute('transform', `translate(${f1(ax * c)} ${f1(ay * s)}) rotate(${f1(rot * c)} ${f1(cx)} ${f1(cy)})`);
    });
    return w;
  };
  K.sparkle = (parent, x, y, r, color = '#fff') => K.shape(parent, P.sparkle(x, y, r), color);

  // ------------------------------------------------------------------ motion principles
  /** Overshoot pop (back.out ≈ 10–20 % overshoot) from the element's own centre. */
  K.popIn = (el, t, o = {}) => {
    gsap.set(el, { transformOrigin: o.origin || '50% 50%', scale: 0 });
    X.tl.to(el, { scale: o.scale ?? 1, duration: o.dur ?? F(9), ease: o.ease || 'back.out(2.4)' }, t);
    if (o.rot) X.tl.from(el, { rotation: o.rot, duration: o.dur ?? F(10), ease: 'back.out(2)', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'pop', { gain: o.gain ?? 0.28, pitch: o.pitch ?? 1 });
  };
  K.popOut = (el, t, o = {}) => {
    X.tl.to(el, { scale: 0, duration: o.dur ?? F(6), ease: o.ease || 'back.in(2)', transformOrigin: o.origin || '50% 50%' }, t);
    if (o.sfx) X.sfx(t, o.sfx, { gain: o.gain ?? 0.2, pitch: o.pitch ?? 1.3 });
  };
  /** Squash on impact (2 f) then elastic settle (8–12 % bounce). */
  K.squash = (el, t, o = {}) => {
    X.tl.to(el, { scaleX: o.sx ?? 1.28, scaleY: o.sy ?? 0.72, duration: o.dur ?? F(2), ease: 'power2.out', transformOrigin: o.origin || '50% 100%' }, t)
      .to(el, { scaleX: 1, scaleY: 1, duration: o.settle ?? F(12), ease: 'elastic.out(1, 0.42)' }, t + (o.dur ?? F(2)));
  };
  /** Fall from dy with stretch, squash on contact, settle. Returns the contact time. */
  K.land = (el, t, o = {}) => {
    const fall = o.fall ?? F(7), origin = o.origin || '50% 100%';
    gsap.set(el, { transformOrigin: origin });
    if (o.hide !== false) { gsap.set(el, { autoAlpha: 0 }); X.tl.set(el, { autoAlpha: 1 }, t); }
    X.tl.fromTo(el, { y: o.dy ?? -420, scaleX: 0.84, scaleY: 1.22 }, { y: 0, duration: fall, ease: 'power2.in', immediateRender: false }, t);
    K.squash(el, t + fall, { sx: o.sx ?? 1.3, sy: o.sy ?? 0.7, origin, settle: o.settle });
    if (o.sfx !== false) X.sfx(t + fall, o.sfx || 'boing', { gain: o.gain ?? 0.3, pitch: o.pitch ?? 1 });
    return t + fall;
  };
  /** Hop in place: anticipation squash → stretch up → fall → squash → settle. */
  K.hop = (el, t, o = {}) => {
    const h = o.h ?? 60, ant = o.ant ?? F(3), up = o.up ?? F(6), origin = o.origin || '50% 100%';
    X.tl.to(el, { scaleX: 1.16, scaleY: 0.84, duration: ant, ease: 'power2.out', transformOrigin: origin }, t)
      .to(el, { y: `-=${h}`, scaleX: 0.9, scaleY: 1.12, duration: up, ease: 'power2.out' }, t + ant)
      .to(el, { y: `+=${h}`, scaleX: 0.94, scaleY: 1.06, duration: up * 0.85, ease: 'power2.in' }, t + ant + up)
      .to(el, { scaleX: 1.22, scaleY: 0.8, duration: F(2), ease: 'power1.out' }, t + ant + up * 1.85)
      .to(el, { scaleX: 1, scaleY: 1, duration: F(10), ease: 'elastic.out(1, 0.45)' }, t + ant + up * 1.85 + F(2));
    if (o.sfx !== false) X.sfx(t + ant + up * 1.85, o.sfx || 'boing', { gain: o.gain ?? 0.22, pitch: o.pitch ?? 1.2 });
    return t + ant + up * 1.85;
  };
  /** Travel along an arc (MotionPath through relative points). Never a straight diagonal. */
  K.arc = (el, t, dur, pts, o = {}) => {
    const rel = o.relative ?? true;
    X.tl.to(el, { motionPath: { path: rel ? K.deltas(pts) : pts, curviness: o.curviness ?? 1.25, autoRotate: o.autoRotate ?? false, relative: rel }, duration: dur, ease: o.ease || 'power1.inOut' }, t);
  };
  /** Points given as offsets from the START position → GSAP's relative mode (each point relative to the previous one). */
  K.deltas = (pts) => pts.map((p, i) => (i ? { x: p.x - pts[i - 1].x, y: p.y - pts[i - 1].y } : { x: p.x, y: p.y }));
  /** Anticipation (counter-move + squash, 3–4 f) then an arcing launch with stretch. */
  K.launch = (el, t, pts, o = {}) => {
    const ant = o.ant ?? F(4), back = o.back ?? { x: -16, y: 10 };
    X.tl.to(el, { x: `+=${back.x}`, y: `+=${back.y}`, scaleX: 1.12, scaleY: 0.86, duration: ant, ease: 'power2.out', transformOrigin: o.origin || '50% 50%' }, t)
      .to(el, { scaleX: 0.88, scaleY: 1.16, duration: F(4), ease: 'power2.in' }, t + ant)
      .to(el, { scaleX: 1, scaleY: 1, duration: F(6), ease: 'power2.out' }, t + ant + F(4));
    X.tl.to(el, { motionPath: { path: K.deltas(pts), curviness: o.curviness ?? 1.3, autoRotate: o.autoRotate ?? false, relative: true }, duration: o.dur ?? F(14), ease: o.ease || 'power2.in' }, t + ant);
    if (o.sfx !== false) X.sfx(t + ant, o.sfx || 'whoosh', { dur: 0.4, gain: o.gain ?? 0.35 });
    return t + ant;
  };
  K.morph = (el, d, t, dur = F(8), ease = 'power2.inOut', extra = {}) =>
    X.tl.to(el, { morphSVG: { shape: d, type: extra.type || 'linear', shapeIndex: extra.shapeIndex ?? 'auto' }, duration: dur, ease, ...(extra.fill ? { fill: extra.fill } : {}) }, t);
  K.draw = (el, t, dur = F(10), ease = 'power1.inOut') => X.drawOn(el, t, dur, ease);
  K.undraw = (el, t, dur = F(8), ease = 'power1.in') => {
    const L = el.getTotalLength ? el.getTotalLength() : 1000, sw = parseFloat(el.getAttribute('stroke-width')) || 0;
    X.tl.to(el, { strokeDashoffset: -(L + sw + 1), duration: dur, ease }, t);
  };
  /** Nervous shake about the element's centre. */
  K.shake = (el, t, o = {}) => {
    const n = o.n ?? 4, a = o.a ?? 5, d = o.dur ?? F(3);
    for (let i = 0; i < n; i++) X.tl.to(el, { rotation: i % 2 ? -a : a, duration: d, ease: 'sine.inOut', transformOrigin: o.origin || '50% 100%' }, t + i * d);
    X.tl.to(el, { rotation: 0, duration: d * 2, ease: 'back.out(2)' }, t + n * d);
  };
  /** Dashed line that draws on / erases (mask trick: X.drawOn cannot draw a dashed stroke). */
  K.dashed = (parent, d, o = {}) => {
    const g = X.svg('g', {}, parent), mid = id('dm');
    const m = X.svg('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -400, y: -400, width: 2720, height: 1880 }, X.defs);
    const mp = X.svg('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': (o.width ?? 4) + 8, 'stroke-linecap': 'round' }, m);
    const p = X.svg('path', { d, fill: 'none', stroke: o.color || K.PAL.teal, 'stroke-width': o.width ?? 4, 'stroke-linecap': 'round', 'stroke-dasharray': (o.dash || [14, 12]).join(' '), mask: `url(#${mid})` }, g);
    gsap.set(mp, { strokeDasharray: '0 99999' });
    return {
      g, path: p, mask: mp,
      draw(t, dur = F(12), ease = 'power1.inOut') { X.drawOn(mp, t, dur, ease); },
      erase(t, dur = F(10), ease = 'power1.in') { K.undraw(mp, t, dur, ease); },
    };
  };

  // ------------------------------------------------------------------ confetti, bursts, fireworks, puffs
  const speck = (g, type, c, R) => {
    const sz = 0.8 + R() * 0.5;
    switch (type) {
      case 'dot': return X.svg('circle', { r: f1(4 + R() * 4), fill: c }, g);
      case 'ring': return X.svg('circle', { r: f1(8 + R() * 6), fill: 'none', stroke: c, 'stroke-width': 3 }, g);
      case 'sparkle': return K.shape(g, P.sparkle(0, 0, 8 * sz + 3), c);
      case 'dash': return X.svg('line', { x1: -12 * sz, x2: 12 * sz, y1: 0, y2: 0, stroke: c, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
      case 'capsule': return X.svg('rect', { x: -8, y: -3.5, width: 16, height: 7, rx: 3.5, fill: c }, g);
      case 'tri': return X.svg('path', { d: 'M0,-7L6.5,5L-6.5,5Z', fill: c }, g);
      default: return X.svg('path', { d: 'M-12,4 C-8,-6 0,-6 2,0 C4,6 10,6 12,-4', fill: 'none', stroke: c, 'stroke-width': 3, 'stroke-linecap': 'round' }, g);
    }
  };
  const TYPES = [['dot', 0.36], ['ring', 0.14], ['sparkle', 0.13], ['dash', 0.16], ['capsule', 0.09], ['curl', 0.07], ['tri', 0.05]];
  const pickType = (r) => { let a = 0; for (const [k, w] of TYPES) { a += w; if (r < a) return k; } return 'dot'; };
  /** Drifting confetti field (screen space). o: {n, seed, colors, avoid:[{x,y,w,h}], bounds, amp, scale}.
   *  Returns {g, specks, in(t, span), out(t, span)}; specks drift 4–10 px on 2–4 s sines, some twinkle, rings/dashes turn. */
  K.confetti = (parent, o = {}) => {
    const R = X.rand(o.seed ?? 11), g = X.svg('g', {}, parent), cols = o.colors || K.CONFETTI, avoid = o.avoid || [];
    const B = o.bounds || { x: 50, y: 40, w: 1820, h: 1000 }, specks = [];
    for (let i = 0; specks.length < (o.n ?? 40) && i < 4000; i++) {
      const x = B.x + R() * B.w, y = B.y + R() * B.h;
      if (avoid.some((a) => x > a.x && x < a.x + a.w && y > a.y && y < a.y + a.h)) continue;
      if (specks.some((s) => Math.hypot(s.x - x, s.y - y) < (o.minGap ?? 56))) continue;
      const outer = X.svg('g', {}, g), inner = X.svg('g', {}, outer);
      const type = (o.types && o.types[Math.floor(R() * o.types.length)]) || pickType(R());
      speck(inner, type, cols[Math.floor(R() * cols.length)], R);
      const a = (o.amp ?? 1) * (4 + R() * 6);
      specks.push({ outer, inner, x, y, ax: a, ay: a * (0.6 + R() * 0.6), px: 2 + R() * 2, py: 2.4 + R() * 2, ph: R() * 6.28,
        r0: R() * 360, spin: type === 'ring' || type === 'dash' || type === 'curl' || type === 'tri' ? (R() - 0.5) * 40 : 0,
        tw: (type === 'sparkle' || R() < 0.15) ? 1.6 + R() * 1.6 : 0, sc: (o.scale ?? 1) * (0.8 + R() * 0.4), depth: 0.5 + R() });
    }
    // optional stream: the whole field travels (parallax by depth) and wraps — "flying through confetti space"
    const st = o.stream, pad = o.wrapPad ?? 60, X0 = B.x - pad, Wd = B.w + 2 * pad, Y0 = B.y - pad, Hd = B.h + 2 * pad;
    const wrap = (v, a, w) => a + ((((v - a) % w) + w) % w);
    X.every((t) => {
      for (const s of specks) {
        let dx = s.ax * Math.sin((t * 6.283) / s.px + s.ph), dy = s.ay * Math.cos((t * 6.283) / s.py + s.ph);
        let fade = 1;
        if (st) {
          const nx = wrap(s.x + dx + (st.vx || 0) * s.depth * t, X0, Wd), ny = wrap(s.y + dy + (st.vy || 0) * s.depth * t, Y0, Hd);
          // shrink near the wrap edges so a band of streaming confetti never pops in or out
          fade = Math.min(1, (st.vx ? Math.min(nx - X0, X0 + Wd - nx) : 1e3) / 70, (st.vy ? Math.min(ny - Y0, Y0 + Hd - ny) : 1e3) / 70);
          dx = nx - s.x; dy = ny - s.y;
        }
        const sc = fade * s.sc * (s.tw ? 0.6 + 0.4 * (0.5 + 0.5 * Math.sin((t * 6.283) / s.tw + s.ph)) : 1);
        s.outer.setAttribute('transform', `translate(${f1(s.x + dx)} ${f1(s.y + dy)}) rotate(${f1(s.r0 + s.spin * t)}) scale(${sc.toFixed(3)})`);
      }
    });
    const ord = specks.map((s, i) => [R(), i]).sort((a, b) => a[0] - b[0]).map((p) => specks[p[1]]);
    return {
      g, specks,
      in(t, span = F(18)) { ord.forEach((s, i) => { gsap.set(s.inner, { scale: 0 }); X.tl.to(s.inner, { scale: 1, duration: F(8), ease: 'back.out(3)' }, t + (span * i) / ord.length); }); },
      out(t, span = F(10)) { ord.forEach((s, i) => X.tl.to(s.inner, { scale: 0, duration: F(6), ease: 'back.in(2)' }, t + (span * i) / ord.length)); },
    };
  };
  /** Payoff confetti burst at (x, y): radial throw (power3.out) + light gravity + shrink. */
  K.burst = (parent, x, y, t, o = {}) => {
    const R = X.rand(o.seed ?? 5), n = o.n ?? 22, cols = o.colors || K.CONFETTI, g = X.svg('g', {}, parent);
    const r0 = o.r0 ?? 60, r1 = o.r1 ?? 260, dur = o.dur ?? F(20);
    for (let i = 0; i < n; i++) {
      const a = (o.a0 ?? 0) + ((o.spread ?? 360) * (i + R() * 0.8)) / n, rad = (a * Math.PI) / 180, dist = r0 + R() * (r1 - r0);
      const pos = X.svg('g', { transform: `translate(${f1(x)} ${f1(y)})` }, g), fall = X.svg('g', {}, pos), mover = X.svg('g', {}, fall);
      const type = ['dot', 'dash', 'sparkle', 'capsule', 'ring', 'tri'][Math.floor(R() * 6)];
      const el = speck(mover, type, cols[Math.floor(R() * cols.length)], R);
      if (type === 'dash') el.setAttribute('transform', `rotate(${f1(a)})`);
      gsap.set(mover, { autoAlpha: 0 });
      X.tl.set(mover, { autoAlpha: 1 }, t);
      X.tl.fromTo(mover, { x: 0, y: 0, scale: 0.4, rotation: 0 }, { x: Math.cos(rad) * dist, y: Math.sin(rad) * dist, scale: 1, rotation: (R() - 0.5) * 300, duration: dur, ease: 'power3.out', immediateRender: false }, t);
      X.tl.fromTo(fall, { y: 0 }, { y: o.gravity ?? 40, duration: dur * 1.2, ease: 'power1.in', immediateRender: false }, t + dur * 0.3);
      X.tl.to(mover, { scale: 0, duration: dur * 0.45, ease: 'power2.in' }, t + dur * 0.8);
    }
    if (o.sfx !== false) X.sfx(t, o.sfx || 'sparkle', { dur: 0.6, gain: o.gain ?? 0.25 });
    return g;
  };
  /** Fireworks: dashed concentric rings (6–8 dashes each) + spokes, expanding and fading. */
  K.rings = (parent, x, y, t, o = {}) => {
    const g = X.svg('g', {}, parent), cols = o.colors || [K.PAL.coral, K.PAL.teal, K.PAL.sun], radii = o.radii || [46, 84, 124];
    radii.forEach((r, i) => {
      const seg = o.dashes ?? 7, C = 2 * Math.PI * r, dash = (C / seg) * 0.55;
      const c = X.svg('circle', { cx: x, cy: y, r, fill: 'none', stroke: cols[i % cols.length], 'stroke-width': o.width ?? 5, 'stroke-linecap': 'round', 'stroke-dasharray': `${f1(dash)} ${f1(C / seg - dash)}` }, g);
      gsap.set(c, { svgOrigin: `${x} ${y}`, scale: 0, opacity: 1 });
      const tt = t + i * F(2);
      X.tl.to(c, { scale: 1, rotation: (i % 2 ? -1 : 1) * 40, duration: F(16), ease: 'power2.out' }, tt)
        .to(c, { opacity: 0, duration: F(7), ease: 'power1.in' }, tt + F(11));
    });
    const sp = o.spokes ?? 8;
    for (let k = 0; k < sp; k++) {
      const a = (k / sp) * 2 * Math.PI + 0.2, r1 = radii[radii.length - 1] * 1.25;
      const l = X.svg('line', { x1: x + Math.cos(a) * r1 * 0.55, y1: y + Math.sin(a) * r1 * 0.55, x2: x + Math.cos(a) * r1, y2: y + Math.sin(a) * r1, stroke: cols[k % cols.length], 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
      gsap.set(l, { svgOrigin: `${x} ${y}`, scale: 0.3, opacity: 0 });
      X.tl.to(l, { scale: 1, opacity: 1, duration: F(8), ease: 'power3.out' }, t + F(3)).to(l, { scale: 1.25, opacity: 0, duration: F(8), ease: 'power1.in' }, t + F(11));
    }
    if (o.sfx !== false) X.sfx(t, o.sfx || 'pop', { gain: o.gain ?? 0.3, pitch: o.pitch ?? 0.8 });
    return g;
  };
  /** Landing dust (T10): puffs balloon out (7 f) then dissolve into teal line curls (10 f). */
  K.puffs = (parent, x, y, t, o = {}) => {
    const g = X.svg('g', {}, parent), col = o.color || '#ddd6ff', s = o.scale ?? 1;
    const spots = o.spots || [[-118, -14, 30], [-74, -34, 40], [-22, -44, 34], [30, -40, 38], [80, -26, 34], [120, -10, 24]];
    spots.forEach(([dx, dy, r], i) => {
      const c = X.svg('circle', { cx: x + dx * s, cy: y + dy * s, r: r * s, fill: col }, g);
      gsap.set(c, { transformOrigin: '50% 100%', scale: 0 });
      X.tl.to(c, { scale: 1, x: dx * 0.25 * s, duration: F(7), ease: 'power2.out' }, t + i * F(0.6))
        .to(c, { scale: 0, duration: F(8), ease: 'power2.in' }, t + F(9) + i * F(0.6));
      if (i % 2 === 0) {
        const sx = x + dx * s * 1.35, sy = y + dy * s - r * 0.6, dir = dx < 0 ? -1 : 1;
        const curl = K.line(g, `M${sx},${sy} c${dir * 10},-6 ${dir * 22},2 ${dir * 16},12 c${-dir * 5},7 ${-dir * 14},2 ${-dir * 10},-5`, o.curl || K.PAL.teal, 3);
        K.draw(curl, t + F(9), F(8), 'power1.out'); K.undraw(curl, t + F(19), F(8));
      }
    });
    if (o.sfx !== false) X.sfx(t, 'woosh_low', { dur: 0.35, gain: 0.22 });
    return g;
  };

  /** Background doodle traffic: a small paper plane (or comet dot) crossing on a long arc with a dashed trail.
   *  Keeps white frames alive between beats; route it along the edges, never across the hub. */
  K.flyby = (parent, t, d, o = {}) => {
    const dur = o.dur ?? 2.6, ease = o.ease || 'sine.inOut';
    const trail = K.dashed(parent, d, { color: o.trail || K.PAL.hubLight, width: o.width ?? 3, dash: o.dash || [10, 11] });
    const obj = X.svg('g', {}, parent);
    if (o.kind === 'comet') { X.svg('circle', { r: o.size ? o.size / 4 : 9, fill: o.color || K.PAL.coral }, obj); }
    else K.plane(obj, 0, 0, o.size ?? 62, { color: o.color || K.PAL.hub, wing: 'rgba(0,0,0,0.18)' });
    gsap.set(obj, { autoAlpha: 0 });
    X.tl.set(obj, { autoAlpha: 1 }, t);
    X.tl.to(obj, { motionPath: { path: d, autoRotate: true }, duration: dur, ease }, t);
    X.tl.set(obj, { autoAlpha: 0 }, t + dur);
    trail.draw(t, dur, ease); trail.erase(t + dur * 0.3, dur * 0.9, ease);
    if (o.sfx) X.sfx(t, o.sfx, { dur: Math.min(dur, 1.2), gain: 0.12 });
    return obj;
  };

  // ------------------------------------------------------------------ worlds (full-bleed colour fields)
  /** A full-bleed flat field clipped by an animatable rect (card blow-up) or circle (iris).
   *  Content goes in w.content (centred composition), idle specks are built in. */
  K.world = (parent, color, o = {}) => {
    const g = X.svg('g', {}, parent), cid = id('wclip');
    gsap.set(g, { autoAlpha: 0 });
    const cp = X.svg('clipPath', { id: cid, clipPathUnits: 'userSpaceOnUse' }, X.defs);
    const rc = X.svg('rect', { x: -20, y: -20, width: 1960, height: 1120, rx: 0 }, cp);
    const cc = X.svg('circle', { cx: 960, cy: 540, r: 0 }, cp);
    const inner = X.svg('g', { 'clip-path': `url(#${cid})` }, g);
    const bg = X.svg('rect', { x: -20, y: -20, width: 1960, height: 1120, fill: color }, inner);
    const zoom = X.svg('g', {}, inner);
    gsap.set(zoom, { svgOrigin: '960 540' });
    const specks = K.confetti(zoom, { n: o.specks ?? 24, seed: o.seed ?? 31, colors: o.speckColors || ['#ffffff', '#ffffff', 'rgba(255,255,255,0.6)'],
      avoid: o.avoid || [{ x: 560, y: 220, w: 800, h: 640 }], types: o.speckTypes || ['dot', 'dot', 'ring', 'sparkle', 'dash', 'capsule'], amp: 1.2,
      stream: o.stream === undefined ? { vx: -56, vy: 12 } : o.stream, scale: o.speckScale ?? 1.2 });
    const content = X.svg('g', {}, zoom);
    const W = { g, inner, bg, zoom, content, specks, rc, cc, color };
    const FULL = { x: -20, y: -20, width: 1960, height: 1120, rx: 0 };
    W.show = (t) => X.tl.set(g, { autoAlpha: 1 }, t);
    W.hide = (t) => X.tl.set(g, { autoAlpha: 0 }, t);
    W.reset = (t) => { X.tl.set(zoom, { scale: 1, x: 0, y: 0 }, t); X.tl.set(content, { opacity: 1 }, t); };
    /** T2 core: grow from a card box {x,y,w,h,rx} to the full frame. */
    W.openFrom = (b, t, dur = F(8), ease = 'power3.inOut') => {
      W.show(t); W.reset(t); X.tl.set(cc, { attr: { r: 0 } }, t);
      X.tl.fromTo(rc, { attr: { x: b.x, y: b.y, width: b.w, height: b.h, rx: b.rx ?? 10 } }, { attr: FULL, duration: dur, ease, immediateRender: false }, t);
    };
    /** T3 core: shrink back to a card box; content scales into it and fades in the last frames. */
    W.closeTo = (b, t, dur = F(8), ease = 'power3.inOut') => {
      X.tl.set(cc, { attr: { r: 0 } }, t);
      X.tl.fromTo(rc, { attr: FULL }, { attr: { x: b.x, y: b.y, width: b.w, height: b.h, rx: b.rx ?? 10 }, duration: dur, ease, immediateRender: false }, t);
      X.tl.to(zoom, { scale: b.h / 1080 * 1.4, x: b.x + b.w / 2 - 960, y: b.y + b.h / 2 - 540, duration: dur, ease }, t);
      X.tl.to(content, { opacity: 0, duration: F(3) }, t + dur - F(3));
      W.hide(t + dur + F(1));
    };
    /** T5 core: iris open from a dot (cx, cy, r0) past the frame diagonal. */
    W.irisFrom = (cx, cy, r0, t, dur = F(13), ease = 'power2.inOut') => {
      W.show(t); W.reset(t); X.tl.set(rc, { attr: { width: 0, height: 0 } }, t);
      X.tl.fromTo(cc, { attr: { cx, cy, r: r0 } }, { attr: { r: 2300 }, duration: dur, ease, immediateRender: false }, t);
    };
    W.irisTo = (cx, cy, t, dur = F(12), ease = 'power2.inOut') => {
      X.tl.set(rc, { attr: { width: 0, height: 0 } }, t);
      X.tl.fromTo(cc, { attr: { cx, cy, r: 2300 } }, { attr: { r: 0 }, duration: dur, ease, immediateRender: false }, t);
      W.hide(t + dur + F(1));
    };
    return W;
  };

  // ------------------------------------------------------------------ the hub: a phone with domed caps and a card feed
  /** o: {cx, cy, w, h, capH, r, color, dark, groundY, cardColors:[...]}. Geometry defaults = 22 % W × 48 % H at 1080p. */
  K.hub = (parent, o = {}) => {
    const cx = o.cx ?? 960, cy = o.cy ?? 440, Wd = o.w ?? 250, Ht = o.h ?? 520, capH = o.capH ?? 76, r = o.r ?? 62;
    const col = o.color || K.PAL.hub, dark = o.dark || K.PAL.hubDark, groundY = o.groundY ?? 800;
    const x0 = cx - Wd / 2, yT = cy - Ht / 2, yB = cy + Ht / 2, sT = yT + capH, sB = yB - capH, shift = Ht / 2 - capH;
    const H = { cx, cy, w: Wd, h: Ht, capH, x0, yT, yB, sT, sB, shift, groundY, color: col };
    const g = (H.g = X.svg('g', { class: 'hub' }, parent));
    gsap.set(g, { svgOrigin: `${cx} ${cy}` });
    // base: ground line + cable + plug
    const base = (H.base = X.svg('g', {}, g));
    H.ground = X.svg('line', { x1: cx - 110, x2: cx + 110, y1: groundY, y2: groundY, stroke: K.PAL.teal, 'stroke-width': 3, 'stroke-linecap': 'round' }, base);
    H.cable = X.svg('line', { x1: cx, x2: cx, y1: yB, y2: groundY, stroke: K.PAL.teal, 'stroke-width': 4, 'stroke-linecap': 'round' }, base);
    H.plug = X.svg('rect', { x: cx - 10, y: yB - 2, width: 20, height: 13, rx: 4, fill: dark }, base);
    gsap.set(base, { svgOrigin: `${cx} ${groundY}` });
    // screen
    const screen = (H.screen = X.svg('g', {}, g));
    gsap.set(screen, { svgOrigin: `${cx} ${cy}` });
    H.scrBg = X.svg('rect', { x: x0, y: sT - 3, width: Wd, height: sB - sT + 6, fill: '#ffffff' }, screen);
    H.sides = [x0 + 3, x0 + Wd - 3].map((x) => X.svg('line', { x1: x, x2: x, y1: sT, y2: sB, stroke: K.PAL.hubPale, 'stroke-width': 6 }, screen));
    const vid = id('hubclip'), cp = X.svg('clipPath', { id: vid, clipPathUnits: 'userSpaceOnUse' }, X.defs);
    X.svg('rect', { x: x0 + 6, y: sT + 30, width: Wd - 12, height: sB - sT - 30 }, cp);
    H.view = X.svg('g', { 'clip-path': `url(#${vid})` }, screen);
    H.appbar = X.svg('g', {}, screen);
    H.appbarBg = X.svg('rect', { x: x0 + 6, y: sT, width: Wd - 12, height: 30, fill: K.PAL.hubPale }, H.appbar);
    X.svg('circle', { cx: x0 + 24, cy: sT + 15, r: 7, fill: col }, H.appbar);
    X.svg('rect', { x: x0 + 38, y: sT + 11, width: 60, height: 8, rx: 4, fill: K.PAL.hubLight }, H.appbar);
    X.svg('circle', { cx: x0 + Wd - 24, cy: sT + 15, r: 6, fill: K.PAL.hubLight }, H.appbar);
    // caps (+ details) — laid out OPEN; closed = top +shift / bottom −shift
    const capTop = `M${x0},${sT}L${x0},${yT + r}C${x0},${yT + r * (1 - kk)} ${x0 + r * (1 - kk)},${yT} ${x0 + r},${yT}Q${cx},${yT - 7} ${x0 + Wd - r},${yT}` +
      `C${x0 + Wd - r * (1 - kk)},${yT} ${x0 + Wd},${yT + r * (1 - kk)} ${x0 + Wd},${yT + r}L${x0 + Wd},${sT}Z`;
    const capBot = `M${x0},${sB}L${x0 + Wd},${sB}L${x0 + Wd},${yB - r}C${x0 + Wd},${yB - r * (1 - kk)} ${x0 + Wd - r * (1 - kk)},${yB} ${x0 + Wd - r},${yB}` +
      `Q${cx},${yB + 7} ${x0 + r},${yB}C${x0 + r * (1 - kk)},${yB} ${x0},${yB - r * (1 - kk)} ${x0},${yB - r}Z`;
    H.top = X.svg('g', {}, g); H.bot = X.svg('g', {}, g);
    K.shape(H.top, capTop, col);
    X.svg('rect', { x: cx - 24, y: yT + 30, width: 48, height: 9, rx: 4.5, fill: dark }, H.top);
    X.svg('circle', { cx: cx + 46, cy: yT + 34.5, r: 6, fill: dark }, H.top);
    K.shape(H.bot, capBot, col);
    X.svg('rect', { x: cx - 25, y: yB - 46, width: 50, height: 18, rx: 9, fill: '#fff' }, H.bot);
    X.svg('rect', { x: cx - 18, y: yB - 41, width: 36, height: 8, rx: 4, fill: col }, H.bot);
    // silhouette for morphs (closed pill by default)
    H.pillD = P.rrect(x0, cy - capH, Wd, capH * 2, r, r);
    H.bodyD = P.rrect(x0, yT, Wd, Ht, r, r);
    H.sil = K.shape(g, H.pillD, col);
    gsap.set(H.sil, { autoAlpha: 0 });

    // ---- feed (a page) + other pages
    const pitch = o.pitch ?? 204, feedTop = sT + 40;
    H.pages = {}; H.cur = 'feed';
    H.page = (name) => {
      if (!H.pages[name]) { H.pages[name] = X.svg('g', {}, H.view); if (name !== 'feed') gsap.set(H.pages[name], { x: Wd }); }
      return H.pages[name];
    };
    H.feed = X.svg('g', {}, H.page('feed'));
    H.cards = [];
    const BW = Wd - 28, BX = x0 + 14;
    /** Add a feed card: {color (image block = its world colour), avatar, motif(g, cx, cy) draws a tiny white icon}. */
    H.addCard = (spec = {}) => {
      const i = H.cards.length, y = feedTop + i * pitch, c = X.svg('g', {}, H.feed);
      const head = X.svg('g', {}, c);
      X.svg('circle', { cx: BX + 11, cy: y + 13, r: 10, fill: spec.avatar || K.PAL.lav }, head);
      X.svg('rect', { x: BX + 28, y: y + 6, width: 104, height: 8, rx: 4, fill: K.PAL.bar }, head);
      X.svg('rect', { x: BX + 28, y: y + 18, width: 64, height: 6, rx: 3, fill: K.PAL.barLight }, head);
      const blockG = X.svg('g', {}, c);
      const block = X.svg('rect', { x: BX, y: y + 34, width: BW, height: 124, rx: 10, fill: spec.color || K.PAL.sky }, blockG);
      const motif = X.svg('g', {}, blockG);
      if (spec.motif) spec.motif(motif, BX + BW / 2, y + 96);
      const foot = X.svg('g', {}, c);
      K.shape(foot, P.heart(BX + 12, y + 174, 18), K.PAL.coral);
      X.svg('rect', { x: BX + 30, y: y + 166, width: 15, height: 17, rx: 2, fill: 'none', stroke: K.PAL.bar, 'stroke-width': 2.5 }, foot);
      X.svg('rect', { x: BX + BW - 70, y: y + 171, width: 70, height: 7, rx: 3.5, fill: K.PAL.barLight }, foot);
      X.svg('line', { x1: BX, x2: BX + BW, y1: y + pitch - 8, y2: y + pitch - 8, stroke: K.PAL.barLight, 'stroke-width': 2 }, c);
      const card = { g: c, head, blockG, block, motif, foot, i };
      H.cards.push(card);
      return card;
    };
    const off = (i) => cy - (feedTop + i * pitch + 96);
    H.off = off;
    H.focus = (i, t, dur = F(9), ease = 'back.inOut(1.2)') => X.tl.to(H.feed, { y: off(i), duration: dur, ease }, t);
    /** Idle life on the home screen: the feed drifts like a live timeline (dy px over dur s). */
    H.drift = (t, dur, dy = -50) => X.tl.to(H.feed, { y: `+=${dy}`, duration: dur, ease: 'sine.inOut' }, t);
    H.setFocus = (i, t) => X.tl.set(H.feed, { y: off(i) }, t);
    gsap.set(H.feed, { y: off(0) });
    /** Box of the focused card's image block (the seed of every blow-up). */
    H.box = () => ({ x: BX, y: cy - 62, w: BW, h: 124, rx: 10 });
    H.pageBox = { x: x0 + 6, y: sT + 30, w: Wd - 12, h: sB - sT - 30 };
    /** Pop the cards in, top to bottom, 2–3 f stagger (header → block → motif → footer). */
    H.cardsIn = (t, n = 3) => {
      H.cards.slice(0, n).forEach((c, k) => [c.head, c.blockG, c.motif, c.foot].forEach((el, j) => {
        gsap.set(el, { transformOrigin: '50% 50%', scale: 0 });
        X.tl.to(el, { scale: 1, duration: F(8), ease: 'back.out(2.2)' }, t + F(3) * (k * 3 + j));
      }));
      X.sfx(t, 'pop', { gain: 0.22, pitch: 1.1 }); X.sfx(t + F(9), 'pop', { gain: 0.2, pitch: 1.3 });
    };
    /** Slide pages like app navigation (new page from the right). */
    H.showPage = (name, t, dur = F(9)) => {
      const nw = H.page(name), old = H.pages[H.cur];
      if (old === nw) return;
      X.tl.fromTo(old, { x: 0 }, { x: -Wd, duration: dur, ease: 'power3.inOut', immediateRender: false }, t);
      X.tl.fromTo(nw, { x: Wd }, { x: 0, duration: dur, ease: 'power3.inOut', immediateRender: false }, t);
      H.cur = name;
      X.sfx(t, 'slide', { dur: 0.25, gain: 0.18, pitch: 1.4 });
    };
    H.setPage = (name, t) => {
      const nw = H.page(name);
      Object.entries(H.pages).forEach(([k, p]) => X.tl.set(p, { x: p === nw ? 0 : Wd }, t));
      H.cur = name;
    };

    // ---- states
    /** Closed pill state (before T1): caps together, screen squashed, silhouette hidden. */
    H.closed = () => { gsap.set(H.top, { y: shift }); gsap.set(H.bot, { y: -shift }); gsap.set(screen, { scaleY: 0 }); };
    /** T1 hub split-open reveal: the pill splits at mid-height, caps out (6 f), white screen in the gap, cards pop. */
    H.splitOpen = (t, o2 = {}) => {
      X.tl.set(H.sil, { autoAlpha: 0 }, t);
      X.tl.set([H.top, H.bot], { autoAlpha: 1 }, t);
      X.tl.fromTo(H.top, { y: shift }, { y: 0, duration: F(7), ease: 'back.out(1.6)', immediateRender: false }, t);
      X.tl.fromTo(H.bot, { y: -shift }, { y: 0, duration: F(7), ease: 'back.out(1.6)', immediateRender: false }, t);
      X.tl.fromTo(screen, { scaleY: 0 }, { scaleY: 1, duration: F(7), ease: 'power3.out', immediateRender: false }, t);
      X.tl.fromTo(H.cable, { attr: { y1: cy + capH } }, { attr: { y1: yB }, duration: F(7), ease: 'back.out(1.6)', immediateRender: false }, t);
      X.tl.fromTo(H.plug, { y: -shift }, { y: 0, duration: F(7), ease: 'back.out(1.6)', immediateRender: false }, t);
      X.sfx(t, 'swoosh', { dur: 0.25, gain: 0.3, pitch: 1.2 });
      if (o2.cards !== false) H.cardsIn(t + F(5), o2.cards ?? 3);
    };
    /** T2 card blow-up: 2 f anticipation squeeze, caps fly out (expo.in), the card's block grows into the world. */
    H.blowUp = (world, t, o2 = {}) => {
      X.tl.to(H.top, { y: 9, duration: F(2), ease: 'power2.out' }, t)
        .to(H.bot, { y: -9, duration: F(2), ease: 'power2.out' }, t)
        .to(H.top, { y: -780, duration: F(5), ease: 'expo.in' }, t + F(2))
        .to([H.bot, base], { y: 780, duration: F(5), ease: 'expo.in' }, t + F(2));
      X.tl.to(screen, { opacity: 0, duration: F(3) }, t + F(3));
      world.openFrom(H.box(), t + F(2), o2.dur ?? F(8));
      X.sfx(t + F(1), 'whoosh', { dur: 0.32, gain: 0.4 });
      H.isOut = true;
      return t + F(10);
    };
    /** T3 world collapse: field shrinks to the card while the caps slide back in (overlapping), hub settles. */
    H.collapse = (world, t, o2 = {}) => {
      world.closeTo(H.box(), t, o2.dur ?? F(8));
      X.tl.set(screen, { scaleY: 1 }, t);
      X.tl.fromTo(screen, { opacity: 0 }, { opacity: 1, duration: F(3), immediateRender: false }, t + F(4));
      X.tl.fromTo(H.top, { y: -780 }, { y: 0, duration: F(7), ease: 'back.out(1.25)', immediateRender: false }, t + F(2));
      X.tl.fromTo([H.bot, base], { y: 780 }, { y: 0, duration: F(7), ease: 'back.out(1.25)', immediateRender: false }, t + F(2));
      X.sfx(t, 'swoosh', { dur: 0.3, gain: 0.32, pitch: 0.9 });
      H.isOut = false;
      return t + F(9);
    };
    /** T4 push-through: the hub rushes the camera (×2.3, expo.in) and the card becomes the world. */
    H.pushThrough = (world, t, o2 = {}) => {
      const b = H.box(), s = o2.scale ?? 2.3, bcx = b.x + b.w / 2, bcy = b.y + b.h / 2;
      X.tl.fromTo(g, { scale: 1 }, { scale: s, duration: F(5), ease: 'expo.in', immediateRender: false }, t);
      const sb = { x: cx + (b.x - cx) * s, y: cy + (b.y - cy) * s, w: b.w * s, h: b.h * s, rx: 10 * s };
      world.openFrom(sb, t + F(4), F(7));
      X.tl.set(g, { scale: 1 }, t + F(12));
      X.tl.set(H.top, { y: -780 }, t + F(12)); X.tl.set([H.bot, base], { y: 780 }, t + F(12)); X.tl.set(screen, { opacity: 0 }, t + F(12));
      X.sfx(t, 'zoom_in', { dur: 0.35, gain: 0.3 });
      H.isOut = true;
      void bcx; void bcy;
      return t + F(11);
    };
    /** T5 close: caps converge like a closing mouth (4 f), pill → dot (5 f, back.in). Returns {x, y, r, t}. */
    H.closeToDot = (t, o2 = {}) => {
      const rDot = o2.r ?? 22;
      X.tl.to(H.top, { y: shift, duration: F(4), ease: 'power2.in' }, t)
        .to(H.bot, { y: -shift, duration: F(4), ease: 'power2.in' }, t)
        .to(screen, { scaleY: 0, duration: F(4), ease: 'power2.in' }, t)
        .to(base, { scaleX: 0, opacity: 0, duration: F(5), ease: 'power2.in' }, t);
      X.tl.set(H.sil, { autoAlpha: 1, morphSVG: H.pillD }, t + F(4));
      X.tl.set([H.top, H.bot], { autoAlpha: 0 }, t + F(4));
      K.morph(H.sil, P.circle(cx, cy, rDot), t + F(4), F(5), 'back.in(1.6)');
      X.sfx(t, 'zoom_out', { dur: 0.3, gain: 0.25 });
      return { x: cx, y: cy, r: rDot, t: t + F(9) };
    };
    /** Put the hub back into the "blown-out" state while hidden behind a world (so H.collapse can bring it home). */
    H.resetOut = (t) => {
      X.tl.set(H.sil, { autoAlpha: 0, morphSVG: H.pillD }, t);
      X.tl.set([H.top, H.bot], { autoAlpha: 1 }, t);
      X.tl.set(H.top, { y: -780 }, t); X.tl.set([H.bot, base], { y: 780 }, t);
      X.tl.set(base, { scaleX: 1, opacity: 1 }, t);
      X.tl.set(screen, { scaleY: 1, opacity: 0 }, t);
      H.isOut = true;
    };
    /** T8: screen fills solid (2 f), body silhouette swaps in and morphs into another object path. */
    H.morphTo = (d, t, dur = F(10), o2 = {}) => {
      X.tl.to(H.scrBg, { attr: { fill: col }, duration: F(2) }, t);
      X.tl.to([H.view, H.appbar, ...H.sides], { opacity: 0, duration: F(2) }, t);
      X.tl.set(H.sil, { autoAlpha: 1, morphSVG: H.bodyD }, t + F(2));
      X.tl.set([H.top, H.bot, screen], { autoAlpha: 0 }, t + F(2));
      K.morph(H.sil, d, t + F(2), dur, o2.ease || 'power2.inOut', { fill: o2.fill });
      if (o2.base !== false) X.tl.to(base, { scaleX: 0, opacity: 0, duration: F(6), ease: 'power2.in' }, t + F(2));
      X.sfx(t + F(2), 'swoosh', { dur: 0.35, gain: 0.3, pitch: 0.8 });
      return t + F(2) + dur;
    };
    return H;
  };

  // ------------------------------------------------------------------ objects (2–5 primitives each, no outlines)
  /** Envelope: body + flap V + optional heart seal. Origin = centre. */
  K.envelope = (parent, cx, cy, w, o = {}) => {
    const h = w * 0.66, g = X.svg('g', {}, parent);
    const body = K.shape(g, P.rrect(cx - w / 2, cy - h / 2, w, h, w * 0.06), o.color || '#fff');
    const flap = K.line(g, `M${cx - w / 2 + w * 0.06},${cy - h / 2 + w * 0.06}L${cx},${cy + h * 0.08}L${cx + w / 2 - w * 0.06},${cy - h / 2 + w * 0.06}`, o.flap || K.PAL.bar, Math.max(3, w * 0.035));
    const seal = o.seal === false ? null : K.shape(g, P.heart(cx, cy + h * 0.06, w * 0.2), o.seal || K.PAL.coral);
    return { g, body, flap, seal, cx, cy, w, h };
  };
  /** Paper plane (pointing right) — body + darker lower wing. */
  K.plane = (parent, cx, cy, s, o = {}) => {
    const g = X.svg('g', {}, parent);
    const body = K.shape(g, P.plane(cx, cy, s), o.color || '#fff');
    const wing = K.shape(g, P.planeWing(cx, cy, s), o.wing || 'rgba(0,0,0,0.14)');
    return { g, body, wing };
  };
  /** Frontal arch mailbox on a post: {g, body, door, inside, knob, flag (group, pivot at its foot), post}. Flag starts DOWN. */
  K.mailbox = (parent, o = {}) => {
    const cx = o.cx ?? 960, top = o.top ?? 330, w = o.w ?? 240, h = o.h ?? 212, groundY = o.groundY ?? 800, col = o.color || K.PAL.hub;
    const g = X.svg('g', {}, parent), bottom = top + h;
    const post = K.shape(g, P.rrect(cx - 16, bottom - 6, 32, groundY - bottom + 6, 4, 0), o.post || K.PAL.hubDark);
    const box = X.svg('g', {}, g);
    const body = K.shape(box, P.loaf(cx - w / 2, top, w, h, 12), col);
    const inside = K.shape(box, P.loaf(cx - w / 2 + 26, top + 30, w - 52, h - 52, 8), K.PAL.ink);
    const door = K.shape(box, P.loaf(cx - w / 2 + 26, top + 30, w - 52, h - 52, 8), o.door || K.PAL.hubDark);
    const knob = X.svg('circle', { cx, cy: top + h * 0.62, r: 9, fill: '#fff' }, box);
    const slot = X.svg('rect', { x: cx - 44, y: top + h * 0.36, width: 88, height: 10, rx: 5, fill: K.PAL.hubLight }, box);
    const flag = X.svg('g', {}, box), px = cx + w / 2 + 2, py = top + h * 0.62;
    K.shape(flag, P.rrect(px - 4, py - 118, 12, 118, 6, 3), o.pole || K.PAL.ink);
    K.shape(flag, P.rrect(px + 4, py - 118, 54, 34, 6, 6), o.flag || K.PAL.coral);
    gsap.set(flag, { svgOrigin: `${px} ${py}`, rotation: 90 });
    gsap.set(door, { svgOrigin: `${cx} ${bottom - 22}` });
    gsap.set(box, { svgOrigin: `${cx} ${bottom}` });
    gsap.set(post, { svgOrigin: `${cx} ${groundY}` });
    const M = { g, box, body, inside, door, knob, slot, flag, post, cx, top, w, h, bottom, groundY, doorPoint: { x: cx, y: top + h * 0.55 } };
    M.flagUp = (t) => {
      X.tl.to(flag, { rotation: 104, duration: F(3), ease: 'power2.out' }, t)
        .to(flag, { rotation: 0, duration: F(10), ease: 'back.out(3)' }, t + F(3));
      X.sfx(t + F(3), 'boing', { gain: 0.24, pitch: 1.4 });
    };
    M.flagDown = (t) => X.tl.to(flag, { rotation: 90, duration: F(6), ease: 'power2.inOut' }, t);
    M.open = (t) => { X.tl.to(door, { scaleY: -0.18, duration: F(4), ease: 'power3.in' }, t); X.tl.to(knob, { opacity: 0, duration: F(2) }, t); X.sfx(t, 'click', { gain: 0.25, pitch: 0.7 }); };
    M.close = (t) => { X.tl.to(door, { scaleY: 1, duration: F(8), ease: 'back.out(2.2)' }, t); X.tl.to(knob, { opacity: 1, duration: F(2) }, t + F(4)); X.sfx(t + F(3), 'click', { gain: 0.2 }); };
    /** Rise from the ground line: post grows, box pops with stretch → settle. */
    M.rise = (t) => {
      gsap.set(post, { scaleY: 0 }); gsap.set(box, { scale: 0 });
      X.tl.to(post, { scaleY: 1, duration: F(7), ease: 'back.out(1.8)' }, t)
        .fromTo(box, { scaleX: 0.3, scaleY: 0 }, { scaleX: 0.86, scaleY: 1.18, duration: F(6), ease: 'power2.out', immediateRender: false }, t + F(4))
        .to(box, { scaleX: 1, scaleY: 1, duration: F(12), ease: 'elastic.out(1, 0.45)' }, t + F(10));
      X.sfx(t + F(4), 'boing', { gain: 0.28, pitch: 0.9 });
    };
    return M;
  };
  /** Postage stamp with perforated edge (perforations in the card colour `bg`). */
  K.stamp = (parent, cx, cy, w, o = {}) => {
    const g = X.svg('g', {}, parent), h = w * 1.15, col = o.color || K.PAL.coral, bg = o.bg || '#fff';
    K.shape(g, P.rrect(cx - w / 2, cy - h / 2, w, h, 3), col);
    const n = 5, rr = w * 0.055;
    for (let i = 0; i <= n; i++) {
      [[cx - w / 2 + (w * i) / n, cy - h / 2], [cx - w / 2 + (w * i) / n, cy + h / 2]].forEach(([x, y]) => X.svg('circle', { cx: x, cy: y, r: rr, fill: bg }, g));
      [[cx - w / 2, cy - h / 2 + (h * i) / n], [cx + w / 2, cy - h / 2 + (h * i) / n]].forEach(([x, y]) => X.svg('circle', { cx: x, cy: y, r: rr, fill: bg }, g));
    }
    X.svg('rect', { x: cx - w * 0.32, y: cy - h * 0.32, width: w * 0.64, height: h * 0.64, rx: 2, fill: o.inner || '#fff' }, g);
    if (o.motif !== false) K.shape(g, P.heart(cx, cy + h * 0.02, w * 0.4), o.motifColor || col);
    return g;
  };
  /** Postcard: white card, photo block on the left half, address lines + stamp on the right. */
  K.postcard = (parent, cx, cy, w, o = {}) => {
    const h = w * 0.64, g = X.svg('g', {}, parent), x = cx - w / 2, y = cy - h / 2;
    const card = K.shape(g, P.rrect(x, y, w, h, w * 0.04), '#fff');
    const photo = X.svg('rect', { x: x + w * 0.05, y: y + h * 0.08, width: w * 0.46, height: h * 0.84, rx: w * 0.025, fill: o.photo || K.PAL.sky }, g);
    const motif = X.svg('g', {}, g);
    if (o.motif) o.motif(motif, x + w * 0.28, y + h * 0.5, w);
    const lines = [0.46, 0.62, 0.78].map((k, i) => X.svg('rect', { x: x + w * 0.58, y: y + h * k, width: w * (i === 2 ? 0.2 : 0.32), height: Math.max(4, w * 0.022), rx: 2, fill: K.PAL.bar }, g));
    const stampAt = { x: x + w * 0.86, y: y + h * 0.24, w: w * 0.13 };
    return { g, card, photo, motif, lines, stampAt, cx, cy, w, h };
  };
  /** Avatar bust in a circle (no face details — generic). */
  K.avatar = (parent, cx, cy, r, color, o = {}) => {
    const g = X.svg('g', {}, parent), cid = id('av');
    const cp = X.svg('clipPath', { id: cid }, X.defs); X.svg('circle', { cx, cy, r }, cp);
    X.svg('circle', { cx, cy, r, fill: color }, g);
    const inner = X.svg('g', { 'clip-path': `url(#${cid})` }, g);
    X.svg('circle', { cx, cy: cy - r * 0.12, r: r * 0.36, fill: o.skin || '#ffd9c2' }, inner);
    X.svg('ellipse', { cx, cy: cy + r * 0.82, rx: r * 0.72, ry: r * 0.5, fill: o.shirt || '#fff' }, inner);
    return g;
  };
  K.pin = (parent, cx, cy, s, color = K.PAL.coral) => {
    const g = X.svg('g', {}, parent);
    K.shape(g, P.pin(cx, cy, s), color);
    X.svg('circle', { cx, cy: cy - s * 0.16, r: s * 0.13, fill: '#fff' }, g);
    return g;
  };
  K.cloud = (parent, cx, cy, s, color = '#fff') => {
    const g = X.svg('g', {}, parent);
    K.shape(g, P.pill(cx, cy + s * 0.12, s, s * 0.34), color);
    X.svg('circle', { cx: cx - s * 0.14, cy: cy - s * 0.02, r: s * 0.2, fill: color }, g);
    X.svg('circle', { cx: cx + s * 0.12, cy: cy - s * 0.08, r: s * 0.25, fill: color }, g);
    return g;
  };
  /** Logo mark (original): brand circle + tilted perforated stamp holding a tiny sunset. Parts pop with stagger. */
  K.mark = (parent, cx, cy, r, o = {}) => {
    const g = X.svg('g', {}, parent);
    const disc = K.shape(g, P.circle(cx, cy, r), o.color || K.PAL.hub);
    const st = X.svg('g', {}, g);
    const sw = r * 0.92, sh = r * 1.04;
    K.shape(st, P.rrect(cx - sw / 2, cy - sh / 2, sw, sh, 4), '#fff');
    const n = 5, pr = r * 0.055;
    for (let i = 0; i <= n; i++) {
      X.svg('circle', { cx: cx - sw / 2 + (sw * i) / n, cy: cy - sh / 2, r: pr, fill: o.color || K.PAL.hub }, st);
      X.svg('circle', { cx: cx - sw / 2 + (sw * i) / n, cy: cy + sh / 2, r: pr, fill: o.color || K.PAL.hub }, st);
      X.svg('circle', { cx: cx - sw / 2, cy: cy - sh / 2 + (sh * i) / n, r: pr, fill: o.color || K.PAL.hub }, st);
      X.svg('circle', { cx: cx + sw / 2, cy: cy - sh / 2 + (sh * i) / n, r: pr, fill: o.color || K.PAL.hub }, st);
    }
    const ix = cx - sw * 0.34, iy = cy - sh * 0.34, iw = sw * 0.68, ih = sh * 0.68;
    const scene = X.svg('g', {}, st);
    const cid = id('mk'); const cp = X.svg('clipPath', { id: cid }, X.defs); X.svg('rect', { x: ix, y: iy, width: iw, height: ih, rx: 3 }, cp);
    const sceneIn = X.svg('g', { 'clip-path': `url(#${cid})` }, scene);
    X.svg('rect', { x: ix, y: iy, width: iw, height: ih, fill: K.PAL.sky }, sceneIn);
    const sun = X.svg('circle', { cx: cx, cy: iy + ih * 0.62, r: iw * 0.22, fill: K.PAL.sun }, sceneIn);
    X.svg('rect', { x: ix, y: iy + ih * 0.66, width: iw, height: ih * 0.34, fill: K.PAL.mint }, sceneIn);
    K.line(sceneIn, P.wave(ix - 4, ix + iw + 4, iy + ih * 0.8, ih * 0.05, iw * 0.34), '#fff', Math.max(2.5, r * 0.035));
    gsap.set(st, { svgOrigin: `${cx} ${cy}`, rotation: -8 });
    return { g, disc, stamp: st, scene, sun, cx, cy, r };
  };
  /** Lowercase wordmark whose letters bounce in one by one (2 f stagger). */
  K.wordmark = (parent, x, y, str, t, o = {}) => {
    const size = o.size ?? 120, weight = o.weight ?? 600, fam = o.family || 'Fredoka', g = X.svg('g', {}, parent);
    const total = K.textW(str, size, weight, fam) + (str.length - 1) * (o.spacing ?? 0);
    let cx = x - total / 2;
    [...str].forEach((ch, i) => {
      const w = K.textW(ch, size, weight, fam);
      const el = K.text(g, cx + w / 2, y, ch, { size, weight, family: fam, color: o.color || K.PAL.ink });
      gsap.set(el, { transformOrigin: '50% 100%', scaleY: 0, scaleX: 0.6, y: 0 });
      X.tl.to(el, { scaleY: 1.2, scaleX: 0.9, y: -18, duration: F(5), ease: 'power2.out' }, t + i * F(2))
        .to(el, { scaleY: 1, scaleX: 1, y: 0, duration: F(10), ease: 'bounce.out' }, t + i * F(2) + F(5));
      cx += w + (o.spacing ?? 0);
    });
    if (o.sfx !== false) X.sfx(t, 'blip_up', { gain: 0.16 });
    return g;
  };
})();
