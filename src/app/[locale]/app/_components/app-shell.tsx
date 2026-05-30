import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/navigation";
import { getAppContext } from "@/lib/app/get-app-context";
import { AppSidebar } from "./app-sidebar";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("appShell");
  const ctx = await getAppContext();

  if (!ctx.configured) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6">
          <h1 className="text-xl font-semibold tracking-tight">{t("configTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("configMissingEnv")}</p>
          <Link href="/" className="mt-4 inline-block text-sm text-accent hover:underline">
            {t("backToWebsite")}
          </Link>
        </div>
      </div>
    );
  }

  if (!ctx.user) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <div className="w-full max-w-lg rounded-2xl border border-border bg-surface p-6">
          <h1 className="text-xl font-semibold tracking-tight">{t("notSignedInTitle")}</h1>
          <p className="mt-2 text-sm text-muted">{t("notSignedInHint")}</p>
          <Link href="/login" className="mt-4 inline-block text-sm font-medium text-accent hover:underline">
            {t("goToSignIn")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AppSidebar
        email={ctx.user.email}
        accountKind={ctx.accountKind}
        team={ctx.team}
        canCreateTeam={ctx.canCreateTeam}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-3xl px-8 py-10">{children}</div>
        </main>
      </div>
    </div>
  );
}
