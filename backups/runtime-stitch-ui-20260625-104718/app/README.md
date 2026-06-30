# Web2App React Runtime Template

This is the reusable React runtime code package generated from `docs/runtime-page-capabilities.md`.

This template is not a product-specific funnel. Product runs should replace config, copy, theme, assets, and design handoff while keeping runtime logic stable.

First milestone implemented:

- TopProgress
- SingleChoicePage
- MultiChoicePage
- ChoiceOptions with image_grid, plain_list, and icon_list variants
- IntroPage
- AgeInputPage
- HeightInputPage
- WeightInputPage for current and target weight
- EmailInputPage
- Shared sessionStorage answer store
- Firebase custom token exchange
- Firestore flat answer persistence
- Billing API adapter
- Stripe Embedded Checkout adapter placeholder through PaywallPage

Run:

```bash
npm install
npm run dev -- --port 5192
```
