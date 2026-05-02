# Context Discovery

## Purpose

Fill specific context gaps mid-flight — during feature planning, bug analysis, refactor, production readiness, onboarding, or technical audit — without forcing a full re-discovery.

## When to Use

- A feature request lacks a clear problem statement
- A bug report lacks reproduction or scope context
- An architecture discussion is proceeding on unverified assumptions
- A refactor lacks a clear motivating constraint
- A production readiness review surfaces undocumented behavior
- The orchestrator detects that required context is below the threshold for safe specialist work
- A new contributor needs validated project context before contributing

## What It Does

Invokes the orchestrator and routes to the **Interactive Discovery & Project Foundation Agent** in CONTEXT_DISCOVERY mode. Produces a delta against the existing `CONTEXT_REGISTRY.md` rather than a full foundation bundle. Updates `OPEN_QUESTIONS.md`, appends to `DISCOVERY_LOG.md`, and refreshes `ORCHESTRATOR_HANDOFF.md`.

This is the lightest weight foundation invocation — it does NOT re-frame the project; it only fills the gap that triggered it.

---

## Prompt

Use the Universal Production AI Agent Orchestrator.

Mode: $MODE (default AUTO)
Task:
Fill the following context gap: $ARGUMENTS

Classification: CONTEXT_DISCOVERY

Required behavior:
- Route to the Interactive Discovery & Project Foundation Agent in CONTEXT_DISCOVERY mode
- Read the existing `CONTEXT_REGISTRY.md` first — do not duplicate already-confirmed context
- Identify the specific gap that triggered this round (missing problem statement, missing user persona, untracked assumption, conflicting signal, etc.)
- Ask AT MOST 3 high-value questions, multiple-choice format
- Honor anti-hallucination rules
- Append the round to `DISCOVERY_LOG.md`
- Update `CONTEXT_REGISTRY.md` with new confirmed / inferred / assumed entries
- Update `OPEN_QUESTIONS.md` if anything is still pending
- Refresh `ORCHESTRATOR_HANDOFF.md` so the original task can resume with validated context
- Do NOT touch `PROJECT_BRIEF`, `MVP_SCOPE`, `INITIAL_ROADMAP`, or `MODULE_MAP` unless the gap directly invalidates them

Execution mode behavior:
- AUTO: Targeted context fill with 1-3 questions
- FULL: Wider sweep — verify adjacent context that may also be stale or assumed
- LIGHT: Single-question context fill — fastest, suitable for tiny gaps

Expected output:
- Updated `CONTEXT_REGISTRY.md`
- Appended `DISCOVERY_LOG.md` entry
- Updated `OPEN_QUESTIONS.md` (if pending) or new converted-assumption entry
- Refreshed `ORCHESTRATOR_HANDOFF.md`
- A `next_recommended_command` to resume the original task

Safety:
- Never block on questions the user has signaled they want to defer — convert to assumption with explicit risk classification
- If the discovered gap exposes a foundation-level problem (e.g., the project's MVP cut was wrong), escalate to `/tasks/project-foundation` or `/tasks/mvp-structuring`
- Anti-hallucination rules cannot be disabled
