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
    const onScroll = () => setScrolled(window.scrollY > 8);
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
      <header className="fixed inset-x-0 top-0 z-50 px-3 pt-4 md:px-4">
        <Container className="px-0">
          <div className="flex items-center justify-center">
            <div
              className={cn(
                "flex w-full max-w-5xl items-center justify-between gap-3 rounded-2xl border px-3 py-2.5 transition-all duration-300",
                scrolled
                  ? "border-white/15 bg-[#0b1220]/70 shadow-[0_12px_40px_rgba(0,0,0,0.30)] backdrop-blur-xl"
                  : "border-white/10 bg-[#0b1220]/45 backdrop-blur-lg",
              )}
            >
              {/* Left: Logo */}
              <div className="shrink-0">
                <Logo />
              </div>

              {/* Center: Desktop pill nav */}

              <nav
                aria-label="Primary"
                className="hidden min-w-0 items-center justify-center md:flex"
              >
                <div className="flex items-center gap-1 rounded-2xl border border-white/10 bg-white/5 p-1">
                  {NAV_ITEMS.map((item) => (
                    <a
                      key={item.id}
                      href={item.href}
                      className={cn(
                        "relative rounded-xl px-3 py-2 text-sm text-gray-300 transition",
                        "hover:bg-white/6 hover:text-white",
                      )}
                    >
                      <span className="relative z-10">{item.label}</span>
                    </a>
                  ))}
                </div>
              </nav>

              {/* Right: subtle utility + mobile toggle */}
              <div className="flex items-center gap-2">
                
                {/* Decorative status dot / availability chip (desktop only) */}
                <div className="hidden items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-300 md:inline-flex">
                  <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                  Available
                </div>

                <button
                  type="button"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl border text-gray-200 transition md:hidden",
                    mobileOpen
                      ? "border-white/20 bg-white/10"
                      : "border-white/10 bg-white/5 hover:bg-white/10",
                  )}
                  aria-label={
                    mobileOpen
                      ? "Close navigation menu"
                      : "Open navigation menu"
                  }
                  aria-expanded={mobileOpen}
                  aria-controls="mobile-nav-panel"
                >
                  {mobileOpen ? <HiXMark size={20} /> : <HiBars3 size={20} />}
                </button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      {/* Mobile menu panel (floating card, not full-width dropdown) */}
      <div
        className={cn(
          "fixed inset-x-0 top-[78px] z-40 px-3 transition-all duration-300 md:hidden",
          mobileOpen
            ? "pointer-events-auto translate-y-0 opacity-100"
            : "pointer-events-none -translate-y-2 opacity-0",
        )}
      >
        <Container className="px-0">
          <div className="mx-auto max-w-5xl">
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
                  <div className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-emerald-300">
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                    Available for opportunities
                  </div>
                </div>
              </div>
            </nav>
          </div>
        </Container>
      </div>

      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation overlay"
        onClick={() => setMobileOpen(false)}
        className={cn(
          "fixed inset-0 z-30 bg-black/30 transition-opacity duration-300 md:hidden",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
    </>
  );
}

export default Header;
