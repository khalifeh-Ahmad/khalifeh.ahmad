export interface SkillCategory {
  id: string;
  title: string;
  description: string;
  skills: string[];
}

export interface SkillMetric {
  label: string;
  value: number; // 0-100 visual strength indicator (portfolio display metric)
}
