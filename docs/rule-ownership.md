# Rule Ownership

This project should keep each rule in exactly one canonical layer.

## Canonical Layers

| Layer | Owns | Files |
| --- | --- | --- |
| Product input | One-off product and user requirements | `inputs/product-brief.md`, `inputs/funnel-requirements.md` |
| Company defaults | Default funnel structure and reusable business preferences | `global-rules/company-funnel-rules.json` |
| Conversion strategy | Why the OB exists and how it prepares users for paywall | `global-rules/ob-conversion-rules.json` |
| Visual direction | Product-specific style principles, palette decision boundaries, layout quality principles | `global-rules/design-rules.json` |
| Image policy | Raster image requirements, visual-decision contract, and asset handoff rules | `global-rules/image-asset-rules.json` |
| Paywall strategy | Paywall conversion intent, personalization principles, disclosure strategy | `global-rules/paywall-rules.json` |
| UI style recipe | Global visual-system contract and recipe boundaries | `contracts/ui-style-recipe.contract.json`, `docs/ui-style-recipe.md` |
| Product-run contracts | Machine-checkable required behavior for backend, paywall, navigation, and theme | `contracts/*.json` |
| Implementation recipes | Step-by-step implementation sequences for recurring workflows | `recipes/*.md` |
| Backend behavior | Executable API flow contract for React | `runtime/react-funnel-runtime/adapters/backend-integration.spec.json` |
| Navigation behavior | CTA, auto-advance, back behavior, validation gates | `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json` |
| Measurement behavior | Unit conversion and input behavior | `runtime/react-funnel-runtime/adapters/unit-conversion.spec.json` |
| Renderer behavior | Page type to React component mapping | `runtime/react-funnel-runtime/renderer-registry.json` |

## How Agents Should Use Rules

Agents should apply canonical rules by reference. They should not rewrite the same rule in a new form.

Good:

```text
Use global-rules/design-rules.json for palette constraints.
Use contracts/backend-api.contract.json for required Billing API behavior.
Use recipes/paywall-product-loading.md for the product hydration sequence.
Use runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json for CTA behavior.
```

Bad:

```text
Every multi-choice page should probably have a disabled button until selected.
```

That behavior belongs in the navigation contract/adapter, not inside an agent's personal interpretation.

## Principle, Contract, Recipe, Validator

Use four different shapes for four different jobs:

| Shape | Purpose | Example |
| --- | --- | --- |
| Principle | Human-readable default or preference | "Derive the palette from the product audience and modality." |
| Contract | Machine-checkable required structure or behavior | `paywall_page.productSource` must be `billing_resolve_offers`. |
| Recipe | Step-by-step implementation path | After first OB answer, create anonymous identity, exchange custom token, then use `idToken`. |
| Validator | Automated guardrail | Fail if React calls `/products` for frontend paywall display. |

This is the main way to avoid duplicated rules. A global rule should explain intent, a contract should define the shape, a recipe should define the process, and a validator should catch breakage.

## Default Versus Invariant

Company rules can be strict without becoming impossible to override.

- `severity: "hard"` means the workflow should enforce the rule by default.
- `overrideAllowed: true` means an explicit product or user requirement may replace the default.
- Runtime invariants belong in runtime adapters, contracts, recipes, or renderer code, not in `global-rules/`.

Examples:

- Entry portal first is a company default.
- Height and weight real-time unit conversion is runtime behavior owned by `unit-conversion.spec.json` and runtime components.
- Stripe secret keys must never appear in frontend output is a security invariant owned by backend/API contracts and validators.

## Generated Outputs

Generated files under `outputs/` are product-specific artifacts. They should contain decisions, not new policy.

For example:

- `outputs/design/theme.json` stores the selected colors for one product.
- `outputs/design/design-system.md` explains how those colors are used for that product.
- `outputs/config/funnel.config.json` stores the concrete runnable funnel.
- `outputs/app/**` implements that concrete funnel.

If a generated output reveals a recurring rule, move the rule back into `global-rules/`, `contracts/`, `recipes/`, `runtime/react-funnel-runtime/adapters/`, or `runtime/react-funnel-runtime/renderer-registry.json`.

## Validation Ownership

Validators should mirror the architecture:

- input validators check required source files
- page-map validators check funnel structure
- asset validators check local raster image handoff
- config validators check runtime-ready data
- app validators check React/mobile/runtime/backend implementation basics
- Figma validators check template handoff state
- copy validators check copy coverage

Validators should report violations of canonical rules. They should not invent new rules silently.

## Image Decision Ownership

Large-image decisions have a dedicated ownership chain:

| Step | Owns |
| --- | --- |
| `global-rules/image-asset-rules.json` | Defines the reusable visual-decision contract and default image policy |
| `agents/02-page-architect.md` | Writes `pages[].visualDecision` for every page |
| `agents/04a-image-planner.md` | Converts approved `visualDecision` fields into `outputs/assets/image-plan.json` slots |
| `agents/04b-image-asset-generator.md` | Generates or sources the image files from the approved image plan |
| `agents/05-config-builder.md` | Binds image assets back to pages/options while preserving `visualDecision` |
| `agents/08-qa-reviewer.md` | Checks required images, skipped images, and accidental page-name-based image rules |

Do not decide conditional images by concrete page names such as focus area, sleep, flexibility, equipment, or motivation. Those names are product-run artifacts. The durable rule is the visual function: recognition, visual option difference, result imagination, trust building, concept explanation, emotional reinforcement, or proof.
