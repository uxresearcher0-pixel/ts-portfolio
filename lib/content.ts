import { sanitizeRichText } from "@/lib/rich-text";

export type Experience = {
  id: string;
  period: string;
  company: string;
  role: string;
  summary: string;
  skills: string[];
};

export type SkillGroup = { id: string; title: string; description: string };
export type Project = {
  id: string;
  title: string;
  category: string;
  summary: string;
  url: string;
  featured: boolean;
};
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
  profileImage: string;
  profileImageAlt: string;
  showAvailability: boolean;
  accentColor: string;
  seoTitle: string;
  seoDescription: string;
  experiences: Experience[];
  skills: SkillGroup[];
  education: Education[];
  projects: Project[];
  updatedAt?: string;
};

export const defaultContent: PortfolioContent = {
  name: "Taslima Akter Rumky",
  shortName: "Taslima Rumky",
  title: "UX/UI Designer",
  availability: "Available for opportunities",
  location: "Dhaka, Bangladesh",
  heroTitle: "Designing clear digital products",
  heroAccent: "for people and organizations.",
  introduction:
    "My portfolio explores public services, enterprise platforms, healthcare, recruitment, consumer applications, and design systems.",
  aboutTitle: "Product thinking across complex domains.",
  about: [
    "I’m Taslima Akter Rumky, a UX/UI designer presenting case studies across citizen services, enterprise operations, healthcare, recruitment, telecom, security, web experiences, and design systems.",
    "This portfolio brings those projects together in one place, with detailed Figma work linked as each case study becomes available."
  ],
  focus: "UX/UI & Product Design",
  approach: "Human-centred & accessible",
  email: "",
  portfolioUrl: "",
  resumeUrl: "",
  linkedinUrl: "https://www.linkedin.com/in/taslima-rumky/",
  dribbbleUrl: "",
  behanceUrl: "",
  profileImage: "",
  profileImageAlt: "Portrait of Taslima Akter Rumky",
  showAvailability: true,
  accentColor: "#6d4aff",
  seoTitle: "Taslima Akter Rumky — UX/UI Designer",
  seoDescription: "Taslima Akter Rumky’s UX/UI design portfolio, experience, skills, and education.",
  experiences: [],
  skills: [
    { id: "skill-1", title: "Product & UX design", description: "Case-study work spanning public services, enterprise systems, healthcare, recruitment, and consumer products." },
    { id: "skill-2", title: "Interface design", description: "Responsive web products, mobile applications, ERP workflows, and organization landing pages." },
    { id: "skill-3", title: "Design systems", description: "A personalized React and Flowbite-based design system for consistent product interfaces." },
    { id: "skill-4", title: "Figma prototyping", description: "Interactive product concepts and connected demonstration journeys created and presented in Figma." }
  ],
  education: [],
  projects: [
    { id: "citizen-portal", title: "Citizen Services Portal", category: "Public services", summary: "A citizen-facing digital services portal case study.", url: "", featured: true },
    { id: "crm-erp", title: "CRM & ERP System", category: "Enterprise product", summary: "An enterprise customer relationship and operations platform case study.", url: "", featured: true },
    { id: "hrms", title: "HRMS (ERP)", category: "Enterprise product", summary: "A human resource management and ERP workflow case study.", url: "", featured: true },
    { id: "doctor-appointment", title: "Doctor Appointment System", category: "Mobile · Healthcare", summary: "A mobile application case study for finding doctors and managing appointments.", url: "", featured: true },
    { id: "recruitment-ats", title: "AI-Enabled Recruitment & ATS", category: "Enterprise · AI", summary: "A connected candidate, recruiter, ATS, interview, offer, and responsible-AI product concept.", url: "https://www.figma.com/make/DIEgjYuLq8wwADpu48GlPk/AI-Enabled-Recruitment---ATS", featured: true },
    { id: "telecom-lifestyle", title: "Telecom Lifestyle App", category: "Mobile · Consumer", summary: "A telecom lifestyle mobile application case study.", url: "", featured: true },
    { id: "password-manager", title: "Password Manager", category: "Personal · Security", summary: "A personal case study focused on password-management experiences.", url: "", featured: true },
    { id: "organization-landing", title: "Organization Landing Page", category: "Web design", summary: "A concise organization landing-page experience.", url: "", featured: true },
    { id: "flowbite-design-system", title: "React & Flowbite Design System", category: "Design system", summary: "A personalized component and interface system based on React and Flowbite.", url: "", featured: true }
  ]
};

export function normalizeContent(value: Partial<PortfolioContent>): PortfolioContent {
  const safeValue = { ...value } as Partial<PortfolioContent> & Record<string, unknown>;
  delete safeValue._id;
  delete safeValue._key;
  const normalized = {
    ...defaultContent,
    ...safeValue,
    about: Array.isArray(safeValue.about) ? safeValue.about.filter(Boolean) : defaultContent.about,
    experiences: Array.isArray(safeValue.experiences) ? safeValue.experiences : defaultContent.experiences,
    skills: Array.isArray(safeValue.skills) ? safeValue.skills : defaultContent.skills,
    education: Array.isArray(safeValue.education) ? safeValue.education : defaultContent.education,
    projects: Array.isArray(safeValue.projects) ? safeValue.projects : defaultContent.projects
  };
  return {
    ...normalized,
    introduction: sanitizeRichText(normalized.introduction),
    about: normalized.about.map(sanitizeRichText),
    experiences: normalized.experiences.map(item => ({ ...item, summary: sanitizeRichText(item.summary) })),
    skills: normalized.skills.map(item => ({ ...item, description: sanitizeRichText(item.description) })),
    education: normalized.education.map(item => ({ ...item, detail: sanitizeRichText(item.detail) })),
    projects: normalized.projects.map(item => ({ ...item, summary: sanitizeRichText(item.summary) }))
  };
}
