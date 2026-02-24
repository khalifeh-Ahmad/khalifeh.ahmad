export type ThemeMode = "dark" | "light" | "system";

const STORAGE_KEY = "portfolio-theme-mode";

export function getStoredThemeMode(): ThemeMode | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === "dark" || raw === "light" || raw === "system") return raw;
  return null;
}

export function setStoredThemeMode(mode: ThemeMode) {
  window.localStorage.setItem(STORAGE_KEY, mode);
}

export function getSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function applyTheme(mode: ThemeMode) {
  const resolved = mode === "system" ? getSystemTheme() : mode;
  document.documentElement.setAttribute("data-theme", resolved);
}
