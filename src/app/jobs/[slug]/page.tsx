import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink, Pencil } from "lucide-react";
import { AdSlot } from "@/components/site/ad-slot";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { JobCard } from "@/components/site/job-card";
import { TelegramCta } from "@/components/site/telegram-cta";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getSession } from "@/lib/auth";
import { getJobBySlug, getRelatedJobs } from "@/lib/jobs";
import { formatDate } from "@/lib/utils";
import { absoluteUrl, jobPostingJsonLd } from "@/lib/seo";
import { getTransformedImageUrls } from "@/lib/supabase";
import { ImageFallback } from "@/components/ui/image-fallback";

export const revalidate = 900;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    return {};
  }

  const imageUrls = job.featuredImage ? getTransformedImageUrls(job.featuredImage) : null;

  return {
    title: job.seoTitle,
    description: job.metaDescription,
    alternates: { canonical: absoluteUrl(`/jobs/${job.slug}`) },
    openGraph: {
      title: job.seoTitle,
      description: job.metaDescription,
      url: absoluteUrl(`/jobs/${job.slug}`),
      type: "article",
      images: imageUrls ? [{ url: imageUrls.large || imageUrls.original }] : undefined,
    },
    twitter: {
      card: imageUrls ? "summary_large_image" : "summary",
      title: job.seoTitle,
      description: job.metaDescription,
      images: imageUrls ? [imageUrls.large || imageUrls.original] : undefined,
    },
  };
}

export async function generateStaticParams() {
  return [];
}

export default async function JobDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const job = await getJobBySlug(slug);

  if (!job) {
    notFound();
  }

  const session = await getSession();
  const related = await getRelatedJobs(job);
  const isExpired = Boolean(job.deadline && new Date(job.deadline) < new Date());
  const imageUrls = job.featuredImage ? getTransformedImageUrls(job.featuredImage) : null;

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
      <article className="min-w-0">
        <div className="mb-6 flex items-center justify-between gap-4">
          <Link href="/jobs" className="inline-flex items-center gap-2 text-sm">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to jobs
          </Link>
          {session && (
            <Link
              href={`/admin/jobs/${job.id}`}
              className={buttonVariants({ variant: "outline", size: "sm" })}
            >
              <Pencil className="mr-2 h-3.5 w-3.5" />
              Edit Job
            </Link>
          )}
        </div>
        <Breadcrumbs
          items={[
            { label: "Jobs", href: "/jobs" },
            { label: job.category.name, href: `/category/${job.category.slug}` },
            { label: job.title },
          ]}
        />
        <div className="mb-6 flex flex-wrap gap-2">
          <Link href={`/category/${job.category.slug}`}>
            <Badge className="hover:bg-primary/80">{job.category.name}</Badge>
          </Link>
          <Link href={`/${job.workMode.toLowerCase()}-jobs`}>
            <Badge className="hover:bg-primary/80">{job.workMode}</Badge>
          </Link>
          <Link href={`/jobs?experience=${job.experienceLevel.toLowerCase()}`}>
            <Badge className="hover:bg-primary/80">{job.experienceLevel}</Badge>
          </Link>
          {isExpired ? <Badge className="border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80">Applications Closed</Badge> : null}
        </div>

        {imageUrls && (
          <div className="mb-8 aspect-[16/9] w-full overflow-hidden rounded-xl border bg-muted">
            <ImageFallback
              src={imageUrls.large || imageUrls.original}
              alt={job.title}
              className="h-full w-full object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-semibold leading-tight">{job.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{job.excerpt}</p>

        <dl className="my-8 grid gap-3 rounded-lg border bg-card p-5 sm:grid-cols-2">
          {[
            ["Company", job.company.name],
            ["Location", job.location.name],
            ["Qualification", job.qualifications.join(", ")],
            ["Batch", job.batches.join(", ")],
            ["Salary", job.salary || "Not mentioned"],
            ["Deadline", formatDate(job.deadline)],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="text-xs font-medium uppercase text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-medium">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="prose prose-neutral max-w-none">
          <Markdown>{job.articleContent}</Markdown>
        </div>

        <div className="my-8">
          <AdSlot slot="insideArticle" />
        </div>

        {isExpired ? (
          <div className="rounded-lg border bg-muted p-5">
            <p className="font-semibold">Applications Closed</p>
            <p className="mt-2 text-sm text-muted-foreground">
              This job page remains live for reference. Explore related active jobs below.
            </p>
          </div>
        ) : (
          <a
            href={job.applyUrl}
            className={buttonVariants({ size: "lg" })}
            data-event="apply_click"
            data-job-id={job.id}
          >
            Apply on company website
            <ExternalLink data-icon="inline-end" aria-hidden="true" />
          </a>
        )}

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jobPostingJsonLd(job)).replace(/</g, "\\u003c"),
          }}
        />
      </article>

      <aside className="flex flex-col gap-4">
        <TelegramCta />
        <div className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold">Related jobs</h2>
          <div className="mt-4 flex flex-col gap-3">
            {related.slice(0, 4).map((item) => (
              <Link key={item.id} href={`/jobs/${item.slug}`} className="text-sm hover:text-primary">
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <section className="lg:col-span-2">
        <h2 className="mb-4 text-2xl font-semibold">More jobs you may like</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {related.map((item) => (
            <JobCard key={item.id} job={item} />
          ))}
        </div>
        <div className="mt-8">
          <AdSlot slot="afterArticle" />
        </div>
      </section>
    </main>
  );
}
