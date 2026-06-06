import type { Session } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { buildDesktopAuthCallbackUrl } from "@/lib/auth/desktop-callback";

/** Open the desktop callback (deep link or dev loopback). */
export function openDesktopAuthDeepLink(
  session: Session,
  state?: string | null,
  loopbackPort?: string | null,
): void {
  const url = buildDesktopAuthCallbackUrl(session, state, loopbackPort);
  const port = loopbackPort?.trim();
  const isLoopback = Boolean(port && /^\d+$/.test(port));

  if (isLoopback) {
    window.location.assign(url);
    return;
  }

  const iframe = document.createElement("iframe");
  iframe.style.display = "none";
  iframe.src = url;
  document.body.appendChild(iframe);
  window.setTimeout(() => iframe.remove(), 2000);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.rel = "noopener";
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

/** Request a desktop-only session so the browser session is not invalidated. */
export async function requestDesktopHandoffSession(): Promise<Session> {
  const res = await fetch("/api/auth/desktop-handoff", {
    method: "POST",
    credentials: "same-origin",
    headers: { Accept: "application/json" },
  });

  const body = (await res.json().catch(() => ({}))) as { session?: Session; error?: string };
  if (!res.ok || !body.session) {
    throw new Error(body.error ?? "Could not prepare desktop sign-in");
  }

  return body.session;
}

/** @deprecated Use {@link openDesktopAuthDeepLink} after {@link requestDesktopHandoffSession}. */
export function triggerDesktopAuthHandoff(
  session: Session,
  state?: string | null,
  loopbackPort?: string | null,
): void {
  openDesktopAuthDeepLink(session, state, loopbackPort);
}

/** Prefer an explicit session; fall back to `getSession()` after sign-in. */
export async function resolveSessionAfterAuth(
  supabase: SupabaseClient,
  sessionFromAuth: Session | null | undefined,
): Promise<Session | null> {
  if (sessionFromAuth) return sessionFromAuth;
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session;
}

/** Mint a desktop session and open the app. Leaves the website session intact. */
export async function completeDesktopAuthHandoff(
  state?: string | null,
  loopbackPort?: string | null,
): Promise<Session> {
  const session = await requestDesktopHandoffSession();
  openDesktopAuthDeepLink(session, state, loopbackPort);
  return session;
}
