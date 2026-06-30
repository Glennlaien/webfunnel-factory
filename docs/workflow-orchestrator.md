# Workflow Orchestrator

`scripts/workflow.mjs` is the workflow gatekeeper for this factory.

It is not an independent multi-agent service. It does not invent strategy, copy, design, or config by itself. Its job is to make the run order explicit, check required inputs and outputs, execute deterministic steps, and stop when a human/Codex agent step is required.

## Mental Model

```text
AI agent steps
  generate product-specific decisions, copy, design direction, image plans, asset prompts, and config

Deterministic steps
  generate the React Runtime package, validate files, and build the app

Workflow gates
  block the next step when required inputs or outputs are missing
```

This keeps the system from relying on memory or loose prompts for step order.

## Source Of Truth

The run order lives in:

```text
configs/agent-routing.json
```

The script appends two deterministic gates after the configured agent sequence:

```text
validate
app-build
```

`runtime-assembler` is also deterministic in the current template flow: it calls `scripts/create-react-runtime-template.mjs` to generate `outputs/app` and the app config mirrors.

## Commands

```bash
npm run workflow:status
npm run workflow:next
npm run workflow:prompt
npm run workflow:prompt -- ui-designer
npm run workflow:validate
npm run workflow:doctor
npm run workflow:run
npm run run:production -- --product-name "App Name" --app-url "https://apps.apple.com/..."
npm run workflow:run -- --from runtime-assembler
npm run workflow:init -- --product-name "App Name" --app-url "https://apps.apple.com/..."
```

## Status Labels

```text
done     required inputs and outputs exist
ready    inputs exist, outputs are missing
blocked  inputs are missing
stale    outputs exist, but required inputs are missing
```

## How `run` Works

`npm run workflow:run` loops through the workflow.

When it reaches an executable step, it runs it:

```text
runtime-assembler -> node scripts/create-react-runtime-template.mjs
validate          -> node scripts/validate.mjs
app-build         -> npm run build --silent inside outputs/app
```

When it reaches an agent step, it stops and prints the exact prompt contract:

```text
Use agents/03-copywriter.md.

Read these inputs:
- outputs/strategy/product-brief.json
- outputs/page-map/page-map.json

Write only these outputs:
- outputs/copy/page-copy.json
- outputs/copy/page-copy.md
```

That is intentional. Product strategy, page architecture, copywriting, design direction, and config composition still require Codex/agent reasoning.

## Image Steps

Image work is split into planning and generation.

`image-planner` writes:

```text
outputs/assets/image-plan.json
outputs/assets/image-plan.md
```

This is the reviewable large-image list. It includes hero images, option-card images, body/result visuals, and App Store screenshot-style assets. It excludes tiny option icons, payment logos, progress bars, charts, UI glyphs, and code-generated visuals.

`image-asset-generator` writes:

```text
outputs/assets/asset-manifest.json
outputs/assets/asset-prompts.md
outputs/assets/images/**
```

It consumes `image-plan.json`; it should not invent new image slots.

Image generation may temporarily output pending assets when the image API is unavailable.

Allowed temporary state:

```json
{
  "status": "pending_generation",
  "source": "placeholder"
}
```

Not allowed:

```text
Pretending a placeholder is a final gpt-image-2 asset.
Using SVG as generated imagery.
Letting React depend on transient remote image URLs.
```

The deterministic image bridge is:

```bash
SUB2API_BASE_URL=http://152.70.196.2:8080 \
SUB2API_API_KEY=... \
IMAGE_OUTPUT_FORMAT=png \
npm run images:generate
```

Use `IMAGE_OUTPUT_FORMAT=webp` when the runtime should consume WebP. The script reads pending assets from `outputs/assets/asset-manifest.json`, calls `gpt-image-2`, decodes `data[0].b64_json`, writes local raster files under:

```text
outputs/assets/
```

and records them in:

```text
outputs/assets/asset-manifest.json
outputs/config/app-config/assets-manifest.json
```

For a production full funnel run, do not stop after `images:prepare`. Use:

```bash
SUB2API_API_KEY=... npm run workflow:production -- \
  --product-name "App Name" \
  --app-url "https://apps.apple.com/..."
```

Optional audience overrides can sharpen or override the product agent's age analysis:

```bash
SUB2API_API_KEY=... npm run workflow:production -- \
  --product-name "Chair Mobility App" \
  --app-url "https://apps.apple.com/..." \
  --target-age "60-90" \
  --audience "older beginners who need gentle chair-based movement"
```

This command cleans old outputs, generates the product run, prepares image prompts, calls the real `gpt-image-2` bridge for all pending image assets, assembles the React Runtime, runs strict validation, and builds the generated app. In strict mode, validation fails if any required generated image is still `pending_generation`.

## Design Step

Design handoff is provider-neutral. The workflow supports:

```text
figma
config
```

Both providers must normalize their output into:

```text
outputs/design-handoff/design-handoff.json
outputs/design-handoff/page-type-template-map.json
outputs/design-handoff/implementation-notes.md
```

React reads the unified handoff first, then provider-specific artifacts.

## Validation Boundary

`workflow:validate` checks workflow shape:

- every configured step exists
- every agent prompt exists
- outputs stay under `outputs/`
- image generation comes before config
- design handoff comes before runtime assembly
- runtime contracts are valid

`npm run validate` checks generated artifacts:

- page map structure
- asset manifest shape
- design prompt thickness
- config/runtime invariants
- backend integration rules
- React app behavior expectations

## Where To Change Things

| Need | File |
|---|---|
| Change step order | `configs/agent-routing.json` |
| Change required inputs/outputs | `configs/agent-routing.json` |
| Change executable commands | `scripts/workflow.mjs` |
| Change runtime React behavior/components | `runtime/react-funnel-runtime/app-template/**` |
| Change runtime assembly/config injection | `scripts/create-react-runtime-template.mjs` |
| Change runtime behavior requirements | `runtime/react-funnel-runtime/adapters/*.json` |
| Change validation gates | `scripts/validators/*.mjs` |
