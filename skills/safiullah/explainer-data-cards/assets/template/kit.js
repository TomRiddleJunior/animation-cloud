/* explainer-data-cards kit — vertical (9:16) "investigation data card" reel helpers for explainer-engine (window.X).
 *
 * The look: one fixed card system on cream ruled paper. A persistent chrome (| LABEL top-left, outlet logo top-right,
 * SOURCE / … footer whose orange underline is a progress bar) never moves; the content stack in between builds on
 * (lines rise out of a mask, numbers count, bars grow, dots fill), holds still, then fades out as one block before the
 * next card builds. No cuts, no camera moves; one dark "3-D render" insert crossfades in at the top for the mechanism.
 *
 * Load after /engine/lib/explainer.js, before scene.js. Call DC.init(X, {...}) inside X.boot after X.loadVO().
 * index.html: <html data-size="1080x1920">, #stage 1080×1920, one <svg id="svg" viewBox="0 0 1080 1920">.
 * Every animation is a tween on X.tl with fixed from/to values or a pure onUpdate(progress) — safe for seeking.
 *
 *  palette/type   DC.C · DC.F · DC.T (timing constants, seconds)
 *  chrome         DC.init(X, {label, source, brand, logo}) → header, logo, footer + progress bar, background
 *                 DC.logoMark(parent, x, y, s) · DC.endCard(t)   (chrome fades, centred logo resolves, music should stop)
 *  cards          DC.card(id, t0, tOut, build(s), {cy}) — a vertically centred stack, faded out as one block at tOut
 *  stack s        s.label · s.head · s.number · s.lead · s.body · s.tag · s.divider · s.shortRule · s.gap · s.barRow ·
 *                 s.list · s.dots · s.doc · s.figure · s.panel · s.connector · s.stamp · s.strike · s.ruleOn/ruleOff
 *  insert         DC.insert(t0, tOut, draw(g), {h}) — dark top panel, crossfade 10 f, slow push, gradient fade to paper
 *                 DC.ill.sphere · DC.ill.glowDot · DC.ill.laser · DC.ill.redBox · DC.ill.stars · DC.ill.planetLimb
 *  timing         DC.at(lineId, word, off) — VO word time (+off)
 */
(function () {
  const DC = (window.DC = {});
  const NS = 'http://www.w3.org/2000/svg';
  let X = null, uidN = 0;
  const uid = (DC.uid = (p = 'dc') => `${p}${++uidN}`);

  // ------------------------------------------------------------------ palette (sampled from the source, see analysis §5)
  const C = (DC.C = {
    paper: '#ebe2d3', paperEdge: '#dfd2bf', grid: '#ddd2bf', ink: '#111010', ink2: '#2a2622',
    orange: '#c14800', orangeDeep: '#5a2206', orangeTint: 'rgba(193,72,0,0.10)',
    label: '#76603a', grey: '#5b5143', greyLight: '#7d7262', greyNum: '#58524a',
    barGrey: '#948a7b', track: '#dcd0bc', divider: '#c8bead', hair: '#d6cab6', panel: '#ddd1bd', panelLine: '#c6b9a3',
    dark: '#0c0c0d', dark2: '#1b1c1f', laser: '#ff3b2f', redBox: '#d8382c',
    docWhite: '#fbfaf6', docCream: '#f2ede3', docLine: '#2b2723',
    logoDisc: '#d4361d', logoInk: '#1b2440',
  });
  const F = (DC.F = {
    head: "'Oswald', 'Anton', Impact, sans-serif",   // heavy condensed caps (Anton look-alike: Oswald 700 + stroke + 0.93 condense)
    ui: "'Inter', 'Segoe UI', sans-serif",            // labels, captions, lead-ins
    serif: "'Lora', Georgia, serif",                  // document body text
    mono: "'Roboto Mono', monospace",                 // document kicker
  });
  // frame-measured timings (30 fps source): rise 5 f, line stagger 6 f, fade-out 10 f, empty 4 f, label fade 4 f
  const T = (DC.T = { rise: 0.2, stagger: 0.2, fadeOut: 0.33, fadeIn: 0.14, strike: 0.22, count: 1.6, doc: 0.5, insert: 0.34 });
  const CAP = 0.81;        // Oswald cap height / em
  const ICAP = 0.7275;     // Inter cap height / em
  const SX = 0.93;         // horizontal condense of the headline face
  const W = 1080, H = 1920, ML = 90, MR = 990, CW = MR - ML;
  Object.assign(DC, { W, H, ML, MR, CW });

  DC.at = (id, w, off = 0) => (w ? X.word(id, w) : X.line(id).start) + off;

  // ------------------------------------------------------------------ text primitives
  /** heavy condensed caps line; returns the <text>. Cap height `cap` px; baseline at y. */
  function headText(parent, str, x, y, cap, fill, o = {}) {
    const fs = cap / CAP;
    const t = X.svg('text', {
      x: 0, y: 0, transform: `translate(${x},${y}) scale(${o.sx ?? SX},1)`, 'font-family': F.head, 'font-weight': 700,
      'font-size': fs.toFixed(1), fill, stroke: fill, 'stroke-width': (fs * (o.weight ?? 0.034)).toFixed(2), 'stroke-linejoin': 'round',
      'paint-order': 'stroke', 'text-anchor': o.anchor || 'start', 'letter-spacing': o.ls ?? '0.004em', text: str,
    }, parent);
    if (o.shadow) t.setAttribute('filter', DC.orangeShadow());
    return t;
  }
  DC.headText = headText;
  function uiText(parent, str, x, y, size, fill, o = {}) {
    return X.svg('text', {
      x, y, 'font-family': o.family || F.ui, 'font-weight': o.weight ?? 500, 'font-size': size, fill,
      'letter-spacing': o.ls ?? '0', 'text-anchor': o.anchor || 'start', text: str,
    }, parent);
  }
  DC.uiText = uiText;
  const width = (el) => { try { return el.getComputedTextLength(); } catch (e) { return el.getBBox().width; } };
  DC.width = width;
  /** wrap `str` into lines no wider than maxW for the given text factory */
  function wrap(parent, str, maxW, make) {
    const words = str.split(/\s+/), lines = [];
    let cur = '';
    const probe = make(parent, '');
    for (const w of words) {
      const test = cur ? cur + ' ' + w : w;
      probe.textContent = test;
      if (width(probe) > maxW && cur) { lines.push(cur); cur = w; } else cur = test;
    }
    if (cur) lines.push(cur);
    probe.remove();
    return lines;
  }
  DC.wrap = wrap;

  let shadowId = null;
  /** the thin dark lower-right edge the source puts under every orange headline / number */
  DC.orangeShadow = () => {
    if (!shadowId) {
      shadowId = 'dcOsh';
      const f = X.svg('filter', { id: shadowId, x: '-5%', y: '-5%', width: '115%', height: '125%' }, X.defs);
      X.svg('feDropShadow', { dx: 2.6, dy: 2.6, stdDeviation: 0.7, 'flood-color': C.orangeDeep, 'flood-opacity': 0.55 }, f);
    }
    return `url(#${shadowId})`;
  };

  /** a group clipped to [y0,y1] whose child rises from below the clip: the source's line build-on */
  function riser(parent, y0, y1, t, o = {}) {
    const id = uid('clip');
    const cp = X.svg('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, X.defs);
    X.svg('rect', { x: -200, y: y0, width: W + 400, height: y1 - y0 }, cp);
    const clip = X.svg('g', { 'clip-path': `url(#${id})` }, parent);
    const mover = X.svg('g', {}, clip);
    const dy = o.dy ?? (y1 - y0) * 1.05;
    gsap.set(mover, { y: dy });
    X.tl.fromTo(mover, { y: dy }, { y: 0, duration: o.dur ?? T.rise, ease: o.ease || 'power3.out', immediateRender: false }, t);
    return mover;
  }
  DC.riser = riser;
  // opacity only (never tween transforms on elements that carry their own transform attribute, e.g. head text)
  const fadeIn = (el, t, dur = T.fadeIn, o = {}) => {
    gsap.set(el, { opacity: 0 });
    const from = { opacity: 0 }, to = { opacity: 1, duration: dur, ease: 'power1.out', immediateRender: false };
    if (o.dy) { from.y = o.dy; to.y = 0; }
    X.tl.fromTo(el, from, to, t);
  };
  DC.fadeIn = fadeIn;

  // ------------------------------------------------------------------ background + chrome
  function paperImage() {
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const g = c.getContext('2d');
    const rg = g.createRadialGradient(W * 0.5, H * 0.46, 80, W * 0.5, H * 0.5, H * 0.62);
    rg.addColorStop(0, '#ede5d7'); rg.addColorStop(0.55, '#e9e0cf'); rg.addColorStop(1, '#dfd2be');
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
    // faint ruled grid: 90 px cells (60 px @720), lines ~6 levels darker than the paper
    g.strokeStyle = 'rgba(120,96,60,0.075)'; g.lineWidth = 1.5;
    for (let x = 90; x < W; x += 90) { g.beginPath(); g.moveTo(x + 0.5, 0); g.lineTo(x + 0.5, H); g.stroke(); }
    for (let y = 36; y < H; y += 90) { g.beginPath(); g.moveTo(0, y + 0.5); g.lineTo(W, y + 0.5); g.stroke(); }
    // no fibre noise: the source ground is a smooth gradient + grid, and frames must hold perfectly still
    return c.toDataURL('image/png');
  }

  /** outlet logo: a vermilion disc with a navy obelus (÷) over it and a heavy wordmark under it. (x,y) = top centre */
  DC.logoMark = (parent, x, y, s = 1, brand = 'OBELUS') => {
    const g = X.svg('g', { transform: `translate(${x},${y}) scale(${s})` }, parent);
    X.svg('circle', { cx: 0, cy: 46, r: 40, fill: C.logoDisc }, g);
    X.svg('rect', { x: -48, y: 41, width: 96, height: 11, rx: 2, fill: C.logoInk }, g);
    X.svg('circle', { cx: 0, cy: 22, r: 9, fill: C.logoInk }, g);
    X.svg('circle', { cx: 0, cy: 71, r: 9, fill: C.logoInk }, g);
    X.svg('circle', { cx: -14, cy: 28, r: 9, fill: '#e5654c', opacity: 0.35 }, g); // a little glint on the disc
    headText(g, brand, 0, 134, 32, C.logoInk, { anchor: 'middle', sx: 1, weight: 0.06, ls: '0.02em' });
    return g;
  };

  /** builds paper, layers and the persistent chrome. o: {label, source, brand} */
  DC.init = (x, o = {}) => {
    X = x;
    X.svg('image', { href: paperImage(), x: 0, y: 0, width: W, height: H, preserveAspectRatio: 'none' }, X.root);
    DC.insertLayer = X.svg('g', { id: 'dcInsert' }, X.root);
    DC.content = X.svg('g', { id: 'dcContent' }, X.root);
    DC.chrome = X.svg('g', { id: 'dcChrome' }, X.root);
    DC.top = X.svg('g', { id: 'dcTop' }, X.root);
    const ch = DC.chrome;
    // header: orange tick + spaced caps label (y ≈ 6.5 % of H)
    X.svg('rect', { x: ML, y: 110, width: 4, height: 28, fill: C.orange }, ch);
    uiText(ch, o.label || 'EXPLAINER', ML + 20, 134, 25, C.label, { weight: 600, ls: '0.3em' });
    DC.logo = DC.logoMark(ch, 930, 64, 1, o.brand || 'OBELUS');
    // footer: SOURCE / … + hairline + progress bar (orange underline grows with the runtime)
    uiText(ch, 'SOURCE / ' + (o.source || '—'), ML, 1776, 25, C.label, { weight: 600, ls: '0.3em' });
    X.svg('rect', { x: ML, y: 1797, width: CW, height: 1.5, fill: C.hair }, ch);
    DC.progress = X.svg('rect', { x: ML, y: 1796, width: CW, height: 3, fill: C.orange }, ch);
    gsap.set(DC.progress, { scaleX: 0.004, transformOrigin: '0% 50%' });
    DC._progressSet = false;
    return DC;
  };
  /** run the footer progress bar 0 → 100 % between t0 and t1 (linear, like a playhead) */
  DC.progressBar = (t0, t1) => {
    X.tl.fromTo(DC.progress, { scaleX: 0.004 }, { scaleX: 1, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
  };

  /** logo end card: chrome + content fade (8 f), centred logo fades in from 96 % (8 f), underline grows from centre */
  DC.endCard = (t, o = {}) => {
    X.tl.fromTo(DC.chrome, { opacity: 1 }, { opacity: 0, duration: 0.27, ease: 'none', immediateRender: false }, t);
    const g = X.svg('g', {}, DC.top);
    const inner = X.svg('g', {}, g);
    DC.logoMark(inner, W / 2, 0, o.scale ?? 2.3, o.brand || 'OBELUS');
    gsap.set(inner, { y: H * 0.43 - 190 });
    const ul = X.svg('rect', { x: W / 2 - 60, y: H * 0.43 - 190 + (o.scale ?? 2.3) * 152, width: 120, height: 4, fill: C.orange }, g);
    gsap.set(g, { opacity: 0, scale: 0.96, svgOrigin: `${W / 2} ${H * 0.43}` });
    X.tl.fromTo(g, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, t + 0.3);
    gsap.set(ul, { scaleX: 0, transformOrigin: '50% 50%' });
    X.tl.fromTo(ul, { scaleX: 0 }, { scaleX: 1, duration: 0.35, ease: 'power2.out', immediateRender: false }, t + 0.75);
    return g;
  };

  // ------------------------------------------------------------------ cards
  /** a content card visible [t0, tOut + fade]; build(s) fills a stack; the whole block fades out at tOut.
   *  o.cy: vertical centre of the block (default 0.45 H); o.top: fixed top instead of centring; o.fade: fade-out dur */
  DC.card = (id, t0, tOut, build, o = {}) => {
    const fade = o.fade ?? T.fadeOut;
    const outer = X.scene(id, t0, tOut != null ? tOut + fade + 0.02 : null, null, DC.content);
    const inner = X.svg('g', {}, outer);
    const s = stack(inner, o);
    build(s, t0);
    s._finishRule();
    const top = o.top != null ? o.top : (o.cy ?? H * 0.45) - s.y / 2;
    inner.setAttribute('transform', `translate(0,${top.toFixed(1)})`);
    s.top = top;
    if (tOut != null) X.tl.fromTo(inner, { opacity: 1 }, { opacity: 0, duration: fade, ease: 'none', immediateRender: false }, tOut);
    return s;
  };

  /** the flow layout every card uses: items stack down from y = 0 at x = ML (or ML + 37 inside an orange side rule) */
  function stack(g, o = {}) {
    const s = { g, y: 0, x0: o.x0 ?? ML, w: o.w ?? CW, rule: null };
    const X0 = () => (s.rule ? s.x0 + 37 : s.x0);
    // ---------------- orange side rule (grows with the ruled items, measured 3-4 f per segment)
    s.rule = null;
    s.ruleOn = () => { s.rule = { y0: s.y, segs: [] }; return s; };
    s.ruleOff = () => { s._finishRule(); return s; };
    s._finishRule = () => {
      const r = s.rule; if (!r || !r.segs.length) { s.rule = null; return; }
      const bar = X.svg('rect', { x: s.x0, y: r.y0, width: 4, height: 1, fill: C.orange }, g);
      gsap.set(bar, { attr: { height: 0.01 } });
      let prev = 0.01;
      for (const sg of r.segs) {
        X.tl.fromTo(bar, { attr: { height: prev } }, { attr: { height: sg.bottom - r.y0 }, duration: 0.12, ease: 'power2.out', immediateRender: false }, sg.t - 0.06);
        prev = sg.bottom - r.y0;
      }
      s.rule = null;
    };
    const ruled = (bottom, t) => { if (s.rule) s.rule.segs.push({ bottom, t }); };

    s.gap = (px) => { s.y += px; return s; };
    /** spaced caps label (brown), fades in 4 f */
    s.label = (text, t, o2 = {}) => {
      const size = o2.size ?? 29, cap = size * ICAP;
      const el = uiText(g, text, o2.x ?? X0(), s.y + cap, size, o2.color || C.label, { weight: 600, ls: o2.ls ?? '0.3em', anchor: o2.anchor });
      fadeIn(el, t);
      ruled(s.y + cap, t);
      s.y += cap + (o2.after ?? 22);
      return el;
    };
    /** heavy condensed headline lines rising out of a mask, 6 f stagger. colors: one per line */
    s.head = (lines, t, o2 = {}) => {
      lines = [].concat(lines);
      let cap = o2.cap ?? 104;
      if (o2.fit !== false) { // shrink the whole block if its widest line overflows the column
        const maxW = o2.maxW ?? (s.w - ((o2.x ?? X0()) - s.x0));
        let wMax = 0;
        for (const str of lines) { const pr = headText(g, str, 0, -5000, cap, '#000', { sx: o2.sx }); wMax = Math.max(wMax, width(pr) * (o2.sx ?? SX)); pr.remove(); }
        if (wMax > maxW) cap *= maxW / wMax;
      }
      const lead = o2.lead ?? cap * 1.24;
      const els = [];
      lines.forEach((str, i) => {
        const base = s.y + cap + i * lead;
        const ti = t + i * (o2.stagger ?? T.stagger);
        const m = riser(g, base - cap - cap * 0.14, base + cap * (o2.desc ?? 0.2), ti, { dur: o2.dur });
        const col = (o2.colors && o2.colors[i]) || o2.color || C.ink;
        const el = headText(m, str, o2.x ?? X0(), base, cap, col, { shadow: col === C.orange, anchor: o2.anchor, sx: o2.sx });
        els.push(el);
        ruled(base + cap * 0.08, ti);
      });
      s.y += cap + (lines.length - 1) * lead + (o2.after ?? 28);
      return els;
    };
    /** big count-up number: appears at t (fade 3 f), holds 5 f, counts from→to with power3.out */
    s.number = (t, o2 = {}) => {
      const cap = o2.cap ?? 300, col = o2.color || C.ink;
      const base = s.y + cap;
      const x = o2.anchor === 'end' ? MR : (o2.x ?? X0());
      const el = headText(g, '', x, base, cap, col, { shadow: col === C.orange, anchor: o2.anchor, weight: o2.weight ?? 0.03 });
      const fmt = o2.fmt || ((v) => Math.round(v).toLocaleString('en-US'));
      el.textContent = fmt(o2.from ?? 0);
      fadeIn(el, t, 0.1);
      const obj = { v: o2.from ?? 0 };
      X.tl.fromTo(obj, { v: o2.from ?? 0 }, { v: o2.to, duration: o2.dur ?? T.count, ease: o2.ease || 'power3.out', immediateRender: false, onUpdate: () => { el.textContent = fmt(obj.v); } }, t + 0.17);
      ruled(base, t);
      if (o2.underline) { // thin underline that draws while it counts (4-billion card)
        const ul = X.svg('rect', { x: X0(), y: base + cap * 0.1, width: o2.underline, height: 3, fill: C.ink2 }, g);
        gsap.set(ul, { scaleX: 0, transformOrigin: '0% 50%' });
        X.tl.fromTo(ul, { scaleX: 0 }, { scaleX: 1, duration: o2.dur ?? T.count, ease: 'power2.out', immediateRender: false }, t + 0.17);
      }
      if (!o2.inline) s.y += cap + (o2.after ?? 34);
      el._base = base;
      return el;
    };
    /** sentence in Inter (lead-in above a big word, or a sub-line), wrapped, fades in 4 f */
    s.lead = (text, t, o2 = {}) => {
      const size = o2.size ?? 39, cap = size * ICAP, lead = o2.lead ?? size * 1.32;
      const lines = wrap(g, text, o2.maxW ?? (s.w - (X0() - s.x0)), (p, str) => uiText(p, str, o2.x ?? X0(), 0, size, o2.color || C.grey, { weight: o2.weight ?? 500 }));
      const els = lines.map((str, i) => {
        const el = uiText(g, str, o2.x ?? X0(), s.y + cap + i * lead, size, o2.color || C.grey, { weight: o2.weight ?? 500 });
        fadeIn(el, t + i * 0.05);
        return el;
      });
      ruled(s.y + cap + (lines.length - 1) * lead, t);
      s.y += cap + (lines.length - 1) * lead + (o2.after ?? 30);
      return els;
    };
    s.body = (text, t, o2 = {}) => s.lead(text, t, { size: 32, color: C.grey, weight: 400, after: 26, ...o2 });
    /** tag line under a hero block: short ink dash + spaced caps ("—— INVOLVING …"), fades in 4 f */
    s.tag = (text, t, o2 = {}) => {
      const size = o2.size ?? 26, cap = size * ICAP, x = o2.x ?? X0();
      const dash = X.svg('rect', { x, y: s.y + cap / 2 - 1, width: 46, height: 2.5, fill: o2.dash || C.label }, g);
      const el = uiText(g, text, x + 66, s.y + cap, size, o2.color || C.ink2, { weight: 700, ls: '0.24em' });
      fadeIn(dash, t); fadeIn(el, t);
      s.y += cap + (o2.after ?? 30);
      return el;
    };
    /** full-width hairline divider, draws left → right over 8 f */
    s.divider = (t, o2 = {}) => {
      const el = X.svg('rect', { x: o2.x ?? s.x0, y: s.y, width: o2.w ?? s.w, height: o2.h ?? 1.6, fill: o2.color || C.divider }, g);
      gsap.set(el, { scaleX: 0, transformOrigin: '0% 50%' });
      X.tl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.27, ease: 'power2.out', immediateRender: false }, t);
      s.y += (o2.after ?? 40);
      return el;
    };
    /** short orange rule (120 × 3 px) between a statement and its kicker */
    s.shortRule = (t, o2 = {}) => s.divider(t, { w: o2.w ?? 120, h: 3, color: C.orange, x: o2.x ?? X0(), after: o2.after ?? 36 });
    /** thick orange strike-through on a head line element, drawn left → right in 6-7 f */
    s.strike = (el, t, o2 = {}) => {
      const bb = el.getBBox(), ctm = el.transform.baseVal.consolidate().matrix;
      const x0 = ctm.e + bb.x * ctm.a - 8, x1 = ctm.e + (bb.x + bb.width) * ctm.a + 10;
      const capH = parseFloat(el.getAttribute('font-size')) * CAP;
      const y = ctm.f - capH * (o2.at ?? 0.5);
      const bar = X.svg('rect', { x: x0, y: y - (o2.h ?? 18) / 2, width: x1 - x0, height: o2.h ?? 18, fill: C.orange }, el.closest('g[clip-path]')?.parentNode || g);
      bar.setAttribute('filter', DC.orangeShadow());
      gsap.set(bar, { scaleX: 0, transformOrigin: '0% 50%' });
      X.tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: o2.dur ?? T.strike, ease: 'power2.inOut', immediateRender: false }, t);
      X.sfx(t, 'swoosh', { dur: 0.25, gain: 0.18, pitch: 1.4 });
      return bar;
    };
    /** comparison bars: rows [{kicker, name, to, from, frac, color, t, dur, fmt}] — label + value count + bar grow */
    s.barRow = (r) => {
      const capN = r.cap ?? 130, capName = r.capName ?? 66, barH = r.barH ?? 62;
      if (r.kicker) {
        const k = uiText(g, r.kicker, ML, s.y + capN - capName - 16, 24, C.label, { weight: 600, ls: '0.3em' });
        fadeIn(k, r.t - 0.25);
      }
      const base = s.y + capN;
      const nm = headText(g, r.name, ML, base, capName, C.ink);
      fadeIn(nm, r.t - 0.25);
      const col = r.color || C.ink;
      const num = headText(g, '', MR, base, capN, col === C.orange ? C.orange : C.ink, { anchor: 'end', shadow: col === C.orange });
      const fmt = r.fmt || ((v) => Math.round(v).toLocaleString('en-US'));
      num.textContent = fmt(r.from ?? 0);
      fadeIn(num, r.t - 0.1, 0.1);
      const obj = { v: r.from ?? 0 };
      X.tl.fromTo(obj, { v: r.from ?? 0 }, { v: r.to, duration: r.dur ?? 1.2, ease: 'power3.out', immediateRender: false, onUpdate: () => { num.textContent = fmt(obj.v); } }, r.t);
      const by = base + 28;
      const track = X.svg('rect', { x: ML, y: by, width: CW, height: barH, fill: C.track }, g);
      fadeIn(track, r.t - 0.25);
      const fill = X.svg('rect', { x: ML, y: by, width: CW * r.frac, height: barH, fill: r.barColor || (col === C.orange ? C.orange : C.barGrey) }, g);
      gsap.set(fill, { scaleX: 0, transformOrigin: '0% 50%' });
      X.tl.fromTo(fill, { scaleX: 0 }, { scaleX: 1, duration: r.dur ?? 1.2, ease: 'power3.out', immediateRender: false }, r.t);
      X.sfx(r.t, 'tick', { gain: 0.12, pitch: 1.2 });
      s.y = by + barH + (r.after ?? 64);
      return { nm, num, track, fill };
    };
    /** numbered list: items [{text, t, color, sub}] with hairlines between, numbers small orange */
    s.list = (items, o2 = {}) => {
      const cap = o2.cap ?? 56, rowH = o2.rowH ?? 120;
      const top = X.svg('rect', { x: ML, y: s.y, width: CW, height: 1.6, fill: C.divider }, g);
      fadeIn(top, items[0].t - 0.3);
      items.forEach((it, i) => {
        const y0 = s.y + i * rowH, base = y0 + rowH / 2 + cap / 2;
        const n = uiText(g, String(i + 1).padStart(2, '0'), ML, base, 29, C.orange, { weight: 600, ls: '0.12em' });
        fadeIn(n, it.t);
        const m = riser(g, base - cap * 1.16, base + cap * 0.22, it.t + 0.03);
        headText(m, it.text, ML + 68, base, cap, it.color || C.ink, { shadow: it.color === C.orange });
        if (it.sub) { const sb = uiText(g, it.sub, ML + 68, base + 42, 30, C.grey, { weight: 500 }); fadeIn(sb, it.subT ?? it.t + 0.35); }
        if (i < items.length - 1 || o2.lastLine) {
          const ln = X.svg('rect', { x: ML, y: y0 + rowH + (it.sub && i === items.length - 1 ? 30 : 0), width: CW, height: 1.6, fill: C.divider }, g);
          fadeIn(ln, it.t);
        }
        X.sfx(it.t, 'click', { gain: 0.16, pitch: 0.9 });
      });
      const last = items[items.length - 1];
      s.y += items.length * rowH + (last.sub ? 34 : 0) + (o2.after ?? 30);
    };
    /** dot-matrix: cols × rows dots, ghost grid fades in, then dots fill dark in reading order as the count runs */
    s.dots = (o2) => {
      const cols = o2.cols, rows = o2.rows, n = o2.n ?? cols * rows, pitch = o2.pitch ?? CW / (cols - 1 + 0.6), r = o2.r ?? pitch * 0.21;
      const dots = [];
      const gg = X.svg('g', {}, g);
      for (let i = 0; i < n; i++) {
        const cx = ML + r + (i % cols) * pitch, cy = s.y + r + Math.floor(i / cols) * pitch * (o2.vy ?? 1);
        dots.push(X.svg('circle', { cx: cx.toFixed(1), cy: cy.toFixed(1), r: r.toFixed(1), fill: C.ink, opacity: 0.13 }, gg));
      }
      fadeIn(gg, o2.ghostT ?? o2.t - 0.4, 0.25);
      const acc = new Set(o2.accent || []);
      const paint = (k) => { for (let i = 0; i < n; i++) { const on = i < k; const d = dots[i]; d.setAttribute('opacity', on ? 1 : 0.13); d.setAttribute('fill', on && acc.has(i) ? C.orange : C.ink); } };
      paint(0);
      const obj = { k: 0 };
      X.tl.fromTo(obj, { k: 0 }, { k: n, duration: o2.dur ?? 2.4, ease: o2.ease || 'power3.out', immediateRender: false, onUpdate: () => paint(Math.round(obj.k)) }, o2.t);
      s.y += r * 2 + (rows - 1) * pitch * (o2.vy ?? 1) + (o2.after ?? 34);
      return dots;
    };
    /** document "screenshot" card: white page, top nav strip, mono kicker, condensed title, serif body panel.
     *  Revealed top → bottom like a blind (15 f) led by an orange hairline; the page then drifts out from 108 % to
     *  100 % inside its frame (Ken Burns, o2.hold s) and an orange highlight box draws round the title at o2.boxT.
     *  o2: {t, kicker, title, sub[], body, tag, h, hold, boxT} */
    s.doc = (o2) => {
      const t = o2.t, w = CW, x = ML, y = s.y;
      const gg = X.svg('g', {}, g);
      const nSub = (o2.sub || []).length, wh = Math.max(250, 150 + nSub * 48 + 40);   // white page height
      const bodyLines = wrap(gg, o2.body || '', w - 92, (p, str) => uiText(p, str, x + 46, 0, 31, '#2a2622', { family: F.serif, weight: 400 })).slice(0, 5);
      const hTot = o2.h ?? (82 + wh + 62 + (bodyLines.length - 1) * 46 + 36);
      const id = uid('doc');
      const cp = X.svg('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, X.defs);
      const cr = X.svg('rect', { x: x - 2, y: y, width: w + 4, height: 0 }, cp);
      gg.setAttribute('clip-path', `url(#${id})`);
      X.svg('rect', { x, y, width: w, height: hTot, fill: '#1e2226' }, gg);            // the screenshot's dark frame
      const zoom = X.svg('g', {}, gg);
      X.svg('rect', { x: x + 16, y, width: w - 32, height: hTot, fill: C.docCream }, zoom);
      X.svg('rect', { x: x + 16, y, width: w - 32, height: 82, fill: C.docWhite }, zoom); // nav strip: fine grid, hamburger, tag
      for (let i = 0; i < 26; i++) X.svg('rect', { x: x + 16 + i * 34, y, width: 1, height: 82, fill: '#d9d4ca' }, zoom);
      X.svg('rect', { x: x + 16, y: y + 40, width: w - 32, height: 1, fill: '#d9d4ca' }, zoom);
      for (let k = 0; k < 3; k++) X.svg('rect', { x: x + 40, y: y + 28 + k * 12, width: 36, height: 3, fill: '#2a2a2a' }, zoom);
      X.svg('rect', { x: x + w - 300, y: y + 14, width: 270, height: 54, fill: C.docWhite }, zoom);
      uiText(zoom, o2.tag || 'ARCHIVE', x + w - 46, y + 51, 26, '#2b6f73', { weight: 800, anchor: 'end', ls: '0.02em' });
      const by = y + 82;
      X.svg('rect', { x: x + 16, y: by, width: w - 32, height: wh, fill: C.docWhite }, zoom);
      X.svg('rect', { x: x + 16.75, y: by, width: w - 33.5, height: wh, fill: 'none', stroke: C.docLine, 'stroke-width': 1.5 }, zoom);
      uiText(zoom, o2.kicker || 'ARCHIVE → DOCUMENT', x + 46, by + 50, 21, '#222', { family: F.mono, weight: 600, ls: '0.08em' });
      const tt = headText(zoom, o2.title, x + 58, by + 122, 50, C.ink2, { weight: 0.02 });
      const tw = width(tt) * SX;
      (o2.sub || []).forEach((ln, i) => headText(zoom, ln, x + 46, by + 196 + i * 48, 34, C.ink2, { weight: 0.012, sx: 0.95 }));
      bodyLines.forEach((ln, i) => uiText(zoom, ln, x + 46, by + wh + 58 + i * 46, 31, '#2a2622', { family: F.serif, weight: 400 }));
      // highlight box round the title, drawn on later (the source boxes the report title / site logo ~1.5–3 s in)
      const box = X.svg('rect', { x: x + 44, y: by + 72, width: tw + 30, height: 66, fill: 'none', stroke: C.orange, 'stroke-width': 3 }, zoom);
      X.drawOn(box, o2.boxT ?? t + 1.6, 0.4, 'power2.inOut');
      // Ken Burns drift inside the frame
      gsap.set(zoom, { svgOrigin: `${x + w / 2} ${y + hTot * 0.3}` });
      const z0 = o2.zoom ?? 1.08;   // near-linear drift: keeps the card alive for the whole hold, like the source
      X.tl.fromTo(zoom, { scale: z0 }, { scale: 1, duration: o2.hold ?? 5, ease: 'none', immediateRender: false }, t);
      gsap.set(zoom, { scale: z0 });
      // blind reveal + orange leading line
      const dur = o2.dur ?? T.doc;
      X.tl.fromTo(cr, { attr: { height: 3 } }, { attr: { height: hTot }, duration: dur, ease: 'power2.out', immediateRender: false }, t);
      gsap.set(cr, { attr: { height: 0 } });
      const edge = X.svg('rect', { x: x - 20, y, width: w + 40, height: 3, fill: C.orange, opacity: 0 }, g);
      X.tl.fromTo(edge, { attr: { y }, opacity: 1 }, { attr: { y: y + hTot }, duration: dur, ease: 'power2.out', immediateRender: false }, t);
      X.tl.fromTo(edge, { opacity: 1 }, { opacity: 0, duration: 0.12, ease: 'none', immediateRender: false }, t + dur);
      X.sfx(t, 'paper', { gain: 0.16, dur: 0.4 });
      s.y += hTot + (o2.after ?? 24);
      return gg;
    };
    /** figure / web-page "screenshot" card (the source's second screenshot): a white page with a thin nav bar whose
     *  content you draw with draw(g, x, y, w, h). Reveals left → right from a vertical hairline with an orange leading
     *  line (18 f), drifts 108 → 100 % inside its frame, and draws an orange highlight box round o2.box at o2.boxT.
     *  o2: {t, h, draw, box:{x,y,w,h} (card-relative), boxT, hold, dir:'x'|'y'} */
    s.figure = (o2) => {
      const t = o2.t, x = ML, y = s.y, w = CW, h = o2.h ?? 430, dir = o2.dir || 'x';
      const gg = X.svg('g', {}, g);
      const id = uid('fig');
      const cp = X.svg('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, X.defs);
      const cr = X.svg('rect', { x, y, width: dir === 'x' ? 0 : w, height: dir === 'x' ? h : 0 }, cp);
      gg.setAttribute('clip-path', `url(#${id})`);
      const zoom = X.svg('g', {}, gg);
      X.svg('rect', { x, y, width: w, height: h, fill: C.docWhite }, zoom);
      X.svg('rect', { x, y, width: w, height: 58, fill: '#f1f0ec' }, zoom);
      X.svg('rect', { x, y: y + 58, width: w, height: 1.2, fill: '#dcd8cf' }, zoom);
      [70, 150, 250, 350, 440, 560].forEach((dx, i) => X.svg('rect', { x: x + 40 + dx, y: y + 25, width: i ? 64 : 34, height: 8, rx: 4, fill: i ? '#c9c5bc' : '#2b6f73' }, zoom));
      if (o2.draw) o2.draw(zoom, x, y + 59, w, h - 59);
      if (o2.box) {
        const b = o2.box;
        const box = X.svg('rect', { x: x + b.x, y: y + b.y, width: b.w, height: b.h, fill: 'none', stroke: C.orange, 'stroke-width': 3 }, zoom);
        X.drawOn(box, o2.boxT ?? t + 1.5, 0.4, 'power2.inOut');
      }
      X.svg('rect', { x: x + 0.75, y: y + 0.75, width: w - 1.5, height: h - 1.5, fill: 'none', stroke: '#cfc9bd', 'stroke-width': 1.5 }, gg);
      const z0 = o2.zoom ?? 1.08;
      gsap.set(zoom, { svgOrigin: `${x + w / 2} ${y + h / 2}`, scale: z0 });
      X.tl.fromTo(zoom, { scale: z0 }, { scale: 1, duration: o2.hold ?? 5, ease: 'none', immediateRender: false }, t);
      const dur = o2.dur ?? 0.6;
      const key = dir === 'x' ? 'width' : 'height', full = dir === 'x' ? w : h;
      X.tl.fromTo(cr, { attr: { [key]: 2 } }, { attr: { [key]: full }, duration: dur, ease: 'power2.inOut', immediateRender: false }, t);
      const edge = dir === 'x' ? X.svg('rect', { x, y: y - 14, width: 3, height: h + 28, fill: C.orange, opacity: 0 }, g)
        : X.svg('rect', { x: x - 20, y, width: w + 40, height: 3, fill: C.orange, opacity: 0 }, g);
      const a0 = dir === 'x' ? { x } : { y }, a1 = dir === 'x' ? { x: x + w } : { y: y + h };
      X.tl.fromTo(edge, { attr: a0, opacity: 1 }, { attr: a1, duration: dur, ease: 'power2.inOut', immediateRender: false }, t);
      X.tl.fromTo(edge, { opacity: 1 }, { opacity: 0, duration: 0.12, ease: 'none', immediateRender: false }, t + dur);
      X.sfx(t, 'slide', { gain: 0.12, dur: 0.5 });
      s.y += h + (o2.after ?? 26);
      return zoom;
    };
    /** log-card panel: darker paper box with an orange left border; build(p) adds rows inside with a nested stack */
    s.panel = (t, build, o2 = {}) => {
      const y0 = s.y;
      const box = X.svg('rect', { x: ML, y: y0, width: CW, height: 10, fill: C.panel }, g);
      const edge = X.svg('rect', { x: ML, y: y0, width: 5, height: 10, fill: C.orange }, g);
      fadeIn(box, t, 0.2); fadeIn(edge, t, 0.2);
      const pad = o2.pad ?? 46;
      const inner = stack(X.svg('g', {}, g), { x0: ML + pad, w: CW - 2 * pad });
      inner.y = y0 + pad;
      build(inner);
      inner._finishRule();
      const h = inner.y - y0 + (o2.padB ?? 10);
      box.setAttribute('height', h); edge.setAttribute('height', h);
      s.y = y0 + h + (o2.after ?? 34);
      return inner;
    };
    /** vertical arrow connector with a spaced caps label ("LINKED TO"), draws down in 12 f */
    s.connector = (text, t, o2 = {}) => {
      const L = o2.len ?? 150, x = (o2.x ?? X0()) + 12, y0 = s.y;
      const ln = X.svg('line', { x1: x, y1: y0, x2: x, y2: y0 + L - 12, stroke: C.orange, 'stroke-width': 3 }, g);
      X.drawOn(ln, t, 0.4, 'power2.out');
      const head = X.svg('path', { d: `M${x - 10},${y0 + L - 16} L${x + 10},${y0 + L - 16} L${x},${y0 + L} Z`, fill: C.orange }, g);
      fadeIn(head, t + 0.32, 0.08);
      const lb = uiText(g, text, x + 30, y0 + L * 0.5 + 10, 27, C.label, { weight: 600, ls: '0.3em' });
      fadeIn(lb, t + 0.12);
      s.y += L + (o2.after ?? 28);
      return { ln, head, lb };
    };
    /** stamp label: orange outlined box, light orange tint, condensed orange text, rotated −2°, slams in 4 f */
    s.stamp = (text, t, o2 = {}) => {
      const cap = o2.cap ?? 56, padX = 26, padY = 22;
      const gg = X.svg('g', {}, g);
      const tx = headText(gg, text, ML + padX, s.y + padY + cap, cap, C.orange, { shadow: true });
      const tw = width(tx) * SX;
      const r = X.svg('rect', { x: ML, y: s.y, width: tw + padX * 2, height: cap + padY * 2, fill: C.orangeTint, stroke: C.orange, 'stroke-width': 3.5 }, gg);
      gg.insertBefore(r, tx);
      gg.setAttribute('filter', X.shadow(uid('ssh'), 3, 5, 5, '#3a2310', 0.18));
      const cx = ML + (tw + padX * 2) / 2, cy = s.y + (cap + padY * 2) / 2;
      gsap.set(gg, { svgOrigin: `${cx} ${cy}`, rotation: o2.rot ?? -2.2, scale: 1.18, opacity: 0 });
      X.tl.fromTo(gg, { scale: 1.18, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.14, ease: 'power2.in', immediateRender: false }, t);
      X.tl.fromTo(gg, { scale: 1 }, { scale: 1.015, duration: 0.05, yoyo: true, repeat: 1, ease: 'sine.inOut', immediateRender: false }, t + 0.14);
      X.sfx(t + 0.12, 'stamp', { gain: 0.32 });
      s.y += cap + padY * 2 + (o2.after ?? 30);
      return gg;
    };
    return s;
  }
  DC.stack = stack;

  // ------------------------------------------------------------------ dark 3-D render insert
  /** dark panel occupying the top `h` px (default 1150) that fades to paper over its last ~300 px; crossfades in over
   *  10 f at t0 and out at tOut, with a slow 4 % push. draw(g, api) paints the render in panel coordinates. */
  DC.insert = (t0, tOut, draw, o = {}) => {
    const h = o.h ?? 1150, fadeH = o.fadeH ?? 330, topH = o.topFade ?? 250;  // fades at both ends: chrome stays on paper
    const outer = X.scene(uid('insert'), t0, tOut + T.insert + 0.02, null, DC.insertLayer);
    const mid = uid('imask');
    const lg = X.linear(uid('ilg'), [[0, '#000'], [topH / h * 0.35, '#3a3a3a'], [topH / h, '#fff'], [(h - fadeH) / h, '#fff'], [1, '#000']], 0, 0, 0, 1);
    const m = X.svg('mask', { id: mid, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: h }, X.defs);
    X.svg('rect', { x: 0, y: 0, width: W, height: h, fill: lg }, m);
    const fadeG = X.svg('g', { mask: `url(#${mid})` }, outer);
    X.svg('rect', { x: 0, y: 0, width: W, height: h, fill: X.linear(uid('ibg'), [[0, '#0a0a0b'], [0.55, '#121315'], [1, '#1c1d20']], 0, 0, 0, 1) }, fadeG);
    const push = X.svg('g', {}, fadeG);
    gsap.set(push, { svgOrigin: `${W / 2} ${h * 0.45}` });
    X.tl.fromTo(push, { scale: 1 }, { scale: o.push ?? 1.045, duration: tOut - t0 + T.insert, ease: 'none', immediateRender: false }, t0);
    draw(push, { h, t0, tOut });
    gsap.set(fadeG, { opacity: 0 });
    X.tl.fromTo(fadeG, { opacity: 0 }, { opacity: 1, duration: T.insert, ease: 'power1.inOut', immediateRender: false }, t0);
    X.tl.fromTo(fadeG, { opacity: 1 }, { opacity: 0, duration: T.insert, ease: 'power1.inOut', immediateRender: false }, tOut);
    X.sfx(t0, 'woosh_low', { gain: 0.22, dur: 0.6 });
    return push;
  };

  // ------------------------------------------------------------------ "render" illustration helpers (dark insert)
  const ill = (DC.ill = {});
  /** 3-D shaded sphere: radial gradient with an offset highlight + soft contact shadow */
  ill.sphere = (p, cx, cy, r, base, o = {}) => {
    const id = uid('sph');
    const gr = X.svg('radialGradient', { id, cx: 0.36, cy: 0.32, r: 0.75 }, X.defs);
    X.svg('stop', { offset: 0, 'stop-color': o.hi || '#ffffff', 'stop-opacity': o.hiOp ?? 0.9 }, gr);
    X.svg('stop', { offset: 0.18, 'stop-color': base }, gr);
    X.svg('stop', { offset: 0.8, 'stop-color': o.lo || '#0d0e10' }, gr);
    X.svg('stop', { offset: 1, 'stop-color': '#050506' }, gr);
    return X.svg('circle', { cx, cy, r, fill: `url(#${id})` }, p);
  };
  /** glowing point light (the red dot): core + halo; pulses between t0 and t1 */
  ill.glowDot = (p, cx, cy, t, o = {}) => {
    const g = X.svg('g', {}, p);
    const halo = X.svg('circle', { cx, cy, r: o.r ?? 34, fill: X.radial(uid('gd'), [[0, o.color || C.laser, 0.75], [0.35, o.color || C.laser, 0.25], [1, o.color || C.laser, 0]]) }, g);
    X.svg('circle', { cx, cy, r: (o.r ?? 34) * 0.16, fill: '#ffe2dc' }, g);
    gsap.set(g, { opacity: 0, svgOrigin: `${cx} ${cy}` });
    X.tl.fromTo(g, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.25, ease: 'power2.out', immediateRender: false }, t);
    if (o.pulseUntil) X.tl.fromTo(halo, { opacity: 1 }, { opacity: 0.55, duration: 0.6, yoyo: true, repeat: Math.max(1, Math.floor((o.pulseUntil - t - 0.3) / 0.6)), ease: 'sine.inOut', immediateRender: false }, t + 0.3);
    return g;
  };
  /** thin red laser line drawn along a path in `dur` s with a soft glow copy */
  ill.laser = (p, d, t, dur = 0.9, o = {}) => {
    const glow = X.svg('path', { d, fill: 'none', stroke: o.color || C.laser, 'stroke-width': 9, opacity: 0.18, 'stroke-linecap': 'round' }, p);
    const core = X.svg('path', { d, fill: 'none', stroke: o.color || C.laser, 'stroke-width': 2.4, 'stroke-linecap': 'round' }, p);
    X.drawOn(glow, t, dur, 'power1.inOut'); X.drawOn(core, t, dur, 'power1.inOut');
    return core;
  };
  /** thin red highlight box (the source's red rectangle over the "ad slot") */
  ill.redBox = (p, x, y, w, h, t, o = {}) => {
    const r = X.svg('rect', { x, y, width: w, height: h, rx: o.rx ?? 3, fill: 'rgba(216,56,44,0.06)', stroke: C.redBox, 'stroke-width': 2.4 }, p);
    fadeIn(r, t, 0.2);
    return r;
  };
  /** sparse star specks (static) */
  ill.stars = (p, n, h, seed = 4) => {
    const r = X.rand(seed);
    for (let i = 0; i < n; i++) X.svg('circle', { cx: (r() * W).toFixed(1), cy: (r() * h).toFixed(1), r: (0.6 + r() * 1.4).toFixed(2), fill: '#cfd6e0', opacity: (0.15 + r() * 0.45).toFixed(2) }, p);
  };
  /** a planet seen from orbit: limb at y = top, atmosphere glow, terminator, optional thin shell band (ozone layer) */
  ill.planetLimb = (p, o = {}) => {
    const cx = o.cx ?? W * 0.5, top = o.top ?? 600, R = o.R ?? 1500, cy = top + R;
    const g = X.svg('g', {}, p);
    // atmosphere glow (wide soft halo)
    X.svg('circle', { cx, cy, r: R + 70, fill: X.radial(uid('atm'), [[0.9, '#7fa6c4', 0], [0.955, '#8fb5d2', 0.28], [0.975, '#a9c7de', 0.12], [1, '#a9c7de', 0]]) }, g);
    // planet body: dark night side lit from the upper right
    X.svg('circle', { cx, cy, r: R, fill: X.radial(uid('pl'), [[0, '#05070a'], [0.8, '#0b1118'], [0.93, '#1a2a3a'], [0.985, '#3b5a74'], [1, '#6f93ad']], 0.62, 0.38, 0.62) }, g);
    // thin bright limb line
    X.svg('circle', { cx, cy, r: R - 1, fill: 'none', stroke: '#b8d3e6', 'stroke-width': 2.2, opacity: 0.55 }, g);
    let shell = null;
    if (o.shell) {
      const rr = R + (o.shellGap ?? 34);
      shell = X.svg('circle', { cx, cy, r: rr, fill: 'none', stroke: o.shellColor || '#7ec3d8', 'stroke-width': o.shellW ?? 14, opacity: 0.32 }, g);
      X.svg('circle', { cx, cy, r: rr, fill: 'none', stroke: '#d4eef6', 'stroke-width': 1.4, opacity: 0.6, 'stroke-dasharray': '2 9' }, g);
    }
    return { g, cx, cy, R, shell };
  };
})();
