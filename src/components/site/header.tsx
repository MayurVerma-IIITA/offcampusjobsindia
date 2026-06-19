import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";

export async function SiteHeader() {
  const settings = await getSiteSettings();

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image src="/logo.png" alt="Off Campus Jobs India Logo" width={36} height={36} className="rounded-md" />
          <span>Off Campus Jobs India</span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          {siteConfig.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-foreground">
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <Link
            href="/premium"
            className={buttonVariants({ size: "sm", variant: "outline" })}
          >
            ⭐ Premium
          </Link>
          <a
            href={settings.telegramUrl}
            className={buttonVariants({ size: "sm" })}
            data-event="telegram_click"
          >
            <Send data-icon="inline-start" aria-hidden="true" />
            <span className="hidden sm:inline">Telegram</span>
          </a>
        </div>
      </div>
    </header>
  );
}
