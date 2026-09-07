import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import { AppointmentForm, type Branch } from "./appointment-form";

export const dynamic = "force-dynamic";

export default async function PublicAppointmentsPage() {
  const supabase = await createClient();

  // 1. Check User Session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If user is not authenticated, redirect to login with a return path
  if (!user) {
    redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.APPOINTMENTS}`);
  }

  // 2. Query Live Active Branches for Authenticated Users
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("id, name, city, address, phone, operating_hours, is_active")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800 py-12 lg:py-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200 shadow-2xs">
            Online Booking System
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Schedule a Visit for Your Fur Baby
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
            Select your preferred clinic location, clinical service, and schedule. Our veterinary staff will review and confirm your slot promptly.
          </p>
        </div>

        {/* Interactive Booking Form */}
        <AppointmentForm branches={branches} />
      </div>
    </main>
  );
}