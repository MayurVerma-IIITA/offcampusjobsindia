import Link from "next/link";
import { ArrowRight, GraduationCap, MapPinned, Search, Users } from "lucide-react";
import { JobCard } from "@/components/site/job-card";
import { NewsletterForm } from "@/components/site/newsletter-form";
import { SearchBox } from "@/components/site/search-box";
import { TelegramCta } from "@/components/site/telegram-cta";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { categories } from "@/lib/sample-data";
import { getArticles } from "@/lib/articles";
import { getLatestJobs } from "@/lib/jobs";

export const revalidate = 900;

export default async function Home() {
  const latestJobs = await getLatestJobs(6);
  const articles = await getArticles();

  return (
    <main>
      <section className="border-b bg-[linear-gradient(180deg,#f0fdf4_0%,#ffffff_70%)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <div className="flex flex-col justify-center gap-6">
            <h1 className="max-w-4xl text-4xl font-semibold tracking-normal text-foreground md:text-6xl">
              Latest off campus jobs, internships, and walk-ins in India
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-muted-foreground">
              Find fresher jobs, work from home roles, company hiring updates,
              and eligibility details without creating an account.
            </p>
            <SearchBox />
            <div className="flex flex-wrap gap-2">
              {["BTech", "BCA", "MCA", "2026", "Bangalore", "Remote"].map((item) => (
                <Link key={item} href={`/jobs?q=${item}`}>
                  <Badge>{item}</Badge>
                </Link>
              ))}
            </div>
          </div>
          <div className="grid content-start gap-3 rounded-lg border bg-card p-4 shadow-sm">
            <div className="grid grid-cols-3 gap-3">
              {[
                ["Active jobs", "128+"],
                ["Companies", "70+"],
                ["Freshers", "2024-2027"],
              ].map(([label, value]) => (
                <div key={label} className="rounded-md bg-muted p-4">
                  <p className="text-2xl font-semibold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
            {latestJobs.slice(0, 3).map((job) => (
              <Link
                key={job.id}
                href={`/jobs/${job.slug}`}
                className="rounded-md border p-4 transition-colors hover:border-primary/50"
              >
                <p className="font-medium">{job.title}</p>
                <p className="mt-2 text-sm text-muted-foreground">
                  {job.company.name} - {job.location.name}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-5">
        {categories.map((category) => (
          <Link
            key={category.slug}
            href={`/category/${category.slug}`}
            className="rounded-lg border bg-card p-5 transition-colors hover:border-primary/50"
          >
            <p className="font-semibold">{category.name}</p>
            <p className="mt-2 text-sm text-muted-foreground">Browse latest updates</p>
          </Link>
        ))}
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Latest jobs</h2>
            <p className="mt-2 text-muted-foreground">
              Freshly published hiring updates with direct apply links.
            </p>
          </div>
          <Link href="/jobs" className="hidden items-center gap-2 text-sm font-medium md:flex">
            View all <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {latestJobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-4 py-12 md:grid-cols-3">
        {[
          { icon: Users, title: "Popular companies", href: "/companies/tcs" },
          { icon: GraduationCap, title: "Jobs by qualification", href: "/qualification/btech" },
          { icon: MapPinned, title: "Jobs by batch", href: "/batch/2026" },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <item.icon className="text-primary" aria-hidden="true" />
              <CardTitle>{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Link href={item.href} className="inline-flex items-center gap-2 text-sm font-medium">
                Explore <ArrowRight aria-hidden="true" />
              </Link>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-12 lg:grid-cols-[1fr_360px]">
        <TelegramCta />
        <div className="rounded-lg border bg-muted p-6">
          <h2 className="text-xl font-semibold">Email alerts</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Store subscribers now; full newsletter automation can be added later.
          </p>
          <div className="mt-4">
            <NewsletterForm />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12">
        <div className="mb-6 flex items-center gap-2">
          <Search className="text-primary" aria-hidden="true" />
          <h2 className="text-3xl font-semibold">Career Hub</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {articles.map((article) => (
            <Card key={article.slug}>
              <CardHeader>
                <CardTitle>
                  <Link href={`/career-hub/${article.slug}`}>{article.title}</Link>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{article.excerpt}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
