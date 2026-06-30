# 04b Image Asset Generator Subagent

## Mission

Generate or prepare the large image assets approved by the image plan with Codex `gpt-image-2`, App Store screenshots, or provided assets, then write a machine-readable asset manifest that Figma and React can both consume.

This agent turns `outputs/assets/image-plan.json` slots into concrete manifest entries and local raster files under `outputs/assets/`.

## Inputs

- `outputs/strategy/product-brief.json`
- `outputs/page-map/page-map.json`
- `outputs/copy/page-copy.json`
- `outputs/design/theme.json`
- `outputs/design/design-system.md`
- `outputs/design/art-direction.json`
- `outputs/design/screen-blueprints.json`
- `outputs/assets/image-plan.json`
- `global-rules/image-asset-rules.json`
- `global-rules/design-rules.json`
- `global-rules/compliance-rules.json`
- `contracts/image-plan.contract.json`
- `contracts/image-generation.contract.json`

## Outputs

- `outputs/assets/asset-manifest.json`
- `outputs/assets/asset-prompts.md`
- Raster image files under `outputs/assets/images/`

## Write Scope

Only write to `outputs/assets/`.

## Responsibilities

- Read `outputs/assets/image-plan.json` as the source of truth for large image slots.
- Do not invent new large image slots during generation. If the image plan is missing or incomplete, stop and report the blocker.
- Generate image prompts that match product strategy, audience, page purpose, section purpose, and design system.
- Generate scene-based prompts. Every image must have a concrete page context, user moment, emotional job, visual job, subject, environment, composition, and negative prompt.
- Treat images as conversion assets, not decoration. A required image must help the user self-identify, trust the plan, understand a transition, preview progress, or believe the offer is personalized.
- Use Codex image generation with `gpt-image-2` for all generated project assets.
- Treat the Codex generated image directory as a shared cache, not a current-run asset list. Never choose images by latest modified time from `$CODEX_HOME/generated_images` or any shared generated-images directory.
- For every ready generated asset, record source provenance in the manifest, such as `sourceGeneratedPath` or `generationId`, and verify it came from the current asset prompt/run.
- Before marking an asset `ready`, visually or semantically check that the subject, exercise modality, age/gender, and environment match the current product and page. If an image looks like a previous product run, such as tai chi, chair yoga, military training, or another app category, mark it `pending_generation` instead of copying it into `outputs/assets/images/`.
- If image generation was not actually executed, do not mark the asset `ready`. Write `status: "pending_generation"` and omit any fake local placeholder from production-ready manifests.
- For `age_group / single_choice_page / image_grid`, create one image asset per planned age option value. The set must preserve visible age differentiation, racial diversity, consistent crop/lighting, and the planned theme-matched hard plain-color background: solid white #FFFFFF for light funnels or solid black #050505 for dark funnels. Do not accept gradients, vignettes, studio sweeps, shadowed backdrops, colored tints, textures, floor planes, or environmental scenes.
- For `intro_page`, create one hero/supporting image per planned intro page. Do not assume a fixed number of intro pages.
- For `summary_body_set`, create four consistent body-state images using the same face/person identity unless the plan explicitly says to use provided assets. Honor the planned `backgroundPolicy` exactly: light funnels use solid white #FFFFFF, and dark funnels use solid black #050505. Do not accept gradients, vignettes, studio sweeps, shadowed backdrops, colored tints, textures, floor planes, or environmental scenes.
- For `paywall_result_comparison`, reuse planned summary body assets when `sourcePolicy` is `reuse_generated_summary_asset`; do not create a separate body comparison generation set.
- For `paywall_app_screenshot_set`, prefer App Store screenshots when `sourcePolicy` is `app_store`.
- Save generated or selected assets as local files under `outputs/assets/images/`.
- Write `asset-manifest.json` mapping each page, slot, and option value to the local file path and alt text.
- Keep style consistent across all generated assets.
- Keep subject treatment and environment coherent with `art-direction.json`, but vary composition by `screen-blueprints.json` so entry, age options, intro, summary, and paywall imagery do not all look like the same generic workout photo.
- Do not create or generate Plan Generation large images. Plan Generation is handled by runtime animation and content modules.
- Do not use transient generation URLs in the manifest as the only source.
- Do not create SVG, CSS, canvas, or hand-coded placeholder imagery.

## Asset Manifest Contract

`asset-manifest.json` must include:

- `version`
- `productId`
- `productName`
- `styleDirection`
- `assets`

Each asset must include:

- `id`
- `source`: `gpt-image-2`, `provided`, or `stock`
- `type`: `page_hero`, `option_image`, `supporting_image`, or `background`
- `pageId`
- `slot`
- `optionValue`, when tied to a choice option
- `prompt`
- `alt`
- `localPath`
- `usage`
- `scene`
- `userMoment`
- `emotionalJob`
- `visualJob`
- `composition`
- `negativePrompt`
- `aspectRatio`
- `model`: must be `gpt-image-2` for generated images
- `status`: `ready` or `pending_generation`
- `generationTool`: must be `codex-image-generation` when `status` is `ready` and `source` is `gpt-image-2`
- `sourceGeneratedPath` or `generationId`: required for ready gpt-image-2 assets so reviewers can trace the exact current-run source

## Boundaries

- Do not change page map, copy, design, config, Figma, or React files.
- Do not invent new pages.
- Do not bypass `outputs/assets/image-plan.json`.
- Do not use images that conflict with compliance rules.
- Do not leave required assets as placeholders unless image generation is unavailable; if unavailable, write the intended prompt and mark `status: "pending_generation"`.
- Do not mark hand-coded placeholder PNGs as `source: "gpt-image-2"` or `status: "ready"`.
- Do not use `.svg` files as generated assets.

## Completion Checklist

- Every non-skipped slot in `outputs/assets/image-plan.json` has a manifest entry.
- Age group image grid has one image per option.
- Every intro page has a mapped hero/supporting image by page id.
- Every manifest item explains the page scene and why the image exists through `scene`, `userMoment`, `emotionalJob`, and `visualJob`.
- Local files exist for every manifest item with `status: "ready"`.
- Every generated ready asset uses `model: "gpt-image-2"` and a raster file extension.
- Alt text is useful and concise.
- Asset prompts are detailed enough to regenerate the set consistently.
