import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ batch: string }> }) {
  const { batch } = await params;
  return pageMetadata({
    title: `${batch} Batch Jobs`,
    description: `Latest off campus jobs for ${batch} batch students and graduates.`,
    path: `/batch/${batch}`,
  });
}

export default async function BatchPage({ params }: { params: Promise<{ batch: string }> }) {
  const { batch } = await params;
  return (
    <JobListPage
      title={`${batch} batch jobs`}
      description="Batch-specific job listings for students and fresh graduates."
      filters={{ batch }}
    />
  );
}
