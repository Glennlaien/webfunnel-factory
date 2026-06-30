# Web2App Subagent Factory

A page-type-driven multi-agent workflow for generating Web2App onboarding and subscription funnels.

This is not a generic multi-agent platform. It is a focused factory:

```text
product input
-> product strategy
-> skeleton selection
-> composed rules
-> page map
-> conversion copy
-> design direction
-> image planning
-> image asset generation
-> developer config
-> design provider page type templates
-> React Runtime implementation
-> QA report
```

## Core Idea

The system fixes the available Web2App page types first. Subagents do not invent arbitrary screens; they choose, copywrite, design, and validate against the page type system.

The OB flow is treated as a pre-paywall conversion experience. It should use purposeful sections, intro pages between major sections, a segmented top progress bar, and copy/design that builds trust and plan ownership before the paywall.

## Workflow

```text
Strategist
-> Skeleton Selector
-> Rules Composer
-> Page Architect
-> Copywriter
-> UI Designer
-> Image Planner
-> Image Asset Generator
-> Config Builder
-> Design Handoff
-> Runtime Assembler
-> QA Reviewer
```

Each role reads fixed inputs and writes only its own output folder.

## Important Folders

```text
agents/       role prompts for Codex subagents
global-rules/ canonical company, OB conversion, design, and compliance rules
funnel-skeletons/ standard funnel flow skeletons
page-types/   canonical Web2App page type specs
configs/      routing and project-level settings
inputs/       raw product brief, App Store notes, references
outputs/      generated files from each subagent
runtime/      fixed React Funnel Runtime contracts and renderer registry
schemas/      JSON schemas and validation rules
scripts/      lightweight validation/export helpers
```

See `docs/rule-ownership.md` before adding recurring rules. Product-specific exceptions belong in `inputs/funnel-requirements.md`; reusable policy belongs in `global-rules/` or `runtime/react-funnel-runtime/adapters/`.

## Workflow

Use the workflow orchestrator to inspect and run the current state:

```bash
npm run workflow:status
npm run workflow:next
npm run workflow:prompt
npm run workflow:run
```

The script reads `configs/agent-routing.json`, checks each step's inputs and outputs, runs deterministic steps, and stops at agent steps with an explicit prompt contract.

The orchestrator controls order and gates. Codex/agents still generate product strategy, page architecture, copy, design direction, image plans, image prompts, and config.

Manual run order is defined in `configs/agent-routing.json`.

Useful commands:

```bash
npm run workflow:status
npm run workflow:next
npm run workflow:prompt -- ui-designer
npm run workflow:validate
npm run workflow:doctor
npm run workflow:run
npm run workflow:init -- --product-name "App Name" --app-url "https://apps.apple.com/..."
npm run validate
```

## Design Handoff Rule

Figma or the provider-neutral design layer designs page type templates, not every funnel page instance. If a funnel has 34 pages, the selected design source should still only draw or define the used page types and variants, such as `single_choice_page / image_grid` or the selected height/weight input variants.

The selected design source should use generated local assets from `outputs/assets/asset-manifest.json` so design and React share the same imagery.

## React Rule

React is implemented through the fixed React Funnel Runtime under `runtime/react-funnel-runtime/`.

Product runs should not invent a new frontend architecture. They should instantiate the runtime with:

- `outputs/config/funnel.config.json`
- `outputs/design/theme.json`
- `outputs/config/app-config/*.json`
- `outputs/assets/asset-manifest.json` when generated assets are ready
- `outputs/design-handoff/page-type-template-map.json` when a design provider is used

The runtime chooses renderers by `pageType` and `variant`, uses the selected design provider's templates as visual references, and must be mobile-first while remaining usable on PC.

It also renders section-based top progress from `sectionId`, `sectionLabel`, and `sectionOrder` in the generated funnel config.

Image assets are planned before generation. `outputs/assets/image-plan.json` is the reviewable large-image plan; it includes only hero images, option-card images, body/result visuals, and App Store screenshot-style assets. Tiny option icons, payment logos, progress bars, charts, and UI glyphs are not image-plan assets.

After review, generated or sourced assets are saved under `outputs/assets/images/`, listed in `outputs/assets/asset-manifest.json`, then copied or imported into the React app.
