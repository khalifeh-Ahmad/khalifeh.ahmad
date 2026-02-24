import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import Card from "../../components/ui/Card";

function EducationSection() {
  return (
    <section id="education" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Education"
          title="Education & Certifications"
          description="Academic background and verified learning achievements."
        />
        <Card>
          <p className="text-gray-300">
            Education section placeholder — details will be added in the
            education feature step.
          </p>
        </Card>
      </Container>
    </section>
  );
}

export default EducationSection;
