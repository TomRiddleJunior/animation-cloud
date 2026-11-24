/* paper-trail starter (≈14 s, 1080×1920): dark plate hook → STEP 1 card → document with highlight, stamp and
 * hand note → LAST STEP card → order slip → ink blot → poll. Replace the lines in script.json and the beats below.
 * 88 BPM grid: one bar = 2.727 s; each "at" in script.json sits on a bar; card exits hold ≈ 1.25 s. */
X.boot(async (X) => {
  await X.loadVO();
  const script = await (await fetch('script.json')).json();
  const tl = X.tl, W = X.W, H = X.H, C = PT.C;
  PT.init(X, { grain: 0.05 });
  const S = (tag, a, p) => X.svg(tag, a, p);
  const L = (id) => X.line(id), w = (id, s, n = 0) => X.word(id, s, n);
  const scene = (t0, t1, parent = PT.world) => { const g = S('g', {}, parent); gsap.set(g, { autoAlpha: 0 }); tl.set(g, { autoAlpha: 1 }, t0); if (t1 != null) tl.set(g, { autoAlpha: 0 }, t1); return g; };
  /** camera that frames a world box edge-to-edge with its top edge at screen y `top` */
  const frame = (x0, y0, x1, y1, o = {}) => { const sc = o.s ?? (W - 60) / (x1 - x0); return { x: (x0 + x1) / 2 - W / 2 + (o.dx ?? 0), y: y0 - H / 2 - ((o.top ?? 90) - H / 2) / sc, s: sc, r: 0 }; };

  const T1 = L('s1a').start - 0.04, E1 = T1 + 1.25, T2 = L('l1').start - 0.04, E2 = T2 + 1.25;
  const TP = L('l1').end + 0.35, END = X.vo.duration || 14;

  // ---- hook: dark plate with a line-art bottle that "pops" (screen-space layer)
  {
    const g = scene(0, T1 + 0.05, PT.plate);
    S('rect', { x: 0, y: 0, width: W, height: H, fill: X.linear('pt-sky', [[0, '#151311'], [0.6, '#2d2b27'], [1, '#100f0d']]) }, g);
    const pc = S('g', {}, g); gsap.set(pc, { svgOrigin: '540 1000' });
    tl.fromTo(pc, { scale: 1 }, { scale: 1.12, duration: T1, ease: 'sine.inOut', immediateRender: false }, 0);
    const b = S('g', { fill: 'none', stroke: C.plateHi, 'stroke-width': 4 }, pc);
    S('path', { d: 'M470,560 L470,680 C380,720 360,800 360,880 L360,1180 C360,1210 380,1230 410,1230 L670,1230 C700,1230 720,1210 720,1180 L720,880 C720,800 700,720 610,680 L610,560 Z' }, b);
    S('rect', { x: 455, y: 500, width: 170, height: 60, rx: 8 }, b);
    S('rect', { x: 400, y: 900, width: 280, height: 220, fill: '#1b1916' }, b);
    PT.text(pc, 'ELIXIR', 540, 1030, { f: 'head', size: 56, fill: '#d8d2c4', anchor: 'middle', ls: 6 });
    const t = w('h1', 'miracle');
    for (let i = 0; i < 16; i++) {
      const a = i / 16 * Math.PI * 2, ray = S('line', { x1: 540, y1: 480, x2: 540, y2: 480, stroke: i % 2 ? '#e9b35c' : '#f4e7c8', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0 }, pc);
      tl.fromTo(ray, { attr: { x1: 540, y1: 480, x2: 540, y2: 480 }, opacity: 1 }, { attr: { x1: 540 + Math.cos(a) * 70, y1: 480 + Math.sin(a) * 70, x2: 540 + Math.cos(a) * 220, y2: 480 + Math.sin(a) * 220 }, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, t);
    }
    X.sfx(t, 'sparkle', { dur: 0.6, gain: 0.35 });
  }

  // ---- step cards + top-right tags
  PT.stepCard(T1, { n: 1, exit: E1, seed: 31, x: 180, y: 1500 });
  PT.stepCard(T2, { big: true, small: 'LAST', label: 'STEP', exit: E2, seed: 36, x: 900, y: 1500 });
  PT.stepTag(E1 + 0.12, T2, 'STEP 1'); PT.stepTag(E2 + 0.12, TP + 0.02, 'LAST STEP');

  // ---- step 1: a label document — camera tilts down it; highlight, stamp, hand note
  {
    const g = scene(T1, T2 + 0.02);
    PT.ghost(g, { x: 660, y: -120, w: 560, h: 700, rot: 10, seed: 5 });
    PT.ghost(g, { x: -300, y: 1100, w: 600, h: 760, rot: -7, seed: 6, red: true });
    const d = PT.doc(g, { x: 110, y: 150, w: 860, h: 1000, rot: -2, paper: C.parch, edge: 'deckle' });
    const b = d.body;
    PT.text(b, 'PATENT MEDICINE · LABEL PROOF', 60, 90, { f: 'mono', size: 24, ls: 4, fill: C.ink2 });
    PT.rule(b, 60, 112, 740, { th: 2 });
    PT.text(b, 'ELIXIR', 60, 240, { f: 'head', size: 130, ls: 6 });
    PT.text(b, 'for every complaint of body and mind', 60, 300, { f: 'serif', size: 32, italic: true, fill: C.ink2 });
    PT.lines(b, 60, 360, 740, 7, { seed: 12, lh: 34 });
    PT.text(b, 'CURES WHAT AILS YOU', 60, 680, { f: 'mono', size: 34, weight: 700 });
    PT.text(b, 'results not guaranteed', 60, 900, { f: 'mono', size: 20, fill: C.grey });
    PT.cam.set(T1 + 0.02, frame(110, 150, 970, 1150, { top: 170, s: 1.15 })).to(E1 - 0.1, frame(110, 150, 970, 1150, { top: -120, s: 1.3, dx: 40 }), T2 - E1, 'sine.inOut');
    PT.stamp(b, w('s1a', 'everything') + 0.05, 'GUARANTEED', 420, 520, { size: 80, rot: -8 });
    PT.hl(b, w('s1b', 'Cures') - 0.2, 52, 652, 560, 42, { dur: 0.3 });
    PT.hand(b, w('s1b', 'not') - 0.05, '(not really)', 300, 860, { size: 64, rot: -6 });
  }

  // ---- last step: the order slip — the viewer
  {
    const g = scene(T2, TP + 0.12);
    const ox = 2600;
    PT.ghost(g, { x: ox - 280, y: 200, w: 560, h: 700, rot: -9, seed: 7 });
    const slip = PT.doc(g, { x: ox + 170, y: 520, w: 740, h: 560, rot: -3, paper: C.slip });
    const b = slip.body;
    PT.text(b, 'ORDER', 50, 110, { f: 'head', size: 78, ls: 2 });
    PT.rule(b, 50, 140, 640, { th: 3 });
    [['Name', 'you'], ['Item', 'one miracle'], ['Price', 'whatever it takes']].forEach(([k, v], i) => { PT.text(b, k, 50, 230 + i * 92, { f: 'mono', size: 28, fill: C.grey }); PT.text(b, v, 210, 232 + i * 92, { f: 'serif', size: 44, weight: i ? 400 : 700, italic: i > 0 }); });
    PT.cam.set(T2 + 0.02, frame(ox + 170, 520, ox + 910, 1080, { top: 260, s: 1.12 })).to(E2 - 0.1, frame(ox + 170, 520, ox + 910, 1080, { top: 140, s: 1.25 }), TP - E2, 'sine.inOut');
    PT.stamp(b, w('l1', 'buyers') + 0.05, 'SOLD', 520, 420, { size: 90, rot: -9 });
  }

  // ---- end: ink blot → poll card + wordmark
  {
    const g = scene(TP + 0.02, null);
    PT.cam.set(TP + 0.02, { x: 0, y: 40, s: 1, r: 0 }).to(TP + 0.3, { x: 0, y: -30, s: 1.05 }, Math.max(1, END - TP - 0.3), 'sine.inOut');
    PT.blot(TP, { x: W - 220, y: 380, hold: 0.13, rx: 160, ry: H - 300, seed: 71 });
    PT.poll(g, TP + 0.2, { q: 'Who sells the miracle?', options: ['The maker', 'The papers', 'The buyers', 'Nobody'], brand: 'yourbrand', y: 420 });
  }

  const chunks = PT.captions(script, { dark: [[0, T1]], end: TP + 0.02 });
  chunks.forEach((c, i) => { if (c.t0 > E1 + 0.3 && c.t0 < T2 - 0.3) PT.bump(c.t0 - 0.06, (i % 2 ? 1 : -1) * 110, 40, 0.05); });
  X.end(END);
});
