"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthField, authInputClass } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";

export function DeleteAccountModal({
  open,
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
  const t = useTranslations("appShell");
  const panelRef = useRef<HTMLDivElement>(null);

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
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" aria-hidden />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-account-modal-title"
        className="relative z-10 w-full max-w-md rounded-2xl border border-red-500/30 bg-surface p-6 shadow-2xl shadow-black/40"
      >
        <h2 id="delete-account-modal-title" className="text-lg font-semibold tracking-tight text-red-100">
          {t("deleteAccountModalTitle")}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t("deleteAccountModalHint")}</p>

        <div className="mt-6 space-y-4">
          <AuthField id="delete-confirm-email" label={t("deleteAccountModalEmailLabel")}>
            <input
              id="delete-confirm-email"
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
            <p className="text-xs text-red-300">{t("deleteAccountEmailMismatch")}</p>
          ) : null}

          <AuthField id="delete-confirm-password" label={t("deleteAccountModalPasswordLabel")}>
            <PasswordInput
              id="delete-confirm-password"
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
            {t("deleteAccountModalCancel")}
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-red-500/50 bg-red-500/20 px-4 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? t("deleteAccountDeleting") : t("deleteAccountModalConfirm")}
          </button>
        </div>
      </div>
    </div>
  );
}
