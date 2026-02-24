import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import Card from "../../components/ui/Card";

function AboutSection() {
  return (
    <section id="about" className="py-16 md:py-24">
      <Container>
        <SectionHeading
          eyebrow="About"
          title="About Me"
          description="A concise, professional overview based on your resume and career goals."
        />
        <Card>
          <p className="text-gray-300">
            About section placeholder — we will implement the final version in
            the About feature step.
          </p>
        </Card>
      </Container>
    </section>
  );
}

export default AboutSection;
