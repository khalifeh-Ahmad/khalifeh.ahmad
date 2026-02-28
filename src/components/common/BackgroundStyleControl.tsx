import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiLayers } from "react-icons/fi";
import { cn } from "@/utils/cn";
import type { BackgroundVariant } from "@/components/background/BackgroundProvider";

type Props = {
  value: BackgroundVariant;
  onChange: (v: BackgroundVariant) => void;
};

function BackgroundStyleControl({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  const items: Array<{ id: BackgroundVariant; label: string; desc: string }> = [
    { id: "nebula", label: "Nebula", desc: "Particles + energy lines" },
    { id: "aurora", label: "Aurora Grid", desc: "Wire grid + aurora ribbons" },
  ];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className={cn(
          "group inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-700",
          "dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)] shadow-[0_10px_30px_rgba(15,23,42,0.08)]",
          "backdrop-blur-xl transition",
          "hover:border-white/15 hover:bg-white/10 hover:text-gray-900",
          "dark:text-gray-200 dark:hover:border-white/20 dark:hover:text-white",
        )}
        aria-expanded={open}
        aria-haspopup="dialog"
      >
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5">
          <FiLayers size={16} />
        </span>
        <span className="hidden sm:inline">Background</span>
        <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300">
          {value === "nebula" ? "Nebula" : "Aurora"}
        </span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-[280px] overflow-hidden rounded-3xl border border-white/10 bg-white/80 shadow-[0_18px_60px_rgba(15,23,42,0.12)] backdrop-blur-xl dark:bg-[#0b1220]/80 dark:shadow-[0_18px_60px_rgba(0,0,0,0.45)]"
            role="dialog"
            aria-label="Background style"
          >
            <div className="p-3">
              <p className="px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-gray-400 dark:text-gray-500">
                Choose a background
              </p>

              <div className="mt-2 grid gap-2">
                {items.map((it) => {
                  const active = it.id === value;
                  return (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        onChange(it.id);
                        setOpen(false);
                      }}
                      className={cn(
                        "text-left rounded-2xl border px-3 py-3 transition",
                        active
                          ? "border-[#FAAD14]/40 bg-[#FAAD14]/15"
                          : "border-white/10 bg-white/5 hover:border-white/15 hover:bg-white/10",
                        "dark:bg-white/5 dark:hover:bg-white/10",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p
                            className={cn(
                              "text-sm font-semibold",
                              active ? "text-[#FAAD14]" : "text-gray-900 dark:text-white",
                            )}
                          >
                            {it.label}
                          </p>
                          <p className="mt-1 text-xs text-gray-600 dark:text-gray-300">
                            {it.desc}
                          </p>
                        </div>

                        {active ? (
                          <span className="rounded-full border border-[#FAAD14]/40 bg-[#FAAD14]/15 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-[#FAAD14]">
                            Active
                          </span>
                        ) : null}
                      </div>
                    </button>
                  );
                })}
              </div>

              <div className="mt-3 border-t border-white/10 pt-3 dark:border-gray-200">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-700 transition hover:border-white/15 hover:bg-white/10 hover:text-gray-900 dark:text-gray-200 dark:hover:text-white"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}

export default BackgroundStyleControl;
