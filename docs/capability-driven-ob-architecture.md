# Capability-Driven OB Architecture

This workflow uses a fixed runtime trunk plus product-specific capability planning.

## Goal

Avoid two extremes:

- Hard product-category templates that make every funnel feel the same.
- Fully free question generation that breaks summary, paywall, analytics, and data storage.

The stable unit is now the capability, not the exact question text.

## Flow

```text
Product input
→ product profile
→ capability plan
→ product-specific pages
→ field contract
→ validators
→ image plan
→ React Runtime
```

## Fixed Runtime Trunk

These pages remain fixed because they own reusable product logic:

```text
entry
age_group
exact_age
height
current_weight
target_weight
email
summary
plan_generation
plan_ready
paywall
payment_success
account_create
login
profile
```

Their content can still vary by product, but their page type and core behavior are runtime-owned.

## Capability Plan

Generated at:

```text
outputs/capabilities/capability-plan.json
outputs/capabilities/capability-plan.md
```

Each capability explains:

- what information it collects
- why it exists
- which downstream screens need it
- which page type should render it
- which stable `dataKey` it binds to, if any

Example:

```json
{
  "id": "training_readiness",
  "pageType": "single_choice_page",
  "dataKey": "capabilityLevel",
  "requiredFor": ["plan_difficulty", "plan_generation", "risk_reduction"]
}
```

## Product-Specific Pages

Pages generated from the capability plan carry:

```text
source: capability_planner
capability
requiredFor
contractUse
```

The question wording, options, order, and image decisions can vary by product. The underlying capability and data contract stay stable.

## Field Contract

Generated at:

```text
outputs/contracts/field-contract.json
outputs/contracts/field-contract.md
```

The field contract tells the runtime and future agents:

- which page writes each `dataKey`
- what value shape it stores
- whether it is used by summary, plan generation, paywall, Firestore, or analytics
- what validation rules apply

## Validation

`scripts/validators/capabilities.mjs` checks:

- capability plan exists
- capability pages reference known capabilities
- capability data keys exist in the field contract
- required downstream uses are covered
- field contract entries declare value shape and usage

This is the guardrail that lets agents generate product-specific questions without making the workflow random.
