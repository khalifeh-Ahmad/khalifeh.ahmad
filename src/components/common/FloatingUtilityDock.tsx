import { motion } from "framer-motion";

import BackToTopButton from "@/components/common/BackToTopButton";
import FloatingThemeSwitcher from "@/components/common/FloatingThemeSwitcher";

function FloatingUtilityDock() {
  return (
    <div className="pointer-events-none fixed bottom-5 right-4 z-[80] sm:bottom-6 sm:right-6">
      <motion.div
        initial={{ opacity: 0, y: 14, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-auto flex flex-col items-end gap-3"
      >
        {/* Theme switcher panel */}
        <FloatingThemeSwitcher compact />

        {/* Back-to-top FAB (self-managed visibility) */}
        <BackToTopButton />
      </motion.div>
    </div>
  );
}

export default FloatingUtilityDock;
