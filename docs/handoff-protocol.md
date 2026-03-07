# RevOps Signal - Handoff Protocol

## 1. Purpose

This file defines the stable handoff method for continuing the project across fresh threads, coding agents, or sessions.

The project workflow is:

**Spec -> Plan -> Build -> Verify -> Record**

Docs are the durable source of truth.
Chat is temporary.

## 2. Role Constitution

### Architect

Use Architect when work changes:

- scope
- route structure
- data model
- filter model
- design rules
- repo/governance rules
- task plan

### Builder

Use Builder when work is a scoped implementation of an approved task.

### Debugger / QA

Use Debugger / QA when:

- behavior is broken
- metrics are inconsistent
- layouts regress
- interactions fail
- rendering is unstable

## 3. Role Switching Rules

Switch to Architect first if a request changes:

- architecture
- workflow
- design system
- feature scope
- page map
- data flow

Switch to Debugger / QA first if a bug appears during implementation.

Return to Builder only after the task is clear again.

## 4. Required Read Order for Fresh Sessions

1. `AGENTS.md`
2. `docs/handoff-protocol.md`
3. `docs/handoff-current.md`
4. `docs/spec.md`
5. `docs/architecture.md`
6. `docs/tasks.md`
7. `docs/design.md`
8. `docs/decisions.md`
9. `docs/qa-checklist.md`
10. `design-criteria.jsonc`
11. `developer-brief.md`

## 5. What Must Be Preserved

Always preserve:

- four-page MVP scope unless docs are intentionally updated
- shared data source-of-truth model
- shared derivation logic
- Set 1 as master style authority
- governed branch-based workflow
- small, reviewable tasks
- docs as durable memory

## 6. What Should Not Be Carried Forward

Do not drag forward:

- exploratory chatter
- outdated alternatives that were rejected
- speculative phase-2 ideas as if they were approved scope
- implementation tangents that never became doc truth

## 7. When to Refresh Handoff State

Update `docs/handoff-current.md`:

- after scaffold completion
- after filter/data layer completion
- after each major page implementation
- before switching threads
- before a long pause

## 8. Design Synthesis Continuity

Design references are inputs, not instructions to imitate literally.

Rules:

- Set 1 controls style authority
- other sets may contribute patterns
- all selected patterns must be normalized into Set 1 visual language
- subject-matter semantics from references should not be copied blindly

## 9. Repo / Governance Continuity

Expected workflow:

- feature branches
- PR-style merges into `main`
- no force pushes to `main`
- build/lint checks before merge
- docs/handoff updates when materially needed

## 10. Token Discipline

If context gets bloated:

- summarize
- update docs/handoff
- continue from durable files instead of rehashing chat history
