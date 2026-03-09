import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getForecastSnapshot } from '../data/selectors';
import {
  ForecastCompositionChart,
  ForecastCoverageChart,
  RiskDistributionChart,
} from '../features/forecast/ForecastCharts';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatDays,
  formatLabelFromToken,
  formatPercentage,
  formatSignedCompactCurrency,
} from '../lib/formatters';
import { cn } from '../lib/utils';
import type { RiskRow } from '../types/revops';

type SummaryTone = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

function getCoverageTone(rate: number) {
  if (rate >= 1) {
    return 'success' as const;
  }

  if (rate >= 0.8) {
    return 'accent' as const;
  }

  return 'warning' as const;
}

function getCoverageLabel(rate: number) {
  if (rate >= 1) {
    return 'Covering target';
  }

  if (rate >= 0.8) {
    return 'Within reach';
  }

  return 'Below target';
}

function getRiskSummaryTone(share: number, count: number): SummaryTone {
  if (count === 0) {
    return 'success';
  }

  if (share >= 0.3) {
    return 'danger';
  }

  if (share >= 0.18) {
    return 'warning';
  }

  return 'accent';
}

function getRiskTileTone(share: number, count: number) {
  if (count === 0) {
    return 'success' as const;
  }

  if (share >= 0.25) {
    return 'warning' as const;
  }

  return 'accent' as const;
}

function getForecastCategoryVariant(category: string) {
  if (category === 'commit') {
    return 'success' as const;
  }

  if (category === 'best_case') {
    return 'accent' as const;
  }

  return 'warning' as const;
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
        tone === 'danger' && 'border-danger/18 bg-danger/10',
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

function RiskReasonCard({ row }: { row: RiskRow }) {
  return (
    <div className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-primary">{row.label}</p>
        <StatusBadge variant="warning">{formatPercentage(row.share)}</StatusBadge>
      </div>
      <p className="mt-3 text-lg font-semibold tracking-tight text-text-primary">
        {formatCompactCurrency(row.amount)}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {formatCount(row.count)} tagged opportunities
      </p>
    </div>
  );
}

export function ForecastRisksPage() {
  const { filters } = useFilters();
  const forecast = getForecastSnapshot(filters);
  const isForecastAboveTarget = forecast.forecastGapAmount <= 0;
  const leadingCompositionBucket = forecast.compositionRows[0];
  const leadingRiskReason = forecast.riskRows[0];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Forecast"
        title="Forecast & Risks"
        description="Read weighted forecast against target, open-book composition, and downside concentration for the current filter slice. Coverage, category mix, risk posture, and the stalled watchlist all stay tied to the shared selector layer."
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
          detail={`${formatPercentage(forecast.forecastAttainmentRate)} of target with ${formatCompactCurrency(forecast.closedWonAmount)} booked and ${formatCompactCurrency(forecast.weightedOpenPipelineAmount)} weighted open.`}
          tone={getCoverageTone(forecast.forecastAttainmentRate)}
        />
        <MetricTile
          label="Forecast gap"
          value={formatSignedCompactCurrency(-forecast.forecastGapAmount)}
          detail={
            isForecastAboveTarget
              ? 'The current weighted view is running above visible target.'
              : 'The current weighted view is still trailing visible target.'
          }
          tone={isForecastAboveTarget ? 'success' : 'warning'}
        />
        <MetricTile
          label="At-risk pipeline"
          value={formatCompactCurrency(forecast.atRiskAmount)}
          detail={`${formatPercentage(forecast.atRiskShare)} of open pipeline across ${formatCount(forecast.atRiskOpportunityCount)} flagged deals.`}
          tone={getRiskTileTone(
            forecast.atRiskShare,
            forecast.atRiskOpportunityCount,
          )}
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
          <section className="grid gap-4 2xl:grid-cols-[minmax(0,1.14fr)_minmax(320px,0.86fr)]">
            <SurfaceCard
              title="Weighted forecast vs target"
              description="Closed-won revenue and weighted open pipeline stack into the visible forecast so coverage can be read against target without reconciliation work."
              footer={
                isForecastAboveTarget
                  ? `${formatSignedCompactCurrency(
                      -forecast.forecastGapAmount,
                    )} above visible target.`
                  : `${formatSignedCompactCurrency(
                      -forecast.forecastGapAmount,
                    )} below visible target.`
              }
            >
              <div className="space-y-4">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
                  <div className="grid gap-3 sm:grid-cols-3 xl:flex-1">
                    <SummaryStat
                      label="Booked now"
                      value={formatCompactCurrency(forecast.closedWonAmount)}
                      detail={`${formatPercentage(forecast.bookedAttainmentRate)} of visible target is already closed won.`}
                      tone="success"
                    />
                    <SummaryStat
                      label="Weighted open"
                      value={formatCompactCurrency(
                        forecast.weightedOpenPipelineAmount,
                      )}
                      detail="Remaining forecast contribution from open pipeline probability weighting."
                      tone="accent"
                    />
                    <SummaryStat
                      label="Coverage"
                      value={formatPercentage(forecast.forecastAttainmentRate)}
                      detail={`${formatSignedCompactCurrency(
                        -forecast.forecastGapAmount,
                      )} versus visible target.`}
                      tone={getCoverageTone(forecast.forecastAttainmentRate)}
                    />
                  </div>

                  <StatusBadge variant={getCoverageTone(forecast.forecastAttainmentRate)}>
                    {getCoverageLabel(forecast.forecastAttainmentRate)}
                  </StatusBadge>
                </div>

                <ForecastCoverageChart
                  targetAmount={forecast.targetAmount}
                  closedWonAmount={forecast.closedWonAmount}
                  weightedOpenPipelineAmount={forecast.weightedOpenPipelineAmount}
                  weightedForecastAmount={forecast.weightedForecastAmount}
                  forecastGapAmount={forecast.forecastGapAmount}
                />
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Forecast composition"
              description="Open pipeline is bucketed into commit, best case, and pipeline categories from the same filtered opportunity set used in the forecast coverage card."
              footer={
                leadingCompositionBucket
                  ? `${leadingCompositionBucket.label} is the largest visible bucket at ${formatPercentage(leadingCompositionBucket.share)} of open pipeline.`
                  : 'No open pipeline remains in the current scope.'
              }
            >
              {forecast.compositionRows.length === 0 ? (
                <EmptyState
                  title="No open pipeline in the current scope"
                  description="Closed-won revenue is still reflected above, but there is no remaining open pipeline to bucket by forecast category."
                />
              ) : (
                <ForecastCompositionChart
                  items={forecast.compositionRows}
                  totalAmount={forecast.openPipelineAmount}
                />
              )}
            </SurfaceCard>
          </section>

          <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <SurfaceCard
              title="Risk distribution"
              description="Open pipeline is distributed across the shared low, medium, and high risk model so exposure totals reconcile cleanly to the current filtered book."
              footer={
                leadingRiskReason
                  ? `${leadingRiskReason.label} is the biggest explicit risk tag at ${formatCompactCurrency(leadingRiskReason.amount)}.`
                  : 'No explicit risk reasons are tagged in the current scope.'
              }
            >
              <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <SummaryStat
                    label="At-risk book"
                    value={formatCompactCurrency(forecast.atRiskAmount)}
                    detail={`${formatPercentage(forecast.atRiskShare)} of the open pipeline is high risk or stalled.`}
                    tone={getRiskSummaryTone(
                      forecast.atRiskShare,
                      forecast.atRiskOpportunityCount,
                    )}
                  />
                  <SummaryStat
                    label="Stalled exposure"
                    value={formatCompactCurrency(forecast.stalledPipelineAmount)}
                    detail={`${formatCount(forecast.stalledOpportunityCount)} deals are already tripping the shared stalled rule.`}
                    tone={getRiskSummaryTone(
                      forecast.stalledShare,
                      forecast.stalledOpportunityCount,
                    )}
                  />
                  <SummaryStat
                    label="Leading reason"
                    value={leadingRiskReason?.label ?? 'Clear'}
                    detail={
                      leadingRiskReason
                        ? `${formatCompactCurrency(leadingRiskReason.amount)} across ${formatCount(leadingRiskReason.count)} tagged deals.`
                        : 'No explicit risk reason tags are active in the current slice.'
                    }
                    tone={leadingRiskReason ? 'warning' : 'success'}
                  />
                </div>

                {forecast.riskLevelRows.length === 0 ? (
                  <EmptyState
                    title="No open pipeline to distribute"
                    description="There is no active open book in the current scope, so risk bands do not have any remaining exposure to chart."
                  />
                ) : (
                  <RiskDistributionChart data={forecast.riskLevelRows} />
                )}

                {forecast.riskRows.length > 0 ? (
                  <div className="grid gap-3 sm:grid-cols-3">
                    {forecast.riskRows.slice(0, 3).map((row) => (
                      <RiskReasonCard key={row.id} row={row} />
                    ))}
                  </div>
                ) : null}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Stalled pipeline table"
              description="Highest-value stalled deals are pulled from the shared stalled rule, so this watchlist stays aligned with the pipeline and risk summaries above."
              footer={
                forecast.stalledOpportunityCount > 8
                  ? `${formatCount(
                      forecast.stalledOpportunityCount,
                    )} stalled deals in scope; the table highlights the largest ${formatCount(8)} by amount.`
                  : `${formatCount(
                      forecast.stalledOpportunityCount,
                    )} stalled deals in the current scope.`
              }
            >
              {forecast.stalledOpportunities.length === 0 ? (
                <EmptyState
                  title="No stalled opportunities in the current scope"
                  description="The visible filter slice has no active deals currently tripping the shared stalled rule."
                />
              ) : (
                <div className="overflow-x-auto rounded-soft border border-white/8 bg-surface-alt/60">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/8 text-text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Account</th>
                        <th className="px-4 py-3 font-medium">Owner</th>
                        <th className="px-4 py-3 font-medium">Forecast</th>
                        <th className="px-4 py-3 font-medium">Reason</th>
                        <th className="px-4 py-3 font-medium">Age</th>
                        <th className="px-4 py-3 font-medium text-right">
                          Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {forecast.stalledOpportunities.slice(0, 8).map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-white/6 text-text-secondary"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-text-primary">
                              {row.accountName}
                            </p>
                            <p className="text-xs text-text-muted">
                              {row.stage} • {row.segmentName}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <p className="text-text-primary">{row.ownerName}</p>
                            <p className="text-xs text-text-muted">
                              {row.teamName}
                            </p>
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              variant={getForecastCategoryVariant(
                                row.forecastCategory,
                              )}
                            >
                              {formatLabelFromToken(row.forecastCategory)}
                            </StatusBadge>
                          </td>
                          <td className="px-4 py-3">
                            {row.riskReason
                              ? formatLabelFromToken(row.riskReason)
                              : 'Health score watch'}
                          </td>
                          <td className="px-4 py-3">{formatDays(row.daysOpen)}</td>
                          <td className="px-4 py-3 text-right text-text-primary">
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
