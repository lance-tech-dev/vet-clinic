"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { PetDetailModal, type PetFullRecord, type MedicalLogsData } from "@/components/pets/pet-detail-modal";
import { upsertPet, deletePet } from "./actions";

export interface PetWithLogs {
  pet: PetFullRecord;
  logs: MedicalLogsData;
}

interface PatientViewProps {
  petsWithLogs: PetWithLogs[];
}

const emptySubscribe = () => () => {};

export function PatientView({ petsWithLogs }: PatientViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [speciesFilter, setSpeciesFilter] = useState("ALL");
  const [viewingPetRecord, setViewingPetRecord] = useState<PetWithLogs | null>(null);
  const [editingPet, setEditingPet] = useState<PetFullRecord | null>(null);
  const [isPetModalOpen, setIsPetModalOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const handleOpenCreateModal = () => {
    setEditingPet(null);
    setFormError(null);
    setIsPetModalOpen(true);
  };

  const handleOpenEditModal = (pet: PetFullRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPet(pet);
    setFormError(null);
    setIsPetModalOpen(true);
  };

  const handleDeletePet = (pet: PetFullRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm(`Are you sure you want to delete the record for ${pet.name}? All associated medical history logs will be permanently removed.`)) {
      startTransition(async () => {
        const res = await deletePet(pet.id);
        if (!res.success) {
          alert(res.error || "Failed to delete pet record.");
        }
      });
    }
  };

  const handlePetFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await upsertPet(editingPet?.id || null, formData);
      if (!res.success) {
        setFormError(res.error);
      } else {
        setIsPetModalOpen(false);
        setEditingPet(null);
      }
    });
  };

  // Filter Logic
  const filteredPets = petsWithLogs.filter(({ pet }) => {
    const matchesSearch =
      pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (pet.owner_name && pet.owner_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.microchip_no && pet.microchip_no.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (pet.breed && pet.breed.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesSpecies =
      speciesFilter === "ALL" || pet.species.toLowerCase() === speciesFilter.toLowerCase();

    return matchesSearch && matchesSpecies;
  });

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Patient Records Registry</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage comprehensive clinical profiles, owner contact details, and multi-tab medical logs for all registered patients.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer shrink-0"
        >
          + Register New Patient
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by pet name, owner, breed, or microchip #..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
          </div>

          <select
            value={speciesFilter}
            onChange={(e) => setSpeciesFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
          >
            <option value="ALL">All Species</option>
            <option value="Canine">Canine / Dog</option>
            <option value="Feline">Feline / Cat</option>
            <option value="Bird">Bird</option>
            <option value="Rabbit">Rabbit</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredPets.length} of {petsWithLogs.length} total patients
        </span>
      </div>

      {/* Patients Table */}
      {filteredPets.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <p className="text-sm font-bold text-navy-900">No patient records found.</p>
          <p className="text-xs text-slate-500">Try adjusting your search criteria or register a new patient above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-6">Species / Breed</th>
                  <th className="py-3.5 px-6">Sex / Neutered</th>
                  <th className="py-3.5 px-6">Owner Information</th>
                  <th className="py-3.5 px-6">Microchip #</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredPets.map(({ pet, logs }) => (
                  <tr
                    key={pet.id}
                    onClick={() => setViewingPetRecord({ pet, logs })}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-700"
                  >
                    <td className="py-4 px-6 font-bold text-navy-900">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🐾</span>
                        <div>
                          <div className="text-sm font-extrabold text-navy-900">{pet.name}</div>
                          <div className="text-[11px] text-slate-400 font-normal">
                            DOB: {pet.date_of_birth || "N/A"}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-6 font-semibold text-slate-800">
                      <div>{pet.species}</div>
                      <div className="text-[11px] text-slate-400 font-normal">{pet.breed || "Unspecified Breed"}</div>
                    </td>

                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                        {pet.sex} • {pet.is_neutered ? "Neutered" : "Intact"}
                      </span>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-navy-900">{pet.owner_name || "N/A"}</div>
                      <div className="text-[11px] text-slate-400">📞 {pet.owner_phone || "N/A"}</div>
                    </td>

                    <td className="py-4 px-6 font-mono text-slate-600">
                      {pet.microchip_no || "—"}
                    </td>

                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={(e) => handleOpenEditModal(pet, e)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        ✏️ Edit Details
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={(e) => handleDeletePet(pet, e)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 1. PET MEDICAL HISTORY MODAL (From Step 3) */}
      {viewingPetRecord && (
        <PetDetailModal
          isOpen={Boolean(viewingPetRecord)}
          onClose={() => setViewingPetRecord(null)}
          pet={viewingPetRecord.pet}
          logs={viewingPetRecord.logs}
          isStaffOrAdmin={true}
        />
      )}

      {/* 2. REGISTER / EDIT GENERAL PET & OWNER FORM MODAL (Portal) */}
      {isPetModalOpen && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="pet-form-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/75 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setIsPetModalOpen(false)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 id="pet-form-title" className="text-lg font-bold text-navy-900">
                  {editingPet ? `Edit Pet Record: ${editingPet.name}` : "Register New Patient"}
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Complete general pet information and owner contact details below.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsPetModalOpen(false)}
                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-lg text-sm transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
                ⚠️ {formError}
              </div>
            )}

            <form onSubmit={handlePetFormSubmit} className="space-y-5">
              {/* SECTION A: General Pet Information */}
              <div className="space-y-3">
                <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200">
                  1. General Pet Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Pet Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      defaultValue={editingPet?.name || ""}
                      placeholder="e.g. Buddy"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Species * (e.g. Canine / Feline)</label>
                    <input
                      type="text"
                      name="species"
                      required
                      defaultValue={editingPet?.species || "Canine"}
                      placeholder="e.g. Canine or Feline"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Breed (Optional)</label>
                    <input
                      type="text"
                      name="breed"
                      defaultValue={editingPet?.breed || ""}
                      placeholder="e.g. Golden Retriever"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Sex *</label>
                    <select
                      name="sex"
                      required
                      defaultValue={editingPet?.sex || "Male"}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500 cursor-pointer"
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
                        defaultChecked={editingPet?.is_neutered || false}
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
                      name="dateOfBirth"
                      required
                      defaultValue={editingPet?.date_of_birth || ""}
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Microchip No. (Optional)</label>
                    <input
                      type="text"
                      name="microchipNo"
                      defaultValue={editingPet?.microchip_no || ""}
                      placeholder="e.g. 985141002345678"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Color / Markings & Identification *</label>
                  <input
                    type="text"
                    name="colorMarkings"
                    required
                    defaultValue={editingPet?.color_markings || ""}
                    placeholder="e.g. Golden tan coat with white patch on chest"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              {/* SECTION B: Owner & Handler Information */}
              <div className="space-y-3 pt-3 border-t border-slate-100">
                <span className="text-xs font-extrabold uppercase tracking-wider text-navy-800 bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                  2. Owner & Handler Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Full Name *</label>
                    <input
                      type="text"
                      name="ownerName"
                      required
                      defaultValue={editingPet?.owner_name || ""}
                      placeholder="e.g. Maria Santos"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Contact Number *</label>
                    <input
                      type="tel"
                      name="ownerPhone"
                      required
                      defaultValue={editingPet?.owner_phone || ""}
                      placeholder="e.g. 09171234567"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Owner Email Address *</label>
                    <input
                      type="email"
                      name="ownerEmail"
                      required
                      defaultValue={editingPet?.owner_email || ""}
                      placeholder="e.g. maria@example.com"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Home Address *</label>
                    <input
                      type="text"
                      name="ownerAddress"
                      required
                      defaultValue={editingPet?.owner_address || ""}
                      placeholder="e.g. Brgy. San Rafael, San Pablo City"
                      className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Authorized Pet Handlers & Contact Details *</label>
                  <textarea
                    name="authorizedHandlers"
                    required
                    rows={2}
                    defaultValue={editingPet?.authorized_handlers || ""}
                    placeholder="e.g. Juan Santos (Husband) - 09181234567, Elena Santos (Sister)"
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsPetModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isPending ? "Saving Patient..." : editingPet ? "Update Patient Record" : "Save New Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}