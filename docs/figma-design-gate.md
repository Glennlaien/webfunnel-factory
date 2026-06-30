# Figma Design Gate

Figma is one supported design provider for full Web2App workflow runs.

For the provider-neutral design gate, use `docs/design-handoff-gate.md`.

## Statuses

- `handoff_ready`: Design prompts and template intent exist, but no real Figma nodes were created. This is incomplete and blocks final React implementation.
- `designed_in_figma`: A real Figma file exists, key screens/templates were drawn through Figma MCP, and node ids are persisted.
- `implemented_from_figma`: React implementation consumed the Figma node context/screenshots and QA passed.

## Required Figma Outputs

`outputs/figma/figma-file.json` must include:

- `status: "designed_in_figma"`
- `fileKey`
- `fileUrl`
- `screens[]` with `pageId`, `pageType`, `nodeId`, and `intent`

`outputs/figma/page-type-template-map.json` must include:

- `status: "designed_in_figma"`
- `templates[]` with `pageType`, optional `variant`, `nodeId`, and `figmaFileKey`

## Workflow Rule

React final implementation cannot proceed from `handoff_ready` when the selected provider is Figma. If Figma MCP is unavailable, the output may be labeled `prototype_from_config`, but it must not be described as Figma design-to-code or full workflow complete.
