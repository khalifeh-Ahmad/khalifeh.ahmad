import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type BackgroundVariant = "nebula" | "aurora";

type Ctx = {
  variant: BackgroundVariant;
  setVariant: (v: BackgroundVariant) => void;
};
const BackgroundCtx = createContext<Ctx | null>(null);

const STORAGE_KEY = "portfolio:bgVariant";

export function BackgroundProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [variant, setVariantState] = useState<BackgroundVariant>("nebula");

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as BackgroundVariant | null;
    if (saved === "nebula" || saved === "aurora") setVariantState(saved);
  }, []);

  const setVariant = (v: BackgroundVariant) => {
    setVariantState(v);
    localStorage.setItem(STORAGE_KEY, v);
  };

  const value = useMemo(() => ({ variant, setVariant }), [variant]);
  return (
    <BackgroundCtx.Provider value={value}>{children}</BackgroundCtx.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(BackgroundCtx);
  if (!ctx)
    throw new Error("useBackground must be used within BackgroundProvider");
  return ctx;
}
