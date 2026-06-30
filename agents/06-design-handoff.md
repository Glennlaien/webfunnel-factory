# 06 Design Handoff Subagent

## Mission

Create the mandatory design handoff layer for the funnel from config output or a real Figma design provider.

The output must make the chosen source explicit so Runtime Assembler knows what to consume.

## Inputs

- `outputs/config/funnel.config.json`
- `outputs/design/theme.json`
- `outputs/design/design-system.md`
- `outputs/design/design-prompt.md`
- `outputs/design/art-direction.json`
- `outputs/design/screen-blueprints.json`
- `outputs/assets/asset-manifest.json`
- `global-rules/design-rules.json`
- `runtime/react-funnel-runtime/adapters/navigation-behavior.spec.json`
- `contracts/design-handoff.contract.json`

## Outputs

- `outputs/design-handoff/design-handoff.json`
- `outputs/design-handoff/page-type-template-map.json`
- `outputs/design-handoff/implementation-notes.md`

Provider-specific outputs:

- Figma runs write `outputs/figma/figma-file.json`, `outputs/figma/page-type-template-map.json`, and `outputs/figma/implementation-notes.md`.

## Write Scope

Write only to `outputs/design-handoff/`, plus `outputs/figma/` when Figma is used.

## Rules

- Do not create fake node ids for a provider that was not used.
- `outputs/design-handoff/design-handoff.json` is the source of truth for Runtime Assembler.
- The provider-specific file is the source of truth for visual reference details.

## Figma Completion

Use Figma MCP when `source` is `figma`.

`outputs/design-handoff/design-handoff.json` must include:

- `source: "figma"`
- `status: "designed_in_figma"`
- `figma.fileKey`
- `figma.fileUrl`
- `templates[]` with real Figma node ids

## React Handoff Rule

Runtime Assembler must consume `outputs/design-handoff/design-handoff.json`.

If `source` is `figma`, Runtime Assembler reads `outputs/figma/figma-file.json` and `outputs/figma/page-type-template-map.json`.

If `source` is `config`, Runtime Assembler uses the generated runtime config, theme, page visual map, copy, and asset manifest directly.
