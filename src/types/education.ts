export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  location?: string;
  description?: string;
}

export interface CertificationItem {
  id: string;
  title: string;
  issuer: string;
  year?: string;
  credentialUrl?: string;
}
