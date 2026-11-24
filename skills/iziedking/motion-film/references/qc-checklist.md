# QC checklist

`node render.cjs qc` (canvas films) or `node templates/finish/finish.cjs qc <file>` (any film) produces the measured part. The rest is a look, frame by frame. Run QC on every delivered cut, not only the master.

## Measured (must all pass)

- [ ] Dimensions, frame rate, codec and pixel format match the brief and the platform (default 1920x1080, 30/1, H.264, yuv420p, AAC 48 kHz).
- [ ] Colour tags present: primaries, transfer and matrix are bt709, range is limited.
- [ ] Decoded frame count equals duration times fps; duration within one frame of the timeline. Fixed-length placements (6, 15, 30 s) are exact.
- [ ] FFmpeg decodes the whole file with no errors.
- [ ] No black frames and no frozen runs that are not intended holds (`blackdetect`, `freezedetect`).
- [ ] Integrated loudness within 1 LU of the target for the destination; true peak at or under the limit.
- [ ] File size within the platform's limit.
- [ ] `qc.json` written with the file hash.

```bash
ffmpeg -hide_banner -i film.mp4 -vf "blackdetect=d=0.1:pix_th=0.02,freezedetect=n=0.001:d=1.5" -an -f null - 2>&1 | grep -E "black_start|freeze_start"
```

## Looked at: picture

- [ ] Contact sheet: no blank frames, no frame where nothing is in focus.
- [ ] Transition strips (8 fps across 2 s) for every transition: no pop, no seam, no jump in easing.
- [ ] Every line of text is spelled correctly, readable on a phone at the size shown, and held long enough.
- [ ] Nothing clipped at the frame edges; every vertical cut clears the platform's interface zones (safe-zone check image).
- [ ] One finish: authored, 3D, footage and generated shots share grade, grain and sharpness. No shot looks pasted in.
- [ ] Brand colours measure correctly: sample pixels against the hex in the brief.
- [ ] Logo, fonts and colours are the client's own; no reference pixels.

## Looked at: 3D shots

- [ ] No fireflies, no denoise flicker across consecutive frames.
- [ ] Shadows touch the objects that cast them; light direction agrees with the 2D layers.
- [ ] Metals and glass have something to reflect.
- [ ] Edges of transparent layers are clean over the plate (no dark or bright fringe).

## Looked at: generated shots

Step every frame.

- [ ] Hands, faces, teeth and eyes hold their shape.
- [ ] No stray text, logos or interface elements; no provider watermark.
- [ ] Objects keep their count, shape and position; no morphing at the ends of the shot.
- [ ] Physics looks right: liquids, cloth, reflections, shadows.
- [ ] No resemblance to a real person.
- [ ] All brand pixels in the shot were composited from real assets.

## Looked at: footage and captures

- [ ] No personal data, secrets, internal addresses or unreleased features on any screen.
- [ ] Everyone identifiable has a release; nothing third-party is in frame uncleared.
- [ ] Cursor paths are continuous and every click lands on its target.
- [ ] No stutter from mixed frame rates.

## Listened to

- [ ] Effects land on motion; the same action makes the same sound.
- [ ] Voice is always clear above the music, on speakers and on a phone.
- [ ] Nothing clips; the ending resolves.
- [ ] Captions match the delivered voice word for word and are in sync.

## Truth and rights

- [ ] Every claim matches the brief's truth table; labels are present and readable.
- [ ] `provenance.json` has a row for every asset, each with a licence that permits this use.
- [ ] Disclosure is decided for each platform and territory, and the label or toggle is noted in the delivery notes.
- [ ] Content credentials attached where the brief asks for them, after the final encode.

## Delivery set

- Master, silent picture, audio stems.
- Each briefed cut, re-composed, named by ratio, size and codec.
- Captions, poster frame, contact sheet, transition strips, safe-zone checks.
- `qc.json` and `audio-qc.txt` per cut, `provenance.json`, `doctor.json`.
- Editable sources and delivery notes with the regeneration commands, and a plain list of anything not verified.
