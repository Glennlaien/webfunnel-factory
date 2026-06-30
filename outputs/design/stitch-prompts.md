# Stitch Page Prompts

Global brief: outputs/design/stitch-global-brief.md

## 1. entry
- Page type: entry_page
- Page id: entry
- Required: yes

```text
Design one mobile Web2App ENTRY / PORTAL screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include primary CTA labeled "Get started".
- Must include a login action for returning users.
- Must include product/brand name.
- Must include one large hero image slot.
- Get started begins a fresh tab-scoped funnel session; do not design it as account creation.
Required Layout:
- Full-screen or first-viewport portal composition.
- Brand and login action near the top.
- Hero image dominates the page without being trapped inside a decorative card.
- Primary CTA is easy to reach and visually dominant.
Required Content:
- Headline should communicate: Create a personalized home fitness plan around goal, body baseline, and schedule.
- Use concise supporting copy; do not overload the first screen.
- No app store badges or fake app UI.
Page-Specific Visual Notes:
- Make the product feel real immediately through imagery.
- If text overlays image, add contrast treatment for readability.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 2. age_group
- Page type: single_choice_page
- Page id: age_group
- Required: yes

```text
Design one mobile Web2App AGE GROUP IMAGE CHOICE screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include exactly four selectable age-group option cards.
- Each option card must include one image slot and one visible label.
- Selecting the first real answer triggers anonymous identity creation in runtime; do not add extra CTA requirements unless the page contract says so.
- Runtime needs stable option areas; do not merge the four choices into one image.
Required Layout:
- Top navigation/progress area.
- Centered title.
- 2x2 image card grid on mobile.
- Legal/privacy hint may appear below the grid if needed.
Required Content:
- Title: Select your age to start.
- Options: Age: 18-25, Age: 26-35, Age: 36-45, Age: 46+.
Page-Specific Visual Notes:
- Images should show clear age difference and consistent crop/style.
- The page should feel visual and low friction.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 3. single_choice
- Page type: single_choice_page
- Page id: fitness_goal_discovery
- Required: yes

```text
Design one mobile Web2App STANDARD SINGLE CHOICE screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include a single-choice option list.
- Single choice may auto-advance in runtime; do not require a bottom CTA unless explicitly present.
- Each option must have a clear selected state.
- Icons are optional and must not look forced.
Required Layout:
- Top navigation/progress area.
- Centered title and optional subtitle.
- Vertical option rhythm with stable tap targets.
- No unnecessary footer controls.
Required Content:
- Example title: What is your main goal?.
- Example options: Build strength, Lose fat, Look more defined, Build discipline.
Page-Specific Visual Notes:
- Keep this template reusable across many generated OB questions.
- Use layout quality, spacing, and selected state to create differentiation without changing logic.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 4. multi_choice
- Page type: multi_choice_page
- Page id: fitness_body_focus
- Required: yes

```text
Design one mobile Web2App STANDARD MULTI CHOICE screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include a multi-choice option list.
- Must include bottom primary CTA.
- CTA must have enabled and disabled visual states.
- Runtime requires at least one selected option unless configured otherwise.
- Do not use tiny right-side circles as the only selected-state signal.
Required Layout:
- Top navigation/progress area.
- Centered title and subtitle like 'Choose all that apply'.
- Scrollable option area if options exceed viewport.
- Bottom CTA remains stable.
Required Content:
- Example title: Which areas should we focus on?.
- Example options: Chest, Arms, Core, Legs, Full body.
- CTA: Continue.
Page-Specific Visual Notes:
- Selected options should feel tactile and obvious.
- Option icons are optional; do not force decorative iconography.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 5. intro_transition
- Page type: intro_page
- Page id: fitness_goal_trust_bridge
- Required: yes

```text
Design one mobile Web2App INTRO / TRANSITION screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include one contextual image slot.
- Must include headline, supportive paragraph, and bottom primary CTA.
- This page collects no input.
- CTA advances to the next OB page.
Required Layout:
- Top navigation/progress area.
- 4:3 image near the top or upper-middle.
- Headline and paragraph below image.
- Bottom CTA aligned with other runtime buttons.
Required Content:
- Example headline: Your goal gives the plan direction.
- Paragraph should be long enough to build trust but not become an article.
- CTA: Continue.
Page-Specific Visual Notes:
- Use this as a trust bridge between sections.
- Do not add fake input controls.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 6. metric_input
- Page type: age_input_page
- Page id: exact_age
- Required: yes

```text
Design one mobile Web2App METRIC INPUT screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include large numeric input display.
- Must include sliding unit switch.
- Height supports ft/in and cm; weight supports lb and kg.
- Runtime performs real-time unit conversion and validation.
- Must include bottom CTA.
- Validation warning appears only when user enters out-of-range value.
Required Layout:
- Top navigation/progress area.
- Centered title.
- Unit switch directly below title.
- Large numeric input in the center.
- Optional support/insight card below input.
- Bottom CTA.
Required Content:
- Example title: What is your age?.
- Do not include consent copy unless explicitly required.
- CTA: Continue.
Page-Specific Visual Notes:
- Numeric value must look visually centered.
- Unit switch selected pill uses global primary color.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 7. summary
- Page type: summary_page
- Page id: summary
- Required: yes

```text
Design one mobile Web2App SUMMARY / ANALYSIS screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include BMI visualization with user marker.
- Must include computed profile rows from previous answers.
- Must include one body-state image slot.
- Must include one insight card.
- Must include bottom primary CTA.
- Runtime supplies BMI, fitness level, focus, goal change, and body image.
Required Layout:
- Top navigation/progress area.
- Large centered summary heading.
- BMI scale near the top.
- Profile rows and body image in a balanced layout.
- Insight card below.
- Bottom CTA.
Required Content:
- Title: Summary of your fitness level.
- Use placeholder computed values, but make data-binding areas clear.
- CTA: Continue.
Page-Specific Visual Notes:
- Make it obvious that the plan uses previous answers.
- Avoid shame framing; keep analysis supportive.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 8. plan_generation
- Page type: plan_generation_page
- Page id: plan_generation
- Required: yes

```text
Design one mobile Web2App PLAN GENERATION screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include circular progress/loading visualization.
- Must include status text under the progress.
- Must support modal yes/no follow-up questions over the current page.
- Must include rotating social proof or feedback area.
- Users must answer follow-up questions when shown; do not design them as passive saved chips.
Required Layout:
- Progress visualization centered near the top.
- Status text below progress.
- Feedback/proof area below.
- Follow-up question appears as a modal overlay with backdrop.
Required Content:
- Main status: Creating your home fitness plan.
- Follow-up answers are simple yes/no or check/cross style.
- Keep copy short and believable.
Page-Specific Visual Notes:
- Animation will be implemented in React; Stitch should define visual style and hierarchy.
- Do not add too many modules.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 9. plan_ready
- Page type: plan_ready_page
- Page id: plan_ready
- Required: yes

```text
Design one mobile Web2App PLAN READY / PREDICTION screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include a personalized plan-ready headline.
- Must include target date text.
- Must include animated trend chart design with at most five points.
- Chart must support weight loss, weight gain, and maintenance states.
- Must include bottom primary CTA.
Required Layout:
- Top navigation/progress area.
- Headline and concise supporting copy.
- Target weight/date callout.
- Chart section.
- Bottom CTA.
Required Content:
- Title: Your personalized plan is ready.
- Use month plus year labels when timeline crosses years.
- CTA: Continue.
Page-Specific Visual Notes:
- Chart labels and points must align visually.
- Avoid decorative clutter behind chart icons.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 10. paywall
- Page type: paywall_page
- Page id: paywall
- Required: yes

```text
Design one mobile Web2App PAYWALL screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must include sticky offer countdown at top.
- Must include primary CTA labeled 'GET MY PLAN' or 'Get my plan'.
- Must include body comparison with two image slots: Now and Goal.
- Must include API-driven offer list with selectable plan cards.
- Plan cards must visually support title, current price, original price with strikethrough, daily price, selected state, and optional badge.
- Must include legal disclosure below CTA.
- Must include app screenshot carousel section.
- Must include user feedback cards.
- Must include guarantee or secure payment reassurance.
- Checkout form is not displayed inline; runtime opens a full-screen checkout route/modal.
Required Layout:
- Vertical layout only.
- Countdown bar at top.
- Body comparison near top.
- Personalized headline and brief promise.
- Offer list before first CTA.
- CTA immediately after offer list.
- Proof, carousel, feedback, guarantee, FAQ/legal below.
- No side-by-side desktop sales layout.
Required Content:
- Use placeholder offers, but preserve data-driven plan card areas.
- Use placeholder feedback matching product audience and gender.
- Do not include promo code module unless explicitly configured.
Page-Specific Visual Notes:
- Avoid boxes nested inside boxes.
- Make the purchase section clear, premium, and trustworthy.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```

## 11. account_auth_profile
- Page type: account_template
- Page id: account_auth_profile
- Required: yes

```text
Design one mobile Web2App ACCOUNT / LOGIN / PROFILE screen for "Workout for Women -Lose Weight".
This is a Stitch design handoff screen, not final production code.
Use the global visual direction from outputs/design/stitch-global-brief.md. Keep the same visual system as every other Stitch screen in this project.
Runtime Contract:
- Must define a simple login screen style.
- Must define a simple account creation style.
- Must define a profile/subscription management style.
- Profile must support ID, email, subscription status, period end date, and cancel subscription action.
- Payment success routes to account creation; homepage login routes to login/profile.
Required Layout:
- Flat, simple form layout.
- No redundant top title if page heading is enough.
- Profile uses clean rows, not nested cards.
- Cancel subscription action is visible but not visually dominant.
Required Content:
- Login fields: email and password.
- Account creation fields: email and password.
- Profile rows: ID, email, subscription status, valid until.
Page-Specific Visual Notes:
- Keep it calm and utilitarian.
- Match the same global visual system without becoming a marketing page.
Output Requirement:
- Generate one complete mobile screen around 390px wide.
- All required runtime elements must be visually present.
- No phone mockup.
- Do not remove required CTAs, inputs, selectable options, checkout trigger areas, or data-driven sections.
- Do not create a different style from the global visual brief.
```
