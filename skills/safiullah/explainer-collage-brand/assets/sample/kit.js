/* Collage-brand kit — selective-colour paper collage on flat axonometric sets (HubSpot "Video Has Changed" grammar).
 * Depends on window.X (explainer engine). Load after /engine/lib/explainer.js, before scene.js.
 *
 *   K.P                      palette roles (old grey world, the "work" colour family, new world, navy, brand)
 *   K.init()                 gradients + filters (call once at the top of the build)
 *   K.iso(ox, oy, s)         axonometric projector: .P(x,y,z) .box() .floor() .wallX() .wallY() .poly()
 *   K.draw(w, h, fn)         canvas painter for greyscale "photo" figures (fn(ctx, U))
 *   K.cut(parent, canvas, o) halftone + paper rim + drop shadow → <g> holding an <image> (the collage cut-out)
 *   K.fig.*                  figure painters: man, woman, seatedBack, seatedSide, presenter, hand, clock,
 *                            punchClock, lamp, plant, reports (return canvases; pass to K.cut)
 *   K.stipple(parent, o)     dithered light / shadow spray (<image>), K.stippleURL(w, h, f, o)
 *   K.scrap(parent, o)       torn paper scrap with paper texture · K.tape(parent, x, y, w, rot)
 *   K.scribble.*             hand-drawn marker loops / ticks / crosses / talk-lines (paths; animate with X.drawOn)
 *   K.blob(parent, ...)      morphing organic blob (gradient fills = the colour family)
 *   K.shadow(parent, ...)    solid navy organic cast shadow
 *   K.wrap / K.rise / K.grow · K.planeY / K.planeX (map flat art onto iso planes) · K.laptop(iso, ...)
 *   K.glyph(parent, size)    the hero motif (folded-corner page) — replace with your own brand glyph
 *   K.iris / K.ringBurst / K.ribbons / K.lightFlood / K.colourPop / K.drift / K.pullBack   transitions & camera
 *   K.quote.*                motion-quote sub-variant: header slots, tracked mono words with scanned-document fill,
 *                            xerox ghost, xerox strip, dust
 * Everything is deterministic (seeded) — no Math.random, no wall clock.
 */
(function () {
  const K = (window.K = {});
  const W = 1920, H = 1080;

  // ------------------------------------------------------------------ palette roles
  K.P = {
    // old world: slate-violet ground, three-value planes, navy shadows (saturated pixels ≈ 0)
    ground: '#5E6478', groundDeep: '#4A5064', shadow: '#2C3749', light: '#DDDFE5', mid: '#A3A9B4', dark: '#6F7587',
    deep: '#3A4255', wall: '#D8DAE0', cream: '#FBF5EE', ink: '#232838', desk: '#5D6F8C', deskTop: '#C9CFDA', deskDark: '#3E4D66',
    // the colour family = "the work" (only thing allowed to be saturated before the pivot)
    marigold: '#FFC145', tangerine: '#FF7A3D', pink: '#F0478A', violet: '#7B61FF', sky: '#7FD8F0',
    // new world (after the pivot): saturated cobalt field, lavender-cream planes, indigo shadows
    field: '#4236DE', fLight: '#F4F0FF', fMid: '#9C93F7', fDark: '#2A22A6', fShadow: '#1D1780',
    // reveal + end card
    navy: '#231D5A', brand: '#FFC145', brandInk: '#2A2380',
  };

  const NS = 'http://www.w3.org/2000/svg';
  const clamp = (v, a, b) => (v < a ? a : v > b ? b : v);
  const hex = (h) => { const n = parseInt(h.slice(1), 16); return [(n >> 16) & 255, (n >> 8) & 255, n & 255]; };
  K.clamp = clamp; K.hex = hex;
  const canvas = (w, h) => { const c = document.createElement('canvas'); c.width = Math.max(1, Math.round(w)); c.height = Math.max(1, Math.round(h)); return c; };
  K.canvas = canvas;

  // ------------------------------------------------------------------ defs
  K.init = () => {
    const P = K.P;
    K.work = X.linear('k-work', [[0, P.marigold], [0.5, P.tangerine], [1, P.pink]], 0, 0, 1, 1);
    K.workH = X.linear('k-workH', [[0, P.pink], [0.5, P.tangerine], [1, P.marigold]], 0, 0, 1, 0);
    K.workV = X.linear('k-workV', [[0, P.marigold], [0.55, P.tangerine], [1, P.pink]], 0, 0, 0, 1);
    K.cool = X.linear('k-cool', [[0, P.sky], [0.5, P.violet], [1, P.pink]], 0, 0, 1, 1);
    K.coolV = X.linear('k-coolV', [[0, P.sky], [1, P.violet]], 0, 0, 0, 1);
    K.sunset = X.linear('k-sunset', [[0, P.violet], [0.45, P.pink], [1, P.marigold]], 0, 0, 0, 1);
    K.cutShadow = X.shadow('k-cutShadow', 3, 7, 5, '#141826', 0.32);
    K.paperShadow = X.shadow('k-paperShadow', 2, 5, 4, '#141826', 0.28);
    K.softShadow = X.shadow('k-softShadow', 0, 10, 14, '#0E1020', 0.3);
    return K;
  };

  // ------------------------------------------------------------------ axonometric projector
  /** iso(ox, oy, s): +x runs right-down, +y runs left-down, +z up. Faces: top (light), left = +y face (mid),
   *  right = +x face (dark). Colours: {top, left, right} or a palette name {old|new}. */
  K.iso = (ox, oy, s = 1) => {
    const C = 0.8660254 * s, S = 0.5 * s;
    const P = (x, y, z = 0) => [ox + (x - y) * C, oy + (x + y) * S - z * s];
    const pts = (arr) => arr.map((p) => P(p[0], p[1], p[2] || 0).map((v) => v.toFixed(1)).join(',')).join(' ');
    const poly = (parent, arr, fill, extra = {}) => X.svg('polygon', { points: pts(arr), fill, ...extra }, parent);
    const box = (parent, x, y, z, w, d, h, col = {}) => {
      const g = X.svg('g', {}, parent);
      const c = { top: K.P.light, left: K.P.mid, right: K.P.dark, ...col };
      poly(g, [[x + w, y, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x + w, y, z]], c.right);
      poly(g, [[x, y + d, z + h], [x + w, y + d, z + h], [x + w, y + d, z], [x, y + d, z]], c.left);
      poly(g, [[x, y, z + h], [x + w, y, z + h], [x + w, y + d, z + h], [x, y + d, z + h]], c.top);
      return g;
    };
    const floor = (parent, x, y, w, d, fill, z = 0) => poly(parent, [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], fill);
    const wallX = (parent, x, y, d, h, fill, z = 0) => poly(parent, [[x, y, z], [x, y + d, z], [x, y + d, z + h], [x, y, z + h]], fill); // back-left wall
    const wallY = (parent, x, y, w, h, fill, z = 0) => poly(parent, [[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], fill); // back-right wall
    return { P, pts, poly, box, floor, wallX, wallY, s };
  };
  K.OLD = { top: '#DDDFE5', left: '#A3A9B4', right: '#6F7587' };
  K.DESK = { top: '#C9CFDA', left: '#5D6F8C', right: '#3E4D66' };
  K.NEW = { top: '#F4F0FF', left: '#9C93F7', right: '#2A22A6' };
  K.NEWWARM = { top: '#FFF4E0', left: '#FFC145', right: '#E0663A' };

  // ------------------------------------------------------------------ smooth closed curves / organic shapes
  K.smooth = (pts, closed = true) => {
    const n = pts.length, p = (i) => pts[closed ? (i + n) % n : clamp(i, 0, n - 1)];
    let d = `M${p(0)[0].toFixed(1)},${p(0)[1].toFixed(1)}`;
    const last = closed ? n : n - 1;
    for (let i = 0; i < last; i++) {
      const p0 = p(i - 1), p1 = p(i), p2 = p(i + 1), p3 = p(i + 2);
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += `C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d + (closed ? 'Z' : '');
  };
  K.organic = (cx, cy, rx, ry, seed = 1, n = 9, amp = 0.16, phase = 0) => {
    const r = X.rand(seed), ph = Array.from({ length: n }, () => r() * 6.283), am = Array.from({ length: n }, () => 1 + (r() - 0.5) * 2 * amp);
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2, k = am[i] + Math.sin(phase + ph[i]) * amp * 0.5;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    return K.smooth(pts);
  };
  /** solid navy cast shadow under furniture (organic, never blurred) */
  K.shadow = (parent, cx, cy, rx, ry, seed = 3, fill = K.P.shadow) => X.svg('path', { d: K.organic(cx, cy, rx, ry, seed, 10, 0.08), fill }, parent);
  /** morphing gradient blob: idle "breathing" is a pure function of t */
  K.blob = (parent, cx, cy, r, fill, o = {}) => {
    const el = X.svg('path', { d: K.organic(cx, cy, r, r * (o.squash ?? 1), o.seed ?? 1, o.n ?? 8, o.amp ?? 0.16), fill, opacity: o.opacity ?? 1 }, parent);
    const sp = o.speed ?? 0.9;
    if (sp) X.every((t) => el.setAttribute('d', K.organic(cx, cy, r, r * (o.squash ?? 1), o.seed ?? 1, o.n ?? 8, o.amp ?? 0.16, t * sp)));
    return el;
  };

  // ------------------------------------------------------------------ canvas painter for figures
  const U = (x) => {
    const g = (v) => { const k = Math.round(clamp(v, 0, 1) * 255); return `rgb(${k},${k},${k})`; };
    const st = (v) => (typeof v === 'number' ? g(v) : v);
    return {
      x, g,
      fill(d, s) { x.fillStyle = st(s); x.fill(new Path2D(d)); },
      stroke(d, s, w = 2, cap = 'round') { x.strokeStyle = st(s); x.lineWidth = w; x.lineCap = cap; x.lineJoin = 'round'; x.stroke(new Path2D(d)); },
      lg(x0, y0, x1, y1, stops) { const gr = x.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, v]) => gr.addColorStop(o, st(v))); return gr; },
      rg(cx, cy, r0, r1, stops, fx = cx, fy = cy) { const gr = x.createRadialGradient(fx, fy, r0, cx, cy, r1); stops.forEach(([o, v]) => gr.addColorStop(o, st(v))); return gr; },
      ell(cx, cy, rx, ry, s, rot = 0) { x.beginPath(); x.ellipse(cx, cy, Math.abs(rx), Math.abs(ry), rot, 0, Math.PI * 2); x.fillStyle = st(s); x.fill(); },
      rect(x0, y0, w, h, s, r = 0) { x.beginPath(); x.roundRect ? x.roundRect(x0, y0, w, h, r) : x.rect(x0, y0, w, h); x.fillStyle = st(s); x.fill(); },
      soft(blur, fn) { x.save(); x.filter = `blur(${blur}px)`; fn(); x.restore(); },
      clip(d, fn) { x.save(); x.clip(new Path2D(d)); fn(); x.restore(); },
      at(tx, ty, rot, fn, sc = 1) { x.save(); x.translate(tx, ty); x.rotate(rot); x.scale(sc, sc); fn(); x.restore(); },
    };
  };
  K.draw = (w, h, fn) => { const c = canvas(w, h); const x = c.getContext('2d'); fn(x, U(x)); return c; };

  /** Halftone a greyscale canvas: tone + rotated dot screen + grain, mapped ink→paper (alpha kept). */
  K.halftone = (src, o = {}) => {
    const w = src.width, h = src.height;
    const cell = o.cell ?? 5.5, ang = ((o.angle ?? 45) * Math.PI) / 180, mix = o.mix ?? 0.5;
    const d = src.getContext('2d').getImageData(0, 0, w, h).data;
    const out = canvas(w, h), oc = out.getContext('2d'), oi = oc.createImageData(w, h), od = oi.data;
    const ca = Math.cos(ang), sa = Math.sin(ang), r = X.rand(o.seed ?? 5);
    const lo = hex(o.ink ?? '#202536'), hi = hex(o.paper ?? '#F1F1EF');
    const con = o.contrast ?? 1.15, br = o.bright ?? 0, grain = o.grain ?? 0.09, soft = 1.1 / cell;
    for (let y = 0; y < h; y++) for (let xx = 0; xx < w; xx++) {
      const i = (y * w + xx) * 4, a = d[i + 3];
      if (!a) continue;
      let L = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      L = clamp((L - 0.5) * con + 0.5 + br + (r() - 0.5) * grain, 0, 1);
      const u = (xx * ca + y * sa) / cell, v = (-xx * sa + y * ca) / cell;
      const fu = u - Math.floor(u) - 0.5, fv = v - Math.floor(v) - 0.5;
      const dist = Math.sqrt(fu * fu + fv * fv) / 0.7071;
      const rad = Math.sqrt((1 - L) / 1.571);
      const e = clamp((dist - rad) / soft + 0.5, 0, 1);
      const T = L * (1 - mix) + e * mix;
      od[i] = lo[0] + (hi[0] - lo[0]) * T; od[i + 1] = lo[1] + (hi[1] - lo[1]) * T; od[i + 2] = lo[2] + (hi[2] - lo[2]) * T; od[i + 3] = a;
    }
    oc.putImageData(oi, 0, 0);
    return out;
  };
  /** directional light pass (source-atop): light from the left/top, shadow to the right/bottom — adds photo volume */
  K.lightPass = (c, o = {}) => {
    const x = c.getContext('2d');
    x.save(); x.globalCompositeOperation = 'source-atop';
    const g = x.createLinearGradient(0, 0, c.width, 0);
    g.addColorStop(0, `rgba(255,255,255,${o.hi ?? 0.14})`); g.addColorStop(0.42, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${o.lo ?? 0.3})`);
    x.fillStyle = g; x.fillRect(0, 0, c.width, c.height);
    const v = x.createLinearGradient(0, 0, 0, c.height);
    v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(0.55, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(0,0,0,${o.foot ?? 0.16})`);
    x.fillStyle = v; x.fillRect(0, 0, c.width, c.height);
    x.restore();
    return c;
  };
  /** crop a canvas (e.g. a bust from a standing figure) */
  K.crop = (src, x0, y0, w, h) => { const c = canvas(w, h); c.getContext('2d').drawImage(src, -x0, -y0); return c; };
  /** add a scissor-cut paper margin around the alpha of a canvas */
  K.rim = (src, rim = 5, color = '#F4F1EA') => {
    if (!rim) return src;
    const pad = rim + 2, out = canvas(src.width + 2 * pad, src.height + 2 * pad), x = out.getContext('2d');
    for (let k = 0; k < 20; k++) { const a = (k / 20) * Math.PI * 2; x.drawImage(src, pad + Math.cos(a) * rim, pad + Math.sin(a) * rim); }
    x.globalCompositeOperation = 'source-in'; x.fillStyle = color; x.fillRect(0, 0, out.width, out.height);
    x.globalCompositeOperation = 'source-over'; x.drawImage(src, pad, pad);
    out._pad = pad;
    return out;
  };
  /** The collage cut-out: canvas → halftone → rim → <image> inside <g>, anchored at its bottom-centre (ax, ay).
   *  o: {x, y, h (display height) | scale, cell, mix, rim, rimColor, shadow, ink, paper, contrast, anchor:[0.5,1]} */
  K.cut = (parent, src, o = {}) => {
    if (o.light !== false && !src._lit) { K.lightPass(src, o.lightOpts); src._lit = true; }
    const ht = o.halftone === false ? src : K.halftone(src, o);
    const rc = K.rim(ht, o.rim ?? 0, o.rimColor);
    const pad = rc._pad || 0;
    const sc = o.h ? o.h / src.height : o.scale ?? 1;
    const g = X.svg('g', {}, parent);
    const inner = X.svg('g', {}, g);
    const an = o.anchor || [0.5, 1];
    const iw = rc.width * sc, ih = rc.height * sc;
    const img = X.svg('image', { href: rc.toDataURL('image/png'), x: (-an[0] * src.width - pad) * sc, y: (-an[1] * src.height - pad) * sc, width: iw, height: ih, preserveAspectRatio: 'none' }, inner);
    if (o.shadow !== false) img.setAttribute('filter', o.shadowFilter || K.cutShadow || '');
    gsap.set(g, { x: o.x ?? 0, y: o.y ?? 0 });
    g._inner = inner; g._w = src.width * sc; g._h = src.height * sc;
    if (o.flip) gsap.set(inner, { scaleX: -1 });
    return g;
  };

  // ------------------------------------------------------------------ figure painters (greyscale "photos")
  const F = (K.fig = {});
  /** standing man in a suit, 3/4 front. o: {hat, coat, briefcase, tone (jacket base 0..1), point (right arm raised)} */
  F.man = (o = {}) => K.draw(280, 760, (x, u) => {
    const j = o.tone ?? 0.36, g = u.g;
    if (o.briefcase) { u.rect(196, 380, 70, 54, u.lg(196, 0, 266, 0, [[0, 0.28], [1, 0.12]]), 5); u.stroke('M216,382 L216,368 L246,368 L246,382', 0.1, 5); u.rect(196, 380, 70, 6, 0.36, 2); }
    const legs = 'M80,372 L184,372 L186,698 L144,700 L134,476 L128,476 L120,700 L78,698 Z';
    u.fill(legs, u.lg(78, 0, 186, 0, [[0, j - 0.02], [0.45, j - 0.1], [1, j - 0.24]]));
    u.clip(legs, () => u.soft(5, () => { u.fill('M127,380 L135,380 L134,700 L128,700 Z', 0.06); u.fill('M80,372 L186,372 L186,400 L80,400 Z', 0.1); }));
    u.ell(98, 704, 30, 12, 0.07); u.ell(162, 704, 30, 12, 0.09); u.ell(90, 700, 10, 4, 0.35);
    const coatLen = o.coat ? 490 : 386;
    const jacket = `M66,156 Q100,134 130,140 Q160,134 194,156 L204,214 L${o.coat ? 208 : 198},${coatLen} Q130,${coatLen + 12} ${o.coat ? 54 : 62},${coatLen} L56,214 Z`;
    u.fill(jacket, u.lg(56, 0, 204, 0, [[0, j + 0.12], [0.45, j], [1, j - 0.2]]));
    u.clip(jacket, () => u.soft(9, () => { u.fill(`M170,150 L214,150 L214,${coatLen + 20} L176,${coatLen + 20} Z`, j - 0.26); u.fill(`M50,${coatLen - 26} L214,${coatLen - 26} L214,${coatLen + 20} L50,${coatLen + 20} Z`, j - 0.18); u.fill('M70,160 L96,160 L92,330 L72,330 Z', j + 0.2); }));
    if (o.coat) u.stroke(`M130,236 L130,${coatLen + 8}`, j - 0.22, 3);
    u.fill('M110,142 L150,142 L130,234 Z', u.lg(110, 0, 150, 0, [[0, 0.96], [1, 0.76]]));
    u.fill('M125,150 L135,150 L141,238 L130,254 L119,238 Z', 0.16);
    u.fill('M110,142 L130,234 L102,198 L94,150 Z', j + 0.08); u.fill('M150,142 L130,234 L158,198 L166,150 Z', j - 0.12);
    u.ell(130, 300, 3, 3, 0.1); u.ell(130, 336, 3, 3, 0.1);
    const armL = 'M66,158 Q46,178 44,238 L40,364 Q42,378 56,376 L70,364 L76,238 Z';
    u.fill(armL, u.lg(40, 0, 76, 0, [[0, j + 0.16], [1, j - 0.02]]));
    u.ell(55, 386, 13, 18, 0.74);
    if (o.point) {
      u.at(194, 164, -2.25, () => { u.fill('M-14,-4 Q4,-14 22,-4 L20,150 L-10,150 Z', u.lg(-14, 0, 22, 0, [[0, j - 0.08], [1, j - 0.24]])); u.ell(6, 166, 12, 20, 0.62); u.fill('M2,176 L10,176 L8,206 L3,206 Z', 0.6); });
    } else {
      const armR = 'M194,158 Q214,178 216,238 L220,364 Q218,378 204,376 L190,364 L184,238 Z';
      u.fill(armR, u.lg(184, 0, 220, 0, [[0, j - 0.12], [1, j - 0.26]]));
      u.ell(205, 386, 13, 18, 0.52);
    }
    u.fill('M116,106 L144,106 L146,146 L114,146 Z', u.lg(114, 0, 146, 0, [[0, 0.72], [1, 0.44]]));
    u.ell(130, 76, 34, 42, u.rg(120, 64, 4, 46, [[0, 0.88], [0.7, 0.68], [1, 0.5]]));
    u.ell(96, 80, 6, 11, 0.62); u.ell(164, 80, 6, 11, 0.44);
    const head = 'M96,76 a34,42 0 1,0 68,0 a34,42 0 1,0 -68,0 Z';
    u.clip(head, () => u.soft(7, () => { u.fill('M146,20 L180,20 L180,130 L146,130 Z', 0.34); u.ell(117, 79, 9, 5, 0.5); u.ell(143, 79, 9, 5, 0.42); u.fill('M131,80 L140,98 L126,98 Z', 0.52); u.ell(130, 106, 12, 4, 0.5); u.ell(130, 120, 22, 8, 0.48); }));
    if (o.hat) {
      u.fill('M98,44 Q100,6 130,6 Q160,6 162,44 Z', u.lg(98, 0, 162, 0, [[0, 0.3], [1, 0.1]]));
      u.fill('M98,36 L162,36 L162,46 L98,46 Z', 0.06);
      u.ell(130, 46, 60, 11, u.lg(70, 0, 190, 0, [[0, 0.26], [1, 0.1]]));
    } else u.fill('M95,72 Q90,32 130,28 Q172,30 166,74 Q160,50 130,48 Q102,48 95,72 Z', 0.11);
  });
  /** standing woman in a blazer */
  F.woman = (o = {}) => K.draw(260, 740, (x, u) => {
    const j = o.tone ?? 0.55;
    u.fill('M100,500 L120,500 L118,690 L104,690 Z', u.lg(100, 0, 120, 0, [[0, 0.62], [1, 0.42]]));
    u.fill('M140,500 L160,500 L158,690 L144,690 Z', u.lg(140, 0, 160, 0, [[0, 0.5], [1, 0.32]]));
    u.fill('M96,686 L124,686 L128,700 L92,700 Z', 0.08); u.fill('M138,686 L164,686 L168,700 L134,700 Z', 0.1);
    const skirt = 'M78,340 L182,340 L192,512 Q130,524 68,512 Z';
    u.fill(skirt, u.lg(68, 0, 192, 0, [[0, 0.3], [1, 0.12]]));
    const blazer = 'M72,150 Q130,128 188,150 L196,206 L190,356 Q130,368 70,356 L64,206 Z';
    u.fill(blazer, u.lg(64, 0, 196, 0, [[0, j + 0.14], [0.5, j], [1, j - 0.24]]));
    u.clip(blazer, () => u.soft(8, () => { u.fill('M166,146 L204,146 L204,380 L170,380 Z', j - 0.28); u.fill('M74,160 L98,160 L94,320 L76,320 Z', j + 0.18); }));
    u.fill('M112,140 L148,140 L130,214 Z', 0.92);
    u.fill('M112,140 L130,214 L104,190 L98,148 Z', j + 0.06); u.fill('M148,140 L130,214 L156,190 L162,148 Z', j - 0.14);
    u.fill('M72,152 Q54,172 52,232 L50,348 Q52,360 64,358 L76,346 L80,232 Z', u.lg(50, 0, 80, 0, [[0, j + 0.16], [1, j]]));
    u.fill('M188,152 Q206,172 208,232 L210,348 Q208,360 196,358 L184,346 L180,232 Z', u.lg(180, 0, 210, 0, [[0, j - 0.12], [1, j - 0.28]]));
    u.ell(60, 368, 11, 16, 0.76); u.ell(200, 368, 11, 16, 0.55);
    u.fill('M118,104 L142,104 L144,142 L116,142 Z', u.lg(116, 0, 144, 0, [[0, 0.74], [1, 0.48]]));
    u.fill('M92,80 Q86,26 130,22 Q176,26 170,82 L172,128 Q160,134 152,122 L150,70 L110,70 L108,122 Q100,134 88,128 Z', 0.14);
    u.ell(130, 76, 30, 38, u.rg(122, 66, 4, 40, [[0, 0.9], [0.7, 0.72], [1, 0.55]]));
    u.fill('M100,74 Q104,36 132,38 Q160,40 162,70 Q146,52 120,54 Q108,58 100,74 Z', 0.12);
    u.clip('M100,76 a30,38 0 1,0 60,0 a30,38 0 1,0 -60,0 Z', () => u.soft(6, () => { u.fill('M146,30 L176,30 L176,120 L146,120 Z', 0.4); u.ell(119, 80, 8, 4, 0.55); u.ell(141, 80, 8, 4, 0.5); u.fill('M131,82 L138,96 L126,96 Z', 0.58); u.ell(130, 102, 9, 3.4, 0.45); }));
  });
  /** seated worker seen from behind (rows of desks). o: {tone, hair} */
  F.seatedBack = (o = {}) => K.draw(200, 240, (x, u) => {
    const j = o.tone ?? 0.4;
    u.rect(44, 118, 112, 120, u.lg(44, 0, 156, 0, [[0, 0.26], [1, 0.1]]), 14);
    const back = 'M34,124 Q100,92 166,124 L172,226 L28,226 Z';
    u.fill(back, u.lg(28, 0, 172, 0, [[0, j + 0.12], [0.5, j], [1, j - 0.2]]));
    u.clip(back, () => u.soft(8, () => { u.fill('M96,110 L104,110 L104,230 L96,230 Z', j - 0.16); u.fill('M140,110 L180,110 L180,230 L140,230 Z', j - 0.22); }));
    u.fill('M86,82 L114,82 L116,112 L84,112 Z', 0.56);
    u.ell(100, 62, 28, 33, u.rg(92, 50, 4, 36, [[0, o.hair ?? 0.24], [1, (o.hair ?? 0.24) - 0.14]]));
    u.ell(72, 66, 5, 9, 0.6); u.ell(128, 66, 5, 9, 0.45);
  });
  /** seated worker in profile at a table, facing right (laptop goes at ~x 230..300). o: {tone, hair:'long'|'short'} */
  F.seatedSide = (o = {}) => K.draw(320, 380, (x, u) => {
    const j = o.tone ?? 0.45;
    u.rect(70, 150, 22, 140, u.lg(70, 0, 92, 0, [[0, 0.3], [1, 0.14]]), 8);
    u.rect(74, 250, 110, 18, 0.2, 6); u.rect(90, 268, 10, 100, 0.16); u.rect(160, 268, 10, 100, 0.16);
    u.fill('M104,238 L214,232 L222,262 L112,272 Z', u.lg(0, 232, 0, 272, [[0, 0.32], [1, 0.16]]));
    u.fill('M196,240 L222,248 L230,350 L208,354 Z', u.lg(196, 0, 230, 0, [[0, 0.28], [1, 0.14]]));
    u.ell(226, 356, 22, 9, 0.08);
    const torso = 'M96,248 L110,128 Q132,108 158,122 L170,150 L160,252 Z';
    u.fill(torso, u.lg(96, 0, 170, 0, [[0, j - 0.1], [0.6, j + 0.08], [1, j - 0.08]]));
    u.clip(torso, () => u.soft(7, () => u.fill('M90,200 L170,200 L170,260 L90,260 Z', j - 0.2)));
    u.fill('M140,132 Q160,128 168,150 L190,206 L248,206 Q256,214 248,222 L182,224 Q170,222 166,212 L142,160 Z', u.lg(140, 0, 250, 0, [[0, j + 0.06], [1, j - 0.08]]));
    u.ell(254, 214, 14, 8, 0.7);
    u.fill('M134,96 L152,96 L156,126 L136,126 Z', 0.58);
    u.ell(146, 72, 28, 32, u.rg(156, 66, 4, 34, [[0, 0.86], [0.7, 0.68], [1, 0.5]]));
    if (o.hair === 'long') u.fill('M116,70 Q114,36 146,36 Q176,38 174,60 Q160,50 146,54 Q136,64 136,90 L132,128 Q116,130 112,112 Z', 0.12);
    else u.fill('M118,74 Q114,38 146,38 Q176,40 174,62 Q158,52 144,56 Q136,62 132,80 Z', 0.12);
    u.clip('M118,72 a28,32 0 1,0 56,0 a28,32 0 1,0 -56,0 Z', () => u.soft(5, () => { u.fill('M110,40 L136,40 L136,110 L110,110 Z', 0.4); u.ell(162, 72, 6, 4, 0.5); }));
  });
  /** a hand reaching in from the top-right, fingers curled to grip (for tearing / pulling) */
  F.hand = (o = {}) => K.draw(560, 560, (x, u) => {
    const sleeve = 'M560,0 L560,210 L420,268 L330,150 L440,0 Z';
    u.fill(sleeve, u.lg(330, 0, 560, 0, [[0, 0.36], [1, 0.16]]));
    u.clip(sleeve, () => u.soft(10, () => u.fill('M330,130 L440,130 L440,280 L330,280 Z', 0.12)));
    u.fill('M342,150 L420,262 L404,276 L326,166 Z', 0.85);
    const back = 'M340,170 Q300,170 250,206 Q196,246 182,300 Q178,330 206,344 L300,330 Q378,300 404,266 Z';
    u.fill(back, u.rg(300, 240, 10, 150, [[0, 0.78], [0.7, 0.62], [1, 0.46]]));
    const fingers = [[200, 300, 0.5], [218, 330, 0.42], [244, 350, 0.36], [276, 360, 0.3]];
    fingers.forEach(([fx, fy, rot], i) => u.at(fx, fy, rot + 0.9, () => {
      u.rect(-17, -10, 34, 96, u.lg(-17, 0, 17, 0, [[0, 0.74 - i * 0.03], [1, 0.48 - i * 0.03]]), 16);
      u.soft(1.5, () => { u.fill('M-12,36 L12,36 L12,40 L-12,40 Z', 0.42); u.ell(0, 78, 9, 6, 0.86); });
    }));
    u.at(330, 300, -0.5, () => { u.rect(-16, -10, 32, 92, u.lg(-16, 0, 16, 0, [[0, 0.7], [1, 0.46]]), 15); u.ell(0, 74, 8, 6, 0.84); });
    u.clip(back, () => u.soft(6, () => { u.fill('M240,210 L270,200 L250,300 L224,300 Z', 0.5); u.fill('M280,196 L304,190 L290,300 L266,300 Z', 0.52); }));
  });
  /** clock face (wall clock / time clock) at a given time */
  F.clock = (o = {}) => K.draw(400, 400, (x, u) => {
    const c = 200, hh = o.h ?? 9, mm = o.m ?? 0;
    u.ell(c, c, 196, 196, u.rg(c - 40, c - 50, 10, 200, [[0, 0.62], [0.8, 0.32], [1, 0.18]]));
    u.ell(c, c, 170, 170, u.rg(c - 30, c - 40, 10, 180, [[0, 0.96], [0.85, 0.84], [1, 0.62]]));
    for (let k = 0; k < 60; k++) {
      const a = (k / 60) * Math.PI * 2, big = k % 5 === 0, r0 = big ? 128 : 146, r1 = 160;
      u.stroke(`M${c + Math.sin(a) * r0},${c - Math.cos(a) * r0} L${c + Math.sin(a) * r1},${c - Math.cos(a) * r1}`, 0.14, big ? 9 : 3, 'butt');
    }
    const ha = ((hh % 12) + mm / 60) / 12 * Math.PI * 2, ma = (mm / 60) * Math.PI * 2;
    if (o.hands === false) { u.ell(c, c, 12, 12, 0.08); u.soft(14, () => u.ell(c - 70, c - 80, 70, 40, 'rgba(255,255,255,0.35)', -0.6)); return; }
    u.soft(3, () => { u.stroke(`M${c + 6},${c + 8} L${c + 6 + Math.sin(ha) * 90},${c + 8 - Math.cos(ha) * 90}`, 0.55, 16); });
    u.stroke(`M${c},${c} L${c + Math.sin(ha) * 90},${c - Math.cos(ha) * 90}`, 0.1, 14);
    u.stroke(`M${c},${c} L${c + Math.sin(ma) * 135},${c - Math.cos(ma) * 135}`, 0.1, 9);
    u.ell(c, c, 12, 12, 0.08);
    u.soft(14, () => u.ell(c - 70, c - 80, 70, 40, 'rgba(255,255,255,0.35)', -0.6));
  });
  /** a time clock / punch clock machine (clock on top, card slot below) */
  F.punchClock = (o = {}) => K.draw(260, 460, (x, u) => {
    const face = F.clock({ h: o.h ?? 8, m: o.m ?? 58 });
    u.rect(30, 150, 200, 280, u.lg(30, 0, 230, 0, [[0, 0.5], [0.5, 0.36], [1, 0.2]]), 18);
    u.rect(40, 160, 180, 14, 0.62, 6);
    u.rect(84, 300, 92, 18, 0.06, 4);
    u.rect(70, 340, 120, 60, u.lg(0, 340, 0, 400, [[0, 0.3], [1, 0.16]]), 8);
    u.rect(60, 424, 140, 22, 0.14, 6);
    u.ell(130, 116, 112, 112, 0.18);
    x.drawImage(face, 30, 16, 200, 200);
    u.rect(104, 270, 52, 64, u.lg(104, 0, 156, 0, [[0, 0.94], [1, 0.78]]), 2);
    for (let k = 0; k < 5; k++) u.rect(110, 280 + k * 10, 40, 2, 0.4);
  });
  /** pendant studio / office lamp, with a hot bulb */
  F.lamp = (o = {}) => K.draw(180, 220, (x, u) => {
    u.stroke('M90,0 L90,70', 0.15, 4);
    const shade = 'M44,150 Q50,84 90,72 Q130,84 136,150 Z';
    u.fill(shade, u.lg(44, 0, 136, 0, [[0, 0.62], [0.4, 0.4], [1, 0.16]]));
    u.ell(90, 150, 47, 12, 0.08);
    u.soft(8, () => u.ell(90, 158, 30, 14, 'rgba(255,255,255,0.95)'));
    u.ell(90, 154, 20, 9, 1);
  });
  /** potted plant: lots of overlapping leaves (gives the halftone something photographic to chew on) */
  F.plant = (o = {}) => K.draw(260, 420, (x, u) => {
    const r = X.rand(o.seed ?? 11);
    for (let k = 0; k < 34; k++) {
      const a = -Math.PI / 2 + (r() - 0.5) * 2.4, L = 90 + r() * 120, cx = 130 + Math.cos(a) * L * 0.6, cy = 270 + Math.sin(a) * L;
      u.stroke(`M130,290 Q${130 + Math.cos(a) * L * 0.2},${270 + Math.sin(a) * L * 0.5} ${cx},${cy}`, 0.2 + r() * 0.1, 3);
      u.at(cx, cy, a + Math.PI / 2 + (r() - 0.5) * 0.6, () => u.ell(0, 0, 14 + r() * 8, 34 + r() * 18, u.lg(-20, 0, 20, 0, [[0, 0.62 - r() * 0.2], [1, 0.22 + r() * 0.1]])));
    }
    u.fill('M84,290 L176,290 L164,410 L96,410 Z', u.lg(84, 0, 176, 0, [[0, 0.82], [0.5, 0.66], [1, 0.42]]));
    u.rect(78, 282, 104, 16, 0.86, 3);
  });
  /** a stack of paper reports, bound (the "old way" artefact) */
  F.reports = (o = {}) => K.draw(260, 260, (x, u) => {
    const r = X.rand(o.seed ?? 4);
    for (let k = 0; k < (o.n ?? 9); k++) {
      const y = 230 - k * 22, dx = (r() - 0.5) * 16;
      u.rect(30 + dx, y - 18, 200, 20, u.lg(30, 0, 230, 0, [[0, 0.95], [1, 0.72]]), 2);
      u.rect(30 + dx, y - 18, 200, 4, 0.55 + r() * 0.3, 1);
      u.rect(30 + dx, y, 200, 2, 0.4);
    }
  });

  // ------------------------------------------------------------------ stipple (dithered light / shadow spray)
  /** canvas of hard dots whose probability = f(u,v) in [0,1] (u,v in 0..1); f>=1 → solid. Returns data URL. */
  K.stippleURL = (w, h, f, o = {}) => {
    const c = canvas(w, h), x = c.getContext('2d'), img = x.createImageData(w, h), d = img.data, r = X.rand(o.seed ?? 21);
    const col = hex(o.color ?? K.P.cream), dot = o.dot ?? 2, gam = o.gamma ?? 1.6;
    for (let y = 0; y < h; y += dot) for (let xx = 0; xx < w; xx += dot) {
      const p = f(xx / w, y / h);
      if (p <= 0) continue;
      const on = p >= 1 || r() < Math.pow(p, gam);
      if (!on) continue;
      for (let a = 0; a < dot; a++) for (let b = 0; b < dot; b++) {
        const i = ((y + a) * w + xx + b) * 4;
        if (i >= d.length) continue;
        d[i] = col[0]; d[i + 1] = col[1]; d[i + 2] = col[2]; d[i + 3] = 255;
      }
    }
    x.putImageData(img, 0, 0);
    return c.toDataURL('image/png');
  };
  K.falloff = {
    disc: (core = 0.55) => (u, v) => { const r = Math.hypot(u - 0.5, v - 0.5) * 2; return r <= core ? 1 : clamp(1 - (r - core) / (1 - core), 0, 1); },
    rect: (cx = 0.3, cy = 0.3) => (u, v) => { const a = Math.abs(u - 0.5) * 2, b = Math.abs(v - 0.5) * 2; const k = Math.max((a - (1 - cx)) / cx, (b - (1 - cy)) / cy); return k <= 0 ? 1 : clamp(1 - k, 0, 1); },
    cone: (top = 0.08) => (u, v) => { const half = top + (0.5 - top) * v; const a = Math.abs(u - 0.5); const e = a / half; return e <= 0.6 ? 1 - v * 0.55 : clamp((1 - (e - 0.6) / 0.4) * (1 - v * 0.55), 0, 1); },
    edge: (side = 'left', width = 0.3) => (u, v) => { const t = side === 'left' ? u : side === 'right' ? 1 - u : side === 'top' ? v : 1 - v; return clamp(1 - t / width, 0, 1); },
  };
  /** place a stipple image: o {x, y, w, h, shape:'disc'|'rect'|'cone'|fn, color, dot, core, opacity, seed} */
  K.stipple = (parent, o = {}) => {
    const w = o.w ?? 400, h = o.h ?? w;
    const f = typeof o.shape === 'function' ? o.shape : o.shape === 'rect' ? K.falloff.rect(o.cx, o.cy) : o.shape === 'cone' ? K.falloff.cone(o.top) : K.falloff.disc(o.core ?? 0.5);
    const res = o.res ?? 0.5;
    const url = K.stippleURL(Math.round(w * res), Math.round(h * res), f, { color: o.color, dot: o.dot ?? 1, seed: o.seed, gamma: o.gamma });
    return X.svg('image', { href: url, x: (o.x ?? 0) - w / 2, y: (o.y ?? 0) - h / 2, width: w, height: h, opacity: o.opacity ?? 1, preserveAspectRatio: 'none', style: { imageRendering: 'pixelated' } }, parent);
  };

  // ------------------------------------------------------------------ paper, tape, scribbles
  const paperCache = {};
  K.paperURL = (color, w, h, strength = 0.08, seed = 3) => {
    const key = [color, w, h, strength, seed].join('|');
    return paperCache[key] || (paperCache[key] = X.paper(color, w, h, strength, seed));
  };
  let clipN = 0;
  /** torn paper scrap with paper texture. o {x, y, w, h, color, jag, seed, rot, shadow, tex} — (x,y) = centre */
  K.scrap = (parent, o = {}) => {
    const w = o.w ?? 300, h = o.h ?? 200, id = `k-clip${++clipN}`;
    const cp = X.svg('clipPath', { id }, X.defs);
    X.svg('path', { d: X.torn(w, h, o.jag ?? 7, o.seed ?? clipN, o.step ?? 12) }, cp);
    const g = X.svg('g', {}, parent);
    const inner = X.svg('g', { filter: o.shadow === false ? null : K.paperShadow }, g);
    if (o.shadow === false) inner.removeAttribute('filter');
    const body = X.svg('g', { 'clip-path': `url(#${id})` }, inner);
    if (o.tex === false) X.svg('rect', { width: w, height: h, fill: o.color ?? K.P.cream }, body);
    else X.svg('image', { href: K.paperURL(o.color ?? K.P.cream, Math.min(480, Math.round(w / 2)), Math.min(480, Math.round(h / 2)), o.strength ?? 0.09, o.seed ?? 3), width: w, height: h, preserveAspectRatio: 'none' }, body);
    gsap.set(inner, { x: -w / 2, y: -h / 2 });
    gsap.set(g, { x: o.x ?? 0, y: o.y ?? 0, rotation: o.rot ?? 0, transformOrigin: '50% 50%' });
    g._body = body; g._w = w; g._h = h;
    return g;
  };
  /** translucent tape strip; (x,y) = centre */
  K.tape = (parent, x, y, w = 120, rot = 0, o = {}) => {
    const h = o.h ?? 34, g = X.svg('g', {}, parent);
    const p = X.svg('path', { d: X.torn(w, h, 5, o.seed ?? 7, 9), fill: o.color ?? '#F3EBD6', opacity: o.opacity ?? 0.78 }, g);
    X.svg('rect', { x: 0, y: h * 0.18, width: w, height: 2, fill: '#FFFFFF', opacity: 0.35 }, g);
    gsap.set(p, { x: 0 });
    gsap.set(g, { x: x - w / 2, y: y - h / 2, rotation: rot, svgOrigin: `${w / 2} ${h / 2}` });
    return g;
  };
  const jit = (r, a) => (r() - 0.5) * 2 * a;
  K.scribble = {
    /** loose marker loop around (cx,cy) */
    circle(cx, cy, rx, ry, seed = 1, loops = 1.2) {
      const r = X.rand(seed), pts = [], n = Math.round(22 * loops), a0 = -2.2 + jit(r, 0.3);
      for (let i = 0; i <= n; i++) { const a = a0 + (i / n) * Math.PI * 2 * loops, k = 1 + jit(r, 0.05) + i / n * 0.08; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); }
      return K.smooth(pts, false);
    },
    underline(x, y, w, seed = 2) { const r = X.rand(seed), pts = []; for (let i = 0; i <= 6; i++) pts.push([x + (i / 6) * w, y + jit(r, 4) + Math.sin(i) * 2]); pts.push([x + w * 0.2, y + 12 + jit(r, 3)]); return K.smooth(pts, false); },
    cross(cx, cy, s, seed = 3) { const r = X.rand(seed); return `M${cx - s + jit(r, 6)},${cy - s + jit(r, 6)} Q${cx + jit(r, 10)},${cy + jit(r, 10)} ${cx + s + jit(r, 6)},${cy + s + jit(r, 6)} M${cx + s + jit(r, 6)},${cy - s + jit(r, 6)} Q${cx + jit(r, 10)},${cy + jit(r, 10)} ${cx - s + jit(r, 6)},${cy + s + jit(r, 6)}`; },
    tick(cx, cy, s, seed = 4) { const r = X.rand(seed); return `M${cx - s},${cy + jit(r, 3)} Q${cx - s * 0.5},${cy + s * 0.4} ${cx - s * 0.2},${cy + s * 0.75} Q${cx + s * 0.3},${cy - s * 0.4} ${cx + s * 1.1},${cy - s * 0.9 + jit(r, 4)}`; },
    /** three short "talk" strokes radiating from (x,y) toward angle a */
    talk(x, y, a = -0.6, len = 40, seed = 5) {
      const r = X.rand(seed); let d = '';
      for (let k = -1; k <= 1; k++) { const b = a + k * 0.42 + jit(r, 0.08), r0 = 18 + jit(r, 4), r1 = r0 + len * (k === 0 ? 1 : 0.75); d += `M${(x + Math.cos(b) * r0).toFixed(1)},${(y + Math.sin(b) * r0).toFixed(1)} L${(x + Math.cos(b) * r1).toFixed(1)},${(y + Math.sin(b) * r1).toFixed(1)} `; }
      return d;
    },
    /** spiral "hours" doodle */
    spiral(cx, cy, r0, turns = 2.5, seed = 6) { const r = X.rand(seed), pts = []; const n = Math.round(turns * 18); for (let i = 0; i <= n; i++) { const a = (i / 18) * Math.PI * 2, rr = r0 * (0.25 + 0.75 * i / n) * (1 + jit(r, 0.04)); pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]); } return K.smooth(pts, false); },
  };
  /** add a marker stroke path and draw it on at t */
  K.mark = (parent, d, t, o = {}) => {
    const p = X.svg('path', { d, fill: 'none', stroke: o.color ?? K.P.cream, 'stroke-width': o.w ?? 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: o.opacity ?? 1 }, parent);
    if (t != null) { X.drawOn(p, t, o.dur ?? 0.45, o.ease ?? 'power1.out'); if (o.sfx !== false) X.sfx(t, 'scribble', { gain: o.gain ?? 0.25, dur: o.dur ?? 0.45 }); }
    return p;
  };

  // ------------------------------------------------------------------ build helpers
  /** wrap an element in a fresh <g> so a tween never fights a gsap-set position */
  K.wrap = (el) => { const g = document.createElementNS(NS, 'g'); el.parentNode.insertBefore(g, el); g.appendChild(el); return g; };
  /** architecture arrival: rise + fade (power3.out, no bounce on architecture) */
  K.rise = (el, t, dy = 46, dur = 0.55, ease = 'power3.out') => { const g = K.wrap(el); gsap.set(g, { opacity: 0 }); X.tl.fromTo(g, { y: dy, opacity: 0 }, { y: 0, opacity: 1, duration: dur, ease, immediateRender: false }, t); return g; };
  /** round things grow with a small overshoot (back.out 1.2–1.4) */
  K.grow = (el, t, dur = 0.6, ease = 'back.out(1.25)', origin = '50% 100%') => { gsap.set(el, { scale: 0, transformOrigin: origin }); X.tl.fromTo(el, { scale: 0 }, { scale: 1, duration: dur, ease, immediateRender: false }, t); };
  /** transform attribute mapping a flat local (u right, v down) group onto an iso plane facing +y / +x */
  K.planeY = (iso, x0, y0, zTop) => { const [ax, ay] = iso.P(x0, y0, zTop); return `matrix(${0.8660254 * iso.s},${0.5 * iso.s},0,${iso.s},${ax},${ay})`; };
  K.planeX = (iso, x0, y0, zTop) => { const [ax, ay] = iso.P(x0, y0, zTop); return `matrix(${-0.8660254 * iso.s},${0.5 * iso.s},0,${iso.s},${ax},${ay})`; };
  /** iso laptop on a surface at height z; returns the screen polygon (grey until you colourPop a gradient twin) */
  K.laptop = (iso, parent, x, y, z, o = {}) => {
    const g = X.svg('g', {}, parent), w = o.w ?? 62, d = o.d ?? 42, h = o.h ?? 44;
    iso.poly(g, [[x, y, z], [x + w, y, z], [x + w, y + d, z], [x, y + d, z]], o.base ?? '#3E4556');
    iso.poly(g, [[x, y, z], [x + w, y, z], [x + w, y, z + h], [x, y, z + h]], o.lid ?? '#596173');
    iso.poly(g, [[x + 4, y, z + 4], [x + w - 4, y, z + 4], [x + w - 4, y, z + h - 4], [x + 4, y, z + h - 4]], o.grey ?? '#8A90A0');
    const scr = iso.poly(g, [[x + 4, y, z + 4], [x + w - 4, y, z + 4], [x + w - 4, y, z + h - 4], [x + 4, y, z + h - 4]], o.screen ?? K.workH);
    return scr;
  };

  // ------------------------------------------------------------------ hero glyph (own design: page with a folded corner)
  /** returns <g> centred on (0,0); parts: .body .flap .under */
  K.glyph = (parent, s = 120, o = {}) => {
    const g = X.svg('g', {}, parent), f = s * 0.38, h = s / 2;
    const under = X.svg('path', { d: `M${h - f},${-h} L${h},${-h + f} L${h - f},${-h + f} Z`, fill: '#000', opacity: 0.18, transform: 'translate(4,6)' }, g);
    const body = X.svg('path', { d: `M${-h},${-h} L${h - f},${-h} L${h},${-h + f} L${h},${h} L${-h},${h} Z`, fill: o.body ?? K.P.cream, stroke: o.stroke ?? 'none', 'stroke-width': o.sw ?? 0 }, g);
    const flap = X.svg('path', { d: `M${h - f},${-h} L${h - f},${-h + f} L${h},${-h + f} Z`, fill: o.flap ?? K.work }, g);
    g.body = body; g.flap = flap; g.under = under; g.s = s;
    return g;
  };

  // ------------------------------------------------------------------ transitions & camera
  /** iris: a disc grows from (x,y) to cover the frame (power2.in); returns the circle (hide it when the next set is up) */
  K.iris = (parent, t, x, y, color, dur = 0.42) => {
    const c = X.svg('circle', { cx: x, cy: y, r: 0, fill: color }, parent);
    gsap.set(c, { autoAlpha: 0 });
    X.tl.set(c, { autoAlpha: 1 }, t);
    X.tl.fromTo(c, { attr: { r: 0 } }, { attr: { r: Math.hypot(W, H) * 1.05 }, duration: dur, ease: 'power2.in', immediateRender: false }, t);
    X.sfx(t, 'zoom_in', { dur: dur + 0.1, gain: 0.35 });
    return c;
  };
  /** ring burst: filled disc + two rings racing past the frame edge */
  K.ringBurst = (parent, t, x, y, color = K.P.navy, o = {}) => {
    const g = X.svg('g', {}, parent);
    gsap.set(g, { autoAlpha: 0 }); X.tl.set(g, { autoAlpha: 1 }, t);
    const disc = X.svg('circle', { cx: x, cy: y, r: 0, fill: color }, g);
    X.tl.fromTo(disc, { attr: { r: 0 } }, { attr: { r: Math.hypot(W, H) }, duration: o.dur ?? 0.55, ease: 'power2.out', immediateRender: false }, t);
    [0.06, 0.16].forEach((dt, i) => {
      const ring = X.svg('circle', { cx: x, cy: y, r: 0, fill: 'none', stroke: o.ring ?? color, 'stroke-width': 70 - i * 30, opacity: 0.55 }, g);
      X.tl.fromTo(ring, { attr: { r: 0 }, opacity: 0.6 }, { attr: { r: W * 1.25 }, opacity: 0.0, duration: 0.8, ease: 'power2.out', immediateRender: false }, t + dt);
    });
    X.sfx(t, 'whoosh', { dur: 0.6, gain: 0.45 });
    return g;
  };
  /** stipple light-flood: a cream disc with a dithered (stipple) front grows from (x,y) until it fills the frame.
   *  Drawn on an HTML canvas above the SVG with a FIXED per-pixel threshold map, so the dots stay fine and stable
   *  at any radius. o: {dur, color, res (canvas px per frame px, 1/3 → 3 px dots), out: {t, x, y, r, dur} = resolve
   *  into a smaller light shape (e.g. a doorway) and fade}. Returns the canvas. */
  K.lightFlood = (parent, t, x, y, o = {}) => {
    const res = o.res ?? 1 / 3, cw = Math.round(W * res), ch = Math.round(H * res);
    const cv = X.html('canvas', { width: cw, height: ch, style: { position: 'absolute', left: '0', top: '0', width: W + 'px', height: H + 'px', imageRendering: 'pixelated', pointerEvents: 'none', zIndex: o.z ?? 30, display: 'none' } });
    const ctx = cv.getContext('2d'), img = ctx.createImageData(cw, ch), d = img.data, r = X.rand(o.seed ?? 9);
    const thr = new Float32Array(cw * ch); for (let i = 0; i < thr.length; i++) thr[i] = r();
    const col = hex(o.color ?? K.P.cream), dur = o.dur ?? 1, out = o.out;
    const Rmax = Math.hypot(W, H) * 1.1, e1 = gsap.parseEase(o.ease ?? 'sine.inOut'), e2 = gsap.parseEase('power3.out');
    for (let i = 0; i < thr.length; i++) { d[i * 4] = col[0]; d[i * 4 + 1] = col[1]; d[i * 4 + 2] = col[2]; }
    const draw = (cx, cy, R, alpha) => {
      const core = R * (o.core ?? 0.62), band = Math.max(1, R - core), a = Math.round(255 * alpha);
      for (let py = 0; py < ch; py++) { const dy = py / res - cy; for (let px = 0; px < cw; px++) {
        const i = py * cw + px, dist = Math.hypot(px / res - cx, dy), p = dist <= core ? 1 : 1 - (dist - core) / band;
        d[i * 4 + 3] = p > thr[i] * 1.0 ? a : 0;
      } }
      ctx.putImageData(img, 0, 0);
    };
    X.sfx(t, 'woosh_low', { dur: dur + 0.2, gain: 0.4 });
    X.every((tt) => {
      let on = true;
      if (tt >= t && tt < t + dur) draw(x, y, Rmax * e1((tt - t) / dur), 1);
      else if (out && tt >= out.t && tt < out.t + out.dur) {
        const p = e2((tt - out.t) / out.dur);
        draw(x + (out.x - x) * p, y + (out.y - y) * p, Rmax * (1 - p) + (out.r ?? 200) * p, p < 0.55 ? 1 : 1 - (p - 0.55) / 0.45);
      } else if (tt >= t + dur && (!out || tt < out.t) && tt < t + dur + (o.hold ?? 99)) draw(x, y, Rmax * 2, 1);
      else on = false;
      cv.style.display = on ? 'block' : 'none';
    });
    return cv;
  };
  /** colour pop: a grey element gets its gradient twin faded/scaled in (6–8 frames, power2.out) */
  K.colourPop = (el, t, o = {}) => {
    gsap.set(el, { opacity: 0, scale: o.from ?? 0.86, transformOrigin: '50% 50%' });
    X.tl.to(el, { opacity: 1, scale: 1, duration: o.dur ?? 0.24, ease: 'power2.out' }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'bubble', { gain: o.gain ?? 0.3, pitch: o.pitch ?? 1 });
  };
  /** constant slow truck (linear) — the "drift hold" (0.4 % W/s ≈ 7.7 px/s) */
  K.drift = (cam, t0, t1, vx = 7.7, vy = 0, o = {}) => {
    X.tl.fromTo(cam, { x: o.x0 ?? 0, y: o.y0 ?? 0 }, { x: (o.x0 ?? 0) - vx * (t1 - t0), y: (o.y0 ?? 0) - vy * (t1 - t0), duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
  };
  /** expo-out pull-back reveal, then a continuing slow linear pull */
  K.pullBack = (cam, t, from = 2.9, to = 1, dur = 3, o = {}) => {
    X.tl.fromTo(cam, { scale: from, x: o.x0 ?? 0, y: o.y0 ?? 0 }, { scale: to, x: o.x1 ?? 0, y: o.y1 ?? 0, duration: dur, ease: o.ease ?? 'expo.out', immediateRender: false }, t);
    if (o.tail) X.tl.to(cam, { scale: to * (1 - o.tail), duration: o.tailDur ?? 3, ease: 'none' }, t + dur);
    if (o.sfx !== false) X.sfx(t, 'woosh_low', { dur: 1.2, gain: 0.35 });
  };
  /** gradient streamers trailing a leader along a path; returns {leader, ribbons, path}.
   *  o: {d (path data), t, dur, colors, gap, width, trail, retract} */
  K.ribbons = (parent, leader, o) => {
    const g = X.svg('g', {}, parent);
    const ref = X.svg('path', { d: o.d, fill: 'none', stroke: 'none' }, g);
    const L = ref.getTotalLength(), N = 160, pts = [];
    for (let i = 0; i <= N; i++) { const p = ref.getPointAtLength((i / N) * L); pts.push([p.x, p.y]); }
    const cols = o.colors || [K.P.marigold, K.P.tangerine, K.P.pink, K.P.violet], gap = o.gap ?? 16, wd = o.width ?? 13;
    const ribs = cols.map((c, k) => {
      const off = (k - (cols.length - 1) / 2) * gap, q = pts.map((p, i) => { const a = pts[Math.max(0, i - 1)], b = pts[Math.min(N, i + 1)]; const dx = b[0] - a[0], dy = b[1] - a[1], l = Math.hypot(dx, dy) || 1; return [p[0] - (dy / l) * off, p[1] + (dx / l) * off]; });
      return X.svg('path', { d: 'M' + q.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L'), fill: 'none', stroke: c, 'stroke-width': wd, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    });
    parent.appendChild(leader);
    const lens = ribs.map((r) => r.getTotalLength());
    const trail = o.trail ?? 0.45;
    const st = { p: 0, back: 0 };
    const apply = () => {
      const head = st.p, tail = Math.max(0, head - trail) + st.back * (head - Math.max(0, head - trail));
      ribs.forEach((r, k) => { const Lk = lens[k], a = tail * Lk, b = head * Lk; r.setAttribute('stroke-dasharray', `${Math.max(0.01, b - a)} ${Lk * 2}`); r.setAttribute('stroke-dashoffset', -a); });
      const pl = ref.getPointAtLength(head * L), p2 = ref.getPointAtLength(Math.min(L, head * L + 2)), p1 = ref.getPointAtLength(Math.max(0, head * L - 2));
      const ang = Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI;
      gsap.set(leader, { x: pl.x, y: pl.y, rotation: (o.rotate ?? true) ? ang * (1 - (o.settle ? st.back : 0)) : 0 });
    };
    apply();
    X.tl.fromTo(st, { p: 0 }, { p: 1, duration: o.dur ?? 1.5, ease: o.ease ?? 'power2.inOut', onUpdate: apply, immediateRender: false }, o.t);
    if (o.retract != null) X.tl.fromTo(st, { back: 0 }, { back: 1, duration: o.retractDur ?? 0.7, ease: 'power2.in', onUpdate: apply, immediateRender: false }, o.retract);
    X.sfx(o.t, 'whoosh', { dur: (o.dur ?? 1.5) * 0.8, gain: 0.45 });
    return { g, ribs, leader, path: ref, apply };
  };

  // ------------------------------------------------------------------ lockup (tracked caps label + product name)
  K.lockup = (parent, t, label, name, o = {}) => {
    const g = X.svg('g', {}, parent), cx = o.x ?? W / 2, cy = o.y ?? H / 2;
    const lab = X.svg('text', { x: cx, y: cy - (o.gap ?? 62), 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 600, 'font-size': o.labelSize ?? 30, 'letter-spacing': '0.32em', fill: o.color ?? K.P.cream, text: label }, g);
    const nm = X.svg('text', { x: cx, y: cy + 30, 'text-anchor': 'middle', 'font-family': 'Poppins', 'font-weight': 600, 'font-size': o.size ?? 92, fill: o.color ?? K.P.cream, text: name }, g);
    X.tl.fromTo(lab, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, t);
    X.tl.fromTo(nm, { opacity: 0, y: 22 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out', immediateRender: false }, t + 0.12);
    gsap.set([lab, nm], { opacity: 0 });
    X.sfx(t, 'chime', { gain: 0.3 });
    return { g, lab, nm };
  };

  // ------------------------------------------------------------------ motion-quote sub-variant (xerox kinetic type)
  K.quote = {
    /** scanned typewritten-document texture as a data URL (dense mono text, uneven ink) */
    scanURL(w = 900, h = 400, seed = 8) {
      const c = canvas(w, h), x = c.getContext('2d'), r = X.rand(seed);
      x.fillStyle = '#F4F2EC'; x.fillRect(0, 0, w, h);
      const chars = 'abcdefghijklmnopqrstuvwxyz      .,;:0123456789';
      x.font = '600 15px "Roboto Mono", monospace'; x.fillStyle = '#141414';
      for (let y = 18; y < h; y += 19) { let s = ''; for (let k = 0; k < w / 9; k++) s += chars[Math.floor(r() * chars.length)]; x.globalAlpha = 0.55 + r() * 0.45; x.fillText(s, 6 + r() * 4, y); }
      x.globalAlpha = 1;
      const d = x.getImageData(0, 0, w, h), p = d.data;
      for (let i = 0; i < p.length; i += 4) { const n = (r() - 0.5) * 60, v = p[i] + n > 150 ? 244 : 18; p[i] = p[i + 1] = p[i + 2] = v; }
      x.putImageData(d, 0, 0);
      return c.toDataURL('image/png');
    },
    /** three-slot masthead (small mono caps) */
    header(parent, slots, o = {}) {
      const y = o.y ?? 66, col = o.color ?? '#F2F2F0', fs = o.size ?? 28, xs = [o.margin ?? 104, W / 2, W - (o.margin ?? 104)], an = ['start', 'middle', 'end'];
      return slots.map((s, i) => X.svg('text', { x: xs[i], y, 'text-anchor': an[i], 'font-family': 'Roboto Mono', 'font-weight': 500, 'font-size': fs, 'letter-spacing': '0.08em', fill: col, text: s }, parent));
    },
    /** wide-tracked mono word; scan:true fills it with the scanned-document texture + an offset xerox ghost */
    word(parent, text, o = {}) {
      const g = X.svg('g', {}, parent), fs = o.size ?? 150, track = o.track ?? '0.3em';
      const base = { x: o.x ?? W / 2, y: o.y ?? H / 2, 'text-anchor': o.anchor ?? 'middle', 'font-family': 'Roboto Mono', 'font-weight': o.weight ?? 500, 'font-size': fs, 'letter-spacing': track };
      if (o.scan) {
        const id = `k-scan${++clipN}`;
        const pat = X.svg('pattern', { id, patternUnits: 'userSpaceOnUse', width: 900, height: 400 }, X.defs);
        X.svg('image', { href: K.quote.scanURL(900, 400, o.seed ?? 8), width: 900, height: 400 }, pat);
        X.svg('text', { ...base, fill: '#000', opacity: 0.6, transform: 'translate(5,4)', text }, g);
        X.svg('text', { ...base, fill: `url(#${id})`, text }, g);
      } else X.svg('text', { ...base, fill: o.color ?? '#FDFDFD', text }, g);
      return g;
    },
    /** letter-by-letter reveal on steps (2–4 frames per letter) */
    reveal(g, t, perLetter = 0.1) {
      const texts = [...g.querySelectorAll('text')];
      const full = texts[0].textContent;
      const o = { n: 0 };
      texts.forEach((tx) => (tx.textContent = ''));
      X.tl.to(o, { n: full.length, duration: full.length * perLetter, ease: 'none', onUpdate: () => texts.forEach((tx) => (tx.textContent = full.slice(0, Math.round(o.n)))) }, t);
      for (let k = 0; k < full.length; k++) if (full[k] !== ' ') X.sfx(t + k * perLetter, 'type', { gain: 0.18 });
    },
    /** torn photocopy strip of high-contrast noise along the bottom */
    xeroxStrip(parent, o = {}) {
      const w = 960, h = 40, c = canvas(w, h), x = c.getContext('2d'), r = X.rand(o.seed ?? 12), img = x.createImageData(w, h), d = img.data;
      for (let yy = 0; yy < h; yy++) for (let xx = 0; xx < w; xx++) { const i = (yy * w + xx) * 4, band = Math.sin(xx * 0.05 + yy * 0.3) * 0.3 + Math.sin(xx * 0.013) * 0.4; const v = r() + band > 0.75 ? 240 : 10; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
      x.putImageData(img, 0, 0);
      const id = `k-xclip${++clipN}`, cp = X.svg('clipPath', { id }, X.defs);
      X.svg('path', { d: X.torn(W + 40, (o.h ?? 46), 10, 5, 10) }, cp);
      const g = X.svg('g', { transform: `translate(-20, ${H - (o.h ?? 46)})` }, parent);
      X.svg('image', { href: c.toDataURL('image/png'), width: W + 40, height: o.h ?? 46, preserveAspectRatio: 'none', 'clip-path': `url(#${id})` }, g);
      return g;
    },
    /** white dust speckle that re-rolls at `fps` */
    dust(parent, o = {}) {
      const g = X.svg('g', { opacity: o.opacity ?? 0.5 }, parent), n = o.n ?? 140, r = X.rand(o.seed ?? 31);
      const dots = Array.from({ length: n }, () => X.svg('circle', { r: 0.8 + r() * 1.6, fill: '#FFFFFF' }, g));
      const seeds = Array.from({ length: 16 }, (_, k) => { const q = X.rand(100 + k); return dots.map(() => [q() * W, q() * H]); });
      X.every((t) => { const s = seeds[Math.floor(t * (o.fps ?? 12)) % 16]; dots.forEach((d, i) => { d.setAttribute('cx', s[i][0]); d.setAttribute('cy', s[i][1]); }); });
      return g;
    },
  };
})();
