/* explainer-kurzgesagt-style kit — "neon night" flat-vector science look (an homage to the 2017–19 era of
 * Kurzgesagt-style animation; original shapes, characters and names only).
 *
 * Load after /engine/lib/explainer.js:   <script src="kit.js"></script>   → window.KZ
 * Everything is a pure function of time t (X.every / channels); no Math.random, no wall clock.
 *
 *  timing   KZ.ease(name) · KZ.prog(t,t0,t1,ease) · KZ.ch(v0).to(t,v,dur,ease).at(t)   (keyframed channel)
 *  camera   KZ.rig(parent, keys, {shake}) → {plane(depth), track(t)}   multi-plane parallax camera;
 *           keys [{t,x,y,z,r,ease,pivot}] — z interpolates in log space; pivot keeps a point gliding to centre (dives)
 *  shapes   KZ.smooth(pts) · KZ.blob(cx,cy,r,{n,wob,seed,sx,sy}) · KZ.sparkleD(x,y,s) · KZ.circleD(x,y,r)
 *  light    KZ.glow(g,x,y,r,color,op) · KZ.halo(g,x,y,r,colors,{step,ops,seed}) stepped/posterized halo ·
 *           KZ.rays(g,x,y,r,{n,color,op,speed}) god-ray fan · KZ.stars(g,{n,seed,x,y,w,h,sparkles}) twinkling field
 *  objects  KZ.orb(g,x,y,r,{fill,shade,rim,light,bands,hi}) two-tone sphere · KZ.planetEarth · KZ.crystal · KZ.ringPlanet ·
 *           KZ.galaxy · KZ.foliage(g,x,y,s,pal,{flip,seed}) · KZ.critter(g,{x,y,s,...}) round lantern creature rig
 *  type     KZ.pill(g,x,y,text,{fill,t,out,anchor,size,ink}) colour-coded label growing from its centre + connector
 *  fx       KZ.fade(el,t,dur,from,to) · KZ.swirlPattern(color,bg) tone-on-tone swirls
 */
(function () {
  const KZ = (window.KZ = {});
  const X = window.X;
  const S = (tag, a, p) => X.svg(tag, a, p);
  let uid = 0;
  KZ.id = (p = 'kz') => `${p}${++uid}`;
  const f1 = (v) => (Math.round(v * 10) / 10).toString();

  // ------------------------------------------------------------------ palette (roles from the frame analysis)
  KZ.P = {
    night0: '#0E0D2B', night1: '#100635', night2: '#141040', deep: '#070815', mid: '#24187E', midSoft: '#2C275B',
    violet: '#8321BD', violetDeep: '#3C0FB1', magenta: '#CF3067', berry: '#9A146E', pink: '#F91E8E', hot: '#E61DAD',
    amber: '#F8AE1C', gold: '#FCB80B', orange: '#F0710E', coral: '#F56131', sand: '#F1BF5F',
    cyan: '#25E8F1', sky: '#2C9ADA', ice: '#74D4E7', teal: '#18DBD5', green: '#59C963', leaf: '#79A22B',
    cream: '#F3EAC2', white: '#EFF2F2', shadow: '#090815', plum: '#450C5C', wine: '#5F1265',
  };

  // ------------------------------------------------------------------ timing
  const EC = {};
  KZ.ease = (n) => EC[n] || (EC[n] = gsap.parseEase(n) || ((p) => p));
  KZ.clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  KZ.lerp = (a, b, p) => a + (b - a) * p;
  KZ.prog = (t, t0, t1, e = 'none') => KZ.ease(e)(KZ.clamp((t - t0) / (t1 - t0)));
  /** Keyframed scalar: value holds, then eases to v over dur starting at t. Moves must not overlap. */
  KZ.ch = (v0 = 0) => {
    const m = [];
    const c = {
      to(t, v, d = 0.5, e = 'power2.inOut') { m.push({ t, v, d: Math.max(d, 1e-4), e }); m.sort((a, b) => a.t - b.t); return c; },
      set(t, v) { return c.to(t, v, 1e-4, 'none'); },
      at(t) {
        let v = v0;
        for (const k of m) { if (t <= k.t) break; v = KZ.lerp(v, k.v, KZ.ease(k.e)(Math.min(1, (t - k.t) / k.d))); }
        return v;
      },
    };
    return c;
  };
  KZ.hex = (c) => { const n = parseInt(c.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  KZ.mix = (a, b, p) => {
    const A = KZ.hex(a), B = KZ.hex(b);
    return '#' + A.map((v, i) => Math.round(KZ.lerp(v, B[i], p)).toString(16).padStart(2, '0')).join('');
  };
  /** Opacity fade on an element (immediateRender off, so several fades on one element are safe). */
  KZ.fade = (el, t, dur, from, to, ease = 'none') =>
    X.tl.fromTo(el, { opacity: from }, { opacity: to, duration: dur, ease, immediateRender: false }, t);

  // ------------------------------------------------------------------ shapes
  KZ.smooth = (pts, closed = true, k = 1) => {
    const n = pts.length;
    const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
    let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    const m = closed ? n : n - 1;
    for (let i = 0; i < m; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      const c1 = [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k];
      const c2 = [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k];
      d += `C${f1(c1[0])},${f1(c1[1])} ${f1(c2[0])},${f1(c2[1])} ${f1(p2[0])},${f1(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  };
  KZ.blob = (cx, cy, r, o = {}) => {
    const n = o.n || 9, w = o.wob ?? 0.1, rnd = X.rand(o.seed || 1), sx = o.sx || 1, sy = o.sy || 1, rot = o.rot || 0;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + rot, rr = r * (1 + (rnd() - 0.5) * 2 * w);
      pts.push([cx + Math.cos(a) * rr * sx, cy + Math.sin(a) * rr * sy]);
    }
    return KZ.smooth(pts);
  };
  KZ.circleD = (x, y, r) => `M${f1(x - r)},${f1(y)}a${f1(r)},${f1(r)} 0 1,0 ${f1(2 * r)},0a${f1(r)},${f1(r)} 0 1,0 ${f1(-2 * r)},0Z`;
  KZ.sparkleD = (x, y, s) =>
    `M${f1(x)},${f1(y - s)}Q${f1(x)},${f1(y)} ${f1(x + s)},${f1(y)}Q${f1(x)},${f1(y)} ${f1(x)},${f1(y + s)}Q${f1(x)},${f1(y)} ${f1(x - s)},${f1(y)}Q${f1(x)},${f1(y)} ${f1(x)},${f1(y - s)}Z`;
  KZ.annulus = (cx, cy, r1, r2, o = {}) => KZ.blob(cx, cy, r2, o) + KZ.blob(cx, cy, r1, { ...o, seed: (o.seed || 1) + 7 });

  // ------------------------------------------------------------------ light
  const GC = {};
  /** Soft radial glow fill for a colour (cached gradient). */
  KZ.glowFill = (c, mid = 0.38) => {
    const k = c + mid;
    if (!GC[k]) {
      const id = KZ.id('gl');
      const g = S('radialGradient', { id }, X.defs);
      S('stop', { offset: 0, 'stop-color': c, 'stop-opacity': 1 }, g);
      S('stop', { offset: 0.3, 'stop-color': c, 'stop-opacity': mid }, g);
      S('stop', { offset: 0.65, 'stop-color': c, 'stop-opacity': mid * 0.28 }, g);
      S('stop', { offset: 1, 'stop-color': c, 'stop-opacity': 0 }, g);
      GC[k] = `url(#${id})`;
    }
    return GC[k];
  };
  KZ.glow = (g, x, y, r, c, op = 1) => S('circle', { cx: x, cy: y, r, fill: KZ.glowFill(c), opacity: op }, g);
  /** Stepped (posterized) halo: rings ~1.3x apart, colours inner→outer, breathing ±3 % with phase offsets. */
  KZ.halo = (g, x, y, r, cols, o = {}) => {
    const grp = S('g', {}, g), rings = [], step = o.step || 1.3;
    for (let i = cols.length - 1; i >= 0; i--) {
      const rr = r * Math.pow(step, i);
      const el = S('path', { d: KZ.blob(0, 0, rr, { n: 10, wob: o.wob ?? 0.045, seed: (o.seed || 1) + i * 3 }), fill: cols[i], opacity: o.ops ? o.ops[i] : 1, transform: `translate(${x},${y})` }, grp);
      rings.push({ el, i });
    }
    if (o.breathe !== false) {
      const sp = o.speed || 2.1, amp = o.amp ?? 0.03;
      X.every((t) => { for (const q of rings) q.el.setAttribute('transform', `translate(${x},${y}) scale(${(1 + amp * Math.sin(t * sp - q.i * 0.9)).toFixed(4)})`); });
    }
    return grp;
  };
  /** Posterized ring colours: blend `c` toward `bg` in equal steps (Egg-style cyan → background). */
  KZ.steps = (c, bg, n = 4, from = 0.0, to = 0.8) => Array.from({ length: n }, (_, i) => KZ.mix(c, bg, from + ((to - from) * i) / Math.max(1, n - 1)));
  /** God-ray fan: alternating tapered wedges rotating slowly about (x,y). */
  KZ.rays = (g, x, y, r, o = {}) => {
    const n = o.n || 12, grp = S('g', {}, g), inner = S('g', {}, grp), w = o.width ?? 0.45, id = KZ.id('ray');
    const gr = S('radialGradient', { id, cx: 0, cy: 0, r, gradientUnits: 'userSpaceOnUse' }, X.defs);
    S('stop', { offset: o.inner ?? 0.08, 'stop-color': o.color || '#fff', 'stop-opacity': o.op ?? 0.12 }, gr);
    S('stop', { offset: 1, 'stop-color': o.color || '#fff', 'stop-opacity': 0 }, gr);
    let d = '';
    for (let i = 0; i < n; i++) {
      const a0 = (i / n) * Math.PI * 2, a1 = a0 + ((Math.PI * 2) / n) * w;
      d += `M0,0L${f1(Math.cos(a0) * r)},${f1(Math.sin(a0) * r)}L${f1(Math.cos(a1) * r)},${f1(Math.sin(a1) * r)}Z`;
    }
    S('path', { d, fill: `url(#${id})` }, inner);
    const sp = o.speed ?? 3, r0 = o.rot0 || 0;
    X.every((t) => inner.setAttribute('transform', `translate(${x},${y}) rotate(${(r0 + t * sp).toFixed(2)})`));
    return grp;
  };
  /** Star field: 70 % tiny, 25 % small, 5 % bright dots + 4-point sparkles; each twinkles at its own phase. */
  KZ.stars = (g, o = {}) => {
    const r = X.rand(o.seed || 5), grp = S('g', {}, g), list = [];
    const n = o.n ?? 160, x0 = o.x ?? -500, y0 = o.y ?? -400, w = o.w ?? 2920, h = o.h ?? 1880, sc = o.scale || 1;
    const cols = o.colors || ['#FFFFFF', '#FFFFFF', '#F3EAC2', '#BFE9FF', '#FFC9EC'];
    for (let i = 0; i < n; i++) {
      const u = r(), rad = (u < 0.7 ? 1.1 + r() * 0.8 : u < 0.95 ? 2.1 + r() * 1.2 : 3.4 + r() * 1.4) * sc;
      const c = S('circle', { cx: f1(x0 + r() * w), cy: f1(y0 + r() * h), r: f1(rad), fill: cols[Math.floor(r() * cols.length)] }, grp);
      list.push({ el: c, base: 0.4 + r() * 0.6, ph: r() * 6.28, sp: 1.2 + r() * 2.8 });
    }
    const ns = o.sparkles ?? Math.round(n / 22);
    for (let i = 0; i < ns; i++) {
      const x = x0 + r() * w, y = y0 + r() * h, s = (7 + r() * 9) * sc;
      const sg = S('g', {}, grp);
      S('circle', { cx: f1(x), cy: f1(y), r: f1(s * 1.7), fill: KZ.glowFill(o.glow || '#BFE9FF'), opacity: 0.55 }, sg);
      S('path', { d: KZ.sparkleD(x, y, s), fill: '#FFFFFF' }, sg);
      list.push({ el: sg, base: 0.85, ph: r() * 6.28, sp: 0.9 + r() * 1.6 });
    }
    if (o.twinkle !== false) X.every((t) => { for (const s of list) s.el.setAttribute('opacity', (s.base * (0.58 + 0.42 * Math.sin(t * s.sp + s.ph))).toFixed(3)); });
    return grp;
  };

  // ------------------------------------------------------------------ camera rig (multi-plane parallax)
  KZ.track = (keys) => {
    const ks = keys.map((k) => ({ ...k }));
    ks[0] = { x: 960, y: 540, z: 1, r: 0, ...ks[0] };
    for (let i = 1; i < ks.length; i++) for (const p of ['x', 'y', 'z', 'r']) if (ks[i][p] == null) ks[i][p] = ks[i - 1][p];
    return (t) => {
      if (t <= ks[0].t) return ks[0];
      for (let i = 1; i < ks.length; i++) {
        const B = ks[i];
        if (t > B.t) continue;
        const A = ks[i - 1];
        const e = KZ.ease(B.ease || 'sine.inOut')(KZ.clamp((t - A.t) / Math.max(1e-4, B.t - A.t)));
        const z = Math.exp(KZ.lerp(Math.log(A.z), Math.log(B.z), e));
        const P = B.pivot || (B.z > A.z * 1.05 ? [B.x, B.y] : A.z > B.z * 1.05 ? [A.x, A.y] : null);
        let x, y;
        if (P) {
          const sAx = (P[0] - A.x) * A.z, sAy = (P[1] - A.y) * A.z, sBx = (P[0] - B.x) * B.z, sBy = (P[1] - B.y) * B.z;
          x = P[0] - KZ.lerp(sAx, sBx, e) / z; y = P[1] - KZ.lerp(sAy, sBy, e) / z;
        } else { x = KZ.lerp(A.x, B.x, e); y = KZ.lerp(A.y, B.y, e); }
        return { x, y, z, r: KZ.lerp(A.r, B.r, e) };
      }
      return ks[ks.length - 1];
    };
  };
  /** Parallax camera: plane(d) groups zoom by z^d and pan by d × offset (d < 1 far, d > 1 foreground). */
  KZ.rig = (parent, keys, o = {}) => {
    const root = S('g', {}, parent), planes = [], track = KZ.track(keys), shakes = o.shake || [];
    const rig = { root, track, plane: (d) => { const g = S('g', {}, root); planes.push({ g, d }); return g; } };
    X.every((t) => {
      const c = track(t);
      let sx = 0, sy = 0;
      for (const s of shakes) if (t >= s.t0 && t <= s.t1) {
        const a = s.amp * Math.sin((Math.PI * (t - s.t0)) / (s.t1 - s.t0)) ** 0.5;
        sx += a * Math.sin(t * 61.7) * Math.cos(t * 13.1); sy += a * Math.cos(t * 47.3) * Math.sin(t * 17.9);
      }
      for (const p of planes) {
        const z = Math.pow(c.z, p.d), cx = 960 + (c.x - 960) * p.d, cy = 540 + (c.y - 540) * p.d;
        p.g.setAttribute('transform', `translate(${(960 + sx * p.d).toFixed(2)},${(540 + sy * p.d).toFixed(2)}) rotate(${(c.r || 0).toFixed(3)}) scale(${z.toFixed(5)}) translate(${(-cx).toFixed(2)},${(-cy).toFixed(2)})`);
      }
      rig.cam = c;
    });
    return rig;
  };

  // ------------------------------------------------------------------ patterns
  const PC = {};
  /** Tone-on-tone spiral swirls (2017 landscapes): strokes a few % lighter/darker than the field. */
  KZ.swirlPattern = (stroke, size = 260, sw = 11) => {
    if (PC[stroke + size]) return PC[stroke + size];
    const id = KZ.id('sw');
    const p = S('pattern', { id, width: size, height: size, patternUnits: 'userSpaceOnUse' }, X.defs);
    const sp = (cx, cy, r0, turns, rot) => {
      const pts = [];
      for (let i = 0; i <= 26; i++) { const k = i / 26, a = rot + k * turns * Math.PI * 2, rr = r0 * (0.15 + 0.85 * k); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); }
      return KZ.smooth(pts, false);
    };
    const s = size / 260;
    [[60, 70, 42, 1.6, 0], [190, 120, 36, 1.4, 2], [100, 200, 30, 1.5, 4], [230, 240, 24, 1.3, 1]].forEach(([x, y, r, tn, ro]) =>
      S('path', { d: sp(x * s, y * s, r * s, tn, ro), fill: 'none', stroke, 'stroke-width': sw * s, 'stroke-linecap': 'round' }, p));
    return (PC[stroke + size] = `url(#${id})`);
  };

  // ------------------------------------------------------------------ objects
  /** Two-tone sphere: lit base + crisp terminator shadow (violet-shifted) + rim sliver on the lit edge. */
  KZ.orb = (g, x, y, r, o = {}) => {
    const grp = S('g', { transform: `translate(${x},${y})` }, g);
    const cid = KZ.id('oc');
    S('circle', { r }, S('clipPath', { id: cid }, X.defs));
    S('circle', { r, fill: o.fill || '#2C9ADA' }, grp);
    const inner = S('g', { 'clip-path': `url(#${cid})` }, grp);
    if (o.bands) o.bands.forEach(([yy, hh, col]) => S('path', { d: KZ.blob(0, yy * r, r * 1.5, { n: 8, wob: 0.04, seed: Math.round(yy * 50) + 9, sy: hh }), fill: col }, inner));
    if (o.draw) o.draw(inner, r);
    const L = o.light || [0.62, -0.62];
    if (o.shade !== false) S('circle', { cx: f1(-L[0] * r * 1.05), cy: f1(-L[1] * r * 1.05), r: f1(r * 1.22), fill: o.shade || '#1B3E8C', opacity: o.shadeOp ?? 0.92 }, inner);
    if (o.rim) S('path', { d: KZ.circleD(0, 0, r) + KZ.circleD(-L[0] * r * 0.09, -L[1] * r * 0.09, r), 'fill-rule': 'evenodd', fill: o.rim, opacity: 0.9 }, inner);
    if (o.hi) S('ellipse', { cx: f1(L[0] * r * 0.38), cy: f1(L[1] * r * 0.42), rx: f1(r * 0.28), ry: f1(r * 0.16), fill: o.hi, opacity: 0.55, transform: `rotate(-35 ${f1(L[0] * r * 0.38)} ${f1(L[1] * r * 0.42)})` }, inner);
    return grp;
  };
  KZ.planetEarth = (g, x, y, r, o = {}) => KZ.orb(g, x, y, r, {
    fill: '#2C9ADA', shade: '#1A2F7A', rim: '#BFF6FF', light: o.light || [-0.7, -0.5],
    draw: (gg, R) => {
      const rr = X.rand(o.seed || 21);
      for (let i = 0; i < 5; i++) S('path', { d: KZ.blob((rr() - 0.5) * R * 1.3, (rr() - 0.5) * R * 1.3, R * (0.22 + rr() * 0.22), { n: 7, wob: 0.3, seed: i + 3 }), fill: i % 2 ? '#59C963' : '#79A22B' }, gg);
      for (let i = 0; i < 4; i++) S('path', { d: KZ.blob((rr() - 0.5) * R * 1.4, (rr() - 0.5) * R * 1.4, R * 0.16, { n: 6, wob: 0.2, seed: i + 30, sx: 2.2 }), fill: '#F2FBFF', opacity: 0.85 }, gg);
    },
  });
  KZ.crystal = (g, x, y, s, c = ['#8321BD', '#B45CF2', '#4E12A0']) => {
    const grp = S('g', { transform: `translate(${x},${y}) scale(${s})` }, g);
    const h = [[0, -30], [26, -15], [26, 15], [0, 30], [-26, 15], [-26, -15]];
    S('path', { d: 'M' + h.map((p) => p.join(',')).join('L') + 'Z', fill: c[0] }, grp);
    S('path', { d: 'M0,-30L26,-15L0,0L-26,-15Z', fill: c[1] }, grp);
    S('path', { d: 'M0,0L26,-15L26,15L0,30Z', fill: c[2] }, grp);
    return grp;
  };
  KZ.ringPlanet = (g, x, y, r, c = ['#F56131', '#9A146E', '#FFD36B'], tilt = -18) => {
    const grp = S('g', { transform: `translate(${x},${y}) rotate(${tilt})` }, g);
    S('path', { d: `M${-r * 1.9},0A${r * 1.9},${r * 0.55} 0 0,0 ${r * 1.9},0`, fill: 'none', stroke: c[2], 'stroke-width': r * 0.22, 'stroke-linecap': 'round', opacity: 0.9 }, grp);
    KZ.orb(grp, 0, 0, r, { fill: c[0], shade: c[1], light: [0.6, -0.6] });
    S('path', { d: `M${-r * 1.9},0A${r * 1.9},${r * 0.55} 0 0,1 ${r * 1.9},0`, fill: 'none', stroke: c[2], 'stroke-width': r * 0.22, 'stroke-linecap': 'round' }, grp);
    return grp;
  };
  KZ.galaxy = (g, x, y, r, c = '#BFE9FF', seed = 4) => {
    const grp = S('g', { transform: `translate(${x},${y})` }, g), rr = X.rand(seed);
    KZ.glow(grp, 0, 0, r * 1.1, c, 0.35);
    for (let arm = 0; arm < 2; arm++) for (let i = 0; i < 26; i++) {
      const k = i / 26, a = arm * Math.PI + k * 4.2, d = r * (0.12 + k * 0.85);
      S('circle', { cx: f1(Math.cos(a) * d + (rr() - 0.5) * r * 0.12), cy: f1(Math.sin(a) * d * 0.62 + (rr() - 0.5) * r * 0.1), r: f1(r * (0.05 - k * 0.03) + 0.6), fill: k < 0.3 ? '#FFFFFF' : c, opacity: 0.95 - k * 0.5 }, grp);
    }
    S('circle', { r: r * 0.13, fill: '#FFFFFF' }, grp);
    return grp;
  };
  /** Corner foliage silhouette: a fan of two-tone strap leaves + a dotted coral branch (sways ±2°). */
  KZ.foliage = (g, x, y, s, pal, o = {}) => {
    const outer = S('g', { transform: `translate(${x},${y}) scale(${o.flip ? -s : s},${o.vflip ? -s : s})` }, g);
    const grp = S('g', {}, outer), rr = X.rand(o.seed || 3);
    const leaf = (ang, L, w, c1, c2) => {
      const lg = S('g', { transform: `rotate(${ang})` }, grp);
      S('path', { d: `M0,0C${w},${-L * 0.3} ${w * 0.7},${-L * 0.8} 0,${-L}C${-w * 0.7},${-L * 0.8} ${-w},${-L * 0.3} 0,0Z`, fill: c1 }, lg);
      S('path', { d: `M0,0C${w},${-L * 0.3} ${w * 0.7},${-L * 0.8} 0,${-L}Z`, fill: c2 }, lg);
    };
    if (pal.coral) {
      const br = (x0, y0, a, len, wd, depth) => {
        const x1 = x0 + Math.cos(a) * len, y1 = y0 + Math.sin(a) * len;
        S('path', { d: `M${f1(x0)},${f1(y0)}L${f1(x1)},${f1(y1)}`, stroke: pal.coral, 'stroke-width': wd, 'stroke-linecap': 'round' }, grp);
        if (depth > 0) { br(x1, y1, a - 0.45 - rr() * 0.2, len * 0.72, wd * 0.72, depth - 1); br(x1, y1, a + 0.4 + rr() * 0.2, len * 0.7, wd * 0.72, depth - 1); }
        else S('circle', { cx: f1(x1), cy: f1(y1), r: f1(wd * 1.5), fill: pal.dot }, grp);
      };
      br(150, 10, -Math.PI / 2 - 0.25, 120, 16, 3);
    }
    const nL = o.leaves || 6;
    for (let i = 0; i < nL; i++) {
      const ang = -70 + (i / (nL - 1)) * 120 + (rr() - 0.5) * 10;
      leaf(ang, 230 + rr() * 140, 46 + rr() * 16, i % 2 ? pal.leaf : pal.leaf2 || pal.leaf, pal.leafHi);
    }
    if (o.sway !== false) {
      const ph = rr() * 6, amp = o.amp ?? 2;
      X.every((t) => grp.setAttribute('transform', `rotate(${(amp * Math.sin(t * 1.5 + ph)).toFixed(3)})`));
    }
    return outer;
  };

  // ------------------------------------------------------------------ pill label (2026-style, used sparingly)
  KZ.pill = (g, x, y, text, o = {}) => {
    const size = o.size || 36, h = size * 1.78, padX = h * 0.6;
    const outer = S('g', { transform: `translate(${x},${y})` }, g);
    const conn = S('g', {}, outer);
    const inner = S('g', {}, outer);
    const tx = S('text', { x: 0, y: f1(size * 0.36), 'text-anchor': 'middle', 'font-family': 'Nunito', 'font-weight': 900, 'font-size': size, fill: o.ink || '#FFFFFF', 'letter-spacing': 0.5, text }, inner);
    const w = (tx.getComputedTextLength ? tx.getComputedTextLength() : text.length * size * 0.6) + padX * 2;
    S('rect', { x: f1(-w / 2), y: f1(-h / 2 + 5), width: f1(w), height: f1(h), rx: f1(h / 2), fill: o.lip || KZ.mix(o.fill || '#1BA9C9', '#000000', 0.25) }, inner).parentNode.insertBefore(inner.lastChild, tx);
    S('rect', { x: f1(-w / 2), y: f1(-h / 2), width: f1(w), height: f1(h), rx: f1(h / 2), fill: o.fill || '#1BA9C9' }, inner).parentNode.insertBefore(inner.lastChild, tx);
    let line = null, dot = null;
    if (o.anchor) {
      const [ax, ay] = o.anchor, L = Math.hypot(ax, ay), ux = ax / L, uy = ay / L;
      const k = Math.min(ux ? w / 2 / Math.abs(ux) : 1e9, uy ? h / 2 / Math.abs(uy) : 1e9), sx = ux * k, sy = uy * k;
      line =S('path', { d: `M${f1(sx)},${f1(sy)}L${f1(ax - ux * 13)},${f1(ay - uy * 13)}`, stroke: o.lineColor || '#FFFFFF', 'stroke-width': 4, 'stroke-linecap': 'round', fill: 'none' }, conn);
      dot = S('circle', { cx: ax, cy: ay, r: 11, fill: 'none', stroke: o.lineColor || '#FFFFFF', 'stroke-width': 4 }, conn);
    }
    if (o.t != null) {
      gsap.set(inner, { scaleX: 0, scaleY: 0.5, transformOrigin: '50% 50%' });
      gsap.set(tx, { opacity: 0 });
      X.tl.to(inner, { scaleX: 1, scaleY: 1, duration: 0.3, ease: 'back.out(1.5)' }, o.t);
      X.tl.to(tx, { opacity: 1, duration: 0.15 }, o.t + 0.1);
      if (line) { X.drawOn(line, o.t + 0.12, 0.14, 'power2.out'); X.pop(dot, o.t + 0.22, { sfx: false, dur: 0.3 }); }
      if (o.sfx !== false) X.sfx(o.t, 'blip_up', { gain: 0.22, pitch: o.pitch || 1 });
    }
    if (o.out != null) X.tl.to(outer, { opacity: 0, duration: 0.22, ease: 'power2.in' }, o.out);
    return outer;
  };

  // ------------------------------------------------------------------ home world: layered 2017-style landscape
  // KZ.world(planes, KZ.DAY | KZ.NIGHT, {cx, groundY}) builds sky (p0), far mountains + sun slot (p1), swirl hills +
  // floating crystals (p2), ground hill + sprouts + critterSlot (p3) and corner foliage (p4). Same seeds for both
  // palettes, so a night copy stacked on a day copy relights the scene by opacity alone (T7 palette swap).
  // KZ.planes(rig) → {p0..p4} at depths 0.08 / 0.25 / 0.55 / 1 / 1.6.  KZ.sun(g,x,y,r) amber sun with halo + rays.
  KZ.DAY = {
    sky0: '#F9A90E', sky1: '#FFD866', swirlSky: '#FFC232', mount: '#FDE4A6', mount2: '#FBCE6A', hill: '#F7A21A', hillSw: '#EE9512', ground: '#F8AE1C', groundSw: '#FBC03E', edge: '#FFD66E',
    fol: { leaf: '#2D58E2', leaf2: '#3C7DF0', leafHi: '#5BBDFF', coral: '#2A44C4', dot: '#F91E8E' },
    fol2: { leaf: '#7E22BA', leaf2: '#9437D2', leafHi: '#C77DFF', coral: '#E61DAD', dot: '#25E8F1' },
    sprout: { leaf: '#2D58E2', leaf2: '#3C7DF0', leafHi: '#5BBDFF' }, crystal: ['#8321BD', '#B45CF2', '#4E12A0'], night: false,
  };
  KZ.NIGHT = {
    sky0: '#08051F', sky1: '#4A1FA0', mount: '#7424C6', mount2: '#5419AE', hill: '#3A1898', hillSw: '#4420A8', ground: '#2C1590', groundSw: '#371BA0', edge: '#7A45F0',
    fol: { leaf: '#2A1494', leaf2: '#3418AA', leafHi: '#5C34DC', coral: '#4A1FB8', dot: '#F91E8E' },
    fol2: { leaf: '#6A16AE', leaf2: '#7A1EC0', leafHi: '#A250F0', coral: '#C21FA0', dot: '#25E8F1' },
    sprout: { leaf: '#4A22C0', leaf2: '#5A2AD0', leafHi: '#7E50F0' }, crystal: ['#9A2BE0', '#C77DFF', '#5A12A8'], night: true,
  };
  /** Builds one palette of the home world into planes {p0..p4}. Same seeds → identical geometry for day & night. */
  KZ.world = (pl, pal, o = {}) => {
    const gx = o.cx ?? 960, gy = o.groundY ?? 850, out = {};
    // p0 sky
    const skyId = KZ.id('sky');
    const lg = S('linearGradient', { id: skyId, x1: 0, y1: -700, x2: 0, y2: 860, gradientUnits: 'userSpaceOnUse' }, X.defs);
    S('stop', { offset: 0, 'stop-color': pal.sky0 }, lg); S('stop', { offset: 1, 'stop-color': pal.sky1 }, lg);
    S('rect', { x: -1800, y: -2400, width: 5500, height: 4600, fill: `url(#${skyId})` }, pl.p0);
    if (!pal.night) S('rect', { x: -1800, y: -2400, width: 5500, height: 4600, fill: KZ.swirlPattern(pal.swirlSky, 420, 12), opacity: 0.35 }, pl.p0);
    else {
      KZ.stars(pl.p0, { n: 300, seed: 41, x: -1400, y: -1800, w: 4700, h: 2700, sparkles: 14 });
      KZ.galaxy(pl.p0, 1520, 80, 60, '#BFA6FF', 5);
      S('ellipse', { cx: 960, cy: gy - 260, rx: 2400, ry: 360, fill: KZ.glowFill('#D02F9E', 0.5), opacity: 0.55 }, pl.p0);
      const band = S('g', { transform: 'rotate(-14 960 0)' }, pl.p0);
      S('ellipse', { cx: 960, cy: -40, rx: 2600, ry: 210, fill: KZ.glowFill('#6E4FD8', 0.5), opacity: 0.55 }, band);
      S('ellipse', { cx: 960, cy: -40, rx: 2200, ry: 90, fill: KZ.glowFill('#C9B6FF', 0.45), opacity: 0.35 }, band);
      KZ.stars(band, { n: 220, seed: 43, x: -1400, y: -230, w: 4700, h: 380, sparkles: 6, scale: 0.8 });
      for (let i = 0; i < 5; i++) S('path', { d: KZ.blob(300 + i * 380, -150 + (i % 2) * 160, 260, { n: 9, wob: 0.3, seed: 60 + i, sx: 1.8 }), fill: i % 2 ? '#3A1F96' : '#4A1F8C', opacity: 0.28 }, pl.p0);
    }
    // p1 far mountains (+ sun slot, behind them)
    out.sunSlot = S('g', {}, pl.p1);
    const rr = X.rand(11);
    const mountain = (base, lo, hi, fill, off) => {
      let d = `M-1500,${base + 900}L-1500,${base}`;
      for (let x = -1500 + off; x < 3500; x += 300) { d += `L${x + 150},${lo + rr() * (hi - lo)}L${x + 300},${base - rr() * 30}`; }
      S('path', { d: d + `L3500,${base + 900}Z`, fill, 'stroke-linejoin': 'round', stroke: fill, 'stroke-width': 18 }, pl.p1);
    };
    mountain(gy - 70, gy - 330, gy - 230, pal.mount, 0);
    mountain(gy - 30, gy - 230, gy - 150, pal.mount2, 140);
    // p2 hills + floating crystals
    const hill = KZ.smooth([[-1600, gy + 40], [-900, gy - 60], [-200, gy - 10], [500, gy - 90], [1250, gy - 40], [1900, gy - 110], [2600, gy - 30], [3400, gy - 80], [3400, gy + 1600], [-1600, gy + 1600]]);
    S('path', { d: hill, fill: pal.hill }, pl.p2);
    S('path', { d: hill, fill: KZ.swirlPattern(pal.hillSw, 300, 13) }, pl.p2);
    out.crystals = [[gx - 640, gy - 330, 0.9], [gx + 700, gy - 400, 0.7], [gx + 330, gy - 520, 0.45]].map(([x, y, s]) => KZ.crystal(pl.p2, x, y, s, pal.crystal));
    // p3 ground hill + sprouts
    const ground = KZ.smooth([[-1500, gy + 260], [-700, gy + 120], [gx - 520, gy + 30], [gx, gy], [gx + 520, gy + 36], [2500, gy + 140], [3400, gy + 280], [3400, gy + 1800], [-1500, gy + 1800]]);
    S('path', { d: ground, fill: pal.ground }, pl.p3);
    S('path', { d: ground, fill: KZ.swirlPattern(pal.groundSw, 280, 12) }, pl.p3);
    S('path', { d: KZ.smooth([[-1500, gy + 266], [-700, gy + 126], [gx - 520, gy + 36], [gx, gy + 6], [gx + 520, gy + 42], [2500, gy + 146], [3400, gy + 286]], false), fill: 'none', stroke: pal.edge, 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.7 }, pl.p3);
    KZ.foliage(pl.p3, gx - 300, gy + 28, 0.24, pal.sprout, { leaves: 4, seed: 8 });
    KZ.foliage(pl.p3, gx + 330, gy + 40, 0.2, pal.sprout, { leaves: 4, seed: 9, flip: true });
    KZ.crystal(pl.p3, gx + 470, gy + 62, 0.42, pal.crystal);
    out.critterSlot = S('g', {}, pl.p3);
    // p4 foreground framing silhouettes
    out.fg = S('g', {}, pl.p4);
    KZ.foliage(out.fg, -70, 1150, 1.25, pal.fol, { seed: 3 });
    KZ.foliage(out.fg, 2010, -90, 1.0, pal.fol2, { seed: 5, flip: true, vflip: true, leaves: 5 });
    KZ.foliage(out.fg, 2000, 1180, 0.85, pal.fol2, { seed: 6, flip: true, leaves: 5 });
    return out;
  };
  KZ.planes = (rig) => ({ p0: rig.plane(0.08), p1: rig.plane(0.25), p2: rig.plane(0.55), p3: rig.plane(1), p4: rig.plane(1.6) });
  KZ.sun = (g, x, y, r) => {
    const s = S('g', { transform: `translate(${x},${y})` }, g);
    KZ.glow(s, 0, 0, r * 4.5, '#FFF3C4', 0.75);
    KZ.rays(s, 0, 0, r * 7, { n: 14, color: '#FFF6D6', op: 0.2, speed: 2.5 });
    KZ.halo(s, 0, 0, r * 1.22, ['#FFF2C0', '#FFE591', '#FFD866', '#FFCB45'], { step: 1.28, seed: 2, ops: [1, 0.9, 0.75, 0.55] });
    S('circle', { r, fill: '#FFFBEA' }, s);
    return s;
  };

  // ------------------------------------------------------------------ the creature: a round "lantern critter"
  // One bean blob (head+body merged, H:W ≈ 1.35), one big white eye high at the front, an amber snout-nub, stubby
  // mitten arm, amber feet, and an antenna whose glowing bulb is its own light source (rim light comes from it).
  // Local coords: feet at (0,0), facing +x, height 300. Channels: arm (deg) tilt (deg) hop (px) squash lookX lookY
  // lid (0..1 flat-lid) cheek (0..1 happy crop) lamp (glow) xray bones vessels lungs cosmos (0..1 star-fill reveal).
  const BODY = [[-8, 0], [-72, 0, -112, -44, -112, -122], [-112, -226, -58, -300, 14, -300], [84, -300, 120, -246, 118, -176], [116, -112, 100, -56, 70, -26], [50, -8, 26, 0, -8, 0]];
  KZ.bodyD = (dx = 0, dy = 0) => `M${BODY[0][0] + dx},${BODY[0][1] + dy}` + BODY.slice(1).map((c) => 'C' + [c[0] + dx, c[1] + dy, c[2] + dx, c[3] + dy, c[4] + dx, c[5] + dy].join(',')).join('') + 'Z';
  KZ.critter = (g, o = {}) => {
    const C = {
      body: o.body || '#22C3C9', belly: o.belly || '#6FE6E0', shade: o.shade || '#1A6FB0', arm: o.arm || '#1CA9C4',
      accent: o.accent || '#F8AE1C', accent2: o.accent2 || '#DB6A12', rim: o.rim || '#FFD36B', pupil: '#1B0F45', night: '#120A3E', amb: o.ambColor || '#140C58',
    };
    const id = KZ.id('cr');
    const st = {};
    for (const k of ['amb', 'arm', 'tilt', 'hop', 'squash', 'lookX', 'lookY', 'lid', 'cheek', 'lamp', 'xray', 'bones', 'vessels', 'lungs', 'cosmos', 'float'])
      st[k] = KZ.ch({ amb: o.amb || 0, arm: 62, lamp: 1, float: o.float ? 1 : 0, cosmos: o.cosmos0 || 0, lookX: 3 }[k] ?? 0);
    const root = S('g', { transform: `translate(${o.x || 0},${o.y || 0}) scale(${o.s || 1})` }, g);
    const glowBack = S('g', {}, root);
    const act = S('g', {}, root);
    const cp = S('clipPath', { id: id + 'c' }, X.defs); S('path', { d: KZ.bodyD() }, cp);
    const ecp = S('clipPath', { id: id + 'e' }, X.defs); S('circle', { cx: 52, cy: -204, r: 30 }, ecp);
    // back foot
    S('ellipse', { cx: -36, cy: -6, rx: 26, ry: 11, fill: C.accent2 }, act);
    const ambF = [S('ellipse', { cx: -36, cy: -6, rx: 26, ry: 11, fill: C.amb, opacity: 0 }, act)];
    // antenna (behind the head)
    const ant = S('g', {}, act);
    S('path', { d: 'M6,-282C0,-334 24,-372 62,-386', fill: 'none', stroke: C.shade, 'stroke-width': 8, 'stroke-linecap': 'round' }, ant);
    const lampG = S('g', {}, ant);
    const lampGlow = KZ.glow(lampG, 64, -388, 150, C.accent, 0.5);
    KZ.halo(lampG, 64, -388, 21, ['#FFF4C8', '#FFD35A', '#F8AE1C', '#F0710E'], { ops: [1, 0.75, 0.42, 0.22], step: 1.32, seed: 4 });
    S('circle', { cx: 64, cy: -388, r: 12, fill: '#FFFDF0' }, lampG);
    // body
    const bodyG = S('g', {}, act);
    S('path', { d: KZ.bodyD(), fill: C.body }, bodyG);
    const inb = S('g', { 'clip-path': `url(#${id}c)` }, bodyG);
    S('ellipse', { cx: 54, cy: -112, rx: 58, ry: 80, fill: C.belly }, inb);
    S('ellipse', { cx: -196, cy: -128, rx: 152, ry: 250, fill: C.shade, opacity: 0.9 }, inb);
    const ambB = S('rect', { x: -130, y: -320, width: 270, height: 330, fill: C.amb, opacity: 0 }, inb);
    S('ellipse', { cx: 58, cy: -268, rx: 34, ry: 14, fill: '#FFFFFF', opacity: 0.28, transform: 'rotate(28 58 -268)' }, inb);
    const tint = S('rect', { x: -130, y: -320, width: 270, height: 330, fill: '#170A4A', opacity: 0 }, inb);
    // x-ray organs (built only when asked)
    const organs = {};
    if (o.xray) {
      const bones = (organs.bones = S('g', { opacity: 0 }, inb));
      KZ.glow(bones, 10, -150, 190, '#F3EAC2', 0.35);
      S('ellipse', { cx: 34, cy: -214, rx: 56, ry: 50, fill: '#F6EDCB' }, bones);
      S('ellipse', { cx: 50, cy: -206, rx: 20, ry: 18, fill: '#2B1470' }, bones);
      for (let i = 0; i < 6; i++) S('rect', { x: -48 + i * 2.2, y: -158 + i * 22, width: 34, height: 15, rx: 7.5, fill: '#F6EDCB' }, bones);
      for (let i = 0; i < 3; i++) S('path', { d: `M-24,${-150 + i * 22}C10,${-168 + i * 22} 52,${-150 + i * 20} 66,${-122 + i * 16}`, fill: 'none', stroke: '#F6EDCB', 'stroke-width': 9, 'stroke-linecap': 'round' }, bones);
      S('path', { d: 'M-56,-34C-30,-52 18,-52 40,-34C30,-18 -40,-16 -56,-34Z', fill: '#F6EDCB' }, bones);
      S('path', { d: 'M-34,-30L-36,-6M34,-30L40,-6', stroke: '#F6EDCB', 'stroke-width': 11, 'stroke-linecap': 'round' }, bones);
      const vessels = (organs.vessels = S('g', { opacity: 0 }, inb));
      KZ.glow(vessels, 8, -128, 170, '#FF2D55', 0.35);
      const vp = ['M8,-128C30,-170 40,-220 30,-268', 'M8,-128C-20,-170 -40,-220 -10,-276', 'M8,-128C-10,-90 -30,-60 -36,-8', 'M8,-128C24,-90 40,-56 40,-8', 'M8,-128C40,-128 70,-120 100,-112', 'M20,-170C50,-190 80,-196 100,-188', 'M-20,-90C-50,-90 -80,-110 -96,-140'];
      organs.paths = vp.map((d) => S('path', { d, fill: 'none', stroke: '#FF4D6D', 'stroke-width': 7, 'stroke-linecap': 'round' }, vessels));
      organs.heart = S('path', { d: KZ.blob(8, -128, 20, { n: 7, wob: 0.08, seed: 5 }), fill: '#FF2D55' }, vessels);
      organs.cells = Array.from({ length: 16 }, (_, i) => ({ el: S('ellipse', { rx: 6, ry: 4.5, fill: '#FFB3C1' }, vessels), p: organs.paths[i % 7], k: (i * 0.37) % 1 }));
      const lungs = (organs.lungs = S('g', { opacity: 0 }, inb));
      KZ.glow(lungs, 10, -150, 170, '#25E8F1', 0.4);
      organs.lobes = S('g', {}, lungs);
      S('path', { d: KZ.blob(-30, -150, 40, { n: 8, wob: 0.06, seed: 8, sy: 1.35 }), fill: '#25E8F1', opacity: 0.85 }, organs.lobes);
      S('path', { d: KZ.blob(44, -146, 36, { n: 8, wob: 0.06, seed: 9, sy: 1.3 }), fill: '#5FF1F7', opacity: 0.85 }, organs.lobes);
      S('path', { d: 'M8,-200C10,-180 6,-176 6,-170', fill: 'none', stroke: '#9FF8FA', 'stroke-width': 9, 'stroke-linecap': 'round' }, lungs);
    }
    // cosmos fill (night sky inside the silhouette), revealed bottom→top by `cosmos`
    let cosmosG = null, cosmosMask = null, cosmosEdge = null;
    if (o.cosmos) {
      const mid = id + 'm', mk = S('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: -140, y: -340, width: 300, height: 360 }, X.defs);
      cosmosMask = S('rect', { x: -140, y: 0, width: 300, height: 400, fill: '#fff' }, mk);
      cosmosG = S('g', { mask: `url(#${mid})` }, inb);
      const cg = S('g', {}, cosmosG);
      S('rect', { x: -130, y: -320, width: 270, height: 330, fill: C.night }, cg);
      S('path', { d: KZ.blob(-30, -170, 90, { n: 9, wob: 0.25, seed: 12, sx: 1.4 }), fill: '#3A1A9A', opacity: 0.8 }, cg);
      S('path', { d: KZ.blob(40, -90, 70, { n: 8, wob: 0.3, seed: 13, sx: 1.6 }), fill: '#5B1A8E', opacity: 0.55 }, cg);
      KZ.stars(cg, { n: 70, seed: 31, x: -120, y: -310, w: 250, h: 310, scale: 0.55, sparkles: 5 });
      KZ.galaxy(cg, 20, -170, 26, '#9FE6FF', 7);
      KZ.galaxy(cg, -60, -70, 14, '#FFB0E0', 9);
      KZ.ringPlanet(cg, 60, -60, 8, ['#F56131', '#9A146E', '#FFD36B']);
      KZ.crystal(cg, -70, -230, 0.32);
      KZ.crystal(cg, 80, -120, 0.25, ['#2C9ADA', '#74D4E7', '#1B4FA0']);
      KZ.orb(cg, -40, -130, 9, { fill: '#F91E8E', shade: '#5F1265' });
      cosmosEdge = S('path', { d: 'M-140,0C-60,-14 40,14 160,0', fill: 'none', stroke: '#9FF3FF', 'stroke-width': 5, opacity: 0, 'stroke-linecap': 'round' }, inb);
    }
    const rim = S('path', { d: KZ.bodyD() + KZ.bodyD(-8, 8), 'fill-rule': 'evenodd', fill: C.rim, opacity: 0.95 }, inb);
    // front foot, snout, eye
    S('ellipse', { cx: 40, cy: -6, rx: 28, ry: 12, fill: C.accent }, act);
    ambF.push(S('ellipse', { cx: 40, cy: -6, rx: 28, ry: 12, fill: C.amb, opacity: 0 }, act));
    const snout = S('g', {}, act);
    const SN = 'M104,-193C132,-197 156,-187 158,-172C159,-160 137,-151 106,-150Z';
    S('path', { d: SN, fill: C.accent }, snout);
    S('path', { d: 'M106,-170C128,-169 150,-170 158,-172C159,-160 137,-151 106,-150Z', fill: C.accent2 }, snout);
    ambF.push(S('path', { d: SN, fill: C.amb, opacity: 0 }, snout));
    const eyeG = S('g', {}, act);
    S('circle', { cx: 52, cy: -204, r: 30, fill: '#FFFFFF' }, eyeG);
    const ein = S('g', { 'clip-path': `url(#${id}e)` }, eyeG);
    const pupil = S('g', {}, ein);
    S('circle', { cx: 52, cy: -204, r: 12.5, fill: C.pupil }, pupil);
    S('circle', { cx: 48, cy: -209, r: 4, fill: '#FFFFFF' }, pupil);
    const lid = S('rect', { x: 18, y: -236, width: 70, height: 0, fill: C.body }, ein);
    const cheek = S('ellipse', { cx: 52, cy: -140, rx: 44, ry: 28, fill: C.body }, ein);
    // arm (front), pivot at the shoulder (24,-118)
    const armG = S('g', {}, act);
    const armR = S('g', {}, armG);
    S('path', { d: 'M-4,-12C30,-14 62,-11 80,-9L80,9C62,11 30,14 -4,12Z', fill: C.arm }, armR);
    S('circle', { cx: 86, cy: 0, r: 21, fill: C.belly }, armR);
    S('circle', { cx: 80, cy: -18, r: 9, fill: C.belly }, armR);
    const ambA = S('g', { opacity: 0 }, armR);
    S('path', { d: 'M-4,-12C30,-14 62,-11 80,-9L80,9C62,11 30,14 -4,12Z', fill: C.amb }, ambA);
    S('circle', { cx: 86, cy: 0, r: 21, fill: C.amb }, ambA);
    S('circle', { cx: 80, cy: -18, r: 9, fill: C.amb }, ambA);
    const armTint = S('g', { opacity: 0 }, armR);
    S('path', { d: 'M-4,-12C30,-14 62,-11 80,-9L80,9C62,11 30,14 -4,12Z', fill: '#170A4A', opacity: 0.85 }, armTint);
    S('circle', { cx: 86, cy: 0, r: 21, fill: '#170A4A', opacity: 0.85 }, armTint);
    const armBone = S('path', { d: 'M4,0L82,0', stroke: '#F6EDCB', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 }, armR);
    const armCos = S('g', { opacity: 0 }, armR);
    S('path', { d: 'M-4,-12C30,-14 62,-11 80,-9L80,9C62,11 30,14 -4,12Z', fill: C.night }, armCos);
    S('circle', { cx: 86, cy: 0, r: 21, fill: C.night }, armCos);
    [[20, -3], [46, 4], [70, -2], [88, 6], [92, -8]].forEach(([x, y], i) => S('circle', { cx: x, cy: y, r: i % 2 ? 1.6 : 2.4, fill: '#FFFFFF' }, armCos));

    const blinks = (o.blinks || []).slice();
    const c = { root, act, st, C, organs, armG, eyeG, lampG, glowBack, hand: (ang = st.arm.at(0)) => ({ x: 24 + Math.cos((ang * Math.PI) / 180) * 86, y: -118 + Math.sin((ang * Math.PI) / 180) * 86 }) };
    c.to = (k, t, v, d = 0.3, e = 'power2.inOut') => { st[k].to(t, v, d, e); return c; };
    c.blink = (...ts) => { blinks.push(...ts); return c; };
    c.hop = (t, h = 26) => { st.squash.to(t - 0.1, 0.1, 0.1, 'power2.out').to(t, -0.06, 0.12, 'power2.out').to(t + 0.32, 0.06, 0.1, 'power2.in').to(t + 0.42, 0, 0.18, 'power2.out'); st.hop.to(t, h, 0.18, 'power2.out').to(t + 0.18, 0, 0.18, 'power2.in'); return c; };
    const ph = o.phase || 0, bobA = o.float ? 9 : 4;
    X.every((t) => {
      const bob = Math.sin(t * 2.6 + ph) * bobA * (1 + st.float.at(t)), sq = st.squash.at(t) + Math.sin(t * 2.6 + ph + 1.2) * 0.008;
      const tilt = st.tilt.at(t) + Math.sin(t * 1.9 + ph) * 1.2;
      act.setAttribute('transform', `translate(0,${(-st.hop.at(t) + bob).toFixed(2)}) rotate(${tilt.toFixed(2)}) scale(${(1 - sq * 0.6).toFixed(4)},${(1 + sq).toFixed(4)})`);
      ant.setAttribute('transform', `rotate(${(Math.sin(t * 2.6 + ph - 0.9) * 3.5 - tilt * 0.4).toFixed(2)} 6 -282)`);
      armR.setAttribute('transform', `translate(24,-118) rotate(${(st.arm.at(t) + Math.sin(t * 2.2 + ph) * 2).toFixed(2)})`);
      pupil.setAttribute('transform', `translate(${st.lookX.at(t).toFixed(2)},${st.lookY.at(t).toFixed(2)})`);
      let bl = 0;
      for (const b of blinks) { const d = t - b; if (d >= 0 && d < 0.2) bl = Math.max(bl, d < 0.07 ? d / 0.07 : d < 0.11 ? 1 : 1 - (d - 0.11) / 0.09); }
      lid.setAttribute('height', (Math.max(st.lid.at(t) * 0.42, bl) * 64).toFixed(2));
      cheek.setAttribute('cy', (-140 - st.cheek.at(t) * 40).toFixed(2));
      const am = st.amb.at(t);
      ambB.setAttribute('opacity', am.toFixed(3)); ambA.setAttribute('opacity', am.toFixed(3));
      for (const e of ambF) e.setAttribute('opacity', (am * 0.8).toFixed(3));
      const lamp = st.lamp.at(t) * (0.92 + 0.08 * Math.sin(t * 3.1 + ph));
      lampGlow.setAttribute('opacity', (0.5 * lamp).toFixed(3));
      const xr = st.xray.at(t);
      tint.setAttribute('opacity', (xr * 0.86).toFixed(3));
      armTint.setAttribute('opacity', (xr * 0.95).toFixed(3));
      if (o.xray) {
        organs.bones.setAttribute('opacity', st.bones.at(t).toFixed(3));
        armBone.setAttribute('opacity', st.bones.at(t).toFixed(3));
        const vo = st.vessels.at(t);
        organs.vessels.setAttribute('opacity', vo.toFixed(3));
        if (vo > 0.01) {
          organs.heart.setAttribute('transform', `translate(8,-128) scale(${(1 + 0.12 * Math.max(0, Math.sin(t * 7))).toFixed(3)}) translate(-8,128)`);
          for (const q of organs.cells) { const L = q.p.getTotalLength(), pt = q.p.getPointAtLength((((q.k + t * 0.45) % 1) * L)); q.el.setAttribute('cx', pt.x.toFixed(1)); q.el.setAttribute('cy', pt.y.toFixed(1)); }
        }
        const lo = st.lungs.at(t);
        organs.lungs.setAttribute('opacity', lo.toFixed(3));
        if (lo > 0.01) organs.lobes.setAttribute('transform', `translate(8,-150) scale(${(1 + 0.07 * Math.sin(t * 3.4)).toFixed(3)}) translate(-8,150)`);
      }
      if (o.cosmos) {
        const cv = st.cosmos.at(t), y = KZ.lerp(14, -330, cv);
        cosmosMask.setAttribute('y', y.toFixed(1));
        cosmosG.setAttribute('opacity', cv > 0.001 ? 1 : 0);
        cosmosEdge.setAttribute('transform', `translate(0,${y.toFixed(1)})`);
        cosmosEdge.setAttribute('opacity', (Math.sin(Math.PI * KZ.clamp(cv)) * 0.9).toFixed(3));
        armCos.setAttribute('opacity', KZ.prog(cv, 0.35, 0.6).toFixed(3));
        lid.setAttribute('fill', cv > 0.75 ? C.night : C.body); cheek.setAttribute('fill', cv > 0.75 ? C.night : C.body);
      }
    });
    return c;
  };
})();
