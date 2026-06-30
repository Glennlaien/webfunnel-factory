# input pages

Input pages collect a typed value.

Canonical input page types:

- `height_input_page`
- `weight_input_page`
- `date_input_page`
- `email_capture_page`
- `name_capture_page`
- `account_create_page`

## Design Expectations

- One input focus per page
- Large mobile-friendly input
- Clear helper copy
- For height and weight inputs with multiple units, include unit switching and recalculate the displayed value immediately when the unit changes
- Height and weight inputs must initialize with a valid default unit, a visible selected unit tab, and a valid default numeric value
- If the user taps Continue without editing a measurement value, save the initialized default value

## Navigation Behavior

Use the canonical default in `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`.

Input validity should still be represented in disabled, error, and ready states.

## Notes

Sensitive body data should usually appear after trust and goal context have been established.
