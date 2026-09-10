import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const revalidate = 0;

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  const todayStr = new Date().toISOString().split("T")[0];

  // Parallel Supabase Data Fetching
  const [
    { count: todayAppointmentsCount },
    { count: totalPatientsCount },
    { count: totalOwnersCount },
    { count: totalBranchesCount },
    { data: recentPetsRaw },
    { data: activeBranchesRaw },
  ] = await Promise.all([
    supabase
      .from("appointments")
      .select("*", { count: "exact", head: true })
      .gte("appointment_date", `${todayStr}T00:00:00`)
      .lte("appointment_date", `${todayStr}T23:59:59`),
    supabase.from("pets").select("*", { count: "exact", head: true }),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .eq("role", "user"),
    supabase
      .from("branches")
      .select("*", { count: "exact", head: true })
      .eq("is_active", true),
    supabase
      .from("pets")
      .select("id, name, species, breed, created_at, owner_id, profiles(full_name)")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("branches")
      .select("id, name, address, city, is_active, phone")
      .order("created_at", { ascending: true }),
  ]);

  const recentPatients = recentPetsRaw || [];
  const branches = activeBranchesRaw || [];

  return (
    <div className="space-y-8">
      {/* 1. Page Header (Modern Unboxed SaaS Layout) */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200/80 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
              Clinic Operations Dashboard
            </h1>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-extrabold shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span>Operational</span>
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time daily operations, patient telemetry, and branch management.
          </p>
        </div>

        {/* Global Page Level Action CTAs */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Link
            href="/admin/patients"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-navy-900 font-bold text-xs border border-slate-200/90 shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM18 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM8.5 17c0 1.38-1.12 2.5-2.5 2.5S3.5 18.38 3.5 17s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5z" />
            </svg>
            <span>View Patients</span>
          </Link>

          <Link
            href="/admin/appointments"
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-navy-900 font-bold text-xs border border-slate-200/90 shadow-2xs transition-colors flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 0v4m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>View Appointments</span>
          </Link>

          <Link
            href="/admin/inbox"
            className="px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/20 transition-all flex items-center gap-1.5"
          >
            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
            <span>View Messages</span>
          </Link>
        </div>
      </div>

      {/* 2. Executive KPI Metrics Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* Metric 1: Today's Appointments */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Today&apos;s Appointments</span>
            <div className="p-2 rounded-xl bg-orange-50 text-orange-600 border border-orange-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 0v4m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-navy-900 tracking-tight">
            {todayAppointmentsCount || 0}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Scheduled for current date
          </div>
        </div>

        {/* Metric 2: Registered Patients */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Fur Patients</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM18 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM8.5 17c0 1.38-1.12 2.5-2.5 2.5S3.5 18.38 3.5 17s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zM20.5 17c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-navy-900 tracking-tight">
            {totalPatientsCount || 0}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
            <span>✓</span>
            <span>Registered in database</span>
          </div>
        </div>

        {/* Metric 3: Active Pet Owners */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Pet Owners</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-navy-900 tracking-tight">
            {totalOwnersCount || 0}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Active client accounts
          </div>
        </div>

        {/* Metric 4: Clinic Branches */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500">Clinic Branches</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <div className="text-3xl font-black text-navy-900 tracking-tight">
            {totalBranchesCount || 0}
          </div>
          <div className="text-[11px] font-semibold text-slate-400">
            Active & open locations
          </div>
        </div>
      </div>

      {/* 3. Main Operational Content Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Recent Fur Patients Feed */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-extrabold text-navy-900">
                Recently Registered Patients
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Latest fur babies registered by pet parents.
              </p>
            </div>
            <Link
              href="/admin/patients"
              className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
            >
              <span>View All</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentPatients.length > 0 ? (
              recentPatients.map((patient) => {
                const ownerName =
                  Array.isArray(patient.profiles) && patient.profiles[0]?.full_name
                    ? patient.profiles[0].full_name
                    : (patient.profiles as { full_name?: string } | null)?.full_name || "Unknown Owner";

                const formattedDate = new Date(patient.created_at).toLocaleDateString(
                  "en-US",
                  { month: "short", day: "numeric", year: "numeric" }
                );

                return (
                  <div
                    key={patient.id}
                    className="py-3.5 flex items-center justify-between gap-4 first:pt-0 last:pb-0"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-navy-900 font-bold text-xs shrink-0">
                        🐾
                      </div>
                      <div className="overflow-hidden">
                        <div className="text-xs font-extrabold text-navy-900 truncate">
                          {patient.name}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate">
                          {patient.species || "Pet"} • {patient.breed || "Standard Breed"} • Owner:{" "}
                          <span className="font-semibold text-navy-900">{ownerName}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-[11px] text-slate-400 font-medium">
                        {formattedDate}
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                        Active
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="py-8 text-center space-y-1">
                <p className="text-xs font-bold text-navy-900">No patient records found.</p>
                <p className="text-[11px] text-slate-400">Newly registered pets will appear here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Branch Status & Client Directory */}
        <div className="lg:col-span-5 space-y-6">
          {/* Branch Network Status Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h2 className="text-base font-extrabold text-navy-900">
                Branch Network Status
              </h2>
              <Link
                href="/admin/branches"
                className="text-xs font-bold text-orange-600 hover:text-orange-700 transition-colors flex items-center gap-1"
              >
                <span>Manage</span>
                <span>➔</span>
              </Link>
            </div>

            <div className="space-y-2.5">
              {branches.length > 0 ? (
                branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-3"
                  >
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-navy-900 truncate">
                        {branch.name}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">
                        📍 {branch.address || branch.city || "San Pablo City"}
                      </div>
                    </div>
                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border shrink-0 ${
                        branch.is_active
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                          : "bg-slate-100 text-slate-500 border-slate-200"
                      }`}
                    >
                      {branch.is_active ? "Open" : "Inactive"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-slate-400">
                  No clinic branches configured.
                </div>
              )}
            </div>
          </div>

          {/* Quick Owners Directory Shortcut Card */}
          <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-orange-400 uppercase tracking-wider">
              <span>👥</span>
              <span>Client Directory</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Browse registered client accounts, contact phone numbers, and associated fur babies.
            </p>
            <Link
              href="/admin/owners"
              className="inline-flex items-center gap-1.5 text-xs font-extrabold text-white hover:text-orange-400 transition-colors pt-1"
            >
              <span>View All Registered Owners</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}