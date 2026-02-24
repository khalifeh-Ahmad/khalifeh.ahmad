export interface ExperienceItem {
  id: string;
  company: string;
  role: string;
  startDate: string; // e.g. "2023-10"
  endDate: string | "Present";
  location?: string;
  employmentType?: string;
  highlights: string[];
  techStack?: string[];
}
