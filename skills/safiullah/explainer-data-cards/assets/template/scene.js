/* data-cards template — 3 cards + logo (~17 s, 1080×1920). Copy this folder, edit script.json, rebuild the cards.
 * Facts used here: 198 parties (ozone.unep.org, Oct 2026); recovery 2040 / 2066 (WMO/UNEP 2022 assessment, Jan 2023). */
X.boot(async (X) => {
  await X.loadVO();
  const C = DC.C, H = DC.H;
  DC.init(X, { label: 'EXPLAINER', source: 'UNEP · WMO', brand: 'OBELUS' });   // invent your own outlet + mark
  const L = (id) => X.line(id), w = (id, word, off = 0) => X.word(id, word) + off;
  const out = (id) => L(id).start - 0.55;                 // clear a card 0.55 s before the next sentence
  const tLogo = L('q').end + 0.9;
  DC.progressBar(0.05, tLogo);

  // 1 · hook: ruled kicker → count-up → dot matrix (each dot = 1 party)
  DC.card('hook', 0, out('data'), (s) => {
    s.ruleOn();
    s.label('UNIVERSAL RATIFICATION', 0.15);
    s.head(['ONE TREATY,', 'EVERY COUNTRY'], 0.3, { cap: 96, after: 46 });
    s.ruleOff();
    s.number(w('hook', 'ratified', -0.2), { to: 198, cap: 250, color: C.orange, dur: 2.2, after: 26 });
    s.dots({ cols: 22, rows: 9, n: 198, accent: [197], t: w('hook', 'ratified', -0.03), dur: 2.2, ghostT: 0.6 });
    s.body('Each dot = 1 party: 197 states and the European Union (orange)', w('hook', 'Montreal', 0), { size: 27, color: C.greyLight });
  }, { cy: H * 0.46 });

  // 2 · comparison bars: grey reference, orange subject; caveat footnote
  const fr = (y) => (y - 2023) / (2066 - 2023), yr = (v) => String(Math.round(v));
  DC.card('data', L('data').start - 0.2, out('q'), (s) => {
    s.label('BACK TO 1980 OZONE LEVELS', L('data').start - 0.1);
    s.head(['PROJECTED', 'RECOVERY'], w('data', 'recover', -0.15), { cap: 110 });
    s.divider(w('data', 'recover', 0.2));
    s.barRow({ name: 'REST OF WORLD', from: 2023, to: 2040, frac: fr(2040), fmt: yr, t: w('data', '2040', -0.12) });
    s.barRow({ kicker: 'SLOWEST TO HEAL', name: 'ANTARCTICA', from: 2023, to: 2066, frac: 1, fmt: yr, color: C.orange, t: w('data', '2066', -0.12), after: 30 });
    s.body('If current policies hold. Bars run from the 2023 assessment.', w('data', 'Antarctica', 0.3), { size: 27, color: C.greyLight });
  }, { cy: H * 0.46 });

  // 3 · question ending, then the logo card
  DC.card('q', L('q').start - 0.15, tLogo, (s) => {
    s.lead('Could the world do it', L('q').start - 0.1, { size: 38, after: 18 });
    s.head(['AGAIN?'], w('q', 'again', -0.12), { cap: 146, color: C.orange, after: 26 });
    s.label('FOR THE CLIMATE', w('q', 'again', 0.5), { size: 25 });
  }, { cy: H * 0.45, fade: 0.27 });
  DC.endCard(tLogo, { brand: 'OBELUS' });
  X.end(Math.max(X.vo.duration || 0, tLogo + 2.3));
});
