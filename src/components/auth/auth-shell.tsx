import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/navigation";

export async function AuthShell({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("auth");

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden
      >
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border/40 bg-background/60 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <Image src="/logo.svg" alt="MeetingRoom" width={28} height={28} />
            <span className="text-lg font-semibold tracking-tight">MeetingRoom</span>
          </Link>
          <Link
            href="/"
            className="text-sm text-muted transition-colors hover:text-foreground"
          >
            ← {t("backHome")}
          </Link>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-10 px-6 py-10 lg:flex-row lg:items-center lg:justify-between lg:gap-16 lg:py-16">
        <aside className="mx-auto max-w-md text-center lg:mx-0 lg:max-w-lg lg:text-left">
          <p className="inline-flex rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-blue-200">
            {t("badge")}
          </p>
          <h1 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">{t("asideTitle")}</h1>
          <p className="mt-4 text-base leading-relaxed text-muted">{t("asideSubtitle")}</p>
          <ul className="mt-8 hidden space-y-3 text-sm text-muted lg:block">
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-blue-200">
                ✓
              </span>
              {t("trustLocal")}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-blue-200">
                ✓
              </span>
              {t("trustTeams")}
            </li>
            <li className="flex items-start gap-3">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/20 text-xs text-blue-200">
                ✓
              </span>
              {t("trustGdpr")}
            </li>
          </ul>
        </aside>

        <div className="mx-auto w-full max-w-md shrink-0">{children}</div>
      </div>
    </div>
  );
}
