import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Our Services
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Comprehensive Care for Every Stage of Life
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Dedicated veterinary medical treatments designed to keep your companions healthy, happy, and vibrant.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-2xl mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-xl font-bold text-navy-900 mb-2">{service.title}</h3>
              <p className="text-sm text-slate-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href={ROUTES.REGISTER}
            className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-base shadow-lg shadow-orange-500/25 transition-all"
          >
            Book an Appointment
          </Link>
        </div>
      </div>
    </main>
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