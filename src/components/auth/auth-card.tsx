export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-elevated sm:p-8">
      {children}
    </div>
  );
}

export function AuthCardHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {subtitle ? <p className="mt-2 text-sm leading-relaxed text-muted">{subtitle}</p> : null}
    </div>
  );
}

export function AuthCardFooter({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-6 border-t border-border pt-6 text-center text-sm text-muted">{children}</p>
  );
}
