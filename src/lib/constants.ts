import type { NavItem } from "../types/common";

export const APP_CONFIG = {
  siteName: "Khalifeh Ahmad Portfolio",
  siteDescription:
    "Professional Front-End Developer Portfolio built with React + TypeScript",
} as const;

export const NAV_ITEMS: NavItem[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "experience", label: "Experience", href: "#experience" },
  { id: "skills", label: "Skills", href: "#skills" },
  // { id: "projects", label: "Projects", href: "#projects" },
  { id: "education", label: "Education", href: "#education" },
  { id: "contact", label: "Contact", href: "#contact" },
];
