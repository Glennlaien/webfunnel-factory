# Funnel Requirements

The funnel should use fixed page types from `configs/page-types.json`.

Preferred funnel depth: auto

Depth behavior:

- `auto`: workflow selects the depth from product category, audience, commitment level, and personalization complexity.
- `standard`: roughly 22-28 counted OB question/input pages, usually 38-48 total funnel pages.
- `deep`: roughly 28-36 counted OB question/input pages, usually 48-65 total funnel pages.
- `expert`: 36+ counted OB question/input pages, usually 65+ total funnel pages.

Page count is not a target. For personalization-heavy Web2App funnels, 30-40 onboarding steps can be appropriate, but every step must support at least one of:

- Personalization
- User segmentation
- Objection handling
- Summary or analysis output
- Paywall readiness
- Analytics learning

Do not hard-fill pages.

## Rule Sources

- Company flow rules: `global-rules/company-funnel-rules.json`
- Design rules: `global-rules/design-rules.json`
- OB conversion rules: `global-rules/ob-conversion-rules.json`
- Paywall conversion rules: `global-rules/paywall-rules.json`
- Image asset rules: `global-rules/image-asset-rules.json`
- Image plan contract: `contracts/image-plan.contract.json`
- Compliance rules: `global-rules/compliance-rules.json`
- Product-run contracts: `contracts/*.json`
- Implementation recipes: `recipes/*.md`
- Navigation behavior: `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- Unit conversion behavior: `runtime/react-funnel-runtime/adapters/unit-conversion.spec.json`
- Backend integration behavior: `runtime/react-funnel-runtime/adapters/backend-integration.spec.json`
- Backend API contract: `contracts/backend-api.contract.json`
- Backend API reference: `inputs/api-reference.md`

## Product-Specific Overrides

Only write requirements here when this product should override the canonical rule files.

Examples:

- Use a shorter OB because this campaign is traffic from a warm email list.
- Replace the default age group options with product-specific ranges.
- Add a special page required by a legal or market requirement.

Default company, design, paywall, image, navigation, measurement, and backend rules should stay in their canonical files. See `docs/rule-ownership.md`.
