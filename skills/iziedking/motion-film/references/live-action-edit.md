# Editing footage

For films built from existing video: event sizzles, testimonials, gameplay promos, ranked lists, stock-led brand films. The edit is data (a cut list), the render is FFmpeg, and the result is repeatable.

## Method

1. **Ingest and log.** Probe every clip. Make a contact sheet and a shot log: what happens, the best seconds, whether it has usable sound, who is identifiable.
2. **Clear the footage.** Client-owned, licensed stock, or captured by the client. Identifiable people need a release for advertising use. Gameplay and third-party footage need the rights holder's permission or a licence that covers ads. Record each in `provenance.json`.
3. **Conform.** Bring every clip to the film's frame rate, size, pixel format and colour tags before cutting. Mixed frame rates are the commonest cause of stutter.
4. **Selects.** Pull the best 1 to 4 seconds of each clip, trimmed on movement.
5. **Cut list.** Order the selects against the music's beat grid or the voice.
6. **Assemble, then titles, then sound, then finish.**

## Log and conform

```bash
ffprobe -v error -show_entries format=duration:stream=codec_type,width,height,r_frame_rate,pix_fmt -of json clip.mp4
ffmpeg -i clip.mp4 -vf "fps=1,scale=320:-1,tile=8x5" -frames:v 1 clip-sheet.jpg

# conform to 1920x1080, 30 fps, 10-bit intermediate, Rec.709 tags (crop to fill; use pad instead to letterbox)
ffmpeg -i clip.mp4 -vf "fps=30,scale=1920:1080:force_original_aspect_ratio=increase,crop=1920:1080,format=yuv422p10le" \
  -c:v prores_ks -profile:v 3 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -c:a pcm_s24le -ar 48000 conformed/clip.mov
```

Pick the film's frame rate from the footage: 23.976 or 25 for cinematic live action, 30 for UI and social, 60 only when the footage is 60 and smooth motion is the point (sports, gameplay).

## The cut list

`templates/edit/cuts.json`:

```json
{
  "fps": 30, "width": 1920, "height": 1080,
  "music": "audio/track.wav", "bpm": 120, "firstBeat": 0.25,
  "shots": [
    { "src": "conformed/stage-wide.mov", "in": 12.40, "beats": 4, "audio": false },
    { "src": "conformed/crowd.mov", "in": 3.10, "beats": 2, "speed": 0.5 },
    { "src": "conformed/speaker.mov", "in": 44.00, "dur": 2.4, "audio": true }
  ]
}
```

`node templates/edit/assemble.cjs cuts.json` conforms and trims each shot to a whole number of frames, applies speed, joins them with hard cuts, lays the music and any clip sound, and writes `output/edit.mov` plus `output/edit-map.json` (the exact frame each shot starts on). A shot's length is `beats * 60 / bpm` or `dur`, rounded to frames. Dissolves and other transitions are added afterwards with `xfade` on the segments that need them.

Beat grid: beat `n` is at `firstBeat + n * 60 / bpm` seconds; the frame is that time times fps, rounded. Find tempo by ear and tap, by a tempo tool if one is installed, or from the spectrogram in the reference study. Check by placing a tick on every beat and listening.

## Editing craft

- **Emotion first, then story, then rhythm.** If a cut feels right and breaks continuity, keep the feeling.
- **Cut on movement.** A cut during an action hides itself. A cut between two still frames shows.
- **Vary shot size.** Wide, medium, detail. Two similar sizes in a row look like a jump.
- **Eye trace.** Put the next shot's point of interest where the eye already is.
- **Rhythm.** Montage shots of 0.6 to 2.5 s, with a longer breath every 6 to 8 shots. Cut on the beat for energy, just before it for drive. Do not cut every beat for a whole film.
- **Direction.** Keep screen direction consistent across cuts unless the reversal means something.
- **Sound bridges.** Let the next shot's sound start early (J-cut) or the last shot's sound run on (L-cut).
- **Open on the strongest second.** The first two seconds decide whether anyone watches the rest.
- **End on a hold.** Logo or line, 2 to 3 seconds, music resolving.

## Sizzle and event films

Structure for 20 to 60 seconds:

1. One arresting shot or a line of speech (0 to 3 s).
2. Scale: the room, the crowd, the place.
3. People: faces, reactions, hands doing things.
4. Substance: a speaker's best sentence, a product on screen, a demo.
5. Peak: the fastest cutting, the biggest moment.
6. Close: one calm shot, the name, the date or call to action.

Use speakers' real words only, in context. Do not cut a sentence so that it says something the speaker did not mean.

## Gameplay, capture and ranked lists

- Record or obtain capture at the delivery frame rate; do not mix 30 and 60 in one timeline without conforming.
- Each segment opens on its most active second, then explains.
- Number and title cards are authored (canvas or DOM), 1 to 1.5 s, with a hit sound; build them once and reuse.
- Keep lower thirds and captions out of the game's HUD regions; check per title.
- Normalise each clip's loudness before the mix; game audio levels vary widely.
- Rights: game publishers set their own rules for monetised and advertising use of footage. Check the publisher's video policy and record it. Music inside game capture is often separately licensed and may need removing.

## Useful operations

```bash
# trim exactly, re-encoding so the cut is frame-accurate
ffmpeg -ss 12.4 -i in.mov -t 2.0 -c:v prores_ks -profile:v 3 -an sel.mov

# slow motion from a higher frame rate source (60 to 30 is real half speed; no invented frames)
ffmpeg -i clip60.mov -vf "setpts=2.0*PTS,fps=30" -an slow.mov
# slow motion with interpolated frames (live footage only; check for warping)
ffmpeg -i in.mov -vf "setpts=4*PTS,minterpolate=fps=30:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1" -an slow4.mov

# speed ramp: split, retime each part, join
ffmpeg -i in.mov -filter_complex "[0:v]trim=0:1,setpts=PTS-STARTPTS[a];[0:v]trim=1:2,setpts=(PTS-STARTPTS)/4[b];[0:v]trim=2:4,setpts=PTS-STARTPTS[c];[a][b][c]concat=n=3:v=1[v]" -map "[v]" -an ramp.mov

# crossfade two shots (offset = length of first minus duration)
ffmpeg -i a.mov -i b.mov -filter_complex "[0:v][1:v]xfade=transition=fade:duration=0.4:offset=1.6[v]" -map "[v]" ab.mov

# punch-in and reframe for vertical, tracking a subject by choosing the crop x per shot
ffmpeg -i in.mov -vf "crop=608:1080:700:0,scale=1080:1920" vertical.mov

# stabilise (two passes; needs a build with vidstab)
ffmpeg -i shaky.mov -vf vidstabdetect=shakiness=6:result=tr.trf -f null -
ffmpeg -i shaky.mov -vf vidstabtransform=input=tr.trf:smoothing=20,unsharp=5:5:0.6 stable.mov

# lower third from an authored PNG sequence with alpha
ffmpeg -i edit.mov -framerate 30 -i lt/f_%04d.png -filter_complex "[0][1]overlay=0:0:enable='between(t,3,6)'" out.mov
```

`xfade` names worth knowing: `fade`, `wipeleft`, `slideup`, `circleopen`, `smoothleft`, `dissolve`. Use at most one or two kinds per film; a hard cut is the default.

## Vertical and square cuts from footage

Reframe per shot, not once for the whole film. Choose the crop so the subject sits in the middle third, keep faces out of the platform's interface zones (`delivery.md`), and re-set titles for the new frame.

## Hand-off to a human editor

Write an EDL or OpenTimelineIO file next to the render (`pip install opentimelineio`) so the cut can be opened in an editing application and adjusted.
