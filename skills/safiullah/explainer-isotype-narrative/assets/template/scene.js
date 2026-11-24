/* explainer-isotype-narrative starter (~19 s): question line + slam → whip-pan → chapter cloud + flow chain
 * (family → bank → bank → builder) → camera tilts to the central bank, a reserve coin travels → smoke puff → title
 * slam → fade. Replace script.json, keep one field, one cream cast, and put every build on its spoken word. */
X.boot(async (X) => {
  await X.loadVO();
  IK.init(X);
  const C = IK.C, F = IK.F, tl = X.tl;
  const W = (id, w, n = 0) => X.word(id, w, n), L = (id) => X.line(id);
  const END = X.vo.duration || 19;

  const bg = X.svg('g'); IK.field(bg);                 // the one vignetted field
  const world = X.svg('g'), ui = X.svg('g'), fx = X.svg('g'), top = X.svg('g');

  // 1 · hook: slab caps typed from a fixed left edge, then a one-word slam (T3)
  const tWhip = L('cast').start - 0.4;
  const s1 = X.scene('hook', 0, tWhip + F(6), (g) => {
    const grp = X.svg('g', {}, g);
    IK.typeLine(grp, 'HOW DOES A PAYMENT TRAVEL?', 0.35, { y: 470, size: 56, ls: '0.09em', cps: 30 });
    IK.slam(grp, [{ text: 'HOW?', t: W('hook', 'travel') + 0.1, y: 690, size: 190 }]);
    IK.whipOut(grp, tWhip);                            // T5
    IK.creep(g, 0, tWhip, { rate: 0.008 });
  }, world);
  gsap.set(s1, { autoAlpha: 1 });

  // 2 · chapter cloud (T10) + the flow chain (T13)
  const tFade = END - 1.6;
  IK.chapter(ui, 'HOW A PAYMENT MOVES', tWhip + F(4), { tOut: L('close').start - 0.4 });
  X.scene('chain', tWhip + F(3), tFade + F(20), (g) => {
    const cam = X.cam(X.svg('g', {}, g)), Y = 600, t0 = tWhip + F(5);
    const fam = IK.family(cam, { x: 352, y: Y, h: 190 });
    const bA = IK.bank(cam, { x: 790, y: Y, w: 250, label: 'THEIR BANK' });
    const bB = IK.bank(cam, { x: 1190, y: Y, w: 250, label: "BUILDER'S BANK" });
    const bld = IK.builder(cam, { x: 1600, y: Y, h: 200 });
    [...fam.members, bA, bB, bld].forEach((el, i) => IK.focusIn(el, t0 + i * F(3), { sfx: i ? false : 'pop' }));
    const dep = X.svg('g', {}, cam); gsap.set(dep, { x: 352, y: 356 });
    const dIn = X.svg('g', {}, dep);
    IK.card(dIn, { w: 108 }); IK.tag(dIn, { x: 64, y: -40, h: 28, slots: 6, start: 6 });
    IK.focusIn(dep, W('cast', 'family'), { origin: '50% 50%' });
    IK.hover(dIn, W('cast', 'family') + 0.5, tFade, { amp: 6 });
    // "pays" → bar; "moves" → bar + card travels; "his" → last bar
    IK.bar(cam, 498, 520, 652, 520, W('cast', 'pays') - 0.04);
    IK.bar(cam, 926, 520, 1054, 520, W('flow', 'moves') - 0.05);
    IK.travel(dep, [[352, 356], [570, 300], [790, 350], [990, 290], [1190, 350]], W('flow', 'moves'), F(28), { curviness: 1.1 });
    IK.bar(cam, 1326, 520, 1520, 520, W('flow', 'his') - 0.05);
    // "settle up in reserves": tilt down to the central bank; a coin travels A → CB → B
    const tS = W('flow', 'two') - 0.1;
    IK.pullBack(cam, tS, { scale: 1, y: -168, dur: F(16) });
    const cb = IK.centralBank(cam, { x: 990, y: 1112, w: 400, labelBelow: true, labelSize: 30 });
    IK.focusIn(cb, tS + F(6), { sfx: 'pop' });
    IK.route(cam, [[740, 662], [740, 1010], [782, 1010]], W('flow', 'settle'));
    IK.route(cam, [[1198, 1010], [1240, 1010], [1240, 664]], W('flow', 'settle') + F(5), { arrow: true });
    const coin = IK.coin(cam, { x: 740, y: 662, w: 58 });
    IK.popIn(coin, W('flow', 'reserves') - 0.15, { origin: '50% 50%', sfx: 'coin' });
    IK.travel(coin, [[740, 662], [740, 1010], [990, 1010], [1240, 1010], [1240, 664]], W('flow', 'reserves') + 0.1, F(30), { ease: 'power1.inOut', sfx: false });
    IK.creep(g, tWhip, tFade, { rate: 0.007 });
  }, world);

  // 3 · close: smoke puff (T8) hides the diagram, the title phrase slams, fade to black
  const tC = L('close').start - 0.2;
  const sm = IK.smoke(fx, 960, 540, tC - 0.3, { n: 34, sx: 820, sy: 440, rMin: 140, rMax: 260, grow: F(10), hold: F(2), clear: F(16) });
  const fin = X.scene('fin', sm.tFull, END, (g) => {
    IK.slam(g, [{ text: 'MONEY,', t: W('close', 'money') + 0.08, y: 500, size: 150 }, { text: 'MOVING.', t: W('close', 'moving') + 0.1, y: 680, size: 150 }]);
  }, world);
  tl.set(world.querySelector('#chain'), { autoAlpha: 0 }, sm.tFull);
  const blk = X.svg('rect', { width: 1920, height: 1080, fill: C.black, opacity: 0 }, top);
  tl.fromTo(blk, { opacity: 0 }, { opacity: 1, duration: F(20), ease: 'power1.inOut', immediateRender: false }, tFade);
  X.end(END);
});
