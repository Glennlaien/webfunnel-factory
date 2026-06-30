# Page Instance Overrides

Use page instance overrides when a specific page must break from the default visual treatment of its page type.

This lets agents be creative inside clear constraints.

## Supported Fields

```json
{
  "variant": "image_grid",
  "positionRequirement": "first_question_after_entry",
  "designOverride": {},
  "assetRequirement": {}
}
```

## When To Use

- A specific page must appear in a fixed position.
- A specific page must use images.
- A specific page must use a special layout.
- A specific page has product or legal requirements.

## Example: Age Group With Images

```json
{
  "id": "age_group",
  "pageType": "single_choice_page",
  "variant": "image_grid",
  "positionRequirement": "first_question_after_entry",
  "dataKey": "ageGroup",
  "designOverride": {
    "layout": "two_column_image_cards",
    "mustUseImages": true,
    "imageTreatment": "bright natural female fitness lifestyle photos",
    "selectionTreatment": "primary border, checkmark, subtle overlay"
  },
  "assetRequirement": {
    "required": true,
    "assetType": "lifestyle_photo",
    "perOption": true
  }
}
```

Option-level assets can be specified like this:

```json
{
  "value": "18_25",
  "labelIntent": "18-25",
  "assetRequirement": {
    "subject": "young adult woman doing light fitness",
    "style": "bright app-like fitness photography"
  }
}
```
