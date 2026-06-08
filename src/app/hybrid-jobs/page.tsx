import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hybrid Jobs in India",
  description: "Browse latest hybrid jobs for freshers, graduates, and early career candidates.",
  path: "/hybrid-jobs",
});

export default function HybridJobsPage() {
  return (
    <JobListPage
      title="Hybrid jobs"
      description="Hybrid job openings with a mix of office and remote work."
      filters={{ workMode: "Hybrid" }}
    />
  );
}
