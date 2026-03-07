import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getPerformanceSnapshot } from '../data/selectors';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatCurrency,
  formatPercentage,
} from '../lib/formatters';

export function SalesPerformancePage() {
  const { filters } = useFilters();
  const performance = getPerformanceSnapshot(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Execution"
        title="Sales Performance"
        description="Rep and team execution are now computed from the seeded mock model. The page stays intentionally compact until the dedicated performance pass."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricTile
          label="Visible target"
          value={formatCompactCurrency(performance.totalQuotaAmount)}
          detail="Quota rolls up from rep and segment-aware quota snapshots."
          tone="neutral"
        />
        <MetricTile
          label="Closed won"
          value={formatCompactCurrency(performance.totalClosedWonAmount)}
          detail={`${formatPercentage(performance.attainmentRate)} attainment on current visible target.`}
          tone={performance.attainmentRate >= 1 ? 'success' : 'warning'}
        />
        <MetricTile
          label="Forecast attainment"
          value={formatPercentage(performance.forecastAttainmentRate)}
          detail={`${formatCompactCurrency(performance.totalWeightedForecastAmount)} weighted forecast in the current scope.`}
          tone={performance.forecastAttainmentRate >= 1 ? 'success' : 'accent'}
        />
        <MetricTile
          label="Rep rows"
          value={formatCount(performance.repRows.length)}
          detail={`${formatCount(performance.teamRows.length)} team rollups are available from the same selector layer.`}
          tone="success"
        />
      </section>

      {!performance.hasResults ? (
        <SurfaceCard title="Performance">
          <EmptyState
            title="No performance rows match the current filters"
            description="Broaden the scope or reset the filters to restore the table."
          />
        </SurfaceCard>
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
            <SurfaceCard
              title="Rep forecast coverage"
              description="Forecast attainment uses the same visible quota base as the top KPI strip."
            >
              <div className="space-y-4">
                {performance.repRows.map((row) => (
                  <ProgressBar
                    key={row.ownerId}
                    label={row.ownerName}
                    value={row.forecastAttainmentRate}
                    total={1}
                    valueLabel={formatCompactCurrency(
                      row.weightedForecastAmount,
                    )}
                    detail={`${formatPercentage(row.forecastAttainmentRate)} of ${formatCompactCurrency(row.quotaAmount)} quota • ${formatCount(row.openDealCount)} open`}
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
            </SurfaceCard>

            <SurfaceCard
              title="Team rollups"
              description="Team metrics aggregate from the same rep-level rows used above."
            >
              <div className="space-y-3">
                {performance.teamRows.map((row) => (
                  <div
                    key={row.ownerId}
                    className="rounded-soft border border-white/8 bg-surface-alt/60 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {row.ownerName}
                        </p>
                        <p className="text-xs text-text-muted">
                          {row.regionName}
                        </p>
                      </div>
                      <p className="text-sm text-text-secondary">
                        {formatPercentage(row.forecastAttainmentRate)}
                      </p>
                    </div>
                    <div className="mt-3 grid gap-2 text-sm text-text-secondary sm:grid-cols-3">
                      <span>
                        Quota {formatCompactCurrency(row.quotaAmount)}
                      </span>
                      <span>
                        Won {formatCompactCurrency(row.closedWonAmount)}
                      </span>
                      <span>
                        Velocity {formatCurrency(row.velocityAmountPerDay)}/day
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.92fr,1.08fr]">
            <SurfaceCard
              title="Closed-won trend"
              description="Period rows stay intentionally simple until the chart-specific task lands."
            >
              <div className="space-y-3">
                {performance.closedTrend.map((point) => (
                  <div
                    key={point.periodId}
                    className="flex items-center justify-between rounded-soft border border-white/8 bg-surface-alt/60 px-4 py-4 text-sm"
                  >
                    <span className="font-medium text-text-primary">
                      {point.label}
                    </span>
                    <span className="text-text-secondary">
                      {formatCompactCurrency(point.closedWonAmount)}
                    </span>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Rep table"
              description="Core performance metrics are centralized now; tomorrow can focus on layout and chart treatment."
            >
              <div className="overflow-x-auto rounded-soft border border-white/8 bg-surface-alt/60">
                <table className="min-w-full text-left text-sm">
                  <thead className="border-b border-white/8 text-text-muted">
                    <tr>
                      <th className="px-4 py-3 font-medium">Rep</th>
                      <th className="px-4 py-3 font-medium">Quota</th>
                      <th className="px-4 py-3 font-medium">Won</th>
                      <th className="px-4 py-3 font-medium">Win rate</th>
                      <th className="px-4 py-3 font-medium">Velocity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {performance.repRows.map((row) => (
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
                          {formatCompactCurrency(row.quotaAmount)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCompactCurrency(row.closedWonAmount)}
                        </td>
                        <td className="px-4 py-3">
                          {formatPercentage(row.winRate)}
                        </td>
                        <td className="px-4 py-3">
                          {formatCurrency(row.velocityAmountPerDay)}/day
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </SurfaceCard>
          </section>
        </>
      )}
    </div>
  );
}
