import type { Metadata } from "next";
import Markdown from "react-markdown";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/site/breadcrumbs";
import { getArticleBySlug } from "@/lib/articles";
import { absoluteUrl } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) return {};

  return {
    title: article.seoTitle || article.title,
    description: article.metaDescription || article.excerpt,
    alternates: { canonical: absoluteUrl(`/career-hub/${article.slug}`) },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <Breadcrumbs
        items={[
          { label: "Career Hub", href: "/career-hub" },
          { label: article.title },
        ]}
      />
      <article>
        <h1 className="text-4xl font-semibold leading-tight">{article.title}</h1>
        <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
        <div className="prose prose-neutral mt-8 max-w-none">
          <Markdown>{article.content || article.excerpt}</Markdown>
        </div>
      </article>
    </main>
  );
}
