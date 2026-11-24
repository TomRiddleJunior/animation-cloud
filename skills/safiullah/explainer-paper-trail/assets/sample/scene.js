/* paper-trail sample — "So you want to run a bubble?" (South Sea Bubble, 1711–1721), 1080×1920 vertical reel.
 * Structure (88 BPM grid, 1 bar = 2.727 s): dark cinematic hook (2 bars) → desk couplet (2 bars) → 5 numbered steps
 * (3 bars each, step 5 = 4 bars), each opened by a red ink-splat STEP card → LAST STEP → twist at the viewer → ink blot → poll. */
X.boot(async (X) => {
  await X.loadVO();
  const script = await (await fetch('script.json')).json();
  const tl = X.tl, W = X.W, H = X.H, C = PT.C;
  PT.init(X, { grain: 0.05 });
  const S = (tag, a, p) => X.svg(tag, a, p);
  const L = (id) => X.line(id), w = (id, s, n = 0) => X.word(id, s, n), we = (id, s, n = 0) => X.wordEnd(id, s, n);
  const scene = (t0, t1, parent = PT.world) => { const g = S('g', {}, parent); gsap.set(g, { autoAlpha: 0 }); tl.set(g, { autoAlpha: 1 }, t0); if (t1 != null) tl.set(g, { autoAlpha: 0 }, t1); return g; };

  // ---------------------------------------------------------------- key times
  const T = {};                                   // step-card cover times (just before "Step …")
  for (const [k, id] of [[1, 's1a'], [2, 's2a'], [3, 's3a'], [4, 's4a'], [5, 's5a'], [6, 'l1']]) T[k] = L(id).start - 0.04;
  const E = {};                                  // card exits (torn rip): hold ≈ 1.5 s over the spoken label + first words
  for (const k of [1, 2, 3, 4, 5]) E[k] = T[k] + 1.25;
  E[6] = Math.max(T[6] + 1.25, w('l1', 'Do') - 0.06);
  /** Camera that frames a world box [x0,y0]-[x1,y1] edge to edge (m px margins) with its top edge at screen y `top`. */
  const frame = (x0, y0, x1, y1, o = {}) => { const sc = o.s ?? (W - 2 * (o.m ?? 30)) / (x1 - x0); return { x: (x0 + x1) / 2 - W / 2 + (o.dx ?? 0), y: y0 - H / 2 - ((o.top ?? 90) - H / 2) / sc, s: sc, r: o.r ?? 0 }; };

  const BAR = 60 / 88 * 4, TP = Math.max(24 * BAR - 0.03, L('t2').end + 0.3);  // poll blot: bar 25 or just after the last word
  const END = X.vo.duration;

  // ================================================================ 0 · HOOK A — line-art screw press slams, burst (0 → 0.8)
  const tCut1 = 0.8, tCut2 = L('h3').start - 0.06;
  {
    const g = scene(0, tCut1, PT.plate);
    const bg = S('rect', { x: 0, y: 0, width: W, height: H, fill: '#12100e' }, g);
    tl.to(bg, { attr: { fill: '#5d544a' }, duration: 0.02 }, 0.29); tl.to(bg, { attr: { fill: '#2a241f' }, duration: 0.16 }, 0.36);
    const pc = S('g', {}, g); gsap.set(pc, { svgOrigin: '540 1300' }); tl.fromTo(pc, { scale: 1.0, rotation: 0 }, { scale: 1.12, rotation: -2, duration: 0.8, ease: 'none' }, 0);
    const press = S('g', { transform: 'translate(540 1250) scale(1.35) rotate(-16) translate(-445 -1400)', fill: 'none', stroke: '#d9cfbf', 'stroke-width': 4, 'stroke-linejoin': 'round' }, pc);
    const ln = (d, sw) => S('path', { d, 'stroke-width': sw ?? 4 }, press);
    ln('M240,1100 L240,1720 M270,1100 L270,1720 M620,1100 L620,1720 M650,1100 L650,1720');      // twin uprights
    ln('M200,1060 L690,1060 L690,1150 L200,1150 Z M200,1640 L690,1640 L690,1700 L200,1700 Z M150,1700 L740,1700 L740,1760 L150,1760 Z');
    ln('M425,1150 L425,1330 M465,1150 L465,1330', 3);
    for (let i = 0; i < 9; i++) ln(`M425,${1160 + i * 19} L465,${1170 + i * 19}`, 2);                // screw thread
    const platen = S('g', {}, press);
    S('path', { d: 'M300,1330 L590,1330 L590,1380 L300,1380 Z M330,1380 L560,1380 L560,1400 L330,1400 Z' }, platen);
    tl.fromTo(platen, { y: 0 }, { y: 225, duration: 0.06, ease: 'power4.in', immediateRender: false }, 0.24);
    const bar = S('g', {}, press);
    S('path', { d: 'M180,1030 L710,1030' , 'stroke-width': 6 }, bar); S('circle', { cx: 170, cy: 1030, r: 22 }, bar); S('circle', { cx: 720, cy: 1030, r: 22 }, bar);
    gsap.set(bar, { svgOrigin: '445 1030' }); tl.fromTo(bar, { scaleX: 1 }, { scaleX: -1, duration: 0.22, ease: 'power2.in', immediateRender: false }, 0.06);
    // burst: stacked cloud layers (red → orange → gold → cream) thrown up-right, rings, flying sheets
    const bx = 620, by = 1530, burst = S('g', {}, pc), r = X.rand(5);
    // layered ink-blob explosion (outlined red shell → orange → gold → cream core), elongated up-right along the blast
    const head = S('g', { transform: `translate(${bx + 230} ${by - 420}) rotate(-28) scale(1 1.75)` }, burst);
    const layers = [['#c13c24', 300, '#2a1610', 61], ['#d9783a', 228, null, 62], ['#e9b35c', 160, null, 63], ['#f7ecd2', 96, null, 64]];
    layers.forEach(([col, rad, outline, seed], li) => {
      const p = S('path', { d: PT.blob(seed, 11), fill: col, stroke: outline || 'none', 'stroke-width': outline ? 0.02 : 0, transform: `translate(0 ${-li * 34}) scale(${rad})` }, head);
      const wrap = S('g', {}, head); wrap.appendChild(p);
      gsap.set(wrap, { scale: 0, svgOrigin: '0 240' });
      tl.to(wrap, { scale: 1, duration: 0.14, ease: 'power3.out' }, 0.29 + li * 0.025);
      tl.to(wrap, { scale: li ? 0.7 : 1.12, opacity: li ? 0 : 1, duration: 0.3, ease: 'power1.in' }, 0.47 + li * 0.02);
    });
    // smoke puffs: brown blobs with pale line-art rims rolling out at the base and along the blast
    for (let i = 0; i < 7; i++) {
      const sx = bx - 300 + i * 120 + (r() - 0.5) * 60, sy = by + 140 - i * 40 - r() * 80, rad = 120 + r() * 70;
      const sm = S('path', { d: PT.blob(80 + i, 8), fill: '#7e634e', stroke: '#d8c2a6', 'stroke-width': 3 / rad, transform: `translate(${sx} ${sy}) scale(${rad})` }, burst);
      const sw = S('g', {}, burst); sw.appendChild(sm);
      gsap.set(sw, { scale: 0, svgOrigin: `${sx} ${sy}` });
      tl.to(sw, { scale: 1, duration: 0.4, ease: 'power2.out' }, 0.33 + i * 0.03);
    }
    for (let i = 0; i < 12; i++) {       // embers
      const e = S('circle', { cx: bx, cy: by, r: 6 + r() * 10, fill: i % 3 ? '#c13c24' : '#e9b35c', stroke: '#2a1610', 'stroke-width': 3 }, burst);
      gsap.set(e, { opacity: 0 });
      const a = -0.4 - r() * 1.6, sp = 300 + r() * 600;
      tl.fromTo(e, { attr: { cx: bx, cy: by }, opacity: 0 }, { attr: { cx: bx + Math.cos(a) * sp, cy: by + Math.sin(a) * sp }, opacity: 1, duration: 0.45, ease: 'power2.out', immediateRender: false }, 0.3);
    }
    for (let i = 0; i < 3; i++) {
      const ring = S('circle', { cx: bx + 120, cy: by - 160, r: 120, fill: 'none', stroke: '#e9dcc4', 'stroke-width': 10 - i * 3, opacity: 0 }, pc);
      gsap.set(ring, { svgOrigin: `${bx + 120} ${by - 160}` });
      tl.fromTo(ring, { scale: 0.3, opacity: 0.45 }, { scale: 3 + i, opacity: 0, duration: 0.45, ease: 'power2.out', immediateRender: false }, 0.29 + i * 0.05);
    }
    for (let i = 0; i < 10; i++) {
      const sh = S('rect', { x: -32, y: -22, width: 64, height: 44, fill: '#efe6d2', stroke: '#3d5544', 'stroke-width': 3 }, pc);
      gsap.set(sh, { opacity: 0 });
      const a = -0.35 - r() * 1.1, sp = 600 + r() * 700;
      tl.fromTo(sh, { x: bx, y: by - 80, rotation: 0, opacity: 0 }, { x: bx + Math.cos(a) * sp, y: by - 80 + Math.sin(a) * sp, rotation: (r() - 0.5) * 540, opacity: 1, duration: 0.5, ease: 'power2.out', immediateRender: false }, 0.3 + r() * 0.05);
    }
    X.sfx(0.27, 'impact', { gain: 0.7 }); X.sfx(0.28, 'stamp', { gain: 0.6, pitch: 0.8 }); X.sfx(0.31, 'paper', { dur: 0.4, gain: 0.4 });
  }

  // ================================================================ 1 · HOOK B — night plate: London 1720, a bubble rises (0.8 → h3)
  {
    const g = scene(tCut1, tCut2, PT.plate);
    S('rect', { x: 0, y: 0, width: W, height: H, fill: X.linear('pt-sky', [[0, '#141210'], [0.42, '#22201c'], [0.63, '#4b4841'], [0.69, '#2b2925'], [1, '#100f0d']]) }, g);
    const pc = S('g', {}, g); gsap.set(pc, { svgOrigin: '540 1150' });
    tl.fromTo(pc, { scale: 1.0, y: -40 }, { scale: 1.16, y: 160, duration: tCut2 - tCut1, ease: 'sine.inOut', immediateRender: false }, tCut1);
    const r = X.rand(17);
    for (let i = 0; i < 26; i++) S('circle', { cx: r() * W, cy: r() * 900, r: 1 + r() * 1.6, fill: '#d8d2c4', opacity: 0.2 + r() * 0.35 }, pc);
    // bubble (behind the skyline): thin cream skin, highlight arcs, gold rim, skyline reflection
    const bub = S('g', {}, pc);
    S('circle', { cx: 0, cy: 0, r: 250, fill: X.radial('pt-bub', [[0, '#efe6d2', 0], [0.82, '#efe6d2', 0.04], [1, '#e8c98a', 0.16]]) }, bub);
    S('circle', { cx: 0, cy: 0, r: 250, fill: 'none', stroke: '#efe6d2', 'stroke-width': 3, opacity: 0.75 }, bub);
    S('circle', { cx: 0, cy: 0, r: 238, fill: 'none', stroke: C.gold, 'stroke-width': 2, opacity: 0.35 }, bub);
    S('path', { d: 'M-190,-90 A205,205 0 0 1 -70,-196', fill: 'none', stroke: '#ffffff', 'stroke-width': 9, 'stroke-linecap': 'round', opacity: 0.55 }, bub);
    S('path', { d: 'M150,140 A205,205 0 0 1 80,190', fill: 'none', stroke: '#ffffff', 'stroke-width': 5, 'stroke-linecap': 'round', opacity: 0.35 }, bub);
    S('path', { d: 'M-160,120 L-120,96 L-92,104 L-60,60 L-40,104 L10,90 L30,50 L52,90 L110,96 L160,118', fill: 'none', stroke: '#cfc6b3', 'stroke-width': 3, opacity: 0.25 }, bub);
    tl.fromTo(bub, { x: 560, y: 1330, scale: 0.55 }, { x: 545, y: 820, scale: 1.12, duration: tCut2 - tCut1, ease: 'power1.out', immediateRender: false }, tCut1);
    X.every((t) => { if (t < tCut1 || t > tCut2) return; const k = Math.sin(t * 5.1) * 0.018; bub.firstChild.setAttribute('transform', `scale(${1 + k} ${1 - k})`); });
    X.sfx(tCut1 + 0.05, 'bubble', { gain: 0.35, pitch: 0.8 });
    // embers / gold specks drifting up
    for (let i = 0; i < 16; i++) {
      const c = S('circle', { cx: 0, cy: 0, r: 2 + r() * 3, fill: '#e2bd6a', opacity: 0 }, pc), x0 = 100 + r() * 880, d0 = r() * 3;
      tl.fromTo(c, { attr: { cx: x0, cy: 1280 }, opacity: 0 }, { attr: { cx: x0 + (r() - 0.5) * 120, cy: 820 - r() * 300 }, opacity: 0.8, duration: 2.6, ease: 'none', immediateRender: false }, tCut1 + d0 * 0.5);
      tl.to(c, { opacity: 0, duration: 0.6 }, tCut1 + d0 * 0.5 + 2.0);
    }
    // skyline: rooftops, St Paul's-style dome, spires; ships' masts on the left
    const sky = S('g', {}, pc);
    let d = 'M0,1255 ';
    for (let x = 0; x <= W; x += 36) { const hh = 1180 + r() * 60; d += `L${x},${hh} L${x + 30},${hh} `; }
    d += `L${W},1500 L0,1500 Z`;
    S('path', { d, fill: '#0f0e0c' }, sky);
    S('path', { d: 'M560,1190 L560,1100 A110,110 0 0 1 780,1100 L780,1190 Z M655,990 L685,990 L685,940 L670,915 L655,940 Z M640,1000 L700,1000 L700,990 L640,990 Z', fill: '#0f0e0c' }, sky);
    for (const [sx, sh] of [[190, 260], [420, 200], [905, 230], [1010, 170]]) S('path', { d: `M${sx - 22},1200 L${sx - 22},${1200 - sh * 0.45} L${sx},${1200 - sh} L${sx + 22},${1200 - sh * 0.45} L${sx + 22},1200 Z`, fill: '#0f0e0c' }, sky);
    const rim = S('path', { d: 'M560,1100 A110,110 0 0 1 780,1100 M655,940 L670,915 L685,940', fill: 'none', stroke: C.plateHi, 'stroke-width': 3, opacity: 0.6 }, sky);
    for (const [sx, sh] of [[190, 260], [420, 200], [905, 230], [1010, 170]]) S('path', { d: `M${sx - 22},${1200 - sh * 0.45} L${sx},${1200 - sh} L${sx + 22},${1200 - sh * 0.45}`, fill: 'none', stroke: C.plateHi, 'stroke-width': 2.5, opacity: 0.55 }, sky);
    for (let i = 0; i < 40; i++) { const c = S('rect', { x: 20 + r() * 1040, y: 1195 + r() * 70, width: 6, height: 8, fill: '#d9b46a', opacity: 0.5 + r() * 0.4 }, sky); if (i % 3 === 0) tl.to(c, { opacity: 0.15, duration: 0.2, yoyo: true, repeat: 5 }, tCut1 + r() * 2); }
    const ships = S('g', { stroke: C.plateHi, 'stroke-width': 2.5, fill: 'none', opacity: 0.8 }, pc);
    for (const sx of [70, 165, 250]) { S('path', { d: `M${sx},1290 L${sx},960 M${sx - 40},1040 L${sx + 40},1040 M${sx - 32},1120 L${sx + 32},1120 M${sx},960 L${sx + 70},1250 M${sx},980 L${sx - 60},1250` }, ships); S('path', { d: `M${sx - 60},1290 L${sx + 60},1290 L${sx + 44},1320 L${sx - 44},1320 Z`, fill: '#0f0e0c' }, ships); }
    tl.to(ships, { y: 160, opacity: 0, duration: 0.6, ease: 'power2.in' }, w('h2', 'ships') - 0.05);
    X.sfx(w('h2', 'ships'), 'woosh_low', { dur: 0.5, gain: 0.3 });
    // mist band + river strokes
    S('rect', { x: 0, y: 1150, width: W, height: 170, fill: X.linear('pt-mist', [[0, '#d8d2c4', 0], [0.5, '#d8d2c4', 0.16], [1, '#d8d2c4', 0]]) }, pc);
    for (let i = 0; i < 30; i++) S('rect', { x: r() * W, y: 1330 + r() * 260, width: 40 + r() * 140, height: 2, fill: C.plateHi, opacity: 0.12 + r() * 0.2 }, pc);
    // a rocket streak on "spice": gold starburst
    const rk = S('path', { d: 'M880,1180 Q820,760 700,560', fill: 'none', stroke: '#e9d3a0', 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.8 }, pc);
    const ts = w('h2', 'spice');
    X.drawOn(rk, ts - 0.55, 0.5, 'power1.out'); tl.to(rk, { opacity: 0, duration: 0.3 }, ts + 0.1);
    for (let i = 0; i < 18; i++) {
      const a = i / 18 * Math.PI * 2, ray = S('line', { x1: 700, y1: 560, x2: 700, y2: 560, stroke: i % 2 ? '#e9b35c' : '#f4e7c8', 'stroke-width': 4, 'stroke-linecap': 'round', opacity: 0 }, pc);
      tl.fromTo(ray, { attr: { x1: 700, y1: 560, x2: 700, y2: 560 }, opacity: 1 }, { attr: { x1: 700 + Math.cos(a) * 60, y1: 560 + Math.sin(a) * 60, x2: 700 + Math.cos(a) * 170, y2: 560 + Math.sin(a) * 170 }, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, ts);
    }
    X.sfx(ts - 0.55, 'whoosh', { dur: 0.5, gain: 0.3, pitch: 1.4 }); X.sfx(ts, 'sparkle', { dur: 0.6, gain: 0.35 });
  }

  // ================================================================ 2 · DESK COUPLET — bill of lading, price tags (h3 → step 1)
  {
    const t0 = tCut2, g = scene(t0, T[1] + 0.02);
    PT.cam.set(0, { x: 0, y: 0, s: 1, r: 0 }); const tp0 = w('h3', 'price');
    PT.cam.set(t0, { x: -40, y: -330, s: 1.08 }).to(t0, { x: 80, y: 60, s: 1.1 }, tp0 - 0.3 - t0, 'sine.inOut').to(tp0 - 0.3, { x: 120, y: 200, s: 1.1 }, 0.45, 'power3.inOut').to(tp0 + 0.15, { x: 150, y: 290, s: 1.16 }, T[1] - tp0 - 0.15, 'sine.inOut');
    PT.ghost(g, { x: -260, y: 120, w: 520, h: 680, rot: 8, seed: 3 });
    PT.ghost(g, { x: 760, y: 1250, w: 560, h: 640, rot: -6, seed: 4, yellow: true });
    const bill = PT.doc(g, { x: 80, y: 190, w: 640, h: 760, rot: -4, paper: C.warm });
    const b = bill.body;
    PT.text(b, 'BILL OF LADING', 50, 100, { f: 'head', size: 54, ls: 2 });
    PT.text(b, 'Shipped in good order on board', 50, 150, { f: 'serif', size: 26, italic: true, fill: C.ink2 });
    PT.rule(b, 50, 176, 540, { th: 2 });
    const rows = ['Cargo', 'Cargo', 'Cargo', 'Cargo'];
    rows.forEach((s, i) => { PT.text(b, s, 50, 260 + i * 70, { f: 'mono', size: 30 }); PT.lines(b, 190, 242 + i * 70, 380, 1, { seed: 10 + i, last: false, th: 12 }); });
    PT.lines(b, 50, 560, 540, 3, { seed: 7 });
    PT.text(b, 'bound for the South Seas · 1720', 50, 700, { f: 'mono', size: 22, fill: C.grey });
    PT.drop(bill, t0 + 0.02);
    const tc = w('h3', 'cargo');
    PT.scrawl(b, tc, 'M40,250 C200,236 420,262 590,244 M40,320 C220,300 430,330 590,312 M40,392 C230,378 420,400 590,386', { w: 9, dur: 0.4 });
    PT.hand(b, tc + 0.35, 'not this', 330, 520, { size: 70, rot: -8 });
    const tp = w('h3', 'price');
    const tag1 = PT.tag(g, 560, 860, { rot: -10 });
    PT.text(tag1.g, 'PRICE', 70, 48, { f: 'mono', size: 24, ls: 4 });
    PT.text(tag1.g, '£100', 70, 125, { f: 'serif', size: 76, weight: 700 });
    gsap.set(tag1.g, { opacity: 0 }); tl.set(tag1.g, { opacity: 1 }, tp - 0.22);
    tl.fromTo(tag1.g, { scale: 1.6, rotation: 4, x: 620, y: 760 }, { scale: 1, rotation: -10, x: 560, y: 860, duration: 0.22, ease: 'power2.in', immediateRender: false }, tp - 0.22);
    X.sfx(tp, 'thud', { gain: 0.25, pitch: 1.3 });
    const tf = w('h4', 'fool');
    const tag2 = PT.tag(g, 600, 1060, { rot: 7, paper: '#e9dcc0' });
    PT.text(tag2.g, 'PRICE', 70, 48, { f: 'mono', size: 24, ls: 4 });
    PT.text(tag2.g, '£200', 70, 125, { f: 'serif', size: 76, weight: 700 });
    gsap.set(tag2.g, { opacity: 0 }); tl.set(tag2.g, { opacity: 1 }, tf - 0.2);
    tl.fromTo(tag2.g, { scale: 1.6, rotation: 18, x: 700, y: 960 }, { scale: 1, rotation: 7, x: 600, y: 1060, duration: 0.2, ease: 'power2.in', immediateRender: false }, tf - 0.2);
    X.sfx(tf, 'thud', { gain: 0.25, pitch: 1.2 });
    PT.stamp(g, w('h4', 'twice'), ['SOLD', 'AGAIN'], 780, 1010, { size: 62, rot: -9 });
  }

  // ================================================================ STEP CARDS + top-right tags
  PT.stepCard(T[1], { n: 1, exit: E[1], seed: 31, x: 180, y: 1500 });
  PT.stepCard(T[2], { n: 2, exit: E[2], seed: 32, x: 300, y: 260 });
  PT.stepCard(T[3], { n: 3, exit: E[3], seed: 33, x: 980, y: 1300 });
  PT.stepCard(T[4], { n: 4, exit: E[4], seed: 34, x: 120, y: 700 });
  PT.stepCard(T[5], { n: 5, exit: E[5], seed: 35, x: 940, y: 420 });
  PT.stepCard(T[6], { big: true, small: 'LAST', label: 'STEP', exit: E[6], seed: 36, x: 900, y: 1500 });
  for (const k of [1, 2, 3, 4, 5]) PT.stepTag(E[k] + 0.12, T[k + 1], 'STEP ' + k);   // tag appears once the red sheet is gone
  // (LAST STEP tags are declared after the dark plate times are known)

  // ================================================================ STEP 1 — the charter (1711), then the trade account
  {
    const g = scene(T[1], T[2] + 0.02);
    const t1 = L('s1c').start - 0.1;
    PT.cam.set(T[1] + 0.02, frame(110, 150, 890, 1150, { top: 170, s: 1.22 })).to(E[1] - 0.1, frame(110, 150, 890, 1150, { top: -90, s: 1.38, dx: 40 }), t1 - E[1] - 0.15, 'sine.inOut')
      .to(t1 - 0.25, frame(1180, 380, 1940, 1140, { top: 110, s: 1.3 }), 0.28, 'expo.inOut').to(t1 + 0.1, frame(1180, 380, 1990, 1190, { top: -120, s: 1.32, dx: 30 }), T[2] - t1 - 0.1, 'sine.inOut');
    PT.ghost(g, { x: 820, y: 1000, w: 520, h: 680, rot: 12, seed: 19 });
    PT.ghost(g, { x: 640, y: -120, w: 560, h: 700, rot: 10, seed: 5 });
    PT.ghost(g, { x: -300, y: 1100, w: 600, h: 760, rot: -7, seed: 6, red: true });
    const ch = PT.doc(g, { x: 110, y: 150, w: 780, h: 1000, rot: -2, paper: C.parch, edge: 'deckle', tex: 0.07 });
    const b = ch.body;
    PT.text(b, 'LETTERS PATENT', 60, 90, { f: 'mono', size: 26, ls: 6, fill: C.ink2 });
    PT.rule(b, 60, 112, 660, { th: 2 });
    PT.text(b, 'CHARTER', 60, 220, { f: 'head', size: 104, ls: 3 });
    PT.text(b, 'of the Governor and Company of Merchants', 60, 285, { f: 'serif', size: 30, italic: true, fill: C.ink2 });
    PT.text(b, 'of Great Britain trading to the South Seas', 60, 327, { f: 'serif', size: 30, italic: true, fill: C.ink2 });
    const yr = PT.text(b, '1711', 60, 500, { f: 'serif', size: 150, weight: 700 });
    PT.lines(b, 60, 560, 660, 6, { seed: 12, lh: 32 });
    const sole = PT.text(b, 'SOLE TRADE TO THE SOUTH SEAS', 60, 810, { f: 'mono', size: 30, weight: 700 });
    PT.lines(b, 60, 850, 420, 3, { seed: 13, lh: 32 });
    gsap.set(yr, { opacity: 0 }); tl.to(yr, { opacity: 1, duration: 0.15 }, E[1] + 0.1);
    const sealG = S('g', {}, b); PT.seal(sealG, 640, 830, { r: 74, letter: 'S' });
    gsap.set(sealG, { opacity: 0 }); tl.set(sealG, { opacity: 1 }, E[1] + 0.25);
    tl.fromTo(sealG, { scale: 2.4, rotation: 25, svgOrigin: '640 830' }, { scale: 1, rotation: 0, svgOrigin: '640 830', duration: 0.18, ease: 'power3.in', immediateRender: false }, E[1] + 0.25);
    X.sfx(E[1] + 0.43, 'thud', { gain: 0.35 }); PT.shake(E[1] + 0.43, 4, 0.2);
    const tm = w('s1b', 'monopoly');
    PT.hl(b, tm - 0.25, 52, 782, 600, 40, { dur: 0.3 });
    PT.stamp(b, tm + 0.05, 'MONOPOLY', 420, 680, { size: 84, rot: -8 });
    // the trade account slides over: "it never pays?"
    const led = PT.doc(g, { x: 1180, y: 380, w: 760, h: 760, rot: 3, paper: C.paper });
    const lb = led.body;
    PT.text(lb, 'TRADE ACCOUNT', 50, 100, { f: 'head', size: 56, ls: 2 });
    PT.text(lb, 'returns from the South Sea monopoly', 50, 146, { f: 'serif', size: 26, italic: true, fill: C.ink2 });
    PT.rule(lb, 50, 172, 660, { th: 3 });
    PT.text(lb, 'YEAR', 50, 224, { f: 'mono', size: 24, fill: C.grey, ls: 2 }); PT.text(lb, 'PROFIT', 560, 224, { f: 'mono', size: 24, fill: C.grey, ls: 2 });
    for (let i = 0; i < 6; i++) { S('rect', { x: 50, y: 248 + i * 66, width: 660, height: 2, fill: C.rule }, lb); PT.text(lb, String(1714 + i), 50, 296 + i * 66, { f: 'mono', size: 30 }); PT.text(lb, '—', 600, 296 + i * 66, { f: 'mono', size: 30 }); }
    PT.text(lb, 'illustration · profits were never significant', 50, 720, { f: 'mono', size: 19, fill: C.grey });
    X.sfx(t1 - 0.2, 'swoosh', { dur: 0.4, gain: 0.3 });
    PT.scrawl(lb, w('s1c', 'pays') - 0.1, 'M640,240 C760,250 750,640 640,650 C540,660 520,250 650,232', { w: 8, dur: 0.45 });
    PT.hand(lb, w('s1c', 'Relax') - 0.05, 'next to nothing', 300, 690, { size: 62, rot: -6 });
    // paper and wax: a fan of certificates + a seal
    const tw = w('s1c', 'paper');
    const certs = [0, 1, 2].map((i) => PT.docs.cert(g, { x: 1430 + i * 45, y: 830 - i * 45, w: 560, h: 360, rot: -12 + i * 7 }));
    certs.forEach((c, i) => PT.slide(c, tw - 0.2 + i * 0.06, 'bottom', { dur: 0.26, sfx: i === 0 }));
    const s2 = S('g', {}, certs[2].body); PT.seal(s2, 470, 290, { r: 56, letter: 'S' });
    gsap.set(s2, { opacity: 0 }); const twx = w('s1c', 'wax');
    tl.set(s2, { opacity: 1 }, twx - 0.12); tl.fromTo(s2, { scale: 2.2, svgOrigin: '470 290' }, { scale: 1, svgOrigin: '470 290', duration: 0.12, ease: 'power3.in', immediateRender: false }, twx - 0.12);
    X.sfx(twx, 'thud', { gain: 0.35 }); PT.shake(twx, 4, 0.2);
  }

  // ================================================================ STEP 2 — swallow the debt (odometer), the cut
  {
    const g = scene(T[2], T[3] + 0.02);
    const ts = w('s2b', 'swapped'), tc = L('s2c').start - 0.12, tcut = w('s2c', 'cut');
    PT.cam.set(T[2] + 0.02, frame(70, 340, 1010, 980, { top: 170, s: 1.12 })).to(E[2] - 0.1, frame(70, 340, 1010, 980, { top: 70, s: 1.2, dx: 0 }), ts - E[2] - 0.25, 'sine.inOut')
      .to(ts - 0.35, frame(70, 340, 1010, 1240, { top: 160, s: 0.9 }), 0.4, 'power3.inOut').to(ts + 0.05, frame(70, 340, 1010, 1240, { top: 60, s: 0.98 }), tc - ts - 0.2, 'sine.inOut')
      .to(tc - 0.15, frame(1210, 240, 2070, 1140, { top: 110, s: 1.2 }), 0.28, 'expo.inOut').to(tc + 0.2, frame(1210, 240, 2070, 1140, { top: -170, s: 1.4, dx: 70 }), T[3] - tc - 0.2, 'sine.inOut');
    PT.ghost(g, { x: 880, y: -100, w: 520, h: 680, rot: -8, seed: 20 });
    PT.ghost(g, { x: -280, y: -80, w: 560, h: 700, rot: -9, seed: 7 });
    PT.ghost(g, { x: 700, y: 1180, w: 600, h: 700, rot: 6, seed: 8, yellow: true });
    const dd = PT.doc(g, { x: 70, y: 340, w: 940, h: 640, rot: -1.5, paper: C.paper });
    const b = dd.body;
    PT.text(b, 'NATIONAL DEBT', 50, 105, { f: 'head', size: 64, ls: 1 });
    PT.text(b, '1719', 890, 105, { f: 'head', size: 64, fill: C.red, anchor: 'end' });
    PT.rule(b, 50, 130, 840, { th: 3 });
    PT.text(b, 'UNCONSOLIDATED · OFFERED TO THE COMPANY', 50, 176, { f: 'mono', size: 23, ls: 2, fill: C.ink2 });
    const od = PT.odometer(b, 50, 230, { digits: 8, prefix: '£', cw: 82, ch: 122, size: 104, to: 30981712 });
    PT.text(b, 'to be swapped for South Sea shares', 50, 470, { f: 'serif', size: 32, fill: C.ink2 });
    PT.text(b, 'SOURCE: SOUTH SEA SCHEME, 1719–20 · £30,981,712', 50, 590, { f: 'mono', size: 20, fill: C.grey, ls: 1 });
    od.run(E[2] + 0.05, 30981712, we('s2b', 'million') - E[2] - 0.05, 'power2.out');
    // bonds slide in, a certificate lands on them ("swapped for shares")
    const bonds = [0, 1, 2].map((i) => { const d = PT.doc(g, { x: 90 + i * 300, y: 1010 + (i % 2) * 30, w: 280, h: 170, rot: -6 + i * 5, paper: C.cream }); PT.text(d.body, 'ANNUITY', 30, 62, { f: 'mono', size: 26, ls: 3 }); PT.text(d.body, '£100', 30, 130, { f: 'serif', size: 54, weight: 700 }); return d; });
    bonds.forEach((d, i) => PT.slide(d, ts - 0.3 + i * 0.07, 'left', { dur: 0.25, sfx: i === 0 }));
    const cert = PT.docs.cert(g, { x: 330, y: 900, w: 520, h: 330, rot: 4 });
    PT.drop(cert, w('s2b', 'shares') - 0.2);
    // conversion card: higher price, bigger cut
    const cv = PT.doc(g, { x: 1210, y: 240, w: 860, h: 900, rot: 2, paper: '#d9caa9' });   // manila card
    const cb = cv.body;
    for (let i = 0; i <= 860; i += 43) S('rect', { x: i, y: 0, width: 1.5, height: 900, fill: '#b9a986', opacity: 0.6 }, cb);
    for (let i = 0; i <= 900; i += 43) S('rect', { x: 0, y: i, width: 860, height: 1.5, fill: '#b9a986', opacity: 0.6 }, cb);
    PT.text(cb, 'THE CONVERSION', 50, 100, { f: 'head', size: 58, ls: 1 });
    PT.text(cb, 'debt in, shares out — at the market price', 50, 150, { f: 'serif', size: 28, italic: true, fill: C.ink2 });
    const ax = S('path', { d: 'M90,780 L90,240 M90,780 L790,780', stroke: C.ink, 'stroke-width': 4, fill: 'none' }, cb);
    PT.text(cb, 'share price', 110, 270, { f: 'mono', size: 24, fill: C.grey });
    const line = S('path', { d: 'M100,740 C300,720 420,600 520,470 S700,300 780,260', stroke: C.ink, 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }, cb);
    X.sfx(tc - 0.05, 'swoosh', { dur: 0.4, gain: 0.3 });
    X.drawOn(line, w('s2c', 'Higher') - 0.05, 0.7, 'power1.inOut');
    const bars = [[200, 60], [360, 150], [520, 290], [680, 430]].map(([x, h], i) => { const r = S('rect', { x, y: 780 - h, width: 90, height: h, fill: i === 3 ? C.red : C.ink2, opacity: 0.9 }, cb); gsap.set(r, { scaleY: 0, svgOrigin: `${x} 780` }); tl.to(r, { scaleY: 1, duration: 0.22, ease: 'back.out(1.6)' }, tcut - 0.25 + i * 0.06); return r; });
    PT.text(cb, "the Company's surplus", 200, 830, { f: 'mono', size: 24, fill: C.ink2 });
    X.sfx(tcut - 0.2, 'pop', { gain: 0.25 });
    PT.hand(cb, w('s2c', 'Who') - 0.05, 'who cares?', 470, 400, { size: 66, rot: -10 });
  }

  // ================================================================ STEP 3 — friends: stock for ministers, the Act passes
  {
    const g = scene(T[3], T[4] + 0.02);
    const tb0 = w('s3c', 'bill');
    PT.cam.set(T[3] + 0.02, frame(80, 190, 1000, 1090, { top: 150, s: 1.12 })).to(E[3] - 0.1, frame(80, 190, 1000, 1090, { top: -110, s: 1.34, dx: 90 }), tb0 - E[3] - 0.2, 'sine.inOut')
      .to(tb0 - 0.3, frame(80, 110, 1000, 1230, { top: 70, s: 1.1 }), 0.3, 'power3.out').to(tb0 + 0.05, frame(80, 110, 1000, 1230, { top: -210, s: 1.24, dx: 30 }), T[4] - tb0 - 0.05, 'sine.inOut');
    PT.ghost(g, { x: 700, y: -140, w: 560, h: 680, rot: 9, seed: 9 });
    PT.ghost(g, { x: -320, y: 1150, w: 600, h: 700, rot: -5, seed: 10 });
    const al = PT.doc(g, { x: 80, y: 190, w: 920, h: 900, rot: -2, paper: C.warm });
    const b = al.body;
    PT.text(b, 'STOCK TAKEN IN · SPRING 1720', 50, 80, { f: 'mono', size: 24, ls: 3, fill: C.ink2 });
    PT.text(b, 'Allotments', 50, 180, { f: 'serif', size: 86, weight: 700 });
    PT.rule(b, 50, 210, 820, { th: 3 });
    PT.text(b, 'TO', 50, 262, { f: 'mono', size: 22, fill: C.grey, ls: 2 }); PT.text(b, 'PAID', 760, 262, { f: 'mono', size: 22, fill: C.grey, ls: 2 });
    const who = ['a Minister', 'a Secretary of State', 'a Duke', 'Members, several', 'friends of friends'];
    who.forEach((s, i) => { const y = 340 + i * 92; S('rect', { x: 50, y: y + 26, width: 820, height: 2, fill: C.rule }, b); PT.text(b, s, 50, y, { f: 'serif', size: 40, italic: true }); PT.text(b, '£0', 770, y, { f: 'mono', size: 40, weight: 700 }); });
    PT.text(b, 'illustration · names withheld', 50, 860, { f: 'mono', size: 19, fill: C.grey });
    const tn = w('s3b', 'Nothing');
    PT.hl(b, tn - 0.35, 752, 300, 110, 420, { dur: 0.32 });
    PT.stamp(b, tn + 0.1, ['NOTHING', 'PAID'], 470, 520, { size: 86, rot: -7, sub: false });
    PT.hand(b, w('s3c', 'back') - 0.05, 'sold back ↑', 520, 830, { size: 64, rot: -5 });
    // the Act drops on "bill" and a paper boat sails by
    const tb = w('s3c', 'bill');
    const act = PT.docs.act(g, { x: 80, y: 110, w: 920, h: 1120, rot: 1.5, seed: 21, title: ['for the South-Sea Company', 'to take in the national debt'], foot: 'APRIL 1720 · WORDING PARAPHRASED' });
    PT.drop(act, tb - 0.24);
    PT.out(al, tb - 0.2, 'left', { dur: 0.3 });
    PT.stamp(act.body, tb + 0.12, 'PASSED', 560, 760, { size: 96, rot: -9 });
    const boatO = S('g', {}, g), boat = S('g', {}, boatO);
    S('path', { d: 'M-90,0 L90,0 L60,40 L-60,40 Z', fill: '#efe9dc', stroke: '#9b927f', 'stroke-width': 3 }, boat);
    S('path', { d: 'M-40,0 L0,-90 L40,0 Z', fill: '#e2dccd', stroke: '#9b927f', 'stroke-width': 3 }, boat);
    S('path', { d: 'M0,-90 L0,0', stroke: '#9b927f', 'stroke-width': 2 }, boat);
    const ts = w('s3c', 'sails');
    gsap.set(boat, { opacity: 0 }); tl.set(boat, { opacity: 1 }, ts - 0.3);
    tl.fromTo(boat, { x: -200, y: 1060, rotation: -4, scale: 1.7 }, { x: 1300, y: 1020, rotation: 4, scale: 1.7, duration: 1.4, ease: 'power1.inOut', immediateRender: false }, ts - 0.3);
    X.sfx(ts - 0.2, 'slide', { dur: 0.9, gain: 0.3 });
  }

  // ================================================================ STEP 4 — the price chart climbs; rivals legislated away
  const chartDoc = { x: -160, y: 260, w: 2700, h: 1000 };
  const months = (m, d) => (m - 1 + d / 30) / 11.6;
  let chart, camSep;
  {
    const g = scene(T[4], T[6] + 0.02);
    const doc = PT.doc(g, { x: chartDoc.x, y: chartDoc.y, w: chartDoc.w, h: chartDoc.h, rot: 0, paper: C.warm, tex: 0.04 });
    for (let i = 0; i <= chartDoc.w; i += 54) S('rect', { x: i, y: 0, width: 1.2, height: chartDoc.h, fill: '#d5cdbd', opacity: 0.55 }, doc.body);
    PT.text(doc.body, 'SOUTH SEA STOCK · PRICE PER £100 SHARE, 1720', 260, 90, { f: 'mono', size: 26, ls: 2, fill: C.ink2 });
    PT.text(doc.body, 'approximate, from published price histories', 260, 128, { f: 'mono', size: 20, fill: C.grey });
    chart = PT.chart(doc.body, {
      x: 260, y: 200, w: 2300, h: 640, vmin: 0, vmax: 1100, grid: [250, 500, 750, 1000], gridLabelX: [-120, 2320],
      fmt: (v) => '£' + Math.round(v).toLocaleString('en-GB'), tagFmt: (v) => '£' + Math.round(v).toLocaleString('en-GB'),
      data: [[months(1, 1), 128], [months(1, 20), 135], [months(2, 15), 175], [months(3, 15), 330], [months(4, 20), 360], [months(5, 31), 550], [months(6, 6), 890], [months(6, 25), 750], [months(7, 20), 800], [months(8, 5), 1000], [months(8, 25), 820], [months(9, 15), 400], [months(9, 30), 150], [months(11, 1), 140], [months(12, 20), 100]],
      xlabels: [[months(1, 1), 'JAN 1720'], [months(4, 1), 'APR'], [months(7, 1), 'JUL'], [months(10, 1), 'OCT']], sw: 7, jitter: 10, seed: 3,
    });
    // fraction of the path at a given month (path is monotone in x)
    const fracAt = (u) => { const X0 = chart.px(u); let lo = 0, hi = chart.L; for (let k = 0; k < 30; k++) { const m = (lo + hi) / 2; if (chart.path.getPointAtLength(m).x < X0) lo = m; else hi = m; } return lo / chart.L; };
    const toWorld = (u, v) => [chartDoc.x + 260 + chart.px(u), chartDoc.y + 200 + chart.py(v)];
    const camOn = (u, v, dy = 120) => { const [x, y] = toWorld(u, v); return { x: x - W / 2, y: y - H / 2 + dy }; };
    const tJ = w('s4a', 'January'), tK = w('s4b', 'thousand');
    const fJan = fracAt(months(1, 1)) + 0.0005, fAug = fracAt(months(8, 5)), fSep = fracAt(months(9, 30));
    tl.set(chart.prog, { p: 0.002 }, T[4]);
    PT.cam.set(T[4] + 0.02, { ...camOn(months(1, 1), 128, -60), s: 1.0, r: 0 });
    chart.draw(tJ - 0.15, fAug, tK + 0.3 - tJ, 'power1.in');
    PT.cam.to(tJ - 0.15, { ...camOn(months(8, 5), 1000, 260), s: 0.92 }, tK + 0.35 - tJ, 'power1.inOut');
    const lab = (u, v, t, a, b2, dx = 0, dy = -90) => { const [x, y] = [260 + chart.px(u) + dx, 200 + chart.py(v) + dy]; const lg = S('g', {}, doc.body); PT.text(lg, a, x, y, { f: 'serif', size: 46, weight: 700, anchor: 'middle' }); PT.text(lg, b2, x, y + 40, { f: 'mono', size: 28, anchor: 'middle', fill: C.ink2 }); gsap.set(lg, { opacity: 0 }); tl.to(lg, { opacity: 1, duration: 0.15 }, t); return lg; };
    lab(months(1, 1), 128, tJ, 'January', '£128', 40, -70);
    lab(months(8, 5), 1000, tK, 'August', '£1,000', -20, -110);
    const ring = S('circle', { cx: 260 + chart.px(months(8, 5)), cy: 200 + chart.py(1000), r: 40, fill: 'none', stroke: C.red, 'stroke-width': 6 }, doc.body);
    X.drawOn(ring, tK + 0.15, 0.3);
    // rivals: coffee-house handbills, then the Bubble Act (June 1720) shuts them out
    const tr = w('s4b', 'Rivals'), tLg = w('s4b', 'Legislate');
    const camRiv = { ...camOn(months(8, 5), 1000, 260), s: 0.92 };      // where the climb leaves the camera
    const gn = scene(tr - 0.2, T[5] + 0.02), fr = PT.atCam(gn, camRiv);  // fr: author in frame pixels
    const notes = [
      PT.docs.notice(fr, { x: 40, y: 190, rot: -7, head: ["AT JONATHAN'S", 'EXCHANGE ALLEY'], title: ['A New', 'Fishery'], foot: 'subscriptions taken', seed: 41, paper: '#e2d3b2' }),
      PT.docs.notice(fr, { x: 590, y: 140, rot: 6, head: ["AT GARRAWAY'S"], title: ['Improving', 'of Land'], foot: 'shares this day', seed: 42, paper: '#e2d3b2' }),
      PT.docs.notice(fr, { x: 330, y: 660, rot: -2, head: ['PROPOSALS'], title: ['A Timber', 'Trade'], foot: 'illustrative notice', seed: 43, paper: '#e2d3b2' }),
    ];
    notes.forEach((d, i) => PT.drop(d, tr - 0.2 + i * 0.12, { from: { scale: 1.5, rotation: (i - 1) * 8 } }));
    const ba = PT.docs.act(fr, { x: 150, y: 230, w: 780, h: 920, rot: -3, seed: 22, title: ['to restrain extravagant', 'undertakings — "the Bubble Act"'], n: 8, foot: 'JUNE 1720 · NO COMPANY WITHOUT A ROYAL CHARTER' });
    PT.drop(ba, tLg - 0.22);
    PT.stamp(ba.body, w('s4c', 'charter') + 0.05, 'ILLEGAL', 400, 720, { size: 100, rot: -10 });
    PT.stamp(ba.body, w('s4c', 'gate'), 'VOID', 620, 160, { size: 90, rot: 12 });
    PT.cam.to(tLg - 0.3, { x: camRiv.x + 60, y: camRiv.y + 170, s: 1.04 }, T[5] - tLg + 0.2, 'sine.inOut');
    // STEP 5: back to the peak, then the plunge to £150
    PT.cam.set(T[5] + 0.03, { ...camOn(months(8, 5), 1000, 200), s: 0.98 });
    PT.hand(doc.body, w('s5a', 'sell') - 0.05, 'SELL!', 260 + chart.px(months(8, 5)) - 330, 200 + chart.py(1000) - 40, { size: 84, rot: -8 });
    const tS = w('s5b', 'September'), tF = we('s5b', 'fifty');
    chart.draw(tS - 0.05, fSep, tF - tS + 0.1, 'power2.in');
    camSep = { ...camOn(months(9, 30), 150, 40), s: 0.86 };
    PT.cam.to(tS - 0.05, camSep, tF - tS + 0.35, 'power2.inOut');
    lab(months(9, 30), 150, tF - 0.05, 'September', '£150', 150, 90);
    const td = w('s5b', 'drop');
    PT.stamp(doc.body, td + 0.05, '−85%', 260 + chart.px(months(9, 30)) + 330, 200 + chart.py(150) - 260, { size: 110, rot: -6 });
  }

  // ================================================================ STEP 5b — Newton reportedly lost ~£20,000; gravity
  {
    const tn = L('s5c').start - 0.12;
    // the newspaper lands on the chart where the plunge parked the camera; the camera then pushes in slowly
    const g2 = PT.atCam(scene(tn - 0.05, T[6] + 0.02), camSep);
    PT.cam.to(tn - 0.1, { x: camSep.x - 40, y: camSep.y - 60, s: camSep.s * 1.12 }, 0.25, 'power2.out').to(tn + 0.2, { x: camSep.x + 50, y: camSep.y + 330, s: camSep.s * 1.32 }, T[6] - tn - 0.2, 'sine.inOut');
    const news = PT.docs.news(g2, { x: 90, y: 150, w: 900, h: 1080, rot: -2, paper: '#cfc8b8', mast: 'THE EXCHANGE COURANT', date: 'LONDON · AUTUMN 1720', head: ['SOUTH-SEA', 'AT £150'] });
    PT.drop(news, tn);
    const nb = news.body;
    const box = S('g', {}, nb);
    S('rect', { x: 470, y: 470, width: 360, height: 330, fill: '#efe9dc', stroke: C.ink2, 'stroke-width': 3 }, box);
    PT.text(box, 'Sir Isaac Newton,', 490, 530, { f: 'serif', size: 30, weight: 700 });
    PT.text(box, 'Master of the Mint,', 490, 570, { f: 'serif', size: 28, italic: true });
    PT.text(box, 'is reported to have', 490, 610, { f: 'serif', size: 28, italic: true });
    PT.text(box, 'lost about £20,000.', 490, 650, { f: 'serif', size: 28, italic: true });
    PT.text(box, 'ACCOUNTS VARY;', 490, 720, { f: 'mono', size: 19, fill: C.grey });
    PT.text(box, 'ONE ESTIMATE: ≥ £10,000', 490, 748, { f: 'mono', size: 19, fill: C.grey });
    PT.hl(box, w('s5c', 'twenty') - 0.2, 486, 622, 330, 40, { dur: 0.3 });
    // the apple: falls on "law", bounces, thud
    const ta = w('s5d', 'law');
    const ap = S('g', {}, g2);
    S('ellipse', { cx: 6, cy: 10, rx: 70, ry: 20, fill: '#2b2015', opacity: 0.25, filter: 'url(#pt-sblur2)', transform: 'translate(0 66)' }, ap);
    S('path', { d: 'M0,-48 C-30,-70 -78,-56 -78,-6 C-78,46 -40,78 -8,66 C0,62 6,62 12,66 C44,78 80,44 80,-6 C80,-56 34,-70 4,-48 Z', fill: '#8f8a3c', stroke: '#4c4a22', 'stroke-width': 4 }, ap);
    S('path', { d: 'M-46,-30 C-56,-10 -54,14 -44,30', fill: 'none', stroke: '#c9c47a', 'stroke-width': 8, 'stroke-linecap': 'round', opacity: 0.6 }, ap);
    S('path', { d: 'M2,-50 C2,-70 8,-84 16,-92', fill: 'none', stroke: '#4c3a22', 'stroke-width': 6, 'stroke-linecap': 'round' }, ap);
    S('path', { d: 'M14,-80 C30,-104 60,-100 66,-88 C50,-72 30,-70 14,-80 Z', fill: '#6f7a3a', stroke: '#3c4422', 'stroke-width': 3 }, ap);
    gsap.set(ap, { opacity: 0 }); tl.set(ap, { opacity: 1 }, ta - 0.32);
    tl.fromTo(ap, { x: 400, y: -150, rotation: -30 }, { x: 400, y: 760, rotation: 10, duration: 0.32, ease: 'power2.in', immediateRender: false }, ta - 0.32);
    tl.to(ap, { y: 680, rotation: 18, duration: 0.14, ease: 'power2.out' }, ta);
    tl.to(ap, { y: 760, rotation: 22, duration: 0.14, ease: 'power2.in' }, ta + 0.14);
    X.sfx(ta, 'thud', { gain: 0.5, pitch: 0.9 }); X.sfx(ta + 0.28, 'thud', { gain: 0.25, pitch: 1.1 }); PT.shake(ta, 6, 0.25);
    PT.scrawl(g2, w('s5d', 'came') - 0.1, 'M270,560 C276,650 276,750 272,850 M234,802 L272,860 L312,802', { w: 9, dur: 0.35 });
    PT.hand(g2, w('s5d', 'down') - 0.05, 'still', 200, 540, { size: 70, rot: -10 });
  }

  // ================================================================ LAST STEP — the inquiry (1721); the Chancellor to the Tower
  {
    const g = scene(T[6], w('l2', 'Tower') - 0.06);
    PT.cam.set(T[6] + 0.02, frame(2690, 160, 3590, 1140, { top: 140, s: 1.14 }));
    const ox = 2600;
    PT.ghost(g, { x: ox - 300, y: -60, w: 560, h: 700, rot: -10, seed: 11 });
    PT.ghost(g, { x: ox + 760, y: 1220, w: 600, h: 700, rot: 7, seed: 12, red: true });
    const rep = PT.doc(g, { x: ox + 90, y: 160, w: 900, h: 980, rot: 1.5, paper: C.paper });
    const b = rep.body;
    PT.text(b, 'HOUSE OF COMMONS · 1721', 50, 80, { f: 'mono', size: 26, ls: 4, fill: C.ink2 });
    PT.rule(b, 50, 104, 800, { th: 2 });
    PT.text(b, 'REPORT', 50, 230, { f: 'head', size: 120, ls: 4 });
    PT.text(b, 'from the Committee of Secrecy', 50, 296, { f: 'serif', size: 38, italic: true, fill: C.ink2 });
    PT.text(b, 'on the South Sea Company', 50, 342, { f: 'serif', size: 38, italic: true, fill: C.ink2 });
    PT.lines(b, 50, 410, 800, 13, { seed: 15, lh: 34 });
    PT.hl(b, w('l2', 'inquiry') - 0.2, 46, 404, 700, 24, { dur: 0.3 });
    PT.hl(b, w('l2', 'inquiry') + 0.1, 46, 506, 560, 24, { dur: 0.25, sfx: false });
    const ca = PT.doc(g, { x: ox + 110, y: 850, w: 640, h: 330, rot: -4, paper: C.cream });
    PT.text(ca.body, 'JOHN AISLABIE', 40, 90, { f: 'head', size: 56, ls: 2 });
    PT.text(ca.body, 'Chancellor of the Exchequer', 40, 140, { f: 'serif', size: 32, italic: true, fill: C.ink2 });
    PT.text(ca.body, 'EXPELLED FROM THE COMMONS · MARCH 1721', 40, 270, { f: 'mono', size: 20, fill: C.grey });
    PT.slide(ca, w('l2', 'Chancellor') - 0.28, 'bottom', { dur: 0.28 });
    const tw = w('l2', 'Tower');
    PT.cam.to(E[6] - 0.1, frame(2690, 160, 3590, 1180, { top: -170, s: 1.3 }), tw - E[6], 'sine.inOut');
    PT.stamp(ca.body, w('l2', 'in') - 0.05, 'EXPELLED', 430, 215, { size: 70, rot: -8 });
  }

  // ================================================================ DARK PLATE — the Tower at night (bookends the hook's night London)
  const tPlate = w('l2', 'Tower') - 0.1, tPile = w('t1', 'needs') - 0.04;
  {
    const g = scene(tPlate, tPile, PT.plate);
    S('rect', { x: 0, y: 0, width: W, height: H, fill: X.linear('pt-sky2', [[0, '#181614'], [0.5, '#262420'], [0.66, '#3d3a34'], [0.7, '#1f1d1a'], [1, '#121110']]) }, g);
    const pc = S('g', {}, g); gsap.set(pc, { svgOrigin: '540 1100' });
    tl.fromTo(pc, { scale: 1.08 }, { scale: 1.0, duration: tPile - tPlate, ease: 'power2.out', immediateRender: false }, tPlate);
    const r = X.rand(23);
    for (let i = 0; i < 22; i++) S('circle', { cx: r() * W, cy: r() * 800, r: 1 + r() * 1.4, fill: '#d8d2c4', opacity: 0.2 + r() * 0.3 }, pc);
    S('path', { d: 'M820,300 A60,60 0 1 0 880,400 A48,48 0 1 1 820,300 Z', fill: '#d8d2c4', opacity: 0.55 }, pc);
    // the White Tower: square keep, four corner turrets (one round), curtain wall, river
    const tw2 = S('g', { fill: '#0f0e0c', stroke: C.plateHi, 'stroke-width': 3 }, pc);
    S('path', { d: 'M90,1230 L90,1130 L130,1130 L130,1100 L170,1100 L170,1130 L910,1130 L910,1100 L950,1100 L950,1130 L990,1130 L990,1230 Z' }, tw2);
    S('path', { d: 'M300,1130 L300,760 L780,760 L780,1130 Z' }, tw2);
    for (const x of [300, 690]) S('path', { d: `M${x - 20},780 L${x - 20},610 L${x + 110},610 L${x + 110},780 Z` }, tw2);
    S('path', { d: 'M280,610 L280,560 A65,65 0 0 1 410,560 L410,610 Z' }, tw2);
    S('path', { d: 'M670,610 L670,575 L700,545 L770,545 L800,575 L800,610 Z' }, tw2);
    for (let x = 320; x < 780; x += 46) S('rect', { x, y: 730, width: 26, height: 30 }, tw2);
    for (const [x, y] of [[360, 860], [500, 860], [640, 860], [360, 990], [500, 990], [640, 990]]) S('path', { d: `M${x},${y + 60} L${x},${y + 20} A20,20 0 0 1 ${x + 40},${y + 20} L${x + 40},${y + 60} Z`, fill: '#d9b46a', stroke: 'none', opacity: 0.55 }, tw2);
    S('rect', { x: 0, y: 1150, width: W, height: 140, fill: X.linear('pt-mist2', [[0, '#d8d2c4', 0], [0.5, '#d8d2c4', 0.14], [1, '#d8d2c4', 0]]) }, pc);
    for (let i = 0; i < 26; i++) S('rect', { x: r() * W, y: 1250 + r() * 300, width: 40 + r() * 160, height: 2, fill: C.plateHi, opacity: 0.12 + r() * 0.2 }, pc);
    PT.text(pc, 'THE TOWER · 1721', 540, 470, { f: 'mono', size: 28, ls: 8, fill: '#bdb8ad', anchor: 'middle' });
    PT.stamp(pc, tPlate + 0.32, ['TO THE', 'TOWER'], 540, 1020, { size: 92, rot: -7, color: '#d1452c' });
    X.sfx(tPlate, 'woosh_low', { dur: 0.5, gain: 0.35 });
  }

  PT.stepTag(E[6] + 0.12, tPlate, 'LAST STEP'); PT.stepTag(tPlate, tPile, 'LAST STEP', { dark: true }); PT.stepTag(tPile, TP + 0.02, 'LAST STEP');

  // ================================================================ TWIST — pull back over the pile; your order slip lands on top
  {
    const t0 = tPile;
    const g = scene(t0 - 0.02, TP + 0.12);
    const ox = 5600;
    PT.cam.set(t0 - 0.02, { x: ox, y: 0, s: 1.3, r: 3 }).to(t0, { x: ox, y: 0, s: 0.64, r: -2 }, 1.1, 'power3.out');
    const pile = [
      () => PT.docs.cert(g, { x: ox - 520, y: -260, w: 560, h: 360, rot: -16 }),
      () => PT.docs.act(g, { x: ox + 640, y: -380, w: 620, h: 760, rot: 12, title: ['for the South-Sea Company'], n: 6, seed: 23 }),
      () => PT.docs.news(g, { x: ox - 640, y: 760, w: 640, h: 760, rot: 9, mast: 'THE COURANT', head: ['CRASH'] }),
      () => PT.docs.notice(g, { x: ox + 700, y: 1100, rot: -12, title: ['A New', 'Scheme'], seed: 44 }),
      () => PT.docs.cert(g, { x: ox + 820, y: 520, w: 520, h: 340, rot: 22, title: 'STOCK' }),
      () => PT.docs.cert(g, { x: ox - 380, y: 1560, w: 520, h: 340, rot: -6 }),
    ];
    PT.ghost(g, { x: ox - 900, y: 300, w: 600, h: 760, rot: 14, seed: 13 });
    PT.ghost(g, { x: ox + 1240, y: 200, w: 600, h: 760, rot: -11, seed: 14, yellow: true });
    PT.ghost(g, { x: ox + 200, y: -720, w: 640, h: 760, rot: 4, seed: 15 });
    PT.ghost(g, { x: ox + 100, y: 1950, w: 640, h: 760, rot: -4, seed: 16, red: true });
    pile.forEach((f) => f());
    // a modern order slip — the viewer
    const tb = w('t1', 'buyer');
    const slip = PT.doc(g, { x: ox + 170, y: 520, w: 740, h: 640, rot: -3, paper: C.slip });
    const b = slip.body;
    PT.text(b, 'ORDER', 50, 110, { f: 'head', size: 78, ls: 2 });
    S('rect', { x: 380, y: 52, width: 54, height: 54, fill: 'none', stroke: C.ink, 'stroke-width': 4 }, b);
    S('path', { d: 'M388,60 L426,98 M426,60 L388,98', stroke: C.ink, 'stroke-width': 5 }, b);
    PT.text(b, 'BUY', 448, 98, { f: 'mono', size: 30, weight: 700 });
    S('rect', { x: 540, y: 52, width: 54, height: 54, fill: 'none', stroke: C.ink, 'stroke-width': 4 }, b);
    PT.text(b, 'SELL', 608, 98, { f: 'mono', size: 30, weight: 700 });
    PT.rule(b, 50, 140, 640, { th: 3 });
    const rows = [['Name', 'you'], ['Asset', "everyone's favourite"], ['Price', 'at the market']];
    rows.forEach(([k, v], i) => { PT.text(b, k, 50, 230 + i * 92, { f: 'mono', size: 28, fill: C.grey }); PT.text(b, v, 210, 232 + i * 92, { f: 'serif', size: 44, weight: i === 0 ? 700 : 400, italic: i > 0 }); S('rect', { x: 200, y: 248 + i * 92, width: 490, height: 2, fill: C.rule }, b); });
    PT.text(b, 'filled at the top', 50, 590, { f: 'mono', size: 20, fill: C.grey });
    PT.drop(slip, tb - 0.24);
    PT.cam.to(tb - 0.1, { x: ox + 30, y: 60, s: 0.95, r: 0 }, 0.9, 'power2.inOut').to(tb + 0.8, { x: ox + 120, y: 260, s: 1.08, r: 1 }, TP - tb - 0.8, 'sine.inOut');
    PT.stamp(b, w('t2', 'portfolio'), ['LAST', 'BUYER'], 520, 420, { size: 78, rot: -9 });
    PT.scrawl(b, w('t2', 'higher') - 0.1, 'M120,600 C260,560 420,420 560,250 M500,262 L566,244 L560,316', { w: 9, dur: 0.4 });
  }

  // ================================================================ END — black ink blot, poll card, wordmark
  {
    const g = scene(TP + 0.02, null);
    PT.cam.set(TP + 0.02, { x: 0, y: 40, s: 1, r: 0 }).to(TP + 0.3, { x: 0, y: -30, s: 1.05 }, END - TP - 0.3, 'sine.inOut');
    PT.blot(TP, { x: W - 220, y: 380, hold: 0.13, rx: 160, ry: H - 300, seed: 71 });
    PT.ghost(g, { x: -300, y: 1300, w: 600, h: 700, rot: -8, seed: 17, op: 0.7 });
    PT.ghost(g, { x: 760, y: -260, w: 560, h: 640, rot: 9, seed: 18, op: 0.7 });
    PT.poll(g, TP + 0.2, { q: 'Who blows a bubble?', options: ['The company', 'The politicians', 'The newspapers', 'The buyers'], brand: 'ledgerline', y: 420 });
    for (let i = 0; i < 4; i++) X.sfx(TP + 0.45 + i * 0.08, 'click', { gain: 0.12 });
  }

  // ================================================================ captions (dark style on the night plates)
  const chunks = PT.captions(script, { dark: [[0, tCut2], [tPlate, tPile]], end: TP + 0.02 });
  // a quick camera re-frame on every new caption line that plays on the desk (not on cards / plates / the poll)
  const busy = [[0, tCut2 + 0.3], [tPlate - 0.3, tPile + 0.3], [TP - 0.3, END + 1], ...[1, 2, 3, 4, 5, 6].map((k) => [T[k] - 0.3, E[k] + 0.35])];
  const rb = X.rand(404);
  chunks.forEach((c, i) => {
    if (busy.some(([a, b]) => c.t0 >= a && c.t0 <= b)) return;
    const sgn = i % 2 ? 1 : -1;
    PT.bump(c.t0 - 0.06, sgn * (90 + rb() * 60), (rb() - 0.35) * 150, 0.035 + rb() * 0.035);
    X.sfx(c.t0 - 0.06, 'woosh_low', { dur: 0.25, gain: 0.12 });
  });
  X.end(END);
});
