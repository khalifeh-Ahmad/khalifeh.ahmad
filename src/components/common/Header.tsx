import { useEffect, useMemo, useState } from "react";
import { HiBars3, HiXMark } from "react-icons/hi2";
import { LayoutGroup, motion } from "framer-motion";

import Logo from "@/components/common/Logo";
import Container from "@/components/ui/Container";
import { NAV_ITEMS } from "@/lib/constants";
import useActiveSection from "@/hooks/useActiveSection";
import { cn } from "@/utils/cn";
import { useThemeMode } from "@/components/theme/ThemeProvider";

import BackgroundStyleControl from "./BackgroundStyleControl";
import { useBackground } from "../background/BackgroundProvider";

function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme } = useThemeMode();
  const isLight = resolvedTheme === "light";

  const selectors = useMemo(() => NAV_ITEMS.map((item) => item.href), []);
  const { activeSection } = useActiveSection({
    selectors,
    offset: 130,
    fallbackId: NAV_ITEMS[0]?.href?.replace(/^#/, "") ?? "hero",
  });

  const { variant, setVariant } = useBackground();

  const normalizedActiveSection = (activeSection ?? "")
    .replace(/^#/, "")
    .trim()
    .toLowerCase();

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
                isLight
                  ? scrolled
                    ? "border-slate-200/80 bg-white/85 shadow-[0_12px_40px_rgba(15,23,42,0.12)] backdrop-blur-xl"
                    : "border-slate-200/60 bg-white/70 backdrop-blur-lg"
                  : scrolled
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
                <LayoutGroup>
                  <div
                    className={cn(
                      "flex items-center gap-1 rounded-2xl border p-1",
                      isLight
                        ? "border-slate-200/60 bg-slate-100/80"
                        : "border-white/10 bg-white/5",
                    )}
                  >
                    {NAV_ITEMS.map((item) => {
                      const itemId = item.href.replace(/^#/, "").toLowerCase();
                      const isActive = normalizedActiveSection === itemId;

                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "relative rounded-xl px-3 py-2 text-sm transition",
                            isLight
                              ? "hover:bg-slate-200/60 hover:text-slate-900"
                              : "hover:bg-white/6 hover:text-white",
                            isActive ? "text-[#0b1220]" : isLight ? "text-slate-600" : "text-gray-300",
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="header-desktop-active-pill"
                              className="absolute inset-0 rounded-xl border border-[#FAAD14]/35 bg-[#FAAD14] shadow-[0_0_0_1px_rgba(250,173,20,0.15),0_10px_26px_rgba(250,173,20,0.18)]"
                              transition={{
                                type: "spring",
                                stiffness: 340,
                                damping: 30,
                              }}
                              aria-hidden="true"
                            />
                          )}

                          <span className="relative z-10">{item.label}</span>
                        </a>
                      );
                    })}
                  </div>
                </LayoutGroup>
              </nav>

              {/* Right: utilities */}
              <div className="flex items-center gap-2">
                {/* Background switcher (desktop) */}
                <div className="hidden md:block">
                  <BackgroundStyleControl
                    value={variant}
                    onChange={setVariant}
                  />
                </div>

                {/* Mobile toggle */}
                <button
                  type="button"
                  onClick={() => setMobileOpen((prev) => !prev)}
                  className={cn(
                    "inline-flex h-10 w-10 items-center justify-center rounded-xl border transition md:hidden",
                    isLight
                      ? "text-slate-600 border-slate-200/60 bg-slate-100/80 hover:bg-slate-200/60"
                      : "text-gray-200 border-white/10 bg-white/5 hover:bg-white/10",
                    mobileOpen && (isLight ? "bg-slate-200/70" : "border-white/20 bg-white/10"),
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

      {/* Mobile menu panel */}
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
              className={cn(
                "overflow-hidden p-2",
                isLight
                  ? "rounded-2xl border border-slate-200/60 bg-white/90 shadow-lg backdrop-blur-xl"
                  : "surface-strong",
              )}
            >
              <LayoutGroup>
                <div className="flex flex-col">
                  {/* Background switcher (mobile) */}
                  <div className="px-2 pb-2">
                    <BackgroundStyleControl
                      value={variant}
                      onChange={setVariant}
                    />
                  </div>

                  <div className={cn("border-t pt-2", isLight ? "border-slate-200/60" : "border-white/10")}>
                    {NAV_ITEMS.map((item) => {
                      const itemId = item.href.replace(/^#/, "").toLowerCase();
                      const isActive = normalizedActiveSection === itemId;

                      return (
                        <a
                          key={item.id}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          aria-current={isActive ? "page" : undefined}
                          className={cn(
                            "relative rounded-xl px-4 py-3 text-sm transition",
                            isLight
                              ? "hover:bg-slate-100 hover:text-slate-900"
                              : "hover:bg-white/5 hover:text-white",
                            isActive ? (isLight ? "text-slate-900" : "text-white") : isLight ? "text-slate-600" : "text-gray-200",
                          )}
                        >
                          {isActive && (
                            <motion.span
                              layoutId="header-mobile-active-pill"
                              className="absolute inset-0 rounded-xl border border-[#FAAD14]/35 bg-[#FAAD14]/15 shadow-[0_0_0_1px_rgba(250,173,20,0.12)]"
                              transition={{
                                type: "spring",
                                stiffness: 340,
                                damping: 30,
                              }}
                              aria-hidden="true"
                            />
                          )}
                          <span className="relative z-10">{item.label}</span>
                        </a>
                      );
                    })}
                  </div>

                  <div className={cn("mt-2 border-t pt-2", isLight ? "border-slate-200/60" : "border-white/10")}>
                    <div className={cn("flex items-center gap-2 rounded-xl px-4 py-3 text-sm", isLight ? "text-emerald-600" : "text-emerald-300")}>
                      <span className="inline-block h-2 w-2 rounded-full bg-emerald-300 shadow-[0_0_14px_rgba(110,231,183,0.8)]" />
                      Available for opportunities
                    </div>
                  </div>
                </div>
              </LayoutGroup>
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
          "fixed inset-0 z-30 transition-opacity duration-300 md:hidden",
          isLight ? "bg-slate-900/20" : "bg-black/30",
          mobileOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
    </>
  );
}

export default Header;
