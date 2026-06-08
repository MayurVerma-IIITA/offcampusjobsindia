import type { Job } from "./types";

export const categories = [
  { name: "IT Jobs", slug: "it-jobs" },
  { name: "Non-IT Jobs", slug: "non-it-jobs" },
  { name: "Internships", slug: "internships" },
  { name: "Walk-ins", slug: "walk-ins" },
  { name: "Work From Home", slug: "work-from-home" },
];

export const jobs: Job[] = [
  {
    id: "job_1",
    title: "TCS Off Campus Hiring 2026 for Graduate Engineer Trainee",
    slug: "tcs-off-campus-hiring-2026-graduate-engineer-trainee",
    company: { name: "TCS", slug: "tcs", website: "https://www.tcs.com" },
    category: { name: "IT Jobs", slug: "it-jobs" },
    location: { name: "Bangalore", slug: "bangalore" },
    workMode: "Hybrid",
    experienceLevel: "Fresher",
    qualifications: ["BTech", "MCA", "BSc"],
    batches: ["2026", "2025"],
    salary: "Best in industry",
    deadline: "2026-07-15",
    applyUrl: "https://www.tcs.com/careers",
    status: "PUBLISHED",
    publishedAt: "2026-06-01",
    seoTitle: "TCS Off Campus Hiring 2026 - Graduate Engineer Trainee",
    metaDescription:
      "Apply for TCS Off Campus Hiring 2026. Check eligibility, batches, selection process, salary, and direct application link.",
    excerpt:
      "TCS is hiring fresh graduates for Graduate Engineer Trainee roles across India through its off campus hiring program.",
    articleContent:
      "TCS Off Campus Hiring 2026 is a strong opportunity for fresh graduates who want to start a career in software services, consulting, and enterprise technology. Candidates from BTech, MCA, and related technical backgrounds can review the eligibility criteria, prepare required documents, and apply through the official company careers page. The selection process generally includes an online assessment, technical discussion, and HR round. Applicants should read the official notification carefully before applying.",
  },
  {
    id: "job_2",
    title: "Infosys Internship 2026 for Software Engineering Students",
    slug: "infosys-internship-2026-software-engineering-students",
    company: { name: "Infosys", slug: "infosys", website: "https://www.infosys.com" },
    category: { name: "Internships", slug: "internships" },
    location: { name: "Remote", slug: "remote" },
    workMode: "Remote",
    experienceLevel: "Fresher",
    qualifications: ["BTech", "BCA", "MCA"],
    batches: ["2027", "2026"],
    salary: "Stipend disclosed during selection",
    deadline: "2026-08-05",
    applyUrl: "https://www.infosys.com/careers",
    status: "PUBLISHED",
    publishedAt: "2026-06-03",
    seoTitle: "Infosys Internship 2026 - Apply Online",
    metaDescription:
      "Infosys internship opportunity for 2026 and 2027 batch students. Check eligibility, skills, and direct apply link.",
    excerpt:
      "Infosys is offering internship opportunities for students interested in software engineering and enterprise technology.",
    articleContent:
      "The Infosys Internship 2026 program is intended for students who want practical exposure to software engineering, cloud, data, and enterprise delivery. Students should have strong fundamentals in programming, problem solving, communication, and teamwork. Shortlisted candidates may be evaluated through resume screening, assessments, or interviews depending on the business unit.",
  },
  {
    id: "job_3",
    title: "HDFC Bank Walk-in Drive for Operations Associate",
    slug: "hdfc-bank-walk-in-drive-operations-associate",
    company: { name: "HDFC Bank", slug: "hdfc-bank", website: "https://www.hdfcbank.com" },
    category: { name: "Walk-ins", slug: "walk-ins" },
    location: { name: "Mumbai", slug: "mumbai" },
    workMode: "Onsite",
    experienceLevel: "Any",
    qualifications: ["Graduate", "MBA"],
    batches: ["2025", "2024"],
    salary: "As per company norms",
    deadline: null,
    applyUrl: "https://www.hdfcbank.com/personal/about-us/careers",
    status: "PUBLISHED",
    publishedAt: "2026-06-05",
    seoTitle: "HDFC Bank Walk-in Drive for Operations Associate",
    metaDescription:
      "HDFC Bank walk-in drive for Operations Associate roles. Check eligibility, venue details, and application process.",
    excerpt:
      "HDFC Bank is conducting a walk-in drive for graduate candidates interested in operations and banking support roles.",
    articleContent:
      "HDFC Bank Walk-in Drive for Operations Associate is suitable for graduates who want to build a career in banking operations. Candidates should carry updated resumes, identity proof, educational documents, and any experience letters if applicable. The role may include customer support, branch operations, documentation, and internal process coordination.",
  },
];

export const articles = [
  {
    title: "How to Prepare for Off Campus Placement Drives",
    slug: "how-to-prepare-for-off-campus-placement-drives",
    excerpt:
      "A practical preparation checklist for aptitude tests, coding rounds, resumes, and interview rounds.",
  },
  {
    title: "Best Resume Format for Freshers in India",
    slug: "best-resume-format-for-freshers-india",
    excerpt:
      "What to include, what to remove, and how to make a fresher resume easier for recruiters to scan.",
  },
];
