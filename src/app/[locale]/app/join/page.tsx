import { Suspense } from "react";

import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { loadInvitePreview } from "@/lib/app/load-invite-preview";
import { JoinInviteClient } from "./join-invite-client";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
};

async function JoinInviteBody({ token }: { token: string | null }) {
  const inviteLoad = await loadInvitePreview(token);
  return <JoinInviteClient token={token} inviteLoad={inviteLoad} />;
}

export default async function JoinPage({ params, searchParams }: PageProps) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appJoin");
  const { token } = await searchParams;
  const normalizedToken = token?.trim() ?? null;

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">{t("title")}</h1>
      <p className="mt-2 text-sm text-muted">{t("hint")}</p>
      <div className="mt-8 rounded-2xl border border-border bg-surface p-6">
        <Suspense fallback={<p className="text-sm text-muted">{t("loading")}</p>}>
          <JoinInviteBody token={normalizedToken} />
        </Suspense>
      </div>
    </>
  );
}
