/* saas-ui starter — a 15-second runnable demo of the style's five defining moves:
 *   kinetic hook → logo-matte name reveal (T6) → app window + cascade list (T2) + camera focus (T4) + cursor click
 *   + toast → logo-matte end card with a clicked CTA pill and URL.
 * Replace the brand, the copy in script.json and the UI rows; keep the grammar (one UI moment per VO clause,
 * moves land 2 frames before the stressed word, camera never fully stops, ≤ 4.5 % saturated pixels). */
X.boot(async (X) => {
  await X.loadVO();
  K.skin('glow');                                  // 'glow' (A2 Gradient AI) · 'calm' (A1 Notion-like) · 'dark' (A3 Elevate-like)
  const F = K.F, at = K.at, tl = X.tl, h = K.h, L = (id) => X.line(id);
  const bg = K.background({ breathe: 0.12, drift: 60 });
  const BRAND = 'fieldnote', URL = 'fieldnote.app';

  const tMatte1 = L('name').start - 0.75, tApp = at('name', 'calm') + 0.1, tMatte2 = L('cta').start - 0.55;
  const hook = K.layer('hook', 0, null, { z: 10 });
  const app = K.layer('app', tApp - 0.05, tMatte2 + 0.7, { z: 11 });
  const typeL = K.layer('type', 0, null, { z: 20 });
  const fx = K.layer('fx', 0, null, { z: 25 });
  const logoL = K.layer('logo', 0, null, { z: 27 });
  const cur = K.cursor();

  // 1 · hook: word-synced kinetic line, key word in the accent at 1.6×, slow push
  const hw = K.world(hook);
  K.camera(hw, { x: 960, y: 540, s: 1, vx: 14, vs: 0.02 });
  const hl = L('hook');
  K.kinetic(hw, { words: hl.words.map((w) => w.w), times: hl.words.map((w) => w.start - 2 * F), key: [3], size: 84, y: 520 });

  // 2 · name reveal: logo-matte zoom swallows the hook, mark slides left, wordmark letters stagger in
  const markSize = 150, wm = K.wordmark(logoL, { text: BRAND, size: 132, x: 0, y: 0 });
  const markW = markSize * (172 / 196), gap = 34, lockX = 960 - (markW + gap + wm.el.offsetWidth) / 2 + markW / 2;
  Object.assign(wm.el.style, { left: lockX + markW / 2 + gap + 'px', top: 540 - 86 + 'px' });
  gsap.set(wm.letters, { opacity: 0 });
  const m1 = K.logoMatte(fx, { t: tMatte1, at: [960, 540], size: markSize, scale: 7, hide: hook });
  const tW = at('name', 'Fieldnote') + 0.1;
  m1.move(tW, { at: [lockX, 540], dur: 0.5 });
  tl.fromTo(wm.letters, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 10 * F, ease: 'power3.out', stagger: 2 * F }, tW + 0.35);
  K.glint(logoL, { t: m1.tLand, x: 990, y: 486, size: 100 });
  tl.to(wm.letters, { opacity: 0, duration: 6 * F, stagger: { each: F, from: 'end' } }, tApp - 0.35);
  m1.move(tApp - 0.3, { at: [960, 380], size: 0.01, dur: 0.45, ease: 'power2.in' }).hideAt(tApp + 0.2);

  // 3 · the product: window rises, list cascades, camera pushes in, cursor clicks, toast confirms
  const aw = K.world(app);
  const cam = K.camera(aw, { x: 800, y: 480, s: 0.84 });
  cam.key(tApp, { s: 0.84, dur: F, vx: 20, vs: 0.02 });
  const win = K.win(aw, { w: 1600, h: 960, search: 'Search or ask…' });
  K.rise(win.wrap, tApp, { y: 90, scale: 0.92, dur: 0.6, ease: 'power3.out' });
  K.sidebar(win.body, { brand: BRAND, items: [{ icon: 'home', label: 'Home' }, { icon: 'inbox', label: 'Inbox', badge: '5', active: true }, { icon: 'sparkle', label: 'Ask AI', tone: 1 }, { icon: 'board', label: 'Board' }] });
  const main = h('div', { style: { position: 'absolute', left: 280, top: 0, right: 0, bottom: 0, padding: '34px 44px' } }, win.body);
  h('div', { text: 'Today', style: { fontSize: 36, fontWeight: 700, marginBottom: '20px' } }, main);
  const list = h('div', { style: { display: 'flex', flexDirection: 'column', borderRadius: 18, border: '1px solid var(--line)', overflow: 'hidden' } }, main);
  const rows = [['chat', 1, 'Ana in #design', 'New hero options are up', 11, '9:41'], ['doc', 2, 'Q3 plan', 'Two comments need you', 23, '9:20'],
    ['check', 4, 'Ship onboarding v2', 'Due Friday', 9, '9:02'], ['mail', 3, 'Partner intro', 'From the sales team', 31, '8:40'], ['calendar', 5, 'Weekly sync', 'Thursday, 10:00 AM', 6, '8:15']]
    .map(([g, tn, ti, su, av, tm], i) => K.row(list, { glyph: g, tone: tn, title: ti, sub: su, avatar: av, time: tm, unread: i < 3, h: 92, divider: i < 4 }));
  K.cascade(rows.map((r) => r.el), tApp + 0.35);
  cam.focus(rows[0].el, 1.5, at('demo', 'Open') - 0.5, { dur: 0.9, ax: 0.42, ay: 1.5, vx: 14, vs: 0.012, sfx: true });
  cur.jump(at('demo', 'Open') - 0.6, [1700, 1040]).show(at('demo', 'Open') - 0.55);
  const tClick = at('demo', 'click');
  cur.clickOn({ el: rows[0].el, cam, ax: 0.4 }, tClick, { dur: 0.6, hoverEl: rows[0].el, hoverTo: K.css('accentSoft') });
  tl.to(rows.slice(0, 3).map((r) => r.dot), { scale: 0, opacity: 0, duration: 6 * F, stagger: 2 * F, ease: 'power2.in' }, at('demo', 'caught') - 0.15);
  const r0 = K.rect(rows[0].el);
  K.toast(aw, { title: "You're all caught up", sub: '5 updates read', x: r0.x + r0.w * 0.5, y: r0.y - 76, w: 400 }).show(at('demo', 'caught'), 1.4, { sfx: 'success' });
  cur.move(at('demo', 'up') + 0.3, [1500, 1000], { dur: 0.6 }).hide(at('demo', 'up') + 0.8);
  K.headline(typeL, { title: 'One calm feed', sub: 'Every tool, one place', t: tApp + 0.6, out: tMatte2 - 0.3, size: 50 });

  // 4 · end card: the same logo-matte (bookend), lock-up, CTA pill clicked by the cursor, URL in the accent
  const cy = 470, m2 = K.logoMatte(fx, { t: tMatte2, at: [960, cy], size: markSize, scale: 7, hide: app, dir: [-1, 0.62] });
  const wm2 = K.wordmark(logoL, { text: BRAND, size: 132, x: lockX + markW / 2 + gap, y: cy - 86 });
  gsap.set(wm2.letters, { opacity: 0 });
  const tW2 = at('cta', 'Fieldnote') + 0.1;
  m2.move(tW2, { at: [lockX, cy], dur: 0.5 });
  tl.fromTo(wm2.letters, { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 10 * F, ease: 'power3.out', stagger: 2 * F }, tW2 + 0.35);
  const ctaRow = h('div', { style: { position: 'absolute', left: 0, width: 1920, top: cy + 130, display: 'flex', justifyContent: 'center' } }, logoL);
  const ctaBox = h('div', { style: { position: 'relative' } }, ctaRow);
  h('div', { cls: 'k-under', style: { opacity: 0.6 } }, ctaBox);
  const pill = K.btn(ctaBox, { label: 'Try it free', icon: 'arrow', size: 34, style: { position: 'relative', flexDirection: 'row-reverse' } });
  K.pop(ctaBox, at('cta', 'Try') - 0.05, { ease: 'back.out(1.8)' });
  const url = h('div', { text: URL, style: { position: 'absolute', left: 0, width: 1920, top: cy + 250, textAlign: 'center', fontSize: 34, fontWeight: 650, color: 'var(--accent)' } }, logoL);
  tl.fromTo(url, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 12 * F }, at('cta', 'fieldnote', 1) - 0.05);
  const tCta = at('cta', 'free') + 0.2;
  cur.jump(tCta - 1.2, [1660, 1070]).show(tCta - 1.0).clickOn([1010, cy + 170], tCta, { dur: 0.7, press: pill });
  cur.move(tCta + 0.6, [1300, 1000], { dur: 0.8 }).hide(tCta + 1.2);
  bg.washTo(tMatte2 + 0.4, 0.5, 1.0);
  K.zoomDrift([fx, logoL], [[m1.tLand, 1], [tApp - 0.3, 1.06], [tApp, 1], [tMatte2 + 0.6, 1], [X.vo.duration, 1.06]]);

  X.end(X.vo.duration);
});
