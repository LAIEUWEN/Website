interface SectionHeaderProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

/** Consistent, assertive section heading: mono eyebrow + oversized uppercase title. */
export function SectionHeader({ index, eyebrow, title, description, action }: SectionHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-6 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        <p className="section-eyebrow mb-4">
          <span className="border-2 border-ink bg-orange px-1.5 py-0.5 text-ink">{index}</span>
          {eyebrow}
        </p>
        <h2 className="section-title">{title}</h2>
        {description && <p className="mt-4 max-w-2xl text-lg text-ink/80">{description}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}
