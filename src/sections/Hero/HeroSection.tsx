import Container from "../../components/ui/Container";
import Card from "../../components/ui/Card";
import { profileData } from "../../data/profile";

function HeroSection() {
  return (
    <section id="hero" className="relative py-20 md:py-28">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-400">
              Portfolio
            </p>
            <h1 className="mt-4 text-4xl font-bold leading-tight text-white md:text-6xl">
              {profileData.fullName}
            </h1>
            <p className="mt-4 text-lg text-cyan-200 md:text-xl">
              {profileData.role}
            </p>
            <p className="mt-4 max-w-2xl text-base text-gray-300 md:text-lg">
              {profileData.summary}
            </p>
          </div>

          <Card className="min-h-[220px]">
            <p className="text-sm text-gray-300">
              This panel will later contain:
            </p>
            <ul className="mt-4 space-y-2 text-sm text-gray-200">
              <li>• Three.js / WebGL hero visual</li>
              <li>• Key stats / quick highlights</li>
              <li>• CTA buttons (CV / Contact / Projects)</li>
            </ul>
          </Card>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
