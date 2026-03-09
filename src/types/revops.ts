export type FilterOption = {
  id: string;
  label: string;
};

export type TimePeriod = {
  id: string;
  label: string;
  quarter: string;
  monthIndex: number;
  startDate: string;
  endDate: string;
};

export type TimeframePreset = {
  id: string;
  label: string;
  description: string;
  periodIds: string[];
};

export type Region = {
  id: string;
  name: string;
};

export type Segment = {
  id: string;
  name: string;
};

export type Team = {
  id: string;
  name: string;
  regionId: string;
};

export type CapacityBand = 'core' | 'growth' | 'strategic';

export type Rep = {
  id: string;
  name: string;
  teamId: string;
  regionId: string;
  quota: number;
  capacityBand: CapacityBand;
};

export type OpportunityStage =
  | 'Prospect'
  | 'Discovery'
  | 'Solution'
  | 'Proposal'
  | 'Negotiation';

export type OpportunitySource =
  | 'Inbound'
  | 'Outbound'
  | 'Partner'
  | 'Referral'
  | 'Expansion'
  | 'SDR';

export type OpportunityOutcome = 'won' | 'lost' | null;

export type ForecastCategory = 'commit' | 'best_case' | 'pipeline';

export type RiskLevel = 'low' | 'medium' | 'high';

export type RiskReason =
  | 'budget'
  | 'competitive'
  | 'procurement'
  | 'champion'
  | 'legal'
  | 'stalled';

export type Opportunity = {
  id: string;
  name: string;
  accountName: string;
  ownerRepId: string;
  teamId: string;
  regionId: string;
  segmentId: string;
  source: OpportunitySource;
  createdPeriodId: string;
  expectedClosePeriodId: string;
  closedPeriodId: string | null;
  stage: OpportunityStage;
  amount: number;
  probability: number;
  daysOpen: number;
  salesCycleDays: number;
  isClosed: boolean;
  outcome: OpportunityOutcome;
  forecastCategory: ForecastCategory;
  riskLevel: RiskLevel;
  riskReason: RiskReason | null;
  healthScore: number;
};

export type QuotaSnapshot = {
  repId: string;
  periodId: string;
  segmentId: string;
  quotaAmount: number;
};

export type RevOpsDataset = {
  timePeriods: TimePeriod[];
  timeframePresets: TimeframePreset[];
  regions: Region[];
  segments: Segment[];
  teams: Team[];
  reps: Rep[];
  quotaSnapshots: QuotaSnapshot[];
  opportunities: Opportunity[];
};

export type RevOpsFilters = {
  timeframeId: string;
  segmentIds: string[];
  regionIds: string[];
  teamIds: string[];
  repIds: string[];
};

export type FilterSelectionKey =
  | 'segmentIds'
  | 'regionIds'
  | 'teamIds'
  | 'repIds';

export type NavItem = {
  label: string;
  path: string;
  shortLabel: string;
  description: string;
};

export type TrendPoint = {
  periodId: string;
  label: string;
  targetAmount: number;
  pipelineAmount: number;
  weightedForecastAmount: number;
  closedWonAmount: number;
  opportunityCount: number;
};

export type MixItem = {
  id: string;
  label: string;
  amount: number;
  count: number;
  share: number;
};

export type SignalTone = 'success' | 'warning' | 'danger' | 'neutral';

export type OverviewSignal = {
  id: string;
  tone: SignalTone;
  title: string;
  description: string;
};

export type StageFunnelRow = {
  stage: OpportunityStage;
  count: number;
  amount: number;
};

export type StageConversionRow = {
  stage: OpportunityStage;
  reachedCount: number;
  progressedCount: number;
  rate: number;
};

export type StageLeakageRow = {
  stage: OpportunityStage;
  lostCount: number;
  lostAmount: number;
  stalledCount: number;
  stalledAmount: number;
};

export type OpportunityRow = {
  id: string;
  name: string;
  accountName: string;
  ownerName: string;
  teamName: string;
  regionName: string;
  segmentName: string;
  stage: OpportunityStage;
  amount: number;
  daysOpen: number;
  riskLevel: RiskLevel;
  riskReason: RiskReason | null;
  forecastCategory: ForecastCategory;
  isClosed: boolean;
  outcome: OpportunityOutcome;
};

export type PerformanceRow = {
  ownerId: string;
  ownerName: string;
  ownerType: 'rep' | 'team';
  regionName: string;
  quotaAmount: number;
  closedWonAmount: number;
  weightedForecastAmount: number;
  pipelineAmount: number;
  attainmentRate: number;
  forecastAttainmentRate: number;
  winRate: number;
  velocityAmountPerDay: number;
  openDealCount: number;
};

export type ForecastCompositionRow = {
  id: ForecastCategory;
  label: string;
  amount: number;
  share: number;
};

export type RiskRow = {
  id: string;
  label: string;
  amount: number;
  count: number;
  share: number;
};
