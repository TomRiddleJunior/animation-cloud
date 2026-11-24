/* "sorta" — 53 s music-led launch promo (fictional product). 140 BPM hype-trap; every move sits on K.b(beat).
 * tease (b0-16) → chaos (b12-36, riser) → DROP + brand reveal (b36 = 29 %) → features 01/02/03 (b44-96)
 * → callback + aphorism (b96-108) → end card (b108-124).                                    No voice-over. */
X.boot(async (X) => {
  await X.loadVO();
  const K = LP.init(X, { bpm: 140 });
  const { P, F, b, env } = K;
  const tl = X.tl;
  const END = K.bar(31) + 0.5;
  const html = (tag, attrs, parent) => X.html(tag, attrs, parent);

  // =================================================================== HOOK  b0–b12  (energy 1: pad + 808)
  gsap.set(env, { glow: 0.12, rings: 0.3, arcs: 0, arcGap: 160, stars: 0.55 });
  K.envTo({ arcs: 0, arcGap: 160, glow: 0.12 }, { arcs: 1, arcGap: 0, glow: 0.5 }, 0.04, b(2), 'power2.out');
  const hookOrb = K.orb(K.cam, { x: 960, y: 540, r: 16 });
  gsap.set(hookOrb.g, { scale: 0, transformOrigin: '50% 50%' });
  tl.fromTo(hookOrb.g, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(2.2)', immediateRender: false }, 0.06);
  tl.fromTo(hookOrb.g, { scale: 1 }, { scale: 1.7, duration: F(3), yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, b(1));
  tl.to(hookOrb.g, { scale: 0, duration: F(3), ease: 'power2.in' }, b(2) - F(3));
  X.sfx(0.06, 'sparkle', { dur: 0.6, gain: 0.22 });
  X.sfx(b(1), 'blip_up', { dur: 0.15, gain: 0.2 });

  K.slam([['47', P.gold], [' TABS.', P.text]], b(2), { size: 236, hold: b(3) - F(7), out: 'blur', dx: 80 });
  K.slam([['12', P.gold], [' APPS.', P.text]], b(5), { size: 236, hold: b(3) - F(7), out: 'blur', dx: -80, pitch: 1.1 });
  K.rgbSlam([['1', P.gold], [' OF YOU.', P.text]], b(8), { size: 250, hold: b(3.1), arcs: [1.6, 1] });
  tl.fromTo(hookOrb.g, { scale: 0 }, { scale: 2.4, duration: F(6), ease: 'back.out(2)', immediateRender: false }, b(11.3));
  X.sfx(b(11.3), 'pop', { gain: 0.3, pitch: 0.8 });
  const z1 = K.zoomThrough(b(12), { x: 960, y: 540, r0: 38 });
  K.span(hookOrb.g, 0, z1.tCover);

  // =================================================================== CHAOS  b12–b36  (energy 2 from b16)
  const T_CH = z1.tCover;
  tl.set(env, { arcs: 0.25, glow: 0.35, gx: 700, rings: 0.55 }, T_CH);
  // -- notification flood (3D stack on the right) + unread badge (left)
  const stack = html('div', { style: { position: 'absolute', left: '940px', top: '0px', width: '700px', height: '1080px', transformStyle: 'preserve-3d' } }, K.world);
  K.span(stack, T_CH, b(20.5));
  gsap.set(stack, { rotationY: -22, rotationX: 7, transformOrigin: '50% 40%' });
  tl.fromTo(stack, { rotationY: -22, z: 0 }, { rotationY: 2, z: 460, duration: b(20) - T_CH, ease: 'none', immediateRender: false }, T_CH);
  tl.to(stack, { x: -1500, opacity: 0, duration: F(9), ease: 'expo.in' }, b(20) - F(9));
  const NOTES = [
    ['chat', 'Team chat', 'Quick sync? (again)'], ['mail', 'Mail', 'Re: Re: Fwd: final deck'], ['doc', 'Docs', 'Who has the latest version?'],
    ['cal', 'Calendar', 'Standup in 2 min'], ['chat', 'Mara', '@you can you check this?'], ['task', 'Tasks', '14 tasks overdue'],
    ['bell', 'Alerts', 'Build failed (3)'], ['mail', 'Mail', 'URGENT: read before 5pm'], ['chat', 'Leo', 'did you see my message?'],
    ['doc', 'Docs', 'New comment on Roadmap v12'], ['cal', 'Calendar', 'Meeting about the meeting'], ['chat', 'Team chat', 'ping'],
    ['mail', 'Mail', 'Invoice #2041 overdue'], ['task', 'Tasks', 'Is this still a priority?'], ['chat', 'Mara', '???'], ['bell', 'Alerts', '99+ new updates'],
  ];
  const ARR = [12.5, 13.25, 14, 14.5, 15, 15.5, 16, 16.25, 16.5, 16.75, 17, 17.25, 17.5, 17.75, 18, 18.25].map(b);
  const STEP = 122, TOP = 118;
  NOTES.forEach(([icon, app, title], i) => {
    const el = K.notif({ x: 30, y: 0, w: 640, h: 104, icon, app, title, time: i < 3 ? 'now' : `${i}s ago`, parent: stack });
    gsap.set(el, { y: -160, opacity: 0 });
    tl.fromTo(el, { y: TOP - 70, opacity: 0, scale: 0.92 }, { y: TOP, opacity: 1, scale: 1, duration: F(7), ease: 'back.out(1.5)', immediateRender: false }, ARR[i]);
    for (let j = i + 1; j < ARR.length; j++)
      tl.fromTo(el, { y: TOP + STEP * (j - 1 - i) }, { y: TOP + STEP * (j - i), duration: F(6), ease: 'power3.out', immediateRender: false }, ARR[j]);
    X.sfx(ARR[i], i % 3 === 0 ? 'notif' : i % 3 === 1 ? 'ding' : 'blip', { gain: i < 6 ? 0.32 : 0.22, pitch: 0.9 + (i % 5) * 0.07 });
  });
  const badge = X.svg('g', {}, K.cam);
  K.span(badge, T_CH, b(20.5));
  gsap.set(badge, { x: 500, y: 470 });
  X.svg('rect', { x: -190, y: -110, width: 380, height: 220, rx: 60, fill: P.ember, opacity: 0.5, filter: K.blur(30) }, badge);
  X.svg('rect', { x: -190, y: -110, width: 380, height: 220, rx: 60, fill: 'url(#lpPill)' }, badge);
  X.svg('path', { d: K.ICON.bell, transform: 'translate(-160,-34) scale(2.8)', fill: 'none', stroke: P.pillInk, 'stroke-width': 2.2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, badge);
  const cnt = X.svg('text', { x: 50, y: 46, 'text-anchor': 'middle', 'font-family': 'Archivo Black', 'font-size': 128, fill: P.pillInk, text: '3' }, badge);
  X.svg('text', { x: 0, y: 178, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 700, 'font-size': 34, 'letter-spacing': 8, fill: P.mute, text: 'UNREAD' }, badge);
  gsap.set(badge, { scale: 0, transformOrigin: '50% 50%' });
  tl.fromTo(badge, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(2)', immediateRender: false }, b(12.5));
  ARR.slice(1).forEach((a, k) => tl.fromTo(badge, { scale: 1.09 }, { scale: 1, duration: F(5), ease: 'power2.out', immediateRender: false }, a));
  X.countUp(cnt, 3, 99, b(13), b(5.5), (v) => (v >= 99 ? '99+' : String(Math.round(v))), 'power1.in');
  tl.to(badge, { x: -700, duration: F(9), ease: 'expo.in' }, b(20) - F(9));
  X.sfx(b(20) - F(9), 'whoosh', { dur: 0.35, gain: 0.35 });

  // -- app-glyph tiles streaking past behind the flood (three depths = three speeds)
  const tiles = X.svg('g', {}, K.cam);
  K.span(tiles, T_CH, b(23));
  tl.to(tiles, { opacity: 0, duration: b(2), ease: 'power1.in' }, b(20.5));
  const rt = X.rand(41), GL = ['chat', 'mail', 'cal', 'doc', 'bell', 'task'];
  for (let i = 0; i < 14; i++) {
    const depth = 0.45 + rt() * 0.9, sz = 110 * depth, y = 80 + rt() * 920, t0 = T_CH + rt() * (b(19) - T_CH), dur = 2.4 / depth;
    const tg = X.svg('g', { opacity: Math.min(1, 0.35 + depth * 0.55) }, tiles);
    X.svg('rect', { x: -sz / 2, y: -sz / 2, width: sz, height: sz, rx: sz * 0.26, fill: 'url(#lpTile)', stroke: P.flame, 'stroke-width': 2.5 }, tg);
    X.svg('path', { d: K.ICON[GL[i % GL.length]], transform: `translate(${-sz * 0.3},${-sz * 0.3}) scale(${sz * 0.025})`, fill: 'none', stroke: P.gold, 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }, tg);
    const badgeR = X.svg('circle', { cx: sz * 0.42, cy: -sz * 0.42, r: sz * 0.16, fill: P.ember }, tg);
    gsap.set(tg, { x: 2100, y });
    tl.fromTo(tg, { x: 2100, y, rotation: (rt() - 0.5) * 30 }, { x: -200, y: y + (rt() - 0.5) * 200, rotation: (rt() - 0.5) * 60, duration: dur, ease: 'none', immediateRender: false }, t0);
  }

  // -- the "final_v9" file that doubles on every beat: 1 → 64 (b20 → b26)
  const files = X.svg('g', {}, K.cam);
  K.span(files, b(20) - F(2), b(35.6));
  const NAMES = ['final.pdf', 'final_v2.pdf', 'final_FINAL.pdf', 'final_v3_real.pdf', 'final_USE_THIS.pdf', 'final_v9.pdf', 'final_final2.pdf', 'final_ok_now.pdf'];
  const grid = (k, i) => {
    const cols = 2 ** Math.ceil(k / 2), rows = 2 ** Math.floor(k / 2);
    const cw = Math.min(360, 1640 / cols), ch = Math.min(400, 920 / rows);
    const c = i % cols, r = Math.floor(i / cols);
    const cap = k <= 1 ? 3.0 : k === 2 ? 2.3 : 2.0;   // the first doublings are big enough to read the file names
    return { x: 960 + (c - (cols - 1) / 2) * (k <= 1 ? cw * 1.25 : cw), y: 540 + (r - (rows - 1) / 2) * ch - (k < 4 ? 22 : 0), scale: Math.min(cw / 120 * (k <= 1 ? 1.25 : 1), ch / 150, cap) };
  };
  const born = (i) => (i === 0 ? 0 : Math.ceil(Math.log2(i + 1)));
  const fileEls = [];
  for (let i = 0; i < 64; i++) {
    const kb = born(i), f = K.fileIcon(files, { x: 960, y: 540, scale: 0, label: i < 8 ? NAMES[i] : null });
    fileEls.push(f);
    gsap.set(f.g, { opacity: 0 });
    for (let k = kb; k <= 6; k++) {
      const tk = b(20 + k), to = grid(k, i);
      const from = k === kb ? (i === 0 ? { x: 960, y: 540, scale: 0 } : grid(k - 1, i - 2 ** (kb - 1))) : grid(k - 1, i);
      tl.fromTo(f.g, { ...from, opacity: k === kb ? 0.3 : 1 }, { ...to, opacity: 1, duration: F(k === kb ? 8 : 7), ease: k === kb && i === 0 ? 'back.out(2)' : 'expo.out', immediateRender: false }, tk);
    }
    if (f.label) tl.to(f.label, { opacity: 0, duration: F(4) }, b(23.6));
  }
  for (let k = 0; k <= 6; k++) X.sfx(b(20 + k), k < 4 ? 'pop' : 'blip_up', { gain: 0.32 + k * 0.03, pitch: 0.75 + k * 0.12 });
  // cam drift over the file grid
  tl.fromTo(K.cam, { rotation: 0, scale: 1 }, { rotation: -7, scale: 1.18, duration: b(35.5) - b(20), ease: 'none', immediateRender: false }, b(20));
  tl.set(K.cam, { rotation: 0, scale: 1 }, b(35.6));
  tl.fromTo(files, { opacity: 1 }, { opacity: 0.3, duration: F(4), immediateRender: false }, b(26));
  tl.to(files, { opacity: 0.55, duration: F(6) }, b(28));
  K.slam('WHICH FINAL?', b(26), { size: 190, hold: b(2) - F(7), out: 'blur', dx: 50 });
  K.pill([{ t: 'Sound' }, { t: 'familiar?', pill: true }], b(28), { size: 104, hold: b(4) - F(14) - F(4), hits: [0, 1, 2, 2.75, 3, 3.5] });

  // -- build: everything is sucked into the hero orb (b32 → b35.5), then it compresses before the drop
  const buildOrb = K.orb(K.cam, { x: 960, y: 540, r: 34 });
  K.span(buildOrb.g, b(32), b(36));
  gsap.set(buildOrb.g, { scale: 0, transformOrigin: '50% 50%' });
  tl.fromTo(buildOrb.g, { scale: 0 }, { scale: 1, duration: F(6), ease: 'back.out(2)', immediateRender: false }, b(32));
  tl.fromTo(buildOrb.g, { scale: 1 }, { scale: 2.3, duration: b(3.4), ease: 'power2.in', immediateRender: false }, b(32) + F(6));
  tl.to(buildOrb.g, { scale: 0.12, duration: F(4), ease: 'power3.in' }, b(35.5));
  tl.to(files, { opacity: 1, duration: F(4) }, b(32));
  const rs = X.rand(21);
  fileEls.forEach((f, i) => {
    const g0 = grid(6, i), d = Math.hypot(g0.x - 960, g0.y - 540) / 1100;
    tl.to(f.g, { x: 960, y: 540, scale: 0, rotation: (rs() - 0.5) * 540, duration: b(1.3), ease: 'expo.in' }, b(32.2) + d * b(1.8));
  });
  K.envTo({ speed: 0, speedDir: -1, ringOff: 0, glow: 0.35, gx: 700 }, { speed: 1.1, ringOff: -900, glow: 0.9, gx: 960 }, b(32), b(3.5), 'power2.in');
  tl.set(env, { speed: 0, glow: 0.08 }, b(35.5));
  X.sfx(b(32), 'riser', { dur: b(3.5), gain: 0.45 });
  X.sfx(b(32.1), 'woosh_low', { dur: 1.2, gain: 0.35 });
  X.sfx(b(35.5), 'drop', { dur: 0.25, gain: 0.3, pitch: 0.7 });

  // =================================================================== DROP + BRAND REVEAL  b36 (29 %)  energy 3
  const D = b(36);
  K.flash(D, { peak: 0.9, outF: 12 });
  K.shock(D, 960, 540, { r1: 1500, width: 16 });
  K.shock(D + F(4), 960, 540, { r1: 1000, width: 6, color: P.ember });
  K.burst(K.fx, 960, 540, D, { n: 70, dur: 1.3, seed: 4 });
  K.envTo({ glow: 1.5, arcs: 1.7, arcGap: -70, speed: 1.3, speedDir: 1, rings: 0.95, gx: 960, gy: 540 }, { glow: 0.55, arcs: 0.9, arcGap: 0, speed: 0.08, rings: 0.6 }, D, b(4), 'power2.out');
  X.sfx(D, 'impact', { dur: 1.5, gain: 0.6, pitch: 0.7 });
  X.sfx(D + 0.02, 'shutter', { dur: 0.2, gain: 0.25 });
  const lockO = X.svg('g', {}, K.type), lock = X.svg('g', {}, lockO);
  K.bounce(lockO, K.hits(D + b(1.5), b(43.5), [0, 0.75, 2, 2.5]), { origin: '960 540', amt: 0.04 });
  const S_MK = 210, S_WM = 200;
  const wmW = K.measure('sorta', S_WM, 'Space Grotesk', 700, -S_WM * 0.03);
  const L0 = 960 - (S_MK + 56 + wmW) / 2;
  const mk = K.mark(lock, { x: L0 + S_MK / 2, y: 532, s: S_MK });
  K.markBuild(mk, D);
  const wm = K.wordmark(lock, { x: L0 + S_MK + 56, y: 586, size: S_WM });
  K.decode(wm.cs, D + b(1), { perChar: 2, seed: 4 });
  tl.fromTo(wm.orb.g, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(2.6)', immediateRender: false }, b(38));
  X.sfx(b(38), 'sparkle', { dur: 0.8, gain: 0.32 });
  gsap.set(lock, { svgOrigin: '960 540' });
  tl.fromTo(lock, { scale: 1.3 }, { scale: 1, duration: b(4), ease: 'expo.out', immediateRender: false }, D);
  tl.fromTo(lock, { scale: 1, y: 0 }, { scale: 0.8, y: -118, duration: F(10), ease: 'power3.inOut', immediateRender: false }, b(40));
  tl.fromTo(lock, { scale: 0.8 }, { scale: 0.76, duration: b(44) - b(40) - F(10), ease: 'none', immediateRender: false }, b(40) + F(10));
  K.pill([{ t: 'Your chaos,' }, { t: 'sorted.', pill: true }], b(40) + F(5), { y: 700, size: 92, hold: b(43.4) - b(40) - F(5) - F(14) });
  const orbAt = K.screenPos(wm.orb.core, b(44));
  const z2 = K.zoomThrough(b(44), { x: orbAt.x, y: orbAt.y, r0: orbAt.w / 2, open: false });
  K.span(lockO, D, z2.tCover);

  // =================================================================== FEATURE 01 — CATCH EVERYTHING  b44–b64
  tl.set(env, { arcs: 0.35, glow: 0.4, gy: 600, rings: 0.6, grid: 1, speed: 0 }, z2.tCover);
  // ember type-card field: the zoom-through lands on it, the HUD headline sits on it, then it collapses into the ribbon line
  const fd1 = K.field(z2.tCover, b(51) + F(15), { originY: 530 });
  tl.to(fd1.g, { scaleY: 0, duration: F(14), ease: 'power2.inOut' }, b(51));
  X.sfx(b(51), 'woosh_low', { dur: 0.45, gain: 0.3 });
  const h1 = K.hud('Catch *everything*', b(46), { label: '01 — CAPTURE', size: 136, hold: b(50) - b(46) - F(26), exit: 'none', on: 'field' });
  const rib = K.ribbon(h1.cs, b(50), { y: 530, x1: 260, x2: 1660, until: b(52) + F(14) });
  tl.fromTo(rib.g, { y: 0 }, { y: 232 - 530, duration: F(9), ease: 'power3.inOut', immediateRender: false }, b(51.4));
  tl.to(rib.g, { opacity: 0, duration: F(10) }, b(52) + F(4));
  const p1 = K.panel({ x: 260, y: 232, w: 1400, h: 664, title: 'sorta · Inbox', search: 'Search everything' });
  K.span(p1.el, b(52), K.b(63.5) + F(9));
  gsap.set(p1.el, { transformOrigin: '50% 0%' });
  tl.fromTo(p1.el, { scaleY: 0.01, opacity: 1 }, { scaleY: 1, duration: F(12), ease: 'power3.out', immediateRender: false }, b(52));
  X.sfx(b(52), 'slide', { dur: 0.35, gain: 0.35 });
  // beat-locked camera hops (every 2 beats): settle → push on rows → pan to tags → pull back → push on urgent
  K.hop(p1.el, b(52.6), { rotationY: -12, rotationX: 9, y: 30, x: 60 }, 22, 'power2.inOut');
  K.hop(p1.el, b(55), { scale: 1.26, x: 190, y: -30, rotationY: -4, rotationX: 4 }, 22, 'power2.inOut');
  K.hop(p1.el, b(57), { x: -320, y: -50, rotationY: 8 }, 22, 'power2.inOut');
  K.hop(p1.el, b(59), { scale: 1.04, x: 0, y: 20, rotationY: -8, rotationX: 10 }, 22, 'power2.inOut');
  K.hop(p1.el, b(61), { scale: 1.2, x: 100, y: -80, rotationY: -1, rotationX: 4 }, 30, 'power2.inOut');
  [55, 57, 59, 61].forEach((n) => X.sfx(b(n), 'swoosh', { dur: 0.3, gain: 0.2, pitch: 0.9 }));
  // AI chip in the header
  const chip = html('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '12px', height: '40px', padding: '0 16px 0 10px', borderRadius: '20px', background: 'rgba(255,90,31,.12)', border: `1px solid rgba(255,123,44,.5)`, fontSize: '18px', fontWeight: 700, color: P.gold } }, p1.head);
  const chipOrb = K.orbDiv(24, chip, { position: 'relative' });
  const chipA = html('span', { text: 'Sorta AI · listening' }, chip), chipB = html('span', { text: 'Sorta AI · sorted ✓', style: { display: 'none' } }, chip);
  tl.set(chipA, { display: 'none' }, b(59)); tl.set(chipB, { display: 'inline' }, b(59));
  // sidebar
  const side = html('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: '250px', borderRight: `1px solid ${P.line}`, padding: '22px 0' } }, p1.body);
  const SIDE = [['inbox', 'Inbox'], ['flag', 'Today'], ['clock', 'Waiting'], ['check', 'Done'], ['layers', 'Later']];
  let inboxCount = null;
  SIDE.forEach(([ic, lab], k) => {
    const it = html('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', height: '54px', padding: '0 24px', margin: '0 12px', borderRadius: '14px', fontSize: '21px', fontWeight: 600, color: k ? P.mute : P.text, background: k ? 'transparent' : 'rgba(255,90,31,.14)' }, html: K.icon(ic, 22, k ? P.mute : P.flame) + `<span>${lab}</span>` }, side);
    if (!k) inboxCount = html('span', { style: { marginLeft: 'auto', color: P.gold, fontWeight: 800 }, text: '128' }, it);
    tl.fromTo(it, { x: -30, opacity: 0 }, { x: 0, opacity: 1, duration: F(8), ease: 'power3.out', immediateRender: false }, b(52) + F(8 + k * 2.5));
  });
  X.countUp(inboxCount, 128, 6, b(56), b(3.2), (v) => String(Math.round(v)), 'power2.inOut');
  // rows
  const ROWS = [
    ['chat', 'MK', 'Mara K.', 'Can you review the launch deck?', 'Today', 'today', '9:41'],
    ['mail', 'FN', 'Finance', 'Invoice #2041 needs approval', 'Urgent', 'urgent', '9:38'],
    ['doc', 'DS', 'Design', 'New comments on Onboarding v3', 'FYI', 'fyi', '9:30'],
    ['cal', 'CL', 'Calendar', 'Standup moved to 9:30', 'Done', 'done', '9:12'],
    ['task', 'DV', 'Dev team', 'API keys expire on Friday', 'Urgent', 'urgent', '8:57'],
    ['chat', 'LP', 'Leo P.', 'lunch later?', 'Later', 'later', '8:40'],
    ['mail', 'HR', 'People team', 'Benefits enrolment closes soon', 'FYI', 'fyi', '8:31'],
    ['doc', 'PM', 'Product', 'Spec review: Search v2', 'Today', 'today', '8:20'],
    ['chat', 'AN', 'Ana R.', 'Sent you the final file (really)', 'Done', 'done', '8:12'],
    ['task', 'QA', 'QA bot', '2 tests flaky on main', 'Urgent', 'urgent', '8:05'],
    ['cal', 'CL', 'Calendar', 'Offsite planning, Thu 3pm', 'Later', 'later', '7:58'],
    ['mail', 'NW', 'Newsletter', 'This week in design', 'Later', 'later', '7:40'],
  ];
  const listClip = html('div', { style: { position: 'absolute', left: '250px', right: 0, top: '10px', bottom: 0, overflow: 'hidden' } }, p1.body);
  const list = html('div', { style: { position: 'absolute', left: 0, right: 0, top: 0, height: '1200px' } }, listClip);
  tl.fromTo(list, { y: 0 }, { y: -6 * 95, duration: b(63.5) - b(56), ease: 'none', immediateRender: false }, b(56));
  ROWS.forEach(([ic, ini, who, txt, tag, kind, time], k) => {
    const row = html('div', { class: 'lp-row', style: { top: (k * 95) + 'px', height: '89px' } }, list);
    html('div', { class: 'lp-tile', html: K.icon(ic, 24, P.flame) }, row);
    K.avatar(ini, k, row);
    html('div', { style: { minWidth: 0 }, html: `<div class="lp-tt">${who}</div><div class="lp-sub">${txt}</div>` }, row);
    const tg = K.tag(tag, kind, row, { marginLeft: 'auto' });
    html('div', { style: { width: '64px', textAlign: 'right', fontSize: '17px', color: P.dim, fontWeight: 600 }, text: time }, row);
    const tr = k < 6 ? b(53) + k * b(0.5) : b(56) + (k - 6) * b(0.9);
    tl.fromTo(row, { x: 120, opacity: 0 }, { x: 0, opacity: 1, duration: F(8), ease: 'power3.out', immediateRender: false }, tr);
    X.sfx(tr, 'blip', { gain: 0.18, pitch: 0.9 + (k % 6) * 0.06 });
    const tt = k < 6 ? b(56) + k * b(0.5) : b(59.5) + (k - 6) * b(0.5);
    gsap.set(tg, { scale: 0, opacity: 0 });
    tl.fromTo(tg, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: F(7), ease: 'back.out(2.6)', immediateRender: false }, tt);
    tl.fromTo(chipOrb, { scale: 1.6 }, { scale: 1, duration: F(8), ease: 'power2.out', immediateRender: false }, tt);
    X.sfx(tt, 'pop', { gain: 0.26, pitch: 1 + k * 0.08 });
    if (kind === 'urgent') tl.fromTo(row, { backgroundColor: 'rgba(255,90,31,0)' }, { backgroundColor: 'rgba(255,90,31,0.16)', duration: F(8), immediateRender: false }, b(60));
  });
  const sw1 = K.sweep(b(63.5), { frames: 8 });
  tl.to(p1.el, { opacity: 0, duration: F(8), ease: 'power1.inOut' }, b(63.5));

  // =================================================================== FEATURE 02 — SORTED IN ONE CLICK  b64–b80
  tl.set(env, { grid: 0.6, rings: 0.75, glow: 0.45, gy: 560, arcs: 0.3 }, sw1);
  // the light sweep reveals the ember field; the board tilts in over it while the field fades back to the dark ground
  const fd2 = K.field(b(63.5), b(68) + F(16));
  tl.fromTo(fd2.g, { opacity: 0 }, { opacity: 1, duration: F(8), ease: 'power1.inOut', immediateRender: false }, b(63.5));
  tl.to(fd2.g, { opacity: 0, duration: F(14), ease: 'power1.inOut' }, b(68));
  K.hud('Sorted in *one click*', b(64), { label: '02 — SORT', size: 128, hold: b(67.6) - b(64) - F(29), on: 'field' });
  const p2 = K.panel({ x: 210, y: 166, w: 1500, h: 790, title: 'sorta · Board', search: 'Filter' });
  K.span(p2.el, b(68), b(78.5) + F(11));
  K.tiltIn(p2.el, b(68));
  // camera hops: push to the Sort button (cursor clicks) → pull back while cards fly → drift → push to "0 unread ✓"
  K.hop(p2.el, b(68.9), { scale: 1.2, x: -170, y: 110 }, 12);
  K.hop(p2.el, b(70.5), { scale: 1.0, x: 0, y: 0, rotationY: 5 }, 20, 'power2.inOut');
  K.hop(p2.el, b(72.5), { rotationY: -8, rotationX: 6, scale: 1.08, x: -60 }, 24, 'power2.inOut');
  K.hop(p2.el, b(75.5), { scale: 1.34, x: 370, y: 195, rotationY: 0, rotationX: 0 }, 16, 'power2.inOut');
  tl.to(p2.el, { scale: 1.42, x: 395, y: 210, duration: b(78.5) - b(75.5) - F(16), ease: 'none' }, b(75.5) + F(16));
  [70.5, 73, 75.5].forEach((n) => X.sfx(b(n), 'swoosh', { dur: 0.3, gain: 0.2, pitch: 0.9 }));
  const top = html('div', { style: { position: 'absolute', left: '40px', right: '40px', top: '18px', height: '64px', display: 'flex', alignItems: 'center', gap: '16px' } }, p2.body);
  const unread = html('span', { style: { fontSize: '40px', fontWeight: 800, color: P.text, fontFamily: 'Inter' }, text: '128' }, top);
  html('span', { style: { fontSize: '22px', fontWeight: 600, color: P.mute }, text: 'unread' }, top);
  const okB = html('div', { style: { width: '44px', height: '44px', borderRadius: '50%', background: 'linear-gradient(135deg,#ff5a1f,#ffb547)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 24px rgba(255,120,40,.7)' }, html: K.icon('check', 26, P.pillInk, 3.4) }, top);
  gsap.set(okB, { scale: 0 });
  const btn = html('div', { class: 'lp-btn', style: { position: 'relative', marginLeft: 'auto', width: '170px', height: '54px', fontSize: '22px' }, html: K.icon('spark', 22, P.pillInk) + '<span>Sort</span>' }, top);
  X.countUp(unread, 128, 0, b(71), b(3.5), (v) => String(Math.round(v)), 'power2.inOut');
  tl.fromTo(okB, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(3)', immediateRender: false }, b(74.75));
  X.sfx(b(74.75), 'success', { gain: 0.35 });
  const COLS = ['Now', 'Next', 'Later'], colX = (c) => 40 + c * 480;
  COLS.forEach((name, c) => {
    const col = html('div', { style: { position: 'absolute', left: colX(c) + 'px', top: '100px', width: '440px', height: '590px', borderRadius: '20px', background: 'rgba(12,8,7,.65)', border: `1px solid ${P.line}` } }, p2.body);
    html('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '18px 22px', fontSize: '21px', fontWeight: 750, letterSpacing: '.08em', color: c ? P.mute : P.flame }, html: `<span style="width:12px;height:12px;border-radius:50%;background:${c ? P.dim : P.ember};box-shadow:0 0 12px ${c ? 'transparent' : P.ember}"></span>${name.toUpperCase()}` }, col);
    tl.fromTo(col, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: F(8), ease: 'power3.out', immediateRender: false }, b(68) + F(6 + c * 3));
  });
  const CARDS = [
    ['Approve invoice #2041', 0, 'urgent'], ['Plan Q3 roadmap', 1, 'fyi'], ['Update brand fonts', 2, 'later'],
    ['Review launch deck', 0, 'today'], ['Onboarding v3 copy', 1, 'fyi'], ['Team offsite ideas', 2, 'later'],
    ['Fix login bug', 0, 'urgent'], ['Interview: designer', 1, 'today'], ['Clean up old files', 2, 'later'],
  ];
  const rc = X.rand(33), slotN = [0, 0, 0];
  CARDS.forEach(([title, c, kind], k) => {
    const r = slotN[c]++;
    const card = html('div', { class: 'lp-card', style: { left: '0px', top: '0px', width: '400px', height: '92px' }, html: `<div style="font-size:21px;font-weight:650;white-space:nowrap">${title}</div><div style="display:flex;align-items:center;gap:10px;margin-top:10px"><span style="width:26px;height:26px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3e2,${['#ffb547', '#ff8a4c', '#ffd08a'][k % 3]} 70%)"></span><span style="height:8px;width:${90 + (k * 37) % 80}px;border-radius:4px;background:#3a2b25"></span><span style="margin-left:auto;width:12px;height:12px;border-radius:50%;background:${kind === 'urgent' ? P.ember : kind === 'today' ? P.gold : P.dim}"></span></div>` }, p2.body);
    const mess = { x: 330 + rc() * 640, y: 150 + rc() * 330, rotation: (rc() - 0.5) * 30 };
    const slot = { x: colX(c) + 20, y: 170 + r * 106, rotation: 0 };
    gsap.set(card, { ...mess, opacity: 0 });
    tl.fromTo(card, { ...mess, opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: F(6), ease: 'power2.out', immediateRender: false }, b(68) + F(8 + k * 2));
    const land = b(70.5) + k * b(0.5);
    tl.fromTo(card, { ...mess }, { ...slot, duration: F(8), ease: 'back.out(1.3)', immediateRender: false }, land - F(5));
    X.sfx(land, 'tick', { gain: 0.32, pitch: 0.85 + (k % 3) * 0.12 });
  });
  const cur = K.cursor(K.fx);
  K.span(cur.g, b(68.6), b(73.5));
  gsap.set(cur.g, { x: 1780, y: 1120 });
  const bp = K.screenPos(btn, b(70));
  K.cursorTo(cur, bp.x - 10, bp.y - 6, b(68.8), b(1.2) - F(1));
  K.click(cur, b(70), bp.x - 4, bp.y);
  tl.fromTo(btn, { scale: 1.18 }, { scale: 1, duration: F(10), ease: 'elastic.out(1, 0.5)', immediateRender: false }, b(70));
  K.burst(K.fx, bp.x, bp.y, b(70), { n: 26, dur: 0.9, seed: 12 });
  X.sfx(b(70.1), 'sparkle', { dur: 0.5, gain: 0.25 });
  K.cursorTo(cur, 1900, 1150, b(72), b(1.4));
  const okAt = K.screenPos(okB, b(78.5));
  const z3 = K.zoomThrough(b(78.5), { x: okAt.x, y: okAt.y, r0: 22, open: false });

  // =================================================================== FEATURE 03 — SHIP ON TIME  b80–b96
  tl.set(env, { grid: 0.5, rings: 0.55, glow: 0.4, arcs: 0.4, gy: 560 }, z3.tCover);
  const fd3 = K.field(z3.tCover, b(84) + F(16), { seed: 5 });
  tl.to(fd3.g, { opacity: 0, duration: F(14), ease: 'power1.inOut' }, b(84));
  K.hud('Ship *on time*', b(80), { label: '03 — SHIP', size: 140, hold: b(83.6) - b(80) - F(22), on: 'field' });
  const p3 = K.panel({ x: 210, y: 180, w: 1500, h: 720, title: 'sorta · Launch plan', search: false });
  K.span(p3.el, b(84), b(95.5));
  K.tiltIn(p3.el, b(84), { from: { rotationY: 0, rotationX: 38, yPercent: 32, scale: 1.08, opacity: 0 } });
  // camera: push in on the playhead's start, track it across the plan, pull back for the stamp
  K.hop(p3.el, b(85), { scale: 1.26, x: 400, y: 40 }, 12);
  tl.to(p3.el, { x: -400, duration: b(91.2) - b(85) - F(12), ease: 'none' }, b(85) + F(12));
  K.hop(p3.el, b(91.2), { scale: 1.0, x: 0, y: 0 }, 12);
  X.sfx(b(85), 'swoosh', { dur: 0.3, gain: 0.2 }); X.sfx(b(91.2), 'woosh_low', { dur: 0.35, gain: 0.25 });
  const prog = html('div', { style: { marginLeft: 'auto', fontSize: '22px', fontWeight: 700, color: P.mute }, html: 'Launch v2 · <span style="color:#ffb547">0%</span>' }, p3.head);
  const progN = prog.querySelector('span');
  X.countUp(progN, 0, 100, b(85), b(7), (v) => Math.round(v) + '%', 'none');
  const GX = 250, GW = 1180, DAYS = ['M', 'T', 'W', 'T', 'F', 'M', 'T', 'W', 'T', 'F'];
  const gbody = p3.body;
  DAYS.forEach((d, k) => {
    html('div', { style: { position: 'absolute', left: (GX + k * GW / 10) + 'px', top: '28px', width: GW / 10 + 'px', textAlign: 'center', fontSize: '18px', fontWeight: 700, color: P.dim }, text: d }, gbody);
    html('div', { style: { position: 'absolute', left: (GX + k * GW / 10) + 'px', top: '70px', bottom: '30px', width: '1px', background: P.line } }, gbody);
  });
  const LANES = [['Brief', 0, 1.6, 'Brief'], ['Design', 1, 4.2, 'Design system'], ['Build', 3, 7.6, 'Build v2'], ['QA', 6.4, 9, 'QA pass'], ['Launch', 8.8, 10, 'Go']];
  const T0P = b(85), T1P = b(92), dayX = (d) => GX + d * GW / 10;
  LANES.forEach(([lab, d0, d1, txt], i) => {
    const y = 110 + i * 104;
    html('div', { style: { position: 'absolute', left: '36px', top: (y + 6) + 'px', fontSize: '22px', fontWeight: 650, color: P.mute }, text: lab }, gbody);
    const bar = html('div', { style: { position: 'absolute', left: dayX(d0) + 'px', top: y + 'px', width: (dayX(d1) - dayX(d0)) + 'px', height: '44px', borderRadius: '22px', background: `linear-gradient(90deg,${P.ember},${P.gold})`, boxShadow: '0 0 26px rgba(255,110,40,.45)', color: P.pillInk, fontSize: '19px', fontWeight: 750, display: 'flex', alignItems: 'center', paddingLeft: '18px', boxSizing: 'border-box', overflow: 'hidden', whiteSpace: 'nowrap', transformOrigin: '0% 50%' }, text: txt }, gbody);
    tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: F(10), ease: 'power3.out', immediateRender: false }, b(84) + F(8 + i * 3));
    gsap.set(bar, { scaleX: 0 });
    const tp = T0P + (dayX(d1) - GX) / GW * (T1P - T0P);
    const ck = html('div', { style: { position: 'absolute', left: (dayX(d1) - 10) + 'px', top: (y + 4) + 'px', width: '36px', height: '36px', borderRadius: '50%', background: '#1a120f', border: `2px solid ${P.gold}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }, html: K.icon('check', 20, P.gold, 3.2) }, gbody);
    gsap.set(ck, { scale: 0 });
    tl.fromTo(ck, { scale: 0 }, { scale: 1, duration: F(7), ease: 'back.out(3)', immediateRender: false }, Math.min(tp, b(92)));
    X.sfx(Math.min(tp, b(92)), 'tick', { gain: 0.35, pitch: 1 + i * 0.1 });
  });
  const ph = html('div', { style: { position: 'absolute', left: GX + 'px', top: '62px', bottom: '24px', width: '3px', marginLeft: '-1.5px', background: `linear-gradient(180deg,${P.gold},rgba(255,90,31,0))`, boxShadow: '0 0 14px rgba(255,181,71,.8)' } }, gbody);
  K.orbDiv(36, ph, { left: '-16.5px', top: '-18px' });
  gsap.set(ph, { opacity: 0 });
  tl.fromTo(ph, { opacity: 0 }, { opacity: 1, duration: F(6), immediateRender: false }, b(84.5));
  tl.fromTo(ph, { x: 0 }, { x: GW, duration: T1P - T0P, ease: 'none', immediateRender: false }, T0P);
  const stamp = html('div', { style: { position: 'absolute', left: (dayX(10) - 330) + 'px', top: (110 + 4 * 104 - 104) + 'px', padding: '10px 26px', border: `6px solid ${P.ember}`, borderRadius: '16px', color: P.ember, fontFamily: 'Archivo Black', fontSize: '64px', letterSpacing: '4px', background: 'rgba(18,13,11,.85)', boxShadow: '0 0 40px rgba(255,90,31,.5)' }, text: 'SHIPPED' }, gbody);
  gsap.set(stamp, { opacity: 0, rotation: -9 });
  tl.fromTo(stamp, { scale: 2.6, opacity: 0, rotation: -9 }, { scale: 1, opacity: 1, rotation: -9, duration: F(5), ease: 'power4.out', immediateRender: false }, b(92));
  X.sfx(b(92), 'stamp', { gain: 0.5 });
  X.sfx(b(92), 'impact', { dur: 0.8, gain: 0.4, pitch: 1.2 });
  const stAt = K.screenPos(stamp, b(92.5));
  K.burst(K.fx, stAt.x, stAt.y, b(92), { n: 90, dur: 1.5, seed: 7 });
  K.shock(b(92), stAt.x, stAt.y, { r1: 700, width: 8, frames: 16 });
  K.pullBack(p3.el, b(94.8));

  // =================================================================== CALLBACK + APHORISM  b96–b108  (energy 2)
  tl.set(env, { grid: 0, rings: 0.6, glow: 0.5, gy: 540, arcs: 0.8 }, b(95.5));
  K.slam([['FROM ', P.text], ['47', P.gold], [' TABS', P.text]], b(96), { size: 168, hold: b(2.6) - F(7), out: 'blur', dx: 60 });
  K.rgbSlam([['TO ', P.text], ['1.', P.gold]], b(99), { size: 320, hold: b(2.6) });
  K.pill([{ t: 'Less', pill: true }, { t: 'chasing.' }], b(102), { size: 108, hold: b(3) - F(14) - F(3), hits: [0, 1, 2, 2.75, 3.5] });
  K.pill([{ t: 'More', pill: true }, { t: 'shipping.' }], b(105), { size: 108, hold: b(3) - F(14) - F(4), hits: [0, 1, 2, 2.75, 3.5] });

  // =================================================================== END CARD  b108–end (energy 0 + end hit)
  const E = b(108);
  K.envTo({ spot: 0, rings: 0.6, glow: 0.5, arcs: 0.8, stars: 0.55, bokeh: 0.6 }, { spot: 1, rings: 0.55, glow: 0.36, arcs: 0.5, stars: 0.8, bokeh: 1 }, E - F(3), 1.2, 'power2.out');
  K.envTo({ spotX: 620 }, { spotX: 1300 }, E, END - E, 'sine.inOut');
  const endG = X.svg('g', {}, K.type);
  K.span(endG, E, END + 1);
  const S2M = 176, S2W = 168;
  const wm2W = K.measure('sorta', S2W, 'Space Grotesk', 700, -S2W * 0.03);
  const L2 = 960 - (S2M + 48 + wm2W) / 2;
  const mk2 = K.mark(endG, { x: L2 + S2M / 2, y: 430, s: S2M });
  K.markBuild(mk2, E);
  const wm2 = K.wordmark(endG, { x: L2 + S2M + 48, y: 476, size: S2W });
  K.decode(wm2.cs, E + b(0.5), { perChar: 2, seed: 9 });
  tl.fromTo(wm2.orb.g, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(2.6)', immediateRender: false }, b(109.5));
  X.sfx(b(109.5), 'chime', { dur: 0.6, gain: 0.3 });
  const tag = K.chars(endG, 'Not sorta. *Sorted.*', { x: 960, y: 606, size: 58, font: 'Space Grotesk', weight: 500, fill: P.cream, accent: P.gold });
  K.decode(tag, b(111), { perChar: 1, seed: 2 });
  // CTA button: outline draws, label decodes, glow pulses every 2 beats
  const btnG = X.svg('g', {}, endG);
  const BW = 420, BH = 92, BX = 960 - BW / 2, BY = 680;
  const glowR = X.svg('rect', { x: BX, y: BY, width: BW, height: BH, rx: BH / 2, fill: P.ember, opacity: 0, filter: K.blur(22) }, btnG);
  X.svg('rect', { x: BX, y: BY, width: BW, height: BH, rx: BH / 2, fill: 'rgba(255,90,31,0.10)' }, btnG);
  const outline = X.svg('path', { d: `M${960},${BY} H${BX + BW - BH / 2} A${BH / 2},${BH / 2} 0 0 1 ${BX + BW - BH / 2},${BY + BH} H${BX + BH / 2} A${BH / 2},${BH / 2} 0 0 1 ${BX + BH / 2},${BY} Z`, fill: 'none', stroke: P.flame, 'stroke-width': 3.5, filter: K.bloom }, btnG);
  K.span(btnG, b(113), END + 1);
  X.drawOn(outline, b(113), F(12), 'power2.inOut');
  const ctaT = K.chars(btnG, 'Join the beta  →', { x: 960, y: BY + BH / 2 + 12, size: 34, font: 'Inter', weight: 700, fill: P.text });
  K.decode(ctaT, b(113) + F(6), { perChar: 1, seed: 5, sfx: false });
  X.sfx(b(113), 'blip_up', { dur: 0.2, gain: 0.25 });
  for (let k = 0; b(114) + k * b(2) < END - 0.4; k++) tl.fromTo(glowR, { opacity: 0.75 }, { opacity: 0.18, duration: b(2), ease: 'sine.out', immediateRender: false }, b(114) + k * b(2));
  const plat = K.chars(endG, 'Mac  ·  Windows  ·  Web', { x: 960, y: 860, size: 30, font: 'Inter', weight: 600, track: 2, fill: P.mute });
  K.typewriter(plat, b(115), { cps: 12 });
  gsap.set(endG, { svgOrigin: '960 560' });
  tl.fromTo(endG, { scale: 1.04 }, { scale: 0.985, duration: END - E, ease: 'power1.out', immediateRender: false }, E);

  // the ring field pumps with the drums wherever the dark ground shows (808 + clap in energy 1–2, kicks in energy 3)
  K.pulseBars(0, 3, [0, 2.75], 40);
  K.pulseBars(4, 8, [0, 2, 2.75], 36);             // chaos (808 + clap)
  K.pulseBars(9, 11, [0, 0.75, 2, 2.5], 56);       // logo lockup after the drop
  K.pulseBars(11, 13, [0, 0.75, 2.5], 44);         // field card 01 (the field pumps too)
  K.pulseBars(16, 17, [0, 0.75, 2.5], 44);         // field card 02
  K.pulseBars(20, 21, [0, 0.75, 2.5], 44);         // field card 03
  K.pulseBars(13, 16, [0, 0.75, 2.5], 34);         // inbox
  K.pulseBars(17, 20, [0, 0.75, 2.5], 34);         // board
  K.pulseBars(21, 24, [0, 0.75, 2.5], 34);         // plan
  K.pulseBars(24, 27, [0, 2, 2.75], 50);           // callback + aphorism (breakdown)
  for (let k = 0; b(114) + k * b(2) < END - 1; k++) K.ringPulse(b(114) + k * b(2), 22, F(20));   // end card: soft swell with the CTA glow
  X.end(END);
});
