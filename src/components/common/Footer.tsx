import { FiArrowUpRight, FiGithub, FiLinkedin } from "react-icons/fi";

import Container from "@/components/ui/Container";
import { profileData } from "@/data/profile";
import { contactLinks } from "@/data/contact";
import { NAV_ITEMS } from "@/lib/constants";
import Logo from "./Logo";

function Footer() {
  const currentYear = new Date().getFullYear();

  const socialItems = contactLinks;

  return (
    <footer className="relative mt-8 border-t border-white/10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-cyan-300/30 to-transparent"
      />

      <Container>
        <div className="py-10 md:py-12">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Left: brand / summary */}
            <div>
            <Logo />
              {/* <a
                href="#hero"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 transition hover:bg-white/10 hover:text-white"
              >
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-xs font-semibold text-white">
                  KhA
                </span>
                <span>
                  khalifeh<span className="text-gray-500">.dev</span>
                </span>
              </a> */}

              <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-300">
                Frontend engineer focused on building modern, performant, and
                maintainable web applications with React, TypeScript, and
                professional UI architecture.
              </p>

              <p className="mt-4 text-xs text-gray-400">
                © {currentYear} {profileData.fullName}. All rights reserved.
              </p>
            </div>

           
            {/* Right: links */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-gray-400">
                  Navigation
                </p>
                <div className="mt-3 grid gap-2">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className="inline-flex items-center gap-2 text-sm text-gray-300 transition hover:text-white"
                    >
                      <span className="h-1 w-1 rounded-full bg-cyan-300/80" />
                      {item.label}
                    </a>
                  ))}
                </div>
              </div>

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
                          item.href.startsWith("http") ? "_blank" : undefined
                        }
                        rel={
                          item.href.startsWith("http")
                            ? "noreferrer noopener"
                            : undefined
                        }
                        className="group inline-flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-300 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
                      >
                        <span className="inline-flex items-center gap-2">
                          <span className="text-gray-300 group-hover:text-white">
                            {icon}
                          </span>
                          {item.label}
                        </span>
                        <FiArrowUpRight
                          size={15}
                          className="text-gray-400 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white"
                        />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Bottom row (centered to avoid floating theme switcher overlap) */}
          <div className="mt-8 border-t border-white/10 pt-5">
            <div className="flex flex-col items-center gap-3 text-center text-xs text-gray-400">
              <p>
                Built with React, TypeScript, Tailwind CSS, Chart.js, and
                Three.js/WebGL.
              </p>

              <a
                href="#hero"
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-gray-300 transition hover:border-white/15 hover:bg-white/10 hover:text-white"
              >
                Back to top
                <span aria-hidden="true">↑</span>
              </a>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
