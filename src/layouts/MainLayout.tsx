import type { PropsWithChildren } from "react";
import { motion, useReducedMotion } from "framer-motion";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import FloatingThemeSwitcher from "@/components/common/FloatingThemeSwitcher";
import GlobalWebGLBackground from "@/components/three/GlobalWebGLBackground";
import FloatingUtilityDock from "@/components/common/FloatingUtilityDock";

function MainLayout({ children }: PropsWithChildren) {
  const prefersReducedMotion = useReducedMotion();

  const slowFloat = prefersReducedMotion
    ? undefined
    : {
        x: [0, 18, -12, 0],
        y: [0, 10, -6, 0],
        scale: [1, 1.04, 0.98, 1],
      };

  const mediumFloat = prefersReducedMotion
    ? undefined
    : {
        x: [0, -14, 10, 0],
        y: [0, 12, -8, 0],
        scale: [1, 0.98, 1.03, 1],
      };

  const gentlePulse = prefersReducedMotion
    ? undefined
    : {
        x: [0, 8, -6, 0],
        y: [0, -10, 8, 0],
        scale: [1, 1.03, 0.99, 1],
      };

  return (
    <div className="relative min-h-screen overflow-x-clip text-gray-100">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <motion.div
          className="absolute left-1/2 top-[-120px] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl"
          animate={slowFloat}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute right-[10%] top-[30%] h-[240px] w-[240px] rounded-full bg-violet-500/10 blur-3xl"
          animate={mediumFloat}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.2,
          }}
        />

        <motion.div
          className="absolute left-[8%] top-[60%] h-[220px] w-[220px] rounded-full bg-sky-500/10 blur-3xl"
          animate={gentlePulse}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.7,
          }}
        />
      </div>
      <GlobalWebGLBackground />
      <Header />

      <div className="pt-24 md:pt-28">{children}</div>

      <Footer />
      <FloatingUtilityDock />
    </div>
  );
}

export default MainLayout;
