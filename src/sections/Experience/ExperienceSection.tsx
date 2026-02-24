import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { experienceData } from "@/data/experience";
import { formatExperienceRange } from "@/utils/formatDate";

function ExperienceSection() {
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

          <div className="space-y-6 md:space-y-8">
            {experienceData.map((item) => (
              <div
                key={item.id}
                className="relative md:grid md:grid-cols-[32px_1fr] md:gap-5"
              >
                {/* Timeline node (desktop) */}
                <div className="relative hidden md:block">
                  <div className="absolute left-0 top-5 flex h-7 w-7 items-center justify-center rounded-full border border-cyan-400/30 bg-cyan-400/10 backdrop-blur">
                    <span className="h-2.5 w-2.5 rounded-full bg-cyan-300 shadow-[0_0_14px_rgba(103,232,249,0.8)]" />
                  </div>
                </div>

                {/* Card */}
                <Card variant="strong" className="relative overflow-hidden p-0">
                  {/* card glow accent */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
                  />

                  <div className="p-5 md:p-6">
                    {/* Top row */}
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-semibold text-white md:text-xl">
                            {item.role}
                          </h3>

                          {/* Mobile node indicator */}
                          <span className="inline-flex md:hidden items-center rounded-full border border-cyan-400/25 bg-cyan-400/10 px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] text-cyan-200">
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

                    {/* Summary */}
                    {item.summary && (
                      <p className="mt-4 text-sm leading-6 text-gray-300 md:text-base">
                        {item.summary}
                      </p>
                    )}

                    {/* Highlights */}
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

                    {/* Tech stack tags */}
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
              </div>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

export default ExperienceSection;
