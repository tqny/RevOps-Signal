import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getOverviewSnapshot } from '../data/selectors';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatDays,
  formatPercentage,
} from '../lib/formatters';

export function ExecutiveOverviewPage() {
  const { filters } = useFilters();
  const overview = getOverviewSnapshot(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Overview"
        title="Executive Overview"
        description="The four-page story is now running on seeded local data and one selector layer. This page surfaces the top-line revenue picture without hardcoded metrics."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricTile
          label="Open pipeline"
          value={formatCompactCurrency(overview.pipelineAmount)}
          detail={`${formatCount(overview.openOpportunityCount)} open opportunities in the current visible scope.`}
          tone="accent"
        />
        <MetricTile
          label="Weighted forecast"
          value={formatCompactCurrency(overview.weightedForecastAmount)}
          detail={`Includes ${formatCompactCurrency(overview.closedWonAmount)} already closed-won in the selected horizon.`}
          tone={
            overview.weightedForecastAmount >= overview.targetAmount
              ? 'success'
              : 'warning'
          }
        />
        <MetricTile
          label="Coverage vs target"
          value={formatPercentage(overview.coverageRatio)}
          detail={`Visible target is ${formatCompactCurrency(overview.targetAmount)} for the current filter scope.`}
          tone={overview.coverageRatio >= 1.1 ? 'success' : 'warning'}
        />
        <MetricTile
          label="Win rate"
          value={formatPercentage(overview.winRate)}
          detail={`Average deal size ${formatCompactCurrency(overview.averageDealSize)} • cycle ${formatDays(overview.averageCycleDays)}.`}
          tone={overview.winRate >= 0.5 ? 'success' : 'warning'}
        />
      </section>

      {!overview.hasResults ? (
        <SurfaceCard title="Overview">
          <EmptyState
            title="No opportunities match the current filters"
            description="Reset one or more filters to restore the current-quarter overview."
          />
        </SurfaceCard>
      ) : (
        <>
          <section className="grid gap-4 2xl:grid-cols-[1.15fr,0.85fr]">
            <SurfaceCard
              title="Quarter trend snapshot"
              description="Trend points are already selector-backed, even though chart styling is intentionally deferred to the page implementation task."
            >
              <div className="space-y-3">
                {overview.trend.map((point) => (
                  <div
                    key={point.periodId}
                    className="grid gap-3 rounded-soft border border-white/8 bg-surface-alt/60 px-4 py-4 sm:grid-cols-[120px,1fr,1fr,1fr]"
                  >
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {point.label}
                      </p>
                      <p className="text-xs text-text-muted">
                        {formatCount(point.opportunityCount)} deals
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                        Pipeline
                      </p>
                      <p className="mt-1 text-sm text-text-primary">
                        {formatCompactCurrency(point.pipelineAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                        Weighted
                      </p>
                      <p className="mt-1 text-sm text-text-primary">
                        {formatCompactCurrency(point.weightedForecastAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.18em] text-text-muted">
                        Closed won
                      </p>
                      <p className="mt-1 text-sm text-text-primary">
                        {formatCompactCurrency(point.closedWonAmount)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Signals"
              description="Short narrative callouts derived from the same filtered subset shown in the KPI strip."
            >
              <div className="space-y-3">
                {overview.signals.map((signal) => (
                  <div
                    key={signal.id}
                    className="rounded-soft border border-white/8 bg-surface-alt/60 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text-primary">
                        {signal.title}
                      </p>
                      <StatusBadge variant={signal.tone}>
                        {signal.tone}
                      </StatusBadge>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {signal.description}
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-2">
            <SurfaceCard
              title="Segment mix"
              description="Composition is now real data. Visual chart treatment can be layered on later without changing the underlying math."
            >
              <div className="space-y-4">
                {overview.segmentMix.map((segment) => (
                  <ProgressBar
                    key={segment.id}
                    label={segment.label}
                    value={segment.share}
                    total={1}
                    valueLabel={formatCompactCurrency(segment.amount)}
                    detail={`${formatCount(segment.count)} opportunities • ${formatPercentage(segment.share)} share`}
                    tone="accent"
                  />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Top rep forecast coverage"
              description="Reps are ranked from the shared performance rollup, not from page-local sorting logic."
            >
              {overview.topRepRows.length === 0 ? (
                <EmptyState
                  title="No rep coverage in the current scope"
                  description="Change the filters or move to a broader scope."
                />
              ) : (
                <div className="space-y-4">
                  {overview.topRepRows.map((row) => (
                    <ProgressBar
                      key={row.ownerId}
                      label={row.ownerName}
                      value={row.forecastAttainmentRate}
                      total={1}
                      valueLabel={formatCompactCurrency(
                        row.weightedForecastAmount,
                      )}
                      detail={`${formatPercentage(row.forecastAttainmentRate)} of ${formatCompactCurrency(row.quotaAmount)} target`}
                      tone={
                        row.forecastAttainmentRate >= 1
                          ? 'success'
                          : row.forecastAttainmentRate >= 0.8
                            ? 'accent'
                            : 'warning'
                      }
                    />
                  ))}
                </div>
              )}
            </SurfaceCard>
          </section>
        </>
      )}
    </div>
  );
}
