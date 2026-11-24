/* Starter: a ~13 s kurzgesagt-style demo built on kit.js (window.KZ).
 * Beat 1  night world, the lantern critter looks up; slow parallax drift; a star with stepped halo + god-rays + pill.
 * Beat 2  DIVE into the star (power3.in, pivot on the star) → crossfade → amber core: two nuclei fuse (flash + ring).
 * Beat 3  pull back out into the day world (palette swap by stacking a day copy over night) → the critter fills with
 *         the cosmos on the last word.  Zero hard cuts. Replace script.json and rebuild the beats with the same parts.  */
X.boot(async (X) => {
  await X.loadVO();
  const K = KZ, S = (t, a, p) => X.svg(t, a, p);
  const W = (id, w, n = 0) => X.word(id, w, n), L = (id) => X.line(id);
  const END = X.vo.duration || 13;
  S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: K.P.night0 });
  const tB = L('b').start, tC = L('c').start;
  const STAR = { x: 1330, y: 300 };

  // ---------------------------------------------------------------- beat 1: night world + a star in the sky
  X.scene('one', 0, tB + 0.15, (g) => {
    const rig = K.rig(g, [
      { t: 0, x: 960, y: 560, z: 1.12 }, { t: tB - 0.95, x: 990, y: 520, z: 1.0, ease: 'sine.inOut' },        // T1 drift
      { t: tB + 0.12, x: STAR.x, y: STAR.y, z: 30, ease: 'power3.in', pivot: [STAR.x, STAR.y] },              // T2 dive
    ]);
    const pl = K.planes(rig), w = K.world(pl, K.NIGHT, { cx: 900, groundY: 860 });
    const st = S('g', {}, pl.p3);
    K.glow(st, STAR.x, STAR.y, 330, '#F8AE1C', 0.5);
    K.rays(st, STAR.x, STAR.y, 520, { n: 14, color: '#FFE8A8', op: 0.14, speed: 3 });
    K.halo(st, STAR.x, STAR.y, 30, ['#FFFDF0', '#FFE38A', '#F8AE1C', '#F0710E', '#9A2B6A'], { step: 1.35, ops: [1, 0.95, 0.65, 0.4, 0.22] });
    X.pop(st, W('a', 'star') - 0.35, { dur: 0.6, ease: 'back.out(1.6)', sfx: 'chime', gain: 0.3 });
    K.pill(pl.p3, STAR.x - 330, STAR.y + 190, 'A Star', { fill: '#D9850F', t: W('a', 'star') + 0.05, out: tB - 0.6, anchor: [290, -150] });
    const c = K.critter(w.critterSlot, { x: 820, y: 862, s: 1.25, amb: 0.4, blinks: [1.6, 3.9] });
    c.to('lookX', 0.6, 6, 0.3).to('lookY', 0.6, -10, 0.3).to('tilt', 0.6, -7, 0.5, 'back.out(1.6)');
    X.sfx(tB - 0.9, 'zoom_in', { gain: 0.3, dur: 0.9 });
  });

  // ---------------------------------------------------------------- beat 2: inside the star
  X.scene('two', tB - 0.25, tC + 0.1, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, tB - 0.25, 0.3, 0, 1); K.fade(fg, tC - 0.25, 0.35, 1, 0);
    const rig = K.rig(fg, [{ t: tB - 0.25, z: 1.7 }, { t: tB + 0.6, z: 1, ease: 'expo.out' }, { t: tC - 0.5, z: 1.08 }, { t: tC + 0.1, z: 0.3, ease: 'power3.in' }]);
    const p0 = rig.plane(0.12), p2 = rig.plane(1);
    S('rect', { x: -900, y: -700, width: 3720, height: 2480, fill: X.radial('core', [[0, '#FFF2B8'], [0.3, '#FFC845'], [0.65, '#F7921F'], [1, '#D2401C']]) }, p0);
    S('rect', { x: -900, y: -700, width: 3720, height: 2480, fill: K.swirlPattern('#FFB52E', 340, 16), opacity: 0.55 }, p0);
    const tm = W('b', 'fuse') + 0.15, A = S('g', {}, p2), B = S('g', {}, p2);
    for (const p of [A, B]) { K.glow(p, 0, 0, 70, '#25E8F1', 0.55); K.orb(p, 0, 0, 34, { fill: '#4FD8F5', shade: '#1E5FC4', rim: '#E4FCFF' }); }
    const he = S('g', { transform: 'translate(960,540)' }, p2), hin = S('g', {}, he);
    K.glow(hin, 0, 0, 120, '#F91E8E', 0.5); K.orb(hin, -22, 0, 32, { fill: '#F45BB5', shade: '#8A1670', rim: '#FFD1EE' }); K.orb(hin, 22, 3, 32, { fill: '#E8399E', shade: '#7A1060', rim: '#FFD1EE' });
    X.pop(hin, tm, { dur: 0.45, ease: 'back.out(2)', sfx: 'pop' });
    const ring = S('circle', { cx: 960, cy: 540, r: 20, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 10, opacity: 0 }, p2);
    X.tl.fromTo(ring, { attr: { r: 20 }, opacity: 1 }, { attr: { r: 700 }, opacity: 0, duration: 0.9, ease: 'expo.out', immediateRender: false }, tm);
    X.every((t) => {
      const d = 380 * (1 - K.prog(t, tm - 0.7, tm, 'power2.in')), on = t < tm ? 1 : 0;
      A.setAttribute('transform', `translate(${960 - d},540)`); B.setAttribute('transform', `translate(${960 + d},540)`);
      A.setAttribute('opacity', on); B.setAttribute('opacity', on);
    });
    K.pill(p2, 1300, 780, 'Helium', { fill: '#C42A7A', t: tm + 0.25, out: tC - 0.4, anchor: [-300, -220] });
    X.sfx(tm, 'sparkle', { gain: 0.3 });
  });

  // ---------------------------------------------------------------- beat 3: day world, the critter is made of the cosmos
  X.scene('three', tC - 0.25, END + 0.1, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, tC - 0.25, 0.3, 0, 1);
    const rig = K.rig(fg, [{ t: tC - 0.25, x: 960, y: 560, z: 1.6 }, { t: tC + 0.6, z: 1, ease: 'expo.out' }, { t: END, x: 960, y: 520, z: 0.9, ease: 'sine.inOut' }]);
    const pl = K.planes(rig), w = K.world(pl, K.DAY, { cx: 960, groundY: 860 });
    K.sun(w.sunSlot, 1450, 470, 90);
    const c = K.critter(w.critterSlot, { x: 960, y: 862, s: 1.3, cosmos: true, blinks: [tC + 1.2] });
    c.to('cheek', tC + 0.2, 1, 0.2).to('cheek', W('c', 'you') - 0.4, 0, 0.2).hop(tC + 0.1, 24)
      .to('cosmos', W('c', 'you') - 0.1, 1, 0.8, 'power2.inOut');
    X.sfx(W('c', 'you'), 'sparkle', { gain: 0.3 });
  });

  // vignette on top
  S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: X.radial('vig', [[0, '#000', 0], [0.62, '#000', 0], [1, '#0A0420', 0.4]], 0.5, 0.5, 0.8) });
  X.end(END);
});
