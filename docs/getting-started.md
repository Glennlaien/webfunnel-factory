# Getting Started

This project is meant to be used as a Git template for Page-Type-Driven Web2App funnel generation with Codex subagents.

## 1. Create A New Project From The Template

Clone the template into a new project folder:

```bash
git clone <template-repo-url> my-new-funnel
cd my-new-funnel
```

If the new project should have its own Git history:

```bash
rm -rf .git
git init
```

Install dependencies:

```bash
npm install
```

Reset the workspace to a clean starting state:

```bash
npm run reset
```

## 2. Add Product Input

Open:

```text
inputs/product-brief.md
```

Paste one of:

- App Store URL
- Product prompt
- Competitor links
- Product notes
- Screenshots or extra references saved under `inputs/references/`

Keep `inputs/funnel-requirements.md` unless the product has special requirements.

## 3. Check The Starter State

```bash
npm run workflow:status
npm run workflow:validate
```

At the start, `status` should show missing outputs. That is expected.

`validate` should pass with a warning that `outputs/page-map/page-map.json` does not exist yet.

## 4. Run The Codex Subagent Flow With The Orchestrator

Use the workflow script to run every deterministic step it can:

```bash
npm run workflow:run
```

When the workflow reaches an AI/agent step, it stops and prints the exact prompt contract. Ask Codex to complete that step, then run:

```bash
npm run workflow:run
```

The orchestrator reads `configs/agent-routing.json`; it controls sequence, required inputs, expected outputs, and deterministic commands. It does not replace Codex's reasoning for product strategy, page architecture, copywriting, design, image prompt planning, or config composition.

### Example: Strategist

Ask Codex:

```text
npm run workflow:prompt
```

The run command should stop and print:

```text
Use agents/01-strategist.md.

Read these inputs:
- inputs/product-brief.md
- inputs/funnel-requirements.md

Write only these outputs:
- outputs/strategy/product-strategy.md
- outputs/strategy/product-brief.json
```

### Prompt For A Specific Step

When you want to inspect or rerun a specific step:

```bash
npm run workflow:prompt -- ui-designer
```

### Full Health Check

Use:

```bash
npm run workflow:doctor
```

This validates workflow structure and prints the current status in one pass.

### Initialize Product Input From CLI

You can write the first product brief directly:

```bash
npm run workflow:init -- --product-name "Military Calisthenics Women" --app-url "https://apps.apple.com/..."
```

Then run:

```bash
npm run workflow:next
```

## 5. Inspect Results

```bash
npm run workflow:status
npm run workflow:validate
npm run validate
```

Important output files:

```text
outputs/strategy/product-brief.json
outputs/skeleton/selected-skeleton.json
outputs/rules/composed-rules.json
outputs/page-map/page-map.json
outputs/copy/page-copy.json
outputs/design/theme.json
outputs/design/design-prompt.md
outputs/assets/asset-manifest.json
outputs/config/funnel.config.json
outputs/design-handoff/design-handoff.json
outputs/design-handoff/page-type-template-map.json
outputs/app/package.json
outputs/exports/developer-brief.md
outputs/qa/qa-report.md
```

## 6. Start A New Product

To reuse the same folder for a new product:

```bash
npm run reset
```

This clears:

```text
outputs/**
inputs/references/**
```

And resets:

```text
inputs/product-brief.md
inputs/funnel-requirements.md
```

It keeps the framework:

```text
agents/
configs/
global-rules/
funnel-skeletons/
runtime/
page-types/
schemas/
scripts/
docs/
```

## Recommended Team Workflow

Use this repo as the template source.

Each new funnel gets its own clone:

```bash
git clone <template-repo-url> acme-fitness-funnel
cd acme-fitness-funnel
npm install
npm run reset
```

Then paste the product input and run the Codex subagent flow.
