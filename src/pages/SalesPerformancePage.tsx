import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getPerformanceSnapshot } from '../data/selectors';
import {
  RepAttainmentChart,
  TeamForecastCoverageChart,
} from '../features/performance/PerformanceCharts';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatCurrency,
  formatPercentage,
  formatSignedCompactCurrency,
} from '../lib/formatters';
import { cn } from '../lib/utils';

type SummaryTone = 'accent' | 'neutral' | 'success' | 'warning';

function getAttainmentTone(rate: number) {
  if (rate >= 1) {
    return 'success' as const;
  }

  if (rate >= 0.8) {
    return 'accent' as const;
  }

  return 'warning' as const;
}

function getAttainmentLabel(rate: number) {
  if (rate >= 1) {
    return 'At target';
  }

  if (rate >= 0.8) {
    return 'Working';
  }

  return 'Gap';
}

function getProgressBarClass(rate: number) {
  if (rate >= 1) {
    return 'bg-success/80';
  }

  if (rate >= 0.8) {
    return 'bg-accent-primary/80';
  }

  return 'bg-warning/80';
}

function SummaryStat({
  label,
  value,
  detail,
  tone = 'neutral',
}: {
  label: string;
  value: string;
  detail: string;
  tone?: SummaryTone;
}) {
  return (
    <div
      className={cn(
        'rounded-soft border px-4 py-4',
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

export function SalesPerformancePage() {
  const { filters } = useFilters();
  const performance = getPerformanceSnapshot(filters);
  const hasPerformanceResults = performance.hasResults;
  const hasRepRows = performance.repRowsByAttainment.length > 0;
  const hasTeamRows = performance.teamRowsByForecastAttainment.length > 0;
  const onPaceValue = `${formatCount(performance.repsAtOrAboveTargetCount)} / ${formatCount(
    performance.repRows.length,
  )}`;

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Execution"
        title="Sales Performance"
        description="Assess rep and team execution against the current visible target. Attainment, forecast coverage, win rate, and progress bars all stay tied to the shared selector layer."
      />

      <section className="grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <MetricTile
          label="Visible target"
          value={
            hasPerformanceResults
              ? formatCompactCurrency(performance.totalQuotaAmount)
              : 'No data'
          }
          detail={
            hasPerformanceResults
              ? `${formatCompactCurrency(performance.totalPipelineAmount)} open pipeline across ${formatCount(performance.totalOpenDealCount)} active deals in the current scope.`
              : 'No rep or team rollups are visible in the current filter scope.'
          }
          tone="neutral"
          statusLabel={hasPerformanceResults ? undefined : 'No data'}
          isPlaceholder={!hasPerformanceResults}
        />
        <MetricTile
          label="Closed-won attainment"
          value={
            hasPerformanceResults
              ? formatPercentage(performance.attainmentRate)
              : 'No data'
          }
          detail={
            hasPerformanceResults
              ? `${formatCompactCurrency(performance.totalClosedWonAmount)} booked, ${formatSignedCompactCurrency(-performance.attainmentGapAmount)} versus target.`
              : 'Attainment appears once the current slice contains visible rep or team quota rollups.'
          }
          tone={
            hasPerformanceResults
              ? performance.attainmentRate >= 1
                ? 'success'
                : 'warning'
              : 'neutral'
          }
          statusLabel={hasPerformanceResults ? undefined : 'No data'}
          isPlaceholder={!hasPerformanceResults}
        />
        <MetricTile
          label="Forecast coverage"
          value={
            hasPerformanceResults
              ? formatPercentage(performance.forecastAttainmentRate)
              : 'No data'
          }
          detail={
            hasPerformanceResults
              ? `${formatCompactCurrency(performance.totalWeightedForecastAmount)} weighted forecast, ${formatSignedCompactCurrency(-performance.forecastGapAmount)} versus target.`
              : 'Forecast coverage appears once the current slice contains visible rep or team quota rollups.'
          }
          tone={
            hasPerformanceResults
              ? performance.forecastAttainmentRate >= 1
                ? 'success'
                : performance.forecastAttainmentRate >= 0.8
                  ? 'accent'
                  : 'warning'
              : 'neutral'
          }
          statusLabel={hasPerformanceResults ? undefined : 'No data'}
          isPlaceholder={!hasPerformanceResults}
        />
        <MetricTile
          label="On-pace reps"
          value={hasPerformanceResults ? onPaceValue : 'No data'}
          detail={
            hasPerformanceResults
              ? `${formatCount(performance.repsNearTargetCount)} more reps are in the 80-99% working band.`
              : 'Rep pacing appears once the current slice includes performance rollups.'
          }
          tone={
            hasPerformanceResults
              ? performance.repsAtOrAboveTargetCount > 0
                ? 'success'
                : 'warning'
              : 'neutral'
          }
          statusLabel={hasPerformanceResults ? undefined : 'No data'}
          isPlaceholder={!hasPerformanceResults}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.08fr)_minmax(320px,0.92fr)]">
        <SurfaceCard
          title="Rep attainment ladder"
          description="Closed-won attainment ranks the current rep slice from strongest execution to widest gap. Each bar uses the same visible quota base as the KPI strip."
          footer={
            hasRepRows
              ? `${formatCompactCurrency(
                  performance.totalClosedWonAmount,
                )} is already booked against ${formatCompactCurrency(
                  performance.totalQuotaAmount,
                )} of visible target.`
              : 'Rep coverage appears here once the current slice exposes visible owner rollups.'
          }
        >
          {hasRepRows ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                <SummaryStat
                  label="At target"
                  value={formatCount(performance.repsAtOrAboveTargetCount)}
                  detail="Reps already at or above visible quota."
                  tone="success"
                />
                <SummaryStat
                  label="Working band"
                  value={formatCount(performance.repsNearTargetCount)}
                  detail="Reps currently between 80% and 99% attainment."
                  tone="accent"
                />
                <SummaryStat
                  label="Avg rep win rate"
                  value={formatPercentage(performance.averageRepWinRate)}
                  detail="Average close efficiency across visible rep rollups."
                  tone="neutral"
                />
              </div>

              <div className="space-y-4">
                {performance.repRowsByAttainment.map((row) => (
                  <ProgressBar
                    key={row.ownerId}
                    label={row.ownerName}
                    value={row.attainmentRate}
                    total={1}
                    valueLabel={formatPercentage(row.attainmentRate)}
                    detail={`${formatCompactCurrency(
                      row.closedWonAmount,
                    )} won on ${formatCompactCurrency(
                      row.quotaAmount,
                    )} quota • ${formatCompactCurrency(
                      row.weightedForecastAmount,
                    )} weighted forecast`}
                    tone={getAttainmentTone(row.attainmentRate)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No rep performance rows match the current filters"
              description="Broaden the current slice to restore rep-level attainment and forecast pacing."
              minHeight={320}
            />
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Team forecast pacing"
          description="Team rows roll up from the same rep-level selector outputs, so leader pacing and rep detail reconcile without page-local math."
          footer={
            hasTeamRows
              ? `${formatCount(
                  performance.teamsAtOrAboveForecastCount,
                )} teams currently cover target on weighted forecast.`
              : 'Team pacing appears here once the current slice exposes visible team rollups.'
          }
        >
          {hasTeamRows ? (
            <div className="space-y-5">
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-1">
                <SummaryStat
                  label="Forecast delta"
                  value={formatSignedCompactCurrency(
                    -performance.forecastGapAmount,
                  )}
                  detail="Weighted forecast versus the current visible target."
                  tone={
                    performance.forecastGapAmount <= 0 ? 'success' : 'warning'
                  }
                />
                <SummaryStat
                  label="Avg rep attainment"
                  value={formatPercentage(performance.averageRepAttainmentRate)}
                  detail="Average visible attainment across rep rows."
                  tone="accent"
                />
              </div>

              <div className="space-y-4">
                {performance.teamRowsByForecastAttainment.map((row) => (
                  <ProgressBar
                    key={row.ownerId}
                    label={row.ownerName}
                    value={row.forecastAttainmentRate}
                    total={1}
                    valueLabel={formatPercentage(row.forecastAttainmentRate)}
                    detail={`${formatCompactCurrency(
                      row.weightedForecastAmount,
                    )} weighted on ${formatCompactCurrency(
                      row.quotaAmount,
                    )} target • ${formatCount(row.openDealCount)} open`}
                    tone={getAttainmentTone(row.forecastAttainmentRate)}
                  />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No team pacing rows match the current filters"
              description="Broaden the current slice to restore team-level forecast pacing."
              minHeight={320}
            />
          )}
        </SurfaceCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)]">
        <SurfaceCard
          title="Rep and team comparison"
          description="Rep bars rank actual attainment. Team bars rank weighted forecast coverage so current execution and in-flight pacing stay on one screen."
        >
          {hasRepRows || hasTeamRows ? (
            <div className="space-y-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Rep closed-won attainment
                    </p>
                    <p className="text-sm text-text-secondary">
                      Highest-attaining reps are shown first.
                    </p>
                  </div>
                  <StatusBadge variant="neutral">
                    {formatCount(performance.repRowsByAttainment.length)} reps
                  </StatusBadge>
                </div>
                {hasRepRows ? (
                  <RepAttainmentChart data={performance.repRowsByAttainment} />
                ) : (
                  <EmptyState
                    title="No rep chart data in the current scope"
                    description="Rep rankings reappear once the active filters expose performance rows."
                    minHeight={260}
                  />
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-text-primary">
                      Team weighted forecast coverage
                    </p>
                    <p className="text-sm text-text-secondary">
                      Each team bar compares weighted forecast to visible quota.
                    </p>
                  </div>
                  <StatusBadge variant="neutral">
                    {formatCount(performance.teamRowsByForecastAttainment.length)}{' '}
                    teams
                  </StatusBadge>
                </div>
                {hasTeamRows ? (
                  <TeamForecastCoverageChart
                    data={performance.teamRowsByForecastAttainment}
                  />
                ) : (
                  <EmptyState
                    title="No team chart data in the current scope"
                    description="Team comparisons reappear once the active filters expose team pacing rows."
                    minHeight={260}
                  />
                )}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No performance rows match the current filters"
              description="Broaden the scope or reset the filters to restore rep and team comparisons."
              minHeight={320}
            />
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Performance table"
          description="Detailed rep rollup for the current slice. The table stays light, but every number uses the same shared quota, win-rate, and forecast logic as the rest of the page."
          footer={
            hasRepRows
              ? `${formatCount(performance.repsOffPaceCount)} reps are still below the 80% pace band in the current scope.`
              : 'Rep-level rows reappear here once the current filters expose performance detail.'
          }
        >
          {hasRepRows ? (
            <div className="overflow-x-auto rounded-soft border border-white/8 bg-surface-alt/60">
              <table className="min-w-[940px] text-left text-sm">
                <thead className="border-b border-white/8 text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rep</th>
                    <th className="px-4 py-3 font-medium text-right">Quota</th>
                    <th className="px-4 py-3 font-medium text-right">Won</th>
                    <th className="px-4 py-3 font-medium">Attainment</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Forecast
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      Win rate
                    </th>
                    <th className="px-4 py-3 font-medium text-right">
                      Velocity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {performance.repRowsByAttainment.map((row) => (
                    <tr
                      key={row.ownerId}
                      className="border-t border-white/6 text-text-secondary"
                    >
                      <td className="px-4 py-3">
                        <p className="font-medium text-text-primary">
                          {row.ownerName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {row.regionName} • {formatCount(row.openDealCount)} open deals
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right text-text-primary">
                        {formatCompactCurrency(row.quotaAmount)}
                      </td>
                      <td className="px-4 py-3 text-right text-text-primary">
                        {formatCompactCurrency(row.closedWonAmount)}
                      </td>
                      <td className="px-4 py-3">
                        <div className="min-w-[180px] space-y-2">
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium text-text-primary">
                              {formatPercentage(row.attainmentRate)}
                            </span>
                            <StatusBadge
                              variant={getAttainmentTone(row.attainmentRate)}
                            >
                              {getAttainmentLabel(row.attainmentRate)}
                            </StatusBadge>
                          </div>
                          <div className="h-2 overflow-hidden rounded-pill bg-surface">
                            <div
                              className={cn(
                                'h-full rounded-pill transition-all',
                                getProgressBarClass(row.attainmentRate),
                              )}
                              style={{
                                width: `${Math.min(
                                  row.attainmentRate * 100,
                                  100,
                                )}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <p className="text-text-primary">
                          {formatCompactCurrency(row.weightedForecastAmount)}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatPercentage(row.forecastAttainmentRate)} of quota
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right text-text-primary">
                        {formatPercentage(row.winRate)}
                      </td>
                      <td className="px-4 py-3 text-right text-text-primary">
                        {formatCurrency(row.velocityAmountPerDay)}/day
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <EmptyState
              title="No performance rows match the current filters"
              description="Broaden the scope or reset the filters to restore the rep and team rollups."
              minHeight={320}
            />
          )}
        </SurfaceCard>
      </section>
    </div>
  );
}
