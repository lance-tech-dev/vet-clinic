"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

/**
 * Invalidates the current Supabase session (server-side) and redirects home.
 * Used directly as a <form action={logout}> target from the Navbar.
 */
export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(ROUTES.HOME);
}
