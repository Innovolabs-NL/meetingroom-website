"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@i18n/navigation";
import type { AppTeam } from "@/lib/app/get-app-context";
import { getTeamTabHref, isTeamTabActive, pathIs } from "./app-nav-utils";

function TabIcon({ name }: { name: "overview" | "team" | "settings" | "help" }) {
  const props = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  if (name === "overview") {
    return (
      <svg {...props}>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </svg>
    );
  }
  if (name === "team") {
    return (
      <svg {...props}>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (name === "settings") {
    return (
      <svg {...props}>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    );
  }
  return (
    <svg {...props}>
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  );
}

function TabLink({
  href,
  label,
  icon,
  active,
}: {
  href: string;
  label: string;
  icon: "overview" | "team" | "settings" | "help";
  active: boolean;
}) {
  return (
    <motion.div whileTap={{ scale: 0.95 }} className="flex-1">
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={`flex min-h-11 flex-col items-center justify-center gap-0.5 px-1 py-2 text-[10px] font-medium transition-colors ${
          active ? "text-accent" : "text-muted hover:text-foreground"
        }`}
      >
        <TabIcon name={icon} />
        <span className="truncate">{label}</span>
      </Link>
    </motion.div>
  );
}

export function AppMobileNav({
  team,
  canCreateTeam,
}: {
  team: AppTeam | null;
  canCreateTeam: boolean;
}) {
  const t = useTranslations("appShell");
  const pathname = usePathname();

  const teamHref = getTeamTabHref(team, canCreateTeam);
  const isOverview = pathIs(pathname, "/app");
  const isSettings = pathIs(pathname, "/app/settings");
  const isHelp = pathIs(pathname, "/app/help");
  const isTeam = isTeamTabActive(pathname, team, canCreateTeam);

  return (
    <nav
      aria-label={t("mobileNavLabel")}
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-[var(--color-navbar)] backdrop-blur-xl lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        <TabLink href="/app" label={t("navOverview")} icon="overview" active={isOverview} />
        {teamHref ? (
          <TabLink href={teamHref} label={t("mobileTabTeam")} icon="team" active={isTeam} />
        ) : null}
        <TabLink href="/app/settings" label={t("navAccountSettings")} icon="settings" active={isSettings} />
        <TabLink href="/app/help" label={t("navHelp")} icon="help" active={isHelp} />
      </div>
    </nav>
  );
}
