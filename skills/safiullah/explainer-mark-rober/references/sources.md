# Sources analysed — Mark Rober

Measured with `explainer-engine/engine/qa/analyze_video.py` (cuts = ffmpeg scene score > 0.33; motion = mean grey change at 6 fps; anim = flat-shaded share).

| video | uploader | listed by | dur | cuts/min | median shot s | motion | hold | anim | colourful | bright | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [Glitter Bomb 1.0 vs Porch Pirates](https://www.youtube.com/watch?v=xoxhDk-hwuo) | Mark Rober | vidpros | 490 s | 15.91 | 2.42 | 9.37 | 0.156 | 0.361 | 32.7 | 0.388 | 168.1 | -13.1 |
| [Egg Drop From Space](https://www.youtube.com/watch?v=BYVZh5kqaFg) | Mark Rober | vidpros | 1616 s | 22.09 | 1.92 | 14.48 | 0.066 | 0.321 | 41.3 | 0.528 | 194.8 | -15.1 |

## Graphics-only measurements (the layer this skill rebuilds)

Whole-video numbers above are dominated by live build footage. The same motion/hold method applied only to the
animated inserts (6 fps, 160×90 grey, hold = frame diff < 0.4):

| insert | t | motion | hold |
|---|---|---|---|
| Egg drop — "whole plan" mission profile | 0:44.5–1:08.5 | 3.25 | 0.22 |
| Egg drop — terminal-velocity figure → "120 MPH" | 1:21–1:35 | 1.32 | 0.25 |
| Egg drop — atmosphere strip | 3:09–3:14 | 6.05 | 0.76 |
| Egg drop — rocket stack comparison | 17:44–17:53 | 1.79 | 0.53 |
| Glitter bomb — map chase (incl. live cut-ins) | 4:38–5:09 | 6.88 | 0.57 |
| Glitter bomb — CAD orbit flurry | 1:10–1:13 | 24.19 | 0.00 |
| Glitter bomb — camera-coverage cone | 2:21.5–2:23.8 | 0.68 | 0.77 |
| **all graphics pooled** | | **4.85** | **0.41** |

Cut rate inside graphics: 9.3–12.5 / min (analysis §3); graphic shots ≈ 4 s.

## Source-list issue

- **ZKbv4cnVa3c** ("Saving Our Oceans With a LEGO Machine") was listed by the vidpros article as a Mark Rober video,
  but its uploader/channel is **RJMBricks** (UCwsvtU88eu2-fqQhTqrbwWw), a small creator's TeamSeas fan entry in a
  meme-edit style. It is excluded from this skill. Use another build video from Rober's own channel if a third
  source is wanted.
