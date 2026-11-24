---
name: explainer-launch-promo
description: "Music-led product launch / hype promo with kinetic typography — slam-in words on the beat, HUD-bracket glyph-scramble headlines, zoom-throughs, letters→ribbon→UI-card metamorphoses, dark glass UI tilted in 3D, a brand reveal on the drop at 25–35 % and a calm logo end card. Use when someone asks for a launch video, hype promo, product teaser, \"sizzle\", launch film, kinetic-type promo, app/SaaS/AI announcement trailer, or references Timeliner / Flash Motion hype promos, KGeN or Kartel (What a Story), Clay's \"Introducing Clay\" or Microsoft 365 Copilot-style launch spots — with no voice-over or only a few announcer words. Builds on explainer-engine."
---
# Launch / hype promo

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

A 40–70 s launch film where the **music is the narrator**: a fixed-BPM track drives every cut, slam and pop; on-screen copy
carries the message in 0.6–1.2 s legible bursts; nothing ever stops moving (holds < 5 %). The film goes tease → chaos →
riser → **DROP = brand reveal** → feature montage (numbered HUD headlines + dark glass UI the camera hops across on the beat)
→ callback/aphorism → calm logo end card with a pun and a CTA. Built from frame analysis of 5 source videos
(references/sources.md: Timeliner, KGeN, Kartel, Clay, Microsoft 365 Copilot). Original work only: invent the product, the
name, the logo mark, the UI and the copy; never reuse a song, lyric, tagline, logo or studio intro.

## 1. Signature traits
- **Beat grid first.** sound.json fixes the BPM (`hype-trap` 140); every move is placed at `K.b(beat)` (= beat · 60/bpm),
  slams on whole/half beats, pops and card landings on 8ths, UI camera hops every 2 beats.
- **Kinetic slams.** One or two words at a time, scale ×4 → 1 with blur in 4 f, then a linear drift (−15 % scale, +5 % W);
  one RGB-split impact word with a vertical light beam per act; type cards hand over through blur-outs, never fades to black.
- **HUD-bracket scramble headlines** for each feature ("01 — CAPTURE" + "CATCH *EVERYTHING*"): corner brackets open with
  back.out, letters tumble in as tinted glyphs 1 char/frame, extruded condensed caps, brackets breathe, letters collapse out.
- **Dark ground lit by glow** — warm black, eclipse rim arcs top + bottom, a concentric ring field, bokeh, stars, vignette;
  **one hue family (ember → flame → gold) + neutrals**; bright **ember type-card fields** as section dividers.
- **Dark glass UI in 3D**: panels tilt in (rotY −30°, rotX 15° → flat in 12 f), the camera hops across them on the beat,
  a glossy cursor clicks, counters roll, cards fly into columns on 8th notes.
- **One hero token** (the ember orb) physically carries the viewer: ignition → suck-in before the drop → the 'o' of the
  wordmark → zoom-through into the next act → the playhead of the plan.
- **Morph regime, ~1 hard cut.** Zoom-throughs, light sweeps, letters → sine ribbons → a line that unfolds into a UI card,
  pull-backs; the only hard cut is the white flash on the drop.
- **Drum-reactive light**: the ring field surges and the glow/arcs pump on every kick; held type and the logo bounce +4 %.

## 2. Target metrics
QA = `out/qa/metrics.json` from `make.sh`. Source ranges = the 3 launch promos (Timeliner, KGeN, Kartel) + the 2 music-led
SaaS launch films (Clay, Copilot).

| metric | source range | target | sample (`samples/launch-promo`) |
|---|---|---|---|
| duration | 60–134 s | 40–60 s | 53.6 s |
| scene_changes_per_min | 4.0–22.0 (KGeN 12.0, Timeliner 12.1, Kartel 7.0) | 7–12 | 10.07 (median 4.6 s) |
| cuts_per_min (hard) | 0–19 (Kartel 0, KGeN 1.3) | ≤ 2.5 (morph regime) | 1.12 (1 cut: the drop flash) |
| motion_mean | 6.3–16.8 (KGeN 7.4, Timeliner 11.9, Kartel 16.8) | 8–17 | 7.55 (p90 12.6) |
| hold_frac | 0.03–0.05 (Clay 0.37) | < 0.05 | 0.003 |
| colourfulness | 14.5–47.5 | 31–47 | 41.3 |
| brightness | 0.20–0.87 (dark-first: 0.20–0.48) | 0.20–0.35 | 0.261 (81 % dark frames) |
| WPM | 0–138 (music-led 0–102) | 0 (or ≤ 6 announcer words) | 0 |
| loudness LUFS | −11.8 … −17.6 (Kartel −13) | −12 … −13 | −12.5 (silence 0 s) |
| brand reveal | 7–33 % of runtime | 25–35 % | 28.8 % (drop at b36 = 15.4 s) |
| motion curve | first decile 1–2.3× mean, last decile 0.9–3.3 | hot start, calm end card | 7.6 9.7 11.5 7.1 8.8 10.0 9.9 5.9 3.4 1.7 |

Deliberate deviations: **motion 7.55 is just under the 8–17 target** but inside the source range (KGeN 7.4, Clay 6.3). Dark glass UI on a dark ground barely changes luminance when it moves, and every transition is kept area-safe so QA reads no hard cuts (this also caps p90 at ~12.6 against 17–37). The sample adds motion through beat-locked camera hops, streaming rows, cards landing on 8ths, glyph tiles and drum-pumped light. To go higher, use brighter UI or photo cards (Kartel) or switch to the hard-cut regime (Timeliner). One hard cut (the white flash on the drop) is deliberate. The first decile is ~1.0× the mean because the hook is three type slams; the hottest stretch is the suck-in and drop (decile 3).

## 3. Script formula (the on-screen copy is the script)
Beat map for a 31-bar film at 140 BPM (1 bar = 1.714 s; percent of runtime):

| bars (beats) | % | beat | copy pattern (sample) |
|---|---|---|---|
| 0–3 (b0–12) | 0–10 | **Hook**, energy 1 (pad + 808) | 2nd-person number paradox as 2 slams + 1 RGB impact: "47 TABS." / "12 APPS." / "1 OF YOU." |
| 3–8 (b12–32) | 10–26 | **Chaos**, energy 2 from bar 4 (hats, clap; auto riser) | prop gags, not sentences: notification flood + unread counter, a file that doubles every beat ("final_v9_REAL.pdf"), one slam ("WHICH FINAL?"), a pill line ("Sound *familiar?*") |
| 8 (b32–36) | 26–29 | **Build** (riser) | everything is sucked into the hero orb; orb compresses on the last half beat |
| 9–11 (b36–44) | 29–35 | **DROP = brand reveal**, energy 3 | flash + shock, logo mark builds "chaos → sorted", wordmark decodes, promise pill "Your chaos, *sorted.*" |
| 11–23 (b44–96) | 35–78 | **Features ×3**, 4 bars each | numbered HUD headline on an ember field (verb + object, ≤ 20 chars: "CATCH EVERYTHING", "SORTED IN ONE CLICK", "SHIP ON TIME") → the matching UI moment |
| 24–26 (b96–108) | 78–87 | **Callback + aphorism**, energy 2 (breakdown) | hook number resolved ("FROM 47 TABS" → "TO 1."), antithesis pair as pill lines ("*Less* chasing." / "*More* shipping.") |
| 27–31 (b108–124) | 87–100 | **End card**, energy 0 + end hit | mark + wordmark, pun tagline ("Not sorta. *Sorted.*"), CTA button ("Join the beta →"), platforms typed ("Mac · Windows · Web"); CTA visible ≥ 4 s |

Rules: one sentence on screen max; one highlighted word per line (pill or gold accent); a number or paradox within 5 s;
copy changes on the beat; legible holds 0.6–1.2 s (slams 0.9–1.1 s, HUD ~1.0 s, pill lines ~1.0–1.2 s). No song lyrics,
no famous hooks, no real brand names in UI copy. VO: none. If the client insists, ≤ 6 announcer words via
`assets/template/script.example.json` (`am_fenrir`/`am_michael`, speed 1.05, each line pinned with `at` to a beat).

## 4. Visual system
**Palette (LP.PAL)** — ground `bg2 #22120b` centre → `bg1 #140b08` → `bg0 #050304` corners; ember `#ff5a1f`, flame `#ff7b2c`,
gold `#ffb547` (accent words, bars, pills); cream `#fff1df` / text `#fff7ee`; deep `#3a1508` (extrude), rust `#8a3212`;
UI chrome panel `#120d0b`→`#1b1411`, lines `#2f2420`, mute `#a89489`, dim `#5e4d45`; type-card field `#e5521b` with a drifting
`#ffb15a` hot spot; pill ink `#2b1206`. Colour variety only via the ember family; saturated pixels mostly on fields, pills, bars.

**Typography (engine fonts)** — slams: Archivo Black 160–320 px, tracking −1 %, bloom; HUD headlines: Barlow Condensed 700
124–140 px caps, +2 % tracking, 4-step extrude + drop shadow; labels: Inter 700 26 px tracked 7; pill lines: Inter 700
88–108 px; wordmark: Space Grotesk 700 170–210 px lowercase, −3 % tracking, the 'o' replaced by the orb; UI: Inter 17–25 px
(titles 25/650, sub 20/450, tags 17/700); end-card tagline Space Grotesk 500 58 px, CTA Inter 700 34 px.

**Shapes & light** — no outlines on objects; edges come from light: bloom (`K.bloom`), rim strokes in flame on tiles and panels,
eclipse arcs (4 px cream core + 16/46/110 px ember blooms), radial ember glow behind the subject, vignette ~60 % at corners,
3.5 % grain. Panels: radius 26, 1.5 px flame rim, 10 px soft ring + 90 px ember glow. Pills: radius 26 % of height, gradient
ember → gold → cream. Composition: centred type on the vertical axis; UI fills 70–95 % width; ≥ 96 px safe margin for type.

## 5. Characters & objects (kit.js)
No people. Props and UI are the cast.
- **Hero orb** `K.orb(parent,{x,y,r})` — glow disc + halo ring + radial-gradient core + specular; breathes on its own.
  HTML variant `K.orbDiv(size)` for UI chips / playheads. Re-use it at every act boundary.
- **Logo** `K.mark(parent,{x,y,s})` (rounded tile + three sorted bars + orb dot) + `K.markBuild(m,t)` (tile pops 7 f back.out,
  bars fly in scattered and snap on 1/4 beats); `K.wordmark(parent,{x,y,size,text})` (per-char, orb as the 'o').
- **Cursor** `K.cursor()` glossy white/ember arrow; `K.cursorTo(c,x,y,t,dur)` arcs (x power2.inOut, y sine.inOut);
  `K.click(c,t,x,y)` 2 f squash ×2 + 14 f ripple + click sfx.
- **UI kit (HTML in K.world)** `K.panel({x,y,w,h,title,search})` → {el, head, body}; `K.icon(name)` (mail chat cal doc bell
  check bolt task search user flag arrow inbox clock layers spark); `K.avatar`, `K.tag(label,'urgent|today|fyi|done|later')`,
  `K.notif({icon,app,title,time})`, CSS classes `.lp-row .lp-card .lp-btn .lp-tile`.
- **Props** `K.fileIcon(parent,{x,y,scale,label})`, glyph tiles (see sample chaos), `K.burst(parent,x,y,t)` confetti/sparks.
- **Grounds** `K.env` (glow, rings, arcs, grid, stars, bokeh, speed lines, spot, pump) tweened with `K.envTo(from,to,t,dur)`;
  `K.field(t0,t1)` ember type-card field with moving rings, radial lines, ring-dots and a pumping hot spot.

## 6. Motion grammar
| move | ease (GSAP) | frames @30 | where |
|---|---|---|---|
| slam in | expo.out (scale ×4→1, blur 18→0) + opacity power1.in | 4 | `K.slam` |
| slam hold drift | none (linear), scale −16 %, x +110 px | 25–35 | every held word |
| slam / pill exit | power2.in blur-out 3 f, or expo.in zoom-out ×2.6 5 f | 3–5 | |
| RGB impact | expo.out split ±16 → ±2 px | 6 | `K.rgbSlam` |
| HUD brackets open / breathe / close | back.out(1.4) / sine.inOut yoyo / power3.in | 22 / 8+8 / 8 | `K.hud` |
| glyph scramble | steps, 1 char/frame, 4 f tumble (rot 90→0, tint→face) | n+4 | `K.scramble` |
| decode / typewriter | random order 1 char per 1–2 f / 10–12 cps | | `K.decode`, `K.typewriter` |
| pill line | back.out(1.8) pill 6 f; next word +46 px → 0 power3.out 6 f, stagger 8 f | | `K.pill` |
| UI tilt-in | power3.out | 12 | `K.tiltIn` |
| camera hop | power3.inOut 12 f (punch) or power2.inOut 20–30 f (glide) | every 2 beats | `K.hop` |
| pops / tags | back.out(2.6) overshoot ~8 % | 6–8 | |
| card landing | back.out(1.3) on 8th notes | 8 | |
| kick bounce | +4 % → 1, power2.out | 9 | `K.bounce(el, K.hits(t0,t1))` |
| ring surge / light pump | cubic out / exp decay 0.15 s | 10–16 | `K.ringPulse`, `K.pulseBars` |
| idle | orb breathe 1.7 s, stars/bokeh drift, rings 52 px/s, glow ±9 % / 2.4 s | continuous | automatic |
Stagger: UI sub-items 2–3 f, rows ½ beat, tags ½ beat, cards ½ beat. Nothing is still > 6 f except the last 2 s of the end card.

## 7. Transitions (analysis catalogue → kit)
| # | name | build | frames | use |
|---|---|---|---|---|
| T1 | slam-in word | `K.slam(text,t,{hold,out})` + whoosh/impact + ring surge | 4 in | hook, chaos, callback |
| T2 | RGB-split impact + beam | `K.rgbSlam(text,t,{hold})` | 6 | one per act (biggest word) |
| T3 | pill-highlight line | `K.pill([{t,pill},{t}],t,{hold})`; swap lines with a 3 f blur cross-fade | 6 + 8 stagger | promise, aphorism |
| T4 | 3D UI tilt-in | `K.tiltIn(panel.el,t,{from})` (rise-from-below variant: rotX 38°, yPercent 32) | 12 | every UI beat |
| T5 | white light sweep | `K.sweep(t,{frames:8})` + cross-dissolve old→new under the band (8 f) | 8 | UI → type card |
| T6 | pull-back to isolate | `K.pullBack(el,t)` scale 0.55, y +260, fade | 12 | UI → aphorism |
| T7 | counter roll | `X.countUp(el,a,b,t,dur,fmt)` + badge bounce per tick | 45–80 | chaos, UI |
| T9 | HUD bracket scramble | `K.hud(text,t,{label,on:'field'})` | 22 in, ~30 legible, 8 out | every feature title |
| T11 | match-scale zoom-through | `K.zoomThrough(t,{x,y,r0,open})` — disc from any element (`K.screenPos`) → flat field → iris or stay on `K.field` | 10 + 4 + 12 | act boundaries |
| T14/T15 | decode / typewriter | `K.chars` + `K.decode` / `K.typewriter` | 1 char/f / 10 cps | wordmark, tagline, CTA |
| T16 | letters → ribbon → line → card | `K.ribbon(hud.cs,t,{y})` (HUD with `exit:'none'`), field collapses into the line (`scaleY→0`), line moves to the card top, card unfolds (`scaleY 0→1`, origin top) | 15 + 10 + 12 | first feature |
| T8/T21 | logo build / glitch decode | `K.markBuild` + `K.decode(wordmark.cs)` + orb pop | ~40 | drop, end card |
| C1 | drift | every hold drifts; panels hop or glide | continuous | always |
Zoom-through must use the kit's `power1.in` area curve (≤ 25 % of the frame per frame) — an expo.in disc reads as a hard cut.

## 8. Sound
`sound.json` (sample): `{"preset":"hype-trap","bpm":140,"sections":[{"t":0,"energy":1},{"t":6.857,"energy":2},{"t":15.429,"energy":3},
{"t":41.143,"energy":2},{"t":46.286,"energy":0}],"end_hit":true,"music_alone_db":-6,"sfx_db":1,"lufs":-12.5}` (= bars 0/4/9/24/27) — energy 1 = pad + 808, 2 = + hats/clap (auto riser before
it), 3 = + kick/snare (auto riser + impact on the drop), 0 = end-hit chord + bell under the end card. Section times must
sit on bar lines (`K.bar(n)`). `tech-glow` at 100–120 BPM is the calmer alternative (AI/tech). No VO, so nothing is ducked.
SFX map (≈ 2 per second in hook/chaos, all declared next to their visual): slam → whoosh (−0.1 s) + impact; RGB impact →
impact (pitch .85) + glitch; zoom-through → zoom_in + whoosh; notifications → notif/ding/blip (pitch walk); file doubling →
pop/blip_up rising pitch; HUD → blip_up + glitch (scramble length) + swoosh out; decode → glitch; typewriter → type; build →
riser (3.5 beats) + woosh_low; drop → impact (pitch .7) + shutter + sparkle on the orb; tilt-in / hops → swoosh; card
landings / checks → tick; cursor → click + sparkle; counter done → success; stamp → stamp + impact.

## 9. Build recipe
1. `cp -r assets/template <project>` and `cp assets/kit.js <project>/` (the renderer only serves the project + engine).
2. Pick BPM + bar count (`K.bar(n)`): 28–34 bars ≈ 48–58 s at 140. Write the beat sheet (section 3) as bar numbers first.
3. sound.json sections on the same bars. No script.json (or the announcer example).
4. scene.js per beat: hook `K.slam`×2 + `K.rgbSlam` → `K.zoomThrough` (iris) → chaos props on ½-beat arrivals +
   `X.countUp` + one `K.slam` + `K.pill` → orb suck-in (`K.envTo` speedDir −1, ringOff −900, riser) → drop (`K.flash`,
   `K.shock`, `K.burst`, `K.markBuild`, `K.wordmark` + `K.decode`, `K.pill`) → per feature: `K.zoomThrough(open:false)` or
   `K.sweep` → `K.field` + `K.hud(on:'field')` → `K.panel` + `K.tiltIn` + `K.hop` every 2 beats + content beats → callback
   slams + pill pair → end card (`K.markBuild`, `K.decode`, CTA outline `X.drawOn`, `K.typewriter`).
5. Finish with `K.pulseBars(bar0, bar1, hits, amt)` wherever the dark ground shows (808 `[0,2.75]`, kicks `[0,.75,2.5]`).
6. `ENGINE/make.sh <project> --draft --workers 3`, then stills at every beat, then the full render; compare
   `out/qa/timeline.jpg` with `references/sources.md` sheets.

## 10. QA checklist
Stills: 1 s (first slam), 3.8 s (RGB impact), every act boundary ±0.2 s (zoom cover/open, sweep, drop flash), each HUD at
full legibility, each UI beat after its tilt-in, end card at −3 s. Check: type ≥ 36 px except UI copy, safe margins, no
stray orbs/discs (see gotchas), accent word readable on the field (ink on ember, cream face).
Gates: holds < 5 %; scene changes 7–12/min; hard cuts ≤ 2.5/min (list them: `ffmpeg -i out.mp4 -vf "select='gt(scene,0.33)',showinfo" -f null -`);
motion ≥ 7 (aim 8+); brightness 0.20–0.35; LUFS −12…−13; brand reveal 25–35 %; CTA ≥ 4 s.
Gotchas (all hit while building the sample):
- **Show with `visibility:'inherit'`, never `'visible'`.** `K.screenPos` seeks the timeline at build time; GSAP then writes a
  reverted computed value inline, and an inline `visible` child shows through a hidden parent (stray zoom discs everywhere).
  Inside a spanned group toggle children with opacity. `K.span` already does this.
- Call `K.screenPos(el, T)` after every tween that moves `el` (camera hops included) — it reads the timeline state at T.
- Slam entrances ramp opacity over the 4 in-frames and zoom-throughs grow area ≤ 25 %/frame; otherwise QA counts hard cuts.
- A one-frame swap from dark UI to the bright field is a cut — cross-dissolve 8 f under the sweep band.
- Dark panels on a dark ground add almost no measured motion; motion comes from camera hops, streaming content (rows that
  keep arriving, cards on 8ths), drum-pumped light, bright fields with moving texture. Per-second check:
  `python -I assets/motion_curve.py out/<name>.mp4` (same metric as QA, per second) and fix the low seconds, not the average.
- SVG `<text>` collapses double spaces: `K.chars` measures with `white-space: pre`.
- HUD on a field: pass `on:'field'` (cream face, ink accent, ink scramble tint) — gold on ember is unreadable.

Files: references/analysis.md · references/sources.md · assets/kit.js · assets/template/ · assets/motion_curve.py

## Later evidence
Added after the skill was written (read when extending the style):
- `references/reddit-saas-addendum.md` — Breakout (light-violet skin) and What a Story VO-variant launch films with early brand reveal
