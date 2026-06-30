# Page Type System

Page types are the stable collaboration layer between agents.

Funnel Agent chooses page types. Copywriter writes for page types. UI Designer designs page types. Codex implements page type renderers.

## Rule

Do not invent arbitrary pages during agent work. If a new page type is needed, update:

```text
configs/page-types.json
page-types/<new-page-type>.md
schemas/page-map.schema.json
```

## Canonical Page Types

See `configs/page-types.json` for the machine-readable list.
