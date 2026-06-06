"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@i18n/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { inviteJoinUrl } from "@/lib/site-url";
import { useLocale } from "next-intl";
import { AuthAlert } from "@/components/auth/auth-alert";
import { AuthCard, AuthCardFooter, AuthCardHeader } from "@/components/auth/auth-card";
import { AuthField, authInputClass } from "@/components/auth/auth-field";
import { PasswordInput } from "@/components/auth/password-input";
import { resendConfirmationEmail, verifyEmailOtp } from "@/lib/auth/email-verification";
import { parseSignupError } from "@/lib/auth/signup-errors";
import { EmailVerificationPanel } from "@/components/auth/email-verification-panel";
import { isDesktopAuthSource } from "@/lib/auth/desktop-callback";
import { completeDesktopAuthHandoff, resolveSessionAfterAuth } from "@/lib/auth/desktop-handoff";
import { useDesktopExistingSession } from "@/lib/auth/use-desktop-existing-session";
import { AuthFormLoading } from "@/components/auth/auth-form-loading";
import { DesktopAuthAccountPrompt } from "@/components/auth/desktop-auth-account-prompt";
import { DesktopAuthHandoff } from "@/components/auth/desktop-auth-handoff";
import type { Session } from "@supabase/supabase-js";

type InvitePreview = {
  email: string;
  organization_name: string;
};

type Step = "register" | "verify";

const RESEND_COOLDOWN_SEC = 60;

type SignupFormProps = {
  initialDesktopSessionEmail?: string | null;
};

export function SignupForm({ initialDesktopSessionEmail }: SignupFormProps) {
  const t = useTranslations("auth");
  const router = useRouter();
  const locale = useLocale();
  const searchParams = useSearchParams();
  const inviteToken = searchParams.get("invite_token");
  const desktopAuth = isDesktopAuthSource(searchParams);
  const desktopState = searchParams.get("state");
  const loopbackPort = searchParams.get("loopback_port");

  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  const [desktopHandoffSession, setDesktopHandoffSession] = useState<Session | null>(null);
  const [step, setStep] = useState<Step>("register");
  const [fullName, setFullName] = useState("");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [inviteTeam, setInviteTeam] = useState<string | null>(null);
  const [emailLocked, setEmailLocked] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailTaken, setEmailTaken] = useState(false);
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

  useEffect(() => {
    if (!inviteToken?.trim() || !supabase) return;

    let cancelled = false;
    (async () => {
      const { data: rows } = await supabase.rpc("get_organization_invite_preview", {
        p_token: inviteToken,
      });
      if (cancelled || !rows?.length) return;
      const row = rows[0] as InvitePreview;
      setEmail(row.email);
      setEmailLocked(true);
      setInviteTeam(row.organization_name);
    })();

    return () => {
      cancelled = true;
    };
  }, [inviteToken, supabase]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((s) => (s <= 1 ? 0 : s - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const desktopQuery = desktopAuth
    ? `source=desktop${desktopState ? `&state=${encodeURIComponent(desktopState)}` : ""}${loopbackPort ? `&loopback_port=${encodeURIComponent(loopbackPort)}` : ""}`
    : "";

  const loginHref = inviteToken
    ? `/login?next=${encodeURIComponent(`/app/join?token=${encodeURIComponent(inviteToken)}`)}${desktopQuery ? `&${desktopQuery}` : ""}`
    : desktopQuery
      ? `/login?${desktopQuery}`
      : "/login";

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

    router.push(inviteToken ? `/app/join?token=${encodeURIComponent(inviteToken)}` : "/app");
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

  async function syncProfile(userId: string) {
    if (!supabase) return;
    const name = fullName.trim();
    const companyName = company.trim();
    await supabase
      .from("profiles")
      .update({ full_name: name, company: companyName || null })
      .eq("user_id", userId);
  }

  function showSignupError(message: string, taken = false) {
    setEmailTaken(taken);
    setError(message);
  }

  function onRegisterSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setEmailTaken(false);

    startTransition(async () => {
      if (!supabase) {
        setError(t("notConfigured"));
        return;
      }

      const name = fullName.trim();
      const companyName = company.trim();
      const emailTrimmed = email.trim();

      if (name.length < 2) {
        setError(t("fullNameRequired"));
        return;
      }

      if (password.length < 8) {
        setError(t("passwordHint"));
        return;
      }

      if (password !== confirmPassword) {
        setError(t("passwordMismatch"));
        return;
      }

      const { data: alreadyRegistered, error: checkError } = await supabase.rpc(
        "is_email_registered",
        { p_email: emailTrimmed },
      );

      if (checkError) {
        const code = parseSignupError(checkError);
        if (code === "EMAIL_ALREADY_REGISTERED") {
          showSignupError(t("emailAlreadyRegistered"), true);
          return;
        }
      } else if (alreadyRegistered === true) {
        showSignupError(t("emailAlreadyRegistered"), true);
        return;
      }

      const redirectTo = inviteToken ? inviteJoinUrl(locale, inviteToken) : undefined;
      const userData: Record<string, string> = { full_name: name };
      if (companyName) userData.company = companyName;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: emailTrimmed,
        password,
        options: {
          data: userData,
          ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
        },
      });

      if (signUpError) {
        if (parseSignupError(signUpError) === "EMAIL_ALREADY_REGISTERED") {
          showSignupError(t("emailAlreadyRegistered"), true);
          return;
        }
        setError(signUpError.message);
        return;
      }

      if (data.user && data.session) {
        await syncProfile(data.user.id);
        await finishAuth(data.session);
        return;
      }

      setVerificationCode("");
      setStep("verify");
      setResendCooldown(RESEND_COOLDOWN_SEC);
      setInfo(inviteToken ? t("confirmEmailInvite") : t("confirmEmailDefault"));
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

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        await syncProfile(user.id);
      }

      await finishAuth();
    });
  }

  function resendCode() {
    if (resendCooldown > 0 || !supabase) return;

    setError(null);
    startTransition(async () => {
      const redirectTo = inviteToken ? inviteJoinUrl(locale, inviteToken) : undefined;
      const { error: resendError } = await resendConfirmationEmail(
        supabase,
        email.trim(),
        redirectTo,
      );

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
    const inviteBanner = inviteTeam ? (
      <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-blue-100">
        {t("inviteBanner", { team: inviteTeam })}
      </div>
    ) : null;

    return (
      <AuthCard>
        <div className={!supabase ? "pointer-events-none opacity-50" : undefined}>
          <EmailVerificationPanel
            email={email.trim()}
            info={info}
            error={error}
            verificationCode={verificationCode}
            onVerificationCodeChange={setVerificationCode}
            isPending={isPending}
            resendCooldown={resendCooldown}
            onSubmit={onVerifySubmit}
            onResend={resendCode}
            onBack={() => {
              setStep("register");
              setError(null);
              setInfo(null);
              setVerificationCode("");
            }}
            backLabel={t("backToRegistration")}
            topSlot={inviteBanner}
          />
        </div>

        <AuthCardFooter>
          {t("haveAccount")}{" "}
          <Link href={loginHref} className="font-medium text-accent hover:text-accent-hover">
            {t("signIn")}
          </Link>
        </AuthCardFooter>
      </AuthCard>
    );
  }

  return (
    <AuthCard>
      {inviteTeam ? (
        <div className="mb-6 rounded-xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-blue-100">
          {t("inviteBanner", { team: inviteTeam })}
        </div>
      ) : null}

      <AuthCardHeader
        title={t("signupTitle")}
        subtitle={inviteTeam ? t("signupSubtitleInvite") : t("signupSubtitle")}
      />

      {!supabase ? <AuthAlert variant="info">{t("notConfigured")}</AuthAlert> : null}

      <form
        onSubmit={onRegisterSubmit}
        className={`space-y-5 ${!supabase ? "pointer-events-none opacity-50" : ""}`}
      >
        <AuthField id="signup-full-name" label={t("fullName")}>
          <input
            id="signup-full-name"
            className={authInputClass}
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder={t("fullNamePlaceholder")}
            autoComplete="name"
            autoFocus
            required
            minLength={2}
          />
        </AuthField>

        <AuthField id="signup-company" label={t("company")} hint={t("companyOptional")}>
          <input
            id="signup-company"
            className={authInputClass}
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={t("companyPlaceholder")}
            autoComplete="organization"
          />
        </AuthField>

        <AuthField id="signup-email" label={t("email")}>
          <input
            id="signup-email"
            className={authInputClass}
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailTaken(false);
              setError(null);
            }}
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            required
            readOnly={emailLocked}
          />
        </AuthField>

        <AuthField id="signup-password" label={t("password")} hint={t("passwordHint")}>
          <PasswordInput
            id="signup-password"
            value={password}
            onChange={setPassword}
            autoComplete="new-password"
            required
            minLength={8}
          />
        </AuthField>

        <AuthField id="signup-confirm-password" label={t("confirmPassword")}>
          <PasswordInput
            id="signup-confirm-password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            autoComplete="new-password"
            required
            minLength={8}
          />
        </AuthField>

        {error ? (
          <AuthAlert variant="error">
            <p>{error}</p>
            {emailTaken ? (
              <Link
                href={loginHref}
                className="mt-2 inline-block text-sm font-medium text-accent hover:text-accent-hover"
              >
                {t("signInInstead")} →
              </Link>
            ) : null}
          </AuthAlert>
        ) : null}

        <button
          type="submit"
          disabled={isPending}
          className="inline-flex h-11 w-full items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {isPending ? t("signingUp") : t("signUp")}
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
