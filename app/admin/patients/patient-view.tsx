"use client";

import { useState, useTransition } from "react";
import { PetDetailModal, type MedicalLogsData } from "@/components/pets/pet-detail-modal";
import { upsertPet, deletePet } from "./actions";

export interface PetWithMedicalLogs {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  is_neutered: boolean;
  date_of_birth: string | null;
  microchip_no: string | null;
  color_markings: string | null;
  owner_name: string | null;
  owner_address: string | null;
  owner_phone: string | null;
  owner_email: string | null;
  authorized_handlers: string | null;
  notes: string | null;
  logs: MedicalLogsData;
}

// Export alias for backward compatibility across imports
export type PetWithLogs = PetWithMedicalLogs;

interface PatientViewProps {
  patients: PetWithMedicalLogs[];
}

export function PatientView({ patients }: PatientViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("All");
  const [activeMedicalPet, setActiveMedicalPet] = useState<PetWithMedicalLogs | null>(null);
  const [editingPet, setEditingPet] = useState<PetWithMedicalLogs | null>(null);
  const [isNewPetModalOpen, setIsNewPetOpen] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filteredPatients = patients.filter((pet) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.owner_name && pet.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.microchip_no && pet.microchip_no.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecies = speciesFilter === "All" || pet.species.toLowerCase() === speciesFilter.toLowerCase();

    return matchesSearch && matchesSpecies;
  });

  const handlePetFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await upsertPet(formData);
      if (!res.success) {
        setErrorMsg(res.error ?? "Failed to save pet record.");
      } else {
        setEditingPet(null);
        setIsNewPetOpen(false);
      }
    });
  };

  const handleDeletePet = (petId: string, petName: string) => {
    if (confirm(`Are you sure you want to delete patient record for ${petName}?`)) {
      setErrorMsg(null);
      startTransition(async () => {
        const res = await deletePet(petId);
        if (!res.success) {
          setErrorMsg(res.error ?? "Failed to delete patient record.");
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Patient Registry</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage clinical profiles, patient details, and comprehensive medical logs.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setIsNewPetOpen(true);
          }}
          className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
        >
          + Add New Patient
        </button>
      </div>

      {errorMsg && (
        <div role="alert" className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
          ⚠️ {errorMsg}
        </div>
      )}

      {/* Filter & Search Controls */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by pet name, owner name, breed, or microchip #..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {["All", "Canine", "Feline"].map((sp) => (
            <button
              key={sp}
              type="button"
              onClick={() => setSpeciesFilter(sp)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                speciesFilter === sp
                  ? "bg-navy-900 text-white shadow-xs"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {sp}
            </button>
          ))}
        </div>
      </div>

      {/* Patients Registry Table */}
      {filteredPatients.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <p className="text-sm font-bold text-navy-900">No patient records found.</p>
          <p className="text-xs text-slate-500">Try adjusting your search filters or add a new patient above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Patient Info</th>
                  <th className="py-3.5 px-6">Clinical Params</th>
                  <th className="py-3.5 px-6">Owner Information</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPatients.map((pet) => (
                  <tr key={pet.id} className="hover:bg-slate-50/80 transition-colors text-slate-700">
                    <td className="py-4 px-6 font-bold text-navy-900">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-orange-100 text-orange-600 font-bold flex items-center justify-center text-xl shrink-0">
                          🐾
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-navy-900">{pet.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            {pet.species} • {pet.breed || "Unspecified Breed"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 space-y-0.5">
                      <div>
                        <strong>Sex:</strong> {pet.sex} ({pet.is_neutered ? "Neutered/Spayed" : "Intact"})
                      </div>
                      <div>
                        <strong>DOB:</strong> {pet.date_of_birth || "N/A"} | <strong>Markings:</strong> {pet.color_markings || "N/A"}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-slate-600 space-y-0.5">
                      <div className="font-bold text-navy-900">{pet.owner_name || "Unassigned Owner"}</div>
                      <div className="text-[11px] text-slate-500">
                        📞 {pet.owner_phone || "N/A"} | ✉️ {pet.owner_email || "N/A"}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveMedicalPet(pet)}
                          className="px-3 py-1.5 rounded-xl bg-orange-50 hover:bg-orange-500 hover:text-white text-orange-600 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          📋 Medical Modal
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setErrorMsg(null);
                            setEditingPet(pet);
                          }}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeletePet(pet.id, pet.name)}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-600 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1. MEDICAL HISTORY LOGS MODAL */}
      {activeMedicalPet && (
        <PetDetailModal
          isOpen={Boolean(activeMedicalPet)}
          onClose={() => setActiveMedicalPet(null)}
          pet={activeMedicalPet}
          logs={activeMedicalPet.logs}
          isStaffOrAdmin={true}
        />
      )}

      {/* 2. EDIT / ADD PATIENT MODAL */}
      {(editingPet || isNewPetModalOpen) && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-navy-950/75 backdrop-blur-xs">
          <div
            className="fixed inset-0"
            onClick={() => {
              setEditingPet(null);
              setIsNewPetOpen(false);
            }}
          />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 my-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <h2 className="text-lg font-bold text-navy-900">
                {editingPet ? `Edit Patient: ${editingPet.name}` : "Register New Patient"}
              </h2>
              <button
                type="button"
                onClick={() => {
                  setEditingPet(null);
                  setIsNewPetOpen(false);
                }}
                className="text-slate-400 hover:text-navy-900 cursor-pointer text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handlePetFormSubmit} className="space-y-4">
              {editingPet && <input type="hidden" name="id" value={editingPet.id} />}

              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 block w-fit">
                  1. Clinical Patient Parameters
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pet Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingPet?.name || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Species * (Canine / Feline)</label>
                    <input
                      type="text"
                      name="species"
                      required
                      defaultValue={editingPet?.species || "Canine"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Breed</label>
                    <input
                      type="text"
                      name="breed"
                      defaultValue={editingPet?.breed || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sex *</label>
                    <select
                      name="sex"
                      required
                      defaultValue={editingPet?.sex || "Male"}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>
                  <div className="pt-5">
                    <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer">
                      <input
                        type="checkbox"
                        name="isNeutered"
                        defaultChecked={editingPet?.is_neutered}
                        className="w-4 h-4 text-orange-500 rounded"
                      />
                      <span>Neutered / Spayed</span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date of Birth</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      defaultValue={editingPet?.date_of_birth || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Microchip No.</label>
                    <input
                      type="text"
                      name="microchipNo"
                      defaultValue={editingPet?.microchip_no || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color / Markings & Identification</label>
                  <input
                    type="text"
                    name="colorMarkings"
                    defaultValue={editingPet?.color_markings || ""}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-navy-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 block w-fit">
                  2. Owner Contact & Handler Info
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Name</label>
                    <input
                      type="text"
                      name="ownerName"
                      defaultValue={editingPet?.owner_name || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Phone</label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      defaultValue={editingPet?.owner_phone || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Email</label>
                    <input
                      type="email"
                      name="ownerEmail"
                      defaultValue={editingPet?.owner_email || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Address</label>
                    <input
                      type="text"
                      name="ownerAddress"
                      defaultValue={editingPet?.owner_address || ""}
                      className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Handlers</label>
                  <textarea
                    name="authorizedHandlers"
                    rows={2}
                    defaultValue={editingPet?.authorized_handlers || ""}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => {
                    setEditingPet(null);
                    setIsNewPetOpen(false);
                  }}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Saving..." : "Save Patient Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}