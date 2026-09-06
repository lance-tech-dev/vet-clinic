"use client";

import { useState, useActionState } from "react";
import Link from "next/link";
import { registerUser, type RegisterFormState } from "@/lib/auth/actions";
import { ROUTES } from "@/config/constants";

interface PetInput {
  id: string;
  name: string;
  species: string;
  breed: string;
}

const initialState: RegisterFormState = {
  error: null,
  success: false,
};

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerUser, initialState);

  // Dynamic Pets State
  const [pets, setPets] = useState<PetInput[]>([
    { id: "pet-1", name: "", species: "Dog", breed: "" },
  ]);

  const handleAddPet = () => {
    setPets((prev) => [
      ...prev,
      { id: `pet-${Date.now()}`, name: "", species: "Dog", breed: "" },
    ]);
  };

  const handleRemovePet = (id: string) => {
    if (pets.length === 1) return;
    setPets((prev) => prev.filter((p) => p.id !== id));
  };

  const handlePetChange = (id: string, field: keyof PetInput, value: string) => {
    setPets((prev) =>
      prev.map((pet) => (pet.id === id ? { ...pet, [field]: value } : pet))
    );
  };

  return (
    <form action={formAction} className="space-y-8">
      {/* Hidden input to transmit multi-pet JSON to Server Action */}
      <input type="hidden" name="petsPayload" value={JSON.stringify(pets)} />

      {/* Error Banner */}
      {state?.error && (
        <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold flex items-center gap-2">
          <svg className="w-4 h-4 shrink-0 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      {/* SECTION 1: Owner Profile */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-700">
            1
          </span>
          <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
            Owner Information
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Full Name *
            </label>
            <input
              type="text"
              name="fullName"
              required
              placeholder="e.g. Maria Santos"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Phone / Mobile Number *
            </label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="e.g. 09171234567"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Email Address *
          </label>
          <input
            type="email"
            name="email"
            required
            placeholder="maria@example.com"
            className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Password *
            </label>
            <input
              type="password"
              name="password"
              required
              minLength={6}
              placeholder="At least 6 characters"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Confirm Password *
            </label>
            <input
              type="password"
              name="confirmPassword"
              required
              minLength={6}
              placeholder="Re-enter password"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-navy-900 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Dynamic Pet Information */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-2">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-700">
              2
            </span>
            <h2 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
              Register Your Pet(s)
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">
            {pets.length} {pets.length === 1 ? "Pet" : "Pets"} Added
          </span>
        </div>

        <div className="space-y-4">
          {pets.map((pet, index) => (
            <div
              key={pet.id}
              className="p-4 sm:p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                  🐾 Pet #{index + 1}
                </span>

                {pets.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemovePet(pet.id)}
                    className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    Remove Pet
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Pet Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={pet.name}
                    onChange={(e) => handlePetChange(pet.id, "name", e.target.value)}
                    placeholder="e.g. Buddy"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Species *
                  </label>
                  <select
                    value={pet.species}
                    onChange={(e) => handlePetChange(pet.id, "species", e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="Dog">Dog 🐕</option>
                    <option value="Cat">Cat 🐈</option>
                    <option value="Bird">Bird 🦜</option>
                    <option value="Rabbit">Rabbit 🐇</option>
                    <option value="Other">Other 🐾</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                    Breed (Optional)
                  </label>
                  <input
                    type="text"
                    value={pet.breed}
                    onChange={(e) => handlePetChange(pet.id, "breed", e.target.value)}
                    placeholder="e.g. Golden Retriever"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-navy-900 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAddPet}
          className="w-full py-2.5 px-4 rounded-xl border-2 border-dashed border-orange-200 hover:border-orange-400 bg-orange-50/50 hover:bg-orange-50 text-orange-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          + Add Another Pet
        </button>
      </div>

      {/* Submit Button */}
      <div className="pt-2 space-y-4">
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 rounded-full bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 active:scale-98"
        >
          {isPending ? "Creating Account..." : "Complete Registration"}
        </button>

        <p className="text-center text-xs text-slate-500">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="font-bold text-navy-900 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </form>
  );
}

export default RegisterForm;