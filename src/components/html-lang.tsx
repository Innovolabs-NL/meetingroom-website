"use client";

import { useLayoutEffect } from "react";

/** Keeps `<html lang>` in sync when the locale segment changes via client navigation. */
export function HtmlLang({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
