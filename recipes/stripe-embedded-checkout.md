# Stripe Embedded Checkout Recipe

Use this recipe when the generated funnel uses Stripe Embedded Checkout.

## Standard Flow

1. Require the tab-scoped anonymous or registered identity created earlier in OB. Direct paywall access without identity should route to login or entry rather than silently creating a new anonymous user.
2. Exchange backend `customToken` through Firebase Web SDK.
3. Use Firebase `idToken` as `Authorization: Bearer <idToken>`.
4. Upsert the current user:
   `POST /billing/{appCode}/v1/users/current`.
5. Send answer snapshot through runtime events before checkout as non-critical telemetry. It must not block checkout session creation; if it fails, queue it locally and continue.
6. Create embedded checkout:
   `POST /billing/{appCode}/v1/checkout/stripe/embedded-session`.
7. Request body:
   ```json
   {
     "uid": "firebase_uid",
     "email": "buyer@example.com",
     "priceId": "billing_price_id",
     "returnUrl": "https://front-end/?page=payment_success&session_id={CHECKOUT_SESSION_ID}",
     "idempotencyKey": "stable_key",
     "visitor": false
   }
   ```
8. `visitor` is a boolean only.
9. Do not put answers, attribution, or profile objects inside `visitor`.
10. Mount Stripe Embedded Checkout with `stripe.initEmbeddedCheckout({ clientSecret })`.

## Checkout CTA Boundary

`POST /users/current` is a prerequisite user upsert, not the checkout action. The paywall CTA must continue to `POST /checkout/stripe/embedded-session` after identity/upsert succeeds. Non-payment calls such as `events`, `answers_snapshot`, or attribution must never prevent the embedded-session call.

## Payment Success

After Stripe returns, verify backend state before account creation:

- `GET /subscriptions/status?uid={uid}`
- `GET /subscriptions?uid={uid}`
- `GET /entitlements?uid={uid}`

Use bounded retry because webhook processing can lag. Do not require a provider-session payment lookup unless `inputs/api-reference.md` exposes that endpoint again.
