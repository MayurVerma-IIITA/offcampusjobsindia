"use client";

import { useTransition } from "react";
import { updateJobStatusAction } from "@/app/admin/actions";
import type { JobStatus } from "@prisma/client";

export function StatusDropdown({ id, currentStatus }: { id: string; currentStatus: JobStatus }) {
  const [isPending, startTransition] = useTransition();

  return (
    <select
      disabled={isPending}
      value={currentStatus}
      onChange={(e) => {
        startTransition(async () => {
          await updateJobStatusAction(id, e.target.value as JobStatus);
        });
      }}
      className="h-7 w-[110px] rounded-md border border-input bg-background px-2 text-xs outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
    >
      <option value="DRAFT">DRAFT</option>
      <option value="PUBLISHED">PUBLISHED</option>
      <option value="EXPIRED">EXPIRED</option>
      <option value="ARCHIVED">ARCHIVED</option>
    </select>
  );
}
