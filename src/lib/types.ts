export type Taxonomy = {
  name: string;
  slug: string;
  website?: string;
};

export type Job = {
  id: string;
  title: string;
  slug: string;
  company: Taxonomy;
  category: Taxonomy;
  location: Taxonomy;
  workMode: "Remote" | "Hybrid" | "Onsite";
  experienceLevel: "Fresher" | "Experienced" | "Any";
  qualifications: string[];
  batches: string[];
  salary?: string | null;
  deadline?: string | null;
  applyUrl: string;
  status: "DRAFT" | "PUBLISHED" | "EXPIRED" | "ARCHIVED";
  publishedAt?: string | null;
  seoTitle: string;
  metaDescription: string;
  excerpt: string;
  articleContent: string;
};

export type JobFilters = {
  query?: string;
  category?: string;
  company?: string;
  qualification?: string;
  batch?: string;
  location?: string;
  experience?: string;
  workMode?: string;
  status?: string;
  page?: number;
  pageSize?: number;
};

export type PaginatedJobs = {
  jobs: Job[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

export type SiteSettings = {
  telegramUrl: string;
  googleAnalyticsId?: string;
  posthogKey?: string;
  posthogHost?: string;
  adsenseSidebar?: string;
  adsenseInsideArticle?: string;
  adsenseAfterArticle?: string;
  internalLinkingEnabled: boolean;
};

export type Article = {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content?: string;
  seoTitle?: string;
  metaDescription?: string;
  publishedAt?: string | null;
};
