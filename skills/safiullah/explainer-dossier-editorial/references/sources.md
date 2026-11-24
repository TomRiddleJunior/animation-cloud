# Sources analysed — Dossier-editorial

Measured with `explainer-engine/engine/qa/analyze_video.py` (cuts = ffmpeg scene score > 0.33; motion = mean grey change at 6 fps; anim = flat-shaded share).

| video | uploader | listed by | dur | cuts/min | median shot s | motion | hold | anim | colourful | bright | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [Archer/张狗剩🎄 - 放一段本周给「正确君」做的节目节选，从头到尾依然只用了 Claude 加 HyperFram](https://x.com/goshenggo/status/2114927236335972357) | Archer/张狗剩 (@goshenggo), for 正确君 | user (X post) | 96 s | 3.77 | 2.23 | 7.56 | 0.002 | 0.095 | 23.0 | 0.776 | 10.1 | -17.1 |

Notes
- 95 s music-only excerpt of a 正确君 programme (France: Gen Z protests → public debt), posted on X 2026-10-27; the post says
  it was made "from start to finish only with Claude + HyperFrames" (an HTML→video renderer).
- `scene_changes_per_min` 9.42 (median scene 3.5 s) is the pacing target; `cuts_per_min` counts only the word-card montage.
- `anim` 0.095 and `WPM` 10.1 are artefacts (paper texture defeats the flat-shading detector; Whisper hallucinated on music).
- Frame-accurate strips used for the analysis: `samples/dossier-editorial/scratch/src/s01…s21_*.jpg`.
