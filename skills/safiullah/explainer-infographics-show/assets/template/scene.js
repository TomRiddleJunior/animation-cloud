/* Starter project for the infographics-show style (12-s demo): "What if you drank seawater?"
 * Pattern for every set:  K.set(...)  → build the layers  → call the INCOMING transition (needs the previous set)
 * → add this set's own camera moves in time order (K.move) → punch-ins on stressed words.  */
X.boot(async (X) => {
  await X.loadVO();
  K.init(X);
  const C = K.C, P = K.POSE;
  const W = (id, w, n = 0) => X.word(id, w, n);
  const END = X.vo.duration || 12;
  X.end(END);
  const T1 = W('rung', 'Problem'), T2 = W('joke', 'every');

  // ---- set 1: wide — "you" on a raft, flat sea in 3 depth planes, idle waves
  const sea = K.set('sea', 0, T1 + 0.02, { bg: C.sky }, (S) => {
    const far = S.layer(0.3), mid = S.layer(0.7), near = S.layer(1), fg = S.layer(1.4);
    K.sun(far, 1500, 220, 70);
    X.svg('rect', { x: -2000, y: 640, width: 6000, height: 1200, fill: C.water3 }, far);
    X.svg('rect', { x: -2000, y: 720, width: 6000, height: 1200, fill: C.water2 }, mid);
    const raft = X.svg('g', {}, near);
    for (let i = 0; i < 6; i++) X.svg('rect', { x: 700 + i * 88, y: 870, width: 80, height: 40, rx: 14, fill: i % 2 ? '#B9824A' : '#C9935A' }, raft);
    const rs = K.tf(raft, {}, S.vis);
    const guy = K.guy(S, near, { x: 960, y: 880, s: 0.62, face: 'smile' });
    const waves = X.svg('path', { fill: C.water }, fg);
    K.hook((t) => {   // procedural idle: everything is a pure function of t
      let d = 'M-600,1080';
      for (let x = -600; x <= 2600; x += 80) d += ` L${x},${(930 + Math.sin(x / 120 + t * 2.4) * 16).toFixed(1)}`;
      waves.setAttribute('d', d + ' L2600,1500 L-600,1500Z');
      rs.y = Math.sin(t * 2.4) * 6; guy.st.y = 880 + Math.sin(t * 2.4) * 6;
    }, S.vis);
    guy.face(W('hook', 'ocean') - 0.1, 'worried');
    guy.pose(W('hook', 'ocean') - 0.1, P.panic, 0.3);
    K.place(S, { s: 0.95 });
    K.move(S, 0.2, { s: 1.25, y: 60 }, 1.6, 'sine.inOut');
    K.move(S, W('hook', 'drink'), { s: 1.1, x: 120, y: 30 }, 1.0, 'sine.inOut');
  });
  gsap.set(sea.g, { autoAlpha: 1 });                       // a set starting at t=0 must be shown explicitly

  // ---- set 2: close-up on a saturated field — fact box + number on a prop (value tag)
  const salt = K.set('salt', T1, T2 + 0.25, { bg: C.cyan }, (S) => {
    const L = S.layer(1);
    const glass = X.svg('g', {}, L);
    X.svg('path', { d: 'M820,380 L1100,380 L1070,820 L850,820Z', fill: '#fff', opacity: 0.55 }, glass);
    X.svg('path', { d: 'M832,500 L1088,500 L1070,820 L850,820Z', fill: C.water2 }, glass);
    for (let i = 0; i < 9; i++) X.pop(X.svg('rect', { x: 870 + (i % 3) * 60, y: 560 + Math.floor(i / 3) * 70, width: 26, height: 26, rx: 4, fill: '#fff', transform: `rotate(${i * 17} ${883 + (i % 3) * 60} ${573 + Math.floor(i / 3) * 70})` }, L), W('rung', 'salt') - 0.2 + i * 0.05, { sfx: i ? false : 'pop' });
    K.factBox(S.hud, 'PROBLEM #1: SALT', T1 + 0.15, { accent: C.red });
    K.tag(L, 1300, 300, '3.5% SALT', W('rung', 'three') + 0.1, { size: 64, vis: S.vis });
    K.tx.whip(sea, S, T1, 1);                               // incoming transition first …
    K.move(S, T1 + 0.5, { s: 1.2, x: 120, r: 3 }, T2 - T1 - 0.8, 'sine.inOut');   // … then this set's moves
    K.punch(S, W('rung', 'three'), 1.12, 0.6);
  });

  // ---- set 3: kinetic punchline card (2018–19 per-letter pop, tilted, highlighter bar), flood in
  K.set('deal', T2, END + 0.1, { bg: C.coral }, (S) => {
    K.typeCard(S.layer(1), [
      { text: 'EVERY SIP =', size: 120, t: W('joke', 'every'), bar: C.navy },
      { text: 'THIRSTIER', size: 230, t: W('joke', 'thirstier') },
    ], { rot: -12, vis: S.vis });
    K.tx.flood(salt, S, T2, C.coral, 1300, 360);
    K.move(S, T2, { s: 1.15, r: 2 }, END - T2, 'sine.inOut');
  });
});
