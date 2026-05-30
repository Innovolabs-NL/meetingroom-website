"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthField, authInputClass } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";

export function TransferOwnershipModal({
  open,
  newOwnerName,
  userEmail,
  confirmEmail,
  password,
  error,
  pending,
  onConfirmEmailChange,
  onPasswordChange,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  newOwnerName: string;
  userEmail: string;
  confirmEmail: string;
  password: string;
  error: string | null;
  pending: boolean;
  onConfirmEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const t = useTranslations("appTeam");

  const emailMatches =
    confirmEmail.trim().toLowerCase() === userEmail.trim().toLowerCase();
  const canConfirm = emailMatches && password.length > 0 && !pending;

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
        aria-labelledby="transfer-ownership-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-amber-500/30 bg-surface p-6 shadow-elevated"
      >
        <h2
          id="transfer-ownership-modal-title"
          className="text-lg font-semibold tracking-tight text-amber-100"
        >
          {t("transferOwnershipModalTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          {t("transferOwnershipModalHint", { name: newOwnerName })}
        </p>

        <div className="mt-6 space-y-4">
          <AuthField id="transfer-confirm-email" label={t("transferOwnershipModalEmailLabel")}>
            <input
              id="transfer-confirm-email"
              className={authInputClass}
              type="email"
              value={confirmEmail}
              onChange={(e) => onConfirmEmailChange(e.target.value)}
              placeholder={userEmail}
              autoComplete="off"
              autoFocus
              disabled={pending}
            />
          </AuthField>

          {confirmEmail.length > 0 && !emailMatches ? (
            <p className="text-xs text-red-300">{t("transferOwnershipEmailMismatch")}</p>
          ) : null}

          <AuthField id="transfer-confirm-password" label={t("transferOwnershipModalPasswordLabel")}>
            <PasswordInput
              id="transfer-confirm-password"
              value={password}
              onChange={onPasswordChange}
              autoComplete="current-password"
            />
          </AuthField>

          {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={pending}
            onClick={onCancel}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-foreground transition-colors hover:bg-background disabled:opacity-50"
          >
            {t("modalCancel")}
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-amber-500/50 bg-amber-500/20 px-4 text-sm font-semibold text-amber-100 transition-colors hover:bg-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? t("transferOwnershipTransferring") : t("transferOwnershipButton")}
          </button>
        </div>
      </div>
    </div>
  );
}
