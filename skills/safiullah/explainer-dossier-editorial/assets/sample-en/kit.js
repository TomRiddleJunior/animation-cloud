/* explainer-dossier-editorial kit — ENGLISH EDITION (copied from samples/dossier-editorial/kit.js and adapted).
 *  Changes vs the Chinese kit: DK.F maps 'zh' → Playfair Display 900 (heavy English serif) and 'zhs' → Inter,
 *  mono → Roboto Mono; adds 'head' / 'dm' (DM Serif Display) / 'sans'; tag / stamp / card auto-fit English words;
 *  HUD in Roboto Mono + Inter with chapter(t,text); titleCard lays out a WORD (e.g. TOLL) with a right-hand column;
 *  new: DK.isoRows (hundreds of seat figures, one SVG per row), DK.ill sea / ships / truck / pump / boxes painters.
 *  index.html: <html lang="en"> (no CJK fonts needed).
 *
 * paper-dossier political-economy explainer helpers for explainer-engine (window.X).
 *
 * Load after /engine/lib/explainer.js, before scene.js; call DK.init(X) first thing inside X.boot (after loadVO).
 * index.html must hold, inside #stage and in this order: <svg id="svg"> (world), <div id="iso"> (CSS-3D plane layer),
 * <svg id="ovl"> (screen overlays: vignette, flash, word cards, title card), <div id="hud"> (sharp HTML HUD).
 * Everything is a pure function of time (X.tl tweens on fixed from/to values, or X.every hooks) — safe for seeking.
 *
 *  palette/type DK.C · DK.F                     paper world + judgement red; Noto Serif SC / Libre Baskerville / Courier
 *  textures     DK.pat(name) → url(#…)           paper patterns: cream ivory slip card pink graph cert kraft verm black land
 *  desk         DK.desk(parent, o)                pre-rendered poster-collage desk (canvas → image), soft + low contrast
 *  camera       DK.camera(o) → cam                analytic camera: cam.cut / cam.whip / cam.zoom / cam.move / cam.shake,
 *                                                 breathing push between moves, motion blur + zoom ghosts from velocity
 *  paper        DK.sheet · DK.pin · DK.tape · DK.text · DK.measure · DK.type (typewriter + cursor) · DK.tag · DK.stamp
 *  plates       DK.halftone(draw,w,h,o) → dataURL · DK.plate(parent,url,o) · DK.ill.* canvas silhouette painters
 *  data         DK.counter · DK.during(t0,t1,fn) · DK.guilloche · DK.rosette
 *  overlays     DK.vignette (iris / spotlight track) · DK.flash · DK.card (hard-cut word card) · DK.titleCard · DK.hole
 *  HUD          DK.hud(prog, chapter) → {slug(t,text), source(t,text), hide(t0,t1)}
 *  3-D plane    DK.iso(o) → isotype grid on a CSS-3D tilted desk with stand-up figures + cast shadows
 *  timing       DK.at(lineId, word, fallback) — VO word time, or a fixed time for the music-only variant
 */
(function () {
  const DK = (window.DK = {});
  const C = (DK.C = {
    desk: '#d6ccb8', cream: '#ece3d1', ivory: '#f1eadb', slip: '#e6dcc7', card: '#f4efe4', pink: '#ebd3c4', graph: '#ece7da',
    cert: '#d5dbcd', kraft: '#bc9a6c', land: '#e6dbba', land2: '#efe8d2', sea: '#c9d3d6', seaLine: '#9fb2b9',
    grey: '#8e857a', grey2: '#706f69', slate: '#7d8593', salmon: '#bb8574', mustard: '#cfae6a', beige: '#c4bbad', paperMid: '#d1c5a9',
    ink: '#23211e', ink2: '#3b3732', hud: '#6b665e', faint: '#a49d90', rule: '#b9b2a4', blueLine: '#b8c3c9',
    red: '#c13a2d', redInk: '#c4342a', verm: '#8d281b', black: '#151413', orange: '#e2702a', yellow: '#f4c142', hilite: '#f2c94c',
    green: '#2d5b4e', guil: '#4d7f73', sepia: '#5b4a37', noteInk: '#3f5a52', brown: '#7a5232',
  });
  const F = (DK.F = {
    // English edition: the 'zh' role (heavy display serif) is Playfair Display 900; 'zhs' (small sans) is Inter.
    zh: "'Playfair Display', 'DM Serif Display', Georgia, serif", head: "'Playfair Display', Georgia, serif",
    dm: "'DM Serif Display', Georgia, serif", zhs: "'Inter', sans-serif", sans: "'Inter', sans-serif",
    lat: "'Libre Baskerville', Georgia, serif", mono: "'Roboto Mono', 'Courier New', monospace", rmono: "'Roboto Mono', monospace",
  });
  const WDEF = { zh: 900, head: 900, dm: 400, zhs: 500, sans: 500, lat: 700, mono: 600, rmono: 500 };
  DK.W = 1920; DK.H = 1080;
  let X = null, uidN = 0;
  const uid = (DK.uid = (p = 'dk') => `${p}${++uidN}`);
  const NS = 'http://www.w3.org/2000/svg';

  // ------------------------------------------------------------------ init
  DK.init = (x, o = {}) => {
    X = x;
    DK.world = X.root;
    DK.ovl = document.getElementById('ovl') || (() => { const s = document.createElementNS(NS, 'svg'); s.id = 'ovl'; X.stage.appendChild(s); return s; })();
    ['width', 'height'].forEach((k, i) => DK.ovl.setAttribute(k, i ? 1080 : 1920));
    DK.ovl.setAttribute('viewBox', '0 0 1920 1080');
    Object.assign(DK.ovl.style, { position: 'absolute', left: 0, top: 0, pointerEvents: 'none' });
    DK.odefs = DK.ovl.querySelector('defs') || DK.ovl.insertBefore(document.createElementNS(NS, 'defs'), DK.ovl.firstChild);
    DK.isoDiv = document.getElementById('iso');
    DK.hudDiv = document.getElementById('hud');
    // shadows
    X.shadow('dkSh', 7, 11, 11, '#2a2016', 0.32);
    X.shadow('dkShS', 3, 5, 4, '#2a2016', 0.3);
    X.shadow('dkShL', 12, 18, 18, '#2a2016', 0.36);
    // distressed ink for stamps: speckled voids + wobbly edge
    const f = X.svg('filter', { id: 'dkInk', x: '-10%', y: '-20%', width: '120%', height: '140%' }, X.defs);
    X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.8, numOctaves: 2, seed: 7, result: 'n' }, f);
    X.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 3, xChannelSelector: 'R', yChannelSelector: 'G', result: 'd' }, f);
    X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 0.35, numOctaves: 3, seed: 3, result: 'm' }, f);
    X.svg('feColorMatrix', { in: 'm', type: 'matrix', values: '0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -1.5 1.62', result: 'ma' }, f);
    X.svg('feComposite', { in: 'd', in2: 'ma', operator: 'in' }, f);
    // light ink bleed for typed text
    const fi = X.svg('filter', { id: 'dkType', x: '-2%', y: '-10%', width: '104%', height: '120%' }, X.defs);
    X.svg('feTurbulence', { type: 'fractalNoise', baseFrequency: 1.1, numOctaves: 1, seed: 5, result: 'n' }, fi);
    X.svg('feDisplacementMap', { in: 'SourceGraphic', in2: 'n', scale: 1.4, xChannelSelector: 'R', yChannelSelector: 'G' }, fi);
    // overlay copies of the same filters
    const fo = X.svg('filter', { id: 'dkInkO', x: '-10%', y: '-20%', width: '120%', height: '140%' }, DK.odefs);
    [...f.children].forEach((c) => fo.appendChild(c.cloneNode(true)));
    const fs = X.svg('filter', { id: 'dkShO', x: '-30%', y: '-30%', width: '160%', height: '160%' }, DK.odefs);
    X.svg('feDropShadow', { dx: 8, dy: 12, stdDeviation: 12, 'flood-color': '#1d150e', 'flood-opacity': 0.4 }, fs);
    // paper patterns (both svgs)
    DK._pats = {};
    const mk = (name, color, strength = 0.07, seed = 3, extra) => {
      const url = X.paper(color, 900, 600, strength, seed);
      for (const [defs, pre] of [[X.defs, 'dkp-'], [DK.odefs, 'dko-']]) {
        const p = X.svg('pattern', { id: pre + name, patternUnits: 'userSpaceOnUse', width: 900, height: 600 }, defs);
        X.svg('image', { href: url, width: 900, height: 600 }, p);
        if (extra) extra(p);
      }
    };
    mk('cream', C.cream, 0.075, 3); mk('ivory', C.ivory, 0.06, 5); mk('slip', C.slip, 0.09, 7); mk('card', C.card, 0.05, 9);
    mk('pink', C.pink, 0.07, 11); mk('cert', C.cert, 0.06, 13); mk('kraft', C.kraft, 0.12, 15); mk('verm', C.verm, 0.13, 17);
    mk('black', '#1b1a18', 0.5, 19); mk('land', C.land, 0.08, 21); mk('land2', C.land2, 0.06, 23); mk('sea', C.sea, 0.06, 25);
    mk('note', '#dfe2d2', 0.06, 27); mk('renten', '#ecdcc0', 0.07, 29);
    mk('graph', C.graph, 0.05, 31, (p) => {
      for (let i = 0; i <= 900; i += 30) X.svg('line', { x1: i, y1: 0, x2: i, y2: 600, stroke: '#cfc6b3', 'stroke-width': i % 150 ? 0.6 : 1.2 }, p);
      for (let j = 0; j <= 600; j += 30) X.svg('line', { x1: 0, y1: j, x2: 900, y2: j, stroke: '#cfc6b3', 'stroke-width': j % 150 ? 0.6 : 1.2 }, p);
    });
    return DK;
  };
  DK.pat = (name, ovl = false) => `url(#${ovl ? 'dko-' : 'dkp-'}${name})`;

  /** start (or end) time of a phrase inside a line. Works for CJK, where tts.py makes every character its own "word"
   *  (X.word only matches a single unit, so X.word(id,'废纸') would fail). nth = occurrence index. */
  DK.word = (id, phrase, nth = 0, end = false) => {
    const l = X.line(id);
    if (!l.words || !l.words.length) return end ? l.end : l.start;
    const norm = (s) => s.toLowerCase().replace(/[^\p{L}\p{N}%$']/gu, '');
    let str = []; const idx = [];
    l.words.forEach((w, i) => { for (const ch of norm(w.w)) { str.push(ch); idx.push(i); } });
    const hay = str.join(''), target = [...norm(phrase)];
    let pos = -1, from = 0, cpos = -1;
    for (let k = 0; k <= nth; k++) { pos = hay.indexOf(target.join(''), from); if (pos < 0) break; from = pos + 1; }
    if (pos < 0) { console.warn(`DK.word: "${phrase}" not in line ${id}`); return end ? l.end : l.start; }
    cpos = [...hay.slice(0, pos)].length;              // code-point index
    return end ? l.words[idx[cpos + target.length - 1]].end : l.words[idx[cpos]].start;
  };
  DK.wordEnd = (id, phrase, nth = 0) => DK.word(id, phrase, nth, true);
  /** VO phrase time, or the fallback when there is no narration (music-only variant). */
  DK.at = (id, phrase, fallback) => {
    if (!X.vo.lines || !X.vo.lines.length) return fallback;
    return phrase ? DK.word(id, phrase) : X.line(id).start;
  };
  DK.end = (id, fallback) => (X.vo.lines && X.vo.lines.length ? X.line(id).end : fallback);

  // ------------------------------------------------------------------ text
  let meas = null;
  DK.measure = (text, size, family = F.zh, weight = 900, ls = 0) => {
    if (!meas) meas = X.svg('text', { x: -9999, y: -9999 }, X.root);
    Object.entries({ 'font-size': size, 'font-family': family, 'font-weight': weight, 'letter-spacing': ls }).forEach(([k, v]) => meas.setAttribute(k, v));
    meas.textContent = text;
    return meas.getComputedTextLength();
  };
  DK.text = (parent, x, y, text, o = {}) => X.svg('text', {
    x, y, text, 'font-family': F[o.f || 'zh'] || o.f, 'font-size': o.size ?? 40, 'font-weight': o.weight ?? (WDEF[o.f || 'zh'] ?? 700),
    'font-style': o.style || 'normal', fill: o.fill || C.ink, 'text-anchor': o.anchor || 'start', 'letter-spacing': o.ls ?? 0,
    opacity: o.op ?? 1, ...(o.filter ? { filter: o.filter } : {}),
  }, parent);

  /** per-frame helper: fn(p) with p clamped to [0,1] over [t0,t1]; fn runs every frame (keep it cheap) */
  DK.during = (t0, t1, fn) => X.every((t) => fn(Math.min(1, Math.max(0, (t - t0) / Math.max(1e-6, t1 - t0))), t));

  /** typewriter: reveals text at cps from t, block cursor while typing (+0.5 s blink), 'type' sfx */
  DK.type = (parent, x, y, text, t, o = {}) => {
    const cps = o.cps ?? 24, size = o.size ?? 30, fam = o.f || 'mono';
    const el = DK.text(parent, x, y, '', { ...o, f: fam, size, filter: o.ink === false ? undefined : 'url(#dkType)' });
    const chars = [...text], n = chars.length, dur = n / cps;
    const pre = [0];
    for (let i = 1; i <= n; i++) pre.push(DK.measure(chars.slice(0, i).join(''), size, F[fam] || fam, el.getAttribute('font-weight'), o.ls ?? 0));
    const cur = o.cursor === false ? null : X.svg('rect', { x, y: y - size * 0.82, width: size * 0.55, height: size * 0.95, fill: o.fill || C.ink, opacity: 0 }, parent);
    let last = -1;
    X.every((tt) => {
      const k = tt < t ? 0 : Math.min(n, Math.floor((tt - t) * cps + 1e-6) + (tt >= t ? 1 : 0));
      if (k !== last) { el.textContent = chars.slice(0, k).join(''); last = k; }
      if (cur) {
        const on = tt >= t - 0.05 && tt < t + dur + 0.55 && (tt < t + dur || Math.floor((tt - t - dur) * 4) % 2 === 0);
        cur.setAttribute('opacity', on ? 0.85 : 0);
        cur.setAttribute('x', x + (o.anchor === 'end' ? 0 : pre[k]) + 2);
      }
    });
    if (o.sfx !== false && n > 2) X.sfx(t, 'type', { dur: Math.min(dur, 3), gain: o.gain ?? 0.32 });
    el.dur = dur;
    return el;
  };

  // ------------------------------------------------------------------ paper objects
  /** a sheet of paper at desk coords (cx,cy) = centre; returns inner <g> in local 0..w,0..h. o.edge: torn|clean|deckle */
  DK.sheet = (parent, o) => {
    const { w, h } = o;
    const outer = X.svg('g', {}, parent);
    const g = X.svg('g', { transform: `translate(${o.x ?? 0},${o.y ?? 0}) rotate(${o.rot || 0}) translate(${-w / 2},${-h / 2})` }, outer);
    const edge = o.edge || 'clean';
    const d = edge === 'clean' ? `M0,0H${w}V${h}H0Z` : X.torn(w, h, edge === 'torn' ? (o.jag ?? 9) : 3, o.seed ?? 1, edge === 'torn' ? 13 : 7);
    X.svg('path', { d, fill: o.fill || DK.pat(o.paper || 'cream', o.ovl), filter: o.shadow === false ? null : `url(#${o.ovl ? 'dkShO' : (o.big ? 'dkShL' : 'dkSh')})` }, g);
    if (o.lines) for (let yy = o.lines.y0 ?? 120; yy < h - 30; yy += o.lines.step ?? 44) X.svg('line', { x1: 0, y1: yy, x2: w, y2: yy, stroke: C.blueLine, 'stroke-width': 1.2, opacity: 0.8 }, g);
    if (o.margin) X.svg('line', { x1: o.margin, y1: 0, x2: o.margin, y2: h, stroke: C.red, 'stroke-width': 1.6, opacity: 0.6 }, g);
    g.outer = outer; g.w = w; g.h = h;
    return g;
  };
  /** red glass-headed pin */
  DK.pin = (parent, x, y, r = 11) => {
    const g = X.svg('g', { transform: `translate(${x},${y})` }, parent);
    X.svg('ellipse', { cx: 4, cy: 6, rx: r * 0.9, ry: r * 0.6, fill: '#000', opacity: 0.25 }, g);
    X.svg('circle', { r, fill: '#b8261d' }, g);
    X.svg('circle', { cx: -r * 0.3, cy: -r * 0.35, r: r * 0.32, fill: '#fff', opacity: 0.75 }, g);
    return g;
  };
  DK.tape = (parent, x, y, w = 120, rot = -8, op = 0.62) => X.svg('rect', { x: x - w / 2, y: y - 16, width: w, height: 32, fill: '#e9e0c4', opacity: op, transform: `rotate(${rot},${x},${y})`, filter: 'url(#dkShS)' }, parent);

  /** taped paper tag (Chinese word + Latin gloss) that slides in from `from` (right|left|top) and settles */
  DK.tag = (parent, zh, en, x, y, t, o = {}) => {
    const size = o.size ?? 54, w = o.w ?? Math.max(DK.measure(zh, size, F.zh, 900, o.ls ?? 1) + 70, DK.measure(en, 20, F.mono, 600, 3) + 74), h = o.h ?? size + 58;
    const g = X.svg('g', {}, parent), inner = X.svg('g', { transform: `translate(${x},${y}) rotate(${o.rot ?? -3})` }, g);
    X.svg('path', { d: X.torn(w, h, 3, o.seed ?? 5, 9), fill: DK.pat(o.paper || 'card', o.ovl), filter: `url(#${o.ovl ? 'dkShO' : 'dkShS'})` }, inner);
    DK.text(inner, 34, size + 6, zh, { size, fill: o.fill || C.ink, ls: o.ls ?? 1 });
    DK.text(inner, 36, size + 40, en, { f: 'mono', size: 20, ls: 3, fill: o.glossFill || C.ink2 });
    const dx = o.from === 'left' ? -420 : o.from === 'top' ? 0 : 420, dy = o.from === 'top' ? -420 : 0;
    gsap.set(g, { opacity: 0 });
    X.tl.fromTo(g, { x: dx, y: dy, rotation: o.from === 'left' ? -6 : 6, opacity: 1, svgOrigin: `${x} ${y}` },
      { x: 0, y: 0, rotation: 0, opacity: 1, duration: 0.34, ease: 'back.out(1.3)', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, 'paper', { dur: 0.3, gain: 0.4 });
    g.inner = inner; g.w = w; g.h = h;
    return g;
  };

  /** rubber stamp: double-ruled box + heavy serif word, distressed ink; slams over 2 frames with a thud */
  DK.stamp = (parent, text, x, y, t, o = {}) => {
    const size = o.size ?? 96, fam = o.latin ? F.lat : F.zh, wt = o.latin ? 700 : 900, ls = o.ls ?? Math.round(size * 0.07);
    const tw = DK.measure(text, size, fam, wt, ls), padX = size * 0.34, padY = size * 0.22;
    const w = tw + padX * 2, h = size * 1.05 + padY * 2;
    const g = X.svg('g', { transform: `translate(${x},${y})` }, parent);
    const s = X.svg('g', {}, g);
    const ink = X.svg('g', { filter: `url(#${o.ovl ? 'dkInkO' : 'dkInk'})`, opacity: 0.93 }, s);
    const col = o.color || C.redInk, sw = Math.max(3, size * 0.055);
    if (o.box !== false) {
      X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h, fill: 'none', stroke: col, 'stroke-width': sw, rx: 3 }, ink);
      X.svg('rect', { x: -w / 2 + sw * 2.2, y: -h / 2 + sw * 2.2, width: w - sw * 4.4, height: h - sw * 4.4, fill: 'none', stroke: col, 'stroke-width': sw * 0.5 }, ink);
    }
    DK.text(ink, 0, size * 0.36, text, { f: o.latin ? 'lat' : 'zh', size, weight: wt, fill: col, anchor: 'middle', ls });
    if (o.sub) DK.text(ink, 0, h / 2 + 34, o.sub, { f: 'mono', size: o.subSize ?? 22, fill: col, anchor: 'middle', ls: 3 });
    const rot = o.rot ?? -5;
    gsap.set(s, { opacity: 0, transformOrigin: '50% 50%' });
    X.tl.fromTo(s, { opacity: 0.55, scale: 1.32, rotation: rot - 3 }, { opacity: 0.55, scale: 1.32, rotation: rot - 3, duration: 0.001, immediateRender: false }, t);
    X.tl.fromTo(s, { opacity: 0.55, scale: 1.32, rotation: rot - 3 }, { opacity: 1, scale: 1, rotation: rot, duration: 1 / 30, ease: 'power4.in', immediateRender: false }, t + 0.001);
    X.tl.fromTo(s, { scale: 1 }, { scale: 1.018, duration: 1 / 30, ease: 'none', immediateRender: false }, t + 2 / 30);
    X.tl.fromTo(s, { scale: 1.018 }, { scale: 1, duration: 2 / 30, ease: 'power2.out', immediateRender: false }, t + 3 / 30);
    if (o.sfx !== false) X.sfx(t, 'stamp', { dur: 0.35, gain: o.gain ?? 0.85 });
    if (o.cam) o.cam.shake(t + 1 / 30, o.shake ?? 5);
    g.w = w; g.h = h;
    return g;
  };

  /** counter on an SVG text: linear or log interpolation; fmt(v) → string */
  DK.counter = (el, from, to, t, dur, o = {}) => {
    const fmt = o.fmt || ((v) => Math.round(v).toLocaleString('en-US'));
    const ease = gsap.parseEase(o.ease || 'power2.out');
    let last = null;
    X.every((tt) => {
      const p = ease(Math.min(1, Math.max(0, (tt - t) / dur)));
      const v = o.log ? Math.pow(10, Math.log10(from) + (Math.log10(to) - Math.log10(from)) * p) : from + (to - from) * p;
      const s = p >= 1 ? fmt(to) : fmt(v);
      if (s !== last) { el.textContent = s; last = s; }
    });
    if (o.ticks !== false) for (let k = 0; k < Math.floor(dur / 0.09); k++) X.sfx(t + k * 0.09, 'tick', { gain: 0.12, pitch: 1 + k * 0.01 });
  };

  /** guilloche border (wavy interlaced lines) in a w×h frame; returns g */
  DK.guilloche = (parent, x, y, w, h, o = {}) => {
    const g = X.svg('g', { transform: `translate(${x},${y})`, fill: 'none', stroke: o.color || C.guil, 'stroke-width': o.sw ?? 1, opacity: o.op ?? 0.75 }, parent);
    const band = o.band ?? 22, per = o.per ?? 26;
    const side = (x0, y0, x1, y1) => {
      const L = Math.hypot(x1 - x0, y1 - y0), ux = (x1 - x0) / L, uy = (y1 - y0) / L, nx = -uy, ny = ux, N = Math.round(L / 4);
      for (let k = 0; k < 3; k++) {
        let d = '';
        for (let i = 0; i <= N; i++) {
          const s = (i / N) * L, a = Math.sin((s / per) * Math.PI * 2 + k * 2.1) * band * 0.45;
          d += (i ? 'L' : 'M') + (x0 + ux * s + nx * a).toFixed(1) + ',' + (y0 + uy * s + ny * a).toFixed(1);
        }
        X.svg('path', { d }, g);
      }
    };
    const m = band * 0.6;
    side(m, m, w - m, m); side(w - m, m, w - m, h - m); side(w - m, h - m, m, h - m); side(m, h - m, m, m);
    X.svg('rect', { x: band * 1.3, y: band * 1.3, width: w - band * 2.6, height: h - band * 2.6, 'stroke-width': 1.4 }, g);
    X.svg('rect', { x: 2, y: 2, width: w - 4, height: h - 4, 'stroke-width': 1.2 }, g);
    return g;
  };
  /** spirograph rosette seal */
  DK.rosette = (parent, cx, cy, r, o = {}) => {
    const g = X.svg('g', { transform: `translate(${cx},${cy})`, fill: 'none', stroke: o.color || C.guil, 'stroke-width': o.sw ?? 0.9, opacity: o.op ?? 0.85 }, parent);
    const R = r, k = o.k ?? 0.38, l = o.l ?? 0.9, N = 720;
    let d = '';
    for (let i = 0; i <= N; i++) {
      const th = (i / N) * Math.PI * 2 * 19;
      const x = R * ((1 - k) * Math.cos(th) + l * k * Math.cos(((1 - k) / k) * th)) * 0.62;
      const y = R * ((1 - k) * Math.sin(th) - l * k * Math.sin(((1 - k) / k) * th)) * 0.62;
      d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1);
    }
    X.svg('path', { d }, g);
    X.svg('circle', { r: R * 0.98, 'stroke-width': 1.2 }, g);
    X.svg('circle', { r: R * 0.36, 'stroke-width': 1.2 }, g);
    return g;
  };

  // ------------------------------------------------------------------ desk (poster collage)
  /** paints the protest-poster desk once at boot; returns the <image> (desk coords: centred on 0,0) */
  DK.desk = (parent, o = {}) => {
    const W = o.w ?? 5200, H = o.h ?? 3200, k = 0.5;     // canvas at half res → soft background (depth of field)
    const cw = W * k, ch = H * k;
    const cv = document.createElement('canvas'); cv.width = cw; cv.height = ch;
    const c = cv.getContext('2d'), r = X.rand(o.seed ?? 41);
    c.fillStyle = C.desk; c.fillRect(0, 0, cw, ch);
    const cols = o.colors || [C.paperMid, C.beige, C.grey, C.slate, C.salmon, C.cream, C.slip, C.grey2, C.mustard, '#a9a397', '#9aa3b5', '#d9cfbb'];
    const words = o.words || ['STRIKE', 'BREAD', 'WAGES', 'NOW', 'WORK', 'MARK', 'NO!', 'TODAY', 'PRICES', 'UNITY', 'VOTE', 'BERLIN', 'RUHR', 'HUNGER', 'JOBS', '1923'];
    const small = o.small || ['NOTICE', 'MEETING', 'TONIGHT', 'WORKERS', 'APPEAL', 'SATURDAY 3 PM', 'DEMAND', 'PRICES', 'COAL', 'BULLETIN'];
    const tornPoly = (x, y, w, h, jag) => {
      const pts = [], step = 10;
      const edge = (x0, y0, x1, y1) => { const L = Math.hypot(x1 - x0, y1 - y0), n = Math.max(2, Math.round(L / step)); for (let i = 0; i < n; i++) { const t = i / n; pts.push([x0 + (x1 - x0) * t + (r() - 0.5) * jag, y0 + (y1 - y0) * t + (r() - 0.5) * jag]); } };
      edge(x, y, x + w, y); edge(x + w, y, x + w, y + h); edge(x + w, y + h, x, y + h); edge(x, y + h, x, y);
      c.beginPath(); pts.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.closePath();
    };
    const N = o.count ?? 120;
    for (let i = 0; i < N; i++) {
      const big = r() < 0.55;
      const w = (big ? 260 + r() * 360 : 110 + r() * 150), h = (big ? 300 + r() * 420 : 150 + r() * 160);
      const x = r() * (cw + 200) - 100 - w / 2, y = r() * (ch + 200) - 100 - h / 2;
      c.save(); c.translate(x + w / 2, y + h / 2); c.rotate((r() - 0.5) * 0.16); c.translate(-w / 2, -h / 2);
      c.shadowColor = 'rgba(40,30,20,0.28)'; c.shadowBlur = 8; c.shadowOffsetX = 3; c.shadowOffsetY = 4;
      const col = big ? cols[Math.floor(r() * cols.length)] : [C.cream, C.slip, '#e8e0cc', '#ddd4bf'][Math.floor(r() * 4)];
      tornPoly(0, 0, w, h, big ? 7 : 4); c.fillStyle = col; c.fill();
      c.shadowColor = 'transparent'; c.save(); c.clip();
      if (big) {
        const word = words[Math.floor(r() * words.length)], fs = 150 + r() * 130;
        c.font = `700 ${fs}px 'Libre Baskerville', Georgia, serif`;
        const dark = ['#7d8593', '#706f69', '#8e857a', '#bb8574'].includes(col);
        c.fillStyle = dark ? 'rgba(235,228,212,0.55)' : 'rgba(80,72,62,0.32)';
        c.fillText(word, -r() * fs * 0.8, h * (0.35 + r() * 0.5));
        if (r() < 0.5) { c.font = `700 ${34 + r() * 20}px 'Libre Baskerville', serif`; c.fillText(small[Math.floor(r() * small.length)], 18, h - 26); }
        if (r() < 0.35) { c.fillStyle = dark ? 'rgba(235,228,212,0.35)' : 'rgba(80,72,62,0.25)'; c.beginPath(); c.arc(w * (0.3 + r() * 0.4), h * 0.4, 50 + r() * 60, 0, 7); c.fill(); }
      } else {
        c.font = `700 ${16 + r() * 6}px 'Courier New', monospace`; c.fillStyle = 'rgba(70,64,56,0.75)';
        c.fillText(small[Math.floor(r() * small.length)], 14, 30);
        c.fillStyle = 'rgba(110,104,96,0.55)';
        for (let yy = 46; yy < h - 14; yy += 15) c.fillRect(14, yy, (w - 28) * (0.55 + r() * 0.45), 5);
      }
      c.restore();
      if (r() < 0.3) { c.fillStyle = 'rgba(236,226,196,0.6)'; c.save(); c.translate(w * r(), -6); c.rotate((r() - 0.5) * 0.5); c.fillRect(-36, -10, 72, 22); c.restore(); }
      c.restore();
    }
    // fibre noise + low contrast wash
    const img = c.getImageData(0, 0, cw, ch), dd = img.data;
    for (let i = 0; i < dd.length; i += 4) { const n = (r() - 0.5) * 16; dd[i] += n; dd[i + 1] += n; dd[i + 2] += n; }
    c.putImageData(img, 0, 0);
    c.fillStyle = `rgba(226,216,196,${o.wash ?? 0.2})`; c.fillRect(0, 0, cw, ch);
    const cv2 = document.createElement('canvas'); cv2.width = cw; cv2.height = ch;
    const c2 = cv2.getContext('2d'); c2.filter = `blur(${o.blur ?? 0.8}px)`; c2.drawImage(cv, 0, 0);
    const url = cv2.toDataURL('image/jpeg', 0.86);
    DK.deskURL = url; DK.deskW = W; DK.deskH = H;
    return X.svg('image', { href: url, x: -W / 2, y: -H / 2, width: W, height: H, preserveAspectRatio: 'none' }, parent);
  };

  // ------------------------------------------------------------------ camera
  /** analytic camera: world coords (x,y) at screen centre, scale s, rotation r (deg).
   *  Holds breathe (scale +rate/s, rotation drift); whips get directional blur, zooms get radial ghost copies. */
  DK.camera = (o = {}) => {
    const wrap = X.svg('g', { id: 'dkCamWrap' }, o.parent || X.root);
    const g = X.svg('g', { id: 'dkCam' }, wrap);
    const ghosts = [1, 2, 3].map(() => X.svg('use', { href: '#dkCam', opacity: 0, style: 'display:none' }, wrap));
    const mb = X.svg('filter', { id: 'dkMB', filterUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, X.defs);
    const mbg = X.svg('feGaussianBlur', { stdDeviation: '0 0' }, mb);
    const cam = { g, wrap, moves: [], shakes: [], rate: o.rate ?? 0.0075, rd: o.rd ?? 0.07, blurK: o.blurK ?? 0.14 };
    const init = { x: o.x ?? 0, y: o.y ?? 0, s: o.s ?? 1, r: o.r ?? 0 };
    cam.moves.push({ t0: -1, t1: -1, a: init, b: init, ease: (p) => p, kind: 'cut' });
    const lerp = (a, b, p) => ({ x: a.x + (b.x - a.x) * p, y: a.y + (b.y - a.y) * p, s: a.s * Math.pow(b.s / a.s, p), r: a.r + (b.r - a.r) * p });
    cam.stateAt = (t) => {
      let cur = init, endT = -1, k = 0, rate = cam.rate;
      for (const m of cam.moves) {
        if (t < m.t0) break;
        if (t < m.t1) return { ...lerp(m.a, m.b, m.ease((t - m.t0) / (m.t1 - m.t0))), moving: m };
        cur = m.b; endT = m.t1; k++; rate = m.rate ?? cam.rate;
      }
      const dt = Math.max(0, t - endT);
      return { x: cur.x, y: cur.y, s: cur.s * (1 + rate * dt), r: cur.r + cam.rd * dt * (k % 2 ? 1 : -1) };
    };
    const add = (t0, dur, to, ease, kind, extra = {}) => {
      const a = cam.stateAt(t0);
      const b = { x: to.x ?? a.x, y: to.y ?? a.y, s: to.s ?? a.s, r: to.r ?? a.r };
      cam.moves.push({ t0, t1: t0 + dur, a: { x: a.x, y: a.y, s: a.s, r: a.r }, b, ease: typeof ease === 'function' ? ease : gsap.parseEase(ease), kind, ...extra });
      return t0 + dur;
    };
    cam.cut = (t, to) => add(t, 0.0001, to, 'none', 'cut');
    cam.move = (t, dur, to, ease = 'power2.inOut', extra) => add(t, dur, to, ease, 'move', extra);
    /** whip pan: expo.inOut to an overshoot point (2.5 % of the move) + 4-frame settle; whoosh sfx */
    cam.whip = (t, to, o2 = {}) => {
      const a = cam.stateAt(t), dur = o2.dur ?? 0.37, ov = o2.overshoot ?? 0.03;
      const tx = to.x ?? a.x, ty = to.y ?? a.y;
      const over = { x: tx + (tx - a.x) * ov, y: ty + (ty - a.y) * ov, s: to.s ?? a.s, r: (to.r ?? a.r) + (o2.rotKick ?? 0) };
      add(t, dur, over, o2.ease || 'expo.inOut', 'whip');
      add(t + dur, 0.15, { x: tx, y: ty, s: to.s ?? a.s, r: to.r ?? a.r }, 'sine.out', 'settle');
      if (o2.sfx !== false) X.sfx(t + dur * 0.15, 'whoosh', { dur: dur + 0.1, gain: o2.gain ?? 0.5 });
      return t + dur + 0.15;
    };
    /** zoom punch toward world point (x,y) to scale s (expo.in = dive); 'zoom_in' sfx */
    cam.zoom = (t, to, o2 = {}) => {
      const end = add(t, o2.dur ?? 0.3, to, o2.ease || 'expo.in', 'zoom');
      if (o2.sfx !== false) X.sfx(t, o2.out ? 'zoom_out' : 'zoom_in', { dur: (o2.dur ?? 0.3) + 0.15, gain: 0.35 });
      return end;
    };
    cam.shake = (t, amp = 5) => cam.shakes.push({ t, amp });
    const jit = X.rand(77), J = Array.from({ length: 64 }, () => [jit() - 0.5, jit() - 0.5]);
    let blurOn = false, ghostOn = false;
    X.every((t) => {
      const st = cam.stateAt(t), pv = cam.stateAt(t - 1 / 30);
      let sx = 0, sy = 0;
      for (const sh of cam.shakes) { const d = t - sh.t; if (d >= 0 && d < 0.2) { const k = Math.floor(d * 30) % 64, a = sh.amp * (1 - d / 0.2); sx += J[k][0] * a * 2; sy += J[k][1] * a * 2; } }
      g.setAttribute('transform', `translate(${960 + sx},${540 + sy}) rotate(${st.r.toFixed(4)}) scale(${st.s.toFixed(5)}) translate(${(-st.x).toFixed(2)},${(-st.y).toFixed(2)})`);
      // screen-space velocity of the frame centre content
      const dxs = (pv.x - st.x) * st.s, dys = (pv.y - st.y) * st.s, zs = st.s / pv.s - 1;
      const bx = Math.min(70, Math.abs(dxs) * cam.blurK), by = Math.min(70, Math.abs(dys) * cam.blurK);
      if (bx > 0.6 || by > 0.6) { mbg.setAttribute('stdDeviation', `${bx.toFixed(1)} ${by.toFixed(1)}`); if (!blurOn) { wrap.setAttribute('filter', 'url(#dkMB)'); blurOn = true; } }
      else if (blurOn) { wrap.removeAttribute('filter'); blurOn = false; }
      const za = Math.abs(zs);
      if (za > 0.012) {
        ghosts.forEach((u, i) => {
          const k = 1 + Math.sign(zs) * Math.min(0.2, za * 1.6) * (i + 1);
          u.setAttribute('transform', `translate(960,540) scale(${k.toFixed(4)}) translate(-960,-540)`);
          u.setAttribute('opacity', (Math.min(1, za * 9) * [0.36, 0.24, 0.14][i]).toFixed(3)); u.style.display = '';
        });
        ghostOn = true;
      } else if (ghostOn) { ghosts.forEach((u) => { u.style.display = 'none'; u.setAttribute('opacity', 0); }); ghostOn = false; }
    });
    return cam;
  };

  // ------------------------------------------------------------------ halftone plates (code-drawn "archival" pictures)
  /** draw(ctx,w,h) paints a greyscale illustration; returns a halftone print (dots on paper) as a JPEG data URL */
  DK.halftone = (draw, w, h, o = {}) => {
    const cv = document.createElement('canvas'); cv.width = w; cv.height = h;
    const c = cv.getContext('2d'); c.fillStyle = '#fff'; c.fillRect(0, 0, w, h);
    draw(c, w, h, X.rand(o.seed ?? 5));
    const src = c.getImageData(0, 0, w, h).data;
    const out = document.createElement('canvas'); out.width = w; out.height = h;
    const q = out.getContext('2d');
    q.fillStyle = o.paper || '#ece5d4'; q.fillRect(0, 0, w, h);
    q.fillStyle = o.ink || '#1f1c18';
    const cell = o.cell ?? 7, ang = ((o.angle ?? 45) * Math.PI) / 180, ca = Math.cos(ang), sa = Math.sin(ang);
    const R = Math.hypot(w, h), con = o.contrast ?? 1.15;
    for (let v = -R; v < R; v += cell) for (let u = -R; u < R; u += cell) {
      const x = w / 2 + u * ca - v * sa, y = h / 2 + u * sa + v * ca;
      if (x < -cell || y < -cell || x > w + cell || y > h + cell) continue;
      const xi = Math.min(w - 1, Math.max(0, x | 0)), yi = Math.min(h - 1, Math.max(0, y | 0)), i = (yi * w + xi) * 4;
      let L = (src[i] * 0.3 + src[i + 1] * 0.59 + src[i + 2] * 0.11) / 255;
      L = Math.min(1, Math.max(0, (L - 0.5) * con + 0.5));
      const rr = cell * 0.5 * Math.sqrt(1 - L) * 1.32;
      if (rr > 0.35) { q.beginPath(); q.arc(x, y, rr, 0, 6.2832); q.fill(); }
    }
    // print wear: soft blotches
    const r = X.rand((o.seed ?? 5) + 9);
    for (let k = 0; k < 18; k++) { q.fillStyle = `rgba(236,229,212,${0.03 + r() * 0.06})`; q.beginPath(); q.ellipse(r() * w, r() * h, 6 + r() * 30, 2 + r() * 8, r() * 3, 0, 7); q.fill(); }
    return out.toDataURL('image/jpeg', 0.9);
  };
  /** torn-border photo plate: white torn border, image inset, shadow, optional tape */
  DK.plate = (parent, url, o) => {
    const { w, h } = o, b = o.border ?? 16;
    const g = DK.sheet(parent, { x: o.x, y: o.y, w, h, rot: o.rot, edge: 'torn', jag: o.jag ?? 10, seed: o.seed ?? 3, paper: 'card', ovl: o.ovl, big: o.big });
    const cid = uid('pc');
    const cp = X.svg('clipPath', { id: cid }, o.ovl ? DK.odefs : X.defs);
    X.svg('path', { d: X.torn(w - 2 * b, h - 2 * b, 5, (o.seed ?? 3) + 1, 11), transform: `translate(${b},${b})` }, cp);
    g.img = X.svg('image', { href: url, x: b, y: b, width: w - 2 * b, height: h - 2 * b, preserveAspectRatio: 'xMidYMid slice', 'clip-path': `url(#${cid})` }, g);
    if (o.tape !== false) { DK.tape(g, w * 0.18, 4, 110, -9); if (o.tape2) DK.tape(g, w * 0.84, h - 6, 100, 7); }
    return g;
  };

  // canvas silhouette painters for halftone plates (all take ctx + feet/base positions in px)
  const ill = (DK.ill = {});
  ill.sky = (c, w, h, top = '#f2f2f2', bot = '#bdbdbd', horizon = 0.7) => { const g = c.createLinearGradient(0, 0, 0, h * horizon); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, 0, w, h); };
  ill.ground = (c, w, h, y0, top = '#8a8a8a', bot = '#3c3c3c') => { const g = c.createLinearGradient(0, y0, 0, h); g.addColorStop(0, top); g.addColorStop(1, bot); c.fillStyle = g; c.fillRect(0, y0, w, h - y0); };
  ill.person = (c, x, y, hgt, o = {}) => {
    const s = hgt / 100; c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s); c.fillStyle = o.color || '#151515';
    c.beginPath(); c.moveTo(-10, 0); c.lineTo(-8, -44); c.lineTo(8, -44); c.lineTo(10, 0); c.lineTo(3, 0); c.lineTo(0, -30); c.lineTo(-3, 0); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(-16, -36); c.quadraticCurveTo(-18, -70, -12, -80); c.lineTo(12, -80); c.quadraticCurveTo(18, -70, 16, -36); c.closePath(); c.fill();
    if (o.arms === 'folded') { c.fillRect(-15, -66, 30, 9); }
    else if (o.arms === 'raised') { c.beginPath(); c.moveTo(10, -76); c.lineTo(22, -112); c.lineTo(27, -110); c.lineTo(16, -72); c.closePath(); c.fill(); }
    else { c.beginPath(); c.moveTo(-16, -76); c.lineTo(-20, -42); c.lineTo(-15, -42); c.lineTo(-11, -72); c.closePath(); c.fill(); c.beginPath(); c.moveTo(16, -76); c.lineTo(20, -42); c.lineTo(15, -42); c.lineTo(11, -72); c.closePath(); c.fill(); }
    c.beginPath(); c.arc(0, -88, 8.5, 0, 7); c.fill();
    if (o.cap) { c.beginPath(); c.ellipse(2, -95, 11, 4, 0, 0, 7); c.fill(); c.fillRect(-8, -101, 16, 7); }
    if (o.hat) { c.beginPath(); c.ellipse(0, -95, 14, 3.5, 0, 0, 7); c.fill(); c.fillRect(-8, -110, 16, 15); }
    if (o.scarf) { c.fillStyle = o.scarf; c.fillRect(-9, -82, 18, 5); }
    c.restore();
  };
  ill.soldier = (c, x, y, hgt, o = {}) => {
    ill.person(c, x, y, hgt, { ...o, arms: 'down' });
    const s = hgt / 100; c.save(); c.translate(x, y); c.scale(s * (o.flip ? -1 : 1), s); c.fillStyle = o.color || '#151515';
    c.beginPath(); c.ellipse(0, -93, 13, 9, 0, Math.PI, 0); c.fill(); c.fillRect(-15, -94, 30, 3); c.fillRect(-1.5, -104, 3, 6);
    c.save(); c.translate(14, -70); c.rotate(-0.32); c.fillRect(-2, -60, 4, 86); c.fillRect(-1, -78, 2, 20); c.restore();
    c.restore();
  };
  ill.factory = (c, x, y, w, h, o = {}) => {
    c.fillStyle = o.color || '#262626';
    const n = o.teeth ?? 5, tw = w / n;
    c.beginPath(); c.moveTo(x, y);
    for (let i = 0; i < n; i++) { c.lineTo(x + i * tw, y - h); c.lineTo(x + i * tw + tw * 0.82, y - h - tw * 0.38); c.lineTo(x + i * tw + tw * 0.82, y - h); }
    c.lineTo(x + w, y - h); c.lineTo(x + w, y); c.closePath(); c.fill();
    c.fillStyle = o.win || '#6e6e6e';
    for (let i = 0; i < n * 2; i++) for (let j = 0; j < 2; j++) c.fillRect(x + 14 + i * (w - 28) / (n * 2), y - h + 18 + j * h * 0.38, (w - 28) / (n * 2) - 10, h * 0.22);
    (o.chimneys || [0.2, 0.55, 0.8]).forEach((p, i) => { c.fillStyle = o.color || '#262626'; c.fillRect(x + w * p, y - h - (o.ch ?? 1.6) * h * (1 - i * 0.12), w * 0.04, (o.ch ?? 1.6) * h * (1 - i * 0.12)); });
  };
  ill.smoke = (c, x, y, r, o = {}) => {
    const rr = X.rand(o.seed ?? 3);
    for (let k = 0; k < (o.n ?? 7); k++) {
      const cx = x + k * r * 0.55 + (rr() - 0.5) * r * 0.3, cy = y - k * r * 0.35 + (rr() - 0.5) * r * 0.3, R = r * (0.6 + k * 0.12);
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, `rgba(90,90,90,${0.55 - k * 0.05})`); g.addColorStop(1, 'rgba(90,90,90,0)');
      c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill();
    }
  };
  ill.facade = (c, x, y, w, h, o = {}) => {
    const col = 6, cw = w / (col * 2 + 1);
    c.fillStyle = '#d8d8d8'; c.fillRect(x - 30, y - 20, w + 60, 20); c.fillStyle = '#bcbcbc'; c.fillRect(x - 15, y - 34, w + 30, 14);
    c.fillStyle = '#1c1c1c'; c.fillRect(x, y - h, w, h - 34);
    for (let i = 0; i < col; i++) {
      const cx = x + cw * (1 + i * 2), g = c.createLinearGradient(cx, 0, cx + cw, 0);
      g.addColorStop(0, '#9a9a9a'); g.addColorStop(0.35, '#efefef'); g.addColorStop(1, '#6a6a6a');
      c.fillStyle = g; c.fillRect(cx, y - h, cw, h - 34);
      c.fillStyle = '#cfcfcf'; c.fillRect(cx - 6, y - h - 10, cw + 12, 12);
    }
    c.fillStyle = '#c8c8c8'; c.fillRect(x - 20, y - h - 46, w + 40, 38);
    c.fillStyle = '#a5a5a5'; c.beginPath(); c.moveTo(x - 24, y - h - 46); c.lineTo(x + w / 2, y - h - 46 - h * 0.32); c.lineTo(x + w + 24, y - h - 46); c.closePath(); c.fill();
    c.fillStyle = '#e2e2e2'; c.beginPath(); c.moveTo(x + 10, y - h - 52); c.lineTo(x + w / 2, y - h - 46 - h * 0.27); c.lineTo(x + w - 10, y - h - 52); c.closePath(); c.fill();
  };
  ill.press = (c, x, y, s = 1) => {
    c.save(); c.translate(x, y); c.scale(s, s);
    const cyl = (cx, cy, r, light = '#e6e6e6') => { const g = c.createRadialGradient(cx - r * 0.4, cy - r * 0.45, r * 0.05, cx, cy, r); g.addColorStop(0, light); g.addColorStop(0.55, '#7a7a7a'); g.addColorStop(1, '#1a1a1a'); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, r, 0, 7); c.fill(); c.fillStyle = '#111'; c.beginPath(); c.arc(cx, cy, r * 0.16, 0, 7); c.fill(); };
    const gear = (cx, cy, r, n) => { c.fillStyle = '#262626'; c.beginPath(); for (let i = 0; i < n * 2; i++) { const a = (i / (n * 2)) * Math.PI * 2, rr = i % 2 ? r : r * 0.84; c.lineTo(cx + Math.cos(a) * rr, cy + Math.sin(a) * rr); } c.closePath(); c.fill(); c.fillStyle = '#9a9a9a'; c.beginPath(); c.arc(cx, cy, r * 0.5, 0, 7); c.fill(); c.fillStyle = '#262626'; for (let k = 0; k < 4; k++) { c.save(); c.translate(cx, cy); c.rotate((k * Math.PI) / 2 + 0.3); c.fillRect(-r * 0.07, 0, r * 0.14, r * 0.5); c.restore(); } };
    // frame: two side cheeks + base
    c.fillStyle = '#1e1e1e'; c.fillRect(-300, -24, 640, 24);
    c.beginPath(); c.moveTo(-230, -24); c.lineTo(-210, -330); c.lineTo(-120, -350); c.lineTo(-90, -24); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(150, -24); c.lineTo(170, -330); c.lineTo(250, -345); c.lineTo(280, -24); c.closePath(); c.fill();
    // paper roll at the left (end-on spiral)
    cyl(-380, -110, 95, '#f2f2f2'); c.strokeStyle = 'rgba(40,40,40,0.5)'; c.lineWidth = 2; for (let r = 20; r < 92; r += 9) { c.beginPath(); c.arc(-380, -110, r, 0, 7); c.stroke(); }
    // web of paper into the cylinders and out to the stack
    c.fillStyle = '#f4f4f4'; c.beginPath(); c.moveTo(-380, -205); c.lineTo(-40, -235); c.lineTo(40, -150); c.lineTo(330, -60); c.lineTo(330, -40); c.lineTo(40, -128); c.lineTo(-40, -212); c.lineTo(-380, -186); c.closePath(); c.fill();
    // impression cylinders + ink rollers
    cyl(-30, -270, 72); cyl(-10, -135, 78); cyl(110, -300, 40); cyl(130, -215, 36); cyl(-140, -300, 34);
    gear(230, -150, 70, 14); gear(-170, -170, 48, 11);
    // delivered sheets stack
    for (let k = 0; k < 12; k++) { c.fillStyle = k % 2 ? '#f6f6f6' : '#d6d6d6'; c.fillRect(320 + (k % 3) * 2, -30 - k * 8, 230, 8); }
    c.restore();
  };
  ill.notes = (c, x, y, s = 1, rr = X.rand(9)) => {
    for (let k = 0; k < 14; k++) {
      const bx = x + (rr() - 0.5) * 420 * s, by = y + (rr() - 0.5) * 200 * s - k * 6, w = 220 * s, h = 110 * s;
      c.save(); c.translate(bx, by); c.rotate((rr() - 0.5) * 0.5);
      for (let j = 0; j < 6; j++) { c.fillStyle = j % 2 ? '#dedede' : '#bdbdbd'; c.fillRect(-w / 2, -h / 2 - j * 5, w, h); }
      c.fillStyle = '#4a4a4a'; c.fillRect(-w / 2, -h / 2 - 25, w, h * 0.12);
      c.strokeStyle = '#7a7a7a'; c.lineWidth = 3; c.strokeRect(-w / 2 + 8, -h / 2 - 22, w - 16, h - 16);
      c.fillStyle = '#2a2a2a'; c.fillRect(-w * 0.08, -h / 2 - 28, w * 0.16, h + 6);
      c.restore();
    }
  };

  // ------------------------------------------------------------------ overlays: vignette / iris, flash
  /** vignette track: keyframes of {r (px radius of the lit pool), dark (rim opacity), cx, cy} with eases */
  DK.vignette = (o = {}) => {
    const gid = uid('vg');
    const gr = X.svg('radialGradient', { id: gid, gradientUnits: 'userSpaceOnUse', cx: 960, cy: 540, r: 2000 }, DK.odefs);
    const s0 = X.svg('stop', { offset: 0, 'stop-color': '#0b0a09', 'stop-opacity': 0 }, gr);
    const s1 = X.svg('stop', { offset: 0.5, 'stop-color': '#0b0a09', 'stop-opacity': 0 }, gr);
    const s2 = X.svg('stop', { offset: 1, 'stop-color': '#0b0a09', 'stop-opacity': 0 }, gr);
    const rect = X.svg('rect', { width: 1920, height: 1080, fill: `url(#${gid})` }, o.parent || DK.ovl);
    const st0 = { r: o.r ?? 2400, dark: o.dark ?? 0, cx: 960, cy: 540, soft: o.soft ?? 0.45 };
    const keys = [];
    const v = {
      rect,
      stateAt(t) {
        let cur = st0;
        for (const k of keys) {
          if (t < k.t0) break;
          if (t < k.t1) { const p = k.ease((t - k.t0) / (k.t1 - k.t0)); const o2 = {}; for (const q of Object.keys(k.b)) o2[q] = k.a[q] + (k.b[q] - k.a[q]) * p; return o2; }
          cur = k.b;
        }
        return cur;
      },
      to(t, dur, vals, ease = 'power2.out') { const a = { ...v.stateAt(t) }; keys.push({ t0: t, t1: t + Math.max(dur, 1e-4), a, b: { ...a, ...vals }, ease: gsap.parseEase(ease) }); return v; },
    };
    X.every((t) => {
      const s = v.stateAt(t);
      gr.setAttribute('r', Math.max(1, s.r).toFixed(1)); gr.setAttribute('cx', s.cx); gr.setAttribute('cy', s.cy);
      s1.setAttribute('offset', (1 - s.soft).toFixed(3));
      s2.setAttribute('stop-opacity', s.dark.toFixed(3));
      rect.style.display = s.dark < 0.005 ? 'none' : '';
    });
    return v;
  };
  DK.flash = (t, o = {}) => {
    const r = X.svg('rect', { width: 1920, height: 1080, fill: o.color || '#fffaf0', opacity: 0 }, o.parent || DK.ovl);
    X.tl.fromTo(r, { opacity: o.peak ?? 0.7 }, { opacity: 0, duration: o.dur ?? 0.12, ease: 'power2.in', immediateRender: false }, t);
    return r;
  };

  // ------------------------------------------------------------------ HUD (programme · chapter · date slug · source line)
  DK.hud = (prog, chapter, o = {}) => {
    const box = DK.hudDiv;
    const base = { position: 'absolute', whiteSpace: 'nowrap', pointerEvents: 'none' };
    const left = X.html('div', { html: `<b style="color:${C.ink2};font-weight:700;letter-spacing:3px">${prog}</b><span style="color:#9a948a;margin:0 12px">/</span><span class="dkChap">${chapter}</span>`,
      style: { ...base, left: '120px', top: '52px', font: `500 20px ${F.rmono}`, color: C.hud, letterSpacing: '1.5px' } }, box);
    const chapEl = left.querySelector('.dkChap'), chaps = [];
    const hide = [];
    const slugs = [], srcs = [];
    const api = {
      left,
      slug(t, text) { const d = X.html('div', { text, style: { ...base, right: '120px', top: '54px', font: `500 20px ${F.rmono}`, color: C.ink2, letterSpacing: '1px', opacity: 0 } }, box); slugs.push({ t, d }); return api; },
      source(t, text) { const d = X.html('div', { text, style: { ...base, left: '120px', top: '992px', font: `500 16px ${F.sans}`, color: '#7a746a', letterSpacing: '0.3px', opacity: 0 } }, box); srcs.push({ t, d }); return api; },
      chapter(t, text) { chaps.push({ t, text }); return api; },
      hide(t0, t1) { hide.push([t0, t1]); return api; },
      colorAt: [], // [[t0,t1,'#fff']] for dark grounds
    };
    X.every((t) => {
      const hid = hide.some(([a, b]) => t >= a && t < b);
      if (chaps.length) { let c = null; for (const k of chaps) if (t >= k.t) c = k; const txt = c ? c.text : chapter; if (chapEl.textContent !== txt) chapEl.textContent = txt; }
      const dark = api.colorAt.find(([a, b]) => t >= a && t < b);
      left.style.opacity = hid ? 0 : 1;
      left.style.color = dark ? 'rgba(240,232,220,0.7)' : C.hud;
      const pick = (list) => { let cur = null; for (const s of list) if (t >= s.t) cur = s; return cur; };
      const cs = pick(slugs), cr = pick(srcs);
      slugs.forEach((s) => (s.d.style.opacity = s === cs && !hid ? 1 : 0));
      srcs.forEach((s) => { s.d.style.opacity = s === cr ? 1 : 0; s.d.style.color = dark ? 'rgba(240,232,220,0.6)' : '#7a746a'; });
    });
    return api;
  };

  // ------------------------------------------------------------------ hard-cut word card (overlay)
  /** full-frame card visible in [t0,t1): ground verm|black|paper, a huge display word (auto-fit to o.maxW; o.word may be
   *  an array of lines) + typed gloss, a halftone plate, an optional brush underline / paper strip and a gag(g,t0,t1) */
  DK.card = (t0, t1, o) => {
    const g = X.scene(uid('card'), t0, t1, null, DK.ovl);
    const ground = o.ground || 'verm';
    X.svg('rect', { width: 1920, height: 1080, fill: ground === 'paper' ? DK.pat('cream', true) : ground === 'black' ? DK.pat('black', true) : DK.pat('verm', true) }, g);
    const wordCol = o.wordColor || (ground === 'verm' ? '#f4ead8' : ground === 'black' ? C.red : C.ink);
    const plateG = X.svg('g', {}, g);
    if (o.plate) {
      const pw = o.pw ?? 980, ph = o.ph ?? 680;
      const p = DK.plate(plateG, o.plate, { x: o.px ?? 1320, y: o.py ?? 520, w: pw, h: ph, rot: o.prot ?? 1.5, seed: o.seed ?? 4, ovl: true, tape: false, border: 14 });
      X.tl.fromTo(plateG, { scale: 1.0, svgOrigin: `${o.px ?? 1320} ${o.py ?? 520}` }, { scale: 1.035, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
      g.plate = p;
    }
    const ls = o.ls ?? 2, wx = o.wx ?? 130, wy = o.wy ?? 600, maxW = o.maxW ?? 1000;
    let wsize = o.size ?? 230;
    const lines = Array.isArray(o.word) ? o.word : [o.word];
    const widest = Math.max(...lines.map((l) => DK.measure(l, wsize, F.zh, 900, ls)));
    if (widest > maxW) wsize = Math.floor(wsize * maxW / widest);
    const lh = wsize * 0.92, top = wy - (lines.length - 1) * lh;
    if (o.strip) { // word sits on a paper label strip
      const tw = Math.max(...lines.map((l) => DK.measure(l, wsize, F.zh, 900, ls)));
      X.svg('path', { d: X.torn(tw + 120, wsize * 1.2 + (lines.length - 1) * lh, 4, 9, 11), transform: `translate(${wx - 50},${top - wsize * 0.98})`, fill: DK.pat('card', true), filter: 'url(#dkShO)' }, g);
    }
    lines.forEach((l, i) => DK.text(g, wx, top + i * lh, l, { size: wsize, fill: wordCol, ls }));
    const gy = wy + (o.glossDY ?? 86);
    const gl = DK.type(g, wx + 8, gy, o.gloss, t0 + 0.08, { size: o.glossSize ?? 38, ls: 7, fill: ground === 'verm' ? '#f0e2cc' : ground === 'black' ? '#d9d0c2' : C.ink2, cps: o.cps ?? 28, cursor: true, sfx: false });
    if (o.brush) {
      const bw = Math.min(980, DK.measure(o.gloss, o.glossSize ?? 38, F.mono, 600, 7) + 160);
      const b = X.svg('path', { d: `M${wx - 20},${gy + 34} q${bw * 0.3},-14 ${bw},-4 l-6,16 q-${bw * 0.6},-6 -${bw},6 z`, fill: o.brushColor || C.orange }, g);
      gsap.set(b, { scale: 0, transformOrigin: '0% 50%' });
      X.tl.fromTo(b, { scaleX: 0 }, { scaleX: 1, scale: 1, duration: 0.3, ease: 'power3.out', immediateRender: false }, t0 + 0.12);
    }
    if (o.gag) o.gag(g, t0, t1);
    X.sfx(t0, o.sfx || 'thud', { gain: 0.5 });
    g.gloss = gl;
    return g;
  };

  // ------------------------------------------------------------------ title card (theme WORD on a certificate)
  /** English edition: one heavy word (o.word, e.g. 'TOLL') with guilloche lines inside, left; a right-hand column with
   *  o.title (programme), o.sub / o.sub2 (italic definition lines), o.promise (typed date line). Lands small, settles. */
  DK.titleCard = (t0, o) => {
    const g = X.scene(uid('title'), t0, null, null, DK.ovl);
    X.svg('rect', { width: 1920, height: 1080, fill: o.ground || '#cdd2c5' }, g);
    const inner = X.svg('g', {}, g);
    const doc = X.svg('g', { transform: 'translate(960,540) rotate(-2.2) translate(-930,-520)' }, inner);
    X.svg('rect', { width: 1860, height: 1040, fill: DK.pat('cert', true), filter: 'url(#dkShO)' }, doc);
    DK.guilloche(doc, 0, 0, 1860, 1040, { color: C.guil, op: 0.55, band: 26 });
    const micro = o.micro || 'THE STRAIT FILE · ';
    for (let k = 0; k < 2; k++) DK.text(doc, 90, [250, 965][k], micro.repeat(16), { f: 'mono', size: 11, weight: 500, fill: C.guil, op: 0.5 });
    DK.text(doc, 90, 120, o.kicker || 'CERTIFICATE OF PASSAGE', { f: 'lat', size: 24, style: 'italic', weight: 400, fill: C.ink2, ls: 3 });
    DK.text(doc, 1770, 120, o.serial || 'No. 000001 · SERIES A', { f: 'mono', size: 22, fill: C.ink2, anchor: 'end', ls: 2 });
    DK.rosette(doc, 1640, 860, 112, { color: C.guil, op: 0.8 });
    const word = o.word || o.char || 'WORD', gx = o.gx ?? 120, gy = o.gy ?? 760, ls = o.ls ?? 4;
    let size = o.size ?? 400;
    const tw = DK.measure(word, size, F.zh, 900, ls), maxW = o.maxW ?? 1060;
    if (tw > maxW) size = Math.floor(size * maxW / tw);
    const ww = DK.measure(word, size, F.zh, 900, ls);
    const cid = uid('tc');
    const cp = X.svg('clipPath', { id: cid }, DK.odefs);
    DK.text(cp, gx, gy, word, { size, weight: 900, ls });
    const glyph = X.svg('g', {}, doc);
    DK.text(glyph, gx, gy, word, { size, weight: 900, fill: '#181817', ls });
    const lines = X.svg('g', { 'clip-path': `url(#${cid})`, fill: 'none', stroke: '#e9ece2', 'stroke-width': 1.1, opacity: 0.32 }, glyph);
    for (let k = 0; k < 26; k++) { let d = ''; for (let i = 0; i <= 90; i++) { const x = gx - 40 + i * (ww + 80) / 90; d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + (gy - size * 0.8 + k * size * 0.034 + Math.sin(i * 0.33 + k * 0.7) * 20).toFixed(1); } X.svg('path', { d }, lines); }
    gsap.set(glyph, { opacity: 0, transformOrigin: '50% 50%' });
    const tg = o.tGlyph ?? t0 + 0.9;
    X.tl.fromTo(glyph, { opacity: 0.75, scale: 1.05 }, { opacity: 1, scale: 1, duration: 5 / 30, ease: 'power3.out', immediateRender: false }, tg);
    X.sfx(tg, 'stamp', { gain: 0.7, pitch: 0.7 }); X.sfx(tg, 'impact', { gain: 0.35, dur: 1.2 });
    const cx = o.cx ?? Math.max(gx + ww + 70, 1240), ty = o.ty ?? gy - size * 0.52;
    DK.type(doc, cx, ty, o.title || '', { f: 'lat', size: o.titleSize ?? 40, weight: 700, ls: 6, cps: 18, cursor: false, sfx: true, gain: 0.22 }, tg + 0.45);
    const sub = DK.type(doc, cx + 2, ty + 56, o.sub || '', { f: 'lat', size: 26, style: 'italic', weight: 400, ls: 1, cps: 30, cursor: false, sfx: false }, tg + 1.0);
    if (o.sub2) DK.type(doc, cx + 2, ty + 92, o.sub2, { f: 'lat', size: 26, style: 'italic', weight: 400, ls: 1, cps: 30, cursor: false, sfx: false }, tg + 1.5);
    X.svg('line', { x1: cx, y1: ty + 128, x2: cx + 470, y2: ty + 128, stroke: C.ink2, 'stroke-width': 1.5 }, doc);
    DK.type(doc, cx, ty + 172, o.promise || '', { f: 'mono', size: 22, ls: 2, cps: 32, cursor: false, sfx: false, fill: C.ink2 }, tg + 1.5);
    X.tl.fromTo(inner, { scale: 0.62, svgOrigin: '960 540' }, { scale: 1, duration: 0.62, ease: 'power3.out', immediateRender: false }, t0);
    X.tl.fromTo(inner, { scale: 1 }, { scale: 1.035, duration: 6, ease: 'none', immediateRender: false }, t0 + 0.62);
    g.doc = doc; g.sub = sub;
    return g;
  };
  // DK.type signature helper: allow (parent,x,y,text,opts,t) ordering used above
  const typeRaw = DK.type;
  DK.type = (parent, x, y, text, a, b) => (typeof a === 'number' ? typeRaw(parent, x, y, text, a, b || {}) : typeRaw(parent, x, y, text, b, a || {}));

  // ------------------------------------------------------------------ torn-hole iris (overlay cover with a growing jagged hole)
  /** a full-frame cover (an <image> of what is currently on screen, e.g. the desk) masked by a jagged hole that bursts open */
  DK.hole = (t, o) => {
    const g = X.scene(uid('hole'), o.t0 ?? t, (o.t0 ?? t) + (o.dur ?? 1.1) + 0.05, null, DK.ovl);
    const mid = uid('hm');
    const mask = X.svg('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: 1920, height: 1080 }, DK.odefs);
    X.svg('rect', { width: 1920, height: 1080, fill: '#fff' }, mask);
    const r = X.rand(o.seed ?? 8), N = 34, pts = [];
    for (let i = 0; i < N; i++) { const a = (i / N) * Math.PI * 2, rr = 100 * (1 + (r() - 0.5) * 0.28) * (i % 2 ? 0.94 : 1.04); pts.push([Math.cos(a) * rr * 1.45, Math.sin(a) * rr]); }
    const d = 'M' + pts.map((p) => p.map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
    const holeM = X.svg('path', { d, fill: '#000' }, mask);
    const cover = X.svg('g', { mask: `url(#${mid})` }, g);
    if (o.paint) o.paint(cover);
    const rim = X.svg('path', { d, fill: 'none', stroke: '#f6f1e6', 'stroke-width': 4, filter: 'url(#dkShO)' }, g);
    const cx = o.cx ?? 960, cy = o.cy ?? 540, t0 = o.t0 ?? t;
    const set = (el) => gsap.set(el, { attr: { transform: `translate(${cx},${cy}) scale(0.001)` } });
    [holeM, rim].forEach(set);
    const step = (el, from, to, dur, ease, at) => X.tl.fromTo(el, { attr: { transform: `translate(${cx},${cy}) scale(${from})` } }, { attr: { transform: `translate(${cx},${cy}) scale(${to})` }, duration: dur, ease, immediateRender: false }, at);
    for (const el of [holeM, rim]) {
      step(el, 0.001, 5.2, 4 / 30, 'power4.out', t0);
      step(el, 5.2, 6.3, 0.62, 'none', t0 + 4 / 30);
      step(el, 6.3, 16, 0.2, 'expo.in', t0 + 4 / 30 + 0.62);
    }
    X.tl.fromTo(rim, { attr: { 'stroke-width': 4 } }, { attr: { 'stroke-width': 0.6 }, duration: 0.2, immediateRender: false }, t0 + 4 / 30 + 0.62);
    X.sfx(t0, 'paper', { dur: 0.45, gain: 0.55 }); X.sfx(t0 + 0.76, 'swoosh', { dur: 0.3, gain: 0.35 });
    return g;
  };

  // ------------------------------------------------------------------ CSS-3D isotype plane
  /** builds a tilted desk plane (HTML/CSS 3D) with a cols×rows grid of stand-up pictograms casting shadows.
   *  returns {root, plane, figs:[{el, sh, col, row}], title, big, show(t0,t1), cam(t,{x,y,tilt,roll,z},dur,ease)} */
  DK.iso = (o = {}) => {
    const root = DK.isoDiv;
    Object.assign(root.style, { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', overflow: 'hidden', perspective: `${o.persp ?? 1500}px`, perspectiveOrigin: '50% 35%', visibility: 'hidden' });
    const roll = X.html('div', { style: { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', transformStyle: 'preserve-3d', transformOrigin: '960px 540px' } }, root);
    const PW = DK.deskW || 5200, PH = DK.deskH || 3200;
    const plane = X.html('div', { style: { position: 'absolute', left: `${960 - PW / 2}px`, top: `${540 - PH / 2}px`, width: `${PW}px`, height: `${PH}px`, transformStyle: 'preserve-3d', transformOrigin: '50% 50%',
      backgroundImage: `url(${DK.deskURL})`, backgroundSize: '100% 100%' } }, roll);
    const cols = o.cols ?? 10, rows = o.rows ?? 10, gap = o.gap ?? 104, rgap = o.rowGap ?? gap * 0.9, fh = o.fh ?? 118;
    const ox = PW / 2 + (o.gx ?? 0) - ((cols - 1) * gap) / 2, oy = PH / 2 + (o.gy ?? 0) - ((rows - 1) * rgap) / 2;
    const tilt = o.tilt ?? 50;
    const figSVG = (fill) => `<svg viewBox="0 0 60 118" width="${fh * 0.51}" height="${fh}" style="display:block;overflow:visible"><g fill="${fill}"><circle cx="30" cy="13" r="12"/><path d="M14 30 Q30 24 46 30 L58 52 L52 56 L44 44 L44 70 L41 116 L33 116 L30 82 L27 116 L19 116 L16 70 L16 44 L8 56 L2 52 Z"/></g></svg>`;
    const figs = [];
    for (let j = 0; j < rows; j++) for (let i = 0; i < cols; i++) {
      const x = ox + i * gap + (j % 2) * gap * 0.3, y = oy + j * rgap;
      const sh = X.html('div', { html: figSVG('#2a2016'), style: { position: 'absolute', left: `${x - fh * 0.255}px`, top: `${y - fh}px`, transformOrigin: '50% 100%', transform: 'skewX(-28deg) scaleY(0.85)', opacity: 0.26, filter: 'blur(3px)' } }, plane);
      const el = X.html('div', { html: figSVG(o.fill || '#f3eee3'), style: { position: 'absolute', left: `${x - fh * 0.255}px`, top: `${y - fh}px`, transformOrigin: '50% 100%', transform: `rotateX(${-tilt}deg)`, filter: 'drop-shadow(0 2px 1px rgba(0,0,0,0.25))' } }, plane);
      figs.push({ el, sh, col: i, row: j, path: el.querySelector('g') });
    }
    // standing title (Chinese + gloss) at the front-left
    const title = X.html('div', { html: o.titleHTML || '', style: { position: 'absolute', left: `${ox - 60 + (o.titleDX ?? 0)}px`, top: `${oy - 300 + (o.titleDY ?? 0)}px`, transformOrigin: '0% 100%', transform: `rotateX(${-tilt}deg)`, whiteSpace: 'nowrap' } }, plane);
    const big = X.html('div', { html: o.bigHTML || '', style: { position: 'absolute', left: `${ox + (cols - 1) * gap - 330 + (o.bigDX ?? 0)}px`, top: `${oy - 330 + (o.bigDY ?? 0)}px`, transformOrigin: '0% 100%', transform: `rotateX(${-tilt}deg)`, whiteSpace: 'nowrap' } }, plane);
    // camera keyframes on the plane: {x, y (plane offset), z (translateZ), tilt (rotateX), roll (deg)}
    const st0 = { x: 0, y: 0, z: 0, tilt, roll: o.roll ?? -7, blur: 0 };
    const keys = [];
    const stateAt = (t) => { let cur = st0; for (const k of keys) { if (t < k.t0) break; if (t < k.t1) { const p = k.ease((t - k.t0) / (k.t1 - k.t0)); const r = {}; for (const q in k.b) r[q] = k.a[q] + (k.b[q] - k.a[q]) * p; return r; } cur = k.b; } return cur; };
    const api = {
      root, plane, figs, title, big, tilt, stateAt,
      cam(t, vals, dur = 0.5, ease = 'power2.inOut') { const a = { ...stateAt(t) }; keys.push({ t0: t, t1: t + Math.max(1e-4, dur), a, b: { ...a, ...vals }, ease: gsap.parseEase(ease) }); return api; },
      show(t0, t1) { X.tl.set(root, { visibility: 'visible' }, t0); if (t1 != null) X.tl.set(root, { visibility: 'hidden' }, t1); return api; },
    };
    // per-figure timing (set by the scene): inT pop-in, redT flip to red, fallT fall flat, outT scatter away
    figs.forEach((f) => { f.inT = -1; f.redT = 1e9; f.fallT = 1e9; f.outT = 1e9; f._k = ''; });
    const red = o.red || C.red, cream = o.fill || '#f3eee3';
    const eIn = gsap.parseEase('back.out(2)'), eFall = gsap.parseEase('power2.in'), eOut = gsap.parseEase('power2.in');
    const clamp = (v) => Math.min(1, Math.max(0, v));
    api.titleIn = -1; api.bigIn = -1; api.labelsOut = 1e9;
    X.every((t) => {
      if (t < api.t0 || t >= api.t1) return;
      const s = stateAt(t);
      plane.style.transform = `translate3d(${s.x}px,${s.y}px,${s.z}px) rotateX(${s.tilt}deg)`;
      roll.style.transform = `rotate(${s.roll}deg)`;
      root.style.filter = s.blur > 0.3 ? `blur(${s.blur.toFixed(1)}px)` : 'none';
      const up = -s.tilt;   // stand-up figures counter-rotate so they stay upright to the camera
      for (const f of figs) {
        const pin = clamp((t - f.inT) / 0.22), pf = eFall(clamp((t - f.fallT) / 0.32)), po = eOut(clamp((t - f.outT) / 0.3));
        const sc = eIn(pin) * (1 - po);
        const ang = up * (1 - pf);
        const k = `${sc.toFixed(3)}|${ang.toFixed(2)}|${t >= f.redT ? 1 : 0}|${po.toFixed(2)}`;
        if (k === f._k) continue;
        f._k = k;
        f.el.style.transform = `translateY(${(-po * 160).toFixed(1)}px) rotateX(${ang}deg) scale(${sc})`;
        f.el.style.opacity = sc <= 0.001 ? 0 : (1 - 0.72 * pf).toFixed(3);
        f.sh.style.opacity = (0.26 * sc * (1 - pf)).toFixed(3);
        f.path.setAttribute('fill', t >= f.redT ? red : cream);
      }
      const ti = clamp((t - api.titleIn) / 0.3) * (1 - clamp((t - api.labelsOut) / 0.25));
      title.style.transform = `rotateX(${up}deg)`; title.style.opacity = ti;
      const bi = clamp((t - api.bigIn) / 0.25) * (1 - clamp((t - api.labelsOut) / 0.25));
      big.style.transform = `rotateX(${up}deg)`; big.style.opacity = bi;
    });
    api.t0 = 0; api.t1 = 1e9;
    const show0 = api.show;
    api.show = (t0, t1) => { api.t0 = t0; api.t1 = t1 ?? 1e9; return show0(t0, t1); };
    return api;
  };

  // ------------------------------------------------------------------ English edition additions
  // canvas painters for code-drawn halftone plates (sea, ships, trucks, pumps, freight) — greyscale, gradients
  ill.sea = (c, w, h, hz = 0.55, o = {}) => {
    const g = c.createLinearGradient(0, 0, 0, h * hz); g.addColorStop(0, o.top || '#e8e8e8'); g.addColorStop(1, o.sky || '#b4b4b4'); c.fillStyle = g; c.fillRect(0, 0, w, h * hz);
    const s = c.createLinearGradient(0, h * hz, 0, h); s.addColorStop(0, o.sea1 || '#8c8c8c'); s.addColorStop(1, o.sea2 || '#2e2e2e'); c.fillStyle = s; c.fillRect(0, h * hz, w, h);
    const r = X.rand(o.seed ?? 4);
    for (let k = 0; k < 70; k++) { const y = h * hz + Math.pow(r(), 1.6) * h * (1 - hz), ww = 20 + r() * 120 * (y / h); c.fillStyle = `rgba(230,230,230,${0.12 + r() * 0.2})`; c.fillRect(r() * w, y, ww, 1 + (y / h) * 3); }
  };
  ill.tanker = (c, x, y, len, o = {}) => {   // x = stern, y = waterline
    const s = len / 100, f = o.flip ? -1 : 1; c.save(); c.translate(x, y); c.scale(s * f, s); c.fillStyle = o.color || '#1b1b1b';
    c.beginPath(); c.moveTo(0, -9); c.lineTo(92, -9); c.lineTo(100, -12); c.lineTo(96, 0); c.lineTo(3, 0); c.closePath(); c.fill();   // hull
    c.fillStyle = o.deck || '#3a3a3a'; c.fillRect(4, -11, 86, 2);
    c.fillStyle = o.color || '#1b1b1b'; c.fillRect(4, -22, 13, 11); c.fillRect(6, -27, 9, 5); c.fillRect(13, -33, 2, 8);  // aft house + funnel
    c.fillStyle = '#9a9a9a'; for (let i = 0; i < 4; i++) c.fillRect(5 + i * 3.2, -19, 2, 2);
    c.strokeStyle = o.color || '#1b1b1b'; c.lineWidth = 0.8; for (let i = 0; i < 7; i++) { c.beginPath(); c.moveTo(22 + i * 10, -11); c.lineTo(22 + i * 10, -14); c.stroke(); }
    c.beginPath(); c.moveTo(20, -13); c.lineTo(88, -13); c.stroke(); c.fillRect(86, -19, 1.4, 8);
    c.restore();
  };
  ill.warship = (c, x, y, len, o = {}) => {
    const s = len / 100, f = o.flip ? -1 : 1; c.save(); c.translate(x, y); c.scale(s * f, s); c.fillStyle = o.color || '#262626';
    c.beginPath(); c.moveTo(0, -6); c.lineTo(84, -6); c.lineTo(100, -10); c.lineTo(93, 0); c.lineTo(4, 0); c.closePath(); c.fill();
    c.beginPath(); c.moveTo(30, -6); c.lineTo(33, -16); c.lineTo(58, -16); c.lineTo(62, -6); c.closePath(); c.fill();
    c.fillRect(40, -24, 12, 8); c.beginPath(); c.moveTo(41, -24); c.lineTo(46, -40); c.lineTo(51, -24); c.closePath(); c.fill(); c.fillRect(43.5, -44, 5, 3); c.fillRect(20, -11, 8, 5); c.fillRect(70, -9, 6, 3); c.fillRect(74, -9.6, 9, 1);
    c.restore();
  };
  ill.skyline = (c, w, y, o = {}) => {
    const r = X.rand(o.seed ?? 6); c.fillStyle = o.color || '#202020';
    let x = 0; while (x < w) { const bw = 20 + r() * 70, bh = (o.h ?? 60) * (0.3 + r()); c.fillRect(x, y - bh, bw, bh); if (r() < 0.25) { c.beginPath(); c.arc(x + bw / 2, y - bh, bw * 0.35, Math.PI, 0); c.fill(); } x += bw + r() * 12; }
    for (let k = 0; k < (o.cranes ?? 2); k++) { const cx = w * (0.15 + r() * 0.7), ch = (o.h ?? 60) * 2.2; c.fillRect(cx, y - ch, 6, ch); c.fillRect(cx - 50, y - ch, 120, 5); c.fillRect(cx + 60, y - ch, 3, 30); }
    for (let k = 0; k < (o.tanks ?? 4); k++) { const tx = w * r(), tr = 18 + r() * 16; c.fillRect(tx - tr, y - tr * 1.1, tr * 2, tr * 1.1); c.beginPath(); c.ellipse(tx, y - tr * 1.1, tr, tr * 0.3, 0, 0, 7); c.fill(); }
  };
  ill.smokeColumn = (c, x, y, h, o = {}) => {
    const r = X.rand(o.seed ?? 8);
    for (let k = 0; k < 26; k++) { const p = k / 26, cx = x + Math.sin(p * 3 + r()) * h * 0.06 + p * h * (o.lean ?? 0.25), cy = y - p * h, R = h * (0.07 + p * 0.22) * (0.8 + r() * 0.4);
      const g = c.createRadialGradient(cx, cy, 0, cx, cy, R); g.addColorStop(0, `rgba(${o.shade ?? 40},${o.shade ?? 40},${o.shade ?? 40},${0.55 - p * 0.25})`); g.addColorStop(1, 'rgba(60,60,60,0)'); c.fillStyle = g; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.fill(); }
    if (o.glow !== false) { const g = c.createRadialGradient(x, y, 0, x, y, h * 0.25); g.addColorStop(0, 'rgba(255,255,255,0.95)'); g.addColorStop(1, 'rgba(255,255,255,0)'); c.fillStyle = g; c.beginPath(); c.arc(x, y, h * 0.25, 0, 7); c.fill(); }
  };
  ill.truck = (c, x, y, len, o = {}) => {   // x = rear of trailer, y = road line, len = total length (faces right)
    const s = len / 100; c.save(); c.translate(x, y); c.scale(s, s); c.fillStyle = o.color || '#1d1d1d';
    const tg = c.createLinearGradient(0, -34, 0, -8); tg.addColorStop(0, o.box1 || '#8e8e8e'); tg.addColorStop(1, o.box2 || '#4a4a4a');
    c.fillStyle = tg; c.fillRect(0, -34, 72, 26); c.fillStyle = '#b4b4b4'; for (let i = 1; i < 9; i++) c.fillRect(i * 8, -33, 0.5, 24);
    c.fillStyle = o.color || '#1d1d1d'; c.fillRect(0, -8, 72, 2.4); c.fillRect(72, -10, 6, 3);
    c.beginPath(); c.moveTo(77, -6); c.lineTo(77, -27); c.lineTo(88, -27); c.lineTo(95, -17); c.lineTo(99, -15); c.lineTo(99, -6); c.closePath(); c.fill();  // cab
    c.fillStyle = '#bdbdbd'; c.beginPath(); c.moveTo(87, -25); c.lineTo(93, -17.5); c.lineTo(87, -17.5); c.closePath(); c.fill();
    c.fillStyle = o.color || '#1d1d1d'; c.fillRect(79.5, -36, 1.8, 10);
    [8, 15, 60, 67, 85, 94].forEach((wx) => { c.fillStyle = '#111'; c.beginPath(); c.arc(wx, -3, 3.6, 0, 7); c.fill(); c.fillStyle = '#9a9a9a'; c.beginPath(); c.arc(wx, -3, 1.4, 0, 7); c.fill(); });
    c.restore();
  };
  ill.pump = (c, x, y, s = 1, o = {}) => {  // fuel dispenser, x = centre, y = ground
    c.save(); c.translate(x, y); c.scale(s, s);
    const g = c.createLinearGradient(-60, 0, 60, 0); g.addColorStop(0, '#5c5c5c'); g.addColorStop(0.4, '#d8d8d8'); g.addColorStop(1, '#4a4a4a');
    c.fillStyle = g; c.fillRect(-60, -300, 120, 300); c.fillStyle = '#1a1a1a'; c.fillRect(-66, -312, 132, 18); c.fillRect(-70, -6, 140, 6);
    c.fillStyle = '#efefef'; c.fillRect(-44, -270, 88, 62); c.fillStyle = '#2a2a2a'; for (let i = 0; i < 3; i++) c.fillRect(-36, -260 + i * 18, 72, 10);
    c.fillStyle = '#2a2a2a'; c.fillRect(-44, -190, 88, 40); c.fillStyle = '#9a9a9a'; for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) c.fillRect(-38 + j * 20, -186 + i * 12, 14, 8);
    c.fillStyle = '#1c1c1c'; c.fillRect(60, -210, 26, 70); c.beginPath(); c.moveTo(70, -140); c.quadraticCurveTo(120, -40, 40, -20); c.lineTo(36, -28); c.quadraticCurveTo(108, -46, 64, -140); c.closePath(); c.fill();
    c.fillRect(62, -232, 22, 24); c.fillRect(80, -228, 26, 6);
    c.restore();
  };
  ill.nozzle = (c, x, y, s = 1) => {
    c.save(); c.translate(x, y); c.scale(s, s);
    const g = c.createLinearGradient(0, -80, 0, 80); g.addColorStop(0, '#e2e2e2'); g.addColorStop(0.5, '#7a7a7a'); g.addColorStop(1, '#202020');
    c.fillStyle = g; c.beginPath(); c.moveTo(-160, -40); c.lineTo(40, -50); c.quadraticCurveTo(80, -50, 90, -20); c.lineTo(250, 10); c.lineTo(246, 34); c.lineTo(80, 20); c.lineTo(70, 40); c.lineTo(-10, 40); c.quadraticCurveTo(-30, 100, -90, 110); c.lineTo(-100, 90); c.quadraticCurveTo(-50, 80, -40, 20); c.lineTo(-160, 10); c.closePath(); c.fill();
    c.fillStyle = '#1a1a1a'; c.fillRect(-420, -22, 262, 26);
    c.strokeStyle = '#111'; c.lineWidth = 8; c.beginPath(); c.moveTo(-30, 30); c.quadraticCurveTo(10, 90, 60, 30); c.stroke();
    c.restore();
  };
  ill.boxes = (c, x, y, s = 1, seed = 5) => {
    const r = X.rand(seed);
    const box = (bx, by, bw, bh) => { const g = c.createLinearGradient(bx, by, bx + bw, by + bh); g.addColorStop(0, '#d4d4d4'); g.addColorStop(1, '#868686'); c.fillStyle = g; c.fillRect(bx, by, bw, bh); c.fillStyle = '#5a5a5a'; c.fillRect(bx + bw * 0.45, by, bw * 0.1, bh); c.strokeStyle = '#3a3a3a'; c.lineWidth = 2; c.strokeRect(bx, by, bw, bh); };
    c.save(); c.translate(x, y); c.scale(s, s);
    for (let row = 0; row < 4; row++) for (let i = 0; i < 6 - row; i++) { const bw = 80 + r() * 30, bh = 60 + r() * 20; box(-280 + row * 45 + i * 112 + (r() - 0.5) * 8, -bh - row * 74, bw, bh); }
    c.restore();
  };

  /** CSS-3D plane with HUNDREDS of stand-up figures (e.g. 435 seats): one inline SVG per figure row (cheap), blocks of
   *  {cols, rows, gap, rowGap, gx, gy, fh}; per-figure inT / redT, per-row fallT / outT; same cam() track as DK.iso.
   *  o.flat = [{svg|html, x, y, w, h}] lie flat on the plane (documents); o.stand = [{html, x, y}] stand up (labels). */
  DK.isoRows = (o = {}) => {
    const root = DK.isoDiv;
    Object.assign(root.style, { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', overflow: 'hidden', perspective: `${o.persp ?? 1500}px`, perspectiveOrigin: '50% 35%', visibility: 'hidden', background: o.bg || C.desk });
    const roll = X.html('div', { style: { position: 'absolute', left: 0, top: 0, width: '1920px', height: '1080px', transformStyle: 'preserve-3d', transformOrigin: '960px 540px' } }, root);
    const PW = DK.deskW || 5200, PH = DK.deskH || 3200;
    const plane = X.html('div', { style: { position: 'absolute', left: `${960 - PW / 2}px`, top: `${540 - PH / 2}px`, width: `${PW}px`, height: `${PH}px`, transformStyle: 'preserve-3d', transformOrigin: '50% 50%', backgroundImage: `url(${DK.deskURL})`, backgroundSize: '100% 100%' } }, roll);
    const tilt = o.tilt ?? 50, figs = [], rows = [], NSs = 'http://www.w3.org/2000/svg';
    const FIG = 'M14 30 Q30 24 46 30 L58 52 L52 56 L44 44 L44 70 L41 116 L33 116 L30 82 L27 116 L19 116 L16 70 L16 44 L8 56 L2 52 Z';
    (o.blocks || []).forEach((b, bi) => {
      const fh = b.fh ?? 60, gap = b.gap ?? 40, rgap = b.rowGap ?? gap, sc = fh / 118, fw = 60 * sc;
      const ox = PW / 2 + (b.gx ?? 0) - ((b.cols - 1) * gap) / 2, oy = PH / 2 + (b.gy ?? 0) - ((b.rows - 1) * rgap) / 2;
      for (let j = 0; j < b.rows; j++) {
        const stag = (j % 2) * gap * (b.stagger ?? 0.3), W = (b.cols - 1) * gap + fw + 8, left = ox + stag - fw / 2 - 4, top = oy + j * rgap - fh;
        const mk = (shadow) => {
          const d = X.html('div', { style: { position: 'absolute', left: `${left}px`, top: `${top}px`, width: `${W}px`, height: `${fh}px`, transformOrigin: '50% 100%' } }, plane);
          const sv = document.createElementNS(NSs, 'svg'); sv.setAttribute('width', W); sv.setAttribute('height', fh); sv.style.display = 'block'; sv.style.overflow = 'visible'; d.appendChild(sv);
          return { d, sv };
        };
        const sh = mk(true), up = mk(false);
        sh.d.style.transform = 'skewX(-28deg) scaleY(0.85)'; sh.d.style.opacity = 0.24;
        const row = { up: up.d, sh: sh.d, block: bi, row: j, fallT: 1e9, outT: 1e9, _k: '' };
        rows.push(row);
        for (let i = 0; i < b.cols; i++) {
          const cx = 4 + fw / 2 + i * gap;
          const mkFig = (sv, fill) => { const gg = document.createElementNS(NSs, 'g'); gg.setAttribute('transform', `translate(${cx - fw / 2},0) scale(${sc})`); sv.appendChild(gg);
            const inner = document.createElementNS(NSs, 'g'); inner.setAttribute('fill', fill); gg.appendChild(inner);
            const ci = document.createElementNS(NSs, 'circle'); ci.setAttribute('cx', 30); ci.setAttribute('cy', 13); ci.setAttribute('r', 12); inner.appendChild(ci);
            const pa = document.createElementNS(NSs, 'path'); pa.setAttribute('d', FIG); inner.appendChild(pa); return inner; };
          const f = { el: mkFig(up.sv, o.fill || '#f3eee3'), sh: mkFig(sh.sv, '#2a2016'), row, block: bi, col: i, rowIdx: j, inT: -1, redT: 1e9, _k: '' };
          figs.push(f);
        }
      }
    });
    const flats = (o.flat || []).map((f) => { const d = X.html('div', { html: f.html || '', style: { position: 'absolute', left: `${PW / 2 + f.x}px`, top: `${PH / 2 + f.y}px`, transformOrigin: '50% 50%', transform: `rotate(${f.rot || 0}deg)` } }, plane); if (f.svg) d.appendChild(f.svg); return d; });
    const stands = (o.stand || []).map((s) => X.html('div', { html: s.html || '', style: { position: 'absolute', left: `${PW / 2 + s.x}px`, top: `${PH / 2 + s.y}px`, transformOrigin: '0% 100%', whiteSpace: 'nowrap', opacity: 0, paddingBottom: '28px' } }, plane));
    const st0 = { x: 0, y: 0, z: 0, tilt, roll: o.roll ?? -7, blur: 0 };
    const keys = [];
    const stateAt = (t) => { let cur = st0; for (const k of keys) { if (t < k.t0) break; if (t < k.t1) { const p = k.ease((t - k.t0) / (k.t1 - k.t0)); const r = {}; for (const q in k.b) r[q] = k.a[q] + (k.b[q] - k.a[q]) * p; return r; } cur = k.b; } return cur; };
    const api = { root, plane, figs, rows, flats, stands, standIn: stands.map(() => -1), standOut: 1e9, tilt, stateAt, t0: 0, t1: 1e9,
      cam(t, vals, dur = 0.5, ease = 'power2.inOut') { const a = { ...stateAt(t) }; keys.push({ t0: t, t1: t + Math.max(1e-4, dur), a, b: { ...a, ...vals }, ease: gsap.parseEase(ease) }); return api; },
      show(t0, t1) { api.t0 = t0; api.t1 = t1 ?? 1e9; X.tl.set(root, { visibility: 'visible' }, t0); if (t1 != null) X.tl.set(root, { visibility: 'hidden' }, t1); return api; } };
    const red = o.red || C.red, cream = o.fill || '#f3eee3';
    const eIn = gsap.parseEase('back.out(2)'), eFall = gsap.parseEase('power2.in'), eOut = gsap.parseEase('power2.in');
    const clamp = (v) => Math.min(1, Math.max(0, v));
    X.every((t) => {
      if (t < api.t0 || t >= api.t1) return;
      const s = stateAt(t);
      plane.style.transform = `translate3d(${s.x}px,${s.y}px,${s.z}px) rotateX(${s.tilt}deg)`;
      roll.style.transform = `rotate(${s.roll}deg)`;
      root.style.filter = s.blur > 0.3 ? `blur(${s.blur.toFixed(1)}px)` : 'none';
      const up = -s.tilt;
      for (const r of rows) {
        const pf = eFall(clamp((t - r.fallT) / 0.32)), po = eOut(clamp((t - r.outT) / 0.3));
        const k = `${pf.toFixed(3)}|${po.toFixed(3)}|${up.toFixed(2)}`;
        if (k === r._k) continue; r._k = k;
        r.up.style.transform = `translateY(${(-po * 160).toFixed(1)}px) rotateX(${(up * (1 - pf)).toFixed(2)}deg)`;
        r.up.style.opacity = (1 - po) * (1 - 0.72 * pf);
        r.sh.style.opacity = (0.24 * (1 - pf) * (1 - po)).toFixed(3);
      }
      for (const f of figs) {
        const sc = eIn(clamp((t - f.inT) / 0.22)), isRed = t >= f.redT;
        const k = `${sc.toFixed(3)}|${isRed ? 1 : 0}`;
        if (k === f._k) continue; f._k = k;
        const tr = `translate(30,118) scale(${Math.max(0.0001, sc).toFixed(3)}) translate(-30,-118)`;
        f.el.setAttribute('transform', tr); f.sh.setAttribute('transform', tr);
        f.el.setAttribute('fill', isRed ? red : cream);
      }
      stands.forEach((d, i) => { const a = clamp((t - api.standIn[i]) / 0.3) * (1 - clamp((t - api.standOut) / 0.25)); d.style.transform = `rotateX(${up}deg)`; d.style.opacity = a; });
    });
    return api;
  };
})();
