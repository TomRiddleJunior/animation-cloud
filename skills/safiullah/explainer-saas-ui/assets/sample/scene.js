/* Kitewise — original SaaS/AI product walkthrough in the "saas-ui" style (A2 Gradient AI skin).
 * Beat map: hook/problem (0–12 %) → logo-matte name reveal (12–25 %) → 3 feature beats, each one UI interaction
 * (hub-and-orbit + feed · Ask Kite summary · one-click tasks on a board) → outcome (kinetic line + avatars) → logo-matte
 * CTA bookend with a clicked pill and a fictional URL. One continuous camera ride, zero hard cuts. */
X.boot(async (X) => {
  await X.loadVO();
  const S = K.skin('glow');
  const F = K.F, at = K.at, tl = X.tl, h = K.h;
  const L = (id) => X.line(id);
  const bg = K.background({ breathe: 0.12, drift: 60 });

  // ---------------------------------------------------------------- layers (bottom → top)
  const tMatte1 = L('reveal').start - 0.92;            // logo-matte swallows the hook
  const tHub = at('reveal', 'with') - 0.05;
  const tApp = at('f1', 'lands') + 0.05;
  const tOut = L('outcome').start - 0.7;
  const tMatte2 = L('cta').start - 0.55;
  const hook = K.layer('hook', 0, null, { z: 10 });
  const hub = K.layer('hub', tHub, tApp + 0.75, { z: 12 });
  const app = K.layer('app', tApp - 0.02, tOut + 0.75, { z: 11 });
  const outL = K.layer('outcome', tOut, null, { z: 13 });
  const typeL = K.layer('type', 0, null, { z: 20 });
  const fx = K.layer('fx', 0, null, { z: 25 });
  const logoL = K.layer('logo', 0, null, { z: 27 });
  const cur = K.cursor({ z: 60 });

  // ================================================================= 1. HOOK — scattered tools (0 → ~11.5 s)
  const hw = K.world(hook);
  const hcam = K.camera(hw, { x: 960, y: 540, s: 1, vx: 18, vy: -6, vs: 0.016 });
  const hl = L('hook');
  const k1 = K.kinetic(hw, { words: hl.words.map((w) => w.w), times: hl.words.map((w) => w.start - 2 * F), key: [4], size: 92, y: 500 });
  tl.fromTo(k1.el, { y: 0, scale: 1 }, { y: -318, scale: 0.6, duration: 0.65, ease: 'power2.inOut' }, L('tools').start - 0.4);
  X.sfx(L('tools').start - 0.4, 'swoosh', { dur: 0.5, gain: 0.14 });

  const chaos = [];
  let task_imp;
  const chaosCard = (o, build) => {
    const c = K.card(hw, { x: o.x, y: o.y, w: o.w, h: o.h, r: 22 });
    c.body.style.padding = '22px 24px';
    c.body.style.display = 'flex'; c.body.style.flexDirection = 'column'; c.body.style.gap = '14px';
    c.body.style.overflow = 'visible';
    const head = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px' } }, c.body);
    K.glyph(head, o.icon, { size: 44, tone: o.tone });
    h('div', { cls: 'k-t1', text: o.title, style: { fontSize: 21 } }, head);
    if (o.meta) h('div', { text: o.meta, style: { fontSize: 15, color: 'var(--muted)', marginLeft: 'auto', whiteSpace: 'nowrap' } }, head);
    build && build(c.body);
    tl.fromTo(c.el, { y: 70, opacity: 0, rotation: o.rot * 2.6, scale: 0.92 }, { y: 0, opacity: 1, rotation: o.rot, scale: 1, duration: 16 * F, ease: 'expo.out' }, o.t);
    X.sfx(o.t, 'pop', { gain: 0.2, pitch: 0.8 + chaos.length * 0.07 });
    if (o.badge) { const b = K.badge(c.el, { text: o.badge, right: -12, top: -12 }); K.pop(b, o.t + 0.32, { gain: 0.14, pitch: 1.4 }); }
    const ph = chaos.length * 1.37;
    X.every((t) => { c.el.style.translate = `${(9 * Math.sin(t * 1.1 + ph)).toFixed(2)}px ${(12 * Math.sin(t * 1.35 + ph * 1.7)).toFixed(2)}px`; });
    chaos.push(c);
    return c;
  };
  const tl2 = L('tools');
  const chat = chaosCard({ x: 170, y: 300, w: 420, h: 236, rot: -6, icon: 'chat', tone: 1, title: '#launch', meta: '14 new', t: at('tools', 'Chats'), badge: '14' }, (b) => {
    [[11, 0.85], [23, 0.6], [6, 0.72]].forEach(([sd, w]) => { const r = h('div', { style: { display: 'flex', gap: '12px', alignItems: 'center' } }, b); K.avatar(r, { seed: sd, size: 34, ring: false }); K.greek(r, { widths: [w * 260], h: 11 }); });
  });
  const doc = chaosCard({ x: 1300, y: 270, w: 410, h: 236, rot: 5, icon: 'doc', tone: 2, title: 'Launch brief v3', t: at('tools', 'Docs'), badge: '4' }, (b) => {
    K.greek(b, { widths: [1, 0.92, 0.97, 0.6], h: 11, gap: 12 });
    K.chip(b, { text: '4 comments', icon: 'chat', tone: 2, size: 14 });
  });
  const task = chaosCard({ x: 735, y: 560, w: 450, h: 182, rot: -2, icon: 'check', tone: 4, title: 'Send the launch brief', t: at('tools', 'Tasks') }, (b) => {
    const r = h('div', { style: { display: 'flex', gap: '10px' } }, b);
    const imp = K.chip(r, { text: 'Important', icon: 'flag', tone: 'soft', size: 15 }); K.chip(r, { text: 'Due today', icon: 'clock', size: 15 });
    task_imp = imp;
    K.greek(b, { widths: [0.8], h: 10 });
  });
  const cal = chaosCard({ x: 300, y: 690, w: 340, h: 235, rot: 4, icon: 'calendar', tone: 5, title: 'Thursday', t: at('tools', 'somewhere') }, (b) => {
    [[5, 0.9], [1, 0.6], [2, 0.75]].forEach(([tn, w]) => h('div', { style: { height: 30, width: w * 100 + '%', borderRadius: 9, background: `var(--tint${tn})`, borderLeft: `4px solid var(--ink${tn})` } }, b));
  });
  const mail = chaosCard({ x: 1270, y: 650, w: 370, h: 205, rot: -5, icon: 'mail', tone: 3, title: 'Inbox', meta: '24 unread', t: at('tools', 'between'), badge: '24' }, (b) => {
    [0.9, 0.7, 0.8].forEach((w) => { const r = h('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } }, b); h('div', { style: { width: 9, height: 9, borderRadius: '50%', background: 'var(--accent)' } }, r); K.greek(r, { widths: [w * 250], h: 10 }); });
  });
  const met = chaosCard({ x: 805, y: 255, w: 300, h: 230, rot: 3, icon: 'chart', tone: 2, title: 'Metrics', t: at('tools', 'in', 1) }, (b) => {
    const bb = K.bars(b, { w: 250, h: 100, data: [3, 5, 4, 6, 5, 7], gap: 10 }); bb.grow(at('tools', 'in', 1) + 0.15);
  });

  hcam.key(at('tools', 'Chats') - 0.15, { x: 700, y: 470, s: 1.13, dur: 0.75, vx: 30, vy: 10, vs: 0.012 });
  hcam.key(at('tools', 'Docs') - 0.15, { x: 1260, y: 470, s: 1.13, dur: 0.75, vx: -30, vs: 0.012 });
  hcam.key(at('tools', 'Tasks') - 0.15, { x: 960, y: 650, s: 1.14, dur: 0.75, vy: -20, vs: 0.012 });
  hcam.key(at('tools', 'somewhere') - 0.1, { x: 960, y: 560, s: 0.97, dur: 1.0, vx: 26, vy: 10, vs: 0.016, sfx: true });
  // pain: the cursor darts between tools; a focus ring drains; the important task slips away
  const pl = L('pain');
  const ringCard = K.glass(hw, { x: 790, y: 840, w: 340, h: 132, r: 26 });
  ringCard.body.style.display = 'flex'; ringCard.body.style.alignItems = 'center'; ringCard.body.style.gap = '18px'; ringCard.body.style.padding = '0 26px';
  ringCard.body.style.background = 'var(--surface)';
  const ring = K.ring(ringCard.body, { size: 96, sw: 9, value: 100, unit: '%' });
  const rl = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } }, ringCard.body);
  h('div', { text: 'Focus', cls: 'k-t1', style: { fontSize: 24 } }, rl);
  h('div', { text: 'left today', cls: 'k-t2', style: { fontSize: 17 } }, rl);
  K.rise(ringCard.el, at('pain', 'focus') - 0.35, { y: 30 });
  ring.count(at('pain', 'Every') + 0.1, 0.01, 0, 100, { unit: false });
  cur.start([1760, 1060]).show(pl.start - 0.35);
  const hops = [[chat, at('pain', 'switch'), 0.42], [doc, at('pain', 'costs') + 0.12, 0.38], [mail, at('pain', 'focus') + 0.18, 0.4], [cal, at('pain', 'and') + 0.05, 0.42]];
  let lvl = 100;
  hops.forEach(([c, t, d], i) => {
    cur.clickOn({ el: c.el, cam: hcam, ay: 0.25 }, t, { dur: d, hover: 0.08, arc: i % 2 ? 70 : -70 });
    tl.set(c.el, { zIndex: 5 + i }, t);
    tl.fromTo(c.el, { scale: 1 }, { scale: 1.045, duration: 4 * F, yoyo: true, repeat: 1, ease: 'power2.out' }, t);
    const next = [72, 51, 34, 22][i];
    ring.count(t + 0.03, 0.35, lvl, next, { unit: false }); lvl = next;
    X.sfx(t + 0.05, 'blip_down', { gain: 0.1, pitch: 1 - i * 0.08 });
  });
  cur.move(at('pain', 'important') + 0.05, [1500, 980], { dur: 0.5 }).hide(at('pain', 'slip') + 0.1);
  hops.forEach(([c, t]) => { const r = K.rect(c.el); hcam.key(t - 0.32, { x: 960 + (r.x + r.w / 2 - 960) * 0.3, y: 560 + (r.y + r.h / 2 - 560) * 0.24, s: 1.03, dur: 0.5, vx: 12, vs: 0.012 }); });
  hcam.key(at('pain', 'slip') - 0.05, { x: 960, y: 640, s: 1.05, dur: 0.9, vy: 34, vs: 0.02 });
  tl.fromTo(task_imp, { scale: 1 }, { scale: 1.12, duration: 5 * F, yoyo: true, repeat: 1, ease: 'power2.out', transformOrigin: '0% 50%' }, at('pain', 'important'));
  const tSlip = at('pain', 'slip');
  tl.set(task.el, { zIndex: 30 }, tSlip);
  tl.to(task.el, { rotation: 16, y: 620, x: 60, duration: 0.85, ease: 'power2.in' }, tSlip);
  tl.to(task.el, { filter: 'blur(5px)', opacity: 0.0, duration: 0.5, ease: 'power2.in' }, tSlip + 0.4);
  X.sfx(tSlip, 'woosh_low', { dur: 0.8, gain: 0.32 });
  tl.to([chat.el, doc.el, cal.el, mail.el, met.el], { opacity: 0.5, duration: 0.6, ease: 'power2.out' }, at('pain', 'cracks'));

  // ================================================================= 2. NAME REVEAL — logo-matte zoom (T6) + lock-up
  const markSize = 168;
  const wm = K.wordmark(logoL, { text: 'kitewise', size: 150, x: 0, y: 0 });
  const wmW = wm.el.offsetWidth, markW = markSize * (172 / 196), gapL = 40;
  const lockX = 960 - (markW + gapL + wmW) / 2 + markW / 2;            // mark centre in the lock-up
  wm.el.style.left = (lockX + markW / 2 + gapL) + 'px'; wm.el.style.top = (540 - 98) + 'px';
  gsap.set(wm.letters, { opacity: 0 });
  const m1 = K.logoMatte(fx, { t: tMatte1, at: [960, 540], size: markSize, scale: 5.2, hide: hook });
  const tW = at('reveal', 'Kitewise') - 0.12;
  m1.move(tW, { at: [lockX, 540], dur: 0.55, ease: 'power3.inOut' });
  K.glint(logoL, { t: m1.tLand + 0.02, x: 960 + 34, y: 540 - 62, size: 110 });
  tl.fromTo(wm.letters, { opacity: 0, x: -36 }, { opacity: 1, x: 0, duration: 10 * F, ease: 'power3.out', stagger: 2 * F }, tW + 0.4);
  const rv = L('reveal').words, tw = ['One', 'calm', 'workspace,'].map((w) => rv.find((x) => x.w.startsWith(w)));
  const tagK = K.kinetic(logoL, { words: ['One', 'calm', 'workspace'], times: tw.map((w) => w.start - 2 * F), key: [1], keyScale: 1, size: 46, weight: 500, y: 668, color: 'var(--muted)', sfx: false });
  const tag1 = tagK.el;
  // anchor morph: wordmark + tagline leave, the mark returns to centre and becomes the app-icon hub
  const tMorph = at('reveal', 'with');
  tl.to(wm.letters, { opacity: 0, x: -30, duration: 6 * F, ease: 'power2.in', stagger: { each: F, from: 'end' } }, tMorph - 0.38);
  tl.to(tag1, { opacity: 0, y: -10, duration: 8 * F, ease: 'power2.in' }, tMorph - 0.1);
  const hubW = K.world(hub);
  const hubCam = K.camera(hubW, { x: 960, y: 540, s: 1 });
  hubCam.key(tMorph + 0.72, { s: 1, dur: F });
  hubCam.key(tMorph + 0.75, { x: 940, y: 552, s: 0.86, dur: 1.8, vx: 22, vs: 0.0168, sfx: true });
  hubCam.key(at('f1', 'tools') - 0.3, { x: 1050, y: 566, s: 1.0, dur: 1.4, vx: 42, vy: 10, vs: 0.0224, sfx: true });
  hubCam.key(at('f1', 'message') - 0.3, { x: 880, y: 540, s: 1.08, dur: 1.3, vx: -45, vs: 0.0224 });
  hubCam.key(at('f1', 'lands') - 0.55, { x: 960, y: 540, s: 1, dur: 0.45 });
  const grid = h('div', { style: { position: 'absolute', left: -600, top: -400, width: 3120, height: 1880, opacity: 0.85,
    backgroundImage: 'radial-gradient(circle, #C4B8F0 1.6px, transparent 2.2px)', backgroundSize: '34px 34px',
    WebkitMaskImage: 'radial-gradient(ellipse 34% 40% at 50% 50%, #000 30%, transparent 100%)', maskImage: 'radial-gradient(ellipse 34% 40% at 50% 50%, #000 30%, transparent 100%)' } }, hubW);
  tl.fromTo(grid, { opacity: 0 }, { opacity: 0.85, duration: 0.8, ease: 'power2.out' }, tMorph + 0.3);
  tl.to(grid, { opacity: 0, duration: 0.4, ease: 'power2.in' }, at('f1', 'lands') - 0.25);
  bg.washTo(tMorph - 0.1, 1, 1.0);
  K.zoomDrift([fx, logoL], [[m1.tLand, 1], [tMorph - 0.1, 1.085], [tMorph + 0.6, 1], [tMatte2 + 0.6, 1], [L('cta').end + 3.2, 1.075]]);
  const icon = K.appIcon(hubW, { size: 216, x: 960 - 108, y: 540 - 108 });
  m1.move(tMorph + 0.05, { at: [960, 540], size: icon.markH, dur: 0.6, ease: 'power3.inOut' });
  m1.hideAt(tMorph + 0.7);
  gsap.set(icon.mark, { opacity: 0 });
  tl.set(icon.mark, { opacity: 1 }, tMorph + 0.7);
  tl.fromTo([icon.tile, icon.glow], { scale: 0.4, opacity: 0 }, { scale: 1, opacity: 1, duration: 16 * F, ease: 'back.out(1.6)', stagger: 2 * F }, tMorph + 0.3);
  X.sfx(tMorph + 0.3, 'pop', { gain: 0.24, pitch: 0.7 });
  K.burst(hubW, { t: tMorph + 0.62, cx: 960, cy: 540, n: 64, dur: 1.1, color: '#B4A6F5', z: 0, sfx: false });
  X.sfx(tMorph + 0.62, 'whoosh', { dur: 0.6, gain: 0.2 });
  X.every((t) => { icon.glow.style.translate = `0 ${(6 * Math.sin(t * 1.3)).toFixed(2)}px`; icon.glow.style.rotate = `${(t * 9) % 360}deg`; });

  // ================================================================= 3. FEATURE 1 — hub-and-orbit (T12) → single feed
  const orb = K.orbit(hubW, {
    cx: 960, cy: 556, rx: 650, ry: 268, size: 128, labelSize: 23, ring: '#D9D2F2', t: at('reveal', 'connected') - 0.2, satT: at('reveal', 'connected') + 0.1,
    linesT: at('f1', 'tools') - 0.1, speed: 14, tilt: 0.12, a0: -Math.PI / 2 - 0.35,
    items: [{ icon: 'chat', label: 'Chat', tone: 1 }, { icon: 'doc', label: 'Docs', tone: 2 }, { icon: 'calendar', label: 'Calendar', tone: 5 },
      { icon: 'check', label: 'Tasks', tone: 4 }, { icon: 'mail', label: 'Mail', tone: 3 }, { icon: 'code', label: 'Code', tone: 1 }],
  });
  orb.pulse(0, at('f1', 'message'));
  orb.pulse(1, at('f1', 'file'));
  orb.pulse(3, at('f1', 'task'));
  orb.collapse(at('f1', 'lands') - 0.2, 0.42);
  K.headline(typeL, { title: 'Connect every tool', sub: 'Messages, files and tasks in one feed', t: at('f1', 'plugs') - 0.15, out: at('f1', 'lands') - 0.1, size: 50 });

  // ---------------------------------------------------------------- the app world (window, sidebar, feed, board, Ask Kite)
  const aw = K.world(app);
  const acam = K.camera(aw, { x: 800, y: 482, s: 0.86 });
  acam.key(tApp - 0.02, { x: 800, y: 482, s: 0.86, dur: F, vx: 32, vs: 0.0224 });
  bg.washTo(tApp - 0.15, 0, 0.7);
  const win = K.win(aw, { x: 0, y: 0, w: 1600, h: 960, search: 'Search or ask Kite…', me: 9 });
  const sb = K.sidebar(win.body, { brand: 'kitewise', items: [
    { icon: 'home', label: 'Home' }, { icon: 'inbox', label: 'Inbox', badge: '12', active: true }, { icon: 'sparkle', label: 'Ask Kite', tone: 1 },
    { icon: 'board', label: 'Board' }, { icon: 'doc', label: 'Docs' }, { icon: 'calendar', label: 'Calendar' }],
    spaces: [{ label: 'Product launch', color: '#9C8CFF' }, { label: 'Design', color: '#8DB8F2' }, { label: 'Growth', color: '#F0B3CF' }] });
  const main = h('div', { style: { position: 'absolute', left: 280, top: 0, right: 0, bottom: 0 } }, win.body);
  // feed view
  const feed = h('div', { style: { position: 'absolute', inset: 0, padding: '32px 44px' } }, main);
  const fh = h('div', { style: { display: 'flex', alignItems: 'baseline', gap: '16px' } }, feed);
  h('div', { text: 'Today', style: { fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' } }, fh);
  h('div', { text: 'Tuesday · 7 updates across 6 tools', style: { fontSize: 18, color: 'var(--muted)' } }, fh);
  const chipsRow = h('div', { style: { display: 'flex', gap: '10px', margin: '18px 0 14px' } }, feed);
  K.chip(chipsRow, { text: 'All', tone: 'soft', size: 16 }); ['Mentions', 'Files', 'Tasks'].forEach((t) => K.chip(chipsRow, { text: t, tone: 'outline', size: 16 }));
  const list = h('div', { style: { display: 'flex', flexDirection: 'column', borderRadius: 18, border: '1px solid var(--line)', overflow: 'hidden' } }, feed);
  const rowsData = [
    ['chat', 1, 'Ravi in #launch', 'Can we lock the launch date by Thursday?', 11, '9:41'],
    ['doc', 2, 'Launch brief v3', 'Maya edited the brief · 4 comments', 23, '9:30'],
    ['check', 4, 'Finalize pricing page', 'Due Friday · assigned to you', 9, '9:12'],
    ['mail', 3, 'Press kit request', 'From the events team', 31, '8:55'],
    ['calendar', 5, 'Launch review', 'Thursday, 2:00 PM · 6 guests', 6, '8:40'],
    ['code', 1, 'Checkout fixes merged', 'Pull request 482 · 3 reviewers', 17, '8:22'],
    ['chart', 2, 'Weekly metrics ready', 'Sign-ups dashboard updated', 29, '8:05'],
  ];
  const rows = rowsData.map(([g, tn, ti, su, av, tm], i) => K.row(list, { glyph: g, tone: tn, title: ti, sub: su, avatar: av, time: tm, unread: i < 5, h: 92, divider: i < rowsData.length - 1 }));
  // board view (swapped in later)
  const board = h('div', { style: { position: 'absolute', inset: 0, padding: '32px 44px' } }, main);
  gsap.set(board, { autoAlpha: 0 });
  const bh = h('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '22px' } }, board);
  h('div', { text: 'Product launch', style: { fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em' } }, bh);
  K.chip(bh, { text: 'Board', icon: 'board', tone: 'soft', size: 16 });
  K.avatarStack(bh, [11, 23, 9, 6], { size: 36, style: {} }).el.style.marginLeft = 'auto';
  const cols = h('div', { style: { display: 'flex', gap: '22px', alignItems: 'flex-start' } }, board);
  const colEl = (name) => {
    const c = h('div', { style: { width: 396, flex: 'none', background: 'var(--surface2)', borderRadius: 20, padding: '18px 16px 20px', display: 'flex', flexDirection: 'column', gap: '14px', minHeight: 640 } }, cols);
    const hd = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '0 6px' } }, c);
    h('div', { text: name, style: { fontSize: 19, fontWeight: 650 } }, hd);
    const n = h('div', { text: '0', style: { fontSize: 15, fontWeight: 700, color: 'var(--muted)', background: 'var(--surface)', borderRadius: 99, padding: '2px 10px' } }, hd);
    return { c, n };
  };
  const cTodo = colEl('To do'), cProg = colEl('In progress'), cDone = colEl('Done');
  const taskCard = (parent, o) => {
    const el = h('div', { style: { position: 'relative', background: 'var(--surface)', borderRadius: 16, padding: '16px 18px', boxShadow: '0 1px 2px var(--shadow-s), 0 8px 20px var(--shadow)',
      display: 'flex', flexDirection: 'column', gap: '12px', height: 116, overflow: 'hidden', opacity: o.dim ? 0.6 : 1 } }, parent);
    h('div', { cls: 'k-t1', text: o.title, style: { fontSize: 19 } }, el);
    const r = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: 'auto' } }, el);
    const date = K.chip(r, { text: o.date, icon: 'clock', tone: o.tone ?? 'muted', size: 15 });
    const av = K.avatar(r, { seed: o.av, size: 34, style: { marginLeft: 'auto' } });
    return { el, date, av };
  };
  const slots = [0, 1, 2].map(() => { const s = h('div', { style: { height: 116, borderRadius: 16, border: '2px dashed var(--line)', opacity: 0 } }, cTodo.c); return s; });
  const prog = [taskCard(cProg.c, { title: 'Hero visuals', date: 'Wed', av: 23 }), taskCard(cProg.c, { title: 'Pricing page copy', date: 'Fri', av: 9 })];
  [['Brand guide', 'Mon', 6], ['Beta invite list', 'Tue', 31], ['Launch checklist', 'Tue', 11]].forEach(([t, d, a]) => taskCard(cDone.c, { title: t, date: d, av: a, dim: true }));
  X.countUp(cProg.n, 2, 2, 0, 0.01); X.countUp(cDone.n, 3, 3, 0, 0.01);

  // Ask Kite floating glass panel (unfolds in 3D, T11)
  const askP = K.plane(aw, { x: 1000, y: 64, w: 580, h: 860 }, 1800);
  const ask = K.card(askP, { x: 0, y: 0, w: 580, h: 860, r: 28, glow: 0.55, glass: true });
  ask.body.style.cssText += ';display:flex;flex-direction:column;background:var(--surface)';
  gsap.set(ask.el, { opacity: 0 });
  const ah = h('div', { style: { display: 'flex', alignItems: 'center', gap: '14px', padding: '22px 26px', borderBottom: '1px solid var(--line)' } }, ask.body);
  K.glyph(ah, 'sparkle', { size: 44, tone: 1 });
  h('div', { text: 'Ask Kite', style: { fontSize: 23, fontWeight: 700 } }, ah);
  K.chip(ah, { text: '#launch', icon: 'hash', size: 14 }).style.marginLeft = 'auto';
  const msgs = h('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', padding: '22px 24px', overflow: 'hidden', position: 'relative' } }, ask.body);
  const greet = h('div', { style: { position: 'absolute', left: 30, right: 30, top: 150, display: 'flex', flexDirection: 'column', gap: '12px' } }, msgs);
  h('div', { text: 'Morning, Sam.', style: { fontSize: 38, fontWeight: 700, letterSpacing: '-0.02em' } }, greet);
  h('div', { text: 'What can I find for you?', style: { fontSize: 24, color: 'var(--muted)', marginBottom: '18px' } }, greet);
  const sugg = ['Summarize a thread', 'What is due this week?', 'Draft a reply to Ravi'].map((t, i) => K.chip(greet, { text: t, icon: ['sparkle', 'calendar', 'chat'][i], tone: 'outline', size: 18 }));
  const ub = K.bubble(msgs, { text: 'Summarize the launch thread', who: 'me', size: 19 });
  const dots = K.dots(msgs, { size: 10 });
  const ans = h('div', { style: { background: 'var(--surface)', borderRadius: 20, padding: '20px 22px', boxShadow: '0 1px 2px var(--shadow-s), 0 10px 26px var(--shadow)', display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '-44px' } }, msgs);
  const ansHead = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } }, ans);
  ansHead.innerHTML = K.icon('sparkle', { size: 20, color: 'var(--accent)' }) + '<span style="font-size:18px;font-weight:700">Launch thread · summary</span>';
  const summ = h('div', { text: 'Launch moves to next Thursday. The pricing copy is the last open item.', style: { fontSize: 18, lineHeight: 1.45, color: 'var(--text)' } }, ans);
  const secLab = (t) => h('div', { text: t, style: { fontSize: 13, fontWeight: 700, letterSpacing: '.1em', color: 'var(--muted)', marginTop: '6px' } }, ans);
  const decLab = secLab('DECISIONS');
  const decs = ['Launch date: Thursday', 'Beta stays invite-only'].map((t) => {
    const r = h('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', fontSize: 18 } }, ans);
    const ic = h('div', { html: K.icon('checkCircle', { size: 22, color: 'var(--ink4)' }) }, r); h('span', { text: t }, r); return { r, ic };
  });
  const nxLab = secLab('NEXT STEPS');
  const steps = [['Lock launch date', 'Ravi', 11], ['Send press kit', 'Maya', 23], ['Prep demo script', 'You', 9]].map(([t, who, av]) => {
    const r = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', fontSize: 18, height: 50, padding: '0 12px', borderRadius: 12, background: 'var(--surface2)', position: 'relative', overflow: 'hidden' } }, ans);
    const bar = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: 4, background: 'var(--accent)', transformOrigin: '50% 0%' } }, r);
    h('div', { html: K.icon('box', { size: 22, color: 'var(--muted)' }) }, r); h('span', { text: t, style: { fontWeight: 600 } }, r);
    const w = h('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--muted)', fontSize: 16 } }, r);
    K.avatar(w, { seed: av, size: 28, ring: false }); h('span', { text: who }, w);
    return { r, bar };
  });
  const mkBtn = K.btn(ans, { label: 'Create 3 tasks', icon: 'plus', kind: 'primary', size: 19, style: { alignSelf: 'flex-start', marginTop: '6px' } });
  const inBar = h('div', { style: { margin: '0 22px 22px', height: 64, borderRadius: 18, background: 'var(--surface)', border: '1px solid var(--line)', display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px 0 20px', boxShadow: '0 4px 14px var(--shadow-s)' } }, ask.body);
  const inTxt = h('div', { style: { flex: 1, height: 30, fontSize: 19, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', position: 'relative' } }, inBar);
  const inPh = h('span', { text: 'Ask anything about your work…', style: { color: 'var(--muted)', position: 'absolute', left: 0, top: 3 } }, inTxt);
  const inTyped = h('span', { style: { position: 'absolute', left: 0, top: 3 } }, inTxt);
  const sendB = h('div', { html: K.icon('send', { size: 22, color: '#fff' }), style: { width: 46, height: 46, borderRadius: 14, background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' } }, inBar);

  // toasts (world space, they ride with the camera)
  const r0 = K.rect(rows[0].el), rp = K.rect(cProg.c);
  const toast1 = K.toast(aw, { icon: 'checkCircle', tone: 4, title: "You're all caught up", sub: '7 updates read · nothing missed', x: r0.x + r0.w * 0.52, y: r0.y - 70, w: 430 });
  const toast2 = K.toast(aw, { icon: 'board', tone: 1, title: 'Board in sync', sub: '3 tasks created · owners notified', x: rp.x + 60, y: rp.y - 40, w: 440 });

  // ---------------------------------------------------------------- window entrance + feed (end of F1, f1b)
  K.rise(win.wrap, tApp - 0.05, { y: 90, scale: 0.92, dur: 0.6, ease: 'power3.out' });
  const flyT = tApp + 0.1, flyD = 0.72;
  gsap.set(sb.logo, { opacity: 0 }); tl.set(sb.logo, { opacity: 1 }, flyT + flyD);
  const logoR = K.rect(sb.logo);
  tl.to([icon.tile, icon.glow], { opacity: 0, duration: flyD * 0.8, ease: 'power2.in' }, flyT);
  K.flyTo(icon.mark, flyT, flyD, (T) => { const [x, y] = acam.toScreen(logoR.x + logoR.w / 2, logoR.y + logoR.h / 2, T); return [x, y, (34 * acam.state(T).s) / icon.markH]; }, { from: [960, 540] });
  tl.set(icon.mark, { opacity: 0 }, flyT + flyD + F);
  const tFeed = at('f1', 'single') - 0.1;
  K.cascade(rows.map((r) => r.el), tFeed, { dx: 220, dy: -60, stagger: 2 * F, blur: 14 });
  acam.focus(feed, 1.3, at('f1', 'feed') + 0.15, { dur: 1.0, ay: 0.46, vx: 58, vy: 32, vs: 0.0176, sfx: true });
  acam.focus(rows[0].el, 1.85, at('f1b', 'Just') - 0.4, { dur: 0.9, ax: 0.48, ay: 1.1, vx: 50, vy: 25, vs: 0.0176, sfx: true });

  // f1b: unread dots pulse → open the top item → all caught up
  const f1b = L('f1b');
  tl.fromTo(rows.slice(0, 5).map((r) => r.dot), { scale: 1 }, { scale: 1.5, duration: 5 * F, yoyo: true, repeat: 1, stagger: 2 * F, ease: 'power2.out' }, at('f1b', 'hunting'));
  X.sfx(at('f1b', 'hunting'), 'tick', { gain: 0.12 });
  cur.jump(at('f1b', 'Just') - 0.55, [1700, 1020]).show(at('f1b', 'Just') - 0.5);
  const tOpen = at('f1b', 'open');
  cur.clickOn({ el: rows[0].el, cam: acam, ax: 0.42, ay: 0.55 }, tOpen, { dur: 0.6, hoverEl: rows[0].el, hoverTo: K.css('accentSoft') });
  const tCaught = at('f1b', 'caught');
  tl.to(rows.slice(0, 5).map((r) => r.dot), { scale: 0, opacity: 0, duration: 6 * F, stagger: 2 * F, ease: 'power2.in' }, tCaught - 0.15);
  toast1.show(tCaught, 1.55, { sfx: 'success' });
  cur.move(tCaught + 0.3, { el: rows[2].el, cam: acam, ax: 0.75, ay: 0.9 }, { dur: 0.7 });

  // ================================================================= 4. FEATURE 2 — Ask Kite (panel unfold T11, typed prompt, AI answer)
  const f2 = L('f2');
  acam.key(f2.start - 0.45, { x: 760, y: 470, s: 1.0, dur: 1.0, vx: -58, vy: 16, vs: 0.0176, sfx: true });
  const askRow = sb.rows['Ask Kite'];
  const tAsk = at('f2', 'Ask');
  cur.clickOn({ el: askRow, cam: acam, ax: 0.3 }, tAsk, { dur: 0.7, hoverEl: askRow, hoverFrom: K.css('surface2'), hoverTo: K.css('hover') });
  K.unfold(ask.el, tAsk + 0.08, { from: { rotationX: 70, scaleY: 0.14, y: 140, opacity: 0 }, to: { rotationX: 9, rotationY: -12, scaleY: 1, y: 0, opacity: 1 }, settle: 2.4, dur: 16 * F });
  const scrim = h('div', { style: { position: 'absolute', inset: 0, background: 'rgba(38,26,104,.30)', opacity: 0 } }, win.el);
  tl.fromTo(scrim, { opacity: 0 }, { opacity: 1, duration: 0.45, ease: 'power2.out' }, tAsk + 0.1);
  acam.key(tAsk + 0.12, { x: 1290, y: 500, s: 1.12, dur: 0.75, vx: 50, vy: 32, vs: 0.0176, sfx: true });
  K.headline(typeL, { title: 'Ask Kite', sub: 'Thread summaries in seconds', t: tAsk + 0.25, out: at('f2b', 'decisions') + 0.2, size: 52 });
  // prompt
  const f2b = L('f2b');
  const tIn = f2b.start - 0.45;
  cur.clickOn({ el: inBar, cam: acam, ax: 0.3 }, tIn, { dur: 0.6 });
  acam.focus(inBar, 1.45, tIn - 0.3, { dur: 0.9, dy: -230, vx: 58, vs: 0.0176, sfx: true });
  tl.to(greet, { opacity: 0, y: -20, duration: 8 * F, ease: 'power2.in' }, at('f2b', 'thread') + 0.1);
  sugg.forEach((c, i) => tl.fromTo(c, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 9 * F, ease: 'power3.out' }, tAsk + 0.55 + i * 3 * F));
  const prompt = 'Summarize the launch thread', cps = 26, tType = tIn + 0.15;
  tl.set(inPh, { autoAlpha: 0 }, tType);
  X.typeOn(inTyped, prompt, tType, cps);
  X.sfx(tType, 'type', { dur: prompt.length / cps, gain: 0.22 });
  const tSend = at('f2b', 'thread') + 0.1;
  cur.clickOn({ el: sendB, cam: acam }, tSend, { dur: 0.32, hover: 0.06, press: sendB });
  tl.set(inTyped, { autoAlpha: 0 }, tSend + 0.05); tl.set(inPh, { autoAlpha: 1 }, tSend + 0.05);
  tl.fromTo(ub.el, { opacity: 0, y: 26, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 10 * F, ease: 'expo.out', transformOrigin: '100% 100%' }, tSend + 0.06);
  X.sfx(tSend + 0.06, 'bubble', { gain: 0.2 });
  dots.run(tSend + 0.3, at('f2b', 'summary') - 0.25);
  acam.focus(ub.el, 1.4, tSend + 0.12, { dur: 0.7, ax: 0.2, ay: 0, dy: 300, vy: 74, vs: 0.0176, sfx: true });
  cur.hide(tSend + 0.7);
  // answer builds: container → structure → content (lands on the stressed nouns)
  const tAns = at('f2b', 'summary') - 0.22;
  gsap.set([ans, ansHead, summ, decLab, nxLab, mkBtn, ...decs.map((d) => d.r), ...steps.map((s) => s.r)], { opacity: 0 });
  tl.fromTo(ans, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 14 * F, ease: 'expo.out' }, tAns);
  const aH = ans.offsetHeight, cut = (el) => aH - (el.offsetTop + el.offsetHeight + 20);
  const clip = (px) => `inset(-30px -30px ${Math.max(0, px)}px -30px round 20px)`;
  gsap.set(ans, { clipPath: clip(cut(summ)) });
  tl.fromTo(ans, { clipPath: clip(cut(summ)) }, { clipPath: clip(cut(decs[1].r)), duration: 12 * F, ease: 'power3.out', immediateRender: false }, at('f2b', 'decisions') - 0.15);
  tl.fromTo(ans, { clipPath: clip(cut(decs[1].r)) }, { clipPath: clip(cut(steps[2].r)), duration: 14 * F, ease: 'power3.out', immediateRender: false }, at('f2b', 'next') - 0.15);
  X.sfx(tAns, 'blip_up', { gain: 0.16 });
  tl.fromTo([ansHead, summ], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 10 * F, ease: 'power3.out', stagger: 4 * F }, tAns + 0.1);
  acam.focus(ans, 1.5, tAns + 0.3, { dur: 1.2, ay: 0.12, vx: -36, vy: 101, vs: 0.0176 });
  const tDec = at('f2b', 'decisions');
  tl.fromTo([decLab, ...decs.map((d) => d.r)], { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 10 * F, ease: 'power3.out', stagger: 4 * F }, tDec - 0.1);
  decs.forEach((d, i) => K.pop(d.ic, tDec + 0.05 + i * 4 * F + 0.12, { sfx: 'tick', gain: 0.14 }));
  const tNext = at('f2b', 'next');
  tl.fromTo([nxLab, ...steps.map((s) => s.r)], { opacity: 0, x: 26 }, { opacity: 1, x: 0, duration: 10 * F, ease: 'power3.out', stagger: 4 * F }, tNext - 0.12);
  X.sfx(tNext - 0.1, 'swoosh', { dur: 0.35, gain: 0.12 });
  const tPull = at('f2b', 'pulled');
  tl.fromTo(steps.map((s) => s.bar), { scaleY: 0 }, { scaleY: 1, duration: 8 * F, ease: 'power3.out', stagger: 3 * F }, tPull);
  tl.fromTo(steps.map((s) => s.r), { backgroundColor: K.css('surface2') }, { backgroundColor: K.css('accentSoft'), duration: 8 * F, stagger: 3 * F }, tPull);
  X.sfx(tPull, 'blip_up', { gain: 0.12, pitch: 1.2 });

  // ================================================================= 5. FEATURE 3 — one-click tasks (fly to board T14, sync)
  const f3 = L('f3');
  K.pop(mkBtn, at('f3', 'next') - 0.1, { from: 0.6, ease: 'back.out(1.8)', gain: 0.18 });
  tl.fromTo(ans, { clipPath: clip(cut(steps[2].r)) }, { clipPath: clip(-40), duration: 10 * F, ease: 'power3.out', immediateRender: false }, at('f3', 'next') - 0.2);
  acam.focus(steps[1].r, 1.7, f3.start - 0.35, { dur: 1.1, dy: 40, vx: -50, vy: 25, vs: 0.0176, sfx: true });
  K.headline(typeL, { title: 'One-click tasks', sub: 'Owners and due dates, set for you', t: f3.start - 0.05, out: at('f3b', 'Kitewise') - 0.2, size: 52 });
  const tClick = at('f3', 'click') - 0.06;
  cur.jump(at('f3', 'tasks') - 0.8, [1720, 1040]).show(at('f3', 'tasks') - 0.75);
  cur.clickOn({ el: mkBtn, cam: acam, ax: 0.55 }, tClick, { dur: 0.65, press: mkBtn });
  X.tl.fromTo(mkBtn, { boxShadow: '0 8px 22px rgba(52,36,140,.10)' }, { boxShadow: '0 10px 34px rgba(91,61,245,.45)', duration: 6 * F, yoyo: true, repeat: 1 }, tClick - 0.3);
  // the panel leaves, the main pane swaps to the board, cards fly in
  const tSw = tClick + 0.1;
  tl.to(ask.el, { x: 160, opacity: 0, duration: 0.3, ease: 'power2.in' }, tSw);
  tl.to(scrim, { opacity: 0, duration: 0.4 }, tSw);
  K.swap(feed, board, tSw + 0.12, { drift: 34 });
  X.sfx(tSw + 0.12, 'slide', { gain: 0.2 });
  const inbox = sb.rows['Inbox'], brow = sb.rows['Board'];
  tl.set(inbox, { backgroundColor: 'rgba(0,0,0,0)', boxShadow: 'none', color: K.css('muted'), fontWeight: 500 }, tSw + 0.12);
  tl.set(brow, { backgroundColor: K.css('surface'), boxShadow: '0 1px 3px ' + K.css('shadowS'), color: K.css('text'), fontWeight: 650 }, tSw + 0.12);
  acam.key(tSw, { x: 930, y: 470, s: 0.95, dur: 0.8, vx: 58, vy: 25, vs: 0.0176, sfx: 'whoosh' });
  cur.move(tSw + 0.25, [1500, 1000], { dur: 0.6 }).hide(tSw + 0.7);
  const fly = [['Lock launch date', 'Thu', 11], ['Send press kit', 'Fri', 23], ['Prep demo script', 'Mon', 9]].map(([t, d, av], i) => {
    const sR = K.rect(steps[i].r), eR = K.rect(slots[i]);
    const holder = h('div', { style: { position: 'absolute', left: eR.x, top: eR.y, width: eR.w, zIndex: 5 } }, aw);
    const c = taskCard(holder, { title: t, date: d, av, tone: 'soft' });
    const ox = sR.x - eR.x, oy = sR.y - eR.y;
    const ti = tSw + 0.18 + i * 0.13;
    tl.fromTo(holder, { x: ox, y: oy, opacity: 0, scale: sR.w / eR.w }, { opacity: 1, duration: 3 * F }, ti);
    tl.fromTo(holder, { x: ox, y: oy, scale: sR.w / eR.w, transformOrigin: '0% 0%' }, { x: 0, y: -26, scale: 1, duration: 0.55, ease: 'power3.inOut', immediateRender: false }, ti);
    tl.to(holder, { y: 0, duration: 7 * F, ease: 'expo.out' }, ti + 0.55);
    X.sfx(ti + 0.55, 'drop', { gain: 0.22 });
    gsap.set([c.av, c.date], { opacity: 0 });
    return { holder, c, ti };
  });
  X.countUp(cTodo.n, 0, 0, 0, 0.01);
  fly.forEach((f, i) => X.countUp(cTodo.n, i, i + 1, f.ti + 0.55, 0.01));
  // f3b: owners, dates, board sync
  acam.focus(cTodo.c, 1.5, at('f3b', 'Kitewise') - 0.2, { dur: 1.0, ay: 0.3, vx: 32, vy: 58, vs: 0.0176, sfx: true });
  const tOwn = at('f3b', 'owners');
  fly.forEach((f, i) => K.pop(f.c.av, tOwn + i * 4 * F, { gain: 0.16, pitch: 1 + i * 0.1 }));
  const tDate = at('f3b', 'dates') - 0.1;
  fly.forEach((f, i) => { tl.fromTo(f.c.date, { opacity: 0, x: -14 }, { opacity: 1, x: 0, duration: 8 * F, ease: 'power3.out' }, tDate + i * 4 * F); K.decode(f.c.date.querySelector('span'), ['Thu', 'Fri', 'Mon'][i], tDate + i * 4 * F, { dur: 0.3, sfx: i === 0 }); });
  // sync: card 1 glides from To do → In progress on its own
  const tSync = at('f3b', 'board') - 0.1;
  acam.key(tSync - 0.45, { x: 1010, y: 400, s: 1.28, dur: 1.0, vx: 67, vs: 0.0176, sfx: true });
  const pR = K.rect(prog[0].el), f0 = K.rect(fly[0].holder);
  const dx = pR.x - f0.x, dy = pR.y - f0.y;
  tl.to(fly[0].holder, { scale: 1.05, rotation: 2.5, duration: 6 * F, ease: 'power2.out' }, tSync);
  tl.fromTo(fly[0].c.el, { boxShadow: '0 1px 2px rgba(52,36,140,.06), 0 8px 20px rgba(52,36,140,.10)' }, { boxShadow: '0 4px 8px rgba(52,36,140,.08), 0 30px 60px rgba(52,36,140,.22)', duration: 6 * F, yoyo: true, repeat: 1, repeatDelay: 0.5 }, tSync);
  tl.to(prog.map((p) => p.el), { y: 130, duration: 0.45, ease: 'power3.inOut', stagger: 2 * F }, tSync + 0.12);
  tl.to(fly[0].holder, { x: dx, y: dy, duration: 0.6, ease: 'power3.inOut' }, tSync + 0.12);
  tl.to(fly[0].holder, { scale: 1, rotation: 0, duration: 8 * F, ease: 'expo.out' }, tSync + 0.7);
  tl.to(fly.slice(1).map((f) => f.holder), { y: -130, duration: 0.45, ease: 'power3.inOut', stagger: 2 * F }, tSync + 0.35);
  X.sfx(tSync + 0.1, 'swoosh', { dur: 0.5, gain: 0.18 }); X.sfx(tSync + 0.72, 'drop', { gain: 0.2 });
  X.countUp(cTodo.n, 3, 2, tSync + 0.7, 0.01); X.countUp(cProg.n, 2, 3, tSync + 0.7, 0.01);
  toast2.show(at('f3b', 'own', 1) - 0.15, 1.6);

  // ================================================================= 6. OUTCOME — zoom out, kinetic statement, the team
  acam.key(tOut - 0.15, { x: 860, y: 470, s: 0.42, dur: 0.95, ease: 'power2.inOut', sfx: 'whoosh' });
  tl.to(app, { opacity: 0, duration: 0.55, ease: 'power2.in' }, tOut + 0.15);
  const ow = K.world(outL);
  const ocam = K.camera(ow, { x: 960, y: 540, s: 1 });
  ocam.key(tOut, { x: 900, y: 440, s: 1.26, dur: F }).key(tOut + 0.05, { x: 960, y: 520, s: 1.0, dur: 2.6, ease: 'sine.inOut', vx: 26, vs: 0.02 });
  ocam.key(at('outcome', 'And') - 0.2, { x: 1000, y: 580, s: 0.96, dur: 1.4, ease: 'sine.inOut', vx: -30, vy: 10, vs: 0.026 });
  bg.washTo(tOut + 0.1, 1, 0.9);
  bg.washTo(tMatte2 + 0.5, 0.45, 1.2);
  const oL = L('outcome');
  const W1 = oL.words.slice(0, 2), W2 = oL.words.slice(2, 5);
  const ln1 = K.kinetic(ow, { words: W1.map((w) => w.w), times: W1.map((w) => w.start - 2 * F), size: 84, y: 400, color: '#6C6889', weight: 600 });
  const ln2 = K.kinetic(ow, { words: W2.map((w) => w.w), times: W2.map((w) => w.start - 2 * F), key: [1, 2], keyScale: 1.25, size: 84, y: 530 });
  const tTeam = at('outcome', 'And');
  tl.to([ln1.el, ln2.el], { y: '-=120', duration: 0.6, ease: 'power2.inOut' }, tTeam - 0.1);
  const team = K.avatarStack(ow, [11, 23, 9, 6, 31], { size: 104, overlap: 22, x: 0, y: 556 });
  team.el.style.left = (960 - team.el.offsetWidth / 2) + 'px';
  team.items.forEach((a, i) => K.pop(a, at('outcome', 'team') - 0.05 + i * 3 * F, { gain: 0.14, pitch: 0.9 + i * 0.08 }));
  const nextChip = K.glass(ow, { x: 960 - 260, y: 700, w: 520, h: 84, r: 24 });
  nextChip.body.style.cssText += ';display:flex;align-items:center;gap:16px;padding:0 22px;background:var(--surface)';
  K.glyph(nextChip.body, 'calendar', { size: 48, tone: 5 });
  const nc = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '2px' } }, nextChip.body);
  h('div', { text: 'Up next · Launch review', cls: 'k-t1', style: { fontSize: 21 } }, nc);
  h('div', { text: 'Thursday, 2:00 PM · everyone has the brief', cls: 'k-t2', style: { fontSize: 16 } }, nc);
  K.rise(nextChip.el, at('outcome', 'next') - 0.25, { y: 26, sfx: 'notif', gain: 0.2 });

  // ================================================================= 7. CTA — logo-matte bookend, lock-up, clicked pill, URL
  const cy2 = 470;
  const m2 = K.logoMatte(fx, { t: tMatte2, at: [960, cy2], size: markSize, scale: 5.2, hide: outL, dir: [-1, 0.62] });
  const wm2 = K.wordmark(logoL, { text: 'kitewise', size: 150, x: lockX + markW / 2 + gapL, y: cy2 - 98 });
  gsap.set(wm2.letters, { opacity: 0 });
  const tW2 = at('cta', 'Kitewise') + 0.12;
  m2.move(tW2, { at: [lockX, cy2], dur: 0.55, ease: 'power3.inOut' });
  K.glint(logoL, { t: m2.tLand + 0.02, x: 960 + 34, y: cy2 - 62, size: 110 });
  tl.fromTo(wm2.letters, { opacity: 0, x: -36 }, { opacity: 1, x: 0, duration: 10 * F, ease: 'power3.out', stagger: 2 * F }, tW2 + 0.4);
  const cL = L('cta');
  const tagW = cL.words.slice(1, 6);
  K.kinetic(logoL, { words: tagW.map((w) => w.w), times: tagW.map((w) => w.start - 2 * F), key: [3, 4], keyScale: 1, size: 46, weight: 500, y: cy2 + 132, color: 'var(--muted)', sfx: false });
  const ctaWrap = h('div', { style: { position: 'absolute', left: 0, width: 1920, top: cy2 + 214, display: 'flex', justifyContent: 'center' } }, logoL);
  const ctaBox = h('div', { style: { position: 'relative' } }, ctaWrap);
  h('div', { cls: 'k-under', style: { opacity: 0.6, bottom: '-16px' } }, ctaBox);
  const pill = K.btn(ctaBox, { label: 'Try it free', icon: 'arrow', kind: 'primary', size: 36, style: { position: 'relative', flexDirection: 'row-reverse' } });
  K.pop(ctaBox, at('cta', 'Try') - 0.05, { ease: 'back.out(1.8)', gain: 0.22 });
  const url = h('div', { text: 'kitewise.app', style: { position: 'absolute', left: 0, width: 1920, top: cy2 + 368, textAlign: 'center', fontSize: 36, fontWeight: 650, color: 'var(--accent)', letterSpacing: '-0.01em' } }, logoL);
  tl.fromTo(url, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 12 * F, ease: 'power3.out' }, at('cta', 'kitewise', 1) - 0.05);
  const tCta = at('cta', 'free') + 0.25, pr = { x: 960 + 60, y: cy2 + 214 + 50 };
  cur.jump(tCta - 1.3, [1660, 1070]).show(tCta - 1.1);
  cur.clickOn([pr.x, pr.y], tCta, { dur: 0.75, press: pill, gain: 0.55 });
  cur.move(at('cta', 'app') + 0.35, [1180, 960], { dur: 0.8 }).hide(at('cta', 'app') + 1.1);

  X.end(X.vo.duration);
});
