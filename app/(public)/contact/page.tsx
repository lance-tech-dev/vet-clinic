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

export default async function ContactPage() {
  const supabase = await createClient();

  // Fetch all active clinic branches from Supabase
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
            <span>💬</span> Get in Touch
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
            We’re Here for You & Your <span className="text-orange-500">Fur Babies</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Have questions about our medical services, grooming packages, or operating schedules? Reach out to any of our clinic branches directly or send us an inquiry online.
          </p>
        </div>
      </section>

      {/* 2. Main Contact Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Dynamic Branches & Direct Phone Lines */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                  Direct Clinic Lines
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
                  Contact Our Local Branches
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-normal leading-relaxed">
                  Connect directly with the veterinary reception desk at your preferred clinic location.
                </p>
              </div>

              {/* Dynamic Branch Cards */}
              {branches.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200/80 text-xs text-slate-500 text-center">
                  No active clinic locations listed. Please send a general inquiry form.
                </div>
              ) : (
                <div className="space-y-4">
                  {branches.map((branch) => (
                    <div
                      key={branch.id}
                      className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md hover:bg-white hover:border-orange-200/80 transition-all duration-300 space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="text-base font-bold text-navy-900">{branch.name}</h3>
                        <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                          Open
                        </span>
                      </div>

                      <div className="space-y-1.5 text-xs text-slate-600">
                        <p className="flex items-start gap-2">
                          <span className="text-slate-400">📍</span>
                          <span>{branch.address}</span>
                        </p>
                        <p className="flex items-center gap-2 font-semibold text-slate-800">
                          <span className="text-orange-500">📞</span>
                          <a href={`tel:${branch.phone}`} className="hover:text-orange-600 hover:underline">
                            {branch.phone}
                          </a>
                        </p>
                        <p className="flex items-center gap-2 text-slate-500">
                          <span className="text-slate-400">⏰</span>
                          <span>{branch.operating_hours}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Socials & General Email Info */}
              <div className="p-6 rounded-3xl bg-navy-900 text-white space-y-4 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-wider text-orange-400">
                  Online Connect & Socials
                </h3>
                <div className="space-y-3 text-xs text-slate-300">
                  <div className="flex items-center gap-3">
                    <span className="text-lg">📧</span>
                    <div>
                      <div className="font-bold text-white">Email Support</div>
                      <a href="mailto:info@vetclinicfurbabies.ph" className="hover:text-orange-400 hover:underline">
                        info@vetclinicfurbabies.ph
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-lg">👍</span>
                    <div>
                      <div className="font-bold text-white">Facebook Page</div>
                      <a
                        href="https://www.facebook.com/furbabiesph"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-orange-400 hover:underline"
                      >
                        facebook.com/furbabiesph
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Online Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-gradient-to-br from-navy-950 to-slate-900 text-white p-8 sm:p-12 rounded-3xl shadow-2xl space-y-6">
                <div className="space-y-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-orange-400 bg-orange-500/10 px-3 py-1 rounded-full border border-orange-500/20">
                    Online Inquiry
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Send Us a Message
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-300 font-normal">
                    Fill out the form below and our clinic administration will respond via call or email.
                  </p>
                </div>

                <form className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Your Full Name *
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Juan Dela Cruz"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Contact Mobile Number *
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 09171234567"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        placeholder="e.g. juan@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                        required
                      />
                    </div>

                    {/* Dynamic Branch Selector Populated from Supabase */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                        Target Branch Location *
                      </label>
                      <select
                        required
                        defaultValue=""
                        className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-white/20 text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                      >
                        <option value="" disabled className="text-slate-400">
                          Select a Branch...
                        </option>
                        {branches.map((b) => (
                          <option key={b.id} value={b.id} className="text-navy-900 bg-white">
                            {b.name} ({b.city})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                      Your Message / Inquiry *
                    </label>
                    <textarea
                      rows={4}
                      placeholder="Ask us about services, grooming slots, pricing, or medical concerns..."
                      className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer"
                  >
                    Send Inquiry to Clinic Team
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. Bottom Appointment CTA */}
      <section className="py-16 bg-navy-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Need an Appointment Instead?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Skip the waiting time by scheduling your pet&apos;s visit online through our automated booking system.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href={ROUTES.APPOINTMENTS}
              className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
            >
              Book an Appointment Now
            </Link>
            <Link
              href={ROUTES.BRANCHES}
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              View All Branch Locations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}