export type ColorTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "meetingroom.website.theme";

/** Runs before paint to avoid a flash of the wrong theme. */
export const THEME_INIT_SCRIPT = `(function(){var t="dark";try{var s=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(s==="light"||s==="dark")t=s;else if(window.matchMedia("(prefers-color-scheme: light)").matches)t="light";}catch(e){}document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;})();`;

export function applyColorTheme(theme: ColorTheme): void {
  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function getStoredTheme(): ColorTheme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    if (value === "light" || value === "dark") return value;
  } catch {
    /* private browsing / blocked storage */
  }
  return null;
}

export function resolveInitialTheme(): ColorTheme {
  const stored = getStoredTheme();
  if (stored) return stored;
  if (typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: light)").matches) {
    return "light";
  }
  return "dark";
}

export function persistTheme(theme: ColorTheme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    /* ignore */
  }
}
