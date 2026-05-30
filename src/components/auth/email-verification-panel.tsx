"use client";

import { useTranslations } from "next-intl";
import { AuthAlert } from "./auth-alert";
import { AuthCardHeader } from "./auth-card";
import { AuthField } from "./auth-field";
import { VerificationCodeInput } from "./verification-code-input";

export function EmailVerificationPanel({
  email,
  subtitle,
  info,
  error,
  verificationCode,
  onVerificationCodeChange,
  isPending,
  resendCooldown,
  onSubmit,
  onResend,
  onBack,
  backLabel,
  topSlot,
}: {
  email: string;
  subtitle?: string;
  info: string | null;
  error: string | null;
  verificationCode: string;
  onVerificationCodeChange: (value: string) => void;
  isPending: boolean;
  resendCooldown: number;
  onSubmit: (e: React.FormEvent) => void;
  onResend: () => void;
  onBack?: () => void;
  backLabel?: string;
  topSlot?: React.ReactNode;
}) {
  const t = useTranslations("auth");

  return (
    <>
      {topSlot}

      <AuthCardHeader
        title={t("verificationTitle")}
        subtitle={subtitle ?? t("verificationSubtitle")}
      />

      <p className="mb-5 text-sm text-muted">
        {t("verificationSentTo")}{" "}
        <span className="font-medium text-foreground">{email}</span>
      </p>

      {info ? <AuthAlert variant="success">{info}</AuthAlert> : null}

      <form onSubmit={onSubmit} className="mt-5 space-y-5">
        <AuthField id="email-verification-code" label={t("verificationCode")}>
          <VerificationCodeInput
            id="email-verification-code"
            value={verificationCode}
            onChange={onVerificationCodeChange}
            disabled={isPending}
          />
        </AuthField>

        {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}

        <button
          type="submit"
          disabled={isPending || verificationCode.replace(/\D/g, "").length < 6}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? t("verifying") : t("verifyEmail")}
        </button>

        <button
          type="button"
          disabled={isPending || resendCooldown > 0}
          onClick={onResend}
          className="inline-flex h-10 w-full items-center justify-center rounded-xl border border-border text-sm font-medium text-foreground/90 transition-colors hover:bg-surface disabled:opacity-50"
        >
          {resendCooldown > 0
            ? t("resendCodeWait", { seconds: resendCooldown })
            : t("resendCode")}
        </button>

        {onBack ? (
          <button
            type="button"
            disabled={isPending}
            onClick={onBack}
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            {backLabel ?? t("backToLogin")}
          </button>
        ) : null}
      </form>
    </>
  );
}
