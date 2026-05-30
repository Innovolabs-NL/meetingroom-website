"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@i18n/navigation";
import { createTeamAction, type CreateTeamState } from "./actions";

export function CreateTeamForm() {
  const t = useTranslations("appHub");
  const router = useRouter();
  const [state, formAction, pending] = useActionState<CreateTeamState | null, FormData>(
    createTeamAction,
    null,
  );

  useEffect(() => {
    if (state?.ok && state.slug) {
      router.push(`/app/t/${state.slug}`);
      router.refresh();
    }
  }, [state, router]);

  const errorKey = state?.error;

  const errorText =
    errorKey === "TEAM_NAME_REQUIRED"
      ? t("errorNameRequired")
      : errorKey === "NOT_AUTHENTICATED"
        ? t("errorNotAuthenticated")
        : errorKey === "TEAM_SLUG_CONFLICT"
          ? t("errorSlugConflict")
          : errorKey === "TEAM_LIMIT_REACHED"
            ? t("errorTeamLimitReached")
            : errorKey
            ? t("unknownError", { message: errorKey })
            : null;

  return (
    <form action={formAction} className="mt-5 flex flex-col gap-3 sm:flex-row">
      <input
        name="name"
        placeholder={t("teamNamePlaceholder")}
        required
        disabled={pending}
        className="h-11 flex-1 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none placeholder:text-muted/70 focus:border-border-light disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={pending}
        className="inline-flex h-11 items-center justify-center rounded-xl bg-accent px-5 text-sm font-semibold text-white shadow-md shadow-accent/20 transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        {pending ? t("creatingTeam") : t("createTeam")}
      </button>
      {errorText ? (
        <p className="sm:w-full sm:basis-[100%] text-sm text-red-300">{errorText}</p>
      ) : null}
    </form>
  );
}
