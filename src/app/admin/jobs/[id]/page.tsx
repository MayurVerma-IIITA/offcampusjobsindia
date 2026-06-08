import { notFound } from "next/navigation";
import { JobForm } from "@/components/admin/job-form";
import { requireUser } from "@/lib/auth";
import { getPrisma } from "@/lib/prisma";
import { getJobBySlug } from "@/lib/jobs";

export default async function EditJobPage({ params }: { params: Promise<{ id: string }> }) {
  await requireUser();
  const { id } = await params;
  const prisma = getPrisma();

  if (!prisma) {
    notFound();
  }

  const row = await prisma.job.findUnique({ where: { id }, select: { slug: true } });

  if (!row) {
    notFound();
  }

  const job = await getJobBySlug(row.slug);
  const categories = await prisma.category.findMany({ select: { name: true } });
  const categoryNames = categories.map((c) => c.name);

  return (
    <main className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Edit job</h1>
      <p className="mt-2 text-muted-foreground">Update job content, SEO metadata, and publishing status.</p>
      <div className="mt-8">
        <JobForm job={job} categories={categoryNames} />
      </div>
    </main>
  );
}
