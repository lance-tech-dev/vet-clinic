import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROUTES } from "@/config/constants";

/**
 * Refreshes the Supabase auth session cookie on every request and performs
 * optimistic redirects for the /admin, /login, and /register routes.
 *
 * This is NOT the authoritative authorization check — it only prevents
 * unauthenticated users from reaching /admin before the real, role-based
 * check runs server-side in app/admin/layout.tsx via requireAdmin().
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);

  const { pathname } = request.nextUrl;
  const isAdminRoute = pathname.startsWith(ROUTES.ADMIN);
  const isLoginRoute = pathname === ROUTES.LOGIN;
  const isRegisterRoute = pathname === ROUTES.REGISTER;

  if (isAdminRoute && !user) {
    const loginUrl = new URL(ROUTES.LOGIN, request.url);
    loginUrl.searchParams.set("redirectTo", pathname + request.nextUrl.search);
    return NextResponse.redirect(loginUrl);
  }

  if ((isLoginRoute || isRegisterRoute) && user) {
    return NextResponse.redirect(new URL(ROUTES.HOME, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico)$).*)",
  ],
};
