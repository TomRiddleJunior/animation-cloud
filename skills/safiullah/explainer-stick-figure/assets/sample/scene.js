/* "Passwords are keys" — an original stick-figure analogy explainer (ink on white, one red).
 * Every drawing is held still and swapped whole in one frame on the stressed word (K.shot + K.at);
 * only red ink draws on (K.stamp / K.redLine); grey steam and glints loop on fours; two gag beats are action bursts.
 * Render at --fps 24.
 */
X.boot(async (X) => {
  await X.loadVO();
  K.init(X);
  const W = (id, w, n = 0) => K.at(X.word(id, w, n));
  const S = (id) => K.at(X.line(id).start), E = (id) => X.line(id).end;
  const END = X.vo.duration || 66;
  const C = K.C;

  // ---------------------------------------------------------------- cast
  const owner = (g, o) => K.fig(g, { h: 640, x: 960, y: 900, face: 'smile', ...o });
  const thief = (g, o) => K.fig(g, { h: 620, x: 960, y: 900, face: 'grin', mask: true, ...o });
  /** a small key with its blade tip at (x,y), pointing in direction rot */
  const keyIn = (g, x, y, s = 0.16, rot = 0, o = {}) => {
    const a = (rot * Math.PI) / 180, d = 255 * s;
    return K.key(g, x - Math.cos(a) * d, y - Math.sin(a) * d, s, { rot, ring: false, dots: s > 0.2, ...o });
  };

  // ---------------------------------------------------------------- the shot list: [id, start, draw(g, t0, t1)]
  const shots = [];
  const add = (id, at, draw) => shots.push({ id, at, draw });

  // 1 · title card, held while the analogy is stated
  add('title', 0, (g) => {
    K.title(g, 'PASSWORDS', 960, 500, { width: 1610, sw: 10, seed: 8 });
    K.scrawl(g, 'EXPLAINED WITH KEYS', 960, 690, { size: 74, seed: 3 });
  });
  // 2 · house
  add('house', W('house', 'house'), (g, t0, t1) => {
    const h = K.house(g, 960, 905, 1.12);
    K.cycle(K.steam(g, h.smoke[0], h.smoke[1], 1.1, 3, 51, 2), t0, t1, 4);
  });
  // 4 · prop hero: the key (with a tag), glints on fours
  add('key', W('house', 'key'), (g, t0, t1) => {
    K.seed(7171); K.key(g, 1060, 470, 1.4, { tag: 'home', rot: -4, seed: 7 });
    K.cycle(K.glints(g, 1060, 470, 1.4, 3, 41), t0, t1, 4);
  });
  // 5 · delight
  add('lovely', W('house', 'Lovely'), (g) => {
    const f = owner(g, { pose: 'cheer', face: 'grin', look: 0 });
    keyIn(g, f.at.handR[0] + 6, f.at.handR[1] - 4, 0.2, -60);
  });
  // 6-9 · rapid list: car, office, bike, locker — the same key in every lock
  add('car', W('same', 'car'), (g, t0) => {
    const c = K.car(g, 960, 830, 1.3);
    keyIn(g, 960 + 78 * 1.3, 830 - 180 * 1.3, 0.2, 0);
    X.sfx(t0, 'click', { gain: 0.3 });
  });
  add('office', W('same', 'office'), (g, t0) => {
    K.office(g, 960, 975, 1.06);
    keyIn(g, 960 + 22 * 1.06, 975 - 75 * 1.06, 0.15, 0);
    X.sfx(t0, 'click', { gain: 0.3, pitch: 1.1 });
  });
  add('bike', W('same', 'bike'), (g, t0) => {
    K.bike(g, 960, 880, 1.45);
    keyIn(g, 960 + 45 * 1.45, 880 - 305 * 1.45, 0.17, 0);
    X.sfx(t0, 'click', { gain: 0.3, pitch: 0.95 });
  });
  add('locker', W('same', 'locker'), (g, t0) => {
    K.lockers(g, 960, 920, 1.3);
    X.sfx(t0, 'click', { gain: 0.3, pitch: 1.05 });
  });
  // 10 · the refrain drawing: one key, everything opens
  const refrain = (g, t0, t1) => {
    K.seed(4242);
    const f = owner(g, { pose: 'aloft', face: 'smirk', h: 560, y: 930 });
    const k = keyIn(g, f.at.handR[0] + 2, f.at.handR[1] - 95, 0.34, -90);
    K.cycle(K.glints(g, f.at.handR[0] - 10, f.at.handR[1] - 120, 0.45, 3, 43), t0, t1, 4);
    K.house(g, 430, 520, 0.36); K.office(g, 1500, 560, 0.4); K.car(g, 420, 905, 0.36); K.bike(g, 1490, 905, 0.38, { lock: false });
    return { f, k };
  };
  add('conv', W('conv', 'Very'), (g, t0, t1) => { refrain(g, t0, t1); });
  // 11 · the gym loses its spare keys
  add('gym', W('gym', 'gym'), (g, t0, t1) => {
    const board = K.g(g);
    K.white(board, K.rect(1180, 190, 330, 210));
    for (let r = 0; r < 2; r++) for (let c = 0; c < 4; c++) { const hx = 1230 + c * 75, hy = 235 + r * 95; K.ink(board, [[hx, hy - 10], [hx, hy + 8], [hx + 10, hy + 12]], { w: 4, amp: 0 }); }
    K.scrawl(board, 'SPARE KEYS', 1345, 445, { size: 40, seed: 12 });
    K.cycle(K.variants(g, 2, (fr, k) => K.fig(fr, { h: 600, x: 760, y: 1000, pose: 'shrug', face: 'worry', brows: 'worried', look: -0.2,
      arms: k ? { L: [[-0.16, 0.09], [-0.28, -0.07]], R: [[0.16, 0.09], [0.28, -0.07]] } : undefined }), 81), t0 + 0.5, t1, 4);
    K.white(g, K.rect(330, 660, 900, 40)); K.white(g, K.rect(360, 700, 840, 330));
    K.ink(g, [[420, 760], [1140, 760]], { w: 3.5 }); K.ink(g, [[420, 960], [1140, 960]], { w: 3.5 });
    K.scrawl(g, 'GYM', 780, 900, { size: 130, seed: 31 });
    K.ink(g, [[990, 628], [1110, 628]], { w: 7, amp: 0 }); for (const dx of [975, 1100]) K.white(g, K.rect(dx, 596, 24, 64), { w: 4.5, amp: 0.4 });
    K.bubble(g, 1000, 300, 120, 70, 'oops.', { tail: [860, 400], size: 54 });
  });
  // 13 · action burst: cutting a copy (sparks on twos), then hold with the copy on the bench
  add('cut', W('copy', 'Somebody'), (g, t0) => {
    const bx = 1080, top = 640;
    // bench + machine (static)
    K.white(g, K.rect(bx - 380, top, 760, 26)); K.ink(g, [[bx - 350, top + 26], [bx - 350, 920]]); K.ink(g, [[bx + 350, top + 26], [bx + 350, 920]]);
    K.white(g, K.rect(bx - 130, top - 120, 330, 120)); K.ink(g, K.rect(bx - 100, top - 90, 90, 50), { w: 3.5 });
    K.white(g, K.rect(bx - 210, top - 210, 120, 90));
    keyIn(g, bx + 85, top - 168, 0.3, 0, { seed: 9 });
    const f = thief(g, { x: bx - 470, h: 600, y: 920, lean: 0.07, headDx: 0.03, arms: { L: [[0.16, 0.12], [0.3, 0.18]], R: [[0.2, 0.08], [0.34, 0.12]] }, look: 0.8 });
    void f;
    const wheelC = [bx + 150, top - 240];
    // wheel guard, motor housing vents, crank
    K.ink(g, K.ellipse(wheelC[0], wheelC[1], 118, 118, 30, -Math.PI * 0.95, -Math.PI * 0.05), { w: 5 });
    K.ink(g, [[wheelC[0] + 118, wheelC[1]], [wheelC[0] + 118, top - 120]], { w: 5 });
    for (let v = 0; v < 4; v++) K.ink(g, [[bx + 40, top - 92 + v * 18], [bx + 170, top - 92 + v * 18]], { w: 3, amp: 0.3 });
    K.ink(g, [[bx + 200, top - 60], [bx + 260, top - 60], [bx + 260, top - 110]], { w: 5 }); K.white(g, K.ellipse(bx + 260, top - 122, 14, 14, 14), { w: 4.5 });
    K.ink(g, [[bx - 150, top - 210], [bx - 150, top - 260], [bx - 110, top - 260]], { w: 5 }); K.white(g, K.ellipse(bx - 100, top - 260, 12, 12, 14), { w: 4.5 });
    const frames = [];
    const r = X.rand(77);
    for (let k = 0; k < 10; k++) {
      const fr = K.g(g);
      K.white(fr, K.loop(wheelC[0], wheelC[1], 95, 95, { seed: 60, over: 0.08 }));
      K.ink(fr, K.ellipse(wheelC[0], wheelC[1], 22, 22, 18), { w: 4, amp: 0.3 });
      for (let s = 0; s < 3; s++) { const a = k * 0.7 + (s * Math.PI * 2) / 3; K.ink(fr, [[wheelC[0] + Math.cos(a) * 30, wheelC[1] + Math.sin(a) * 30], [wheelC[0] + Math.cos(a) * 82, wheelC[1] + Math.sin(a) * 82]], { w: 3.5, amp: 0 }); }
      if (k < 9) for (let s = 0; s < 9; s++) { const a = Math.PI * (0.55 + r() * 0.75), L0 = 18 + r() * 30, L1 = L0 + 40 + r() * 60, ox = wheelC[0] - 92, oy = wheelC[1] + 30; K.ink(fr, [[ox + Math.cos(a) * L0, oy + Math.sin(a) * L0 * 0.6], [ox + Math.cos(a) * L1, oy + Math.sin(a) * L1 * 0.6]], { w: 3.5, amp: 0 }); }
      else keyIn(fr, bx - 40, top - 12, 0.3, 0, { seed: 9 });
      frames.push(fr);
    }
    const tb = K.snap(X.word('copy', 'cuts') + 0.08);
    K.burst(frames, tb, 2);
    X.sfx(tb, 'scribble', { dur: 0.8, gain: 0.55 });
    X.sfx(tb + 0.85, 'click', { gain: 0.35 });
  });
  // 15 · they've got your car
  add('t-car', W('car', 'car'), (g) => {
    const cg = K.g(g);
    const c = K.car(cg, 1000, 860, 1.3);
    const clipId = 'carwin';
    const cp = X.svg('clipPath', { id: clipId }, X.defs);
    X.svg('path', { d: 'M' + c.win.map((p) => p.join(',')).join('L') + 'Z' }, cp);
    const inner = K.g(cg, { 'clip-path': `url(#${clipId})` });
    K.fig(inner, { h: 520, x: 1115, y: 995, mask: true, face: 'grin', look: 0.9, arms: { L: [[0.1, 0.06], [0.2, 0.0]], R: [[0.1, 0.06], [0.2, 0.0]] }, spine: true });
    K.ink(cg, K.ellipse(1000 + 150 * 1.3, 860 - 238 * 1.3, 14, 34, 20), { w: 5 });
    for (const [y, L] of [[620, 160], [700, 220], [780, 140]]) K.ink(g, [[240, y], [240 + L, y]], { w: 4.5 });
  });
  // 16 · ... and your office (feet up on your desk)
  add('t-office', W('office', 'office'), (g, t0, t1) => {
    const d = K.desk(g, 1180, 900, 1.15);
    K.cycle(K.steam(g, d.mug[0], d.mug[1] - 8, 0.6, 3, 52, 2), t0, t1, 4);
    // office chair
    K.white(g, K.rect(560, 640, 200, 24)); K.ink(g, [[575, 640], [530, 420]]); K.ink(g, [[660, 664], [660, 820]]);
    K.ink(g, [[560, 830], [760, 830]]); for (const wx of [570, 660, 750]) K.ink(g, K.ellipse(wx, 850, 14, 14, 14), { w: 4, amp: 0.3 });
    K.fig(g, { h: 560, x: 680, y: 900, mask: true, face: 'smirk', look: 0.6, pose: 'behind', neck: [-0.12, -0.83], hip: [0, -0.46],
      legs: [[[0.3, -0.2], [0.62, -0.235]], [[0.32, -0.17], [0.66, -0.21]]], footDir: [1, 1], headC: [-0.16, -0.955] });
  });
  // 17 · ... and your house (sofa, cereal)
  add('t-home', W('home', 'house'), (g, t0, t1) => {
    const fr = K.g(g);
    K.white(fr, K.rect(1290, 170, 260, 190)); K.house(fr, 1420, 330, 0.2);
    const so = K.sofa(g, 960, 960, 1.1);
    const f = thief(g, { x: 960, y: so.seat + 0.4 * 640 + 4, h: 640, look: 0.1,
      arms: { L: [[-0.14, 0.13], [-0.02, 0.24]], R: [[0.16, 0.1], [0.07, -0.06]] },
      legs: [[[-0.1, 0.04], [-0.12, 0.34]], [[0.1, 0.04], [0.12, 0.34]]] });
    const bx = f.at.handL[0] + 30, by = f.at.handL[1] - 8;
    const bowl = []; for (let i = 0; i <= 16; i++) { const a = Math.PI * (i / 16); bowl.push([bx + Math.cos(a) * 95, by + Math.sin(a) * 62]); }
    K.white(g, bowl);
    for (let i = 0; i < 7; i++) K.ink(g, K.loop(bx - 66 + i * 22, by - 6 - (i % 2) * 8, 9, 7, { over: 0.1 }), { w: 3.5, amp: 0 });
    const hr = f.at.handR;
    K.cycle(K.variants(g, 2, (fr, k) => {
      const dy = k ? 26 : 0;
      K.ink(fr, [[hr[0] - 6, hr[1] + 30 + dy], [hr[0] - 30, hr[1] - 70 + dy]], { w: 4.5 });
      K.white(fr, K.ellipse(hr[0] - 34, hr[1] - 84 + dy, 14, 20, 16), { w: 4 });
    }, 82), t0 + 0.3, t1, 6);
  });
  // 18 · ... and your bike (motion lines on fours), then a comic pause
  add('t-bike', W('bike', 'bike'), (g, t0, t1) => {
    const b = K.bike(g, 1060, 900, 1.3, { lock: false });
    const hp = [b.saddle[0] + 10, b.saddle[1] - 6], pf = b.pedal, pb = b.pedalB;
    const knee = (p, fwd) => [(hp[0] + p[0]) / 2 + fwd, (hp[1] + p[1]) / 2 - 70];
    const f = thief(g, { x: hp[0], y: hp[1] + 0.40 * 560, h: 560, look: 0.8, lean: 0.16, headDx: 0.03, feet: false,
      legsAbs: [[knee(pf, 70), pf], [knee(pb, 95), pb]],
      armsAbs: { L: [[b.bars[0] - 70, b.bars[1] - 40], b.bars], R: [[b.bars[0] - 60, b.bars[1] - 30], [b.bars[0] + 14, b.bars[1] + 4]] } });
    void f;
    const frames = [0, 1].map((k) => { const fr = K.g(g); for (const [y, L] of [[560, 150], [660, 230], [770, 170]]) K.ink(fr, [[330 - k * 40, y + k * 8], [330 - k * 40 + L, y + k * 8]], { w: 4.5 }); return fr; });
    K.cycle(frames, t0, t1, 4);
    X.sfx(t0 + 0.12, 'ding', { gain: 0.3, pitch: 1.3 });
  });
  // 19 · refrain drawing returns; the red verdict draws over it
  add('flaw', W('flaw', 'Bit'), (g, t0, t1) => {
    refrain(g, t0, t1);
    K.stamp(g, 960, 560, 620, 420, K.snap(X.word('flaw', 'design')), { w: 15 });
  });
  // 20-21 · reaction close-up (head cropped by the frame), then the same drawing with a bubble
  const closeup = (g, bubble) => {
    K.seed(5151);
    K.fig(g, { h: 2300, x: 820, y: 420 + 0.875 * 2300, face: 'line', brows: 'worried', look: 0.35, w: 6,
      arms: { L: [[-0.16, 0.2], [-0.2, 0.4]], R: [[0.12, 0.04], [0.15, -0.05]] } });
    if (bubble) K.bubble(g, 1420, 250, 210, 100, "I'm boring.", { tail: [1190, 330], size: 60 });
  };
  add('boring', W('boring', 'But'), (g) => closeup(g, false));
  add('boring2', W('boring', "I'm"), (g) => closeup(g, true));
  // 22-23 · a sack of stolen keys, then the tries tick off under each door (on fives) and the last one opens
  add('sack', W('sack', 'They'), (g) => {
    const sk = K.g(g), r = X.rand(5);
    for (let i = 0; i < 6; i++) keyIn(sk, 150 + i * 40, 430 - r() * 30, 0.24, 70 + r() * 40, { seed: 200 + i, bow: ['round', 'square', 'clover'][i % 3] });
    K.white(g, 'M140,440 Q240,405 340,440 L330,480 Q470,590 440,740 Q400,850 240,850 Q80,850 45,740 Q15,590 150,480 Z');
    K.ink(g, 'M150,482 Q240,505 330,482', { w: 5 }); K.ink(g, 'M120,620 Q150,700 140,780', { w: 3.5 }); K.ink(g, 'M370,600 Q350,680 372,760', { w: 3.5 });
    const f = thief(g, { x: 520, h: 600, look: 0.7, arms: { L: [[-0.14, -0.02], [-0.22, -0.12]], R: [[0.2, 0.08], [0.34, 0.05]] } });
    const rc = [f.at.handR[0] + 10, f.at.handR[1] + 50];
    K.ink(g, K.loop(rc[0], rc[1], 46, 46, { seed: 70 }), { w: 4 });
    for (let k = 0; k < 4; k++) { const a = 0.9 + k * 0.55; keyIn(g, rc[0] + Math.cos(a) * 46, rc[1] + Math.sin(a) * 46, 0.15, (a * 180) / Math.PI - 180, { seed: 300 + k, bow: ['round', 'square', 'clover'][k % 3] }); }
    const xs = [900, 1170, 1440, 1710];
    K.doorRow(g, xs.slice(0, 3), 900, 0.72);
    const frames = xs.map((x, i) => {
      const fr = K.g(g);
      K.seed(900 + (i === 3 ? 1 : 0));
      K.door(fr, xs[3], 900, 0.72, { open: i === 3 });
      for (let k = 0; k < Math.min(i, 3); k++) { K.seed(950 + k); const cx = xs[k], cy = 975; K.ink(fr, [[cx - 26, cy - 26], [cx + 26, cy + 26]], { w: 6 }); K.ink(fr, [[cx + 26, cy - 26], [cx - 26, cy + 26]], { w: 6 }); }
      if (i === 3) K.scrawl(fr, 'click!', x + 30, 520, { size: 84, font: 'Caveat', weight: 700, color: C.red, seed: 9 });
      return fr;
    });
    const tb = K.snap(X.word('sack', 'try') + 0.1);
    K.burst(frames, tb, 5);
    for (let i = 1; i < 4; i++) X.sfx(tb + (i * 5) / 24, 'tick', { gain: 0.35, pitch: 0.9 + i * 0.05 });
    X.sfx(tb + 15 / 24 + 0.02, 'click', { gain: 0.5 });
  });
  // 24 · the graph: axes swap in, the red line draws on while the trend is said
  add('graph', W('graph', 'The'), (g) => {
    const gr = K.graph(g, { ylab: 'how bad losing it is', xlab: 'doors one key opens', faceL: 'smile', faceR: 'frown' });
    const pts = [];
    for (let i = 0; i <= 60; i++) { const u = 0.03 + (i / 60) * 0.92; pts.push(gr.P(u, 0.06 + 0.88 * Math.pow(u, 2.1))); }
    K.redLine(g, pts, K.snap(X.word('graph', 'opens')), { dur: K.F(28) });
  });
  // 25 · the rule: one lock, one key (each key different), red verdict word
  add('rule', W('rule', 'One'), (g) => {
    const xs = [560, 960, 1360], bows = ['round', 'square', 'clover'];
    xs.forEach((x, i) => { K.door(g, x, 790, 0.95); K.key(g, x + 30, 905, 0.42, { rot: -6 + i * 5, bow: bows[i], seed: 400 + i * 7, ring: false }); });
    K.redWord(g, 'ONE EACH.', 1650, 260, X.word('rule', 'different'), { size: 104 });
  });
  // 26 · "but I can't carry eighty keys!" — buried
  add('eighty', W('eighty', 'But'), (g, t0, t1) => {
    K.cycle(K.variants(g, 2, (fr, k) => K.fig(fr, { h: 700, x: 960, y: 1010, pose: 'up', face: 'open', brows: 'worried', look: 0,
      arms: k ? { L: [[-0.2, -0.17], [-0.3, -0.34]], R: [[0.2, -0.17], [0.3, -0.34]] } : undefined }), 83), t0 + 0.2, t1, 4);
    K.white(g, 'M300,1095 Q480,700 960,660 Q1440,700 1620,1095 Z', { amp: 1.4 });
    const r = X.rand(31);
    for (let i = 0; i < 34; i++) {
      const u = r(), x = 420 + u * 1080, top = 1095 - (1 - Math.pow((u - 0.5) * 2, 2)) * 420, y = top + 45 + r() * Math.max(0, 1080 - top - 45);
      K.key(g, x, y, 0.16 + r() * 0.08, { rot: r() * 360, ring: false, dots: false, bow: ['round', 'square', 'clover'][i % 3], seed: 500 + i });
    }
    K.bubble(g, 1450, 260, 200, 105, 'EIGHTY KEYS?!', { tail: [1150, 360], size: 52, weight: 700 });
  });
  // 27-28 · the key box, opened by one good key that lives nowhere else
  add('box', W('box', 'Get'), (g, t0, t1) => {
    K.keyBox(g, 820, 960, 1.15);
    const kh = [820 + 360 * 1.15, 960 - 345 * 1.15];
    keyIn(g, kh[0] + 6, kh[1], 0.5, 180, { bow: 'clover', seed: 777, dots: true });
    K.cycle(K.glints(g, kh[0] + 260, kh[1] + 20, 0.6, 3, 47), t0, t1, 4);
    X.sfx(t0, 'click', { gain: 0.35, pitch: 0.9 });
    K.redWord(g, 'NOWHERE ELSE.', 1520, 830, X.word('box', 'nowhere'), { size: 96 });
  });
  // 29 · the mapping card
  add('map', W('map', "It's"), (g) => {
    K.scrawl(g, "IT'S THE SAME WITH", 960, 400, { size: 104, seed: 14 });
    K.title(g, 'PASSWORDS.', 960, 690, { width: 1250, sw: 9, seed: 15 });
  });
  // 30-31 · the moral (title reprise), then its second line
  const moral = (g, more) => {
    K.seed(6161);
    K.title(g, 'ONE EACH.', 960, 470, { width: 1300, sw: 10, seed: 16 });
    K.scrawl(g, 'ONE ACCOUNT, ONE PASSWORD', 960, 660, { size: 74, seed: 17 });
    if (more) K.scrawl(g, '(let a password manager remember them)', 960, 770, { size: 58, font: 'Caveat', seed: 18 });
  };
  add('moral', W('moral', 'One'), (g) => moral(g, false));
  add('moral2', W('moral', 'Let'), (g) => moral(g, true));
  // 32 · tag joke over the opening prop
  add('tag', W('tag', 'sticking'), (g, t0, t1) => {
    K.seed(7171); K.key(g, 1060, 470, 1.4, { tag: 'home', rot: -4, seed: 7, mark: '1' });
    K.cycle(K.glints(g, 1060, 470, 1.4, 3, 41), t0, t1, 4);
    K.stamp(g, 815, 482, 95, 105, K.snap(X.word('tag', 'one')), { w: 11, seed: 37 });
    K.redWord(g, 'SAME KEY.', 1250, 860, X.word('tag', 'new'), { size: 100 });
  });

  shots.forEach((s, i) => K.shot(s.id, s.at, i + 1 < shots.length ? shots[i + 1].at : END + 1, s.draw));
  X.end(END);
});
