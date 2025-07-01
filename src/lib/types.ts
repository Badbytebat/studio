export interface Experience {
  id: number;
  role: string;
  company: string;
  duration: string;
  description: string;
}

export interface Skill {
  id: number;
  name: string;
  level: number;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  tags: string[];
  link: string;
}

export interface Qualification {
  id: number;
  type: 'education' | 'certification';
  title: string;
  institution: string;
  duration: string;
  description: string;
}

export interface PortfolioData {
  experience: Experience[];
  skills: Skill[];
  projects: Project[];
  qualifications: Qualification[];
}
