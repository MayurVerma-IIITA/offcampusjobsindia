import { saveSettingsAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { requireUser } from "@/lib/auth";
import { getSiteSettings } from "@/lib/settings";

export default async function SettingsPage() {
  await requireUser();
  const settings = await getSiteSettings();

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Site settings</h1>
      <p className="mt-2 text-muted-foreground">Configure Telegram, analytics, AdSense, and internal linking.</p>
      <form action={saveSettingsAction} className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Growth and monetization</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
            <Field label="Telegram URL" name="telegramUrl" defaultValue={settings.telegramUrl} />
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Google Analytics ID" name="googleAnalyticsId" defaultValue={settings.googleAnalyticsId} />
              <Field label="PostHog key" name="posthogKey" defaultValue={settings.posthogKey} />
            </div>
            <Field label="PostHog host" name="posthogHost" defaultValue={settings.posthogHost} />
            <Textarea label="AdSense sidebar code" name="adsenseSidebar" defaultValue={settings.adsenseSidebar} />
            <Textarea label="AdSense inside article code" name="adsenseInsideArticle" defaultValue={settings.adsenseInsideArticle} />
            <Textarea label="AdSense after article code" name="adsenseAfterArticle" defaultValue={settings.adsenseAfterArticle} />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                name="internalLinkingEnabled"
                defaultChecked={settings.internalLinkingEnabled}
              />
              Enable automatic internal linking modules
            </label>
            <Button type="submit">Save settings</Button>
          </CardContent>
        </Card>
      </form>
    </main>
  );
}

function Field({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <Input name={name} defaultValue={defaultValue || ""} />
    </label>
  );
}

function Textarea({ label, name, defaultValue }: { label: string; name: string; defaultValue?: string }) {
  return (
    <label className="grid gap-2 text-sm font-medium">
      {label}
      <textarea
        name={name}
        rows={4}
        defaultValue={defaultValue || ""}
        className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"
      />
    </label>
  );
}
