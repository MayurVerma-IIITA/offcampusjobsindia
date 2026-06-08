import Link from "next/link";
import { siteConfig } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-semibold">{siteConfig.name}</p>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            SEO-first job updates for freshers, graduates, interns, and early
            career professionals across India.
          </p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Browse</p>
          <Link href="/remote-jobs">Remote jobs</Link>
          <Link href="/qualification/btech">BTech jobs</Link>
          <Link href="/batch/2026">2026 batch jobs</Link>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-medium">Business</p>
          <Link href="/contact">Contact Us</Link>
          <a href={siteConfig.telegramUrl}>Join Telegram</a>
        </div>
      </div>
    </footer>
  );
}
