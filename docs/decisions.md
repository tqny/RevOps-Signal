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

## D-014: Reviewer orientation lives as a dedicated in-product route

Reason:
The project needs a portfolio-grade explanation layer, but that content is too substantial for a modal or tab and should not dilute the four analytics pages. A dedicated About route preserves the existing route-based structure while giving reviewers clear framing inside the product.

## D-015: Repo-native responsive browser QA with managed Chromium

Reason:
Fresh threads should not have to rediscover browser installation, preview boot, or screenshot/report capture steps. A scripted Playwright workflow keeps responsive QA repeatable inside the repo and aligned with the current MVP routes.

## D-016: Mock business is Eagle-AI, an AI compliance and governance SaaS company

Reason:
The dashboard needed a believable operating context that fits the existing enterprise-weighted segment ladder, regulated-buyer motion, and reviewer-facing product framing better than a generic SaaS placeholder.

## D-017: Opportunity amount represents first-year contract value

Reason:
The current model only needs one comparable deal-value field. Treating `amount` as first-year contract value, including onboarding and implementation, keeps the dataset credible without introducing a deeper pricing or services schema.

## D-018: Preserve the current opportunity lifecycle model for seed expansion

Reason:
The existing selectors and pages already rely on a clean separation between active stage, forecast category, and closed outcome. Future seed expansion should add realism through better distributions, not through stage-model changes.
