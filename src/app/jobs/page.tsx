import type { Metadata } from "next";
import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Latest Off Campus Jobs in India",
  description:
    "Search latest off campus jobs, internships, walk-ins, remote jobs, and fresher hiring updates in India.",
  path: "/jobs",
});

export default async function JobsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams;
  const { q = "" } = params;

  return (
    <JobListPage
      title="Latest jobs"
      description="Browse and search the latest jobs by title, company, qualification, batch, and location."
      searchQuery={q}
      filters={{
        category: params.category,
        company: params.company,
        qualification: params.qualification,
        batch: params.batch,
        location: params.location,
        experience: params.experience,
        workMode: params.workMode,
        page: Number(params.page || 1),
      }}
    />
  );
}
