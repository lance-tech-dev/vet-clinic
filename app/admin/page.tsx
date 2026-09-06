import Link from "next/link";

export default function AdminDashboardPage() {
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
            Real-time daily operations, fur patient statistics, and appointment management.
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
            Add Fur Patient
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
            <div className="text-3xl font-extrabold text-navy-900">12</div>
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <span>↑ 8%</span>
              <span className="text-slate-400">vs yesterday</span>
            </p>
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
            <div className="text-3xl font-extrabold text-navy-900">1,284</div>
            <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center gap-1">
              <span>↑ 24 new</span>
              <span className="text-slate-400">this month</span>
            </p>
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
            <div className="text-3xl font-extrabold text-navy-900">892</div>
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
        {/* Left Column: Today's Appointments Feed (2 Cols Wide) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-navy-900">Today&apos;s Appointments</h2>
              <p className="text-xs text-slate-500">Scheduled visits for today</p>
            </div>
            <Link
              href="/admin/appointments"
              className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
            >
              View All →
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Sample Appointment Row 1 */}
            <div className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-sm">
                  🐕
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Buddy</h3>
                  <p className="text-xs text-slate-500">Golden Retriever • Owner: Juan Dela Cruz</p>
                  <span className="inline-block mt-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    Vaccination & Annual Checkup
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-navy-900 block">09:30 AM</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 mt-1">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Sample Appointment Row 2 */}
            <div className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center text-sm">
                  🐈
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Mimi</h3>
                  <p className="text-xs text-slate-500">Siamese Cat • Owner: Maria Santos</p>
                  <span className="inline-block mt-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    Dental Cleaning
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-navy-900 block">11:00 AM</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 mt-1">
                  Completed
                </span>
              </div>
            </div>

            {/* Sample Appointment Row 3 */}
            <div className="p-5 flex items-center justify-between hover:bg-slate-50/60 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-sm">
                  🐶
                </div>
                <div>
                  <h3 className="text-sm font-bold text-navy-900">Rocky</h3>
                  <p className="text-xs text-slate-500">Shih Tzu • Owner: Alex Reyes</p>
                  <span className="inline-block mt-1 text-xs text-slate-600 font-medium bg-slate-100 px-2 py-0.5 rounded-md">
                    Grooming & Anti-flea Treatment
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-navy-900 block">02:15 PM</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 mt-1">
                  In Progress
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Quick Status & Messages Sidebar (1 Col Wide) */}
        <div className="space-y-6">
          {/* Quick Branch Status */}
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

          {/* Messages Alert Box */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-base font-bold text-navy-900">Recent Inquiries</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                2 New
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Client messages submitted through the public contact form.
            </p>
            <Link
              href="/admin/messages"
              className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 bg-slate-50 hover:bg-slate-100 text-navy-900 font-semibold text-xs rounded-xl border border-slate-200 transition-colors"
            >
              Go to Inbox →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}