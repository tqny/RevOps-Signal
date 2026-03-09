import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';

type StatusVariant = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

const variantClassMap: Record<
  StatusVariant,
  { wrapper: string; dot: string }
> = {
  accent: {
    wrapper:
      'border-accent-primary/24 bg-[linear-gradient(180deg,rgba(111,107,255,0.24),rgba(111,107,255,0.1))] text-accent-secondary',
    dot: 'bg-accent-secondary',
  },
  neutral: {
    wrapper:
      'border-white/8 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))] text-text-secondary',
    dot: 'bg-text-muted',
  },
  success: {
    wrapper:
      'border-success/24 bg-[linear-gradient(180deg,rgba(49,196,141,0.22),rgba(49,196,141,0.08))] text-success',
    dot: 'bg-success',
  },
  warning: {
    wrapper:
      'border-warning/24 bg-[linear-gradient(180deg,rgba(245,185,76,0.22),rgba(245,185,76,0.08))] text-warning',
    dot: 'bg-warning',
  },
  danger: {
    wrapper:
      'border-danger/24 bg-[linear-gradient(180deg,rgba(240,82,82,0.22),rgba(240,82,82,0.08))] text-danger',
    dot: 'bg-danger',
  },
};

type StatusBadgeProps = PropsWithChildren<{
  variant?: StatusVariant;
}>;

export function StatusBadge({
  children,
  variant = 'neutral',
}: StatusBadgeProps) {
  const variantClasses = variantClassMap[variant];

  return (
    <span
      className={cn(
        'inline-flex items-center gap-2 rounded-pill border px-3 py-1.5 text-[11px] font-semibold tracking-[0.08em]',
        variantClasses.wrapper,
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', variantClasses.dot)} />
      {children}
    </span>
  );
}
