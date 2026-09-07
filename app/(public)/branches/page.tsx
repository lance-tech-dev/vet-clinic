import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

// Force Next.js to re-query Supabase on every request so admin branch updates sync instantly
export const dynamic = "force-dynamic";

interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  operating_hours: string;
  is_active: boolean;
  created_at: string;
}

export default async function PublicBranchesPage() {
  const supabase = await createClient();

  // Fetch active clinic branches from Supabase
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
            <span>📍</span> Local Laguna Clinic Network
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
            Find Your Nearest <span className="text-orange-500">VetClinic Branch</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Equipped with modern surgical suites, diagnostic laboratories, in-house pharmacies, and pet spas across Laguna. Your pet’s medical record is synced seamlessly across all our locations.
          </p>

          <div className="pt-2 flex flex-wrap justify-center gap-4 text-xs font-semibold text-slate-600">
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="text-emerald-500">✓</span> Centralized Pet Records
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="text-emerald-500">✓</span> Licensed Vets on Duty
            </span>
            <span className="flex items-center gap-1.5 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-2xs">
              <span className="text-emerald-500">✓</span> Open Daily
            </span>
          </div>
        </div>
      </section>

      {/* 2. Dynamic Branches Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Active Locations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Our Physical Clinic Branches
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Select a clinic location to view operating schedules, direct telephone lines, or schedule an online booking.
            </p>
          </div>

          {branches.length === 0 ? (
            <div className="bg-slate-50 p-12 rounded-3xl border border-slate-200/80 shadow-2xs text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mx-auto font-bold">
                🏥
              </div>
              <h3 className="text-base font-bold text-navy-900">No Active Branches Listed</h3>
              <p className="text-xs text-slate-500">
                Our clinic locations are currently being updated. Please check back shortly or reach out through our contact page.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:bg-white hover:border-orange-200/80 transition-all duration-300 flex flex-col justify-between group"
                >
                  <div className="space-y-6">
                    {/* Header Badge & City Tag */}
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Open Daily
                      </span>
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-navy-900 text-white uppercase tracking-wider">
                        {branch.city}
                      </span>
                    </div>

                    {/* Branch Name & Address */}
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-navy-900 group-hover:text-orange-500 transition-colors">
                        {branch.name}
                      </h3>
                      <div className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed font-normal">
                        <svg
                          className="w-4 h-4 text-slate-400 shrink-0 mt-0.5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span>{branch.address}</span>
                      </div>
                    </div>

                    {/* Hours & Contact Info */}
                    <div className="space-y-2 pt-3 border-t border-slate-200/60 text-xs">
                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium text-slate-400 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle cx="12" cy="12" r="10" strokeWidth="2" />
                            <polyline points="12 6 12 12 16 14" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                          Hours:
                        </span>
                        <span className="font-semibold text-slate-800">{branch.operating_hours}</span>
                      </div>

                      <div className="flex items-center justify-between text-slate-600">
                        <span className="font-medium text-slate-400 flex items-center gap-1.5">
                          <svg className="w-3.5 h-3.5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          Phone:
                        </span>
                        <span className="font-bold text-navy-900">{branch.phone}</span>
                      </div>
                    </div>

                    {/* Available On-Site Services Badges */}
                    <div className="pt-2">
                      <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                        Branch Features:
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                          🩺 Consultations
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                          ✂️ Grooming Spa
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                          🔬 Lab & X-Ray
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-[11px] font-semibold text-slate-700 shadow-2xs">
                          💊 Pharmacy
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Booking CTA */}
                  <div className="pt-6 mt-6 border-t border-slate-200/60">
                    <Link
                      href={ROUTES.APPOINTMENTS}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-navy-900 hover:bg-orange-500 text-white font-bold text-xs shadow-xs transition-all duration-200 group-hover:shadow-md"
                    >
                      Book at {branch.city} Branch
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <line x1="5" y1="12" x2="19" y2="12" strokeWidth="2" strokeLinecap="round" />
                        <polyline points="12 5 19 12 12 19" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Branch Network Features Banner */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Unified Medical System
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                One Medical Record Across All Branches
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                No matter which branch you visit, our licensed veterinarians access your pet’s complete medical history, vaccination records, and prescription logs in real time.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href={ROUTES.APPOINTMENTS}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all text-center"
              >
                Schedule Appointment
              </Link>
              <Link
                href={ROUTES.SERVICES}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm transition-colors text-center"
              >
                View Services & Pricing
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Branch Network FAQs */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Branch FAQs
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Visiting Our Clinic Locations
            </h2>
          </div>

          <div className="space-y-4">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-base font-bold text-navy-900">Can I bring my pet to a different branch than our usual one?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Yes! Your pet&apos;s medical record and treatment history are fully synced across our system. You can visit any VetClinic branch in San Pablo, Calamba, or Santa Rosa seamlessly.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-base font-bold text-navy-900">Are emergency walk-ins accepted at all branches?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Emergency triage is prioritized at all active branches during regular operating hours. If your pet experiences an acute medical emergency, please bring them to the nearest location immediately.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
              <h3 className="text-base font-bold text-navy-900">What are the standard operating hours?</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Our standard operating hours across all Laguna branches are 8:00 AM to 6:00 PM daily. Check individual branch cards above for holiday schedules or specific telephone contacts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom CTA */}
      <section className="py-16 bg-navy-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Visit One of Our Clinic Locations?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Book an online appointment today or contact our clinic staff for directions and inquiries.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href={ROUTES.APPOINTMENTS}
              className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
            >
              Book an Appointment
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Contact Staff
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}