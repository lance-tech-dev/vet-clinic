"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<"profile" | "pets" | "appointments">("profile");

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Profile Banner / Header */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-full bg-navy-900 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-md shrink-0">
            A
          </div>
          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
              <h1 className="text-2xl font-bold text-navy-900">Anna Malijan</h1>
              <span className="inline-flex items-center self-center sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Verified Pet Owner
              </span>
            </div>
            <p className="text-sm text-slate-500">
              anna.malijan@example.com • +63 917 123 4567
            </p>
            <p className="text-xs text-slate-400">
              Member since September 2026 • Primary Branch: San Pablo City
            </p>
          </div>
          <Link
            href={ROUTES.APPOINTMENTS}
            className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            + Book Appointment
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "profile"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            Account Details
          </button>
          <button
            onClick={() => setActiveTab("pets")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "pets"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            My Fur Patients (2)
          </button>
          <button
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "appointments"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            Appointment History
          </button>
        </div>

        {/* Tab 1: Account Details */}
        {activeTab === "profile" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-navy-900 border-b border-slate-100 pb-3">
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Full Name</label>
                <p className="text-sm font-semibold text-navy-900 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  Anna Malijan
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Email Address</label>
                <p className="text-sm font-semibold text-navy-900 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  anna.malijan@example.com
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Phone Number</label>
                <p className="text-sm font-semibold text-navy-900 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  +63 917 123 4567
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">Home Address</label>
                <p className="text-sm font-semibold text-navy-900 bg-slate-50 p-3 rounded-xl border border-slate-200/80">
                  San Pablo City, Laguna
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Registered Fur Babies */}
        {activeTab === "pets" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pet Card 1 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-2xl">
                    🐕
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">Buddy</h3>
                    <p className="text-xs text-slate-500">Golden Retriever • 2 yrs old</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                  Dog
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600">
                <p><span className="font-semibold text-slate-800">Last Vaccine:</span> 5-in-1 (Aug 15, 2026)</p>
                <p><span className="font-semibold text-slate-800">Special Notes:</span> Sensitive skin, mild allergy to chicken.</p>
              </div>
            </div>

            {/* Pet Card 2 */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 font-bold flex items-center justify-center text-2xl">
                    🐈
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-navy-900">Mimi</h3>
                    <p className="text-xs text-slate-500">Siamese Cat • 1 yr old</p>
                  </div>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                  Cat
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600">
                <p><span className="font-semibold text-slate-800">Last Vaccine:</span> Anti-Rabies (Jul 10, 2026)</p>
                <p><span className="font-semibold text-slate-800">Special Notes:</span> Indoor cat, due for dental scaling.</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Appointments */}
        {activeTab === "appointments" && (
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-navy-900">Scheduled & Past Appointments</h2>
              <Link href={ROUTES.APPOINTMENTS} className="text-xs font-bold text-orange-600 hover:underline">
                New Booking +
              </Link>
            </div>
            <div className="divide-y divide-slate-100 text-sm">
              <div className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900">Buddy</span>
                    <span className="text-xs text-slate-400">• General Checkup & Grooming</span>
                  </div>
                  <p className="text-xs text-slate-500">San Pablo Main Branch • Sep 10, 2026 at 09:30 AM</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  Upcoming
                </span>
              </div>

              <div className="p-5 flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-navy-900">Mimi</span>
                    <span className="text-xs text-slate-400">• Vaccination & Deworming</span>
                  </div>
                  <p className="text-xs text-slate-500">San Pablo Main Branch • Aug 15, 2026 at 02:00 PM</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                  Completed
                </span>
              </div>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}