# Runtime Page Capabilities Matrix

This document defines the capability boundary for the Web2App React Runtime.

The current default runtime is the **Base Runtime Master**. Product runs should not rebuild these page behaviors from scratch. A product run generates config, copy, theme, image plans, and assets; the runtime executes them.

## Ownership Model

```text
Product URL / user requirements
  -> AI agents generate strategy, page map, copy, image plan, theme, and config
  -> React Runtime renders fixed page capabilities from config
  -> Backend Adapter performs identity, answer persistence, offer loading, checkout, subscription, and account calls
```

| Layer | Owns | Must Not Own |
| --- | --- | --- |
| React Runtime | Page behavior, validation, navigation behavior, calculations, unit conversion, answer persistence hooks, checkout flow, account flow | Product-specific copy, one-off page order, product-specific images |
| AI Agents | Product analysis, page sequence, questions, options, copy, data keys, image needs, theme direction | Payment/auth mechanics, BMI formulas, unit conversion, final renderer logic |
| UI Recipe | One global visual system for the whole OB/funnel: tokens, typography tone, radius scale, CTA style, card style, image treatment, desktop layout style | Per-page unrelated colors, per-page unrelated typography, behavior changes |
| Page Variant | A controlled component form inside the same global recipe, such as `plain_list`, `image_grid`, `hero_top`, `metric_report` | A separate visual identity for one page |
| Image Plan | Which raster assets are required, asset prompts, crop/scene/job, local file binding | Runtime behavior or API calls |
| Backend Adapter | Billing API, Firebase custom token exchange, Firestore persistence, Stripe embedded checkout, subscription/account calls | Copywriting, visual style, page ordering |

## UI Recipe Rule

UI Recipe is **global**, not page-by-page.

Good:

```json
{
  "globalRecipe": "hard_training",
  "tokens": {
    "primary": "#2D4D3D",
    "background": "#F4F1EC",
    "surface": "#FFFFFF",
    "buttonRadius": 16,
    "cardRadius": 18
  },
  "pageVariants": {
    "age_group": "image_grid",
    "single_choice_page": "plain_list",
    "multi_choice_page": "plain_list",
    "summary_page": "metric_report",
    "paywall_page": "long_checkout_landing"
  }
}
```

Bad:

```json
{
  "age_group": { "primary": "pink" },
  "summary_page": { "primary": "green" },
  "paywall_page": { "primary": "black" }
}
```

Page-level variation is allowed only as a **variant choice** under the same global visual system.

## Shared Runtime Behavior

All data-collection pages share these fixed behaviors:

- Save answers to `sessionStorage`.
- Treat each browser tab as a separate user session.
- Never create anonymous identity on app boot or entry page view.
- Create anonymous identity only after the first real OB answer/input if no identity exists.
- First answer identity creation is blocking: save locally, create identity, exchange Firebase custom token, write first answer, then navigate.
- Later answer persistence is local-first and remote-capable.
- Use stable `dataKey` fields from config.
- Persist Firestore answer data as flat user fields, not wrapped metadata.
- Use navigation behavior from `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.
- Use backend behavior from `runtime/react-funnel-runtime/adapters/backend-integration.spec.json`.

## Capability Matrix

### TopProgress / Navigation Shell

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Render back action, section label, segmented progress, and optional OB step count. Count only real OB question/input pages. Exclude entry, intro, summary, analysis, plan generation, plan ready, paywall, payment, account, login, subscription, and cancellation pages. |
| AI generated | `sectionId`, `sectionLabel`, `sectionOrder`, `progress` metadata, page class. |
| UI Recipe global | Header height, typography tone, progress segment style, icon treatment, colors, desktop top-bar behavior. |
| Page variant | None. Navigation shell must stay consistent across the funnel. |
| Image Plan | None. |
| Backend Adapter | None. |

### EntryPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | First portal screen. Start CTA clears current tab session and routes to the first OB question. Login routes to `login_page`. Does not show OB progress. Does not create anonymous identity. |
| AI generated | Product promise, hero headline, supporting line, CTA label, login label, first-question route intent. |
| UI Recipe global | Hero treatment, overlay strength, button style, brand mark treatment, desktop portal width. |
| Page variant | Full-bleed hero, dominant contained hero, or split-light portal if later supported. |
| Image Plan | Required `entry_hero` raster asset. |
| Backend Adapter | Optional Firebase sign-out/session clear when starting a new funnel. |

### SingleChoicePage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Select exactly one value. Standard behavior auto-advances. First real answer can trigger anonymous identity creation. Save answer by `dataKey`. |
| AI generated | `title`, `subtitle`, `dataKey`, `options[]`, option labels/values, section metadata, conversion purpose, personalization use. |
| UI Recipe global | Option card tone, selected state, typography, spacing, background, motion between pages. |
| Page variant | `plain_list`, `image_grid`, or `icon_list`. Default should be `plain_list`. `icon_list` is optional only when icons are clearly semantic. |
| Image Plan | Only when variant is `image_grid`; create one option image per option. |
| Backend Adapter | Shared answer persistence. First-answer identity path may run here. |

### MultiChoicePage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Toggle multiple values. CTA required. Disable CTA until `minSelections` is met. Missing `minSelections` should be treated as `1`. Persist selected array. |
| AI generated | `title`, `subtitle`, `dataKey`, `options[]`, `minSelections`, optional `maxSelections`, section metadata, conversion purpose. |
| UI Recipe global | Option row/card tone, selected state, checkbox/checkmark treatment, CTA style, spacing. |
| Page variant | `plain_list`, `image_grid`, or `icon_list`. Default should be `plain_list`; avoid decorative icons. |
| Image Plan | Only when variant is `image_grid` or a page-level visual is explicitly required by `visualDecision`. |
| Backend Adapter | Shared answer persistence. First-answer identity path may run here. |

### AgeGroupPage

Age group is rendered through `SingleChoicePage:image_grid`.

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Single-choice image grid. Auto-advance after selection. Store one age-group value. |
| AI generated | Audience-specific age bands, labels, values, order, and rationale. Age bands are not hardcoded globally. |
| UI Recipe global | Image-card shape, label band style, selected state, page typography, legal note treatment if present. |
| Page variant | Usually `image_grid`; count and ranges may vary by product audience, but four options remain the default ergonomic pattern. |
| Image Plan | Required age-group option images. Prompts should reflect age difference and product audience. |
| Backend Adapter | Shared answer persistence and possible first-answer identity creation. |

### AgeInputPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Large numeric age input. Visible default value. Range validation. Disable CTA if invalid. Save exact age. |
| AI generated | Title, helper card copy, default age suggestion by audience, `dataKey`. |
| UI Recipe global | Numeric typography scale, helper card style, CTA style, page spacing. |
| Page variant | Centered numeric input. Additional variants require runtime support first. |
| Image Plan | None. |
| Backend Adapter | Shared answer persistence. |

### IntroPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | No data collection. Continue to next page. Does not create identity. Can read existing answers for personalization. |
| AI generated | Title, body, CTA, answer references, trust purpose, paywall bridge role. Copy should be long enough to build trust but not feel like filler. |
| UI Recipe global | Hero/image treatment, text hierarchy, CTA placement, transition feel, page background. |
| Page variant | Hero top, copy-led, proof-led, or answer-feedback intro if supported. Variant must still use global recipe tokens. |
| Image Plan | Required when `visualDecision.visualRole` is `page_hero`; otherwise none. |
| Backend Adapter | None. |

### HeightInputPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Support `cm` and `ft/in`. Imperial uses two inputs. Unit switching converts immediately. Visible default value. Range validation. CTA disabled if empty/out of range. Save normalized height values. |
| AI generated | Title, optional helper card copy, default height suggestion by audience, `dataKey`, section metadata. |
| UI Recipe global | Unit switch style, numeric input typography, helper card style, CTA style. |
| Page variant | Unit-switching numeric input. Picker/ruler variants are not runtime default. |
| Image Plan | None. |
| Backend Adapter | Shared answer persistence. |

### CurrentWeightPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Support `kg/lb`. Unit switching converts immediately. Visible default value. Validate range. Calculate BMI when height exists. Show BMI status card when valid. Disable CTA if invalid. |
| AI generated | Title, subtitle, default current weight by audience, BMI/supportive card copy if configurable, `dataKey`. |
| UI Recipe global | Unit switch style, numeric typography, BMI card colors within global palette, CTA style. |
| Page variant | Current weight numeric input with optional BMI status card. |
| Image Plan | None. |
| Backend Adapter | Shared answer persistence; derived BMI fields may be persisted. |

### TargetWeightPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Support `kg/lb`. Convert units. Compare current and target weight. Calculate target BMI when height exists. Show supportive delta/target card. Disable CTA if invalid. |
| AI generated | Title, target default, delta-card copy for loss/gain/maintain cases, `dataKey`. |
| UI Recipe global | Delta card style, status color treatment, numeric typography, CTA style. |
| Page variant | Target weight numeric input with target insight card. |
| Image Plan | None. |
| Backend Adapter | Shared answer persistence; derived target fields may be persisted. |

### EmailCapturePage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Validate email. Disable CTA if invalid. Save answer. Persist to Firestore. Bind email to current identity when identity exists. |
| AI generated | Title and short privacy/reassurance copy. Keep the page simple: title, input, privacy reason. |
| UI Recipe global | Input style, privacy note typography, CTA style, spacing. |
| Page variant | Simple email form. More complex lead-capture variants require explicit runtime support. |
| Image Plan | None. |
| Backend Adapter | `POST /billing/{appCode}/v1/users/current` when binding current user/email. |

### SummaryPage / BodyMetricSummaryPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Read existing answers. Derive BMI/profile facts. Render BMI bar when height/current weight exist. Show goal/focus/activity/weight-change facts from answers. Show supportive insight card. |
| AI generated | Which facts to emphasize, labels, insight copy, field mapping from answers to user-friendly labels. |
| UI Recipe global | Metric card style, BMI bar style, profile fact layout, insight card tone. |
| Page variant | Metric report, body-profile report, compact summary. |
| Image Plan | Required result/body visual set when the page uses body result imagery. Assets may be reused by paywall comparison. |
| Backend Adapter | None directly; optional milestone/analytics only if configured. |

### AnalysisPage / PredictionChartPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Generate illustrative chart points from current and target data. Use a reasonable monthly change model when weight change is involved. Label projections as illustrative. |
| AI generated | Chart headline, interpretation copy, timeline label strategy, product-specific explanation. |
| UI Recipe global | Chart line style, point labels, card style, text hierarchy. |
| Page variant | Weight projection, habit trajectory, readiness analysis, or insight card if supported. |
| Image Plan | None; charts are runtime-rendered visuals, not raster assets. |
| Backend Adapter | None. |

### PlanGenerationPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Animate deterministic plan generation progress. Slow near final checkpoints when configured. Pause for required quick follow-up questions when present. Save follow-up answers. Complete and route forward. |
| AI generated | Status labels, 2-4 binary follow-up questions when useful, social proof/user feedback cards, product-specific generation framing. |
| UI Recipe global | Progress animation tone, overlay/follow-up card style, testimonial card style, motion speed range. |
| Page variant | Circular progress with feedback, minimal progress, proof-led generation. |
| Image Plan | None by default; use runtime animation/proof cards instead of generated images. |
| Backend Adapter | Shared answer persistence for follow-up answers; no payment/account calls. |

### PlanReadyPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Show plan-ready bridge before paywall. Render chart/preview from answers. CTA routes to paywall. Do not show OB question progress. |
| AI generated | Headline, short bridge copy, plan duration framing, goal/date copy. |
| UI Recipe global | Chart style, plan card style, CTA style, proof/preview emphasis. |
| Page variant | Chart-led ready page, result-card ready page, minimal ready bridge. |
| Image Plan | None by default; chart is runtime-rendered. |
| Backend Adapter | None. |

### PaywallPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Load offers by placement code. Render offer cards. Select one plan. Show legal/renewal text from offer data/config. Open full-screen embedded checkout route/modal. Do not fake payment success. Support first and second offer moments by backend `discountType` when available. |
| AI generated | Headline, benefits, highlights, FAQ, guarantee copy, testimonials, result framing, social proof copy. |
| UI Recipe global | Paywall module hierarchy, offer-card style, sticky countdown/CTA treatment, comparison module style, long-page spacing. |
| Page variant | Long checkout landing, result-comparison paywall, social-proof-heavy paywall. Must still follow `contracts/paywall.contract.json`. |
| Image Plan | Body/result comparison images when configured; App Store screenshots for companion-app carousel when available. |
| Backend Adapter | `GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={lpid}`, `POST /users/current`, `POST /checkout/stripe/embedded-session`. |

### CheckoutSurface

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Mount Stripe Embedded Checkout from backend `clientSecret`. Display as a full-screen checkout surface with close-to-paywall affordance. |
| AI generated | No product copy beyond optional title/close label. |
| UI Recipe global | Full-screen surface background, close button style, loading/error presentation. |
| Page variant | Full-screen only for current runtime. Avoid card-inside-card checkout. |
| Image Plan | None. |
| Backend Adapter | Uses `clientSecret` from checkout session endpoint. |

### PaymentSuccessPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Verify subscription/payment state after Stripe return. Commit paid milestone only after backend verification or accepted pending state. Route to account creation or account page. |
| AI generated | Confirmation copy and next-action copy. |
| UI Recipe global | Success state style, loading state, CTA style. |
| Page variant | Minimal verification/success page. |
| Image Plan | None. |
| Backend Adapter | `GET /billing/{appCode}/v1/subscriptions?uid={uid}`. |

### AccountCreatePage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Post-payment registration only. Validate email/password. Register from anonymous user. Exchange returned custom token. Preserve subscription/uid. Route to account page. No login CTA on this page. |
| AI generated | Short registration title, field labels, CTA label, concise reassurance copy. |
| UI Recipe global | Flat form style, input style, CTA style, error state. |
| Page variant | Simple registration form. |
| Image Plan | None. |
| Backend Adapter | `POST /billing/{appCode}/v1/users/register-from-anonymous`. |

### LoginPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Returning-user login from entry/account routes. Validate email/password. Login through backend. Exchange custom token. Store identity. Route to account page. Back returns to entry when entered from entry. |
| AI generated | Minimal login title, subtitle, field labels, error copy. |
| UI Recipe global | Flat form style, input style, CTA style, background. |
| Page variant | Simple login form. |
| Image Plan | None. |
| Backend Adapter | `POST /billing/{appCode}/v1/users/login`. |

### AccountPage / ProfilePage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Require authenticated identity. Load subscription summary. Show ID, email, subscription state, period end, plan/product when available. Provide cancellation/manage entry. |
| AI generated | Minimal labels and empty-state copy. |
| UI Recipe global | Flat account layout, row style, status treatment, CTA style. |
| Page variant | Simple profile/account center. |
| Image Plan | None. |
| Backend Adapter | `GET /billing/{appCode}/v1/subscriptions?uid={uid}`. |

### SubscriptionManagePage / CancelSubscriptionPage

| Area | Responsibility |
| --- | --- |
| Runtime fixed logic | Require identity. Display subscription details. Confirm cancellation. Call cancellation endpoint when supported. Refresh subscription state. |
| AI generated | Confirmation copy, cancellation reassurance, retention copy if used. |
| UI Recipe global | Warning/confirmation style, button hierarchy, account layout. |
| Page variant | Simple manage/cancel flow. |
| Image Plan | None. |
| Backend Adapter | `GET /subscriptions?uid={uid}` and `POST /subscriptions/cancel` when available in `inputs/api-reference.md`. |

## Config Generation Guidance

AI-generated `funnel.config.json` should contain decisions, not implementation:

- Page order and ids.
- `pageType` and `variant`.
- Copy and options.
- `dataKey` values.
- Section/progress metadata.
- Default values for inputs.
- Product-specific display content.
- Asset references generated by Image Plan.
- Backend integration configuration references, not duplicated endpoint logic.

It should not contain:

- Stripe secret keys.
- Firebase secret behavior.
- BMI formulas.
- Unit conversion formulas.
- One-off code instructions.
- Per-page unrelated visual systems.

## Runtime Implementation Priority

The Base Runtime Master should be judged by these core page groups:

1. Entry and navigation shell.
2. Single choice, multi choice, age group, exact age.
3. Intro and transition pages.
4. Height, current weight, target weight.
5. Email capture.
6. Summary and analysis.
7. Plan generation and plan ready.
8. Paywall and checkout.
9. Payment success, account create, login, account/profile, subscription management.

When adding new features, first decide whether the request is:

- A runtime behavior gap.
- A page variant gap.
- A global UI recipe gap.
- A product-run copy/config gap.
- An image-plan gap.
- A backend-adapter/API gap.

Only runtime behavior gaps should change runtime component logic.
