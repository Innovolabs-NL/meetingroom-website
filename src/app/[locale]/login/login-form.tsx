"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@i18n/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import {
  authEmailRedirectUrl,
  isEmailNotConfirmedError,
  resendConfirmationEmail,
  verifyEmailOtp,
} from "@/lib/auth/email-verification";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthCard, AuthCardFooter, AuthCardHeader } from "@/components/auth/auth-card";
import { AuthField, authInputClass } from "@/components/auth/auth-field";
import { EmailVerificationPanel } from "@/components/auth/email-verification-panel";
import { PasswordInput } from "@/components/auth/password-input";
import { isDesktopAuthSource } from "@/lib/auth/desktop-callback";
import { completeDesktopAuthHandoff, resolveSessionAfterAuth } from "@/lib/auth/desktop-handoff";
import { useDesktopExistingSession } from "@/lib/auth/use-desktop-existing-session";
import { AuthFormLoading } from "@/components/auth/auth-form-loading";
import { DesktopAuthAccountPrompt } from "@/components/auth/desktop-auth-account-prompt";
import { DesktopAuthHandoff } from "@/components/auth/desktop-auth-handoff";
import type { Session } from "@supabase/supabase-js";

const RESEND_COOLDOWN_SEC = 60;

function safeNextInternalPath(raw: string | null): string {
  if (!raw) return "/app";
  const path = raw.trim();
  if (!path.startsWith("/") || path.startsWith("//")) return "/app";
  return path;
}

type Step = "login" | "verify";

type LoginFormProps = {
  /** Server-resolved email when `source=desktop`; `null` if signed out on the server. */
  initialDesktopSessionEmail?: string | null;
};

export function LoginForm({ initialDesktopSessionEmail }: LoginFormProps) {
  const t = useTranslations("auth");
  const locale = useLocale();
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");
  const desktopAuth = isDesktopAuthSource(searchParams);
  const desktopState = searchParams.get("state");
  const loopbackPort = searchParams.get("loopback_port");

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [desktopHandoffSession, setDesktopHandoffSession] = useState<Session | null>(null);
  const [step, setStep] = useState<Step>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isPending, startTransition] = useTransition();
  const [isDesktopLogInPending, setIsDesktopLogInPending] = useState(false);

  const {
    desktopExistingSession,
    desktopSessionLoading,
    isOtherAccountPending,
    signOutForOtherAccount,
  } = useDesktopExistingSession({ desktopAuth, supabase, initialDesktopSessionEmail });

  const desktopQuery = desktopAuth
    ? `source=desktop${desktopState ? `&state=${encodeURIComponent(desktopState)}` : ""}${loopbackPort ? `&loopback_port=${encodeURIComponent(loopbackPort)}` : ""}`
    : "";
  const signupHref = next
    ? `/signup?next=${encodeURIComponent(next)}${desktopQuery ? `&${desktopQuery}` : ""}`
    : desktopQuery
      ? `/signup?${desktopQuery}`
      : "/signup";

  const emailRedirectTo = authEmailRedirectUrl(locale, safeNextInternalPath(next));

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  async function finishAuth(sessionFromAuth?: Session | null) {
    if (!supabase) return;

    if (desktopAuth) {
      const session = await resolveSessionAfterAuth(supabase, sessionFromAuth);
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

  function onDesktopLogIn() {
    setError(null);
    setIsDesktopLogInPending(true);
    void (async () => {
      try {
        const session = await completeDesktopAuthHandoff(desktopState, loopbackPort);
        setDesktopHandoffSession(session);
      } catch (handoffError) {
        setError(handoffError instanceof Error ? handoffError.message : t("desktopHandoffFailed"));
      } finally {
        setIsDesktopLogInPending(false);
      }
    })();
  }

  function onDesktopUseOtherAccount() {
    void signOutForOtherAccount();
  }

  async function sendConfirmationResend(emailTrimmed: string) {
    if (!supabase) return { error: { message: t("notConfigured") } };
    return resendConfirmationEmail(supabase, emailTrimmed, emailRedirectTo);
  }

  function onLoginSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    startTransition(async () => {
      if (!supabase) {
        setError(t("notConfigured"));
        return;
      }

      const emailTrimmed = email.trim();
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: emailTrimmed,
        password,
      });

      if (signInError) {
        if (isEmailNotConfirmedError(signInError)) {
          const { error: resendError } = await sendConfirmationResend(emailTrimmed);
          setVerificationCode("");
          setStep("verify");
          setResendCooldown(RESEND_COOLDOWN_SEC);
          if (resendError) {
            setError(resendError.message);
            setInfo(t("loginEmailNotConfirmedNoResend"));
          } else {
            setError(null);
            setInfo(t("loginEmailNotConfirmed"));
          }
          return;
        }
        setError(signInError.message);
        return;
      }

      await finishAuth(signInData.session);
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

      const token = verificationCode.replace(/\D/g, "");
      if (token.length < 6) {
        setError(t("verificationCodeInvalid"));
        return;
      }

      const { error: verifyError } = await verifyEmailOtp(supabase, email, token);

      if (verifyError) {
        setError(verifyError.message);
        return;
      }

      await finishAuth();
    });
  }

  function resendCode() {
    if (resendCooldown > 0 || !supabase) return;

    setError(null);
    startTransition(async () => {
      const { error: resendError } = await sendConfirmationResend(email.trim());

      if (resendError) {
        setError(resendError.message);
        return;
      }

      setInfo(t("resendCodeSent"));
      setResendCooldown(RESEND_COOLDOWN_SEC);
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

  if (desktopAuth && desktopSessionLoading) {
    return <AuthFormLoading />;
  }

  if (desktopAuth && desktopExistingSession) {
    return (
      <DesktopAuthAccountPrompt
        session={desktopExistingSession}
        onLogIn={onDesktopLogIn}
        onUseOtherAccount={onDesktopUseOtherAccount}
        isPending={isDesktopLogInPending || isOtherAccountPending}
        error={error}
      />
    );
  }

  if (step === "verify") {
    return (
      <AuthCard>
        <EmailVerificationPanel
          email={email.trim()}
          subtitle={t("loginVerificationSubtitle")}
          info={info}
          error={error}
          verificationCode={verificationCode}
          onVerificationCodeChange={setVerificationCode}
          isPending={isPending}
          resendCooldown={resendCooldown}
          onSubmit={onVerifySubmit}
          onResend={resendCode}
          onBack={() => {
            setStep("login");
            setError(null);
            setInfo(null);
            setVerificationCode("");
          }}
        />

        <AuthCardFooter>
          {t("noAccount")}{" "}
          <Link href={signupHref} className="font-medium text-accent hover:text-accent-hover">
            {t("createAccount")}
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      <AuthCardHeader title={t("loginTitle")} subtitle={t("loginSubtitle")} />

      {!supabase ? <AuthAlert variant="info">{t("notConfigured")}</AuthAlert> : null}

      <form
        onSubmit={onLoginSubmit}
        className={`space-y-5 ${!supabase ? "pointer-events-none opacity-50" : ""}`}
      >
        <AuthField id="login-email" label={t("email")}>
          <input
            id="login-email"
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

        <AuthField id="login-password" label={t("password")}>
          <PasswordInput
            id="login-password"
            value={password}
            onChange={setPassword}
            autoComplete="current-password"
            required
          />
        </AuthField>

        {error ? <AuthAlert variant="error">{error}</AuthAlert> : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? t("signingIn") : t("signIn")}
        </button>
      </form>

      <AuthCardFooter>
        {t("noAccount")}{" "}
        <Link href={signupHref} className="font-medium text-accent hover:text-accent-hover">
          {t("createAccount")}
        </Link>
      </AuthCardFooter>
    </AuthCard>
  );
}
