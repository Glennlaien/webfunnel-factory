# Funnel State Machine Recipe

Use this recipe when generating page maps, config, and React runtime code.

## Principle

Do not solve navigation bugs with symptom-level rules. Model the funnel as phases and milestones.

## Required Phases

```text
entry -> onboarding -> result -> paywall -> checkout -> paid -> account
```

Every page must declare:

- `phase`
- `role`

Milestone pages or events can declare:

- `milestone`
- `commitPhase`
- `historyPolicy`

## Runtime Behavior

1. Persist `committedPhase`, answers, runtime identity, selected plan, subscription data, entitlements, and queued answer events in `sessionStorage`.
2. Do not use `committedPhase` as a hard URL redirect guard. Users may intentionally return to public pages such as entry or login.
3. Use `committedPhase` to decide page state and CTA availability. If a paid/account user opens an old onboarding, result, paywall, or checkout URL, show a completed-session state with account/login and start-new-plan actions instead of active quiz or checkout CTAs.
4. When payment is verified, commit `paid`.
5. When account login or registration succeeds, commit `account`.
6. Use `history.replaceState` for explicit in-app transitions where duplicate history entries would be confusing, not as a browser Back trap.
7. Provide a deliberate `Start new plan` action that clears the current tab session, signs out Firebase Auth, resets committedPhase to entry, and routes to the first OB question.
8. Authenticated account, subscription, and entitlement requests must wait until both `uid` and Firebase `idToken` are available.
9. Treat a new browser tab as a new visitor session. Do not recover funnel identity from `localStorage`.
10. Protected post-payment/account pages require an existing tab-scoped identity. If identity is missing, route to login or entry instead of silently creating anonymous identity.

## Page Phase Defaults

- `entry_page`: `entry`
- question and input pages before paywall: `onboarding`
- summary, analysis, plan generation, plan ready: `result`
- `paywall_page`: `paywall`
- Stripe mount/checkout action: `checkout`
- `payment_success_page`: `paid`
- login, account create, account, subscription management, cancellation: `account`
