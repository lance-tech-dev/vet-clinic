"use client";

import { useState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";

export default function PublicAppointmentsPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center space-y-3 mb-10">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
            Online Booking
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-navy-900 tracking-tight">
            Schedule a Visit for Your Fur Baby
          </h1>
          <p className="text-slate-600 text-sm sm:text-base max-w-xl mx-auto">
            Select your preferred branch, service, and schedule. Our staff will confirm your appointment shortly.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200/80 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <h2 className="text-2xl font-bold text-navy-900">Appointment Request Received!</h2>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you for booking with VetClinic Furbabies & Friends. Our clinic team will reach out to confirm your slot via SMS or phone call.
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-3">
              <button
                onClick={() => setSubmitted(false)}
                className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
              >
                Book Another Appointment
              </button>
              <Link
                href={ROUTES.HOME}
                className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold shadow-xs transition-colors"
              >
                Return to Home
              </Link>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-6"
          >
            {/* Step 1: Branch & Service Selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                1. Clinic & Service
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Branch *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Branch...</option>
                    <option value="san-pablo">San Pablo City (Main)</option>
                    <option value="calamba">Calamba City</option>
                    <option value="santa-rosa">Santa Rosa City</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Service Required *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Service...</option>
                    <option value="consultation">General Consultation</option>
                    <option value="vaccination">Vaccination & Deworming</option>
                    <option value="grooming">Pet Grooming & Spa</option>
                    <option value="dental">Dental Scaling & Care</option>
                    <option value="surgery">Surgery / Medical Procedure</option>
                    <option value="lab">Lab Diagnostics / X-Ray</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 2: Date & Time */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                2. Preferred Schedule
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Time Slot *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="">Select Time...</option>
                    <option value="08:00">08:00 AM - 10:00 AM</option>
                    <option value="10:00">10:00 AM - 12:00 PM</option>
                    <option value="13:00">01:00 PM - 03:00 PM</option>
                    <option value="15:00">03:00 PM - 05:00 PM</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Step 3: Owner & Pet Info */}
            <div className="space-y-4">
              <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider text-slate-400 border-b border-slate-100 pb-2">
                3. Pet Parent & Patient Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Owner Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Maria Santos"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 09171234567"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Buddy"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Pet Species & Breed *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dog (Golden Retriever)"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Additional Notes / Symptoms (Optional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe any symptoms, medical concerns, or grooming requests..."
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all active:scale-98 cursor-pointer"
            >
              Confirm Appointment Booking
            </button>
          </form>
        )}
      </div>
    </main>
  );
}