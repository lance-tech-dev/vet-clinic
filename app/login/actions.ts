"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import { logger } from "@/lib/logging/logger";
import { loginSchema } from "@/lib/auth/validation";
import { sanitizeRedirectTarget } from "@/lib/utils/safe-redirect";

export interface LoginFormState {
  error?: string;
}

/**
 * Authenticates a user via Supabase Auth. Failure messaging is intentionally
 * generic ("Invalid email or password") regardless of whether the email
 * exists — distinguishing the two would be an account-enumeration leak.
 */
export async function login(_prevState: LoginFormState, formData: FormData): Promise<LoginFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) {
    logger.warn("Login attempt failed", { email: parsed.data.email });
    return { error: "Invalid email or password." };
  }

  const redirectTo = sanitizeRedirectTarget(formData.get("redirectTo"), ROUTES.HOME);
  redirect(redirectTo);
}
