import type { SkillCategory, SkillMetric } from "@/types/skills";

export const skillsMetrics: SkillMetric[] = [
  { label: "Frontend UI", value: 92 },
  { label: "TypeScript / JS", value: 88 },
  { label: "API Integration", value: 84 },
  { label: "Architecture", value: 82 },
  { label: "SQL / Data", value: 78 },
  { label: "Automation", value: 75 },
];

export const skillsCategories: SkillCategory[] = [
  {
    id: "frontend",
    title: "Frontend Development",
    description:
      "Modern UI development, responsive interfaces, and component-based architecture.",
    skills: [
      "React.js",
      "TypeScript",
      "JavaScript",
      "Angular",
      "HTML5",
      "CSS3",
      "Bootstrap",
      "Material UI",
    ],
  },
  {
    id: "backend-integration",
    title: "Backend & Integration",
    description:
      "Connecting frontends to APIs and building reliable data-driven features.",
    skills: ["REST APIs", "Laravel", "PHP", "Postman", "JSON"],
  },
  {
    id: "data-database",
    title: "Data & Database",
    description:
      "Working with structured data, query optimization, and backend data flows.",
    skills: ["SQL", "MySQL", "Stored Procedures", "Database Scripts"],
  },
  {
    id: "tools-workflow",
    title: "Tools & Workflow",
    description:
      "Version control, collaboration, and productivity tooling for modern teams.",
    skills: ["Git", "GitHub", "Agile", "Jira", "VS Code"],
  },
  {
    id: "automation",
    title: "Automation & Operations",
    description:
      "Workflow automation and troubleshooting for reliable business/technical processes.",
    skills: ["N8N", "Workflow Automation", "Monitoring", "Troubleshooting"],
  },
];
