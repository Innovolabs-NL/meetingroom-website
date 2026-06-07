"use client";

import { motion } from "framer-motion";
import { MobileWarningCallout } from "@/components/mobile-warning-callout";
import type { ChangelogReleaseItem } from "@/components/changelog-releases";
import {
  isPlatformCompatible,
  platformMatchesDownload,
  useDetectedDownloadPlatform,
  type DetectedDownloadPlatform,
} from "@/lib/detect-download-platform";

type Props = {
  releases: ChangelogReleaseItem[];
  headline: string;
  intro: string;
  label: string;
  syncHint: string | null;
  platformMessages: {
    checking: string;
    generic: string;
    compatibleWindows: string;
    compatibleMac: string;
    incompatibleIntelMac: string;
    incompatibleOther: string;
  };
  emptyParagraphsFallback?: string;
  downloadMobileHint?: string;
  labels: {
    latestBadge: string;
    previousReleases: string;
    downloadTitle: string;
    windows: string;
    mac: string;
    downloadRecommended: string;
  };
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function WindowsIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M3 5.5 10.5 4.5V12H3V5.5zm0 13V13h7.5v8.5L3 18.5zM12 4.2 21 3v9h-9V4.2zm0 16.8V13h9v8l-9-1.5z" />
    </svg>
  );
}

function AppleIcon({ className = "" }: { className?: string }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M16.365 1.43c0 1.14-.493 2.27-1.177 3.08-.744.9-1.99 1.57-3.124 1.47-.12-1.09.507-2.26 1.177-3.01.784-.86 2.173-1.56 3.124-1.54zm1.38 4.08c-1.724-.1-3.198.984-4.005.984-.806 0-2.05-.96-3.38-.94-1.738.03-3.347 1.01-4.24 2.57-1.806 3.13-.465 7.76 1.295 10.3.86 1.24 1.885 2.63 3.23 2.58 1.305-.05 1.795-.84 3.376-.84 1.58 0 2.005.84 3.376.81 1.394-.02 2.275-1.24 3.125-2.49.985-1.43 1.39-2.82 1.415-2.89-.03-.01-2.715-1.04-2.745-4.13-.025-2.58 2.115-3.81 2.215-3.88-1.205-1.76-3.08-1.98-3.745-2.02z" />
    </svg>
  );
}

function platformFromLabel(label: string): "windows" | "mac" | "other" {
  if (/windows|x64|win/i.test(label)) return "windows";
  if (/mac|apple|silicon|m\d/i.test(label)) return "mac";
  return "other";
}

function PlatformRequirementsCallout({
  detected,
  messages,
}: {
  detected: DetectedDownloadPlatform | "pending";
  messages: Props["platformMessages"];
}) {
  type CalloutTone = "pending" | "success" | "error" | "info";

  let tone: CalloutTone = "info";
  let title = "";
  let body = messages.generic;

  if (detected === "pending") {
    tone = "pending";
    body = messages.checking;
  } else if (detected === "windows") {
    tone = "success";
    title = messages.compatibleWindows;
    body = messages.generic;
  } else if (detected === "mac-silicon") {
    tone = "success";
    title = messages.compatibleMac;
    body = messages.generic;
  } else if (detected === "mac-unsupported") {
    tone = "error";
    title = messages.incompatibleIntelMac;
    body = messages.generic;
  } else if (detected === "linux" || detected === "mobile") {
    tone = "error";
    title = messages.incompatibleOther;
    body = messages.generic;
  }

  const toneStyles: Record<CalloutTone, { box: string; icon: string; title: string; body: string }> = {
    pending: {
      box: "border-border bg-surface/70",
      icon: "text-muted",
      title: "text-foreground",
      body: "text-muted",
    },
    success: {
      box: "border-emerald-500/35 bg-emerald-500/10",
      icon: "text-emerald-400",
      title: "text-emerald-100",
      body: "text-muted",
    },
    error: {
      box: "border-amber-500/35 bg-amber-500/10",
      icon: "text-amber-400",
      title: "text-amber-100",
      body: "text-amber-100/80",
    },
    info: {
      box: "border-border bg-surface/70",
      icon: "text-accent",
      title: "text-foreground",
      body: "text-muted",
    },
  };

  const styles = toneStyles[tone];

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      aria-live="polite"
      className={`mt-6 flex gap-3 rounded-xl border px-4 py-3.5 ${styles.box}`}
    >
      {tone === "success" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`mt-0.5 shrink-0 ${styles.icon}`}
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : tone === "error" ? (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`mt-0.5 shrink-0 ${styles.icon}`}
        >
          <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          <path d="M12 9v4" />
          <path d="M12 17h.01" />
        </svg>
      ) : (
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className={`mt-0.5 shrink-0 ${styles.icon}`}
        >
          <rect x="2" y="3" width="20" height="14" rx="2" />
          <path d="M8 21h8" />
          <path d="M12 17v4" />
        </svg>
      )}
      <div className="space-y-1">
        {title ? (
          <p className={`text-sm font-semibold leading-relaxed ${styles.title}`}>{title}</p>
        ) : null}
        <p className={`text-sm leading-relaxed ${styles.body}`}>{body}</p>
      </div>
    </div>
  );
}
function DownloadButton({
  href,
  label,
  dimmed = false,
  recommended = false,
  recommendedLabel,
  compact = false,
}: {
  href: string;
  label: string;
  dimmed?: boolean;
  recommended?: boolean;
  recommendedLabel?: string;
  compact?: boolean;
}) {
  const platform = platformFromLabel(label);

  if (compact) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 rounded-lg border border-border/60 px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:border-border hover:bg-surface/60 hover:text-foreground"
      >
        {platform === "windows" ? (
          <WindowsIcon className="h-3.5 w-3.5 opacity-60" />
        ) : platform === "mac" ? (
          <AppleIcon className="h-3.5 w-3.5 opacity-60" />
        ) : null}
        <span>{label}</span>
      </a>
    );
  }

  const link = (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={recommended && recommendedLabel ? `${label} — ${recommendedLabel}` : label}
      className={`inline-flex items-center justify-center gap-2.5 rounded-xl font-semibold transition-all ${
        recommended
          ? "min-h-12 w-full px-5 text-base text-white sm:min-w-[11rem] border border-white/20 bg-accent shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_12px_32px_-8px_rgba(59,130,246,0.65)] hover:scale-[1.02] hover:bg-accent-hover hover:shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_16px_40px_-6px_rgba(59,130,246,0.75)]"
          : dimmed
            ? "min-h-9 flex-1 px-3 text-xs text-muted/60 sm:flex-none sm:min-w-[7.5rem] border border-dashed border-border/50 bg-transparent hover:border-border hover:text-muted"
            : "min-h-11 flex-1 px-4 text-sm sm:flex-none sm:min-w-[9.5rem] border border-border bg-background text-foreground hover:border-accent/35 hover:bg-surface-hover"
      }`}
    >
      {platform === "windows" ? (
        <WindowsIcon className={recommended ? "opacity-95" : dimmed ? "opacity-50" : "text-muted"} />
      ) : platform === "mac" ? (
        <AppleIcon className={recommended ? "opacity-95" : dimmed ? "opacity-50" : "text-muted"} />
      ) : null}
      <span>{label}</span>
      {recommended ? (
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
          className="opacity-90"
        >
          <path d="M5 12h14" />
          <path d="m12 5 7 7-7 7" />
        </svg>
      ) : null}
    </a>
  );

  if (!recommended || !recommendedLabel) return link;

  return (
    <div className="flex w-full flex-col gap-1.5 sm:w-auto">
      <span className="inline-flex w-fit items-center rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-md shadow-emerald-500/30">
        {recommendedLabel}
      </span>
      {link}
    </div>
  );
}

function sortDownloadsForPlatform(
  downloads: NonNullable<ChangelogReleaseItem["downloads"]>,
  detected: DetectedDownloadPlatform | "pending"
) {
  if (detected === "pending" || !detected) return downloads;
  return [...downloads].sort((a, b) => {
    const aMatch = platformMatchesDownload(detected, a.label);
    const bMatch = platformMatchesDownload(detected, b.label);
    if (aMatch === bMatch) return 0;
    return aMatch ? -1 : 1;
  });
}

function DownloadButtons({
  downloads,
  title,
  mobileHint,
  detectedPlatform,
  recommendedLabel,
  variant = "compact",
}: {
  downloads: NonNullable<ChangelogReleaseItem["downloads"]>;
  title?: string;
  mobileHint?: string;
  detectedPlatform: DetectedDownloadPlatform | "pending";
  recommendedLabel: string;
  variant?: "featured" | "compact";
}) {
  const isFeatured = variant === "featured";
  const sorted = isFeatured
    ? sortDownloadsForPlatform(downloads, detectedPlatform)
    : downloads;
  const hasRecommendation =
    isFeatured && detectedPlatform !== "pending" && isPlatformCompatible(detectedPlatform);
  const hideButtonsOnMobile = Boolean(mobileHint);
  const showMobileHint =
    Boolean(mobileHint) && !(isFeatured && detectedPlatform === "mac-unsupported");

  return (
    <div className={isFeatured ? "space-y-3" : "space-y-2"}>
      {title ? (
        <p
          className={
            isFeatured
              ? "text-xs font-semibold uppercase tracking-widest text-muted"
              : "text-[11px] font-medium uppercase tracking-wide text-muted/70"
          }
        >
          {title}
        </p>
      ) : null}
      <div
        className={
          hideButtonsOnMobile
            ? isFeatured
              ? `hidden gap-3 md:flex ${hasRecommendation ? "flex-col sm:flex-row sm:items-end" : "flex-col sm:flex-row sm:flex-wrap"}`
              : "hidden flex-wrap gap-2 md:flex"
            : isFeatured
              ? `flex gap-3 ${hasRecommendation ? "flex-col sm:flex-row sm:items-end" : "flex-col sm:flex-row sm:flex-wrap"}`
              : "flex flex-wrap gap-2"
        }
      >
        {sorted.map((d) => {
          const recommended =
            hasRecommendation && platformMatchesDownload(detectedPlatform, d.label);
          return (
            <DownloadButton
              key={d.label}
              href={d.url}
              label={d.label}
              compact={!isFeatured}
              dimmed={hasRecommendation && !recommended}
              recommended={recommended}
              recommendedLabel={recommendedLabel}
            />
          );
        })}
      </div>
      {showMobileHint ? <MobileWarningCallout>{mobileHint}</MobileWarningCallout> : null}
    </div>
  );
}

function ReleaseNotes({
  paragraphs,
  fallback,
}: {
  paragraphs: string[];
  fallback?: string;
}) {
  if (paragraphs.length === 0) {
    return fallback ? <p className="text-sm italic text-muted/80">{fallback}</p> : null;
  }

  return (
    <div className="space-y-4">
      {paragraphs.map((para, i) => {
        const lines = para.split("\n").map((l) => l.trim()).filter(Boolean);
        const isBulletList =
          lines.length > 1 && lines.every((line) => /^[-*•]\s/.test(line));

        if (isBulletList) {
          return (
            <ul key={i} className="space-y-2.5">
              {lines.map((line, li) => (
                <li key={li} className="flex gap-3 text-sm leading-relaxed text-muted">
                  <span
                    className="mt-[0.55rem] h-1.5 w-1.5 shrink-0 rounded-full bg-accent/70"
                    aria-hidden
                  />
                  <span>{line.replace(/^[-*•]\s*/, "")}</span>
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p key={i} className="text-sm leading-relaxed text-muted">
            {para}
          </p>
        );
      })}
    </div>
  );
}

function FeaturedRelease({
  release,
  labels,
  emptyParagraphsFallback,
  downloadMobileHint,
  detectedPlatform,
}: {
  release: ChangelogReleaseItem;
  labels: Props["labels"];
  emptyParagraphsFallback?: string;
  downloadMobileHint?: string;
  detectedPlatform: DetectedDownloadPlatform | "pending";
}) {
  return (
    <motion.article
      variants={fadeUp}
      initial="initial"
      animate="animate"
      className="relative overflow-hidden rounded-2xl border border-accent/25 bg-gradient-to-br from-accent-muted/80 via-surface to-surface p-6 shadow-elevated md:p-8"
    >
      <div
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-accent/15 blur-3xl"
        aria-hidden
      />
      <div className="relative">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex rounded-full border border-accent/35 bg-accent/15 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-accent">
            {labels.latestBadge}
          </span>
          {release.dateIso ? (
            <time dateTime={release.dateIso} className="text-sm text-muted">
              {release.date}
            </time>
          ) : (
            <span className="text-sm text-muted">{release.date}</span>
          )}
        </div>

        <h2 className="mt-4 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
          v{release.version}
        </h2>

        {release.downloads && release.downloads.length > 0 ? (
          <div className="mt-6 border-t border-border/60 pt-6">
            <DownloadButtons
              downloads={release.downloads}
              variant="featured"
              title={labels.downloadTitle}
              mobileHint={downloadMobileHint}
              detectedPlatform={detectedPlatform}
              recommendedLabel={labels.downloadRecommended}
            />
          </div>
        ) : null}

        <div className="mt-6 border-t border-border/60 pt-6">
          <ReleaseNotes paragraphs={release.paragraphs} fallback={emptyParagraphsFallback} />
        </div>
      </div>
    </motion.article>
  );
}

function TimelineRelease({
  release,
  index,
  emptyParagraphsFallback,
  downloadMobileHint,
  labels,
  detectedPlatform,
}: {
  release: ChangelogReleaseItem;
  index: number;
  emptyParagraphsFallback?: string;
  downloadMobileHint?: string;
  labels: Props["labels"];
  detectedPlatform: DetectedDownloadPlatform | "pending";
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.05, 0.25) }}
      className="relative pl-10 md:pl-12"
    >
      <div
        className="absolute left-[3px] top-2 h-5 w-5 rounded-full border-2 border-border bg-background md:left-[5px] md:h-6 md:w-6"
        aria-hidden
      />
      <div className="rounded-xl border border-border bg-surface/50 p-5 transition-colors hover:border-border-light hover:bg-surface md:p-6">
        <header className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
          <div className="flex flex-wrap items-baseline gap-3">
            <h3 className="text-lg font-semibold tracking-tight text-foreground">v{release.version}</h3>
            {release.dateIso ? (
              <time dateTime={release.dateIso} className="text-sm text-muted">
                {release.date}
              </time>
            ) : (
              <span className="text-sm text-muted">{release.date}</span>
            )}
          </div>
        </header>

        {release.downloads && release.downloads.length > 0 ? (
          <div className="mt-4">
            <DownloadButtons
              downloads={release.downloads}
              title={labels.downloadTitle}
              mobileHint={downloadMobileHint}
              detectedPlatform={detectedPlatform}
              recommendedLabel={labels.downloadRecommended}
            />
          </div>
        ) : null}

        <div className={release.downloads?.length ? "mt-4 border-t border-border/60 pt-4" : "mt-4"}>
          <ReleaseNotes paragraphs={release.paragraphs} fallback={emptyParagraphsFallback} />
        </div>
      </div>
    </motion.article>
  );
}

export function ChangelogPageContent({
  releases,
  headline,
  intro,
  label,
  syncHint,
  platformMessages,
  emptyParagraphsFallback,
  downloadMobileHint,
  labels,
}: Props) {
  const [latest, ...previous] = releases;
  const detectedPlatform = useDetectedDownloadPlatform();

  return (
    <div>
      <motion.header
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as const }}
        className="max-w-2xl"
      >
        <p className="text-sm font-semibold uppercase tracking-widest text-accent">{label}</p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{headline}</h1>
        <p className="mt-4 text-base leading-relaxed text-muted">{intro}</p>
        <PlatformRequirementsCallout detected={detectedPlatform} messages={platformMessages} />
        {syncHint ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-border bg-surface/60 px-3 py-1.5 text-xs text-muted">
            <span className="relative flex h-2 w-2" aria-hidden>
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/40 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {syncHint}
          </p>
        ) : null}
      </motion.header>

      {latest ? (
        <div className="mt-10 md:mt-12">
          <FeaturedRelease
            release={latest}
            labels={labels}
            emptyParagraphsFallback={emptyParagraphsFallback}
            downloadMobileHint={downloadMobileHint}
            detectedPlatform={detectedPlatform}
          />
        </div>
      ) : null}

      {previous.length > 0 ? (
        <section className="mt-14 md:mt-16">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-muted">
            {labels.previousReleases}
          </h2>
          <div className="relative mt-8 space-y-8">
            <div
              className="absolute bottom-3 left-[12px] top-3 w-px bg-gradient-to-b from-border via-border to-transparent md:left-[16px]"
              aria-hidden
            />
            {previous.map((release, i) => (
              <TimelineRelease
                key={`${release.version}-${i}`}
                release={release}
                index={i}
                labels={labels}
                emptyParagraphsFallback={emptyParagraphsFallback}
                downloadMobileHint={downloadMobileHint}
                detectedPlatform={detectedPlatform}
              />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
