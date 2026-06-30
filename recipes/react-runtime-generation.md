# React Runtime Generation Recipe

Generated React apps should be config-driven.

## Inputs

- `outputs/config/funnel.config.json`
- `outputs/design/theme.json`
- `outputs/assets/asset-manifest.json`
- `outputs/config/app-config/*.json`
- `outputs/design-handoff/design-handoff.json`
- `outputs/design-handoff/page-type-template-map.json`
- `runtime/react-funnel-runtime/runtime.config.json`
- `runtime/react-funnel-runtime/renderer-registry.json`
- `contracts/*.json`
- `recipes/*.md`

## Implementation Rules

1. Render pages by `pageType` and `variant`.
2. Keep page ids, data keys, option values, and order stable.
3. Use `lucide-react` for option icons.
4. Implement mobile-first CSS and desktop wide Web funnel layout.
5. Use the backend adapter contract for API calls.
6. Run validators after generation.

## Runtime Extraction Path

Before freezing a full React Runtime package, use one approved product as a master prototype and tune the highest-frequency renderers in real React code.

1. Pick one product as the master reference.
2. Tune foundational renderers first: entry, single choice, multi choice, top progress, mobile layout, and desktop Web funnel layout.
3. After a renderer is approved, extract its behavior and style contract into `runtime/react-funnel-runtime/`.
4. Do not freeze a renderer while the UI, CTA behavior, progress behavior, or answer persistence behavior is still being debated.
5. Treat this prototype stage as the source for Runtime component decisions, not as a final product-run architecture.

## Output

Write a runnable Vite React app under `outputs/app`.
