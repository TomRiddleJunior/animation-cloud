// Line-essay starter (vertical 1080×1920, ~15 s): hand line vs machine line → zoom back into the hand line → person → pill.
// Replace script.json, keep the beat grammar: pen draws the human thing live, a mechanism draws the machine thing,
// tiny mono labels type on, dive in and measure the flaw, turn the object into a person, flare, pill, loop.
X.boot(async (X) => {
  await X.loadVO();
  const K = LineEssayKit(X);
  K.setup();                                         // ground (boiling) + halftone art layer + world/hud groups
  const C = K.C, Wd = K.world, HUD = K.hud, tl = X.tl;
  const ln = (id) => X.line(id), wd = (id, w, n) => X.word(id, w, n);
  const DUR = X.vo.duration || 15;

  // ---- 1 · the hand line (white = not yet examined), drawn live by the pen from frame 0
  const A = [300, 690], B = [780, 790];
  const ref = K.cl.line(A, B, 3.5);
  const handPts = K.hand(ref, { wob: 3, trem: 1.2, seed: 7, offset: (u) => 10 * Math.sin(u * 9) });
  const HAND = { kind: 'white', w: 2.6, minScreenW: 2.2 };
  const hand = K.stroke(Wd, handPts, HAND);
  K.penDraw(hand, -0.25, 2.6, { enter: 0.45, exit: 0.6 });
  K.label(Wd, 'HAND', 540, 640, wd('hand', 'hand') - 0.05, { out: ln('turn').start - 0.4 });

  // ---- 2 · the machine line: a scan head rules it in 0.6 s (blue), label first, then a spec readout
  const tThis = wd('machine', 'this'), tMach = wd('machine', 'machine'), tOff = wd('look', 'this') - 0.12;   // machine labels clear before the push-in
  K.crosshair(Wd, 300, 960, tThis - 0.05, { out: tOff });
  K.label(Wd, 'MACHINE', 540, 910, tThis + 0.05, { out: tOff });
  const mach = K.stroke(Wd, K.cl.line([300, 960], [780, 1060], 4), { kind: 'blue', w: 2, uw: 2.2, minScreenW: 1.6 });
  K.anim(mach, tMach - 0.1, 0.6, 'draw', { ease: 'power2.inOut' });
  K.walker(Wd, mach.pts, tMach - 0.1, 0.6, { kind: 'blue', trail: 30, w: 0.6, ease: 'power2.inOut' });
  X.sfx(tMach - 0.1, 'slide', { gain: 0.15, dur: 0.6 });
  K.label(Wd, 'DEVIATION 0.00 PX', 540, 1110, tMach + 0.45, { size: 19, color: C.labelAmber, out: tOff });

  // ---- 3 · the turn back to the hand line: brackets, push in, recolour amber, deviation ticks ×4
  const tLook = wd('look', 'this'), tShake = wd('look', 'shakes');
  K.brackets(Wd, 540, 740, 520, 170, tLook - 0.1, { out: tShake - 0.1 });
  K.camTo(tLook - 0.05, 0.55, { x: 540, y: 745, s: 1.6 }, 'power2.inOut');
  X.sfx(tLook - 0.05, 'zoom_in', { gain: 0.16 });
  K.tint(hand, tLook + 0.2, 0.5, 'amber');
  K.ticks(Wd, ref, handPts, tShake - 0.05, { every: 4, amp: 4, out: ln('turn').start - 0.4 });
  K.label(Wd, 'DEVIATION ×4', 760, 655, tShake, { anchor: 'end', size: 15, out: ln('turn').start - 0.4 });

  // ---- 4 · turn to people: line collapses, camera back, the pen draws a person
  const tTurn = ln('turn').start;
  K.anim(hand, tTurn - 0.4, 0.5, 'collapse', { ease: 'power2.in' });
  K.anim(mach, tTurn - 0.4, 0.4, 'undraw', { ease: 'power2.in' });
  K.camTo(tTurn - 0.4, 0.6, { x: 540, y: 873, s: 1 }, 'power2.inOut');
  const fig = K.bust(Wd, 540, 700, { r: 58, seed: 21 });
  K.bustDraw(fig, tTurn + 0.1, { headDur: 0.7, bodyDur: 0.6 });
  K.flare(Wd, 540, 700, wd('turn', 'people') + 0.1, { w: 640 });

  // ---- 5 · CTA: pill pops under the caption, flips once; the drawing dissolves
  const tF = wd('cta', 'follow');
  K.pill({ t: tF + 0.05, text: 'FOLLOW FOR MORE', icon: 'plus', tFlip: tF + 0.9, text2: 'DRAWN BY HAND', icon2: 'check', tOut: DUR - 0.5 });
  K.bustAnim(fig, DUR - 0.9, 0.55, 'dissolve');

  await K.captions('script.json', { lastOut: DUR - 0.4 });
  K.finish();                                       // registers the per-frame update — always last
  X.end(DUR);
});
