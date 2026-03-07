# RevOps Signal - Decision Log

## D-001: Four-page MVP

Chosen:

- Executive Overview
- Pipeline & Funnel
- Sales Performance
- Forecast & Risks

Reason:
This supports a coherent business story without overexpanding scope.

## D-002: React + TypeScript + Vite

Reason:
Fast, strong, beginner-friendly, and appropriate for a portfolio dashboard.

## D-003: Tailwind for styling

Reason:
Fast iteration and good fit for tokenized dashboard implementation.

## D-004: Recharts for visualization

Reason:
Adequate for MVP visual needs without heavy complexity.

## D-005: Seeded local data only for MVP

Reason:
Keeps scope lean while preserving realistic metric derivation practice.

## D-006: Shared derivation layer

Reason:
Cross-page metric consistency is a core product requirement.

## D-007: Set 1 as master style authority

Reason:
It provides the strongest transferable premium visual language.

## D-008: No heavy state library in MVP

Reason:
Global filters + derived selectors do not justify extra complexity yet.

## D-009: Governance-lite but serious git workflow

Reason:
This is a solo project but should still look disciplined and reviewable.

## D-010: Route-based multi-page app instead of one long dashboard

Reason:
The project goal emphasizes narrative separation across business questions.

## D-011: Preset-based timeframe filtering

Reason:
Seeded period presets are enough for MVP and avoid unnecessary date-picker complexity.

## D-012: Custom lightweight UI primitives first

Reason:
The scaffold only needs shells, cards, nav, and filters; a broader component library would add setup cost before it adds value.

## D-013: Segment-aware quota snapshots in local seed data

Reason:
Segment filters are part of the shared model, so target and attainment math needed a coherent way to remain meaningful when the visible opportunity subset narrows by segment.
