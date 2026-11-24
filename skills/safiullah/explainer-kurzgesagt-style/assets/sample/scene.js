/* "Made of Old Stars" — original 74 s science mini-episode in the kurzgesagt-style "neon night" look.
 * One continuous camera journey, zero hard cuts: silhouette pull-back → dive into a hand → x-ray atoms → night pan-up →
 * gas → ignition burst → dive into a star → cutaway onion → danger relight → collapse → white-out → supernova →
 * disk → Earth dive → x-ray montage → cosmos-filled silhouette → slow wide pull-back.                                */
X.boot(async (X) => {
  await X.loadVO();
  const K = KZ, S = (t, a, p) => X.svg(t, a, p);
  const W = (id, w, n = 0) => X.word(id, w, n), L = (id) => X.line(id);
  const END = X.vo.duration || 74;
  S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#0E0D2B' });
  const scenesG = S('g', {});
  const sfx = (t, type, gain = 0.3, o = {}) => X.sfx(t, type, { gain, ...o });

  // ---------------------------------------------------------------- key times (all from the voice track)
  const T = {
    hand: W('hand', 'hand'), atom: W('older', 'atom'), earth: W('older', 'earth'), sun: W('older', 'sun'),
    but: W('but', 'but'), carbon: W('but', 'carbon'), oxygen: W('but', 'oxygen'), calcium: W('but', 'calcium'), didnt: W('but', 'didn'), universe: W('but', 'universe'),
    where: L('where').start, come: W('where', 'come'), young: L('young').start, hydrogen: W('young', 'hydrogen'), helium: W('young', 'helium'),
    dark: W('dark', 'dark'), gravity: W('gravity', 'gravity'), hot: W('gravity', 'hot'), ignited: W('gravity', 'ignited'), first: W('first', 'first'),
    inside: W('fusion', 'inside'), fuses: W('fusion', 'fuses'), heliumF: W('fusion', 'helium'), light: W('fusion', 'light'),
    further: L('further').start, furtherW: W('further', 'further'), heL: W('further', 'helium'), cL: W('further', 'carbon'), oL: W('further', 'oxygen'), neL: W('further', 'neon'), siL: W('further', 'silicon'), feL: W('further', 'iron'),
    dead0: L('deadend').start, dead: W('deadend', 'dead'), energy: W('deadend', 'energy'), releasing: W('deadend', 'releasing'),
    collapse0: L('collapse').start, collapses: W('collapse', 'collapses'), explodes: W('explodes', 'explodes'),
    nova: W('nova', 'supernova'), mixes0: L('mixes').start, gathers: W('mixes', 'gathers'), newS: W('mixes', 'new'), planets: W('mixes', 'planets'),
    sun0: L('sun').start, one: W('sun', 'one'), sunW: W('sun', 'sun'), earthW: W('sun', 'earth'), you: W('sun', 'you'),
    calciumL: W('list', 'calcium'), ironL: W('list', 'iron'), oxygenL: W('list', 'oxygen'), all: W('list', 'all'), starsL: W('list', 'stars'), died: W('list', 'died'), listEnd: L('list').end,
    made0: L('madeof').start, universeM: W('madeof', 'universe'), made: W('madeof', 'made'), close0: L('close').start, wondering: W('close', 'wondering'),
  };

  // ---------------------------------------------------------------- screen-space FX layers (created now, raised to top at the end)
  const fxG = S('g', {});
  const white = S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#FFFDF4', opacity: 0 }, fxG);
  const whiteCh = K.ch(0), flashCh = K.ch(0);
  const flash = S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: X.radial('flashR', [[0, '#FFFFFF', 1], [0.25, '#F2FDFF', 0.85], [0.6, '#CFF6FF', 0.4], [1, '#BFEFFF', 0.12]], 0.5, 0.5, 0.7), opacity: 0 }, fxG);

  // ================================================================ the home world (day / night palettes, same geometry)
  const DAY = K.DAY, NIGHT = K.NIGHT, world = K.world, planes = K.planes, sunDisc = K.sun;

  // ================================================================ S1 — cosmos silhouette pull-back, the hand, Earth & Sun
  const C1 = { x: 820, y: 846, s: 1.15 };
  const hand1 = { x: C1.x + (24 + Math.cos(-8 * Math.PI / 180) * 86) * C1.s, y: C1.y + (-118 + Math.sin(-8 * Math.PI / 180) * 86) * C1.s };
  const s1g = X.scene('s1', 0, T.but + 0.3, (g) => {
    const rig = K.rig(g, [
      { t: 0, x: 818, y: 680, z: 8.5 }, { t: 0.2, z: 8.5 },
      { t: 2.6, x: 930, y: 585, z: 1.0, ease: 'sine.inOut' }, { t: T.earth + 0.4 },
      { t: T.but - 0.85, x: 960, y: 590, z: 1.08, ease: 'sine.inOut' },
      { t: T.but + 0.08, x: hand1.x, y: hand1.y, z: 52, ease: 'power3.in', pivot: [hand1.x, hand1.y] },
    ]);
    const pl = planes(rig), w = world(pl, DAY, { cx: 900, groundY: 846 });
    // the sun rises behind the far mountains on "Sun"
    const sunG = S('g', {}, w.sunSlot), sun = sunDisc(sunG, 1460, 0, 92);
    const sunY = K.ch(1050).to(T.sun - 0.55, 470, 1.1, 'power2.out');
    const skyGlow = K.glow(pl.p0, 1460, 470, 900, '#FFF6D8', 0);
    const skyCh = K.ch(0).to(T.sun - 0.5, 0.75, 1.2, 'power1.out');
    X.every((t) => { sun.setAttribute('transform', `translate(1460,${sunY.at(t).toFixed(1)})`); skyGlow.setAttribute('opacity', skyCh.at(t).toFixed(3)); });
    // Earth icon
    const eg = S('g', { transform: 'translate(1225,440)' }, pl.p3), ein = S('g', {}, eg);
    K.halo(ein, 0, 0, 56, ['#FFE7A0', '#FFDA74', '#FFCC4E'], { step: 1.3, ops: [0.9, 0.7, 0.5] });
    K.planetEarth(ein, 0, 0, 44, { light: [0.7, -0.4] });
    X.pop(ein, T.earth - 0.25, { dur: 0.5, ease: 'back.out(1.8)', gain: 0.3 });
    X.every((t) => eg.setAttribute('transform', `translate(1225,${(440 + Math.sin(t * 1.8) * 7).toFixed(1)})`));
    // the creature, filled with the cosmos at first
    const c = K.critter(w.critterSlot, { ...C1, cosmos: true, cosmos0: 1, blinks: [3.55, 6.05] });
    c.to('lid', -1, 2.4, 1e-4).to('lid', 0.85, 0, 0.16, 'power2.out')
      .to('arm', T.hand - 0.38, -8, 0.5, 'back.out(1.5)')
      .to('lookX', 1.3, 6, 0.25).to('lookY', 1.3, 6, 0.25)
      .to('cosmos', 2.1, 0, 0.8, 'power1.inOut')
      .to('lookX', T.earth - 0.35, 9, 0.22).to('lookY', T.earth - 0.35, -6, 0.22)
      .to('lookX', T.sun - 0.3, 10, 0.25).to('lookY', T.sun - 0.3, -9, 0.25)
      .to('lookX', T.but - 1.2, 6, 0.3).to('lookY', T.but - 1.2, 6, 0.3)
      .to('cheek', T.sun + 0.1, 0.8, 0.25).to('cheek', T.but - 1.1, 0, 0.25);
    // atoms glinting in the palm
    const ag = S('g', {}, pl.p3), dots = [];
    const ar = X.rand(19), acol = ['#25E8F1', '#F8AE1C', '#F91E8E', '#FFFFFF', '#74D4E7', '#FFD36B', '#E61DAD'];
    for (let i = 0; i < 7; i++) {
      const d = S('g', {}, ag), pg = S('g', {}, d);
      K.glow(pg, 0, 0, 24, acol[i], 0.95); S('circle', { r: 5, fill: '#FFFFFF' }, pg);
      dots.push({ d, r: 18 + ar() * 22, ph: ar() * 6.28, sp: 0.8 + ar() * 1.2, k: 0.6 + ar() * 0.4 });
      X.pop(pg, T.atom - 0.18 + i * 0.05, { sfx: i === 0 ? 'sparkle' : false, gain: 0.22, dur: 0.35 });
    }
    X.every((t) => { const hx = hand1.x, hy = hand1.y - 6; for (const q of dots) q.d.setAttribute('transform', `translate(${(hx + Math.cos(t * q.sp + q.ph) * q.r).toFixed(1)},${(hy + Math.sin(t * q.sp + q.ph) * q.r * q.k).toFixed(1)})`); });
    sfx(0.15, 'woosh_low', 0.3, { dur: 2.2 });
    sfx(T.sun - 0.5, 'chime', 0.18);
    sfx(T.but - 0.85, 'zoom_in', 0.3, { dur: 0.9 });
  });

  gsap.set(s1g, { autoAlpha: 1 });

  // ================================================================ S2 — inside the hand: three atoms that did not exist yet
  X.scene('s2', T.but - 0.25, T.where - 0.02, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, T.but - 0.25, 0.3, 0, 1); K.fade(fg, T.where - 0.38, 0.36, 1, 0);
    const rig = K.rig(fg, [
      { t: T.but - 0.25, z: 1.8 }, { t: T.but + 0.65, z: 1.0, ease: 'expo.out' },
      { t: T.calcium + 0.3 }, { t: T.didnt + 0.3, x: 960, y: 548, z: 1.05, ease: 'sine.inOut' }, { t: T.where - 0.62, z: 1.0, y: 540, ease: 'sine.inOut' },
      { t: T.where - 0.02, z: 0.24, ease: 'power3.in' },
    ]);
    const p0 = rig.plane(0.12), p1 = rig.plane(0.45), p2 = rig.plane(1), p3 = rig.plane(1.7);
    S('rect', { x: -900, y: -700, width: 3720, height: 2480, fill: X.radial('s2bg', [[0, '#6A2EE6'], [0.45, '#3A13A6'], [1, '#180650']]) }, p0);
    const cells = S('g', {}, p0), cr = X.rand(23);
    for (let i = 0; i < 16; i++) S('path', { d: K.blob(-300 + cr() * 2500, -250 + cr() * 1600, 120 + cr() * 170, { n: 9, wob: 0.18, seed: 100 + i }), fill: i % 3 ? '#4A1CC2' : '#8A3BE8', opacity: i % 3 ? 0.55 : 0.35 }, cells);
    X.every((t) => cells.setAttribute('transform', `rotate(${(t * 1.6).toFixed(2)} 960 540)`));
    K.stars(p1, { n: 70, seed: 24, colors: ['#C9B6FF', '#E6DCFF', '#9FE6FF'], sparkles: 2, scale: 1.3 });
    for (const [x, y, r] of [[-80, 1100, 520], [2000, -40, 460], [1960, 1160, 380]]) K.glow(p3, x, y, r, '#0E0433', 0.95);
    const atoms = [];
    const atom = (x, y, col, seed, name, pillFill, tw) => {
      const a = S('g', { transform: `translate(${x},${y})` }, p2), b = S('g', {}, a), inner = S('g', {}, b);
      K.glow(inner, 0, 0, 300, col, 0.62);
      K.halo(inner, 0, 0, 58, K.steps(col, '#2E1088', 4, 0.12, 0.8), { step: 1.32, seed });
      const orbs = [];
      for (const rot of [32, -32]) {
        const og = S('g', { transform: `rotate(${rot})` }, inner);
        S('ellipse', { rx: 150, ry: 46, fill: 'none', stroke: '#EEE3FF', 'stroke-width': 3, opacity: 0.5 }, og);
        for (let k = 0; k < 2; k++) { const e = S('g', {}, og); K.glow(e, 0, 0, 18, '#FFFFFF', 0.8); S('circle', { r: 6.5, fill: '#FFFFFF' }, e); orbs.push({ e, ph: k * Math.PI + rot / 20 }); }
      }
      const nuc = S('g', {}, inner);
      [[0, 0], [21, -9], [-20, -10], [8, 20], [-13, 18], [14, -27], [-7, -27]].forEach(([nx, ny], i) =>
        K.orb(nuc, nx, ny, 17, { fill: K.mix(col, '#FFFFFF', i % 2 ? 0.05 : 0.3), shade: K.mix(col, '#2A0860', 0.45), rim: '#FFFFFF', light: [0.55, -0.65] }));
      X.every((t) => { for (const q of orbs) { const an = t * 2.4 + q.ph; q.e.setAttribute('transform', `translate(${(Math.cos(an) * 150).toFixed(1)},${(Math.sin(an) * 46).toFixed(1)})`); } nuc.setAttribute('transform', `rotate(${(Math.sin(t * 1.3 + seed) * 6).toFixed(2)})`); });
      X.pop(inner, tw - 0.3, { dur: 0.5, ease: 'back.out(1.7)', pitch: 0.8 + atoms.length * 0.15, gain: 0.3 });
      K.pill(p2, x, y + 205, name, { fill: pillFill, t: tw + 0.02, out: T.didnt - 0.12, anchor: [0, -112], sfx: false });
      atoms.push({ a, b, x, y, col });
    };
    atom(520, 470, '#F8AE1C', 3, 'Carbon', '#D9850F', T.carbon);
    atom(960, 470, '#25E8F1', 5, 'Oxygen', '#1597B8', T.oxygen);
    atom(1400, 470, '#F91E8E', 7, 'Calcium', '#C42A7A', T.calcium);
    atoms.forEach((q, i) => {
      const ti = T.didnt + i * 0.11;
      X.tl.to(q.b, { scale: 0, duration: 0.34, ease: 'back.in(2.2)', transformOrigin: '50% 50%' }, ti);
      const ring = S('circle', { cx: q.x, cy: q.y, r: 20, fill: 'none', stroke: q.col, 'stroke-width': 8, opacity: 0 }, p2);
      X.tl.fromTo(ring, { attr: { r: 20 }, opacity: 0.9 }, { attr: { r: 190 }, opacity: 0, duration: 0.5, ease: 'expo.out', immediateRender: false }, ti + 0.3);
      for (let k = 0; k < 6; k++) {
        const an = (k / 6) * Math.PI * 2 + i, sp = S('path', { d: K.sparkleD(0, 0, 13), fill: '#FFFFFF', opacity: 0 }, p2);
        X.tl.fromTo(sp, { x: q.x, y: q.y, opacity: 1, scale: 1 }, { x: q.x + Math.cos(an) * 150, y: q.y + Math.sin(an) * 150, opacity: 0, scale: 0.3, duration: 0.6, ease: 'power2.out', immediateRender: false }, ti + 0.3);
      }
      if (i === 0) sfx(ti + 0.3, 'bubble', 0.25, { pitch: 1.2 });
    });
    // what was there at the start: a lone hydrogen atom
    const h = S('g', { transform: 'translate(960,500)' }, p2), hin = S('g', {}, h);
    K.glow(hin, 0, 0, 160, '#25E8F1', 0.5);
    K.halo(hin, 0, 0, 20, K.steps('#9FF6FF', '#2E1088', 3, 0, 0.7), { step: 1.35 });
    S('circle', { r: 12, fill: '#E6FDFF' }, hin);
    X.pop(hin, T.universe - 0.2, { dur: 0.5, sfx: 'sparkle', gain: 0.25 });
    sfx(T.where - 0.55, 'zoom_out', 0.25, { dur: 0.6 });
  });

  // ================================================================ S3 — night: "so where did it come from?" — pan up into the sky
  const C3 = { x: 960, y: 872, s: 1.3 };
  const hand3 = { x: C3.x + 109.2 * C3.s, y: C3.y - 130 * C3.s };
  X.scene('s3', T.where - 0.42, T.young + 0.45, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, T.where - 0.42, 0.34, 0, 1);
    const rig = K.rig(fg, [
      { t: T.where - 0.42, x: hand3.x, y: hand3.y, z: 3.6 },
      { t: T.where + 0.4, x: 985, y: 600, z: 1.0, ease: 'expo.out' }, { t: T.where + 0.85, x: 980, y: 595, z: 1.0 },
      { t: T.young + 0.45, x: 960, y: -430, z: 1.0, ease: 'power2.in' },
    ]);
    const pl = planes(rig), w = world(pl, NIGHT, { cx: 960, groundY: 872 });
    K.glow(w.critterSlot, 1020, 880, 340, '#F8AE1C', 0.22).setAttribute('transform', 'translate(1020,880) scale(1,0.28) translate(-1020,-880)');
    const c = K.critter(w.critterSlot, { ...C3, blinks: [T.where + 0.15], phase: 0.7, amb: 0.45 });
    c.to('arm', -1, -8, 1e-4).to('lid', -1, 1, 1e-4).to('lookX', -1, 6, 1e-4).to('lookY', -1, 7, 1e-4)
      .to('lookX', T.come - 0.22, 4, 0.2).to('lookY', T.come - 0.22, -10, 0.2).to('lid', T.come - 0.22, 0, 0.2)
      .to('tilt', T.come - 0.18, -8, 0.45, 'back.out(1.6)').to('arm', T.come + 0.05, 62, 0.45);
    sfx(T.come + 0.35, 'whoosh', 0.25, { dur: 1.6 });
  });

  // ================================================================ S4 — dark gas, gravity, ignition, the first stars
  X.scene('s4', T.young - 0.05, T.inside + 0.12, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, T.young - 0.05, 0.42, 0, 1);
    const rig = K.rig(fg, [
      { t: T.young - 0.05, x: 960, y: 860, z: 1.2 }, { t: T.young + 1.4, x: 960, y: 540, z: 1.08, ease: 'power2.out' },
      { t: T.gravity, x: 990, y: 540, z: 1.0, ease: 'sine.inOut' }, { t: T.ignited + 0.05, x: 960, y: 540, z: 1.14, ease: 'sine.inOut' },
      { t: T.ignited + 0.75, z: 1.0, ease: 'expo.out' }, { t: T.inside - 0.75, z: 1.06, ease: 'sine.inOut' },
      { t: T.inside + 0.12, x: 960, y: 540, z: 34, ease: 'power3.in', pivot: [960, 540] },
    ]);
    const p0 = rig.plane(0.1), p1 = rig.plane(0.3), p2 = rig.plane(1), p3 = rig.plane(1.5);
    const bgR = (id, stops) => S('rect', { x: -900, y: -800, width: 3720, height: 2680, fill: X.radial(id, stops) }, p0);
    bgR('s4fog', [[0, '#4A28B8'], [0.5, '#25106E'], [1, '#100838']]);
    const bgDark = bgR('s4dark', [[0, '#130C3E'], [0.6, '#080522'], [1, '#04030E']]);
    const bgNight = bgR('s4night', [[0, '#3A22A0'], [0.5, '#1A0C5C'], [1, '#0A0628']]);
    const darkCh = K.ch(0).to(T.dark - 0.3, 1, 0.6, 'power1.inOut').to(T.ignited + 0.1, 0, 0.6);
    const nightCh = K.ch(0).to(T.ignited + 0.1, 1, 0.6);
    const neb = S('g', {}, p1), nr = X.rand(31), nebs = [];
    for (let i = 0; i < 10; i++) {
      const e = S('path', { d: K.blob(0, 0, 200 + nr() * 220, { n: 9, wob: 0.3, seed: 200 + i, sx: 1.5 }), fill: ['#6A2BD8', '#B02FB8', '#3A5BE8'][i % 3], opacity: 0.38 }, neb);
      nebs.push({ e, x: -300 + nr() * 2500, y: -200 + nr() * 1500, ph: nr() * 6 });
    }
    const farStars = K.stars(p1, { n: 90, seed: 33, sparkles: 4 });
    const nebCh = K.ch(1).to(T.dark - 0.3, 0.18, 0.6).to(T.gravity, 0.26, 2.0).to(T.ignited + 0.1, 1.15, 0.6);
    // particles: hydrogen (cyan) and helium (magenta pairs)
    const pr = X.rand(77), parts = [];
    const centres = [[960, 540, 75], [500, 320, 42], [1440, 735, 38]];
    for (let i = 0; i < 170; i++) {
      const He = i === 1 || (i > 1 && pr() < 0.22);
      let x0 = -280 + pr() * 2480, y0 = -220 + pr() * 1520;
      if (i === 0) { x0 = 730; y0 = 420; } if (i === 1) { x0 = 1235; y0 = 655; }
      const k = pr() < 0.56 ? 0 : pr() < 0.55 ? 1 : 2, el = S('g', {}, p2);
      if (He) { S('circle', { r: 30, fill: K.glowFill('#F91E8E') }, el); S('circle', { cx: -7, r: 8, fill: '#FF8AD8' }, el); S('circle', { cx: 7.5, cy: 1, r: 8, fill: '#F45BB5' }, el); }
      else { S('circle', { r: 24, fill: K.glowFill('#25E8F1') }, el); S('circle', { r: 6.5, fill: '#B6F7FF' }, el); }
      parts.push({ el, x0, y0, k, ph: pr() * 6.28, amp: i < 2 ? 3 : 10 + pr() * 12, rad: centres[k][2] * Math.sqrt(pr()), sw: 1.1 + pr() * 0.8, dl: pr() * 0.7 });
    }
    const brCh = K.ch(1).to(T.dark - 0.3, 0.38, 0.6).to(T.gravity - 0.1, 0.6, 2.2);
    X.every((t) => {
      const nb = nebCh.at(t);
      neb.setAttribute('opacity', Math.min(1, nb).toFixed(3));
      for (const q of nebs) q.e.setAttribute('transform', `translate(${(q.x + Math.sin(t * 0.25 + q.ph) * 40).toFixed(1)},${(q.y + Math.cos(t * 0.2 + q.ph) * 25).toFixed(1)})`);
      bgDark.setAttribute('opacity', darkCh.at(t).toFixed(3)); bgNight.setAttribute('opacity', nightCh.at(t).toFixed(3));
      farStars.setAttribute('opacity', (0.35 + 0.65 * nightCh.at(t)).toFixed(3));
      const br = brCh.at(t), fadeOut = 1 - K.prog(t, T.ignited, T.ignited + 0.3);
      for (const q of parts) {
        const [cx, cy] = centres[q.k];
        let x = q.x0 + Math.sin(t * 0.45 + q.ph) * q.amp, y = q.y0 + Math.cos(t * 0.38 + q.ph) * q.amp;
        const p = K.prog(t, T.gravity - 0.15 + q.dl * 0.6, T.ignited - 0.02, 'sine.inOut');
        if (p > 0) {
          const r0 = Math.hypot(x - cx, y - cy), a0 = Math.atan2(y - cy, x - cx), r = K.lerp(r0, q.rad, p), a = a0 + p * q.sw;
          x = cx + Math.cos(a) * r; y = cy + Math.sin(a) * r * 0.92;
        }
        q.el.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        q.el.setAttribute('opacity', (br * fadeOut).toFixed(3));
      }
    });
    // clumps heat up
    centres.forEach(([cx, cy, cr], i) => {
      const gA = K.glow(p2, cx, cy, 10, '#F91E8E', 0), gB = K.glow(p2, cx, cy, 10, '#FFD36B', 0);
      const ra = K.ch(0).to(T.gravity + 0.2, cr * 3.4, 2.2, 'power1.inOut'), oa = K.ch(0).to(T.gravity + 0.2, 0.9, 1.6).to(T.ignited + 0.2, 0, 0.4);
      const rb = K.ch(0).to(T.hot - 0.35, cr * 2.3, 1.0, 'power2.in'), ob = K.ch(0).to(T.hot - 0.25, 1, 0.6).to(T.ignited + 0.2, 0, 0.4);
      X.every((t) => { gA.setAttribute('r', Math.max(1, ra.at(t)).toFixed(1)); gA.setAttribute('opacity', oa.at(t).toFixed(3)); gB.setAttribute('r', Math.max(1, rb.at(t)).toFixed(1)); gB.setAttribute('opacity', ob.at(t).toFixed(3)); });
    });
    // ignition burst → the first stars (hot, blue-white)
    const star = (x, y, r, cols, delay, big) => {
      const sg = S('g', { transform: `translate(${x},${y})` }, p2), sin = S('g', {}, sg);
      K.glow(sin, 0, 0, r * 11, cols[2], 0.55);
      if (big) K.rays(sin, 0, 0, r * 22, { n: 14, color: '#CFF8FF', op: 0.14, speed: 4 });
      K.halo(sin, 0, 0, r, cols, { step: 1.36, seed: Math.round(x), ops: [1, 1, 0.8, 0.55, 0.35] });
      X.pop(sin, T.ignited + delay, { dur: 0.6, ease: 'back.out(1.4)', sfx: false });
      const burst = S('g', { opacity: 0 }, sg), bin = S('g', {}, burst);
      for (let k = 0; k < 10; k++) S('path', { d: `M0,0L${-r * 0.5},${-r * 8}L0,${-r * 13}L${r * 0.5},${-r * 8}Z`, fill: '#FFFFFF', transform: `rotate(${k * 36})` }, bin);
      X.tl.fromTo(burst, { opacity: 1 }, { opacity: 0, duration: 0.6, ease: 'power2.in', immediateRender: false }, T.ignited + delay + 0.05);
      X.tl.fromTo(bin, { scale: 0.1 }, { scale: 1.5, duration: 0.65, ease: 'expo.out', immediateRender: false, svgOrigin: '0 0' }, T.ignited + delay);
      return sg;
    };
    star(960, 540, 34, ['#FFFFFF', '#CFF8FF', '#74D4E7', '#2C9ADA', '#3A3FB8'], 0, true);
    star(500, 320, 17, ['#FFFFFF', '#E1E4FF', '#A9B4FF', '#6A6FE0', '#3C2FA8'], 0.22, false);
    star(1440, 735, 15, ['#FFFFFF', '#D8FBFF', '#8FE3F5', '#3BA6D8', '#2E3FA8'], 0.36, false);
    flashCh.to(T.ignited - 0.08, 0.95, 0.18, 'power2.in').to(T.ignited + 0.1, 0, 0.75, 'power2.out');
    sfx(T.ignited, 'impact', 0.42); sfx(T.ignited + 0.05, 'chime', 0.3);
    const sr = X.rand(51);
    for (let i = 0; i < 18; i++) {
      let x, y; do { x = 120 + sr() * 1680; y = 90 + sr() * 900; } while (Math.hypot(x - 960, y - 540) < 300);
      const s = S('g', { transform: `translate(${x},${y})` }, p1), si = S('g', {}, s), cc = ['#BFE9FF', '#FFC9EC', '#FFFFFF', '#9FB4FF'][i % 4];
      K.glow(si, 0, 0, 40, cc, 0.6); S('path', { d: K.sparkleD(0, 0, 12 + sr() * 8), fill: '#FFFFFF' }, si); S('circle', { r: 3.5, fill: '#FFFFFF' }, si);
      X.pop(si, T.first - 0.3 + i * 0.045, { dur: 0.4, sfx: i === 0 ? 'sparkle' : false, gain: 0.2 });
    }
    // labels on the two kinds of gas
    K.pill(p2, 560, 296, 'Hydrogen', { fill: '#1597B8', t: T.hydrogen - 0.05, out: T.dark - 0.4, anchor: [730 - 560, 420 - 296] });
    K.pill(p2, 1420, 812, 'Helium', { fill: '#C42A7A', t: T.helium - 0.05, out: T.dark - 0.4, anchor: [1235 - 1420, 655 - 812], sfx: false });
    // foreground dust for depth
    const dust = S('g', {}, p3), drr = X.rand(57), ds = [];
    for (let i = 0; i < 14; i++) { const e = K.glow(dust, 0, 0, 30 + drr() * 40, '#C9B6FF', 0.22); ds.push({ e, x: -200 + drr() * 2300, y: -100 + drr() * 1300, ph: drr() * 6 }); }
    X.every((t) => { for (const q of ds) q.e.setAttribute('transform', `translate(${(q.x + Math.sin(t * 0.3 + q.ph) * 60).toFixed(1)},${(q.y + t * 6).toFixed(1)})`); });
    sfx(T.gravity, 'woosh_low', 0.25, { dur: 2.4 });
    sfx(T.inside - 0.75, 'zoom_in', 0.32, { dur: 0.85 });
  });

  // ================================================================ S5 — inside the star: hydrogen fuses into helium and light
  X.scene('s5', T.inside - 0.3, T.further + 0.12, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, T.inside - 0.3, 0.32, 0, 1); K.fade(fg, T.further - 0.26, 0.36, 1, 0);
    const rig = K.rig(fg, [
      { t: T.inside - 0.3, z: 1.7 }, { t: T.inside + 0.6, z: 1.0, ease: 'expo.out' },
      { t: T.further - 0.6, x: 975, y: 548, z: 1.1, ease: 'sine.inOut' }, { t: T.further + 0.12, x: 975, y: 548, z: 0.3, ease: 'power3.in' },
    ]);
    const p0 = rig.plane(0.12), p1 = rig.plane(0.5), p2 = rig.plane(1), p3 = rig.plane(1.6);
    S('rect', { x: -900, y: -700, width: 3720, height: 2480, fill: X.radial('s5bg', [[0, '#FFF2B8'], [0.3, '#FFC845'], [0.65, '#F7921F'], [1, '#D2401C']]) }, p0);
    S('rect', { x: -900, y: -700, width: 3720, height: 2480, fill: K.swirlPattern('#FFB52E', 340, 16), opacity: 0.55 }, p0);
    const conv = S('g', {}, p0), cr = X.rand(61);
    for (let i = 0; i < 9; i++) S('path', { d: K.blob(-200 + cr() * 2300, -150 + cr() * 1400, 170 + cr() * 160, { n: 9, wob: 0.22, seed: 300 + i }), fill: i % 2 ? '#FFB52E' : '#F59A1F', opacity: 0.45 }, conv);
    X.every((t) => conv.setAttribute('transform', `rotate(${(t * 2).toFixed(2)} 960 540)`));
    const wisp = S('g', {}, p1);
    for (let i = 0; i < 9; i++) {
      const a0 = (i / 9) * Math.PI * 2, pts = [];
      for (let k = 0; k < 7; k++) { const a = a0 + k * 0.22, r = 260 + k * 70; pts.push([960 + Math.cos(a) * r, 540 + Math.sin(a) * r]); }
      S('path', { d: K.smooth(pts, false), fill: 'none', stroke: '#FFE58A', 'stroke-width': 14, 'stroke-linecap': 'round', opacity: 0.4 }, wisp);
    }
    X.every((t) => wisp.setAttribute('transform', `rotate(${(-t * 3).toFixed(2)} 960 540)`));
    for (const [x, y] of [[-60, -40], [1980, 1120], [-40, 1140]]) K.glow(p3, x, y, 420, '#FF6A1A', 0.35);
    const core = K.glow(p2, 960, 540, 320, '#FFFFFF', 0.35);
    const fan = S('g', { opacity: 0 }, p2); K.rays(fan, 960, 540, 1300, { n: 16, color: '#FFF8DC', op: 0.22, speed: 3 });
    const fuse = (x, y, tm, ang, s, main) => {
      const grp = S('g', { transform: `translate(${x},${y}) scale(${s})` }, p2);
      const pA = S('g', {}, grp), pB = S('g', {}, grp);
      for (const p of [pA, pB]) { K.glow(p, 0, 0, 50, '#25E8F1', 0.55); K.orb(p, 0, 0, 20, { fill: '#4FD8F5', shade: '#1E5FC4', rim: '#E4FCFF', light: [0.6, -0.6] }); }
      const he = S('g', {}, grp), heIn = S('g', {}, he);
      K.glow(heIn, 0, 0, 64, '#F91E8E', 0.5);
      K.orb(heIn, -12, 0, 19, { fill: '#F45BB5', shade: '#8A1670', rim: '#FFD1EE' }); K.orb(heIn, 12, 2, 19, { fill: '#E8399E', shade: '#7A1060', rim: '#FFD1EE' });
      const fl = S('g', {}, grp); K.glow(fl, 0, 0, 160, '#FFFFFF', 0.95); S('path', { d: K.sparkleD(0, 0, 74), fill: '#FFFFFF' }, fl);
      const ring = S('circle', { r: 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 6 }, grp);
      const ph = S('g', {}, grp); const phL = S('path', { d: 'M-70,0L0,0', stroke: '#FFF3B0', 'stroke-width': 7, 'stroke-linecap': 'round' }, ph); K.glow(ph, 0, 0, 34, '#FFF3B0', 1); S('circle', { r: 7, fill: '#FFFFFF' }, ph);
      const dx = Math.cos(ang), dy = Math.sin(ang), pa = ang + 1.9, D = 300;
      X.every((t) => {
        const p = K.prog(t, tm - 0.65, tm, 'power2.in'), d = D * (1 - p), pre = t > tm - 0.95 && t < tm;
        pA.setAttribute('transform', `translate(${(dx * d).toFixed(1)},${(dy * d).toFixed(1)})`); pB.setAttribute('transform', `translate(${(-dx * d).toFixed(1)},${(-dy * d).toFixed(1)})`);
        pA.setAttribute('opacity', pre ? K.prog(t, tm - 0.95, tm - 0.75).toFixed(2) : 0); pB.setAttribute('opacity', pre ? K.prog(t, tm - 0.95, tm - 0.75).toFixed(2) : 0);
        const after = t >= tm, q = K.prog(t, tm, tm + 0.5, 'expo.out');
        fl.setAttribute('opacity', after ? (1 - K.prog(t, tm, tm + 0.42, 'power2.out')).toFixed(3) : 0);
        ring.setAttribute('r', (10 + q * 150).toFixed(1)); ring.setAttribute('opacity', after ? (1 - q).toFixed(3) : 0);
        const dr = main ? 0 : (t - tm) * 22;
        he.setAttribute('opacity', after ? 1 : 0);
        he.setAttribute('transform', `translate(${(-dy * dr).toFixed(1)},${(dx * dr).toFixed(1)}) scale(${after ? K.prog(t, tm, tm + 0.35, 'back.out(2)').toFixed(3) : 0})`);
        const s2 = K.prog(t, tm, tm + 0.9, 'power1.out');
        ph.setAttribute('transform', `rotate(${(pa * 180) / Math.PI}) translate(${(s2 * 560).toFixed(1)},0)`);
        ph.setAttribute('opacity', after ? (1 - K.prog(t, tm + 0.55, tm + 0.9)).toFixed(3) : 0);
      });
      if (main || tm < T.fuses) sfx(tm, 'pop', main ? 0.32 : 0.16, { pitch: main ? 1.0 : 1.35 });
      return grp;
    };
    fuse(560, 330, T.inside + 0.62, 1.2, 1.4);
    fuse(960, 540, T.fuses + 0.2, 0.3, 2.1, true);
    fuse(1390, 760, T.fuses + 0.78, 2.4, 1.5);
    fuse(1460, 300, T.light - 0.52, -0.6, 1.3);
    fuse(520, 800, T.light - 0.1, 0.9, 1.35);
    fuse(1080, 200, T.light + 0.32, 2.0, 1.2);
    K.pill(p2, 1250, 830, 'Helium', { fill: '#C42A7A', t: T.heliumF + 0.05, out: T.further - 0.35, anchor: [-250, -232], size: 40, sfx: false });
    const wave = S('circle', { cx: 960, cy: 540, r: 40, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 12, opacity: 0 }, p2);
    X.tl.fromTo(wave, { attr: { r: 40 }, opacity: 0.9 }, { attr: { r: 1150 }, opacity: 0, duration: 1.1, ease: 'expo.out', immediateRender: false }, T.light - 0.05);
    K.fade(fan, T.light - 0.1, 0.5, 0, 1);
    const coreCh = K.ch(0.35).to(T.light - 0.1, 0.95, 0.25, 'power2.out').to(T.light + 0.2, 0.55, 0.9);
    X.every((t) => core.setAttribute('opacity', coreCh.at(t).toFixed(3)));
    sfx(T.light - 0.05, 'chime', 0.28); sfx(T.light - 0.05, 'whoosh', 0.18, { dur: 0.9 });
    sfx(T.further - 0.55, 'zoom_out', 0.25, { dur: 0.65 });
  });

  // ================================================================ S6 — the big star cut open: onion layers, iron, collapse, white-out
  const SC = { x: 960, y: 560, R: 360 };
  X.scene('s6', T.further - 0.26, T.explodes + 0.34, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, T.further - 0.26, 0.34, 0, 1);
    const rig = K.rig(fg, [
      { t: T.further - 0.26, x: SC.x, y: SC.y, z: 3.3 }, { t: T.further + 0.8, x: SC.x, y: SC.y, z: 1.0, ease: 'expo.out' },
      { t: T.dead0 - 0.35, x: SC.x, y: SC.y, z: 1.0 },
      { t: T.dead + 0.05, x: SC.x, y: SC.y, z: 2.0, ease: 'power2.inOut' }, { t: T.collapse0 - 0.4, z: 1.75, ease: 'sine.inOut' },
      { t: T.explodes, x: SC.x, y: SC.y, z: 2.3, ease: 'power1.in' },
    ], { shake: [{ t0: T.collapses - 0.05, t1: T.explodes + 0.1, amp: 10 }] });
    const p0 = rig.plane(0.1), p1 = rig.plane(0.3), p2 = rig.plane(1), p3 = rig.plane(1.0), p4 = rig.plane(1.7);
    const bg = (id, stops) => S('rect', { x: -1000, y: -800, width: 3920, height: 2680, fill: X.radial(id, stops) }, p0);
    bg('s6bg', [[0, '#221668'], [0.55, '#110A42'], [1, '#080620']]);
    K.stars(p0, { n: 220, seed: 71, sparkles: 9 });
    const bgRed = bg('s6red', [[0, '#D8283F'], [0.5, '#82102F'], [1, '#3C0620']]);
    const redCh = K.ch(0).to(T.dead - 0.08, 1, 0.3, 'power2.out').to(T.collapse0 - 0.4, 0.75, 0.8);
    for (let i = 0; i < 6; i++) S('path', { d: K.blob(200 + i * 330, 260 + (i % 3) * 230, 210, { n: 9, wob: 0.3, seed: 400 + i, sx: 1.7 }), fill: i % 2 ? '#6A1E9E' : '#3B2AA8', opacity: 0.2 }, p1);
    [[260, 220, '#FFC9EC'], [1660, 300, '#BFE9FF'], [1500, 900, '#FFFFFF'], [380, 880, '#BFE9FF']].forEach(([x, y, c], i) => { K.glow(p1, x, y, 60, c, 0.6); K.halo(p1, x, y, 5, ['#FFFFFF', c], { step: 1.6, ops: [1, 0.5], seed: i }); });
    // the star
    const starG = S('g', { transform: `translate(${SC.x},${SC.y})` }, p2), R = SC.R;
    const starS = S('g', {}, starG);
    K.glow(starS, 0, 0, R * 2.6, '#F8AE1C', 0.42);
    K.rays(starS, 0, 0, R * 2.8, { n: 16, color: '#FFD36B', op: 0.11, speed: 2 });
    K.halo(starS, 0, 0, R * 1.07, K.steps('#F8AE1C', '#1A1150', 4, 0.3, 0.86), { step: 1.11, ops: [0.6, 0.45, 0.32, 0.22], seed: 9, amp: 0.015 });
    const sg = X.radial('s6surf', [[0, '#FFE36E'], [0.6, '#FCBB30'], [0.9, '#F68A20'], [1, '#EC6A1A']]);
    S('circle', { r: R, fill: sg }, starS);
    const sclip = K.id('sc'); S('circle', { r: R }, S('clipPath', { id: sclip }, X.defs));
    const gran = [S('g', { 'clip-path': `url(#${sclip})` }, starS), S('g', { 'clip-path': `url(#${sclip})` }, starS)], gr = X.rand(81);
    for (let i = 0; i < 70; i++) S('path', { d: K.blob((gr() - 0.5) * 2 * R, (gr() - 0.5) * 2 * R, 18 + gr() * 26, { n: 7, wob: 0.25, seed: 500 + i }), fill: i % 2 ? '#FFD655' : '#F09A22', opacity: 0.4 }, gran[i % 2]);
    X.every((t) => { gran[0].setAttribute('opacity', (0.7 + 0.3 * Math.sin(t * 1.1)).toFixed(3)); gran[1].setAttribute('opacity', (0.7 - 0.3 * Math.sin(t * 1.1)).toFixed(3)); });
    S('circle', { r: R - 2, fill: 'none', stroke: '#FFF0B5', 'stroke-width': 5, opacity: 0.55 }, starS);
    // cutaway quadrant with the onion layers
    const qclip = K.id('qc'); S('path', { d: `M0,0L0,${-R - 4}A${R + 4},${R + 4} 0 0,1 ${R + 4},0Z` }, S('clipPath', { id: qclip }, X.defs));
    const quad = S('g', { 'clip-path': `url(#${qclip})` }, starS);
    const LR = [0.975, 0.8, 0.65, 0.52, 0.4, 0.28], LC = ['#6E2BC2', '#B02F95', '#E8456B', '#F27838', '#F8B12A', '#FFE69A'];
    const LN = ['H', 'He', 'C', 'O', 'Ne', 'Si'], LT = [T.furtherW + 0.1, T.heL - 0.12, T.cL - 0.12, T.oL - 0.12, T.neL - 0.12, T.siL - 0.12];
    const layers = LR.map((f, i) => {
      const lg = S('g', {}, quad);
      S('circle', { r: f * R, fill: LC[i] }, lg);
      S('circle', { r: f * R - 5, fill: 'none', stroke: K.mix(LC[i], '#2A0A50', 0.3), 'stroke-width': 10, opacity: 0.45 }, lg);
      const sc = K.ch(i === 0 ? 1 : 0).to(LT[i], 1, 0.42, 'back.out(1.5)').to(T.collapses - 0.12 + (5 - i) * 0.07, 0.1, 0.85, 'power3.in');
      X.every((t) => lg.setAttribute('transform', `scale(${Math.max(0.001, sc.at(t)).toFixed(4)})`));
      if (i % 2 === 1) sfx(LT[i], 'pop', 0.2, { pitch: 0.8 + i * 0.12 });
      return lg;
    });
    S('path', { d: `M0,0L0,${-R}M0,0L${R},0`, stroke: '#FFF4D0', 'stroke-width': 4, opacity: 0.75, 'stroke-linecap': 'round' }, quad);
    // labels along the diagonal
    const lab = S('g', {}, starS);
    LN.forEach((n, i) => {
      const r = i < 5 ? (LR[i] + LR[i + 1]) / 2 * R : (LR[5] + 0.16) / 2 * R, size = [42, 38, 36, 34, 30, 26][i];
      const tg = S('g', { transform: `translate(${(r * Math.SQRT1_2).toFixed(1)},${(-r * Math.SQRT1_2).toFixed(1)})` }, lab), ti = S('g', {}, tg);
      S('text', { x: 0, y: size * 0.36, 'text-anchor': 'middle', 'font-family': 'Nunito', 'font-weight': 900, 'font-size': size, fill: '#FFFFFF', stroke: '#2A0A50', 'stroke-width': 5, 'paint-order': 'stroke', 'stroke-opacity': 0.35, text: n }, ti);
      X.pop(ti, LT[i] + 0.08, { dur: 0.35, sfx: false });
      X.tl.to(ti, { opacity: 0, duration: 0.25 }, T.collapses - 0.1);
    });
    // the lid of the cut flies off on "further"
    const lid = S('g', {}, starS);
    S('path', { d: `M0,0L0,${-R}A${R},${R} 0 0,1 ${R},0Z`, fill: sg }, lid);
    S('path', { d: `M0,0L0,${-R}A${R},${R} 0 0,1 ${R},0Z`, fill: 'none', stroke: '#FFF0B5', 'stroke-width': 5, opacity: 0.6 }, lid);
    X.tl.to(lid, { x: 120, y: -120, rotation: 14, opacity: 0, duration: 0.65, ease: 'power3.out', svgOrigin: '0 0' }, T.furtherW - 0.05);
    sfx(T.furtherW - 0.05, 'swoosh', 0.3, { dur: 0.5 });
    // red danger tint over the star (iron core stays above it)
    const tint = S('circle', { r: R * 2.7, fill: '#A0102F', opacity: 0 }, starG);
    // iron core: a dark metal ball in the middle of the cut
    const feG = S('g', {}, starG), feIn = S('g', {}, feG);
    const feR = 0.16 * R;
    K.glow(feIn, 0, 0, feR * 2.2, '#FF8A5C', 0.25);
    K.orb(feIn, 0, 0, feR, { fill: '#5A4A86', shade: '#2C1F52', rim: '#FFC9A8', light: [0.5, -0.7], hi: '#B8A8E8' });
    const feTxt = S('text', { x: 0, y: 12, 'text-anchor': 'middle', 'font-family': 'Nunito', 'font-weight': 900, 'font-size': 32, fill: '#FFFFFF', text: 'Fe' }, feIn);
    K.fade(feTxt, T.dead + 0.15, 0.25, 1, 0);
    X.pop(feIn, T.feL - 0.12, { dur: 0.45, ease: 'back.out(1.8)', pitch: 1.6, gain: 0.25 });
    const neon = S('g', { opacity: 0 }, feG);
    S('circle', { r: feR + 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 18, opacity: 0.3, filter: 'url(#kzb6)' }, neon);
    S('circle', { r: feR + 10, fill: 'none', stroke: '#FFFFFF', 'stroke-width': 5 }, neon);
    const blur6 = S('filter', { id: 'kzb6', x: '-50%', y: '-50%', width: '200%', height: '200%' }, X.defs); S('feGaussianBlur', { stdDeviation: 6 }, blur6);
    K.fade(neon, T.feL + 0.1, 0.15, 0, 1); K.fade(neon, T.collapses - 0.3, 0.2, 1, 0);
    const pv = [1500 - SC.x, 250 - SC.y], pl = Math.hypot(...pv), anc = [(pv[0] / pl) * (feR + 12) + SC.x - 1500, (pv[1] / pl) * (feR + 12) + SC.y - 250];
    K.pill(p2, 1500, 250, 'Iron', { fill: '#B8432F', t: T.feL + 0.05, out: T.dead - 0.35, anchor: anc, size: 40, sfx: false });
    // the failed fusion demo inside the core
    const demo = S('g', { opacity: 0 }, feG);
    const fe1 = S('g', {}, demo), fe2 = S('g', {}, demo);
    for (const f of [fe1, fe2]) { K.glow(f, 0, 0, 40, '#E8DDFF', 0.6); K.orb(f, 0, 0, 18, { fill: '#D9CFF7', shade: '#7A68B0', rim: '#FFFFFF', light: [0.5, -0.7] }); }
    const sparks = Array.from({ length: 10 }, (_, i) => { const e = S('path', { d: K.sparkleD(0, 0, 7), fill: '#FFF3C4' }, demo); return { e, a: (i / 10) * Math.PI * 2, r: 70 + (i % 3) * 18 }; });
    const dimmer = S('circle', { r: feR, fill: '#120A30', opacity: 0 }, demo);
    K.fade(demo, T.dead + 0.4, 0.3, 0, 1); K.fade(demo, T.collapse0 - 0.3, 0.3, 1, 0);
    X.every((t) => {
      const app = K.prog(t, T.energy - 0.75, T.energy - 0.08, 'power2.in'), bounce = K.prog(t, T.releasing, T.releasing + 0.55, 'back.out(2)');
      const xo = 46 - 26 * app + 22 * bounce;
      const xd = xo * 0.72; fe1.setAttribute('transform', `translate(${(-xd).toFixed(1)},${(-xd).toFixed(1)})`); fe2.setAttribute('transform', `translate(${xd.toFixed(1)},${xd.toFixed(1)})`);
      const sp = K.prog(t, T.energy - 0.05, T.energy + 0.6, 'power2.in');
      for (const q of sparks) { const r = q.r * (1 - sp); q.e.setAttribute('transform', `translate(${(Math.cos(q.a + sp) * r).toFixed(1)},${(Math.sin(q.a + sp) * r).toFixed(1)}) scale(${(1 - sp * 0.7).toFixed(3)})`); q.e.setAttribute('opacity', t < T.energy - 0.25 ? 0 : (1 - K.prog(t, T.energy + 0.45, T.energy + 0.65)).toFixed(3)); }
      dimmer.setAttribute('opacity', (0.45 * K.prog(t, T.energy + 0.1, T.energy + 0.6) * (1 - bounce * 0.5)).toFixed(3));
      bgRed.setAttribute('opacity', redCh.at(t).toFixed(3)); tint.setAttribute('opacity', (redCh.at(t) * 0.55).toFixed(3));
    });
    sfx(T.dead - 0.05, 'thud', 0.42);
    sfx(T.energy - 0.08, 'tock', 0.3); sfx(T.energy + 0.05, 'blip_down', 0.25); sfx(T.releasing + 0.05, 'boing', 0.12, { pitch: 0.7 });
    // collapse: layers fall in, the star shrinks and darkens, infall streaks, a hot point grows → white-out
    const shrink = K.ch(1).to(T.collapses - 0.05, 0.8, 1.7, 'power2.in');
    const darkC = S('circle', { r: R * 2.7, fill: '#140830', opacity: 0 }, starG);
    const dCh = K.ch(0).to(T.collapses, 0.18, 1.4, 'power1.in');
    const feCh = K.ch(1).to(T.collapses - 0.12, 0.3, 0.7, 'power3.in');
    const streaks = S('g', {}, starG), stk = [];
    for (let i = 0; i < 28; i++) { const a = (i / 28) * Math.PI * 2 + (i % 2) * 0.1, e = S('path', { d: 'M0,0L-70,0', stroke: '#FFF0C8', 'stroke-width': 5, 'stroke-linecap': 'round' }, streaks); stk.push({ e, a, d: (i % 4) * 0.12 }); }
    const hotC = S('circle', { r: 0, fill: '#FFFFFF' }, starG), hotG = K.glow(starG, 0, 0, 1, '#FFFFFF', 1);
    const hotR = K.ch(0).to(T.collapses + 0.55, 26, 1.0, 'power2.in').to(T.explodes - 0.6, 1700, 0.6, 'power2.in');
    X.every((t) => {
      starS.setAttribute('transform', `scale(${shrink.at(t).toFixed(4)})`);
      darkC.setAttribute('opacity', (dCh.at(t) * (1 - K.prog(t, T.explodes - 0.5, T.explodes))).toFixed(3));
      feG.setAttribute('transform', `scale(${feCh.at(t).toFixed(4)})`);
      for (const q of stk) {
        const p = K.prog(t, T.collapses + q.d, T.collapses + q.d + 0.8, 'power2.in'), r = K.lerp(R * 1.3, R * 0.15, p);
        q.e.setAttribute('transform', `rotate(${((q.a * 180) / Math.PI).toFixed(1)}) translate(${(-r).toFixed(1)},0) rotate(180)`);
        q.e.setAttribute('opacity', p > 0 && p < 1 ? Math.sin(Math.PI * p).toFixed(3) : 0);
      }
      const hr = hotR.at(t); hotC.setAttribute('r', Math.min(hr, 120).toFixed(1)); hotG.setAttribute('r', Math.max(1, hr * 4).toFixed(1));
    });
    whiteCh.to(T.explodes - 0.62, 1, 0.62, 'power2.in').to(T.explodes + 0.32, 0, 0.6, 'none');
    sfx(T.collapses - 0.05, 'woosh_low', 0.35, { dur: 1.1 }); sfx(T.collapses + 0.6, 'riser', 0.32, { dur: 1.8 });
    sfx(T.explodes, 'impact', 0.6);
    // the creature watches from the side
    const c = K.critter(p3, { x: 330, y: 905, s: 0.62, float: true, phase: 1.3, amb: 0.3, blinks: [T.furtherW + 1.4, T.siL + 0.4] });
    c.to('lookX', -1, 9, 1e-4).to('lookY', -1, -4, 1e-4).to('arm', -1, 40, 1e-4)
      .to('lid', T.dead - 0.05, 1, 0.2).to('lid', T.collapses - 0.1, 0, 0.12).to('lid', T.explodes - 0.5, 2.4, 0.15)
      .to('cheek', T.furtherW + 0.2, 0.7, 0.25).to('cheek', T.dead - 0.3, 0, 0.2);
    c.hop(T.collapses, 18);
    // foreground rocks lit by the star
    const rocks = S('g', {}, p4);
    [[120, 160, 70], [1840, 980, 95], [1780, 120, 46]].forEach(([x, y, r], i) => {
      const l = [SC.x - x, SC.y - y], n = Math.hypot(...l);
      const rk = S('g', {}, rocks); K.orb(rk, 0, 0, r, { fill: '#2A1A5E', shade: '#120A33', rim: '#F8AE1C', light: [l[0] / n, l[1] / n] });
      X.every((t) => rk.setAttribute('transform', `translate(${(x + Math.sin(t * 0.4 + i) * 16).toFixed(1)},${(y + Math.cos(t * 0.33 + i) * 12).toFixed(1)}) rotate(${(t * 6 + i * 40).toFixed(1)})`));
    });
  });

  // ================================================================ S7 — supernova → fresh gas → disk → our solar system → Earth dive
  const EX = 960 + 330 * Math.cos((32 * Math.PI) / 180), EY = 560 + 0.34 * 330 * Math.sin((32 * Math.PI) / 180);
  X.scene('s7', T.explodes + 0.2, T.you + 0.08, (g) => {
    const rig = K.rig(g, [
      { t: T.explodes + 0.2, x: 960, y: 540, z: 1.32 }, { t: T.explodes + 4.4, x: 960, y: 545, z: 0.93, ease: 'sine.out' },
      { t: T.mixes0 + 1.6, x: 960, y: 560, z: 1.02, ease: 'sine.inOut' }, { t: T.sun0, x: 960, y: 560, z: 1.0, ease: 'sine.inOut' },
      { t: T.earthW - 0.25, x: 1140, y: 600, z: 1.55, ease: 'sine.inOut' },
      { t: T.you - 0.02, x: EX, y: EY, z: 80, ease: 'power3.in', pivot: [EX, EY] },
    ]);
    const p0 = rig.plane(0.08), p1 = rig.plane(0.3), p2 = rig.plane(1), p3 = rig.plane(1.6);
    S('rect', { x: -1100, y: -900, width: 4120, height: 2880, fill: X.radial('s7bg', [[0, '#2A1878'], [0.45, '#120A44'], [1, '#05041A']]) }, p0);
    K.stars(p0, { n: 260, seed: 91, sparkles: 12 });
    for (let i = 0; i < 6; i++) S('path', { d: K.blob(150 + i * 340, 200 + (i % 3) * 300, 240, { n: 9, wob: 0.3, seed: 600 + i, sx: 1.6 }), fill: ['#6A2ADF', '#C0249E', '#2A5FD8'][i % 3], opacity: 0.45 }, p1);
    K.galaxy(p1, 260, 860, 50, '#FFC9EC', 3); K.galaxy(p1, 1700, 200, 40, '#BFE9FF', 8);
    const t0 = T.explodes;
    // remnant shells
    const shellG = S('g', {}, p2);
    const shells = [[680, 1.5, '#F91E8E', 0.5, 0.9], [520, 1.25, '#B03BE0', 0.42, 0.88], [330, 1.0, '#25E8F1', 0.4, 0.84]].map(([Re, tau, col, op, inner], i) => {
      const sgp = S('g', {}, shellG);
      K.glow(sgp, 0, 0, 125, col, 0.45);
      S('path', { d: KZ.blob(0, 0, 100, { n: 12, wob: 0.09, seed: 700 + i }) + KZ.blob(0, 0, 100 * inner, { n: 12, wob: 0.12, seed: 710 + i }), 'fill-rule': 'evenodd', fill: col, opacity: op }, sgp);
      S('path', { d: KZ.blob(0, 0, 100, { n: 12, wob: 0.09, seed: 700 + i }), fill: 'none', stroke: K.mix(col, '#FFFFFF', 0.45), 'stroke-width': 4, opacity: 0.75, 'vector-effect': 'non-scaling-stroke' }, sgp);
      const cr2 = X.rand(720 + i);
      for (let k = 0; k < 9; k++) { const a = (k / 9) * Math.PI * 2 + cr2(); S('path', { d: KZ.blob(Math.cos(a) * 92, Math.sin(a) * 92, 9 + cr2() * 8, { n: 7, wob: 0.3, seed: 730 + i * 10 + k }), fill: K.mix(col, '#FFFFFF', 0.25), opacity: 0.55 }, sgp); }
      if (i === 0) {
        const fr = X.rand(77);
        for (let k = 0; k < 34; k++) { const a = (k / 34) * Math.PI * 2 + fr() * 0.1, r0 = 30 + fr() * 30, r1 = 85 + fr() * 25; S('path', { d: `M${Math.cos(a) * r0},${Math.sin(a) * r0}Q${Math.cos(a + 0.12) * (r0 + r1) / 2},${Math.sin(a + 0.12) * (r0 + r1) / 2} ${Math.cos(a) * r1},${Math.sin(a) * r1}`, fill: 'none', stroke: ['#F91E8E', '#25E8F1', '#FFD36B'][k % 3], 'stroke-width': 2.4 + (k % 3), 'stroke-linecap': 'round', opacity: 0.55, 'vector-effect': 'non-scaling-stroke' }, sgp); }
      }
      return { sgp, Re, tau, i };
    });
    const shellOp = K.ch(1).to(T.mixes0 - 0.7, 0, 1.5, 'power1.inOut');
    const ns = S('g', { transform: 'translate(960,540)' }, p2);
    K.glow(ns, 0, 0, 120, '#9FF6FF', 0.7); K.halo(ns, 0, 0, 7, ['#FFFFFF', '#BFF6FF', '#74D4E7'], { step: 1.6, ops: [1, 0.6, 0.35] });
    const nsOp = K.ch(1).to(T.mixes0, 0, 1.0);
    X.every((t) => {
      const dt = Math.max(0, t - t0);
      for (const q of shells) { const Rr = q.Re * (1 - Math.exp(-dt / q.tau)) + 30 * dt; q.sgp.setAttribute('transform', `translate(960,540) rotate(${(dt * (q.i % 2 ? -4 : 5)).toFixed(2)}) scale(${(Math.max(0.05, Rr) / 100).toFixed(4)})`); }
      shellG.setAttribute('opacity', shellOp.at(t).toFixed(3)); ns.setAttribute('opacity', nsOp.at(t).toFixed(3));
    });
    // gas disk
    const diskId = K.id('disk'), dgr = S('radialGradient', { id: diskId }, X.defs);
    [[0, '#FFE08A', 0.75], [0.16, '#F56131', 0.6], [0.45, '#B02FB8', 0.5], [0.8, '#5A2AD8', 0.25], [1, '#3C1FB1', 0]].forEach(([o, c, a]) => S('stop', { offset: o, 'stop-color': c, 'stop-opacity': a }, dgr));
    const disk = S('g', { opacity: 0 }, p2);
    K.glow(disk, 960, 560, 760, '#E0369E', 0.4); K.glow(disk, 960, 560, 420, '#F8AE1C', 0.45);
    S('ellipse', { cx: 960, cy: 560, rx: 640, ry: 220, fill: `url(#${diskId})` }, disk);
    for (const a of [210, 300, 400]) S('ellipse', { cx: 960, cy: 560, rx: a, ry: a * 0.34, fill: 'none', stroke: '#1A0B4A', 'stroke-width': 9, opacity: 0.25 }, disk);
    K.fade(disk, T.mixes0 + 0.6, 1.8, 0, 1);
    // element confetti: fly out of the explosion, then settle into orbits
    const er = X.rand(97), bits = [];
    const ecol = ['#F8AE1C', '#25E8F1', '#FF5A4D', '#FFFFFF', '#F91E8E'];
    for (let i = 0; i < 80; i++) {
      const el = S('g', {}, p2), col = ecol[i % 5], sz = 4 + er() * 5;
      const tr = S('path', { d: 'M0,0L-100,0', stroke: col, 'stroke-width': sz * 0.9, 'stroke-linecap': 'round', opacity: 0.55 }, el);
      K.glow(el, 0, 0, sz * 3.4, col, 0.8); S('circle', { r: sz, fill: K.mix(col, '#FFFFFF', 0.35) }, el);
      const a = er() * Math.PI * 2;
      bits.push({ el, tr, a, De: 240 + er() * 520, tau: 0.9 + er() * 0.6, oa: 90 + er() * 450, oth: er() * 6.28, dl: er() * 0.7 });
    }
    const dust = S('g', { opacity: 0 }, p2), dl = [];
    for (let i = 0; i < 90; i++) { const e = S('circle', { r: 1.6 + er() * 2.4, fill: ['#F3EAC2', '#C9B6FF', '#FFB0E0'][i % 3] }, dust); dl.push({ e, oa: 80 + er() * 520, oth: er() * 6.28 }); }
    K.fade(dust, T.mixes0 + 0.2, 1.2, 0, 1);
    const orbitXY = (a, th, t) => { const w = 0.55 * Math.pow(200 / a, 1.5); return [960 + a * Math.cos(th + w * t), 560 + 0.34 * a * Math.sin(th + w * t)]; };
    const dimCh = K.ch(1).to(T.planets + 0.5, 0.45, 1.0);
    X.every((t) => {
      const dt = Math.max(0, t - t0);
      for (const b of bits) {
        const d = b.De * (1 - Math.exp(-dt / b.tau)), sp = (b.De / b.tau) * Math.exp(-dt / b.tau);
        let x = 960 + Math.cos(b.a) * d, y = 540 + Math.sin(b.a) * d;
        const p = K.prog(t, T.mixes0 + 0.2 + b.dl, T.gathers + 0.5 + b.dl, 'power2.inOut');
        if (p > 0) { const [ox, oy] = orbitXY(b.oa, b.oth, t); x = K.lerp(x, ox, p); y = K.lerp(y, oy, p); }
        b.el.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)})`);
        b.tr.setAttribute('d', `M0,0L${(-Math.cos(b.a) * Math.min(150, sp * 0.16) * (1 - p)).toFixed(1)},${(-Math.sin(b.a) * Math.min(150, sp * 0.16) * (1 - p)).toFixed(1)}`);
        b.el.setAttribute('opacity', dimCh.at(t).toFixed(3));
      }
      if (t > T.mixes0) for (const q of dl) { const [x, y] = orbitXY(q.oa, q.oth, t); q.e.setAttribute('cx', x.toFixed(1)); q.e.setAttribute('cy', y.toFixed(1)); }
    });
    // title: SUPERNOVA (screen space, one letter per frame-step after the word)
    const title = S('g', {}, fxG);
    const word = 'SUPERNOVA', tsz = 128, track = 0.3 * tsz;
    const tgrad = X.linear('novaT', [[0, '#FFFFFF'], [1, '#FFB8E6']]);
    const glowF = S('filter', { id: 'novaGlow', x: '-30%', y: '-60%', width: '160%', height: '220%' }, X.defs);
    S('feGaussianBlur', { in: 'SourceAlpha', stdDeviation: 14, result: 'b' }, glowF);
    S('feFlood', { 'flood-color': '#F91E8E', 'flood-opacity': 0.85 }, glowF); S('feComposite', { in2: 'b', operator: 'in', result: 'g' }, glowF);
    const fm = S('feMerge', {}, glowF); S('feMergeNode', { in: 'g' }, fm); S('feMergeNode', { in: 'SourceGraphic' }, fm);
    const meas = S('text', { 'font-family': 'Montserrat', 'font-weight': 800, 'font-size': tsz, text: word }, title);
    const ws = [...word].map((ch) => { meas.textContent = ch; return meas.getComputedTextLength(); });
    meas.remove();
    const total = ws.reduce((a, b) => a + b, 0) + track * (word.length - 1);
    let xx = 960 - total / 2;
    [...word].forEach((ch, i) => {
      const lgp = S('g', { transform: `translate(${(xx + ws[i] / 2).toFixed(1)},${540 + tsz * 0.36})` }, title), li = S('g', {}, lgp);
      S('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-family': 'Montserrat', 'font-weight': 800, 'font-size': tsz, fill: tgrad, filter: 'url(#novaGlow)', text: ch }, li);
      gsap.set(li, { opacity: 0, scale: 0.4, transformOrigin: '50% 70%' });
      X.tl.to(li, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(1.8)' }, T.nova + 0.2 + i * 0.045);
      X.tl.to(li, { opacity: 0, x: (xx + ws[i] / 2 - 960) * 0.25, y: -12, duration: 0.5, ease: 'power2.in' }, T.mixes0 - 1.05 + Math.abs(i - 4) * 0.03);
      xx += ws[i] + track;
    });
    sfx(T.nova + 0.2, 'sparkle', 0.3);
    // a new star ignites in the middle of the disk, planets condense
    const newStar = S('g', { transform: 'translate(960,560)' }, p2), nsi = S('g', {}, newStar);
    K.glow(nsi, 0, 0, 320, '#F8AE1C', 0.55); K.rays(nsi, 0, 0, 520, { n: 12, color: '#FFE8A8', op: 0.14, speed: 3 });
    K.halo(nsi, 0, 0, 24, ['#FFFDF0', '#FFE38A', '#F8AE1C', '#F0710E', '#9A2B6A'], { step: 1.35, ops: [1, 0.95, 0.65, 0.4, 0.22], seed: 3 });
    X.pop(nsi, T.newS - 0.2, { dur: 0.6, ease: 'back.out(1.6)', sfx: 'chime', gain: 0.3 });
    [[420, 300, 0.15], [1560, 250, 0.3]].forEach(([x, y, d]) => { const q = S('g', { transform: `translate(${x},${y})` }, p1), qi = S('g', {}, q); K.glow(qi, 0, 0, 70, '#FFE38A', 0.7); S('path', { d: K.sparkleD(0, 0, 20), fill: '#FFFFFF' }, qi); X.pop(qi, T.newS + d, { dur: 0.4, sfx: false }); });
    const PL = [[150, 200, 10, { fill: '#9C8CC8', shade: '#3A2A62' }], [230, 125, 14, { fill: '#F8AE1C', shade: '#9A3B1A' }], [330, 32, 17, null], [470, 250, 30, { fill: '#F56B9E', shade: '#5F1265', bands: [[-0.35, 0.18, '#FFB0C8'], [0.25, 0.14, '#C2306E']] }]];
    PL.forEach(([a, ang, r, o], i) => {
      const x = 960 + a * Math.cos((ang * Math.PI) / 180), y = 560 + 0.34 * a * Math.sin((ang * Math.PI) / 180);
      const orbit = S('ellipse', { cx: 960, cy: 560, rx: a, ry: a * 0.34, fill: 'none', stroke: '#EDE3FF', 'stroke-width': 2.5, opacity: 0.4 }, p2);
      X.drawOn(orbit, T.planets - 0.35 + i * 0.06, 0.6, 'power2.out');
      const pg = S('g', {}, p2), l = [960 - x, 560 - y], n = Math.hypot(...l) || 1;
      if (o) K.orb(pg, x, y, r, { ...o, rim: '#FFE0B0', light: [l[0] / n, l[1] / n] });
      else { K.halo(pg, x, y, r * 1.35, ['#9FE6FF', '#4C8FE0'], { step: 1.3, ops: [0.5, 0.25] }); K.planetEarth(pg, x, y, r, { light: [l[0] / n, l[1] / n] }); }
      if (i === 3) S('ellipse', { cx: x, cy: y, rx: r * 1.9, ry: r * 0.5, fill: 'none', stroke: '#FFD36B', 'stroke-width': 4, opacity: 0.85, transform: `rotate(-12 ${x} ${y})` }, pg);
      X.pop(pg, T.planets - 0.1 + i * 0.1, { dur: 0.42, sfx: i === 2 ? 'pop' : false, pitch: 1.3, gain: 0.22 });
    });
    K.pill(p2, 960, 420, 'Sun', { fill: '#D9850F', t: T.sunW - 0.08, out: T.earthW + 0.4, anchor: [0, 106] });
    K.pill(p2, EX, EY - 132, 'Earth', { fill: '#2C6FD6', t: T.earthW - 0.08, out: T.you - 0.75, anchor: [0, 104], sfx: false });
    const streaksFg = S('g', {}, p3), sr = X.rand(101), st = [];
    for (let i = 0; i < 9; i++) { const e = S('path', { d: 'M0,0L-160,0', stroke: '#E8DDFF', 'stroke-width': 6, 'stroke-linecap': 'round', opacity: 0.35 }, streaksFg); st.push({ e, a: sr() * Math.PI * 2, s: 0.6 + sr() * 0.4 }); }
    X.every((t) => { const dt = t - t0; for (const q of st) { const r = 200 + dt * 900 * q.s; q.e.setAttribute('transform', `translate(960,540) rotate(${((q.a * 180) / Math.PI).toFixed(1)}) translate(${r.toFixed(1)},0) rotate(180)`); q.e.setAttribute('opacity', (0.4 * (1 - K.prog(t, t0 + 0.5, t0 + 1.6))).toFixed(3)); } });
    sfx(T.mixes0 + 0.2, 'woosh_low', 0.25, { dur: 2.0 });
    sfx(T.earthW + 0.15, 'zoom_in', 0.32, { dur: 1.1 });
  });
  // "4.5 billion years ago" tag (screen space)
  K.pill(fxG, 960, 150, '4.5 Billion Years Ago', { fill: '#6A2BC4', t: T.sun0 + 0.05, out: T.one + 0.25, size: 34 });

  // ================================================================ S8 — home again: x-ray montage, ghost stars, made of the cosmos, wide pull-back
  const C8 = { x: 960, y: 862, s: 1.3 };
  X.scene('s8', T.you - 0.34, END + 0.1, (g) => {
    const fg = S('g', {}, g);
    K.fade(fg, T.you - 0.34, 0.32, 0, 1);
    const rig = K.rig(fg, [
      { t: T.you - 0.34, x: 960, y: 560, z: 1.6 }, { t: T.you + 0.65, x: 960, y: 560, z: 1.0, ease: 'expo.out' },
      { t: T.all - 0.3, x: 960, y: 565, z: 1.07, ease: 'sine.inOut' },
      { t: T.starsL + 0.25, x: 960, y: 170, z: 0.95, ease: 'power2.inOut' }, { t: T.listEnd + 0.1, x: 960, y: 160, z: 0.95, ease: 'sine.inOut' },
      { t: T.made0 + 0.6, x: 960, y: 560, z: 1.0, ease: 'power2.inOut' },
      { t: T.close0 - 0.2, x: 960, y: 590, z: 1.13, ease: 'sine.inOut' },
      { t: END, x: 960, y: 420, z: 0.68, ease: 'sine.inOut' },
    ]);
    const pl = planes(rig);
    const dayP = {}, nightP = {};
    for (const k of Object.keys(pl)) { dayP[k] = S('g', {}, pl[k]); nightP[k] = S('g', {}, pl[k]); }
    const wd = world(dayP, DAY, { cx: 960, groundY: 862 }), wn = world(nightP, NIGHT, { cx: 960, groundY: 862 });
    const nightCh = K.ch(0).to(T.all - 0.15, 1, 0.75, 'power1.inOut').to(T.made0 - 0.95, 0, 1.5, 'power1.inOut').to(T.close0 + 0.3, 1, 2.8, 'sine.inOut');
    // sun: up at first, gone at night, rises again on the way back down
    const sun = sunDisc(wd.sunSlot, 1450, 0, 90);
    const sunY = K.ch(470).to(T.all + 0.4, 1050, 0.6, 'power1.in').to(T.made0 - 0.75, 470, 1.4, 'power2.out').to(T.close0 + 0.4, 1000, 3.0, 'sine.in');
    // x-ray overlays tint the world (not the creature) while we look inside
    const ovl = S('g', {}, wd.critterSlot);
    const ovs = [['#9A3BF0', '#3A10A0', '#12053E'], ['#F0306A', '#8A0E42', '#2A0418'], ['#22C0F0', '#0A5A92', '#03183A']].map((c, i) => {
      const gid = K.id('xr'), rg = S('radialGradient', { id: gid, cx: 960, cy: 640, r: 1250, gradientUnits: 'userSpaceOnUse' }, X.defs);
      S('stop', { offset: 0, 'stop-color': c[0] }, rg); S('stop', { offset: 0.38, 'stop-color': c[1] }, rg); S('stop', { offset: 1, 'stop-color': c[2] }, rg);
      return S('rect', { x: -1600, y: -1800, width: 5200, height: 4200, fill: `url(#${gid})`, opacity: 0 }, ovl);
    });
    const lt = 0.24, [ca, fe, ox, al] = [T.calciumL - 0.24, T.ironL - 0.2, T.oxygenL - 0.2, T.all - 0.15];
    const ovCh = [K.ch(0).to(ca, 0.9, lt).to(fe, 0, lt), K.ch(0).to(fe, 0.9, lt).to(ox, 0, lt), K.ch(0).to(ox, 0.9, lt).to(al, 0, 0.6)];
    const critG = S('g', {}, pl.p3);
    const c = K.critter(critG, { ...C8, xray: true, cosmos: true, phase: 2.1, blinks: [T.you + 1.6, T.listEnd + 0.5, T.close0 - 0.6, T.close0 + 2.6] });
    c.to('cheek', T.you - 0.05, 1, 0.2).to('cheek', ca - 0.2, 0, 0.2).to('arm', T.you + 0.02, -35, 0.32, 'back.out(1.8)').to('arm', T.you + 0.85, 62, 0.4)
      .to('xray', ca, 1, lt).to('xray', al, 0, 0.5).to('bones', ca + 0.04, 1, lt).to('bones', fe, 0, 0.2).to('vessels', fe, 1, lt).to('vessels', ox, 0, 0.2).to('lungs', ox, 1, lt).to('lungs', al, 0, 0.4)
      .to('lookX', T.all + 0.1, 3, 0.3).to('lookY', T.all + 0.1, -10, 0.3).to('tilt', T.all + 0.1, -7, 0.5)
      .to('lookX', T.made0 - 0.4, 6, 0.3).to('lookY', T.made0 - 0.4, 2, 0.3).to('tilt', T.made0 - 0.4, 0, 0.5)
      .to('cosmos', T.made - 0.05, 1, 0.8, 'power2.inOut').to('cheek', T.made + 0.55, 1, 0.25)
      .to('cheek', T.wondering - 0.3, 0, 0.25).to('lookX', T.wondering - 0.2, 4, 0.3).to('lookY', T.wondering - 0.2, -10, 0.3).to('tilt', T.wondering - 0.15, -6, 0.6);
    c.hop(T.you + 0.02, 30);
    c.to('amb', T.all - 0.15, 0.42, 0.75).to('amb', T.made0 - 0.95, 0, 1.5).to('amb', T.close0 + 0.3, 0.3, 2.8);
    const back = K.glow(c.glowBack, 0, -150, 360, '#9FE6FF', 0);
    const backCh = K.ch(0).to(T.made, 0.5, 0.9).to(T.close0 + 0.5, 0.75, 2.5);
    X.every((t) => {
      const n = nightCh.at(t);
      for (const k of Object.keys(nightP)) nightP[k].setAttribute('opacity', n.toFixed(3));
      sun.setAttribute('transform', `translate(1450,${sunY.at(t).toFixed(1)})`); sun.setAttribute('opacity', (1 - n).toFixed(3));
      ovCh.forEach((ch, i) => ovs[i].setAttribute('opacity', ch.at(t).toFixed(3)));
      const xr = Math.max(...ovCh.map((ch) => ch.at(t)));
      const fgo = (1 - 0.65 * xr) * (1 - K.prog(t, T.close0 - 0.2, T.close0 + 1.8, 'sine.inOut'));
      dayP.p4.setAttribute('opacity', fgo.toFixed(3)); nightP.p4.setAttribute('opacity', (n * fgo).toFixed(3));
      back.setAttribute('opacity', backCh.at(t).toFixed(3));
    });
    // move the overlay group so it sits under the creature but over the ground (world → critter slot of the day copy)
    // labels for the montage
    const P = (lx, ly) => [C8.x + lx * C8.s, C8.y + ly * C8.s];
    const pillAt = (txt, fill, t0, t1, org, ink) => { const [ax, ay] = P(...org); K.pill(pl.p3, 1420, 520, txt, { fill, t: t0, out: t1, anchor: [ax - 1420, ay - 520], ink, size: 38, sfx: false }); };
    pillAt('Calcium', '#EADBA8', T.calciumL - 0.08, fe - 0.12, [40, -150], '#3B1A6E');
    pillAt('Iron', '#D62F4B', T.ironL - 0.08, ox - 0.12, [8, -128]);
    pillAt('Oxygen', '#1597B8', T.oxygenL - 0.08, al - 0.1, [44, -150]);
    sfx(ca, 'whoosh', 0.18, { dur: 0.4 }); sfx(fe, 'whoosh', 0.18, { dur: 0.4, pitch: 1.15 }); sfx(ox, 'whoosh', 0.18, { dur: 0.4, pitch: 1.3 });
    // breath puffs on "oxygen"
    const [sx0, sy0] = P(172, -171);
    for (let i = 0; i < 6; i++) {
      const b = S('circle', { cx: sx0, cy: sy0, r: 9 + i * 2, fill: '#5FF1F7', opacity: 0 }, pl.p3);
      X.tl.fromTo(b, { attr: { cx: sx0, cy: sy0 }, opacity: 0.85, scale: 0.6 }, { attr: { cx: sx0 + 120 + i * 18, cy: sy0 - 40 - i * 14 }, opacity: 0, duration: 0.9, ease: 'power1.out', immediateRender: false }, T.oxygenL + 0.1 + i * 0.13);
    }
    sfx(T.oxygenL + 0.15, 'bubble', 0.2);
    // three streaks rise into the night sky and become the stars that made those atoms
    const ghosts = [[620, -40, '#F8AE1C', [40, -150]], [960, -170, '#FF4D6D', [8, -128]], [1300, -30, '#25E8F1', [44, -150]]];
    ghosts.forEach(([gx, gy, col, org], i) => {
      const [ox0, oy0] = P(...org), cx1 = (ox0 + gx) / 2 + (i - 1) * 160, cy1 = oy0 - 420;
      const bz = (s) => [(1 - s) ** 2 * ox0 + 2 * (1 - s) * s * cx1 + s * s * gx, (1 - s) ** 2 * oy0 + 2 * (1 - s) * s * cy1 + s * s * gy];
      const trail = S('path', { fill: 'none', stroke: col, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: 0 }, pl.p3);
      const head = S('g', { opacity: 0 }, pl.p3); K.glow(head, 0, 0, 30, col, 1); S('circle', { r: 7, fill: '#FFFFFF' }, head);
      const ta = T.all + i * 0.08, tb = T.starsL + i * 0.06;
      const gs = S('g', { transform: `translate(${gx},${gy})` }, pl.p3), gsi = S('g', {}, gs);
      K.glow(gsi, 0, 0, 200, col, 0.6);
      K.halo(gsi, 0, 0, 20, ['#FFFFFF', ...K.steps(col, '#151040', 3, 0.05, 0.6)], { step: 1.38, seed: 20 + i, ops: [1, 0.95, 0.7, 0.45] });
      S('path', { d: K.sparkleD(0, 0, 46), fill: '#FFFFFF', opacity: 0.9 }, gsi);
      X.pop(gsi, tb - 0.05, { dur: 0.45, ease: 'back.out(1.8)', sfx: i === 0 ? 'chime' : false, gain: 0.24 });
      const td = T.died + i * 0.3;
      X.tl.to(gsi, { scale: 0, duration: 0.28, ease: 'back.in(2)', transformOrigin: '50% 50%' }, td);
      const puff = S('path', { d: K.blob(gx, gy, 70, { n: 9, wob: 0.3, seed: 40 + i }), fill: K.glowFill(col, 0.5), opacity: 0 }, pl.p3);
      X.tl.fromTo(puff, { opacity: 0.7, scale: 0.3, transformOrigin: '50% 50%' }, { opacity: 0, scale: 2.4, duration: 1.4, ease: 'power2.out', immediateRender: false }, td + 0.2);
      for (let k = 0; k < 6; k++) {
        const an = (k / 6) * Math.PI * 2 + i, sp = S('path', { d: K.sparkleD(0, 0, 12), fill: '#FFFFFF', opacity: 0 }, pl.p3);
        X.tl.fromTo(sp, { x: gx, y: gy, opacity: 1 }, { x: gx + Math.cos(an) * 130, y: gy + Math.sin(an) * 130, opacity: 0, duration: 0.7, ease: 'power2.out', immediateRender: false }, td + 0.22);
      }
      sfx(td + 0.22, 'pop', 0.2, { pitch: 0.7 + i * 0.1 });
      X.every((t) => {
        const s = K.prog(t, ta, tb, 'power2.inOut'), on = t > ta && t < tb + 0.15;
        if (on) { const pts = []; for (let k = 0; k <= 8; k++) pts.push(bz(Math.max(0, s - 0.22 + (k / 8) * 0.22))); trail.setAttribute('d', 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L')); const [hx, hy] = bz(s); head.setAttribute('transform', `translate(${hx.toFixed(1)},${hy.toFixed(1)})`); }
        trail.setAttribute('opacity', on ? (0.85 * (1 - K.prog(t, tb, tb + 0.15))).toFixed(3) : 0); head.setAttribute('opacity', on ? (1 - K.prog(t, tb, tb + 0.15)).toFixed(3) : 0);
      });
    });
    sfx(T.all, 'riser', 0.18, { dur: 0.7 });
    // cosmic confetti gathers into the creature: "you're made of it"
    const conf = S('g', {}, pl.p3), cr = X.rand(131), items = [];
    for (let i = 0; i < 11; i++) {
      const a = -Math.PI * 0.95 + (i / 10) * Math.PI * 1.9, R = 330 + cr() * 110, x = C8.x + Math.cos(a) * R * 1.25, y = C8.y - 200 + Math.sin(a) * R * 0.8;
      const it = S('g', {}, conf), ii0 = S('g', {}, it), ii = S('g', { transform: 'scale(1.45)' }, ii0);
      const kind = i % 5;
      if (kind === 0) K.ringPlanet(ii, 0, 0, 20, ['#F56131', '#9A146E', '#FFD36B']);
      else if (kind === 1) K.galaxy(ii, 0, 0, 34, ['#BFE9FF', '#FFC9EC'][i % 2], i);
      else if (kind === 2) K.crystal(ii, 0, 0, 0.75, i % 2 ? ['#2C9ADA', '#74D4E7', '#1B4FA0'] : ['#8321BD', '#B45CF2', '#4E12A0']);
      else if (kind === 3) { K.glow(ii, 0, 0, 44, '#FFF3C4', 0.8); S('path', { d: K.sparkleD(0, 0, 26), fill: '#FFFFFF' }, ii); }
      else K.orb(ii, 0, 0, 16, { fill: '#F91E8E', shade: '#5F1265', rim: '#FFD1EE' });
      X.pop(ii0, T.universeM - 0.3 + i * 0.05, { dur: 0.4, sfx: i === 0 ? 'sparkle' : false, gain: 0.2 });
      items.push({ it, x, y, ph: cr() * 6, d: cr() * 0.25 });
    }
    X.every((t) => {
      for (const q of items) {
        const p = K.prog(t, T.made - 0.18 + q.d, T.made + 0.45 + q.d, 'power2.in');
        const x = K.lerp(q.x + Math.sin(t * 1.4 + q.ph) * 10, C8.x + 10, p), y = K.lerp(q.y + Math.cos(t * 1.2 + q.ph) * 10, C8.y - 170, p);
        q.it.setAttribute('transform', `translate(${x.toFixed(1)},${y.toFixed(1)}) rotate(${(Math.sin(t + q.ph) * 8).toFixed(1)}) scale(${(1 - p * 0.85).toFixed(3)})`);
        q.it.setAttribute('opacity', (1 - K.prog(p, 0.85, 1)).toFixed(3));
      }
    });
    sfx(T.made - 0.15, 'whoosh', 0.22, { dur: 0.7 }); sfx(T.made + 0.35, 'sparkle', 0.3);
    sfx(T.close0 - 0.1, 'woosh_low', 0.2, { dur: 3.5 });
    // keep the world overlay under the creature: move it into the creature's plane just before it
    pl.p3.insertBefore(ovl, critG);
  });

  // ---------------------------------------------------------------- top layers: flash/white-out, vignette, end fade
  scenesG.parentNode.appendChild(fxG);
  S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: X.radial('vig', [[0, '#000', 0], [0.62, '#000', 0], [1, '#0A0420', 0.4]], 0.5, 0.5, 0.8), 'pointer-events': 'none' }, fxG);
  fxG.insertBefore(white, null); fxG.insertBefore(flash, null);
  const endFade = S('rect', { x: 0, y: 0, width: 1920, height: 1080, fill: '#05030F', opacity: 0 }, fxG);
  const endCh = K.ch(0).to(END - 0.9, 1, 0.85, 'power1.in');
  X.every((t) => { white.setAttribute('opacity', whiteCh.at(t).toFixed(3)); flash.setAttribute('opacity', flashCh.at(t).toFixed(3)); endFade.setAttribute('opacity', endCh.at(t).toFixed(3)); });
  // scenes were appended to the root after scenesG; keep fx on top
  X.root.appendChild(fxG);
  X.end(END);
});
