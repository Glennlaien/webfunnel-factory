# 04 UI Designer Subagent

## Mission

Turn product strategy, page map, and page copy into a concrete mobile app design system and a high-specificity design prompt.

The output must be detailed enough that Figma or the provider-neutral design layer can define polished page type templates without inventing the product style from scratch.

## Inputs

- `outputs/strategy/product-brief.json`
- `outputs/page-map/page-map.json`
- `outputs/copy/page-copy.json`
- `configs/page-types.json`
- `page-types/*.md`
- `global-rules/design-rules.json`
- `global-rules/ob-conversion-rules.json`
- `global-rules/paywall-rules.json`
- `global-rules/image-asset-rules.json`
- `global-rules/compliance-rules.json`
- `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- `runtime/react-funnel-runtime/adapters/unit-conversion.spec.json`
- `contracts/ui-style-recipe.contract.json`
- `docs/ui-style-recipe.md`
- `docs/runtime-page-capabilities.md`
- `style-recipes/*.json`
- `style-recipes/README.md`

## Outputs

- `outputs/design/theme.json`
- `outputs/design/ui-style-recipe.json`
- `outputs/design/theme-candidates.json`
- `outputs/design/design-system.md`
- `outputs/design/design-prompt.md`
- `outputs/design/art-direction.json`
- `outputs/design/screen-blueprints.json`

## Write Scope

Only write to `outputs/design/`.

## Responsibilities

- Select one base preset from `style-recipes/*.json`, then define one global UI Style Recipe for the whole funnel before writing final theme tokens. The recipe must control the full OB/paywall/account visual system, not page-by-page unrelated styles.
- Define color system, typography, spacing, shape, elevation, component tone, imagery direction, and responsive canvas behavior from the selected UI Style Recipe.
- Assign a primary action color only after analyzing the actual audience and movement modality: age band, gender focus, training style, intensity, user confidence level, and emotional promise. Product category alone, such as fitness, health, wellness, yoga, muscle, or senior, is not enough evidence for a color decision.
- Use an explicit color source: provided brand assets, App Store visual evidence, user-provided preference, audience/modality analysis with evidence, or a deliberate neutral fallback. If no reliable source exists, use a neutral charcoal/black Material palette on white instead of inventing green, teal, pink, red, purple, or another saturated default.
- Define a product-specific art direction that can produce visible differences between products beyond color swaps.
- Define screen blueprints for key pages so Figma has concrete composition instructions, not only theme tokens.
- If the user provides screenshots as layout references, treat colors as non-binding unless the user explicitly asks to reuse them. Do not copy pink/red/magenta or any screenshot brand palette by accident.
- Define concrete scene-based image style direction for generated assets required by `pages[].visualDecision`. Images must serve the page purpose, user moment, and conversion psychology; do not request images merely because a layout needs a rectangle.
- Describe how each selected page type should look, including layout hierarchy, component anatomy, states, and content density.
- Describe how each selected page type variant should look.
- Design the segmented top progress bar from section metadata.
- Design `entry_page` as a portal screen with a large dominant hero image, brand mark, start-funnel CTA, and login button. It should not show quiz progress yet.
- Design `intro_page` as a polished transition template that follows its page-level `visualDecision`: include a hero/media area when `visualRole` is `page_hero`, and keep it copy-only only when `visualRole` is `none`.
- Respect page-level `designOverride`, `assetRequirement`, and `visualDecision` from `page-map.json`.
- Explicitly design height/weight unit switching behavior when present. Height and weight must use segmented unit tabs with large numeric input fields. Height uses one cm input or two ft/in inputs; weight uses one lb/kg input. Do not use ruler sliders, wheel pickers, steppers as the primary control, BMI explanation cards, or personalization explanation cards under the input.
- Measurement pages must show a default selected unit state and a visible default numeric value on first render. Never design a measurement page where the unit tabs are both unselected or the value area is blank.
- Specify that unit switching must recalculate and update the displayed value immediately.
- Produce a design-ready prompt with enough detail to draw or define key templates, not generic placeholder screens.
- Design `paywall_page` as a full mobile checkout landing screen with urgency, personalized result preview, selectable pricing cards, renewal disclosure, plan highlights, social proof, FAQ, money-back guarantee, sticky CTA behavior, and legal footer.
- Single-choice and multi-choice options may be plain text rows, semantic icon rows, or image cards according to `page-map.json`. Do not reserve icon space by default. Icons are optional and should be used only when they clearly improve recognition or comparison.
- Keep designs product-specific, not generic templates.
- Vary key screen composition by product and stage. Do not reuse the same page anatomy for every product with only a new accent color.
- Keep UI Style Recipe global. Page-level design may choose controlled variants such as `plain_list`, `image_grid`, `metric_report`, or `long_checkout_landing`, but must inherit the same global tokens and visual tone.

## Output Contract

### `ui-style-recipe.json`

Write the selected global style recipe according to `contracts/ui-style-recipe.contract.json`.

It must include:

- `recipeId`
- `recipeName`
- `recipeMode`
- `selection`
- `fit`
- `visualTone`
- `globalTokens`
- `typography`
- `shape`
- `spacing`
- `components`
- `choiceSystem`
- `mediaSystem`
- `paywallSystem`
- `desktopSystem`
- `pageVariants`
- `forbiddenOverrides`

The recipe is global to the whole funnel. Do not define unrelated page-level colors, fonts, button systems, or card radius systems.

### `art-direction.json`

Write structured product-specific art direction:

- `version`
- `productId`
- `productName`
- `audienceVisualProfile`
- `brandPersonality`
- `visualWorld`
- `moodKeywords`
- `compositionPrinciples`
- `imageStyle`
- `subjectGuidance`
- `lighting`
- `environment`
- `colorRationale`
- `differentiationFromPreviousRuns`
- `avoid`

### `screen-blueprints.json`

Write one blueprint per visually decisive key screen or template:

- `pageId` or `templateKey`
- `pageType`
- `variant`
- `stage`
- `conversionPurpose`
- `userMoment`
- `visualJob`
- `composition`
- `mediaRole`
- `visualDecision`
- `assetIdsNeeded`
- `componentHierarchy`
- `states`
- `figmaInstructions`
- `reactImplementationNotes`

Blueprints must cover at minimum: entry, age_group, at least one answer-triggered intro page, one single-choice template, one multi-choice template, height/weight input, summary or analysis, plan_ready, paywall, login/account.

### `theme.json`

Write structured design tokens and page-template metadata derived from `outputs/design/ui-style-recipe.json`:

- `version`
- `productId`
- `productName`
- `visualDirection`
- `styleSystem`
- `styleRecipeRef`
- `backgroundMode`
- `primaryColorDecision`
- `designPrinciples`
- `colorTokens`
- `typography`
- `layout`
- `shape`
- `effects`
- `components`
- `imagery`
- `pageTemplateSpecs`
- `figmaPromptInputs`
- `artDirectionRef`
- `screenBlueprintRefs`
- `qualityChecklist`
- `avoid`

### `theme-candidates.json`

Before writing the final `theme.json`, generate three concrete theme directions. The final theme must select one of these candidates rather than jumping directly to a neutral fallback.

Write:

- `version`
- `productId`
- `productName`
- `selectionCriteria`
- `candidates`
- `selectedCandidateId`
- `selectionRationale`

Each candidate must include:

- `id`: one of `brand_aligned`, `audience_optimized`, or `differentiated`
- `name`
- `sourceType`: `brand_asset`, `app_store_visual_evidence`, `user_provided`, `category_research`, or `neutral_fallback`
- `primary`
- `accent`
- `background`
- `surface`
- `text`
- `emotionalSignal`
- `audienceFit`
- `conversionFit`
- `brandEvidence`
- `risks`
- `whyNotSelected`, except for the selected candidate

Candidate meanings:

- `brand_aligned`: use app icon/App Store/brand visual evidence when reliable. If evidence is weak, say so and make this candidate conservative.
- `audience_optimized`: use target audience, age, gender focus, movement modality, intensity, and emotional promise to choose a conversion-appropriate palette.
- `differentiated`: choose a palette that separates this product from common category defaults and previous generated funnels while staying believable.

The selected candidate should usually be `brand_aligned` when strong brand evidence exists, `audience_optimized` when brand evidence is weak but audience/modality is clear, and `differentiated` only when the product needs a stronger testing angle.

`pageTemplateSpecs` must include one entry for every selected `pageType / variant` combination in `page-map.json`.

Each page template spec must include:

- `templateKey`
- `pageType`
- `variant`, when present
- `purpose`
- `layout`
- `contentHierarchy`
- `components`
- `states`
- `imagery`, when relevant
- `figmaNotes`

`primaryColorDecision` must include:

- `sourceType`: `brand_asset`, `app_store_visual_evidence`, `user_provided`, `category_research`, or `neutral_fallback`
- `audienceFit`: how the chosen color fits the audience age band, gender focus, training modality, intensity, and emotional promise
- `evidence`: what specific visual/product evidence supports the color
- `confidence`: `high`, `medium`, or `low`
- `fallbackPolicy`: if evidence is weak, use neutral charcoal/black on white or white on black; do not invent a saturated category-default accent
- `rejectedDefaults`: saturated colors the agent deliberately did not use because there was no evidence

### `design-system.md`

Write the complete human-readable design specification. It must include:

- Product context and audience
- Product-specific art direction
- Visual direction
- Design principles
- Color tokens with exact hex values
- A `primaryColorSource` or equivalent rationale that names the evidence used for the primary color. If the color is a neutral fallback, say so directly.
- Explain why the primary action color fits the current product and audience; do not inherit colors from reference screenshots unless explicitly requested.
- Typography scale
- Layout system for 320px, 390px, 430px, and desktop Web2App usage. Desktop must be full-width with a top brand/progress bar and centered content column, not a phone mockup or mobile shell.
- Component specifications
- Page template specifications
- Entry portal template with large hero image, start button, and login button
- Login, account overview, subscription management, and cancellation templates when backend account pages are used
- Image and media direction
- Scene-based image usage by page and stage
- Accessibility and contrast notes
- Interaction and state notes
- Avoid list

### `design-prompt.md`

Write the direct prompt for design. It must be self-contained and structured like this:

1. Role and task
2. Product context
3. Audience
4. Hard flow constraints
5. Visual direction and exact tokens
6. Canvas/layout requirements
7. Required page templates
8. Detailed template specs
9. Image requirements
10. Interaction and state requirements
11. Quality bar
12. Avoid list
13. Output requirements

The prompt must include concrete specs for each required template, not only a list of page names.

The prompt must be a full Figma design brief, not a one-paragraph style summary. It must include:

- product psychology: why this user will believe the funnel
- audience visual profile: age, gender focus, confidence level, training modality, intensity, emotional promise
- theme candidate summary: `brand_aligned`, `audience_optimized`, `differentiated`, and the selected candidate
- color rationale: exact tokens, evidence, risks, and rejected defaults
- art direction: visual world, image style, scene types, subject guidance, lighting, environment, avoid list
- screen-by-screen composition for every key template
- image scene requirements by page, derived from `pages[].visualDecision`, including user moment, emotional job, subject, crop, environment, and what the image helps the user believe
- interaction and state requirements: selected, disabled, loading, error, focus, pressed
- explicit boundaries: what Figma may vary and what it must preserve

It must explicitly state:

- The applicable rules from `global-rules/design-rules.json`
- The paywall conversion strategy from `global-rules/paywall-rules.json`
- The required paywall render contract from `contracts/paywall.contract.json`
- The canonical navigation behavior from `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- Exact app background token, according to `global-rules/design-rules.json`
- Component and state expectations according to runtime page capabilities and `runtime/react-funnel-runtime/renderer-registry.json`.
- Account page and subscription management templates must match global theme tokens and desktop Web2App layout.
- Product-specific art direction and screen blueprints must be used as source of truth for composition differences.
- Image requirements must describe the scene, user moment, emotional job, subject, crop, environment, and what the image must help the user believe.

## Design Quality Rules

Use `global-rules/design-rules.json` as the canonical visual design rule source.

Use `global-rules/ob-conversion-rules.json` as the canonical OB conversion strategy source. Use `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json` for segmented-progress behavior.

Use `global-rules/paywall-rules.json` for paywall conversion strategy. Use `contracts/paywall.contract.json` for required paywall structure and runtime-rendered sections.

Use `global-rules/compliance-rules.json` as the canonical claim-safety source.

Use `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json` as the canonical CTA and auto-advance source.

Use `runtime/react-funnel-runtime/adapters/unit-conversion.spec.json` as the canonical height/weight conversion source.

Do not restate these rules differently in generated files. Apply them and cite the source files in `design-system.md`.

## Figma Prompt Standards

`design-prompt.md` must not be vague. Avoid weak wording like:

```text
Make it modern, clean, and user-friendly.
```

Prefer concrete instructions:

```text
Use a 390px mobile frame. Start with a two-column image grid for age_group. Each card has a 112px image, 16px bold label, selected state using the theme primary/accent token, checkmark badge, and navigation behavior matching navigation-behavior.spec.json.
```

For every template, specify:

- Frame size
- Top area/header treatment
- Primary content layout
- Main components
- CTA placement according to `navigation-behavior.spec.json`
- Whether the template uses auto-advance or requires CTA
- Empty/disabled/selected/loading states
- Any page-specific media requirements
- What not to draw

## Boundaries

- Do not create new page types.
- Do not write final frontend code.
- Do not change page order or data keys.
- Do not ignore page-level overrides or required assets.

## Completion Checklist

- Every selected page type has design guidance.
- Every selected variant and page-level override has design guidance.
- Required image/media assets are listed in the design prompt.
- Image/media requirements are aligned with page-map `visualDecision`; pages with `visualRole: "none"` do not receive decorative large images.
- Image style direction is scene-based and specific enough for `04b-image-asset-generator`.
- `art-direction.json` and `screen-blueprints.json` exist and explain how this product should differ visually from other generated funnels.
- Design direction matches product category and audience.
- Prompt tells design to design page types, not arbitrary marketing pages.
- Avoid list is explicit.
- `design-prompt.md` is self-contained enough to use without opening `design-system.md`.
- `theme.json` contains structured page template specs.
- First-screen behavior matches the page map and company rules.
- Height/weight unit switching is represented when present.
