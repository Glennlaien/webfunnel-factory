# React Funnel Runtime

Fixed React runtime code package and configuration contract for Web2App funnels.

This folder is a project asset, not a generated run output.

## Files

- `app-template/` - the real React runtime code package copied into `outputs/app`
- `runtime.config.json` - runtime scope, input/output contract, and core capabilities
- `renderer-registry.json` - maps `pageType + variant` to React renderer components
- `contracts/funnel-config.contract.json` - minimum shape expected from `funnel.config.json`
- `contracts/theme.contract.json` - theme token contract
- `contracts/design-template-map.contract.json` - provider-neutral design template map contract
- `adapters/unit-conversion.spec.json` - height/weight conversion rules
- `adapters/navigation-behavior.spec.json` - auto-advance vs CTA navigation behavior
- `docs/runtime-overview.md` - conceptual explanation

## Rule

Codex should use this runtime package when creating `outputs/app`. It should not invent a new frontend architecture for each product.

`scripts/create-react-runtime-template.mjs` is an assembler only:

1. Copy `app-template/` into `outputs/app`.
2. Inject `src/runtime/templateConfig.ts` from generated config/copy/theme/assets.
3. Inject theme variables into `src/styles.css`.
4. Copy local assets into `outputs/app/public/assets/images`.

Runtime behavior changes belong in `app-template/`, not inside the assembler script.

Runtime files should reference canonical rule files instead of duplicating them:

- Visual rules: `global-rules/design-rules.json`
- Compliance rules: `global-rules/compliance-rules.json`
- Navigation behavior: `adapters/navigation-behavior.spec.json`
- Unit conversion behavior: `adapters/unit-conversion.spec.json`
