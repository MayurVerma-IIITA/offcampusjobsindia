import { siteConfig } from "@/lib/site";
import { getPrisma } from "@/lib/prisma";
import type { SiteSettings } from "@/lib/types";

export const defaultSettings: SiteSettings = {
  telegramUrl: siteConfig.telegramUrl,
  googleAnalyticsId: process.env.NEXT_PUBLIC_GA_ID,
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY,
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
  adsenseSidebar: "",
  adsenseInsideArticle: "",
  adsenseAfterArticle: "",
  internalLinkingEnabled: true,
};

export async function getSiteSettings(): Promise<SiteSettings> {
  const prisma = getPrisma();

  if (!prisma) {
    return defaultSettings;
  }

  const rows = await prisma.siteSetting.findMany();
  const values = Object.fromEntries(rows.map((row) => [row.key, row.value]));

  return {
    ...defaultSettings,
    ...(values.site as Partial<SiteSettings> | undefined),
  };
}

export async function saveSiteSettings(settings: SiteSettings) {
  const prisma = getPrisma();

  if (!prisma) {
    throw new Error("DATABASE_URL is required to save site settings.");
  }

  await prisma.siteSetting.upsert({
    where: { key: "site" },
    update: { value: settings },
    create: { key: "site", value: settings },
  });
}
