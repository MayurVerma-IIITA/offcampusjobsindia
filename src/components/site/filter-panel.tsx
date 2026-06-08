import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getTaxonomies } from "@/lib/jobs";
import type { JobFilters } from "@/lib/types";

export async function FilterPanel({ filters }: { filters: JobFilters }) {
  const taxonomies = await getTaxonomies();

  return (
    <form action="/jobs" className="grid gap-3 rounded-lg border bg-card p-5" data-track-submit="filter">
      <Input name="q" defaultValue={filters.query || ""} placeholder="Search jobs" />
      <Select name="category" label="Category" value={filters.category} items={taxonomies.categories} />
      <Select name="company" label="Company" value={filters.company} items={taxonomies.companies} />
      <Select name="qualification" label="Qualification" value={filters.qualification} items={taxonomies.qualifications} />
      <Select name="batch" label="Batch" value={filters.batch} items={taxonomies.batches} />
      <Select name="location" label="Location" value={filters.location} items={taxonomies.locations} />
      <Select
        name="experience"
        label="Experience"
        value={filters.experience}
        items={[
          { name: "Fresher", slug: "Fresher" },
          { name: "Experienced", slug: "Experienced" },
          { name: "Any", slug: "Any" },
        ]}
      />
      <Select
        name="workMode"
        label="Work mode"
        value={filters.workMode}
        items={[
          { name: "Remote", slug: "Remote" },
          { name: "Hybrid", slug: "Hybrid" },
          { name: "Onsite", slug: "Onsite" },
        ]}
      />
      <Button type="submit">Apply filters</Button>
    </form>
  );
}

function Select({
  name,
  label,
  value,
  items,
}: {
  name: string;
  label: string;
  value?: string;
  items: { name: string; slug: string }[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={value || ""}
        className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
      >
        <option value="">All</option>
        {items.map((item) => (
          <option key={item.slug} value={item.slug}>
            {item.name}
          </option>
        ))}
      </select>
    </label>
  );
}
