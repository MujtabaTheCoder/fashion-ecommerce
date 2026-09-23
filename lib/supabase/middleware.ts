import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database";
import { getSupabasePublicEnv } from "@/lib/supabase/env";

export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });
  const env = getSupabasePublicEnv();

  if (!env) {
    return response;
  }

  const supabase = createServerClient<Database>(env.url, env.anonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => {
          request.cookies.set(name, value);
        });
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => {
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  await supabase.auth.getUser();

  return response;
}
