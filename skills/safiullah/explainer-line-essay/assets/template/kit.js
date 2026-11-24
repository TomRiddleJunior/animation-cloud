/* Line-essay kit — the "glowing pen on black" vertical reel essay (explainer-line-essay skill).
 *
 * One continuous take on a near-black mottled ground: a pen with a spark at its nib draws hand-wobbly lines live,
 * machine lines draw themselves ruler-straight, tiny letter-spaced mono labels type on next to the drawing, and every
 * line carries a HALFTONE glow (a blurred halo seen through a screen-aligned dot grid). Warm amber = human,
 * cool blue = machine, white = neutral / not yet examined. Karaoke captions (Poppins, grey → white per word) sit at
 * 75 % of frame height; a cream pill CTA pops under them at the end.
 *
 *   const K = LineEssayKit(X);           // after await X.loadVO()
 *   K.setup();                           // ground + halftone art layer + camera + captions + pen
 *   ... build ... (all times absolute seconds; put them on words: X.word(id,'word'))
 *   await K.captions('script.json');     // karaoke captions from script.json "chunks" / "bold"
 *   K.finish();                          // registers the per-frame update — call LAST
 *
 * Everything is a pure function of t (evaluated in X.every), so any frame renders identically in any worker.
 *
 * Strokes      K.stroke(parent, pts|d, {kind:'white'|'amber'|'blue'|'teal', w, steps})  → g (hidden until animated)
 *              K.anim(g, t0, dur, mode, {ease, trail})   modes: draw · undraw · erase · collapse · expand · comet ·
 *                                                         show · hide · dissolve
 *              K.penDraw(g, t0, dur, {ease, enter, exit})  draw with the pen riding the head
 *              K.tint(g, t0, dur, toKind)                  colour shift (white → amber on the zoom back in)
 *              K.width(g, t0, dur, toW)                    stroke-width change (wear)
 * Centrelines  K.cl.line/poly/arc/circle/bez · K.hand(pts, {wob, trem, seed}) · K.d(pts)
 * Machine      K.ruled(parent, pts, {gap})  two parallel ruled lines (a paved band) · K.crosshair(parent, x, y, t)
 * Text         K.label(parent, text, x, y, t, {anchor, size, color, cps, out}) · K.counterText(...)
 * Marks        K.brackets(parent, cx, cy, w, h, t, {color, out}) · K.ticks(...) · K.flare(parent, x, y, t, {w})
 *              K.ring(parent, x, y, t, {r0, r1, dur}) · K.angleMark(parent, x, y, t, {size})
 * Movers       K.walker(parent, pts|d, t0, dur, {kind, trail, r})  comet spark along a path (linear speed)
 * Camera       K.camTo(t0, dur, {x, y, s, pin}, ease)  world point (x,y) to the art focus at scale s (log-zoom)
 *              K.camBlur(t0, dur, std)  radial-ish smear for zoom-throughs
 * Captions     await K.captions('script.json', {y, size})
 * CTA          K.pill({t, text, icon, tFlip, text2, icon2, tOut, y})
 * Hooks        K.every(fn(t))  extra per-frame logic that must run after the camera (e.g. HUD tracking)
 */
(function () {
  window.LineEssayKit = function (X, opt = {}) {
    const K = {};
    const W = X.W, H = X.H, NS = 'http://www.w3.org/2000/svg', XL = 'http://www.w3.org/1999/xlink';
    // ------------------------------------------------------------------ palette (sampled from the source reel)
    const C = K.C = Object.assign({
      ground: '#0c0e0f',
      white: '#efe8ec', whiteU: '#b4a9b0',     // neutral line: pinkish white core, mauve halo
      amber: '#f5e8cf', amberU: '#cfa874',     // human: cream core, amber halo
      blue: '#cad5e4', blueU: '#6a8aae',       // machine: ice core, steel-blue halo
      teal: '#d2f1e9', tealU: '#4fbea5',       // "everyone else" accent
      label: '#ebe6ea', labelDim: '#8e8890', labelAmber: '#f3dcae', labelBlue: '#aec0d8',
      capOn: '#fdfbfc', capOff: '#5f5961', pill: '#f2efe8', pillInk: '#151515',
      tile: '#121922', tileLine: '#3f5876',
    }, opt.colors || {});
    K.FOCUS = { x: W / 2, y: Math.round(H * 0.455) };       // art centre: source circle centre at 0.46–0.47 H
    K.CAP_Y = Math.round(H * 0.75);                         // caption block centre
    K.PILL_Y = Math.round(H * 0.853);                       // pill centre
    const E = (e) => (typeof e === 'function' ? e : gsap.parseEase(e || 'power2.inOut'));
    const cl01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const lerp = (a, b, p) => a + (b - a) * p;
    const hex = (h) => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
    const mix = (a, b, p) => { const A = hex(a), B = hex(b); return `rgb(${A.map((v, i) => Math.round(lerp(v, B[i], p))).join(',')})`; };
    K.mix = mix; K.lerp = lerp; K.cl01 = cl01; K.E = E;
    const hooks = [];
    K.every = (fn) => hooks.push(fn);

    // ------------------------------------------------------------------ ground: mottled near-black, boiling at 7.5 fps
    K.ground = (o = {}) => {
      const base = o.base || [12, 14, 15], amp = o.amp ?? 6, ind = o.boil ?? 0.27, n = o.states ?? 4, fps = o.fps ?? 7.5;
      const lw = Math.ceil(W / 4), lh = Math.ceil(H / 4);
      const field = (seed, cell) => {                       // smooth value noise at low res
        const r = X.rand(seed), gw = Math.ceil(lw / cell) + 2, gh = Math.ceil(lh / cell) + 2;
        const g = Array.from({ length: gw * gh }, () => r() * 2 - 1);
        const out = new Float32Array(lw * lh);
        for (let y = 0; y < lh; y++) for (let x = 0; x < lw; x++) {
          const fx = x / cell, fy = y / cell, ix = fx | 0, iy = fy | 0;
          let u = fx - ix, v = fy - iy; u = u * u * (3 - 2 * u); v = v * v * (3 - 2 * v);
          const i = iy * gw + ix;
          out[y * lw + x] = lerp(lerp(g[i], g[i + 1], u), lerp(g[i + gw], g[i + gw + 1], u), v);
        }
        return out;
      };
      const common = [field(31, 26), field(32, 9)];
      // fine static grain tile (added with 'lighter'), shared by all states
      // fine static grain in 2×2-px cells (survives downscaling, like the source's compressed film grain)
      const g0 = document.createElement('canvas'); g0.width = g0.height = 128;
      const gx0 = g0.getContext('2d'), gi = gx0.createImageData(128, 128), gr = X.rand(77), ga = o.grain ?? 6;
      for (let i = 0; i < gi.data.length; i += 4) { const v = Math.floor(gr() * ga); gi.data[i] = gi.data[i + 1] = gi.data[i + 2] = v; gi.data[i + 3] = 255; }
      gx0.putImageData(gi, 0, 0);
      const gt = document.createElement('canvas'); gt.width = gt.height = 256;
      const gx = gt.getContext('2d'); gx.imageSmoothingEnabled = false; gx.drawImage(g0, 0, 0, 256, 256);
      const holder = document.createElement('div');
      Object.assign(holder.style, { position: 'absolute', inset: '0', zIndex: 0, pointerEvents: 'none' });
      X.stage.insertBefore(holder, X.root);
      const layers = [];
      for (let k = 0; k < n; k++) {
        const fi = [field(100 + k * 7, 26), field(200 + k * 7, 9)];
        const lc = document.createElement('canvas'); lc.width = lw; lc.height = lh;
        const lx = lc.getContext('2d'), li = lx.createImageData(lw, lh);
        for (let i = 0; i < lw * lh; i++) {
          const v = 0.75 * (0.7 * common[0][i] + 0.3 * common[1][i]) + ind * (0.7 * fi[0][i] + 0.3 * fi[1][i]);
          const b0 = -(o.grain ?? 6) / 2; li.data[i * 4] = base[0] + b0 + v * amp; li.data[i * 4 + 1] = base[1] + b0 + v * amp; li.data[i * 4 + 2] = base[2] + b0 + v * amp * 1.05;
          li.data[i * 4 + 3] = 255;
        }
        lx.putImageData(li, 0, 0);
        const c = document.createElement('canvas'); c.width = W; c.height = H;
        const cx = c.getContext('2d'); cx.imageSmoothingEnabled = true; cx.imageSmoothingQuality = 'high';
        cx.drawImage(lc, 0, 0, W, H);
        cx.globalCompositeOperation = 'lighter'; cx.fillStyle = cx.createPattern(gt, 'repeat'); cx.fillRect(0, 0, W, H);
        const d = document.createElement('div');
        Object.assign(d.style, { position: 'absolute', inset: '0', backgroundImage: `url(${c.toDataURL('image/jpeg', 0.9)})`, backgroundSize: '100% 100%', visibility: k ? 'hidden' : 'visible' });
        holder.appendChild(d); layers.push(d);
      }
      let last = 0;
      K.every((t) => { const k = Math.floor(t * fps + 1e-6) % n; if (k !== last) { layers[last].style.visibility = 'hidden'; layers[k].style.visibility = 'visible'; last = k; } });
      return holder;
    };

    // ------------------------------------------------------------------ halftone glow filter (screen-aligned dots)
    K.halftone = (id = 'ht', o = {}) => {
      const pitch = o.pitch ?? 6, blur = o.blur ?? 9, gain = o.gain ?? 3.4, haloOp = o.halo ?? 0.95, soft = o.soft ?? 2.0, softOp = o.softOp ?? 0.55;
      const S = 64, c = document.createElement('canvas'); c.width = c.height = S;
      const g = c.getContext('2d'), gr = g.createRadialGradient(S / 2, S / 2, 0, S / 2, S / 2, S / 2);
      gr.addColorStop(0, 'rgba(255,255,255,1)'); gr.addColorStop(1, 'rgba(255,255,255,0)');
      g.fillStyle = gr; g.fillRect(0, 0, S, S);
      const f = X.svg('filter', { id, filterUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H, 'color-interpolation-filters': 'sRGB' }, X.defs);
      X.svg('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: blur, result: 'b' }, f);
      X.svg('feColorMatrix', { in: 'b', type: 'matrix', values: `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${gain} 0`, result: 'ba' }, f);
      const fi = X.svg('feImage', { x: 0, y: 0, width: pitch, height: pitch, preserveAspectRatio: 'none', result: 'dot' }, f);
      const url = c.toDataURL('image/png'); fi.setAttribute('href', url); fi.setAttributeNS(XL, 'xlink:href', url);
      X.svg('feTile', { in: 'dot', result: 'dots' }, f);
      X.svg('feComposite', { in: 'ba', in2: 'dots', operator: 'arithmetic', k1: 0, k2: 1, k3: 1, k4: -1, result: 'm' }, f);
      const ct = X.svg('feComponentTransfer', { in: 'm', result: 'm2' }, f);
      X.svg('feFuncA', { type: 'linear', slope: o.sharp ?? 2.6, intercept: 0 }, ct);
      X.svg('feColorMatrix', { in: 'b', type: 'matrix', values: '1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0 1', result: 'bc' }, f);
      X.svg('feComposite', { in: 'bc', in2: 'm2', operator: 'in', result: 'halo' }, f);
      X.svg('feColorMatrix', { in: 'halo', type: 'matrix', values: `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${haloOp} 0`, result: 'halo2' }, f);
      X.svg('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: soft, result: 's' }, f);
      X.svg('feColorMatrix', { in: 's', type: 'matrix', values: `1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${softOp} 0`, result: 's2' }, f);
      const m = X.svg('feMerge', {}, f);
      X.svg('feMergeNode', { in: 'halo2' }, m); X.svg('feMergeNode', { in: 's2' }, m); X.svg('feMergeNode', { in: 'SourceGraphic' }, m);
      return `url(#${id})`;
    };

    // ------------------------------------------------------------------ centrelines + hand wobble
    const seg = (a, b, step) => { const L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.max(1, Math.round(L / step)); const o = []; for (let i = 0; i < n; i++) o.push([lerp(a[0], b[0], i / n), lerp(a[1], b[1], i / n)]); return o; };
    K.cl = {
      line: (a, b, step = 4) => [...seg(a, b, step), b.slice()],
      poly: (pts, step = 4) => { const o = []; for (let i = 0; i < pts.length - 1; i++) o.push(...seg(pts[i], pts[i + 1], step)); o.push(pts[pts.length - 1].slice()); return o; },
      arc: (cx, cy, r, a0, a1, step = 4, ry = r) => { const n = Math.max(8, Math.round(Math.abs(a1 - a0) * r / step)); return Array.from({ length: n + 1 }, (_, i) => { const a = lerp(a0, a1, i / n); return [cx + r * Math.cos(a), cy + ry * Math.sin(a)]; }); },
      circle: (cx, cy, r, start = -2.2, turns = 1, step = 4) => K.cl.arc(cx, cy, r, start, start + turns * Math.PI * 2, step),
      bez: (p0, p1, p2, p3, n = 60) => Array.from({ length: n + 1 }, (_, i) => { const t = i / n, u = 1 - t; return [u * u * u * p0[0] + 3 * u * u * t * p1[0] + 3 * u * t * t * p2[0] + t * t * t * p3[0], u * u * u * p0[1] + 3 * u * u * t * p1[1] + 3 * u * t * t * p2[1] + t * t * t * p3[1]]; }),
    };
    K.arclen = (pts) => { const s = [0]; for (let i = 1; i < pts.length; i++) s.push(s[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1])); return s; };
    K.normals = (pts) => pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], L = Math.hypot(dx, dy) || 1; return [-dy / L, dx / L]; });
    /** Hand wobble: slow drift (wob px, wavelengths 90–400 px) + tremor (trem px, every point). offset(s,i) adds a custom bend. */
    K.hand = (pts, o = {}) => {
      const r = X.rand(o.seed || 5), wob = o.wob ?? 3.2, trem = o.trem ?? 1.1;
      const waves = [[90, r() * 6.28, 0.35], [170, r() * 6.28, 0.6], [380, r() * 6.28, 1.0]];
      const s = K.arclen(pts), nn = K.normals(pts), Ltot = s[s.length - 1] || 1;
      return pts.map((p, i) => {
        let off = waves.reduce((a, [l, ph, k]) => a + k * Math.sin(s[i] / l * 6.283 + ph), 0) * wob / 1.95;
        off += (r() - 0.5) * 2 * trem;
        if (o.offset) off += o.offset(s[i] / Ltot, s[i]);
        if (o.taper) off *= Math.min(1, s[i] / o.taper, (Ltot - s[i]) / o.taper + 0.15);
        return [p[0] + nn[i][0] * off, p[1] + nn[i][1] * off];
      });
    };
    K.d = (pts) => 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');

    // ------------------------------------------------------------------ strokes and their time records
    const strokes = [];
    K.stroke = (parent, pts, o = {}) => {
      const kind = o.kind || 'white', w = o.w ?? 2.4;
      const g = X.svg('g', {}, parent), gi = X.svg('g', {}, g);   // outer g: free for your own tweens · inner: window opacity
      const d = typeof pts === 'string' ? pts : K.d(pts);
      const cap = o.cap || 'round';
      const u = X.svg('path', { d, fill: 'none', 'stroke-width': w + (o.uw ?? 2.8), 'stroke-linecap': cap, 'stroke-linejoin': 'round', opacity: o.uo ?? 0.55 }, gi);
      const c = X.svg('path', { d, fill: 'none', 'stroke-width': w, 'stroke-linecap': cap, 'stroke-linejoin': 'round' }, gi);
      if (o.nonScaling) { u.setAttribute('vector-effect', 'non-scaling-stroke'); c.setAttribute('vector-effect', 'non-scaling-stroke'); }
      u.style.stroke = C[kind + 'U']; c.style.stroke = C[kind];
      Object.assign(g, { inner: gi, paths: [u, c], core: c, under: u, L: c.getTotalLength(), kind, w, uw: o.uw ?? 2.8, minSW: o.minScreenW || 0, recs: [], tints: [], widths: [], dots: [], initial: o.visible ? 'full' : 'none', _k: '' });
      if (typeof pts !== 'string') g.pts = pts;
      if (o.steps) K.steps(g, o.steps === true ? {} : o.steps);
      strokes.push(g);
      return g;
    };
    /** Footstep stipple: dots alternating left/right of the stroke, revealed with its window. */
    K.steps = (g, o = {}) => {
      const pts = g.pts; if (!pts) return;
      const s = K.arclen(pts), nn = K.normals(pts), sp = o.spacing ?? 15, off = o.offset ?? 6.5, r = o.r ?? 1.4, rr = X.rand(o.seed || 9);
      const grp = X.svg('g', {}, g.inner);
      let k = 0;
      for (let d = sp * 0.5, i = 0; d < s[s.length - 1]; d += sp * (0.85 + rr() * 0.3), k++) {
        while (i < s.length - 2 && s[i + 1] < d) i++;
        const side = k % 2 ? 1 : -1, p = pts[i], n = nn[i];
        const el = X.svg('circle', { cx: (p[0] + n[0] * off * side + (rr() - 0.5) * 2).toFixed(1), cy: (p[1] + n[1] * off * side + (rr() - 0.5) * 2).toFixed(1), r: (r * (0.8 + rr() * 0.4)).toFixed(2) }, grp);
        el.style.fill = C[g.kind]; el.style.visibility = 'hidden'; el.style.opacity = o.opacity ?? 0.62;
        g.dots.push({ el, s: d, on: false });
      }
      g.dotGroup = grp;
    };
    K.anim = (g, t0, dur, mode = 'draw', o = {}) => { g.recs.push({ ...o, t0, dur: Math.max(dur, 1e-3), mode, ease: E(o.ease || (mode === 'comet' ? 'none' : 'power1.inOut')), trail: o.trail ?? 80 }); g.recs.sort((a, b) => a.t0 - b.t0); return g; };
    K.tint = (g, t0, dur, to) => { g.tints.push({ t0, dur, to }); g.tints.sort((a, b) => a.t0 - b.t0); return g; };
    K.width = (g, t0, dur, to) => { const from = g.widths.length ? g.widths[g.widths.length - 1].to : g.w; g.widths.push({ t0, dur, from, to }); return g; };   // call in time order
    function windowOf(g, t) {
      let rec = null;
      for (const r of g.recs) if (t >= r.t0) rec = r; else break;
      const L = g.L;
      if (!rec) return g.initial === 'full' ? [0, L, 1] : [0, 0, 1];
      const p = rec.ease(cl01((t - rec.t0) / rec.dur));
      switch (rec.mode) {
        case 'draw': return [0, p * L, 1];
        case 'undraw': return [0, (1 - p) * L, 1];
        case 'erase': return [p * L, L, 1];
        case 'collapse': return [p * L / 2, L - p * L / 2, 1];
        case 'expand': return [(1 - p) * L / 2, L - (1 - p) * L / 2, 1];
        case 'comet': return [Math.max(0, p * (L + rec.trail) - rec.trail), Math.min(L, p * (L + rec.trail)), 1];
        case 'show': return [0, L, 1];
        case 'hide': return [0, 0, 1];
        case 'fade': return [0, L, 1 - p];
        case 'dissolve': return [0, L, 1, p];
      }
      return [0, L, 1];
    }
    function colourOf(list, t, initial, key) {
      let cur = initial;
      for (const k of list) {
        if (t < k.t0) break;
        const p = E('power1.inOut')(cl01((t - k.t0) / Math.max(k.dur, 1e-3)));
        cur = p >= 1 ? { kind: k.to } : { from: cur.kind || cur.to, to: k.to, p };
      }
      return cur;
    }
    function updateStroke(g, t) {
      const [a, b, op, diss] = windowOf(g, t);
      const L = g.L;
      // colour
      let core = C[g.kind], under = C[g.kind + 'U'];
      if (g.tints.length) {
        const st = colourOf(g.tints, t, { kind: g.kind });
        if (st.p != null) { core = mix(C[st.from], C[st.to], st.p); under = mix(C[st.from + 'U'], C[st.to + 'U'], st.p); }
        else { core = C[st.kind]; under = C[st.kind + 'U']; }
      }
      let w = g.w;
      for (const k of g.widths) { if (t < k.t0) break; w = lerp(k.from, k.to, E('power1.inOut')(cl01((t - k.t0) / Math.max(k.dur, 1e-3)))); }
      let uwEff = w + g.uw;
      if (g.minSW && K.cam && K.cam.s * w < g.minSW) { const f = g.minSW / (K.cam.s * w); w *= f; uwEff *= f; }
      const vis = b - a > 0.3 && op > 0.002;
      let key;
      if (diss != null) {
        const dash = Math.max(0.4, lerp(L, 0.6, Math.min(1, diss * 1.6))), gap = lerp(0, 20, Math.min(1, diss * 1.4));
        key = `D${dash.toFixed(1)}|${gap.toFixed(1)}|${core}|${w}|${(1 - cl01((diss - 0.45) / 0.55)).toFixed(3)}`;
        if (key !== g._k) {
          const o = 1 - cl01((diss - 0.45) / 0.55);
          for (const p of g.paths) { p.style.visibility = o > 0.01 ? 'visible' : 'hidden'; p.style.strokeDasharray = `${dash.toFixed(2)} ${gap.toFixed(2)}`; p.style.strokeDashoffset = '0'; }
          g.inner.style.opacity = o;
        }
      } else {
        key = vis ? `${a.toFixed(1)}|${b.toFixed(1)}|${core}|${w.toFixed(2)}|${op.toFixed(3)}` : 'hidden';
        if (key !== g._k) {
          for (const p of g.paths) {
            if (!vis) { p.style.visibility = 'hidden'; continue; }
            p.style.visibility = 'visible';
            p.style.strokeDasharray = `${(b - a).toFixed(2)} ${(L * 2 + 20).toFixed(1)}`;
            p.style.strokeDashoffset = (-a).toFixed(2);
          }
          g.inner.style.opacity = op;
        }
      }
      if (key !== g._k) {
        g.core.style.stroke = core; g.under.style.stroke = under;
        g.core.setAttribute('stroke-width', w.toFixed(2)); g.under.setAttribute('stroke-width', uwEff.toFixed(2));
        g._k = key;
      }
      if (g.dots.length) {
        const dissOn = diss != null ? diss : 0;
        for (const d of g.dots) {
          const on = vis && d.s >= a && d.s <= b && (dissOn < 0.6);
          if (on !== d.on) { d.el.style.visibility = on ? 'visible' : 'hidden'; d.on = on; }
          if (on && d._c !== core) { d.el.style.fill = core; d._c = core; }
        }
      }
    }
    K.head = (g, t) => { const [a, b] = windowOf(g, t); return { a, b }; };
    /** Point on a stroke at arc length s, in the coordinates of `space` (an ancestor group, default the world). */
    K.pointOn = (g, s, space) => {
      const p = g.core.getPointAtLength(Math.max(0, Math.min(g.L, s)));
      const M = (space || K.world).getCTM().inverse().multiply(g.core.getCTM());
      return [M.a * p.x + M.c * p.y + M.e, M.b * p.x + M.d * p.y + M.f];
    };

    // ------------------------------------------------------------------ machine parts
    /** A ruled band: two parallel crisp lines `gap` apart following a polyline (the planner's paved path). */
    K.ruled = (parent, pts, o = {}) => {
      const gap = o.gap ?? 24;
      // mitre-correct offsets for straight polylines
      const offPoly = (k) => pts.map((p, i) => {
        const a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
        if (i === 0 || i === pts.length - 1) { const q = i === 0 ? pts[1] : pts[i - 1]; const dx = (i === 0 ? q[0] - p[0] : p[0] - q[0]), dy = (i === 0 ? q[1] - p[1] : p[1] - q[1]), L = Math.hypot(dx, dy); return [p[0] - dy / L * k, p[1] + dx / L * k]; }
        const d1 = [p[0] - a[0], p[1] - a[1]], d2 = [b[0] - p[0], b[1] - p[1]], l1 = Math.hypot(...d1), l2 = Math.hypot(...d2);
        const n1 = [-d1[1] / l1, d1[0] / l1], n2 = [-d2[1] / l2, d2[0] / l2], m = [n1[0] + n2[0], n1[1] + n2[1]], ml = Math.hypot(...m);
        const cos = (m[0] * n1[0] + m[1] * n1[1]) / ml;
        return [p[0] + m[0] / ml * k / cos, p[1] + m[1] / ml * k / cos];
      });
      const g = X.svg('g', {}, parent);
      const kind = o.kind || 'blue';
      const A = K.stroke(g, K.cl.poly(offPoly(-gap / 2), 3), { kind, w: o.w ?? 1.7, uw: o.uw ?? 2.2, uo: 0.5, cap: 'butt', minScreenW: o.minScreenW });
      const B = K.stroke(g, K.cl.poly(offPoly(gap / 2), 3), { kind, w: o.w ?? 1.7, uw: o.uw ?? 2.2, uo: 0.5, cap: 'butt', minScreenW: o.minScreenW });
      const mid = K.stroke(g, K.cl.poly(pts, 3), { kind, w: 0.01, uw: 0, uo: 0 });   // invisible centreline (for scan heads)
      Object.assign(g, { lines: [A, B], mid });
      return g;
    };
    K.ruledAnim = (band, t0, dur, mode = 'draw', o = {}) => { band.lines.forEach((s) => K.anim(s, t0, dur, mode, { ease: o.ease || 'power2.inOut' })); return band; };
    K.crosshair = (parent, x, y, t, o = {}) => {
      const g = X.svg('g', { transform: `translate(${x} ${y})` }, parent), s = o.size ?? 9, col = C[o.kind || 'blue'];
      X.svg('path', { d: `M${-s},0H${s}M0,${-s}V${s}`, stroke: col, 'stroke-width': 1.4, fill: 'none' }, g);
      X.svg('circle', { r: 2.2, fill: col }, g);
      gsap.set(g, { opacity: 0 });
      X.tl.fromTo(g, { opacity: 0, scale: 2.2, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: 0.18, ease: 'back.out(2.5)', immediateRender: false }, t);
      if (o.out != null) X.tl.set(g, { opacity: 0 }, o.out);
      return g;
    };
    K.angleMark = (parent, x, y, t, o = {}) => {   // small right-angle square in the corner (x,y), facing (dx,dy)
      const s = o.size ?? 16, dx = o.dx ?? 1, dy = o.dy ?? -1;
      const g = K.stroke(parent, K.cl.poly([[x + dx * s, y], [x + dx * s, y + dy * s], [x, y + dy * s]], 2), { kind: o.kind || 'blue', w: 1.4, uw: 1.6 });
      K.anim(g, t, 0.16, 'draw', { ease: 'power2.out' });
      return g;
    };

    // ------------------------------------------------------------------ labels (mono, letter-spaced, typed 1 char / frame)
    K.label = (parent, text, x, y, t, o = {}) => {
      const size = o.size ?? 22;
      const el = X.svg('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-family': 'Roboto Mono', 'font-weight': o.weight ?? 500, 'font-size': size, 'letter-spacing': o.ls ?? (size * 0.24).toFixed(1), 'dominant-baseline': 'middle' }, parent);
      el.style.fill = o.color || C.label;
      X.typeOn(el, text, t, o.cps ?? 30);
      if (o.out != null) X.tl.set(el, { opacity: 0 }, o.out);
      if (o.sfx !== false) X.sfx(t, 'type', { dur: Math.min(0.5, text.length / (o.cps ?? 30)), gain: o.gain ?? 0.07 });
      return el;
    };
    /** Static mono text whose content is set per frame by a function (counters, live readouts). */
    K.liveText = (parent, x, y, fn, o = {}) => {
      const size = o.size ?? 22;
      const el = X.svg('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-family': o.family || 'Roboto Mono', 'font-weight': o.weight ?? 500, 'font-size': size, 'letter-spacing': o.ls ?? (size * 0.12).toFixed(1), 'dominant-baseline': 'middle' }, parent);
      el.style.fill = o.color || C.label;
      let last = null;
      K.every((t) => { const v = fn(t); if (v !== last) { el.textContent = v ?? ''; last = v; } });
      return el;
    };

    // ------------------------------------------------------------------ marks
    K.brackets = (parent, cx, cy, w, h, t, o = {}) => {
      const g = X.svg('g', { transform: `translate(${cx} ${cy})` }, parent), a = o.arm ?? 12, col = o.color || C.labelAmber;
      const inner = X.svg('g', {}, g);
      for (const [sx, sy] of [[-1, -1], [1, -1], [1, 1], [-1, 1]]) {
        const x = sx * w / 2, y = sy * h / 2;
        X.svg('path', { d: `M${x},${y - sy * a}V${y}H${x - sx * a}`, stroke: col, 'stroke-width': o.sw ?? 2, fill: 'none' }, inner);
      }
      gsap.set(inner, { opacity: 0 });
      X.tl.fromTo(inner, { opacity: 0, scale: o.from ?? 1.9, svgOrigin: '0 0' }, { opacity: 1, scale: 1, duration: 0.2, ease: 'back.out(2)', immediateRender: false }, t);
      if (o.out != null) X.tl.to(inner, { opacity: 0, duration: 0.12 }, o.out);
      if (o.sfx !== false) X.sfx(t, 'click', { gain: 0.22 });
      g.inner = inner;
      return g;
    };
    /** Deviation ticks: lines from a straight reference to the drawn path, amplified ×amp (like DEVIATION ×4). */
    K.ticks = (parent, ref, act, t, o = {}) => {
      const g = X.svg('g', {}, parent), amp = o.amp ?? 3, n = Math.min(ref.length, act.length), every = o.every ?? 6, out = [];
      for (let i = o.from ?? 0, k = 0; i < (o.to ?? n); i += every, k++) {
        const r = ref[i], a = act[i];
        const e = [r[0] + (a[0] - r[0]) * amp, r[1] + (a[1] - r[1]) * amp];
        if (Math.hypot(e[0] - r[0], e[1] - r[1]) < 3) continue;
        const s = K.stroke(g, [r, e], { kind: o.kind || 'amber', w: 1.2, uw: 1.4, uo: 0.45, cap: 'butt' });
        K.anim(s, t + k * (o.stagger ?? 0.012), 0.12, 'draw', { ease: 'power2.out' });
        if (o.out != null) K.anim(s, o.out, 0.1, 'hide');
        out.push(s);
      }
      return out;
    };
    K.ring = (parent, x, y, t, o = {}) => {
      const c = X.svg('circle', { cx: x, cy: y, r: o.r0 ?? 8, fill: 'none', 'stroke-width': o.sw ?? 1.6 }, parent);
      c.style.stroke = o.color || C.amber; gsap.set(c, { opacity: 0 });
      X.tl.fromTo(c, { attr: { r: o.r0 ?? 8 }, opacity: o.op ?? 0.9 }, { attr: { r: o.r1 ?? 70 }, opacity: 0, duration: o.dur ?? 0.7, ease: 'power2.out', immediateRender: false }, t);
      return c;
    };
    let flareN = 0;
    K.flare = (parent, x, y, t, o = {}) => {
      const id = 'flr' + flareN++, col = o.color || C.amberU, w = o.w ?? 900;
      X.linear(id, [[0, col, 0], [0.5, o.core || '#fff4dc', 0.95], [1, col, 0]], 0, 0, 1, 0);
      const g = X.svg('g', { transform: `translate(${x} ${y})` }, parent);
      const wide = X.svg('rect', { x: -w / 2, y: -7, width: w, height: 14, fill: `url(#${id})`, opacity: 0.22 }, g);
      const thin = X.svg('rect', { x: -w / 2, y: -1.4, width: w, height: 2.8, fill: `url(#${id})` }, g);
      const dot = X.svg('circle', { r: o.r ?? 5, fill: o.core || '#fff4dc' }, g);
      gsap.set(g, { opacity: 0 });
      X.tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: 0.08, immediateRender: false }, t);
      X.tl.fromTo([wide, thin], { scaleX: 0.15, svgOrigin: '0 0' }, { scaleX: 1, duration: 0.35, ease: 'expo.out', immediateRender: false }, t);
      X.tl.to(g, { opacity: 0, duration: o.fade ?? 0.7, ease: 'power2.in' }, t + (o.hold ?? 0.45));
      void dot;
      if (o.ring !== false) K.ring(parent, x, y, t, { r0: 10, r1: o.ringR ?? 66, color: col, dur: 0.8 });
      if (o.sfx !== false) X.sfx(t, 'chime', { gain: o.gain ?? 0.28, pitch: o.pitch ?? 1 });
      return g;
    };

    // ------------------------------------------------------------------ head-and-shoulders line figure
    /** Bust: wobbly head circle (centre cx,cy, radius r) + neck + sloping shoulders + arms, as three strokes. */
    K.bust = (parent, cx, cy, o = {}) => {
      const r = o.r ?? 58, kind = o.kind || 'amber', k = r / 58, seed = o.seed || 21, w = o.w ?? 2.3;
      const g = X.svg('g', {}, parent);
      const head = K.stroke(g, K.hand(K.cl.circle(cx, cy, r, o.start ?? -2.3, o.turns ?? 1.05, 3), { wob: 1.5 * k, trem: 0.75, seed }), { kind, w, minScreenW: o.minScreenW });
      const side = (m) => {
        const P = (x, y) => [cx + m * x * k, cy + y * k];
        const pts = [...K.cl.line(P(23, 56), P(23, 118), 3), ...K.cl.bez(P(23, 118), P(23, 170), P(134, 156), P(146, 232), 40).slice(1), ...K.cl.line(P(146, 232), P(154, 420), 3).slice(1)];
        return K.stroke(g, K.hand(pts, { wob: 1.1 * k, trem: 0.7, seed: seed + 3 + m }), { kind, w, minScreenW: o.minScreenW });
      };
      const L = side(-1), R = side(1);
      Object.assign(g, { head, L, R, cx, cy, r, parts: [head, L, R] });
      return g;
    };
    /** Pen draws the head, then neck + shoulders grow down both sides at once (source: 0.7 s + 0.6 s). */
    K.bustDraw = (b, t, o = {}) => {
      const hd = o.headDur ?? 0.7, bd = o.bodyDur ?? 0.6;
      if (o.pen !== false) K.penDraw(b.head, t, hd, { enter: o.enter ?? 0.4, exit: o.exit ?? 0.5 }); else K.anim(b.head, t, hd, 'draw');
      K.anim(b.L, t + hd + 0.04, bd, 'draw', { ease: 'power1.inOut' }); K.anim(b.R, t + hd + 0.04, bd, 'draw', { ease: 'power1.inOut' });
      return b;
    };
    K.bustAnim = (b, t, dur, mode, o = {}) => { b.parts.forEach((s) => K.anim(s, t, dur, mode, o)); return b; };

    // ------------------------------------------------------------------ the pen (outline stylus with a spark at the nib)
    const penSegs = [];
    K.penAngle = opt.penAngle ?? -58;                       // degrees: axis from nib toward the cap (up-right)
    K.makePen = (parent) => {
      const g = X.svg('g', {}, parent), body = X.svg('g', {}, g);
      const L = opt.penLength ?? 372, w = 11;
      const col = '#d9d3d7';
      const shape = { stroke: col, 'stroke-width': 1.7, fill: 'rgba(12,14,15,0.92)', 'stroke-linejoin': 'round' };
      // drawn along +x (nib at origin), rotated to the pen angle
      X.svg('path', { d: `M0,0 L30,${-w * 0.55} L30,${w * 0.55} Z`, ...shape }, body);
      X.svg('path', { d: `M30,${-w} H${L - 26} L${L},${-w * 0.6} V${w * 0.6} L${L - 26},${w} H30 Z`, ...shape }, body);
      X.svg('path', { d: `M44,${-w}V${w}M${L - 26},${-w}V${w}M30,${-w * 0.25}H${L - 40}`, stroke: col, 'stroke-width': 1.1, fill: 'none', opacity: 0.8 }, body);
      const spark = X.svg('g', {}, g);
      X.svg('circle', { r: 13, fill: '#fff6e6', opacity: 0.18 }, spark);
      X.svg('circle', { r: 4.2, fill: '#ffffff' }, spark);
      X.svg('path', { d: 'M-11,0H11M0,-11V11', stroke: '#fff', 'stroke-width': 1.2, opacity: 0.85 }, spark);
      Object.assign(g, { body, spark });
      g.style.visibility = 'hidden';
      return g;
    };
    /** Draw `g` with the pen riding the head. enter/exit: seconds of approach / lift-off along the pen axis. */
    K.penDraw = (g, t0, dur, o = {}) => {
      K.anim(g, t0, dur, 'draw', { ease: o.ease || 'sine.inOut' });
      penSegs.push({ g, t0, dur, enter: o.enter ?? 0.45, exit: o.exit ?? 0.55, travel: o.travel ?? 520, spark: o.spark !== false });
      penSegs.sort((a, b) => a.t0 - b.t0);
      if (o.sfx !== false) X.sfx(t0, 'scribble', { dur, gain: o.gain ?? 0.16 });
      return g;
    };
    function updatePen(t) {
      const P = K.pen; if (!P) return;
      let seg = null, idx = -1;
      for (let i = 0; i < penSegs.length; i++) { const s = penSegs[i]; if (t >= s.t0 - s.enter && t <= s.t0 + s.dur + s.exit) { seg = s; idx = i; } }
      if (!seg) { if (P._vis !== false) { P.style.visibility = 'hidden'; P._vis = false; } return; }
      const ax = Math.cos(K.penAngle * Math.PI / 180), ay = Math.sin(K.penAngle * Math.PI / 180);
      const g = seg.g, L = g.L;
      const start = K.pointOn(g, 0, P.parentNode), end = K.pointOn(g, L, P.parentNode);
      let x, y, op = 1, sp = 0, rot = K.penAngle;
      if (t < seg.t0) {
        const q = cl01((t - (seg.t0 - seg.enter)) / seg.enter), e = E('power3.out')(q);
        const prev = idx > 0 ? penSegs[idx - 1] : null;
        if (prev && seg.t0 - (prev.t0 + prev.dur) < seg.enter + 0.05) {
          const pe = K.pointOn(prev.g, prev.g.L, P.parentNode);
          x = lerp(pe[0], start[0], E('power2.inOut')(q)); y = lerp(pe[1], start[1], E('power2.inOut')(q)) - Math.sin(q * Math.PI) * 26;
        } else { x = start[0] + ax * seg.travel * (1 - e); y = start[1] + ay * seg.travel * (1 - e); op = cl01(q * 2.2); }
      } else if (t <= seg.t0 + seg.dur) {
        const p = g.recs.find((r) => r.t0 === seg.t0 && r.mode === 'draw');
        const s = (p ? p.ease(cl01((t - seg.t0) / seg.dur)) : cl01((t - seg.t0) / seg.dur)) * L;
        [x, y] = K.pointOn(g, s, P.parentNode); sp = seg.spark ? 1 : 0;
        rot += 2.2 * Math.sin(t * 7.1) + 1.2 * Math.sin(t * 13.3);
      } else {
        const next = penSegs[idx + 1];
        const q = cl01((t - seg.t0 - seg.dur) / seg.exit), e = E('power2.in')(q);
        if (next && next.t0 - (seg.t0 + seg.dur) < next.enter + 0.05) { x = end[0]; y = end[1]; }
        else { x = end[0] + ax * seg.travel * e; y = end[1] + ay * seg.travel * e; op = 1 - cl01((q - 0.35) / 0.65); }
        sp = Math.max(0, 1 - q * 4);
      }
      if (P._vis !== true) { P.style.visibility = 'visible'; P._vis = true; }
      P.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
      P.body.setAttribute('transform', `rotate(${rot.toFixed(2)})`);
      P.style.opacity = op.toFixed(3);
      P.spark.style.opacity = sp.toFixed(3);
      P.spark.setAttribute('transform', `rotate(${(t * 140) % 90})`);
    }

    // ------------------------------------------------------------------ walkers: comet sparks along a path
    const walkers = [];
    K.walker = (parent, pts, t0, dur, o = {}) => {
      const kind = o.kind || 'amber';
      const tr = K.stroke(parent, pts, { kind, w: o.w ?? 1.8, uw: 2.2, uo: 0.5 });
      K.anim(tr, t0, dur, 'comet', { trail: o.trail ?? 70, ease: o.ease || 'none' });
      const head = X.svg('g', {}, parent);
      X.svg('circle', { r: (o.r ?? 3.6) * 3, fill: C[kind + 'U'], opacity: 0.25 }, head);
      X.svg('circle', { r: o.r ?? 3.6, fill: '#fffaf0' }, head);
      head.style.visibility = 'hidden';
      const w = { tr, head, t0, dur, ease: E(o.ease || 'none'), trail: o.trail ?? 70 };
      walkers.push(w);
      return w;
    };
    function updateWalkers(t) {
      for (const w of walkers) {
        const on = t >= w.t0 && t <= w.t0 + w.dur;
        if (!on) { if (w._on !== false) { w.head.style.visibility = 'hidden'; w._on = false; } continue; }
        const p = w.ease(cl01((t - w.t0) / w.dur));
        const s = Math.min(w.tr.L, p * (w.tr.L + w.trail));
        const [x, y] = K.pointOn(w.tr, s, w.head.parentNode);
        if (w._on !== true) { w.head.style.visibility = 'visible'; w._on = true; }
        w.head.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)})`);
        w.head.style.opacity = s >= w.tr.L ? Math.max(0, 1 - (p * (w.tr.L + w.trail) - w.tr.L) / w.trail) : 1;
      }
    }

    // ------------------------------------------------------------------ camera (log-zoom, pinned glide)
    const camKeys = [];
    let cam0 = { x: K.FOCUS.x, y: K.FOCUS.y, s: 1 };
    K.camStart = (st) => { cam0 = { ...cam0, ...st }; };
    K.camTo = (t0, dur, to, ease = 'power2.inOut') => { camKeys.push({ t0, dur: Math.max(dur, 1e-3), to, ease: E(ease) }); camKeys.sort((a, b) => a.t0 - b.t0); };
    const scr = (st, P) => [K.FOCUS.x + st.s * (P[0] - st.x), K.FOCUS.y + st.s * (P[1] - st.y)];
    function camAt(t) {
      let st = { ...cam0 };
      for (const k of camKeys) {
        if (t < k.t0) break;
        const from = k.from || st;
        const to = { x: k.to.x ?? from.x, y: k.to.y ?? from.y, s: k.to.s ?? from.s };
        const p = k.ease(cl01((t - k.t0) / k.dur));
        const s = Math.exp(lerp(Math.log(from.s), Math.log(to.s), p));
        const pin = k.to.pin || [to.x, to.y];
        const a = scr(from, pin), b = scr(to, pin), S = [lerp(a[0], b[0], p), lerp(a[1], b[1], p)];
        st = { x: pin[0] - (S[0] - K.FOCUS.x) / s, y: pin[1] - (S[1] - K.FOCUS.y) / s, s };
      }
      return st;
    }
    K.camAt = camAt;
    K.toScreen = (P, t) => scr(camAt(t), P);
    const blurs = [];
    K.camBlur = (t0, dur, std = 5) => blurs.push({ t0, dur, std });

    // ------------------------------------------------------------------ captions (karaoke, Poppins)
    let caps = [];
    K.captions = async (src = 'script.json', o = {}) => {
      let spec = src;
      if (typeof src === 'string') { try { spec = await (await fetch(src)).json(); } catch (e) { spec = { lines: [] }; } }
      const size = o.size ?? Math.round(W * 0.05), lh = Math.round(size * 1.28), cy = o.y ?? K.CAP_Y;
      const layer = X.html('div', { style: { position: 'absolute', left: '0', top: '0', width: W + 'px', height: H + 'px', pointerEvents: 'none', zIndex: 5 } });
      const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}']/gu, '');
      const list = [];
      for (const ln of spec.lines || []) {
        const vl = X.line(ln.id); if (!vl.words || !vl.words.length) continue;
        const chunks = ln.chunks || [vl.words.map((w) => w.w).join(' ')];
        const bold = (ln.bold || []).map((b) => { const [w, n] = b.split(':'); return { w: norm(w), n: +(n || 0) }; });
        const seen = {};
        let wi = 0;
        for (const ch of chunks) {
          const rows = ch.split('|').map((r) => r.trim().split(/\s+/).filter(Boolean));
          const ws = [];
          const div = X.html('div', { style: { position: 'absolute', left: '0', width: W + 'px', textAlign: 'center', fontFamily: 'Poppins', fontSize: size + 'px', lineHeight: lh + 'px', top: Math.round(cy - rows.length * lh / 2) + 'px', visibility: 'hidden', willChange: 'filter, opacity' } }, layer);
          rows.forEach((row) => {
            const rd = X.html('div', {}, div);
            row.forEach((word, j) => {
              const vw = vl.words[wi] || vl.words[vl.words.length - 1]; wi++;
              const key = norm(word); seen[key] = (seen[key] || 0);
              const isB = bold.some((b) => b.w === key && b.n === seen[key]); seen[key]++;
              const sp = X.html('span', { text: word, style: { fontWeight: isB ? '700' : '400', color: C.capOff, textShadow: '0 0 7px rgba(95,89,97,0.45)' } }, rd);
              if (j < row.length - 1) rd.appendChild(document.createTextNode(' '));
              ws.push({ sp, t: vw.start, b: isB, _s: -1 });
            });
          });
          list.push({ div, ws, tin: ws[0].t - 0.1 });
        }
      }
      list.forEach((c, i) => { c.tout = i + 1 < list.length ? list[i + 1].tin - 0.035 : (o.lastOut ?? X.vo.duration - 0.9); });
      caps = list;
      return layer;
    };
    function updateCaptions(t) {
      for (const c of caps) {
        const on = t >= c.tin && t < c.tout;
        if (!on) { if (c._on !== false) { c.div.style.visibility = 'hidden'; c._on = false; } continue; }
        if (c._on !== true) { c.div.style.visibility = 'visible'; c._on = true; }
        const pin = cl01((t - c.tin) / 0.1), pout = cl01((t - (c.tout - 0.1)) / 0.1);
        const op = Math.min(pin, 1 - pout), bl = pout > 0 ? 6 * pout : 8 * (1 - pin);
        const key = op.toFixed(2) + '|' + bl.toFixed(1);
        if (c._k !== key) { c.div.style.opacity = op; c.div.style.filter = bl > 0.05 ? `blur(${bl.toFixed(1)}px)` : 'none'; c._k = key; }
        for (const w of c.ws) {
          const s = cl01((t - (w.t - 0.03)) / 0.11), q = Math.round(s * 20) / 20;
          if (q === w._s) continue;
          w._s = q;
          w.sp.style.color = mix(C.capOff, C.capOn, q);
          w.sp.style.textShadow = w.b ? `0 0 ${(7 + 9 * q).toFixed(1)}px rgba(255,255,255,${(0.18 + 0.5 * q).toFixed(2)})` : `0 0 7px rgba(${q > 0.5 ? '255,255,255' : '95,89,97'},${(0.45 - 0.25 * q).toFixed(2)})`;
        }
      }
    }

    // ------------------------------------------------------------------ pill CTA
    const ICON = {
      plus: '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#151515" stroke-width="2.4" stroke-linecap="round"><circle cx="9" cy="8" r="3.6"/><path d="M2.5 20c.8-3.6 3.4-5.6 6.5-5.6s5.7 2 6.5 5.6"/><path d="M19 7v6M16 10h6"/></svg>',
      check: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#151515" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"><path class="ck" d="M4 12.5l5 5L20 6.5" stroke-dasharray="24" stroke-dashoffset="24"/></svg>',
      bubble: '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#151515" stroke-width="2.2" stroke-linejoin="round"><path d="M4 5h16v11H9l-5 4z"/></svg>',
    };
    K.ICON = ICON;
    let pill = null;
    K.pill = (o) => {
      const el = X.html('div', { style: { position: 'absolute', left: (W / 2) + 'px', top: (o.y ?? K.PILL_Y) + 'px', transform: 'translate(-50%,-50%)', zIndex: 6, visibility: 'hidden', pointerEvents: 'none' } });
      const box = X.html('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', height: '92px', padding: '0 46px', borderRadius: '46px', background: C.pill, color: C.pillInk, fontFamily: 'Poppins', fontWeight: '700', fontSize: '31px', letterSpacing: '0.045em', whiteSpace: 'nowrap', boxShadow: '0 0 46px rgba(255,255,255,0.26), 0 0 12px rgba(255,255,255,0.32)' } }, el);
      const set = (icon, text) => { box.innerHTML = (ICON[icon] || '') + `<span>${text}</span>`; };
      set(o.icon || 'plus', o.text);
      pill = { el, box, set, ...o, state: 1 };
      X.sfx(o.t, 'pop', { gain: 0.42 });
      if (o.tFlip != null) { X.sfx(o.tFlip, 'click', { gain: 0.3 }); X.sfx(o.tFlip + 0.12, 'blip_up', { gain: 0.18 }); }
      return el;
    };
    function updatePill(t) {
      if (!pill) return;
      const P = pill;
      if (t < P.t || (P.tOut != null && t > P.tOut + 0.3)) { if (P._v !== false) { P.el.style.visibility = 'hidden'; P._v = false; } return; }
      if (P._v !== true) { P.el.style.visibility = 'visible'; P._v = true; }
      const pin = E('expo.out')(cl01((t - P.t) / 0.2));
      let sc = lerp(1.45, 1, pin), op = lerp(0.3, 1, pin), bl = lerp(10, 0, pin), sy = 1;
      const state = P.tFlip != null && t >= P.tFlip + 0.1 ? 2 : 1;
      if (state !== P.state) { if (state === 2) P.set(P.icon2 || 'check', P.text2); else P.set(P.icon || 'plus', P.text); P.state = state; }
      if (P.tFlip != null) {
        if (t >= P.tFlip && t < P.tFlip + 0.1) sy = lerp(1, 0.05, E('power2.in')((t - P.tFlip) / 0.1));
        else if (t >= P.tFlip + 0.1 && t < P.tFlip + 0.24) sy = lerp(0.05, 1, E('back.out(1.7)')((t - P.tFlip - 0.1) / 0.14));
        const ck = P.box.querySelector('.ck');
        if (ck) ck.setAttribute('stroke-dashoffset', (24 * (1 - cl01((t - P.tFlip - 0.2) / 0.2))).toFixed(1));
      }
      if (P.tOut != null && t >= P.tOut) { const q = cl01((t - P.tOut) / 0.28); op *= 1 - q; bl = Math.max(bl, 9 * q); }
      P.el.style.transform = `translate(-50%,-50%) scale(${sc.toFixed(3)},${(sc * sy).toFixed(3)})`;
      P.el.style.opacity = op.toFixed(3);
      P.el.style.filter = bl > 0.05 ? `blur(${bl.toFixed(1)}px)` : 'none';
    }

    // ------------------------------------------------------------------ setup / finish
    K.setup = (o = {}) => {
      X.stage.style.background = C.ground;
      if (o.ground !== false) K.ground(o.groundOpts || {});
      K.htFilter = K.halftone('ht', o.halftone || {});
      K.art = X.svg('g', { id: 'art', filter: K.htFilter });
      K.world = X.svg('g', { id: 'world' }, K.art);
      K.hud = X.svg('g', { id: 'hud' }, K.art);
      // zoom smear filter for camera blurs
      const zf = X.svg('filter', { id: 'zsmear', x: '-20%', y: '-20%', width: '140%', height: '140%' }, X.defs);
      K._zb = X.svg('feGaussianBlur', { stdDeviation: 0 }, zf);
      return K;
    };
    K.finish = () => {
      if (!K.pen) K.pen = K.makePen(K.world);
      K.world.appendChild(K.pen);                       // pen draws above every stroke
      // camera keys: freeze each key's starting state from the keys before it
      for (let i = 0; i < camKeys.length; i++) { camKeys[i].from = null; }
      for (let i = 0; i < camKeys.length; i++) {
        const before = camKeys.slice(0, i); const save = camKeys.splice(i); const st = camAt(save[0].t0); camKeys.push(...save); camKeys[i].from = st; void before;
      }
      let lastBlur = -1;
      X.every((t) => {
        const st = camAt(t);
        K.world.setAttribute('transform', `translate(${(K.FOCUS.x - st.s * st.x).toFixed(2)} ${(K.FOCUS.y - st.s * st.y).toFixed(2)}) scale(${st.s.toFixed(5)})`);
        K.cam = st;
        let b = 0;
        for (const z of blurs) if (t >= z.t0 && t <= z.t0 + z.dur) b = Math.max(b, z.std * Math.sin(Math.PI * (t - z.t0) / z.dur));
        if (b > 0.05) { K._zb.setAttribute('stdDeviation', b.toFixed(2)); if (lastBlur <= 0.05) K.world.setAttribute('filter', 'url(#zsmear)'); }
        else if (lastBlur > 0.05) K.world.removeAttribute('filter');
        lastBlur = b;
        for (const g of strokes) updateStroke(g, t);
        updateWalkers(t);
        updatePen(t);
        for (const f of hooks) f(t);
        updateCaptions(t);
        updatePill(t);
      });
    };
    return K;
  };
})();
