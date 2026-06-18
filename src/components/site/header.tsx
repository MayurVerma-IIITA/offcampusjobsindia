import Image from "next/image";
import Link from "next/link";
import { Send } from "lucide-react";
import { getSiteSettings } from "@/lib/settings";
import { siteConfig } from "@/lib/site";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { LoginButton } from "@/components/LoginButton";

export async function SiteHeader() {
  const settings = await getSiteSettings();
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  let isPremium = false;
  if (user) {
    const member = await prisma.member.findUnique({ where: { id: user.id } });
    isPremium = member?.isPremium || false;
  }

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
          {user ? (
            <div className="hidden items-center gap-2 md:flex">
              <span className="text-sm font-medium">{user.user_metadata?.full_name || user.email?.split('@')[0]}</span>
              {isPremium && <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-semibold text-yellow-800">👑 Premium</span>}
            </div>
          ) : (
            <LoginButton />
          )}
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
