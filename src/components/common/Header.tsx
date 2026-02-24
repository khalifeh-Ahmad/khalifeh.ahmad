import { useEffect, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";

import Logo from "@/components/common/Logo";
import Container from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/constants";
import { cn } from "@/utils/cn";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const closeOnHashChange = () => setMobileOpen(false);
    window.addEventListener("hashchange", closeOnHashChange);
    return () => window.removeEventListener("hashchange", closeOnHashChange);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 px-3 pt-3 md:px-4">
        <Container className="px-0">
          <div
            className={cn(
              "flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 md:px-5",
              scrolled
                ? "border-white/15 bg-[#0b1220]/75 shadow-[0_10px_35px_rgba(0,0,0,0.28)] backdrop-blur-xl"
                : "border-white/10 bg-[#0b1220]/45 backdrop-blur-md",
            )}
          >
            <Logo />

            {/* Desktop Nav */}
            <nav
              aria-label="Primary"
              className="hidden items-center gap-2 md:flex"
            >
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  className="rounded-xl px-3 py-2 text-sm text-gray-300 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#contact"
                className="ml-2 inline-flex items-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-200"
              >
                Hire Me
              </a>
            </nav>

            {/* Mobile Toggle */}
            <button
              type="button"
              onClick={() => setMobileOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-gray-200 transition hover:bg-white/10 md:hidden"
              aria-label={
                mobileOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav-panel"
            >
              {mobileOpen ? <HiXMark size={22} /> : <HiBars3 size={22} />}
            </button>
          </div>
        </Container>
      </header>

      {/* Mobile Menu Panel */}
      <div
        className={cn(
          "fixed inset-x-0 top-[76px] z-40 px-3 transition-all duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <Container className="px-0">
          <nav
            id="mobile-nav-panel"
            aria-label="Mobile navigation"
            className="surface-strong overflow-hidden p-2"
          >
            <div className="flex flex-col">
              {NAV_ITEMS.map((item) => (
                <a
                  key={item.id}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-xl px-4 py-3 text-sm text-gray-200 transition hover:bg-white/5 hover:text-white"
                >
                  {item.label}
                </a>
              ))}

              <div className="mt-2 border-t border-white/10 pt-2">
                <a
                  href="#contact"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-4 py-3 text-sm font-medium text-cyan-300 transition hover:bg-cyan-300/10"
                >
                  Hire Me
                </a>
              </div>
            </div>
          </nav>
        </Container>
      </div>

      {/* Mobile backdrop */}
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-black/35 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
    </>
  );
}

export default Header;
