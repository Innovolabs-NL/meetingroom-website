export function AppPageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <header>
      {badge ? (
        <div className="inline-flex rounded-full border border-border bg-background px-3 py-1 text-xs font-medium text-muted">
          {badge}
        </div>
      ) : null}
      <h1
        className={`font-semibold tracking-tight text-2xl sm:text-3xl ${badge ? "mt-4" : ""}`}
      >
        {title}
      </h1>
      {subtitle ? <p className="mt-2 text-sm leading-relaxed text-muted sm:text-base">{subtitle}</p> : null}
    </header>
  );
}
