/* explainer-flat-character starter: problem (character + pain bubbles) → whip-pan → product turning point (badge
 * hub + orbit badges, character celebrates) → logo resolve (mark pop, wordmark draw-on, CTA pill).
 * Replace the copy in script.json, keep every move on a word with X.word(). Runs as-is (~15 s). */
X.boot(async (X) => {
  await X.loadVO();
  const P = K.PAL, L = (id) => X.line(id), W = (id, w, n) => X.word(id, w, n), tl = X.tl;
  const END = L('cta').end + 3.0;
  X.svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: P.ground }, X.root);
  const HERO = { hairStyle: 'bun', top: P.coral, topHi: P.coralHi, bottom: P.teal, bottomHi: P.tealMid, skin: K.SKINS[1][0], skinShade: K.SKINS[1][1], seed: 2 };
  const tW = L('turn').start - 0.38;           // whip-pan between vignettes
  const tLogo = L('cta').start - 0.3;          // iris to the logo ground

  // ---- vignette 1: the problem (pull-back reveal, dolly-in, bubbles on the nouns)
  X.scene('problem', 0, tW + 0.3, (g) => {
    const wrap = X.svg('g', {}, g);
    const cam = K.camera(wrap, { z: 3.2, cx: 1180, cy: 500 });
    const w = cam.g;
    cam.to(0.05, { z: 1, cx: 960, cy: 540 }, 1.8, 'expo.out');
    K.blob(w, 1000, 560, 760, 400, P.blob, { seed: 3 });
    K.desk(w, 700, 760, 820);
    const mon = K.monitor(w, 1000, 380, 380, 260);
    X.svg('rect', { x: mon.sx, y: mon.sy, width: mon.sw, height: mon.sh, rx: 12, fill: '#f7c6a0' }, mon.screen);
    const props = [K.plant(w, 1450, 760, 0.8), K.mug(w, 900, 760, 0.75), K.sticky(w, 920, 420, 56, P.butter, -6), K.sticky(w, 1440, 440, 50, P.mint, 5)];
    props.forEach((el, i) => K.pop(el, 0.5 + i * 0.12, { sfx: i ? false : 'pop', gain: 0.2 }));
    const sam = K.character(w, { ...HERO, x: 640, y: 1260, scale: 2.1, look: 0.3 });
    const t0 = L('hook').start - 0.05;
    tl.fromTo(sam.g, { x: 160, y: 2500, scale: 5 }, { x: 640, y: 1260, scale: 2.1, duration: 0.85, ease: 'power3.out', immediateRender: false }, t0);
    gsap.set(sam.g, { x: 160, y: 2500, scale: 5 });
    sam.pose('wave', t0 + 0.4).wave(t0 + 0.7, t0 + 1.5).face(t0 + 0.45, { mouth: 'open', eyes: 'happy' });
    const tList = W('hook', 'to-do');
    sam.pose('headHold', tList - 0.1).face(tList, { mouth: 'o', brows: 'worried', eyes: 'open' });
    [['Emails!', 470, 400, 'l'], ['Meeting at 3', 760, 380, 'r'], ['Reports due', 800, 640, 'r']].forEach(([txt, x, y, side], i) => {
      const bg = X.svg('g', {}, w);
      const b = K.bubble(bg, x, y, txt, { side, up: i < 2, size: 34, color: i === 1 ? P.tealMid : P.green, hi: i === 1 ? P.tealHi : P.greenHi });
      K.pop(b, tList + i * 0.22, { ox: b.ox, oy: b.oy, pitch: 1 + i * 0.1 });
      K.bob(bg, 5, 2.4 + i * 0.3, i);
    });
    sam.pose('slump', W('hook', 'wins') - 0.05, 0.5).face(W('hook', 'wins'), { mouth: 'frown' });
    K.whip(tW, wrap, null);
  });

  // ---- vignette 2: the turning point (hub badge + orbit badges at a 6-frame stagger)
  const t2 = tW + 0.37;
  X.scene('turn', t2, tLogo + 0.5, (g) => {
    const wrap = X.svg('g', {}, g);
    tl.fromTo(wrap, { x: 1300 }, { x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, t2);
    const cam = K.camera(wrap, { z: 1 });
    const w = cam.g;
    cam.to(t2 + 0.5, { z: 1.06, cx: 990 }, 4, 'sine.inOut');
    K.blob(w, 960, 560, 780, 400, P.blob, { seed: 8 });
    const hub = K.badge(w, 1060, 500, 150, 'check', { color: P.green, hi: P.greenHi });
    K.pop(hub, W('turn', 'Tidyleaf'), { dur: 0.5, ease: 'back.out(1.8)', sfx: 'chime', gain: 0.4 });
    [['calendar', 820, 300, P.lav, P.lavHi], ['bell', 1310, 290, P.coral, P.coralHi], ['clock', 1360, 640, P.butter, P.butterHi], ['star', 800, 700, P.tealMid, P.tealHi]].forEach(([gl, x, y, c, hi], i) => {
      const bg = X.svg('g', {}, w);
      K.pop(K.badge(bg, x, y, 56, gl, { color: c, hi }), W('turn', 'list') + i * 0.2, { sfx: i % 2 ? false : 'pop', gain: 0.25 });
      K.bob(bg, 7, 2 + i * 0.3, i);
    });
    const sam = K.character(w, { ...HERO, x: 520, y: 1010, scale: 1.4, look: 0.5, pose: 'idle' });
    sam.pose('celebrate', W('turn', 'shrank') - 0.1, 0.35).face(W('turn', 'shrank'), { mouth: 'grin', eyes: 'happy' }).hop(W('turn', 'shrank'), 2, 16);
  });

  // ---- logo resolve: mark pops large, slides left, wordmark draws on, CTA pill
  X.scene('logo', tLogo, END + 0.1, (g) => {
    K.iris(g, 960, 540, P.ground, tLogo, 0.42, { ease: 'power2.in' });
    const blob = K.blob(g, 960, 540, 640, 300, P.blob, { seed: 4, speed: 1.3 });
    gsap.set(blob, { scale: 0, svgOrigin: '960 540' });
    const tName = W('cta', 'Tidyleaf');
    tl.to(blob, { scale: 1, duration: 0.8, ease: 'power3.out', svgOrigin: '960 540' }, tName);
    const markG = X.svg('g', {}, g);
    const mark = K.badge(markG, 960, 500, 150, 'check', { color: P.teal, hi: P.tealMid });
    K.pop(mark, tName - 0.04, { dur: 0.5, ease: 'back.out(1.8)', sfx: 'chime', gain: 0.4 });
    tl.to(markG, { x: -330, duration: 0.6, ease: 'power3.inOut' }, tName + 0.6);
    tl.to(mark, { scale: 0.62, svgOrigin: '960 500', duration: 0.6, ease: 'power3.inOut' }, tName + 0.6);
    K.wordmark(g, 790, 548, 'tidyleaf', tName + 0.95, { size: 150 });
    const cta = X.svg('g', {}, g);
    K.pill(cta, 960, 800, 'Try it free today', { size: 42, color: '#ea7a63', hi: P.coral });
    K.pop(cta, W('cta', 'Try') - 0.05, { dur: 0.45 });
  });
  X.end(END);
});
