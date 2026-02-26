import { Suspense, lazy } from "react";

import MainLayout from "./layouts/MainLayout";
import Seo from "./components/seo/Seo";
import useBootLoader from "./hooks/useBootLoader";
import { AnimatePresence } from "framer-motion";
import LoadingScreen from "./components/common/LoadingScreen";

const HeroSection = lazy(() => import("./sections/Hero/HeroSection"));
const AboutSection = lazy(() => import("./sections/About/AboutSection"));
const ExperienceSection = lazy(
  () => import("./sections/Experience/ExperienceSection"),
);
const SkillsSection = lazy(() => import("./sections/Skills/SkillsSection"));
const ProjectsSection = lazy(
  () => import("./sections/Projects/ProjectsSection"),
);
const EducationSection = lazy(
  () => import("./sections/Education/EducationSection"),
);
const ContactSection = lazy(() => import("./sections/Contact/ContactSection"));

function SectionFallback() {
  return (
    <div className="app-container py-8">
      <div className="h-24 animate-pulse rounded-2xl border border-white/10 bg-white/5" />
    </div>
  );
}

function App() {
  const { loading, progress } = useBootLoader({
    minDurationMs: 2000, // longer duration
    waitForFonts: true,
    tickMs: 28,
  });
  return (
    <>
      <Seo />
      <AnimatePresence mode="wait" initial={false}>
        {loading ? (
          <LoadingScreen
            key="loading"
            title="khalifeh.dev"
            subtitle="Preparing the experience…"
            progress={progress}
          />
        ) : (
          <MainLayout>
            <Suspense fallback={<SectionFallback />}>
              <HeroSection />
              <AboutSection />
              <ExperienceSection />
              <SkillsSection />
              <ProjectsSection />
              <EducationSection />
              <ContactSection />
            </Suspense>
          </MainLayout>
        )}
      </AnimatePresence>
    </>
  );
}

export default App;
