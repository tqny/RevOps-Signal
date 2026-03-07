import {
  forecastCategoryLabels,
  revOpsDataset,
  riskReasonLabels,
  stageOrder,
} from '../mock';
import type {
  FilterOption,
  ForecastCompositionRow,
  MixItem,
  Opportunity,
  OpportunityRow,
  OverviewSignal,
  PerformanceRow,
  QuotaSnapshot,
  RevOpsFilters,
  RiskRow,
  StageConversionRow,
  StageFunnelRow,
  StageLeakageRow,
  Team,
  TimePeriod,
  TimeframePreset,
  TrendPoint,
} from '../../types/revops';

const stalledDayThreshold = 60;

const repById = new Map(revOpsDataset.reps.map((rep) => [rep.id, rep]));
const teamById = new Map(revOpsDataset.teams.map((team) => [team.id, team]));
const regionById = new Map(
  revOpsDataset.regions.map((region) => [region.id, region]),
);
const segmentById = new Map(
  revOpsDataset.segments.map((segment) => [segment.id, segment]),
);
const timeframeById = new Map(
  revOpsDataset.timeframePresets.map((preset) => [preset.id, preset]),
);
const stageIndexById = new Map(
  stageOrder.map((stage, index) => [stage, index]),
);
const initialTimeframe = revOpsDataset.timeframePresets[0];

if (!initialTimeframe) {
  throw new Error('RevOps dataset must define at least one timeframe preset');
}

const fallbackTimeframe: TimeframePreset = initialTimeframe;

type FilteredRevOpsContext = {
  timeframe: TimeframePreset;
  periods: TimePeriod[];
  opportunities: Opportunity[];
  openOpportunities: Opportunity[];
  closedOpportunities: Opportunity[];
  wonOpportunities: Opportunity[];
  lostOpportunities: Opportunity[];
  quotaSnapshots: QuotaSnapshot[];
  reps: typeof revOpsDataset.reps;
  teams: Team[];
};

function matchesSelection(value: string, selectedIds: string[]) {
  return selectedIds.length === 0 || selectedIds.includes(value);
}

function getRelevantPeriodId(opportunity: Opportunity) {
  if (opportunity.isClosed) {
    return opportunity.closedPeriodId ?? opportunity.expectedClosePeriodId;
  }

  return opportunity.expectedClosePeriodId;
}

function sumAmount(opportunities: Opportunity[]) {
  return opportunities.reduce(
    (total, opportunity) => total + opportunity.amount,
    0,
  );
}

function sumWeightedAmount(opportunities: Opportunity[]) {
  return Math.round(
    opportunities.reduce(
      (total, opportunity) =>
        total + opportunity.amount * opportunity.probability,
      0,
    ),
  );
}

function sumQuota(quotaSnapshots: QuotaSnapshot[]) {
  return quotaSnapshots.reduce(
    (total, snapshot) => total + snapshot.quotaAmount,
    0,
  );
}

function averageValue(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
}

function safeRate(numerator: number, denominator: number) {
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
}

function getTimeframePreset(timeframeId: string) {
  return timeframeById.get(timeframeId) ?? fallbackTimeframe;
}

function getScopedRepIds(filters: RevOpsFilters) {
  return new Set(
    revOpsDataset.reps
      .filter(
        (rep) =>
          matchesSelection(rep.regionId, filters.regionIds) &&
          matchesSelection(rep.teamId, filters.teamIds) &&
          matchesSelection(rep.id, filters.repIds),
      )
      .map((rep) => rep.id),
  );
}

function getScopedTeamIds(filters: RevOpsFilters) {
  return new Set(
    revOpsDataset.teams
      .filter(
        (team) =>
          matchesSelection(team.regionId, filters.regionIds) &&
          matchesSelection(team.id, filters.teamIds),
      )
      .map((team) => team.id),
  );
}

function getOpportunityRows(opportunities: Opportunity[]): OpportunityRow[] {
  return opportunities.map((opportunity) => ({
    id: opportunity.id,
    name: opportunity.name,
    accountName: opportunity.accountName,
    ownerName: repById.get(opportunity.ownerRepId)?.name ?? 'Unknown rep',
    teamName: teamById.get(opportunity.teamId)?.name ?? 'Unknown team',
    regionName: regionById.get(opportunity.regionId)?.name ?? 'Unknown region',
    segmentName:
      segmentById.get(opportunity.segmentId)?.name ?? 'Unknown segment',
    stage: opportunity.stage,
    amount: opportunity.amount,
    daysOpen: opportunity.daysOpen,
    riskLevel: opportunity.riskLevel,
    riskReason: opportunity.riskReason,
    forecastCategory: opportunity.forecastCategory,
    isClosed: opportunity.isClosed,
    outcome: opportunity.outcome,
  }));
}

function buildMixItems(
  opportunities: Opportunity[],
  getKey: (opportunity: Opportunity) => string,
  getLabel: (key: string) => string,
): MixItem[] {
  const totalAmount = sumAmount(opportunities);
  const buckets = new Map<string, { amount: number; count: number }>();

  opportunities.forEach((opportunity) => {
    const key = getKey(opportunity);
    const current = buckets.get(key) ?? { amount: 0, count: 0 };

    buckets.set(key, {
      amount: current.amount + opportunity.amount,
      count: current.count + 1,
    });
  });

  return Array.from(buckets.entries())
    .map(([key, value]) => ({
      id: key,
      label: getLabel(key),
      amount: value.amount,
      count: value.count,
      share: safeRate(value.amount, totalAmount),
    }))
    .sort((left, right) => right.amount - left.amount);
}

function isStalledOpportunity(opportunity: Opportunity) {
  return (
    !opportunity.isClosed &&
    (opportunity.daysOpen >= stalledDayThreshold ||
      opportunity.riskReason === 'stalled' ||
      opportunity.healthScore <= 45)
  );
}

function buildRepPerformanceRows(
  context: FilteredRevOpsContext,
): PerformanceRow[] {
  return context.reps
    .map((rep) => {
      const repOpportunities = context.opportunities.filter(
        (opportunity) => opportunity.ownerRepId === rep.id,
      );
      const repOpenOpportunities = repOpportunities.filter(
        (opportunity) => !opportunity.isClosed,
      );
      const repWonOpportunities = repOpportunities.filter(
        (opportunity) => opportunity.isClosed && opportunity.outcome === 'won',
      );
      const repClosedOpportunities = repOpportunities.filter(
        (opportunity) => opportunity.isClosed,
      );
      const repQuotas = context.quotaSnapshots.filter(
        (snapshot) => snapshot.repId === rep.id,
      );

      const closedWonAmount = sumAmount(repWonOpportunities);
      const weightedForecastAmount =
        closedWonAmount + sumWeightedAmount(repOpenOpportunities);
      const quotaAmount = sumQuota(repQuotas);
      const cycleDays = averageValue(
        repWonOpportunities.map((opportunity) => opportunity.salesCycleDays),
      );

      return {
        ownerId: rep.id,
        ownerName: rep.name,
        ownerType: 'rep' as const,
        regionName: regionById.get(rep.regionId)?.name ?? 'Unknown region',
        quotaAmount,
        closedWonAmount,
        weightedForecastAmount,
        pipelineAmount: sumAmount(repOpenOpportunities),
        attainmentRate: safeRate(closedWonAmount, quotaAmount),
        forecastAttainmentRate: safeRate(weightedForecastAmount, quotaAmount),
        winRate: safeRate(
          repWonOpportunities.length,
          repClosedOpportunities.length,
        ),
        velocityAmountPerDay:
          cycleDays > 0 ? Math.round(closedWonAmount / cycleDays) : 0,
        openDealCount: repOpenOpportunities.length,
      };
    })
    .filter(
      (row) =>
        row.quotaAmount > 0 ||
        row.pipelineAmount > 0 ||
        row.closedWonAmount > 0 ||
        row.openDealCount > 0,
    )
    .sort(
      (left, right) =>
        right.weightedForecastAmount - left.weightedForecastAmount,
    );
}

function buildTeamPerformanceRows(
  repRows: PerformanceRow[],
  context: FilteredRevOpsContext,
): PerformanceRow[] {
  return context.teams
    .map((team) => {
      const teamRepIds = new Set(
        context.reps
          .filter((rep) => rep.teamId === team.id)
          .map((rep) => rep.id),
      );
      const teamRows = repRows.filter((row) => teamRepIds.has(row.ownerId));

      const quotaAmount = teamRows.reduce(
        (total, row) => total + row.quotaAmount,
        0,
      );
      const closedWonAmount = teamRows.reduce(
        (total, row) => total + row.closedWonAmount,
        0,
      );
      const weightedForecastAmount = teamRows.reduce(
        (total, row) => total + row.weightedForecastAmount,
        0,
      );
      const pipelineAmount = teamRows.reduce(
        (total, row) => total + row.pipelineAmount,
        0,
      );
      const openDealCount = teamRows.reduce(
        (total, row) => total + row.openDealCount,
        0,
      );
      const closedTeamOpportunities = context.closedOpportunities.filter(
        (opportunity) => opportunity.teamId === team.id,
      );
      const wonTeamOpportunities = closedTeamOpportunities.filter(
        (opportunity) => opportunity.outcome === 'won',
      );
      const teamCycleDays = averageValue(
        wonTeamOpportunities.map((opportunity) => opportunity.salesCycleDays),
      );

      return {
        ownerId: team.id,
        ownerName: team.name,
        ownerType: 'team' as const,
        regionName: regionById.get(team.regionId)?.name ?? 'Unknown region',
        quotaAmount,
        closedWonAmount,
        weightedForecastAmount,
        pipelineAmount,
        attainmentRate: safeRate(closedWonAmount, quotaAmount),
        forecastAttainmentRate: safeRate(weightedForecastAmount, quotaAmount),
        winRate: safeRate(
          wonTeamOpportunities.length,
          closedTeamOpportunities.length,
        ),
        velocityAmountPerDay:
          teamCycleDays > 0 ? Math.round(closedWonAmount / teamCycleDays) : 0,
        openDealCount,
      };
    })
    .filter(
      (row) =>
        row.quotaAmount > 0 ||
        row.pipelineAmount > 0 ||
        row.closedWonAmount > 0 ||
        row.openDealCount > 0,
    )
    .sort(
      (left, right) =>
        right.weightedForecastAmount - left.weightedForecastAmount,
    );
}

function buildOverviewSignals(
  coverageRatio: number,
  winRate: number,
  openOpportunities: Opportunity[],
): OverviewSignal[] {
  const highRiskAmount = sumAmount(
    openOpportunities.filter(
      (opportunity) =>
        opportunity.riskLevel === 'high' || isStalledOpportunity(opportunity),
    ),
  );
  const pipelineAmount = sumAmount(openOpportunities);
  const riskShare = safeRate(highRiskAmount, pipelineAmount);
  const stalledCount = openOpportunities.filter(isStalledOpportunity).length;

  return [
    coverageRatio >= 1.1
      ? {
          id: 'coverage',
          tone: 'success',
          title: 'Coverage is above target',
          description:
            'Open pipeline covers more than 1.1x of the visible target.',
        }
      : {
          id: 'coverage',
          tone: 'warning',
          title: 'Coverage is tight',
          description:
            'Open pipeline is below the 1.1x comfort band for the visible target.',
        },
    winRate >= 0.5
      ? {
          id: 'win-rate',
          tone: 'success',
          title: 'Close efficiency is holding',
          description:
            'The current filtered close mix is winning at or above 50%.',
        }
      : {
          id: 'win-rate',
          tone: 'warning',
          title: 'Close efficiency needs help',
          description: 'The current filtered close mix is winning below 50%.',
        },
    riskShare >= 0.3 || stalledCount >= 3
      ? {
          id: 'risk',
          tone: 'danger',
          title: 'Risk is concentrated in active pipeline',
          description:
            'High-risk or stalled deals make up a material share of the open book.',
        }
      : {
          id: 'risk',
          tone: 'neutral',
          title: 'Risk concentration is manageable',
          description:
            'High-risk and stalled exposure is present but not dominating the open book.',
        },
  ];
}

export function getFilteredRevOpsContext(
  filters: RevOpsFilters,
): FilteredRevOpsContext {
  const timeframe = getTimeframePreset(filters.timeframeId);
  const periodIds = new Set(timeframe.periodIds);
  const scopedRepIds = getScopedRepIds(filters);
  const scopedTeamIds = getScopedTeamIds(filters);

  const opportunities = revOpsDataset.opportunities.filter(
    (opportunity) =>
      periodIds.has(getRelevantPeriodId(opportunity)) &&
      matchesSelection(opportunity.segmentId, filters.segmentIds) &&
      matchesSelection(opportunity.regionId, filters.regionIds) &&
      matchesSelection(opportunity.teamId, filters.teamIds) &&
      matchesSelection(opportunity.ownerRepId, filters.repIds) &&
      scopedRepIds.has(opportunity.ownerRepId) &&
      scopedTeamIds.has(opportunity.teamId),
  );

  const reps = revOpsDataset.reps.filter((rep) => scopedRepIds.has(rep.id));
  const teams = revOpsDataset.teams.filter((team) =>
    scopedTeamIds.has(team.id),
  );
  const quotaSnapshots = revOpsDataset.quotaSnapshots.filter(
    (snapshot) =>
      periodIds.has(snapshot.periodId) &&
      scopedRepIds.has(snapshot.repId) &&
      matchesSelection(snapshot.segmentId, filters.segmentIds),
  );
  const periods = revOpsDataset.timePeriods.filter((period) =>
    periodIds.has(period.id),
  );
  const openOpportunities = opportunities.filter(
    (opportunity) => !opportunity.isClosed,
  );
  const closedOpportunities = opportunities.filter(
    (opportunity) => opportunity.isClosed,
  );
  const wonOpportunities = closedOpportunities.filter(
    (opportunity) => opportunity.outcome === 'won',
  );
  const lostOpportunities = closedOpportunities.filter(
    (opportunity) => opportunity.outcome === 'lost',
  );

  return {
    timeframe,
    periods,
    opportunities,
    openOpportunities,
    closedOpportunities,
    wonOpportunities,
    lostOpportunities,
    quotaSnapshots,
    reps,
    teams,
  };
}

export function getOverviewSnapshot(filters: RevOpsFilters) {
  const context = getFilteredRevOpsContext(filters);
  const targetAmount = sumQuota(context.quotaSnapshots);
  const pipelineAmount = sumAmount(context.openOpportunities);
  const closedWonAmount = sumAmount(context.wonOpportunities);
  const weightedOpenPipelineAmount = sumWeightedAmount(
    context.openOpportunities,
  );
  const weightedForecastAmount = closedWonAmount + weightedOpenPipelineAmount;
  const coverageRatio = safeRate(pipelineAmount, targetAmount);
  const winRate = safeRate(
    context.wonOpportunities.length,
    context.closedOpportunities.length,
  );
  const averageDealSize = averageValue(
    context.opportunities.map((opportunity) => opportunity.amount),
  );
  const averageCycleDays = averageValue(
    context.closedOpportunities.map(
      (opportunity) => opportunity.salesCycleDays,
    ),
  );
  const trend: TrendPoint[] = context.periods.map((period) => {
    const periodOpportunities = context.opportunities.filter(
      (opportunity) => getRelevantPeriodId(opportunity) === period.id,
    );
    const periodOpenOpportunities = periodOpportunities.filter(
      (opportunity) => !opportunity.isClosed,
    );
    const periodWonOpportunities = periodOpportunities.filter(
      (opportunity) => opportunity.isClosed && opportunity.outcome === 'won',
    );

    return {
      periodId: period.id,
      label: period.label.split(' ')[0] ?? period.label,
      pipelineAmount: sumAmount(periodOpenOpportunities),
      weightedForecastAmount:
        sumAmount(periodWonOpportunities) +
        sumWeightedAmount(periodOpenOpportunities),
      closedWonAmount: sumAmount(periodWonOpportunities),
      opportunityCount: periodOpportunities.length,
    };
  });
  const segmentMix = buildMixItems(
    context.opportunities,
    (opportunity) => opportunity.segmentId,
    (segmentId) => segmentById.get(segmentId)?.name ?? segmentId,
  );
  const regionMix = buildMixItems(
    context.opportunities,
    (opportunity) => opportunity.regionId,
    (regionId) => regionById.get(regionId)?.name ?? regionId,
  );
  const repRows = buildRepPerformanceRows(context);

  return {
    timeframe: context.timeframe,
    targetAmount,
    pipelineAmount,
    closedWonAmount,
    weightedForecastAmount,
    coverageRatio,
    winRate,
    averageDealSize,
    averageCycleDays,
    opportunityCount: context.opportunities.length,
    openOpportunityCount: context.openOpportunities.length,
    trend,
    segmentMix,
    regionMix,
    signals: buildOverviewSignals(
      coverageRatio,
      winRate,
      context.openOpportunities,
    ),
    topRepRows: repRows.slice(0, 4),
    hasResults: context.opportunities.length > 0,
  };
}

export function getPipelineSnapshot(filters: RevOpsFilters) {
  const context = getFilteredRevOpsContext(filters);
  const stageFunnel: StageFunnelRow[] = stageOrder.map((stage) => {
    const stageOpportunities = context.openOpportunities.filter(
      (opportunity) => opportunity.stage === stage,
    );

    return {
      stage,
      count: stageOpportunities.length,
      amount: sumAmount(stageOpportunities),
    };
  });
  const stageConversion: StageConversionRow[] = stageOrder.map(
    (stage, index) => {
      const reachedCount = context.opportunities.filter((opportunity) => {
        const stageIndex = stageIndexById.get(opportunity.stage) ?? 0;
        return stageIndex >= index;
      }).length;

      const progressedCount = context.opportunities.filter((opportunity) => {
        const stageIndex = stageIndexById.get(opportunity.stage) ?? 0;

        if (index === stageOrder.length - 1) {
          return (
            stageIndex === index &&
            opportunity.isClosed &&
            opportunity.outcome === 'won'
          );
        }

        return stageIndex > index;
      }).length;

      return {
        stage,
        reachedCount,
        progressedCount,
        rate: safeRate(progressedCount, reachedCount),
      };
    },
  );
  const stageLeakage: StageLeakageRow[] = stageOrder.map((stage) => {
    const lostAtStage = context.lostOpportunities.filter(
      (opportunity) => opportunity.stage === stage,
    );
    const stalledAtStage = context.openOpportunities.filter(
      (opportunity) =>
        opportunity.stage === stage && isStalledOpportunity(opportunity),
    );

    return {
      stage,
      lostCount: lostAtStage.length,
      lostAmount: sumAmount(lostAtStage),
      stalledCount: stalledAtStage.length,
      stalledAmount: sumAmount(stalledAtStage),
    };
  });

  return {
    totalPipelineAmount: sumAmount(context.openOpportunities),
    openOpportunityCount: context.openOpportunities.length,
    averageDealSize: averageValue(
      context.openOpportunities.map((opportunity) => opportunity.amount),
    ),
    averageCycleDays: averageValue(
      context.wonOpportunities.map((opportunity) => opportunity.salesCycleDays),
    ),
    stalledOpportunityCount:
      context.openOpportunities.filter(isStalledOpportunity).length,
    stalledPipelineAmount: sumAmount(
      context.openOpportunities.filter(isStalledOpportunity),
    ),
    stageFunnel,
    stageConversion,
    stageLeakage,
    opportunities: getOpportunityRows(context.openOpportunities).sort(
      (left, right) => right.amount - left.amount,
    ),
    hasResults: context.opportunities.length > 0,
  };
}

export function getPerformanceSnapshot(filters: RevOpsFilters) {
  const context = getFilteredRevOpsContext(filters);
  const repRows = buildRepPerformanceRows(context);
  const teamRows = buildTeamPerformanceRows(repRows, context);
  const totalQuotaAmount = sumQuota(context.quotaSnapshots);
  const totalClosedWonAmount = sumAmount(context.wonOpportunities);
  const totalWeightedForecastAmount =
    totalClosedWonAmount + sumWeightedAmount(context.openOpportunities);

  return {
    totalQuotaAmount,
    totalClosedWonAmount,
    totalWeightedForecastAmount,
    attainmentRate: safeRate(totalClosedWonAmount, totalQuotaAmount),
    forecastAttainmentRate: safeRate(
      totalWeightedForecastAmount,
      totalQuotaAmount,
    ),
    repRows,
    teamRows,
    closedTrend: context.periods.map((period) => {
      const wonAtPeriod = context.wonOpportunities.filter(
        (opportunity) => opportunity.closedPeriodId === period.id,
      );

      return {
        periodId: period.id,
        label: period.label.split(' ')[0] ?? period.label,
        pipelineAmount: 0,
        weightedForecastAmount: sumAmount(wonAtPeriod),
        closedWonAmount: sumAmount(wonAtPeriod),
        opportunityCount: wonAtPeriod.length,
      };
    }),
    hasResults: repRows.length > 0 || teamRows.length > 0,
  };
}

export function getForecastSnapshot(filters: RevOpsFilters) {
  const context = getFilteredRevOpsContext(filters);
  const targetAmount = sumQuota(context.quotaSnapshots);
  const weightedOpenPipelineAmount = sumWeightedAmount(
    context.openOpportunities,
  );
  const weightedForecastAmount =
    sumAmount(context.wonOpportunities) + weightedOpenPipelineAmount;
  const compositionRows: ForecastCompositionRow[] = (
    ['commit', 'best_case', 'pipeline'] as const
  )
    .map((category) => {
      const categoryOpportunities = context.openOpportunities.filter(
        (opportunity) => opportunity.forecastCategory === category,
      );
      const amount = sumAmount(categoryOpportunities);

      return {
        id: category,
        label: forecastCategoryLabels[category],
        amount,
        share: safeRate(amount, sumAmount(context.openOpportunities)),
      };
    })
    .filter((row) => row.amount > 0);
  const riskRows: RiskRow[] = Array.from(
    context.openOpportunities.reduce((buckets, opportunity) => {
      if (!opportunity.riskReason) {
        return buckets;
      }

      const current = buckets.get(opportunity.riskReason) ?? {
        amount: 0,
        count: 0,
      };

      buckets.set(opportunity.riskReason, {
        amount: current.amount + opportunity.amount,
        count: current.count + 1,
      });

      return buckets;
    }, new Map<string, { amount: number; count: number }>()),
  )
    .map(([riskReason, value]) => ({
      id: riskReason,
      label:
        riskReasonLabels[riskReason as keyof typeof riskReasonLabels] ??
        riskReason,
      amount: value.amount,
      count: value.count,
      share: safeRate(value.amount, sumAmount(context.openOpportunities)),
    }))
    .sort((left, right) => right.amount - left.amount);
  const stalledOpportunities = context.openOpportunities
    .filter(isStalledOpportunity)
    .sort((left, right) => right.amount - left.amount);

  return {
    targetAmount,
    weightedForecastAmount,
    weightedOpenPipelineAmount,
    forecastGapAmount: targetAmount - weightedForecastAmount,
    atRiskAmount: sumAmount(
      context.openOpportunities.filter(
        (opportunity) =>
          opportunity.riskLevel === 'high' || isStalledOpportunity(opportunity),
      ),
    ),
    compositionRows,
    riskRows,
    stalledOpportunities: getOpportunityRows(stalledOpportunities),
    hasResults: context.opportunities.length > 0,
  };
}

export function getFilterOptions(): {
  timeframeOptions: FilterOption[];
  segmentOptions: FilterOption[];
  regionOptions: FilterOption[];
  teamOptions: FilterOption[];
  repOptions: FilterOption[];
} {
  return {
    timeframeOptions: revOpsDataset.timeframePresets.map((preset) => ({
      id: preset.id,
      label: preset.label,
    })),
    segmentOptions: revOpsDataset.segments.map((segment) => ({
      id: segment.id,
      label: segment.name,
    })),
    regionOptions: revOpsDataset.regions.map((region) => ({
      id: region.id,
      label: region.name,
    })),
    teamOptions: revOpsDataset.teams.map((team) => ({
      id: team.id,
      label: team.name,
    })),
    repOptions: revOpsDataset.reps.map((rep) => ({
      id: rep.id,
      label: rep.name,
    })),
  };
}
