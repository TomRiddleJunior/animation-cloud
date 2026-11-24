# Finishing

The finish makes shots from different engines look like one film: conform, composite, grade, texture, master. Do it once, at the end, on high-quality intermediates.

## Order of work

1. **Conform** every shot to the film's size, frame rate, pixel format and colour tags.
2. **Composite** layers that belong together (3D over 2D, titles over footage).
3. **Assemble** the shots on the timeline.
4. **Grade:** normalise, primary, secondary, look.
5. **Texture:** glow if the look has it, then one grain pass over everything.
6. **Master** to a mezzanine file, then make deliveries from the master (`delivery.md`).

`templates/finish/finish.cjs` runs steps 4 to 6 from `finish.json`.

## Intermediates

Work in 10-bit or better until the delivery encode.

```bash
# frames to a mezzanine: ProRes 422 HQ
ffmpeg -framerate 30 -i frames/f_%05d.png -vf "scale=out_color_matrix=bt709:out_range=tv,format=yuv422p10le" \
  -c:v prores_ks -profile:v 3 -vendor apl0 -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv shot.mov

# frames with transparency: ProRes 4444
ffmpeg -framerate 30 -i frames/f_%05d.png -c:v prores_ks -profile:v 4 -pix_fmt yuva444p10le -alpha_bits 16 \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 shot_alpha.mov
```

Tag colour on every encode. An untagged file looks different in every player.

## Compositing

```bash
# a transparent 3D or 2D layer over a plate
ffmpeg -i plate.mov -i layer_alpha.mov -filter_complex "[0][1]overlay=format=auto[v]" -map "[v]" -c:v prores_ks -profile:v 3 comp.mov
# a layer from a given time, at a position
ffmpeg -i plate.mov -i layer_alpha.mov -filter_complex "[1]setpts=PTS+2.5/TB[l];[0][l]overlay=x=120:y=80:eof_action=pass[v]" -map "[v]" comp.mov
# soft contact shadow under a cut-out: blur a darkened copy of the alpha
ffmpeg -i plate.mov -i layer_alpha.mov -filter_complex "[1]split[a][b];[a]alphaextract,gblur=sigma=18,format=gray[m];color=black:s=1920x1080[k];[k][m]alphamerge,colorchannelmixer=aa=0.35[sh];[0][sh]overlay=0:14[p];[p][b]overlay[v]" -map "[v]" comp.mov
```

If a layer was rendered with premultiplied alpha, say so (`overlay=alpha=premultiplied`), or edges will show dark or bright fringes.

Join shots with the concat demuxer when they share every parameter:

```bash
printf "file 'shots/010/shot.mov'\nfile 'shots/020/shot.mov'\n" > list.txt
ffmpeg -f concat -safe 0 -i list.txt -c copy assembled.mov
```

## Grade

Authored 2D shots already carry their design colours; grade them lightly or not at all. Footage, 3D and generated shots need more.

1. **Normalise:** fix exposure and white balance, and get every source into Rec.709.
2. **Primary:** contrast and saturation for the whole frame.
3. **Secondary:** isolated fixes, such as bringing a brand colour back to its hex.
4. **Look:** the film's character, applied identically to every shot.

```bash
ffmpeg -i assembled.mov -filter_complex "
 [0:v]format=gbrp16le,
 eq=contrast=1.05:saturation=1.05,
 curves=m='0/0 0.25/0.23 0.75/0.78 1/1',
 colorbalance=rs=-0.02:bs=0.03:rh=0.02:bh=-0.02[v]" -map "[v]" -c:v prores_ks -profile:v 3 graded.mov
```

A look as a file, so every shot gets exactly the same one: grade an identity lookup image with the chosen filters, then apply that image as the look.

```bash
ffmpeg -f lavfi -i haldclutsrc=8 -frames:v 1 -vf "eq=contrast=1.06,colorbalance=bs=0.04:rh=0.03" look_hald.png
ffmpeg -i in.mov -i look_hald.png -filter_complex "[0][1]haldclut" out.mov
```

A `.cube` file works too (`lut3d=file=look.cube:interp=tetrahedral`). Build looks this way instead of bundling downloaded ones: third-party lookup tables often may not be redistributed.

Judge with scopes as well as eyes:

```bash
ffmpeg -i graded.mov -vf "waveform=m=1:d=1,format=yuv420p" -frames:v 1 waveform.png
ffmpeg -i graded.mov -vf vectorscope=m=color3 -frames:v 1 vectorscope.png
```

Blacks should keep detail and whites should not clip. Skin tones sit on the skin-tone line. Then sample a brand-colour pixel in the final file and compare it with the hex in the brief.

## Texture

```bash
# glow: screen a blurred copy of the highlights over the picture
ffmpeg -i graded.mov -filter_complex "[0:v]format=gbrp16le,split[b][h];[h]colorlevels=rimin=0.72:gimin=0.72:bimin=0.72,gblur=sigma=22[g];[b][g]blend=all_mode=screen:all_opacity=0.35[v]" -map "[v]" glow.mov
# vignette
ffmpeg -i in.mov -vf "vignette=angle=PI/5" out.mov
# slight colour fringing at high-contrast edges
ffmpeg -i in.mov -vf "rgbashift=rh=-1:bh=1" out.mov
# film grain: once, last, over everything
ffmpeg -i in.mov -vf "noise=alls=6:allf=t+u" out.mov
```

Grain is the cheapest way to unify authored, 3D, stock and generated shots, and it hides banding in gradients. Keep it subtle (strength 4 to 8) and apply it once to the assembled film, never per shot. Flat interface films often want none, or very little.

## Speed and retiming

For authored and 3D shots, re-render at the new timing instead of retiming video. For footage see `live-action-edit.md`.

## The master

One file that everything else is made from:

```bash
ffmpeg -i finished.mov -i mix.wav -c:v prores_ks -profile:v 3 -pix_fmt yuv422p10le \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -c:a pcm_s24le -ar 48000 master.mov
```

Keep the master, the silent picture, and the audio stems. Verify the tags:

```bash
ffprobe -v error -select_streams v:0 -show_entries stream=pix_fmt,color_range,color_space,color_transfer,color_primaries,r_frame_rate master.mov
```

## High dynamic range

Deliver HDR only when the brief asks for it and the whole chain (render, grade, display used for review) supports it. Standard dynamic range in Rec.709 is the default for every platform in `delivery.md`.

## Using a grading application

If the user owns one and wants a colourist's pass, hand over the ProRes master and an edit decision list, and take back a graded master. The scripted finish stays the reproducible path.
