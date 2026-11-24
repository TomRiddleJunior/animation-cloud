# Generated images, video, voice and music

Generation is one source type among several. It is good for atmosphere, environments, textures, abstract and impossible shots, storyboards and keyframes. It is the wrong tool for anything that must be exactly right: the product, its interface, its packaging, logos, prices, claims and real people.

This field changes monthly. Model names in this file are a snapshot from November 2026 and some will be gone when you read it. Follow the method, and check the live sources at run time.

## Before generating anything

1. **The brief allows it.** The source policy in the brief says generated shots, voice or music are accepted.
2. **A key exists.** The user supplies the provider key or an authorised connector. Never create accounts or accept terms for them.
3. **Cost is approved.** Estimate the spend (shots times seconds times price, times about three for retakes) and get a yes.
4. **The model is still alive and licensed for the job.** Check the provider's model list and deprecations page, its commercial-use terms, any revenue cap and any territory exclusion. Record the model ID, the terms URL and the date in `provenance.json`.
5. **Disclosure is planned.** Realistic synthetic people, places or events trigger labels (`legal-provenance.md`).

## Choosing a model at run time

Do not hard-code a "best" model.

- Quality ranking: read a current blind-preference leaderboard for text-to-video, image-to-video and text-to-image (Artificial Analysis publishes these).
- Availability: read the provider's or aggregator's model catalogue and pricing page.
- Then choose by the job:

| Job | Look for |
|---|---|
| Keyframes and stills | Strong prompt following, reference-image support, text rendering if text is in frame |
| Vector art, icons | A model that returns SVG, or a raster model plus `vtracer` |
| Hero image-to-video | The top of the image-to-video ranking that accepts a first frame and holds the subject |
| Volume b-roll | A fast, cheap tier of a strong model |
| Multi-shot or long takes | Per-shot prompts, end-frame control, extension |
| Editing real footage (remove, relight, new angle) | A video-to-video editing model |
| Finishing in a colour pipeline | A model that can return high bit depth or EXR |
| No cloud allowed | Open weights with a commercial licence, and a GPU with enough memory |

Snapshot, November 2026, to be re-checked: OpenAI's Sora video API was shut down in September 2026 and Google's Veo preview IDs on the Gemini API in October 2026, so examples that use them fail. Image-to-video rankings were led by ByteDance's Seedance family, text-to-video by Alibaba's Wan 3.0 and MiniMax's H3; Google's Gemini Omni, Kling 4.0, Luma Ray and Runway's own models were all available through APIs. Aggregators such as Runway's API and fal offer many of these behind one key. For open weights with permissive terms, Wan 2.2 (Apache-2.0) was the safe local choice, and it needs a large GPU.

## The workflow: keyframe first

1. **Write the shot** from the shot list: one subject, one action, one camera move.
2. **Make the keyframe** as a still. Iterate on stills; they are cheap. Get the keyframe approved.
3. **Animate the keyframe** with image-to-video. Use first-and-last-frame control to chain shots or to guarantee where a move ends.
4. **Generate 5 to 8 seconds, use the best 2 to 4.** Drop the first and last 6 to 10 frames, where morphing is most common.
5. **QC frame by frame** (below). Reject and regenerate; do not try to hide a bad shot in the mix.
6. **Composite real brand pixels** over or into the shot in the 2D engine: logo, product, interface, text.
7. **Unify in the finish:** same frame rate and colour space, the same upscaler for all generated shots, one grade, one grain pass.

Text-to-video without a keyframe is for abstract shots and early exploration only.

## Shot prompt

One shot per prompt. Plain sentences in this order:

```
SHOT: framing and length (macro / medium / wide; 5 s)
SUBJECT: who or what, with fixed descriptors reused word for word across shots
ACTION: one verb-led beat, with its start and end state
CAMERA: one move and its speed (locked off / slow push-in / 30 degree orbit / handheld)
LENS: focal length and depth of field
LIGHT: source, direction, quality, time of day
STYLE: film stock or grade, texture
AUDIO: ambience and effects, or "no dialogue, no music"
AVOID: written as plain prose, e.g. no on-screen text, no logos, no extra people
```

Consistency across shots: keep a reference sheet per subject (several angles), reuse identical descriptor strings, pass reference images where the model accepts them, fix the seed where it is exposed, and chain shots with first and last frames. Read the provider's own prompting guide for the model in use; conventions differ.

Do not name a living artist, a studio's signature style, a celebrity, or a third party's character or brand in a prompt.

## Shot QC

Step through every frame. Reject on any of:

- hands, fingers, teeth or eyes that deform;
- text, logos or interface elements that appeared without being asked for, or that warp;
- objects that change count, shape or position without cause;
- morphing at the start or end of the shot;
- flicker in textures or lighting;
- physics that looks wrong (liquids, cloth, reflections, shadows);
- a face that resembles a real person;
- a provider watermark;
- lip-sync that drifts.

## Images and utilities

| Task | Approach |
|---|---|
| Storyboards and style frames | Generated stills, clearly marked as concept frames |
| Backgrounds and plates | Generate at high resolution, then add slow parallax: a depth map splits the still into layers that move at different speeds |
| Textures (paper, grain, fabric) | Generate or use CC0 scans; tile and blend in the 2D engine |
| Cut-outs | `rembg` locally; check the edge on hair and glass |
| Upscaling | One upscaler for every generated shot in the film, applied before the grade |
| Smoother motion | Frame interpolation, then check for warping on fast motion |
| Raster to vector | `vtracer`, then tidy the paths |
| Image to 3D | Useful for background props; check topology and the licence before a hero use |

Licence traps in open tooling: several popular weights are non-commercial or revenue-capped (for example some FLUX "dev" variants, SUPIR, larger Depth Anything models, some background-removal weights), and some carry territory exclusions. Read the model card every time.

## Voice

- Real recorded voice first.
- Synthetic voice only with approval. Use a stock voice the provider licenses for commercial use; record the provider, voice ID, model ID and plan.
- Cloning or imitating a real person needs that person's written consent for this use, territory and term, stored with the project. Soundalikes of recognisable people are refused.
- A local option with a permissive licence (Kokoro was Apache-2.0) avoids sending scripts to a provider.
- Check the model list before building: speech model IDs are retired often.

After generating: transcribe with word timings, align to the script, and key the picture to the words (`sound-design.md`).

## Music and sound effects

Order of preference for an advert:

1. Licensed stock music with a licence that covers paid advertising for a business.
2. A generator trained on licensed material, on a paid plan whose terms cover advertising. Read the plan terms; do not rely on a summary.
3. The skill's own synthesized score and effects (`templates/sound.cjs`), which carry no third-party rights.

Avoid generators with unsettled litigation or terms that restrict downloads for a client's signature track, and never use non-commercial weights (several open music and video-to-audio models are non-commercial).

Fully generated music may not be protected by copyright, so a competitor could reuse it. For a brand's signature sound, prefer licensed or commissioned music.

Generated audio that arrives attached to a generated video is scratch. Replace it with the controlled mix unless it is approved dialogue.

## Calling providers

Read the provider's current documentation and the model's schema before the first call; parameter names differ per model. The usual shape is submit, poll, download:

```bash
# submit (the body's fields come from the model's own schema)
curl -sS -X POST "$PROVIDER_ENDPOINT" -H "Authorization: $AUTH_HEADER" -H "Content-Type: application/json" \
  -d '{"prompt":"...","image_url":"https://.../keyframe.png","duration":5}'
# poll the returned status URL until done, then download the result and hash it
```

Rules for calls:

- Keys come from the environment. Never print, log or commit them.
- Save every result with its request (prompt, references, seed, model ID, parameters) next to it.
- Stop at the approved budget, and say when a retake would exceed it.
- Upload only what the shot needs. Do not send unreleased product material or personal data to a provider without the user's agreement.

## Provenance for generated material

Each generated asset gets a row in `provenance.json`: source type `generated`, provider, exact model ID, terms URL and date read, prompt, reference inputs, seed, licence, human edits made, and the disclosure decision. Providers may embed invisible watermarks or content credentials; re-encoding usually strips metadata, so the final deliverable is signed again where required (`legal-provenance.md`).
