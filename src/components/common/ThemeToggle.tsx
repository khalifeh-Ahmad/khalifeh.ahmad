import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { FiMonitor, FiMoon, FiSun } from "react-icons/fi";

import { useThemeMode } from "@/components/theme/ThemeProvider";
import type { ThemeMode } from "@/lib/theme";

const OPTIONS: Array<{ key: ThemeMode; label: string; icon: ReactNode }> = [
  { key: "light", label: "Light", icon: <FiSun size={14} /> },
  { key: "dark", label: "Dark", icon: <FiMoon size={14} /> },
  { key: "system", label: "System", icon: <FiMonitor size={14} /> },
];

function ThemeToggle() {
  const { mode, setMode } = useThemeMode();

  return (
    <div className="relative inline-flex items-center rounded-2xl border border-white/10 bg-white/5 p-1 backdrop-blur">
      {OPTIONS.map((option) => {
        const isActive = option.key === mode;

        return (
          <button
            key={option.key}
            type="button"
            onClick={() => setMode(option.key)}
            aria-pressed={isActive}
            className="relative z-10 inline-flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-gray-300 transition hover:text-white"
            title={`${option.label} mode`}
          >
            {isActive && (
              <motion.span
                layoutId="theme-toggle-pill"
                className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/20 bg-cyan-400/10"
                transition={{ type: "spring", stiffness: 320, damping: 26 }}
              />
            )}
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default ThemeToggle;
