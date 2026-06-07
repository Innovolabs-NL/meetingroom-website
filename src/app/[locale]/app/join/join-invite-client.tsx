"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@i18n/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import type { InvitePreview, InvitePreviewResult } from "@/lib/app/load-invite-preview";
import { acceptOrganizationInviteAction } from "./actions";

function mapInviteError(raw: string, t: (key: string) => string): string {
  if (raw.includes("NOT_AUTHENTICATED")) return t("error.notAuthenticated");
  if (raw.includes("SIGN_IN_EMAIL_REQUIRED")) return t("error.emailRequired");
  if (raw.includes("INVITE_INVALID_OR_EXPIRED")) return t("error.invalidOrExpired");
  if (raw.includes("INVITE_EMAIL_MISMATCH")) return t("error.emailMismatch");
  if (raw.includes("ALREADY_IN_TEAM")) return t("error.alreadyInTeam");
  return t("genericError");
}

export function JoinInviteClient({
  token,
  inviteLoad,
}: {
  token: string | null;
  inviteLoad: InvitePreviewResult;
}) {
  const router = useRouter();
  const t = useTranslations("appJoin");
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const preview = inviteLoad.status === "ok" ? inviteLoad.preview : null;

  const [signedIn, setSignedIn] = useState(false);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [acceptPending, startAccept] = useTransition();

  const joinPath = token ? `/app/join?token=${encodeURIComponent(token)}` : "/app/join";

  useEffect(() => {
    if (!supabase) {
      queueMicrotask(() => setAuthChecked(true));
      return;
    }
    let cancelled = false;
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!cancelled) {
        setSignedIn(Boolean(user));
        setSessionEmail(user?.email?.trim().toLowerCase() ?? null);
        setAuthChecked(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase]);

  if (inviteLoad.status === "missing_token") {
    return <p className="text-sm text-muted">{t("missingToken")}</p>;
  }

  if (inviteLoad.status === "bad_token") {
    return <p className="text-sm text-danger-foreground">{t("error.badToken")}</p>;
  }

  if (inviteLoad.status === "config") {
    return <p className="text-sm text-danger-foreground">{t("notConfigured")}</p>;
  }

  if (inviteLoad.status === "rpc_missing") {
    return (
      <div className="space-y-3 text-sm text-danger-foreground">
        <p>{t("error.rpcMissing")}</p>
        <p className="font-mono text-xs text-danger-foreground/80">{inviteLoad.detail}</p>
      </div>
    );
  }

  if (inviteLoad.status === "rpc_error") {
    return (
      <div className="space-y-3 text-sm text-danger-foreground">
        <p>{t("error.previewFailed")}</p>
        <p className="font-mono text-xs text-danger-foreground/80">{inviteLoad.detail}</p>
      </div>
    );
  }

  if (inviteLoad.status === "not_found") {
    return <p className="text-sm text-danger-foreground">{t("error.invalidOrExpired")}</p>;
  }

  if (!authChecked) {
    return <p className="text-sm text-muted">{t("loading")}</p>;
  }

  function accept() {
    if (!token) return;
    setError(null);
    startAccept(async () => {
      const result = await acceptOrganizationInviteAction(token);
      if ("error" in result) {
        setError(mapInviteError(result.error, t));
        return;
      }
      router.replace(`/app/t/${result.slug}`);
    });
  }

  const p = preview as InvitePreview;

  if (p.already_accepted && signedIn) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-emerald-200">{t("alreadyMember")}</p>
        <button
          type="button"
          onClick={() => router.replace(`/app/t/${p.organization_slug}`)}
          className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          {t("goToTeam")}
        </button>
      </div>
    );
  }

  if (!signedIn) {
    return (
      <div className="space-y-5">
        <div className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm">
          <p className="text-muted">{t("invitePreviewLead")}</p>
          <p className="mt-2 text-base font-semibold">{p.organization_name}</p>
          <p className="mt-1 text-xs text-muted">
            {t("invitePreviewEmail")}: <span className="text-foreground/90">{p.email}</span>
          </p>
        </div>

        <Link
          href={`/signup?invite_token=${encodeURIComponent(token!)}`}
          className="flex w-full items-center justify-center rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover"
        >
          {t("createAccount")}
        </Link>

        <Link
          href={`/login?next=${encodeURIComponent(joinPath)}`}
          className="flex w-full items-center justify-center rounded-xl border border-border py-3 text-sm font-semibold text-foreground hover:bg-surface"
        >
          {t("signInExisting")}
        </Link>
      </div>
    );
  }

  const emailMismatch =
    sessionEmail !== null && sessionEmail !== p.email.trim().toLowerCase();

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-border bg-background/50 px-4 py-3 text-sm text-muted">
        {t("signedInAcceptHint", { team: p.organization_name })}
      </div>
      {emailMismatch ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
          {t("error.emailMismatchDetail", {
            invited: p.email,
            signedIn: sessionEmail ?? "",
          })}
        </div>
      ) : null}
      {error ? (
        <div className="rounded-xl border border-danger-border bg-danger-muted px-4 py-3 text-sm text-danger-foreground">
          {error}
        </div>
      ) : null}
      <button
        type="button"
        disabled={acceptPending || emailMismatch}
        onClick={accept}
        className="w-full rounded-xl bg-accent py-3 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
      >
        {acceptPending ? t("accepting") : t("accept")}
      </button>
    </div>
  );
}
