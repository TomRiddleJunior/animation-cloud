/* Launch-promo template — 17.6 s, 10 bars at 140 BPM, music-led (no VO). Replace the copy, brand and UI; keep the beat grid.
 *   b0–8   tease: two slams + one chroma-split impact word          (energy 1 → 2 at b8, riser into the drop)
 *   b16    DROP: flash + shock + logo build (mark + wordmark, orb as the 'o')   (energy 3)
 *   b22    zoom-through from the orb → ember field → HUD-bracket feature headline
 *   b26    dark glass UI tilts in, camera hops on the beat, cursor click, counter roll
 *   b32    end card: mark + wordmark decode, tagline (b32–b40, energy 0 + end hit)
 * Every time is K.b(beat). Build order does not matter; the timeline is seekable. */
X.boot(async (X) => {
  await X.loadVO();
  const K = LP.init(X, { bpm: 140 });
  const { P, F, b, env } = K;
  const tl = X.tl;
  const END = K.bar(10) + 0.5;
  const BRAND = 'orbly';                       // fictional name; the first 'o' becomes the hero orb

  // ---------------------------------------------------------------- tease (b0–b16)
  gsap.set(env, { glow: 0.15, rings: 0.35, arcs: 0, arcGap: 160 });
  K.envTo({ arcs: 0, arcGap: 160, glow: 0.15 }, { arcs: 1, arcGap: 0, glow: 0.5 }, 0.04, b(2), 'power2.out');
  K.slam([['3', P.gold], [' TOOLS.', P.text]], b(1), { size: 230, hold: b(3) - F(7), out: 'blur' });
  K.slam([['0', P.gold], [' FOCUS.', P.text]], b(4), { size: 230, hold: b(3) - F(7), out: 'blur', dx: -110 });
  K.rgbSlam([['SOUND ', P.text], ['FAMILIAR?', P.gold]], b(8), { size: 170, hold: b(5.2) });
  const orb = K.orb(K.cam, { x: 960, y: 540, r: 30 });
  K.span(orb.g, b(13.5), b(16));
  gsap.set(orb.g, { scale: 0, transformOrigin: '50% 50%' });
  tl.fromTo(orb.g, { scale: 0 }, { scale: 2.2, duration: b(2), ease: 'power2.in', immediateRender: false }, b(13.5));
  tl.to(orb.g, { scale: 0.1, duration: F(4), ease: 'power3.in' }, b(15.5));
  K.envTo({ speed: 0, speedDir: -1, ringOff: 0 }, { speed: 1.1, ringOff: -600 }, b(13.5), b(2), 'power2.in');
  tl.set(env, { speed: 0 }, b(15.5));
  X.sfx(b(13.5), 'riser', { dur: b(2.5), gain: 0.4 });

  // ---------------------------------------------------------------- DROP + brand reveal (b16)
  const D = b(16);
  K.flash(D, { peak: 0.85 });
  K.shock(D, 960, 540, { r1: 1500, width: 14 });
  K.burst(K.fx, 960, 540, D, { n: 60 });
  K.envTo({ glow: 1.4, arcs: 1.6, arcGap: -60, speed: 1.2, speedDir: 1 }, { glow: 0.55, arcs: 0.9, arcGap: 0, speed: 0.08 }, D, b(4), 'power2.out');
  X.sfx(D, 'impact', { dur: 1.4, gain: 0.6, pitch: 0.7 });
  const lockO = X.svg('g', {}, K.type), lock = X.svg('g', {}, lockO);
  const wmW = K.measure(BRAND, 190, 'Space Grotesk', 700, -190 * 0.03), L0 = 960 - (200 + 52 + wmW) / 2;
  const mk = K.mark(lock, { x: L0 + 100, y: 532, s: 200 });
  K.markBuild(mk, D);
  const wm = K.wordmark(lock, { x: L0 + 252, y: 584, size: 190, text: BRAND });
  K.decode(wm.cs, D + b(1), { perChar: 2 });
  tl.fromTo(wm.orb.g, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(2.6)', immediateRender: false }, b(18));
  gsap.set(lock, { svgOrigin: '960 540' });
  tl.fromTo(lock, { scale: 1.3 }, { scale: 1, duration: b(4), ease: 'expo.out', immediateRender: false }, D);
  K.bounce(lockO, K.hits(D + b(1.5), b(21.5)), { origin: '960 540' });
  const orbAt = K.screenPos(wm.orb.core, b(22));          // call AFTER every tween that moves the orb
  const z = K.zoomThrough(b(22), { x: orbAt.x, y: orbAt.y, r0: orbAt.w / 2, open: false });
  K.span(lockO, D, z.tCover);

  // ---------------------------------------------------------------- feature: field card + HUD headline, then UI (b22–b32)
  const fd = K.field(z.tCover, b(26) + F(16));
  tl.to(fd.g, { opacity: 0, duration: F(14), ease: 'power1.inOut' }, b(26));
  K.hud('Sorted in *one click*', b(23), { label: '01 — SORT', size: 124, hold: b(25.8) - b(23) - F(29), on: 'field' });
  const p = K.panel({ x: 260, y: 200, w: 1400, h: 680, title: `${BRAND} · Board`, search: 'Filter' });
  K.span(p.el, b(26), END);
  K.tiltIn(p.el, b(26));
  const count = X.html('div', { style: { position: 'absolute', left: '40px', top: '26px', fontSize: '40px', fontWeight: 800 }, text: '128' }, p.body);
  X.countUp(count, 128, 0, b(28.5), b(3), (v) => String(Math.round(v)), 'power2.inOut');
  const btn = X.html('div', { class: 'lp-btn', style: { right: '40px', top: '20px', width: '170px', height: '54px', fontSize: '22px' }, html: K.icon('spark', 22, P.pillInk) + '<span>Sort</span>' }, p.body);
  for (let i = 0; i < 6; i++) {
    const c = X.html('div', { class: 'lp-card', style: { left: '0px', top: '0px', width: '400px', height: '92px' }, html: `<div style="font-size:21px;font-weight:650">Task ${i + 1}</div>` }, p.body);
    const from = { x: 380 + (i * 97) % 520, y: 160 + (i * 61) % 260, rotation: (i % 2 ? 1 : -1) * (6 + i * 2) };
    gsap.set(c, from);
    tl.fromTo(c, { ...from }, { x: 40 + (i % 3) * 460, y: 130 + Math.floor(i / 3) * 110, rotation: 0, duration: F(8), ease: 'back.out(1.3)', immediateRender: false }, b(28.5) + i * b(0.5));
    X.sfx(b(28.5) + i * b(0.5) + F(5), 'tick', { gain: 0.3, pitch: 0.9 + i * 0.05 });
  }
  K.hop(p.el, b(27), { scale: 1.2, x: -170, y: 110 }, 12);                 // push to the button
  K.hop(p.el, b(28.5), { scale: 1, x: 0, y: 0, rotationY: -6, rotationX: 5 }, 22, 'power2.inOut');
  const cur = K.cursor(K.fx);
  K.span(cur.g, b(26.6), b(30));
  gsap.set(cur.g, { x: 1800, y: 1120 });
  const bp = K.screenPos(btn, b(28));
  K.cursorTo(cur, bp.x - 10, bp.y - 6, b(26.8), b(1.2));
  K.click(cur, b(28), bp.x - 4, bp.y);
  K.cursorTo(cur, 1950, 1150, b(29), b(1));
  K.sweep(b(31.6), { frames: 8 });
  tl.to(p.el, { opacity: 0, duration: F(8) }, b(31.6));

  // ---------------------------------------------------------------- end card (b32–end)
  const E = b(32);
  K.envTo({ spot: 0, glow: 0.5, arcs: 0.8 }, { spot: 1, glow: 0.35, arcs: 0.5 }, E - F(3), 1.2, 'power2.out');
  K.envTo({ spotX: 700 }, { spotX: 1220 }, E, END - E, 'sine.inOut');
  const endG = X.svg('g', {}, K.type);
  K.span(endG, E, END + 1);
  const mk2 = K.mark(endG, { x: L0 + 100, y: 430, s: 200 });
  K.markBuild(mk2, E);
  const wm2 = K.wordmark(endG, { x: L0 + 252, y: 482, size: 190, text: BRAND });
  K.decode(wm2.cs, E + b(0.5), { perChar: 2, seed: 9 });
  tl.fromTo(wm2.orb.g, { scale: 0 }, { scale: 1, duration: F(8), ease: 'back.out(2.6)', immediateRender: false }, E + b(1.5));
  const tag = K.chars(endG, 'Less chasing. *More shipping.*', { x: 960, y: 620, size: 54, font: 'Space Grotesk', weight: 500, fill: P.cream });
  K.decode(tag, E + b(2), { seed: 2 });

  K.pulseBars(0, 4, [0, 2.75], 40);                 // ring field + light pump on the 808
  K.pulseBars(4, 6, [0, 0.75, 2, 2.5], 56);         // drop: kicks + clap
  K.pulseBars(6, 8, [0, 0.75, 2.5], 34);            // under the UI
  X.end(END);
});
