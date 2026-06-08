import Link from "next/link";

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams,
}: {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams: Record<string, string | undefined>;
}) {
  if (totalPages <= 1) {
    return null;
  }

  const hrefFor = (nextPage: number) => {
    const params = new URLSearchParams();
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && key !== "page") params.set(key, value);
    });
    params.set("page", String(nextPage));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="mt-8 flex items-center justify-between" aria-label="Pagination">
      <Link
        href={hrefFor(Math.max(page - 1, 1))}
        aria-disabled={page <= 1}
        className="rounded-md border px-3 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Previous
      </Link>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Link
        href={hrefFor(Math.min(page + 1, totalPages))}
        aria-disabled={page >= totalPages}
        className="rounded-md border px-3 py-2 text-sm aria-disabled:pointer-events-none aria-disabled:opacity-50"
      >
        Next
      </Link>
    </nav>
  );
}
