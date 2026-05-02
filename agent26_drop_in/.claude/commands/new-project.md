# New Project Guide

You are starting work in a project that may be new or unfamiliar. This guide recommends the safest and most effective sequence for onboarding before doing real work.

---

## Recommended First Steps

Run these in order. Each step builds context for the next. **Step 0 applies when there is no codebase yet** — when you're starting from an idea instead of an existing repo.

| Step | Command | Why |
|---|---|---|
| 0 | `/tasks/project-foundation` | **Idea-stage / no codebase yet.** Frame the problem, cut the MVP, surface assumptions and risks, prepare a structured handoff to downstream agents. |
| 1 | `/bootstrap` | Quick repo scan — detect stack, structure, key areas, and risk zones in seconds |
| 2 | `/tasks/project-discovery` | Deep orchestrator-driven analysis — architecture map, security-sensitive areas, testing gaps, documentation gaps |
| 3 | `/tasks/architecture-review` | If bootstrap or discovery revealed structural complexity, review architecture before touching code |
| 4 | `/doctor` | Verify the agent command system itself is complete and ready to use |

You do not need all five every time. Use your judgment:

- **Idea-stage, no code yet** → start at step 0, then step 4
- **Completely unfamiliar repo with code** → start at step 1, do steps 1–4
- **Somewhat familiar, need a refresh** → start at step 1 or 2
- **Know the repo, first time using the agent system** → start at step 4
- **Existing project but unclear scope or vague requirements** → use `/tasks/mvp-structuring` or `/tasks/context-discovery`

---

## When to Use Each

**`/bootstrap`** — Fastest first step. Scans repo structure, detects stack, flags obvious risk areas. Takes seconds. Gives you enough context to decide what to do next. Start here.

**`/tasks/project-discovery`** — Deep analysis through the orchestrator. Produces a full project understanding: architecture map, modules, risk areas, security-sensitive zones, testing gaps, and prioritized next reviews. Use after bootstrap when you need thorough context.

**`/tasks/architecture-review`** — Focused architecture analysis. Use when bootstrap or discovery revealed structural complexity, unclear boundaries, or design concerns. Not needed for simple projects.

**`/doctor`** — Checks the agent system itself, not the project. Verifies all commands, squads, and agents are present and consistent. Run once to confirm the tooling works before relying on it.

---

## What NOT to Do First

Do not jump into these commands before understanding the project:

| Command | Why it's premature |
|---|---|
| `/tasks/bug` | Without project context, root-cause analysis will be shallow and may miss systemic issues |
| `/tasks/feature` | Without architecture context, new features risk violating existing patterns or boundaries |
| `/tasks/security` | Without understanding auth/data/infra design, security review lacks targeting — it becomes a generic checklist |
| `/tasks/sql-review` | Without schema context, SQL review cannot assess migration risk or access policy impact |
| `/squads/*` | Squads are powerful but expensive — they activate multiple agents. Use after discovery narrows the scope |

The orchestrator will run discovery automatically when context is weak, but giving it a head start with `/bootstrap` or `/tasks/project-discovery` produces better results.

---

## Fast Path

Already know the repo and what you need?

- **`/start`** — Describe your goal in natural language, get routed to the right command
- **`/run`** — Execute a task or squad directly with validation gates
- **`/smart-run`** — Let the system classify your intent and pick the best path

These skip onboarding and go straight to execution.

---

What do you want to do first?
