import Link from "next/link";
import { ArrowRight, CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Job } from "@/lib/types";
import { getTransformedImageUrls } from "@/lib/supabase";

export function JobCard({ job }: { job: Job }) {
  const imageUrls = job.featuredImage ? getTransformedImageUrls(job.featuredImage) : null;

  return (
    <Card className="h-full overflow-hidden transition-colors hover:border-primary/40 flex flex-col">
      {imageUrls ? (
        <Link href={`/jobs/${job.slug}`} className="block aspect-video w-full overflow-hidden">
          <img
            src={imageUrls.medium || imageUrls.original}
            alt={job.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform hover:scale-105"
          />
        </Link>
      ) : null}
      <CardHeader>
        <div className="flex flex-wrap gap-2">
          <Link href={`/category/${job.category.slug}`}>
            <Badge className="hover:bg-primary/80">{job.category.name}</Badge>
          </Link>
          <Link href={`/${job.workMode.toLowerCase()}-jobs`}>
            <Badge className="hover:bg-primary/80">{job.workMode}</Badge>
          </Link>
        </div>
        <CardTitle className="text-lg leading-snug">
          <Link href={`/jobs/${job.slug}`}>{job.title}</Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-1 flex-col gap-4">
        <p className="text-sm text-muted-foreground line-clamp-3">{job.excerpt}</p>
        <div className="mt-auto grid gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-2">
            <MapPin aria-hidden="true" className="h-4 w-4" />
            {job.company.name} - {job.location.name}
          </span>
          <span className="flex items-center gap-2">
            <CalendarDays aria-hidden="true" className="h-4 w-4" />
            Last date: {formatDate(job.deadline)}
          </span>
        </div>
        <Link
          href={`/jobs/${job.slug}`}
          className="inline-flex items-center gap-2 text-sm font-medium text-primary mt-2"
        >
          View details <ArrowRight aria-hidden="true" className="h-4 w-4" />
        </Link>
      </CardContent>
    </Card>
  );
}
