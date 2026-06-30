# Firebase Custom Token Auth Recipe

Generated React apps use Firebase Web SDK only to exchange backend-issued custom tokens.

## Anonymous Identity

Do not create anonymous identity on app boot, entry page view, or the start-funnel CTA.
The trigger is the first real OB answer/input submission.

1. The user submits the first real OB answer/input.
2. Save the answer locally first.
3. Call:
   `POST /billing/{appCode}/v1/users/anonymous`.
4. Receive:
   `uid`, `customToken`, `tokenType`, `appCode`, `status`.
5. Call:
   `signInWithCustomToken(auth, customToken)`.
6. Call:
   `credential.user.getIdToken()`.
7. Store `uid`, `customToken`, `idToken`, `appCode`, and `status` in `sessionStorage` for the current tab.
8. Use `Authorization: Bearer <idToken>` for authenticated Billing API calls.

`customToken` is never a Billing API bearer token.

Use Firebase Auth `browserSessionPersistence` before `signInWithCustomToken`.
A new browser tab is a new visitor session. Do not recover runtime identity from `localStorage`.
The entry Get started action clears the current tab session before the first OB question; returning users use Login.
Payment success, account creation, account, subscription management, and cancellation pages require an existing session identity and must not create anonymous identity.

## Email Register And Login

`POST /users/register` and `POST /users/login` return the same custom-token shape.
Resolve them through the same Firebase Web SDK flow before making authenticated calls.

## Identity Merge

After post-purchase account creation:

1. Keep the anonymous uid.
2. Register email/password and resolve registered idToken.
3. Upsert `/users/current` with the registered token.
4. Call `/identity/merge` with:
   `uid = registered uid`, `id1 = anonymous uid`, `id2 = registered uid`, `destination = registered uid`.
