"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { memberDisplayName } from "@/lib/app/member-display";
import { TransferOwnershipModal } from "./_components/transfer-ownership-modal";
import { transferOrganizationOwnership } from "./team-actions";

type Candidate = {
  user_id: string;
  role: string;
  email: string | null;
  full_name: string | null;
};

function transferErrorLabel(t: ReturnType<typeof useTranslations>, code?: string): string | null {
  if (!code) return null;
  if (code === "NOT_AUTHENTICATED") return t("errors.notAuthenticated");
  if (code === "NOT_OWNER") return t("errors.notOwner");
  if (code === "TARGET_NOT_MEMBER") return t("errors.targetNotMember");
  if (code === "ALREADY_OWNER") return t("errors.alreadyOwner");
  if (code === "INVALID_PASSWORD") return t("transferOwnershipInvalidPassword");
  if (code === "RPC_NOT_APPLIED") return t("errors.rpcNotApplied");
  return t("errors.generic", { message: code });
}

export function TeamTransferOwnershipSection({
  organizationId,
  organizationSlug,
  userEmail,
  candidates,
}: {
  organizationId: string;
  organizationSlug: string;
  userEmail: string;
  candidates: Candidate[];
}) {
  const t = useTranslations("appTeam");
  const router = useRouter();
  const [selectedUserId, setSelectedUserId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [pending, startTransfer] = useTransition();

  const options = useMemo(
    () =>
      candidates.map((m) => ({
        id: m.user_id,
        label: memberDisplayName(m.full_name, m.email) || t("unknownMember"),
        role: m.role,
      })),
    [candidates, t],
  );

  const selectedLabel = options.find((o) => o.id === selectedUserId)?.label ?? "";

  function openModal() {
    if (!selectedUserId) return;
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

  function confirmTransfer() {
    if (!selectedUserId) return;

    setError(null);
    setSuccess(false);
    startTransfer(async () => {
      const result = await transferOrganizationOwnership(
        organizationId,
        organizationSlug,
        selectedUserId,
        password,
      );
      if ("error" in result) {
        setError(transferErrorLabel(t, result.error) ?? result.error);
        return;
      }
      setSuccess(true);
      setSelectedUserId("");
      closeModal();
      router.refresh();
    });
  }

  return (
    <>
      <section className="rounded-2xl border border-border bg-surface/50 p-6 sm:p-8">
        <h2 className="text-lg font-semibold tracking-tight">{t("transferOwnershipTitle")}</h2>
        <p className="mt-2 max-w-xl text-sm text-muted">{t("transferOwnershipHint")}</p>

        {options.length === 0 ? (
          <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
            {t("transferOwnershipNoMembers")}
          </p>
        ) : (
          <>
            <div className="mt-5 max-w-md">
              <label htmlFor="transfer-owner-select" className="text-sm font-medium text-foreground">
                {t("transferOwnershipSelectLabel")}
              </label>
              <select
                id="transfer-owner-select"
                value={selectedUserId}
                onChange={(e) => {
                  setSelectedUserId(e.target.value);
                  setSuccess(false);
                  setError(null);
                }}
                disabled={pending}
                className="mt-2 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-sm text-foreground outline-none ring-accent/40 focus:ring-2"
              >
                <option value="">{t("transferOwnershipSelectPlaceholder")}</option>
                {options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label} (
                    {t(o.role === "admin" ? "roleAdmin" : o.role === "owner" ? "roleOwner" : "roleMember")})
                  </option>
                ))}
              </select>
            </div>

            {error && !modalOpen ? <p className="mt-4 text-sm text-red-300">{error}</p> : null}
            {success ? (
              <p className="mt-4 text-sm text-emerald-300">{t("transferOwnershipSuccess")}</p>
            ) : null}

            <button
              type="button"
              disabled={!selectedUserId || pending}
              onClick={openModal}
              className="mt-5 inline-flex rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-background disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t("transferOwnershipButton")}
            </button>
          </>
        )}
      </section>

      <TransferOwnershipModal
        open={modalOpen}
        newOwnerName={selectedLabel}
        userEmail={userEmail}
        confirmEmail={confirmEmail}
        password={password}
        error={error}
        pending={pending}
        onConfirmEmailChange={setConfirmEmail}
        onPasswordChange={setPassword}
        onCancel={closeModal}
        onConfirm={confirmTransfer}
      />
    </>
  );
}
