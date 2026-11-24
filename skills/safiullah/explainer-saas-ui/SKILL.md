---
name: explainer-saas-ui
description: "Voice-over-led SaaS / AI product UI walkthrough explainers. The rebuilt, idealised product interface is the whole set: vector UI (not screen recordings), a choreographed cursor with hover/click ripples, zooms into components, click-to-swap state changes, card stacks, hub-and-orbit integration diagrams, typed feature headings, a restrained palette with one accent, and a logo-matte lock-up with a clicked CTA. Use it for \"product explainer\", \"SaaS explainer\", \"app walkthrough / feature tour\", \"AI product demo video\", \"explainer like Notion / Synoptix / Marvin / Membrain Elevate\", \"What a Story-style video\", or a startup landing-page video with narration. It has three skins: Gradient AI (white/lavender glow, the default), Calm Workspace (plain white, Notion-like) and Dark Glow (charcoal with teal/crimson glows, Elevate-like). For music-led launch films with no VO, use explainer-launch-promo. Builds on explainer-engine."
---
# SaaS / AI product UI walkthrough ("the interface is the set")

> `ENGINE` = `~/.claude/skills/explainer-engine/engine` (the **explainer-engine** skill: renderer, voice, score, QA). Rendered sample of this skill: `the sample film (the render is not included in this repository)` (source in `assets/sample/`).

In this style one continuous camera ride crosses an idealised, rebuilt version of a product. A kinetic line states the pain. A logo-matte zoom then swallows the chaos and lands the brand. After that, each voice-over clause gets exactly one UI moment: a panel unfolds, a cursor glides on a curve, hovers and clicks, a list cascades in, or a card flies onto a board. There are almost no hard cuts. Scenes hand over through camera moves, masks and an anchor object that persists, such as the logo mark becoming the app icon and then the sidebar logo. Colour is the most restrained in the corpus: a neutral ground, one accent family, and at most ~4.5 % saturated pixels. The film ends on a near-still logo lock-up with a single CTA. The style was built from frame analysis of 6 source videos (4 VO-led, 2 music-led; references/sources.md). **Original work only.** Invent the product, brand, logo, UI and data. Never recreate a real product's interface, never put real third-party logos on orbits, and never copy taglines.

## 1. Signature traits
- **The product UI is the hero of ≥ 70 % of frames.** It is rebuilt as HTML/SVG components at native scale and shot 1.3–1.9× zoomed. Large text is believable; small text may be greeked.
- **The cursor is the protagonist.** It glides on bezier paths in 0.5–0.8 s (power2.inOut), hovers 4–6 f before each click, squashes to 0.86 for 2 f on the click, and leaves a 12-f ripple ring. Every click has a click SFX.
- **No cuts, only rides.** Moves are camera push/pull (power2.inOut), click-to-swap with a 30-px upward settle, panel unfold in mild 3D, and hub collapse into the app. The logo-matte zoom is used twice, as a bookend.
- **Kinetic headings (A2).** The hook line rises word by word on the spoken words and re-centres as it grows, with the key word at 1.6× in the accent. Each feature gets one typed heading on a glass chip with a muted sub-label.
- **One accent family on a neutral ground.** The accent goes only on the logo, the CTA, the key word, progress strokes, unread dots and the chromatic glow under hero cards.
- **The camera never fully stops (A2/A3).** It drifts 30–100 world px/s with a slow push, blobs breathe, rings rotate and orbits spin. A1 (Notion-like) holds instead.
- **Avatars, never bodies.** People appear only as circular avatars with a white ring.
- **Bookended ending.** The same logo-matte zoom returns, followed by wordmark, tagline, a CTA pill the cursor clicks, and a URL in the accent. The end card holds ≥ 3 s.

## 2. Target metrics
The QA tool compares the render against these (`out/qa/metrics.json`). The sample is `the sample film (the render is not included in this repository)`, 59.6 s.

| metric | source range (A: Notion/Marvin/Synoptix/Elevate) | target | sample |
|---|---|---|---|
| scene_changes_per_min | 1.9–7.7 | 2–8 | **6.0** |
| scene_len_median s | 4.3–10.7 | 5–10 | **7.6** |
| cuts_per_min | 0–2.7 (cuts = act changes / click swaps) | 0–2 | **0** |
| motion_mean / p90 | 5.6–8.0 / 11–19 | 5–7 / 10–16 | **4.2 / 8.9** (see note) |
| hold_frac | A2/A3 0.01–0.10 · A1 0.30–0.45 | ≤ 0.10 (A2) | **0.089** |
| colourfulness | 14–29 | 15–30 | **24** |
| brightness | light skins 0.81–0.98 · A3 0.20 | ≥ 0.85 (light) | **0.97** |
| WPM | 129–153 | 130–150 | **146** |
| LUFS | −11.6 to −16.3 | −12 to −15 | **−13.7** |

**Notes on what moves these metrics in a light skin.**
- *Scene changes.* The analyser uses a 64-bin colour histogram at 4 levels per channel, so white, `#F6F4FD` and pastel lavender all fall in **one bin**. Re-framing a white UI never registers as a scene change. A change registers only when ≥ 28 % of pixels change bin. Three devices do that without a cut, and the sample uses all three:
  - the logo-matte halves at **scale 7** (they cover ~40 % of the frame for ~6 f);
  - the **centre wash** (`bg.washTo`, a lavender with G < 192) raised behind hub and statement acts and dropped for UI acts;
  - a **modal scrim** (`rgba(38,26,104,.30)`) over the window while the assistant panel is open.
- *Motion.* The metric is content-limited. A white UI with negative space produces little grey change when it drifts, and a diagram on a smooth wash produces even less. The sample sits ≈25 % under the source mean on purpose: drift is capped where reading suffered. To get closer, raise `vx/vy` on camera keys (drift is in world px/s), use longer 1–1.4 s glides between framings, and keep UI density high. Do not add shake or whips.

## 3. Script formula
| % runtime | 60-s spot | beat | how |
|---|---|---|---|
| 0–12 | 0–7 s | **Hook: pain.** Patterns: pain statement ("Your team's work is everywhere."), pain question, a stat you can stand behind, or a contrarian line. | kinetic line word-synced; scattered tool cards pop on each listed noun; the cursor darts between them; one important card slips away |
| 12–25 | 7–15 s | **Name reveal.** "Meet X. One-line promise." | logo-matte zoom (T6), the mark slides left, wordmark letters stagger in (2 f), a 3-word tagline appears as a kinetic line, glint |
| 25–80 | 15–48 s | **3 feature beats, 8–12 s each.** Each is one VO sentence plus a short follow-up, one hero UI state and one micro-interaction. | F1 hub-and-orbit then collapse into the app window (cascade list, click a row, toast). F2 sidebar click, panel unfold, typed prompt, typing dots, answer card that grows. F3 click the button, cards fly to the board, owners and dates pop, one card moves on its own, toast |
| 80–90 | 48–53 s | **Outcome / proof.** A parallel short-line pair ("Less switching. More finished work.") plus the team | zoom out, kinetic two-liner on the wash, avatar row, an "Up next" chip |
| 90–100 | 53–60 s | **CTA.** "X. Tagline. Try it free at x dot app." | matte bookend, lock-up, CTA pill pops (back.out 1.8), cursor clicks it, URL in accent, hold ≥ 3 s |

- **Voice.** Kokoro `af_heart` at speed 1.0 for a warm, brisk ad read. Use `am_adam` at 0.95 for a measured A3 read, or `bf_emma` at 0.92 for calm A1. Settings: lead 0.5 s, tail 3.0–3.6 s (the end-card hold), gap 0.35 s inside a beat and 0.7–0.8 s at feature boundaries (the transition breath). That gives 140–150 WPM overall at ~185 WPM while speaking.
- **Writing.** Use parallel lists ("Chats in one app. Docs in another. Tasks, somewhere in between.") and land one noun per UI state. Name the product as the first word of a feature line ("Kitewise plugs into…") so the logo has a word to sync to. Keep claims qualitative for invented products (no fake stats). Spell domains phonetically ("kitewise dot app").
- **Sync.** `K.at(line, word, nth)` returns the word start minus 2 frames. UI changes land on the stressed noun. `X.word` matches prefixes, so "own" also matches "owners"; pass `nth` when a word repeats.

## 4. Visual system
**Skins** (`K.skin(name)` sets CSS vars on #stage; `K.skinAt(t, name)` flips the palette at an act boundary):

| role | glow (A2 Gradient AI, default) | calm (A1 Calm Workspace) | dark (A3 Dark Glow) |
|---|---|---|---|
| ground / surface / surface2 | #FBFAFF / #FFFFFF / #F6F4FD | #FCFCFC / #FFFFFF / #F4F2EF | #151619 / #25282C / #1D2023 |
| text / muted / line | #17152B / #8B87A3 / #ECE9F6 | #2C2B2B / #A09D99 / #E9E9E7 | #F1F1F4 / #9C9496 / #34383D |
| accent / accent2 / soft | #5B3DF5 / #8F7DFF / #EEEAFF | #2F6FDB / #69A0EC / #EAF1FC | #46AF98 (teal) / #D8216D (crimson) / #1E3833 |
| blobs (corner glows) | #D9CEFF · #D3E4FF · #F4DAF2 | none | #225751 · #5F2537 · #1E3A44 (+ `noise: .02`) |
| centre wash | #B9ABF6 → #CBC0FA | very light #E9F0F7 | #1F4A45 |
| under-glow (hero card, CTA) | #8B6BFF → #D77BF2 → #69C9FF | none | teal → crimson |
| cursor | brand: accent arrow, white rim | OS: black arrow, white rim | outline: white arrow, black rim |
| shadow | rgba(52,36,140,.10), 0 18–30 px 48–80 px | rgba(0,0,0,.10) | rgba(0,0,0,.35) |

- **Calm skin swaps.** Drop blobs and wash (`K.background({blobs: []})`), drop headings (A1 has no titles), use emoji or multicolour icons and the OS cursor. For context shots, zoom out to the window on a flat blue desk `#5B91AE` (set `--bg`). Hold 1.5–3 s after each interaction (hold_frac 0.3–0.45). Use the `lofi-piano` or `curious-marimba` preset at −16 LUFS.
- **Dark skin swaps.** Teal and crimson corner glows, light captions decoded letter by letter (`K.decode`), stat rings with rotating gradient strokes (`K.ring`), dashboards on steep 3D planes (`K.plane` + rotationX 45–50°, rotationZ −14°), a blob wipe (`K.blobWipe`) at act breaks, the URL in crimson. Flip to white cards only for the final "act" beat (`K.skinAt`).
- **Typography** (engine fonts):
  - UI: **Inter**, 400–700. Body 16–19 px and titles 19–21 px at native scale, read at 1.3–1.9× zoom.
  - Kinetic line: Inter 600 at 84–92 px; key word 1.6× in Inter 700 accent, −0.035em.
  - Feature headline: Inter 650 at 50–54 px, typed at 24 cps, with a 22–24 px muted sub.
  - Wordmark: **Poppins** 600 at 132–150 px, −0.035em, lowercase.
  - Tagline: 44–46 px muted with the key words in the accent. URL: 34–36 px accent 650.
- **Shapes.** Cards r 16–24, chips and pills fully round, app-icon tile r = 24 % of its side. Avatars are circles with a white ring. Cards have no outlines (fill contrast plus soft shadow only), 1 px hairlines and 2–2.5 px connector lines. Never use a shadow darker than 15 %.
- **Composition.**
  - Context shots: the window at ~75–85 % of frame width.
  - Zoomed shots: one component fills 60–90 % of the frame and its neighbours bleed off.
  - Statements: centred with ≥ 50 % negative space.
  - Hub: dead centre, orbit about 68 % × 50 % of the frame.
  - Headline chip: top-left at (96, 72).
- **Texture.** None (clean digital). Dark skins get invisible anti-banding noise only.

## 5. Characters & objects (assets/kit.js)
| need | call | notes |
|---|---|---|
| app window | `K.win(parent,{x,y,w,h,search,me})` → `{wrap, el, bar, body}` | the title bar has neutral dots, a search pill and an avatar; `wrap` is a perspective plane |
| sidebar | `K.sidebar(body,{brand,items,spaces})` → `{rows[label], logo}` | active row is white with a soft shadow; badges in accent-soft |
| list row / chip / button / toggle | `K.row`, `K.chip`, `K.btn`, `K.toggle().flip(t)` | `row.dot` = unread dot to clear |
| cards / glass | `K.card(p,{x,y,w,h,glow,glass})` → `{el, body}` | `glow` adds the chromatic under-glow (sibling behind the card) |
| chat | `K.bubble({who:'me'|'ai'})`, `K.dots().run(t0,t1)` | the user bubble is accent-filled |
| data | `K.areaChart().draw(t)`, `K.bars().grow(t)`, `K.ring().count(t,dur,from,to)` | the ring's gradient rotates at 55°/s; the unit fades in last |
| people | `K.avatar({seed,size})`, `K.avatarStack(seeds,{x,y})` | original vector busts (5 hair styles, glasses, skin tones); pass x/y to measure the stack width |
| icons | `K.icon(name)`, `K.glyph(p,name,{tone:1..5})` | 30 original line icons inside tinted rounded squares |
| brand | `K.markSVG({size})`, `K.wordmark(p,{text,size})`, `K.appIcon(p,{size})` | the kite mark is two chevron halves around an open window, plus a spark. Replace it with your own mark (keep two halves for T6) |
| cursor | `K.cursor()` → `.jump .show .hide .move .click .clickOn(target, tClick, {hoverEl, press})` | targets are `[x,y]` in screen space or `{el, cam, ax, ay}` anchored to the world (they follow the camera) |
| background | `K.background({breathe, drift, noise})` → `.washTo(t, op, dur)` | wash calls must be in time order |
| toast | `K.toast(p,{title,sub,icon,tone,x,y}).show(t, hold, {sfx})` | expo.out 12 f in, power2.in 8 f out |

## 6. Motion grammar
| move | ease | frames @30 | use |
|---|---|---|---|
| camera reframe | power2.inOut (scale interpolated in log space) | 20–40 (0.7–1.4 s), then drift | every 2–4 s; drift vx/vy 30–100 world px/s, vs 0.01–0.02/s |
| element enters (cards, panels, toasts) | expo.out / power3.out | 10–16 | cards and panels never overshoot |
| round things pop (avatars, icons, hub, CTA) | back.out(1.8–2.2) | 10–12 | 6–10 % overshoot |
| exits / mask closes | power2.in | 6–10 | |
| list cascade | power3.out + horizontal blur 14→0 | 11 per row, 2-f stagger | T2 |
| kinetic word | power3.out, y +14 → 0 | 6 per word, on the spoken word; the line re-centres in 8 f | key word tracks in from 0.32em over 11 f |
| typewriter | linear | 22–26 cps, caret blinks every 530 ms | prompts, headings |
| counters | power2.out | 1.0–1.5 s, unit fades in after | rings, dashboards |
| idle | sine / linear | continuous | blobs breathe at 1↔1.12 over 6 s; orbit 12–14°/s with a ±12 % tilt; hook cards bob 9–12 px |

Build order: container → structure → content → cursor enters → interaction → result (toast, count-up, chip). Never reveal more than one new UI region at a time.

## 7. Transitions (kit functions)
| # | name | call | frames | when |
|---|---|---|---|---|
| T6 | **logo-matte zoom** | `K.logoMatte(fx,{t, at, size, scale:7, hide})` + `.move()`, `.hideAt()` | 5 slide + 12 shrink + 12 plate lift | name reveal and end card (bookend); this is the strongest scene-change device |
| T8 | anchor morph | `m1.move()` the mark onto `K.appIcon` → `K.flyTo(icon.mark, t, dur, fnTarget)` to the sidebar logo | 18–22 | logo → hub → app (continuity without cuts) |
| T12 | hub-and-orbit | `K.orbit(world,{items, t, satT, linesT, speed, tilt}).pulse(i,t).collapse(t)` | 15 draw + 3-f stagger | integrations / "connects everything" |
| T13 | speed burst | `K.burst(p,{t,cx,cy})` | ~30 | as the hub forms |
| T2 | cascade list | `K.cascade(rows, t)` | ~20 | feeds, menus, sidebars |
| T4 | camera zoom page ↔ window | `cam.focus(el, s, t, {dur, ax, ay, vx, vy, vs})` / `cam.key()` | 20–30 | backbone of every feature beat |
| T11 | panel unfold | `K.unfold(panelEl, t)` (inside `K.plane`) | 15 + 2.4 s settle | assistant panels, dashboards |
| T3 | click-to-swap | `K.swap(oldView, newView, t, {drift:30})` | 0 + 9 | view switches on a click (feed → board) |
| T14 | card drop / fly | `K.stackDrop(cards, t)` or a fromTo from the source row's rect to the slot's rect | 5–16 | tasks landing on a board, time passing |
| T5 | iris | `K.iris(el, t, {cx, cy})` + `K.pop` | 14 + 4 | onto an avatar (A1) |
| T7 | blob wipe | `K.blobWipe(p, {t, from, hide})` → swap time | 30 | A3 act breaks |
| T10 | 3D card flip | `K.flip(el, t, {hide, show})` | 13 | A3 final white-card beat |
| T16 | logo glint | `K.glint(p, {t, x, y})` | 12 | on every logo landing |
| — | slow push | `K.zoomDrift([fx, logoL], [[t, s], …])` | — | lock-ups and the end card |

## 8. Sound
- `sound.json`:
  ```json
  {"preset":"tech-glow","bpm":100,"sections":[{"t":0,"energy":1},{"t":<reveal>,"energy":2},{"t":<feature 2>,"energy":3},{"t":<outcome>,"energy":2},{"t":<cta>,"energy":1}],"music_under_voice_db":-13,"sfx_db":-3,"lufs":-13.5,"end_hit":true}
  ```
  Energy peaks at 55–80 % of the runtime and calms in the last 10 %. Use `corporate-pluck` for a friendlier SaaS brand, `lofi-piano` / `curious-marimba` at −16 LUFS for A1, and `doc-pulse` at −12 for A3.
- **SFX on every UI event** (the kit declares most of them automatically):

  | event | SFX |
  |---|---|
  | cursor click | `click` |
  | pops | `pop` (pitch ladders on staggers) |
  | camera reframes | soft `swoosh` (gain .16) |
  | matte | `whoosh` + `sparkle` |
  | glint | `chime` |
  | typing | `type` |
  | send | `bubble` |
  | toast | `notif` / `success` |
  | card lands | `drop` |
  | view swap | `slide` |
  | hub collapse | `zoom_in` |
  | something slips away | `woosh_low` |
  | focus drains | `blip_down` |

  The sample has 93 cues in 60 s (~1 per 0.65 s, louder ones every 2–3 s).
- **VO** runs ~93 % of the runtime with breaths at feature boundaries. The end card carries one short line at most.

## 9. Build recipe
1. `cp -r assets/template <project>`. The template already contains a copy of `kit.js`, because the renderer serves only the project folder and `/engine/`. After the kit changes, refresh it with `cp assets/kit.js <project>/kit.js`.
2. Write `script.json` to the beat map (§3). Run `ENGINE/make.sh <project> --draft` early: it voices the script, and the scene reads `data/vo.json`.
3. In `scene.js`, call `K.skin()`, then `const bg = K.background()`, then create layers in z order: hook 10, app 11, hub 12, outcome 13, type 20, fx 25, logo 27, cursor 60. Give each act a `K.world` plus a `K.camera`; keys at the act start must carry the drift (`vx/vy/vs`). Base drift counts from t = 0, so add a `dur: F` key at the act start instead.
4. Build the UI at native scale inside the app world (window 1600×960 at 0,0). `K.rect(el)` gives the resting world rect (it sums offsets and ignores transforms). Use it for `cam.focus`, the cursor's `{el, cam}` targets and fly-card start/end rects. Compute rects **before** anything changes layout.
5. Per beat: camera key → element builds → `cur.clickOn(target, K.at(line, 'noun'), {hoverEl, press})` → result (toast, count, swap). Place the moves on the words.
6. Add scene-change devices at act boundaries: the matte (scale 7) at reveal and CTA, `bg.washTo` up for the hub and statement acts and down for UI acts, and a modal scrim when an overlay panel opens.
7. Check `node ENGINE/render.mjs <project> --stills t1,t2,…` at every beat, then run `ENGINE/make.sh <project> --skip-tts --workers 3` and read `out/qa/metrics.json`, `timeline.jpg` and `strips.jpg`.

## 10. QA checklist
- **Stills.**
  - Hook line fully on screen.
  - Matte halves big at t0 + 5 f.
  - The wordmark letters never overlap the sliding mark (start them ≥ 0.35 s after the slide).
  - Hub labels ≥ 22 px.
  - The window enters before the flying mark lands, and the sidebar logo stays hidden until then.
  - Zoomed UI text reads ≥ 25 px.
  - Headline chips don't cover the focal UI.
  - Toasts sit inside the frame.
  - The cursor is hidden whenever no interaction is coming. Watch for one left floating over the outcome.
  - CTA pill + URL centred, end hold ≥ 3 s.
- **Metric gates.** scene changes 2–8/min, cuts ≤ 2/min, hold ≤ 0.10 (A2), colourfulness 15–30, brightness ≥ 0.85 (light), WPM 130–150, LUFS −12 to −15. If motion is < 4, raise the drift.
- **Do.**
  - One UI moment per VO clause.
  - Same device at open and close.
  - World-anchored cursor targets.
  - `fromTo` for anything tweened twice.
  - Precompute the answer-card growth with `clip-path` instead of animating height, so rects stay valid.
  - Overlay placeholder text and typed text (absolutely positioned spans) rather than hiding one in flow.
- **Don't.**
  - Screen recordings, real logos, or rainbow palettes (> 1 accent family).
  - Animated bodies.
  - Whip pans, shake, roll, glitch.
  - A heading on every line.
  - Cuts on every sentence.
  - Linear cursor moves.
  - Full-frame saturated fills longer than 10 f.
  - Shadows over 15 %.
  - Grain on light skins.

## Sub-variant B: music-led launch film (Clay, Copilot)
There is no VO: the on-screen UI copy (message bubbles, typed prompts, notes) is the script, and transitions hit musical accents. It opens with a cinematic metaphor plate (glass bubbles or ribbons, 6–8 s, no words), then a glyph-assembled logo (T17). Chapters are on-screen prompts or story steps, each 8–15 s. Signature moves are the emoji pivot on black (T19), confetti into a hyperspace tunnel (T18) and blur-type stat slams (T20), ending on a short serif tagline alone and then logo + URL + platforms. Build it with **explainer-launch-promo**. This kit's `K.bubble`, `K.dots`, `K.typeLine` (20 cps prompts), `K.burst` and the dark skin plug straight in.

Files: references/analysis.md (21 timed transitions, palettes per skin, GSAP recipes) · references/sources.md · assets/kit.js · assets/template/ (15-s runnable demo: hook → matte reveal → window + cascade + click + toast → matte end card + CTA)

## Later evidence
Added after the skill was written (read when extending the style):
- `references/reddit-saas-addendum.md` — Reddit SaaS picks (Cursor, Kaily, DAX, Campaign Audience Builder, Slack, CleanShot, Mailmodo…): ~25 extra frame-timed mechanics, screencast and 3D-laptop variants
