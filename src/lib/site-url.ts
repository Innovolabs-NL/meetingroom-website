/** Canonical site origin for invite links and auth redirects (no trailing slash). */
export function getSiteUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${vercel.replace(/\/$/, "")}`;

  return "http://localhost:3000";
}

export function inviteJoinUrl(locale: string, token: string): string {
  const site = getSiteUrl();
  const loc = locale.trim() || "en";
  return `${site}/${loc}/app/join?token=${encodeURIComponent(token)}`;
}

export function inviteSignupUrl(locale: string, token: string): string {
  const site = getSiteUrl();
  const loc = locale.trim() || "en";
  return `${site}/${loc}/signup?invite_token=${encodeURIComponent(token)}`;
}
