import type { PortfolioData } from './types';

export const defaultData: PortfolioData = {
  experience: [
    {
      id: 1,
      role: "Virtual Assistant",
      company: "AND We Support",
      duration: "2023–Present",
      description: "Applying analytical skills to solve business problems."
    }
  ],
  skills: [
    { id: 1, name: "Python", level: 90 },
    { id: 2, name: "SQL", level: 85 },
    { id: 3, name: "Power BI", level: 80 },
    { id: 4, name: "React", level: 70 },
  ],
  projects: [
    {
      id: 1,
      title: "Data Analysis Dashboard",
      description: "Built with Power BI.",
      tags: ["Power BI", "Data Visualization"],
      link: "#"
    },
    {
      id: 2,
      title: "Portfolio Website",
      description: "This very website, built with Next.js and Tailwind CSS.",
      tags: ["Next.js", "React", "Tailwind CSS"],
      link: "#"
    }
  ],
  qualifications: [
    {
      id: 1,
      title: "BCA",
      institution: "Gotham University",
      duration: "2020–2023",
      description: "Formal education began. First exposure to Python and SQL."
    }
  ]
};
