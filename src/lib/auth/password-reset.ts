import type { SupabaseClient } from "@supabase/supabase-js";
import { authEmailRedirectUrl } from "@/lib/auth/email-verification";

/** Supabase recovery emails use an 8-digit OTP (see supabase/templates/recovery.html). */
export const RECOVERY_OTP_LENGTH = 8;

export function passwordResetRedirectUrl(locale: string): string {
  return authEmailRedirectUrl(locale, "/reset-password");
}

export async function requestPasswordReset(
  supabase: SupabaseClient,
  email: string,
  redirectTo: string,
) {
  return supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo });
}

export async function verifyRecoveryOtp(
  supabase: SupabaseClient,
  email: string,
  token: string,
) {
  return supabase.auth.verifyOtp({
    email: email.trim(),
    token: token.replace(/\D/g, ""),
    type: "recovery",
  });
}

type RecoveryCallbackInput = {
  code: string | null;
  tokenHash: string | null;
  type: string | null;
  hash: string;
};

/** Apply a recovery link (PKCE code, token hash, or implicit hash tokens). */
export async function completeRecoveryCallback(
  supabase: SupabaseClient,
  input: RecoveryCallbackInput,
): Promise<{ ok: true } | { ok: false; error: string | null; attempted: boolean }> {
  if (input.code) {
    const { error } = await supabase.auth.exchangeCodeForSession(input.code);
    if (!error) return { ok: true };
    return { ok: false, error: error.message, attempted: true };
  }

  if (input.tokenHash && input.type === "recovery") {
    const { error } = await supabase.auth.verifyOtp({
      token_hash: input.tokenHash,
      type: "recovery",
    });
    if (!error) return { ok: true };
    return { ok: false, error: error.message, attempted: true };
  }

  const hashBody = input.hash.replace(/^#/, "").trim();
  if (hashBody) {
    const hashParams = new URLSearchParams(hashBody);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (accessToken && refreshToken) {
      const { error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      if (!error) return { ok: true };
      return { ok: false, error: error.message, attempted: true };
    }
  }

  return { ok: false, error: null, attempted: false };
}
