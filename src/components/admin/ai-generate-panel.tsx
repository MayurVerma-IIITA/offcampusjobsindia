"use client";

import { useState } from "react";
import { Sparkles, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export type AiDraft = {
  title: string;
  company: string;
  location: string;
  qualifications: string[];
  batches: string[];
  salary: string | null;
  deadline: string | null;
  applyUrl?: string;
  seoTitle: string;
  metaDescription: string;
  slug: string;
  featuredImage?: string | null;
  sections: {
    jobSummary: string;
    overview: string;
    keyResponsibilities: string[];
    eligibility: string;
    requiredSkills: string[];
    benefits: string[];
    selectionProcess: string;
    howToApply: string;
    faq: { question: string; answer: string }[];
  };
};

export function AiGeneratePanel({
  onDraftGenerated,
}: {
  onDraftGenerated: (draft: AiDraft) => void;
}) {
  const [careerUrl, setCareerUrl] = useState("");
  const [jobText, setJobText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setError(null);

    if (!careerUrl && !jobText.trim()) {
      setError("Provide a career URL or paste a job description.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/ai/generate-job", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ careerUrl: careerUrl || undefined, jobText: jobText || undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || `Generation failed (${res.status}).`);
        return;
      }

      if (data.draft) {
        onDraftGenerated(data.draft);
      } else {
        setError("No draft was returned.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-amber-500" aria-hidden="true" />
          AI content generation
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <label className="flex flex-col gap-2 text-sm font-medium">
          Company career URL
          <Input
            value={careerUrl}
            onChange={(e) => setCareerUrl(e.target.value)}
            placeholder="https://company.com/careers/job-id"
            disabled={loading}
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-medium">
          Pasted job description
          <textarea
            value={jobText}
            onChange={(e) => setJobText(e.target.value)}
            rows={8}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
            placeholder="Paste full job description here"
            disabled={loading}
          />
        </label>

        {error && (
          <div className="flex items-start gap-2 rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <Button type="button" onClick={handleGenerate} disabled={loading}>
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
              Generating…
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Generate structured draft
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
}
