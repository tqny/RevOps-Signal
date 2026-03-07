import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getPipelineSnapshot } from '../data/selectors';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatDays,
  formatLabelFromToken,
  formatPercentage,
} from '../lib/formatters';

export function PipelineFunnelPage() {
  const { filters } = useFilters();
  const pipeline = getPipelineSnapshot(filters);
  const maxStageAmount = Math.max(
    ...pipeline.stageFunnel.map((row) => row.amount),
    1,
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Diagnostics"
        title="Pipeline & Funnel"
        description="This page now runs on real seeded opportunities and selector math. The current presentation stays intentionally utilitarian until the dedicated page implementation pass."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricTile
          label="Open pipeline"
          value={formatCompactCurrency(pipeline.totalPipelineAmount)}
          detail={`${formatCount(pipeline.openOpportunityCount)} open opportunities in scope.`}
          tone="accent"
        />
        <MetricTile
          label="Average deal size"
          value={formatCompactCurrency(pipeline.averageDealSize)}
          detail={`Current won-cycle benchmark is ${formatDays(pipeline.averageCycleDays)}.`}
          tone="neutral"
        />
        <MetricTile
          label="Stalled pipeline"
          value={formatCompactCurrency(pipeline.stalledPipelineAmount)}
          detail={`${formatCount(pipeline.stalledOpportunityCount)} opportunities are flagged as stalled or aging.`}
          tone={pipeline.stalledOpportunityCount >= 3 ? 'warning' : 'success'}
        />
        <MetricTile
          label="Funnel stages"
          value={formatCount(
            pipeline.stageFunnel.filter((row) => row.count > 0).length,
          )}
          detail="Stage counts and leakage now come from one central selector path."
          tone="success"
        />
      </section>

      {!pipeline.hasResults ? (
        <SurfaceCard title="Pipeline">
          <EmptyState
            title="No opportunities match the current filters"
            description="Reset the filters to restore the visible funnel."
          />
        </SurfaceCard>
      ) : (
        <>
          <section className="grid gap-4 xl:grid-cols-[1.05fr,0.95fr]">
            <SurfaceCard
              title="Stage funnel"
              description="Open volume by stage. These values will feed a styled funnel chart later without changing the source selector."
            >
              <div className="space-y-4">
                {pipeline.stageFunnel.map((row) => (
                  <ProgressBar
                    key={row.stage}
                    label={row.stage}
                    value={row.amount}
                    total={maxStageAmount}
                    valueLabel={formatCompactCurrency(row.amount)}
                    detail={`${formatCount(row.count)} opportunities`}
                    tone="accent"
                  />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Stage conversion proxy"
              description="This proxy uses current-stage progression to keep the MVP deterministic without adding historical stage-event modeling."
            >
              <div className="space-y-3">
                {pipeline.stageConversion.map((row) => (
                  <div
                    key={row.stage}
                    className="rounded-soft border border-white/8 bg-surface-alt/60 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text-primary">
                        {row.stage}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {formatPercentage(row.rate)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm text-text-secondary">
                      {formatCount(row.progressedCount)} progressed from{' '}
                      {formatCount(row.reachedCount)} that reached this stage.
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="grid gap-4 xl:grid-cols-[0.9fr,1.1fr]">
            <SurfaceCard
              title="Leakage and aging"
              description="Lost and stalled volume by stage using the same filtered subset as the funnel."
            >
              <div className="space-y-3">
                {pipeline.stageLeakage.map((row) => (
                  <div
                    key={row.stage}
                    className="rounded-soft border border-white/8 bg-surface-alt/60 px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium text-text-primary">
                        {row.stage}
                      </p>
                      <p className="text-sm text-text-secondary">
                        Lost {formatCompactCurrency(row.lostAmount)}
                      </p>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-text-secondary">
                      {formatCount(row.lostCount)} lost •{' '}
                      {formatCount(row.stalledCount)} stalled •{' '}
                      {formatCompactCurrency(row.stalledAmount)} still open but
                      aging
                    </p>
                  </div>
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard
              title="Largest open opportunities"
              description="Table rows are now filter-aware and sourced directly from the shared selector layer."
            >
              {pipeline.opportunities.length === 0 ? (
                <EmptyState
                  title="No open opportunities in the current scope"
                  description="Change filters to inspect a broader slice of the funnel."
                />
              ) : (
                <div className="overflow-x-auto rounded-soft border border-white/8 bg-surface-alt/60">
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/8 text-text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Opportunity</th>
                        <th className="px-4 py-3 font-medium">Owner</th>
                        <th className="px-4 py-3 font-medium">Stage</th>
                        <th className="px-4 py-3 font-medium">Risk</th>
                        <th className="px-4 py-3 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pipeline.opportunities.slice(0, 8).map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-white/6 text-text-secondary"
                        >
                          <td className="px-4 py-3">
                            <p className="font-medium text-text-primary">
                              {row.accountName}
                            </p>
                            <p className="text-xs text-text-muted">
                              {row.segmentName}
                            </p>
                          </td>
                          <td className="px-4 py-3">{row.ownerName}</td>
                          <td className="px-4 py-3">{row.stage}</td>
                          <td className="px-4 py-3">
                            {row.riskReason
                              ? formatLabelFromToken(row.riskReason)
                              : 'Healthy'}
                          </td>
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
