# Figma Template Generation Recipe

Use Figma MCP to create real Figma frames for key product screens and reusable page-type templates.

This recipe is required only when Figma is the selected design provider. A text prompt or handoff file is not enough for a Figma-backed final implementation.

## Required Output

- `outputs/figma/figma-file.json`
- `outputs/figma/page-type-template-map.json`
- `outputs/figma/implementation-notes.md`

`figma-file.json` must use `status: "designed_in_figma"` and include `fileKey`, `fileUrl`, and key screen records.

`page-type-template-map.json` must include real Figma node ids for the template frames that React can reference.

Do not use `handoff_ready` as a successful state. It means the design step was not executed.

## Template Coverage

Create templates for:

- entry page
- single choice image grid
- single choice plain list
- single choice icon list
- multi choice plain list
- multi choice icon list
- intro page
- height input
- weight input
- summary / analysis / plan generation / plan ready
- paywall
- payment success
- account create
- login
- account
- subscription management
- cancellation

Use the runtime theme contract and avoid copying reference screenshot colors unless explicitly required.

## Minimum JSON Shape

`outputs/figma/figma-file.json`:

```json
{
  "status": "designed_in_figma",
  "fileKey": "real_figma_file_key",
  "fileUrl": "https://www.figma.com/design/...",
  "screens": [
    {
      "pageId": "entry",
      "pageType": "entry_page",
      "nodeId": "1:2",
      "intent": "portal hero"
    }
  ]
}
```

`outputs/figma/page-type-template-map.json`:

```json
{
  "status": "designed_in_figma",
  "templates": [
    {
      "pageType": "single_choice_page",
      "variant": "plain_list",
      "nodeId": "1:3",
      "figmaFileKey": "real_figma_file_key"
    }
  ]
}
```
