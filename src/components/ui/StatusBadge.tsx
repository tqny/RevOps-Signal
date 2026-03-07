import type { PropsWithChildren } from 'react';
import { cn } from '../../lib/utils';

type StatusVariant = 'accent' | 'neutral' | 'success' | 'warning' | 'danger';

const variantClassMap: Record<StatusVariant, string> = {
  accent: 'border-accent-primary/30 bg-accent-primary/16 text-accent-secondary',
  neutral: 'border-white/8 bg-surface-alt/80 text-text-secondary',
  success: 'border-success/25 bg-success/14 text-success',
  warning: 'border-warning/25 bg-warning/14 text-warning',
  danger: 'border-danger/25 bg-danger/14 text-danger',
};

type StatusBadgeProps = PropsWithChildren<{
  variant?: StatusVariant;
}>;

export function StatusBadge({
  children,
  variant = 'neutral',
}: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-pill border px-3 py-1 text-xs font-medium',
        variantClassMap[variant],
      )}
    >
      {children}
    </span>
  );
}
