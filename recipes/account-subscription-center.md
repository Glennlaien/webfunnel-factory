# Account And Subscription Center Recipe

Generated funnels with billing integration include a returning-user path and post-purchase account path.

## Routes

Entry page login:

```text
entry_page -> login_page -> account_page
```

Post-purchase:

```text
payment_success_page -> account_create_page -> account_page
```

Management:

```text
account_page -> subscription_manage_page -> cancel_subscription_page
```

## Account Data

Load these with `Authorization: Bearer <idToken>`:

- `GET /billing/{appCode}/v1/subscriptions/status?uid={uid}`
- `GET /billing/{appCode}/v1/subscriptions?uid={uid}`
- `GET /billing/{appCode}/v1/entitlements?uid={uid}`

## Cancellation

Call:

`POST /billing/{appCode}/v1/subscriptions/{providerSubscriptionId}/cancel`

Body:

```json
{
  "providerCode": "stripe",
  "cancelAtPeriodEnd": true,
  "reason": "user requested"
}
```

Show loading, backend-confirmed success, error, and retry states.
