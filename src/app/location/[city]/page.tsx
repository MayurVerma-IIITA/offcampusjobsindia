import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  const title = city.replace(/-/g, " ");
  return pageMetadata({
    title: `${title} Jobs for Freshers`,
    description: `Latest off campus jobs, internships, and walk-ins in ${title}.`,
    path: `/location/${city}`,
  });
}

export default async function LocationPage({ params }: { params: Promise<{ city: string }> }) {
  const { city } = await params;
  return (
    <JobListPage
      title={`${city.replace(/-/g, " ")} jobs`}
      description="Location-specific jobs with direct apply links and SEO-friendly listings."
      filters={{ location: city }}
    />
  );
}
