import { getSupabasePublicEnv } from "@/lib/supabase/env";

export function resolveProductImageUrl(storagePath: string): string {
  const trimmed = storagePath.trim();

  if (
    trimmed.startsWith("https://") ||
    trimmed.startsWith("http://") ||
    trimmed.startsWith("/")
  ) {
    return trimmed;
  }

  const env = getSupabasePublicEnv();
  const base = env?.url.replace(/\/$/, "") ?? "";

  return `${base}/storage/v1/object/public/product-images/${trimmed.replace(/^\/+/, "")}`;
}

export function isSupabaseStorageUrl(src: string): boolean {
  try {
    const hostname = new URL(src).hostname;
    return hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}
