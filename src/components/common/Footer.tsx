import { FiArrowUpRight, FiGithub, FiLinkedin } from "react-icons/fi";

import Container from "@/components/ui/Container";
import { profileData } from "@/data/profile";
import { contactLinks } from "@/data/contact";
import { NAV_ITEMS } from "@/lib/constants";
import Logo from "./Logo";
import { motion, useReducedMotion } from "framer-motion";

function Footer() {
  const currentYear = new Date().getFullYear();
  const socialItems = contactLinks;
  const prefersReducedMotion = useReducedMotion();
  return (
    <footer className="relative mt-10 pb-10">
      {/* subtle section divider */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />

      <Container>
        <div className="pt-10 md:pt-12">
          {/* Glass panel */}
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-[0_18px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
            {/* top glow */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/35 to-transparent"
            />
            {/* ambient gradients */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 opacity-80 bg-[radial-gradient(circle_at_12%_18%,rgba(34,211,238,0.08),transparent_44%),radial-gradient(circle_at_86%_20%,rgba(139,92,246,0.07),transparent_46%)]"
            />
            {/* soft vignette */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,255,255,0.05),transparent_55%)]"
            />

            <div className="relative p-6 md:p-8">
              <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Left: Brand */}
                <div className="min-w-0">
                  <Logo />

                  <p className="mt-4 max-w-xl text-sm leading-7 text-gray-300">
                    Frontend engineer focused on building modern, performant,
                    and maintainable web applications with React, TypeScript,
                    and clean UI architecture.
                  </p>

                  {/* mini meta row */}
                  <div className="mt-5 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      React • TypeScript
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Chart.js • Three.js/WebGL
                    </span>
                  </div>

                  <p className="mt-5 text-xs text-gray-400">
                    © {currentYear} {profileData.fullName}. All rights reserved.
                  </p>
                </div>

                {/* Right: Navigation + Social */}
                <div className="grid gap-6 sm:grid-cols-2">
                  {/* Navigation */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Navigation
                    </p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {NAV_ITEMS.map((item) => (
                        <a
                          key={item.id}
                          href={item.href}
                          className="inline-flex items-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* Profiles */}
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                      Profiles
                    </p>

                    <div className="mt-3 grid gap-2">
                      {socialItems.map((item) => {
                        const icon =
                          item.id === "linkedin" ? (
                            <FiLinkedin size={16} />
                          ) : (
                            <FiGithub size={16} />
                          );

                        return (
                          <a
                            key={item.id}
                            href={item.href}
                            target={
                              item.href.startsWith("http")
                                ? "_blank"
                                : undefined
                            }
                            rel={
                              item.href.startsWith("http")
                                ? "noreferrer noopener"
                                : undefined
                            }
                            className="group inline-flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-gray-200 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
                          >
                            <span className="inline-flex items-center gap-3">
                              <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200">
                                {icon}
                              </span>
                              <span className="font-medium">{item.label}</span>
                            </span>

                            <FiArrowUpRight
                              size={16}
                              className="text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                            />
                          </a>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom row — centered, clean, no overlap issues */}
              <div className="mt-8 border-t border-white/10 pt-5">
                <div className="flex flex-col items-center gap-3 text-center">
                  <p className="text-xs text-gray-400">
                    Built with React, TypeScript, Tailwind CSS, Chart.js, and
                    Three.js/WebGL.
                  </p>

                  <motion.a
                    href="#hero"
                    whileHover={
                      prefersReducedMotion ? undefined : { y: -2, scale: 1.02 }
                    }
                    whileTap={
                      prefersReducedMotion ? undefined : { scale: 0.97 }
                    }
                    className="inline-flex items-center gap-2 rounded-2xl border border-[#FAAD14]/35 bg-[#FAAD14]/15 px-5 py-2.5 text-sm font-semibold text-[#FAAD14] shadow-[0_10px_26px_rgba(250,173,20,0.14)] backdrop-blur-xl transition hover:bg-[#FAAD14]/25 hover:border-[#FAAD14]/55 hover:text-[#FFD666]"
                  >
                    Back to top <span aria-hidden="true">↑</span>
                  </motion.a>
                </div>
              </div>
            </div>
          </div>

          {/* breathing room under the floating dock */}
          <div className="h-6" />
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
