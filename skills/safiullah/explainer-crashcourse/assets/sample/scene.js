// CrashCourse-style sample (original): a cued ~60 s animated story segment ("the Daydream") about Eratosthenes
// measuring the Earth, bookended by an illustrated host stand-in. 2012-era flat-vector insert look.
X.boot(async (X) => {
  await X.loadVO();
  const { C, F } = K;
  const W = (id, w, n) => X.word(id, w, n), WE = (id, w, n) => X.wordEnd(id, w, n), L = (id) => X.line(id);

  const Lhost = K.g(X.root), Lstory = K.g(X.root), Lover = K.g(X.root), Lfx = K.g(X.root);

  // ---------------------------------------------------------------- key times
  const tCurtain = W('cue', 'Daydream') + 0.2;          // stripe curtain into the segment
  const tTitle = tCurtain + 3 * F;                       // title card sits under the covering stripes
  const tReveal = K.stripeCurtain(Lfx, tCurtain, { hold: 0.45 });
  const tStory = L('s1a').start - 0.1;                    // hard cut title → first story shot
  const tMap = L('s2').start - 0.05;
  const tSyene = W('s2', 'noon') - 0.08;
  const tPan = L('s3').start;
  const tDiag = L('s4').start - 0.06;
  const tGlobe = L('s5').start - 0.02;
  const tWalk = L('s6').start - 0.08;
  const tMath = L('s7a').start - 0.04;
  const tReal = W('s7b', 'The', 0) - 0.1;
  const tFinal = L('s8').start - 0.05;
  const out = K.stripeOut(Lfx, WE('s8', 'Daydream') - 0.3, { hold: 0.1 });
  const tHostB = out.tCovered;
  const END = X.vo.duration;

  // ================================================================ HOST A (illustrated stand-in, desk set)
  const hostAG = X.scene('hostA', 0, tCurtain + 4 * F, (g) => {
    const cam = X.cam(K.g(g));
    const set = K.hostSet(cam);
    const host = K.host(set.mid, { front: set.front });
    K.hostTalk(host, ['hostA', 'cue']);
    // X16 jump cut: wide → close on "Over"
    X.tl.set(cam, { scale: 1.75, x: -165, y: 140 }, W('hostA', 'Over') - 0.04);
    // gestures: open palms on "how big", point up on "Daydream"
    const gs = (arm, side, t, a, d = 0.35) => X.tl.to(arm.fore, { rotation: side * a, svgOrigin: '0 0', duration: 5 * F, ease: 'back.out(1.6)' }, t)
      .to(arm.fore, { rotation: 0, svgOrigin: '0 0', duration: 6 * F, ease: 'power2.inOut' }, t + d);
    gs(host.armL, -1, W('hostA', 'how') - 0.05, 38, 0.8); gs(host.armR, 1, W('hostA', 'how') - 0.02, 34, 0.8);
    gs(host.armR, 1, W('hostA', 'measured') - 0.05, 24, 0.5);
    X.tl.to(host.armL.fore, { rotation: -78, svgOrigin: '0 0', duration: 4 * F, ease: 'back.out(2)' }, W('cue', 'go') - 0.05);
    X.tl.to(host.brows, { y: -10, duration: 3 * F }, W('hostA', 'big') - 0.05).to(host.brows, { y: 0, duration: 5 * F }, W('hostA', 'Earth') + 0.35);
    X.tl.to(host.brows, { y: -12, duration: 3 * F }, W('cue', 'Daydream') - 0.1);
    // X6 diamond badge on "stick" (left third, never over the face) with hatch side panel
    K.diamond(Lover, W('hostA', 'stick') - 2 * F, tCurtain + 3 * F, {
      x: 330, y: 560, size: 330, fill: C.mintDeep, hatch: 'rgba(255,255,255,0.18)', panel: [C.aqua, 'rgba(255,255,255,0.25)'],
      icon: (ig) => { K.circ(ig, 46, -62, 30, C.sun); K.rect(ig, -60, 60, 140, 12, C.sandDark, 6); K.stick(ig, -12, 66, 120); K.path(ig, 'M-12,66 L60,66 L66,72 L-12,72 Z', 'rgba(0,0,0,0.35)'); },
    });
  }, Lhost);
  gsap.set(hostAG, { autoAlpha: 1 });

  // ================================================================ TITLE CARD (segment opener)
  K.titleCard(Lstory, tTitle, tStory, { title: 'HOW BIG IS THE EARTH?', tag: 'THE DAYDREAM', sub: 'starring Eratosthenes, a well, and one stick', at: tReveal - 3 * F });

  // shared character builder
  const erato = (p, x, y, h = 400, o = {}) => K.figure(p, { x, y, h, skin: '#D79A6B', skinDark: '#B97E52', tunic: C.white, tunicDark: '#CFDCDC', sash: C.coral,
    hairStyle: 'bald', hair: '#C9D3D4', beard: '#E3E9EA', beardLen: 22, prop: o.prop ?? 'scroll', flip: o.flip });

  // ================================================================ S1 ALEXANDRIA + nickname gag
  X.scene('alex', tStory, tMap + 10 * F, (g0) => {
    const g = K.drift(g0, tStory, tMap + 10 * F, { s1: 1.13, x1: 40 });
    K.rect(g, 0, 0, 1920, 1080, C.mint);
    const cam = X.cam(K.g(g));
    const sun = K.sun(cam, 1660, 170, 66);
    K.loop(sun.rays, tStory, tMap, (t) => ({ r: t * 8 }));
    const clouds = [K.cloud(cam, 360, 190, 0.9), K.cloud(cam, 1080, 130, 0.7), K.cloud(cam, 1950, 260, 0.8)];
    K.birds(cam, tStory, tMap, { x: 120, y: 250, speed: 70, n: 3, seed: 3 });
    clouds.forEach((c, i) => K.loop(K.wrap(c), tStory, tMap, (t) => ({ x: -t * (10 + i * 5) })));
    // sea + Pharos
    K.rect(cam, -200, 540, 2400, 140, C.mintDeep);
    for (let k = 0; k < 9; k++) K.rect(cam, 60 + k * 230, 580 + (k % 2) * 40, 90, 10, C.mintLite, 5);
    K.path(cam, 'M1450,600 Q1560,560 1700,600 Z', C.sandDark);
    const lh = K.lighthouse(cam, 1575, 596, 0.62);
    K.loop(lh.flame, tStory, tMap, (t) => ({ sy: 1 + 0.12 * Math.sin(t * 14), sx: 1 - 0.06 * Math.sin(t * 14) }), 0, 0);
    // far city
    const city = K.g(cam); const rr = X.rand(4);
    for (let k = 0; k < 14; k++) { const x = 40 + k * 100, h = 50 + rr() * 70; K.rect(city, x, 680 - h, 86, h, k % 3 ? C.cream : C.creamDark, 4); K.rect(city, x + 30, 680 - h * 0.55, 22, 30, C.sandDark, 3); if (k % 4 === 1) K.path(city, `M${x},${680 - h} Q${x + 43},${680 - h - 60} ${x + 86},${680 - h} Z`, C.coral); }
    // ground
    K.rect(cam, -200, 670, 2400, 600, C.sand);
    K.rect(cam, -200, 670, 2400, 18, C.sandMid);
    for (let k = 0; k < 7; k++) K.rect(cam, 80 + k * 300, 960 + (k % 2) * 50, 140, 12, C.sandMid, 6);
    K.temple(cam, 760, 850, 640, { accent: C.coral });
    const palms = [K.palm(cam, 170, 900, 1.25, { lean: 22 }), K.palm(cam, 1330, 870, 0.95, { lean: -16 }), K.palm(cam, 1830, 940, 1.3, { lean: -24 })];
    palms.forEach((p, i) => K.loop(p.crown, tStory, tMap, (t) => ({ r: 3 * Math.sin(t * 1.6 + i) }), 0, 0));
    // labels
    const dateB = K.badge(cam, 250, 330, 92, (bg) => { K.txt(bg, '≈240', 0, 6, { size: 66, fill: C.ink }); K.txt(bg, 'BC', 0, 52, { size: 40, fill: C.coral }); });
    X.pop(dateB, W('s1a', 'two') - 2 * F, { dur: 5 * F, ease: 'back.out(1.6)' });
    const alexL = K.label(cam, 960, 250, 'ALEXANDRIA, EGYPT', { size: 64 });
    X.pop(alexL, W('s1a', 'Alexandria') - 2 * F, { dur: 5 * F, ease: 'back.out(1.5)', sfx: 'pop' });
    // Eratosthenes walks in
    const er = erato(cam, 1110, 930, 420);
    const tEr = W('s1a', 'Eratosthenes');
    X.tl.fromTo(er.g, { x: 2060 }, { x: 1110, duration: 0.85, ease: 'power2.out', immediateRender: false }, tEr - 0.5);
    gsap.set(er.g, { x: 2060 });
    K.walk(er, tEr - 0.5, tEr + 0.35, { step: 0.14, keepArms: true });
    const nameT = K.label(cam, 1110, 430, 'ERATOSTHENES', { size: 46, fill: '#fff', color: C.ink });
    X.pop(nameT, tEr + 0.15, { dur: 5 * F, ease: 'back.out(1.5)', sfx: 'blip_up' });
    X.tl.to(nameT, { scale: 0, duration: 4 * F, ease: 'power2.in' }, W('s1b', 'nickname') - 0.1);
    // camera: slow push, then push to the library on his name
    X.tl.fromTo(cam, { scale: 1 }, { scale: 1.08, duration: 3, ease: 'power1.inOut', immediateRender: false }, tStory);
    X.tl.to(cam, { scale: 1.32, x: -198, y: -158, duration: 0.9, ease: 'power2.inOut' }, tEr - 0.1);
    X.tl.to([dateB, alexL], { scale: 0, duration: 4 * F, ease: 'power2.in' }, tEr - 0.15);
    X.sfx(tEr - 0.1, 'woosh_low', { dur: 0.6, gain: 0.3 });
    // scrolls float out of the library
    [-1, 0, 1].forEach((k, i) => {
      const sbW = K.g(cam), sb = K.badge(sbW, 760 + k * 170, 470 + Math.abs(k) * 30, 58, (bg) => K.scrollIcon(bg, 0, 0, 1.0));
      const tt = W('s1a', 'library') + i * 4 * F;
      X.pop(sb, tt, { dur: 5 * F, ease: 'back.out(1.8)', sfx: 'bubble', pitch: 1 + i * 0.15 });
      X.tl.fromTo(sbW, { y: 0 }, { y: -40, duration: 1.2, ease: 'sine.inOut', immediateRender: false }, tt + 0.2);
      X.tl.to(sb, { scale: 0, duration: 4 * F, ease: 'power2.in' }, W('s1b', 'nickname') - 0.1 + i * F);
    });
    // nickname: beta badge, podium gag
    const bbW = K.g(cam), bb = K.badge(bbW, 905, 430, 84, (bg) => K.beta(bg, 0, 0, 100, C.coral), { ring: C.coral });
    X.pop(bb, W('s1b', 'Beta') - 2 * F, { dur: 5 * F, ease: 'back.out(1.8)', sfx: 'ding' });
    X.tl.to(cam, { scale: 1.46, x: -150, y: -60, duration: 8 * F, ease: 'power2.inOut' }, W('s1b', 'Beta') - 4 * F);
    X.tl.to(cam, { scale: 1.22, x: -170, y: -40, duration: 10 * F, ease: 'power2.inOut' }, W('s1b', 'second') - 0.2);
    X.tl.to(cam, { rotation: -2.5, duration: 2 * F, ease: 'power1.out' }, W('s1c', 'Rude') - F)
      .to(cam, { rotation: 2, duration: 3 * F, ease: 'sine.inOut' }, W('s1c', 'Rude') + F)
      .to(cam, { rotation: 0, duration: 4 * F, ease: 'back.out(2)' }, W('s1c', 'Rude') + 4 * F);
    const tPod = W('s1b', 'second') - 0.12;
    const podW = K.g(cam); K.podium(podW, 1310, 930);
    cam.insertBefore(podW, er.g);
    gsap.set(podW, { y: 420 });
    X.tl.to(podW, { y: 0, duration: 6 * F, ease: 'back.out(1.3)' }, tPod);
    X.sfx(tPod, 'slide', { dur: 0.3, gain: 0.4 });
    // hop onto step 2 (left step, height 150)
    X.tl.to(er.body, { y: -240, duration: 5 * F, ease: 'power2.out' }, tPod + 5 * F).to(er.body, { y: -150, duration: 4 * F, ease: 'power2.in' }, tPod + 10 * F);
    const medal = K.g(er.body); K.path(medal, 'M-14,-300 L0,-250 L14,-300', 'none', { stroke: C.coral, 'stroke-width': 7 }); K.circ(medal, 0, -236, 26, '#DDE6E7'); K.circ(medal, 0, -236, 18, '#C2CFD1'); K.txt(medal, '2', 0, -222, { size: 40, fill: '#fff' });
    X.pop(medal, W('s1b', 'everything') - 2 * F, { dur: 5 * F, sfx: 'coin' });
    const q = K.txt(cam, '?', 1310, 640, { size: 150, fill: C.ink });
    X.pop(q, W('s1b', 'everything') + 0.1, { dur: 5 * F, sfx: false });
    K.loop(K.wrap(q), tPod, tMap, (t) => ({ y: 8 * Math.sin(t * 3) }));
    // "Rude." grumble cloud + head tilt, "But fair." shrug
    const grumble = K.g(cam); grumble.setAttribute('transform', 'translate(1235 335)');
    K.path(grumble, 'M-60,20 Q-80,-20 -40,-34 Q-30,-70 10,-60 Q40,-80 60,-40 Q96,-30 76,14 Z', C.ink);
    K.path(grumble, 'M-40,-10 l14,-12 l12,14 l14,-14 l12,12 l14,-12', 'none', { stroke: C.yellow, 'stroke-width': 6, 'stroke-linejoin': 'round', 'stroke-linecap': 'round' });
    const tRude = W('s1c', 'Rude');
    X.pop(grumble, tRude - F, { dur: 4 * F, sfx: 'boing', ease: 'back.out(2)' });
    X.tl.to(er.headPivot, { rotation: -12, svgOrigin: '0 0', duration: 3 * F }, tRude - F);
    X.tl.to(grumble, { scale: 0, duration: 4 * F, ease: 'power2.in' }, W('s1c', 'But') - F);
    X.tl.to(er.headPivot, { rotation: 6, svgOrigin: '0 0', duration: 5 * F, ease: 'back.out(2)' }, W('s1c', 'But') - F);
    X.tl.to(er.armL, { rotation: 72, svgOrigin: '0 0', duration: 4 * F, ease: 'back.out(2)' }, W('s1c', 'fair') - 3 * F).to(er.armR, { rotation: -72, svgOrigin: '0 0', duration: 4 * F, ease: 'back.out(2)' }, W('s1c', 'fair') - 3 * F);
    X.sfx(W('s1c', 'fair') - 2 * F, 'blip', { gain: 0.25 });
  }, Lstory);

  // ================================================================ S2a MAP: Alexandria → down the Nile → Syene
  const mapG = X.scene('map', tMap, tSyene + 10 * F, (g0) => {
    K.rect(g0, 0, 0, 1920, 1080, C.ink);
    const g = K.drift(g0, tMap, tSyene + 10 * F, { s0: 1, s1: 1.06 });
    const mf = K.mapFrame(g, 26, 22, 1868, 1036, { fill: C.mint, vignette: 0.22 });
    const m = X.cam(K.g(mf.content));
    // land (Egypt-ish, stylised), Mediterranean on top, Red Sea to the east
    K.path(m, 'M-100,330 Q200,300 420,318 Q560,300 640,268 Q760,250 880,280 Q1020,300 1140,286 L1210,300 L1260,420 L1330,330 L1420,300 Q1700,310 2100,320 L2100,1200 L-100,1200 Z', C.sand);
    K.path(m, 'M1210,300 L1270,430 L1300,520 L1640,1200 L1760,1200 L1350,470 L1330,330 Z', C.mint); // Gulf of Suez + Red Sea
    K.path(m, 'M1340,330 L1420,300 L1460,360 L1400,420 Z', C.mint);
    for (let k = 0; k < 6; k++) K.rect(m, 200 + k * 300, 140 + (k % 2) * 50, 110, 10, C.mintLite, 5);
    // Nile + delta
    const nile = 'M870,1120 Q900,1000 860,900 Q820,800 880,700 Q930,600 890,500 Q860,420 880,350';
    K.path(m, nile, 'none', { stroke: C.aqua, 'stroke-width': 18, 'stroke-linecap': 'round' });
    K.path(m, 'M880,350 Q820,320 700,300 M880,350 Q900,320 980,290 M880,350 Q860,320 840,284', 'none', { stroke: C.aqua, 'stroke-width': 10, 'stroke-linecap': 'round' });
    K.path(m, 'M760,300 Q880,240 1010,286 L880,360 Z', '#B6D98A');
    // dots + route
    const route = K.path(m, 'M700,300 Q760,330 840,380 Q875,420 885,500 Q930,600 880,700 Q820,800 860,900 Q890,960 885,985', 'none', { stroke: C.red, 'stroke-width': 9, 'stroke-dasharray': '22 16', 'stroke-linecap': 'round' });
    const dA = K.g(m); K.circ(dA, 700, 300, 22, '#fff'); K.circ(dA, 700, 300, 14, C.red);
    const dS = K.g(m); K.circ(dS, 885, 985, 22, '#fff'); K.circ(dS, 885, 985, 14, C.red);
    const sea = K.txt(m, 'Mediterranean Sea', 380, 215, { italic: true, size: 40, fill: C.sea, upper: false });
    const nl = K.txt(m, 'NILE', 0, 0, { size: 54, fill: C.sea, ls: 8, attrs: { transform: 'translate(800 640) rotate(-78)' } });
    const pyr = K.g(m); pyr.setAttribute('transform', 'translate(770 430)');
    K.path(pyr, 'M-34,0 L0,-46 L34,0 Z', C.sandMid); K.path(pyr, 'M0,-46 L34,0 L8,0 Z', C.sandDark); K.path(pyr, 'M14,0 L38,-30 L62,0 Z', C.sandMid);
    const lA = K.label(m, 470, 240, 'ALEXANDRIA', { size: 50 }), lS = K.label(m, 1110, 985, 'SYENE', { size: 50 });
    X.pop(pyr, tMap + 8 * F, { dur: 5 * F, sfx: false });
    gsap.set([sea, nl], { opacity: 0 }); X.tl.to([sea, nl], { opacity: 0.9, duration: 6 * F }, tMap + 6 * F);
    X.pop(dA, tMap + 2 * F, { dur: 4 * F, sfx: 'pop' }); X.pop(lA, tMap + 4 * F, { dur: 5 * F, sfx: false });
    // route draws "down south"
    const dashL = route.getTotalLength();
    const mask = X.svg('mask', { id: 'routeMask', maskUnits: 'userSpaceOnUse', x: -200, y: -200, width: 2400, height: 1600 }, X.defs);
    const mp = K.path(mask, route.getAttribute('d'), 'none', { stroke: '#fff', 'stroke-width': 30, 'stroke-linecap': 'round' });
    route.setAttribute('mask', 'url(#routeMask)');
    X.drawOn(mp, W('s2', 'down') - 0.05, 0.55, 'power1.inOut');
    X.sfx(W('s2', 'down') - 0.05, 'scribble', { dur: 0.5, gain: 0.35 });
    X.pop(dS, W('s2', 'Syene') - 2 * F, { dur: 4 * F, sfx: 'pop', pitch: 1.2 }); X.pop(lS, W('s2', 'Syene'), { dur: 5 * F, sfx: false });
    // camera follows the route a little
    X.tl.fromTo(m, { scale: 1.05, y: 60 }, { scale: 1.14, y: -60, duration: tSyene - tMap + 0.2, ease: 'power1.inOut', immediateRender: false }, tMap);
    gsap.set(m, { scale: 1.05, y: 60 });
  }, Lstory);
  K.diagWipe(mapG, tMap, { frames: 9 });

  // ================================================================ S2b/S3 one long desert backdrop: Syene (right) ← pan ← Alexandria (left)
  const desG = X.scene('desert', tSyene, tDiag + 10 * F, (g0) => {
    const g = K.drift(g0, tSyene, tDiag + 10 * F, { s1: 1.11, y1: 30 });
    K.rect(g, -100, -100, 2120, 1280, C.mint);
    const sun = K.sun(g, 960, 150, 74);
    K.loop(sun.rays, tSyene, tDiag, (t) => ({ r: t * 10 }));
    K.birds(g, tSyene, tDiag, { x: 1500, y: 300, speed: 60, n: 2, dir: -1, seed: 8 });
    const world = K.g(g);
    gsap.set(world, { x: -1920 });
    // --- Alexandria half (x 0..1920)
    K.rect(world, -100, 560, 2100, 120, C.mintDeep);
    for (let k = 0; k < 7; k++) K.rect(world, 80 + k * 260, 600 + (k % 2) * 36, 90, 10, C.mintLite, 5);
    K.path(world, 'M240,610 Q350,570 470,610 Z', C.sandDark); K.lighthouse(world, 355, 606, 0.5);
    const cityR = X.rand(9); for (let k = 0; k < 8; k++) { const x = 1150 + k * 95, h = 40 + cityR() * 60; K.rect(world, x, 680 - h, 82, h, k % 2 ? C.cream : C.creamDark, 4); }
    K.rect(world, -100, 670, 2100, 500, C.sand); K.rect(world, -100, 670, 2100, 16, C.sandMid);
    K.palm(world, 160, 930, 1.1, { lean: 20 }); K.palm(world, 1760, 900, 1.0, { lean: -18 });
    // --- Syene half (x 1920..3840)
    K.dunes(world, 640, [C.sandMid, C.sand], { x0: 1920, w: 1920, amp: 50, step: 40 });
    K.rect(world, 1900, 720, 1980, 460, C.sand);
    for (let k = 0; k < 6; k++) K.rect(world, 2000 + k * 330, 980 + (k % 2) * 40, 150, 12, C.sandMid, 6);
    const cut = 'M2690,750 L3070,750 L3070,1010 Q3070,1080 3000,1080 L2760,1080 Q2690,1080 2690,1010 Z';
    K.path(world, cut, C.soil);
    for (let k = 1; k < 4; k++) K.rect(world, 2690, 750 + k * 75, 380, 10, '#A6743E');
    K.path(world, cut, 'none', { stroke: C.sandDark, 'stroke-width': 8 });
    K.rect(world, 1900, 720, 1980, 34, C.sand); K.rect(world, 1900, 750, 1980, 6, C.sandMid);
    const house = K.g(world); K.rect(house, 2330, 560, 230, 170, C.creamDark, 6); K.rect(house, 2480, 560, 80, 170, '#D3BE98'); K.rect(house, 2410, 640, 60, 90, C.woodDark, 26); K.rect(house, 2320, 548, 250, 20, C.sandDark, 6);
    K.palm(world, 2180, 740, 1.15, { lean: 14 }); K.palm(world, 3650, 740, 1.0, { lean: -16 });
    const well = K.well(world, 2880, 740, { depth: 300, w: 140 });
    // beam straight down the well
    const beam = K.g(world);
    K.rect(beam, 2840, -40, 80, 1080, '#FFF6B8', 0, { opacity: 0.8 });
    K.rect(beam, 2860, -40, 40, 1080, '#FFFDE8', 0, { opacity: 0.9 });
    gsap.set(beam, { scaleY: 0, transformOrigin: '50% 0%' });
    const tBeam = W('s2', 'straight') - 0.05;
    X.tl.to(beam, { scaleY: 1, duration: 0.4, ease: 'power2.in' }, tBeam);
    X.tl.to(world, { y: -150, duration: 0.55, ease: 'power2.inOut' }, tBeam + 0.1).to(world, { y: 0, duration: 0.5, ease: 'power2.inOut' }, W('s2', 'No') - 0.15);
    X.tl.to(sun.g, { y: 0, duration: 0.55, ease: 'power2.inOut' }, tBeam + 0.1).to(sun.g, { y: 150, duration: 0.5, ease: 'power2.inOut' }, W('s2', 'No') - 0.15);
    X.sfx(tBeam, 'zoom_in', { dur: 0.4, gain: 0.3 });
    const glint = K.g(world); glint.setAttribute('transform', 'translate(2880 1005)');
    K.ell(glint, 0, 0, 52, 14, '#FFFDE8');
    for (const [sx, sy, sc] of [[-60, -40, 1], [70, -30, 0.8], [10, -70, 0.7]]) K.path(glint, `M${sx},${sy - 22 * sc} L${sx + 6 * sc},${sy - 6 * sc} L${sx + 22 * sc},${sy} L${sx + 6 * sc},${sy + 6 * sc} L${sx},${sy + 22 * sc} L${sx - 6 * sc},${sy + 6 * sc} L${sx - 22 * sc},${sy} L${sx - 6 * sc},${sy - 6 * sc} Z`, '#fff');
    X.pop(glint, W('s2', 'well') - F, { dur: 5 * F, sfx: 'sparkle', ease: 'back.out(2.5)' });
    X.tl.to(beam, { opacity: 0, duration: 6 * F }, tPan - 0.1);
    // local with a jug, and the shadow that isn't there
    const loc = K.figure(world, { x: 3160, y: 744, h: 330, skin: '#9C6343', skinDark: '#82502F', tunic: C.orange, tunicDark: '#D97B16', hairStyle: 'long', hair: '#2A1C15', prop: 'jug' });
    const ghost = K.path(world, 'M3120,748 L3380,748 L3360,772 L3140,772 Z', 'none', { stroke: C.ink, 'stroke-width': 5, 'stroke-dasharray': '14 10', opacity: 0.7 });
    gsap.set(ghost, { opacity: 0 });
    X.tl.to(ghost, { opacity: 0.7, duration: 3 * F }, W('s2', 'No') - 3 * F);
    const nx = K.pinkX(world, 3255, 745, 230);
    X.pop(nx, W('s2', 'shadows') - 2 * F, { dur: 4 * F, sfx: 'error', ease: 'back.out(2)' });
    // noon + longest day badges (screen space)
    const clock = K.badge(g, 230, 230, 96, (bg) => { K.circ(bg, 0, 0, 70, 'none', { stroke: C.ink, 'stroke-width': 8 }); K.rect(bg, -5, -56, 10, 58, C.ink, 5); K.rect(bg, -5, -40, 10, 42, C.coral, 5, { transform: 'rotate(4)' }); K.circ(bg, 0, 0, 9, C.ink); });
    X.pop(clock, tSyene + 2 * F, { dur: 5 * F, sfx: 'tick', ease: 'back.out(1.8)' });
    const longL = K.label(g, 230, 380, 'LONGEST DAY', { size: 46 });
    X.pop(longL, W('s2', 'longest') - 2 * F, { dur: 5 * F, sfx: false });
    X.tl.to(sun.g, { scale: 1.18, transformOrigin: '50% 50%', duration: 4 * F, ease: 'power2.out' }, W('s2', 'sun') - 2 * F).to(sun.g, { scale: 1, duration: 6 * F, ease: 'power2.inOut' }, W('s2', 'sun') + 0.2);
    X.sfx(W('s2', 'sun') - 2 * F, 'chime', { dur: 0.5, gain: 0.25 });
    // --- pan to Alexandria (same day, same noon): sun now off to one side
    X.tl.to(world, { x: 0, duration: 1.0, ease: 'power2.inOut' }, tPan);
    X.tl.to(clock, { x: -470, duration: 1.0, ease: 'power2.in' }, tPan).to(longL, { x: -470, duration: 1.0, ease: 'power2.in' }, tPan);
    X.tl.to(sun.g, { x: 620, y: 120, duration: 1.0, ease: 'power2.inOut' }, tPan);
    X.sfx(tPan, 'woosh_low', { dur: 0.9, gain: 0.4 });
    // gnomon, rays, shadow, angle (exaggerated, "not to scale")
    const ang = 18 * Math.PI / 180, sx0 = 1000, sy0 = 880, sl = 330, topY = sy0 - sl;
    const rays = K.g(world);
    for (const off of [-260, 0, 260]) {
      const x1 = sx0 + off, y1 = topY, x0 = x1 - Math.tan(ang) * (y1 + 60), x2 = x1 + Math.tan(ang) * (sy0 - y1);
      const ray = K.path(rays, `M${x0},-60 L${x2},${sy0}`, 'none', { stroke: C.sun, 'stroke-width': 9, 'stroke-dasharray': '30 18', 'stroke-linecap': 'round' });
      K.drawMasked(ray, W('s3', 'same', 1) + (off + 260) / 260 * 2 * F, 0.45, 'power1.out');
    }
    const shadowP = K.path(world, `M${sx0},${sy0 - 8} L${sx0 + Math.tan(ang) * sl},${sy0 - 4} L${sx0 + Math.tan(ang) * sl + 6},${sy0 + 10} L${sx0},${sy0 + 10} Z`, C.ink, { opacity: 0.5 });
    gsap.set(shadowP, { scaleX: 0, svgOrigin: `${sx0} ${sy0}` });
    X.tl.to(shadowP, { scaleX: 1, svgOrigin: `${sx0} ${sy0}`, duration: 6 * F, ease: 'power2.out' }, W('s3', 'shadow') - 2 * F);
    X.sfx(W('s3', 'shadow') - 2 * F, 'slide', { dur: 0.25, gain: 0.3 });
    const gn = K.stick(world, sx0, sy0, sl, { w: 22 });
    gsap.set(gn.inner, { scaleY: 0, svgOrigin: '0 0' });
    X.tl.to(gn.inner, { scaleY: 1, svgOrigin: '0 0', duration: 5 * F, ease: 'back.out(1.6)' }, W('s3', 'stick') - 2 * F);
    X.sfx(W('s3', 'stick') - 2 * F, 'thud', { gain: 0.6 });
    const er2 = erato(world, 1330, 890, 380, { flip: true });
    X.tl.to(er2.armR, { rotation: -70, duration: 5 * F, ease: 'back.out(1.6)' }, W('s3', 'ground') - 0.05);
    const arc = K.path(world, `M${sx0},${topY + 150} A150,150 0 0 0 ${sx0 + Math.sin(ang) * 150},${topY + Math.cos(ang) * 150}`, 'none', { stroke: C.coral, 'stroke-width': 12, 'stroke-linecap': 'round' });
    X.drawOn(arc, W('s3', 'seven') - 3 * F, 5 * F, 'power2.out');
    const deg = K.txt(world, '7°', sx0 - 78, topY + 150, { size: 104, fill: C.coral });
    X.pop(deg, W('s3', 'seven'), { dur: 5 * F, sfx: 'ding', ease: 'back.out(2)' });
    const nts = K.txt(world, '*not to scale', 1700, 1040, { italic: true, size: 30, fill: C.ink, upper: false, anchor: 'middle' });
    gsap.set(nts, { opacity: 0 }); X.tl.to(nts, { opacity: 0.7, duration: 4 * F }, W('s3', 'degrees'));
  }, Lstory);
  K.diagWipe(desG, tSyene, { frames: 9, angle: -22 });

  // ================================================================ S4 DIAGRAM: parallel rays, flat vs curved ground (dark field)
  const N = 48;
  const R = 1500, CX = 660, CY = 800 + R; // Syene at the top of the arc
  const surf = (x, curved) => (curved ? CY - Math.sqrt(R * R - (x - CX) * (x - CX)) : 800);
  const bandPath = (p) => { // p 0 = flat, 1 = curved; band 70 px thick between x 220..1700
    const top = [], bot = [];
    for (let i = 0; i <= N; i++) { const x = 220 + (1520 - 220) * i / N, yc = surf(x, true), y = 800 + (yc - 800) * p; top.push([x, y]); bot.push([x, y + 70]); }
    return 'M' + top.map((q) => q.map((v) => v.toFixed(1)).join(',')).join('L') + 'L' + bot.reverse().map((q) => q.map((v) => v.toFixed(1)).join(',')).join('L') + 'Z';
  };
  const diagG = X.scene('diagram', tDiag, tGlobe + 8 * F, (g0) => {
    const g = K.drift(g0, tDiag, tGlobe + 8 * F, { s1: 1.1, x1: 60, ox: 700, oy: 1000 });
    K.rect(g, -100, -100, 2120, 1280, C.night);
    for (let x = -80; x <= 2000; x += 80) K.rect(g, x, -80, 2, 1240, C.grid);
    for (let y = -80; y <= 1160; y += 80) K.rect(g, -80, y, 2080, 2, C.grid);
    const cam = X.cam(K.g(g));
    // the sun, then "so far away" → shrinks into the distance
    const sun = K.sun(cam, 960, 210, 120);
    X.pop(sun.g, tDiag + 2 * F, { dur: 5 * F, sfx: false });
    X.tl.to(sun.g, { scale: 0.16, y: 70, transformOrigin: '50% 50%', duration: 0.55, ease: 'power2.inOut' }, W('s4', 'far') - 0.05);
    X.sfx(W('s4', 'far') - 0.05, 'zoom_out', { dur: 0.55, gain: 0.35 });
    // parallel rays
    const rays = K.g(cam);
    for (let k = 0; k < 9; k++) {
      const x = 180 + k * 195, ray = K.path(rays, `M${x},${-40} L${x},${surf(x, false) - 2}`, 'none', { stroke: C.yellow, 'stroke-width': 8, 'stroke-dasharray': '26 16', 'stroke-linecap': 'round' });
      K.drawMasked(ray, W('s4', 'rays') + k * F * 0.8, 0.5, 'power1.in');
    }
    X.sfx(W('s4', 'rays'), 'swoosh', { dur: 0.5, gain: 0.3 });
    const pl = K.txt(g, 'PARALLEL', 1640, 140, { size: 84, fill: C.yellow, ls: 4 });
    X.pop(pl, W('s4', 'parallel') - 2 * F, { dur: 4 * F, sfx: 'blip_up' });
    X.tl.to(pl, { scale: 0, duration: 4 * F, ease: 'power2.in' }, W('s4', 'flat') - 0.1);
    // ground band (morphs flat → curved) + two sticks
    const band = K.path(cam, bandPath(0), C.sand);
    const bandTop = K.path(cam, '', 'none', { stroke: C.sandDark, 'stroke-width': 10 });
    const sticks = [[660, 'SYENE'], [1260, 'ALEXANDRIA']].map(([x, name]) => {
      const sg = K.g(cam); const st = K.stick(sg, 0, 0, 210, { col: '#E9EEF0', col2: '#fff', w: 18 });
      const labW = K.g(cam), lab = K.label(labW, x, 905, name, { size: 46, fill: C.coral });
      return { x, sg, st, lab, labW };
    });
    const shadow = K.path(cam, '', '#05090C', { opacity: 0.75 });
    const angleArc = K.path(cam, '', 'none', { stroke: C.coral, 'stroke-width': 9, 'stroke-linecap': 'round' });
    const angleTx = K.txt(cam, '7°', 0, 0, { size: 80, fill: C.coral });
    const state = { p: 0 };
    const apply = () => {
      const p = state.p;
      band.setAttribute('d', bandPath(p));
      let d = ''; for (let i = 0; i <= N; i++) { const x = 220 + 1300 * i / N, y = 800 + (surf(x, true) - 800) * p; d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + y.toFixed(1); }
      bandTop.setAttribute('d', d);
      for (const s of sticks) {
        const y = 800 + (surf(s.x, true) - 800) * p, th = Math.asin((s.x - CX) / R) * p * 180 / Math.PI;
        s.sg.setAttribute('transform', `translate(${s.x} ${y}) rotate(${th.toFixed(2)})`);
        s.labW.setAttribute('transform', `translate(0 ${(y - 800).toFixed(1)})`);
        s.th = th; s.y = y;
      }
      const A = sticks[1], th = A.th * Math.PI / 180, topX = A.x + Math.sin(th) * 210, topY = A.y - Math.cos(th) * 210;
      const shLen = 210 * Math.tan(th);
      shadow.setAttribute('d', p < 0.02 ? '' : `M${A.x},${A.y - 4} L${(A.x + shLen * Math.cos(th)).toFixed(1)},${(A.y + shLen * Math.sin(th) - 4).toFixed(1)} L${(A.x + shLen * Math.cos(th)).toFixed(1)},${(A.y + shLen * Math.sin(th) + 12).toFixed(1)} L${A.x},${A.y + 12} Z`);
      const r = 110;
      angleArc.setAttribute('d', p < 0.6 ? '' : `M${topX.toFixed(1)},${(topY + r).toFixed(1)} A${r},${r} 0 0 0 ${(topX - Math.sin(th) * r).toFixed(1)},${(topY + Math.cos(th) * r).toFixed(1)}`);
      angleTx.setAttribute('x', (topX - 95).toFixed(1)); angleTx.setAttribute('y', (topY + 150).toFixed(1));
    };
    apply();
    X.tl.to(state, { p: 0, duration: 0.01, onUpdate: apply }, tDiag);
    const tFlat = W('s4', 'flat') - 0.08;
    gsap.set([band, bandTop], { scaleX: 0, svgOrigin: '960 800' });
    X.tl.to([band, bandTop], { scaleX: 1, svgOrigin: '960 800', duration: 6 * F, ease: 'back.out(1.4)' }, tFlat);
    X.sfx(tFlat, 'stamp', { gain: 0.4 });
    sticks.forEach((s, i) => { gsap.set(s.st.inner, { scaleY: 0, svgOrigin: '0 0' }); X.tl.to(s.st.inner, { scaleY: 1, svgOrigin: '0 0', duration: 5 * F, ease: 'back.out(1.7)' }, tFlat + (4 + i * 3) * F); X.pop(s.lab, tFlat + (6 + i * 3) * F, { dur: 4 * F, sfx: false }); });
    const eq = K.txt(cam, '=', 960, 690, { size: 200, fill: '#fff' });
    X.pop(eq, W('s4', 'match') - 2 * F, { dur: 4 * F, sfx: 'blip' });
    const nx = K.pinkX(cam, 960, 630, 190);
    X.pop(nx, W('s4', "don't") - 2 * F, { dur: 4 * F, sfx: 'error', ease: 'back.out(2.2)' });
    const tCurve = W('s4', 'ground') - 0.05;
    X.tl.to([eq, nx], { scale: 0, duration: 4 * F, ease: 'power2.in' }, tCurve);
    X.tl.to(state, { p: 1, duration: 0.7, ease: 'power2.inOut', onUpdate: apply }, tCurve);
    X.tl.to(cam, { scale: 1.06, x: -40, y: -50, duration: 0.8, ease: 'power2.inOut' }, tCurve);
    X.sfx(tCurve, 'slide', { dur: 0.6, gain: 0.4 }); X.sfx(tCurve + 0.6, 'boing', { gain: 0.25, pitch: 1.3 });
    gsap.set(angleTx, { opacity: 0 }); X.tl.to(angleTx, { opacity: 1, duration: 3 * F }, tCurve + 0.6);
    const nts = K.txt(g, '*not to scale', 240, 1040, { italic: true, size: 30, fill: '#9FB4BE', upper: false, anchor: 'start' });
    gsap.set(nts, { opacity: 0 }); X.tl.to(nts, { opacity: 1, duration: 4 * F }, tCurve + 0.5);
    // S5 lead-in: zoom out and fade
    X.tl.to(cam, { scale: 0.45, y: -260, duration: 0.5, ease: 'power2.in' }, tGlobe - 0.15);
    X.tl.to(g, { opacity: 0, duration: 6 * F, ease: 'none' }, tGlobe + 0.1);
    X.sfx(tGlobe - 0.15, 'zoom_out', { dur: 0.5, gain: 0.3 });
  }, Lstory);
  K.diagWipe(diagG, tDiag, { frames: 12, angle: 18 });

  // ================================================================ S5 CLEAN DIAGRAM: 7° ≈ 1/50 of a circle (accurate angle)
  X.scene('fifty', tGlobe, tWalk + 10 * F, (g0) => {
    const g = K.drift(g0, tGlobe, tWalk + 10 * F, { s1: 1.08, x1: -110 });
    K.rect(g, -100, -100, 2120, 1280, C.night);
    for (let x = 0; x <= 1920; x += 80) K.rect(g, x, 0, 2, 1080, C.grid);
    for (let y = 0; y <= 1080; y += 80) K.rect(g, 0, y, 1920, 2, C.grid);
    const gx = 700, gy = 600, gr = 390;
    const all = K.g(g);
    gsap.set(all, { opacity: 0, scale: 1.25, svgOrigin: `${gx} ${gy}` });
    X.tl.to(all, { opacity: 1, scale: 1, svgOrigin: `${gx} ${gy}`, duration: 7 * F, ease: 'power2.out' }, tGlobe);
    K.globe(all, gx, gy, gr, { sea: C.sea, land: C.leaf, land2: '#4FB36A', blobs: [[-0.05, -0.72, 0.32, 0.2], [0.45, -0.2, 0.3, 0.45], [-0.5, 0.15, 0.3, 0.42], [0.1, 0.62, 0.3, 0.2]] });
    const a = 7.2 * Math.PI / 180, toXY = (th, r) => [gx + Math.sin(th) * r, gy - Math.cos(th) * r];
    // 50 slices (drawn around on "fiftieth")
    const slices = K.g(all);
    for (let k = 0; k < 50; k++) {
      const th = -a / 2 + k * a, [x1, y1] = toXY(th, gr);
      const ln = K.path(slices, `M${gx},${gy} L${x1.toFixed(1)},${y1.toFixed(1)}`, 'none', { stroke: '#fff', 'stroke-width': 2.5, opacity: 0.55 });
      gsap.set(ln, { opacity: 0 });
      X.tl.to(ln, { opacity: 0.55, duration: 2 * F }, W('s5', 'fiftieth') - 0.1 + k * 0.012);
    }
    X.sfx(W('s5', 'fiftieth') - 0.1, 'type', { dur: 0.6, gain: 0.3 });
    // highlighted wedge between Syene and Alexandria
    const wedge = (k, col) => { const [x1, y1] = toXY(-a / 2 + k * a, gr), [x2, y2] = toXY(a / 2 + k * a, gr); return K.path(all, `M${gx},${gy} L${x1.toFixed(1)},${y1.toFixed(1)} A${gr},${gr} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z`, col, { opacity: 0.92 }); };
    const w0 = wedge(0, C.coral);
    gsap.set(w0, { opacity: 0 });
    X.tl.to(w0, { opacity: 0.92, duration: 4 * F }, tGlobe + 0.15);
    // sticks + labels at the surface
    for (const [th, nm, dx] of [[-a / 2, 'S', -1], [a / 2, 'A', 1]]) {
      const [x, y] = toXY(th, gr);
      const sg = K.g(all); sg.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${(th * 180 / Math.PI).toFixed(2)})`);
      K.rect(sg, -4, -46, 8, 46, '#fff', 4);
      const lb = K.label(all, x + dx * 78, y - 84, nm, { size: 46, w: 76, fill: C.coral });
      X.pop(lb, tGlobe + (dx > 0 ? 6 : 3) * F, { dur: 4 * F, sfx: false });
    }
    const ac = K.path(all, `M${toXY(-a / 2, 90).join(',')} A90,90 0 0 1 ${toXY(a / 2, 90).join(',')}`, 'none', { stroke: C.yellow, 'stroke-width': 8 });
    X.drawOn(ac, W('s5', 'degrees') - 0.05, 5 * F);
    const sv = K.txt(all, '7°', gx + 90, gy - 40, { size: 76, fill: C.yellow, anchor: 'start' });
    X.pop(sv, W('s5', 'degrees') - 0.05, { dur: 4 * F, sfx: 'ding' });
    // right column: 7° ≈ 1/50
    const eqG = K.g(g);
    const t1 = K.txt(eqG, '7°', 1290, 470, { size: 210, fill: '#fff' });
    const t2 = K.txt(eqG, '≈', 1445, 455, { size: 140, fill: C.yellow });
    const t3 = K.txt(eqG, '1/50', 1640, 470, { size: 210, fill: C.coral });
    X.pop(t1, W('s5', 'Seven') + 0.1, { dur: 4 * F, sfx: false });
    X.pop(t2, W('s5', 'about') - F, { dur: 4 * F, sfx: false });
    X.pop(t3, W('s5', 'fiftieth') - 2 * F, { dur: 5 * F, sfx: 'stamp', ease: 'back.out(1.8)' });
    const sub = K.txt(eqG, 'OF A FULL CIRCLE', 1520, 560, { size: 64, fill: '#9FB4BE', ls: 4 });
    X.pop(sub, W('s5', 'circle') - 2 * F, { dur: 4 * F, sfx: false });
    // Syene→Alexandria arc glows, then ×50 sweep around the planet
    const hl = K.path(all, `M${toXY(-a / 2, gr + 14).join(',')} A${gr + 14},${gr + 14} 0 0 1 ${toXY(a / 2, gr + 14).join(',')}`, 'none', { stroke: C.yellow, 'stroke-width': 16, 'stroke-linecap': 'round' });
    X.drawOn(hl, W('s5', 'Syene') - 0.05, 0.4);
    X.sfx(W('s5', 'Syene'), 'blip_up', { gain: 0.3 });
    const sweepT = W('s5', 'way') - 0.1;
    for (let k = 1; k < 50; k++) {
      const wk = wedge(k, k % 2 ? C.yellow : C.coral);
      gsap.set(wk, { opacity: 0 });
      X.tl.to(wk, { opacity: 0.85, duration: 2 * F }, sweepT + k * 0.019);
    }
    X.sfx(sweepT, 'riser', { dur: 0.9, gain: 0.3 });
    X.tl.to(all, { rotation: 360, svgOrigin: `${gx} ${gy}`, duration: 1.1, ease: 'power2.inOut' }, sweepT);
    const x50 = K.txt(eqG, '× 50', 1520, 760, { size: 200, fill: C.yellow });
    X.pop(x50, W('s5', 'planet') - 2 * F, { dur: 5 * F, sfx: 'success', ease: 'back.out(2)' });
    K.loop(K.wrap(all), tGlobe + 0.4, tWalk, (t) => ({ y: 4 * Math.sin(t * 1.4) }));
  }, Lstory);

  // ================================================================ S6 WALKING: 5,000 stadia, ancient GPS, for weeks
  const walkG = X.scene('walk', tWalk, tMath + 10 * F, (g0) => {
    const g = K.drift(g0, tWalk, tMath + 10 * F, { s1: 1.07 });
    K.rect(g, 0, 0, 1920, 1080, C.mint);
    const sun = K.sun(g, 1660, 170, 62); K.loop(sun.rays, tWalk, tMath, (t) => ({ r: t * 12 }));
    const layer = (speed, build) => { const lg = K.g(g); const a = K.g(lg), b = K.g(lg); build(a, 0); build(b, 1920); K.loop(lg, tWalk, tMath, (t) => ({ x: -((t * speed) % 1920) })); return lg; };
    layer(30, (p, ox) => { K.cloud(p, ox + 300, 200, 0.8); K.cloud(p, ox + 1200, 140, 0.6); });
    layer(60, (p, ox) => { for (const [x, s] of [[360, 1], [620, 0.7], [1380, 0.85]]) { K.path(p, `M${ox + x - 160 * s},600 L${ox + x},${600 - 190 * s} L${ox + x + 160 * s},600 Z`, C.sandMid); K.path(p, `M${ox + x},${600 - 190 * s} L${ox + x + 160 * s},600 L${ox + x + 30 * s},600 Z`, C.sandDark); } K.rect(p, ox - 3, 596, 1926, 30, C.sandMid); });
    layer(140, (p, ox) => { K.rect(p, ox - 3, 620, 1926, 70, C.aqua); for (let k = 0; k < 6; k++) K.rect(p, ox + 60 + k * 320, 646, 100, 9, '#7FE0E0', 4); for (let k = 0; k < 4; k++) K.palm(p, ox + 200 + k * 480, 700, 0.75, { lean: k % 2 ? 14 : -14 }); for (let k = 0; k < 14; k++) K.path(p, `M${ox + k * 140},700 l14,-60 l14,60 Z`, C.leafDark); });
    layer(300, (p, ox) => { K.rect(p, ox - 3, 690, 1926, 400, C.sand); K.rect(p, ox - 3, 690, 1926, 14, C.sandMid); for (let k = 0; k < 5; k++) K.rect(p, ox + 100 + k * 380, 1000, 150, 14, C.sandMid, 7); for (let k = 0; k < 4; k++) K.ell(p, ox + 300 + k * 460, 920, 26, 12, C.sandDark); });
    const wk = K.figure(g, { x: 900, y: 975, h: 430, skin: '#B87B55', skinDark: '#9C6343', tunic: C.yellow, tunicDark: '#E8C04E', belt: C.coral, hairStyle: 'band', hair: '#2A1C15', band: C.coral, prop: 'staff' });
    const puffs = K.g(g);
    const pf = Array.from({ length: 4 }, (_, i) => K.circ(puffs, 0, 0, 1, '#FFF4DA'));
    X.every((t) => { // a sand puff kicks back from each footfall (every 0.3 s), drifting left with the ground
      const on = t >= tWalk && t <= tMath;
      pf.forEach((c, i) => {
        if (!on) { c.setAttribute('r', 0); return; }
        const k = Math.floor((t - tWalk) / 0.3) - i, age = (t - tWalk) - k * 0.3;
        if (k < 0 || age > 0.9) { c.setAttribute('r', 0); return; }
        const side = k % 2 ? 1 : -1;
        c.setAttribute('cx', (900 + side * 22 - age * 300).toFixed(1)); c.setAttribute('cy', (972 - age * 30).toFixed(1));
        c.setAttribute('r', (6 + age * 26).toFixed(1)); c.setAttribute('opacity', Math.max(0, 0.8 - age).toFixed(2));
      });
    });
    K.walk(wk, tWalk, tMath, { step: 0.3, amp: 24, keepArms: true });
    K.loop(wk.armL, tWalk, tMath, (t) => ({ r: -18 * Math.sin(t / 0.3 * Math.PI) }));
    const beard = K.path(wk.head, 'M-31,-38 L31,-38 L31,-20 Q24,20 0,30 Q-24,20 -31,-20 Z', '#2A1C15');
    gsap.set(beard, { scaleY: 0, svgOrigin: '0 -38' });
    // counter banner
    const ban = K.g(g); ban.setAttribute('transform', 'translate(960 160)');
    K.rect(ban, -440, -76, 880, 152, C.coral, 24); K.rect(ban, -440, 50, 880, 26, 'rgba(0,0,0,0.12)', 0);
    const num = K.txt(ban, '0', 70, 48, { size: 130, anchor: 'end' }); K.txt(ban, 'STADIA', 104, 48, { size: 130, anchor: 'start', fill: C.yellow });
    X.pop(ban, tWalk + 3 * F, { dur: 5 * F, sfx: 'pop', ease: 'back.out(1.5)' });
    X.countUp(num, 0, 5000, W('s6', 'five') - 0.05, 0.6, (v) => Math.round(v / 50) * 50 === 0 ? '0' : (Math.round(v / 50) * 50).toLocaleString('en-US'));
    X.sfx(W('s6', 'five') - 0.05, 'type', { dur: 0.55, gain: 0.25 }); X.sfx(W('s6', 'stadia'), 'coin', { gain: 0.3 });
    // footstep ticks while walking
    // GPS pin bobbing over his head
    const pin = K.g(g); pin.setAttribute('transform', 'translate(900 440)');
    const pinInner = K.g(pin); K.pin(pinInner, 0, 0, 0.9, C.red);
    const tagG = K.g(pinInner); K.rect(tagG, 50, -140, 130, 66, C.ink, 33); K.txt(tagG, 'GPS', 115, -92, { size: 48 });
    X.pop(pin, W('s6', 'GPS') - 2 * F, { dur: 5 * F, sfx: 'pop', ease: 'back.out(1.8)' });
    K.loop(pinInner, tWalk, tMath, (t, abs) => ({ y: -6 * Math.abs(Math.sin(abs / 0.3 * Math.PI)) }));
    X.tl.to(pin, { y: 390, duration: 3 * F, ease: 'power2.out' }, W('s6', 'guy') - F).to(pin, { y: 440, duration: 6 * F, ease: 'bounce.out' }, W('s6', 'guy') + 2 * F);
    X.sfx(W('s6', 'guy'), 'boing', { gain: 0.35 });
    // "For weeks": week pill flips, sun↔moon, beard grows
    const wkP = K.g(g); wkP.setAttribute('transform', 'translate(1640 360)');
    const pills = ['WEEK 1', 'WEEK 2', 'WEEK 3'].map((s, i) => { const pg = K.label(wkP, 0, 0, s, { size: 58, fill: C.ink }); gsap.set(pg, { opacity: 0 }); return pg; });
    const tW = W('s6', 'For') - 0.05;
    pills.forEach((pg, i) => { X.tl.set(pg, { opacity: 1 }, tW + i * 0.24); if (i < 2) X.tl.set(pg, { opacity: 0 }, tW + (i + 1) * 0.24); X.sfx(tW + i * 0.24, 'tick', { gain: 0.35, pitch: 1 + i * 0.1 }); });
    X.tl.to(beard, { scaleY: 1, svgOrigin: '0 -38', duration: 0.7, ease: 'power1.out' }, tW);
    const moon = K.g(g); moon.setAttribute('transform', 'translate(1660 170)'); K.circ(moon, 0, 0, 60, '#F5F8F8'); K.circ(moon, 24, -14, 50, C.mint);
    gsap.set(moon, { opacity: 0 });
    for (let i = 0; i < 3; i++) { X.tl.set(moon, { opacity: 1 }, tW + i * 0.24 + 0.12).set(moon, { opacity: 0 }, tW + i * 0.24 + 0.24); X.tl.set(sun.g, { opacity: 0 }, tW + i * 0.24 + 0.12).set(sun.g, { opacity: 1 }, tW + i * 0.24 + 0.24); }
  }, Lstory);
  K.diagWipe(walkG, tWalk, { frames: 9, angle: 24 });

  // ================================================================ S7 MATH (orange field): 50 × 5,000 → stadion? → darts → 40,000 km
  const field = (g) => { K.rect(g, 0, 0, 1920, 1080, C.orange); K.rect(g, 0, 0, 1920, 1080, X.radial('mathGlow', [[0, '#FFC067', 0.55], [1, '#F29227', 0]], 0.5, 0.45, 0.6)); const hp = K.hatch('mathHatch', null, 'rgba(255,255,255,0.13)', 30, 10); K.path(g, 'M0,0 L460,0 L0,460 Z', hp); K.path(g, 'M1920,1080 L1460,1080 L1920,620 Z', hp); };
  const mathG = X.scene('math', tMath, tReal + 10 * F, (g0) => {
    field(g0);
    const g = K.drift(g0, tMath, tReal + 10 * F, { s1: 1.07, x1: -30 });
    const eq = K.g(g);
    const a1 = K.txt(eq, '50', 640, 450, { size: 250 }), a2 = K.txt(eq, '×', 860, 440, { size: 180, fill: C.yellow }), a3 = K.txt(eq, '5,000', 1200, 450, { size: 250 });
    X.pop(a1, W('s7a', 'Fifty') - 2 * F, { dur: 3 * F, ease: 'back.out(1.4)', sfx: 'pop' });
    X.pop(a2, W('s7a', 'times') - 2 * F, { dur: 3 * F, ease: 'back.out(1.4)', sfx: 'pop', pitch: 1.15 });
    X.pop(a3, W('s7a', 'five') - 2 * F, { dur: 3 * F, ease: 'back.out(1.4)', sfx: 'pop', pitch: 1.3 });
    const b1 = K.txt(eq, '=', 330, 760, { size: 220, fill: C.yellow });
    const b2 = K.txt(eq, '0', 1150, 770, { size: 280, fill: C.yellow, anchor: 'end' });
    const b3 = K.txt(eq, 'STADIA', 1190, 770, { size: 150, anchor: 'start' });
    X.pop(b1, W('s7a', 'two') - 3 * F, { dur: 3 * F, sfx: false });
    gsap.set(b2, { opacity: 0 }); X.tl.set(b2, { opacity: 1 }, W('s7a', 'two') - 2 * F);
    X.countUp(b2, 0, 250000, W('s7a', 'two') - 2 * F, 0.85, (v) => (Math.round(v / 1000) * 1000).toLocaleString('en-US'), 'power2.out');
    X.sfx(W('s7a', 'two') - 2 * F, 'riser', { dur: 0.8, gain: 0.25 });
    X.pop(b3, W('s7a', 'stadia') - 2 * F, { dur: 4 * F, sfx: 'success', ease: 'back.out(1.8)' });
    const mcam = X.cam(eq.parentNode.insertBefore(K.g(null), eq)); mcam.appendChild(eq);
    ['Fifty', 'times', 'five'].forEach((w, i) => X.tl.to(mcam, { scale: 1.03 + i * 0.03, duration: 4 * F, ease: 'back.out(2)' }, W('s7a', w) - 2 * F));
    X.tl.to(mcam, { scale: 1.08, x: -70, y: -30, duration: 0.8, ease: 'power2.out' }, W('s7a', 'two') - 2 * F)
      .to(mcam, { scale: 1, x: 0, y: 0, duration: 6 * F, ease: 'power3.inOut' }, L('s7b').start - 0.05);
    // stadion length is uncertain → wobbling ruler; equation tucks up
    const tDep = L('s7b').start - 0.05;
    X.tl.to(eq, { scale: 0.42, x: 560, y: 20, svgOrigin: '0 0', duration: 6 * F, ease: 'power3.inOut' }, tDep);
    X.sfx(tDep, 'swoosh', { dur: 0.3, gain: 0.3 });
    const rl = K.ruler(g, 210, 690, 760, { fill: C.cream });
    const rq = K.txt(g, '1 STADION = ?', 590, 560, { size: 96, fill: C.ink });
    X.pop(rq, tDep + 4 * F, { dur: 4 * F, sfx: false });
    gsap.set(rl.inner, { scaleX: 0, svgOrigin: '0 0' });
    X.tl.to(rl.inner, { scaleX: 1, svgOrigin: '0 0', duration: 6 * F, ease: 'back.out(1.5)' }, tDep + 2 * F)
      .to(rl.inner, { scaleX: 1.22, svgOrigin: '0 0', duration: 7 * F, ease: 'power2.inOut' }, W('s7b', 'stadion') - 0.05)
      .to(rl.inner, { scaleX: 0.84, svgOrigin: '0 0', duration: 7 * F, ease: 'power2.inOut' }, W('s7b', 'was') - 0.1)
      .to(rl.inner, { scaleX: 1.06, svgOrigin: '0 0', duration: 8 * F, ease: 'back.out(2)' }, W('s7b', "that's") - 0.05);
    X.sfx(W('s7b', 'stadion') - 0.05, 'boing', { gain: 0.3, pitch: 0.9 }); X.sfx(W('s7b', 'was') - 0.1, 'boing', { gain: 0.25, pitch: 1.2 });
    // dartboard: pretty close, then dead on
    const db = K.dartboard(g, 1440, 690, 210);
    X.pop(db, W('s7b', 'somewhere') - 0.05, { dur: 5 * F, sfx: 'pop', ease: 'back.out(1.6)' });
    const dart = (tx, ty, t, label, lx, ly) => {
      const d = K.dart(g, tx, ty, 1.15); gsap.set(d.inner, { x: 1100, y: -260, rotation: -14 });
      X.tl.to(d.inner, { x: 0, y: 0, rotation: -14, duration: 4 * F, ease: 'power2.in' }, t - 4 * F).to(d.inner, { rotation: -10, duration: 3 * F, ease: 'back.out(4)' }, t);
      X.sfx(t, 'thud', { gain: 0.6 });
      const lb = K.txt(g, label, lx, ly, { size: 56, fill: C.ink, ls: 2 }); X.pop(lb, t + F, { dur: 4 * F, sfx: false });
    };
    dart(1440 + 92, 690 - 70, W('s7b', 'close'), 'PRETTY CLOSE', 1630, 450);
    dart(1440, 690, W('s7b', 'dead'), 'DEAD ON', 1440, 960);
    X.sfx(W('s7b', 'on') + 0.05, 'ding', { gain: 0.35 });
  }, Lstory);
  K.diagWipe(mathG, tMath, { frames: 9, angle: -20 });
  const realG = X.scene('real', tReal, tFinal + 10 * F, (g0) => {
    field(g0);
    const g = K.drift(g0, tReal, tFinal + 10 * F, { s1: 1.13, oy: 700 });
    const glW = K.g(g); const gl = K.globe(glW, 960, 520, 300, { sea: C.sea, land: C.leaf });
    X.pop(glW, tReal + 2 * F, { dur: 6 * F, sfx: false, ease: 'back.out(1.4)' });
    const q = K.txt(g, '?', 1380, 330, { size: 220, fill: '#fff' });
    X.pop(q, W('s7b', 'answer') - 2 * F, { dur: 4 * F, sfx: 'blip_up' });
    X.tl.to(q, { scale: 0, duration: 4 * F, ease: 'power2.in' }, W('s7b', 'About') - 0.05);
    const tapeBack = K.path(g, 'M1300,520 A340,70 0 0 0 620,520', 'none', { stroke: '#D9B53E', 'stroke-width': 14, 'stroke-dasharray': '34 16', 'stroke-linecap': 'round' });
    glW.parentNode.insertBefore(tapeBack, glW);
    const tapeFront = K.path(g, 'M620,520 A340,70 0 0 0 1300,520', 'none', { stroke: C.yellow, 'stroke-width': 16, 'stroke-dasharray': '34 16', 'stroke-linecap': 'round' });
    K.drawMasked(tapeFront, W('s7b', 'About') - 0.05, 0.35, 'power1.in');
    K.drawMasked(tapeBack, W('s7b', 'About') + 0.3, 0.3, 'power1.out');
    K.loop(gl.land, tReal, tFinal, (t) => ({ x: -t * 22 }));
    X.sfx(W('s7b', 'About') - 0.05, 'zoom_in', { dur: 0.5, gain: 0.25 });
    const pill = K.g(g); pill.setAttribute('transform', 'translate(960 940)');
    K.rect(pill, -380, -84, 760, 168, C.ink, 84);
    const n = K.txt(pill, '0', 130, 52, { size: 150, anchor: 'end', fill: C.yellow }); K.txt(pill, 'KM', 170, 52, { size: 150, anchor: 'start' });
    K.txt(pill, '≈', -290, 46, { size: 120, fill: '#fff' });
    X.pop(pill, W('s7b', 'forty') - 3 * F, { dur: 5 * F, sfx: 'pop', ease: 'back.out(1.6)' });
    X.countUp(n, 0, 40000, W('s7b', 'forty') - 2 * F, 0.55, (v) => (Math.round(v / 1000) * 1000).toLocaleString('en-US'));
    X.sfx(WE('s7b', 'kilometres') - 0.1, 'success', { gain: 0.3 });
  }, Lstory);
  K.diagWipe(realG, tReal, { frames: 9, angle: 30 });

  // ================================================================ S8 FINAL TABLEAU: a stick, a well, sore feet → "Thanks, Daydream!"
  const finalG = X.scene('final', tFinal, tHostB + 2 * F, (g0) => {
    const g = K.drift(g0, tFinal, tHostB, { s1: 1.11, x1: 60 });
    K.rect(g, -100, -100, 2120, 1280, C.mint);
    const sun = K.sun(g, 1680, 170, 70); K.loop(sun.rays, tFinal, tHostB, (t) => ({ r: t * 12 }));
    K.cloud(g, 420, 190, 0.85); K.cloud(g, 1150, 140, 0.6);
    K.birds(g, tFinal, tHostB, { x: 200, y: 330, speed: 120, n: 3, seed: 11 });
    K.dunes(g, 640, [C.sandMid], { amp: 40 });
    K.rect(g, 0, 700, 1920, 400, C.sand); K.rect(g, 0, 700, 1920, 14, C.sandMid);
    for (let k = 0; k < 5; k++) K.rect(g, 100 + k * 380, 1000, 150, 14, C.sandMid, 7);
    K.palm(g, 120, 900, 1.2, { lean: 20 }); K.palm(g, 1820, 880, 1.1, { lean: -20 });
    const wl = K.well(g, 470, 840, { cutaway: false, w: 150 });
    X.pop(wl.g, W('s8', 'well') - 2 * F, { dur: 5 * F, sfx: 'pop', ease: 'back.out(1.6)', origin: '50% 100%' });
    const er = erato(g, 960, 930, 420, { prop: 'none' });
    const st = K.stick(er.armR, 0, 230, 260); st.g.setAttribute('transform', 'translate(0 150) rotate(180)');
    gsap.set(er.armR, { rotation: 0 });
    X.tl.to(er.armR, { rotation: -150, duration: 5 * F, ease: 'back.out(1.8)' }, W('s8', 'stick') - 3 * F);
    X.sfx(W('s8', 'stick') - 3 * F, 'sparkle', { dur: 0.4, gain: 0.3 });
    // sitting walker with throbbing feet
    const wk = K.figure(g, { x: 1450, y: 950, h: 340, skin: '#B87B55', skinDark: '#9C6343', tunic: C.yellow, tunicDark: '#E8C04E', belt: C.coral, hairStyle: 'band', hair: '#2A1C15', band: C.coral, beard: '#2A1C15', beardLen: 4 });
    wk.body.setAttribute('transform', 'translate(0 120)');
    gsap.set(wk.legL, { rotation: -80 }); gsap.set(wk.legR, { rotation: -88 });
    const feet = K.g(g);
    for (const [fx, fy] of [[1592, 948], [1600, 972]]) { K.circ(feet, fx, fy, 26, C.red, { opacity: 0.9 }); K.circ(feet, fx, fy, 13, '#FF8A7A'); }
    for (let k = 0; k < 3; k++) K.path(feet, `M${1640},${920 + k * 30} l46,${-20 + k * 20}`, 'none', { stroke: C.red, 'stroke-width': 8, 'stroke-linecap': 'round' });
    gsap.set([wk.g, feet], { opacity: 0 });
    X.tl.set([wk.g, feet], { opacity: 1 }, W('s8', 'sore') - 3 * F);
    X.pop(feet, W('s8', 'sore') - 3 * F, { dur: 5 * F, sfx: 'boing', ease: 'back.out(2.5)' });
    K.loop(K.wrap(feet), tFinal, tHostB, (t, abs) => ({ s: 1 + 0.08 * Math.max(0, Math.sin(abs * 9)) }), 1600, 960);
    gsap.set(wk.armR, { rotation: -42, svgOrigin: '0 0' }); gsap.set(wk.armL, { rotation: -30, svgOrigin: '0 0' });
    // wave on "Thanks"
    X.tl.to(er.armL, { rotation: 150, duration: 4 * F, ease: 'back.out(1.6)' }, W('s8', 'Thanks') - 2 * F);
    for (let i = 0; i < 3; i++) X.tl.to(er.armL, { rotation: i % 2 ? 150 : 125, duration: 3 * F, ease: 'sine.inOut' }, W('s8', 'Thanks') + 2 * F + i * 3 * F);
    X.sfx(W('s8', 'Thanks') - 2 * F, 'chime', { dur: 0.5, gain: 0.25 });
  }, Lstory);

  K.diagWipe(finalG, tFinal, { frames: 9, angle: -24 });

  // ================================================================ HOST B (wide) + 2012 stripe keyword card + beta diamond
  X.scene('hostB', tHostB, null, (g) => {
    const cam = X.cam(K.g(g));
    const set = K.hostSet(cam);
    const host = K.host(set.mid, { front: set.front });
    K.hostTalk(host, ['hostB'], { blinkPhase: 1.1 });
    // mid-gesture on arrival (X2 exit reveals the host already moving)
    gsap.set(host.armR.fore, { rotation: 40, svgOrigin: '0 0' });
    X.tl.to(host.armR.fore, { rotation: 0, svgOrigin: '0 0', duration: 8 * F, ease: 'power2.inOut' }, tHostB + 0.2);
    X.tl.to(host.armL.fore, { rotation: -30, svgOrigin: '0 0', duration: 5 * F, ease: 'back.out(1.6)' }, W('hostB', 'remember') - 0.1)
      .to(host.armL.fore, { rotation: -62, svgOrigin: '0 0', duration: 5 * F, ease: 'back.out(1.6)' }, W('hostB', 'planet') - 0.1);
    X.tl.to(host.brows, { y: -10, duration: 3 * F }, W('hostB', 'Beta') - 0.1);
    const card = K.stripeSwipe(Lfx, W('hostB', 'second') - 0.05, { word: 'SECOND BEST', hold: 0.95, colA: C.magenta, colB: C.aubergine });
    K.diamond(Lover, Math.max(card.tOut + 4 * F, W('hostB', 'Beta')), null, {
      x: 360, y: 540, size: 360, fill: C.pink, hatch: 'rgba(255,255,255,0.16)', panel: [C.magenta, 'rgba(255,255,255,0.2)'],
      icon: (ig) => { K.circ(ig, 0, 0, 92, '#fff'); K.beta(ig, 0, 4, 120, C.pink); },
    });
    const gb = K.badge(Lover, 560, 330, 62, (bg) => K.globe(bg, 0, 0, 44, { sea: C.sea, land: C.leaf }));
    X.pop(gb, W('hostB', 'planet') - 2 * F, { dur: 5 * F, sfx: 'pop', pitch: 1.3, ease: 'back.out(2)' });
  }, Lhost);

  X.end(END);
});
