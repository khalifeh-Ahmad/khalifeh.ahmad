import {
  FiArrowUpRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import Badge from "@/components/ui/Badge";
import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { contactLinks, contactMethods } from "@/data/contact";
import { profileData } from "@/data/profile";
import { cn } from "@/utils/cn";
import Reveal from "@/components/motion/Reveal";

function ContactSection() {
  return (
    <section id="contact" className="section anchor-offset">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let’s Build Something Great"
            description="I’m open to frontend engineering roles, freelance projects, and collaborations focused on modern web applications and user experience."
            align="center"
          />
        </Reveal>
        <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          {/* Left: Main CTA panel */}
          <Reveal delay={0.06}>
            <Card variant="strong" className="relative overflow-hidden p-0">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.10),transparent_38%),radial-gradient(circle_at_85%_20%,rgba(139,92,246,0.10),transparent_42%)]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/50 to-transparent"
              />

              <div className="relative p-6 md:p-8">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge>Open to Opportunities</Badge>
                  <Badge className="border-white/10 bg-white/5 text-gray-200">
                    Frontend • React • TypeScript
                  </Badge>
                </div>

                <h3 className="mt-5 text-2xl font-semibold leading-tight text-white md:text-3xl">
                  Have a role, product, or idea in mind?
                </h3>

                <p className="mt-4 text-sm leading-7 text-gray-300 md:text-base">
                  I enjoy building professional web interfaces that are
                  performant, maintainable, and user-focused. If you’re hiring a
                  frontend developer or looking for someone to improve an
                  existing web experience, I’d be happy to connect.
                </p>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <a
                    href={
                      profileData.email ? `mailto:${profileData.email}` : "#"
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-medium text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100"
                  >
                    <FiMail size={16} />
                    Email Me
                  </a>

                  <a
                    href="#"
                    onClick={(e) => e.preventDefault()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-medium text-gray-100 transition hover:bg-white/10"
                    title="CV download will be wired to your resume file in the asset wiring step"
                  >
                    <FiDownload size={16} />
                    Download CV
                  </a>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                    Preferred Contact
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    Email is the fastest way to reach me for interviews,
                    opportunities, and project discussions.
                  </p>
                </div>
              </div>
            </Card>
          </Reveal>
          {/* Right: Contact methods + social links */}
          <Reveal delay={0.08}>
            <div className="grid gap-6">
              <Card className="p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200">
                    <FiMail size={18} />
                  </span>
                  <div>
                    <p className="eyebrow">Contact Details</p>
                    <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
                      Reach Out Directly
                    </h3>
                  </div>
                </div>

                <div className="mt-5 space-y-3">
                  {contactMethods.map((method) => {
                    const icon =
                      method.id === "email" ? (
                        <FiMail size={16} />
                      ) : method.id === "phone" ? (
                        <FiPhone size={16} />
                      ) : (
                        <FiMapPin size={16} />
                      );

                    const content = (
                      <div className="group rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-white/15 hover:bg-white/10">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300">
                            {icon}
                          </span>

                          <div className="min-w-0">
                            <p className="text-xs uppercase tracking-[0.14em] text-gray-400">
                              {method.label}
                            </p>
                            <p className="mt-1 break-words text-sm font-medium text-white md:text-base">
                              {method.value}
                            </p>
                            {method.description && (
                              <p className="mt-2 text-xs leading-5 text-gray-400">
                                {method.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );

                    if (method.href) {
                      return (
                        <a key={method.id} href={method.href} className="block">
                          {content}
                        </a>
                      );
                    }

                    return <div key={method.id}>{content}</div>;
                  })}
                </div>
              </Card>

              <Card className="p-5 md:p-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200">
                    <FiArrowUpRight size={18} />
                  </span>
                  <div>
                    <p className="eyebrow">Online Presence</p>
                    <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
                      Professional Links
                    </h3>
                  </div>
                </div>

                <div className="mt-5 grid gap-3">
                  {contactLinks.map((link) => {
                    const icon =
                      link.id === "linkedin" ? (
                        <FiLinkedin size={16} />
                      ) : (
                        <FiGithub size={16} />
                      );

                    return (
                      <a
                        key={link.id}
                        href={link.href}
                        target={
                          link.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          link.href.startsWith("http")
                            ? "noreferrer noopener"
                            : undefined
                        }
                        className={cn(
                          "group rounded-2xl border border-white/10 bg-white/5 p-4 transition",
                          "hover:border-white/15 hover:bg-white/10",
                        )}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-gray-300 group-hover:text-white">
                              {icon}
                            </span>

                            <div>
                              <p className="text-sm font-medium text-white">
                                {link.label}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-gray-400">
                                {link.description}
                              </p>
                            </div>
                          </div>

                          <FiArrowUpRight
                            size={16}
                            className="mt-1 text-gray-400 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-white"
                          />
                        </div>
                      </a>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                    Availability
                  </p>
                  <p className="mt-2 text-sm leading-6 text-gray-200">
                    Open to frontend engineering roles, freelance projects, and
                    product-focused collaborations.
                  </p>
                </div>
              </Card>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default ContactSection;
