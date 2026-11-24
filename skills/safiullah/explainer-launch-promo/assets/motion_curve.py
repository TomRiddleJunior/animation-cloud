"""motion_curve.py <video> — per-second motion (same metric as the QA analyzer: mean grey diff at 6 fps, 160x90)."""
import os, shutil, subprocess, sys, numpy as np
FF = os.environ.get('FFMPEG_PATH') or shutil.which('ffmpeg') or 'ffmpeg'  # or the engine's node_modules/ffmpeg-static
p = subprocess.Popen([FF, '-v', 'error', '-i', sys.argv[1], '-an', '-vf', 'fps=6,scale=160:90:flags=area,format=gray', '-f', 'rawvideo', '-'], stdout=subprocess.PIPE)
fr = []
while True:
    b = p.stdout.read(160 * 90)
    if len(b) < 160 * 90: break
    fr.append(np.frombuffer(b, np.uint8).astype(np.int16))
d = [0.0] + [float(np.abs(fr[i] - fr[i - 1]).mean()) for i in range(1, len(fr))]
d = np.array(d)
print('mean', d.mean().round(2))
for s in range(0, len(d) // 6):
    seg = d[s * 6:(s + 1) * 6]
    print(f"{s:3d}s {seg.mean():6.2f} " + '#' * int(seg.mean()))
