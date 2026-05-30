"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { verifyEmailChangeOtp } from "@/lib/auth/email-verification";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthField, authInputClass } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";

type Props = {
  currentEmail: string;
};

export function AccountSecuritySection({ currentEmail }: Props) {
  const t = useTranslations("appShell");
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [newEmail, setNewEmail] = useState("");
  const [emailOtp, setEmailOtp] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [emailStep, setEmailStep] = useState<"form" | "otp">("form");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [emailInfo, setEmailInfo] = useState<string | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordInfo, setPasswordInfo] = useState<string | null>(null);

  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const id = window.location.hash.replace(/^#/, "");
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  function onRequestEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);
    setEmailInfo(null);

    startTransition(async () => {
      if (!supabase) {
        setEmailError(t("configMissingEnv"));
        return;
      }
      const trimmed = newEmail.trim();
      if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        setEmailError(t("securityEmailInvalid"));
        return;
      }
      if (trimmed.toLowerCase() === currentEmail.toLowerCase()) {
        setEmailError(t("securityEmailSame"));
        return;
      }
      const { error } = await supabase.auth.updateUser({ email: trimmed });
      if (error) {
        setEmailError(error.message);
        return;
      }
      setPendingEmail(trimmed);
      setEmailStep("otp");
      setEmailOtp("");
      setEmailInfo(t("securityEmailOtpSent").replace("{email}", trimmed));
    });
  }

  function onVerifyEmailChange(e: React.FormEvent) {
    e.preventDefault();
    setEmailError(null);

    startTransition(async () => {
      if (!supabase) {
        setEmailError(t("configMissingEnv"));
        return;
      }
      const code = emailOtp.replace(/\D/g, "");
      if (code.length < 6) {
        setEmailError(t("securityOtpInvalid"));
        return;
      }
      const { error } = await verifyEmailChangeOtp(supabase, pendingEmail, code);
      if (error) {
        setEmailError(error.message);
        return;
      }
      setEmailInfo(t("securityEmailUpdated").replace("{email}", pendingEmail));
      setEmailStep("form");
      setNewEmail("");
      setEmailOtp("");
      setPendingEmail("");
    });
  }

  function onChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError(null);
    setPasswordInfo(null);

    startTransition(async () => {
      if (!supabase) {
        setPasswordError(t("configMissingEnv"));
        return;
      }
      if (newPassword.length < 8) {
        setPasswordError(t("securityPasswordTooShort"));
        return;
      }
      if (newPassword !== confirmPassword) {
        setPasswordError(t("securityPasswordMismatch"));
        return;
      }
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) {
        setPasswordError(error.message);
        return;
      }
      setNewPassword("");
      setConfirmPassword("");
      setPasswordInfo(t("securityPasswordUpdated"));
    });
  }

  if (!supabase) return null;

  return (
    <div className="space-y-8 border-t border-border pt-8">
      <section id="account-email" className="scroll-mt-8 space-y-4">
        <h3 className="text-sm font-semibold tracking-tight">{t("securityEmailTitle")}</h3>
        <p className="text-xs text-muted">{t("securityEmailHint")}</p>

        {emailStep === "form" ? (
          <form onSubmit={onRequestEmailChange} className="space-y-4">
            <AuthField id="account-new-email" label={t("securityNewEmail")}>
              <input
                id="account-new-email"
                type="email"
                className={authInputClass}
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </AuthField>
            {emailError ? <AuthAlert variant="error">{emailError}</AuthAlert> : null}
            {emailInfo ? <AuthAlert variant="success">{emailInfo}</AuthAlert> : null}
            <button
              type="submit"
              disabled={pending}
              className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
            >
              {pending ? t("securitySaving") : t("securityUpdateEmail")}
            </button>
          </form>
        ) : (
          <form onSubmit={onVerifyEmailChange} className="space-y-4">
            <p className="text-sm text-muted">
              {t("securityEmailOtpLead").replace("{email}", pendingEmail)}
            </p>
            <AuthField id="account-email-otp" label={t("securityOtpLabel")}>
              <input
                id="account-email-otp"
                type="text"
                inputMode="numeric"
                className={authInputClass}
                value={emailOtp}
                onChange={(e) => setEmailOtp(e.target.value)}
                autoComplete="one-time-code"
                required
              />
            </AuthField>
            {emailError ? <AuthAlert variant="error">{emailError}</AuthAlert> : null}
            {emailInfo ? <AuthAlert variant="success">{emailInfo}</AuthAlert> : null}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={pending}
                className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
              >
                {pending ? t("securitySaving") : t("securityVerifyEmail")}
              </button>
              <button
                type="button"
                className="text-sm text-muted hover:text-foreground"
                onClick={() => {
                  setEmailStep("form");
                  setEmailError(null);
                  setEmailInfo(null);
                }}
              >
                {t("securityCancel")}
              </button>
            </div>
          </form>
        )}
      </section>

      <section id="account-password" className="scroll-mt-8 space-y-4">
        <h3 className="text-sm font-semibold tracking-tight">{t("securityPasswordTitle")}</h3>
        <p className="text-xs text-muted">{t("securityPasswordHint")}</p>
        <form onSubmit={onChangePassword} className="space-y-4">
          <AuthField id="account-new-password" label={t("securityNewPassword")}>
            <PasswordInput
              id="account-new-password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              required
            />
          </AuthField>
          <AuthField id="account-confirm-password" label={t("securityConfirmPassword")}>
            <PasswordInput
              id="account-confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              required
            />
          </AuthField>
          {passwordError ? <AuthAlert variant="error">{passwordError}</AuthAlert> : null}
          {passwordInfo ? <AuthAlert variant="success">{passwordInfo}</AuthAlert> : null}
          <button
            type="submit"
            disabled={pending}
            className="inline-flex rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {pending ? t("securitySaving") : t("securityUpdatePassword")}
          </button>
        </form>
      </section>
    </div>
  );
}
