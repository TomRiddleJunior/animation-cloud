/* explainer-saas-ui — reusable vector UI kit for voice-over-led SaaS / AI product walkthroughs.
 *
 * Load AFTER /engine/lib/explainer.js:   <script src="kit.js"></script>   then your scene.js.
 * Everything is DOM (HTML + inline SVG) inside #stage. Motion is either GSAP tweens on X.tl or a pure function of t
 * registered with X.every (camera, cursor, orbit, blobs, matte) — never wall-clock, never Math.random.
 *
 *  Skins     K.skin('glow'|'calm'|'dark', overrides) · K.skinAt(t, name) (act-boundary inversion) · K.css('accent')
 *  Layers    K.background() · K.layer(name, t0, t1, {z}) · K.world(parent) · K.camera(world) · K.plane(parent, box)
 *  UI        K.win · K.sidebar · K.row · K.chip · K.btn · K.toggle · K.bubble · K.dots · K.card · K.glass · K.toast
 *            K.avatar · K.avatarStack · K.glyph · K.icon · K.appIcon · K.markSVG · K.wordmark · K.greek
 *            K.areaChart · K.bars · K.ring · K.badge
 *  Cursor    K.cursor({style}) → .start .show .hide .move .click .clickOn  (bezier glide, hover, squash + ripple, sfx)
 *  Type      K.kinetic (word-by-word rise, line re-centres, key word 1.6× accent) · K.typeLine (typewriter + caret)
 *            K.decode (random-letter decode, A3) · K.headline (typed feature heading on a glass chip + sub-label)
 *  Moves     T2 K.cascade · T3 K.swap · T4 camera.key/focus · T5 K.iris · T6 K.logoMatte · T7 K.blobWipe
 *            T8 K.morphCard · T10 K.flip · T11 K.unfold · T12 K.orbit · T13 K.burst · T14 K.stackDrop · T16 K.glint
 *  Helpers   K.at(lineId, word, nth, offset) · K.rect(el) (world rect, transforms ignored) · K.F (1 frame)
 *
 * SFX are declared automatically on UI events (click, pop, notif, swoosh, type, sparkle, drop…); pass {sfx:false}
 * to silence one. Saturated colour is budgeted: accent only on logo, CTA, key word, progress strokes, under-glow.
 */
(function () {
  const K = (window.K = {});
  const W = 1920, H = 1080, F = 1 / 30;
  K.F = F; K.W = W; K.H = H;
  let UID = 0;
  const uid = (p = 'k') => p + (++UID);
  const lerp = (a, b, t) => a + (b - a) * t;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  K.lerp = lerp; K.clamp = clamp;
  const E = (name) => gsap.parseEase(name);
  const NS = 'http://www.w3.org/2000/svg';

  // ------------------------------------------------------------------------------------------------ skins
  K.SKINS = {
    // A2 "Gradient AI" light — Synoptix / Marvin family: lavender-white ground, glowing pastel blobs, one violet accent
    glow: {
      bg: '#FBFAFF', surface: '#FFFFFF', surface2: '#F6F4FD', line: '#ECE9F6', text: '#17152B', muted: '#8B87A3',
      faint: '#D3CFE3', accent: '#5B3DF5', accent2: '#8F7DFF', accentSoft: '#EEEAFF', accentText: '#FFFFFF',
      blobA: '#D9CEFF', blobB: '#D3E4FF', blobC: '#F4DAF2', wash: '#B9ABF6', wash2: '#CBC0FA', hover: '#F2EFFC', glass: 'rgba(255,255,255,.72)',
      glassLine: 'rgba(255,255,255,.9)', shadow: 'rgba(52,36,140,.10)', shadowS: 'rgba(52,36,140,.06)',
      ug1: '#8B6BFF', ug2: '#D77BF2', ug3: '#69C9FF', markL1: '#AE9FFF', markL2: '#7F67FF', markR1: '#6F51FF', markR2: '#4528E2',
      tint1: '#EEEAFF', tint2: '#E5F0FF', tint3: '#FCEBF5', tint4: '#E7F7F0', tint5: '#FFF4E3',
      ink1: '#5B3DF5', ink2: '#3B82D6', ink3: '#C2559A', ink4: '#2E9A72', ink5: '#C98522',
      fontUi: "'Inter', 'Segoe UI', sans-serif", fontHead: "'Inter', 'Segoe UI', sans-serif", fontBrand: "'Poppins', 'Inter', sans-serif",
      cursor: 'brand', blobs: true, dark: false,
    },
    // A1 "Calm Workspace" — Notion-like: near-white, flat, no blobs, OS arrow, emoji/multicolour icons, no headings
    calm: {
      bg: '#FCFCFC', surface: '#FFFFFF', surface2: '#F4F2EF', line: '#E9E9E7', text: '#2C2B2B', muted: '#A09D99',
      faint: '#D6D4D0', accent: '#2F6FDB', accent2: '#69A0EC', accentSoft: '#EAF1FC', accentText: '#FFFFFF',
      blobA: 'transparent', blobB: 'transparent', blobC: 'transparent', wash: '#E9F0F7', wash2: '#F2F5F9', hover: '#EFEEEC', glass: 'rgba(255,255,255,.92)',
      glassLine: '#E9E9E7', shadow: 'rgba(0,0,0,.10)', shadowS: 'rgba(0,0,0,.05)', desk: '#5B91AE',
      ug1: 'transparent', ug2: 'transparent', ug3: 'transparent', markL1: '#3A3A3A', markL2: '#2C2B2B', markR1: '#2C2B2B', markR2: '#111111',
      tint1: '#F4F2EF', tint2: '#EAF1FC', tint3: '#FBEDEA', tint4: '#EAF5EE', tint5: '#FBF3DB',
      ink1: '#2C2B2B', ink2: '#2F6FDB', ink3: '#D44C47', ink4: '#448361', ink5: '#CB912F',
      fontUi: "'Inter', 'Segoe UI', sans-serif", fontHead: "'Inter', 'Segoe UI', sans-serif", fontBrand: "'Inter', sans-serif",
      cursor: 'os', blobs: false, dark: false,
    },
    // A3 "Dark Glow" — Elevate-like: charcoal ground, teal + crimson corner glows, light captions
    dark: {
      bg: '#151619', surface: '#25282C', surface2: '#1D2023', line: '#34383D', text: '#F1F1F4', muted: '#9C9496',
      faint: '#4A4E54', accent: '#46AF98', accent2: '#D8216D', accentSoft: '#1E3833', accentText: '#0E1412',
      blobA: '#225751', blobB: '#5F2537', blobC: '#1E3A44', wash: '#1F4A45', wash2: '#1B2E30', hover: '#2D3136', glass: 'rgba(37,40,44,.72)',
      glassLine: 'rgba(255,255,255,.08)', shadow: 'rgba(0,0,0,.35)', shadowS: 'rgba(0,0,0,.25)',
      ug1: '#46AF98', ug2: '#7A4C8C', ug3: '#D8216D', markL1: '#6FD3BC', markL2: '#46AF98', markR1: '#E8487F', markR2: '#B0165A',
      tint1: '#1E3833', tint2: '#22303D', tint3: '#3A2030', tint4: '#1E3833', tint5: '#3A3220',
      ink1: '#46AF98', ink2: '#6FA8DC', ink3: '#D8216D', ink4: '#46AF98', ink5: '#D9A441',
      fontUi: "'Inter', 'Segoe UI', sans-serif", fontHead: "'Inter', 'Segoe UI', sans-serif", fontBrand: "'Inter', sans-serif",
      cursor: 'outline', blobs: true, dark: true,
    },
  };
  const VARS = ['bg', 'surface', 'surface2', 'line', 'text', 'muted', 'faint', 'accent', 'accent2', 'accentSoft', 'accentText',
    'blobA', 'blobB', 'blobC', 'wash', 'wash2', 'hover', 'glass', 'glassLine', 'shadow', 'shadowS', 'ug1', 'ug2', 'ug3', 'markL1', 'markL2',
    'markR1', 'markR2', 'tint1', 'tint2', 'tint3', 'tint4', 'tint5', 'ink1', 'ink2', 'ink3', 'ink4', 'ink5', 'fontUi', 'fontHead', 'fontBrand'];
  const kebab = (k) => '--' + k.replace(/[A-Z]/g, (m) => '-' + m.toLowerCase());
  const varsOf = (S) => Object.fromEntries(VARS.filter((k) => S[k] != null).map((k) => [kebab(k), S[k]]));
  /** Apply a skin (palette + fonts as CSS custom properties on #stage). Call first in scene.js. */
  K.skin = (name = 'glow', over = {}) => {
    K.S = { ...K.SKINS[name], ...over };
    for (const [k, v] of Object.entries(varsOf(K.S))) X.stage.style.setProperty(k, v);
    return K.S;
  };
  /** Swap the whole palette at time t (problem→solution inversion, Marvin-style; or the final white "act" beat). */
  K.skinAt = (t, name, over = {}) => {
    const S = { ...K.SKINS[name], ...over };
    X.tl.set(X.stage, varsOf(S), t);
  };
  K.css = (k) => getComputedStyle(X.stage).getPropertyValue(kebab(k)).trim();

  // ------------------------------------------------------------------------------------------------ dom helpers
  /** h(tag, {cls, style, html, text, attrs}, parent) — style keys starting with -- become custom properties */
  const h = (tag, o = {}, parent = X.stage) => {
    const e = document.createElement(tag);
    if (o.cls) e.className = o.cls;
    if (o.style) for (const [k, v] of Object.entries(o.style)) {
      if (v == null) continue;
      if (k.startsWith('--')) e.style.setProperty(k, v); else e.style[k] = typeof v === 'number' && !NOPX.has(k) ? v + 'px' : v;
    }
    if (o.html != null) e.innerHTML = o.html;
    if (o.text != null) e.textContent = o.text;
    if (o.attrs) for (const [k, v] of Object.entries(o.attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  const NOPX = new Set(['opacity', 'zIndex', 'fontWeight', 'lineHeight', 'flex', 'flexGrow', 'flexShrink', 'order', 'scale']);
  K.h = h;
  const svgEl = (tag, attrs = {}, parent) => {
    const e = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
    if (parent) parent.appendChild(e);
    return e;
  };
  K.svgEl = svgEl;
  const box = (x, y, w, hh) => ({ position: 'absolute', left: x ?? 0, top: y ?? 0, width: w, height: hh });

  const style = document.createElement('style');
  style.textContent = `
  #stage{font-family:var(--font-ui);color:var(--text);background:var(--bg);-webkit-font-smoothing:antialiased}
  #stage *{box-sizing:border-box}
  #stage #svg{z-index:30;pointer-events:none}
  .k-layer{position:absolute;left:0;top:0;width:1920px;height:1080px}
  .k-world{position:absolute;left:0;top:0;width:10px;height:10px;transform-origin:0 0}
  .k-card{position:absolute;inset:0;background:var(--surface);border-radius:var(--r,20px);
    box-shadow:0 1px 2px var(--shadow-s),0 18px 48px var(--shadow);overflow:hidden}
  .k-glass{background:var(--glass);backdrop-filter:blur(22px) saturate(1.25);-webkit-backdrop-filter:blur(22px) saturate(1.25);
    border:1px solid var(--glass-line)}
  .k-under{position:absolute;left:9%;right:9%;bottom:-22px;height:52px;border-radius:60px;
    background:linear-gradient(90deg,var(--ug1),var(--ug2),var(--ug3));filter:blur(26px);opacity:.5}
  .k-row{position:relative;display:flex;align-items:center;gap:16px;padding:0 22px;border-radius:14px}
  .k-chip{display:inline-flex;align-items:center;gap:8px;border-radius:999px;white-space:nowrap;font-weight:600}
  .k-btn{display:inline-flex;align-items:center;justify-content:center;gap:10px;border-radius:999px;white-space:nowrap;font-weight:600}
  .k-greek{border-radius:99px;background:var(--line)}
  .k-t1{font-weight:650;color:var(--text);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  .k-t2{color:var(--muted);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
  `;
  document.head.appendChild(style);

  /** Time of a spoken word, nudged `off` s (default 2 frames early: the UI lands on the stressed word). */
  K.at = (id, w, nth = 0, off = -2 * F) => X.word(id, w, nth) + off;
  K.end = (id, w, nth = 0) => X.wordEnd(id, w, nth);

  /** World-space rect of an element (sum of offsets up to its .k-world/.k-layer; transforms ignored = resting place). */
  K.rect = (e) => {
    if (Array.isArray(e)) return { x: e[0], y: e[1], w: e[2] || 0, h: e[3] || 0 };
    if (!(e instanceof Element)) return e;
    let x = 0, y = 0, n = e;
    while (n && !(n.classList && (n.classList.contains('k-world') || n.classList.contains('k-layer')))) {
      x += n.offsetLeft; y += n.offsetTop; n = n.offsetParent;
    }
    return { x, y, w: e.offsetWidth, h: e.offsetHeight };
  };

  // ------------------------------------------------------------------------------------------------ layers & background
  /** Full-frame layer visible in [t0, t1). */
  K.layer = (name, t0 = 0, t1 = null, o = {}) => {
    const L = h('div', { cls: 'k-layer', style: { zIndex: o.z ?? 10 }, attrs: { id: name } }, o.parent || X.stage);
    if (t0 > 0) { gsap.set(L, { autoAlpha: 0 }); X.tl.set(L, { autoAlpha: 1 }, t0); }
    if (t1 != null) X.tl.set(L, { autoAlpha: 0 }, t1);
    return L;
  };
  /** Ground + 2–3 huge soft blobs that breathe (scale 1↔1.08, 6 s sine) and drift. Colours come from the skin vars. */
  K.background = (o = {}) => {
    const root = h('div', { cls: 'k-bg', style: { position: 'absolute', inset: 0, background: 'var(--bg)', zIndex: 0, overflow: 'hidden' } });
    const spec = o.blobs || [
      { x: 1700, y: 80, r: 900, c: 'var(--blob-a)', o: 1 },
      { x: 120, y: 1020, r: 820, c: 'var(--blob-b)', o: 1 },
      { x: 1180, y: 1120, r: 560, c: 'var(--blob-c)', o: 0.85 },
    ];
    const blobs = spec.map((b, i) => {
      const d = h('div', { style: { ...box(b.x - b.r, b.y - b.r, 2 * b.r, 2 * b.r), borderRadius: '50%', opacity: b.o ?? 1,
        background: `radial-gradient(circle at 50% 50%, ${b.c} 0%, ${b.c} 18%, transparent 68%)` } }, root);
      return { d, b, ph: i * 1.9 };
    });
    const amp = o.breathe ?? 0.08, drift = o.drift ?? 36;
    X.every((t) => blobs.forEach(({ d, b, ph }) => {
      const s = 1 + amp * (0.5 + 0.5 * Math.sin((2 * Math.PI * t) / (b.period || 6) + ph));
      const dx = drift * Math.sin((2 * Math.PI * t) / 11 + ph), dy = drift * Math.cos((2 * Math.PI * t) / 13 + ph);
      d.style.transform = `translate(${dx.toFixed(2)}px,${dy.toFixed(2)}px) scale(${s.toFixed(4)})`;
    }));
    // centre wash: a deeper pastel glow behind hero objects (hub, statements). Raise it at act boundaries — it is also what
    // moves the colour histogram enough for a "scene change" in a light skin without any hard cut.
    const wash = h('div', { style: { position: 'absolute', inset: 0, opacity: 0,
      background: 'radial-gradient(ellipse 62% 70% at 50% 52%, var(--wash) 0%, var(--wash2) 48%, transparent 100%)' } }, root);
    if (o.noise) { // anti-banding for dark skins only (invisible as texture)
      const n = X.grain(o.noise, 0, 'overlay'); n.style.zIndex = 1;
    }
    let wOp = 0;
    return { el: root, blobs, wash,
      /** fade the centre wash to opacity `op` over dur from t (calls must be in time order) */
      washTo(t, op, dur = 0.8, ease = 'power2.inOut') { X.tl.fromTo(wash, { opacity: wOp }, { opacity: op, duration: dur, ease, immediateRender: false }, t); wOp = op; },
    };
  };
  /** Slow push on full-frame layers (scale about the frame centre) as a pure function of t: keys [[t, scale], ...]
   *  (linear between keys, eased in/out at the ends). Keeps lock-ups and end cards alive without breaking the hold. */
  K.zoomDrift = (els, keys) => {
    const ks = keys.slice().sort((a, b) => a[0] - b[0]);
    els.forEach((e) => { e.style.transformOrigin = '960px 540px'; });
    X.every((t) => {
      let sc = ks[0][1];
      for (let i = 0; i < ks.length - 1; i++) if (t >= ks[i][0] && t < ks[i + 1][0]) sc = lerp(ks[i][1], ks[i + 1][1], E('sine.inOut')((t - ks[i][0]) / (ks[i + 1][0] - ks[i][0])));
      if (t >= ks.at(-1)[0]) sc = ks.at(-1)[1];
      els.forEach((e) => { e.style.scale = sc.toFixed(5); });
    });
  };
  /** A camera world inside a layer: lay UI out at native scale on it, then drive it with K.camera. */
  K.world = (parent) => h('div', { cls: 'k-world' }, parent);
  /** A perspective container (for 3D panels: unfold, flip, tilted planes). Children use rotationX/Y. */
  K.plane = (parent, b = {}, persp = 2200) =>
    h('div', { style: { ...box(b.x, b.y, b.w, b.h), perspective: persp + 'px', perspectiveOrigin: '50% 50%' } }, parent);

  // ------------------------------------------------------------------------------------------------ camera (pure fn of t)
  /** Camera for a world div. key(t,{x,y,s,dur,ease,vx,vy,vs}) = centre world point (x,y) at scale s, moving over [t,t+dur],
   *  then drifting (vx,vy world px/s; vs = relative scale per s). Scale interpolates logarithmically (perceptual zoom). */
  K.camera = (el, o = {}) => {
    const keys = [];
    const base = { x: o.x ?? W / 2, y: o.y ?? H / 2, s: o.s ?? 1, vx: o.vx ?? 0, vy: o.vy ?? 0, vs: o.vs ?? 0 };
    let dirty = true;
    const adv = (st, t0, t1) => { const d = Math.max(0, t1 - t0); return { x: st.x + st.vx * d, y: st.y + st.vy * d, s: st.s * (1 + st.vs * d), vx: st.vx, vy: st.vy, vs: st.vs }; };
    const evalKey = (i, T) => {
      if (i < 0) return adv(base, 0, T);
      const k = keys[i], p = (T - k.t) / k.dur;
      if (p < 1) {
        const e = k.ease(clamp(p));
        return { x: lerp(k.from.x, k.x, e), y: lerp(k.from.y, k.y, e), s: Math.exp(lerp(Math.log(k.from.s), Math.log(k.s), e)), vx: 0, vy: 0, vs: 0 };
      }
      return adv(k, k.t + k.dur, T);
    };
    const prep = () => {
      keys.sort((a, b) => a.t - b.t);
      keys.forEach((k, i) => {
        k.from = evalKey(i - 1, k.t);
        if (k.x == null) k.x = k.from.x; if (k.y == null) k.y = k.from.y; if (k.s == null) k.s = k.from.s;
      });
      dirty = false;
    };
    const cam = {
      el, keys,
      key(t, k = {}) {
        keys.push({ t, dur: Math.max(F, k.dur ?? 0.6), ease: E(k.ease || 'power2.inOut'), x: k.x, y: k.y, s: k.s, vx: k.vx ?? 0, vy: k.vy ?? 0, vs: k.vs ?? 0 });
        dirty = true;
        if (k.sfx) X.sfx(t, k.sfx === true ? 'swoosh' : k.sfx, { dur: Math.min(0.7, (k.dur ?? 0.6) + 0.1), gain: k.gain ?? 0.16 });
        return cam;
      },
      /** centre an element (or [x,y,w,h]) at scale s. o: {dur, ease, dx, dy, ax, ay, vx, vy, vs, sfx} */
      focus(target, s, t, k = {}) {
        const r = K.rect(target);
        return cam.key(t, { ...k, s, x: r.x + r.w * (k.ax ?? 0.5) + (k.dx || 0), y: r.y + r.h * (k.ay ?? 0.5) + (k.dy || 0) });
      },
      state(T) {
        if (dirty) prep();
        let i = -1;
        for (let j = 0; j < keys.length; j++) if (keys[j].t <= T) i = j; else break;
        return evalKey(i, T);
      },
      toScreen(wx, wy, T) { const s = cam.state(T); return [W / 2 + (wx - s.x) * s.s, H / 2 + (wy - s.y) * s.s]; },
    };
    X.every((T) => {
      const s = cam.state(T);
      el.style.transform = `translate(${(W / 2 - s.x * s.s).toFixed(2)}px,${(H / 2 - s.y * s.s).toFixed(2)}px) scale(${s.s.toFixed(5)})`;
    });
    return cam;
  };

  // ------------------------------------------------------------------------------------------------ icons & brand
  const ICONS = {
    chat: '<path d="M5 5h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-8l-5 4v-4H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z"/>',
    doc: '<path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    mail: '<rect x="3" y="5.5" width="18" height="13" rx="2.5"/><path d="M3.5 7.5l8.5 6 8.5-6"/>',
    code: '<path d="M9 7l-5 5 5 5M15 7l5 5-5 5"/>',
    chart: '<path d="M4 20h16M7 16v-5M12 16V6M17 16v-8"/>',
    check: '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="M8 12.5l3 3 5-6"/>',
    box: '<rect x="4.5" y="4.5" width="15" height="15" rx="4.5"/>',
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    sparkle: '<path d="M11 3.5l1.9 5.1 5.1 1.9-5.1 1.9L11 17.5l-1.9-5.1L4 10.5l5.1-1.9z"/><path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
    inbox: '<path d="M4 13l2.5-7.5h11L20 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z"/><path d="M4 13h4.5l1.5 2.5h4l1.5-2.5H20"/>',
    home: '<path d="M4 11l8-6.5 8 6.5v8.5a1 1 0 0 1-1 1h-4.5V15h-5v5.5H5a1 1 0 0 1-1-1z"/>',
    board: '<rect x="3.5" y="4" width="5" height="16" rx="1.5"/><rect x="9.5" y="4" width="5" height="11" rx="1.5"/><rect x="15.5" y="4" width="5" height="13" rx="1.5"/>',
    users: '<circle cx="9" cy="9" r="3.5"/><path d="M3 19.5c.6-3.3 3-5 6-5s5.4 1.7 6 5"/><circle cx="17" cy="8" r="2.6"/><path d="M16.5 13.2c2.4.2 4 1.6 4.5 4.3"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z"/><path d="M10 21h4"/>',
    send: '<path d="M4.5 12L20 4.5 15.5 20l-3-6.5z"/><path d="M12.5 13.5L20 4.5"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    bolt: '<path d="M13 3L5 13.5h6L10 21l8-10.5h-6z"/>',
    link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
    hash: '<path d="M9 4L7 20M17 4l-2 16M4.5 9h16M3.5 15h16"/>',
    x: '<path d="M6 6l12 12M18 6L6 18"/>',
    more: '<circle cx="6" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="18" cy="12" r="1.2"/>',
    flag: '<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
    shield: '<path d="M12 3l7 3v5.5c0 4.5-3 8-7 9.5-4-1.5-7-5-7-9.5V6z"/>',
    folder: '<path d="M3.5 7a2 2 0 0 1 2-2h4l2 2.5h7a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2h-13a2 2 0 0 1-2-2z"/>',
    arrow: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    filter: '<path d="M4 6h16M7 12h10M10 18h4"/>',
    target: '<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.5"/><circle cx="12" cy="12" r="1" />',
    zap: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M5.6 5.6l2.8 2.8M15.6 15.6l2.8 2.8M18.4 5.6l-2.8 2.8M8.4 15.6l-2.8 2.8"/>',
  };
  K.ICONS = ICONS;
  /** Line icon as an SVG string. */
  K.icon = (name, o = {}) => {
    const s = o.size ?? 24, c = o.color ?? 'currentColor', sw = o.sw ?? 2;
    return `<svg viewBox="0 0 24 24" width="${s}" height="${s}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" style="display:block;flex:none">${ICONS[name] || ''}</svg>`;
  };
  /** Rounded colour square holding a line icon (A2 icon style). tint/ink = 1..5 (skin tint/ink pairs) or css colours. */
  K.glyph = (parent, name, o = {}) => {
    const s = o.size ?? 44, tone = o.tone ?? 1;
    const bg = o.bg ?? `var(--tint${tone})`, ink = o.ink ?? `var(--ink${tone})`;
    return h('div', { style: { width: s, height: s, flex: 'none', borderRadius: o.radius ?? Math.round(s * 0.28), background: bg, color: ink,
      display: 'flex', alignItems: 'center', justifyContent: 'center', ...(o.style || {}) }, html: K.icon(name, { size: Math.round(s * 0.52), sw: o.sw ?? 2 }) }, parent);
  };

  // brand mark: an original "kite" made of two chevron halves around an open window (+ a spark). Local units, centre ~ (0,4).
  K.MARK = {
    L: 'M-12,-87.4 L-78,-18 L-12,97.1 L-12,28.9 L-33,-8 L-12,-29.6 Z',
    R: 'M12,-87.4 L78,-18 L12,97.1 L12,28.9 L33,-8 L12,-29.6 Z',
    WIN: 'M0,-34 L28,-8 L0,40 L-28,-8 Z',
    SPARK: 'M0,-21 L3.6,-10.6 L14,-7 L3.6,-3.4 L0,7 L-3.6,-3.4 L-14,-7 L-3.6,-10.6 Z',
    H: 196, CY: 4.5,
  };
  /** Kite mark as an SVG string (height px). Returns markup with classes k-mL / k-mR / k-mS for animation. */
  K.markSVG = (o = {}) => {
    const hh = o.size ?? 64, id = uid('mk'), ww = hh * (172 / 196);
    return `<svg viewBox="-86 -93.5 172 196" width="${ww.toFixed(1)}" height="${hh}" style="display:block;overflow:visible">
      <defs><linearGradient id="${id}a" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--mark-l1)"/><stop offset="1" style="stop-color:var(--mark-l2)"/></linearGradient>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--mark-r1)"/><stop offset="1" style="stop-color:var(--mark-r2)"/></linearGradient></defs>
      <path class="k-mL" d="${K.MARK.L}" fill="url(#${id}a)" stroke="url(#${id}a)" stroke-width="10" stroke-linejoin="round"/>
      <path class="k-mR" d="${K.MARK.R}" fill="url(#${id}b)" stroke="url(#${id}b)" stroke-width="10" stroke-linejoin="round"/>
      ${o.spark === false ? '' : `<path class="k-mS" d="${K.MARK.SPARK}" fill="var(--accent)" stroke="var(--accent)" stroke-width="3" stroke-linejoin="round"/>`}
    </svg>`;
  };
  /** Wordmark with per-letter spans (for the 2-frame letter stagger). */
  K.wordmark = (parent, o = {}) => {
    const el = h('div', { style: { position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y, display: 'flex', alignItems: 'baseline',
      fontFamily: 'var(--font-brand)', fontWeight: o.weight ?? 600, fontSize: o.size ?? 120, letterSpacing: '-0.035em', color: 'var(--text)',
      lineHeight: 1, whiteSpace: 'nowrap' } }, parent);
    const letters = [...(o.text || 'kitewise')].map((ch) => h('span', { text: ch, style: { display: 'inline-block' } }, el));
    return { el, letters };
  };
  /** Glassy app-icon tile with the mark and a coloured glow behind (the hub of hub-and-orbit). */
  K.appIcon = (parent, o = {}) => {
    const s = o.size ?? 180;
    const wrap = h('div', { style: { ...box(o.x, o.y, s, s) } }, parent);
    const glow = h('div', { style: { position: 'absolute', left: '-22%', top: '-4%', width: '144%', height: '144%', borderRadius: '50%',
      background: 'radial-gradient(circle, var(--ug1) 0%, var(--ug2) 30%, transparent 64%)', opacity: 0.5, filter: 'blur(20px)' } }, wrap);
    const tile = h('div', { style: { position: 'absolute', inset: 0, borderRadius: s * 0.24, background: 'linear-gradient(160deg,#FFFFFF 0%,var(--surface2) 100%)',
      boxShadow: `0 2px 4px var(--shadow-s), 0 ${s * 0.12}px ${s * 0.3}px var(--shadow), inset 0 1px 0 rgba(255,255,255,.9)`, border: '1px solid var(--glass-line)' } }, wrap);
    const mark = h('div', { style: { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }, html: K.markSVG({ size: s * 0.56 }) }, wrap);
    return { el: wrap, tile, glow, mark, markH: s * 0.56 };
  };

  // ------------------------------------------------------------------------------------------------ avatars (original vector busts)
  const AV = {
    bg: ['#E9E4FF', '#FFE6DA', '#DCF2E8', '#DCEAFF', '#FFF2D3', '#F5DFF0'],
    skin: ['#F4D3BC', '#E6B593', '#C98E68', '#9C6847', '#704A33'],
    hair: ['#2A2120', '#4B3326', '#7E5236', '#C08F55', '#1C1C26', '#A9A3A0'],
    shirt: ['#3B3F58', '#7C86A8', '#A99BFF', '#5E6B7E', '#C9CFDC', '#6E5BD8'],
  };
  K.avatarSVG = (seed = 1) => {
    const r = X.rand(seed * 7919 + 17), pick = (a) => a[Math.floor(r() * a.length)];
    const bg = pick(AV.bg), skin = pick(AV.skin), hair = pick(AV.hair), shirt = pick(AV.shirt), st = Math.floor(r() * 5), glasses = r() < 0.25;
    const id = uid('av');
    const back = st === 1 ? `<path d="M19 31c0-11 5.5-17.5 13-17.5S45 20 45 31v13c-3 2-6 2.4-8 2V29H27v17c-2 .4-5 0-8-2z" fill="${hair}"/>` : '';
    const front = [
      `<path d="M21.3 28c-.8-8.6 4.4-13.8 10.7-13.8S43.5 19.4 42.7 28c-1.6-4.4-4.6-7-10.7-7s-9.1 2.6-10.7 7z" fill="${hair}"/>`,
      `<path d="M21.3 27.5c1-7.4 5-12 10.7-12s9.7 4.6 10.7 12c-4.2-3.8-7.2-5.2-10.7-5.2s-6.5 1.4-10.7 5.2z" fill="${hair}"/>`,
      `<circle cx="32" cy="13.5" r="5.6" fill="${hair}"/><path d="M21.3 28c-.8-8.6 4.4-13.8 10.7-13.8S43.5 19.4 42.7 28c-1.6-4.4-4.6-7-10.7-7s-9.1 2.6-10.7 7z" fill="${hair}"/>`,
      [[22.5, 23], [26, 18], [32, 16], [38, 18], [41.5, 23]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5.2" fill="${hair}"/>`).join(''),
      `<path d="M21.8 26.5c0-7.3 4.6-11.6 10.2-11.6s10.2 4.3 10.2 11.6c-2.3-3.3-5.6-4.8-10.2-4.8s-7.9 1.5-10.2 4.8z" fill="${hair}" opacity=".85"/>`,
    ][st];
    const gl = glasses ? `<g fill="none" stroke="#2A2230" stroke-width="1.3"><circle cx="28" cy="30" r="3.2"/><circle cx="36" cy="30" r="3.2"/><path d="M31.2 30h1.6"/></g>` : '';
    return `<svg viewBox="0 0 64 64" width="100%" height="100%" style="display:block"><defs><clipPath id="${id}"><circle cx="32" cy="32" r="32"/></clipPath></defs>
      <g clip-path="url(#${id})"><rect width="64" height="64" fill="${bg}"/>${back}
      <path d="M9 67c1.6-12.6 10.4-19 23-19s21.4 6.4 23 19z" fill="${shirt}"/>
      <path d="M27.2 40h9.6v8.4c0 2.7-2.1 4.4-4.8 4.4s-4.8-1.7-4.8-4.4z" fill="${skin}" opacity=".88"/>
      <ellipse cx="32" cy="29.5" rx="10.6" ry="12.2" fill="${skin}"/>
      <circle cx="28.2" cy="30.4" r="1.15" fill="#2A2230"/><circle cx="35.8" cy="30.4" r="1.15" fill="#2A2230"/>
      <path d="M29.4 35.4q2.6 1.9 5.2 0" fill="none" stroke="#7A4A3A" stroke-width="1.2" stroke-linecap="round"/>
      ${front}${gl}</g></svg>`;
  };
  /** Circular avatar with a white ring and soft shadow. */
  K.avatar = (parent, o = {}) => {
    const s = o.size ?? 40;
    return h('div', { style: { position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y, width: s, height: s, flex: 'none', borderRadius: '50%',
      border: o.ring === false ? 'none' : `${Math.max(2, Math.round(s * 0.07))}px solid var(--surface)`, boxShadow: o.ring === false ? 'none' : '0 4px 12px var(--shadow)',
      overflow: 'hidden', background: 'var(--surface)', ...(o.style || {}) }, html: K.avatarSVG(o.seed ?? 1) }, parent);
  };
  K.avatarStack = (parent, seeds, o = {}) => {
    const s = o.size ?? 40;
    const el = h('div', { style: { display: o.x != null ? 'flex' : 'inline-flex', alignItems: 'center', position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y } }, parent);
    const items = seeds.map((sd, i) => K.avatar(el, { seed: sd, size: s, style: { marginLeft: i ? -(o.overlap ?? s * 0.28) + 'px' : 0, zIndex: seeds.length - i } }));
    return { el, items };
  };

  // ------------------------------------------------------------------------------------------------ UI components
  /** App window: {x,y,w,h,r,title,search,bar} → {wrap (perspective plane), el (window), bar, body}. */
  K.win = (parent, o = {}) => {
    const w = o.w ?? 1600, hh = o.h ?? 960, barH = o.bar === false ? 0 : (o.barH ?? 56);
    const wrap = K.plane(parent, { x: o.x ?? 0, y: o.y ?? 0, w, h: hh }, o.persp ?? 2600);
    const el = h('div', { style: { position: 'absolute', inset: 0, background: 'var(--surface)', borderRadius: o.r ?? 22, overflow: 'hidden',
      boxShadow: '0 2px 6px var(--shadow-s), 0 30px 80px var(--shadow)', border: '1px solid var(--line)' } }, wrap);
    let bar = null;
    if (barH) {
      bar = h('div', { style: { position: 'absolute', left: 0, top: 0, right: 0, height: barH, display: 'flex', alignItems: 'center', padding: '0 22px',
        borderBottom: '1px solid var(--line)', background: 'var(--surface)', gap: '10px' } }, el);
      for (let i = 0; i < 3; i++) h('div', { style: { width: 13, height: 13, borderRadius: '50%', background: 'var(--faint)' } }, bar);
      if (o.search !== false) {
        const sp = h('div', { style: { position: 'absolute', left: '50%', top: (barH - 36) / 2, width: 470, height: 36, marginLeft: -235, borderRadius: 12,
          background: 'var(--surface2)', display: 'flex', alignItems: 'center', gap: '10px', padding: '0 14px', color: 'var(--muted)', fontSize: 16 } }, bar);
        sp.innerHTML = K.icon('search', { size: 18 }) + `<span style="flex:1">${o.search || 'Search or ask…'}</span><span style="font-size:13px;font-weight:600;padding:2px 8px;border-radius:6px;background:var(--surface);border:1px solid var(--line)">Ctrl K</span>`;
      }
      const right = h('div', { style: { marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px', color: 'var(--muted)' } }, bar);
      right.innerHTML = K.icon('bell', { size: 20 });
      K.avatar(right, { seed: o.me ?? 4, size: 32, ring: false });
    }
    const body = h('div', { style: { position: 'absolute', left: 0, right: 0, top: barH, bottom: 0 } }, el);
    return { wrap, el, bar, body };
  };
  /** Sidebar: {w, brand, items:[{icon,label,badge,active,tone}], section, spaces:[{label,color}]} → {el, rows{label:el}, logo} */
  K.sidebar = (parent, o = {}) => {
    const w = o.w ?? 280;
    const el = h('div', { style: { position: 'absolute', left: 0, top: 0, bottom: 0, width: w, background: 'var(--surface2)', borderRight: '1px solid var(--line)',
      padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: '4px' } }, parent);
    const head = h('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '0 10px 18px' } }, el);
    const logo = h('div', { html: K.markSVG({ size: 34 }), style: { flex: 'none' } }, head);
    h('div', { text: o.brand ?? 'kitewise', style: { fontFamily: 'var(--font-brand)', fontWeight: 600, fontSize: 23, letterSpacing: '-0.03em' } }, head);
    const rows = {}, list = [];
    const mk = (it) => {
      const r = h('div', { cls: 'k-row', style: { height: 44, padding: '0 12px', gap: '12px', fontSize: 17, fontWeight: it.active ? 650 : 500,
        color: it.active ? 'var(--text)' : 'var(--muted)', background: it.active ? 'var(--surface)' : 'transparent',
        boxShadow: it.active ? '0 1px 3px var(--shadow-s)' : 'none' } }, el);
      r.innerHTML = (it.color ? `<span style="width:10px;height:10px;border-radius:3px;margin:0 5px;background:${it.color};flex:none"></span>`
        : K.icon(it.icon || 'doc', { size: 20, color: it.tone ? `var(--ink${it.tone})` : 'currentColor' })) + `<span style="flex:1;white-space:nowrap">${it.label}</span>`;
      if (it.badge) h('span', { text: it.badge, style: { fontSize: 13, fontWeight: 700, color: 'var(--accent)', background: 'var(--accent-soft)', padding: '2px 8px', borderRadius: 99 } }, r);
      rows[it.label] = r; list.push(r);
      return r;
    };
    (o.items || []).forEach(mk);
    if (o.spaces) {
      h('div', { text: o.section ?? 'SPACES', style: { fontSize: 12.5, fontWeight: 700, letterSpacing: '.09em', color: 'var(--muted)', padding: '20px 12px 8px' } }, el);
      o.spaces.forEach(mk);
    }
    return { el, rows, list, logo, head };
  };
  /** List row: {glyph, tone, title, sub, avatar(seed), time, unread, h} → {el, dot} */
  K.row = (parent, o = {}) => {
    const el = h('div', { cls: 'k-row', style: { height: o.h ?? 84, borderBottom: o.divider === false ? 'none' : '1px solid var(--line)', borderRadius: 0, background: 'var(--surface)' } }, parent);
    if (o.glyph) K.glyph(el, o.glyph, { size: o.gs ?? 46, tone: o.tone ?? 1 });
    const mid = h('div', { style: { flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '4px' } }, el);
    h('div', { cls: 'k-t1', text: o.title || '', style: { fontSize: o.fs ?? 19 } }, mid);
    if (o.sub) h('div', { cls: 'k-t2', text: o.sub, style: { fontSize: (o.fs ?? 19) - 3 } }, mid);
    if (o.chips) o.chips.forEach((c) => K.chip(mid, typeof c === 'string' ? { text: c } : c));
    if (o.avatar != null) K.avatar(el, { seed: o.avatar, size: o.as ?? 34 });
    if (o.time) h('div', { text: o.time, style: { fontSize: 15, color: 'var(--muted)', width: 52, textAlign: 'right', flex: 'none' } }, el);
    const dot = h('div', { style: { width: 10, height: 10, borderRadius: '50%', background: 'var(--accent)', flex: 'none', opacity: o.unread ? 1 : 0 } }, el);
    return { el, dot };
  };
  /** Pill chip: {text, icon, tone:'accent'|'soft'|'muted'|'outline'|1..5, size} */
  K.chip = (parent, o = {}) => {
    const fs = o.size ?? 15, tone = o.tone ?? 'muted';
    const pal = tone === 'accent' ? ['var(--accent)', 'var(--accent-text)'] : tone === 'soft' ? ['var(--accent-soft)', 'var(--accent)']
      : tone === 'outline' ? ['transparent', 'var(--muted)'] : typeof tone === 'number' ? [`var(--tint${tone})`, `var(--ink${tone})`] : ['var(--surface2)', 'var(--muted)'];
    const el = h('div', { cls: 'k-chip', style: { fontSize: fs, padding: `${fs * 0.32}px ${fs * 0.75}px`, background: pal[0], color: pal[1],
      border: tone === 'outline' ? '1px solid var(--line)' : 'none', alignSelf: 'flex-start', ...(o.style || {}) } }, parent);
    el.innerHTML = (o.icon ? K.icon(o.icon, { size: fs * 1.1, sw: 2.2 }) : '') + `<span>${o.text ?? ''}</span>`;
    if (o.x != null) Object.assign(el.style, { position: 'absolute', left: o.x + 'px', top: o.y + 'px' });
    return el;
  };
  /** Button: {label, icon, kind:'primary'|'soft'|'ghost', size} */
  K.btn = (parent, o = {}) => {
    const fs = o.size ?? 18, kind = o.kind ?? 'primary';
    const st = kind === 'primary' ? { background: 'var(--accent)', color: 'var(--accent-text)', boxShadow: '0 8px 22px var(--shadow)' }
      : kind === 'soft' ? { background: 'var(--accent-soft)', color: 'var(--accent)' } : { background: 'var(--surface)', color: 'var(--text)', border: '1px solid var(--line)' };
    const el = h('div', { cls: 'k-btn', style: { fontSize: fs, padding: `${fs * 0.62}px ${fs * 1.25}px`, ...st, ...(o.style || {}) } }, parent);
    el.innerHTML = (o.icon ? K.icon(o.icon, { size: fs * 1.15, sw: 2.3 }) : '') + `<span>${o.label ?? ''}</span>`;
    if (o.x != null) Object.assign(el.style, { position: 'absolute', left: o.x + 'px', top: o.y + 'px' });
    return el;
  };
  /** Toggle switch → {el, flip(t)} */
  K.toggle = (parent, o = {}) => {
    const s = o.size ?? 28, on = !!o.on;
    const el = h('div', { style: { width: s * 1.75, height: s, borderRadius: s, position: 'relative', flex: 'none', background: on ? 'var(--accent)' : 'var(--faint)' } }, parent);
    const knob = h('div', { style: { position: 'absolute', top: s * 0.12, left: s * 0.12, width: s * 0.76, height: s * 0.76, borderRadius: '50%', background: '#fff',
      boxShadow: '0 2px 5px rgba(0,0,0,.18)', transform: `translateX(${on ? s * 0.75 : 0}px)` } }, el);
    return { el, knob, flip(t, o2 = {}) {
      const to = !on;
      X.tl.fromTo(knob, { x: on ? s * 0.75 : 0 }, { x: to ? s * 0.75 : 0, duration: 7 * F, ease: 'power3.out' }, t);
      X.tl.fromTo(el, { backgroundColor: K.css(on ? 'accent' : 'faint') }, { backgroundColor: K.css(to ? 'accent' : 'faint'), duration: 7 * F }, t);
      if (o2.sfx !== false) X.sfx(t, 'blip_up', { gain: 0.18 });
    } };
  };
  /** Chat bubble: {text, who:'me'|'ai', avatar, size, maxW} */
  K.bubble = (parent, o = {}) => {
    const me = o.who === 'me', fs = o.size ?? 18;
    const row = h('div', { style: { display: 'flex', gap: '10px', alignItems: 'flex-end', justifyContent: me ? 'flex-end' : 'flex-start' } }, parent);
    if (!me && o.avatar !== false) { if (o.avatar === 'kite') h('div', { html: K.markSVG({ size: 30 }), style: { flex: 'none', marginBottom: 4 } }, row); else if (o.avatar != null) K.avatar(row, { seed: o.avatar, size: 34 }); }
    const b = h('div', { text: o.text, style: { maxWidth: o.maxW ?? 380, fontSize: fs, lineHeight: 1.35, padding: `${fs * 0.6}px ${fs * 0.85}px`,
      borderRadius: `${fs}px ${fs}px ${me ? 6 : fs}px ${me ? fs : 6}px`, background: me ? 'var(--accent)' : 'var(--surface2)', color: me ? 'var(--accent-text)' : 'var(--text)',
      fontWeight: 500 } }, row);
    if (me && o.avatar != null) K.avatar(row, { seed: o.avatar, size: 34 });
    return { el: row, bubble: b };
  };
  /** 3-dot typing indicator → {el, run(t0, t1)} (pulses only inside [t0,t1], hidden outside) */
  K.dots = (parent, o = {}) => {
    const s = o.size ?? 10;
    const el = h('div', { style: { display: 'inline-flex', gap: s * 0.6 + 'px', padding: `${s * 1.2}px ${s * 1.6}px`, borderRadius: 99, background: 'var(--surface2)', alignSelf: 'flex-start', opacity: 0 } }, parent);
    const ds = [0, 1, 2].map(() => h('div', { style: { width: s, height: s, borderRadius: '50%', background: 'var(--muted)' } }, el));
    const runs = [];
    X.every((t) => {
      const r = runs.find(([a, b]) => t >= a && t < b);
      el.style.opacity = r ? Math.min(1, (t - r[0]) / (4 * F), (r[1] - t) / (3 * F)) : 0;
      ds.forEach((d, i) => { const p = 0.5 + 0.5 * Math.sin(2 * Math.PI * (t * 2.2 - i * 0.18)); d.style.opacity = 0.35 + 0.65 * p; d.style.transform = `translateY(${(-3 * p).toFixed(2)}px)`; });
    });
    return { el, run(t0, t1) { runs.push([t0, t1]); } };
  };
  /** Card with optional chromatic under-glow: {x,y,w,h,r,glow,glass,pad} → {el (wrapper), body} */
  K.card = (parent, o = {}) => {
    const el = h('div', { style: { ...box(o.x, o.y, o.w, o.h), '--r': (o.r ?? 20) + 'px', ...(o.style || {}) } }, parent);
    if (o.glow) h('div', { cls: 'k-under', style: { opacity: o.glow === true ? 0.5 : o.glow } }, el);
    const body = h('div', { cls: 'k-card' + (o.glass ? ' k-glass' : ''), style: { padding: o.pad ?? 0, background: o.glass ? 'var(--glass)' : undefined } }, el);
    return { el, body };
  };
  /** Frosted glass panel (alias of card with glass). */
  K.glass = (parent, o = {}) => K.card(parent, { ...o, glass: true });
  /** Greeked text lines (rounded bars): {widths:[...], h, gap, color} */
  K.greek = (parent, o = {}) => {
    const el = h('div', { style: { display: 'flex', flexDirection: 'column', gap: (o.gap ?? 10) + 'px' } }, parent);
    (o.widths || [1, 0.8, 0.6]).forEach((w) => h('div', { cls: 'k-greek', style: { height: o.h ?? 10, width: typeof w === 'number' && w <= 1 ? w * 100 + '%' : w, background: o.color } }, el));
    return el;
  };
  /** Small notification badge (count). */
  K.badge = (parent, o = {}) => h('div', { text: o.text ?? '3', style: { position: 'absolute', right: o.right ?? -10, top: o.top ?? -10, minWidth: o.size ?? 30, height: o.size ?? 30,
    padding: '0 8px', borderRadius: 99, background: o.bg ?? 'var(--accent)', color: '#fff', fontSize: (o.size ?? 30) * 0.5, fontWeight: 700, display: 'flex',
    alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px var(--shadow)', border: '3px solid var(--surface)' } }, parent);
  /** Toast: {icon, title, sub, x, y, w, tone} → {el, show(t, hold, {sfx, from})} slides in (expo.out 12f), out (power2.in 8f) */
  K.toast = (parent, o = {}) => {
    const el = h('div', { cls: 'k-glass', style: { position: 'absolute', left: o.x ?? 0, top: o.y ?? 0, width: o.w ?? 420, display: 'flex', alignItems: 'center', gap: '16px',
      padding: '16px 20px', borderRadius: 18, boxShadow: '0 18px 44px var(--shadow)', background: 'var(--surface)', opacity: 0 } }, parent);
    K.glyph(el, o.icon ?? 'checkCircle', { size: 48, tone: o.tone ?? 4 });
    const m = h('div', { style: { display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 } }, el);
    h('div', { cls: 'k-t1', text: o.title ?? 'Done', style: { fontSize: 19 } }, m);
    if (o.sub) h('div', { cls: 'k-t2', text: o.sub, style: { fontSize: 16 } }, m);
    return { el, show(t, hold = 2.2, o2 = {}) {
      const dy = o2.from ?? -26;
      X.tl.fromTo(el, { opacity: 0, y: dy, scale: 0.96 }, { opacity: 1, y: 0, scale: 1, duration: 12 * F, ease: 'expo.out' }, t);
      if (hold != null) X.tl.to(el, { opacity: 0, y: dy * 0.5, duration: 8 * F, ease: 'power2.in' }, t + hold);
      if (o2.sfx !== false) X.sfx(t, o2.sfx || 'notif', { gain: o2.gain ?? 0.32 });
    } };
  };

  // ------------------------------------------------------------------------------------------------ charts & rings
  /** Area chart (line + fading fill): {w,h,data,color,fill,sw} → {el, line, area, draw(t,dur)} */
  K.areaChart = (parent, o = {}) => {
    const w = o.w ?? 560, hh = o.h ?? 220, d = o.data ?? [3, 4, 3.6, 5, 4.8, 6.2, 7, 6.6, 8.4, 9.6];
    const id = uid('ac'), mx = Math.max(...d) * 1.1, mn = Math.min(0, ...d);
    const pts = d.map((v, i) => [(i / (d.length - 1)) * w, hh - ((v - mn) / (mx - mn)) * hh]);
    let path = `M${pts[0][0]},${pts[0][1]}`;
    for (let i = 1; i < pts.length; i++) { const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], cx = (x0 + x1) / 2; path += ` C${cx},${y0} ${cx},${y1} ${x1},${y1}`; }
    const el = h('div', { style: { position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y, width: w, height: hh } }, parent);
    const s = svgEl('svg', { viewBox: `0 0 ${w} ${hh}`, width: w, height: hh, style: 'overflow:visible;display:block' }, el);
    const g = svgEl('linearGradient', { id, x1: 0, y1: 0, x2: 0, y2: 1 }, svgEl('defs', {}, s));
    svgEl('stop', { offset: 0, style: `stop-color:${o.fill ?? 'var(--accent2)'};stop-opacity:.32` }, g);
    svgEl('stop', { offset: 1, style: `stop-color:${o.fill ?? 'var(--accent2)'};stop-opacity:0` }, g);
    const area = svgEl('path', { d: path + ` L${w},${hh} L0,${hh} Z`, fill: `url(#${id})` }, s);
    const line = svgEl('path', { d: path, fill: 'none', stroke: o.color ?? 'var(--accent)', 'stroke-width': o.sw ?? 5, 'stroke-linecap': 'round' }, s);
    const end = svgEl('circle', { cx: pts.at(-1)[0], cy: pts.at(-1)[1], r: 9, fill: 'var(--surface)', stroke: o.color ?? 'var(--accent)', 'stroke-width': 4 }, s);
    return { el, line, area, end, draw(t, dur = 1.2) {
      X.drawOn(line, t, dur, 'power2.out');
      X.tl.fromTo(area, { opacity: 0 }, { opacity: 1, duration: dur, ease: 'power2.out' }, t + dur * 0.25);
      X.tl.fromTo(end, { scale: 0, transformOrigin: '50% 50%' }, { scale: 1, duration: 10 * F, ease: 'back.out(2.2)' }, t + dur * 0.9);
    } };
  };
  /** Bar chart → {el, bars, grow(t, stagger)} */
  K.bars = (parent, o = {}) => {
    const w = o.w ?? 420, hh = o.h ?? 200, d = o.data ?? [4, 6, 5, 8, 7, 9], mx = Math.max(...d);
    const el = h('div', { style: { position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y, width: w, height: hh, display: 'flex', alignItems: 'flex-end', gap: (o.gap ?? 14) + 'px' } }, parent);
    const bars = d.map((v, i) => h('div', { style: { flex: 1, height: (v / mx) * 100 + '%', borderRadius: '10px 10px 4px 4px',
      background: i === (o.hi ?? d.length - 1) ? 'var(--accent)' : 'var(--accent-soft)', transformOrigin: '50% 100%' } }, el));
    return { el, bars, grow(t, st = 2 * F) { X.tl.fromTo(bars, { scaleY: 0 }, { scaleY: 1, duration: 14 * F, ease: 'power3.out', stagger: st }, t); } };
  };
  /** Stat ring with rotating gradient stroke and a counter: {size, sw, value, label, unit} → {el, num, count(t, dur, from)} */
  K.ring = (parent, o = {}) => {
    const s = o.size ?? 200, sw = o.sw ?? Math.round(s * 0.06), r = (s - sw) / 2 - 2, C = 2 * Math.PI * r, id = uid('rg');
    const el = h('div', { style: { position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y, width: s, height: s, flex: 'none' } }, parent);
    const sv = svgEl('svg', { viewBox: `0 0 ${s} ${s}`, width: s, height: s, style: 'display:block' }, el);
    const g = svgEl('linearGradient', { id, x1: 0, y1: 0, x2: 1, y2: 1, gradientUnits: 'objectBoundingBox' }, svgEl('defs', {}, sv));
    svgEl('stop', { offset: 0, style: `stop-color:${o.c1 ?? 'var(--accent2)'}` }, g); svgEl('stop', { offset: 1, style: `stop-color:${o.c2 ?? 'var(--accent)'}` }, g);
    svgEl('circle', { cx: s / 2, cy: s / 2, r, fill: 'none', stroke: 'var(--line)', 'stroke-width': sw }, sv);
    const arc = svgEl('circle', { cx: s / 2, cy: s / 2, r, fill: 'none', stroke: `url(#${id})`, 'stroke-width': sw, 'stroke-linecap': 'round',
      transform: `rotate(-90 ${s / 2} ${s / 2})`, 'stroke-dasharray': C, 'stroke-dashoffset': C }, sv);
    const lab = h('div', { style: { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } }, el);
    const nrow = h('div', { style: { display: 'flex', alignItems: 'baseline', fontWeight: 700, fontSize: s * 0.24, letterSpacing: '-0.03em', color: 'var(--text)' } }, lab);
    const num = h('span', { text: '0' }, nrow);
    const unit = h('span', { text: o.unit ?? '%', style: { fontSize: s * 0.13, marginLeft: 2, color: 'var(--muted)' } }, nrow);
    if (o.label) h('div', { text: o.label, style: { fontSize: s * 0.075, color: 'var(--muted)', fontWeight: 600, marginTop: 2 } }, lab);
    if (o.spin !== false) X.every((t) => g.setAttribute('gradientTransform', `rotate(${(t * 55) % 360} .5 .5)`));
    return { el, num, arc, unit, count(t, dur = 1.2, from = 0, to = o.value ?? 72, o2 = {}) {
      X.countUp(num, from, to, t, dur);
      X.tl.fromTo(arc, { attr: { 'stroke-dashoffset': C * (1 - from / 100) } }, { attr: { 'stroke-dashoffset': C * (1 - to / 100) }, duration: dur, ease: 'power2.out' }, t);
      if (o2.unit !== false) X.tl.fromTo(unit, { opacity: 0 }, { opacity: 1, duration: 6 * F }, t + dur - 0.1);
      if (o2.sfx) X.sfx(t, o2.sfx, { gain: 0.12 });
    } };
  };

  // ------------------------------------------------------------------------------------------------ cursor
  const ARROW = (st) => {
    const fill = st === 'brand' ? 'var(--accent)' : st === 'outline' ? '#FFFFFF' : '#111111';
    const stroke = st === 'outline' ? '#111111' : '#FFFFFF';
    return `<svg viewBox="0 0 36 46" width="40" height="51" style="display:block;overflow:visible"><path d="M3 2 L3 37 L12.5 28.5 L18.5 42.5 L25 39.6 L19 25.8 L31.5 25.8 Z" fill="${fill}" stroke="${stroke}" stroke-width="2.4" stroke-linejoin="round"/></svg>`;
  };
  /** Cursor in screen space. Targets: [x,y] (screen) or {el, cam, ax, ay, dx, dy} (world element, follows the camera). */
  K.cursor = (o = {}) => {
    const st = o.style || K.S.cursor || 'brand';
    const root = h('div', { cls: 'k-cursor', style: { position: 'absolute', left: 0, top: 0, width: 0, height: 0, zIndex: o.z ?? 60, pointerEvents: 'none', opacity: 0 } }, o.parent || X.stage);
    const ripple = h('div', { style: { position: 'absolute', left: -30, top: -30, width: 60, height: 60, borderRadius: '50%', border: `3px solid ${st === 'brand' ? 'var(--accent)' : 'rgba(0,0,0,.45)'}`, opacity: 0 } }, root);
    const arrow = h('div', { html: ARROW(st), style: { position: 'absolute', left: -3, top: -2, transformOrigin: '3px 2px', filter: 'drop-shadow(0 6px 10px rgba(30,20,80,.28))' } }, root);
    const segs = [], clicks = [], vis = [];
    let start = o.start || [W + 80, H + 80];
    const pt = (p, T) => {
      if (Array.isArray(p)) return p;
      if ((p.el || p.r) && p.cam) { if (!p._r) p._r = p.r ? K.rect(p.r) : K.rect(p.el); const r = p._r; return p.cam.toScreen(r.x + r.w * (p.ax ?? 0.5) + (p.dx || 0), r.y + r.h * (p.ay ?? 0.5) + (p.dy || 0), T); }
      return [p.x, p.y];
    };
    const posAt = (T) => {
      let i = -1;
      for (let j = 0; j < segs.length; j++) if (segs[j].t <= T) i = j; else break;
      if (i < 0) return pt(start, T);
      const s = segs[i], p0 = i ? pt(segs[i - 1].to, T) : pt(start, T), p1 = pt(s.to, T);
      const e = s.ease(clamp((T - s.t) / s.dur));
      const dx = p1[0] - p0[0], dy = p1[1] - p0[1], L = Math.hypot(dx, dy) || 1, arc = s.arc ?? -0.16 * L;
      const cx = (p0[0] + p1[0]) / 2 + (-dy / L) * arc, cy = (p0[1] + p1[1]) / 2 + (dx / L) * arc;
      const u = 1 - e;
      return [u * u * p0[0] + 2 * u * e * cx + e * e * p1[0], u * u * p0[1] + 2 * u * e * cy + e * e * p1[1]];
    };
    X.every((T) => {
      const [x, y] = posAt(T);
      root.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px)`;
      let op = 0; for (const [t, on] of vis) if (t <= T) op = on ? clamp((T - t) / (6 * F)) : 1 - clamp((T - t) / (6 * F));
      root.style.opacity = op.toFixed(3);
      let c = null; for (const ct of clicks) if (ct <= T && T - ct < 0.6) c = ct;
      if (c == null) { arrow.style.transform = 'scale(1)'; ripple.style.opacity = 0; return; }
      const d = T - c, sq = d < 2 * F ? 0.86 : d < 5 * F ? lerp(0.86, 1, (d - 2 * F) / (3 * F)) : 1;
      arrow.style.transform = `scale(${sq.toFixed(3)})`;
      const q = d / (12 * F);
      ripple.style.opacity = q <= 1 ? (0.55 * (1 - q)).toFixed(3) : 0;
      ripple.style.transform = `scale(${(0.25 + 0.95 * (1 - (1 - Math.min(q, 1)) ** 2)).toFixed(3)})`;
    });
    const api = {
      el: root,
      start(p) { start = p; return api; },
      /** teleport (1 frame) — use while hidden, before show(), to enter from a new side */
      jump(t, p) { return api.move(t, p, { dur: F, ease: 'none' }); },
      show(t) { vis.push([t, true]); vis.sort((a, b) => a[0] - b[0]); return api; },
      hide(t) { vis.push([t, false]); vis.sort((a, b) => a[0] - b[0]); return api; },
      /** glide to target over dur (power2.inOut, curved). arc: px of bow (signed). */
      move(t, to, m = {}) { segs.push({ t, to, dur: m.dur ?? 0.65, ease: E(m.ease || 'power2.inOut'), arc: m.arc }); segs.sort((a, b) => a.t - b.t); return api; },
      /** click at t: squash 2f + ripple 12f + click sfx; m.press = element to press (scale .95, 3f yoyo) */
      click(t, m = {}) {
        clicks.push(t); clicks.sort((a, b) => a - b);
        if (m.sfx !== false) X.sfx(t, 'click', { gain: m.gain ?? 0.5 });
        if (m.press) X.tl.fromTo(m.press, { scale: 1 }, { scale: 0.95, duration: 3 * F, yoyo: true, repeat: 1, ease: 'power1.inOut' }, t - F);
        return api;
      },
      /** glide → hover (highlight hoverEl 4–6 f before) → click exactly at tClick. Returns tClick. */
      clickOn(to, tClick, m = {}) {
        const dur = m.dur ?? 0.62, hover = m.hover ?? 0.16;
        api.move(tClick - hover - dur, to, { dur, ease: m.ease, arc: m.arc });
        if (m.hoverEl) X.tl.fromTo(m.hoverEl, { backgroundColor: m.hoverFrom ?? K.css('surface') }, { backgroundColor: m.hoverTo ?? K.css('hover'), duration: 4 * F, ease: 'none' }, tClick - hover);
        api.click(tClick, m);
        return tClick;
      },
    };
    return api;
  };

  // ------------------------------------------------------------------------------------------------ type
  /** Word-by-word kinetic line (Synoptix): each word rises y+14→0 / opacity over 6f at its time; the line slides (8f) to stay
   *  centred; key words are 1.6× in the accent and track in from wide spacing. o: {words, times, y, size, key:[i], keyScale,
   *  weight, color, x (centre), gap} → {el, spans, out(t)} */
  K.kinetic = (parent, o) => {
    const size = o.size ?? 92, keys = new Set(o.key ?? []), ks = o.keyScale ?? 1.6;
    const line = h('div', { style: { position: 'absolute', left: (o.x ?? W / 2) - W / 2, top: (o.y ?? H / 2) - size * 0.62 * (keys.size ? ks : 1), width: W, display: 'flex',
      justifyContent: 'center', alignItems: 'baseline', whiteSpace: 'nowrap', fontFamily: 'var(--font-head)', fontWeight: o.weight ?? 600, fontSize: size,
      letterSpacing: '-0.025em', color: o.color ?? 'var(--text)', lineHeight: 1.2 } }, parent);
    const spans = o.words.map((w, i) => h('span', { text: w, style: { display: 'inline-block', marginRight: i < o.words.length - 1 ? (o.gap ?? 0.26) + 'em' : 0,
      ...(keys.has(i) ? { fontSize: size * ks + 'px', color: o.keyColor ?? 'var(--accent)', fontWeight: o.keyWeight ?? 700, letterSpacing: '-0.035em' } : {}) } }, line));
    const L0 = spans[0].offsetLeft, R = spans.map((s) => s.offsetLeft + s.offsetWidth), full = R.at(-1) - L0;
    const shift = (i) => (full - (R[i] - L0)) / 2;
    gsap.set(spans, { opacity: 0 });
    gsap.set(line, { x: o.recentre === false ? 0 : shift(0) });
    o.words.forEach((w, i) => {
      const t = o.times[i];
      X.tl.fromTo(spans[i], { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 6 * F, ease: 'power3.out' }, t);
      if (keys.has(i)) {
        X.tl.fromTo(spans[i], { letterSpacing: '0.32em', scale: 0.86, transformOrigin: '50% 70%' }, { letterSpacing: '-0.035em', scale: 1, duration: 11 * F, ease: 'power3.out' }, t);
        if (o.sfx !== false) X.sfx(t, 'swoosh', { dur: 0.35, gain: 0.12 });
      }
      if (i && o.recentre !== false) X.tl.fromTo(line, { x: shift(i - 1) }, { x: shift(i), duration: 8 * F, ease: 'power2.out', immediateRender: false }, t);
    });
    return { el: line, spans, out(t, m = {}) { X.tl.to(spans, { opacity: 0, y: m.y ?? -18, duration: m.dur ?? 8 * F, ease: 'power2.in', stagger: m.stagger ?? F }, t); } };
  };
  /** Typewriter line with a blinking caret (Marvin headings, prompts): {text, t, x, y, size, weight, color, cps, caretOff, font} */
  K.typeLine = (parent, o) => {
    const size = o.size ?? 56, cps = o.cps ?? 22;
    const el = h('div', { style: { position: o.x != null ? 'absolute' : 'relative', left: o.x, top: o.y, fontSize: size, fontWeight: o.weight ?? 650, color: o.color ?? 'var(--text)',
      whiteSpace: 'nowrap', letterSpacing: '-0.02em', fontFamily: o.font ?? 'var(--font-head)', lineHeight: 1.15, display: 'flex', alignItems: 'center' } }, parent);
    const txt = h('span', {}, el);
    const caret = h('span', { style: { display: 'inline-block', width: Math.max(2, size * 0.055), height: size * 0.95, marginLeft: size * 0.06, background: o.caretColor ?? 'var(--accent)', borderRadius: 2 } }, el);
    X.typeOn(txt, o.text, o.t, cps);
    const tEnd = o.t + o.text.length / cps, off = o.caretOff ?? tEnd + 1.2;
    X.every((t) => { caret.style.opacity = t < o.t - 0.6 || t > off ? 0 : (t >= o.t && t <= tEnd + 0.1) ? 1 : (Math.floor(t / 0.53) % 2 ? 0 : 1); });
    if (o.sfx !== false) X.sfx(o.t, 'type', { dur: Math.max(0.2, o.text.length / cps), gain: o.gain ?? 0.22 });
    return { el, txt, caret, tEnd };
  };
  /** Random-letter decode (A3 captions): reveals each char at a random moment over dur, scrambling before. */
  K.decode = (el, text, t, o = {}) => {
    const dur = o.dur ?? 0.5, r = X.rand(o.seed ?? text.length * 31), at = [...text].map(() => r() * dur * 0.75), CH = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const p = { v: 0 }; el.textContent = '';
    X.tl.to(p, { v: dur, duration: dur, ease: 'none', onUpdate: () => {
      el.textContent = [...text].map((c, i) => (c === ' ' ? ' ' : p.v >= at[i] + 0.12 ? c : p.v >= at[i] ? CH[(i * 7 + Math.floor(p.v * 30) * 13) % CH.length] : '')).join('');
    } }, t);
    if (o.sfx !== false) X.sfx(t, 'tick', { gain: 0.12 });
  };
  /** Feature heading (A2): typed title on a glass chip + muted sub-label that rises in. {title, sub, t, subT, x, y, size, out} */
  K.headline = (parent, o) => {
    const size = o.size ?? 54;
    const chip = h('div', { cls: 'k-glass', style: { position: 'absolute', left: o.x ?? 96, top: o.y ?? 72, padding: `${size * 0.32}px ${size * 0.5}px ${size * 0.36}px`,
      borderRadius: 26, boxShadow: '0 16px 40px var(--shadow)', display: 'flex', flexDirection: 'column', gap: size * 0.12 + 'px', opacity: 0 } }, parent);
    const tl = K.typeLine(chip, { text: o.title, t: o.t + 6 * F, size, cps: o.cps ?? 24, caretOff: o.caretOff });
    let sub = null;
    if (o.sub) sub = h('div', { text: o.sub, style: { fontSize: size * 0.44, color: 'var(--muted)', fontWeight: 500, whiteSpace: 'nowrap' } }, chip);
    X.tl.fromTo(chip, { opacity: 0, y: 16, scale: 0.97, transformOrigin: '0% 50%' }, { opacity: 1, y: 0, scale: 1, duration: 10 * F, ease: 'expo.out' }, o.t);
    if (sub) X.tl.fromTo(sub, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 10 * F, ease: 'power3.out' }, o.subT ?? tl.tEnd + 0.15);
    if (o.out != null) X.tl.to(chip, { opacity: 0, y: -12, duration: 8 * F, ease: 'power2.in' }, o.out);
    return { el: chip, sub, ...tl };
  };

  // ------------------------------------------------------------------------------------------------ transitions & moves
  /** T2 cascade list build: rows enter from (+dx,+dy) with decaying horizontal motion blur, lower rows later. */
  K.cascade = (rows, t, o = {}) => {
    const dur = o.dur ?? 11 * F, st = o.stagger ?? 2 * F;
    rows.forEach((r, i) => {
      const ti = t + i * st;
      X.tl.fromTo(r, { x: o.dx ?? 220, y: o.dy ?? -60, opacity: 0 }, { x: 0, y: 0, opacity: 1, duration: dur, ease: o.ease ?? 'power3.out' }, ti);
      if (o.blur !== false) {
        const id = uid('mb'), f = X.svg('filter', { id, x: '-20%', y: '-20%', width: '140%', height: '140%' }, X.defs);
        const gb = X.svg('feGaussianBlur', { stdDeviation: '0 0' }, f);
        gsap.set(r, { filter: 'none' });
        X.tl.set(r, { filter: `url(#${id})` }, ti);
        X.tl.fromTo(gb, { attr: { stdDeviation: `${o.blur ?? 14} 0` } }, { attr: { stdDeviation: '0 0' }, duration: dur, ease: 'power2.out' }, ti);
        X.tl.set(r, { filter: 'none' }, ti + dur);
      }
    });
    if (o.sfx !== false) X.sfx(t, o.sfx || 'swoosh', { dur: 0.4, gain: o.gain ?? 0.16 });
    return t + (rows.length - 1) * st + dur;
  };
  /** T3 click-to-swap: hard swap, the new content drifts up 20–40 px over 8–10 f. */
  K.swap = (oldEl, newEl, t, o = {}) => {
    if (oldEl) { X.tl.set(oldEl, { autoAlpha: 0 }, t); }
    gsap.set(newEl, { autoAlpha: 0 });
    X.tl.set(newEl, { autoAlpha: 1 }, t);
    X.tl.fromTo(newEl, { y: o.drift ?? 30 }, { y: 0, duration: o.dur ?? 9 * F, ease: 'power2.out' }, t);
  };
  /** T11 panel unfold: thin tilted bar → mild 3D (rx 10, ry −12) in 15 f, then rotates toward frontal over `settle` s.
   *  Element must sit inside a perspective container (K.plane / K.win wrap). */
  K.unfold = (el, t, o = {}) => {
    const f = o.from ?? { rotationX: 75, scaleY: 0.12, y: 120, opacity: 0 };
    const mid = o.to ?? { rotationX: 10, rotationY: -12, scaleY: 1, y: 0, opacity: 1 };
    const end = o.end ?? { rotationX: 0, rotationY: 0 };
    gsap.set(el, { transformOrigin: o.origin ?? '50% 100%' });
    X.tl.fromTo(el, { rotationY: 0, ...f }, { ...mid, duration: o.dur ?? 15 * F, ease: 'power3.out' }, t);
    X.tl.fromTo(el, { rotationX: mid.rotationX, rotationY: mid.rotationY }, { ...end, duration: o.settle ?? 2.6, ease: 'sine.inOut' }, t + (o.dur ?? 15 * F));
    if (o.sfx !== false) X.sfx(t, 'whoosh', { dur: 0.45, gain: o.gain ?? 0.18 });
  };
  /** T10 3D card flip: rotateY 0→90 (4–5 f), swap content (onMid hides/shows), −90→0 (6–8 f) with slight overshoot. */
  K.flip = (el, t, o = {}) => {
    X.tl.fromTo(el, { rotationY: 0 }, { rotationY: 90, duration: 5 * F, ease: 'power2.in' }, t);
    if (o.hide) X.tl.set(o.hide, { autoAlpha: 0 }, t + 5 * F);
    if (o.show) { gsap.set(o.show, { autoAlpha: 0 }); X.tl.set(o.show, { autoAlpha: 1 }, t + 5 * F); }
    X.tl.fromTo(el, { rotationY: -90 }, { rotationY: 0, duration: 8 * F, ease: 'back.out(1.2)', immediateRender: false }, t + 5 * F);
    if (o.sfx !== false) X.sfx(t, 'swoosh', { dur: 0.3, gain: 0.2 });
  };
  /** T5 iris: circular clip closes on (cx,cy) over 14 f (power2.in). Pair with K.pop of the element that "opens" there. */
  K.iris = (el, t, o = {}) => {
    const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, R = Math.hypot(W, H);
    X.tl.fromTo(el, { clipPath: `circle(${R}px at ${cx}px ${cy}px)` }, { clipPath: `circle(0px at ${cx}px ${cy}px)`, duration: o.dur ?? 14 * F, ease: 'power2.in' }, t);
    if (o.sfx !== false) X.sfx(t, 'zoom_in', { dur: 0.45, gain: 0.18 });
  };
  /** Pop (overshoot only on round things: avatars, icons, hub, CTA). */
  K.pop = (el, t, o = {}) => {
    X.tl.fromTo(el, { scale: o.from ?? 0, opacity: 0, transformOrigin: o.origin ?? '50% 50%' }, { scale: 1, opacity: 1, duration: o.dur ?? 12 * F, ease: o.ease ?? 'back.out(2.2)' }, t);
    if (o.sfx !== false) X.sfx(t, o.sfx || 'pop', { gain: o.gain ?? 0.2, pitch: o.pitch ?? 1 });
  };
  /** Rise-in for cards/panels (no overshoot: they decelerate, expo.out). */
  K.rise = (el, t, o = {}) => {
    X.tl.fromTo(el, { y: o.y ?? 40, opacity: 0, scale: o.scale ?? 1 }, { y: 0, opacity: 1, scale: 1, duration: o.dur ?? 14 * F, ease: o.ease ?? 'expo.out' }, t);
    if (o.sfx) X.sfx(t, o.sfx, { gain: o.gain ?? 0.15 });
  };
  /** T14 card-stack drop: cards drop from −200 px into place one by one (5 f, expo.out). */
  K.stackDrop = (cards, t, o = {}) => {
    cards.forEach((c, i) => {
      const ti = t + i * (o.every ?? 0.5);
      X.tl.fromTo(c, { y: o.dy ?? -200, opacity: 0 }, { y: 0, opacity: 1, duration: o.dur ?? 5 * F, ease: 'expo.out' }, ti);
      if (o.sfx !== false) X.sfx(ti, o.sfx || 'drop', { gain: o.gain ?? 0.22 });
    });
  };
  /** T8 anchor morph in a card: the card keeps its box while content A crossfades to B and it glides to a new spot. */
  K.morphCard = (card, a, b, t, o = {}) => {
    X.tl.to(a, { opacity: 0, duration: 7 * F, ease: 'power2.in' }, t);
    X.tl.fromTo(b, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 10 * F, ease: 'power2.out' }, t + 5 * F);
    if (o.x != null || o.y != null) X.tl.to(card, { x: o.x ?? 0, y: o.y ?? 0, duration: o.dur ?? 14 * F, ease: 'power2.inOut' }, t);
  };
  /** T12 hub-and-orbit. o: {cx, cy, rx, ry, hub (element, positioned by you), items:[{icon,label,tone}], t, speed (deg/s),
   *  size, stagger} → {sats, svg, pulse(i, t), collapse(t, dur), lines}. Satellites: back half smaller (pseudo-3D). */
  K.orbit = (parent, o) => {
    const cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, rx = o.rx ?? 660, ry0 = o.ry ?? 270, n = o.items.length, sz = o.size ?? 104;
    const t0 = o.t, drawDur = o.drawDur ?? 15 * F, st = o.stagger ?? 3 * F, speed = ((o.speed ?? 8) * Math.PI) / 180;
    const sv = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: 'position:absolute;left:0;top:0;overflow:visible;z-index:1' }, parent);
    const ell = svgEl('ellipse', { cx, cy, rx, ry: ry0, fill: 'none', stroke: o.ring ?? 'var(--faint)', 'stroke-width': o.ringW ?? 2.5, 'stroke-dasharray': o.dash ?? 'none', 'stroke-linecap': 'round', opacity: 0 }, sv);
    const lines = [], parts = [];
    const sats = o.items.map((it, i) => {
      const wrap = h('div', { style: { position: 'absolute', left: 0, top: 0, width: sz, height: sz, marginLeft: -sz / 2, marginTop: -sz / 2, zIndex: 3 } }, parent);
      const inner = h('div', { style: { position: 'absolute', inset: 0, borderRadius: sz * 0.26, background: 'var(--surface)', boxShadow: '0 2px 4px var(--shadow-s), 0 16px 36px var(--shadow)',
        display: 'flex', alignItems: 'center', justifyContent: 'center' } }, wrap);
      K.glyph(inner, it.icon, { size: sz * 0.58, tone: it.tone ?? (i % 5) + 1 });
      if (it.label) h('div', { text: it.label, style: { position: 'absolute', top: sz + 12, left: -40, right: -40, textAlign: 'center', fontSize: o.labelSize ?? 19, fontWeight: 600, color: 'var(--muted)' } }, inner);
      lines.push(svgEl('line', { stroke: o.lineColor ?? 'var(--faint)', 'stroke-width': 2, 'stroke-linecap': 'round', opacity: 0 }, sv));
      parts.push(svgEl('circle', { r: 7, fill: 'var(--accent)', opacity: 0 }, sv));
      const ti = (o.satT ?? t0 + drawDur * 0.6) + i * st;
      X.tl.fromTo(inner, { scale: 0, opacity: 0 }, { scale: 1, opacity: 1, duration: 12 * F, ease: 'back.out(1.8)' }, ti);
      if (o.sfx !== false) X.sfx(ti, 'pop', { gain: 0.14, pitch: 0.9 + 0.06 * i });
      return { wrap, inner, a0: o.a0 != null ? o.a0 + (i * 2 * Math.PI) / n : -Math.PI / 2 + (i * 2 * Math.PI) / n, ti };
    });
    if (o.sfx !== false) X.sfx(t0, 'swoosh', { dur: 0.5, gain: 0.14 });
    const pulses = [], col = { t: null, dur: 0.5 }, lineT = o.linesT ?? t0 + drawDur + n * st;
    X.every((T) => {
      let k = 1;
      if (col.t != null && T >= col.t) k = 1 - E('power2.in')(clamp((T - col.t) / col.dur));
      const ry = ry0 * (1 + (o.tilt ?? 0) * Math.sin(Math.max(0, T - t0) * 0.8));
      sats.forEach((s, i) => {
        const a = s.a0 + speed * Math.max(0, T - t0), x = cx + rx * k * Math.cos(a), y = cy + ry * k * Math.sin(a), depth = Math.sin(a);
        const sc = (0.86 + 0.14 * (depth * 0.5 + 0.5)) * (0.35 + 0.65 * k);
        s.wrap.style.transform = `translate(${x.toFixed(2)}px,${y.toFixed(2)}px) scale(${sc.toFixed(4)})`;
        s.wrap.style.zIndex = depth > 0 ? 4 : 2;
        s.wrap.style.opacity = k < 0.25 ? (k / 0.25).toFixed(3) : 1;
        const ln = lines[i], lp = clamp((T - lineT - i * st) / (12 * F));
        const dist = Math.hypot(x - cx, y - cy) || 1, kk = Math.max(0, 1 - (sz * 0.55) / dist);
        const hx = cx + (x - cx) * Math.min(0.24, kk), hy = cy + (y - cy) * Math.min(0.24, kk), ex = cx + (x - cx) * kk, ey = cy + (y - cy) * kk;
        ln.setAttribute('x1', hx.toFixed(1)); ln.setAttribute('y1', hy.toFixed(1));
        ln.setAttribute('x2', lerp(hx, ex, lp).toFixed(1)); ln.setAttribute('y2', lerp(hy, ey, lp).toFixed(1));
        ln.setAttribute('opacity', (lp > 0 ? 0.9 * k : 0).toFixed(3));
        const pp = parts[i]; let vis = 0;
        for (const [pi, pt] of pulses) if (pi === i && T >= pt && T < pt + 0.6) { const q = E('power2.in')((T - pt) / 0.6); pp.setAttribute('cx', lerp(ex, hx, q)); pp.setAttribute('cy', lerp(ey, hy, q)); vis = 1 - q * 0.3; }
        pp.setAttribute('opacity', vis);
      });
      const ep = E('power3.out')(clamp((T - t0) / drawDur));
      ell.setAttribute('opacity', (0.9 * ep * k).toFixed(3));
      ell.setAttribute('rx', (rx * (0.6 + 0.4 * ep) * k).toFixed(1)); ell.setAttribute('ry', (ry * (0.6 + 0.4 * ep) * k).toFixed(1));
    });
    return { sats, svg: sv, ell, lines,
      pulse(i, t) { pulses.push([i, t]); X.tl.fromTo(sats[i].inner, { scale: 1 }, { scale: 1.12, duration: 4 * F, yoyo: true, repeat: 1, ease: 'power2.out' }, t); X.sfx(t, 'blip_up', { gain: 0.12 }); },
      collapse(t, dur = 0.5) { col.t = t; col.dur = dur; X.sfx(t, 'zoom_in', { dur: dur + 0.1, gain: 0.2 }); },
    };
  };
  /** T6 logo-matte zoom. The two mark halves slide in from opposite corners at `scale` (power2.in, 5 f), the mark shrinks
   *  to 1× (12 f, expo.out) while a plate in the ground colour closes in around it: the old scene shows only through the
   *  mark's window, then disappears (hide: element(s) hidden at +16 f). The plate lifts (12 f) to reveal the background.
   *  o: {t, at:[x,y] (mark centre, screen), size (final height px), scale, hide, spark, plate} → {svg, g, move(t,{at,size,dur,ease}), hideAt(t)} */
  K.logoMatte = (parent, o) => {
    const id = uid('mm'), t0 = o.t, S0 = o.scale ?? 5, u = (o.size ?? 150) / K.MARK.H;
    const sv = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: `position:absolute;left:0;top:0;overflow:visible;z-index:${o.z ?? 25}` }, parent);
    const defs = svgEl('defs', {}, sv);
    const mask = svgEl('mask', { id, maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, defs);
    svgEl('rect', { x: -10, y: -10, width: W + 20, height: H + 20, fill: '#fff' }, mask);
    const mwin = svgEl('path', { d: K.MARK.WIN, fill: '#000' }, mask);
    const plate = svgEl('rect', { x: -10, y: -10, width: W + 20, height: H + 20, mask: `url(#${id})`, opacity: 0, style: `fill:${o.plate ?? 'var(--bg)'}` }, sv);
    const g = svgEl('g', {}, sv);
    g.innerHTML = K.markSVG({ size: K.MARK.H, spark: o.spark !== false }).replace(/^<svg[^>]*>/, '').replace(/<\/svg>\s*$/, '');
    const Lp = g.querySelector('.k-mL'), Rp = g.querySelector('.k-mR'), Sp = g.querySelector('.k-mS');
    const init = { at: o.at ?? [W / 2, H / 2], size: o.size ?? 150 };
    const moves = [];
    let hidden = null;
    const placeAt = (T) => {
      let st = init;
      for (const m of moves) {
        if (m.t > T) break;
        const p = m.ease(clamp((T - m.t) / m.dur));
        st = { at: [lerp(m.from.at[0], m.at[0], p), lerp(m.from.at[1], m.at[1], p)], size: lerp(m.from.size, m.size, p) };
      }
      return st;
    };
    const slide = (o.slide ?? 5) * F, shrink = (o.shrink ?? 12) * F, dir = o.dir ?? [1, 0.62];
    X.every((T) => {
      const pl = placeAt(T), uu = pl.size / K.MARK.H;
      let S = 1, off = 0, plateOp = 0;
      if (T < t0) { sv.style.display = 'none'; return; }
      sv.style.display = hidden != null && T >= hidden ? 'none' : '';
      if (T < t0 + slide) { S = S0; off = 1 - E('power2.in')((T - t0) / slide); plateOp = 0; }
      else if (T < t0 + slide + shrink) { const p = (T - t0 - slide) / shrink; S = lerp(S0, 1, E('expo.out')(p)); plateOp = clamp(p / 0.45); }
      else { S = 1; plateOp = 1 - clamp((T - t0 - slide - shrink - 2 * F) / (12 * F)); }
      const tr = `translate(${pl.at[0].toFixed(2)},${(pl.at[1] - K.MARK.CY * uu).toFixed(2)}) scale(${(uu * S).toFixed(5)})`;
      g.setAttribute('transform', tr); mwin.setAttribute('transform', tr);
      const ox = off * 260 * dir[0], oy = off * 260 * dir[1];
      Lp.setAttribute('transform', `translate(${-ox},${-oy})`); Rp.setAttribute('transform', `translate(${ox},${oy})`);
      plate.setAttribute('opacity', plateOp.toFixed(3));
    });
    if (o.hide) X.tl.set(o.hide, { autoAlpha: 0 }, t0 + slide + shrink * 0.9);
    if (Sp) { gsap.set(Sp, { scale: 0, transformOrigin: '50% 50%' }); X.tl.fromTo(Sp, { scale: 0, rotation: -60 }, { scale: 1, rotation: 0, duration: 12 * F, ease: 'back.out(2.4)' }, t0 + slide + shrink); }
    if (o.sfx !== false) { X.sfx(t0, 'whoosh', { dur: 0.4, gain: 0.3 }); X.sfx(t0 + slide + shrink, 'sparkle', { dur: 0.7, gain: 0.22 }); }
    const api = { svg: sv, g, L: Lp, R: Rp, S: Sp, tLand: t0 + slide + shrink,
      /** add moves in time order: glide the landed mark to {at, size} over dur */
      move(t, m) { const prev = moves.length ? moves.at(-1) : init; moves.push({ t, from: { at: prev.at, size: prev.size }, at: m.at ?? prev.at, size: m.size ?? prev.size, dur: m.dur ?? 0.6, ease: E(m.ease ?? 'power3.inOut') }); return api; },
      hideAt(t) { hidden = t; return api; },
    };
    return api;
  };
  /** T7 blob/glow wipe: a radial glow grows from a corner to fill the frame (8 f), holds (10 f), recedes (12 f). */
  K.blobWipe = (parent, o) => {
    const t = o.t, c = o.color ?? 'var(--blob-a)', [x, y] = o.from ?? [0, H];
    const el = h('div', { style: { position: 'absolute', left: x - 700, top: y - 700, width: 1400, height: 1400, borderRadius: '50%', zIndex: o.z ?? 26,
      background: `radial-gradient(circle, ${c} 0%, ${c} 40%, transparent 70%)`, opacity: 0, transformOrigin: '50% 50%' } }, parent);
    X.tl.fromTo(el, { scale: 0.6, opacity: 0, x: 0, y: 0 }, { scale: 3.4, opacity: 1, x: W / 2 - x, y: H / 2 - y, duration: 8 * F, ease: 'power2.in' }, t);
    X.tl.to(el, { scale: 1.2, opacity: 0, x: 0, y: 0, duration: 12 * F, ease: 'power2.out' }, t + 18 * F);
    if (o.hide) X.tl.to(o.hide, { opacity: 0, filter: 'blur(12px)', duration: 8 * F }, t);
    if (o.sfx !== false) X.sfx(t, 'woosh_low', { dur: 0.7, gain: 0.3 });
    return t + 8 * F + 10 * F; // = moment to swap scenes underneath
  };
  /** T13 speed burst: 70 radial streaks fly outward (expo.out ~30 f). */
  K.burst = (parent, o) => {
    const t = o.t, cx = o.cx ?? W / 2, cy = o.cy ?? H / 2, n = o.n ?? 70, r = X.rand(o.seed ?? 5);
    const sv = svgEl('svg', { viewBox: `0 0 ${W} ${H}`, width: W, height: H, style: `position:absolute;left:0;top:0;z-index:${o.z ?? 24}` }, parent);
    const ls = Array.from({ length: n }, () => ({ a: r() * Math.PI * 2, w: 2 + r() * 4, sp: 0.6 + r() * 0.8, el: svgEl('line', { stroke: o.color ?? 'var(--accent2)', 'stroke-linecap': 'round', opacity: 0 }, sv) }));
    ls.forEach((l) => l.el.setAttribute('stroke-width', l.w));
    X.every((T) => {
      const p = (T - t) / (o.dur ?? 1.0);
      ls.forEach((l) => {
        if (p < 0 || p > 1) { l.el.setAttribute('opacity', 0); return; }
        const e = E('expo.out')(p), r0 = 80 + 1200 * e * l.sp, r1 = r0 + 60 + 260 * (1 - e) * l.sp;
        l.el.setAttribute('x1', cx + Math.cos(l.a) * r0); l.el.setAttribute('y1', cy + Math.sin(l.a) * r0);
        l.el.setAttribute('x2', cx + Math.cos(l.a) * r1); l.el.setAttribute('y2', cy + Math.sin(l.a) * r1);
        l.el.setAttribute('opacity', (0.7 * (1 - p)).toFixed(3));
      });
    });
    if (o.sfx !== false) X.sfx(t, 'whoosh', { dur: 0.6, gain: 0.25 });
  };
  /** T16 logo glint: a 4-point sparkle flares and shrinks (8–10 f) + soft bloom. */
  K.glint = (parent, o) => {
    const s = o.size ?? 90;
    const el = h('div', { style: { position: 'absolute', left: o.x - s / 2, top: o.y - s / 2, width: s, height: s, zIndex: o.z ?? 27, opacity: 0 },
      html: `<svg viewBox="-50 -50 100 100" width="${s}" height="${s}"><circle r="22" fill="#fff" opacity=".55" filter="blur(6px)"/><path d="M0,-50 L6,-6 L50,0 L6,6 L0,50 L-6,6 L-50,0 L-6,-6 Z" fill="#fff"/></svg>` }, parent);
    X.tl.fromTo(el, { opacity: 0, scale: 0.2, rotation: -30 }, { opacity: 1, scale: 1.25, rotation: 0, duration: 4 * F, ease: 'power2.out' }, o.t);
    X.tl.to(el, { opacity: 0, scale: 0.1, rotation: 25, duration: 8 * F, ease: 'expo.out' }, o.t + 4 * F);
    if (o.sfx !== false) X.sfx(o.t, 'chime', { dur: 0.6, gain: 0.16 });
  };
  /** Fly an element (screen space) to a point computed lazily at the end time (e.g. a camera-world target). */
  K.flyTo = (el, t, dur, target, o = {}) => {
    const st = { x0: null };
    const ease = E(o.ease ?? 'power3.inOut');
    X.every((T) => {
      if (T < t) { el.style.translate = ''; el.style.scale = ''; return; }
      const [tx, ty, ts = 1] = typeof target === 'function' ? target(t + dur) : target;
      const p = ease(clamp((T - t) / dur));
      const [x0, y0] = o.from;
      el.style.translate = `${lerp(0, tx - x0, p).toFixed(2)}px ${lerp(0, ty - y0, p).toFixed(2)}px`;
      el.style.scale = lerp(1, ts, p).toFixed(4);
    });
    if (o.sfx !== false) X.sfx(t, o.sfx || 'swoosh', { dur: Math.min(0.6, dur), gain: 0.18 });
  };
})();
