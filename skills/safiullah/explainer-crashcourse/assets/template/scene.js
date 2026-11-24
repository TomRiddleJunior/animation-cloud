// Starter: host bookend → keyword card → cue line → stripe curtain → segment title → one story shot → sign-off →
// stripe exit → host. ~16 s demo ("octopuses have three hearts"). Swap ERA to see the 2014 / 2026 card grammar.
const ERA = '2012'; // '2012' stripe swipe card · '2014' light-leak flash card · '2026' host-in-panel card + torn-paper wipe

X.boot(async (X) => {
  await X.loadVO();
  const { C, F } = K;
  const W = (id, w, n) => X.word(id, w, n), WE = (id, w, n) => X.wordEnd(id, w, n), L = (id) => X.line(id);
  const Lhost = K.g(X.root), Lstory = K.g(X.root), Lover = K.g(X.root), Lfx = K.g(X.root);

  // ---- key times, all from VO words
  const tCurtain = W('cue', 'Daydream') + 0.2;
  const tReveal = K.stripeCurtain(Lfx, tCurtain);               // X3: orange-on-red curtain
  const tStory = L('story').start - 0.1;
  const out = K.stripeOut(Lfx, WE('signoff', 'Daydream') - 0.25); // leave the segment the same way
  const tHostB = out.tCovered;

  // ---- host bookend A (illustrated stand-in: never a real person)
  const drawHost = (parent, lines) => { const set = K.hostSet(parent); const h = K.host(set.mid, { front: set.front }); K.hostTalk(h, lines); return h; };
  const hostA = X.scene('hostA', 0, tCurtain + 4 * F, (g) => {
    const cam = X.cam(K.g(g));
    drawHost(cam, ['intro', 'cue']);
    X.tl.set(cam, { scale: 1.75, x: -165, y: 140 }, W('intro', 'Three', 1) - 0.04); // X16 jump cut wide → close
  }, Lhost);
  gsap.set(hostA, { autoAlpha: 1 }); // a scene starting at t = 0 must be made visible explicitly

  // keyword card on the new term — one per era
  const tTerm = W('intro', 'three') - 0.05;
  if (ERA === '2012') K.stripeSwipe(Lfx, tTerm, { word: 'THREE HEARTS', hold: 1.1 });
  if (ERA === '2014') K.flashCard(Lfx, tTerm, { word: 'THREE HEARTS', field: K.C14.magenta, hold: 1.2 });
  if (ERA === '2026') {
    const words = L('intro').words.map((w) => ({ w: w.w, t: w.start }));
    const tw = K.tornWipe(Lover, tTerm - 0.3, { color: K.C26.navy });   // X9, then X8 hard-cuts in on top
    X.tl.set(tw.g, { autoAlpha: 0 }, tCurtain + 3 * F);
    K.hostPanelCard(Lover, tTerm, tCurtain, { title: 'three hearts', words, drawHost: (pg) => { const w = K.g(pg); w.setAttribute('transform', 'translate(-660 -40) scale(0.92)'); drawHost(w, ['intro', 'cue']); } });
  }
  // X6 diamond badge on the cue (2012/2014 vocabulary; 2026 uses stickers / kinetic text instead)
  if (ERA !== '2026') K.diamond(Lover, W('cue', 'go'), tCurtain + 3 * F, { x: 330, y: 560, fill: C.mintDeep, hatch: 'rgba(255,255,255,0.18)', panel: [C.aqua, 'rgba(255,255,255,0.25)'],
    icon: (ig) => { K.circ(ig, 0, 0, 70, '#fff'); K.txt(ig, '?', 0, 34, { size: 100, fill: C.mintDeep }); } });

  // ---- segment title card (sits under the covering stripes, animates on reveal)
  K.titleCard(Lstory, tCurtain + 3 * F, tStory, { title: 'THE THREE-HEARTED OCTOPUS', tag: 'THE DAYDREAM', sub: 'a very short story about plumbing', at: tReveal - 3 * F });

  // ---- one story shot (flat, outline-free, drifting camera, build-ons on the nouns)
  X.scene('sea', tStory, tHostB + 2 * F, (g0) => {
    const g = K.drift(g0, tStory, tHostB, { s1: 1.1, x1: -40 });
    K.rect(g, -100, -100, 2120, 1280, C.mintDeep);
    K.rect(g, -100, 820, 2120, 400, C.sand); K.dunes(g, 820, [C.sandMid], { amp: 30 });
    for (let k = 0; k < 6; k++) K.ell(g, 200 + k * 320, 300 + (k % 3) * 120, 12, 12, 'rgba(255,255,255,0.45)');
    // octopus: head + 8 waving tentacles (one darker tone, no outlines)
    const oc = K.g(g); oc.setAttribute('transform', 'translate(760 560)');
    const arms = Array.from({ length: 8 }, (_, i) => K.path(oc, '', 'none', { stroke: i % 2 ? '#C9476B' : K.C.pink, 'stroke-width': 30, 'stroke-linecap': 'round' }));
    X.every((t) => arms.forEach((a, i) => {
      const x0 = -110 + i * 31, ph = t * 3 + i;
      a.setAttribute('d', `M${x0},60 Q${x0 + (i - 3.5) * 22 + 20 * Math.sin(ph)},180 ${x0 + (i - 3.5) * 40 + 30 * Math.sin(ph + 1)},260`);
    }));
    K.ell(oc, 0, -40, 150, 170, K.C.pink); K.ell(oc, 50, -60, 70, 120, '#C9476B');
    K.circ(oc, -50, 20, 14, C.ink); K.circ(oc, 40, 20, 14, C.ink);
    K.loop(K.wrap(oc), tStory, tHostB, (t) => ({ y: 14 * Math.sin(t * 2) }));
    // three heart badges: two on "gills", one on "third"
    const heart = (bg, col) => K.path(bg, 'M0,24 C-60,-14 -30,-56 0,-28 C30,-56 60,-14 0,24 Z', col);
    [[1200, 360, 'gills', 0], [1380, 360, 'gills', 1], [1290, 560, 'third', 0]].forEach(([x, y, w, n], i) => {
      const b = K.badge(g, x, y, 70, (bg) => heart(bg, i < 2 ? C.aqua : C.coral));
      X.pop(b, W('story', w) + n * 4 * F, { dur: 5 * F, ease: 'back.out(1.8)', sfx: 'pop', pitch: 1 + i * 0.12 });
    });
    const lab = K.label(g, 1290, 700, 'GILLS ×2 · BODY ×1', { size: 46 });
    X.pop(lab, W('story', 'body') - 2 * F, { dur: 5 * F, sfx: false });
  }, Lstory);

  // ---- host bookend B
  X.scene('hostB', tHostB, null, (g) => { const cam = X.cam(K.g(g)); drawHost(cam, ['outro']); }, Lhost);
  const gb = K.badge(Lover, 330, 540, 90, (bg) => K.path(bg, 'M0,34 C-80,-20 -40,-74 0,-38 C40,-74 80,-20 0,34 Z', C.pink));
  X.pop(gb, W('outro', 'change') - 2 * F, { dur: 5 * F, ease: 'back.out(1.6)', sfx: 'pop' });

  X.end(X.vo.duration);
});
