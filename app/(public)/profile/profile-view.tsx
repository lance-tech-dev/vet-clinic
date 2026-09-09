"use client";

import { useState, useActionState, useTransition, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { updateProfile, addPet, rescheduleAppointment, cancelUserAppointment, type ProfileFormState } from "./actions";

export interface PetData {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  notes: string | null;
  created_at: string;
}

export interface Branch {
  id: string;
  name: string;
  city: string;
}

export interface UserAppointment {
  id: string;
  user_id: string;
  branch_id: string;
  service_name: string;
  appointment_date: string;
  time_slot: string;
  owner_name: string;
  phone: string;
  pet_name: string;
  species_breed: string;
  notes: string | null;
  status: "scheduled" | "completed" | "cancelled";
  reschedule_reason: string | null;
  created_at: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
  avatarUrl?: string | null;
}

interface ProfileViewProps {
  user?: UserProfile | null;
  pets?: PetData[];
  appointments?: UserAppointment[];
  branches?: Branch[];
}

const initialState: ProfileFormState = { error: null, success: false };

const TIME_SLOTS = [
  "08:00 AM - 10:00 AM",
  "10:00 AM - 12:00 PM",
  "01:00 PM - 03:00 PM",
  "03:00 PM - 05:00 PM",
];

const emptySubscribe = () => () => {};

export function ProfileView({
  user,
  pets = [],
  appointments = [],
  branches = [],
}: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"pets" | "appointments">("pets");
  const [isEditingProfileModal, setIsEditingProfileModal] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState<"personal" | "addPet">("personal");
  const [reschedulingApp, setReschedulingApp] = useState<UserAppointment | null>(null);
  const [isPending, startTransition] = useTransition();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const profileFormRef = useRef<HTMLFormElement>(null);
  const petFormRef = useRef<HTMLFormElement>(null);
  const rescheduleFormRef = useRef<HTMLFormElement>(null);

  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, initialState);
  const [petState, petAction, isPetPending] = useActionState(addPet, initialState);
  const [rescheduleState, rescheduleAction, isReschedulePending] = useActionState(
    rescheduleAppointment,
    initialState
  );

  const userData: UserProfile = user || {
    id: "",
    email: "",
    fullName: null,
    phone: null,
    role: "user",
    createdAt: new Date().toISOString(),
  };

  // Auto-reset pet form on success
  useEffect(() => {
    if (petState?.success) {
      petFormRef.current?.reset();
    }
  }, [petState?.success]);

  // Auto-close reschedule modal on success
  useEffect(() => {
    if (rescheduleState?.success) {
      rescheduleFormRef.current?.reset();
      const timer = setTimeout(() => setReschedulingApp(null), 0);
      return () => clearTimeout(timer);
    }
  }, [rescheduleState?.success]);

  const handleCancelAppointment = (appId: string, petName: string) => {
    if (confirm(`Are you sure you want to cancel the appointment for ${petName}?`)) {
      startTransition(async () => {
        await cancelUserAppointment(appId);
      });
    }
  };

  const initialLetter = userData.fullName
    ? userData.fullName.charAt(0).toUpperCase()
    : userData.email
    ? userData.email.charAt(0).toUpperCase()
    : "U";

  const formattedDate = new Date(userData.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const getSpeciesIcon = (species: string) => {
    const s = species.toLowerCase();
    if (s.includes("dog")) return "🐕";
    if (s.includes("cat")) return "🐈";
    if (s.includes("bird")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐾";
  };

  return (
    <main className="min-h-screen bg-slate-50 py-10 sm:py-14">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* 1. Profile Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          {userData.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={userData.avatarUrl}
              alt={userData.fullName || "User Avatar"}
              className="w-20 h-20 rounded-2xl object-cover border-2 border-orange-500 shadow-sm shrink-0"
            />
          ) : (
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-navy-900 to-slate-800 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-md shrink-0 border border-slate-700">
              {initialLetter}
            </div>
          )}

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-navy-900">
                {userData.fullName || "Valued Pet Owner"}
              </h1>
              <span className="inline-flex items-center self-center sm:self-auto px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {userData.role === "admin" ? "Staff / Admin" : "Registered Owner"}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {userData.email} {userData.phone ? `• ${userData.phone}` : ""}
            </p>
            <p className="text-xs text-slate-400">Member since {formattedDate}</p>
          </div>

          {/* Action Buttons: Book Appointment & Edit Profile */}
          <div className="flex flex-col gap-2 shrink-0 w-full sm:w-auto">
            <Link
              href={ROUTES.APPOINTMENTS}
              className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors text-center"
            >
              + Book Appointment
            </Link>
            <button
              type="button"
              onClick={() => setIsEditingProfileModal(true)}
              className="px-5 py-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs border border-slate-200 transition-colors cursor-pointer text-center"
            >
              ✏️ Edit Profile & Add Pet
            </button>
          </div>
        </div>

        {/* 2. Navigation Tabs */}
        <div
          role="tablist"
          aria-label="Profile navigation"
          className="flex items-center gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl w-fit"
        >
          <button
            role="tab"
            id="tab-pets"
            aria-selected={activeTab === "pets"}
            aria-controls="panel-pets"
            onClick={() => setActiveTab("pets")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "pets"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            My Pets ({pets.length})
          </button>
          <button
            role="tab"
            id="tab-appointments"
            aria-selected={activeTab === "appointments"}
            aria-controls="panel-appointments"
            onClick={() => setActiveTab("appointments")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "appointments"
                ? "bg-white text-navy-900 shadow-xs"
                : "text-slate-600 hover:text-navy-900"
            }`}
          >
            Appointment History ({appointments.length})
          </button>
        </div>

        {/* TAB 1: Registered Pets */}
        {activeTab === "pets" && (
          <div
            role="tabpanel"
            id="panel-pets"
            aria-labelledby="tab-pets"
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Your Registered Pets</h2>
                <p className="text-xs text-slate-500">Manage your fur babies&apos; medical profiles.</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveModalTab("addPet");
                  setIsEditingProfileModal(true);
                }}
                className="px-4 py-2 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                + Register New Pet
              </button>
            </div>

            {/* Pets Grid */}
            {pets.length === 0 ? (
              <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mx-auto">
                  🐾
                </div>
                <h3 className="text-base font-bold text-navy-900">No Pets Registered Yet</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Register your fur baby above to keep track of their medical records and appointments.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pets.map((pet) => (
                  <div
                    key={pet.id}
                    className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-700 font-bold flex items-center justify-center text-2xl">
                          {getSpeciesIcon(pet.species)}
                        </div>
                        <div>
                          <h3 className="text-base font-bold text-navy-900">{pet.name}</h3>
                          <p className="text-xs text-slate-500">
                            {pet.breed || pet.species} {pet.age ? `• ${pet.age}` : ""}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-50 text-orange-700 border border-orange-100">
                        {pet.species}
                      </span>
                    </div>

                    {pet.notes && (
                      <div className="p-3 bg-slate-50 rounded-2xl text-xs space-y-1 text-slate-600">
                        <p>
                          <span className="font-semibold text-slate-800">Medical Notes:</span> {pet.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Appointment History */}
        {activeTab === "appointments" && (
          <div
            role="tabpanel"
            id="panel-appointments"
            aria-labelledby="tab-appointments"
            className="space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900 tracking-tight">
                  Appointment History & Booked Visits
                </h2>
                <p className="text-xs text-slate-500">
                  Track your upcoming clinic arrivals or submit emergency schedule changes.
                </p>
              </div>
              <span className="text-xs font-bold text-slate-400 bg-slate-100 px-3 py-1 rounded-full border border-slate-200">
                {appointments.length} Total Visits
              </span>
            </div>

            {appointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-2xs text-center space-y-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mx-auto font-bold">
                  📅
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-navy-900">No Booked Appointments Yet</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    You haven&apos;t scheduled any visits for your pets. Book your first appointment online in just a few clicks.
                  </p>
                </div>
                <Link
                  href={ROUTES.APPOINTMENTS}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
                >
                  Book an Appointment Now
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((app) => {
                  const assignedBranch = branches.find((b) => b.id === app.branch_id);

                  return (
                    <div
                      key={app.id}
                      className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-2xs hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-6"
                    >
                      <div className="space-y-3 flex-1">
                        {/* Status Badge & Branch Name */}
                        <div className="flex items-center gap-2.5 flex-wrap">
                          <span
                            className={`inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold border ${
                              app.status === "scheduled"
                                ? "bg-amber-50 text-amber-800 border-amber-200"
                                : app.status === "completed"
                                ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                                : "bg-red-50 text-red-700 border-red-200"
                            }`}
                          >
                            {app.status === "scheduled" && "⏳ Scheduled (Expected Arrival)"}
                            {app.status === "completed" && "✓ Completed Visit"}
                            {app.status === "cancelled" && "✕ Cancelled"}
                          </span>

                          <span className="text-xs font-bold text-navy-900 bg-slate-100 px-3 py-0.5 rounded-full border border-slate-200">
                            🏥 {assignedBranch ? assignedBranch.name : "Clinic Branch"}
                          </span>
                        </div>

                        {/* Visit Details */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs text-slate-700">
                          <div>
                            <span className="text-slate-400 font-medium block">Scheduled Date & Time:</span>
                            <span className="font-bold text-navy-900">
                              📅 {app.appointment_date} ({app.time_slot})
                            </span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block">Patient (Pet Name):</span>
                            <span className="font-bold text-navy-900">🐾 {app.pet_name} ({app.species_breed})</span>
                          </div>

                          <div>
                            <span className="text-slate-400 font-medium block">Service Required:</span>
                            <span className="font-bold text-navy-900">{app.service_name}</span>
                          </div>
                        </div>

                        {/* Emergency Reschedule Reason if present */}
                        {app.reschedule_reason && (
                          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-900 space-y-0.5">
                            <span className="font-bold block">⚠️ Emergency Reschedule Reason Recorded:</span>
                            <span className="italic">{app.reschedule_reason}</span>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      {app.status === "scheduled" && (
                        <div className="flex items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100 shrink-0">
                          <button
                            type="button"
                            onClick={() => setReschedulingApp(app)}
                            className="px-4 py-2.5 rounded-xl bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-bold text-xs border border-orange-200/80 transition-colors cursor-pointer"
                          >
                            ✏️ Emergency Reschedule
                          </button>
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleCancelAppointment(app.id, app.pet_name)}
                            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 font-bold text-xs border border-slate-200 transition-colors cursor-pointer"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

      </div>

      {/* 3. EDIT PROFILE & ADD PET MODAL (Portal) */}
      {isEditingProfileModal && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-profile-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setIsEditingProfileModal(false)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 id="edit-profile-modal-title" className="text-lg font-bold text-navy-900">
                  Update Account & Registered Pets
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Change your personal details or register a new pet.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsEditingProfileModal(false)}
                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Modal Internal Navigation Sub-tabs */}
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl w-fit">
              <button
                type="button"
                onClick={() => setActiveModalTab("personal")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeModalTab === "personal"
                    ? "bg-white text-navy-900 shadow-2xs"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                Personal Info
              </button>
              <button
                type="button"
                onClick={() => setActiveModalTab("addPet")}
                className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  activeModalTab === "addPet"
                    ? "bg-white text-navy-900 shadow-2xs"
                    : "text-slate-600 hover:text-navy-900"
                }`}
              >
                + Register New Pet
              </button>
            </div>

            {/* MODAL FORM 1: Personal Information */}
            {activeModalTab === "personal" && (
              <form ref={profileFormRef} action={profileAction} className="space-y-4">
                {profileState?.success && (
                  <div role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    ✓ Personal information updated successfully!
                  </div>
                )}

                {profileState?.error && (
                  <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                    ⚠️ {profileState.error}
                  </div>
                )}

                <div>
                  <label htmlFor="modal-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="modal-email"
                    type="email"
                    disabled
                    value={userData.email}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-xs cursor-not-allowed"
                  />
                </div>

                <div>
                  <label htmlFor="modal-fullname" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="modal-fullname"
                    type="text"
                    name="fullName"
                    defaultValue={userData.fullName || ""}
                    placeholder="e.g. Maria Santos"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="modal-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone / Mobile Number
                  </label>
                  <input
                    id="modal-phone"
                    type="tel"
                    name="phone"
                    defaultValue={userData.phone || ""}
                    placeholder="e.g. 09171234567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfileModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isProfilePending}
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isProfilePending ? "Saving..." : "Save Personal Info"}
                  </button>
                </div>
              </form>
            )}

            {/* MODAL FORM 2: Add New Pet */}
            {activeModalTab === "addPet" && (
              <form ref={petFormRef} action={petAction} className="space-y-4">
                {petState?.success && (
                  <div role="status" className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    ✓ Pet registered successfully!
                  </div>
                )}

                {petState?.error && (
                  <div role="alert" className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                    ⚠️ {petState.error}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-pet-name" className="block text-xs font-semibold text-slate-700 mb-1">
                      Pet Name *
                    </label>
                    <input
                      id="modal-pet-name"
                      type="text"
                      name="name"
                      required
                      placeholder="e.g. Buddy"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-pet-species" className="block text-xs font-semibold text-slate-700 mb-1">
                      Species *
                    </label>
                    <select
                      id="modal-pet-species"
                      name="species"
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Rabbit">Rabbit</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="modal-pet-breed" className="block text-xs font-semibold text-slate-700 mb-1">
                      Breed
                    </label>
                    <input
                      id="modal-pet-breed"
                      type="text"
                      name="breed"
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label htmlFor="modal-pet-age" className="block text-xs font-semibold text-slate-700 mb-1">
                      Age / Birthday
                    </label>
                    <input
                      id="modal-pet-age"
                      type="text"
                      name="age"
                      placeholder="e.g. 2 years old"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="modal-pet-notes" className="block text-xs font-semibold text-slate-700 mb-1">
                    Medical Notes / Allergies
                  </label>
                  <textarea
                    id="modal-pet-notes"
                    name="notes"
                    rows={2}
                    placeholder="e.g. Allergic to chicken, sensitive stomach..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsEditingProfileModal(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                  >
                    Close
                  </button>
                  <button
                    type="submit"
                    disabled={isPetPending}
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPetPending ? "Registering..." : "Save Pet Profile"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* 4. Emergency Reschedule Modal Portal */}
      {reschedulingApp && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/70 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setReschedulingApp(null)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 id="reschedule-modal-title" className="text-lg font-bold text-navy-900">
                  Emergency Reschedule
                </h2>
                <p className="text-xs text-orange-600 font-bold mt-0.5">
                  Patient: {reschedulingApp.pet_name} ({reschedulingApp.service_name})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReschedulingApp(null)}
                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {rescheduleState?.error && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                ⚠️ {rescheduleState.error}
              </div>
            )}

            <form ref={rescheduleFormRef} action={rescheduleAction} className="space-y-4">
              <input type="hidden" name="appointmentId" value={reschedulingApp.id} />

              <div>
                <label htmlFor="newDate" className="block text-xs font-semibold text-slate-700 mb-1">
                  New Preferred Date *
                </label>
                <input
                  id="newDate"
                  type="date"
                  name="newDate"
                  required
                  defaultValue={reschedulingApp.appointment_date}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label htmlFor="newTimeSlot" className="block text-xs font-semibold text-slate-700 mb-1">
                  New Preferred Time Slot *
                </label>
                <select
                  id="newTimeSlot"
                  name="newTimeSlot"
                  required
                  defaultValue={reschedulingApp.time_slot}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>
                      {slot}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="reason" className="block text-xs font-bold text-navy-900 mb-1">
                  Reason for Rescheduling / Emergency *
                </label>
                <textarea
                  id="reason"
                  name="reason"
                  required
                  rows={3}
                  placeholder="e.g. Medical emergency, sudden work conflict, or pet symptom change..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setReschedulingApp(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isReschedulePending}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isReschedulePending ? "Updating..." : "Confirm Emergency Reschedule"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </main>
  );
}