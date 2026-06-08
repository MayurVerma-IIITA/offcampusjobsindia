import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  return pageMetadata({
    title: `${company.replace(/-/g, " ")} Jobs`,
    description: `Latest jobs and hiring updates from ${company.replace(/-/g, " ")}.`,
    path: `/companies/${company}`,
  });
}

export default async function CompanyPage({ params }: { params: Promise<{ company: string }> }) {
  const { company } = await params;
  return (
    <JobListPage
      title={`${company.replace(/-/g, " ")} jobs`}
      description="Company page with all matching jobs, pagination-ready layout, and SEO metadata."
      filters={{ company }}
    />
  );
}
