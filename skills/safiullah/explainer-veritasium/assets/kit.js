/* explainer-veritasium kit — diagram / simulation inserts in the manner of a presenter-led science channel.
 * Load after /engine/lib/explainer.js (needs window.X and gsap). Everything is a pure function of t.
 *
 *   Colours with FIXED meanings (V.C) · fonts (V.F) · V.bloom(id,std) colour-keeping glow filter
 *   Cards     V.brollCard(t0,t1,opts)            neutral grey "cut back to live action" placeholder
 *   Labels    V.label · V.callout · V.math (serif italic symbols, coloured to match objects) · V.type
 *   Sim time  V.simClock([[t,rate],...])        τ(t) with slow-mo / freeze (rate 0) / speed-up, exact integral
 *   Camera    V.planeCam({...})                  tilted-plane perspective camera (pitch, rot, zoom) project/unproject
 *   Fields    V.canvasLayer · V.waveField · V.renderWaves   per-pixel wave / intensity simulation with bloom
 *             V.hyperbola (nodal lines) · V.arrows (sine-envelope arrow arrays) · V.fieldLine (RK4 streamlines)
 *   Particles V.flowParticles (ride computed streamlines) · V.sampler (Monte-Carlo hits from a pdf) · V.hitLayer
 *   Graphs    V.axes · V.plot · V.reveal (left→right clip draw, works with dashes)
 *   Algorithms V.graph (nodes/edges, snapped states) · V.dijkstra (real trace) · V.playTrace
 *   Counters  V.counter · V.rampCount (n slow steps, then exponential speed ramp)
 *   Focus     V.dim(el,t,level)  dim-to-focus spotlight
 */
(function () {
  const V = (window.V = {});

  // ------------------------------------------------------------------ palette & type (meaning-coded)
  V.C = {
    bg: '#111113',      // stage: near-black (glow look)  — navy-map look uses navy/navyDeep
    ink: '#ECEDEF',     // text, nodes, primary line work
    grey: '#7C8090',    // secondary lines, nodal lines, "reference" curves
    dim: '#3A3D45',     // ticks, inactive edges
    silver: '#D6D8CF',  // apparatus / wire (glows)
    red: '#E8433A',     // + / crest / active / current node / frontier
    blue: '#2A86D9',    // − / trough / second field (B) / second search
    yellow: '#F0B53C',  // energy, brightness, intensity, goal, highlight
    green: '#2E9E7A',   // settled / done / cooperate
    violet: '#7B83F0',  // backward search (map look only)
    navy: '#0D124C', navyDeep: '#070B30', card: '#5C5E62', cardInk: '#93959A',
  };
  V.F = { caps: 'Oswald', math: 'Libre Baskerville', serif: 'Lora', hand: 'Caveat', mono: 'Roboto Mono', sans: 'Inter' };
  V.RGB = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

  V.clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
  V.smooth = (a, b, v) => { const t = V.clamp((v - a) / (b - a)); return t * t * (3 - 2 * t); };
  V.lerp = (a, b, t) => a + (b - a) * t;

  /** Glow that keeps the element's own colour (blurred copy ×2 under the source).
   *  user = true: frame-sized filter region — REQUIRED for perfectly horizontal/vertical lines, whose zero-width
   *  bounding box otherwise makes the filtered element vanish. */
  V.bloom = (id = 'vbloom', std = 5, user = false) => {
    if (document.getElementById(id)) return `url(#${id})`;
    const f = X.svg('filter', user ? { id, filterUnits: 'userSpaceOnUse', x: -100, y: -100, width: 2120, height: 1280 } : { id, x: '-50%', y: '-50%', width: '200%', height: '200%' }, X.defs);
    X.svg('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: std, result: 'b' }, f);
    const m = X.svg('feMerge', {}, f);
    X.svg('feMergeNode', { in: 'b' }, m); X.svg('feMergeNode', { in: 'b' }, m); X.svg('feMergeNode', { in: 'SourceGraphic' }, m);
    return `url(#${id})`;
  };

  /** Visible only inside the given [t0, t1) windows — for a model that returns later (hard cuts in and out). */
  V.showAt = (el, wins) => {
    gsap.set(el, { autoAlpha: 0 });
    for (const [a, b] of wins) { X.tl.set(el, { autoAlpha: 1 }, a); if (b != null) X.tl.set(el, { autoAlpha: 0 }, b); }
    return el;
  };

  // ------------------------------------------------------------------ cards
  /** Neutral grey placeholder for the live-action shot the insert cuts out of / back to. Sits above everything.
   *  drift (default on): a faint diagonal "offline media" hatch drifts slowly, standing in for footage motion. */
  V.brollCard = (t0, t1, o = {}) => {
    const g = X.scene(o.id || 'broll' + Math.round(t0 * 10), t0, t1);
    if (t0 <= 0) gsap.set(g, { autoAlpha: 1 });          // a set at exactly t = 0 does not render on the first seek
    X.svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: o.fill || V.C.card }, g);
    if (o.drift !== false) {
      const pid = 'vhatch' + Math.round(t0 * 100);
      const pat = X.svg('pattern', { id: pid, patternUnits: 'userSpaceOnUse', width: 96, height: 96, patternTransform: 'rotate(35)' }, X.defs);
      X.svg('rect', { x: 0, y: 0, width: 48, height: 96, fill: '#000', opacity: o.hatch ?? 0.07 }, pat);
      X.svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: `url(#${pid})` }, g);
      X.every((t) => { if (t >= t0 && t < t1) pat.setAttribute('patternTransform', `rotate(35) translate(${((t - t0) * (o.speed ?? 70)) % 96},0)`); });
    }
    const c = o.ink || V.C.cardInk;
    for (const [x, y, sx, sy] of [[96, 96, 1, 1], [1824, 96, -1, 1], [96, 984, 1, -1], [1824, 984, -1, -1]])
      X.svg('path', { d: `M${x},${y + 44 * sy}V${y}H${x + 44 * sx}`, fill: 'none', stroke: c, 'stroke-width': 3 }, g);
    X.svg('text', { x: 960, y: 548, 'text-anchor': 'middle', 'font-family': V.F.sans, 'font-size': 40, 'font-weight': 500, 'letter-spacing': 6, fill: c, text: o.text || 'B-ROLL  ·  PRESENTER TO CAMERA' }, g);
    if (o.sub) X.svg('text', { x: 960, y: 606, 'text-anchor': 'middle', 'font-family': V.F.sans, 'font-size': 26, fill: c, opacity: 0.8, text: o.sub }, g);
    return g;
  };

  /** A 1-D intensity profile I(v) shown as a glowing band on a screen/detector box [x,y,w,h] (v spans the width).
   *  Brightness = (I/Imax)^gamma, vertical falloff = Gaussian (sigma as a fraction of half-height). Returns the group;
   *  .glow is the coloured rect (tween its opacity to light it up or cross-fade two profiles). */
  V.profileGlow = (parent, box, I, Imax, o = {}) => {
    const [x, y, w, h] = box, id = 'vpg' + (V._pg = (V._pg || 0) + 1), col = o.color || V.C.yellow, gam = o.gamma ?? 0.6, n = I.length;
    const lg = X.svg('linearGradient', { id: id + 'h', x1: 0, y1: 0, x2: 1, y2: 0 }, X.defs);
    const stops = o.stops || 120;
    for (let k = 0; k <= stops; k++) { const i = Math.round(k / stops * (n - 1)); X.svg('stop', { offset: k / stops, 'stop-color': col, 'stop-opacity': Math.pow(Math.max(0, I[i]) / Imax, gam).toFixed(3) }, lg); }
    const vg = X.svg('linearGradient', { id: id + 'v', x1: 0, y1: 0, x2: 0, y2: 1 }, X.defs), sg = o.sigma ?? 0.42;
    for (let k = 0; k <= 20; k++) { const u = (k / 20) * 2 - 1; X.svg('stop', { offset: k / 20, 'stop-color': '#fff', 'stop-opacity': Math.exp(-u * u / (2 * sg * sg)).toFixed(3) }, vg); }
    const m = X.svg('mask', { id: id + 'm', maskUnits: 'userSpaceOnUse', x, y, width: w, height: h }, X.defs);
    X.svg('rect', { x, y, width: w, height: h, fill: `url(#${id}v)` }, m);
    const g = X.svg('g', {}, parent);
    g.glow = X.svg('rect', { x, y, width: w, height: h, fill: `url(#${id}h)`, mask: `url(#${id}m)`, ...(o.bloom ? { filter: V.bloom('vbloom-pg', o.bloom) } : {}) }, g);
    return g;
  };

  // ------------------------------------------------------------------ labels
  V.label = (parent, text, x, y, o = {}) => X.svg('text', {
    x, y, 'text-anchor': o.anchor || 'start', 'font-family': o.font || V.F.caps, 'font-size': o.size || 40,
    'font-weight': o.weight || 500, 'letter-spacing': o.ls ?? 2, fill: o.color || V.C.ink, text: o.upper === false ? text : String(text).toUpperCase(),
    ...(o.glow ? { filter: V.bloom('vbloom-txt', 3) } : {}), ...(o.attrs || {}),
  }, parent);
  /** Typewriter (2–3 characters per frame at the style's ~30 cps). Text taken from the element. */
  V.type = (el, t, cps = 30) => { const s = el.textContent; X.typeOn(el, s, t, cps); return t + s.length / cps; };
  /** Label + thin leader line + dot. move(lx,ly,px,py) repositions every frame if the target moves. */
  V.callout = (parent, text, o = {}) => {
    const g = X.svg('g', {}, parent);
    const line = X.svg('line', { stroke: o.color || V.C.ink, 'stroke-width': 2, opacity: 0.8 }, g);
    const dot = X.svg('circle', { r: 5, fill: o.color || V.C.ink }, g);
    const lab = V.label(g, text, 0, 0, { ...o, anchor: o.anchor || 'start' });
    const move = (lx, ly, px, py) => {
      lab.setAttribute('x', lx); lab.setAttribute('y', ly);
      const w = lab.getComputedTextLength ? lab.getComputedTextLength() : 100;
      const ax = (o.anchor === 'end' ? lx - w / 2 : lx + w / 2), ay = ly + 12 * (py > ly ? 1 : -3.2);
      line.setAttribute('x1', ax); line.setAttribute('y1', ay); line.setAttribute('x2', px); line.setAttribute('y2', py);
      dot.setAttribute('cx', px); dot.setAttribute('cy', py);
    };
    return { g, line, dot, label: lab, move };
  };
  /** Maths in a serif italic, each symbol coloured to match its object: parts = ['r', {t:'2',sub:1}, ' − ', {t:'λ',c:V.C.yellow}] */
  V.math = (parent, x, y, parts, o = {}) => {
    const el = X.svg('text', { x, y, 'text-anchor': o.anchor || 'start', 'font-family': V.F.math, 'font-size': o.size || 46, fill: o.color || V.C.ink }, parent);
    for (const p of parts) {
      const q = typeof p === 'string' ? { t: p } : p;
      const sp = X.svg('tspan', { text: q.t, fill: q.c || o.color || V.C.ink, 'font-style': q.i === false || /^[\s\d=+\-−×·½()]+$/.test(q.t) ? 'normal' : 'italic' }, el);
      if (q.sub) { sp.setAttribute('font-size', (o.size || 46) * 0.62); sp.setAttribute('dy', (o.size || 46) * 0.22); }
      if (q.after) sp.setAttribute('dy', -(o.size || 46) * 0.22);
    }
    return el;
  };

  // ------------------------------------------------------------------ focus
  V.dim = (el, t, level = 0.25, dur = 0.17) => X.tl.to(el, { opacity: level, duration: dur, ease: 'none' }, t);

  // ------------------------------------------------------------------ simulation time
  /** τ(t) = ∫ rate dt with rate linear between keys [[t, rate], ...]; two keys at one t = a snap (freeze: rate 0). */
  V.simClock = (keys) => {
    const cum = [0];
    for (let i = 1; i < keys.length; i++) cum[i] = cum[i - 1] + (keys[i][0] - keys[i - 1][0]) * (keys[i][1] + keys[i - 1][1]) / 2;
    return (t) => {
      if (t <= keys[0][0]) return keys[0][1] * (t - keys[0][0]);
      for (let i = 1; i < keys.length; i++) if (t < keys[i][0]) {
        const [t0, r0] = keys[i - 1], [t1, r1] = keys[i], u = t - t0, r = r0 + (r1 - r0) * u / (t1 - t0);
        return cum[i - 1] + u * (r0 + r) / 2;
      }
      const L = keys[keys.length - 1];
      return cum[cum.length - 1] + (t - L[0]) * L[1];
    };
  };

  // ------------------------------------------------------------------ tilted-plane camera
  /** World plane (x right, y down, units = px at zoom 1 top-down). pitch tilts the far (y<0) side away; rot spins in-plane.
   *  Tween its fields on X.tl like any object: X.tl.to(cam, {pitch: 0, z: 1, duration: 1.4, ease: 'power2.inOut'}, t). */
  V.planeCam = (o = {}) => ({
    cx: 960, cy: 540, ox: 0, oy: 0, z: 1, pitch: 0, rot: 0, D: 2000, ...o,
    project(x, y) {
      const X0 = x - this.ox, Y0 = y - this.oy, c = Math.cos(this.rot), s = Math.sin(this.rot);
      const Xr = X0 * c - Y0 * s, Yr = X0 * s + Y0 * c, Z = this.D - Yr * Math.sin(this.pitch), f = this.D / Z;
      return [this.cx + this.z * Xr * f, this.cy + this.z * Yr * Math.cos(this.pitch) * f, f];
    },
    unproject(sx, sy) {
      const a = (sx - this.cx) / this.z, b = (sy - this.cy) / this.z, sp = Math.sin(this.pitch), cp = Math.cos(this.pitch);
      const den = this.D * cp + b * sp;
      if (den <= 1e-6) return null;
      const Yr = b * this.D / den, Z = this.D - Yr * sp, Xr = a * Z / this.D, c = Math.cos(this.rot), s = Math.sin(this.rot);
      return [Xr * c + Yr * s + this.ox, -Xr * s + Yr * c + this.oy, this.D / Z];
    },
  });

  // ------------------------------------------------------------------ canvas layers (under the SVG)
  /** Low-res canvas stretched to 1920×1080 (bilinear = soft glow), optional blurred 'screen' copy for bloom. */
  V.canvasLayer = (o = {}) => {
    const [w, h] = o.res || [640, 360];
    const wrap = document.createElement('div');
    Object.assign(wrap.style, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px', pointerEvents: 'none' });
    X.stage.insertBefore(wrap, X.root);
    const mk = () => { const c = document.createElement('canvas'); c.width = w; c.height = h; Object.assign(c.style, { position: 'absolute', left: '0', top: '0', width: '1920px', height: '1080px' }); wrap.appendChild(c); return c; };
    const cv = mk(), ctx = cv.getContext('2d');
    let bloom = null, bctx = null;
    if (o.bloom) { bloom = mk(); bctx = bloom.getContext('2d'); Object.assign(bloom.style, { filter: `blur(${o.bloom}px)`, mixBlendMode: 'screen', opacity: o.bloomOpacity ?? 0.85 }); }
    const L = {
      wrap, cv, ctx, w, h, sx: 1920 / w, sy: 1080 / h, img: o.noImage ? null : ctx.createImageData(w, h),
      flush() { if (L.img) ctx.putImageData(L.img, 0, 0); if (bloom) { bctx.clearRect(0, 0, w, h); bctx.drawImage(cv, 0, 0); } },
      show(t0, t1) { gsap.set(wrap, { autoAlpha: 0 }); X.tl.set(wrap, { autoAlpha: 1 }, t0); if (t1 != null) X.tl.set(wrap, { autoAlpha: 0 }, t1); },
      on() { return wrap.style.visibility !== 'hidden'; },
    };
    return L;
  };

  // ------------------------------------------------------------------ scalar wave field (Huygens sum, phasors precomputed)
  /** groups: [{subs: [[x,y],...], x0: 0}] each a slit made of point sources (2-D Green's function ~ e^{ikr}/√r), only
   *  radiating into x > x0. Per grid cell stores the phasor C + iS of each group, so the field at sim time τ is
   *  Σ C cos ωτ + S sin ωτ (= Σ A cos(kr − ωτ)) and the time-averaged intensity is |Σ (C + iS)|². */
  V.waveField = ({ lambda, groups, box, step = 4, compFrom = [0, 0], comp = 0.3 }) => {
    const k = 2 * Math.PI / lambda, [x0, y0, x1, y1] = box;
    const nx = Math.ceil((x1 - x0) / step) + 1, ny = Math.ceil((y1 - y0) / step) + 1, N = nx * ny;
    const amp = (g, x, y) => {
      if (x <= (g.x0 ?? -Infinity)) return [0, 0];
      let c = 0, s = 0;
      for (const [sx, sy] of g.subs) {
        const r = Math.max(Math.hypot(x - sx, y - sy), lambda * 0.3), a = 1 / Math.sqrt(r / lambda);
        c += a * Math.cos(k * r); s += a * Math.sin(k * r);
      }
      return [c / g.subs.length, s / g.subs.length];
    };
    const G = groups.map((g) => {
      const C = new Float32Array(N), S = new Float32Array(N);
      for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
        const [c, s] = amp(g, x0 + i * step, y0 + j * step); C[j * nx + i] = c; S[j * nx + i] = s;
      }
      const cx = g.subs.reduce((a, p) => a + p[0], 0) / g.subs.length, cy = g.subs.reduce((a, p) => a + p[1], 0) / g.subs.length;
      return { C, S, cx, cy, def: g };
    });
    const M = new Float32Array(N); // display compensation (r/λ)^comp so the far field stays readable
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) M[j * nx + i] = Math.pow(Math.max(1, Math.hypot(x0 + i * step - compFrom[0], y0 + j * step - compFrom[1]) / lambda), comp);
    return { k, lambda, x0, y0, x1, y1, step, nx, ny, G, M, amp: (gi, x, y) => amp(groups[gi], x, y) };
  };

  /** Paint the field into a canvasLayer through a planeCam. st = {
   *   phase: ωτ, amps:[a0,a1..], fronts:[r0,r1..] (Infinity = steady state), mix: 0 wave (red +/blue −) … 1 intensity (yellow),
   *   wave: wave-layer level, gain, igain, bright, dim (spotlight, spares the wall glow), incident: {amp, half, xmin, cone, soft}
   *   (plane wave in x<0), wall: {x, glow} (time-averaged light on the wall, dark beyond it), depth: false = no far fade } */
  V.renderWaves = (L, cam, F, st) => {
    const d = L.img.data, W = L.w, H = L.h, { nx, ny, step, x0, y0, G, M } = F;
    const ng = G.length, cph = Math.cos(st.phase || 0), sph = Math.sin(st.phase || 0);
    const amps = st.amps || G.map(() => 1), fronts = st.fronts || G.map(() => Infinity);
    const mix = st.mix || 0, gain = st.gain ?? 1, igain = st.igain ?? 1, bright = (st.bright ?? 1) * (st.dim ?? 1);
    const waveLv = (st.wave ?? 1) * (1 - mix), wallDim = st.wallDim ?? 1;
    const R = V.RGB(st.cPos || V.C.red), B = V.RGB(st.cNeg || V.C.blue), Y = V.RGB(st.cInt || V.C.yellow);
    const inc = st.incident, wall = st.wall, edge = F.lambda * 0.6, k = F.k;
    const sp = Math.sin(cam.pitch), cp = Math.cos(cam.pitch), cr = Math.cos(cam.rot), sr = Math.sin(cam.rot);
    for (let j = 0; j < H; j++) {
      const b = ((j + 0.5) * L.sy - cam.cy) / cam.z, den = cam.D * cp + b * sp;
      let o = j * W * 4;
      if (den <= 1e-6) { for (let i = 0; i < W; i++, o += 4) { d[o] = d[o + 1] = d[o + 2] = 0; d[o + 3] = 255; } continue; }
      const Yr = b * cam.D / den, Z = cam.D - Yr * sp, fz = cam.D / Z;
      const fade = st.depth === false ? 1 : V.clamp((fz - 0.5) / 0.4);
      // world coords are linear along a row
      const a0 = (0.5 * L.sx - cam.cx) / cam.z, da = L.sx / cam.z;
      let Xr = a0 * Z / cam.D; const dXr = da * Z / cam.D;
      let x = Xr * cr + Yr * sr + cam.ox, y = -Xr * sr + Yr * cr + cam.oy;
      const dx = dXr * cr, dy = -dXr * sr;
      for (let i = 0; i < W; i++, o += 4, x += dx, y += dy) {
        let r = 0, g = 0, bl = 0;
        const gx = (x - x0) / step, gy = (y - y0) / step;
        if (wall && x > wall.x + 5) { /* behind the wall: dark */ }
        else if (x < 0) {
          if (inc && x > inc.xmin) {
            const hw = inc.cone ? 14 + (inc.half - 14) * (x - inc.xmin) / -inc.xmin : inc.half;
            const sf = inc.soft ?? 40, m = V.smooth(hw + sf, hw - sf, Math.abs(y)) * V.smooth(inc.xmin, inc.xmin + (inc.cone ? 30 : 160), x);
            const v = inc.amp * Math.cos(k * x - (st.phase || 0)) * m;
            const u = Math.min(1, Math.abs(v)) * Math.sqrt(waveLv), I = inc.amp * inc.amp * 0.5 * m * mix * igain * 0.6;
            const c = v > 0 ? R : B;
            r = c[0] * u * u + Y[0] * I; g = c[1] * u * u + Y[1] * I; bl = c[2] * u * u + Y[2] * I;
          }
        } else if (gx >= 0 && gy >= 0 && gx < nx - 1 && gy < ny - 1) {
          const ix = gx | 0, iy = gy | 0, fx = gx - ix, fy = gy - iy, id = iy * nx + ix;
          const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
          let fc = 0, fs = 0, v = 0;
          for (let q = 0; q < ng; q++) {
            const a = amps[q]; if (!a) continue;
            const Cq = G[q].C, Sq = G[q].S;
            const c = Cq[id] * w00 + Cq[id + 1] * w10 + Cq[id + nx] * w01 + Cq[id + nx + 1] * w11;
            const s = Sq[id] * w00 + Sq[id + 1] * w10 + Sq[id + nx] * w01 + Sq[id + nx + 1] * w11;
            let m = a;
            if (fronts[q] !== Infinity) { const rr = Math.hypot(x - G[q].cx, y - G[q].cy); m *= V.clamp((fronts[q] - rr) / edge); }
            v += m * (c * cph + s * sph);
            fc += a * c; fs += a * s;
          }
          const comp = M[id];
          if (waveLv > 0) {
            let vv = v * comp * gain; vv = vv / Math.sqrt(1 + vv * vv);
            const u = Math.abs(vv), lum = u * Math.sqrt(u) * waveLv, c = vv > 0 ? R : B;
            r += c[0] * lum; g += c[1] * lum; bl += c[2] * lum;
          }
          let I = (fc * fc + fs * fs) * comp * comp * igain; I = I / (1 + I);
          if (mix > 0) { const l = I * mix; r += Y[0] * l; g += Y[1] * l; bl += Y[2] * l; }
          if (wall && x > wall.x - 5) { const l = I * (wall.glow ?? 1) * 1.6 / (st.dim ?? 1) * wallDim; r += Y[0] * l; g += Y[1] * l; bl += Y[2] * l; }
        }
        const f = fade * bright;
        d[o] = r * f; d[o + 1] = g * f; d[o + 2] = bl * f; d[o + 3] = 255;
      }
    }
    L.flush();
  };

  /** Points of the nodal / antinodal curve |P−A| − |P−B| = delta (A, B = two sources), for each x in xs, on side sgn of the AB axis.
   *  (A and B on a vertical line x = ax; returns [[x, y], ...].) */
  V.hyperbola = (A, B, delta, xs, sgn = 1) => xs.map((x) => {
    const f = (y) => Math.hypot(x - A[0], y - A[1]) - Math.hypot(x - B[0], y - B[1]) - delta;
    let lo = (A[1] + B[1]) / 2, hi = lo + sgn * 1e5;
    for (let i = 0; i < 60; i++) { const mid = (lo + hi) / 2; (f(mid) * f(lo) <= 0) ? (hi = mid) : (lo = mid); }
    return [x, (lo + hi) / 2];
  });

  // ------------------------------------------------------------------ arrow arrays (sine envelopes of thin arrows)
  /** n reusable arrows (2–3 px shafts, small filled heads). set(i, x0,y0,x1,y1, colour) each frame; hideFrom(i). */
  V.arrows = (parent, n, o = {}) => {
    const g = X.svg('g', { ...(o.glow ? { filter: V.bloom('vbloom-arr', 3) } : {}) }, parent);
    const els = Array.from({ length: n }, () => X.svg('path', { 'stroke-width': o.width || 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g));
    const head = o.head ?? 9;
    return {
      g, els,
      set(i, ax, ay, bx, by, col, op = 1) {
        const e = els[i], L = Math.hypot(bx - ax, by - ay);
        if (L < 1.5) { e.setAttribute('d', ''); return; }
        const ux = (bx - ax) / L, uy = (by - ay) / L, h = Math.min(head, L * 0.6), wv = h * 0.45;
        const hx = bx - ux * h, hy = by - uy * h;
        e.setAttribute('d', `M${ax.toFixed(1)},${ay.toFixed(1)}L${hx.toFixed(1)},${hy.toFixed(1)}M${bx.toFixed(1)},${by.toFixed(1)}L${(hx - uy * wv).toFixed(1)},${(hy + ux * wv).toFixed(1)}L${(hx + uy * wv).toFixed(1)},${(hy - ux * wv).toFixed(1)}Z`);
        e.setAttribute('stroke', col); e.setAttribute('fill', col); e.setAttribute('opacity', op);
      },
      hideFrom(i) { for (let k = i; k < n; k++) els[k].setAttribute('d', ''); },
    };
  };

  // ------------------------------------------------------------------ streamlines & particles
  /** RK4 streamline of a 2-D vector field E(x,y) → [ex, ey] from a seed, following the field (dir = 1) or against it. */
  V.fieldLine = (E, seed, o = {}) => {
    const h = o.step || 4, max = o.max || 2000, dir = o.dir || 1, pts = [seed.slice()];
    let [x, y] = seed;
    const nrm = (x, y) => { const [a, b] = E(x, y), L = Math.hypot(a, b) || 1; return [dir * a / L, dir * b / L]; };
    for (let i = 0; i < max; i++) {
      const k1 = nrm(x, y), k2 = nrm(x + h / 2 * k1[0], y + h / 2 * k1[1]), k3 = nrm(x + h / 2 * k2[0], y + h / 2 * k2[1]), k4 = nrm(x + h * k3[0], y + h * k3[1]);
      x += h / 6 * (k1[0] + 2 * k2[0] + 2 * k3[0] + k4[0]); y += h / 6 * (k1[1] + 2 * k2[1] + 2 * k3[1] + k4[1]);
      pts.push([x, y]);
      if (o.stop && o.stop(x, y)) break;
      if (x < -200 || x > 2120 || y < -200 || y > 1280) break;
    }
    return pts;
  };
  V.pathD = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  /** Particles riding precomputed polylines at `speed` px/s from t0 (position = pure function of t). */
  V.flowParticles = (parent, lines, o = {}) => {
    const per = o.per || 3, speed = o.speed || 120, t0 = o.t0 || 0, rnd = X.rand(o.seed || 5);
    const items = [];
    for (const pts of lines) {
      const cum = [0];
      for (let i = 1; i < pts.length; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      const Ltot = cum[cum.length - 1];
      for (let k = 0; k < per; k++) items.push({ pts, cum, Ltot, off: (k / per + rnd() * 0.1) * Ltot, el: X.svg('circle', { r: o.r || 5, fill: o.color || V.C.yellow, filter: V.bloom('vbloom-p', 4) }, parent) });
    }
    X.every((t) => {
      for (const it of items) {
        it.el.setAttribute('visibility', t < t0 ? 'hidden' : 'visible');   // they appear when the narration starts them
        let s = (it.off + speed * Math.max(0, t - t0)) % it.Ltot, lo = 0, hi = it.cum.length - 1;
        while (hi - lo > 1) { const m = (lo + hi) >> 1; it.cum[m] <= s ? (lo = m) : (hi = m); }
        const u = (s - it.cum[lo]) / ((it.cum[hi] - it.cum[lo]) || 1), a = it.pts[lo], b = it.pts[hi];
        it.el.setAttribute('cx', a[0] + (b[0] - a[0]) * u); it.el.setAttribute('cy', a[1] + (b[1] - a[1]) * u);
      }
    });
    return items;
  };
  /** Deterministic Monte-Carlo samples from a tabulated pdf on [x0, x1] (inverse CDF). */
  V.sampler = (pdf, x0, x1, seed = 11) => {
    const n = pdf.length, cdf = new Float64Array(n);
    let acc = 0; for (let i = 0; i < n; i++) { acc += Math.max(0, pdf[i]); cdf[i] = acc; }
    const rnd = X.rand(seed);
    return () => {
      const u = rnd() * acc; let lo = 0, hi = n - 1;
      while (hi - lo > 1) { const m = (lo + hi) >> 1; cdf[m] < u ? (lo = m) : (hi = m); }
      return x0 + (x1 - x0) * (hi + rnd() - 0.5) / (n - 1);
    };
  };
  /** Canvas of accumulating hits: draw(N) paints the first N precomputed points additively (o.under = [x,y,w,h,colour]
   *  backdrop, o.lead = {n, r} draws the first n narrated hits as solid dots). */
  V.hitLayer = (pts, o = {}) => {
    const L = V.canvasLayer({ res: o.res || [1920, 1080], noImage: true, bloom: o.bloom, bloomOpacity: o.bloomOpacity });
    const [cr, cg, cb] = V.RGB(o.color || V.C.yellow), sz = o.size || 3, a = o.alpha ?? 0.35;
    L.draw = (N) => {
      const c = L.ctx; c.globalCompositeOperation = 'source-over'; c.clearRect(0, 0, L.w, L.h);
      if (o.under) { c.fillStyle = o.under[4]; c.fillRect(o.under[0], o.under[1], o.under[2], o.under[3]); }
      c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(${cr},${cg},${cb},${a})`;
      const n = Math.min(N | 0, pts.length), lead = o.lead ? Math.min(n, o.lead.n) : 0;
      for (let i = lead; i < n; i++) c.fillRect(pts[i][0] - sz / 2, pts[i][1] - sz / 2, sz, sz);
      if (lead) { // the first, narrated hits drawn as clear single dots
        c.globalCompositeOperation = 'source-over'; c.fillStyle = o.lead.color || `rgb(${cr},${cg},${cb})`;
        for (let i = 0; i < lead; i++) { c.beginPath(); c.arc(pts[i][0], pts[i][1], o.lead.r || 4, 0, 2 * Math.PI); c.fill(); }
      }
      if (L.bloom) { const b = L.bloom.getContext('2d'); b.clearRect(0, 0, L.w, L.h); b.drawImage(L.cv, 0, 0); }
    };
    return L;
  };

  // ------------------------------------------------------------------ graphs with labelled axes
  /** Axes box {x,y (top-left), w, h, xr:[a,b], yr:[a,b], xLabel, yLabel}; draws on at t (lines 0.4 s, labels typed). */
  V.axes = (parent, o) => {
    const g = X.svg('g', {}, parent), col = o.color || V.C.ink;
    const xr = o.xr || [0, 1], yr = o.yr || [0, 1];
    const ax = { g, x: o.x, y: o.y, w: o.w, h: o.h, X: (v) => o.x + (v - xr[0]) / (xr[1] - xr[0]) * o.w, Y: (v) => o.y + o.h - (v - yr[0]) / (yr[1] - yr[0]) * o.h };
    const xl = X.svg('path', { d: `M${o.x},${o.y + o.h}H${o.x + o.w + 30}`, stroke: col, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
    const yl = X.svg('path', { d: `M${o.x},${o.y + o.h}V${o.y - 30}`, stroke: col, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, g);
    const hx = X.svg('path', { d: `M${o.x + o.w + 44},${o.y + o.h}l-18,-8v16z`, fill: col, opacity: 0 }, g);
    const hy = X.svg('path', { d: `M${o.x},${o.y - 44}l-8,18h16z`, fill: col, opacity: 0 }, g);
    for (const [v, lab] of o.xTicks || []) { X.svg('line', { x1: ax.X(v), x2: ax.X(v), y1: o.y + o.h, y2: o.y + o.h + 12, stroke: col, 'stroke-width': 2 }, g); if (lab) X.svg('text', { x: ax.X(v), y: o.y + o.h + 50, 'text-anchor': 'middle', 'font-family': V.F.math, 'font-size': 34, fill: col, text: lab }, g); }
    const t = o.t ?? 0;
    X.drawOn(xl, t, 0.4, 'power2.out'); X.drawOn(yl, t, 0.4, 'power2.out');
    X.tl.to([hx, hy], { opacity: 1, duration: 0.1, ease: 'none' }, t + 0.35);
    if (o.xLabel) { ax.xLabel = X.svg('text', { x: o.x + o.w, y: o.y + o.h + 62, 'text-anchor': 'end', 'font-family': V.F.math, 'font-style': 'italic', 'font-size': 40, fill: col, text: o.xLabel }, g); V.type(ax.xLabel, t + 0.3, 34); }
    if (o.yLabel) { ax.yLabel = X.svg('text', { x: 0, y: 0, transform: `translate(${o.x - 26},${o.y}) rotate(-90)`, 'text-anchor': 'end', 'font-family': V.F.math, 'font-style': 'italic', 'font-size': 40, fill: col, text: o.yLabel }, g); V.type(ax.yLabel, t + 0.45, 34); }
    return ax;
  };
  /** A curve on axes from fn(v) (n samples over xr) or from points [[v, y], ...]. */
  V.plot = (ax, f, o = {}) => {
    const xr = o.xr || [0, 1], n = o.n || 400;
    const pts = typeof f === 'function' ? Array.from({ length: n + 1 }, (_, i) => { const v = xr[0] + (xr[1] - xr[0]) * i / n; return [ax.X(v), ax.Y(f(v))]; }) : f.map(([v, y]) => [ax.X(v), ax.Y(y)]);
    return X.svg('path', { d: V.pathD(pts), fill: 'none', stroke: o.color || V.C.yellow, 'stroke-width': o.width || 3.5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round', ...(o.dash ? { 'stroke-dasharray': o.dash } : {}), ...(o.glow ? { filter: V.bloom('vbloom-plot', 4) } : {}) }, o.parent || ax.g);
  };
  /** Left→right reveal through a growing clip rect (linear: data draws at a constant rate). */
  V.reveal = (el, t, dur, box = [0, 0, 1920, 1080], ease = 'none') => {
    const id = 'vclip' + (V._clip = (V._clip || 0) + 1);
    const cp = X.svg('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, X.defs);
    const r = X.svg('rect', { x: box[0], y: box[1], width: 0, height: box[3] }, cp);
    el.setAttribute('clip-path', `url(#${id})`);
    X.tl.fromTo(r, { attr: { width: 0 } }, { attr: { width: box[2] }, duration: dur, ease, immediateRender: false }, t);
    return r;
  };

  // ------------------------------------------------------------------ node-edge graphs & algorithm traces
  /** nodes [[x,y],...], edges [[a,b,w],...]. States snap (no tween): idle · frontier · current · settled · goal · dim. */
  V.graph = (parent, nodes, edges, o = {}) => {
    const g = X.svg('g', {}, parent), eg = X.svg('g', {}, g), ng = X.svg('g', {}, g), r = o.r || 18;
    const E = new Map(), N = [];
    for (const [a, b, w] of edges) {
      const [x1, y1] = nodes[a], [x2, y2] = nodes[b];
      const ln = X.svg('line', { x1, y1, x2, y2, stroke: o.edge || V.C.grey, 'stroke-width': 3, 'stroke-linecap': 'round' }, eg);
      let wt = null;
      if (o.weights && w != null) wt = X.svg('text', { x: (x1 + x2) / 2 + 10, y: (y1 + y2) / 2 - 10, 'font-family': V.F.math, 'font-size': 30, fill: V.C.grey, text: w }, eg);
      E.set(a + '-' + b, { ln, wt }); E.set(b + '-' + a, { ln, wt });
    }
    nodes.forEach(([x, y], i) => {
      const ng1 = X.svg('g', {}, ng);
      const halo = X.svg('circle', { cx: x, cy: y, r: r * 2.4, fill: V.C.red, opacity: 0, filter: V.bloom('vbloom-halo', 10) }, ng1);
      const c = X.svg('circle', { cx: x, cy: y, r, fill: o.fill || V.C.bg, stroke: V.C.ink, 'stroke-width': 2.5 }, ng1);
      const tx = X.svg('text', { x, y: y + 10, 'text-anchor': 'middle', 'font-family': V.F.math, 'font-size': o.numSize || 26, fill: V.C.ink, text: o.labels ? o.labels[i] : '' }, ng1);
      N.push({ g: ng1, c, tx, halo });
    });
    const S = {
      idle: [o.fill || V.C.bg, V.C.ink, 0, V.C.ink], frontier: [V.C.bg, V.C.red, 0, V.C.red], current: [V.C.red, V.C.red, 0.55, V.C.ink],
      settled: [V.C.green, V.C.green, 0.25, V.C.ink], goal: [V.C.yellow, V.C.yellow, 0.45, V.C.bg], dim: [V.C.bg, V.C.dim, 0, V.C.dim],
    };
    const G = {
      g, N, E, nodes,
      state(i, s, t) { const [f, st, h, tc] = S[s]; X.tl.set(N[i].c, { attr: { fill: f, stroke: st } }, t); X.tl.set(N[i].halo, { opacity: h, attr: { fill: s === 'settled' ? V.C.green : s === 'goal' ? V.C.yellow : V.C.red } }, t); X.tl.set(N[i].tx, { attr: { fill: tc } }, t); },
      text(i, s, t) { X.tl.set(N[i].tx, { textContent: s }, t); },
      edge(a, b, col, t, w = 3) { X.tl.set(E.get(a + '-' + b).ln, { attr: { stroke: col, 'stroke-width': w } }, t); },
      build(t, stagger = 0.03) { N.forEach((n, i) => X.pop(n.g, t + i * stagger, { scale: 1, dur: 0.17, ease: 'back.out(1.4)', sfx: false })); [...new Set(E.values())].forEach((e, i) => { X.drawOn(e.ln, t + 0.2 + i * 0.02, 0.4, 'none'); }); },
    };
    return G;
  };
  /** Real Dijkstra trace: [{cur, dist:[..] snapshot after relaxing, relaxed:[nbr..], settled:[..]}]. */
  V.dijkstra = (n, edges, src) => {
    const adj = Array.from({ length: n }, () => []);
    for (const [a, b, w] of edges) { adj[a].push([b, w]); adj[b].push([a, w]); }
    const dist = Array(n).fill(Infinity), done = Array(n).fill(false), prev = Array(n).fill(-1), steps = [];
    dist[src] = 0;
    for (let it = 0; it < n; it++) {
      let u = -1; for (let i = 0; i < n; i++) if (!done[i] && dist[i] < Infinity && (u < 0 || dist[i] < dist[u])) u = i;
      if (u < 0) break;
      done[u] = true; const relaxed = [];
      for (const [v, w] of adj[u]) if (!done[v] && dist[u] + w < dist[v]) { dist[v] = dist[u] + w; prev[v] = u; relaxed.push(v); }
      steps.push({ cur: u, dist: dist.slice(), relaxed, prev: prev.slice() });
    }
    return steps;
  };
  /** Play a trace on V.graph: current node red → neighbours get their new distance → node turns green. times[i] = step start. */
  V.playTrace = (G, steps, times, o = {}) => {
    const fmt = o.fmt || ((d) => (d === Infinity ? '∞' : String(d)));
    steps.forEach((s, i) => {
      const t = times[i]; if (t == null) return;
      const gap = o.gap ?? 0.18;
      G.state(s.cur, 'current', t); if (o.sfx !== false) X.sfx(t, 'blip', { gain: 0.25, pitch: 1 + 0.02 * i });
      s.relaxed.forEach((v, k) => { G.state(v, 'frontier', t + gap * (k + 1)); G.text(v, fmt(s.dist[v]), t + gap * (k + 1)); if (s.prev[v] >= 0) G.edge(s.prev[v], v, V.C.red, t + gap * (k + 1), 4); });
      G.state(s.cur, o.goal === s.cur ? 'goal' : 'settled', t + gap * (s.relaxed.length + 1) + 0.1);
    });
  };

  // ------------------------------------------------------------------ counters
  V.counter = (parent, o = {}) => {
    const g = X.svg('g', {}, parent);
    const lab = V.label(g, o.label || 'STEPS', o.x || 120, o.y || 120, { size: o.labelSize || 36, color: o.labelColor || V.C.grey, ls: 3 });
    const num = X.svg('text', { x: o.x || 120, y: (o.y || 120) + (o.size || 72) * 0.95, 'font-family': V.F.caps, 'font-weight': 500, 'font-size': o.size || 72, fill: o.color || V.C.ink, text: '0' }, g);
    return { g, label: lab, num };
  };
  /** n(t): the first `slow` items at explicit times (narrated steps), then an exponential speed ramp to n1 over dur. */
  V.rampCount = (o) => {
    const slow = o.slow || [], t0 = o.t0, dur = o.dur, n0 = slow.length, n1 = o.n1, k = o.k ?? 10;
    return (t) => {
      if (t < t0) { let n = 0; for (const s of slow) if (t >= s) n++; return n; }
      const p = V.clamp((t - t0) / dur);
      const e = p <= 0 ? 0 : (Math.pow(2, k * (p - 1)) - Math.pow(2, -k)) / (1 - Math.pow(2, -k));
      return Math.round(n0 + (n1 - n0) * e);
    };
  };
})();
