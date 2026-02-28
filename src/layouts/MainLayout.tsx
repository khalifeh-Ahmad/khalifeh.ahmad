import type { PropsWithChildren } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "framer-motion";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import FloatingUtilityDock from "@/components/common/FloatingUtilityDock";
import GlobalWebGLBackground from "@/components/three/GlobalWebGLBackground";
import useActiveSection from "@/hooks/useActiveSection";
import useSectionThemeSignal from "@/hooks/useSectionThemeSignal";
import { NAV_ITEMS } from "@/lib/constants";
import CursorGlow from "@/components/common/CursorGlow";
import CustomCursor from "@/components/common/CustomCursor";
import { useBackground } from "@/components/background/BackgroundProvider";

function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 20,
    mass: 0.2,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="fixed left-0 right-0 top-0 z-[90] h-[2px] origin-left bg-gradient-to-r from-cyan-300 via-sky-400 to-violet-400"
    />
  );
}

function MainLayout({ children }: PropsWithChildren) {
  const { activeSection } = useActiveSection({
    selectors: NAV_ITEMS.map((item) => item.href),
    offset: 130,
    fallbackId: NAV_ITEMS[0]?.id ?? "hero",
  });

  const sectionSignal = useSectionThemeSignal(activeSection);
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
  const { variant } = useBackground(); // TEMP DEBUG (remove after confirming)
  // console.log("activeSection:", activeSection, "signal:", sectionSignal);

  return (
    <div className="relative min-h-screen overflow-x-clip text-gray-100">
      {/* Global WebGL background (section reactive) */}
      <GlobalWebGLBackground
        key={variant}
        signal={sectionSignal}
        variant={variant}
      />
      {/* <CursorGlow /> */}
      {/* Ambient background glows (preserved design) */}
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
      <CursorGlow />
      {/* <CustomCursor /> */}
      <ScrollProgressBar />
      <Header />

      <div className="relative z-10 pt-24 md:pt-28">{children}</div>

      <Footer />
      <FloatingUtilityDock />
    </div>
  );
}

export default MainLayout;
