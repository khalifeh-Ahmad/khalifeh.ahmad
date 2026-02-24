import { profileData } from "@/data/profile";

export interface ContactMethod {
  id: string;
  label: string;
  value: string;
  href?: string;
  description?: string;
}

export const contactMethods: ContactMethod[] = [
  {
    id: "email",
    label: "Email",
    value: profileData.email ?? "Add your public email",
    href: profileData.email ? `mailto:${profileData.email}` : undefined,
    description: "Best for job opportunities and professional inquiries.",
  },
  {
    id: "phone",
    label: "Phone",
    value: profileData.phone ?? "Optional",
    href: profileData.phone
      ? `tel:${profileData.phone.replace(/\s+/g, "")}`
      : undefined,
    description: "Available for direct communication when needed.",
  },
  {
    id: "location",
    label: "Location",
    value: profileData.location ?? "Remote",
    description: "Open to remote collaboration and opportunities.",
  },
];

export const contactLinks = [
  {
    id: "linkedin",
    label: "LinkedIn",
    href: profileData.linkedin || "#",
    description: "Professional profile and networking",
  },
  {
    id: "github",
    label: "GitHub",
    href: profileData.github || "#",
    description: "Code repositories and technical work",
  },
] as const;
