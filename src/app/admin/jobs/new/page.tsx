import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { NewJobPageClient } from "@/components/admin/new-job-page-client";

export default async function NewJobPage() {
  await requireUser();
  const prisma = getPrisma()!;
  const categories = await prisma.category.findMany({ select: { name: true } });
  const categoryNames = categories.map((c) => c.name);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Create job</h1>
      <p className="mt-2 text-muted-foreground">
        Paste a job description or company career URL, generate SEO content, then edit before publishing.
      </p>

      <NewJobPageClient categories={categoryNames} />
    </main>
  );
}
