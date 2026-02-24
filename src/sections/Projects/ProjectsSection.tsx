import { FiArrowUpRight, FiGithub } from "react-icons/fi";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { projectsData } from "@/data/projects";
import { cn } from "@/utils/cn";

function ProjectsSection() {
  const featuredProjects = projectsData.filter((project) => project.featured);
  const standardProjects = projectsData.filter((project) => !project.featured);

  return (
    <section id="projects" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Projects"
          title="Selected Projects"
          description="A curated selection of frontend, dashboard, and automation work. Each project is presented with context, technical approach, and outcome."
        />

        <div className="space-y-8">
          {/* Featured projects */}
          {featuredProjects.length > 0 && (
            <div className="space-y-6">
              <div className="flex items-center justify-between gap-3">
                <p className="eyebrow">Featured Work</p>
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                  {featuredProjects.length} project
                  {featuredProjects.length > 1 ? "s" : ""}
                </span>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {featuredProjects.map((project) => (
                  <Card
                    key={project.id}
                    variant="strong"
                    className="group relative overflow-hidden p-0"
                  >
                    {/* decorative top glow line */}
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"
                    />

                    {/* visual header placeholder */}
                    <div className="relative border-b border-white/10 p-5 md:p-6">
                      <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-[radial-gradient(circle_at_15%_20%,rgba(34,211,238,0.08),transparent_42%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.08),transparent_44%)] opacity-100"
                      />

                      <div className="relative flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="mb-3 flex flex-wrap items-center gap-2">
                            <Badge className="border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                              {project.category}
                            </Badge>

                            {project.status && (
                              <Badge className="border-white/10 bg-white/5 text-gray-200">
                                {project.status}
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-lg font-semibold text-white md:text-xl">
                            {project.title}
                          </h3>

                          {project.subtitle && (
                            <p className="mt-2 text-sm text-gray-300">
                              {project.subtitle}
                            </p>
                          )}
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300">
                          {project.period ?? "N/A"}
                        </div>
                      </div>
                    </div>

                    {/* body */}
                    <div className="p-5 md:p-6">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                            Role
                          </p>
                          <p className="mt-2 text-sm font-medium text-white">
                            {project.role}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm leading-6 text-gray-200">
                            {project.description}
                          </p>
                        </div>

                        <div className="grid gap-3 md:grid-cols-3">
                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                              Challenge
                            </p>
                            <p className="mt-2 text-sm leading-6 text-gray-200">
                              {project.challenge}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                              Solution
                            </p>
                            <p className="mt-2 text-sm leading-6 text-gray-200">
                              {project.solution}
                            </p>
                          </div>

                          <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                              Result
                            </p>
                            <p className="mt-2 text-sm leading-6 text-gray-200">
                              {project.result}
                            </p>
                          </div>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                            Tech Stack
                          </p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {project.techStack.map((tech) => (
                              <Badge
                                key={tech}
                                className="border-white/10 bg-white/5 text-gray-200"
                              >
                                {tech}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          {project.links.map((link) => {
                            const isGithub = link.label === "GitHub";

                            return (
                              <a
                                key={`${project.id}-${link.label}`}
                                href={link.href}
                                target={
                                  link.href.startsWith("http")
                                    ? "_blank"
                                    : undefined
                                }
                                rel={
                                  link.href.startsWith("http")
                                    ? "noreferrer noopener"
                                    : undefined
                                }
                                className={cn(
                                  "inline-flex items-center gap-2 rounded-xl border px-4 py-2 text-sm transition",
                                  isGithub
                                    ? "border-white/10 bg-white/5 text-gray-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
                                    : "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100",
                                )}
                              >
                                {isGithub ? (
                                  <FiGithub size={16} />
                                ) : (
                                  <FiArrowUpRight size={16} />
                                )}
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Standard projects */}
          {standardProjects.length > 0 && (
            <div className="space-y-5">
              <p className="eyebrow">More Projects</p>

              <div className="grid gap-6 lg:grid-cols-2">
                {standardProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="relative overflow-hidden p-0"
                  >
                    <div
                      aria-hidden="true"
                      className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
                    />

                    <div className="p-5 md:p-6">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <Badge className="border-white/10 bg-white/5 text-gray-200">
                              {project.category}
                            </Badge>
                            {project.status && (
                              <Badge className="border-white/10 bg-white/5 text-gray-300">
                                {project.status}
                              </Badge>
                            )}
                          </div>

                          <h3 className="text-base font-semibold text-white md:text-lg">
                            {project.title}
                          </h3>
                          {project.subtitle && (
                            <p className="mt-2 text-sm text-gray-300">
                              {project.subtitle}
                            </p>
                          )}
                        </div>

                        {project.period && (
                          <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                            {project.period}
                          </span>
                        )}
                      </div>

                      <p className="mt-4 text-sm leading-6 text-gray-200">
                        {project.description}
                      </p>

                      <div className="mt-4 grid gap-3">
                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                            Role
                          </p>
                          <p className="mt-1 text-sm text-white">
                            {project.role}
                          </p>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                          <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                            Outcome
                          </p>
                          <p className="mt-1 text-sm leading-6 text-gray-200">
                            {project.result}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.techStack.map((tech) => (
                          <Badge
                            key={tech}
                            className="border-white/10 bg-white/5 text-gray-200"
                          >
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      <div className="mt-5 flex flex-wrap gap-2">
                        {project.links.map((link) => {
                          const isGithub = link.label === "GitHub";

                          return (
                            <a
                              key={`${project.id}-${link.label}`}
                              href={link.href}
                              target={
                                link.href.startsWith("http")
                                  ? "_blank"
                                  : undefined
                              }
                              rel={
                                link.href.startsWith("http")
                                  ? "noreferrer noopener"
                                  : undefined
                              }
                              className={cn(
                                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm transition",
                                isGithub
                                  ? "border-white/10 bg-white/5 text-gray-200 hover:border-white/20 hover:bg-white/10 hover:text-white"
                                  : "border-cyan-400/25 bg-cyan-400/10 text-cyan-200 hover:border-cyan-300/35 hover:bg-cyan-300/10 hover:text-cyan-100",
                              )}
                            >
                              {isGithub ? (
                                <FiGithub size={15} />
                              ) : (
                                <FiArrowUpRight size={15} />
                              )}
                              {link.label}
                            </a>
                          );
                        })}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}

export default ProjectsSection;
