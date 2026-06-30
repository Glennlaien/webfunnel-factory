# single_choice_page

Use when the user should select exactly one answer.

## Required Fields

- `id`
- `pageType`
- `module`
- `conversionPurpose`
- `dataKey`
- `title`
- `options`

## Navigation Behavior

Use the canonical default in `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.

If a product needs to break the default, set the page-level override field named by that spec.

## Design Expectations

- Large tappable options
- Clear selected state
- Minimal explanatory text
- Choose one explicit variant:
  - `image_grid` for large raster image cards
  - `plain_list` for text-only rows
  - `icon_list` for semantic Lucide icon rows
- `icon_list` requires option-level `icon`; `plain_list` does not.
- `image_grid` requires option-level local raster images or asset requirements.

## Examples

- Main goal
- Current fitness level
- Biggest barrier
- Preferred schedule
