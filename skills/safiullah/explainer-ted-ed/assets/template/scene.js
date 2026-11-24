// explainer-ted-ed starter: the fixed wrapper + one question answered by a short causal chain, S1 soft-glow pastel cel.
// Replace script.json lines and the beat blocks; keep the wrapper calls and timings. kit.js = ../kit.js (copy it beside this file).
X.boot(async (X) => {
  await X.loadVO();
  K.initTwos(12);                                   // character/object acting on twos
  const P = K.PAL.S1, F = K.F, S = X.svg;
  const L = (id) => X.line(id), w = (id, word, n) => X.word(id, word, n);
  const END = Math.max(26, L('callback').end + 7.1); // credits = last ~8.5 s, callback line under their start
  K.layer = S('g', { id: 'scenes' });
  K.fx = S('g', { id: 'fx' });
  K.look({ grain: 0.12, vignette: 0.42, boilScale: 2.6 });

  // ---------------------------------------------------------------- wrapper (do not retime)
  K.ident({ t1: 1.21 });
  K.epigraph({ lines: ['“Your own line here, set in a thin grey sans,', 'one or two lines at most.”'], author: 'Anonymous' });
  K.whiteFade({ t: 5.8, frames: 20 });
  K.credits({ t0: END - 8.5, t1: END, badge: '#1E7F7A', pages: [
    [{ role: 'Educator', name: 'Your Name' }, { role: 'Director', name: 'Your Studio' }, { role: 'Narrator', name: 'Kokoro · af_heart' },
     { role: 'Composer & Sound Designer', name: 'Engine Score' }, { role: 'Script Editor', name: 'Your Editor' }]] });

  // ---------------------------------------------------------------- beats (hang every change on a narration word)
  const tW2 = w('a1', 'next') - 0.3;                   // T3 brush wipe: same loaf, next day
  const tP = L('pivot').start - 0.3;                   // T5 slide-off → question beat
  const tZ = w('step1', 'starch') - 0.45, tC3 = tZ + F(10); // T7 push-in → micro view
  const tW4 = L('callback').start - 0.45;              // T3 → callback shot under the credits
  const bw = F(8);
  const loaf = (parent, x, y, stale) => {
    const g = S('g', { transform: `translate(${x},${y})`, filter: K.rim('rimSoft', '#FFF6EC', 1.5, 4, 0.55) }, parent);
    S('path', { d: 'M-170,0 Q-180,-120 -60,-130 Q0,-150 60,-130 Q180,-120 170,0 Z', fill: stale ? '#9C6B3A' : '#C98A4B' }, g);
    [-80, 0, 80].forEach((cx) => S('path', { d: `M${cx - 30},-110 q30,-22 60,0`, stroke: stale ? '#7A4E28' : '#E8B27A', 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }, g));
    if (stale) S('path', { d: 'M-120,-60 l30,20 l-10,25 M60,-90 l25,30 l25,-5', stroke: '#5E3A1E', 'stroke-width': 5, fill: 'none' }, g);
    return g;
  };

  // C1 — anecdote: the bakery at dawn (under the fade from white)
  {
    const { cam } = K.stage('c1', 5.8, tW2 + bw, '#D3B677');
    S('rect', { x: -260, y: 700, width: 2440, height: 600, fill: P.ochre }, cam);
    const baker = K.person(cam, { x: 700, y: 900, h: 460, colors: { hair: '#5A3E36' }, mouth: 'smile' });
    K.pose(baker, 8.0, { armF: -60, foreF: -40, head: 6 }, { frames: 8 });
    K.blink(baker, [9.2, 12.4]);
    K.motes(cam, 5.8, tW2 + bw, { n: 14, color: '#FFF6EC', speed: 30, seed: 2 });       // warm steam
    loaf(cam, 1200, 700, false);
    K.push(cam, 5.8, tW2 + bw, { from: 1.0, to: 1.06, x0: 30, x1: -60 });
  }
  // C2 — same loaf next day (T3)
  {
    const { g, cam } = K.stage('c2', tW2, tP + F(10), '#B784AA');
    K.brushWipe(g, tW2, { seed: 4 });
    S('rect', { x: -260, y: 700, width: 2440, height: 600, fill: '#8A6530' }, cam);
    loaf(cam, 960, 700, true);
    K.push(cam, tW2, tP, { from: 1.0, to: 1.08 });
  }
  // C3 — the question (revealed by sliding C2 off), then push into the crumb
  let cam3;
  {
    const { cam } = K.stage('c3', tP, tC3, '#A3CBD1'); cam3 = cam;
    const q = K.label(cam, '?', { x: 960, y: 640, size: 300, weight: 400 });
    K.labelIn(q, L('pivot').start + 0.3);
    K.zoomThrough(cam, tZ, { cx: 960, cy: 540, scale: 1.7 });
  }
  { // (slide-off needs the incoming scene underneath: C3 was created first)
    const top = K.layer.querySelector('#c2'); K.layer.appendChild(top);
    K.slideOff(top.firstChild, tP, { frames: 10, dir: 'down' });
  }
  // C4 — micro view: starch chains pack into crystals, water squeezed out
  {
    const { cam } = K.stage('c4', tC3, tW4 + bw, '#96485A');
    const tPack = w('step1', 'pack'), tSq = w('step1', 'squeezing');
    const r = X.rand(8);
    for (let i = 0; i < 6; i++) for (let j = 0; j < 9; j++) {
      const bx = 640 + j * 80, by = 340 + i * 80;
      const b = S('rect', { x: -30, y: -22, width: 60, height: 44, rx: 16, fill: j % 2 ? '#D9B98A' : P.cream }, cam);
      const from = { x: bx + (r() - 0.5) * 900, y: by + (r() - 0.5) * 600, rotation: (r() - 0.5) * 90 };
      gsap.set(b, from);                               // loose and scattered until the word "pack"
      K.twos.fromTo(b, from,
        { x: bx, y: by, rotation: 0, duration: 1.2, ease: 'power2.inOut', immediateRender: false }, tPack - 0.2 + r() * 0.4);
    }
    const water = K.motes(cam, tSq, tW4 + bw, { n: 24, color: '#BFE3F0', speed: 160, angle: -90, seed: 5, box: [640, 340, 700, 420], rmin: 6, rmax: 12, opacity: 0.85 });
    gsap.set(water, { opacity: 0 }); K.twos.to(water, { opacity: 0.85, duration: F(4) }, tSq);
    K.push(cam, tC3, tW4 + bw, { from: 1.0, to: 1.06 });
  }
  // C5 — callback: the loaf back in a warm oven, calm hold under the credits
  {
    const { g, cam } = K.stage('c5', tW4, END + 0.1, '#3A3142');
    K.brushWipe(g, tW4, { seed: 7 });
    S('rect', { x: 460, y: 260, width: 1000, height: 600, rx: 30, fill: '#2A2333' }, cam);
    S('rect', { x: 500, y: 300, width: 920, height: 520, rx: 20, fill: '#F2B66B', opacity: 0.85, filter: K.glow('ovenGlow', 30, '#F7D29A', 0.7) }, cam);
    loaf(cam, 960, 740, false);
    K.push(cam, tW4, END, { from: 1.06, to: 1.0 });
  }
  X.end(END);
});
