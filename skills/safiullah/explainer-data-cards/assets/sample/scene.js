/* data-cards sample — "The treaty that worked": the Montreal Protocol and the ozone layer (vertical 1080×1920, ~70 s).
 * Facts and sources: FACTS.md. One fixed card system: chrome never moves, stacks build / hold / fade as one block. */
X.boot(async (X) => {
  await X.loadVO();
  const C = DC.C, H = DC.H, W = DC.W;
  DC.init(X, { label: 'EXPLAINER', source: 'UNEP · WMO', brand: 'OBELUS' });
  const L = (id) => X.line(id);
  const w = (id, word, off = 0) => X.word(id, word) + off;
  const out = (id) => L(id).start - 0.55;          // a card fades out (10 f) ~0.55 s before the next sentence
  const tLogo = L('q2').end + 0.9;
  const END = Math.max(X.vo.duration || 0, tLogo + 2.5);
  DC.progressBar(0.05, tLogo);
  const yr = (v) => String(Math.round(v));

  // ---------------------------------------------------------------- A · hook: kicker → NEARLY → 99 % count → label
  DC.card('hook', 0, out('twist'), (s) => {
    s.ruleOn();
    s.head(['ONE TREATY THAT', 'ACTUALLY WORKED'], 0.22, { cap: 78, after: 36 });
    s.ruleOff();
    s.head(['NEARLY'], w('hook', 'nearly', -0.08), { cap: 58, color: C.greyNum, after: 22 });
    s.number(w('hook', '99', -0.22), { to: 99, cap: 372, color: C.orange, fmt: (v) => Math.round(v) + '%', dur: 2.0, after: 40 });
    s.head(['OF BANNED OZONE-', 'DEPLETING CHEMICALS'], w('hook', 'ozone-destroying', -0.12), { cap: 84, after: 34 });
    s.tag('PHASED OUT SINCE 1987', w('hook', 'banned', 0.05));
  }, { cy: H * 0.47 });
  X.sfx(w('hook', '99', -0.05), 'tick', { gain: 0.1 });

  // ---------------------------------------------------------------- B · twist: lead-in + huge word + strike-through
  DC.card('twist', L('twist').start - 0.12, out('signed'), (s) => {
    s.lead('And not a single country stayed', L('twist').start - 0.08, { size: 41, after: 26 });
    const [o] = s.head(['OUT.'], w('twist', 'out', -0.1), { cap: 286, after: 46 });
    s.strike(o, w('twist', 'out', 0.42), { h: 19, at: 0.47 });
    s.label('UNIVERSAL RATIFICATION', w('twist', 'out', 0.72), { color: C.orange, size: 27 });
  }, { cy: H * 0.47 });

  // ---------------------------------------------------------------- C · the document: label + name + screenshot card
  DC.card('signed', L('signed').start - 0.2, out('target'), (s) => {
    s.label('16 SEPTEMBER 1987', L('signed').start - 0.12);
    s.head(['MONTREAL PROTOCOL'], w('signed', 'Montreal', -0.05), { cap: 110, after: 34 });
    s.doc({
      t: w('signed', 'signed', -0.12), tag: 'TREATY TEXT', kicker: 'TREATIES  →  OZONE LAYER', title: 'Montreal Protocol',
      sub: ['on Substances that Deplete', 'the Ozone Layer'],
      body: 'Adopted in Montreal on 16 September 1987 and in force since 1 January 1989, it controls the production and consumption of ozone-depleting chemicals, starting with CFCs and halons.',
      after: 26, boxT: w('signed', '1987', -0.1), hold: out('target') - w('signed', 'signed', -0.12) + 0.35,
    });
    s.body('Montreal Protocol on Substances that Deplete the Ozone Layer, signed 16 September 1987', w('signed', '1987', 0.15), { size: 27, color: C.greyLight });
  }, { cy: H * 0.475 });

  // ---------------------------------------------------------------- D1 · the culprit: two-colour name + descriptor
  // product-page figure: a fridge and an aerosol can drawn in code (generic, unbranded), "page" revealed L→R
  function products(g, x, y, w, h) {
    uiText(g, 'Everyday uses of CFCs', x + 40, y + 52, 30, '#2a2622', { weight: 700 });
    const sh = X.radial('prodSh', [[0, '#000', 0.18], [1, '#000', 0]]);
    // refrigerator
    const fx = x + 120, fy = y + 82;
    X.svg('ellipse', { cx: fx + 95, cy: fy + 262, rx: 120, ry: 14, fill: sh }, g);
    X.svg('rect', { x: fx, y: fy, width: 190, height: 258, rx: 14, fill: X.linear('fridgeG', [[0, '#c9ced3'], [0.25, '#f4f6f7'], [0.7, '#e3e7ea'], [1, '#b9bfc5']], 0, 0, 1, 0), stroke: '#a9afb5', 'stroke-width': 1.5 }, g);
    X.svg('rect', { x: fx + 1, y: fy + 84, width: 188, height: 3, fill: '#a9afb5' }, g);
    X.svg('rect', { x: fx + 160, y: fy + 26, width: 9, height: 42, rx: 4, fill: '#8d949b' }, g);
    X.svg('rect', { x: fx + 160, y: fy + 104, width: 9, height: 70, rx: 4, fill: '#8d949b' }, g);
    X.svg('rect', { x: fx + 22, y: fy + 120, width: 104, height: 34, rx: 3, fill: '#fffdf6', stroke: '#c7c1b4' }, g);
    uiText(g, 'REFRIGERANT', fx + 30, fy + 134, 11, '#5b5143', { weight: 700, ls: '0.08em' });
    uiText(g, 'CFC', fx + 30, fy + 150, 14, '#2a2622', { family: DC.F.mono, weight: 700 });
    // aerosol can
    const cx = x + 560, cy = y + 70;
    X.svg('ellipse', { cx: cx + 60, cy: cy + 274, rx: 82, ry: 12, fill: sh }, g);
    X.svg('rect', { x: cx + 40, y: cy, width: 40, height: 30, rx: 5, fill: X.linear('capG', [[0, '#bfc4c9'], [0.4, '#fafafa'], [1, '#a5abb1']], 0, 0, 1, 0) }, g);
    X.svg('rect', { x: cx + 52, y: cy - 10, width: 16, height: 12, rx: 2, fill: '#6f767d' }, g);
    X.svg('path', { d: `M${cx + 8},${cy + 58} Q${cx + 60},${cy + 22} ${cx + 112},${cy + 58} Z`, fill: '#cfd4d8' }, g);
    X.svg('rect', { x: cx + 8, y: cy + 56, width: 104, height: 214, rx: 8, fill: X.linear('canG', [[0, '#a8aeb4'], [0.3, '#f6f7f8'], [0.65, '#dfe3e6'], [1, '#9aa1a8']], 0, 0, 1, 0) }, g);
    X.svg('rect', { x: cx + 8, y: cy + 108, width: 104, height: 112, fill: X.linear('canL', [[0, '#3f6f70'], [0.3, '#5f9192'], [1, '#335c5d']], 0, 0, 1, 0) }, g);
    uiText(g, 'SPRAY', cx + 60, cy + 172, 24, '#f4f1e8', { weight: 800, anchor: 'middle', ls: '0.12em' });
    X.svg('rect', { x: cx + 6, y: cy + 232, width: 108, height: 28, rx: 3, fill: '#fffdf6', stroke: '#c7c1b4' }, g);
    uiText(g, 'PROPELLANT: CFC', cx + 60, cy + 251, 10.5, '#2a2622', { weight: 700, anchor: 'middle', ls: '0.04em' });
    // captions under the products (shop-listing style)
    uiText(g, 'Refrigerator', fx + 95, y + 374, 22, '#2a2622', { weight: 600, anchor: 'middle' });
    uiText(g, 'cooled with CFC refrigerant', fx + 95, y + 400, 19, '#7d7262', { weight: 400, anchor: 'middle' });
    uiText(g, 'Aerosol spray', cx + 60, y + 374, 22, '#2a2622', { weight: 600, anchor: 'middle' });
    uiText(g, 'pushed out by CFC gas', cx + 60, y + 400, 19, '#7d7262', { weight: 400, anchor: 'middle' });
  }
  const uiText = DC.uiText;
  DC.card('target', L('target').start - 0.2, out('how'), (s) => {
    s.label('ITS MAIN TARGET', L('target').start - 0.12);
    s.head(['CHLOROFLUORO-', 'CARBONS'], w('target', 'CFCs', -0.12), { cap: 132, colors: [C.ink, C.orange], after: 32 });
    s.figure({ t: w('target', 'CFCs', 0.3), h: 470, draw: products, box: { x: 130, y: 251, w: 128, h: 54 }, boxT: w('target', 'fridges', -0.05), hold: out('how') - w('target', 'CFCs', 0.3) + 0.35, after: 26 });
    s.lead('CFCs, used in fridges and spray cans', w('target', 'spray', -0.1), { size: 34, color: C.grey });
  }, { cy: H * 0.46 });

  // ---------------------------------------------------------------- D2 · mechanism: dark render insert + 3-step list
  const tIns = L('how').start - 0.5, tInsOut = out('universal');
  const tStrat = w('how', 'stratosphere', -0.1), tSun = w('how', 'sunlight', -0.08), tSplit = w('how', 'splits', -0.05);
  const tCl = w('how', 'chlorine', -0.1), tDes = w('how', 'destroys', -0.05);
  DC.insert(tIns, tInsOut, (g, api) => {
    DC.ill.stars(g, 70, 520, 9);
    // the sun, upper right: soft bloom + faint UV shafts that appear on "sunlight"
    X.svg('circle', { cx: 880, cy: 330, r: 150, fill: X.radial('sunb', [[0, '#fff6e8', 0.6], [0.2, '#ffe9c9', 0.22], [1, '#ffe9c9', 0]]) }, g);
    X.svg('circle', { cx: 880, cy: 330, r: 22, fill: '#fffaf0' }, g);
    const shafts = X.svg('g', { opacity: 0 }, g);
    [[880, 330, 540, 470], [880, 330, 650, 458], [880, 330, 430, 480]].forEach(([x1, y1, x2, y2]) =>
      X.svg('line', { x1, y1, x2, y2, stroke: '#cbb8ff', 'stroke-width': 2, opacity: 0.35, 'stroke-dasharray': '10 14' }, shafts));
    X.tl.fromTo(shafts, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power1.out', immediateRender: false }, tSun);
    // the planet from orbit with the ozone layer as a pale shell
    const P = DC.ill.planetLimb(g, { top: 520, R: 1500, shell: true, shellGap: 38, shellW: 16 });
    const shellY = (x) => P.cy - Math.sqrt((P.R + 38) ** 2 - (x - P.cx) ** 2);
    // ozone molecules (O3 triads) strung along the shell
    const tri = [];
    for (let i = 0; i < 9; i++) {
      const x = 150 + i * 100, y = shellY(x);
      const m = X.svg('g', {}, g);
      DC.ill.sphere(m, x - 13, y + 5, 11, '#7fb6c9');
      DC.ill.sphere(m, x + 13, y + 5, 11, '#7fb6c9');
      DC.ill.sphere(m, x, y - 12, 11, '#9cc8d6');
      tri.push({ m, x, y });
    }
    // a CFC molecule rises from the surface into the stratosphere
    const mol = X.svg('g', {}, g);
    const mx = 300, my = 640;
    const atoms = [
      [0, 0, 36, '#8a9097'], [-50, -30, 28, '#86a35e'], [50, -30, 28, '#86a35e'], [-37, 43, 23, '#cfdde3'], [40, 42, 23, '#cfdde3']];
    const cl = X.svg('g', {}, mol);
    atoms.forEach(([dx, dy, r, c], i) => DC.ill.sphere(i === 2 ? cl : mol, mx + dx, my + dy, r, c));
    gsap.set(mol, { y: 330, opacity: 0 });
    X.tl.fromTo(mol, { y: 330, opacity: 0 }, { y: 0, opacity: 1, duration: tStrat - tIns + 0.9, ease: 'power2.out', immediateRender: false }, tIns + 0.1);
    // "splits": the chlorine atom breaks away and a red track runs to the ozone it hits
    const hitX = 720, hitY = shellY(720);
    X.tl.fromTo(cl, { x: 0, y: 0 }, { x: 90, y: -40, duration: 0.5, ease: 'power3.out', immediateRender: false }, tSplit);
    DC.ill.laser(g, `M${mx + 50 + 90},${my - 30 - 40} C ${mx + 260},${my - 120} ${hitX - 170},${hitY + 30} ${hitX},${hitY}`, tCl, 0.75);
    DC.ill.redBox(g, hitX - 86, hitY - 50, 172, 92, tCl + 0.1);
    DC.ill.glowDot(g, hitX, hitY, tDes, { r: 40, pulseUntil: tInsOut });
    // the hit triad comes apart
    const hit = tri.find((q) => q.x === 750) || tri[6];
    X.tl.fromTo(hit.m, { y: 0, opacity: 1 }, { y: -18, opacity: 0.25, duration: 0.8, ease: 'power2.out', immediateRender: false }, tDes + 0.15);
  }, { h: 1150, push: 1.07 });
  DC.card('how', tIns + 0.15, tInsOut, (s) => {
    s.label('HOW THE DAMAGE WAS DONE', tIns + 0.4, { after: 30 });
    s.list([
      { text: 'CFCs RISE INTO THE STRATOSPHERE', t: tStrat },
      { text: 'SUNLIGHT BREAKS THEM APART', t: tSun },
      { text: 'CHLORINE DESTROYS OZONE', t: tCl, color: C.orange, sub: 'Again and again: one atom, many ozone molecules', subT: w('how', 'again', -0.1) },
    ], { cap: 54, rowH: 118 });
  }, { top: 1206 });

  // ---------------------------------------------------------------- E · universal: count + dot matrix
  DC.card('universal', L('universal').start - 0.2, out('recover'), (s) => {
    s.label('2009 · A FIRST IN UN HISTORY', L('universal').start - 0.12);
    s.number(w('universal', 'first', -0.35), { to: 198, cap: 250, dur: 2.8, ease: 'expo.out', after: 30 });
    s.lead('parties today, including every UN member state', w('universal', 'ratified', -0.1), { size: 36, color: C.ink2, after: 38 });
    s.dots({ cols: 22, rows: 9, n: 198, accent: [197], t: w('universal', 'first', -0.18), dur: 2.8, ease: 'expo.out', ghostT: L('universal').start + 0.25, after: 34 });
    s.body('Each dot = 1 party: 197 states and the European Union (orange)', w('universal', 'country', 0.05), { size: 27, color: C.greyLight });
  }, { cy: H * 0.46 });

  // ---------------------------------------------------------------- F · comparison bars: years to recovery
  const fr = (y) => (y - 2023) / (2066 - 2023);
  DC.card('recover', L('recover').start - 0.2, out('hfc'), (s) => {
    s.ruleOn();
    s.label('PROJECTED RECOVERY', L('recover').start - 0.12);
    s.head(['BACK TO 1980', 'OZONE LEVELS'], w('recover', 'recover', -0.15), { cap: 100, after: 34 });
    s.ruleOff();
    s.divider(w('recover', '1980', 0), { after: 30 });
    const row = { cap: 112, capName: 62, barH: 56, from: 2023, fmt: yr, dur: 1.5, after: 46 };
    s.barRow({ ...row, name: 'REST OF WORLD', to: 2040, frac: fr(2040), t: w('recover', '2040', -0.12) });
    s.barRow({ ...row, name: 'ARCTIC', to: 2045, frac: fr(2045), t: w('recover', '2045', -0.12) });
    s.barRow({ ...row, kicker: 'SLOWEST TO HEAL', name: 'ANTARCTICA', to: 2066, frac: 1, color: C.orange, t: w('recover', '2066', -0.12), after: 30 });
    s.body('Year total ozone returns to 1980 values if current policies hold. Bars run from the 2023 assessment.', w('recover', 'Antarctica', 0.35), { size: 27, color: C.greyLight });
  }, { cy: H * 0.47 });

  // ---------------------------------------------------------------- G · link chain: substitutes → warming → stamp
  DC.card('hfc', L('hfc').start - 0.2, out('hole'), (s) => {
    s.label('THE SUBSTITUTES', L('hfc').start - 0.12);
    s.head(['HFCs'], w('hfc', 'HFCs', -0.12), { cap: 132, after: 24 });
    s.lead('Spare the ozone layer', w('hfc', 'spare', -0.12), { size: 36, after: 18 });
    s.connector('BUT ALSO', w('hfc', 'but', -0.2), { len: 136, after: 22 });
    s.head(['HEAT THE PLANET'], w('hfc', 'heat', -0.12), { cap: 132, after: 24 });
    s.lead('Potent greenhouse gases', w('hfc', 'planet', 0), { size: 36, after: 36 });
    s.stamp('PHASE-DOWN: KIGALI 2016', w('kigali', 'Kigali', -0.08), { cap: 58, after: 26 });
    s.body('Kigali Amendment, adopted 15 October 2016: an estimated 0.3–0.5 °C of warming avoided by 2100', w('kigali', 'down', -0.1), { size: 27, color: C.greyLight });
  }, { cy: H * 0.465 });

  // ---------------------------------------------------------------- H · log-card panel
  DC.card('hole', L('hole').start - 0.2, out('q1'), (s) => {
    s.label('ANTARCTIC OZONE WATCH', L('hole').start - 0.12, { after: 26 });
    s.panel(L('hole').start + 0.02, (p) => {
      const lab = p.label('OZONE HOLE', L('hole').start + 0.15, { size: 24, after: 34 });
      const rec = DC.uiText(p.g, '● EVERY YEAR', p.x0 + p.w, +lab.getAttribute('y'), 24, C.orange, { weight: 700, anchor: 'end', ls: '0.16em' });
      DC.fadeIn(rec, L('hole').start + 0.2);
      p.head(['STILL OPENS'], w('hole', 'still', -0.12), { cap: 150, after: 40 });
      p.divider(w('hole', 'opens', 0), { color: C.panelLine, after: 34 });
      p.label('WHEN', w('hole', 'every', -0.3), { size: 24, after: 22 });
      p.head(['EVERY SPRING'], w('hole', 'every', -0.08), { cap: 96, color: C.orange, after: 26 });
    }, { pad: 48, padB: 22, after: 30 });
    s.body('Each southern-hemisphere spring, over Antarctica', w('hole', 'spring', 0.25), { size: 27, color: C.greyLight });
  }, { cy: H * 0.43 });

  // ---------------------------------------------------------------- J · question ending
  DC.card('question', L('q1').start - 0.15, tLogo, (s) => {
    s.lead('So was the ozone layer a', L('q1').start - 0.1, { size: 38, after: 18 });
    s.head(['ONE-OFF?'], w('q1', 'one-off', -0.12), { cap: 146, after: 40 });
    s.shortRule(w('q1', 'one-off', 0.45), { after: 44 });
    s.lead('Or proof the world can act', L('q2').start - 0.05, { size: 38, after: 18 });
    s.head(['AGAIN?'], w('q2', 'again', -0.12), { cap: 146, color: C.orange, after: 26 });
    s.label('FOR THE CLIMATE', w('q2', 'again', 0.55), { size: 25 });
  }, { cy: H * 0.46, fade: 0.27 });

  // ---------------------------------------------------------------- K · logo end card
  DC.endCard(tLogo, { brand: 'OBELUS' });
  X.end(END);
});
