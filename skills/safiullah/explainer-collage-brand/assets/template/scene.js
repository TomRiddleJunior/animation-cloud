/* Collage-brand starter (≈14 s): grey collage world → colour pop on "the work" → HARD colour flood on the turning
 * word → ribbon flight + ring burst → navy lockup → motion-quote card (the xerox kinetic-type sub-variant).
 * Copy this folder, keep kit.js next to index.html, rewrite script.json, then rebuild each beat for your story. */
X.boot(async (X) => {
  await X.loadVO();
  K.init();
  const P = K.P, tl = X.tl, W = 1920, H = 1080;
  const w = (id, s, n = 0) => X.word(id, s, n), L = (id) => X.line(id);
  const T = { flood: w('turn', 'showing'), rib: L('turn').end + 0.9, quote: L('quote').start - 0.35 };
  T.burst = T.rib + 1.5; T.lock = w('lock', 'your') - 0.1;
  const END = L('quote').end + 1.8;

  // BEAT 1 — grey collage world (saturated pixels ≈ 2 %): axonometric desk, halftone worker, laptop pops colour on "work"
  X.scene('grey', 0, T.flood, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.ground }, g);
    const cam = X.cam(X.svg('g', {}, g));
    K.drift(cam, 0, T.flood, 16, 0);                                  // a "held" set still travels
    tl.fromTo(cam, { scale: 1.06 }, { scale: 1, duration: T.flood, ease: 'none', immediateRender: false }, 0);
    const iso = K.iso(800, 470, 1.25);
    const sh = K.shadow(cam, 1000, 760, 430, 120, 4);
    K.grow(sh, 0.2, 0.5, 'power3.out', '50% 50%');
    const desk = X.svg('g', {}, cam);
    iso.box(desk, 0, 0, 0, 280, 150, 80, K.DESK);
    const scr = K.laptop(iso, desk, 110, 40, 80);
    K.rise(desk, 0.35);
    const [px, py] = iso.P(160, 250, 0);
    const worker = K.cut(cam, K.fig.seatedBack({ tone: 0.36 }), { x: px, y: py, h: 230, cell: 4.5 });
    K.rise(worker, 0.6, 30, 0.45);
    const clock = K.cut(cam, K.fig.clock({ h: 9, m: 0 }), { x: 520, y: 470, h: 170, cell: 4, rim: 4 });
    K.grow(clock._inner, 0.8, 0.5, 'back.out(1.3)', '50% 50%');
    const sc = K.scrap(cam, { x: 1460, y: 330, w: 220, h: 150, rot: 7, color: '#E9E6DF', seed: 5 });
    K.tape(sc, 0, -74, 100, -4);
    K.rise(sc, 1.0, 30, 0.45);
    K.colourPop(scr, w('old', 'work'));                               // colour lives only on "the work"
    const [sx, sy] = iso.P(140, 40, 104);
    K.mark(cam, K.scribble.circle(sx, sy, 90, 60, 3), w('old', 'sight'), { color: P.cream, w: 5 });
  });

  // BEAT 2 — the hard colour flood on the turning word, colour-led world (saturated pixels 60–90 %)
  X.scene('colour', T.flood, T.burst + 0.6, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.field }, g);
    const cam = X.cam(X.svg('g', {}, g));
    tl.fromTo(cam, { scale: 1.06, x: 30 }, { scale: 1, x: -40, duration: T.burst + 0.6 - T.flood, ease: 'none', immediateRender: false }, T.flood);
    const sun = K.blob(cam, 980, 540, 380, K.sunset, { seed: 9, speed: 0.5 });
    K.grow(sun, T.flood, 0.7, 'back.out(1.2)', '50% 50%');
    const iso = K.iso(660, 600, 0.9);
    K.shadow(cam, 1000, 930, 470, 80, 15, P.fShadow);
    iso.box(cam, 0, 0, 0, 760, 26, 420, { top: '#FFFFFF', left: P.fLight, right: P.tangerine });
    const cards = X.svg('g', { transform: K.planeY(iso, 0, 27, 420) }, cam);
    const fills = [K.work, P.cream, K.cool, K.workV, P.cream, K.work, K.sunset, P.cream];
    fills.forEach((f, i) => {
      const cx = 110 + (i % 4) * 180, cy = 110 + Math.floor(i / 4) * 170;
      const card = X.svg('g', {}, cards);
      const s = K.scrap(card, { x: cx, y: cy, w: 120, h: 110, rot: (i % 3 - 1) * 4, color: '#FBF7F0', seed: 40 + i, jag: 5 });
      if (f !== P.cream) X.svg('rect', { width: 120, height: 110, fill: f }, s._body);
      else X.svg('rect', { x: 14, y: 18, width: 70, height: 10, fill: P.violet }, s._body);
      K.tape(card, cx, cy - 56, 56, (i % 2 ? 6 : -6), { h: 22, seed: 50 + i });
      gsap.set(card, { opacity: 0, scale: 0.6, transformOrigin: `${cx}px ${cy}px` });
      tl.to(card, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)' }, T.flood + 0.15 + i * 0.08);
      if (i % 2 === 0) X.sfx(T.flood + 0.15 + i * 0.08, 'pop', { gain: 0.2, pitch: 0.9 + i * 0.05 });
    });
    const [wx, wy] = iso.P(-70, 120, 0);
    K.cut(cam, K.fig.woman({ tone: 0.55 }), { x: wx, y: wy, h: 380, cell: 4.6, rim: 5 });   // photos never get colour
  });

  // BEAT 3 — ribbon flight → ring burst → navy; the glyph fills with collage; tracked-caps lockup
  X.scene('ribbon', T.rib, T.burst + 0.7, (g) => {
    const lead = K.glyph(null, 150);
    K.ribbons(g, lead, { d: 'M-300,980 C120,1220 360,380 760,360 C980,350 820,540 960,540', t: T.rib, dur: 1.4, retract: T.rib + 1.45, retractDur: 0.45, settle: true });
    tl.fromTo(lead, { scale: 0.6 }, { scale: 1.6, duration: 1.4, ease: 'power2.inOut', immediateRender: false }, T.rib);
    K.ringBurst(g, T.burst, 960, 540, P.navy, { ring: '#3A3380' });
    g.appendChild(lead);
  });
  X.scene('lock', T.burst + 0.5, T.quote, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.navy }, g);
    const hold = X.svg('g', {}, g);
    gsap.set(hold, { x: 960, y: 540, scale: 1.6 });
    const gl = K.glyph(hold, 150);
    const inside = X.svg('g', { 'clip-path': 'url(#tplGlyph)' }, hold);
    const cp = X.svg('clipPath', { id: 'tplGlyph' }, X.defs);
    X.svg('path', { d: gl.body.getAttribute('d') }, cp);
    hold.appendChild(gl.flap);
    [K.blob(inside, -30, 30, 56, K.sunset, { seed: 61 }), K.blob(inside, 40, -20, 40, K.cool, { seed: 62 })].forEach((b, i) => { gsap.set(b, { opacity: 0 }); tl.to(b, { opacity: 1, duration: 0.3 }, T.burst + 0.7 + i * 0.12); });
    tl.to(hold, { y: 330, scale: 0.7, duration: 0.7, ease: 'power3.inOut' }, T.lock - 0.3);
    K.lockup(g, T.lock + 0.1, 'INTRODUCING', 'Your Product', { y: 640, size: 96 });
  });

  // BEAT 4 — motion-quote sub-variant: monochrome xerox kinetic type (own words only, never a real person's quote)
  X.scene('quote', T.quote, null, (g) => {
    X.svg('rect', { width: W, height: H, fill: '#050505' }, g);
    K.quote.header(g, ['MOTION NOTES', 'YOUR COMPANY', '001 / 2026']);
    const l1 = K.quote.word(g, 'SHOW THE', { y: 470, size: 130 });
    const l2 = K.quote.word(g, 'WORK', { y: 660, size: 190, scan: true, weight: 700 });
    K.quote.reveal(l1, w('quote', 'show'), 0.06);
    K.quote.reveal(l2, w('quote', 'work'), 0.08);
    K.quote.xeroxStrip(g);
    K.quote.dust(g, { opacity: 0.45 });
  });

  X.end(END);
});
