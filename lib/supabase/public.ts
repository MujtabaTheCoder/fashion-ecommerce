import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

let publicClientInstance: ReturnType<typeof createClient<Database>> | null = null;

/**
 * Returns a cookie-free, stateless Supabase client suitable for public catalog queries.
 * This preserves Next.js static generation (SSG), Incremental Static Regeneration (ISR),
 * and Edge-level SWR caching without opting the route into dynamic cookie-bound execution.
 */
export function getPublicSupabaseClient() {
  if (publicClientInstance) return publicClientInstance;

  const env = getSupabasePublicEnv();
  if (!env) return null;

  publicClientInstance = createClient<Database>(env.url, env.anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: {
      headers: {
        "x-client-info": "atelier-edge-cached-client",
      },
    },
  });

  return publicClientInstance;
}
