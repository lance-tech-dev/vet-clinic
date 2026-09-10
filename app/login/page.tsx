import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/config/constants";
import { isAdmin } from "@/lib/auth/roles";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already authenticated, redirect user immediately
  if (user) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (isAdmin(profile?.role)) {
      redirect(ROUTES.ADMIN);
    }

    redirect(ROUTES.HOME);
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-100/40 via-amber-50/20 to-slate-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 sm:pt-28 pb-12 sm:pb-16 relative overflow-hidden">
      {/* Decorative Glow Elements */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-r from-orange-300/20 to-amber-300/20 blur-3xl rounded-full pointer-events-none"
        aria-hidden="true"
      />

      {/* Centered Modern Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/50">
        <LoginForm />
      </div>
    </main>
  );
}