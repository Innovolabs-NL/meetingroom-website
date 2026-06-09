import createMiddleware from "next-intl/middleware";
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "../i18n/routing";
import { isDesktopAuthSource } from "@/lib/auth/desktop-callback";
import { forwardAuthCookies } from "@/lib/supabase/forward-auth-cookies";

const intlMiddleware = createMiddleware(routing);

function getLocaleFromPathname(pathname: string) {
  const firstSegment = pathname.split("/")[1];
  if (routing.locales.includes(firstSegment as never)) return firstSegment;
  return routing.defaultLocale;
}

function decodeNextParam(raw: string | null): string | null {
  if (!raw) return null;
  try {
    return decodeURIComponent(raw.trim());
  } catch {
    return null;
  }
}

/** `internal` is path + optional query without locale prefix, e.g. `/app/join?token=…` */
function setLocalizedRedirectFromInternalUrl(redirectUrl: URL, locale: string, internal: string) {
  const path = internal.trim();
  if (!path.startsWith("/") || path.startsWith("//")) {
    redirectUrl.pathname = `/${locale}/app`;
    redirectUrl.search = "";
    return;
  }
  const qi = path.indexOf("?");
  const pathnamePart = qi === -1 ? path : path.slice(0, qi);
  const queryPart = qi === -1 ? "" : path.slice(qi + 1);
  redirectUrl.pathname = `/${locale}${pathnamePart}`;
  redirectUrl.search = queryPart ? `?${queryPart}` : "";
}

export default async function middleware(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  const response = intlMiddleware(request);

  if (!url || !publishableKey) return response;

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const locale = getLocaleFromPathname(request.nextUrl.pathname);
  const pathnameWithoutLocale = request.nextUrl.pathname.replace(
    new RegExp(`^/${locale}`),
    "",
  );

  const isProtected =
    pathnameWithoutLocale === "/app" || pathnameWithoutLocale.startsWith("/app/");
  const isAuthPage =
    pathnameWithoutLocale === "/login" ||
    pathnameWithoutLocale === "/signup" ||
    pathnameWithoutLocale === "/reset-password" ||
    pathnameWithoutLocale.startsWith("/login/") ||
    pathnameWithoutLocale.startsWith("/signup/") ||
    pathnameWithoutLocale.startsWith("/reset-password/");

  if (!user && isProtected) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = `/${locale}/login`;
    redirectUrl.search = "";
    const internalReturn = `${pathnameWithoutLocale}${request.nextUrl.search}`;
    if (internalReturn && internalReturn !== "/") {
      redirectUrl.searchParams.set("next", internalReturn);
    }
    return forwardAuthCookies(response, NextResponse.redirect(redirectUrl));
  }

  const isResetPasswordPage =
    pathnameWithoutLocale === "/reset-password" ||
    pathnameWithoutLocale.startsWith("/reset-password/");

  if (user && isAuthPage && !isResetPasswordPage) {
    if (isDesktopAuthSource(request.nextUrl.searchParams)) {
      return response;
    }

    const redirectUrl = request.nextUrl.clone();
    const nextDecoded = decodeNextParam(request.nextUrl.searchParams.get("next"));
    if (nextDecoded && nextDecoded.startsWith("/") && !nextDecoded.startsWith("//")) {
      setLocalizedRedirectFromInternalUrl(redirectUrl, locale, nextDecoded);
    } else {
      redirectUrl.pathname = `/${locale}/app`;
      redirectUrl.search = "";
    }
    return forwardAuthCookies(response, NextResponse.redirect(redirectUrl));
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
