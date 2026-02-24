import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import Card from "../../components/ui/Card";

function ExperienceSection() {
  return (
    <section id="experience" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="Experience"
          title="Professional Experience"
          description="Timeline and impact-focused summaries of your roles."
        />
        <Card>
          <p className="text-gray-300">
            Experience section placeholder — timeline implementation comes
            later.
          </p>
        </Card>
      </Container>
    </section>
  );
}

export default ExperienceSection;
