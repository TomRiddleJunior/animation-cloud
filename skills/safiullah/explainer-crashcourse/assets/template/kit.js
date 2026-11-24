/* CrashCourse-style animated-insert kit (original artwork) — builds on the explainer engine (window.X).
 *
 * Load after /engine/lib/explainer.js and before scene.js. Everything hangs off window.K.
 * Eras:  2012 flat-vector story inserts + diagonal-stripe swipes  (default, sub-style A)
 *        2014 textured keyword cards + 8-frame light-leak flash dissolve (sub-style B)
 *        2026 host-in-a-panel collage card + torn-paper wipes + word-synced text (sub-style D)
 * All motion is a pure function of time (timeline tweens or X.every hooks), frame unit K.F = 1/24 s.
 *
 * Primitives  K.g K.rect K.circ K.path K.txt K.hatch(id,base,line) K.uid()
 * Transitions K.stripeSwipe (X2) · K.stripeCurtain (X3) · K.stripeOut · K.flashCard (X4) · K.diagWipe (X17)
 *             K.diamond (X6) · K.tornWipe (X9) · K.hostPanelCard (X8) · K.kinetic (X10)
 * Cards       K.titleCard (segment title) · K.texField (2014 textured field)
 * People      K.figure (tall thin flat puppet) · K.walk · K.host + K.hostSet + K.hostTalk (illustrated host stand-in)
 * Props/sets  K.sun K.cloud K.palm K.dunes K.temple K.lighthouse K.well K.globe K.pin K.badge K.pinkX K.check
 *             K.podium K.dartboard K.ruler K.scrollIcon K.stick K.mapFrame K.label
 * Idle        K.loop(el, t0, t1, fn) — per-frame transform on a wrapper the timeline never touches
 */
(function () {
  const K = (window.K = {});
  const F = (K.F = 1 / 24);
  let _uid = 0;
  K.uid = (p = 'k') => `${p}${++_uid}`;

  // ------------------------------------------------------------------ palette (sub-style A, measured on 2012 inserts)
  K.C = {
    mint: '#8DF2DA', mintLite: '#B4F7E6', mintDeep: '#59CEC1', seafoam: '#56FCBA', aqua: '#3FBFC4', sea: '#2FA9B3',
    white: '#F5F8F8', cream: '#FFF6E4', creamDark: '#EAD7B6', ink: '#231F21', forest: '#407E53', forestDark: '#21412E',
    leaf: '#3E9A5B', leafDark: '#2C7444', coral: '#D26251', coralDark: '#A84536', pink: '#DC3A71', magenta: '#D82A51',
    aubergine: '#2F1944', orange: '#F29227', red: '#E43333', sand: '#F3D394', sandMid: '#E6BC72', sandDark: '#CF9E55',
    soil: '#B9854A', sun: '#FFD23F', sunLite: '#FFE98A', stone: '#A7BCC0', stoneDark: '#7E989D', water: '#3FBFC4',
    wood: '#9B6B43', woodDark: '#74492A', night: '#1E2A33', grid: '#2B3A44', yellow: '#FFE27A', grey: '#C9D3D4',
  };
  // 2014 card fields and 2026 collage colours
  K.C14 = { red: '#B73039', orange: '#F49D34', cyan: '#13C6D2', purple: '#7B2FBE', magenta: '#BA0175', coral: '#F38464', hotpink: '#E80C89' };
  K.C26 = { card: '#E6D6C7', mustard: '#EAC177', mustardLine: '#B69262', felt: '#325B2B', navy: '#274067', teal: '#16655C', ink: '#231A13', set: '#3A4E47' };
  K.FONT = { caps: 'Bebas Neue', serifIt: 'Libre Baskerville', serif26: 'DM Serif Display', sans26: 'Nunito' };

  // ------------------------------------------------------------------ primitives
  K.g = (parent, attrs = {}) => X.svg('g', attrs, parent);
  K.rect = (p, x, y, w, h, fill, rx = 0, extra = {}) => X.svg('rect', { x, y, width: w, height: h, rx, fill, ...extra }, p);
  K.circ = (p, cx, cy, r, fill, extra = {}) => X.svg('circle', { cx, cy, r, fill, ...extra }, p);
  K.path = (p, d, fill, extra = {}) => X.svg('path', { d, fill, ...extra }, p);
  K.ell = (p, cx, cy, rx, ry, fill, extra = {}) => X.svg('ellipse', { cx, cy, rx, ry, fill, ...extra }, p);
  /** Condensed caps (Bebas) by default; o.italic → Libre Baskerville italic. */
  K.txt = (p, s, x, y, o = {}) => X.svg('text', {
    x, y, text: o.upper === false ? s : (o.italic ? s : s.toUpperCase()), 'font-family': o.font || (o.italic ? K.FONT.serifIt : K.FONT.caps),
    'font-style': o.italic ? 'italic' : 'normal', 'font-size': o.size || 60, 'font-weight': o.weight || 400, fill: o.fill || '#fff',
    'text-anchor': o.anchor || 'middle', 'letter-spacing': o.ls ?? (o.italic ? 0 : 1), ...(o.attrs || {}),
  }, p);
  /** Diagonal hatch pattern (cloud fills, side panels, badges). Returns url(#id). */
  K.hatch = (id, base, line, gap = 22, width = 7, angle = 45) => {
    if (document.getElementById(id)) return `url(#${id})`;
    const pt = X.svg('pattern', { id, patternUnits: 'userSpaceOnUse', width: gap, height: gap, patternTransform: `rotate(${angle})` }, X.defs);
    if (base) X.svg('rect', { width: gap, height: gap, fill: base }, pt);
    X.svg('rect', { width, height: gap, fill: line }, pt);
    return `url(#${id})`;
  };
  /** Per-frame transform on a wrapper group (never tween the same element on X.tl). fn(localT) → {x,y,r,s,sx,sy,o}. */
  K.loop = (el, t0, t1, fn, ox = 0, oy = 0) => {
    X.every((t) => {
      const tt = Math.min(Math.max(t, t0), t1) - t0;
      const v = fn(tt, t) || {};
      const sx = v.sx ?? v.s ?? 1, sy = v.sy ?? v.s ?? 1;
      el.setAttribute('transform', `translate(${(v.x || 0).toFixed(2)} ${(v.y || 0).toFixed(2)}) translate(${ox} ${oy}) rotate(${(v.r || 0).toFixed(2)}) scale(${sx.toFixed(4)} ${sy.toFixed(4)}) translate(${-ox} ${-oy})`);
      if (v.o != null) el.setAttribute('opacity', v.o.toFixed(3));
    });
    return el;
  };
  /** Steady camera drift (WH-style slow pan/zoom across the backdrop) on a fresh group; build the composition inside it.
   *  Linear by default so the frame never fully holds (source inserts: hold_frac ≈ 0.04). */
  K.drift = (parent, t0, t1, o = {}) => {
    const g = X.svg('g', {}, parent);
    const s0 = o.s0 ?? 1, s1 = o.s1 ?? 1.06, x0 = o.x0 || 0, x1 = o.x1 || 0, y0 = o.y0 || 0, y1 = o.y1 || 0;
    K.loop(g, t0, t1, (tt) => {
      const k = Math.min(1, tt / Math.max(0.01, t1 - t0)), e = o.ease === 'sine' ? 0.5 - 0.5 * Math.cos(Math.PI * k) : k;
      return { s: s0 + (s1 - s0) * e, x: x0 + (x1 - x0) * e, y: y0 + (y1 - y0) * e };
    }, o.ox ?? 960, o.oy ?? 540);
    return g;
  };
  /** A few flat birds crossing the sky with flapping wings (pure function of t). */
  K.birds = (parent, t0, t1, o = {}) => {
    const g = X.svg('g', {}, parent), n = o.n || 3, sp = o.speed || 110, col = o.color || K.C.ink, r = X.rand(o.seed || 5);
    const bs = Array.from({ length: n }, (_, i) => ({ el: K.path(g, '', 'none', { stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), x: (o.x ?? 200) + i * 90 + r() * 40, y: (o.y ?? 220) + (i % 2) * 34 + r() * 20, ph: r() * 6, s: 0.8 + r() * 0.4 }));
    X.every((t) => {
      const tt = Math.min(Math.max(t, t0), t1) - t0;
      for (const b of bs) {
        const x = b.x + tt * sp * (o.dir || 1), y = b.y + Math.sin(tt * 1.3 + b.ph) * 8, f = Math.sin(t * 11 + b.ph) * 12 * b.s, w = 22 * b.s;
        b.el.setAttribute('d', `M${(x - w).toFixed(1)},${(y - f).toFixed(1)} Q${(x - w / 2).toFixed(1)},${(y - 6 - f * 0.4).toFixed(1)} ${x.toFixed(1)},${y.toFixed(1)} Q${(x + w / 2).toFixed(1)},${(y - 6 - f * 0.4).toFixed(1)} ${(x + w).toFixed(1)},${(y - f).toFixed(1)}`);
      }
    });
    return g;
  };
  /** Wrap an element in a fresh group (so idle loops and timeline tweens never fight). */
  K.wrap = (el) => { const w = X.svg('g', {}, null); el.parentNode.insertBefore(w, el); w.appendChild(el); return w; };

  // ------------------------------------------------------------------ X2/X3 diagonal stripes (2012)
  /** 45° bars (lower-left → upper-right), alternating colours; bars[] are individually movable along their axis. */
  K.stripes = (parent, o = {}) => {
    const w = (o.period || 136) / 2;
    const g = X.svg('g', { transform: 'translate(960 540) rotate(-45)' }, parent);
    const bars = [];
    const n = Math.ceil(2300 / w);
    for (let i = 0; i < n; i++) bars.push(K.rect(g, -1400, -1150 + i * w - 0.6, 2800, w + 1.2, i % 2 ? o.colB : o.colA));
    return { g, bars };
  };
  const barsIn = (S, t, frames, seed) => {
    const r = X.rand(seed);
    S.bars.forEach((b) => X.tl.fromTo(b, { x: -2650 - r() * 900 }, { x: 0, duration: frames * F, ease: 'power3.out', immediateRender: false }, t));
  };
  const barsOut = (S, t, seed, minF = 4, maxF = 9) => {
    const r = X.rand(seed);
    S.bars.forEach((b, i) => X.tl.fromTo(b, { x: 0 }, { x: 2650 + r() * 700, duration: (minF + ((i * 7 + Math.floor(r() * 3)) % (maxF - minF + 1))) * F, ease: 'power2.in', immediateRender: false }, t));
  };
  /** X2: stripes cover in 4f, word pops 40→100 % in 2f at +6f, hold, bars exit staggered 4–9f. Returns {tWord, tOut, tEnd}. */
  K.stripeSwipe = (parent, t, o = {}) => {
    const g = X.svg('g', {}, parent);
    gsap.set(g, { autoAlpha: 0 });
    const S = K.stripes(g, { colA: o.colA || K.C.magenta, colB: o.colB || K.C.aubergine, period: o.period });
    const hold = o.hold ?? 1.4, tWord = t + 6 * F, tOut = tWord + hold, tEnd = tOut + 9 * F;
    X.tl.set(g, { autoAlpha: 1 }, t).set(g, { autoAlpha: 0 }, tEnd + F);
    barsIn(S, t, o.inFrames || 4, o.seed || 11);
    barsOut(S, tOut, (o.seed || 11) + 1);
    if (o.word) {
      const wg = X.svg('g', { transform: 'translate(960 540)' }, g);
      const fs = o.size || 460;
      const tx = K.txt(wg, o.word, 0, fs * 0.35, { size: fs, ls: 2 });
      const len = tx.getComputedTextLength(), maxW = o.maxWidth || 1540;
      if (len > maxW) { tx.setAttribute('font-size', fs * maxW / len); tx.setAttribute('y', fs * maxW / len * 0.35); }
      gsap.set(tx, { opacity: 0, scale: 0.4, transformOrigin: '50% 50%' });
      X.tl.fromTo(tx, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 2 * F, ease: 'none', immediateRender: false }, tWord)
        .set(tx, { opacity: 0 }, tOut);
    }
    if (o.sfx !== false) { X.sfx(t, 'whoosh', { dur: 0.3, gain: 0.5 }); if (o.word) X.sfx(tWord, 'stamp', { dur: 0.25, gain: 0.35 }); X.sfx(tOut, 'swoosh', { dur: 0.3, gain: 0.4 }); }
    return { tWord, tOut, tEnd, g };
  };
  /** X3: curtain into the story segment — cover 3f, hold, wipe off 3f (staggered). Returns the reveal time. */
  K.stripeCurtain = (parent, t, o = {}) => {
    const g = X.svg('g', {}, parent);
    gsap.set(g, { autoAlpha: 0 });
    const S = K.stripes(g, { colA: o.colA || K.C.orange, colB: o.colB || K.C.red, period: o.period || 150 });
    const hold = o.hold ?? 0.45, tOff = t + 3 * F + hold, tEnd = tOff + 5 * F;
    X.tl.set(g, { autoAlpha: 1 }, t).set(g, { autoAlpha: 0 }, tEnd + F);
    barsIn(S, t, 3, o.seed || 21);
    barsOut(S, tOff, (o.seed || 21) + 1, 3, 5);
    if (o.sfx !== false) { X.sfx(t, 'whoosh', { dur: 0.45, gain: 0.55 }); X.sfx(tOff, 'swoosh', { dur: 0.3, gain: 0.45 }); }
    return tOff + 2 * F; // ~ when the next layer is half revealed
  };
  /** Leave a story segment: stripes flash in (4f) and immediately break out (4–9f) over whatever is underneath. */
  K.stripeOut = (parent, t, o = {}) => {
    const g = X.svg('g', {}, parent);
    gsap.set(g, { autoAlpha: 0 });
    const S = K.stripes(g, { colA: o.colA || K.C.orange, colB: o.colB || K.C.red, period: o.period || 150 });
    const tOff = t + 4 * F + (o.hold ?? 0.12), tEnd = tOff + 9 * F;
    X.tl.set(g, { autoAlpha: 1 }, t).set(g, { autoAlpha: 0 }, tEnd + F);
    barsIn(S, t, 4, o.seed || 31);
    barsOut(S, tOff, (o.seed || 31) + 1);
    if (o.sfx !== false) { X.sfx(t, 'whoosh', { dur: 0.35, gain: 0.5 }); X.sfx(tOff, 'swoosh', { dur: 0.3, gain: 0.4 }); }
    return { tCovered: t + 4 * F, tOff, tEnd };
  };

  // ------------------------------------------------------------------ X17 soft-edged diagonal wipe (inside stories)
  /** Reveal `sceneG` (which must sit above the outgoing scene) with a soft diagonal edge sweeping left → right. */
  K.diagWipe = (sceneG, t, o = {}) => {
    const id = K.uid('dw'), dur = (o.frames || 5) * F;
    const lg = X.svg('linearGradient', { id: id + 'g', x1: 0, y1: 0, x2: 1, y2: 0 }, X.defs);
    X.svg('stop', { offset: 0, 'stop-color': '#fff' }, lg); X.svg('stop', { offset: 0.93, 'stop-color': '#fff' }, lg);
    X.svg('stop', { offset: 1, 'stop-color': '#000' }, lg);
    const m = X.svg('mask', { id, maskUnits: 'userSpaceOnUse', x: -200, y: -200, width: 2320, height: 1480 }, X.defs);
    const rg = X.svg('g', { transform: `rotate(${o.angle ?? 22} 960 540)` }, m);
    const r = K.rect(rg, 0, -1200, 4000, 3480, `url(#${id}g)`);
    gsap.set(r, { x: -4800 });
    X.tl.fromTo(r, { x: -4800 }, { x: -1300, duration: dur, ease: o.ease || 'power2.inOut', immediateRender: false }, t);
    sceneG.setAttribute('mask', `url(#${id})`);
    if (o.sfx !== false) X.sfx(t, 'swoosh', { dur: 0.25, gain: 0.35 });
    return t + dur;
  };

  /** Draw-on for a DASHED stroke (X.drawOn would overwrite the dash pattern): reveals it through a growing mask stroke. */
  K.drawMasked = (path, t, dur = 0.6, ease = 'power2.inOut', extra = 24) => {
    const id = K.uid('dm');
    const m = X.svg('mask', { id, maskUnits: 'userSpaceOnUse', x: -4000, y: -4000, width: 12000, height: 12000 }, X.defs);
    const sw = +(path.getAttribute('stroke-width') || 8) + extra;
    const c = X.svg('path', { d: path.getAttribute('d'), fill: 'none', stroke: '#fff', 'stroke-width': sw, 'stroke-linecap': 'round' }, m);
    path.setAttribute('mask', `url(#${id})`);
    X.drawOn(c, t, dur, ease);
    return c;
  };

  // ------------------------------------------------------------------ X6 diamond badge over the host
  /** Rotated-square badge that pops in (5f back.out(1.4)) and exits (4f). icon(g) draws inside a ±120 box. */
  K.diamond = (parent, t, t1, o = {}) => {
    const size = o.size || 300;
    const outer = X.svg('g', { transform: `translate(${o.x || 330} ${o.y || 560})` }, parent);
    const g = X.svg('g', {}, outer);
    gsap.set(g, { scale: 0, transformOrigin: '50% 50%' });
    if (o.panel) { // tinted hatch side panel sliding from the left edge
      const pnl = K.path(parent, `M0,${(o.y || 560) - 420} L${(o.x || 330) + 230},${o.y || 560} L0,${(o.y || 560) + 420} Z`, K.hatch(K.uid('hp'), o.panel[0], o.panel[1], 26, 9));
      parent.insertBefore(pnl, outer);
      X.tl.fromTo(pnl, { x: -700 }, { x: 0, duration: 6 * F, ease: 'power2.out', immediateRender: false }, t);
      if (t1 != null) X.tl.to(pnl, { x: -700, duration: 4 * F, ease: 'power2.in' }, t1);
      gsap.set(pnl, { x: -700 });
    }
    const d = size / Math.SQRT2;
    K.rect(g, -d / 2 + 10, -d / 2 + 14, d, d, 'rgba(0,0,0,0.18)', 18, { transform: 'rotate(45)' });
    K.rect(g, -d / 2, -d / 2, d, d, o.fill || K.C.pink, 18, { transform: 'rotate(45)' });
    if (o.hatch) K.rect(g, -d / 2, -d / 2, d, d, K.hatch(K.uid('dh'), null, o.hatch, 24, 8), 18, { transform: 'rotate(45)' });
    K.rect(g, -d / 2 + 22, -d / 2 + 22, d - 44, d - 44, 'none', 10, { transform: 'rotate(45)', stroke: o.ring || 'rgba(255,255,255,0.85)', 'stroke-width': 6 });
    if (o.icon) o.icon(X.svg('g', {}, g));
    X.tl.fromTo(g, { scale: 0 }, { scale: 1, duration: 5 * F, ease: 'back.out(1.4)', immediateRender: false }, t);
    if (t1 != null) X.tl.to(g, { scale: 0, duration: 4 * F, ease: 'power2.in' }, t1);
    if (o.sfx !== false) X.sfx(t, 'pop', { gain: 0.45 });
    return outer;
  };

  // ------------------------------------------------------------------ segment title card (original design)
  /** Mint field + hatch corners, small dark tag above a coral ribbon banner with folded tails, italic subtitle. */
  K.titleCard = (parent, t0, t1, o = {}) => {
    const ta = o.at ?? t0;
    return X.scene(K.uid('title'), t0, t1, (g0) => {
      const g = K.drift(g0, t0, t1, { s1: 1.07 });
      K.rect(g, 0, 0, 1920, 1080, o.field || K.C.mint);
      const hp = K.hatch(K.uid('th'), null, 'rgba(255,255,255,0.35)', 30, 10);
      K.path(g, 'M0,0 L520,0 L0,520 Z', hp); K.path(g, 'M1920,1080 L1400,1080 L1920,560 Z', hp);
      const rib = X.svg('g', { transform: 'translate(960 560)' }, g);
      const tx = K.txt(null, o.title || 'TITLE', 0, 52, { size: 150, ls: 3 });
      rib.appendChild(tx);
      let tl = tx.getComputedTextLength();
      if (tl > 1240) { tx.setAttribute('font-size', 150 * 1240 / tl); tx.setAttribute('y', 52 * 1240 / tl); tl = 1240; }
      const w = Math.max(900, tl + 160), h = 190;
      const tails = X.svg('g', {}, rib);
      rib.insertBefore(tails, tx);
      for (const s of [-1, 1]) {
        const x0 = s * (w / 2 - 50), x1 = s * (w / 2 + 150);
        K.path(tails, `M${x0},${-h / 2 + 50} L${x1},${-h / 2 + 50} L${x1 - s * 60},${50 + 15} L${x1},${h / 2 + 80} L${x0},${h / 2 + 80} Z`, o.tail || K.C.coralDark);
        K.path(tails, `M${s * (w / 2)},${h / 2} L${s * (w / 2 - 50)},${h / 2 + 80} L${s * (w / 2 - 50)},${h / 2} Z`, '#7E3027');
      }
      K.rect(rib, -w / 2, -h / 2, w, h, o.band || K.C.coral, 6);
      K.rect(rib, -w / 2, h / 2 - 22, w, 22, 'rgba(0,0,0,0.12)');
      rib.appendChild(tx);
      gsap.set(rib, { scaleX: 0, transformOrigin: '50% 50%' });
      X.tl.fromTo(rib, { scaleX: 0 }, { scaleX: 1, duration: 6 * F, ease: 'back.out(1.5)', immediateRender: false }, ta);
      // tag
      const tag = X.svg('g', { transform: 'translate(960 365)' }, g);
      const tt = K.txt(tag, o.tag || 'THE DAYDREAM', 0, 22, { size: 64, ls: 4 });
      const tw = tt.getComputedTextLength() + 170;
      tt.setAttribute('x', 38);
      K.rect(tag, -tw / 2, -46, tw, 92, K.C.ink, 46);
      // little daydream cloud glyph
      const cg = X.svg('g', { transform: `translate(${-tw / 2 + 62} 0)` }, tag);
      K.path(cg, 'M-26,14 a16,16 0 0 1 2,-30 a20,20 0 0 1 36,-4 a15,15 0 0 1 16,28 Z', '#fff');
      K.circ(cg, -30, 26, 5, '#fff'); K.circ(cg, -40, 36, 3, '#fff');
      tag.appendChild(tt);
      X.pop(tag, ta + 4 * F, { dur: 5 * F, ease: 'back.out(1.6)', sfx: 'pop' });
      if (o.sub) {
        const st = K.txt(g, o.sub, 960, 800, { italic: true, size: 40, fill: K.C.ink, upper: false });
        X.tl.fromTo(st, { opacity: 0, y: 14 }, { opacity: 0.85, y: 0, duration: 6 * F, ease: 'power2.out', immediateRender: false }, ta + 8 * F);
      }
      X.sfx(ta, 'slide', { dur: 0.3, gain: 0.35 });
    }, parent);
  };

  // ------------------------------------------------------------------ X4 light-leak flash dissolve (2014)
  /** Textured saturated field (radial glow + scribble glyph noise + vignette) as an <image>. */
  K.texField = (parent, color, seed = 5) => {
    const c = document.createElement('canvas'); c.width = 960; c.height = 540;
    const x = c.getContext('2d');
    x.fillStyle = color; x.fillRect(0, 0, 960, 540);
    const rg = x.createRadialGradient(480, 270, 30, 480, 270, 560);
    rg.addColorStop(0, 'rgba(255,255,255,0.22)'); rg.addColorStop(1, 'rgba(0,0,0,0.28)');
    x.fillStyle = rg; x.fillRect(0, 0, 960, 540);
    const r = X.rand(seed);
    x.strokeStyle = 'rgba(255,255,255,0.07)'; x.lineWidth = 1.2;
    for (let i = 0; i < 900; i++) { // tiny glyph scribbles
      const px = r() * 960, py = r() * 540; x.beginPath(); x.moveTo(px, py);
      for (let k = 0; k < 3; k++) x.lineTo(px + (r() - 0.5) * 14, py + (r() - 0.5) * 14);
      x.stroke();
    }
    return X.svg('image', { href: c.toDataURL('image/jpeg', 0.9), x: 0, y: 0, width: 1920, height: 1080, preserveAspectRatio: 'none' }, parent);
  };
  /** X4: the frame warms toward the card colour, card fades/unblurs in over 8f, holds, blooms to white and out over 7f. */
  K.flashCard = (parent, t, o = {}) => {
    const field = o.field || K.C14.orange, hold = o.hold ?? 2;
    const tint = K.rect(parent, 0, 0, 1920, 1080, field, 0, { style: 'mix-blend-mode:screen' });
    const card = X.svg('g', {}, parent);
    K.texField(card, field, o.seed || 5);
    if (o.definition) {
      K.txt(card, 'Definition:', 90, 250, { italic: true, size: 34, anchor: 'start' });
      const term = K.txt(card, o.word, 86, 400, { size: 150, anchor: 'start' });
      const tw = term.getComputedTextLength();
      K.rect(card, 90, 425, tw, 6, '#fff');
      K.txt(card, o.definition, 90, 510, { size: 52, anchor: 'start', ls: 1, fill: '#fff' });
    } else {
      const w = K.txt(card, o.word || 'KEYWORD', 960, 600, { size: 210, ls: 3 });
      const tw = w.getComputedTextLength();
      K.rect(card, 960 - tw / 2, 630, tw, 6, '#fff');
    }
    gsap.set([tint, card], { opacity: 0 });
    const tOut = t + 8 * F + hold;
    X.tl.fromTo(tint, { opacity: 0 }, { opacity: 0.65, duration: 6 * F, ease: 'sine.inOut', immediateRender: false }, t)
      .fromTo(card, { opacity: 0, filter: 'blur(10px) brightness(1.7)' }, { opacity: 1, filter: 'blur(0px) brightness(1)', duration: 8 * F, ease: 'sine.inOut', immediateRender: false }, t)
      .set(tint, { opacity: 0 }, t + 8 * F)
      .to(card, { opacity: 0, filter: 'blur(4px) brightness(2.2)', duration: 7 * F, ease: 'sine.in' }, tOut);
    if (o.sfx !== false) { X.sfx(t, 'riser', { dur: 0.35, gain: 0.25 }); X.sfx(tOut, 'woosh_low', { dur: 0.3, gain: 0.3 }); }
    return { tOut, tEnd: tOut + 7 * F };
  };

  // ------------------------------------------------------------------ 2026: torn-paper wipe, host-in-panel card, kinetic text
  const tornEdgePath = (w, h, jag, seed) => X.torn(w, h, jag, seed, 18);
  /** X9: a torn-edged shape sweeps lower-left → upper-right in 7f; returns the group to put the graphic on. */
  K.tornWipe = (parent, t, o = {}) => {
    const id = K.uid('tw'), dur = (o.frames || 7) * F;
    const cp = X.svg('clipPath', { id }, X.defs);
    const shape = X.svg('path', { d: tornEdgePath(3600, 3000, 34, o.seed || 4), transform: 'translate(-1800 -1500)' }, null);
    const mover = X.svg('g', {}, cp); const rot = X.svg('g', { transform: 'rotate(-32)' }, mover); rot.appendChild(shape);
    const g = X.svg('g', {}, parent);
    const fillMover = X.svg('g', {}, g); const fr = X.svg('g', { transform: 'rotate(-32)' }, fillMover);
    X.svg('path', { d: shape.getAttribute('d'), transform: 'translate(-1800 -1500)', fill: o.color || K.C26.felt, filter: X.shadow(K.uid('tws'), 0, 4, 6, '#000', 0.3) }, fr);
    const content = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    const from = { x: -1900, y: 2300 }, to = { x: 960, y: 540 };
    for (const m of [mover, fillMover]) { gsap.set(m, from); X.tl.fromTo(m, from, { ...to, duration: dur, ease: 'power2.inOut', immediateRender: false }, t); }
    if (o.sfx !== false) X.sfx(t, 'paper', { dur: 0.35, gain: 0.5 });
    return { g, content, tDone: t + dur };
  };
  /** Mustard topographic border background (2026 collage). */
  K.topoBorder = (parent, seed = 2) => {
    K.rect(parent, 0, 0, 1920, 1080, K.C26.mustard);
    const r = X.rand(seed);
    for (let k = 0; k < 9; k++) {
      const cx = r() * 1920, cy = r() * 1080;
      for (let ring = 1; ring < 7; ring++) {
        const R = ring * 46 + r() * 10; let d = '';
        for (let a = 0; a <= 36; a++) { const th = a / 36 * Math.PI * 2, rr = R * (1 + 0.18 * Math.sin(th * 3 + k) + 0.08 * Math.sin(th * 5 + ring)); d += (a ? 'L' : 'M') + (cx + rr * Math.cos(th)).toFixed(1) + ',' + (cy + rr * Math.sin(th) * 0.8).toFixed(1); }
        K.path(parent, d + 'Z', 'none', { stroke: K.C26.mustardLine, 'stroke-width': 3, opacity: 0.55 });
      }
    }
  };
  /** X8: hard cut to host in a torn-edge left panel + cream card at right; title fades/unblurs 6f, words sync to speech.
   *  o.drawHost(g) draws the host into a 860×1000 panel; o.words = [{w, t}] (e.g. from X.line(id).words). */
  K.hostPanelCard = (parent, t0, t1, o = {}) => X.scene(K.uid('hpc'), t0, t1, (g) => {
    K.topoBorder(g, o.seed || 2);
    const sh = X.shadow(K.uid('hps'), 0, 4, 5, '#000', 0.28);
    const pid = K.uid('hpcp'); const cp = X.svg('clipPath', { id: pid }, X.defs);
    X.svg('path', { d: tornEdgePath(880, 1040, 9, 7), transform: 'translate(38 20)' }, cp);
    K.path(g, tornEdgePath(880, 1040, 9, 7), K.C26.set, { transform: 'translate(38 20)', filter: sh });
    const hp = X.svg('g', { 'clip-path': `url(#${pid})` }, g);
    if (o.drawHost) o.drawHost(X.svg('g', { transform: 'translate(38 20)' }, hp));
    K.path(g, tornEdgePath(820, 1040, 9, 9), o.card || K.C26.card, { transform: 'translate(1000 20)', filter: sh });
    const title = K.txt(g, o.title || 'term', 1080, 260, { font: K.FONT.serif26, size: 96, fill: K.C26.ink, anchor: 'start', upper: false, ls: 0 });
    X.tl.fromTo(title, { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 6 * F, ease: 'power1.out', immediateRender: false }, t0 + 0.3);
    const words = o.words || [];
    let x = 1080, y = 380; const maxX = 1760, lh = 62;
    words.forEach((wd, i) => {
      const s = X.svg('text', { x, y, text: wd.w, 'font-family': K.FONT.sans26, 'font-size': 46, 'font-weight': 600, fill: '#3b3b3b' }, g);
      let wl = s.getComputedTextLength();
      if (x + wl > maxX) { x = 1080; y += lh; s.setAttribute('x', x); s.setAttribute('y', y); }
      x += wl + 14;
      gsap.set(s, { opacity: 0 });
      X.tl.fromTo(s, { opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0px)', duration: 3 * F, ease: 'power1.out', immediateRender: false }, wd.t);
    });
  }, parent);
  /** X10: white bold serif phrase at bottom centre, words fade/unblur left→right over ~8f. */
  K.kinetic = (parent, t, t1, text, o = {}) => {
    const g = X.svg('g', {}, parent);
    const parts = text.split(' ');
    const tmp = K.txt(g, text, 960, o.y || 930, { font: K.FONT.serif26, size: o.size || 96, upper: false, ls: 0 });
    const total = tmp.getComputedTextLength(); tmp.remove();
    let x = 960 - total / 2;
    parts.forEach((p, i) => {
      const s = K.txt(g, p, x, o.y || 930, { font: K.FONT.serif26, size: o.size || 96, upper: false, anchor: 'start', ls: 0, attrs: { filter: X.shadow('kshadow', 0, 3, 6, '#000', 0.45) } });
      x += s.getComputedTextLength() + (o.size || 96) * 0.28;
      gsap.set(s, { opacity: 0 });
      X.tl.fromTo(s, { opacity: 0, filter: 'blur(6px)' }, { opacity: 1, filter: 'blur(0px)', duration: 4 * F, ease: 'power1.out', immediateRender: false }, t + i * 2 * F);
    });
    if (t1 != null) X.tl.set(g, { autoAlpha: 0 }, t1);
    return g;
  };

  // ------------------------------------------------------------------ flat puppet figure (sub-style A)
  /** Tall thin flat figure, no outlines: rounded-rect head (≈1/5 height), tunic, stick limbs, dot eyes.
   *  Feet at (x, y). Returns parts for puppet tweens: {g (place), body (bob), head, armL, armR, legL, legR, face}. */
  K.figure = (parent, o = {}) => {
    const h = o.h || 380, s = h / 380, C = K.C;
    const skin = o.skin || '#C68B5E', skinD = o.skinDark || '#A9714A', tunic = o.tunic || C.white, tunicD = o.tunicDark || '#D5E0E0';
    const g = X.svg('g', { transform: `translate(${o.x || 0} ${o.y || 0})${o.flip ? ' scale(-1 1)' : ''}` }, parent);
    const body = X.svg('g', {}, g);           // timeline puppet group (hops, slides)
    const bob = X.svg('g', {}, body);         // per-frame walk bob (K.walk) — never tween this one
    const legs = X.svg('g', {}, bob);
    const mkLeg = (lx) => { const lg = X.svg('g', { transform: `translate(${lx * s} ${-150 * s})` }, legs); const inner = X.svg('g', {}, lg); K.rect(inner, -6.5 * s, 0, 13 * s, 152 * s, o.legs || skinD, 6.5 * s); return inner; };
    const legL = mkLeg(-15), legR = mkLeg(15);
    const mkArm = (ax, side) => {
      const a = X.svg('g', { transform: `translate(${ax * s} ${-292 * s})` }, bob); const inner = X.svg('g', {}, a);
      K.rect(inner, -6.5 * s, -4 * s, 13 * s, 150 * s, side < 0 ? skinD : skin, 6.5 * s); return inner;
    };
    const armL = mkArm(-37, -1);
    // tunic: shoulders → hem, one darker tone on the right half
    const tg = X.svg('g', {}, bob);
    K.path(tg, `M${-34 * s},${-300 * s} Q${-34 * s},${-312 * s} ${-20 * s},${-312 * s} L${20 * s},${-312 * s} Q${34 * s},${-312 * s} ${34 * s},${-300 * s} L${52 * s},${-118 * s} Q${53 * s},${-108 * s} ${42 * s},${-108 * s} L${-42 * s},${-108 * s} Q${-53 * s},${-108 * s} ${-52 * s},${-118 * s} Z`, tunic);
    K.path(tg, `M${4 * s},${-312 * s} L${20 * s},${-312 * s} Q${34 * s},${-312 * s} ${34 * s},${-300 * s} L${52 * s},${-118 * s} Q${53 * s},${-108 * s} ${42 * s},${-108 * s} L${14 * s},${-108 * s} Z`, tunicD);
    if (o.sash) K.path(tg, `M${-30 * s},${-306 * s} L${-14 * s},${-306 * s} L${44 * s},${-150 * s} L${30 * s},${-138 * s} Z`, o.sash);
    if (o.belt) K.rect(tg, -44 * s, -205 * s, 88 * s, 14 * s, o.belt, 3 * s);
    const armR = mkArm(37, 1);
    // head
    const head = X.svg('g', { transform: `translate(0 ${-312 * s})` }, bob);
    const hi = X.svg('g', {}, head);
    K.rect(hi, -9 * s, -14 * s, 18 * s, 20 * s, skinD);
    K.rect(hi, -31 * s, -86 * s, 62 * s, 76 * s, skin, 24 * s);
    const hair = o.hair || '#3A2A20';
    if (o.hairStyle === 'bald') { K.path(hi, `M${-31 * s},${-50 * s} L${-31 * s},${-30 * s} Q${-31 * s},${-22 * s} ${-25 * s},${-24 * s} L${-23 * s},${-56 * s} Z`, hair); K.path(hi, `M${31 * s},${-50 * s} L${31 * s},${-30 * s} Q${31 * s},${-22 * s} ${25 * s},${-24 * s} L${23 * s},${-56 * s} Z`, hair); }
    else if (o.hairStyle === 'long') { K.path(hi, `M${-34 * s},${-62 * s} Q${-34 * s},${-92 * s} 0,${-92 * s} Q${34 * s},${-92 * s} ${34 * s},${-62 * s} L${36 * s},${10 * s} L${22 * s},${10 * s} L${22 * s},${-60 * s} L${-22 * s},${-60 * s} L${-22 * s},${10 * s} L${-36 * s},${10 * s} Z`, hair); }
    else if (o.hairStyle === 'band') { K.path(hi, `M${-33 * s},${-66 * s} Q${-33 * s},${-94 * s} 0,${-94 * s} Q${33 * s},${-94 * s} ${33 * s},${-66 * s} L${33 * s},${-64 * s} L${-33 * s},${-64 * s} Z`, hair); K.rect(hi, -34 * s, -76 * s, 68 * s, 10 * s, o.band || C.coral, 3 * s); }
    else if (o.hairStyle !== 'none') { K.path(hi, `M${-32 * s},${-60 * s} Q${-32 * s},${-92 * s} 0,${-92 * s} Q${32 * s},${-92 * s} ${32 * s},${-60 * s} L${32 * s},${-52 * s} L${-32 * s},${-52 * s} Z`, hair); }
    if (o.beard) { K.path(hi, `M${-31 * s},${-40 * s} L${31 * s},${-40 * s} L${31 * s},${-22 * s} Q${28 * s},${o.beardLen ? (24 + o.beardLen) * s : 30 * s} 0,${o.beardLen ? (34 + o.beardLen) * s : 40 * s} Q${-28 * s},${o.beardLen ? (24 + o.beardLen) * s : 30 * s} ${-31 * s},${-22 * s} Z`, o.beard); }
    const face = X.svg('g', {}, hi);
    const eyeL = K.circ(face, -11 * s, -56 * s, 4.6 * s, C.ink), eyeR = K.circ(face, 12 * s, -56 * s, 4.6 * s, C.ink);
    if (o.brow) { K.rect(face, -18 * s, -70 * s, 13 * s, 4 * s, o.brow, 2 * s); K.rect(face, 5 * s, -70 * s, 13 * s, 4 * s, o.brow, 2 * s); }
    if (o.prop === 'scroll') { const p = X.svg('g', { transform: `translate(${4 * s} ${146 * s}) rotate(-70)` }, armR); K.scrollIcon(p, 0, 0, 1.0 * s); }
    if (o.prop === 'staff') { K.rect(armR, -4 * s, -120 * s, 8 * s, 300 * s, C.wood, 4 * s); }
    if (o.prop === 'jug') { const p = X.svg('g', { transform: `translate(0 ${-112 * s})` }, hi); K.path(p, `M${-22 * s},0 Q${-30 * s},${-30 * s} ${-12 * s},${-44 * s} L${12 * s},${-44 * s} Q${30 * s},${-30 * s} ${22 * s},0 Z`, C.coral); K.rect(p, -14 * s, -54 * s, 28 * s, 12 * s, C.coralDark, 4 * s); }
    return { g, body, bob, head: hi, headPivot: head, armL, armR, legL, legR, face, eyeL, eyeR, s };
  };
  /** Walk cycle on the figure's limbs (pure function of t). */
  K.walk = (fig, t0, t1, o = {}) => {
    const step = o.step || 0.32, amp = o.amp || 22;
    X.every((t) => {
      const on = t >= t0 && t <= t1, ph = on ? (t - t0) / step * Math.PI : 0, sn = Math.sin(ph);
      fig.legL.setAttribute('transform', `rotate(${(on ? amp * sn : 0).toFixed(2)})`);
      fig.legR.setAttribute('transform', `rotate(${(on ? -amp * sn : 0).toFixed(2)})`);
      if (!o.keepArms) { fig.armL.setAttribute('transform', `rotate(${(on ? -amp * 0.8 * sn : 0).toFixed(2)})`); fig.armR.setAttribute('transform', `rotate(${(on ? amp * 0.8 * sn : 0).toFixed(2)})`); }
      fig.bob.setAttribute('transform', `translate(0 ${(on ? -Math.abs(Math.sin(ph)) * 7 * fig.s : 0).toFixed(2)})`);
    });
  };

  // ------------------------------------------------------------------ illustrated host stand-in (original character)
  /** Desk set: muted teal wall, bookcase, framed sundial print, lamp, mug, books.
   *  Returns {g (camera it), back, mid (put K.host here), front (desk; pass as o.front to K.host for the arms)}. */
  K.hostSet = (parent, o = {}) => {
    const root = X.svg('g', {}, parent), C = K.C;
    const g = X.svg('g', {}, root), mid = X.svg('g', {}, root), front = X.svg('g', {}, root);
    K.rect(g, -400, -300, 2720, 1700, o.wall || '#CFE6DF');
    K.rect(g, -400, 690, 2720, 700, o.floor || '#B9D8CF');
    // bookcase
    const bc = X.svg('g', { transform: 'translate(120 150)' }, g);
    K.rect(bc, 0, 0, 430, 560, '#8C5A3A', 8); K.rect(bc, 18, 18, 394, 524, '#6E4329', 4);
    const r = X.rand(8), cols = ['#E4573D', '#F2B134', '#3FBFC4', '#2F6FA8', '#7B4FA0', '#F5F8F8', '#407E53', '#DC3A71'];
    for (let sh = 0; sh < 3; sh++) {
      K.rect(bc, 18, 180 + sh * 175, 394, 14, '#8C5A3A');
      let x = 30;
      while (x < 380) { const w = 22 + r() * 22, hh = 110 + r() * 50; K.rect(bc, x, 180 + sh * 175 - hh, w, hh, cols[Math.floor(r() * cols.length)], 3); x += w + 4; if (r() < 0.12) x += 26; }
    }
    // framed print: a sundial / sun diagram (nods to the topic, original)
    const fr = X.svg('g', { transform: 'translate(640 170)' }, g);
    K.rect(fr, 0, 0, 300, 240, '#F5F8F8', 6); K.rect(fr, 0, 0, 300, 240, 'none', 6, { stroke: '#8C5A3A', 'stroke-width': 14 });
    K.circ(fr, 150, 125, 70, C.sun); for (let k = 0; k < 10; k++) K.rect(fr, 146, 25, 8, 22, C.orange, 4, { transform: `rotate(${k * 36} 150 125)` });
    K.path(fr, 'M150,125 L150,72', 'none', { stroke: C.ink, 'stroke-width': 6, 'stroke-linecap': 'round' });
    // plant
    const pl = X.svg('g', { transform: 'translate(1640 520)' }, g);
    for (let k = 0; k < 7; k++) K.path(pl, 'M0,0 Q-20,-80 0,-150 Q22,-80 0,0', k % 2 ? C.leaf : C.leafDark, { transform: `rotate(${-54 + k * 18})` });
    K.path(pl, 'M-55,0 L55,0 L42,120 L-42,120 Z', C.coral); K.rect(pl, -60, -6, 120, 22, C.coralDark, 4);
    // desk
    K.rect(front, 520, 735, 1420, 40, '#B9784A', 6);
    K.rect(front, 560, 775, 1340, 400, '#9A5F37');
    K.rect(front, 560, 775, 1340, 26, '#7E4B2A');
    // lamp + mug + books on desk
    const lp = X.svg('g', { transform: 'translate(1600 735)' }, front);
    K.ell(lp, 0, -6, 70, 12, '#2D3B44'); K.rect(lp, -6, -230, 12, 226, '#2D3B44', 6);
    K.path(lp, 'M-10,-240 L120,-300 L150,-250 L20,-205 Z', '#2D3B44'); K.path(lp, 'M110,-305 L175,-235 L120,-215 L70,-280 Z', C.orange);
    const mg = X.svg('g', { transform: 'translate(760 735)' }, front);
    K.rect(mg, -38, -92, 76, 92, '#F5F8F8', 10); K.rect(mg, 22, -74, 34, 44, 'none', 14, { stroke: '#F5F8F8', 'stroke-width': 10 });
    K.rect(mg, -38, -60, 76, 18, C.mintDeep);
    const bk = X.svg('g', { transform: 'translate(880 735)' }, front);
    K.rect(bk, -10, -36, 170, 36, '#2F6FA8', 4); K.rect(bk, 4, -68, 150, 32, '#E4573D', 4); K.rect(bk, -4, -96, 160, 28, '#F2B134', 4);
    return { g: root, back: g, mid, front };
  };
  /** The host: brown skin, curly hair, short beard, mustard sweater, sitting behind the desk (head centre ≈ (1180, 400)). */
  K.host = (parent, o = {}) => {
    const sc = o.scale || 1.15;
    const g = X.svg('g', { transform: `translate(${o.x ?? 1180} ${o.y ?? 400}) scale(${sc})` }, parent);
    const skin = '#B87B55', skinD = '#9C6343', hair = '#2A1C15', sweat = '#E2A03A', sweatD = '#C8862A';
    const torso = X.svg('g', {}, g);
    // torso (behind desk, desk top at y = 335 local)
    K.path(torso, 'M-175,350 L-160,190 Q-150,130 -80,118 L80,118 Q150,130 160,190 L175,350 Z', sweat);
    K.path(torso, 'M40,118 L80,118 Q150,130 160,190 L175,350 L60,350 Z', sweatD);
    K.path(torso, 'M-44,112 L0,170 L44,112 Z', '#F5F8F8'); K.path(torso, 'M-26,112 L0,150 L26,112 Z', '#2F6FA8');
    // arms: forearms resting on desk with hands; pivots at elbows for gestures
    const armLayer = o.front ? X.svg('g', { transform: `translate(${o.x ?? 1180} ${o.y ?? 400}) scale(${sc})` }, o.front) : g;
    const mkArm = (side) => {
      const piv = X.svg('g', { transform: `translate(${side * 150} 300)` }, armLayer); const a = X.svg('g', {}, piv);
      K.path(a, `M${-side * 10},-150 Q${side * 40},-100 ${side * 22},0 L${-side * 40},10 Q${-side * 30},-100 ${-side * 60},-140 Z`, side < 0 ? sweat : sweatD);
      const fore = X.svg('g', { transform: 'translate(0 0)' }, a);   // GSAP gestures rotate this (svgOrigin '0 0' = elbow)
      const sway = X.svg('g', {}, fore);                                // K.hostTalk gesticulates this
      K.rect(sway, side < 0 ? -10 : -140, -27, 150, 54, side < 0 ? sweat : sweatD, 27);
      const hand = X.svg('g', { transform: `translate(${-side * 150} 0)` }, sway);
      K.rect(hand, -34, -30, 68, 56, skin, 26);
      K.rect(hand, side < 0 ? 18 : -42, -40, 22, 34, skin, 11);
      return { piv: a, fore, sway, hand };
    };
    const armL = mkArm(-1), armR = mkArm(1);
    // head
    const head = X.svg('g', {}, g);
    K.rect(head, -30, 60, 60, 70, skinD, 20);
    K.ell(head, -92, 2, 18, 26, skinD); K.ell(head, 92, 2, 18, 26, skinD);
    K.rect(head, -90, -110, 180, 200, skin, 80);
    // curly hair: cluster of circles
    const r = X.rand(3);
    for (let k = 0; k < 22; k++) { const a = Math.PI * (1.05 + k / 21 * 0.9), rr = 92 + r() * 8; K.circ(head, Math.cos(a) * rr * 1.02, -30 + Math.sin(a) * rr * 0.95, 30 + r() * 8, hair); }
    K.rect(head, -86, -112, 172, 60, hair, 30);
    // beard
    K.path(head, 'M-90,0 Q-88,95 0,108 Q88,95 90,0 L74,10 Q60,58 0,62 Q-60,58 -74,10 Z', hair);
    const face = X.svg('g', {}, head);
    const brows = X.svg('g', {}, face);
    K.rect(brows, -58, -40, 40, 10, hair, 5); K.rect(brows, 18, -40, 40, 10, hair, 5);
    const eyes = X.svg('g', {}, face);
    K.ell(eyes, -38, -8, 10, 12, K.C.ink); K.ell(eyes, 38, -8, 10, 12, K.C.ink);
    K.circ(eyes, -35, -12, 3, '#fff'); K.circ(eyes, 41, -12, 3, '#fff');
    K.path(face, 'M-4,4 Q-14,32 2,34', 'none', { stroke: skinD, 'stroke-width': 6, 'stroke-linecap': 'round' });
    const mouth = K.ell(face, 0, 60, 26, 4, '#5A2420');
    const tongue = K.ell(face, 0, 66, 14, 0, '#D9706A');
    return { g, armLayer, torso, head, face, eyes, brows, mouth, tongue, armL, armR };
  };
  /** Lip-flap + head life for the host from VO word times of the given line ids (pure function of t). */
  K.hostTalk = (host, lineIds, o = {}) => {
    const words = [];
    lineIds.forEach((id) => X.line(id).words.forEach((w) => words.push(w)));
    const vowels = (s) => Math.max(1, (s.toLowerCase().match(/[aeiouy]+/g) || []).length);
    X.every((t) => {
      let open = 0;
      for (const w of words) {
        if (t >= w.start && t < w.end) { const k = vowels(w.w), ph = (t - w.start) / Math.max(0.05, w.end - w.start); open = Math.abs(Math.sin(Math.PI * k * ph)) * (0.55 + 0.45 * ((w.w.length % 3) / 2)); break; }
      }
      host.mouth.setAttribute('ry', (4 + open * 22).toFixed(1));
      host.mouth.setAttribute('cy', (60 + open * 6).toFixed(1));
      host.tongue.setAttribute('ry', (open * 8).toFixed(1));
      const talking = words.some((w) => t >= w.start - 0.2 && t < w.end + 0.2);
      const rot = (talking ? 3.2 : 0.8) * Math.sin(t * 2.3) + (talking ? 1.8 * Math.sin(t * 5.1) : 0);
      host.head.setAttribute('transform', `rotate(${rot.toFixed(2)} 0 110) translate(0 ${(1.5 * Math.sin(t * 1.7)).toFixed(2)})`);
      const bl = (t + 1.7 + (o.blinkPhase || 0)) % 3.3; const sy = bl < 0.1 ? 0.12 : 1;
      host.eyes.setAttribute('transform', `translate(0 ${-8 * (1 - sy)}) scale(1 ${sy})`);
      host.torso.setAttribute('transform', `translate(${(talking ? 3 * Math.sin(t * 2.6) : 0).toFixed(2)} ${(2 * Math.sin(t * 1.7 + 0.4)).toFixed(2)})`);
      const gl = talking ? 7 * Math.sin(t * 4.4) + 4 * Math.sin(t * 2.3) : 0, gr = talking ? 7 * Math.sin(t * 3.9 + 1.3) + 4 * Math.sin(t * 2.1) : 0;
      host.armL.sway.setAttribute('transform', `rotate(${gl.toFixed(2)})`);
      host.armR.sway.setAttribute('transform', `rotate(${(-gr).toFixed(2)})`);
    });
  };

  // ------------------------------------------------------------------ props & set pieces
  K.sun = (p, cx, cy, r, o = {}) => {
    const g = X.svg('g', { transform: `translate(${cx} ${cy})` }, p);
    const rays = X.svg('g', {}, g);
    for (let k = 0; k < 12; k++) K.rect(rays, -9, -r - 52, 18, 38, o.ray || K.C.sun, 9, { transform: `rotate(${k * 30})` });
    K.circ(g, 0, 0, r, o.fill || K.C.sun); K.circ(g, -r * 0.18, -r * 0.18, r * 0.62, o.lite || K.C.sunLite);
    return { g, rays };
  };
  K.cloud = (p, x, y, s = 1, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const d = 'M-120,30 Q-140,-10 -95,-25 Q-90,-75 -35,-70 Q-5,-110 45,-80 Q100,-90 105,-35 Q150,-25 135,30 Z';
    K.path(g, d, o.fill || '#fff');
    K.path(g, d, K.hatch('cloudHatch', null, o.hatchCol || 'rgba(120,200,200,0.28)', 20, 6));
    return g;
  };
  K.palm = (p, x, y, s = 1, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const lean = o.lean ?? 18;
    for (let k = 0; k < 8; k++) { const t0 = k / 8, t1 = (k + 1) / 8; K.path(g, `M${-14 + lean * t0},${-t0 * 300} L${14 + lean * t0},${-t0 * 300} L${11 + lean * t1},${-t1 * 300 - 2} L${-11 + lean * t1},${-t1 * 300 - 2} Z`, k % 2 ? K.C.wood : K.C.woodDark); }
    const crownPos = X.svg('g', { transform: `translate(${lean} -300)` }, g);
    const crown = X.svg('g', {}, crownPos);   // K.loop this for sway (rotates about the trunk top)
    const angles = [-160, -125, -90, -55, -20, 15, 200];
    angles.forEach((a, i) => K.path(crown, 'M0,0 Q60,-46 150,-6 Q70,-20 0,8 Z', i % 2 ? K.C.leaf : K.C.leafDark, { transform: `rotate(${a + 90})` }));
    K.circ(crown, -8, 10, 10, K.C.woodDark); K.circ(crown, 10, 12, 10, K.C.wood);
    return { g, crown };
  };
  K.dunes = (p, y, cols, o = {}) => {
    const g = X.svg('g', {}, p), w = o.w || 1920, x0 = o.x0 || 0;
    cols.forEach((c, i) => {
      const yy = y + i * (o.step || 70), amp = (o.amp || 40) * (1 - i * 0.2);
      let d = `M${x0 - 50},${yy}`;
      for (let x = x0 - 50; x <= x0 + w + 100; x += 120) d += ` Q${x + 60},${yy - amp * (((x / 120 + i) % 2) ? 1 : -0.4)} ${x + 120},${yy}`;
      d += ` L${x0 + w + 100},${yy + 1200} L${x0 - 50},${yy + 1200} Z`;
      K.path(g, d, c);
    });
    return g;
  };
  /** Columned temple/library: base, steps, columns with one darker side, pediment. Anchor: bottom centre. */
  K.temple = (p, x, y, w = 560, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p), C = K.C;
    const h = w * 0.62;
    K.rect(g, -w / 2 - 30, -24, w + 60, 24, C.creamDark); K.rect(g, -w / 2 - 15, -46, w + 30, 22, C.cream);
    K.rect(g, -w / 2, -h, w, h - 46, '#E8D9BF');
    const n = o.cols || 6, cw = w / (n * 2 - 1);
    for (let i = 0; i < n; i++) { const cx = -w / 2 + i * 2 * cw; K.rect(g, cx, -h + 30, cw, h - 76, C.cream); K.rect(g, cx + cw * 0.62, -h + 30, cw * 0.38, h - 76, C.creamDark); K.rect(g, cx - 6, -h + 18, cw + 12, 16, C.cream, 3); }
    K.rect(g, -w / 2 - 20, -h - 26, w + 40, 46, C.cream, 4); K.rect(g, -w / 2 - 20, -h + 4, w + 40, 16, C.creamDark);
    K.path(g, `M${-w / 2 - 30},${-h - 26} L0,${-h - 26 - w * 0.22} L${w / 2 + 30},${-h - 26} Z`, C.cream);
    K.path(g, `M0,${-h - 26 - w * 0.22} L${w / 2 + 30},${-h - 26} L0,${-h - 26} Z`, C.creamDark);
    K.circ(g, 0, -h - 26 - w * 0.075, w * 0.045, C.creamDark); K.circ(g, 0, -h - 26 - w * 0.075, w * 0.03, o.accent || C.mintDeep);
    return g;
  };
  K.lighthouse = (p, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p), C = K.C;
    K.rect(g, -70, -200, 140, 200, C.cream); K.rect(g, 20, -200, 50, 200, C.creamDark);
    K.path(g, 'M-50,-200 L50,-200 L40,-330 L-40,-330 Z', C.cream); K.path(g, 'M15,-200 L50,-200 L40,-330 L12,-330 Z', C.creamDark);
    K.rect(g, -30, -400, 60, 70, C.cream); K.rect(g, 8, -400, 22, 70, C.creamDark);
    const flPos = X.svg('g', { transform: 'translate(0 -400)' }, g); const fl = X.svg('g', {}, flPos);
    K.path(fl, 'M-22,0 Q-24,-40 0,-70 Q24,-40 22,0 Z', C.orange); K.path(fl, 'M-11,0 Q-12,-24 0,-42 Q12,-24 11,0 Z', C.sun);
    for (const yy of [-120, -60]) K.rect(g, -24, yy, 20, 30, C.ink, 4);
    return { g, flame: fl };
  };
  /** Cut-away well: stone ring above ground, shaft through soil strata to water. Anchor: ground centre. */
  K.well = (p, x, y, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p), C = K.C, depth = o.depth || 360, w = o.w || 150;
    if (o.cutaway !== false) {
      K.rect(g, -w / 2 - 70, 0, w + 140, depth + 40, C.soil, 0);
      for (let k = 1; k < 4; k++) K.rect(g, -w / 2 - 70, k * depth / 4, w + 140, 10, '#A6743E');
      K.rect(g, -w / 2, 0, w, depth, '#5E4A3A');
      K.rect(g, -w / 2, 0, 18, depth, '#4B3A2E');
    }
    const water = K.rect(g, -w / 2, depth - 60, w, 60, C.water);
    K.rect(g, -w / 2, depth - 60, w, 10, '#7FE0E0');
    // stone ring
    for (let k = 0; k < 4; k++) K.rect(g, -w / 2 - 30 + (k % 2) * 20, -36 * (k + 1), w + 60 - (k % 2) * 40, 36, k % 2 ? C.stone : C.stoneDark, 6);
    K.rect(g, -w / 2 - 20, -36 * 4 - 14, w + 40, 18, C.stoneDark, 6);
    if (o.cutaway === false) { // little wooden winch over the ring
      K.rect(g, -w / 2 - 10, -300, 16, 160, C.woodDark, 6); K.rect(g, w / 2 - 6, -300, 16, 160, C.woodDark, 6);
      K.rect(g, -w / 2 - 24, -310, w + 48, 20, C.wood, 8); K.rect(g, -3, -290, 6, 90, '#7A6A55');
      K.path(g, `M-24,-200 L24,-200 L18,-160 L-18,-160 Z`, C.wood);
    }
    return { g, water, depth };
  };
  K.globe = (p, cx, cy, r, o = {}) => {
    const g = X.svg('g', { transform: `translate(${cx} ${cy})` }, p), id = K.uid('gl');
    const cp = X.svg('clipPath', { id }, X.defs); K.circ(cp, 0, 0, r, '#000');
    K.circ(g, 0, 0, r, o.sea || K.C.sea);
    const land = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    const L = o.land || K.C.leaf;
    const blobs = o.blobs || [[-0.35, -0.35, 0.42, 0.32], [0.25, -0.15, 0.3, 0.5], [-0.2, 0.42, 0.28, 0.22], [0.55, 0.45, 0.2, 0.16]];
    blobs.forEach(([bx, by, bw, bh], i) => K.ell(land, bx * r, by * r, bw * r, bh * r, i % 2 ? L : (o.land2 || '#4FB36A'), { transform: `rotate(${i * 25 - 20} ${bx * r} ${by * r})` }));
    const k = r * 0.16; // flat crescent shade, bottom-right (one darker tone, no gradient)
    K.path(g, `M${-r},0 a${r},${r} 0 1,0 ${2 * r},0 a${r},${r} 0 1,0 ${-2 * r},0 Z M${-r - k},${-k} a${r},${r} 0 1,1 ${2 * r},0 a${r},${r} 0 1,1 ${-2 * r},0 Z`, 'rgba(0,0,0,0.13)', { 'fill-rule': 'evenodd', 'clip-path': `url(#${id})` });
    g.land = land; // K.loop it (x drift) to spin the globe
    return g;
  };
  K.pin = (p, x, y, s = 1, col = K.C.red) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    K.path(g, 'M0,0 Q-46,-62 -46,-96 A46,46 0 1 1 46,-96 Q46,-62 0,0 Z', col); K.circ(g, 0, -96, 18, '#fff');
    return g;
  };
  /** Round white badge with a glyph drawn by fn(g) inside ±r. */
  K.badge = (p, x, y, r, fn, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p);
    K.circ(g, 4, 6, r, 'rgba(0,0,0,0.15)'); K.circ(g, 0, 0, r, o.fill || '#fff');
    if (o.ring) K.circ(g, 0, 0, r - 10, 'none', { stroke: o.ring, 'stroke-width': 6 });
    if (fn) fn(X.svg('g', {}, g));
    return g;
  };
  /** Greek beta drawn as a stroke (display fonts lack Greek). Centre-anchored, ~size tall. */
  K.beta = (p, x, y, size = 120, col = K.C.ink) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${size / 120})` }, p);
    K.path(g, 'M-22,62 L-22,-30 Q-22,-60 6,-60 Q32,-60 32,-36 Q32,-12 4,-10 Q40,-6 40,22 Q40,50 8,50 Q-10,50 -22,38', 'none', { stroke: col, 'stroke-width': 13, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' });
    return g;
  };
  K.pinkX = (p, x, y, size = 300, col = K.C.pink) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p), w = size * 0.2;
    K.rect(g, -size / 2, -w / 2, size, w, col, w / 2, { transform: 'rotate(45)' }); K.rect(g, -size / 2, -w / 2, size, w, col, w / 2, { transform: 'rotate(-45)' });
    return g;
  };
  K.check = (p, x, y, r = 46, col = K.C.leaf) => K.badge(p, x, y, r, (g) => K.path(g, `M${-r * 0.45},0 L${-r * 0.1},${r * 0.35} L${r * 0.5},${-r * 0.35}`, 'none', { stroke: col, 'stroke-width': r * 0.22, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }), { fill: '#fff' });
  K.scrollIcon = (p, x, y, s = 1, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    K.rect(g, -30, -22, 60, 44, o.paper || '#F6E7C6', 4);
    K.rect(g, -38, -26, 12, 52, o.roll || '#D9B77A', 6); K.rect(g, 26, -26, 12, 52, o.roll || '#D9B77A', 6);
    for (let k = 0; k < 3; k++) K.rect(g, -18, -12 + k * 10, 36, 4, '#B89A66', 2);
    return g;
  };
  K.stick = (p, x, y, len = 220, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p);
    const inner = X.svg('g', {}, g), w = o.w || 14;
    K.rect(inner, -w / 2, -len, w, len, o.col || K.C.woodDark, w / 2); K.rect(inner, -w / 2, -len, w * 0.43, len, o.col2 || K.C.wood, w / 4);
    return { g, inner };
  };
  K.podium = (p, x, y, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p), C = K.C;
    const steps = [[-1, 150, '2', '#C9D3D4', '#AEBBBD'], [0, 230, '1', C.yellow, '#E9C04E'], [1, 100, '3', '#E8A46A', '#CF8A50']];
    for (const [i, h, n, c, cd] of steps) { K.rect(g, i * 200 - 100, -h, 200, h, c); K.rect(g, i * 200 + 40, -h, 60, h, cd); K.txt(g, n, i * 200, -h + 90, { size: 90, fill: '#fff' }); }
    return g;
  };
  K.dartboard = (p, x, y, r = 170) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p);
    K.circ(g, 6, 8, r, 'rgba(0,0,0,0.18)');
    [[1, K.C.ink], [0.82, '#fff'], [0.64, K.C.coral], [0.46, '#fff'], [0.28, K.C.coral], [0.12, K.C.ink]].forEach(([k, c]) => K.circ(g, 0, 0, r * k, c));
    return g;
  };
  K.dart = (p, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, p);
    const inner = X.svg('g', {}, g);
    K.rect(inner, 0, -5, 120, 10, K.C.ink, 5); K.path(inner, 'M0,0 L-24,-5 L-24,5 Z', '#9AA');
    K.path(inner, 'M96,0 L150,-30 L135,0 L150,30 Z', K.C.yellow);
    return { g, inner };
  };
  K.ruler = (p, x, y, w = 600, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p), inner = X.svg('g', {}, g);
    K.rect(inner, 0, -40, w, 80, o.fill || K.C.yellow, 10); K.rect(inner, 0, 18, w, 22, 'rgba(0,0,0,0.12)', 0);
    for (let k = 0; k <= 20; k++) K.rect(inner, 20 + k * (w - 40) / 20, -40, 6, k % 5 ? 26 : 46, K.C.ink, 2);
    return { g, inner };
  };
  /** Rounded "projector" frame with dark inner vignette (maps, cards). */
  K.mapFrame = (p, x, y, w, h, o = {}) => {
    const g = X.svg('g', {}, p), id = K.uid('mf');
    const cp = X.svg('clipPath', { id }, X.defs); K.rect(cp, x, y, w, h, '#000', 34);
    const inner = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    K.rect(inner, x, y, w, h, o.fill || '#fff');
    const content = X.svg('g', {}, inner);
    const vg = X.radial(K.uid('vig'), [[0.7, '#000', 0], [1, '#000', o.vignette ?? 0.3]]);
    K.rect(inner, x, y, w, h, vg);
    K.rect(g, x, y, w, h, 'none', 34, { stroke: o.rim || K.C.ink, 'stroke-width': 14 });
    return { g, content };
  };
  /** Coral pill label with white condensed caps (place names, tags). */
  K.label = (p, x, y, text, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, p);
    const size = o.size || 52, w = (o.w || text.length * size * 0.42 + size * 1.0);
    K.rect(g, -w / 2 + 4, -size * 0.62 + 6, w, size * 1.24, 'rgba(0,0,0,0.18)', size * 0.62);
    K.rect(g, -w / 2, -size * 0.62, w, size * 1.24, o.fill || K.C.coral, size * 0.62);
    K.txt(g, text, 0, size * 0.36, { size, fill: o.color || '#fff', ls: 2 });
    return g;
  };
})();
