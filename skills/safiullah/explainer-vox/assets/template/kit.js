/* explainer-vox kit — Vox-style "annotated evidence" helpers for explainer-engine (window.X).
 *
 * Load after /engine/lib/explainer.js and before scene.js; call VK.init(X) first thing in X.boot.
 * Everything is a pure function of the timeline (X.tl tweens or X.every hooks) — safe for out-of-order seeks.
 *
 *   palette     VK.C                      kit A "slate + orange" roles (swap per episode: one accent + one secondary)
 *   camera      VK.camera(parent)         .cut(t,{s,cx,cy,r},push) .move(t,dur,to,ease) .push(t,{rate,dx,dy})  creeping push always on
 *   evidence    await VK.photo(svg,opts)  rasterise an illustrated SVG into a "photo" (colour / mono / halftone print) → data URL
 *               VK.image · VK.dieCut · VK.medallion · VK.plate (paper cut-out with grain + soft cast shadow)
 *   annotate    VK.ellipse · VK.tag · VK.subTag · VK.chip · VK.highlight · VK.arrow · VK.bracket · VK.dimExcept · VK.typed
 *   data        VK.chart (scale-chase line chart: the y-axis keeps rescaling while the line draws) · VK.axis (timeline spine)
 *   brand/end   VK.bug (own small wordmark, top-right) · VK.sting (own logo sting at 17–25 %) · VK.credits (yellow-rule card)
 *   fades       VK.fadeIn / VK.fadeOut (cross-dissolve photo → slate ground)
 */
(function () {
  const VK = (window.VK = {});
  const C = (VK.C = {
    ground: '#2B3340', ground2: '#242D38', credits: '#222222',
    paper: '#E8E9E8', paperCool: '#C7D8D8', paperWarm: '#ECE6D8', white: '#F5F5F3',
    orange: '#E5893C', orangeDeep: '#C6662A', sage: '#5E817F', sage2: '#7F8A80',
    hilite: '#ECF91F', ellipse: '#D6DE24', grey: '#A2A4A6', shadow: '#13120E', ink: '#23272D', text: '#F5F5F3',
  });
  const SANS = (VK.SANS = "Inter, 'Segoe UI', Arial, sans-serif");
  let X = null, uidN = 0;
  const uid = (VK.uid = (p = 'vk') => `${p}${++uidN}`);

  VK.init = (x) => {
    X = x;
    X.shadow('vkShadow', 0, 10, 10, C.shadow, 0.38);
    X.shadow('vkShadowSm', 0, 4, 5, C.shadow, 0.35);
    X.shadow('vkShadowLg', 0, 18, 18, C.shadow, 0.42);
    // paper grain (near-white noise, multiplied over plate colours)
    const tex = X.paper('#ffffff', 1200, 900, 0.17, 11);
    const pat = X.svg('pattern', { id: 'vkPaper', patternUnits: 'userSpaceOnUse', width: 1200, height: 900 }, X.defs);
    X.svg('image', { href: tex, width: 1200, height: 900 }, pat);
    // slight ink bleed for printed text on documents
    const f = X.svg('filter', { id: 'vkInk', x: '-2%', y: '-2%', width: '104%', height: '104%' }, X.defs);
    X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.9, numOctaves: 1, seed: 4, result: 'n' }, f);
    X.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 1.6, xChannelSelector: 'R', yChannelSelector: 'G' }, f);
    // soft "lens" softness for vector overlays that sit on photos (clock hands, props)
    const s = X.svg('filter', { id: 'vkSoft', x: '-10%', y: '-10%', width: '120%', height: '120%' }, X.defs);
    X.svg('feGaussianBlur', { stdDeviation: 0.9 }, s);
    return VK;
  };

  // ------------------------------------------------------------------ text measuring
  let meas = null;
  VK.measure = (text, size, weight = 800, family = SANS, style = 'normal') => {
    if (!meas) meas = X.svg('text', { x: -9999, y: -9999, 'aria-hidden': 'true' }, X.root);
    meas.setAttribute('font-size', size); meas.setAttribute('font-weight', weight);
    meas.setAttribute('font-family', family); meas.setAttribute('font-style', style);
    meas.textContent = text;
    return meas.getComputedTextLength();
  };
  VK.text = (parent, x, y, text, o = {}) => X.svg('text', {
    x, y, text, 'font-family': o.family ?? SANS, 'font-size': o.size ?? 32, 'font-weight': o.weight ?? 700,
    'font-style': o.style ?? 'normal', fill: o.fill ?? C.text, 'text-anchor': o.anchor ?? 'start',
    'letter-spacing': o.ls ?? 0, opacity: o.op ?? 1,
  }, parent);

  /** Catmull-Rom → cubic Bézier path through points [[x,y],...] */
  VK.smooth = (P) => {
    let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
    for (let i = 0; i < P.length - 1; i++) {
      const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
      d += `C${(p1[0] + (p2[0] - p0[0]) / 6).toFixed(1)},${(p1[1] + (p2[1] - p0[1]) / 6).toFixed(1)} ` +
        `${(p2[0] - (p3[0] - p1[0]) / 6).toFixed(1)},${(p2[1] - (p3[1] - p1[1]) / 6).toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  };

  // ------------------------------------------------------------------ camera
  /** A world-space camera group. Base framing changes by cuts (instant) and moves (eased); a creeping linear push
   *  (Vox: 0.25–0.30 % scale per second plus a small drift) runs on top and restarts at every cut / push() call. */
  VK.camera = (parent, init = {}) => {
    const g = X.svg('g', {}, parent);
    const keys = [], pushes = [], base0 = { s: 1, cx: 960, cy: 540, r: 0, ...init };
    let sorted = false;
    const api = {
      g,
      cut(t, st = {}, push = {}) { keys.push({ t, dur: 0, to: st }); sorted = false; api.push(t, push); return api; },
      move(t, dur, to, ease = 'power2.inOut') { keys.push({ t, dur, to, ease: gsap.parseEase(ease) }); sorted = false; return api; },
      push(t, { rate = 0.0028, dx = 0, dy = 0, dr = 0 } = {}) { pushes.push({ t, rate, dx, dy, dr }); sorted = false; return api; },
      /** freeze the current framing (push included) as the new base at t and restart the creeping push from there —
       *  use before a long move into a new set inside the same world, so nothing jumps */
      hold(t, push = {}) { const s = api.at(t); keys.push({ t, dur: 0, to: { s: s.s, cx: s.cx, cy: s.cy, r: s.r } }); sorted = false; api.push(t, push); return api; },
      at(t) {
        if (!sorted) { keys.sort((a, b) => a.t - b.t); pushes.sort((a, b) => a.t - b.t); sorted = true; }
        const st = { ...base0 };
        for (const k of keys) {
          if (t < k.t) break;
          if (k.dur === 0 || t >= k.t + k.dur) { Object.assign(st, k.to); continue; }
          const p = k.ease((t - k.t) / k.dur);
          for (const key of Object.keys(k.to)) st[key] += (k.to[key] - st[key]) * p;
          break;
        }
        let pu = null;
        for (const p of pushes) { if (p.t <= t) pu = p; else break; }
        if (pu) { const e = t - pu.t; st.s *= 1 + pu.rate * e; st.cx += pu.dx * e; st.cy += pu.dy * e; st.r += pu.dr * e; }
        return st;
      },
    };
    X.every((t) => {
      const s = api.at(t);
      g.setAttribute('transform', `translate(960 540) rotate(${s.r.toFixed(4)}) scale(${s.s.toFixed(5)}) translate(${(-s.cx).toFixed(2)} ${(-s.cy).toFixed(2)})`);
    });
    return api;
  };

  /** Keyframe track → pure function of t. keys: [[t, dur, value, ease?], ...] (holds between keys).
   *  value may be a number or an array of numbers. Use with X.every for anything driven per frame. */
  VK.track = (v0, keys) => {
    const K = keys.map(([t, dur, v, e]) => ({ t, dur, v, e: gsap.parseEase(e || 'power2.inOut') })).sort((a, b) => a.t - b.t);
    const lerp = (a, b, p) => (Array.isArray(a) ? a.map((x, i) => x + (b[i] - x) * p) : a + (b - a) * p);
    return (t) => {
      let v = v0;
      for (const k of K) {
        if (t < k.t) break;
        if (k.dur <= 0 || t >= k.t + k.dur) { v = k.v; continue; }
        return lerp(v, k.v, k.e((t - k.t) / k.dur));
      }
      return v;
    };
  };

  /** Stroke draw-on that never shows a round-cap dot before it starts (X.drawOn's dasharray L / offset L leaves one). */
  VK.drawOn = (el, t, dur = 0.5, ease = 'power1.out') => {
    const L = el.getTotalLength ? el.getTotalLength() : 1000, w = +(el.getAttribute('stroke-width') || 8);
    gsap.set(el, { strokeDasharray: `${L} ${2 * L + 4 * w}`, strokeDashoffset: L + 2 * w });
    X.tl.fromTo(el, { strokeDashoffset: L + 2 * w }, { strokeDashoffset: 0, duration: dur, ease, immediateRender: false }, t);
  };

  // ------------------------------------------------------------------ fades
  VK.fadeIn = (el, t, dur = 0.5) => { gsap.set(el, { opacity: 0 }); X.tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'none', immediateRender: false }, t); };
  VK.fadeOut = (el, t, dur = 0.5) => { X.tl.fromTo(el, { opacity: 1 }, { opacity: 0, duration: dur, ease: 'none', immediateRender: false }, t); };

  // ------------------------------------------------------------------ evidence: "photos" built in code
  /** Rasterise an SVG illustration and give it a photographic / print finish. Returns a JPEG data URL.
   *  svg: inner markup for a W×H viewBox (defs allowed). Only system fonts work inside (Georgia, Times New Roman, Arial).
   *  o.mode: 'photo' (colour, graded) · 'mono' (greyscale/duotone) · 'halftone' (newsprint dots)
   *  o: {w,h,res, blur, contrast, sat, lift, grain, vignette, exposure, warm:[r,g,b] highlight tint, cool:[r,g,b] shadow tint,
   *      tint:[r,g,b] (mono), pitch, angle, ink, paper (halftone), seed} */
  VK.photo = async (svg, o = {}) => {
    const W = o.w ?? 1920, H = o.h ?? 1080, S = o.res ?? 1, cw = Math.round(W * S), ch = Math.round(H * S);
    const root = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="${cw}" height="${ch}" viewBox="0 0 ${W} ${H}">${svg}</svg>`;
    const url = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(root);
    const img = new Image();
    img.src = url;
    await img.decode();
    const c = document.createElement('canvas'); c.width = cw; c.height = ch;
    const g = c.getContext('2d', { willReadFrequently: true });
    g.filter = `blur(${(o.blur ?? 0.7) * S}px)`;
    g.drawImage(img, 0, 0, cw, ch);
    g.filter = 'none';
    const im = g.getImageData(0, 0, cw, ch), d = im.data, R = X.rand(o.seed ?? 5);
    const mode = o.mode ?? 'photo';
    const con = o.contrast ?? 1.08, sat = o.sat ?? 0.85, lift = o.lift ?? 0.03, grain = o.grain ?? 0.045, vig = o.vignette ?? 0.32, ex = o.exposure ?? 1;
    const warm = o.warm ?? [1.04, 1.0, 0.94], cool = o.cool ?? [0.94, 1.0, 1.06], tint = o.tint ?? [1.0, 0.96, 0.88];
    if (mode === 'halftone') {
      const L = new Float32Array(cw * ch);
      for (let i = 0, j = 0; j < L.length; i += 4, j++) L[j] = (0.299 * d[i] + 0.587 * d[i + 1] + 0.114 * d[i + 2]) / 255;
      const pitch = (o.pitch ?? 7) * S, a = ((o.angle ?? 45) * Math.PI) / 180, ca = Math.cos(a), sa = Math.sin(a);
      const ink = o.ink ?? [28, 26, 24], pap = o.paper ?? [233, 228, 214], gam = o.gamma ?? 1.15;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const u = (x * ca + y * sa) / pitch, v = (-x * sa + y * ca) / pitch;
        const iu = Math.floor(u) + 0.5, iv = Math.floor(v) + 0.5;
        const sx = Math.min(cw - 1, Math.max(0, Math.round((iu * ca - iv * sa) * pitch)));
        const sy = Math.min(ch - 1, Math.max(0, Math.round((iu * sa + iv * ca) * pitch)));
        let lum = L[sy * cw + sx];
        lum = Math.min(1, Math.max(0, 0.5 + (lum - 0.5) * con));
        const k = Math.pow(1 - lum, gam), rad = Math.sqrt(k) * pitch * 0.74;
        const dist = Math.hypot(u - iu, v - iv) * pitch;
        const cover = Math.min(1, Math.max(0, (rad - dist) / (0.9 * S) + 0.5));
        const n = (R() - 0.5) * 18, i = (y * cw + x) * 4;
        for (let q = 0; q < 3; q++) d[i + q] = pap[q] + n + (ink[q] - pap[q] - n) * cover;
      }
    } else {
      const cx = cw / 2, cy = ch / 2, md = cx * cx + cy * cy;
      for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) {
        const i = (y * cw + x) * 4;
        let r = d[i] / 255, gg = d[i + 1] / 255, b = d[i + 2] / 255;
        const l0 = 0.299 * r + 0.587 * gg + 0.114 * b;
        if (mode === 'mono') { r = l0 * tint[0]; gg = l0 * tint[1]; b = l0 * tint[2]; }
        else {
          r = l0 + (r - l0) * sat; gg = l0 + (gg - l0) * sat; b = l0 + (b - l0) * sat;
          const hi = l0 * l0, lo = (1 - l0) * (1 - l0);
          r *= 1 + (warm[0] - 1) * hi + (cool[0] - 1) * lo; gg *= 1 + (warm[1] - 1) * hi + (cool[1] - 1) * lo; b *= 1 + (warm[2] - 1) * hi + (cool[2] - 1) * lo;
        }
        // S-curve contrast, lifted blacks, vignette, luma grain
        const dx = x - cx, dy = y - cy, vv = ex * (1 - vig * Math.pow((dx * dx + dy * dy) / md, 1.4));
        const n = (R() + R() - 1) * grain;
        r = lift + (1 - lift) * (0.5 + (r - 0.5) * con); gg = lift + (1 - lift) * (0.5 + (gg - 0.5) * con); b = lift + (1 - lift) * (0.5 + (b - 0.5) * con);
        d[i] = (r * vv + n) * 255; d[i + 1] = (gg * vv + n) * 255; d[i + 2] = (b * vv + n) * 255;
      }
    }
    g.putImageData(im, 0, 0);
    return c.toDataURL('image/jpeg', 0.9);
  };

  VK.image = (parent, href, o = {}) => X.svg('image', { href, x: o.x ?? 0, y: o.y ?? 0, width: o.w ?? 1920, height: o.h ?? 1080, preserveAspectRatio: o.par ?? 'none' }, parent);

  /** Die-cut photo sticker: the silhouette path d (in the image's local box) clips the image; the same path drawn
   *  underneath with a fat accent stroke shows a 12–14 px outline. Pass href=null to cut out vector content (o.content). */
  VK.dieCut = (parent, href, d, o = {}) => {
    const g = X.svg('g', { transform: `translate(${o.x ?? 0} ${o.y ?? 0}) rotate(${o.rot ?? 0})` }, parent);
    const sh = X.svg('g', { filter: 'url(#vkShadow)' }, g);
    X.svg('path', { d, fill: o.outline ?? C.orange, stroke: o.outline ?? C.orange, 'stroke-width': (o.width ?? 13) * 2, 'stroke-linejoin': 'round' }, sh);
    const id = uid('vkDc'), cp = X.svg('clipPath', { id }, X.defs);
    X.svg('path', { d }, cp);
    const body = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    if (href) X.svg('image', { href, width: o.w, height: o.h, preserveAspectRatio: 'none' }, body);
    return { g, body };
  };

  /** Circular "tax medallion": greyscale photo inside an accent ring, label set on an arc in the ring. */
  VK.medallion = (parent, href, o) => {
    const { cx, cy, r, ring = C.orange, label } = o, rw = o.ringW ?? (label ? r * 0.2 : r * 0.1), ri = r - rw;
    const g = X.svg('g', { transform: `translate(${cx} ${cy})` }, parent);
    X.svg('circle', { r, fill: ring, filter: 'url(#vkShadow)' }, g);
    const id = uid('vkMd'), cp = X.svg('clipPath', { id }, X.defs);
    X.svg('circle', { r: ri }, cp);
    X.svg('image', { href, x: -ri, y: -ri, width: 2 * ri, height: 2 * ri, 'clip-path': `url(#${id})`, preserveAspectRatio: 'xMidYMid slice' }, g);
    X.svg('circle', { r: ri, fill: 'none', stroke: '#000', 'stroke-opacity': 0.25, 'stroke-width': 2 }, g);
    if (label) {
      const ar = r - rw / 2, pid = uid('vkArc');
      X.svg('path', { id: pid, d: `M${-ar},0 A${ar},${ar} 0 0 1 ${ar},0`, fill: 'none' }, X.defs);
      const tx = X.svg('text', { 'font-family': SANS, 'font-size': o.labelSize ?? rw * 0.6, 'font-weight': 800, fill: '#fff', 'letter-spacing': 2, 'dominant-baseline': 'central' }, g);
      X.svg('textPath', { href: `#${pid}`, startOffset: '50%', 'text-anchor': 'middle', text: label }, tx);
    }
    return g;
  };

  /** Paper plate (oval / rounded rect / torn): flat fill, multiplied paper grain, soft cast shadow. Children go in .body */
  VK.platePath = (shape, w, h, o = {}) => {
    if (shape === 'oval') return `M0,${h / 2} A${w / 2},${h / 2} 0 1 1 ${w},${h / 2} A${w / 2},${h / 2} 0 1 1 0,${h / 2}Z`;
    if (shape === 'torn') return X.torn(w, h, o.jag ?? 7, o.seed ?? 1, o.step ?? 9);
    const r = o.rx ?? 6;
    return `M${r},0H${w - r}Q${w},0 ${w},${r}V${h - r}Q${w},${h} ${w - r},${h}H${r}Q0,${h} 0,${h - r}V${r}Q0,0 ${r},0Z`;
  };
  VK.plate = (parent, o) => {
    const { x = 0, y = 0, w, h, shape = 'rect', color = C.paper, rot = 0, tex = 0.6 } = o;
    const g = X.svg('g', { transform: `translate(${x} ${y}) rotate(${rot})` }, parent);
    const d = VK.platePath(shape, w, h, o);
    const base = X.svg('path', { d, fill: color }, g);
    if (o.shadow !== false) base.setAttribute('filter', `url(#${o.shadowId ?? 'vkShadow'})`);
    if (tex) X.svg('path', { d, fill: 'url(#vkPaper)', opacity: tex, style: { mixBlendMode: 'multiply' } }, g);
    const body = X.svg('g', {}, g);
    return { g, body, d };
  };

  // ------------------------------------------------------------------ annotation layer
  /** Hand-drawn ellipse: 380°+ stroke with radius wobble so the ends overlap imperfectly. Starts drawing at t. */
  VK.ellipse = (parent, t, o) => {
    const { cx, cy, rx, ry, rot = -6, dur = 0.36, color = C.ellipse, width = 8, seed = 3, span = 388, start = -115 } = o;
    const R = X.rand(seed), ph = [R() * 6.28, R() * 6.28], N = 80, pts = [];
    for (let i = 0; i <= N; i++) {
      const k = i / N, a = ((start + span * k) * Math.PI) / 180;
      const n = 1 + 0.022 * Math.sin(2 * a + ph[0]) + 0.014 * Math.sin(3 * a + ph[1]) + 0.05 * (k - 0.5);
      pts.push([rx * n * Math.cos(a), ry * n * Math.sin(a)]);
    }
    const g = X.svg('g', { transform: `translate(${cx} ${cy}) rotate(${rot})` }, parent);
    const p = X.svg('path', { d: VK.smooth(pts), fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    VK.drawOn(p, t, dur, 'power1.out');
    if (o.sfx !== false) X.sfx(t, 'scribble', { dur: dur + 0.1, gain: o.gain ?? 0.16 });
    return g;
  };

  /** Tilted colour tag: box + bold white text revealed together by a left→right mask wipe (6 frames). x,y = left-middle. */
  VK.tag = (parent, t, text, o = {}) => {
    const size = o.size ?? 52, weight = o.weight ?? 800, fill = o.fill ?? C.orange, color = o.color ?? '#fff';
    const padX = o.padX ?? Math.round(size * 0.3), h = Math.round(size * (o.hk ?? 1.28));
    const w = Math.round(VK.measure(text, size, weight) + padX * 2);
    const ax = o.anchor === 'end' ? -w : o.anchor === 'middle' ? -w / 2 : 0;
    const g = X.svg('g', { transform: `translate(${o.x} ${o.y}) rotate(${o.rot ?? -4})` }, parent);
    const id = uid('vkTag'), cp = X.svg('clipPath', { id }, X.defs);
    const cr = X.svg('rect', { x: ax - 6, y: -h / 2 - 6, width: 0, height: h + 12 }, cp);
    const inner = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    X.svg('rect', { x: ax, y: -h / 2, width: w, height: h, fill }, inner);
    X.svg('text', { x: ax + padX, y: size * 0.36, 'font-family': SANS, 'font-size': size, 'font-weight': weight, fill: color, text }, inner);
    X.tl.fromTo(cr, { attr: { width: 0 } }, { attr: { width: w + 12 }, duration: o.dur ?? 0.22, ease: 'power2.out', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, 'click', { gain: o.gain ?? 0.2, pitch: 1.25 });
    return { g, w, h, x: o.x, y: o.y };
  };
  /** Secondary fact tag: sage, ~70 % of the main tag, enters ~2 s after it (offset down-right). */
  VK.subTag = (parent, t, text, o = {}) => VK.tag(parent, t, text, { size: 36, fill: C.sage, rot: -3, ...o });

  /** Value chip: square box, white numerals, small overshoot pop (6 frames). x,y = centre. */
  VK.chip = (parent, t, text, o = {}) => {
    const size = o.size ?? 34, padX = o.padX ?? size * 0.35, h = size * 1.4, w = VK.measure(text, size, o.weight ?? 800) + padX * 2;
    const g = X.svg('g', { transform: `translate(${o.x} ${o.y})` }, parent);
    const inner = X.svg('g', {}, g);
    X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: o.fill ?? C.sage, rx: 2 }, inner);
    X.svg('text', { x: 0, y: size * 0.36, 'text-anchor': 'middle', 'font-family': SANS, 'font-size': size, 'font-weight': o.weight ?? 800, fill: o.color ?? '#fff', text }, inner);
    X.pop(inner, t, { dur: 0.22, ease: 'back.out(1.6)', sfx: o.sfx ?? 'pop', gain: 0.18 });
    return { g, w, h };
  };

  /** Highlighter sweep (yellow, multiply on paper). Rect revealed left→right over ~16 frames. */
  VK.highlight = (parent, t, o) => {
    const { x, y, w, h, dur = 0.55, color = C.hilite, blend = 'multiply', op = 0.95 } = o;
    const id = uid('vkHi'), cp = X.svg('clipPath', { id }, X.defs);
    const cr = X.svg('rect', { x: x - 2, y: y - 4, width: 0, height: h + 8 }, cp);
    const r = X.svg('rect', { x, y, width: w, height: h, fill: color, opacity: op, 'clip-path': `url(#${id})`, style: { mixBlendMode: blend } }, parent);
    X.tl.fromTo(cr, { attr: { width: 0 } }, { attr: { width: w + 4 }, duration: dur, ease: 'power1.inOut', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, 'swoosh', { dur, gain: 0.1, pitch: 1.7 });
    return r;
  };

  /** Hand-drawn curved arrow (shaft draws, then the head). */
  VK.arrow = (parent, t, o) => {
    const { from, to, bend = 0.25, color = C.ellipse, width = 7, head = 26, dur = 0.45 } = o;
    const [x0, y0] = from, [x1, y1] = to, L = Math.hypot(x1 - x0, y1 - y0);
    const qx = (x0 + x1) / 2 - ((y1 - y0) / L) * bend * L, qy = (y0 + y1) / 2 + ((x1 - x0) / L) * bend * L;
    const g = X.svg('g', {}, parent);
    const shaft = X.svg('path', { d: `M${x0},${y0} Q${qx},${qy} ${x1},${y1}`, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round' }, g);
    const ang = Math.atan2(y1 - qy, x1 - qx), a1 = ang + Math.PI * 0.8, a2 = ang - Math.PI * 0.8;
    const hp = X.svg('path', {
      d: `M${x1 + Math.cos(a1) * head},${y1 + Math.sin(a1) * head} L${x1},${y1} L${x1 + Math.cos(a2) * head},${y1 + Math.sin(a2) * head}`,
      fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
    }, g);
    VK.drawOn(shaft, t, dur, 'power1.inOut');
    VK.drawOn(hp, t + dur * 0.85, 0.14, 'power1.out');
    if (o.sfx !== false) X.sfx(t, 'swoosh', { dur, gain: 0.13 });
    return g;
  };

  /** Square bracket spanning x0..x1 at height y (opens downward), drawn from the middle out. */
  VK.bracket = (parent, t, o) => {
    const { x0, x1, y, h = 30, color = C.orange, width = 6, dur = 0.5 } = o, xm = (x0 + x1) / 2;
    const g = X.svg('g', {}, parent);
    for (const [a, b] of [[xm, x0], [xm, x1]]) {
      const p = X.svg('path', { d: `M${a},${y} H${b} V${y + h}`, fill: 'none', stroke: color, 'stroke-width': width, 'stroke-linecap': 'square' }, g);
      VK.drawOn(p, t, dur, 'power2.out');
    }
    return g;
  };

  /** Dim everything in `parent` space except some windows (document focus). rects: [{x,y,w,h}] */
  VK.dimExcept = (parent, t, rects, o = {}) => {
    const id = uid('vkDim'), m = X.svg('mask', { id, maskUnits: 'userSpaceOnUse', x: -4000, y: -4000, width: 10000, height: 10000 }, X.defs);
    X.svg('rect', { x: -4000, y: -4000, width: 10000, height: 10000, fill: '#fff' }, m);
    for (const r of rects) X.svg('rect', { x: r.x, y: r.y, width: r.w, height: r.h, fill: '#000', rx: 4 }, m);
    const ov = X.svg('rect', { x: -4000, y: -4000, width: 10000, height: 10000, fill: o.color ?? '#0d1014', mask: `url(#${id})`, opacity: 0 }, parent);
    X.tl.fromTo(ov, { opacity: 0 }, { opacity: o.op ?? 0.55, duration: o.dur ?? 0.4, ease: 'sine.inOut', immediateRender: false }, t);
    return ov;
  };

  /** Kit-B typewriter label: monospace text typed at ~16 cps behind a block cursor; the box grows with the text. */
  VK.typed = (parent, t, text, o = {}) => {
    const size = o.size ?? 30, fam = o.family ?? "'Roboto Mono', monospace", cps = o.cps ?? 16, padX = size * 0.35, h = size * 1.35;
    const g = X.svg('g', { transform: `translate(${o.x} ${o.y})` }, parent);
    const box = X.svg('rect', { x: 0, y: -h / 2, width: 0, height: h, fill: o.fill ?? '#fff' }, g);
    const tx = X.svg('text', { x: padX, y: size * 0.36, 'font-family': fam, 'font-size': size, 'font-weight': 700, fill: o.color ?? '#111' }, g);
    const cur = X.svg('rect', { x: padX, y: -size * 0.5, width: size * 0.6, height: size, fill: o.color ?? '#111' }, g);
    const cw = VK.measure('M', size, 700, fam);
    X.every((tt) => {
      const n = Math.max(0, Math.min(text.length, Math.floor((tt - t) * cps)));
      const vis = tt >= t;
      tx.textContent = text.slice(0, n);
      box.setAttribute('width', vis ? padX * 2 + cw * (n + 1) : 0);
      cur.setAttribute('x', padX + cw * n);
      cur.setAttribute('opacity', vis && (n < text.length || Math.floor(tt * 4) % 2 === 0) ? 1 : 0);
    });
    return g;
  };

  // ------------------------------------------------------------------ data
  const STEPS = [1, 2, 5, 10, 15, 20, 30, 60, 120, 300, 600];
  VK.niceStep = (raw, steps = STEPS) => steps.find((s) => s >= raw) ?? steps[steps.length - 1];
  /** Scale-chase line chart drawn directly on the slate. data: [{x, y, label}] sorted by x.
   *  The line draws from t0 over dur while yMax chases the visible maximum (tick labels rescale under it).
   *  Returns {g, pt(i)} where pt(i) is the final (fully drawn) screen position of data[i] in chart-parent space. */
  VK.chart = (parent, o) => {
    const { x, y, w, h, data, t0, dur = 2.7, color = C.orange, ticksN = 4 } = o;
    const xMin = o.xMin ?? data[0].x, xMax = o.xMax ?? data[data.length - 1].x, yMin = o.yMin ?? 0, yStart = o.yMaxStart ?? 10;
    const fmt = o.fmtY ?? ((v) => String(v)), ease = gsap.parseEase(o.ease ?? 'power1.inOut');
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, parent);
    const ink = o.ink ?? C.text, sub = o.sub ?? C.grey, gridC = o.grid ?? C.grey;
    if (o.title) VK.text(g, 0, -92, o.title, { size: o.titleSize ?? 40, weight: 800, fill: ink });
    if (o.source) VK.text(g, 0, -48, o.source, { size: o.sourceSize ?? 24, weight: 400, style: 'italic', fill: sub });
    const grid = X.svg('g', {}, g), labs = X.svg('g', {}, g);
    const pool = Array.from({ length: 12 }, () => ({
      l: X.svg('line', { x1: 0, x2: w, stroke: gridC, 'stroke-opacity': o.gridOp ?? 0.28, 'stroke-width': 1.5 }, grid),
      t: X.svg('text', { x: -18, 'text-anchor': 'end', 'font-family': SANS, 'font-size': o.tickSize ?? 26, 'font-weight': 600, fill: sub }, labs),
    }));
    X.svg('line', { x1: 0, x2: w, y1: h, y2: h, stroke: gridC, 'stroke-opacity': 0.7, 'stroke-width': 2 }, g);
    const area = X.svg('path', { fill: color, opacity: o.areaOp ?? 0.28 }, g);
    const line = X.svg('path', { fill: 'none', stroke: color, 'stroke-width': o.width ?? 5, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' }, g);
    const dots = data.map((dp) => ({
      c: X.svg('circle', { r: 7, fill: o.dotFill ?? C.white, stroke: color, 'stroke-width': 4 }, g),
      t: dp.label ? X.svg('text', { 'text-anchor': 'middle', 'font-family': SANS, 'font-size': o.labelSize ?? 24, 'font-weight': 600, fill: sub, text: dp.label }, g) : null,
    }));
    const xs = (v) => ((v - xMin) / (xMax - xMin)) * w;
    const yMaxFor = (vmax) => Math.max(yStart, vmax * (o.headroom ?? 1.18));
    const state = (p) => {
      const xEnd = xMin + (data[data.length - 1].x - xMin) * p, pts = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].x <= xEnd) pts.push([data[i].x, data[i].y]);
        else { const a = data[i - 1], b = data[i], k = (xEnd - a.x) / (b.x - a.x); pts.push([xEnd, a.y + (b.y - a.y) * k]); break; }
      }
      return { pts, yMax: yMaxFor(Math.max(...pts.map((q) => q[1]))), xEnd };
    };
    const render = (p) => {
      const { pts, yMax, xEnd } = state(p), ys = (v) => h - ((v - yMin) / (yMax - yMin)) * h;
      const step = VK.niceStep((yMax - yMin) / ticksN, o.steps);
      let k = 0;
      for (let v = yMin; v <= yMax + 1e-6 && k < pool.length; v += step, k++) {
        const yy = ys(v);
        pool[k].l.setAttribute('y1', yy); pool[k].l.setAttribute('y2', yy); pool[k].l.style.display = '';
        pool[k].t.setAttribute('y', yy + 9); pool[k].t.textContent = fmt(v); pool[k].t.style.display = '';
      }
      for (; k < pool.length; k++) { pool[k].l.style.display = 'none'; pool[k].t.style.display = 'none'; }
      const P = pts.map((q) => [xs(q[0]), ys(q[1])]);
      const show = p > 0.0005;
      line.setAttribute('d', show && P.length > 1 ? 'M' + P.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L') : '');
      area.setAttribute('d', show && P.length > 1 ? 'M' + P.map((q) => q[0].toFixed(1) + ',' + q[1].toFixed(1)).join('L') + `L${P[P.length - 1][0].toFixed(1)},${h}L${P[0][0].toFixed(1)},${h}Z` : '');
      data.forEach((dp, i) => {
        const on = show && dp.x <= xEnd + 1e-6, X0 = xs(dp.x), Y0 = ys(dp.y);
        dots[i].c.setAttribute('cx', X0); dots[i].c.setAttribute('cy', Y0); dots[i].c.style.display = on ? '' : 'none';
        if (dots[i].t) { dots[i].t.setAttribute('x', X0); dots[i].t.setAttribute('y', h + 40 + (dp.labelDy ?? 0)); dots[i].t.style.display = on ? '' : 'none'; }
      });
    };
    X.every((t) => render(t <= t0 ? 0 : t >= t0 + dur ? 1 : ease((t - t0) / dur)));
    const fin = state(1);
    return { g, pt: (i) => [x + xs(data[i].x), y + h - ((data[i].y - yMin) / (fin.yMax - yMin)) * h], xs, w, h };
  };

  /** Timeline spine: axis line with yearly ticks and labelled majors. Returns X(year). */
  VK.axis = (parent, o) => {
    const { x0 = 0, y, from, to, px, every = 5, color = C.grey } = o, XY = (yr) => x0 + (yr - from) * px;
    const g = X.svg('g', {}, parent);
    X.svg('line', { x1: XY(from) - 200, x2: XY(to) + 200, y1: y, y2: y, stroke: color, 'stroke-width': 3, 'stroke-opacity': 0.8 }, g);
    for (let yr = from; yr <= to; yr++) {
      const maj = yr % every === 0;
      X.svg('line', { x1: XY(yr), x2: XY(yr), y1: y - (maj ? 16 : 8), y2: y + (maj ? 16 : 8), stroke: color, 'stroke-width': maj ? 3 : 2, 'stroke-opacity': maj ? 0.9 : 0.5 }, g);
      if (maj) VK.text(g, XY(yr), y + 58, String(yr), { size: o.size ?? 30, weight: 700, anchor: 'middle', fill: color });
    }
    return { g, X: XY };
  };

  // ------------------------------------------------------------------ brand + end (original — never a real channel's marks)
  VK.bug = (text = 'footnote', o = {}) => {
    const g = X.svg('g', { transform: `translate(${o.x ?? 1824} ${o.y ?? 82})`, opacity: o.op ?? 0.72 }, o.parent ?? X.root);
    const size = o.size ?? 30, w = VK.measure(text, size, 800);
    X.svg('text', { x: -16, y: 0, 'text-anchor': 'end', 'font-family': SANS, 'font-size': size, 'font-weight': 800, fill: '#fff', 'letter-spacing': -0.5, text }, g);
    X.svg('rect', { x: -10, y: -size * 0.3, width: size * 0.3, height: size * 0.3, fill: C.orange }, g);
    return { g, w };
  };
  /** Logo sting over the current picture: frame dims, the wordmark wipes on behind an accent block, holds, wipes off. */
  VK.sting = (t, dur = 1.3, text = 'footnote', o = {}) => {
    const g = X.svg('g', {}, o.parent ?? X.root), size = o.size ?? 168, dimOp = o.cover ? 1 : 0.88;
    const dim = X.svg('rect', { width: 1920, height: 1080, fill: o.cover ? (o.color ?? C.ground) : C.ground2, opacity: 0 }, g);
    const w = VK.measure(text, size, 800), x0 = 960 - (w + size * 0.4) / 2;
    const id = uid('vkSt'), cp = X.svg('clipPath', { id }, X.defs);
    const cr = X.svg('rect', { x: x0 - 20, y: 300, width: 0, height: 480 }, cp);
    const wm = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    X.svg('text', { x: x0, y: 540 + size * 0.36, 'font-family': SANS, 'font-size': size, 'font-weight': 800, fill: '#fff', 'letter-spacing': -4, text }, wm);
    X.svg('rect', { x: x0 + w + size * 0.08, y: 540 + size * 0.36 - size * 0.32, width: size * 0.3, height: size * 0.32, fill: C.orange }, wm);
    const blk = X.svg('rect', { x: x0 - 20, y: 540 - size * 0.55, width: 0, height: size * 1.1, fill: C.orange }, g);
    const W = w + size * 0.5;
    X.tl.fromTo(dim, { opacity: 0 }, { opacity: dimOp, duration: 0.25, ease: 'sine.out', immediateRender: false }, t);
    X.tl.fromTo(blk, { attr: { width: 0, x: x0 - 20 } }, { attr: { width: W }, duration: 0.22, ease: 'power3.in', immediateRender: false }, t);
    X.tl.fromTo(blk, { attr: { x: x0 - 20, width: W } }, { attr: { x: x0 - 20 + W, width: 0 }, duration: 0.24, ease: 'power3.out', immediateRender: false }, t + 0.22);
    X.tl.fromTo(cr, { attr: { width: 0 } }, { attr: { width: W + 40 }, duration: 0.01, immediateRender: false }, t + 0.22);
    X.tl.fromTo(wm, { opacity: 1 }, { opacity: 0, duration: 0.25, ease: 'sine.in', immediateRender: false }, t + dur - 0.25);
    X.tl.fromTo(dim, { opacity: dimOp }, { opacity: 0, duration: 0.3, ease: 'sine.in', immediateRender: false }, t + dur - 0.25);
    X.sfx(t, 'whoosh', { dur: 0.5, gain: 0.35 });
    X.sfx(t + 0.22, 'thud', { gain: 0.35 });
    return g;
  };
  /** Credits card: dark grey, thin yellow vertical rule with dot terminals at ~36 % width, names right-aligned to it. */
  VK.credits = (parent, rows, o = {}) => {
    const g = X.svg('g', {}, parent), rx = o.ruleX ?? 1920 * 0.36, y0 = 1080 * 0.05, y1 = 1080 * 0.95;
    X.svg('rect', { width: 1920, height: 1080, fill: C.credits }, g);
    X.svg('line', { x1: rx, x2: rx, y1: y0, y2: y1, stroke: C.ellipse, 'stroke-width': 3 }, g);
    for (const yy of [y0, y1]) X.svg('circle', { cx: rx, cy: yy, r: 6, fill: C.ellipse }, g);
    const step = o.step ?? 112, total = rows.length * step, start = 540 - total / 2 + 36;
    rows.forEach(([role, name], i) => {
      VK.text(g, rx - 36, start + i * step, role, { size: o.roleSize ?? 24, weight: 500, fill: C.grey, anchor: 'end' });
      VK.text(g, rx - 36, start + i * step + 40, name, { size: o.nameSize ?? 34, weight: 800, fill: C.white, anchor: 'end' });
    });
    return g;
  };
})();
