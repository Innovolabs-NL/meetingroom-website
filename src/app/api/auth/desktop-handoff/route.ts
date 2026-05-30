import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/admin";
import { createMemoryAuthStorage } from "@/lib/supabase/memory-auth-storage";

/**
 * Mint a fresh Supabase session for the desktop app without reusing the browser
 * refresh token (shared refresh tokens rotate and would sign the website out).
 */
export async function POST() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishableKey) {
    return NextResponse.json({ error: "Supabase is not configured" }, { status: 503 });
  }

  const supabase = await createServerSupabaseClient();
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

  return NextResponse.json({ session: verifyData.session });
}
