import { setRequestLocale } from "next-intl/server";
import { getTranslations } from "next-intl/server";
import { Link } from "@i18n/navigation";

export const dynamic = "force-dynamic";

const links = [
  { href: "/documentation", key: "helpDocs" as const },
  { href: "/faq", key: "helpFaq" as const },
  { href: "/changelog", key: "helpChangelog" as const },
  { href: "/contact", key: "helpContact" as const },
] as const;

export default async function HelpPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("appShell");

  return (
    <div>
      <h1 className="text-2xl font-semibold tracking-tight">{t("helpTitle")}</h1>
      <p className="mt-2 text-sm text-muted">{t("helpSubtitle")}</p>

      <ul className="mt-8 divide-y divide-border rounded-2xl border border-border bg-surface">
        {links.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="flex items-center justify-between px-5 py-4 text-sm transition-colors hover:bg-surface-hover"
            >
              <span>{t(item.key)}</span>
              <span className="text-muted">→</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
