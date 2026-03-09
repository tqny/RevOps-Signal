import type { Opportunity, Rep, Team } from '../../types/revops';

type ValueRange = readonly [number, number];

export type OpportunitySeedTemplate = {
  id: string;
  accountName: string;
  motion: string;
  ownerRepId: Opportunity['ownerRepId'];
  segmentId: Opportunity['segmentId'];
  source: Opportunity['source'];
  createdPeriodId: Opportunity['createdPeriodId'];
  expectedClosePeriodId: Opportunity['expectedClosePeriodId'];
  closedPeriodId: Opportunity['closedPeriodId'];
  stage: Opportunity['stage'];
  isClosed: Opportunity['isClosed'];
  outcome: Opportunity['outcome'];
  forecastCategory: Opportunity['forecastCategory'];
  riskLevel: Opportunity['riskLevel'];
  riskReason: Opportunity['riskReason'];
  amountRange?: ValueRange;
  salesCycleRange?: ValueRange;
  daysOpenRange?: ValueRange;
  healthRange?: ValueRange;
};

const baseAmountRanges: Record<string, ValueRange> = {
  commercial: [32000, 62000],
  'mid-market': [62000, 98000],
  enterprise: [128000, 214000],
};

const amountGuardrails: Record<string, ValueRange> = {
  commercial: [30000, 68000],
  'mid-market': [56000, 104000],
  enterprise: [118000, 220000],
};

const baseSalesCycleRanges: Record<string, ValueRange> = {
  commercial: [28, 48],
  'mid-market': [42, 68],
  enterprise: [66, 102],
};

const salesCycleGuardrails: Record<string, ValueRange> = {
  commercial: [24, 58],
  'mid-market': [36, 80],
  enterprise: [54, 118],
};

const sourceAmountAdjustments: Record<Opportunity['source'], ValueRange> = {
  Inbound: [-4000, 2000],
  Outbound: [0, 6000],
  Partner: [6000, 14000],
  Referral: [2000, 9000],
  Expansion: [-3000, 5000],
  SDR: [-6000, 0],
};

const sourceSalesCycleAdjustments: Record<Opportunity['source'], ValueRange> = {
  Inbound: [-4, 4],
  Outbound: [0, 8],
  Partner: [4, 12],
  Referral: [-2, 6],
  Expansion: [-8, -2],
  SDR: [-6, 2],
};

const capacityAmountAdjustments: Record<Rep['capacityBand'], ValueRange> = {
  strategic: [6000, 12000],
  growth: [-2000, 5000],
  core: [-5000, 0],
};

const capacitySalesCycleAdjustments: Record<Rep['capacityBand'], ValueRange> = {
  strategic: [8, 14],
  growth: [0, 6],
  core: [-6, 4],
};

const stageProbabilityRanges: Record<Opportunity['stage'], ValueRange> = {
  Prospect: [0.12, 0.2],
  Discovery: [0.22, 0.34],
  Solution: [0.4, 0.54],
  Proposal: [0.56, 0.72],
  Negotiation: [0.74, 0.88],
};

const stageProgressByStage: Record<Opportunity['stage'], number> = {
  Prospect: 0.24,
  Discovery: 0.38,
  Solution: 0.58,
  Proposal: 0.72,
  Negotiation: 0.88,
};

const healthRangesByRisk: Record<Opportunity['riskLevel'], ValueRange> = {
  low: [68, 84],
  medium: [52, 70],
  high: [34, 54],
};

function clampNumber(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function normalizeRange(range: ValueRange): ValueRange {
  const min = Math.min(range[0], range[1]);
  const max = Math.max(range[0], range[1]);

  return [min, max];
}

function clampRange(range: ValueRange, bounds: ValueRange): ValueRange {
  const normalized = normalizeRange(range);
  const min = clampNumber(normalized[0], bounds[0], bounds[1]);
  const max = clampNumber(normalized[1], min, bounds[1]);

  return [min, max];
}

function getBaseAmountRange(segmentId: Opportunity['segmentId']) {
  const range = baseAmountRanges[segmentId];

  if (!range) {
    throw new Error(`Missing amount range for segment ${segmentId}`);
  }

  return range;
}

function getAmountGuardrail(segmentId: Opportunity['segmentId']) {
  const range = amountGuardrails[segmentId];

  if (!range) {
    throw new Error(`Missing amount guardrail for segment ${segmentId}`);
  }

  return range;
}

function getBaseSalesCycleRange(segmentId: Opportunity['segmentId']) {
  const range = baseSalesCycleRanges[segmentId];

  if (!range) {
    throw new Error(`Missing sales-cycle range for segment ${segmentId}`);
  }

  return range;
}

function getSalesCycleGuardrail(segmentId: Opportunity['segmentId']) {
  const range = salesCycleGuardrails[segmentId];

  if (!range) {
    throw new Error(`Missing sales-cycle guardrail for segment ${segmentId}`);
  }

  return range;
}

function hashSeed(seed: string) {
  let hash = 2166136261;

  for (let index = 0; index < seed.length; index += 1) {
    hash ^= seed.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }

  return (hash >>> 0) || 1;
}

function createSeededRandom(seed: string) {
  let state = hashSeed(seed);

  return () => {
    state |= 0;
    state = (state + 0x6d2b79f5) | 0;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);

    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);

    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function pickInteger(range: ValueRange, random: () => number) {
  const normalized = normalizeRange(range);
  const min = Math.round(normalized[0]);
  const max = Math.round(normalized[1]);

  return Math.round(min + random() * (max - min));
}

function pickDecimal(range: ValueRange, random: () => number, precision = 2) {
  const normalized = normalizeRange(range);
  const value = normalized[0] + random() * (normalized[1] - normalized[0]);

  return Number(value.toFixed(precision));
}

function buildAmountRange(
  template: OpportunitySeedTemplate,
  rep: Rep,
): ValueRange {
  const baseRange = getBaseAmountRange(template.segmentId);
  const sourceAdjustment = sourceAmountAdjustments[template.source];
  const capacityAdjustment = capacityAmountAdjustments[rep.capacityBand];

  return clampRange(
    [
      baseRange[0] + sourceAdjustment[0] + capacityAdjustment[0],
      baseRange[1] + sourceAdjustment[1] + capacityAdjustment[1],
    ],
    getAmountGuardrail(template.segmentId),
  );
}

function buildSalesCycleRange(
  template: OpportunitySeedTemplate,
  rep: Rep,
): ValueRange {
  const baseRange = getBaseSalesCycleRange(template.segmentId);
  const sourceAdjustment = sourceSalesCycleAdjustments[template.source];
  const capacityAdjustment = capacitySalesCycleAdjustments[rep.capacityBand];

  return clampRange(
    [
      baseRange[0] + sourceAdjustment[0] + capacityAdjustment[0],
      baseRange[1] + sourceAdjustment[1] + capacityAdjustment[1],
    ],
    getSalesCycleGuardrail(template.segmentId),
  );
}

function buildHealthRange(template: OpportunitySeedTemplate): ValueRange {
  if (template.isClosed) {
    return template.outcome === 'won' ? [88, 95] : [30, 45];
  }

  const baseRange = healthRangesByRisk[template.riskLevel];
  let min = baseRange[0];
  let max = baseRange[1];

  if (template.stage === 'Proposal' || template.stage === 'Negotiation') {
    min += 4;
    max += 6;
  } else if (template.stage === 'Solution') {
    min += 1;
    max += 2;
  } else if (template.stage === 'Prospect') {
    min -= 4;
    max -= 2;
  }

  if (template.forecastCategory === 'commit') {
    min += 4;
    max += 6;
  } else if (template.forecastCategory === 'pipeline') {
    min -= 3;
    max -= 2;
  }

  if (template.source === 'Expansion') {
    min += 2;
    max += 3;
  }

  return clampRange([min, max], [24, 96]);
}

function buildProbabilityRange(template: OpportunitySeedTemplate): ValueRange {
  if (template.isClosed) {
    return template.outcome === 'won' ? [1, 1] : [0, 0];
  }

  const baseRange = stageProbabilityRanges[template.stage];
  let min = baseRange[0];
  let max = baseRange[1];

  if (template.riskLevel === 'low') {
    min += 0.02;
    max += 0.04;
  } else if (template.riskLevel === 'medium') {
    max -= 0.02;
  } else {
    min -= 0.12;
    max -= 0.08;
  }

  if (template.segmentId === 'enterprise') {
    max -= 0.01;
  }

  if (template.source === 'Expansion') {
    min += 0.02;
    max += 0.03;
  } else if (template.source === 'Partner') {
    max += 0.02;
  }

  if (template.forecastCategory === 'commit') {
    min = Math.max(min, 0.72);
    max = Math.max(max, 0.82);
  } else if (template.forecastCategory === 'best_case') {
    min = Math.max(min, 0.38);
    max = Math.min(max, 0.79);
  } else {
    max = Math.min(max, 0.58);
  }

  return clampRange([min, max], [0.08, 0.92]);
}

function buildDaysOpenRange(
  template: OpportunitySeedTemplate,
  salesCycleDays: number,
): ValueRange {
  if (template.isClosed) {
    return [salesCycleDays, salesCycleDays];
  }

  const stageProgress = stageProgressByStage[template.stage];
  const riskExtra: ValueRange =
    template.riskLevel === 'high'
      ? [4, 16]
      : template.riskLevel === 'medium'
        ? [0, 8]
        : [-4, 4];

  let min =
    Math.round(salesCycleDays * Math.max(0.3, stageProgress - 0.12)) +
    riskExtra[0];
  let max =
    Math.round(salesCycleDays * Math.min(0.98, stageProgress + 0.08)) +
    riskExtra[1];

  if (
    template.segmentId === 'enterprise' &&
    (template.stage === 'Proposal' || template.stage === 'Negotiation')
  ) {
    min += 4;
    max += 12;
  }

  if (template.source === 'Expansion') {
    min -= 4;
    max -= 2;
  }

  return clampRange([min, max], [14, salesCycleDays + 18]);
}

export function createGeneratedOpportunity(
  template: OpportunitySeedTemplate,
  reps: Rep[],
  teams: Team[],
): Opportunity {
  const rep = reps.find((item) => item.id === template.ownerRepId);

  if (!rep) {
    throw new Error(`Missing rep for generated opportunity ${template.id}`);
  }

  const team = teams.find((item) => item.id === rep.teamId);

  if (!team) {
    throw new Error(`Missing team for rep ${rep.id}`);
  }

  const random = createSeededRandom(template.id);
  const amountRange = template.amountRange ?? buildAmountRange(template, rep);
  const salesCycleRange =
    template.salesCycleRange ?? buildSalesCycleRange(template, rep);
  const salesCycleDays = pickInteger(salesCycleRange, random);
  const daysOpen = pickInteger(
    template.daysOpenRange ?? buildDaysOpenRange(template, salesCycleDays),
    random,
  );
  const probability = pickDecimal(buildProbabilityRange(template), random);
  const healthScore = pickInteger(
    template.healthRange ?? buildHealthRange(template),
    random,
  );

  return {
    id: template.id,
    name: `${template.accountName} ${template.motion}`,
    accountName: template.accountName,
    ownerRepId: rep.id,
    teamId: rep.teamId,
    regionId: team.regionId,
    segmentId: template.segmentId,
    source: template.source,
    createdPeriodId: template.createdPeriodId,
    expectedClosePeriodId: template.expectedClosePeriodId,
    closedPeriodId: template.closedPeriodId,
    stage: template.stage,
    amount: pickInteger(amountRange, random),
    probability,
    daysOpen,
    salesCycleDays,
    isClosed: template.isClosed,
    outcome: template.outcome,
    forecastCategory: template.forecastCategory,
    riskLevel: template.riskLevel,
    riskReason: template.riskReason,
    healthScore,
  };
}
