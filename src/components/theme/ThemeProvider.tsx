import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  applyTheme,
  getStoredThemeMode,
  getSystemTheme,
  setStoredThemeMode,
  type ThemeMode,
} from "@/lib/theme";

interface ThemeContextValue {
  mode: ThemeMode;
  resolvedTheme: "dark" | "light";
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [mode, setMode] = useState<ThemeMode>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const stored = getStoredThemeMode();
    const initialMode = stored ?? "system";
    setMode(initialMode);

    const resolved = initialMode === "system" ? getSystemTheme() : initialMode;
    setResolvedTheme(resolved);
    applyTheme(initialMode);
  }, []);

  useEffect(() => {
    const resolved = mode === "system" ? getSystemTheme() : mode;
    setResolvedTheme(resolved);
    applyTheme(mode);
    setStoredThemeMode(mode);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (mode !== "system") return;
      const nextResolved = getSystemTheme();
      setResolvedTheme(nextResolved);
      applyTheme("system");
    };

    media.addEventListener?.("change", handleChange);

    return () => {
      media.removeEventListener?.("change", handleChange);
    };
  }, [mode]);

  const value = useMemo(
    () => ({
      mode,
      resolvedTheme,
      setMode,
    }),
    [mode, resolvedTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useThemeMode must be used within ThemeProvider");
  return ctx;
}
