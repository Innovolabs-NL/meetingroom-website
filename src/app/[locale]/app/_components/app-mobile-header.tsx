"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@i18n/navigation";
import type { AppTeam } from "@/lib/app/get-app-context";
import { AppNavContent } from "./app-nav-content";
import { AppSidebarHeader } from "./app-sidebar-header";
import { getMobilePageTitleKey } from "./app-nav-utils";

export function AppMobileHeader({
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
  const [drawerOpen, setDrawerOpen] = useState(false);

  const pageTitle = t(getMobilePageTitleKey(pathname));

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [drawerOpen]);

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between border-b border-border bg-[var(--color-navbar)] px-4 backdrop-blur-xl lg:hidden">
        <Link href="/app" className="flex items-center gap-2">
          <Image src="/logo.svg" alt="MeetingRoom" width={24} height={24} />
          <span className="truncate text-sm font-semibold tracking-tight">{pageTitle}</span>
        </Link>
        <motion.button
          type="button"
          onClick={() => setDrawerOpen(true)}
          whileTap={{ scale: 0.95 }}
          className="flex h-10 w-10 items-center justify-center rounded-lg text-muted transition-colors hover:bg-surface hover:text-foreground"
          aria-expanded={drawerOpen}
          aria-label={t("mobileMenuOpen")}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16" />
            <path d="M4 12h16" />
            <path d="M4 18h16" />
          </svg>
        </motion.button>
      </header>

      <AnimatePresence>
        {drawerOpen ? (
          <>
            <motion.button
              type="button"
              aria-label={t("mobileMenuClose")}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-scrim lg:hidden"
              onClick={() => setDrawerOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(280px,85vw)] flex-col border-r border-border bg-[var(--color-navbar)] backdrop-blur-xl lg:hidden"
            >
              <div className="flex items-start justify-between gap-2 border-b border-border/80 pr-2">
                <div className="min-w-0 flex-1">
                  <AppSidebarHeader onNavigate={() => setDrawerOpen(false)} />
                </div>
                <motion.button
                  type="button"
                  onClick={() => setDrawerOpen(false)}
                  whileTap={{ scale: 0.95 }}
                  className="mt-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-surface hover:text-foreground"
                  aria-label={t("mobileMenuClose")}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M18 6L6 18" />
                    <path d="M6 6l12 12" />
                  </svg>
                </motion.button>
              </div>
              <div className="flex min-h-0 flex-1 flex-col">
                <AppNavContent
                  email={email}
                  accountKind={accountKind}
                  team={team}
                  canCreateTeam={canCreateTeam}
                  onNavigate={() => setDrawerOpen(false)}
                  showLanguageSwitcher
                />
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}
