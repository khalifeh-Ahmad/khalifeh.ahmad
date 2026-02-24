import type { PropsWithChildren } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps extends PropsWithChildren {
  className?: string;
  intensity?: number;
}

function TiltCard({ children, className, intensity = 10 }: TiltCardProps) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useSpring(
    useTransform(mx, [-0.5, 0.5], [-intensity, intensity]),
    {
      stiffness: 180,
      damping: 18,
      mass: 0.5,
    },
  );

  const rotateX = useSpring(
    useTransform(my, [-0.5, 0.5], [intensity, -intensity]),
    {
      stiffness: 180,
      damping: 18,
      mass: 0.5,
    },
  );

  const glowX = useTransform(mx, [-0.5, 0.5], ["20%", "80%"]);
  const glowY = useTransform(my, [-0.5, 0.5], ["20%", "80%"]);

  return (
    <motion.div
      className={className}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        mx.set(x);
        my.set(y);
      }}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "radial-gradient(220px circle at var(--gx,50%) var(--gy,50%), rgba(34,211,238,0.12), transparent 55%)",
          ["--gx" as never]: glowX,
          ["--gy" as never]: glowY,
        }}
      />
      {children}
    </motion.div>
  );
}

export default TiltCard;
