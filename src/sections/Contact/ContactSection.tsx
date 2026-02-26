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
import Magnetic from "@/components/motion/Magnetic";
import HeroWebGLVisual from "@/components/three/HeroWebGLVisual";

function ContactSection() {
  const emailHref = profileData.email ? `mailto:${profileData.email}` : "#";

  return (
    <section id="contact" className="section anchor-offset">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Contact"
            title="Let’s Build Something Great"
            description="Open to frontend engineering roles, freelance projects, and collaborations focused on modern web applications and user experience."
            align="center"
          />
        </Reveal>

        <div className="mt-10 grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT: Unified Contact Card */}
          <Reveal delay={0.06}>
            <Card
              variant="strong"
              className="relative overflow-hidden p-5 md:p-6"
            >
              {/* consistent top hairline */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
              />
              {/* subtle background */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.10),transparent_42%),radial-gradient(circle_at_86%_18%,rgba(139,92,246,0.08),transparent_44%)]"
              />

              <div className="relative">
                {/* Consistent header row (same pattern as right card) */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Contact</p>
                    <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
                      Let&apos;s talk about your next product, role, or UI
                      upgrade.
                    </h3>
                    <p className="mt-2 text-sm text-gray-300">
                      I build modern interfaces that are performant,
                      maintainable, and polished.
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                    Available
                  </span>
                </div>

                {/* Badges */}
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge>Open to Opportunities</Badge>
                  <Badge className="border-white/10 bg-white/5 text-gray-200">
                    Frontend • React • TypeScript
                  </Badge>
                </div>

                {/* Supporting paragraph */}
                <p className="mt-4 text-sm leading-7 text-gray-300 md:text-base">
                  If you’re hiring a frontend developer or need help improving
                  an existing web experience, I’d love to connect.
                </p>

                {/* Primary actions */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <Magnetic className="inline-block">
                    <a
                      href={emailHref}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-semibold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-100 sm:w-auto"
                    >
                      <FiMail size={16} />
                      Email Me
                    </a>
                  </Magnetic>

                  <Magnetic className="inline-block">
                    <a
                      href={profileData.resumeUrl || "/Khalifeh.Ahmad.pdf"}
                      download
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-gray-100 transition hover:bg-white/10 sm:w-auto"
                      title="Downloads your resume PDF"
                    >
                      <FiDownload size={16} />
                      Download CV
                    </a>
                  </Magnetic>
                </div>

                {/* Contact methods (horizontal, full values visible) */}
                <div className="mt-7 grid gap-3">
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
                      <div
                        className={cn(
                          "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-4 py-4 transition",
                          "hover:border-white/15 hover:bg-white/10",
                        )}
                      >
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100 bg-[radial-gradient(circle_at_18%_20%,rgba(34,211,238,0.06),transparent_52%),radial-gradient(circle_at_85%_15%,rgba(139,92,246,0.05),transparent_55%)]"
                        />

                        <div className="relative flex items-start justify-between gap-4">
                          <div className="flex min-w-0 items-start gap-3">
                            <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-gray-200">
                              {icon}
                            </span>

                            <div className="min-w-0">
                              <p className="text-[10px] uppercase tracking-[0.22em] text-gray-400">
                                {method.label}
                              </p>
                              <p className="mt-1 text-sm font-semibold leading-6 text-white break-words">
                                {method.value}
                              </p>
                              {method.description ? (
                                <p className="mt-1 text-xs leading-5 text-gray-400">
                                  {method.description}
                                </p>
                              ) : null}
                            </div>
                          </div>

                          <span className="mt-2 shrink-0 text-xs text-gray-400 transition group-hover:text-white">
                            →
                          </span>
                        </div>
                      </div>
                    );

                    return method.href ? (
                      <a
                        key={method.id}
                        href={method.href}
                        className="block"
                        target={
                          method.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          method.href.startsWith("http")
                            ? "noreferrer noopener"
                            : undefined
                        }
                      >
                        {content}
                      </a>
                    ) : (
                      <div key={method.id}>{content}</div>
                    );
                  })}
                </div>

                {/* Connect row */}
                <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                        Connect
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-200">
                        Email is fastest. Also available on GitHub & LinkedIn.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
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
                              link.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              link.href.startsWith("http")
                                ? "noreferrer noopener"
                                : undefined
                            }
                            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
                          >
                            {icon}
                            {link.label}
                            <FiArrowUpRight
                              size={14}
                              className="text-gray-400"
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                    Available for roles, freelance projects, and product
                    collaborations
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>

          {/* RIGHT: WebGL Hero Card (sticky on desktop) */}
          <Reveal delay={0.08}>
            <div className="xl:sticky xl:top-28">
              <Card
                variant="strong"
                className="relative overflow-hidden p-5 md:p-6"
              >
                {/* same hairline as left */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/40 to-transparent"
                />

                <div className="relative">
                  {/* Consistent header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="eyebrow">Visual</p>
                      <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
                        Contact Signal
                      </h3>
                      <p className="mt-2 text-sm text-gray-300">
                        A subtle WebGL accent that reacts to cursor movement.
                      </p>
                    </div>

                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
                      Interactive
                    </span>
                  </div>

                  <div className="mt-4">
                    {/* <ContactWebGLCard /> */}
                    <HeroWebGLVisual />
                  </div>

                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                        Response
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-200">
                        Usually within 24–48 hours for emails.
                      </p>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                        Best For
                      </p>
                      <p className="mt-2 text-sm leading-6 text-gray-200">
                        Frontend builds, UI audits, refactors, and performance
                        work.
                      </p>
                    </div>
                  </div>
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
