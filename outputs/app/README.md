# Web2App React Runtime Code Package

This is the reusable React runtime code package for generated Web2App funnels.

This package is not a product-specific funnel. Product runs should replace only generated config, copy, theme, assets, and design handoff while keeping runtime logic stable.

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

Generation:

```bash
node scripts/create-react-runtime-template.mjs
```

The generator copies this package into `outputs/app`, then injects `src/runtime/templateConfig.ts`, `index.html`, `src/styles.css` theme variables, and `public/assets/images`.
