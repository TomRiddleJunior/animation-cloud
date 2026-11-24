"""Fit Kokoro speed per line group so each group fits its bar window (88 BPM grid). Iterative: run after each TTS pass.
usage: python fit_speed.py <project>"""
import json, sys
from pathlib import Path
P = Path(sys.argv[1]); s = json.loads((P/'script.json').read_text(encoding='utf-8')); vo = json.loads((P/'data/vo.json').read_text(encoding='utf-8'))
dur = {l['id']: l['end'] - l['start'] for l in vo['lines']}
groups = []
for ln in s['lines']:
    if 'at' in ln or not groups: groups.append([ln])
    else: groups[-1].append(ln)
worst = 0
for gi, g in enumerate(groups):
    t0 = g[0]['at']; t1 = groups[gi+1][0]['at'] - 0.05 if gi + 1 < len(groups) else t0 + g[0].get('win', 5.4)
    avail = (t1 - t0) - 0.21 * len(g) - sum(ln.get('gap', s.get('gap', 0.35)) for ln in g[1:])
    speech = sum(dur[ln['id']] for ln in g)
    cur = g[0].get('speed', s.get('speed', 1.0))
    ratio = speech / avail
    new = max(1.0, min(1.35, cur * (ratio if ratio > 1 else (1 + (ratio - 1) * 0.7))))
    for ln in g: ln['speed'] = round(new, 3)
    worst = max(worst, ratio)
    print(f"{g[0]['id']:>4} avail {avail:5.2f} speech {speech:5.2f} ratio {ratio:.3f}  speed {cur:.3f} -> {new:.3f}")
(P/'script.json').write_text(json.dumps(s, indent=1, ensure_ascii=False), encoding='utf-8')
print('worst ratio', round(worst, 3))
