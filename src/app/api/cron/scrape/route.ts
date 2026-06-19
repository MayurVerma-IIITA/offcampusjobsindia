import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { scraperTargets } from "@/lib/scraper-targets";
import { generateJobDraft } from "@/app/api/ai/generate-job/route";
import { slugify } from "@/lib/utils";
import type { AiDraft } from "@/components/admin/ai-generate-panel";

// Define shapes of ATS responses we care about
interface GreenhouseJob {
  absolute_url: string;
  internal_job_id: number;
  location: { name: string };
  metadata: unknown[];
  id: number;
  updated_at: string;
  requisition_id: string;
  title: string;
}

interface LeverJob {
  id: string;
  text: string;
  hostedUrl: string;
  categories: { location: string };
  createdAt: number;
}

export const maxDuration = 300; // Allows cron to run for 5 minutes (Vercel Pro)

function formatAiDraftToMarkdown(draft: AiDraft) {
  const s = draft.sections;
  const articleParts: string[] = [];

  if (s.jobSummary) articleParts.push(`## Job Summary\n\n${s.jobSummary}`);
  if (s.overview) articleParts.push(`## Overview\n\n${s.overview}`);
  if (s.keyResponsibilities?.length) {
    articleParts.push(`## Key Responsibilities\n\n${s.keyResponsibilities.map((r) => `- ${r}`).join("\n")}`);
  }
  if (s.eligibility) articleParts.push(`## Eligibility\n\n${s.eligibility}`);
  if (s.requiredSkills?.length) {
    articleParts.push(`## Required Skills\n\n${s.requiredSkills.map((sk) => `- ${sk}`).join("\n")}`);
  }
  if (s.benefits?.length) {
    articleParts.push(`## Benefits\n\n${s.benefits.map((b) => `- ${b}`).join("\n")}`);
  }
  if (s.selectionProcess) articleParts.push(`## Selection Process\n\n${s.selectionProcess}`);
  if (s.howToApply) articleParts.push(`## How To Apply\n\n${s.howToApply}`);
  if (s.faq?.length) {
    const faqText = s.faq.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n");
    articleParts.push(`## FAQ\n\n${faqText}`);
  }

  return articleParts.join("\n\n");
}

async function fetchGreenhouseJobs(slug: string): Promise<GreenhouseJob[]> {
  const res = await fetch(`https://boards-api.greenhouse.io/v1/boards/${slug}/jobs?content=true`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data.jobs || [];
}

async function fetchLeverJobs(slug: string): Promise<LeverJob[]> {
  const res = await fetch(`https://api.lever.co/v0/postings/${slug}?mode=json`, { cache: 'no-store' });
  if (!res.ok) return [];
  const data = await res.json();
  return data || [];
}

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const prisma = getPrisma();
  if (!prisma) {
    return NextResponse.json({ error: "No DB connection" }, { status: 500 });
  }

  const results = {
    totalScraped: 0,
    newJobsAdded: 0,
    skippedDuplicates: 0,
    errors: 0,
  };

  for (const target of scraperTargets) {
    let rawJobs: { title: string; applyUrl: string; locationText: string }[] = [];

    try {
      if (target.type === "greenhouse") {
        const jobs = await fetchGreenhouseJobs(target.slug);
        rawJobs = jobs.map((j) => ({
          title: j.title,
          applyUrl: j.absolute_url,
          locationText: j.location.name,
        }));
      } else if (target.type === "lever") {
        const jobs = await fetchLeverJobs(target.slug);
        rawJobs = jobs.map((j) => ({
          title: j.text,
          applyUrl: j.hostedUrl,
          locationText: j.categories.location,
        }));
      }

      // Filter for roles relevant to India/Remote
      rawJobs = rawJobs.filter(
        (j) =>
          j.locationText.toLowerCase().includes("india") ||
          j.locationText.toLowerCase().includes("remote") ||
          j.locationText.toLowerCase().includes("bangalore") ||
          j.locationText.toLowerCase().includes("bengaluru") ||
          j.locationText.toLowerCase().includes("hyderabad") ||
          j.locationText.toLowerCase().includes("pune") ||
          j.locationText.toLowerCase().includes("mumbai") ||
          j.locationText.toLowerCase().includes("noida") ||
          j.locationText.toLowerCase().includes("gurgaon")
      );

      results.totalScraped += rawJobs.length;

      const seniorKeywords = [
        "senior", "sr", "sr.", "lead", "staff", "principal", "manager", 
        "director", "vp", "head", "architect", "ii", "iii"
      ];

      for (const rawJob of rawJobs) {
        // Pre-Filter: Discard senior roles instantly based on title
        if (seniorKeywords.some(kw => rawJob.title.toLowerCase().split(/[^a-z]/).includes(kw))) {
          continue;
        }

        // Deduplication Check
        const existing = await prisma.job.findFirst({
          where: { applyUrl: rawJob.applyUrl },
        });

        if (existing) {
          results.skippedDuplicates++;
          continue;
        }

        // It's a new job! Let's pass it to Gemini
        try {
          const aiDraft = await generateJobDraft({ careerUrl: rawJob.applyUrl });
          
          if (!aiDraft) {
            results.errors++;
            continue;
          }

          // Post-Filter: Check if Gemini flagged this as requiring too much experience
          if (aiDraft.isFresherEligible === false) {
             continue; // Discard!
          }

          const articleContent = formatAiDraftToMarkdown(aiDraft as AiDraft);

          // Upsert taxonomies (Company, Location)
          const companyName = aiDraft.company || target.name;
          const locationName = aiDraft.location || rawJob.locationText || "Remote";
          
          const company = await prisma.company.upsert({
            where: { slug: slugify(companyName) },
            update: { name: companyName },
            create: { name: companyName, slug: slugify(companyName) },
          });

          const location = await prisma.location.upsert({
            where: { slug: slugify(locationName) },
            update: { name: locationName },
            create: { name: locationName, slug: slugify(locationName) },
          });

          const categoryName = "Software Engineering"; // Default category, editable by Admin later
          const category = await prisma.category.upsert({
            where: { slug: slugify(categoryName) },
            update: { name: categoryName },
            create: { name: categoryName, slug: slugify(categoryName) },
          });

          const qualifications = await Promise.all(
            (aiDraft.qualifications || []).map((name) =>
              prisma.qualification.upsert({
                where: { slug: slugify(name) },
                update: { name },
                create: { name, slug: slugify(name) },
              })
            )
          );

          const batches = await Promise.all(
            (aiDraft.batches || []).map((year) =>
              prisma.batch.upsert({
                where: { slug: slugify(year) },
                update: { year },
                create: { year, slug: slugify(year) },
              })
            )
          );

          // Insert into Database as DRAFT
          await prisma.job.create({
            data: {
              title: aiDraft.title,
              slug: slugify(aiDraft.title + "-" + Math.random().toString(36).substring(2, 6)),
              companyId: company.id,
              locationId: location.id,
              categoryId: category.id,
              workMode: locationName.toLowerCase().includes("remote") ? "REMOTE" : "ONSITE",
              experienceLevel: "FRESHER", // You can adjust this based on AI draft if you add it to prompt
              salary: aiDraft.salary || null,
              applyUrl: rawJob.applyUrl,
              featuredImage: aiDraft.featuredImage || null,
              seoTitle: aiDraft.seoTitle,
              metaDescription: aiDraft.metaDescription,
              excerpt: aiDraft.sections.jobSummary || aiDraft.seoTitle,
              articleContent: articleContent,
              status: "DRAFT",
              qualifications: {
                create: qualifications.map((q) => ({ qualificationId: q.id })),
              },
              batches: {
                create: batches.map((b) => ({ batchId: b.id })),
              },
            },
          });

          results.newJobsAdded++;
        } catch (err) {
          console.error(`Error processing job ${rawJob.applyUrl}:`, err);
          results.errors++;
        }
      }
    } catch (err) {
      console.error(`Error fetching from ${target.name}:`, err);
    }
  }

  return NextResponse.json({ success: true, results });
}
