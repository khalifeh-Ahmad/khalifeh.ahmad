import { useEffect, useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const visibleRef = useRef(false);

  const x = useSpring(-200, { stiffness: 90, damping: 18, mass: 0.5 });
  const y = useSpring(-200, { stiffness: 90, damping: 18, mass: 0.5 });
  const opacity = useSpring(0, { stiffness: 120, damping: 20 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX - 90);
      y.set(e.clientY - 90);

      if (!visibleRef.current) {
        visibleRef.current = true;
        opacity.set(1);
      }
    };

    const onLeave = () => opacity.set(0);

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseout", onLeave);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseout", onLeave);
    };
  }, [opacity, prefersReducedMotion, x, y]);

  if (prefersReducedMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[15] h-[220px] w-[220px] rounded-full blur-3xl"
      style={{
        x,
        y,
        opacity,
        background:
          "radial-gradient(circle, rgba(34,211,238,0.18) 0%, rgba(56,189,248,0.12) 35%, rgba(139,92,246,0.10) 60%, transparent 78%)",
      }}
    />
  );
}

export default CursorGlow;
