# 02a Skeleton Selector Subagent

## Mission

Select the best modular funnel skeleton for the product and explain why.

## Inputs

- `outputs/strategy/product-brief.json`
- `funnel-skeletons/*.json`
- `global-rules/company-funnel-rules.json`
- `global-rules/compliance-rules.json`
- `global-rules/ob-conversion-rules.json`
- `inputs/funnel-requirements.md`

## Outputs

- `outputs/skeleton/selected-skeleton.json`
- `outputs/skeleton/selected-skeleton.md`

## Write Scope

Only write to `outputs/skeleton/`.

## Responsibilities

- Match the product category, target audience, core promise, and funnel type to the best available skeleton.
- Prefer domain-specific standard skeletons over the legacy broad fitness skeleton when their `selectionSignals` and `domainAdaptation` fit the product.
- Select funnel depth automatically unless `inputs/funnel-requirements.md` explicitly sets `Preferred funnel depth` to `standard`, `deep`, or `expert`.
- Preserve the depth decision as structured metadata in `outputs/skeleton/selected-skeleton.json`, including `depthMode`, `depthReason`, `targetQuestionPages`, and `targetTotalPages`.
- Use this selection priority:
  1. `standard-low-impact-seniors-funnel` for seniors, chair workout, chair yoga, tai chi, mobility, balance, gentle/low-impact products.
  2. `standard-weight-loss-funnel` for weight loss, slimming, fasting, calorie, diet-adjacent, body transformation, belly/shape-led products.
  3. `standard-strength-funnel` for strength, calisthenics, bodyweight, muscle, tone, military workout, no-equipment training.
  4. `standard-pilates-yoga-funnel` for Pilates, yoga, stretching, posture, flexibility, wall Pilates, core/mobility practice.
  5. `standard-walking-funnel` for walking, steps, step habit, walking weight loss, beginner cardio.
  6. Fall back to `fitness-subscription-standard` only when no domain-specific skeleton fits.
- Preserve the selected skeleton's module order. New skeletons use `modules`; legacy skeletons may use `stages`.
- Preserve skeleton module metadata when present: `moduleId`, `sectionLabel`, `required`, `minQuestionPages`, `maxQuestionPages`, `requiredDataKeys`, `recommendedDataKeys`, `domainAdaptation`, `operatingModel`, `progressPolicy`, and `feedbackPagePolicy`.
- Preserve slot metadata when present: `slotId`, `required`, `allowedPageTypes`, `recommendedVariants`, `dataKey`, `minSelections`, `purpose`, `feedbackAfter`, `usesAnswers`, `assetRequirement`, `measurementType`, `units`, `defaultUnit`, and `sensitive`.
- Preserve required `intro_page` feedback slots between major sections.
- Identify which global rules affect the selected skeleton.
- Explain any skeleton slots that should be omitted, kept optional, or made required for this product.
- If two skeletons both match, choose the one that best matches the target audience and product promise, not the one with the most keyword overlap.
- Do not collapse the selected skeleton into only `id`, `length`, and `targetPages`. The output must keep enough module/slot detail for the page architect to create a deep funnel.

## Depth Selection

Default depth selection is `auto`. The user should not need to pick a depth for every run.

If `inputs/funnel-requirements.md` contains one of these values, honor it:

```text
Preferred funnel depth: auto
Preferred funnel depth: standard
Preferred funnel depth: deep
Preferred funnel depth: expert
```

When the value is missing or `auto`, choose from:

| Depth | Counted OB question/input pages | Approx total pages | Use when |
| --- | ---: | ---: | --- |
| `standard` | 22-28 | 38-48 | Low-friction fitness, chair yoga, tai chi, walking, stretching, gentle workouts, simple goal personalization |
| `deep` | 28-36 | 48-65 | Weight loss, body transformation, fasting, diet-adjacent, muscle gain, strong personalization, higher purchase anxiety |
| `expert` | 36+ | 65+ | Noom-like behavior change, long-term health programs, broad habit psychology, complex nutrition or medical-adjacent education |

Decision heuristics:

- Choose `standard` for simple movement plans where user commitment is moderate and too many questions may create friction.
- Choose `deep` when the paid promise depends on detailed personalization, body metrics, habits, barriers, motivation, target timeline, and objection handling.
- Choose `expert` only when the product strategy needs a high-investment diagnostic experience and the audience will tolerate a long questionnaire.
- Do not choose a deeper tier merely to hit a page count. Every added question must support personalization, segmentation, objection handling, summary/analysis output, paywall readiness, or analytics learning.
- If a domain skeleton's built-in `length.targetQuestionPages` is lower than the selected depth mode, keep the same domain skeleton but widen its effective target question range and favor optional slots or duplicated module-specific slot patterns with product-specific purposes.
- If a domain skeleton's built-in `length.targetQuestionPages` is higher than the selected depth mode, keep the same domain skeleton but omit optional slots first and explain the tradeoff.

## Output Shape

`outputs/skeleton/selected-skeleton.json` must include:

```json
{
  "version": "0.3.0",
  "selectedSkeletonId": "standard-strength-funnel",
  "sourceFile": "funnel-skeletons/standard-strength-funnel.json",
  "selectionReason": "Why this skeleton best fits the product",
  "matchedSignals": ["calisthenics", "bodyweight", "strength"],
  "audienceFit": "How target audience affected selection",
  "depthMode": "standard | deep | expert",
  "depthSource": "auto | user_override",
  "depthReason": "Why this depth fits the product and traffic context",
  "targetQuestionPages": { "min": 22, "max": 28 },
  "targetTotalPages": { "min": 38, "max": 48 },
  "domainAdaptation": {},
  "length": {},
  "operatingModel": {},
  "modules": []
}
```

When the source skeleton uses `stages` instead of `modules`, normalize it to `modules` in the selected output while preserving original stage metadata.

## Boundaries

- Do not create the final page map.
- Do not write copy.
- Do not design UI.
- Do not change skeleton source files.

## Completion Checklist

- A skeleton id is selected.
- Domain-specific skeletons were considered before legacy fallback.
- Module order is listed.
- Required modules, required slots, optional slots, and answer-triggered feedback slots are clear.
- `minQuestionPages` / `maxQuestionPages` ranges are preserved for every module that defines them.
- `requiredDataKeys` and `recommendedDataKeys` are preserved.
- Applicable global rules are referenced by id.
- Section order and intro slots are preserved or explicitly justified if omitted.
