import type { PropsWithChildren } from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

interface ParallaxMouseProps extends PropsWithChildren {
  className?: string;
  strengthX?: number;
  strengthY?: number;
}

function ParallaxMouse({
  children,
  className,
  strengthX = 12,
  strengthY = 10,
}: ParallaxMouseProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });
  const y = useSpring(0, { stiffness: 120, damping: 18, mass: 0.4 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();

    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;

    x.set(nx * strengthX);
    y.set(ny * strengthY);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={prefersReducedMotion ? undefined : { x, y }}
      onMouseMove={onMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}

export default ParallaxMouse;
