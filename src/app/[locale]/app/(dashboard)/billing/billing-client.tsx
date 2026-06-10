"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { startPaddleCheckout } from "@/lib/billing/checkout";
import type { BillingSummary } from "@/lib/billing/get-billing-summary";
import { usePaddle } from "@/lib/paddle";

export function BillingClient({ summary }: { summary: BillingSummary }) {
  const t = useTranslations("billing");
  const paddle = usePaddle();
  const [busy, setBusy] = useState<"personal" | "team" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const portalUrl = process.env.NEXT_PUBLIC_PADDLE_CUSTOMER_PORTAL_URL?.trim() || "";
  const isPaid = ["personal", "team", "enterprise"].includes(summary.plan) && summary.plan !== "free";
  const periodEnd = summary.current_period_end
    ? new Date(summary.current_period_end).toLocaleDateString()
    : null;

  async function upgrade(plan: "personal" | "team") {
    setBusy(plan);
    setError(null);
    const result = await startPaddleCheckout(paddle, plan, {
      organizationId: plan === "team" ? summary.team?.organization_id : undefined,
      quantity: plan === "team" ? Math.max(1, summary.team?.seats_used ?? 1) : 1,
    });
    setBusy(null);
    if (result.ok) return;
    if (result.reason === "sign_in_required") setError(t("errors.signInRequired"));
    else if (result.reason === "team_required") setError(t("errors.teamRequired"));
    else if (result.reason === "forbidden") setError(t("errors.forbidden"));
    else setError(t("errors.notConfigured"));
  }

  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("currentPlanLabel")}</p>
        <p className="mt-2 text-2xl font-semibold capitalize">{t(`plans.${summary.plan}` as "plans.free")}</p>
        <p className="mt-1 text-sm text-muted">
          {summary.enforcement_enabled ? t("enforcementOn") : t("enforcementOff")}
        </p>
        {periodEnd ? (
          <p className="mt-2 text-sm text-muted">{t("renewsOn", { date: periodEnd })}</p>
        ) : null}
        {summary.limits.meetings_per_month != null ? (
          <p className="mt-2 text-sm text-muted">
            {t("meetingsUsed", {
              used: summary.meetings_used_this_month,
              limit: summary.limits.meetings_per_month,
            })}
          </p>
        ) : null}
      </div>

      {summary.team ? (
        <div className="rounded-2xl border border-border bg-surface p-6 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("teamSeatsLabel")}</p>
          <p className="mt-2 text-lg font-medium">{summary.team.organization_name}</p>
          <p className="mt-1 text-sm text-muted">
            {t("seatsUsed", { used: summary.team.seats_used, total: summary.team.seat_count })}
          </p>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600 dark:text-red-400">{error}</p> : null}

      <div className="flex flex-wrap gap-3">
        {summary.plan === "free" || summary.plan === "personal" ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void upgrade("personal")}
            className="rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover disabled:opacity-60"
          >
            {busy === "personal" ? t("openingCheckout") : t("upgradePersonal")}
          </button>
        ) : null}
        {summary.team?.can_manage_billing ? (
          <button
            type="button"
            disabled={busy !== null}
            onClick={() => void upgrade("team")}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover disabled:opacity-60"
          >
            {busy === "team" ? t("openingCheckout") : t("upgradeTeam")}
          </button>
        ) : null}
        {portalUrl && isPaid ? (
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold hover:bg-surface-hover"
          >
            {t("manageSubscription")}
          </a>
        ) : null}
      </div>
    </div>
  );
}
