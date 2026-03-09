import { StatusBadge } from '../components/ui/StatusBadge';
import { SurfaceCard } from '../components/ui/SurfaceCard';

const summaryCards = [
  {
    title: 'What this project is',
    body: 'A desktop-first RevOps dashboard MVP that uses seeded GTM data to simulate how leadership reviews pipeline health, rep execution, and forecast risk across connected routes.',
  },
  {
    title: 'Why it was built',
    body: 'To practice disciplined AI-assisted product development with planning, shared metric logic, durable docs, and a believable internal-tool presentation instead of a disconnected chart gallery.',
  },
  {
    title: 'What problem it addresses',
    body: 'Many dashboard demos look polished but do not reconcile. RevOps Signal focuses on one shared source of truth so reviewers can trace how pipeline, conversion, performance, and forecast confidence relate.',
  },
];

const systemSteps = [
  {
    step: '01',
    title: 'Seed one believable RevOps dataset',
    body: 'Local mock entities cover periods, regions, segments, teams, reps, quota snapshots, and opportunities so the metric story stays plausible without adding backend scope.',
  },
  {
    step: '02',
    title: 'Apply one shared filter model',
    body: 'Timeframe, segment, region, team, and rep filters are centralized so every route reacts to the same visible business slice.',
  },
  {
    step: '03',
    title: 'Derive metrics through shared selectors',
    body: 'KPI, funnel, performance, forecast, and risk views come from the same filtered subset instead of page-local math.',
  },
  {
    step: '04',
    title: 'Use routes to separate business questions',
    body: 'Each page answers a different leadership question while staying tied to the same underlying system model.',
  },
];

const scopeIncluded = [
  'Executive Overview, Pipeline & Funnel, Sales Performance, and Forecast & Risks',
  'Shared filters across every analytics route',
  'Selector-backed KPI, funnel, performance, and forecast logic',
  'Purposeful charts, tables, and empty-state handling',
  'A reviewer-facing About surface inside the product shell',
];

const scopeExcluded = [
  'Backend services or production persistence',
  'Authentication, permissions, or CRM integrations',
  'CSV import, exports, or report-generation workflows',
  'Advanced drill-down systems or enterprise configuration',
  'Machine learning or predictive modeling beyond deterministic mock logic',
];

const judgmentCards = [
  {
    title: 'Product framing',
    body: 'The build treats route structure as part of the story, keeping each page focused on one executive question instead of collapsing everything into one overloaded dashboard.',
  },
  {
    title: 'Metric discipline',
    body: 'Cross-page numbers are intentionally derived from shared selectors so the dashboard can be reviewed for consistency, not just styling.',
  },
  {
    title: 'Design adaptation',
    body: 'The interface borrows transferable dashboard patterns while normalizing everything into one restrained visual system instead of copying a reference brand literally.',
  },
  {
    title: 'Execution hygiene',
    body: 'The repo is structured for reviewable iteration with task planning, handoff docs, verification steps, and branch-based workflow rather than one-off demo hacking.',
  },
];

const reviewPath = [
  'Start on Executive Overview to get the top-line health scan and the connected signals.',
  'Move to Pipeline & Funnel to see whether coverage is credible or leaking before close.',
  'Check Sales Performance to compare attainment, win rate, velocity, and ownership patterns.',
  'Finish on Forecast & Risks to verify that confidence, gap, and downside signals align with the earlier routes.',
  'Change the shared filters along the way and confirm that the story updates consistently across pages.',
];

function AboutHeader() {
  return (
    <header className="rounded-panel border border-white/8 bg-surface/85 p-6 shadow-panel backdrop-blur-sm">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div className="max-w-4xl space-y-3">
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-accent-secondary">
            About This Project
          </p>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-text-primary xl:text-[2.4rem]">
              RevOps Signal is a portfolio-grade internal analytics simulation.
            </h1>
            <p className="max-w-3xl text-sm leading-6 text-text-secondary">
              It exists to show how a small RevOps product can stay coherent
              across routing, filters, metrics, and design choices without
              inflating scope. This page is the reviewer-facing orientation
              layer for the project.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge variant="accent">Reviewer surface</StatusBadge>
          <StatusBadge variant="success">Shared metric story</StatusBadge>
          <StatusBadge variant="neutral">Scoped MVP</StatusBadge>
        </div>
      </div>
    </header>
  );
}

function SummaryCard({
  title,
  body,
}: {
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-soft border border-white/8 bg-surface-alt/65 p-5">
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-text-secondary">{body}</p>
    </div>
  );
}

function SystemStepCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-soft border border-white/8 bg-surface-alt/65 p-5">
      <div className="flex items-center gap-3">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-soft border border-accent-primary/30 bg-accent-primary/12 text-xs font-semibold tracking-[0.18em] text-accent-secondary">
          {step}
        </span>
        <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-text-secondary">{body}</p>
    </div>
  );
}

function ScopeList({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: 'accent' | 'warning';
}) {
  return (
    <div
      className={
        tone === 'accent'
          ? 'rounded-soft border border-accent-primary/18 bg-accent-primary/8 p-5'
          : 'rounded-soft border border-warning/18 bg-warning/8 p-5'
      }
    >
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm leading-6 text-text-secondary">
        {items.map((item) => (
          <li key={item} className="flex gap-3">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-current" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function AboutProjectPage() {
  return (
    <div className="space-y-6">
      <AboutHeader />

      <SurfaceCard
        title="Short assessment"
        description="What was missing was not more analytics content. It was reviewer orientation inside the product itself. The dashboard already explained revenue signals, but it did not explain the project framing, simulation model, scope boundaries, or the judgment behind the build."
        footer="Best-fit placement: a dedicated About route in the existing shell. It matches the route-based information architecture, keeps substantial reviewer content out of transient UI, and avoids muddying the four analytics pages with meta-explanation."
      >
        <div className="grid gap-4 xl:grid-cols-3">
          {summaryCards.map((card) => (
            <SummaryCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </SurfaceCard>

      <SurfaceCard
        title="How it works"
        description="The system is intentionally simple: one local dataset, one shared filter model, one derivation layer, and four narrative analytics routes."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {systemSteps.map((item) => (
            <SystemStepCard
              key={item.step}
              step={item.step}
              title={item.title}
              body={item.body}
            />
          ))}
        </div>
      </SurfaceCard>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.15fr)_minmax(360px,0.85fr)]">
        <SurfaceCard
          title="Scope discipline"
          description="The point of the MVP is to show coherent product judgment, not to simulate a full BI platform."
        >
          <div className="grid gap-4 xl:grid-cols-2">
            <ScopeList
              title="Included in this MVP"
              items={scopeIncluded}
              tone="accent"
            />
            <ScopeList
              title="Intentionally left out"
              items={scopeExcluded}
              tone="warning"
            />
          </div>
        </SurfaceCard>

        <SurfaceCard
          title="Suggested review path"
          description="A strong review should test both narrative clarity and cross-page consistency."
        >
          <ol className="space-y-4 text-sm leading-6 text-text-secondary">
            {reviewPath.map((step, index) => (
              <li key={step} className="flex gap-4">
                <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-pill border border-white/8 bg-surface-alt/80 text-xs font-semibold text-text-primary">
                  {index + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </SurfaceCard>
      </section>

      <SurfaceCard
        title="What this project demonstrates"
        description="The technical signal is not just that the UI renders. It is that the product stays disciplined under constraints."
      >
        <div className="grid gap-4 xl:grid-cols-2">
          {judgmentCards.map((card) => (
            <SummaryCard key={card.title} title={card.title} body={card.body} />
          ))}
        </div>
      </SurfaceCard>
    </div>
  );
}
