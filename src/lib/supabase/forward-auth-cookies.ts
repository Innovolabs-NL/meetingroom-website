import type { NextResponse } from "next/server";

/** Copy Supabase auth cookies so redirects do not drop a refreshed session. */
export function forwardAuthCookies(source: NextResponse, target: NextResponse): NextResponse {
  for (const cookie of source.cookies.getAll()) {
    target.cookies.set(cookie.name, cookie.value);
  }
  return target;
}
