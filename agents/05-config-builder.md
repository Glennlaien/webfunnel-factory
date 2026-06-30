# 05 Config Builder Subagent

## Mission

Combine strategy, page map, copy, and design into developer-ready config.

## Inputs

- `outputs/strategy/product-brief.json`
- `outputs/page-map/page-map.json`
- `outputs/copy/page-copy.json`
- `outputs/design/theme.json`
- `outputs/assets/asset-manifest.json`
- `schemas/*.json`
- `contracts/*.json`
- `recipes/*.md`
- `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- `runtime/react-funnel-runtime/adapters/backend-integration.spec.json`
- `global-rules/ob-conversion-rules.json`
- `global-rules/paywall-rules.json`
- `contracts/backend-api.contract.json`
- `docs/backend-integration-contract.md`
- `inputs/api-reference.md`

## Outputs

- `outputs/config/funnel.config.json`
- `outputs/config/funnel.config.ts`
- `outputs/exports/design-prompt.md`
- `outputs/exports/developer-brief.md`

## Write Scope

Only write to `outputs/config/` and `outputs/exports/`.

## Responsibilities

- Merge page map and copy into one developer-facing funnel config.
- Preserve source ids and data keys.
- Preserve `variant`, `positionRequirement`, `sectionId`, `sectionLabel`, `sectionOrder`, `progressBehavior`, `progress`, `trustPurpose`, `paywallBridgeRole`, `designOverride`, `assetRequirement`, `visualDecision`, `measurementType`, `units`, and `defaultUnit` from page map.
- Attach generated asset references from `asset-manifest.json` to the matching pages and options.
- When attaching assets, prefer the page's `visualDecision` to determine whether the asset belongs to the page, an option, or a result/proof set. Do not attach generated images to pages whose `visualDecision.visualRole` is `none`.
- Preserve each option's `icon` field from page map into `funnel.config.json`; do not drop icon metadata during copy merge.
- For `paywall_page`, follow `contracts/paywall.contract.json` and include backend-ready pricing and checkout data: `pricingMode`, `selectedPlanId`, `plans`, `productSource: "billing_resolve_offers"`, `placementCode`, `resultPreview`, `promo`, `renewalDisclosure`, `highlights`, `testimonials`, `faq`, `moneyBackGuarantee`, and `legalLinks`.
- Treat `placementCode` / URL `lpid` as the frontend product-loading key. Do not generate or require `paywallCode` for ordinary frontend paywall product loading unless an upstream backend contract explicitly provides an internal paywall code for a separate internal use case.
- For every `multi_choice_page`, preserve `minSelections`. If upstream omitted it, set `minSelections: 1` unless the page explicitly declares `allowEmptySelection: true`.
- For `paywall_page`, include `paymentProvider: "stripe"`, `stripeMode`, `stripePublishableKeyEnv`, `requiresClientSecret`, and `checkoutApiStatus`.
- For account pages, include backend-ready subscription metadata:
  - `login_page.authMode: "backend_email_password_login"`
  - `account_page.requiresAuthenticatedUser: true`
  - `account_page.subscriptionDataSource: "subscriptionSummary"`
  - `subscription_manage_page.cancelEndpoint: "cancelSubscription"`
  - `cancel_subscription_page.cancelAtPeriodEnd: true`
- Include a top-level `backendIntegration` object that references the runtime backend adapter and exposes the required env names:
  - `baseUrlEnv: "VITE_BILLING_API_BASE_URL"`
  - `appCodeEnv: "VITE_BILLING_APP_CODE"`
  - `stripePublishableKeyEnv: "VITE_STRIPE_PUBLISHABLE_KEY"`
  - `identityMode: "backend_custom_token_firebase_web_sdk"`
  - `storageScope: "sessionStorage"`
  - `firebaseAuthPersistence: "browserSessionPersistence"`
  - `anonymousIdentityTrigger: "first_real_ob_answer_input"`
  - `firestoreAnswerCollectionEnv: "VITE_FIRESTORE_FUNNEL_COLLECTION"`
  - `firestoreAnswerCollectionDefault: "test"`
  - `firestoreAnswerDocumentId: "uid"`
  - `authHeader: "Authorization: Bearer <idToken>"`
  - `answerPersistenceMode: "local_first_firestore"`
  - `standardCheckoutMode: "stripe_embedded_checkout"`
  - `accountRegistrationMode: "backend_email_password_register"`
  - `accountLoginMode: "backend_email_password_login"`
  - `subscriptionManagementMode: "backend_subscription_management"`
  - `mockModePolicy: "fallback_only"`
- Preserve backend identity and checkout state keys from `backend-integration.spec.json`.
- Preserve tab-scoped runtime storage from `backend-integration.spec.json`: answers and runtime identity use `sessionStorage`; a new tab is a new visitor; start-funnel CTA clears the current tab session before the first OB question.
- Preserve API call semantics from `contracts/backend-api.contract.json`.
- Preserve page behavior semantics from `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.
- Preserve funnel lifecycle semantics from `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json`; every page must keep `phase` and `role`, and milestone pages must keep `milestone`, `commitPhase`, and `historyPolicy`.
- Preserve the OB progress model from `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`: numbered progress counts only onboarding data-collection question/input pages before result/paywall. Do not derive the x/y count from total pages, `order`, or `pages.length`.
- Preserve implementation order from the relevant recipe in `recipes/*.md` instead of duplicating endpoint-specific logic in config.
- Preserve answer persistence settings from `backend-integration.spec.json`, including first-answer blocking Firestore persistence and later non-blocking Firestore persistence.
- Preserve Firestore answer document persistence settings from `backend-integration.spec.json`: collection `test` by default, document id `uid`, and flat user-answer-only fields keyed by page `dataKey`.
- Export design prompt and developer brief.
- Keep output deterministic and schema-aligned.

## Boundaries

- Do not rewrite strategy.
- Do not redesign UI.
- Do not implement the app.
- Do not modify upstream agent outputs.

## Completion Checklist

- `funnel.config.json` is valid JSON.
- Every page has page type, copy, purpose, and navigation behavior that can be resolved from `navigation-behavior.spec.json`.
- Page-level overrides and measurement metadata are included when present.
- Page-level `visualDecision` metadata is included for every page.
- Generated assets match page `visualDecision` and no image asset is attached to a `visualRole: "none"` page unless the page explicitly contains an approved structural asset reuse.
- Section/progress metadata is included for onboarding question/input pages, and non-OB pages explicitly opt out of numbered progress.
- Required page and option images are included as local asset references.
- Height/weight pages with multiple units preserve `measurementType`, `units`, and `defaultUnit` so React can recalculate values during unit switching.
- Height/weight pages must include a valid `defaultValue` object, such as `{ "cm": 165 }` for height and `{ "kg": 70 }` or a product/audience-specific value for weight. Target weight should use a sensible lower/higher default based on product goals when possible.
- Height/weight pages should preserve or set `variant: "unit_switching_numeric_input"` and must not request BMI or personalization explanation cards as part of the measurement UI.
- Config can be used by a renderer without reading Markdown.
- Config contains enough lifecycle metadata for React to enforce a generic funnel state machine rather than one-off navigation rules.
- Paywall config can later swap mock `plans` for `resolve/offers` API results without changing the renderer contract.
- Paywall config treats billing API hydration as the standard path; mock plans are fallback data.
- Paywall config contains every section React must visibly render, not just hidden metadata.
- Config contains enough backend metadata for React to follow the current path: anonymous uid, OB answers, offer loading, Stripe checkout, subscription verification, register-from-anonymous account creation, and account continuation.
- Config contains enough backend metadata for React to persist OB answers locally first and then to Firestore when identity is ready.
- Config declares anonymous identity creation as first-answer triggered, not app-boot or entry/start triggered.
- Account creation config supports backend email/password registration through `POST /users/register-from-anonymous`.
- Login config supports backend email/password login through `POST /users/login`, then account/subscription loading.
- Subscription management config supports the current subscription summary and cancellation through backend endpoints.
- Stripe secret keys and webhook secrets are never written into frontend config.
