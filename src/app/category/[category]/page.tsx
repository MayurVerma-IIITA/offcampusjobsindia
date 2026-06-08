import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return pageMetadata({
    title: `${category.replace(/-/g, " ")} in India`,
    description: `Latest ${category.replace(/-/g, " ")} updates for Indian job seekers.`,
    path: `/category/${category}`,
  });
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  return (
    <JobListPage
      title={category.replace(/-/g, " ")}
      description="Category-specific jobs with search, internal links, and direct apply flow."
      filters={{ category }}
    />
  );
}
