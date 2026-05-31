import type { AppTeam } from "@/lib/app/get-app-context";

export function teamSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/app\/t\/([a-z0-9-]+)/);
  return match?.[1] ?? null;
}

/** Exact match for app routes (`usePathname` from `@i18n/navigation` has no locale prefix). */
export function pathIs(pathname: string, path: string): boolean {
  return pathname === path;
}

export type AppNavState = {
  isOverview: boolean;
  isSetupTeam: boolean;
  isSettings: boolean;
  isHelp: boolean;
  isMembers: boolean;
  isInvites: boolean;
  isTeamSettings: boolean;
  activeTeamSlug: string | null;
  canManageTeam: boolean;
};

export function getAppNavState(
  pathname: string,
  team: AppTeam | null,
): AppNavState {
  const pathTeamSlug = teamSlugFromPath(pathname);
  const activeTeamSlug = pathTeamSlug ?? team?.slug ?? null;
  const canManageTeam = team?.role === "owner" || team?.role === "admin";
  const teamBase = activeTeamSlug ? `/app/t/${activeTeamSlug}` : null;

  return {
    isOverview: pathIs(pathname, "/app"),
    isSetupTeam: pathIs(pathname, "/app/teams"),
    isSettings: pathIs(pathname, "/app/settings"),
    isHelp: pathIs(pathname, "/app/help"),
    isMembers: teamBase !== null && pathIs(pathname, teamBase),
    isInvites: teamBase !== null && pathIs(pathname, `${teamBase}/invites`),
    isTeamSettings: teamBase !== null && pathIs(pathname, `${teamBase}/settings`),
    activeTeamSlug,
    canManageTeam,
  };
}

export function getMobilePageTitleKey(pathname: string): string {
  if (pathIs(pathname, "/app")) return "mobileTitleOverview";
  if (pathIs(pathname, "/app/teams")) return "mobileTitleSetupTeam";
  if (pathIs(pathname, "/app/settings")) return "mobileTitleSettings";
  if (pathIs(pathname, "/app/help")) return "mobileTitleHelp";

  const slug = teamSlugFromPath(pathname);
  if (slug) {
    if (pathIs(pathname, `/app/t/${slug}`)) return "mobileTitleMembers";
    if (pathIs(pathname, `/app/t/${slug}/invites`)) return "mobileTitleInvites";
    if (pathIs(pathname, `/app/t/${slug}/settings`)) return "mobileTitleTeamSettings";
  }

  return "mobileTitleOverview";
}

export function getTeamTabHref(
  team: AppTeam | null,
  canCreateTeam: boolean,
): string | null {
  if (team) return `/app/t/${team.slug}`;
  if (canCreateTeam) return "/app/teams";
  return null;
}

export function isTeamTabActive(pathname: string, team: AppTeam | null, canCreateTeam: boolean): boolean {
  if (team) {
    const base = `/app/t/${team.slug}`;
    return pathname === base || pathname.startsWith(`${base}/`);
  }
  if (canCreateTeam) return pathIs(pathname, "/app/teams");
  return false;
}
