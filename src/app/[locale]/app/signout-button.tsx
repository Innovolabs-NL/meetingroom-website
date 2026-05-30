"use client";

import { useMemo, useTransition } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function SignOutButton() {
  const t = useTranslations("appShell");
  const router = useRouter();
  const client = useMemo(() => createBrowserSupabaseClient(), []);
  const [isPending, startTransition] = useTransition();

  if (!client) return null;

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        startTransition(async () => {
          await client.auth.signOut();
          router.push("/login");
          router.refresh();
        });
      }}
      className="rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-muted transition-colors hover:bg-surface hover:text-foreground disabled:opacity-60"
    >
      {isPending ? t("signingOut") : t("signOut")}
    </button>
  );
}

