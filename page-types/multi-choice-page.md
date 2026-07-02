# multi_choice_page

Use when multiple answers may be true.

## Required Fields

- `id`
- `pageType`
- `module`
- `conversionPurpose`
- `dataKey`
- `title`
- `cta`
- `minSelections`
- `options`

## Navigation Behavior

Use the canonical default in `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.

## Design Expectations

- The page should clearly imply multiple selections.
- Use checkmarks or selected cards.
- If there is a "none" option, mark it as exclusive.
- Respect `minSelections` in selected, disabled, and error states.
- Choose one explicit variant:
  - `image_grid` for large raster image cards
  - `plain_list` for text-only rows
  - `icon_list` for semantic Lucide icon rows
  - `bottom_image` for text rows with one large contextual image below the options
- `icon_list` requires option-level `icon`; `plain_list` does not.
- `image_grid` requires option-level local raster images or asset requirements.
- `bottom_image` should use a page-level `image`, `heroImage`, `bottomImage`, or `assetRequirement`; it does not require per-option images.

## Examples

- Body focus areas
- Past attempts
- Symptoms or limitations
- User preferences
