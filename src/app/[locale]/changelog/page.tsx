import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { StaticPageShell } from "@/components/static-page-shell";
import {
  type ChangelogReleaseItem,
  ChangelogReleases,
} from "@/components/changelog-releases";
import { fetchGitHubMeetingRoomReleases } from "@/lib/github-meetingroom-releases";
import { formatReleaseDate, loadLatestReleaseFromMirror } from "@/lib/meetingroom-releases";

/** Regenerate / revalidate changelog from GitHub (seconds). */
export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "standalone" });
  return {
    title: t("changelog.meta.title"),
    description: t("changelog.meta.description"),
  };
}

type HistoryRow = { version: string; date: string; notes: string };

function compareVersionDesc(a: string, b: string): number {
  const parts = (v: string) =>
    v.split(/[.-]/).map((x) => {
      const n = parseInt(x, 10);
      return Number.isNaN(n) ? 0 : n;
    });
  const av = parts(a);
  const bv = parts(b);
  const len = Math.max(av.length, bv.length);
  for (let i = 0; i < len; i++) {
    const da = av[i] ?? 0;
    const db = bv[i] ?? 0;
    if (da !== db) return db - da;
  }
  return 0;
}

function notesToParagraphs(notes: string): string[] {
  return notes
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default async function ChangelogPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "standalone" });

  const downloadLabel = t("changelog.downloadWindows");
  const emptyParagraphsFallback = t("changelog.releaseNotesUnavailable");

  const github = await fetchGitHubMeetingRoomReleases({ revalidateSeconds: revalidate });
  const items: ChangelogReleaseItem[] = [];

  let usesGitHubLive = false;
  let usesMirrorOrEnglishSource = false;

  if (github && github.length > 0) {
    usesGitHubLive = true;
    usesMirrorOrEnglishSource = true;
    const sorted = [...github].sort((x, y) => compareVersionDesc(x.version, y.version));
    for (const r of sorted) {
      const parsed = new Date(r.dateLabel);
      items.push({
        version: r.version,
        date: Number.isNaN(parsed.getTime())
          ? r.dateLabel
          : formatReleaseDate(locale, r.dateLabel),
        dateIso: Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString(),
        paragraphs: r.paragraphs,
        downloadUrl: r.downloadUrl,
        downloadLabel,
      });
    }
  } else {
    const mirror = loadLatestReleaseFromMirror();
    const history = (t.raw("changelog.releases") as HistoryRow[]).slice();
    history.sort((x, y) => compareVersionDesc(x.version, y.version));

    const seen = new Set<string>();

    if (mirror) {
      usesMirrorOrEnglishSource = true;
      const parsed = new Date(mirror.dateLabel);
      items.push({
        version: mirror.version,
        date: Number.isNaN(parsed.getTime())
          ? mirror.dateLabel
          : formatReleaseDate(locale, mirror.dateLabel),
        dateIso: Number.isNaN(parsed.getTime()) ? undefined : parsed.toISOString(),
        paragraphs: mirror.paragraphs,
        downloadUrl: mirror.downloadUrl,
        downloadLabel,
      });
      seen.add(mirror.version);
    }

    for (const row of history) {
      if (seen.has(row.version)) continue;
      seen.add(row.version);
      items.push({
        version: row.version,
        date: row.date,
        paragraphs: notesToParagraphs(row.notes),
      });
    }
  }

  const githubSyncLine = usesGitHubLive ? t("changelog.githubSyncLine") : null;
  const mirrorEnglishHint =
    locale !== "en" && usesMirrorOrEnglishSource && !usesGitHubLive
      ? t("changelog.notesEnglishHint")
      : null;

  return (
    <StaticPageShell locale={locale}>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{t("changelog.headline")}</h1>
      <p className="mt-4 text-muted leading-relaxed">{t("changelog.intro")}</p>
      {githubSyncLine ? (
        <p className="mt-2 text-xs text-muted/90">{githubSyncLine}</p>
      ) : mirrorEnglishHint ? (
        <p className="mt-2 text-xs text-muted/90">{mirrorEnglishHint}</p>
      ) : null}
      <ChangelogReleases
        releases={items}
        emptyParagraphsFallback={usesGitHubLive ? emptyParagraphsFallback : undefined}
      />
    </StaticPageShell>
  );
}
