import { FiArrowRight, FiMail } from "react-icons/fi";

import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import AvailabilityBadges from "@/components/ui/AvailabilityBadges";
import { CTAButton, ResumeButton } from "@/components/ui/Button";
import { heroStats } from "@/data/hero";
import { profileData } from "@/data/profile";
import { socialLinks } from "@/data/social";
import { motion } from "framer-motion";
import ParallaxMouse from "@/components/motion/ParallaxMouse";
import Magnetic from "@/components/motion/Magnetic";
import ContactWebGLCard from "@/components/three/ContactWebGLCard";

function HeroSection() {
  return (
    <section id="hero" className="section anchor-offset relative pt-4 md:pt-8">
      <Container>
        <div className="grid items-start gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
          {/* Left Content */}
          <div className="relative">
            {/* Intro badges row */}
            <motion.div
              className="flex flex-wrap items-center gap-2"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <AvailabilityBadges
                secondaryLabel="React + TypeScript"
                secondaryClassName="border-violet-400/25 bg-violet-400/10 text-violet-200"
              />
            </motion.div>

            {/* Headline */}
            <ParallaxMouse strengthX={10} strengthY={8}>
              <div className="mt-6">
                <p className="eyebrow">Front-End Developer Portfolio</p>

                <h1 className="mt-4 text-4xl font-bold leading-[1.05] text-white md:text-6xl xl:text-7xl">
                  Building modern web interfaces with{" "}
                  <span className="accent-gradient-text">clarity</span>,{" "}
                  <span className="accent-gradient-text">performance</span>, and{" "}
                  <span className="accent-gradient-text">craft</span>.
                </h1>

                <p className="body-lg mt-6 max-w-2xl">
                  I’m{" "}
                  <span className="font-semibold text-white">
                    {profileData.fullName}
                  </span>
                  , a{" "}
                  <span className="font-semibold text-white">
                    {profileData.role}
                  </span>{" "}
                  focused on creating responsive, maintainable web applications
                  using React, TypeScript, and modern frontend architecture.
                </p>
              </div>
            </ParallaxMouse>

            {/* CTA Buttons */}
            <motion.div
              className="mt-8 flex flex-wrap items-center gap-3"
              initial="hidden"
              animate="visible"
              variants={{
                hidden: {},
                visible: {
                  transition: { staggerChildren: 0.08, delayChildren: 0.2 },
                },
              }}
            >
              <Magnetic>
                <CTAButton
                  href="#projects"
                  variant="primary"
                  className="group"
                  iconRight={
                    <FiArrowRight className="transition-transform group-hover:translate-x-0.5" />
                  }
                >
                  View Projects
                </CTAButton>
              </Magnetic>

              <CTAButton
                href="#contact"
                variant="secondary"
                iconLeft={<FiMail />}
              >
                Contact Me
              </CTAButton>

              <Magnetic>
                <ResumeButton
                  variant="ghost"
                  className="inline-flex items-center gap-2"
                  label="Download CV"
                />
              </Magnetic>
            </motion.div>

            {/* Social / quick links */}
            <div className="mt-6 flex flex-wrap items-center gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    link.href.startsWith("http")
                      ? "noreferrer noopener"
                      : undefined
                  }
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-gray-300 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
                >
                  {link.shortLabel}
                </a>
              ))}
            </div>

            {/* Trust / focus note */}
            <p className="mt-5 text-sm text-soft">
              Experience across product interfaces, dashboards, enterprise
              workflows, and scalable frontend features.
            </p>
          </div>

          {/* Right Visual Panel */}
          <div className="relative">
            {/* Glow accent behind panel */}
            <div
              aria-hidden="true"
              className="absolute -inset-4 -z-10 rounded-4xl bg-linear-to-br from-cyan-500/10 via-transparent to-violet-500/10 blur-2xl"
            />

            <Card variant="strong" className="overflow-hidden p-0">
              {/* Top visual placeholder area (Three.js/WebGL slot) */}
              <div className="border-b border-white/10 p-3 md:p-4">
                {/* <HeroWebGLVisual /> */}
                <ContactWebGLCard />
              </div>

              {/* Bottom stats area */}
              <div className="grid gap-3 p-4 sm:grid-cols-3">
                {heroStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p className="text-xs uppercase tracking-[0.16em] text-gray-400">
                      {stat.label}
                    </p>
                    <p className="mt-2 text-lg font-semibold text-white">
                      {stat.value}
                    </p>
                    {stat.hint && (
                      <p className="mt-1 text-xs text-gray-400">{stat.hint}</p>
                    )}
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
