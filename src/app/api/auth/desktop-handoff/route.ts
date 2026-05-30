import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { createMemoryAuthStorage } from "@/lib/supabase/memory-auth-storage";

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

function jsonWithCookies(body: unknown, cookiesToSet: CookieToSet[], status = 200) {
  const response = NextResponse.json(body, { status });
  for (const { name, value, options } of cookiesToSet) {
    response.cookies.set(name, value, options);
  }
  return response;
}

/**
 * Mint a fresh Supabase session for the desktop app without reusing the browser
 * refresh token (shared refresh tokens rotate and would sign the website out).
 *
 * If Supabase "single session per user" is enabled, minting a desktop session can
 * revoke the browser session — in that case we restore the website cookies using
 * the new desktop session so the login tab stays signed in.
 */
export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const cookieStore = await cookies();
  const cookiesToSet: CookieToSet[] = [];

  const supabase = createServerClient(url, publishableKey, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (incoming) => {
        incoming.forEach(({ name, value, options }) => {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // Route Handlers may reject cookie writes outside specific lifecycle points.
          }
          cookiesToSet.push({ name, value, options });
        });
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user?.email) {
    return NextResponse.json({ error: "Not signed in" }, { status: 401 });
  }

  const admin = createServiceRoleSupabaseClient();
  if (!admin) {
    return NextResponse.json(
      {
        error:
          "Desktop handoff requires SUPABASE_SERVICE_ROLE_KEY on the server. Add it in Vercel env vars.",
      },
      { status: 503 },
    );
  }

  const { data: linkData, error: linkError } = await admin.auth.admin.generateLink({
    type: "magiclink",
    email: user.email,
  });

  const tokenHash = linkData?.properties?.hashed_token;
  if (linkError || !tokenHash) {
    return NextResponse.json(
      { error: linkError?.message ?? "Failed to create desktop session" },
      { status: 500 },
    );
  }

  const ephemeral = createClient(url, publishableKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      storage: createMemoryAuthStorage(),
    },
  });

  const { data: verifyData, error: verifyError } = await ephemeral.auth.verifyOtp({
    token_hash: tokenHash,
    type: "magiclink",
  });

  if (verifyError || !verifyData.session) {
    return NextResponse.json(
      { error: verifyError?.message ?? "Failed to verify desktop session" },
      { status: 500 },
    );
  }

  const desktopSession = verifyData.session;

  const {
    data: { user: userAfterHandoff },
  } = await supabase.auth.getUser();

  if (!userAfterHandoff) {
    const { error: restoreError } = await supabase.auth.setSession({
      access_token: desktopSession.access_token,
      refresh_token: desktopSession.refresh_token,
    });

    if (restoreError) {
      return jsonWithCookies(
        { error: restoreError.message ?? "Failed to restore website session" },
        cookiesToSet,
        500,
      );
    }
  }

  return jsonWithCookies({ session: desktopSession }, cookiesToSet);
}
