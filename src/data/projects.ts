import type { ProjectItem } from "@/types/project";

export const projectsData: ProjectItem[] = [
  {
    id: "portfolio-v2",
    title: "Professional Portfolio Platform",
    subtitle: "Personal brand + frontend engineering showcase",
    category: "Frontend",
    featured: true,
    status: "In Progress",
    role: "Frontend Engineer / Designer",
    period: "2026",
    description:
      "A modern, performance-focused developer portfolio built with React, TypeScript, and advanced UI/visual integrations to showcase experience, skills, and projects.",
    challenge:
      "Create a portfolio that feels premium and professional while remaining fast, maintainable, and scalable for future additions (3D visuals, charts, animations, and case studies).",
    solution:
      "Designed a modular architecture with reusable UI components, token-based styling, data-driven content, and progressive enhancement for advanced features like Chart.js and Three.js.",
    result:
      "A polished portfolio foundation with modern UX patterns, scalable structure, and a production-ready path for GitHub Pages deployment.",
    techStack: [
      "React",
      "TypeScript",
      "Vite",
      "Tailwind CSS",
      "Chart.js",
      "Framer Motion",
      "Three.js",
    ],
    links: [
      { label: "GitHub", href: "#" },
      { label: "Live Demo", href: "#" },
      { label: "Case Study", href: "#" },
    ],
  },
  {
    id: "automation-workflows",
    title: "Automation Workflow Suite",
    subtitle: "Process orchestration and operational efficiency",
    category: "Automation",
    featured: true,
    status: "Private",
    role: "Technical Analyst / Automation Developer",
    period: "Recent",
    description:
      "A collection of automated workflows for operational processes, designed to reduce manual effort and improve reliability.",
    challenge:
      "Operational workflows required repeatable automation with monitoring, troubleshooting, and business-specific logic while maintaining reliability.",
    solution:
      "Implemented and optimized workflow pipelines with structured logic, validation, and iterative improvements based on real process needs.",
    result:
      "Improved process consistency and efficiency through automation-first execution and ongoing optimization.",
    techStack: [
      "N8N",
      "Automation",
      "Workflow Design",
      "Troubleshooting",
      "API Integration",
    ],
    links: [{ label: "Case Study", href: "#" }],
  },
  {
    id: "frontend-dashboard",
    title: "Data-Driven Admin Dashboard",
    subtitle: "Responsive interface for operational monitoring",
    category: "Dashboard",
    status: "Private",
    role: "Frontend Developer",
    period: "Client / Internal",
    description:
      "A responsive dashboard UI for presenting structured data, operational states, and key actions in a clean workflow-oriented interface.",
    challenge:
      "Build a scalable interface that remains readable and responsive while handling dense content and multiple screen sizes.",
    solution:
      "Developed modular components, responsive layouts, and reusable UI patterns with strong emphasis on clarity and maintainability.",
    result:
      "Delivered a dashboard experience that improved usability and supported future feature expansion through component reuse.",
    techStack: [
      "React",
      "TypeScript",
      "REST APIs",
      "Responsive UI",
      "Component Architecture",
    ],
    links: [{ label: "GitHub", href: "#" }],
  },
  {
    id: "legacy-web-modernization",
    title: "Legacy Web Interface Modernization",
    subtitle: "Performance and usability improvements",
    category: "Web App",
    status: "Completed",
    role: "Frontend Web Developer",
    period: "Production",
    description:
      "Modernized an existing web interface by improving layout responsiveness, maintainability, and user experience across key screens.",
    challenge:
      "Enhance an existing interface without disrupting business-critical functionality or introducing inconsistent UI patterns.",
    solution:
      "Refactored front-end components, improved responsive behavior, and introduced cleaner UI conventions for ongoing maintenance.",
    result:
      "Improved usability and maintainability while preserving compatibility with existing workflows and feature requirements.",
    techStack: ["JavaScript", "Angular", "HTML", "CSS", "Bootstrap"],
    links: [{ label: "Case Study", href: "#" }],
  },
];
