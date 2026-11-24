// TED-Ed-formula sample: "How does penicillin kill germs but not us?" — S1 soft-glow pastel cel, characters on twos.
// Wrapper: ident 0–1.21 s → epigraph to 5.80 s → 1 white frame → 20-frame fade from white → VO at 7.0 s → credit bar T−8.5 s.
X.boot(async (X) => {
  await X.loadVO();
  K.initTwos(12);
  const P = K.PAL.S1, F = K.F, S = X.svg;
  const L = (id) => X.line(id), w = (id, word, n) => X.word(id, word, n);
  const END = Math.max(72.6, L('callback').end + 7.1);
  K.layer = S('g', { id: 'scenes' });
  K.fx = S('g', { id: 'fx' });
  K.look({ grain: 0.12, vignette: 0.42, boilScale: 2.6 });

  // ------------------------------------------------------------------ wrapper
  K.ident({ t1: 1.21 });
  K.epigraph({ lines: ['“In the fields of observation, chance favors', 'only the prepared mind.”'], author: 'Louis Pasteur', work: 'inaugural lecture, Lille, 1854' });
  K.whiteFade({ t: 5.8, frames: 20 });
  const tCred = END - 8.5;
  K.credits({ t0: tCred, t1: END, size: 26, badge: '#1E7F7A', pages: [
    [{ role: 'Educator', name: 'Imogen Hale' }, { role: 'Director', name: 'Paperlamp Studio' }, { role: 'Narrator', name: 'Kokoro · af_heart' },
     { role: 'Composer & Sound Designer', name: 'Engine Score' }, { role: 'Script Editor', name: 'Theo Marsh' }],
    [{ role: 'Executive Producer', name: 'Lena Ortiz' }, { role: 'Producer', name: 'Sam Whitlow' }, { role: 'Art Direction', name: 'Paperlamp Studio' },
     { role: 'Fact Check', name: 'Priya Anand' }, { role: 'Animation', name: 'Drawn on twos' }],
  ] });

  // ------------------------------------------------------------------ beat times (all hung on narration words)
  const tW2 = w('a1', 'cluttered') - 0.28;              // T3 brush wipe → lab bench
  const tZ3 = w('a2', 'dish') - 0.2, tC3 = tZ3 + F(10); // T7 push into the dish → cut to top view
  const tInk = L('reveal').start - 0.45, tC4 = tInk + F(12); // T4 ink-edge drop → night "planet"
  const tP1 = L('pivot').start - 0.35, tP2 = w('pivot', 'but') - 0.12; // T6 panels slide up
  const tSO = L('wall').start - 0.3;                    // T5 slide-off → single bacterium
  const tZ7 = w('wall', 'mesh') - 0.5, tC7 = tZ7 + F(10); // T7 push into the wall → mesh
  const tW8 = L('mimic').start - 0.3;                   // T3 → enzyme vs penicillin
  const tC9 = L('burst').start - 0.25;                  // T1 hard cut → bursting cell
  const tW10 = L('us').start - 0.3;                     // T3 → human cells
  const tC11 = L('wider').start - 0.12;                 // T1 hard cut → factory
  const tPan = w('wider', 'turning') - 0.3;             // T9 pan → hospital
  const tW12 = L('callback').start - 0.45;              // T3 → callback: the bench at night
  const bw = F(8);
  const blinks = (rig, t0, t1, seed = 1) => { const r = X.rand(seed); const ts = []; for (let t = t0 + 0.8 + r(); t < t1 - 0.3; t += 2.6 + r() * 1.6) ts.push(t); K.blink(rig, ts); };

  // ------------------------------------------------------------------ shared builders
  const fleming = (parent, o) => K.person(parent, Object.assign({ h: 520, bowtie: true, colors: { hair: '#8C7B6B', tie: '#50393E' } }, o));
  function lab(cam, night) {
    const wall = night ? '#3A3142' : '#A3CBD1';
    // window with the city outside
    const win = S('g', {}, cam);
    S('rect', { x: 150, y: 120, width: 470, height: 440, rx: 6, fill: night ? '#2A2333' : '#8FA9AD' }, win);
    const sky = S('g', {}, win);
    S('rect', { x: 172, y: 142, width: 426, height: 396, fill: night ? P.nightDeep : '#B784AA' }, sky);
    if (night) { S('circle', { cx: 500, cy: 230, r: 34, fill: '#F3E9D2', filter: K.glow('moonGlow', 10, '#FFF6EC', 0.6) }, sky); }
    else S('circle', { cx: 480, cy: 300, r: 44, fill: '#F0C9A8', opacity: 0.9 }, sky);
    const cp = S('clipPath', { id: night ? 'winN' : 'winD' }, X.defs); S('rect', { x: 172, y: 142, width: 426, height: 396 }, cp);
    const city = S('g', { 'clip-path': `url(#${night ? 'winN' : 'winD'})` }, win);
    const rt = K.rooftops(city, { y: 470, color: night ? '#1A111F' : '#8E6E8E', seed: 6, x0: 140, x1: 640, hmin: 30, hvar: 60, windows: night, windowColor: '#F3D9A4' });
    rt.windows.forEach((wd) => wd.setAttribute('opacity', 0.9));
    S('rect', { x: 377, y: 142, width: 16, height: 396, fill: night ? '#2A2333' : '#8FA9AD' }, win);
    S('rect', { x: 172, y: 330, width: 426, height: 14, fill: night ? '#2A2333' : '#8FA9AD' }, win);
    // shelf with jars
    S('rect', { x: 1180, y: 300, width: 600, height: 18, rx: 4, fill: night ? '#2A2333' : '#8FA9AD' }, cam);
    [[1240, 0.55, '#C9787F'], [1340, 0.45, '#8FB8B0'], [1440, 0.6, '#D9B98A'], [1560, 0.4, '#C9787F'], [1680, 0.5, '#8FB8B0']].forEach(([x, s, c]) => K.flask(cam, { x, y: 296, s, liquid: c }));
    return { wall, win };
  }
  function bench(cam, night) {
    const g = S('g', {}, cam);
    S('rect', { x: -260, y: 700, width: 2440, height: 40, fill: night ? '#7A5A2C' : P.ochre }, g);
    S('rect', { x: -260, y: 740, width: 2440, height: 500, fill: night ? '#4A3620' : '#8A6530' }, g);
    for (let i = 0; i < 9; i++) S('path', { d: `M${-200 + i * 260},760 L${-200 + i * 260},1100`, stroke: night ? '#3A2A18' : '#7A5728', 'stroke-width': 6, opacity: 0.6 }, g);
    K.dishStack(g, { x: 1260, y: 702, n: 6, seed: 3 });
    K.dishStack(g, { x: 1450, y: 702, n: 4, seed: 8, s: 0.9 });
    K.flask(g, { x: 1660, y: 700, s: 1.1, liquid: '#C9787F' });
    K.flask(g, { x: 1800, y: 700, s: 0.75, liquid: '#8FB8B0' });
    // papers + test-tube rack
    S('path', { d: 'M180,700 L420,690 L440,702 L196,712 Z', fill: '#F3EEE4', opacity: 0.95 }, g);
    S('path', { d: 'M230,693 L430,686', stroke: '#B7AFA6', 'stroke-width': 3 }, g);
    S('rect', { x: 470, y: 640, width: 170, height: 16, rx: 4, fill: night ? '#3A2A18' : '#6B4A2A' }, g);
    [490, 525, 560, 595, 625].forEach((x, i) => S('rect', { x: x - 8, y: 600 + (i % 2) * 10, width: 16, height: 100 - (i % 2) * 10, rx: 8, fill: '#EEF4F2', opacity: 0.6 }, g));
    return g;
  }
  const smallDish = (parent, glow) => {
    const g = S('g', {}, parent);
    S('ellipse', { cx: 0, cy: 0, rx: 52, ry: 16, fill: '#F3F1EC', opacity: 0.8, filter: glow ? K.glow('dishGlow', 12, '#F4F8EC', 0.85) : undefined }, g);
    S('ellipse', { cx: 0, cy: -2, rx: 44, ry: 12, fill: P.honey }, g);
    S('ellipse', { cx: -10, cy: -3, rx: 12, ry: 5, fill: '#DDE6D0' }, g);
    [[18, -2], [28, 2], [-30, 1], [8, 5]].forEach(([x, y]) => S('circle', { cx: x, cy: y, r: 3, fill: P.brick }, g));
    return g;
  };

  // =================================================================== C1 — London, September 1928 (fade from white)
  {
    const { cam } = K.stage('c1', 5.8, tW2 + bw, '#B784AA', { seed: 4 });
    S('circle', { cx: 1420, cy: 420, r: 120, fill: '#F0C9A8', opacity: 0.85, filter: K.glow('sunGlow', 30, '#F6D8BE', 0.6) }, cam);
    const clouds = S('g', { opacity: 0.45 }, cam);
    [[380, 220, 160], [600, 250, 110], [1180, 180, 140], [1650, 260, 120]].forEach(([x, y, r]) => { S('ellipse', { cx: x, cy: y, rx: r, ry: r * 0.28, fill: '#E8D7DF' }, clouds); S('ellipse', { cx: x + r * 0.4, cy: y - r * 0.12, rx: r * 0.6, ry: r * 0.25, fill: '#E8D7DF' }, clouds); });
    const far = K.rooftops(cam, { y: 690, color: '#8E6E8E', seed: 12, hmin: 60, hvar: 110 }).g;
    const near = K.rooftops(cam, { y: 820, color: P.plum, seed: 3, hmin: 90, hvar: 150, windows: true, windowColor: '#F3D9A4' });
    S('rect', { x: -260, y: 905, width: 2440, height: 400, fill: '#3B2E3A' }, cam);
    S('rect', { x: -260, y: 905, width: 2440, height: 10, fill: '#5A4558' }, cam);
    // lamp-post
    S('rect', { x: 1240, y: 600, width: 12, height: 310, fill: '#2A2030' }, cam);
    S('path', { d: 'M1222,600 L1270,600 L1260,566 L1232,566 Z', fill: '#2A2030' }, cam);
    const lampL = S('circle', { cx: 1246, cy: 584, r: 14, fill: '#F7E2B0', filter: K.glow('lampGlow', 14, '#F7E2B0', 0.8), opacity: 0 }, cam);
    // a few birds crossing the dusk sky, wings flapping on twos
    for (let i = 0; i < 5; i++) {
      const bg = S('g', { transform: `translate(${300 + i * 90},${300 + (i % 2) * 40 + i * 12})` }, cam);
      const bi = S('path', { d: 'M-16,0 Q-8,-9 0,0 Q8,-9 16,0', stroke: '#5A4256', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, bg);
      K.twos.fromTo(bi, { scaleY: 1, svgOrigin: '0 0' }, { scaleY: -0.6, duration: F(4), yoyo: true, repeat: 15, ease: 'sine.inOut', immediateRender: false }, 5.8 + i * 0.08);
      K.twos.fromTo(bi, { x: 0, y: 0 }, { x: 900, y: -120, duration: 6.4, ease: 'none', immediateRender: false }, 5.8);
    }
    // chimney smoke (on twos)
    const smoke = S('g', { opacity: 0.55 }, cam);
    for (let i = 0; i < 6; i++) { const c = S('circle', { cx: 420 + (i % 3) * 520, cy: 600, r: 18, fill: '#D8C6D4' }, smoke); K.twos.fromTo(c, { y: 0, x: 0, scale: 0.6, opacity: 0.8, transformOrigin: '50% 50%' }, { y: -230, x: 60, scale: 2.2, opacity: 0, duration: 4.2, ease: 'none', repeat: 1, delay: (i % 3) * 1.1 + Math.floor(i / 3) * 2.1 }, 5.8); }
    // Fleming walks home from holiday, suitcase in hand
    const f = K.person(cam, { x: 330, y: 1010, h: 360, bowtie: true, colors: { hair: '#8C7B6B' } });
    const case_ = S('g', { transform: 'rotate(8) translate(0,8)' }, f.handF);
    S('rect', { x: -40, y: 0, width: 80, height: 58, rx: 8, fill: '#6B4A3A' }, case_);
    S('path', { d: 'M-14,0 Q0,-16 14,0', stroke: '#3B2E2A', 'stroke-width': 6, fill: 'none' }, case_);
    S('rect', { x: -40, y: 24, width: 80, height: 6, fill: '#57392C' }, case_);
    K.walk(f, 5.8, tW2 + bw, { step: 0.42, swing: 20, holdFront: true, dx: 560 });
    blinks(f, 5.8, tW2, 3);
    // idle life: windows light one by one, lamp flickers on
    near.windows.forEach((wd, i) => K.twos.to(wd, { opacity: 0.95, duration: F(2) }, 7.2 + i * 0.35));
    K.twos.to(lampL, { opacity: 1, duration: F(2) }, w('a1', 'Alexander'));
    X.tl.fromTo(far, { x: 0 }, { x: -22, duration: tW2 - 5.8, ease: 'none', immediateRender: false }, 5.8);
    K.push(cam, 5.8, tW2 + bw, { from: 1.0, to: 1.06, x0: 40, x1: -170 });
  }

  // =================================================================== C2 — the cluttered bench (T3 brush wipe)
  let c2dish;
  {
    const { g, cam } = K.stage('c2', tW2, tC3, '#A3CBD1', { seed: 7 });
    K.brushWipe(g, tW2, { seed: 5 });
    lab(cam, false);
    const f = fleming(cam, { x: 800, y: 880, mouth: 'flat' });
    bench(cam, false);
    const onBench = smallDish(cam); onBench.setAttribute('transform', 'translate(985,702)');
    const inHand = S('g', { transform: 'rotate(130) translate(0,-16)', opacity: 0 }, f.handF); smallDish(inHand);
    gsap.set(f.head, { rotation: 6 });
    K.pose(f, tW2 + 0.3, { head: 10, lean: 3 }, { frames: 10 });
    K.pose(f, w('a2', 'On') - 0.1, { armF: -45, foreF: -12, head: 16, lean: 6 }, { frames: 8 });
    const tLift = w('a2', 'forgotten') + 0.1;
    K.twos.set(onBench, { opacity: 0 }, tLift); K.twos.set(inHand, { opacity: 1 }, tLift);
    K.pose(f, tLift, { armF: -72, foreF: -58, head: 4, lean: 0, mouth: 'oh' }, { frames: 8 });
    K.blink(f, [tW2 + 1.1]);
    K.push(cam, tW2, tZ3, { from: 1.0, to: 1.06, x0: 40, x1: -30, y1: 10 });
    K.zoomThrough(cam, tZ3, { cx: 985, cy: 552, scale: 1.65, base: 1.06, center: true });
    c2dish = inHand;
  }

  // =================================================================== C3 — the dish from above: mold + vanishing bacteria
  {
    const { cam } = K.stage('c3', tC3, tC4, P.ochre, { seed: 9, strength: 0.1 });
    for (let i = 0; i < 14; i++) S('path', { d: `M-260,${-60 + i * 90} Q960,${-20 + i * 90 + (i % 3) * 18} 2180,${-70 + i * 90}`, stroke: '#946B2F', 'stroke-width': 3 + (i % 3), fill: 'none', opacity: 0.45 }, cam);
    const M = { x: -110, y: -70 };
    const turn = S('g', {}, cam); gsap.set(turn, { svgOrigin: '960 540' });
    X.tl.fromTo(turn, { rotation: 0 }, { rotation: -14, duration: tC4 - tC3, ease: 'none', immediateRender: false }, tC3);
    const dish = K.dish(turn, { x: 960, y: 540, r: 400, n: 90, seed: 13, avoid: { x: M.x, y: M.y, r: 150 } });
    const halo = S('circle', { cx: M.x, cy: M.y, r: 275, fill: '#F2E6C2', opacity: 0 }, dish.g);
    dish.g.insertBefore(halo, dish.g.children[4]);
    const mold = K.mold(dish.g, { x: M.x, y: M.y, r: 125, seed: 5 });
    const tMold = w('a2', 'mold');
    K.twos.fromTo(mold.inner, { scale: 0.15, rotation: -20 }, { scale: 1, rotation: 0, duration: 0.9, ease: 'power2.out', immediateRender: false }, tMold - 0.2);
    gsap.set(mold.inner, { scale: 0.15 });
    X.sfx(tMold, 'bubble', { gain: 0.14 });
    const tAround = w('a2', 'around'), tGone = w('a2', 'vanished') + 0.25;
    K.twos.to(halo, { opacity: 0.75, duration: tGone - tAround, ease: 'power1.inOut' }, tAround);
    dish.cols.filter((c) => c.d < 275).forEach((c) => {
      const tt = tAround + (c.d - 150) / 125 * (tGone - tAround - 0.3);
      K.twos.to(c.el, { scale: 0.2, opacity: 0, transformOrigin: '50% 50%', duration: F(6), ease: 'power2.in' }, tt);
    });
    X.sfx(tAround + 0.4, 'sparkle', { gain: 0.12 });
    // idle: the outer colonies breathe a little
    dish.cols.filter((c) => c.d >= 275).forEach((c, i) => K.twos.fromTo(c.el, { scale: 1, transformOrigin: '50% 50%' }, { scale: 1.12, duration: 1.2, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, tC3 + (i % 7) * 0.17));
    K.motes(cam, tC3, tC4, { n: 16, color: '#EEF3E6', speed: 40, angle: -60, seed: 4, box: [500, 200, 700, 600] });
    const tAr = w('a2', 'around') - 0.35;
    K.push(cam, tC3, tAr, { from: 1.0, to: 1.04, x1: 20, y1: 10 });
    X.tl.to(cam, { scale: 1.24, x: (110 + 6) * 1.24, y: (59) * 1.24, duration: F(14), ease: 'power2.inOut' }, tAr);
    X.tl.to(cam, { scale: 1.3, x: 150, y: 80, duration: tC4 - tAr - F(14), ease: 'none' }, tAr + F(14));
    X.sfx(tAr, 'zoom_in', { gain: 0.1 });
  }

  // =================================================================== C4 — night field, the glowing colony, PENICILLIN (T4 ink drop)
  {
    K.inkDrop(tInk, { color: P.night, seed: 23 });
    const { cam } = K.stage('c4', tC4, tP2 + F(6), P.night, { seed: 11, strength: 0.12 });
    const C = { x: 960, y: 455, r: 285 };
    S('circle', { cx: C.x, cy: C.y, r: C.r + 6, fill: '#FFF6EC', opacity: 0.55, filter: K.glow('planetGlow', 26, '#FFF6EC', 0.6) }, cam);
    S('circle', { cx: C.x, cy: C.y, r: C.r, fill: K.speckle('spAgar2', '#E9D7A2', '#C4AB70', { n: 55, seed: 41 }) }, cam);
    S('circle', { cx: C.x, cy: C.y, r: C.r, fill: X.radial('planetShade', [[0, '#000', 0], [0.7, '#000', 0], [1, '#5A3A20', 0.45]]) }, cam);
    const cp = S('clipPath', { id: 'planetClip' }, X.defs); S('circle', { cx: C.x, cy: C.y, r: C.r - 4 }, cp);
    const inside0 = S('g', { 'clip-path': 'url(#planetClip)' }, cam);
    const inside = S('g', {}, inside0); gsap.set(inside, { svgOrigin: `${C.x} ${C.y}` });
    X.tl.fromTo(inside, { rotation: 0 }, { rotation: 18, duration: tP2 - tC4, ease: 'none', immediateRender: false }, tC4);
    K.motes(cam, tC4, tP2 + F(6), { n: 26, color: '#F3E3C8', speed: 22, angle: -80, seed: 9, rmin: 2, rmax: 5, opacity: 0.5 });
    const mold = K.mold(inside, { x: C.x - 20, y: C.y + 10, r: 150, seed: 8 });
    K.twos.fromTo(mold.inner, { rotation: -4 }, { rotation: 4, duration: 2.2, yoyo: true, repeat: 2, ease: 'sine.inOut', immediateRender: false }, tC4);
    // penicillin seeping out: hot-pink droplets drifting outward (on twos)
    const r = X.rand(77), tLeak = w('reveal', 'leaking');
    for (let i = 0; i < 22; i++) {
      const a = r() * Math.PI * 2, d0 = 40 + r() * 50, d1 = 170 + r() * 110;
      const dr = S('circle', { cx: C.x - 20 + Math.cos(a) * d0, cy: C.y + 10 + Math.sin(a) * d0, r: 7 + r() * 7, fill: P.hot, opacity: 0, filter: K.glow('hotGlow2', 6, '#FF8CC6', 0.8) }, inside);
      K.twos.fromTo(dr, { x: 0, y: 0, opacity: 0 }, { x: Math.cos(a) * (d1 - d0), y: Math.sin(a) * (d1 - d0), opacity: 0.95, duration: 2.4 + r(), ease: 'power1.out', immediateRender: false }, tLeak - 0.1 + i * 0.06);
    }
    X.sfx(tLeak, 'bubble', { gain: 0.1, pitch: 1.3 });
    // "millions of lives": a halo of tiny people pops on around the colony
    const tMil = w('reveal', 'millions'), people = S('g', {}, cam);
    for (let i = 0; i < 13; i++) {
      const a = (-172 + i * (164 / 12)) * Math.PI / 180, R = C.r + 62;
      const pg = S('g', { transform: `translate(${C.x + Math.cos(a) * R},${C.y + Math.sin(a) * R}) rotate(${(a * 180 / Math.PI) + 90})` }, people);
      const pi = S('g', { filter: K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, pg);
      S('circle', { cx: 0, cy: -30, r: 13, fill: P.cream }, pi);
      S('path', { d: 'M-12,-14 Q0,-20 12,-14 L14,14 Q0,18 -14,14 Z', fill: i % 3 ? '#8C7FA0' : P.cream }, pi);
      gsap.set(pi, { scale: 0, svgOrigin: '0 14' });
      K.twos.to(pi, { scale: 1, duration: F(6), ease: 'back.out(1.2)' }, tMil - 0.1 + Math.abs(i - 6) * 0.07);
      K.twos.to(pi, { scale: 0, duration: F(6), ease: 'power2.in' }, w('reveal', 'name') - 0.2 + Math.abs(i - 6) * 0.03);
    }
    X.sfx(tMil, 'pop', { gain: 0.12, pitch: 1.4 });
    const lab_ = K.label(cam, 'PENICILLIN', { x: 960, y: 905, size: 118, spacing: 10 });
    K.labelIn(lab_, w('reveal', 'Penicillin') - 0.05, { frames: 8 });
    const tNm = w('reveal', 'Its') - 0.1;
    K.push(cam, tC4, tNm, { from: 1.0, to: 1.06, y1: 10 });
    X.tl.to(cam, { scale: 1.16, y: -95, duration: F(16), ease: 'power2.inOut' }, tNm);
    X.tl.to(cam, { scale: 1.2, y: -105, duration: tP2 + F(6) - tNm - F(16), ease: 'none' }, tNm + F(16));
  }

  // =================================================================== C6 (under C5) — one bacterium, the tough wall
  let c6;
  {
    const { g, cam } = K.stage('c6', tSO, tC7, '#D3B677', { seed: 15 });
    // painted leaf-litter specks for texture on the field
    const rr = X.rand(5); for (let i = 0; i < 40; i++) S('ellipse', { cx: rr() * 1920, cy: rr() * 1080, rx: 6 + rr() * 14, ry: 3 + rr() * 5, fill: '#B9A577', opacity: 0.5, transform: `rotate(${rr() * 180})` }, cam);
    const b = K.coccus(cam, { x: 960, y: 560, r: 230, mouth: 'smile' });
    K.twos.fromTo(b.body, { scale: 1 }, { scale: 1.03, duration: 0.8, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, tSO);
    const tWall = w('wall', 'wall');
    K.twos.to(b.wall, { attr: { stroke: '#E9A3AB' }, duration: F(4) }, tWall - 0.1);
    const lab_ = K.label(cam, 'CELL WALL', { x: 1440, y: 250, size: 70, spacing: 6 });
    const arrow = S('path', { d: 'M1360,282 Q1250,300 1172,368', stroke: '#FFF6EC', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', filter: 'url(#boil)' }, cam);
    const head = S('path', { d: 'M1196,338 L1170,372 L1210,370', stroke: '#FFF6EC', 'stroke-width': 6, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round', opacity: 0 }, cam);
    gsap.set(arrow, { strokeDasharray: 260, strokeDashoffset: 260 });
    K.labelIn(lab_, tWall - 0.15, { frames: 8, gain: 0.15 });
    K.twos.to(arrow, { strokeDashoffset: 0, duration: F(8), ease: 'power2.out' }, tWall);
    K.twos.set(head, { opacity: 1 }, tWall + F(8));
    X.tl.fromTo(cam, { scale: 1 }, { scale: 1.18, duration: 1.6, ease: 'sine.inOut', immediateRender: false }, w('wall', 'Zoom'));
    K.zoomThrough(cam, tZ7, { cx: 1123, cy: 397, scale: 1.7, base: 1.18, center: true });
    c6 = b;
  }

  // =================================================================== C5 — pivot question: germ vs us (T6 panels)
  {
    const g = X.scene('c5', tP1, tSO + F(10), null, K.layer);
    const slide = S('g', {}, g);
    const pl = K.panel(slide, { x: 0, y: 0, w: 960, h: 1080, fill: '#BCD6DC', seed: 2 });
    const pr = K.panel(slide, { x: 960, y: 0, w: 960, h: 1080, fill: '#B784AA', seed: 6 });
    const b = K.coccus(pl.inner, { x: 480, y: 540, r: 175, mouth: 'smile' });
    K.twos.fromTo(b.body, { y: 0 }, { y: -10, duration: 0.6, yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, tP1);
    K.mouthOf(b, w('pivot', 'kill'), 'worry');
    K.twos.to(b.face, { x: -10, duration: F(4) }, w('pivot', 'kill'));
    const u = K.person(pr.inner, { x: 1440, y: 1030, h: 600, coat: false, torso: '#4F7C80', sleeve: P.cream, face: -1, colors: { hair: '#5A3E36', cloth: '#3B3240' }, mouth: 'flat' });
    K.pose(u, w('pivot', 'unharmed') - 0.1, { head: -6, armF: -35, foreF: -45, mouth: 'smile' }, { frames: 8 });
    K.blink(u, [tP2 + 0.9]);
    K.panelUp(pl, tP1); K.panelUp(pr, tP2);
    K.slideOff(slide, tSO, { frames: 10, dir: 'down' });
  }

  // =================================================================== C7 — the wall in section: outside / mesh band / cell interior; loosen; enzymes stitch
  {
    const { cam } = K.stage('c7', tC7, tW8 + bw, '#D3B677', { seed: 19 });
    // outside (sand, as in C6) · the wall band (rose, speckled) · membrane · the cell's interior (brick, speckled)
    const band = S('g', {}, cam);
    S('rect', { x: -260, y: 300, width: 2440, height: 520, fill: '#96485A' }, band);
    S('rect', { x: -260, y: 300, width: 2440, height: 520, fill: K.speckle('spRose', '#96485A', '#6E3644', { light: '#B07080', n: 50, seed: 61 }), opacity: 0.7 }, band);
    S('rect', { x: -260, y: 820, width: 2440, height: 600, fill: K.speckle('spInside', '#6E3040', '#4E1E2C', { light: '#9A5464', n: 70, seed: 23 }) }, band);
    S('rect', { x: -260, y: 808, width: 2440, height: 18, rx: 9, fill: '#E7A1A8' }, band);
    S('path', { d: 'M-260,300 Q480,284 960,296 T2180,300', stroke: '#B97786', 'stroke-width': 8, fill: 'none' }, band);
    gsap.set(band, { opacity: 0 }); X.tl.to(band, { opacity: 1, duration: F(6), ease: 'power1.out' }, tC7 - F(2));
    const rowsY = [400, 560, 720], beads = [], STEP = 92, N = 27, X0 = -230;
    const linksG = S('g', {}, cam);
    const sugar = S('g', { filter: K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, cam);
    const tSug = Math.max(tC7 + 0.1, w('wall', 'sugar') - 0.35), tSt = w('wall', 'stitched');
    rowsY.forEach((y, ri) => {
      const row = S('g', {}, sugar); beads[ri] = [];
      const strand = S('rect', { x: -260, y: y - 6, width: 2440, height: 12, rx: 6, fill: '#E9CFA9', opacity: 0.9 }, row);
      gsap.set(strand, { scaleX: 0, transformOrigin: '0% 50%' }); K.twos.to(strand, { scaleX: 1, duration: 0.5, ease: 'power2.out' }, tC7 + ri * 0.08);
      for (let i = 0; i < N; i++) {
        const x = X0 + i * STEP + (ri % 2) * STEP / 2;
        const bd = S('rect', { x: x - 39, y: y - 30, width: 78, height: 60, rx: 22, fill: i % 2 ? '#D9B98A' : P.cream }, row);
        beads[ri].push({ el: bd, x, y });
      }
    });
    const links = [];
    for (let ri = 0; ri < rowsY.length - 1; ri++) for (let i = 1; i < N; i += 3) {
      const x = X0 + i * STEP + (ri % 2) * STEP / 2 + 22;
      const ln = S('rect', { x: x - 10, y: rowsY[ri] + 26, width: 20, height: 108, rx: 10, fill: '#F6E7CF' }, linksG);
      links.push({ el: ln, x, ri });
    }
    beads.forEach((rw, ri) => rw.forEach((b, i) => { gsap.set(b.el, { scale: 0, transformOrigin: '50% 50%' }); K.twos.to(b.el, { scale: 1, duration: F(4), ease: 'back.out(1.2)' }, tSug + ri * 0.12 + i * 0.016); }));
    links.forEach((l) => { gsap.set(l.el, { scaleY: 0, transformOrigin: '50% 0%' }); K.twos.to(l.el, { scaleY: 1, duration: F(4), ease: 'power2.out' }, tSt + (l.x + 230) / 2400 * 1.1 + l.ri * 0.08); });
    X.sfx(tSug, 'blip_up', { gain: 0.1 }); X.sfx(tSt + 0.2, 'tick', { gain: 0.12 });
    K.motes(cam, tC7, tW8 + bw, { n: 16, color: '#F6E7CF', speed: 30, angle: -15, seed: 12, rmin: 3, rmax: 6, opacity: 0.4, box: [0, 840, 1920, 260] });
    K.push(cam, tC7, L('grow').start, { from: 1.0, to: 1.07, x0: 160, x1: -120, y0: 20, y1: -10 });
    // "to grow, the cell keeps loosening that mesh": links near the centre snap, the middle chain parts
    const tGrow = L('grow').start, tLoose = w('grow', 'loosening');
    X.tl.fromTo(cam, { scale: 1.07, x: -120, y: -10 }, { scale: 1.32, x: 0, y: (540 - 600) * 1.32, duration: 1.2, ease: 'sine.inOut', immediateRender: false }, tGrow);
    const gapLinks = links.filter((l) => l.x > 760 && l.x < 1180);
    gapLinks.forEach((l, k) => K.twos.to(l.el, { scaleY: 0, opacity: 0, duration: F(4), ease: 'power2.in' }, tLoose + k * 0.1));
    X.sfx(tLoose + 0.05, 'tock', { gain: 0.16 }); X.sfx(tLoose + 0.35, 'tock', { gain: 0.12, pitch: 1.2 });
    beads[1].forEach((b) => { if (Math.abs(b.x - 960) < 800) K.twos.to(b.el, { x: b.x < 960 ? -70 : 70, duration: F(10), ease: 'power2.inOut' }, tLoose + 0.25); });
    // enzymes rise from inside the cell and stitch fresh links into the gap
    const tEnz = w('grow', 'enzymes') - 0.25, tStitch = w('grow', 'stitch'), tFresh = w('grow', 'fresh');
    const e1 = K.enzyme(cam, { x: 820, y: 660, r: 62 }), e2 = K.enzyme(cam, { x: 1100, y: 640, r: 62, flip: true });
    K.twos.fromTo(e1.body, { x: 0, y: 600 }, { x: 0, y: 0, duration: F(10), ease: 'power2.out', immediateRender: false }, tEnz);
    K.twos.fromTo(e2.body, { x: 0, y: 600 }, { x: 0, y: 0, duration: F(10), ease: 'power2.out', immediateRender: false }, tEnz + 0.12);
    gsap.set([e1.body, e2.body], { y: 600 });
    [[915, 560], [1005, 560]].forEach(([x, y], k) => { const nb = S('rect', { x: x - 36, y: y - 30, width: 72, height: 60, rx: 22, fill: k ? '#F0D3A4' : '#FFF3E2', filter: K.glow('freshGlow', 6, '#FFF6EC', 0.7) }, cam); gsap.set(nb, { scale: 0, transformOrigin: '50% 50%' }); K.twos.to(nb, { scale: 1, duration: F(4), ease: 'back.out(1.3)' }, tStitch - 0.1 + k * 0.2); });
    [[915, 426], [1005, 586], [960, 426]].forEach(([x, y], k) => { const nl = S('rect', { x: x - 10, y, width: 20, height: 108, rx: 10, fill: '#FFF6EC', filter: K.glow('freshGlow', 6, '#FFF6EC', 0.7) }, cam); gsap.set(nl, { scaleY: 0, transformOrigin: '50% 0%' }); K.twos.to(nl, { scaleY: 1, duration: F(4), ease: 'power2.out' }, tFresh - 0.2 + k * 0.18); });
    [e1, e2].forEach((e, k) => e.arms.forEach((a, j) => K.twos.fromTo(a, { rotation: 0 }, { rotation: j ? -28 : 28, duration: F(4), yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, tStitch - 0.15 + k * 0.08)));
    X.sfx(tStitch, 'click', { gain: 0.16 }); X.sfx(tFresh + 0.05, 'click', { gain: 0.14, pitch: 1.2 });
    K.blink({ eyes: e1.eyes }, [tEnz + 1.2]); K.blink({ eyes: e2.eyes }, [tEnz + 1.6]);
  }

  // =================================================================== C8 — the decoy: penicillin mimics the link end, the enzyme jams
  {
    const { g, cam } = K.stage('c8', tW8, tC9, '#B784AA', { seed: 21 });
    K.brushWipe(g, tW8, { seed: 9 });
    const E = { x: 700, y: 560, r: 175 };
    const e = K.enzyme(cam, { x: E.x, y: E.y, r: E.r });
    K.twos.fromTo(e.body, { y: 0 }, { y: -8, duration: 0.7, yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, tW8);
    const link = K.token(cam, { kind: 'link', x: 1200, y: 330, a: 100, tail: 150 });
    const drug = K.token(cam, { kind: 'drug', x: 1200, y: 740, a: 100 });
    const tPen = L('mimic').start, tMim = w('mimic', 'mimics'), tEnd = w('mimic', 'end');
    K.twos.fromTo(drug.inner, { x: 900, rotation: 25 }, { x: 0, rotation: 0, duration: F(14), ease: 'power2.out', immediateRender: false }, tPen - 0.25);
    gsap.set(drug.inner, { x: 900 });
    gsap.set(link.inner, { opacity: 0 });
    K.twos.fromTo(link.inner, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: F(6), ease: 'power2.out', immediateRender: false }, tMim - 0.1);
    // matching outlines pulse on both square heads
    [[1200, 330], [1200, 740]].forEach(([x, y], k) => {
      const d = S('rect', { x: x - 10, y: y - 60, width: 120, height: 120, rx: 10, fill: 'none', stroke: '#FFF6EC', 'stroke-width': 6, 'stroke-dasharray': '16 12', opacity: 0, filter: 'url(#boil)' }, cam);
      K.twos.to(d, { opacity: 1, duration: F(3) }, tEnd - 0.05 + k * 0.15);
      K.twos.to(d, { opacity: 0, duration: F(4) }, tEnd + 1.2);
    });
    X.sfx(tEnd, 'ding', { gain: 0.1 });
    const tEz = w('mimic', 'enzymes'), tGrab = w('mimic', 'grab'), tJam = w('mimic', 'jam');
    K.twos.to(e.eyes, { x: 14, y: 6, duration: F(4) }, tEz);
    // grab: the drug flies into the notch (square head first); the enzyme's arms clamp
    const nx = E.x + E.r * 0.32 + 2 - 1200, ny = E.y - 740;
    K.twos.to(drug.inner, { x: nx, y: ny, duration: F(6), ease: 'power3.in' }, tGrab - 0.15);
    K.twos.to(e.arms[0], { rotation: 40, duration: F(4) }, tGrab + 0.1);
    K.twos.to(e.arms[1], { rotation: -40, duration: F(4) }, tGrab + 0.1);
    X.sfx(tGrab + 0.1, 'slide', { gain: 0.16 });
    // jam: jolt, zigzag mouth, stuck sparks
    K.mouthOf(e, tJam, 'zig');
    K.twos.to(e.body, { keyframes: [{ x: 10, duration: F(2) }, { x: -10, duration: F(2) }, { x: 6, duration: F(2) }, { x: 0, duration: F(2) }] }, tJam);
    K.twos.to(e.eyes, { scaleY: 0.35, duration: F(2) }, tJam);
    const sparks = S('g', { opacity: 0 }, cam);
    [[-60, -150, -80, -200], [40, -170, 50, -225], [130, -120, 175, -160]].forEach(([x1, y1, x2, y2]) => S('path', { d: `M${E.x + 90 + x1},${E.y + 40 + y1} L${E.x + 90 + x2},${E.y + 40 + y2}`, stroke: '#FFF6EC', 'stroke-width': 7, 'stroke-linecap': 'round' }, sparks));
    K.twos.to(sparks, { opacity: 1, duration: F(2) }, tJam + 0.05);
    X.sfx(tJam, 'thud', { gain: 0.22 });
    K.motes(cam, tW8, tC9, { n: 18, color: '#FFF6EC', speed: 30, angle: -100, seed: 14, opacity: 0.5 });
    K.push(cam, tW8, tEz - 0.15, { from: 1.0, to: 1.05, x0: -40, x1: 20 });
    X.tl.to(cam, { scale: 1.3, x: (960 - 830) * 1.3, y: (540 - 575) * 1.3, duration: F(14), ease: 'power2.inOut' }, tEz - 0.15);
    X.tl.to(cam, { scale: 1.34, x: (960 - 830) * 1.34, duration: tC9 - tEz - 0.15 - F(14), ease: 'none' }, tEz - 0.15 + F(14));
    X.sfx(tEz - 0.15, 'zoom_in', { gain: 0.09 });
  }

  // =================================================================== C9 — the wall can't keep up: burst (T1 hard cut)
  {
    const { cam } = K.stage('c9', tC9, tW10 + bw, '#A3CBD1', { seed: 25 });
    const b = K.coccus(cam, { x: 960, y: 540, r: 190, mouth: 'smile' });
    // jammed enzymes sprinkled on the wall: tiny pink decoys
    const r = X.rand(31);
    for (let i = 0; i < 7; i++) { const a = r() * Math.PI * 2; const t = K.token(b.body, { kind: 'drug', x: Math.cos(a) * 178, y: Math.sin(a) * 178, a: 18, face: false }); t.g.setAttribute('transform', `translate(${Math.cos(a) * 178},${Math.sin(a) * 178}) rotate(${a * 57.3})`); }
    const tGrow = w('burst', 'growing') - 0.3, tWall = w('burst', 'wall'), tBurst = w('burst', 'bursts');
    K.twos.fromTo(b.body, { scale: 1 }, { scale: 1.24, duration: tBurst - tGrow, ease: 'power1.in', immediateRender: false }, tGrow);
    K.mouthOf(b, tWall, 'worry');
    const bulges = [-40, 55, 150, 235].map((deg, k) => { const a = deg * Math.PI / 180; const c = S('circle', { cx: Math.cos(a) * 180, cy: Math.sin(a) * 180, r: 1, fill: '#F2B8BE', stroke: '#FFF6EC', 'stroke-width': 4 }, b.body); K.twos.to(c, { attr: { r: 44 }, duration: tBurst - tWall - 0.2, ease: 'power2.in' }, tWall + k * 0.12); return c; });
    K.mouthOf(b, w('burst', 'until'), 'oh');
    X.sfx(tGrow, 'rise', { gain: 0.08, dur: tBurst - tGrow });
    // burst: body vanishes, speckled fragments fly out on twos, a cream ring flashes
    K.twos.set(b.body, { opacity: 0 }, tBurst);
    const frags = S('g', {}, cam);
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2 + r() * 0.3, d = 150 + r() * 150, s = 26 + r() * 30;
      const fh = S('g', { transform: `translate(${960 + Math.cos(a) * 150},${540 + Math.sin(a) * 150})` }, frags);
      const fr = S('path', { d: `M${-s},${-s * 0.4} Q0,${-s * 1.1} ${s},${-s * 0.3} Q${s * 0.6},${s * 0.8} ${-s * 0.4},${s * 0.6} Z`, fill: K.speckle('spBrick', '#A8525F', '#6E2C3A') }, fh);
      gsap.set(fr, { opacity: 0 });
      K.twos.fromTo(fr, { opacity: 1, x: 0, y: 0, rotation: 0 }, { x: Math.cos(a) * d, y: Math.sin(a) * d, rotation: (r() - 0.5) * 160, duration: 0.5, ease: 'power3.out', immediateRender: false }, tBurst);
      K.twos.to(fr, { x: Math.cos(a) * (d + 110), y: Math.sin(a) * (d + 110) + 40, rotation: '+=40', opacity: 0.55, duration: tW10 + bw - tBurst - 0.5, ease: 'none' }, tBurst + 0.5);
    }
    const ring = S('circle', { cx: 960, cy: 540, r: 200, fill: 'none', stroke: '#FFF6EC', 'stroke-width': 34, opacity: 0, filter: K.glow('ringGlow', 10, '#FFF6EC', 0.8) }, cam);
    K.twos.fromTo(ring, { attr: { r: 200 }, opacity: 1, strokeWidth: 34 }, { attr: { r: 560 }, opacity: 0, strokeWidth: 2, duration: F(10), ease: 'power2.out', immediateRender: false }, tBurst);
    X.sfx(tBurst, 'pop', { gain: 0.4, pitch: 0.8 }); X.sfx(tBurst + 0.02, 'woosh_low', { gain: 0.2 });
    K.push(cam, tC9, tW10 + bw, { from: 1.0, to: 1.1 });
  }

  // =================================================================== C10 — human cells: no wall, nothing to jam (T3)
  {
    const { g, cam } = K.stage('c10', tW10, tC11, '#93A6E2', { seed: 27 });
    K.brushWipe(g, tW10, { seed: 13 });
    const cells = [[330, 300, 125], [830, 250, 105], [1360, 300, 135], [1660, 700, 120], [480, 780, 140], [1060, 720, 150]];
    const cg = [];
    cells.forEach(([x, y, r], k) => {
      const c0 = S('g', { transform: `translate(${x},${y})` }, cam);
      const c = S('g', {}, c0);
      const inner = S('g', { filter: K.rim('rimCell', '#FFF6EC', 2, 4, 0.7) }, c);
      S('path', { d: `M${-r},0 C${-r},${-r * 0.75} ${-r * 0.55},${-r} 0,${-r * 0.96} C${r * 0.6},${-r * 1.02} ${r},${-r * 0.6} ${r * 0.98},0 C${r},${r * 0.7} ${r * 0.5},${r} 0,${r * 0.98} C${-r * 0.6},${r} ${-r},${r * 0.65} ${-r},0 Z`, fill: P.cream }, inner);
      S('ellipse', { cx: r * 0.28, cy: -r * 0.2, rx: r * 0.3, ry: r * 0.26, fill: '#C7A6C2' }, inner);
      S('path', { d: `M${-r * 0.42},${r * 0.12} q${r * 0.08},${r * 0.07} ${r * 0.16},0 M${-r * 0.1},${r * 0.12} q${r * 0.08},${r * 0.07} ${r * 0.16},0`, stroke: '#2A1E2E', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, inner);
      S('path', { d: `M${-r * 0.3},${r * 0.36} q${r * 0.1},${r * 0.08} ${r * 0.2},0`, stroke: '#2A1E2E', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }, inner);
      gsap.set(inner, { svgOrigin: '0 0' });
      K.twos.fromTo(inner, { scale: 1 }, { scale: 1.035, duration: 0.9 + (k % 3) * 0.2, yoyo: true, repeat: 5, ease: 'sine.inOut', immediateRender: false }, tW10 + k * 0.15);
      cg.push(c);
    });
    // decoys drift through; one bumps a cell and bounces off harmlessly
    const tT = w('us', 'target');
    const paths = [[[-120, 520], [700, 470], [2100, 380]], [[-200, 940], [890, 640], [1500, 980]], [[2050, 120], [1100, 90], [-150, 160]], [[2100, 900], [1300, 960], [-100, 1010]]];
    paths.forEach((pp, k) => {
      const tk = K.token(cam, { kind: 'drug', x: 0, y: 0, a: 34 });
      const dur = tC11 - tW10 + 0.4;
      if (k === 1) {
        K.twos.fromTo(tk.inner, { x: pp[0][0], y: pp[0][1], rotation: 0 }, { x: pp[1][0], y: pp[1][1], rotation: 40, duration: tT - tW10, ease: 'sine.inOut', immediateRender: false }, tW10);
        gsap.set(tk.inner, { x: pp[0][0], y: pp[0][1] });
        K.twos.to(tk.inner, { x: pp[2][0], y: pp[2][1], rotation: -60, duration: tC11 - tT, ease: 'power2.out' }, tT);
      } else {
        K.twos.fromTo(tk.inner, { x: pp[0][0], y: pp[0][1], rotation: -20 }, { x: pp[1][0], y: pp[1][1], rotation: 15, duration: dur / 2, ease: 'sine.inOut', immediateRender: false }, tW10 - 0.4);
        K.twos.to(tk.inner, { x: pp[2][0], y: pp[2][1], rotation: -10, duration: dur / 2, ease: 'sine.inOut' }, tW10 - 0.4 + dur / 2);
        gsap.set(tk.inner, { x: pp[0][0], y: pp[0][1] });
      }
    });
    K.twos.to(cg[5], { keyframes: [{ x: 10, y: 6, duration: F(2) }, { x: 0, y: 0, duration: F(6) }] }, tT);
    X.sfx(tT, 'bubble', { gain: 0.14 });
    K.motes(cam, tW10, tC11, { n: 20, color: '#FFF6EC', speed: 28, angle: -70, seed: 16, opacity: 0.5 });
    const tSo = w('us', 'so') - 0.15;
    K.push(cam, tW10, tSo, { from: 1.0, to: 1.05, x0: 60, x1: -20 });
    X.tl.to(cam, { scale: 1.26, x: (960 - 1040) * 1.26, y: (540 - 690) * 1.26, duration: F(14), ease: 'power2.inOut' }, tSo);
    X.tl.to(cam, { scale: 1.3, x: (960 - 1040) * 1.3, y: (540 - 690) * 1.3, duration: tC11 - tSo - F(14), ease: 'none' }, tSo + F(14));
  }

  // =================================================================== C11 — 1940s: mass production → a patient sits up (T1 cut, T9 pan)
  {
    const { cam } = K.stage('c11', tC11, tW12 + bw, '#CC9A48', { seed: 29 });
    const strip = S('g', {}, cam);
    // hospital half (x 1920–3840)
    S('rect', { x: 1900, y: -150, width: 2460, height: 1380, fill: '#7E8FC8' }, strip);
    S('image', { href: K.paper('#7E8FC8', 0.08, 31), x: 1900, y: -150, width: 2460, height: 1380, preserveAspectRatio: 'none' }, strip);
    S('rect', { x: 1900, y: 860, width: 2460, height: 400, fill: '#6B79AE' }, strip);
    S('rect', { x: 2260, y: 170, width: 420, height: 360, rx: 6, fill: '#E9E4DE' }, strip);
    S('rect', { x: 2278, y: 188, width: 384, height: 324, fill: '#CFE0E6' }, strip);
    S('circle', { cx: 2560, cy: 280, r: 46, fill: '#F6E6B8', filter: K.glow('sunGlow2', 18, '#FFF6EC', 0.6) }, strip);
    S('rect', { x: 2460, y: 188, width: 14, height: 324, fill: '#E9E4DE' }, strip);
    K.bed(strip, { x: 3000, y: 800, s: 1.05 });
    const pat = K.person(strip, { x: 2890, y: 920, h: 460, coat: false, torso: '#E9E4DE', sleeve: '#E9E4DE', face: 1, colors: { hair: '#7A5A44', cloth: '#E9E4DE' }, mouth: 'flat' });
    gsap.set([pat.legL, pat.legR], { opacity: 0 });
    gsap.set(pat.body, { svgOrigin: '0 -132', rotation: -28 });
    S('path', { d: 'M2700,770 L3360,770 Q3380,770 3380,790 L3380,850 L2700,850 Z', fill: '#F3EEE8' }, strip);
    S('rect', { x: 2700, y: 790, width: 680, height: 14, fill: '#9AB0D8' }, strip);
    S('rect', { x: 2640, y: 640, width: 150, height: 90, rx: 30, fill: '#FFFFFF', opacity: 0.9 }, strip);
    strip.insertBefore(strip.lastChild, pat.place);
    const tTurn = w('wider', 'turning'), tCure = w('wider', 'cures');
    K.pose(pat, tTurn + 0.15, { lean: 0 }, { frames: 10 });
    K.pose(pat, tTurn + 0.9, { armF: -150, foreF: -20, mouth: 'smile', head: -4 }, { frames: 8 });
    K.twos.fromTo(pat.foreF, { rotation: -20 }, { rotation: 10, duration: F(4), yoyo: true, repeat: 3, ease: 'sine.inOut', immediateRender: false }, tCure - 0.2);
    K.blink(pat, [tTurn + 1.6]);
    X.sfx(tCure, 'chime', { gain: 0.14 });
    // factory half (x 0–1920): tank, pipe, conveyor of vials
    S('rect', { x: 120, y: 200, width: 380, height: 520, rx: 40, fill: P.plum }, strip);
    S('rect', { x: 170, y: 300, width: 280, height: 300, rx: 18, fill: '#2E2232' }, strip);
    const lvl = S('rect', { x: 170, y: 420, width: 280, height: 180, rx: 18, fill: P.hot, opacity: 0.9, filter: K.glow('hotGlow3', 10, '#FF8CC6', 0.6) }, strip);
    K.twos.fromTo(lvl, { y: 0 }, { y: 30, duration: tPan - tC11, ease: 'none', immediateRender: false }, tC11);
    S('path', { d: 'M500,360 L760,360 L760,600', stroke: P.plum, 'stroke-width': 34, fill: 'none', 'stroke-linejoin': 'round' }, strip);
    S('path', { d: 'M736,600 L784,600 L772,640 L748,640 Z', fill: '#2E2232' }, strip);
    [[1250, 260], [1500, 260]].forEach(([x, y]) => { S('circle', { cx: x, cy: y, r: 64, fill: '#E9E0CF' }, strip); S('circle', { cx: x, cy: y, r: 52, fill: '#F6F1E6' }, strip); const nd = S('path', { d: `M${x},${y} L${x + 34},${y - 20}`, stroke: P.plum, 'stroke-width': 6, 'stroke-linecap': 'round' }, strip); K.twos.fromTo(nd, { rotation: -30, svgOrigin: `${x} ${y}` }, { rotation: 40, duration: 1.2, yoyo: true, repeat: 2, ease: 'sine.inOut', immediateRender: false }, tC11); });
    S('rect', { x: -260, y: 780, width: 2220, height: 44, rx: 22, fill: P.plum }, strip);
    for (let x = -240; x < 1960; x += 90) S('circle', { cx: x, cy: 802, r: 14, fill: '#2E2232' }, strip);
    S('rect', { x: 60, y: 824, width: 20, height: 300, fill: '#2E2232' }, strip); S('rect', { x: 1500, y: 824, width: 20, height: 300, fill: '#2E2232' }, strip);
    const beltClip = S('clipPath', { id: 'beltClip' }, X.defs); S('rect', { x: -400, y: 0, width: 2360, height: 1080 }, beltClip);
    const belt = S('g', {}, S('g', { 'clip-path': 'url(#beltClip)' }, strip));
    for (let i = 0; i < 12; i++) K.bottle(belt, { x: -300 + i * 200, y: 778, s: 1.25 });
    K.twos.fromTo(belt, { x: 0 }, { x: 600, duration: tPan - tC11 + 0.4, ease: 'none', immediateRender: false }, tC11);
    const drop = S('ellipse', { cx: 760, cy: 650, rx: 9, ry: 13, fill: P.hot, opacity: 0 }, strip);
    K.twos.fromTo(drop, { y: 0, opacity: 1 }, { y: 70, opacity: 0, duration: F(8), ease: 'power2.in', repeat: 2, repeatDelay: 0.5, immediateRender: false }, tC11 + 0.3);
    [0.35, 1.15, 1.95].forEach((d) => X.sfx(tC11 + d, 'click', { gain: 0.07, pitch: 0.8 }));
    X.tl.fromTo(strip, { x: 0 }, { x: -1920, duration: F(9), ease: 'power3.inOut', immediateRender: false }, tPan);
    X.sfx(tPan, 'whoosh', { gain: 0.16 });
    K.push(cam, tC11, tW12 + bw, { from: 1.0, to: 1.06 });
  }

  // =================================================================== C12 — callback: the same bench at night + credits (T3)
  {
    const { g, cam } = K.stage('c12', tW12, END + 0.1, '#3A3142', { seed: 33 });
    K.brushWipe(g, tW12, { seed: 17 });
    lab(cam, true);
    const cone = S('path', { d: 'M1120,330 L760,700 L1600,700 Z', fill: X.radial('coneGrad', [[0, '#F7E2B0', 0.5], [1, '#F7E2B0', 0]], 0.5, 0.1, 0.9), opacity: 0.8 }, cam);
    const f = fleming(cam, { x: 800, y: 880, mouth: 'smile' });
    gsap.set(f.armF, { rotation: -72 }); gsap.set(f.foreF, { rotation: -58 }); gsap.set(f.head, { rotation: 4 });
    const held = S('g', { transform: 'rotate(130) translate(0,-16)' }, f.handF); smallDish(held, true);
    bench(cam, true);
    K.lamp(cam, { x: 1180, y: 702, s: 1.0, color: '#2A2030' });
    const bulb = S('circle', { cx: 1270, cy: 528, r: 18, fill: '#F7E2B0', filter: K.glow('bulbGlow', 16, '#F7E2B0', 0.9) }, cam);
    K.twos.fromTo([bulb, cone], { opacity: 0.85 }, { opacity: 1, duration: 0.35, yoyo: true, repeat: 9, ease: 'steps(2)', immediateRender: false }, tW12);
    const tMessy = w('callback', 'messy');
    K.pose(f, tMessy - 0.1, { head: -6, lean: -2 }, { frames: 10 });
    K.pose(f, tMessy + 1.6, { head: 6, lean: 0 }, { frames: 12 });
    blinks(f, tW12, END, 9);
    K.twos.fromTo(f.body, { y: 0 }, { y: -4, duration: 1.4, yoyo: true, repeat: 6, ease: 'sine.inOut', immediateRender: false }, tW12);
    K.twos.fromTo(held, { scale: 1 }, { scale: 1.06, transformOrigin: '50% 50%', duration: 0.9, yoyo: true, repeat: 9, ease: 'sine.inOut', immediateRender: false }, tW12);
    K.motes(cam, tW12, END, { n: 9, color: '#F7E2B0', speed: 14, angle: -120, seed: 21, box: [1080, 420, 360, 220], rmin: 2, rmax: 4, opacity: 0.8 });
    K.push(cam, tW12, END, { from: 1.09, to: 1.0, x0: -40, y0: 14, x1: 0, y1: 0 });
  }

  X.end(END);
});
