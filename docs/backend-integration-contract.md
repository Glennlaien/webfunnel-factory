# Backend Integration Contract

This document is the canonical backend/runtime contract for generated Web2App funnels.
It preserves the original Vue funnel's user path while adapting it to the current billing API in `inputs/api-reference.md`.

## Source Reference

Original project previously reviewed:

- `/Users/apple/Documents/oog104-wallpilates-vue`

Important legacy areas:

- Firebase anonymous identity was created before meaningful persistence.
- OB answers were stored in runtime state and `sessionStorage`.
- `uid` connected OB answers, paywall context, Stripe checkout, payment success, and account creation.
- Paywall restored profile context, loaded product/payment data, created Stripe checkout through backend, and verified subscription after return.
- Account creation linked or transferred the anonymous user's subscription to the final account.

Current API source:

- `inputs/api-reference.md`

## Canonical Runtime Path

```text
Open funnel
-> record attribution when available
-> collect OB answers by page dataKey
-> persist answers locally
-> after the first real OB answer/input, restore or create anonymous backend identity
-> keep uid + idToken in local runtime storage
-> persist answers to Firestore when identity is ready
-> refresh Firestore answer snapshot before plan ready or paywall
-> reach summary / analysis / plan generation / plan ready
-> open paywall with uid and answers available
-> load paywall offers from resolve/offers by placementCode/lpid
-> normalize returned products/prices into renderer plan shape
-> user selects a plan
-> ensure current user exists through backend
-> create Stripe Embedded Checkout session
-> mount Stripe Embedded Checkout with clientSecret
-> Stripe returns to success route with session_id
-> verify payment, subscription, and entitlement through backend
-> show payment success
-> collect account email/name/password when required
-> create registered email account through backend
-> merge anonymous identity into registered identity
-> route to account page
-> load current subscription summary
-> show subscription management data; enable cancellation only when the API reference exposes a frontend cancel endpoint
-> send attribution or lifecycle email only when configured
-> continue to app download or post-purchase handoff
```

## Identity Rules

- Integrate Firebase Web SDK in generated React apps for auth token exchange.
- Do not create anonymous identity on app boot, entry page view, or start-funnel CTA.
- Create anonymous identity through `POST /billing/{appCode}/v1/users/anonymous` only after the user submits the first real OB answer/input.
- Store returned `uid`, `customToken`, `appCode`, and `status`, then call `signInWithCustomToken(customToken)` and `currentUser.getIdToken()` to obtain the Billing API `idToken`.
- Store the resolved `uid`, `customToken`, `idToken`, `appCode`, and `status` in runtime state and session storage.
- Send `Authorization: Bearer <idToken>` on every authenticated backend call.
- Never use `customToken` directly as the Billing API bearer token.
- The request `uid` must match the Firebase ID token uid.
- If a URL contains `uid`, `session_id`, or payment order data, the runtime may use it to restore context, but it must still have a valid `idToken` before authenticated calls.
- Identity creation must happen before the first remote answer/event call and before checkout, but not before the first real user answer.

## State Storage Rules

Generated React should keep these runtime fields stable:

```json
{
  "identity": {
    "uid": "",
    "customToken": "",
    "idToken": "",
    "appCode": "",
    "status": "ACTIVE"
  },
  "answers": {},
  "answerQueue": [],
  "attribution": {},
  "selectedPlan": {
    "productId": "",
    "priceId": "",
    "discountType": ""
  },
  "checkout": {
    "paymentOrderId": "",
    "sessionId": "",
    "clientSecret": ""
  },
  "subscription": {
    "subscribed": false,
    "status": "NONE",
    "displayStatus": "NONE",
    "plan": null,
    "billing": null,
    "management": null
  }
}
```

Local storage keys are defined by `runtime/react-funnel-runtime/adapters/backend-integration.spec.json`.

## Answer Persistence Rules

The generated React app should be local-first:

- Save every answer immediately in runtime state and `sessionStorage`.
- After anonymous identity is ready, persist answers to Cloud Firestore with Firebase Web SDK.
- Use collection `VITE_FIRESTORE_FUNNEL_COLLECTION || "test"` and document id `uid`.
- Write the flattened answer object directly to the document root with `setDoc(doc(firestoreDb, firestoreCollection, identity.uid), answers, { merge: true })`.
- The first answer Firestore write is blocking before navigation; if it fails, stay on the same page with a retryable error.
- Later Firestore persistence failures should not block onboarding.
- Never put `idToken`, Stripe client secrets, or passwords inside answer payloads.

This keeps the browser experience resilient while still associating answers with the Firebase-backed `uid` created by the backend.

## Required Environment Variables

```text
VITE_BILLING_API_BASE_URL
VITE_BILLING_APP_CODE
VITE_STRIPE_PUBLISHABLE_KEY
```

Forbidden in frontend:

```text
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
FIREBASE_ADMIN_*
```

## Endpoint Contract

All paths are relative to `VITE_BILLING_API_BASE_URL`.

### Anonymous Identity

```http
POST /billing/{appCode}/v1/users/anonymous
```

No request body and no auth header.

Expected data:

```json
{
  "uid": "firebase_uid",
  "customToken": "firebase_custom_token",
  "tokenType": "CUSTOM_TOKEN",
  "appCode": "oog126_dev",
  "status": "ACTIVE"
}
```

Frontend exchange:

```ts
const credential = await signInWithCustomToken(auth, customToken);
const idToken = await credential.user.getIdToken();
```

### Current User Upsert

```http
POST /billing/{appCode}/v1/users/current
Authorization: Bearer <idToken>
```

Body:

```json
{
  "uid": "firebase_uid",
  "firebaseUid": "firebase_uid",
  "email": "buyer@example.com"
}
```

### Anonymous User Upgrade To Email Account

```http
POST /billing/{appCode}/v1/users/register-from-anonymous
```

Requires Authorization: Bearer <anonymous Firebase ID token>.

Body:

```json
{
  "uid": "anonymous_firebase_uid",
  "email": "buyer@example.com",
  "password": "user_password"
}
```

Expected data keeps the same anonymous uid and returns a refreshed custom token:

```json
{
  "uid": "anonymous_firebase_uid",
  "customToken": "firebase_custom_token",
  "tokenType": "CUSTOM_TOKEN",
  "appCode": "oog126_dev",
  "status": "ACTIVE"
}
```

Use this on `account_create_page` after payment or plan unlock. The endpoint upgrades the existing anonymous uid into an email account, so the subscription remains attached to the same uid. After registration, exchange the returned customToken through Firebase Web SDK and call `users/current` with uid/firebaseUid/email.

### Email Login

```http
POST /billing/{appCode}/v1/users/login
```

Use for returning users. The entry portal login action should route to `login_page`; successful login receives `uid/customToken`, exchanges it through Firebase Web SDK for `idToken`, stores the resolved identity, then routes to `account_page`.

## Account And Subscription Management

Generated funnels should include a member account path when billing integration is enabled:

```text
entry_page login action
-> login_page
-> account_page
-> subscription_manage_page
-> cancel_subscription_page
```

Post-purchase path:

```text
payment_success_page
-> account_create_page
-> account_page
```

`account_page` should load the current subscription summary:

```http
GET /billing/{appCode}/v1/subscriptions?uid={uid}
```

All require:

```http
Authorization: Bearer <idToken>
```

Cancellation must use only the frontend cancellation endpoint exposed by `inputs/api-reference.md`. The current runtime endpoint is `POST /billing/{appCode}/v1/subscriptions/cancel`; after cancellation, refresh `GET /billing/{appCode}/v1/subscriptions?uid={uid}`.

### Attribution

```http
POST /billing/{appCode}/v1/attribution
Authorization: Bearer <idToken>
```

Body should include `uid`, `providerCode`, `sourceType`, `sourceId`, `attributionKey`, and `attribution` when available.

### Product Loading

```http
GET /billing/{appCode}/v1/paywalls/resolve/offers?placementCode={placementCode}
```

This is the only ordinary frontend product-loading endpoint in `inputs/api-reference.md`.

Product loading does not require auth. React should read `lpid` from the URL query first, fall back to explicit run config `placementCode`, and normalize returned `data.products[].prices[]` into the paywall renderer's plan shape.

Do not call `/products` or `/paywalls/{paywallCode}/*` for ordinary frontend paywall display unless a later backend contract explicitly reintroduces those endpoints.

### Stripe Embedded Checkout

```http
POST /billing/{appCode}/v1/checkout/stripe/embedded-session
Authorization: Bearer <idToken>
```

Body:

```json
{
  "uid": "firebase_uid",
  "email": "buyer@example.com",
  "priceId": "backend_price_id",
  "returnUrl": "https://example.com/?page=payment_success&session_id={CHECKOUT_SESSION_ID}",
  "idempotencyKey": "stable_key",
  "visitor": false
}
```

Expected data:

```json
{
  "paymentOrderId": 1,
  "sessionId": "cs_test_xxx",
  "clientSecret": "cs_secret_test_xxx"
}
```

React should mount Stripe Embedded Checkout with the returned `clientSecret`.

### Payment And Subscription Verification

Preferred checks after Stripe return:

```http
GET /billing/{appCode}/v1/subscriptions?uid={uid}
```

All require `Authorization: Bearer <idToken>`.

The payment success page should retry subscription summary verification for a short bounded period because webhook processing can lag behind the browser return. Do not require `payments/by-provider-session` unless `inputs/api-reference.md` exposes it again.

### Anonymous Account Upgrade

The current API upgrades the anonymous Firebase uid in place through
`POST /billing/{appCode}/v1/users/register-from-anonymous`.

Do not call a separate identity merge endpoint for the normal Web2App registration path. The registered account keeps the same uid that was used for anonymous checkout, so subscription ownership remains attached to the existing user id.

Use after account creation when the generated funnel has both anonymous and registered identities.

Account-create sequence:

```text
anonymous uid/customToken exists
-> Firebase signInWithCustomToken resolves idToken
-> POST /users/register-from-anonymous with uid/email/password
-> receive same uid/customToken
-> Firebase signInWithCustomToken resolves refreshed idToken
-> POST /users/current with uid/firebaseUid/email
-> replace local identity with upgraded account identity
```

### Email

Optional lifecycle emails:

```http
POST /billing/{appCode}/v1/emails/template
POST /billing/{appCode}/v1/emails
```

Both require auth and should be called only when product requirements request explicit email behavior.

## Normalized Paywall Plan Shape

Generated config may start with mock plans, but the renderer must be able to replace them with API products without changing component structure.

```json
{
  "id": "plan_4w",
  "productId": "prod_4w",
  "priceId": "backend_price_id",
  "label": "4-Week Plan",
  "durationLabel": "Most popular",
  "originalPrice": "$39.99",
  "price": "$9.99",
  "dailyPrice": "$0.36/day",
  "currency": "USD",
  "billingPeriod": "renews every 4 weeks",
  "badge": "MOST POPULAR",
  "discountType": "DISCOUNT",
  "isDefault": true
}
```

## Runtime State Machine

```text
boot
-> identity_restoring
-> anonymous_creating
-> anonymous_ready
-> attribution_ready
-> ob_collecting
-> ob_event_sending
-> plan_ready
-> paywall_loading_products
-> paywall_ready
-> user_upserting
-> checkout_creating
-> checkout_mounting
-> checkout_ready
-> payment_returned
-> payment_verifying
-> subscription_active
-> account_collecting
-> identity_merging
-> account_ready
```

## Fallback Rules

- Product API failure may fall back to API-ready mock plans with visible API status in development.
- Identity or checkout API failure must block real checkout and show a recoverable error.
- Do not silently fake successful payment when backend endpoints are configured.
- Mock purchase behavior is allowed only when the run explicitly declares mock mode or no backend API reference is provided.

## Validation Expectations

QA should verify:

- Firebase Web SDK dependency is present and used only to exchange backend customToken for Firebase ID token.
- No Stripe secret keys in frontend.
- `POST /users/anonymous` is used before authenticated calls.
- Product loading can hydrate paywall plans.
- Checkout uses backend-created Stripe Embedded Checkout `clientSecret`.
- Payment success verifies the current subscription summary before claiming access.
- Account creation path preserves anonymous `uid` through register-from-anonymous; no separate identity merge call is required.
- Account creation uses `POST /users/register-from-anonymous` when email/password registration is requested.
