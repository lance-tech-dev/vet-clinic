import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Hero Banner */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
            <span>✨</span> World-Class Veterinary Care
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
            Comprehensive Medical & Wellness Services for Your <span className="text-orange-500">Fur Babies</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            From routine wellness checkups and advanced surgical procedures to gentle grooming and emergency triage—our licensed medical team delivers exceptional care tailored to every stage of your pet&apos;s life.
          </p>

          <div className="pt-4 flex justify-center">
            <Link
              href={ROUTES.APPOINTMENTS}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all transform active:scale-98"
            >
              Book Service Appointment
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Detailed Services Grid */}
      <section className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Our Clinical Offerings
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
              Tailored Care for Dogs, Cats, & Exotic Pets
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              Explore our full suite of medical diagnostics, preventative care, surgical interventions, and pampering spa services.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {SERVICES_DIRECTORY.map((service) => (
              <div
                key={service.id}
                className="bg-slate-50/80 p-8 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-xl hover:bg-white hover:border-orange-200/80 transition-all duration-300 flex flex-col justify-between group"
              >
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-2xl group-hover:bg-orange-500 group-hover:text-white transition-colors shadow-2xs">
                      {service.icon}
                    </div>
                    <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-slate-200/60 text-slate-700 uppercase tracking-wider">
                      {service.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-navy-900 group-hover:text-orange-600 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal mt-2">
                      {service.description}
                    </p>
                  </div>

                  {/* Highlights Checklist */}
                  <div className="pt-2 border-t border-slate-200/60">
                    <h4 className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
                      Service Highlights:
                    </h4>
                    <ul className="space-y-1.5">
                      {service.highlights.map((item, idx) => (
                        <li key={idx} className="flex items-center gap-2 text-xs text-slate-700 font-semibold">
                          <span className="text-emerald-500 font-bold">✓</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-200/60 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">
                    {service.availability}
                  </span>
                  <Link
                    href={ROUTES.APPOINTMENTS}
                    className="inline-flex items-center gap-1 font-bold text-xs text-orange-600 hover:text-orange-700 hover:underline"
                  >
                    Book Now →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why Our Clinical Care Stands Out */}
      <section className="py-16 sm:py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              The VetClinic Difference
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Why Pet Parents Trust Us With Their Family
            </h2>
            <p className="text-slate-600 text-sm sm:text-base">
              We go beyond basic treatments to ensure every visit is a comfortable, stress-free experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 font-bold flex items-center justify-center text-2xl">
                🛡️
              </div>
              <h3 className="text-lg font-bold text-navy-900">Fear-Free Handling</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Our staff is trained in low-stress restraint and gentle examination techniques to minimize anxiety for nervous dogs and cats.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-600 font-bold flex items-center justify-center text-2xl">
                🔬
              </div>
              <h3 className="text-lg font-bold text-navy-900">Advanced In-House Testing</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                With digital X-rays and rapid laboratory analyzers on-site, we deliver accurate diagnostic results within minutes, not days.
              </p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-600 font-bold flex items-center justify-center text-2xl">
                💬
              </div>
              <h3 className="text-lg font-bold text-navy-900">Transparent Treatment Plans</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                We clearly explain diagnostic options, procedures, and costs upfront so you can make informed decisions for your pet.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Frequently Asked Questions (FAQ) */}
      <section className="py-16 sm:py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
              Got Questions?
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-4">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2"
              >
                <h3 className="text-base font-bold text-navy-900">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <section className="py-16 bg-navy-950 text-white border-t border-slate-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Schedule Your Pet&apos;s Visit?
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-xl mx-auto font-normal">
            Choose your preferred clinic branch and time slot. Our veterinary team is ready to care for your companion.
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
              Inquire via Message
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

const SERVICES_DIRECTORY = [
  {
    id: "consultation",
    badge: "Routine & Emergency",
    title: "General Consultation & Exams",
    icon: "🩺",
    description:
      "Comprehensive physical health exams, disease screening, nutritional consultations, and senior pet care assessments.",
    highlights: ["Complete vital checks", "Nutritional guidance", "Preventative health plans"],
    availability: "Available Daily",
  },
  {
    id: "vaccines",
    badge: "Preventative",
    title: "Vaccinations & Deworming",
    icon: "💉",
    description: "Essential core immunization protection (5-in-1, 8-in-1, Rabies, Kennel Cough) and internal parasite treatments.",
    highlights: ["Core puppy/kitten series", "Annual booster shots", "Preventative deworming"],
    availability: "Walk-ins & Appointments",
  },
  {
    id: "surgery",
    badge: "Surgical Suite",
    title: "Soft Tissue & Surgery",
    icon: "🔬",
    description: "Sterile surgical procedures including routine spay/neuter, wound repair, mass extractions, and emergency surgery.",
  highlights: ["Safe gas anesthesia", "Continuous vital monitoring", "Post-op pain management"],
    availability: "By Appointment",
  },
  {
    id: "dental",
    badge: "Oral Care",
    title: "Veterinary Dental Scaling",
    icon: "🪥",
    description: "Ultrasonic tartar removal, tooth polishing, extractions, and treatment for periodontal disease and bad breath.",
    highlights: ["Ultrasonic plaque removal", "Enamel polishing", "Oral infection treatment"],
    availability: "By Appointment",
  },
  {
    id: "grooming",
    badge: "Pet Spa",
    title: "Grooming & Styling Spa",
    icon: "✂️",
    description: "Relaxing pampering sessions including medicated baths, breed haircuts, flea/tick treatments, nail trim, and ear cleaning.",
    highlights: ["Medicated skin baths", "Custom breed styling", "Nail & ear maintenance"],
    availability: "Daily Booking Slots",
  },
  {
    id: "diagnostics",
    badge: "Laboratory",
    title: "Diagnostics & Digital X-Ray",
    icon: "🧪",
    description: "In-house blood chemistry, Complete Blood Count (CBC), digital X-ray imaging, ultrasound, and rapid viral test kits.",
    highlights: ["Rapid blood chemistry", "High-res digital X-ray", "Parvo/Distemper test kits"],
    availability: "Immediate Processing",
  },
  {
    id: "pharmacy",
    badge: "In-House",
    title: "Pharmacy & Prescriptions",
    icon: "💊",
    description: "Fully stocked veterinary pharmacy supplying anti-parasitics, antibiotics, prescription diet pet food, and supplements.",
    highlights: ["Prescription medications", "Specialized diet food", "Vitamins & supplements"],
    availability: "Open Daily",
  },
  {
    id: "boarding",
    badge: "Accommodations",
    title: "Pet Boarding & Daycare",
    icon: "🏨",
    description: "Clean, comfortable, climate-controlled boarding suites with 24/7 veterinary supervision while you are away.",
    highlights: ["Climate-controlled rooms", "Supervised play areas", "Medical boarding options"],
    availability: "Reservation Required",
  },
  {
    id: "emergency",
    badge: "Priority Triage",
    title: "Emergency Triage & Care",
    icon: "🚨",
    description: "Immediate medical stabilization for traumatic injuries, toxin ingestion, heatstroke, and acute illnesses.",
    highlights: ["Oxygen therapy", "IV fluid resuscitation", "Critical care monitoring"],
    availability: "Priority Walk-in Care",
  },
];

const FAQS = [
  {
    question: "Do I need an appointment for routine consultations or grooming?",
    answer:
      "While we accept walk-in consultations based on daily availability, we strongly recommend booking an online appointment in advance to secure your preferred time slot and minimize wait times.",
  },
  {
    question: "What should I bring for my pet's first visit?",
    answer:
      "Please bring any past vaccination records, medical history, or current medication details. For safety, dogs must be on a leash and cats should be in a secure pet carrier.",
  },
  {
    question: "How should I prepare my pet for surgery or dental scaling?",
    answer:
      "Most surgical and dental procedures require fasting (no food) for 8 to 12 hours prior to anesthesia. Specific pre-op instructions will be provided by our staff upon booking.",
  },
  {
    question: "Which clinic branches offer grooming and diagnostic labs?",
    answer:
      "All active VetClinic Furbabies & Friends branches in San Pablo, Calamba, and Santa Rosa are equipped with pet spa amenities and diagnostic equipment.",
  },
];