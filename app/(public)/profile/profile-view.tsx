"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { updateProfile, addPet, type ProfileFormState } from "./actions";
import type { PetData } from "./page";

interface UserProfileData {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  role: string;
  createdAt: string;
}

interface ProfileViewProps {
  user: UserProfileData;
  pets: PetData[];
}

const initialState: ProfileFormState = {
  error: null,
  success: false,
};

export function ProfileView({ user, pets }: ProfileViewProps) {
  const [activeTab, setActiveTab] = useState<"account" | "pets" | "appointments">("account");
  const [isAddingPet, setIsAddingPet] = useState(false);

  const [profileState, profileAction, isProfilePending] = useActionState(updateProfile, initialState);
  const [petState, petAction, isPetPending] = useActionState(addPet, initialState);

  const initialLetter = user.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user.email.charAt(0).toUpperCase();

  const formattedDate = new Date(user.createdAt).toLocaleDateString("en-US", {
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
        
        {/* Modern Header Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-navy-900 to-slate-800 text-white font-extrabold text-2xl flex items-center justify-center uppercase shadow-md shrink-0 border border-slate-700">
            {initialLetter}
          </div>

          <div className="space-y-1.5 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl font-bold text-navy-900">
                {user.fullName || "Valued Pet Owner"}
              </h1>
              <span className="inline-flex items-center self-center sm:self-auto px-3 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                {user.role === "admin" ? "Staff / Admin" : "Registered Owner"}
              </span>
            </div>
            <p className="text-sm text-slate-500 font-medium">
              {user.email} {user.phone ? `• ${user.phone}` : ""}
            </p>
            <p className="text-xs text-slate-400">Member since {formattedDate}</p>
          </div>

          <Link
            href={ROUTES.APPOINTMENTS}
            className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors shrink-0"
          >
            + Book Appointment
          </Link>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-200/60 p-1.5 rounded-2xl w-fit">
          <button
            onClick={() => setActiveTab("account")}
            className={`px-5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              activeTab === "account"
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
            My Pets ({pets.length})
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

        {/* Tab 1: Account Details Form */}
        {activeTab === "account" && (
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-6">
            <div>
              <h2 className="text-lg font-bold text-navy-900">Personal Information</h2>
              <p className="text-xs text-slate-500">Update your account profile details below.</p>
            </div>

            {profileState?.success && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                ✓ Profile successfully updated!
              </div>
            )}

            {profileState?.error && (
              <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                ⚠️ {profileState.error}
              </div>
            )}

            <form action={profileAction} className="space-y-5 max-w-xl">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  disabled
                  value={user.email}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-500 text-sm cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  defaultValue={user.fullName || ""}
                  placeholder="e.g. Maria Santos"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Phone / Mobile Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  defaultValue={user.phone || ""}
                  placeholder="e.g. 09171234567"
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isProfilePending}
                  className="px-6 py-2.5 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isProfilePending ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 2: Registered Pets */}
        {activeTab === "pets" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-navy-900">Your Registered Pets</h2>
                <p className="text-xs text-slate-500">Manage your fur babies&apos; medical profiles.</p>
              </div>
              <button
                onClick={() => setIsAddingPet(!isAddingPet)}
                className="px-4 py-2 rounded-full bg-navy-900 hover:bg-navy-800 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
              >
                {isAddingPet ? "Cancel" : "+ Register New Pet"}
              </button>
            </div>

            {/* Add Pet Form Accordion */}
            {isAddingPet && (
              <div className="bg-white p-6 rounded-3xl border border-orange-200/80 shadow-md space-y-4">
                <h3 className="text-sm font-bold text-navy-900">Register a New Patient</h3>

                {petState?.success && (
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
                    ✓ Pet registered successfully!
                  </div>
                )}

                {petState?.error && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                    ⚠️ {petState.error}
                  </div>
                )}

                <form action={petAction} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Pet Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Buddy"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Species *
                      </label>
                      <select
                        name="species"
                        required
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Breed
                      </label>
                      <input
                        type="text"
                        name="breed"
                        placeholder="e.g. Golden Retriever"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">
                        Age / Birthday
                      </label>
                      <input
                        type="text"
                        name="age"
                        placeholder="e.g. 2 years old"
                        className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Medical Notes / Allergies
                    </label>
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="e.g. Allergic to chicken, sensitive stomach..."
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isPetPending}
                    className="px-5 py-2.5 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {isPetPending ? "Registering..." : "Save Pet Profile"}
                  </button>
                </form>
              </div>
            )}

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

        {/* Tab 3: Appointments */}
        {activeTab === "appointments" && (
          <div className="bg-white p-8 rounded-3xl border border-slate-200/80 shadow-xs text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mx-auto">
              📅
            </div>
            <h3 className="text-base font-bold text-navy-900">No Appointments Recorded</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Your upcoming and completed veterinary visits will be listed here.
            </p>
          </div>
        )}

      </div>
    </main>
  );
}