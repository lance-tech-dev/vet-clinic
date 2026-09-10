import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AdminNavbar } from "@/components/admin/admin-navbar";
import { ROUTES } from "@/config/constants";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, avatar_url")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    redirect(ROUTES.UNAUTHORIZED);
  }

  const sessionUser = {
    id: user.id,
    email: user.email || "",
    fullName: profile.full_name || null,
    role: profile.role,
    avatarUrl: profile.avatar_url || null,
  };

  return (
    <div className="min-h-screen bg-slate-50 text-navy-900 flex flex-col pt-18">
      <AdminNavbar user={sessionUser} />
      <div className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
    </div>
  );
}