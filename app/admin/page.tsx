import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

interface RecentPet {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  created_at: string;
  owner_id: string;
  profiles: {
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
}

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // 1. Fetch real counts and stats from Supabase
  const [{ count: petsCount }, { count: ownersCount }, { data: recentPetsData }] = await Promise.all([
    supabase.from("pets").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "user"),
    supabase
      .from("pets")
      .select(`
        id,
        name,
        species,
        breed,
        created_at,
        owner_id,
        profiles (
          full_name,
          email,
          phone
        )
      `)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const recentPets = (recentPetsData as unknown as RecentPet[]) || [];
  const totalPatients = petsCount ?? 0;
  const totalOwners = ownersCount ?? 0;

  const getSpeciesIcon = (species: string) => {
    const s = species.toLowerCase();
    if (s.includes("dog")) return "🐕";
    if (s.includes("cat")) return "🐈";
    if (s.includes("bird")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐾";
  };

  return (
    <div className="space-y-8">
      {/* 1. Header / Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </span>
          </div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight mt-2">
            Clinic Overview
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Real-time daily operations, fur patient statistics, and client management.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href="/admin/appointments"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-xs transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            New Appointment
          </Link>
          <Link
            href="/admin/patients"
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-sm transition-colors"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
            View Patients
          </Link>
        </div>
      </div>

      {/* 2. KPI Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Today's Appointments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Today&apos;s Appointments</span>
            <div className="p-2.5 rounded-xl bg-orange-50 text-orange-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-navy-900">0</div>
            <p className="text-xs font-medium text-slate-400 mt-1">Scheduled for today</p>
          </div>
        </div>

        {/* Card 2: Active Fur Patients */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Fur Patients</span>
            <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <path d="M8 14s1.5 2 4 2 4-2 4-2" />
                <line x1="9" y1="9" x2="9.01" y2="9" />
                <line x1="15" y1="9" x2="15.01" y2="9" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-navy-900">{totalPatients}</div>
            <p className="text-xs font-medium text-emerald-600 mt-1">Registered in database</p>
          </div>
        </div>

        {/* Card 3: Registered Owners */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Pet Owners</span>
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-navy-900">{totalOwners}</div>
            <p className="text-xs font-medium text-slate-400 mt-1">Active client profiles</p>
          </div>
        </div>

        {/* Card 4: Active Clinic Branches */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-500">Clinic Branches</span>
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-navy-900">3</div>
            <p className="text-xs font-medium text-emerald-600 mt-1">All active & open</p>
          </div>
        </div>
      </div>

      {/* 3. Main Split Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Recent Registered Patients */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900">Recently Registered Patients</h2>
              <p className="text-xs text-slate-500">Latest fur babies registered by owners</p>
            </div>
            <Link
              href="/admin/patients"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              View All Patients →
            </Link>
          </div>

          {recentPets.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-xs">
              No registered patients found in the database.
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentPets.map((pet) => {
                const owner = pet.profiles;
                const ownerName = owner?.full_name || owner?.email || "Unknown Owner";
                const date = new Date(pet.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                });

                return (
                  <div
                    key={pet.id}
                    className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">
                        {getSpeciesIcon(pet.species)}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold text-navy-900">{pet.name}</h3>
                        <p className="text-xs text-slate-500">
                          {pet.breed || pet.species} • Owner: {ownerName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-semibold text-slate-500 block">{date}</span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 mt-1">
                        Active Profile
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Branch Status & Quick Actions */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <h2 className="text-base font-bold text-navy-900 mb-4">Branch Status</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Main Branch (San Pablo)</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Open</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1.5 border-b border-slate-100">
                <span className="font-semibold text-slate-700">Calamba Branch</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Open</span>
              </div>
              <div className="flex items-center justify-between text-sm py-1.5">
                <span className="font-semibold text-slate-700">Santa Rosa Branch</span>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">Open</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <h2 className="text-base font-bold text-navy-900">Client Directory</h2>
            <p className="text-xs text-slate-500">
              Browse registered client accounts, contact details, and pet associations.
            </p>
            <Link
              href="/admin/owners"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-navy-900 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              Open Owner Directory →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}