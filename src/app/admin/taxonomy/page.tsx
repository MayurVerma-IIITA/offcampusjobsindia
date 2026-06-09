import Link from "next/link";
import { createTaxonomyAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireUser } from "@/lib/auth";
import { getTaxonomies } from "@/lib/jobs";

import { EditableTaxonomy } from "@/components/admin/editable-taxonomy";

export default async function TaxonomyPage() {
  await requireUser();
  const taxonomies = await getTaxonomies();

  return (
    <main className="mx-auto grid max-w-7xl gap-6 px-4 py-10 lg:grid-cols-[1fr_360px]">
      <section>
        <h1 className="text-4xl font-semibold">Taxonomy</h1>
        <p className="mt-2 text-muted-foreground">
          Manage companies, categories, qualifications, batches, and locations.
        </p>
        <p className="mt-2 text-sm text-primary">
          💡 Tip: Click on any tag below to rename it. Renaming a tag automatically updates all jobs connected to it!
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {Object.entries(taxonomies).map(([name, items]) => (
            <Card key={name}>
              <CardHeader>
                <CardTitle className="capitalize">{name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-wrap gap-2">
                {items.map((item) => (
                  <EditableTaxonomy key={item.slug} item={item} type={name} />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Add taxonomy item</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={createTaxonomyAction} className="grid gap-4">
            <select
              name="type"
              className="h-10 rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="company">Company</option>
              <option value="category">Category</option>
              <option value="location">Location</option>
              <option value="qualification">Qualification</option>
              <option value="batch">Batch</option>
            </select>
            <Input name="name" placeholder="Name or year" required />
            <Input name="slug" placeholder="Slug optional" />
            <Input name="website" placeholder="Company website optional" />
            <Input name="state" placeholder="State optional" />
            <textarea
              name="description"
              rows={4}
              placeholder="Description optional"
              className="rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
            <Button type="submit">Save taxonomy</Button>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
