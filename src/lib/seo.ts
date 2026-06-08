import type { Metadata } from "next";
import { siteConfig } from "./site";
import type { Job } from "./types";

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}

export function pageMetadata({
  title,
  description,
  path,
}: {
  title: string;
  description: string;
  path: string;
}): Metadata {
  const url = absoluteUrl(path);

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export function jobPostingJsonLd(job: Job) {
  return {
    "@context": "https://schema.org",
    "@type": "JobPosting",
    title: job.title,
    description: job.articleContent,
    datePosted: job.publishedAt,
    validThrough: job.deadline,
    employmentType: job.experienceLevel === "Fresher" ? "FULL_TIME" : "OTHER",
    hiringOrganization: {
      "@type": "Organization",
      name: job.company.name,
      sameAs: job.company.website,
    },
    jobLocation:
      job.workMode === "Remote"
        ? { "@type": "Place", address: "Remote, India" }
        : {
            "@type": "Place",
            address: {
              "@type": "PostalAddress",
              addressLocality: job.location.name,
              addressCountry: "IN",
            },
          },
    applicantLocationRequirements: {
      "@type": "Country",
      name: "India",
    },
    directApply: false,
  };
}
