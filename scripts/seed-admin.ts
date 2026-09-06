/**
 * One-time admin seed script.
 *
 * Creates (or reuses) a Supabase Auth user for ADMIN_EMAIL/ADMIN_INITIAL_PASSWORD
 * and ensures their profile role is "admin". Run with:
 *
 *   npm run seed:admin
 *
 * Safe to re-run: if the user already exists, it is reused and its profile role
 * is (re)set to "admin" rather than failing.
 *
 * This script runs standalone via `tsx`, outside the Next.js server runtime, so
 * it builds its own Supabase admin client rather than importing
 * lib/supabase/admin.ts (which is guarded by the `server-only` package and
 * throws when loaded outside Next's server bundling).
 */
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

import { createClient } from "@supabase/supabase-js";
import { getServerEnv, isAdminSeedConfigured, isSupabaseAdminConfigured } from "@/config/env";
import type { Database } from "@/lib/supabase/types";

async function findUserByEmail(
  supabase: ReturnType<typeof createClient<Database>>,
  email: string
) {
  const perPage = 200;
  for (let page = 1; ; page += 1) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw error;

    const match = data.users.find((user) => user.email?.toLowerCase() === email.toLowerCase());
    if (match) return match;

    if (data.users.length < perPage) return null;
  }
}

async function main() {
  if (!isAdminSeedConfigured()) {
    console.error(
      "Missing required environment variables: ADMIN_EMAIL and ADMIN_INITIAL_PASSWORD.\n" +
        "Set them in .env.local, then re-run: npm run seed:admin"
    );
    process.exit(1);
  }

  if (!isSupabaseAdminConfigured()) {
    console.error(
      "Supabase is not fully configured (need NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, " +
        "and SUPABASE_SERVICE_ROLE_KEY in .env.local)."
    );
    process.exit(1);
  }

  const env = getServerEnv();
  const email = env.ADMIN_EMAIL!;
  const password = env.ADMIN_INITIAL_PASSWORD!;

  const supabase = createClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL!, env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  });

  console.log(`Seeding admin user: ${email}`);

  const { data: created, error: createError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  let userId: string;

  if (createError) {
    const alreadyExists =
      createError.code === "email_exists" || /already registered|already exists/i.test(createError.message);

    if (!alreadyExists) {
      console.error(`Failed to create admin user: ${createError.message}`);
      process.exit(1);
    }

    console.log("User already exists — reusing the existing account.");
    const existing = await findUserByEmail(supabase, email);

    if (!existing) {
      console.error("Creation reported the user already exists, but no matching account was found via listUsers().");
      process.exit(1);
    }

    userId = existing.id;
  } else {
    userId = created.user.id;
  }

  const { data: updated, error: profileError } = await supabase
    .from("profiles")
    .update({ role: "admin" })
    .eq("id", userId)
    .select("id");

  if (profileError) {
    console.error(`User exists but failed to set the admin role on its profile: ${profileError.message}`);
    console.error(
      "Has supabase/migrations/0001_init_schema.sql been applied? The profiles table/trigger must exist first."
    );
    process.exit(1);
  }

  if (!updated || updated.length === 0) {
    console.error(
      "The auth user exists, but no matching row in `profiles` was updated (0 rows affected).\n" +
        "This happens when the auth user was created before the profiles trigger existed — the\n" +
        "on_auth_user_created trigger only fires for new signups, not retroactively. Apply\n" +
        "supabase/migrations/0001_init_schema.sql first, then delete this auth user (via the\n" +
        "Supabase dashboard or auth.admin.deleteUser) and re-run `npm run seed:admin` so the\n" +
        "trigger creates the profile row from scratch."
    );
    process.exit(1);
  }

  console.log(`Admin user ready: ${email} (role: admin)`);
}

main().catch((err) => {
  console.error("Admin seed failed:", err instanceof Error ? err.message : err);
  process.exit(1);
});
