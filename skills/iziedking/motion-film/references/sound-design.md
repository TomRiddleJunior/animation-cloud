# Sound design

Sound is half the film. It is built from cue times the same way the picture is, measured, and mixed to the destination's loudness.

## Layers

1. **Voice:** placed clip by clip on the timeline.
2. **Music or score:** sets the mood and the rhythm. A key change or a drop marks the turn of the story. No melody competing with a voice.
3. **Effects that confirm motion:** whoosh (camera, entrance), pop and click (interface), tick (a step completes), chime (success), thud (something settles), riser (into a reveal), hit (the reveal, the logo). Each sits on the frame the motion starts, except impacts, which sit on the frame of the hit.
4. **Ambience:** room tone, a hum, weather. One per scene, low, faded at the cut.

The same action always makes the same sound. A sound with no motion to confirm is clutter.

## Where sound comes from

Every source needs a licence row in `provenance.json`.

| Source | Use | Note |
|---|---|---|
| Synthesized here (`templates/sound.cjs`) | Effects and a simple score, original and repeatable | No third-party rights at all; always available |
| Client's own recordings | Voice, product sounds | Best for voice |
| Licensed stock music | The track for an advert | The licence must cover paid advertising for a business; many subscriptions need a business tier for that |
| Free libraries | Effects | Per-file licences. CC0 is safe; attribution licences need a credit; non-commercial ones are refused. Some well-known libraries are for personal or educational use only |
| Generated voice, music or effects | With approval | See `generative.md`; plan terms decide commercial use |

For a brand's signature track, prefer licensed or commissioned music: fully generated music may not be protected by copyright.

## Music-led films

Lock the track before building. Find the tempo and the first beat, then compute the grid: beat `n` is at `firstBeat + n * 60 / bpm`, and its frame is that time times fps, rounded. Put cuts and reveals on beats or bars. Verify by rendering a tick on every beat and listening.

Shape the track to the film: cut it on a bar line, cross-fade 50 to 200 ms at the join, end on a resolved chord or a hit with a tail.

## Voice and timing

Record or generate one sentence per clip. Transcribe each clip with word timestamps, or better, align the known script to the audio (`faster-whisper`, WhisperX or `stable-ts`). Write `timeline.json`:

```json
{ "fps": 30, "duration": 42.0,
  "scenes": { "s1": { "start": 0.6, "words": [ { "w": "You", "s": 0.62, "e": 0.78 } ] } } }
```

Key picture beats to words: `wt('s1', 'finished')` returns the time the word starts. When the voice is re-recorded, the picture moves with it. Voiceover for a product film runs at about 125 words a minute.

## Mix

Voice chain: high-pass at 80 Hz, de-ess around 5 to 8 kHz, gentle compression (about 3:1), then level. Music: dip 2 to 4 kHz by 2 to 3 dB where the voice lives. Duck music 6 to 10 dB under speech with a sidechain, attack about 20 ms, release 300 to 400 ms. A true-peak limiter last.

```bash
# duck music under voice, then sum
ffmpeg -i vo.wav -i music.wav -filter_complex \
"[0:a]highpass=f=80,acompressor=ratio=3:threshold=-18dB,asplit=2[vo][sc];\
 [1:a]equalizer=f=3000:t=q:w=1:g=-3[m];\
 [m][sc]sidechaincompress=threshold=0.05:ratio=8:attack=20:release=400[duck];\
 [vo][duck]amix=inputs=2:normalize=0[mix]" -map "[mix]" -ar 48000 -c:a pcm_s24le premix.wav
```

Effects are placed by frame: delay each to `frame / fps` seconds with `adelay` and sum, or let `templates/sound.cjs` write them from the cue list.

## Loudness

Two passes: measure, then apply the measured values.

```bash
ffmpeg -hide_banner -i premix.wav -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null -
ffmpeg -i premix.wav -af "loudnorm=I=-14:TP=-1:LRA=11:measured_I=<i>:measured_TP=<tp>:measured_LRA=<lra>:measured_thresh=<th>:offset=<off>:linear=true" -ar 48000 -c:a pcm_s24le mix.wav
```

`templates/mix.cjs` does both passes.

| Destination | Integrated | True peak |
|---|---|---|
| Online video and social | -14 LUFS (down to -16 is fine) | -1 dBTP |
| Web page, autoplay | -16 LUFS | -1.5 dBTP |
| European broadcast (EBU R128) | -23 LUFS | -1 dBTP |
| US broadcast (ATSC A/85) | -24 LKFS | -2 dBTP |
| Connected TV | The publisher's specification; usually the broadcast target for the region | |

Platforms that normalise turn loud files down and rarely turn quiet ones up. Check the mix on a phone speaker: the voice must stay clear and the low end must not vanish.

Deliver three audio versions: the full mix, music and effects without voice, and the film silent.

## Captions

Most social viewing is muted. Burn captions in for social and also deliver `.srt` or `.vtt`.

- Words come from the delivered voice, aligned, never from the script alone.
- Two lines at most, 32 to 42 characters a line, sentence case.
- Reading speed at or under about 20 characters a second.
- Never over faces, key interface elements or the platform's own controls.
- Break lines at phrase boundaries.

## Checks

```bash
ffmpeg -hide_banner -i film.mp4 -af ebur128=peak=true -f null - 2> audio-qc.txt
```

Read integrated loudness and true peak from the summary. Then listen once on speakers and once on a phone: effects land on motion, nothing clips, the voice is always above the music, the ending resolves.
