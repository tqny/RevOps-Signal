import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getForecastSnapshot } from '../data/selectors';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatLabelFromToken,
  formatPercentage,
  formatSignedCompactCurrency,
} from '../lib/formatters';

export function ForecastRisksPage() {
  const { filters } = useFilters();
  const forecast = getForecastSnapshot(filters);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Forecast"
        title="Forecast & Risks"
        description="Forecast confidence, category mix, and downside concentration are now selector-backed from the shared local dataset."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricTile
          label="Visible target"
          value={formatCompactCurrency(forecast.targetAmount)}
          detail="Segment-aware quota allocation keeps target math consistent when filters narrow the scope."
          tone="neutral"
        />
        <MetricTile
          label="Weighted forecast"
          value={formatCompactCurrency(forecast.weightedForecastAmount)}
          detail={`${formatCompactCurrency(forecast.weightedOpenPipelineAmount)} still depends on open pipeline weighting.`}
          tone={
            forecast.weightedForecastAmount >= forecast.targetAmount
              ? 'success'
              : 'warning'
          }
        />
        <MetricTile
          label="Forecast gap"
          value={formatSignedCompactCurrency(-forecast.forecastGapAmount)}
          detail="Positive means upside to target; negative means the current weighted view is behind."
          tone={forecast.forecastGapAmount <= 0 ? 'success' : 'warning'}
        />
        <MetricTile
          label="At-risk pipeline"
          value={formatCompactCurrency(forecast.atRiskAmount)}
          detail={`${formatCount(forecast.stalledOpportunities.length)} stalled or high-risk opportunities are currently exposed.`}
          tone={forecast.atRiskAmount > 250000 ? 'warning' : 'accent'}
        />
      </section>

      {!forecast.hasResults ? (
        <SurfaceCard title="Forecast">
          <EmptyState
            title="No forecast data matches the current filters"
            description="Reset the filters to restore the current forecast view."
          />
        </SurfaceCard>
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1fr,1fr]">
            <SurfaceCard
              title="Forecast composition"
              description="Open pipeline is split into commit, best-case, and pipeline buckets from the shared selector layer."
            >
              <div className="space-y-4">
                {forecast.compositionRows.map((row) => (
                  <ProgressBar
                    key={row.id}
                    label={row.label}
                    value={row.share}
                    total={1}
                    valueLabel={formatCompactCurrency(row.amount)}
                    detail={`${formatPercentage(row.share)} of open pipeline`}
                    tone={
                      row.id === 'commit'
                        ? 'success'
                        : row.id === 'best_case'
                          ? 'accent'
                          : 'warning'
                    }
                  />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Risk concentration"
              description="Risk reason exposure is derived from the same active opportunities shown elsewhere."
            >
              {forecast.riskRows.length === 0 ? (
                <EmptyState
                  title="No active risk reasons in the current scope"
                  description="The filtered open pipeline is currently clean."
                />
              ) : (
                <div className="space-y-4">
                  {forecast.riskRows.map((row) => (
                    <ProgressBar
                      key={row.id}
                      label={row.label}
                      value={row.share}
                      total={1}
                      valueLabel={formatCompactCurrency(row.amount)}
                      detail={`${formatCount(row.count)} opportunities • ${formatPercentage(row.share)} share`}
                      tone="danger"
                    />
                  ))}
                </div>
              )}
            </SurfaceCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.88fr,1.12fr]">
            <SurfaceCard
              title="Interpretation rails"
              description="Short guidance to keep tomorrow’s chart treatment disciplined."
            >
              <ul className="space-y-3 text-sm leading-6 text-text-secondary">
                <li>
                  Weighted forecast currently sits{' '}
                  <span className="font-medium text-text-primary">
                    {forecast.forecastGapAmount <= 0 ? 'ahead of' : 'behind'}{' '}
                    target
                  </span>{' '}
                  by{' '}
                  {formatCompactCurrency(Math.abs(forecast.forecastGapAmount))}.
                </li>
                <li>
                  Best-case and pipeline buckets should remain visually
                  subordinate to commit in the final chart treatment.
                </li>
                <li>
                  Stalled and high-risk exposure should stay readable, but never
                  dominate the page with alarm-heavy styling.
                </li>
              </ul>
            </SurfaceCard>

            <SurfaceCard
              title="Stalled opportunity watchlist"
              description="The watchlist already responds to shared filters and will be the backbone for tomorrow’s risk table polish."
            >
              {forecast.stalledOpportunities.length === 0 ? (
                <EmptyState
                  title="No stalled opportunities"
                  description="The current filtered scope has no aging or stalled deals."
                />
              ) : (
                <div className="overflow-x-auto rounded-soft border border-white/8 bg-surface-alt/60">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/8 text-text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Account</th>
                        <th className="px-4 py-3 font-medium">Owner</th>
                        <th className="px-4 py-3 font-medium">Reason</th>
                        <th className="px-4 py-3 font-medium">Age</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.stalledOpportunities.map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-white/6 text-text-secondary"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-text-primary">
                              {row.accountName}
                            </p>
                            <p className="text-xs text-text-muted">
                              {row.stage}
                            </p>
                          </td>
                          <td className="px-4 py-3">{row.ownerName}</td>
                          <td className="px-4 py-3">
                            {row.riskReason
                              ? formatLabelFromToken(row.riskReason)
                              : 'Health score watch'}
                          </td>
                          <td className="px-4 py-3">{row.daysOpen}d</td>
                          <td className="px-4 py-3">
                            {formatCompactCurrency(row.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </SurfaceCard>
          </section>
        </>
      )}
    </div>
  );
}
