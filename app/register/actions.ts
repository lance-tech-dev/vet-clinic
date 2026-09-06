"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import { logger } from "@/lib/logging/logger";
import { registerSchema } from "@/lib/auth/validation";

export interface RegisterFormState {
  status: "idle" | "error" | "already_exists" | "needs_confirmation";
  message?: string;
}

export const registerInitialState: RegisterFormState = { status: "idle" };

/**
 * Registers a new user via Supabase Auth (supabase.auth.signUp) — never a
 * custom password store. Profile creation (the `profiles` row) happens via
 * the on_auth_user_created database trigger, not client code.
 *
 * Existing-account handling follows Supabase's own anti-enumeration signal:
 * signUp() does not error for an email that's already registered — it
 * returns a user with an empty `identities` array instead. We detect that
 * and show a safe, non-committal message rather than probing for existence
 * ourselves.
 */
export async function register(_prevState: RegisterFormState, formData: FormData): Promise<RegisterFormState> {
  const parsed = registerSchema.safeParse({
    fullName: formData.get("fullName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Invalid input." };
  }

  const { fullName, email, password } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  });

  if (error) {
    const alreadyExists = /already registered|already exists/i.test(error.message);

    if (alreadyExists) {
      return {
        status: "already_exists",
        message: "An account with this email may already exist. Try logging in instead.",
      };
    }

    logger.warn("Registration failed", { email, code: error.code });
    return { status: "error", message: "Unable to create your account. Please try again." };
  }

  // Supabase's own anti-enumeration behavior: signing up with an email that's
  // already registered succeeds silently with an empty `identities` array
  // instead of erroring.
  if (data.user && data.user.identities && data.user.identities.length === 0) {
    return {
      status: "already_exists",
      message: "An account with this email may already exist. Try logging in instead.",
    };
  }

  if (data.session) {
    // Email confirmation is disabled for this project — the user is already authenticated.
    redirect(ROUTES.HOME);
  }

  return {
    status: "needs_confirmation",
    message: "Registration successful. Please check your email to verify your account before logging in.",
  };
}
