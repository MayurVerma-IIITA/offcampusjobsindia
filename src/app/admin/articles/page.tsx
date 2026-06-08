import { saveArticleAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getArticles } from "@/lib/articles";
import { requireUser } from "@/lib/auth";

export default async function AdminArticlesPage() {
  await requireUser();
  const articles = await getArticles();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_420px]">
      <section>
        <h1 className="text-4xl font-semibold">Career Hub articles</h1>
        <div className="mt-8 divide-y rounded-lg border bg-card">
          {articles.map((article) => (
            <div key={article.slug} className="p-5">
              <p className="font-medium">{article.title}</p>
              <p className="text-sm text-muted-foreground">{article.excerpt}</p>
            </div>
          ))}
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Create or update article</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={saveArticleAction} className="grid gap-4">
            <Input name="title" placeholder="Title" required />
            <Input name="slug" placeholder="slug-optional" />
            <Input name="seoTitle" placeholder="SEO title" />
            <textarea name="metaDescription" rows={2} placeholder="Meta description" className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <textarea name="excerpt" rows={3} placeholder="Excerpt" required className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <textarea name="content" rows={12} placeholder="Article content" required className="rounded-md border border-input bg-background px-3 py-2 text-sm" />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="published" defaultChecked />
              Publish
            </label>
            <Button type="submit">Save article</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
