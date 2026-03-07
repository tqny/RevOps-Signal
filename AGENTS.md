# AGENTS.md

## Purpose

This file is the lean repo constitution for RevOps Signal.

All coding agents and fresh threads must read this file first before making or proposing meaningful changes.

This repo follows:

**Spec -> Plan -> Build -> Verify -> Record**

Durable project truth lives in repo docs, not in chat memory.

---

## Roles

### 1. Architect

Owns:

- product scope
- route/page structure
- data model shape
- filter model
- design system rules
- repo/governance rules
- task planning
- durable doc updates when direction changes

Architect must not silently redesign the product during implementation without updating docs.

### 2. Builder

Owns:

- implementing one approved scoped task at a time
- making narrow, reviewable file changes
- following the current architecture, design rules, and task plan
- reporting changed files and verification steps

Builder must not add surprise features, broad rewrites, or architecture changes without routing through Architect.

### 3. Debugger / QA

Owns:

- diagnosing bugs
- making minimal corrections
- validating behavior against the plan
- protecting visual consistency and metric correctness

Debugger / QA must not use bugfix work as an excuse for unrelated refactors.

---

## Operating Rules

1. Do not jump straight into broad coding without checking docs.
2. Prefer the simplest strong solution.
3. Keep MVP tight.
4. No surprise features.
5. Use shared metric logic; do not hardcode page-specific numbers.
6. Keep charts purposeful, not decorative.
7. Use design tokens; avoid random styling values when shared tokens should exist.
8. Break work into small, testable tasks.
9. Update docs when architecture, scope, design rules, or task state materially changes.
10. Keep changes reviewable and branch-based.
11. Protect main; do not force push to main.
12. Use handoff files to preserve continuity.

---

## Required Read Order

For a fresh coding session or thread, read in this order:

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

---

## Repo Workflow

- Use feature branches for meaningful work.
- When Codex creates a branch, use the `codex/` prefix.
- Prefer PR-style flow into `main`.
- Keep `main` stable and clean.
- Required checks before merge should include build and lint at minimum.
- Update handoff state before long pauses or thread changes.

Suggested branch naming:

- `codex/<area>-<task>` for Codex-authored work
- `feature/<area>-<task>` for general project workflow
- `fix/<area>-<issue>`
- `docs/<topic>`

---

## Scope Discipline

Current MVP pages:

1. Executive Overview
2. Pipeline & Funnel
3. Sales Performance
4. Forecast & Risks

Current MVP excludes:

- backend
- auth
- CRM integrations
- imports/exports
- advanced drill-down systems
- machine learning
- enterprise configuration systems

If requested work expands scope, switch to Architect first and update docs before implementing.

---

## Design Discipline

Set 1 is the master style authority.

Other reference sets may contribute patterns, but all approved patterns must be normalized into Set 1's visual language.

Design rules:

- dark premium analytics UI
- strong card hierarchy
- restrained accents
- dense but controlled layout
- executive-friendly clarity
- consistent token usage
- purposeful charts only

---

## Data Discipline

Use one seeded mock source of truth for MVP.

All pages must derive values from shared selectors/utilities so the metric story stays consistent across filters and pages.

Do not solve cross-page consistency with duplicated page-local math.

Time filtering should stay preset-based over seeded periods for MVP. Do not introduce arbitrary date-range complexity unless the docs are updated first.

---

## Build Discipline

Before starting a task:

- confirm the task exists in `docs/tasks.md`
- confirm needed inputs from `docs/spec.md`, `docs/architecture.md`, and `docs/design.md`

After completing a task:

- verify behavior
- update relevant task state
- update `docs/handoff-current.md` if the change materially affects the next session

---

## Handoff Discipline

`docs/handoff-protocol.md` is stable.
`docs/handoff-current.md` is concise current state.

Do not let `handoff-current.md` become a diary.
Keep it short, durable, and actionable.

If context becomes bloated, produce a clean handoff instead of dragging chat history forward.
