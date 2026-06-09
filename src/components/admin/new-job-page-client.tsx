"use client";

import { useState } from "react";
import type { Job } from "@/lib/types";
import type { AiDraft } from "@/components/admin/ai-generate-panel";
import { AiGeneratePanel } from "@/components/admin/ai-generate-panel";
import { JobForm } from "@/components/admin/job-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

function draftToJobShape(draft: AiDraft): Partial<Job> {
  /* Build the article body from the structured sections */
  const s = draft.sections;
  const articleParts: string[] = [];

  if (s.jobSummary) articleParts.push(`## Job Summary\n\n${s.jobSummary}`);
  if (s.overview) articleParts.push(`## Overview\n\n${s.overview}`);
  if (s.keyResponsibilities?.length) {
    articleParts.push(
      `## Key Responsibilities\n\n${s.keyResponsibilities.map((r) => `- ${r}`).join("\n")}`,
    );
  }
  if (s.eligibility) articleParts.push(`## Eligibility\n\n${s.eligibility}`);
  if (s.requiredSkills?.length) {
    articleParts.push(
      `## Required Skills\n\n${s.requiredSkills.map((sk) => `- ${sk}`).join("\n")}`,
    );
  }
  if (s.benefits?.length) {
    articleParts.push(
      `## Benefits\n\n${s.benefits.map((b) => `- ${b}`).join("\n")}`,
    );
  }
  if (s.selectionProcess) articleParts.push(`## Selection Process\n\n${s.selectionProcess}`);
  if (s.howToApply) articleParts.push(`## How To Apply\n\n${s.howToApply}`);
  if (s.faq?.length) {
    const faqText = s.faq.map((f) => `### ${f.question}\n\n${f.answer}`).join("\n\n");
    articleParts.push(`## FAQ\n\n${faqText}`);
  }

  return {
    title: draft.title,
    slug: draft.slug,
    company: { name: draft.company, slug: "" },
    location: { name: draft.location, slug: "" },
    category: { name: "", slug: "" },
    qualifications: draft.qualifications,
    batches: draft.batches,
    salary: draft.salary,
    deadline: draft.deadline,
    applyUrl: draft.applyUrl || "",
    featuredImage: draft.featuredImage || null,
    seoTitle: draft.seoTitle,
    metaDescription: draft.metaDescription,
    excerpt: s.jobSummary || "",
    articleContent: articleParts.join("\n\n"),
  };
}

export function NewJobPageClient({ categories = [] }: { categories?: string[] }) {
  const [draftKey, setDraftKey] = useState(0);
  const [draft, setDraft] = useState<Partial<Job> | null>(null);

  function handleDraft(aiDraft: AiDraft) {
    setDraft(draftToJobShape(aiDraft));
    setDraftKey((k) => k + 1);
  }

  return (
    <>
      <div className="my-8 grid gap-6 lg:grid-cols-[1fr_340px]">
        <AiGeneratePanel onDraftGenerated={handleDraft} />
        <Card>
          <CardHeader>
            <CardTitle>Media</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 text-sm text-muted-foreground">
            <p>Upload featured images from <code>/admin/media</code>, then paste the returned path below.</p>
            <p>Supabase image transformations provide thumbnail, medium, large, and WebP delivery.</p>
          </CardContent>
        </Card>
      </div>

      {/* key forces re-mount so defaultValue inputs pick up new draft values */}
      <JobForm key={draftKey} draft={draft} categories={categories} />
    </>
  );
}
