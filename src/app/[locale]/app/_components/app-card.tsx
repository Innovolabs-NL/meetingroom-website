export function AppCard({
  children,
  className = "",
  interactive = false,
}: {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface p-6 shadow-elevated ${
        interactive ? "card-surface transition-all hover:border-accent/30" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
