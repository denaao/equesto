# Project Foundation

## Purpose

Frame a new project (or re-frame a fragmented one) before architecture, database, security, or implementation decisions are finalized.

## When to Use

- Starting a new project from an idea or partial requirements
- Re-framing an existing project where the problem statement, MVP scope, or target users are unclear
- Before invoking System Architect, Data Engineer, RLS Specialist, Threat Model, or Tech Lead on an idea-stage request
- When the orchestrator reports that project context is too weak for specialist work

## What It Does

Invokes the orchestrator and routes to the **Interactive Discovery & Project Foundation Agent (file `agents/26_project_foundation_agent.md`)**. Produces the standard foundation bundle: `PROJECT_BRIEF`, `MVP_SCOPE`, `INITIAL_ROADMAP`, `MODULE_MAP`, `RISKS_AND_ASSUMPTIONS`, `OPEN_QUESTIONS`, `CONTEXT_REGISTRY`, `DISCOVERY_LOG`, and an `ORCHESTRATOR_HANDOFF` payload the orchestrator consumes as authoritative project context.

---

## Prompt

Use the Universal Production AI Agent Orchestrator.

Mode: $MODE (default AUTO)
Task:
Run project foundation on the following: $ARGUMENTS

Classification: PROJECT_FOUNDATION (and PRE_PROJECT_DISCOVERY if no codebase yet)

Required behavior:
- Route to the Interactive Discovery & Project Foundation Agent
- Run the mandatory Discovery Phase before producing any structure
- Separate every claim into CONFIRMED / INFERRED / ASSUMED / MISSING / CONFLICTING
- Ask ONLY high-value questions — never more than 3 per round, multiple-choice format with a recommended option
- Honor anti-hallucination rules: never invent business rules, integrations, infrastructure, scale, or compliance
- Honor MVP-first governance: smallest viable cut, explicit deferrals, anti-overengineering checklist
- Honor complexity control: justify every non-trivial module, abstraction, service
- Produce the full foundation bundle in the project's `discovery/` folder (or another agreed location)
- Produce the `ORCHESTRATOR_HANDOFF.md` payload — this is the contract with the orchestrator
- Do NOT finalize architecture, schema, RLS policies, security implementation, infrastructure, or production code — those route to their respective specialists with the foundation bundle as input

Execution mode behavior:
- AUTO: Adaptive depth — full discovery only if context is weak. Standard handoff bundle.
- FULL: Maximum rigor — deep business, technical, operational discovery. Every output artifact produced. Suitable for production systems, multi-tenant SaaS, regulated domains, high-cost commitments.
- LIGHT: Quick MVP framing only — `PROJECT_BRIEF`, `MVP_SCOPE`, `OPEN_QUESTIONS`, `ORCHESTRATOR_HANDOFF`. Suitable for prototypes, hackathons, internal tools.

Expected output:
- Foundation bundle (files listed above) created in `discovery/`
- `ORCHESTRATOR_HANDOFF.md` payload returned to the orchestrator
- A `next_recommended_command` suggestion (typically `/tasks/architecture-review`, `/squads/architecture-squad`, or `/tasks/feature` once foundation is ready)

Safety:
- Foundation Gate is mandatory for new projects
- Anti-hallucination rules cannot be disabled in any mode
- Foundation Agent never replaces or bypasses other safety gates — it ensures they receive validated input
- If Foundation Agent reports `status: blocked`, halt downstream specialist work until the blocker resolves
