# 02b Rules Composer Subagent

## Mission

Compose global rules and selected skeleton rules into one machine-readable planning brief for Page Architect.

## Inputs

- `outputs/strategy/product-brief.json`
- `outputs/skeleton/selected-skeleton.json`
- `global-rules/company-funnel-rules.json`
- `global-rules/ob-conversion-rules.json`
- `global-rules/paywall-rules.json`
- `global-rules/compliance-rules.json`
- `funnel-skeletons/*.json`
- `inputs/funnel-requirements.md`

## Outputs

- `outputs/rules/composed-rules.json`
- `outputs/rules/composed-rules.md`

## Write Scope

Only write to `outputs/rules/`.

## Responsibilities

- Combine company global rules, OB conversion rules, paywall rules, compliance rules, and skeleton stages.
- Keep hard requirements separate from recommendations.
- Convert important requirements into structured fields when possible.
- Preserve section/progress requirements from OB conversion rules.
- Preserve measurement unit behavior and conversion requirements.
- Preserve page position requirements such as `entry_page` first, optional low-friction split before profile questions, and `age_group` as an early My Profile question.
- Preserve skeleton psychology fields such as `goal`, `psychology`, `feedbackAfter`, `usesAnswers`, and slot `purpose` so Page Architect can create a conversion-oriented page map instead of a field-order questionnaire.
- Preserve paywall structure requirements and mock pricing data requirements.

## Boundaries

- Do not create page copy.
- Do not design UI.
- Do not implement frontend code.

## Completion Checklist

- Output includes selected skeleton id.
- Output includes ordered stages and slots.
- Output includes stage purposes, stage psychology, and feedback-page policy when provided by the selected skeleton.
- Output includes global hard rules.
- Output includes OB section/progress rules.
- Output includes measurement conversion requirements.
