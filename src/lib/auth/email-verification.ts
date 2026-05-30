import type { SupabaseClient } from "@supabase/supabase-js";
import { getSiteUrl } from "@/lib/site-url";

export function isEmailNotConfirmedError(error: { message?: string; code?: string }): boolean {
  const message = (error.message ?? "").toLowerCase();
  const code = (error.code ?? "").toLowerCase();
  return (
    code === "email_not_confirmed" ||
    message.includes("email not confirmed") ||
    message.includes("email address not confirmed")
  );
}

export function authEmailRedirectUrl(locale: string, internalPath = "/app"): string {
  const site = getSiteUrl();
  const loc = locale.trim() || "en";
  const path = internalPath.startsWith("/") ? internalPath : `/${internalPath}`;
  return `${site}/${loc}${path}`;
}

export async function verifyEmailOtp(
  supabase: SupabaseClient,
  email: string,
  token: string,
) {
  const trimmed = email.trim();
  const code = token.replace(/\D/g, "");

  const primary = await supabase.auth.verifyOtp({
    email: trimmed,
    token: code,
    type: "signup",
  });

  if (!primary.error) return primary;

  return supabase.auth.verifyOtp({
    email: trimmed,
    token: code,
    type: "email",
  });
}

export async function verifyEmailChangeOtp(
  supabase: SupabaseClient,
  email: string,
  token: string,
) {
  return supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.replace(/\D/g, ""),
    type: "email_change",
  });
}

export async function resendConfirmationEmail(
  supabase: SupabaseClient,
  email: string,
  emailRedirectTo?: string,
) {
  return supabase.auth.resend({
    type: "signup",
    email: email.trim(),
    options: emailRedirectTo ? { emailRedirectTo } : undefined,
  });
}
