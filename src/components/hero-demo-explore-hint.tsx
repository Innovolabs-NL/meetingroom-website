"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";

const STORAGE_KEY = "meetingroom-hero-demo-explore-seen";

export function useHeroDemoExploreCoach() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(!sessionStorage.getItem(STORAGE_KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  function dismiss() {
    try {
      sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* ignore */
    }
    setVisible(false);
  }

  return { visible, dismiss };
}

export function HeroDemoExploreCoach({
  visible,
  onDismiss,
}: {
  visible: boolean;
  onDismiss: () => void;
}) {
  const t = useTranslations("hero.demo");

  if (!visible) return null;

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-30 flex justify-center px-3 sm:bottom-6">
      <div
        role="status"
        className="hero-demo-explore-coach pointer-events-auto flex max-w-[min(100%,22rem)] items-center gap-2 rounded-full border border-accent/35 bg-surface/95 px-3 py-2 text-[0.82em] font-medium text-foreground shadow-elevated backdrop-blur-sm sm:max-w-md sm:text-[0.88em]"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          className="shrink-0 text-accent"
          aria-hidden
        >
          <path d="M4 4l7 16 2.5-7.5L21 10z" />
        </svg>
        <span className="min-w-0 flex-1 leading-snug">{t("exploreCoach")}</span>
        <button
          type="button"
          onClick={onDismiss}
          className="shrink-0 rounded-md px-1.5 py-0.5 text-[0.9em] text-muted transition-colors hover:bg-surface-hover hover:text-foreground"
        >
          {t("exploreDismiss")}
        </button>
      </div>
    </div>
  );
}
