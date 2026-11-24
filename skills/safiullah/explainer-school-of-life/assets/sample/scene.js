/* "Our Small Museums" — an original essay film in the School-of-Life format (ink & cream look).
 * ident sting -> title -> intro (2 sentences) -> 3 numbered chapters (one drawn metaphor per sentence) -> quiet end card.
 * Everything on X.tl is sampled on twos (K.init); render with --fps 24.
 */
X.boot(async (X) => {
  await X.loadVO();
  K.init(X);
  const C = K.C, tl = X.tl;
  const W = (id, w, n = 0) => X.word(id, w, n);
  const S = (id) => X.line(id).start, E = (id) => X.line(id).end;
  const END = X.vo.duration || 74.7;

  /** scene = outer (travel) > cam (drift/zoom) ; visible in [t0,t1] */
  const scene = (name, t0, t1) => {
    const outer = X.scene(name, t0, t1, null, K.world);
    const cam = K.cam(X.svg('g', {}, outer));
    return { outer, cam };
  };
  const bgField = (g, col) => K.rect(g, -400, -400, 2720, 1880, col, { sw: 0 });
  const floor = (g, y = 960, col = C.floor) => { K.rect(g, -400, y, 2720, 600, col, { sw: 0 }); K.path(g, `M-400,${y}H2320`, "none"); };

  // ================================================================== 0. ident sting (original): dot rows build
  const sting = scene('sting', 0, 3.0);
  K.dotSting(sting.cam, 0.12);

  // ================================================================== title card
  const tTitleOut = W('hook', 'museum') - 0.55;
  const title = scene('title', 1.9, tTitleOut + 1.0);
  {
    K.wipeUp(title.cam, C.rose, 1.95, { seed: 4 });
    X.sfx(1.95, 'paper', { dur: 0.6, gain: 0.15 });
    const fr = K.path(title.cam, K.scallopD(960, 520, 1060, 400, 24), 'none', { stroke: C.tan, sw: 5 });
    X.drawOn(fr, 2.15, 1.1, 'power1.inOut');
    const t1 = K.text(title.cam, 960, 500, 'Our Small', { size: 104, fill: C.ultra });
    const t2 = K.text(title.cam, 960, 628, 'Museums', { size: 104, fill: C.ultra });
    tl.fromTo([t1, t2], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out', stagger: 0.12 }, 2.45);
    X.sfx(2.45, 'chime', { gain: 0.08, dur: 0.8 });
  }

  // ================================================================== S1 hook: a one-room museum, one curator
  const tS1 = tTitleOut;
  const tS2 = S('list') - 0.8;
  const s1 = scene('s1', tS1, tS2 + 1.0);
  K.travel(title.outer, s1.outer, tTitleOut, 0.9);
  {
    const g = s1.cam;
    bgField(g, C.rose);
    floor(g, 960, C.olive);
    K.rope(g, 330, 560, 960);
    const pl = K.plinth(g, 820, 960);
    K.pebble(pl.inside, 0, pl.top - 44, 30);
    const ada = K.figure(g, { pose: { x: 1150, y: 960, s: 0.9, turn: -0.55, la: -74, le: 32, ra: 26, re: -96, hd: -4 } });
    const rag = ada.attach(K.path(ada.hold, 'M-22,-14C-8,-24 14,-20 22,-8C26,6 12,18 -4,16C-18,14 -28,0 -22,-14Z', C.lilac, { sw: 5 }), 'l');
    K.wobble(ada, tS1 + 0.4, W('hook', 'visit') - 0.2, { la: 7, le: -9 }, 0.62);
    K.pose(ada, W('hook', 'visit') - 0.15, { turn: 0, smile: 0.7, la: -60, le: 30, hd: 0 }, 0.6);
    K.drift(s1.cam, tS1, tS2, { rate: 0.008 });
  }

  // ================================================================== S2 list: the drawer of kept things
  const s2 = scene('s2', tS2, S('c1') + 0.1);
  K.travel(s1.outer, s2.outer, tS2, 0.9);
  {
    const g = s2.cam;
    bgField(g, C.rose);
    floor(g, 960, C.olive);
    const ch = K.drawers(g, 960, 960, { w: 520, h: 520, fill: C.lilac, front: C.lilac, top: C.peri });
    const top = ch.drawers[0];
    tl.to(top.g, { y: 16, scaleX: 1.05, scaleY: 1.06, transformOrigin: '50% 50%', duration: 0.4, ease: 'power2.out' }, S('list') - 0.05);
    X.sfx(S('list') - 0.05, 'slide', { gain: 0.12, dur: 0.3 });
    const mouth = [960, 960 - 520 + 30];
    const items = [
      { w: 'ticket', x: 690, y: 290, make: (p) => K.ticket(p, 0, 0, { w: 190, h: 100, rot: -10 }) },
      { w: 'pebble', x: 960, y: 230, make: (p) => K.pebble(p, 0, 0, 44, { rot: 8 }) },
      { w: 'key', x: 1235, y: 300, make: (p) => K.key(p, -110, 0, { s: 0.85, rot: 14 }) },
    ];
    items.forEach((it, i) => {
      const bob = K.bobber(g, 4, 2.2 + i * 0.3, i * 1.7);
      const holder = X.svg('g', {}, bob);
      it.make(holder);
      const t = W('list', it.w) - 0.12;
      tl.fromTo(holder, { x: mouth[0], y: mouth[1] + 30, scale: 0 }, { x: it.x, y: it.y, scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, t);
      X.sfx(t, 'pop', { gain: 0.1, pitch: 0.8 + i * 0.12 });
    });
    K.drift(s2.cam, tS2, S('c1') + 0.1, { from: 1 + 0.008 * (tS2 - tS1), rate: 0.005 });
  }

  // ================================================================== -1- The Evidence
  const c1In = S('c1') - 0.5, c1Out = S('proof') - 0.45;
  K.card(c1In, c1Out, { n: 1, title: 'The Evidence', field: C.ultra, text: '#EF5B45', num: '#EF5B45', line: C.lilac, seed: 3 });

  // ================================================================== S3 clutter / proof: the stranger shrugs; the ticket becomes a window
  const tS4 = S('memory') - 0.75;
  const s3 = scene('s3', c1Out - 0.05, tS4 + 1.0);
  {
    const g = s3.cam;
    bgField(g, C.lilacBg);
    const bigHolder = X.svg('g', {}, g);
    const man = K.figure(g, { type: 'man', pose: { x: 560, y: 990, s: 0.84, lean: 9, turn: 0.5, la: -3, ra: 3, hd: 6 } });
    const ada = K.figure(g, { pose: { x: 1080, y: 990, s: 0.78, turn: -0.4, la: -36, le: -88, ra: 10, re: -6 } });
    const smallA = ada.attach(X.svg('g', {}, ada.hold), 'l', { dy: -30, rot: -8 });
    const small = X.svg('g', {}, smallA);
    K.ticket(small, 0, 0, { w: 150, h: 80 });
    const tClut = W('proof', 'clutter');
    K.pose(man, tClut - 0.35, { lean: 0, la: -24, le: -72, ra: 24, re: 72, bob: -6, hd: -10, turn: 0.2 }, 0.45);
    K.keyword(g, 820, 290, 'Clutter', tClut - 0.1, { size: 76, fill: C.terracotta, out: W('proof', 'To', 1) });
    const tUs = W('proof', 'To', 1);
    K.set(man, tUs, { flip: -1, turn: 1, la: -6, le: 6, ra: 6, re: -6, bob: 0, hd: 0, lean: 0 });
    K.walk(man, tUs, tUs + 2.2, { speed: 360, dir: -1, cycle: 0.9 });
    // the giant ticket held overhead, with a remembered afternoon inside it
    const tProof = W('proof', 'proof');
    tl.to(small, { scale: 0, duration: 0.3, ease: 'power1.in', transformOrigin: '50% 50%' }, tProof - 0.25);
    K.pose(ada, tProof - 0.35, { la: -150, le: -22, ra: 150, re: 22, turn: 0, hd: 0, smile: 0.5 }, 0.6);
    const big = K.at(bigHolder, 1080, 196);
    const tw = 560, th = 300;
    K.path(big, `M${-tw / 2},${-th / 2}H${tw / 2}V-24A24,24 0 0 0 ${tw / 2},24V${th / 2}H${-tw / 2}V24A24,24 0 0 0 ${-tw / 2},-24Z`, C.ticket);
    K.path(big, `M${tw / 2 - 92},${-th / 2 + 14}V${th / 2 - 14}`, 'none', { sw: 4 }).setAttribute('stroke-dasharray', '10 10');
    K.circle(big, tw / 2 - 46, 0, 18, C.red, { sw: 4 });
    const win = K.frame(big, -46, 0, 390, 220, { border: 0, bg: C.sky });
    const sea = K.seaside(win.inner, 390, 220, { sw: 4 });
    const bx = K.xf(big, 0, 150, { s: 0.25, y: 120 });
    tl.to(bx, { s: 1, y: 0, duration: 0.6, ease: 'power2.out' }, tProof - 0.1);
    gsap.set(big, { opacity: 0 });
    tl.to(big, { opacity: 1, duration: 0.25, ease: 'none' }, tProof - 0.1);
    const tAft = W('proof', 'afternoon');
    tl.fromTo(sea.sun, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 0.45, ease: 'back.out(1.6)' }, tAft - 0.1);
    tl.fromTo(sea.sea, { y: 80 }, { y: 0, duration: 0.6, ease: 'power2.out' }, tAft - 0.3);
    tl.fromTo(sea.um, { scale: 0, transformOrigin: '50% 100%' }, { scale: 1, duration: 0.4, ease: 'back.out(1.4)' }, W('proof', 'happened') - 0.1);
    X.sfx(tAft - 0.1, 'chime', { gain: 0.06, dur: 0.6 });
    K.drift(s3.cam, c1Out, tS4 + 1.0, { rate: 0.007 });
  }

  // ================================================================== S4 memory: a poor archivist (fades, edits, flatters)
  const tS5 = S('stone') - 0.04;
  const s4 = scene('s4', tS4, tS5);
  K.travel(s3.outer, s4.outer, tS4, 0.9, 0, -1080);
  {
    const g = s4.cam;
    bgField(g, C.lilacBg);
    const pr = K.profile(g, 700, 560, 1.0);
    gsap.set(pr.fill, { opacity: 0 });
    tl.to(pr.fill, { opacity: 1, duration: 0.6, ease: 'none' }, tS4 + 0.7);
    X.drawOn(pr.line, tS4 + 0.2, 1.2, 'power1.inOut');
    const f1 = K.frame(g, 560, 420, 150, 110, { color: C.tan });
    const p1 = K.seaside(f1.inner, 150, 110, { sw: 3, umbrella: false });
    const f2 = K.frame(g, 760, 400, 120, 150, { color: C.peri });
    K.rect(f2.inner, -60, 20, 120, 60, C.olive, { sw: 0 });
    K.path(f2.inner, 'M-30,30L-30,-10L0,-34L30,-10L30,30Z', C.terracotta, { sw: 3 });
    K.rect(f2.inner, -8, 8, 16, 22, C.ink, { sw: 0 });
    const scrib = K.path(f2.inner, 'M-50,-40L40,-10L-44,10L46,34L-36,52', 'none', { stroke: C.ink, sw: 5 });
    const f3 = K.frame(g, 640, 590, 150, 120, { color: C.olive });
    const port = X.svg('g', {}, f3.inner);
    K.path(port, 'M-40,70C-40,20 40,20 40,70Z', C.red, { sw: 3 });
    K.circle(port, 0, 2, 20, C.skin, { sw: 3 });
    K.path(port, 'M-20,-6C-22,-30 22,-30 20,-6C10,-18 -10,-18 -20,-6Z', C.ink, { sw: 2 });
    const crown = K.path(port, 'M-18,-26L-18,-46L-8,-36L0,-50L8,-36L18,-46L18,-26Z', C.ochre, { sw: 3 });
    [f1, f2, f3].forEach((f, i) => X.pop(f.g, tS4 + 0.6 + i * 0.18, { scale: 1, dur: 0.4, ease: 'back.out(1.3)', sfx: false }));
    K.keyword(g, 1440, 470, 'Memory', W('memory', 'Memory') - 0.1, { size: 84, fill: C.ultra });
    tl.to(p1.g, { opacity: 0.12, duration: 0.8, ease: 'power1.inOut' }, W('memory', 'fades') - 0.1);
    X.drawOn(scrib, W('memory', 'edits') - 0.05, 0.45, 'power1.inOut');
    X.sfx(W('memory', 'edits') - 0.05, 'scribble', { gain: 0.1, dur: 0.45 });
    tl.to(port, { scale: 1.18, transformOrigin: '50% 100%', duration: 0.5, ease: 'back.out(1.5)' }, W('memory', 'flatters') - 0.1);
    gsap.set(crown, { scale: 0, transformOrigin: '50% 100%' });
    tl.to(crown, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, W('memory', 'flatters') + 0.05);
    X.sfx(W('memory', 'flatters') + 0.05, 'ding', { gain: 0.05, pitch: 1.2 });
    K.drift(s4.cam, tS4 + 0.9, tS5, { rate: 0.008 });
  }

  // ================================================================== S5 stone: the stone that settles the argument (hard cut)
  const c2In = S('c2') - 0.5, c2Out = S('grip') - 0.45;
  const s5 = scene('s5', tS5, c2In + 0.5);
  {
    const g = s5.cam;
    K.rect(g, -100, -100, 2120, 1280, C.tan, { sw: 0 });
    const sheets = [];
    [[-9, 930, 600], [5, 975, 585], [-2, 955, 600]].forEach(([r, x, y], i) => {
      const sg = K.at(g, x, y, 1, r);
      const flap = X.svg('g', {}, sg);
      K.rect(flap, -190, -240, 380, 480, i === 2 ? C.white : C.light);
      for (let k = 0; k < 7; k++) K.path(flap, `M-140,${-170 + k * 50}H${110 - (k % 3) * 40}`, 'none', { sw: 4, stroke: '#6b6359' });
      sheets.push(flap);
    });
    const tLand = W('stone', 'hand') - 0.1;
    K.every((tq) => {
      sheets.forEach((sh, i) => {
        const on = tq < tLand ? 1 : Math.max(0, 1 - (tq - tLand) / 0.25);
        const a = on * (i === 0 ? 0 : 3.2) * Math.sin(tq * 2 * Math.PI * (1.6 + i * 0.4) + i);
        const sk = on * (i === 0 ? 0 : 2.5) * Math.sin(tq * 2 * Math.PI * (1.6 + i * 0.4) + i + 1.2);
        sh.setAttribute('transform', `rotate(${a.toFixed(2)}) skewX(${sk.toFixed(2)})`);
      });
    });
    const stone = K.at(g, 960, 560);
    K.path(stone, K.pebbleD(110), C.stone);
    K.path(stone, 'M-62,-22Q-44,-58 -4,-58', 'none', { stroke: C.white, sw: 9 });
    tl.fromTo(stone, { scale: 1.55, y: -90 }, { scale: 1, y: 0, duration: 0.3, ease: 'power2.in', transformOrigin: '50% 50%' }, tLand - 0.3);
    X.sfx(tLand, 'thud', { gain: 0.25, dur: 0.4 });
    // the hand that let go (sleeve from the top edge)
    const hand = K.at(g, 0, 0);
    K.path(hand, K.limbD([[1330, -160], [1180, 120], [1080, 300]], [130, 120, 110]), C.ochre);
    K.path(hand, 'M1010,280C990,330 1000,400 1050,420C1100,440 1150,410 1160,360C1170,320 1150,290 1120,280Z', C.skin);
    K.path(hand, 'M1030,300C1000,300 984,330 994,354', 'none', { sw: 5 });
    tl.fromTo(hand, { y: -60 }, { y: 0, duration: 0.6, ease: 'power2.out' }, tS5);
    tl.to(hand, { y: -520, x: 160, duration: 0.7, ease: 'power2.in' }, tLand - 0.05);
    const mk = K.marks(g, 960, 560, { angles: [-130, -100, -70, 70, 100, 130], r0: 135, r1: 175, sw: 6 });
    gsap.set(mk, { opacity: 0 });
    tl.set(mk, { opacity: 1 }, tLand + 0.04);
    tl.set(mk, { opacity: 0 }, tLand + 0.5);
    tl.set(mk, { opacity: 1 }, W('stone', 'argued') - 0.05);
    tl.set(mk, { opacity: 0 }, W('stone', 'argued') + 0.5);
    K.drift(s5.cam, tS5, c2In + 0.5, { rate: 0.009 });
  }

  // ================================================================== -2- Holding On
  K.card(c2In, c2Out, { n: 2, title: 'Holding On', field: C.terracotta, text: '#F3E6D6', num: '#E9A7A0', line: '#E9A7A0', seed: 8 });

  // ================================================================== S6 grip + S7 summer: the hug, then the memory balloon floats off
  const tS8 = S('carry') - 0.8;
  const s6 = scene('s6', c2Out - 0.05, tS8 + 1.0);
  {
    const g = s6.cam;
    bgField(g, C.sage);
    const FS = 1.42;
    const ada = K.figure(g, { lw: 8, pose: { x: 900, y: 1220, s: FS, la: 6, le: 104, ra: -14, re: -108, blink: 1, hd: 7 } });
    const keyG = X.svg('g', {}, ada.mid);
    K.key(keyG, -78, -140, { s: 0.95, rot: 42, sw: 8 / FS });
    const tTight = W('grip', 'tightly');
    K.pose(ada, tTight - 0.2, { le: 112, re: -116, bob: 5, hd: 10 }, 0.35, 'power2.out');
    const m1 = K.marks(g, 760, 600, { angles: [-60, -90, -120], r0: 60, r1: 110, sw: 7 });
    const m2 = K.marks(g, 1050, 600, { angles: [60, 90, 120], r0: 60, r1: 110, sw: 7 });
    gsap.set([m1, m2], { opacity: 0 });
    tl.set([m1, m2], { opacity: 1 }, tTight);
    tl.set([m1, m2], { opacity: 0 }, tTight + 0.42);
    tl.set([m1, m2], { opacity: 1 }, tTight + 0.58);
    tl.set([m1, m2], { opacity: 0 }, tTight + 0.92);
    // the key becomes a pebble in the open palm; a balloon of one summer is tied to it
    const tS7 = S('summer') - 0.15;
    tl.to(keyG, { scale: 0, opacity: 0, duration: 0.35, ease: 'power1.in', transformOrigin: '50% 50%' }, tS7);
    K.pose(ada, tS7, { la: -8, le: 6, ra: 12, re: 74, blink: 0, hd: -6, turn: 0.45, bob: 0 }, 0.6);
    const tGo = W('summer', 'goes') - 0.05;
    const rise = { x: 0, y: 0 };
    const hb = ada.handFor('r', { la: -8, le: 6, ra: 12, re: 74, hd: -6, turn: 0.45, bob: 0 });
    const base = [hb[0] + 6, hb[1] - 30 * FS / 0.86];
    const B0 = [base[0] + 200, base[1] - 380];
    const balloon = K.at(g, B0[0], B0[1]);
    const bubR = 165;
    const bub = X.svg('g', {}, balloon);
    const bclip = X.svg('clipPath', { id: 'bclip' }, X.defs); X.svg('circle', { cx: 0, cy: 0, r: bubR }, bclip);
    const binner = X.svg('g', { 'clip-path': 'url(#bclip)' }, bub);
    const bs = K.seaside(binner, 350, 350, { sw: 5 });
    const pers = X.svg('g', { transform: 'translate(40,64)' }, binner);
    K.path(pers, 'M-16,40L-10,0L10,0L16,40Z', C.peri, { sw: 3 });
    K.circle(pers, 0, -12, 11, C.skin, { sw: 3 });
    K.circle(bub, 0, 0, bubR, 'none', { sw: 6 });
    gsap.set(bub, { scale: 0, transformOrigin: '50% 50%' });
    tl.to(bub, { scale: 1, duration: 0.55, ease: 'back.out(1.3)' }, tS7 + 0.75);
    X.sfx(tS7 + 0.75, 'bubble', { gain: 0.08 });
    const peb = X.svg('g', {}, g);
    K.path(peb, K.pebbleD(46), C.stone, { sw: 8 });
    K.path(peb, 'M-25,-9Q-18,-23 -2,-24', 'none', { stroke: C.white, sw: 6 });
    gsap.set(peb, { opacity: 0 });
    tl.set(peb, { opacity: 1 }, tS7 + 0.25);
    const str = K.path(g, '', 'none', { sw: 4 });
    const strOn = { k: 0 };
    tl.to(strOn, { k: 1, duration: 0.5, ease: 'power1.inOut' }, tS7 + 0.45);
    K.after((tq) => {
      const h = ada.handAt('r');
      const p0 = tq < tGo ? [h[0] + 6, h[1] - 30 * FS / 0.86] : [base[0] + rise.x, base[1] + rise.y];
      peb.setAttribute('transform', `translate(${p0[0].toFixed(1)},${p0[1].toFixed(1)})`);
      balloon.parentNode.setAttribute('transform', `translate(${(B0[0] + rise.x).toFixed(1)},${(B0[1] + rise.y).toFixed(1)})`);
      const b = [B0[0] + rise.x, B0[1] + rise.y + bubR];
      const m = [(p0[0] + b[0]) / 2 + 40, (p0[1] + b[1]) / 2];
      const e = [p0[0] + (b[0] - p0[0]) * strOn.k, p0[1] + (b[1] - p0[1]) * strOn.k];
      const mm = [p0[0] + (m[0] - p0[0]) * strOn.k, p0[1] + (m[1] - p0[1]) * strOn.k];
      str.setAttribute('d', strOn.k > 0.01 ? `M${p0[0].toFixed(1)},${(p0[1] - 20).toFixed(1)}Q${mm[0].toFixed(1)},${mm[1].toFixed(1)} ${e[0].toFixed(1)},${e[1].toFixed(1)}` : '');
    });
    tl.to(rise, { x: 240, y: -900, duration: E('summer') + 0.5 - tGo, ease: 'power1.in' }, tGo);
    K.pose(ada, tGo + 0.1, { ra: 158, re: 14, hd: -14, turn: 0.3 }, 0.8);
    K.pose(ada, E('summer') + 0.1, { ra: 12, re: -6, hd: -10, turn: 0.2 }, 0.9);
    K.drift(s6.cam, c2Out, tS8 + 1.0, { rate: 0.006 });
    void bs;
  }

  // ================================================================== S8 carry: walking past the museum under a chest of drawers
  const c3In = S('c3') - 0.5, c3Out = S('door') - 0.45;
  const s8 = scene('s8', tS8, c3In + 0.5);
  K.travel(s6.outer, s8.outer, tS8, 0.9);
  {
    const g = s8.cam;
    bgField(g, C.sage);
    K.path(g, 'M-300,1000L-300,900C0,780 420,770 760,900C900,950 1000,980 1100,1000Z', C.olive);
    floor(g, 960, C.oliveDk);
    K.museum(g, 300, 905, 0.8);
    const ada = K.figure(g, { pose: { x: 640, y: 960, s: 0.72, turn: 1, lean: 9, la: 12, le: 108, ra: 16, re: 104, wind: 0.6 } });
    const ch = K.drawers(ada.tback, -132, -6, { w: 250, h: 380, n: 4 });
    K.path(ada.mid, 'M-74,-198Q34,-232 50,-150L44,-96', 'none', { stroke: C.ink, sw: 22 / 0.72 });
    K.path(ada.mid, 'M-74,-198Q34,-232 50,-150L44,-96', 'none', { stroke: C.brown, sw: 12 / 0.72 });
    const pokes = [C.lilac, C.red, C.peri, C.white];
    ch.drawers.forEach((d, i) => {
      const tO = W('carry', 'fill') - 0.1 + i * 0.12;
      tl.to(d.g, { x: -26, duration: 0.25, ease: 'power2.out' }, tO);
      const pk = K.rect(ada.tback, -132 - 125 + 22 + 30 + i * 26, -6 - 380 + 15 + i * d.h - 14, 58, 24, pokes[i], { sw: 4 });
      gsap.set(pk, { scaleY: 0, transformOrigin: '50% 100%' });
      tl.to(pk, { scaleY: 1, duration: 0.3, ease: 'back.out(2)' }, tO + 0.05);
    });
    X.sfx(W('carry', 'fill') - 0.1, 'slide', { gain: 0.1, dur: 0.4 });
    K.walk(ada, tS8, E('carry') + 0.6, { speed: 115, cycle: 1.2, arms: false, amp: 17 });
    K.pose(ada, W('carry', 'carry') - 0.2, { lean: 13, bob: 6 }, 0.5);
    K.pose(ada, W('carry', 'visit') - 0.25, { turn: 0.55, hd: -10 }, 0.4);
    K.drift(s8.cam, tS8 + 0.9, c3In + 0.5, { rate: 0.004, x: -260 });
  }

  // ================================================================== -3- Travelling Light
  K.card(c3In, c3Out, { n: 3, title: 'Travelling Light', field: C.lilac, text: C.white, num: C.white, line: C.dotRed, seed: 13 });

  // ================================================================== S9 door: the object was only a door
  const tZoom = W('door', 'door') - 0.5;
  const tS10 = tZoom + 1.7;
  const s9 = scene('s9', c3Out - 0.05, tS10 + 0.4);
  {
    const zg = X.svg('g', {}, s9.cam);
    const g = zg;
    floor(g, 905, C.grass);
    const dr = K.door(g, 1080, 975, { w: 250, h: 500, color: C.peri });
    const sea = K.seaside(dr.opening, 250, 500, { sw: 4 });
    gsap.set(sea.sun, { x: 10, y: -60 });
    const kk = K.at(dr.panel, 1080 - 1080 + 250 / 2 - 34, -500 * 0.5 + 40);
    const keyG = X.svg('g', {}, kk);
    K.key(keyG, -98, 0, { s: 0.4, sw: 5 });
    const ada = K.figure(g, { pose: { x: 700, y: 985, s: 0.86, turn: 0.6, la: -8, le: 6, ra: 34, re: 30, hd: -2 } });
    tl.to(keyG, { scaleY: 0.2, duration: 0.3, ease: 'power2.inOut', transformOrigin: '50% 50%' }, W('door', 'memory') - 0.1);
    X.sfx(W('door', 'memory') - 0.1, 'click', { gain: 0.12 });
    tl.to(dr.panel, { scaleX: -0.2, duration: 0.7, ease: 'sine.inOut', svgOrigin: `${-125} 0` }, W('door', 'door') - 0.35);
    K.pose(ada, W('door', 'only') - 0.2, { ra: 62, re: 14, smile: 0.4, hd: 0 }, 0.6);
    K.drift(s9.cam, c3Out, tZoom, { rate: 0.008 });
    // travel zoom INTO the doorway (log-space, slow: on twos a fast zoom reads as a cut) -> short dissolve to S10
    const zx = K.xf(zg, 1080, 735);
    tl.to(zx, { ls: Math.log(4.6), x: -120, y: -195, duration: tS10 - tZoom + 0.35, ease: 'sine.inOut' }, tZoom);
    X.sfx(tZoom, 'whoosh', { gain: 0.07, dur: 0.8 });
  }

  // ================================================================== S10 us: what happened lives on in us (pull out from her jumper)
  const tS11 = S('keep') - 0.85;
  const s10 = scene('s10', tS10, tS11 + 1.0);
  {
    const g = s10.cam;
    floor(g, 905, C.grass);
    const ada = K.figure(g, { pose: { x: 960, y: 985, s: 0.9, la: -46, le: -10, ra: 46, re: 10 } });
    const pat = K.at(ada.pattern, 0, -110);
    const ps = K.seaside(pat, 300, 300, { sw: 2.6 });
    gsap.set(ps.sun, { x: -10, y: -10 });
    // start close on the seaside pattern on her jumper (rhymes with the doorway view), then pull all the way out
    const H10 = 985 + 0.9 * (-(205 + 198 + 14) - 110 + 6);
    K.pose(ada, tS10 + 1.6, { la: -8, le: 6, ra: 8, re: -6 }, 0.9);
    const zx = K.xf(s10.cam, 960, H10, { ls: Math.log(5.2), y: 560 - H10 });
    tl.fromTo(s10.outer, { opacity: 0 }, { opacity: 1, duration: 0.35, ease: 'none' }, tS10);
    tl.to(zx, { ls: 0, y: 0, duration: 2.5, ease: 'sine.inOut' }, tS10 + 0.1);
    tl.to(zx, { s: 1.03, duration: tS11 - tS10 - 2.6, ease: 'sine.inOut' }, tS10 + 2.6);
    K.pose(ada, W('us', 'us') - 0.3, { la: 4, le: 118, smile: 0.5 }, 0.6);
    const tL = W('us', 'laugh');
    K.pose(ada, tL - 0.15, { blink: 2, smile: 2, hd: 7, bob: -4 }, 0.25, 'power2.out');
    K.pose(ada, tL + 0.55, { blink: 0, smile: 0.6, hd: 0, bob: 0 }, 0.3);
    const lm = K.marks(g, 1010, 300, { angles: [-120, -90, -60], r0: 18, r1: 44 });
    gsap.set(lm, { opacity: 0 });
    tl.set(lm, { opacity: 1 }, tL - 0.05); tl.set(lm, { opacity: 0 }, tL + 0.25); tl.set(lm, { opacity: 1 }, tL + 0.42); tl.set(lm, { opacity: 0 }, tL + 0.62);
    const fl = [[700, 960, 0.75, C.red, W('us', 'notice') - 0.1], [770, 960, 0.55, C.peri, W('us', 'become') - 0.05], [1230, 960, 0.68, C.ochre, W('us', 'become') + 0.15]];
    fl.forEach(([x, y, s, col, t]) => {
      const f = K.flower(g, x, y, s, { color: col });
      gsap.set(f, { scale: 0, transformOrigin: '50% 100%' });
      tl.to(f, { scale: 1, duration: 0.6, ease: 'back.out(1.4)' }, t);
    });
    K.pose(ada, W('us', 'notice') - 0.2, { turn: -0.6, hd: 12 }, 0.5);
    K.pose(ada, W('us', 'become') - 0.1, { turn: 0, hd: 0, wind: 1.3 }, 0.6);
  }

  // ================================================================== S11 keep + S12 go: three things on a shelf; the rest become birds
  const tTilt = E('go') + 0.25;
  const s11 = scene('s11', tS11, tTilt + 1.1);
  const endG = scene('end', tTilt, END + 1);
  K.travel(s10.outer, s11.outer, tS11, 0.9);
  gsap.set(s11.cam, { scale: 1.03 });   // match S10's drift so the grass line meets during the travel
  {
    const g = s11.cam;
    floor(g, 905, C.grass);
    // shelf
    K.rect(g, 260, 540, 420, 22, C.tan);
    K.path(g, 'M300,562L300,610L340,562', 'none'); K.path(g, 'M640,562L640,610L600,562', 'none');
    K.pebble(g, 340, 516, 26);
    K.ticket(g, 450, 500, { w: 120, h: 64, rot: -6 });
    const shelfKeyO = K.at(g, 540, 528);
    const shelfKey = X.svg('g', {}, shelfKeyO);
    K.key(shelfKey, 0, 0, { s: 0.42, sw: 5 });
    gsap.set(shelfKey, { opacity: 0 });
    const ada = K.figure(g, { pose: { x: 900, y: 985, s: 0.86, turn: -0.5, la: -48, le: -40, ra: 8, re: -6 } });
    const hk = ada.attach(X.svg('g', {}, ada.hold), 'l', { dy: 0, rot: 0 });
    K.key(hk, -24, 0, { s: 0.42 / 0.86, sw: 5 / 0.86 });
    K.pose(ada, S('keep') + 0.05, { la: -98, le: -12, hd: 4 }, 0.8);
    const tPlace = W('keep', 'things') - 0.05;
    tl.set(hk, { opacity: 0 }, tPlace);
    tl.set(shelfKey, { opacity: 1 }, tPlace);
    X.sfx(tPlace, 'click', { gain: 0.08, pitch: 0.8 });
    K.pose(ada, tPlace + 0.15, { la: -10, le: 8, hd: 0 }, 0.8);
    const tOpen = W('keep', 'open') - 0.05;
    tl.to(shelfKey, { scaleY: 0.2, duration: 0.3, ease: 'power2.inOut', transformOrigin: '20% 50%' }, tOpen);
    const km = K.marks(g, 600, 528, { angles: [-140, -90, -40], r0: 40, r1: 66 });
    gsap.set(km, { opacity: 0 }); tl.set(km, { opacity: 1 }, tOpen + 0.2); tl.set(km, { opacity: 0 }, tOpen + 0.8);
    // the chest of everything else, off to the right
    const ch = K.drawers(g, 1650, 975, { w: 420, h: 440, n: 3, fill: C.lilac, front: C.lilac, top: C.peri });
    const r = X.rand(21), stuff = [];
    const cols = [C.lilac, C.red, C.peri, C.ochre, C.white, C.olive, C.terracotta, C.stone, C.lilac];
    for (let i = 0; i < 9; i++) {
      const x = 1490 + (i % 5) * 80 + r() * 20, y = 520 - Math.floor(i / 5) * 60 - r() * 20;
      const it = K.at(g, x, y, 1, (r() - 0.5) * 40);
      if (i % 3 === 0) K.rect(it, -26, -18, 52, 36, cols[i], { sw: 5 });
      else if (i % 3 === 1) K.circle(it, 0, 0, 20, cols[i], { sw: 5 });
      else K.path(it, K.pebbleD(24), cols[i], { sw: 5 });
      stuff.push({ el: it, x, y });
    }
    tl.to(ch.drawers[0].g, { y: 14, scaleX: 1.05, transformOrigin: '50% 50%', duration: 0.35, ease: 'power2.out' }, S('go') - 0.3);
    K.pose(ada, S('go') - 0.3, { turn: 0.5, la: -30, le: -10, ra: 40, re: 10 }, 0.7);
    tl.fromTo(s11.cam, { x: 0 }, { x: -480, duration: 1.3, ease: 'power2.inOut', immediateRender: false }, S('go') - 0.45);
    K.release(g, stuff, W('go', 'go') - 0.05, { stagger: 0.1, dx: 420, dy: -760, dur: 2.4 });
    X.sfx(W('go', 'go'), 'woosh_low', { gain: 0.07, dur: 1.0 });
    K.pose(ada, W('go', 'thanks') - 0.2, { ra: 150, re: 20, smile: 0.6 }, 0.5);
    K.wobble(ada, W('go', 'thanks') + 0.3, tTilt + 1.0, { re: 14 }, 0.5);
  }
  // camera tilts up into the sky: the end card
  tl.fromTo(s11.outer, { y: 0 }, { y: 1080, duration: 1.1, ease: 'power2.inOut', immediateRender: false }, tTilt);
  tl.fromTo(endG.outer, { y: -1080 }, { y: 0, duration: 1.1, ease: 'power2.inOut' }, tTilt);
  {
    const g = endG.cam;
    const fr = K.path(g, K.scallopD(960, 520, 900, 360, 22), 'none', { stroke: C.tan, sw: 5 });
    X.drawOn(fr, tTilt + 0.7, 1.2, 'power1.inOut');
    const t1 = K.text(g, 960, 520, 'Our Small Museums', { size: 78, fill: C.terracotta });
    const t2 = K.text(g, 960, 600, 'keep a few things', { size: 40, fill: C.ink, weight: 400, italic: true });
    tl.fromTo([t1, t2], { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.25 }, tTilt + 1.0);
    const bb = K.bird(g, 380, 260, 0.7), bb2 = K.bird(g, 300, 300, 0.5);
    tl.fromTo([bb, bb2], { x: 0, y: 0 }, { x: 520, y: -160, duration: 4, ease: 'none', stagger: 0.3 }, tTilt);
    X.sfx(tTilt + 1.0, 'chime', { gain: 0.06, dur: 0.9, pitch: 0.75 });
  }

  X.end(END);
});
