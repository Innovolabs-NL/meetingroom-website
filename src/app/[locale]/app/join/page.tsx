import { Suspense } from "react";

import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { AuthCard, AuthCardHeader } from "@/components/auth/auth-card";
import { loadInvitePreview } from "@/lib/app/load-invite-preview";
import { JoinInviteClient } from "./join-invite-client";
import { JoinPageMotion } from "./join-page-motion";

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
    <JoinPageMotion>
      <AuthCard>
        <AuthCardHeader title={t("title")} subtitle={t("hint")} />
        <Suspense fallback={<p className="text-sm text-muted">{t("loading")}</p>}>
          <JoinInviteBody token={normalizedToken} />
        </Suspense>
      </AuthCard>
    </JoinPageMotion>
  );
}
