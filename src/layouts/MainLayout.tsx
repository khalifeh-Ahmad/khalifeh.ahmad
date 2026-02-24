import type { PropsWithChildren } from "react";

function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#0b0f19] text-gray-100">
      {/* Background glow accents (modern, subtle) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-120px] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] h-[240px] w-[240px] rounded-full bg-violet-500/10 blur-3xl" />
      </div>

      {children}
    </div>
  );
}

export default MainLayout;
