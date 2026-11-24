/* Stick-figure analogy explainer kit (window.K) for the explainer engine.
 *
 * The look: black monoline marker drawings (5 px, round caps, slight hand wobble, NO line boil) on pure white,
 * held completely still and swapped whole in one frame on the narration beat. One red is reserved for judgement
 * (circle-and-slash, single words, the data line) and is the ONLY thing that draws on. Grey is for steam / glints.
 *
 *   K.init(X)                         white ground + world layer (call right after X.loadVO())
 *   K.ink(parent, shape, o)           wobbled marker stroke. shape = SVG path string (absolute M per subpath),
 *                                     a point list [[x,y],...] or a list of point lists. o: {w, color, fill, amp,
 *                                     step, seed, closed, T:{x,y,s,r,flip}} (T maps local prop coords -> stage)
 *   K.white / K.solid / K.grey        ink with white fill (occludes) / solid ink fill / grey 4 px
 *   K.loop(cx,cy,rx,ry,o)             one-stroke loop with overshoot (heads, bubbles, rings) -> points
 *   K.fig(parent, o)                  stick figure: {x,y(feet),h,pose,face,brows,look,flip,mask,arms,legs,neck,hip}
 *   K.bubble(parent,cx,cy,rx,ry,txt)  hand-drawn speech bubble with tail (Caveat)
 *   K.title(parent, word, cx, cy, o)  fat outlined bubble capitals (Fredoka 700, white fill, wobbled, uneven)
 *   K.scrawl(parent, txt, x, y, o)    hand-lettered line, per-letter jitter (Patrick Hand / Caveat)
 *   props: K.key K.lock K.door K.house K.car K.office K.bike K.lockers K.desk K.sofa K.keyboard K.graph ...
 *   time:  K.at(t) (snap, 1 f early) · K.shot(name,t0,t1,build) hard swap · K.cycle(frames,t0,t1,4) loop on fours ·
 *          K.burst(frames,t0,2) action burst on twos · K.brush(parent,pts,t0,o) tapered red reveal ·
 *          K.stamp(parent,cx,cy,rx,ry,t) circle-and-slash · K.redWord(...) · K.redLine(...)
 * Render at --fps 24 (the style's native rate; loops on fours = 6 drawings/s).
 */
(function () {
  const K = (window.K = {});
  K.FPS = 24;
  K.F = (n) => n / K.FPS;
  K.C = { paper: '#fbfbfb', ink: '#1a1a1a', grey: '#bab6b6', red: '#e20a22' };
  K.LW = 5;      // marker width at 1080p (measured 4-6 px)
  K.AMP = 1.3;   // hand wobble amplitude, px
  let X = null, tmp = null, seedN = 1234567;
  const nextSeed = () => (seedN = (seedN * 48271) % 2147483647);
  /** reset the wobble seed stream: call before a drawing you will reuse so every copy is identical (no boil) */
  K.seed = (n) => { seedN = (Math.abs(Math.floor(n)) % 2147483646) + 1; };
  K.hash = (str) => { let h = 2166136261; for (const ch of String(str)) { h ^= ch.charCodeAt(0); h = Math.imul(h, 16777619); } return h >>> 0; };
  /** n variants of one drawing that differ only where draw(fr, k) uses k (same seeds -> unchanged lines stay put) */
  K.variants = (parent, n, draw, seed = 99) => Array.from({ length: n }, (_, k) => { const fr = X.svg('g', {}, parent); K.seed(seed); draw(fr, k); return fr; });
  const f1 = (v) => (+v).toFixed(1);
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

  K.init = (x, o = {}) => {
    X = K.X = x;
    Object.assign(K, o);
    X.stage.style.background = K.C.paper;
    X.svg('rect', { x: -10, y: -10, width: 1940, height: 1100, fill: K.C.paper }, X.root);
    const hid = X.svg('g', { visibility: 'hidden' }, X.root);
    tmp = X.svg('path', { d: 'M0,0L1,0' }, hid);
    K._hid = hid;
    K.world = X.svg('g', { id: 'world' }, X.root);
    return K;
  };

  // ================================================================== geometry: sample -> transform -> wobble -> smooth
  function samplePath(d, step) {
    return d.trim().split(/(?=M)/).filter((s) => s.trim()).map((sd) => {
      tmp.setAttribute('d', sd);
      const L = tmp.getTotalLength();
      const n = Math.max(2, Math.ceil(L / step));
      const pts = [];
      for (let i = 0; i <= n; i++) { const p = tmp.getPointAtLength((L * i) / n); pts.push([p.x, p.y]); }
      return { pts, closed: /z\s*$/i.test(sd.trim()) };
    });
  }
  function densify(poly, step) {
    const out = [poly[0].slice()];
    for (let i = 1; i < poly.length; i++) {
      const [x0, y0] = poly[i - 1], [x1, y1] = poly[i];
      const n = Math.max(1, Math.ceil(Math.hypot(x1 - x0, y1 - y0) / step));
      for (let k = 1; k <= n; k++) out.push([x0 + ((x1 - x0) * k) / n, y0 + ((y1 - y0) * k) / n]);
    }
    return out;
  }
  K.xf = (T) => {
    if (!T) return (p) => p;
    const s = T.s ?? 1, a = ((T.r || 0) * Math.PI) / 180, c = Math.cos(a), sn = Math.sin(a), fx = T.flip ? -1 : 1;
    const tx = T.x || 0, ty = T.y || 0;
    return ([x, y]) => { x *= s * fx; y *= s; return [tx + x * c - y * sn, ty + x * sn + y * c]; };
  };
  function jitter(pts, amp, seed, closed) {
    const n = pts.length;
    if (n < 2 || amp <= 0) return pts;
    const r = X.rand(seed);
    const cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = cum[n - 1] || 1, p1 = r() * 6.283, p2 = r() * 6.283;
    let k1, k2;
    if (closed) { k1 = (2 * Math.PI * Math.max(1, Math.round(L / 260))) / L; k2 = (2 * Math.PI * Math.max(2, Math.round(L / 70))) / L; }
    else { k1 = 1 / (34 + r() * 26); k2 = 1 / (9 + r() * 7); }
    const bow = closed ? 0 : (r() - 0.5) * 2 * Math.min(3.2, L * 0.006);
    return pts.map((p, i) => {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1];
      const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const s = cum[i];
      const off = amp * (0.62 * Math.sin(s * k1 + p1) + 0.38 * Math.sin(s * k2 + p2)) + bow * Math.sin((Math.PI * s) / L);
      return [p[0] - ty * off, p[1] + tx * off];
    });
  }
  function smooth(pts, closed) {
    const n = pts.length;
    if (n < 2) return '';
    let d = `M${f1(pts[0][0])},${f1(pts[0][1])}`;
    if (n === 2) return d + `L${f1(pts[1][0])},${f1(pts[1][1])}`;
    const P = (i) => (closed ? pts[(i + n) % n] : pts[clamp(i, 0, n - 1)]);
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = P(i - 1), p1 = P(i), p2 = P(i + 1), p3 = P(i + 2);
      d += `C${f1(p1[0] + (p2[0] - p0[0]) / 6)},${f1(p1[1] + (p2[1] - p0[1]) / 6)} ${f1(p2[0] - (p3[0] - p1[0]) / 6)},${f1(p2[1] - (p3[1] - p1[1]) / 6)} ${f1(p2[0])},${f1(p2[1])}`;
    }
    return d + (closed ? 'Z' : '');
  }
  /** shape -> wobbled path d (absolute stage coords) */
  K.d = (shape, o = {}) => {
    const T = o.T, s = (T && T.s) || 1, step = (o.step || 9) / s, amp = o.amp ?? K.AMP;
    let subs;
    if (typeof shape === 'string') subs = samplePath(shape, step);
    else {
      const polys = typeof shape[0][0] === 'number' ? [shape] : shape;
      subs = polys.map((p) => ({ pts: densify(p, step), closed: !!o.closed }));
    }
    const tf = K.xf(T);
    let out = '';
    const seed = o.seed ?? nextSeed();
    subs.forEach((sp, k) => {
      let pts = sp.pts.map(tf);
      if (sp.closed && pts.length > 2) { const a = pts[0], b = pts[pts.length - 1]; if (Math.hypot(a[0] - b[0], a[1] - b[1]) < 0.6) pts.pop(); }
      pts = jitter(pts, amp, seed + k * 7919, sp.closed);
      out += smooth(pts, sp.closed);
    });
    return out;
  };
  K.ink = (parent, shape, o = {}) => X.svg('path', {
    d: K.d(shape, o), fill: o.fill || 'none', stroke: o.color || K.C.ink, 'stroke-width': o.w ?? K.LW,
    'stroke-linecap': 'round', 'stroke-linejoin': 'round', ...(o.attrs || {}),
  }, parent);
  K.white = (parent, shape, o = {}) => K.ink(parent, shape, { fill: K.C.paper, closed: true, ...o });
  K.solid = (parent, shape, o = {}) => K.ink(parent, shape, { fill: o.color || K.C.ink, w: 2, closed: true, ...o });
  K.grey = (parent, shape, o = {}) => K.ink(parent, shape, { color: K.C.grey, w: 4, ...o });
  K.dot = (parent, x, y, r = 5, color) => X.svg('circle', { cx: f1(x), cy: f1(y), r, fill: color || K.C.ink }, parent);
  K.g = (parent, attrs = {}) => X.svg('g', attrs, parent);

  /** one-stroke loop with overshoot (head, bubble, ring): returns points */
  K.loop = (cx, cy, rx, ry, o = {}) => {
    const r = X.rand(o.seed ?? nextSeed());
    const a0 = o.a0 ?? (-Math.PI / 2 - 0.5 + r() * 1.0), dir = o.dir ?? -1, over = o.over ?? 0.22, drift = o.drift ?? 0.035;
    const n = Math.max(28, Math.round((rx + ry) * 0.45)), sweep = 2 * Math.PI + over, pts = [];
    for (let i = 0; i <= n; i++) {
      const u = i / n, a = a0 + dir * sweep * u, k = 1 - drift / 2 + drift * u;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return pts;
  };
  K.ellipse = (cx, cy, rx, ry, n = 48, a0 = 0, a1 = Math.PI * 2) => {
    const pts = [];
    for (let i = 0; i <= n; i++) { const a = a0 + ((a1 - a0) * i) / n; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    return pts;
  };
  K.rect = (x, y, w, h) => [[x, y], [x + w, y], [x + w, y + h], [x, y + h], [x, y]];
  /** open-bottom rectangle (door frames): bottom-left -> up -> across -> down */
  K.arch = (x, y, w, h) => [[x, y + h], [x, y], [x + w, y], [x + w, y + h]];

  // ================================================================== text
  K.measure = (str, size, font = 'Caveat', weight = 400) => {
    if (str === ' ') return size * 0.28;
    const t = X.svg('text', { x: 0, y: 0, 'font-family': font, 'font-size': size, 'font-weight': weight, text: str }, K._hid);
    const w = t.getComputedTextLength(); t.remove(); return w;
  };
  K.text = (parent, str, x, y, o = {}) => X.svg('text', {
    x: f1(x), y: f1(y), text: str, 'font-family': o.font || 'Caveat', 'font-size': o.size || 44, 'font-weight': o.weight || 400,
    fill: o.color || K.C.ink, 'text-anchor': o.anchor || 'middle', transform: o.rot ? `rotate(${o.rot} ${f1(x)} ${f1(y)})` : '',
  }, parent);
  /** hand-lettered line: per-letter size / baseline / rotation jitter */
  K.scrawl = (parent, str, x, y, o = {}) => {
    const g = X.svg('g', {}, parent), r = X.rand(o.seed ?? nextSeed()), size = o.size || 72;
    const font = o.font || 'Patrick Hand', weight = o.weight || 400, chars = [...str];
    const ws = chars.map((ch) => K.measure(ch, size, font, weight)), ls = o.ls ?? size * 0.03;
    const total = ws.reduce((a, b) => a + b, 0) + ls * (chars.length - 1);
    let cx = o.anchor === 'start' ? x : o.anchor === 'end' ? x - total : x - total / 2;
    chars.forEach((ch, i) => {
      if (ch !== ' ') {
        const sz = size * (1 + (r() - 0.5) * (o.sizeJit ?? 0.12)), yy = y + (r() - 0.5) * size * (o.baseJit ?? 0.07);
        const rot = (r() - 0.5) * (o.rotJit ?? 7), px = cx + ws[i] / 2;
        X.svg('text', { x: f1(px), y: f1(yy), text: ch, 'font-family': font, 'font-size': f1(sz), 'font-weight': weight,
          fill: o.color || K.C.ink, 'text-anchor': 'middle', transform: `rotate(${rot.toFixed(2)} ${f1(px)} ${f1(yy)})` }, g);
      }
      cx += ws[i] + ls;
    });
    g._w = total;
    return g;
  };
  K.wobbleFilter = (id = 'kwob', scale = 5, freq = 0.017) => {
    if (!document.getElementById(id)) {
      const f = X.svg('filter', { id, x: '-5%', y: '-15%', width: '110%', height: '130%' }, X.defs);
      X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: freq, numOctaves: 2, seed: 4, result: 'n' }, f);
      X.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
    }
    return `url(#${id})`;
  };
  /** fat outlined bubble capitals: white fill, heavy ink outline, letters overlap and wander (static wobble, no boil) */
  K.title = (parent, word, cx, cy, o = {}) => {
    const g = X.svg('g', { filter: K.wobbleFilter() }, parent), r = X.rand(o.seed ?? 21);
    const font = o.font || 'Fredoka', weight = o.weight || 700, chars = [...word], ovk = o.overlap ?? 0.05;
    let size = o.size || 300;
    const meas = (sz) => chars.map((ch) => (ch === ' ' ? sz * 0.42 : K.measure(ch, sz, font, weight)));
    let ws = meas(size), total = ws.reduce((a, b) => a + b, 0) - ovk * size * (chars.length - 1);
    if (o.width) { size *= o.width / total; ws = meas(size); total = ws.reduce((a, b) => a + b, 0) - ovk * size * (chars.length - 1); }
    let x = cx - total / 2;
    const fat = (o.fat ?? 0.022) * size, sw = o.sw || 9;
    chars.forEach((ch, i) => {
      const px = x + ws[i] / 2, sz = size * (1 + (r() - 0.5) * 0.11), py = cy + (r() - 0.5) * 0.08 * size, rot = (r() - 0.5) * 10;
      if (ch !== ' ') {
        const base = { x: f1(px), y: f1(py), text: ch, 'font-family': font, 'font-weight': weight, 'font-size': f1(sz), 'text-anchor': 'middle',
          'stroke-linejoin': 'round', transform: `rotate(${rot.toFixed(2)} ${f1(px)} ${f1(py - size * 0.35)})` };
        // inflate: an ink stroke 2*(fat+sw) wide, then a paper stroke 2*fat wide on top -> fat letters with an sw outline
        X.svg('text', { ...base, fill: K.C.ink, stroke: K.C.ink, 'stroke-width': f1(2 * (fat + sw)) }, g);
        X.svg('text', { ...base, fill: K.C.paper, stroke: K.C.paper, 'stroke-width': f1(2 * fat) }, g);
      }
      x += ws[i] - ovk * size;
    });
    g._size = size;
    return g;
  };
  /** speech bubble: one-stroke ellipse with an opening for the tail; text in Caveat (use \n for lines) */
  K.bubble = (parent, cx, cy, rx, ry, str, o = {}) => {
    const g = X.svg('g', {}, parent);
    const [tx, ty] = o.tail || [cx - rx * 0.8, cy + ry * 1.5];
    const ang = Math.atan2((ty - cy) / ry, (tx - cx) / rx), sp = o.spread ?? 0.2, pts = [];
    const n = 64;
    for (let i = 0; i <= n; i++) { const a = ang + sp + ((2 * Math.PI - 2 * sp) * i) / n; pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]); }
    pts.push([tx, ty]);
    K.ink(g, pts, { w: o.w ?? 4, fill: K.C.paper, closed: true, amp: 1.1 });
    if (str) {
      const lines = String(str).split('\n'), size = o.size || 46, lh = size * 0.95;
      lines.forEach((ln, i) => K.text(g, ln, cx, cy + size * 0.32 + (i - (lines.length - 1) / 2) * lh, { size, font: o.font || 'Caveat', weight: o.weight || 500, rot: o.rot || 0 }));
    }
    return g;
  };

  // ================================================================== stick figure
  // arm points are offsets from the shoulder, leg points offsets from the hip, in figure heights (y down = +)
  K.POSES = {
    stand: { L: [[-0.12, 0.15], [-0.16, 0.31]], R: [[0.12, 0.15], [0.16, 0.31]] },
    cheer: { L: [[-0.21, -0.07], [-0.40, -0.17]], R: [[0.21, -0.07], [0.40, -0.17]], legs: [[[-0.13, 0.40]], [[0.13, 0.40]]] },
    shrug: { L: [[-0.16, 0.11], [-0.27, -0.03]], R: [[0.16, 0.11], [0.27, -0.03]] },
    hip:   { L: [[-0.17, 0.12], [-0.03, 0.22]], R: [[0.14, 0.17], [0.17, 0.31]] },
    point: { L: [[-0.12, 0.15], [-0.16, 0.31]], R: [[0.22, 0.0], [0.42, -0.05]] },
    hold:  { L: [[-0.12, 0.15], [-0.16, 0.31]], R: [[0.19, 0.11], [0.32, 0.05]] },
    aloft: { L: [[-0.17, 0.12], [-0.03, 0.22]], R: [[0.12, -0.18], [0.15, -0.38]] },
    raise: { L: [[-0.12, 0.15], [-0.16, 0.31]], R: [[0.17, 0.05], [0.20, -0.17]] },
    up:    { L: [[-0.18, -0.20], [-0.25, -0.40]], R: [[0.18, -0.20], [0.25, -0.40]] },
    behind:{ L: [[-0.17, -0.07], [-0.04, -0.19]], R: [[0.17, -0.07], [0.04, -0.19]] },
  };
  K.fig = (parent, o = {}) => {
    const g = X.svg('g', {}, parent), h = o.h || 520, x0 = o.x ?? 960, y0 = o.y ?? 900, fl = o.flip ? -1 : 1;
    const lw = o.w ?? K.LW, amp = Math.min(1.6, K.AMP * (0.7 + h / 1600));
    const U = ([x, y]) => [x0 + x * h * fl, y0 + y * h];
    const pose = { ...K.POSES.stand, ...(K.POSES[o.pose || 'stand'] || {}) };
    const arms = { L: pose.L, R: pose.R, ...(o.arms || {}) };
    const hip = o.hip || [0, -0.40], neck = o.neck || [o.lean || 0, -0.755];
    const hr = o.headR || 0.12;
    const hc0 = o.headC || [neck[0] + (o.headDx || 0), neck[1] - hr * 0.97];
    const sh = [neck[0] + (hip[0] - neck[0]) * 0.22, neck[1] + (hip[1] - neck[1]) * 0.22];
    let legs = o.legs || pose.legs || [[[-0.10, 0.40]], [[0.10, 0.40]]];
    // o.legsAbs / o.armsAbs: limbs as absolute stage points (knee/elbow..., end) — handy for props like bikes and desks
    const toU = (root) => ([px, py]) => [(px - x0) / (h * fl) - root[0], (py - y0) / h - root[1]];
    if (o.legsAbs) legs = o.legsAbs.map((lg) => lg.map(toU(hip)));
    if (o.armsAbs) { if (o.armsAbs.L) arms.L = o.armsAbs.L.map(toU(sh)); if (o.armsAbs.R) arms.R = o.armsAbs.R.map(toU(sh)); }
    const at = {};
    const ink = (pts, oo = {}) => K.ink(g, pts.map(U), { w: lw, amp, ...oo });
    // spine
    if (o.spine !== false) ink([neck, hip]);
    // legs + feet
    legs.forEach((lg, i) => {
      const pts = [hip, ...lg.map(([dx, dy]) => [hip[0] + dx, hip[1] + dy])];
      ink(pts);
      const e = pts[pts.length - 1], p = pts[pts.length - 2];
      if (o.feet !== false) {
        const out = Math.sign(e[0] - hip[0]) || (i ? 1 : -1), fdir = o.footDir ? o.footDir[i] : out;
        const fl2 = clamp(0.055 * h, 12, 34) / h;
        const vx = e[0] - p[0], vy = e[1] - p[1], vl = Math.hypot(vx, vy) || 1;
        // foot perpendicular-ish to the shin, pointing out
        let fx = -vy / vl, fy = vx / vl; if (fx * fdir < 0) { fx = -fx; fy = -fy; }
        K.ink(g, [U(e), U([e[0] + fx * fl2, e[1] + fy * fl2 + 0.004])], { w: lw + 1.5, amp: 0 });
      }
      at['foot' + i] = U(e);
    });
    // arms + hook hands
    for (const side of ['L', 'R']) {
      const a = arms[side];
      if (!a) continue;
      const pts = [sh, ...a.map(([dx, dy]) => [sh[0] + dx, sh[1] + dy])];
      ink(pts);
      const e = U(pts[pts.length - 1]), p = U(pts[pts.length - 2]);
      at['hand' + side] = e;
      if (o.hands !== false) {
        const hl = clamp(0.032 * h, 8, 30), ang = Math.atan2(e[1] - p[1], e[0] - p[0]);
        const s1 = (side === 'L' ? -1 : 1) * fl;
        K.ink(g, [[e[0] + Math.cos(ang + 1.0 * s1) * hl, e[1] + Math.sin(ang + 1.0 * s1) * hl], e, [e[0] + Math.cos(ang - 0.5 * s1) * hl * 0.85, e[1] + Math.sin(ang - 0.5 * s1) * hl * 0.85]], { w: lw * 0.9, amp: 0 });
      }
    }
    // head (white fill occludes whatever is behind it)
    const hc = U(hc0), R = hr * h;
    K.ink(g, K.loop(hc[0], hc[1], R * 0.96, R * 1.04, { seed: o.seed }), { w: lw, amp: Math.min(1.8, R * 0.025), fill: K.C.paper });
    at.head = hc; at.R = R; at.neck = U(neck); at.hip = U(hip); at.shoulder = U(sh);
    K.face(g, hc[0], hc[1], R, { ...o, flip: fl < 0 });
    g.at = at;
    return g;
  };
  /** face on a head of radius R: o.face (line|smile|grin|open|o|frown|smirk|worry|none), o.brows, o.look (-1..1), o.mask */
  K.face = (g, cx, cy, R, o = {}) => {
    const lk = (o.look ?? 0.25) * (o.flip ? -1 : 1), ex = cx + lk * R * 0.32, er = clamp(R * 0.075, 3.6, 9);
    const eyY = cy - R * 0.12, mx = cx + lk * R * 0.34, my = cy + R * 0.40, lw = clamp(R * 0.05, 3.5, 6);
    const eyes = [[ex - R * 0.27, eyY], [ex + R * 0.27, eyY]];
    if (o.mask) {
      const y0 = -0.36, y1 = 0.06, pts = [];
      const half = (yy) => Math.sqrt(Math.max(0, 1 - yy * yy)) * 0.99;
      for (let i = 0; i <= 10; i++) { const yy = y0 + ((y1 - y0) * i) / 10; pts.push([cx + half(yy) * R, cy + yy * R]); }
      for (let i = 10; i >= 0; i--) { const yy = y0 + ((y1 - y0) * i) / 10; pts.push([cx - half(yy) * R, cy + yy * R]); }
      K.solid(g, pts, { amp: 0.6 });
      for (const [x, y] of eyes) { X.svg('ellipse', { cx: f1(x), cy: f1(y), rx: f1(R * 0.13), ry: f1(R * 0.1), fill: K.C.paper }, g); }
      // knot tails on the back of the head
      const bx = cx - Math.sign(lk || 1) * R * 0.98, by = cy - R * 0.16, sgn = -Math.sign(lk || 1);
      K.ink(g, [[bx, by], [bx + sgn * R * 0.28, by - R * 0.12], [bx + sgn * R * 0.46, by - R * 0.05]], { w: lw, amp: 0.6 });
      K.ink(g, [[bx, by + R * 0.06], [bx + sgn * R * 0.3, by + R * 0.12], [bx + sgn * R * 0.44, by + R * 0.26]], { w: lw, amp: 0.6 });
    }
    for (const [x, y] of eyes) K.dot(g, x, y, er);
    const b = o.brows;
    if (b) {
      const by = eyY - R * 0.2, bw = R * 0.16;
      const tilt = b === 'worried' ? 1 : b === 'angry' ? -1 : 0, up = b === 'up' ? -R * 0.08 : 0;
      K.ink(g, [[eyes[0][0] - bw, by + up + tilt * R * 0.05], [eyes[0][0] + bw, by + up - tilt * R * 0.05]], { w: lw, amp: 0 });
      K.ink(g, [[eyes[1][0] - bw, by + up - tilt * R * 0.05], [eyes[1][0] + bw, by + up + tilt * R * 0.05]], { w: lw, amp: 0 });
    }
    const m = o.face || 'smile', w = R * 0.24;
    const arc = (k, w0 = w, y00 = my) => { const pts = []; for (let i = 0; i <= 10; i++) { const x = -1 + i / 5; pts.push([mx + x * w0, y00 + k * (1 - x * x)]); } return pts; };
    if (m === 'line') K.ink(g, [[mx - R * 0.15, my], [mx + R * 0.15, my]], { w: lw, amp: 0.4 });
    else if (m === 'smile') K.ink(g, arc(R * 0.12, R * 0.2, my - R * 0.06), { w: lw, amp: 0 });
    else if (m === 'frown') K.ink(g, arc(-R * 0.1, R * 0.17, my + R * 0.06), { w: lw, amp: 0 });
    else if (m === 'smirk') K.ink(g, [[mx - R * 0.2, my - R * 0.02], [mx, my + R * 0.04], [mx + R * 0.22, my - R * 0.1]], { w: lw, amp: 0 });
    else if (m === 'worry') K.ink(g, [[mx - R * 0.2, my + R * 0.02], [mx - R * 0.08, my - R * 0.04], [mx + R * 0.04, my + R * 0.03], [mx + R * 0.18, my - R * 0.03]], { w: lw, amp: 0 });
    else if (m === 'grin') {
      const pts = [[mx - R * 0.3, my - R * 0.1]]; for (let i = 0; i <= 12; i++) { const a = Math.PI * (i / 12); pts.push([mx + Math.cos(Math.PI - a) * R * 0.3, my - R * 0.1 + Math.sin(a) * R * 0.34]); }
      K.solid(g, pts, { amp: 0.5 });
    } else if (m === 'open') K.solid(g, K.ellipse(mx, my, R * 0.12, R * 0.16, 24), { amp: 0.4 });
    else if (m === 'o') K.ink(g, K.ellipse(mx, my, R * 0.07, R * 0.08, 16), { w: lw, amp: 0 });
  };

  // ================================================================== props (local coords, origin = bottom centre unless noted)
  const I = (g, d, T, o = {}) => K.ink(g, d, { T, ...o });
  const Wt = (g, d, T, o = {}) => K.ink(g, d, { T, fill: K.C.paper, closed: true, ...o });
  const S = (g, d, T, o = {}) => K.ink(g, d, { T, fill: K.C.ink, w: 2, closed: true, ...o });
  K.teeth = (seed, x0 = -62, x1 = 205, top = -30) => {
    const r = X.rand(seed), pts = [[-110, top], [x0, top]];
    let x = x0;
    while (x < x1 - 30) { const hgt = 10 + r() * 26; pts.push([x + 11, top - hgt], [x + 21, top - hgt], [x + 34, top - 2]); x += 38; }
    pts.push([x1, top]);
    return pts;
  };
  /** house key, horizontal, origin at the blade middle. o: {rot, bow:'round'|'square'|'clover', seed (teeth), ring, tag, dots, mark} */
  K.key = (parent, x, y, s = 1, o = {}) => {
    const g = X.svg('g', {}, parent), T = { x, y, s, r: o.rot || 0, flip: o.flip };
    const w = o.w ?? (s < 0.45 ? 4 : K.LW), amp = s < 0.45 ? 0.6 : K.AMP;
    const P = K.xf(T);
    if (o.ring !== false) { I(g, K.loop(-330, 30, 81, 81, { seed: 3, over: 0.08, drift: 0.02 }), T, { w, amp }); I(g, K.ellipse(-330, 30, 71, 71, 40, 0.5, 5.6), T, { w: w * 0.7, amp: amp * 0.5 }); }
    const bows = {
      round: 'M-110,-34 C-128,-100 -312,-112 -314,0 C-312,112 -128,100 -110,34 Z',
      square: 'M-110,-40 L-118,-84 L-292,-84 Q-308,-84 -308,-68 L-308,68 Q-308,84 -292,84 L-118,84 L-110,40 Z',
      clover: 'M-110,-30 C-122,-74 -150,-112 -196,-96 C-214,-142 -292,-126 -284,-70 C-344,-60 -344,60 -284,70 C-292,126 -214,142 -196,96 C-150,112 -122,74 -110,30 Z',
    };
    Wt(g, bows[o.bow || 'round'], T, { w, amp });
    // blade with teeth
    const blade = [...K.teeth(o.seed ?? 7), [212, -30], [262, 0], [236, 30], [-110, 30]];
    Wt(g, blade, T, { w, amp: amp * 0.6, step: 5 });
    I(g, [[-92, 3], [212, 3]], T, { w: w * 0.8, amp: amp * 0.6 });
    I(g, [[-92, 15], [160, 15]], T, { w: w * 0.8, amp: amp * 0.6 });
    // hole + the bit of ring seen through it
    Wt(g, K.loop(-255, 0, 21, 21, { seed: 5, over: 0.12 }), T, { w: w * 0.9, amp: 0.5, closed: false });
    if (o.ring !== false) I(g, K.ellipse(-330, 30, 81, 81, 8, -0.55, -0.15), T, { w: w * 0.9, amp: 0 });
    if (o.dots !== false) for (const [dx, dy] of [[-178, -46], [-160, 0], [-178, 46], [-212, -62], [-212, 62]]) { const p = P([dx, dy]); K.dot(g, p[0], p[1], Math.max(2.5, 6 * s)); }
    if (o.tag) {
      const t0 = P([-330, 111]);
      I(g, [[-330, 111], [-352, 170]], T, { w: w * 0.8 });
      const tag = [[-352, 170], [-312, 190], [-338, 300], [-418, 282], [-392, 172], [-352, 170]];
      Wt(g, tag, { ...T }, { w: w * 0.9, amp: amp * 0.6 });
      const c = P([-364, 240]);
      K.text(g, o.tag, c[0], c[1] + 14 * s, { size: 46 * s, rot: (o.rot || 0) + 13, weight: 600 });
      void t0;
    }
    if (o.mark) { const c = P([-175, 10]); K.text(g, o.mark, c[0], c[1] + 30 * s, { size: 110 * s, font: 'Caveat', weight: 700, rot: (o.rot || 0) - 8 }); }
    g.P = P;
    return g;
  };
  /** grey glint frames around a key (for K.cycle) */
  K.glints = (parent, x, y, s = 1, n = 3, seed = 40) => {
    const r = X.rand(seed), frames = [];
    for (let k = 0; k < n; k++) {
      const f = X.svg('g', {}, parent);
      for (const [cx, cy] of [[-260, -150], [40, -110], [250, -90]]) {
        const px = x + (cx + (r() - 0.5) * 30) * s, py = y + (cy + (r() - 0.5) * 20) * s, L = (14 + r() * 14) * s;
        K.grey(f, [[px - L, py], [px + L, py]], { amp: 0.4 }); K.grey(f, [[px, py - L], [px, py + L]], { amp: 0.4 });
      }
      frames.push(f);
    }
    return frames;
  };
  /** grey steam / smoke frames rising from (x,y) */
  K.steam = (parent, x, y, s = 1, n = 3, seed = 50, strands = 2) => {
    const r = X.rand(seed), frames = [];
    for (let k = 0; k < n; k++) {
      const f = X.svg('g', {}, parent);
      for (let j = 0; j < strands; j++) {
        const pts = [], ph = r() * 6, bx = x + (j - (strands - 1) / 2) * 34 * s;
        for (let i = 0; i <= 12; i++) { const u = i / 12; pts.push([bx + Math.sin(u * 5 + ph) * 14 * s * (0.4 + u), y - u * 120 * s]); }
        K.grey(f, pts, { amp: 0.5 });
      }
      frames.push(f);
    }
    return frames;
  };
  /** close-up lock on a door edge (the "cut-in by redraw") — origin = keyhole centre */
  K.lock = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    I(g, [[-330, -560], [-330, 560]], T); I(g, [[-300, -560], [-300, 560]], T, { w: 4 });
    I(g, [[-300, -380], [420, -380]], T, { w: 4, amp: 1 }); I(g, [[-300, 420], [420, 420]], T, { w: 4, amp: 1 });
    Wt(g, 'M-70,-330 Q-70,-360 -40,-360 L40,-360 Q70,-360 70,-330 L70,330 Q70,360 40,360 L-40,360 Q-70,360 -70,330 Z', T);
    // lever handle
    Wt(g, K.loop(0, -190, 46, 46, { seed: 8, over: 0.1 }), T, { closed: false });
    Wt(g, 'M-6,-226 L250,-222 Q282,-220 282,-190 Q282,-160 250,-158 L-6,-154 Z', T);
    I(g, [[40, -205], [240, -203]], T, { w: 3.5, amp: 0.5 });
    // cylinder + keyhole
    Wt(g, K.loop(0, 30, 52, 52, { seed: 9, over: 0.12 }), T, { closed: false });
    I(g, K.ellipse(0, 30, 36, 36, 40), T, { w: 3.5, amp: 0.6 });
    S(g, 'M-9,0 Q-9,-12 0,-12 Q9,-12 9,0 L9,58 L-9,58 Z', T, { amp: 0.4 });
    // screws
    for (const sy of [-300, 300]) { const c = K.xf(T)([0, sy]); K.ink(g, K.ellipse(c[0], c[1], 13 * s, 13 * s, 18), { w: 3.5, amp: 0.3 }); K.ink(g, [[c[0] - 8 * s, c[1] + 3 * s], [c[0] + 8 * s, c[1] - 3 * s]], { w: 3.5, amp: 0 }); }
    return g;
  };
  /** front door, origin bottom centre (≈ 240 x 430 at s=1). o: {open, num} */
  K.door = (parent, x, y, s = 1, o = {}) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    I(g, K.arch(-125, -440, 250, 440), T);
    if (o.open) {
      I(g, [[-105, -120], [105, -120]], T, { w: 3.5 }); I(g, [[-105, -120], [-125, 0]], T, { w: 3.5 }); I(g, [[105, -120], [125, 0]], T, { w: 3.5 });
      I(g, [[-60, -300], [-20, -300], [-20, -200], [-60, -200], [-60, -300]], T, { w: 3, color: K.C.grey });
      Wt(g, [[105, -420], [200, -455], [200, 30], [105, 0]], T);
      I(g, [[178, -225], [186, -228]], T, { w: 8 });
    } else {
      Wt(g, K.rect(-105, -420, 210, 420), T);
      I(g, K.rect(-72, -390, 144, 140), T, { w: 4 }); I(g, K.rect(-72, -215, 144, 175), T, { w: 4 });
      Wt(g, K.ellipse(70, -232, 13, 13, 18), T, { w: 4, amp: 0.4 });
      S(g, 'M66,-205 Q66,-212 70,-212 Q74,-212 74,-205 L74,-188 L66,-188 Z', T, { amp: 0.2 });
      if (o.num) { const c = K.xf(T)([0, -318]); K.text(g, o.num, c[0], c[1] + 18 * s, { size: 54 * s, weight: 700 }); }
    }
    return g;
  };
  /** house with chimney, windows, door; origin bottom centre (≈ 620 wide at s=1). Returns g with g.smoke = [x,y] */
  K.house = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    I(g, [[-380, 0], [380, 0]], T, { w: 4 });
    Wt(g, [[150, -470], [150, -610], [215, -610], [215, -420]], T, { closed: false });
    Wt(g, [[-300, -360], [0, -585], [300, -360]], T);
    I(g, [[-300, -360], [300, -360]], T);
    Wt(g, K.rect(-262, -360, 524, 360), T);
    for (const k of [-1, 1]) { const wx = k < 0 ? -215 : 105; I(g, K.rect(wx, -300, 110, 95), T, { w: 4 }); I(g, [[wx + 55, -300], [wx + 55, -205]], T, { w: 3.5 }); I(g, [[wx, -252], [wx + 110, -252]], T, { w: 3.5 }); }
    I(g, K.arch(-52, -205, 104, 205), T, { w: 4.5 });
    K.dot(g, ...K.xf(T)([32, -100]), 6 * s);
    I(g, [[-30, 0], [-70, 60]], T, { w: 3.5 }); I(g, [[30, 0], [70, 60]], T, { w: 3.5 });
    for (const [a, b] of [[-200, -430], [-120, -490], [80, -480]]) I(g, [[a, b], [a + 40, b + 12]], T, { w: 3.5, amp: 0.5 });
    g.smoke = K.xf(T)([182, -625]);
    return g;
  };
  /** side-view car facing right, origin ground centre (≈ 760 long at s=1). g.win = front window polygon (stage coords) */
  K.car = (parent, x, y, s = 1, o = {}) => {
    const g = X.svg('g', {}, parent), T = { x, y, s, flip: o.flip };
    const body = 'M-372,-72 L-374,-150 Q-370,-186 -322,-191 L-205,-198 L-125,-300 Q-114,-311 -92,-311 L118,-311 Q140,-311 152,-299 L245,-198 L332,-186 Q376,-178 378,-132 L378,-72 L302,-72 A77,77 0 0 0 148,-72 L-148,-72 A77,77 0 0 0 -302,-72 Z';
    Wt(g, body, T);
    const winR = [[-6, -292], [116, -292], [205, -206], [-6, -206]];
    I(g, winR.concat([winR[0]]), T, { w: 4 });
    I(g, [[-112, -292], [-28, -292], [-28, -206], [-182, -206], [-112, -292]], T, { w: 4 });
    I(g, [[-17, -300], [-17, -82]], T, { w: 4 }); I(g, [[212, -196], [222, -82]], T, { w: 3.5, amp: 0.5 });
    I(g, [[20, -180], [58, -180]], T, { w: 6, amp: 0 }); K.dot(g, ...K.xf(T)([78, -180]), 4.5 * s);
    I(g, K.ellipse(352, -150, 16, 11, 16), T, { w: 4, amp: 0.3 }); I(g, K.rect(-372, -170, 14, 34), T, { w: 4, amp: 0.3 });
    for (const wx of [-225, 225]) {
      Wt(g, K.loop(wx, -64, 64, 64, { seed: wx > 0 ? 11 : 12, over: 0.1 }), T, { closed: false });
      I(g, K.ellipse(wx, -64, 28, 28, 24), T, { w: 4, amp: 0.4 });
      for (let k = 0; k < 5; k++) { const a = (k / 5) * Math.PI * 2; K.dot(g, ...K.xf(T)([wx + Math.cos(a) * 15, -64 + Math.sin(a) * 15]), 3.5 * s); }
    }
    g.win = winR.map(K.xf(T));
    return g;
  };
  /** office block with window grid and a sign; origin bottom centre (≈ 420 x 780) */
  K.office = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    I(g, [[-330, 0], [330, 0]], T, { w: 4 });
    Wt(g, K.rect(-210, -780, 420, 780), T);
    I(g, [[-160, -780], [-160, -830], [-110, -830], [-110, -780]], T, { w: 4 });
    I(g, [[120, -780], [120, -860]], T, { w: 4 }); K.dot(g, ...K.xf(T)([120, -866]), 7 * s);
    for (let r = 0; r < 7; r++) for (let c = 0; c < 4; c++) I(g, K.rect(-172 + c * 88, -740 + r * 78, 60, 52), T, { w: 3.5, amp: 0.5 });
    I(g, K.arch(-70, -150, 140, 150), T, { w: 4.5 }); I(g, [[0, -150], [0, 0]], T, { w: 4 });
    Wt(g, K.rect(-120, -210, 240, 46), T, { w: 4 });
    const c = K.xf(T)([0, -175]); K.text(g, 'OFFICE', c[0], c[1] + 6 * s, { size: 40 * s, font: 'Patrick Hand' });
    return g;
  };
  /** bicycle facing right with a D-lock; origin ground centre (≈ 640 long). g.saddle / g.bars / g.pedal (stage) */
  K.bike = (parent, x, y, s = 1, o = {}) => {
    const g = X.svg('g', {}, parent), T = { x, y, s, flip: o.flip }, P = K.xf(T);
    for (const wx of [-225, 225]) {
      I(g, K.loop(wx, -132, 132, 132, { seed: wx > 0 ? 21 : 22, over: 0.08 }), T);
      I(g, K.ellipse(wx, -132, 116, 116, 40), T, { w: 3, amp: 0.4, color: K.C.grey });
      for (let k = 0; k < 8; k++) { const a = (k / 8) * Math.PI; I(g, [[wx + Math.cos(a) * 112, -132 + Math.sin(a) * 112], [wx - Math.cos(a) * 112, -132 - Math.sin(a) * 112]], T, { w: 2.5, color: K.C.grey, amp: 0 }); }
      K.dot(g, ...P([wx, -132]), 8 * s);
    }
    const bb = [-15, -122], seat = [-80, -330], head = [168, -345];
    I(g, [[-225, -132], bb, seat, [-225, -132]], T);
    I(g, [seat, head, bb], T);
    I(g, [[head[0], head[1] - 30], [225, -132]], T);
    I(g, [[-95, -340], seat], T);
    Wt(g, 'M-150,-352 Q-110,-372 -40,-362 Q-30,-345 -60,-342 L-140,-340 Q-160,-342 -150,-352 Z', T, { w: 4.5 });
    I(g, [[head[0], head[1] - 30], [150, -400], [118, -402]], T); I(g, [[150, -400], [190, -412]], T, { w: 6, amp: 0 });
    I(g, K.ellipse(bb[0], bb[1], 26, 26, 24), T, { w: 4, amp: 0.3 });
    I(g, [[bb[0] + 4, bb[1] + 26], [bb[0] + 34, bb[1] + 72]], T, { w: 4.5 }); I(g, [[bb[0] + 20, bb[1] + 74], [bb[0] + 52, bb[1] + 70]], T, { w: 7, amp: 0 });
    I(g, [[bb[0], bb[1] - 26], [-225, -142]], T, { w: 3, amp: 0.4 }); I(g, [[bb[0], bb[1] + 26], [-225, -122]], T, { w: 3, amp: 0.4 });
    if (o.lock !== false) { I(g, 'M10,-292 L10,-215 Q10,-180 45,-180 Q80,-180 80,-215 L80,-305', T, { w: 5.5 }); Wt(g, K.rect(-5, -318, 100, 26), T, { w: 4.5 }); }
    g.saddle = P([-95, -362]); g.bars = P([118, -402]); g.pedal = P([bb[0] + 36, bb[1] + 72]); g.pedalB = P([bb[0] - 30, bb[1] - 60]);
    return g;
  };
  /** a row of 3 gym lockers (middle = yours, number + key) with a bench and a dumbbell; origin bottom centre */
  K.lockers = (parent, x, y, s = 1, o = {}) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    I(g, [[-420, 0], [420, 0]], T, { w: 4 });
    for (const k of [-1, 0, 1]) {
      const lx = k * 180 - 88;
      Wt(g, K.rect(lx, -600, 176, 600), T);
      for (let v = 0; v < 4; v++) I(g, [[lx + 40, -560 + v * 16], [lx + 136, -560 + v * 16]], T, { w: 3, amp: 0.3 });
      I(g, K.rect(lx + 135, -330, 14, 64), T, { w: 4, amp: 0.3 });
      if (k === 0) { I(g, K.rect(lx + 58, -470, 60, 38), T, { w: 3.5, amp: 0.3 }); const c = K.xf(T)([lx + 88, -440]); K.text(g, o.num || '24', c[0], c[1], { size: 34 * s, weight: 700 }); }
    }
    if (o.key !== false) K.key(g, x + 70 * s, y - 300 * s, 0.17 * s, { rot: 90, ring: false, dots: false });
    // bench + dumbbell
    Wt(g, K.rect(-380, -170, 760, 26), T, { w: 4.5 }); I(g, [[-330, -144], [-330, 0]], T); I(g, [[330, -144], [330, 0]], T);
    I(g, [[-130, -40], [-30, -40]], T, { w: 7, amp: 0 });
    for (const dx of [-140, -20]) Wt(g, K.rect(dx, -72, 22, 64), T, { w: 4.5, amp: 0.4 });
    return g;
  };
  /** office desk (side view) with monitor + mug; origin bottom centre of desk. g.top = desk-top y, g.mug = [x,y] */
  K.desk = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    Wt(g, K.rect(-260, -330, 520, 24), T); I(g, [[-240, -306], [-240, 0]], T);
    Wt(g, K.rect(60, -306, 190, 306), T);
    for (let d = 0; d < 3; d++) { I(g, [[60, -306 + d * 102], [250, -306 + d * 102]], T, { w: 4 }); I(g, [[135, -255 + d * 102], [175, -255 + d * 102]], T, { w: 6, amp: 0 }); }
    Wt(g, K.rect(-60, -560, 220, 150), T); I(g, K.rect(-44, -544, 188, 118), T, { w: 3.5, amp: 0.4 });
    I(g, [[50, -410], [50, -340]], T); I(g, [[0, -332], [100, -332]], T, { w: 6, amp: 0 });
    Wt(g, 'M-200,-332 L-196,-400 L-140,-400 L-136,-332 Z', T, { w: 4.5 }); I(g, 'M-138,-385 Q-110,-380 -112,-360 Q-115,-345 -138,-348', T, { w: 4.5 });
    g.top = y - 330 * s; g.mug = K.xf(T)([-168, -410]);
    return g;
  };
  /** sofa, front view; origin floor centre; g.seat = seat-top y */
  K.sofa = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    Wt(g, 'M-320,-250 L-320,-420 Q-320,-450 -290,-450 L290,-450 Q320,-450 320,-420 L320,-250 Z', T);
    I(g, [[0, -440], [0, -255]], T, { w: 4 });
    Wt(g, K.rect(-330, -250, 660, 110), T); I(g, [[0, -250], [0, -140]], T, { w: 4 });
    Wt(g, K.rect(-330, -140, 660, 70), T);
    for (const k of [-1, 1]) Wt(g, `M${k * 300},-70 L${k * 300},-300 Q${k * 300},-340 ${k * 345},-340 Q${k * 390},-340 ${k * 390},-300 L${k * 390},-70 Z`, T);
    for (const lx of [-360, 360]) I(g, [[lx, -70], [lx + (lx < 0 ? 8 : -8), -20]], T, { w: 6 });
    g.seat = y - 250 * s;
    return g;
  };
  /** small row of doors; returns the list of door centres */
  K.doorRow = (parent, xs, y, s = 0.7, openIdx = -1) => {
    xs.forEach((x, i) => K.door(parent, x, y, s, { open: i === openIdx }));
    return xs;
  };
  /** wall key cabinet with an open door, hooks and hanging keys; origin bottom centre */
  K.keyBox = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent), T = { x, y, s };
    Wt(g, K.rect(-260, -660, 520, 660), T); I(g, K.rect(-235, -635, 470, 610), T, { w: 4 });
    const bows = ['round', 'square', 'clover'];
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) {
      const hx = -180 + c * 90, hy = -570 + r * 200;
      I(g, [[hx, hy - 12], [hx, hy + 6], [hx + 10, hy + 10]], T, { w: 4, amp: 0 });
      const p = K.xf(T)([hx, hy + 85]);
      K.key(g, p[0], p[1], 0.24 * s, { rot: 90, ring: false, dots: false, bow: bows[(r + c) % 3], seed: 100 + r * 5 + c });
    }
    Wt(g, [[260, -660], [400, -610], [400, -40], [260, 0]], T);
    S(g, 'M352,-345 Q352,-358 360,-358 Q368,-358 368,-345 L368,-318 L352,-318 Z', T, { amp: 0.2 });
    I(g, K.ellipse(360, -350, 16, 16, 18), T, { w: 4, amp: 0.3 });
    return g;
  };
  /** hand-drawn graph: axes, ticks, labels, end faces. Returns {g, P(u,v)} mapping 0..1 to the plot box */
  K.graph = (parent, o = {}) => {
    const g = X.svg('g', {}, parent), x0 = o.x0 ?? 470, y0 = o.y0 ?? 820, x1 = o.x1 ?? 1480, y1 = o.y1 ?? 250;
    K.ink(g, [[x0, y1 - 30], [x0, y0], [x1 + 30, y0]]);
    for (let x = x0 + 28; x < x1; x += 28) K.ink(g, [[x, y0], [x, y0 + 12]], { w: 3, amp: 0 });
    for (let yy = y0 - 60; yy > y1; yy -= 60) K.ink(g, [[x0 - 12, yy], [x0, yy]], { w: 3, amp: 0 });
    if (o.ylab) K.text(g, o.ylab, x0 - 50, (y0 + y1) / 2, { size: 46, rot: -90 });
    if (o.xlab) K.text(g, o.xlab, (x0 + x1) / 2, y0 + 72, { size: 48 });
    if (o.ytop) K.text(g, o.ytop, x0 - 46, y1 + 6, { size: 30, anchor: 'end' });
    if (o.ybot) K.text(g, o.ybot, x0 - 46, y0 - 6, { size: 30, anchor: 'end' });
    const face = (cx, cy, kind) => { K.ink(g, K.loop(cx, cy, 30, 30, { over: 0.1 })); K.face(g, cx, cy, 30, { face: kind, look: 0 }); };
    face(x0 + 20, y0 + 140, o.faceL || 'smile'); face(x1 - 20, y0 + 140, o.faceR || 'frown');
    return { g, P: (u, v) => [x0 + (x1 - x0) * u, y0 - (y0 - y1) * v] };
  };
  /** small icon versions for "everything opens" refrains */
  K.icon = (parent, kind, x, y, s = 0.3) => ({ house: K.house, car: K.car, office: K.office, bike: K.bike, lockers: K.lockers }[kind])(parent, x, y, s, { key: false, lock: false });

  // ================================================================== time: swaps, loops, bursts
  /** a swap lands on the frame grid, one frame before the stressed word */
  K.at = (t) => Math.max(0, Math.round(t * K.FPS) / K.FPS - 1 / K.FPS);
  K.snap = (t) => Math.round(t * K.FPS) / K.FPS;
  /** T1 hard swap: a drawing visible only in [t0, t1) */
  K.shot = (name, t0, t1, build) => X.scene(name, t0, t1, (g, a, b) => { K.seed(K.hash(name)); if (build) build(g, a, b); }, K.world);
  /** T7 idle loop: frames alternate every `step` frames inside [t0,t1) (frame `keep` outside) */
  K.cycle = (frames, t0 = 0, t1 = 1e9, step = 4, keep = 0) => {
    frames.forEach((f, i) => { f.style.display = i === keep ? '' : 'none'; });
    X.every((t) => {
      const k = t >= t0 && t < t1 ? Math.floor(((t - t0) * K.FPS) / step + 1e-6) % frames.length : keep;
      frames.forEach((f, i) => { const v = i === k ? '' : 'none'; if (f.style.display !== v) f.style.display = v; });
    });
  };
  /** T6 action burst: frames shown in order every `step` frames from t0, last one holds */
  K.burst = (frames, t0, step = 2) => {
    frames.forEach((f, i) => { f.style.display = i === 0 ? '' : 'none'; });
    X.every((t) => {
      const k = clamp(Math.floor(((t - t0) * K.FPS) / step + 1e-6), 0, frames.length - 1);
      frames.forEach((f, i) => { const v = i === k ? '' : 'none'; if (f.style.display !== v) f.style.display = v; });
    });
    return t0 + (frames.length * step) / K.FPS;
  };

  // ================================================================== red ink: the only thing that draws on
  /** tapered marker stroke revealed along pts from t0 (pure function of t). o: {w, dur|speed, ease, taperIn, taperOut, color} */
  K.brush = (parent, pts, t0, o = {}) => {
    const color = o.color || K.C.red, wmax = o.w ?? 12, n = pts.length, cum = [0];
    for (let i = 1; i < n; i++) cum.push(cum[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
    const L = cum[n - 1] || 1, dur = o.dur ?? L / (o.speed || 1800), ti = o.taperIn ?? 0.06, to = o.taperOut ?? 0.14;
    const ph = X.rand(o.seed ?? 9)() * 6;
    const wid = cum.map((s) => {
      const a = Math.min(1, s / (L * ti + 1e-6)), b = Math.min(1, (L - s) / (L * to + 1e-6));
      return Math.max(1.4, wmax * (0.35 + 0.65 * Math.sqrt(a)) * (0.2 + 0.8 * Math.sqrt(b)) * (1 + 0.08 * Math.sin(s / 41 + ph)));
    });
    const Lp = [], Rp = [];
    for (let i = 0; i < n; i++) {
      const a = pts[Math.max(0, i - 1)], b = pts[Math.min(n - 1, i + 1)];
      let tx = b[0] - a[0], ty = b[1] - a[1]; const tl = Math.hypot(tx, ty) || 1; tx /= tl; ty /= tl;
      const h = wid[i] / 2;
      Lp.push(`${f1(pts[i][0] - ty * h)},${f1(pts[i][1] + tx * h)}`); Rp.push(`${f1(pts[i][0] + ty * h)},${f1(pts[i][1] - tx * h)}`);
    }
    const el = X.svg('path', { d: '', fill: color }, parent);
    const cap = X.svg('circle', { r: 0, fill: color, cx: -99, cy: -99 }, parent);
    const ease = gsap.parseEase(o.ease || 'power1.inOut');
    let lastK = -2;
    X.every((t) => {
      const u = (t - t0) / dur;
      let k;
      if (u <= 0) k = -1;
      else if (u >= 1) k = n - 1;
      else { const s = L * ease(u); k = 0; while (k < n - 1 && cum[k + 1] <= s) k++; }
      if (k === lastK) return;
      lastK = k;
      if (k < 1) { el.setAttribute('d', ''); cap.setAttribute('r', 0); return; }
      el.setAttribute('d', 'M' + Lp.slice(0, k + 1).join('L') + 'L' + Rp.slice(0, k + 1).reverse().join('L') + 'Z');
      if (k < n - 1) { cap.setAttribute('cx', f1(pts[k][0])); cap.setAttribute('cy', f1(pts[k][1])); cap.setAttribute('r', f1(wid[k] / 2)); }
      else cap.setAttribute('r', 0);
    });
    return t0 + dur;
  };
  /** T3 red judgement stamp: one loose circle (counter-clockwise from the top, overshoot tail) then the slash */
  K.stamp = (parent, cx, cy, rx, ry, t, o = {}) => {
    const r = X.rand(o.seed ?? 31), ph = r() * 6, a0 = -Math.PI / 2 + 0.45 + (r() - 0.5) * 0.2, sweep = 2 * Math.PI + 0.5, pts = [];
    for (let i = 0; i <= 180; i++) {
      const u = i / 180, a = a0 - sweep * u, k = 0.97 + 0.07 * u + 0.025 * Math.sin(u * 8 + ph);
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    const dc = o.dur ?? K.F(22), w = o.w ?? 14;
    K.brush(parent, pts, t, { w, dur: dc, ease: 'power1.out', taperIn: 0.04, taperOut: 0.1, seed: 3 });
    const s0 = [cx - rx * 0.74, cy + ry * 0.70], s1 = [cx + rx * 0.84, cy - ry * 0.95], sl = [];
    for (let i = 0; i <= 30; i++) { const u = i / 30; sl.push([s0[0] + (s1[0] - s0[0]) * u + Math.sin(u * Math.PI) * 10, s0[1] + (s1[1] - s0[1]) * u + Math.sin(u * Math.PI) * 6]); }
    const ts = t + dc + K.F(o.gap ?? 3);
    K.brush(parent, sl, ts, { w: w * 0.95, dur: K.F(4), ease: 'none', taperIn: 0.03, taperOut: 0.12, seed: 4 });
    if (o.sfx !== false) { X.sfx(t, 'scribble', { dur: dc, gain: 0.5 }); X.sfx(ts, 'scribble', { dur: 0.16, gain: 0.6 }); }
    return ts + K.F(4);
  };
  /** T4 red word: appears whole in one frame beside the held drawing */
  K.redWord = (parent, str, x, y, t, o = {}) => {
    const g = K.scrawl(parent, str, x, y, { font: 'Caveat', weight: 700, size: o.size || 96, color: K.C.red, rotJit: 6, ...o });
    gsap.set(g, { autoAlpha: 0 });
    X.tl.set(g, { autoAlpha: 1 }, K.snap(t));
    if (o.sfx !== false) X.sfx(K.snap(t), 'scribble', { dur: 0.14, gain: 0.35 });
    return g;
  };
  /** T5 red data line drawn on left->right, then its arrowhead */
  K.redLine = (parent, pts, t, o = {}) => {
    const dur = o.dur ?? K.F(26), w = o.w ?? 7;
    K.brush(parent, pts, t, { w, dur, ease: 'power1.inOut', taperIn: 0.02, taperOut: 0.01 });
    const e = pts[pts.length - 1], p = pts[pts.length - 6], a = Math.atan2(e[1] - p[1], e[0] - p[0]), L = 34;
    const te = t + dur + K.F(1);
    for (const da of [2.6, -2.6]) K.brush(parent, [e, [e[0] + Math.cos(a + da) * L, e[1] + Math.sin(a + da) * L]], te, { w: w * 0.9, dur: K.F(2), ease: 'none', taperIn: 0.0, taperOut: 0.3 });
    if (o.sfx !== false) X.sfx(t, 'scribble', { dur, gain: 0.45 });
    return te + K.F(2);
  };
})();
