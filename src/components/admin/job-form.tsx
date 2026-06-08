import type { Job } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { saveJobAction } from "@/app/admin/actions";

export function JobForm({ 
  job, 
  draft,
  categories = [] 
}: { 
  job?: Job | null; 
  draft?: Partial<Job> | null;
  categories?: string[];
}) {
  /* Draft values (from AI generation) take precedence over empty defaults on new-job forms */
  const d = draft ?? {};
  const v = {
    id: job?.id || "",
    title: job?.title || d.title || "",
    slug: job?.slug || d.slug || "",
    company: job?.company?.name || d.company?.name || "",
    location: job?.location?.name || d.location?.name || "",
    category: job?.category?.name || d.category?.name || "",
    qualifications: job?.qualifications?.join(", ") || d.qualifications?.join(", ") || "",
    batches: job?.batches?.join(", ") || d.batches?.join(", ") || "",
    workMode: job?.workMode?.toUpperCase() || "REMOTE",
    experienceLevel: job?.experienceLevel?.toUpperCase() || "ANY",
    status: job?.status || "DRAFT",
    salary: job?.salary || d.salary || "",
    deadline: job?.deadline?.slice(0, 10) || d.deadline?.slice(0, 10) || "",
    applyUrl: job?.applyUrl || d.applyUrl || "",
    featuredImage: "",
    seoTitle: job?.seoTitle || d.seoTitle || "",
    metaDescription: job?.metaDescription || d.metaDescription || "",
    excerpt: job?.excerpt || d.excerpt || "",
    articleContent: job?.articleContent || d.articleContent || "",
  };

  return (
    <form action={saveJobAction} className="grid gap-6 lg:grid-cols-[1fr_340px]">
      <input type="hidden" name="id" value={v.id} />
      <Card>
        <CardHeader>
          <CardTitle>Job details</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field label="Title" name="title" defaultValue={v.title} required />
          <Field label="Slug" name="slug" defaultValue={v.slug} />
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Company" name="company" defaultValue={v.company} required />
            <Field label="Location" name="location" defaultValue={v.location} required />
            <label className="grid gap-2 text-sm font-medium">
              Category
              <Input
                type="text"
                name="category"
                defaultValue={v.category}
                required
                list="category-list"
                autoComplete="off"
              />
              <datalist id="category-list">
                {categories.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
            </label>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Field
              label="Qualifications"
              name="qualifications"
              defaultValue={v.qualifications}
              placeholder="BTech, BCA, MCA"
              required
            />
            <Field
              label="Batches"
              name="batches"
              defaultValue={v.batches}
              placeholder="2027, 2026, 2025"
              required
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <SelectField
              label="Work mode"
              name="workMode"
              defaultValue={v.workMode}
              options={["REMOTE", "HYBRID", "ONSITE"]}
            />
            <SelectField
              label="Experience"
              name="experienceLevel"
              defaultValue={v.experienceLevel}
              options={["FRESHER", "EXPERIENCED", "ANY"]}
            />
            <SelectField
              label="Status"
              name="status"
              defaultValue={v.status}
              options={["DRAFT", "PUBLISHED", "EXPIRED", "ARCHIVED"]}
            />
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <Field label="Salary" name="salary" defaultValue={v.salary} />
            <Field
              label="Deadline"
              name="deadline"
              type="date"
              defaultValue={v.deadline}
            />
            <Field
              label="Featured image path or URL"
              name="featuredImage"
              defaultValue={v.featuredImage}
            />
          </div>
          <Field label="Apply URL" name="applyUrl" defaultValue={v.applyUrl} required />
          <Field label="SEO title" name="seoTitle" defaultValue={v.seoTitle} required />
          <label className="grid gap-2 text-sm font-medium">
            Meta description
            <textarea
              name="metaDescription"
              rows={3}
              required
              defaultValue={v.metaDescription}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Excerpt
            <textarea
              name="excerpt"
              rows={3}
              required
              defaultValue={v.excerpt}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <label className="grid gap-2 text-sm font-medium">
            Article content
            <textarea
              name="articleContent"
              rows={16}
              required
              defaultValue={v.articleContent}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
            />
          </label>
          <Button type="submit">{job ? "Save changes" : "Create job"}</Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Publishing workflow</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground">
          <p>Use the AI panel on the create page to generate a first draft.</p>
          <p>Review structured fields, SEO copy, and article content before publishing.</p>
          <p>Published jobs are public and indexable. Expired jobs remain live.</p>
        </CardContent>
      </Card>
    </form>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  placeholder,
  required,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input
        type={type}
        name={name}
        defaultValue={defaultValue || ""}
        placeholder={placeholder}
        required={required}
      />
    </label>
  );
}

function SelectField({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: string;
  options: string[];
}) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-10 rounded-md border border-input bg-background px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
