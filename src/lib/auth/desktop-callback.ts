import type { Session } from "@supabase/supabase-js";

export const DESKTOP_AUTH_CALLBACK_SCHEME = "meetingroom://auth/callback";

export function isDesktopAuthSource(
  searchParams: Pick<URLSearchParams, "get">,
): boolean {
  return searchParams.get("source") === "desktop";
}

/** Deep link hash consumed by the MeetingRoom desktop app (`setSessionFromUrlHash`). */
export function buildDesktopAuthCallbackUrl(
  session: Session,
  state?: string | null,
): string {
  const hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: String(session.expires_in ?? 3600),
    token_type: "bearer",
  });
  if (state) {
    hash.set("state", state);
  }
  return `${DESKTOP_AUTH_CALLBACK_SCHEME}#${hash.toString()}`;
}
