export interface ProjectLink {
  label: "Live Demo" | "GitHub" | "Case Study";
  href: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  subtitle?: string;
  category:
    | "Web App"
    | "Dashboard"
    | "Frontend"
    | "Automation"
    | "Internal Tool";
  featured?: boolean;
  status?: "Completed" | "In Progress" | "Private";
  role: string;
  period?: string;
  description: string;
  challenge: string;
  solution: string;
  result: string;
  techStack: string[];
  links: ProjectLink[];
  image:string
}
