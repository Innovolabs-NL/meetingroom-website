"use client";

import { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { ConfirmModal } from "@/components/confirm-modal";
import { memberDisplayName } from "@/lib/app/member-display";
import { MemberAvatar } from "./_components/member-avatar";
import { RoleBadge, roleLabelKey } from "./_components/role-badge";
import { removeOrganizationMember, updateOrganizationMemberRole } from "./team-actions";

type Member = {
  user_id: string;
  role: string;
  email: string | null;
  full_name: string | null;
  company: string | null;
};

function roleErrorLabel(t: ReturnType<typeof useTranslations>, code?: string): string | null {
  if (!code) return null;
  if (code === "NOT_AUTHENTICATED") return t("errors.notAuthenticated");
  if (code === "NOT_OWNER") return t("errors.notOwner");
  if (code === "NOT_A_MEMBER") return t("errors.notAMember");
  if (code === "CANNOT_CHANGE_OWNER") return t("errors.cannotChangeOwner");
  if (code === "CANNOT_CHANGE_SELF") return t("errors.cannotChangeSelf");
  if (code === "RPC_NOT_APPLIED") return t("errors.rpcNotAppliedRole");
  return t("errors.generic", { message: code });
}

export function TeamMembersSection({
  organizationId,
  organizationSlug,
  members,
  currentUserId,
  canManage,
  isOwner,
}: {
  organizationId: string;
  organizationSlug: string;
  members: Member[];
  currentUserId: string;
  canManage: boolean;
  isOwner: boolean;
}) {
  const t = useTranslations("appTeam");
  const [memberToRemove, setMemberToRemove] = useState<Member | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [rolePendingId, setRolePendingId] = useState<string | null>(null);
  const [removePending, startRemove] = useTransition();
  const [rolePending, startRoleChange] = useTransition();

  const removeTargetName = memberToRemove
    ? memberDisplayName(memberToRemove.full_name, memberToRemove.email) || t("unknownMember")
    : "";

  function openRemoveModal(member: Member) {
    setError(null);
    setMemberToRemove(member);
  }

  function closeModal() {
    if (removePending) return;
    setMemberToRemove(null);
    setError(null);
  }

  function confirmRemove() {
    if (!memberToRemove) return;

    setError(null);
    startRemove(async () => {
      const result = await removeOrganizationMember(
        organizationId,
        organizationSlug,
        memberToRemove.user_id,
      );
      if ("error" in result) {
        setError(result.error ?? t("errors.generic", { message: "UNKNOWN" }));
        return;
      }
      closeModal();
    });
  }

  function changeRole(member: Member, nextRole: "admin" | "member") {
    const currentRole = member.role === "admin" ? "admin" : "member";
    if (nextRole === currentRole) return;

    setError(null);
    setRolePendingId(member.user_id);
    startRoleChange(async () => {
      const result = await updateOrganizationMemberRole(
        organizationId,
        organizationSlug,
        member.user_id,
        nextRole,
      );
      setRolePendingId(null);
      if ("error" in result) {
        setError(roleErrorLabel(t, result.error) ?? result.error);
      }
    });
  }

  return (
    <>
      <ul className="divide-y divide-border">
        {members.map((m) => {
          const isYou = m.user_id === currentUserId;
          const email = m.email ?? null;
          const primary = memberDisplayName(m.full_name, email) || t("unknownMember");
          const secondary =
            [email, m.company?.trim()].filter(Boolean).join(" · ") || `${m.user_id.slice(0, 8)}…`;
          const canEditRole =
            isOwner && !isYou && m.role !== "owner";
          const selectableRole = m.role === "admin" ? "admin" : "member";
          const isRoleUpdating = rolePending && rolePendingId === m.user_id;

          return (
            <li
              key={m.user_id}
              className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-5"
            >
              <div className="flex min-w-0 items-center gap-4">
                <MemberAvatar email={email} fullName={m.full_name} />
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="truncate font-medium text-foreground">{primary}</span>
                    {isYou ? (
                      <span className="rounded-md bg-accent/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-blue-200">
                        {t("youBadge")}
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-0.5 truncate text-sm text-muted">{secondary}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
                {canEditRole ? (
                  <label className="flex flex-col gap-1">
                    <span className="sr-only">{t("changeMemberRole")}</span>
                    <select
                      value={selectableRole}
                      disabled={isRoleUpdating || rolePending}
                      onChange={(e) =>
                        changeRole(m, e.target.value === "admin" ? "admin" : "member")
                      }
                      className="rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground outline-none ring-accent/40 focus:ring-2 disabled:opacity-50"
                    >
                      <option value="member">{t("roleMember")}</option>
                      <option value="admin">{t("roleAdmin")}</option>
                    </select>
                  </label>
                ) : (
                  <RoleBadge role={m.role} label={t(roleLabelKey(m.role))} />
                )}
                {canManage && !isYou && m.role !== "owner" ? (
                  <button
                    type="button"
                    onClick={() => openRemoveModal(m)}
                    disabled={removePending || rolePending}
                    className="rounded-lg border border-red-500/35 px-3 py-1.5 text-xs font-medium text-red-200 transition-colors hover:border-red-400/50 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    {t("removeMember")}
                  </button>
                ) : null}
              </div>
            </li>
          );
        })}
      </ul>

      <ConfirmModal
        open={memberToRemove !== null}
        variant="danger"
        title={t("removeMemberModalTitle")}
        description={
          removeTargetName
            ? `${t("removeMemberConfirm")} (${removeTargetName})`
            : t("removeMemberConfirm")
        }
        cancelLabel={t("modalCancel")}
        confirmLabel={t("removeMember")}
        pending={removePending}
        onCancel={closeModal}
        onConfirm={confirmRemove}
      />

      {error ? (
        <p className="mt-4 px-5 text-sm text-red-300 sm:px-6">{error}</p>
      ) : null}
    </>
  );
}
