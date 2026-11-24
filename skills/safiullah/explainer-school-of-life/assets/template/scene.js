/* Starter: the School-of-Life FORMAT in ~15 s — sting -> title on a colour-field wipe -> one metaphor per sentence
 * (keyword on the noun) -> numbered chapter card -> metaphor -> quiet end card. Render with: make.sh <dir> --fps 24 --workers 3
 * Everything on X.tl is sampled on twos by K.init (12 drawings/s). Replace script.json lines + the scene blocks. */
X.boot(async (X) => {
  await X.loadVO();
  K.init(X);
  const C = K.C, tl = X.tl;
  const W = (id, w, n = 0) => X.word(id, w, n), S = (id) => X.line(id).start, E = (id) => X.line(id).end;
  const END = X.vo.duration || 15;
  const scene = (name, t0, t1) => { const outer = X.scene(name, t0, t1, null, K.world); return { outer, cam: K.cam(X.svg('g', {}, outer)) }; };
  const bgField = (g, col) => K.rect(g, -400, -400, 2720, 1880, col, { sw: 0 });
  const floor = (g, y, col) => { K.rect(g, -400, y, 2720, 600, col, { sw: 0 }); K.path(g, `M-400,${y}H2320`, 'none'); };

  // 0. ident sting (original) + title on a colour-field wipe
  K.dotSting(scene('sting', 0, 3.0).cam, 0.12);
  const tOut = Math.max(W('hook', 'worry') - 0.6, 3.9);
  const title = scene('title', 1.9, tOut + 1.0);
  K.wipeUp(title.cam, C.rose, 1.95, { seed: 4 });
  const fr = K.path(title.cam, K.scallopD(960, 520, 980, 380, 24), 'none', { stroke: C.tan, sw: 5 });
  X.drawOn(fr, 2.15, 1.1, 'power1.inOut');
  const tt = K.text(title.cam, 960, 560, 'A Small Worry', { size: 104, fill: C.ultra });
  tl.fromTo(tt, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }, 2.45);

  // 1. hook: one figure, one literal metaphor, keyword set on the noun
  const s1 = scene('s1', tOut, S('c1') + 0.2);
  K.travel(title.outer, s1.outer, tOut, 0.9);
  {
    const g = s1.cam;
    bgField(g, C.rose); floor(g, 960, C.olive);
    const ada = K.figure(g, { pose: { x: 960, y: 960, s: 0.9, turn: -0.3, la: -10, le: 6, ra: 24, re: 70 } });
    const peb = ada.attach(X.svg('g', {}, ada.hold), 'r', { dy: -34 });
    K.path(peb, K.pebbleD(30), C.stone, { sw: 6 / 0.9 });
    K.keyword(g, 1300, 420, 'Worry', W('hook', 'worry') - 0.1, { size: 80, fill: C.terracotta });
    K.pose(ada, W('hook', 'nobody') - 0.2, { turn: 0.4, hd: -6, smile: 0 }, 0.6);
    K.drift(s1.cam, tOut, S('c1') + 0.2, { rate: 0.009 });
  }

  // 2. numbered chapter card
  const cIn = S('c1') - 0.5, cOut = S('grip') - 0.45;
  K.card(cIn, cOut, { n: 1, title: 'The Weight', field: C.ultra, text: '#EF5B45', num: '#EF5B45', line: C.lilac, seed: 3 });

  // 3. metaphor: hugging the thing too tightly (medium shot), strain marks on the stressed word
  const s2 = scene('s2', cOut - 0.05, E('grip') + 0.6);
  {
    const g = s2.cam;
    bgField(g, C.sage);
    const FS = 1.42;
    const ada = K.figure(g, { lw: 8, pose: { x: 900, y: 1220, s: FS, la: 6, le: 104, ra: -14, re: -108, blink: 1, hd: 7 } });
    K.key(X.svg('g', {}, ada.mid), -78, -140, { s: 0.95, rot: 42, sw: 8 / FS });
    const t = W('grip', 'letting');
    K.pose(ada, t - 0.2, { le: 112, re: -116, bob: 5, hd: 10 }, 0.35, 'power2.out');
    const m = K.marks(g, 760, 600, { angles: [-60, -90, -120], r0: 60, r1: 110, sw: 7 });
    gsap.set(m, { opacity: 0 }); tl.set(m, { opacity: 1 }, t); tl.set(m, { opacity: 0 }, t + 0.45);
    K.drift(s2.cam, cOut, E('grip') + 0.6, { rate: 0.008 });
  }

  // 4. quiet end card (no brand, no shop): scalloped frame + title, a bird crossing
  const tEnd = E('grip') + 0.3;
  const end = scene('end', tEnd, END + 1);
  tl.fromTo(end.outer, { opacity: 0 }, { opacity: 1, duration: 0.5, ease: 'none' }, tEnd);
  {
    const g = end.cam;
    const f2 = K.path(g, K.scallopD(960, 520, 900, 340, 22), 'none', { stroke: C.tan, sw: 5 });
    X.drawOn(f2, tEnd + 0.2, 1.1, 'power1.inOut');
    const t1 = K.text(g, 960, 545, 'A Small Worry', { size: 78, fill: C.terracotta });
    tl.fromTo(t1, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, tEnd + 0.5);
    const b = K.bird(g, 420, 300, 0.7);
    tl.fromTo(b, { x: 0, y: 0 }, { x: 500, y: -150, duration: 3, ease: 'none' }, tEnd);
  }
  X.end(END);
});
