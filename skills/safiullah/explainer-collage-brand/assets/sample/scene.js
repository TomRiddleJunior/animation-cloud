/* "Show the Work" — a 67 s B2B brand film for Openfold (fictional), collage-brand style.
 * Colour story: grey collage world (colour only on "the work") → hard colour flood on "start showing the work"
 * → cobalt colour world → navy glyph reveal → marigold logo card. */
X.boot(async (X) => {
  await X.loadVO();
  K.init();
  const P = K.P, tl = X.tl, W = 1920, H = 1080;
  const w = (id, s, n = 0) => X.word(id, s, n);
  const L = (id) => X.line(id);
  /** wrap an element in a fresh <g> (so a tween never fights a gsap-set position) */
  const wrap = (el) => { const g = document.createElementNS('http://www.w3.org/2000/svg', 'g'); el.parentNode.insertBefore(g, el); g.appendChild(el); return g; };
  const rise = (el, t, dy = 46, dur = 0.55, ease = 'power3.out') => { const g = wrap(el); gsap.set(g, { opacity: 0 }); tl.fromTo(g, { y: dy, opacity: 0 }, { y: 0, opacity: 1, duration: dur, ease, immediateRender: false }, t); return g; };
  const grow = (el, t, dur = 0.6, ease = 'back.out(1.25)', origin = '50% 100%') => { gsap.set(el, { scale: 0, transformOrigin: origin }); tl.fromTo(el, { scale: 0 }, { scale: 1, duration: dur, ease, immediateRender: false }, t); };
  const fadeIn = (el, t, dur = 0.3) => { gsap.set(el, { opacity: 0 }); tl.to(el, { opacity: 1, duration: dur, ease: 'power1.out' }, t); };
  /** place a cut-out whose inner group grows from its anchor */
  const cutAt = (parent, canvasFig, o) => K.cut(parent, canvasFig, o);
  /** matrix that maps a flat local (u,v) group onto an iso plane facing +y (u→ +x axis, v → down) or +x (u → +y axis) */
  const planeY = (iso, x0, y0, zTop) => { const [ax, ay] = iso.P(x0, y0, zTop); return `matrix(${0.8660254 * iso.s},${0.5 * iso.s},0,${iso.s},${ax},${ay})`; };
  const planeX = (iso, x0, y0, zTop) => { const [ax, ay] = iso.P(x0, y0, zTop); return `matrix(${-0.8660254 * iso.s},${0.5 * iso.s},0,${iso.s},${ax},${ay})`; };

  // ---------------------------------------------------------------- key times (all on narration words)
  const T = {};
  T.clock = w('hook1', 'work') - 0.15;
  T.man = w('hook2', 'and');
  T.truck0 = 3.25; T.truck1 = 7.05;
  T.office = L('rule').start;
  T.iris = w('changed', 'changed') + 0.12;
  T.rooms = T.iris + 0.4;
  T.cut1 = L('longway').start - 0.28;
  T.portal = w('longway', 'long');
  T.blocks = w('whynot', 'meeting');
  T.flood = L('whynot').end + 0.2;
  T.meet = T.flood + 0.86;
  T.cut2 = L('tear').start - 0.12;
  T.tear = w('tear', 'tear');
  T.rip = w('tear', 'meeting');
  T.colour = w('start', 'start');
  T.slide1 = L('shared').start - 0.6;
  T.slide2 = L('earn').start - 0.5;
  T.rib = L('earn').end - 0.05;
  T.burst = w('built', 'open') + 0.32;
  T.reveal = T.burst + 0.5;
  T.lock = w('built', 'page') + 0.42;
  T.logo = L('tag').start - 0.2;
  const END = L('tag').end + 3.3;

  // ================================================================= ACT 1 — the thread + the old office (one camera journey)
  X.scene('act1', 0, T.iris + 0.42, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.ground }, g);
    const cam = X.cam(X.svg('g', {}, g));
    // camera: hold, truck right through the collage, decelerate onto the office
    const CAMX = -2540;
    tl.fromTo(cam, { scale: 1 }, { scale: 1.035, duration: T.truck0 + 0.4, ease: 'sine.inOut', immediateRender: false }, 0);
    tl.fromTo(cam, { x: 0 }, { x: CAMX, duration: T.truck1 - T.truck0, ease: 'power1.inOut', immediateRender: false }, T.truck0);
    K.drift(cam, T.truck1, T.iris + 0.42, 9, 0, { x0: CAMX });

    // --- glyph + echoes + ring pulse
    const gx = 380, gy = 540;
    const ring = X.svg('circle', { cx: gx, cy: gy, r: 70, fill: 'none', stroke: '#757B92', 'stroke-width': 18 }, cam);
    const echo2 = K.glyph(cam, 120, { body: 'none', stroke: P.marigold, sw: 4, flap: 'none' }); echo2.under.remove();
    const echo1 = K.glyph(cam, 120, { body: P.pink, flap: P.marigold }); echo1.under.remove();
    const gl = K.glyph(cam, 120);
    [echo2, echo1, gl].forEach((e) => gsap.set(e, { x: gx, y: gy }));
    X.pop(gl, 0.25, { scale: 1, dur: 0.5, ease: 'back.out(2)', sfx: 'pop', gain: 0.35 });
    gsap.set([echo1, echo2], { opacity: 0 });
    tl.to(echo1, { x: gx + 58, opacity: 1, duration: 0.42, ease: 'power3.out' }, 0.95);
    tl.to(echo2, { x: gx + 116, opacity: 1, duration: 0.42, ease: 'power3.out' }, 1.07);
    X.sfx(0.95, 'blip_up', { gain: 0.25 }); X.sfx(1.07, 'blip_up', { gain: 0.22, pitch: 1.2 });
    gsap.set(ring, { opacity: 0 });
    tl.fromTo(ring, { attr: { r: 60 }, opacity: 0.7 }, { attr: { r: 150 }, opacity: 0, duration: 0.8, ease: 'power2.out', immediateRender: false }, 0.6);
    X.sfx(0.6, 'blip', { gain: 0.2 });
    // the thread: dashed pink line + thin gold line, revealed by a growing clip
    const thClip = X.svg('clipPath', { id: 'thClip' }, X.defs);
    const thRect = X.svg('rect', { x: gx + 170, y: 400, width: 0, height: 300 }, thClip);
    const th = X.svg('g', { 'clip-path': 'url(#thClip)' }, cam);
    X.svg('line', { x1: gx + 175, y1: gy, x2: 2900, y2: gy, stroke: P.pink, 'stroke-width': 3, 'stroke-dasharray': '12 9' }, th);
    X.svg('line', { x1: 1180, y1: gy + 1, x2: 2900, y2: gy + 1, stroke: '#E2B866', 'stroke-width': 2.5 }, th);
    tl.to(thRect, { attr: { width: 900 }, duration: 0.9, ease: 'power2.out' }, 1.3);
    tl.to(thRect, { attr: { width: 2800 }, duration: 3.6, ease: 'none' }, 2.2);
    X.sfx(1.3, 'swoosh', { gain: 0.25, dur: 0.6 });

    // --- the clock (the "moon"): halftone cut-out on a stipple halo + gradient crescent
    const cg = X.svg('g', {}, cam); gsap.set(cg, { x: 1180, y: gy });
    K.stipple(cg, { x: 0, y: 0, w: 470, h: 470, core: 0.62, color: '#8C92A6', dot: 2, seed: 4 });
    const cres = X.svg('path', { d: 'M-120,-170 A210,210 0 1,1 -190,120 A180,180 0 1,0 -120,-170 Z', fill: K.work }, cg);
    const clockImg = cutAt(cg, K.fig.clock({ h: 8, m: 59 }), { x: 0, y: 165, h: 330, cell: 5.5, rim: 0, contrast: 1.25 });
    grow(cg, T.clock, 0.7, 'back.out(1.2)', '50% 50%');
    X.sfx(T.clock, 'pop', { gain: 0.35, pitch: 0.7 });
    // little speed dashes that trail the clock once we truck
    const dashes = X.svg('g', {}, cg);
    [[-250, -40, 70, P.sky], [-290, -10, 110, P.tangerine], [-240, 22, 60, P.marigold]].forEach(([x, y, l, c], i) => {
      const d = X.svg('line', { x1: x, y1: y, x2: x + l, y2: y, stroke: c, 'stroke-width': 10, 'stroke-linecap': 'round' }, dashes);
      gsap.set(d, { opacity: 0 }); tl.fromTo(d, { opacity: 0, x: 60 }, { opacity: 1, x: 0, duration: 0.4, ease: 'power2.out', immediateRender: false }, T.truck0 + 0.3 + i * 0.08);
    });
    tl.fromTo(clockImg._inner, { rotation: 0 }, { rotation: -4, duration: 4, ease: 'none', svgOrigin: '0 -165', immediateRender: false }, T.clock + 0.7);

    // --- a gradient swoosh between the two pictures
    const sw = X.svg('path', { d: 'M1500,600 C1600,470 1700,520 1760,560 C1820,600 1900,660 1960,560 C1990,520 2010,610 1960,650 C1880,720 1790,640 1730,620 C1640,590 1560,700 1500,600 Z', fill: K.cool, opacity: 0.95 }, cam);
    gsap.set(sw, { scaleX: 0, transformOrigin: '0% 50%' });
    tl.to(sw, { scaleX: 1, duration: 0.7, ease: 'power3.out' }, T.truck0 + 0.6);

    // --- the commuter (hat, coat, briefcase) on a sunset disc
    const mg = X.svg('g', {}, cam); gsap.set(mg, { x: 2140, y: 0 });
    const disc = X.svg('circle', { cx: 30, cy: 500, r: 210, fill: K.sunset }, mg);
    K.stipple(mg, { x: 120, y: 470, w: 380, h: 380, core: 0.2, color: P.marigold, dot: 2, seed: 7, opacity: 0.85 });
    const man = cutAt(mg, K.fig.man({ hat: true, coat: true, briefcase: true, tone: 0.34 }), { x: 0, y: 790, h: 520, rim: 5, contrast: 1.2 });
    grow(disc, T.man - 0.1, 0.55, 'back.out(1.3)', '50% 50%');
    gsap.set(man, { opacity: 0 });
    tl.fromTo(man, { x: 260, opacity: 0 }, { x: 0, opacity: 1, duration: 0.6, ease: 'power3.out', immediateRender: false }, T.man);
    X.sfx(T.man, 'swoosh', { gain: 0.35, dur: 0.5 });
    // a torn scrap + tape behind him: the collage tell
    const sc = K.scrap(mg, { x: -170, y: 360, w: 170, h: 120, rot: -9, color: '#E9E6DF', seed: 21 });
    [[18, 24, 90, 9, '#6F7587'], [18, 46, 128, 6, '#A3A9B4'], [18, 62, 110, 6, '#A3A9B4'], [18, 78, 120, 6, '#A3A9B4']].forEach(([x, y, w2, h2, f]) => X.svg('rect', { x, y, width: w2, height: h2, fill: f }, sc._body));
    K.tape(sc, 0, -58, 90, 6, { seed: 3 });
    rise(sc, T.man + 0.2, 30, 0.45);

    // --- THE OLD OFFICE (world centre x ≈ 3000)
    const iso = K.iso(2909 + 360, 300, 1);
    const off = X.svg('g', {}, cam);
    // walls rise on "be in the room"
    const wallL = iso.poly(off, [[-220, -160, 0], [-220, 560, 0], [-220, 560, 0], [-220, -160, 0]], '#C9CCD5');
    const wallR = iso.poly(off, [[-220, -160, 0], [1060, -160, 0], [1060, -160, 0], [-220, -160, 0]], '#B3B8C3');
    const wh = { h: 0 };
    const setWalls = () => {
      wallL.setAttribute('points', iso.pts([[-220, -160, 0], [-220, 560, 0], [-220, 560, wh.h], [-220, -160, wh.h]]));
      wallR.setAttribute('points', iso.pts([[-220, -160, 0], [1060, -160, 0], [1060, -160, wh.h], [-220, -160, wh.h]]));
    };
    setWalls();
    tl.fromTo(wh, { h: 0 }, { h: 380, duration: 0.7, ease: 'power3.out', onUpdate: setWalls, immediateRender: false }, w('rule', 'be') - 0.05);
    X.sfx(w('rule', 'be') - 0.05, 'thud', { gain: 0.4 });
    // floor shadow
    const fsh = K.shadow(off, 3020 + 360, 640, 560, 210, 8);
    gsap.set(fsh, { scale: 0, transformOrigin: '50% 50%' });
    tl.to(fsh, { scale: 1, duration: 0.6, ease: 'power3.out' }, T.office + 0.05);
    // desks in rows + workers seen from behind
    const workers = [0.42, 0.3, 0.52, 0.36, 0.46, 0.28, 0.5, 0.34, 0.4];
    let k = 0;
    for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
      const x = c * 250, y = r * 190, tt = T.office + 0.2 + (r * 3 + c) * 0.07;
      const dg = X.svg('g', {}, off);
      iso.box(dg, x, y, 0, 170, 80, 62, K.DESK);
      iso.poly(dg, [[x + 22, y + 14, 62], [x + 92, y + 10, 62], [x + 96, y + 52, 62], [x + 26, y + 56, 62]], (r * 3 + c) % 4 === 1 ? K.work : '#F1EEE8');
      rise(dg, tt, 36, 0.45);
      const [px, py] = iso.P(x + 110, y + 132, 0);
      const wk = cutAt(off, K.fig.seatedBack({ tone: workers[k], hair: 0.18 + (k % 3) * 0.08 }), { x: px, y: py, h: 150, cell: 4.5 });
      rise(wk, T.office + 0.75 + k * 0.06, 26, 0.4);
      k++;
    }
    X.sfx(T.office + 0.2, 'click', { gain: 0.25 }); X.sfx(T.office + 0.45, 'click', { gain: 0.22, pitch: 1.1 }); X.sfx(T.office + 0.8, 'pop', { gain: 0.22 });
    // punch clock on a post (on "punch clock")
    const [pcx, pcy] = iso.P(-90, 420, 0);
    const pc = cutAt(off, K.fig.punchClock({}), { x: pcx, y: pcy, h: 330, rim: 4 });
    grow(pc._inner, w('rule', 'punch'), 0.5, 'back.out(1.3)');
    X.sfx(w('rule', 'punch'), 'stamp', { gain: 0.3 });
    // corner office: a glass box with a manager (on "corner office")
    const co = X.svg('g', {}, off);
    const gx0 = 820, gy0 = -120;
    iso.box(co, gx0, gy0, 0, 230, 300, 4, { top: '#9AA1AE', left: '#80889A', right: '#6A7184' });
    iso.box(co, gx0 + 50, gy0 + 120, 0, 120, 60, 58, K.DESK);
    const [lmx, lmy] = iso.P(gx0 + 140, gy0 + 140, 62);
    X.svg('rect', { x: lmx - 4, y: lmy - 40, width: 8, height: 40, fill: '#3E4D66' }, co);
    X.svg('path', { d: `M${lmx - 26},${lmy - 40} Q${lmx},${lmy - 66} ${lmx + 26},${lmy - 40} Z`, fill: '#6F7587' }, co);
    const lampGlow = X.svg('ellipse', { cx: lmx, cy: lmy - 36, rx: 18, ry: 6, fill: P.cream }, co);
    const [mx, my] = iso.P(gx0 + 60, gy0 + 250, 0);
    cutAt(co, K.fig.man({ tone: 0.3 }), { x: mx, y: my, h: 250, cell: 4.5 });
    const glass = X.svg('g', { opacity: 0.42 }, co);
    iso.poly(glass, [[gx0, gy0 + 300, 270], [gx0 + 230, gy0 + 300, 270], [gx0 + 230, gy0 + 300, 0], [gx0, gy0 + 300, 0]], '#E8EEF6');
    iso.poly(glass, [[gx0 + 230, gy0, 270], [gx0 + 230, gy0 + 300, 270], [gx0 + 230, gy0 + 300, 0], [gx0 + 230, gy0, 0]], '#CBD3E0');
    [[gx0 + 115, gy0 + 300], [gx0 + 230, gy0 + 150]].forEach(([a, b]) => { const p0 = iso.P(a, b, 0), p1 = iso.P(a, b, 270); X.svg('line', { x1: p0[0], y1: p0[1], x2: p1[0], y2: p1[1], stroke: '#F6F8FB', 'stroke-width': 3 }, glass); });
    iso.poly(co, [[gx0, gy0, 270], [gx0 + 230, gy0, 270], [gx0 + 230, gy0 + 300, 270], [gx0, gy0 + 300, 270]], '#D8DCE4', { opacity: 0.55 });
    rise(co, w('rule', 'corner'), 50, 0.6);
    X.sfx(w('rule', 'corner'), 'pop', { gain: 0.3, pitch: 0.85 });
    // pendant lamps drop in, with stipple light pools
    const lamps = [];
    [[120, 120], [380, 300], [620, 160]].forEach(([lx, ly], i) => {
      const [sx, sy] = iso.P(lx, ly, 330);
      const lg = X.svg('g', {}, off);
      const lp = cutAt(lg, K.fig.lamp({}), { x: sx, y: sy + 20, h: 150, cell: 4 });
      X.svg('line', { x1: sx, y1: sy - 700, x2: sx, y2: sy - 128, stroke: '#2B3142', 'stroke-width': 3 }, lg);
      gsap.set(lg, { opacity: 0 });
      tl.fromTo(lg, { y: -320, opacity: 1 }, { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out', immediateRender: false }, w('rule', 'one') + i * 0.12);
      lamps.push([lp, sx, sy - 128, i]);
    });
    X.sfx(w('rule', 'one'), 'drop', { gain: 0.25 });
    X.every((t) => lamps.forEach(([lp, sx, sy, i]) => gsap.set(lp._inner, { rotation: Math.sin(t * 1.4 + i * 1.7) * 1.6, svgOrigin: `0 ${-150}` })));
    // the iris opens from the manager's lamp
    const [ix, iy] = [lmx + CAMX - 9 * (T.iris - T.truck1), lmy - 36];
    K.iris(g, T.iris, ix, iy, P.wall, 0.42);
  });

  // ================================================================= ACT 2 — many offices; colour pops on the spoken list
  X.scene('act2', T.rooms, T.cut1, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.wall }, g);
    const cam = X.cam(X.svg('g', {}, g));
    // camera: tight on the first room, pull back on "many" as the others arrive, then drift
    const tPB = w('many', 'many') - 0.3, xA = -(434 - 960) * 1.5, yA = -(585 - 540) * 1.5;
    tl.fromTo(cam, { scale: 1.5, x: xA, y: yA }, { scale: 1.44, x: xA - 30, y: yA, duration: tPB - T.rooms, ease: 'none', immediateRender: false }, T.rooms);
    tl.fromTo(cam, { scale: 1.44, x: xA - 30, y: yA }, { scale: 1.05, x: 40, y: 0, duration: 1.1, ease: 'power3.out', immediateRender: false }, tPB);
    tl.fromTo(cam, { scale: 1.05, x: 40, y: 0 }, { scale: 1.0, x: -110, y: -16, duration: T.cut1 - tPB - 1.1, ease: 'none', immediateRender: false }, tPB + 1.1);
    X.sfx(tPB, 'woosh_low', { gain: 0.3, dur: 1.0 });
    const ROOM = { floor: '#CDD1DA', slabL: '#A3A9B4', slabR: '#7D8394', wallL: '#B6BBC7', wallR: '#C6CAD3' };
    const room = (cx, cy, t0, kind) => {
      const rg = X.svg('g', {}, cam);
      const iso = K.iso(cx, cy - 150, 0.98);
      K.shadow(rg, cx + 34, cy + 80, 300, 110, 12);
      iso.box(rg, 0, 0, -22, 300, 260, 22, { top: ROOM.floor, left: ROOM.slabL, right: ROOM.slabR });
      iso.box(rg, -14, 0, 0, 14, 260, 230, { top: '#E9EAEE', left: '#9AA0AD', right: ROOM.wallL });
      iso.box(rg, -14, -14, 0, 314, 14, 230, { top: '#E9EAEE', left: ROOM.wallR, right: '#9AA0AD' });
      const c = X.svg('g', {}, rg);
      rise(rg, t0, 60, 0.6);
      return { rg, iso, c };
    };
    const tA = T.rooms + 0.1, tB = w('many', 'many');
    const A = room(420, 680, tA, 'kitchen'), B = room(975, 455, tB, 'sofa'), C = room(1530, 700, tB + 0.18, 'counter');
    X.sfx(tA, 'thud', { gain: 0.35 }); X.sfx(tB, 'thud', { gain: 0.3 }); X.sfx(tB + 0.18, 'thud', { gain: 0.28, pitch: 1.1 });
    const laptop = (R, x, y, z) => {
      const lg = X.svg('g', {}, R.c);
      R.iso.poly(lg, [[x, y, z], [x + 62, y, z], [x + 62, y + 42, z], [x, y + 42, z]], '#3E4556');
      R.iso.poly(lg, [[x, y, z], [x + 62, y, z], [x + 62, y, z + 44], [x, y, z + 44]], '#596173');
      const scr = R.iso.poly(lg, [[x + 4, y, z + 4], [x + 58, y, z + 4], [x + 58, y, z + 40], [x + 4, y, z + 40]], K.workH);
      return scr;
    };
    // Room A — kitchen table, woman at a laptop, lamp
    {
      const R = A; R.iso.box(R.c, 120, 100, 0, 130, 90, 70, { top: '#E7E2DA', left: '#A79F95', right: '#857D73' });
      const scr = laptop(R, 150, 120, 70);
      const [px, py] = R.iso.P(70, 190, 0);
      cutAt(R.c, K.fig.seatedSide({ hair: 'long', tone: 0.5 }), { x: px, y: py, h: 210, cell: 4.2 });
      const [lx, ly] = R.iso.P(185, 145, 230);
      const lp = cutAt(R.c, K.fig.lamp({}), { x: lx, y: ly + 10, h: 90, cell: 3.6 });
      X.svg('line', { x1: lx, y1: ly - 200, x2: lx, y2: ly - 76, stroke: '#2B3142', 'stroke-width': 2 }, R.c);
      K.colourPop(scr, w('many', 'laptops'), { pitch: 1 });
      R.scr = scr;
    }
    // Room B — window, standing woman with a phone, plant
    {
      const R = B;
      const win = R.iso.poly(R.c, [[60, -1, 70], [200, -1, 70], [200, -1, 200], [60, -1, 200]], '#EEF0F4');
      R.iso.poly(R.c, [[128, -1, 70], [132, -1, 70], [132, -1, 200], [128, -1, 200]], '#AEB4C0');
      R.iso.box(R.c, 40, 150, 0, 200, 80, 46, { top: '#8C93A2', left: '#6C7385', right: '#555C6D' });
      R.iso.box(R.c, 40, 150, 46, 200, 22, 50, { top: '#9AA1AE', left: '#7A8192', right: '#5F6677' });
      const [px, py] = R.iso.P(190, 120, 0);
      const wm = cutAt(R.c, K.fig.woman({ tone: 0.5 }), { x: px, y: py, h: 230, cell: 4.2 });
      const [fx, fy] = R.iso.P(0, 60, 0);
      cutAt(R.c, K.fig.plant({ seed: 5 }), { x: fx + 30, y: fy + 4, h: 130, cell: 3.8 });
      const phone = X.svg('rect', { x: px + 44, y: py - 160, width: 26, height: 44, rx: 5, fill: '#3E4556', transform: `rotate(-12 ${px + 57} ${py - 138})` }, R.c);
      const ph = X.svg('rect', { x: px + 47, y: py - 157, width: 20, height: 38, rx: 3, fill: K.work, transform: `rotate(-12 ${px + 57} ${py - 138})` }, R.c);
      K.colourPop(ph, w('many', 'phones'), { pitch: 1.12 });
    }
    // Room C — kitchen counter with a laptop and a gradient tablecloth
    {
      const R = C; R.iso.box(R.c, 90, 60, 0, 170, 100, 80, { top: '#E7E2DA', left: '#A79F95', right: '#857D73' });
      const cloth = R.iso.poly(R.c, [[100, 66, 80.5], [250, 66, 80.5], [250, 154, 80.5], [100, 154, 80.5]], K.cool);
      const scr = laptop(R, 170, 84, 80);
      const [px, py] = R.iso.P(40, 150, 0);
      cutAt(R.c, K.fig.seatedSide({ hair: 'short', tone: 0.32 }), { x: px, y: py, h: 220, cell: 4.2 });
      K.colourPop(cloth, w('many', 'kitchen'), { pitch: 1.24 });
      K.colourPop(scr, w('many', 'tables'), { pitch: 1.3 });
    }
    // three time zones: a wall clock in each room gets a gradient ring
    [[A, 7, 0, 'three'], [B, 12, 15, 'time'], [C, 17, 40, 'zones']].forEach(([R, hh, mm, word], i) => {
      const [cx, cy] = R.iso.P(250, -14, 175);
      const ringC = X.svg('circle', { cx: cx, cy: cy - 30, r: 40, fill: 'none', stroke: i === 1 ? K.cool : K.work, 'stroke-width': 11 }, R.c);
      const ck = cutAt(R.c, K.fig.clock({ h: hh, m: mm }), { x: cx, y: cy + 4, h: 68, cell: 3.2, shadow: false });
      K.colourPop(ringC, w('many', word), { sfx: 'tick', gain: 0.35, from: 0.5 });
      tl.fromTo(ck._inner, { scale: 1 }, { scale: 1.12, duration: 0.12, yoyo: true, repeat: 1, ease: 'power1.out', svgOrigin: '0 -34', immediateRender: false }, w('many', word));
    });
  });

  // ================================================================= ACT 3a — scale reveal: a building-size calendar
  const bb = {};
  X.scene('act3a', T.cut1, T.meet, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.ground }, g);
    const cam = X.cam(X.svg('g', {}, g));
    const iso = K.iso(820, 330, 1);
    // back blocks + chimneys
    K.shadow(cam, 1180, 820, 640, 120, 31);
    iso.box(cam, 260, -320, 0, 420, 260, 640, { top: '#9399A6', left: '#5E6478', right: '#474D60' });
    iso.box(cam, 520, -160, 640, 50, 50, 140, { top: '#9399A6', left: '#6F7587', right: '#4A5064' });
    iso.box(cam, 420, -260, 640, 40, 40, 100, { top: '#9399A6', left: '#6F7587', right: '#4A5064' });
    iso.box(cam, 0, 0, 0, 700, 240, 520, { top: '#B9BECA', left: '#8A90A0', right: '#5A6074' });
    iso.box(cam, 700, 40, 0, 240, 160, 300, { top: '#A3A9B4', left: '#767C8E', right: '#4E5468' });
    // rows of little windows on the side block
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) iso.poly(cam, [[940, 56 + c * 34, 60 + r * 60], [940, 78 + c * 34, 60 + r * 60], [940, 78 + c * 34, 96 + r * 60], [940, 56 + c * 34, 96 + r * 60]], '#3B4255');
    // the billboard on the +y face
    const BW = 600, BH = 380;
    const bg = X.svg('g', { transform: planeY(iso, 50, 241, 480) }, cam);
    X.svg('rect', { x: -14, y: -14, width: BW + 28, height: BH + 28, fill: '#4A5064' }, bg);
    X.svg('image', { href: K.paperURL('#F3EFE8', 300, 190, 0.1, 9), width: BW, height: BH, preserveAspectRatio: 'none' }, bg);
    // the gradient portal (colour = the work)
    const portal = X.svg('path', { d: `M${BW / 2 - 105},${BH - 40} L${BW / 2 - 105},${BH / 2 - 30} A105,105 0 0,1 ${BW / 2 + 105},${BH / 2 - 30} L${BW / 2 + 105},${BH - 40} Z`, fill: K.sunset }, bg);
    const pb = X.svg('g', {}, bg);
    [[BW / 2 - 40, BH - 110, 46, K.work, 3], [BW / 2 + 50, BH - 170, 34, K.cool, 5]].forEach(([x, y, r, f, s]) => K.blob(pb, x, y, r, f, { seed: s, speed: 1.1 }));
    gsap.set([portal, pb], { scale: 0, transformOrigin: '50% 100%' });
    tl.to([portal, pb], { scale: 1, duration: 0.7, ease: 'back.out(1.2)' }, T.portal);
    X.sfx(T.portal, 'sparkle', { gain: 0.3 });
    // meetings stamp over everything ("so why hasn't the meeting?")
    const r = X.rand(77), cols = 7, rows = 5, cw = BW / cols, rh = (BH - 46) / rows;
    const cover = X.svg('rect', { x: 0, y: 0, width: BW, height: BH, fill: '#DCDDE2' }, bg);
    gsap.set(cover, { opacity: 0 }); tl.to(cover, { opacity: 1, duration: 0.25, ease: 'power1.in' }, T.blocks + 0.05);
    X.svg('rect', { x: 0, y: 0, width: BW, height: 40, fill: '#3E4659' }, bg);
    const blocks = [];
    for (let i = 0; i < cols; i++) for (let j = 0; j < rows; j++) {
      const shade = ['#8C92A0', '#6F7587', '#A3A9B4', '#7D8394'][Math.floor(r() * 4)];
      const b = X.svg('rect', { x: i * cw + 5, y: 46 + j * rh + 5, width: cw - 10, height: rh * (r() < 0.25 ? 2 : 1) - 10, fill: shade, rx: 3 }, bg);
      blocks.push([b, r()]);
    }
    blocks.sort((a, b) => a[1] - b[1]).forEach(([b], i) => {
      const t = T.blocks - 0.05 + i * 0.022;
      gsap.set(b, { opacity: 0, transformOrigin: '50% 50%' });
      tl.fromTo(b, { opacity: 0, scale: 1.35 }, { opacity: 1, scale: 1, duration: 0.09, ease: 'power2.out', immediateRender: false }, t);
      if (i % 5 === 0) X.sfx(t, 'stamp', { gain: 0.16, pitch: 1 + (i % 3) * 0.1 });
    });
    // the tiny figure
    const [fx, fy] = iso.P(-60, 470, 0);
    K.shadow(cam, fx + 26, fy + 2, 34, 8, 4);
    cutAt(cam, K.fig.man({ tone: 0.3 }), { x: fx, y: fy, h: 84, cell: 2.6 });
    // pull back: from the billboard surface to the whole building, then keep pulling slowly
    const [bcx, bcy] = iso.P(350, 241, 290);
    bb.x = bcx; bb.y = bcy;
    K.pullBack(cam, T.cut1, 2.5, 0.86, 3.05, { x0: -(bcx - 960) * 2.5, y0: -(bcy - 540) * 2.5, x1: 40, y1: 70, ease: 'power3.out' });
    tl.to(cam, { scale: 0.79, x: 60, y: 80, duration: T.meet - (T.cut1 + 3.05), ease: 'none' }, T.cut1 + 3.05);
    const sEnd = 0.86 - 0.07 * ((T.flood - (T.cut1 + 3.05)) / (T.meet - (T.cut1 + 3.05)));
    bb.sx = 960 + (bcx - 960) * sEnd + 45; bb.sy = 540 + (bcy - 540) * sEnd + 72;
  });

  // ================================================================= ACT 3b — the nine o'clock meeting (dark), pull-back to a labyrinth of rooms
  X.scene('act3b', T.meet, T.cut2, (g) => {
    X.svg('rect', { width: W, height: H, fill: '#2F3647' }, g);
    const cam = X.cam(X.svg('g', {}, g));
    const iso = K.iso(900, 220, 1);
    const roomG = X.svg('g', { id: 'meetRoom' }, cam);
    iso.box(roomG, 0, 0, -26, 1040, 700, 26, { top: '#4A5064', left: '#3A4152', right: '#2C3240' });
    iso.box(roomG, -20, -20, 0, 20, 720, 420, { top: '#5E6478', left: '#353C4D', right: '#454D61' });
    iso.box(roomG, -20, -20, 0, 1060, 20, 420, { top: '#5E6478', left: '#3B4356', right: '#353C4D' });
    // lit doorway + silhouette
    iso.poly(roomG, [[600, 0.5, 0], [720, 0.5, 0], [720, 0.5, 250], [600, 0.5, 250]], P.cream);
    const [dcx, dcy] = iso.P(660, 0, 125);
    K.stipple(roomG, { x: dcx, y: dcy + 40, w: 460, h: 520, shape: 'rect', cx: 0.45, cy: 0.38, color: '#E9E3D8', dot: 2, seed: 41, opacity: 0.5 });
    iso.poly(roomG, [[600, 0.5, 0], [720, 0.5, 0], [720, 0.5, 250], [600, 0.5, 250]], P.cream);
    iso.poly(roomG, [[600, 2, 0], [720, 2, 0], [820, 160, 0], [640, 200, 0]], '#E6E0D4', { opacity: 0.35 });
    const [sx, sy] = iso.P(660, 4, 0);
    cutAt(roomG, K.fig.man({ tone: 0.2 }), { x: sx, y: sy + 2, h: 210, cell: 3.6, bright: -0.42, contrast: 1.4, shadow: false });
    // projection screen on the back-left wall with grey bars
    const scrG = X.svg('g', { transform: planeX(iso, 0.5, 300, 262) }, roomG);
    X.svg('rect', { x: 0, y: 0, width: 300, height: 200, fill: '#C9CDD6' }, scrG);
    const bars = [];
    [70, 110, 60, 140, 90].forEach((hgt, i) => { const b = X.svg('rect', { x: 30 + i * 52, y: 180 - hgt, width: 34, height: hgt, fill: '#7D8394' }, scrG); bars.push(b); });
    bars.forEach((b, i) => { gsap.set(b, { scaleY: 0, transformOrigin: '50% 100%' }); tl.to(b, { scaleY: 1, duration: 0.4, ease: 'power2.out' }, w('still', 'simply') + i * 0.07); });
    X.sfx(w('still', 'simply'), 'blip_up', { gain: 0.18 });
    // projector cone (stipple)
    const [px0, py0] = iso.P(330, 330, 90);
    const cone = K.stipple(roomG, { x: 0, y: 0, w: 260, h: 420, shape: 'cone', top: 0.03, color: '#DCD8CE', dot: 2, seed: 44, opacity: 0.45 });
    cone.setAttribute('transform', `translate(${px0 - 150},${py0 - 150}) rotate(122)`);
    // the table, chairs and people
    const T0 = 210, TL = 620, Ty = 300, Td = 150;
    for (let i = 0; i < 4; i++) iso.box(roomG, T0 + 40 + i * 145, Ty - 70, 0, 60, 50, 90, { top: '#4F5669', left: '#3E4555', right: '#323846' });
    const farPeople = [];
    for (let i = 0; i < 4; i++) {
      const [bx, by] = iso.P(T0 + 70 + i * 145, Ty - 20, 0);
      const bust = K.crop(K.fig.man({ tone: 0.28 + (i % 2) * 0.16 }), 0, 0, 280, 420);
      farPeople.push(cutAt(roomG, bust, { x: bx, y: by - 50, h: 160, cell: 3.6 }));
    }
    iso.box(roomG, T0, Ty, 0, TL, Td, 74, { top: '#8C92A0', left: '#5F6577', right: '#4A5064' });
    iso.box(roomG, 330, 330, 74, 40, 30, 18, { top: '#B9BECA', left: '#7D8394', right: '#5F6577' });
    for (let i = 0; i < 4; i++) iso.poly(roomG, [[T0 + 50 + i * 145, Ty + 20, 74.5], [T0 + 110 + i * 145, Ty + 16, 74.5], [T0 + 112 + i * 145, Ty + 56, 74.5], [T0 + 52 + i * 145, Ty + 60, 74.5]], '#D9D6CF');
    const near = [];
    for (let i = 0; i < 4; i++) {
      const [bx, by] = iso.P(T0 + 100 + i * 145, Ty + Td + 70, 0);
      near.push(cutAt(roomG, K.fig.seatedBack({ tone: 0.3 + (i % 3) * 0.08, hair: 0.16 + (i % 2) * 0.1 }), { x: bx, y: by, h: 170, cell: 3.8 }));
    }
    // presenter at the screen (flipped so he points at it)
    const [prx, pry] = iso.P(90, 420, 0);
    const pres = cutAt(roomG, K.fig.man({ point: true, tone: 0.42 }), { x: prx, y: pry, h: 300, cell: 3.8, flip: true });
    // wall clock with live hands (9:00 on "nine", spins on "hours")
    const [ckx, cky] = iso.P(900, -19, 300);
    const ck = cutAt(roomG, K.fig.clock({ hands: false }), { x: ckx, y: cky + 60, h: 120, cell: 3.2 });
    const hands = X.svg('g', {}, roomG);
    const hh = X.svg('line', { x1: ckx, y1: cky, x2: ckx, y2: cky - 28, stroke: '#1E2230', 'stroke-width': 7, 'stroke-linecap': 'round' }, hands);
    const mh = X.svg('line', { x1: ckx, y1: cky, x2: ckx, y2: cky - 42, stroke: '#1E2230', 'stroke-width': 4, 'stroke-linecap': 'round' }, hands);
    gsap.set(hh, { rotation: -90, svgOrigin: `${ckx} ${cky}` }); gsap.set(mh, { rotation: 0, svgOrigin: `${ckx} ${cky}` });
    grow(ck._inner, w('still', 'nine') - 0.1, 0.4, 'back.out(1.4)', '50% 50%'); gsap.set(hands, { scale: 0, svgOrigin: `${ckx} ${cky}` }); tl.to(hands, { scale: 1, duration: 0.4, ease: 'back.out(1.4)', svgOrigin: `${ckx} ${cky}` }, w('still', 'nine') - 0.1);
    X.sfx(w('still', 'nine'), 'tock', { gain: 0.45 });
    tl.fromTo(mh, { rotation: 0 }, { rotation: 1080, duration: 2.2, ease: 'power1.inOut', svgOrigin: `${ckx} ${cky}`, immediateRender: false }, w('hours', 'hours'));
    tl.fromTo(hh, { rotation: -90 }, { rotation: 0, duration: 2.2, ease: 'power1.inOut', svgOrigin: `${ckx} ${cky}`, immediateRender: false }, w('hours', 'hours'));
    [0, 0.5, 1.0, 1.5].forEach((d) => X.sfx(w('hours', 'hours') + d, 'tick', { gain: 0.22 }));
    // talk scribbles: the presenter, then everyone
    const talkG = X.svg('g', {}, roomG);
    K.mark(talkG, K.scribble.talk(prx - 40, pry - 290, -2.4, 46, 3), w('still', 'say'), { color: P.cream, w: 5, dur: 0.35 });
    K.mark(talkG, K.scribble.talk(prx - 30, pry - 280, -1.9, 36, 8), w('still', 'loud'), { color: P.cream, w: 5, dur: 0.3, sfx: false });
    farPeople.forEach((fp, i) => {
      const [bx, by] = iso.P(T0 + 70 + i * 145, Ty - 20, 0);
      K.mark(talkG, K.scribble.talk(bx + 10, by - 200, -1.2 - (i % 2) * 0.5, 34, 11 + i), w('hours', 'lots') + i * 0.16, { color: P.cream, w: 4.5, dur: 0.3, gain: 0.15 });
    });
    // nothing getting made: one sheet, circled in grey
    const [shx, shy] = iso.P(T0 + 330, Ty + 75, 74);
    K.mark(roomG, K.scribble.circle(shx, shy, 66, 30, 9), w('hours', 'little'), { color: '#9AA0AD', w: 4, dur: 0.5 });
    // labyrinth: clones of the room around it, revealed by the pull-back
    const cl = [];
    for (let i = -2; i <= 2; i++) for (let j = -2; j <= 2; j++) if (i || j) cl.push([i, j]);
    cl.sort((a, b) => a[0] + a[1] - (b[0] + b[1]));
    cl.forEach(([i, j]) => {
      const dx = (i * 1300 - j * 960) * 0.8660254, dy = (i * 1300 + j * 960) * 0.5;
      const u = document.createElementNS('http://www.w3.org/2000/svg', 'use');
      u.setAttribute('href', '#meetRoom'); u.setAttribute('x', dx); u.setAttribute('y', dy);
      if (i + j < 0 || (i + j === 0 && i < 0)) cam.insertBefore(u, roomG); else cam.appendChild(u);
      gsap.set(u, { opacity: 0 }); tl.to(u, { opacity: 1, duration: 0.35, ease: 'power1.out' }, w('hours', 'lots') + 0.35);
    });
    // camera: slow push while they talk, then the pull-back reveal
    tl.fromTo(cam, { scale: 1.24, x: -60, y: -40 }, { scale: 1.14, x: -50, y: -30, duration: w('hours', 'lots') + 0.35 - T.meet, ease: 'none', immediateRender: false }, T.meet);
    K.pullBack(cam, w('hours', 'lots') + 0.35, 1.14, 0.6, 2.6, { x0: -50, y0: -30, x1: -60, y1: -40, ease: 'power3.out' });
    bb.dx = 960 + (dcx - 960) * 1.24 - 60; bb.dy = 540 + (dcy - 540) * 1.24 - 40;
    tl.to(cam, { scale: 0.58, duration: T.cut2 - (w('hours', 'lots') + 2.95), ease: 'none' }, w('hours', 'lots') + 2.95);
  });

  // ================================================================= stipple light-flood: billboard → the lit doorway
  X.scene('flood', T.flood, T.meet + 0.75, (g) => {
    K.lightFlood(g, T.flood, bb.sx, bb.sy, { dur: T.meet - T.flood, out: { t: T.meet, x: bb.dx, y: bb.dy, r: 230, dur: 0.75 } });
  });

  // ================================================================= ACT 4 (under the page) — the colour world
  X.scene('act4', T.cut2 + 0.5, T.burst + 0.6, (g) => {
    X.svg('rect', { width: W, height: H, fill: P.field }, g);
    const cam = X.cam(X.svg('g', {}, g));
    tl.fromTo(cam, { x: 50 }, { x: -50, duration: T.slide1 - T.colour, ease: 'none', immediateRender: false }, T.colour);
    const SL = 0.5;
    tl.fromTo(cam, { x: -50 }, { x: -1860, duration: SL, ease: 'power2.inOut', immediateRender: false }, T.slide1 + 0.15);
    tl.fromTo(cam, { x: -1860 }, { x: -1940, duration: T.slide2 - T.slide1 - SL, ease: 'none', immediateRender: false }, T.slide1 + 0.15 + SL);
    tl.fromTo(cam, { x: -1940 }, { x: -3760, duration: SL, ease: 'power2.inOut', immediateRender: false }, T.slide2 + 0.15);
    tl.fromTo(cam, { x: -3760 }, { x: -3880, duration: T.burst + 0.45 - T.slide2 - SL, ease: 'none', immediateRender: false }, T.slide2 + 0.15 + SL);
    X.sfx(T.slide1 + 0.15, 'slide', { gain: 0.35 }); X.sfx(T.slide2 + 0.15, 'slide', { gain: 0.35 });
    const breathe = X.svg('g', {}, cam);
    tl.fromTo(breathe, { scale: 1.07 }, { scale: 1, duration: T.slide1 - T.colour, ease: 'none', svgOrigin: '960 540', immediateRender: false }, T.colour);
    // floating background blobs for depth
    [[180, 180, 70, K.work, 2], [1760, 900, 90, K.cool, 3], [2300, 160, 60, K.work, 4], [3600, 940, 80, K.work, 5], [4200, 150, 70, K.cool, 6], [5600, 880, 90, K.work, 7]].forEach(([x, y, r, f, s]) => K.blob(cam, x, y, r, f, { seed: s, opacity: 0.9 }));

    // --- V1: a wall of visible work (board of cards), a woman pinning, a stack of reports
    {
      const v = X.svg('g', {}, breathe);
      const iso = K.iso(640, 560, 0.95);
      const sun = K.blob(v, 960, 540, 420, K.sunset, { seed: 9, speed: 0.5 });
      gsap.set(sun, { scale: 0.62, transformOrigin: '50% 50%' });
      tl.to(sun, { scale: 1, duration: 0.8, ease: 'back.out(1.2)' }, w('visible', 'visible') - 0.05);
      X.sfx(w('visible', 'visible'), 'sparkle', { gain: 0.3 });
      K.shadow(v, 1000, 930, 480, 80, 15, P.fShadow);
      const rug = X.svg('path', { d: K.organic(330, 930, 330, 90, 19, 9, 0.1), fill: K.workH }, v);
      grow(rug, T.colour + 0.1, 0.5, 'power3.out', '50% 50%');
      iso.box(v, 0, 0, 0, 800, 26, 440, { top: '#FFFFFF', left: P.fLight, right: P.tangerine });
      const cards = X.svg('g', { transform: planeY(iso, 0, 27, 440) }, v);
      const cr = X.rand(5), fills = [K.work, P.cream, K.cool, K.workV, P.cream, K.work, K.sunset, P.cream, K.cool, K.work, P.cream, K.workV];
      for (let i = 0; i < 12; i++) {
        const c = i % 4, r = Math.floor(i / 4);
        const cx = 110 + c * 195, cy = 82 + r * 138;
        const card = X.svg('g', {}, cards);
        const sc = K.scrap(card, { x: cx, y: cy, w: 120, h: 104, rot: (cr() - 0.5) * 10, color: '#FBF7F0', seed: 50 + i, shadow: true, jag: 5 });
        if (fills[i] !== P.cream) X.svg('rect', { x: 0, y: 0, width: 120, height: 104, fill: fills[i] }, sc._body);
        else { X.svg('rect', { x: 14, y: 18, width: 70, height: 10, fill: P.violet }, sc._body); X.svg('rect', { x: 14, y: 40, width: 90, height: 8, fill: '#CFC8BE' }, sc._body); X.svg('rect', { x: 14, y: 58, width: 76, height: 8, fill: '#CFC8BE' }, sc._body); }
        K.tape(card, cx, cy - 54, 56, (cr() - 0.5) * 14, { seed: 60 + i, h: 22 });
        const t = T.colour + 0.15 + i * 0.075;
        gsap.set(card, { opacity: 0, scale: 0.6, transformOrigin: `${cx}px ${cy}px` });
        tl.to(card, { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.6)' }, t);
        if (i % 2 === 0) X.sfx(t, 'pop', { gain: 0.2, pitch: 0.9 + i * 0.04 });
      }
      K.mark(cards, K.scribble.circle(500, 220, 92, 78, 12), w('visible', 'visible') + 0.15, { color: P.marigold, w: 7, dur: 0.5 });
      const [wx, wy] = iso.P(-60, 120, 0);
      K.shadow(v, wx + 20, wy, 70, 16, 5, P.fShadow);
      cutAt(v, K.fig.woman({ tone: 0.55 }), { x: wx, y: wy, h: 390, cell: 4.6, rim: 5 });
      // reports: grey, crossed out, tipped off
      const rg = X.svg('g', {}, v);
      const ri = K.iso(1520, 690, 1);
      ri.box(rg, 0, 0, 0, 110, 110, 120, { top: '#B9BECA', left: '#8A90A0', right: '#5A6074' });
      const stack = cutAt(rg, K.fig.reports({ n: 9 }), { x: ri.P(55, 55, 120)[0], y: ri.P(55, 55, 120)[1] + 20, h: 200, cell: 4 });
      K.mark(rg, K.scribble.cross(ri.P(55, 55, 120)[0], ri.P(55, 55, 120)[1] - 80, 80, 7), w('visible', 'not'), { color: P.pink, w: 9, dur: 0.4 });
      tl.to(rg, { rotation: 18, y: 760, duration: 0.7, ease: 'power2.in', svgOrigin: '1560 760' }, w('visible', 'reported') + 0.35);
      X.sfx(w('visible', 'reported') + 0.9, 'thud', { gain: 0.35 });
      rise(rg, T.colour + 0.4, 40, 0.5);
    }

    // --- V2: shared the moment it happens — laptop → gradient cables → screens
    {
      const ox = 1900, v = X.svg('g', {}, cam);
      tl.fromTo(v, { scale: 1 }, { scale: 1.05, duration: T.slide2 - T.slide1, ease: 'none', svgOrigin: `${ox + 960} 560`, immediateRender: false }, T.slide1);
      const iso = K.iso(ox + 360, 520, 1);
      K.shadow(v, ox + 560, 900, 420, 70, 21, P.fShadow);
      iso.box(v, 0, 0, 0, 300, 200, 110, K.NEWWARM);
      // glass tubes with rising gradient liquid
      [[30, 30], [95, 22]].forEach(([tx, ty], i) => {
        const [bx, by] = iso.P(tx, ty, 110);
        const tg = X.svg('g', {}, v);
        X.svg('rect', { x: bx - 22, y: by - 150, width: 44, height: 150, rx: 22, fill: '#FFFFFF', opacity: 0.28 }, tg);
        const liq = X.svg('rect', { x: bx - 16, y: by - 120, width: 32, height: 116, rx: 14, fill: i ? K.coolV : K.workV }, tg);
        gsap.set(liq, { scaleY: 0.25, transformOrigin: '50% 100%' });
        tl.to(liq, { scaleY: 1, duration: 1.2, ease: 'power2.out' }, w('shared', 'shared') - 0.2 + i * 0.15);
        X.svg('rect', { x: bx - 22, y: by - 150, width: 44, height: 150, rx: 22, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 3, opacity: 0.8 }, tg);
      });
      const [lx, ly] = iso.P(170, 80, 110);
      const lap = X.svg('g', {}, v);
      iso.poly(lap, [[150, 70, 110], [230, 70, 110], [230, 125, 110], [150, 125, 110]], '#2A22A6');
      iso.poly(lap, [[150, 70, 110], [230, 70, 110], [230, 70, 166], [150, 70, 166]], '#4A41D0');
      iso.poly(lap, [[155, 70, 114], [225, 70, 114], [225, 70, 162], [155, 70, 162]], K.workH);
      const [mx, my] = iso.P(-50, 190, 0);
      K.shadow(v, mx + 20, my, 70, 16, 6, P.fShadow);
      cutAt(v, K.fig.man({ tone: 0.4 }), { x: mx, y: my, h: 360, cell: 4.4, rim: 4 });
      // screens
      const scr = (sx0, sy0, sw, sh, t) => {
        const sg = X.svg('g', {}, v);
        X.svg('rect', { x: sx0 + sw / 2 - 8, y: sy0 + sh, width: 16, height: 900 - (sy0 + sh) - 60, fill: P.fDark }, sg);
        X.svg('rect', { x: sx0 - 12, y: sy0 - 12, width: sw + 24, height: sh + 24, rx: 10, fill: P.fDark }, sg);
        X.svg('rect', { x: sx0, y: sy0, width: sw, height: sh, rx: 4, fill: '#EDEAFB' }, sg);
        const content = X.svg('g', {}, sg);
        return { sg, content };
      };
      const big = scr(ox + 1000, 300, 560, 360);
      const s1 = scr(ox + 1640, 560, 170, 120), s2 = scr(ox + 820, 120, 150, 100);
      // cables
      const cab = [
        [`M${lx + 40},${ly - 30} C${lx + 160},${ly - 260} ${ox + 860},${520} ${ox + 1000},${470}`, K.workH],
        [`M${lx + 50},${ly - 10} C${lx + 240},${ly - 150} ${ox + 850},${600} ${ox + 1000},${560}`, K.coolV],
        [`M${lx + 30},${ly - 50} C${lx + 60},${ly - 300} ${ox + 760},${300} ${ox + 820},${250}`, K.work],
        [`M${ox + 1560},${600} C${ox + 1610},${600} ${ox + 1620},${640} ${ox + 1640},${640}`, K.cool],
      ];
      const pulses = [];
      cab.forEach(([d, f], i) => {
        const p = X.svg('path', { d, fill: 'none', stroke: f, 'stroke-width': i === 3 ? 12 : 20, 'stroke-linecap': 'round' }, v);
        X.drawOn(p, w('shared', 'shared') - 0.1 + i * 0.1, 0.6, 'power2.out');
        if (i < 3) pulses.push([p, p.getTotalLength(), i]);
      });
      X.sfx(w('shared', 'shared') - 0.1, 'swoosh', { gain: 0.3 });
      const dots = pulses.map(() => X.svg('circle', { r: 7, fill: P.cream, opacity: 0 }, v));
      const t0 = w('shared', 'shared') + 0.5;
      X.every((t) => pulses.forEach(([p, Lp, i], k) => {
        if (t < t0 || t > T.slide2 + 1) { dots[k].setAttribute('opacity', 0); return; }
        const q = ((t - t0) * 0.9 + i * 0.33) % 1, pt = p.getPointAtLength(q * Lp);
        dots[k].setAttribute('cx', pt.x); dots[k].setAttribute('cy', pt.y); dots[k].setAttribute('opacity', 1);
      }));
      // big screen fills with collage on "moment"
      const tm = w('shared', 'moment');
      const cc = big.content;
      const cbx = ox + 1000, cby = 300;
      const b1 = K.blob(cc, cbx + 180, cby + 200, 120, K.sunset, { seed: 31 });
      const b2 = K.blob(cc, cbx + 400, cby + 150, 80, K.cool, { seed: 32 });
      const sq = K.scrap(cc, { x: cbx + 420, y: cby + 250, w: 170, h: 120, rot: 6, color: '#FBF7F0', seed: 33 });
      X.svg('rect', { x: 14, y: 16, width: 100, height: 12, fill: P.violet }, sq._body); X.svg('rect', { x: 14, y: 40, width: 130, height: 9, fill: '#CFC8BE' }, sq._body); X.svg('rect', { x: 14, y: 60, width: 110, height: 9, fill: '#CFC8BE' }, sq._body);
      const fig = cutAt(cc, K.fig.woman({ tone: 0.5 }), { x: cbx + 210, y: cby + 360, h: 330, cell: 4.2, rim: 4 });
      [b1, b2, sq, fig].forEach((e, i) => { gsap.set(e, { opacity: 0 }); tl.to(e, { opacity: 1, duration: 0.25, ease: 'power2.out' }, tm + i * 0.08); });
      tl.fromTo(fig._inner, { y: 40 }, { y: 0, duration: 0.5, ease: 'power3.out', immediateRender: false }, tm + 0.24);
      X.sfx(tm, 'sparkle', { gain: 0.35 });
      [[s1, ox + 1640, 560, 170, 120, K.work], [s2, ox + 820, 120, 150, 100, K.cool]].forEach(([s, x, y, sw, sh, f], i) => {
        const fill = X.svg('rect', { x: x + 6, y: y + 6, width: sw - 12, height: sh - 12, rx: 3, fill: f }, s.content);
        K.colourPop(fill, w('shared', 'happens') + i * 0.2, { pitch: 1.1 + i * 0.1 });
      });
    }

    // --- V3: every meeting should earn its place — a small bright room, a 15-minute wedge
    {
      const ox = 3800, v = X.svg('g', {}, cam);
      tl.fromTo(v, { scale: 1 }, { scale: 1.06, duration: T.burst - T.slide2, ease: 'none', svgOrigin: `${ox + 960} 560`, immediateRender: false }, T.slide2);
      const iso = K.iso(ox + 880, 340, 0.95);
      K.shadow(v, ox + 980, 880, 520, 80, 41, P.fShadow);
      iso.box(v, 0, 0, -30, 560, 420, 30, { top: '#FFD27A', left: P.tangerine, right: '#C4502C' });
      iso.box(v, -18, 0, 0, 18, 420, 330, { top: '#FFFFFF', left: '#B7AEFA', right: '#D9D3FF' });
      iso.box(v, -18, -18, 0, 578, 18, 330, { top: '#FFFFFF', left: '#F4F0FF', right: '#B7AEFA' });
      // window with a sunset
      iso.poly(v, [[0.5, 120, 90], [0.5, 330, 90], [0.5, 330, 270], [0.5, 120, 270]], K.sunset);
      iso.poly(v, [[0.5, 222, 90], [0.5, 228, 90], [0.5, 228, 270], [0.5, 222, 270]], '#FFFFFF');
      // round table + 3 chairs (two used)
      const [tx, ty] = iso.P(300, 230, 0);
      X.svg('rect', { x: tx - 10, y: ty - 80, width: 20, height: 80, fill: P.fDark }, v);
      X.svg('ellipse', { cx: tx, cy: ty - 80, rx: 150, ry: 70, fill: '#FFFFFF' }, v);
      X.svg('ellipse', { cx: tx, cy: ty - 74, rx: 150, ry: 70, fill: P.fMid, opacity: 0.0 }, v);
      [[150, 150, P.marigold], [430, 170, P.tangerine], [300, 380, P.pink]].forEach(([cx, cy, f]) => iso.box(v, cx, cy, 0, 50, 50, 48, { top: '#FFE3B0', left: f, right: '#C9542E' }));
      const [m1x, m1y] = iso.P(180, 200, 0), [w1x, w1y] = iso.P(470, 300, 0);
      cutAt(v, K.fig.seatedSide({ hair: 'long', tone: 0.48 }), { x: m1x - 10, y: m1y + 10, h: 230, cell: 4.2 });
      cutAt(v, K.fig.man({ tone: 0.38 }), { x: w1x, y: w1y, h: 330, cell: 4.4, rim: 4 });
      // a laptop on the table
      X.svg('path', { d: `M${tx - 40},${ty - 92} l60,-14 l30,14 l-60,14 z`, fill: P.fDark }, v);
      X.svg('path', { d: `M${tx - 40},${ty - 92} l60,-14 l0,-44 l-60,14 z`, fill: K.workV }, v);
      // wall clock with a 15-minute gradient wedge
      const [ckx, cky] = iso.P(420, -18, 240);
      const ck = cutAt(v, K.fig.clock({ hands: false }), { x: ckx, y: cky + 75, h: 150, cell: 3.4 });
      const wedge = X.svg('path', { d: '', fill: K.work, opacity: 0.92 }, v);
      const wg = { a: 0 };
      const setW = () => { const a = wg.a * Math.PI / 2, R = 58; wedge.setAttribute('d', wg.a <= 0 ? '' : `M${ckx},${cky} L${ckx},${cky - R} A${R},${R} 0 0,1 ${ckx + Math.sin(a) * R},${cky - Math.cos(a) * R} Z`); };
      setW();
      tl.fromTo(wg, { a: 0 }, { a: 1, duration: 0.55, ease: 'power2.out', onUpdate: setW, immediateRender: false }, w('earn', 'earn') - 0.05);
      X.svg('line', { x1: ckx, y1: cky, x2: ckx, y2: cky - 50, stroke: '#1E2230', 'stroke-width': 4, 'stroke-linecap': 'round' }, v);
      X.svg('line', { x1: ckx, y1: cky, x2: ckx + 32, y2: cky, stroke: '#1E2230', 'stroke-width': 6, 'stroke-linecap': 'round' }, v);
      X.sfx(w('earn', 'earn') - 0.05, 'ding', { gain: 0.3 });
      K.mark(v, K.scribble.tick(ckx + 120, cky - 10, 34, 4), w('earn', 'place'), { color: P.marigold, w: 8, dur: 0.35 });
    }
  });

  // ================================================================= THE PIVOT — tear up the nine o'clock (sits above act4)
  X.scene('pivot', T.cut2, T.colour + 0.75, (g) => {
    const page = X.svg('g', { id: 'calPage' }, X.defs);
    X.svg('image', { href: K.paperURL('#EEEAE2', 480, 270, 0.11, 17), x: -20, y: -20, width: W + 40, height: H + 40, preserveAspectRatio: 'none' }, page);
    X.svg('rect', { x: -20, y: -20, width: W + 40, height: 120, fill: '#3E4659' }, page);
    for (let i = 0; i < 9; i++) X.svg('circle', { cx: 140 + i * 205, cy: 50, r: 16, fill: '#1E2230' }, page);
    const gx0 = 150, gy0 = 190, cw = 330, rh = 92;
    for (let i = 0; i <= 5; i++) X.svg('line', { x1: gx0 + i * cw, y1: gy0 - 40, x2: gx0 + i * cw, y2: gy0 + rh * 9, stroke: '#B9B5AD', 'stroke-width': 2 }, page);
    for (let j = 0; j <= 9; j++) X.svg('line', { x1: gx0 - 60, y1: gy0 + j * rh, x2: gx0 + 5 * cw, y2: gy0 + j * rh, stroke: '#C9C5BD', 'stroke-width': 2 }, page);
    for (let i = 0; i < 5; i++) X.svg('rect', { x: gx0 + i * cw + 20, y: gy0 - 34, width: 120, height: 14, fill: '#8C92A0' }, page);
    const pr = X.rand(91);
    X.svg('rect', { x: gx0 + 8, y: gy0 + 8, width: 5 * cw - 16, height: rh - 16, rx: 6, fill: '#6F7587' }, page);
    for (let i = 0; i < 5; i++) for (let j = 1; j < 9; j++) if (pr() < 0.42) X.svg('rect', { x: gx0 + i * cw + 8, y: gy0 + j * rh + 8, width: cw - 16, height: rh * (pr() < 0.3 ? 2 : 1) - 16, rx: 6, fill: ['#A3A9B4', '#8C92A0', '#B9BECA'][Math.floor(pr() * 3)] }, page);
    // the torn line (shared by both halves)
    const r = X.rand(3), tear = [];
    const A0 = [960, -40], A1 = [1960, 900];
    for (let i = 0; i <= 26; i++) { const k = i / 26; tear.push([A0[0] + (A1[0] - A0[0]) * k + (r() - 0.5) * 34, A0[1] + (A1[1] - A0[1]) * k + (r() - 0.5) * 34]); }
    const tp = tear.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
    const cpA = X.svg('clipPath', { id: 'tearA' }, X.defs), cpB = X.svg('clipPath', { id: 'tearB' }, X.defs);
    X.svg('path', { d: `M-60,-60 L${tp} L1980,1140 L-60,1140 Z` }, cpA);
    X.svg('path', { d: `M-60,-60 L${tp} L1990,-60 Z`.replace('M-60,-60 L', 'M') }, cpB);
    const cam = X.cam(X.svg('g', {}, g));
    tl.fromTo(cam, { scale: 1.0 }, { scale: 1.05, duration: T.colour - T.cut2, ease: 'none', immediateRender: false }, T.cut2);
    const mk = (cp, fibre) => {
      const pg = X.svg('g', {}, cam);
      const inner = X.svg('g', { 'clip-path': `url(#${cp})`, filter: K.softShadow }, pg);
      const u = document.createElementNS('http://www.w3.org/2000/svg', 'use'); u.setAttribute('href', '#calPage'); inner.appendChild(u);
      const fb = X.svg('path', { d: 'M' + tp, fill: 'none', stroke: '#FFFDF8', 'stroke-width': fibre, 'stroke-linejoin': 'round' }, inner);
      gsap.set(fb, { opacity: 0 }); tl.to(fb, { opacity: 1, duration: 0.2 }, T.tear + 0.35);
      return pg;
    };
    const pA = mk('tearA', 14), pB = mk('tearB', 14);
    // the hand grips the corner of piece B
    const hand = cutAt(cam, K.fig.hand({}), { x: 1700, y: 360, h: 560, cell: 5, rim: 0, anchor: [0.62, 0.62] });
    gsap.set(hand, { opacity: 0 });
    tl.fromTo(hand, { x: 2300, y: -260, opacity: 1 }, { x: 1700, y: 300, opacity: 1, duration: 0.55, ease: 'power3.out', immediateRender: false }, T.tear - 0.3);
    X.sfx(T.tear - 0.3, 'swoosh', { gain: 0.3 });
    // lift + slow tear (colour seeps in along the tear), then the yank
    tl.fromTo([pB, hand], { x: (i) => (i ? 1700 : 0), y: (i) => (i ? 300 : 0), rotation: 0 }, { x: (i) => (i ? 1740 : 40), y: (i) => (i ? 270 : -30), rotation: -2.5, duration: 0.5, ease: 'power2.out', svgOrigin: '1960 900', immediateRender: false }, T.tear + 0.35);
    X.sfx(T.tear + 0.35, 'paper', { gain: 0.45, dur: 0.4 });
    tl.to([pB, hand], { x: (i) => (i ? 1930 : 230), y: (i) => (i ? 120 : -180), rotation: -9, duration: T.colour - T.rip - 0.05, ease: 'power1.inOut', svgOrigin: '1960 900' }, T.rip);
    X.sfx(T.rip, 'paper', { gain: 0.55, dur: 0.9, pitch: 0.8 });
    tl.to([pB, hand], { x: (i) => (i ? 3000 : 1300), y: (i) => (i ? -700 : -1000), rotation: -24, duration: 0.42, ease: 'power2.in', svgOrigin: '1960 900' }, T.colour - 0.12);
    tl.to(pA, { x: -260, y: 1300, rotation: 9, duration: 0.36, ease: 'power2.in', svgOrigin: '0 1080' }, T.colour - 0.14);
    X.sfx(T.colour - 0.12, 'whoosh', { gain: 0.5, dur: 0.5 });
  });

  // ================================================================= reveal overlays: ribbon flight + ring burst
  X.scene('ribbon', T.rib, T.burst + 0.7, (g) => {
    const lead = K.glyph(null, 150);
    const rb = K.ribbons(g, lead, { d: 'M-300,980 C120,1220 360,380 760,360 C980,350 820,540 960,540', t: T.rib, dur: 1.75, trail: 0.5, retract: T.rib + 1.8, retractDur: 0.55, settle: true });
    tl.fromTo(lead, { scale: 0.6 }, { scale: 1.9, duration: 1.75, ease: 'power2.inOut', immediateRender: false }, T.rib);
    X.sfx(T.rib + 1.75, 'pop', { gain: 0.3, pitch: 0.8 });
    K.ringBurst(g, T.burst, 960, 540, P.navy, { ring: '#3A4170' });
    g.appendChild(lead);
  });

  // ================================================================= navy reveal: the glyph fills with collage, then the lockup
  X.scene('reveal', T.reveal, T.logo, (g0) => {
    let g = g0;
    X.svg('rect', { width: W, height: H, fill: P.navy }, g0);
    const rv = X.svg('g', {}, g0);
    tl.fromTo(rv, { scale: 1 }, { scale: 1.05, duration: T.logo - T.reveal, ease: 'none', svgOrigin: '960 540', immediateRender: false }, T.reveal);
    g = rv;
    const hold = X.svg('g', {}, g);
    gsap.set(hold, { x: 960, y: 540, scale: 1.52 });
    const s = 150 * 1.25 * 1.0;
    const gl = K.glyph(hold, s);
    const f = s * 0.38, h = s / 2;
    const cp = X.svg('clipPath', { id: 'glyphClip' }, X.defs);
    X.svg('path', { d: `M${-h},${-h} L${h - f},${-h} L${h},${-h + f} L${h},${h} L${-h},${h} Z` }, cp);
    const inside = X.svg('g', { 'clip-path': 'url(#glyphClip)' }, hold);
    hold.appendChild(gl.flap);
    const items = [
      K.blob(inside, -40, 40, 70, K.sunset, { seed: 61 }), K.blob(inside, 50, -30, 52, K.cool, { seed: 62 }), K.blob(inside, 60, 70, 40, K.work, { seed: 63 }),
    ];
    const sq = K.scrap(inside, { x: -40, y: -50, w: 90, h: 60, rot: -8, color: '#FBF7F0', seed: 64 });
    X.svg('rect', { x: 8, y: 10, width: 50, height: 7, fill: P.violet }, sq._body);
    const fig = cutAt(inside, K.fig.woman({ tone: 0.5 }), { x: 20, y: h + 6, h: 180, cell: 3.2, rim: 3 });
    items.push(sq, fig);
    items.forEach((e, i) => { gsap.set(e, { opacity: 0 }); tl.to(e, { opacity: 1, duration: 0.3, ease: 'power2.out' }, T.reveal + 0.15 + i * 0.12); X.sfx(T.reveal + 0.15 + i * 0.12, 'bubble', { gain: 0.18, pitch: 0.9 + i * 0.08 }); });
    tl.fromTo(hold, { scale: 1.52 }, { scale: 1.6, duration: T.lock - 0.3 - T.reveal, ease: 'none', immediateRender: false }, T.reveal);
    tl.to(hold, { y: 330, scale: 0.62, duration: 0.7, ease: 'power3.inOut' }, T.lock - 0.3);
    // blob clusters drift in top and bottom
    const top = X.svg('g', {}, g), bot = X.svg('g', {}, g);
    K.blob(top, 300, 90, 130, K.sunset, { seed: 71 }); K.blob(top, 450, 40, 80, K.cool, { seed: 72 }); K.blob(top, 160, 30, 60, K.work, { seed: 75 });
    K.blob(bot, 1620, 1000, 140, K.work, { seed: 73 }); K.blob(bot, 1460, 1060, 90, K.cool, { seed: 74 }); K.blob(bot, 1790, 930, 60, K.sunset, { seed: 76 });
    gsap.set(top, { y: -220 }); gsap.set(bot, { y: 240 });
    tl.to(top, { y: 0, duration: 0.9, ease: 'power3.out' }, T.lock - 0.1); tl.to(bot, { y: 0, duration: 0.9, ease: 'power3.out' }, T.lock);
    tl.to(top, { x: 90, y: 20, duration: T.logo - T.lock - 0.8, ease: 'none' }, T.lock + 0.8);
    tl.to(bot, { x: -90, y: -16, duration: T.logo - T.lock - 0.9, ease: 'none' }, T.lock + 0.9);
    K.lockup(g, T.lock + 0.2, 'INTRODUCING', 'Openfold Pages', { y: 640, size: 96, labelSize: 30, gap: 74 });
  });

  // ================================================================= logo card (marigold field)
  X.scene('logo', T.logo, null, (g) => {
    const lg = X.linear('k-brandField', [[0, '#FFC24A'], [1, '#FFA51F']], 0, 0, 0, 1);
    X.svg('rect', { width: W, height: H, fill: lg }, g);
    const grp = X.svg('g', {}, g);
    const mark = K.glyph(grp, 150, { body: P.brandInk, flap: P.pink });
    const word = X.svg('text', { x: 0, y: 52, 'font-family': 'Poppins', 'font-weight': 600, 'font-size': 150, fill: P.brandInk, text: 'openfold' }, grp);
    const ww = word.getComputedTextLength();
    const total = 150 + 46 + ww, x0 = 960 - total / 2;
    gsap.set(mark, { x: x0 + 75, y: 500 });
    word.setAttribute('x', x0 + 150 + 46); word.setAttribute('y', 552);
    const clip = X.svg('clipPath', { id: 'wordClip' }, X.defs);
    const cr = X.svg('rect', { x: x0 + 150 + 30, y: 300, width: 0, height: 400 }, clip);
    word.setAttribute('clip-path', 'url(#wordClip)');
    const tag = X.svg('text', { x: 960, y: 700, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 500, 'font-size': 46, fill: P.brandInk, opacity: 0.86, text: 'Show the work.' }, g);
    X.pop(mark, T.logo + 0.12, { scale: 1, dur: 0.5, ease: 'back.out(1.8)', sfx: 'pop', gain: 0.35 });
    gsap.set(mark.flap, { scale: 0, transformOrigin: '0% 100%' });
    tl.to(mark.flap, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, T.logo + 0.42);
    tl.to(cr, { attr: { width: ww + 40 }, duration: 0.65, ease: 'power3.out' }, T.logo + 0.3);
    X.sfx(T.logo + 0.3, 'swoosh', { gain: 0.3 });
    gsap.set(tag, { opacity: 0 });
    tl.fromTo(tag, { opacity: 0, y: 16 }, { opacity: 0.86, y: 0, duration: 0.5, ease: 'power2.out', immediateRender: false }, w('tag', 'show') - 0.05);
    X.sfx(w('tag', 'show'), 'chime', { gain: 0.3 });
    tl.fromTo(grp, { scale: 1 }, { scale: 1.06, duration: END - T.logo, ease: 'none', svgOrigin: '960 540', immediateRender: false }, T.logo);
    tl.fromTo(tag, { scale: 1 }, { scale: 1.06, duration: END - T.logo, ease: 'none', svgOrigin: '960 540', immediateRender: false }, T.logo);
    const cb = X.svg('g', {}, g);
    K.blob(cb, 150, 120, 120, K.cool, { seed: 81 }); K.blob(cb, 1790, 980, 140, K.sunset, { seed: 82 }); K.blob(cb, 1700, 1050, 80, P.violet, { seed: 83 });
    gsap.set(cb, { opacity: 0 }); tl.to(cb, { opacity: 1, duration: 0.6 }, T.logo + 0.5);
    tl.fromTo(cb, { x: 0 }, { x: 70, duration: END - T.logo, ease: 'none', immediateRender: false }, T.logo);
  });

  // ---------------------------------------------------------------- print feel: static paper grain over everything
  const grainURL = X.paper('#ffffff', 960, 540, 0.12, 5);
  X.html('div', { style: { position: 'absolute', inset: '0', pointerEvents: 'none', backgroundImage: `url(${grainURL})`, backgroundSize: '1920px 1080px', mixBlendMode: 'multiply', opacity: 0.32, zIndex: 40 } });

  X.end(END);
});
