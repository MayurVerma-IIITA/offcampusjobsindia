import { uploadFeaturedImageAction } from "@/app/admin/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { requireUser } from "@/lib/auth";
import { getTransformedImageUrls } from "@/lib/supabase";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; error?: string }>;
}) {
  await requireUser();
  const { path, error } = await searchParams;
  const urls = path ? getTransformedImageUrls(path) : null;

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-4xl font-semibold">Media uploads</h1>
      <p className="mt-2 text-muted-foreground">Upload featured images to Supabase Storage.</p>
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Featured image</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          {error ? <p className="rounded-md border bg-muted p-3 text-sm">Upload error: {error}</p> : null}
          <form action={uploadFeaturedImageAction} className="grid gap-4">
            <input type="file" name="file" accept="image/*" required />
            <Button type="submit">Upload</Button>
          </form>
          {path && urls ? (
            <div className="grid gap-2 rounded-md border bg-muted p-4 text-sm">
              <p className="font-medium">Storage path for job form:</p>
              <code>{path}</code>
              <p>Thumbnail: {urls.thumbnail}</p>
              <p>Medium: {urls.medium}</p>
              <p>Large: {urls.large}</p>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </main>
  );
}
