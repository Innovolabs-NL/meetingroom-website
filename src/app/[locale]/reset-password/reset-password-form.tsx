"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Link, useRouter } from "@i18n/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthCard, AuthCardFooter, AuthCardHeader } from "@/components/auth/auth-card";
import { AuthField, authInputClass } from "@/components/auth/auth-field";
import { EmailVerificationPanel } from "@/components/auth/email-verification-panel";
import { PasswordInput } from "@/components/auth/password-input";
import { isDesktopAuthSource } from "@/lib/auth/desktop-callback";
import { completeDesktopAuthHandoff, resolveSessionAfterAuth } from "@/lib/auth/desktop-handoff";
import { DesktopAuthHandoff } from "@/components/auth/desktop-auth-handoff";
import {
  completeRecoveryCallback,
  passwordResetRedirectUrl,
  RECOVERY_OTP_LENGTH,
  requestPasswordReset,
  verifyRecoveryOtp,
} from "@/lib/auth/password-reset";
import type { Session } from "@supabase/supabase-js";

const RESEND_COOLDOWN_SEC = 60;

type Step = "request" | "verify" | "password";

function safeNextInternalPath(raw: string | null): string {
  if (!raw) return "/app";
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return "/app";
  return path;
}

export function ResetPasswordForm() {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const desktopAuth = isDesktopAuthSource(searchParams);
  const desktopState = searchParams.get("state");
  const loopbackPort = searchParams.get("loopback_port");

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isExchangingCode, setIsExchangingCode] = useState(false);
  const [desktopHandoffSession, setDesktopHandoffSession] = useState<Session | null>(null);
  const [resetEmailRequested, setResetEmailRequested] = useState(false);

  const desktopQuery = desktopAuth
    ? `source=desktop${desktopState ? `&state=${encodeURIComponent(desktopState)}` : ""}${loopbackPort ? `&loopback_port=${encodeURIComponent(loopbackPort)}` : ""}`
    : "";

  const loginHref = next
    ? `/login?next=${encodeURIComponent(next)}${desktopQuery ? `&${desktopQuery}` : ""}`
    : desktopQuery
      ? `/login?${desktopQuery}`
      : "/login";

  const redirectTo = passwordResetRedirectUrl(locale);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const urlError = searchParams.get("error_description") ?? searchParams.get("error");
    if (urlError) {
      setStep("verify");
      setError(urlError);
      return;
    }
    if (!supabase) return;

    const code = searchParams.get("code");
    const tokenHash = searchParams.get("token_hash");
    const type = searchParams.get("type");
    const hash = window.location.hash;
    const hasCallback = Boolean(
      code || (tokenHash && type === "recovery") || hash.includes("access_token"),
    );
    if (!hasCallback) return;

    let cancelled = false;
    setIsExchangingCode(true);
    setError(null);

    void (async () => {
      const result = await completeRecoveryCallback(supabase, {
        code,
        tokenHash,
        type,
        hash,
      });
      if (cancelled) return;

      if (result.ok) {
        setStep("password");
        setIsExchangingCode(false);
        router.replace(desktopQuery ? `/reset-password?${desktopQuery}` : "/reset-password");
        return;
      }

      if (result.attempted) {
        setStep("verify");
        setError(result.error ?? t("resetLinkFailedUseCode"));
        setInfo(null);
      }
      setIsExchangingCode(false);
      router.replace(desktopQuery ? `/reset-password?${desktopQuery}` : "/reset-password");
    })();

    return () => {
      cancelled = true;
    };
  }, [searchParams, supabase, router, desktopQuery]);

  async function finishAfterPasswordUpdate() {
    if (!supabase) return;

    if (desktopAuth) {
      const session = await resolveSessionAfterAuth(supabase, null);
      if (!session) return;
      try {
        const desktopSession = await completeDesktopAuthHandoff(desktopState, loopbackPort);
        setDesktopHandoffSession(desktopSession);
      } catch (handoffError) {
        setError(handoffError instanceof Error ? handoffError.message : t("desktopHandoffFailed"));
      }
      return;
    }

    router.push(safeNextInternalPath(next));
    router.refresh();
  }

  function onRequestSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    startTransition(async () => {
      if (!supabase) {
        setError(t("notConfigured"));
        return;
      }

      const emailTrimmed = email.trim();
      if (!emailTrimmed) {
        setError(t("resetEmailRequired"));
        return;
      }

      const { error: resetError } = await requestPasswordReset(supabase, emailTrimmed, redirectTo);
      if (resetError) {
        setError(resetError.message);
        return;
      }

      setVerificationCode("");
      setResetEmailRequested(true);
      setStep("verify");
      setInfo(t("resetEmailSent"));
      setResendCooldown(RESEND_COOLDOWN_SEC);
    });
  }

  function onVerifySubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      if (!supabase) {
        setError(t("notConfigured"));
        return;
      }

      const emailTrimmed = email.trim();
      if (!emailTrimmed) {
        setError(t("resetEmailRequired"));
        return;
      }

      const token = verificationCode.replace(/\D/g, "");
      if (token.length < RECOVERY_OTP_LENGTH) {
        setError(t("resetCodeInvalid"));
        return;
      }

      const { error: verifyError } = await verifyRecoveryOtp(supabase, emailTrimmed, token);
      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      setStep("password");
      setError(null);
      setInfo(null);
    });
  }

  function resendResetEmail() {
    if (resendCooldown > 0 || !supabase) return;

    setError(null);
    startTransition(async () => {
      const { error: resendError } = await requestPasswordReset(supabase, email.trim(), redirectTo);
      if (resendError) {
        setError(resendError.message);
        return;
      }

      setInfo(t("resendCodeSent"));
      setResendCooldown(RESEND_COOLDOWN_SEC);
    });
  }

  function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    startTransition(async () => {
      if (!supabase) {
        setError(t("notConfigured"));
        return;
      }

      if (newPassword.length < 8) {
        setError(t("passwordHint"));
        return;
      }

      if (newPassword !== confirmPassword) {
        setError(t("passwordMismatch"));
        return;
      }

      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword });
      if (updateError) {
        setError(updateError.message);
        return;
      }

      await finishAfterPasswordUpdate();
    });
  }

  if (desktopHandoffSession) {
    return (
      <DesktopAuthHandoff
        session={desktopHandoffSession}
        state={desktopState}
        loopbackPort={loopbackPort}
      />
    );
  }

  if (isExchangingCode) {
    return (
      <AuthCard>
        <AuthCardHeader title={t("resetTitle")} subtitle={t("resetVerifyingLink")} />
      </AuthCard>
    );
  }

  if (step === "verify") {
    return (
      <AuthCard>
        <EmailVerificationPanel
          email={email}
          editableEmail
          onEmailChange={setEmail}
          subtitle={t("resetVerificationSubtitle")}
          info={info}
          error={error}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          isPending={isPending}
          resendCooldown={resendCooldown}
          minCodeLength={RECOVERY_OTP_LENGTH}
          submitLabel={t("resetVerifyCode")}
          showResend={resetEmailRequested}
          onSubmit={onVerifySubmit}
          onResend={resetEmailRequested ? resendResetEmail : undefined}
          onBack={() => {
            setStep("request");
            setResetEmailRequested(false);
            setError(null);
            setInfo(null);
            setVerificationCode("");
          }}
          backLabel={t("backToResetRequest")}
        />

        <AuthCardFooter>
          {t("haveAccount")}{" "}
          <Link href={loginHref} className="font-medium text-accent hover:text-accent-hover">
            {t("signIn")}
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  if (step === "password") {
    return (
      <AuthCard>
        <AuthCardHeader title={t("resetNewPasswordTitle")} subtitle={t("resetNewPasswordSubtitle")} />

        {!supabase ? <AuthAlert variant="info">{t("notConfigured")}</AuthAlert> : null}

        <form
          onSubmit={onPasswordSubmit}
          className={`space-y-5 ${!supabase ? "pointer-events-none opacity-50" : ""}`}
        >
          <AuthField id="reset-new-password" label={t("password")}>
            <PasswordInput
              id="reset-new-password"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
              required
            />
          </AuthField>

          <AuthField id="reset-confirm-password" label={t("confirmPassword")}>
            <PasswordInput
              id="reset-confirm-password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
              required
            />
          </AuthField>

          {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {isPending ? t("resettingPassword") : t("resetPasswordButton")}
          </button>
        </form>

        <AuthCardFooter>
          <Link href={loginHref} className="font-medium text-accent hover:text-accent-hover">
            {t("backToLogin")}
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader title={t("resetTitle")} subtitle={t("resetSubtitle")} />

      {!supabase ? <AuthAlert variant="info">{t("notConfigured")}</AuthAlert> : null}

      <form
        onSubmit={onRequestSubmit}
        className={`space-y-5 ${!supabase ? "pointer-events-none opacity-50" : ""}`}
      >
        <AuthField id="reset-email" label={t("email")}>
          <input
            id="reset-email"
            className={authInputClass}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            autoFocus
            required
          />
        </AuthField>

        {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? t("sendingResetLink") : t("resetSendLink")}
        </button>

        <button
          type="button"
          disabled={isPending}
          onClick={() => {
            setStep("verify");
            setResetEmailRequested(false);
            setError(null);
            setInfo(null);
            setVerificationCode("");
          }}
          className="inline-flex h-10 w-full items-center justify-center text-sm font-medium text-muted transition-colors hover:text-foreground"
        >
          {t("resetHaveCode")}
        </button>
      </form>

      <AuthCardFooter>
        {t("haveAccount")}{" "}
        <Link href={loginHref} className="font-medium text-accent hover:text-accent-hover">
          {t("signIn")}
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
