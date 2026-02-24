import Container from "../../components/ui/Container";
import SectionHeading from "../../components/ui/SectionHeading";
import Card from "../../components/ui/Card";

function ContactSection() {
  return (
    <section id="contact" className="section anchor-offset">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let’s Build Something Great"
          description="A clear and professional contact section with social links and call-to-action."
        />
        <Card>
          <p className="text-gray-300">
            Contact section placeholder — final contact UI comes later.
          </p>
        </Card>
      </Container>
    </section>
  );
}

export default ContactSection;
