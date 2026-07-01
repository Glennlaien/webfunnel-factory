# Stitch Runtime Handoff

Stitch HTML was captured from 11 key screens and converted into runtime-safe page mappings.

- Global brief: outputs/design/stitch-global-brief.md
- Page prompts: outputs/design/stitch-prompts.json
- Primary: #F20562
- Card radius: 18px
- Button shape: pill
- Image treatment: large_editorial
- Density: structured

## Page mappings

- entry: stitch-screen stitch-screen-entry stitch-entry-editorial (top_nav, hero_media, headline, body_comparison, cta)
- age_group: stitch-screen stitch-screen-age_group stitch-choice-image-grid stitch-age-card-grid (top_nav, segmented_progress, hero_media, headline, legal, cta)
- single_choice: stitch-screen stitch-screen-single_choice stitch-choice-list stitch-choice-with-media (top_nav, segmented_progress, hero_media, headline)
- multi_choice: stitch-screen stitch-screen-multi_choice stitch-choice-list stitch-multi-check-list (top_nav, segmented_progress, hero_media, headline, body_comparison, cta)
- intro_transition: stitch-screen stitch-screen-intro_transition stitch-intro-editorial (top_nav, hero_media, body_comparison, facts_list, cta)
- metric_input: stitch-screen stitch-screen-metric_input stitch-metric-input stitch-centered-measurement (top_nav, bmi_gauge, unit_input, cta)
- summary: stitch-screen stitch-screen-summary stitch-summary-bmi-profile (top_nav, hero_media, headline, body_comparison, bmi_gauge, facts_list, cta)
- plan_generation: stitch-screen stitch-screen-plan_generation stitch-generation-proof (no sections detected)
- plan_ready: stitch-screen stitch-screen-plan_ready stitch-plan-chart (top_nav, hero_media, headline, line_chart, offer_list, legal, cta)
- paywall: stitch-screen stitch-screen-paywall stitch-paywall-longform (sticky_timer, segmented_progress, hero_media, headline, body_comparison, offer_list, legal, app_screenshots, cta)
- account_auth_profile: stitch-screen stitch-screen-account_auth_profile stitch-account-flat (top_nav, hero_media, offer_list, legal)

Runtime must preserve page behavior, data persistence, API calls, Stripe checkout, Firebase identity, and Mixpanel tracking.
