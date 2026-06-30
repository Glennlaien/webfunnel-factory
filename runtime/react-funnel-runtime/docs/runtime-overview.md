# React Funnel Runtime

React Funnel Runtime is the fixed frontend engine for generated Web2App funnels.

It should not be regenerated from scratch for each product. Instead, each run provides:

- `outputs/config/funnel.config.json`
- `outputs/design/theme.json`
- `outputs/config/app-config/*.json`
- `outputs/design-handoff/page-type-template-map.json`
- optional assets

The runtime reads those files and renders the funnel using reusable page renderers.

## Responsibility Split

```text
funnel.config.json  -> what pages exist, in what order, with what copy/options
theme.json          -> product styling that follows global-rules/design-rules.json
Design templates    -> visual reference for each pageType/variant renderer
React Runtime       -> navigation, state, validation, unit conversion, rendering
```

## Renderer Selection

Runtime chooses components by:

```text
pageType + variant
```

Example:

```text
single_choice_page:image_grid -> SingleChoicePage
single_choice_page:plain_list -> SingleChoicePage
multi_choice_page:icon_list -> MultiChoicePage
height_input_page:unit_switching_numeric_input -> HeightInputPage
paywall_page -> PaywallPage
```

## Navigation Behavior

Canonical navigation behavior lives in:

```text
runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json
```

The runtime, Figma prompt, and React implementation should read that file instead of restating CTA or auto-advance rules.

## Product Differentiation

Different products should not require a new React app. They should change:

- theme tokens
- page copy
- options
- imagery/assets
- page variants
- design provider templates

When a genuinely new interaction appears, add a new renderer to the runtime registry.

## Design Provider Relationship

Figma or the provider-neutral design layer defines the visual standards for page type templates. Runtime implements those templates as reusable React components.

The design provider does not need to draw every page in a 30-40 page funnel.

## Current Rule Sources

- Company funnel rules: `global-rules/company-funnel-rules.json`
- Design rules: `global-rules/design-rules.json`
- Compliance rules: `global-rules/compliance-rules.json`
- Navigation behavior: `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- Unit conversion: `runtime/react-funnel-runtime/adapters/unit-conversion.spec.json`
