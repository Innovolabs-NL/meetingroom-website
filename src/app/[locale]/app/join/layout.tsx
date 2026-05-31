import Image from "next/image";
import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";
import { ThemeToggle } from "@/components/theme-toggle";

export const dynamic = "force-dynamic";

export default async function JoinLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("appShell");

  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-accent/5 blur-3xl" />
      </div>

      <header className="relative z-10 border-b border-border bg-[var(--color-navbar)] px-4 py-4 backdrop-blur-xl sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 transition-opacity hover:opacity-90">
            <Image src="/logo.svg" alt="MeetingRoom" width={28} height={28} />
            <span className="text-lg font-semibold tracking-tight">MeetingRoom</span>
          </Link>
          <ThemeToggle />
        </div>
      </header>

      <div className="relative z-10 mx-auto w-full max-w-lg flex-1 px-4 py-8 sm:px-6 sm:py-12">
        {children}
        <p className="mt-8 text-center text-sm text-muted">
          <Link href="/app" className="text-accent hover:underline">
            {t("backToAccount")}
          </Link>
        </p>
      </div>
    </div>
  );
}
