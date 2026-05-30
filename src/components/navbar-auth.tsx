"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { Link } from "@i18n/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

const MotionLink = motion.create(Link);

export function NavbarAuth({ mobile = false }: { mobile?: boolean }) {
  const t = useTranslations("nav");
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);
  const [loggedIn, setLoggedIn] = useState<boolean | null>(supabase ? null : false);

  useEffect(() => {
    if (!supabase) return;

    let cancelled = false;

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!cancelled) setLoggedIn(Boolean(user));
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setLoggedIn(Boolean(session?.user));
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, [supabase]);

  if (loggedIn === null) {
    return (
      <span
        className={`animate-pulse rounded-lg bg-surface/80 ${mobile ? "h-9 w-full" : "hidden h-9 w-24 md:inline-block"}`}
      />
    );
  }

  if (loggedIn) {
    return (
      <MotionLink
        href="/app"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className={
          mobile
            ? "inline-flex rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground transition-colors hover:bg-surface"
            : "hidden rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground/90 transition-colors hover:bg-surface md:inline-flex"
        }
      >
        {t("account")}
      </MotionLink>
    );
  }

  if (mobile) {
    return (
      <div className="flex flex-wrap gap-2">
        <Link
          href="/login"
          className="rounded-lg px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground"
        >
          {t("signIn")}
        </Link>
        <Link
          href="/signup"
          className="rounded-lg bg-accent px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
        >
          {t("signUp")}
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 md:flex">
      <MotionLink
        href="/login"
        whileHover={{ y: -1 }}
        className="px-3 py-2 text-sm text-muted transition-colors hover:text-foreground"
      >
        {t("signIn")}
      </MotionLink>
      <MotionLink
        href="/signup"
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
        className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover"
      >
        {t("signUp")}
      </MotionLink>
    </div>
  );
}
