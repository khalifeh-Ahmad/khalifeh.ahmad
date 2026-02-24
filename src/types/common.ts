export type SectionId =
  | "hero"
  | "about"
  | "experience"
  | "skills"
  | "projects"
  | "education"
  | "contact";

export interface NavItem {
  id: SectionId;
  label: string;
  href: `#${SectionId}`;
}
