# Sources — Data-cards (vertical investigation data reel)

The style was built from frame-by-frame analysis of one Instagram reel (analysed locally for reference only;
nothing from it is reused in the skill or the sample). Analysis: `references/analysis.md`.

| field | value |
|---|---|
| reel | https://www.instagram.com/reel/De690_AsmTt/ |
| account | fidato_09 (outlet brand "FIDATO", knight-and-red-sun logo) |
| format | 720×1280 (9:16), 30 fps, VP9, 94.6 s |
| likes (2026-10-27) | 274 |
| audio | "Hotel Pools · Time" — licensed track under a male voice-over |
| caption hook | a rhetorical what-if hook |
| what it is about | an "INVESTIGATION" reel summarising a University of Toronto Citizen Lab report (October 2026) on an Israeli spyware-linked advertising operation: 139 M suspicious ad bids involving Pakistan out of ~4 billion analysed, Yemen most exposed (457 M), the Controlium platform linked to Candiru, an account named "Pindi", ~200,000 sites reached, Google cutting the firm's ad-exchange access, no confirmed Pakistani infections, ending on "exposed or targeted?" |

## Key measurements (engine `qa/analyze_video.py`)

| metric | value |
|---|---|
| hard cuts / min | 0 |
| scene changes / min · median scene | 1.27 · 32.7 s (only the dark insert registers) |
| cards (counted by hand) | 16 in 94.6 s (one per ~5.9 s) |
| motion mean / p90 | 1.57 / 4.84 |
| hold_frac | 0.594 |
| flat_mean | 0.689 |
| colourfulness · saturation · brightness | 23.8 · 0.131 · 0.843 |
| palette (k-means) | `#e6ddca` 39 % · `#e9e2d1` 28 % · `#e1d5c2` 18 % · `#181818` 5.5 % · `#925031` 2.9 % · `#faf9f9` 2.8 % · `#a0988a` 2.6 % |
| loudness · silence | −14.1 LUFS · 3.7 s (end card) |
| WPM | 112.9 overall (178 Whisper words), ~130 while speaking |
