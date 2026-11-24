# Process and gates

Each gate ends with something the client approves. Do not start the next gate without that approval.

## 0. Toolchain check

Run `node templates/tools/doctor.cjs`. It writes `doctor.json`: which tools are installed and their versions, free memory, CPU count, whether a GPU is visible. Plan the film around what the machine can do, and list what would need installing or renting. See `toolchain.md`.

## 1. Brief

One page, written before any picture.

- **Goal:** what the viewer should think, feel or do after watching. One sentence.
- **Audience and channels:** who watches and where (X, LinkedIn, YouTube, TikTok, Instagram, a landing page, a pitch, an app store). Sound on or off by default. Paid placement or organic.
- **Length and formats:** master length and every aspect ratio needed. Each extra ratio is re-composed, never centre-cropped.
- **Voice:** client's recording, no voice, or an approved synthetic voice with its licence.
- **Brand:** logo files, fonts, colours as hex, product captures, words to use and avoid.
- **Source policy:** which source types the client accepts: authored only, stock allowed, generated shots allowed, a generated voice or music allowed. Record the answer; it decides which engines are available.
- **Truth table:** every claim the film might make with its status: live, beta or testnet, planned, illustrative. Anything not on the table does not go on screen.
- **Budget:** money available for paid generation, stock, music or cloud rendering. Zero is a valid answer and changes the plan.
- **Territories:** where the ad runs. It decides disclosure duties (see `legal-provenance.md`).
- **Deadline and review rounds.**

## 2. Reference study

Run `node templates/tools/refstudy.cjs <reference>` for each reference and write the notes described in `reference-study.md`: shot list, cut rhythm, palette, type, motion devices, sound. Name what to borrow (structure, pacing, a device, a finish) and what belongs to the reference (its art, footage, music, brand).

When the client asks for "a video like this one", the answer is a rebuilt film with the same craft and original assets. Say which parts of the reference need which engine, and which parts the machine cannot do without help (for example a GPU for the 3D plate).

## 3. Directions

Offer two to four. They must differ on at least two of: palette, texture, depth, type treatment, camera behaviour, source type. Pick them from different families in `style-atlas.md`.

Each direction has:

- a title and the opening line;
- a time table (time, picture and motion, spoken idea or on-screen text);
- motion character in one sentence;
- the engine plan: which engines, which shots are 3D or generated, what must be installed;
- cost and time: paid calls, licences, measured or estimated render time;
- its truth boundary and any disclosure it triggers;
- your recommendation and why.

Ask the client to pick one. Do not storyboard several in parallel.

## 4. Script and shot list

Script for speech: short sentences, one idea each, numbers spoken the way people say them. Run it through a plain-language edit.

Then the shot list, one row per shot:

| # | Time | Picture | Camera or motion | Text | Sound | Source type | Engine | Risk |
|---|---|---|---|---|---|---|---|---|

"Source type" is one of: authored, capture, client footage, stock, generated. "Risk" names what could fail (render time, a model that may not hold the product shape, a licence to confirm).

If there is a voiceover, record or generate it before building and key the timeline to its word timings (`sound-design.md`). Picture follows voice. If the film is music-led, lock the track first and build a beat grid; cuts land on beats.

## 5. Motion study

Build 6 to 8 seconds at final finish: the hardest transition, one hold, and at least one shot from every engine the film will use, with grade, grain and sound. This is where the client approves the look, the type, the easing, the 3D lighting and the sound character. It is also where render time gets measured for real.

Do not continue until it is approved.

## 6. Build

One folder per shot under `shots/`, each producing a frame sequence or a mezzanine clip at the film's frame rate and resolution:

```
shots/010-hook/      frames/ or shot.mov, source files, notes.md
shots/020-icons-3d/
shots/030-ui-type/
```

After each shot, render proof stills at its key times and look at them. Add a row to `provenance.json` for every asset the shot used.

Rules that hold for every engine:

- Time is a function of the frame index.
- Render one frame, then ten consecutive frames, then the shot.
- Keep sources and seeds so any shot can be re-rendered alone.

## 7. Sound, 8. Finish, 9. Deliver, 10. QC

See `sound-design.md`, `finishing.md`, `delivery.md`, `qc-checklist.md`.

## Resources

Rendering is CPU-bound or GPU-bound and memory-hungry. One render at a time. Before a long render, time one frame and multiply. If the total does not fit, in this order: lower the draft resolution for reviews, reduce samples and rely on denoising, shorten the expensive shots, move them to 2D, then ask about a remote machine or a rented GPU. Clean up temporary frames and containers afterwards.

## Delivery notes (always include)

- What the film shows and what it labels as illustrative, planned or dramatised.
- Provenance: `provenance.json`, with fonts, logo, stock, generated shots, music and voice, each with its licence.
- Disclosure decisions per platform and territory.
- Files delivered and the QC results.
- How to regenerate: commands per shot, and which file to edit for copy changes.
- What was not verified.
