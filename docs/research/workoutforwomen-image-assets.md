# Workout for Women Funnel Large Image Research

Date: 2026-06-12

Source:
- Live funnel: https://workoutforwomen.app/get-start-page
- Method: mobile walkthrough plus front-end bundle inspection.

This document only counts large visual assets: hero images, option-card images, body/result visuals, and App Store screenshot-style assets. Small icons, progress bars, payment logos, charts, and UI glyphs are intentionally excluded.

## Core Conclusion

Workout for Women mainly uses large images in five places:

1. Entry self-identification
   - Age group cards.

2. Emotional transition and intro pages
   - Large hero images between question groups.

3. Body-related option cards
   - Current body type and target body type.

4. A few richer option pages
   - Focus areas, special needs, flexibility, and sometimes sleep.

5. Paywall proof
   - App screenshots, result comparison, plan preview, and testimonial/proof visuals.

Most normal question pages do not need large images.

## Large Image Slots

| Slot | Count | Page Position | Purpose | Should Generate? |
|---|---:|---|---|---|
| Age group option images | 4 | First page, 2-column image cards | Let user identify age range visually | Yes |
| Welcome / transition hero | 1-3 | After age selection | Build trust and relevance | Yes |
| Intro hero images | 4-7 | Between OB chapters | Add motivation and explain why the flow matters | Yes |
| Current body type images | 4 | Body type option grid | Let user select current body state | Yes, carefully |
| Target body type images | 4 | Target body option grid | Let user select desired body state | Yes, carefully |
| Focus area option images | 0-5 | Multi-select options, usually right side | Show target body areas | Optional |
| Special need option images | 0-5 | Multi-select options, usually right side | Show pain points or limitations | Optional |
| Flexibility option images | 0-3 | Card option grid | Show mobility/stretch ability | Optional |
| Sleep main image | 0-1 | Sleep question page | Lifestyle context | Optional |
| Summary body result image | 0-4 | Summary page | Visualize BMI/body category | Optional |
| Plan generation image | 0-1 | Loading page | Add trust while plan is generated | Optional |
| Paywall app screenshots | 3-5 | Companion app carousel | Show real app value | Prefer App Store screenshots |
| Paywall comparison/result images | 1-3 | Paywall result preview | Show now vs goal/result promise | Prefer structured/generated visual |
| Paywall plan preview image | 1-3 | Paywall plan section | Show what user receives | Prefer structured UI screenshot |

## Recommended Required Set

For our production workflow, I recommend starting with this required large-image set:

1. `age_group.option_18_29`
2. `age_group.option_30_39`
3. `age_group.option_40_49`
4. `age_group.option_50_plus`
5. `welcome.hero`
6. `intro_01.hero`
7. `intro_02.hero`
8. `intro_03.hero`
9. `intro_04.hero`
10. `current_body.thin`
11. `current_body.average`
12. `current_body.plus_size`
13. `current_body.overweight`
14. `target_body.slim`
15. `target_body.normal`
16. `target_body.curvy`
17. `target_body.athletic`
18. `paywall.app_screenshot_1`
19. `paywall.app_screenshot_2`
20. `paywall.app_screenshot_3`

This means a typical full funnel needs about 17 generated large images plus 3 real/sourced App Store screenshots.

If we also enable optional rich option pages, add:

- 5 focus-area images.
- 5 special-need images.
- 3 flexibility images.
- 1 sleep image.
- 4 summary body result images.
- 1 plan-generation image.

The expanded version would be about 36 large images, but I do not recommend generating all of them by default.

## Image Characteristics by Type

### Age Group Images

Display:
- 2-column grid.
- Square or near-square cards.

Visual requirements:
- One person per card.
- Match the age group.
- Same crop, lighting, outfit style, and background across the set.
- No text, logo, phone UI, or watermark.

Generation priority:
- High.

### Welcome / Transition Hero

Display:
- Large image under or near the trust/social-proof headline.

Visual requirements:
- Shows the target audience doing the product-relevant workout.
- Should adapt to age or audience when useful.
- Should feel credible, not like a generic stock banner.

Generation priority:
- High.

### Intro Hero Images

Display:
- Wide image on intro pages between question clusters.

Visual requirements:
- Each image should support the page message.
- Examples: home workout setup, gentle training, body confidence, low-impact movement, consistency.
- Do not repeat the same composition on every intro page.

Generation priority:
- High.

### Current Body Type Images

Display:
- Image-card options.

Visual requirements:
- Consistent pose and crop.
- Neutral and respectful.
- Avoid shame-based before/after framing.
- Avoid exaggerated or unsafe body depictions.

Generation priority:
- High for weight/body-shaping funnels.

### Target Body Type Images

Display:
- Image-card options.

Visual requirements:
- Aspirational but believable.
- Same visual family as current body type images.
- Avoid unrealistic body ideals.

Generation priority:
- High for weight/body-shaping funnels.

### Focus Area / Special Need Images

Display:
- Usually cropped right-side images inside option rows.

Visual requirements:
- Body-area or pain-point focused.
- Small but still visually rich.
- Should not distract from the option text.

Generation priority:
- Medium.
- Can be skipped if we use icons or simple UI instead.

### Summary Body Result Images

Display:
- Summary page near BMI/result metrics.

Visual requirements:
- Selected by BMI/body category.
- Must be neutral and health-oriented.
- Should not create shame or fear.

Generation priority:
- Medium.
- Better added after the base funnel is stable.

### Paywall App Screenshots

Display:
- Carousel or phone screenshot strip.

Visual requirements:
- Should show the actual app experience.
- Must look product-specific.
- Should be high resolution and correctly cropped for phone screenshot display.

Generation priority:
- Do not generate by default.
- Use App Store screenshots when available.

## Proposed Image Generation Rule

At the start of a funnel run:

1. Product agent analyzes:
   - target audience
   - age/gender
   - workout modality
   - product promise
   - visual tone

2. Image planner decides:
   - which large image slots are needed
   - which are generated
   - which are sourced from App Store
   - which are skipped

3. User can review the image plan before generation.

4. Image generation produces files and a manifest:

```json
{
  "assetId": "age_group.option_30_39",
  "pageId": "age_group",
  "slot": "option_image",
  "source": "generated",
  "aspectRatio": "1:1",
  "file": "generated-images/age_group_option_30_39.webp"
}
```

## Open Decisions

1. Should the default required set always include current body and target body images?

2. Should intro pages always have generated hero images, or can some intro pages be text-only?

3. Should focus area and special need pages use large cropped images, or should they stay simpler?

4. Should summary body result images be included now, or delayed until the summary page design is finalized?

5. Should paywall screenshots always come from App Store screenshots instead of AI generation?

