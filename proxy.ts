import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { ROUTES } from "@/config/constants";
import { isAdmin } from "@/lib/auth/roles";

/**
 * Refreshes the Supabase auth session cookie on every request and performs
 * optimistic redirects for the /admin, /login, and /register routes.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);

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
    let destination: string = ROUTES.HOME;

    if (supabase) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (isAdmin(profile?.role)) {
        destination = ROUTES.ADMIN;
      }
    }

    return NextResponse.redirect(new URL(destination, request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|webp|avif|gif|ico)$).*)",
  ],
};