import { releaseNotesToParagraphs } from "@/lib/meetingroom-releases";
import type { NormalizedRelease } from "@/lib/meetingroom-releases";

const DEFAULT_PUBLIC_RELEASES_REPO = "Innovolabs-NL/meetingroom-releases";

type GhAsset = {
  name: string;
  browser_download_url: string;
};

type GhRelease = {
  tag_name: string;
  published_at: string;
  body: string | null;
  draft: boolean;
  prerelease: boolean;
  assets: GhAsset[];
};

function releasesRepoFromEnv(): string {
  return (
    process.env.GITHUB_RELEASES_REPO?.trim() ||
    process.env.MEETINGROOM_RELEASES_REPO?.trim() ||
    DEFAULT_PUBLIC_RELEASES_REPO
  );
}

function githubTokenFromEnv(): string | undefined {
  const t = process.env.GITHUB_RELEASES_TOKEN?.trim() || process.env.GITHUB_TOKEN?.trim();
  return t || undefined;
}

function pickWindowsInstallerUrl(assets: GhAsset[]): string | undefined {
  const candidates = assets.filter(
    (a) => /\.exe$/i.test(a.name) && !/\.sig$/i.test(a.name) && !/^latest\.json$/i.test(a.name)
  );
  const setup = candidates.find((a) => /setup|installer|nsis/i.test(a.name));
  return setup?.browser_download_url ?? candidates[0]?.browser_download_url;
}

function tagToVersion(tag: string): string {
  return tag.replace(/^v/i, "").trim();
}

/**
 * Fetches published releases from the public GitHub API (newest first).
 * Use `GITHUB_RELEASES_TOKEN` (or `GITHUB_TOKEN`) on CI to lift rate limits and avoid flaky builds.
 */
export async function fetchGitHubMeetingRoomReleases(options?: {
  repo?: string;
  /** ISR / Data Cache TTL in seconds (Next.js fetch). Default 300. */
  revalidateSeconds?: number;
  token?: string;
  signal?: AbortSignal;
}): Promise<NormalizedRelease[] | null> {
  const repo = options?.repo ?? releasesRepoFromEnv();
  const revalidateSeconds = options?.revalidateSeconds ?? 300;
  const token = options?.token ?? githubTokenFromEnv();

  const url = `https://api.github.com/repos/${repo}/releases?per_page=30`;

  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        "User-Agent": "MeetingRoomWebsite-Changelog",
      },
      signal: options?.signal,
      next: { revalidate: revalidateSeconds },
    });

    if (!res.ok) return null;

    const data = (await res.json()) as GhRelease[];
    if (!Array.isArray(data) || data.length === 0) return null;

    const normalized: NormalizedRelease[] = [];

    for (const r of data) {
      if (r.draft) continue;
      const version = tagToVersion(r.tag_name);
      if (!version) continue;
      const body = typeof r.body === "string" ? r.body : "";
      let paragraphs = releaseNotesToParagraphs(body || "");
      if (paragraphs.length === 0) {
        paragraphs = [];
      }

      normalized.push({
        version,
        dateLabel: r.published_at,
        paragraphs,
        downloadUrl: pickWindowsInstallerUrl(r.assets ?? []),
      });
    }

    return normalized.length > 0 ? normalized : null;
  } catch {
    return null;
  }
}

export function defaultReleasesRepo(): string {
  return DEFAULT_PUBLIC_RELEASES_REPO;
}
