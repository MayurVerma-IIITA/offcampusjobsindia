import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAnalyticsSummary } from "@/lib/analytics";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";

export default async function AnalyticsPage() {
  await requireUser();
  const prisma = getPrisma();
  const summary = await getAnalyticsSummary();
  const recentEvents = prisma
    ? await prisma.analyticsEvent.findMany({
        orderBy: { createdAt: "desc" },
        take: 25,
      })
    : [];

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Analytics</h1>
      <p className="mt-2 text-muted-foreground">
        Track job views, apply clicks, Telegram clicks, search usage, and filter usage.
      </p>
      <section className="mt-8 grid gap-4 md:grid-cols-5">
        {[
          ["Job views", summary.jobViews],
          ["Apply clicks", summary.applyClicks],
          ["Telegram clicks", summary.telegramClicks],
          ["Searches", summary.searches],
          ["Filters", summary.filters],
        ].map(([label, value]) => (
          <Card key={label}>
            <CardHeader>
              <BarChart3 className="text-primary" aria-hidden="true" />
              <CardTitle>{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold">{value}</p>
            </CardContent>
          </Card>
        ))}
      </section>
      <section className="mt-8 rounded-lg border bg-card">
        <div className="border-b p-5">
          <h2 className="text-xl font-semibold">Recent events</h2>
        </div>
        <div className="divide-y">
          {recentEvents.map((event) => (
            <div key={event.id} className="grid gap-2 p-5 md:grid-cols-[180px_1fr_220px]">
              <span className="font-medium">{event.type}</span>
              <span className="text-sm text-muted-foreground">{event.path || "No path"}</span>
              <span className="text-sm text-muted-foreground">
                {event.createdAt.toISOString()}
              </span>
            </div>
          ))}
          {!recentEvents.length ? (
            <p className="p-5 text-sm text-muted-foreground">
              No database-backed events yet. Configure DATABASE_URL and interact with public pages.
            </p>
          ) : null}
        </div>
      </section>
    </main>
  );
}
