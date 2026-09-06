import "server-only";
import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { getServerEnv, isSupabaseAdminConfigured } from "@/config/env";

let adminClient: ReturnType<typeof createSupabaseClient<Database>> | null = null;

/**
 * Creates a privileged Supabase client using SUPABASE_SERVICE_ROLE_KEY.
 *
 * CRITICAL SECURITY NOTICE:
 * - This client BYPASSES all Row Level Security (RLS) policies.
 * - MUST NEVER be exposed to the browser or imported into client components.
 * - MUST ONLY be used for trusted, backend-only system operations.
 */
export function createAdminClient() {
  if (adminClient) return adminClient;

  const env = getServerEnv();

  if (!isSupabaseAdminConfigured()) {
    throw new Error(
      "Supabase Service Role is not configured. Add SUPABASE_SERVICE_ROLE_KEY to .env.local to perform privileged operations."
    );
  }

  adminClient = createSupabaseClient<Database>(
    env.NEXT_PUBLIC_SUPABASE_URL!,
    env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

  return adminClient;
}
