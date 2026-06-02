import { MobileWarningCallout } from "@/components/mobile-warning-callout";

export type ChangelogReleaseItem = {
  version: string;
  date: string;
  dateIso?: string;
  paragraphs: string[];
  downloadUrl?: string;
  downloadLabel?: string;
  notesLanguageHint?: string;
};

type Props = {
  releases: ChangelogReleaseItem[];
  /** When a GitHub release has no body text */
  emptyParagraphsFallback?: string;
  /** Shown on viewports below `md` instead of the download link */
  downloadMobileHint?: string;
};

export function ChangelogReleases({ releases, emptyParagraphsFallback, downloadMobileHint }: Props) {
  return (
    <div className="mt-12 space-y-8">
      {releases.map((r, i) => (
        <article
          key={`${r.version}-${i}`}
          className="rounded-xl border border-border bg-surface/40 p-6 shadow-sm transition-colors hover:border-border-light md:p-8"
        >
          <header className="flex flex-wrap items-baseline justify-between gap-3 gap-y-2">
            <div className="flex flex-wrap items-baseline gap-3">
              <h2 className="text-lg font-semibold tracking-tight text-foreground">v{r.version}</h2>
              {r.dateIso ? (
                <time dateTime={r.dateIso} className="text-sm text-muted">
                  {r.date}
                </time>
              ) : (
                <span className="text-sm text-muted">{r.date}</span>
              )}
            </div>
            {r.downloadUrl && r.downloadLabel ? (
              downloadMobileHint ? (
                <>
                  <div className="hidden md:block">
                    <a
                      href={r.downloadUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block rounded-lg border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/20"
                    >
                      {r.downloadLabel}
                    </a>
                  </div>
                  <MobileWarningCallout className="w-full">{downloadMobileHint}</MobileWarningCallout>
                </>
              ) : (
                <a
                  href={r.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-lg border border-accent/35 bg-accent/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-accent transition-colors hover:bg-accent/20"
                >
                  {r.downloadLabel}
                </a>
              )
            ) : null}
          </header>
          {r.notesLanguageHint ? (
            <p className="mt-3 text-xs text-muted/80">{r.notesLanguageHint}</p>
          ) : null}
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-muted">
            {r.paragraphs.length > 0 ? (
              r.paragraphs.map((para, pi) => <p key={pi}>{para}</p>)
            ) : emptyParagraphsFallback ? (
              <p className="italic opacity-80">{emptyParagraphsFallback}</p>
            ) : null}
          </div>
        </article>
      ))}
    </div>
  );
}
