import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: "website" | "profile";
}

const DEFAULT_TITLE = "Ahmad Khalifeh | Frontend Web Developer";
const DEFAULT_DESCRIPTION =
  "Professional portfolio of Ahmad Khalifeh — Frontend Web Developer specializing in React, TypeScript, modern UI architecture, Chart.js, Three.js, and WebGL experiences.";
const DEFAULT_IMAGE = "/og-cover.png"; // put file in /public
const DEFAULT_URL = "https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/"; // update later

function Seo({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  image = DEFAULT_IMAGE,
  url = DEFAULT_URL,
  type = "website",
}: SeoProps) {
  const fullTitle =
    title === DEFAULT_TITLE ? title : `${title} | Ahmad Khalifeh`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Ahmad Khalifeh",
    url,
    jobTitle: "Frontend Web Developer",
    sameAs: [
      // add your real links
      "https://github.com/YOUR_USERNAME",
      "https://www.linkedin.com/in/YOUR_LINKEDIN",
    ],
    knowsAbout: [
      "React",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "Three.js",
      "WebGL",
      "Chart.js",
      "Frontend Development",
    ],
  };

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="robots" content="index,follow" />
      <meta name="theme-color" content="#070b14" />
      <link rel="canonical" href={url} />

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={new URL(image, url).toString()} />
      <meta property="og:site_name" content="Ahmad Khalifeh Portfolio" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={new URL(image, url).toString()} />

      {/* JSON-LD */}
      <script type="application/ld+json">
        {JSON.stringify(structuredData)}
      </script>
    </Helmet>
  );
}

export default Seo;
