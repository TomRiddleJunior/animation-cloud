# Paper-trail: a vertical, documents-on-a-desk satirical "how-to" reel (rap VO, numbered red STEP cards)

Analysed 2026-10-27 from `insta/frames/De7LQ5tPx85/` (metrics, sheets) and from my own frame work on the 720×1280, 30 fps MP4:
- 2 fps contact sheets over the whole reel (`samples/paper-trail/scratch/src/sheet2fps_*.jpg`)
- 30 fps strips for 1.2 s around every transition type (`f30_*.jpg`: splat-in, card exit, stamp, word reveal, counter, card-deck flip, ruler tumble, end blot, opening)
- full-resolution stills with pixel sampling for the palette (`full_*.png`)
- an onset/autocorrelation tempo probe of the soundtrack
- histogram/motion probes that re-implement the analyzer (`scratch/hist_probe.py`, `motion_probe.py`, `colour_probe.py`)

Values marked *inferred* could not be measured.

---

## 1. Identity

A **satirical step-by-step "how to profit from X" rap**. Every frame is a **paper document lying on a pale warm-grey desk**: a summons, a share certificate, a calendar, an earnings-call transcript with yellow highlighter, a buy-order slip, a price chart, pension statements, a stamped map, a war-loan bond, a schoolbook page, a verdict slip, and so on. Each line of the verse gets its document as **evidence**.

Each document is drawn flat: vector paper with soft texture, real typography and a soft drop shadow. Blurred, out-of-focus sheets lie behind the hero sheet. A few illustrated props sit on the same desk: a rifle, a speakerphone, champagne coupes, coins, a medal, keys, a saw.

The structure is a numbered list. Each **STEP n** opens on a **full-bleed red card** (cream "STEP" + underline, a huge numeral) that splats in like spilt ink and is torn away to reveal the next document.

- **Captions:** big bold serif with a cream halo, centred at ~69 % height. Words appear one at a time on the beat, and one judgement word per line is red.
- **Red** belongs to the cards, rubber stamps (which spatter ink), handwriting, price tags, chart heads and the caption's key word.
- **Top-right tag:** a small black "STEP n" that tells you where you are.
- **Opening:** a 4 s dark cinematic plate (line-art cannon fires → night battlefield).
- **Ending:** a twist line that implicates the viewer's pension, then a black ink-blot wipe to a **poll card** and a small wordmark.

## 2. Source analysed

| id | account / title | dur (s) | cuts/min | scene changes/min | median shot / scene (s) | motion mean / p90 | hold_frac | colourfulness | WPM | LUFS |
|---|---|---|---|---|---|---|---|---|---|---|
| De7LQ5tPx85 | @belltakesocial: "[REMASTERED] So you want money from war?" (Instagram reel, ~29k likes, original audio, long source list in caption) | 165.5 | 6.16 | 18.49 | 10.38 / 2.41 | 11.8 / 23.4 | 0.053 | 22.8 | 185 | −14.1 |

Further measurements:
- 720×1280 9:16, 30 fps, AAC 48 kHz
- brightness 0.745, saturation 0.167, dark-frame fraction 0.067, silence 1.2 s (only at the end)
- 17 hard cuts, 3 in the first 15 s
- animated_frac 0.915 (code-drawn, flat)
- motion by decile: 17.5 · 7.7 · 13.2 · 10.9 · 13.9 · 12.0 · 11.6 · 13.4 · 10.1 · 7.8

K-means palette:

| colour | share |
|---|---|
| `#cfc9b9` | 24 % |
| `#bcb5a3` | 19 % |
| `#e3dfd4` | 16 % |
| `#ebe9e4` | 16 % |
| `#221e19` | 9 % |
| `#c23c1b` | 7 % (the red) |
| `#a79b86` | 6 % |
| `#6f6757` | 3 % |

## 3. Measured pacing

| quantity | value | what it means |
|---|---|---|
| steps | **13 steps + "Last step"**, every **4 bars at 88 BPM** (10.9 s); step 12 is 2 bars | the verse grid *is* the edit grid. "Step n" falls on a downbeat, and the red card is up on that beat |
| scene changes | 18.5/min (51 histogram events in 165 s), median 2.4 s | per step: card in · card out · 2–3 document swaps. The detector counts frame-filling white vs. desk-grey changes, the dark plates and the red cards |
| hard cuts | 6.2/min | only the hook cuts, some splat-ins and the rips. Most document changes are drops, slides and camera moves |
| motion | mean 11.8, median 6.9, p90 23.6 (6 fps, 160×90 grey diff) | something is always moving: the camera trucks along a chart, tilts down a calendar, pulls back over a pile, and documents fall in |
| hold_frac | 0.053 | the only static moments are the red cards (0.6–1.3 s each) and the end poll |
| colourfulness | 22.8, median 17.2 per 1 s sample | desk and paper ≈ 12–20; each red card ≈ 70–108 (usually caught on 1 sample, since cards hold ≈ 1 s) |
| WPM | 185 overall | a rap: the flow never stops (1.2 s total silence) |
| card holds | 0.6–1.3 s full red (step 1: 0.75 s; steps 2 and 7: 1.2–1.3 s; step 8: 0.6 s) | long enough to read "STEP n", never longer |

### Timed shot list (source, s)

**Hook (0–11.9)**
- 0.0–0.17: black plate, line-art field gun (cream strokes).
- 0.17: it fires. The flash lifts the background to warm grey. A layered flame is thrown up-right (red shell with a dark outline → orange → gold → cream core), with ring shock-waves, then brown smoke puffs with pale line-art rims.
- 0.7: hard cut to a night battlefield panorama: silver line-art, mist band, a red flare, a shell streak.
- 1.5–3.8: caption "So you want / money from war?" in cream, with "money" in red. An explosion grows on the horizon. A "REMASTERED" stamp hits (specific to the repost).
- 4.0: cut to the desk. An illustrated rifle hangs top-left.
- 5.3: a SUMMONS slip drops under it, and "CALLED UP" stamps on with ink spatter on a stressed lyric word.
- 7.0: speakerphone; 8.5: COMMON STOCK certificate drops in; 10.5: ticker-tape strips slide.

**Steps 1–3**
- 12.0: red splat → STEP 1 card.
- 13.0: torn rip to the January calendar. The camera tilts; red pen strokes cross off days; a circle on the 25th.
- 14.5: an INVASION stamp; red ink drops fall.
- 15.5: earnings-call transcript, mono type, with yellow highlights sweeping. The camera scrolls, then blurs it; the key quote card sharpens over the blur.
- 23.2: STEP 2. ORDER slip (BUY ☒), then a postmark stamps it.
- 26–34: long line chart on graph paper. The camera trucks right while the line draws; explosion icons sit at named towns; a red price tag rides the line head. A news clipping slides in.
- 34: STEP 3. Defence-company certificates tumble into a pile, then a pull-back over hundreds of pension statements (each made out to an ordinary worker).

**Steps 4–7**
- 44.7: STEP 4. "US AID" sheet with a black odometer rolling to $175,000,000,000, a slam card "$175 BILLION".
- 47–53: US map with money bundles pinned to towns; a red route line to Europe; a ≈70 % stamp; a "Thank you" card.
- 55.5: STEP 5. Rifle (silent), then oil-barrel labels with price tags, a "RECORD" stamp, Brent chart.
- 61: frost vignette (the cold-homes line), a thermostat dial, a TV-remarks slip with highlight.
- 64: certificates fly in (buy-backs).
- 66.6: STEP 6. Company name cards blow away. VALUATION sheet: 100 % struck through, −50 %, APPROVED stamp. Car plant line drawing; a coin and keys slide in.
- 74: oligarch count-up 110→125 with a RECORD stamp; champagne coupes clink in from the bottom corners.
- 78: STEP 7. An "ice" document (sanctioned assets, blue-grey frost), €0.0 → €6.9 bn counter, a ruler, a Belgian-tax stamp, a Ukraine map, an invasion map with red arrows, a kraft folder.

**Steps 8–10**
- 88.4: STEP 8. WAR LOAN bond with interest coupons, an ARMISTICE stamp.
- 93–97: a ruler tumbles through the years 1926…2015 with handwritten "grandchildren" notes and a LAST PAYMENT stamp.
- 97: schoolbook page "The Great War" in a dark brown book frame.
- 99.3: STEP 9. Debt gauge, Acceptance form, a photo, a GDP chart with red handwritten "go on!", a coin stack.
- 110: STEP 10. "AID" crate on a Ukraine map; a pin; ground cross-section strata with a saw; agreement page with highlight.

**Steps 11–13**
- 121.4: STEP 11. Board-of-directors sheet with portrait plates, SECRETARY OF DEFENSE plaque, revolving-door diagram.
- 132: STEP 12 card, then a **deck of red step cards 11…3 flipping past** (on a line about skipping ahead); a banknote; VERDICT slip with a 13 YEARS stamp; a medal and a CONTRACT envelope.
- 137.4: STEP 13. **Dark map plate** (silver line-art, building icons) with a trust prospectus card.

**Ending**
- 148.6: LAST / STEP card. Pension-enrolment form with the default box ticked; pension statements; holdings list with highlighter; SHAREHOLDER stamp on "you".
- 159.0: black ink-blot covers, holds 4 f, recedes, revealing the **poll card** "Who profits most from war?" (4 options, "Results after you vote") and the wordmark. Held ~6 s; the music fades.

## 4. Script & narrative structure (beat map of the source)

| % runtime | beat | content (described, not quoted) |
|---|---|---|
| 0–7 | **two-line hook** on a dark cinematic plate, the title question | title question + a line handing the fighting to someone else |
| 7–8 | desk intro: the cast of documents and props, plus a promise | premise couplet: what the viewer holds instead |
| 8–90 | **numbered steps**, each = 4 bars = 2 rhyming couplets; the first line starts "Step n:"; inner lines are short imperative punches | 13 escalating mechanisms, each with one document as evidence and one red judgement word |
| 90–96 | **the do-nothing final step**: the turn | three-word resolution |
| 96–100 | **twist aimed at the viewer**, poll | twist line implicating the viewer's pension → poll card |

**Writing rules**
- Second person, imperative, deadpan (euphemism swaps delivered as instructions). Every claim is sourced in the caption.
- Escalation builds from the personal to the systemic.
- Each step ends on a punch word that is the red caption word and often the stamp.
- One line per document; the step's last line carries the joke.

## 5. Visual system

### Palette (sampled from full-res frames, 5×5 means)

| role | hex | notes |
|---|---|---|
| desk top → bottom | `#d6cdbe` → `#aba192` | screen-space vertical light falloff; fine horizontal streaks (brushed plaster/wood) |
| paper white (forms, calendar, verdict) | `#eceae4`, `#edebe5` | cool off-white |
| warm paper (charts, graph) | `#ece6da` | |
| cream / bond / ruler | `#eae1cf` | |
| ink | `#1e1812` (labels `#1c1914`) | never pure black |
| caption red / tags | `#c13c24` | |
| card red | `#c73b1c`, with fine grain | |
| stamp ink | `#c43d24`, distressed (≈ `#ca705f` average) | |
| card numeral / halo cream | `#f8efe4` / `#f3ece3` | |
| certificate green | `#3d5544` | |
| highlighter | `#e3cf47` | |
| odometer plate | `#1d1a16` | |
| dark plate | `#25231f`, silver line-art `#bdb8ad` | |
| poll card | `#f0eeea`; text `#1f1d1a`; note `#6f6a62` | |
| accents | phone body `#45403b`, medal gold `#bb9c62`, ribbon red `#be3a1b` | |

### Typography (engine fonts in brackets)

Sizes are given as a fraction of frame height H, then in px at 1920.

| use | look | engine font | size |
|---|---|---|---|
| captions | bold serif, tight (−1 %) | [Lora 700] | ≈ 0.036 H (69 px); line height 0.045 H (86 px) |
| caption halo | cream stroke ≈ 9–10 px at 1080 width, soft dark drop shadow below | | |
| document headlines | wide heavy grotesque, tracked +2–5 % (VERDICT, SUMMONS, COMMON STOCK, WAR LOAN) | [Archivo Black] | 0.03–0.05 H |
| document body | book serif (italic sub-heads) | [Libre Baskerville] | |
| document slugs, forms, transcripts | typewriter | [Courier New bold] | 0.012–0.016 H |
| hand notes | red marker script | [Caveat 700] | |
| "STEP" card label | heavy sans, tracked +7 % | [Archivo Black] | 0.05 H |
| card numeral | the same face | | ≈ 0.36 H (cap height 0.26 H), right-aligned at 90 % W |
| top-right tag | heavy sans with cream halo | [Inter 800] | 0.017 H |
| poll | UI sans | [Inter] | question 0.027 H, options 0.021 H |

### Layout grid and safe zones (fractions of W × H)

- **Hero document zone:** y 0.04–0.62. Docs often bleed off the top or one side; the bottom of a doc may pass under the caption (calendar, chart).
- **Caption block:** first baseline y ≈ 0.695, centred at x 0.5, max width ≈ 0.83 W, ≤ 2 lines.
- **STEP tag:** right edge x 0.917, baseline y 0.16.
- **Red card:**
  - "STEP": x 0.09, baseline y 0.27
  - underline: y 0.29–0.30, w 0.31
  - numeral: cap y 0.35–0.61, right edge x 0.90
  - the caption still runs on top of the card
- **Instagram UI:**
  - The bottom ≈ 18 % (y > 0.82) carries only desk or the bottom of a document, never text.
  - The right rail (x > 0.88) is used only by the small STEP tag, which sits above the rail's buttons.
- **Poll card:** x 0.055–0.945, y 0.2–0.55; wordmark centred at y 0.6.

### Texture and light

- Paper: subtle blotch and fibre noise.
- Desk: horizontal streaks plus a vertical light falloff (lighter top, darker bottom ≈ −20 %).
- Shadows: every document casts a soft, offset shadow (blur ≈ 1.5 % W, y-offset ≈ 1 %) that grows during a drop.
- Background sheets: out of focus at blur 6–8 px.
- No vignette except the frost effect and the dark plates.

## 6. Characters & objects

- **No characters.** People appear only as portrait plates on documents (the source uses real officials, which an original piece must avoid) or as job roles in the text (ordinary workers).
- **Props** are flat-shaded illustrations with a slight top-light gradient and a drop shadow. They enter with the same fall-from-camera move as the documents.
  - money objects: coins, banknote, keys, medal
  - drinks: champagne coupes, which tilt in from both bottom corners and clink
  - tools: rifle, speakerphone, saw, crate
- **Data on paper:**
  - mechanical odometer counters (black plate, white mono digits rolling with a carry)
  - line charts on graph paper with a red dot and a price tag riding the head
  - gauges, rulers and timelines
  - isotype rows (black building icons)

## 7. Camera & transitions catalogue

| name | mechanics (30 fps) | frequency |
|---|---|---|
| **red splat → STEP card** | a red droplet appears 2–3 f before; a blob with stepped soft rims (3 bands) grows from off-centre and covers the frame in 3–4 f; "STEP" and the numeral fade in over 2–3 f | every step |
| **torn rip exit** | the red sheet is torn away upward in 2–3 f; a white fibre edge is visible on the tear; the next document is already in place | most steps |
| doc **fall from camera** | 6–8 f: scale 1.4–1.6 → 1, blurred and half-transparent → sharp, rotation ±8° → final; the shadow tightens; a tiny skid | ~2 per step |
| doc **slide in / out** | 8–10 f with motion blur, power3.out; exits power2.in | ~1 per step |
| camera **truck / tilt** along a long document (chart, calendar, ruler, transcript) | 2–6 s continuous; a red head and tag follow the line | ~1 per step |
| **pull-back** over a pile (certificates, pension statements) | 1–2 s, expo.out | 3× |
| **stamp slam** | 2 f (scale ≈ 1.5 → 1, opacity 0 → 0.9), then 10–15 red droplets fly and fall over ~20 f | ~1 per step |
| **highlighter sweep** | 6–10 f, left → right, multiply yellow | 6× |
| **red hand annotation** | strokes draw on in 8–15 f (circles, strikes, arrows, "go on!") | 8× |
| **odometer roll** | 1.5–2.5 s, power2.out, last digits blur | 3× |
| **card-deck flip** | a fan of red step cards flips past (on a line about skipping ahead) | 1× (step 12) |
| **dark plate** | hard cut to a dark line-art map or plate (silver strokes, mist) | opening + step 13 |
| **black ink-blot wipe** | covers in 4 f, holds 4 f, recedes in 6 f to reveal the poll | end |
| **frost vignette** | white frosted edges grow in (winter) | 1× |

## 8. Motion grammar

| element | build | frames @30 | ease |
|---|---|---|---|
| caption word | opacity 0 → 1 at the word's onset (the unrevealed rest of the line is already laid out) | 3–4 | power1.out |
| caption line out | fade + rise ≈ 3 px | 3 | power1.in |
| doc drop | as §7 | 6–8 | power2.in, then a 6 f skid |
| splat | droplet, then blob | 3 + 3–4 | power2.in |
| card numeral | fade | 2–3 | linear |
| card rip | translate up off-frame | 2–4 | power2.in |
| stamp | slam + spatter | 2 + 20 | power4.in, gravity |
| count-up | odometer with carry | 45–75 | power2.out |
| camera | continuous travel: truck, tilt, push or pull | 60–180 | sine/power1.inOut, never static on a document |
| idle | slow float, ±1 % breathing | — | — |

## 9. Sound

- **Music:** a hip-hop beat at **88 BPM** (kick/snare autocorrelation 88.0 and 87.75; hats 8ths). The beat runs constantly under the rap and stops for the poll (the RMS drops 15 dB in the last 5 s).
- **VO:** one male rapper at **185 WPM**, close-miked and dry.
- **Grid:** a step is 4 bars, and "Step n" falls on the downbeat with the red card.
- **SFX** *(inferred; low in the mix)*: paper swishes on drops, a thud on the stamps, ticks on the counters.
- **Loudness:** −14.1 LUFS integrated; RMS flat at −16…−17 dB per 5 s window.

## 10. Do / Don't

**Do**
- One document per line; red only on judgement.
- Keep the camera moving across every document; lay the caption over the document if it must be there.
- Use the 4-bar step grid, and put a red card on every step.
- Write in deadpan second person.
- Source every number.

**Don't**
- Put captions in the bottom 18 %.
- Use more than 2 caption lines.
- Use coloured backgrounds other than the red card and the dark plates.
- Copy the account's wordmark, the "REMASTERED" tag, the source's repeated lyric formula or real people's faces.

## 11. Formation rules (to make another reel like it)

1. Pick a system that pays someone (war, a bubble, a monopoly, a tax loophole). Write **5–13 numbered "steps"** in deadpan second person, plus **a do-nothing final step**, plus **one twist line that implicates the viewer**. End on a **poll question**.
2. Put the verse on a **4-bar grid** (88 BPM ⇒ 10.9 s per step). A shorter reel can use 3 bars per step, with the label line on the downbeat.
3. For every line, choose **one paper artefact** that proves it (a form, chart, certificate, ledger, news clipping, map, stamp-able slip) and **one red word**.
4. Every step opens with a **red splat STEP card** held about 1 s and torn away. A small **STEP n** tag then sits top-right until the next card.
5. Inside a step, change composition every 2–3 s:
   - drop a document in
   - truck along it
   - push or pull
   - slide the next one in
   - stamp
   - highlight
   - annotate
6. Bookend the reel with dark line-art plates: a cinematic hook at the start, and optionally one late **dark plate** for the darkest step.
7. End with an **ink-blot wipe** → poll card + small original wordmark, holding 3–6 s while the music resolves.

## 12. Notes on this source

- The REMASTERED stamp marks a repost, so leave it out.
- Some portraits and logos of real companies and officials appear in the source. An original reel should use anonymous roles, invented brands, or historical subjects.
- The caption lists the sources; on-screen source lines are rare (some charts carry a tiny mono source line).

## Comparison: what makes "paper-trail" distinct from dossier-editorial

| | dossier-editorial (16:9, 正确君 excerpt) | paper-trail (9:16 reel) |
|---|---|---|
| format | 1920×1080, music-led cold open | 1080×1920 vertical, **rap VO wall-to-wall at 185 WPM** |
| desk | torn protest posters, collage, beige/salmon/slate | **one plain pale warm-grey desk** with fine streaks and a light falloff; blurred background sheets only |
| structure | a crisis narrative in chapters | **a numbered list**: STEP n red cards on a 4-bar grid, "Last step", a twist at the viewer, a **poll card** |
| between documents | **whip pans with heavy motion blur** on one continuous desk | documents **fall from the camera** or slide in; the camera trucks, tilts or pulls back along documents; steps change through **red ink splat → card → torn rip** |
| red | rationed to stamps and counters | stamps **plus the full-bleed step cards**, the caption keyword, hand annotations and chart heads |
| captions | none or bilingual headings on the documents; a HUD | **karaoke captions**: bold serif with a cream halo at 69 % height, word by word, one red word |
| HUD | programme / chapter / date / source on every sheet | only a small "STEP n" tag top-right |
| typography | Chinese Song + typewriter + small caps | Lora-like bold serif captions, wide grotesque headlines, Courier slugs, Caveat hand notes |
| set pieces | iris, word-card montage, isotype on a 3-D desk, torn-hole iris, nested pull-back | dark cinematic hook plate, odometer counters, a chart truck with a riding price tag, pile pull-backs, a card-deck flip, a late dark plate, an ink-blot → poll |
| pacing | 9.4 scene changes/min, motion 7.6 | **18.5 scene changes/min, motion 11.8**, cuts 6.2/min |
