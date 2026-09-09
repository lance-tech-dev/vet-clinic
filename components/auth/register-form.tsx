"use client";

import { useState, useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PasswordInput } from "@/components/auth/password-input";
import { signUp, type AuthActionResult, type RegistrationPetItem } from "@/lib/auth/actions";
import { ROUTES } from "@/config/constants";

const initialState: AuthActionResult = {
  error: null,
  success: false,
};

const createEmptyPet = (): RegistrationPetItem => ({
  name: "",
  species: "Canine",
  breed: "",
  sex: "Male",
  isNeutered: false,
  dateOfBirth: "",
  microchipNo: "",
  colorMarkings: "",
});

export function RegisterForm() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(signUp, initialState);
  const [currentPage, setCurrentPage] = useState<1 | 2>(1);
  const [hasPet, setHasPet] = useState(true);
  const [petsList, setPetsList] = useState<RegistrationPetItem[]>([createEmptyPet()]);
  const [clientError, setClientError] = useState<string | null>(null);
  const [prevError, setPrevError] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  // Sync error step safely during render (prevents react-hooks/set-state-in-effect error)
  if (state.error && state.error !== prevError) {
    setPrevError(state.error);
    if (state.errorStep && currentPage !== state.errorStep) {
      setCurrentPage(state.errorStep);
    }
  }

  // Redirect to Landing Page upon successful registration
  useEffect(() => {
    if (state.success) {
      router.push(ROUTES.HOME);
      router.refresh();
    }
  }, [state.success, router]);

  // Multi-Pet Handlers
  const handleAddPet = () => {
    setPetsList((prev) => [...prev, createEmptyPet()]);
  };

  const handleRemovePet = (index: number) => {
    if (petsList.length <= 1) return;
    setPetsList((prev) => prev.filter((_, i) => i !== index));
  };

  const handlePetChange = (
    index: number,
    field: keyof RegistrationPetItem,
    value: string | boolean
  ) => {
    setPetsList((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleNextPage = () => {
    setClientError(null);
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const email = (formData.get("email") as string)?.trim();
    const password = (formData.get("password") as string)?.trim();
    const fullName = (formData.get("fullName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const handlerName = (formData.get("handlerName") as string)?.trim();

    if (!email || !password || !fullName || !phone || !address) {
      setClientError("Please fill in all required owner fields on Page 1 before proceeding.");
      setCurrentPage(1);
      return;
    }

    if (!handlerName) {
      setClientError("Please enter the name of at least one authorized pet handler.");
      setCurrentPage(1);
      return;
    }

    setCurrentPage(2);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmitClientCheck = (e: React.FormEvent<HTMLFormElement>) => {
    setClientError(null);

    if (currentPage === 1) {
      e.preventDefault();
      handleNextPage();
      return;
    }

    if (hasPet) {
      for (let i = 0; i < petsList.length; i++) {
        const p = petsList[i];
        if (!p.name?.trim()) {
          e.preventDefault();
          setClientError(`Page 2 Error: Please enter a name for Pet Patient #${i + 1}.`);
          setCurrentPage(2);
          return;
        }
        if (!p.species?.trim()) {
          e.preventDefault();
          setClientError(`Page 2 Error: Please enter species for Pet Patient #${i + 1}.`);
          setCurrentPage(2);
          return;
        }
        if (!p.dateOfBirth?.trim()) {
          e.preventDefault();
          setClientError(`Page 2 Error: Please select Date of Birth for Pet Patient #${i + 1}.`);
          setCurrentPage(2);
          return;
        }
        if (!p.colorMarkings?.trim()) {
          e.preventDefault();
          setClientError(`Page 2 Error: Please describe Color/Markings for Pet Patient #${i + 1}.`);
          setCurrentPage(2);
          return;
        }
      }
    }
  };

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmitClientCheck} className="space-y-6">
      <input type="hidden" name="petsJson" value={JSON.stringify(petsList)} />

      {/* Step Indicator Header */}
      <div className="flex items-center justify-between bg-slate-100 p-2.5 rounded-2xl border border-slate-200">
        <button
          type="button"
          onClick={() => setCurrentPage(1)}
          className="flex items-center gap-2 text-left cursor-pointer"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              currentPage === 1 ? "bg-orange-500 text-white" : "bg-emerald-500 text-white"
            }`}
          >
            {currentPage === 1 ? "1" : "✓"}
          </span>
          <span className="text-xs font-bold text-navy-900">
            {currentPage === 1 ? "Page 1: Owner Profile" : "Page 1 Completed"}
          </span>
        </button>

        <div className="h-0.5 w-8 bg-slate-300" />

        <button
          type="button"
          onClick={handleNextPage}
          className="flex items-center gap-2 text-left cursor-pointer"
        >
          <span
            className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
              currentPage === 2 ? "bg-orange-500 text-white" : "bg-slate-300 text-slate-600"
            }`}
          >
            2
          </span>
          <span className="text-xs font-bold text-navy-900">
            Page 2: Pet Information ({hasPet ? petsList.length : 0})
          </span>
        </button>
      </div>

      {(clientError || state.error) && (
        <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold flex items-center justify-between gap-2 animate-in fade-in duration-200">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{clientError || state.error}</span>
          </div>
          {(state.errorStep || (clientError && clientError.includes("Page 1"))) && (
            <button
              type="button"
              onClick={() => setCurrentPage(state.errorStep || 1)}
              className="text-[11px] font-extrabold underline text-red-900 shrink-0 cursor-pointer"
            >
              Fix on Page {state.errorStep || 1} ➔
            </button>
          )}
        </div>
      )}

      {/* PAGE 1: Owner Profile & Credentials */}
      <div className={currentPage === 1 ? "space-y-4" : "hidden"}>
        <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 block w-fit">
          Page 1 — Owner Information & Credentials
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reg-email" className="block text-xs font-bold text-slate-700 mb-1">
              Email Address *
            </label>
            <input
              id="reg-email"
              type="email"
              name="email"
              required={currentPage === 1}
              placeholder="you@example.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-xs font-bold text-slate-700 mb-1">
              Password *
            </label>
            <PasswordInput id="reg-password" name="password" required={currentPage === 1} placeholder="••••••••" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reg-fullname" className="block text-xs font-bold text-slate-700 mb-1">
              Owner Full Name *
            </label>
            <input
              id="reg-fullname"
              type="text"
              name="fullName"
              required={currentPage === 1}
              placeholder="e.g. Maria Santos"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>

          <div>
            <label htmlFor="reg-phone" className="block text-xs font-bold text-slate-700 mb-1">
              Mobile Contact Number *
            </label>
            <input
              id="reg-phone"
              type="tel"
              name="phone"
              required={currentPage === 1}
              placeholder="e.g. 09171234567"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="reg-address" className="block text-xs font-bold text-slate-700 mb-1">
            Home Address *
          </label>
          <input
            id="reg-address"
            type="text"
            name="address"
            required={currentPage === 1}
            placeholder="e.g. Brgy. San Rafael, San Pablo City"
            className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
          />
        </div>

        {/* Structured Authorized Pet Handler Section */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-navy-800 block">
            Authorized Pet Handler Details *
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label htmlFor="handler-name" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Name *
              </label>
              <input
                id="handler-name"
                type="text"
                name="handlerName"
                required={currentPage === 1}
                placeholder="e.g. Juan Santos"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="handler-rel" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Relationship *
              </label>
              <input
                id="handler-rel"
                type="text"
                name="handlerRelationship"
                required={currentPage === 1}
                placeholder="e.g. Husband / Sister"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label htmlFor="handler-phone" className="block text-[11px] font-semibold text-slate-600 mb-1">
                Contact Number *
              </label>
              <input
                id="handler-phone"
                type="tel"
                name="handlerPhone"
                required={currentPage === 1}
                placeholder="e.g. 09181234567"
                className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleNextPage}
          className="w-full py-3.5 px-4 rounded-xl bg-navy-900 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Next: Pet Information</span>
          <span>➔</span>
        </button>
      </div>

      {/* PAGE 2: Multi-Pet Information */}
      <div className={currentPage === 2 ? "space-y-4" : "hidden"}>
        <div className="flex items-center justify-between">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
            Page 2 — Register Pet Patients
          </span>

          <label className="flex items-center gap-2 text-xs font-bold text-orange-600 cursor-pointer">
            <input
              type="checkbox"
              name="hasPet"
              value="true"
              checked={hasPet}
              onChange={(e) => setHasPet(e.target.checked)}
              className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
            />
            <span>Register Pet(s) Now</span>
          </label>
        </div>

        {hasPet ? (
          <div className="space-y-5">
            {petsList.map((pet, index) => (
              <div key={index} className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200 relative">
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="text-xs font-bold text-navy-900 flex items-center gap-1.5">
                    <span>🐾</span>
                    <span>Pet Patient #{index + 1}</span>
                  </span>

                  {petsList.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemovePet(index)}
                      className="text-[11px] font-bold text-red-600 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      ✕ Remove Pet
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pet Name *</label>
                    <input
                      type="text"
                      required={hasPet}
                      value={pet.name}
                      onChange={(e) => handlePetChange(index, "name", e.target.value)}
                      placeholder="e.g. Buddy / Maru"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Species * (Canine / Feline)</label>
                    <input
                      type="text"
                      required={hasPet}
                      value={pet.species}
                      onChange={(e) => handlePetChange(index, "species", e.target.value)}
                      placeholder="Canine or Feline"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Breed (Optional)</label>
                    <input
                      type="text"
                      value={pet.breed || ""}
                      onChange={(e) => handlePetChange(index, "breed", e.target.value)}
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sex *</label>
                    <select
                      required={hasPet}
                      value={pet.sex}
                      onChange={(e) => handlePetChange(index, "sex", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500 cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div className="pt-5">
                    <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={pet.isNeutered}
                        onChange={(e) => handlePetChange(index, "isNeutered", e.target.checked)}
                        className="w-4 h-4 text-orange-500 rounded focus:ring-orange-500"
                      />
                      <span>Neutered / Spayed</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth *</label>
                    <input
                      type="date"
                      required={hasPet}
                      value={pet.dateOfBirth || ""}
                      onChange={(e) => handlePetChange(index, "dateOfBirth", e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Microchip No. (Optional)</label>
                    <input
                      type="text"
                      value={pet.microchipNo || ""}
                      onChange={(e) => handlePetChange(index, "microchipNo", e.target.value)}
                      placeholder="e.g. 985141002345678"
                      className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color / Markings & Identification *</label>
                  <input
                    type="text"
                    required={hasPet}
                    value={pet.colorMarkings || ""}
                    onChange={(e) => handlePetChange(index, "colorMarkings", e.target.value)}
                    placeholder="e.g. Tan coat with white spot on chest"
                    className="w-full px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddPet}
              className="w-full py-3 px-4 rounded-2xl bg-orange-50 hover:bg-orange-100 text-orange-600 font-bold text-xs border border-orange-200/80 transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>+ Add Another Pet to Registration</span>
            </button>
          </div>
        ) : (
          <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-1">
            <p className="text-xs font-bold text-slate-700">No pets registered at this time.</p>
            <p className="text-[11px] text-slate-400">You can add your pets anytime later under your user profile dashboard.</p>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => setCurrentPage(1)}
            className="w-1/3 py-3.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer text-center"
          >
            ◀ Back
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="w-2/3 py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer disabled:opacity-50 text-center"
          >
            {isPending ? "Creating Account..." : `Complete Registration (${hasPet ? petsList.length : 0} Pet${petsList.length > 1 ? "s" : ""}) ✓`}
          </button>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 pt-2">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-bold text-orange-600 hover:underline">
          Sign In
        </Link>
      </p>
    </form>
  );
}

export default RegisterForm;