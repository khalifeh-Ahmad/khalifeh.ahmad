import MainLayout from "./layouts/MainLayout";
import HeroSection from "./sections/Hero/HeroSection";
import AboutSection from "./sections/About/AboutSection";
import ExperienceSection from "./sections/Experience/ExperienceSection";
import SkillsSection from "./sections/Skills/SkillsSection";
import ProjectsSection from "./sections/Projects/ProjectsSection";
import EducationSection from "./sections/Education/EducationSection";
import ContactSection from "./sections/Contact/ContactSection";

function App() {
  return (
    <MainLayout>
      <HeroSection />
      <AboutSection />
      <ExperienceSection />
      <SkillsSection />
      <ProjectsSection />
      <EducationSection />
      <ContactSection />
    </MainLayout>
  );
}

export default App;
