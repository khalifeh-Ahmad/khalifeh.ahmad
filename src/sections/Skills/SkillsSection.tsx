import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import Card from "../../components/ui/Card";

function SkillsSection() {
  return (
    <section id="skills" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Skills"
          title="Technical Skills"
          description="Later this section will include modern visualizations using Chart.js."
        />
        <Card>
          <p className="text-gray-300">
            Skills section placeholder — Chart.js integration comes in the
            dedicated feature step.
          </p>
        </Card>
      </Container>
    </section>
  );
}

export default SkillsSection;
