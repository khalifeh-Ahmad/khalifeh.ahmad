export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string; // ISO-like "YYYY-MM"
  endDate: string | "Present";
  location?: string;
  employmentType?: string;
  summary?: string;
  highlights: string[];
  techStack?: string[];
}
