import type { PropsWithChildren } from "react";
import { useRef } from "react";
import { motion, useReducedMotion, useSpring } from "framer-motion";

interface MagneticProps extends PropsWithChildren {
  className?: string;
  strength?: number; // px influence
  disabled?: boolean;
}

function Magnetic({
  children,
  className,
  strength = 18,
  disabled = false,
}: MagneticProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.3 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.3 });

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled || prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left;
    const relY = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const deltaX = relX - centerX;
    const deltaY = relY - centerY;

    const moveX = (deltaX / centerX) * strength;
    const moveY = (deltaY / centerY) * strength;

    x.set(moveX);
    y.set(moveY);
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      style={prefersReducedMotion || disabled ? undefined : { x, y }}
      onMouseMove={onMouseMove}
      onMouseLeave={reset}
      onBlur={reset}
    >
      {children}
    </motion.div>
  );
}

export default Magnetic;
