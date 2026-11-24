/* Evidence plates for the "day of two noons" sample — every "photo" is an original illustration in SVG that
 * VK.photo() turns into a graded photograph or a halftone print. No real photos, no scraped images.
 * Each builder returns {svg, ...anchor points} for a 1920×1080 (or stated) frame. Only system fonts inside. */
(function () {
  const EV = (window.EV = {});
  const SERIF = "Georgia, 'Times New Roman', serif";
  const f = (v) => (+v).toFixed(1);
  const ROMAN = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];

  /** Clock dial (face, chapter rings, minute ticks, radial Roman numerals). */
  EV.dial = (cx, cy, r, o = {}) => {
    const ink = o.ink ?? '#2B2724', face = o.face ?? '#EFE8D6';
    let s = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${face}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.965)}" fill="none" stroke="${ink}" stroke-width="${f(r * 0.03)}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.86)}" fill="none" stroke="${ink}" stroke-width="${f(r * 0.011)}"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${f(r * 0.775)}" fill="none" stroke="${ink}" stroke-width="${f(r * 0.009)}"/>`;
    for (let i = 0; i < 60; i++) {
      const a = (i * 6 * Math.PI) / 180, big = i % 5 === 0, r1 = r * 0.86, r2 = big ? r * 0.765 : r * 0.8;
      s += `<line x1="${f(cx + Math.sin(a) * r1)}" y1="${f(cy - Math.cos(a) * r1)}" x2="${f(cx + Math.sin(a) * r2)}" y2="${f(cy - Math.cos(a) * r2)}" stroke="${ink}" stroke-width="${f(big ? r * 0.022 : r * 0.009)}"/>`;
    }
    const nr = r * (o.numR ?? 0.63), fs = r * (o.numSize ?? 0.17);
    ROMAN.forEach((n, i) => {
      const a = (i * 30 * Math.PI) / 180, x = cx + Math.sin(a) * nr, y = cy - Math.cos(a) * nr;
      s += `<text x="${f(x)}" y="${f(y)}" text-anchor="middle" dominant-baseline="central" font-family="${SERIF}" font-size="${f(fs)}" fill="${ink}" transform="rotate(${i * 30} ${f(x)} ${f(y)})">${n}</text>`;
    });
    return s;
  };
  /** Static hands (for plates). h, m = time; L = radius. */
  EV.hands = (cx, cy, L, h, m, o = {}) => {
    const ink = o.ink ?? '#1E1B18', am = m * 6, ah = (h % 12) * 30 + m * 0.5;
    const mh = `M${-L * 0.035},${L * 0.16} L${-L * 0.02},${-L * 0.8} L0,${-L * 0.86} L${L * 0.02},${-L * 0.8} L${L * 0.035},${L * 0.16}Z`;
    const hh = `M${-L * 0.05},${L * 0.12} L${-L * 0.03},${-L * 0.42} L${-L * 0.075},${-L * 0.47} L0,${-L * 0.57} L${L * 0.075},${-L * 0.47} L${L * 0.03},${-L * 0.42} L${L * 0.05},${L * 0.12}Z`;
    return `<g transform="translate(${cx} ${cy})" fill="${ink}"><path d="${hh}" transform="rotate(${ah})"/><path d="${mh}" transform="rotate(${am})"/><circle r="${f(L * 0.06)}"/></g>`;
  };

  const blurDef = (id, s) => `<filter id="${id}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="${s}"/></filter>`;
  const grimeDef = (id, fx, fy, seed, a = 1.4, b = -0.5, rgb = [0.22, 0.18, 0.13]) =>
    `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="4" seed="${seed}"/>` +
    `<feColorMatrix type="matrix" values="0 0 0 0 ${rgb[0]}  0 0 0 0 ${rgb[1]}  0 0 0 0 ${rgb[2]}  ${a} 0 0 0 ${b}"/></filter>`;

  // ------------------------------------------------------------------ 1. clock tower, low angle, blue sky (colour)
  EV.tower = () => {
    const xl = (y) => 662 + (1080 - y) * 0.028, xr = (y) => 924 - (1080 - y) * 0.018, xs = (y) => 1000 - (1080 - y) * 0.05;
    const cx = 789, cy = 446, r = 108;
    let s = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5F8DBC"/><stop offset="0.55" stop-color="#9FBFD8"/><stop offset="1" stop-color="#E4DCCB"/></linearGradient>
      <radialGradient id="sun" cx="0.12" cy="0.08" r="0.6"><stop offset="0" stop-color="#FFF7E2" stop-opacity="0.75"/><stop offset="1" stop-color="#FFF7E2" stop-opacity="0"/></radialGradient>
      <linearGradient id="front" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#E2D0AE"/><stop offset="1" stop-color="#BBA585"/></linearGradient>
      <linearGradient id="side" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#8A7962"/><stop offset="1" stop-color="#6E5F4C"/></linearGradient>
      <linearGradient id="roofF" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5E746C"/><stop offset="1" stop-color="#7D9189"/></linearGradient>
      <radialGradient id="faceG" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#F6F0E0"/><stop offset="1" stop-color="#DCD1B8"/></radialGradient>
      ${blurDef('b28', 28)}${blurDef('b14', 13)}${blurDef('b3', 2.6)}${blurDef('b6', 6)}
      ${grimeDef('grime', 0.012, 0.05, 3, 1.5, -0.52)}
      <clipPath id="tw"><path d="M${xl(1080)},1080 L${xl(150)},150 L${xs(150)},150 L${xs(1080)},1080Z"/><path d="M${xl(600) - 22},600 L${xl(290) - 22},290 L${xs(290) + 6},290 L${xs(600) + 6},600Z"/><path d="M688,138 L958,138 L822,6Z"/></clipPath>
    </defs>`;
    s += `<rect width="1920" height="1080" fill="url(#sky)"/><rect width="1920" height="1080" fill="url(#sun)"/>`;
    // clouds
    s += `<g filter="url(#b28)" fill="#FFFFFF">`;
    for (const [x, y, rx, ry, o] of [[1380, 190, 330, 64, 0.85], [1640, 300, 260, 52, 0.7], [1240, 250, 180, 40, 0.6], [330, 150, 290, 58, 0.75], [1150, 420, 220, 36, 0.45], [1760, 120, 190, 42, 0.6], [470, 330, 160, 30, 0.4]])
      s += `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" opacity="${o}"/>`;
    s += `</g>`;
    // birds
    for (const [x, y, k] of [[1290, 340, 1], [1335, 318, 0.8], [1372, 356, 0.7]])
      s += `<path d="M${x - 14 * k},${y - 4 * k} q${7 * k},${-7 * k} ${14 * k},${4 * k} q${7 * k},${-11 * k} ${14 * k},${-4 * k}" fill="none" stroke="#2D3540" stroke-width="2.5"/>`;
    // distant spire + rooftops (slightly out of focus)
    s += `<g filter="url(#b3)"><path d="M1560,1080 L1560,700 L1578,640 L1590,520 L1602,640 L1620,700 L1620,1080Z" fill="#8E8A84"/>`;
    s += `<path d="M1080,1080 L1080,905 L1180,860 L1290,905 L1290,880 L1460,880 L1460,850 L1520,820 L1580,850 L1700,850 L1700,890 L1920,890 L1920,1080Z" fill="#9C9081"/>`;
    for (let x = 1110; x < 1900; x += 46) for (let y = 925; y < 1060; y += 54) s += `<rect x="${x}" y="${y}" width="20" height="30" fill="#5F574C" opacity="0.8"/>`;
    s += `<path d="M1080,905 L1180,860 L1290,905Z" fill="#6F665A"/></g>`;
    // tower body
    s += `<path d="M${xr(1080)},1080 L${xr(150)},150 L${xs(150)},150 L${xs(1080)},1080Z" fill="url(#side)"/>`;
    s += `<path d="M${xl(1080)},1080 L${xl(150)},150 L${xr(150)},150 L${xr(1080)},1080Z" fill="url(#front)"/>`;
    for (let y = 1060; y > 160; y -= 34) s += `<line x1="${f(xl(y))}" y1="${y}" x2="${f(xs(y))}" y2="${y}" stroke="#3B2F22" stroke-opacity="0.13" stroke-width="2"/>`;
    for (let y = 1060, k = 0; y > 620; y -= 34, k++) for (let x = 690 + (k % 2) * 34; x < 900; x += 68) s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y - 34}" stroke="#3B2F22" stroke-opacity="0.08" stroke-width="2"/>`;
    // windows (front pair + small, side slits)
    const arch = (x, y0, y1, w) => `M${x - w / 2},${y1} L${x - w / 2},${y0 + w / 2} A${w / 2},${w / 2} 0 0 1 ${x + w / 2},${y0 + w / 2} L${x + w / 2},${y1}Z`;
    for (const x of [752, 830]) {
      s += `<path d="${arch(x, 690, 868, 54)}" fill="#8C7B62"/><path d="${arch(x, 697, 862, 42)}" fill="#25262B"/>`;
      s += `<line x1="${x}" y1="705" x2="${x}" y2="862" stroke="#6C6152" stroke-width="3"/><line x1="${x - 21}" y1="780" x2="${x + 21}" y2="780" stroke="#6C6152" stroke-width="3"/>`;
      s += `<path d="${arch(x - 9, 702, 760, 14)}" fill="#7C8FA3" opacity="0.35"/>`;
    }
    s += `<path d="${arch(791, 950, 1040, 40)}" fill="#8C7B62"/><path d="${arch(791, 956, 1040, 30)}" fill="#25262B"/>`;
    for (const y of [700, 960]) s += `<rect x="${f(xr(y) + 22)}" y="${y}" width="12" height="90" fill="#3B342C"/>`;
    // clock stage block
    const sl = (y) => xl(y) - 22, sr = (y) => xr(y) + 8, ss = (y) => xs(y) + 6;
    s += `<path d="M${sr(600)},600 L${sr(290)},290 L${ss(290)},290 L${ss(600)},600Z" fill="url(#side)"/>`;
    s += `<path d="M${sl(600)},600 L${sl(290)},290 L${sr(290)},290 L${sr(600)},600Z" fill="url(#front)"/>`;
    s += `<rect x="${cx - 140}" y="${cy - 140}" width="280" height="280" fill="#B19D7E"/>`;
    s += `<path d="M${cx - 140},${cy + 140} V${cy - 140} H${cx + 140}" fill="none" stroke="#6E5E48" stroke-width="7"/><path d="M${cx + 140},${cy - 140} V${cy + 140} H${cx - 140}" fill="none" stroke="#E4D5BA" stroke-width="5"/>`;
    for (const [dx, dy] of [[-1, -1], [1, -1], [-1, 1], [1, 1]]) s += `<circle cx="${cx + dx * 116}" cy="${cy + dy * 116}" r="11" fill="#8E7C61"/><circle cx="${cx + dx * 116 - 2}" cy="${cy + dy * 116 - 2}" r="6" fill="#CDBB99"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${r + 14}" fill="#2D2925"/>`;
    s += EV.dial(cx, cy, r, { face: 'url(#faceG)' });
    // cornices
    const cornice = (y, ext) => `<path d="M${f(xl(y) - ext)},${y} L${f(xr(y) + ext * 0.4)},${y} L${f(xr(y) + ext * 0.4)},${y + 20} L${f(xl(y) - ext)},${y + 20}Z" fill="#E8DABF"/>` +
      `<path d="M${f(xr(y) + ext * 0.4)},${y} L${f(xs(y) + ext * 0.3)},${y} L${f(xs(y) + ext * 0.3)},${y + 20} L${f(xr(y) + ext * 0.4)},${y + 20}Z" fill="#8F7E66"/>` +
      `<rect x="${f(xl(y) - ext * 0.5)}" y="${y + 20}" width="${f(xs(y) - xl(y) + ext)}" height="12" fill="#000" opacity="0.22"/>`;
    s += cornice(600, 30) + cornice(272, 34) + cornice(136, 26);
    // belfry
    s += `<path d="M${f(xr(150) - 6)},272 L${f(xr(150) - 6)},156 L${f(xs(150) - 8)},156 L${f(xs(150) - 8)},272Z" fill="url(#side)"/>`;
    s += `<path d="M${f(xl(150) + 14)},272 L${f(xl(150) + 14)},156 L${f(xr(150) - 6)},156 L${f(xr(150) - 6)},272Z" fill="url(#front)"/>`;
    for (const x of [758, 842]) {
      s += `<path d="${arch(x, 172, 266, 56)}" fill="#1D1C20"/>`;
      for (let y = 206; y < 264; y += 11) s += `<line x1="${x - 26}" y1="${y}" x2="${x + 26}" y2="${y + 3}" stroke="#55504A" stroke-width="3"/>`;
    }
    // roof + finial
    s += `<path d="M688,138 L905,138 L822,6Z" fill="url(#roofF)"/><path d="M905,138 L958,138 L822,6Z" fill="#43514D"/>`;
    for (let k = 1; k < 7; k++) { const t = k / 7; s += `<line x1="${f(688 + (822 - 688) * t)}" y1="${f(138 - 132 * t)}" x2="${f(905 + (822 - 905) * t)}" y2="${f(138 - 132 * t)}" stroke="#33403C" stroke-opacity="0.35" stroke-width="2"/>`; }
    s += `<line x1="822" y1="8" x2="822" y2="-40" stroke="#2C302E" stroke-width="5"/><circle cx="822" cy="-8" r="9" fill="#2C302E"/>`;
    // grime over the stone
    s += `<g clip-path="url(#tw)"><rect x="560" y="0" width="460" height="1080" filter="url(#grime)" opacity="0.8"/></g>`;
    // foreground foliage (out of focus) + haze
    s += `<g filter="url(#b14)">`;
    const R = (() => { let a = 9; return () => ((a = (a * 16807) % 2147483647) / 2147483647); })();
    for (let i = 0; i < 34; i++) s += `<circle cx="${f(R() * 470 - 40)}" cy="${f(760 + R() * 360)}" r="${f(40 + R() * 70)}" fill="${['#2C3A29', '#3B4E33', '#25301F', '#4A5E3B'][i % 4]}"/>`;
    for (let i = 0; i < 12; i++) s += `<circle cx="${f(1700 + R() * 300)}" cy="${f(980 + R() * 160)}" r="${f(40 + R() * 60)}" fill="${['#2C3A29', '#3B4E33'][i % 2]}"/>`;
    s += `</g>`;
    return { svg: s, clock: { cx, cy, r } };
  };

  // ------------------------------------------------------------------ 2. the same clock, close-up (colour)
  EV.face = () => {
    const cx = 960, cy = 540, R = 392;
    let s = `<defs>
      <radialGradient id="faceG" cx="0.4" cy="0.35" r="0.75"><stop offset="0" stop-color="#F5EFDF"/><stop offset="0.8" stop-color="#E2D8C0"/><stop offset="1" stop-color="#CDBF9F"/></radialGradient>
      <linearGradient id="light" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF6E0" stop-opacity="0.22"/><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.32"/></linearGradient>
      ${grimeDef('grime', 0.006, 0.02, 7, 1.5, -0.5)}${grimeDef('grime2', 0.02, 0.02, 11, 1.2, -0.62, [0.3, 0.25, 0.16])}
      <clipPath id="dc"><circle cx="${cx}" cy="${cy}" r="${R}"/></clipPath>
    </defs>`;
    s += `<rect width="1920" height="1080" fill="#BFA988"/>`;
    for (let y = -30, k = 0; y < 1100; y += 150, k++) {
      s += `<line x1="0" y1="${y}" x2="1920" y2="${y}" stroke="#5E4E3A" stroke-opacity="0.35" stroke-width="4"/>`;
      for (let x = (k % 2) * 160; x < 1920; x += 320) s += `<line x1="${x}" y1="${y}" x2="${x}" y2="${y + 150}" stroke="#5E4E3A" stroke-opacity="0.3" stroke-width="4"/>`;
    }
    s += `<rect x="${cx - 500}" y="${cy - 500}" width="1000" height="1000" fill="#A9936F"/>`;
    s += `<path d="M${cx - 500},${cy + 500} V${cy - 500} H${cx + 500}" fill="none" stroke="#DCCBA8" stroke-width="10"/><path d="M${cx + 500},${cy - 500} V${cy + 500} H${cx - 500}" fill="none" stroke="#6B5A42" stroke-width="14"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R + 66}" fill="#8A765A"/><circle cx="${cx}" cy="${cy}" r="${R + 50}" fill="#CBB792"/><circle cx="${cx}" cy="${cy}" r="${R + 30}" fill="#2A2622"/>`;
    for (let i = 0; i < 36; i++) { const a = (i * 10 * Math.PI) / 180; s += `<circle cx="${f(cx + Math.sin(a) * (R + 16))}" cy="${f(cy - Math.cos(a) * (R + 16))}" r="5" fill="#57504A"/>`; }
    s += EV.dial(cx, cy, R, { face: 'url(#faceG)', numSize: 0.155 });
    s += `<rect width="1920" height="1080" filter="url(#grime)" opacity="0.55"/>`;
    s += `<g clip-path="url(#dc)"><rect width="1920" height="1080" filter="url(#grime2)" opacity="0.22"/></g>`;
    s += `<rect width="1920" height="1080" fill="url(#light)"/>`;
    return { svg: s, clock: { cx, cy, r: R } };
  };

  // ------------------------------------------------------------------ 3. pocket watch on a desk (colour)
  EV.watch = () => {
    const cx = 1010, cy = 600, R = 360;
    let s = `<defs>
      <linearGradient id="wood" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5A3A22"/><stop offset="1" stop-color="#26170D"/></linearGradient>
      <radialGradient id="pool" cx="0.53" cy="0.52" r="0.55"><stop offset="0" stop-color="#FFD9A0" stop-opacity="0.32"/><stop offset="1" stop-color="#FFD9A0" stop-opacity="0"/></radialGradient>
      <radialGradient id="gold" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stop-color="#FBE6B0"/><stop offset="0.45" stop-color="#D2AC5E"/><stop offset="0.85" stop-color="#8C6729"/><stop offset="1" stop-color="#5C421A"/></radialGradient>
      <linearGradient id="bezel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF0C4"/><stop offset="0.5" stop-color="#C79A48"/><stop offset="1" stop-color="#7A5822"/></linearGradient>
      <radialGradient id="enamel" cx="0.45" cy="0.4" r="0.7"><stop offset="0" stop-color="#FBF9F3"/><stop offset="1" stop-color="#E4DED0"/></radialGradient>
      ${grimeDef('grain', 0.0025, 0.09, 5, 1.6, -0.6, [0.12, 0.07, 0.03])}${blurDef('b4', 4)}${blurDef('b9', 9)}${blurDef('b30', 30)}${blurDef('b16', 16)}
    </defs>`;
    s += `<rect width="1920" height="1080" fill="url(#wood)"/><g transform="rotate(-9 960 540)"><rect x="-300" y="-300" width="2520" height="1680" filter="url(#grain)"/></g>`;
    s += `<rect width="1920" height="1080" fill="url(#pool)"/>`;
    // chain (far links blurred)
    const P = [[cx, cy - R - 120], [cx - 210, cy - R - 300], [cx - 700, cy - R - 60], [-80, cy - 140]];
    const bez = (t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); };
    let near = '', far = '';
    for (let i = 0; i < 46; i++) {
      const t = i / 45, [x, y] = bez(t), [x2, y2] = bez(Math.min(1, t + 0.01)), a = (Math.atan2(y2 - y, x2 - x) * 180) / Math.PI;
      const link = i % 2 ? `<ellipse cx="${f(x)}" cy="${f(y)}" rx="19" ry="4.5" fill="#B48C3E" transform="rotate(${f(a)} ${f(x)} ${f(y)})"/>`
        : `<ellipse cx="${f(x)}" cy="${f(y)}" rx="18" ry="10" fill="none" stroke="#D3AF60" stroke-width="6" transform="rotate(${f(a)} ${f(x)} ${f(y)})"/>`;
      if (t < 0.35) near += link; else far += link;
    }
    s += `<g filter="url(#b9)" opacity="0.9">${far}</g><g filter="url(#b4)">${near}</g>`;
    // shadow, bow, crown, case
    s += `<ellipse cx="${cx + 40}" cy="${cy + 60}" rx="${R + 20}" ry="${R + 10}" fill="#000" opacity="0.55" filter="url(#b30)"/>`;
    s += `<circle cx="${cx}" cy="${cy - R - 118}" r="58" fill="none" stroke="url(#bezel)" stroke-width="15"/>`;
    s += `<rect x="${cx - 26}" y="${cy - R - 66}" width="52" height="52" rx="8" fill="url(#bezel)"/>`;
    for (let x = cx - 22; x <= cx + 22; x += 6) s += `<line x1="${x}" y1="${cy - R - 62}" x2="${x}" y2="${cy - R - 18}" stroke="#7A5822" stroke-width="2"/>`;
    s += `<rect x="${cx - 16}" y="${cy - R - 20}" width="32" height="30" fill="#B18A40"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R}" fill="url(#gold)"/><circle cx="${cx}" cy="${cy}" r="${R - 16}" fill="none" stroke="url(#bezel)" stroke-width="20"/>`;
    s += `<circle cx="${cx}" cy="${cy}" r="${R - 30}" fill="#6E5020"/>`;
    s += EV.dial(cx, cy, R - 34, { face: 'url(#enamel)', ink: '#1F1D1B', numR: 0.66, numSize: 0.16 });
    s += `<circle cx="${cx}" cy="${cy + 165}" r="58" fill="none" stroke="#1F1D1B" stroke-width="2"/>`;
    for (let i = 0; i < 12; i++) { const a = (i * 30 * Math.PI) / 180; s += `<line x1="${f(cx + Math.sin(a) * 58)}" y1="${f(cy + 165 - Math.cos(a) * 58)}" x2="${f(cx + Math.sin(a) * 48)}" y2="${f(cy + 165 - Math.cos(a) * 48)}" stroke="#1F1D1B" stroke-width="2"/>`; }
    s += `<line x1="${cx}" y1="${cy + 165}" x2="${cx + 30}" y2="${cy + 128}" stroke="#2B3E6B" stroke-width="3"/>`;
    s += EV.hands(cx, cy, R - 40, 11, 57, { ink: '#22345E' });
    // glass reflections
    s += `<path d="M${cx - 250},${cy - 120} A${R - 60},${R - 60} 0 0 1 ${cx + 60},${cy - 290}" fill="none" stroke="#fff" stroke-width="38" stroke-linecap="round" opacity="0.18" filter="url(#b16)"/>`;
    s += `<ellipse cx="${cx - 150}" cy="${cy - 190}" rx="60" ry="26" fill="#fff" opacity="0.35" transform="rotate(-38 ${cx - 150} ${cy - 190})" filter="url(#b9)"/>`;
    return { svg: s };
  };

  // ------------------------------------------------------------------ 4. 4-4-0 locomotive at a platform (newsprint halftone)
  EV.loco = () => {
    let s = `<defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E4E4E4"/><stop offset="1" stop-color="#C9C9C9"/></linearGradient>
      <linearGradient id="boil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5A5A5A"/><stop offset="0.25" stop-color="#C4C4C4"/><stop offset="0.42" stop-color="#7A7A7A"/><stop offset="1" stop-color="#2E2E2E"/></linearGradient>
      ${blurDef('b30', 30)}${blurDef('b8', 8)}${blurDef('b3', 3)}
    </defs>`;
    s += `<rect width="1920" height="1080" fill="url(#sky)"/>`;
    // distant trees + station shed
    s += `<g filter="url(#b8)"><path d="M0,640 Q120,560 240,610 Q360,540 500,600 Q640,530 780,590 L780,760 L0,760Z" fill="#8F8F8F"/>`;
    s += `<path d="M1500,760 L1500,520 L1720,440 L1940,520 L1940,760Z" fill="#9D9D9D"/><path d="M1480,525 L1720,430 L1960,525" fill="none" stroke="#707070" stroke-width="16"/>`;
    for (let x = 1530; x < 1920; x += 70) s += `<rect x="${x}" y="580" width="34" height="60" fill="#6A6A6A"/>`;
    s += `</g>`;
    // steam / smoke
    s += `<g filter="url(#b30)" fill="#F4F4F4">`;
    for (const [x, y, r] of [[600, 330, 110], [700, 250, 150], [860, 190, 180], [1060, 150, 170], [1260, 140, 150], [480, 380, 70]]) s += `<circle cx="${x}" cy="${y}" r="${r}"/>`;
    s += `</g><g filter="url(#b30)" fill="#B0B0B0" opacity="0.6"><circle cx="780" cy="230" r="80"/><circle cx="980" cy="190" r="90"/></g>`;
    // rails + sleepers + platform edge
    s += `<rect x="0" y="842" width="1920" height="238" fill="#9A9A9A"/>`;
    for (let x = -20; x < 1940; x += 46) s += `<rect x="${x}" y="846" width="30" height="16" fill="#5C5C5C"/>`;
    s += `<rect x="0" y="838" width="1920" height="8" fill="#3A3A3A"/>`;
    s += `<path d="M0,1080 L0,930 L1920,900 L1920,1080Z" fill="#BDBDBD"/><path d="M0,930 L1920,900" stroke="#EDEDED" stroke-width="10"/>`;
    // tender
    s += `<path d="M1380,585 L1720,585 L1730,600 L1730,790 L1370,790 L1370,600Z" fill="#4A4A4A"/><rect x="1380" y="600" width="340" height="22" fill="#A8A8A8"/><rect x="1395" y="640" width="310" height="120" fill="none" stroke="#8A8A8A" stroke-width="6"/>`;
    s += `<path d="M1395,585 Q1550,545 1705,585Z" fill="#202020"/>`;
    for (const x of [1440, 1530, 1600, 1690]) s += `<circle cx="${x}" cy="800" r="40" fill="#262626"/><circle cx="${x}" cy="800" r="30" fill="#9C9C9C"/><circle cx="${x}" cy="800" r="10" fill="#333"/>`;
    // cab
    s += `<rect x="1130" y="440" width="230" height="350" fill="#464646"/><rect x="1130" y="440" width="18" height="350" fill="#8C8C8C"/><path d="M1110,440 L1380,440 L1372,420 L1118,420Z" fill="#1A1A1A"/>`;
    s += `<rect x="1160" y="480" width="70" height="90" fill="#E2E2E2"/><rect x="1260" y="480" width="70" height="90" fill="#E2E2E2"/>`;
    s += `<line x1="1195" y1="480" x2="1195" y2="570" stroke="#2A2A2A" stroke-width="5"/><line x1="1295" y1="480" x2="1295" y2="570" stroke="#2A2A2A" stroke-width="5"/>`;
    // boiler + smokebox
    s += `<rect x="540" y="560" width="600" height="150" fill="url(#boil)"/>`;
    for (const x of [640, 760, 880, 1000, 1110]) s += `<rect x="${x}" y="560" width="10" height="150" fill="#9C9C9C" opacity="0.7"/>`;
    s += `<rect x="470" y="548" width="90" height="174" rx="8" fill="#333"/><rect x="478" y="556" width="14" height="158" fill="#7C7C7C"/>`;
    // domes, bell, stack, headlamp
    s += `<path d="M770,562 L770,520 Q800,488 830,520 L830,562Z" fill="#555"/><path d="M950,562 L950,530 Q975,505 1000,530 L1000,562Z" fill="#4A4A4A"/>`;
    s += `<path d="M872,560 L872,540 Q885,515 898,540 L898,560Z" fill="#7A7A7A"/>`;
    s += `<path d="M575,560 L560,470 L520,420 L520,388 L680,388 L680,420 L640,470 L625,560Z" fill="#383838"/><path d="M580,555 L568,470 L532,424 L532,392 L556,392 L556,420 L590,470 L598,555Z" fill="#8E8E8E"/><rect x="510" y="378" width="180" height="16" fill="#3E3E3E"/>`;
    s += `<rect x="470" y="470" width="96" height="78" fill="#2C2C2C"/><rect x="458" y="486" width="22" height="46" fill="#D8D8D8"/><path d="M470,470 L566,470 L548,452 L488,452Z" fill="#1A1A1A"/>`;
    // pilot (cowcatcher)
    s += `<path d="M500,722 L560,722 L560,836 L360,836Z" fill="#262626"/>`;
    for (let k = 0; k < 7; k++) s += `<line x1="${560 - k * 14}" y1="${722 + k * 2}" x2="${380 + k * 26}" y2="836" stroke="#7E7E7E" stroke-width="5"/>`;
    // running board, frame
    s += `<rect x="560" y="710" width="580" height="16" fill="#151515"/><rect x="560" y="726" width="820" height="28" fill="#222"/>`;
    // leading truck + drivers
    for (const x of [640, 760]) s += `<circle cx="${x}" cy="792" r="48" fill="#262626"/><circle cx="${x}" cy="792" r="38" fill="#ABABAB"/><circle cx="${x}" cy="792" r="14" fill="#1E1E1E"/>`;
    for (const x of [910, 1090]) {
      s += `<circle cx="${x}" cy="722" r="120" fill="#262626"/><circle cx="${x}" cy="722" r="104" fill="#C2C2C2"/>`;
      for (let k = 0; k < 16; k++) { const a = (k * 22.5 * Math.PI) / 180; s += `<line x1="${x}" y1="722" x2="${f(x + Math.cos(a) * 102)}" y2="${f(722 + Math.sin(a) * 102)}" stroke="#3A3A3A" stroke-width="9"/>`; }
      s += `<path d="M${x - 70},${722 + 70} A100,100 0 0 0 ${x + 70},${722 + 70} L${x},722Z" fill="#202020"/><circle cx="${x}" cy="722" r="26" fill="#2A2A2A"/>`;
    }
    s += `<rect x="900" y="760" width="200" height="16" rx="8" fill="#3A3A3A"/><rect x="700" y="735" width="230" height="18" rx="9" fill="#444"/>`;
    s += `<rect x="590" y="700" width="120" height="58" rx="10" fill="#2C2C2C"/>`;
    // foreground platform figures (blurred)
    s += `<g filter="url(#b3)" fill="#2A2A2A"><path d="M1780,1080 L1790,760 Q1830,720 1870,760 L1880,1080Z"/><circle cx="1830" cy="720" r="34"/><rect x="1796" y="650" width="68" height="62"/><rect x="1782" y="700" width="96" height="10"/></g>`;
    return { svg: s };
  };

  // ------------------------------------------------------------------ 5. station hall with one clock per railroad (colour, warm)
  /** 19th-century traveller silhouette; (x,y) = feet. */
  const person = (x, y, h, o = {}) => {
    const u = h / 100, c = o.c ?? '#2A231D';
    let p = `<g transform="translate(${f(x)} ${f(y)}) scale(${f(u)})" fill="${c}">`;
    p += `<ellipse cx="0" cy="-87" rx="6.5" ry="7.8"/>`;
    if (o.hat === 'top') p += `<rect x="-6.5" y="-113" width="13" height="18" rx="1"/><rect x="-10.5" y="-97" width="21" height="3.2" rx="1.5"/>`;
    else if (o.hat === 'bowler') p += `<path d="M-7.5,-93 A7.5,8.5 0 0 1 7.5,-93Z"/><rect x="-10.5" y="-94.5" width="21" height="2.8" rx="1.4"/>`;
    else if (o.hat === 'bonnet') p += `<path d="M-9.5,-84 Q-10,-101 0,-101 Q10,-101 9.5,-84 Q0,-90 -9.5,-84Z"/>`;
    if (o.dress) p += `<path d="M-11,-80 Q0,-84 11,-80 L12,-52 Q14,-40 27,0 L-27,0 Q-14,-40 -12,-52Z"/>`;
    else p += `<path d="M-13,-79 Q0,-83 13,-79 L16,-44 L14,-16 L-14,-16 L-16,-44Z"/><rect x="-10" y="-17" width="8" height="17"/><rect x="2" y="-17" width="8" height="17"/>`;
    if (o.bag) p += `<rect x="13" y="-38" width="16" height="13" rx="2"/>`;
    return p + `</g>`;
  };
  EV.person = person;
  EV.station = () => {
    const clocks = [{ cx: 560, cy: 372, r: 84, h: 12, m: 19 }, { cx: 960, cy: 352, r: 94, h: 12, m: 0 }, { cx: 1360, cy: 372, r: 84, h: 11, m: 48 }];
    let s = `<defs>
      <linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9B595"/><stop offset="1" stop-color="#A38E70"/></linearGradient>
      <linearGradient id="floor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9C8A70"/><stop offset="1" stop-color="#4E4134"/></linearGradient>
      <linearGradient id="glass" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF8E6"/><stop offset="1" stop-color="#E9D9B5"/></linearGradient>
      <linearGradient id="gate" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2B2520"/><stop offset="1" stop-color="#5E5242"/></linearGradient>
      <radialGradient id="faceG" cx="0.42" cy="0.38" r="0.7"><stop offset="0" stop-color="#FBF5E6"/><stop offset="1" stop-color="#E0D4BA"/></radialGradient>
      ${blurDef('b24', 24)}${blurDef('b12', 11)}${blurDef('b5', 5)}${blurDef('b2', 1.8)}
      ${grimeDef('grime', 0.004, 0.012, 21, 1.3, -0.5, [0.25, 0.2, 0.14])}
    </defs>`;
    s += `<rect width="1920" height="800" fill="url(#wall)"/>`;
    // lunette window
    s += `<path d="M520,250 A440,330 0 0 1 1400,250Z" fill="#7B6A54"/><path d="M548,250 A412,305 0 0 1 1372,250Z" fill="url(#glass)"/>`;
    for (let k = 1; k < 8; k++) { const a = Math.PI - (k * Math.PI) / 8; s += `<line x1="960" y1="250" x2="${f(960 + Math.cos(a) * 412)}" y2="${f(250 - Math.sin(a) * 305)}" stroke="#6E5D47" stroke-width="7"/>`; }
    s += `<path d="M700,250 A260,190 0 0 1 1220,250" fill="none" stroke="#6E5D47" stroke-width="7"/><rect x="500" y="244" width="920" height="20" fill="#8A775D"/>`;
    // side windows
    for (const x of [140, 1640]) { s += `<rect x="${x}" y="70" width="140" height="300" fill="#7B6A54"/><rect x="${x + 12}" y="82" width="116" height="276" fill="url(#glass)" opacity="0.9"/><line x1="${x + 70}" y1="82" x2="${x + 70}" y2="358" stroke="#6E5D47" stroke-width="6"/><line x1="${x + 12}" y1="220" x2="${x + 128}" y2="220" stroke="#6E5D47" stroke-width="6"/>`; }
    // frieze board + clocks + name boards
    s += `<rect x="300" y="276" width="1320" height="200" fill="#5A4430"/><rect x="300" y="276" width="1320" height="10" fill="#7D6448"/><rect x="300" y="468" width="1320" height="10" fill="#3A2B1E"/>`;
    for (const c of clocks) {
      s += `<circle cx="${c.cx}" cy="${c.cy}" r="${c.r + 18}" fill="#3A2B1E"/><circle cx="${c.cx}" cy="${c.cy}" r="${c.r + 10}" fill="#B08D4E"/>`;
      s += EV.dial(c.cx, c.cy, c.r, { face: 'url(#faceG)', numSize: 0.19 }) + EV.hands(c.cx, c.cy, c.r, c.h, c.m);
      s += `<rect x="${c.cx - 150}" y="${c.cy + 118}" width="300" height="56" fill="#2E4A3C"/><rect x="${c.cx - 150}" y="${c.cy + 118}" width="300" height="56" fill="none" stroke="#B59B5E" stroke-width="3"/>`;
      for (let k = 0; k < 9; k++) s += `<rect x="${c.cx - 118 + k * 27}" y="${c.cy + 136}" width="${16 + (k * 7) % 6}" height="20" fill="#D9C38A" opacity="0.75" filter="url(#b2)"/>`;
    }
    // pilasters + gates
    for (const x of [300, 760, 1160, 1620]) s += `<rect x="${x - 34}" y="476" width="68" height="330" fill="#B8A383"/><rect x="${x - 34}" y="476" width="14" height="330" fill="#D5C3A2"/><rect x="${x + 22}" y="476" width="12" height="330" fill="#8A765A"/>`;
    for (const g of [{ x: 530, w: 300 }, { x: 960, w: 330 }, { x: 1390, w: 300 }]) {
      const x0 = g.x - g.w / 2, x1 = g.x + g.w / 2, top = 600;
      s += `<path d="M${x0},806 L${x0},${top} A${g.w / 2},${g.w / 2.6} 0 0 1 ${x1},${top} L${x1},806Z" fill="url(#gate)"/>`;
      s += `<path d="M${x0 + 30},806 L${x0 + 60},700 L${x1 - 60},700 L${x1 - 30},806Z" fill="#CDB98F" opacity="0.55" filter="url(#b12)"/>`;
    }
    s += `<rect x="830" y="660" width="260" height="90" fill="#1F1B17" opacity="0.85" filter="url(#b5)"/><rect x="850" y="672" width="40" height="30" fill="#BFAE86" opacity="0.6" filter="url(#b5)"/><rect x="910" y="672" width="40" height="30" fill="#BFAE86" opacity="0.6" filter="url(#b5)"/>`;
    // floor with perspective joints + reflections
    s += `<rect y="800" width="1920" height="280" fill="url(#floor)"/>`;
    for (let k = -14; k <= 14; k++) s += `<line x1="${960 + k * 40}" y1="800" x2="${960 + k * 190}" y2="1080" stroke="#2E261E" stroke-opacity="0.25" stroke-width="2"/>`;
    for (const y of [826, 862, 912, 980, 1068]) s += `<line x1="0" y1="${y}" x2="1920" y2="${y}" stroke="#2E261E" stroke-opacity="0.22" stroke-width="2"/>`;
    s += `<g filter="url(#b12)" opacity="0.25"><rect x="380" y="806" width="300" height="140" fill="#2B2520"/><rect x="795" y="806" width="330" height="160" fill="#2B2520"/><rect x="1240" y="806" width="300" height="140" fill="#2B2520"/></g>`;
    s += `<rect width="1920" height="1080" filter="url(#grime)" opacity="0.6"/>`;
    // light shafts from the lunette
    s += `<g filter="url(#b24)" fill="#FFF1D2" opacity="0.2"><path d="M700,250 L860,250 L1060,1080 L760,1080Z"/><path d="M1010,250 L1160,250 L1420,1080 L1150,1080Z"/></g>`;
    // travellers: midground, then out-of-focus foreground
    const mid = [[250, 900, 175, { hat: 'top', bag: 1 }], [380, 880, 160, { hat: 'bonnet', dress: 1, c: '#3A2A2E' }], [455, 884, 166, { hat: 'bowler' }], [700, 870, 150, { hat: 'top' }],
      [780, 872, 146, { hat: 'bonnet', dress: 1, c: '#2E3A33' }], [1060, 868, 148, { hat: 'bowler', bag: 1 }], [1180, 878, 158, { hat: 'top' }], [1260, 874, 150, { hat: 'bonnet', dress: 1, c: '#40302A' }],
      [1500, 890, 168, { hat: 'bowler' }], [1585, 896, 172, { hat: 'top' }], [1680, 902, 180, { hat: 'bonnet', dress: 1, c: '#352B25' }]];
    s += `<g filter="url(#b2)">` + mid.map(([x, y, h, o]) => person(x, y, h, o)).join('') + `</g>`;
    s += `<g filter="url(#b12)">${person(120, 1240, 640, { hat: 'top', c: '#1C1714' })}${person(1830, 1260, 600, { hat: 'bonnet', dress: 1, c: '#241A18' })}</g>`;
    return { svg: s, clocks };
  };

  // ------------------------------------------------------------------ 6. columned government building (mono, square)
  EV.portico = () => {
    let s = `<defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#B9BEC4"/><stop offset="1" stop-color="#E8E8E6"/></linearGradient>
      <linearGradient id="col" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A9A96"/><stop offset="0.35" stop-color="#F0EFEA"/><stop offset="1" stop-color="#8E8E8A"/></linearGradient>${blurDef('b6', 6)}</defs>`;
    s += `<rect width="800" height="800" fill="url(#sky)"/>`;
    s += `<g filter="url(#b6)" fill="#5A5E58"><circle cx="40" cy="560" r="120"/><circle cx="140" cy="600" r="90"/><circle cx="760" cy="560" r="120"/><circle cx="670" cy="610" r="90"/></g>`;
    s += `<rect x="90" y="300" width="620" height="380" fill="#D6D4CE"/>`;
    for (let x = 120; x < 700; x += 70) if (x < 250 || x > 540) for (const y of [340, 450, 560]) s += `<rect x="${x}" y="${y}" width="30" height="60" fill="#4E504E"/>`;
    s += `<path d="M230,330 L400,230 L570,330Z" fill="#E6E4DE"/><path d="M262,322 L400,244 L538,322Z" fill="#BDBBB4"/><rect x="220" y="330" width="360" height="30" fill="#F2F0EA"/>`;
    for (let k = 0; k < 6; k++) { const x = 250 + k * 60; s += `<rect x="${x}" y="360" width="36" height="270" fill="url(#col)"/><rect x="${x - 6}" y="356" width="48" height="12" fill="#F4F2EC"/><rect x="${x - 6}" y="624" width="48" height="12" fill="#CFCDC6"/>`; }
    s += `<rect x="236" y="360" width="328" height="270" fill="#3E403E" opacity="0.35"/>`;
    for (let k = 0; k < 5; k++) s += `<rect x="${200 - k * 14}" y="${636 + k * 16}" width="${400 + k * 28}" height="16" fill="${k % 2 ? '#C9C7C0' : '#E2E0DA'}"/>`;
    s += `<rect y="716" width="800" height="84" fill="#9FA19B"/>`;
    return { svg: s };
  };
})();
