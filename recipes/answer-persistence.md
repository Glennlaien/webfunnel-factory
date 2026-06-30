# Answer Persistence Recipe

Generated funnels are local-first and backend-capable.

## Local First

1. Store each answer in React state by page `dataKey`.
2. Persist the answer object to `sessionStorage` only.
3. Onboarding navigation must never wait for non-critical event persistence.

## Identity Trigger

Do not create anonymous identity on app boot, entry page view, or the start CTA.
Create or restore anonymous identity only after the user submits the first real OB answer/input.
After identity is ready, later answer persistence uses the same tab-scoped `uid/idToken`.

The first real OB answer/input is a session-creation boundary, not ordinary telemetry.
For that first submission:

1. Save the answer to React state and `sessionStorage`.
2. Disable the selected option or CTA and show a short loading state.
3. Create anonymous identity.
4. Exchange the backend `customToken` through Firebase Auth.
5. Write the first answer to Firestore.
6. Navigate to the next page only after those steps succeed.

If this first blocking submission fails, keep the user on the same page with a retryable error.
After identity exists, later answer persistence may be non-blocking unless the page itself requires a CTA submit.

## Remote Events

After identity is ready, send:

`POST /billing/{appCode}/v1/events`

For each answer:

```json
{
  "uid": "firebase_uid",
  "eventType": "answer_saved",
  "eventKey": "pageId:dataKey:timestamp",
  "destinations": ["runtime"],
  "payload": {
    "pageId": "focus_areas",
    "dataKey": "focusAreas",
    "answer": ["balance"],
    "sectionId": "goals",
    "sectionLabel": "Goals",
    "pageType": "multi_choice_page",
    "timestamp": "iso_timestamp"
  }
}
```

Before plan ready or paywall, send an `answers_snapshot` event containing answers and safe context.

Do not include `idToken`, Stripe client secrets, or passwords in event payloads.

## Firestore Answer Document

Also write each answer/snapshot to Cloud Firestore after the tab-scoped identity is ready.

Default collection: `test`

Allow override through:

```text
VITE_FIRESTORE_FUNNEL_COLLECTION
```

Use one document per `uid`:

```text
test/{uid}
```

Document fields:

```json
{
  "ageGroup": "25_34",
  "primaryGoal": "lose_weight",
  "focusAreas": ["belly", "legs"],
  "height": { "cm": 165, "unit": "cm" },
  "currentWeight": { "kg": 70, "unit": "kg" },
  "email": "user@example.com"
}
```

The Firestore document contains user answer data only, flattened at the document root by page `dataKey`.
Do not write wrapper or metadata fields such as `project`, `uid`, `data`, `updatedAt`, `appCode`, `placementCode`, `eventType`, `dataKey`, `value`, or `sessionStorageKey`.

Firestore write failures after the first session-creation answer must not block OB navigation. Keep the sessionStorage copy as the immediate source of truth.
