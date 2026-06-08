import type { MetadataRoute } from "next";
import { getArticles } from "@/lib/articles";
import { jobs } from "@/lib/sample-data";
import { siteConfig } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = await getArticles();
  const staticRoutes = [
    "",
    "/jobs",
    "/career-hub",
    "/remote-jobs",
    "/hybrid-jobs",
    "/onsite-jobs",
    "/qualification/btech",
    "/qualification/bca",
    "/batch/2026",
    "/location/bangalore",
  ];

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    })),
    ...jobs.map((job) => ({
      url: `${siteConfig.url}/jobs/${job.slug}`,
      lastModified: new Date(job.publishedAt || Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.9,
    })),
    ...articles.map((article) => ({
      url: `${siteConfig.url}/career-hub/${article.slug}`,
      lastModified: new Date(article.publishedAt || Date.now()),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
