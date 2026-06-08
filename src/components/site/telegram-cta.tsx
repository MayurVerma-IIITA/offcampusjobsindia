import { Send } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { getSiteSettings } from "@/lib/settings";

export async function TelegramCta() {
  const settings = await getSiteSettings();

  return (
    <section className="rounded-lg border bg-primary p-6 text-primary-foreground">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Get instant job alerts</h2>
          <p className="mt-2 text-sm text-primary-foreground/80">
            Join the Telegram channel for off campus drives, internships, and
            walk-in updates.
          </p>
        </div>
        <a
          href={settings.telegramUrl}
          className={buttonVariants({ variant: "secondary" })}
          data-event="telegram_click"
        >
          <Send data-icon="inline-start" aria-hidden="true" />
          Join Telegram
        </a>
      </div>
    </section>
  );
}
