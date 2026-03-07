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
  accent: 'bg-accent-primary/80',
  success: 'bg-success/80',
  warning: 'bg-warning/80',
  danger: 'bg-danger/80',
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
      <div className="h-2.5 overflow-hidden rounded-pill bg-surface-alt">
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
