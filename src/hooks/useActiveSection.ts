import { useEffect, useMemo, useState } from "react";

interface UseActiveSectionOptions {
  /**
   * CSS selectors for tracked sections.
   * Example: ["#hero", "#about", "#skills"]
   */
  selectors?: string[];
  /**
   * Header offset in px so active section changes correctly under sticky header.
   */
  offset?: number;
  /**
   * Fallback id when nothing matches.
   */
  fallbackId?: string;
}

function getSectionTop(section: HTMLElement) {
  const rect = section.getBoundingClientRect();
  return rect.top + window.scrollY;
}

export function useActiveSection({
  selectors = [
    "#hero",
    "#about",
    "#experience",
    "#skills",
    "#projects",
    "#education",
    "#contact",
  ],
  offset = 120,
  fallbackId = "hero",
}: UseActiveSectionOptions = {}) {
  const [activeSection, setActiveSection] = useState<string>(fallbackId);

  const sectionIds = useMemo(
    () => selectors.map((s) => s.replace(/^#/, "")),
    [selectors],
  );

  useEffect(() => {
    const sections = selectors
      .map((selector) => document.querySelector<HTMLElement>(selector))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!sections.length) return;

    let ticking = false;

    const updateActiveSection = () => {
      const scrollPosition = window.scrollY + offset;

      // If near bottom, force last visible section (prevents weird top section staying active)
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 4;

      if (nearBottom) {
        const lastId = sections[sections.length - 1]?.id ?? fallbackId;
        setActiveSection(lastId);
        return;
      }

      let current = fallbackId;

      for (const section of sections) {
        const top = getSectionTop(section);
        if (scrollPosition >= top) {
          current = section.id;
        } else {
          break;
        }
      }

      setActiveSection(current);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        updateActiveSection();
        ticking = false;
      });
    };

    const onResize = () => updateActiveSection();

    updateActiveSection();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [selectors, offset, fallbackId]);

  return {
    activeSection,
    sectionIds,
  };
}

export default useActiveSection;
