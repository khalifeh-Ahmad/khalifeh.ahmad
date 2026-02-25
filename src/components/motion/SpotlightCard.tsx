import type { PropsWithChildren } from "react";
import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/utils/cn";

interface SpotlightCardProps extends PropsWithChildren {
  className?: string;
  glowClassName?: string;
}

function SpotlightCard({
  children,
  className,
  glowClassName,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const [hovered, setHovered] = useState(false);
  const [pos, setPos] = useState({ x: 50, y: 50, rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * 100;
    const py = ((e.clientY - rect.top) / rect.height) * 100;

    const dx = (e.clientX - (rect.left + rect.width / 2)) / rect.width;
    const dy = (e.clientY - (rect.top + rect.height / 2)) / rect.height;

    setPos({
      x: px,
      y: py,
      rx: dy * -5,
      ry: dx * 7,
    });
  };

  const onLeave = () => {
    setHovered(false);
    setPos((p) => ({ ...p, rx: 0, ry: 0 }));
  };

  return (
    <motion.div
      ref={ref}
      className={cn("relative [perspective:1000px]", className)}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={onLeave}
      onFocus={() => setHovered(true)}
      onBlur={onLeave}
      animate={
        prefersReducedMotion
          ? undefined
          : {
              rotateX: pos.rx,
              rotateY: pos.ry,
              y: hovered ? -2 : 0,
            }
      }
      transition={{ type: "spring", stiffness: 180, damping: 16, mass: 0.5 }}
      style={{ transformStyle: "preserve-3d" }}
    >
      {/* cursor spotlight */}
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300",
          hovered ? "opacity-100" : "opacity-0",
          glowClassName ??
            "bg-[radial-gradient(220px_circle_at_var(--mx)_var(--my),rgba(34,211,238,0.16),transparent_55%)]",
        )}
        style={
          {
            "--mx": `${pos.x}%`,
            "--my": `${pos.y}%`,
          } as React.CSSProperties
        }
      />

      {/* edge sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300"
        style={{
          opacity: hovered ? 1 : 0,
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.05), transparent 35%, rgba(255,255,255,0.04) 60%, transparent 80%)",
        }}
      />

      <div style={{ transform: "translateZ(0)" }}>{children}</div>
    </motion.div>
  );
}

export default SpotlightCard;
