"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";
import type { Session } from "@supabase/supabase-js";
import { openDesktopAuthDeepLink } from "@/lib/auth/desktop-handoff";
import { AuthCard, AuthCardHeader } from "@/components/auth/auth-card";

type Props = {
  session: Session;
  state?: string | null;
};

export function DesktopAuthHandoff({ session, state }: Props) {
  const t = useTranslations("auth");

  const openDesktop = useCallback(() => {
    openDesktopAuthDeepLink(session, state);
  }, [session, state]);

  return (
    <AuthCard>
      <AuthCardHeader title={t("desktopHandoffTitle")} subtitle={t("desktopHandoffSubtitle")} />
      <p className="text-sm leading-relaxed text-muted">{t("desktopHandoffHint")}</p>
      <button
        type="button"
        onClick={openDesktop}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover"
      >
        {t("desktopHandoffOpenApp")}
      </button>
      <p className="mt-4 text-center text-xs text-muted">{t("desktopHandoffCloseTab")}</p>
    </AuthCard>
  );
}
