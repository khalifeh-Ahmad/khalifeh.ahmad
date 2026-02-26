import { motion, useReducedMotion } from "framer-motion";

type LoadingScreenProps = {
  title?: string;
  subtitle?: string;
  progress?: number; // 0..100
};

function LoadingScreen({
  title = "khalifeh.dev",
  subtitle = "Preparing the experience…",
  progress = 0,
}: LoadingScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const pct = Math.max(0, Math.min(100, Math.round(progress)));

  return (
    <motion.div
      className="fixed inset-0 z-[200] grid place-items-center bg-[#070b14]"
      initial={{ opacity: 1 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        duration: prefersReducedMotion ? 0.01 : 0.42,
        ease: "easeOut",
      }}
      role="status"
      aria-label="Loading"
    >
      {/* Ambient background */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <motion.div
          className="absolute left-1/2 top-[-180px] h-[620px] w-[620px] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, 16, 0], opacity: [0.75, 0.95, 0.75] }
          }
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute right-[8%] top-[26%] h-[420px] w-[420px] rounded-full bg-violet-500/10 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, -14, 0], opacity: [0.6, 0.9, 0.6] }
          }
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.6,
          }}
        />
        <motion.div
          className="absolute left-[6%] top-[64%] h-[360px] w-[360px] rounded-full bg-sky-500/10 blur-3xl"
          animate={
            prefersReducedMotion
              ? undefined
              : { y: [0, 12, 0], opacity: [0.55, 0.85, 0.55] }
          }
          transition={{
            duration: 9.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.3,
          }}
        />
      </div>

      <div className="relative flex w-full max-w-lg flex-col items-center px-6 text-center">
        {/* BIG animated logo mark */}
        <motion.div
          className="relative grid h-20 w-20 place-items-center overflow-hidden rounded-3xl border border-white/15 bg-white/5 shadow-[0_22px_70px_rgba(0,0,0,0.45)] backdrop-blur"
          initial={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 0, scale: 0.94, y: 6 }
          }
          animate={
            prefersReducedMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, y: 0 }
          }
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.55,
            ease: "easeOut",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/16 via-sky-400/10 to-violet-400/16" />
          <div className="absolute inset-[1px] rounded-[1.45rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.18),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.12),transparent_55%)]" />

          {!prefersReducedMotion && (
            <motion.div
              aria-hidden="true"
              className="absolute -left-1/2 top-0 h-full w-[200%] rotate-12 bg-gradient-to-r from-transparent via-white/14 to-transparent"
              animate={{ x: ["-60%", "10%"] }}
              transition={{
                duration: 1.25,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}

          <span className="relative text-base font-semibold tracking-tight text-white">
            KhA
          </span>

          {/* tiny pulse dot */}
          {!prefersReducedMotion && (
            <motion.span
              aria-hidden="true"
              className="absolute bottom-3 right-3 h-2 w-2 rounded-full bg-cyan-300/90 shadow-[0_0_18px_rgba(103,232,249,0.8)]"
              animate={{ opacity: [0.55, 1, 0.55], scale: [1, 1.15, 1] }}
              transition={{
                duration: 1.4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          )}
        </motion.div>

        {/* BIG name / title */}
        <motion.h1
          className="mt-6 text-3xl font-semibold tracking-tight text-white md:text-4xl"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
          }
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.5,
            ease: "easeOut",
            delay: 0.05,
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          className="mt-2 text-sm text-gray-300 md:text-base"
          initial={
            prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 10 }
          }
          animate={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          transition={{
            duration: prefersReducedMotion ? 0.01 : 0.5,
            ease: "easeOut",
            delay: 0.08,
          }}
        >
          {subtitle}
        </motion.p>

        {/* Progress bar + percentage */}
        <div className="mt-7 w-full">
          <div className="flex items-center justify-between text-xs text-gray-300">
            <span className="uppercase tracking-[0.16em] text-gray-400">
              Loading
            </span>
            <span className="font-medium text-gray-200">{pct}%</span>
          </div>

          <div className="mt-3 h-2 w-full overflow-hidden rounded-full border border-white/10 bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
              initial={{ width: "0%" }}
              animate={{ width: `${pct}%` }}
              transition={{
                duration: prefersReducedMotion ? 0.01 : 0.18,
                ease: "easeOut",
              }}
            />
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.18em] text-gray-400">
            React • TypeScript • Three.js • WebGL
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export default LoadingScreen;
