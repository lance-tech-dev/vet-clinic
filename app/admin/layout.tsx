import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { AuthenticationError, ForbiddenError } from "@/lib/errors/app-error";
import { ROUTES } from "@/config/constants";

/**
 * Server-side authorization boundary for every /admin route.
 *
 * Proxy (proxy.ts) only performs an optimistic "is there a session" redirect.
 * This layout performs the authoritative check: it re-verifies the user via
 * Supabase Auth and confirms their profile role is "admin" before rendering
 * any admin content.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect(ROUTES.LOGIN);
    }
    if (error instanceof ForbiddenError) {
      redirect(ROUTES.UNAUTHORIZED);
    }
    throw error;
  }

  return <>{children}</>;
}
