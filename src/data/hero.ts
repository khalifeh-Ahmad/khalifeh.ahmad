export interface HeroStat {
  label: string;
  value: string;
  hint?: string;
}

export const heroStats: HeroStat[] = [
  {
    label: "Experience",
    value: "5+ Years",
    hint: "Frontend & web development",
  },
  {
    label: "Core Stack",
    value: "React + TS",
    hint: "Modern scalable UI development",
  },
  {
    label: "Focus",
    value: "UX & Performance",
    hint: "Responsive, maintainable interfaces",
  },
];
