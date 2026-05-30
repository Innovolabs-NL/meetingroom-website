"use client";

import { useTranslations } from "next-intl";
import type { Session } from "@supabase/supabase-js";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthCard, AuthCardHeader } from "@/components/auth/auth-card";

type Props = {
  session: Session;
  onLogIn: () => void;
  onUseOtherAccount: () => void;
  isPending?: boolean;
  error?: string | null;
};

export function DesktopAuthAccountPrompt({
  session,
  onLogIn,
  onUseOtherAccount,
  isPending = false,
  error = null,
}: Props) {
  const t = useTranslations("auth");
  const displayEmail = session.user.email?.trim() || t("desktopAccountPromptSignedInFallback");

  return (
    <AuthCard>
      <AuthCardHeader
        title={t("desktopAccountPromptTitle")}
        subtitle={t("desktopAccountPromptSubtitle")}
      />
      <p className="text-xs font-medium uppercase tracking-wide text-muted">
        {t("desktopAccountPromptEmailLabel")}
      </p>
      <p className="mt-1 break-all text-base font-semibold text-foreground">{displayEmail}</p>
      {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}
      <button
        type="button"
        onClick={onLogIn}
        disabled={isPending}
        className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {isPending ? t("signingIn") : t("desktopAccountPromptLogIn")}
      </button>
      <button
        type="button"
        onClick={onUseOtherAccount}
        disabled={isPending}
        className="mt-3 inline-flex h-11 w-full items-center justify-center rounded-xl border border-border bg-background/40 px-5 text-sm font-medium text-foreground transition-colors hover:bg-background/70 disabled:opacity-60"
      >
        {t("desktopAccountPromptOtherAccount")}
      </button>
    </AuthCard>
  );
}
