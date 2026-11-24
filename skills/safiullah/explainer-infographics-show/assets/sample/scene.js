/* "What if you were stranded on Mars?" — an original 72-s what-if mini-episode in the 2018–19 infographics-show look.
 * Ladder: hook (POV alarm → launch → loneliest person) → title → setup → air → cold → food → getting home → verdict →
 * question. ~21 animated scene changes, no hard cuts, camera always moving. Uses kit.js (window.K). */
X.boot(async (X) => {
  await X.loadVO();
  K.init(X);
  const C = K.C, P = K.POSE, tl = X.tl;
  const W = (id, w, n = 0) => X.word(id, w, n);
  const END = X.vo.duration || 72.5;
  X.end(END);

  // scene boundaries (all on spoken words)
  const T = {
    t1: W('hook2', 'Your'), t2: W('hook3', 'Congratulations'), t3: W('title', 'So'), t4: W('title', 'of') - 0.04,
    t5: W('setup', 'Mars'), t6: W('air1', 'First'), t7: W('air1', "it's"), t8: W('air2', 'Step'), t9: W('air3', 'So'),
    t10: W('cold1', 'Problem'), t11: W('cold1', 'and'), t12: W('cold2', 'dust'), t13: W('food1', 'Next'),
    t14: W('food2', 'The'), t15: W('food3', 'And'), t16: W('home1', 'Then'), t17: W('home1', 'planets') - 0.1,
    t18: W('home2', "That's"), t19: W('verdict1', 'So'), t20: W('verdict2', 'But'), t21: W('outro', 'Would') - 0.15,
  };

  // ======================================================================= S1 POV: tablet alarm in the hab
  const s1 = K.set('pov', 0, T.t1 + 0.02, { bg: '#B8D5DE', drift: [0, 0, 0] }, (S) => {
    const wall = S.layer(0.5), dev = S.layer(1);
    for (let i = -2; i < 14; i++) X.svg('rect', { x: i * 190, y: -200, width: 182, height: 1500, rx: 10, fill: i % 2 ? '#ADCCD6' : '#BCD8E1' }, wall);
    X.svg('rect', { x: -400, y: 880, width: 2800, height: 600, fill: '#A9C3CC' }, wall);
    X.svg('circle', { cx: 300, cy: 330, r: 150, fill: '#B5CBD3' }, wall);
    X.svg('circle', { cx: 300, cy: 330, r: 120, fill: C.mSky }, wall);
    X.svg('rect', { x: 180, y: 360, width: 240, height: 100, fill: C.mGround }, wall);
    X.svg('rect', { x: 1500, y: 640, width: 420, height: 26, rx: 8, fill: '#8FA9B3' }, wall);
    K.crate(wall, 1600, 640, 0.6); K.crate(wall, 1760, 640, 0.5);
    const beacon = X.svg('circle', { cx: 1680, cy: 230, r: 44, fill: C.red, opacity: 0.3 }, wall);
    X.svg('rect', { x: 1640, y: 266, width: 80, height: 24, rx: 8, fill: '#7C8B99' }, wall);
    const glow = X.svg('circle', { cx: 1680, cy: 230, r: 130, fill: C.red, opacity: 0 }, wall);
    const dim = X.svg('rect', { x: -400, y: -400, width: 2800, height: 1900, fill: '#000', opacity: 0 }, dev);
    const holder = X.svg('g', {}, dev);
    const tab = K.tablet(S, holder, { cy: 600, w: 1320, h: 790 });
    const scr = tab.screen, cnt = tab.content;
    // screen UI: alert header + camera feed of the launch pad (the next scene, seen through)
    const head = X.svg('rect', { x: scr.x, y: scr.y, width: scr.w, height: 110, fill: C.red }, cnt);
    const ht = X.svg('text', { x: scr.x + 40, y: scr.y + 74, 'font-size': 52, 'font-weight': 900, 'font-family': 'Montserrat', fill: '#fff' }, cnt);
    const feed = { x: scr.x, y: scr.y + 110, w: scr.w, h: scr.h - 110 };
    X.svg('rect', { x: feed.x, y: feed.y, width: feed.w, height: feed.h, fill: C.mSky }, cnt);
    X.svg('rect', { x: feed.x, y: feed.y + feed.h * 0.62, width: feed.w, height: feed.h * 0.38, fill: C.mGround }, cnt);
    X.svg('rect', { x: feed.x, y: feed.y + feed.h * 0.58, width: feed.w, height: feed.h * 0.06, fill: C.mFar2 }, cnt);
    K.hab(cnt, feed.x + feed.w * 0.33, feed.y + feed.h * 0.7, 0.52);
    const mini = K.rocket(S, cnt, feed.x + feed.w * 0.72, feed.y + feed.h * 0.67, 0.3);
    X.svg('circle', { cx: feed.x + 40, cy: feed.y + 36, r: 12, fill: C.red }, cnt);
    X.svg('text', { x: feed.x + 62, y: feed.y + 48, 'font-size': 34, 'font-weight': 800, 'font-family': 'Montserrat', fill: '#fff', text: 'LIVE  PAD CAM' }, cnt);
    // timeline
    gsap.set(holder, { y: 260 });
    X.tl.fromTo(holder, { y: 260 }, { y: 0, duration: 0.7, ease: 'power3.out', immediateRender: false }, 0.05);
    X.sfx(0.1, 'whoosh', { dur: 0.45, gain: 0.35 });
    K.place(S, { s: 0.93 });
    K.move(S, 0.15, { s: 1.12, y: 30, r: -1.5 }, 2.5, 'sine.inOut');
    X.typeOn(ht, '⚠ ALERT: CREW HAS LEFT', W('hook1', 'wake'), 34);
    const a0 = W('hook1', 'blaring') - 0.1;
    for (let i = 0; i < 4; i++) {
      const t = a0 + i * 0.36;
      if (i % 2 === 0) K.tint(S, t, '#FF6B5A', 0.14, 0.34);
      X.tl.fromTo(glow, { opacity: 0.35 }, { opacity: 0, duration: 0.32, ease: 'power1.in', immediateRender: false }, t);
      X.tl.fromTo(head, { attr: { fill: '#FF4A3D' } }, { attr: { fill: C.red }, duration: 0.3, immediateRender: false }, t);
      X.sfx(t, 'beep', { dur: 0.16, gain: 0.32, pitch: i % 2 ? 0.8 : 1 });
    }
    X.tl.set(beacon, { opacity: 1 }, a0);
    // rocket in the feed lifts off (sets up the zoom-through)
    X.tl.to(mini.flame, { s: 1, duration: 0.2 }, 2.6);
    X.tl.to(mini.st, { y: feed.y + feed.h * 0.4, duration: 0.8, ease: 'power2.in' }, 2.65);
    S._feed = feed; S._dim = dim; S._mini = mini;
  });

  gsap.set(s1.g, { autoAlpha: 1 }); // visible on frame 0 (a set at t=0 is not rendered by seek(0))

  // ======================================================================= S2 launch: the last ride leaves
  const s2 = K.set('launch', T.t1, T.t2 + 0.25, {}, (S) => {
    const M = K.marsLand(S, { horizon: 760, sunX: 1560, sunY: 200, seed: 4 });
    K.rover(M.mid, 180, 770, 0.45);
    K.crate(M.act, 300, 830, 0.55, 'O₂'); K.crate(M.act, 390, 840, 0.45);
    K.hab(M.act, 640, 812, 0.95);
    const pad = X.svg('rect', { x: 1290, y: 790, width: 260, height: 36, rx: 10, fill: '#9AA4AE' }, M.act);
    const R = K.rocket(S, M.act, 1420, 792, 0.62);
    S.drift = [12, 0, 0.006];
    const guy = K.guy(S, M.act, { x: 1010, y: 930, s: 0.6, suit: true, face: 'smile', seed: 3 });
    const smoke = X.svg('g', { fill: '#F4E9DE' }, M.act);
    const puffs = [-1, 1, -0.5, 0.5, 0].map((d, i) => { const c = X.svg('circle', { cx: 0, cy: 0, r: 60, opacity: 0 }, smoke); return { c, st: K.tf(c, { x: 1420, y: 800, s: 0.2, o: 0 }, S.vis), d, i }; });
    K.dust(S, M.fg, { n: 18, color: '#E9B184', r: 5, vx: 40, vy: -8, opacity: 0.5, area: [-400, 700, 2800, 500] });
    // zoom-through landing
    K.tx.zoomThrough(s1, S, T.t1, s1._feed, { dim: s1._dim });
    const lift = W('hook2', 'flew');
    X.tl.to(R.flame, { s: 1, duration: 0.25, ease: 'back.out(2)' }, lift - 0.25);
    X.sfx(lift - 0.25, 'riser', { dur: 1.2, gain: 0.35 });
    X.sfx(lift, 'impact', { dur: 0.9, gain: 0.35 });
    puffs.forEach((p) => {
      X.tl.fromTo(p.st, { x: 1420, y: 800, s: 0.2, o: 0.95 }, { x: 1420 + p.d * 420, y: 790 - p.i * 14, s: 2.2 + p.i * 0.3, o: 0, duration: 1.6, ease: 'power2.out', immediateRender: false }, lift + p.i * 0.05);
    });
    K.shake(S, lift, 9, 1.0);
    X.tl.to(R.st, { y: -120, x: 1490, duration: 2.6, ease: 'power2.inOut' }, lift + 0.05);
    X.tl.to(R.st, { s: 0.05, duration: 2.7, ease: 'power2.in' }, lift + 0.05);
    guy.face(W('hook2', 'home') - 0.1, 'shocked');
    guy.pose(W('hook2', 'home') - 0.1, P.panic, 0.3);
    guy.hop(W('hook2', 'home') - 0.1, 30);
    guy.pose(W('hook2', 'ride'), { ...P.wave, l: [-100, -262] }, 0.3);
    guy.pose(W('hook2', 'ride') + 0.3, P.waveB, 0.25); guy.pose(W('hook2', 'ride') + 0.55, P.wave, 0.25); guy.pose(W('hook2', 'ride') + 0.8, P.waveB, 0.25);
    guy.face(W('hook2', 'ride'), 'worried');
    // tilt up after the rocket; it becomes a dot with a ping
    K.move(S, T.t1 + 0.72, { s: 1.32, x: -60, y: 100 }, 0.72, 'sine.inOut');
    K.move(S, W('hook2', 'last') - 0.1, { y: -330, x: 120, s: 0.96 }, 1.25, 'sine.inOut');
    K.move(S, W('hook2', 'shrinking'), { y: -390, x: 450, s: 1.4 }, 1.1, 'sine.inOut');
    const dotT = W('hook2', 'dot');
    const dot = X.svg('circle', { cx: 0, cy: 0, r: 0 }, M.act);
    K.ping(M.act, 1490, -120, dotT, { r: 34, w: 6, vis: S.vis });
    X.sfx(dotT, 'blip', { gain: 0.25 });
  });

  // ======================================================================= S3 space: loneliest person in the solar system
  const s3 = K.set('space', T.t2, T.t3 + 0.05, { bg: C.space }, (S) => {
    const st = S.layer(0.15), pl = S.layer(1);
    K.stars(S, st, 90, 8);
    const mars = K.planet(pl, 960, 560, 330);
    const earth = K.planet(pl, -760, 180, 70, { kind: 'earth' });
    K.ping(pl, 850, 330, T.t2 + 0.1, { r: 30, w: 6, vis: S.vis });
    // labels
    const youT = W('hook3', "you're");
    const lab = X.svg('g', {}, pl);
    const ls = K.tf(lab, { x: 850, y: 330, s: 0 }, S.vis);
    X.svg('path', { d: 'M-16,-40 L0,-14 L16,-40Z', fill: '#fff' }, lab);
    X.svg('rect', { x: -190, y: -132, width: 380, height: 94, rx: 20, fill: '#fff' }, lab);
    X.svg('text', { x: 0, y: -70, 'text-anchor': 'middle', 'font-size': 52, 'font-weight': 900, 'font-family': 'Montserrat', fill: C.ink, text: 'YOU (ALONE)' }, lab);
    X.tl.fromTo(ls, { s: 0 }, { s: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, youT);
    X.sfx(youT, 'pop', { gain: 0.35 });
    const solT = W('hook3', 'solar');
    K.ping(pl, -760, 180, solT, { r: 60, w: 9, vis: S.vis });
    const el = X.svg('g', {}, pl);
    const es = K.tf(el, { x: -760, y: 180, s: 0 }, S.vis);
    X.svg('rect', { x: -330, y: -300, width: 660, height: 150, rx: 30, fill: '#fff' }, el);
    X.svg('path', { d: 'M-24,-152 L0,-100 L24,-152Z', fill: '#fff' }, el);
    X.svg('text', { x: 0, y: -198, 'text-anchor': 'middle', 'font-size': 88, 'font-weight': 900, 'font-family': 'Montserrat', fill: C.ink, text: 'EVERYONE' }, el);
    X.tl.fromTo(es, { s: 0 }, { s: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, solT + 0.1);
    X.sfx(solT + 0.1, 'pop', { gain: 0.35, pitch: 0.8 });
    K.tx.smashOut(s2, S, T.t2, 850, 330, 7, { dur: 0.9 });
    K.move(S, W('hook3', 'loneliest') - 0.1, { s: 0.52, x: -580, y: -140 }, 1.4, 'power2.inOut');
    K.move(S, W('hook3', 'system') + 0.05, { s: 0.6, x: -700, y: -180, r: -2 }, 0.75, 'sine.inOut');
    X.sfx(W('hook3', 'loneliest') - 0.1, 'zoom_out', { dur: 1.2, gain: 0.3 });
  });

  // ======================================================================= S4 title card -> channel sting (same coral field)
  const s4 = K.set('title', T.t3, T.t5 + 0.02, { bg: C.coral, drift: [0, 0, 0.01] }, (S) => {
    const back = S.layer(0.4), L = S.layer(1);
    const rays = X.svg('g', { opacity: 0 }, back);
    for (let i = 0; i < 16; i++) X.svg('path', { d: 'M960,540 L2600,400 L2600,680Z', fill: '#E86C66', transform: `rotate(${i * 22.5} 960 540)` }, rays);
    K.hook((t) => rays.setAttribute('transform', `rotate(${(t * 14).toFixed(2)} 960 540)`), S.vis);
    const card = K.typeCard(L, [
      { text: 'COULD YOU', size: 130, t: W('title', 'could'), bar: C.navy },
      { text: 'SURVIVE?', size: 300, t: W('title', 'survive') },
    ], { rot: -12, vis: S.vis });
    K.tx.flood(s3, S, T.t3, C.coral, 960, 560);
    X.sfx(T.t3, 'impact', { dur: 0.6, gain: 0.25 });
    K.move(S, T.t3 + 0.05, { s: 1.26, r: 3 }, 1.25, 'sine.inOut');
    // element fly-off (T13): the card tilts away, the mark pops on the same field
    const ep = W('title', 'episode');
    X.tl.to(card.st, { x: -500, y: -380, r: -40, s: 0.6, duration: 0.32, ease: 'power2.in' }, ep - 0.05);
    X.sfx(ep - 0.05, 'whoosh', { dur: 0.35, gain: 0.45 });
    K.move(S, ep - 0.05, { s: 1.0, r: 0 }, 0.4, 'power2.out');
    X.tl.fromTo(rays, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, ep + 0.1);
    const tw = W('title', 'Worst'), mw = K.measure('WORST CASE', 150, 900)[10];
    const tx0 = 960 - (mw + 230) / 2 + 230;
    const badge = K.mark(L, 0, 0, 1);
    const bs = K.tf(badge, { x: tx0 - 140, y: 540, s: 0, r: -30 }, S.vis);
    X.tl.fromTo(bs, { s: 0, r: -30 }, { s: 1.25, r: 0, duration: 0.4, ease: 'back.out(2)', immediateRender: false }, ep + 0.2);
    X.sfx(ep + 0.2, 'pop', { gain: 0.45, pitch: 0.8 });
    K.bar(L, tx0 - 30, 455, mw + 60, 172, C.navy, tw - 0.05);
    K.popText(L, 'WORST CASE', tx0, 595, { size: 150, weight: 900, t: tw, stagger: 1.5 / 30, anchor: 'start' });
    K.move(S, tw, { s: 1.22, r: -3 }, T.t5 - tw - 0.2, 'sine.inOut');
  });
  const glyphWorld = (cardObj, row, ch, nth = 0) => {
    const g = cardObj.rows[row].glyphs.filter((e) => e.textContent === ch)[nth];
    const gx = +g.getAttribute('x'), gy = +g.getAttribute('y') - cardObj.rows[row].size * 0.36;
    const a = (cardObj.st.r * Math.PI) / 180;
    return [cardObj.st.x + gx * Math.cos(a) - gy * Math.sin(a), cardObj.st.y + gx * Math.sin(a) + gy * Math.cos(a)];
  };

  // ======================================================================= S5 setup: friendly-looking, deadly planet
  const s5 = K.set('setup', T.t5, T.t6 + 0.25, { bg: '#96D9EC' }, (S) => {
    const back = S.layer(0.4), L = S.layer(1);
    for (const [x, y, k] of [[260, 220, 1], [1650, 300, 0.8], [1400, 900, 0.7], [300, 860, 0.9]]) {
      const cl = X.svg('g', { fill: '#fff', opacity: 0.85 }, back);
      [[0, 0, 70], [70, -20, 90], [150, 0, 66], [75, 30, 70]].forEach(([dx, dy, r]) => X.svg('circle', { cx: dx * k, cy: dy * k, r: r * k }, cl));
      const cs = K.tf(cl, { x, y }, S.vis);
      K.hook((t) => { cs.x = x + Math.sin(t * 0.5 + y) * 40; }, S.vis);
    }
    const pl = K.planet(L, 960, 560, 270, { face: true });
    X.tl.set(pl.face, { opacity: 1 }, T.t5 + 0.2);
    X.sfx(T.t5 + 0.2, 'boing', { gain: 0.3 });
    // friendly → furious
    gsap.set(pl.brows[0], { rotation: -10 }); gsap.set(pl.brows[1], { rotation: 10 });
    const killT = W('setup', 'kill');
    X.tl.to(pl.brows[0], { rotation: 22, y: 10, duration: 0.08 }, killT - 0.2);
    X.tl.to(pl.brows[1], { rotation: -22, y: 10, duration: 0.08 }, killT - 0.2);
    X.tl.set(pl.mouth, { attr: { d: `M${960 - 270 * 0.24},${560 + 270 * 0.3} L${960 + 270 * 0.16},${560 + 270 * 0.3} L${960 + 270 * 0.16},${560 + 270 * 0.4} L${960 - 270 * 0.24},${560 + 270 * 0.4}Z`, fill: '#fff' } }, killT - 0.2);
    K.punch(S, killT - 0.2, 1.08, 0.5);
    K.shake(S, killT - 0.2, 14, 0.5);
    X.sfx(killT - 0.2, 'thud', { gain: 0.5 });
    // four ways: icon chips ring the planet
    const fw = W('setup', 'four');
    const chips = [[560, 300, 'AIR'], [1360, 300, 'COLD'], [560, 830, 'FOOD'], [1360, 830, 'HOME']];
    chips.forEach(([x, y, txt], i) => {
      const g = X.svg('g', {}, L);
      const st = K.tf(g, { x, y, s: 0 }, S.vis);
      X.svg('circle', { r: 96, fill: '#fff', filter: K.F.pshadow }, g);
      X.svg('circle', { r: 78, fill: [C.cyan, C.sky2, C.sand, C.gold][i] }, g);
      X.svg('text', { x: 0, y: 18, 'text-anchor': 'middle', 'font-size': 46, 'font-weight': 900, 'font-family': 'Montserrat', fill: C.navy, text: txt }, g);
      X.svg('circle', { cx: 66, cy: -66, r: 30, fill: C.red }, g);
      X.svg('text', { x: 66, y: -54, 'text-anchor': 'middle', 'font-size': 34, 'font-weight': 900, 'font-family': 'Montserrat', fill: '#fff', text: String(i + 1) }, g);
      X.tl.fromTo(st, { s: 0 }, { s: 1, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, fw - 0.15 + i * 0.1);
      X.sfx(fw - 0.15 + i * 0.1, 'pop', { gain: 0.3, pitch: 1 + i * 0.12 });
    });
    K.tx.whip(s4, S, T.t5, 1);
    K.move(S, T.t5 + 0.5, { s: 1.24, y: 20 }, killT - T.t5 - 0.7, 'sine.inOut');
    K.move(S, fw - 0.2, { s: 1.16, y: 0, r: 3 }, T.t6 - fw - 0.6, 'sine.inOut');
  });

  // ======================================================================= S6a air: the pressure gauge
  const s6 = K.set('air', T.t6, T.t7 + 0.25, {}, (S) => {
    const M = K.marsLand(S, { horizon: 720, sunX: 380, sunY: 220, seed: 7 });
    K.rover(M.mid, 1750, 760, 0.5, true);
    K.hab(M.act, 470, 800, 0.85);
    K.crate(M.act, 760, 860, 0.5, 'H₂O');
    const guy = K.guy(S, M.act, { x: 1000, y: 1010, s: 0.92, suit: true, face: 'neutral', seed: 5 });
    const G = K.gauge(M.act, 1450, 430, 170);
    const gs = K.tf(G.g, { x: 1450, y: 430, s: 0 }, S.vis);
    const has = W('air1', 'has');
    X.tl.fromTo(gs, { s: 0 }, { s: 1, duration: 0.35, ease: 'back.out(1.8)', immediateRender: false }, has - 0.15);
    X.sfx(has - 0.15, 'pop', { gain: 0.35 });
    G.needle.r = 100;
    const one = W('air1', 'one');
    X.tl.fromTo(G.needle, { r: 100 }, { r: -112, duration: 0.9, ease: 'elastic.out(1, 0.45)', immediateRender: false }, one);
    X.sfx(one, 'blip_down', { dur: 0.4, gain: 0.35 });
    K.tag(M.act, 1450, 620, '< 1%', one + 0.35, { size: 64, len: 50, vis: S.vis });
    K.factBox(S.hud, 'PROBLEM #1: THE AIR', T.t6 + 0.15, { accent: C.red });
    guy.pose(has, P.point, 0.4);
    guy.look(has, 6);
    guy.face(W('air1', 'pressure'), 'worried');
    guy.pose(W('air1', 'pressure') + 0.2, P.panic, 0.35);
    guy.face(W('air1', 'carbon') - 0.3, 'shocked');
    K.tx.smashIn(s5, S, T.t6, 960, 560, { k: 3.2 });
    K.move(S, T.t6 + 0.62, { s: 1.38, x: 360, y: -80 }, 1.0, 'sine.inOut');
    K.move(S, W('air1', 'pressure') - 0.25, { s: 1.18, x: 20, y: 10 }, 0.5, 'sine.inOut');
  });

  // ======================================================================= S6b close-up: carbon dioxide
  const s6b = K.set('co2', T.t7, T.t8 + 0.02, { bg: C.cyan }, (S) => {
    const back = S.layer(0.5), L = S.layer(1);
    const rr = X.rand(44);
    for (let i = 0; i < 14; i++) {
      const m = K.molecule(back, 0, 0, 0.3 + rr() * 0.3);
      const bx = rr() * 1920, by = rr() * 1080, ph = rr() * 6;
      K.hook((t) => { m.st.x = bx + Math.sin(t * 0.7 + ph) * 60; m.st.y = by - ((t * 30 + ph * 100) % 1300) + 200; m.st.r = t * 20 + ph * 40; }, S.vis);
    }
    const big = K.molecule(L, 960, 430, 1.7);
    K.hook((t) => { big.st.r = Math.sin(t * 1.4) * 8; big.st.y = 430 + Math.sin(t * 2) * 10; }, S.vis);
    const ct = W('air1', 'carbon');
    K.bigNum(L, '95% CO₂', 960, 800, ct, { size: 170, weight: 900 });
    K.tx.smashIn(s6, S, T.t7, 960, 260, { k: 2.6, hit: false });
    K.move(S, T.t7 + 0.6, { s: 1.38, r: 6 }, T.t8 - T.t7 - 0.8, 'sine.inOut');
  });

  // ======================================================================= S7 no suit: 15 seconds
  const s7 = K.set('nosuit', T.t8, T.t9 + 0.02, {}, (S) => {
    const M = K.marsLand(S, { horizon: 640, sunX: 1650, sunY: 180, seed: 9 });
    K.hab(M.act, 260, 860, 1.35);
    const guy = K.guy(S, M.act, { x: 420, y: 930, s: 0.95, face: 'smile', seed: 9 });
    const st0 = W('air2', 'Step');
    X.tl.fromTo(guy.st, { x: 420 }, { x: 860, duration: 0.55, ease: 'power3.out', immediateRender: false }, st0);
    guy.hop(st0 + 0.05, 40);
    guy.pose(st0, P.wave, 0.3);
    guy.pose(st0 + 0.5, P.rest, 0.3);
    guy.face(W('air2', 'without'), 'shocked');
    guy.pose(W('air2', 'without') + 0.1, { l: [-60, -440], r: [60, -440], bl: -40, br: 40 }, 0.25);
    const SW = K.stopwatch(M.act, 1460, 420, 150);
    SW.st.s = 0;
    const pass = W('air2', 'pass');
    X.tl.fromTo(SW.st, { s: 0 }, { s: 1, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, pass - 0.2);
    X.sfx(pass - 0.2, 'pop', { gain: 0.35 });
    const ft = W('air2', 'fifteen');
    X.countUp(SW.txt, 15, 0, ft, 1.2, (v) => String(Math.ceil(v - 0.001)), 'none');
    X.tl.fromTo(SW.hand, { r: 0 }, { r: 360, duration: 1.2, ease: 'none', immediateRender: false }, ft);
    for (let i = 0; i < 8; i++) X.sfx(ft + i * 0.15, i % 2 ? 'tock' : 'tick', { gain: 0.3 });
    guy.face(pass, 'woozy');
    guy.pose(pass, { l: [-120, -300], r: [120, -300], bl: 30, br: -30 }, 0.4);
    X.tl.to(guy.p, { lean: 9, duration: 0.45, ease: 'sine.inOut', yoyo: true, repeat: 3 }, pass + 0.05);
    guy.face(ft + 1.15, 'ko');
    X.tl.to(guy.p, { lean: -24, duration: 0.3, ease: 'power2.in' }, ft + 1.2);
    K.tx.whip(s6b, S, T.t8, -1);
    K.move(S, W('air2', 'Step') + 0.45, { s: 1.12, x: -60, y: 0 }, 0.6, 'sine.inOut');
    K.move(S, W('air2', 'and') - 0.1, { s: 1.65, x: 40, y: -150 }, T.t9 - W('air2', 'and') - 0.3, 'power1.inOut');
  });

  // ======================================================================= S8 close-up: the helmet stays on
  const s8 = K.set('helmet', T.t9, T.t10 + 0.05, { bg: C.gold }, (S) => {
    const rays = X.svg('g', {}, S.layer(0.3));
    for (let i = 0; i < 14; i++) X.svg('path', { d: 'M960,540 L2600,430 L2600,650Z', fill: '#F1CB6C', transform: `rotate(${i * 25.7} 960 540)` }, rays);
    K.hook((t) => rays.setAttribute('transform', `rotate(${(-t * 10).toFixed(2)} 960 540)`), S.vis);
    const L = S.layer(1);
    const guy = K.guy(S, L, { x: 960, y: 1560, s: 2.25, suit: true, face: 'neutral', seed: 12 });
    guy.face(W('air3', 'helmet'), 'smug');
    guy.pose(W('air3', 'helmet'), P.thumbs, 0.35);
    X.sfx(W('air3', 'helmet') + 0.1, 'ding', { gain: 0.25 });
    const nose = W('air3', 'nose');
    guy.face(nose - 0.15, 'worried');
    guy.pose(nose - 0.15, P.rest, 0.3);
    const itch = X.svg('g', { fill: C.red }, L);
    [[-22, 0], [0, -14], [22, 0]].forEach(([dx, dy], i) => {
      const r = X.svg('rect', { x: 960 + dx * 3 - 5, y: 1560 - 2.25 * 470 + dy * 3 - 18, width: 10, height: 36, rx: 5, transform: `rotate(${(i - 1) * 30} ${960 + dx * 3} ${1560 - 2.25 * 470})` }, itch);
      X.pop(r, nose + i * 0.06, { dur: 0.2, sfx: false });
    });
    const bonk = W('air3', 'itches') + 0.05;
    guy.pose(bonk - 0.28, { r: [34, -478], br: -70 }, 0.26, 'power3.in');
    X.sfx(bonk, 'boing', { gain: 0.45 });
    X.sfx(bonk, 'thud', { gain: 0.3 });
    K.shake(S, bonk, 16, 0.4);
    guy.face(bonk, 'angry');
    guy.pose(bonk + 0.25, { r: [140, -330], br: -40 }, 0.35);
    K.qmarks(L, 1290, 260, bonk + 0.12, { size: 110, gap: 70 });
    K.tx.blink(s7, S, T.t9);
    K.move(S, T.t9 + 0.3, { s: 1.2, y: 10 }, bonk - T.t9 - 0.35, 'sine.inOut');
    K.move(S, bonk - 0.02, { s: 1.36, r: -4 }, 0.18, 'power3.out');
    K.move(S, bonk + 0.3, { s: 1.04, r: 0, x: 140 }, T.t10 - bonk - 0.5, 'sine.inOut');
  });

  // ======================================================================= S9 cold: minus eighty
  const s9 = K.set('cold', T.t10, T.t12 + 0.3, { bg: '#A2D9E8' }, (S) => {
    const back = S.layer(0.4), L = S.layer(1), fx = S.layer(1.2);
    X.svg('path', { d: 'M-600,880 Q300,780 960,860 Q1600,940 2600,830 L2600,1600 L-600,1600Z', fill: '#D3F1F8' }, back);
    X.svg('path', { d: 'M-600,940 Q500,880 1100,950 Q1700,1010 2600,930 L2600,1600 L-600,1600Z', fill: '#EEF9FC' }, L);
    const th = K.thermo(L, 640, 800, 560);
    // solar array further right on the snow (revealed by a pan on "your heater runs on solar power")
    K.sun(back, 1700, 190, 80);
    for (const [x, y, sc] of [[1640, 960, 0.85], [1960, 980, 0.9], [2280, 965, 0.85]]) K.panel(L, x, y, sc);
    for (let i = 0; i < 14; i++) X.svg('ellipse', { cx: 300 + i * 190 + (i % 3) * 40, cy: 1000 + (i % 4) * 22, rx: 46 + (i % 3) * 18, ry: 12, fill: '#CFEFF7' }, L);
    const guy = K.guy(S, L, { x: 1250, y: 1030, s: 1.0, suit: true, face: 'neutral', seed: 14 });
    K.dust(S, fx, { n: 70, color: '#fff', r: 9, vx: -40, vy: 90, opacity: 0.9, area: [-300, -100, 3300, 1300], seed: 31 });
    const minus = W('cold1', 'minus');
    X.tl.fromTo(th.lvl, { v: 0.85 }, { v: 0.07, duration: 1.0, ease: 'power2.inOut', immediateRender: false }, minus - 0.1);
    X.sfx(minus - 0.1, 'blip_down', { dur: 0.9, gain: 0.3 });
    K.tag(L, 860, 320, '−80°F', W('cold1', 'eighty') + 0.15, { size: 72, len: 60, vis: S.vis });
    // frost creeps in from the corners
    [[0, 0], [1920, 0], [0, 1080], [1920, 1080]].forEach(([x, y], i) => {
      const f = X.svg('g', { fill: '#fff', opacity: 0.85 }, S.hud);
      [[0, 0, 170], [x ? -150 : 150, 30, 90], [30, y ? -150 : 150, 100]].forEach(([dx, dy, r]) => X.svg('circle', { cx: x + dx, cy: y + dy, r }, f));
      gsap.set(f, { transformOrigin: `${x ? '100%' : '0%'} ${y ? '100%' : '0%'}`, scale: 0 });
      X.tl.fromTo(f, { scale: 0 }, { scale: 1, duration: 0.6, ease: 'power2.out', immediateRender: false }, minus + 0.1 + i * 0.06);
    });
    X.sfx(minus + 0.1, 'sparkle', { dur: 0.6, gain: 0.3 });
    guy.face(minus, 'worried');
    guy.pose(minus, P.hug, 0.35);
    guy.shiver(minus + 0.2, 1.3, 4);
    K.factBox(S.hud, 'PROBLEM #2: THE COLD', T.t10 + 0.2, { accent: C.cyan });
    K.tx.bands(s8, S, T.t10, [C.cyan, '#fff', C.navy, C.sky]);
    K.move(S, T.t10 + 0.45, { s: 1.32, x: -260, y: -50 }, 1.1, 'sine.inOut');
    K.move(S, W('cold1', 'eighty') + 0.1, { s: 1.15, x: 240, y: 20 }, 0.6, 'sine.inOut');
    // pan to the solar array; the guy perks up
    const ht = W('cold1', 'heater'), pw = W('cold1', 'solar');
    K.move(S, ht - 0.25, { s: 1.0, x: 620, y: -20 }, 0.9, 'sine.inOut');
    guy.shiver(ht, 0.1, 0);
    guy.pose(pw - 0.1, P.thumbs, 0.3);
    guy.face(pw - 0.1, 'grin');
    guy.hop(pw - 0.1, 26);
    [[1610, 760], [1940, 780], [2250, 765], [1790, 820], [2110, 825]].forEach(([x, y], i) => {
      const sp = X.svg('path', { d: `M${x},${y - 30} L${x + 8},${y - 8} L${x + 30},${y} L${x + 8},${y + 8} L${x},${y + 30} L${x - 8},${y + 8} L${x - 30},${y} L${x - 8},${y - 8}Z`, fill: '#fff' }, L);
      X.pop(sp, pw + 0.1 + i * 0.06, { dur: 0.25, sfx: false });
      X.tl.to(sp, { scale: 0, duration: 0.25 }, pw + 0.6 + i * 0.06);
    });
    X.sfx(pw + 0.1, 'sparkle', { dur: 0.5, gain: 0.3 });
    K.move(S, pw + 0.4, { s: 1.26, x: 720, y: 10 }, T.t12 - pw - 0.75, 'sine.inOut');
  });

  // ======================================================================= S11 dust storm
  const s11 = K.set('storm', T.t12 - 0.28, T.t13 + 0.02, {}, (S) => {
    const M = K.marsLand(S, { horizon: 700, sun: false, seed: 12 });
    S.bgRect.setAttribute('fill', '#E2AE80');
    const sun = K.sun(M.sky, 1500, 210, 74);
    K.hab(M.act, 470, 810, 0.8);
    K.rover(M.mid, 1500, 745, 0.4);
    for (const [x, y, s] of [[1080, 860, 0.8], [1400, 880, 0.85], [1730, 870, 0.8]]) K.panel(M.act, x, y, s);
    const guy = K.guy(S, M.act, { x: 820, y: 970, s: 0.72, suit: true, face: 'worried', seed: 18, pose: { lean: -10, hlx: -60, hly: -520, hrx: 60, hry: -520, bl: -30, br: 30 } });
    guy.shiver(T.t12, 2.2, 2.5);
    const haze = X.svg('rect', { x: -2000, y: -1500, width: 6000, height: 4000, fill: '#C98B5E', opacity: 0.38 }, S.layer(1));
    const fx = S.layer(1.3);
    K.dust(S, fx, { n: 80, color: '#B97A50', r: 9, vx: 900, vy: 30, wob: 30, opacity: 0.75, area: [-400, -200, 2720, 1480], seed: 51 });
    K.dust(S, fx, { n: 40, color: '#E4B88E', r: 5, vx: 1300, vy: 10, wob: 20, opacity: 0.7, area: [-400, -200, 2720, 1480], seed: 52 });
    const blot = W('cold2', 'blots');
    X.tl.fromTo(sun, { opacity: 1 }, { opacity: 0.15, duration: 0.7, ease: 'power2.inOut', immediateRender: false }, blot);
    X.tl.fromTo(haze, { attr: { opacity: 0.38 } }, { attr: { opacity: 0.62 }, duration: 0.7, immediateRender: false }, blot);
    const cal = K.calendar(S.hud, 1460, 470, 0, 'WEEKS');
    const wk = W('cold2', 'for');
    X.tl.fromTo(cal.st, { s: 0, r: -20 }, { s: 1, r: -6, duration: 0.35, ease: 'back.out(2)', immediateRender: false }, wk - 0.1);
    X.sfx(wk - 0.1, 'pop', { gain: 0.35 });
    K.flipPages(cal, wk + 0.2, 4, 0.14);
    K.shake(S, T.t12, 7, 2.3);
    K.tx.liquid(s9, S, T.t12, '#B97A50', { dur: 0.55 });
    K.place(S, { x: 220, s: 1.1 });
    K.move(S, T.t12 + 0.3, { x: 100, s: 1.48 }, T.t13 - T.t12 - 0.5, 'sine.inOut');
  });

  // ======================================================================= S12 dig for ice, melt it
  const s12 = K.set('dig', T.t13, T.t14 + 0.42, {}, (S) => {
    S.bgRect.setAttribute('fill', C.mSky);
    const sky = S.layer(0.3), L = S.layer(1);
    K.sun(sky, 1600, -200, 60, { pale: true });
    X.svg('rect', { x: -2000, y: 330, width: 6000, height: 120, fill: C.mFar2 }, sky);
    const strata = [[400, C.mGround], [520, '#BE5C36'], [700, '#AA4F2E'], [900, '#954429'], [1150, '#823A24']];
    strata.forEach(([y, c], i) => {
      let d = `M-2000,${y}`;
      for (let x = -2000; x <= 4000; x += 400) d += ` Q${x + 200},${y + (i ? (i % 2 ? 24 : -24) : 0)} ${x + 400},${y}`;
      X.svg('path', { d: d + ' L4000,2400 L-2000,2400Z', fill: c }, L);
    });
    const ices = [[300, 640, 0.9], [760, 800, 1.2], [1250, 620, 0.8], [1600, 820, 1.1], [520, 1000, 1.0], [1100, 1040, 1.3]].map(([x, y, s]) => K.ice(L, x, y, s));
    const gx = 820, gy = 420, gs = 0.74;
    const guy = K.guy(S, L, { x: gx, y: gy, s: gs, suit: true, face: 'neutral', seed: 20, hands: { l: [40, -330], r: [80, -320] } });
    const pick = X.svg('g', {}, L);
    const pg = K.pickaxe(pick); pg.setAttribute('transform', 'translate(0 -200)');
    const ps = K.tf(pick, { x: gx + 60 * gs, y: gy - 325 * gs, s: gs, r: -25 }, S.vis);
    const pot = K.pot(S, L, 1540, 400, 0.8);
    pot.st.s = 0;
    const chunk = K.ice(L, 1000, 430, 0);
    // camera: tilt down into the ground, back up for the dig
    K.place(S, { y: -60, s: 1.0 });
    K.tx.whip(s11, S, T.t13, 1, true);
    const fr = W('food1', 'frozen');
    K.move(S, fr - 0.1, { y: 110, s: 1.1 }, 0.8, 'sine.inOut');
    ices.forEach((c, i) => X.tl.fromTo(c.st, { s: c.st.s * 0.6 }, { s: c.st.s, duration: 0.4, ease: 'back.out(3)', immediateRender: false }, fr + 0.3 + i * 0.07));
    X.sfx(fr + 0.3, 'sparkle', { dur: 0.6, gain: 0.3 });
    const dig = W('food1', 'dig');
    K.move(S, dig - 0.35, { y: -130, s: 1.22, x: 80 }, 0.5, 'power2.inOut');
    X.tl.to(ps, { r: -60, duration: 0.25, ease: 'power2.out' }, dig - 0.35);
    X.tl.to(ps, { r: 118, duration: 0.15, ease: 'power3.in' }, dig - 0.05);
    X.sfx(dig + 0.1, 'thud', { gain: 0.5 }); X.sfx(dig + 0.1, 'impact', { gain: 0.25 });
    K.shake(S, dig + 0.1, 14, 0.4);
    X.tl.fromTo(chunk.st, { x: 1000, y: 430, s: 0, r: 0 }, { x: 1160, y: 230, s: 1.2, r: 200, duration: 0.45, ease: 'power2.out', immediateRender: false }, W('food1', 'up'));
    X.sfx(W('food1', 'ice'), 'sparkle', { dur: 0.4, gain: 0.25 });
    const melt = W('food1', 'melt');
    X.tl.fromTo(pot.st, { s: 0 }, { s: 0.8, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, melt - 0.35);
    X.sfx(melt - 0.35, 'pop', { gain: 0.3 });
    X.tl.to(chunk.st, { x: 1540, y: 300, s: 0.5, r: 380, duration: 0.35, ease: 'power2.in' }, melt - 0.15);
    X.tl.to(chunk.st, { s: 0, duration: 0.1 }, melt + 0.2);
    X.tl.set(pot.steam, { opacity: 1 }, melt + 0.2);
    X.sfx(melt + 0.2, 'bubble', { gain: 0.3 }); X.sfx(melt + 0.35, 'bubble', { gain: 0.25, pitch: 1.2 });
    K.move(S, melt - 0.3, { x: 330, y: -150, s: 1.28 }, 0.9, 'sine.inOut');
    K.factBox(S.hud, 'PROBLEM #3: FOOD & WATER', T.t13 + 0.2, { accent: C.grass });
  });

  // ======================================================================= S13 greenhouse: wash the soil, a dozen potatoes
  const s13 = K.set('farm', T.t14 - 0.4, T.t15 + 0.25, { bg: '#BFE3CF' }, (S) => {
    const back = S.layer(0.5), L = S.layer(1);
    for (let i = 0; i < 6; i++) {
      X.svg('rect', { x: -200 + i * 420, y: 120, width: 360, height: 420, rx: 20, fill: C.mSky }, back);
      X.svg('rect', { x: -200 + i * 420, y: 400, width: 360, height: 140, fill: C.mGround, opacity: 0.85 }, back);
    }
    X.svg('path', { d: 'M-400,140 Q960,-260 2320,140 L2320,60 Q960,-340 -400,60Z', fill: '#fff' }, back);
    for (let i = 0; i < 7; i++) X.svg('rect', { x: -230 + i * 420, y: 60, width: 30, height: 560, fill: '#fff' }, back);
    X.svg('rect', { x: -400, y: 600, width: 2800, height: 900, fill: '#93CBA8' }, back);
    K.tray(L, 1080, 780, 1.0);
    const sprouts = X.svg('g', {}, L);
    const guy = K.guy(S, L, { x: 330, y: 1050, s: 0.85, face: 'neutral', seed: 22, hands: { r: [150, -420] }, pose: { br: -40 } });
    // toxic stamp + red pulse
    const tx = W('food2', 'toxic');
    const stp = K.stamp(L, 1080, 560, 'TOXIC SALTS', tx, { size: 84, rot: -8, ctx: S, vis: S.vis });
    K.tint(S, tx + 0.15, '#FF6B5A', 0.16, 0.5);
    guy.face(tx + 0.2, 'shocked');
    // wash: spray from the hose
    const wash = W('food2', 'wash');
    const hose = X.svg('path', { d: `M${330 + 150 * 0.85},${1050 - 420 * 0.85} Q620,560 760,640`, fill: 'none', stroke: '#3AA6D3', 'stroke-width': 26, 'stroke-linecap': 'round', opacity: 0 }, L);
    X.tl.set(hose, { opacity: 1 }, wash - 0.1);
    const drops = K.dust(S, L, { n: 46, color: '#5BC2EA', r: 9, vx: 0, vy: 900, wob: 8, opacity: 0, area: [680, 560, 820, 180], seed: 61 });
    X.tl.fromTo(drops, { opacity: 0 }, { opacity: 0.9, duration: 0.1, immediateRender: false }, wash - 0.05);
    X.tl.to(drops, { opacity: 0, duration: 0.2 }, wash + 0.65);
    X.tl.to(hose, { opacity: 0, duration: 0.15 }, wash + 0.7);
    X.sfx(wash - 0.05, 'woosh_low', { dur: 0.7, gain: 0.35 });
    X.tl.to(stp.st, { o: 0, s: 0.8, duration: 0.3 }, wash + 0.35);
    guy.face(wash, 'smile');
    // a dozen potatoes pop out of the soil
    const dz = W('food2', 'dozen');
    for (let i = 0; i < 12; i++) {
      const x = 760 + (i % 6) * 128, y = 700 + Math.floor(i / 6) * 70;
      const leaf = X.svg('path', { d: `M${x},${y - 10} q-30,-60 -4,-90 q20,40 4,90Z M${x},${y - 10} q34,-50 60,-50 q-16,40 -60,50Z`, fill: C.grass }, sprouts);
      X.pop(leaf, W('food2', 'grow') + i * 0.02, { dur: 0.3, sfx: false });
      const pt = K.potato(L, x, y - 40, 0, 70 + i);
      X.tl.fromTo(pt.st, { s: 0, y: y + 10 }, { s: 0.9, y: y - 40, duration: 0.3, ease: 'back.out(2.4)', immediateRender: false }, dz - 0.1 + i * 0.07);
      if (i % 2 === 0) X.sfx(dz - 0.1 + i * 0.07, 'pop', { gain: 0.25, pitch: 0.9 + i * 0.04 });
    }
    K.tag(S.hud, 1600, 0, '×12 A DAY', W('food2', 'potatoes') + 0.25, { size: 60, len: 170, vis: S.vis });
    guy.face(dz + 0.4, 'worried');
    K.tx.slide(s12, S, T.t14, 1);
    K.move(S, T.t14 + 0.45, { s: 1.14, x: 110, y: -30 }, 0.9, 'sine.inOut');
    K.move(S, dz - 0.2, { s: 1.32, x: 170, y: -20 }, 1.1, 'sine.inOut');
  });

  // ======================================================================= S14 close-up: fertilizer
  const s14 = K.set('fert', T.t15, T.t16 + 0.05, { bg: C.grass }, (S) => {
    const L = S.layer(1);
    const guy = K.guy(S, L, { x: 720, y: 1560, s: 2.3, face: 'neutral', seed: 24, hands: { r: [250, -360] }, pose: { br: -30 } });
    const B = K.bucket(S, L, 1390, 880, 1.45);
    const fz = W('food3', 'fertilizer');
    guy.face(fz, 'side');
    X.sfx(fz + 0.2, 'blip_up', { gain: 0.2 });
    const mk = W('food3', 'make');
    X.tl.to(B.stink, { opacity: 1, duration: 0.2 }, mk - 0.1);
    guy.face(mk, 'sick');
    guy.pose(mk + 0.1, { l: [-30, -450], bl: 50 }, 0.3);
    X.sfx(mk, 'boing', { gain: 0.25, pitch: 0.7 });
    // two flies orbit the bucket
    for (let i = 0; i < 2; i++) {
      const fly = X.svg('g', {}, L);
      X.svg('ellipse', { cx: -9, cy: -10, rx: 12, ry: 7, fill: '#fff', opacity: 0.8 }, fly); X.svg('ellipse', { cx: 9, cy: -10, rx: 12, ry: 7, fill: '#fff', opacity: 0.8 }, fly);
      X.svg('circle', { r: 10, fill: '#222' }, fly);
      const fs = K.tf(fly, { s: 0 }, S.vis);
      X.tl.to(fs, { s: 1, duration: 0.2 }, mk + i * 0.15);
      K.hook((t) => { fs.x = 1390 + Math.cos(t * 5 + i * 3) * 170; fs.y = 560 + Math.sin(t * 7 + i * 2) * 60; }, S.vis);
    }
    K.tx.smashIn(s13, S, T.t15, 330, 700, { k: 2.4 });
    K.move(S, T.t15 + 0.6, { s: 1.2, r: -4, x: -90, y: -50 }, 0.8, 'sine.inOut');
    K.move(S, mk + 0.1, { s: 1.32, r: 2, x: 220, y: 30 }, T.t16 - mk - 0.45, 'sine.inOut');
  });

  // ======================================================================= S15a getting home: the hitchhiker
  const s15 = K.set('hitch', T.t16, T.t17 + 0.25, {}, (S) => {
    const M = K.marsLand(S, { horizon: 720, sunX: 420, sunY: 200, seed: 15 });
    K.hab(M.act, 380, 800, 0.7);
    K.rover(M.act, 1450, 860, 0.6, true);
    K.crate(M.act, 680, 860, 0.5); K.crate(M.act, 760, 870, 0.42, 'O₂');
    K.devil(S, M.mid, 1700, 760, 1.2);
    const guy = K.guy(S, M.act, { x: 960, y: 1000, s: 0.86, suit: true, face: 'smile', seed: 26 });
    const sign = X.svg('g', {}, M.act);
    const ss = K.tf(sign, { x: 960, y: 1000 - 0.86 * 330, s: 0, r: -4 }, S.vis);
    X.svg('rect', { x: -170, y: -110, width: 340, height: 170, rx: 8, fill: '#D9A86A' }, sign);
    X.svg('rect', { x: -170, y: 40, width: 340, height: 20, fill: '#C48F52' }, sign);
    X.svg('text', { x: 0, y: 4, 'text-anchor': 'middle', 'font-size': 76, 'font-weight': 900, 'font-family': 'Montserrat', fill: '#3B2A1A', text: 'EARTH?' }, sign);
    const gh = W('home1', 'getting');
    guy.pose(gh - 0.2, { l: [-118, -330], r: [118, -330], bl: 30, br: -30 }, 0.3);
    X.tl.fromTo(ss, { s: 0 }, { s: 0.86, duration: 0.3, ease: 'back.out(2)', immediateRender: false }, gh - 0.1);
    X.sfx(gh - 0.1, 'pop', { gain: 0.35 });
    guy.hop(gh, 30);
    K.hook((t) => { ss.r = -4 + Math.sin(t * 6) * 3; }, S.vis);
    guy.face(W('home1', 'big'), 'worried');
    K.factBox(S.hud, 'PROBLEM #4: GETTING HOME', T.t16 + 0.2, { accent: C.gold });
    K.tx.circles(s14, S, T.t16, [C.coral, C.gold, C.cyan]);
    K.move(S, T.t16 + 0.4, { s: 1.48, y: -80 }, T.t17 - T.t16 - 0.6, 'sine.inOut');
  });

  // ======================================================================= S15b orbit diagram: 26 months + 7 more
  const s15b = K.set('orbit', T.t17, T.t18 + 0.05, { bg: C.space }, (S) => {
    const st = S.layer(0.2), L = S.layer(1);
    K.stars(S, st, 80, 13);
    const O = K.orbits(S, L, 960, 560, { rE: 290, rM: 470, e: 250, m: 304 });
    const lu = W('home1', 'line'), ev = W('home1', 'once'), tr = W('home1', 'trip'), sv = W('home1', 'seven');
    X.tl.fromTo(O.ang, { e: 250, m: 304 }, { e: 270, m: 314, duration: lu - T.t17, ease: 'none', immediateRender: false }, T.t17);
    // alignment line pulses on "line up"
    const al = X.svg('line', { x1: 960, y1: 560 - 290, x2: 960 + Math.cos(314 * Math.PI / 180) * 470, y2: 560 + Math.sin(314 * Math.PI / 180) * 470, stroke: C.hi, 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0 }, L);
    X.tl.fromTo(al, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power1.in', immediateRender: false }, lu);
    X.sfx(lu, 'ding', { gain: 0.3 });
    // 26 months: Earth laps 2.17×, Mars 1.15×, then aligned again
    X.tl.fromTo(O.ang, { e: 270, m: 314 }, { e: 1050, m: 728, duration: 1.15, ease: 'power1.inOut', immediateRender: false }, ev);
    const cnt = X.svg('text', { x: 280, y: 560, 'text-anchor': 'middle', 'font-size': 96, 'font-weight': 900, 'font-family': 'Montserrat', fill: '#fff', filter: K.F.tshadow }, S.hud);
    const unit = X.svg('text', { x: 280, y: 620, 'text-anchor': 'middle', 'font-size': 44, 'font-weight': 800, 'font-family': 'Montserrat', fill: C.hi, text: 'MONTHS', opacity: 0 }, S.hud);
    X.tl.set(unit, { opacity: 1 }, ev);
    X.tl.set(cnt, { opacity: 0 }, 0); X.tl.set(cnt, { opacity: 1 }, ev);
    X.countUp(cnt, 0, 26, ev, 1.15, (v) => String(Math.round(v)), 'power1.inOut');
    for (let i = 0; i < 6; i++) X.sfx(ev + i * 0.18, 'tick', { gain: 0.25 });
    X.sfx(ev + 1.15, 'ding', { gain: 0.35 });
    // transfer: red arc with arrowhead, rocket rides it
    const p0 = [960 + Math.cos(330 * Math.PI / 180) * 290, 560 + Math.sin(330 * Math.PI / 180) * 290];
    const p1 = [960 + Math.cos(150 * Math.PI / 180) * 470, 560 + Math.sin(150 * Math.PI / 180) * 470];
    const arc = X.svg('path', { d: `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A380,369 330 0 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`, fill: 'none', stroke: C.red, 'stroke-width': 9, 'stroke-linecap': 'round' }, L);
    X.drawOn(arc, tr - 0.1, 1.3, 'power1.inOut');
    gsap.set(arc, { strokeDashoffset: arc.getTotalLength() });
    X.tl.fromTo(O.ang, { e: 1050, m: 728 }, { e: 1250, m: 870, duration: 1.3, ease: 'power1.inOut', immediateRender: false }, tr - 0.1);
    const rk = X.svg('g', {}, L);
    X.svg('path', { d: 'M-10,30 L0,-30 L10,30Z', fill: '#fff' }, rk); X.svg('circle', { cx: 0, cy: 34, r: 7, fill: C.orange }, rk);
    const prog = { v: 0 }, AL = arc.getTotalLength();
    X.tl.set(rk, { opacity: 0 }, 0); X.tl.set(rk, { opacity: 1 }, tr - 0.1);
    X.tl.fromTo(prog, { v: 0 }, { v: 1, duration: 1.3, ease: 'power1.inOut', immediateRender: false }, tr - 0.1);
    K.hook(() => { const a = arc.getPointAtLength(prog.v * AL), b = arc.getPointAtLength(Math.min(AL, prog.v * AL + 2)); const ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI + 90; rk.setAttribute('transform', `translate(${a.x.toFixed(1)} ${a.y.toFixed(1)}) rotate(${ang.toFixed(1)}) scale(1.6)`); }, S.vis);
    X.sfx(tr - 0.1, 'whoosh', { dur: 1.2, gain: 0.3 });
    K.tag(S.hud, 1560, 0, '+7 MONTHS', sv - 0.05, { size: 58, len: 300, vis: S.vis, bg: C.hi });
    K.tx.smashOut(s15, S, T.t17, 960, 560, 5, { dur: 0.8 });
    K.move(S, lu, { s: 1.42, x: 60, y: -120 }, 0.8, 'sine.inOut');
    K.move(S, ev + 0.1, { s: 1.0, x: 0, y: 0 }, 0.8, 'sine.inOut');
    K.move(S, tr, { s: 1.42, x: -240, y: 70 }, 1.3, 'sine.inOut');
  });

  // ======================================================================= S17 type card: nearly three years
  let card2;
  const s17 = K.set('years', T.t18, T.t19 + 0.48, { bg: C.navy, drift: [0, 0, 0] }, (S) => {
    const L = S.layer(1);
    card2 = K.typeCard(L, [
      { text: 'NEARLY', size: 110, t: W('home2', 'nearly') },
      { text: '3 YEARS', size: 290, t: W('home2', 'three'), colors: { 0: C.hi, 2: C.hi, 3: C.hi, 4: C.hi, 5: C.hi, 6: C.hi } },
      { text: 'OF WAITING', size: 140, t: W('home2', 'of') },
    ], { rot: -10, vis: S.vis });
    K.tx.flood(s15b, S, T.t18, C.navy, 1560, 300);
    X.sfx(T.t18, 'impact', { dur: 0.6, gain: 0.25 });
    K.move(S, T.t18, { s: 1.26, r: 4 }, T.t19 - T.t18 - 0.42, 'sine.inOut');
  });

  // ======================================================================= S18 verdict: maybe
  const s18 = K.set('verdict', T.t19, T.t20 + 0.25, { bg: C.sand2 }, (S) => {
    const back = S.layer(0.5), L = S.layer(1);
    for (let i = -2; i < 14; i++) X.svg('rect', { x: i * 200, y: -300, width: 192, height: 1600, rx: 10, fill: i % 2 ? '#E4B444' : C.sand2 }, back);
    X.svg('circle', { cx: 1500, cy: 330, r: 150, fill: '#D8B45A' }, back);
    X.svg('circle', { cx: 1500, cy: 330, r: 118, fill: C.mSky }, back);
    X.svg('rect', { x: 1382, y: 360, width: 236, height: 100, fill: C.mGround }, back);
    X.svg('rect', { x: -400, y: 900, width: 2800, height: 600, fill: '#D9A84E' }, back);
    const guy = K.guy(S, L, { x: 880, y: 1010, s: 1.0, face: 'neutral', seed: 28 });
    const sup = W('verdict1', 'tons');
    [[300, 1000, 'FOOD'], [480, 1000, 'H₂O'], [390, 830, 'O₂'], [1320, 1000, 'SEEDS']].forEach(([x, y, lab], i) => {
      const g = X.svg('g', {}, L);
      K.crate(g, 0, 0, 1, lab);
      const cs = K.tf(g, { x, y: y - 900 }, S.vis);
      X.tl.fromTo(cs, { y: y - 1100 }, { y, duration: 0.4, ease: 'bounce.out', immediateRender: false }, sup - 0.1 + i * 0.12);
      X.sfx(sup + 0.18 + i * 0.12, 'thud', { gain: 0.35 });
    });
    for (let i = 0; i < 9; i++) { const p = K.potato(L, 1560 + (i % 4) * 70 - Math.floor(i / 4) * 35, 1000 - Math.floor(i / 4) * 50, 0, 90 + i); X.tl.fromTo(p.st, { s: 0 }, { s: 0.85, duration: 0.25, ease: 'back.out(2)', immediateRender: false }, sup + 0.3 + i * 0.04); }
    const sm = W('verdict1', 'smell');
    const pin = X.svg('g', {}, guy.extras);
    X.svg('rect', { x: -10, y: -480, width: 20, height: 46, rx: 6, fill: C.red }, pin);
    X.svg('rect', { x: -14, y: -462, width: 28, height: 10, rx: 4, fill: '#B3B3B3' }, pin);
    X.pop(pin, W('verdict1', 'no') - 0.05, { dur: 0.3, sfx: 'boing', gain: 0.3 });
    guy.face(W('verdict1', 'no'), 'smug');
    guy.pose(W('verdict1', 'With'), P.hips, 0.4);
    const mb = W('verdict1', 'maybe');
    K.stamp(L, 1250, 360, 'MAYBE?', mb - 0.1, { size: 110, rot: -12, bg: C.navy, ctx: S, vis: S.vis });
    guy.face(mb, 'grin');
    guy.pose(mb, P.shrug, 0.3);
    guy.pose(mb + 0.5, P.thumbs, 0.3);
    K.tx.letterZoom(s17, S, T.t19, ...glyphWorld(card2, 2, 'I', 0), { k: 300, r: 10 });
    K.move(S, T.t19 + 0.45, { s: 1.32, x: -20, y: -130 }, sm - T.t19 - 0.55, 'sine.inOut');
    K.move(S, mb - 0.25, { s: 1.2, x: 200, y: -50 }, T.t20 - mb - 0.1, 'sine.inOut');
  });

  // ======================================================================= S19 alone for three years: vast plain
  const s19 = K.set('alone', T.t20, T.t21 + 0.05, {}, (S) => {
    const M = K.marsLand(S, { horizon: 640, sunX: 1600, sunY: 190, seed: 19, rocks: 40 });
    K.hab(M.act, 900, 700, 0.24);
    K.rover(M.act, 760, 706, 0.12);
    const guy = K.guy(S, M.act, { x: 1010, y: 712, s: 0.13, suit: true, face: 'worried', seed: 30 });
    guy.pose(T.t20 + 0.6, P.wave, 0.3); guy.pose(T.t20 + 0.9, P.waveB, 0.25); guy.pose(T.t20 + 1.15, P.wave, 0.25);
    K.devil(S, M.mid, 300, 690, 0.8);
    const dv = K.devil(S, M.act, 1500, 760, 0.9);
    X.tl.fromTo(dv.st, { x: 1600 }, { x: 1250, duration: 2.2, ease: 'none', immediateRender: false }, T.t20);
    const bet = W('verdict2', 'bet');
    K.stamp(S.hud, 960, 360, 'NOPE.', bet - 0.1, { size: 140, rot: -8, ctx: S, vis: S.vis });
    K.tx.smashOut(s18, S, T.t20, 1010, 660, 9, { dur: 1.0 });
    K.move(S, T.t20 + 1.0, { s: 0.82, x: 60 }, T.t21 - T.t20 - 1.0, 'sine.inOut');
  });

  // ======================================================================= S20 end card: question + watch next
  const s20 = K.set('end', T.t21, END + 0.1, { bg: C.endcard }, (S) => {
    const back = S.layer(0.4), L = S.layer(1);
    for (const [x, y, r, o] of [[1700, 160, 300, 0.06], [200, 980, 380, 0.05], [1100, 1100, 260, 0.04]]) X.svg('circle', { cx: x, cy: y, r, fill: '#fff', opacity: o }, back);
    K.mark(S.hud, 170, 140, 0.6);
    X.svg('text', { x: 240, y: 162, 'font-size': 56, 'font-weight': 900, 'font-family': 'Montserrat', fill: '#fff', text: 'WORST CASE' }, S.hud);
    const guy = K.guy(S, L, { x: 520, y: 1060, s: 1.05, face: 'grin', seed: 32 });
    const wt = W('outro', 'Would');
    for (let i = 0; i < 16; i++) guy.pose(wt + i * 0.34, i % 2 ? P.waveB : P.wave, 0.32);
    K.bubble(L, 640, 370, 'Would YOU go?', wt + 0.1, { size: 60, vis: S.vis });
    // watch-next slot (original layout: one thumbnail + title)
    const card = X.svg('g', {}, L);
    const cs = K.tf(card, { x: 1340, y: 560, s: 0 }, S.vis);
    X.svg('text', { x: -360, y: -280, 'font-size': 46, 'font-weight': 900, 'font-family': 'Montserrat', fill: C.hi, text: 'UP NEXT' }, card);
    X.svg('rect', { x: -372, y: -242, width: 744, height: 432, rx: 22, fill: '#fff' }, card);
    X.svg('rect', { x: -356, y: -226, width: 712, height: 400, rx: 14, fill: '#1B2440' }, card);
    K.planet(card, 160, -90, 70, { kind: 'earth' });
    X.svg('path', { d: 'M-356,174 L-356,60 Q-100,0 140,40 Q300,60 356,30 L356,174Z', fill: '#C9CDD3' }, card);
    for (const [x, y, r] of [[-200, 110, 30], [60, 130, 22], [240, 100, 16]]) X.svg('ellipse', { cx: x, cy: y, rx: r * 1.6, ry: r * 0.6, fill: '#AEB4BC' }, card);
    X.svg('text', { x: 0, y: 260, 'text-anchor': 'middle', 'font-size': 40, 'font-weight': 800, 'font-family': 'Montserrat', fill: '#fff', text: 'What if you lived on the Moon?' }, card);
    X.tl.fromTo(cs, { s: 0 }, { s: 1, duration: 0.4, ease: 'back.out(1.8)', immediateRender: false }, T.t21 + 0.5);
    X.sfx(T.t21 + 0.5, 'pop', { gain: 0.3 });
    const cm = W('outro', 'comments');
    const ic = X.svg('g', {}, L);
    const is = K.tf(ic, { x: 880, y: 640, s: 0 }, S.vis);
    X.svg('rect', { x: -70, y: -56, width: 140, height: 100, rx: 22, fill: C.hi }, ic);
    X.svg('path', { d: 'M-30,40 L-46,76 L4,40Z', fill: C.hi }, ic);
    for (const dx of [-34, 0, 34]) X.svg('circle', { cx: dx, cy: -6, r: 10, fill: C.navy }, ic);
    X.tl.fromTo(is, { s: 0 }, { s: 1, duration: 0.3, ease: 'back.out(2.2)', immediateRender: false }, cm);
    X.sfx(cm, 'notif', { gain: 0.3 });
    K.tx.bands(s19, S, T.t21, [C.gold, C.coral, C.endcard]);
    K.move(S, T.t21 + 0.45, { s: 1.16, x: -80, y: 20 }, 1.6, 'sine.inOut');
    K.move(S, T.t21 + 2.3, { s: 1.04, x: 140, y: 0 }, 1.5, 'sine.inOut');
    K.move(S, T.t21 + 4.0, { s: 1.14, x: 40, y: 30 }, 1.6, 'sine.inOut');
    K.hook((t) => { cs.y = 560 + Math.sin(t * 2.2) * 8; }, S.vis);
  });
  // punch-ins on stressed words (additive zoom bumps)
  K.punch(s3, W('hook3', 'loneliest'), 1.14, 0.7);
  K.punch(s5, W('setup', 'four'), 1.14, 0.7);
  K.punch(s6, W('air1', 'one'), 1.14, 0.7);
  K.punch(s7, W('air2', 'fifteen'), 1.14, 0.7);
  K.punch(s9, W('cold1', 'minus'), 1.14, 0.7);
  K.punch(s11, W('cold2', 'weeks'), 1.14, 0.7);
  K.punch(s12, W('food1', 'ice'), 1.14, 0.7);
  K.punch(s13, W('food2', 'dozen'), 1.14, 0.7);
  K.punch(s14, W('food3', 'yourself'), 1.14, 0.7);
  K.punch(s15b, W('home1', 'twenty-six'), 1.14, 0.7);
  K.punch(s15b, W('home1', 'seven'), 1.14, 0.7);
  K.punch(s17, W('home2', 'three'), 1.14, 0.7);
  K.punch(s18, W('verdict1', 'maybe'), 1.14, 0.7);
  K.punch(s19, W('verdict2', 'bet'), 1.14, 0.7);
  K.punch(s20, W('outro', 'comments'), 1.14, 0.7);
});
