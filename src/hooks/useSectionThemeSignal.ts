import { useMemo } from "react";

export type SectionAccent = "cyan" | "violet" | "sky";

export interface SectionThemeSignal {
  accent: SectionAccent;
  intensity: number; // 0..1
  speed: number; // animation multiplier
}

export function useSectionThemeSignal(
  activeSection: string,
): SectionThemeSignal {
  return useMemo(() => {
    switch (activeSection) {
      case "hero":
        return { accent: "cyan", intensity: 0.95, speed: 1.0 };

      case "about":
        return { accent: "sky", intensity: 0.55, speed: 0.7 };

      case "experience":
        return { accent: "cyan", intensity: 0.75, speed: 0.85 };

      case "skills":
        return { accent: "violet", intensity: 0.9, speed: 1.05 };

      case "projects":
        return { accent: "cyan", intensity: 1.0, speed: 1.1 };

      case "education":
        return { accent: "violet", intensity: 0.65, speed: 0.75 };

      case "contact":
        return { accent: "sky", intensity: 0.85, speed: 0.9 };

      default:
        return { accent: "cyan", intensity: 0.75, speed: 0.9 };
    }
  }, [activeSection]);
}

export default useSectionThemeSignal;
