# Subagent Operating Rules

This project uses Codex subagents as role-based workers. Subagents are not independent services yet; the main Codex thread orchestrates them.

## Non-Negotiable Rules

- The project is page-type-driven.
- Agents must write only to their assigned output directory.
- Agents must not overwrite another agent's output.
- Agents must not invent new page types unless the main orchestrator updates `page-types/` and `configs/page-types.json`.
- Structured files are the handoff contract.
- Markdown can explain reasoning, but JSON is the source of truth.

## Agent Write Scopes

| Agent | Write scope |
| --- | --- |
| Strategist | `outputs/strategy/` |
| Skeleton Selector | `outputs/skeleton/` |
| Rules Composer | `outputs/rules/` |
| Page Architect | `outputs/page-map/` |
| Copywriter | `outputs/copy/` |
| UI Designer | `outputs/design/` |
| Image Asset Generator | `outputs/assets/` |
| Config Builder | `outputs/config/`, `outputs/exports/` |
| Design Handoff | `outputs/design-handoff/`, plus `outputs/figma/` when Figma is used |
| Runtime Assembler | `outputs/app/` |
| QA Reviewer | `outputs/qa/` |

## Main Orchestrator Responsibilities

- Use `scripts/workflow.mjs` to enforce step order and input/output gates.
- Use `npm run workflow:prompt -- <step>` for bounded agent tasks.
- Keep each agent's write scope disjoint.
- Run deterministic workflow steps through `npm run workflow:run`.
- Run validation after outputs are generated.
- Resolve conflicts between strategy, page map, copy, design, config, Figma, and React.
- Decide when to proceed with a provider-neutral design fallback.
- Ensure the design source defines page type templates, not every funnel page instance.
