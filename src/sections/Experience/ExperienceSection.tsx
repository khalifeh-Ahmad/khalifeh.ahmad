import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { experienceData } from "@/data/experience";
import { formatExperienceRange } from "@/utils/formatDate";

const DEFAULT_VISIBLE_COUNT = 2;
const RENDER_INTERVAL_MS = 180; // controls "real-time rendering" feel

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    scale: 0.985,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -6,
    scale: 0.99,
    filter: "blur(3px)",
    transition: {
      duration: 0.28,
      ease: "easeIn",
    },
  },
};

function ExperienceSection() {
  const [expanded, setExpanded] = useState(false);
  const [renderCount, setRenderCount] = useState(
    Math.min(DEFAULT_VISIBLE_COUNT, experienceData.length),
  );
  const [isRenderingMore, setIsRenderingMore] = useState(false);

  const intervalRef = useRef<number | null>(null);

  const totalCount = experienceData.length;
  const hasMoreThanDefault = totalCount > DEFAULT_VISIBLE_COUNT;

  useEffect(() => {
    // cleanup interval on unmount
    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // if expanding -> progressively render items
    if (expanded) {
      if (renderCount >= totalCount) {
        setIsRenderingMore(false);
        return;
      }

      setIsRenderingMore(true);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      intervalRef.current = window.setInterval(() => {
        setRenderCount((prev) => {
          const next = prev + 1;

          if (next >= totalCount) {
            if (intervalRef.current) {
              window.clearInterval(intervalRef.current);
              intervalRef.current = null;
            }
            setIsRenderingMore(false);
            return totalCount;
          }

          return next;
        });
      }, RENDER_INTERVAL_MS);

      return;
    }

    // if collapsing -> stop progressive rendering and reduce list
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRenderingMore(false);
    setRenderCount(Math.min(DEFAULT_VISIBLE_COUNT, totalCount));
  }, [expanded, renderCount, totalCount]);

  const visibleItems = useMemo(() => {
    return experienceData.slice(0, renderCount);
  }, [renderCount]);

  const hiddenCount = Math.max(totalCount - DEFAULT_VISIBLE_COUNT, 0);
  const remainingToRender = Math.max(totalCount - renderCount, 0);

  const handleToggle = () => {
    setExpanded((prev) => !prev);
  };

  return (
    <section id="experience" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Experience"
          title="Professional Experience"
          description="A timeline of roles where I contributed to frontend development, software systems, and product-focused technical solutions."
        />

        <div className="relative">
          {/* Desktop timeline rail */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 left-[14px] top-2 hidden w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent md:block"
          />

          <motion.div
            id="experience-list"
            layout
            className="space-y-6 md:space-y-8"
          >
            <AnimatePresence mode="popLayout" initial={false}>
              {visibleItems.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative md:grid md:grid-cols-[32px_1fr] md:gap-5"
                >
                  {/* Timeline node (desktop) */}
                  <div className="relative hidden md:block">
                    <div className="absolute left-0 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur">
                      <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                    </div>
                  </div>

                  {/* Card */}
                  <Card
                    variant="strong"
                    className="relative overflow-hidden p-0"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
                    />

                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-lg font-semibold text-white md:text-xl">
                              {item.role}
                            </h3>

                            <span className="inline-flex items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-cyan-200 md:hidden">
                              Timeline
                            </span>
                          </div>

                          <p className="mt-1 text-sm font-medium text-cyan-200">
                            {item.company}
                          </p>

                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-300">
                            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                              {formatExperienceRange(
                                item.startDate,
                                item.endDate,
                              )}
                            </span>

                            {item.location && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                {item.location}
                              </span>
                            )}

                            {item.employmentType && (
                              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                                {item.employmentType}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {item.summary && (
                        <p className="mt-4 text-sm leading-6 text-gray-300 md:text-base">
                          {item.summary}
                        </p>
                      )}

                      <div className="mt-5">
                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">
                          Key Responsibilities / Contributions
                        </p>

                        <ul className="mt-3 space-y-2">
                          {item.highlights.map((highlight) => (
                            <li
                              key={highlight}
                              className="flex items-start gap-3 text-sm text-gray-200"
                            >
                              <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                              <span className="leading-6">{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {item.techStack?.length ? (
                        <div className="mt-5 flex flex-wrap gap-2">
                          {item.techStack.map((tech) => (
                            <Badge
                              key={tech}
                              className="border-white/10 bg-white/5 text-gray-200"
                            >
                              {tech}
                            </Badge>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* Progressive disclosure action */}
        {hasMoreThanDefault && (
          <div className="mt-8 flex justify-center">
            <motion.button
              type="button"
              onClick={handleToggle}
              whileTap={{ scale: 0.98 }}
              disabled={isRenderingMore}
              className={[
                "inline-flex items-center gap-2 rounded-2xl border px-5 py-3 text-sm font-medium transition",
                isRenderingMore
                  ? "cursor-not-allowed border-white/10 bg-white/5 text-gray-400"
                  : "border-white/15 bg-white/5 text-gray-200 hover:border-white/25 hover:bg-white/10 hover:text-white",
              ].join(" ")}
              aria-expanded={expanded}
              aria-controls="experience-list"
            >
              {expanded
                ? "Show Less"
                : isRenderingMore
                  ? `Rendering ${remainingToRender}...`
                  : `Show ${hiddenCount} More Experience${hiddenCount > 1 ? "s" : ""}`}
            </motion.button>
          </div>
        )}
      </Container>
    </section>
  );
}

export default ExperienceSection;
