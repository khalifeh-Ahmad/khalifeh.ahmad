import {
  FiArrowUpRight,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";

import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { contactLinks, contactMethods } from "@/data/contact";
import { profileData } from "@/data/profile";
import { cn } from "@/utils/cn";
import Reveal from "@/components/motion/Reveal";
import Magnetic from "@/components/motion/Magnetic";
import HeroWebGLVisual from "@/components/three/HeroWebGLVisual";
import AvailabilityBadges from "@/components/ui/AvailabilityBadges";
import { CTAButton, ResumeButton } from "@/components/ui/Button";

interface ContactCardHeaderProps {
  eyebrow: string;
  title: string;
  description: string;
  pillLabel: string;
}

function ContactCardHeader({
  eyebrow,
  title,
  description,
  pillLabel,
}: ContactCardHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h3 className="mt-1 text-lg font-semibold text-white md:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-sm text-gray-300">{description}</p>
      </div>

      <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-gray-300">
        {pillLabel}
      </span>
    </div>
  );
}

function ContactMethodsList() {
  return (
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
                  <p className="mt-1 wrap-break-word text-sm font-semibold leading-6 text-white">
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
            target={method.href.startsWith("http") ? "_blank" : undefined}
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
  );
}

function ContactConnectRow() {
  return (
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
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={
                  link.href.startsWith("http")
                    ? "noreferrer noopener"
                    : undefined
                }
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
              >
                {icon}
                {link.label}
                <FiArrowUpRight size={14} className="text-gray-400" />
              </a>
            );
          })}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300">
        <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
        Available for roles, freelance projects, and product collaborations
      </div>
    </div>
  );
}

function ContactMainCard() {
  const emailHref = profileData.email ? `mailto:${profileData.email}` : "#";

  return (
    <Card variant="strong" className="relative overflow-hidden p-5 md:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/40 to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_14%,rgba(34,211,238,0.10),transparent_42%),radial-gradient(circle_at_86%_18%,rgba(139,92,246,0.08),transparent_44%)]"
      />

      <div className="relative">
        <ContactCardHeader
          eyebrow="Contact"
          title="Let&apos;s talk about your next product, role, or UI upgrade."
          description="I build modern interfaces that are performant, maintainable, and polished."
          pillLabel="Available"
        />

        <div className="mt-4">
          <AvailabilityBadges secondaryLabel="Frontend • React • TypeScript" />
        </div>

        <p className="mt-4 text-sm leading-7 text-gray-300 md:text-base">
          If you’re hiring a frontend developer or need help improving an
          existing web experience, I’d love to connect.
        </p>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Magnetic className="inline-block">
            <CTAButton
              href={emailHref}
              variant="primary"
              className="w-full sm:w-auto"
              iconLeft={<FiMail size={16} />}
            >
              Email Me
            </CTAButton>
          </Magnetic>

          <Magnetic className="inline-block">
            <ResumeButton
              variant="secondary"
              className="w-full sm:w-auto"
              label="Download CV"
            />
          </Magnetic>
        </div>

        <ContactMethodsList />
        <ContactConnectRow />
      </div>
    </Card>
  );
}

function ContactVisualCard() {
  return (
    <Card variant="strong" className="relative overflow-hidden p-5 md:p-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/40 to-transparent"
      />

      <div className="relative">
        <ContactCardHeader
          eyebrow="Visual"
          title="Contact Signal"
          description="A subtle WebGL accent that reacts to cursor movement."
          pillLabel="Interactive"
        />

        <div className="mt-4">
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
              Frontend builds, UI audits, refactors, and performance work.
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ContactSection() {
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
          <Reveal delay={0.06}>
            <ContactMainCard />
          </Reveal>

          <Reveal delay={0.08}>
            <div className="xl:sticky xl:top-28">
              <ContactVisualCard />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

export default ContactSection;

