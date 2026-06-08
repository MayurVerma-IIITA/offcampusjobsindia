import { articles as sampleArticles } from "@/lib/sample-data";
import { getPrisma } from "@/lib/prisma";
import type { Article } from "@/lib/types";

export async function getArticles(): Promise<Article[]> {
  const prisma = getPrisma();

  if (!prisma) {
    return sampleArticles.map(normalizeSampleArticle);
  }

  const rows = await prisma.article.findMany({
    where: { publishedAt: { not: null } },
    orderBy: { publishedAt: "desc" },
  });

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    publishedAt: row.publishedAt?.toISOString() || null,
  }));
}

export async function getArticleBySlug(slug: string) {
  const prisma = getPrisma();

  if (!prisma) {
    const article = sampleArticles.find((item) => item.slug === slug);
    return article ? normalizeSampleArticle(article) : null;
  }

  const row = await prisma.article.findUnique({ where: { slug } });

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    content: row.content,
    seoTitle: row.seoTitle,
    metaDescription: row.metaDescription,
    publishedAt: row.publishedAt?.toISOString() || null,
  };
}

function normalizeSampleArticle(article: {
  title: string;
  slug: string;
  excerpt: string;
}): Article {
  return {
    ...article,
    content: article.excerpt,
    seoTitle: article.title,
    metaDescription: article.excerpt,
    publishedAt: null,
  };
}
