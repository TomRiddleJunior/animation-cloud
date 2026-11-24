/* explainer-launch-promo · kit.js — music-led launch promo / hype film on top of explainer.js (window.X).
 *
 *   index.html: gsap + plugins → /engine/lib/explainer.js → kit.js → scene.js
 *   const K = LP.init(X, {bpm: 140});           // builds the layer stack, returns the kit bound to X
 *
 * Layer stack (back → front)
 *   K.canvas  procedural background redrawn every frame from K.env (radial glow, concentric rings, eclipse arcs,
 *             HUD grid, starfield, radial speed lines). Tween K.env.* on X.tl like any other property.
 *   K.cam     SVG camera group inside X.root (orb, props, logo, shockwaves) — X.cam rig (scale/x/y about centre)
 *   K.world   HTML layer with CSS perspective (dark glass UI panels, notification banners) — tilt with rotationX/Y
 *   K.front   SVG overlay (kinetic type, HUD headlines, cursor, light sweeps, zoom-through discs, flashes)
 *   K.grade   vignette (+ X.grain on top)
 *
 * Beat grid: K.B = 60/bpm; K.b(n) = n beats in seconds; K.bar(n) = n bars. Land every slam / swap / pop on K.b(x).
 * Frames: LP.F(n) = n/30 s. Every helper is a pure function of time (GSAP on X.tl or X.every reading t).
 *
 * Type      K.slam(text|[[str,fill],…], t, o)      T1 slam-in word (×4 → 1 in 4 f, blur, linear drift, speed lines)
 *           K.rgbSlam(text, t, o)                   T2 chroma-split impact word + light beam
 *           K.pill(words, t, o)                     T3 gradient-pill key word + plain words, word stagger 8 f
 *           K.hud(text, t, o)                       T9 HUD corner brackets + glyph-scramble condensed headline
 *           K.chars(parent, text, o)                per-character line ('*accent*' markup) for the programs below
 *           K.scramble / K.decode / K.typewriter    T9 / T14 / T15 character programs (deterministic, seeded)
 *           K.collapse(cs, t)                       letters converge to centre + fade (HUD exit)
 *           K.ribbon(cs, t, o)                      T16 letters fall onto 3 sine ribbons that flatten into one line
 * Moves     K.zoomThrough(t, o)                     T11 disc ×N → flat colour 4 f → iris opens from centre
 *           K.sweep(t, o)                           T5 white diagonal light-sweep wipe (returns swap time)
 *           K.flash(t, o) · K.shock(t, x, y, o)     white flash · expanding shock ring
 *           K.tiltIn(el, t, o) · K.pullBack(el, t)  T4 3D UI tilt-in / settle · T6 pull-back to isolate
 *           K.field(t0, t1, o)                      ember type-card field (moving rings, lines, ring-dots, pumping hot spot)
 *           K.hop(el, t, to, frames, ease)          beat-locked camera hop on a UI panel (chain every 2 beats)
 *           K.span(el, t0, t1)                      visible only in [t0, t1) (visibility 'inherit', so opacity tweens stay free)
 *           K.screenPos(el, T)                      element centre on screen at time T (seeks the timeline at build)
 * Music     K.hits(t0, t1, pattern)                 drum-hit times on the bar grid (hype-trap kick = [0, .75, 2.5] beats)
 *           K.ringPulse(t, px) · K.pulseBars(b0, b1, pattern, px)   ring surge + light pump (K.pumpAt(t)) on the drums
 *           K.bounce(el, times, {origin, amt})      kick bounce (+4 % → 1 in 9 f) on held type / logos
 *           K.envTo(from, to, t, dur, ease)         tween the background state K.env (glow, rings, arcs, speed, spot, …)
 * Objects   K.orb(parent, o) · K.orbDiv(size)       hero token (SVG / HTML)  — the thing that carries the viewer
 *           K.cursor(parent) · K.cursorTo · K.click glossy cursor, curved travel, squash + ripple click
 *           K.panel(o) · K.icon(name) · K.avatar · K.tag · K.notif     dark glass UI kit (HTML)
 *           K.fileIcon(parent, o) · K.mark(parent, o) · K.markBuild(m, t) · K.wordmark(parent, o)
 *           K.burst(parent, x, y, t, o)             confetti / spark burst (ballistic, seeded)
 */
(function () {
  const LP = (window.LP = {});
  const F = (LP.F = (n) => n / 30);
  const W = 1920, H = 1080, NS = 'http://www.w3.org/2000/svg';

  LP.PAL = {
    bg0: '#050304', bg1: '#140b08', bg2: '#22120b',         // warm black ground (radial: bg2 centre → bg0 corners)
    ember: '#ff5a1f', flame: '#ff7b2c', gold: '#ffb547',   // ONE hue family: ember → flame → gold
    cream: '#fff1df', text: '#fff7ee', rust: '#8a3212', deep: '#3a1508',
    mute: '#a89489', dim: '#5e4d45', panel: '#120d0b', panel2: '#1b1411', line: '#2f2420',
    pillInk: '#2b1206', fieldC: '#e5521b',
  };
  const GLYPHS = '#%&@$ABCDEFGHJKLMNPRSTUVWXYZ0123456789<>/+=';
  const hash = (a, b) => { const s = Math.sin(a * 12.9898 + b * 78.233) * 43758.5453; return s - Math.floor(s); };
  LP.hash = hash;

  LP.init = function (X, o = {}) {
    const P = Object.assign({}, LP.PAL, o.pal || {});
    const K = { X, P, F, bpm: o.bpm || 140 };
    K.B = 60 / K.bpm;
    K.b = (n) => n * K.B;
    K.bar = (n) => n * 4 * K.B;
    const tl = X.tl;

    // ------------------------------------------------------------------ layers
    const st = X.stage;
    st.style.background = P.bg0;
    const cv = document.createElement('canvas');
    cv.width = W; cv.height = H;
    Object.assign(cv.style, { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px', zIndex: 0 });
    st.insertBefore(cv, st.firstChild);
    K.canvas = cv;
    const ctx = cv.getContext('2d');
    X.root.style.zIndex = 1;
    K.cam = X.cam(X.svg('g', { id: 'cam' }));
    K.fieldLayer = X.svg('g', { id: 'field' });   // full-frame colour fields (above props, below UI + type)
    K.world = X.html('div', { id: 'world', style: { position: 'absolute', left: 0, top: 0, width: W + 'px', height: H + 'px', zIndex: 2, perspective: '1800px', perspectiveOrigin: '50% 45%', overflow: 'hidden' } });
    const fr = document.createElementNS(NS, 'svg');
    fr.setAttribute('viewBox', `0 0 ${W} ${H}`); fr.setAttribute('width', W); fr.setAttribute('height', H);
    Object.assign(fr.style, { position: 'absolute', left: 0, top: 0, zIndex: 3, overflow: 'visible' });
    st.appendChild(fr);
    K.front = fr;
    K.type = X.svg('g', { id: 'type' }, fr);
    K.fx = X.svg('g', { id: 'fx' }, fr);
    K.grade = X.html('div', { style: { position: 'absolute', inset: 0, zIndex: 6, pointerEvents: 'none', background: 'radial-gradient(ellipse 72% 70% at 50% 50%, rgba(0,0,0,0) 52%, rgba(0,0,0,.62) 100%)' } });
    if (o.grain !== false) X.grain(o.grain ?? 0.035);

    // shared defs (ids are document-global, so front and back SVGs both use them)
    K.blur = (std) => { const id = 'lpb' + String(std).replace('.', '_'); if (!document.getElementById(id)) { const f = X.svg('filter', { id, x: '-80%', y: '-80%', width: '260%', height: '260%' }, X.defs); X.svg('feGaussianBlur', { stdDeviation: std }, f); } return `url(#${id})`; };
    K.bloom = X.glow('lpBloom', 10, P.flame, 0.9);
    K.bloomGold = X.glow('lpBloomGold', 6, P.gold, 0.9);
    K.shadowF = X.shadow('lpShadow', 0, 14, 22, '#000', 0.55);
    X.linear('lpPill', [[0, P.ember], [0.55, P.gold], [1, P.cream]], 0, 0, 1, 0);
    X.linear('lpBar', [[0, P.ember], [1, P.gold]], 0, 0, 1, 0);
    X.linear('lpGoldV', [[0, P.cream], [0.5, P.gold], [1, P.ember]]);
    X.linear('lpTile', [[0, '#2a160e'], [1, '#0e0806']]);
    X.linear('lpBeam', [[0, P.gold, 0], [0.45, P.cream, 0.85], [0.55, P.cream, 0.85], [1, P.gold, 0]], 0, 0, 1, 0);
    X.linear('lpSweep', [[0, '#fff', 0], [0.42, '#fff4e6', 0.0], [0.5, '#fff4e6', 0.92], [0.58, '#fff4e6', 0.0], [1, '#fff', 0]], 0, 0, 1, 0);
    (() => { const g = X.svg('radialGradient', { id: 'lpOrb', cx: 0.5, cy: 0.5, r: 0.5, fx: 0.38, fy: 0.34 }, X.defs);
      [[0, '#fffaf0'], [0.22, '#ffe0a6'], [0.5, P.flame], [0.78, P.ember], [1, '#7d240a']].forEach(([of, c]) => X.svg('stop', { offset: of, 'stop-color': c }, g)); })();
    X.linear('lpDoc', [[0, '#5a2e1a'], [1, '#26140d']]);
    X.radial('lpFieldHi', [[0, '#ffb15a', 0.75], [0.55, '#ff7a33', 0.35], [1, '#ff7a33', 0]]);

    // ------------------------------------------------------------------ CSS for the HTML UI kit
    const css = document.createElement('style');
    css.textContent = `
      .lp-panel{position:absolute;box-sizing:border-box;border-radius:26px;background:linear-gradient(180deg,${P.panel2},${P.panel});
        border:1.5px solid rgba(255,123,44,.55);font-family:Inter,sans-serif;color:${P.text};overflow:hidden;
        box-shadow:0 0 0 10px rgba(255,90,31,.08),0 0 90px rgba(255,90,31,.45),0 50px 90px rgba(0,0,0,.65),inset 0 1px 0 rgba(255,255,255,.09)}
      .lp-head{height:70px;display:flex;align-items:center;gap:14px;padding:0 26px;border-bottom:1px solid ${P.line};font-size:22px;font-weight:600}
      .lp-dot{width:14px;height:14px;border-radius:50%;background:#3b2f2a}
      .lp-search{margin-left:18px;height:38px;flex:0 0 320px;border-radius:19px;background:#0c0908;border:1px solid ${P.line};display:flex;align-items:center;gap:10px;padding:0 14px;color:${P.dim};font-size:17px;font-weight:500}
      .lp-row{position:absolute;left:0;right:0;height:78px;display:flex;align-items:center;gap:18px;padding:0 26px;border-bottom:1px solid rgba(47,36,32,.7)}
      .lp-tile{width:46px;height:46px;border-radius:13px;background:#231915;border:1px solid #3a2b25;display:flex;align-items:center;justify-content:center;flex:none}
      .lp-ava{width:46px;height:46px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:17px;color:${P.pillInk};flex:none;box-shadow:0 0 0 2px rgba(255,180,120,.35)}
      .lp-tt{font-size:25px;font-weight:650;white-space:nowrap}
      .lp-sub{font-size:20px;color:${P.mute};white-space:nowrap;font-weight:450}
      .lp-tag{height:36px;padding:0 16px;border-radius:18px;display:inline-flex;align-items:center;gap:8px;font-size:17px;font-weight:700;letter-spacing:.04em;white-space:nowrap}
      .lp-notif{position:absolute;box-sizing:border-box;border-radius:22px;background:rgba(30,22,19,.92);border:1px solid rgba(255,140,80,.28);
        display:flex;align-items:center;gap:18px;padding:0 22px;font-family:Inter,sans-serif;color:${P.text};box-shadow:0 18px 40px rgba(0,0,0,.55),0 0 30px rgba(255,90,31,.12)}
      .lp-card{position:absolute;box-sizing:border-box;border-radius:16px;background:linear-gradient(180deg,#33241d,#241914);border:1px solid #5a3f33;padding:14px 18px;font-family:Inter,sans-serif;color:${P.text};box-shadow:0 12px 26px rgba(0,0,0,.5)}
      .lp-btn{position:absolute;display:flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;font-family:Inter,sans-serif;font-weight:700;color:${P.pillInk};
        background:linear-gradient(90deg,${P.ember},${P.gold});box-shadow:0 0 30px rgba(255,120,40,.55)}
      .lp-orb{position:absolute;border-radius:50%;background:radial-gradient(circle at 38% 34%,#fffaf0 0,#ffe0a6 18%,${P.flame} 48%,${P.ember} 76%,#7d240a 100%);
        box-shadow:0 0 18px 4px rgba(255,110,40,.75),0 0 60px 12px rgba(255,90,31,.35)}
    `;
    document.head.appendChild(css);

    // ------------------------------------------------------------------ background (K.env → canvas, every frame)
    const env = (K.env = {
      glow: 0.5, gx: 960, gy: 540, gr: 760,          // breathing radial ember glow
      rings: 0.5, ringSpeed: 52, ringOff: 0, rx: 960, ry: 540,  // concentric rings drifting outward (tween ringOff to surge in/out)
      arcs: 0, arcGap: 0,                           // eclipse rim arcs top + bottom
      grid: 0, stars: 0.7,                          // HUD grid · starfield
      speed: 0, speedDir: 1,                        // radial speed lines (1 = outward / zoom-in feel, -1 = suck-in)
      spot: 0, spotX: 960,                          // top spotlight (end card) and its x (swing it slowly)
      lift: 0,                                      // whole-ground brightening (0..1)
      bokeh: 0.6,                                   // big soft out-of-focus discs drifting in parallax
      pump: 1,                                      // how hard ring pulses kick the light (0 = rings only)
    });
    const pulses = [];   // ring surges: K.ringPulse(t, px) - summed in drawBg, so declaration order is irrelevant
    const rr = X.rand(11);
    const stars = Array.from({ length: 80 }, () => ({ x: rr() * W, y: rr() * H, s: 0.8 + rr() * 2.2, v: 6 + rr() * 22, ph: rr() * 6.28, a: 0.35 + rr() * 0.65 }));
    const bokeh = Array.from({ length: 12 }, () => ({ x: rr() * W, y: rr() * H, r: 50 + rr() * 150, v: 14 + rr() * 50, ph: rr() * 6.28, a: 0.05 + rr() * 0.09, gold: rr() < 0.4 }));
    const lines = Array.from({ length: 150 }, () => ({ ang: rr() * Math.PI * 2, ph: rr(), len: 60 + rr() * 220, w: 1 + rr() * 2.5, gold: rr() < 0.35 }));
    const rgba = (hex, a) => { const n = parseInt(hex.slice(1), 16); return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`; };
    K.rgba = rgba;
    /** drum pump at time t (0..2): every ring pulse also kicks the light (sidechain feel), decaying in ~0.15 s */
    K.pumpAt = (t) => {
      let pump = 0;
      for (const p of pulses) if (t >= p.t && t - p.t < 0.8) pump += (p.amt / 60) * Math.exp(-(t - p.t) / 0.15);
      return Math.min(2, pump * env.pump);
    };
    function drawBg(t) {
      const pump = K.pumpAt(t);
      ctx.globalCompositeOperation = 'source-over';
      const g = ctx.createRadialGradient(960, 540, 0, 960, 540, 1150);
      g.addColorStop(0, P.bg2); g.addColorStop(0.55, P.bg1); g.addColorStop(1, P.bg0);
      ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
      if (env.lift > 0.001) { ctx.fillStyle = rgba(P.rust, env.lift * 0.5); ctx.fillRect(0, 0, W, H); }
      ctx.globalCompositeOperation = 'lighter';
      if (env.rings > 0.005) {   // concentric bands (the "black glass" ring field), drifting outward
        let pu = 0;
        for (const p of pulses) if (t > p.t) { const u = Math.min(1, (t - p.t) / p.dur); pu += p.amt * (1 - (1 - u) ** 3); }
        const per = 58, off = (((t * env.ringSpeed + env.ringOff + pu) % per) + per) % per;
        ctx.lineWidth = per * 0.44;
        for (let r = off; r < 1500; r += per) {
          const a = env.rings * 0.1 * (1 + 0.6 * pump) * Math.max(0, 1 - r / 1450) * (0.55 + 0.45 * Math.sin(r * 0.011 - t * 1.6));
          if (a <= 0.002) continue;
          ctx.strokeStyle = rgba(P.flame, a);
          ctx.beginPath(); ctx.arc(env.rx, env.ry, r, 0, Math.PI * 2); ctx.stroke();
        }
      }
      if (env.grid > 0.005) {
        ctx.lineWidth = 1.5; ctx.strokeStyle = rgba(P.flame, 0.07 * env.grid);
        const off = (t * 9) % 120;
        ctx.beginPath();
        for (let x = -120 + off; x < W + 120; x += 120) { ctx.moveTo(x, 0); ctx.lineTo(x, H); }
        for (let y = -120 + off * 0.5; y < H + 120; y += 120) { ctx.moveTo(0, y); ctx.lineTo(W, y); }
        ctx.stroke();
      }
      if (env.glow > 0.005) {
        const br = 1 + 0.09 * Math.sin(t * Math.PI * 2 / 2.4) + 0.12 * pump, R = env.gr * br, gl = Math.min(1.6, env.glow * (1 + 0.8 * pump));
        const gg = ctx.createRadialGradient(env.gx, env.gy, 0, env.gx, env.gy, R);
        gg.addColorStop(0, rgba(P.ember, Math.min(1, 0.55 * gl))); gg.addColorStop(0.35, rgba(P.ember, 0.2 * gl)); gg.addColorStop(1, rgba(P.ember, 0));
        ctx.fillStyle = gg; ctx.fillRect(env.gx - R, env.gy - R, 2 * R, 2 * R);
      }
      if (env.spot > 0.005) {
        const gg = ctx.createRadialGradient(env.spotX, -120, 0, env.spotX, -120, 980);
        gg.addColorStop(0, rgba(P.gold, 0.42 * env.spot)); gg.addColorStop(0.5, rgba(P.ember, 0.16 * env.spot)); gg.addColorStop(1, rgba(P.ember, 0));
        ctx.fillStyle = gg; ctx.fillRect(0, 0, W, H);
      }
      if (env.arcs > 0.005) {      // eclipse: two huge rim-lit circles framing the centre
        const R = 2150;
        for (const [cy, dir] of [[-R + 150 - env.arcGap, 1], [H + R - 150 + env.arcGap, -1]]) {
          for (const [lw, a, c] of [[110, 0.05, P.ember], [46, 0.1, P.ember], [16, 0.22, P.flame], [4, 0.85, P.cream]]) {
            ctx.lineWidth = lw; ctx.strokeStyle = rgba(c, Math.min(1, a * env.arcs * (0.92 + 0.08 * Math.sin(t * 2.6 + dir)) * (1 + 0.5 * pump)));
            ctx.beginPath(); ctx.arc(960, cy, R, 0, Math.PI * 2); ctx.stroke();
          }
        }
      }
      if (env.bokeh > 0.005) {
        for (const k of bokeh) {
          const x = ((k.x + t * k.v) % (W + 2 * k.r)) - k.r, y = k.y + 26 * Math.sin(t * 0.6 + k.ph);
          const c = k.gold ? P.gold : P.flame, gg = ctx.createRadialGradient(x, y, 0, x, y, k.r);
          gg.addColorStop(0, rgba(c, k.a * env.bokeh)); gg.addColorStop(0.7, rgba(c, k.a * 0.6 * env.bokeh)); gg.addColorStop(1, rgba(c, 0));
          ctx.fillStyle = gg; ctx.beginPath(); ctx.arc(x, y, k.r, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (env.stars > 0.005) {
        for (const s of stars) {
          const x = (s.x + t * s.v) % W, a = env.stars * s.a * (0.6 + 0.4 * Math.sin(t * 2.2 + s.ph));
          ctx.fillStyle = rgba(P.cream, a); ctx.beginPath(); ctx.arc(x, s.y, s.s, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (env.speed > 0.005) {
        ctx.lineCap = 'round';
        for (const l of lines) {
          let u = (t * 1.7 + l.ph) % 1; if (env.speedDir < 0) u = 1 - u;
          const r0 = 90 + u * u * 1300, r1 = r0 + l.len * (0.4 + u * 1.2), c = Math.cos(l.ang), s = Math.sin(l.ang);
          ctx.strokeStyle = rgba(l.gold ? P.gold : P.flame, env.speed * 0.55 * Math.sin(Math.PI * u));
          ctx.lineWidth = l.w;
          ctx.beginPath(); ctx.moveTo(960 + c * r0, 540 + s * r0); ctx.lineTo(960 + c * r1, 540 + s * r1); ctx.stroke();
        }
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    X.every(drawBg);
    /** ring surge: the concentric field jumps outward by `amt` px (cubic ease-out over dur) - put one on every hit. */
    K.ringPulse = (t, amt = 70, dur = F(12)) => pulses.push({ t, amt, dur });
    /** ring surges locked to the drum pattern: bars [b0, b1), `hits` = beat offsets inside a bar (hype-trap kick = 0, .75, 2.5). */
    K.pulseBars = (bar0, bar1, hits = [0, 0.75, 2.5], amt = 46) => {
      for (let n = bar0; n < bar1; n++) for (const h of hits) K.ringPulse(K.bar(n) + h * K.B, amt, F(10));
    };

    // ------------------------------------------------------------------ timing / visibility utilities
    // NB: show with 'inherit', never 'visible' — GSAP writes a reverted computed value inline when the timeline is
    // seeked back (K.screenPos does that at build time) and an inline 'visible' child ignores a hidden parent.
    // Toggle children inside a spanned group with opacity, not visibility.
    K.span = (el, t0, t1) => {
      gsap.set(el, { visibility: t0 <= 0 ? 'inherit' : 'hidden' });
      if (t0 > 0) tl.set(el, { visibility: 'inherit' }, t0);
      if (t1 != null) tl.set(el, { visibility: 'hidden' }, t1);
      return el;
    };
    /** Centre of an element on the 1920×1080 stage at time T (seeks the timeline during the build). */
    K.screenPos = (el, T) => {
      tl.seek(T, false);
      const r = el.getBoundingClientRect(), s = X.stage.getBoundingClientRect();
      tl.seek(0, false);
      return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2, w: r.width, h: r.height };
    };
    /** drum-hit times in [t0, t1): `hits` = beat offsets inside each bar (hype-trap kick = 0, .75, 2.5). */
    K.hits = (t0, t1, hits = [0, 0.75, 2.5]) => {
      const out = [];
      for (let n = Math.floor(t0 / K.bar(1)); K.bar(n) < t1; n++) for (const h of hits) { const t = K.bar(n) + h * K.B; if (t >= t0 && t < t1) out.push(t); }
      return out;
    };
    /** kick bounce: scale +amt then settle in `frames` on every time in `times` (el must not carry other scale tweens). */
    K.bounce = (el, times, o = {}) => {
      if (o.origin) gsap.set(el, { svgOrigin: o.origin });
      for (const t of times) tl.fromTo(el, { scale: 1 + (o.amt ?? 0.045) }, { scale: 1, duration: F(o.frames ?? 9), ease: 'power2.out', immediateRender: false }, t);
    };
    /** Tween any env field with fromTo (seek-safe). */
    K.envTo = (from, to, t, dur = 0.6, ease = 'power2.inOut') => tl.fromTo(env, from, { ...to, duration: dur, ease, immediateRender: false }, t);

    // ------------------------------------------------------------------ text measuring + character lines
    const measure = (text, size, font, weight = 700, track = 0) => {
      const p = X.svg('text', { x: 0, y: -500, 'font-family': font, 'font-size': size, 'font-weight': weight, 'letter-spacing': track, text, style: { whiteSpace: 'pre' } }, X.root);
      const w = p.getComputedTextLength(); p.remove(); return w;
    };
    K.measure = measure;
    /** Per-character line. text may mark accent spans with *...*. Returns {g, chars:[{g, nodes, ch, cx, fill}], width, x0}. */
    K.chars = (parent, text, o = {}) => {
      const size = o.size || 100, font = o.font || 'Inter', weight = o.weight || 700, track = o.track || 0;
      const fills = [], plain = [];
      let acc = false;
      for (const c of text) { if (c === '*') { acc = !acc; continue; } plain.push(c); fills.push(acc ? (o.accent || P.gold) : (o.fill || P.text)); }
      const str = plain.join('');
      const g = X.svg('g', {}, parent);
      const probe = X.svg('text', { x: 0, y: 0, 'font-family': font, 'font-size': size, 'font-weight': weight, 'letter-spacing': track, text: str, style: { whiteSpace: 'pre' } }, g);
      const n = Math.min(str.length, probe.getNumberOfChars()), xs = [], ws = [];
      for (let i = 0; i < n; i++) { xs.push(probe.getStartPositionOfChar(i).x); ws.push(probe.getSubStringLength(i, 1)); }
      const width = n ? xs[n - 1] + ws[n - 1] - xs[0] : 0;
      probe.remove();
      const anchor = o.anchor || 'middle';
      const x0 = (o.x ?? 960) - (anchor === 'middle' ? width / 2 : anchor === 'end' ? width : 0);
      const y = o.y ?? 540;
      const chars = [];
      for (let i = 0; i < n; i++) {
        const cx = x0 + xs[i] - xs[0] + ws[i] / 2;
        const cg = X.svg('g', {}, g);
        gsap.set(cg, { x: cx, y });
        const nodes = [];
        const ex = o.extrude;
        if (ex) for (let k = ex.n; k >= 1; k--) nodes.push(X.svg('text', { x: 0, y: k * ex.dy, 'text-anchor': 'middle', 'font-family': font, 'font-size': size, 'font-weight': weight, fill: ex.fill, text: str[i] }, cg));
        const face = X.svg('text', { x: 0, y: 0, 'text-anchor': 'middle', 'font-family': font, 'font-size': size, 'font-weight': weight, fill: fills[i], text: str[i] }, cg);
        nodes.push(face);
        chars.push({ g: cg, nodes, face, ch: str[i], cx, fill: fills[i], vis: true, txt: str[i] });
      }
      const cs = { g, chars, width, x0, y, size, progs: [], text: str };
      if (o.hidden !== false) for (const c of chars) { c.g.style.visibility = 'hidden'; c.vis = false; }
      cs.set = (c, ch, fill, rot, vis) => {
        if (vis !== c.vis) { c.g.style.visibility = vis ? 'inherit' : 'hidden'; c.vis = vis; }
        if (!vis) return;
        if (ch !== c.txt) { for (const nd of c.nodes) nd.textContent = ch; c.txt = ch; }
        if (fill !== c.curFill) { c.face.setAttribute('fill', fill); c.curFill = fill; }
        const tr = rot ? `rotate(${rot.toFixed(1)})` : '';
        if (tr !== c.curRot) { c.face.setAttribute('transform', tr); c.curRot = tr; }
      };
      X.every((T) => {
        let p = null;
        for (const q of cs.progs) if (T >= q.t) p = q;
        if (!p) { if (o.hidden !== false) for (const c of chars) cs.set(c, c.ch, c.fill, 0, false); return; }
        p.fn(T);
      });
      return cs;
    };
    const glyph = (fr, i, seed = 0) => GLYPHS[Math.floor(hash(fr + seed * 7.1, i * 3.7 + seed) * GLYPHS.length)];
    /** T9 glyph scramble, left→right: each char tumbles in as tinted random glyphs for `settle` frames. */
    K.scramble = (cs, t, o = {}) => {
      const per = o.perChar ?? 1, settle = o.settle ?? 4, c0 = o.color || P.flame, seed = o.seed || 1;
      cs.progs.push({ t, fn: (T) => {
        const f = (T - t) * 30;
        cs.chars.forEach((c, i) => {
          const u = f - i * per;
          if (c.ch === ' ' || u < 0) return cs.set(c, c.ch, c.fill, 0, false);
          if (u < settle) return cs.set(c, glyph(Math.floor(f), i, seed), c0, 90 * (1 - u / settle), true);
          cs.set(c, c.ch, c.fill, 0, true);
        });
      } });
      if (o.sfx !== false) X.sfx(t, 'glitch', { dur: Math.max(0.15, cs.chars.length * per / 30), gain: 0.22 });
    };
    /** T14 random-order decode: each char flickers `lead` frames, then resolves; rank order is seeded. */
    K.decode = (cs, t, o = {}) => {
      const per = o.perChar ?? 1, lead = o.lead ?? 3, seed = o.seed || 7, r = X.rand(seed);
      const order = cs.chars.map((_, i) => i);
      if (o.random !== false) for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]]; }
      const rank = []; order.forEach((ci, k) => (rank[ci] = k));
      cs.progs.push({ t, fn: (T) => {
        const f = (T - t) * 30;
        cs.chars.forEach((c, i) => {
          const u = f - rank[i] * per;
          if (c.ch === ' ' || u < -lead) return cs.set(c, c.ch, c.fill, 0, false);
          if (u < 0) return cs.set(c, glyph(Math.floor(f / 2), i, seed), o.color || P.flame, 0, true);
          cs.set(c, c.ch, c.fill, 0, true);
        });
      } });
      if (o.sfx !== false) X.sfx(t, 'glitch', { dur: Math.max(0.12, cs.chars.length * per / 30), gain: 0.18 });
    };
    /** T15 typewriter at `cps` characters per second (10 = information the viewer must read). */
    K.typewriter = (cs, t, o = {}) => {
      const cps = o.cps ?? 10;
      cs.progs.push({ t, fn: (T) => { const n = (T - t) * cps; cs.chars.forEach((c, i) => cs.set(c, c.ch, c.fill, 0, i < n && c.ch !== ' ')); } });
      if (o.sfx !== false) X.sfx(t, 'type', { dur: cs.chars.length / cps, gain: 0.3 });
    };
    /** show all characters (no animation) from t. */
    K.show = (cs, t) => cs.progs.push({ t, fn: () => cs.chars.forEach((c) => cs.set(c, c.ch, c.fill, 0, c.ch !== ' ')) });
    /** letters converge to the line centre and fade (HUD exit, 4 f). */
    K.collapse = (cs, t, o = {}) => {
      const cx = o.x ?? (cs.x0 + cs.width / 2), dur = o.dur ?? F(4);
      cs.chars.forEach((c) => tl.fromTo(c.g, { x: c.cx, opacity: 1 }, { x: cx, opacity: 0, duration: dur, ease: 'expo.in', immediateRender: false }, t));
    };

    // ------------------------------------------------------------------ T1 slam-in word
    /** text: string or [[str, fill], …]. o: x, y, size, font, hold (s legible), from (start scale), dx, endScale,
     *  out: 'cut' | 'blur' | 'zoom', speed (speed-line burst), sfx, parent. Returns {g, t1 (end time)}. */
    K.slam = (text, t, o = {}) => {
      const x = o.x ?? 960, y = o.y ?? 540, size = o.size ?? 220, inF = o.inF ?? 4, hold = o.hold ?? 0.9;
      const g = X.svg('g', {}, o.parent || K.type);
      const tx = X.svg('text', { x, y: y + size * 0.36, 'text-anchor': 'middle', 'font-family': o.font || 'Archivo Black', 'font-size': size, 'font-weight': o.weight || 400, 'letter-spacing': o.track ?? -size * 0.01, fill: o.fill || P.text }, g);
      const parts = Array.isArray(text) ? text : [[text, o.fill || P.text]];
      for (const [s, f] of parts) X.svg('tspan', { fill: f, text: s }, tx);
      if (o.glow !== false) tx.setAttribute('filter', K.bloom);
      const out = o.out || 'zoom', tIn = t + F(inF), tOut = tIn + hold, outF = out === 'cut' ? 0 : out === 'zoom' ? 5 : 3;
      K.span(g, t, tOut + F(outF));
      gsap.set(g, { svgOrigin: `${x} ${y}` });
      tl.fromTo(g, { scale: o.from ?? 4, filter: 'blur(18px)' }, { scale: 1, filter: 'blur(0px)', duration: F(inF), ease: 'expo.out', immediateRender: false }, t);
      tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: F(inF), ease: 'power1.in', immediateRender: false }, t);
      tl.fromTo(g, { x: 0, scale: 1 }, { x: o.dx ?? 110, y: o.dy ?? 0, scale: o.endScale ?? 0.84, duration: hold, ease: 'none', immediateRender: false }, tIn);
      if (out === 'blur') tl.to(g, { filter: 'blur(14px)', opacity: 0, duration: F(3), ease: 'power2.in' }, tOut);
      if (out === 'zoom') tl.to(g, { scale: 2.6, opacity: 0, filter: 'blur(10px)', duration: F(5), ease: 'expo.in' }, tOut);
      if (o.speed !== false) K.envTo({ speed: o.speedAmt ?? 0.9, speedDir: 1 }, { speed: 0.12 }, t, hold + F(inF), 'power2.out');
      if (o.pulse !== false) K.ringPulse(t, o.pulse ?? 90);
      if (o.sfx !== false) { X.sfx(t - 0.1, 'whoosh', { dur: 0.28, gain: 0.32 }); X.sfx(t, o.hit || 'impact', { dur: 0.7, gain: o.gain ?? 0.42, pitch: o.pitch ?? 1 }); }
      return { g, text: tx, t1: tOut + F(outF) };
    };

    // ------------------------------------------------------------------ T2 chroma-split impact word + beam
    K.rgbSlam = (text, t, o = {}) => {
      const x = o.x ?? 960, y = o.y ?? 540, size = o.size ?? 260, hold = o.hold ?? 1.0;
      const g = X.svg('g', {}, o.parent || K.type);
      const beam = X.svg('rect', { x: x - 90, y: -60, width: 180, height: H + 120, fill: 'url(#lpBeam)', opacity: 0.8 }, g);
      beam.setAttribute('filter', K.blur(14));
      const mk = (fill, blend) => {
        const tx = X.svg('text', { x, y: y + size * 0.36, 'text-anchor': 'middle', 'font-family': o.font || 'Archivo Black', 'font-size': size, 'letter-spacing': -size * 0.01, fill, style: blend ? { mixBlendMode: 'screen' } : {} }, g);
        const parts = Array.isArray(text) ? text : [[text, null]];
        for (const [s, f] of parts) X.svg('tspan', { fill: blend ? fill : (f || fill), text: s }, tx);
        return tx;
      };
      const red = mk('#ff2a3d', true), cyan = mk('#2ae8ff', true), main = mk(o.fill || P.text, false);
      main.setAttribute('filter', K.bloom);
      const tOut = t + hold;
      K.span(g, t, tOut + F(4));
      gsap.set([g], { svgOrigin: `${x} ${y}` });
      gsap.set(beam, { transformOrigin: '50% 50%' });
      tl.fromTo(g, { scale: 1.45, filter: 'blur(10px)' }, { scale: 1, filter: 'blur(0px)', duration: F(5), ease: 'expo.out', immediateRender: false }, t);
      tl.fromTo(red, { x: -16, y: 3 }, { x: -2, y: 0, duration: F(6), ease: 'expo.out', immediateRender: false }, t);
      tl.fromTo(cyan, { x: 16, y: -3 }, { x: 2, y: 0, duration: F(6), ease: 'expo.out', immediateRender: false }, t);
      tl.fromTo(beam, { scaleX: 0.1, opacity: 0 }, { scaleX: 1, opacity: 0.9, duration: F(5), ease: 'power1.in', immediateRender: false }, t);
      tl.to(beam, { opacity: 0.55, duration: F(8), ease: 'power2.out' }, t + F(5));
      tl.fromTo([red, cyan, main], { opacity: 0 }, { opacity: 1, duration: F(3), ease: 'power1.in', immediateRender: false }, t);
      tl.fromTo(g, { y: 0, scale: 1 }, { y: -0.08 * size, scale: 0.8, duration: hold - F(5), ease: 'none', immediateRender: false }, t + F(5));
      tl.to(g, { opacity: 0, filter: 'blur(12px)', duration: F(4), ease: 'power2.in' }, tOut);
      K.envTo({ speed: 1, speedDir: 1 }, { speed: 0.15 }, t, hold, 'power2.out');
      K.ringPulse(t, 140, F(16));
      if (o.arcs) K.envTo({ arcs: o.arcs[0] }, { arcs: o.arcs[1] }, t, hold, 'power2.out');
      if (o.sfx !== false) { X.sfx(t - 0.12, 'whoosh', { dur: 0.3, gain: 0.35 }); X.sfx(t, 'impact', { dur: 1.1, gain: 0.55, pitch: 0.85 }); X.sfx(t + 0.02, 'glitch', { dur: 0.22, gain: 0.25 }); }
      return { g, t1: tOut + F(4) };
    };

    // ------------------------------------------------------------------ T3 gradient-pill line
    /** words: [{t:'Less', pill:true}, {t:'chasing.'}]. o: y, size, hold, out ('blur'|'cut'), parent. */
    K.pill = (words, t, o = {}) => {
      const y = o.y ?? 540, size = o.size ?? 92, hold = o.hold ?? 1.0, font = o.font || 'Inter', weight = o.weight || 700;
      const padX = size * 0.42, ph = size * 1.42, gap = size * 0.3;
      const ws = words.map((w) => measure(w.t, size, font, weight, -size * 0.01));
      const widths = words.map((w, i) => ws[i] + (w.pill ? padX * 2 : 0));
      const total = widths.reduce((a, b) => a + b, 0) + gap * (words.length - 1);
      let x = (o.x ?? 960) - total / 2;
      const g = X.svg('g', {}, o.parent || K.type), gi = X.svg('g', {}, g);
      const tOut = t + F(8) * (words.length - 1) + F(6) + hold;
      K.span(g, t, tOut + F(4));
      if (o.hits !== false) K.bounce(gi, K.hits(t + F(8) * words.length, tOut, o.hits), { origin: `960 ${y}`, amt: o.bounce ?? 0.04 });
      words.forEach((w, i) => {
        const wg = X.svg('g', {}, gi);
        if (w.pill) {
          const r = X.svg('rect', { x, y: y - ph / 2, width: widths[i], height: ph, rx: ph * 0.26, fill: 'url(#lpPill)', filter: K.bloom }, wg);
          X.svg('text', { x: x + padX, y: y + size * 0.36, 'font-family': font, 'font-size': size, 'font-weight': weight, 'letter-spacing': -size * 0.01, fill: P.pillInk, text: w.t }, wg);
          gsap.set(r, { transformOrigin: '50% 50%' });
          tl.fromTo(r, { scaleX: 0.35, opacity: 0 }, { scaleX: 1, opacity: 1, duration: F(6), ease: 'back.out(1.8)', immediateRender: false }, t + F(8) * i);
        } else {
          X.svg('text', { x, y: y + size * 0.36, 'font-family': font, 'font-size': size, 'font-weight': weight, 'letter-spacing': -size * 0.01, fill: w.fill || P.text, text: w.t }, wg);
        }
        tl.fromTo(wg, { x: i ? 46 : 0, opacity: 0 }, { x: 0, opacity: 1, duration: F(i ? 6 : 3), ease: 'power3.out', immediateRender: false }, t + F(8) * i);
        X.sfx(t + F(8) * i, i === 0 && w.pill ? 'pop' : 'swoosh', { dur: 0.22, gain: 0.25, pitch: 1 + i * 0.1 });
        x += widths[i] + gap;
      });
      gsap.set(g, { svgOrigin: `960 ${y}` });
      tl.fromTo(g, { y: 0, scale: 1 }, { y: -34, scale: 0.9, duration: tOut - t, ease: 'none', immediateRender: false }, t);
      if (o.out !== 'cut') tl.to(g, { opacity: 0, filter: 'blur(12px)', duration: F(3), ease: 'power2.in' }, tOut);
      return { g, t1: tOut + F(4) };
    };

    // ------------------------------------------------------------------ T9 HUD bracket headline
    /** o: y, size, hold (legible s), label (small decoded line above), parent. Returns {g, cs, tOut, t1}. */
    K.hud = (text, t, o = {}) => {
      const y = o.y ?? 530, size = o.size ?? 128, hold = o.hold ?? 1.1, onField = o.on === 'field';
      const C = onField ? { face: '#fff7ee', acc: P.pillInk, ext: '#7a2408', br: '#fff1df', lab: P.pillInk, tint: P.pillInk }
        : { face: P.cream, acc: P.gold, ext: P.deep, br: P.flame, lab: P.flame, tint: P.flame };
      const g = X.svg('g', {}, o.parent || K.type), gi = X.svg('g', {}, g);
      const cs = K.chars(gi, text.toUpperCase(), { x: 960, y: y + size * 0.35, size, font: 'Barlow Condensed', weight: 700, track: size * 0.02, fill: C.face, accent: C.acc, extrude: { n: 4, dy: size * 0.022, fill: C.ext } });
      cs.g.setAttribute('filter', K.shadowF);
      const n = cs.chars.length;
      const tFull = t + F(6 + n + 4), tOut = Math.max(t + F(22), tFull) + hold, t1 = tOut + F(o.exit === 'none' ? 34 : 8);
      K.span(g, t, t1);
      const hw1 = cs.width / 2 + size * 0.5, hh1 = size * 0.6 + 22, leg = Math.min(100, hh1 * 0.75);
      const br = { hw: 150, hh: hh1 * 0.72, a: 0 };
      const paths = [0, 1, 2, 3].map(() => X.svg('path', { fill: 'none', stroke: C.br, 'stroke-width': 5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', filter: onField ? 'none' : K.bloom }, gi));
      K.bounce(gi, K.hits(tFull, tOut, o.hits), { origin: `960 ${y}`, amt: o.bounce ?? 0.035 });
      X.every((T) => {
        if (T < t || T > t1) return;
        const { hw, hh } = br, L = Math.min(leg, hw * 0.6), cx = 960;
        const d = [[-1, -1], [1, -1], [1, 1], [-1, 1]];
        paths.forEach((p, k) => {
          const [sx, sy] = d[k], x = cx + sx * hw, yy = y + sy * hh;
          const rd = Math.min(14, L * 0.4);
          p.setAttribute('d', `M${x},${yy - sy * L}L${x},${yy - sy * rd}Q${x},${yy} ${x - sx * rd},${yy}L${x - sx * L},${yy}`);
          p.setAttribute('opacity', br.a);
        });
      });
      tl.fromTo(br, { hw: 150, hh: hh1 * 0.72, a: 0 }, { hw: hw1, hh: hh1, a: 1, duration: F(22), ease: 'back.out(1.4)', immediateRender: false }, t);
      tl.fromTo(br, { hh: hh1 }, { hh: hh1 * 1.15, duration: F(8), ease: 'sine.inOut', yoyo: true, repeat: 1, immediateRender: false }, tFull);
      tl.fromTo(br, { hw: hw1, hh: hh1, a: 1 }, { hw: 34, hh: 34, a: 0, duration: F(8), ease: 'power3.in', immediateRender: false }, tOut);
      K.scramble(cs, t + F(6), { seed: o.seed || 3, color: C.tint });
      if (o.exit !== 'none') K.collapse(cs, tOut);   // exit:'none' → hand the letters to K.ribbon / your own move
      if (o.label) {
        const lab = K.chars(gi, o.label, { x: 960, y: y - hh1 - 34, size: 26, font: 'Inter', weight: 700, track: 7, fill: C.lab });
        K.decode(lab, t + F(10), { sfx: false, color: C.tint });
        tl.to(lab.g, { opacity: 0, duration: F(4) }, tOut);
      }
      gsap.set(g, { svgOrigin: `960 ${y}` });
      tl.fromTo(g, { scale: 1.04, y: 10 }, { scale: 0.9, y: -14, duration: tOut - t, ease: 'none', immediateRender: false }, t);
      X.sfx(t, 'blip_up', { dur: 0.18, gain: 0.25 });
      X.sfx(tOut, 'swoosh', { dur: 0.25, gain: 0.25 });
      return { g, cs, tOut, t1 };
    };

    // ------------------------------------------------------------------ T16 letters → sine ribbons → one line
    /** letters drop onto 3 sine ribbons (15 f) that flatten into a single glowing line (10 f). Returns {line, x1, x2, y, tLine}. */
    K.ribbon = (cs, t, o = {}) => {
      const y = o.y ?? 540, x1 = o.x1 ?? 260, x2 = o.x2 ?? 1660, A0 = o.amp ?? 70, t1 = o.until ?? t + 3;
      const g = X.svg('g', {}, o.parent || K.type);
      K.span(g, t, t1);
      const st2 = { A: A0, w: 0, a: 1 };
      const rib = [0, 1, 2].map((k) => X.svg('path', { fill: 'none', stroke: k === 1 ? P.cream : P.flame, 'stroke-width': k === 1 ? 3 : 2.5, opacity: 0.9, filter: K.bloom }, g));
      X.every((T) => {
        if (T < t || T > t1) return;
        rib.forEach((p, k) => {
          let d = '';
          for (let i = 0; i <= 60; i++) {
            const u = i / 60, x = x1 + (x2 - x1) * u;
            const env2 = Math.sin(Math.PI * u) ** 0.6;
            const yy = y + st2.A * env2 * Math.sin(u * 9 + T * 7 + k * 2.1);
            d += (i ? 'L' : 'M') + x.toFixed(1) + ',' + yy.toFixed(1);
          }
          p.setAttribute('d', d); p.setAttribute('opacity', st2.a * (k === 1 ? 1 : 0.8));
        });
      });
      gsap.set(g, { opacity: 0 });
      tl.fromTo(g, { opacity: 0 }, { opacity: 1, duration: F(6), immediateRender: false }, t);
      tl.fromTo(st2, { A: A0 }, { A: 0, duration: F(10), ease: 'sine.inOut', immediateRender: false }, t + F(15));
      // letters fall onto the ribbon and dissolve into it
      cs.chars.forEach((c, i) => {
        const u = (c.cx - x1) / (x2 - x1);
        gsap.set(c.g, { transformOrigin: '50% 50%' });
        tl.fromTo(c.g, { y: cs.y, opacity: 1, scale: 1 }, { y: y + A0 * 0.6 * Math.sin(u * 9 + i), opacity: 0, scale: 0.35, duration: F(14), ease: 'sine.inOut', immediateRender: false }, t + F(i * 0.5));
      });
      X.sfx(t, 'swoosh', { dur: 0.5, gain: 0.3 });
      return { g, rib, st: st2, tLine: t + F(25), x1, x2, y };
    };

    // ------------------------------------------------------------------ transitions
    /** T11 zoom-through: disc at (x,y) grows ×N to cover the frame (8 f expo.in), flat colour 4 f, then an iris opens
     *  from the frame centre (8 f expo.out) with an overshooting rim. Swap scenes: hide old at tCover, show new at tOpen. */
    K.zoomThrough = (t, o = {}) => {
      const x = o.x ?? 960, y = o.y ?? 540, color = o.color || P.fieldC, r0 = o.r0 ?? 24;
      const g = X.svg('g', {}, K.fx);
      const tCover = t + F(o.inF ?? 10), tOpen = tCover + F(o.holdF ?? 4), tEnd = o.open === false ? tCover + F(1) : tOpen + F(o.outF ?? 12);
      K.span(g, t, tEnd);
      const rMax = Math.max(...[[0, 0], [W, 0], [0, H], [W, H]].map(([cx, cy]) => Math.hypot(cx - x, cy - y))) + 30;
      // disc area grows ~quadratically (power1.in on r): <= 25 % of the frame per frame, so QA never reads a hard cut
      const disc = X.svg('circle', { cx: x, cy: y, r: r0, fill: color, stroke: P.gold, 'stroke-width': 10, filter: K.bloomGold }, g);
      tl.fromTo(disc, { attr: { r: r0 } }, { attr: { r: rMax }, duration: tCover - t, ease: 'power1.in', immediateRender: false }, t);
      if (o.open === false) { if (o.sfx !== false) X.sfx(t - 0.1, 'zoom_in', { dur: 0.42, gain: 0.4 }); return { g, tCover, tOpen: null, tEnd }; }
      tl.set(disc, { opacity: 0 }, tCover);
      const ring = X.svg('circle', { cx: 960, cy: 540, r: 650, fill: 'none', stroke: color, 'stroke-width': 1300, opacity: 0 }, g);
      const rim = X.svg('circle', { cx: 960, cy: 540, r: 0, fill: 'none', stroke: P.cream, 'stroke-width': 6, opacity: 0, filter: K.bloomGold }, g);
      tl.set(ring, { opacity: 1 }, tCover);
      const ir = { R: 0 };
      tl.fromTo(ir, { R: 0 }, { R: 1250, duration: tEnd - tOpen, ease: 'power2.out', immediateRender: false, onUpdate: () => { ring.setAttribute('r', (ir.R + 1300) / 2); ring.setAttribute('stroke-width', Math.max(0, 1300 - ir.R)); rim.setAttribute('r', ir.R); rim.setAttribute('opacity', ir.R > 2 ? Math.max(0, 1 - ir.R / 1250) : 0); } }, tOpen);
      K.envTo({ speed: 1, speedDir: 1 }, { speed: 0 }, tOpen, 0.8, 'power2.out');
      if (o.sfx !== false) { X.sfx(t - 0.1, 'zoom_in', { dur: 0.38, gain: 0.4 }); X.sfx(tOpen, 'whoosh', { dur: 0.35, gain: 0.32 }); }
      return { g, tCover, tOpen, tEnd };
    };
    /** T5 white diagonal light sweep across the frame in `dur` frames; returns the swap time (band at centre). */
    K.sweep = (t, o = {}) => {
      const dur = F(o.frames ?? 6);
      const g = X.svg('g', {}, K.fx);
      K.span(g, t, t + dur + F(6));
      const band = X.svg('rect', { x: -700, y: -900, width: 1400, height: 2900, fill: 'url(#lpSweep)', style: { mixBlendMode: 'screen' } }, g);
      const wash = X.svg('rect', { x: 0, y: 0, width: W, height: H, fill: P.cream, opacity: 0 }, g);
      gsap.set(band, { rotation: 20, svgOrigin: '0 540' });
      tl.fromTo(band, { x: -900 }, { x: 2900, duration: dur, ease: 'power2.in', immediateRender: false }, t);
      tl.fromTo(wash, { opacity: 0 }, { opacity: 0.12, duration: dur * 0.6, ease: 'power2.in', immediateRender: false }, t);
      tl.to(wash, { opacity: 0, duration: F(7), ease: 'power2.out' }, t + dur * 0.6);
      if (o.sfx !== false) X.sfx(t - 0.05, 'swoosh', { dur: 0.3, gain: 0.35, pitch: 1.3 });
      return t + dur * 0.55;
    };
    K.flash = (t, o = {}) => {
      const r = X.svg('rect', { x: 0, y: 0, width: W, height: H, fill: o.color || P.cream, opacity: 0 }, K.fx);
      K.span(r, t, t + F((o.inF ?? 2) + (o.outF ?? 10)) + 0.02);
      tl.fromTo(r, { opacity: 0 }, { opacity: o.peak ?? 0.85, duration: F(o.inF ?? 2), ease: 'power2.in', immediateRender: false }, t);
      tl.to(r, { opacity: 0, duration: F(o.outF ?? 10), ease: 'power2.out' }, t + F(o.inF ?? 2));
      return r;
    };
    K.shock = (t, x = 960, y = 540, o = {}) => {
      const c = X.svg('circle', { cx: x, cy: y, r: 10, fill: 'none', stroke: o.color || P.gold, 'stroke-width': o.width ?? 10, filter: K.bloomGold }, o.parent || K.fx);
      const dur = F(o.frames ?? 18);
      K.span(c, t, t + dur);
      tl.fromTo(c, { attr: { r: o.r0 ?? 10, 'stroke-width': o.width ?? 10 }, opacity: 1 }, { attr: { r: o.r1 ?? 1300, 'stroke-width': 1 }, opacity: 0, duration: dur, ease: 'expo.out', immediateRender: false }, t);
      return c;
    };
    /** T4 3D UI tilt-in: enters at rotationY −30°, rotationX 15°, +20 % y, 115 % scale and settles in 12 f. */
    K.tiltIn = (el, t, o = {}) => {
      const from = Object.assign({ rotationY: -30, rotationX: 15, yPercent: 20, scale: 1.15, opacity: 0 }, o.from || {});
      const to = Object.assign({ rotationY: 0, rotationX: 0, yPercent: 0, scale: 1, opacity: 1 }, o.to || {});
      gsap.set(el, from);
      tl.fromTo(el, from, { ...to, duration: F(o.frames ?? 12), ease: o.ease || 'power3.out', immediateRender: false }, t);
      if (o.sfx !== false) X.sfx(t - 0.04, 'swoosh', { dur: 0.32, gain: 0.3 });
      return t + F(o.frames ?? 12);
    };
    /** T6 pull-back to isolate: scale → 0.55, slide down, fade (12 f power3.inOut). */
    K.pullBack = (el, t, o = {}) => {
      tl.to(el, { scale: o.scale ?? 0.55, y: o.y ?? 260, opacity: o.opacity ?? 0, duration: F(o.frames ?? 12), ease: 'power3.inOut' }, t);
      if (o.sfx !== false) X.sfx(t, 'woosh_low', { dur: 0.4, gain: 0.35 });
    };

    /** Full-frame ember colour field (type-card ground) in the back layer, visible [t0, t1). Returns {g, rect, hi}.
     *  Leave it with a fade (tl.to(f.g,{opacity:0})) or a collapse (tl.to(f.g,{scaleY:0}) about originY). */
    K.field = (t0, t1, o = {}) => {
      const g = X.svg('g', {}, K.fieldLayer);
      K.span(g, t0, t1);
      X.svg('rect', { x: -20, y: -20, width: W + 40, height: H + 40, fill: o.color || P.fieldC }, g);
      // living ground: expanding darker rings, a drifting hot spot and floating ring-dots (no frame is ever still)
      const rings = Array.from({ length: 12 }, () => X.svg('circle', { cx: 960, cy: 540, r: 10, fill: 'none', stroke: '#a8330a', 'stroke-width': 34, opacity: 0.26 }, g));
      const hi = X.svg('ellipse', { cx: 960, cy: 500, rx: 900, ry: 560, fill: 'url(#lpFieldHi)' }, g);
      const rr2 = X.rand(o.seed || 17);
      const lns = o.lines === false ? [] : Array.from({ length: 56 }, () => ({ el: X.svg('line', { stroke: '#fff1df', 'stroke-width': 1.5 + rr2() * 2.5, 'stroke-linecap': 'round' }, g), a: rr2() * Math.PI * 2, ph: rr2(), len: 70 + rr2() * 200 }));
      const dots = Array.from({ length: 7 }, () => ({ el: X.svg('circle', { r: 7 + rr2() * 7, fill: 'none', stroke: '#fff1df', 'stroke-width': 3, opacity: 0.7 }, g), x: rr2() * W, y: rr2() * H, v: 20 + rr2() * 40, ph: rr2() * 6 }));
      X.every((T) => {
        if (T < t0 || (t1 != null && T > t1)) return;
        const u = T - t0, pm = K.pumpAt(T);
        hi.setAttribute('opacity', Math.min(1, 0.62 + 0.38 * pm).toFixed(3));
        rings.forEach((c, k) => { const r = ((u * 190 + k * 95) % 1140); c.setAttribute('r', r.toFixed(1)); c.setAttribute('opacity', (0.28 * (1 + 0.6 * pm) * (1 - r / 1140)).toFixed(3)); });
        hi.setAttribute('cx', (960 + 260 * Math.sin(u * 1.5)).toFixed(1)); hi.setAttribute('cy', (500 + 110 * Math.sin(u * 2.3)).toFixed(1));
        lns.forEach((l) => {
          const q = (u * 0.9 + l.ph) % 1, r0 = 160 + q * q * 1150, r1 = r0 + l.len * (0.4 + q), c = Math.cos(l.a), sn = Math.sin(l.a);
          l.el.setAttribute('x1', (960 + c * r0).toFixed(1)); l.el.setAttribute('y1', (540 + sn * r0).toFixed(1));
          l.el.setAttribute('x2', (960 + c * r1).toFixed(1)); l.el.setAttribute('y2', (540 + sn * r1).toFixed(1));
          l.el.setAttribute('opacity', (0.42 * Math.sin(Math.PI * q)).toFixed(3));
        });
        dots.forEach((d) => { d.el.setAttribute('cx', ((d.x + u * d.v) % W).toFixed(1)); d.el.setAttribute('cy', (d.y + 30 * Math.sin(u * 1.7 + d.ph)).toFixed(1)); });
      });
      gsap.set(g, { svgOrigin: `960 ${o.originY ?? 540}` });
      return { g, hi };
    };
    /** camera hop on a UI element: one beat-locked move (12 f power3.inOut) - chain them every 2 beats. */
    K.hop = (el, t, to, frames = 12, ease = 'power3.inOut') => tl.to(el, { ...to, duration: F(frames), ease }, t);

    // ------------------------------------------------------------------ hero token: the ember orb
    K.orb = (parent, o = {}) => {
      const r = o.r ?? 40;
      const g = X.svg('g', {}, parent || K.cam);
      gsap.set(g, { x: o.x ?? 960, y: o.y ?? 540 });
      const inner = X.svg('g', {}, g);
      const glow = X.svg('circle', { cx: 0, cy: 0, r: r * 2.4, fill: P.ember, opacity: 0.5, filter: K.blur(r * 0.6) }, inner);
      const halo = X.svg('circle', { cx: 0, cy: 0, r: r * 1.55, fill: 'none', stroke: P.gold, 'stroke-width': 2, opacity: 0.45 }, inner);
      const core = X.svg('circle', { cx: 0, cy: 0, r, fill: 'url(#lpOrb)' }, inner);
      const spec = X.svg('ellipse', { cx: -r * 0.34, cy: -r * 0.4, rx: r * 0.3, ry: r * 0.18, fill: '#fff', opacity: 0.75, filter: K.blur(Math.max(1, r * 0.05)) }, inner);
      X.every((T) => {   // idle life: breathing halo + core
        const s = 1 + 0.035 * Math.sin(T * Math.PI * 2 / (o.period ?? 1.7));
        inner.setAttribute('transform', `scale(${s.toFixed(4)})`);
        halo.setAttribute('r', (r * (1.5 + 0.12 * Math.sin(T * 3.1))).toFixed(1));
      });
      return { g, inner, core, glow, halo, spec, r };
    };
    K.orbDiv = (size, parent, style = {}) => X.html('div', { class: 'lp-orb', style: { width: size + 'px', height: size + 'px', ...style } }, parent);

    // ------------------------------------------------------------------ glossy cursor
    K.cursor = (parent) => {
      const g = X.svg('g', {}, parent || K.fx);
      const s = X.svg('g', {}, g);
      if (!document.getElementById('lpCur')) X.linear('lpCur', [[0, '#ffffff'], [1, '#ffd2b5']]);
      X.svg('path', { d: 'M0,0 L0,96 L24,74 L40,112 L58,104 L42,67 L74,64 Z', fill: '#000', opacity: 0.45, transform: 'translate(8,12)', filter: K.blur(6) }, s);
      X.svg('path', { d: 'M0,0 L0,96 L24,74 L40,112 L58,104 L42,67 L74,64 Z', fill: 'url(#lpCur)', stroke: P.ember, 'stroke-width': 4, 'stroke-linejoin': 'round' }, s);
      X.svg('path', { d: 'M8,18 L8,62 L22,50 Z', fill: '#fff', opacity: 0.8 }, s);
      gsap.set(s, { transformOrigin: '0% 0%' });
      return { g, s };
    };
    /** curved travel: x on power2.inOut, y on sine.inOut (different curves = an arc). */
    K.cursorTo = (c, x, y, t, dur = F(12)) => {
      tl.to(c.g, { x, duration: dur, ease: 'power2.inOut' }, t);
      tl.to(c.g, { y, duration: dur, ease: 'sine.inOut' }, t);
    };
    K.click = (c, t, x, y) => {
      tl.fromTo(c.s, { scale: 1 }, { scale: 0.84, duration: F(2), yoyo: true, repeat: 1, ease: 'power2.out', immediateRender: false }, t);
      const rp = X.svg('circle', { cx: x, cy: y, r: 6, fill: 'none', stroke: P.gold, 'stroke-width': 4 }, K.fx);
      K.span(rp, t, t + F(14));
      tl.fromTo(rp, { attr: { r: 6 }, opacity: 1 }, { attr: { r: 70 }, opacity: 0, duration: F(14), ease: 'expo.out', immediateRender: false }, t);
      X.sfx(t, 'click', { gain: 0.5 });
    };

    // ------------------------------------------------------------------ dark glass UI kit (HTML in K.world)
    const ICON = {
      mail: 'M3 6h18v12H3z M3 7l9 6 9-6', chat: 'M4 5h16v10H9l-5 4z', cal: 'M4 6h16v14H4z M4 10h16 M8 3v5 M16 3v5',
      doc: 'M6 3h8l4 4v14H6z M14 3v4h4 M9 12h6 M9 16h6', bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4z M10 20a2 2 0 0 0 4 0',
      check: 'M5 12l5 5 9-10', bolt: 'M13 2L4 14h7l-1 8 9-12h-7z', task: 'M4 5h16v14H4z M8 10l2 2 4-4 M8 15h8',
      search: 'M11 4a7 7 0 1 1 0 14a7 7 0 1 1 0-14z M16 16l5 5', user: 'M12 12a4 4 0 1 0 0-8a4 4 0 0 0 0 8z M4 21a8 8 0 0 1 16 0',
      flag: 'M5 21V4h11l-2 4 2 4H5', arrow: 'M5 12h14 M13 6l6 6-6 6', inbox: 'M3 13l3-8h12l3 8v6H3z M3 13h5l1 2h6l1-2h5',
      clock: 'M12 3a9 9 0 1 1 0 18a9 9 0 1 1 0-18z M12 7v5l3 2', layers: 'M12 3l9 5-9 5-9-5z M3 13l9 5 9-5',
      spark: 'M12 2l2.2 7.8L22 12l-7.8 2.2L12 22l-2.2-7.8L2 12l7.8-2.2z',
    };
    K.ICON = ICON;
    K.icon = (name, size = 24, color = P.mute, sw = 2) => name === 'spark'
      ? `<svg width="${size}" height="${size}" viewBox="0 0 24 24"><path d="${ICON.spark}" fill="${color}"/></svg>`
      : `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"><path d="${ICON[name]}"/></svg>`;
    /** dark glass window: {x, y (top-left), w, h, title, parent, search} → {el, head, body} */
    K.panel = (o = {}) => {
      const el = X.html('div', { class: 'lp-panel', style: { left: o.x + 'px', top: o.y + 'px', width: o.w + 'px', height: o.h + 'px' } }, o.parent || K.world);
      const head = X.html('div', { class: 'lp-head' }, el);
      for (let i = 0; i < 3; i++) X.html('div', { class: 'lp-dot' }, head);
      X.html('div', { html: `<span style="margin-left:12px;color:${P.text}">${o.title || ''}</span>` }, head);
      if (o.search !== false) X.html('div', { class: 'lp-search', html: K.icon('search', 18, P.dim) + `<span>${o.search || 'Search everything'}</span>` }, head);
      const body = X.html('div', { style: { position: 'absolute', left: 0, right: 0, top: '70px', bottom: 0 } }, el);
      return { el, head, body };
    };
    const AVA = ['#ffb547', '#ff8a4c', '#ffd08a', '#ff6d3a', '#f2a16b', '#ffc9a0'];
    K.avatar = (initials, k = 0, parent) => X.html('div', { class: 'lp-ava', style: { background: `radial-gradient(circle at 35% 30%, #fff3e2, ${AVA[k % AVA.length]} 70%)` }, text: initials }, parent);
    const TAG = {
      urgent: { bg: P.ember, fg: P.pillInk, b: 'none' }, today: { bg: 'rgba(255,181,71,.12)', fg: P.gold, b: `1.5px solid ${P.gold}` },
      fyi: { bg: '#2a201c', fg: P.mute, b: '1px solid #3d2f29' }, done: { bg: '#1f1714', fg: '#e8c9a8', b: '1px solid #4a3328' },
      later: { bg: 'transparent', fg: P.dim, b: `1px dashed ${P.dim}` },
    };
    K.tag = (label, kind = 'fyi', parent, style = {}) => { const s = TAG[kind] || TAG.fyi; return X.html('div', { class: 'lp-tag', style: { background: s.bg, color: s.fg, border: s.b, ...style }, html: (kind === 'done' ? K.icon('check', 16, s.fg, 3) : '') + label }, parent); };
    /** notification banner {x, y, w, icon, app, title, text, time} */
    K.notif = (o = {}) => {
      const el = X.html('div', { class: 'lp-notif', style: { left: o.x + 'px', top: o.y + 'px', width: (o.w || 620) + 'px', height: (o.h || 104) + 'px' } }, o.parent || K.world);
      X.html('div', { class: 'lp-tile', style: { width: '56px', height: '56px', borderRadius: '16px', background: 'linear-gradient(160deg,#3a2219,#1c120e)' }, html: K.icon(o.icon || 'chat', 30, P.flame, 2.2) }, el);
      X.html('div', { style: { flex: '1', minWidth: 0 }, html: `<div style="display:flex;gap:10px;align-items:baseline"><span style="font-size:17px;font-weight:700;letter-spacing:.06em;color:${P.flame}">${(o.app || '').toUpperCase()}</span><span style="font-size:16px;color:${P.dim}">${o.time || 'now'}</span></div><div style="font-size:23px;font-weight:650;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${o.title || ''}</div>` }, el);
      return el;
    };

    // ------------------------------------------------------------------ props (SVG)
    /** file icon centred at (0,0) of its group: {x, y, s (height), label} → {g} (move/scale g with GSAP) */
    K.fileIcon = (parent, o = {}) => {
      const g = X.svg('g', {}, parent || K.cam);
      gsap.set(g, { x: o.x ?? 960, y: o.y ?? 540, scale: o.scale ?? 1 });
      const s = 100, w = 78;
      X.svg('path', { d: `M${-w / 2},${-s / 2}h${w * 0.62}l${w * 0.38},${w * 0.38}V${s / 2}H${-w / 2}z`, fill: 'url(#lpDoc)', stroke: P.flame, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
      X.svg('path', { d: `M${w * 0.12},${-s / 2}v${w * 0.38}h${w * 0.38}`, fill: 'none', stroke: P.flame, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g);
      X.svg('rect', { x: -w / 2 + 12, y: -6, width: w * 0.56, height: 7, rx: 3.5, fill: P.flame, opacity: 0.85 }, g);
      X.svg('rect', { x: -w / 2 + 12, y: 10, width: w * 0.7, height: 5, rx: 2.5, fill: P.dim }, g);
      X.svg('rect', { x: -w / 2 + 12, y: 22, width: w * 0.45, height: 5, rx: 2.5, fill: P.dim }, g);
      const label = o.label ? X.svg('text', { x: 0, y: s / 2 + 30, 'text-anchor': 'middle', 'font-family': 'Inter', 'font-weight': 600, 'font-size': 19, fill: P.mute, text: o.label }, g) : null;
      return { g, label };
    };
    /** logo mark: rounded tile + three "sorted" bars + orb dot. {x, y, s} → {g, tile, bars, dot} */
    K.mark = (parent, o = {}) => {
      const s = o.s ?? 200;
      const g = X.svg('g', {}, parent || K.type);
      gsap.set(g, { x: o.x ?? 960, y: o.y ?? 540 });
      const glow = X.svg('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.27, fill: P.ember, opacity: 0.35, filter: K.blur(s * 0.12) }, g);
      const tile = X.svg('rect', { x: -s / 2, y: -s / 2, width: s, height: s, rx: s * 0.27, fill: 'url(#lpTile)', stroke: P.flame, 'stroke-width': s * 0.022 }, g);
      const bh = s * 0.12, bx = -s * 0.3, ys = [-s * 0.2, 0, s * 0.2], wsB = [s * 0.6, s * 0.42, s * 0.24];
      const bars = ys.map((y, i) => X.svg('rect', { x: bx, y: y - bh / 2, width: wsB[i], height: bh, rx: bh / 2, fill: 'url(#lpBar)' }, g));
      const dot = X.svg('circle', { cx: bx + wsB[2] + s * 0.13, cy: ys[2], r: s * 0.07, fill: 'url(#lpOrb)' }, g);
      [glow, tile, ...bars, dot].forEach((e) => gsap.set(e, { transformOrigin: '50% 50%' }));
      return { g, tile, glow, bars, dot, s };
    };
    /** chaos → sorted: tile pops (6 f back.out), bars fly in scattered and snap on 1/4 beats, dot pops. */
    K.markBuild = (m, t, o = {}) => {
      const r = X.rand(o.seed || 5), q = K.B / 4;
      tl.fromTo([m.tile, m.glow], { scale: 0 }, { scale: 1, duration: F(7), ease: 'back.out(1.7)', immediateRender: false }, t);
      m.bars.forEach((b, i) => {
        const land = t + q * (2 + i);
        tl.fromTo(b, { x: (r() - 0.5) * 520, y: (r() - 0.5) * 360, rotation: (r() - 0.5) * 200, scale: 0.5, opacity: 0 }, { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: F(8), ease: 'expo.out', immediateRender: false }, land - F(8));
        X.sfx(land, 'tick', { gain: 0.45, pitch: 1 + i * 0.15 });
      });
      tl.fromTo(m.dot, { scale: 0 }, { scale: 1, duration: F(6), ease: 'back.out(3)', immediateRender: false }, t + q * 5);
      if (o.sfx !== false) X.sfx(t, 'pop', { gain: 0.4, pitch: 0.8 });
      return t + q * 5 + F(6);
    };
    /** wordmark with the hero orb as its 'o': {x (left), y (baseline), size, text, orbIndex} → {cs, orb, width} */
    K.wordmark = (parent, o = {}) => {
      const size = o.size ?? 200, text = o.text || 'sorta', oi = o.orbIndex ?? text.indexOf('o');
      const cs = K.chars(parent || K.type, text, { x: o.x ?? 960, y: o.y ?? 540, anchor: o.anchor || 'start', size, font: 'Space Grotesk', weight: 700, track: -size * 0.03, fill: P.text });
      let orb = null;
      if (oi >= 0) {
        const c = cs.chars[oi];
        c.fill = 'rgba(0,0,0,0)';
        orb = K.orb(cs.g, { x: c.cx, y: (o.y ?? 540) - size * 0.255, r: size * 0.215, period: 1.4 });
        gsap.set(orb.g, { scale: 0, transformOrigin: '50% 50%' });
      }
      return { cs, orb, width: cs.width };
    };

    // ------------------------------------------------------------------ confetti / spark burst
    K.burst = (parent, x, y, t, o = {}) => {
      const n = o.n ?? 60, r = X.rand(o.seed || 9), dur = o.dur ?? 1.4;
      const g = X.svg('g', {}, parent || K.fx);
      K.span(g, t, t + dur);
      const cols = o.colors || [P.ember, P.gold, P.cream, P.flame];
      const ps = Array.from({ length: n }, (_, i) => {
        const a = r() * Math.PI * 2, v = 500 + r() * 900;
        const el = X.svg('rect', { x: -6, y: -3, width: 8 + r() * 10, height: 4 + r() * 5, rx: 1.5, fill: cols[i % cols.length] }, g);
        return { el, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 300, spin: (r() - 0.5) * 900 };
      });
      X.every((T) => {
        if (T < t || T > t + dur) return;
        const u = T - t, drag = (1 - Math.exp(-2.2 * u)) / 2.2;
        for (const p of ps) {
          const px = x + p.vx * drag, py = y + p.vy * drag + 420 * u * u;
          p.el.setAttribute('transform', `translate(${px.toFixed(1)},${py.toFixed(1)}) rotate(${(p.spin * u).toFixed(0)})`);
          p.el.setAttribute('opacity', Math.max(0, 1 - u / dur).toFixed(3));
        }
      });
      return g;
    };

    return K;
  };
})();
