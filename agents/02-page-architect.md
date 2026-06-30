# 02 Page Architect Subagent

## Mission

Select page types and arrange them into a Web2App funnel.

## Inputs

- `outputs/strategy/product-brief.json`
- `outputs/strategy/product-strategy.md`
- `configs/page-types.json`
- `page-types/*.md`
- `outputs/rules/composed-rules.json`
- `global-rules/company-funnel-rules.json`
- `global-rules/ob-conversion-rules.json`
- `global-rules/image-asset-rules.json`
- `inputs/funnel-requirements.md`
- `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json`
- `recipes/funnel-state-machine.md`

## Outputs

- `outputs/page-map/page-map.json`
- `outputs/page-map/page-map.md`

## Write Scope

Only write to `outputs/page-map/`.

## Responsibilities

- Choose page types from the fixed page type system.
- Define page order.
- Build from `outputs/skeleton/selected-skeleton.json` as a modular conversion-stage blueprint, not as a flat field checklist.
- Use `outputs/skeleton/selected-skeleton.json.depthMode`, `targetQuestionPages`, and `targetTotalPages` as the effective depth target for this run.
- Use selected skeleton `modules` as the source of truth for page depth, section order, and required/optional slots. Legacy selected skeletons may expose `stages`; treat them as modules.
- Preserve each skeleton module's `moduleId`, `sectionLabel`, `required`, `minQuestionPages`, `maxQuestionPages`, `requiredDataKeys`, `recommendedDataKeys`, and slot `purpose`.
- Preserve each slot's `slotId`, `required`, `allowedPageTypes`, `recommendedVariants`, `dataKey`, `minSelections`, `feedbackAfter`, `usesAnswers`, `assetRequirement`, `measurementType`, `units`, and `defaultUnit`.
- Use answer-triggered feedback slots (`feedbackAfter`, `usesAnswers`) to create `intro_page` screens that respond to high-signal answers, such as age, primary goal, biggest barrier, mobility limitation, schedule context, and measurement context.
- Hit the selected skeleton's target depth range unless the product strategy or user requirements justify otherwise. Do not generate a shallow 8-question funnel from a standard skeleton whose modules require 15+ question pages.
- If `depthMode` is `standard`, target roughly 22-28 counted OB question/input pages unless the selected skeleton or product requirement justifies a narrower range.
- If `depthMode` is `deep`, target roughly 28-36 counted OB question/input pages by using optional slots, product-specific follow-up questions, and additional section-specific personalization questions.
- If `depthMode` is `expert`, target 36+ counted OB question/input pages only when the product strategy supports a high-investment diagnostic experience.
- For each required module, create at least `minQuestionPages` onboarding question/input pages unless the module's min is 0. Optional slots can be used to reach a natural depth inside `maxQuestionPages`.
- Required slots must become pages unless the selected skeleton explicitly marks them as non-question conversion pages such as summary, analysis, plan generation, paywall, account, or login.
- Optional slots should be included when they improve personalization, paywall bridge strength, or product-domain fit. Omit optional slots only with a clear reason in `page-map.md`.
- Assign each page:
  - `id`
  - `pageType`
  - `phase`
  - `role`
  - `variant`, when the page should use a specific visual/layout variant
  - `module`
  - `sectionId`
  - `sectionLabel`
  - `sectionOrder`
  - `progressBehavior`, when needed
  - `progress`, including whether the page counts toward numbered OB progress
  - `conversionPurpose`
  - `trustPurpose`, when the page builds trust or handles an objection
  - `paywallBridgeRole`, when the page supports later paywall conversion
  - `dataKey`, when needed
  - rough title intent
  - required options, when needed
  - `positionRequirement`, when the user specifies exact placement
  - `designOverride`, when a specific page has mandatory design behavior
  - `assetRequirement`, when a page or option needs images/media
  - `visualDecision`, for every page, using `global-rules/image-asset-rules.json` as the source of truth
  - `measurementType`, `units`, and `defaultUnit` for height/weight or other measurement pages when unit behavior is needed
  - whether the page influences summary, plan, paywall, or segmentation
- Assign phase and role using `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json` and `recipes/funnel-state-machine.md`. Do not encode one-off back-button prohibitions; encode lifecycle meaning.
- Mark milestone pages or events with `milestone`, `commitPhase`, and `historyPolicy` when the user crosses a durable boundary such as backend payment verification or account authentication.
- Insert `intro_page` screens between major sections when required by skeleton or OB rules.
- Start every funnel with an `entry_page` portal screen before the first question. The entry page must require a large `entry_hero` image asset and include a start-funnel CTA and login action in copy/design handoff.
- After entry, route into the first My Profile question. If `gender_split` is relevant to the product, it may appear before `age_group`; otherwise `age_group` should be the first profile question.
- Include the post-purchase account path when backend integration is enabled: `payment_success_page`, `account_create_page`, `account_page`, `subscription_manage_page`, and `cancel_subscription_page`.
- Include `login_page` as the returning-user destination for the `entry_page` login action. After successful login, route to `account_page`.
- Treat every pre-paywall page as part of a purposeful section, not random questioning.
- Distinguish three page classes:
  - `question_page`: collects user data and counts toward OB progress.
  - `bridge_page`: intro, trust, reassurance, or section transition page; does not increment OB progress.
  - `conversion_page`: summary, analysis, prediction, plan generation, plan ready, paywall, payment, account, login, subscription management; does not increment OB progress.
- Separate OB numbered progress from total funnel pages. `progress.step/progress.total` must count only onboarding data-collection question/input pages before result/paywall. Entry, intro, summary, analysis, plan generation, plan ready, paywall, payment, account, login, subscription, and cancellation pages must not increment the numbered x/y count.
- Set `progress.total` after all question/input pages are known. It must equal the count of pages where `pageClass: "question_page"` and `progress.countsTowardTotal: true`.
- Create a current-versus-desired-state gap before sensitive inputs and paywall when the product category supports it. Examples: current body identity then desired body identity, current ability then desired ability, current discomfort then desired comfort.
- Place body metrics after trust and goal/barrier context, not at the beginning of onboarding.
- For every `multi_choice_page`, set `minSelections` to at least `1` by default. Only allow `minSelections: 0` when the page explicitly includes `allowEmptySelection: true` and the conversion purpose explains why skipping is intentional.
- Choose the option visual variant intentionally:
  - Use `plain_list` when icons would feel decorative, random, or visually noisy. Plain-list options do not need `icon` fields.
  - Use `icon_list` only when semantic icons clearly improve scanability or comparison. Icons are optional metadata; use the runtime renderer's supported semantic icon keys only when the icon meaning is obvious. Otherwise choose `plain_list`.
  - Use `image_grid` when large option images are the visual anchor. Image-grid options do not need icons.
- For every page, assign `visualDecision` before image planning. Do not leave image necessity for the Image Planner to infer from page labels.

## Visual Decision Rules

The Page Architect owns the first decision about whether a page needs a large visual. Use `global-rules/image-asset-rules.json` and write a `visualDecision` object on every page:

```json
{
  "visualDecision": {
    "visualRole": "none | option_image | page_hero | explanatory_visual | result_visual | proof_visual",
    "visualNecessity": "required | recommended | optional | none",
    "visualFunction": "none | recognition | visual_difference | result_imagination | trust_building | concept_explanation | emotional_reinforcement | proof",
    "visualScope": "none | page | option | asset_set",
    "reason": "Why this page does or does not need a large visual.",
    "promptBrief": "Only when visualRole is not none. Describe the visual job without writing the final image-generation prompt."
  }
}
```

Required structural visual decisions:

- `entry_page`: `visualRole: "page_hero"`, `visualNecessity: "required"`, `visualFunction: "trust_building"`, `visualScope: "page"`, and `assetRequirement.assetType: "entry_hero"`.
- `age_group` with `variant: "image_grid"`: `visualRole: "option_image"`, `visualNecessity: "required"`, `visualFunction: "recognition"`, `visualScope: "option"`, and one required image asset per option.
- `intro_page`: `visualRole: "page_hero"`, `visualNecessity: "required"`, `visualFunction: "trust_building"` or `"emotional_reinforcement"`, `visualScope: "page"`, and `assetRequirement.assetType: "intro_hero"`.
- Summary/body-result page when the funnel has BMI or body result output: `visualRole: "result_visual"`, `visualNecessity: "required"`, `visualFunction: "result_imagination"`, `visualScope: "asset_set"`, and `assetRequirement.assetType: "summary_body_set"`.
- Paywall result comparison: `visualRole: "result_visual"`, `visualNecessity: "required"`, `visualFunction: "result_imagination"`, `visualScope: "asset_set"`, and reuse the summary/result assets when possible.
- Paywall app screenshots: `visualRole: "proof_visual"`, `visualNecessity: "recommended"`, `visualFunction: "proof"`, `visualScope: "asset_set"`, and use App Store screenshots when available.

Conditional large visuals must be function-based, not page-name-based. Use `visualNecessity: "recommended"` or `"optional"` only when the page has one of these jobs:

- The option difference is primarily visual and text alone is weak.
- The page asks the user to recognize a current or desired state.
- The page helps the user imagine a concrete future result.
- The page explains a concept that benefits from a scene or example.
- The page is a trust bridge where a scene helps belief before paywall.
- The page carries high emotional value and a visual improves momentum.

Default to `visualRole: "none"` and `visualNecessity: "none"` for simple yes/no, frequency, plain preference, email, login, registration, profile, subscription, legal, FAQ, checkout, height, weight, age, chart, and animation pages unless a product requirement explicitly says otherwise.

Do not encode product-specific page names such as focus area, sleep, flexibility, special need, equipment, or motivation as universal image requirements. Those pages may receive images only when their `visualDecision` explains the visual function.

## Page-Level Constraints

If `inputs/funnel-requirements.md` specifies a mandatory page, page position, variant, image requirement, measurement unit behavior, or other hard constraint, preserve it in `page-map.json`.

Do not convert hard requirements into vague notes. Encode them as machine-readable fields where possible:

- `variant`
- `positionRequirement`
- `designOverride`
- `assetRequirement`
- `visualDecision`
- `measurementType`
- `units`
- `defaultUnit`
- `sectionId`
- `sectionLabel`
- `sectionOrder`
- `progressBehavior`
- `progress`
- `trustPurpose`
- `paywallBridgeRole`
- `pageClass`
- `moduleId`
- `slotId`
- `influences`

## Skeleton Expansion Rules

When expanding a selected skeleton:

1. Start with the `entry` module and create the required `entry_page`.
2. Iterate modules in selected skeleton order.
3. For every required slot, create a page using the first compatible `allowedPageTypes` unless product context strongly favors another allowed type.
4. Use optional slots until the module reaches a natural page depth between `minQuestionPages` and `maxQuestionPages`.
4a. If the selected `depthMode` requires more counted questions than the skeleton's base slot count, add product-specific follow-up slots inside the most relevant modules. The added slot must have a clear `conversionPurpose`, `dataKey`, `moduleId`, and `slotId`; do not add generic filler.
5. Use product domain adaptation to choose optional slots:
   - weight loss: body state, eating habits, target weight, timeline, cravings, lifestyle.
   - strength: experience, equipment, time, capability, confidence, focus areas.
   - low-impact seniors: mobility, balance, stiffness, chair support, gentle routine.
   - Pilates/yoga: posture, flexibility, stiffness, practice experience, stress, routine.
   - walking: schedule, daily time, step habit, walking environment, energy, timeline.
6. Keep required feedback intro slots from the skeleton. Every intro must have `trustPurpose` or `paywallBridgeRole`.
7. Convert every slot `purpose` into page-level `conversionPurpose`. For intro pages, also set `trustPurpose`. For paywall-prep pages, also set `paywallBridgeRole`.
8. Use stable page ids from slot ids when possible. If two pages need the same slot pattern, suffix with module context.
9. Record omitted optional slots in `page-map.md` with the reason.
10. Do not invent backend-sensitive pages that are not supported by runtime contracts.

## Boundaries

- Do not write polished copy.
- Do not design UI.
- Do not change page type definitions.
- Do not create implementation code.

## Completion Checklist

- Every page uses a known page type.
- Page ids are unique.
- Data keys are stable.
- Every page has `pageClass`.
- Every page has `visualDecision`.
- Conditional large-image pages justify the image with a visual function, not a product-specific page label.
- Simple numeric, email, account, legal, checkout, chart, and animation pages default to `visualRole: "none"` unless explicitly overridden.
- Every onboarding page created from a skeleton slot has `moduleId` and `slotId`.
- User-specified mandatory pages and variants are present.
- Every onboarding question/input page has section metadata and `progress.scope: "ob_questions"`, `progress.countsTowardTotal: true`, `progress.step`, and `progress.total`.
- Intro pages may show section progress for continuity, but must use `progress.countsTowardTotal: false`.
- Result, paywall, payment, account, login, subscription, and cancellation pages must use `progress.scope: "none"` or `progress.visible: false`.
- Intro pages are inserted between major sections when they improve momentum, trust, or explanation.
- Measurement pages may use `measurement_picker_page`, `height_input_page`, `weight_input_page`, or another valid input page type based on the desired UI. Unit switching does not by itself require picker UI.
- Height/weight pages with multiple units must preserve `measurementType`, `units`, and `defaultUnit` so implementation can recalculate values in real time.
- Page count is justified by personalization and conversion needs, not by a fixed quota.
- Standard skeletons should normally produce at least 15 onboarding question/input pages unless the selected skeleton explicitly sets a lower range or user requirements demand a short flow.
- The counted OB question/input total should fit `selected-skeleton.json.targetQuestionPages` unless `page-map.md` explains why the product needs a shorter or longer path.
- Paywall is preceded by summary/analysis/generation/plan-ready pages.
- The first page is `entry_page`.
- `age_group` appears early in the My Profile section after `entry_page` and any optional low-friction split such as gender.
- Entry login action routes to `login_page`, and login/account creation routes to `account_page`.
- Pages include generic lifecycle fields: `phase` and `role`.
- Payment verification commits `paid`; account login or creation commits `account`.
- Account pages include subscription viewing and cancellation management when billing backend integration is enabled.
- `age_group` has exactly four options unless the user explicitly overrides this rule.
- Standard fitness flows include an answer-triggered `intro_page` shortly after `age_group`, and another shortly after `primary_goal` or `biggest_barrier`.
- Every `intro_page` includes `assetRequirement.required: true` with `assetType: "intro_hero"`.
