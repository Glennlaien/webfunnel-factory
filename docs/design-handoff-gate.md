# Design Handoff Gate

The workflow supports these design sources:

- Figma
- Config prototype

React must not assume a provider file exists when the design source is config.

## Required Unified Outputs

Every full workflow run must write:

```text
outputs/design-handoff/design-handoff.json
outputs/design-handoff/page-type-template-map.json
outputs/design-handoff/implementation-notes.md
```

`design-handoff.json` must state:

```json
{
  "source": "figma",
  "status": "designed_in_figma"
}
```

or:

```json
{
  "source": "config",
  "status": "prototype_from_config"
}
```

## Provider Outputs

Figma runs write real Figma files under `outputs/figma/`.

Config prototype runs use generated config, theme, page visual map, copy, and assets directly.

## React Consumption

Runtime Assembler reads `outputs/design-handoff/design-handoff.json` first, then reads provider-specific files only when the source is `figma`.

If the source is `config`, React should follow the generated runtime config and provider-neutral template map.
