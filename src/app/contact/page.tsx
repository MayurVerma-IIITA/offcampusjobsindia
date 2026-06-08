import type { Metadata } from "next";
import { Mail, MessageCircle, Send } from "lucide-react";
import { siteConfig } from "@/lib/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us",
  description: "Get in touch with the Off Campus Jobs India team via Email, WhatsApp, or Telegram.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-20 text-center">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Contact Us</h1>
      <p className="mt-4 text-lg text-muted-foreground">
        Have questions, suggestions, or need support? Reach out to us through any of the channels below.
      </p>

      <div className="mt-12 grid gap-6 sm:grid-cols-3">
        <a
          href="mailto:codemaster882@gmail.com"
          className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 transition-colors hover:border-primary/40 hover:bg-muted/50"
        >
          <div className="rounded-full bg-primary/10 p-4 text-primary">
            <Mail className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-semibold">Email</h2>
            <p className="mt-1 text-sm text-muted-foreground">codemaster882@gmail.com</p>
          </div>
        </a>

        <a
          href="https://wa.me/917887577121"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 transition-colors hover:border-[#25D366]/40 hover:bg-muted/50"
        >
          <div className="rounded-full bg-[#25D366]/10 p-4 text-[#25D366]">
            <MessageCircle className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-semibold">WhatsApp</h2>
            <p className="mt-1 text-sm text-muted-foreground">+91 7887577121</p>
          </div>
        </a>

        <a
          href={siteConfig.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col items-center gap-4 rounded-2xl border bg-card p-8 transition-colors hover:border-[#0088cc]/40 hover:bg-muted/50"
        >
          <div className="rounded-full bg-[#0088cc]/10 p-4 text-[#0088cc]">
            <Send className="h-8 w-8" />
          </div>
          <div>
            <h2 className="font-semibold">Telegram</h2>
            <p className="mt-1 text-sm text-muted-foreground">@offcampusjobsindia_IT</p>
          </div>
        </a>
      </div>
    </main>
  );
}
