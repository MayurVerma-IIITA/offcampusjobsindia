import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let serviceClient: SupabaseClient | null = null;

export function getSupabaseServiceClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  if (!serviceClient) {
    serviceClient = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return serviceClient;
}

export function getStorageBucket() {
  return process.env.SUPABASE_STORAGE_BUCKET || "job-assets";
}

export function getTransformedImageUrls(pathOrUrl: string) {
  if (!pathOrUrl) {
    return null;
  }

  const client = getSupabaseServiceClient();

  if (!client || pathOrUrl.startsWith("http")) {
    return {
      original: pathOrUrl,
      thumbnail: pathOrUrl,
      medium: pathOrUrl,
      large: pathOrUrl,
    };
  }

  const bucket = getStorageBucket();
  const from = client.storage.from(bucket);

  return {
    original: from.getPublicUrl(pathOrUrl).data.publicUrl,
    thumbnail: from.getPublicUrl(pathOrUrl, {
      transform: { width: 320, height: 180, resize: "cover" },
    }).data.publicUrl,
    medium: from.getPublicUrl(pathOrUrl, {
      transform: { width: 768, height: 432, resize: "cover" },
    }).data.publicUrl,
    large: from.getPublicUrl(pathOrUrl, {
      transform: { width: 1200, height: 675, resize: "cover" },
    }).data.publicUrl,
  };
}
