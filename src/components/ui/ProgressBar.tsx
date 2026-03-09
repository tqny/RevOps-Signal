import { cn } from '../../lib/utils';

type ProgressBarTone = 'accent' | 'success' | 'warning' | 'danger';

type ProgressBarProps = {
  label: string;
  value: number;
  total?: number;
  valueLabel: string;
  detail?: string;
  tone?: ProgressBarTone;
};

const toneClassMap: Record<ProgressBarTone, string> = {
  accent:
    'bg-[linear-gradient(90deg,rgba(76,215,255,0.9),rgba(111,107,255,0.82))]',
  success:
    'bg-[linear-gradient(90deg,rgba(49,196,141,0.94),rgba(76,215,255,0.74))]',
  warning:
    'bg-[linear-gradient(90deg,rgba(245,185,76,0.94),rgba(111,107,255,0.7))]',
  danger:
    'bg-[linear-gradient(90deg,rgba(240,82,82,0.9),rgba(245,185,76,0.72))]',
};

export function ProgressBar({
  label,
  value,
  total = 1,
  valueLabel,
  detail,
  tone = 'accent',
}: ProgressBarProps) {
  const width = total <= 0 ? 0 : Math.min((value / total) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-sm text-text-secondary">{valueLabel}</p>
      </div>
      <div className="h-2.5 overflow-hidden rounded-pill border border-white/6 bg-surface-alt/85 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)]">
        <div
          className={cn(
            'h-full rounded-pill transition-all',
            toneClassMap[tone],
          )}
          style={{ width: `${width}%` }}
        />
      </div>
      {detail ? <p className="text-xs text-text-muted">{detail}</p> : null}
    </div>
  );
}
