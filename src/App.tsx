import { Suspense, lazy } from "react";

import MainLayout from "./layouts/MainLayout";
import Seo from "./components/seo/Seo";

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
  return (
    <>
      <Seo />
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
    </>
  );
}

export default App;
