# Runtime Config Architecture

This project separates reusable runtime logic from app-specific funnel configuration.

## Layers

```text
React Runtime
  owns logic, validation, calculations, storage, navigation, auth, checkout, and subscription calls

App Config Package
  owns page order, copy, options, theme, visual variants, icons, and assets

normalizeRuntimeConfig()
  merges app config files into one runtime-readable page model
```

## Reusable Runtime

Runtime code should stay stable across apps.

Examples:

- `SingleChoicePage` saves one answer and auto-advances.
- `MultiChoicePage` toggles selected values and validates `minSelections`.
- `HeightInputPage` converts `cm` and `ft/in`.
- `WeightInputPage` converts `kg/lbs`, calculates BMI, and derives target-weight messaging.
- `PaywallPage` loads offers, creates Stripe embedded checkout, and mounts Stripe.
- `LoginPage`, `AccountCreatePage`, and `ProfilePage` own auth and subscription entry points.

Runtime code should not be edited just to change product copy, option labels, theme color, icons, or images.

## App Config Package

Each app should have a folder:

```text
apps/{app-slug}/
  funnel.config.json
  copy.json
  theme.json
  page-visual-map.json
  icon-map.json
  assets-manifest.json
```

`apps/template` is the copyable starter package.

## Config File Responsibilities

| File | Responsibility |
|---|---|
| `funnel.config.json` | Page order, page type, data keys, validation defaults, backend placement metadata |
| `copy.json` | Titles, subtitles, body copy, CTA labels, option labels |
| `theme.json` | Global colors, typography, surface colors, shape tokens |
| `page-visual-map.json` | Page-level visual decisions such as layout, image ratio, selected state, desktop behavior |
| `icon-map.json` | UI and option icon assignments |
| `assets-manifest.json` | Generated or placeholder raster assets bound to pages and options |

## Visual Decision Flow

Large images are not decided inside React Runtime. They are decided before implementation:

```text
Page Architect
  writes pages[].visualDecision

Image Planner
  converts visualDecision into image-plan slots

Image Asset Generator
  creates or sources raster files

Config Builder
  attaches assets to pages/options

React Runtime
  renders the configured visual variant and local asset
```

`visualDecision` is function-based rather than page-name-based. A page receives a large image only when it helps with recognition, option difference, result imagination, trust building, concept explanation, emotional reinforcement, or proof. Simple numeric, email, login, account, legal, checkout, chart, and animation pages default to no large image.

## Merge Contract

Components should read the normalized page object, not individual config files.

```text
funnel.config.json
copy.json
theme.json
page-visual-map.json
icon-map.json
assets-manifest.json
        ↓
normalizeRuntimeConfig()
        ↓
templateConfig.pages[]
        ↓
React components
```

The normalized page object may include:

- `title`
- `subtitle`
- `body`
- `cta`
- `options`
- `visual`
- `visualDecision`
- `theme`
- `asset`

## Reuse Workflow

To build a new app:

1. Copy `apps/template` to `apps/{new-app-slug}`.
2. Replace product metadata, page copy, options, theme, visual map, icons, and assets.
3. Generate the runtime app from that config package.
4. Only add runtime code when a genuinely new page capability is needed.
