import Link from "next/link";
import {
  BarChart3,
  Briefcase,
  Building2,
  FilePenLine,
  Image,
  Newspaper,
  Settings,
  Tags,
  Users,
} from "lucide-react";
import { deleteJobAction, expireJobsAction } from "@/app/admin/actions";
import { StatusDropdown } from "@/components/admin/status-dropdown";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/lib/analytics";
import { requireUser } from "@/lib/auth";
import { getJobs } from "@/lib/jobs";

export default async function AdminPage() {
  const user = await requireUser();
  const jobs = await getJobs();
  const published = jobs.filter((job) => job.status === "PUBLISHED").length;
  const expired = jobs.filter((job) => job.status === "EXPIRED").length;
  const companies = new Set(jobs.map((job) => job.company.slug)).size;
  const analytics = await getAnalyticsSummary();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-4xl font-semibold">Admin dashboard</h1>
          <p className="mt-2 text-muted-foreground">
            Manage jobs, drafts, taxonomy, SEO metadata, ads, and analytics.
            Signed in as {user.email}.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/admin/jobs/new"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            New job
          </Link>
          <Link
            href="/admin/settings"
            className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium"
          >
            Settings
          </Link>
          <form action="/admin/logout" method="post">
            <button className="inline-flex h-10 items-center justify-center rounded-md border px-4 text-sm font-medium">
              Sign out
            </button>
          </form>
        </div>
      </div>

      <section className="grid gap-4 md:grid-cols-4">
        {[
          { label: "Published jobs", value: published, icon: Briefcase },
          { label: "Companies", value: companies, icon: Building2 },
          { label: "Expired jobs", value: expired, icon: FilePenLine },
          { label: "Apply clicks", value: analytics.applyClicks, icon: BarChart3 },
        ].map((item) => (
          <Card key={item.label}>
            <CardHeader>
              <item.icon className="text-primary" aria-hidden="true" />
              <CardTitle>{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-4">
        {[
          { label: "Settings", href: "/admin/settings", icon: Settings },
          { label: "Editors", href: "/admin/users", icon: Users },
          { label: "Taxonomy", href: "/admin/taxonomy", icon: Tags },
          { label: "Media", href: "/admin/media", icon: Image },
          { label: "Articles", href: "/admin/articles", icon: Newspaper },
          { label: "Analytics", href: "/admin/analytics", icon: BarChart3 },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="rounded-lg border bg-card p-5 hover:border-primary/40">
            <item.icon className="text-primary" aria-hidden="true" />
            <p className="mt-3 font-semibold">{item.label}</p>
          </Link>
        ))}
      </section>

      <section className="mt-8 rounded-lg border bg-card">
        <div className="flex items-center justify-between border-b p-5">
          <div>
            <h2 className="text-xl font-semibold">Jobs list</h2>
            <p className="text-sm text-muted-foreground">Drafts, published, and expired jobs.</p>
          </div>
          <form action={expireJobsAction}>
            <button className="rounded-md border px-3 py-2 text-sm">Expire past deadlines</button>
          </form>
        </div>
        <div className="divide-y">
          {jobs.map((job) => (
            <div key={job.id} className="grid gap-3 p-5 md:grid-cols-[1fr_160px_120px_160px]">
              <div>
                <p className="font-medium">
                  <Link href={`/jobs/${job.slug}`} className="hover:underline" target="_blank">
                    {job.title}
                  </Link>
                </p>
                <p className="text-sm text-muted-foreground">
                  {job.company.name} - {job.location.name}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">{job.category.name}</span>
              <StatusDropdown id={job.id} currentStatus={job.status} />
              <div className="flex gap-2">
                <Link href={`/admin/jobs/${job.id}`} className="text-sm font-medium text-primary">
                  Edit
                </Link>
                <form action={deleteJobAction}>
                  <input type="hidden" name="id" value={job.id} />
                  <button className="text-sm text-muted-foreground">Archive</button>
                </form>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
