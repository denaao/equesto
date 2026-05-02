# MVP Structuring

## Purpose

Cut a vague idea or oversized backlog into the smallest viable MVP and explicitly defer the rest.

## When to Use

- The product idea exists but the scope is unclear or too large
- A project is already foundered but is starting to scope-creep before validation
- The team is debating "v1 vs. v2" boundaries and needs a binding cut
- Before architecture or implementation work, when scope is the actual blocker (not technical decisions)

## What It Does

Invokes the orchestrator and routes to the **Interactive Discovery & Project Foundation Agent**, focused on the MVP cut. Produces (or refreshes) `MVP_SCOPE.md`, updates `RISKS_AND_ASSUMPTIONS.md` with overengineering alerts, updates `INITIAL_ROADMAP.md` to reflect the cut, and refreshes `ORCHESTRATOR_HANDOFF.md`. Other foundation files are touched only if context drifted.

---

## Prompt

Use the Universal Production AI Agent Orchestrator.

Mode: $MODE (default AUTO)
Task:
Cut the following down to a real MVP: $ARGUMENTS

Classification: PROJECT_FOUNDATION (with emphasis on MVP_SCOPE)

Required behavior:
- Route to the Interactive Discovery & Project Foundation Agent
- Read the existing `CONTEXT_REGISTRY.md` if present — do not re-discover what's already confirmed
- Apply MVP-first governance: smallest viable cut, explicit IN list, explicit OUT list with reasons and reconsider-triggers
- Apply the anti-overengineering checklist: no microservices, multi-region, queues, providers, abstractions unless justified
- Surface every overengineering alert in `RISKS_AND_ASSUMPTIONS.md`
- State the MVP hypothesis: "If we ship X to Y, we expect to observe Z within W"
- Define validation success criteria and kill criteria placeholders (Product Manager owns the final criteria post-launch)
- Produce or update `MVP_SCOPE.md` and refresh `ORCHESTRATOR_HANDOFF.md`
- Do NOT replace Product Manager — Product Manager owns post-launch validation, kill decisions, and full feature lifecycle

Execution mode behavior:
- AUTO: Standard MVP cut with overengineering checks
- FULL: Deep cut with phased deferral plan, validation hypotheses, kill-criteria placeholders, and downstream agent handoff for every deferred item
- LIGHT: Bare-bones IN/OUT cut with overengineering checklist — suitable for prototypes

Expected output:
- Updated `MVP_SCOPE.md`
- Updated overengineering alerts in `RISKS_AND_ASSUMPTIONS.md`
- Updated `INITIAL_ROADMAP.md` reflecting the new cut
- Refreshed `ORCHESTRATOR_HANDOFF.md`
- A `next_recommended_command` suggestion

Safety:
- Foundation Agent never finalizes architecture or schema — even when scope changes imply structural impact, route to System Architect with the updated bundle as input
- Anti-hallucination rules: do not invent integrations, infrastructure, or compliance to justify keeping items in scope
