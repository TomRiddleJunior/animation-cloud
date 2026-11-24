"""Per-frame change profile at native fps.

usage: python framediff.py <video> <out_prefix> [thr_px=24] [swap_frac=0.004]
Writes <out_prefix>_diff.csv (t, mean_abs, frac_changed) and prints:
- share of frames that are exact holds (frac_changed == 0)
- cadence: how often a change happens (runs of identical frames -> on ones/twos/threes)
- 'events': frames whose changed fraction exceeds swap_frac, merged into events (start, dur, peak)
"""
import sys
import cv2
import numpy as np

vid, pre = sys.argv[1], sys.argv[2]
thr = int(sys.argv[3]) if len(sys.argv) > 3 else 24
swap = float(sys.argv[4]) if len(sys.argv) > 4 else 0.004
cap = cv2.VideoCapture(vid)
fps = cap.get(cv2.CAP_PROP_FPS)
prev = None
rows = []
i = 0
while True:
    ok, fr = cap.read()
    if not ok:
        break
    g = cv2.cvtColor(cv2.resize(fr, (320, 180), interpolation=cv2.INTER_AREA), cv2.COLOR_BGR2GRAY).astype(np.int16)
    if prev is not None:
        d = np.abs(g - prev)
        rows.append((i / fps, float(d.mean()), float((d > thr).mean())))
    prev = g
    i += 1
arr = np.array(rows)
np.savetxt(pre + "_diff.csv", arr, delimiter=",", fmt="%.4f", header="t,mean_abs,frac_changed")
fc = arr[:, 2]
print(f"fps={fps:.3f} frames={len(arr)+1} dur={len(arr)/fps:.1f}s")
print(f"exact-hold frames (frac==0): {np.mean(fc == 0):.3f}; frames frac<0.0005: {np.mean(fc < 0.0005):.3f}")
# cadence: lengths of runs of 'no change' between changes
ch = fc > 0.0005
runs = []
run = 0
for c in ch:
    if c:
        runs.append(run + 1)
        run = 0
    else:
        run += 1
runs = np.array(runs)
if len(runs):
    vals, cnts = np.unique(np.clip(runs, 1, 6), return_counts=True)
    print("frames per drawing (gap between changes, clipped at 6):", dict(zip(vals.tolist(), cnts.tolist())))
# events
ev = []
inev = False
for k, (t, m, f) in enumerate(arr):
    if f > swap and not inev:
        inev = True; s = k; peak = f; n = 1
    elif f > swap and inev:
        peak = max(peak, f); n += 1
    elif inev:
        inev = False; ev.append((arr[s, 0], n, peak))
if inev:
    ev.append((arr[s, 0], n, peak))
print(f"events (frac>{swap}): {len(ev)}  -> {len(ev)/(arr[-1,0]/60):.1f}/min")
single = [e for e in ev if e[1] <= 2]
print(f"  of which 1-2 frame events (swaps/cuts): {len(single)}")
durs = np.array([e[1] for e in ev])
if len(durs):
    print(f"  event length frames: median {np.median(durs):.0f}, p10 {np.percentile(durs,10):.0f}, p90 {np.percentile(durs,90):.0f}")
with open(pre + "_events.txt", "w") as fh:
    for e in ev:
        fh.write(f"{e[0]:8.2f}s  {e[1]:4d}f  peak {e[2]:.3f}\n")
