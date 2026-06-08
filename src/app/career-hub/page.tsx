import Link from "next/link";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getArticles } from "@/lib/articles";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Career Hub",
  description: "Placement preparation, resume, interview, and fresher career guides.",
  path: "/career-hub",
});

export default async function CareerHubPage() {
  const articles = await getArticles();

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <Breadcrumbs items={[{ label: "Career Hub" }]} />
      <h1 className="text-4xl font-semibold">Career Hub</h1>
      <p className="mt-2 text-muted-foreground">Guides for off campus placements, resumes, and interviews.</p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {articles.map((article) => (
          <Card key={article.slug}>
            <CardHeader>
              <CardTitle>
                <Link href={`/career-hub/${article.slug}`}>{article.title}</Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
