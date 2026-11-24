# Delivery

Deliveries are made from the master, one per placement. Platform rules change: the table below was read in November 2026, and rows marked "confirm" were not verified on the platform's own page. Open the platform's current specification before the final encode.

## Decide the cuts in the brief

| Ratio | Size | Where |
|---|---|---|
| 16:9 | 1920x1080 | YouTube, web, LinkedIn, X, presentations, connected TV |
| 9:16 | 1080x1920 | Shorts, Reels, Stories, TikTok, Snapchat |
| 1:1 | 1080x1080 | Feeds |
| 4:5 | 1080x1350 | Instagram and Facebook feed, LinkedIn vertical |

Each ratio is re-composed from the sources. A centre crop of the 16:9 master is not a delivery.

## Platform notes

| Platform | Formats and limits | Notes |
|---|---|---|
| YouTube ads | 16:9 1920x1080, 9:16 1080x1920, 1:1 1080x1080; minimum 720p. Bumper 6 s. Non-skippable 15 to 30 s (longer on some buys). Skippable has no hard maximum; under 3 minutes advised. | Google provides safe-zone templates. Google Ads has an AI label setting; labels may be required in some territories. |
| YouTube Shorts | 9:16, under 60 s advised for ads | Keep the lower and right edges clear of controls. |
| Meta: Facebook and Instagram feed, Reels, Stories | 9:16 1080x1920 for Reels and Stories; 4:5 and 1:1 for feed. H.264 MP4 or MOV. | Confirm limits. Reported unified 9:16 safe zone: keep the top 14%, bottom 35% and each side 6% clear. Realistic synthetic content is expected to be disclosed. |
| TikTok in-feed | 9:16 (540x960 minimum; deliver 1080x1920), also 1:1 and 16:9. Up to 500 MB. MP4, MOV and others. | Safe zone depends on caption length; download the current template. Realistic generated content must be disclosed with the ad's AI toggle (confirm). |
| LinkedIn | 16:9, 1:1, 4:5, 9:16. 3 s to 30 minutes; 15 to 30 s advised. MP4, H.264, AAC, under 30 fps, 75 KB to 500 MB. | No ProRes. Captions as SRT. |
| X | 16:9, 1:1, 9:16. MP4 or MOV, H.264, AAC. | Confirm length and size limits. |
| Pinterest | 1:1, 2:3, 4:5, 9:16. 4 s to 15 minutes; 6 to 15 s advised. MP4, MOV, M4V. | |
| Snapchat | 9:16 1080x1920, 3 to 180 s. | Confirm. Keep roughly the top and bottom 150 px clear. |
| Apple App Store preview | Exact pixel sizes per device (for example 886x1920 for current iPhones, 1920x1080 for Mac). 15 to 30 s, up to 3 per size. H.264 at 10 to 12 Mbps or ProRes 422 HQ, 30 fps maximum, 500 MB, stereo AAC. | Footage must be captured from the app. Confirm sizes for the devices in scope. |
| Google Play | A YouTube link, landscape preferred; the first 30 s autoplay. | Public or unlisted, not age-restricted. |
| Connected TV and broadcast | 1920x1080 at the publisher's frame rate; 15 or 30 s exact to the frame; a high-bitrate mezzanine. | Title-safe 90%. Broadcast loudness. Get the publisher's specification sheet. |
| Web hero or background | 1920x1080 or smaller, muted, looping, 6 to 12 s, about 1 to 2.5 MB. | AV1 or VP9 with an H.264 fallback and a poster image. Respect reduced-motion preferences. |
| Email | A GIF under 1 MB, under 600 px wide, 10 to 15 fps, with a meaningful first frame, or a still that links to the video. | |

## Safe zones

Platform interfaces cover parts of a vertical video. Until the current template is checked, keep text, logos and faces inside the central area: clear the top 14%, the bottom 35% and 6% at each side. For 16:9, keep titles inside the central 90%.

Check by overlaying a guide on the cut:

```bash
ffmpeg -i vertical.mp4 -vf "drawbox=x=0:y=0:w=iw:h=ih*0.14:color=red@0.35:t=fill,drawbox=x=0:y=ih*0.65:w=iw:h=ih*0.35:color=red@0.35:t=fill,drawbox=x=0:y=0:w=iw*0.06:h=ih:color=red@0.35:t=fill,drawbox=x=iw*0.94:y=0:w=iw*0.06:h=ih:color=red@0.35:t=fill" -frames:v 1 -ss 2 safezone-check.png
```

## Encodes from the master

```bash
# H.264, the default delivery
ffmpeg -i master.mov -c:v libx264 -preset slow -crf 16 -profile:v high -pix_fmt yuv420p \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -color_range tv \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart out_h264.mp4

# H.265, 10-bit (the hvc1 tag is needed for Apple playback)
ffmpeg -i master.mov -c:v libx265 -preset slow -crf 18 -pix_fmt yuv420p10le -tag:v hvc1 \
  -x265-params "colorprim=bt709:transfer=bt709:colormatrix=bt709:range=limited" \
  -c:a aac -b:a 256k -movflags +faststart out_h265.mp4

# AV1 for the web, no audio
ffmpeg -i master.mov -c:v libsvtav1 -preset 5 -crf 30 -g 240 -pix_fmt yuv420p10le \
  -color_primaries bt709 -color_trc bt709 -colorspace bt709 -an -movflags +faststart hero_av1.mp4

# a size-capped file (two passes), for a platform or page with a hard limit: bitrate = size_in_kilobits / seconds
ffmpeg -y -i master.mov -c:v libx264 -preset slow -b:v 2400k -pass 1 -an -f null -
ffmpeg -i master.mov -c:v libx264 -preset slow -b:v 2400k -pass 2 -pix_fmt yuv420p -c:a aac -b:a 128k -movflags +faststart capped.mp4

# transparent video for the web: VP9 with alpha, plus HEVC with alpha for Safari (the second needs macOS)
ffmpeg -i master_alpha.mov -c:v libvpx-vp9 -pix_fmt yuva420p -b:v 0 -crf 32 -auto-alt-ref 0 -an hero_alpha.webm
ffmpeg -i master_alpha.mov -c:v hevc_videotoolbox -alpha_quality 0.75 -tag:v hvc1 -an hero_alpha.mov

# app store preview constraints
ffmpeg -i master.mov -c:v libx264 -profile:v high -level 4.0 -b:v 11M -maxrate 12M -bufsize 24M -r 30 -pix_fmt yuv420p \
  -c:a aac -b:a 256k -ar 48000 -movflags +faststart preview.mp4

# GIF with a good palette
ffmpeg -i master.mov -vf "fps=12,scale=560:-1:flags=lanczos,split[a][b];[a]palettegen=stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4" out.gif
```

`templates/finish/finish.cjs deliver` writes the briefed set with consistent names: `title_16x9_1080p_h264.mp4`, `title_9x16_1080x1920_h264.mp4`, and so on.

## Captions and accessibility

- Burned-in captions on social cuts, plus an `.srt` or `.vtt` file for every cut.
- A version without burned-in captions for platforms that render the file's captions themselves.
- A transcript for long films.
- Avoid flashing faster than three times a second.

## Poster and thumbnail

Export a poster frame chosen for meaning, not the first frame: `ffmpeg -ss 6.2 -i master.mov -frames:v 1 poster.png`. Some stores take the frame at a fixed time; check.

## Disclosure and credentials

Decide per platform and territory whether the film needs an AI-content label, set the platform's toggle when uploading, and sign the final file where content credentials are wanted. Rules and commands are in `legal-provenance.md`. Sign last: any re-encode invalidates a signature.

## The delivery set

- Master (ProRes), silent picture, audio stems (full mix, music and effects, voice).
- Each briefed cut, named by ratio, size and codec.
- Captions per cut, poster frame.
- `qc.json`, `audio-qc.txt`, contact sheet, transition strips, safe-zone checks.
- `provenance.json`, `doctor.json`, delivery notes.
- Sources and the commands to regenerate.
