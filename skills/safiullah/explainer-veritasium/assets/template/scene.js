/* explainer-veritasium starter — one insert block in the glow-on-black look, exercising the kit:
 * B-roll card → dipole field lines with particles riding them (RK4) → a graph that draws with labelled axes →
 * a real Dijkstra trace on a node-edge graph with a step counter. Every visual change sits on a narrated word. */
X.boot(async (X) => {
  await X.loadVO();
  const C = V.C, tl = X.tl, W = (id, w, n) => X.word(id, w, n), L = (id) => X.line(id);
  const END = X.vo.duration || 22;
  const T = { field: L('field').start, graph: L('graph').start, algo: L('algo').start };

  // ---------------------------------------------------------------- 1. field lines of a dipole (+ red, − blue)
  X.scene('field', T.field, T.graph, (g, t0) => {
    const P = [760, 540], N = [1160, 540];
    const E = (x, y) => {                                   // Coulomb field of +1 at P and −1 at N (per-frame-free: static)
      let ex = 0, ey = 0;
      for (const [cx, cy, q] of [[P[0], P[1], 1], [N[0], N[1], -1]]) {
        const dx = x - cx, dy = y - cy, r2 = dx * dx + dy * dy + 1, r3 = r2 * Math.sqrt(r2);
        ex += q * dx / r3; ey += q * dy / r3;
      }
      return [ex, ey];
    };
    const lines = [];
    for (let k = 0; k < 14; k++) {
      const a = (k + 0.5) / 14 * 2 * Math.PI;
      lines.push(V.fieldLine(E, [P[0] + 30 * Math.cos(a), P[1] + 30 * Math.sin(a)], { step: 4, max: 900, stop: (x, y) => Math.hypot(x - N[0], y - N[1]) < 28 }));
    }
    const lg = X.svg('g', {}, g);
    const tLines = W('field', 'lines');
    lines.forEach((pts, i) => {
      const p = X.svg('path', { d: V.pathD(pts), fill: 'none', stroke: C.ink, 'stroke-width': 2.5, opacity: 0.55 }, lg);
      X.drawOn(p, tLines + i * 0.06, 1.0, 'none');                 // data draws linearly, staggered 2 frames
    });
    X.sfx(tLines, 'swoosh', { dur: 1.0, gain: 0.18 });
    V.flowParticles(g, lines, { per: 2, speed: 140, t0: W('field', 'leave'), r: 5, color: C.yellow });
    const charge = (xy, col, sym, t) => {
      const c = X.svg('g', {}, g);
      X.svg('circle', { cx: xy[0], cy: xy[1], r: 26, fill: col, filter: V.bloom('vb-q', 8) }, c);
      X.svg('text', { x: xy[0], y: xy[1] + 14, 'text-anchor': 'middle', 'font-family': V.F.caps, 'font-size': 44, 'font-weight': 600, fill: C.ink, text: sym }, c);
      X.pop(c, t, { dur: 0.17, ease: 'back.out(1.4)', sfx: 'blip', gain: 0.3 });
    };
    charge(P, C.red, '+', W('field', 'positive'));
    charge(N, C.blue, '−', W('field', 'negative'));
  });

  // ---------------------------------------------------------------- 2. graph: |E| along the perpendicular bisector
  X.scene('graph', T.graph, T.algo, (g, t0) => {
    const a = 1, f = (r) => 1 / Math.pow(r * r + a * a, 1.5);    // exact dipole field on the bisector (arb. units)
    const lf = (r) => Math.log10(f(r));                            // log axis, so "÷ 8" far out is visible
    const ax = V.axes(g, { x: 360, y: 220, w: 1200, h: 560, xr: [0, 10], yr: [-3.3, 0.15], xLabel: 'distance', yLabel: 'field strength (log)', t: t0 + 0.05 });
    const curve = V.plot(ax, lf, { xr: [0, 10], color: C.yellow, width: 4, glow: true });
    V.reveal(curve, t0 + 0.4, 1.6, [340, 150, 1260, 700]);
    const R1 = 5, R2 = 10, tw = W('graph', 'twice'), ratio = f(R1) / f(R2);
    [[R1, 0], [R2, 0.25]].forEach(([r, d]) => {
      const x = ax.X(r), y = ax.Y(lf(r));
      const dot = X.svg('circle', { cx: x, cy: y, r: 10, fill: C.yellow, filter: V.bloom('vb-dot', 4) }, g);
      X.pop(dot, tw + d, { dur: 0.17, ease: 'back.out(1.4)', sfx: d ? false : 'tick', gain: 0.3 });
      const v = X.svg('line', { x1: x, x2: x, y1: ax.Y(-3.3), y2: y + 12, stroke: C.grey, 'stroke-width': 2, 'stroke-dasharray': '8 8' }, g);
      gsap.set(v, { opacity: 0 }); tl.set(v, { opacity: 1 }, tw + d);
    });
    const lab = V.math(g, ax.X(R2) - 30, ax.Y(lf(R2)) - 50, ['÷ ' + ratio.toFixed(1)], { size: 52, anchor: 'end', color: C.yellow });
    gsap.set(lab, { opacity: 0 }); tl.set(lab, { opacity: 1 }, W('graph', 'eight')); X.sfx(W('graph', 'eight'), 'blip_down', { gain: 0.3 });
  });

  // ---------------------------------------------------------------- 3. algorithm: Dijkstra, slow steps then a speed ramp
  X.scene('algo', T.algo, END + 1, (g, t0) => {
    const nodes = [[420, 560], [640, 330], [700, 760], [930, 520], [1000, 250], [1130, 800], [1300, 430], [1500, 640], [1560, 300]];
    const edges = [[0, 1, 4], [0, 2, 3], [1, 3, 3], [2, 3, 4], [1, 4, 5], [3, 4, 3], [2, 5, 6], [3, 5, 4], [3, 6, 5], [4, 6, 4], [5, 7, 5], [6, 7, 3], [6, 8, 4], [7, 8, 4]];
    const G = V.graph(g, nodes, edges, { r: 26, labels: nodes.map((_, i) => (i ? '∞' : '0')), weights: true, numSize: 28 });
    G.build(t0 + 0.05);
    const steps = V.dijkstra(nodes.length, edges, 0);
    const tS = W('algo', 'settle'), tN = W('algo', 'next');
    const times = steps.map((_, i) => (i === 0 ? tS : i === 1 ? tN : tN + 0.9 + (i - 2) * 0.32));   // 2 narrated steps, then faster
    V.playTrace(G, steps, times, { gap: 0.12 });
    const ctr = V.counter(g, { label: 'nodes settled', x: 120, y: 130, size: 64 });
    X.every((t) => { let n = 0; for (const s of times) if (t >= s + 0.25) n++; ctr.num.textContent = n; });
  });

  V.brollCard(0, T.field, { id: 'card-in' });
  X.end(END);
});
