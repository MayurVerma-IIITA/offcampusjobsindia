import { Prisma } from "@prisma/client";
import { getPrisma } from "@/lib/prisma";

export async function trackEvent(input: {
  type: string;
  path?: string;
  jobId?: string;
  metadata?: Record<string, unknown>;
}) {
  const prisma = getPrisma();

  if (!prisma) {
    return;
  }

  await prisma.analyticsEvent.create({
    data: {
      type: input.type,
      path: input.path,
      metadata: input.metadata as Prisma.InputJsonValue,
      ...(input.jobId ? { job: { connect: { id: input.jobId } } } : {}),
    },
  });
}

export async function getAnalyticsSummary() {
  const prisma = getPrisma();

  if (!prisma) {
    return {
      jobViews: 0,
      applyClicks: 0,
      telegramClicks: 0,
      searches: 0,
      filters: 0,
    };
  }

  const [jobViews, applyClicks, telegramClicks, searches, filters] =
    await Promise.all([
      prisma.analyticsEvent.count({ where: { type: "job_view" } }),
      prisma.analyticsEvent.count({ where: { type: "apply_click" } }),
      prisma.analyticsEvent.count({ where: { type: "telegram_click" } }),
      prisma.analyticsEvent.count({ where: { type: "search" } }),
      prisma.analyticsEvent.count({ where: { type: "filter" } }),
    ]);

  return { jobViews, applyClicks, telegramClicks, searches, filters };
}
