"use client";

import { useCallback, useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { resolveSessionAfterAuth } from "@/lib/auth/desktop-handoff";

type Options = {
  desktopAuth: boolean;
  supabase: SupabaseClient | null;
  /**
   * From the server when `source=desktop`: email if signed in, `null` if signed out.
   * `undefined` when the server did not check (client resolves alone).
   */
  initialDesktopSessionEmail?: string | null;
};

export function useDesktopExistingSession({
  desktopAuth,
  supabase,
  initialDesktopSessionEmail,
}: Options) {
  const [desktopExistingSession, setDesktopExistingSession] = useState<Session | null>(null);
  const [desktopSessionChecked, setDesktopSessionChecked] = useState(() => {
    if (!desktopAuth) return true;
    if (initialDesktopSessionEmail === null) return true;
    return false;
  });
  const [isOtherAccountPending, setIsOtherAccountPending] = useState(false);

  const serverKnowsNoSession = desktopAuth && initialDesktopSessionEmail === null;

  useEffect(() => {
    if (!desktopAuth || !supabase || serverKnowsNoSession) return;

    let cancelled = false;
    void (async () => {
      const session = await resolveSessionAfterAuth(supabase, null);
      if (cancelled) return;
      setDesktopExistingSession(session);
      setDesktopSessionChecked(true);
    })();

    return () => {
      cancelled = true;
    };
  }, [desktopAuth, supabase, serverKnowsNoSession]);

  const signOutForOtherAccount = useCallback(async () => {
    if (!supabase) return;
    setIsOtherAccountPending(true);
    try {
      await supabase.auth.signOut();
      setDesktopExistingSession(null);
    } finally {
      setIsOtherAccountPending(false);
    }
  }, [supabase]);

  return {
    desktopExistingSession,
    desktopSessionChecked,
    desktopSessionLoading: desktopAuth && !desktopSessionChecked,
    isOtherAccountPending,
    signOutForOtherAccount,
  };
}
