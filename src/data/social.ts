import { profileData } from "@/data/profile";

export const socialLinks = [
  {
    label: "Email",
    href: profileData.email ? `mailto:${profileData.email}` : "#contact",
    shortLabel: "Email",
  },
  {
    label: "LinkedIn",
    href: profileData.linkedin || "#",
    shortLabel: "LinkedIn",
  },
  {
    label: "GitHub",
    href: profileData.github || "#",
    shortLabel: "GitHub",
  },
] as const;
