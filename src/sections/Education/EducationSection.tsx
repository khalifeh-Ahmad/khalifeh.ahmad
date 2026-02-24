import { FiAward, FiBookOpen, FiExternalLink } from "react-icons/fi";
import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { certificationsData, educationData } from "@/data/education";

function EducationSection() {
  return (
    <section id="education" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Education"
          title="Education & Certifications"
          description="Academic background and continuous learning that support my frontend engineering, software development, and problem-solving approach."
        />

        <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
          {/* Education column */}
          <Card variant="strong" className="p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-200">
                  <FiBookOpen size={18} />
                </span>
                <div>
                  <p className="eyebrow">Academic Background</p>
                  <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
                    Education
                  </h3>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                {educationData.length} item{educationData.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-5 space-y-4">
              {educationData.map((item) => (
                <div
                  key={item.id}
                  className="relative rounded-2xl border border-white/10 bg-white/5 p-4 md:p-5"
                >
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
                  />

                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <h4 className="text-base font-semibold text-white md:text-lg">
                        {item.degree}
                        {item.field ? ` — ${item.field}` : ""}
                      </h4>
                      <p className="mt-1 text-sm font-medium text-cyan-200">
                        {item.institution}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(item.startYear || item.endYear) && (
                        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                          {item.startYear ? `${item.startYear} — ` : ""}
                          {item.endYear ?? "Present"}
                        </span>
                      )}
                      {item.location && (
                        <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                          {item.location}
                        </span>
                      )}
                    </div>
                  </div>

                  {item.description && (
                    <p className="mt-3 text-sm leading-6 text-gray-300">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>

          {/* Certifications column */}
          <Card className="p-5 md:p-6">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-400/10 text-violet-200">
                  <FiAward size={18} />
                </span>
                <div>
                  <p className="eyebrow">Continuous Learning</p>
                  <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
                    Certifications
                  </h3>
                </div>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                {certificationsData.length} cert
                {certificationsData.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="mt-5 grid gap-3">
              {certificationsData.map((cert) => {
                const content = (
                  <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15 hover:bg-white/10">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h4 className="text-sm font-medium leading-6 text-white md:text-base">
                          {cert.title}
                        </h4>
                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <Badge className="border-white/10 bg-white/5 text-gray-200">
                            {cert.issuer}
                          </Badge>
                          {cert.year && (
                            <Badge className="border-white/10 bg-white/5 text-gray-300">
                              {cert.year}
                            </Badge>
                          )}
                        </div>
                      </div>

                      {cert.credentialUrl && (
                        <FiExternalLink
                          className="mt-1 shrink-0 text-gray-400 transition group-hover:text-white"
                          size={16}
                        />
                      )}
                    </div>
                  </div>
                );

                if (cert.credentialUrl) {
                  return (
                    <a
                      key={cert.id}
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      {content}
                    </a>
                  );
                }

                return <div key={cert.id}>{content}</div>;
              })}
            </div>

            <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                Learning Focus
              </p>
              <p className="mt-2 text-sm leading-6 text-gray-200">
                Frontend frameworks, JavaScript fundamentals, testing/debugging,
                and SQL/database development.
              </p>
            </div>
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default EducationSection;
