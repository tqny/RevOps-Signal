import {
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Line,
  Pie,
  PieChart,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { TooltipContentProps } from 'recharts';
import { ResponsiveChartContainer } from '../../components/charts/ResponsiveChartContainer';
import type { MixItem, TrendPoint } from '../../types/revops';
import {
  formatCompactCurrency,
  formatCount,
  formatCurrency,
  formatPercentage,
} from '../../lib/formatters';

const trendLegend = [
  {
    id: 'pipeline',
    label: 'Open pipeline',
    color: 'var(--rs-accent-secondary)',
    dotClassName: 'bg-accent-secondary',
  },
  {
    id: 'weighted',
    label: 'Weighted forecast',
    color: 'var(--rs-accent-primary)',
    dotClassName: 'bg-accent-primary',
  },
  {
    id: 'target',
    label: 'Target pace',
    color: 'var(--rs-warning)',
    dotClassName: 'bg-warning',
  },
  {
    id: 'won',
    label: 'Closed won',
    color: 'var(--rs-success)',
    dotClassName: 'bg-success',
  },
] as const;

const mixPalette = [
  'var(--rs-accent-primary)',
  'var(--rs-accent-secondary)',
  'var(--rs-accent-tertiary)',
  'var(--rs-success)',
  'var(--rs-warning)',
] as const;

function formatAxisCurrency(value: number | string) {
  return formatCompactCurrency(Number(value));
}

function getTooltipNumber(
  value: number | string | ReadonlyArray<number | string> | undefined,
) {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'string') {
    return Number(value);
  }

  if (Array.isArray(value) && value.length > 0) {
    return Number(value[0]);
  }

  return 0;
}

function TrendTooltip({ active, label, payload }: TooltipContentProps) {
  if (!active || !payload?.length) {
    return null;
  }

  const rows = payload.filter((entry) => getTooltipNumber(entry.value) > 0);

  return (
    <div className="min-w-[220px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-text-muted">
        {label}
      </p>
      <div className="mt-3 space-y-2">
        {rows.map((entry) => (
          <div
            key={String(entry.dataKey ?? entry.name)}
            className="flex items-center justify-between gap-4 text-sm"
          >
            <div className="flex items-center gap-2 text-text-secondary">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  backgroundColor: entry.color ?? 'var(--rs-text-muted)',
                }}
              />
              <span>{entry.name}</span>
            </div>
            <span className="font-medium text-text-primary">
              {formatCurrency(getTooltipNumber(entry.value))}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function MixTooltip({ active, payload }: TooltipContentProps) {
  const item = payload?.[0]?.payload as MixItem | undefined;

  if (!active || !item) {
    return null;
  }

  return (
    <div className="min-w-[220px] rounded-soft border border-white/10 bg-surface-elevated/96 p-4 shadow-panel">
      <p className="text-sm font-medium text-text-primary">{item.label}</p>
      <div className="mt-3 space-y-2 text-sm text-text-secondary">
        <div className="flex items-center justify-between gap-4">
          <span>Visible amount</span>
          <span className="font-medium text-text-primary">
            {formatCurrency(item.amount)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Share</span>
          <span className="font-medium text-text-primary">
            {formatPercentage(item.share)}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Deals</span>
          <span className="font-medium text-text-primary">
            {formatCount(item.count)}
          </span>
        </div>
      </div>
    </div>
  );
}

type OverviewTrendChartProps = {
  data: TrendPoint[];
};

export function OverviewTrendChart({ data }: OverviewTrendChartProps) {
  return (
    <div className="space-y-4">
      <ResponsiveChartContainer
        className="h-[320px] rounded-soft border border-white/8 bg-surface-alt/40 p-3"
        minHeight={320}
      >
        <ComposedChart
          data={data}
          margin={{ top: 16, right: 8, left: -12, bottom: 0 }}
        >
          <CartesianGrid
            vertical={false}
            stroke="rgba(255,255,255,0.08)"
            strokeDasharray="4 4"
          />
          <XAxis
            dataKey="label"
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
            cursor={{ stroke: 'rgba(255,255,255,0.16)', strokeWidth: 1 }}
            content={TrendTooltip}
          />
          <Bar
            dataKey="pipelineAmount"
            name="Open pipeline"
            fill="rgba(76,215,255,0.18)"
            radius={[12, 12, 0, 0]}
            barSize={28}
          />
          <Line
            type="monotone"
            dataKey="weightedForecastAmount"
            name="Weighted forecast"
            stroke="var(--rs-accent-primary)"
            strokeWidth={3}
            dot={{
              r: 4,
              fill: 'var(--rs-accent-primary)',
              stroke: 'var(--rs-surface-alt)',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 6,
              fill: 'var(--rs-accent-primary)',
              stroke: 'var(--rs-surface-alt)',
              strokeWidth: 2,
            }}
          />
          <Line
            type="monotone"
            dataKey="targetAmount"
            name="Target pace"
            stroke="var(--rs-warning)"
            strokeWidth={2}
            strokeDasharray="6 6"
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="closedWonAmount"
            name="Closed won"
            stroke="var(--rs-success)"
            strokeWidth={2}
            dot={{
              r: 3,
              fill: 'var(--rs-success)',
              stroke: 'var(--rs-surface-alt)',
              strokeWidth: 2,
            }}
            activeDot={{
              r: 5,
              fill: 'var(--rs-success)',
              stroke: 'var(--rs-surface-alt)',
              strokeWidth: 2,
            }}
          />
        </ComposedChart>
      </ResponsiveChartContainer>

      <div className="flex flex-wrap gap-3">
        {trendLegend.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-2 rounded-pill border border-white/8 bg-surface-alt/55 px-3 py-1.5 text-xs text-text-secondary"
          >
            <span className={`h-2.5 w-2.5 rounded-full ${item.dotClassName}`} />
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type OverviewMixChartProps = {
  items: MixItem[];
};

export function OverviewMixChart({ items }: OverviewMixChartProps) {
  const totalAmount = items.reduce((total, item) => total + item.amount, 0);
  const totalCount = items.reduce((total, item) => total + item.count, 0);

  return (
    <div className="grid gap-6 2xl:grid-cols-[minmax(240px,0.85fr)_minmax(0,1.15fr)] 2xl:items-center">
      <ResponsiveChartContainer
        className="relative h-[260px] rounded-soft border border-white/8 bg-surface-alt/40 p-3"
        minHeight={260}
      >
        <PieChart>
          <Tooltip content={MixTooltip} />
          <Pie
            data={items}
            dataKey="amount"
            nameKey="label"
            innerRadius={72}
            outerRadius={104}
            paddingAngle={items.length > 1 ? 3 : 0}
            stroke="rgba(17,20,27,0.96)"
            strokeWidth={4}
          >
            {items.map((item, index) => (
              <Cell key={item.id} fill={mixPalette[index % mixPalette.length]} />
            ))}
          </Pie>
        </PieChart>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
            Visible book
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-text-primary">
            {formatCompactCurrency(totalAmount)}
          </p>
          <p className="mt-1 text-xs text-text-muted">
            {formatCount(totalCount)} opportunities
          </p>
        </div>
      </ResponsiveChartContainer>

      <div className="space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="rounded-soft border border-white/8 bg-surface-alt/45 px-4 py-3"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor: mixPalette[index % mixPalette.length],
                  }}
                />
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {item.label}
                  </p>
                  <p className="text-xs text-text-muted">
                    {formatCount(item.count)} opportunities
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">
                  {formatCompactCurrency(item.amount)}
                </p>
                <p className="text-xs text-text-muted">
                  {formatPercentage(item.share)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-pill bg-surface">
              <div
                className="h-full rounded-pill"
                style={{
                  width: `${Math.max(item.share * 100, 6)}%`,
                  backgroundColor: mixPalette[index % mixPalette.length],
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
