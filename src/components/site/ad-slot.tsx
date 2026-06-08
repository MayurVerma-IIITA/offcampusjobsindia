import { getSiteSettings } from "@/lib/settings";

type Slot = "sidebar" | "insideArticle" | "afterArticle";

export async function AdSlot({ slot }: { slot: Slot }) {
  const settings = await getSiteSettings();
  const code =
    slot === "sidebar"
      ? settings.adsenseSidebar
      : slot === "insideArticle"
        ? settings.adsenseInsideArticle
        : settings.adsenseAfterArticle;

  if (!code) {
    return null;
  }

  return (
    <div
      className="rounded-lg border bg-card p-3"
      dangerouslySetInnerHTML={{ __html: code }}
    />
  );
}
