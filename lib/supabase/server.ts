import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { Database } from "./types";
import { getServerEnv, isSupabaseConfigured } from "@/config/env";

/**
 * Creates a server-side Supabase client with cookie-based session management.
 * Strictly server-only: for use in Server Components, Server Actions, and Route Handlers.
 */
export async function createClient() {
  const cookieStore = await cookies();
  const env = getServerEnv();

  if (!isSupabaseConfigured()) {
    console.warn(
      "[Supabase Server] Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Configure .env.local."
    );
  }

  return createServerClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key",
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Can be ignored if called from Server Components when session is refreshed in middleware.
          }
        },
      },
    }
  );
}
