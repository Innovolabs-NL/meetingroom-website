"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ConfirmModal } from "@/components/confirm-modal";
import { leaveOrganization } from "./team-actions";

function leaveErrorLabel(t: ReturnType<typeof useTranslations>, code?: string): string | null {
  if (!code) return null;
  if (code === "NOT_AUTHENTICATED") return t("errors.notAuthenticated");
  if (code === "NOT_A_MEMBER") return t("errors.notAMember");
  if (code === "SOLE_OWNER_CANNOT_LEAVE") return t("errors.soleOwnerCannotLeave");
  return t("errors.generic", { message: code });
}

export function TeamLeaveSection({
  organizationId,
  organizationSlug,
  locale,
  canLeave,
}: {
  organizationId: string;
  organizationSlug: string;
  locale: string;
  canLeave: boolean;
}) {
  const t = useTranslations("appTeam");
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [pending, startLeave] = useTransition();

  function openModal() {
    if (!canLeave) return;
    setError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (pending) return;
    setModalOpen(false);
  }

  function confirmLeave() {
    setError(null);
    startLeave(async () => {
      const result = await leaveOrganization(organizationId, organizationSlug, locale);
      if (result?.error) {
        setError(leaveErrorLabel(t, result.error) ?? result.error);
        closeModal();
        return;
      }
      closeModal();
    });
  }

  return (
    <>
      <section className="rounded-2xl border border-danger-border bg-danger-muted p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight text-danger-foreground">{t("leaveTeamTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("leaveTeamHint")}</p>

        {!canLeave ? (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {t("leaveTeamBlockedSoleOwner")}
          </p>
        ) : null}

        {error ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <button
          type="button"
          disabled={!canLeave || pending}
          onClick={openModal}
          className="mt-5 inline-flex rounded-xl border border-danger-border px-4 py-2.5 text-sm font-semibold text-danger-foreground transition-colors hover:bg-danger-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("leaveTeamButton")}
        </button>
      </section>

      <ConfirmModal
        open={modalOpen}
        variant="danger"
        title={t("leaveTeamModalTitle")}
        description={t("leaveTeamConfirm")}
        cancelLabel={t("modalCancel")}
        confirmLabel={t("leaveTeamButton")}
        pendingLabel={t("leaveTeamLeaving")}
        pending={pending}
        onCancel={closeModal}
        onConfirm={confirmLeave}
      />
    </>
  );
}
