"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle2 } from "lucide-react";

export function NewsletterForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    
    try {
      await fetch("/api/subscribe", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: formData,
      });
      setSuccess(true);
    } catch {
      // Ignore errors for now, show success anyway to prevent spamming
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="flex h-10 items-center gap-2 rounded-md border border-green-200 bg-green-50 px-3 text-sm font-medium text-green-700">
        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
        Subscribed! We'll keep you updated.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
      <Input type="email" name="email" placeholder="Email for job alerts" required disabled={loading} />
      <Button type="submit" variant="secondary" disabled={loading}>
        {loading ? "Subscribing..." : "Subscribe"}
      </Button>
    </form>
  );
}
