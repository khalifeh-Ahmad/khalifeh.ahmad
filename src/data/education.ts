import type { CertificationItem, EducationItem } from "@/types/education";

export const educationData: EducationItem[] = [
  {
    id: "masters-web-science",
    institution: "Syrian Virtual University",
    degree: "Master Degree",
    field: "Web Science",
    endYear: "2025",
    location: "Syria",
    description:
      "Advanced studies focused on web technologies, systems, and modern internet-based platforms.",
  },
  {
    id: "it-engineering",
    institution: "University",
    degree: "Bachelor Degree",
    field: "Information Technology Engineering",
    endYear: "2017",
    location: "Syria",
    description:
      "Engineering foundation in software systems, computing principles, and technical problem solving.",
  },
];

export const certificationsData: CertificationItem[] = [
  {
    id: "ISTQB",
    title: "Software Testing Fundamentals for ISTQB",
    issuer: "Coursera",
    credentialUrl:
      "https://www.coursera.org/account/accomplishments/specialization/certificate/7PA9TEXKK3I9",
  },
  {
    id: "n8n",
    title: "Build Intelligent Agents Using DeepSeek & N8N",
    issuer: "Coursera",
    credentialUrl:
      "https://coursera.org/share/772d2b91df3fb58c84347424536f5c3e",
  },
  {
    id: "angular",
    title: "Angular 17 Specialization",
    issuer: "Coursera",
    credentialUrl:
      "https://coursera.org/share/1760d56bf82009b9bb39f939c38e2e40",
  },
  {
    id: "sdlc",
    title: "Software Development Processes and Methodologies",
    issuer: "Coursera",
    credentialUrl:
      "https://coursera.org/share/c9d84b00040a0a306c13e76ee91fe97b",
  },
  {
    id: "ui",
    title: "Front-End Web UI Frameworks and Tools: Bootstrap 4",
    issuer: "Coursera",
    credentialUrl:
      "https://coursera.org/share/697d2754498cbb3d54c60213c84461ec",
  },
];
