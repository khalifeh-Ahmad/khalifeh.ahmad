import { useEffect, useMemo, useState } from "react";

export type BackgroundVariant = "nebula" | "aurora";

const STORAGE_KEY = "portfolio:bgVariant";

export function useBackgroundVariant(
  defaultVariant: BackgroundVariant = "nebula",
) {
  const [variant, setVariant] = useState<BackgroundVariant>(defaultVariant);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as BackgroundVariant | null;
    if (saved === "nebula" || saved === "aurora") setVariant(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, variant);
  }, [variant]);

  const options = useMemo(
    () => [
      { id: "nebula" as const, label: "Nebula" },
      { id: "aurora" as const, label: "Aurora Grid" },
    ],
    [],
  );

  return { variant, setVariant, options };
}
