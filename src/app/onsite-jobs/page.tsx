import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Onsite Jobs in India",
  description: "Browse latest onsite jobs, walk-ins, and office-based fresher hiring updates.",
  path: "/onsite-jobs",
});

export default function OnsiteJobsPage() {
  return (
    <JobListPage
      title="Onsite jobs"
      description="Office-based jobs and walk-in opportunities across Indian cities."
      filters={{ workMode: "Onsite" }}
    />
  );
}
