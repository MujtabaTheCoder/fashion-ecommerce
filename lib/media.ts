import { requireSupabasePublicEnv } from "@/lib/supabase/env";

const PRODUCT_IMAGE_BUCKET = "product-images";

export function resolveProductImageUrl(storagePath: string): string {
  if (
    storagePath.startsWith("https://") ||
    storagePath.startsWith("http://")
  ) {
    return storagePath;
  }

  const { url } = requireSupabasePublicEnv();
  const normalized = storagePath.replace(/^\/+/, "");

  return `${url}/storage/v1/object/public/${PRODUCT_IMAGE_BUCKET}/${normalized}`;
}

export function isNextImageHost(src: string): boolean {
  try {
    const { hostname } = new URL(src);
    return hostname.endsWith(".supabase.co");
  } catch {
    return false;
  }
}
