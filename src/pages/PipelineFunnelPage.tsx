import { PageHeader } from '../components/layout/PageHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { MetricTile } from '../components/ui/MetricTile';
import { StatusBadge } from '../components/ui/StatusBadge';
import { SurfaceCard } from '../components/ui/SurfaceCard';
import { getPipelineSnapshot } from '../data/selectors';
import {
  PipelineConversionChart,
  PipelineFunnelChart,
  PipelineLeakageChart,
} from '../features/pipeline/PipelineCharts';
import { useFilters } from '../features/filters';
import {
  formatCompactCurrency,
  formatCount,
  formatDays,
  formatLabelFromToken,
  formatPercentage,
} from '../lib/formatters';
import type { StageConversionRow, StageLeakageRow } from '../types/revops';

function getConversionBadge(rate: number) {
  if (rate >= 0.65) {
    return { label: 'Strong', variant: 'success' as const };
  }

  if (rate >= 0.4) {
    return { label: 'Mixed', variant: 'accent' as const };
  }

  return { label: 'Tight', variant: 'warning' as const };
}

function getLeakageBadge(row: StageLeakageRow) {
  if (row.totalExposedAmount === 0) {
    return { label: 'Contained', variant: 'neutral' as const };
  }

  if (row.lostAmount >= row.stalledAmount) {
    return { label: 'Leakage', variant: 'danger' as const };
  }

  return { label: 'Aging', variant: 'warning' as const };
}

function StageConversionCard({ row }: { row: StageConversionRow }) {
  const badge = getConversionBadge(row.rate);

  return (
    <div className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-primary">{row.stage}</p>
        <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
      </div>
      <p className="mt-3 text-2xl font-semibold tracking-tight text-text-primary">
        {formatPercentage(row.rate)}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {formatCount(row.progressedCount)} of {formatCount(row.reachedCount)}{' '}
        deals have already progressed forward. {formatCount(row.dropOffCount)}{' '}
        remain at this stage.
      </p>
    </div>
  );
}

function LeakageStageCard({ row }: { row: StageLeakageRow }) {
  const badge = getLeakageBadge(row);

  return (
    <div className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-4">
      <div className="flex items-center justify-between gap-3">
        <p className="text-sm font-medium text-text-primary">{row.stage}</p>
        <StatusBadge variant={badge.variant}>{badge.label}</StatusBadge>
      </div>
      <p className="mt-3 text-xl font-semibold tracking-tight text-text-primary">
        {formatCompactCurrency(row.totalExposedAmount)}
      </p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Lost {formatCount(row.lostCount)} /{' '}
        {formatCompactCurrency(row.lostAmount)}. Stalled {formatCount(
          row.stalledCount,
        )}{' '}
        / {formatCompactCurrency(row.stalledAmount)}.
      </p>
    </div>
  );
}

export function PipelineFunnelPage() {
  const { filters } = useFilters();
  const pipeline = getPipelineSnapshot(filters);
  const hasPipelineResults = pipeline.hasResults;
  const hasOpenPipeline = pipeline.openOpportunityCount > 0;
  const hasStageConversion = pipeline.stageConversion.some(
    (row) => row.reachedCount > 0,
  );
  const hasLeakageExposure = pipeline.stageLeakage.some(
    (row) => row.totalExposedAmount > 0,
  );
  const cycleBenchmarkValue =
    pipeline.averageCycleDays > 0 ? formatDays(pipeline.averageCycleDays) : 'N/A';

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Pipeline"
        title="Pipeline & Funnel"
        description="Trace where open pipeline is concentrated, how far deals are progressing, and where leakage or aging is slowing the path to close. All stage logic stays in the shared selector layer."
      />

      <section className="grid gap-4 xl:grid-cols-4">
        <MetricTile
          label="Open pipeline"
          value={
            hasOpenPipeline
              ? formatCompactCurrency(pipeline.totalPipelineAmount)
              : hasPipelineResults
                ? 'No open book'
                : 'No data'
          }
          detail={
            hasOpenPipeline
              ? `${formatCount(pipeline.openOpportunityCount)} active opportunities are visible in the current filter scope.`
              : hasPipelineResults
                ? 'The current slice only contains closed deals, so there is no active pipeline to diagnose.'
                : 'No opportunities are visible in the current filter scope.'
          }
          tone={hasOpenPipeline ? 'accent' : 'neutral'}
          statusLabel={hasOpenPipeline ? undefined : hasPipelineResults ? 'Sparse' : 'No data'}
          isPlaceholder={!hasOpenPipeline}
        />
        <MetricTile
          label="Late-stage pipeline"
          value={
            hasOpenPipeline
              ? formatCompactCurrency(pipeline.lateStagePipelineAmount)
              : hasPipelineResults
                ? 'No open book'
                : 'No data'
          }
          detail={
            hasOpenPipeline
              ? `${formatCount(
                  pipeline.lateStageOpportunityCount,
                )} deals are already in proposal or negotiation, ${formatPercentage(
                  pipeline.lateStageShare,
                )} of open pipeline.`
              : hasPipelineResults
                ? 'Late-stage pacing reappears when the visible slice includes open pipeline.'
                : 'There is no late-stage pipeline in the current filter scope.'
          }
          tone={
            hasOpenPipeline
              ? pipeline.lateStageShare >= 0.4
                ? 'success'
                : 'accent'
              : 'neutral'
          }
          statusLabel={hasOpenPipeline ? undefined : hasPipelineResults ? 'Sparse' : 'No data'}
          isPlaceholder={!hasOpenPipeline}
        />
        <MetricTile
          label="Stalled exposure"
          value={
            hasOpenPipeline
              ? formatCompactCurrency(pipeline.stalledPipelineAmount)
              : hasPipelineResults
                ? 'No open book'
                : 'No data'
          }
          detail={
            hasOpenPipeline
              ? `${formatCount(
                  pipeline.stalledOpportunityCount,
                )} aging deals account for ${formatPercentage(
                  pipeline.stalledShare,
                )} of the open book.`
              : hasPipelineResults
                ? 'Stalled exposure is only meaningful when active pipeline is still visible.'
                : 'There is no stalled exposure in the current filter scope.'
          }
          tone={
            hasOpenPipeline
              ? pipeline.stalledOpportunityCount === 0
                ? 'success'
                : pipeline.stalledShare >= 0.2
                  ? 'warning'
                  : 'accent'
              : 'neutral'
          }
          statusLabel={hasOpenPipeline ? undefined : hasPipelineResults ? 'Sparse' : 'No data'}
          isPlaceholder={!hasOpenPipeline}
        />
        <MetricTile
          label="Won cycle benchmark"
          value={hasPipelineResults ? cycleBenchmarkValue : 'No data'}
          detail={
            hasPipelineResults
              ? `Current closed-won benchmark for the visible slice. Average open deal size is ${formatCompactCurrency(
                  pipeline.averageDealSize,
                )}.`
              : 'Won-cycle benchmarks appear when the current slice contains opportunity history.'
          }
          tone={
            hasPipelineResults
              ? pipeline.averageCycleDays === 0
                ? 'neutral'
                : pipeline.averageCycleDays <= 60
                  ? 'success'
                  : pipeline.averageCycleDays <= 75
                    ? 'accent'
                    : 'warning'
              : 'neutral'
          }
          statusLabel={hasPipelineResults ? undefined : 'No data'}
          isPlaceholder={!hasPipelineResults}
        />
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1.18fr)_minmax(320px,0.82fr)]">
        <SurfaceCard
          title="Pipeline funnel"
          description="Open pipeline is sequenced by stage so you can see where volume is sitting right now. The layout is intentionally funnel-like, but every value still comes from the central stage snapshot."
          footer={
            hasOpenPipeline
              ? `${formatCompactCurrency(
                  pipeline.lateStagePipelineAmount,
                )} is already sitting in proposal or negotiation across ${formatCount(
                  pipeline.lateStageOpportunityCount,
                )} active deals.`
              : 'This frame stays pinned so the page structure remains stable under sparse filters.'
          }
        >
          {hasOpenPipeline ? (
            <PipelineFunnelChart data={pipeline.stageFunnel} />
          ) : (
            <EmptyState
              title={
                hasPipelineResults
                  ? 'No open pipeline in the current scope'
                  : 'No opportunities match the current filters'
              }
              description={
                hasPipelineResults
                  ? 'The visible slice only contains closed deals, so there is no active funnel to sequence by stage.'
                  : 'Broaden the current filters to restore the pipeline funnel.'
              }
              minHeight={320}
            />
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Stage conversion"
          description="Progression uses the shared stage-reached proxy so conversion can be diagnosed without introducing historical stage-event modeling into the MVP."
        >
          {hasStageConversion ? (
            <div className="space-y-5">
              <PipelineConversionChart data={pipeline.stageConversion} />
              <div className="grid gap-3 sm:grid-cols-2">
                {pipeline.stageConversion.map((row) => (
                  <StageConversionCard key={row.stage} row={row} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title="No conversion story in the current scope"
              description="This view needs visible opportunities reaching one or more stages before progression rates can be summarized."
              minHeight={320}
            />
          )}
        </SurfaceCard>
      </section>

      <section className="grid gap-4 2xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <SurfaceCard
          title="Leakage and aging"
          description="Lost deals and stalled open deals stay aligned with the same stage definitions as the funnel above, so exposure can be read without reconciliation work."
        >
          {hasLeakageExposure ? (
            <div className="space-y-5">
              <PipelineLeakageChart data={pipeline.stageLeakage} />
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {pipeline.stageLeakage.map((row) => (
                  <LeakageStageCard key={row.stage} row={row} />
                ))}
              </div>
            </div>
          ) : (
            <EmptyState
              title={
                hasPipelineResults
                  ? 'No current leakage or aging exposure'
                  : 'No leakage data in the current scope'
              }
              description={
                hasPipelineResults
                  ? 'Lost-stage exposure and stalled pipeline are both clear for the visible slice right now.'
                  : 'Broaden the filters to restore leakage and aging diagnostics.'
              }
              minHeight={320}
            />
          )}
        </SurfaceCard>

        <SurfaceCard
          title="Stalled and aging watchlist"
          description="These rows are the highest-age active opportunities currently tripping the shared stalled/aging rule."
        >
          {pipeline.stalledOpportunities.length === 0 ? (
            <EmptyState
              title="No stalled opportunities in the current scope"
              description="The visible filter slice has no aging deals that breach the shared stalled rule."
              minHeight={320}
            />
          ) : (
            <div className="overflow-x-auto rounded-soft border border-white/8 bg-surface-alt/60">
              <table className="min-w-full text-left text-sm">
                <thead className="border-b border-white/8 text-text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Account</th>
                    <th className="px-4 py-3 font-medium">Owner</th>
                    <th className="px-4 py-3 font-medium">Stage</th>
                    <th className="px-4 py-3 font-medium">Reason</th>
                    <th className="px-4 py-3 font-medium">Age</th>
                    <th className="px-4 py-3 font-medium text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pipeline.stalledOpportunities.slice(0, 8).map((row) => (
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
                      <td className="px-4 py-3">
                        <p className="text-text-primary">{row.ownerName}</p>
                        <p className="text-xs text-text-muted">
                          {row.teamName}
                        </p>
                      </td>
                      <td className="px-4 py-3">{row.stage}</td>
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
    </div>
  );
}
