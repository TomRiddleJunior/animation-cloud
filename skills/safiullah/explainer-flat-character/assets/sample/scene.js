/* Tallypup — "Invoices that come home." Original flat-character (grain-pastel) product explainer sample.
 * Story: Maya the illustrator (problem) → invoices behave like wandering sheep (metaphor) → Tallypup the herding pup
 * (product) → send / nudge / pay / dashboard (features) → the flock comes home (resolution) → crowd → logo + CTA. */
X.boot(async (X) => {
  await X.loadVO();
  const P = K.PAL, L = (id) => X.line(id), W = (id, w, n) => X.word(id, w, n);
  const tl = X.tl;
  const END = L('cta').end + 6.6;
  X.svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: P.ground }, X.root);
  const MAYA = { hairStyle: 'long', top: P.lav, topHi: P.lavHi, bottom: P.teal, bottomHi: P.tealMid, skin: '#f4c9a8', skinShade: '#e4ad8a', seed: 4 };
  const CLIENT = { hairStyle: 'short', beard: true, top: P.butter, topHi: P.butterHi, bottom: '#2b3a4a', bottomHi: '#4a5d70', skin: K.SKINS[2][0], skinShade: K.SKINS[2][1], seed: 9, sleeves: 'long' };

  // ---------------------------------------------------------------- time map (every beat sits on a word)
  const tW1 = L('flock').start - 0.38;            // whip studio → hills
  const tIris = L('pivot').start - 0.5;           // moon iris → teal field
  const tS4 = W('send', 'Tallypup') - 0.45;       // teal field closes onto the mark
  const tPush = L('pay').start - 0.55;            // push-through into the phone
  const tS7 = L('dash').start - 0.35;             // pull back out of the check into the dashboard
  const tW2 = L('home').start - 0.42;             // whip dashboard → sunset hills
  const tZ = L('proof').start - 0.36;             // whip-zoom into the crowd
  const tIris2 = L('cta').start - 0.32;           // iris to the logo ground

  // =============================================================== S1 · studio (pull-back reveal, Maya dollies in, pains)
  X.scene('studio', 0, tW1 + 0.3, (g) => {
    const wrap = X.svg('g', {}, g);
    const cam = K.camera(wrap, { z: 5.4, cx: 1120, cy: 470 });
    const w = cam.g;
    K.blob(w, 1000, 560, 800, 430, P.blob, { seed: 3 });
    // wall décor
    const frame = X.svg('g', {}, w);
    K.gshape('rect', { x: 560, y: 250, width: 190, height: 150, rx: 14 }, P.coral, P.coralHi, frame, { dir: 'tl' });
    X.svg('rect', { x: 576, y: 266, width: 158, height: 118, rx: 8, fill: P.creamHi }, frame);
    K.hills(frame, 576, 734, [{ y: 360, amp: 30, wave: 80, color: P.tealHi, hi: P.mintHi, seed: 3 }], 384);
    X.svg('circle', { cx: 700, cy: 300, r: 16, fill: P.butter }, frame);
    const shelf = K.shelf(w, 1000, 300, 380);
    const cactus = K.plant(w, 1330, 300, 0.42, { pot: P.lav });
    const stickies = [K.sticky(w, 860, 330, 58, P.butter, -8), K.sticky(w, 1400, 420, 54, P.mint, 6), K.sticky(w, 1440, 360, 48, P.coralHi, -4)];
    // desk + objects
    const desk = K.desk(w, 560, 760, 960);
    const mon = K.monitor(w, 900, 330, 440, 300);
    // Maya's illustration on the screen (also the opening texture)
    const art = mon.screen;
    X.svg('rect', { x: mon.sx, y: mon.sy, width: mon.sw, height: mon.sh, rx: 12, fill: '#f7c6a0' }, art);
    K.gshape('circle', { cx: 1150, cy: 430, r: 52 }, P.coral, P.butter, art, { dir: 'tl', reach: 1 });
    K.hills(art, mon.sx, mon.sx + mon.sw, [
      { y: 520, amp: 50, wave: 210, color: P.tealMid, hi: P.tealHi, seed: 5 },
      { y: 560, amp: 34, wave: 160, color: P.teal, hi: P.tealMid, seed: 8 }], mon.sy + mon.sh);
    const clipId = 'monclip';
    const cp = X.svg('clipPath', { id: clipId }, X.defs);
    X.svg('rect', { x: mon.sx, y: mon.sy, width: mon.sw, height: mon.sh, rx: 12 }, cp);
    art.setAttribute('clip-path', `url(#${clipId})`);
    const tablet = K.gshape('path', { d: 'M960,758 L1180,758 L1200,744 L980,744 Z' }, P.peri, P.periHi, w, { dir: 't' });
    const lamp = K.lamp(w, 1450, 760, 1.05);
    const plant = K.plant(w, 1365, 760, 0.8);
    const mug = K.mug(w, 1265, 760, 0.75, P.butter);
    // pile of invoices that lands on "getting paid"
    const pile = X.svg('g', {}, w);
    const sheets = [[760, 640, -10, P.coral], [790, 630, 6, P.lav], [770, 618, -3, P.coral]].map(([x, y, r, c], i) => {
      const s = X.svg('g', { transform: `rotate(${r} ${x + 60} ${y + 70})` }, pile);
      K.invoice(s, x, y, 120, 140, { amount: false, color: c, lines: 3 });
      return s;
    });
    const due = X.svg('g', {}, w);
    K.badge(due, 900, 610, 34, null, { color: P.coral, hi: P.coralHi });
    K.label(due, 900, 624, '!', { size: 40, weight: 800, color: '#fff' });
    // Maya
    const maya = K.character(w, { ...MAYA, x: 590, y: 1270, scale: 2.2, look: 0.35 });
    const blurM = K.blur('xy');
    maya.g.setAttribute('filter', blurM.url);
    const blurC = K.blur('xy');
    w.setAttribute('filter', blurC.url);

    // ---- T1 pull-back from the drawing texture
    blurC.set(0, 9); blurC.to(0.05, 0, 0.9, 'power2.out');
    tl.set(w, { attr: { filter: 'none' } }, 1.0);
    cam.to(0.05, { z: 1, cx: 960, cy: 540 }, 2.4, 'expo.out');
    X.sfx(0.05, 'zoom_out', { dur: 1.2, gain: 0.45 });
    [frame, shelf, cactus, ...stickies, lamp, plant, mug, tablet].forEach((el, i) => K.pop(el, 0.5 + i * 0.11, { sfx: i % 3 === 0 ? 'pop' : false, gain: 0.18, pitch: 0.9 + i * 0.04 }));
    // ---- T2 Maya dollies in from the foreground on "Meet Maya"
    const tm = L('hook').start - 0.05;
    tl.fromTo(maya.g, { x: 120, y: 2600, scale: 5.4 }, { x: 590, y: 1270, scale: 2.2, duration: 0.9, ease: 'power3.out', immediateRender: false }, tm);
    gsap.set(maya.g, { x: 120, y: 2600, scale: 5.4 });
    blurM.set(0, 16); blurM.to(tm, 0, 0.75, 'power2.out');
    tl.set(maya.g, { attr: { filter: 'none' } }, tm + 0.95);
    X.sfx(tm, 'swoosh', { dur: 0.5, gain: 0.4 });
    maya.pose('wave', tm + 0.45, 0.35).wave(tm + 0.75, tm + 1.7).face(tm + 0.5, { mouth: 'open', eyes: 'happy' });
    const tDraw = W('hook', 'draws');
    maya.pose('point', tDraw - 0.1, 0.4).look(tDraw - 0.1, 0.8, 0.35).face(tDraw, { mouth: 'smile', eyes: 'open' });
    const tBeau = W('hook', 'beautiful');
    [[1005, 380, 22], [1290, 365, 16], [1230, 560, 18], [960, 520, 13]].forEach(([x, y, s], i) => {
      const sp = K.sparkle(w, x, y, s, i % 2 ? P.coral : P.butter);
      K.pop(sp, tBeau + i * 0.09, { sfx: i === 0 ? 'sparkle' : false, gain: 0.3 });
      X.every((t) => { if (t > tBeau + 0.5) sp.setAttribute('opacity', 0.55 + 0.45 * Math.sin(t * 5 + i)); });
    });
    maya.face(tBeau + 0.1, { eyes: 'happy' }).face(tBeau + 1.0, { eyes: 'open' });
    maya.pose('talk', L('hook').end - 0.3, 0.4).look(L('hook').end - 0.3, 0.2, 0.4).talk(L('hook').end - 0.2, L('problem').start + 1.2);
    // ---- problem: smile drops, invoices land, slump
    const tBut = L('problem').start;
    maya.face(tBut, { mouth: 'flat' }).pose('idle', tBut + 0.1, 0.5);
    maya.look(W('problem', 'drawing') - 0.2, 0.7, 0.3).look(W('problem', "It's") - 0.1, 0.05, 0.3);
    const tGet = W('problem', 'getting');
    sheets.forEach((s, i) => {
      tl.fromTo(s, { y: -1300, rotation: 25 - i * 18, svgOrigin: '820 700' }, { y: 0, rotation: 0, duration: 0.42, ease: 'bounce.out', immediateRender: false }, tGet + i * 0.1);
      gsap.set(s, { y: -1300 });
      X.sfx(tGet + i * 0.1 + 0.3, 'paper', { gain: 0.35, dur: 0.25 });
    });
    const tPaid = W('problem', 'paid');
    K.pop(due, tPaid + 0.05, { sfx: 'blip_down', gain: 0.35 });
    maya.pose('slump', tPaid, 0.55).face(tPaid, { mouth: 'frown', brows: 'worried' });
    cam.to(L('problem').start - 0.4, { z: 1.05, cx: 930, cy: 545 }, L('pains').start - L('problem').start + 0.1, 'sine.inOut');
    // ---- pains: camera pushes towards Maya, three bubbles orbit her head
    cam.to(L('pains').start - 0.25, { z: 1.22, cx: 790, cy: 520 }, 1.4, 'power2.inOut');
    cam.to(L('pains').start + 1.2, { z: 1.3, cx: 770 }, 3.2, 'sine.inOut');
    const bubbles = [
      [W('pains', 'Which'), 470, 390, 'Which invoices\nwent out?', 'l', true],
      [W('pains', "Who's"), 700, 360, 'Who’s running late?', 'r', true],
      [W('pains', 'And'), 455, 600, 'Awkward to\nask again?', 'l', false],
    ].map(([t, x, y, txt, side, up], i) => {
      const bg = X.svg('g', {}, w);
      const b = K.bubble(bg, x, y, txt, { side, up, size: 34, color: i === 1 ? P.tealMid : P.green, hi: i === 1 ? P.tealHi : P.greenHi });
      K.pop(b, t - 0.05, { ox: b.ox, oy: b.oy, dur: 0.4, sfx: 'pop', gain: 0.4, pitch: 1 + i * 0.12 });
      K.bob(bg, 5, 2.4 + i * 0.3, i * 1.7);
      return b;
    });
    maya.pose('headHold', W('pains', "Who's") - 0.1, 0.4).face(W('pains', "Who's"), { mouth: 'o' }).look(W('pains', "Who's"), -0.2, 0.3);
    maya.pose('chest', W('pains', 'awkward') - 0.1, 0.4).face(W('pains', 'awkward'), { mouth: 'flat', brows: 'worried' }).look(W('pains', 'awkward'), -0.35, 0.3);
    maya.talk(W('pains', 'awkward'), L('pains').end + 0.2, 3);
    // ---- T4 whip-pan exit
    K.whip(tW1, wrap, null, { dir: -1 });
  });

  // =============================================================== S2 · the flock wanders off (metaphor), Maya chases at dusk
  const tS2 = tW1 + 0.37;
  let moonScreen = [1360, 250];
  X.scene('flock', tS2, tIris + 0.6, (g) => {
    const wrap = X.svg('g', {}, g);
    const cam = K.camera(wrap, { z: 1.1, cx: 960, cy: 600 });
    const w = cam.g;
    tl.fromTo(wrap, { x: 1300 }, { x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, tS2);
    const blIn = K.blur('x'); wrap.setAttribute('filter', blIn.url); blIn.set(tS2 - 0.01, 50); blIn.to(tS2, 0, 0.32, 'power2.out');
    tl.set(wrap, { attr: { filter: 'none' } }, tS2 + 0.5);
    X.svg('rect', { x: -600, y: -400, width: 4200, height: 1900, fill: '#f3f1fd' }, w);
    const sun = X.svg('g', {}, w); K.sun(sun, 1480, 270, 72);
    const moon = X.svg('g', {}, w);
    K.gshape('circle', { cx: 1700, cy: 230, r: 56 }, P.creamHi, P.white, moon, { dir: 'tl' });
    X.svg('circle', { cx: 1726, cy: 214, r: 50, fill: '#d9d4f2' }, moon);
    const clouds = [K.cloud(w, 420, 230, 0.75), K.cloud(w, 1080, 170, 0.55), K.cloud(w, 2050, 260, 0.7)];
    clouds.forEach((c, i) => K.bob(c, 0, 9 + i, i, 14));
    K.hills(w, -600, 3600, [
      { y: 660, amp: 120, wave: 900, color: '#b9bde8', hi: P.periHi, seed: 2 },
      { y: 770, amp: 90, wave: 760, color: '#7cc4a6', hi: P.tealHi, seed: 4 },
      { y: 880, amp: 60, wave: 640, color: '#a6dbbf', hi: P.mintHi, seed: 7 }], 1500);
    // sheep
    const flock = [[560, 850, 1.2], [790, 800, 1.08], [1010, 870, 1.28], [1220, 810, 1.12], [1420, 860, 1.22], [860, 960, 1.34]].map(([x, y, s], i) =>
      K.sheep(w, { x, y, scale: s, seed: i + 2, flip: i === 0 || i === 1, tag: i % 2 ? P.lav : P.coral }));
    const tFlock = W('flock', 'flock');
    flock.forEach((sh, i) => K.pop(sh.g, tFlock + i * 0.08, { origin: '50% 100%', sfx: i % 2 ? false : 'pop', gain: 0.3, pitch: 1.2 + i * 0.05 }));
    const tSheep = W('flock', 'sheep');
    flock.forEach((sh, i) => sh.hop(tSheep + i * 0.06, 26, 0.38));
    X.sfx(tSheep, 'boing', { gain: 0.3, dur: 0.4 });
    const tWander = W('flock', 'wander');
    const away = [[-420, 760], [-160, 690], [2150, 700], [2500, 760], [2950, 820], [1900, 960]];
    flock.forEach((sh, i) => {
      const d = 2.6 + i * 0.25;
      tl.to(sh.g, { x: away[i][0], y: away[i][1], duration: d, ease: 'power1.in' }, tWander + i * 0.12);
      sh.trot(tWander + i * 0.12, tWander + i * 0.12 + d, 2.8);
    });
    X.sfx(tWander, 'slide', { gain: 0.25, dur: 0.6 });
    // Maya chases, running right
    const maya = K.character(w, { ...MAYA, x: -260, y: 1030, scale: 1.2, look: 0.8 });
    const tRun = W('flock', 'Maya') - 0.25;
    maya.setPose({ lSh: 20, lEl: -40, rSh: 70, rEl: 20, torso: 0, head: 0, headY: 0 }, 0).face(0, { mouth: 'open', brows: 'worried' });
    maya.walk(tRun, tIris + 0.6, { run: true, dir: 1 });
    tl.to(maya.g, { x: 1560, duration: tIris + 0.6 - tRun, ease: 'none' }, tRun);
    cam.to(tRun + 0.2, { cx: 1330 }, tIris - tRun + 0.3, 'power1.inOut');
    X.sfx(tRun, 'whoosh', { gain: 0.2, dur: 0.5 });
    // dusk: sun sets, sky dims, moon + stars
    const dusk = X.svg('rect', { x: -600, y: -400, width: 4200, height: 1900, fill: '#7d74c8', opacity: 0 }, w);
    w.insertBefore(dusk, clouds[0]);
    tl.to(dusk, { attr: { opacity: 0.5 }, duration: 1.6, ease: 'power1.inOut' }, W('flock', 'evenings') - 0.7);
    tl.to(sun, { y: 520, duration: 2.0, ease: 'power2.in' }, W('flock', 'Maya') - 0.4);
    K.pop(moon, W('flock', 'evenings'), { sfx: 'chime', gain: 0.25, origin: '50% 50%' });
    [[1500, 140, 14], [1880, 330, 11], [1260, 110, 10], [1990, 150, 12]].forEach(([x, y, s], i) => K.pop(K.sparkle(w, x, y, s, P.butterHi), W('flock', 'evenings') + 0.2 + i * 0.12, { sfx: false }));
    moonScreen = [960 + (1700 - 1330), 230 - 0];
  });

  // =============================================================== S3 · pivot on a teal colour field + product reveal
  X.scene('pivot', tIris, tS4 + 0.52, (g) => {
    K.iris(g, moonScreen[0], moonScreen[1], P.teal, tIris, 0.5);
    const inner = X.svg('g', {}, g);
    K.floaters(inner, [['ring', 220, 200, 16, P.tealMid], ['dot', 1700, 180, 9, P.tealHi], ['sparkle', 1560, 860, 18, P.butter], ['ring', 330, 860, 12, P.tealHi], ['dot', 160, 560, 7, P.tealMid], ['sparkle', 1780, 520, 14, P.tealHi], ['ring', 1180, 120, 10, P.tealHi], ['dot', 700, 960, 8, P.tealHi]], 8);
    tl.fromTo(inner, { opacity: 0 }, { opacity: 1, duration: 0.3, immediateRender: false }, tIris + 0.4);
    gsap.set(inner, { opacity: 0 });
    const words = ['So', 'what', 'if', 'someone', 'else', 'did', 'the', 'chasing?'].map((wd, i) => ({ w: wd, t: W('pivot', wd.replace('?', '')), color: wd === 'chasing?' ? P.butter : '#fff', br: wd === 'did' }));
    const head = K.headline(inner, 960, 560, words, { size: 92 });
    const tMeet = W('pivot', 'Meet');
    head.forEach((el, i) => tl.to(el, { y: -50, opacity: 0, duration: 0.28, ease: 'power2.in' }, tMeet - 0.3 + i * 0.025));
    const markWrap = X.svg('g', {}, inner);
    const mark = K.pupMark(markWrap, 960, 470, 140, { ring: P.cream, ringHi: P.creamHi });
    K.pop(mark, tMeet - 0.02, { dur: 0.5, ease: 'back.out(1.8)', sfx: 'pop', gain: 0.45 });
    X.sfx(tMeet + 0.1, 'chime', { gain: 0.35, dur: 1.2 });
    const tName = W('pivot', 'Tallypup');
    const letters = 'tallypup'.split('');
    const lw = letters.map((c) => K.textW(c, 104, 700));
    let lx = 960 - lw.reduce((a, b) => a + b, 0) / 2;
    letters.forEach((c, i) => {
      const el = K.label(inner, lx, 730, c, { size: 104, weight: 700, color: '#fff', anchor: 'start' });
      lx += lw[i];
      tl.fromTo(el, { y: -46, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: 'back.out(3)', immediateRender: false }, tName + i * 0.045);
      gsap.set(el, { opacity: 0 });
      tl.to(el, { y: 30, opacity: 0, duration: 0.2, ease: 'power2.in' }, tS4 - 0.1 + i * 0.02);
    });
    X.sfx(tName, 'blip_up', { gain: 0.3 });
    // wink
    tl.to(mark.eyes[1], { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: 1 }, tName + 0.6);
    // the field closes onto the mark (shape wipe back to the light ground)
    K.irisClose(g, 960, 470, tS4 - 0.25, 0.75, { to: 140, ease: 'power1.inOut' });
    X.sfx(tS4 - 0.25, 'woosh_low', { gain: 0.35, dur: 0.8 });
  });

  // =============================================================== S4–S6 · send → nudge (camera move) → push into the phone
  let phoneWorld = [0, 0];
  X.scene('send', tS4 - 0.26, tPush + 0.52, (g) => {
    const cam = K.camera(g, { z: 1, cx: 960, cy: 540 });
    const w = cam.g;
    K.blob(w, 960, 600, 840, 400, P.blob, { seed: 6 });
    K.floaters(w, [['sparkle', 240, 260, 14, P.butter], ['dot', 1700, 230, 8, P.lav], ['ring', 1760, 820, 12, P.peri], ['dot', 200, 840, 7, P.coral]], 3);
    // table + laptop
    X.svg('rect', { x: 772, y: 780, width: 18, height: 200, fill: P.teal }, w);
    X.svg('rect', { x: 700, y: 968, width: 160, height: 16, rx: 8, fill: P.teal }, w);
    K.gshape('rect', { x: 600, y: 762, width: 360, height: 22, rx: 10 }, P.teal, P.tealMid, w, { dir: 't' });
    const lap = K.laptop(w, 630, 560, 300);
    X.svg('rect', { x: lap.sx, y: lap.sy, width: lap.sw, height: 34, rx: 6, fill: P.tealMid }, lap.screen);
    [0, 1, 2].forEach((i) => { X.svg('rect', { x: lap.sx + 18, y: lap.sy + 56 + i * 30, width: 150 - i * 30, height: 12, rx: 6, fill: P.periHi }, lap.screen); X.svg('rect', { x: lap.sx + lap.sw - 70, y: lap.sy + 52 + i * 30, width: 52, height: 18, rx: 9, fill: i ? P.butterHi : P.greenHi }, lap.screen); });
    // Maya at the laptop
    const maya = K.character(w, { ...MAYA, x: 430, y: 985, scale: 1.45, look: 0.5, pose: 'talk' });
    maya.talk(tS4 + 0.6, L('send').end);
    // client with phone
    const client = K.character(w, { ...CLIENT, x: 1480, y: 985, scale: 1.5, look: -0.5, pose: 'hold' });
    const held = client.attach(1);
    const ph = K.phone(held, 37 - 21, -176 - 48, 42, 76, { color: P.coral, screen: '#a9dfc0' });
    // hand centre at the 'hold' pose (shoulder -8 deg, elbow +120 deg) = (-20.6, -275.6) in rig units; phone centre 10 above
    phoneWorld = [1480 + -20.6 * 1.5, 985 + (-275.6 - 10) * 1.5];
    // the mark lands on the laptop screen
    const mk = K.pupMark(w, 960, 470, 140, { ring: P.cream, ringHi: P.creamHi });
    tl.to(mk, { x: 780 - 960 * 0.3, y: 650 - 470 * 0.3, scale: 0.3, duration: 0.55, ease: 'power3.inOut' }, tS4 + 0.5);
    tl.to(mk, { opacity: 0, duration: 0.2 }, tS4 + 1.1);
    const tSend = W('send', 'sends');
    // invoice card emerges from the screen, flips into a paper plane, flies to the client
    const inv = X.svg('g', {}, w);
    K.invoice(inv, 700, 330, 150, 190, { amount: '$1,250', color: P.coral });
    gsap.set(inv, { svgOrigin: '780 640', scale: 0.2, opacity: 0 });
    tl.to(inv, { scale: 1, opacity: 1, duration: 0.45, ease: 'back.out(1.7)' }, tS4 + 0.9);
    X.sfx(tS4 + 0.9, 'paper', { gain: 0.35 });
    tl.to(inv, { scaleX: 0, duration: 0.16, ease: 'power2.in', svgOrigin: '775 425' }, tSend + 0.15);
    const plane = K.paperPlane(w, 0, 0, 0.9);
    gsap.set(plane, { x: 775, y: 425, scaleX: 0, scaleY: 1 });
    tl.to(plane, { scaleX: 1, duration: 0.16, ease: 'power2.out' }, tSend + 0.31);
    const path = 'M775,425 C900,240 1180,220 1330,420';
    tl.to(plane, { motionPath: { path, autoRotate: false }, duration: 0.85, ease: 'power2.inOut' }, tSend + 0.42);
    tl.to(plane.inner, { rotation: 22, svgOrigin: '0 0', duration: 0.85, ease: 'sine.inOut' }, tSend + 0.42);
    tl.to(plane, { scale: 0.2, opacity: 0, duration: 0.2, ease: 'power2.in' }, tSend + 1.2);
    X.sfx(tSend + 0.42, 'swoosh', { gain: 0.45, dur: 0.7 });
    // dotted trail
    const trailPts = [[840, 330], [930, 270], [1030, 245], [1130, 250], [1220, 290]];
    trailPts.forEach(([x, y], i) => { const d = X.svg('circle', { cx: x, cy: y, r: 6, fill: P.peri }, w); K.pop(d, tSend + 0.52 + i * 0.12, { sfx: false }); tl.to(d, { opacity: 0, duration: 0.3 }, tSend + 2.2 + i * 0.05); });
    // arrives on the phone
    const tArr = tSend + 1.25;
    const note = X.svg('g', {}, ph.screen);
    X.svg('rect', { x: ph.sx + 3, y: ph.sy + 10, width: ph.sw - 6, height: 22, rx: 6, fill: '#fff' }, note);
    X.svg('rect', { x: ph.sx + 6, y: ph.sy + 16, width: 9, height: 10, rx: 2, fill: P.coral }, note);
    X.svg('rect', { x: ph.sx + 18, y: ph.sy + 17, width: ph.sw - 23, height: 3.5, rx: 1.7, fill: P.periHi }, note);
    X.svg('rect', { x: ph.sx + 18, y: ph.sy + 23, width: ph.sw - 29, height: 3.5, rx: 1.7, fill: P.periHi }, note);
    K.pop(note, tArr, { sfx: 'ding', gain: 0.35, origin: '50% 0%' });
    client.face(tArr + 0.1, { mouth: 'smile', brows: 'up' }).face(tArr + 0.7, { brows: 'neutral' });
    // work done ✓
    const tWork = W('send', 'work');
    const ok = K.badge(w, 900, 545, 46, 'check', { color: P.green, hi: P.greenHi });
    K.pop(ok, tWork, { sfx: 'success', gain: 0.4 });
    maya.pose('yay', tWork - 0.05, 0.35).face(tWork, { mouth: 'open', eyes: 'happy' }).face(tWork + 1.1, { mouth: 'smile', eyes: 'open' });

    // ---- S5 nudge: camera glides to the client, friendly reminder
    const tNudge = L('nudge').start - 0.35;
    cam.to(tS4 + 0.5, { z: 1.05, cx: 985, cy: 550 }, tNudge - tS4 - 0.5, 'sine.inOut');
    cam.to(tNudge, { z: 1.7, cx: 1360, cy: 560 }, 0.9, 'power3.inOut').to(tNudge + 0.9, { z: 1.85, cx: phoneWorld[0], cy: phoneWorld[1] }, tPush - tNudge - 0.9, 'sine.inOut');
    X.sfx(tNudge, 'zoom_in', { gain: 0.3, dur: 0.6 });
    const rem = X.svg('g', {}, w);
    K.card(rem, 1030, 330, 370, 124, { r: 22, color: '#fff', hi: P.mintHi });
    K.pupMark(rem, 1090, 392, 38);
    K.label(rem, 1144, 384, 'Friendly reminder', { size: 26, weight: 700, color: P.ink, anchor: 'start' });
    K.label(rem, 1144, 420, 'Invoice due Friday', { size: 23, weight: 500, color: P.tealMid, anchor: 'start' });
    const tRem = W('nudge', 'friendly');
    K.pop(rem, tRem - 0.1, { ox: 1215, oy: 454, sfx: 'notif', gain: 0.45, dur: 0.45, ease: 'back.out(1.6)' });
    const bell = K.badge(w, 1404, 318, 30, 'bell', { color: P.coral, hi: P.coralHi });
    K.pop(bell, W('nudge', 'reminders') - 0.05, { sfx: false });
    tl.to(bell, { rotation: 16, svgOrigin: '1404 292', duration: 0.07, yoyo: true, repeat: 7, ease: 'sine.inOut' }, W('nudge', 'reminders') + 0.2);
    tl.set(bell, { rotation: 0 }, W('nudge', 'reminders') + 0.8);
    client.face(tRem + 0.2, { mouth: 'grin', eyes: 'happy' }).talk(tRem + 0.2, tRem + 1.6, 3).face(tRem + 1.5, { mouth: 'smile', eyes: 'open' });
    // "so Maya never has to": relaxed Maya avatar + check
    const tNever = W('nudge', 'Maya');
    const av = K.avatar(w, 1090, 640, 62, { ...MAYA, look: 0.3, mouth: 'smile', eyes: 'happy' }, { bg: P.butter, bgHi: P.butterHi });
    K.pop(av, tNever - 0.1, { sfx: 'pop', gain: 0.35 });
    const ck = K.badge(w, 1140, 690, 21, 'check', { color: P.green, hi: P.greenHi });
    K.pop(ck, W('nudge', 'never') + 0.1, { sfx: 'blip_up', gain: 0.3 });
    // ---- T6 push-through into the phone screen
    cam.to(tPush, { z: 60 }, 0.5, 'expo.in');   // pure zoom: the camera is already centred on the phone
    // blur in screen space (on the scene group, outside the 60x camera transform)
    const bl = K.blur('xy');
    tl.set(g, { attr: { filter: bl.url } }, tPush + 0.15);
    bl.set(tPush + 0.15, 0); bl.to(tPush + 0.15, 10, 0.35, 'power2.in');
    X.sfx(tPush, 'whoosh', { gain: 0.45, dur: 0.5 });
  });

  // =============================================================== S6 · pay in a single tap (full-frame phone UI)
  X.scene('pay', tPush + 0.5, tS7 + 0.02, (g) => {
    X.svg('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#a9dfc0' }, g);
    const c0 = tPush + 0.6;
    const blob = K.blob(g, 960, 540, 640, 420, '#8fd0b4', { seed: 9, hi: P.tealHi });
    K.pop(blob, c0 - 0.05, { sfx: false, dur: 0.5, ease: 'power3.out' });
    const card = X.svg('g', {}, g);
    K.card(card, 660, 210, 600, 640, { r: 36, color: '#fff', hi: P.mintHi, header: 120, headerColor: P.coral });
    K.label(card, 960, 290, 'Invoice from Maya', { size: 40, weight: 600, color: '#fff' });
    X.svg('rect', { x: 760, y: 380, width: 400, height: 18, rx: 9, fill: P.periHi }, card);
    X.svg('rect', { x: 820, y: 414, width: 280, height: 18, rx: 9, fill: P.periHi }, card);
    const amt = K.label(card, 960, 560, '$0', { size: 104, weight: 700, color: P.ink });
    const btn = X.svg('g', {}, card);
    K.pill(btn, 960, 720, 'Pay now', { size: 44, w: 360, color: P.teal, hi: P.tealMid });
    K.pop(card, c0, { dur: 0.5, ease: 'back.out(1.5)', sfx: 'pop', gain: 0.4 });
    X.countUp(amt, 0, 1250, c0 + 0.25, 0.7, (v) => '$' + Math.round(v).toLocaleString('en-US'));
    // finger taps "Pay now" on "tap"
    const tTap = W('pay', 'tap');
    const hand = X.svg('g', {}, g);
    X.svg('rect', { x: 1000, y: 820, width: 150, height: 400, rx: 60, fill: P.butter, transform: 'rotate(-28 1000 820)' }, hand);
    X.svg('rect', { x: 990, y: 694, width: 40, height: 130, rx: 20, fill: CLIENT.skin, transform: 'rotate(-28 1010 820)' }, hand);
    X.svg('rect', { x: 970, y: 790, width: 150, height: 120, rx: 50, fill: CLIENT.skin, transform: 'rotate(-28 1000 820)' }, hand);
    tl.fromTo(hand, { x: 520, y: 520 }, { x: 0, y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, tTap - 0.6);
    gsap.set(hand, { x: 520, y: 520 });
    tl.to(hand, { x: -8, y: 10, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, tTap - 0.05);
    tl.to(btn, { scale: 0.92, svgOrigin: '960 720', duration: 0.08, yoyo: true, repeat: 1 }, tTap - 0.04);
    X.sfx(tTap, 'click', { gain: 0.5 });
    [0, 0.12].forEach((d, i) => { const r = X.svg('circle', { cx: 960, cy: 720, r: 30, fill: 'none', stroke: P.tealHi, 'stroke-width': 8, opacity: 0 }, g); tl.fromTo(r, { attr: { r: 30 }, opacity: 0.9 }, { attr: { r: 220 }, opacity: 0, duration: 0.55, ease: 'power2.out', immediateRender: false }, tTap + d); });
    tl.to(hand, { x: 600, y: 600, duration: 0.45, ease: 'power2.in' }, tTap + 0.35);
    // paid ✓ + coin burst
    const tOk = tTap + 0.22;
    const ok = K.badge(g, 960, 540, 120, 'check', { color: P.green, hi: P.greenHi });
    K.pop(ok, tOk, { dur: 0.42, ease: 'back.out(2)', sfx: 'success', gain: 0.45 });
    tl.to(card, { scale: 0.9, opacity: 0, svgOrigin: '960 540', duration: 0.3, ease: 'power2.in' }, tOk + 0.05);
    for (let i = 0; i < 7; i++) {
      const a = -Math.PI / 2 + (i - 3) * 0.42, cn = K.coin(g, 0, 0, 30);
      tl.fromTo(cn, { x: 960, y: 540, scale: 0.3, opacity: 1 }, { x: 960 + Math.cos(a) * 420, y: 540 + Math.sin(a) * 330, scale: 1, rotation: (i - 3) * 30, duration: 0.6, ease: 'power3.out', immediateRender: false }, tOk + 0.05 + i * 0.02);
      tl.to(cn, { opacity: 0, duration: 0.25 }, tOk + 0.55 + i * 0.02);
      gsap.set(cn, { opacity: 0 });
    }
    X.sfx(tOk + 0.08, 'coin', { gain: 0.4 });
    K.irisClose(g, 960, 540, tS7 - 0.5, 0.52, { from: 1300, to: 118, ease: 'power1.inOut' });
  });

  // =============================================================== S7 · dashboard (pull-back from the check, hub + orbit badges)
  X.scene('dash', tS7 - 0.52, tW2 + 0.3, (g) => {
    const wrap = X.svg('g', {}, g);
    const bx = 600, by = 418;            // row-1 status check = zoom target
    const cam = K.camera(wrap, { z: 4.6, cx: bx, cy: by });
    const w = cam.g;
    cam.to(tS7 + 0.03, { z: 1, cx: 960, cy: 560 }, 1.4, 'expo.out').to(tS7 + 1.4, { z: 1.06, cx: 1010, cy: 570 }, tW2 - tS7 - 1.4, 'sine.inOut');
    X.sfx(tS7, 'zoom_out', { gain: 0.35, dur: 0.9 });
    K.blob(w, 960, 560, 820, 420, P.blob, { seed: 11 });
    // ribbon behind the card
    const rib = X.svg('path', { d: 'M420,300 C200,420 260,720 430,770 C620,830 700,960 900,930', fill: 'none', stroke: P.tealHi, 'stroke-width': 16, 'stroke-linecap': 'round', opacity: 0.7 }, w);
    X.drawOn(rib, W('dash', 'dashboard') + 0.3, 0.8);
    // main card
    const card = X.svg('g', {}, w);
    K.card(card, 520, 230, 880, 600, { r: 30, color: '#fff', hi: P.mintHi, header: 112, headerColor: P.teal });
    K.pupMark(card, 582, 286, 32, { ring: P.tealMid, ringHi: P.tealHi });
    K.label(card, 630, 300, 'tallypup', { size: 38, weight: 700, color: '#fff', anchor: 'start' });
    const total = K.label(card, 1360, 304, '$0', { size: 52, weight: 700, color: P.butter, anchor: 'end' });
    X.svg('rect', { x: 1080, y: 262, width: 120, height: 12, rx: 6, fill: P.tealMid }, card);
    const rows = [['check', P.green, P.greenHi, 'Paid', P.green, P.coral], ['check', P.green, P.greenHi, 'Paid', P.green, P.lav], ['clock', P.butter, P.butterHi, 'Due', '#d9a43f', P.tealMid], ['plane', P.lav, P.lavHi, 'Sent', P.lav, P.butter]];
    const rowEls = rows.map(([gl, c, hi, txt, tc, av], i) => {
      const y = 418 + i * 104, rg = X.svg('g', {}, card);
      if (i > 0) X.svg('rect', { x: 560, y: y - 52, width: 560, height: 3, rx: 1.5, fill: P.blob }, rg);
      K.badge(rg, 600, y, 26, gl, { color: c, hi });
      K.gshape('circle', { cx: 672, cy: y, r: 26 }, av, P.white, rg, { dir: 'tl', reach: 0.6 });
      X.svg('rect', { x: 716, y: y - 18, width: 170 - i * 14, height: 14, rx: 7, fill: P.ink, opacity: 0.75 }, rg);
      X.svg('rect', { x: 716, y: y + 6, width: 110, height: 12, rx: 6, fill: P.periHi }, rg);
      K.pill(rg, 1020, y, txt, { size: 32, w: 150, color: c, hi, textColor: i === 2 ? P.ink : '#fff' });
      return rg;
    });
    // bar chart
    const bars = [0.35, 0.55, 0.45, 0.75, 0.95].map((v, i) => {
      const b = X.svg('rect', { x: 1170 + i * 40, y: 760 - 300 * v, width: 26, height: 300 * v, rx: 8, fill: i === 4 ? P.coral : P.tealHi }, card);
      gsap.set(b, { scaleY: 0, svgOrigin: `${1183 + i * 40} 760` });
      tl.to(b, { scaleY: 1, duration: 0.5, ease: 'back.out(1.6)', svgOrigin: `${1183 + i * 40} 760` }, W('dash', 'dashboard') + 0.1 + i * 0.07);
      return b;
    });
    X.svg('rect', { x: 1160, y: 768, width: 210, height: 4, rx: 2, fill: P.periHi }, card);
    // rows 2..4 slide in on "tidy dashboard" (row 1 is visible from the zoom)
    rowEls.slice(1).forEach((r, i) => { tl.fromTo(r, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.35, ease: 'power3.out', immediateRender: false }, W('dash', 'tidy') + i * 0.12); gsap.set(r, { opacity: 0 }); });
    X.sfx(W('dash', 'tidy'), 'blip_up', { gain: 0.25 });
    // coins drop into the total on "payment lands"
    const tLand = W('dash', 'lands');
    [0, 1, 2].forEach((i) => {
      const cn = K.coin(w, 0, 0, 26);
      tl.fromTo(cn, { x: 1250 + i * 40, y: -80, opacity: 1 }, { y: 290, duration: 0.45, ease: 'power2.in', immediateRender: false }, tLand - 0.35 + i * 0.12);
      tl.to(cn, { opacity: 0, scale: 0.4, svgOrigin: `${1250 + i * 40} 290`, duration: 0.12 }, tLand + 0.1 + i * 0.12);
      gsap.set(cn, { opacity: 0 });
      X.sfx(tLand + 0.1 + i * 0.12, 'coin', { gain: 0.25, pitch: 1 + i * 0.1 });
    });
    X.countUp(total, 0, 4860, tLand + 0.1, 1.6, (v) => '$' + Math.round(v).toLocaleString('en-US'));
    // orbit badges (6-frame stagger), each bobbing
    const orbit = [[410, 290, 'coin', P.butter, P.butterHi], [1500, 280, 'bell', P.coral, P.coralHi], [1490, 560, 'calendar', P.lav, P.lavHi], [400, 600, 'card', P.tealMid, P.tealHi], [720, 930, 'bank', P.peri, P.periHi], [1200, 930, 'chart', P.green, P.greenHi]];
    orbit.forEach(([x, y, gl, c, hi], i) => {
      const bg = X.svg('g', {}, w);
      const b = K.badge(bg, x, y, 52, gl, { color: c, hi });
      K.pop(b, W('dash', 'dashboard') + i * 0.2, { sfx: i % 2 ? false : 'pop', gain: 0.25, pitch: 1 + i * 0.06 });
      K.bob(bg, 7, 2 + (i % 3) * 0.4, i);
    });
    // Maya: "she always knows where she stands"
    const maya = K.character(w, { ...MAYA, x: 1690, y: 1060, scale: 1.25, look: -0.4, pose: 'idle' });
    const tKnow = W('dash', 'always');
    tl.fromTo(maya.g, { x: 2100 }, { x: 1690, duration: 0.55, ease: 'power3.out', immediateRender: false }, tKnow - 0.45);
    gsap.set(maya.g, { x: 2100 });
    maya.walk(tKnow - 0.45, tKnow + 0.1, { dir: -1 });
    maya.pose('pointL', tKnow + 0.1, 0.35).face(tKnow + 0.1, { mouth: 'smile' });
    maya.pose('celebrate', W('dash', 'stands') - 0.1, 0.35).face(W('dash', 'stands'), { mouth: 'open', eyes: 'happy' }).hop(W('dash', 'stands'), 1, 18);
    // whip out
    K.whip(tW2, wrap, null, { dir: -1 });
  });

  // =============================================================== S8 · the flock comes home (metaphor payoff at sunset)
  const tS8 = tW2 + 0.37;
  let mayaHead8 = [330, 560];
  X.scene('home', tS8, tZ + 0.32, (g) => {
    const wrap = X.svg('g', {}, g);
    const cam = K.camera(wrap, { z: 1.1, cx: 960, cy: 600 });
    const w = cam.g;
    tl.fromTo(wrap, { x: 1300 }, { x: 0, duration: 0.45, ease: 'power3.out', immediateRender: false }, tS8);
    const bl = K.blur('x'); wrap.setAttribute('filter', bl.url); bl.set(tS8 - 0.01, 50); bl.to(tS8, 0, 0.32, 'power2.out');
    tl.set(wrap, { attr: { filter: 'none' } }, tS8 + 0.5);
    X.svg('rect', { x: -600, y: -400, width: 3200, height: 1900, fill: '#f9d8bd' }, w);
    const sun = X.svg('g', {}, w); K.sun(sun, 1180, 560, 96);
    tl.to(sun, { y: 70, duration: 5, ease: 'none' }, tS8);
    const clouds = [K.cloud(w, 330, 220, 0.7, P.peachHi, P.white), K.cloud(w, 1560, 180, 0.6, P.coralHi, P.peachHi)];
    clouds.forEach((c, i) => K.bob(c, 0, 10 + i, i, 16));
    K.hills(w, -600, 2600, [
      { y: 700, amp: 110, wave: 820, color: '#e3c6dc', hi: '#f6e4ee', seed: 12 },
      { y: 800, amp: 80, wave: 700, color: P.tealHi, hi: P.mintHi, seed: 14 },
      { y: 910, amp: 50, wave: 600, color: '#c6ead4', hi: P.mintHi, seed: 15 }], 1500);
    // pen
    const fenceBack = K.fence(w, 1250, 830, 420, { h: 100 });
    const sign = X.svg('g', {}, w);
    X.svg('rect', { x: 1452, y: 700, width: 16, height: 130, fill: '#e3a77c' }, sign);
    K.pill(sign, 1460, 690, 'Paid', { size: 40, w: 170, color: P.green, hi: P.greenHi });
    // sheep come home (they hop the fence into the pen)
    const starts = [[160, 880], [330, 850], [470, 900], [610, 860], [760, 905], [880, 865]];
    const ends = [[1330, 872], [1440, 866], [1560, 874], [1390, 912], [1510, 908], [1630, 904]];
    const flock = starts.map(([x, y], i) => K.sheep(w, { x, y, scale: 0.78, seed: i + 20, tag: i % 2 ? P.lav : P.coral }));
    const tHome = W('home', 'flock') - 0.15;
    flock.forEach((sh, i) => {
      const t0 = tHome + (5 - i) * 0.07, ex = ends[i][0], ey = ends[i][1], fx = 1180 + (i % 3) * 20;
      const d1 = 0.9 + (fx - starts[i][0]) / 1400;
      tl.to(sh.g, { x: fx, y: 860, duration: d1, ease: 'power1.inOut' }, t0);
      sh.trot(t0, t0 + d1, 3);
      const th = t0 + d1;
      tl.to(sh.g, { x: ex, duration: 0.5, ease: 'power1.out' }, th);
      tl.to(sh.g, { y: ey, duration: 0.5, ease: 'power1.in' }, th);
      sh.hop(th, 120, 0.5);
      X.sfx(th, 'boing', { gain: 0.22, pitch: 0.9 + i * 0.07 });
    });
    const fenceFront = X.svg('g', {}, w);
    K.fence(fenceFront, 1250, 965, 420, { h: 52 });
    // the pup herds them
    const pup = K.pup(w, { x: -200, y: 930, scale: 0.85 });
    tl.to(pup.g, { x: 1040, duration: 2.5, ease: 'power1.inOut' }, tHome - 0.1);
    pup.trot(tHome - 0.1, tHome + 2.4, 3.2);
    pup.wag(tHome + 2.3, tZ + 0.4, 5, 26);
    X.sfx(tHome + 2.4, 'bubble', { gain: 0.25 });
    // gate closes "on its own"
    const gate = X.svg('g', {}, w);
    K.gshape('rect', { x: 1150, y: 916, width: 100, height: 14, rx: 7 }, '#e3a77c', P.peachHi, gate, { dir: 't' });
    K.gshape('rect', { x: 1150, y: 938, width: 100, height: 14, rx: 7 }, '#e3a77c', P.peachHi, gate, { dir: 't' });
    gsap.set(gate, { svgOrigin: '1250 934', rotation: -70 });
    tl.to(gate, { rotation: 0, duration: 0.4, ease: 'back.out(2)' }, W('home', 'own') - 0.1);
    X.sfx(W('home', 'own') + 0.15, 'thud', { gain: 0.3 });
    // Maya, mug in hand, gets her evenings back
    const maya = K.character(w, { ...MAYA, x: 330, y: 1150, scale: 1.55, look: 0.45, pose: 'idle' });
    maya.setPose({ lSh: 8, lEl: -138, rSh: 7, rEl: 6, torso: 0, head: 3, headY: 0 }, 0);
    const mugG = maya.attach(-1);
    K.mug(mugG, -37, -170, 0.38, P.coral);
    const tMaya = W('home', 'Maya');
    maya.face(tMaya, { eyes: 'happy', mouth: 'smile' });
    maya.pose({ lSh: 8, lEl: -138, rSh: 24, rEl: 128, torso: 1, head: -4, headY: -2 }, W('home', 'back') - 0.12, 0.35).face(W('home', 'back'), { mouth: 'open' });
    maya.talk(tMaya, L('home').end + 0.4, 2);
    [[560, 520, 13], [900, 450, 11], [210, 420, 10], [760, 360, 9]].forEach(([x, y, s], i) => K.pop(K.sparkle(w, x, y, s, P.butter), W('home', 'evenings') + i * 0.1, { sfx: i ? false : 'sparkle', gain: 0.25 }));
    // whip-zoom out of the scene
    cam.to(tS8 + 0.5, { z: 1.05, cx: 990 }, tZ - tS8 - 0.5, 'sine.inOut');
    cam.to(tZ, { z: 3.6, cx: 330, cy: 1150 - 362 * 1.55 }, 0.32, 'expo.in');
    const bz = K.blur('xy'); tl.set(w, { attr: { filter: bz.url } }, tZ); bz.set(tZ, 0); bz.to(tZ, 14, 0.3, 'power2.in');
    X.sfx(tZ, 'zoom_in', { gain: 0.4, dur: 0.45 });
  });

  // =============================================================== S9 · freelancers everywhere (crowd + result bubbles)
  X.scene('proof', tZ + 0.3, tIris2 + 0.5, (g) => {
    const t0 = tZ + 0.3;
    const cam = K.camera(g, { z: 1.9, cx: 960, cy: 600 });
    const w = cam.g;
    cam.to(t0, { z: 1, cx: 900, cy: 560 }, 0.8, 'expo.out').to(t0 + 0.8, { cx: 1010 }, 5, 'sine.inOut');
    const bz = K.blur('xy'); w.setAttribute('filter', bz.url); bz.set(t0 - 0.01, 12); bz.to(t0, 0, 0.45, 'power2.out');
    tl.set(w, { attr: { filter: 'none' } }, t0 + 0.5);
    K.blob(w, 960, 640, 900, 360, P.blob, { seed: 15 });
    K.floaters(w, [['sparkle', 230, 210, 16, P.butter], ['dot', 1720, 250, 9, P.coral], ['ring', 1650, 420, 12, P.lav], ['dot', 330, 420, 7, P.tealHi], ['sparkle', 1380, 160, 12, P.coral], ['ring', 600, 170, 10, P.peri]], 21);
    const crowd = K.crowd(w, 6, 330, 1590, 1000, 1.3, 7);
    const xs = [300, 530, 745, 1175, 1390, 1620];
    crowd.forEach((c, i) => { gsap.set(c.g, { x: xs[i] }); tl.fromTo(c.g, { y: 1500 }, { y: 1000 + (i % 2) * 18, duration: 0.55, ease: 'back.out(1.4)', immediateRender: false }, t0 + 0.05 + i * 0.07); gsap.set(c.g, { y: 1500 }); });
    // Maya in the middle of the crowd
    const maya = K.character(w, { ...MAYA, x: 960, y: 1040, scale: 1.38, look: 0, pose: 'celebrate', mouth: 'grin', eyes: 'happy' });
    tl.fromTo(maya.g, { y: 1600 }, { y: 1040, duration: 0.55, ease: 'back.out(1.4)', immediateRender: false }, t0 + 0.2);
    gsap.set(maya.g, { y: 1600 });
    maya.hop(t0 + 0.9, 2, 16);
    const acts = ['wave', 'yay', 'chest', 'yay', 'celebrate', 'wave'];
    crowd.forEach((c, i) => {
      const ta = t0 + 0.6 + i * 0.17;
      c.pose(acts[i], ta, 0.4).face(ta, { mouth: i % 2 ? 'grin' : 'open', eyes: i % 3 === 0 ? 'happy' : 'open' });
      if (acts[i] === 'wave') c.wave(ta + 0.3, ta + 2.4);
      if (acts[i] === 'chest' || acts[i] === 'yay') c.talk(ta, ta + 3.5);
      if (acts[i] === 'celebrate') c.hop(ta + 0.3, 2, 14);
    });
    const bubbles = [[W('proof', 'Freelancers') + 0.35, 360, 470, 'Paid on time!', 'r', P.green, P.greenHi], [W('proof', 'admin') - 0.1, 1580, 470, 'No more chasing', 'l', P.tealMid, P.tealHi], [W('proof', 'love') - 0.3, 880, 300, 'More time to create', 'r', P.coral, P.coralHi]];
    bubbles.forEach(([t, x, y, txt, side, c, hi], i) => {
      const bg = X.svg('g', {}, w);
      const b = K.bubble(bg, x, y, txt, { side, size: 36, color: c, hi });
      K.pop(b, t, { ox: b.ox, oy: b.oy, sfx: 'pop', gain: 0.4, pitch: 1.1 + i * 0.1 });
      K.bob(bg, 5, 2.3 + i * 0.4, i);
    });
  });

  // =============================================================== S10 · CTA + logo resolve
  X.scene('logo', tIris2, END + 0.1, (g0) => {
    K.iris(g0, 960, 540, P.ground, tIris2, 0.42, { ease: 'power2.in' });
    const lcam = K.camera(g0, { z: 1, breathe: 0.012 });
    lcam.to(L('cta').start + 0.8, { z: 1.07 }, END - L('cta').start, 'sine.inOut');
    const g = lcam.g;
    const tName = W('cta', 'Tallypup');
    const blob = K.blob(g, 960, 540, 700, 330, P.blob, { seed: 4, hi: P.blob2, speed: 1.3, wobble: 1.3 });
    gsap.set(blob, { scale: 0, svgOrigin: '960 540' });
    tl.to(blob, { scale: 1, duration: 0.9, ease: 'power3.out', svgOrigin: '960 540' }, tName + 0.1);
    K.floaters(g, [['sparkle', 300, 250, 22, P.butter], ['ring', 1640, 260, 15, P.lav], ['dot', 1700, 820, 11, P.coral], ['sparkle', 1500, 900, 16, P.tealHi], ['ring', 260, 820, 13, P.peri], ['dot', 470, 150, 9, P.tealHi], ['sparkle', 1180, 140, 14, P.coral], ['leaf', 160, 520, 18, P.tealHi], ['leaf', 1780, 560, 16, P.peach], ['dot', 760, 960, 8, P.lav], ['ring', 1260, 980, 10, P.butter]], 31);
    const markG = X.svg('g', {}, g);
    const mark = K.pupMark(markG, 960, 500, 170);
    K.pop(mark, tName - 0.04, { dur: 0.5, ease: 'back.out(1.8)', sfx: 'pop', gain: 0.45 });
    X.sfx(tName + 0.05, 'chime', { gain: 0.45, dur: 1.6 });
    const tSlide = tName + 0.62;
    tl.to(markG, { x: -340, y: 0, duration: 0.6, ease: 'power3.inOut' }, tSlide);
    tl.to(mark, { scale: 0.62, svgOrigin: '960 500', duration: 0.6, ease: 'power3.inOut' }, tSlide);
    K.wordmark(g, 780, 548, 'tallypup', tSlide + 0.35, { size: 150, color: P.teal, dur: 0.85 });
    const tag = K.label(g, 786, 624, 'Invoices that come home.', { size: 46, weight: 500, color: P.tealMid, anchor: 'start' });
    tl.fromTo(tag, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, W('cta', 'Invoices') + 0.15);
    gsap.set(tag, { opacity: 0 });
    const cta = X.svg('g', {}, g);
    K.pill(cta, 960, 830, 'Try it free today', { size: 42, color: '#ea7a63', hi: P.coral });
    K.pop(cta, W('cta', 'Try') - 0.05, { sfx: 'pop', gain: 0.4, dur: 0.45 });
    tl.to(cta, { scale: 1.05, svgOrigin: '960 830', duration: 0.5, yoyo: true, repeat: 3, ease: 'sine.inOut' }, W('cta', 'Try') + 1.0);
    tl.to(mark.eyes[0], { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: 1 }, L('cta').end + 1.4);
    tl.to(mark.eyes[1], { scaleY: 0.1, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: 1 }, L('cta').end + 1.4);
    // a little pup trots in under the lockup during the music tail
    const pup = K.pup(g, { x: -260, y: 1012, scale: 0.72 });
    tl.to(pup.g, { x: 1390, duration: 3.0, ease: 'power1.inOut' }, L('cta').end + 0.6);
    pup.trot(L('cta').end + 0.6, L('cta').end + 3.6, 3.4);
    pup.wag(L('cta').end + 3.5, END + 1, 5, 26);
    tl.to(pup.g, { y: 980, duration: 0.2, yoyo: true, repeat: 1, ease: 'power2.out' }, L('cta').end + 3.7);
    X.sfx(L('cta').end + 3.7, 'boing', { gain: 0.2 });
    [[1300, 930, 14], [1500, 900, 11], [1440, 1010, 9]].forEach(([x, y, sz], i) => K.pop(K.sparkle(g, x, y, sz, i % 2 ? P.coral : P.butter), L('cta').end + 3.75 + i * 0.08, { sfx: i ? false : 'sparkle', gain: 0.25 }));
    X.sfx(L('cta').end + 1.3, 'bubble', { gain: 0.2 });
  });

  // the pivot field must sit above the send vignette while it closes onto the mark
  const pv = document.getElementById('pivot'), sd = document.getElementById('send');
  sd.parentNode.insertBefore(pv, sd.nextSibling);
  const py = document.getElementById('pay'), da = document.getElementById('dash');
  da.parentNode.insertBefore(py, da.nextSibling);
  X.end(END);
});
