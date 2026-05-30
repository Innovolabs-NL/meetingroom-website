"use client";

import { useTranslations } from "next-intl";
import { Link, usePathname } from "@i18n/navigation";
import type { AppTeam } from "@/lib/app/get-app-context";

function NavLink({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`block rounded-lg px-3 py-2 text-sm transition-colors ${
        active
          ? "bg-surface font-medium text-foreground"
          : "text-muted hover:bg-surface/60 hover:text-foreground"
      }`}
    >
      {label}
    </Link>
  );
}

function teamSlugFromPath(pathname: string): string | null {
  const match = pathname.match(/\/app\/t\/([a-z0-9-]+)/);
  return match?.[1] ?? null;
}

/** Exact match for app routes (`usePathname` from `@i18n/navigation` has no locale prefix). */
function pathIs(pathname: string, path: string): boolean {
  return pathname === path;
}

export function AppSidebar({
  email,
  accountKind,
  team,
  canCreateTeam,
}: {
  email?: string;
  accountKind: "personal" | "team";
  team: AppTeam | null;
  canCreateTeam: boolean;
}) {
  const t = useTranslations("appShell");
  const pathname = usePathname();
  const pathTeamSlug = teamSlugFromPath(pathname);
  const activeTeamSlug = pathTeamSlug ?? team?.slug ?? null;
  const canManageTeam = team?.role === "owner" || team?.role === "admin";

  const isOverview = pathIs(pathname, "/app");
  const isSetupTeam = pathIs(pathname, "/app/teams");
  const isSettings = pathIs(pathname, "/app/settings");
  const isHelp = pathIs(pathname, "/app/help");

  const teamBase = activeTeamSlug ? `/app/t/${activeTeamSlug}` : null;
  const isMembers = teamBase !== null && pathIs(pathname, teamBase);
  const isInvites = teamBase !== null && pathIs(pathname, `${teamBase}/invites`);
  const isTeamSettings = teamBase !== null && pathIs(pathname, `${teamBase}/settings`);

  const accountLabel =
    accountKind === "team" ? t("accountKindTeam") : t("accountKindPersonal");

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-background">
      <div className="flex h-14 items-center border-b border-border px-4">
        <Link href="/" className="text-sm font-semibold tracking-tight text-foreground">
          MeetingRoom
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <p className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
          {t("navAccount")}
        </p>
        <div className="space-y-0.5">
          <NavLink href="/app" label={t("navOverview")} active={isOverview} />
          {canCreateTeam ? (
            <NavLink href="/app/teams" label={t("navSetupTeam")} active={isSetupTeam} />
          ) : null}
          <NavLink href="/app/settings" label={t("navAccountSettings")} active={isSettings} />
          <NavLink href="/app/help" label={t("navHelp")} active={isHelp} />
        </div>

        {team ? (
          <>
            <p className="mt-6 px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted">
              {team.name}
            </p>
            <div className="space-y-0.5">
              <NavLink
                href={`/app/t/${team.slug}`}
                label={t("navMembers")}
                active={isMembers}
              />
              {canManageTeam ? (
                <NavLink
                  href={`/app/t/${team.slug}/invites`}
                  label={t("navInvites")}
                  active={isInvites}
                />
              ) : null}
              <NavLink
                href={`/app/t/${team.slug}/settings`}
                label={t("navTeamSettings")}
                active={isTeamSettings}
              />
            </div>
          </>
        ) : null}
      </nav>

      <div className="border-t border-border p-4">
        <div className="truncate text-xs text-muted">{email ?? t("noEmail")}</div>
        <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted/80">{accountLabel}</div>
        {team ? (
          <div className="mt-1 truncate text-[10px] text-muted/80">
            {t("memberOfTeam", { team: team.name })}
          </div>
        ) : null}
        <Link
          href="/"
          className="mt-3 block text-xs text-muted transition-colors hover:text-foreground"
        >
          {t("backToWebsite")}
        </Link>
      </div>
    </aside>
  );
}
