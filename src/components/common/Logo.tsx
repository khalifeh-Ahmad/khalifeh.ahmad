import { useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

function Logo() {
  const prefersReducedMotion = useReducedMotion();
  const ref = useRef<HTMLAnchorElement | null>(null);

  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const onMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const cx = rect.width / 2;
    const cy = rect.height / 2;

    const dx = (x - cx) / cx; // -1..1
    const dy = (y - cy) / cy; // -1..1

    // Small angles = premium (avoid gimmick)
    setTilt({
      rx: dy * -6,
      ry: dx * 9,
    });
  };

  const onLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <a
      ref={ref}
      href="#hero"
      aria-label="Go to homepage section"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onBlur={onLeave}
      className="group inline-flex items-center gap-2"
      style={{ perspective: "900px" }}
    >
      {/* Mark (tilting element) */}
      <motion.span
        className="relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl border border-white/15 bg-white/5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(0,0,0,0.25)] backdrop-blur"
        animate={
          prefersReducedMotion
            ? undefined
            : {
                rotateX: tilt.rx,
                rotateY: tilt.ry,
                y: tilt.rx !== 0 || tilt.ry !== 0 ? -1 : 0,
              }
        }
        transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
        style={{ transformStyle: "preserve-3d", willChange: "transform" }}
        whileTap={prefersReducedMotion ? undefined : { scale: 0.98 }}
      >
        {/* base gradient */}
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-cyan-400/14 via-sky-400/10 to-violet-400/14 opacity-90"
        />

        {/* animated sheen */}
        <span
          aria-hidden="true"
          className="absolute -left-1/2 top-0 h-full w-[200%] translate-x-[-60%] rotate-12 bg-gradient-to-r from-transparent via-white/12 to-transparent opacity-0 transition duration-700 group-hover:translate-x-[10%] group-hover:opacity-100"
        />

        {/* inner frame */}
        <span
          aria-hidden="true"
          className="absolute inset-[1px] rounded-[0.7rem] border border-white/10 bg-[radial-gradient(circle_at_30%_20%,rgba(34,211,238,0.14),transparent_55%),radial-gradient(circle_at_80%_30%,rgba(139,92,246,0.10),transparent_55%)]"
        />

        {/* Monogram (slight depth) */}
        <span
          className="relative flex items-baseline gap-[1px] font-semibold tracking-tight"
          style={{ transform: "translateZ(10px)" }}
        >
          <span className="text-[12px] text-cyan-200">Kh</span>
          <span className="text-[13px] text-white">A</span>
        </span>

        {/* subtle pulse dot */}
        <span
          aria-hidden="true"
          className="absolute bottom-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-cyan-300/90 shadow-[0_0_14px_rgba(103,232,249,0.8)] opacity-80"
          style={{ transform: "translateZ(14px)" }}
        />
      </motion.span>

      {/* Wordmark */}
      <span className="hidden lg:block">
        <span className="block text-sm font-semibold text-gray-200 transition group-hover:text-white">
          khalifeh
          <span className="text-gray-500 transition group-hover:text-gray-300">
            .dev
          </span>
        </span>

        {/* underline accent */}
        <span
          aria-hidden="true"
          className="mt-1 block h-px w-0 bg-gradient-to-r from-cyan-300/70 via-sky-300/60 to-violet-300/60 transition-all duration-500 group-hover:w-full"
        />
      </span>
    </a>
  );
}

export default Logo;
