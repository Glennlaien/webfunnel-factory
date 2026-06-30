# Architecture

## Layers

```text
Inputs
-> Subagent role prompts
-> Canonical rule files
-> Product-run contracts
-> Implementation recipes
-> Page Type System
-> Structured outputs
-> Image asset generation
-> Validation scripts
-> Exported developer/design config
-> Design provider page type templates
-> React Funnel Runtime implementation
-> Backend integration adapter
-> QA
```

## Why Page Types

Page types are the stable layer above code components.

Product, funnel, copy, and UI agents should reason in terms of:

```text
intro_page
single_choice_page
multi_choice_page
email_capture_page
summary_page
plan_ready_page
paywall_page
```

React Funnel Runtime implements each page type as one reusable renderer.

## Clean Architecture Principle

This factory has three different kinds of files:

```text
Canonical rules    -> stable policy and runtime contracts
Contracts          -> machine-checkable required behavior for product runs
Recipes            -> repeatable implementation sequences
Agent prompts      -> role instructions that apply the rules
Generated outputs  -> one product's concrete strategy, design, config, app, and QA
```

Generated outputs should not become hidden policy. If a pattern should apply to future funnels, move it into a canonical rule file and let agents reference it.

See `docs/rule-ownership.md` for the detailed ownership map.

## Rule Ownership

Each rule should have one source of truth:

```text
Company flow rules      -> global-rules/company-funnel-rules.json
OB conversion rules     -> global-rules/ob-conversion-rules.json
Visual design rules     -> global-rules/design-rules.json
Compliance rules        -> global-rules/compliance-rules.json
Image asset rules       -> global-rules/image-asset-rules.json
Navigation behavior     -> runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json
Unit conversion behavior -> runtime/react-funnel-runtime/adapters/unit-conversion.spec.json
Backend integration     -> runtime/react-funnel-runtime/adapters/backend-integration.spec.json
Product-run contracts   -> contracts/*.json
Implementation recipes  -> recipes/*.md
Page semantics          -> page-types/*.md
React renderer mapping  -> runtime/react-funnel-runtime/renderer-registry.json
```

Agents and generated outputs should apply these rules by reference instead of redefining them.

Company rules are defaults unless a rule is marked as a runtime or security invariant. This keeps the system opinionated but still flexible for special product requirements.

## OB Conversion Layer

The onboarding flow is a pre-paywall conversion experience, not a neutral questionnaire.

Every page before paywall should support at least one of:

```text
personalization
segmentation
trust building
objection handling
plan ownership
paywall readiness
```

Pre-paywall pages must include section metadata:

```text
sectionId
sectionLabel
sectionOrder
```

React uses this metadata to render a segmented top progress bar, and the selected design provider uses it to design the progress/header template.

`intro_page` is the canonical transition/trust page. It is used between major sections to explain why the next questions matter, keep momentum, and build trust before sensitive questions or paywall. Whether an intro page includes a hero image is decided by `pages[].visualDecision`: use a media area when `visualRole` is `page_hero`, and keep it copy-only only when `visualRole` is `none`.

## Design Layer

Figma and the provider-neutral design layer are design sources, but they do not draw every page in the funnel.

The selected design provider draws:

```text
used page types
used variants
mandatory page-level overrides
height/weight input variants when used
paywall template
```

For example, 34 funnel pages may only require 12-16 design templates.

## Image Asset Layer

Images are a first-class generated output, not ad hoc decoration.

The large-image flow is:

```text
page-map page capabilities and assetRequirement
-> UI design image direction
-> image-planner
-> outputs/assets/image-plan.json
-> image-asset-generator
-> outputs/assets/asset-manifest.json
-> Design templates
-> React app
```

The image plan is reviewable before generation. It includes large visuals only: hero images, option-card images, body/result visuals, and App Store screenshot-style assets. Tiny option icons, payment logos, progress bars, charts, UI glyphs, and code-generated visuals do not belong in the image plan.

Age group image grids should have one transparent-background image per option. Intro pages get one hero image per actual intro page. Summary body visuals are planned as a reusable four-image set when the funnel has BMI/body result summary, and paywall result comparison should reuse that set when possible. Plan Generation pages use runtime animation rather than generated large images.

React must use local files from `outputs/assets`; it should not depend on transient image-generation URLs.

Required AI image assets must not be marked ready unless image generation actually ran. If generation is unavailable, `outputs/assets/asset-manifest.json` should keep the prompt and mark the asset as `pending_generation`. This prevents placeholder raster files from being mistaken for final `gpt-image-2` output.

## Development Layer

React Funnel Runtime is the fixed frontend engine under `runtime/react-funnel-runtime/`.

Runtime Assembler creates the product-specific app under `outputs/app/` by instantiating the runtime with the current generated config, theme, app config package, and provider-neutral design template map.

The app should:

- Use React.
- Be mobile-first.
- Be PC compatible.
- Render from `outputs/config/funnel.config.json`.
- Select renderers by `pageType` and `variant`.
- Follow `runtime/react-funnel-runtime/renderer-registry.json`.
- Follow `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.
- Use provider-neutral design templates as visual references.
- Use local assets from `outputs/assets/asset-manifest.json`.
- Render segmented top progress from section metadata.
- Support height/weight unit switching with real-time conversion when present.
- Support measurement picker pages and image option grids when present.

## Funnel State Layer

The funnel is not just a page list. It is a state machine:

```text
entry -> onboarding -> result -> paywall -> checkout -> paid -> account
```

Generated pages carry `phase` and `role`. Durable milestones such as backend payment verification and account authentication commit the user to a later phase. React persists `committedPhase` and routes URL loads, browser back, and in-app navigation through a central route guard.

This avoids brittle symptom-level rules such as "after registration do not go back to OB". The runtime enforces the general lifecycle instead.

## Backend Integration Layer

The generated funnel should follow the same broad runtime path as the legacy Vue Web2App funnel:

```text
anonymous uid
-> OB answers
-> paywall product hydration
-> Stripe checkout through backend
-> payment return verification
-> account continuation
-> identity merge when needed
```

The standard backend contract is:

```text
docs/backend-integration-contract.md
contracts/backend-api.contract.json
recipes/firebase-custom-token-auth.md
recipes/paywall-product-loading.md
recipes/stripe-embedded-checkout.md
recipes/answer-persistence.md
runtime/react-funnel-runtime/adapters/backend-integration.spec.json
inputs/api-reference.md
```

React uses Firebase Web SDK for auth token exchange. It creates a Firebase-backed anonymous uid by calling the backend anonymous user endpoint, receives `uid/customToken`, signs in with `signInWithCustomToken(customToken)`, stores the resolved `uid/idToken`, and uses that ID token for authenticated billing calls. The backend `customToken` is only for Firebase Auth sign-in and must not be sent as a Billing API bearer token.

Mock plans can be used as fallback data when product APIs fail. Mock checkout success is not allowed when backend env values are configured.

## Why Runtime Still Uses Design Providers

Figma or the provider-neutral design layer defines the visual standard for runtime page type templates. The runtime keeps implementation stable; the selected design source keeps the components visually intentional and product-aware.

## Why Not Independent Agent Service Yet

This repo is the early-stage shape:

```text
Codex subagents + files + validation
```

Only build a real service after the page type system, outputs, and validation rules are stable.

## Validation Layer

`npm run validate` is split by concern:

```text
scripts/validators/inputs.mjs
scripts/validators/page-map.mjs
scripts/validators/assets.mjs
scripts/validators/config.mjs
scripts/validators/app.mjs
scripts/validators/design-handoff.mjs
scripts/validators/copy.mjs
```

This keeps validation close to the architecture instead of becoming a single catch-all script.
