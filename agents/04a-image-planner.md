# 04a Image Planner Subagent

## Mission

Create a reviewable large-image plan before any image generation runs.

This agent decides which large visual assets the funnel needs, why they exist, where they appear, and whether they should be generated, sourced from App Store screenshots, reused from summary assets, provided manually, or skipped.

It does not generate images.

## Inputs

- `outputs/strategy/product-brief.json`
- `outputs/page-map/page-map.json`
- `outputs/copy/page-copy.json`
- `outputs/design/theme.json`
- `outputs/design/design-system.md`
- `outputs/design/art-direction.json`
- `outputs/design/screen-blueprints.json`
- `global-rules/image-asset-rules.json`
- `global-rules/design-rules.json`
- `global-rules/compliance-rules.json`
- `contracts/image-plan.contract.json`
- `docs/research/workoutforwomen-image-assets.md`

## Outputs

- `outputs/assets/image-plan.json`
- `outputs/assets/image-plan.md`

## Write Scope

Only write to `outputs/assets/`.

## Responsibilities

- Plan only large image assets. Ignore tiny option icons, payment logos, progress bars, charts, UI glyphs, and code-generated visuals.
- Read each page's `visualDecision` from `outputs/page-map/page-map.json` to decide which page instances actually need large visuals. The Image Planner consumes this decision; it does not invent page-level image needs from page names.
- If a page is missing `visualDecision`, mark the plan `blocked` and explain that Page Architect must provide the visual decision first.
- Mark age group option images as mandatory when `age_group` uses `single_choice_page / image_grid`.
- For age group image sets, require 4 half-body images with clear age differentiation, consistent style, product/audience relevance, and visible racial diversity across the set when the audience is broad. The background must match the funnel theme with a hard plain-color rule: light funnels use a perfectly plain solid white background (#FFFFFF), and dark funnels use a perfectly plain solid black background (#050505). The prompt must explicitly forbid gradient, vignette, studio sweep, shadowed backdrop, colored tint, texture, floor plane, and environmental scene. Prefer assigning one option to an Asian person, one to a Black person, one to a White person, and one to another visually distinct but cohesive person so the set does not look like four copies of the same demographic.
- Add welcome or transition hero images when the funnel includes a large-image welcome, transition, or entry page.
- Add one intro hero image per actual `intro_page`; the number must follow the page map and copy, not a fixed count.
- Make every intro image brief match that intro page's copy, section purpose, and trust/conversion job. Intro images should default to `aspectRatio: "4:3"` because they sit inside mobile intro pages as large contextual art, not full-width cinematic hero banners.
- Treat all rich question images as conditional and function-based. Include them only when `visualDecision.visualNecessity` is `required`, `recommended`, or `optional` and `visualDecision.visualRole` is not `none`.
- Do not use product-specific page labels such as focus area, sleep, flexibility, equipment, motivation, special need, body type, or target zone as universal image requirements. Those pages may receive image slots only when their `visualDecision` explains the visual function.
- Skip large image slots for pages whose `visualDecision.visualRole` is `none`, even if the page title sounds visually rich.
- For body option images, require transparent background when the option card design needs the figure to blend into the card/page.
- For current body and target body sets, require consistent pose family, lighting, crop, clothing direction, and respectful non-shaming treatment.
- For summary, require a `summary_body_set` in fitness, weight, body-shaping, yoga, Pilates, strength, and wellness funnels with BMI/body result summary. This set should show the same face/person identity across four different body states. Prefer `sourcePolicy: "edit"` for this slot: generate the normal/baseline body image first, then use the image edit endpoint to create underweight, overweight, and obese variants while preserving face, hair, pose family, crop, outfit direction, and lighting. The background must match the funnel theme with a hard plain-color rule: light funnels use a perfectly plain solid white background (#FFFFFF), and dark funnels use a perfectly plain solid black background (#050505). The prompt must explicitly forbid gradient, vignette, studio sweep, shadowed backdrop, colored tint, texture, floor plane, and environmental scene.
- Do not create a Plan Generation image slot. Plan Generation should use runtime animation, progress copy, and optional testimonial modules.
- For paywall result comparison, reuse the summary body set when possible. Plan this as `sourcePolicy: "reuse_generated_summary_asset"`, not a separate freeform generation request.
- For paywall app screenshots, use `sourcePolicy: "app_store"` when App Store screenshots are available.
- Clearly mark optional slots and explain why they are included or skipped.
- Include enough prompt context for the downstream Image Asset Generator to create consistent assets without inventing the strategy again.
- Carry `visualDecision.visualRole`, `visualDecision.visualNecessity`, `visualDecision.visualFunction`, and `visualDecision.reason` into each slot when the slot originated from a page-level decision.

## Image Plan JSON Shape

`outputs/assets/image-plan.json` must include:

- `version`
- `productId`
- `productName`
- `status`: `planned`, `approved`, or `blocked`
- `reviewRequired`: `true`
- `largeImageOnly`: `true`
- `summary`
- `slots`

Each slot must include:

- `id`
- `kind`
- `pageId`
- `pageType`
- `required`
- `sourcePolicy`: `generate`, `edit`, `app_store`, `reuse_generated_summary_asset`, `provided`, or `skip`
- `count`
- `displayRole`
- `aspectRatio`
- `backgroundPolicy`
- `styleConsistency`
- `promptBrief`
- `negativePrompt`
- `runtimeUsage`
- `visualRole`
- `visualNecessity`
- `visualFunction`
- `visualDecisionReason`
- `dependsOn`, when the slot reuses another slot
- `items`, for per-option or set-based slots

For per-option image sets, `items` should include:

- `id`
- `optionValue`
- `label`
- `visualBrief`
- `differentiationRequirement`

## Default Planning Policy

Required by default:

- Age group option image set when age group is image-grid.
- Welcome / transition hero when the page exists.
- One hero image per intro page.
- Summary four-body-state set for relevant health/fitness funnels, preferably with image edits from one base identity.
- Paywall app screenshots from App Store when available.
- Paywall top result comparison by reusing summary assets.

Conditional by `visualDecision`:

- `option_image`: create one image per option when the option difference is primarily visual.
- `page_hero`: create one page-level hero when the page is a trust bridge, emotional bridge, or visual explanation.
- `explanatory_visual`: create one page-level visual when the concept is easier to understand visually.
- `result_visual`: create or reuse a result/body/progress visual when the page needs result imagination.
- `proof_visual`: use sourced screenshots, proof visuals, or generated proof imagery only when compliant and useful.

Forbidden:

- Plan Generation large image slot.
- Tiny option icons.
- Payment logos.
- Stripe checkout UI.
- BMI charts.
- Weight prediction charts.
- Progress bars.

## Completion Checklist

- The plan contains only large image slots.
- The plan does not request Plan Generation imagery.
- Age group images are mandatory, four-count, half-body, racially diverse, age-differentiated, and theme-matched in background when age group exists.
- Intro image count equals the actual intro pages in `page-map.json`.
- Summary body set is present when the funnel has BMI/body result summary, and uses a same-identity edit chain where feasible.
- Paywall result comparison reuses summary body assets when possible.
- App screenshot slots prefer App Store source.
- Optional body/focus/special/sleep/flexibility slots include an inclusion reason.
- Conditional slots reference the originating `visualDecision` and do not rely on page labels alone.
- `image-plan.md` explains the slot list in plain language for human review.
