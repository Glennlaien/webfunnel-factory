# measurement_picker_page

Use for body measurement entry when the intended interaction is picker-style numeric selection.

This is one possible measurement UI pattern, not a mandatory page type for height or weight. Height and weight may also use input pages or other mobile-friendly numeric controls when that better fits the product.

Canonical uses:

- Height
- Current weight
- Target weight
- Waist or other body measurements

## Required Fields

- `id`
- `pageType`: `measurement_picker_page`
- `variant`
- `module`
- `conversionPurpose`
- `dataKey`
- `titleIntent`
- `measurementType`
- `units`
- `defaultUnit`

## Recommended Variants

```text
height_picker
weight_picker
generic_measurement_picker
```

## Height Requirements

Support:

```text
cm
ft_in
```

Design expectations:

- Unit segmented control
- Large picker or wheel interaction
- If `ft_in`, show feet and inches as separate picker columns
- If `cm`, show one numeric picker
- Unit switching recalculates the current value immediately
- Clear helper text

## Weight Requirements

Support:

```text
kg
lb
```

Design expectations:

- Unit segmented control
- Large numeric picker
- Optional decimal support for kg
- Unit switching recalculates the current value immediately
- Calm privacy/helper copy

## Design Notes

Measurement pages should feel mature and trustworthy. Picker UI should be used when it improves clarity and confidence, not because the framework requires it.

Navigation behavior comes from `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.
