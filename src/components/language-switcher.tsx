"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";
import { routing } from "../../i18n/routing";

const labels: Record<string, string> = {
  en: "EN",
  nl: "NL",
  fr: "FR",
  de: "DE",
  es: "ES",
};

const fullLabels: Record<string, string> = {
  en: "English",
  nl: "Nederlands",
  fr: "Français",
  de: "Deutsch",
  es: "Español",
};

export function LanguageSwitcher({
  dropUp = false,
  onAfterSwitch,
}: {
  dropUp?: boolean;
  onAfterSwitch?: () => void;
} = {}) {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: PointerEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, []);

  function switchLocale(newLocale: string) {
    const segments = pathname.split("/");
    segments[1] = newLocale;
    router.push(segments.join("/"));
    setOpen(false);
    onAfterSwitch?.();
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-muted transition-colors hover:border-border-light hover:bg-surface-hover hover:text-foreground"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        {labels[locale] ?? "EN"}
        <svg
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className={`absolute z-50 w-40 overflow-hidden rounded-xl border border-border bg-surface shadow-2xl ${
            dropUp ? "bottom-full left-0 mb-2" : "right-0 top-full mt-2"
          }`}
        >
          {routing.locales.map((l) => (
            <button
              type="button"
              key={l}
              onClick={() => switchLocale(l)}
              className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-surface-hover ${
                l === locale ? "text-accent" : "text-muted"
              }`}
            >
              <span className="w-7 font-medium">{labels[l]}</span>
              <span>{fullLabels[l]}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
