"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { TeamDeleteModal } from "./_components/team-delete-modal";
import { deleteOrganization } from "./team-actions";

function deleteErrorLabel(t: ReturnType<typeof useTranslations>, code?: string): string | null {
  if (!code) return null;
  if (code === "NOT_AUTHENTICATED") return t("errors.notAuthenticated");
  if (code === "NOT_OWNER") return t("errors.notOwner");
  if (code === "SLUG_MISMATCH") return t("deleteTeamSlugMismatch");
  if (code === "RPC_NOT_APPLIED") return t("errors.rpcNotApplied");
  return t("errors.generic", { message: code });
}

export function TeamDeleteSection({
  organizationId,
  organizationSlug,
  teamName,
  locale,
}: {
  organizationId: string;
  organizationSlug: string;
  teamName: string;
  locale: string;
}) {
  const t = useTranslations("appTeam");
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, startDelete] = useTransition();

  function openModal() {
    setConfirmSlug("");
    setError(null);
    setModalOpen(true);
  }

  function closeModal() {
    if (pending) return;
    setModalOpen(false);
    setConfirmSlug("");
    setError(null);
  }

  function confirmDelete() {
    setError(null);
    startDelete(async () => {
      const result = await deleteOrganization(organizationId, organizationSlug, locale, confirmSlug);
      if (result?.error) {
        setError(deleteErrorLabel(t, result.error) ?? result.error);
      }
    });
  }

  return (
    <>
      <section className="rounded-2xl border border-danger-border bg-danger-muted px-6 pb-6 pt-8">
        <h2 className="text-lg font-semibold tracking-tight text-danger-foreground">{t("deleteTeamTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("deleteTeamHint")}</p>

        <button
          type="button"
          disabled={pending}
          onClick={openModal}
          className="mt-5 inline-flex rounded-xl border border-danger-border px-4 py-2.5 text-sm font-semibold text-danger-foreground transition-colors hover:bg-danger-muted/80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("deleteTeamButton")}
        </button>
      </section>

      <TeamDeleteModal
        open={modalOpen}
        teamName={teamName}
        teamSlug={organizationSlug}
        confirmSlug={confirmSlug}
        error={error}
        pending={pending}
        onConfirmSlugChange={setConfirmSlug}
        onCancel={closeModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
