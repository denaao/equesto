# Foundation Templates — Agent 26

These templates are produced by the **Interactive Discovery & Project Foundation Agent (Agent 26)** and consumed by the orchestrator and all downstream specialist agents.

When Agent 26 runs, it copies these templates into the target project's `discovery/` folder (or another agreed location) and fills them in. The orchestrator then reads them as the authoritative starting context for any subsequent task.

## File map

| Template | Purpose | Owner |
|---|---|---|
| `PROJECT_BRIEF.template.md` | Problem, users, business, operational context | Agent 26 |
| `MVP_SCOPE.template.md` | Smallest viable cut + explicit deferrals | Agent 26 |
| `INITIAL_ROADMAP.template.md` | Phased plan from MVP through maturity | Agent 26 |
| `MODULE_MAP.template.md` | Logical (not architectural) module groupings | Agent 26 |
| `RISKS_AND_ASSUMPTIONS.template.md` | Risks (technical/business/operational/security) and tracked assumptions | Agent 26 |
| `OPEN_QUESTIONS.template.md` | High-value unresolved questions | Agent 26 |
| `CONTEXT_REGISTRY.template.md` | Single source of truth for project context | Agent 26 |
| `DISCOVERY_LOG.template.md` | Append-only audit log of discovery rounds | Agent 26 |
| `ORCHESTRATOR_HANDOFF.template.md` | Machine-readable handoff payload | Agent 26 → Orchestrator |

## Usage rules

- `CONTEXT_REGISTRY.md` is the single source of truth. Every other document derives from it.
- `ORCHESTRATOR_HANDOFF.md` is the contract with the orchestrator — it must always exist after a discovery round.
- `DISCOVERY_LOG.md` is append-only.
- These are **foundation-level** outputs. Architecture decisions, schemas, security implementations, runbooks, and code live elsewhere.
- Agent 26 does not finalize architecture, schema, security, or implementation — it only feeds validated context into the agents that do.

## Boundary with `/tasks/project-discovery`

`/tasks/project-discovery` audits **existing codebases**. Agent 26 owns **foundation and ongoing context discovery**. Both can run on the same project — they produce different artifacts:

| | `/tasks/project-discovery` | Agent 26 (foundation) |
|---|---|---|
| Input | Existing repository | Idea, partial requirements, fragmented context |
| Output | Architecture map, risk areas, gaps | Brief, MVP scope, roadmap, registry, handoff |
| When | Before deep work on existing code | Before the codebase exists, or whenever context drifts |
