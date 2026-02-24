import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import Card from "../../components/ui/Card";

function ProjectsSection() {
  return (
    <section id="projects" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Projects"
          title="Selected Projects"
          description="Professional project cards with tech stack, challenges, and impact."
        />
        <Card>
          <p className="text-gray-300">
            Projects section placeholder — final cards/grid comes later.
          </p>
        </Card>
      </Container>
    </section>
  );
}

export default ProjectsSection;
