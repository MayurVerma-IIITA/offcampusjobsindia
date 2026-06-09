"use server";

import { JobStatus, UserRole } from "@prisma/client";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { saveSiteSettings } from "@/lib/settings";
import { getStorageBucket, getSupabaseServiceClient } from "@/lib/supabase";
import { slugify } from "@/lib/utils";

function requireDb() {
  const prisma = getPrisma();

  if (!prisma) {
    throw new Error("DATABASE_URL is required for admin mutations.");
  }

  return prisma;
}

function text(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

const jobSchema = z.object({
  title: z.string().min(5),
  slug: z.string().min(3),
  company: z.string().min(1),
  location: z.string().min(1),
  category: z.string().min(1),
  qualifications: z.array(z.string()).min(1),
  batches: z.array(z.string()).min(1),
  workMode: z.enum(["REMOTE", "HYBRID", "ONSITE"]),
  experienceLevel: z.enum(["FRESHER", "EXPERIENCED", "ANY"]),
  salary: z.string().optional(),
  deadline: z.string().optional(),
  applyUrl: z.string().url(),
  featuredImage: z.string().optional(),
  seoTitle: z.string().min(5),
  metaDescription: z.string().min(20),
  excerpt: z.string().min(20),
  articleContent: z.string().min(50),
  status: z.enum(["DRAFT", "PUBLISHED", "EXPIRED", "ARCHIVED"]),
});

function parseCsv(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function upsertTaxonomies(prisma: ReturnType<typeof requireDb>, data: z.infer<typeof jobSchema>) {
  const [company, location, category] = await Promise.all([
    prisma.company.upsert({
      where: { slug: slugify(data.company) },
      update: { name: data.company },
      create: { name: data.company, slug: slugify(data.company) },
    }),
    prisma.location.upsert({
      where: { slug: slugify(data.location) },
      update: { name: data.location },
      create: { name: data.location, slug: slugify(data.location) },
    }),
    prisma.category.upsert({
      where: { slug: slugify(data.category) },
      update: { name: data.category },
      create: { name: data.category, slug: slugify(data.category) },
    }),
  ]);

  const qualifications = await Promise.all(
    data.qualifications.map((name) =>
      prisma.qualification.upsert({
        where: { slug: slugify(name) },
        update: { name },
        create: { name, slug: slugify(name) },
      }),
    ),
  );

  const batches = await Promise.all(
    data.batches.map((year) =>
      prisma.batch.upsert({
        where: { slug: slugify(year) },
        update: { year },
        create: { year, slug: slugify(year) },
      }),
    ),
  );

  return { company, location, category, qualifications, batches };
}

export async function saveJobAction(formData: FormData) {
  const user = await requireUser();
  const prisma = requireDb();
  const id = text(formData, "id");
  const parsed = jobSchema.safeParse({
    title: text(formData, "title"),
    slug: slugify(text(formData, "slug") || text(formData, "title")),
    company: text(formData, "company"),
    location: text(formData, "location"),
    category: text(formData, "category"),
    qualifications: parseCsv(text(formData, "qualifications")),
    batches: parseCsv(text(formData, "batches")),
    workMode: text(formData, "workMode"),
    experienceLevel: text(formData, "experienceLevel"),
    salary: text(formData, "salary"),
    deadline: text(formData, "deadline"),
    applyUrl: text(formData, "applyUrl"),
    featuredImage: text(formData, "featuredImage"),
    seoTitle: text(formData, "seoTitle"),
    metaDescription: text(formData, "metaDescription"),
    excerpt: text(formData, "excerpt"),
    articleContent: text(formData, "articleContent"),
    status: text(formData, "status") || "DRAFT",
  });

  if (!parsed.success) {
    redirect(`/admin/jobs/new?error=invalid`);
  }

  const data = parsed.data;
  const taxonomy = await upsertTaxonomies(prisma, data);
  const publishedAt = data.status === "PUBLISHED" ? new Date() : null;

  if (id) {
    await prisma.job.update({
      where: { id },
      data: {
        title: data.title,
        slug: data.slug,
        companyId: taxonomy.company.id,
        locationId: taxonomy.location.id,
        categoryId: taxonomy.category.id,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel,
        salary: data.salary || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        applyUrl: data.applyUrl,
        featuredImage: data.featuredImage || null,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        excerpt: data.excerpt,
        articleContent: data.articleContent,
        status: data.status,
        publishedAt: data.status === "PUBLISHED" ? publishedAt : null,
        qualifications: {
          deleteMany: {},
          create: taxonomy.qualifications.map((qualification) => ({
            qualificationId: qualification.id,
          })),
        },
        batches: {
          deleteMany: {},
          create: taxonomy.batches.map((batch) => ({ batchId: batch.id })),
        },
      },
    });
  } else {
    await prisma.job.create({
      data: {
        title: data.title,
        slug: data.slug,
        companyId: taxonomy.company.id,
        locationId: taxonomy.location.id,
        categoryId: taxonomy.category.id,
        workMode: data.workMode,
        experienceLevel: data.experienceLevel,
        salary: data.salary || null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        applyUrl: data.applyUrl,
        featuredImage: data.featuredImage || null,
        seoTitle: data.seoTitle,
        metaDescription: data.metaDescription,
        excerpt: data.excerpt,
        articleContent: data.articleContent,
        status: data.status,
        publishedAt,
        authorId: user.sub,
        qualifications: {
          create: taxonomy.qualifications.map((qualification) => ({
            qualificationId: qualification.id,
          })),
        },
        batches: {
          create: taxonomy.batches.map((batch) => ({ batchId: batch.id })),
        },
      },
    });
  }

  revalidatePath("/");
  revalidatePath("/jobs");
  revalidatePath("/admin");
  redirect("/admin");
}

export async function deleteJobAction(formData: FormData) {
  await requireUser();
  const prisma = requireDb();
  const id = text(formData, "id");

  if (id) {
    await prisma.job.update({ where: { id }, data: { status: JobStatus.ARCHIVED } });
  }

  revalidatePath("/admin");
}

export async function updateJobStatusAction(id: string, status: JobStatus) {
  await requireUser();
  const prisma = requireDb();

  await prisma.job.update({
    where: { id },
    data: { 
      status,
      publishedAt: status === "PUBLISHED" ? new Date() : undefined,
    },
  });

  revalidatePath("/admin");
  revalidatePath("/jobs");
}

export async function expireJobsAction() {
  await requireUser();
  const prisma = requireDb();

  await prisma.job.updateMany({
    where: {
      status: "PUBLISHED",
      deadline: { lt: new Date() },
    },
    data: { status: "EXPIRED" },
  });

  revalidatePath("/admin");
  revalidatePath("/jobs");
}

export async function saveSettingsAction(formData: FormData) {
  await requireUser();

  await saveSiteSettings({
    telegramUrl: text(formData, "telegramUrl"),
    googleAnalyticsId: text(formData, "googleAnalyticsId"),
    posthogKey: text(formData, "posthogKey"),
    posthogHost: text(formData, "posthogHost"),
    adsenseSidebar: text(formData, "adsenseSidebar"),
    adsenseInsideArticle: text(formData, "adsenseInsideArticle"),
    adsenseAfterArticle: text(formData, "adsenseAfterArticle"),
    internalLinkingEnabled: formData.get("internalLinkingEnabled") === "on",
  });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function createEditorAction(formData: FormData) {
  const user = await requireUser();

  if (user.role !== "ADMIN") {
    redirect("/admin/users?error=forbidden");
  }

  const prisma = requireDb();
  const email = text(formData, "email").toLowerCase();
  const name = text(formData, "name") || email;
  const password = text(formData, "password");
  const role = text(formData, "role") === "ADMIN" ? UserRole.ADMIN : UserRole.EDITOR;

  if (!email || password.length < 12) {
    redirect("/admin/users?error=invalid");
  }

  await prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: {
      email,
      name,
      role,
      passwordHash: await bcrypt.hash(password, 12),
    },
  });

  revalidatePath("/admin/users");
  redirect("/admin/users?saved=1");
}

export async function uploadFeaturedImageAction(formData: FormData) {
  await requireUser();
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    redirect("/admin/media?error=file");
  }

  const supabase = getSupabaseServiceClient();

  if (!supabase) {
    redirect("/admin/media?error=supabase");
  }

  const extension = file.name.split(".").pop() || "jpg";
  const path = `jobs/${Date.now()}-${slugify(file.name.replace(/\.[^.]+$/, ""))}.${extension}`;
  const { error } = await supabase.storage
    .from(getStorageBucket())
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) {
    redirect("/admin/media?error=upload");
  }

  redirect(`/admin/media?path=${encodeURIComponent(path)}`);
}

export async function saveArticleAction(formData: FormData) {
  await requireUser();
  const prisma = requireDb();
  const title = text(formData, "title");
  const slug = slugify(text(formData, "slug") || title);
  const excerpt = text(formData, "excerpt");
  const content = text(formData, "content");
  const seoTitle = text(formData, "seoTitle") || title;
  const metaDescription = text(formData, "metaDescription") || excerpt;
  const published = formData.get("published") === "on";

  if (!title || !slug || !excerpt || !content) {
    redirect("/admin/articles?error=invalid");
  }

  await prisma.article.upsert({
    where: { slug },
    update: {
      title,
      excerpt,
      content,
      seoTitle,
      metaDescription,
      publishedAt: published ? new Date() : null,
    },
    create: {
      title,
      slug,
      excerpt,
      content,
      seoTitle,
      metaDescription,
      publishedAt: published ? new Date() : null,
    },
  });

  revalidatePath("/");
  revalidatePath("/career-hub");
  redirect("/admin/articles?saved=1");
}

export async function createTaxonomyAction(formData: FormData) {
  await requireUser();
  const prisma = requireDb();
  const type = text(formData, "type");
  const name = text(formData, "name");

  if (!name) {
    redirect("/admin/taxonomy?error=invalid");
  }

  const slug = slugify(text(formData, "slug") || name);

  if (type === "company") {
    await prisma.company.upsert({
      where: { slug },
      update: {
        name,
        website: text(formData, "website") || null,
        about: text(formData, "description") || null,
      },
      create: {
        name,
        slug,
        website: text(formData, "website") || null,
        about: text(formData, "description") || null,
      },
    });
  } else if (type === "category") {
    await prisma.category.upsert({
      where: { slug },
      update: { name, description: text(formData, "description") || null },
      create: { name, slug, description: text(formData, "description") || null },
    });
  } else if (type === "location") {
    await prisma.location.upsert({
      where: { slug },
      update: { name, state: text(formData, "state") || null },
      create: { name, slug, state: text(formData, "state") || null },
    });
  } else if (type === "qualification") {
    await prisma.qualification.upsert({
      where: { slug },
      update: { name },
      create: { name, slug },
    });
  } else if (type === "batch") {
    await prisma.batch.upsert({
      where: { slug },
      update: { year: name },
      create: { year: name, slug },
    });
  }

  revalidatePath("/admin/taxonomy");
  revalidatePath("/jobs");
  redirect("/admin/taxonomy?saved=1");
}

export async function renameTaxonomyAction(formData: FormData) {
  await requireUser();
  const prisma = requireDb();
  const type = text(formData, "type");
  const oldSlug = text(formData, "oldSlug");
  const newName = text(formData, "newName");

  if (!newName || !oldSlug) return;

  const newSlug = slugify(newName);

  try {
    if (type === "companies") {
      await prisma.company.update({ where: { slug: oldSlug }, data: { name: newName, slug: newSlug } });
    } else if (type === "categories") {
      await prisma.category.update({ where: { slug: oldSlug }, data: { name: newName, slug: newSlug } });
    } else if (type === "locations") {
      await prisma.location.update({ where: { slug: oldSlug }, data: { name: newName, slug: newSlug } });
    } else if (type === "qualifications") {
      await prisma.qualification.update({ where: { slug: oldSlug }, data: { name: newName, slug: newSlug } });
    } else if (type === "batches") {
      await prisma.batch.update({ where: { slug: oldSlug }, data: { year: newName, slug: newSlug } });
    }
  } catch (e) {
    // If slug collision, ignore or handle gracefully
    console.error(e);
  }

  revalidatePath("/admin/taxonomy");
  revalidatePath("/jobs");
}
