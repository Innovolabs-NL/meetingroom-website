import type { Session } from "@supabase/supabase-js";

export const DESKTOP_AUTH_CALLBACK_SCHEME = "meetingroom://auth/callback";

export function isDesktopAuthSource(
  searchParams: Pick<URLSearchParams, "get">,
): boolean {
  return searchParams.get("source") === "desktop";
}

function buildSessionParams(session: Session, state?: string | null): URLSearchParams {
  const hash = new URLSearchParams({
    access_token: session.access_token,
    refresh_token: session.refresh_token,
    expires_in: String(session.expires_in ?? 3600),
    token_type: "bearer",
  });
  if (state) {
    hash.set("state", state);
  }
  return hash;
}

/** Deep link or dev loopback URL consumed by the MeetingRoom desktop app. */
export function buildDesktopAuthCallbackUrl(
  session: Session,
  state?: string | null,
  loopbackPort?: string | null,
): string {
  const params = buildSessionParams(session, state);
  const port = loopbackPort?.trim();
  if (port && /^\d+$/.test(port)) {
    return `http://127.0.0.1:${port}/auth/callback?${params.toString()}`;
  }
  return `${DESKTOP_AUTH_CALLBACK_SCHEME}#${params.toString()}`;
}
