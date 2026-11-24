/* explainer-mark-rober starter: (1) annotated "footage" plate with red pointer arrows on the nouns,
 * (2) hard cut to a flat sky-blue physics insert — camera tracks a falling crate (clouds stream up), coral force
 * arrows whose LENGTH is the force, two labels max, then one big white number with its unit conversion.
 * Physics: m = 2 kg → W = 19.6 N; v_t = √(2mg / (ρ·Cd·A)), ρ = 1.2 kg/m³, Cd ≈ 0.8, A = π·0.6² = 1.131 m² → 6.0 m/s
 * (13.4 mph, 21.6 km/h). Replace the plate drawing, the objects and the numbers; keep the grammar.
 */
X.boot(async (X) => {
  await X.loadVO();
  const C = K.C, tl = X.tl, S = (t, a, p) => X.svg(t, a, p), W = (id, w, n = 0) => X.word(id, w, n), Ln = (id) => X.line(id);
  const T = { plate: 0, phys: Ln('weight').start - 0.12, end: X.vo.duration || 16 };
  const grain = X.grain(0.075, 12);

  // ---- 1 · annotated footage stand-in (draw once → rasterise → handheld drift + push)
  const sc1 = X.scene('plate', T.plate, T.phys);
  gsap.set(sc1, { autoAlpha: 1 });                            // a set at exactly t = 0 never renders on seek(0)
  const cam = S('g', {}, sc1), content = S('g', {}, cam);
  const defs = S('defs', {}, content);
  const lg = S('linearGradient', { id: 'tsky', x1: 0, y1: 0, x2: 0, y2: 1 }, defs);
  [[0, '#5E93C2'], [0.7, '#B9D2E0'], [1, '#E7E3D3']].forEach(([o, c]) => S('stop', { offset: o, 'stop-color': c }, lg));
  const bl = S('filter', { id: 'tblur' }, defs); S('feGaussianBlur', { stdDeviation: 5 }, bl);
  S('rect', { width: 1920, height: 1080, fill: 'url(#tsky)' }, content);
  S('path', { d: 'M-20,900 C400,860 1200,880 1940,850 L1940,1100 L-20,1100Z', fill: '#6E8F4A', filter: 'url(#tblur)' }, content);
  S('path', { d: 'M760,380 C760,230 1160,230 1160,380 Q960,350 760,380Z', fill: '#E8503A' }, content);   // canopy
  S('path', { d: 'M860,330 C900,250 1020,250 1060,330', fill: 'none', stroke: '#F6C7B8', 'stroke-width': 8, opacity: 0.6 }, content);
  for (const x of [770, 860, 1060, 1150]) S('line', { x1: x, y1: 380, x2: 960, y2: 560, stroke: '#333', 'stroke-width': 2 }, content);
  S('rect', { x: 900, y: 560, width: 120, height: 92, rx: 4, fill: '#B88A55' }, content);
  S('rect', { x: 900, y: 560, width: 120, height: 16, fill: '#D5AC78' }, content);
  await K.rasterize(content);
  K.footage(cam, { seed: 3, t0: T.plate, t1: T.phys, amp: 10, push: [1.03, 1.08] });
  K.vignette(sc1, 0.4);
  K.pointer(sc1, { x: 880, y: 640, angle: 20, len: 240 }, W('hook', 'crate') - 0.04, W('hook', 'parachute') - 0.04);
  K.pointer(sc1, { x: 740, y: 300, angle: 15, len: 240, seed: 5 }, W('hook', 'parachute') - 0.04, T.phys);

  // ---- 2 · physics insert (hard cut in, flat outline-free, no texture)
  const sc2 = X.scene('phys', T.phys, null);
  tl.set(grain, { opacity: 0 }, T.phys);
  K.cut(T.phys, 'whoosh', 0.22);
  K.skyField(sc2);
  const tDrag = W('drag', 'air'), tNum = W('result', 'six') - 0.03;
  // camera tracks the fall: clouds stream upward, faster once the crate is falling for real
  K.clouds(sc2, { axis: 'y', n: 6, seed: 4, speed: -380, sMin: 0.6, sMax: 1.0 });
  const crate = S('g', { transform: 'translate(1100,520)' }, sc2);
  S('path', { d: 'M-120,-150 C-120,-260 120,-260 120,-150 Q0,-170 -120,-150Z', fill: '#E9E2DA' }, crate);
  for (const x of [-115, -40, 40, 115]) S('line', { x1: x, y1: -152, x2: 0, y2: -40, stroke: '#3D4144', 'stroke-width': 2 }, crate);
  S('rect', { x: -40, y: -40, width: 80, height: 62, rx: 3, fill: '#C9A26B' }, crate);
  S('rect', { x: -40, y: -40, width: 80, height: 12, fill: '#DDBA82' }, crate);
  const PX = 210 / 19.6;                                      // px per newton: equal forces → equal arrows
  const g = K.forceArrow(sc2, { x: 1100, y: 548, angle: 90, shaft: 34, head: 92, headLen: 54 });
  const d = K.forceArrow(sc2, { x: 1100, y: 256, angle: -90, shaft: 34, head: 92, headLen: 54 });
  g.to(W('weight', 'gravity'), 0.3, 19.6 * PX, 'power2.out');
  d.to(tDrag, 0.25, 12, 'power2.out').to(tDrag + 0.3, 1.7, 19.6 * PX, 'power1.in');   // drag grows with speed
  const lg1 = K.label(sc2, 'weight', 1100, 840), lg2 = K.label(sc2, 'drag', 1100, 60);
  const streaks = K.streaks(sc2, { x: 1100, y: 380, dir: -90, len: 260, n: 6, spread: 34 });
  const hide = (el, t0, t1) => { gsap.set(el, { autoAlpha: 0 }); tl.set(el, { autoAlpha: 1 }, t0); if (t1) tl.set(el, { autoAlpha: 0 }, t1); };
  hide(g.g, W('weight', 'gravity'), tNum); hide(d.g, tDrag, tNum);
  hide(lg1, W('weight', 'gravity') + 0.55, tNum); hide(lg2, tDrag + 0.6, tNum);
  hide(streaks, W('drag', 'match'), null);
  X.sfx(W('weight', 'gravity'), 'pop', { gain: 0.3 }); X.sfx(tDrag, 'riser', { gain: 0.3, dur: 1.9 });
  const big = K.bigNumber(sc2, { x: 520, y: 470, value: '6', unit: 'm/s', conv: '(13 mph · 22 km/h)', size: 210 });
  hide(big, tNum, null); X.sfx(tNum, 'ding', { gain: 0.45 });
  const note = S('text', { x: 1890, y: 1050, 'text-anchor': 'end', 'font-family': 'Inter', 'font-size': 24, fill: '#fff', opacity: 0.85, text: '(Cd ≈ 0.8, sea-level air)' }, sc2);
  hide(note, tNum, null);
  X.end(T.end);
});
