# Product demos and walkthroughs

A demo proves that the product does what the film says. Real captures carry the proof; authored scenes carry the ideas a recording cannot show.

## Two ways to show an interface

| Way | When | Cost |
|---|---|---|
| **Scripted capture** of the real product, with a virtual camera added afterwards | The action itself is the proof: a click that does something, a real result | Needs a working environment with safe demo data |
| **Redrawn interface** in canvas or DOM, based on real captures | Hero shots, close-ups, anything shown larger than life, states that are hard to reach | Must match the real product exactly; label anything not live |

Most launch films redraw the interface for the hero beats and use captures for proof. Never invent a screen, a result or a number. A redrawn state that does not exist yet is labelled "Planned" or cut.

## Scripted capture

Real-time screen recording is not a master: it drops frames and compresses hard. Capture stills at each step and let the compositor create the motion.

```bash
node templates/capture/demo-capture.cjs steps.json      # writes demo/shots/*.png and demo/events.json
```

`steps.json` describes the walkthrough:

```json
{
  "url": "http://localhost:3000/app",
  "viewport": { "width": 1440, "height": 900 }, "scale": 2,
  "steps": [
    { "name": "open-composer", "click": "[data-test=compose]" },
    { "name": "type-request", "type": { "selector": "textarea", "text": "Send $50 to @fredy" }, "everyChars": 4 },
    { "name": "send", "click": "button[type=submit]", "waitFor": ".receipt" }
  ]
}
```

For each step it records a screenshot before and after, the bounding box of the element acted on, and the cursor target. Typing steps capture a still every few characters so text appears to be typed.

Rules:

- Use a demo account with invented but plausible data. No real customer names, balances, emails or keys on screen. Check every still.
- Capture at 2 times device scale so a 200% zoom stays sharp.
- Hide what is not in the story with a capture-only stylesheet: banners, chat widgets, test ribbons, scrollbars, personal avatars.
- Freeze clocks and animations where the product allows it, so re-captures match.
- Only capture environments the user asked you to use. Signing in with real credentials is the user's job.

## The virtual camera

`events.json` gives the compositor what it needs: for each step, the still, the target box, and the cursor path. Build the shot in the canvas or DOM engine:

- **Framing.** Start on the whole window for context (one beat), then push to 150 to 300% on the active area. Keep the target inside the middle 60% of the frame.
- **Moves.** 20 to 30 frames, ease-in-out. The camera arrives before the action and holds through it. No move while text must be read.
- **Cursor.** Drawn by the compositor, larger than life (about 1.5 times). It travels on a slight arc, eases out as it arrives, pauses 4 to 6 frames, clicks. A ripple or a 3-frame press marks the click.
- **Typing.** Advance through the typing stills at a human rhythm (6 to 10 characters a second, with small seeded variations), caret blinking between bursts.
- **State changes.** Cross-fade between the before and after stills over 4 to 8 frames, or cut on the click sound.
- **Callouts.** One at a time. A short label and a thin line or a soft highlight around the element; dim the rest of the screen by 30 to 50%.
- **Window dressing.** A generic browser or device frame, a soft shadow, a plain ground. Remove tabs, bookmarks and the address bar unless the address matters.

## Redrawn interface

- Trace from real captures so spacing, radii, colours and copy match. Use the product's own fonts and icons.
- Draw at 2 to 3 times real size and crop tightly: one control, one message, one result per shot.
- Simplify by removing, never by changing. Remove navigation and secondary panels; keep the wording and the order of real steps.
- Show the same example throughout (one person, one amount, one item) so the viewer can follow it.

## Structure for a feature demo (30 to 75 s)

1. The situation, in one line or one picture (0 to 4 s).
2. The product appears by about 0:09; name it after the viewer has seen it.
3. Three beats, each one claim and one proof on screen (6 to 10 s each).
4. The result, held.
5. Name, line, where to get it (2 to 3 s).

Voiceover, if used, runs at about 125 words a minute. Shots last 1.5 to 4 s.

## App store previews

Store previews have strict rules: footage captured from the app itself, exact pixel sizes per device, 15 to 30 seconds, no claims about other platforms. Check the current store specification before building (`delivery.md`), and do not use generated or stock footage in them.

## Sound for demos

Soft clicks on clicks, a low tick on state changes, a short whoosh on camera moves, a gentle chime on success. Keep them quiet and consistent; the same action always makes the same sound.

## Checks before delivery

- Every screen shown exists in the product today, or is labelled.
- No personal data, secrets, internal URLs or unreleased features in any frame.
- Cursor never teleports; every click lands on its target.
- Text shown for reading is at least 4% of frame height in the vertical cut.
