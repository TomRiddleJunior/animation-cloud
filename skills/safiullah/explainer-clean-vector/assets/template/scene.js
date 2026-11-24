/* clean-vector starter: confetti space → pill lands → hub splits open (T1) → card blows up into a colour world (T2)
 * with a primitive morph → world folds back (T3) → hub closes to a dot (T5) → logo mark + wordmark.
 * Render: engine/make.sh <this folder> --fps 24 --workers 3      (24 fps is the style's native rate; K.F(n) = n frames)
 * Replace the brand, the cards, the worlds and the script; keep the grammar.
 */
X.boot(async (X) => {
  await X.loadVO();
  const P = K.P, C = K.PAL, F = K.F, tl = X.tl;
  const w = (id, word, n = 0) => X.word(id, word, n), line = (id) => X.line(id);

  // layers, back → front
  const Lconf = X.svg('g'), Lback = X.svg('g'), Lhub = X.svg('g'), Lfront = X.svg('g'), Lworld = X.svg('g'), Lfx = X.svg('g'), Lui = X.svg('g');

  // confetti: two side bands floating up (never behind the hub) + a dense "space" field for the opening
  K.confetti(Lconf, { n: 12, seed: 4, amp: 1.5, bounds: { x: 50, y: 20, w: 620, h: 1040 }, wrapPad: 0, stream: { vx: 0, vy: -30 } });
  K.confetti(Lconf, { n: 12, seed: 5, amp: 1.5, bounds: { x: 1250, y: 20, w: 620, h: 1040 }, wrapPad: 0, stream: { vx: 0, vy: -36 } });
  const space = K.confetti(Lconf, { n: 40, seed: 9, scale: 1.3, stream: { vx: -70, vy: 20 } });
  K.flyby(Lback, 0.3, 'M-90,300 C300,130 700,110 1000,60 S1600,80 2010,200', { dur: 3.2, sfx: 'woosh_low' });

  // the hub: closed pill state, cards in the feed (block colour = the world it opens into)
  const H = K.hub(Lhub, {});
  H.closed();
  gsap.set([H.top, H.bot], { autoAlpha: 0 });
  gsap.set(H.cable, { attr: { y1: H.cy + H.capH }, opacity: 0 });
  gsap.set(H.plug, { opacity: 0, y: -H.shift });
  const plus = (g, x, y) => { X.svg('circle', { cx: x, cy: y, r: 25, fill: '#fff' }, g); K.line(g, `M${x - 10},${y}H${x + 10}M${x},${y - 10}V${y + 10}`, C.hub, 5); };
  const heart = (g, x, y) => K.shape(g, P.heart(x, y + 4, 56), '#fff');
  const sun = (g, x, y) => X.svg('circle', { cx: x, cy: y, r: 26, fill: C.sun }, g);
  H.addCard({ color: C.hubLight, avatar: C.hub, motif: plus });
  H.addCard({ color: C.mint, avatar: C.coral, motif: heart });
  H.addCard({ color: C.sky, avatar: C.sun, motif: sun });

  // 1. hook: an object acts in the confetti space (here a heart that hops)
  const hook = K.shape(Lfront, P.heart(960, 440, 200), C.coral);
  K.popIn(hook, 0.25, { rot: -30, sfx: 'bubble' });
  K.hop(hook, w('hook', 'better') - F(3), { h: 70 });
  K.burst(Lfx, 960, 440, w('hook', 'share'), { n: 20, r0: 140, r1: 300 });

  // 2. name: the heart morphs into the hub pill, which lands with a squash, the cable draws, the hub splits open
  const tName = w('name', 'made');
  K.popOut(hook, tName - F(10), { dur: F(6) });
  tl.set(H.sil, { morphSVG: P.heart(960, 440, 200) }, 0);
  const tLand = K.land(H.sil, tName - F(10), { dy: -40, fall: F(4), sfx: false });
  K.morph(H.sil, H.pillD, tName - F(10), F(6));
  X.sfx(tLand, 'boing', { gain: 0.3 });
  space.out(tLand, F(12));
  tl.set([H.cable, H.plug], { opacity: 1 }, tLand + F(2));
  K.draw(H.cable, tLand + F(2), F(6), 'power2.out');
  H.splitOpen(w('name', 'hubbly') - F(2), { cards: 3 });

  // 3. card → world: scroll to the card, blow it up, build the world icon from a primitive
  const tCard = w('card', 'card');
  H.focus(1, tCard - F(12), F(8));
  const W = K.world(Lworld, C.mint, { seed: 31 });
  const tBlow = H.blowUp(W, tCard - F(4));
  {
    const c = W.content;
    const obj = K.shape(c, P.circle(960, 540, 20), '#fff');
    K.popIn(obj, tBlow, { gain: 0.25 });
    K.morph(obj, P.pill(960, 540, 120, 40), w('card', 'opens'), F(6));
    K.morph(obj, P.heart(960, 540, 300), w('card', 'world') - F(6), F(8));
    K.squash(obj, w('card', 'world') + F(2), { sx: 1.18, sy: 0.84, origin: '50% 50%' });
    K.burst(Lfx, 960, 540, w('card', 'world') + F(2), { n: 22, r0: 160, r1: 380, colors: ['#fff', '#fff', C.sun, C.coral] });
  }
  // 4. fold back into the hub
  H.collapse(W, w('back', 'folds') - F(4));

  // 5. resolve: the hub closes like a mouth, shrinks to a dot, the dot becomes the mark; wordmark bounces in
  const tLogo = w('logo', 'hubbly');
  const dot = H.closeToDot(tLogo - F(10));
  const mk = K.mark(Lui, 960, 420, 110);
  gsap.set(mk.g, { svgOrigin: '960 420', scale: 0 });
  tl.set(H.sil, { autoAlpha: 0 }, dot.t);
  tl.fromTo(mk.g, { scale: 0.2 }, { scale: 1, duration: F(12), ease: 'back.out(1.7)', immediateRender: false }, dot.t);
  tl.from(mk.stamp, { rotation: -60, scale: 0, duration: F(12), ease: 'back.out(1.8)', svgOrigin: '960 420', immediateRender: false }, dot.t + F(4));
  X.sfx(dot.t, 'chime', { dur: 0.8, gain: 0.3 });
  K.rings(Lfx, 960, 420, dot.t + F(2), { radii: [146, 182], colors: [C.teal, C.coral], sfx: false });
  K.wordmark(Lui, 960, 670, 'hubbly', dot.t + F(8), { size: 116 });
  const tag = K.text(Lui, 960, 742, 'Try it today.', { size: 40, family: 'Nunito', color: C.greyText });
  gsap.set(tag, { opacity: 0 });
  tl.to(tag, { opacity: 1, duration: F(10) }, dot.t + F(20));

  X.end(X.vo.duration);
});
