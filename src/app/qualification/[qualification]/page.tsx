import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ qualification: string }>;
}) {
  const { qualification } = await params;
  return pageMetadata({
    title: `${qualification.toUpperCase()} Jobs for Freshers`,
    description: `Latest jobs for ${qualification.toUpperCase()} students and graduates.`,
    path: `/qualification/${qualification}`,
  });
}

export default async function QualificationPage({
  params,
}: {
  params: Promise<{ qualification: string }>;
}) {
  const { qualification } = await params;
  return (
    <JobListPage
      title={`${qualification.toUpperCase()} jobs`}
      description="Qualification page showing matching jobs and internal links for SEO."
      filters={{ qualification }}
    />
  );
}
