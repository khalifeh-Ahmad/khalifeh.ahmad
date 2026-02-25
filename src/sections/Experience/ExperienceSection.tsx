import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Reveal from "@/components/motion/Reveal";
import TiltCard from "@/components/motion/TiltCard";
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
    y: 14,
    scale: 0.985,
    filter: "blur(4px)",
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 0.34,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    scale: 0.99,
    filter: "blur(3px)",
    transition: {
      duration: 0.26,
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
        <Reveal>
          <SectionHeading
            eyebrow="Experience"
            title="Professional Experience"
            description="A timeline of roles where I contributed to frontend development, software systems, and product-focused technical solutions."
          />
        </Reveal>

        <Reveal delay={0.04}>
          <div className="relative">
            {/* Desktop timeline rail */}
            <div
              aria-hidden="true"
              className="absolute bottom-0 left-[14px] top-2 hidden w-px bg-gradient-to-b from-cyan-400/40 via-white/10 to-transparent md:block"
            />

            {/* subtle animated timeline glow */}
            <motion.div
              aria-hidden="true"
              className="absolute left-[14px] top-2 hidden w-px md:block"
              style={{
                height: "100%",
                background:
                  "linear-gradient(to bottom, rgba(34,211,238,0.65), rgba(255,255,255,0.12), transparent)",
                filter: "blur(0.3px)",
              }}
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />

            <motion.div
              id="experience-list"
              layout
              className="space-y-6 md:space-y-8"
            >
              <AnimatePresence mode="popLayout" initial={false}>
                {visibleItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    layout
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="relative md:grid md:grid-cols-[32px_1fr] md:gap-5"
                    style={{ willChange: "transform, opacity, filter" }}
                  >
                    {/* Timeline node (desktop) */}
                    <div className="relative hidden md:block">
                      <motion.div
                        className="absolute left-0 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur"
                        initial={{ scale: 0.92, opacity: 0.85 }}
                        animate={{
                          scale: [1, 1.05, 1],
                          opacity: [0.85, 1, 0.85],
                        }}
                        transition={{
                          duration: 2.2,
                          repeat: Infinity,
                          ease: "easeInOut",
                          delay: index * 0.12,
                        }}
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                      </motion.div>
                    </div>

                    {/* Card */}
                    <TiltCard>
                      <Card
                        variant="strong"
                        className="group relative overflow-hidden p-0"
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
                        />

                        {/* hover ambient glow */}
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.08),transparent_45%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.06),transparent_48%)]"
                        />

                        <div className="relative p-5 md:p-6">
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
                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition group-hover:bg-white/10">
                                  {formatExperienceRange(
                                    item.startDate,
                                    item.endDate,
                                  )}
                                </span>

                                {item.location && (
                                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition group-hover:bg-white/10">
                                    {item.location}
                                  </span>
                                )}

                                {item.employmentType && (
                                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 transition group-hover:bg-white/10">
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
                              {item.highlights.map((highlight, i) => (
                                <motion.li
                                  key={highlight}
                                  initial={{ opacity: 0, x: -6 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    duration: 0.22,
                                    delay: 0.04 + i * 0.03,
                                  }}
                                  className="flex items-start gap-3 text-sm text-gray-200"
                                >
                                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300" />
                                  <span className="leading-6">{highlight}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </div>

                          {item.techStack?.length ? (
                            <div className="mt-5 flex flex-wrap gap-2">
                              {item.techStack.map((tech, i) => (
                                <motion.div
                                  key={tech}
                                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  transition={{
                                    duration: 0.2,
                                    delay: 0.06 + i * 0.02,
                                  }}
                                >
                                  <Badge className="border-white/10 bg-white/5 text-gray-200 transition hover:border-white/20 hover:bg-white/10">
                                    {tech}
                                  </Badge>
                                </motion.div>
                              ))}
                            </div>
                          ) : null}
                        </div>
                      </Card>
                    </TiltCard>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </div>
        </Reveal>

        {/* Progressive disclosure action */}
        {hasMoreThanDefault && (
          <Reveal delay={0.06}>
            <div className="mt-8 flex justify-center">
              <motion.button
                type="button"
                onClick={handleToggle}
                whileTap={{ scale: 0.98 }}
                whileHover={
                  isRenderingMore ? undefined : { y: -1, scale: 1.01 }
                }
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
                <span
                  className={[
                    "inline-block h-2 w-2 rounded-full",
                    isRenderingMore
                      ? "bg-cyan-300 animate-pulse"
                      : "bg-white/30",
                  ].join(" ")}
                  aria-hidden="true"
                />
                {expanded
                  ? "Show Less"
                  : isRenderingMore
                    ? `Rendering ${remainingToRender}...`
                    : `Show ${hiddenCount} More Experience${hiddenCount > 1 ? "s" : ""}`}
              </motion.button>
            </div>
          </Reveal>
        )}
      </Container>
    </section>
  );
}

export default ExperienceSection;
