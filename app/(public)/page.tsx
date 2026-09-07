import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/config/constants";
import { createClient } from "@/lib/supabase/server";

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

export default async function Home() {
  const supabase = await createClient();

  // Fetch active clinic branches from Supabase
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-slate-50 pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                Trusted Veterinary Healthcare in Laguna
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-navy-900 tracking-tight leading-[1.12]">
                Exceptional Medical Care for Your Beloved <span className="text-orange-500">Fur Babies</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                From routine wellness checkups and life-saving surgeries to gentle grooming and emergency care. We provide compassionate, world-class veterinary service for dogs, cats, and exotic pets.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href={ROUTES.APPOINTMENTS}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
                >
                  Book an Appointment
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>

                <Link
                  href={ROUTES.SERVICES}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-7 py-3.5 rounded-xl bg-white hover:bg-slate-100 text-navy-900 font-semibold text-base border border-slate-200 shadow-xs transition-colors"
                >
                  Explore Services
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-8 border-t border-slate-200/80 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900">10k+</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Pets Cared For</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900">{branches.length || 3}</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Clinic Branches</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-navy-900">4.9 ★</div>
                  <div className="text-xs text-slate-500 font-medium mt-0.5">Pet Parent Rating</div>
                </div>
              </div>
            </div>

            {/* Right Card Feature */}
            <div className="lg:col-span-5">
              <div className="relative mx-auto max-w-md lg:max-w-none bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xl space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <LogoPreview />
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                    Open Today
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-100 flex items-start gap-3">
                    <span className="text-2xl">🏥</span>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">Complete Vet Facilities</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Equipped with diagnostic lab, digital X-rays, and surgical suites.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-50/80 border border-blue-100 flex items-start gap-3">
                    <span className="text-2xl">✂️</span>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">Pet Spa & Grooming</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Medicated baths, hair styling, nail trimming, and ear cleaning.</p>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-start gap-3">
                    <span className="text-2xl">💊</span>
                    <div>
                      <h3 className="text-sm font-bold text-navy-900">In-House Pharmacy</h3>
                      <p className="text-xs text-slate-600 mt-0.5">Prescription medications, vitamins, supplements, and prescription food.</p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="https://www.facebook.com/furbabiesph"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline"
                  >
                    <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Follow Us on Facebook @furbabiesph
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Services Grid */}
      <section id="services" className="py-20 bg-white border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Our Services
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Comprehensive Care for Every Stage of Life
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Dedicated veterinary medical treatments designed to keep your companions healthy, happy, and vibrant.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES.map((service) => (
              <div
                key={service.title}
                className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80 hover:bg-white hover:shadow-xl transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-navy-900 mb-2">{service.title}</h3>
                <p className="text-sm text-slate-600 leading-relaxed font-normal">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href={ROUTES.SERVICES}
              className="inline-flex items-center gap-2 font-bold text-sm text-orange-600 hover:text-orange-700 hover:underline"
            >
              View Full Services Directory →
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Dynamic Clinic Branches (Fetches from Supabase) */}
      <section id="branches" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Clinic Locations
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Conveniently Located Across Laguna
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Visit any of our active, fully equipped clinic locations for top-quality veterinary care.
            </p>
          </div>

          {branches.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-3xl border border-slate-200/80 text-slate-500 text-sm max-w-xl mx-auto space-y-2">
              <p className="font-bold text-navy-900">No active branches currently listed.</p>
              <p>Please contact our team directly for operating hours and appointment slots.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                        Open Daily
                      </span>
                      <span className="text-xs text-slate-400 font-medium">{branch.operating_hours}</span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-navy-900">{branch.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{branch.address}</p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">📞 {branch.phone}</span>
                    <Link href={ROUTES.APPOINTMENTS} className="font-bold text-orange-600 hover:underline">
                      Book Here →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center">
            <Link
              href={ROUTES.BRANCHES}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors"
            >
              See All Branch Details & Maps
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Contact / Inquiry Section */}
      <section id="contact" className="py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-navy-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-2xl relative overflow-hidden">
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">Have Questions or Need Assistance?</h2>
                <p className="text-slate-300 text-sm">Send us a message and our veterinary team will get back to you promptly.</p>
              </div>

              <form className="space-y-4 max-w-xl mx-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Your Full Name"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                  <input
                    type="tel"
                    placeholder="Mobile / Contact Number"
                    className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  />
                </div>
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <textarea
                  rows={3}
                  placeholder="Tell us about your pet's needs or appointment preference..."
                  className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg transition-colors cursor-pointer"
                >
                  Send Inquiry to Clinic
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Footer */}
      <footer className="bg-navy-950 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
          <div className="flex items-center gap-3">
            <LogoPreview />
            <span className="text-slate-500">|</span>
            <span>© {new Date().getFullYear()} VetClinic Furbabies & Friends. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 font-medium">
            <a href="https://www.facebook.com/furbabiesph" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
              Facebook
            </a>
            <Link href={ROUTES.LOGIN} className="hover:text-white transition-colors">
              Staff Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function LogoPreview() {
  return (
    <div className="inline-flex items-center">
      <Image
        src="/vetclinic-logo.png"
        alt="VetClinic Furbabies & Friends"
        width={160}
        height={50}
        className="h-9 w-auto object-contain"
      />
    </div>
  );
}

const SERVICES = [
  {
    title: "General Consultation",
    icon: "🩺",
    description: "Thorough physical exams, wellness assessments, disease diagnosis, and personalized treatment plans for your pet.",
  },
  {
    title: "Vaccinations & Deworming",
    icon: "💉",
    description: "Essential core vaccines (5-in-1, Rabies, Kennel Cough) and preventive deworming schedules to protect your fur babies.",
  },
  {
    title: "Surgery & Soft Tissue",
    icon: "🔬",
    description: "Safe surgical procedures including spay/neuter, wound repair, tumor removal, and emergency soft tissue surgeries.",
  },
  {
    title: "Veterinary Dental Care",
    icon: "🪥",
    description: "Professional ultrasonic scaling, polishing, tooth extraction, and oral health care to prevent gum disease.",
  },
  {
    title: "Pet Spa & Grooming",
    icon: "✂️",
    description: "Custom haircuts, medicated baths, flea & tick dips, nail trim, and ear cleaning performed by gentle pet stylists.",
  },
  {
    title: "Diagnostics & Laboratory",
    icon: "🧪",
    description: "In-house blood chemistry, CBC analysis, digital X-rays, ultrasound, and rapid test kits for quick, accurate diagnosis.",
  },
];