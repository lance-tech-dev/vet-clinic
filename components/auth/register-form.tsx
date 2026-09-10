"use client";

import { useState, useActionState, useRef, useEffect } from "react";
import Link from "next/link";
import { signUp, type AuthActionResult } from "@/lib/auth/actions";
import { PasswordInput } from "@/components/auth/password-input";
import { ROUTES } from "@/config/constants";

const initialState: AuthActionResult = {
  error: null,
  errorStep: undefined,
  success: false,
};

export function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [state, formAction, isPending] = useActionState(signUp, initialState);

  // Pet 1 State
  const [petData, setPetData] = useState({
    name: "",
    species: "Canine",
    breed: "",
    sex: "Male",
    isNeutered: false,
    dateOfBirth: "",
    microchipNo: "",
    colorMarkings: "",
  });

  // Custom DOB Calendar State (No native browser elements)
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [calendarViewMode, setCalendarViewMode] = useState<"days" | "years">("days");
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());
  const calendarRef = useRef<HTMLDivElement>(null);

  // Render-phase state adjustment for errorStep
  const [prevErrorStep, setPrevErrorStep] = useState<1 | 2 | undefined>(undefined);
  if (state?.errorStep && state.errorStep !== prevErrorStep) {
    setPrevErrorStep(state.errorStep as 1 | 2);
    setStep(state.errorStep as 1 | 2);
  }

  // Close calendar popover on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
        setCalendarViewMode("days");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSpeciesSelect = (species: string) => {
    setPetData((prev) => ({ ...prev, species }));
  };

  // Calendar calculations
  const viewYear = calendarViewDate.getFullYear();
  const viewMonth = calendarViewDate.getMonth();

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayOfWeek = new Date(viewYear, viewMonth, 1).getDay();

  const handlePrevMonth = () => {
    setCalendarViewDate(new Date(viewYear, viewMonth - 1, 1));
  };

  const handleNextMonth = () => {
    setCalendarViewDate(new Date(viewYear, viewMonth + 1, 1));
  };

  const handleYearSelect = (year: number) => {
    setCalendarViewDate(new Date(year, viewMonth, 1));
    setCalendarViewMode("days");
  };

  const handleSelectDay = (day: number) => {
    const formattedMonth = String(viewMonth + 1).padStart(2, "0");
    const formattedDay = String(day).padStart(2, "0");
    const dobString = `${viewYear}-${formattedMonth}-${formattedDay}`;

    setPetData((prev) => ({ ...prev, dateOfBirth: dobString }));
    setIsCalendarOpen(false);
    setCalendarViewMode("days");
  };

  // Custom Year selection range (Current year back 25 years)
  const currentActualYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 26 }, (_, i) => currentActualYear - i);

  return (
    <div className="space-y-6">
      {/* Header Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-[11px] font-extrabold uppercase tracking-wider">
          <span>🐾</span>
          <span>New Client Registration</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Create Your Pet Parent Account
        </h1>
        <p className="text-xs text-slate-500 font-medium max-w-md mx-auto">
          Register your owner details and add your first fur baby profile seamlessly.
        </p>
      </div>

      {/* Interactive Step Indicator */}
      <div className="bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 grid grid-cols-2 gap-1.5">
        <button
          type="button"
          onClick={() => setStep(1)}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            step === 1
              ? "bg-white text-orange-600 shadow-2xs border border-slate-200/60"
              : "text-slate-500 hover:text-navy-900"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[11px] flex items-center justify-center shrink-0">
            1
          </span>
          <span className="truncate">Step 1: Owner Profile</span>
        </button>

        <button
          type="button"
          onClick={() => setStep(2)}
          className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
            step === 2
              ? "bg-white text-orange-600 shadow-2xs border border-slate-200/60"
              : "text-slate-500 hover:text-navy-900"
          }`}
        >
          <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-[11px] flex items-center justify-center shrink-0">
            2
          </span>
          <span className="truncate">Step 2: Pet Profile</span>
        </button>
      </div>

      {/* Error Alert Banner */}
      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      {/* Form Body */}
      <form action={formAction} className="space-y-6">
        {/* Hidden inputs required by the server action */}
        <input type="hidden" name="hasPet" value="true" />
        <input type="hidden" name="petsJson" value={JSON.stringify([petData])} />

        {/* ================= STEP 1: OWNER PROFILE & CREDENTIALS ================= */}
        <div className={step === 1 ? "space-y-4" : "hidden"}>
          <div className="flex items-center gap-2 text-xs font-extrabold text-navy-900 border-b border-slate-100 pb-2">
            <span>👤</span>
            <span>Owner Account Credentials</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="email" className="block text-xs font-bold text-slate-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="password" className="block text-xs font-bold text-slate-700">
                Account Password *
              </label>
              <PasswordInput
                id="password"
                name="password"
                required
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="fullName" className="block text-xs font-bold text-slate-700">
                Full Name *
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                placeholder="e.g. Maria Santos"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="phone" className="block text-xs font-bold text-slate-700">
                Mobile Contact Number *
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                placeholder="e.g. 09171234567"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="address" className="block text-xs font-bold text-slate-700">
              Home Address *
            </label>
            <input
              id="address"
              name="address"
              type="text"
              required
              placeholder="e.g. Brgy. San Rafael, San Pablo City, Laguna"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>

          {/* Optional Handler Block */}
          <div className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 block">
              Authorized Pet Handler (Optional)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                name="handlerName"
                type="text"
                placeholder="Handler Name"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-navy-900"
              />
              <input
                name="handlerRelationship"
                type="text"
                placeholder="Relationship"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-navy-900"
              />
              <input
                name="handlerPhone"
                type="tel"
                placeholder="Contact Number"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium text-navy-900"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-full py-3.5 px-6 rounded-2xl bg-navy-900 hover:bg-navy-800 text-white font-extrabold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Proceed to Step 2: Pet Profile</span>
            <span>➔</span>
          </button>
        </div>

        {/* ================= STEP 2: PET PROFILE ================= */}
        <div className={step === 2 ? "space-y-4" : "hidden"}>
          <div className="flex items-center gap-2 text-xs font-extrabold text-navy-900 border-b border-slate-100 pb-2">
            <span>🐾</span>
            <span>First Fur Baby Details</span>
          </div>

          {/* Species Selector Badges */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-slate-700">
              Pet Species *
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { label: "Canine", icon: "🐶" },
                { label: "Feline", icon: "🐱" },
                { label: "Avian", icon: "🦜" },
                { label: "Rabbit", icon: "🐰" },
                { label: "Other", icon: "🐾" },
              ].map((s) => {
                const isSelected = petData.species === s.label;
                return (
                  <button
                    key={s.label}
                    type="button"
                    onClick={() => handleSpeciesSelect(s.label)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1.5 border ${
                      isSelected
                        ? "bg-orange-500 text-white border-orange-500 shadow-xs"
                        : "bg-slate-50 text-navy-900 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="petName" className="block text-xs font-bold text-slate-700">
                Pet Name *
              </label>
              <input
                id="petName"
                type="text"
                required={step === 2}
                value={petData.name}
                onChange={(e) => setPetData({ ...petData, name: e.target.value })}
                placeholder="e.g. Buddy, Maru, Coco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div className="space-y-1">
              <label htmlFor="petBreed" className="block text-xs font-bold text-slate-700">
                Breed (Optional)
              </label>
              <input
                id="petBreed"
                type="text"
                value={petData.breed}
                onChange={(e) => setPetData({ ...petData, breed: e.target.value })}
                placeholder="e.g. Golden Retriever, Persian"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label htmlFor="petGender" className="block text-xs font-bold text-slate-700">
                Gender *
              </label>
              <select
                id="petGender"
                required={step === 2}
                value={petData.sex}
                onChange={(e) => setPetData({ ...petData, sex: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            {/* Fully Custom Modern DOB Calendar Selection */}
            <div className="space-y-1 relative" ref={calendarRef}>
              <label className="block text-xs font-bold text-slate-700">
                Date of Birth *
              </label>
              <button
                type="button"
                onClick={() => {
                  setIsCalendarOpen(!isCalendarOpen);
                  setCalendarViewMode("days");
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 flex items-center justify-between hover:bg-slate-100/80 focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all cursor-pointer"
              >
                <span className={petData.dateOfBirth ? "text-navy-900 font-bold" : "text-slate-400"}>
                  {petData.dateOfBirth || "Select Date of Birth"}
                </span>
                <svg className="w-4 h-4 text-orange-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 0v4m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>

              {/* Custom Popover Container */}
              {isCalendarOpen && (
                <div className="absolute right-0 sm:left-0 top-full mt-2 z-50 w-72 bg-white rounded-2xl border border-slate-200 shadow-xl p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                  {/* Header Navigation Controls */}
                  <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer text-xs"
                      aria-label="Previous month"
                    >
                      ◀
                    </button>

                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-extrabold text-navy-900">
                        {monthNames[viewMonth]}
                      </span>

                      {/* Custom Interactive Year Badge Trigger (No native <select> tag!) */}
                      <button
                        type="button"
                        onClick={() => setCalendarViewMode(calendarViewMode === "years" ? "days" : "years")}
                        className="px-2 py-0.5 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 border border-orange-200 text-xs font-extrabold transition-all cursor-pointer flex items-center gap-1"
                        title="Click to change year"
                      >
                        <span>{viewYear}</span>
                        <svg className={`w-3 h-3 transition-transform ${calendarViewMode === "years" ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer text-xs"
                      aria-label="Next month"
                    >
                      ▶
                    </button>
                  </div>

                  {/* VIEW MODE A: Custom Scrollable Year Grid Picker */}
                  {calendarViewMode === "years" ? (
                    <div className="space-y-2">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">
                        Select Birth Year
                      </div>
                      <div className="grid grid-cols-3 gap-1.5 max-h-48 overflow-y-auto pr-1">
                        {yearOptions.map((y) => {
                          const isSelectedYear = y === viewYear;
                          return (
                            <button
                              key={y}
                              type="button"
                              onClick={() => handleYearSelect(y)}
                              className={`py-2 px-1 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                isSelectedYear
                                  ? "bg-orange-500 text-white shadow-xs font-black"
                                  : "bg-slate-50 hover:bg-orange-50 text-slate-700 hover:text-orange-600"
                              }`}
                            >
                              {y}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    /* VIEW MODE B: Standard Calendar Days Grid */
                    <div className="space-y-2">
                      <div className="grid grid-cols-7 text-center text-[10px] font-bold text-slate-400">
                        <span>Su</span>
                        <span>Mo</span>
                        <span>Tu</span>
                        <span>We</span>
                        <span>Th</span>
                        <span>Fr</span>
                        <span>Sa</span>
                      </div>

                      <div className="grid grid-cols-7 gap-1 text-center">
                        {Array.from({ length: firstDayOfWeek }).map((_, idx) => (
                          <div key={`empty-${idx}`} />
                        ))}

                        {Array.from({ length: daysInMonth }).map((_, idx) => {
                          const dayNum = idx + 1;
                          const formattedMonth = String(viewMonth + 1).padStart(2, "0");
                          const formattedDay = String(dayNum).padStart(2, "0");
                          const dateStr = `${viewYear}-${formattedMonth}-${formattedDay}`;

                          const isSelected = petData.dateOfBirth === dateStr;

                          return (
                            <button
                              key={dayNum}
                              type="button"
                              onClick={() => handleSelectDay(dayNum)}
                              className={`py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                                isSelected
                                  ? "bg-orange-500 text-white shadow-xs font-black"
                                  : "hover:bg-orange-50 text-slate-700 hover:text-orange-600"
                              }`}
                            >
                              {dayNum}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label htmlFor="petColor" className="block text-xs font-bold text-slate-700">
                Color / Markings *
              </label>
              <input
                id="petColor"
                type="text"
                required={step === 2}
                value={petData.colorMarkings}
                onChange={(e) => setPetData({ ...petData, colorMarkings: e.target.value })}
                placeholder="e.g. White w/ Black Spots"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="microchipNo" className="block text-xs font-bold text-slate-700">
              Microchip No. / Medical Notes (Optional)
            </label>
            <input
              id="microchipNo"
              type="text"
              value={petData.microchipNo}
              onChange={(e) => setPetData({ ...petData, microchipNo: e.target.value })}
              placeholder="e.g. 981020000123456 or special notes..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-1/3 py-3.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
            >
              ← Back
            </button>

            <button
              type="submit"
              disabled={isPending}
              className="w-2/3 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <div className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </div>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <span>🐾</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Footer Link */}
      <div className="pt-2 text-center text-xs font-semibold text-slate-500 border-t border-slate-100">
        <span>Already have an account? </span>
        <Link
          href={ROUTES.LOGIN}
          className="font-extrabold text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-colors"
        >
          Sign In Here
        </Link>
      </div>
    </div>
  );
}