import fs from "fs";
import path from "path";

export type LatestReleaseJson = {
  version: string;
  notes: string;
  pub_date: string;
  platforms?: Record<string, { url?: string; signature?: string }>;
};

export type NormalizedRelease = {
  version: string;
  dateLabel: string;
  paragraphs: string[];
  downloadUrl?: string;
  /** True when body comes from mirror/latest.json (typically English). */
  fromMirror?: boolean;
};

function stripInlineMarkdown(s: string): string {
  return s
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/`([^`]+)`/g, "$1");
}

function notesToParagraphs(notes: string): string[] {
  return stripInlineMarkdown(notes)
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);
}

/** Shared parser for mirror JSON and GitHub release bodies. */
export function releaseNotesToParagraphs(notes: string): string[] {
  return notesToParagraphs(notes);
}

function pickWindowsUrl(platforms: LatestReleaseJson["platforms"]): string | undefined {
  if (!platforms) return undefined;
  return (
    platforms["windows-x86_64"]?.url ??
    platforms["windows-x86_64-nsis"]?.url ??
    Object.values(platforms).find((p) => p.url?.includes(".exe"))?.url
  );
}

/**
 * Reads `mirror/latest.json` relative to the website package root (parent = repo root).
 */
export function loadLatestReleaseFromMirror(): NormalizedRelease | null {
  try {
    const filePath = path.join(process.cwd(), "..", "mirror", "latest.json");
    const raw = fs.readFileSync(filePath, "utf8");
    const j = JSON.parse(raw) as LatestReleaseJson;
    const downloadUrl = pickWindowsUrl(j.platforms);
    return {
      version: j.version,
      dateLabel: j.pub_date,
      paragraphs: notesToParagraphs(j.notes),
      downloadUrl,
      fromMirror: true,
    };
  } catch {
    return null;
  }
}

export function formatReleaseDate(locale: string, iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const tag = locale === "en" ? "en-GB" : locale;
  try {
    return d.toLocaleDateString(tag, { day: "numeric", month: "long", year: "numeric" });
  } catch {
    return d.toISOString().slice(0, 10);
  }
}
