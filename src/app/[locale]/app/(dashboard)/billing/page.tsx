import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";

import { getBillingSummary } from "@/lib/billing/get-billing-summary";
import { AppPageHeader } from "../../_components/app-page-header";
import { AppPageMotion } from "../../_components/app-page-motion";
import { BillingClient } from "./billing-client";

export const dynamic = "force-dynamic";

export default async function BillingPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("billing");
  const summary = await getBillingSummary();

  return (
    <AppPageMotion>
      <AppPageHeader title={t("title")} subtitle={t("subtitle")} />
      {summary ? (
        <BillingClient summary={summary} />
      ) : (
        <p className="mt-8 text-sm text-muted">{t("unavailable")}</p>
      )}
    </AppPageMotion>
  );
}
