import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
            <span>🐾</span> About VetClinic Furbabies & Friends
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
            Dedicated to the Health, Healing, & Happiness of Your <span className="text-orange-500">Fur Babies</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Founded with a passion for animal wellness, we combine advanced medical technology with gentle, compassionate care to ensure your pets live long, healthy, and happy lives.
          </p>
        </div>
      </section>

      {/* 2. Our Story & Mission */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Story Text */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                Our Journey
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-navy-900 tracking-tight">
                Setting New Standards for Veterinary Excellence in Laguna
              </h2>
              
              <div className="space-y-4 text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                <p>
                  At <strong>VetClinic Furbabies & Friends</strong>, we understand that pets are not just animals—they are cherished members of your family. What started as a single clinic driven by a mission to elevate animal care has expanded into a premier veterinary network serving pet parents across San Pablo, Calamba, Santa Rosa, and surrounding communities.
                </p>
                <p>
                  Our modern facilities are equipped with state-of-the-art diagnostic laboratories, digital imaging, surgical suites, and specialized pet spa amenities. Whether it’s a routine wellness exam, emergency surgery, or preventive grooming, our veterinary professionals treat every patient with the patience, skill, and affection they deserve.
                </p>
              </div>

              {/* Quick Trust Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-2xl font-extrabold text-navy-900">10,000+</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Pets Treated</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                  <div className="text-2xl font-extrabold text-navy-900">100%</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Licensed Vets</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 col-span-2 sm:col-span-1">
                  <div className="text-2xl font-extrabold text-navy-900">4.9 ★</div>
                  <div className="text-xs text-slate-500 font-medium mt-1">Pet Parent Rating</div>
                </div>
              </div>
            </div>

            {/* Mission & Vision Card */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-gradient-to-br from-navy-900 to-slate-900 text-white p-8 rounded-3xl shadow-xl space-y-6">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold text-xl mb-3">
                    🎯
                  </div>
                  <h3 className="text-xl font-bold">Our Mission</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    To deliver compassionate, comprehensive, and accessible veterinary healthcare that empowers pet owners and guarantees the highest quality of life for every companion.
                  </p>
                </div>

                <div className="h-[1px] bg-slate-800" />

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold text-xl mb-3">
                    👁️
                  </div>
                  <h3 className="text-xl font-bold">Our Vision</h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                    To be the most trusted and progressive veterinary care institution in the region, recognized for clinical excellence, innovative technology, and a warm, human-centric approach.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Core Values Grid */}
      <section className="py-16 sm:py-20 bg-slate-50 border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Our Core Principles
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Built on Love, Integrity, and Science
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              The fundamental standards that guide our clinical decisions and client care every single day.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CORE_VALUES.map((value) => (
              <div
                key={value.title}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-lg transition-all duration-300 space-y-4"
              >
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl font-bold">
                  {value.icon}
                </div>
                <h3 className="text-lg font-bold text-navy-900">{value.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Why Pet Parents Choose Us */}
      <section className="py-16 sm:py-20 bg-white border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-50 p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-8 space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-100 px-3 py-1 rounded-full border border-orange-200">
                Multiple Convenient Locations
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900">
                Looking for a Clinic Near You?
              </h2>
              <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                We operate multiple active branches across Laguna, offering flexible schedules, emergency triage, and easy online appointment booking.
              </p>
            </div>

            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-end">
              <Link
                href={ROUTES.BRANCHES}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-navy-900 hover:bg-navy-800 text-white font-bold text-sm shadow-md transition-all"
              >
                Explore All Branches →
              </Link>
              <Link
                href={ROUTES.APPOINTMENTS}
                className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all"
              >
                Book Appointment
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-navy-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Give Your Pet the Care They Deserve
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Schedule a consultation or wellness checkup today with our expert veterinary team.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-4">
            <Link
              href={ROUTES.APPOINTMENTS}
              className="px-8 py-3.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
            >
              Book an Appointment Now
            </Link>
            <Link
              href={ROUTES.CONTACT}
              className="px-8 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const CORE_VALUES = [
  {
    icon: "❤️",
    title: "Compassion First",
    description: "Every pet is treated with gentle care, empathy, and affection as if they were our very own.",
  },
  {
    icon: "🩺",
    title: "Clinical Excellence",
    description: "Our licensed veterinarians uphold rigorous medical standards, continuous learning, and evidence-based care.",
  },
  {
    icon: "🤝",
    title: "Honest Transparency",
    description: "We provide clear diagnoses, transparent pricing, and open communication with pet parents at every step.",
  },
  {
    icon: "🏥",
    title: "Modern Innovation",
    description: "Equipped with diagnostic technology, digital imaging, and comfortable recovery wards for ultimate safety.",
  },
];