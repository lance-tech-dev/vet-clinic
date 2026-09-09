"use client";

import { useState, useRef, useEffect, useActionState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { createAppointment, type BookingFormState } from "./actions";

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  operating_hours: string;
  is_active: boolean;
}

interface AppointmentFormProps {
  branches: Branch[];
}

const SERVICES_OPTIONS = [
  { id: "General Health Consultation", label: "General Health Consultation", icon: "🩺", desc: "Routine health checks & diagnoses" },
  { id: "Vaccination & Deworming", label: "Vaccination & Deworming", icon: "💉", desc: "Core vaccines & parasite protection" },
  { id: "Pet Spa & Grooming", label: "Pet Spa & Grooming", icon: "✂️", desc: "Styling, medicated baths & nail trim" },
  { id: "Dental Scaling & Care", label: "Dental Scaling & Oral Care", icon: "🪥", desc: "Ultrasonic tartar removal & oral care" },
  { id: "Surgical Procedure", label: "Surgical Procedure / Soft Tissue", icon: "🔬", desc: "Sterile surgery & soft tissue repair" },
  { id: "Diagnostics & X-Ray", label: "Lab Diagnostics & Digital X-Ray", icon: "🧪", desc: "In-house blood chemistry & digital X-rays" },
];

const TIME_SLOTS = [
  { id: "08:00 AM - 10:00 AM", label: "08:00 AM - 10:00 AM", period: "Morning" },
  { id: "10:00 AM - 12:00 PM", label: "10:00 AM - 12:00 PM", period: "Midday" },
  { id: "01:00 PM - 03:00 PM", label: "01:00 PM - 03:00 PM", period: "Afternoon" },
  { id: "03:00 PM - 05:00 PM", label: "03:00 PM - 05:00 PM", period: "Late Afternoon" },
];

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
const DAY_NAMES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const initialFormState: BookingFormState = {
  error: null,
  success: false,
};

const emptySubscribe = () => () => {};

export function AppointmentForm({ branches }: AppointmentFormProps) {
  const [formState, formAction, isPending] = useActionState(createAppointment, initialFormState);

  // Form Field States
  const [selectedBranchId, setSelectedBranchId] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedDateStr, setSelectedDateStr] = useState<string>(""); // YYYY-MM-DD
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>("");

  // Modal & Warning States
  const [showCutoffModal, setShowCutoffModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [clientValidationError, setClientValidationError] = useState<string | null>(null);

  // Popover Open States
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimeOpen, setIsTimeOpen] = useState(false);

  // Calendar View Month State
  const [calendarViewDate, setCalendarViewDate] = useState(() => new Date());

  const formRef = useRef<HTMLFormElement>(null);
  const branchRef = useRef<HTMLDivElement>(null);
  const serviceRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<HTMLDivElement>(null);
  const timeRef = useRef<HTMLDivElement>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Handle Server Action Response Flags
  useEffect(() => {
    if (formState?.errorCode === "SAME_DAY_CUTOFF") {
      const timer = setTimeout(() => setShowCutoffModal(true), 0);
      return () => clearTimeout(timer);
    }
    if (formState?.success) {
      const timer = setTimeout(() => setShowSuccessModal(true), 0);
      return () => clearTimeout(timer);
    }
  }, [formState]);

  // Close Popovers on Click Outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) {
        setIsBranchOpen(false);
      }
      if (serviceRef.current && !serviceRef.current.contains(event.target as Node)) {
        setIsServiceOpen(false);
      }
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
        setIsCalendarOpen(false);
      }
      if (timeRef.current && !timeRef.current.contains(event.target as Node)) {
        setIsTimeOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedBranch = branches.find((b) => b.id === selectedBranchId);

  // Calendar Helpers
  const year = calendarViewDate.getFullYear();
  const month = calendarViewDate.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const handlePrevMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarViewDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCalendarViewDate(new Date(year, month + 1, 1));
  };

  const formatDisplayDate = (dateStr: string) => {
    if (!dateStr) return "-- Select Date --";
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleClientSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    setClientValidationError(null);

    if (!selectedBranchId) {
      e.preventDefault();
      setClientValidationError("Please select your preferred clinic branch.");
      return;
    }
    if (!selectedService) {
      e.preventDefault();
      setClientValidationError("Please select a clinical service.");
      return;
    }
    if (!selectedDateStr) {
      e.preventDefault();
      setClientValidationError("Please select an appointment date.");
      return;
    }
    if (!selectedTimeSlot) {
      e.preventDefault();
      setClientValidationError("Please select a time slot.");
      return;
    }
  };

  const handleResetForm = () => {
    setShowSuccessModal(false);
    setShowCutoffModal(false);
    setSelectedBranchId("");
    setSelectedService("");
    setSelectedDateStr("");
    setSelectedTimeSlot("");
    setClientValidationError(null);
    formRef.current?.reset();
  };

  return (
    <div className="relative">
      {/* 1. Main Booking Form */}
      <form
        ref={formRef}
        action={formAction}
        onSubmit={handleClientSubmit}
        className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-8"
      >
        {/* Hidden Form Inputs for Custom Selectors */}
        <input type="hidden" name="branchId" value={selectedBranchId} />
        <input type="hidden" name="serviceName" value={selectedService} />
        <input type="hidden" name="appointmentDate" value={selectedDateStr} />
        <input type="hidden" name="timeSlot" value={selectedTimeSlot} />

        {/* Validation Errors */}
        {(clientValidationError || (formState?.error && formState.errorCode !== "SAME_DAY_CUTOFF")) && (
          <div role="alert" className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center gap-2">
            <span>⚠️</span>
            <span>{clientValidationError || formState.error}</span>
          </div>
        )}

        {/* SECTION 1: Clinic & Service Selection */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white shadow-xs">
              1
            </span>
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Select Preferred Branch & Service
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Preferred Branch Dropdown */}
            <div className="relative" ref={branchRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Branch *
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsBranchOpen((prev) => !prev);
                  setIsServiceOpen(false);
                  setIsCalendarOpen(false);
                  setIsTimeOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border text-sm font-medium transition-all text-left cursor-pointer ${
                  isBranchOpen
                    ? "border-orange-500 ring-2 ring-orange-500/20 bg-white"
                    : "border-slate-200 hover:border-slate-300"
                } ${selectedBranch ? "text-navy-900 font-semibold" : "text-slate-400"}`}
              >
                <span className="truncate">
                  {selectedBranch
                    ? selectedBranch.name
                    : branches.length === 0
                    ? "No active branches available"
                    : "-- Select Preferred Branch --"}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isBranchOpen ? "rotate-180 text-orange-500" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isBranchOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl max-h-60 overflow-y-auto p-1.5 space-y-1">
                  {branches.length === 0 ? (
                    <div className="px-4 py-3 text-xs text-slate-400 text-center font-medium">
                      No active clinic branches found.
                    </div>
                  ) : (
                    branches.map((branch) => {
                      const isSelected = branch.id === selectedBranchId;
                      return (
                        <div
                          key={branch.id}
                          onClick={() => {
                            setSelectedBranchId(branch.id);
                            setIsBranchOpen(false);
                          }}
                          className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
                            isSelected
                              ? "bg-orange-50 text-orange-600 font-bold"
                              : "text-slate-700 hover:bg-slate-100 hover:text-navy-900"
                          }`}
                        >
                          <span className="truncate pr-2">{branch.name}</span>
                          {isSelected && <span className="text-orange-500 text-sm font-bold">✓</span>}
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Clinical Service Dropdown */}
            <div className="relative" ref={serviceRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Service Required *
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsServiceOpen((prev) => !prev);
                  setIsBranchOpen(false);
                  setIsCalendarOpen(false);
                  setIsTimeOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border text-sm font-medium transition-all text-left cursor-pointer ${
                  isServiceOpen
                    ? "border-orange-500 ring-2 ring-orange-500/20 bg-white"
                    : "border-slate-200 hover:border-slate-300"
                } ${selectedService ? "text-navy-900 font-semibold" : "text-slate-400"}`}
              >
                <span className="truncate">
                  {selectedService ? selectedService : "-- Select Clinical Service --"}
                </span>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isServiceOpen ? "rotate-180 text-orange-500" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isServiceOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl max-h-64 overflow-y-auto p-1.5 space-y-1">
                  {SERVICES_OPTIONS.map((srv) => {
                    const isSelected = srv.id === selectedService;
                    return (
                      <div
                        key={srv.id}
                        onClick={() => {
                          setSelectedService(srv.id);
                          setIsServiceOpen(false);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-orange-50 text-orange-600"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 truncate">
                          <span className="text-base">{srv.icon}</span>
                          <div>
                            <div className="text-xs font-bold text-navy-900">{srv.label}</div>
                            <div className="text-[10px] text-slate-400">{srv.desc}</div>
                          </div>
                        </div>
                        {isSelected && <span className="text-orange-500 text-sm font-bold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 2: Preferred Schedule */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white shadow-xs">
              2
            </span>
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Choose Preferred Date & Time
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Mini-Calendar Picker */}
            <div className="relative" ref={calendarRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Date *
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsCalendarOpen((prev) => !prev);
                  setIsBranchOpen(false);
                  setIsServiceOpen(false);
                  setIsTimeOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border text-sm font-medium transition-all text-left cursor-pointer ${
                  isCalendarOpen
                    ? "border-orange-500 ring-2 ring-orange-500/20 bg-white"
                    : "border-slate-200 hover:border-slate-300"
                } ${selectedDateStr ? "text-navy-900 font-semibold" : "text-slate-400"}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>📅</span>
                  <span>{formatDisplayDate(selectedDateStr)}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isCalendarOpen ? "rotate-180 text-orange-500" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isCalendarOpen && (
                <div className="absolute z-30 left-0 sm:left-auto right-0 mt-2 w-full sm:w-80 bg-white rounded-3xl border border-slate-200 shadow-2xl p-5 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <button
                      type="button"
                      onClick={handlePrevMonth}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer text-xs font-bold"
                    >
                      ◀
                    </button>
                    <span className="text-xs font-extrabold text-navy-900">
                      {MONTH_NAMES[month]} {year}
                    </span>
                    <button
                      type="button"
                      onClick={handleNextMonth}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-600 transition-colors cursor-pointer text-xs font-bold"
                    >
                      ▶
                    </button>
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-bold text-slate-400 uppercase">
                    {DAY_NAMES.map((d) => (
                      <div key={d}>{d}</div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1 text-center text-xs">
                    {Array.from({ length: firstDayIndex }).map((_, i) => (
                      <div key={`empty-${i}`} />
                    ))}

                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const dayNum = i + 1;
                      const dateObj = new Date(year, month, dayNum);
                      const formattedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
                        dayNum
                      ).padStart(2, "0")}`;

                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      const isPast = dateObj < today;
                      const isSelected = selectedDateStr === formattedDate;

                      return (
                        <button
                          key={dayNum}
                          type="button"
                          disabled={isPast}
                          onClick={() => {
                            setSelectedDateStr(formattedDate);
                            setIsCalendarOpen(false);
                          }}
                          className={`h-8 w-8 mx-auto flex items-center justify-center rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            isPast
                              ? "text-slate-300 opacity-40 cursor-not-allowed"
                              : isSelected
                              ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                              : "text-slate-700 hover:bg-orange-50 hover:text-orange-600"
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

            {/* Time Slot Picker */}
            <div className="relative" ref={timeRef}>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                Preferred Time Slot *
              </label>

              <button
                type="button"
                onClick={() => {
                  setIsTimeOpen((prev) => !prev);
                  setIsBranchOpen(false);
                  setIsServiceOpen(false);
                  setIsCalendarOpen(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border text-sm font-medium transition-all text-left cursor-pointer ${
                  isTimeOpen
                    ? "border-orange-500 ring-2 ring-orange-500/20 bg-white"
                    : "border-slate-200 hover:border-slate-300"
                } ${selectedTimeSlot ? "text-navy-900 font-semibold" : "text-slate-400"}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <span>⏰</span>
                  <span>{selectedTimeSlot ? selectedTimeSlot : "-- Select Time Slot --"}</span>
                </div>
                <svg
                  className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ml-2 ${
                    isTimeOpen ? "rotate-180 text-orange-500" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isTimeOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 bg-white rounded-2xl border border-slate-200 shadow-2xl p-1.5 space-y-1">
                  {TIME_SLOTS.map((t) => {
                    const isSelected = t.id === selectedTimeSlot;
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTimeSlot(t.id);
                          setIsTimeOpen(false);
                        }}
                        className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-orange-50 text-orange-600 font-bold"
                            : "hover:bg-slate-100 text-slate-700"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-navy-900">{t.label}</span>
                          <span className="text-[10px] font-semibold text-slate-400">({t.period})</span>
                        </div>
                        {isSelected && <span className="text-orange-500 text-sm font-bold">✓</span>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* SECTION 3: Pet Parent & Patient Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-3">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-xs font-extrabold text-white shadow-xs">
              3
            </span>
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Pet Parent & Patient Details
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="ownerName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Owner Full Name *
              </label>
              <input
                id="ownerName"
                type="text"
                name="ownerName"
                required
                placeholder="e.g. Maria Santos"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Contact Mobile Number *
              </label>
              <input
                id="phone"
                type="tel"
                name="phone"
                required
                placeholder="e.g. 09171234567"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="petName" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pet Name *
              </label>
              <input
                id="petName"
                type="text"
                name="petName"
                required
                placeholder="e.g. Buddy / Mimi"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>

            <div>
              <label htmlFor="speciesBreed" className="block text-xs font-semibold text-slate-700 mb-1.5">
                Pet Species & Breed *
              </label>
              <input
                id="speciesBreed"
                type="text"
                name="speciesBreed"
                required
                placeholder="e.g. Dog (Golden Retriever) / Cat (Persian)"
                className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
              />
            </div>
          </div>

          <div>
            <label htmlFor="notes" className="block text-xs font-semibold text-slate-700 mb-1.5">
              Additional Notes or Symptoms (Optional)
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Describe any medical concerns, symptoms, or grooming styling preferences..."
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isPending || branches.length === 0}
            className="w-full py-4 px-6 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all active:scale-98 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Submitting Booking..." : "Confirm Appointment Request"}
          </button>
        </div>
      </form>

      {/* 2. Same-Day Cutoff Warning Modal (Portal) */}
      {showCutoffModal && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="cutoff-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setShowCutoffModal(false)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg space-y-5 my-auto animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center text-3xl mx-auto font-bold shadow-2xs">
              ⚠️
            </div>

            <div className="space-y-2">
              <h2 id="cutoff-modal-title" className="text-xl font-extrabold text-navy-900">
                Same-Day Booking Closed
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                {formState?.error ||
                  "Unfortunately, same-day online booking is full or closed because the clinic closes in less than 30 minutes. Please select tomorrow or a future date for your appointment."}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  setShowCutoffModal(false);
                  setSelectedDateStr(""); // Clear date so user selects another
                  setIsCalendarOpen(true); // Re-open calendar
                }}
                className="w-full py-3 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
              >
                Choose Tomorrow or Future Date
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* 3. Booking Success Modal (Portal) */}
      {showSuccessModal && formState?.data && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={handleResetForm} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl space-y-6 my-auto animate-in zoom-in-95 duration-200 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl mx-auto font-bold shadow-inner">
              ✓
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                Expected Patient Arrival Registered
              </span>
              <h2 id="success-modal-title" className="text-2xl font-extrabold text-navy-900 tracking-tight">
                Appointment Scheduled!
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                Thank you for scheduling a visit. Your booking has been saved directly to our clinic arrival system.
              </p>
            </div>

            {/* Appointment Details Box */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 text-left space-y-2.5 text-xs">
              <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-200/60 pb-1.5">
                Booking Summary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-slate-700">
                <div>
                  <span className="text-slate-400 font-medium block">Clinic Branch:</span>
                  <span className="font-bold text-navy-900">{formState.data.branchName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Service Required:</span>
                  <span className="font-bold text-navy-900">{formState.data.serviceName}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Scheduled Visit:</span>
                  <span className="font-bold text-navy-900">
                    {formatDisplayDate(formState.data.appointmentDate)} ({formState.data.timeSlot})
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Pet Patient:</span>
                  <span className="font-bold text-navy-900">{formState.data.petName}</span>
                </div>
              </div>
            </div>

            {/* Profile Appointment History Guidance */}
            <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-left space-y-1">
              <div className="text-xs font-bold text-orange-800 flex items-center gap-1.5">
                <span>📌</span>
                <span>Track or Emergency-Reschedule Anytime</span>
              </div>
              <p className="text-[11px] text-orange-700/90 leading-relaxed">
                You can review this visit status or request an emergency schedule adjustment anytime under your{" "}
                <strong className="font-bold underline">Profile / Appointment History</strong> page.
              </p>
            </div>

            {/* Modal Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href={ROUTES.PROFILE}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-navy-900 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all text-center"
              >
                Go to Profile & Bookings
              </Link>
              <button
                type="button"
                onClick={handleResetForm}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Schedule Another Visit
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}