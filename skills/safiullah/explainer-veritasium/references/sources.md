# Sources analysed — Veritasium

Measured with `explainer-engine/engine/qa/analyze_video.py` (cuts = ffmpeg scene score > 0.33; motion = mean grey change at 6 fps; anim = flat-shaded share).

| video | uploader | listed by | dur | cuts/min | median shot s | motion | hold | anim | colourful | bright | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| [Once you understand game theory, you understand the world.](https://www.youtube.com/watch?v=mScpHTIi-kM) | Veritasium | vidpros | 1638 s | 8.79 | 4.09 | 6.46 | 0.191 | 0.408 | 50.3 | 0.534 | 160.0 | -13.4 |
| [The Biggest Misconception About Electricity](https://www.youtube.com/watch?v=bHIhgxav9LY) | Veritasium | vidpros | 888 s | 5.41 | 4.17 | 5.17 | 0.119 | 0.486 | 30.7 | 0.386 | 165.6 | -15.9 |
| [Google Maps is unreasonably fast. Let me explain](https://www.youtube.com/watch?v=kS-CGkiPetQ) | Veritasium | vidpros | 1794 s | 7.46 | 3.34 | 6.72 | 0.301 | 0.577 | 35.6 | 0.401 | 179.0 | -15.3 |

## Animation-block measurements (same analyzer, run on the lecture-block time ranges only)
Whole-video numbers above mix in presenter / live footage. For an animation-only insert, compare against the blocks:

| block | look | dur | cuts/min | scene changes/min | motion | hold | colourful | bright |
|---|---|---|---|---|---|---|---|---|
| Electricity 6:02–8:26 | B glow sim on black | 144 s | 0.42 | 0.42 | 3.17 | 0.209 | 28.5 | 0.168 |
| Electricity 3:46–5:00 (mixed live + wave inserts) | B + live | 74 s | 5.68 | 5.68 | 4.33 | 0.056 | 54.6 | 0.350 |
| Game theory 7:32–9:12 | A retro game-show | 100 s | 4.80 | 5.40 | 3.21 | 0.333 | 98.9 | 0.728 |

(Google Maps kS-CGkiPetQ: only captions were downloaded, so its blocks could not be re-measured.)

## Source-list issue
`2Vrhk5OjBP8` ("I bought 1000 meters of wire to settle a physics debate") is **AlphaPhoenix**, not Veritasium
(uploader metadata, an "ALPHA PHOENIX" title card, and the presenter crediting Veritasium's video at 0:24.8). It is listed
under Veritasium by the vidpros article and in `sources.json`; it was excluded from this skill's targets.
