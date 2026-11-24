/* explainer-ted-ed kit — the TED-Ed-style lesson formula on top of the explainer engine (window.X).
 *
 *   Wrapper (style-independent):  K.ident · K.epigraph · K.whiteFade · K.credits
 *   Twos:                          K.initTwos(12) → K.twos (a second paused timeline sampled at 12 fps) · K.to/fromTo/set
 *   S1 look (soft-glow pastel cel): K.look · K.field · K.stage · K.rim · K.speckle · K.label · K.labelIn · K.push
 *   S1 cast & props:               K.person (+ K.pose, K.walk, K.blink, K.mouth) · K.coccus · K.enzyme ·
 *                                  K.token · K.mold · K.dish · K.flask · K.dishStack · K.rooftops · K.bottle · K.bed · K.lamp
 *   Transitions (analysis §7):     K.brushWipe (T3) · K.inkDrop (T4) · K.slideOff (T5) · K.panelUp (T6) ·
 *                                  K.zoomThrough (T7) · K.shapeGrow (T13) · K.iris (T14) · K.dip (T15)
 *   Palettes for all five sub-styles: K.PAL.S1 … K.PAL.S5
 *
 * Everything is a pure function of time: wrapper/camera/wipes live on X.tl (on ones); character and object acting
 * goes on K.twos, which is re-sampled at floor(t*12)/12 every frame — that is what "animated on twos" means here.
 * No logos, characters or text from the source channel: the ident, badge and credits are neutral originals.
 */
(function () {
  const K = (window.K = {});
  K.FPS = 24;                       // native TED-Ed frame rate (render with --fps 24)
  K.F = (f) => f / K.FPS;           // frames → seconds
  const W = 1920, H = 1080;

  // ------------------------------------------------------------------ palettes (analysis §5b, measured hex)
  K.PAL = {
    S1: { // soft-glow pastel cel (hand-made, on twos) — used by the sample
      mauve: '#B08EAB', teal: '#B3CCCF', tealPale: '#CFD9DD', night: '#1A111F', nightDeep: '#0B001A', ochre: '#AD823F',
      sky: '#9EAED8', cream: '#EDDFD5', glow: '#FFF6EC', brick: '#A8525F', brickDark: '#7E3442', plum: '#50393E',
      cloth: '#3B3240', hot: '#E24398', sand: '#CBB98F', rose: '#8F4F5C', ink: '#2A1E2E', honey: '#E6D3A0',
    },
    S2: { // retro mid-century comic (ink outlines, paper boil, on ones)
      labDark: '#1F1E16', lab: '#423F2D', labLight: '#78765F', radar: '#559A5E', radarLight: '#85CE8D', cream: '#CECAB9',
      wood: '#AD9674', steel: '#8DA3AC', navy: '#2E3443', teal: '#5C9393', teal2: '#71ADAC', teal3: '#8CC5BE',
      parchment: '#DAD0B2', red: '#C65D61', ink: '#2A2018',
    },
    S3: { // painted multiplane / mixed media (gouache cut-outs, depth of field, on twos)
      murk: '#48553E', murk2: '#7D855D', murk3: '#5B674A', water: '#5B7D8D', water2: '#486373', deep: '#1F2A29',
      deepest: '#0D100E', diagram: '#4BD0DF', diagram2: '#216EB6', diagramWhite: '#D7FCFD', bank: '#281A12', cell: '#846F35',
    },
    S4: { // geometric flat motion graphics (no texture, on ones, long holds)
      lavender: '#C190F9', purple: '#5600AC', blue: '#3F54F7', magenta: '#EC14CE', red: '#D31C2C', yellow: '#FADB2E',
      orange: '#DA8537', ink: '#1D181C', white: '#F5F5F7',
    },
    S5: { // isometric neon 2.5D (bloom, fly-through, on ones)
      indigo: '#30397F', indigo2: '#5464AC', indigo3: '#8399CA', navy: '#14153F', void: '#070542', violet: '#4423AF',
      violet2: '#7746D2', violet3: '#A575DA', circuit: '#1E5A4F', circuit2: '#45916F', heat: '#C9302C', heat2: '#F3B777',
      magenta: '#7E2663',
    },
  };

  // ------------------------------------------------------------------ twos
  /** A second paused timeline sampled on twos (12 fps at 24 fps). Put every character/object tween on it. */
  K.initTwos = (fps = 12) => {
    K.twosFps = fps;
    K.twos = gsap.timeline({ paused: true, defaults: { ease: 'power2.inOut', duration: K.F(8) } });
    X.every((t) => K.twos.seek(Math.floor(t * fps + 1e-6) / fps, false));
    return K.twos;
  };
  K.to = (el, v, t) => K.twos.to(el, v, t);
  K.fromTo = (el, a, b, t) => K.twos.fromTo(el, a, b, t);

  // ------------------------------------------------------------------ helpers
  const S = (tag, attrs, parent) => X.svg(tag, attrs, parent);
  const cache = {};
  K.paper = (color, strength = 0.07, seed = 3) => {
    const k = color + strength + seed;
    return cache[k] || (cache[k] = X.paper(color, 960, 540, strength, seed));
  };
  /** Rim glow (S1): cream halo around the silhouette — dilate + blur + flood, merged under the source. */
  K.rim = (id = 'rim', color = '#FFF6EC', r = 3, blur = 5, op = 0.9) => {
    if (document.getElementById(id)) return `url(#${id})`;
    const f = S('filter', { id, x: '-25%', y: '-25%', width: '150%', height: '150%' }, X.defs);
    S('feMorphology', { in: 'SourceAlpha', operator: 'dilate', radius: r, result: 'd' }, f);
    S('feGaussianBlur', { in: 'd', stdDeviation: blur, result: 'b' }, f);
    S('feFlood', { 'flood-color': color, 'flood-opacity': op, result: 'c' }, f);
    S('feComposite', { in: 'c', in2: 'b', operator: 'in', result: 'g' }, f);
    const m = S('feMerge', {}, f);
    S('feMergeNode', { in: 'g' }, m); S('feMergeNode', { in: 'SourceGraphic' }, m);
    return `url(#${id})`;
  };
  /** X.glow with an id cache (safe to call in loops). */
  K.glow = (id, std = 12, color = '#ffffff', strength = 1) => (document.getElementById(id) ? `url(#${id})` : X.glow(id, std, color, strength));
  /** Soft blur (depth/haze) filter. */
  K.blur = (id, std) => {
    if (document.getElementById(id)) return `url(#${id})`;
    const f = S('filter', { id, x: '-30%', y: '-30%', width: '160%', height: '160%' }, X.defs);
    S('feGaussianBlur', { stdDeviation: std }, f);
    return `url(#${id})`;
  };
  /** Speckled watercolour fill (S1 bacteria, painted grounds): pattern of seeded dots over a base colour. */
  K.speckle = (id, base, dot, o = {}) => {
    if (document.getElementById(id)) return `url(#${id})`;
    const size = o.size || 90, n = o.n || 60, r = X.rand(o.seed || 11);
    const p = S('pattern', { id, width: size, height: size, patternUnits: 'userSpaceOnUse' }, X.defs);
    S('rect', { width: size, height: size, fill: base }, p);
    for (let i = 0; i < n; i++) {
      const rr = (o.rmin || 1.2) + r() * ((o.rmax || 3.6) - (o.rmin || 1.2));
      S('circle', { cx: (r() * size).toFixed(1), cy: (r() * size).toFixed(1), r: rr.toFixed(1), fill: r() < 0.25 && o.light ? o.light : dot, opacity: (0.35 + r() * 0.5).toFixed(2) }, p);
    }
    return `url(#${id})`;
  };

  // ------------------------------------------------------------------ look (S1)
  /** Film grain + vignette + (optional) line boil. Call once after K.initTwos. Returns {boil, rim, vignette}. */
  K.look = (o = {}) => {
    const grain = X.grain(o.grain ?? 0.11, 12, 'overlay');
    grain.style.backgroundSize = `${o.grainPx ?? 768}px`; // 2-px grains ~ the clumpy grain of a 480p source
    const vig = X.html('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none', zIndex: 45,
      background: `radial-gradient(ellipse 75% 70% at 50% 47%, rgba(255,246,236,${o.bloom ?? 0.05}) 0%, rgba(0,0,0,0) 48%, rgba(${o.vigRGB || '24,10,30'},${o.vignette ?? 0.42}) 100%)` } });
    gsap.set([grain, vig], { opacity: 0 });
    const on = o.from ?? 5.8;
    X.tl.set(grain, { opacity: o.grain ?? 0.11 }, on);
    X.tl.set(vig, { opacity: 1 }, on);
    return { boil: X.boil('boil', o.boilScale ?? 2.4, 12, 0.022), rim: K.rim(), vignette: vig, grain };
  };
  /** Full-frame colour field with painted paper texture. Put it inside a camera group (it carries 12 % bleed). */
  K.field = (parent, color, o = {}) => {
    S('rect', { x: -260, y: -150, width: W + 520, height: H + 300, fill: color }, parent);
    if (o.paper !== false) S('image', { href: K.paper(color, o.strength ?? 0.08, o.seed ?? 3), x: -260, y: -150, width: W + 520, height: H + 300, preserveAspectRatio: 'none', opacity: o.paperOp ?? 1 }, parent);
    return parent;
  };
  /** A lesson "set": X.scene + static field + camera group. Returns {g, cam}. */
  K.stage = (name, t0, t1, color, o = {}) => {
    const g = X.scene(name, t0, t1, null, o.parent || K.layer || X.root);
    const cam = X.cam(S('g', {}, g));
    K.field(cam, color, o);
    return { g, cam };
  };
  /** Slow push/drift through a hold (analysis §7 camera habits: 2–6 % over a sentence, sine.inOut). */
  K.push = (cam, t0, t1, o = {}) => {
    X.tl.fromTo(cam, { scale: o.from ?? 1, x: o.x0 ?? 0, y: o.y0 ?? 0 },
      { scale: o.to ?? 1.04, x: o.x1 ?? 0, y: o.y1 ?? 0, duration: Math.max(0.1, t1 - t0), ease: o.ease || 'sine.inOut', immediateRender: false }, t0);
  };

  /** Drifting motes / spores / dust (idle life, 1-3 % of frame width per second), soft circles on twos. */
  K.motes = (parent, t0, t1, o = {}) => {
    const r = X.rand(o.seed || 3), g = S('g', { opacity: o.opacity ?? 0.6 }, parent);
    const box = o.box || [0, 0, W, H];
    for (let i = 0; i < (o.n ?? 18); i++) {
      const x = box[0] + r() * box[2], y = box[1] + r() * box[3], rad = (o.rmin ?? 3) + r() * ((o.rmax ?? 8) - (o.rmin ?? 3));
      const m = S('circle', { cx: x, cy: y, r: rad, fill: o.color || '#FFF6EC', filter: o.glow === false ? undefined : K.glow('moteGlow', 3, o.color || '#FFF6EC', 0.7) }, g);
      const sp = (o.speed ?? 30) * (0.6 + r() * 0.8), a = (o.angle ?? -90) * Math.PI / 180 + (r() - 0.5) * 0.9, d = sp * (t1 - t0);
      K.twos.fromTo(m, { x: 0, y: 0, opacity: 0.3 + r() * 0.7 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, opacity: 0.2 + r() * 0.8, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
    }
    return g;
  };

  // ------------------------------------------------------------------ hand-lettered label (in the art style)
  K.label = (parent, text, o = {}) => {
    const g = S('g', { transform: `translate(${o.x ?? 960},${o.y ?? 900})` }, parent);
    const inner = S('g', { filter: o.boil === false ? undefined : 'url(#boil)' }, g);
    const t = S('text', { x: 0, y: 0, 'text-anchor': o.anchor || 'middle', 'font-family': o.font || 'Oswald', 'font-weight': o.weight ?? 300,
      'font-size': o.size ?? 96, 'letter-spacing': o.spacing ?? 4, fill: o.color || '#FFF6EC', filter: o.glow === false ? undefined : K.glow('labelGlow', 6, '#FFF6EC', 0.75), text }, inner);
    gsap.set(g, { opacity: 0 });
    return g;
  };
  /** Label lands: 0.9 → 1 scale + fade over 8 frames (on twos). */
  K.labelIn = (g, t, o = {}) => {
    K.twos.fromTo(g, { opacity: 0, scale: 0.9, transformOrigin: '50% 50%' }, { opacity: 1, scale: 1, duration: K.F(o.frames ?? 8), ease: 'power2.out' }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'sparkle', { gain: o.gain ?? 0.22 });
  };

  // ------------------------------------------------------------------ characters (S1 construction)
  // Person: head ≈ 40 % of height, one-shape body, 1-segment noodle legs, 2-segment noodle arms, round knob ends,
  // dot eyes. Built at 400 px tall with feet at (0,0); joints are nested <g> so every rotation is about a joint.
  K.person = (parent, o = {}) => {
    const c = Object.assign({ skin: '#EDDFD5', coat: '#F4EFEA', cloth: '#3B3240', hair: '#8C7B6B', eye: '#2A1E2E', shoe: '#2E2430', tie: '#50393E', cheek: '#D98C8C' }, o.colors);
    const hgt = o.h || 400, sc = hgt / 400, face = o.face ?? 1; // face: 1 right, -1 left, 0 front
    const place = S('g', { transform: `translate(${o.x ?? 960},${o.y ?? 900}) scale(${sc * (o.flip ? -1 : 1)},${sc})` }, parent);
    const boilG = S('g', { filter: o.boil === false ? undefined : 'url(#boil)' }, place);
    const glowG = S('g', { filter: o.rim === false ? undefined : K.rim() }, boilG);
    const body = S('g', {}, glowG); // whole-body bob/lean/travel (origin = feet)
    gsap.set(body, { svgOrigin: '0 0' });
    const joint = (p, x, y) => { const j = S('g', { transform: `translate(${x},${y})` }, p); const r = S('g', {}, j); gsap.set(r, { svgOrigin: '0 0' }); return r; };
    const noodle = (p, len, col, w, knob, knobCol) => {
      S('path', { d: `M0,0 L0,${len}`, stroke: col, 'stroke-width': w, 'stroke-linecap': 'round', fill: 'none' }, p);
      if (knob) S('circle', { cx: 0, cy: len, r: knob, fill: knobCol || col }, p);
    };
    // legs (behind the coat)
    const legL = joint(body, -20, -132), legR = joint(body, 20, -132);
    noodle(legL, 126, c.cloth, 17); noodle(legR, 126, c.cloth, 17);
    S('ellipse', { cx: 8 * (face || 1), cy: 128, rx: 17, ry: 10, fill: c.shoe }, legL);
    S('ellipse', { cx: 8 * (face || 1), cy: 128, rx: 17, ry: 10, fill: c.shoe }, legR);
    // back arm
    const armB = joint(body, -34 * (face || 1), -236);
    noodle(armB, 64, o.sleeve || c.coat, 15);
    const foreB = joint(armB, 0, 64); noodle(foreB, 60, o.sleeve || c.coat, 15, 12, c.skin);
    // torso (coat / tunic): one shape
    const torso = S('g', {}, body);
    S('path', { d: 'M-40,-252 Q0,-262 40,-252 L58,-118 Q0,-104 -58,-118 Z', fill: o.torso || c.coat }, torso);
    if (o.coat !== false) {
      S('path', { d: 'M-4,-248 L-14,-150 M4,-248 L14,-150', stroke: '#D8CFC8', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' }, torso);
      S('path', { d: 'M-15,-250 L0,-238 L15,-250', stroke: c.cloth, 'stroke-width': 9, fill: 'none', 'stroke-linejoin': 'round' }, torso);
    }
    if (o.bowtie) S('path', { d: 'M-16,-252 L-16,-236 L0,-244 L16,-236 L16,-252 L0,-244 Z', fill: c.tie }, torso);
    // head on the neck joint
    const head = joint(body, 0, -248);
    S('circle', { cx: 0, cy: -80, r: 80, fill: c.skin }, head);
    if (o.hair !== false) S('path', { d: o.hairD || `M-74,-104 Q-70,-168 0,-162 Q66,-160 78,-106 Q52,-138 6,-132 Q-40,-136 -74,-104 Z`, fill: c.hair }, head);
    const eyes = S('g', {}, head);
    gsap.set(eyes, { svgOrigin: `${16 * face} -86` });
    S('circle', { cx: -16 + 26 * face, cy: -86, r: 7, fill: c.eye }, eyes);
    S('circle', { cx: 18 + 26 * face, cy: -86, r: 7, fill: c.eye }, eyes);
    if (face) S('path', { d: `M${50 * face},-82 q${14 * face},6 ${2 * face},16`, stroke: '#D9C3B4', 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }, head);
    S('circle', { cx: -26 + 30 * face, cy: -58, r: 9, fill: c.cheek, opacity: 0.45 }, head);
    const mouths = {};
    const mouth = (k, d, fill) => { mouths[k] = S('path', { d, stroke: c.eye, 'stroke-width': 4.5, fill: fill || 'none', 'stroke-linecap': 'round', opacity: k === (o.mouth || 'smile') ? 1 : 0 }, head); };
    const mx = 6 + 22 * face;
    mouth('smile', `M${mx - 14},-50 Q${mx},-40 ${mx + 14},-50`);
    mouth('flat', `M${mx - 12},-46 L${mx + 12},-46`);
    mouth('oh', `M${mx},-52 a7,8 0 1,0 0.1,0`, c.eye);
    mouth('worry', `M${mx - 14},-44 q7,-6 14,0 q7,6 14,0`);
    // front arm
    const armF = joint(body, 36 * (face || 1), -236);
    noodle(armF, 64, o.sleeve || c.coat, 15);
    const foreF = joint(armF, 0, 64); noodle(foreF, 60, o.sleeve || c.coat, 15, 12, c.skin);
    const handF = S('g', { transform: 'translate(0,60)' }, foreF); // attach props to the front hand
    const rig = { place, body, head, eyes, legL, legR, armB, foreB, armF, foreF, handF, mouths, torso, face };
    // rest pose: arms hang slightly out
    gsap.set(armF, { rotation: -8 * (face || 1) }); gsap.set(armB, { rotation: 8 * (face || 1) });
    gsap.set(foreF, { rotation: -6 * (face || 1) }); gsap.set(foreB, { rotation: 6 * (face || 1) });
    return rig;
  };
  /** Pose-to-pose on twos: {armF, foreF, armB, foreB, head, legL, legR, lean, y, x} in degrees / px. */
  K.pose = (rig, t, p, o = {}) => {
    const d = K.F(o.frames ?? 8), e = o.ease || 'power2.inOut', f = rig.face || 1;
    const map = { armF: 'armF', foreF: 'foreF', armB: 'armB', foreB: 'foreB', head: 'head', legL: 'legL', legR: 'legR' };
    for (const k in map) if (p[k] != null) K.twos.to(rig[map[k]], { rotation: p[k] * f, duration: d, ease: e }, t);
    if (p.lean != null || p.y != null || p.x != null) K.twos.to(rig.body, { rotation: (p.lean ?? 0) * f, y: p.y ?? 0, x: p.x ?? 0, duration: d, ease: e }, t);
    if (p.mouth) K.mouth(rig, t + d * 0.5, p.mouth);
  };
  K.mouth = (rig, t, k) => { for (const m in rig.mouths) K.twos.set(rig.mouths[m], { opacity: m === k ? 1 : 0 }, t); };
  /** Blinks: eyes squash for 2 frames at each time. */
  K.blink = (rig, times) => times.forEach((t) => { K.twos.set(rig.eyes, { scaleY: 0.12 }, t); K.twos.set(rig.eyes, { scaleY: 1 }, t + K.F(3)); });
  /** Walk cycle on twos from t0 to t1, travelling dx px (in the rig's local units). */
  K.walk = (rig, t0, t1, o = {}) => {
    const step = o.step ?? 0.42, a = o.swing ?? 22, n = Math.max(1, Math.round((t1 - t0) / step));
    for (let i = 0; i < n; i++) {
      const t = t0 + i * step, s = i % 2 ? 1 : -1;
      K.twos.fromTo(rig.legL, { rotation: -a * s }, { rotation: a * s, duration: step, ease: 'sine.inOut', immediateRender: false }, t);
      K.twos.fromTo(rig.legR, { rotation: a * s }, { rotation: -a * s, duration: step, ease: 'sine.inOut', immediateRender: false }, t);
      if (!o.holdFront) K.twos.fromTo(rig.armF, { rotation: a * 0.7 * s }, { rotation: -a * 0.7 * s, duration: step, ease: 'sine.inOut', immediateRender: false }, t);
      if (!o.holdBack) K.twos.fromTo(rig.armB, { rotation: -a * 0.7 * s }, { rotation: a * 0.7 * s, duration: step, ease: 'sine.inOut', immediateRender: false }, t);
      K.twos.fromTo(rig.body, { y: 0 }, { y: -7, duration: step / 2, ease: 'sine.out', yoyo: true, repeat: 1, immediateRender: false }, t);
    }
    // travel: dx in the rig's design units (400 = body height); tweened on the body group, never on `place`
    if (o.dx) K.twos.fromTo(rig.body, { x: o.x0 ?? 0 }, { x: (o.x0 ?? 0) + o.dx, duration: t1 - t0, ease: 'none', immediateRender: false }, t0);
  };

  /** Coccus bacterium (round, speckled, darker wall ring, dot-eye face). */
  K.coccus = (parent, o = {}) => {
    const r = o.r ?? 60, g = S('g', { transform: `translate(${o.x ?? 0},${o.y ?? 0})` }, parent);
    const bo = S('g', { filter: o.boil === false ? undefined : 'url(#boil)' }, g);
    const body = S('g', { filter: o.glow === false ? undefined : K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, bo);
    gsap.set(body, { svgOrigin: '0 0' });
    const fill = K.speckle('spBrick', o.fill || '#A8525F', '#6E2C3A', { light: '#C9787F', n: 70, seed: 21 });
    S('circle', { r, fill }, body);
    const wall = S('circle', { r: r * 0.94, fill: 'none', stroke: o.wall || '#7E3442', 'stroke-width': r * 0.12 }, body);
    S('ellipse', { cx: -r * 0.35, cy: -r * 0.38, rx: r * 0.28, ry: r * 0.16, fill: '#F2C9C4', opacity: 0.35, transform: 'rotate(-30)' }, body);
    const face = S('g', {}, body);
    const mouths = {};
    if (o.face !== false) {
      const e = r * 0.13, ex = r * 0.28;
      [-ex, ex].forEach((x) => { S('circle', { cx: x, cy: -r * 0.08, r: e * 1.25, fill: '#FFF6EC' }, face); S('circle', { cx: x + e * 0.25, cy: -r * 0.06, r: e * 0.65, fill: '#2A1E2E' }, face); });
      const m = (k, d) => { mouths[k] = S('path', { d, stroke: '#2A1E2E', 'stroke-width': Math.max(2.5, r * 0.05), fill: 'none', 'stroke-linecap': 'round', opacity: k === (o.mouth || 'smile') ? 1 : 0 }, face); };
      m('smile', `M${-r * 0.2},${r * 0.25} Q0,${r * 0.38} ${r * 0.2},${r * 0.25}`);
      m('worry', `M${-r * 0.22},${r * 0.32} q${r * 0.11},-${r * 0.09} ${r * 0.22},0 q${r * 0.11},${r * 0.09} ${r * 0.22},0`);
      m('oh', `M0,${r * 0.22} a${r * 0.09},${r * 0.11} 0 1,0 0.1,0`);
      m('zig', `M${-r * 0.24},${r * 0.3} l${r * 0.12},-${r * 0.08} l${r * 0.12},${r * 0.08} l${r * 0.12},-${r * 0.08} l${r * 0.12},${r * 0.08}`);
    }
    return { g, body, wall, face, mouths, r };
  };
  K.mouthOf = (obj, t, k) => { for (const m in obj.mouths) K.twos.set(obj.mouths[m], { opacity: m === k ? 1 : 0 }, t); };

  /** Enzyme: cream blob with a square notch (active site) facing right, dot eyes, two noodle arms with knobs. */
  K.enzyme = (parent, o = {}) => {
    const R = o.r ?? 90, g = S('g', { transform: `translate(${o.x ?? 0},${o.y ?? 0}) scale(${o.flip ? -1 : 1},1)` }, parent);
    const bo = S('g', { filter: o.boil === false ? undefined : 'url(#boil)' }, g);
    const glowG = S('g', { filter: K.rim() }, bo);
    const body = S('g', {}, glowG); gsap.set(body, { svgOrigin: '0 0' });
    const n = R * 0.3, nx = R * 0.32; // notch half-height, inner x
    const ex = Math.sqrt(R * R - n * n);
    const arms = [];
    // arms sit above and below the notch and reach forward, so a clamp (top +deg, bottom −deg) closes on the notch
    [[0.42, -1], [0.42, 1]].forEach(([ax, s]) => {
      const j = S('g', { transform: `translate(${R * ax},${s * R * 0.8})` }, body); const a = S('g', {}, j); gsap.set(a, { svgOrigin: '0 0' });
      S('path', { d: `M0,0 Q${R * 0.3},${s * R * 0.12} ${R * 0.5},${s * R * 0.32}`, stroke: o.color || '#EDDFD5', 'stroke-width': R * 0.12, 'stroke-linecap': 'round', fill: 'none' }, a);
      S('circle', { cx: R * 0.5, cy: s * R * 0.32, r: R * 0.1, fill: '#FFF6EC' }, a);
      arms.push(a);
    });
    S('path', { d: `M${ex},${-n} A${R},${R} 0 1,0 ${ex},${n} L${nx},${n} L${nx},${-n} Z`, fill: o.color || '#EDDFD5' }, body);
    S('path', { d: `M${nx + 6},${-n + 6} L${nx + 6},${n - 6}`, stroke: '#D7C3B5', 'stroke-width': 5, 'stroke-linecap': 'round' }, body);
    const eyes = S('g', {}, body); gsap.set(eyes, { svgOrigin: `${-R * 0.2} ${-R * 0.35}` });
    S('circle', { cx: -R * 0.42, cy: -R * 0.35, r: R * 0.075, fill: '#2A1E2E' }, eyes);
    S('circle', { cx: -R * 0.08, cy: -R * 0.38, r: R * 0.075, fill: '#2A1E2E' }, eyes);
    const mouths = {};
    const m = (k, d) => { mouths[k] = S('path', { d, stroke: '#2A1E2E', 'stroke-width': R * 0.045, fill: 'none', 'stroke-linecap': 'round', opacity: k === 'smile' ? 1 : 0 }, body); };
    m('smile', `M${-R * 0.42},${-R * 0.12} Q${-R * 0.26},${R * 0.02} ${-R * 0.1},${-R * 0.12}`);
    m('zig', `M${-R * 0.46},${-R * 0.08} l${R * 0.09},-${R * 0.07} l${R * 0.09},${R * 0.07} l${R * 0.09},-${R * 0.07} l${R * 0.09},${R * 0.07}`);
    m('oh', `M${-R * 0.26},${-R * 0.12} a${R * 0.06},${R * 0.075} 0 1,0 0.1,0`);
    return { g, body, eyes, arms, mouths, R, notch: { x: nx, h: n * 2 } };
  };
  /** A building-block token with a square head of side a (the shape an enzyme notch fits). kind: 'link' | 'drug'. */
  K.token = (parent, o = {}) => {
    const a = o.a ?? 54, g = S('g', { transform: `translate(${o.x ?? 0},${o.y ?? 0})` }, parent);
    const inner = S('g', {}, g); gsap.set(inner, { svgOrigin: '0 0' });
    if (o.kind === 'drug') {
      const col = o.color || '#E24398';
      const gl = S('g', { filter: K.glow('hotGlow', 9, '#FF8CC6', 0.8) }, inner);
      // β-lactam square fused to a 5-ring: the real shape of penicillin's core (no side chain, so it never reads as a juice box)
      S('rect', { x: 0, y: -a / 2, width: a, height: a, rx: 6, fill: col }, gl);
      const p = [[a, -a / 2], [a + a * 0.78, -a * 0.72], [a + a * 1.25, 0], [a + a * 0.78, a * 0.72], [a, a / 2]];
      S('path', { d: 'M' + p.map((q) => q.join(',')).join('L') + 'Z', fill: col, 'stroke-linejoin': 'round' }, gl);
      S('rect', { x: a * 0.14, y: -a * 0.36, width: a * 0.72, height: a * 0.72, rx: 4, fill: 'none', stroke: '#FFC4E2', 'stroke-width': 3, opacity: 0.8 }, gl);
      if (o.face !== false) { S('circle', { cx: a * 1.05, cy: -a * 0.08, r: a * 0.08, fill: '#2A1E2E' }, inner); S('circle', { cx: a * 1.42, cy: -a * 0.08, r: a * 0.08, fill: '#2A1E2E' }, inner); }
    } else {
      const col = o.color || '#D9B98A';
      S('rect', { x: 0, y: -a / 2, width: a, height: a, rx: 6, fill: col }, inner);
      S('path', { d: `M${a},0 L${a + (o.tail ?? 70)},0`, stroke: col, 'stroke-width': a * 0.24, 'stroke-linecap': 'round' }, inner);
    }
    return { g, inner, a };
  };
  /** Mold colony: cotton-wool blob of overlapping discs + radiating hyphae with spore knobs. */
  K.mold = (parent, o = {}) => {
    const r = o.r ?? 80, rnd = X.rand(o.seed || 5), g = S('g', { transform: `translate(${o.x ?? 0},${o.y ?? 0})` }, parent);
    const inner = S('g', { filter: K.glow('moldGlow', 8, '#F4F8EC', 0.55) }, g); gsap.set(inner, { svgOrigin: '0 0' });
    for (let i = 0; i < 22; i++) {
      const a = rnd() * Math.PI * 2, d = r * (0.75 + rnd() * 0.5);
      S('path', { d: `M0,0 Q${Math.cos(a + 0.4) * d * 0.5},${Math.sin(a + 0.4) * d * 0.5} ${Math.cos(a) * d},${Math.sin(a) * d}`, stroke: o.hypha || '#CFDCC4', 'stroke-width': 2.5, fill: 'none', opacity: 0.8 }, inner);
      S('circle', { cx: Math.cos(a) * d, cy: Math.sin(a) * d, r: 3 + rnd() * 3, fill: '#EEF3E6' }, inner);
    }
    for (let i = 0; i < 26; i++) {
      const a = rnd() * Math.PI * 2, d = rnd() * r * 0.55;
      S('circle', { cx: Math.cos(a) * d, cy: Math.sin(a) * d, r: r * (0.18 + rnd() * 0.22), fill: i < 8 ? (o.core || '#93A88F') : (rnd() < 0.5 ? '#DDE6D0' : '#C6D4BD'), opacity: 0.92 }, inner);
    }
    return { g, inner, r };
  };
  /** Petri dish seen from above: glass rim with glow, agar disc, seeded colonies (returned with their positions). */
  K.dish = (parent, o = {}) => {
    const r = o.r ?? 360, g = S('g', { transform: `translate(${o.x ?? 960},${o.y ?? 540})` }, parent);
    S('circle', { r: r + 16, fill: '#000', opacity: 0.16, transform: 'translate(10,16)' }, g);
    S('circle', { r: r + 14, fill: '#F3F1EC', opacity: 0.55, filter: K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, g);
    S('circle', { r, fill: K.speckle('spAgar', o.agar || '#E6D3A0', '#C9B27A', { n: 40, seed: 31, rmax: 2.6 }) }, g);
    S('circle', { r: r - 6, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 4, opacity: 0.5 }, g);
    S('path', { d: `M${-r * 0.7},${-r * 0.5} A${r * 0.86},${r * 0.86} 0 0,1 ${r * 0.1},${-r * 0.84}`, stroke: '#FFFFFF', 'stroke-width': 10, fill: 'none', opacity: 0.35, 'stroke-linecap': 'round' }, g);
    const cols = [], rnd = X.rand(o.seed || 9), colG = S('g', {}, g);
    const avoid = o.avoid || { x: 0, y: 0, r: 0 };
    for (let i = 0; cols.length < (o.n ?? 70) && i < 4000; i++) {
      const a = rnd() * Math.PI * 2, d = Math.sqrt(rnd()) * (r - 40), x = Math.cos(a) * d, y = Math.sin(a) * d;
      if (Math.hypot(x - avoid.x, y - avoid.y) < avoid.r) continue;
      if (cols.some((c) => Math.hypot(c.x - x, c.y - y) < 34)) continue;
      const cr = 9 + rnd() * 9;
      const c = S('circle', { cx: x, cy: y, r: cr, fill: K.speckle('spBrick', '#A8525F', '#6E2C3A', { light: '#C9787F', n: 70, seed: 21 }) }, colG);
      cols.push({ el: c, x, y, r: cr, d: Math.hypot(x - avoid.x, y - avoid.y) });
    }
    return { g, r, cols };
  };
  /** Lab glassware & props (S1: no outlines, translucent glass with a cream rim glow). */
  K.flask = (parent, o = {}) => {
    const s = o.s ?? 1, g = S('g', { transform: `translate(${o.x},${o.y}) scale(${s})`, filter: K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, parent);
    S('path', { d: 'M-16,-150 L-16,-90 L-62,0 Q-66,10 -54,10 L54,10 Q66,10 62,0 L16,-90 L16,-150 Z', fill: '#EEF4F2', opacity: 0.55 }, g);
    S('path', { d: 'M-40,-40 L-62,0 Q-66,10 -54,10 L54,10 Q66,10 62,0 L40,-40 Z', fill: o.liquid || '#C9787F', opacity: 0.85 }, g);
    S('rect', { x: -22, y: -158, width: 44, height: 12, rx: 5, fill: '#F6F3EE' }, g);
    return g;
  };
  K.dishStack = (parent, o = {}) => {
    const g = S('g', { transform: `translate(${o.x},${o.y}) scale(${o.s ?? 1})`, filter: K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, parent);
    const rnd = X.rand(o.seed || 4);
    for (let i = 0; i < (o.n ?? 5); i++) {
      const dx = (rnd() - 0.5) * 14;
      S('rect', { x: -80 + dx, y: -22 * (i + 1), width: 160, height: 18, rx: 7, fill: '#EEF4F2', opacity: 0.8 }, g);
      S('rect', { x: -72 + dx, y: -22 * (i + 1) + 5, width: 144, height: 8, rx: 4, fill: i % 2 ? '#E6D3A0' : '#DCC58E' }, g);
    }
    return g;
  };
  K.bottle = (parent, o = {}) => {
    const g = S('g', { transform: `translate(${o.x},${o.y}) scale(${o.s ?? 1})` }, parent);
    S('path', { d: 'M-28,0 L-28,-80 Q-28,-96 -14,-100 L-14,-118 L14,-118 L14,-100 Q28,-96 28,-80 L28,0 Q28,8 20,8 L-20,8 Q-28,8 -28,0 Z', fill: '#EEF4F2', opacity: 0.7 }, g);
    S('path', { d: 'M-24,-50 L24,-50 L24,0 Q24,4 18,4 L-18,4 Q-24,4 -24,0 Z', fill: o.liquid || '#E24398', opacity: 0.9 }, g);
    S('rect', { x: -17, y: -132, width: 34, height: 16, rx: 4, fill: o.cap || '#50393E' }, g);
    S('rect', { x: -22, y: -42, width: 44, height: 22, rx: 3, fill: '#FFF6EC', opacity: 0.85 }, g);
    return g;
  };
  K.bed = (parent, o = {}) => {
    const g = S('g', { transform: `translate(${o.x},${o.y}) scale(${o.s ?? 1})` }, parent);
    S('rect', { x: -330, y: -10, width: 660, height: 40, rx: 10, fill: '#E9E4DE' }, g);
    S('rect', { x: -330, y: 30, width: 18, height: 130, fill: '#8C8296' }, g); S('rect', { x: 312, y: 30, width: 18, height: 130, fill: '#8C8296' }, g);
    S('path', { d: 'M-330,-10 L-330,-150 Q-330,-170 -310,-170 L-300,-170 L-300,-10 Z', fill: '#8C8296' }, g);
    return g;
  };
  K.lamp = (parent, o = {}) => {
    const g = S('g', { transform: `translate(${o.x},${o.y}) scale(${o.s ?? 1})` }, parent);
    S('path', { d: 'M-60,0 L60,0 L50,-16 L-50,-16 Z', fill: o.color || '#3B3240' }, g);
    S('path', { d: 'M0,-16 L-30,-170 L40,-240', stroke: o.color || '#3B3240', 'stroke-width': 12, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, g);
    S('path', { d: 'M20,-270 L90,-200 L110,-150 L10,-230 Z', fill: o.color || '#3B3240' }, g);
    return g;
  };
  /** Row of rooftops + chimneys (seeded skyline silhouette). Returns {g, windows:[]} — windows can glow on. */
  K.rooftops = (parent, o = {}) => {
    const rnd = X.rand(o.seed || 2), g = S('g', {}, parent), y = o.y ?? 760, col = o.color || '#50393E';
    let x = (o.x0 ?? -260), d = `M${x},${H + 200}`;
    const windows = [];
    while (x < (o.x1 ?? W + 260)) {
      const w = 110 + rnd() * 160, h = (o.hmin ?? 80) + rnd() * (o.hvar ?? 140), top = y - h, roof = rnd() < 0.55;
      d += ` L${x},${top}`;
      if (roof) d += ` L${x + w / 2},${top - 40 - rnd() * 30} L${x + w},${top}`; else d += ` L${x + w},${top}`;
      if (rnd() < 0.7) { const cx = x + w * (0.2 + rnd() * 0.5), ch = 34 + rnd() * 30; S('rect', { x: cx, y: top - ch - (roof ? 18 : 0), width: 22, height: ch + 20, fill: col }, g); S('rect', { x: cx - 4, y: top - ch - (roof ? 18 : 0) - 8, width: 30, height: 10, fill: col }, g); }
      if (o.windows) for (let k = 0; k < 3; k++) if (rnd() < 0.45) windows.push(S('rect', { x: x + 18 + k * (w / 3.2), y: top + 26 + rnd() * 30, width: 18, height: 26, rx: 2, fill: o.windowColor || '#F3D9A4', opacity: 0 }, g));
      x += w;
    }
    S('path', { d: d + ` L${x},${H + 200} Z`, fill: col }, g);
    windows.forEach((wd) => g.appendChild(wd));
    return { g, windows };
  };

  // ------------------------------------------------------------------ wrapper (analysis §3 fixed timings)
  const html = (attrs, style) => X.html('div', Object.assign({ style: Object.assign({ position: 'absolute', zIndex: 60, pointerEvents: 'none' }, style) }, attrs));
  /** Neutral original ident on white, 0 → ~1.21 s (29 frames). Static centred wordmark (box ≈ 41 % of width). */
  K.ident = (o = {}) => {
    const d = html({}, { inset: '0', background: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' });
    const col = o.color || '#1E7F7A';
    d.innerHTML = `<div style="display:flex;align-items:center;gap:26px">
      <svg width="132" height="132" viewBox="-66 -66 132 132"><circle r="62" fill="${col}"/>
        <path d="M0,-34 C14,-16 20,-4 20,8 A20,20 0 0,1 -20,8 C-20,-4 -12,-14 0,-34 Z" fill="#FFF6EC"/>
        <rect x="-16" y="30" width="32" height="8" rx="3" fill="#FFF6EC"/></svg>
      <div style="font-family:Montserrat;line-height:1;color:#2B2B2B">
        <div style="font-weight:800;font-size:92px;letter-spacing:-1px">${o.name || 'LAMPLIGHT'}</div>
        <div style="font-weight:500;font-size:27px;letter-spacing:11px;margin-top:10px;color:${col}">${o.sub || 'LESSONS · ONE QUESTION AT A TIME'}</div></div></div>`;
    X.tl.set(d, { autoAlpha: 0 }, o.t1 ?? 1.21);
    return d;
  };
  /** Epigraph card: thin grey sans quote (Inter 300, 66 px, #4C4C4C, line pitch 1.6) centred at y≈46 %, attribution 26 px #8C8C8C with italic work. */
  K.epigraph = (o) => {
    const d = html({}, { inset: '0', background: '#FFFFFF' });
    const lines = o.lines.map((l) => `<div>${l}</div>`).join('');
    d.innerHTML = `<div style="position:absolute;left:0;right:0;top:${(o.cy ?? 0.46) * H}px;transform:translateY(-50%);text-align:center;font-family:Inter;color:#4C4C4C">
      <div style="font-weight:300;font-size:${o.size ?? 66}px;line-height:1.6">${lines}</div>
      <div style="font-weight:400;font-size:26px;color:#8C8C8C;margin-top:30px">– ${o.author}${o.work ? `, <i>${o.work}</i>` : ''}</div></div>`;
    gsap.set(d, { autoAlpha: 0 });
    X.tl.set(d, { autoAlpha: 1 }, o.t0 ?? 1.21);
    X.tl.set(d, { autoAlpha: 0 }, o.t1 ?? 5.8);
    return d;
  };
  /** One pure-white frame, then a 16–26-frame fade from white into scene 1 (to black instead if scene 1 is dark). */
  K.whiteFade = (o = {}) => {
    const t = o.t ?? 5.8, d = html({}, { inset: '0', background: o.color || '#FFFFFF' });
    gsap.set(d, { autoAlpha: 0 });
    X.tl.set(d, { autoAlpha: 1 }, t);
    X.tl.to(d, { autoAlpha: 0, duration: K.F(o.frames ?? 20), ease: 'sine.out' }, t + K.F(1));
    return d;
  };
  /** Black credit bar (180 px, 5 columns at 4.9/24.7/40.7/54.6/69.2 %, role regular + name bold, ~28 px) with a round
   *  badge at x=94 %; pages swap hard. pages = [[{role,name}×≤5], …]. Original badge glyph/colour — never the source's. */
  K.credits = (o) => {
    const t0 = o.t0, t1 = o.t1, n = o.pages.length, page = (t1 - t0) / n, hgt = o.h ?? 180;
    const bar = html({}, { left: '0', right: '0', bottom: '0', height: hgt + 'px', background: '#000000' });
    const cols = [0.049, 0.247, 0.407, 0.546, 0.692];
    o.pages.forEach((pg, i) => {
      const p = X.html('div', { style: { position: 'absolute', inset: '0' } }, bar);
      p.innerHTML = pg.map((c, k) => `<div style="position:absolute;left:${cols[k] * W}px;top:${hgt * 0.36}px;width:${(cols[k + 1] || 0.86) * W - cols[k] * W - 16}px;font-family:Inter;font-size:${o.size ?? 25}px;line-height:1.3;color:#F4F2F2">
        <div style="font-weight:400">${c.role}</div><div style="font-weight:700">${c.name}</div></div>`).join('');
      gsap.set(p, { autoAlpha: 0 });
      X.tl.set(p, { autoAlpha: 1 }, t0 + i * page);
      if (i < n - 1) X.tl.set(p, { autoAlpha: 0 }, t0 + (i + 1) * page);
    });
    const col = o.badge || '#1E7F7A';
    const b = X.html('div', { style: { position: 'absolute', left: (0.94 * W - 61) + 'px', top: (hgt / 2 - 61) + 'px', width: '122px', height: '122px' } }, bar);
    b.innerHTML = `<svg width="122" height="122" viewBox="-61 -61 122 122"><circle r="58" fill="${col}"/>
      <path d="M0,-30 C12,-14 18,-4 18,7 A18,18 0 0,1 -18,7 C-18,-4 -11,-12 0,-30 Z" fill="#FFF6EC"/><rect x="-14" y="27" width="28" height="7" rx="3" fill="#FFF6EC"/></svg>`;
    gsap.set(bar, { autoAlpha: 0 });
    X.tl.set(bar, { autoAlpha: 1 }, t0);
    return bar;
  };

  // ------------------------------------------------------------------ transitions (analysis §7)
  const roughRect = (w, h, jag, seed, edges) => { // jagged left/right edges (dry-brush), straight top/bottom
    const r = X.rand(seed), pts = [];
    const n = Math.round(h / 22);
    for (let i = 0; i <= n; i++) pts.push([w + (edges.right ? (r() - 0.5) * jag + (r() < 0.12 ? r() * jag * 1.6 : 0) : 0), (i / n) * h]);
    for (let i = n; i >= 0; i--) pts.push([edges.left ? (r() - 0.5) * jag - (r() < 0.12 ? r() * jag * 1.6 : 0) : 0, (i / n) * h]);
    return 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L') + 'Z';
  };
  let clipN = 0;
  /** T3 painted vertical brush wipe: the incoming scene group appears inside a rough-edged strip that widens
   *  left → right (6–10 frames, power2.out, on twos). Keep the outgoing scene visible until t + dur. */
  K.brushWipe = (g, t, o = {}) => {
    const id = 'bw' + (++clipN), dur = K.F(o.frames ?? 8);
    const cp = S('clipPath', { id, clipPathUnits: 'userSpaceOnUse' }, X.defs);
    const strip = S('path', { d: roughRect(W + 200, H + 40, o.jag ?? 70, o.seed ?? clipN * 7, { left: true, right: true }) }, cp);
    g.setAttribute('clip-path', `url(#${id})`);
    const tlx = o.twos === false ? X.tl : K.twos;
    const x0 = o.dir === 'rl' ? W + 40 : (o.from ?? 0.32) * W, w0 = 0.04;
    gsap.set(strip, { x: x0, y: -20, scaleX: w0, svgOrigin: '0 0' });
    tlx.fromTo(strip, { x: o.dir === 'rl' ? W - 80 : x0, scaleX: w0 }, { x: -120, scaleX: 1, duration: dur, ease: 'power2.out', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'paper', { gain: o.gain ?? 0.28, dur: dur + 0.1 });
    return dur;
  };
  /** T4 torn/ink-edge drop: a dark shape with a ragged bottom edge descends top → bottom over ~12 frames (power1.in)
   *  and covers the frame; show the next (dark) scene at t + dur and the curtain is hidden then. */
  K.inkDrop = (t, o = {}) => {
    const dur = K.F(o.frames ?? 12), r = X.rand(o.seed || 17);
    let d = `M-40,-40 L${W + 40},-40 L${W + 40},${H}`;
    for (let x = W + 40; x >= -40; x -= 26) d += ` L${x},${H + (r() - 0.5) * 34 + (r() < 0.15 ? 26 : 0)}`;
    const p = S('path', { d: d + ' Z', fill: o.color || '#1A111F' }, o.parent || K.fx || X.root);
    gsap.set(p, { y: -H - 80, autoAlpha: 0 });
    X.tl.set(p, { autoAlpha: 1 }, t);
    (o.twos === false ? X.tl : K.twos).fromTo(p, { y: -H - 80 }, { y: 0, duration: dur, ease: 'power1.in', immediateRender: false }, t);
    X.tl.set(p, { autoAlpha: 0 }, t + dur + K.F(1));
    if (o.sfx !== false) X.sfx(t, o.sfx || 'woosh_low', { gain: o.gain ?? 0.3, dur: dur + 0.2 });
    return dur;
  };
  /** T5 slide-off: content group slides out of frame (8–12 frames, power2.inOut) revealing the empty field. */
  K.slideOff = (el, t, o = {}) => {
    const dur = K.F(o.frames ?? 10), dist = o.dist ?? H * 1.1;
    const v = { duration: dur, ease: 'power2.inOut', immediateRender: false };
    if (o.dir === 'up') v.y = -dist; else if (o.dir === 'left') v.x = -dist; else if (o.dir === 'right') v.x = dist; else v.y = dist;
    (o.twos ? K.twos : X.tl).to(el, v, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'swoosh', { gain: o.gain ?? 0.22, dur: dur + 0.1 });
    return dur;
  };
  /** T6 panel: a clipped rectangle (x,y,w,h) that slides up into place (4–6 frames, power3.out). Returns {g, inner}. */
  K.panel = (parent, o) => {
    const id = 'pn' + (++clipN), cp = S('clipPath', { id }, X.defs);
    S('rect', { x: o.x, y: o.y, width: o.w, height: o.h }, cp);
    const g = S('g', { 'clip-path': `url(#${id})` }, parent);
    const inner = S('g', {}, g);
    S('rect', { x: o.x - 40, y: o.y - 40, width: o.w + 80, height: o.h + 80, fill: o.fill || '#B3CCCF' }, inner);
    if (o.paper !== false) S('image', { href: K.paper(o.fill || '#B3CCCF', 0.08, o.seed || 5), x: o.x - 40, y: o.y - 40, width: o.w + 80, height: o.h + 80, preserveAspectRatio: 'xMidYMid slice' }, inner);
    return { g, inner };
  };
  K.panelUp = (p, t, o = {}) => {
    const dur = K.F(o.frames ?? 5);
    gsap.set(p.inner, { y: H });
    X.tl.fromTo(p.inner, { y: H }, { y: 0, duration: dur, ease: 'power3.out', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'slide', { gain: o.gain ?? 0.2 });
    return dur;
  };
  /** T7 push-in zoom-through: fast scale-up on a point (×1 → ×1.6 over ~10 frames, power2.in), then hard-cut. */
  K.zoomThrough = (cam, t, o = {}) => {
    // cx,cy in the camera group's own coordinates; center:true also drifts that point to frame centre
    const dur = K.F(o.frames ?? 10), S2 = (o.scale ?? 1.6) * (o.base ?? 1), cx = o.cx ?? 960, cy = o.cy ?? 540, k = o.center ? S2 : S2 - 1;
    X.tl.to(cam, { scale: S2, x: (960 - cx) * k, y: (540 - cy) * k, duration: dur, ease: 'power2.in', immediateRender: false }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'zoom_in', { gain: o.gain ?? 0.2, dur: dur + 0.15 });
    return dur;
  };
  /** T13 shape grow-wipe (S4): a centred triangle/circle scales up until it covers the frame (9 frames, expo.in). */
  K.shapeGrow = (t, o = {}) => {
    const dur = K.F(o.frames ?? 9), g = S('g', { transform: `translate(${o.cx ?? 960},${o.cy ?? 540})` }, o.parent || K.fx || X.root);
    const sh = o.shape === 'circle' ? S('circle', { r: 40, fill: o.color || '#FADB2E' }, g) : S('path', { d: 'M0,-46 L40,23 L-40,23 Z', fill: o.color || '#FADB2E' }, g);
    gsap.set(sh, { scale: 0, svgOrigin: '0 0' });
    X.tl.fromTo(sh, { scale: 0.05 }, { scale: 70, duration: dur, ease: 'expo.in', immediateRender: false }, t);
    X.tl.set(g, { autoAlpha: 0 }, t + dur + (o.hold ?? K.F(1)));
    if (o.sfx !== false) X.sfx(t, o.sfx || 'whoosh', { gain: o.gain ?? 0.25 });
    return dur;
  };
  /** T14 iris ring close (S4): circular hole in a field colour shrinks to nothing, ringed by a white annulus (16 frames). */
  K.iris = (t, o = {}) => {
    const dur = K.F(o.frames ?? 16), id = 'ir' + (++clipN);
    const m = S('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, X.defs);
    S('rect', { width: W, height: H, fill: '#fff' }, m);
    const hole = S('circle', { cx: o.cx ?? 960, cy: o.cy ?? 540, r: 1200, fill: '#000' }, m);
    const g = S('g', {}, o.parent || K.fx || X.root);
    S('rect', { width: W, height: H, fill: o.color || '#FADB2E', mask: `url(#${id})` }, g);
    const ring = S('circle', { cx: o.cx ?? 960, cy: o.cy ?? 540, r: 1200, fill: 'none', stroke: o.ring || '#FFFFFF', 'stroke-width': 26 }, g);
    gsap.set(g, { autoAlpha: 0 }); X.tl.set(g, { autoAlpha: 1 }, t);
    X.tl.fromTo([hole, ring], { attr: { r: 1200 } }, { attr: { r: 0 }, duration: dur, ease: 'power2.in', immediateRender: false }, t);
    return { g, dur };
  };
  /** T15 dip to black (S3): 2-frame dip, then the next scene can rack-focus in (blur → sharp). */
  K.dip = (t, o = {}) => {
    const d = S('rect', { x: -20, y: -20, width: W + 40, height: H + 40, fill: o.color || '#000' }, o.parent || K.fx || X.root);
    gsap.set(d, { autoAlpha: 0 });
    X.tl.set(d, { autoAlpha: 1 }, t);
    X.tl.to(d, { autoAlpha: 0, duration: K.F(o.frames ?? 14), ease: 'sine.inOut' }, t + K.F(2));
    return d;
  };
})();
