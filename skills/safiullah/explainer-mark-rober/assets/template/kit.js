/* explainer-mark-rober kit: the animated layer of an engineering-build video.
 * Load after /engine/lib/explainer.js and before scene.js; exposes window.K.
 * Every helper is a pure function of timeline time (X.tl, X.every, X.rand), so any frame can be seeked directly.
 *
 *  Flat physics layer   K.skyField · K.cloud · K.clouds · K.groundStrip · K.forceArrow (+ .to keyframes)
 *                       K.label · K.chip · K.bigNumber · K.figure · K.streaks · K.flatTree · K.flatHouse · K.balloon
 *  Footage annotations  K.pointer (red arrow on the noun) · K.formula + K.scribbleIn · K.redX + K.stamp · K.tag
 *                       K.caption · K.monoCard · K.footage (handheld + push) · K.vignette · K.rasterize
 *  Engineering screens  K.cad3d (flat-shaded pseudo-3D with edges) · K.box · K.cyl · K.frustum · K.grid3d
 *                       K.cadUI (light modelling-app chrome) · K.cadStage (grey gradient)
 *  Map tracker          K.mapBase · K.mapRoad · K.mapLabel · K.houseDiamond · K.mapPin · K.gpsTrack · K.disclaimer
 *  Cuts                 K.cut(t, sfx) — hard cuts only; sfx on graphic entries / scale cuts
 */
(function () {
  const K = (window.K = {});

  // ------------------------------------------------------------------ palette (sampled from source frames)
  K.C = {
    sky: '#86B3C7', skyHi: '#8FBDD1', skyLo: '#7AA5B8',          // dusty sky-blue field (#88B6CA family)
    cloud: '#DCEAF1', cloudHi: '#EDF5F9',                         // flat two-tone puffs
    ground: '#567D64', groundDk: '#47695A', groundDeep: '#3B5A4C',
    coral: '#DD6751',                                              // force arrows (flat diagrams)
    red: '#E8322A',                                                // pointer arrows / X on footage
    white: '#FFFFFF', ink: '#1E2A30',
    skin: '#E8C8A0', shirt: '#9EA2A5', cloth: '#626669', clothDk: '#4E5256', shoe: '#2B2E31',
    pink: '#CAA7C1', wood: '#A38668', woodDk: '#7E644C', bark: '#7A5C45',
    leaf: '#5E8A68', leafHi: '#6F9B77', leafDk: '#4F7759',
    orange: '#F0782D', mapBase: '#F2F2F1', park: '#C1DFB8', water: '#AFD3E2', road: '#FFFFFF', roadEdge: '#E1E1DE',
    cadRed: '#C0392B', cadYellow: '#E8C21B', cadEdge: '#2A2D30',
  };
  const S = (tag, a, p) => X.svg(tag, a, p);
  let fid = 0;                                   // unique ids for defs (never Math.random)
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  K.clamp = clamp;
  K.lerp = (a, b, k) => a + (b - a) * k;
  K.ease = (name) => gsap.parseEase(name);
  /** progress 0..1 of [t0, t0+dur] eased: the pure-function way to animate inside X.every */
  K.prog = (t, t0, dur, ease = 'none') => K.ease(ease)(clamp((t - t0) / dur, 0, 1));
  /** smooth value noise in [-1, 1] (sum of seeded sines) for handheld drift / idle life */
  K.noise = (seed) => {
    const r = X.rand(seed), ph = [r() * 6.28, r() * 6.28, r() * 6.28], fr = [0.31 + r() * 0.2, 0.83 + r() * 0.3, 1.9 + r() * 0.6];
    return (t) => (Math.sin(t * fr[0] * 6.283 + ph[0]) * 0.55 + Math.sin(t * fr[1] * 6.283 + ph[1]) * 0.3 + Math.sin(t * fr[2] * 6.283 + ph[2]) * 0.15);
  };

  // ------------------------------------------------------------------ cuts
  /** Rober cuts are always hard. Use sfx only on graphic entries and scale cuts ('whoosh' soft, 'zoom_in' on a scale cut). */
  K.cut = (t, sfx = 'whoosh', gain = 0.22) => { if (sfx) X.sfx(Math.max(0, t - 0.06), sfx, { dur: 0.35, gain }); };

  // ------------------------------------------------------------------ flat physics layer
  /** Sky-blue field with a very soft centre lift (the source frames carry a faint vignette, nothing more). */
  K.skyField = (parent, o = {}) => {
    const id = o.id || 'kskyfield' + (fid++);
    const fill = X.radial(id, [[0, o.hi || K.C.skyHi], [0.65, o.base || K.C.sky], [1, o.lo || K.C.skyLo]], 0.5, 0.42, 0.75);
    return S('rect', { x: o.x ?? -2000, y: o.y ?? -2000, width: o.w ?? 5920, height: o.h ?? 5080, fill }, parent);
  };
  /** Flat outline-free cloud: a scalloped two-tone puff of circles. s = 1 → about 280 px wide. */
  K.cloud = (parent, x, y, s = 1, seed = 1, o = {}) => {
    const r = X.rand(seed), g = S('g', { transform: `translate(${x},${y}) scale(${s})`, opacity: o.opacity ?? 0.95 }, parent);
    const n = 4 + Math.floor(r() * 3), base = [];
    for (let i = 0; i < n; i++) {
      const k = i / (n - 1), cx = -120 + 240 * k + (r() - 0.5) * 18;
      const rad = 34 + Math.sin(k * Math.PI) * (34 + r() * 16);
      base.push([cx, 12 - Math.sin(k * Math.PI) * (18 + r() * 14), rad]);
    }
    base.push([-140, 30, 26 + r() * 6], [140, 30, 24 + r() * 6]);
    const lo = o.color || K.C.cloud, hi = o.hi || K.C.cloudHi;
    S('rect', { x: -140, y: 14, width: 280, height: 42, rx: 21, fill: lo }, g);
    base.forEach(([cx, cy, rr]) => S('circle', { cx, cy, r: rr, fill: lo }, g));
    base.slice(0, n).forEach(([cx, cy, rr]) => S('circle', { cx: cx - rr * 0.18, cy: cy - rr * 0.2, r: rr * 0.72, fill: hi }, g));
    g._x = x; g._y = y; g._s = s;
    return g;
  };
  /** A drifting cloud layer. speed px/s (+ = drift right; with axis:'y', + = stream down — use −300…−600 while the
   *  camera tracks a fall so clouds rush upward). cam(t) → {x, y} camera offset for parallax (factor k). */
  K.clouds = (parent, o = {}) => {
    const r = X.rand(o.seed || 11), n = o.n || 5, W = o.w || 1920, M = 360, list = [];
    for (let i = 0; i < n; i++) {
      const s = K.lerp(o.sMin ?? 0.55, o.sMax ?? 1.0, r());
      const c = K.cloud(parent, 0, 0, s, (o.seed || 11) * 31 + i, { opacity: o.opacity });
      list.push({ g: c, x0: (i + r() * 0.8) * (W + M) / n - M / 2, y: K.lerp(o.yMin ?? 80, o.yMax ?? 520, r()), s });
    }
    const sp = o.speed ?? -24, k = o.parallax ?? 1, x0 = o.x || 0;
    if (o.axis === 'y') {
      const H = o.h || 1080, r2 = X.rand((o.seed || 11) + 5);
      list.forEach((c, i) => { c.xf = K.lerp(o.xMin ?? 80, o.xMax ?? 1840, r2()); c.y0 = (i + r2() * 0.8) * (H + M) / n - M / 2; });
      X.every((t) => {
        for (const c of list) {
          let y = c.y0 + sp * t;
          y = ((y + M) % (H + 2 * M) + (H + 2 * M)) % (H + 2 * M) - M;
          c.g.setAttribute('transform', `translate(${c.xf.toFixed(1)},${y.toFixed(1)}) scale(${c.s})`);
        }
      });
      return list;
    }
    X.every((t) => {
      const cam = o.cam ? o.cam(t) : { x: 0, y: 0 };
      for (const c of list) {
        let x = c.x0 + sp * t - cam.x * k;
        x = ((x + M) % (W + 2 * M) + (W + 2 * M)) % (W + 2 * M) - M;
        c.g.setAttribute('transform', `translate(${(x0 + x).toFixed(1)},${(c.y - cam.y * k).toFixed(1)}) scale(${c.s})`);
      }
    });
    return list;
  };
  K.groundStrip = (parent, y = 900, o = {}) => S('rect', { x: o.x ?? -2000, y, width: o.w ?? 5920, height: o.h ?? 2000, fill: o.color || K.C.ground }, parent);

  /** Coral force arrow: rect shaft + triangle head, no stroke; built along +x then rotated (deg, 0 = right, 90 = down).
   *  Length carries the quantity: a.set(len) or keyframes a.to(t, dur, len, ease) (evaluated per frame, seek-safe). */
  K.forceArrow = (parent, o) => {
    const c = o.color || K.C.coral, sh = o.shaft ?? 26, hw = o.head ?? 60, hl = o.headLen ?? 36;
    const g = S('g', { transform: `translate(${o.x},${o.y}) rotate(${o.angle || 0})` }, parent);
    const shaft = S('rect', { x: o.gap || 0, y: -sh / 2, width: 0, height: sh, fill: c }, g);
    const head = S('polygon', { points: '0,0 0,0 0,0', fill: c }, g);
    const gap = o.gap || 0;
    const a = {
      g, len: 0, keys: [],
      set(L) {
        a.len = L = Math.max(0, L);
        const k = Math.min(1, L / hl), hL = hl * k, hW = hw * k, sL = Math.max(0, L - hL);
        shaft.setAttribute('width', sL.toFixed(2));
        shaft.setAttribute('height', (sh * Math.max(k, 0.0001)).toFixed(2));
        shaft.setAttribute('y', (-sh * k / 2).toFixed(2));
        head.setAttribute('points', `${gap + sL},${-hW / 2} ${gap + sL + hL},0 ${gap + sL},${hW / 2}`);
      },
      to(t0, dur, L, ease = 'power2.out') { a.keys.push({ t0, dur, L, ease }); a.keys.sort((p, q) => p.t0 - q.t0); return a; },
    };
    a.set(o.len || 0);
    const L0 = o.len || 0;
    X.every((t) => {
      if (!a.keys.length) return;
      let L = L0, prev = L0;
      for (const kf of a.keys) {
        if (t < kf.t0) break;
        L = K.lerp(prev, kf.L, K.prog(t, kf.t0, kf.dur, kf.ease));
        prev = kf.L;
      }
      a.set(L);
    });
    return a;
  };
  /** White geometric caps label (GRAVITY / TENSION): Montserrat 700, slightly letter-spaced. */
  K.label = (parent, text, x, y, o = {}) => S('text', {
    x, y, 'text-anchor': o.anchor || 'middle', 'font-family': 'Montserrat', 'font-weight': o.weight || 700,
    'font-size': o.size || 50, 'letter-spacing': o.ls ?? 1.5, fill: o.color || '#fff', text: text.toUpperCase(),
  }, parent);
  /** Scale tag: small white caps in a dark chip ("SPACE", "150 M"). Returns the group (anchor = centre). */
  K.chip = (parent, text, x, y, o = {}) => {
    const sz = o.size || 26, g = S('g', { transform: `translate(${x},${y})` }, parent);
    const w = text.length * sz * 0.72 + sz * 1.1, h = sz * 1.6;
    S('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 6, fill: o.bg || '#1C2930', opacity: o.bgOpacity ?? 0.82 }, g);
    S('text', { x: 0, y: sz * 0.36, 'text-anchor': 'middle', 'font-family': 'Montserrat', 'font-weight': 700, 'font-size': sz, 'letter-spacing': 1.5, fill: '#fff', text: text.toUpperCase() }, g);
    return g;
  };
  /** The big white result: value / UNIT / (conversion), centred on x. size = digit font-size (190 ≈ 135 px caps). */
  K.bigNumber = (parent, o) => {
    const sz = o.size || 190, g = S('g', {}, parent), x = o.x, y = o.y;
    const f = { 'text-anchor': 'middle', 'font-family': 'Montserrat', fill: '#fff' };
    S('text', { ...f, x, y, 'font-weight': 700, 'font-size': sz, 'letter-spacing': -2, text: o.value }, g);
    S('text', { ...f, x, y: y + sz * 0.68, 'font-weight': 700, 'font-size': sz * 0.62, text: (o.unit || '').toUpperCase() }, g);
    if (o.conv) S('text', { ...f, x, y: y + sz * 0.68 + sz * 0.34, 'font-weight': 600, 'font-size': sz * 0.27, text: o.conv }, g);
    return g;
  };
  /** Faceless pictogram person (about 4 heads tall). pose: stand | skydive | hang. Origin = feet (stand) / centre. */
  K.figure = (parent, o = {}) => {
    const h = o.h || 220, u = h / 8, g = S('g', { transform: `translate(${o.x || 0},${o.y || 0})` }, parent);
    const C = K.C, shirt = o.shirt || C.shirt, pants = o.pants || C.cloth;
    const part = (tag, a) => S(tag, a, g);
    if (o.pose === 'hang') {          // arms up holding something above the head
      part('rect', { x: -1.25 * u, y: -8.6 * u, width: 0.7 * u, height: 2.6 * u, rx: 0.35 * u, fill: C.skin });
      part('rect', { x: 0.55 * u, y: -8.6 * u, width: 0.7 * u, height: 2.6 * u, rx: 0.35 * u, fill: C.skin });
    }
    part('rect', { x: -0.95 * u, y: -3.6 * u, width: 0.85 * u, height: 3.4 * u, rx: 0.3 * u, fill: pants });
    part('rect', { x: 0.1 * u, y: -3.6 * u, width: 0.85 * u, height: 3.4 * u, rx: 0.3 * u, fill: pants });
    part('rect', { x: -1.15 * u, y: -0.35 * u, width: 1.1 * u, height: 0.45 * u, rx: 0.2 * u, fill: C.shoe });
    part('rect', { x: 0.05 * u, y: -0.35 * u, width: 1.1 * u, height: 0.45 * u, rx: 0.2 * u, fill: C.shoe });
    part('rect', { x: -1.15 * u, y: -6.4 * u, width: 2.3 * u, height: 3.2 * u, rx: 0.5 * u, fill: shirt });
    if (o.pose !== 'hang') {
      part('rect', { x: -1.75 * u, y: -6.2 * u, width: 0.6 * u, height: 2.8 * u, rx: 0.3 * u, fill: C.skin });
      part('rect', { x: 1.15 * u, y: -6.2 * u, width: 0.6 * u, height: 2.8 * u, rx: 0.3 * u, fill: C.skin });
    }
    part('circle', { cx: 0, cy: -7.25 * u, r: 0.95 * u, fill: C.skin });
    if (o.pose === 'skydive') g.setAttribute('transform', `translate(${o.x || 0},${o.y || 0}) rotate(-80)`);
    return g;
  };
  /** White translucent speed-streak wedges trailing an object; flicker per frame. dir = trail direction (deg). */
  K.streaks = (parent, o = {}) => {
    const g = S('g', { transform: `translate(${o.x || 0},${o.y || 0}) rotate(${o.dir ?? 180})` }, parent);
    const r = X.rand(o.seed || 5), n = o.n || 5, els = [];
    for (let i = 0; i < n; i++) {
      const off = (i - (n - 1) / 2) * (o.spread || 26), L = (o.len || 220) * (0.6 + r() * 0.5);
      els.push(S('path', { d: `M0,${off - 3} L${L},${off * 1.6 - 1} L${L},${off * 1.6 + 1} L0,${off + 3}Z`, fill: '#fff', opacity: 0.32 }, g));
    }
    X.every((t) => { const f = Math.floor(t * 24); els.forEach((e, i) => e.setAttribute('opacity', (0.22 + 0.14 * (((f * 7 + i * 13) % 5) / 4)).toFixed(3))); });
    return g;
  };
  /** Flat tree: tapered trunk + overlapping canopy discs in two greens. Origin = trunk base. */
  K.flatTree = (parent, x, y, o = {}) => {
    const h = o.h || 420, w = o.trunk || 46, g = S('g', { transform: `translate(${x},${y})` }, parent), r = X.rand(o.seed || 3);
    S('path', { d: `M${-w / 2},0 L${-w * 0.36},${-h} L${w * 0.36},${-h} L${w / 2},0Z`, fill: o.bark || K.C.bark }, g);
    const R = o.r || 150, cy = -h - R * 0.35, discs = [];
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2 + r() * 0.5, d = R * (0.45 + r() * 0.2);
      discs.push([Math.cos(a) * d * 1.15, cy + Math.sin(a) * d * 0.7, R * (0.48 + r() * 0.18)]);
    }
    discs.push([0, cy, R * 0.75]);
    discs.forEach(([cx, cyy, rr]) => S('circle', { cx, cy: cyy, r: rr, fill: o.leaf || K.C.leaf }, g));
    discs.slice(0, 5).forEach(([cx, cyy, rr]) => S('circle', { cx: cx - rr * 0.2, cy: cyy - rr * 0.25, r: rr * 0.62, fill: o.leafHi || K.C.leafHi }, g));
    g.canopyY = cy;
    return g;
  };
  /** Flat house with a deck on its right. Origin = ground-left corner. */
  K.flatHouse = (parent, x, y, o = {}) => {
    const w = o.w || 280, h = o.h || 260, g = S('g', { transform: `translate(${x},${y})` }, parent);
    S('rect', { x: 0, y: -h, width: w, height: h, fill: o.wall || '#D8D2C6' }, g);
    S('polygon', { points: `${-22},${-h} ${w / 2},${-h - 110} ${w + 22},${-h}`, fill: o.roof || '#7C6A5C' }, g);
    S('rect', { x: w * 0.14, y: -h * 0.7, width: w * 0.26, height: h * 0.26, fill: '#9DBBC8' }, g);
    S('rect', { x: w * 0.56, y: -h * 0.7, width: w * 0.26, height: h * 0.26, fill: '#9DBBC8' }, g);
    S('rect', { x: w * 0.4, y: -h * 0.36, width: w * 0.2, height: h * 0.36, fill: '#8C6E5A' }, g);
    return g;
  };
  /** Flat weather-balloon teardrop (grey) on a line, for mission profiles. Origin = payload attach point. */
  K.balloon = (parent, x, y, s = 1) => {
    const g = S('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    S('line', { x1: 0, y1: 0, x2: 0, y2: -120, stroke: '#3D4144', 'stroke-width': 2 }, g);
    S('path', { d: 'M0,-120 C-60,-170 -70,-260 0,-290 C70,-260 60,-170 0,-120Z', fill: '#D2D6D8' }, g);
    return g;
  };

  // ------------------------------------------------------------------ annotations over footage
  const softShadow = (op = 0.4, blur = 5, dy = 4) => {
    const id = 'ksh' + (fid++);
    return X.shadow(id, 0, dy, blur, '#000', op);
  };
  /** Thick red pointer arrow (YouTube-thumbnail style). Tip at (x, y); angle = direction it points (0 = right).
   *  Visible on [t0, t1], drifting `drift` px toward the tip while visible. Pops in 1 frame (no ease). */
  K.pointer = (parent, o, t0, t1, drift = 16) => {
    const L = o.len || 260, sh = o.shaft || 30, hw = o.head || 92, hl = o.headLen || 80, jit = X.rand(o.seed || 9);
    const outer = S('g', {}, parent), mid = S('g', { transform: `translate(${o.x},${o.y}) rotate(${o.angle || 0})` }, outer);
    const inner = S('g', { filter: softShadow(0.35, 4, 3) }, mid);
    const j = () => (jit() - 0.5) * 4;
    S('path', {
      d: `M0,0 L${-hl + j()},${-hw / 2 + j()} L${-hl + 6 + j()},${-sh / 2} L${-L + j()},${-sh / 2 + 2 + j()} ` +
        `Q${-L - 6},0 ${-L + j()},${sh / 2 - 2 + j()} L${-hl + 6 + j()},${sh / 2} L${-hl + j()},${hw / 2 + j()} Z`,
      fill: o.color || K.C.red, 'stroke-linejoin': 'round', stroke: o.color || K.C.red, 'stroke-width': 6,
    }, inner);
    gsap.set(outer, { autoAlpha: 0 });
    const a = ((o.angle || 0) * Math.PI) / 180;
    X.tl.set(outer, { autoAlpha: 1 }, t0);
    if (t1 != null) X.tl.set(outer, { autoAlpha: 0 }, t1);
    X.tl.fromTo(inner, { x: -Math.cos(0) * drift }, { x: 0, duration: Math.max(0.1, (t1 ?? t0 + 1) - t0), ease: 'none', immediateRender: false }, t0);
    if (o.sfx !== false) X.sfx(t0, o.sfx || 'pop', { gain: 0.3, pitch: 1.15 });
    return outer;
  };
  /** Handwritten white formula (Caveat) with a soft shadow for legibility on footage. */
  K.formula = (parent, text, x, y, o = {}) => {
    const g = S('g', { transform: `translate(${x},${y}) rotate(${o.rot || 0})` }, parent);
    S('text', { x: 0, y: 0, 'font-family': o.font || 'Caveat', 'font-weight': o.weight || 700, 'font-size': o.size || 86, fill: '#fff', filter: softShadow(0.45, 3, 2), text }, g);
    return g;
  };
  /** Formulas appear one after another (5 frames apart), each sliding in from the right over 3 frames. */
  K.scribbleIn = (els, t, gap = 5 / 30) => {
    els.forEach((e, i) => {
      gsap.set(e, { autoAlpha: 0 });
      const inner = e.firstChild;
      X.tl.set(e, { autoAlpha: 1 }, t + i * gap);
      X.tl.fromTo(inner, { x: 30, opacity: 0 }, { x: 0, opacity: 1, duration: 3 / 30, ease: 'none', immediateRender: false }, t + i * gap);
      X.sfx(t + i * gap, 'scribble', { dur: 0.25, gain: 0.25, pitch: 1 + i * 0.08 });
    });
  };
  /** Red X mark (two thick rounded strokes). */
  K.redX = (parent, x, y, size = 150, o = {}) => {
    const g = S('g', { transform: `translate(${x},${y})` }, parent), inner = S('g', { filter: softShadow(0.35, 4, 3) }, g), s = size / 2;
    const st = { stroke: o.color || K.C.red, 'stroke-width': size * 0.14, 'stroke-linecap': 'round', fill: 'none' };
    S('path', { d: `M${-s},${-s * 0.62} L${s},${s * 0.62}`, ...st }, inner);
    S('path', { d: `M${s * 0.92},${-s * 0.7} L${-s * 0.92},${s * 0.66}`, ...st }, inner);
    return g;
  };
  /** Stamp: snap in at scale 1.2 → 1 over 3 frames. */
  K.stamp = (el, t, o = {}) => {
    gsap.set(el, { autoAlpha: 0 });
    const inner = el.firstChild;
    X.tl.set(el, { autoAlpha: 1 }, t);
    X.tl.fromTo(inner, { scale: 1.2, transformOrigin: '50% 50%' }, { scale: 1, duration: 3 / 30, ease: 'none', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'stamp', { gain: 0.45 });
  };
  /** Footage tag ("ATTEMPT 2"): white bold condensed caps, lower-left. */
  K.tag = (parent, text, o = {}) => S('text', {
    x: o.x ?? 96, y: o.y ?? 990, 'font-family': 'Oswald', 'font-weight': 600, 'font-size': o.size || 64, 'letter-spacing': 2,
    fill: '#fff', filter: softShadow(0.5, 4, 2), text: text.toUpperCase(),
  }, parent);
  /** Dialogue caption, white sans bottom-centre (stage directions in *asterisks*). */
  K.caption = (parent, text, o = {}) => S('text', {
    x: 960, y: o.y ?? 1000, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 500, 'font-size': o.size || 40,
    fill: '#fff', filter: softShadow(0.7, 3, 1), text,
  }, parent);
  /** Black card with a lowercase monospace line (the deadpan sign-off). */
  K.monoCard = (parent, text, o = {}) => {
    const g = S('g', {}, parent);
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#000' }, g);
    S('text', { x: 960, y: 552, 'text-anchor': 'middle', 'font-family': 'Roboto Mono', 'font-weight': 400, 'font-size': o.size || 40, fill: '#fff', text: text.toLowerCase() }, g);
    return g;
  };
  /** Live-footage feel for an illustrated plate: handheld drift + slow push (pure function of t, about the centre). */
  K.footage = (g, o = {}) => {
    const nx = K.noise((o.seed || 1) * 3 + 1), ny = K.noise((o.seed || 1) * 3 + 2), nr = K.noise((o.seed || 1) * 3 + 3);
    const amp = o.amp ?? 7, t0 = o.t0 ?? 0, t1 = o.t1 ?? t0 + 4, s0 = o.push?.[0] ?? 1.035, s1 = o.push?.[1] ?? 1.07;
    const pan = o.pan || [0, 0];
    X.every((t) => {
      if (t < t0 - 0.05 || t > t1 + 0.05) return;
      const k = clamp((t - t0) / Math.max(0.01, t1 - t0), 0, 1), s = K.lerp(s0, s1, k);
      const dx = nx(t) * amp + pan[0] * k, dy = ny(t) * amp * 0.7 + pan[1] * k, r = nr(t) * (o.rot ?? 0.25);
      g.setAttribute('transform', `translate(${960 + dx},${540 + dy}) rotate(${r.toFixed(3)}) scale(${s.toFixed(4)}) translate(-960,-540)`);
    });
    return g;
  };
  /** Radial vignette overlay (footage plates only, never on the flat diagrams). */
  K.vignette = (parent, op = 0.5, id = 'kvig' + (fid++)) =>
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: X.radial(id, [[0.55, '#000', 0], [1, '#000', op]], 0.5, 0.5, 0.75), 'pointer-events': 'none' }, parent);
  /** Rasterise a static SVG group (with its own local <defs>) into an <image>: blurred depth layers cost nothing per frame. */
  K.rasterize = async (g, o = {}) => {
    const W = o.w || 1920, H = o.h || 1080, sc = o.scale || 1;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W * sc}" height="${H * sc}" viewBox="${o.x || 0} ${o.y || 0} ${W} ${H}">${new XMLSerializer().serializeToString(g)}</svg>`;
    const img = new Image();
    img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    await img.decode();
    const c = document.createElement('canvas'); c.width = W * sc; c.height = H * sc;
    c.getContext('2d').drawImage(img, 0, 0);
    const im = S('image', { x: o.x || 0, y: o.y || 0, width: W, height: H, href: c.toDataURL('image/jpeg', 0.93), preserveAspectRatio: 'none' }, g.parentNode);
    g.parentNode.insertBefore(im, g);
    g.remove();
    return im;
  };

  // ------------------------------------------------------------------ engineering screens (pseudo-3D CAD)
  // Coordinates: x right, y up, z toward the viewer. Faces wound CCW seen from outside.
  const BOXF = [[4, 5, 6, 7], [1, 0, 3, 2], [5, 1, 2, 6], [0, 4, 7, 3], [7, 6, 2, 3], [0, 1, 5, 4]];
  K.box = (c, s, color, o = {}) => {
    const [x, y, z] = c, [w, h, d] = s.map((v) => v / 2);
    const v = [[-w, -h, -d], [w, -h, -d], [w, h, -d], [-w, h, -d], [-w, -h, d], [w, -h, d], [w, h, d], [-w, h, d]].map((p) => [p[0] + x, p[1] + y, p[2] + z]);
    return { v, f: BOXF.map((f) => ({ i: f, color, edge: o.edge ?? true, alpha: o.alpha ?? 1 })), cull: o.cull ?? true };
  };
  K.cyl = (c, r, len, axis = 'z', color = '#bbb', o = {}) => {
    const n = o.n || 18, v = [], f = [], h = len / 2;
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; v.push([r * Math.cos(a), r * Math.sin(a), -h]); }
    for (let k = 0; k < n; k++) { const a = (k / n) * Math.PI * 2; v.push([r * Math.cos(a), r * Math.sin(a), h]); }
    const perm = axis === 'x' ? (p) => [p[2], p[0], p[1]] : axis === 'y' ? (p) => [p[1], p[2], p[0]] : (p) => p;
    const vv = v.map(perm).map((p) => [p[0] + c[0], p[1] + c[1], p[2] + c[2]]);
    for (let k = 0; k < n; k++) f.push({ i: [k, (k + 1) % n, n + (k + 1) % n, n + k], color, edge: false, alpha: o.alpha ?? 1, side: true });
    f.push({ i: Array.from({ length: n }, (_, k) => n + k), color: o.cap || color, edge: true, alpha: o.alpha ?? 1 });
    f.push({ i: Array.from({ length: n }, (_, k) => n - 1 - k), color: o.cap || color, edge: true, alpha: o.alpha ?? 1 });
    return { v: vv, f, cull: true };
  };
  /** Translucent field-of-view frustum from origin along +x (or dir 'z' / '-x'), half-angles in degrees. */
  K.frustum = (origin, len, ha, va, color = K.C.cadRed, o = {}) => {
    const tx = Math.tan((ha * Math.PI) / 180) * len, ty = Math.tan((va * Math.PI) / 180) * len, n = o.near || 6;
    const [x, y, z] = origin;
    const v = [[x, y - n, z - n], [x, y + n, z - n], [x, y + n, z + n], [x, y - n, z + n],
      [x + len, y - ty, z - tx], [x + len, y + ty, z - tx], [x + len, y + ty, z + tx], [x + len, y - ty, z + tx]];
    const F = [[0, 1, 2, 3], [4, 7, 6, 5], [0, 4, 5, 1], [3, 2, 6, 7], [1, 5, 6, 2], [0, 3, 7, 4]];
    return { v, f: F.map((i) => ({ i, color, edge: true, alpha: o.alpha ?? 0.42, edgeColor: o.edgeColor || '#7A1F17' })), cull: false, translucent: true };
  };
  K.grid3d = (y, half, step, color = '#c9cdd2') => {
    const lines = [];
    for (let k = -half; k <= half + 0.01; k += step) { lines.push([[k, y, -half], [k, y, half]]); lines.push([[-half, y, k], [half, y, k]]); }
    return { lines, color };
  };
  const hexToRgb = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  const shade = (hex, k) => { const [r, g, b] = hexToRgb(hex); const f = (c) => Math.round(clamp(c * k, 0, 255)); return `rgb(${f(r)},${f(g)},${f(b)})`; };
  /** Flat-shaded pseudo-3D model. parts: K.box / K.cyl / K.frustum results; grid: K.grid3d. Returns {g, render(yaw, pitch, scale, cx, cy)}. */
  K.cad3d = (parent, parts, o = {}) => {
    const g = S('g', {}, parent), gGrid = S('g', {}, g), gSolid = S('g', {}, g);
    const pool = [], lpool = [];
    const L = (() => { const l = o.light || [-0.45, 0.75, 0.55]; const m = Math.hypot(...l); return l.map((v) => v / m); })();
    const edgeW = o.edgeWidth ?? 1.6, edgeC = o.edgeColor || K.C.cadEdge, persp = o.persp ?? 2600;
    const view = (yaw, pitch, scale, cx, cy) => {
      const cy_ = Math.cos((yaw * Math.PI) / 180), sy_ = Math.sin((yaw * Math.PI) / 180);
      const cp = Math.cos((pitch * Math.PI) / 180), sp = Math.sin((pitch * Math.PI) / 180);
      const xf = (p) => { const x1 = p[0] * cy_ + p[2] * sy_, z1 = -p[0] * sy_ + p[2] * cy_; const y2 = p[1] * cp - z1 * sp, z2 = p[1] * sp + z1 * cp; return [x1, y2, z2]; };
      const proj = (q) => { const k = persp / (persp - q[2] * scale); return [cx + q[0] * scale * k, cy - q[1] * scale * k]; };
      return { xf, proj };
    };
    /** screen position of a model-space point for the same view (to pin chips/labels to the model) */
    const project = (p, yaw, pitch, scale = 1, cx = 960, cy = 560) => { const v = view(yaw, pitch, scale, cx, cy); return v.proj(v.xf(p)); };
    const render = (yaw, pitch, scale = 1, cx = 960, cy = 560) => {
      const { xf, proj } = view(yaw, pitch, scale, cx, cy);
      // grid lines
      let li = 0;
      if (o.grid) for (const ln of o.grid.lines) {
        const a = proj(xf(ln[0])), b = proj(xf(ln[1]));
        let el = lpool[li]; if (!el) { el = S('line', { stroke: o.grid.color, 'stroke-width': 1.2 }, gGrid); lpool.push(el); }
        el.setAttribute('x1', a[0].toFixed(1)); el.setAttribute('y1', a[1].toFixed(1)); el.setAttribute('x2', b[0].toFixed(1)); el.setAttribute('y2', b[1].toFixed(1));
        li++;
      }
      const polys = [];
      for (const part of parts) {
        if (part.hidden) continue;
        const tv = part.v.map(xf);
        for (const f of part.f) {
          const p0 = tv[f.i[0]], p1 = tv[f.i[1]], p2 = tv[f.i[2]];
          const ux = p1[0] - p0[0], uy = p1[1] - p0[1], uz = p1[2] - p0[2], vx = p2[0] - p0[0], vy = p2[1] - p0[1], vz = p2[2] - p0[2];
          let nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; const m = Math.hypot(nx, ny, nz) || 1; nx /= m; ny /= m; nz /= m;
          if (part.cull && nz <= 0.0001) continue;
          const depth = f.i.reduce((s, i) => s + tv[i][2], 0) / f.i.length;
          const lam = Math.max(0, nx * L[0] + ny * L[1] + nz * L[2]);
          polys.push({ pts: f.i.map((i) => proj(tv[i])), fill: part.translucent ? f.color : shade(f.color, 0.62 + 0.5 * lam), alpha: f.alpha, edge: f.edge, edgeColor: f.edgeColor, depth: depth + (part.translucent ? (o.translucentBias ?? 0) : 0), side: f.side, tr: part.translucent });
        }
      }
      polys.sort((a, b) => a.depth - b.depth);
      polys.forEach((p, k) => {
        let el = pool[k]; if (!el) { el = S('polygon', {}, gSolid); pool.push(el); }
        el.setAttribute('points', p.pts.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join(' '));
        el.setAttribute('fill', p.fill);
        el.setAttribute('fill-opacity', p.alpha);
        el.setAttribute('stroke', p.edge ? (p.edgeColor || edgeC) : p.fill);
        el.setAttribute('stroke-opacity', p.edge ? (p.tr ? 0.75 : 1) : p.alpha);
        el.setAttribute('stroke-width', p.edge ? edgeW : 0.8);
        el.setAttribute('stroke-linejoin', 'round');
        el.style.display = '';
      });
      for (let k = polys.length; k < pool.length; k++) pool[k].style.display = 'none';
    };
    return { g, render, project, parts };
  };
  /** Light, generic modelling-app chrome (toolbar, browser tree, view cube, timeline) — no real product's UI or names. */
  K.cadUI = (parent, o = {}) => {
    const g = S('g', {}, parent);
    S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: X.linear('kcadbg', [[0, '#FFFFFF'], [1, '#E3E6EA']]) }, g);
    S('rect', { x: 0, y: 0, width: 1920, height: 74, fill: '#F7F8F9' }, g);
    S('line', { x1: 0, y1: 74, x2: 1920, y2: 74, stroke: '#D5D9DE', 'stroke-width': 2 }, g);
    const r = X.rand(o.seed || 4);
    let x = 120;
    for (let grp = 0; grp < 7; grp++) {
      const n = 2 + Math.floor(r() * 3);
      for (let k = 0; k < n; k++) {
        const col = ['#5B8DD6', '#7E8A97', '#E0A43A', '#6BAA6B', '#7E8A97'][Math.floor(r() * 5)];
        S('rect', { x, y: 18, width: 34, height: 30, rx: 5, fill: col, opacity: 0.85 }, g);
        S('rect', { x: x + 4, y: 54, width: 26, height: 6, rx: 3, fill: '#B9C0C8' }, g);
        x += 46;
      }
      S('line', { x1: x + 4, y1: 16, x2: x + 4, y2: 62, stroke: '#D5D9DE', 'stroke-width': 2 }, g);
      x += 26;
    }
    S('rect', { x: 24, y: 104, width: 330, height: 420, rx: 6, fill: '#FFFFFF', stroke: '#D9DDE2', 'stroke-width': 2 }, g);
    for (let k = 0; k < 11; k++) {
      const ind = [0, 1, 1, 2, 2, 2, 1, 2, 2, 1, 1][k] * 22;
      S('rect', { x: 44 + ind, y: 128 + k * 34, width: 14, height: 14, rx: 3, fill: '#9AA5B1' }, g);
      S('rect', { x: 66 + ind, y: 130 + k * 34, width: 90 + r() * 120, height: 10, rx: 5, fill: '#C6CDD5' }, g);
    }
    const vc = S('g', { transform: 'translate(1790,160)' }, g);
    S('polygon', { points: '0,-46 46,-22 46,30 0,54 -46,30 -46,-22', fill: '#F3F5F7', stroke: '#B8C0C8', 'stroke-width': 2 }, vc);
    S('polyline', { points: '-46,-22 0,2 46,-22', fill: 'none', stroke: '#B8C0C8', 'stroke-width': 2 }, vc);
    S('line', { x1: 0, y1: 2, x2: 0, y2: 54, stroke: '#B8C0C8', 'stroke-width': 2 }, vc);
    S('rect', { x: 0, y: 1030, width: 1920, height: 50, fill: '#F7F8F9' }, g);
    for (let k = 0; k < 18; k++) S('rect', { x: 40 + k * 30, y: 1044, width: 20, height: 20, rx: 3, fill: k % 4 ? '#C3CAD2' : '#E0A43A' }, g);
    return g;
  };
  /** The grey gradient stage of design-intent diagrams (#707070 → #B6B2B2). */
  K.cadStage = (parent) => S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: X.linear('kcadstage', [[0, '#6E6E6E'], [1, '#B8B4B4']]) }, parent);

  // ------------------------------------------------------------------ map tracker (neutral, drawn from shapes)
  K.mapBase = (parent, o = {}) => S('rect', { x: -2000, y: -2000, width: 5920, height: 5080, fill: o.color || K.C.mapBase }, parent);
  K.mapRoad = (parent, d, w = 16) => {
    const g = S('g', {}, parent);
    S('path', { d, fill: 'none', stroke: K.C.roadEdge, 'stroke-width': w + 4, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    S('path', { d, fill: 'none', stroke: K.C.road, 'stroke-width': w, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    return g;
  };
  K.mapLabel = (parent, text, x, y, rot = 0, o = {}) => S('text', {
    x, y, transform: `rotate(${rot} ${x} ${y})`, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': o.weight || 500,
    'font-size': o.size || 20, fill: o.color || '#7D7D7D', text,
  }, parent);
  /** Blue diamond = "home" marker. */
  K.houseDiamond = (parent, x, y, s = 1) => {
    const g = S('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    S('rect', { x: -26, y: -26, width: 52, height: 52, transform: 'rotate(45)', fill: 'rgba(66,110,220,0.10)', stroke: '#3F6FE0', 'stroke-width': 5 }, g);
    return g;
  };
  K.mapPin = (parent, x, y, color = '#3B4652', s = 1) => {
    const g = S('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    S('path', { d: 'M0,0 C-6,-14 -20,-22 -20,-38 A20,20 0 1 1 20,-38 C20,-22 6,-14 0,0Z', fill: color }, g);
    S('circle', { cx: 0, cy: -38, r: 7.5, fill: '#fff' }, g);
    return g;
  };
  /** GPS tracker: the route draws in GPS-update steps (steps(1) per segment) and a pulsing orange dot jumps to each fix. */
  K.gpsTrack = (parent, pts, t0, step = 0.55, o = {}) => {
    const g = S('g', {}, parent), col = o.color || K.C.orange;
    const d = 'M' + pts.map((p) => p.join(',')).join('L');
    const path = S('path', { d, fill: 'none', stroke: col, 'stroke-width': o.width || 8, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    const total = path.getTotalLength(), cum = [0];
    for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const ring = S('circle', { cx: pts[0][0], cy: pts[0][1], r: 14, fill: 'none', stroke: col, 'stroke-width': 4 }, g);
    const dot = S('circle', { cx: pts[0][0], cy: pts[0][1], r: 14, fill: col }, g);
    path.setAttribute('stroke-dasharray', `${total} ${total}`);
    const fixes = o.fixes || pts.map((_, i) => i);   // which vertices are GPS fixes
    fixes.forEach((fi, k) => { if (k > 0) X.sfx(t0 + k * step, 'blip', { gain: 0.18, pitch: 1 + 0.04 * k }); });
    X.every((t) => {
      const k = clamp(Math.floor((t - t0) / step), 0, fixes.length - 1), i = fixes[t < t0 ? 0 : k];
      path.setAttribute('stroke-dashoffset', (total - cum[i]).toFixed(1));
      dot.setAttribute('cx', pts[i][0]); dot.setAttribute('cy', pts[i][1]);
      ring.setAttribute('cx', pts[i][0]); ring.setAttribute('cy', pts[i][1]);
      const ph = (((t - t0) % 0.8) + 0.8) % 0.8 / 0.8;
      ring.setAttribute('r', (14 * (1 + ph)).toFixed(2)); ring.setAttribute('stroke-opacity', (0.6 * (1 - ph)).toFixed(3));
    });
    return { g, path, dot };
  };
  /** The tiny human joke in the corner: "(not my actual house location)". */
  K.disclaimer = (parent, text, o = {}) => S('text', { x: o.x ?? 28, y: o.y ?? 44, 'font-family': 'Inter', 'font-weight': 400, 'font-size': o.size || 30, fill: '#111', text }, parent);
})();
