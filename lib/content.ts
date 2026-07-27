export type Experience = {
  id: string;
  period: string;
  company: string;
  role: string;
  summary: string;
  skills: string[];
};

export type SkillGroup = { id: string; title: string; description: string };
export type Education = {
  id: string;
  year: string;
  qualification: string;
  institution: string;
  detail: string;
};

export type PortfolioContent = {
  name: string;
  shortName: string;
  title: string;
  availability: string;
  location: string;
  heroTitle: string;
  heroAccent: string;
  introduction: string;
  aboutTitle: string;
  about: string[];
  focus: string;
  approach: string;
  email: string;
  portfolioUrl: string;
  resumeUrl: string;
  linkedinUrl: string;
  dribbbleUrl: string;
  behanceUrl: string;
  experiences: Experience[];
  skills: SkillGroup[];
  education: Education[];
  updatedAt?: string;
};

export const defaultContent: PortfolioContent = {
  name: "Taslima Akter Rumky",
  shortName: "Taslima Rumky",
  title: "UX/UI Designer",
  availability: "Available for opportunities",
  location: "Dhaka, Bangladesh",
  heroTitle: "Designing thoughtful experiences",
  heroAccent: "people can use with confidence.",
  introduction:
    "I turn complex ideas into clear, accessible, and visually considered digital products.",
  aboutTitle: "Clear thinking, purposeful design.",
  about: [
    "I’m a UX/UI designer interested in creating useful digital experiences that balance user needs, business goals, and technical reality.",
    "My work spans research, user flows, wireframes, interface design, prototyping, and design handoff. I value clarity, inclusion, and steady collaboration throughout the product process."
  ],
  focus: "UX/UI & Product Design",
  approach: "Human-centred & accessible",
  email: "email@example.com",
  portfolioUrl: "",
  resumeUrl: "",
  linkedinUrl: "https://www.linkedin.com/in/taslima-rumky/",
  dribbbleUrl: "",
  behanceUrl: "",
  experiences: [
    {
      id: "experience-1",
      period: "Add period",
      company: "Add company",
      role: "UX/UI Designer",
      summary: "Replace this entry with verified résumé details in the admin panel.",
      skills: ["Product design", "Prototyping", "Design systems"]
    }
  ],
  skills: [
    { id: "skill-1", title: "UX strategy", description: "User flows, information architecture, journey mapping, and problem framing." },
    { id: "skill-2", title: "Research", description: "Discovery, interviews, competitive review, usability testing, and synthesis." },
    { id: "skill-3", title: "Interface design", description: "Wireframes, responsive UI, prototyping, interaction states, and handoff." },
    { id: "skill-4", title: "Tools", description: "Figma, FigJam, Adobe Creative Suite, Dribbble, Behance, and collaboration tools." }
  ],
  education: [
    { id: "education-1", year: "Add year", qualification: "Add qualification", institution: "Add institution", detail: "Add subject or specialization" }
  ]
};

export function normalizeContent(value: Partial<PortfolioContent>): PortfolioContent {
  return {
    ...defaultContent,
    ...value,
    about: Array.isArray(value.about) ? value.about.filter(Boolean) : defaultContent.about,
    experiences: Array.isArray(value.experiences) ? value.experiences : defaultContent.experiences,
    skills: Array.isArray(value.skills) ? value.skills : defaultContent.skills,
    education: Array.isArray(value.education) ? value.education : defaultContent.education
  };
}
