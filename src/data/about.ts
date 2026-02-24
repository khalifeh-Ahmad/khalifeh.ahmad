export interface AboutPillar {
  title: string;
  description: string;
}

export interface AboutHighlight {
  label: string;
  value: string;
}

export const aboutIntro = {
  title:
    "I build front-end experiences that are fast, scalable, and easy to maintain.",
  paragraphs: [
    "I am a frontend-focused software developer with experience building responsive web interfaces, scalable front-end architectures, and user-friendly product experiences using modern JavaScript frameworks.",
    "My work combines UI implementation, API integration, maintainable code structure, and collaboration with analysts, designers, and backend developers to deliver reliable solutions.",
    "I care deeply about clean architecture, usability, and performance — and I continuously improve my workflow by learning modern tools and techniques.",
  ],
};

export const aboutPillars: AboutPillar[] = [
  {
    title: "Frontend Engineering",
    description:
      "Building reusable UI components, responsive layouts, and scalable front-end architecture with React, TypeScript, and Angular.",
  },
  {
    title: "Product & UX Mindset",
    description:
      "Translating requirements into user-friendly interfaces with attention to usability, clarity, and long-term maintainability.",
  },
  {
    title: "Integration & Reliability",
    description:
      "Working with APIs, data flows, and testing/validation to ensure features are robust, performant, and production-ready.",
  },
];

export const aboutHighlights: AboutHighlight[] = [
  { label: "Experience", value: "5+ Years" },
  { label: "Primary Focus", value: "Frontend Development" },
  { label: "Frameworks", value: "React, Angular" },
  { label: "Languages", value: "TypeScript, JavaScript, SQL" },
];
