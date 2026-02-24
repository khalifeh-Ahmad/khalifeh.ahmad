import type { PropsWithChildren } from "react";

import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";

function MainLayout({ children }: PropsWithChildren) {
  return (
    <div className="relative min-h-screen overflow-x-clip text-gray-100">
      {/* Ambient background glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div className="absolute left-1/2 top-[-120px] h-[380px] w-[380px] -translate-x-1/2 rounded-full bg-cyan-500/15 blur-3xl" />
        <div className="absolute right-[10%] top-[30%] h-[240px] w-[240px] rounded-full bg-violet-500/10 blur-3xl" />
        <div className="absolute left-[8%] top-[60%] h-[220px] w-[220px] rounded-full bg-sky-500/10 blur-3xl" />
      </div>

      <Header />

      <div className="pt-24 md:pt-28">{children}</div>

      <Footer />
    </div>
  );
}

export default MainLayout;
