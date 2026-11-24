/* explainer-flat-character kit — grain-pastel 2D character explainer helpers for explainer-engine.
 *
 * Load order in index.html: gsap (+MorphSVGPlugin, MotionPathPlugin) → /engine/lib/explainer.js → kit.js → scene.js
 * Everything is SVG and a pure function of time (procedural motion runs through X.every).
 *
 *   K.PAL / K.SKINS / K.OUTFITS        palette roles + crowd presets
 *   K.gshape(tag, attrs, base, hi, parent, {dir, reach, grain})   base fill + grain-dissolved highlight copy
 *   K.lineMode(true) · K.inkAll(g)     style swap → outlined line-icon dialect (5 px navy, round caps, no grain)
 *   K.character(parent, opts) → rig    cut-out puppet: pose(), face(), walk(), talk(), wave(), hop(), look(); auto blink + breathe
 *   K.pup(parent, opts) → dog rig      side-view dog: trot(), wag; K.pupMark() brand mark
 *   K.sheep(parent, opts) → rig        invoice-sheep (metaphor prop): trot(), hop
 *   props: desk monitor laptop plant mug lamp shelf sticky window cloud sun hills invoice phone card pill
 *          paperPlane coin fence sparkle badge glyph bubble label floaters blob
 *   camera + transitions: K.camera(), K.whip(), K.iris(), K.irisReveal(), K.swingIn(), K.pop(), K.headline(), K.wordmark()
 */
(function () {
  const X = window.X;
  const K = (window.K = {});
  const TAU = Math.PI * 2;

  // ------------------------------------------------------------------ palette
  K.PAL = {
    ground: '#fbfaff', blob: '#efedfb', blob2: '#e6e3f8',
    teal: '#2f716b', tealMid: '#4e9a85', tealHi: '#8fd0b4', mint: '#e3f3dd', mintHi: '#f4fbf0',
    green: '#5cb27a', greenHi: '#a6dfa9',
    lav: '#9a8de3', lavHi: '#cfc8f6', peri: '#b3b9e0', periHi: '#e0e3f6',
    coral: '#ef8f7a', coralHi: '#fbc6b4', peach: '#f3bd93', peachHi: '#fde3cc',
    cream: '#f7eecf', creamHi: '#fffaf0', butter: '#f5d07a', butterHi: '#fcebb8',
    hair: '#2b2420', ink: '#24423e', white: '#ffffff', navy: '#1d3c6e', paper: '#fffdf8',
  };
  K.SKINS = [['#f4c9a8', '#e4ad8a'], ['#e9b08a', '#d6966f'], ['#c98d63', '#b37750'], ['#9a6343', '#82513a'], ['#f7d8bf', '#e8bea0']];
  K.OUTFITS = [
    { top: '#9a8de3', topHi: '#cfc8f6', bottom: '#2f716b', bottomHi: '#4e9a85' },
    { top: '#4e9a85', topHi: '#8fd0b4', bottom: '#2b3a4a', bottomHi: '#4a5d70' },
    { top: '#ef8f7a', topHi: '#fbc6b4', bottom: '#2f716b', bottomHi: '#4e9a85' },
    { top: '#f5d07a', topHi: '#fcebb8', bottom: '#9a8de3', bottomHi: '#cfc8f6' },
    { top: '#e3f3dd', topHi: '#ffffff', bottom: '#2f716b', bottomHi: '#4e9a85' },
    { top: '#b3b9e0', topHi: '#e0e3f6', bottom: '#ef8f7a', bottomHi: '#fbc6b4' },
  ];
  K.FONT = 'Poppins';

  // ------------------------------------------------------------------ grain-gradient fills
  // A highlight copy of the shape, filled with a gradient that fades from the lit side, is thresholded against
  // static fractal noise: the highlight dissolves into 1–2 px stipple (Loomly-style "textured gradient").
  let line = false;
  K.lineMode = (on = true) => { line = on; };
  K.isLine = () => line;
  const made = {};
  function grainFilter(id, freq = 0.9, spread = 1.7, seed = 3) {
    if (made[id]) return `url(#${id})`;
    made[id] = 1;
    const f = X.svg('filter', { id, x: 0, y: 0, width: 1, height: 1, 'color-interpolation-filters': 'sRGB' }, X.defs);
    X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: freq, numOctaves: 1, seed, result: 'n' }, f);
    X.svg('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1 0 0 0 0', result: 'na' }, f);
    X.svg('feComposite', { in: 'SourceAlpha', in2: 'na', operator: 'arithmetic', k1: 0, k2: 1, k3: spread, k4: -spread / 2, result: 's' }, f);
    const ct = X.svg('feComponentTransfer', { in: 's', result: 't' }, f);
    X.svg('feFuncA', { type: 'discrete', tableValues: '0 1' }, ct);
    X.svg('feColorMatrix', { in: 'SourceGraphic', type: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 80 0', result: 'o' }, f);
    X.svg('feComposite', { in: 'o', in2: 't', operator: 'in' }, f);
    return `url(#${id})`;
  }
  K.grainFilter = grainFilter;
  const DIRS = { t: [0, 0, 0, 1], b: [0, 1, 0, 0], l: [0, 0, 1, 0], r: [1, 0, 0, 0], tl: [0, 0, 1, 1], tr: [1, 0, 0, 1], bl: [0, 1, 1, 0], br: [1, 1, 0, 0] };
  function hiGrad(color, dir = 'tl', reach = 0.9) {
    const id = `kh${color.replace('#', '')}${dir}${Math.round(reach * 100)}`;
    if (!made[id]) {
      made[id] = 1;
      if (dir === 'radial') X.radial(id, [[0, color, 1], [reach, color, 0]], 0.3, 0.25, 0.8);
      else X.linear(id, [[0, color, 1], [reach, color, 0]], ...DIRS[dir]);
    }
    return `url(#${id})`;
  }
  K.hiGrad = hiGrad;
  /** Shape with a base fill and a grain-dissolved highlight. Returns a <g> (g.base, g.hi). o.dir: t b l r tl tr bl br radial */
  K.gshape = (tag, attrs, base, hi, parent, o = {}) => {
    const g = X.svg('g', o.gattrs || {}, parent);
    g.base = X.svg(tag, { ...attrs, fill: base }, g);
    if (line) {
      K.ink(g.base, o.stroke);
    } else if (hi && o.grain !== false) {
      g.hi = X.svg(tag, { ...attrs, fill: hiGrad(hi, o.dir || 'tl', o.reach ?? 0.9), filter: grainFilter(o.filter || 'kg', o.freq, o.spread, o.seed) }, g);
    }
    return g;
  };
  /** Outlined line-icon dialect: uniform navy stroke, round caps, constant width under camera zoom. */
  K.ink = (el, w = 5, color = K.PAL.navy) => {
    el.setAttribute('stroke', color); el.setAttribute('stroke-width', w);
    el.setAttribute('stroke-linecap', 'round'); el.setAttribute('stroke-linejoin', 'round');
    el.setAttribute('vector-effect', 'non-scaling-stroke');
    return el;
  };
  /** Line-mode: outline every filled shape inside a group (props built with raw X.svg parts). */
  K.inkAll = (g, w = 5, color = K.PAL.navy) => {
    g.querySelectorAll('path,rect,circle,ellipse,polygon').forEach((el) => { const f = el.getAttribute('fill'); if (f && f !== 'none' && !el.getAttribute('filter')) K.ink(el, w, color); });
    return g;
  };
  /** Stacked offset "paper" copies behind a line-mode object (Ahrefs depth cue). */
  K.stack = (tag, attrs, parent, colors = ['#9cb5cc', '#d4e5f1']) => {
    colors.forEach((c, i) => {
      const d = (colors.length - i) * 8;
      K.ink(X.svg(tag, { ...attrs, fill: c, transform: `translate(${d} ${d})` }, parent));
    });
  };

  // ------------------------------------------------------------------ small utils
  const rnd = (seed) => X.rand(seed);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const smooth = (x) => { x = clamp(x, 0, 1); return x * x * (3 - 2 * x); };
  /** 0→1→0 envelope for an interval with ramps (procedural motion weights). */
  const env = (t, t0, t1, r = 0.22) => (t < t0 || t > t1 ? 0 : Math.min(smooth((t - t0) / r), smooth((t1 - t) / r)));
  K.env = env;
  K.smooth = smooth;
  const tr = (el, s) => el.setAttribute('transform', s);
  K.tr = tr;
  /** Measure text width with the real font (fonts are loaded before the build). */
  K.textW = (str, size, weight = 600, family = K.FONT) => {
    const t = X.svg('text', { x: -9999, y: -9999, 'font-family': family, 'font-size': size, 'font-weight': weight, text: str }, X.root);
    const w = t.getComputedTextLength(); t.remove(); return w;
  };
  K.label = (parent, x, y, str, o = {}) => X.svg('text', {
    x, y, text: str, 'font-family': o.font || K.FONT, 'font-size': o.size || 40, 'font-weight': o.weight || 600,
    fill: o.color || K.PAL.ink, 'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls ?? 0, ...(o.attrs || {}),
  }, parent);
  /** Overshoot pop about an absolute point (svgOrigin) or own centre. */
  K.pop = (el, t, o = {}) => {
    const from = o.from ?? 0;
    if (o.ox != null) gsap.set(el, { svgOrigin: `${o.ox} ${o.oy}` });
    else gsap.set(el, { transformOrigin: o.origin || '50% 50%' });
    X.tl.fromTo(el, { scale: from, opacity: o.fade ? 0 : 1 }, { scale: o.scale ?? 1, opacity: 1, duration: o.dur ?? 0.38, ease: o.ease || 'back.out(2.2)', immediateRender: false }, t);
    gsap.set(el, { scale: from });
    if (o.sfx !== false) X.sfx(t, o.sfx || 'pop', { gain: o.gain ?? 0.3, pitch: o.pitch ?? 1 });
    return el;
  };
  /** Shrink-out exit. */
  K.unpop = (el, t, o = {}) => {
    if (o.ox != null) gsap.set(el, { svgOrigin: `${o.ox} ${o.oy}` });
    X.tl.to(el, { scale: 0, duration: o.dur ?? 0.25, ease: o.ease || 'back.in(2)' }, t);
  };
  /** Gentle bob / drift: pure function of time. */
  K.bob = (el, amp = 6, period = 2.2, phase = 0, ax = 0) => {
    const base = el.getAttribute('transform') || '';
    X.every((t) => { const s = Math.sin(TAU * t / period + phase); tr(el, `translate(${(ax * s).toFixed(2)} ${(amp * s).toFixed(2)}) ${base}`); });
  };

  // ------------------------------------------------------------------ morphing amoeba blob (behind every vignette)
  K.blob = (parent, cx, cy, rx, ry, color = K.PAL.blob, o = {}) => {
    const r = rnd(o.seed || 1);
    const harm = [2, 3, 4, 5].map((k) => ({ k, a: (0.035 + r() * 0.05) * (o.wobble ?? 1), p: r() * TAU, w: (0.06 + r() * 0.07) * TAU * (o.speed ?? 1) }));
    const g = X.svg('g', {}, parent);
    const el = X.svg('path', { fill: color }, g);
    const hi = o.hi && !line ? X.svg('path', { fill: hiGrad(o.hi, o.dir || 'tl', 0.8), filter: grainFilter('kgBlob', 0.8, 1.6, 7) }, g) : null;
    const N = 28;
    const upd = (t) => {
      const pts = [];
      for (let i = 0; i < N; i++) {
        const a = (i / N) * TAU;
        let k = 1;
        for (const h of harm) k += h.a * Math.sin(h.k * a + h.p + h.w * t);
        pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
      }
      let d = `M${pts[0][0].toFixed(1)},${pts[0][1].toFixed(1)}`;
      for (let i = 0; i < N; i++) {
        const p0 = pts[(i - 1 + N) % N], p1 = pts[i], p2 = pts[(i + 1) % N], p3 = pts[(i + 2) % N];
        d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
      }
      el.setAttribute('d', d + 'Z');
      if (hi) hi.setAttribute('d', d + 'Z');
    };
    upd(0);
    X.every(upd);
    g.path = el;
    return g;
  };

  // ------------------------------------------------------------------ camera
  /** Camera group: st {z, cx, cy, rot}; world point (cx,cy) sits at frame centre at zoom z. */
  K.camera = (parent, o = {}) => {
    const g = X.svg('g', {}, parent);
    const st = { z: o.z ?? 1, cx: o.cx ?? 960, cy: o.cy ?? 540, rot: o.rot ?? 0, sx: 0, sy: 0 };
    const cam = { g, st };
    cam.to = (t, v, dur = 1, ease = 'power2.inOut') => { X.tl.to(st, { ...v, duration: dur, ease }, t); return cam; };
    cam.set = (t, v) => { X.tl.set(st, v, t); return cam; };
    cam.shake = (t, amp = 8, dur = 0.35) => { shakes.push({ t, amp, dur }); return cam; };
    const shakes = [];
    const breathe = o.breathe ?? 0.008;
    X.every((t) => {
      let z = st.z * (1 + breathe * Math.sin(TAU * t / 4.2)), sx = 0, sy = 0;
      for (const s of shakes) { const k = (t - s.t) / s.dur; if (k > 0 && k < 1) { const a = s.amp * (1 - k); sx += a * Math.sin(t * 90); sy += a * Math.cos(t * 77); } }
      tr(g, `translate(${960 + sx} ${540 + sy}) rotate(${st.rot}) scale(${z}) translate(${-st.cx} ${-st.cy})`);
    });
    return cam;
  };

  // ------------------------------------------------------------------ transitions
  let blurN = 0;
  /** Directional blur filter whose amount you tween: returns {url, set(t, amount), to(t, amount, dur)}. */
  K.blur = (axis = 'x') => {
    const id = `kblur${blurN++}`;
    const f = X.svg('filter', { id, x: '-20%', y: '-20%', width: '140%', height: '140%' }, X.defs);
    const b = X.svg('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '0 0' }, f);
    const st = { a: 0 };
    X.every(() => b.setAttribute('stdDeviation', axis === 'x' ? `${st.a} 0` : axis === 'y' ? `0 ${st.a}` : `${st.a}`));
    return {
      url: `url(#${id})`, st,
      set: (t, a) => X.tl.set(st, { a }, t),
      to: (t, a, dur, ease = 'power2.in') => X.tl.to(st, { a, duration: dur, ease }, t),
    };
  };
  /** Whip-pan: gOut slides out (power2.in, motion blur), 2–3 blank frames, gIn swings in from the other side. */
  K.whip = (t, gOut, gIn, o = {}) => {
    const dir = o.dir ?? -1, dist = o.dist ?? 2100, d1 = o.out ?? 0.27, gap = o.gap ?? 0.1, d2 = o.in ?? 0.45;
    if (gOut) {
      const bl = K.blur('x'); gOut.setAttribute('filter', bl.url);
      X.tl.to(gOut, { x: dir * dist, duration: d1, ease: 'power2.in' }, t);
      bl.to(t, 60, d1, 'power2.in');
    }
    if (gIn) {
      const bl = K.blur('x'); gIn.setAttribute('filter', bl.url);
      bl.set(t + d1 + gap - 0.001, 50);
      X.tl.fromTo(gIn, { x: -dir * dist * 0.6 }, { x: 0, duration: d2, ease: 'power3.out', immediateRender: false }, t + d1 + gap);
      bl.to(t + d1 + gap, 0, d2 * 0.7, 'power2.out');
      X.tl.set(gIn, { attr: { filter: 'none' } }, t + d1 + gap + d2);
    }
    X.sfx(t, 'whoosh', { dur: 0.45, gain: 0.45 });
    return t + d1 + gap + d2;
  };
  /** Colour iris: a circle grows from (cx,cy) until it covers the frame. Returns the circle. */
  K.iris = (parent, cx, cy, color, t, dur = 0.55, o = {}) => {
    const c = X.svg('circle', { cx, cy, r: 1, fill: color }, parent);
    gsap.set(c, { attr: { r: 0 } });
    X.tl.to(c, { attr: { r: o.r ?? 2300 }, duration: dur, ease: o.ease || 'power3.in' }, t);
    if (o.sfx !== false) X.sfx(t, 'woosh_low', { dur: dur + 0.2, gain: 0.5 });
    return c;
  };
  let clipN = 0;
  /** Reveal a group through a growing circle (shape wipe). */
  K.irisReveal = (g, cx, cy, t, dur = 0.6, o = {}) => {
    const id = `kclip${clipN++}`;
    const cp = X.svg('clipPath', { id }, X.defs);
    const c = X.svg('circle', { cx, cy, r: o.from ?? 0 }, cp);
    g.setAttribute('clip-path', `url(#${id})`);
    X.tl.to(c, { attr: { r: o.r ?? 2300 }, duration: dur, ease: o.ease || 'power2.inOut' }, t);
    X.tl.set(g, { attr: { 'clip-path': 'none' } }, t + dur);
    return c;
  };
  /** Hide a group through a shrinking circle (reverse shape wipe). */
  K.irisClose = (g, cx, cy, t, dur = 0.5, o = {}) => {
    const id = `kclip${clipN++}`;
    const cp = X.svg('clipPath', { id }, X.defs);
    const c = X.svg('circle', { cx, cy, r: o.from ?? 2300 }, cp);
    X.tl.set(g, { attr: { 'clip-path': `url(#${id})` } }, t);
    X.tl.to(c, { attr: { r: o.to ?? 0 }, duration: dur, ease: o.ease || 'power3.in' }, t);
    return c;
  };
  /** Unfold / swing-in card (T5): rotate + skew + scale from a corner. */
  K.swingIn = (el, t, o = {}) => {
    gsap.set(el, { transformOrigin: o.origin || '0% 100%' });
    X.tl.fromTo(el, { rotation: o.rot ?? -18, skewX: o.skew ?? 18, scale: 0.55, opacity: 0 },
      { rotation: 0, skewX: 0, scale: 1, opacity: 1, duration: o.dur ?? 0.63, ease: 'power3.out', immediateRender: false }, t);
    gsap.set(el, { opacity: 0 });
    X.sfx(t, 'swoosh', { dur: 0.4, gain: 0.35 });
  };
  /** Word-by-word headline (T12). words: [{w, t, color}] laid out centred on (x,y). */
  K.headline = (parent, x, y, words, o = {}) => {
    const size = o.size || 76, weight = o.weight || 700, gapW = size * 0.28, lh = size * 1.25;
    const ws = words.map((w) => ({ ...w, wd: K.textW(w.w, size, weight) }));
    const lines = [[]]; ws.forEach((w) => { if (w.br && lines[lines.length - 1].length) lines.push([]); lines[lines.length - 1].push(w); });
    lines.forEach((ln, li) => {
      const total = ln.reduce((s, w) => s + w.wd, 0) + gapW * (ln.length - 1);
      let cx = x - total / 2;
      ln.forEach((w) => { w.x = cx; w.y = y + (li - (lines.length - 1) / 2) * lh; cx += w.wd + gapW; });
    });
    return ws.map((w) => {
      const el = K.label(parent, w.x, w.y, w.w, { size, weight, color: w.color || o.color || '#fff', anchor: 'start' });
      X.tl.fromTo(el, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.18, ease: 'power2.out', immediateRender: false }, w.t - 0.04);
      gsap.set(el, { opacity: 0 });
      return el;
    });
  };
  /** Lowercase wordmark that draws on as a stroke, then fills (T7). */
  K.wordmark = (parent, x, y, str, t, o = {}) => {
    const el = K.label(parent, x, y, str, { size: o.size || 150, weight: o.weight || 600, color: o.color || K.PAL.teal, anchor: o.anchor || 'start', ls: o.ls ?? -2 });
    el.setAttribute('stroke', o.color || K.PAL.teal); el.setAttribute('stroke-width', 2.5);
    el.setAttribute('stroke-linejoin', 'round');
    gsap.set(el, { attr: { 'stroke-dasharray': '700 700', 'stroke-dashoffset': 700, 'fill-opacity': 0 } });
    X.tl.to(el, { attr: { 'stroke-dashoffset': 0 }, duration: o.dur ?? 0.9, ease: 'none' }, t);
    X.tl.to(el, { attr: { 'fill-opacity': 1 }, duration: 0.35, ease: 'power1.inOut' }, t + (o.dur ?? 0.9) * 0.7);
    X.sfx(t, 'scribble', { dur: 0.8, gain: 0.25 });
    return el;
  };

  // ------------------------------------------------------------------ glyphs (generic, no real-brand icons)
  /** White (or given colour) glyph centred at (x,y) in a box of half-size s. */
  K.glyph = (name, parent, x, y, s = 30, color = '#fff') => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s / 30})` }, parent);
    const stroke = (d, w = 6) => X.svg('path', { d, fill: 'none', stroke: color, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const fill = (d) => X.svg('path', { d, fill: color }, g);
    switch (name) {
      case 'check': stroke('M-16,1 L-5,12 L17,-12', 7); break;
      case 'bell': fill('M-17,10 C-13,6 -13,0 -13,-6 C-13,-15 -7,-21 0,-21 C7,-21 13,-15 13,-6 C13,0 13,6 17,10 Z'); X.svg('circle', { cx: 0, cy: 16, r: 5, fill: color }, g); break;
      case 'coin': X.svg('circle', { cx: 0, cy: 0, r: 22, fill: 'none', stroke: color, 'stroke-width': 5 }, g); stroke('M7,-9 C3,-13 -9,-12 -9,-5 C-9,3 9,-1 9,7 C9,13 -3,14 -8,9 M0,-16 L0,16', 4.5); break;
      case 'dollar': stroke('M10,-12 C5,-18 -12,-17 -12,-7 C-12,4 12,-2 12,9 C12,18 -4,19 -11,12 M0,-23 L0,23', 6); break;
      case 'card': X.svg('rect', { x: -22, y: -15, width: 44, height: 30, rx: 5, fill: color }, g); X.svg('rect', { x: -22, y: -8, width: 44, height: 6, fill: 'rgba(0,0,0,0.25)' }, g); break;
      case 'bank': fill('M0,-22 L22,-10 L-22,-10 Z M-20,14 L20,14 L20,20 L-20,20 Z'); [-14, -5, 5, 14].forEach((bx) => X.svg('rect', { x: bx - 2.5, y: -6, width: 5, height: 18, fill: color }, g)); break;
      case 'clock': X.svg('circle', { cx: 0, cy: 0, r: 20, fill: 'none', stroke: color, 'stroke-width': 5 }, g); stroke('M0,-11 L0,1 L8,6', 5); break;
      case 'mail': X.svg('rect', { x: -22, y: -15, width: 44, height: 30, rx: 5, fill: color }, g); X.svg('path', { d: 'M-20,-12 L0,4 L20,-12', fill: 'none', stroke: 'rgba(0,0,0,0.25)', 'stroke-width': 4, 'stroke-linejoin': 'round' }, g); break;
      case 'plane': fill('M-22,-2 L22,-18 L10,20 L1,6 Z'); X.svg('path', { d: 'M1,6 L22,-18', stroke: 'rgba(0,0,0,0.2)', 'stroke-width': 3 }, g); break;
      case 'chart': [[-16, 6, 10], [-3, -4, 20], [10, -14, 30]].forEach(([bx, by, h]) => X.svg('rect', { x: bx - 4, y: by, width: 10, height: h, rx: 3, fill: color }, g)); break;
      case 'calendar': X.svg('rect', { x: -20, y: -16, width: 40, height: 36, rx: 6, fill: color }, g); X.svg('rect', { x: -20, y: -16, width: 40, height: 10, rx: 4, fill: 'rgba(0,0,0,0.22)' }, g); stroke('M-10,-22 L-10,-12 M10,-22 L10,-12', 4); break;
      case 'heart': fill('M0,18 C-26,0 -22,-20 -9,-20 C-3,-20 0,-14 0,-11 C0,-14 3,-20 9,-20 C22,-20 26,0 0,18 Z'); break;
      case 'star': fill('M0,-22 L6,-7 L22,-6 L10,4 L14,20 L0,11 L-14,20 L-10,4 L-22,-6 L-6,-7 Z'); break;
      case 'paw': X.svg('ellipse', { cx: 0, cy: 7, rx: 12, ry: 10, fill: color }, g); [[-14, -6], [-5, -14], [5, -14], [14, -6]].forEach(([px, py]) => X.svg('ellipse', { cx: px, cy: py, rx: 5, ry: 6.5, fill: color }, g)); break;
      case 'doc': X.svg('rect', { x: -16, y: -21, width: 32, height: 42, rx: 4, fill: color }, g); [-10, -2, 6].forEach((ly) => X.svg('rect', { x: -10, y: ly, width: 20, height: 3.5, rx: 1.7, fill: 'rgba(0,0,0,0.22)' }, g)); break;
      case 'smile': X.svg('circle', { cx: 0, cy: 0, r: 20, fill: 'none', stroke: color, 'stroke-width': 5 }, g); X.svg('circle', { cx: -7, cy: -5, r: 3, fill: color }, g); X.svg('circle', { cx: 7, cy: -5, r: 3, fill: color }, g); stroke('M-9,5 Q0,13 9,5', 4.5); break;
      case 'question': stroke('M-9,-10 C-9,-24 13,-22 12,-9 C11,0 1,1 1,10', 6); X.svg('circle', { cx: 1, cy: 20, r: 3.6, fill: color }, g); break;
      case 'tap': X.svg('circle', { cx: 0, cy: 0, r: 8, fill: color }, g); X.svg('circle', { cx: 0, cy: 0, r: 18, fill: 'none', stroke: color, 'stroke-width': 4 }, g); break;
      default: X.svg('circle', { cx: 0, cy: 0, r: 10, fill: color }, g);
    }
    return g;
  };
  /** Circular badge with grain fill + generic glyph (≈ Loomly icon badges, ~230 px). */
  K.badge = (parent, x, y, r, glyph, o = {}) => {
    const g = X.svg('g', {}, parent);
    K.gshape('circle', { cx: x, cy: y, r }, o.color || K.PAL.tealMid, o.hi ?? K.PAL.tealHi, g, { dir: o.dir || 'tl' });
    if (glyph) K.glyph(glyph, g, x, y, r * 0.5, o.glyphColor || '#fff');
    g.cx = x; g.cy = y;
    return g;
  };

  // ------------------------------------------------------------------ speech bubble
  /** Rounded speech bubble whose tail tip is at (x,y). o.side: 'r' body to the right of the tail, 'l' to the left; o.up (default) body above. */
  K.bubble = (parent, x, y, str, o = {}) => {
    const size = o.size || 36, padX = o.padX || 36, padY = o.padY || 22, lh = size * 1.22;
    const lines = String(str).split('\n');
    const w = Math.max(...lines.map((l) => K.textW(l, size, o.weight || 600))) + padX * 2;
    const h = lines.length * lh + padY * 2;
    const side = o.side || 'r', up = o.up !== false;
    const left = side === 'r' ? x - 26 : x - w + 26;
    const top = up ? y - 34 - h : y + 34;
    const g = X.svg('g', {}, parent);
    const rr = Math.min(h / 2, 44);
    const tail = up
      ? (side === 'r' ? `M${x},${y} L${left + 40},${top + h - 10} L${left + 92},${top + h - 6} Z` : `M${x},${y} L${left + w - 92},${top + h - 6} L${left + w - 40},${top + h - 10} Z`)
      : (side === 'r' ? `M${x},${y} L${left + 40},${top + 10} L${left + 92},${top + 6} Z` : `M${x},${y} L${left + w - 92},${top + 6} L${left + w - 40},${top + 10} Z`);
    const col = o.color || K.PAL.green, hi = o.hi ?? K.PAL.greenHi;
    const d = `M${left + rr},${top} H${left + w - rr} A${rr},${rr} 0 0 1 ${left + w},${top + rr} V${top + h - rr} A${rr},${rr} 0 0 1 ${left + w - rr},${top + h} H${left + rr} A${rr},${rr} 0 0 1 ${left},${top + h - rr} V${top + rr} A${rr},${rr} 0 0 1 ${left + rr},${top} Z`;
    K.gshape('path', { d: d + tail }, col, hi, g, { dir: o.dir || 'tl', reach: 0.75 });
    lines.forEach((l, i) => K.label(g, left + w / 2, top + padY + lh * (i + 0.78), l, { size, weight: o.weight || 600, color: o.textColor || '#fff' }));
    g.ox = x; g.oy = y; g.w = w; g.h = h; g.left = left; g.top = top;
    return g;
  };

  // ------------------------------------------------------------------ the character rig
  const POSES = {
    idle: { lSh: 7, lEl: 6, rSh: 7, rEl: 6, torso: 0, head: 0, headY: 0 },
    talk: { lSh: 7, lEl: 6, rSh: 14, rEl: 80, torso: 0, head: -3, headY: 0 },
    explain: { lSh: 14, lEl: 76, rSh: 14, rEl: 80, torso: 0, head: 2, headY: 0 },
    point: { lSh: 7, lEl: 6, rSh: 98, rEl: 6, torso: -2, head: 4, headY: 0 },
    pointL: { lSh: 98, lEl: 6, rSh: 7, rEl: 6, torso: 2, head: -4, headY: 0 },
    celebrate: { lSh: 152, lEl: 22, rSh: 152, rEl: 22, torso: 0, head: 0, headY: -3 },
    slump: { lSh: 1, lEl: -4, rSh: 1, rEl: -4, torso: 0, head: 9, headY: 11, bodyY: 3 },
    headHold: { lSh: 7, lEl: 6, rSh: 160, rEl: 100, torso: -2, head: -7, headY: 2 },
    headHold2: { lSh: 160, lEl: 100, rSh: 160, rEl: 100, torso: 0, head: 0, headY: 3 },
    shrug: { lSh: 20, lEl: 64, rSh: 20, rEl: 64, torso: 0, head: 6, headY: 5 },
    hold: { lSh: 7, lEl: 6, rSh: 8, rEl: -120, torso: 0, head: 6, headY: 2 },
    hold2: { lSh: 8, lEl: -138, rSh: 8, rEl: -138, torso: 0, head: 6, headY: 2 },
    wave: { lSh: 7, lEl: 6, rSh: 138, rEl: 18, torso: -2, head: -4, headY: 0 },
    yay: { lSh: 7, lEl: 6, rSh: 24, rEl: 128, torso: 1, head: -4, headY: -2 },
    chest: { lSh: 7, lEl: 6, rSh: 30, rEl: -128, torso: 0, head: -4, headY: 0 },
    draw: { lSh: 7, lEl: 6, rSh: 34, rEl: -86, torso: 0, head: 8, headY: 3 },
  };
  K.POSES = POSES;

  const HAIR = {
    long: {
      back: 'M-27,-376 C-46,-352 -50,-318 -50,-292 C-50,-276 -40,-268 -30,-274 C-22,-266 -12,-272 -6,-282 L6,-282 C12,-272 22,-266 30,-274 C40,-268 50,-276 50,-292 C50,-318 46,-352 27,-376 C16,-400 -16,-400 -27,-376 Z',
      front: 'M-29,-348 C-36,-390 -6,-404 8,-400 C27,-396 36,-376 30,-348 C26,-366 16,-379 2,-381 C-6,-372 -17,-361 -29,-348 Z',
      hl: ['m12,-394 q12,6 15,20', 'm-20,-386 q-6,8 -8,18'],
    },
    bob: {
      back: 'M-29,-372 C-40,-350 -38,-332 -33,-324 L33,-324 C38,-332 40,-350 29,-372 C18,-398 -18,-398 -29,-372 Z',
      front: 'M-27,-352 C-30,-392 30,-392 27,-352 L25,-366 C12,-370 -10,-372 -25,-366 Z',
      hl: ['m10,-388 q10,4 13,14'],
    },
    bun: {
      back: '', front: 'M-26,-356 C-29,-394 29,-394 26,-356 C20,-378 6,-382 0,-382 C-8,-382 -20,-378 -26,-356 Z',
      bun: [0, -398, 14], hl: ['M-6,-404 q6,-4 11,0'],
    },
    short: {
      back: '', front: 'M-27,-350 C-33,-402 33,-402 27,-350 C25,-362 22,-371 14,-376 C4,-371 -12,-373 -22,-367 C-24,-362 -25,-356 -27,-350 Z',
      hl: ['M8,-394 q10,3 13,13'],
    },
    curly: { back: '', front: '', curls: true, hl: [] },
    wrap: { // head wrap / scarf
      back: '', front: 'M-28,-352 C-34,-404 34,-404 28,-352 C24,-372 12,-380 0,-380 C-12,-380 -24,-372 -28,-352 Z',
      hl: ['M-14,-392 q14,-6 28,0'], knot: true,
    },
  };

  /**
   * Cut-out puppet character, ~7 heads tall, origin between the feet, height 400 units (scale to taste).
   * opts: x y scale skin skinShade hair hairStyle(long|bob|bun|short|curly|wrap) top topHi bottom bottomHi shoe
   *       sleeves(long|short) look(-1..1 3/4 turn) beard glasses seed pose
   * rig.pose(name|obj, t, dur, ease) · rig.face(t, {mouth: smile|open|grin|flat|frown|o, brows: neutral|up|worried, eyes: open|happy|closed})
   * rig.walk(t0, t1, {cad, amp, dir, run}) · rig.talk(t0, t1) · rig.wave(t0, t1) · rig.hop(t, n) · rig.look(t, v, dur)
   * rig.g (outer group: tween x/y/scale with GSAP) · rig.handR / rig.handL (attach props in rig units, hand centre ≈ (±36,-178))
   */
  K.character = (parent, o = {}) => {
    const P = Object.assign({
      x: 0, y: 0, scale: 1, skin: K.SKINS[0][0], skinShade: K.SKINS[0][1], hair: K.PAL.hair, hairStyle: 'long',
      top: K.PAL.lav, topHi: K.PAL.lavHi, bottom: K.PAL.teal, bottomHi: K.PAL.tealMid, shoe: '#2b2420',
      sleeves: 'long', look: 0, seed: 1, beard: false, glasses: false, blush: true, grain: true,
    }, o);
    const st = { ...POSES.idle, lHip: 0, rHip: 0, lKnee: 0, rKnee: 0, bodyY: 0, look: P.look, ...(o.pose ? POSES[o.pose] : {}) };
    const gs = (tag, attrs, base, hi, parent2, oo = {}) => K.gshape(tag, attrs, base, hi, parent2, { ...oo, grain: P.grain && oo.grain !== false });

    const outer = X.svg('g', { class: 'kchar' }, parent);
    gsap.set(outer, { x: P.x, y: P.y, scale: P.scale });
    const body = X.svg('g', {}, outer);

    // legs (behind torso)
    const legs = {};
    for (const side of [-1, 1]) {
      const sx = side * 15;
      const hip = X.svg('g', {}, body);
      gs('path', { d: `M${sx - 17},-200 C${sx - 17},-212 ${sx + 17},-212 ${sx + 17},-200 L${sx + 12},-98 C${sx + 12},-88 ${sx - 12},-88 ${sx - 12},-98 Z` }, P.bottom, P.bottomHi, hip, { dir: side < 0 ? 'l' : 'r', reach: 0.7 });
      const knee = X.svg('g', {}, hip);
      gs('path', { d: `M${sx - 12},-104 C${sx - 12},-112 ${sx + 12},-112 ${sx + 12},-104 L${sx + 10},-16 L${sx - 10},-16 Z` }, P.bottom, P.bottomHi, knee, { dir: side < 0 ? 'l' : 'r', reach: 0.6 });
      const shoe = X.svg('path', { d: `M${sx - 13},-14 C${sx - 13},-26 ${sx + 4},-27 ${sx + 10},-20 C${sx + 22},-16 ${sx + 26},-8 ${sx + 24},0 L${sx - 13},0 Z`, fill: P.shoe }, knee);
      legs[side] = { hip, knee, sx, shoe };
    }
    gs('path', { d: 'M-33,-216 L33,-216 L35,-192 Q0,-182 -35,-192 Z' }, P.bottom, P.bottomHi, body, { dir: 't', reach: 0.8 });

    // torso group (lean about the hips)
    const tor = X.svg('g', {}, body);
    const hairBack = X.svg('g', {}, tor);
    const H = HAIR[P.hairStyle] || HAIR.long;
    if (H.back) gs('path', { d: H.back }, P.hair, null, hairBack);
    X.svg('rect', { x: -8, y: -344, width: 16, height: 26, rx: 6, fill: P.skinShade }, tor);
    const torsoShape = 'M-44,-300 C-45,-322 -33,-329 -15,-329 L15,-329 C33,-329 45,-322 44,-300 C42,-276 34,-258 34,-238 L37,-200 C37,-192 32,-188 24,-188 L-24,-188 C-32,-188 -37,-192 -37,-200 L-34,-238 C-34,-258 -42,-276 -44,-300 Z';
    gs('path', { d: torsoShape }, P.top, P.topHi, tor, { dir: P.look >= 0 ? 'tl' : 'tr', reach: 0.95 });
    X.svg('path', { d: 'M-12,-328 Q0,-312 12,-328 Z', fill: P.skinShade }, tor);
    if (o.collar) X.svg('path', { d: 'M-15,-329 L0,-312 L15,-329 L9,-331 L0,-320 L-9,-331 Z', fill: o.collar }, tor);

    // head
    const head = X.svg('g', {}, tor);
    const earL = X.svg('ellipse', { cx: -24, cy: -360, rx: 5, ry: 7.5, fill: P.skinShade }, head);
    const earR = X.svg('ellipse', { cx: 24, cy: -360, rx: 5, ry: 7.5, fill: P.skinShade }, head);
    X.svg('path', { d: 'M-25,-368 C-25,-386 -14,-392 0,-392 C14,-392 25,-386 25,-368 C25,-348 16,-334 0,-334 C-16,-334 -25,-348 -25,-368 Z', fill: P.skin }, head);
    const face = X.svg('g', {}, head);
    const eyes = [-9.5, 9.5].map((ex) => {
      const eg = X.svg('g', {}, face);
      const open = X.svg('ellipse', { cx: ex, cy: -364, rx: 3.1, ry: 4, fill: P.hair }, eg);
      const happy = X.svg('path', { d: `M${ex - 4.5},-363 Q${ex},-369 ${ex + 4.5},-363`, fill: 'none', stroke: P.hair, 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0 }, eg);
      return { eg, ex, open, happy };
    });
    const browPaths = {
      neutral: ['M-14,-373 Q-9.5,-375.5 -5,-373.5', 'M5,-373.5 Q9.5,-375.5 14,-373'],
      up: ['M-14,-376 Q-9.5,-379.5 -5,-377', 'M5,-377 Q9.5,-379.5 14,-376'],
      worried: ['M-14,-372 Q-9.5,-373 -5,-377', 'M5,-377 Q9.5,-373 14,-372'],
    };
    const brows = [0, 1].map((i) => X.svg('path', { d: browPaths.neutral[i], fill: 'none', stroke: P.hair, 'stroke-width': 2.6, 'stroke-linecap': 'round' }, face));
    X.svg('path', { d: 'M1,-361 q2.6,4.6 -1.6,5.6', fill: 'none', stroke: P.skinShade, 'stroke-width': 2.2, 'stroke-linecap': 'round' }, face);
    if (P.blush) for (const cxk of [-15, 15]) X.svg('ellipse', { cx: cxk, cy: -352, rx: 4.6, ry: 3, fill: K.PAL.coral, opacity: 0.35 }, face);
    const mouthCol = '#8a3f35';
    const mouths = {
      smile: X.svg('path', { d: 'M-6,-348 Q0,-343 6,-348', fill: 'none', stroke: mouthCol, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, face),
      open: X.svg('path', { d: 'M-7,-349 Q0,-337 7,-349 Z', fill: mouthCol, stroke: mouthCol, 'stroke-width': 1.5, 'stroke-linejoin': 'round' }, face),
      grin: X.svg('path', { d: 'M-8,-350 Q0,-338 8,-350 Z', fill: '#fff', stroke: mouthCol, 'stroke-width': 2, 'stroke-linejoin': 'round' }, face),
      flat: X.svg('path', { d: 'M-4.5,-346 L4.5,-346', fill: 'none', stroke: mouthCol, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, face),
      frown: X.svg('path', { d: 'M-5.5,-344 Q0,-349 5.5,-344', fill: 'none', stroke: mouthCol, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, face),
      o: X.svg('ellipse', { cx: 0, cy: -346, rx: 3, ry: 3.8, fill: mouthCol }, face),
    };
    for (const k in mouths) mouths[k].setAttribute('opacity', k === (o.mouth || 'smile') ? 1 : 0);
    if (P.glasses) for (const ex of [-9.5, 9.5]) X.svg('circle', { cx: ex, cy: -364, r: 7.5, fill: 'none', stroke: P.hair, 'stroke-width': 2 }, face);
    if (P.beard) X.svg('path', { d: 'M-24,-360 C-24,-340 -14,-330 0,-330 C14,-330 24,-340 24,-360 C20,-348 12,-344 0,-344 C-12,-344 -20,-348 -24,-360 Z', fill: P.hair }, face);
    const hairFront = X.svg('g', {}, head);
    if (H.bun) X.svg('circle', { cx: H.bun[0], cy: H.bun[1], r: H.bun[2], fill: P.hair }, hairFront);
    if (H.front) X.svg('path', { d: H.front, fill: P.hair }, hairFront);
    if (H.knot) X.svg('path', { d: 'M18,-388 q14,-6 16,6 q-8,6 -16,-6 Z', fill: P.hair }, hairFront);
    if (H.curls) {
      const cr = rnd(P.seed + 5);
      for (let i = 0; i < 13; i++) {
        const a = Math.PI * (0.95 + (i / 12) * 1.1);
        X.svg('circle', { cx: Math.cos(a) * 25, cy: -368 + Math.sin(a) * 25, r: 10 + cr() * 3, fill: P.hair }, hairFront);
      }
      X.svg('path', { d: 'M-24,-366 C-24,-392 24,-392 24,-366 C16,-376 -16,-376 -24,-366 Z', fill: P.hair }, hairFront);
    }
    (H.hl || []).forEach((d) => X.svg('path', { d, fill: 'none', stroke: '#fff', 'stroke-width': 2.6, 'stroke-linecap': 'round', opacity: 0.75 }, d.includes('-3') && H.back && d.startsWith('M-3') ? hairBack : hairFront));

    // arms (in front of torso & head so hands can touch the face)
    const arms = {};
    for (const side of [-1, 1]) {
      const ax = side * 37;
      const sh = X.svg('g', {}, tor);
      gs('rect', { x: ax - 11.5, y: -326, width: 23, height: 86, rx: 11.5 }, P.top, P.topHi, sh, { dir: side < 0 ? 'l' : 'r', reach: 0.8 });
      const el = X.svg('g', {}, sh);
      const foreCol = P.sleeves === 'short' ? P.skin : P.top;
      gs('rect', { x: ax - 10, y: -256, width: 20, height: 78, rx: 10 }, foreCol, P.sleeves === 'short' ? null : P.topHi, el, { dir: side < 0 ? 'l' : 'r', reach: 0.7 });
      const hand = X.svg('g', {}, el);
      X.svg('circle', { cx: ax, cy: -176, r: 11.5, fill: P.skin }, hand);
      X.svg('ellipse', { cx: ax - side * 9, cy: -181, rx: 4.5, ry: 6.5, fill: P.skin, transform: `rotate(${side * 25} ${ax - side * 9} -181)` }, hand);
      arms[side] = { sh, el, hand, ax };
    }

    // ---------------------------------------------------- procedural layers
    const walks = [], talks = [], waves = [], hops = [], attached = [];
    const blinks = []; { const r = rnd(P.seed * 7 + 3); let t = 0.6 + r() * 1.6; while (t < 400) { blinks.push(t); t += 2.3 + r() * 1.9; } }
    const faceSt = { eyes: o.eyes || 'open' };
    const lookState = st;

    const apply = (t) => {
      let { lSh, lEl, rSh, rEl, lHip, rHip, lKnee, rKnee, torso, head: hd, headY, bodyY, look } = st;
      bodyY = bodyY || 0;
      const br = Math.sin(TAU * t / 3.4 + P.seed);
      bodyY += br * 0.9; headY += br * 0.35;
      lSh += Math.sin(TAU * t / 3.9 + P.seed) * 1.6; rSh += Math.sin(TAU * t / 4.4 + P.seed * 2.1) * 1.6;
      hd += Math.sin(TAU * t / 5.1 + P.seed * 1.3) * 0.8;
      let hairSway = Math.sin(TAU * t / 3.0 + P.seed) * 1.2;
      let aL = 0, aR = 0;
      for (const w of walks) {
        const k = env(t, w.t0, w.t1, 0.2); if (k <= 0) continue;
        const ph = TAU * (t - w.t0) * w.cad, dir = w.dir, A = w.amp * k;
        const s = Math.sin(ph), c = Math.cos(ph);
        lHip += -A * s * dir; rHip += A * s * dir;
        lKnee += k * (5 + w.knee * Math.pow(Math.max(0, c), 1.3)) * dir;
        rKnee += k * (5 + w.knee * Math.pow(Math.max(0, -c), 1.3)) * dir;
        aL += w.arm * k * s * dir; aR += -w.arm * k * s * dir;
        lEl += 10 * k; rEl += 10 * k;
        bodyY += -w.bob * k * (0.5 + 0.5 * Math.cos(2 * ph));
        torso += w.lean * k * dir;
        hairSway += 3 * k * Math.sin(2 * ph - 0.9);
      }
      for (const w of talks) { const k = env(t, w.t0, w.t1, 0.25); if (k <= 0) continue; hd += w.amp * k * Math.sin(TAU * t * 1.55 + 0.5); headY += 0.9 * k * Math.sin(TAU * t * 3.1); rEl += 7 * k * Math.sin(TAU * t * 1.1); }
      for (const w of waves) { const k = env(t, w.t0, w.t1, 0.18); if (k <= 0) continue; const v = 24 * k * Math.sin(TAU * (t - w.t0) * 2.3); if (w.side > 0) rEl += v; else lEl += v; }
      for (const h of hops) { const u = (t - h.t) / h.dur; if (u > 0 && u < h.n) { const f = u % 1; bodyY -= h.h * Math.sin(Math.PI * f); } }
      // write transforms
      tr(body, `translate(0 ${bodyY.toFixed(2)})`);
      tr(legs[-1].hip, `rotate(${lHip.toFixed(2)} -15 -195)`); tr(legs[-1].knee, `rotate(${lKnee.toFixed(2)} -15 -100)`);
      tr(legs[1].hip, `rotate(${rHip.toFixed(2)} 15 -195)`); tr(legs[1].knee, `rotate(${rKnee.toFixed(2)} 15 -100)`);
      tr(tor, `rotate(${torso.toFixed(2)} 0 -200)`);
      const hT = `translate(0 ${headY.toFixed(2)}) rotate(${hd.toFixed(2)} 0 -336)`;
      tr(head, hT);
      tr(hairBack, `${hT} rotate(${hairSway.toFixed(2)} 0 -380)`);
      tr(face, `translate(${(look * 7).toFixed(2)} 0)`);
      tr(hairFront, `translate(${(look * 2.5).toFixed(2)} 0)`);
      tr(earL, `translate(${(look * 3).toFixed(2)} 0)`); tr(earR, `translate(${(look * 3).toFixed(2)} 0)`);
      earL.setAttribute('opacity', look > 0.6 ? 0 : 1); earR.setAttribute('opacity', look < -0.6 ? 0 : 1);
      tr(arms[-1].sh, `rotate(${(lSh + aL).toFixed(2)} -37 -314)`); tr(arms[-1].el, `rotate(${lEl.toFixed(2)} -37 -248)`);
      tr(arms[1].sh, `rotate(${(-rSh + aR).toFixed(2)} 37 -314)`); tr(arms[1].el, `rotate(${(-rEl).toFixed(2)} 37 -248)`);
      for (const at of attached) { const tot = at.side > 0 ? -rSh + aR - rEl : lSh + aL + lEl; tr(at.g, `rotate(${(-tot - torso).toFixed(2)} ${at.side * 37} -176)`); }
      // blink
      let sy = 1;
      for (const b of blinks) { const u = (t - b) / 0.14; if (u > 0 && u < 1) { sy = 1 - 0.9 * Math.sin(Math.PI * u); break; } if (b > t) break; }
      const mode = faceSt.eyes;
      for (const e of eyes) {
        e.open.setAttribute('opacity', mode === 'open' ? 1 : 0);
        e.happy.setAttribute('opacity', mode === 'happy' ? 1 : 0);
        tr(e.open, `translate(0 -364) scale(1 ${mode === 'closed' ? 0.12 : sy}) translate(0 364)`);
      }
    };
    X.every(apply);

    const rig = { g: outer, st, P, handR: arms[1].hand, handL: arms[-1].hand, head, face, tor, body };
    rig.pose = (p, t, dur = 0.4, ease = 'power2.inOut') => { X.tl.to(st, { ...(typeof p === 'string' ? { bodyY: 0, ...POSES[p] } : p), duration: dur, ease }, t); return rig; };
    rig.setPose = (p, t) => { X.tl.set(st, { ...(typeof p === 'string' ? POSES[p] : p) }, t); return rig; };
    rig.face = (t, f = {}) => {
      if (f.mouth) for (const k in mouths) X.tl.set(mouths[k], { attr: { opacity: k === f.mouth ? 1 : 0 } }, t);
      if (f.brows) brows.forEach((b, i) => X.tl.set(b, { attr: { d: browPaths[f.brows][i] } }, t));
      if (f.eyes) X.tl.set(faceSt, { eyes: f.eyes }, t);
      return rig;
    };
    rig.walk = (t0, t1, w = {}) => { walks.push({ t0, t1, cad: w.cad ?? (w.run ? 2.3 : 1.65), amp: w.amp ?? (w.run ? 34 : 24), knee: w.knee ?? (w.run ? 48 : 32), arm: w.arm ?? (w.run ? 30 : 18), bob: w.bob ?? (w.run ? 7 : 3.5), lean: w.lean ?? (w.run ? 7 : 1.5), dir: w.dir ?? (P.look < 0 ? -1 : 1) }); return rig; };
    rig.talk = (t0, t1, amp = 2.4) => { talks.push({ t0, t1, amp }); return rig; };
    rig.wave = (t0, t1, side = 1) => { waves.push({ t0, t1, side }); return rig; };
    rig.hop = (t, n = 1, h = 16, dur = 0.42) => { hops.push({ t, n, h, dur }); return rig; };
    /** A group inside the hand that stays upright (counter-rotated): draw held props in rig units around (±37,-176). */
    rig.attach = (side = 1) => { const g = X.svg('g', {}, arms[side].hand); attached.push({ side, g }); return g; };
    rig.look = (t, v, dur = 0.3) => { X.tl.to(st, { look: v, duration: dur, ease: 'power2.inOut' }, t); return rig; };
    apply(0);
    return rig;
  };

  /** Round avatar: character head-and-shoulders clipped in a circle (testimonial cards, insets). */
  let avN = 0;
  K.avatar = (parent, cx, cy, r, opts = {}, o = {}) => {
    const g = X.svg('g', {}, parent);
    K.gshape('circle', { cx, cy, r }, o.bg || K.PAL.peachHi, o.bgHi ?? K.PAL.white, g, { dir: 'tl' });
    const id = `kav${avN++}`, cp = X.svg('clipPath', { id }, X.defs);
    X.svg('circle', { cx, cy, r: r - (o.ring ?? 0) }, cp);
    const inner = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    const s = r / 50;
    g.rig = K.character(inner, { ...opts, x: cx, y: cy - r * 0.12 + 362 * s, scale: s });
    return g;
  };

  /** Crowd helper: n characters in a row with varied skins/outfits/hair. */
  K.crowd = (parent, n, x0, x1, y, scale, seed = 3) => {
    const r = rnd(seed), styles = ['short', 'bun', 'curly', 'bob', 'long', 'wrap', 'short'];
    return Array.from({ length: n }, (_, i) => {
      const sk = K.SKINS[(i * 2 + 1) % K.SKINS.length], of = K.OUTFITS[(i + 1) % K.OUTFITS.length];
      const hs = styles[i % styles.length];
      return K.character(parent, {
        x: x0 + (x1 - x0) * (n === 1 ? 0.5 : i / (n - 1)), y: y + (i % 2) * 18, scale: scale * (0.94 + r() * 0.12),
        skin: sk[0], skinShade: sk[1], hairStyle: hs, hair: i % 4 === 3 ? '#6b3f2a' : K.PAL.hair, ...of,
        sleeves: i % 3 === 1 ? 'short' : 'long', seed: seed + i * 3, beard: hs === 'short' && i % 2 === 0, look: (r() - 0.5) * 0.6,
      });
    });
  };

  // ------------------------------------------------------------------ pup (side view, faces +x) — product mascot
  K.pup = (parent, o = {}) => {
    const P = Object.assign({ x: 0, y: 0, scale: 1, body: K.PAL.peach, bodyHi: K.PAL.peachHi, dark: '#d98a68', belly: K.PAL.creamHi, collar: K.PAL.teal }, o);
    const outer = X.svg('g', {}, parent);
    gsap.set(outer, { x: P.x, y: P.y, scale: P.scale });
    const bodyG = X.svg('g', {}, outer);
    const legs = [];
    const leg = (lx, far) => {
      const g = X.svg('g', {}, bodyG);
      X.svg('rect', { x: lx - 8, y: -74, width: 17, height: 74, rx: 8.5, fill: far ? P.dark : P.body }, g);
      X.svg('ellipse', { cx: lx + 3, cy: -4, rx: 11, ry: 6, fill: far ? P.dark : P.belly }, g);
      legs.push({ g, lx, far });
    };
    leg(-44, true); leg(40, true);
    const tail = X.svg('path', { d: 'M-66,-96 C-92,-110 -98,-136 -86,-150', fill: 'none', stroke: P.body, 'stroke-width': 15, 'stroke-linecap': 'round' }, bodyG);
    K.gshape('rect', { x: -76, y: -122, width: 150, height: 72, rx: 36 }, P.body, P.bodyHi, bodyG, { dir: 't', reach: 0.8 });
    X.svg('path', { d: 'M-40,-60 C-20,-50 30,-50 50,-60 L50,-52 C30,-44 -20,-44 -40,-52 Z', fill: P.belly, opacity: 0.8 }, bodyG);
    leg(-30, false); leg(54, false);
    const head = X.svg('g', {}, bodyG);
    X.svg('rect', { x: 34, y: -132, width: 30, height: 18, rx: 8, fill: P.collar, transform: 'rotate(-18 49 -123)' }, head);
    X.svg('circle', { cx: 60, cy: -112, r: 7, fill: K.PAL.butter }, head);
    K.gshape('circle', { cx: 74, cy: -156, r: 36 }, P.body, P.bodyHi, head, { dir: 'tl', reach: 0.8 });
    X.svg('ellipse', { cx: 104, cy: -142, rx: 24, ry: 17, fill: P.belly }, head);
    X.svg('ellipse', { cx: 124, cy: -149, rx: 8, ry: 6.5, fill: '#2b2420' }, head);
    X.svg('path', { d: 'M104,-133 Q112,-127 120,-134', fill: 'none', stroke: '#2b2420', 'stroke-width': 2.6, 'stroke-linecap': 'round' }, head);
    const tongue = X.svg('path', { d: 'M108,-130 q4,12 10,1 Z', fill: K.PAL.coral }, head);
    const eye = X.svg('ellipse', { cx: 90, cy: -164, rx: 4, ry: 5, fill: '#2b2420' }, head);
    const ear = X.svg('path', { d: 'M56,-186 C40,-186 34,-160 40,-136 C46,-128 56,-134 58,-148 C60,-162 64,-180 56,-186 Z', fill: P.dark }, head);
    const trots = [], wags = [{ t0: -1, t1: 1e9, rate: 1.6, amp: 10 }];
    const blinks = []; { const r = rnd(41); let t = 1 + r(); while (t < 400) { blinks.push(t); t += 2.5 + r() * 2; } }
    X.every((t) => {
      let bob = 0, swing = 0, hd = Math.sin(TAU * t / 2.6) * 2, wag = 0;
      for (const w of trots) { const k = env(t, w.t0, w.t1, 0.15); if (k <= 0) continue; const ph = TAU * (t - w.t0) * w.cad; swing = 26 * k * Math.sin(ph); bob += -5 * k * Math.abs(Math.cos(ph)); hd += 4 * k * Math.sin(2 * ph); }
      for (const w of wags) { const k = env(t, w.t0, w.t1, 0.2); if (k > 0) wag = Math.max(wag, 0) + w.amp * k * Math.sin(TAU * t * w.rate); }
      tr(bodyG, `translate(0 ${bob.toFixed(2)})`);
      legs.forEach((l, i) => { const s = (i % 2 === 0 ? 1 : -1) * (l.far ? -1 : 1); tr(l.g, `rotate(${(swing * s).toFixed(2)} ${l.lx} -70)`); });
      tr(tail, `rotate(${(wag + 6).toFixed(2)} -66 -96)`);
      tr(head, `rotate(${hd.toFixed(2)} 50 -120)`);
      tr(ear, `rotate(${(-swing * 0.3 + Math.sin(TAU * t / 2.6 - 0.6) * 4).toFixed(2)} 56 -184)`);
      let sy = 1; for (const b of blinks) { const u = (t - b) / 0.14; if (u > 0 && u < 1) { sy = 1 - 0.9 * Math.sin(Math.PI * u); break; } if (b > t) break; }
      tr(eye, `translate(0 -164) scale(1 ${sy}) translate(0 164)`);
    });
    return {
      g: outer, head, tongue,
      trot: (t0, t1, cad = 3) => { trots.push({ t0, t1, cad }); },
      wag: (t0, t1, rate = 4, amp = 22) => { wags.push({ t0, t1, rate, amp }); },
    };
  };
  /** Brand mark: front-facing pup head in a circle. Returns <g> centred on (cx,cy). */
  K.pupMark = (parent, cx, cy, r, o = {}) => {
    const g = X.svg('g', {}, parent);
    K.gshape('circle', { cx, cy, r }, o.ring || K.PAL.teal, o.ringHi ?? K.PAL.tealMid, g, { dir: 'tl', reach: 0.85 });
    const s = r / 100, f = X.svg('g', { transform: `translate(${cx} ${cy}) scale(${s})` }, g);
    const dark = '#d98a68';
    X.svg('path', { d: 'M-46,-40 C-78,-46 -84,-4 -70,24 C-62,36 -48,28 -46,10 Z', fill: dark }, f);
    X.svg('path', { d: 'M46,-40 C78,-46 84,-4 70,24 C62,36 48,28 46,10 Z', fill: dark }, f);
    K.gshape('ellipse', { cx: 0, cy: -2, rx: 52, ry: 50 }, K.PAL.peach, K.PAL.peachHi, f, { dir: 'tl', reach: 0.8 });
    X.svg('ellipse', { cx: 0, cy: 24, rx: 30, ry: 22, fill: K.PAL.creamHi }, f);
    X.svg('ellipse', { cx: 0, cy: 12, rx: 11, ry: 8, fill: '#2b2420' }, f);
    X.svg('path', { d: 'M-12,28 Q0,38 12,28', fill: 'none', stroke: '#2b2420', 'stroke-width': 4, 'stroke-linecap': 'round' }, f);
    X.svg('path', { d: 'M-6,32 q6,16 12,0 Z', fill: K.PAL.coral }, f);
    g.eyes = [-20, 20].map((ex) => X.svg('ellipse', { cx: ex, cy: -12, rx: 6, ry: 7.5, fill: '#2b2420' }, f));
    return g;
  };

  // ------------------------------------------------------------------ invoice-sheep (side view, faces +x)
  K.sheep = (parent, o = {}) => {
    const P = Object.assign({ x: 0, y: 0, scale: 1, wool: '#fffdf8', woolHi: K.PAL.periHi, face: '#3d3a52', seed: 1, tag: K.PAL.coral }, o);
    const outer = X.svg('g', {}, parent);
    gsap.set(outer, { x: P.x, y: P.y, scale: P.scale });
    const flip = X.svg('g', { transform: o.flip ? 'scale(-1 1)' : '' }, outer);
    const bodyG = X.svg('g', {}, flip);
    const legs = [];
    for (const [lx, far] of [[-34, 1], [30, 1], [-22, 0], [42, 0]]) {
      const g = X.svg('g', {}, bodyG);
      X.svg('rect', { x: lx - 5, y: -58, width: 10, height: 58, rx: 5, fill: far ? '#57536e' : P.face }, g);
      legs.push({ g, lx, far });
      if (far && lx === 30) { /* far legs first */ }
    }
    const wool = X.svg('g', {}, bodyG);
    const r = rnd(P.seed);
    const puffs = [[-50, -78, 26], [-26, -98, 30], [6, -102, 30], [36, -90, 27], [48, -66, 22], [-46, -54, 22], [-14, -56, 26], [20, -56, 26], [0, -80, 36]];
    for (const [px, py, pr] of puffs) K.gshape('circle', { cx: px, cy: py, r: pr + r() * 3 }, P.wool, P.woolHi, wool, { dir: 'br', reach: 0.9, filter: 'kgS', seed: 9 });
    const head = X.svg('g', {}, bodyG);
    X.svg('ellipse', { cx: 70, cy: -96, rx: 20, ry: 24, fill: P.face, transform: 'rotate(20 70 -96)' }, head);
    X.svg('ellipse', { cx: 56, cy: -116, rx: 11, ry: 5.5, fill: '#57536e', transform: 'rotate(-30 56 -116)' }, head);
    X.svg('circle', { cx: 76, cy: -102, r: 3.4, fill: '#fff' }, head);
    X.svg('circle', { cx: 56, cy: -116, r: 14, fill: P.wool }, head);
    // the invoice tag on its flank
    const tag = X.svg('g', { transform: 'rotate(-8 -6 -80)' }, bodyG);
    X.svg('rect', { x: -30, y: -102, width: 46, height: 56, rx: 5, fill: K.PAL.paper }, tag);
    X.svg('rect', { x: -30, y: -102, width: 46, height: 12, rx: 5, fill: P.tag }, tag);
    X.svg('rect', { x: -30, y: -94, width: 46, height: 4, fill: P.tag }, tag);
    X.svg('text', { x: -7, y: -60, 'font-family': K.FONT, 'font-size': 26, 'font-weight': 700, fill: K.PAL.teal, 'text-anchor': 'middle', text: '$', transform: o.flip ? 'translate(-14 0) scale(-1 1)' : '' }, tag);
    const trots = [], hops = [];
    const ph0 = r() * TAU;
    X.every((t) => {
      let swing = 0, bob = 0, hd = Math.sin(TAU * t / 3 + ph0) * 3;
      for (const w of trots) { const k = env(t, w.t0, w.t1, 0.15); if (k <= 0) continue; const ph = TAU * (t - w.t0) * w.cad + ph0; swing = 24 * k * Math.sin(ph); bob = -4 * k * Math.abs(Math.cos(ph)); hd += 5 * k * Math.sin(2 * ph); }
      for (const h of hops) { const u = (t - h.t) / h.dur; if (u > 0 && u < 1) bob -= h.h * Math.sin(Math.PI * u); }
      tr(bodyG, `translate(0 ${bob.toFixed(2)})`);
      legs.forEach((l, i) => tr(l.g, `rotate(${(swing * (i % 2 ? 1 : -1)).toFixed(2)} ${l.lx} -56)`));
      tr(head, `rotate(${hd.toFixed(2)} 52 -90)`);
    });
    return { g: outer, trot: (t0, t1, cad = 2.6) => trots.push({ t0, t1, cad }), hop: (t, h = 40, dur = 0.45) => hops.push({ t, h, dur }) };
  };

  // ------------------------------------------------------------------ props (no outlines, grain highlights)
  K.desk = (p, x, y, w = 900, o = {}) => {
    const g = X.svg('g', {}, p);
    const c = o.color || K.PAL.teal;
    X.svg('rect', { x: x + 40, y: y + 16, width: 16, height: 240, fill: c }, g);
    X.svg('rect', { x: x + w - 56, y: y + 16, width: 16, height: 240, fill: c }, g);
    K.gshape('rect', { x: x + w - 300, y: y + 16, width: 220, height: 120, rx: 6 }, K.PAL.cream, K.PAL.creamHi, g, { dir: 't' });
    X.svg('rect', { x: x + w - 220, y: y + 66, width: 60, height: 12, rx: 6, fill: c }, g);
    K.gshape('rect', { x, y, width: w, height: 22, rx: 8 }, c, K.PAL.tealMid, g, { dir: 't', reach: 0.8 });
    return g;
  };
  K.monitor = (p, x, y, w = 420, h = 280, o = {}) => {
    const g = X.svg('g', {}, p);
    const c = o.color || K.PAL.teal;
    X.svg('path', { d: `M${x + w / 2 - 22},${y + h} L${x + w / 2 + 22},${y + h} L${x + w / 2 + 40},${y + h + 64} L${x + w / 2 - 40},${y + h + 64} Z`, fill: c }, g);
    X.svg('rect', { x: x + w / 2 - 90, y: y + h + 58, width: 180, height: 14, rx: 7, fill: K.PAL.green }, g);
    K.gshape('rect', { x, y, width: w, height: h, rx: 26 }, c, K.PAL.tealMid, g, { dir: 'tl', reach: 0.6 });
    X.svg('rect', { x: x + 22, y: y + 22, width: w - 44, height: h - 56, rx: 12, fill: o.screen || K.PAL.creamHi }, g);
    g.screen = X.svg('g', {}, g);
    g.sx = x + 22; g.sy = y + 22; g.sw = w - 44; g.sh = h - 56;
    return g;
  };
  K.laptop = (p, x, y, w = 300, o = {}) => {
    const g = X.svg('g', {}, p);
    const h = w * 0.62, c = o.color || K.PAL.teal;
    K.gshape('rect', { x, y, width: w, height: h, rx: 14 }, c, K.PAL.tealMid, g, { dir: 'tl', reach: 0.5 });
    X.svg('rect', { x: x + 14, y: y + 14, width: w - 28, height: h - 26, rx: 6, fill: o.screen || K.PAL.creamHi }, g);
    X.svg('path', { d: `M${x - 30},${y + h} L${x + w + 30},${y + h} L${x + w + 10},${y + h + 20} L${x - 10},${y + h + 20} Z`, fill: K.PAL.peri }, g);
    g.screen = X.svg('g', {}, g);
    g.sx = x + 14; g.sy = y + 14; g.sw = w - 28; g.sh = h - 26;
    return g;
  };
  K.plant = (p, x, y, s = 1, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const leafs = [[-30, -120, -35], [28, -128, 30], [0, -150, 0], [-44, -88, -60], [44, -92, 58]];
    leafs.forEach(([lx, ly, rot], i) => K.gshape('ellipse', { cx: lx, cy: ly, rx: 18, ry: 44, transform: `rotate(${rot} ${lx} ${ly})` }, i % 2 ? K.PAL.teal : K.PAL.tealMid, K.PAL.tealHi, g, { dir: 't', reach: 0.7 }));
    K.gshape('path', { d: 'M-46,-62 L46,-62 L36,0 L-36,0 Z' }, o.pot || K.PAL.coral, K.PAL.coralHi, g, { dir: 'tl' });
    g.leaves = g;
    return g;
  };
  K.mug = (p, x, y, s = 1, color = K.PAL.butter) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    X.svg('path', { d: 'M22,-40 C46,-40 46,-12 22,-12', fill: 'none', stroke: color, 'stroke-width': 9 }, g);
    K.gshape('rect', { x: -26, y: -56, width: 52, height: 56, rx: 10 }, color, K.PAL.butterHi, g, { dir: 'tl' });
    g.steam = [-10, 8].map((sx, i) => X.svg('path', { d: `M${sx},-68 q-8,-12 0,-24 q8,-12 0,-24`, fill: 'none', stroke: K.PAL.peri, 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.8 }, g));
    g.steam.forEach((el, i) => X.every((t) => tr(el, `translate(0 ${(-6 * ((t * 0.7 + i * 0.5) % 1)).toFixed(2)})`)));
    return g;
  };
  K.lamp = (p, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    X.svg('rect', { x: -40, y: -14, width: 80, height: 14, rx: 7, fill: K.PAL.teal }, g);
    X.svg('path', { d: 'M0,-10 L-30,-110 L30,-170', fill: 'none', stroke: K.PAL.teal, 'stroke-width': 9, 'stroke-linecap': 'round' }, g);
    K.gshape('path', { d: 'M10,-196 L72,-150 L36,-118 Z' }, K.PAL.coral, K.PAL.coralHi, g, { dir: 'tl' });
    return g;
  };
  K.shelf = (p, x, y, w = 360, o = {}) => {
    const g = X.svg('g', {}, p);
    const cols = [K.PAL.coral, K.PAL.teal, K.PAL.butter, K.PAL.lav, K.PAL.tealMid, K.PAL.peach];
    let bx = x + 20;
    (o.books ?? 6) && cols.forEach((c, i) => { const bw = 22 + (i % 3) * 6, bh = 70 + ((i * 37) % 30); X.svg('rect', { x: bx, y: y - bh, width: bw, height: bh, rx: 3, fill: c, transform: i === 5 ? `rotate(14 ${bx} ${y})` : '' }, g); bx += bw + 4; });
    K.gshape('rect', { x, y, width: w, height: 16, rx: 6 }, K.PAL.teal, K.PAL.tealMid, g, { dir: 't' });
    return g;
  };
  K.sticky = (p, x, y, s = 60, color = K.PAL.butter, rot = 0) => {
    const g = X.svg('g', { transform: `rotate(${rot} ${x} ${y})` }, p);
    K.gshape('rect', { x: x - s / 2, y: y - s / 2, width: s, height: s, rx: 4 }, color, K.PAL.creamHi, g, { dir: 'tl', reach: 0.8 });
    return g;
  };
  K.window = (p, x, y, w = 300, h = 260) => {
    const g = X.svg('g', {}, p);
    K.gshape('rect', { x, y, width: w, height: h, rx: 18 }, K.PAL.periHi, K.PAL.white, g, { dir: 'tr' });
    K.cloud(g, x + w * 0.62, y + h * 0.42, 0.5, '#ffffff');
    X.svg('rect', { x: x + w / 2 - 6, y, width: 12, height: h, fill: K.PAL.teal }, g);
    X.svg('rect', { x, y: y + h / 2 - 6, width: w, height: 12, fill: K.PAL.teal }, g);
    X.svg('rect', { x, y, width: w, height: h, rx: 18, fill: 'none', stroke: K.PAL.teal, 'stroke-width': 14 }, g);
    return g;
  };
  K.cloud = (p, x, y, s = 1, color = K.PAL.peri, hi = K.PAL.periHi) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    K.gshape('path', { d: 'M-110,30 C-130,30 -132,-6 -104,-10 C-104,-44 -60,-56 -40,-30 C-30,-74 40,-78 50,-26 C74,-44 112,-26 104,6 C126,8 126,30 104,30 Z' }, color, hi, g, { dir: 't', reach: 0.8 });
    return g;
  };
  K.sun = (p, x, y, r = 70) => {
    const g = X.svg('g', {}, p);
    const rays = X.svg('g', {}, g);
    for (let i = 0; i < 10; i++) { const a = (i / 10) * TAU; X.svg('rect', { x: x - 6, y: y - r - 38, width: 12, height: 26, rx: 6, fill: K.PAL.butter, transform: `rotate(${(a * 180) / Math.PI} ${x} ${y})` }, rays); }
    X.every((t) => tr(rays, `rotate(${(t * 8).toFixed(2)} ${x} ${y})`));
    K.gshape('circle', { cx: x, cy: y, r }, K.PAL.butter, K.PAL.butterHi, g, { dir: 'tl' });
    return g;
  };
  /** Rolling hills band: layers [{y, amp, color, hi, seed}] from back to front, drawn across [x0,x1]. */
  K.hills = (p, x0, x1, layers, bottom = 1200) => {
    const g = X.svg('g', {}, p);
    layers.forEach((L, i) => {
      const r = rnd(L.seed ?? i + 1), n = Math.ceil((x1 - x0) / (L.wave ?? 700)) + 1;
      let d = `M${x0},${bottom} L${x0},${L.y}`;
      for (let k = 0; k < n; k++) {
        const xa = x0 + k * (L.wave ?? 700), xb = xa + (L.wave ?? 700), ym = L.y - L.amp * (0.6 + r() * 0.6);
        d += ` C${xa + (L.wave ?? 700) * 0.3},${ym} ${xa + (L.wave ?? 700) * 0.7},${ym} ${xb},${L.y}`;
      }
      d += ` L${x0 + n * (L.wave ?? 700)},${bottom} Z`;
      K.gshape('path', { d }, L.color, L.hi, g, { dir: 't', reach: 0.35, filter: 'kgH', freq: 0.8, spread: 1.6, seed: 13 + i });
    });
    return g;
  };
  /** Invoice paper card. o: {amount, color, status, lines} */
  K.invoice = (p, x, y, w = 220, h = 290, o = {}) => {
    const g = X.svg('g', {}, p);
    K.gshape('rect', { x, y, width: w, height: h, rx: 14 }, K.PAL.paper, K.PAL.cream, g, { dir: 'br', reach: 0.6 });
    X.svg('rect', { x, y, width: w, height: h * 0.18, rx: 14, fill: o.color || K.PAL.coral }, g);
    X.svg('rect', { x, y: y + h * 0.1, width: w, height: h * 0.08, fill: o.color || K.PAL.coral }, g);
    for (let i = 0; i < (o.lines ?? 3); i++) X.svg('rect', { x: x + w * 0.12, y: y + h * (0.3 + i * 0.11), width: w * (i === 1 ? 0.5 : 0.7), height: h * 0.04, rx: h * 0.02, fill: K.PAL.periHi }, g);
    if (o.amount !== false) X.svg('text', { x: x + w * 0.88, y: y + h * 0.86, 'font-family': K.FONT, 'font-size': h * 0.15, 'font-weight': 700, fill: K.PAL.teal, 'text-anchor': 'end', text: o.amount || '$' }, g);
    return g;
  };
  K.phone = (p, x, y, w = 200, h = 380, o = {}) => {
    const g = X.svg('g', {}, p);
    K.gshape('rect', { x, y, width: w, height: h, rx: w * 0.16 }, o.color || K.PAL.teal, K.PAL.tealMid, g, { dir: 'tl', reach: 0.5 });
    X.svg('rect', { x: x + w * 0.07, y: y + w * 0.1, width: w * 0.86, height: h - w * 0.2, rx: w * 0.1, fill: o.screen || K.PAL.creamHi }, g);
    g.screen = X.svg('g', {}, g);
    g.sx = x + w * 0.07; g.sy = y + w * 0.1; g.sw = w * 0.86; g.sh = h - w * 0.2;
    return g;
  };
  K.card = (p, x, y, w, h, o = {}) => {
    const g = X.svg('g', {}, p);
    K.gshape('rect', { x, y, width: w, height: h, rx: o.r ?? 18 }, o.color || K.PAL.white, o.hi ?? K.PAL.mintHi, g, { dir: o.dir || 'br', reach: 0.7 });
    if (o.header) X.svg('path', { d: `M${x},${y + (o.r ?? 18)} a${o.r ?? 18},${o.r ?? 18} 0 0 1 ${o.r ?? 18},${-(o.r ?? 18)} h${w - 2 * (o.r ?? 18)} a${o.r ?? 18},${o.r ?? 18} 0 0 1 ${o.r ?? 18},${o.r ?? 18} v${o.header - (o.r ?? 18)} h${-w} Z`, fill: o.headerColor || K.PAL.tealMid }, g);
    return g;
  };
  K.pill = (p, x, y, str, o = {}) => {
    const size = o.size || 36, w = (o.w ?? K.textW(str, size, o.weight || 600) + size * 1.4), h = size * 1.7;
    const g = X.svg('g', {}, p);
    K.gshape('rect', { x: x - w / 2, y: y - h / 2, width: w, height: h, rx: h / 2 }, o.color || K.PAL.teal, o.hi ?? K.PAL.tealMid, g, { dir: 'tl', reach: 0.55 });
    K.label(g, x, y + size * 0.36, str, { size, weight: o.weight || 600, color: o.textColor || '#fff' });
    g.w = w; g.h = h;
    return g;
  };
  K.paperPlane = (p, x, y, s = 1, color = K.PAL.lav) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const inner = X.svg('g', {}, g);
    K.gshape('path', { d: 'M-60,6 L70,-50 L-6,22 Z' }, color, K.PAL.lavHi, inner, { dir: 't' });
    X.svg('path', { d: 'M-6,22 L70,-50 L20,52 Z', fill: '#7d70cc' }, inner);
    X.svg('path', { d: 'M-6,22 L4,48 L20,30 Z', fill: '#6a5fb8' }, inner);
    g.inner = inner;
    return g;
  };
  K.coin = (p, x, y, r = 34) => {
    const g = X.svg('g', {}, p);
    K.gshape('circle', { cx: x, cy: y, r }, K.PAL.butter, K.PAL.butterHi, g, { dir: 'tl' });
    X.svg('circle', { cx: x, cy: y, r: r * 0.72, fill: 'none', stroke: '#e5b552', 'stroke-width': r * 0.1 }, g);
    K.glyph('dollar', g, x, y, r * 0.48, '#d9a43f');
    return g;
  };
  K.fence = (p, x, y, w = 600, o = {}) => {
    const g = X.svg('g', {}, p);
    const c = o.color || K.PAL.peach, hi = K.PAL.peachHi, h = o.h ?? 110;
    const n = Math.round(w / 70);
    for (let i = 0; i <= n; i++) K.gshape('path', { d: `M${x + i * 70 - 11},${y} L${x + i * 70 - 11},${y - h} L${x + i * 70},${y - h - 14} L${x + i * 70 + 11},${y - h} L${x + i * 70 + 11},${y} Z` }, c, hi, g, { dir: 'l', reach: 0.6, filter: 'kgF' });
    X.svg('rect', { x: x - 20, y: y - h * 0.84, width: n * 70 + 40, height: 14, rx: 7, fill: '#e3a77c' }, g);
    X.svg('rect', { x: x - 20, y: y - h * 0.42, width: n * 70 + 40, height: 14, rx: 7, fill: '#e3a77c' }, g);
    return g;
  };
  K.sparkle = (p, x, y, s = 20, color = K.PAL.butter) => X.svg('path', { d: `M${x},${y - s} Q${x + s * 0.18},${y - s * 0.18} ${x + s},${y} Q${x + s * 0.18},${y + s * 0.18} ${x},${y + s} Q${x - s * 0.18},${y + s * 0.18} ${x - s},${y} Q${x - s * 0.18},${y - s * 0.18} ${x},${y - s} Z`, fill: color }, p);
  /** Ambient floaters (sparkles, dots, rings, leaves) drifting on sine loops at the frame edges. */
  K.floaters = (p, items, seed = 5) => {
    const r = rnd(seed), g = X.svg('g', {}, p);
    items.forEach(([kind, x, y, s, color], i) => {
      const el = X.svg('g', {}, g);
      if (kind === 'sparkle') K.sparkle(el, 0, 0, s, color);
      else if (kind === 'dot') X.svg('circle', { cx: 0, cy: 0, r: s, fill: color }, el);
      else if (kind === 'ring') X.svg('circle', { cx: 0, cy: 0, r: s, fill: 'none', stroke: color, 'stroke-width': Math.max(4, s * 0.35) }, el);
      else if (kind === 'leaf') X.svg('ellipse', { cx: 0, cy: 0, rx: s * 0.45, ry: s, fill: color, transform: 'rotate(35)' }, el);
      const px = 3 + r() * 2.5, py = 3.5 + r() * 2.5, ph = r() * TAU, ax = 6 + r() * 6, ay = 6 + r() * 6;
      X.every((t) => tr(el, `translate(${(x + ax * Math.sin(TAU * t / px + ph)).toFixed(1)} ${(y + ay * Math.cos(TAU * t / py + ph * 1.7)).toFixed(1)}) rotate(${(10 * Math.sin(TAU * t / 6 + ph)).toFixed(1)})`));
    });
    return g;
  };
})();
