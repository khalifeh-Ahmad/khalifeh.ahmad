import { useMemo, useState } from "react";
import { AnimatePresence, LayoutGroup, motion } from "framer-motion";
import {
  FiArrowUpRight,
  FiChevronDown,
  FiChevronUp,
  FiGithub,
} from "react-icons/fi";

import Reveal from "@/components/motion/Reveal";
import { StaggerContainer, StaggerItem } from "@/components/motion/Stagger";
import TiltCard from "@/components/motion/TiltCard";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { projectsData } from "@/data/projects";
import type { ProjectItem, ProjectLink } from "@/types/project";

type CategoryFilter = "All" | ProjectItem["category"];

function getProjectLinkIcon(label: ProjectLink["label"]) {
  if (label === "GitHub") return <FiGithub size={15} />;
  return <FiArrowUpRight size={15} />;
}

function ProjectCard({ project }: { project: ProjectItem }) {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <TiltCard>
      <Card className="group relative h-full overflow-hidden p-0">
        {/* Top highlight line */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
        />

        {/* Hover ambient glow */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_15%_10%,rgba(34,211,238,0.08),transparent_42%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.08),transparent_46%)]"
        />

        {/* Media / visual header */}
        <div className="relative overflow-hidden border-b border-white/10 bg-white/5">
          {project.image ? (
            <img
              src={project.image}
              alt={project.title}
              className="h-44 w-full object-cover transition duration-700 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="relative h-44 w-full overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(34,211,238,0.12),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(139,92,246,0.12),transparent_46%),linear-gradient(to_bottom,rgba(255,255,255,0.02),rgba(255,255,255,0.00))]" />
              <div className="absolute inset-0 opacity-50 [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:22px_22px]" />
              <div className="relative flex h-full items-center justify-center">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-300 backdrop-blur">
                  {project.category} Project
                </div>
              </div>
            </div>
          )}

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#070b14]/70 via-transparent to-transparent opacity-80" />

          <div className="absolute left-3 top-3 flex flex-wrap gap-2">
            {project.featured && (
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-cyan-200 backdrop-blur">
                Featured
              </span>
            )}

            {project.status && (
              <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-gray-200 backdrop-blur">
                {project.status}
              </span>
            )}
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="rounded-full border border-white/10 bg-black/30 px-2.5 py-1 text-[10px] uppercase tracking-[0.16em] text-gray-200 backdrop-blur">
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="relative flex h-[calc(100%-11rem)] flex-col p-5 md:p-6">
          {/* Header */}
          <div>
            <h3 className="text-base font-semibold text-white md:text-lg">
              {project.title}
            </h3>

            {project.subtitle && (
              <p className="mt-1 text-xs uppercase tracking-[0.14em] text-cyan-200">
                {project.subtitle}
              </p>
            )}
          </div>

          {/* Role / period */}
          <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-300">
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {project.role}
            </span>
            {project.period && (
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                {project.period}
              </span>
            )}
          </div>

          {/* Description only (compact) */}
          <p className="mt-4 text-sm leading-6 text-gray-300">
            {project.description}
          </p>

          {/* Tech stack */}
          {project.techStack.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {project.techStack.slice(0, 6).map((tech, i) => (
                <motion.div
                  key={`${project.id}-${tech}`}
                  initial={{ opacity: 0, y: 4, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: 0.2,
                    delay: 0.03 + i * 0.02,
                  }}
                >
                  <Badge className="border-white/10 bg-white/5 text-gray-200 transition hover:border-white/20 hover:bg-white/10">
                    {tech}
                  </Badge>
                </motion.div>
              ))}
              {project.techStack.length > 6 && (
                <Badge className="border-white/10 bg-white/5 text-gray-300">
                  +{project.techStack.length - 6} more
                </Badge>
              )}
            </div>
          )}

          {/* Expandable case-study details */}
          <div className="mt-4">
            <motion.button
              type="button"
              onClick={() => setDetailsOpen((prev) => !prev)}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              aria-expanded={detailsOpen}
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
            >
              {detailsOpen ? "Hide Details" : "View Details"}
              {detailsOpen ? (
                <FiChevronUp size={15} />
              ) : (
                <FiChevronDown size={15} />
              )}
            </motion.button>

            <AnimatePresence initial={false}>
              {detailsOpen && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, height: 0, y: 4 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -2 }}
                  transition={{ duration: 0.24, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 grid gap-3">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                        Challenge
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-200">
                        {project.challenge}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                        Solution
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-200">
                        {project.solution}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                      <p className="text-[10px] uppercase tracking-[0.16em] text-gray-400">
                        Result
                      </p>
                      <p className="mt-1 text-sm leading-6 text-gray-200">
                        {project.result}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer links */}
          <div className="mt-auto pt-5">
            <div className="flex flex-wrap gap-2">
              {project.links.map((link) => {
                const isPrimary = link.label === "Live Demo";

                return (
                  <motion.a
                    key={`${project.id}-${link.label}`}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    href={link.href}
                    target={link.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      link.href.startsWith("http")
                        ? "noreferrer noopener"
                        : undefined
                    }
                    className={[
                      "group/link inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                      isPrimary
                        ? "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/35 hover:bg-cyan-400/15 hover:text-cyan-100"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/15 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                  >
                    {link.label}
                    <span className="transition group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5">
                      {getProjectLinkIcon(link.label)}
                    </span>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </TiltCard>
  );
}

function ProjectsSection() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  const categories = useMemo<CategoryFilter[]>(() => {
    const unique = Array.from(new Set(projectsData.map((p) => p.category)));
    return ["All", ...unique];
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeCategory === "All") return projectsData;
    return projectsData.filter(
      (project) => project.category === activeCategory,
    );
  }, [activeCategory]);

  return (
    <section id="projects" className="section anchor-offset">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Projects"
            title="Selected Projects"
            description="A curated selection of work focused on modern frontend engineering, maintainable architecture, automation, and professional user experiences."
          />
        </Reveal>

        {/* Filter Tabs */}
        <Reveal delay={0.04}>
          <LayoutGroup>
            <div className="mb-6 flex flex-wrap items-center gap-2">
              {categories.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={[
                      "relative inline-flex items-center rounded-xl border px-3 py-2 text-sm transition",
                      isActive
                        ? "border-cyan-400/25 text-cyan-100"
                        : "border-white/10 bg-white/5 text-gray-300 hover:border-white/15 hover:bg-white/10 hover:text-white",
                    ].join(" ")}
                    aria-pressed={isActive}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="project-filter-pill"
                        className="absolute inset-0 -z-10 rounded-xl border border-cyan-400/20 bg-cyan-400/10"
                        transition={{
                          type: "spring",
                          stiffness: 320,
                          damping: 28,
                        }}
                      />
                    )}
                    {category}
                  </button>
                );
              })}
            </div>
          </LayoutGroup>
        </Reveal>

        {/* Projects Grid */}
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 8, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -6, filter: "blur(3px)" }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            {filteredProjects.length > 0 ? (
              <StaggerContainer
                className="grid gap-6 md:grid-cols-2"
                stagger={0.07}
                delayChildren={0.02}
              >
                {filteredProjects.map((project) => (
                  <StaggerItem key={project.id}>
                    <ProjectCard project={project} />
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-white/10 bg-white/5 p-8 text-center"
              >
                <p className="text-sm text-gray-300">
                  No projects found for this category.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </section>
  );
}

export default ProjectsSection;
