import { JobListPage } from "@/components/site/job-list-page";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Remote Jobs for Freshers and Graduates",
  description: "Browse latest remote jobs and work from home hiring updates in India.",
  path: "/remote-jobs",
});

export default function RemoteJobsPage() {
  return (
    <JobListPage
      title="Remote jobs"
      description="Work from home and remote-friendly jobs for students, freshers, and graduates."
      filters={{ workMode: "Remote" }}
    />
  );
}
