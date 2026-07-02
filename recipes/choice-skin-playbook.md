# Choice Skin Playbook

Choice skins are runtime-safe visual treatments for `single_choice_page` and `multi_choice_page`.

They do not change page logic. They only change the visual language of option rows, selected states, and image choice cards.

## Relationship To Variants

- `variant` decides structure: `plain_list`, `bottom_image`, or `image_grid`.
- `choiceSkin` decides visual tone inside that structure.

Example:

```json
{
  "pageType": "single_choice_page",
  "variant": "plain_list",
  "visual": {
    "choiceSkin": "choice-skin-hard-training",
    "pageClass": "choice-skin-hard-training"
  }
}
```

## Supported Skins

### choice-skin-hard-training

For male training, military, calisthenics, strength, muscle, and discipline-led funnels.

Visual intent:

- more compact and direct
- stronger border rhythm
- selected state feels decisive
- less soft wellness card feeling

### choice-skin-calm-wellness

For tai chi, yoga, senior, low-impact, mobility, balance, and recovery funnels.

Visual intent:

- calm spacing
- low-contrast borders
- soft selected state
- readable, reassuring, not aggressive

### choice-skin-calm-strength

For products that are strength-oriented but chair-based, senior-friendly, or low-impact.

Visual intent:

- keeps calm-wellness readability
- adds firmer selected border and more structured type
- avoids both gym aggression and overly soft yoga styling

### choice-skin-energetic-fitness

For women's fitness, weight loss, toning, body shaping, and energetic transformation funnels.

Visual intent:

- brighter selected state
- slightly lifted cards
- active but not childish
- good for motivation-heavy OB flows

### choice-skin-clinical-trust

For health management, BMI, recovery, pain support, and credibility-heavy funnels.

Visual intent:

- flatter rows
- measured borders
- restrained selected state
- trustworthy and data-aware

### choice-skin-lifestyle-companion

For habit building, light movement, daily routine, beginner movement, and long-term lifestyle funnels.

Visual intent:

- warm, practical, friendly
- gentle selected fill
- approachable daily-use feeling

## Rules

- Do not apply choice skins to `age_group`; it has a dedicated `image_grid` treatment.
- Do not use skins to add/remove CTAs, change auto-advance, change multi-select validation, or change API calls.
- Do not invent per-page colors. Skins must inherit global theme tokens.
- Use one skin per funnel by default so the OB feels coherent.
- Page variants can vary within a funnel, but choice skin should remain globally consistent unless there is a deliberate product reason.
