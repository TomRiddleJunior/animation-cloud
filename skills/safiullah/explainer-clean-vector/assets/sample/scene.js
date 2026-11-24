/* Postpop — clean-vector sample (original product, brand and script).
 * One violet phone hub on near-white; its cards blow up into flat colour-field worlds (sky / sun / mint / coral),
 * primitives morph into objects, confetti never stops drifting, the night feature is a palette-swap hard cut.
 * Render at 24 fps: make.sh samples/clean-vector --fps 24 --workers 3
 */
X.boot(async (X) => {
  await X.loadVO();
  const P = K.P, C = K.PAL, F = K.F, tl = X.tl;
  const w = (id, word, n = 0) => X.word(id, word, n);
  const line = (id) => X.line(id);

  // ------------------------------------------------------------------ layers
  const ground = X.svg('rect', { x: -20, y: -20, width: 1960, height: 1120, fill: C.ground });
  const Lconf = X.svg('g'), Lstars = X.svg('g'), Lback = X.svg('g'), Lhub = X.svg('g'), Lfront = X.svg('g');
  const Lworld = X.svg('g'), Lfx = X.svg('g'), Lui = X.svg('g');
  gsap.set(Lstars, { autoAlpha: 0 });

  // confetti: a persistent field + a denser "space" field for the opening (never over the hub column)
  const AV = [{ x: 740, y: 110, w: 440, h: 740 }, { x: 600, y: 560, w: 720, h: 300 }];
  // the persistent field lives in two side bands and floats upward (never behind the hub column)
  const baseL = K.confetti(Lconf, { n: 13, seed: 4, amp: 1.5, bounds: { x: 50, y: 20, w: 620, h: 1040 }, wrapPad: 0, stream: { vx: 0, vy: -30 } });
  const baseR = K.confetti(Lconf, { n: 13, seed: 5, amp: 1.5, bounds: { x: 1250, y: 20, w: 620, h: 1040 }, wrapPad: 0, stream: { vx: 0, vy: -36 } });
  const base = { specks: [...baseL.specks, ...baseR.specks], in: (t, sp) => { baseL.in(t, sp); baseR.in(t, sp); } };
  const space = K.confetti(Lconf, { n: 46, seed: 9, scale: 1.35, stream: { vx: -72, vy: 22 }, avoid: [...base.specks.map((s) => ({ x: s.x - 45, y: s.y - 45, w: 90, h: 90 }))] });
  base.in(0.0, F(12)); // the space field is already drifting on frame 0 (no blank first frame)
  const stars = K.confetti(Lstars, { n: 34, seed: 21, colors: ['#ffffff', '#ffffff', C.sun, C.hubLight], types: ['dot', 'sparkle', 'dot', 'ring'], scale: 1.3, stream: { vx: -48, vy: 6 } });

  // ------------------------------------------------------------------ the hub (phone) + its feed
  const H = K.hub(Lhub, {});
  H.closed();
  gsap.set([H.top, H.bot], { autoAlpha: 0 });
  gsap.set([H.cable, H.plug], { opacity: 0 });
  gsap.set(H.cable, { attr: { y1: 800 } });
  gsap.set(H.plug, { y: -H.shift + 284 });
  gsap.set(H.ground, { svgOrigin: '960 800', scaleX: 0 });
  tl.to(H.ground, { scaleX: 1, duration: F(9), ease: 'power3.out' }, 0.12);

  const mSun = (g, x, y) => { X.svg('circle', { cx: x, cy: y - 4, r: 22, fill: C.sun }, g); K.line(g, P.wave(x - 64, x + 64, y + 30, 5, 32), '#fff', 4); };
  const mPlus = (g, x, y) => { X.svg('circle', { cx: x, cy: y, r: 25, fill: '#fff' }, g); K.line(g, `M${x - 10},${y}H${x + 10}M${x},${y - 10}V${y + 10}`, C.hub, 5); };
  const mCake = (g, x, y) => { K.shape(g, P.rrect(x - 34, y + 4, 68, 26, 6), '#fff'); K.shape(g, P.rrect(x - 22, y - 16, 44, 22, 5), C.pink); X.svg('rect', { x: x - 3, y: y - 34, width: 6, height: 18, rx: 3, fill: '#fff' }, g); };
  const mTomato = (g, x, y) => { X.svg('circle', { cx: x, cy: y + 6, r: 26, fill: '#ff4f3a' }, g); K.shape(g, P.star(x, y - 18, 13, 5, 5), C.mintDark); };
  const mHeart = (g, x, y) => K.shape(g, P.heart(x, y + 4, 56), '#fff');
  const mMap = (g, x, y) => { K.shape(g, P.ellipse(x - 52, y + 16, 40, 24), C.skyLand); K.shape(g, P.ellipse(x + 50, y - 6, 42, 28), C.skyLand); K.line(g, `M${x - 56},${y + 14} Q${x},${y - 46} ${x + 48},${y - 6}`, '#fff', 4, { 'stroke-dasharray': '7 7' }); K.pin(g, x + 48, y - 22, 26); };
  H.addCard({ color: C.hubLight, avatar: C.hub, motif: mPlus });   // 0 compose
  H.addCard({ color: C.sky, avatar: C.coral, motif: mSun });       // 1 beach
  H.addCard({ color: C.sun, avatar: C.mint, motif: mCake });       // 2 cake
  H.addCard({ color: C.mint, avatar: C.sun, motif: mTomato });     // 3 tomato
  H.addCard({ color: C.coral, avatar: C.sky, motif: mHeart });     // 4 people
  const BX = H.box();

  // ------------------------------------------------------------------ helpers
  /** Pop an object out of a point and fly it along a relative arc. */
  const emerge = (g, t, pts, o = {}) => {
    gsap.set(g, { autoAlpha: 0, scale: o.s0 ?? 0.25, transformOrigin: '50% 50%' });
    tl.set(g, { autoAlpha: 1 }, t);
    tl.to(g, { scale: o.scale ?? 1, duration: o.grow ?? F(10), ease: 'back.out(1.8)' }, t);
    K.arc(g, t, o.dur ?? F(16), pts, { ease: o.ease || 'power2.out', curviness: o.curviness });
    if (o.rot != null) tl.fromTo(g, { rotation: o.rot0 ?? 0 }, { rotation: o.rot, duration: (o.dur ?? F(16)) + F(6), ease: 'back.out(1.6)', immediateRender: false }, t);
    X.sfx(t, o.sfx || 'pop', { gain: 0.26, pitch: o.pitch ?? 1 });
  };
  const hideAt = (els, t) => tl.set(els, { autoAlpha: 0 }, t);
  const showAt = (els, t) => tl.set(els, { autoAlpha: 1 }, t);

  // ================================================================== 1. PREMISE (0 → 9.7): mailbox in confetti space
  const M = K.mailbox(Lfront, { cx: 960, top: 330, w: 240, h: 212, groundY: 800 });
  M.rise(0.3);
  const doorX = 960, doorY = 446;
  K.hop(M.box, w('premise', 'thrill') - F(2), { h: 34, gain: 0.2 });
  K.flyby(Lback, 0.45, 'M-90,280 C300,120 700,110 1000,52 S1600,70 2010,190', { dur: 3.3, sfx: 'woosh_low' });
  K.flyby(Lback, 3.5, 'M2010,930 C1640,1040 1320,830 1120,990 C1020,1070 920,1110 820,1170', { dur: 2.9, color: C.coral });
  K.flyby(Lback, 6.1, 'M-70,760 C200,620 380,880 560,700 S640,300 760,-90', { dur: 2.8, kind: 'comet', color: C.sky, trail: C.teal });
  const tReal = w('premise', 'real'), tMail = w('premise', 'mail');
  M.flagUp(tReal - F(2));
  M.open(tMail - F(4));
  // envelope on "mail"
  const env1 = K.envelope(Lfront, doorX, doorY, 150);
  emerge(env1.g, tMail, [{ x: -150, y: -190 }, { x: -400, y: -150 }], { rot0: 20, rot: -8, dur: F(18) });
  K.bob(env1.g, { ay: 7, rot: 3, p: 2.4, from: tMail + 0.8 });
  // a second, smaller envelope on "mailbox"
  const env1b = K.envelope(Lfront, doorX, doorY, 110, { seal: C.sun });
  emerge(env1b.g, w('premise', 'mailbox'), [{ x: 160, y: -230 }, { x: 390, y: -200 }], { rot0: -20, rot: 9, dur: F(18), pitch: 1.2 });
  K.bob(env1b.g, { ay: 6, rot: -3, p: 2.8, from: w('premise', 'mailbox') + 0.8 });

  // "Not a bill." — a bill arcs out, flops on the ground, tips over
  const bill = X.svg('g', {}, Lfront);
  K.shape(bill, P.rrect(doorX - 52, doorY - 66, 104, 132, 8), '#fff');
  [0, 1, 2, 3].forEach((i) => X.svg('rect', { x: doorX - 36, y: doorY - 44 + i * 18, width: i === 0 ? 46 : 72, height: 7, rx: 3.5, fill: C.bar }, bill));
  X.svg('rect', { x: doorX - 36, y: doorY + 34, width: 72, height: 14, rx: 4, fill: C.coral }, bill);
  const tBill = w('nots', 'bill');
  emerge(bill, tBill - F(3), [{ x: 220, y: -210 }, { x: 430, y: 288 }], { dur: F(17), ease: 'power1.in', rot0: -10, rot: 12, curviness: 1.1 });
  const tBillLand = tBill - F(3) + F(17);
  K.squash(bill, tBillLand, { sx: 1.2, sy: 0.8 });
  tl.to(bill, { rotation: 96, duration: F(10), ease: 'bounce.out', transformOrigin: '100% 100%' }, tBillLand + F(5));
  X.sfx(tBillLand, 'thud', { gain: 0.4 });
  // "Not a flyer." — a flyer flutters away
  const flyer = X.svg('g', {}, Lfront);
  K.shape(flyer, P.rrect(doorX - 54, doorY - 70, 108, 140, 6), C.sun);
  K.shape(flyer, P.star(doorX, doorY - 22, 30, 17, 9), '#fff');
  [0, 1].forEach((i) => X.svg('rect', { x: doorX - 34, y: doorY + 22 + i * 18, width: 68 - i * 20, height: 7, rx: 3.5, fill: '#fff' }, flyer));
  const flyW = K.wrap(flyer);
  const tFly = w('nots', 'flyer');
  emerge(flyer, tFly - F(3), [{ x: -170, y: -150 }, { x: -330, y: -60 }, { x: -560, y: -240 }, { x: -800, y: -150 }, { x: -1150, y: -360 }], { dur: F(40), ease: 'power1.in', grow: F(8), sfx: 'paper' });
  X.every((t) => flyW.setAttribute('transform', `rotate(${(t > tFly ? 28 * Math.sin((t - tFly) * 5.5) : 0).toFixed(1)} ${doorX} ${doorY})`));
  hideAt(flyer, tFly + 2.2);
  // "Something someone picked out, just for you." — the postcard rises, a heart sticker lands
  const pcHero = K.postcard(Lfront, doorX, doorY, 230, { photo: C.sky, motif: (g, x, y, wd) => { X.svg('circle', { cx: x, cy: y - 2, r: wd * 0.07, fill: C.sun }, g); K.line(g, P.wave(x - wd * 0.2, x + wd * 0.2, y + wd * 0.12, 4, wd * 0.12), '#fff', 4); } });
  const tSome = w('nots', 'something');
  tl.to(M.box, { scaleX: 1.08, scaleY: 0.9, duration: F(4), ease: 'power2.out' }, tSome - F(4)).to(M.box, { scaleX: 1, scaleY: 1, duration: F(10), ease: 'elastic.out(1,0.45)' }, tSome);
  emerge(pcHero.g, tSome, [{ x: -70, y: -130 }, { x: 0, y: -262 }], { dur: F(18), rot0: 14, rot: -5, s0: 0.3 });
  K.bob(pcHero.g, { ay: 6, rot: 2, p: 2.6, from: tSome + 1 });
  const heartSt = K.shape(pcHero.g, P.heart(pcHero.stampAt.x, pcHero.stampAt.y + 6, 36), C.coral);
  const tJust = w('nots', 'just');
  K.popIn(heartSt, tJust, { rot: -30, sfx: 'bubble' });
  K.burst(Lfx, doorX, 190, tJust + F(2), { n: 18, r0: 120, r1: 230, seed: 3 });
  K.hop(M.box, w('nots', 'for') - F(1), { h: 22, sfx: false });
  const spk1 = K.sparkle(Lfront, doorX - 140, 140, 16, C.sun); K.popIn(spk1, w('nots', 'picked'), { sfx: 'sparkle', gain: 0.15 });

  // ================================================================== 2. NAME (9.7 → 12.1): mailbox swallows the mail, jumps, morphs into the pill
  const tThats = w('name', "that's"), tFeel = w('name', 'feeling'), tPP = w('name', 'postpop');
  const home = (g, t, via) => tl.to(g, { motionPath: { path: [via, { x: 0, y: 0 }], curviness: 1.2 }, scale: 0.15, rotation: 0, duration: F(9), ease: 'power2.in' }, t);
  home(env1.g, tThats - F(6), { x: -230, y: -250 });
  home(env1b.g, tThats - F(3), { x: 230, y: -290 });
  home(pcHero.g, tThats, { x: 70, y: -170 });
  hideAt(env1.g, tThats + F(4)); hideAt(env1b.g, tThats + F(7)); hideAt(pcHero.g, tThats + F(10));
  X.sfx(tThats - F(6), 'swoosh', { dur: 0.3, gain: 0.3 }); X.sfx(tThats, 'swoosh', { dur: 0.3, gain: 0.3, pitch: 1.2 });
  K.popOut(bill, tThats - F(2), { sfx: 'blip_down' });
  K.popOut(spk1, tThats - F(4));
  // details out, body swaps to the hub silhouette, jump-spin-morph, land with dust
  const tJump = tFeel + F(1);
  [M.slot, M.knob, M.door, M.inside].forEach((el, i) => K.popOut(el, tJump - F(4) + i * F(1), { dur: F(4) }));
  K.popOut(M.flag, tJump - F(3), { dur: F(4) });
  tl.to(M.post, { scaleY: 0, duration: F(6), ease: 'power2.in' }, tJump + F(1));
  const loafD = P.loaf(960 - 120, 330, 240, 212, 12);
  tl.set(H.sil, { autoAlpha: 1, morphSVG: loafD, y: 0 }, tJump);
  hideAt(M.box, tJump);
  tl.to(H.sil, { scaleX: 1.16, scaleY: 0.84, duration: F(3), ease: 'power2.out', transformOrigin: '50% 100%' }, tJump)
    .to(H.sil, { y: -190, scaleX: 0.9, scaleY: 1.14, duration: F(7), ease: 'power2.out' }, tJump + F(3))
    .to(H.sil, { y: 284, scaleX: 0.92, scaleY: 1.1, duration: F(7), ease: 'power2.in' }, tJump + F(10));
  tl.fromTo(H.sil, { rotation: 0 }, { rotation: 360, duration: F(13), ease: 'power1.inOut', immediateRender: false }, tJump + F(3));
  K.morph(H.sil, H.pillD, tJump + F(4), F(9));
  const tLand = tJump + F(17);
  K.squash(H.sil, tLand, { sx: 1.3, sy: 0.7 });
  K.puffs(Lfx, 960, 800, tLand, {});
  X.sfx(tJump + F(3), 'blip_up', { gain: 0.2 }); X.sfx(tLand, 'boing', { gain: 0.32, pitch: 0.9 });

  // ================================================================== 3. HUB BIRTH (12.1 → 16.5): rise on its cable, split open, cards pop
  const tWhat = line('what').start;
  const tRise = tWhat - F(3);
  space.out(tRise, F(14));
  tl.to([H.cable, H.plug], { opacity: 1, duration: F(1) }, tRise);
  tl.fromTo(H.sil, { y: 284 }, { y: 0, duration: F(9), ease: 'back.out(1.3)', immediateRender: false }, tRise)
    .to(H.sil, { scaleX: 0.88, scaleY: 1.16, duration: F(4), ease: 'power2.out' }, tRise)
    .to(H.sil, { scaleX: 1, scaleY: 1, duration: F(6), ease: 'back.out(2.5)' }, tRise + F(4));
  tl.fromTo(H.cable, { attr: { y1: 800 } }, { attr: { y1: 440 + H.capH }, duration: F(9), ease: 'back.out(1.3)', immediateRender: false }, tRise);
  tl.fromTo(H.plug, { y: -H.shift + 284 }, { y: -H.shift, duration: F(9), ease: 'back.out(1.3)', immediateRender: false }, tRise);
  X.sfx(tRise, 'blip_up', { gain: 0.2, pitch: 0.8 });
  const tSplit = tRise + F(10);
  H.splitOpen(tSplit, { cards: 3 });
  // side postcards pop out from behind the hub on "real" / "printed"
  const sideL = K.postcard(Lback, 960, 440, 200, { photo: C.mint, motif: (g, x, y) => mTomato(g, x, y) });
  const sideR = K.postcard(Lback, 960, 440, 200, { photo: C.sun, motif: (g, x, y) => mCake(g, x, y) });
  emerge(sideL.g, w('what', 'real'), [{ x: -200, y: -120 }, { x: -340, y: 40 }], { s0: 0.5, rot0: 0, rot: -10, dur: F(14) });
  emerge(sideR.g, w('what', 'printed'), [{ x: 200, y: -130 }, { x: 350, y: 10 }], { s0: 0.5, rot0: 0, rot: 8, dur: F(14), pitch: 1.2 });
  K.bob(sideL.g, { ay: 13, rot: 3, p: 2.2, from: w('what', 'real') + 0.6 });
  K.bob(sideR.g, { ay: 12, rot: -3, p: 2.0, from: w('what', 'printed') + 0.6 });
  H.drift(tSplit + 0.9, 2.6, -58);
  K.flyby(Lback, tSplit + 1.2, 'M-90,210 C300,70 620,40 900,72 S1500,40 2010,160', { dur: 3.0, color: C.sky });
  [[1046, 600, 0], [1010, 590, 0.75], [1060, 596, 1.35]].forEach(([x, y, dt], i) => {
    const hrt = K.shape(Lfront, P.heart(x, y, 34), i === 1 ? C.pink : C.coral), t = w('what', 'photos') + dt;
    gsap.set(hrt, { autoAlpha: 0 }); tl.set(hrt, { autoAlpha: 1 }, t);
    tl.fromTo(hrt, { scale: 0, x: 0, y: 0 }, { scale: 1, duration: F(8), ease: 'back.out(3)', transformOrigin: '50% 50%', immediateRender: false }, t);
    tl.to(hrt, { y: -170, x: 30 * Math.sin(i * 2), duration: 1.3, ease: 'sine.out' }, t);
    tl.to(hrt, { autoAlpha: 0, scale: 0.6, duration: F(8) }, t + 1.0);
    X.sfx(t, 'bubble', { gain: 0.14, pitch: 1.2 + i * 0.15 });
  });
  const tPcs = w('what', 'postcards');
  K.squash(sideL.g, tPcs, { sx: 1.1, sy: 0.9, origin: '50% 50%' }); K.squash(sideR.g, tPcs + F(2), { sx: 1.1, sy: 0.9, origin: '50% 50%' });
  [[640, 300], [1320, 290]].forEach(([x, y], i) => { const s = K.sparkle(Lback, x, y, 14, i ? C.coral : C.sun); K.popIn(s, tPcs + i * F(2), { sfx: i ? false : 'sparkle', gain: 0.14 }); K.popOut(s, tPcs + 1.0); });

  // ================================================================== 4. WORLD RUN: beach (sky) → cake (sun iris) → hub → tomato (mint)
  const tBeach = w('beach', 'beach');
  H.focus(1, tBeach - F(13), F(8));
  const tBlow1 = tBeach - F(5);
  H.blowUp(SKY(), tBlow1);
  hideAt([sideL.g, sideR.g], tBlow1 + F(10));
  function SKY() {
    const W = K.world(Lworld, C.sky, { seed: 41 });
    const c = W.content, t0 = tBlow1 + F(10);
    const hz = 600, hid = 'hz' + Math.floor(t0 * 100);
    const cp = X.svg('clipPath', { id: hid, clipPathUnits: 'userSpaceOnUse' }, X.defs); X.svg('rect', { x: 0, y: 0, width: 1920, height: hz }, cp);
    const above = X.svg('g', { 'clip-path': `url(#${hid})` }, c);
    // clouds + birds
    const cl1 = K.cloud(c, 700, 330, 140), cl2 = K.cloud(c, 1240, 300, 100);
    K.popIn(cl1, t0 + F(6), { gain: 0.15 }); K.popIn(cl2, t0 + F(9), { sfx: false });
    K.bob(cl1, { ax: 16, ay: 3, p: 5 }); K.bob(cl2, { ax: -14, ay: 3, p: 4.4 });
    const birds = X.svg('g', {}, c);
    [[1150, 430, 1], [1196, 410, 0.8]].forEach(([x, y, s], i) => {
      const b = K.line(birds, `M${x - 14 * s},${y - 6 * s} Q${x - 6 * s},${y - 10 * s} ${x},${y} Q${x + 6 * s},${y - 10 * s} ${x + 14 * s},${y - 6 * s}`, '#fff', 4);
      X.every((t) => b.setAttribute('transform', `translate(0 ${(3 * Math.sin(t * 3 + i)).toFixed(1)}) translate(${x} ${y}) scale(1 ${(0.6 + 0.4 * Math.abs(Math.sin(t * 7 + i))).toFixed(2)}) translate(${-x} ${-y})`));
    });
    K.popIn(birds, t0 + F(14), { sfx: false });
    // sun lands on the horizon, rays pop and turn
    const sunG = X.svg('g', {}, above);
    const rays = X.svg('g', {}, sunG), raysW = K.wrap(rays);
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2, r1 = 104, r2 = 132;
      const l = X.svg('line', { x1: 960 + Math.cos(a) * r1, y1: 520 + Math.sin(a) * r1, x2: 960 + Math.cos(a) * r2, y2: 520 + Math.sin(a) * r2, stroke: '#fff', 'stroke-width': 6, 'stroke-linecap': 'round' }, rays);
      gsap.set(l, { svgOrigin: '960 520', scale: 0 });
      tl.to(l, { scale: 1, duration: F(8), ease: 'back.out(2.5)' }, t0 + F(9) + i * F(1));
    }
    X.every((t) => raysW.setAttribute('transform', `rotate(${(t * 9).toFixed(1)} 960 520)`));
    const sun = K.shape(sunG, P.circle(960, 520, 78), C.sun);
    K.land(sun, t0 - F(2), { dy: -420, fall: F(7), sfx: 'drop' });
    tl.to(sunG, { y: 40, duration: 1.1, ease: 'power1.inOut' }, w('beach', 'night'));
    // horizon (draws out from the centre) + waves
    const hL = K.line(c, `M960,${hz} H560`, '#fff', 6), hR = K.line(c, `M960,${hz} H1360`, '#fff', 6);
    K.draw(hL, t0, F(9), 'power2.out'); K.draw(hR, t0, F(9), 'power2.out');
    const waves = X.svg('g', {}, c);
    [[640, 1280, 650], [700, 1220, 700], [776, 1144, 750]].forEach(([a, b, y], i) => {
      const wv = K.line(waves, P.wave(a, b, y, 7, 64), '#fff', 5, { opacity: 0.9 - i * 0.15 });
      K.draw(wv, t0 + F(3) + i * F(2), F(10), 'none');
    });
    K.bob(waves, { ax: 12, ay: 2, p: 3.2 });
    // boat glides in on "last"
    const boat = X.svg('g', {}, c);
    K.shape(boat, `M720,592 L800,592 L788,614 L732,614Z`, C.coral);
    X.svg('rect', { x: 757, y: 520, width: 5, height: 72, fill: '#fff' }, boat);
    K.shape(boat, `M764,524 L764,586 L806,586Z`, '#fff');
    K.shape(boat, `M754,534 L754,586 L726,586Z`, '#fff', { opacity: 0.85 });
    const tLast = w('beach', 'last');
    K.popIn(boat, tLast - F(2), { origin: '50% 100%', gain: 0.18 });
    tl.to(boat, { x: 90, duration: 2.2, ease: 'sine.inOut' }, tLast);
    K.bob(boat, { ay: 4, rot: 4, p: 1.8, cx: 762, cy: 614 });
    return (SKY.W = W);
  }
  // sun iris → cake world
  const tCake = w('cake', 'cake');
  const SUNW = K.world(Lworld, C.sun, { seed: 52 });
  const tIris1 = w('cake', 'birthday') - F(6);
  SUNW.irisFrom(960, 560, 78, tIris1, F(12));
  X.sfx(tIris1, 'zoom_in', { dur: 0.4, gain: 0.25 });
  SKY.W.hide(tIris1 + F(13));
  H.setFocus(2, tIris1 + F(13));
  {
    const c = SUNW.content, t0 = tIris1 + F(9);
    const cake = X.svg('g', {}, c); gsap.set(cake, { svgOrigin: '960 712' });
    const plate = K.shape(cake, P.pill(960, 712, 360, 16), '#fff');
    gsap.set(plate, { svgOrigin: '960 712', scaleX: 0 }); tl.to(plate, { scaleX: 1, duration: F(8), ease: 'back.out(2)' }, t0);
    const t1 = K.shape(cake, P.rrect(820, 612, 280, 94, 20, 12), '#fff');
    const sprinkles = X.svg('g', {}, cake);
    [[862, 650, C.coral], [910, 676, C.sky], [968, 648, C.mint], [1022, 674, C.coral], [1064, 652, C.sky]].forEach(([x, y, col], i) => {
      const s = X.svg('rect', { x: x - 8, y: y - 3, width: 16, height: 6, rx: 3, fill: col, transform: `rotate(${(i * 47) % 90 - 40} ${x} ${y})` }, sprinkles);
      gsap.set(s, { transformOrigin: '50% 50%', scale: 0 }); tl.to(s, { scale: 1, duration: F(6), ease: 'back.out(3)' }, t0 + F(9) + i * F(1));
    });
    const t2 = K.shape(cake, P.rrect(856, 534, 208, 80, 18, 10), C.pink);
    const drip = K.shape(cake, `M856,560 Q870,580 884,560 Q898,584 912,560 Q926,578 940,560 Q954,586 968,560 Q982,578 996,560 Q1010,584 1024,560 Q1038,578 1052,560 L1064,560 L1064,552 L856,552Z`, '#fff');
    const top = X.svg('g', {}, cake);
    const t3 = K.shape(top, P.rrect(890, 466, 140, 70, 16, 8), '#fff');
    const candle = K.shape(top, P.rrect(951, 404, 18, 64, 6, 2), C.sky);
    const flame = K.shape(top, `M960,362 C972,378 974,392 960,400 C946,392 948,378 960,362Z`, C.coral);
    const flameW = K.wrap(flame);
    X.every((t) => flameW.setAttribute('transform', `translate(960 400) scale(${(1 + 0.06 * Math.sin(t * 19)).toFixed(3)} ${(1 + 0.12 * Math.sin(t * 13)).toFixed(3)}) translate(-960 -400)`));
    K.land(t1, t0 + F(1), { dy: -460, fall: F(6), sfx: 'thud', gain: 0.3 });
    K.land(t2, t0 + F(5), { dy: -460, fall: F(6), sfx: 'boing', pitch: 1.1 });
    gsap.set(drip, { autoAlpha: 0 }); tl.set(drip, { autoAlpha: 1 }, t0 + F(11)); tl.from(drip, { scaleY: 0, transformOrigin: '50% 0%', duration: F(6), ease: 'back.out(2)', immediateRender: false }, t0 + F(11));
    K.land(t3, t0 + F(9), { dy: -460, fall: F(6), sfx: 'boing', pitch: 1.3 });
    gsap.set(candle, { transformOrigin: '50% 100%', scaleY: 0 }); tl.to(candle, { scaleY: 1, duration: F(7), ease: 'back.out(2.5)' }, t0 + F(15));
    K.popIn(flame, t0 + F(18), { origin: '50% 100%', sfx: 'pop', pitch: 1.4 });
    // "almost made it": lean, the top tier slips and hangs on
    const tAlm = w('cake', 'almost'), tMade = w('cake', 'made');
    tl.to(cake, { rotation: -3, duration: F(6), ease: 'power2.out' }, tAlm)
      .to(cake, { rotation: 0, duration: F(12), ease: 'elastic.out(1,0.4)' }, tMade + F(2));
    gsap.set(top, { svgOrigin: '1030 536' });
    tl.to(top, { x: 52, y: 4, rotation: 14, duration: F(9), ease: 'power2.in' }, tAlm + F(4))
      .to(top, { x: 64, y: 8, rotation: 24, duration: F(4), ease: 'power2.out' }, tMade)
      .to(top, { rotation: 19, duration: F(14), ease: 'elastic.out(1,0.35)' }, tMade + F(4));
    tl.to(flame, { rotation: -26, duration: F(5), ease: 'power2.out', transformOrigin: '50% 100%' }, tMade).to(flame, { rotation: -16, duration: F(14), ease: 'elastic.out(1,0.3)' }, tMade + F(5));
    X.sfx(tAlm + F(4), 'slide', { dur: 0.45, gain: 0.25 }); X.sfx(tMade, 'boing', { gain: 0.3, pitch: 0.75 });
  }
  // collapse to the hub, scroll, blow up the tomato card
  const tTom = w('tomato', 'tomato');
  const tCol1 = tTom - F(26);
  H.collapse(SUNW, tCol1);
  H.focus(3, tCol1 + F(9), F(7));
  const tBlow2 = tTom - F(9);
  const MINT = K.world(Lworld, C.mint, { seed: 63 });
  H.blowUp(MINT, tBlow2);
  {
    const c = MINT.content, t0 = tBlow2 + F(9), dk = '#067a63';
    const rail = X.svg('g', {}, c);
    [[600, 608], [700, 704]].forEach(([y], i) => { const l = K.line(rail, `M590,${y} H1330`, '#fff', 7, { opacity: 0.85 }); K.draw(l, t0 + i * F(2), F(9), 'power2.out'); });
    for (let i = 0; i < 9; i++) {
      const x = 630 + i * 82; if (Math.abs(x - 960) < 110) continue;
      const b = K.line(rail, `M${x},608 V780`, '#fff', 5, { opacity: 0.7 });
      gsap.set(b, { transformOrigin: '50% 0%', scaleY: 0 }); tl.to(b, { scaleY: 1, duration: F(7), ease: 'back.out(2)' }, t0 + F(3) + i * F(1));
    }
    const pot = X.svg('g', {}, c);
    K.shape(pot, 'M884,676 L1036,676 L1016,790 L904,790Z', C.coral);
    K.shape(pot, P.rrect(870, 648, 180, 34, 10), C.coralDark);
    K.land(pot, t0, { dy: -460, fall: F(6), sfx: 'thud' });
    const stem = K.line(c, 'M960,648 C958,600 978,560 962,520 C952,494 958,478 960,470', dk, 9);
    K.draw(stem, t0 + F(7), F(9), 'power2.out');
    const lf1 = K.shape(c, 'M958,590 C930,566 900,572 884,592 C910,610 940,606 958,590Z', '#0a8f74');
    const lf2 = K.shape(c, 'M966,548 C990,520 1022,524 1036,544 C1012,566 984,564 966,548Z', '#0a8f74');
    K.popIn(lf1, t0 + F(12), { origin: '100% 50%', rot: 30, gain: 0.18 }); K.popIn(lf2, t0 + F(14), { origin: '0% 50%', rot: -30, sfx: false });
    K.bob(lf1, { rot: 4, ay: 0, p: 2.2, cx: 958, cy: 590 }); K.bob(lf2, { rot: -4, ay: 0, p: 2.6, cx: 966, cy: 548 });
    const tomG = X.svg('g', {}, c);
    const tom = K.shape(tomG, P.circle(960, 474, 54), '#ff4f3a');
    const shine = K.line(tomG, 'M928,452 Q934,436 950,430', '#fff', 6, { opacity: 0.85 });
    const caly = K.shape(tomG, P.star(960, 424, 24, 9, 5), '#0a8f74');
    gsap.set(tom, { fill: '#2fbf6f' });
    gsap.set(tomG, { svgOrigin: '960 424', scale: 0 });
    const tTomPop = t0 + F(16);
    tl.to(tomG, { scale: 0.25, duration: F(5), ease: 'back.out(3)' }, tTomPop)
      .to(tomG, { scale: 1, duration: F(14), ease: 'elastic.out(1, 0.45)' }, tTomPop + F(7))
      .to(tom, { fill: '#ff4f3a', duration: F(8) }, tTomPop + F(7));
    X.sfx(tTomPop, 'pop', { gain: 0.25, pitch: 1.5 }); X.sfx(tTomPop + F(7), 'bubble', { gain: 0.3, pitch: 0.8 });
    // the whole plant sways with pride during the off-screen compliment (pot pivot)
    const plant = X.svg('g', {}, c);
    c.insertBefore(plant, pot);
    [pot, stem, lf1.parentNode, lf2.parentNode, tomG].forEach((el) => plant.appendChild(el));
    gsap.set(plant, { svgOrigin: '960 790' });
    const tG1 = line('gag1').start;
    [7, -7, 6, -5].forEach((a, i) => tl.to(plant, { rotation: a, duration: F(7), ease: 'sine.inOut' }, tG1 + i * F(7)));
    tl.to(plant, { rotation: 0, duration: F(12), ease: 'elastic.out(1,0.4)' }, tG1 + F(28));
    // gag 1: proud bounce + shine; payoff: confetti + a rosette on "very"
    const tGood = w('gag1', 'good');
    K.hop(tomG, tGood - F(3), { h: 48, origin: '50% 0%', sfx: 'boing', pitch: 1.4 });
    const spk = K.sparkle(c, 918, 418, 18, '#fff'); K.popIn(spk, w('gag1', 'tomato'), { sfx: 'sparkle', gain: 0.14, rot: 90 }); K.popOut(spk, w('gag1', 'tomato') + 0.9);
    const tVery = w('gag1b', 'very');
    K.burst(Lfx, 960, 470, tVery, { n: 26, r0: 110, r1: 330, colors: ['#fff', '#fff', C.sun, C.coral, C.hub], seed: 12 });
    const ros = X.svg('g', {}, c);
    K.shape(ros, 'M1000,744 L992,792 L1006,784 L1016,796 L1018,746Z', C.hub);
    K.shape(ros, 'M1028,746 L1032,796 L1042,782 L1056,788 L1044,742Z', C.hub);
    K.shape(ros, P.star(1022, 730, 34, 27, 12), C.sun);
    X.svg('circle', { cx: 1022, cy: 730, r: 20, fill: '#fff' }, ros);
    K.shape(ros, P.star(1022, 730, 10, 4.5, 5), C.sun);
    K.popIn(ros, tVery + F(1), { rot: -40, sfx: 'pop', pitch: 0.9 });
    K.squash(tomG, w('gag1b', 'tomato'), { sx: 1.12, sy: 0.9, origin: '50% 0%' });
    // idle life: drifting clouds + a bee looping the plant on arcs
    const mc1 = K.cloud(c, 660, 250, 150), mc2 = K.cloud(c, 1290, 200, 110);
    K.popIn(mc1, t0 + F(4), { sfx: false }); K.popIn(mc2, t0 + F(7), { sfx: false });
    tl.to(mc1, { x: 120, duration: 6, ease: 'none' }, t0); tl.to(mc2, { x: -110, duration: 6, ease: 'none' }, t0);
    const beeW = X.svg('g', {}, c), bee = X.svg('g', {}, beeW);
    const wings = X.svg('g', {}, bee);
    X.svg('ellipse', { cx: -4, cy: -16, rx: 10, ry: 13, fill: '#fff', opacity: 0.95 }, wings);
    X.svg('ellipse', { cx: 8, cy: -14, rx: 8, ry: 11, fill: '#fff', opacity: 0.8 }, wings);
    K.shape(bee, P.ellipse(0, 0, 21, 15), C.sun);
    X.svg('rect', { x: -7, y: -14, width: 6, height: 28, fill: C.ink }, bee); X.svg('rect', { x: 5, y: -13, width: 6, height: 26, fill: C.ink }, bee);
    X.svg('circle', { cx: 17, cy: -3, r: 3, fill: C.ink }, bee);
    [...bee.children].forEach((ch) => ch.setAttribute('transform', 'scale(1.6)'));
    X.every((t) => wings.setAttribute('transform', `scale(1.6) translate(0 -6) scale(1 ${(0.45 + 0.55 * Math.abs(Math.sin(t * 26))).toFixed(2)}) translate(0 6)`));
    const tBee = t0 + F(22);
    gsap.set(bee, { autoAlpha: 0, x: -60, y: 380 });
    tl.set(bee, { autoAlpha: 1 }, tBee);
    tl.to(bee, { motionPath: { path: [{ x: 420, y: 300 }, { x: 760, y: 420 }, { x: 860, y: 330 }, { x: 1090, y: 390 }, { x: 1110, y: 520 }, { x: 960, y: 580 }, { x: 800, y: 500 }, { x: 840, y: 360 }, { x: 1010, y: 300 }, { x: 1120, y: 430 }, { x: 1060, y: 560 }, { x: 1300, y: 470 }, { x: 1600, y: 300 }, { x: 2000, y: 260 }], curviness: 1.3, autoRotate: true }, duration: 27.95 - tBee, ease: 'sine.inOut' }, tBee);
    X.sfx(tBee + 0.4, 'scribble', { dur: 1.2, gain: 0.06, pitch: 0.5 });
  }
  const tNote = line('note').start;
  const tCol2 = tNote - F(15);
  H.collapse(MINT, tCol2);
  H.showPage('editor', tCol2 + F(9));

  // ================================================================== 5. HUB FEATURES: note → stamp gag → print/stamp/post → family → map
  // editor page
  const ed = H.page('editor');
  const pb = H.pageBox;
  X.svg('rect', { x: BX.x, y: pb.y + 12, width: BX.w, height: 104, rx: 10, fill: C.mint }, ed);
  mTomato(ed, 960, pb.y + 60);
  const notes = [[pb.y + 146, 176], [pb.y + 172, 150], [pb.y + 198, 104]].map(([y, len]) => K.line(ed, P.wave(BX.x + 6, BX.x + 6 + len, y, 5, 22), C.ink, 3));
  gsap.set(notes, { opacity: 0 });
  const tNoteW = w('note', 'note');
  notes.forEach((n, i) => { tl.set(n, { opacity: 1 }, tNoteW - F(1) + i * F(4)); K.draw(n, tNoteW - F(1) + i * F(4), F(7), 'none'); });
  X.sfx(tNoteW, 'scribble', { dur: 0.6, gain: 0.22 });
  const doodle = K.line(ed, 'M1040,488 C1020,470 1022,452 1036,452 C1044,452 1048,460 1050,466 C1052,460 1056,452 1064,452 C1078,452 1080,470 1060,488 L1050,498Z', C.coral, 4);
  gsap.set(doodle, { opacity: 0 }); tl.set(doodle, { opacity: 1 }, w('note', 'doodle') - F(2)); K.draw(doodle, w('note', 'doodle') - F(2), F(11), 'none');
  X.sfx(w('note', 'doodle'), 'scribble', { dur: 0.4, gain: 0.2, pitch: 1.3 });
  const sendB = X.svg('g', {}, ed);
  K.shape(sendB, P.pill(960, 572, 150, 46), C.hub);
  K.shape(sendB, P.plane(930, 572, 30), '#fff');
  K.text(sendB, 982, 581, 'send', { size: 24, weight: 600, color: '#fff' });
  const tTap = w('note', 'tap');
  K.popIn(sendB, tTap - F(8), { gain: 0.2 });
  const finger = X.svg('circle', { cx: 0, cy: 0, r: 24, fill: 'rgba(42,40,64,0.22)' }, Lfront);
  gsap.set(finger, { x: 1080, y: 690, autoAlpha: 0 });
  const tSend = w('note', 'send');
  tl.set(finger, { autoAlpha: 1 }, tTap - F(3));
  tl.to(finger, { x: 975, y: 578, duration: F(7), ease: 'power2.out' }, tTap - F(3))
    .to(finger, { scale: 0.8, duration: F(2), transformOrigin: '50% 50%' }, tSend - F(1))
    .to(finger, { scale: 1, duration: F(3) }, tSend + F(1))
    .to(finger, { autoAlpha: 0, duration: F(4) }, tSend + F(5));
  K.squash(sendB, tSend - F(1), { sx: 1.08, sy: 0.88, origin: '50% 50%' });
  const ripple = X.svg('circle', { cx: 975, cy: 578, r: 30, fill: 'none', stroke: C.hub, 'stroke-width': 4 }, Lfront);
  gsap.set(ripple, { svgOrigin: '975 578', scale: 0.4, opacity: 0 });
  tl.set(ripple, { opacity: 1 }, tSend).to(ripple, { scale: 2.6, opacity: 0, duration: F(10), ease: 'power2.out' }, tSend);
  X.sfx(tSend, 'click', { gain: 0.4 });
  // the card leaves as an envelope through the top of the phone
  const env2 = K.envelope(Lback, 960, 300, 80);
  const envTrail = K.dashed(Lback, 'M960,170 C1010,40 1260,20 1500,-120', { color: C.hubLight, width: 4 });
  gsap.set(env2.g, { autoAlpha: 0 });
  tl.set(env2.g, { autoAlpha: 1 }, tSend + F(3));
  K.arc(env2.g, tSend + F(3), F(16), [{ x: 0, y: -130 }, { x: 80, y: -250 }, { x: 540, y: -440 }], { ease: 'power2.in' });
  tl.fromTo(env2.g, { rotation: 0 }, { rotation: 24, duration: F(16), ease: 'power1.in', transformOrigin: '50% 50%', immediateRender: false }, tSend + F(3));
  envTrail.draw(tSend + F(7), F(12)); envTrail.erase(tSend + F(17), F(10));
  X.sfx(tSend + F(4), 'swoosh', { dur: 0.4, gain: 0.32 });
  [...notes, doodle].forEach((n, i) => K.undraw(n, tSend + F(12) + i * F(2), F(7)));
  K.popOut(sendB, tSend + F(16), { dur: F(5) });
  K.flyby(Lback, tSend + 1.0, 'M-80,560 C200,400 420,660 600,500 S700,170 560,-90', { dur: 2.6, color: C.coral });

  // gag 2: "Wait, do I need a stamp?" — an off-screen question bubble; "Nope." — a stamp lands by itself, confetti
  const bub = X.svg('g', {}, Lfront);
  K.shape(bub, P.rrect(1196, 236, 128, 104, 34), C.coral);
  K.shape(bub, 'M1290,326 L1346,366 L1306,312Z', C.coral);
  K.text(bub, 1260, 314, '?', { size: 76, weight: 700, color: '#fff' });
  const tWait = line('gag2').start;
  gsap.set(bub, { autoAlpha: 0 }); tl.set(bub, { autoAlpha: 1 }, tWait - F(2));
  tl.fromTo(bub, { x: 760, y: -180, rotation: 40 }, { x: 0, y: 0, rotation: 0, duration: F(11), ease: 'back.out(1.5)', transformOrigin: '80% 100%', immediateRender: false }, tWait - F(2));
  X.sfx(tWait - F(2), 'swoosh', { dur: 0.3, gain: 0.25, pitch: 1.3 }); X.sfx(tWait + F(8), 'bubble', { gain: 0.3 });
  K.bob(bub, { ay: 8, rot: 3, p: 1.6, from: tWait + 0.5 });
  K.shake(bub, w('gag2', 'stamp'), { n: 4, a: 7, dur: F(2), origin: '80% 100%' });
  const tNope = line('nope').start;
  K.popOut(bub, tNope - F(2), { sfx: 'blip_down' });
  const st1 = K.stamp(Lfront, 1052, pb.y + 34, 38, { bg: C.mint });
  const tSt1 = K.land(st1, tNope - F(5), { dy: -380, fall: F(5), sfx: 'stamp', gain: 0.45 });
  K.burst(Lfx, 1052, pb.y + 40, tSt1, { n: 20, r0: 70, r1: 220, seed: 21 });

  // "We print it, stamp it, and post it for you."
  const tPrint = w('post', 'print'), tStamp = w('post', 'stamp'), tPost = w('post', 'post');
  K.popOut(st1, tPrint - F(4), { dur: F(4) });
  const pc = K.postcard(Lback, 960, 300, 260, { photo: C.mint, motif: (g, x, y) => mTomato(g, x, y) });
  gsap.set(pc.g, { autoAlpha: 0, scale: 0.6, transformOrigin: '50% 50%' });
  tl.set(pc.g, { autoAlpha: 1 }, tPrint - F(4));
  tl.to(pc.g, { scale: 1, duration: F(14), ease: 'back.out(1.4)' }, tPrint - F(4));
  K.arc(pc.g, tPrint - F(4), F(15), [{ x: 0, y: -210 }, { x: 250, y: -150 }, { x: 460, y: 130 }], { ease: 'power2.inOut' });
  tl.fromTo(pc.g, { rotation: -10 }, { rotation: 4, duration: F(18), ease: 'back.out(2)', immediateRender: false }, tPrint - F(4));
  X.sfx(tPrint - F(4), 'slide', { dur: 0.5, gain: 0.3, pitch: 1.2 });
  const sA = { x: pc.stampAt.x + 460, y: pc.stampAt.y + 130 };
  // rubber stamp tool: anticipation lift, slam, card squash, postmark revealed
  const tool = X.svg('g', {}, Lfront);
  X.svg('circle', { cx: sA.x, cy: sA.y - 104, r: 22, fill: C.ink }, tool);
  K.shape(tool, P.rrect(sA.x - 9, sA.y - 90, 18, 52, 6), C.ink);
  K.shape(tool, P.rrect(sA.x - 44, sA.y - 42, 88, 26, 8), C.coral);
  gsap.set(tool, { autoAlpha: 0, y: -140 });
  tl.set(tool, { autoAlpha: 1 }, tStamp - F(9));
  tl.to(tool, { y: -40, duration: F(5), ease: 'back.out(2)' }, tStamp - F(9))
    .to(tool, { y: -70, duration: F(3), ease: 'power2.out' }, tStamp - F(4))
    .to(tool, { y: 22, duration: F(3), ease: 'power4.in' }, tStamp - F(1))
    .to(tool, { y: -170, duration: F(7), ease: 'power2.out' }, tStamp + F(5))
    .to(tool, { autoAlpha: 0, duration: F(3) }, tStamp + F(10));
  const tHit = tStamp + F(2);
  K.squash(pc.g, tHit, { sx: 1.05, sy: 0.93, origin: '50% 100%' });
  X.sfx(tHit, 'stamp', { gain: 0.5 });
  const pmark = X.svg('g', {}, pc.g);
  K.stamp(pmark, pc.stampAt.x, pc.stampAt.y, 30, { bg: '#fff' });
  X.svg('circle', { cx: pc.stampAt.x - 16, cy: pc.stampAt.y + 6, r: 22, fill: 'none', stroke: C.hub, 'stroke-width': 3.5 }, pmark);
  [0, 1, 2].forEach((i) => K.line(pmark, P.wave(pc.stampAt.x - 92, pc.stampAt.x - 40, pc.stampAt.y - 6 + i * 11, 3, 18), C.hub, 3, {}));
  gsap.set(pmark, { autoAlpha: 0 }); tl.set(pmark, { autoAlpha: 1 }, tHit);
  tl.from(pmark, { scale: 1.3, transformOrigin: '80% 50%', duration: F(5), ease: 'power2.out', immediateRender: false }, tHit);
  // fold into a paper plane and launch
  [pc.photo, pc.motif, ...pc.lines, pmark].forEach((el, i) => K.popOut(el, tPost - F(4) + i * F(0.5), { dur: F(4), origin: '50% 50%' }));
  K.morph(pc.card, P.plane(960, 300, 250), tPost - F(2), F(8));
  const pcWing = K.shape(pc.g, P.planeWing(960, 300, 250), 'rgba(42,40,64,0.12)');
  gsap.set(pcWing, { autoAlpha: 0 }); tl.set(pcWing, { autoAlpha: 1 }, tPost + F(5)); tl.from(pcWing, { opacity: 0, duration: F(3), immediateRender: false }, tPost + F(5));
  X.sfx(tPost - F(2), 'paper', { dur: 0.35, gain: 0.3 });
  const tLaunch1 = K.launch(pc.g, tPost + F(7), [{ x: 220, y: -260 }, { x: 760, y: -720 }], { dur: F(14), back: { x: -24, y: 12 } });
  tl.to(pc.g, { rotation: -32, duration: F(10), ease: 'power2.in' }, tLaunch1);
  const plTrail = K.dashed(Lback, 'M1400,440 C1540,300 1700,160 2100,-200', { color: C.hubLight, width: 4 });
  plTrail.draw(tLaunch1 + F(2), F(12)); plTrail.erase(tLaunch1 + F(14), F(10));
  hideAt(pc.g, tLaunch1 + F(16));

  // family: a group card in the hub blows up into the coral "people" world; envelopes arc to each avatar
  const tFam = line('family').start;
  H.showPage('contacts', tFam - F(22));
  const cp = H.page('contacts');
  const rowCols = [C.coral, C.sun, C.mint, C.sky];
  X.svg('rect', { x: BX.x, y: BX.y, width: BX.w, height: BX.h, rx: 10, fill: C.coral }, cp);
  rowCols.forEach((col, i) => K.avatar(cp, BX.x + 42 + i * 46, 440, 19, i === 0 ? C.hubLight : col));
  [[pb.y + 18, 120], [pb.y + 36, 80]].forEach(([y, wd]) => X.svg('rect', { x: BX.x, y, width: wd, height: 9, rx: 4.5, fill: C.bar }, cp));
  [[BX.y + BX.h + 22, 150], [BX.y + BX.h + 42, 100]].forEach(([y, wd]) => X.svg('rect', { x: BX.x, y, width: wd, height: 9, rx: 4.5, fill: C.barLight }, cp));
  const FAM = K.world(Lworld, C.coral, { seed: 96 });
  const tBlowF = w('family', 'send') - F(8);
  H.blowUp(FAM, tBlowF);
  {
    const c = FAM.content, t0 = tBlowF + F(10), xs = [612, 844, 1076, 1308], ay = 480;
    xs.forEach((x, i) => {
      const g = X.svg('g', {}, c);
      K.avatar(g, x, ay, 70, i === 0 ? C.hubLight : rowCols[i], { shirt: i % 2 ? '#fff' : C.ink });
      K.land(g, t0 + i * F(2), { dy: -560, fall: F(6), sfx: i ? false : 'boing', gain: 0.25, pitch: 1.2 });
      K.bob(g, { ay: 5, p: 2 + i * 0.3, ph: i, from: t0 + 1 });
      const bar = K.shape(c, P.pill(x, ay + 108, 96, 14), '#fff', { opacity: 0.85 });
      K.popIn(bar, t0 + F(6) + i * F(2), { sfx: false });
    });
    const sendTo = (i, t) => {
      const g = X.svg('g', {}, c); K.envelope(g, 0, 0, 84, { seal: rowCols[i] });
      gsap.set(g, { autoAlpha: 0, x: 960, y: 1160, rotation: -20, transformOrigin: '50% 50%' });
      tl.set(g, { autoAlpha: 1 }, t);
      tl.to(g, { motionPath: { path: [{ x: (960 + xs[i]) / 2, y: 760 }, { x: xs[i] + 58, y: ay + 52 }], curviness: 1.3 }, rotation: 12, duration: F(12), ease: 'power2.out' }, t);
      K.squash(g, t + F(12), { sx: 1.18, sy: 0.84, origin: '50% 100%' });
      const badge = X.svg('g', {}, c);
      X.svg('circle', { cx: xs[i] + 52, cy: ay - 54, r: 22, fill: C.mint }, badge);
      K.line(badge, `M${xs[i] + 42},${ay - 54} l7,7 l13,-15`, '#fff', 5);
      K.popIn(badge, t + F(13), { sfx: 'blip_up', gain: 0.22, pitch: 1 + i * 0.1 });
      X.sfx(t, 'swoosh', { dur: 0.35, gain: 0.25, pitch: 1.1 + i * 0.1 });
    };
    sendTo(0, w('family', 'one') - F(6));
    [1, 2, 3].forEach((i) => sendTo(i, w('family', 'whole') - F(4) + (i - 1) * F(3)));
    K.burst(Lfx, 960, 300, w('family', 'family') + F(8), { n: 22, r0: 120, r1: 360, colors: ['#fff', '#fff', C.sun, C.hubLight], seed: 77, gain: 0.2 });
  }
  H.collapse(FAM, line('map').start - F(14));

  // map: thumbnail page, push-through into the sky map world
  const tMapL = line('map').start;
  H.showPage('mapthumb', tMapL - F(5));
  const mp = H.page('mapthumb');
  X.svg('rect', { x: BX.x, y: BX.y, width: BX.w, height: BX.h, rx: 10, fill: C.sky }, mp);
  mMap(mp, 960, 440);
  [[pb.y + 18, 120], [pb.y + 36, 80]].forEach(([y, wd]) => X.svg('rect', { x: BX.x, y, width: wd, height: 9, rx: 4.5, fill: C.bar }, mp));
  [[BX.y + BX.h + 22, 160], [BX.y + BX.h + 42, 110]].forEach(([y, wd]) => X.svg('rect', { x: BX.x, y, width: wd, height: 9, rx: 4.5, fill: C.barLight }, mp));
  const MAPW = K.world(Lworld, C.sky, { seed: 74 });
  const tPush = w('map', 'map') - F(11);
  H.pushThrough(MAPW, tPush);
  {
    const c = MAPW.content, t0 = tPush + F(11);
    const land = [
      'M470,640 C470,560 560,520 640,540 C720,560 760,610 740,680 C720,750 600,770 530,740 C480,718 470,690 470,640Z',
      'M1210,520 C1230,450 1340,430 1420,470 C1490,510 1480,600 1420,640 C1360,680 1250,660 1220,610 C1200,580 1200,550 1210,520Z',
      'M880,300 C900,262 990,256 1040,280 C1080,300 1070,350 1020,362 C960,376 890,360 880,330Z',
      'M820,790 C840,760 920,750 960,770 C990,786 980,820 940,826 C890,834 820,820 820,790Z',
    ];
    land.forEach((d, i) => { const s = K.shape(c, d, C.skyLand); K.popIn(s, t0 + i * F(2), { ease: 'back.out(1.8)', sfx: i ? false : 'pop', gain: 0.15 }); });
    const A = { x: 610, y: 640 }, B = { x: 1320, y: 556 };
    const routeD = `M${A.x},${A.y} C760,330 1150,300 ${B.x},${B.y}`;
    const dot = X.svg('circle', { cx: A.x, cy: A.y, r: 12, fill: '#fff' }, c); K.popIn(dot, t0 + F(4), { sfx: false });
    const route = K.dashed(c, routeD, { color: '#fff', width: 5, dash: [16, 14] });
    route.draw(t0 + F(2), F(18), 'power1.inOut');
    const envM = X.svg('g', {}, c);
    const em = K.envelope(envM, 0, 0, 72);
    void em;
    gsap.set(envM, { autoAlpha: 0, x: A.x, y: A.y });
    tl.set(envM, { autoAlpha: 1 }, t0 + F(2));
    tl.to(envM, { motionPath: { path: routeD, autoRotate: true }, duration: F(18), ease: 'power1.inOut' }, t0 + F(2));
    tl.to(envM, { scale: 0, duration: F(4), ease: 'back.in(2)' }, t0 + F(19));
    X.sfx(t0 + F(2), 'slide', { dur: 0.8, gain: 0.2, pitch: 0.8 });
    const tPing = w('map', 'ping');
    const pin = K.pin(c, B.x, B.y - 46, 92);
    K.land(pin, tPing - F(7), { dy: -300, fall: F(6), sfx: 'drop', gain: 0.3 });
    const note = X.svg('g', {}, c);
    K.shape(note, P.rrect(B.x - 128, B.y - 210, 256, 74, 22), '#fff');
    X.svg('circle', { cx: B.x - 90, cy: B.y - 173, r: 20, fill: C.mint }, note);
    K.line(note, `M${B.x - 99},${B.y - 173} l7,7 l12,-14`, '#fff', 4);
    K.text(note, B.x - 60, B.y - 162, 'Delivered', { size: 32, weight: 600, anchor: 'start' });
    K.popIn(note, tPing, { origin: '50% 100%', sfx: 'ding', gain: 0.4, rot: -8 });
    K.bob(note, { ay: 4, p: 2.2, from: tPing + 0.5 });
    K.rings(c, B.x, B.y, w('map', 'lands'), { colors: ['#fff', C.sun], radii: [34, 64], spokes: 0, width: 4, sfx: false });
  }
  const tCol3 = line('night').start - F(22);
  H.collapse(MAPW, tCol3);

  // ================================================================== 6. NIGHT: calendar page, palette-swap hard cut
  const tNight = line('night').start;
  H.showPage('calendar', tCol3 + F(8));
  const cal = H.page('calendar');
  const calHead = K.shape(cal, P.rrect(BX.x, pb.y + 10, BX.w, 36, 9), C.coral);
  const mBar = X.svg('rect', { x: BX.x + 14, y: pb.y + 24, width: 76, height: 9, rx: 4.5, fill: '#fff' }, cal);
  gsap.set(mBar, { transformOrigin: '50% 50%' });
  const cells = [];
  for (let r = 0; r < 5; r++) for (let k = 0; k < 7; k++) {
    const x = BX.x + 2 + k * 31.5, y = pb.y + 62 + r * 30;
    const cell = X.svg('rect', { x, y, width: 26, height: 24, rx: 5, fill: '#eceef3' }, cal);
    gsap.set(cell, { transformOrigin: '50% 50%' });
    cells.push(cell);
  }
  const upc = X.svg('g', {}, cal);
  K.shape(upc, P.rrect(BX.x, pb.y + 222, BX.w, 64, 12), C.hubPale);
  K.envelope(upc, BX.x + 40, pb.y + 254, 40, { seal: C.coral });
  X.svg('rect', { x: BX.x + 74, y: pb.y + 240, width: 90, height: 9, rx: 4.5, fill: C.hubLight }, upc);
  X.svg('rect', { x: BX.x + 74, y: pb.y + 258, width: 60, height: 7, rx: 3.5, fill: C.hubLight }, upc);
  const today = cells[9];
  tl.to(today, { fill: C.coral, duration: F(3) }, tNight - F(2));
  K.squash(today, tNight, { sx: 1.25, sy: 0.8, origin: '50% 50%' });
  K.shake(H.g, w('night', 'person'), { n: 5, a: 3.5, dur: F(2), origin: '50% 100%' });
  [0, 1, 2, 3].forEach((i) => X.sfx(w('night', 'person') + i * F(3), i % 2 ? 'tock' : 'tick', { gain: 0.3 }));
  // hard cut: day → night, layout unchanged
  const tCut = w('night', 'schedule') - F(1);
  tl.set(ground, { attr: { fill: C.night } }, tCut);
  tl.set(Lconf, { autoAlpha: 0 }, tCut); tl.set(Lstars, { autoAlpha: 1 }, tCut);
  tl.set(H.scrBg, { attr: { fill: C.nightScreen } }, tCut);
  tl.set(H.appbarBg, { attr: { fill: '#3a3657' } }, tCut);
  tl.set(H.sides, { attr: { stroke: C.nightScreen } }, tCut);
  tl.set(cells.filter((c) => c !== today), { attr: { fill: '#3f3b5c' } }, tCut);
  tl.set(upc, { opacity: 0.85 }, tCut);
  const moon = X.svg('g', {}, Lfront);
  K.shape(moon, P.circle(1250, 236, 50), C.sun);
  K.shape(moon, P.circle(1272, 220, 44), C.night);
  K.popIn(moon, tCut + F(3), { rot: -40, gain: 0.2 });
  K.bob(moon, { ay: 6, rot: 4, p: 3 });
  const zs = [36, 30, 24].map((s, i) => K.text(Lfront, 1098, 240, 'z', { size: s, weight: 600, color: C.hubLight }));
  zs.forEach((z, i) => {
    const t = tCut + F(6) + i * 0.38;
    gsap.set(z, { autoAlpha: 0 });
    tl.set(z, { autoAlpha: 1 }, t);
    tl.fromTo(z, { x: 0, y: 0, scale: 0.4, rotation: -10 }, { x: 60 + i * 18, y: -110 - i * 20, scale: 1, rotation: 12, duration: 1.3, ease: 'sine.out', immediateRender: false }, t);
    tl.to(z, { autoAlpha: 0, duration: F(8) }, t + 1.0);
  });
  [['M330,110 L760,300', tCut + 0.25], ['M1420,90 L1820,260', tCut + 1.35], ['M240,640 L560,780', tCut + 2.0]].forEach(([d, t]) => {
    const st = K.line(Lstars, d, '#ffffff', 5); K.draw(st, t, F(6), 'power2.in'); K.undraw(st, t + F(4), F(6), 'power2.out');
  });
  // cards drop into the schedule; months flip ahead; a date is circled
  const tCards = w('night', 'cards');
  const mini = (cell) => { const b = cell.getBBox(); const g = X.svg('g', {}, cal); K.shape(g, P.rrect(b.x + 3, b.y + 4, 20, 15, 3), '#fff'); X.svg('rect', { x: b.x + 3, y: b.y + 4, width: 20, height: 5, fill: C.hub }, g); return g; };
  const m1 = mini(cells[18]); K.land(m1, tCards - F(5), { dy: -200, fall: F(5), sfx: 'pop', gain: 0.25 });
  const tWeeks = w('night', 'weeks');
  [0, 1].forEach((k) => {
    const t = tWeeks - F(4) + k * F(6);
    tl.to(mBar, { scaleY: 0, duration: F(2), ease: 'power2.in' }, t).to(mBar, { scaleY: 1, attr: { width: 60 + k * 26 }, duration: F(3), ease: 'back.out(2)' }, t + F(2));
    tl.to(m1, { opacity: 0, duration: F(1) }, t);
    cells.forEach((c, i) => tl.fromTo(c, { scale: 1 }, { scale: 0.7, duration: F(2), yoyo: true, repeat: 1, ease: 'power1.inOut', immediateRender: false }, t + F(0.12) * i));
    X.sfx(t, 'tick', { gain: 0.3, pitch: 1.2 + k * 0.2 });
  });
  const tAhead = w('night', 'ahead');
  const target = cells[26].getBBox();
  const ring = X.svg('circle', { cx: target.x + 13, cy: target.y + 12, r: 19, fill: 'none', stroke: C.coral, 'stroke-width': 4, 'stroke-linecap': 'round' }, cal);
  K.draw(ring, tAhead - F(2), F(8), 'power2.out');
  const m2 = mini(cells[26]); K.popIn(m2, tAhead + F(4), { gain: 0.3, pitch: 1.3 });
  // close the hub like a mouth → dot → coral iris
  const tList = w('list', 'birthdays');
  const tClose = tList - F(18);
  const dot = H.closeToDot(tClose);
  K.popOut(moon, tClose, { dur: F(5) });
  const CORAL = K.world(Lworld, C.coral, { seed: 85 });
  CORAL.irisFrom(dot.x, dot.y, dot.r, dot.t - F(1), F(12));
  X.sfx(dot.t, 'zoom_in', { dur: 0.4, gain: 0.25 });
  // while covered: back to day, hub reset to "blown out" on the coral card
  const tCov = dot.t + F(13);
  tl.set(ground, { attr: { fill: C.ground } }, tCov);
  tl.set(Lconf, { autoAlpha: 1 }, tCov); tl.set(Lstars, { autoAlpha: 0 }, tCov);
  tl.set(H.scrBg, { attr: { fill: '#ffffff' } }, tCov); tl.set(H.appbarBg, { attr: { fill: C.hubPale } }, tCov); tl.set(H.sides, { attr: { stroke: C.hubPale } }, tCov);
  tl.set(H.g, { rotation: 0 }, tCov);
  H.setPage('feed', tCov); H.setFocus(4, tCov); H.resetOut(tCov);

  // ================================================================== 7. QUICK LIST on coral: dot → balloon → heart → house → plane → star → envelope
  {
    const c = CORAL.content, cx = 960, cy = 520;
    const mover = X.svg('g', {}, c);
    gsap.set(mover, { svgOrigin: `${cx} ${cy}` });
    const obj = K.shape(mover, P.circle(dot.x, dot.y, dot.r), '#fff');
    const det = X.svg('g', {}, mover);
    const step = (id, d, t, o = {}) => { K.morph(obj, d, t, o.dur ?? F(8), o.ease || 'power2.inOut'); X.sfx(t, 'swoosh', { dur: 0.22, gain: 0.18, pitch: 1.5 }); };
    // Birthdays: balloon with knot + swaying string
    const tB = w('list', 'birthdays');
    step('b', P.balloon(cx, cy - 30, 240), tB - F(5));
    K.squash(mover, tB + F(3), { sx: 0.9, sy: 1.1, origin: '50% 50%' });
    const knot = K.shape(det, `M${cx},${cy + 76} L${cx - 13},${cy + 96} L${cx + 13},${cy + 96}Z`, '#fff');
    const strW = X.svg('g', {}, det);
    const str = K.line(strW, `M${cx},${cy + 96} C${cx - 26},${cy + 140} ${cx + 26},${cy + 180} ${cx},${cy + 230}`, '#fff', 4);
    K.popIn(knot, tB + F(3), { sfx: 'bubble', gain: 0.25 });
    K.draw(str, tB + F(4), F(8), 'power2.out');
    X.every((t) => strW.setAttribute('transform', `rotate(${(6 * Math.sin(t * 3.1 - 0.6)).toFixed(2)} ${cx} ${cy + 96})`));
    const tT = w('list', 'thank');
    K.undraw(str, tT - F(7), F(5)); K.popOut(knot, tT - F(5), { dur: F(4) });
    // Thank yous: heart beats twice
    step('h', P.heart(cx, cy, 250), tT - F(5));
    [0, 1].forEach((k) => tl.to(mover, { scale: 1.14, duration: F(3), ease: 'power2.out' }, tT + F(4) + k * F(8)).to(mover, { scale: 1, duration: F(5), ease: 'back.out(3)' }, tT + F(7) + k * F(8)));
    X.sfx(tT + F(4), 'pop', { gain: 0.22, pitch: 0.8 }); X.sfx(tT + F(12), 'pop', { gain: 0.2, pitch: 0.8 });
    // Grandparents: house with door, window, chimney smoke
    const tG = w('list', 'grandparents');
    step('ho', P.house(cx, cy, 250), tG - F(5));
    const door = K.shape(det, P.rrect(cx - 24, cy + 40, 48, 66, 24, 0), C.coralDark);
    const win = K.shape(det, P.rrect(cx + 34, cy - 4, 40, 40, 6), C.sun);
    const chim = K.shape(det, P.rrect(cx + 46, cy - 96, 30, 50, 4, 0), '#fff');
    K.popIn(door, tG + F(2), { origin: '50% 100%', gain: 0.2 }); K.popIn(win, tG + F(4), { sfx: false }); K.popIn(chim, tG + F(5), { origin: '50% 100%', sfx: false });
    const smoke = [0, 1, 2].map((i) => X.svg('circle', { cx: cx + 61, cy: cy - 110, r: 10 + i * 3, fill: '#fff' }, det));
    smoke.forEach((s, i) => { gsap.set(s, { scale: 0, transformOrigin: '50% 50%' }); tl.fromTo(s, { x: 0, y: 0, scale: 0.3 }, { x: 18 + i * 6, y: -70 - i * 24, scale: 1, duration: 0.8, ease: 'sine.out', immediateRender: false }, tG + F(8) + i * F(5)).to(s, { scale: 0, duration: F(5) }, tG + F(8) + i * F(5) + 0.6); });
    // Long-distance friends: plane loops
    const tL = w('list', 'long');
    [door, win, chim].forEach((el, i) => K.popOut(el, tL - F(7) + i * F(1), { dur: F(4) }));
    step('pl', P.plane(cx, cy, 300), tL - F(5));
    const wing = K.shape(mover, P.planeWing(cx, cy, 300), 'rgba(42,40,64,0.12)');
    gsap.set(wing, { autoAlpha: 0 }); tl.set(wing, { autoAlpha: 1 }, tL + F(3)); tl.to(wing, { autoAlpha: 0, duration: F(2) }, w('list', 'or') - F(5));
    tl.to(mover, { motionPath: { path: [{ x: 180, y: -110 }, { x: 330, y: 0 }, { x: 170, y: 110 }, { x: -170, y: -110 }, { x: -330, y: 0 }, { x: -170, y: 110 }, { x: 0, y: 0 }], curviness: 1.4, autoRotate: true }, duration: 1.05, ease: 'power1.inOut' }, tL + F(3));
    tl.to(mover, { rotation: 0, duration: F(5), ease: 'power2.out' }, tL + F(3) + 1.06);
    X.sfx(tL + F(3), 'whoosh', { dur: 0.9, gain: 0.3 });
    // just because: star spins + sparkles
    const tJb = w('list', 'because');
    step('st', P.star(cx, cy, 130, 56, 5), w('list', 'or') - F(3));
    tl.fromTo(obj, { rotation: 0 }, { rotation: 144, duration: F(14), ease: 'back.out(1.6)', svgOrigin: `${cx} ${cy}`, immediateRender: false }, w('list', 'or') + F(3));
    [[cx - 190, cy - 120], [cx + 180, cy - 140], [cx + 200, cy + 110], [cx - 170, cy + 120]].forEach(([x, y], i) => { const s = K.sparkle(det, x, y, 18, i % 2 ? C.sun : '#fff'); K.popIn(s, tJb + i * F(2), { sfx: i ? false : 'sparkle', gain: 0.18, rot: 90 }); K.popOut(s, tJb + 1.0 + i * F(1)); });
    // gag 3: star → envelope; it leaves on "myself" and boomerangs back; "We won't judge." heart seal + mini confetti
    const tG3 = line('gag3').start;
    tl.set(obj, { rotation: 0 }, tG3 - F(5));
    step('en', P.rrect(cx - 110, cy - 72, 220, 144, 14), tG3 - F(5));
    const flap = K.line(det, `M${cx - 96},${cy - 58} L${cx},${cy + 10} L${cx + 96},${cy - 58}`, C.bar, 6);
    [-9, 8, -6, 0].forEach((a, i) => tl.to(mover, { rotation: a, duration: F(5), ease: 'sine.inOut', svgOrigin: `${cx} ${cy + 72}` }, tG3 + F(8) + i * F(5)));
    gsap.set(flap, { opacity: 0 }); tl.set(flap, { opacity: 1 }, tG3 + F(3)); K.draw(flap, tG3 + F(3), F(6), 'power2.out');
    const tMy = w('gag3', 'myself');
    const tOut = K.launch(mover, tMy, [{ x: 320, y: -160 }, { x: 1200, y: -40 }], { dur: F(9), back: { x: -30, y: 8 }, sfx: 'whoosh' });
    tl.set(mover, { x: -1250, y: -120 }, tOut + F(12));
    tl.to(mover, { motionPath: { path: [{ x: -700, y: -260 }, { x: -220, y: -90 }, { x: 0, y: 0 }], curviness: 1.2 }, duration: F(15), ease: 'power2.out' }, tOut + F(12));
    tl.fromTo(mover, { rotation: -25 }, { rotation: 0, duration: F(15), ease: 'back.out(2)', immediateRender: false }, tOut + F(12));
    K.squash(mover, tOut + F(27), { sx: 1.15, sy: 0.86, origin: '50% 100%' });
    X.sfx(tOut + F(12), 'swoosh', { dur: 0.5, gain: 0.3, pitch: 0.9 }); X.sfx(tOut + F(27), 'boing', { gain: 0.3, pitch: 1.1 });
    const tJudge = w('judge', 'judge');
    const seal = K.shape(det, P.heart(cx, cy + 6, 54), C.coral);
    K.popIn(seal, tJudge - F(2), { rot: -30, sfx: 'bubble', gain: 0.3 });
    K.burst(Lfx, cx, cy, tJudge, { n: 16, r0: 140, r1: 260, colors: ['#fff', '#fff', C.sun, C.hubLight], seed: 31, gain: 0.18 });
    K.shake(mover, tJudge + F(4), { n: 3, a: 5, dur: F(2), origin: '50% 100%' });
  }
  const tCol4 = line('finale').start - F(24);
  H.collapse(CORAL, tCol4);

  // ================================================================== 8. FINALE: hub → paper plane, launch, mailbox catches it, fireworks
  const tSo = w('finale', 'so');
  const planeD = P.plane(960, 440, 440);
  const tMorphEnd = H.morphTo(planeD, tSo - F(3), F(10), { base: false });
  tl.to([H.cable, H.plug], { opacity: 0, duration: F(3) }, tSo - F(1));
  const big = K.plane(Lfront, 960, 440, 440, { color: C.hub, wing: C.hubDark });
  gsap.set(big.g, { autoAlpha: 0, transformOrigin: '50% 50%' });
  tl.set(big.g, { autoAlpha: 1 }, tMorphEnd); tl.set(H.sil, { autoAlpha: 0 }, tMorphEnd);
  tl.from(big.wing, { opacity: 0, duration: F(3), immediateRender: false }, tMorphEnd);
  const smL = X.svg('g', {}, Lfront), smR = X.svg('g', {}, Lfront);
  K.plane(smL, 0, 0, 170, { color: C.coral, wing: C.coralDark }); smL.firstChild.setAttribute('transform', 'scale(-1 1)');
  K.plane(smR, 0, 0, 170, { color: C.sky, wing: '#1b86c7' });
  gsap.set(smL, { x: 610, y: 500 }); gsap.set(smR, { x: 1310, y: 500 });
  K.popIn(smL, tSo + F(4), { pitch: 1.2 }); K.popIn(smR, tSo + F(7), { pitch: 1.35 });
  K.bob(big.g, { ay: 6, p: 1.8, from: tMorphEnd });
  const tMake = w('finale', 'make');
  const tl1 = K.launch(big.g, tMake - F(2), [{ x: 260, y: -230 }, { x: 980, y: -760 }], { dur: F(14), back: { x: -30, y: 18 }, sfx: 'whoosh', gain: 0.4 });
  tl.to(big.g, { rotation: -30, duration: F(10), ease: 'power2.in' }, tl1);
  K.launch(smL, tMake, [{ x: -150, y: -220 }, { x: -800, y: -620 }], { dur: F(14), back: { x: 16, y: 14 }, sfx: false });
  tl.to(smL, { rotation: 30, duration: F(10), ease: 'power2.in' }, tMake + F(4));
  K.launch(smR, tMake + F(2), [{ x: 160, y: -230 }, { x: 760, y: -660 }], { dur: F(14), back: { x: -16, y: 14 }, sfx: false });
  tl.to(smR, { rotation: -32, duration: F(10), ease: 'power2.in' }, tMake + F(6));
  X.sfx(tMake - F(10), 'riser', { dur: 0.5, gain: 0.25 });
  K.puffs(Lfx, 960, 520, tl1, { scale: 0.8 });
  [['M610,500 C540,400 300,200 -60,-80', tMake + F(6)], ['M1310,500 C1400,380 1650,170 2000,-110', tMake + F(8)], ['M960,440 C1080,300 1400,60 1880,-260', tl1 + F(2)]].forEach(([d, t]) => {
    const tr = K.dashed(Lback, d, { color: C.hubLight, width: 4 }); tr.draw(t, F(12)); tr.erase(t + F(12), F(10));
  });
  // the mailbox rises on "mailbox", the big plane dives back into it, the flag pops up on "best"
  const tMb = w('finale', 'mailbox');
  const M2 = K.mailbox(Lfront, { cx: 960, top: 330, w: 240, h: 212, groundY: 800 });
  M2.rise(tMb - F(3));
  const tDive = tMb + F(7);
  tl.set(big.g, { x: -980, y: -620, rotation: 32, scale: 0.6 }, tDive);
  tl.to(big.g, { motionPath: { path: [{ x: -520, y: -300 }, { x: -140, y: -40 }, { x: 0, y: 8 }], curviness: 1.2 }, scale: 0.16, duration: F(11), ease: 'power2.in' }, tDive);
  X.sfx(tDive, 'swoosh', { dur: 0.45, gain: 0.32 });
  M2.open(tDive + F(5));
  hideAt(big.g, tDive + F(11));
  M2.close(tDive + F(12));
  K.squash(M2.box, tDive + F(12), { sx: 1.12, sy: 0.88 });
  X.sfx(tDive + F(11), 'thud', { gain: 0.3 });
  M2.flagUp(w('finale', 'best') - F(3));
  const tDay = w('finale', 'day');
  [[640, 300, -2, 1.3], [1290, 250, 1, 1.15], [960, 150, 4, 1.0], [430, 620, 6, 0.9], [1500, 600, 8, 1.1], [780, 120, 10, 0.75], [1160, 110, 12, 0.8]].forEach(([x, y, df, sc], i) =>
    K.rings(Lfx, x, y, tDay + F(df), { colors: [[C.coral, C.teal, C.sun], [C.sun, C.hub, C.coral], [C.teal, C.coral, C.sky]][i % 3], radii: [46 * sc, 86 * sc, 128 * sc], sfx: i % 2 ? false : 'pop', pitch: 0.7 + i * 0.1 }));
  K.burst(Lfx, 960, 320, tDay, { n: 34, r0: 180, r1: 520, seed: 44, gain: 0.3 });
  K.burst(Lfx, 560, 420, tDay + F(6), { n: 18, r0: 80, r1: 260, seed: 45, sfx: false });
  K.burst(Lfx, 1360, 400, tDay + F(9), { n: 18, r0: 80, r1: 260, seed: 46, sfx: false });

  // ================================================================== 9. RESOLVE: mailbox → dot → bounce → logo mark, wordmark, tagline
  const tLogo = w('logo', 'postpop');
  [M2.slot, M2.knob, M2.door, M2.inside, M2.flag].forEach((el, i) => K.popOut(el, tLogo - F(5) + i * F(1), { dur: F(4) }));
  tl.to(M2.post, { scaleY: 0, duration: F(6), ease: 'power2.in' }, tLogo - F(3));
  const dotD = P.circle(960, 436, 22);
  K.morph(M2.body, dotD, tLogo - F(3), F(8), 'back.in(1.6)');
  const tDot = tLogo + F(5);
  tl.to(M2.box, { y: -150, duration: F(6), ease: 'power2.out' }, tDot)
    .to(M2.box, { y: 70, duration: F(6), ease: 'power2.in' }, tDot + F(6))
    .to(M2.box, { scaleX: 1.4, scaleY: 0.6, duration: F(2), svgOrigin: '960 458' }, tDot + F(12))
    .to(M2.box, { y: -20, scaleX: 1, scaleY: 1, duration: F(5), ease: 'power2.out' }, tDot + F(14));
  X.sfx(tDot + F(12), 'boing', { gain: 0.3, pitch: 1.5 });
  const trail = K.line(Lback, 'M960,290 L960,500', C.teal, 4);
  K.draw(trail, tDot + F(6), F(6), 'power2.in'); K.undraw(trail, tDot + F(11), F(6));
  tl.to(H.ground, { scaleX: 0, duration: F(8), ease: 'back.in(1.5)' }, tDot);
  const mk = K.mark(Lui, 960, 400, 112);
  const tMark = tDot + F(18);
  hideAt(M2.box, tMark);
  gsap.set(mk.g, { svgOrigin: '960 400', scale: 0 });
  tl.fromTo(mk.g, { scale: 0.2 }, { scale: 1, duration: F(12), ease: 'back.out(1.7)', immediateRender: false }, tMark);
  tl.from(mk.stamp, { rotation: -60, scale: 0, duration: F(12), ease: 'back.out(1.8)', svgOrigin: '960 400', immediateRender: false }, tMark + F(4));
  tl.from(mk.sun, { y: 30, duration: F(14), ease: 'back.out(1.5)', immediateRender: false }, tMark + F(9));
  X.sfx(tMark, 'pop', { gain: 0.35, pitch: 0.8 }); X.sfx(tMark + F(4), 'chime', { dur: 0.8, gain: 0.3 });
  K.rings(Lfx, 960, 400, tMark + F(2), { radii: [150, 186], colors: [C.teal, C.coral], spokes: 10, sfx: false });
  K.burst(Lfx, 960, 400, tMark + F(3), { n: 18, r0: 170, r1: 300, seed: 61, gain: 0.15 });
  K.wordmark(Lui, 960, 652, 'postpop', tMark + F(8), { size: 118, weight: 600 });
  const tag = K.text(Lui, 960, 724, 'Real mail, from your phone.', { size: 40, weight: 600, family: 'Nunito', color: C.greyText });
  gsap.set(tag, { opacity: 0 });
  tl.fromTo(tag, { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: F(12), ease: 'power3.out', immediateRender: false }, tMark + F(20));
  const avail = K.text(Lui, 960, 792, 'Free on iOS and Android', { size: 30, weight: 600, family: 'Nunito', color: '#a2a6b0' });
  gsap.set(avail, { opacity: 0 }); tl.to(avail, { opacity: 1, duration: F(10) }, tMark + F(34));
  // gentle life on the end card
  K.bob(mk.g, { ay: 5, p: 3.2, from: tMark + 0.8 });
  K.flyby(Lback, tMark + 1.8, 'M-90,980 C400,1060 700,880 1000,960 S1600,1060 2010,900', { dur: 3.6, color: C.coral, size: 54 });
  K.flyby(Lback, tMark + 4.4, 'M2010,170 C1600,40 1300,200 1000,110 S400,30 -90,150', { dur: 3.6, color: C.sky, size: 54 });

  X.end(X.vo.duration);
});
