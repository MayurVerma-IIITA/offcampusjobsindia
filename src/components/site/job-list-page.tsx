import { AdSlot } from "@/components/site/ad-slot";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { FilterPanel } from "@/components/site/filter-panel";
import { JobCard } from "@/components/site/job-card";
import { Pagination } from "@/components/site/pagination";
import { SearchBox } from "@/components/site/search-box";
import { TelegramCta } from "@/components/site/telegram-cta";
import { Badge } from "@/components/ui/badge";
import { getPaginatedJobs } from "@/lib/jobs";
import type { JobFilters } from "@/lib/types";

type Props = {
  title: string;
  description: string;
  filters?: JobFilters;
  searchQuery?: string;
  basePath?: string;
};

export async function JobListPage({
  title,
  description,
  filters = {},
  searchQuery = "",
  basePath = "/jobs",
}: Props) {
  const mergedFilters = { ...filters, query: searchQuery };
  const result = await getPaginatedJobs(mergedFilters);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_320px]">
      <section className="min-w-0">
        <Breadcrumbs items={[{ label: "Jobs", href: "/jobs" }, { label: title }]} />
        <div className="mb-8">
          <h1 className="text-4xl font-semibold">{title}</h1>
          <p className="mt-3 max-w-3xl text-muted-foreground">{description}</p>
          <div className="mt-6">
            <SearchBox defaultValue={searchQuery} />
          </div>
        </div>
        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">{result.total} jobs found</p>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {result.jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
        <Pagination
          page={result.page}
          totalPages={result.totalPages}
          basePath={basePath}
          searchParams={{
            q: searchQuery || undefined,
            category: filters.category,
            company: filters.company,
            qualification: filters.qualification,
            batch: filters.batch,
            location: filters.location,
            experience: filters.experience,
            workMode: filters.workMode,
          }}
        />
      </section>
      <aside className="flex flex-col gap-4 min-w-0">
        <FilterPanel filters={mergedFilters} />
        <TelegramCta />
        <AdSlot slot="sidebar" />
      </aside>
    </main>
  );
}
