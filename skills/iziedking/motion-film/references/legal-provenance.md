# Truth, rights, disclosure and provenance

This file is working guidance for an agent, checked in November 2026. It is not legal advice. Laws and platform rules differ by territory and change; when a point below decides something that matters, tell the user and ask for a human or legal sign-off.

## Truthful advertising

- Every claim on screen is on the brief's truth table and can be substantiated.
- The product shown is the real product doing what it really does. No generated or mocked-up interface, result, before-and-after or performance demonstration presented as real.
- No invented customers, reviews, testimonials, metrics, awards, partner logos or prices. Rules against fake and AI-generated reviews and testimonials carry large penalties per violation in some territories.
- No generated person presented as a real customer, employee, doctor or expert.
- Dramatisations, illustrations, example figures, test networks and planned features are labelled in text the viewer can read.

## People

- A real person's face, body or voice needs a signed release that covers this use, the media, the territories and the term, and that names generated or altered use if any is intended.
- No lookalikes or soundalikes of recognisable people. No deceased people without the estate's clearance. No generated minors.
- Stock footage of identifiable people is used only when a model release exists and the licence covers advertising. No identifiable person may be shown in a way that implies a health condition, a political view or anything else sensitive.
- Requests involving celebrities or public figures: stop and ask.

## Third-party rights

- Use the client's marks only from the files they supply. Other companies' logos, products, characters, artworks and distinctive buildings are not cleared by default; reject shots that contain them.
- "Editorial use only" assets are never used in advertising.
- Game footage, film clips, broadcast clips and music need the rights holder's permission or a licence that covers ads.
- Do not prompt a model with a living artist's name, a studio's signature style or a third party's character.
- A reference video is studied, not reused: none of its pixels, audio or wording in the export.

## Licences

Every asset gets one of these, written in `provenance.json`:

| Licence | Rule |
|---|---|
| Owned by the client, or made here | Use |
| CC0 or public domain | Use; record the source |
| Attribution required (CC-BY and similar) | Use with the credit in the delivery notes or on screen, as the licence asks |
| Royalty-free stock | Use within its terms; confirm that paid advertising, the number of viewers and the territories are covered |
| Subscription music or footage | Confirm the plan tier covers business advertising and what happens after the subscription ends |
| Open-source software | Fine as a tool. Note unusual terms (see `toolchain.md`) |
| Open model weights | Read the model card: many are non-commercial, revenue-capped or exclude territories |
| Non-commercial, no-derivatives, share-alike on the output, unknown | Refuse for commercial work |

Free does not mean cleared: a free licence on a photo does not include a release from the person or the property in it.

## Generated content

- **Ownership.** In several jurisdictions, including the United States, material generated without human authorship is not protected by copyright. The human-made parts of a film (script, design, edit, composited real assets) are; raw generated shots may be free for others to copy. Say so when a client plans to rely on a generated asset as a brand property.
- **Provider terms.** Commercial use depends on the provider's terms, the plan, and the upstream model's terms when an aggregator is used. Record the URLs and the date read.
- **Training and data.** Do not upload unreleased product material, personal data or third-party assets to a provider without the user's agreement.

## Disclosure of synthetic content

Label when a reasonable viewer could take generated or heavily altered content for a real person, place or event.

- **European Union.** The AI Act's transparency duties apply to those who publish such content, including advertisers: a visible label at first exposure. The provider's own watermark does not discharge the publisher's duty. Stylised or obviously artistic work has a lighter duty.
- **United Kingdom.** Advertising rules apply however the ad was made; disclose where leaving it out would mislead.
- **United States.** Rules vary by state. New York requires a conspicuous disclosure in ads that feature a synthetic performer; other states have their own provisions.
- **Platforms.** YouTube and Google Ads, Meta, TikTok and others have their own AI-content labels or toggles. Set them. A platform label does not replace a legal one.
- **Political and social-issue ads** have stricter rules everywhere. Stop and ask.

If it is unclear whether content is "realistic", label it.

## Content credentials

Content credentials (C2PA) attach a signed record of how a file was made. Sign the final deliverable, after the last encode.

```bash
c2patool final.mp4 -m manifest.json -o final_signed.mp4     # embed
c2patool final_signed.mp4 --info                            # verify
```

The manifest's actions state the source: `http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia` for fully generated media, `.../compositeWithTrainedAlgorithmicMedia` for a mix. Production signing needs a certificate from a recognised authority, which the user obtains; the tool's built-in test certificate is for trials only. Many platforms strip metadata on upload, so credentials complement the visible label and the ledger; they do not replace them.

## The provenance ledger

`templates/provenance/provenance.json` holds one row per asset. Keep it current as shots are built; it is part of the delivery.

```json
{
  "film": "title",
  "assets": [
    {
      "id": "font-inter",
      "usedIn": ["all"],
      "sourceType": "licensed",
      "what": "Typeface",
      "source": "https://github.com/rsms/inter",
      "licence": "SIL OFL 1.1",
      "licenceUrl": "https://github.com/rsms/inter/blob/master/LICENSE.txt",
      "readOn": "2026-11-18"
    },
    {
      "id": "shot-040-plate",
      "usedIn": ["040"],
      "sourceType": "generated",
      "what": "Background plate, still",
      "provider": "provider name",
      "model": "exact-model-id",
      "termsUrl": "https://provider/terms",
      "readOn": "2026-11-18",
      "prompt": "…",
      "references": [],
      "seed": 12345,
      "humanEdits": "Cropped, graded, logo composited from client SVG",
      "disclosure": "Stylised landscape; no label needed. Platform toggle: not set."
    }
  ],
  "people": [ { "who": "Speaker name", "release": "releases/speaker.pdf", "covers": "Online ads, worldwide, 2 years" } ],
  "claims": [ { "text": "Delivered in 2 seconds", "status": "live", "evidence": "benchmarks/2026-11.md" } ],
  "disclosure": [ { "platform": "YouTube", "territory": "EU", "label": "none needed", "why": "No realistic synthetic content" } ],
  "deliverables": [ { "file": "title_16x9_1080p_h264.mp4", "sha256": "…", "signed": false } ]
}
```

`sourceType` is one of `authored`, `capture`, `client`, `licensed`, `stock`, `generated`.

## Stop and ask

- A claim has no evidence or no status.
- A person would be shown, generated, cloned or imitated without a release on file.
- A licence is missing, non-commercial or unclear.
- The film is political, about health or finance claims, aimed at children, or for a regulated product.
- Disclosure rules for a territory in the brief are unknown.
