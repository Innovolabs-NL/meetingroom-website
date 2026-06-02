"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@i18n/navigation";
import type { AppTeam } from "@/lib/app/get-app-context";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { getAppNavState } from "./app-nav-utils";

type NavIcon = "overview" | "setup" | "settings" | "help" | "members" | "invites" | "teamSettings";

function NavIconSvg({ name }: { name: NavIcon }) {
  const props = {
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  switch (name) {
    case "overview":
      return (
        <svg {...props}>
          <rect x="3" y="3" width="7" height="7" rx="1" />
          <rect x="14" y="3" width="7" height="7" rx="1" />
          <rect x="3" y="14" width="7" height="7" rx="1" />
          <rect x="14" y="14" width="7" height="7" rx="1" />
        </svg>
      );
    case "setup":
      return (
        <svg {...props}>
          <path d="M12 5v14" />
          <path d="M5 12h14" />
        </svg>
      );
    case "settings":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      );
    case "help":
      return (
        <svg {...props}>
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <path d="M12 17h.01" />
        </svg>
      );
    case "members":
      return (
        <svg {...props}>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      );
    case "invites":
      return (
        <svg {...props}>
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
          <polyline points="22,6 12,13 2,6" />
        </svg>
      );
    case "teamSettings":
      return (
        <svg {...props}>
          <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      );
  }
}

function NavLink({
  href,
  label,
  icon,
  active,
  onNavigate,
}: {
  href: string;
  label: string;
  icon: NavIcon;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <motion.div whileTap={{ scale: 0.98 }}>
      <Link
        href={href}
        onClick={onNavigate}
        aria-current={active ? "page" : undefined}
        className={`group flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-all ${
          active
            ? "bg-accent-muted font-medium text-foreground shadow-sm ring-1 ring-accent/20"
            : "text-muted hover:bg-surface/70 hover:text-foreground"
        }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${
            active
              ? "border-accent/30 bg-background text-accent"
              : "border-transparent bg-surface/50 text-muted group-hover:border-border group-hover:text-foreground"
          }`}
        >
          <NavIconSvg name={icon} />
        </span>
        <span className="truncate">{label}</span>
      </Link>
    </motion.div>
  );
}

function userInitial(email?: string): string {
  const local = email?.trim().split("@")[0] ?? "";
  return (local.charAt(0) || "?").toUpperCase();
}

export function AppNavContent({
  email,
  accountKind,
  team,
  canCreateTeam,
  onNavigate,
  showLanguageSwitcher = false,
}: {
  email?: string;
  accountKind: "personal" | "team";
  team: AppTeam | null;
  canCreateTeam: boolean;
  onNavigate?: () => void;
  showLanguageSwitcher?: boolean;
}) {
  const t = useTranslations("appShell");
  const pathname = usePathname();
  const nav = getAppNavState(pathname, team);

  const accountLabel =
    accountKind === "team" ? t("accountKindTeam") : t("accountKindPersonal");

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <nav className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4">
        <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted/80">
          {t("navAccount")}
        </p>
        <div className="space-y-1">
          <NavLink href="/app" label={t("navOverview")} icon="overview" active={nav.isOverview} onNavigate={onNavigate} />
          {canCreateTeam ? (
            <NavLink
              href="/app/teams"
              label={t("navSetupTeam")}
              icon="setup"
              active={nav.isSetupTeam}
              onNavigate={onNavigate}
            />
          ) : null}
          <NavLink
            href="/app/settings"
            label={t("navAccountSettings")}
            icon="settings"
            active={nav.isSettings}
            onNavigate={onNavigate}
          />
          <NavLink href="/app/help" label={t("navHelp")} icon="help" active={nav.isHelp} onNavigate={onNavigate} />
        </div>

        {team ? (
          <>
            <p className="mt-6 px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted/80">
              {team.name}
            </p>
            <div className="space-y-1">
              <NavLink
                href={`/app/t/${team.slug}`}
                label={t("navMembers")}
                icon="members"
                active={nav.isMembers}
                onNavigate={onNavigate}
              />
              {nav.canManageTeam ? (
                <NavLink
                  href={`/app/t/${team.slug}/invites`}
                  label={t("navInvites")}
                  icon="invites"
                  active={nav.isInvites}
                  onNavigate={onNavigate}
                />
              ) : null}
              <NavLink
                href={`/app/t/${team.slug}/settings`}
                label={t("navTeamSettings")}
                icon="teamSettings"
                active={nav.isTeamSettings}
                onNavigate={onNavigate}
              />
            </div>
          </>
        ) : null}
      </nav>

      <div className="sticky bottom-0 z-10 shrink-0 space-y-3 border-t border-border/80 bg-[var(--color-navbar)] p-3 backdrop-blur-xl">
        <div className="rounded-xl border border-border bg-surface/80 p-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border bg-background text-xs font-semibold text-accent">
              {userInitial(email)}
            </span>
            <div className="min-w-0 flex-1">
              <div className="truncate text-xs font-medium text-foreground">{email ?? t("noEmail")}</div>
              <div className="mt-0.5 text-[10px] uppercase tracking-wide text-muted">{accountLabel}</div>
            </div>
          </div>
          {team ? (
            <p className="mt-2 truncate border-t border-border/60 pt-2 text-[10px] text-muted">
              {t("memberOfTeam", { team: team.name })}
            </p>
          ) : null}
        </div>

        {showLanguageSwitcher ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/40 px-3 py-2">
            <LanguageSwitcher dropUp onAfterSwitch={onNavigate} />
            <div className="flex shrink-0 items-center gap-2 border-l border-border/60 pl-3">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
                {t("appearance")}
              </span>
              <ThemeToggle />
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 rounded-xl border border-border/60 bg-background/40 px-3 py-2">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-muted">
              {t("appearance")}
            </span>
            <ThemeToggle />
          </div>
        )}
      </div>
    </div>
  );
}
