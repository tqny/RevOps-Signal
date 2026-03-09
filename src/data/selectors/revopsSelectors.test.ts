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
    expect(overview.forecastGapAmount).toBe(-155810);
    expect(
      overview.trend.reduce((total, point) => total + point.targetAmount, 0),
    ).toBe(overview.targetAmount);
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
    expect(
      pipeline.stageFunnel.reduce((total, row) => total + row.share, 0),
    ).toBeCloseTo(1, 5);
    expect(
      pipeline.stageLeakage.every(
        (row) =>
          row.totalExposedCount === row.lostCount + row.stalledCount &&
          row.totalExposedAmount === row.lostAmount + row.stalledAmount,
      ),
    ).toBe(true);
    expect(pipeline.lateStagePipelineAmount).toBeGreaterThan(0);
    expect(pipeline.lateStageShare).toBeGreaterThan(0);
    expect(pipeline.stalledOpportunityCount).toBeGreaterThan(0);
    expect(pipeline.stalledShare).toBeGreaterThan(0);
    expect(pipeline.stalledOpportunities[0]?.daysOpen ?? 0).toBeGreaterThan(
      pipeline.stalledOpportunities.at(-1)?.daysOpen ?? 0,
    );
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
    expect(performance.totalPipelineAmount).toBe(
      performance.repRows.reduce((total, row) => total + row.pipelineAmount, 0),
    );
    expect(
      performance.repsAtOrAboveTargetCount +
        performance.repsNearTargetCount +
        performance.repsOffPaceCount,
    ).toBe(performance.repRows.length);
    expect(performance.averageRepAttainmentRate).toBeGreaterThan(0);
    expect(
      performance.repRowsByAttainment[0]?.attainmentRate ?? 0,
    ).toBeGreaterThanOrEqual(
      performance.repRowsByAttainment.at(-1)?.attainmentRate ?? 0,
    );
    expect(
      performance.teamRowsByForecastAttainment[0]?.forecastAttainmentRate ?? 0,
    ).toBeGreaterThanOrEqual(
      performance.teamRowsByForecastAttainment.at(-1)?.forecastAttainmentRate ??
        0,
    );
  });

  it('reconciles forecast coverage, composition, and risk rollups', () => {
    const forecast = getForecastSnapshot(createDefaultFilters());

    expect(forecast.openPipelineAmount).toBe(1292000);
    expect(forecast.closedWonAmount).toBe(477000);
    expect(forecast.weightedOpenPipelineAmount).toBe(773810);
    expect(forecast.weightedForecastAmount).toBe(
      forecast.closedWonAmount + forecast.weightedOpenPipelineAmount,
    );
    expect(forecast.forecastAttainmentRate).toBeCloseTo(
      forecast.weightedForecastAmount / forecast.targetAmount,
      5,
    );
    expect(
      forecast.compositionRows.reduce((total, row) => total + row.amount, 0),
    ).toBe(forecast.openPipelineAmount);
    expect(
      forecast.riskLevelRows.reduce((total, row) => total + row.amount, 0),
    ).toBe(forecast.openPipelineAmount);
    expect(forecast.atRiskAmount).toBeGreaterThanOrEqual(
      forecast.stalledPipelineAmount,
    );
    expect(forecast.stalledOpportunities[0]?.amount ?? 0).toBeGreaterThanOrEqual(
      forecast.stalledOpportunities.at(-1)?.amount ?? 0,
    );
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
