import Card from "@/components/ui/Card";
import Container from "@/components/ui/Container";
import { profileData } from "@/data/profile";

function HeroSection() {
  return (
    <section id="hero" className="section anchor-offset relative">
      <Container>
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow">Portfolio</p>

            <h1 className="heading-display mt-4 text-white">
              {profileData.fullName}
            </h1>

            <p className="mt-4 text-lg text-cyan-200 md:text-xl">
              {profileData.role}
            </p>

            <p className="body-lg mt-4 max-w-2xl">{profileData.summary}</p>
          </div>

          <Card variant="strong" className="min-h-[220px]">
            <p className="text-sm text-muted">This panel will later contain:</p>
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
