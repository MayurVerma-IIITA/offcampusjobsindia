import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20">
      <h1 className="text-4xl font-semibold">Page not found</h1>
      <p className="mt-3 text-muted-foreground">
        This page does not exist. Expired jobs remain live, so try searching the jobs archive.
      </p>
      <Link href="/jobs" className="mt-6 inline-flex text-sm font-medium text-primary">
        Search jobs
      </Link>
    </main>
  );
}
