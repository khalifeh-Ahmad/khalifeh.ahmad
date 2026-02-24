import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";

import { useThemeMode } from "@/components/theme/ThemeProvider";
import type { ThemeMode } from "@/lib/theme";

const OPTIONS: Array<{
  key: ThemeMode;
  label: string;
  shortLabel: string;
  icon: ReactNode;
}> = [
  { key: "light", label: "Light", shortLabel: "L", icon: <FiSun size={15} /> },
  { key: "dark", label: "Dark", shortLabel: "D", icon: <FiMoon size={15} /> },
  {
    key: "system",
    label: "System",
    shortLabel: "S",
    icon: <FiMonitor size={15} />,
  },
];

function FloatingThemeSwitcher() {
  const { mode, resolvedTheme, setMode } = useThemeMode();

  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[70] sm:bottom-6 sm:right-6">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto"
      >
        <div className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-1.5 shadow-[0_10px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/5">
          {/* outer glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.12),transparent_45%),radial-gradient(circle_at_80%_20%,rgba(139,92,246,0.12),transparent_45%)]"
          />
          {/* top highlight */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
          />

          <div className="relative flex items-center gap-1">
            {OPTIONS.map((option) => {
              const isActive = mode === option.key;

              return (
                <button
                  key={option.key}
                  type="button"
                  onClick={() => setMode(option.key)}
                  aria-pressed={isActive}
                  title={`${option.label} mode`}
                  className="relative inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-medium text-gray-300 transition hover:text-white sm:px-3"
                >
                  {isActive && (
                    <motion.span
                      layoutId="floating-theme-pill"
                      className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/20 bg-cyan-400/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 26,
                      }}
                    />
                  )}

                  <span
                    className={[
                      "inline-flex h-7 w-7 items-center justify-center rounded-lg border text-[11px] transition",
                      isActive
                        ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                        : "border-white/10 bg-white/5 text-gray-300",
                    ].join(" ")}
                  >
                    {option.icon}
                  </span>

                  <span className="hidden md:inline">{option.label}</span>
                  <span className="md:hidden">{option.shortLabel}</span>
                </button>
              );
            })}
          </div>

          {/* resolved theme indicator */}
          <div className="relative mt-1 flex items-center justify-center">
            <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-gray-400">
              Active: {resolvedTheme}
            </span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default FloatingThemeSwitcher;
