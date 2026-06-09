import { Prisma, ExperienceLevel, JobStatus, WorkMode } from "@prisma/client";
import { jobs as sampleJobs, categories as sampleCategories } from "./sample-data";
import { getPrisma } from "./prisma";
import type { Job, JobFilters, PaginatedJobs, Taxonomy } from "./types";

const includeJobRelations = {
  company: true,
  location: true,
  category: true,
  qualifications: { include: { qualification: true } },
  batches: { include: { batch: true } },
} satisfies Prisma.JobInclude;

type PrismaJob = Prisma.JobGetPayload<{ include: typeof includeJobRelations }>;

function enumToLabel(value: string) {
  return value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function toWorkMode(value: string): WorkMode | undefined {
  const normalized = value.toUpperCase();
  if (normalized === "REMOTE" || normalized === "HYBRID" || normalized === "ONSITE") {
    return normalized;
  }
  return undefined;
}

function toExperience(value: string): ExperienceLevel | undefined {
  const normalized = value.toUpperCase();
  if (
    normalized === "FRESHER" ||
    normalized === "EXPERIENCED" ||
    normalized === "ANY"
  ) {
    return normalized;
  }
  return undefined;
}

function toStatus(value: string): JobStatus | undefined {
  const normalized = value.toUpperCase();
  if (
    normalized === "DRAFT" ||
    normalized === "PUBLISHED" ||
    normalized === "EXPIRED" ||
    normalized === "ARCHIVED"
  ) {
    return normalized;
  }
  return undefined;
}

function mapPrismaJob(job: PrismaJob): Job {
  const isExpired =
    job.status === "PUBLISHED" &&
    job.deadline !== null &&
    job.deadline.getTime() < Date.now();

  return {
    id: job.id,
    title: job.title,
    slug: job.slug,
    company: {
      name: job.company.name,
      slug: job.company.slug,
      website: job.company.website || undefined,
    },
    category: { name: job.category.name, slug: job.category.slug },
    location: { name: job.location.name, slug: job.location.slug },
    workMode: enumToLabel(job.workMode) as Job["workMode"],
    experienceLevel: enumToLabel(job.experienceLevel) as Job["experienceLevel"],
    qualifications: job.qualifications.map((item) => item.qualification.name),
    batches: job.batches.map((item) => item.batch.year),
    salary: job.salary,
    deadline: job.deadline?.toISOString() || null,
    applyUrl: job.applyUrl,
    featuredImage: job.featuredImage,
    status: isExpired ? "EXPIRED" : job.status,
    publishedAt: job.publishedAt?.toISOString() || null,
    seoTitle: job.seoTitle,
    metaDescription: job.metaDescription,
    excerpt: job.excerpt,
    articleContent: job.articleContent,
  };
}

function sampleFilter(filters: JobFilters = {}): Job[] {
  const query = filters.query?.toLowerCase().trim();

  return sampleJobs.filter((job) => {
    const searchable = [
      job.title,
      job.company.name,
      job.location.name,
      job.category.name,
      job.workMode,
      job.experienceLevel,
      ...job.qualifications,
      ...job.batches,
    ]
      .join(" ")
      .toLowerCase();

    return (
      job.status !== "ARCHIVED" &&
      (filters.status === "ALL" || (filters.status ? job.status === filters.status.toUpperCase() : job.status === "PUBLISHED")) &&
      (!query || searchable.includes(query)) &&
      (!filters.category || job.category.slug === filters.category) &&
      (!filters.company || job.company.slug === filters.company) &&
      (!filters.qualification ||
        job.qualifications.some(
          (item) => item.toLowerCase() === filters.qualification?.toLowerCase(),
        )) &&
      (!filters.batch || job.batches.includes(filters.batch)) &&
      (!filters.location || job.location.slug === filters.location) &&
      (!filters.experience ||
        job.experienceLevel.toLowerCase() === filters.experience.toLowerCase()) &&
      (!filters.workMode ||
        job.workMode.toLowerCase() === filters.workMode.toLowerCase())
    );
  });
}

export async function getJobs(filters: JobFilters = {}): Promise<Job[]> {
  return (await getPaginatedJobs(filters)).jobs;
}

export async function getPaginatedJobs(filters: JobFilters = {}): Promise<PaginatedJobs> {
  const page = Math.max(filters.page || 1, 1);
  const pageSize = Math.min(Math.max(filters.pageSize || 12, 1), 50);
  const prisma = getPrisma();

  if (!prisma) {
    const filtered = sampleFilter(filters);
    const start = (page - 1) * pageSize;
    const paginated = filtered.slice(start, start + pageSize);

    return {
      jobs: paginated,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.max(Math.ceil(filtered.length / pageSize), 1),
    };
  }

  const search = filters.query?.trim();
  const where: Prisma.JobWhereInput = {
    status: filters.status === "ALL" ? { not: "ARCHIVED" } : (filters.status ? toStatus(filters.status) : "PUBLISHED"),
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.company ? { company: { slug: filters.company } } : {}),
    ...(filters.location ? { location: { slug: filters.location } } : {}),
    ...(filters.workMode && toWorkMode(filters.workMode)
      ? { workMode: toWorkMode(filters.workMode) }
      : {}),
    ...(filters.experience && toExperience(filters.experience)
      ? { experienceLevel: toExperience(filters.experience) }
      : {}),
    ...(filters.qualification
      ? {
          qualifications: {
            some: { qualification: { slug: filters.qualification.toLowerCase() } },
          },
        }
      : {}),
    ...(filters.batch
      ? { batches: { some: { batch: { slug: filters.batch } } } }
      : {}),
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { company: { name: { contains: search, mode: "insensitive" } } },
            { location: { name: { contains: search, mode: "insensitive" } } },
            {
              qualifications: {
                some: {
                  qualification: { name: { contains: search, mode: "insensitive" } },
                },
              },
            },
          ],
        }
      : {}),
  };

  const [rows, total] = await Promise.all([
    prisma.job.findMany({
      where,
      include: includeJobRelations,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.job.count({ where }),
  ]);

  return {
    jobs: rows.map(mapPrismaJob),
    total,
    page,
    pageSize,
    totalPages: Math.max(Math.ceil(total / pageSize), 1),
  };
}

export async function getLatestJobs(limit = 12) {
  return (await getPaginatedJobs({ pageSize: limit, status: "PUBLISHED" })).jobs;
}

export async function getJobBySlug(slug: string) {
  const prisma = getPrisma();

  if (!prisma) {
    return sampleJobs.find((job) => job.slug === slug) || null;
  }

  const row = await prisma.job.findUnique({
    where: { slug },
    include: includeJobRelations,
  });

  return row ? mapPrismaJob(row) : null;
}

export async function getRelatedJobs(job: Job, limit = 6) {
  const prisma = getPrisma();

  if (!prisma) {
    return sampleJobs
      .filter(
        (item) =>
          item.id !== job.id &&
          (item.company.slug === job.company.slug ||
            item.location.slug === job.location.slug ||
            item.category.slug === job.category.slug ||
            item.batches.some((batch) => job.batches.includes(batch)) ||
            item.qualifications.some((q) => job.qualifications.includes(q))),
      )
      .slice(0, limit);
  }

  const rows = await prisma.job.findMany({
    where: {
      id: { not: job.id },
      status: "PUBLISHED",
      OR: [
        { company: { slug: job.company.slug } },
        { location: { slug: job.location.slug } },
        { category: { slug: job.category.slug } },
        { batches: { some: { batch: { year: { in: job.batches } } } } },
        {
          qualifications: {
            some: { qualification: { name: { in: job.qualifications } } },
          },
        },
      ],
    },
    include: includeJobRelations,
    take: limit,
    orderBy: { publishedAt: "desc" },
  });

  return rows.map(mapPrismaJob);
}

export async function getTaxonomies() {
  const prisma = getPrisma();

  if (!prisma) {
    return {
      categories: sampleCategories,
      companies: uniqueTaxonomy(sampleJobs.map((job) => job.company)),
      qualifications: uniqueTaxonomy(
        sampleJobs.flatMap((job) =>
          job.qualifications.map((name) => ({ name, slug: name.toLowerCase() })),
        ),
      ),
      batches: uniqueTaxonomy(
        sampleJobs.flatMap((job) => job.batches.map((year) => ({ name: year, slug: year }))),
      ),
      locations: uniqueTaxonomy(sampleJobs.map((job) => job.location)),
    };
  }

  const [categories, companies, qualifications, batches, locations] =
    await Promise.all([
      prisma.category.findMany({ orderBy: { name: "asc" } }),
      prisma.company.findMany({ orderBy: { name: "asc" } }),
      prisma.qualification.findMany({ orderBy: { name: "asc" } }),
      prisma.batch.findMany({ orderBy: { year: "desc" } }),
      prisma.location.findMany({ orderBy: { name: "asc" } }),
    ]);

  return {
    categories: categories.map(toTaxonomy),
    companies: companies.map(toTaxonomy),
    qualifications: qualifications.map(toTaxonomy),
    batches: batches.map((batch) => ({ name: batch.year, slug: batch.slug })),
    locations: locations.map(toTaxonomy),
  };
}

function toTaxonomy(item: { name: string; slug: string }): Taxonomy {
  return { name: item.name, slug: item.slug };
}

function uniqueTaxonomy(items: Taxonomy[]) {
  return Array.from(new Map(items.map((item) => [item.slug, item])).values());
}
