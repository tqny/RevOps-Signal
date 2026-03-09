import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import type {
  StageConversionRow,
  StageFunnelRow,
  StageLeakageRow,
} from '../../types/revops';
import {
  formatCompactCurrency,
  formatCount,
  formatCurrency,
  formatPercentage,
} from '../../lib/formatters';

const stagePalette = [
  {
    fill: 'rgba(76,215,255,0.82)',
    glow: 'rgba(76,215,255,0.18)',
    stroke: 'rgba(76,215,255,0.3)',
  },
  {
    fill: 'rgba(96,165,250,0.82)',
    glow: 'rgba(96,165,250,0.18)',
    stroke: 'rgba(96,165,250,0.28)',
  },
  {
    fill: 'rgba(111,107,255,0.82)',
    glow: 'rgba(111,107,255,0.18)',
    stroke: 'rgba(111,107,255,0.28)',
  },
  {
    fill: 'rgba(155,124,255,0.82)',
    glow: 'rgba(155,124,255,0.18)',
    stroke: 'rgba(155,124,255,0.3)',
  },
  {
    fill: 'rgba(245,185,76,0.82)',
    glow: 'rgba(245,185,76,0.18)',
    stroke: 'rgba(245,185,76,0.28)',
  },
] as const;

function formatAxisCurrency(value: number | string) {
  return formatCompactCurrency(Number(value));
}

function formatRateAxis(value: number | string) {
  return formatPercentage(Number(value));
}

function ConversionTooltip({ active, payload }: TooltipContentProps) {
  const row = payload?.[0]?.payload as StageConversionRow | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[220px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.stage}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Progressed</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(row.rate)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Reached stage</span>
          <span className="font-medium text-text-primary">
            {formatCount(row.reachedCount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Moved forward</span>
          <span className="font-medium text-text-primary">
            {formatCount(row.progressedCount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Did not progress</span>
          <span className="font-medium text-text-primary">
            {formatCount(row.dropOffCount)}
          </span>
        </div>
      </div>
    </div>
  );
}

function LeakageTooltip({ active, payload }: TooltipContentProps) {
  const row = payload?.[0]?.payload as StageLeakageRow | undefined;

  if (!active || !row) {
    return null;
  }

  return (
    <div className="min-w-[240px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{row.stage}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Lost amount</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.lostAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Stalled amount</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.stalledAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Total exposed</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(row.totalExposedAmount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Exposed deals</span>
          <span className="font-medium text-text-primary">
            {formatCount(row.totalExposedCount)}
          </span>
        </div>
      </div>
    </div>
  );
}

type PipelineFunnelChartProps = {
  data: StageFunnelRow[];
};

export function PipelineFunnelChart({ data }: PipelineFunnelChartProps) {
  const maxShare = Math.max(...data.map((row) => row.share), 0.01);

  return (
    <div className="space-y-4">
      {data.map((row, index) => {
        const palette = stagePalette[index % stagePalette.length] ?? stagePalette[0];
        const width =
          row.count === 0
            ? 18
            : Math.max((row.share / maxShare) * 100, 28);

        return (
          <div key={row.stage} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-pill border border-white/10 bg-surface-alt/75 text-xs font-semibold text-text-secondary">
                  {index + 1}
                </span>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {row.stage}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatCount(row.count)} active deals
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {formatCompactCurrency(row.amount)}
                </p>
                <p className="text-xs text-text-muted">
                  {formatPercentage(row.share)} of open pipeline
                </p>
              </div>
            </div>

            <div className="flex justify-center rounded-soft border border-white/8 bg-surface-alt/35 px-3 py-2">
              <div
                className="flex h-12 items-center justify-between gap-3 rounded-[16px] border px-4 text-sm shadow-panel"
                style={{
                  width: `${width}%`,
                  minWidth: row.count === 0 ? '140px' : '220px',
                  background: `linear-gradient(90deg, ${palette.fill}, ${palette.glow})`,
                  borderColor: palette.stroke,
                }}
              >
                <span className="font-medium text-text-primary">{row.stage}</span>
                <span className="text-xs font-medium text-text-primary/90">
                  {formatCount(row.count)} deals
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type PipelineConversionChartProps = {
  data: StageConversionRow[];
};

export function PipelineConversionChart({
  data,
}: PipelineConversionChartProps) {
  return (
    <div className="space-y-4">
      <div className="h-[280px] rounded-soft border border-white/8 bg-surface-alt/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 8, right: 28, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              horizontal={false}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
            <XAxis
              type="number"
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
              tickFormatter={formatRateAxis}
            />
            <YAxis
              dataKey="stage"
              type="category"
              axisLine={false}
              tickLine={false}
              width={96}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={ConversionTooltip}
            />
            <Bar
              dataKey="rate"
              name="Progression rate"
              radius={[999, 999, 999, 999]}
              barSize={18}
            >
              {data.map((row, index) => (
                <Cell
                  key={row.stage}
                  fill={
                    stagePalette[index % stagePalette.length]?.fill ??
                    stagePalette[0].fill
                  }
                />
              ))}
              <LabelList
                dataKey="rate"
                position="right"
                offset={10}
                fill="var(--rs-text-primary)"
                fontSize={12}
                formatter={(value) => formatPercentage(Number(value ?? 0))}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-3 text-sm text-text-secondary">
        Progression is a selector-backed stage proxy: each row shows how many
        deals that reached a stage are already visible in a later stage.
      </div>
    </div>
  );
}

type PipelineLeakageChartProps = {
  data: StageLeakageRow[];
};

export function PipelineLeakageChart({ data }: PipelineLeakageChartProps) {
  return (
    <div className="space-y-4">
      <div className="h-[280px] rounded-soft border border-white/8 bg-surface-alt/40 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 12, right: 8, left: -8, bottom: 0 }}
          >
            <CartesianGrid
              vertical={false}
              stroke="rgba(255,255,255,0.08)"
              strokeDasharray="4 4"
            />
            <XAxis
              dataKey="stage"
              axisLine={false}
              tickLine={false}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              width={72}
              tick={{ fill: 'var(--rs-text-muted)', fontSize: 12 }}
              tickFormatter={formatAxisCurrency}
            />
            <Tooltip
              cursor={{ fill: 'rgba(255,255,255,0.03)' }}
              content={LeakageTooltip}
            />
            <Bar
              dataKey="lostAmount"
              name="Lost"
              stackId="exposure"
              fill="rgba(240,82,82,0.82)"
              radius={[10, 10, 0, 0]}
              barSize={28}
            />
            <Bar
              dataKey="stalledAmount"
              name="Stalled / aging"
              stackId="exposure"
              fill="rgba(245,185,76,0.82)"
              radius={[10, 10, 0, 0]}
              barSize={28}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap gap-3">
        <div className="flex items-center gap-2 rounded-pill border border-white/8 bg-surface-alt/55 px-3 py-1.5 text-xs text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-full bg-danger" />
          <span>Lost amount</span>
        </div>
        <div className="flex items-center gap-2 rounded-pill border border-white/8 bg-surface-alt/55 px-3 py-1.5 text-xs text-text-secondary">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span>Stalled or aging amount</span>
        </div>
      </div>
    </div>
  );
}
