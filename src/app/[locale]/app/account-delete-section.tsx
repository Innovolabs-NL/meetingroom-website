"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { DeleteAccountModal } from "./_components/delete-account-modal";
import { deleteAccount } from "./profile-actions";

function deleteErrorLabel(
  t: ReturnType<typeof useTranslations>,
  code?: string,
): string | null {
  if (!code) return null;
  if (code === "NOT_AUTHENTICATED") return t("deleteAccountNotAuthenticated");
  if (code === "INVALID_PASSWORD") return t("deleteAccountInvalidPassword");
  if (code === "SOLE_OWNER_CANNOT_DELETE") return t("deleteAccountBlockedSoleOwner");
  return t("deleteAccountErrorGeneric", { message: code });
}

export function AccountDeleteSection({
  locale,
  userEmail,
  canDelete,
  soleOwnerTeamNames,
}: {
  locale: string;
  userEmail: string;
  canDelete: boolean;
  soleOwnerTeamNames: string[];
}) {
  const t = useTranslations("appShell");
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startDelete] = useTransition();

  function openModal() {
    if (!canDelete) return;
    setError(null);
    setConfirmEmail("");
    setPassword("");
    setModalOpen(true);
  }

  function closeModal() {
    if (pending) return;
    setModalOpen(false);
    setConfirmEmail("");
    setPassword("");
    setError(null);
  }

  function confirmDelete() {
    setError(null);
    startDelete(async () => {
      const result = await deleteAccount(locale, password);
      if (result?.error) {
        setError(deleteErrorLabel(t, result.error) ?? result.error);
        return;
      }
      closeModal();
    });
  }

  const teamsList = soleOwnerTeamNames.join(", ");

  return (
    <>
      <section className="mt-8 rounded-2xl border border-red-500/25 bg-red-500/5 px-6 pb-6 pt-8">
        <h2 className="text-lg font-semibold tracking-tight text-red-100">{t("deleteAccountTitle")}</h2>
        <p className="mt-2 text-sm text-muted">{t("deleteAccountHint")}</p>

        {!canDelete ? (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {teamsList
              ? t("deleteAccountBlockedTeams", { teams: teamsList })
              : t("deleteAccountBlockedSoleOwner")}
          </p>
        ) : null}

        {error && !modalOpen ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}

        <button
          type="button"
          disabled={!canDelete || pending}
          onClick={openModal}
          className="mt-5 inline-flex rounded-xl border border-red-500/40 px-4 py-2.5 text-sm font-semibold text-red-100 transition-colors hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {t("deleteAccountButton")}
        </button>
      </section>

      <DeleteAccountModal
        open={modalOpen}
        userEmail={userEmail}
        confirmEmail={confirmEmail}
        password={password}
        error={error}
        pending={pending}
        onConfirmEmailChange={setConfirmEmail}
        onPasswordChange={setPassword}
        onCancel={closeModal}
        onConfirm={confirmDelete}
      />
    </>
  );
}
