import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { FiArrowUp } from "react-icons/fi";

function BackToTopButton() {
  const prefersReducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || window.pageYOffset;
      setVisible(y > 360);

      const doc = document.documentElement;
      const scrollable = Math.max(doc.scrollHeight - window.innerHeight, 1);
      const progress = Math.min(Math.max(y / scrollable, 0), 1);
      setScrollProgress(progress);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  };

  const ring = useMemo(() => {
    const size = 46;
    const stroke = 3;
    const radius = (size - stroke) / 2;
    const circumference = 2 * Math.PI * radius;
    const dashOffset = circumference * (1 - scrollProgress);

    return { size, stroke, radius, circumference, dashOffset };
  }, [scrollProgress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          onClick={handleBackToTop}
          aria-label="Back to top"
          title="Back to top"
          initial={{ opacity: 0, y: 12, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          whileHover={prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }}
          whileTap={prefersReducedMotion ? undefined : { scale: 0.97 }}
          className="group relative inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-200 shadow-[0_10px_30px_rgba(0,0,0,0.28)] backdrop-blur-xl transition hover:border-white/15 hover:bg-white/10 hover:text-white"
        >
          {/* subtle glow */}
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.14),transparent_50%)] opacity-80"
          />

          {/* progress ring */}
          <svg
            aria-hidden="true"
            width={ring.size}
            height={ring.size}
            viewBox={`0 0 ${ring.size} ${ring.size}`}
            className="pointer-events-none absolute inset-0"
          >
            <circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.radius}
              fill="none"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth={ring.stroke}
            />
            <circle
              cx={ring.size / 2}
              cy={ring.size / 2}
              r={ring.radius}
              fill="none"
              stroke="rgba(34,211,238,0.9)"
              strokeWidth={ring.stroke}
              strokeLinecap="round"
              strokeDasharray={ring.circumference}
              strokeDashoffset={ring.dashOffset}
              transform={`rotate(-90 ${ring.size / 2} ${ring.size / 2})`}
              className="transition-[stroke-dashoffset] duration-150"
            />
          </svg>

          <FiArrowUp
            size={18}
            className="relative z-10 transition group-hover:-translate-y-0.5"
          />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

export default BackToTopButton;
