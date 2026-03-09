import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getOverviewSnapshot } from '../data/selectors';
import {
  OverviewMixChart,
  OverviewTrendChart,
} from '../features/overview/OverviewCharts';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatDays,
  formatPercentage,
  formatSignedCompactCurrency,
} from '../lib/formatters';
import { cn } from '../lib/utils';
import type {
  OverviewSignal,
  PerformanceRow,
  SignalTone,
} from '../types/revops';

function getCoverageTone(rate: number) {
  if (rate >= 1) {
    return 'success';
  }

  if (rate >= 0.8) {
    return 'accent';
  }

  return 'warning';
}

function getCoverageBarClass(rate: number) {
  if (rate >= 1) {
    return 'bg-success/80';
  }

  if (rate >= 0.8) {
    return 'bg-accent-primary/80';
  }

  return 'bg-warning/80';
}

function getSignalSurfaceClass(tone: SignalTone) {
  return {
    success: 'border-success/20 bg-success/8',
    warning: 'border-warning/20 bg-warning/10',
    danger: 'border-danger/20 bg-danger/10',
    neutral: 'border-white/8 bg-surface-alt/55',
  }[tone];
}

type SummaryStatTone = 'accent' | 'neutral' | 'success' | 'warning';

function SummaryStat({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail: string;
  tone?: SummaryStatTone;
}) {
  return (
    <div
      className={cn(
        'rs-inset-panel rounded-soft px-4 py-4',
        tone === 'accent' && 'border-accent-primary/18 bg-accent-primary/8',
        tone === 'success' && 'border-success/18 bg-success/8',
        tone === 'warning' && 'border-warning/18 bg-warning/8',
        tone === 'neutral' && 'border-white/8 bg-surface-alt/45',
      )}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold tracking-tight text-text-primary">
        {value}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">{detail}</p>
    </div>
  );
}

function SignalCard({ signal }: { signal: OverviewSignal }) {
  return (
    <div
      className={cn(
        'rs-inset-panel rounded-soft px-4 py-4',
        getSignalSurfaceClass(signal.tone),
      )}
    >
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-primary">{signal.title}</p>
        <StatusBadge variant={signal.tone}>{signal.tone}</StatusBadge>
      </div>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {signal.description}
      </p>
    </div>
  );
}

function CoverageCell({ row }: { row: PerformanceRow }) {
  return (
    <div className="min-w-[180px] space-y-2">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-primary">
          {formatPercentage(row.forecastAttainmentRate)}
        </p>
        <StatusBadge variant={getCoverageTone(row.forecastAttainmentRate)}>
          {row.forecastAttainmentRate >= 1
            ? 'On track'
            : row.forecastAttainmentRate >= 0.8
              ? 'Working'
              : 'Gap'}
        </StatusBadge>
      </div>
      <div className="h-2 overflow-hidden rounded-pill bg-surface">
        <div
          className={cn(
            'h-full rounded-pill transition-all',
            getCoverageBarClass(row.forecastAttainmentRate),
          )}
          style={{
            width: `${Math.min(row.forecastAttainmentRate * 100, 100)}%`,
          }}
        />
      </div>
      <p className="text-xs text-text-muted">
        {formatCompactCurrency(row.weightedForecastAmount)} of{' '}
        {formatCompactCurrency(row.quotaAmount)} target
      </p>
    </div>
  );
}

export function ExecutiveOverviewPage() {
  const { filters } = useFilters();
  const overview = getOverviewSnapshot(filters);
  const hasOverviewResults = overview.hasResults;
  const topSegment = overview.segmentMix[0];
  const topRegion = overview.regionMix[0];
  const isForecastAboveTarget = overview.forecastGapAmount <= 0;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Revenue Health"
        title="Executive Overview"
        description="A top-line scan of pipeline health, forecast pacing, and mix concentration for the currently visible quarter. Every number on this page comes from the shared filter and selector layer."
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricTile
          label="Open pipeline"
          value={
            hasOverviewResults
              ? formatCompactCurrency(overview.pipelineAmount)
              : 'No data'
          }
          detail={
            hasOverviewResults
              ? `${formatCount(overview.openOpportunityCount)} active opportunities in the current visible scope.`
              : 'No opportunities are visible in the current filter scope.'
          }
          tone={hasOverviewResults ? 'accent' : 'neutral'}
          statusLabel={hasOverviewResults ? undefined : 'No data'}
          isPlaceholder={!hasOverviewResults}
        />
        <MetricTile
          label="Weighted forecast"
          value={
            hasOverviewResults
              ? formatCompactCurrency(overview.weightedForecastAmount)
              : 'No data'
          }
          detail={
            hasOverviewResults
              ? `Includes ${formatCompactCurrency(overview.closedWonAmount)} already booked in ${overview.timeframe.label.toLowerCase()}.`
              : 'Forecast pacing appears once the current slice contains visible revenue data.'
          }
          tone={
            hasOverviewResults
              ? isForecastAboveTarget
                ? 'success'
                : 'warning'
              : 'neutral'
          }
          statusLabel={hasOverviewResults ? undefined : 'No data'}
          isPlaceholder={!hasOverviewResults}
        />
        <MetricTile
          label="Coverage vs target"
          value={hasOverviewResults ? formatPercentage(overview.coverageRatio) : 'No data'}
          detail={
            hasOverviewResults
              ? `Visible target is ${formatCompactCurrency(overview.targetAmount)} for the active filter scope.`
              : 'Coverage needs visible target and opportunity data in the current filter scope.'
          }
          tone={
            hasOverviewResults
              ? overview.coverageRatio >= 1.1
                ? 'success'
                : 'warning'
              : 'neutral'
          }
          statusLabel={hasOverviewResults ? undefined : 'No data'}
          isPlaceholder={!hasOverviewResults}
        />
        <MetricTile
          label="Win rate"
          value={hasOverviewResults ? formatPercentage(overview.winRate) : 'No data'}
          detail={
            hasOverviewResults
              ? `Average deal size ${formatCompactCurrency(overview.averageDealSize)} with a ${formatDays(overview.averageCycleDays)} won cycle.`
              : 'Win-rate and cycle benchmarks appear once the current slice contains opportunity history.'
          }
          tone={
            hasOverviewResults
              ? overview.winRate >= 0.5
                ? 'success'
                : 'warning'
              : 'neutral'
          }
          statusLabel={hasOverviewResults ? undefined : 'No data'}
          isPlaceholder={!hasOverviewResults}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(320px,0.9fr)]">
        <SurfaceCard
          title="Quarter pacing"
          description="Open pipeline bars show remaining volume by month. Forecast, target pace, and booked revenue stay tied to the same selector-backed timeframe."
        >
          {hasOverviewResults ? (
            <div className="space-y-5">
              <div className="flex flex-col gap-4 2xl:flex-row 2xl:items-start 2xl:justify-between">
                <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3 xl:flex-1">
                  <SummaryStat
                    label="Visible target"
                    value={formatCompactCurrency(overview.targetAmount)}
                    detail={`${overview.timeframe.label} quota in the current filtered scope.`}
                  />
                  <SummaryStat
                    label="Forecast delta"
                    value={formatSignedCompactCurrency(
                      -overview.forecastGapAmount,
                    )}
                    detail="Weighted forecast against visible target."
                    tone={isForecastAboveTarget ? 'success' : 'warning'}
                  />
                  <SummaryStat
                    label="Booked now"
                    value={formatCompactCurrency(overview.closedWonAmount)}
                    detail={`${formatPercentage(
                      overview.targetAmount > 0
                        ? overview.closedWonAmount / overview.targetAmount
                        : 0,
                    )} of target already closed won.`}
                    tone="accent"
                  />
                </div>
                <StatusBadge
                  variant={isForecastAboveTarget ? 'success' : 'warning'}
                >
                  {isForecastAboveTarget
                    ? 'Forecast running above visible target'
                    : 'Forecast still below visible target'}
                </StatusBadge>
              </div>

              <OverviewTrendChart data={overview.trend} />
            </div>
          ) : (
            <EmptyState
              title="No opportunities match the current filters"
              description="Broaden the current slice to restore pacing, forecast, and booked-revenue context."
              minHeight={320}
            />
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Executive signals"
          description="Short callouts for the current filter slice so the page reads like a business narrative, not just a metric dump."
        >
          {hasOverviewResults ? (
            <>
              <div className="space-y-5">
                {overview.signals.map((signal) => (
                  <SignalCard key={signal.id} signal={signal} />
                ))}
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                <SummaryStat
                  label="Leading segment"
                  value={topSegment?.label ?? 'No segment'}
                  detail={
                    topSegment
                      ? `${formatPercentage(topSegment.share)} of visible book`
                      : 'No segment mix available'
                  }
                  tone="accent"
                />
                <SummaryStat
                  label="Leading region"
                  value={topRegion?.label ?? 'No region'}
                  detail={
                    topRegion
                      ? `${formatCompactCurrency(topRegion.amount)} in visible scope`
                      : 'No regional mix available'
                  }
                />
                <SummaryStat
                  label="Visible scope"
                  value={formatCount(overview.opportunityCount)}
                  detail={`${formatCount(overview.openOpportunityCount)} open deals across the current filters.`}
                  tone="success"
                />
              </div>
            </>
          ) : (
            <EmptyState
              title="Signals return when the visible slice has data"
              description="This panel stays in place so the page layout is stable, but there is no current revenue story to summarize."
              minHeight={320}
            />
          )}
        </SurfaceCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <SurfaceCard
          title="Visible book mix"
          description="Segment mix shows how the current revenue picture is distributed. Regional concentration sits alongside it so exposure is visible at a glance."
        >
          {hasOverviewResults ? (
            <div className="space-y-5">
              <OverviewMixChart items={overview.segmentMix} />

              <div className="grid gap-3 md:grid-cols-3">
                {overview.regionMix.map((region) => (
                  <div
                    key={region.id}
                    className="rs-inset-panel rounded-soft px-4 py-4"
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
                      {region.label}
                    </p>
                    <p className="mt-2 text-xl font-semibold text-text-primary">
                      {formatCompactCurrency(region.amount)}
                    </p>
                    <p className="mt-2 text-sm text-text-secondary">
                      {formatPercentage(region.share)} of visible book
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No visible book to segment"
              description="Segment and region concentration reappear as soon as the active filters expose revenue data again."
              minHeight={320}
            />
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Top rep forecast coverage"
          description="Top reps are ranked from the shared performance rollup. The table keeps the overview credible by showing who is carrying the current forecast."
        >
          {overview.topRepRows.length === 0 ? (
            <EmptyState
              title="No rep coverage in the current scope"
              description="Change the filters or move to a broader slice to restore rep-level detail."
              minHeight={320}
            />
          ) : (
            <div className="rs-table-shell overflow-x-auto rounded-soft">
              <table className="min-w-[860px] text-left text-sm">
                <thead className="border-b border-white/8 text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rep</th>
                    <th className="px-4 py-3 font-medium">Open deals</th>
                    <th className="px-4 py-3 font-medium">Pipeline</th>
                    <th className="px-4 py-3 font-medium">Forecast</th>
                    <th className="px-4 py-3 font-medium">Coverage</th>
                    <th className="px-4 py-3 font-medium">Win rate</th>
                  </tr>
                </thead>
                <tbody>
                  {overview.topRepRows.map((row) => (
                    <tr
                      key={row.ownerId}
                      className="border-t border-white/6 text-text-secondary"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary">
                          {row.ownerName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {row.regionName}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        {formatCount(row.openDealCount)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCompactCurrency(row.pipelineAmount)}
                      </td>
                      <td className="px-4 py-3">
                        {formatCompactCurrency(row.weightedForecastAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <CoverageCell row={row} />
                      </td>
                      <td className="px-4 py-3">
                        {formatPercentage(row.winRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </SurfaceCard>
      </section>
    </div>
  );
}
