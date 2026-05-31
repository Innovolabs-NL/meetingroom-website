export function AppSection({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-surface p-6 shadow-elevated sm:p-8 ${className}`}>
      <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
      {description ? <p className="mt-1 text-sm text-muted">{description}</p> : null}
      <div className="mt-6">{children}</div>
    </section>
  );
}
