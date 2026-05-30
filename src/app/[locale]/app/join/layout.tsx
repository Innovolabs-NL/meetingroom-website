import { Link } from "@i18n/navigation";
import { getTranslations } from "next-intl/server";

export const dynamic = "force-dynamic";

export default async function JoinLayout({ children }: { children: React.ReactNode }) {
  const t = await getTranslations("appShell");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-6 py-4">
        <Link href="/" className="text-sm font-semibold text-foreground">
          MeetingRoom
        </Link>
      </header>
      <div className="mx-auto w-full max-w-lg px-6 py-12">
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
