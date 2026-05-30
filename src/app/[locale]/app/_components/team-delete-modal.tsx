"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthField, authInputClass } from "@/components/auth/auth-field";

export function TeamDeleteModal({
  open,
  teamName,
  teamSlug,
  confirmSlug,
  error,
  pending,
  onConfirmSlugChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  teamName: string;
  teamSlug: string;
  confirmSlug: string;
  error: string | null;
  pending: boolean;
  onConfirmSlugChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("appTeam");

  const slugMatches = confirmSlug.trim() === teamSlug;
  const canConfirm = slugMatches && !pending;

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pending) onCancel();
    };

    document.addEventListener("keydown", onKeyDown);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, pending, onCancel]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
      onClick={(e) => {
        if (e.target === e.currentTarget && !pending) onCancel();
      }}
    >
      <div className="absolute inset-0 bg-[var(--color-scrim)] backdrop-blur-sm" aria-hidden />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-team-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-danger-border bg-surface p-6 shadow-elevated"
      >
        <h2 id="delete-team-modal-title" className="text-lg font-semibold tracking-tight text-danger-foreground">
          {t("deleteTeamModalTitle", { team: teamName })}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("deleteTeamModalHint")}</p>

        <div className="mt-6 space-y-4">
          <AuthField id="delete-team-slug" label={t("deleteTeamModalSlugLabel", { slug: teamSlug })}>
            <input
              id="delete-team-slug"
              className={authInputClass}
              type="text"
              value={confirmSlug}
              onChange={(e) => onConfirmSlugChange(e.target.value)}
              placeholder={teamSlug}
              autoComplete="off"
              autoFocus
              disabled={pending}
            />
          </AuthField>

          {confirmSlug.length > 0 && !slugMatches ? (
            <p className="text-xs text-danger">{t("deleteTeamSlugMismatch")}</p>
          ) : null}

          {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-50"
          >
            {t("deleteTeamModalCancel")}
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-danger-border bg-danger-muted px-4 text-sm font-semibold text-danger-foreground transition-colors hover:bg-danger-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? t("deleteTeamDeleting") : t("deleteTeamModalConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
