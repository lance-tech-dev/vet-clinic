import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/session";
import { AuthenticationError, ForbiddenError } from "@/lib/errors/app-error";
import { ROUTES } from "@/config/constants";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import type { NavAuthState } from "@/lib/auth/types";

/**
 * Server-side authorization boundary for every /admin route.
 *
 * Proxy (proxy.ts) only performs an optimistic "is there a session" redirect.
 * This layout performs the authoritative check: it re-verifies the user via
 * Supabase Auth and confirms their profile role is "admin" before rendering
 * any admin content.
 */
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  let adminData;
  try {
    adminData = await requireAdmin();
  } catch (error) {
    if (error instanceof AuthenticationError) {
      redirect(ROUTES.LOGIN);
    }
    if (error instanceof ForbiddenError) {
      redirect(ROUTES.UNAUTHORIZED);
    }
    throw error;
  }

  const navAuthState: NavAuthState = {
    isAuthenticated: true,
    displayName: adminData.profile.full_name ?? adminData.user.email ?? "Admin",
    isAdmin: true,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminNavbar authState={navAuthState} />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}