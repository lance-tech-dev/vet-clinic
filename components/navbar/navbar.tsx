import { createClient } from "@/lib/supabase/server";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { AuthNav } from "./auth-nav";
import { MobileDrawer } from "./mobile-drawer";

export async function Navbar() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let sessionUser = null;

  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("full_name, role, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    sessionUser = {
      id: user.id,
      email: user.email || "",
      fullName: profile?.full_name || null,
      role: profile?.role || "user",
      avatarUrl: profile?.avatar_url || null,
    };
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        <Logo />
        <DesktopNav />
        <AuthNav user={sessionUser} />
        <MobileDrawer user={sessionUser} />
      </div>
    </header>
  );
}