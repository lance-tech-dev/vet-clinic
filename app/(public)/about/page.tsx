import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            About Us & Branches
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Conveniently Located Across Laguna
          </h1>
          <p className="text-slate-600 text-sm sm:text-base">
            Visit any of our fully equipped clinic branches for top-quality veterinary care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BRANCHES.map((branch) => (
            <div key={branch.city} className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {branch.status}
                </span>
                <span className="text-xs text-slate-400 font-medium">{branch.hours}</span>
              </div>
              <div>
                <h2 className="text-lg font-bold text-navy-900">{branch.name}</h2>
                <p className="text-xs text-slate-500 mt-1">{branch.address}</p>
              </div>
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700">📞 {branch.phone}</span>
                <Link href={ROUTES.REGISTER} className="font-bold text-orange-600 hover:underline">
                  Book Here →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

const BRANCHES = [
  {
    city: "San Pablo",
    name: "Main Branch (San Pablo)",
    address: "San Pablo City, Laguna",
    hours: "8:00 AM - 6:00 PM",
    phone: "(049) 501-2345",
    status: "Open Daily",
  },
  {
    city: "Calamba",
    name: "Calamba Branch",
    address: "Calamba City, Laguna",
    hours: "8:00 AM - 6:00 PM",
    phone: "(049) 545-6789",
    status: "Open Daily",
  },
  {
    city: "Santa Rosa",
    name: "Santa Rosa Branch",
    address: "Santa Rosa City, Laguna",
    hours: "8:00 AM - 6:00 PM",
    phone: "(049) 534-8901",
    status: "Open Daily",
  },
];