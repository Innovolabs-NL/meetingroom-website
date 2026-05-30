import { getTranslations } from "next-intl/server";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Link } from "../../i18n/navigation";

export async function StaticPageShell({
  locale,
  children,
}: {
  locale: string;
  children: React.ReactNode;
}) {
  const t = await getTranslations({ locale, namespace: "standalone" });

  return (
    <>
      <Navbar />
      <main className="min-h-[60vh] pt-16">
        <div className="mx-auto max-w-3xl px-6 py-12 md:py-20">
          <Link
            href="/"
            className="inline-flex text-sm font-medium text-muted transition-colors hover:text-accent"
          >
            ← {t("backHome")}
          </Link>
          <div className="mt-8">{children}</div>
        </div>
      </main>
      <Footer />
    </>
  );
}
