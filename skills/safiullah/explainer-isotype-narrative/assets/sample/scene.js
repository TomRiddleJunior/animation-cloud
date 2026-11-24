/* isotype-narrative sample — "The Making of Money": how a commercial bank creates money by lending.
 * One vignetted field, zero cuts: crest → question cascade → cast & proxies → chapter "how a loan makes money"
 * (smoke-puff magic, pull-back) → flow chain with central-bank settlement → white-ground limits → repay & go dark
 * → starburst → the loop closes → crest → credits. Every build lands on its spoken word (data/vo.json). */
X.boot(async (X) => {
  await X.loadVO();
  IK.init(X);
  const C = IK.C, F = IK.F, tl = X.tl;
  const W = (id, w, n = 0) => X.word(id, w, n), L = (id) => X.line(id);
  const END = X.vo.duration || 74.8;

  // ------------------------------------------------------------------ layers
  const bg = X.svg('g', { id: 'bg' });
  IK.field(bg);
  const darkR = X.svg('rect', { width: 1920, height: 1080, fill: C.black, opacity: 0 }, bg);
  const world = X.svg('g', { id: 'world' });       // green-field sets
  const whiteL = X.svg('g', { id: 'whiteL' });     // the inverted ground (iris) …
  const whiteW = X.svg('g', { id: 'whiteW' });     // … and its green-on-white set
  const ui = X.svg('g', { id: 'ui' });             // chapter cloud, bubbles (screen space)
  const fx = X.svg('g', { id: 'fx' });             // smoke, starbursts
  const top = X.svg('g', { id: 'top' });           // final fade + credits

  // ================================================================== A. heraldic crest (T1) → starburst (T2)
  const tBoom = 3.42;
  const sA = X.scene('crest', 0, tBoom + 0.45, (g) => {
    const cr = IK.crest(g, 0.12, { cx: 960, cy: 500, scale: 1.22, l0: 'THE', l1: 'MAKING', size1: 46, l2: 'OF MONEY', tRibbon: W('title', 'of') - 0.12 });
    tl.to(cr.g, { scale: 1.12, opacity: 0, duration: F(9), ease: 'power2.in' }, tBoom + F(3));
  }, world);
  gsap.set(sA, { autoAlpha: 1 });
  IK.burst(fx, 1010, 455, tBoom, { offsets: [[0, 0, 1], [210, -70, 0.62], [-190, 60, 0.55]], R: 150, scale: 4.2, hold: F(5), fade: F(12) });
  IK.smoke(fx, 960, 520, tBoom + F(4), { n: 30, sx: 760, sy: 420, rMin: 130, rMax: 270, grow: F(10), hold: F(5), clear: F(26), seed: 7, sfx: false });

  // ================================================================== B. question cascade → "?" → LOAN$!
  const tQ = L('q1').start - 0.2;
  const tWall = W('jargon', 'words');
  X.scene('question', tQ - 0.05, tWall, (g) => {
    const qs = 'WHERE DOES NEW MONEY COME FROM';
    const q = IK.text(g, qs + '?', { y: 560, size: 56, ls: '0.09em', anchor: 'start', x: 0 });
    gsap.set(q, { attr: { x: 960 - q.getComputedTextLength() / 2 } });
    const ext = q.getExtentOfChar(qs.length);
    const qmX = ext.x + ext.width / 2;
    q.textContent = qs;
    X.typeOn(q, qs, tQ, 26);
    tl.fromTo(q, { filter: 'blur(8px)', opacity: 0.4 }, { filter: 'blur(0px)', opacity: 1, duration: F(12), ease: 'power2.out', immediateRender: false }, tQ);
    for (let i = 0; i < qs.length; i += 3) X.sfx(tQ + i / 26, 'type', { gain: 0.1 });
    const tQm = tQ + qs.length / 26;
    const qm = IK.text(g, '?', { x: qmX, y: 560, size: 56, ls: 0 });
    gsap.set(qm, { opacity: 0, transformOrigin: '50% 70%' });
    tl.set(qm, { opacity: 1 }, tQm);
    // everything but the "?" blurs away; the "?" travels to centre and grows
    const tIso = L('q1').end + 0.12;
    IK.focusOut(q, tIso, { dur: F(7) });
    tl.fromTo(qm, { x: 0, y: 0, scale: 1 }, { x: 960 - qmX, y: 40, scale: 3.4, duration: F(10), ease: 'back.out(1.6)', immediateRender: false }, tIso);
    X.sfx(tIso, 'blip_up', { gain: 0.25 });
    // "Mostly?" — small slab line; "From" — ? flips into $ ; "loans" — LOAN$! slams letter by letter
    IK.slam(g, [{ text: 'MOSTLY?', t: W('verdict', 'Mostly') + 0.08, x: 960, y: 380, size: 54, from: 5, gain: 0.25 }]);
    const word = 'LOAN$!', size = 190;
    const meas = IK.text(g, word, { y: 680, size, ls: '0.05em' });
    const xs = [...word].map((_, i) => meas.getExtentOfChar(i)).map((b) => b.x + b.width / 2);
    meas.remove();
    const tFrom = W('verdict', 'From');
    tl.to(qm, { scaleX: 0, duration: F(3), ease: 'power2.in' }, tFrom);
    const dollar = IK.text(g, '$', { x: xs[4], y: 680, size, ls: 0 });
    gsap.set(dollar, { scaleX: 0, transformOrigin: '50% 50%' });
    tl.fromTo(dollar, { scaleX: 0 }, { scaleX: 1, duration: F(4), ease: 'back.out(2)', immediateRender: false }, tFrom + F(3));
    X.sfx(tFrom, 'swoosh', { gain: 0.22 });
    const tLoans = W('verdict', 'loans');
    const letters = IK.slam(g, [0, 1, 2, 3, 5].map((i, k) => ({ text: word[i], x: xs[i], y: 680, size, ls: 0, t: tLoans - 0.06 + k * F(3), gain: k === 4 ? 0.45 : 0.3, pitch: 1 + k * 0.05 })));
    // the word breaks apart
    const tBreak = tWall - 0.62, rnd = X.rand(17);
    [...letters, dollar].forEach((el, i) => {
      const dx = (rnd() - 0.5) * 900, dy = -200 - rnd() * 500, rot = (rnd() - 0.5) * 120;
      tl.to(el, { x: dx, y: dy, rotation: rot, opacity: 0, filter: 'blur(8px)', duration: F(10), ease: 'power2.in' }, tBreak + i * F(1));
    });
    tl.to(g.querySelectorAll('text'), { opacity: 0, duration: F(6) }, tBreak + F(4));
    X.sfx(tBreak, 'whoosh', { gain: 0.3 });
    IK.creep(g, tQ, tWall, { rate: 0.007 });
  }, world);

  // ================================================================== C. jargon wall → dive into the O (T4)
  const tDive = W('jargon', 'banks') + 0.36;
  X.scene('jargon', tWall - 0.1, tDive + F(11), (g) => {
    const dv = X.svg('g', {}, g), wall = X.svg('g', {}, dv);
    const filler = ['CREDIT', 'INTEREST', 'LIQUIDITY', 'BALANCE SHEET', 'BONDS', 'BASE MONEY', 'LEVERAGE', 'INFLATION', 'CAPITAL', 'LENDING',
      'MONEY SUPPLY', 'RATES', 'DEBT', 'LEDGER', 'SETTLEMENT', 'ASSETS', 'LIABILITIES', 'YIELD', 'OVERNIGHT', 'COLLATERAL', 'TREASURY'];
    const rnd = X.rand(31);
    const words = [];
    let k = 0;
    for (let y = 105; y < 1100; y += 92 + rnd() * 26) {
      let x = -40 - rnd() * 120;
      while (x < 1960) {
        const w = filler[k++ % filler.length], big = rnd() < 0.3, size = big ? 74 + rnd() * 30 : 38 + rnd() * 22;
        const slab = rnd() < 0.55;
        const el = IK.text(wall, w, { x, y, size, anchor: 'start', font: slab ? IK.SLAB : IK.COND, weight: slab ? 400 : 700, ls: '0.03em', fill: rnd() < 0.5 ? C.cream : C.tan });
        const len = el.getComputedTextLength();
        if (rnd() < 0.18) gsap.set(el, { rotation: 180, transformOrigin: '50% 35%' });
        words.push(el);
        x += len + 26 + rnd() * 30;
      }
    }
    // order of appearance: scattered
    const order = words.map((w, i) => [rnd(), w]).sort((a, b) => a[0] - b[0]).map((a) => a[1]);
    order.forEach((el, i) => {
      gsap.set(el, { opacity: 0 });
      tl.fromTo(el, { opacity: 0, scale: 1.6, filter: 'blur(6px)' }, { opacity: 0.92, scale: 1, filter: 'blur(0px)', duration: F(4), ease: 'power2.out', immediateRender: false }, tWall + i * (0.72 / order.length));
    });
    for (let i = 0; i < 8; i++) X.sfx(tWall + i * 0.09, 'type', { gain: 0.14, pitch: 0.8 + i * 0.05 });
    tl.to(wall, { opacity: 0.32, duration: F(8), ease: 'power1.inOut' }, W('jargon', 'deposits') - F(5));
    // the three spoken terms slam over the wall
    const shadow = X.shadow('ikTxtSh', 0, 6, 10, '#1d2e0a', 0.55);
    const big = IK.slam(dv, [
      { text: 'DEPOSITS', t: W('jargon', 'deposits') + 0.1, x: 960, y: 500, size: 176 },
      { text: 'RESERVES', t: W('jargon', 'reserves') + 0.1, x: 960, y: 660, size: 116 },
      { text: 'CENTRAL BANKS', t: W('jargon', 'central') + 0.12, x: 960, y: 790, size: 92 },
    ]);
    big.forEach((b) => b.setAttribute('filter', shadow));
    // dive into the counter of the O in DEPOSITS
    const o = big[0].getExtentOfChar(3);
    IK.dive(dv, o.x + o.width / 2, 500 - 176 * 0.355, tDive, { scale: 48, dur: F(10) });
    IK.creep(g, tWall, tDive, { rate: 0.008 });
  }, world);

  // ================================================================== D. who? → ORDINARY BANKS → how? here's how (+ glove point) → whip
  const tWho = L('who').start, tWhip1 = L('cast').start - 0.42;
  X.scene('who', tWho - 0.3, tWhip1 + F(6), (g) => {
    const grp = X.svg('g', {}, g);
    IK.typeLine(grp, 'WHO MAKES IT?', tWho - 0.06, { x: 210, y: 452, size: 52, anchor: 'start', cps: 34 });
    IK.slam(grp, [{ text: 'ORDINARY', t: W('who', 'Ordinary') + 0.14, x: 210, y: 590, size: 112, anchor: 'start', from: 5 },
      { text: 'BANKS.', t: W('who', 'banks') + 0.1, x: 210, y: 770, size: 178, anchor: 'start', from: 6 }]);
    const tHow = W('how', 'How');
    IK.trail(grp, 860, 430, 1110, 300, tHow - 0.2, { n: 4, r0: 6, r1: 13 });
    const c1 = IK.cloud(grp, 'HOW?', { x: 1210, y: 262, size: 44, seed: 3 });
    IK.popIn(c1, tHow - 0.02, { origin: '50% 50%', sfx: 'bubble' });
    const c2 = IK.cloud(grp, "HERE'S HOW", { x: 1530, y: 330, size: 46, seed: 6 });
    const c2w = c2.text.getComputedTextLength();
    c2.text.setAttribute('text-anchor', 'start'); c2.text.setAttribute('x', -c2w / 2);
    c2.text.textContent = '';
    IK.popIn(c2, W('how', "Here's") - 0.05, { origin: '20% 50%', sfx: 'pop' });
    X.typeOn(c2.text, "HERE'S HOW", W('how', "Here's") + F(3), 30);
    const pa = IK.arm(grp, { x: 1010, y: 735, angle: 8, s: 1.15, len: 1300, kind: 'point', t: W('how', 'how') - 0.2 });
    IK.hover(c1, tHow + 0.3, tWhip1, { amp: 6, hz: 0.6 });
    IK.hover(c2, W('how', "Here's") + 0.3, tWhip1, { amp: 7, hz: 0.5, phase: 1.5 });
    IK.hover(pa.hand, W('how', 'how') + 0.2, tWhip1, { amp: 9, hz: 1.4, axis: 'x' });
    IK.whipOut(grp, tWhip1);
    IK.creep(g, tWho - 0.3, tWhip1, { cx: 600, cy: 600, rate: 0.009 });
  }, world);

  // ================================================================== E. the cast: family · banks · builder (focus-in), banks drop in (T6)
  const tCast = tWhip1 + F(4), tLift = L('proxy').start - 0.24;
  const cast = {};
  X.scene('cast', tCast - F(1), tLift + F(4), (g) => {
    const row = X.svg('g', {}, g);
    const fam = IK.family(row, { x: 470, y: 720, h: 250 });
    fam.members.forEach((m, i) => IK.focusIn(m, W('cast', 'family') - 0.12 + i * F(4), { sfx: i === 1 ? 'pop' : false }));
    // "wants a house": a thought cloud with a green house
    const tWant = W('cast', 'wants');
    IK.trail(row, 560, 440, 650, 345, tWant - 0.05, { n: 3, r0: 6, r1: 12 });
    const wc = IK.cloud(row, '', { x: 730, y: 290, size: 62, seed: 12 });
    IK.house(wc, { x: 0, y: 34, w: 74, fill: 'ink' });
    IK.popIn(wc, tWant + 0.18, { origin: '0% 100%', sfx: 'bubble' });
    IK.hover(wc, tWant + 0.5, tLift, { amp: 7, hz: 0.5 });
    IK.hover(fam.child, W('cast', 'family') + 0.4, tLift, { amp: 5, hz: 1.1 });
    IK.hover(fam.dog, W('cast', 'family') + 0.6, tLift, { amp: 3, hz: 0.9, phase: 2 });
    // builder + his house (+ FOR SALE)
    const bld = IK.builder(row, { x: 1716, y: 720, h: 250 });
    IK.focusIn(bld, W('cast', 'builder') - 0.1, { sfx: 'pop' });
    const hs = IK.house(row, { x: 1462, y: 720, w: 220 });
    IK.focusIn(hs, W('cast', 'selling') - 0.05);
    const sg = IK.sign(row, { x: 1606, y: 720, h: 124 });
    IK.popIn(sg, W('cast', 'one') - 0.04, { sfx: 'pop' });
    // the banks drop in
    const tB = W('cast', 'banks') - 0.1;
    const bA = IK.bank(row, { x: 900, y: 720, w: 222, label: 'THEIR BANK' });
    const bB = IK.bank(row, { x: 1170, y: 720, w: 222, label: "BUILDER'S BANK" });
    IK.dropIn(bA, tB, { sfx: 'drop' });
    IK.dropIn(bB, tB + F(5), { sfx: 'drop' });
    IK.liftOut(row, tLift);
    IK.creep(g, tCast, tLift, { cx: 960, cy: 600, rate: 0.01 });
  }, world);

  // ================================================================== F. proxy: cash is small, deposits are most money; push into one ledger card
  const tChap = L('ask').start - 0.78;
  X.scene('proxy', tLift + F(2), tChap + F(6), (g) => {
    const grp = X.svg('g', {}, g), cam = X.cam(X.svg('g', {}, grp));
    const coins = IK.coins(cam, { x: 360, y: 716, w: 160 });
    IK.dropIn(coins, tLift + F(3), { dy: 260, sfx: 'drop' });
    const lc = IK.labelBelow(cam, 'CASH', 360, 772, { labelSize: 34 });
    IK.focusIn(lc, W('proxy', 'cash') - 0.05, { origin: '50% 50%' });
    IK.arm(cam, { x: 268, y: 640, angle: 160, s: 0.95, len: 1200, kind: 'point', t: W('proxy', 'isn') - 0.15, tOut: W('proxy', 'It') - 0.05 });
    // the deposits: 11 ledger cards
    const cards = [], tDep = W('proxy', 'deposit') - 0.12;
    const pos = [];
    for (let i = 0; i < 6; i++) pos.push([700 + i * 172, 590]);
    for (let i = 0; i < 5; i++) pos.push([786 + i * 172, 760]);
    pos.forEach(([x, y], i) => {
      const c = IK.card(cam, { x, y, w: 140 });
      IK.popIn(c, tDep + i * F(2), { sfx: i % 3 === 0 ? 'pop' : false, pitch: 1 + i * 0.03 });
      cards.push(c);
    });
    cards.forEach((c, i) => IK.hover(c, tDep + 0.4 + i * F(2), tChap, { amp: 4, hz: 0.55, phase: i * 0.7 }));
    IK.hover(coins, tLift + 0.4, tChap, { amp: 3, hz: 0.5, phase: 1 });
    const ld = IK.labelBelow(cam, 'DEPOSITS', 1130, 830, { labelSize: 34 });
    IK.focusIn(ld, tDep + F(14), { origin: '50% 50%' });
    // push in on the first card: "a number in a bank's ledger"
    const tNum = W('proxy', 'number') - 0.2, s = 2.7, cx = 704, cy = 520;
    IK.pullBack(cam, tNum, { scale: s, x: -s * (cx - 960), y: -s * (cy - 540), dur: F(15) });
    const tg = IK.tag(cam, { x: 640, y: 474, h: 24, slots: 6 });
    tg.show(tNum + F(13));
    tg.fill(tNum + F(17), 6, F(2));
    IK.hover(tg, tNum + F(30), tChap, { amp: 2.2, hz: 0.6 });
    const bk = IK.bank(cam, { x: 667, y: 523, w: 26, fill: 'ink', shadow: false });
    IK.popIn(bk, W('proxy', 'ledger') - 0.05, { sfx: 'stamp', gain: 0.25 });
    IK.whipOut(grp, tChap);
    IK.creep(g, tLift, tChap, { cx: 960, cy: 640, rate: 0.005 });
  }, world);

  // ================================================================== G. chapter: HOW A LOAN MAKES MONEY (T10) — ask · stamp · smoke magic · pull-back
  const tStop = L('stop').start;
  IK.chapter(ui, 'HOW A LOAN MAKES MONEY', tChap + F(2), { tOut: tStop - 0.3, x: 360, y: 96 });
  const tWhip2 = L('pay').start - 0.46;
  X.scene('loan', tChap + F(3), tWhip2 + F(6), (g) => {
    const grp = X.svg('g', {}, g), cam = X.cam(X.svg('g', {}, grp));
    const fam = IK.family(cam, { x: 560, y: 776, h: 300 });
    fam.members.forEach((m, i) => IK.focusIn(m, tChap + F(5) + i * F(3)));
    const bank = IK.bank(cam, { x: 1370, y: 776, w: 400, label: 'THEIR BANK', labelSize: 34, labelDy: 46 });
    IK.focusIn(bank, tChap + F(9), { sfx: 'pop' });
    // the family asks: connector + application card travelling along it
    const tAsk = W('ask', 'asks');
    IK.bar(cam, 800, 560, 1140, 560, tAsk - 0.04, { w: 12, dur: F(9) });
    const app = IK.card(cam, { x: 790, y: 540, w: 120, kind: 'apply' });
    IK.popIn(app, tAsk + 0.1, { sfx: 'pop' });
    IK.travel(app, [[790, 540], [1060, 540]], W('ask', 'bank') - 0.02, F(14));
    IK.hover(app, W('ask', 'loan') + 0.2, W('types', 'checks') + 0.2, { amp: 4, hz: 0.6 });
    // the bank checks: a gloved hand stamps the card
    const tCheck = W('types', 'checks') - 0.1, tPress = W('types', 'repay') - 0.04;
    const arm = IK.arm(cam, { x: 1060, y: 330, angle: -90, s: 1.0, len: 1100, kind: 'fist', t: tCheck, tOut: tPress + 0.42 });
    X.svg('path', { d: IK.P.cap(14, 0, -40, 0, 18) + IK.P.rect(-92, -40, 46, 80, 6) + IK.P.rect(-100, -44, 10, 88, 3), fill: C.tan }, arm.held);
    tl.fromTo(arm.slide, { x: 0 }, { x: -44, duration: F(4), ease: 'power2.in', immediateRender: false }, tPress - F(4));
    tl.fromTo(arm.slide, { x: -44 }, { x: 0, duration: F(6), ease: 'power2.out', immediateRender: false }, tPress + F(1));
    X.sfx(tPress, 'stamp', { gain: 0.5 });
    const ok = IK.check(cam, { x: 1060, y: 505, w: 46, shadow: false, fill: C.tag });
    ok.body.setAttribute('fill', C.tag);
    IK.popIn(ok, tPress + F(1), { origin: '50% 50%', sfx: false });
    // "then types the amount into their account": smoke-puff magic (T8)
    const tType = W('types', 'types') - 0.3;
    const sm = IK.smoke(fx, 1000, 520, tType, { n: 34, sx: 520, sy: 300, rMin: 110, rMax: 220, grow: F(14), hold: F(4), clear: F(20), seed: 5 });
    X.sfx(tType + F(4), 'sparkle', { gain: 0.3 });
    tl.set([app, ok], { opacity: 0 }, sm.tFull);
    const dep = X.svg('g', {}, cam);
    gsap.set(dep, { x: 700, y: 450 });
    const depIn = X.svg('g', {}, dep);
    IK.card(depIn, { x: 0, y: 0, w: 130 });
    const dtag = IK.tag(depIn, { x: 76, y: -48, h: 34, slots: 6 });
    gsap.set(dep, { opacity: 0 }); tl.set(dep, { opacity: 1 }, sm.tFull);
    const loan = X.svg('g', {}, cam);
    gsap.set(loan, { x: 1090, y: 540 });
    const loanIn = X.svg('g', {}, loan);
    IK.card(loanIn, { x: 0, y: 0, w: 130, kind: 'loan' });
    const ltag = IK.tag(loanIn, { x: -62, y: -110, h: 34, slots: 6 });
    IK.hover(depIn, sm.tClear + 0.3, tWhip2, { amp: 6, hz: 0.45 });
    IK.hover(loanIn, sm.tClear + 0.5, tWhip2, { amp: 6, hz: 0.45, phase: 2.2 });
    gsap.set(loan, { opacity: 0 }); tl.set(loan, { opacity: 1 }, sm.tFull);
    gsap.set([dtag, ltag], { scaleX: 0 });
    dtag.show(W('types', 'into') - 0.05);
    dtag.fill(W('types', 'account') - 0.05, 6, F(2));
    ltag.show(W('types', 'account') + 0.25);
    ltag.fill(W('types', 'account') + 0.4, 6, F(2), false);
    // "Nobody's savings shrink": pull back to show other savers, untouched
    const tSav = W('fresh', 'Nobody') - 0.1, ps = 0.6;
    IK.pullBack(cam, tSav, { scale: ps, x: 0, y: 120 });
    const sp = [[220, 640], [150, 840], [390, 985], [1530, 985], [1770, 840], [1700, 640]];
    sp.forEach(([sx, sy], i) => {
      const wx = 960 + (sx - 960) / ps, wy = 540 + (sy - 540 - 120) / ps;
      const sv = X.svg('g', {}, cam);
      gsap.set(sv, { x: wx, y: wy });
      (i % 2 ? IK.woman : IK.man)(sv, { x: 0, y: 0, h: 230 });
      const st = IK.tag(sv, { x: -62, y: -280, h: 40, slots: 4, start: 2 + (i % 3) });
      IK.focusIn(sv, tSav + F(9) + i * F(3));
      tl.fromTo(st, { scale: 1 }, { scale: 1.18, duration: F(4), yoyo: true, repeat: 1, ease: 'power1.inOut', immediateRender: false }, W('fresh', 'shrink') + i * F(2));
    });
    X.sfx(W('fresh', 'shrink'), 'tick', { gain: 0.2 });
    // "That deposit is brand-new money": glow ring on the card, then the slam stack
    const tDp = W('fresh', 'deposit') - 0.05;
    const ring = X.svg('circle', { cx: 700, cy: 407, r: 60, fill: 'none', stroke: C.white, 'stroke-width': 10, opacity: 0 }, cam);
    tl.fromTo(ring, { attr: { r: 50 }, opacity: 0.9 }, { attr: { r: 210 }, opacity: 0, duration: F(16), ease: 'power2.out', immediateRender: false }, tDp);
    tl.fromTo(dep, { scale: 1 }, { scale: 1.14, duration: F(5), yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false, transformOrigin: '50% 100%' }, tDp);
    X.sfx(tDp, 'sparkle', { gain: 0.35 });
    IK.slam(grp, [{ text: 'BRAND-NEW', t: W('fresh', 'brand') + 0.1, x: 960, y: 300, size: 96, from: 6 },
      { text: 'MONEY', t: W('fresh', 'money') + 0.08, x: 960, y: 466, size: 178, from: 7 }]);
    IK.whipOut(grp, tWhip2);
    IK.creep(g, tChap, tWhip2, { cx: 960, cy: 620, rate: 0.007 });
  }, world);

  // ================================================================== H. the flow chain: pay → deposit moves → banks settle in reserves at the central bank
  const tWhite = L('limits').start - 0.42;
  X.scene('flow', tWhip2 + F(3), tWhite + F(13), (g) => {
    const cam = X.cam(X.svg('g', {}, g));
    const Y = 600, tIn = tWhip2 + F(4);
    const fam = IK.family(cam, { x: 352, y: Y, h: 190 });
    const bA = IK.bank(cam, { x: 790, y: Y, w: 250, label: 'THEIR BANK' });
    const bB = IK.bank(cam, { x: 1190, y: Y, w: 250, label: "BUILDER'S BANK" });
    const hs = IK.house(cam, { x: 1512, y: Y, w: 176 });
    const sg = IK.sign(cam, { x: 1622, y: Y, h: 104 });
    const bld = IK.builder(cam, { x: 1730, y: Y, h: 192 });
    [...fam.members, bA, bB, hs, sg, bld].forEach((el, i) => IK.focusIn(el, tIn + i * F(2), { sfx: i === 0 ? 'pop' : false }));
    const dep = X.svg('g', {}, cam);
    gsap.set(dep, { x: 352, y: 356 });
    const fdIn = X.svg('g', {}, dep);
    IK.card(fdIn, { x: 0, y: 0, w: 108 });
    IK.tag(fdIn, { x: 64, y: -40, h: 28, slots: 6, start: 6 });
    IK.hover(fdIn, tIn + 0.6, tWhite, { amp: 6, hz: 0.42 });
    IK.focusIn(dep, tIn + F(10), { origin: '50% 50%' });
    // pays
    const tPay = W('pay', 'pays') - 0.04;
    IK.bar(cam, 498, 520, 652, 520, tPay, { w: 12 });
    IK.travel(dep, [[352, 356], [570, 300], [790, 350]], tPay + F(4), F(18), { curviness: 1.2 });
    // the builder: FOR SALE → SOLD, a little house travels to the family
    const tB = W('pay', 'builder') - 0.02;
    tl.to(sg, { scaleX: 0, duration: F(3), ease: 'power2.in', transformOrigin: '50% 50%' }, tB);
    tl.set(sg.txt, { textContent: 'SOLD' }, tB + F(3));
    tl.to(sg, { scaleX: 1, duration: F(4), ease: 'back.out(2)' }, tB + F(3));
    X.sfx(tB, 'ding', { gain: 0.3 });
    const mini = IK.house(cam, { x: 1512, y: 750, w: 74 });
    IK.popIn(mini, tB + F(4), { sfx: false });
    IK.hover(mini, tB + 1.2, tWhite, { amp: 4, hz: 0.5, phase: 1 });
    IK.travel(mini, [[1512, 750], [880, 790], [236, 744]], tB + F(8), F(22), { curviness: 0.8 });
    // the deposit moves to the builder's bank
    const tMove = W('pay', 'moves') - 0.06;
    IK.bar(cam, 926, 520, 1054, 520, tMove, { w: 12 });
    IK.travel(dep, [[790, 350], [990, 290], [1190, 350]], tMove + F(3), F(18), { curviness: 1.2 });
    IK.bar(cam, 1326, 520, 1416, 520, W('pay', 'builder', 1) - 0.02, { w: 12 });
    // settle up in reserves at the central bank (camera tilts down to reveal it)
    const tSet = W('settle', 'two') - 0.1;
    IK.pullBack(cam, tSet, { scale: 1, x: 0, y: -168, dur: F(16) });
    const cb = IK.centralBank(cam, { x: 990, y: 1112, w: 400, labelBelow: true, label: 'CENTRAL BANK', labelSize: 30, labelDy: 40 });
    IK.focusIn(cb, tSet + F(6), { sfx: 'pop' });
    const tSU = W('settle', 'settle') - 0.04;
    IK.route(cam, [[740, 662], [740, 1010], [782, 1010]], tSU, { w: 12, dur: F(9) });
    IK.route(cam, [[1198, 1010], [1240, 1010], [1240, 664]], tSU + F(5), { w: 12, dur: F(9), arrow: true });
    const coin = IK.coin(cam, { x: 740, y: 662, w: 58 });
    IK.popIn(coin, W('settle', 'reserves') - 0.12, { origin: '50% 50%', sfx: 'coin', gain: 0.4 });
    IK.travel(coin, [[740, 662], [740, 1010], [990, 1010], [1240, 1010], [1240, 664]], W('settle', 'reserves') + 0.12, F(30), { ease: 'power1.inOut', sfx: false });
    X.sfx(W('settle', 'reserves') + 0.12 + F(30), 'ding', { gain: 0.35 });
    tl.fromTo(cb, { scale: 1 }, { scale: 1.05, duration: F(5), yoyo: true, repeat: 1, ease: 'power1.inOut', immediateRender: false, transformOrigin: '50% 100%' }, W('settle', 'central') - 0.04);
    // "So what stops banks lending forever?" — a corner figure asks (T9); bank A keeps issuing cards
    const asker = IK.man(g, { x: 1720, y: 930, h: 80, shadow: false });
    IK.focusIn(asker, tStop - 0.1, { blur: 6 });
    IK.bubble(g, 'WHAT STOPS THIS?', tStop + 0.08, { x: 1688, y: 842, size: 40 });
    const tLend = W('stop', 'lending') - 0.08;
    for (let i = 0; i < 9; i++) {
      const a = Math.PI * (1.08 + i * 0.105), R = 250;
      const c = IK.card(cam, { x: 790 + Math.cos(a) * R * 1.15, y: 520 + Math.sin(a) * R * 0.95, w: 74 });
      IK.popIn(c, tLend + i * F(2.5), { origin: '50% 50%', sfx: i % 2 ? false : 'blip_up', gain: 0.16, pitch: 1 + i * 0.06 });
      IK.hover(c, tLend + 0.3 + i * F(2.5), tWhite + 0.4, { amp: 5, hz: 0.7, phase: i });
    }
    // the inverted ground blooms from bank A
    IK.iris(whiteL, 790, 250, tWhite, { dur: F(13) });
    IK.creep(g, tWhip2, tWhite + F(13), { cx: 960, cy: 560, rate: 0.007 });
  }, world);

  // ================================================================== I. white ground (T14): what limits lending
  const tBack = L('repay').start - 0.62;
  X.scene('limits', tWhite + F(12), tBack + F(4), (g) => {
    const ink = { fill: 'ink' };
    const t0 = tWhite + F(13);
    // the chain as small green icons across ~55 % W
    const ch = [IK.family(g, { x: 545, y: 400, h: 92, ...ink }).g, IK.bank(g, { x: 790, y: 400, w: 104, ...ink }), IK.bank(g, { x: 1030, y: 400, w: 104, ...ink }),
      IK.house(g, { x: 1262, y: 400, w: 84, ...ink }), IK.builder(g, { x: 1372, y: 400, h: 92, ...ink })];
    ch.forEach((el, i) => IK.focusIn(el, t0 + i * F(2), { blur: 8 }));
    [[612, 718], [852, 968], [1092, 1200]].forEach(([a, b], i) => IK.bar(g, a, 366, b, 366, t0 + F(4) + i * F(3), { w: 8, color: C.ink, sfx: false }));
    // 1 · borrowers who can repay
    const f1 = IK.family(g, { x: 560, y: 790, h: 158, noDog: true, ...ink });
    IK.focusIn(f1.g, W('limits', 'Borrowers') - 0.08, { blur: 8, sfx: 'pop' });
    const ck = IK.check(g, { x: 702, y: 590, w: 62, ...ink });
    IK.popIn(ck, W('limits', 'repay') - 0.04, { origin: '50% 50%', sfx: 'ding', gain: 0.3 });
    IK.hover(ck, W('limits', 'repay') + 0.4, tBack, { amp: 5, hz: 0.6 });
    const lab = (txt, x, t) => { const e = IK.labelBelow(g, txt, x, 862, { fill: 'ink', labelSize: 36 }); IK.focusIn(e, t, { origin: '50% 50%', blur: 6 }); };
    lab('CAN THEY REPAY?', 560, W('limits', 'Borrowers') + 0.2);
    // 2 · capital rules
    const tCap = W('limits', 'capital') - 0.06;
    const br = IK.bricks(g, { x: 960, y: 790, w: 210, ...ink });
    IK.popIn(br, tCap, { sfx: 'thud', gain: 0.3 });
    const cbk = IK.bank(g, { x: 960, y: 722, w: 168, ...ink });
    IK.dropIn(cbk, tCap + F(5), { dy: 160, sfx: 'drop' });
    lab('CAPITAL RULES', 960, tCap + F(8));
    // 3 · the central bank's interest rate
    const cbi = IK.centralBank(g, { x: 1310, y: 790, w: 190, label: false, ...ink });
    IK.focusIn(cbi, W('limits', 'central') - 0.08, { blur: 8, sfx: 'pop' });
    const dl = IK.dial(g, { x: 1466, y: 790, w: 104, ...ink });
    IK.popIn(dl, W('limits', 'interest') - 0.1, { sfx: 'pop' });
    IK.hover(f1.child, W('limits', 'Borrowers') + 0.3, tBack, { amp: 4, hz: 1.1 });
    tl.fromTo(dl.needle, { rotation: -60 }, { rotation: 38, duration: F(14), ease: 'back.out(2.2)', immediateRender: false }, W('limits', 'rate') - 0.1);
    X.sfx(W('limits', 'rate') - 0.1, 'tick', { gain: 0.25 });
    lab('INTEREST RATE', 1385, W('limits', 'interest') + 0.05);
    // dotted links from each limit up to the lending bank
    [[600, 612, 778, 440], [930, 556, 800, 446], [1330, 612, 822, 440]].forEach(([x1, y1, x2, y2], i) =>
      IK.trail(g, x1, y1, x2, y2, [W('limits', 'repay'), tCap + 0.3, W('limits', 'rate')][i] + 0.15, { n: 7, r0: 4, r1: 4, fill: C.ink, step: F(1.2), sfx: false }));
    // leave: everything focuses out, then the white shrinks to a point
    tl.to(g, { opacity: 0, filter: 'blur(8px)', duration: F(6), ease: 'power2.in' }, tBack - F(8));
    IK.creep(g, tWhite + F(12), tBack, { cx: 960, cy: 600, rate: 0.01 });
  }, whiteW);
  const irisEl = whiteL.querySelector('circle');
  IK.iris(whiteL, 960, 540, tBack, { el: irisEl, open: false, dur: F(13) });

  // ================================================================== J. over the years: the loan is repaid and that money disappears; go dark (T15)
  const tBurst = L('loop').start - 1.25;
  X.scene('repay', tBack - F(2), tBurst + F(10), (g) => {
    const yrs = X.svg('g', {}, g);
    const tY = Math.max(tBack + F(14), W('repay', 'Over') - 0.12);
    IK.text(yrs, 'YEARS', { x: 830, y: 600, size: 130, ls: '0.08em' });
    const sw = IK.stopwatch(yrs, { x: 1210, y: 548, w: 150 });
    IK.dropIn(yrs, tY, { dy: 280, sfx: 'drop' });
    tl.fromTo(sw.hand, { rotation: 0 }, { rotation: 720, duration: 0.95, ease: 'power1.inOut', immediateRender: false }, tY + F(5));
    for (let i = 0; i < 8; i++) X.sfx(tY + F(5) + i * 0.12, i % 2 ? 'tock' : 'tick', { gain: 0.18 });
    const tSwap = W('repay', 'the', 1) - 0.08;
    IK.liftOut(yrs, tSwap, { sfx: false });
    // the family and the bank, each with a tag of the same size
    const set = X.svg('g', {}, g);
    const fam = IK.family(set, { x: 540, y: 790, h: 300 });
    const bank = IK.bank(set, { x: 1380, y: 790, w: 380, label: 'THEIR BANK', labelSize: 34, labelDy: 46 });
    const DX = 690, DY = 452, LX = 1100, LY = 540;
    const dep = X.svg('g', {}, set); gsap.set(dep, { x: DX, y: DY });
    IK.card(dep, { x: 0, y: 0, w: 120 });
    IK.hover(fam.child, tSwap + 0.4, tBurst, { amp: 4, hz: 1.0 });
    const dtag = IK.tag(dep, { x: 70, y: -44, h: 34, slots: 6, start: 6 });
    const loan = X.svg('g', {}, set); gsap.set(loan, { x: LX, y: LY });
    IK.card(loan, { x: 0, y: 0, w: 130, kind: 'loan' });
    const ltag = IK.tag(set, { x: LX - 62, y: LY - 112, h: 34, slots: 6, start: 6 });
    IK.dropIn(set, tSwap + F(2), { dy: 300, sfx: 'drop' });
    // repayments: a block leaves the family's tag, flies to the loan, and both vanish
    const t1 = W('repay', 'repays') - 0.05, step = 0.5;
    const from = [DX + 70 + 34 * 0.3 + 34 * 0.62, DY - 44], to = [LX - 62 + 34 * 0.3 + 34 * 0.62, LY - 112];
    const glowF = X.glow('ikBlockGlow', 6, '#fff7c0', 0.9);
    for (let i = 0; i < 6; i++) {
      const t = t1 + i * step, slot = 5 - i;
      const bx = 34 * 0.55 + 34 * 0.16;
      const fl = X.svg('rect', { x: -9, y: -10, width: 18.7, height: 20.4, rx: 2.7, fill: C.cream }, set);
      gsap.set(fl, { x: from[0] + slot * bx + 9, y: from[1], opacity: 0 });
      if (i >= 4) fl.setAttribute('filter', glowF);
      dtag.drain(t, 1, 0);
      tl.set(fl, { opacity: 1 }, t);
      tl.to(fl, { x: to[0] + slot * bx + 9, y: to[1] - 30, duration: F(9), ease: 'power2.inOut' }, t);
      tl.to(fl, { y: to[1], duration: F(3), ease: 'power2.in' }, t + F(9));
      if (i < 5) {
        tl.to(fl, { opacity: 0, scale: 2.2, duration: F(5), ease: 'power2.out', transformOrigin: '50% 50%' }, t + F(12));
        ltag.drain(t + F(12), 1, 0);
        X.sfx(t + F(12), 'blip_down', { gain: 0.22, pitch: 1 - i * 0.05 });
      } else {
        // the last one glows in the dark, then pops on "disappears"
        const tD = W('repay', 'disappears') + 0.12;
        ltag.drain(t + F(12), 1, 0);
        tl.to(fl, { opacity: 0, scale: 3.2, duration: F(10), ease: 'power2.out', transformOrigin: '50% 50%' }, tD);
        X.sfx(tD, 'sparkle', { gain: 0.35 });
      }
      X.sfx(t, 'swoosh', { gain: 0.12, pitch: 1.3 });
    }
    // the loan card shrinks with every payment
    tl.to(loan, { scale: 0.45, duration: step * 5, ease: 'none', transformOrigin: '50% 100%' }, t1 + F(12));
    tl.to(loan, { scale: 0, opacity: 0, duration: F(8), ease: 'back.in(2)' }, W('repay', 'disappears') + 0.15);
    // go dark: the field fades to black; the cast dims; a few faint dots remain
    const tDark = W('repay', 'money') - 0.08;
    IK.dark(bg, tDark, { el: darkR, dur: F(12) });
    tl.to(set, { opacity: 0.3, duration: F(12), ease: 'power1.inOut' }, tDark);
    const rnd = X.rand(44);
    for (let i = 0; i < 14; i++) {
      const d = X.svg('circle', { cx: 120 + rnd() * 1680, cy: 140 + rnd() * 800, r: 2 + rnd() * 3, fill: '#f4f0d0', opacity: 0 }, g);
      d.setAttribute('filter', glowF);
      tl.fromTo(d, { opacity: 0 }, { opacity: 0.4 + rnd() * 0.5, duration: F(10), immediateRender: false }, tDark + F(14) + rnd() * 0.6);
    }
    // starburst wipe out of the dark
    IK.burst(fx, 960, 520, tBurst, { offsets: [[0, 0, 1], [-260, 90, 0.6], [250, -100, 0.55]], R: 160, scale: 4.4, hold: F(4), fade: F(10), seed: 9 });
    IK.smoke(fx, 960, 540, tBurst + F(2), { n: 36, sx: 860, sy: 460, rMin: 140, rMax: 280, grow: F(8), hold: 0, clear: F(13), seed: 13, sfx: false });
    IK.dark(bg, tBurst + F(8), { el: darkR, from: 1, to: 0, dur: F(8) });
    IK.creep(g, tBack, tBurst + F(10), { cx: 960, cy: 600, rate: 0.01 });
  }, world);

  // ================================================================== K. the loop closes: lend → spend → settle → repay, round and round → crest
  const tFade = END - 2.25;
  X.scene('loop', tBurst + F(9), END, (g) => {
    const CX = 960, CY = 556, R = 292;
    const ring = X.svg('g', {}, g);
    gsap.set(ring, { svgOrigin: `${CX} ${CY}` });
    const nodes = [];
    const pts = [[CX, CY - R], [CX + R, CY], [CX, CY + R], [CX - R, CY]];
    const labels = ['LEND', 'SPEND', 'SETTLE', 'REPAY'];
    const lpos = [[CX, CY - R - 122], [CX + R + 170, CY], [CX, CY + R + 128], [CX - R - 170, CY]];
    pts.forEach(([x, y], i) => {
      const n = X.svg('g', {}, ring);
      gsap.set(n, { x, y, svgOrigin: '0 0' });
      if (i === 0) { IK.bank(n, { x: -20, y: 52, w: 128 }); IK.card(n, { x: 64, y: 40, w: 56 }); }
      if (i === 1) IK.house(n, { x: 0, y: 54, w: 118 });
      if (i === 2) { IK.bank(n, { x: -66, y: 48, w: 80 }); IK.bank(n, { x: 66, y: 48, w: 80 }); IK.coin(n, { x: 0, y: 4, w: 44 }); }
      if (i === 3) { IK.card(n, { x: 0, y: 40, w: 96, kind: 'loan' }); }
      IK.focusIn(n, tBurst + F(18) + i * F(3), { origin: '50% 50%' });
      [...n.children].forEach((ch) => ch.inner && IK.hover(ch, tBurst + 0.9, W('loop', 'Round') + 0.3, { amp: 5, hz: 0.55, phase: i * 1.3 }));
      const lg = X.svg('g', {}, ring);
      gsap.set(lg, { x: lpos[i][0], y: lpos[i][1], svgOrigin: '0 0' });
      const lb = IK.text(lg, labels[i], { x: 0, y: 16, size: 46, ls: '0.08em' });
      nodes.push({ n, lb, lg });
    });
    const words = [W('loop', 'Lend'), W('loop', 'spend'), W('loop', 'settle'), W('loop', 'repay')];
    nodes.forEach(({ lb }, i) => IK.slam(g, [{ el: lb, t: words[i] + 0.06, from: 4, gain: 0.3, pitch: 1 + i * 0.06 }]));
    // arcs clockwise between the stations; the last one closes the loop
    const arcD = (a0, a1) => { const p0 = [CX + R * Math.cos(a0), CY + R * Math.sin(a0)], p1 = [CX + R * Math.cos(a1), CY + R * Math.sin(a1)]; return `M${p0[0].toFixed(1)},${p0[1].toFixed(1)} A${R},${R} 0 0 1 ${p1[0].toFixed(1)},${p1[1].toFixed(1)}`; };
    const gap = 0.42;
    for (let i = 0; i < 4; i++) {
      const a0 = -Math.PI / 2 + i * (Math.PI / 2) + gap, a1 = a0 + Math.PI / 2 - 2 * gap;
      const tA = i < 3 ? words[i] + 0.1 : W('loop', 'Round') - 0.05;
      IK.route(ring, null, tA, { d: arcD(a0, a1), w: 13, dur: F(9), arrow: true });
    }
    // round and round: the ring turns, stations stay upright
    const tR = W('loop', 'Round') + 0.25, dR = tFade - tR + 0.3;
    tl.fromTo(ring, { rotation: 0 }, { rotation: 180, duration: dR, ease: 'sine.inOut', immediateRender: false }, tR);
    nodes.forEach(({ n, lg }) => tl.fromTo([n, lg], { rotation: 0 }, { rotation: -180, duration: dR, ease: 'sine.inOut', immediateRender: false }, tR));
    X.sfx(tR, 'woosh_low', { gain: 0.25, dur: 1.2 });
    // the crest reassembles in the middle on the title phrase
    const tC = W('close', 'making') - 0.12;
    const cr = X.svg('g', {}, g);
    const med = IK.crest(cr, tC - 0.25, { cx: CX, cy: CY - 30, scale: 0.62, l0: 'THE', l1: 'MAKING', size1: 46, l2: 'OF MONEY', ribbonW: 470, tRibbon: W('close', 'money') - 0.12, seed: 8 });
    [med.keys, med.flank, med.ped].flat().forEach((el) => el && el.remove());
    IK.creep(g, tBurst + F(9), END, { cx: CX, cy: CY, rate: 0.005 });
  }, world);

  // ------------------------------------------------------------------ fade to black + credits (green slab caps)
  const blk = X.svg('rect', { width: 1920, height: 1080, fill: C.black, opacity: 0 }, top);
  tl.fromTo(blk, { opacity: 0 }, { opacity: 1, duration: F(20), ease: 'power1.inOut', immediateRender: false }, tFade);
  const cred = X.svg('g', {}, top);
  [['NARRATION', 'KOKORO VOICE', 640], ['SCORE', 'SYNTHESIZED', 1290]].forEach(([a, b, x]) => {
    IK.text(cred, a, { x, y: 520, size: 24, fill: '#5f8a24', ls: '0.3em' });
    IK.text(cred, b, { x, y: 580, size: 44, fill: '#86bd2f', ls: '0.14em' });
  });
  gsap.set(cred, { opacity: 0 });
  tl.fromTo(cred, { opacity: 0 }, { opacity: 1, duration: F(8), immediateRender: false }, tFade + F(24));

  X.end(END);
});
