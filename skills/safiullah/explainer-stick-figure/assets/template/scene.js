/* Stick-figure starter (≈ 16 s): title card -> prop hero with a grey loop -> pose swap with a bubble ->
 * reaction close-up -> red circle-and-slash -> red verdict word -> tag over the opening prop.
 * Every black drawing swaps in whole on its word (K.shot + K.at); only red draws on. Render with --fps 24.
 * Replace the shots and script.json lines with your own analogy; keep the grammar.
 */
X.boot(async (X) => {
  await X.loadVO();
  K.init(X);
  const W = (id, w, n = 0) => K.at(X.word(id, w, n));   // swap one frame before the stressed word
  const END = X.vo.duration || 16;
  const shots = [];
  const add = (id, at, draw) => shots.push({ id, at, draw });

  // the opening prop, reused verbatim for the tag (same seed -> identical drawing, no boil)
  const heroKey = (g, t0, t1, mark) => {
    K.seed(7001);
    K.key(g, 1060, 470, 1.4, { tag: 'home', rot: -4, seed: 7, mark });
    K.cycle(K.glints(g, 1060, 470, 1.4, 3, 41), t0, t1, 4);           // T7 grey loop on fours
  };

  // T8 title card, held while the whole analogy is said
  add('title', 0, (g) => {
    K.title(g, 'BACKUPS', 960, 500, { width: 1450, sw: 10, seed: 8 });
    K.scrawl(g, 'EXPLAINED WITH SPARE KEYS', 960, 690, { size: 70, seed: 3 });
  });
  // prop hero
  add('key', W('one', 'key'), (g, t0, t1) => heroKey(g, t0, t1));
  // pose swap + bubble (full figure)
  add('lose', W('lose', 'lose'), (g) => {
    K.fig(g, { h: 640, x: 760, y: 900, pose: 'shrug', face: 'worry', brows: 'worried', look: 0.2 });
    K.bubble(g, 1180, 330, 150, 80, 'uh-oh.', { tail: [930, 420], size: 56 });
  });
  // T2 cut-in by redraw: the same person as a head close-up cropped by the frame edge
  add('garden', W('lose', 'garden'), (g) => {
    K.fig(g, { h: 2300, x: 900, y: 420 + 0.875 * 2300, face: 'line', brows: 'worried', look: 0.3, w: 6,
      arms: { L: [[-0.16, 0.2], [-0.2, 0.4]], R: [[0.12, 0.04], [0.15, -0.05]] } });
  });
  // T3 red judgement stamp over the forbidden act: one key, kept in one place
  add('one-place', W('spare', 'only'), (g) => {
    K.fig(g, { h: 600, x: 820, y: 900, pose: 'hold', face: 'smile', look: 0.5 });
    K.key(g, 1130, 560, 0.3, { rot: -20, ring: false });
    K.stamp(g, 960, 560, 420, 380, K.snap(X.word('spare', 'only')), { w: 14 });
  });
  // T4 red verdict word beside a held drawing
  add('two', W('spare', 'spare'), (g) => {
    K.house(g, 620, 900, 0.75);
    K.key(g, 620, 960, 0.28, { ring: false, bow: 'round', seed: 11 });
    K.door(g, 1320, 900, 0.95, { num: '7' });
    K.key(g, 1320, 960, 0.28, { ring: false, bow: 'round', seed: 11 });
    K.redWord(g, 'SOMEWHERE ELSE.', 960, 230, X.word('spare', 'somewhere'), { size: 96 });
  });
  // tag over the opening prop
  add('tag', W('tag', 'under'), (g, t0, t1) => {
    heroKey(g, t0, t1);
    K.redWord(g, 'NOT UNDER THE MAT.', 1240, 880, X.word('tag', 'doormat'), { size: 90 });
  });

  shots.forEach((s, i) => K.shot(s.id, s.at, i + 1 < shots.length ? shots[i + 1].at : END + 1, s.draw));
  X.end(END);
});
