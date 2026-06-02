"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  applyColorTheme,
  persistTheme,
  resolveInitialTheme,
  type ColorTheme,
} from "@/lib/theme";

type ThemeContextValue = {
  theme: ColorTheme;
  setTheme: (theme: ColorTheme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function readThemeFromDocument(): ColorTheme {
  const fromDom = document.documentElement.dataset.theme;
  if (fromDom === "light" || fromDom === "dark") return fromDom;
  return resolveInitialTheme();
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Keep SSR and the first client render identical; sync from the boot script after mount.
  const [theme, setThemeState] = useState<ColorTheme>("dark");

  useLayoutEffect(() => {
    setThemeState(readThemeFromDocument());
  }, []);

  useEffect(() => {
    applyColorTheme(theme);
    persistTheme(theme);
  }, [theme]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: light)");
    function onChange(event: MediaQueryListEvent) {
      if (localStorage.getItem("meetingroom.website.theme")) return;
      setThemeState(event.matches ? "light" : "dark");
    }
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: ColorTheme) => {
    setThemeState(next);
  }, []);

  const toggleTheme = useCallback(() => {
    setThemeState((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return ctx;
}
