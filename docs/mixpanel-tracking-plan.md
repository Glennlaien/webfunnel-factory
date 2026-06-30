# Mixpanel Tracking Plan

## Provider

- Provider: Mixpanel
- Runtime env: `VITE_MIXPANEL_TOKEN`, `VITE_MIXPANEL_DEBUG`, `VITE_APP_ENV`
- Current project token is configured in the generated React app env.

## Global Properties

Only attach the following global properties:

- `uid`
- `page_id`
- `section`
- `source`
- `env`

Do not attach `app_code`, `product`, `funnel_id`, `session_id`, `step_total`, or `step_index` as global properties.

## Events

- `OB Started`
- `OB Step Viewed`
- `OB Answer Submitted`
- `OB Step Back`
- `Identity Created`
- `Email Submitted`
- `Summary Viewed`
- `Plan Generation Started`
- `Plan Generation Completed`
- `Plan Ready Viewed`
- `Paywall Viewed`
- `Offer Selected`
- `Checkout Started`
- `Checkout Failed`
- `Purchase Completed`
- `Account Created`
- `Login Succeeded`
- `Subscription Viewed`
- `Cancel Subscription Clicked`

## Event Rules

- Use `OB`, not `Funnel`, in event names.
- Do not send `Funnel Validation Failed`.
- Do not send raw email. Use `email_domain` for email capture events.
- Send answer values only when they are simple scalar values. For multi-select answers, send `answer_count`.
- Identify the Mixpanel user after Firebase anonymous identity creation, login, or account creation.
- Reset Mixpanel identity when the user starts a new plan from the entry page.
