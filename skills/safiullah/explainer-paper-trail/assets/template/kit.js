/* paper-trail kit — vertical (1080×1920) "satirical how-to" reel: every frame is a paper document on a pale grey desk,
 * numbered STEP cards slam in behind a red ink splat, bold-serif karaoke captions sit at ~69 % height with one red word,
 * red rubber stamps spatter ink, red handwriting annotates, a small "STEP n" tag rides top-right, an ink-blot wipe opens
 * the end poll card. Built for explainer-engine (window.X). Original work only.
 *
 *   PT.init(X, {grain})            layers: world (camera + desk) · plate (dark screen-space plates) · fx (cards, splats) · cap · hud
 *   PT.cam.to(t,{x,y,s,r},dur,ease) / PT.cam.set(t,{...})  camera in world coords (x,y = frame centre offset), plus PT.drift
 *   PT.doc(parent,{x,y,w,h,rot,paper,edge})  → {g, m (mover), body, shadow, w, h}   paper sheet with texture + soft shadow
 *   PT.drop(doc,t,{from})  document falls from the camera onto the desk (7 f, blur + shadow tighten) · PT.slide(doc,t,dir) · PT.out(doc,t,dir)
 *   PT.text / PT.lines / PT.rule / PT.hl / PT.hand / PT.scrawl / PT.stamp / PT.odometer / PT.chart / PT.tag / PT.seal
 *   PT.ghost(parent,{x,y,w,h,rot,seed,blur})   out-of-focus background document (pre-blurred canvas image)
 *   PT.stepCard(t,{n,label,exit,from})        red ink splat → STEP n card → torn rip exit
 *   PT.blot(t,{color,hold,x,y})              ink-blot cover + recede (black, before the poll)
 *   PT.captions(script,{dark})               karaoke caption system from script.json "cap" fields + data/vo.json word times
 *   PT.stepTag(t0,t1,text)                   small "STEP n" label top-right
 *   PT.poll(parent,t,{q,options,note,brand}) end poll card + wordmark
 */
(function () {
  const PT = (window.PT = {});
  PT.C = {
    deskTop: '#d6cfc1', desk: '#cdc7b8', deskBot: '#aba395', streak: '#e7e2d8',
    paper: '#eceae4', warm: '#ece7dd', cream: '#e9e2d3', parch: '#e3d7ba', slip: '#f1ede4',
    ink: '#1e1812', ink2: '#3b352d', grey: '#8f877a', bar: '#cbc5ba', rule: '#d2cbbf',
    red: '#c13c24', card: '#c73b1c', stamp: '#c43d24', numeral: '#f8efe4', halo: '#f3ece3',
    plate: '#25231f', plateHi: '#bdb8ad', green: '#3d5544', hl: '#e3cf47', gold: '#c9a54a', counter: '#1d1a16',
  };
  PT.F = {
    cap: "Lora, 'Libre Baskerville', serif", head: "'Archivo Black', 'Montserrat', sans-serif", serif: "'Libre Baskerville', Lora, serif",
    mono: "'Courier New', 'Roboto Mono', monospace", hand: "Caveat, 'Patrick Hand', cursive", ui: "Inter, 'Segoe UI', sans-serif",
  };
  let X, W, H;
  const S = (tag, a, p) => X.svg(tag, a, p);

  // ------------------------------------------------------------------ init / layers
  PT.init = (x, o = {}) => {
    X = x; W = X.W; H = X.H;
    PT.world = S('g', { id: 'pt-world' });
    PT.light = S('rect', { x: 0, y: 0, width: W, height: H, fill: X.linear('pt-light', [[0, '#fffaf0', 0.10], [0.55, '#fffaf0', 0], [1, '#2a2016', 0.20]]), 'pointer-events': 'none' });
    PT.plate = S('g', { id: 'pt-plate' });
    PT.fx = S('g', { id: 'pt-fx' });
    PT.capL = S('g', { id: 'pt-cap' });
    PT.hud = S('g', { id: 'pt-hud' });
    // filters
    const f = S('filter', { id: 'pt-sblur', x: '-40%', y: '-40%', width: '180%', height: '180%' }, X.defs);
    S('feGaussianBlur', { stdDeviation: 16 }, f);
    const f2 = S('filter', { id: 'pt-sblur2', x: '-40%', y: '-40%', width: '180%', height: '180%' }, X.defs);
    S('feGaussianBlur', { stdDeviation: 5 }, f2);
    const ink = S('filter', { id: 'pt-ink', x: '-10%', y: '-10%', width: '120%', height: '120%' }, X.defs);
    S('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.75, numOctaves: 2, seed: 4, result: 'n' }, ink);
    S('feColorMatrix', { in: 'n', type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.7 1.78', result: 'm' }, ink);
    S('feComposite', { in: 'SourceGraphic', in2: 'm', operator: 'in' }, ink);
    const cs = S('filter', { id: 'pt-capsh', x: '-10%', y: '-30%', width: '120%', height: '160%' }, X.defs);
    S('feDropShadow', { dx: 0, dy: 4, stdDeviation: 5, 'flood-color': '#1a140e', 'flood-opacity': 0.28 }, cs);
    PT.desk();
    PT.cam._apply();
    if (o.grain !== false) X.grain(o.grain ?? 0.045, 12);
    return PT;
  };

  // ------------------------------------------------------------------ desk (one big textured image inside the camera)
  PT.desk = () => {
    // tileable 1200² texture (streaks wrap around the tile edges) → pattern on one huge rect: the camera can roam anywhere
    const w = 1200, h = 1200, c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'), r = X.rand(11);
    g.fillStyle = PT.C.desk; g.fillRect(0, 0, w, h);
    for (let i = 0; i < 300; i++) {      // brushed-plaster streaks: thin, long, horizontal
      const y = r() * h, x = r() * w, L = 150 + r() * 800, th = 1 + r() * 3.5, light = r() < 0.68;
      g.globalAlpha = light ? 0.10 + r() * 0.22 : 0.05 + r() * 0.08;
      g.fillStyle = light ? PT.C.streak : '#958c7d';
      for (const ox of [-w, 0]) g.fillRect(x + ox, y, L, th);
    }
    g.globalAlpha = 1;
    const big = document.createElement('canvas'); big.width = 3 * w; big.height = 3 * h;   // wrap-around blur: 3×3 mosaic first,
    const gb = big.getContext('2d'); for (const ox of [0, w, 2 * w]) for (const oy of [0, h, 2 * h]) gb.drawImage(c, ox, oy);
    const c2 = document.createElement('canvas'); c2.width = w; c2.height = h;               // then ONE blurred draw (filters fade
    const g2 = c2.getContext('2d'); g2.filter = 'blur(1.4px)'; g2.drawImage(big, -w, -h); g2.filter = 'none';  // each draw's own edges)
    const img = g2.getImageData(0, 0, w, h);
    for (let i = 0; i < img.data.length; i += 4) { const n = (r() - 0.5) * 9; img.data[i] += n; img.data[i + 1] += n; img.data[i + 2] += n; }
    g2.putImageData(img, 0, 0);
    const href = c2.toDataURL('image/jpeg', 0.92);
    PT.deskImg = S('g', {}, PT.world);
    const [x0, x1, y0, y1] = PT.deskSpan || [-2400, 8400, -2400, 4400];
    for (let x = x0; x < x1; x += w) for (let y = y0; y < y1; y += h) S('image', { href, x: x - 1, y: y - 1, width: w + 2, height: h + 2 }, PT.deskImg);
  };
  /** Group whose children are authored in FRAME pixels and land in world space where the camera {x,y,s} will look. */
  PT.atCam = (parent, cam) => {
    const s = cam.s ?? 1, ax = W / 2 + (cam.x ?? 0) - W / (2 * s), ay = H / 2 + (cam.y ?? 0) - H / (2 * s);
    return S('g', { transform: `translate(${ax} ${ay}) scale(${1 / s})` }, parent);
  };

  // ------------------------------------------------------------------ camera (+ additive drift and stamp shake)
  const camS = { x: 0, y: 0, s: 1, r: 0 };
  const shakes = [], bumps = [];
  PT.drift = { on: true, amp: 14, push: 0.016 };
  PT.cam = {
    state: camS,
    to(t, v, dur = 0.8, ease = 'power2.inOut') { X.tl.to(camS, { ...v, duration: dur, ease }, t); return PT.cam; },
    set(t, v) { X.tl.set(camS, v, t); return PT.cam; },
    _apply() {
      X.every((t) => {
        let dx = 0, dy = 0, dr = 0, ds = 0;
        if (PT.drift.on) {      // slow handheld float — never a frozen frame
          const A = PT.drift.amp;      // two slow sines per axis + a breathing zoom: reads as a hand-held rostrum camera
          dx = Math.sin(t * 0.52) * A + Math.sin(t * 1.27 + 1.3) * A * 0.35;
          dy = Math.cos(t * 0.43 + 0.4) * A * 0.8 + Math.sin(t * 1.09) * A * 0.25;
          dr = Math.sin(t * 0.31 + 2.0) * 0.45;
          ds = Math.sin(t * 0.27 + 0.7) * PT.drift.push;
        }
        for (const k of shakes) {
          const u = t - k.t; if (u < 0 || u > k.dur) continue;
          const e = Math.exp(-u * 18) * k.amp;
          dx += Math.sin(u * 95) * e; dy += Math.cos(u * 77) * e * 0.8;
          if (k.zoom) ds += k.zoom * Math.exp(-u * 9);
        }
        for (const b of bumps) {     // quick re-frame, slow settle back
          const u = t - b.t; if (u < 0 || u > 2.2) continue;
          const e = u < 0.24 ? 1 - Math.pow(1 - u / 0.24, 3) : Math.exp(-(u - 0.24) * 2.2);
          dx += b.x * e; dy += b.y * e; ds += b.s * e;
        }
        const s = camS.s * (1 + ds), cx = W / 2, cy = H / 2;
        PT.world.setAttribute('transform', `translate(${cx} ${cy}) rotate(${camS.r + dr}) scale(${s}) translate(${-cx - camS.x + dx} ${-cy - camS.y + dy})`);
      });
    },
  };
  PT.shake = (t, amp = 7, dur = 0.3, zoom = 0) => shakes.push({ t, amp, dur: zoom ? Math.max(dur, 0.5) : dur, zoom });
  /** Re-frame bump: the camera jumps by (x, y, s) in 0.24 s and drifts back over ~2 s (one per caption line). */
  PT.bump = (t, x = 60, y = 40, s = 0.03) => bumps.push({ t, x, y, s });
  /** Punch-in: the camera jumps closer by `zoom` and eases back (stamps, slams). */
  PT.kick = (t, zoom = 0.035) => shakes.push({ t, amp: 0, dur: 0.5, zoom });

  // ------------------------------------------------------------------ paper patterns
  const pats = {};
  /** Seamless paper tile (periodic value noise: fibres + blotches) as a data URL. */
  PT.paperTile = (color, size = 512, strength = 0.05, seed = 5) => {
    const c = document.createElement('canvas'); c.width = c.height = size;
    const g = c.getContext('2d'); g.fillStyle = color; g.fillRect(0, 0, size, size);
    const img = g.getImageData(0, 0, size, size), r = X.rand(seed);
    const oct = [[16, 0.9], [64, 0.35]].map(([n, a]) => ({ n, a, v: Array.from({ length: n * n }, () => r()) }));
    const val = (o, x, y) => {      // periodic bilinear value noise
      const fx = x / size * o.n, fy = y / size * o.n, ix = Math.floor(fx), iy = Math.floor(fy), tx = fx - ix, ty = fy - iy;
      const at = (i, j) => o.v[((j % o.n) + o.n) % o.n * o.n + ((i % o.n) + o.n) % o.n];
      const sx = tx * tx * (3 - 2 * tx), sy = ty * ty * (3 - 2 * ty);
      return (at(ix, iy) * (1 - sx) + at(ix + 1, iy) * sx) * (1 - sy) + (at(ix, iy + 1) * (1 - sx) + at(ix + 1, iy + 1) * sx) * sy;
    };
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) {
      let n = (r() - 0.5) * 0.5; for (const o of oct) n += (val(o, x, y) - 0.5) * o.a;
      const i = (y * size + x) * 4, k = 1 + n * strength;
      img.data[i] *= k; img.data[i + 1] *= k; img.data[i + 2] *= k;
    }
    g.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  };
  PT.pat = (color, strength = 0.05) => {
    const k = color + strength;
    if (pats[k]) return pats[k];
    const id = 'pt-pat' + Object.keys(pats).length;
    const p = S('pattern', { id, patternUnits: 'userSpaceOnUse', width: 512, height: 512 }, X.defs);
    S('image', { href: PT.paperTile(color, 512, strength, 5 + Object.keys(pats).length), width: 512, height: 512 }, p);
    return (pats[k] = `url(#${id})`);
  };

  // ------------------------------------------------------------------ documents
  /** Paper sheet. edge: 'clean' | 'deckle' (soft torn) | 'torn'. Returns {g, m, body, shadow, w, h}. */
  PT.doc = (parent, o = {}) => {
    const w = o.w ?? 760, h = o.h ?? 900, seed = o.seed ?? Math.round((o.x ?? 0) + (o.y ?? 0));
    const g = S('g', { transform: `translate(${o.x ?? 0} ${o.y ?? 0}) rotate(${o.rot ?? 0} ${w / 2} ${h / 2})` }, parent);
    const shadow = S('rect', { x: 4, y: 10, width: w, height: h, fill: '#2b2015', opacity: o.shadowOp ?? 0.30, filter: 'url(#pt-sblur)' }, g);
    const m = S('g', {}, g);
    const shape = o.edge === 'torn' ? X.torn(w, h, 9, seed, 12) : o.edge === 'deckle' ? X.torn(w, h, 3.5, seed, 9) : null;
    const fill = o.fill || PT.pat(o.paper || PT.C.paper, o.tex ?? 0.045);
    if (shape) S('path', { d: shape, fill }, m);
    else S('rect', { width: w, height: h, fill, rx: o.rx ?? 2 }, m);
    if (o.border) S('rect', { x: o.border[0], y: o.border[0], width: w - 2 * o.border[0], height: h - 2 * o.border[0], fill: 'none', stroke: o.border[1], 'stroke-width': o.border[2] ?? 3 }, m);
    const body = S('g', {}, m);
    return { g, m, body, shadow, w, h };
  };
  /** Fall from the camera onto the desk: big, soft, see-through → lands sharp with a tight shadow. */
  PT.drop = (d, t, o = {}) => {
    const dur = o.dur ?? 0.24, c = `${d.w / 2} ${d.h / 2}`;
    const fr = { scale: 1.7, rotation: 9, x: 90, y: -140, opacity: 0, ...(o.from || {}) };
    X.tl.fromTo(d.m, { scale: fr.scale, rotation: fr.rotation, x: fr.x, y: fr.y, opacity: fr.opacity, svgOrigin: c, filter: 'blur(9px)' },
      { scale: 1, rotation: 0, x: 0, y: 0, opacity: 1, svgOrigin: c, filter: 'blur(0px)', duration: dur, ease: 'power2.in', immediateRender: true }, t);
    X.tl.set(d.m, { filter: 'none' }, t + dur + 0.01);
    X.tl.fromTo(d.shadow, { x: 70, y: 110, opacity: 0, scale: 1.25, svgOrigin: c }, { x: 0, y: 0, opacity: d.shadow.getAttribute('opacity'), scale: 1, svgOrigin: c, duration: dur, ease: 'power2.in', immediateRender: true }, t);
    X.tl.to(d.m, { x: o.settle ?? 5, duration: 0.25, ease: 'power2.out' }, t + dur);    // paper skids a hair on landing
    gsap.set(d.g, { opacity: 0 }); X.tl.set(d.g, { opacity: 1 }, t);
    if (o.sfx !== false) { X.sfx(t, 'paper', { dur: 0.22, gain: 0.35 }); X.sfx(t + dur, 'thud', { gain: 0.22, pitch: 1.2 }); }
    return t + dur;
  };
  /** Slide in from off-frame with motion blur (dir 'left'|'right'|'top'|'bottom'). */
  PT.slide = (d, t, dir = 'right', o = {}) => {
    const dur = o.dur ?? 0.3, D = o.dist ?? 1300;
    const v = { left: [-D, 0], right: [D, 0], top: [0, -D * 1.4], bottom: [0, D * 1.4] }[dir];
    X.tl.fromTo(d.m, { x: v[0], y: v[1], rotation: o.rot ?? (dir === 'left' ? -8 : 8), svgOrigin: `${d.w / 2} ${d.h / 2}`, filter: 'blur(10px)' },
      { x: 0, y: 0, rotation: 0, svgOrigin: `${d.w / 2} ${d.h / 2}`, filter: 'blur(0px)', duration: dur, ease: 'power3.out', immediateRender: true }, t);
    X.tl.set(d.m, { filter: 'none' }, t + dur);
    X.tl.fromTo(d.shadow, { x: v[0], y: v[1] }, { x: 0, y: 0, duration: dur, ease: 'power3.out', immediateRender: true }, t);
    gsap.set(d.g, { opacity: 0 }); X.tl.set(d.g, { opacity: 1 }, t);
    if (o.sfx !== false) X.sfx(t, 'swoosh', { dur: 0.3, gain: 0.3 });
    return t + dur;
  };
  /** Leave the frame (thrown off the desk). */
  PT.out = (d, t, dir = 'left', o = {}) => {
    const dur = o.dur ?? 0.26, D = o.dist ?? 1400;
    const v = { left: [-D, 60], right: [D, 60], top: [0, -D * 1.4], bottom: [0, D * 1.4], up: [0, -D * 1.4] }[dir];
    X.tl.to(d.g, { x: '+=' + v[0], y: '+=' + v[1], rotation: o.rot ?? (dir === 'left' ? -10 : 10), filter: 'blur(8px)', duration: dur, ease: 'power2.in' }, t);
    X.tl.set(d.g, { opacity: 0 }, t + dur);
    if (o.sfx !== false) X.sfx(t, 'swoosh', { dur: 0.28, gain: 0.25 });
  };

  // ------------------------------------------------------------------ typography on documents
  PT.text = (parent, str, x, y, o = {}) => {
    const fam = { serif: PT.F.serif, head: PT.F.head, mono: PT.F.mono, hand: PT.F.hand, ui: PT.F.ui, cap: PT.F.cap }[o.f || 'serif'];
    const el = S('text', { x, y, 'font-family': fam, 'font-size': o.size ?? 36, 'font-weight': o.weight ?? (o.f === 'mono' ? 700 : 400), fill: o.fill ?? PT.C.ink,
      'text-anchor': o.anchor ?? 'start', 'letter-spacing': o.ls ?? 0, 'font-style': o.italic ? 'italic' : 'normal', text: str }, parent);
    if (o.op != null) el.setAttribute('opacity', o.op);
    return el;
  };
  /** Grey placeholder text bars (body copy at reading distance). */
  PT.lines = (parent, x, y, w, n, o = {}) => {
    const r = X.rand(o.seed ?? 3), lh = o.lh ?? 30, th = o.th ?? 12, g = S('g', {}, parent);
    for (let i = 0; i < n; i++) {
      const L = i === n - 1 && o.last !== false ? w * (0.35 + r() * 0.3) : w * (0.82 + r() * 0.18);
      S('rect', { x, y: y + i * lh, width: L, height: th, rx: th / 2, fill: o.fill ?? PT.C.bar, opacity: o.op ?? 1 }, g);
    }
    return g;
  };
  PT.rule = (parent, x, y, w, o = {}) => S('rect', { x, y, width: w, height: o.th ?? 3, fill: o.fill ?? PT.C.ink }, parent);
  /** Yellow highlighter swipe behind a line (scaleX 0→1). */
  PT.hl = (parent, t, x, y, w, h, o = {}) => {
    const r = S('rect', { x, y, width: w, height: h, fill: o.fill ?? PT.C.hl, opacity: o.op ?? 0.85, style: { mixBlendMode: 'multiply' } }, parent);
    parent.insertBefore(r, parent.firstChild);
    gsap.set(r, { scaleX: 0, svgOrigin: `${x} ${y}` });
    X.tl.to(r, { scaleX: 1, duration: o.dur ?? 0.3, ease: 'power1.inOut' }, t);
    if (o.sfx !== false) X.sfx(t, 'scribble', { dur: 0.25, gain: 0.18 });
    return r;
  };
  /** Red handwriting revealed left→right. */
  PT.hand = (parent, t, str, x, y, o = {}) => {
    const g = S('g', { transform: `rotate(${o.rot ?? -4} ${x} ${y})` }, parent);
    const id = 'pt-hc' + Math.round(x * 7 + y * 13 + t * 100);
    const cp = S('clipPath', { id }, X.defs);
    const size = o.size ?? 64, est = str.length * size * 0.42 + 40;
    const rc = S('rect', { x: o.anchor === 'middle' ? x - est / 2 - 20 : x - 20, y: y - size * 1.2, width: est + 40, height: size * 1.8 }, cp);
    const tx = PT.text(g, str, x, y, { f: 'hand', size, weight: 700, fill: o.fill ?? PT.C.red, anchor: o.anchor });
    tx.setAttribute('clip-path', `url(#${id})`);
    gsap.set(rc, { scaleX: 0, svgOrigin: `${o.anchor === 'middle' ? x - est / 2 - 20 : x - 20} ${y}` });
    X.tl.to(rc, { scaleX: 1, duration: o.dur ?? Math.min(0.9, 0.06 * str.length + 0.15), ease: 'none' }, t);
    if (o.sfx !== false) X.sfx(t, 'scribble', { dur: 0.35, gain: 0.22 });
    return g;
  };
  /** Red marker stroke (circle, strike, arrow …) drawn on. */
  PT.scrawl = (parent, t, d, o = {}) => {
    const p = S('path', { d, fill: 'none', stroke: o.stroke ?? PT.C.red, 'stroke-width': o.w ?? 7, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: o.op ?? 0.92 }, parent);
    X.drawOn(p, t, o.dur ?? 0.35, o.ease ?? 'power1.inOut');
    if (o.sfx !== false) X.sfx(t, 'scribble', { dur: Math.max(0.2, o.dur ?? 0.35), gain: 0.2 });
    return p;
  };

  // ------------------------------------------------------------------ rubber stamp: 2-frame slam + ink spatter + shake
  PT.stamp = (parent, t, str, x, y, o = {}) => {
    const size = o.size ?? 78, g = S('g', { transform: `translate(${x} ${y}) rotate(${o.rot ?? -6})` }, parent);
    const inner = S('g', { filter: 'url(#pt-ink)' }, g);
    const lines = Array.isArray(str) ? str : [str];
    const lh = size * 1.05;
    let maxW = 0;
    const texts = lines.map((s, i) => {
      const el = S('text', { x: 0, y: (i - (lines.length - 1) / 2) * lh + size * 0.36, 'text-anchor': 'middle', 'font-family': PT.F.head,
        'font-size': i && o.sub ? size * 0.62 : size, 'letter-spacing': size * 0.02, fill: o.color ?? PT.C.stamp, text: s }, inner);
      maxW = Math.max(maxW, el.getComputedTextLength()); return el;
    });
    const pad = size * 0.32, bw = maxW + pad * 2, bh = lines.length * lh + pad * 0.9;
    if (o.box !== false) S('rect', { x: -bw / 2, y: -bh / 2, width: bw, height: bh, fill: 'none', stroke: o.color ?? PT.C.stamp, 'stroke-width': size * 0.075, rx: size * 0.06 }, inner);
    gsap.set(g, { opacity: 0 });
    X.tl.fromTo(inner, { scale: 1.55, opacity: 0, svgOrigin: '0 0' }, { scale: 1, opacity: o.op ?? 0.9, svgOrigin: '0 0', duration: 0.07, ease: 'power4.in', immediateRender: false }, t - 0.07);
    X.tl.set(g, { opacity: 1 }, t - 0.07);
    // spatter: droplets fly out and fall
    const r = X.rand(Math.round(x + y * 3 + t * 10)), n = o.drops ?? 11;
    for (let i = 0; i < n; i++) {
      const a = r() * Math.PI * 2, sp = 120 + r() * 260, rr = 3 + r() * 7;
      const dot = S('ellipse', { cx: 0, cy: 0, rx: rr, ry: rr * (0.7 + r() * 0.5), fill: o.color ?? PT.C.stamp, opacity: 0 }, g);
      const x0 = (r() - 0.5) * bw * 0.8, y0 = (r() - 0.5) * bh * 0.6;
      X.tl.set(dot, { attr: { cx: x0, cy: y0 }, opacity: 0.95 }, t);
      X.tl.to(dot, { attr: { cx: x0 + Math.cos(a) * sp * 0.55 }, duration: 0.55, ease: 'power1.out' }, t);
      X.tl.to(dot, { attr: { cy: y0 + Math.sin(a) * sp * 0.4 + 160 }, duration: 0.55, ease: 'power1.in' }, t);
      X.tl.to(dot, { opacity: 0, duration: 0.25 }, t + 0.32 + r() * 0.2);
    }
    if (o.shake !== false) PT.shake(t, o.shakeAmp ?? 8, 0.28, o.kick ?? 0.055);
    if (o.sfx !== false) X.sfx(t - 0.02, 'stamp', { gain: 0.5 });
    return g;
  };

  // ------------------------------------------------------------------ mechanical counter (dark plate, rolling digits)
  PT.odometer = (parent, x, y, o = {}) => {
    const n = o.digits ?? 8, cw = o.cw ?? 74, ch = o.ch ?? 112, size = o.size ?? 92, commaW = cw * 0.38;
    const groups = Math.floor((n - 1) / 3), prefixW = o.prefix ? cw * 0.9 : 0;
    const wTot = prefixW + n * cw + groups * commaW + 40;
    const g = S('g', { transform: `translate(${x} ${y})` }, parent);
    S('rect', { x: 0, y: 0, width: wTot, height: ch + 30, rx: 10, fill: PT.C.counter }, g);
    S('rect', { x: 6, y: 6, width: wTot - 12, height: 10, rx: 4, fill: '#3a352e', opacity: 0.6 }, g);
    let cx = 20;
    if (o.prefix) { PT.text(g, o.prefix, cx + cw * 0.45, 15 + ch * 0.76, { f: 'mono', size, fill: '#f4efe6', anchor: 'middle', weight: 700 }); cx += prefixW; }
    const id = 'pt-od' + Math.round(x + y);
    const cells = [];
    for (let i = n - 1; i >= 0; i--) {      // i = power of ten
      const cp = S('clipPath', { id: id + '_' + i }, X.defs);
      S('rect', { x: cx, y: 15, width: cw, height: ch }, cp);
      const col = S('g', { 'clip-path': `url(#${id}_${i})` }, g);
      const strip = S('g', {}, col);
      for (let k = 0; k <= 10; k++) PT.text(strip, String(k % 10), cx + cw / 2, 15 + ch * 0.78 + k * ch, { f: 'mono', size, fill: '#f4efe6', anchor: 'middle', weight: 700 });
      cells.push({ i, strip });
      cx += cw;
      if (i > 0 && i % 3 === 0) { PT.text(g, ',', cx + commaW * 0.3, 15 + ch * 0.8, { f: 'mono', size: size * 0.9, fill: '#f4efe6' }); cx += commaW; }
    }
    const val = { v: o.from ?? 0 };
    X.every(() => {
      const v = Math.max(0, val.v);
      for (const c of cells) {
        const p = 10 ** c.i, base = Math.floor(v / p) % 10, low = v % p;
        let pos = c.i === 0 ? v % 10 : base + Math.max(0, Math.min(1, (low - (p - 1)) / 1));
        if (v >= (o.to ?? Infinity) - 1e-6) pos = Math.floor(v / p) % 10;
        c.strip.setAttribute('transform', `translate(0 ${-pos * ch})`);
      }
    });
    return { g, w: wTot, h: ch + 30, val, run(t, to, dur = 1.6, ease = 'power2.out') { o.to = to; X.tl.to(val, { v: to, duration: dur, ease }, t); X.sfx(t, 'tick', { gain: 0.25 }); for (let k = 1; k < 8; k++) X.sfx(t + k * dur / 9, 'tick', { gain: 0.16 }); } };
  };

  // ------------------------------------------------------------------ line chart on graph paper (head dot + red tag follow the draw)
  PT.chart = (parent, o) => {
    const g = S('g', { transform: `translate(${o.x} ${o.y})` }, parent);
    const { w, h, vmin, vmax } = o, X0 = o.pad ?? 0;
    const px = (u) => X0 + u * (w - X0), py = (v) => h - (v - vmin) / (vmax - vmin) * h;
    for (const v of o.grid || []) {
      S('rect', { x: 0, y: py(v) - 1, width: w, height: 2, fill: PT.C.rule }, g);
      for (const gx of o.gridLabelX || [10]) PT.text(g, o.fmt(v), gx, py(v) - 12, { f: 'mono', size: 24, fill: PT.C.grey, weight: 400 });
    }
    S('rect', { x: 0, y: h + 2, width: w, height: 3, fill: PT.C.grey }, g);
    for (const [u, lab] of o.xlabels || []) { S('rect', { x: px(u) - 1, y: h + 2, width: 3, height: 16, fill: PT.C.grey }, g); PT.text(g, lab, px(u), h + 52, { f: 'mono', size: 26, anchor: 'middle', weight: 700, fill: PT.C.ink2 }); }
    const pts = o.data.map(([u, v]) => [px(u), py(v)]);
    // light hand jitter between data points
    const r = X.rand(o.seed ?? 5), d = [];
    pts.forEach((p, i) => {
      if (!i) { d.push(`M${p[0]},${p[1]}`); return; }
      const q = pts[i - 1], steps = Math.max(2, Math.round((p[0] - q[0]) / 18));
      for (let k = 1; k <= steps; k++) { const f = k / steps; d.push(`L${(q[0] + (p[0] - q[0]) * f).toFixed(1)},${(q[1] + (p[1] - q[1]) * f + (k < steps ? (r() - 0.5) * (o.jitter ?? 8) : 0)).toFixed(1)}`); }
    });
    const path = S('path', { d: d.join(''), fill: 'none', stroke: o.stroke ?? PT.C.ink, 'stroke-width': o.sw ?? 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const L = path.getTotalLength();
    path.setAttribute('stroke-dasharray', `${L} ${L + 20}`);
    const prog = { p: 0 };
    const dot = S('circle', { r: 13, fill: PT.C.red }, g);
    const tagG = S('g', {}, g);
    const tagR = S('rect', { x: 24, y: -62, width: 150, height: 52, fill: PT.C.red }, tagG);
    const tagT = PT.text(tagG, '', 99, -25, { f: 'mono', size: 30, weight: 700, fill: '#fbf3ea', anchor: 'middle' });
    const head = { x: 0, y: 0 };
    X.every(() => {
      const l = Math.max(0.001, prog.p) * L, pt = path.getPointAtLength(l);
      path.setAttribute('stroke-dashoffset', L - l);
      dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y);
      tagG.setAttribute('transform', `translate(${pt.x} ${pt.y})`);
      head.x = o.x + pt.x; head.y = o.y + pt.y;
      // value at the head (invert py)
      const v = vmin + (h - pt.y) / h * (vmax - vmin);
      tagT.textContent = (o.tagFmt || o.fmt)(v);
      const tw = tagT.getComputedTextLength(); tagR.setAttribute('width', tw + 34); tagT.setAttribute('x', 24 + (tw + 34) / 2);
      dot.setAttribute('opacity', prog.p > 0.001 ? 1 : 0); tagG.setAttribute('opacity', prog.p > 0.001 && !o.noTag ? 1 : 0);
    });
    return { g, path, L, prog, head, px, py, pts, draw(t, to, dur, ease = 'power1.inOut') { X.tl.to(prog, { p: to, duration: dur, ease }, t); X.sfx(t, 'scribble', { dur: Math.min(dur, 1.2), gain: 0.15 }); } };
  };

  // ------------------------------------------------------------------ small props
  /** Luggage/price tag on a string. */
  PT.tag = (parent, x, y, o = {}) => {
    const w = o.w ?? 300, h = o.h ?? 170, g = S('g', { transform: `translate(${x} ${y}) rotate(${o.rot ?? -8})` }, parent);
    S('path', { d: `M-140,-120 C-80,-60 -40,-30 0,${h / 2 - 6}`, fill: 'none', stroke: '#8a7d68', 'stroke-width': 3 }, g);
    const sh = S('path', { d: `M28,0 L${w},0 L${w},${h} L28,${h} L0,${h / 2} Z`, fill: '#2b2015', opacity: 0.28, filter: 'url(#pt-sblur2)', transform: 'translate(5 9)' }, g);
    S('path', { d: `M28,0 L${w},0 L${w},${h} L28,${h} L0,${h / 2} Z`, fill: PT.pat(o.paper || PT.C.parch, 0.06) }, g);
    S('circle', { cx: 34, cy: h / 2, r: 9, fill: PT.C.desk, stroke: '#a69882', 'stroke-width': 3 }, g);
    return { g, sh, w, h };
  };
  /** Red wax seal with a ribbon. */
  PT.seal = (parent, x, y, o = {}) => {
    const r = o.r ?? 74, g = S('g', { transform: `translate(${x} ${y})` }, parent);
    S('path', { d: `M-34,10 L-70,${r + 90} L-40,${r + 70} L-18,${r + 100} L0,20 Z`, fill: '#8d2a1a' }, g);
    S('path', { d: `M34,10 L70,${r + 86} L40,${r + 68} L20,${r + 98} L0,20 Z`, fill: '#a33420' }, g);
    const rr = X.rand(9), d = [];
    for (let i = 0; i < 28; i++) { const a = i / 28 * Math.PI * 2, k = r * (1 + (rr() - 0.5) * 0.12); d.push(`${i ? 'L' : 'M'}${(Math.cos(a) * k).toFixed(1)},${(Math.sin(a) * k).toFixed(1)}`); }
    S('path', { d: d.join('') + 'Z', fill: '#b5321f' }, g);
    S('circle', { r: r * 0.68, fill: 'none', stroke: '#7e2213', 'stroke-width': 4 }, g);
    S('circle', { r: r * 0.52, fill: 'none', stroke: '#d0604a', 'stroke-width': 2, opacity: 0.6 }, g);
    PT.text(g, o.letter ?? 'S', 0, r * 0.22, { f: 'serif', size: r * 0.62, weight: 700, fill: '#7e2213', anchor: 'middle', italic: true });
    S('ellipse', { cx: -r * 0.35, cy: -r * 0.4, rx: r * 0.25, ry: r * 0.12, fill: '#ffffff', opacity: 0.18, transform: 'rotate(-30)' }, g);
    return g;
  };
  /** Out-of-focus background document (canvas, pre-blurred): adds depth behind the hero sheet. */
  PT.ghost = (parent, o = {}) => {
    const w = o.w ?? 600, h = o.h ?? 760, pad = 40, c = document.createElement('canvas'); c.width = w + pad * 2; c.height = h + pad * 2;
    const g = c.getContext('2d'), r = X.rand(o.seed ?? 1);
    g.filter = `blur(${o.blur ?? 7}px)`;
    g.fillStyle = 'rgba(40,30,20,0.25)'; g.fillRect(pad + 6, pad + 12, w, h);
    g.fillStyle = o.paper || PT.C.paper; g.fillRect(pad, pad, w, h);
    g.fillStyle = PT.C.ink2; g.fillRect(pad + 50, pad + 60, w * (0.35 + r() * 0.3), 34);
    g.fillStyle = '#b9b2a6';
    for (let i = 0; i < 14; i++) g.fillRect(pad + 50, pad + 140 + i * 38, (w - 100) * (0.6 + r() * 0.4), 12);
    if (o.yellow) { g.fillStyle = 'rgba(227,207,71,0.7)'; g.fillRect(pad + 46, pad + 140 + 3 * 38 - 6, (w - 100) * 0.7, 24); }
    if (o.red) { g.strokeStyle = PT.C.stamp; g.lineWidth = 7; g.strokeRect(pad + w * 0.45, pad + h * 0.55, w * 0.42, 90); }
    return S('image', { href: c.toDataURL('image/png'), x: o.x - pad, y: o.y - pad, width: w + pad * 2, height: h + pad * 2, transform: `rotate(${o.rot ?? 0} ${o.x + w / 2} ${o.y + h / 2})`, opacity: o.op ?? 1 }, parent);
  };

  // ------------------------------------------------------------------ red ink splat → STEP card → torn rip
  function blobPath(seed, lobes = 9) {
    const r = X.rand(seed), d = [], N = 72, harm = [[3, r() * 6, 0.08], [5, r() * 6, 0.06], [8, r() * 6, 0.05], [13, r() * 6, 0.03]];
    const bumps = Array.from({ length: lobes }, () => [r() * Math.PI * 2, 0.12 + r() * 0.22, 0.08 + r() * 0.1]);
    for (let i = 0; i < N; i++) {
      const a = i / N * Math.PI * 2;
      let k = 0.86; for (const [f, ph, amp] of harm) k += Math.sin(a * f + ph) * amp;
      for (const [ba, bh, bw] of bumps) { const da = Math.atan2(Math.sin(a - ba), Math.cos(a - ba)); k += bh * Math.exp(-(da * da) / (bw * bw)); }
      d.push(`${i ? 'L' : 'M'}${(Math.cos(a) * k).toFixed(4)},${(Math.sin(a) * k).toFixed(4)}`);
    }
    return d.join('') + 'Z';
  }
  PT.blob = blobPath;
  /** Ink blot that covers the frame from (x,y): droplet 3 f before, 3–4 f growth with stepped soft rim. Returns cover time. */
  PT.splat = (parent, t, o = {}) => {
    const color = o.color ?? PT.C.card, r = X.rand(o.seed ?? Math.round(t * 100));
    const x = o.x ?? (r() < 0.5 ? 120 + r() * 260 : W - 120 - r() * 260), y = o.y ?? (200 + r() * (H - 600));
    const far = Math.hypot(Math.max(x, W - x), Math.max(y, H - y));
    const g = S('g', {}, parent);
    gsap.set(g, { autoAlpha: 0 }); X.tl.set(g, { autoAlpha: 1 }, t - 0.13);
    // droplet + satellites
    for (let i = 0; i < 4; i++) {
      const c = S('circle', { cx: x + (i ? (r() - 0.5) * 220 : 0), cy: y + (i ? (r() - 0.5) * 260 : 0), r: i ? 4 + r() * 9 : 16, fill: color }, g);
      gsap.set(c, { scale: 0, svgOrigin: `${c.getAttribute('cx')} ${c.getAttribute('cy')}` });
      X.tl.to(c, { scale: 1, duration: 0.04, ease: 'power2.out' }, t - 0.13 + i * 0.012);
    }
    const d = blobPath(o.seed ?? Math.round(t * 37) + 3);
    const rims = [[1.12, 0.22], [1.06, 0.45], [1, 1]].map(([k, op]) => S('path', { d, fill: color, opacity: op, transform: `translate(${x} ${y}) scale(0.01)` }, g));
    const s = { k: 0.01 };
    X.tl.fromTo(s, { k: 0.01 }, { k: far / 0.62, duration: o.dur ?? 0.12, ease: 'power2.in', immediateRender: false }, t - 0.1);
    X.every(() => { rims.forEach((p, i) => p.setAttribute('transform', `translate(${x} ${y}) scale(${(s.k * [1.12, 1.06, 1][i]).toFixed(2)})`)); });
    if (o.sfx !== false) { X.sfx(t - 0.13, 'drop', { gain: 0.25, pitch: 0.8 }); X.sfx(t - 0.06, 'stamp', { gain: 0.42, pitch: 0.7 }); }
    return { g, t: t + 0.02 };
  };
  /** Red STEP card: splat in, numeral fades in over 3 f, holds, then the sheet is ripped away upward. */
  PT.stepCard = (t, o = {}) => {
    const g = S('g', {}, PT.fx);
    gsap.set(g, { autoAlpha: 0 }); X.tl.set(g, { autoAlpha: 1 }, t - 0.14);
    const sp = PT.splat(g, t, { color: PT.C.card, seed: o.seed, x: o.x, y: o.y });
    const sheet = S('g', {}, g);
    gsap.set(sheet, { autoAlpha: 0 }); X.tl.set(sheet, { autoAlpha: 1 }, t);
    X.tl.set(sp.g, { autoAlpha: 0 }, t + 0.01);
    const tornD = (() => { const r = X.rand(o.seed ?? 21), p = [`M-40,-40`, `L${W + 40},-40`, `L${W + 40},${H}`]; for (let xx = W + 40; xx > -40; xx -= 22) p.push(`L${xx},${H + 18 + (r() - 0.5) * 36}`); p.push(`L-40,${H}`); return p.join('') + 'Z'; })();
    S('path', { d: tornD, fill: '#efe6d6', transform: 'translate(0 10)' }, sheet);   // white paper fibres along the tear
    S('path', { d: tornD, fill: PT.pat(PT.C.card, 0.035) }, sheet);
    const label = o.label ?? 'STEP';
    if (o.big) {        // "LAST / STEP": small label + huge word
      PT.text(sheet, o.small ?? 'LAST', 97, 640, { f: 'head', size: 96, fill: PT.C.numeral, ls: 7 });
      S('rect', { x: 97, y: 672, width: 330, height: 9, fill: PT.C.numeral }, sheet);
      const big = PT.text(sheet, label, W / 2, 1180, { f: 'head', size: 300, fill: PT.C.numeral, anchor: 'middle', ls: 4 });
      gsap.set(big, { opacity: 0 }); X.tl.to(big, { opacity: 1, duration: 0.1, ease: 'none' }, t + 0.04);
    } else {
      PT.text(sheet, label, 97, 522, { f: 'head', size: 96, fill: PT.C.numeral, ls: 7 });
      S('rect', { x: 97, y: 552, width: 330, height: 9, fill: PT.C.numeral }, sheet);
      const num = PT.text(sheet, String(o.n), 968, 1178, { f: 'head', size: 700, fill: PT.C.numeral, anchor: 'end' });
      gsap.set(num, { opacity: 0 }); X.tl.to(num, { opacity: 1, duration: 0.1, ease: 'none' }, t + 0.04);
    }
    if (o.exit != null) {
      X.tl.to(sheet, { y: -(H + 160), rotation: o.exitRot ?? -2.5, svgOrigin: `${W / 2} ${H}`, duration: 0.16, ease: 'power2.in' }, o.exit);
      X.tl.set(g, { autoAlpha: 0 }, o.exit + 0.17);
      X.sfx(o.exit, 'paper', { dur: 0.2, gain: 0.5 }); X.sfx(o.exit + 0.02, 'swoosh', { dur: 0.22, gain: 0.3 });
    }
    return g;
  };
  /** Ink blot cover then recede (reveals what is underneath) — used before the poll. */
  PT.blot = (t, o = {}) => {
    const g = S('g', {}, PT.fx);
    const sp = PT.splat(g, t, { color: o.color ?? '#1b1814', seed: o.seed ?? 77, x: o.x ?? W - 200, y: o.y ?? 420, sfx: o.sfx });
    const full = S('rect', { x: 0, y: 0, width: W, height: H, fill: o.color ?? '#1b1814' }, g);
    gsap.set(full, { autoAlpha: 0 }); X.tl.set(full, { autoAlpha: 1 }, t + 0.01);
    const hold = o.hold ?? 0.14;
    // recede: the full rect gives way to a shrinking blob anchored at the opposite corner
    const d = blobPath(o.seed2 ?? 91, 7), far = Math.hypot(W, H);
    const rims = [[1, 1], [1.05, 0.5], [1.1, 0.25]].map(([k, op]) => S('path', { d, fill: o.color ?? '#1b1814', opacity: op, transform: 'scale(0)' }, g));
    rims.forEach((p) => { gsap.set(p, { autoAlpha: 0 }); X.tl.set(p, { autoAlpha: 1 }, t + hold); });
    X.tl.set(full, { autoAlpha: 0 }, t + hold);
    X.tl.set(sp.g, { autoAlpha: 0 }, t + hold);
    const s = { k: far / 0.62 };
    X.tl.fromTo(s, { k: far / 0.62 }, { k: 0.01, duration: o.dur ?? 0.26, ease: 'power3.out', immediateRender: false }, t + hold);
    const cx = o.rx ?? 140, cy = o.ry ?? H - 260;
    X.every(() => rims.forEach((p, i) => p.setAttribute('transform', `translate(${cx} ${cy}) scale(${(s.k * [1, 1.05, 1.1][i]).toFixed(2)})`)));
    X.tl.set(g, { autoAlpha: 0 }, t + hold + (o.dur ?? 0.26) + 0.02);
    return g;
  };

  // ------------------------------------------------------------------ captions: bold serif, cream halo, word-by-word, one red word
  /** script: parsed script.json (lines with "cap"; *word* = red; token^n = covers n spoken words). */
  PT.captions = (script, o = {}) => {
    const size = o.size ?? 68, lh = o.lh ?? 86, maxW = o.maxW ?? 900, y0 = o.y ?? 1335, cx = W / 2;
    const meas = S('text', { x: -9999, y: -9999, 'font-family': PT.F.cap, 'font-size': size, 'font-weight': 700, 'letter-spacing': -1 }, PT.capL);
    const width = (s) => { meas.textContent = s; return meas.getComputedTextLength(); };
    const space = width('a b') - width('ab');
    const darkAt = (t) => (o.dark || []).some(([a, b]) => t >= a && t < b);
    const chunks = [];
    for (const ln of script.lines) {
      const vl = X.line(ln.id); if (!vl.words.length) continue;
      const toks = (ln.cap || ln.text).split(/\s+/).filter(Boolean);
      let red = false, wi = 0;
      const words = toks.map((tok) => {
        let n = 1; const m = tok.match(/\^(\d+)$/); if (m) { n = +m[1]; tok = tok.slice(0, -m[0].length); }
        const open = tok.startsWith('*'); if (open) { red = true; tok = tok.slice(1); }
        const isRed = red; if (tok.endsWith('*') || tok.replace(/[.,:;?!]+$/, '').endsWith('*')) { tok = tok.replace('*', ''); red = false; }
        const w = vl.words[Math.min(wi, vl.words.length - 1)]; wi += n;
        return { s: tok, red: isRed, t: w.start, w: width(tok) };
      });
      if (wi !== vl.words.length) console.warn(`captions: line ${ln.id} maps ${wi} tokens to ${vl.words.length} spoken words`);
      // break into rows; more than 2 rows → split the line into two chunks at the best punctuation
      const rowsOf = (ws) => { const rows = [[]]; let cur = 0; for (const w of ws) { const add = (rows.at(-1).length ? space : 0) + w.w; if (cur + add > maxW && rows.at(-1).length) { rows.push([w]); cur = w.w; } else { rows.at(-1).push(w); cur += add; } } return rows; };
      let parts = [words];
      if (rowsOf(words).length > 2) {
        let best = Math.floor(words.length / 2), bs = 1e9;
        words.forEach((w, i) => { if (i > 0 && i < words.length - 1 && /[.,:;?!]$/.test(w.s)) { const sc = Math.abs(i + 1 - words.length / 2); if (sc < bs) { bs = sc; best = i + 1; } } });
        parts = [words.slice(0, best), words.slice(best)];
      }
      for (const p of parts) chunks.push({ words: p, rows: rowsOf(p), t0: p[0].t, id: ln.id });
    }
    meas.remove();
    chunks.forEach((c, i) => {
      const next = chunks[i + 1];
      c.t1 = next ? next.t0 - 0.04 : (o.end ?? X.vo.duration);
      if (next && next.t0 - c.t0 > 0 && X.line(c.id).end + 1.2 < next.t0) c.t1 = Math.min(c.t1, X.line(c.id).end + (o.linger ?? 1.0));
      const dark = darkAt(c.t0 + 0.05);
      const g = S('g', { filter: 'url(#pt-capsh)' }, PT.capL);
      gsap.set(g, { autoAlpha: 0 }); X.tl.set(g, { autoAlpha: 1 }, c.t0 - 0.05);
      c.rows.forEach((row, ri) => {
        const rw = row.reduce((a, w) => a + w.w, 0) + space * (row.length - 1);
        let x = cx - rw / 2;
        for (const w of row) {
          const el = S('text', { x, y: y0 + ri * lh, 'font-family': PT.F.cap, 'font-size': size, 'font-weight': 700, 'letter-spacing': -1,
            fill: w.red ? PT.C.red : dark ? PT.C.halo : PT.C.ink, stroke: dark ? '#14110e' : PT.C.halo, 'stroke-width': 10, 'stroke-linejoin': 'round', 'paint-order': 'stroke', text: w.s }, g);
          gsap.set(el, { opacity: 0 });
          X.tl.to(el, { opacity: 1, duration: 0.12, ease: 'power1.out' }, Math.max(c.t0 - 0.05, w.t - 0.04));
          x += w.w + space;
        }
      });
      X.tl.to(g, { opacity: 0, y: -10, duration: 0.09, ease: 'power1.in' }, c.t1 - 0.09);
      X.tl.set(g, { autoAlpha: 0 }, c.t1);
    });
    return chunks;
  };

  // ------------------------------------------------------------------ HUD: small "STEP n" tag top-right
  PT.stepTag = (t0, t1, str, o = {}) => {
    const el = S('text', { x: o.x ?? 990, y: o.y ?? 318, 'text-anchor': 'end', 'font-family': PT.F.ui, 'font-weight': 800, 'font-size': o.size ?? 32, 'letter-spacing': 0.5,
      fill: o.dark ? PT.C.halo : PT.C.ink, stroke: o.dark ? '#14110e' : PT.C.halo, 'stroke-width': 7, 'paint-order': 'stroke', 'stroke-linejoin': 'round', text: str }, PT.hud);
    gsap.set(el, { autoAlpha: 0 }); X.tl.set(el, { autoAlpha: 1 }, t0); X.tl.set(el, { autoAlpha: 0 }, t1);
    return el;
  };

  // ------------------------------------------------------------------ document templates (fill body; all return PT.doc objects)
  PT.docs = {
    /** Share certificate: guilloche-ish oval, double green border. */
    cert(parent, o = {}) {
      const d = PT.doc(parent, { w: 640, h: 420, paper: '#d3dbbd', border: [16, PT.C.green, 7], ...o });
      const b = d.body, w = d.w, h = d.h, col = o.ink ?? PT.C.green;
      S('rect', { x: 30, y: 30, width: w - 60, height: h - 60, fill: 'none', stroke: col, 'stroke-width': 2 }, b);
      for (let i = 0; i < 9; i++) S('ellipse', { cx: w / 2, cy: h * 0.42, rx: w * 0.33 + Math.sin(i * 1.7) * 10, ry: 56 + Math.cos(i * 1.3) * 8, fill: 'none', stroke: col, 'stroke-width': 1.2, opacity: 0.45, transform: `rotate(${(i - 4) * 1.4} ${w / 2} ${h * 0.42})` }, b);
      const tt = PT.text(b, o.title ?? 'SOUTH SEA STOCK', w / 2, h * 0.42 + 16, { f: 'head', size: o.tsize ?? 46, fill: col, anchor: 'middle', ls: 3 });
      const tl0 = tt.getComputedTextLength(); if (tl0 > w - 130) tt.setAttribute('font-size', (o.tsize ?? 46) * (w - 130) / tl0);
      PT.text(b, o.sub ?? 'One hundred pounds', w / 2, h * 0.66, { f: 'serif', size: 30, weight: 700, fill: PT.C.ink2, anchor: 'middle' });
      PT.text(b, o.sub2 ?? 'capital stock of the Company', w / 2, h * 0.76, { f: 'serif', size: 22, italic: true, fill: PT.C.grey, anchor: 'middle' });
      return d;
    },
    /** Act of Parliament page: regnal-year slug, AN ACT, italic title, body bars, footer. */
    act(parent, o = {}) {
      const d = PT.doc(parent, { w: 840, h: 1000, paper: PT.C.parch, edge: 'deckle', tex: 0.06, ...o });
      const b = d.body, w = d.w;
      PT.text(b, o.slug ?? 'ANNO SEXTO GEORGII REGIS', w / 2, 90, { f: 'mono', size: 24, anchor: 'middle', ls: 5, fill: PT.C.ink2 });
      PT.rule(b, 70, 118, w - 140, { th: 2 });
      PT.text(b, 'AN ACT', w / 2, 250, { f: 'head', size: 112, anchor: 'middle', ls: 6 });
      (o.title || []).forEach((s, i) => PT.text(b, s, w / 2, 330 + i * 46, { f: 'serif', size: 34, italic: true, anchor: 'middle', fill: PT.C.ink2 }));
      PT.lines(b, 80, 330 + (o.title || []).length * 46 + 50, w - 160, o.n ?? 10, { seed: o.seed ?? 4, lh: 34 });
      if (o.foot) PT.text(b, o.foot, 80, d.h - 50, { f: 'mono', size: 19, fill: PT.C.grey, ls: 1 });
      return d;
    },
    /** Coffee-house handbill with a double rule border. */
    notice(parent, o = {}) {
      const d = PT.doc(parent, { w: 420, h: 520, paper: PT.C.cream, border: [14, PT.C.ink2, 3], ...o });
      const b = d.body, w = d.w;
      S('rect', { x: 24, y: 24, width: w - 48, height: d.h - 48, fill: 'none', stroke: PT.C.ink2, 'stroke-width': 1.5 }, b);
      (o.head || ['SUBSCRIPTIONS']).forEach((s, i) => PT.text(b, s, w / 2, 92 + i * 40, { f: 'mono', size: 24, anchor: 'middle', ls: 3, fill: PT.C.ink2 }));
      (o.title || []).forEach((s, i) => PT.text(b, s, w / 2, 210 + i * 54, { f: 'serif', size: 44, weight: 700, anchor: 'middle' }));
      PT.lines(b, 60, 340, w - 120, 4, { seed: o.seed ?? 8, lh: 30, th: 10 });
      if (o.foot) PT.text(b, o.foot, w / 2, d.h - 54, { f: 'serif', size: 24, italic: true, anchor: 'middle', fill: PT.C.ink2 });
      return d;
    },
    /** Newspaper column: masthead, dateline, headline, two columns of bars. */
    news(parent, o = {}) {
      const d = PT.doc(parent, { w: 860, h: 1000, paper: '#e7e2d6', tex: 0.07, ...o });
      const b = d.body, w = d.w;
      const mt = PT.text(b, o.mast ?? 'THE COURANT', w / 2, 110, { f: 'serif', size: 60, weight: 700, anchor: 'middle' });
      const ml = mt.getComputedTextLength(); if (ml > w - 90) mt.setAttribute('font-size', 60 * (w - 90) / ml);
      PT.rule(b, 50, 140, w - 100, { th: 4 }); PT.rule(b, 50, 150, w - 100, { th: 1.5 });
      PT.text(b, o.date ?? 'LONDON', w / 2, 188, { f: 'mono', size: 22, anchor: 'middle', ls: 4, fill: PT.C.ink2 });
      PT.rule(b, 50, 206, w - 100, { th: 1.5 });
      (o.head || []).forEach((s, i) => PT.text(b, s, 60, 300 + i * 78, { f: 'head', size: 66, ls: 1 }));
      const y = 300 + (o.head || []).length * 78;
      PT.lines(b, 60, y, (w - 150) / 2, 16, { seed: 31, lh: 30, th: 10, last: false });
      PT.lines(b, 60 + (w - 150) / 2 + 30, y, (w - 150) / 2, 9, { seed: 32, lh: 30, th: 10 });
      return d;
    },
  };

  // ------------------------------------------------------------------ end poll card + wordmark
  PT.poll = (parent, t, o = {}) => {
    const x = o.x ?? 60, y = o.y ?? 384, w = W - 2 * x, opts = o.options || [], rowH = 92, h = 150 + opts.length * (rowH + 20) + 70;
    const g = S('g', {}, parent);
    S('rect', { x: x + 6, y: y + 14, width: w, height: h, rx: 26, fill: '#2b2015', opacity: 0.16, filter: 'url(#pt-sblur)' }, g);
    S('rect', { x, y, width: w, height: h, rx: 26, fill: '#f0eeea' }, g);
    PT.text(g, o.q, x + 50, y + 100, { f: 'ui', size: 52, weight: 600, fill: '#1f1d1a' });
    opts.forEach((s, i) => {
      const oy = y + 150 + i * (rowH + 20), r = S('g', {}, g);
      S('rect', { x: x + 48, y: oy, width: w - 96, height: rowH, rx: 24, fill: 'none', stroke: '#b4afa6', 'stroke-width': 3 }, r);
      PT.text(r, s, x + 84, oy + rowH / 2 + 14, { f: 'ui', size: 40, weight: 500, fill: '#24221f' });
      gsap.set(r, { opacity: 0 }); X.tl.to(r, { opacity: 1, duration: 0.18 }, t + 0.25 + i * 0.08);
    });
    PT.text(g, o.note ?? 'Results after you vote', x + 50, y + h - 40, { f: 'ui', size: 32, weight: 400, fill: '#6f6a62' });
    if (o.brand) {
      const by = y + h + 110, bw = 70;
      const bg = S('g', {}, parent);
      const tw = 52 * 0.56 * o.brand.length;
      const bx = W / 2 - (bw + 22 + tw) / 2;
      S('rect', { x: bx, y: by - 56, width: bw, height: bw, rx: 14, fill: '#f6f2ea', stroke: '#d8d2c6', 'stroke-width': 2 }, bg);
      (o.mark || PT.mark)(bg, bx + bw / 2, by - 21);
      PT.text(bg, o.brand, bx + bw + 22, by, { f: 'serif', size: 52, weight: 700, fill: '#24201a' });
      gsap.set(bg, { opacity: 0 }); X.tl.to(bg, { opacity: 1, duration: 0.3 }, t + 0.7);
    }
    return g;
  };
  /** Default wordmark glyph: three stacked ledger lines with a rising tick (original). */
  PT.mark = (g, cx, cy) => {
    for (let i = 0; i < 3; i++) S('rect', { x: cx - 22, y: cy - 16 + i * 13, width: 44 - i * 10, height: 5, rx: 2.5, fill: '#24201a' }, g);
    S('path', { d: `M${cx + 4},${cy + 18} L${cx + 14},${cy + 6} L${cx + 22},${cy + 12}`, fill: 'none', stroke: PT.C.red, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
  };
})();
