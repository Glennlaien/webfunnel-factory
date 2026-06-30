# intro_page

Use for copy-only transition pages between major onboarding sections.

Intro pages do not collect user input. They are still conversion pages: they should build momentum, explain why the next section matters, reinforce the product promise, handle an objection, or increase trust before more personal questions.

## Required Fields

- `id`
- `pageType`: `intro_page`
- `module`
- `sectionId`
- `sectionLabel`
- `sectionOrder`
- `conversionPurpose`
- `title`
- `cta`

## Recommended Fields

- `subtitle`
- `body`
- `trustPurpose`
- `paywallBridgeRole`
- `progressBehavior`
- `assetRequirement`, when the intro uses product-relevant imagery

## Design Expectations

- Feels like a mobile app transition screen, not a blog article.
- May use a strong title, product-relevant image, short explanatory card, and bottom CTA.
- Should display the same segmented top progress system as other pre-paywall pages.
- Copy should be short, specific, and connected to the user's goal or upcoming section.

## Examples

- Before Activity: "Let's find the routine your body can actually stick with."
- Before Body Metrics: "Your measurements help us tailor intensity and pacing."
- Before Results: "We're turning your answers into a plan you can start with confidence."
