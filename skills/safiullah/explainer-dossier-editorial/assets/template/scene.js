/* Dossier-editorial starter — a 16 s demo of the grammar: iris on a paper object + typed slug → flash + stamp →
 * whip to an index card with a red counter → hard-cut word card → whip to a pinned plate → one-character title card.
 * Works narrated (script.json, Mandarin Kokoro) or MUSIC-ONLY (delete script.json: every DK.at() falls back to the
 * fixed time given as its 3rd argument, and sound.json's music_alone_db becomes the reference level).
 * Replace the documents with your own story; keep red for judgement words only. */
X.boot(async (X) => {
  await X.loadVO();
  DK.init(X);
  const C = DK.C, F = DK.F, tl = X.tl;
  const narrated = X.vo.lines && X.vo.lines.length;
  const at = (id, phrase, fb) => DK.at(id, phrase, fb);               // VO phrase time or fixed beat time
  const END = narrated ? X.vo.duration : 16;

  // ---------------------------------------------------------------- beats (narrated ↔ music-only fallbacks)
  const T = {
    iris: 0.25, slug: 0.8,
    rup: narrated ? X.line('hook').end + 0.15 : 2.9,
    stamp: at('hook', '档案', 3.4),
    whip1: (narrated ? X.line('card').start : 4.6) - 0.4,
    count: at('card', '每一张纸', 4.9),
    verdict: at('card', '结论', 7.6),
    card: (narrated ? X.line('card').end : 8.6) + 0.15,
    whip2: (narrated ? X.line('end').start : 10.0) - 0.45,
    title: (narrated ? X.line('end').start : 10.0) + 0.9,
    glyph: at('end', '信', 11.6),
  };

  // ---------------------------------------------------------------- desk + camera + overlays
  const cam = DK.camera({ x: -900, y: -500, s: 1, r: -0.5 });
  DK.desk(cam.g, { seed: 7 });
  const vig = DK.vignette({ r: 0, dark: 1, soft: 0.5 });             // black frame → pinhole iris
  vig.to(T.iris, 0.32, { r: 560, dark: 0.95 }).to(T.rup, 0.07, { r: 2600, dark: 0 }, 'power1.in');
  DK.flash(T.rup);

  // 1 · object under the spotlight + typed slug
  const doc = DK.sheet(cam.g, { x: -900, y: -520, w: 760, h: 420, rot: -4, paper: 'note' });
  DK.guilloche(doc, 0, 0, 760, 420, { color: C.noteInk, op: 0.6 });
  DK.rosette(doc, 170, 210, 110, { color: C.noteInk });
  DK.text(doc, 320, 200, 'DOSSIER', { f: 'lat', size: 74, ls: 10, fill: C.noteInk });
  DK.text(doc, 324, 250, '档案 · No. 001', { f: 'zhs', size: 28, weight: 500, fill: C.noteInk });
  const slug = DK.sheet(cam.g, { x: -910, y: -250, w: 520, h: 62, rot: -3, edge: 'torn', jag: 4, paper: 'card' });
  DK.type(slug, 28, 42, 'ARCHIVE · 2026', T.slug, { size: 28, ls: 3, cps: 14 });
  DK.stamp(doc, '档案', 560, 300, T.stamp, { size: 110, rot: -8, sub: 'FILE', cam });

  // 2 · whip to an index card: red counter + verdict stamp
  cam.whip(T.whip1, { x: 500, y: -420, s: 1, r: 0.6 }, { rotKick: 1.5 });
  const card = DK.sheet(cam.g, { x: 500, y: -430, w: 1050, h: 620, rot: 2, paper: 'card', lines: { y0: 170, step: 58 }, margin: 220 });
  DK.type(card, 60, 82, 'EVIDENCE · EXHIBIT A', T.whip1 + 0.45, { size: 28, ls: 2, cps: 36 });
  DK.type(card, 62, 124, '证据 · 第一号', T.whip1 + 0.7, { f: 'zhs', size: 26, weight: 500, cps: 14, cursor: false, sfx: false, fill: C.ink2 });
  const n = DK.text(card, 270, 380, '0', { f: 'lat', size: 150, fill: C.red });
  DK.counter(n, 1, 1000000, T.count, 1.6, { log: true, fmt: (v) => Math.round(v).toLocaleString('en-US') });
  DK.stamp(card, '结论', 820, 470, T.verdict, { size: 100, rot: -6, sub: 'VERDICT', cam });

  // 3 · hard-cut word card (montage grammar: huge Song word + typed gloss + halftone plate + gag)
  const plate = DK.halftone((c, w, h) => { DK.ill.sky(c, w, h); DK.ill.factory(c, w * 0.06, h * 0.8, w * 0.88, h * 0.28); DK.ill.ground(c, w, h, h * 0.8); for (let i = 0; i < 4; i++) DK.ill.person(c, w * (0.55 + i * 0.1), h * 0.95, h * 0.42, { cap: true, arms: 'folded' }); }, 900, 620, { cell: 7 });
  DK.card(T.card, T.whip2, { ground: 'verm', word: '证据', gloss: 'EVIDENCE', plate, size: 240 });

  // 4 · whip to a pinned plate, then dive → title certificate
  cam.cut(T.card, { x: 1700, y: 600, s: 1, r: 0 });
  cam.whip(T.whip2, { x: 1500, y: 560, s: 1, r: -0.4 });
  const pl = DK.plate(cam.g, plate, { x: 1500, y: 560, w: 900, h: 620, rot: -2.5, tape2: true });
  DK.tag(cam.g, '街头', 'THE STREET', 1720, 860, T.whip2 + 0.5, { size: 56, rot: 3 });
  cam.zoom(T.title - 0.42, { x: 1500, y: 560, s: 3.2 }, { dur: 0.42 });
  DK.titleCard(T.title, { char: '信', title: 'TRUST', sub: 'the thing money is made of', promise: '钞票，是一份承诺', serial: 'No. 0000001 · SERIES A', tGlyph: T.glyph });
  const vt = DK.vignette();
  vt.to(T.title + 1.2, 0.001, { r: 1700, dark: 0, soft: 0.6 }).to(T.title + 1.25, 3, { r: 1050, dark: 0.5 }, 'sine.inOut');

  // HUD: programme / chapter, date slug, source line (say 示意 when schematic)
  const hud = DK.hud('纸上谈钱', '模板 · 开场');
  hud.slug(0, '2026 · 档案').slug(T.whip1, '证据 · 第一号').source(T.rup, '示意 · 所有文件均为原创').source(T.title, '');
  hud.hide(0, T.rup).hide(T.card, T.whip2).hide(T.title, END + 1);
  X.grain(0.045, 12);
  X.end(END);
});
