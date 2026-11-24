# Reference study

The aim is to learn how a professional film was made well enough to rebuild its craft with original assets. Work from measurements, then from looking.

## Measure

```bash
node templates/tools/refstudy.cjs ref.mp4 --out study/ref
```

It writes, into the output folder:

- `probe.json`: duration, size, frame rate, codecs.
- `cuts.json`: detected cut times and the shot lengths between them.
- `contact.jpg`: the whole film at even intervals.
- `shots/shot-NNN.jpg`: one frame from the middle of every shot.
- `palette.png`: the dominant colours.
- `loudness.txt`: integrated loudness and true peak.
- `summary.md`: shot count, median and shortest shot, cuts per 10 seconds.

The same thing by hand:

```bash
# cut detection: prints the time of every frame whose scene score passes 0.3
ffmpeg -hide_banner -i ref.mp4 -vf "select='gt(scene,0.3)',showinfo" -an -f null - 2>&1 | grep pts_time
# overall shape
ffmpeg -i ref.mp4 -vf "fps=2/3,scale=384:-1,tile=6x4" -frames:v 1 contact.jpg
# motion detail: 12 frames across 4 s from a chosen moment
ffmpeg -ss 5 -i ref.mp4 -t 4 -vf "fps=3,scale=480:-1,tile=4x3" -frames:v 1 motion.jpg
# frame-by-frame at a transition (every frame for 1 s)
ffmpeg -ss 7.5 -i ref.mp4 -t 1 -vf "scale=384:-1,tile=6x5" -frames:v 1 transition.jpg
# dominant palette
ffmpeg -i ref.mp4 -vf "fps=1,scale=160:-1,palettegen=max_colors=8:stats_mode=full" -frames:v 1 palette.png
# sound: loudness, and a spectrogram to see hits and the music's shape
ffmpeg -hide_banner -i ref.mp4 -af ebur128=peak=true -f null - 2> loudness.txt
ffmpeg -i ref.mp4 -lavfi "showspectrumpic=s=1600x400:legend=0" spectrum.png
```

Lower the scene threshold (0.15 to 0.25) for films that dissolve or morph instead of cutting; a film with continuous transitions has few detected cuts, and that is itself a finding.

## Look, and write down

Per reference, fill this in. Numbers where possible.

**Structure**
- Length, frame rate, aspect ratio.
- Beat sheet: what each section does (hook, problem, product, proof, close) and when it starts.
- Shot count, median shot length, the longest hold and what it holds on.
- When the product first appears, when the name first appears, how long the end card holds.

**Picture**
- Source types present: authored 2D, 3D render, screen capture, live action, gameplay, generated.
- Depth: flat, layered 2.5D, true 3D. Where 3D appears and what it is used for.
- Palette: background, ink, one or two accents, as hex from the frames. How much of the frame is empty.
- Texture: clean, grain, paper, halftone, glow, blur. Lighting if 3D: soft or hard, where the key is, reflections.
- Type: family class (grotesque, serif, mono), weights, largest size as a share of frame height, case, how text enters (by word, by line, masked, typed), how long it holds.
- UI treatment: real capture or redrawn, how much chrome is removed, zoom level, cursor behaviour.

**Motion**
- Entrance and exit style, typical duration in frames, whether anything overshoots.
- Camera: locked, slow push, orbit, whip. Whether moves ease.
- Transitions: name each one (hard cut on beat, match cut, morph, mask wipe, zoom-through, whip pan).
- What carries across each cut: an object, a colour, a direction of motion, a sound.
- Motion blur: present or not.

**Sound**
- Voice, music-led, or effects only. Tempo if music-led, and whether cuts land on beats.
- The effects vocabulary: whooshes, clicks, hits, risers; where silence is used.
- Loudness.

**What makes it good**
Two or three sentences. Usually it is restraint: few colours, one idea per shot, long holds after fast moves, sound that confirms motion.

## Turn the study into a build plan

| Reference element | Our version | Engine | Needs |
|---|---|---|---|

Example from a fintech ad with a white stage, word-by-word headlines, tilted icon tiles, an app dock over a rendered meadow, typed chat input and spinning coins:

| Reference element | Our version | Engine | Needs |
|---|---|---|---|
| Word-by-word headline on white | Same device, client's font and words | Canvas or DOM | Font files |
| Tilted icon tiles in an arc | Client's own feature icons on rounded tiles, staggered arc entrance | three.js in capture loop, or Blender | Icon SVGs |
| Rendered landscape behind an app dock | An original 3D plate or a generated still with slow parallax; real app icons only with permission | Blender, or generated image plus depth parallax | GPU or budget; source decision from the brief |
| Typed message, send, reply cards | Client's real UI redrawn at large scale | Canvas or DOM | UI captures for accuracy |
| Spinning gold coins around a headline | Original coin model with the client's mark, transparent frames over the type | Blender Cycles | Render time measured |
| Logo end card | Client logo, 2 s hold | Canvas | Logo SVG |

## What belongs to the reference

Its artwork, footage, characters, music, voice, logo, exact layouts and exact wording. Borrow structure, pacing, devices, finish and standards. If the request can only be met by copying, stop and say so.

## Reference types and what to take from each

- **Product ad (motion design):** beat structure, type rhythm, how 3D inserts are rationed, the end card.
- **Illustrated or character piece:** line quality, texture, palette per scene, how scenes change (colour wipe, iris, hard cut), frame rate (often 12 or 24 fps, drawn on twos).
- **Event sizzle or live action:** shot length, the order of wide, medium and detail, movement inside shots, how energy rises and where it rests.
- **Gameplay and listicles:** segment structure, title and number cards, HUD-safe composition, how long each clip earns.
