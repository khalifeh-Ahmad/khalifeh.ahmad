import Reveal from "@/components/motion/Reveal";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { aboutHighlights, aboutIntro, aboutPillars } from "@/data/about";
import { profileData } from "@/data/profile";

function AboutSection() {
  return (
    <section id="about" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="About"
          title="Professional Profile"
          description="A concise overview of my background, technical focus, and how I approach building modern web applications."
        />
        <Reveal>
          <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {/* Left: narrative */}
            <Card variant="strong" className="p-6 md:p-8">
              <div className="space-y-5">
                <div>
                  <p className="eyebrow">Who I Am</p>
                  <h3 className="mt-3 text-xl font-semibold leading-tight text-white md:text-2xl">
                    {aboutIntro.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {aboutIntro.paragraphs.map((paragraph) => (
                    <p key={paragraph} className="body-md leading-7">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  {aboutHighlights.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4"
                    >
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                        {item.label}
                      </p>
                      <p className="mt-2 text-sm font-medium text-white md:text-base">
                        {item.value}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </Card>

            {/* Right: focus areas + quick profile card */}
            <div className="grid gap-6">
              <Card className="p-5 md:p-6">
                <p className="eyebrow">Focus Areas</p>

                <div className="mt-4 space-y-4">
                  {aboutPillars.map((pillar) => (
                    <div
                      key={pillar.title}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <h4 className="text-sm font-semibold text-white md:text-base">
                        {pillar.title}
                      </h4>
                      <p className="mt-2 text-sm leading-6 text-gray-300">
                        {pillar.description}
                      </p>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 md:p-6">
                <p className="eyebrow">Quick Snapshot</p>

                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-gray-400">Role</span>
                    <span className="text-right font-medium text-white">
                      {profileData.role}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-gray-400">Location</span>
                    <span className="text-right font-medium text-white">
                      {profileData.location ?? "Available remotely"}
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-gray-400">Collaboration</span>
                    <span className="text-right font-medium text-white">
                      Agile / Cross-functional teams
                    </span>
                  </div>

                  <div className="flex items-start justify-between gap-4 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
                    <span className="text-gray-400">Strength</span>
                    <span className="text-right font-medium text-white">
                      Clean, maintainable UI architecture
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

export default AboutSection;
