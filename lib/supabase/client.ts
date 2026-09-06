import { createBrowserClient } from "@supabase/ssr";
import { Database } from "./types";
import { getClientEnv, isSupabaseConfigured } from "@/config/env";

let browserClient: ReturnType<typeof createBrowserClient<Database>> | null = null;

/**
 * Creates or returns the singleton Supabase client for Browser/Client Components.
 * Uses only public environment variables (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).
 */
export function createClient() {
  if (browserClient) return browserClient;

  const env = getClientEnv();

  if (!isSupabaseConfigured()) {
    console.warn(
      "[Supabase] Warning: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is missing. Configure them in .env.local."
    );
  }

  browserClient = createBrowserClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co",
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key"
  );

  return browserClient;
}
