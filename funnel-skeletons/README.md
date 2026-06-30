# Funnel Skeletons

These files define modular Web2App funnel skeletons. They are not fixed page-by-page templates.

Each skeleton defines:

- product/domain selection signals
- target total page range
- target onboarding question range
- module order
- required and optional question slots
- page type constraints
- conversion purpose for each slot
- where trust-building intro pages should appear
- which sensitive inputs should be delayed

The page architect should use skeletons as conversion-stage blueprints, then generate product-specific questions, options, copy intent, and page metadata.

## Current Standard Skeletons

| Skeleton | Best For | Question Depth |
|---|---|---:|
| `standard-weight-loss-funnel` | weight loss, slimming, fasting, diet-adjacent women fitness | 17-28 |
| `standard-strength-funnel` | strength, calisthenics, bodyweight, home muscle, military-style fitness | 15-25 |
| `standard-low-impact-seniors-funnel` | seniors fitness, chair workout, chair yoga, tai chi, balance, mobility | 14-25 |
| `standard-pilates-yoga-funnel` | Pilates, yoga, stretching, posture, flexibility, wall Pilates | 15-25 |
| `standard-walking-funnel` | walking, step habit, beginner cardio, walking weight loss | 16-27 |

## Depth Modes

Skeleton selection has two decisions:

1. Choose the domain skeleton.
2. Choose the effective depth mode.

The default depth is `auto`, so the user does not need to choose a tier for every run.

| Depth | Counted OB question/input pages | Approx total pages | Best For |
|---|---:|---:|---|
| `standard` | 22-28 | 38-48 | Low-friction movement plans, gentle fitness, simple goal personalization |
| `deep` | 28-36 | 48-65 | Weight loss, body transformation, fasting, diet-adjacent, muscle gain, stronger personalization |
| `expert` | 36+ | 65+ | Noom-like diagnostics, long-term behavior change, broad habit psychology, complex health/nutrition flows |

The domain skeleton's built-in range is a baseline, not a hard ceiling. If `auto` selects `deep` or `expert`, the Page Architect should keep the same module structure but expand with product-specific follow-up questions and optional slots that have clear conversion purpose. Do not add filler pages just to hit a number.

## Design Intent

The skeleton fixes the conversion structure, not the final page content.

Fixed:

- module sequence
- required data areas
- approximate depth
- where sensitive inputs belong
- paywall-prep structure
- account/payment lifecycle pages

Variable:

- exact question wording
- answer options
- product-specific optional slots
- visual style
- image prompts
- design handoff
- renderer variants

This keeps funnels consistent enough to run as a system while still allowing product-specific strategy and design.
