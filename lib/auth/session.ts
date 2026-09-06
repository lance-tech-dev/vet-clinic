import "server-only";
import { createClient } from "@/lib/supabase/server";
import { UserProfile, AuthSession } from "./types";
import { isAdmin, isStaffOrAdmin } from "./roles";
import { AuthenticationError, ForbiddenError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logging/logger";

/**
 * Retrieves the currently authenticated user from Supabase Auth.
 * Uses secure token verification via supabase.auth.getUser().
 */
export async function getCurrentUser() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return user;
  } catch (err) {
    logger.error("Failed to fetch current user session", { error: String(err) });
    return null;
  }
}

/**
 * Retrieves the profile and assigned role of the current user.
 */
export async function getCurrentProfile(): Promise<UserProfile | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const supabase = await createClient();
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (error || !profile) {
      // Return basic profile fallback if table not yet populated
      return {
        id: user.id,
        email: user.email ?? "",
        full_name: user.user_metadata?.full_name ?? null,
        role: (user.user_metadata?.role as UserProfile["role"]) ?? "user",
        avatar_url: user.user_metadata?.avatar_url ?? null,
        created_at: user.created_at,
        updated_at: user.updated_at ?? user.created_at,
      };
    }

    return profile as UserProfile;
  } catch (err) {
    logger.error("Failed to fetch user profile", { error: String(err) });
    return null;
  }
}

/**
 * Retrieves full aggregated auth and role session information.
 */
export async function getAuthSession(): Promise<AuthSession> {
  const user = await getCurrentUser();
  const profile = user ? await getCurrentProfile() : null;
  const role = profile?.role;

  return {
    user,
    profile,
    isAuthenticated: Boolean(user),
    isAdmin: isAdmin(role),
    isStaff: isStaffOrAdmin(role),
  };
}

/**
 * Guard that enforces an active authenticated session.
 * Throws AuthenticationError if no valid session exists.
 */
export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError("You must be logged in to perform this action.");
  }
  return user;
}

/**
 * Guard that enforces Administrator authorization.
 * Throws AuthenticationError if not logged in, or ForbiddenError if role is not admin.
 */
export async function requireAdmin() {
  const user = await requireAuth();
  const profile = await getCurrentProfile();

  if (!isAdmin(profile?.role)) {
    logger.warn("Unauthorized admin access attempt", {
      userId: user.id,
      email: user.email,
      role: profile?.role,
    });
    throw new ForbiddenError("Administrative privileges are required for this action.");
  }

  return { user, profile: profile! };
}
