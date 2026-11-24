/* kit.js — "infographics-show" style kit for the explainer engine (window.K).
 * The 2018–19 "camera-first" what-if look: flat two-tone vector world, no outlines, a puppet-rigged "you" stand-in
 * with ball fists, a virtual parallax camera that never stops, and animated transitions instead of cuts.
 * Every design here is original (character, props, channel mark); only the construction rules follow the analysis.
 *
 *   K.init(X)                                  once, before any set
 *   ctx = K.set(name, t0, t1, {bg}, build)     a scene "set": flat bg field + parallax camera (ctx.layer(p)) + ctx.hud
 *   K.move(ctx, t, {x,y,s,r}, dur, ease)       camera move (fromTo from the rig's planned state)
 *   K.shake(ctx, t, amp, dur)                  impact shake (pure function of t)
 *   P = K.guy(ctx, parent, opts)               puppet: P.face(t,name) P.pose(t,{l,r,bl,br},dur) P.look(t,dx) P.shiver(t,dur)
 *   K.tx.*(A, B, T, ...)                       transitions: zoomThrough smashOut smashIn whip flood bands circles
 *                                              liquid blink slide letterZoom burst occluder
 *   text: K.popText K.typeCard K.factBox K.tag K.bigNum K.qmarks K.bubble K.stamp K.ping
 *   props: K.marsLand K.hab K.rocket K.planet K.stars K.dust K.gauge K.molecule K.stopwatch K.thermo K.panel K.sun
 *          K.calendar K.potato K.tray K.bucket K.crate K.ice K.pickaxe K.pot K.tablet K.orbits K.devil K.mark K.beacon
 */
(function () {
  const K = (window.K = {});
  const C = (K.C = {
    // house palette (analysis §5)
    sky: '#A4E4F4', sky2: '#CCF4FC', cyan: '#04C4F4', mustard: '#D4C404', gold: '#ECBF53', coral: '#E05555',
    water: '#2878A2', water2: '#228EB2', water3: '#6EB9D2', grass: '#5CAC2C', grass2: '#A4B434', sand: '#F4D47C', sand2: '#ECBC4C',
    red: '#E3201B', orange: '#FC9C74', yellow: '#E1BC11', navy: '#23305A', hi: '#F5C400', ink: '#111111', white: '#FFFFFF',
    slate: '#1E2731', endcard: '#24435A',
    // the stand-in (original: peach skin, swept quiff, cream tee)
    skin: '#F2A49C', skinD: '#D9827E', shirt: '#F6F4EF', shirtD: '#E2DED6', pants: '#445464', pantsD: '#394656',
    hair: '#3D4A5A', shoe: '#2C333D', eye: '#2A2A33', mouth: '#5B2730',
    suit: '#EEF0F1', suitD: '#D3D8DD', suitO: '#F28C28', glove: '#D7DCE3', gloveD: '#B7BFCA', glass: '#BDEBFA',
    // Mars set (original to this kit)
    mSky: '#DFA170', mSkyHi: '#E8B484', mFar: '#D18E63', mFar2: '#C98258', mMid: '#BD6E47', mMidD: '#B0623E',
    mGround: '#A95C3D', mGround2: '#9A5135', mRock: '#7E3F28', mRockL: '#934B30', mDust: '#B67A52',
    planet: '#D9673E', planetD: '#BF532F', space: '#2C3D86', space2: '#24336F',
  });
  let X;
  const NS = 'http://www.w3.org/2000/svg';
  K.sets = []; K.tfs = []; K.hooks = [];
  const f2 = (v) => Math.round(v * 100) / 100;

  // ------------------------------------------------------------------ init + per-frame driver
  K.init = (X_) => {
    X = X_;
    K.setsRoot = X.svg('g', { id: 'sets' });
    K.top = X.svg('g', { id: 'tx' });
    const d = X.defs;
    const blur = (id, sd) => { const f = X.svg('filter', { id, x: '-20%', y: '-20%', width: '140%', height: '140%' }, d); X.svg('feGaussianBlur', { stdDeviation: sd }, f); return `url(#${id})`; };
    K.F = {
      whipH: blur('whipH', '70 0'), whipV: blur('whipV', '0 70'), soft: blur('soft6', 6), soft16: blur('soft16', 16),
      tshadow: X.shadow('tshadow', 4, 6, 6, '#000', 0.35), pshadow: X.shadow('pshadow', 0, 10, 14, '#000', 0.22),
    };
    // dynamic blur used by blink/focus-in
    K.focus = X.svg('filter', { id: 'focusB', x: '-10%', y: '-10%', width: '120%', height: '120%' }, d);
    K.focusBlur = X.svg('feGaussianBlur', { stdDeviation: 0 }, K.focus);
    K.focusSt = { b: 0 };
    X.every(K._frame);
  };
  K._frame = (t) => {
    for (const s of K.sets) if (t >= s.t0 - 0.05 && t <= s.t1 + 0.05) applyRig(s, t);
    for (const o of K.tfs) if (!o.vis || o.vis(t)) applyTf(o);
    for (const h of K.hooks) if (!h.vis || h.vis(t)) h.fn(t);
    K.focusBlur.setAttribute('stdDeviation', f2(K.focusSt.b));
  };
  function applyRig(s, t) {
    const r = s.rig; let sx = 0, sy = 0;
    const dt = Math.max(0, t - s.t0), dr = s.drift, dx = dr[0] * dt, dy = dr[1] * dt;
    let ds = 1 + dr[2] * dt;
    for (const k of s.punches) {
      const d = t - k.t;
      if (d >= 0 && d < k.dur + 0.1) ds *= 1 + (k.k - 1) * (d < 0.1 ? Math.sin((d / 0.1) * Math.PI / 2) : Math.max(0, 1 - (d - 0.1) / k.dur) ** 2);
    }
    for (const k of s.shakes) {
      const d = t - k.t;
      if (d >= 0 && d < k.dur) { const e = (1 - d / k.dur) ** 2; sx += k.amp * e * Math.sin(d * 58 + k.ph); sy += k.amp * e * Math.cos(d * 49 + k.ph * 1.7); }
    }
    for (const [L, p] of s.layers) {
      const sp = Math.pow(r.s * ds, p), x = (r.x + dx) * p, y = (r.y + dy) * p;
      L.setAttribute('transform', `translate(${f2(960 + sx)} ${f2(540 + sy)}) rotate(${f2(r.r)}) scale(${sp.toFixed(4)}) translate(${f2(-960 - x)} ${f2(-540 - y)})`);
    }
  }
  function applyTf(o) {
    const s = o.st;
    o.el.setAttribute('transform', `translate(${f2(s.x)} ${f2(s.y)}) rotate(${f2(s.r)}) scale(${(s.s * s.sx).toFixed(4)} ${(s.s * s.sy).toFixed(4)})`);
    if (o.useO && s.o !== o._o) { o.el.setAttribute('opacity', f2(s.o)); o._o = s.o; }
  }
  /** Drive an element's transform from a tweenable state {x,y,s,sx,sy,r,o}; content is drawn around (0,0). */
  K.tf = (el, init = {}, vis = null) => {
    const st = { x: 0, y: 0, s: 1, sx: 1, sy: 1, r: 0, o: 1, ...init };
    const o = { el, st, vis, _o: null, useO: 'o' in init };
    K.tfs.push(o); applyTf(o);
    return st;
  };
  K.hook = (fn, vis = null) => K.hooks.push({ fn, vis });
  const visOf = (ctx) => (ctx ? (t) => t >= ctx.t0 - 0.05 && t <= ctx.t1 + 0.05 : null);
  K.visOf = visOf;

  // ------------------------------------------------------------------ sets (scene + parallax camera)
  K.set = (name, t0, t1, o = {}, build) => {
    const g = X.scene(name, t0, t1, null, K.setsRoot);
    const bgRect = X.svg('rect', { x: -400, y: -400, width: 2720, height: 1880, fill: o.bg || C.sky }, g);
    const cam = X.svg('g', { class: 'cam' }, g);
    const hud = X.svg('g', { class: 'hud' }, g);
    const rig = { x: 0, y: 0, s: 1, r: 0, ...(o.rig || {}) };
    const ctx = { name, g, cam, hud, rig, t0, t1, bgRect, layers: [], shakes: [], punches: [], plan: { ...rig }, drift: o.drift || [30, 0, 0.016] };
    ctx.layer = (p = 1) => { const L = X.svg('g', {}, cam); ctx.layers.push([L, p]); return L; };
    ctx.vis = visOf(ctx);
    K.sets.push(ctx);
    if (build) build(ctx);
    return ctx;
  };
  /** Camera move. Tracks the planned rig state so every move is a fromTo (safe for out-of-order seeking). */
  K.move = (ctx, t, to, dur = 1.4, ease = 'sine.inOut') => {
    const from = { ...ctx.plan };
    Object.assign(ctx.plan, to);
    X.tl.fromTo(ctx.rig, from, { ...ctx.plan, duration: dur, ease, immediateRender: false }, t);
  };
  K.place = (ctx, st) => { Object.assign(ctx.rig, st); Object.assign(ctx.plan, st); };
  /** Zoom into a world point P: P glides to frame centre in screen space while scale grows exponentially (no drift
   *  across other content on the way, unlike tweening x/y/s together). Used by smash-in, zoom-through, letter dive. */
  K.zoomTo = (ctx, t, P, s1, dur, ease = 'power3.in', r1) => {
    const p0 = { ...ctx.plan };
    if (r1 == null) r1 = p0.r;
    const rot = (v, a) => { const c = Math.cos(a * Math.PI / 180), n = Math.sin(a * Math.PI / 180); return [v[0] * c - v[1] * n, v[0] * n + v[1] * c]; };
    const d0 = rot([P[0] - 960 - p0.x, P[1] - 540 - p0.y], p0.r);
    const S0 = [960 + p0.s * d0[0], 540 + p0.s * d0[1]];
    const pr = { q: 0 };
    const upd = () => {
      const q = pr.q, sc = p0.s * Math.pow(s1 / p0.s, q), r = p0.r + (r1 - p0.r) * q;
      const v = rot([(S0[0] - 960) * (1 - q) / sc, (S0[1] - 540) * (1 - q) / sc], -r);
      ctx.rig.x = P[0] - 960 - v[0]; ctx.rig.y = P[1] - 540 - v[1]; ctx.rig.s = sc; ctx.rig.r = r;
    };
    X.tl.fromTo(pr, { q: 0 }, { q: 1, duration: dur, ease, immediateRender: false, onUpdate: upd }, t);
    Object.assign(ctx.plan, { x: P[0] - 960, y: P[1] - 540, s: s1, r: r1 });
  };
  K.shake = (ctx, t, amp = 14, dur = 0.45) => ctx.shakes.push({ t, amp, dur, ph: (t * 7.3) % 6.28 });
  /** Punch-in on a stressed word: quick ×k zoom bump (0.1 s in, decays over dur). Additive to camera moves. */
  K.punch = (ctx, t, k = 1.1, dur = 0.7) => ctx.punches.push({ t, k, dur });
  /** Global colour-grade pulse (alarm tint) over a set, multiply blend. */
  K.tint = (ctx, t, color = '#FF5A4A', peak = 0.5, dur = 0.45) => {
    if (!ctx._tint) ctx._tint = X.svg('rect', { x: -10, y: -10, width: 1940, height: 1100, fill: color, opacity: 0, style: { mixBlendMode: 'multiply' } }, ctx.hud);
    X.tl.fromTo(ctx._tint, { attr: { opacity: 0 } }, { attr: { opacity: peak }, duration: dur * 0.3, ease: 'power2.out', immediateRender: false }, t);
    X.tl.to(ctx._tint, { attr: { opacity: 0 }, duration: dur * 0.7, ease: 'power2.in' }, t + dur * 0.3);
  };

  // ------------------------------------------------------------------ the "you" stand-in (puppet rig)
  const MOUTH = {
    dash: ['M-11,-3 H11 A3,3 0 0 1 11,3 H-11 A3,3 0 0 1 -11,-3Z', ''],
    smile: ['M-16,-5 Q0,15 16,-5 Q0,5 -16,-5Z', ''],
    grin: ['M-19,-7 H19 Q19,19 0,19 Q-19,19 -19,-7Z', 'M-16,-5 H16 V1 H-16Z'],
    frown: ['M-12,6 Q0,-9 12,6 Q0,1 -12,6Z', ''],
    O: ['M0,-11 A9,12 0 1 1 -0.1,-11Z', ''],
    grimace: ['M-19,-8 H19 A5,5 0 0 1 19,8 H-19 A5,5 0 0 1 -19,-8Z', 'M-15,-4 H15 V4 H-15Z'],
    wavy: ['M-15,0 Q-7,-7 0,0 Q7,7 15,0 L15,4 Q7,11 0,4 Q-7,-3 -15,4Z', ''],
  };
  const FACES = {
    neutral: { b: [0, 0, 0], m: 'dash', e: 'dot' }, smile: { b: [-5, 5, -2], m: 'smile', e: 'dot' },
    grin: { b: [-8, 8, -5], m: 'grin', e: 'happy' }, worried: { b: [-20, 20, -5], m: 'frown', e: 'dot' },
    shocked: { b: [-12, 12, -13], m: 'O', e: 'dot' }, angry: { b: [24, -24, 3], m: 'grimace', e: 'dot' },
    sick: { b: [-15, 15, -2], m: 'wavy', e: 'dot' }, woozy: { b: [-10, 14, -2], m: 'wavy', e: 'spiral' },
    ko: { b: [0, 0, 0], m: 'O', e: 'x' }, side: { b: [-4, 12, -4], m: 'dash', e: 'dot', look: 7 },
    smug: { b: [6, -10, -2], m: 'smile', e: 'dot', look: 5 },
  };
  K.FACES = FACES;
  let guyN = 0;
  K.guy = (ctx, parent, o = {}) => {
    const id = 'g' + guyN++;
    const suit = !!o.suit, helmet = o.helmet ?? suit;
    const col = suit ? { top: C.suit, topD: C.suitD, leg: C.suit, legD: C.suitD, arm: C.suit, hand: C.glove, handD: C.gloveD, shoe: '#8C96A1' }
      : { top: C.shirt, topD: C.shirtD, leg: C.pants, legD: C.pantsD, arm: C.skin, hand: C.skin, handD: C.skinD, shoe: C.shoe };
    if (o.shirt) { col.top = o.shirt; col.topD = o.shirtD || o.shirt; }
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x: o.x || 0, y: o.y || 0, s: o.s || 1, sx: o.flip ? -1 : 1 }, visOf(ctx));
    const P = { g, st, id, suit };
    // pose state (local coords, feet at 0,0; up is negative)
    P.p = { hlx: -100, hly: -262, hrx: 100, hry: -262, bl: 22, br: -22, lean: 0, ht: 0, look: 0, jit: 0, bob: 0, ...(o.pose || {}) };
    if (o.hands) { if (o.hands.l) [P.p.hlx, P.p.hly] = o.hands.l; if (o.hands.r) [P.p.hrx, P.p.hry] = o.hands.r; }
    const body = X.svg('g', {}, g);
    // legs + shoes
    const legs = X.svg('g', {}, body);
    X.svg('path', { d: 'M-68,-250 L-62,-26 Q-62,-16 -52,-16 L-16,-16 Q-6,-16 -6,-26 L-3,-250Z', fill: col.leg }, legs);
    X.svg('path', { d: 'M3,-250 L6,-26 Q6,-16 16,-16 L52,-16 Q62,-16 62,-26 L68,-250Z', fill: col.legD }, legs);
    if (suit) { X.svg('rect', { x: -60, y: -150, width: 50, height: 34, rx: 12, fill: C.suitO }, legs); X.svg('rect', { x: 10, y: -150, width: 50, height: 34, rx: 12, fill: '#E07F22' }, legs); }
    X.svg('rect', { x: -74, y: -30, width: 70, height: 30, rx: 14, fill: col.shoe }, legs);
    X.svg('rect', { x: 4, y: -30, width: 70, height: 30, rx: 14, fill: col.shoe }, legs);
    // upper body (leans about the hips)
    const upper = X.svg('g', {}, body);
    const torso = X.svg('g', {}, upper);
    if (suit) X.svg('rect', { x: -104, y: -436, width: 208, height: 186, rx: 30, fill: '#C3CAD2' }, torso); // life-support pack
    const tPath = 'M-60,-416 Q-92,-416 -90,-384 L-76,-252 Q-74,-234 -56,-234 L56,-234 Q74,-234 76,-252 L90,-384 Q92,-416 60,-416Z';
    const tcl = X.svg('clipPath', { id: id + 'tc' }, X.defs); X.svg('path', { d: tPath }, tcl);
    X.svg('path', { d: tPath, fill: col.top }, torso);
    X.svg('rect', { x: 26, y: -420, width: 80, height: 200, fill: col.topD, 'clip-path': `url(#${id}tc)` }, torso);
    if (suit) {
      X.svg('rect', { x: -52, y: -372, width: 64, height: 46, rx: 10, fill: '#AEB7C1' }, torso);
      X.svg('circle', { cx: -36, cy: -349, r: 7, fill: C.red }, torso); X.svg('circle', { cx: -14, cy: -349, r: 7, fill: '#3CC46A' }, torso);
      X.svg('rect', { x: 24, y: -380, width: 40, height: 22, rx: 6, fill: C.suitO }, torso);
      X.svg('rect', { x: -76, y: -262, width: 152, height: 22, rx: 8, fill: '#C3CAD2' }, torso);
    } else X.svg('path', { d: 'M-20,-416 Q0,-394 20,-416Z', fill: C.skinD }, torso);
    // head (tilts about the neck)
    const head = X.svg('g', {}, upper);
    if (!suit) X.svg('rect', { x: -17, y: -428, width: 34, height: 22, fill: C.skinD }, head);
    X.svg('circle', { cx: -57, cy: -476, r: 13, fill: C.skinD }, head);
    X.svg('circle', { cx: 57, cy: -476, r: 13, fill: C.skinD }, head);
    const hcl = X.svg('clipPath', { id: id + 'hc' }, X.defs);
    X.svg('rect', { x: -57, y: -542, width: 114, height: 130, rx: 50, ry: 56 }, hcl);
    X.svg('rect', { x: -57, y: -542, width: 114, height: 130, rx: 50, ry: 56, fill: C.skin }, head);
    X.svg('rect', { x: 18, y: -545, width: 50, height: 140, fill: C.skinD, 'clip-path': `url(#${id}hc)` }, head);
    // hair: swept quiff (union of circles + a swoop)
    const hair = X.svg('g', { fill: C.hair }, head);
    [[-40, -528, 28], [-12, -546, 32], [20, -544, 30], [46, -524, 20], [-54, -508, 13], [52, -506, 10]].forEach(([cx, cy, r]) => X.svg('circle', { cx, cy, r }, hair));
    X.svg('path', { d: 'M-62,-520 Q-46,-590 24,-582 Q60,-578 66,-548 Q40,-566 6,-556 Q-30,-546 -62,-520Z' }, hair);
    // face
    const face = X.svg('g', {}, head);
    const eyes = X.svg('g', {}, face);
    const dots = X.svg('g', {}, eyes);
    X.svg('ellipse', { cx: -22, cy: -480, rx: 5.5, ry: 7, fill: C.eye }, dots);
    X.svg('ellipse', { cx: 21, cy: -480, rx: 5.5, ry: 7, fill: C.eye }, dots);
    const happy = X.svg('g', { fill: C.eye, opacity: 0 }, eyes);
    X.svg('path', { d: 'M-31,-476 Q-22,-490 -13,-476 L-16,-474 Q-22,-483 -28,-474Z' }, happy);
    X.svg('path', { d: 'M12,-476 Q21,-490 30,-476 L27,-474 Q21,-483 15,-474Z' }, happy);
    const xs = X.svg('g', { fill: C.eye, opacity: 0 }, eyes);
    for (const cx of [-22, 21]) { X.svg('rect', { x: cx - 9, y: -483, width: 18, height: 5, rx: 2, transform: `rotate(45 ${cx} -480)` }, xs); X.svg('rect', { x: cx - 9, y: -483, width: 18, height: 5, rx: 2, transform: `rotate(-45 ${cx} -480)` }, xs); }
    const spir = X.svg('g', { opacity: 0 }, eyes);
    const spirals = [];
    for (const cx of [-22, 21]) spirals.push(X.svg('path', { d: `M${cx},-480 m0,0 a3,3 0 1 1 4,2 a6,6 0 1 1 -9,-6 a9,9 0 1 1 14,9`, fill: 'none', stroke: C.eye, 'stroke-width': 3, 'stroke-linecap': 'round' }, spir));
    const browL = X.svg('rect', { x: -34, y: -508, width: 25, height: 7, rx: 3.5, fill: C.hair }, face);
    const browR = X.svg('rect', { x: 9, y: -508, width: 25, height: 7, rx: 3.5, fill: C.hair }, face);
    const mouthG = X.svg('g', { transform: 'translate(0 -449)' }, face);
    const mouth = X.svg('path', { d: MOUTH.dash[0], fill: C.mouth }, mouthG);
    const teeth = X.svg('path', { d: '', fill: '#fff' }, mouthG);
    const cheek = X.svg('g', { opacity: 0, fill: '#9BCB6A' }, face); // sick tint
    X.svg('ellipse', { cx: -32, cy: -458, rx: 12, ry: 7 }, cheek); X.svg('ellipse', { cx: 32, cy: -458, rx: 12, ry: 7 }, cheek);
    const extras = X.svg('g', {}, head); // clothespin etc.
    if (helmet) {
      X.svg('rect', { x: -66, y: -432, width: 132, height: 26, rx: 12, fill: '#C3CAD2' }, head);
      X.svg('circle', { cx: 0, cy: -486, r: 100, fill: C.glass, opacity: 0.32 }, head);
      X.svg('circle', { cx: 0, cy: -486, r: 100, fill: 'none', stroke: '#E4E8EC', 'stroke-width': 11 }, head);
      X.svg('path', { d: 'M-70,-528 Q-60,-570 -16,-580', fill: 'none', stroke: '#fff', 'stroke-width': 10, 'stroke-linecap': 'round', opacity: 0.8 }, head);
      X.svg('circle', { cx: 56, cy: -446, r: 7, fill: '#fff', opacity: 0.7 }, head);
    }
    // arms + hands (recomputed each frame)
    const arms = X.svg('g', {}, upper);
    const armL = X.svg('path', { fill: col.arm }, arms), armR = X.svg('path', { fill: col.arm }, arms);
    const slL = X.svg('path', { fill: suit ? C.suitO : col.top }, arms), slR = X.svg('path', { fill: suit ? C.suitO : col.topD }, arms);
    const hand = (side) => { const hg = X.svg('g', {}, arms); X.svg('circle', { cx: 0, cy: 0, r: 40, fill: col.handD }, hg); X.svg('circle', { cx: -5, cy: -6, r: 34, fill: col.hand }, hg); return hg; };
    const hL = hand('l'), hR = hand('r');
    Object.assign(P, { body, upper, head, face, eyes, dots, happy, xs, spir, browL, browR, mouth, teeth, cheek, extras, arms, hL, hR });
    gsap.set([browL, browR], { transformOrigin: '50% 50%' });
    // blinks: seeded times
    const rr = X.rand(o.seed || 11 + guyN * 7), blinks = [];
    for (let t = 0.6 + rr() * 2; t < 200; t += 2 + rr() * 2) blinks.push(t);
    const ph = rr() * 6;
    const tube = (S, Cc, H, w0, w1, u0, u1, n = 9) => {
      const L = [], R = [];
      for (let i = 0; i <= n; i++) {
        const u = u0 + (u1 - u0) * i / n, a = 1 - u;
        const px = a * a * S[0] + 2 * a * u * Cc[0] + u * u * H[0], py = a * a * S[1] + 2 * a * u * Cc[1] + u * u * H[1];
        let dx = 2 * a * (Cc[0] - S[0]) + 2 * u * (H[0] - Cc[0]), dy = 2 * a * (Cc[1] - S[1]) + 2 * u * (H[1] - Cc[1]);
        const l = Math.hypot(dx, dy) || 1; dx /= l; dy /= l;
        const w = (w0 + (w1 - w0) * u) / 2;
        L.push([px - dy * w, py + dx * w]); R.push([px + dy * w, py - dx * w]);
      }
      const e = (p) => f2(p[0]) + ',' + f2(p[1]);
      return 'M' + L.map(e).join('L') + 'L' + R.reverse().map(e).join('L') + 'Z';
    };
    const arm = (S, H, bend) => {
      const M = [(S[0] + H[0]) / 2, (S[1] + H[1]) / 2], dx = H[0] - S[0], dy = H[1] - S[1], l = Math.hypot(dx, dy) || 1;
      return [M[0] - dy / l * bend, M[1] + dx / l * bend];
    };
    K.hook((t) => {
      const p = P.p;
      const breath = 1 + 0.018 * Math.sin(t * Math.PI + ph);
      const jit = p.jit ? p.jit * Math.sin(t * 70) : 0;
      body.setAttribute('transform', `translate(${f2(jit)} ${f2(p.bob)})`);
      upper.setAttribute('transform', `rotate(${f2(p.lean)} 0 -240) translate(0 -240) scale(1 ${breath.toFixed(4)}) translate(0 240)`);
      const tilt = 2.2 * Math.sin(t * 2.1 + ph) + p.ht;
      head.setAttribute('transform', `rotate(${f2(tilt)} 0 -414)`);
      let k = 1;
      for (const b of blinks) { if (t >= b && t < b + 0.1) { k = 0.12; break; } if (b > t) break; }
      eyes.setAttribute('transform', `translate(${f2(p.look)} 0) translate(0 -480) scale(1 ${k}) translate(0 480)`);
      spirals.forEach((s, i) => s.setAttribute('transform', `rotate(${f2(t * 400 * (i ? -1 : 1))} ${i ? 21 : -22} -480)`));
      const SL = [-80, -392], SR = [80, -392], HL = [p.hlx, p.hly], HR = [p.hrx, p.hry];
      const cL = arm(SL, HL, p.bl), cR = arm(SR, HR, p.br);
      armL.setAttribute('d', tube(SL, cL, HL, 38, 27, 0, 1));
      armR.setAttribute('d', tube(SR, cR, HR, 38, 27, 0, 1));
      if (suit) { slL.setAttribute('d', tube(SL, cL, HL, 34, 34, 0.74, 0.86, 3)); slR.setAttribute('d', tube(SR, cR, HR, 34, 34, 0.74, 0.86, 3)); }
      else { slL.setAttribute('d', tube(SL, cL, HL, 54, 48, 0, 0.3, 4)); slR.setAttribute('d', tube(SR, cR, HR, 54, 48, 0, 0.3, 4)); }
      hL.setAttribute('transform', `translate(${f2(HL[0])} ${f2(HL[1])})`);
      hR.setAttribute('transform', `translate(${f2(HR[0])} ${f2(HR[1])}) scale(-1 1)`);
    }, visOf(ctx));
    // ---- actions
    P.face = (t, name) => {
      const F = FACES[name] || FACES.neutral, d = 2 / 30;
      X.tl.to(browL, { rotation: F.b[0], y: F.b[2], duration: d, ease: 'none' }, t);
      X.tl.to(browR, { rotation: F.b[1], y: F.b[2], duration: d, ease: 'none' }, t);
      X.tl.set(mouth, { attr: { d: MOUTH[F.m][0] } }, t);
      X.tl.set(teeth, { attr: { d: MOUTH[F.m][1] } }, t);
      X.tl.set(dots, { opacity: F.e === 'dot' ? 1 : 0 }, t);
      X.tl.set(happy, { opacity: F.e === 'happy' ? 1 : 0 }, t);
      X.tl.set(xs, { opacity: F.e === 'x' ? 1 : 0 }, t);
      X.tl.set(spir, { opacity: F.e === 'spiral' ? 1 : 0 }, t);
      X.tl.set(cheek, { opacity: name === 'sick' ? 0.8 : 0 }, t);
      X.tl.to(P.p, { look: F.look || 0, duration: 0.12, ease: 'power2.out' }, t);
    };
    P.pose = (t, q, dur = 0.45, ease = 'power2.inOut') => {
      const to = {};
      if (q.l) { to.hlx = q.l[0]; to.hly = q.l[1]; }
      if (q.r) { to.hrx = q.r[0]; to.hry = q.r[1]; }
      for (const k of ['bl', 'br', 'lean', 'ht', 'bob']) if (q[k] != null) to[k] = q[k];
      X.tl.to(P.p, { ...to, duration: dur, ease }, t);
    };
    P.look = (t, dx) => X.tl.to(P.p, { look: dx, duration: 0.15, ease: 'power2.out' }, t);
    P.shiver = (t, dur = 1.5, amp = 3) => { X.tl.to(P.p, { jit: amp, duration: 0.1 }, t); X.tl.to(P.p, { jit: 0, duration: 0.2 }, t + dur); };
    P.hop = (t, h = 40) => { X.tl.to(P.p, { bob: -h, duration: 0.16, ease: 'power2.out' }, t); X.tl.to(P.p, { bob: 0, duration: 0.22, ease: 'bounce.out' }, t + 0.16); };
    P.face(0, o.face || 'neutral');
    return P;
  };
  K.POSE = {
    rest: { l: [-100, -262], r: [100, -262], bl: 22, br: -22 },
    wave: { r: [160, -560], br: 40 }, waveB: { r: [190, -520], br: 30 },
    thumbs: { r: [128, -430], br: -50 }, panic: { l: [-72, -566], r: [72, -566], bl: -40, br: 40 },
    hug: { l: [46, -330], r: [-46, -330], bl: 40, br: -40 }, sign: { l: [-78, -460], r: [78, -460], bl: 50, br: -50 },
    shrug: { l: [-150, -400], r: [150, -400], bl: -30, br: 30 }, chin: { r: [26, -400], br: -60 },
    point: { r: [210, -420], br: -10 }, hips: { l: [-104, -300], r: [104, -300], bl: 60, br: -60 },
  };

  // ------------------------------------------------------------------ text
  K.measure = (str, size, weight = 800, family = 'Montserrat') => {
    const t = X.svg('text', { x: 0, y: -9999, 'font-size': size, 'font-weight': weight, 'font-family': family, text: str }, X.root);
    const pos = [0];
    for (let i = 1; i <= str.length; i++) pos.push(t.getSubStringLength(0, i));
    t.remove();
    return pos;
  };
  /** Per-letter pop (2018–19 kinetic type): each glyph scales 0→1.15→1 with random rotation, 2 f apart. */
  K.popText = (parent, str, x, y, o = {}) => {
    const size = o.size || 120, w8 = o.weight || 900, fam = o.family || 'Montserrat';
    const pos = K.measure(str, size, w8, fam), W = pos[str.length];
    const x0 = o.anchor === 'start' ? x : o.anchor === 'end' ? x - W : x - W / 2;
    const g = X.svg('g', { filter: o.shadow === false ? null : K.F.tshadow }, parent);
    if (o.shadow === false) g.removeAttribute('filter');
    const rr = X.rand(o.seed || str.length * 13 + 5), glyphs = [];
    let k = 0;
    for (let i = 0; i < str.length; i++) {
      if (str[i] === ' ') continue;
      const cx = x0 + (pos[i] + pos[i + 1]) / 2;
      const el = X.svg('text', { x: f2(cx), y, 'text-anchor': 'middle', 'font-size': size, 'font-weight': w8, 'font-family': fam, fill: (o.colors && o.colors[i]) || o.fill || '#fff', text: str[i] }, g);
      glyphs.push(el);
      if (o.t != null) {
        gsap.set(el, { transformOrigin: '50% 60%', scale: 0 });
        X.tl.fromTo(el, { scale: 0, rotation: (rr() - 0.5) * 50, y: (rr() - 0.5) * 36 }, { scale: 1, rotation: 0, y: 0, duration: 0.18, ease: 'back.out(2.6)', immediateRender: false }, o.t + k * (o.stagger ?? 2 / 30));
      }
      k++;
    }
    if (o.t != null && o.sfx !== false) X.sfx(o.t, 'pop', { gain: 0.3, pitch: 1.2 });
    return { g, glyphs, width: W, x0, size };
  };
  /** Highlighter bar behind a word (scaleX in from the left). */
  K.bar = (parent, x, y, w, h, color, t) => {
    const r = X.svg('rect', { x, y, width: w, height: h, rx: 6, fill: color }, parent);
    if (t != null) { gsap.set(r, { transformOrigin: '0% 50%', scaleX: 0 }); X.tl.fromTo(r, { scaleX: 0 }, { scaleX: 1, duration: 0.22, ease: 'power3.out', immediateRender: false }, t); }
    return r;
  };
  /** A tilted kinetic type card: rows [{text, size, t, fill, bar, colors}] on the set's colour field. */
  K.typeCard = (parent, rows, o = {}) => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x: o.x ?? 960, y: o.y ?? 540, r: o.rot ?? -12 }, o.vis);
    const total = rows.reduce((a, r) => a + r.size * 1.05, 0);
    let y = -total / 2;
    const out = [];
    for (const r of rows) {
      y += r.size * 0.86;
      const pos = K.measure(r.text, r.size, r.weight || 900), W = pos[r.text.length];
      if (r.bar) K.bar(g, -W / 2 - 24, y - r.size * 0.8, W + 48, r.size * 0.98, r.bar, r.t - 0.04);
      out.push(K.popText(g, r.text, 0, y, { size: r.size, weight: r.weight || 900, t: r.t, fill: r.fill, colors: r.colors, shadow: r.shadow, seed: r.seed }));
      y += r.size * 0.19;
    }
    return { g, st, rows: out };
  };
  /** 2026-variant headline / stinger card: the set behind blurs (0→16 px) and dims in 4 f, ALL-CAPS lines type on at
   *  ~1 char/frame (each glyph fades/scales in over 3 f), one keyword in red. lines: ['SO IS IT REALLY', 'WORTH IT?']. */
  K.headline = (ctx, lines, t, o = {}) => {
    const size = o.size || 130, pitch = size * 1.32, kw = (o.keyword || '').toUpperCase();
    if (!ctx._hb) {
      const f = X.svg('filter', { id: ctx.name + '_hb', x: '-5%', y: '-5%', width: '110%', height: '110%' }, X.defs);
      ctx._hb = X.svg('feGaussianBlur', { stdDeviation: 0 }, f);
      ctx._hdim = X.svg('rect', { x: -10, y: -10, width: 1940, height: 1100, fill: '#000', opacity: 0 }, ctx.hud);
    }
    X.tl.set(ctx.cam, { attr: { filter: `url(#${ctx.name}_hb)` } }, t);
    X.tl.fromTo(ctx._hb, { attr: { stdDeviation: 0 } }, { attr: { stdDeviation: 16 }, duration: 4 / 30, ease: 'none', immediateRender: false }, t);
    X.tl.fromTo(ctx._hdim, { attr: { opacity: 0 } }, { attr: { opacity: 0.15 }, duration: 4 / 30, immediateRender: false }, t);
    const g = X.svg('g', { filter: K.F.tshadow }, ctx.hud);
    let k = 0;
    lines.forEach((ln, li) => {
      const pos = K.measure(ln, size, 900), W = pos[ln.length], x0 = 960 - W / 2, y = 540 - ((lines.length - 1) * pitch) / 2 + li * pitch + size * 0.35;
      const words = ln.split(' ');
      let ci = 0;
      words.forEach((w) => {
        const red = kw && w.replace(/[^A-Z0-9%$]/g, '') === kw.replace(/[^A-Z0-9%$]/g, '');
        for (const ch of w) {
          const el = X.svg('text', { x: f2(x0 + (pos[ci] + pos[ci + 1]) / 2), y, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, 'font-family': 'Montserrat', fill: red ? C.red : '#fff', text: ch, opacity: 0 }, g);
          gsap.set(el, { transformOrigin: '50% 60%' });
          X.tl.fromTo(el, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 3 / 30, ease: 'power1.out', immediateRender: false }, t + 4 / 30 + k / 30);
          ci++; k++;
        }
        ci++;
      });
    });
    X.sfx(t, 'swoosh', { dur: 0.25, gain: 0.3 });
    X.sfx(t + 4 / 30, 'type', { dur: Math.min(1.2, k / 30), gain: 0.2 });
    if (o.out != null) {
      X.tl.to(g, { opacity: 0, duration: 0.15 }, o.out);
      X.tl.to(ctx._hb, { attr: { stdDeviation: 0 }, duration: 0.15 }, o.out);
      X.tl.to(ctx._hdim, { attr: { opacity: 0 }, duration: 0.15 }, o.out);
      X.tl.set(ctx.cam, { attr: { filter: 'none' } }, o.out + 0.16);
    }
    return g;
  };
  /** 2018 fact box: white bar flush to the left edge, black SemiBold type, typewriter at 2 chars/frame. */
  K.factBox = (parent, text, t, o = {}) => {
    const size = o.size || 42, y = o.y ?? 96, pos = K.measure(text, size, 700), w = pos[text.length] + 64;
    const g = X.svg('g', {}, parent);
    X.svg('rect', { x: -20, y, width: w + 20, height: size * 1.75, fill: '#fff' }, g);
    if (o.accent) X.svg('rect', { x: 0, y, width: 12, height: size * 1.75, fill: o.accent }, g);
    const tx = X.svg('text', { x: 34, y: y + size * 1.2, 'font-size': size, 'font-weight': 700, 'font-family': 'Montserrat', fill: C.ink }, g);
    gsap.set(g, { x: -w - 40 });
    X.tl.fromTo(g, { x: -w - 40 }, { x: 0, duration: 0.25, ease: 'power2.out', immediateRender: false }, t);
    X.typeOn(tx, text, t + 0.12, 60);
    X.sfx(t, 'slide', { dur: 0.25, gain: 0.3 });
    X.sfx(t + 0.12, 'type', { dur: Math.min(0.6, text.length / 60), gain: 0.25 });
    if (o.out != null) X.tl.to(g, { x: -w - 40, duration: 0.25, ease: 'power2.in' }, o.out);
    return g;
  };
  /** Value tag hung on a string from an anchor; swings in with a damped elastic, digits type on. */
  K.tag = (parent, ax, ay, text, t, o = {}) => {
    const size = o.size || 58, len = o.len ?? 70, pos = K.measure(text, size, 800), w = pos[text.length] + 56, h = size * 1.45;
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x: ax, y: ay, s: 0, r: -16 }, o.vis);
    X.svg('rect', { x: -2, y: 0, width: 4, height: len, fill: o.string || '#4A4A4A' }, g);
    X.svg('rect', { x: -w / 2, y: len, width: w, height: h, rx: 14, fill: o.bg || '#fff', filter: K.F.pshadow }, g);
    X.svg('circle', { cx: 0, cy: len + 14, r: 6, fill: '#B9B9B9' }, g);
    const tx = X.svg('text', { x: 0, y: len + h * 0.74, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 800, 'font-family': 'Montserrat', fill: o.fill || C.ink }, g);
    X.tl.fromTo(st, { s: 0 }, { s: 1, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, t);
    X.tl.fromTo(st, { r: -16 }, { r: 0, duration: 1.3, ease: 'elastic.out(1, 0.35)', immediateRender: false }, t);
    X.typeOn(tx, text, t + 0.1, Math.max(14, text.length / 0.45));
    X.sfx(t, 'pop', { gain: 0.35, pitch: 0.9 });
    return { g, st };
  };
  /** Big white figure with a drop shadow (pops). */
  K.bigNum = (parent, text, x, y, t, o = {}) => {
    const el = X.svg('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-size': o.size || 120, 'font-weight': o.weight || 800, 'font-family': 'Montserrat', fill: o.fill || '#fff', filter: K.F.tshadow, text }, parent);
    if (t != null) X.pop(el, t, { dur: 0.35, ease: 'back.out(2)', sfx: o.sfx ?? 'pop', gain: 0.35 });
    return el;
  };
  /** "?", "??", "???" pops at 3-frame steps above a head. */
  K.qmarks = (parent, x, y, t, o = {}) => {
    const g = X.svg('g', {}, parent);
    const n = o.n || 3, rr = X.rand(o.seed || Math.round(t * 10));
    for (let i = 0; i < n; i++) {
      const el = X.svg('text', { x: x + (i - (n - 1) / 2) * (o.gap || 54), y: y - (i % 2) * 26, 'text-anchor': 'middle', 'font-size': o.size || 80, 'font-weight': 900, 'font-family': 'Montserrat', fill: o.fill || C.navy, transform: `rotate(${f2((rr() - 0.5) * 30)} ${x + (i - (n - 1) / 2) * (o.gap || 54)} ${y})`, text: '?' }, g);
      X.pop(el, t + i * 0.1, { dur: 0.25, ease: 'back.out(3)', sfx: i ? false : 'blip_up', gain: 0.25 });
    }
    if (o.out != null) X.tl.to(g, { opacity: 0, duration: 0.2 }, o.out);
    return g;
  };
  /** Speech bubble (≤ 8 words), pops with back.out. */
  K.bubble = (parent, x, y, text, t, o = {}) => {
    const size = o.size || 48, pos = K.measure(text, size, 700), w = pos[text.length] + 64, h = size * 1.8;
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s: 0 }, o.vis);
    const tail = o.tail || 'left';
    X.svg('rect', { x: -w / 2, y: -h, width: w, height: h, rx: 18, fill: '#fff', filter: K.F.pshadow }, g);
    X.svg('path', { d: tail === 'left' ? `M${-w / 2 + 40},-4 L${-w / 2 + 20},34 L${-w / 2 + 84},-4Z` : `M${w / 2 - 40},-4 L${w / 2 - 20},34 L${w / 2 - 84},-4Z`, fill: '#fff' }, g);
    X.svg('text', { x: 0, y: -h / 2 + size * 0.36, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 700, 'font-family': 'Montserrat', fill: C.ink, text }, g);
    X.tl.fromTo(st, { s: 0 }, { s: 1, duration: 0.3, ease: 'back.out(2.2)', immediateRender: false }, t);
    X.sfx(t, 'pop', { gain: 0.3, pitch: 1.1 });
    return { g, st };
  };
  /** Red label stamp: slams from 2.4× to 1×, thud + optional camera shake. */
  K.stamp = (parent, x, y, text, t, o = {}) => {
    const size = o.size || 96, pos = K.measure(text, size, 900), w = pos[text.length] + 70, h = size * 1.35;
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s: 0, r: o.rot ?? -10, o: 0 }, o.vis);
    X.svg('rect', { x: -w / 2, y: -h / 2, width: w, height: h, rx: 12, fill: o.bg || C.red }, g);
    X.svg('rect', { x: -w / 2 + 10, y: -h / 2 + 10, width: w - 20, height: h - 20, rx: 8, fill: 'none', stroke: '#fff', 'stroke-width': 5, opacity: 0.85 }, g);
    X.svg('text', { x: 0, y: size * 0.36, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 900, 'font-family': 'Montserrat', fill: '#fff', text }, g);
    X.tl.fromTo(st, { s: 2.4, o: 0 }, { s: 1, o: 1, duration: 0.18, ease: 'power3.in', immediateRender: false }, t);
    X.sfx(t + 0.16, 'stamp', { gain: 0.55 });
    if (o.ctx) K.shake(o.ctx, t + 0.17, o.shake ?? 10, 0.35);
    return { g, st };
  };
  /** Map/location ping: white double ring pulsing (pure function of t). */
  K.ping = (parent, x, y, t, o = {}) => {
    const g = X.svg('g', { opacity: 0 }, parent);
    const rings = [0, 0.4].map(() => X.svg('circle', { cx: x, cy: y, r: o.r || 40, fill: 'none', stroke: o.color || '#fff', 'stroke-width': o.w || 7 }, g));
    X.svg('circle', { cx: x, cy: y, r: (o.r || 40) * 0.32, fill: o.color || '#fff' }, g);
    X.tl.set(g, { opacity: 1 }, t);
    K.hook((tt) => {
      if (tt < t) return;
      rings.forEach((r, i) => { const ph = ((tt - t) / 0.9 + i * 0.5) % 1; r.setAttribute('transform', `translate(${x} ${y}) scale(${(0.5 + ph * 1.3).toFixed(3)}) translate(${-x} ${-y})`); r.setAttribute('opacity', f2(1 - ph)); });
    }, o.vis);
    return g;
  };

  // ------------------------------------------------------------------ environments
  /** Mars exterior with 4 parallax planes. Returns {sky, far, mid, near, act, fg}. horizon = y of the ground line. */
  K.marsLand = (ctx, o = {}) => {
    const hz = o.horizon ?? 700, rr = X.rand(o.seed || 3);
    ctx.bgRect.setAttribute('fill', C.mSky);
    const sky = ctx.layer(0.08), far = ctx.layer(0.3), mid = ctx.layer(0.6), near = ctx.layer(1), act = ctx.layer(1), fg = ctx.layer(1.4);
    X.svg('rect', { x: -3000, y: hz - 260, width: 8000, height: 400, fill: C.mSkyHi, opacity: 0.7 }, sky);
    for (let i = 0; i < 7; i++) X.svg('rect', { x: -2400 + rr() * 5200, y: 120 + rr() * (hz - 420), width: 260 + rr() * 520, height: 14 + rr() * 10, rx: 12, fill: C.mSkyHi, opacity: 0.8 }, sky);
    if (o.sun !== false) K.sun(sky, o.sunX ?? 1500, o.sunY ?? 230, 46, { pale: true });
    // far mesas (flat-topped, light, two-tone)
    let x = -2600;
    while (x < 4600) {
      const w = 260 + rr() * 420, h = 70 + rr() * 120, top = hz - 40 - h, c = rr() < 0.5 ? C.mFar : C.mFar2;
      X.svg('path', { d: `M${x},${hz} L${x + w * 0.18},${top} L${x + w * 0.82},${top} L${x + w},${hz}Z`, fill: c }, far);
      X.svg('path', { d: `M${x + w * 0.62},${hz} L${x + w * 0.7},${top} L${x + w * 0.82},${top} L${x + w},${hz}Z`, fill: C.mMidD, opacity: 0.45 }, far);
      X.svg('rect', { x: x + w * 0.2, y: top + h * 0.35, width: w * 0.5, height: 7, fill: C.mMidD, opacity: 0.35 }, far);
      x += w * (0.7 + rr() * 0.6);
    }
    X.svg('rect', { x: -3000, y: hz - 30, width: 8000, height: 120, fill: C.mFar2 }, far);
    // mid dunes
    let d = `M-3000,${hz + 60}`;
    for (let xx = -3000; xx <= 5000; xx += 300) d += ` Q${xx + 150},${hz - 40 - rr() * 60} ${xx + 300},${hz + 10 + rr() * 30}`;
    X.svg('path', { d: d + ` L5000,${hz + 400} L-3000,${hz + 400}Z`, fill: C.mMid }, mid);
    for (let xx = -2900; xx <= 4900; xx += 300) X.svg('ellipse', { cx: xx + 120 + rr() * 60, cy: hz + 22 + rr() * 14, rx: 70 + rr() * 50, ry: 9, fill: C.mMidD }, mid);
    // ground
    X.svg('rect', { x: -3000, y: hz + 40, width: 8000, height: 3000, fill: C.mGround }, near);
    X.svg('rect', { x: -3000, y: hz + 40, width: 8000, height: 26, fill: C.mGround2 }, near);
    // ground bands, craters, rocks (detail keeps camera moves readable)
    for (let i = 0; i < 5; i++) X.svg('rect', { x: -3000, y: hz + 110 + i * 95 + i * i * 12, width: 8000, height: 10 + i * 3, fill: C.mGround2, opacity: 0.55 }, near);
    for (let i = 0; i < 10; i++) {
      const cx = -1600 + rr() * 5000, cy = hz + 140 + rr() * 380, w = 50 + rr() * 90;
      X.svg('ellipse', { cx, cy, rx: w, ry: w * 0.28, fill: C.mGround2 }, near);
      X.svg('ellipse', { cx, cy: cy + w * 0.05, rx: w * 0.78, ry: w * 0.2, fill: '#8F4A30' }, near);
    }
    for (let i = 0; i < 110; i++) X.svg('circle', { cx: -1800 + rr() * 5600, cy: hz + 70 + rr() * 480, r: 2.5 + rr() * 4, fill: rr() < 0.5 ? C.mRock : '#C27450' }, near);
    for (let i = 0; i < (o.rocks ?? 48); i++) {
      const rx = -1800 + rr() * 5600, ry = hz + 70 + rr() * 460, rs = 8 + rr() * 34;
      X.svg('ellipse', { cx: rx, cy: ry, rx: rs * 1.6, ry: rs * 0.7, fill: C.mRock }, near);
      X.svg('ellipse', { cx: rx - rs * 0.3, cy: ry - rs * 0.3, rx: rs * 1.1, ry: rs * 0.55, fill: C.mRockL }, near);
    }
    if (o.fgRocks !== false) for (const [fx, fs] of [[-260, 1.0], [2150, 1.2], [4300, 0.9]]) {
      X.svg('path', { d: `M${fx - 260 * fs},1300 Q${fx - 240 * fs},${1080 - 120 * fs} ${fx - 40 * fs},${1060 - 150 * fs} Q${fx + 180 * fs},${1060 - 170 * fs} ${fx + 280 * fs},1300Z`, fill: C.mRock }, fg);
      X.svg('path', { d: `M${fx - 200 * fs},1300 Q${fx - 190 * fs},${1100 - 100 * fs} ${fx - 30 * fs},${1085 - 125 * fs} Q${fx + 120 * fs},${1080 - 140 * fs} ${fx + 170 * fs},1300Z`, fill: C.mRockL }, fg);
    }
    if (o.specks !== false) K.dust(ctx, fg, { n: 56, color: '#F6D2AC', r: 7, vx: 110, vy: -6, wob: 20, opacity: 0.7, area: [-600, hz - 200, 3100, 900], seed: (o.seed || 3) + 40 });
    return { sky, far, mid, near, act, fg, hz };
  };
  K.sun = (parent, x, y, r, o = {}) => {
    const g = X.svg('g', {}, parent);
    const base = o.pale ? '#FFF2D6' : '#FFE58A';
    X.svg('circle', { cx: x, cy: y, r: r * 2.4, fill: '#fff', opacity: 0.18 }, g);
    X.svg('circle', { cx: x, cy: y, r: r * 1.65, fill: '#fff', opacity: 0.28 }, g);
    X.svg('circle', { cx: x, cy: y, r, fill: base }, g);
    return g;
  };
  /** Drifting particles in an area (dust, snow, stars, bubbles) — pure function of t. */
  K.dust = (ctx, parent, o = {}) => {
    const n = o.n || 40, rr = X.rand(o.seed || 21), [ax, ay, aw, ah] = o.area || [-200, 0, 2320, 1080];
    const g = X.svg('g', { fill: o.color || '#fff', opacity: o.opacity ?? 0.6 }, parent);
    const ps = Array.from({ length: n }, () => ({ el: X.svg('circle', { r: (o.r || 5) * (0.5 + rr()) }, g), x: rr() * aw, y: rr() * ah, v: (o.vx ?? 60) * (0.6 + rr() * 0.8), vy: (o.vy ?? 0) * (0.6 + rr() * 0.8), ph: rr() * 6 }));
    K.hook((t) => {
      for (const p of ps) {
        const x = ax + ((p.x + p.v * t) % aw + aw) % aw, y = ay + ((p.y + p.vy * t + Math.sin(t * 1.3 + p.ph) * (o.wob ?? 14)) % ah + ah) % ah;
        p.el.setAttribute('cx', f2(x)); p.el.setAttribute('cy', f2(y));
        if (o.twinkle) p.el.setAttribute('opacity', f2(0.4 + 0.6 * Math.abs(Math.sin(t * 2 + p.ph))));
      }
    }, visOf(ctx));
    return g;
  };
  K.stars = (ctx, parent, n = 70, seed = 5) => K.dust(ctx, parent, { n, seed, r: 3.2, vx: 4, vy: 0, wob: 0, opacity: 0.9, twinkle: true, area: [-1400, -900, 4720, 2880] });

  // ------------------------------------------------------------------ props
  K.hab = (parent, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, parent);
    X.svg('rect', { x: -330, y: -18, width: 660, height: 30, rx: 10, fill: '#9AA4AE' }, g);
    X.svg('rect', { x: 210, y: -120, width: 200, height: 70, rx: 30, fill: '#E6EAED' }, g);
    X.svg('circle', { cx: 430, cy: -100, r: 78, fill: '#F1F3F5' }, g);
    X.svg('path', { d: 'M430,-178 A78,78 0 0 1 430,-22Z', fill: '#D9DFE4' }, g);
    X.svg('path', { d: 'M-280,-12 A280,250 0 0 1 280,-12Z', fill: '#F4F6F7' }, g);
    X.svg('path', { d: 'M60,-12 A280,250 0 0 0 0,-262 A220,250 0 0 1 280,-12Z', fill: '#DCE2E6' }, g);
    for (const yy of [-90, -170]) X.svg('rect', { x: -260, y: yy, width: 520, height: 8, fill: '#E3E8EC', opacity: 0.9 }, g);
    X.svg('rect', { x: -282, y: -46, width: 564, height: 30, fill: C.suitO }, g);
    for (const [cx, cy, r] of [[-130, -130, 30], [-30, -150, 30], [70, -130, 30]]) {
      X.svg('circle', { cx, cy, r: r + 9, fill: '#C3CAD2' }, g);
      X.svg('circle', { cx, cy, r, fill: '#3AA6D3' }, g);
      X.svg('path', { d: `M${cx - r * 0.6},${cy - r * 0.2} A${r * 0.7},${r * 0.7} 0 0 1 ${cx + r * 0.1},${cy - r * 0.65}`, fill: 'none', stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.8 }, g);
    }
    X.svg('rect', { x: 150, y: -120, width: 70, height: 108, rx: 14, fill: '#AEB8C2' }, g);
    X.svg('rect', { x: 162, y: -108, width: 46, height: 40, rx: 8, fill: '#3AA6D3' }, g);
    X.svg('rect', { x: -6, y: -330, width: 12, height: 80, fill: '#9AA4AE' }, g);
    X.svg('path', { d: 'M-50,-350 Q0,-300 50,-350 Q0,-325 -50,-350Z', fill: '#E6EAED' }, g);
    const light = X.svg('circle', { cx: 0, cy: -335, r: 9, fill: C.red }, g);
    return { g, light };
  };
  /** Six-wheeled rover with a solar deck and mast camera (scale 1 ≈ 420 px wide). */
  K.rover = (parent, x, y, s = 1, flip = false) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${flip ? -s : s} ${s})` }, parent);
    X.svg('rect', { x: -200, y: -150, width: 400, height: 22, rx: 6, fill: '#2A4F8F' }, g);
    for (let i = 0; i < 5; i++) X.svg('rect', { x: -192 + i * 78, y: -146, width: 70, height: 14, rx: 3, fill: '#3C76C8' }, g);
    X.svg('rect', { x: -150, y: -128, width: 300, height: 80, rx: 14, fill: '#E9ECEF' }, g);
    X.svg('rect', { x: 40, y: -128, width: 110, height: 80, rx: 14, fill: '#D0D6DC' }, g);
    X.svg('rect', { x: -130, y: -110, width: 90, height: 14, rx: 6, fill: C.suitO }, g);
    X.svg('rect', { x: 110, y: -250, width: 14, height: 110, fill: '#8C96A1' }, g);
    X.svg('rect', { x: 90, y: -282, width: 64, height: 40, rx: 10, fill: '#5B6875' }, g);
    X.svg('circle', { cx: 140, cy: -262, r: 11, fill: '#3AA6D3' }, g);
    X.svg('rect', { x: -170, y: -56, width: 340, height: 14, rx: 7, fill: '#7C8B99' }, g);
    for (const wx of [-150, 0, 150]) { X.svg('circle', { cx: wx, cy: -22, r: 34, fill: '#3B434C' }, g); X.svg('circle', { cx: wx, cy: -22, r: 14, fill: '#9AA4AE' }, g); }
    return g;
  };
  K.beacon = (ctx, el, period = 0.6) => K.hook((t) => el.setAttribute('opacity', (t % period) < period / 2 ? 1 : 0.25), visOf(ctx));
  K.rocket = (ctx, parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s }, visOf(ctx));
    const flame = X.svg('g', {}, g);
    X.svg('path', { d: 'M-34,0 Q-40,90 0,190 Q40,90 34,0Z', fill: '#FFB43C' }, flame);
    X.svg('path', { d: 'M-18,0 Q-22,60 0,120 Q22,60 18,0Z', fill: '#FFF0A0' }, flame);
    X.svg('path', { d: 'M-80,-10 L-46,-120 L-46,-20Z', fill: C.red }, g);
    X.svg('path', { d: 'M80,-10 L46,-120 L46,-20Z', fill: '#C41B17' }, g);
    X.svg('path', { d: 'M-50,-10 L-50,-260 Q-50,-380 0,-430 Q50,-380 50,-260 L50,-10Z', fill: '#F4F6F7' }, g);
    X.svg('path', { d: 'M18,-10 L18,-300 Q30,-360 0,-430 Q50,-380 50,-260 L50,-10Z', fill: '#DCE2E6' }, g);
    X.svg('path', { d: 'M-34,-370 Q0,-440 34,-370Z', fill: C.red }, g);
    X.svg('circle', { cx: 0, cy: -250, r: 26, fill: '#C3CAD2' }, g);
    X.svg('circle', { cx: 0, cy: -250, r: 19, fill: '#3AA6D3' }, g);
    X.svg('rect', { x: -50, y: -60, width: 100, height: 22, fill: C.suitO }, g);
    const fst = K.tf(flame, { s: 0 }, visOf(ctx));
    K.hook((t) => { flame.setAttribute('transform', `scale(${fst.s.toFixed(3)} ${(fst.s * (1 + 0.16 * Math.sin(t * 47) + 0.08 * Math.sin(t * 83))).toFixed(3)})`); }, visOf(ctx));
    K.tfs.splice(K.tfs.findIndex((q) => q.st === fst), 1);
    return { g, st, flame: fst };
  };
  K.planet = (parent, cx, cy, r, o = {}) => {
    const g = X.svg('g', {}, parent);
    const id = 'pl' + Math.round(cx) + '_' + Math.round(cy) + '_' + (o.kind || 'm') + Math.round(r);
    const cp = X.svg('clipPath', { id }, X.defs); X.svg('circle', { cx, cy, r }, cp);
    const inner = X.svg('g', { 'clip-path': `url(#${id})` }, g);
    if (o.kind === 'earth') {
      X.svg('circle', { cx, cy, r, fill: '#2F8FD8' }, inner);
      for (const [dx, dy, rx, ry] of [[-0.35, -0.2, 0.42, 0.3], [0.3, 0.25, 0.35, 0.42], [-0.1, 0.55, 0.3, 0.18]]) X.svg('ellipse', { cx: cx + dx * r, cy: cy + dy * r, rx: rx * r, ry: ry * r, fill: '#5CC24A' }, inner);
      X.svg('ellipse', { cx: cx + 0.1 * r, cy: cy - 0.55 * r, rx: 0.5 * r, ry: 0.1 * r, fill: '#fff', opacity: 0.8 }, inner);
    } else {
      X.svg('circle', { cx, cy, r, fill: C.planet }, inner);
      for (const [dx, dy, rx, ry] of [[-0.4, 0.1, 0.35, 0.18], [0.25, -0.25, 0.3, 0.14], [0.1, 0.45, 0.42, 0.16], [-0.15, -0.5, 0.2, 0.1]]) X.svg('ellipse', { cx: cx + dx * r, cy: cy + dy * r, rx: rx * r, ry: ry * r, fill: C.planetD }, inner);
      X.svg('ellipse', { cx, cy: cy - r * 0.95, rx: r * 0.45, ry: r * 0.16, fill: '#FBF3EA' }, inner);
    }
    X.svg('circle', { cx: cx + r * 0.55, cy: cy + r * 0.1, r: r * 1.05, fill: '#000', opacity: 0.16 }, inner);
    const face = X.svg('g', { opacity: 0 }, g);
    if (o.face) {
      const e = r * 0.09;
      const L = X.svg('ellipse', { cx: cx - r * 0.3, cy: cy - r * 0.02, rx: e * 0.75, ry: e, fill: C.eye }, face);
      const R = X.svg('ellipse', { cx: cx + r * 0.22, cy: cy - r * 0.02, rx: e * 0.75, ry: e, fill: C.eye }, face);
      const bl = X.svg('rect', { x: cx - r * 0.42, y: cy - r * 0.25, width: r * 0.24, height: e * 0.7, rx: e * 0.35, fill: '#7A2E19' }, face);
      const br = X.svg('rect', { x: cx + r * 0.1, y: cy - r * 0.25, width: r * 0.24, height: e * 0.7, rx: e * 0.35, fill: '#7A2E19' }, face);
      const m = X.svg('path', { d: `M${cx - r * 0.2},${cy + r * 0.2} Q${cx - r * 0.04},${cy + r * 0.42} ${cx + r * 0.12},${cy + r * 0.2}Z`, fill: '#5B2730' }, face);
      gsap.set([bl, br], { transformOrigin: '50% 50%' });
      return { g, face, eyes: [L, R], brows: [bl, br], mouth: m, cx, cy, r };
    }
    return { g, cx, cy, r };
  };
  K.gauge = (parent, x, y, r = 170) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, parent);
    X.svg('circle', { r: r + 22, fill: '#5B6875' }, g);
    X.svg('circle', { r, fill: '#fff' }, g);
    const arc = (a0, a1, col) => {
      const p = (a) => [Math.cos(a * Math.PI / 180) * r * 0.78, Math.sin(a * Math.PI / 180) * r * 0.78];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      X.svg('path', { d: `M${f2(x0)},${f2(y0)} A${r * 0.78},${r * 0.78} 0 0 1 ${f2(x1)},${f2(y1)}`, fill: 'none', stroke: col, 'stroke-width': r * 0.16 }, g);
    };
    arc(150, 200, C.red); arc(200, 270, C.hi); arc(270, 390, '#52C46A');
    X.svg('text', { x: 0, y: r * 0.5, 'text-anchor': 'middle', 'font-size': r * 0.17, 'font-weight': 800, 'font-family': 'Montserrat', fill: '#5B6875', text: 'AIR PRESSURE' }, g);
    const needle = X.svg('g', {}, g);
    X.svg('path', { d: `M-10,0 L0,${-r * 0.72} L10,0Z`, fill: C.slate }, needle);
    X.svg('circle', { r: 18, fill: C.slate }, g);
    const st = K.tf(needle, { r: 60 });
    return { g, needle: st };
  };
  K.molecule = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent);
    X.svg('rect', { x: -110, y: -9, width: 220, height: 18, rx: 9, fill: '#D9DEE3' }, g);
    for (const [cx, r, c1, c2] of [[-110, 46, '#F25C54', '#D9443D'], [110, 46, '#F25C54', '#D9443D'], [0, 56, '#55606B', '#424C56']]) {
      X.svg('circle', { cx, cy: 0, r, fill: c2 }, g); X.svg('circle', { cx: cx - r * 0.12, cy: -r * 0.12, r: r * 0.84, fill: c1 }, g);
      X.svg('circle', { cx: cx - r * 0.38, cy: -r * 0.38, r: r * 0.16, fill: '#fff', opacity: 0.55 }, g);
    }
    const st = K.tf(g, { x, y, s });
    return { g, st };
  };
  K.stopwatch = (parent, x, y, r = 150) => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s: 1 });
    X.svg('rect', { x: -28, y: -r - 52, width: 56, height: 40, rx: 10, fill: '#C41B17' }, g);
    X.svg('rect', { x: r * 0.55, y: -r * 0.95, width: 40, height: 30, rx: 8, fill: '#C41B17', transform: `rotate(40 ${r * 0.55} ${-r * 0.95})` }, g);
    X.svg('circle', { r: r + 20, fill: C.red }, g);
    X.svg('circle', { r, fill: '#fff' }, g);
    for (let i = 0; i < 12; i++) { const a = i * 30 * Math.PI / 180; X.svg('rect', { x: -4, y: -r + 12, width: 8, height: i % 3 ? 16 : 28, rx: 4, fill: '#9AA4AE', transform: `rotate(${i * 30})` }, g); }
    const txt = X.svg('text', { x: 0, y: r * 0.55, 'text-anchor': 'middle', 'font-size': r * 0.34, 'font-weight': 800, 'font-family': 'Montserrat', fill: C.ink, text: '15' }, g);
    const hand = X.svg('g', {}, g);
    X.svg('rect', { x: -5, y: -r * 0.82, width: 10, height: r * 0.86, rx: 5, fill: C.red }, hand);
    X.svg('circle', { r: 14, fill: C.slate }, g);
    const hs = K.tf(hand, { r: 0 });
    return { g, st, hand: hs, txt };
  };
  K.thermo = (parent, x, y, h = 560) => {
    const g = X.svg('g', { transform: `translate(${x} ${y})` }, parent);
    X.svg('rect', { x: -58, y: -h, width: 116, height: h, rx: 58, fill: '#fff', filter: K.F.pshadow }, g);
    X.svg('circle', { cx: 0, cy: 30, r: 92, fill: '#fff' }, g);
    X.svg('rect', { x: -30, y: -h + 28, width: 60, height: h, rx: 30, fill: '#DCEEF5' }, g);
    X.svg('circle', { cx: 0, cy: 30, r: 66, fill: C.red }, g);
    const merc = X.svg('rect', { x: -30, y: -h + 40, width: 60, height: h - 10, rx: 30, fill: C.red }, g);
    for (let i = 0; i < 9; i++) X.svg('rect', { x: 64, y: -h + 70 + i * (h - 120) / 8, width: i % 2 ? 26 : 44, height: 8, rx: 4, fill: '#7C8B99' }, g);
    const lvl = { v: 0.85 };
    K.hook(() => { const hh = (h - 30) * lvl.v + 40; merc.setAttribute('y', f2(30 - hh)); merc.setAttribute('height', f2(hh)); });
    return { g, lvl };
  };
  K.panel = (parent, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, parent);
    X.svg('rect', { x: -10, y: -130, width: 20, height: 130, fill: '#8A949E' }, g);
    X.svg('path', { d: 'M-170,-250 L170,-250 L210,-130 L-210,-130Z', fill: '#2A4F8F' }, g);
    for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) {
      const t0 = j / 2, t1 = (j + 1) / 2, a = -170 - 40 * t0, b = -170 - 40 * t1, w0 = 340 + 80 * t0, w1 = 340 + 80 * t1;
      const x0 = a + w0 * (i / 4) + 6, x1 = a + w0 * ((i + 1) / 4) - 6, x2 = b + w1 * ((i + 1) / 4) - 6, x3 = b + w1 * (i / 4) + 6;
      const y0 = -250 + 120 * t0 + 6, y1 = -250 + 120 * t1 - 6;
      X.svg('path', { d: `M${f2(x0)},${y0} L${f2(x1)},${y0} L${f2(x2)},${y1} L${f2(x3)},${y1}Z`, fill: (i + j) % 2 ? '#3C76C8' : '#4383D6' }, g);
    }
    X.svg('path', { d: 'M-120,-250 L-60,-250 L-110,-130 L-170,-130Z', fill: '#fff', opacity: 0.18 }, g);
    return g;
  };
  K.calendar = (parent, x, y, s = 1, label = 'WEEKS') => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s });
    X.svg('rect', { x: -130, y: -150, width: 260, height: 290, rx: 24, fill: '#fff', filter: K.F.pshadow }, g);
    X.svg('path', { d: 'M-130,-80 L-130,-126 Q-130,-150 -106,-150 L106,-150 Q130,-150 130,-126 L130,-80Z', fill: C.red }, g);
    for (const cx of [-70, 70]) X.svg('rect', { x: cx - 10, y: -178, width: 20, height: 56, rx: 10, fill: '#5B6875' }, g);
    const page = X.svg('rect', { x: -130, y: -80, width: 260, height: 220, rx: 0, fill: '#F3F3F3' }, g);
    const txt = X.svg('text', { x: 0, y: 40, 'text-anchor': 'middle', 'font-size': 64, 'font-weight': 900, 'font-family': 'Montserrat', fill: C.ink, text: label }, g);
    const flip = X.svg('rect', { x: -130, y: -80, width: 260, height: 220, fill: '#E4E4E4', opacity: 0 }, g);
    gsap.set(flip, { transformOrigin: '50% 0%' });
    return { g, st, txt, flip };
  };
  K.flipPages = (cal, t, n = 4, each = 0.16) => {
    for (let i = 0; i < n; i++) {
      X.tl.fromTo(cal.flip, { scaleY: 1, opacity: 1 }, { scaleY: 0, opacity: 0.6, duration: each, ease: 'power2.in', immediateRender: false }, t + i * each);
      X.sfx(t + i * each, 'paper', { dur: 0.15, gain: 0.25 });
    }
    X.tl.set(cal.flip, { opacity: 0 }, t + n * each);
  };
  K.potato = (parent, x, y, s = 1, seed = 1) => {
    const g = X.svg('g', {}, parent), rr = X.rand(seed);
    const st = K.tf(g, { x, y, s, r: (rr() - 0.5) * 40 });
    X.svg('path', { d: 'M-52,-6 Q-56,-40 -14,-42 Q30,-46 50,-22 Q64,4 40,28 Q4,48 -32,30 Q-56,18 -52,-6Z', fill: '#B67F49' }, g);
    X.svg('path', { d: 'M-46,-10 Q-48,-36 -12,-37 Q26,-40 42,-20 Q50,-2 34,10 Q2,22 -26,14 Q-48,8 -46,-10Z', fill: '#CC9457' }, g);
    for (const [ex, ey] of [[-20, -16], [14, -22], [24, 4], [-8, 8]]) X.svg('circle', { cx: ex, cy: ey, r: 3.5, fill: '#8A5A2E' }, g);
    return { g, st };
  };
  K.tray = (parent, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, parent);
    X.svg('path', { d: 'M-420,-60 L420,-60 L380,60 L-380,60Z', fill: '#8C97A3' }, g);
    X.svg('path', { d: 'M-400,-60 Q-200,-110 0,-84 Q220,-112 400,-60Z', fill: '#7A4A2E' }, g);
    X.svg('rect', { x: -420, y: -66, width: 840, height: 20, rx: 8, fill: '#A7B1BC' }, g);
    for (let i = 0; i < 14; i++) X.svg('circle', { cx: -360 + i * 55, cy: -78 + (i % 3) * 6, r: 6, fill: '#E9F1F4', opacity: 0.7 }, g); // salt crystals
    return g;
  };
  K.bucket = (ctx, parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s }, visOf(ctx));
    X.svg('path', { d: 'M-90,-120 Q0,-230 90,-120', fill: 'none', stroke: '#7C8B99', 'stroke-width': 12 }, g);
    X.svg('path', { d: 'M-100,-120 L100,-120 L80,60 L-80,60Z', fill: '#A9B4BF' }, g);
    X.svg('path', { d: 'M30,-120 L100,-120 L80,60 L22,60Z', fill: '#929EAA' }, g);
    X.svg('rect', { x: -112, y: -140, width: 224, height: 30, rx: 12, fill: '#7C8B99' }, g);
    const stink = X.svg('g', { fill: 'none', stroke: '#8BC34A', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0 }, g);
    const lines = [-50, 0, 50].map((dx) => X.svg('path', { d: `M${dx},-160 q-20,-30 0,-60 q20,-30 0,-60`, stroke: '#8BC34A' }, stink));
    K.hook((t) => lines.forEach((l, i) => l.setAttribute('transform', `translate(${f2(Math.sin(t * 5 + i * 2) * 8)} ${f2(-((t * 40 + i * 25) % 30))})`)), visOf(ctx));
    return { g, st, stink };
  };
  K.crate = (parent, x, y, s = 1, label) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, parent);
    X.svg('rect', { x: -90, y: -170, width: 180, height: 170, rx: 10, fill: '#D29A55' }, g);
    X.svg('rect', { x: 30, y: -170, width: 60, height: 170, rx: 10, fill: '#BD8546' }, g);
    for (const yy of [-170, -95, -24]) X.svg('rect', { x: -90, y: yy, width: 180, height: 22, fill: '#B37A3C' }, g);
    if (label) X.svg('text', { x: -10, y: -62, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 800, 'font-family': 'Montserrat', fill: '#7A4A1E', text: label }, g);
    return g;
  };
  K.ice = (parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s });
    X.svg('path', { d: 'M-60,-20 L-30,-62 L40,-56 L66,-6 L36,48 L-40,44Z', fill: '#8FDDF3' }, g);
    X.svg('path', { d: 'M-30,-62 L40,-56 L66,-6 L10,-10Z', fill: '#C9F1FB' }, g);
    X.svg('path', { d: 'M-60,-20 L-30,-62 L10,-10 L-40,44Z', fill: '#A9E7F7' }, g);
    return { g, st };
  };
  K.pickaxe = (parent) => {
    const g = X.svg('g', {}, parent);
    X.svg('rect', { x: -9, y: -10, width: 18, height: 230, rx: 8, fill: '#9C6B3C' }, g);
    X.svg('path', { d: 'M-120,-6 Q0,-70 120,-6 Q0,-36 -120,-6Z', fill: '#7C8B99' }, g);
    return g;
  };
  K.pot = (ctx, parent, x, y, s = 1) => {
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x, y, s }, visOf(ctx));
    X.svg('rect', { x: -150, y: 0, width: 300, height: 40, rx: 12, fill: '#5B6875' }, g);
    X.svg('rect', { x: -110, y: -8, width: 220, height: 14, rx: 6, fill: '#FF6A3D' }, g);
    X.svg('path', { d: 'M-120,-150 L120,-150 L104,-10 L-104,-10Z', fill: '#9AA4AE' }, g);
    X.svg('path', { d: 'M40,-150 L120,-150 L104,-10 L36,-10Z', fill: '#86909B' }, g);
    X.svg('rect', { x: -140, y: -166, width: 280, height: 24, rx: 10, fill: '#7C8B99' }, g);
    const steam = X.svg('g', { fill: 'none', stroke: '#fff', 'stroke-width': 12, 'stroke-linecap': 'round', opacity: 0 }, g);
    const ws = [-60, 0, 60].map((dx) => X.svg('path', { d: `M${dx},-190 q-24,-36 0,-72 q24,-36 0,-72` }, steam));
    K.hook((t) => ws.forEach((w, i) => { const ph = ((t * 0.9 + i * 0.33) % 1); w.setAttribute('transform', `translate(0 ${f2(-ph * 60)})`); w.setAttribute('opacity', f2(Math.sin(ph * Math.PI))); }), visOf(ctx));
    return { g, st, steam };
  };
  /** Tablet held in first-person POV hands. Returns {g, st, screen:{x,y,w,h}, content}. */
  K.tablet = (ctx, parent, o = {}) => {
    const W = o.w || 1180, H = o.h || 720, cx = 960, cy = o.cy || 560;
    const g = X.svg('g', {}, parent);
    const st = K.tf(g, { x: 0, y: 0 }, visOf(ctx));
    // forearms + ball fists (oversized, from the bottom corners)
    for (const sgn of [-1, 1]) {
      const hx = cx + sgn * (W / 2 + 6), hy = cy + 110, bx = cx + sgn * (W / 2 + 330), by = 1260;
      const dx = hx - bx, dy = hy - by, l = Math.hypot(dx, dy), nx = -dy / l, ny = dx / l;
      const q = (x, y) => f2(x) + ',' + f2(y);
      X.svg('path', { d: `M${q(bx + nx * 95, by + ny * 95)} L${q(hx + nx * 62, hy + ny * 62)} L${q(hx - nx * 62, hy - ny * 62)} L${q(bx - nx * 95, by - ny * 95)}Z`, fill: C.skin }, g);
      X.svg('path', { d: `M${q(bx + nx * sgn * 95, by + ny * sgn * 95)} L${q(hx + nx * sgn * 62, hy + ny * sgn * 62)} L${q(hx + nx * sgn * 20, hy + ny * sgn * 20)} L${q(bx + nx * sgn * 30, by + ny * sgn * 30)}Z`, fill: C.skinD }, g);
    }
    X.svg('rect', { x: cx - W / 2 - 26, y: cy - H / 2 - 26, width: W + 52, height: H + 52, rx: 46, fill: '#2E3A48' }, g);
    X.svg('rect', { x: cx - W / 2 - 26, y: cy + H / 2 - 30, width: W + 52, height: 56, rx: 26, fill: '#26313D' }, g);
    const sid = 'scr' + Math.round(cy);
    const cp = X.svg('clipPath', { id: sid }, X.defs); X.svg('rect', { x: cx - W / 2, y: cy - H / 2, width: W, height: H, rx: 14 }, cp);
    const content = X.svg('g', { 'clip-path': `url(#${sid})` }, g);
    X.svg('rect', { x: cx - W / 2, y: cy - H / 2, width: W, height: H, fill: '#fff' }, content);
    for (const sgn of [-1, 1]) {
      const hx = cx + sgn * (W / 2 + 6), hy = cy + 110;
      X.svg('circle', { cx: hx, cy: hy, r: 92, fill: C.skinD }, g);
      X.svg('circle', { cx: hx - sgn * 10, cy: hy - 12, r: 78, fill: C.skin }, g);
      X.svg('ellipse', { cx: hx - sgn * 70, cy: hy - 40, rx: 44, ry: 30, fill: C.skin }, g); // thumb over the bezel
    }
    K.hook((t) => { st.y = Math.sin(t * Math.PI) * 8; st.x = Math.sin(t * 1.7) * 6; }, visOf(ctx));
    return { g, st, content, screen: { x: cx - W / 2, y: cy - H / 2, w: W, h: H } };
  };
  /** Schematic orbit diagram: sun, two orbit rings, planets driven by angle state {e, m} (degrees). */
  K.orbits = (ctx, parent, cx, cy, o = {}) => {
    const g = X.svg('g', {}, parent), rE = o.rE || 250, rM = o.rM || 400;
    for (const r of [rE, rM]) X.svg('circle', { cx, cy, r, fill: 'none', stroke: '#fff', 'stroke-width': 5, opacity: 0.45, 'stroke-dasharray': '2 16', 'stroke-linecap': 'round' }, g);
    K.sun(g, cx, cy, 70);
    const E = X.svg('g', {}, g), M = X.svg('g', {}, g);
    K.planet(E, 0, 0, 34, { kind: 'earth' }); K.planet(M, 0, 0, 30);
    const lE = X.svg('text', { x: 0, y: 72, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, 'font-family': 'Montserrat', fill: '#fff', text: 'EARTH' }, E);
    X.svg('text', { x: 0, y: 66, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, 'font-family': 'Montserrat', fill: '#fff', text: 'MARS' }, M);
    const ang = { e: o.e ?? 200, m: o.m ?? 20 };
    K.hook(() => {
      const a = ang.e * Math.PI / 180, b = ang.m * Math.PI / 180;
      E.setAttribute('transform', `translate(${f2(cx + Math.cos(a) * rE)} ${f2(cy + Math.sin(a) * rE)})`);
      M.setAttribute('transform', `translate(${f2(cx + Math.cos(b) * rM)} ${f2(cy + Math.sin(b) * rM)})`);
    }, visOf(ctx));
    return { g, ang, E, M, rE, rM, cx, cy };
  };
  K.devil = (ctx, parent, x, y, s = 1) => {
    const g = X.svg('g', { opacity: 0.55 }, parent);
    const st = K.tf(g, { x, y, s }, visOf(ctx));
    const bands = [0, 1, 2, 3, 4].map((i) => X.svg('ellipse', { cx: 0, cy: -i * 60, rx: 30 + i * 22, ry: 14 + i * 4, fill: C.mDust }, g));
    K.hook((t) => bands.forEach((b, i) => b.setAttribute('cx', f2(Math.sin(t * 4 + i * 0.9) * (6 + i * 7)))), visOf(ctx));
    return { g, st };
  };
  /** Original channel mark for samples ("WORST CASE"): white badge with a red "!" + wordmark. */
  K.mark = (parent, x, y, s = 1) => {
    const g = X.svg('g', { transform: `translate(${x} ${y}) scale(${s})` }, parent);
    X.svg('rect', { x: -70, y: -70, width: 140, height: 140, rx: 36, fill: '#fff', transform: 'rotate(-8)' }, g);
    X.svg('rect', { x: -14, y: -46, width: 28, height: 62, rx: 12, fill: C.red, transform: 'rotate(-8)' }, g);
    X.svg('circle', { cx: 4, cy: 36, r: 15, fill: C.red, transform: 'rotate(-8)' }, g);
    return g;
  };

  // ------------------------------------------------------------------ transitions (analysis §7)
  K.tx = {};
  /** T4 zoom-through: dim A's surroundings, push the camera until `rect` fills the frame, B settles in. */
  K.tx.zoomThrough = (A, B, T, rect, o = {}) => {
    const dur = o.dur || 0.55, sc = Math.max(1920 / rect.w, 1080 / rect.h);
    if (o.dim) X.tl.fromTo(o.dim, { attr: { opacity: 0 } }, { attr: { opacity: 0.42 }, duration: 0.25, immediateRender: false }, T - dur - 0.2);
    K.zoomTo(A, T - dur, [rect.x + rect.w / 2, rect.y + rect.h / 2], sc, dur, 'power3.in');
    X.tl.fromTo(B.rig, { s: B.plan.s * 1.14 }, { s: B.plan.s, duration: 0.7, ease: 'expo.out', immediateRender: false }, T);
    X.sfx(T - dur, 'zoom_in', { dur: dur + 0.1, gain: 0.45 });
  };
  /** T1 smash zoom-out: B starts at `from` scale centred on (fx, fy) and lands on its plan in 0.8 s expo.out. */
  K.tx.smashOut = (A, B, T, fx, fy, from = 6, o = {}) => {
    const end = { ...B.plan };
    X.tl.fromTo(B.rig, { s: from, x: fx - 960, y: fy - 540 }, { s: end.s, x: end.x, y: end.y, duration: o.dur || 0.85, ease: 'expo.out', immediateRender: false }, T);
    X.tl.fromTo(B.g, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none', immediateRender: false }, T);
    X.sfx(T, 'zoom_out', { dur: 0.6, gain: 0.5 });
    X.sfx(T, 'whoosh', { dur: 0.5, gain: 0.35 });
  };
  /** T1 smash push-in: A rushes into (fx, fy), B lands from 1.3× with expo.out. */
  K.tx.smashIn = (A, B, T, fx, fy, o = {}) => {
    K.zoomTo(A, T - 0.3, [fx, fy], A.plan.s * (o.k || 3), 0.3, 'power3.in');
    const end = { ...B.plan };
    X.tl.fromTo(B.rig, { s: end.s * 1.35 }, { s: end.s, duration: 0.6, ease: 'expo.out', immediateRender: false }, T);
    X.tl.fromTo(B.g, { opacity: 0 }, { opacity: 1, duration: 0.1, ease: 'none', immediateRender: false }, T);
    X.sfx(T - 0.3, 'zoom_in', { dur: 0.4, gain: 0.45 });
    if (o.hit !== false) X.sfx(T, 'impact', { dur: 0.5, gain: 0.3 });
  };
  /** T2 whip-pan / whip-tilt: 0.15 s power4.in smear out, swap on the blurriest frame, 0.45 s power3.out settle. */
  K.tx.whip = (A, B, T, dir = 1, vertical = false) => {
    const k = vertical ? 'y' : 'x', D = (vertical ? 1080 : 1920) * dir;
    const a1 = { ...A.plan }; a1[k] += D * 1.3 / A.plan.s;
    X.tl.fromTo(A.rig, { [k]: A.plan[k] }, { [k]: a1[k], duration: 0.15, ease: 'power4.in', immediateRender: false }, T - 0.15);
    X.tl.fromTo(B.rig, { [k]: B.plan[k] - D * 0.5 / B.plan.s }, { [k]: B.plan[k], duration: 0.45, ease: 'power3.out', immediateRender: false }, T);
    const f = vertical ? K.F.whipV : K.F.whipH;
    X.tl.set(A.g, { attr: { filter: f } }, T - 0.1); X.tl.set(A.g, { attr: { filter: 'none' } }, T + 0.01);
    X.tl.set(B.g, { attr: { filter: f } }, T); X.tl.set(B.g, { attr: { filter: 'none' } }, T + 0.14);
    X.sfx(T - 0.15, 'whoosh', { dur: 0.4, gain: 0.55 });
  };
  /** T15 colour-field flood from a point; B's own field must be the same colour. */
  K.tx.flood = (A, B, T, color, x = 960, y = 540) => {
    const c = X.svg('circle', { cx: x, cy: y, r: 2300, fill: color, opacity: 0 }, K.top);
    gsap.set(c, { transformOrigin: '50% 50%', scale: 0 });
    X.tl.set(c, { opacity: 1 }, T - 0.25);
    X.tl.fromTo(c, { scale: 0 }, { scale: 1, duration: 0.25, ease: 'power2.inOut', immediateRender: false }, T - 0.25);
    X.tl.set(c, { opacity: 0 }, T + 0.04);
    X.sfx(T - 0.25, 'swoosh', { dur: 0.3, gain: 0.45 });
  };
  /** T8 flat shape wipe: diagonal bands in palette colours (cover 0.33 s, hold 3 f, reveal 0.33 s). */
  K.tx.bands = (A, B, T, colors = [C.cyan, '#fff', C.navy, C.gold], o = {}) => {
    const g = X.svg('g', { transform: `rotate(${o.angle ?? -30} 960 540)` }, K.top);
    const n = colors.length, bh = 2400 / n;
    colors.forEach((col, i) => {
      const r = X.svg('rect', { x: -1400, y: -660 + i * bh, width: 4800, height: bh + 2, fill: col, opacity: 0 }, g);
      const dt = i * 0.06;
      X.tl.set(r, { opacity: 1 }, T - 0.4 + dt);
      X.tl.fromTo(r, { x: -4800 }, { x: -1000, duration: 0.33, ease: 'power2.inOut', immediateRender: false }, T - 0.4 + dt);
      X.tl.to(r, { x: 3800, duration: 0.33, ease: 'power2.inOut' }, T + 0.1 + dt);
      X.tl.set(r, { opacity: 0 }, T + 0.5 + dt);
    });
    X.sfx(T - 0.4, 'swoosh', { dur: 0.4, gain: 0.45 }); X.sfx(T + 0.1, 'swoosh', { dur: 0.4, gain: 0.35, pitch: 1.2 });
  };
  /** T8 circle burst: N discs pop to cover, scene swaps, discs shrink away. */
  K.tx.circles = (A, B, T, colors = [C.coral, C.gold, C.cyan], o = {}) => {
    const g = X.svg('g', {}, K.top), rr = X.rand(o.seed || 9);
    const pts = [[960, 540], [300, 250], [1600, 260], [350, 860], [1620, 860], [960, 120], [960, 980], [80, 540], [1840, 540]];
    pts.forEach(([x, y], i) => {
      const c = X.svg('circle', { cx: x, cy: y, r: 620, fill: colors[i % colors.length], opacity: 0 }, g);
      gsap.set(c, { transformOrigin: '50% 50%', scale: 0 });
      const dt = rr() * 0.12;
      X.tl.set(c, { opacity: 1 }, T - 0.36 + dt);
      X.tl.fromTo(c, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, T - 0.36 + dt);
      X.tl.to(c, { scale: 0, duration: 0.3, ease: 'power2.in' }, T + 0.06 + dt);
      X.tl.set(c, { opacity: 0 }, T + 0.4 + dt);
    });
    X.sfx(T - 0.36, 'pop', { gain: 0.4, pitch: 0.8 }); X.sfx(T - 0.25, 'pop', { gain: 0.35, pitch: 1.1 }); X.sfx(T + 0.1, 'swoosh', { dur: 0.35, gain: 0.35 });
  };
  /** T9 liquid/dust wipe: an organic wave front sweeps left→right; B is revealed inside it (clipPath). */
  K.tx.liquid = (A, B, T, color = C.mDust, o = {}) => {
    const dur = o.dur || 0.55, p = { v: 0 }, id = 'lq' + Math.round(T * 100);
    const cp = X.svg('clipPath', { id }, X.defs), path = X.svg('path', { d: 'M-100,-100Z' }, cp);
    const front = X.svg('path', { fill: color, opacity: 0 }, K.top);
    X.tl.set(B.g, { attr: { 'clip-path': `url(#${id})` } }, T - dur / 2);
    X.tl.set(B.g, { attr: { 'clip-path': 'none' } }, T + dur / 2 + 0.02);
    X.tl.set(front, { opacity: 1 }, T - dur / 2); X.tl.set(front, { opacity: 0 }, T + dur / 2 + 0.02);
    X.tl.fromTo(p, { v: 0 }, { v: 1, duration: dur, ease: 'power2.out', immediateRender: false }, T - dur / 2);
    const edge = (v, off) => {
      const pts = [];
      for (let y = -100; y <= 1180; y += 60) pts.push([-400 + v * 2900 + off + 90 * Math.sin(y / 150 + v * 9) + 50 * Math.sin(y / 61 - v * 6), y]);
      return pts;
    };
    const js = (pts) => pts.map((q) => f2(q[0]) + ',' + q[1]).join(' L');
    K.hook((t) => {
      if (t < T - dur / 2 - 0.02 || t > T + dur / 2 + 0.05) return;
      const e0 = edge(p.v, 0), e1 = edge(p.v, 170);
      path.setAttribute('d', 'M-200,-100 L' + js(e0) + ' L-200,1180Z');
      front.setAttribute('d', 'M' + js(e0) + ' L' + js(e1.reverse()) + 'Z');
    });
    X.sfx(T - dur / 2, 'woosh_low', { dur: dur + 0.2, gain: 0.6 });
  };
  /** T6 blink: almond black lids close (0.3 s sine.in), 1 black frame, open on B (0.4 s) focusing in from blur. */
  K.tx.blink = (A, B, T) => {
    const top = X.svg('path', { fill: '#000', opacity: 0 }, K.top), bot = X.svg('path', { fill: '#000', opacity: 0 }, K.top);
    const p = { v: 0 };
    X.tl.set([top, bot], { opacity: 1 }, T - 0.33);
    X.tl.fromTo(p, { v: 0 }, { v: 1, duration: 0.3, ease: 'sine.in', immediateRender: false }, T - 0.33);
    X.tl.to(p, { v: 0, duration: 0.42, ease: 'sine.out' }, T + 0.03);
    X.tl.set([top, bot], { opacity: 0 }, T + 0.47);
    X.tl.set(B.g, { attr: { filter: 'url(#focusB)' } }, T);
    X.tl.fromTo(K.focusSt, { b: 14 }, { b: 0, duration: 0.55, ease: 'power2.out', immediateRender: false }, T);
    X.tl.set(B.g, { attr: { filter: 'none' } }, T + 0.56);
    K.hook((t) => {
      if (t < T - 0.35 || t > T + 0.5) return;
      const v = p.v, e = -60 + v * 600, m = -60 + v * 660;
      top.setAttribute('d', `M-50,-50 H1970 V${f2(e)} Q960,${f2(m + v * 60)} -50,${f2(e)}Z`);
      bot.setAttribute('d', `M-50,1130 H1970 V${f2(1080 - e)} Q960,${f2(1080 - m - v * 60)} -50,${f2(1080 - e)}Z`);
    });
  };
  /** T7 push slide: A exits left while B enters from the right at the same speed (0.8 s power2.inOut). */
  K.tx.slide = (A, B, T, dir = 1) => {
    X.tl.fromTo(A.g, { x: 0 }, { x: -1920 * dir, duration: 0.8, ease: 'power2.inOut', immediateRender: false }, T - 0.4);
    X.tl.fromTo(B.g, { x: 1920 * dir }, { x: 0, duration: 0.8, ease: 'power2.inOut', immediateRender: false }, T - 0.4);
    X.sfx(T - 0.4, 'slide', { dur: 0.7, gain: 0.5 });
  };
  /** T14 + iris: A's camera dives into a letter (fx, fy) until white fills the frame; B opens in a growing circle. */
  K.tx.letterZoom = (A, B, T, fx, fy, o = {}) => {
    K.zoomTo(A, T - 0.4, [fx, fy], o.k || 200, 0.4, 'power2.in', o.r ?? 0); // k big enough that the last frames are solid
    const id = 'ir' + Math.round(T * 100);
    const cp = X.svg('clipPath', { id }, X.defs), c = X.svg('circle', { cx: o.ix ?? 960, cy: o.iy ?? 540, r: 0 }, cp);
    X.tl.set(B.g, { attr: { 'clip-path': `url(#${id})` } }, T);
    X.tl.fromTo(c, { attr: { r: 0 } }, { attr: { r: 1150 }, duration: 0.45, ease: 'power2.out', immediateRender: false }, T);
    X.tl.set(B.g, { attr: { 'clip-path': 'none' } }, T + 0.46);
    X.sfx(T - 0.4, 'zoom_in', { dur: 0.45, gain: 0.45 });
    X.sfx(T, 'swoosh', { dur: 0.35, gain: 0.35 });
  };
  /** T5 burst-through: white disc with a coloured hole expands from a point; paint splats fly off. */
  K.tx.burst = (A, B, T, color, x = 960, y = 540) => {
    const g = X.svg('g', { opacity: 0 }, K.top);
    const w = X.svg('circle', { cx: x, cy: y, r: 1400, fill: '#fff' }, g), h = X.svg('circle', { cx: x, cy: y, r: 1400, fill: color }, g);
    gsap.set([w, h], { transformOrigin: '50% 50%', scale: 0 });
    X.tl.set(g, { opacity: 1 }, T - 0.3);
    X.tl.fromTo(w, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(1.4)', immediateRender: false }, T - 0.3);
    X.tl.fromTo(h, { scale: 0 }, { scale: 1, duration: 0.3, ease: 'power2.out', immediateRender: false }, T - 0.18);
    X.tl.set(g, { opacity: 0 }, T + 0.13);
    const rr = X.rand(31);
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 + rr(), d = 700 + rr() * 400;
      const b = X.svg('ellipse', { cx: 0, cy: 0, rx: 26 + rr() * 30, ry: 18 + rr() * 16, fill: i % 2 ? '#fff' : color, opacity: 0 }, K.top);
      const st = K.tf(b, { x, y, s: 0.3, r: rr() * 180 });
      X.tl.set(b, { opacity: 1 }, T - 0.25);
      X.tl.fromTo(st, { x, y, s: 0.3 }, { x: x + Math.cos(a) * d, y: y + Math.sin(a) * d, s: 1.4, r: st.r + 200, duration: 0.6, ease: 'power2.out', immediateRender: false }, T - 0.25);
      X.tl.set(b, { opacity: 0 }, T + 0.4);
    }
    X.sfx(T - 0.3, 'pop', { gain: 0.5, pitch: 0.7 }); X.sfx(T - 0.2, 'whoosh', { dur: 0.4, gain: 0.4 });
  };
  /** T3 foreground-occluder wipe: a big flat shape sweeps across in front, the swap happens behind it. */
  K.tx.occluder = (A, B, T, build, dir = -1) => {
    const g = X.svg('g', { opacity: 0 }, K.top);
    build(g);
    const st = K.tf(g, { x: -dir * 2300 });
    X.tl.set(g, { opacity: 1 }, T - 0.25);
    X.tl.fromTo(st, { x: -dir * 2300 }, { x: dir * 2300, duration: 0.55, ease: 'power2.inOut', immediateRender: false }, T - 0.275);
    X.tl.set(g, { opacity: 0 }, T + 0.3);
    K.move(A, T - 0.3, { x: A.plan.x - dir * 260 }, 0.3, 'power2.in');
    X.tl.fromTo(B.rig, { x: B.plan.x - dir * 260 }, { x: B.plan.x, duration: 0.5, ease: 'power2.out', immediateRender: false }, T);
    X.sfx(T - 0.28, 'whoosh', { dur: 0.5, gain: 0.5, pitch: 0.8 });
  };
})();
