# 07 Runtime Assembler Subagent

## Mission

Assemble a mobile-first React Web2App funnel from the fixed React Funnel Runtime and the generated product config.

Do not invent a new frontend architecture for each product. Use `runtime/react-funnel-runtime/` as the source of truth for renderer registry, contracts, unit conversion, and runtime behavior.

## Inputs

- `outputs/config/funnel.config.json`
- `outputs/design/theme.json`
- `outputs/design/art-direction.json`
- `outputs/design/screen-blueprints.json`
- `outputs/assets/asset-manifest.json`
- `outputs/design-handoff/page-type-template-map.json`
- `outputs/design-handoff/design-handoff.json`
- `outputs/design-handoff/implementation-notes.md`
- `runtime/react-funnel-runtime/runtime.config.json`
- `runtime/react-funnel-runtime/renderer-registry.json`
- `runtime/react-funnel-runtime/contracts/*.json`
- `runtime/react-funnel-runtime/adapters/*.json`
- `contracts/*.json`
- `recipes/*.md`
- `global-rules/ob-conversion-rules.json`
- `global-rules/paywall-rules.json`
- `contracts/backend-api.contract.json`
- `docs/backend-integration-contract.md`
- `inputs/api-reference.md`
- Required for final implementation: a real design handoff from Figma or a provider-neutral config prototype handoff with template ids and visual notes for key templates

## Outputs

Write or refresh the runtime app instance under:

- `outputs/app/package.json`
- `outputs/app/index.html`
- `outputs/app/vite.config.ts`
- `outputs/app/tsconfig.json`
- `outputs/app/src/**`

## Write Scope

Only write to `outputs/app/`.

## Technical Requirements

- Use React.
- Before final implementation, read `outputs/design-handoff/design-handoff.json`. If `source` is `figma`, consume real design handoff template mappings and design context. If `source` is `config`, consume generated runtime config, theme, page visual map, copy, local assets, and provider-neutral template mappings. If the design handoff is missing, fake, or required provider files are missing, stop and report that only a prototype can be generated. Do not claim design-to-code implementation.
- For each key renderer, consume real provider template mapping from `outputs/design-handoff/page-type-template-map.json`.
- Use the selected source reference as implementation guidance: Figma screenshots/design context for Figma, or generated visual maps/assets for config prototype runs.
- If a provider template is missing for a page type/variant used by config, fail the final implementation step and report the missing mapping.
- Follow product-run contracts first: `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`, `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json`, `contracts/paywall.contract.json`, `contracts/backend-api.contract.json`, and `runtime/react-funnel-runtime/contracts/theme.contract.json`.
- Follow recipes for implementation sequence: `recipes/react-runtime-generation.md`, `recipes/paywall-product-loading.md`, `recipes/firebase-custom-token-auth.md`, `recipes/answer-persistence.md`, `recipes/stripe-embedded-checkout.md`, and `recipes/account-subscription-center.md`.
- Treat existing runtime components as the code package. Product runs should wire config, theme, assets, env examples, and design handoff into the runtime. Modify runtime component code only when the requested page capability is missing from `runtime/react-funnel-runtime/renderer-registry.json` or `docs/runtime-page-capabilities.md`.
- Mobile-first.
- PC compatible.
- On desktop, render a full-width Web2App funnel layout with a top brand/progress bar and centered content column. Do not render the app inside a phone mockup or mobile shell on desktop.
- Render from `funnel.config.json`; do not hard-code product pages as separate one-off screens.
- Implement the generic funnel state machine from `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json`. Persist `committedPhase`, but do not use it as a hard URL redirect guard.
- Do not solve irreversible-flow issues with page-specific bans or browser Back traps. Commit durable milestones such as `payment_verified` and `account_authenticated`, then let pages render the correct completed-session state and CTA availability.
- Public pages such as entry and login must remain reachable even after payment or account creation.
- If a paid/account user opens an old onboarding, result, paywall, or checkout URL, render a completed-session state with account/login and start-new-plan actions instead of active quiz or checkout controls.
- Use the theme tokens from `funnel.config.json` as the single source of truth for colors. Do not hard-code colors copied from reference screenshots; screenshot references are layout and interaction guidance unless the user explicitly says their palette should be reused.
- Use generated local assets from `outputs/assets/asset-manifest.json`.
- Copy or import required image files into `outputs/app` so the app works without transient external URLs.
- Respect asset scene metadata. Entry, age option, intro, summary, and paywall images must appear on the page/template they were planned for and support the page's `visualJob`; do not collapse all imagery into the same placeholder treatment. Plan Generation pages use runtime animation instead of large generated images.
- `outputs/app/index.html` must include `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`; without it, mobile browsers render a desktop layout and shrink the whole funnel.
- Use `pageType` and `variant` to select renderers.
- Follow `runtime/react-funnel-runtime/renderer-registry.json`.
- Follow `runtime/react-funnel-runtime/contracts/*.json`.
- Follow `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.
- Implement the segmented top progress indicator from page `progress`, `sectionId`, `sectionLabel`, and `sectionOrder`.
- Render numbered progress from `page.progress.step/page.progress.total` only when `page.progress.showStepCount` is true. Never compute OB progress from `page.order`, total funnel page count, or `pages.length`.
- Hide numbered progress on result, paywall, payment, login, account, subscription, and cancellation pages. Those pages are outside the OB question count even though they belong to the same funnel.
- Keep primary CTA dimensions consistent across page types. Paywall checkout CTAs should use the same mobile width behavior, height, radius, typography, and disabled/loading treatment as standard onboarding CTAs. Avoid double padding wrappers that make paywall CTAs narrower on mobile.
- Implement `entry_page` as a portal screen before quiz progress begins. It must render a large hero image, brand/product promise, start-funnel button that routes to the next page, and login button for returning users.
- Implement height and weight renderers for whichever page types appear in the config, including `measurement_picker_page`, `height_input_page`, and `weight_input_page` when present.
- Height and weight renderers must use segmented unit tabs plus large numeric inputs. Height uses one cm input or two ft/in inputs. Weight uses one lb/kg input. Do not use ruler sliders, wheel pickers, steppers as the primary control, BMI explanation cards, or personalization explanation cards under the input.
- Measurement renderers must normalize unit aliases, initialize with a visible selected default unit, render a valid default numeric value, and keep the CTA enabled when the initialized value is valid. If the user taps Continue without editing, save the initialized default value.
- When a height or weight page supports multiple units, unit switching must recalculate and update the current value immediately:
  - height: `cm`, `ft_in`
  - weight: `lb`, `kg`
- Implement choice variants through the shared runtime choice capability:
  - `image_grid`: large raster image cards
  - `plain_list`: text-only rows
  - `icon_list`: semantic Lucide icon rows
- Use `lucide-react` only for `icon_list`. Plain list and image grid options do not require icons.
- Implement `multi_choice_page` so the CTA is disabled until the selected count is at least `minSelections`. Treat missing `minSelections` as `1`. Only allow empty continue when the page explicitly has `allowEmptySelection: true`.
- Implement intro page imagery when an intro page has a mapped page hero or supporting image.
- Implement `paywall_page` as a checkout landing renderer from config data. It must support selectable mock plans, product-list API hydration, and Stripe Embedded Checkout through a backend-created `clientSecret`.
- `paywall_page` must visibly render every required paywall section from `contracts/paywall.contract.json`, not only store those sections in config. Required visible sections include personalized result preview, offer headline, promo/scarcity cue, plan cards, highlights, social proof/testimonials, FAQ, money-back guarantee, renewal disclosure, legal links, and embedded checkout mount area.
- Stripe is the standard payment provider. Read the publishable key from `VITE_STRIPE_PUBLISHABLE_KEY`. Do not embed Stripe secret keys or webhook secrets in frontend code.
- Read `VITE_BILLING_API_BASE_URL`, `VITE_BILLING_APP_CODE`, and `VITE_STRIPE_PUBLISHABLE_KEY` from environment variables.
- Do not create anonymous backend identity on app boot, entry page view, or the start-funnel CTA.
- Create or restore anonymous backend identity with `POST /billing/{appCode}/v1/users/anonymous` only after the user submits the first real OB answer/input. The endpoint returns `uid` and `customToken`; set Firebase Auth to `browserSessionPersistence`, use Firebase Web SDK `signInWithCustomToken(customToken)`, then `currentUser.getIdToken()` to obtain the `idToken` used by Billing API calls. Store `uid`, `customToken`, `idToken`, `appCode`, and `status` in `sessionStorage` for the current tab only.
- Treat the first real OB answer/input as a blocking session-creation submission. Save the answer locally, disable the selected option or CTA, show a loading state, create anonymous identity, exchange the Firebase custom token, write the first answer to Firestore, then navigate to the next page. If that fails, keep the user on the same page with a retryable error. Do not auto-advance before anonymous identity and first Firestore write complete.
- Store funnel answers, identity, selected plan, checkout state, subscription data, answer queue, and committedPhase in `sessionStorage` only. A new browser tab is a new visitor session. The entry Get started action must clear the current tab session and sign out Firebase Auth before routing to the first OB question; returning users use Login.
- Store OB answers in runtime state and session storage by `dataKey`; keep the same `uid` available to paywall, checkout, payment success, and account creation.
- After identity is ready, persist each answer/snapshot to Cloud Firestore with Firebase Web SDK. Use collection `VITE_FIRESTORE_FUNNEL_COLLECTION || "test"`, document id `uid`, and write the flattened `answers` object directly to the document root with `setDoc(..., answers, { merge: true })`. The Firestore document contains user answer data only, keyed by page `dataKey`. Do not write wrapper or metadata fields such as `project`, `uid`, `data`, `updatedAt`, `appCode`, `placementCode`, `eventType`, latest `dataKey`, latest `value`, or `sessionStorageKey`. The first answer Firestore write is blocking before navigation; later Firestore failures must not block OB navigation.
- Authenticated account, subscription, payment-success, account-create, and cancellation pages must wait until both `uid` and Firebase `idToken` are present. If identity is missing, route to login or entry before requesting protected data; do not silently create anonymous identity from those pages.
- On paywall mount, load frontend paywall offers only from `GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={lpid}`. Read `lpid` from the URL query first, then from explicit run config such as `placementCode`. Do not generate this value. Do not use `lpid` as `paywallCode`, and do not call `/products` or `/paywalls/{paywallCode}/*` for ordinary frontend paywall display. If the offer API is unavailable, show a visible API status and keep mock plans as fallback.
- Runtime fetch calls to the Billing API must use `credentials: "omit"` and must not rely on cookies. For ngrok-backed development endpoints, include `ngrok-skip-browser-warning: true` when the backend CORS allow-list supports that header.
- Before checkout, upsert the runtime user with `POST /billing/{appCode}/v1/users/current` using `Authorization: Bearer <idToken>`.
- Create checkout with `POST /billing/{appCode}/v1/checkout/stripe/embedded-session`, passing Billing `priceId` from `offers[].priceId` and `visitor` as a boolean only. Do not put answers or attribution inside `visitor`; answers are already persisted to Firestore by `uid`, and attribution should use its dedicated endpoint only when configured. Then mount Stripe Embedded Checkout using the returned `clientSecret`.
- Keep the Stripe integration boundary obvious: selected `priceId` -> create embedded checkout session endpoint -> `clientSecret` -> Stripe Embedded Checkout.
- The paywall primary CTA must never call generic navigation such as `next()` or route directly to `payment_success_page`. It must either create/mount Stripe checkout or show a recoverable checkout/API error.
- Do not implement fake payment success. `payment_success_page` is reachable only from Stripe return URL or an explicit verified backend success state.
- After Stripe returns with `session_id`, verify backend state with `GET /billing/{appCode}/v1/subscriptions?uid={uid}` before showing final access. Use bounded retry because webhook processing can lag.
- Account creation must use `POST /billing/{appCode}/v1/users/register-from-anonymous` for email/password signup after payment, receive `uid/customToken`, exchange it through Firebase Web SDK for `idToken`, then route to the account page. Do not call a separate `users/register` or `identity/merge` endpoint unless a later API reference explicitly reintroduces that flow.
- Implement `login_page` for returning users. The `entry_page` login action must route to `login_page`; successful login through `POST /billing/{appCode}/v1/users/login` receives `uid/customToken`, exchanges it for `idToken`, stores the resolved identity, upserts current user when needed, and routes to `account_page`.
- After account creation, route to `account_page`.
- Implement `account_page` to load and display the current subscription summary using `GET /billing/{appCode}/v1/subscriptions?uid={uid}`. Do not call `subscriptions/status` or `entitlements` for the standard profile screen unless a page explicitly needs entitlement gating.
- Implement `subscription_manage_page` and `cancel_subscription_page` only against the cancellation endpoint exposed by `inputs/api-reference.md`. The current runtime uses `POST /billing/{appCode}/v1/subscriptions/cancel` and then refreshes `GET /subscriptions`.
- If email registration returns an existing-user error, offer or implement `POST /billing/{appCode}/v1/users/login`.
- Runtime attribution and event calls should be implemented behind a backend adapter and must not block OB progress when non-critical telemetry fails.

## Backend Runtime Path

Follow `docs/backend-integration-contract.md` and `runtime/react-funnel-runtime/adapters/backend-integration.spec.json`:

```text
boot
-> render entry without anonymous identity creation
-> collect and locally persist OB answers
-> after first real OB answer/input, restore or create anonymous identity
-> persist answers/snapshots to Firestore through Firebase Web SDK
-> send attribution when configured
-> load paywall frontend offers by placementCode/lpid
-> upsert current user
-> create Stripe Embedded Checkout session
-> mount Stripe Embedded Checkout
-> return to payment success with session_id
-> verify payment/subscription/entitlement
-> email account registration
-> identity merge from anonymous uid to registered uid
-> account page with subscription status and cancellation management
-> app handoff
```

## Funnel State Machine

Follow `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json`:

```text
entry -> onboarding -> result -> paywall -> checkout -> paid -> account
```

Persist `committedPhase`. When a milestone commits a later phase, update state without trapping browser Back. Use page state and CTA behavior to prevent accidental continuation of old OB sessions.

## Renderer Requirements

At minimum, implement renderers for:

- Intro
- Entry portal
- Single choice image grid
- Single choice plain list
- Single choice icon list
- Multi choice image grid
- Multi choice plain list
- Multi choice icon list
- Measurement input / picker
- Text input / email / name
- Summary
- Analysis
- Plan generation
- Plan ready
- Paywall
- Payment success
- Account create
- Login
- Account overview
- Subscription management
- Cancel subscription

If the config starts with `entry_page`, render it as the portal and route the start CTA to the next configured page. Do not show quiz progress on the entry portal.

## Runtime Rule Sources

- Navigation defaults and allowed overrides: `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- OB conversion principles: `global-rules/ob-conversion-rules.json`
- OB progress behavior: `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- Unit conversion behavior: `runtime/react-funnel-runtime/adapters/unit-conversion.spec.json`
- Backend integration behavior: `runtime/react-funnel-runtime/adapters/backend-integration.spec.json`
- Product-run backend contract: `contracts/backend-api.contract.json`
- Funnel state machine: `runtime/react-funnel-runtime/adapters/funnel-state-machine.spec.json`
- Paywall contract: `contracts/paywall.contract.json`
- Navigation behavior: `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- Product-run implementation recipes: `recipes/*.md`
- Renderer selection: `runtime/react-funnel-runtime/renderer-registry.json`
- Theme contract: `runtime/react-funnel-runtime/contracts/theme.contract.json`
- Asset manifest contract: `runtime/react-funnel-runtime/contracts/asset-manifest.contract.json`

## Validation Requirements

- `npm install` works inside `outputs/app`.
- `npm run build` passes.
- App can progress from the first configured page to paywall.
- Multi choice pages cannot continue with zero selections unless `allowEmptySelection: true`.
- Choice pages support image_grid, plain_list, and icon_list. Only icon_list requires visible Lucide icons for each option.
- Paywall screenshot shows all required paywall sections, not a bare headline, bullets, and CTA.
- If backend env values are provided, app can create anonymous identity, load products, start Stripe Embedded Checkout, and route to payment success verification.
- Text must fit on mobile and desktop.
- Desktop screenshots must show the Web2App layout, not a centered phone frame.
- Do not silently fake successful payment when backend env values are configured. Mock purchase behavior is fallback-only.

## Boundaries

- Do not modify upstream files.
- Do not change page ids, data keys, option values, or page order.
- Do not ignore design handoff template mapping. For final implementation, missing provider mapping is a blocker. A design-system fallback may only be emitted as `prototype_from_config`, not as final design-to-code output.
- Do not modify `runtime/react-funnel-runtime/` during a product run unless the requested page type or interaction is unsupported by the existing runtime contract.
