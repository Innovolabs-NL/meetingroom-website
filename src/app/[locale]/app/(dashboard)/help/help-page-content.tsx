"use client";

import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import { AppPageHeader } from "../../_components/app-page-header";
import { AppPageMotion, AppStaggerItem, AppStaggerList } from "../../_components/app-page-motion";

const helpLinks = [
  {
    href: "/documentation",
    titleKey: "helpDocs" as const,
    descKey: "helpDocsDesc" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </svg>
    ),
  },
  {
    href: "/faq",
    titleKey: "helpFaq" as const,
    descKey: "helpFaqDesc" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
        <path d="M12 17h.01" />
      </svg>
    ),
  },
  {
    href: "/changelog",
    titleKey: "helpChangelog" as const,
    descKey: "helpChangelogDesc" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    ),
  },
  {
    href: "/contact",
    titleKey: "helpContact" as const,
    descKey: "helpContactDesc" as const,
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
];

export function HelpPageContent() {
  const t = useTranslations("appShell");

  return (
    <AppPageMotion>
      <AppPageHeader title={t("helpTitle")} subtitle={t("helpSubtitle")} />

      <AppStaggerList>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {helpLinks.map((item) => (
            <AppStaggerItem key={item.href}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.98 }}>
                <Link
                  href={item.href}
                  className="group flex h-full flex-col rounded-2xl border border-border bg-surface p-5 shadow-elevated card-surface transition-all hover:border-accent/35"
                >
                  <div className="flex items-start justify-between gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-background text-accent">
                      {item.icon}
                    </span>
                    <span className="text-muted transition-transform group-hover:translate-x-0.5 group-hover:text-accent">
                      →
                    </span>
                  </div>
                  <h2 className="mt-4 text-sm font-semibold text-foreground">{t(item.titleKey)}</h2>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{t(item.descKey)}</p>
                </Link>
              </motion.div>
            </AppStaggerItem>
          ))}
        </div>
      </AppStaggerList>
    </AppPageMotion>
  );
}
