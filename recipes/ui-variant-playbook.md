# UI Variant Playbook

This playbook decides which page layout variants a Web2App funnel should use. It does not replace the React Runtime. It tells the planner which supported Runtime variant to assign to each page.

## Core Principle

UI variation should make the product feel more specific without breaking funnel logic. Use variants to improve comprehension, trust, and emotional fit. Do not use variants randomly just to make screens look different.

## Currently Supported Choice Variants

Only these choice-page variants are production-supported right now:

- `plain_list`
- `bottom_image`
- `image_grid`

Do not output unsupported choice variants.

## Variant Meanings

### plain_list

Use for fast, low-friction questions.

Best for:

- abstract goals
- schedule questions
- frequency questions
- yes/no or simple preference questions
- questions where an image would add little value
- sensitive questions where visuals may feel awkward

Examples:

- "How many days per week can you train?"
- "When do you prefer to work out?"
- "What keeps you going?"

### bottom_image

Use for a text-option question that benefits from one contextual image below the options.

Best for:

- motivation questions
- exercise familiarity questions
- environment questions
- pain, mobility, safety, or confidence questions where a supportive contextual image can reassure the user
- questions where one scene can clarify the feeling of the page

Rules:

- Use one page-level contextual image, not per-option images.
- The image should support the question mood, not answer the question for the user.
- Use sparingly. A long OB should not make every question a bottom-image page.
- If selected, the page should include a page-level image plan slot.
- Use only when the option list is visually light.
- Best for single-choice pages with 2-3 options.
- Single-choice pages with 4 short options may use it only when the image adds emotional context.
- Multi-choice pages should usually avoid it; use only when there are 2-3 very short options and the image clearly reassures or sets context.
- Do not use `bottom_image` for pages with 5+ options.
- Do not use `bottom_image` for dense health/symptom lists, body-area lists, or pages where the CTA/options would be pushed below the fold.

Image prompt direction:

- The image is a mood/context support image, not an option illustration.
- It should show one believable product-relevant scene or person.
- It should make the page feel less empty and more specific.
- It should not contain words, labels, arrows, UI, devices, logos, or multiple panels.
- It should not visually answer the question or bias the user's choice.
- It should preserve the product audience, age range, intensity, and safety tone.

Examples:

- "Have you tried bodyweight workouts before?"
- "Where will you usually work out?"
- "Any joint or mobility concerns?"
- "What would make this plan feel doable?"

### image_grid

Use when each option needs its own image.

Best for:

- age group
- body type
- target body type
- visual self-identification
- target zone or focus area only when each option can be represented clearly and respectfully

Rules:

- Requires option-level images or option asset requirements.
- Do not use for abstract choices.
- Do not use if images could shame the user or make the answer feel embarrassing.
- Keep option images consistent in crop, lighting, and style.

Examples:

- age group cards
- current body type
- target body type

## Product-Type Guidance

### hard-training

Use more `bottom_image` on discipline, confidence, training environment, and readiness questions. Keep routine and schedule questions as `plain_list`.

### calm-wellness

Use `bottom_image` for safety, comfort, mobility, balance, and gentle movement questions. Keep medical-adjacent questions respectful and avoid intense imagery.

### energetic-fitness

Use `image_grid` for visual self-identification and `bottom_image` for motivation or lifestyle moments. Keep fast goal and schedule questions simple.

### clinical-trust

Prefer `plain_list` for sensitive data and `bottom_image` only when the image adds reassurance. Avoid decorative imagery.

### lifestyle-companion

Use `bottom_image` for daily routine, environment, and habit context. Keep page rhythm calm and familiar.

## Funnel Rhythm

For a long OB:

- most choice pages should remain `plain_list`
- 2-5 question pages may use `bottom_image`
- 1-3 pages may use `image_grid`, usually fixed visual pages like age/body type
- intro pages already have their own image system and should not be counted as choice variants

Avoid placing image-heavy pages back-to-back too often. Use visual pages as pacing changes between plain question sections.

## Intro, Summary, Paywall Future Direction

These variants are production-supported for fixed result and monetization pages. They are selected by the product run generator from the product profile and global UI recipe. They should not be invented freely by the question planner.

### Intro Page Variants

- `image_top`
- `editorial`
- `proof_panel`

Use `image_top` as the neutral default. Use `editorial` for high-discipline, transformation, strength, or energetic products where the transition page should feel more like a campaign beat. Use `proof_panel` for senior, recovery, calm wellness, clinical, or trust-heavy products where reassurance matters more than intensity.

### Summary Page Variants

- `bmi_profile`
- `body_comparison`
- `clinical_readout`

Use `bmi_profile` as the neutral default. Use `body_comparison` for transformation, weight change, strength, or body-shaping products where the body visual should carry more of the page. Use `clinical_readout` for senior, health, recovery, pain, mobility, BMI, or trust-heavy products where the page should feel more like a careful report.

### Paywall Page Variants

- `transformation_first`
- `proof_first`
- `app_preview_first`

Use `transformation_first` for fitness, weight loss, strength, muscle, calisthenics, and visible-progress products. Use `proof_first` for senior, calm wellness, recovery, and high-trust products. Use `app_preview_first` for lifestyle, habit, companion, and long-term plan products where the companion app value should appear early.

Fixed page variants must preserve required runtime data:

- Summary must always keep BMI, bound answer facts, body visual, and insight card.
- Paywall must always keep offer loading, offer selection, checkout CTA, legal disclosure, Stripe checkout overlay, app screenshot section, testimonials, guarantee, and FAQ.
- Intro must always keep image, headline/body copy, and bottom CTA.

## Anti-Patterns

Avoid:

- using `bottom_image` on every page
- using `image_grid` without real option images
- using visual variants for purely abstract questions
- adding images that contradict the product audience
- using aggressive imagery for senior or recovery products
- using shame-based body imagery
- changing page logic just to fit a visual idea

## Output Discipline

When assigning variants:

- preserve page type and data key
- use only supported variants
- explain image need in `visualDecision.reason`
- set `visualDecision.required = true` when `bottom_image` needs generated image support
- use `plain_list` when unsure
