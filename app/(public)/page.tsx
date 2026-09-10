import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export const revalidate = 0;

export default async function HomePage() {
  const supabase = await createClient();

  // Fetch active clinic branches configured by admin
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const branches = rawBranches || [];
  const branchCount = branches.length;

  return (
    <main className="min-h-screen bg-slate-50 text-navy-900 selection:bg-orange-500 selection:text-white">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-28 bg-gradient-to-b from-orange-50/60 via-slate-50 to-slate-50 border-b border-slate-200/60">
        {/* Decorative Background Glows */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-orange-200/30 to-amber-200/30 blur-3xl pointer-events-none rounded-full"
          aria-hidden="true"
        />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-100/80 border border-orange-200 text-orange-800 text-xs font-extrabold shadow-2xs">
              <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-pulse" />
              <span>Compassionate & Professional Veterinary Care</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-navy-900 tracking-tight leading-[1.1]">
              Expert Healthcare for Your{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 bg-clip-text text-transparent">
                Beloved Fur Babies
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 font-medium leading-relaxed max-w-2xl mx-auto">
              From routine wellness checkups and emergency surgeries to gentle grooming and digital medical records—we provide total care for your pets across multiple branches.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                href={ROUTES.APPOINTMENTS}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/35 hover:scale-[1.02] active:scale-95 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>📅 Book Appointment</span>
                <span>➔</span>
              </Link>

              <Link
                href={ROUTES.SERVICES}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-slate-100 text-navy-900 font-extrabold text-sm border border-slate-200 shadow-2xs hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span>🏥 Explore Services</span>
              </Link>
            </div>
          </div>

          {/* Hero Stats Glass Banner */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 pt-8 max-w-5xl mx-auto">
            {[
              { stat: "10,000+", label: "Pets Cared For", icon: "🐾" },
              { stat: "4.9", label: "Parent Rating", icon: "⭐" },
              {
                stat: branchCount > 0 ? `${branchCount} Location${branchCount === 1 ? "" : "s"}` : "Multiple",
                label: "Clinic Branches",
                icon: "🏥",
              },
              { stat: "Licensed", label: "DVM Specialists", icon: "🩺" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white/80 backdrop-blur-md p-5 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all text-center space-y-1"
              >
                <div className="text-2xl mb-1">{item.icon}</div>
                <div className="text-xl sm:text-2xl font-black text-navy-900">
                  {item.stat}
                </div>
                <div className="text-xs font-semibold text-slate-500">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. VALUE PILLARS / WHY CHOOSE US */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Why FurBabies & Friends?
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Standard of Excellence in Veterinary Medicine
            </h2>
            <p className="text-sm text-slate-600">
              We combine modern clinical diagnostics with genuine warmth so every visit is comfortable and stress-free.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Emergency Readiness",
                desc: "Immediate clinical intervention and triage for critical health cases when your pet needs urgent care.",
                icon: "🚨",
                color: "bg-red-50 text-red-600 border-red-100",
              },
              {
                title: "Certified DVM Vets",
                desc: "Experienced Doctor of Veterinary Medicine practitioners dedicated to personalized patient treatment.",
                icon: "🩺",
                color: "bg-orange-50 text-orange-600 border-orange-100",
              },
              {
                title: "Digital Health Records",
                desc: "Access your pet's complete vaccination logs, dental charts, and visit records online anytime.",
                icon: "📋",
                color: "bg-emerald-50 text-emerald-600 border-emerald-100",
              },
              {
                title: "Multi-Branch Network",
                desc: "Conveniently located clinic branches with synchronized patient records across all sites.",
                icon: "🏢",
                color: "bg-blue-50 text-blue-600 border-blue-100",
              },
            ].map((pillar, idx) => (
              <div
                key={idx}
                className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all duration-200 space-y-3 group"
              >
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl border ${pillar.color} group-hover:scale-110 transition-transform`}
                >
                  {pillar.icon}
                </div>
                <h3 className="text-base font-bold text-navy-900">
                  {pillar.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {pillar.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. FEATURED SERVICES HIGHLIGHT */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Core Clinical Offerings
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
                Comprehensive Care for Dogs, Cats & Small Animals
              </h2>
            </div>
            <Link
              href={ROUTES.SERVICES}
              className="inline-flex items-center gap-2 text-xs font-extrabold text-orange-600 hover:text-orange-700 bg-orange-50 hover:bg-orange-100 px-5 py-2.5 rounded-full border border-orange-200/80 transition-colors w-fit shrink-0"
            >
              <span>View All Services Catalog</span>
              <span>➔</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: "General Consultation & Checkup",
                desc: "Thorough physical examination, vital checks, and preventative wellness plans for pets of all ages.",
                tag: "Essential Care",
                icon: "🩺",
              },
              {
                name: "Vaccination & Preventatives",
                desc: "Core canine and feline vaccines, deworming, and tick/flea parasite protection protocols.",
                tag: "Prevention",
                icon: "💉",
              },
              {
                name: "Full Dental Exam & Cleaning",
                desc: "Ultrasonic scaling, dental charting, periodontal care, and oral hygiene treatments.",
                tag: "Oral Health",
                icon: "🪥",
              },
              {
                name: "Grooming & Hygiene Spa",
                desc: "Medicated baths, hair trimming, nail clipping, ear cleaning, and sanitary maintenance.",
                tag: "Wellness & Grooming",
                icon: "✂️",
              },
              {
                name: "Soft Tissue Surgery & Neutering",
                desc: "Sterile surgical suite for spaying, neutering, mass removal, and minor surgical procedures.",
                tag: "Surgery",
                icon: "🏥",
              },
              {
                name: "Pet Boarding & Monitoring",
                desc: "Safe, climate-controlled, supervised accommodations for pets during travel or recuperation.",
                tag: "Boarding",
                icon: "🏠",
              },
            ].map((service, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-200 space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl p-2 bg-orange-50 rounded-2xl border border-orange-100 group-hover:scale-105 transition-transform">
                      {service.icon}
                    </span>
                    <span className="text-[11px] font-extrabold text-orange-700 bg-orange-50 px-2.5 py-0.5 rounded-full border border-orange-200">
                      {service.tag}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {service.desc}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={ROUTES.APPOINTMENTS}
                    className="text-xs font-extrabold text-navy-900 hover:text-orange-600 flex items-center gap-1 transition-colors"
                  >
                    <span>Book This Service</span>
                    <span>➔</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DYNAMIC BRANCH LOCATOR QUICK-VIEW */}
      <section className="py-16 sm:py-24 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Convenient Locations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Visit Our Nearby Clinic Branches
            </h2>
            <p className="text-sm text-slate-600">
              Equipped with modern facilities and friendly staff ready to welcome you and your pet.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {branches.length > 0 ? (
              branches.map((branch) => (
                <div
                  key={branch.id}
                  className="bg-slate-50/80 p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Open Today</span>
                      </span>
                      <span className="text-xs font-bold text-slate-400">
                        📍 {branch.city || "San Pablo City"}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-navy-900">
                      {branch.name}
                    </h3>

                    <div className="text-xs text-slate-600 space-y-1.5">
                      <p className="flex items-start gap-2">
                        <span>📌</span>
                        <span>{branch.address}</span>
                      </p>
                      <p className="flex items-center gap-2">
                        <span>⏰</span>
                        <span>{branch.operating_hours || "Mon - Sat: 8:00 AM - 6:00 PM"}</span>
                      </p>
                      <p className="flex items-center gap-2 font-bold text-navy-900">
                        <span>📞</span>
                        <span>{branch.phone || "Contact Branch"}</span>
                      </p>
                    </div>
                  </div>

                  <Link
                    href={ROUTES.BRANCHES}
                    className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 text-navy-900 font-bold text-xs border border-slate-200 text-center transition-colors block"
                  >
                    View Branch Details & Map ➔
                  </Link>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-slate-50 p-8 rounded-3xl border border-slate-200/80 text-center space-y-2">
                <p className="text-sm font-bold text-navy-900">No active clinic branches listed at this time.</p>
                <p className="text-xs text-slate-500">Please check back later or contact us directly.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 5. PARENT TESTIMONIALS */}
      <section className="py-16 sm:py-24 bg-slate-50 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Parent Feedback
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
              Trusted by Hundreds of Local Pet Families
            </h2>
            <p className="text-sm text-slate-600">
              Read real stories from pet owners who trust us with their dogs and cats.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote:
                  "The doctors were so gentle with my Golden Retriever, Buddy. Their online portal made booking and checking vaccine history super easy!",
                author: "Maria Santos",
                pet: "Owner of Buddy (Golden Retriever)",
                rating: "⭐⭐⭐⭐⭐",
              },
              {
                quote:
                  "Extremely clean facilities and compassionate staff. They handled my cat's dental procedure smoothly with thorough post-care updates.",
                author: "Juan Dela Cruz",
                pet: "Owner of Maru (Persian Cat)",
                rating: "⭐⭐⭐⭐⭐",
              },
              {
                quote:
                  "Best vet clinic in San Pablo! The emergency team acted quickly when my puppy needed urgent care. I cannot thank them enough.",
                author: "Elena Reyes",
                pet: "Owner of Coco (Poodle)",
                rating: "⭐⭐⭐⭐⭐",
              },
            ].map((review, idx) => (
              <div
                key={idx}
                className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="text-xs">{review.rating}</div>
                  <p className="text-xs text-slate-600 italic leading-relaxed">
                    &ldquo;{review.quote}&rdquo;
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <div className="text-xs font-extrabold text-navy-900">
                    {review.author}
                  </div>
                  <div className="text-[11px] font-medium text-orange-600">
                    {review.pet}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. BOTTOM BOOKING CTA BANNER */}
      <section className="py-16 sm:py-20 bg-gradient-to-r from-navy-950 via-slate-900 to-navy-900 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 relative z-10">
          <span className="text-3xl">🐾</span>
          <h2 className="text-3xl sm:text-4xl font-black tracking-tight max-w-2xl mx-auto">
            Ready to Give Your Pet the Healthcare They Deserve?
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Schedule a visit at any of our branches in just a few clicks. Fast online booking with instant confirmation.
          </p>
          <div className="pt-2">
            <Link
              href={ROUTES.APPOINTMENTS}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 hover:scale-105 transition-all"
            >
              <span>Schedule Appointment Now</span>
              <span>➔</span>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
