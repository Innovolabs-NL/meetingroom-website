"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";

export function AppSidebarHeader({ onNavigate }: { onNavigate?: () => void }) {
  const t = useTranslations("appShell");

  return (
    <div className="shrink-0 border-b border-border/80 px-3 pb-4 pt-3">
      <Link
        href="/"
        onClick={onNavigate}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-medium text-muted transition-colors hover:bg-surface/80 hover:text-foreground"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M19 12H5" />
          <path d="M12 19l-7-7 7-7" />
        </svg>
        {t("backToWebsiteShort")}
      </Link>

      <Link
        href="/app"
        onClick={onNavigate}
        className="mt-3 flex items-center gap-2.5 rounded-xl px-2 py-2 transition-colors hover:bg-surface/60"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface shadow-sm">
          <Image src="/logo.svg" alt="" width={20} height={20} aria-hidden />
        </span>
        <span className="text-sm font-semibold tracking-tight text-foreground">MeetingRoom</span>
      </Link>
    </div>
  );
}
