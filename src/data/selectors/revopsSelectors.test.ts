import { describe, expect, it } from 'vitest';
import { createDefaultFilters } from '../mock';
import {
  getFilteredRevOpsContext,
  getForecastSnapshot,
  getOverviewSnapshot,
  getPerformanceSnapshot,
  getPipelineSnapshot,
} from './index';

describe('revops selectors', () => {
  it('builds the current-quarter overview from seeded mock data', () => {
    const filters = createDefaultFilters();
    const overview = getOverviewSnapshot(filters);

    expect(overview.opportunityCount).toBe(18);
    expect(overview.openOpportunityCount).toBe(12);
    expect(overview.targetAmount).toBe(1095000);
    expect(overview.pipelineAmount).toBe(1292000);
    expect(overview.weightedForecastAmount).toBe(1250810);
    expect(overview.closedWonAmount).toBe(477000);
  });

  it('keeps quota math segment-safe when segment filters are applied', () => {
    const overview = getOverviewSnapshot({
      ...createDefaultFilters(),
      segmentIds: ['commercial'],
    });

    expect(overview.targetAmount).toBe(270750);
    expect(overview.pipelineAmount).toBe(145000);
    expect(overview.segmentMix).toHaveLength(1);
    expect(overview.segmentMix[0]?.id).toBe('commercial');
  });

  it('reconciles funnel totals to the open pipeline subset', () => {
    const pipeline = getPipelineSnapshot(createDefaultFilters());
    const funnelCount = pipeline.stageFunnel.reduce(
      (total, row) => total + row.count,
      0,
    );
    const funnelAmount = pipeline.stageFunnel.reduce(
      (total, row) => total + row.amount,
      0,
    );

    expect(funnelCount).toBe(pipeline.openOpportunityCount);
    expect(funnelAmount).toBe(pipeline.totalPipelineAmount);
    expect(pipeline.stalledOpportunityCount).toBeGreaterThan(0);
  });

  it('rolls performance metrics correctly for a regional slice', () => {
    const performance = getPerformanceSnapshot({
      ...createDefaultFilters(),
      regionIds: ['emea'],
    });

    expect(performance.totalQuotaAmount).toBe(330000);
    expect(performance.repRows).toHaveLength(2);
    expect(performance.teamRows).toHaveLength(1);
    expect(performance.teamRows[0]?.ownerName).toBe('EMEA Growth');
  });

  it('returns empty scoped data for contradictory filters', () => {
    const context = getFilteredRevOpsContext({
      ...createDefaultFilters(),
      regionIds: ['apac'],
      repIds: ['ava-carter'],
    });
    const forecast = getForecastSnapshot({
      ...createDefaultFilters(),
      regionIds: ['apac'],
      repIds: ['ava-carter'],
    });

    expect(context.opportunities).toHaveLength(0);
    expect(forecast.hasResults).toBe(false);
    expect(forecast.forecastGapAmount).toBe(0);
  });
});
