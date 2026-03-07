type EmptyStateProps = {
  title: string;
  description: string;
};

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="rounded-soft border border-dashed border-white/10 bg-surface-alt/60 p-5">
      <p className="text-sm font-medium text-text-primary">{title}</p>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        {description}
      </p>
    </div>
  );
}
