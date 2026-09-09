"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

export interface PetSummary {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  sex: string;
  is_neutered: boolean;
  date_of_birth: string | null;
  microchip_no: string | null;
  color_markings: string | null;
}

export interface OwnerRecord {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  address: string | null;
  authorized_handlers: string | null;
  created_at: string;
  pets: PetSummary[];
}

interface OwnerViewProps {
  owners: OwnerRecord[];
}

const emptySubscribe = () => () => {};

export function OwnerView({ owners }: OwnerViewProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOwner, setSelectedOwner] = useState<OwnerRecord | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Filter owners by name, email, phone, address, or pet names
  const filteredOwners = owners.filter((owner) => {
    const term = searchTerm.toLowerCase();

    const matchesOwnerInfo =
      (owner.full_name && owner.full_name.toLowerCase().includes(term)) ||
      owner.email.toLowerCase().includes(term) ||
      (owner.phone && owner.phone.toLowerCase().includes(term)) ||
      (owner.address && owner.address.toLowerCase().includes(term));

    const matchesPetName = owner.pets.some(
      (pet) =>
        pet.name.toLowerCase().includes(term) ||
        pet.species.toLowerCase().includes(term) ||
        (pet.breed && pet.breed.toLowerCase().includes(term))
    );

    return matchesOwnerInfo || matchesPetName;
  });

  const getSpeciesIcon = (species: string) => {
    const s = species.toLowerCase();
    if (s.includes("canine") || s.includes("dog")) return "🐕";
    if (s.includes("feline") || s.includes("cat")) return "🐈";
    if (s.includes("bird")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐾";
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Owner Registry</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage registered pet parents, review primary contact addresses, emergency handlers, and linked pet patients.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-500 bg-slate-100 px-3.5 py-1.5 rounded-full border border-slate-200 self-start sm:self-auto">
          {owners.length} Registered Owners
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:max-w-md">
          <input
            type="text"
            placeholder="Search by owner name, email, phone, address, or pet name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredOwners.length} of {owners.length} total owners
        </span>
      </div>

      {/* Owners Table */}
      {filteredOwners.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 text-center space-y-3">
          <p className="text-sm font-bold text-navy-900">No owner records found.</p>
          <p className="text-xs text-slate-500">Try adjusting your search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Owner Profile</th>
                  <th className="py-3.5 px-6">Mobile Contact</th>
                  <th className="py-3.5 px-6">Home Address</th>
                  <th className="py-3.5 px-6">Registered Pets</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredOwners.map((owner) => (
                  <tr
                    key={owner.id}
                    onClick={() => setSelectedOwner(owner)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer text-slate-700"
                  >
                    {/* Owner Name & Email */}
                    <td className="py-4 px-6 font-bold text-navy-900">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-navy-900 text-white font-extrabold flex items-center justify-center text-xs shrink-0 shadow-2xs">
                          {owner.full_name ? owner.full_name.charAt(0).toUpperCase() : owner.email.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-extrabold text-navy-900">
                            {owner.full_name || "Pet Parent"}
                          </div>
                          <div className="text-[11px] text-slate-400 font-normal">{owner.email}</div>
                        </div>
                      </div>
                    </td>

                    {/* Phone */}
                    <td className="py-4 px-6 font-semibold text-slate-800">
                      {owner.phone ? `📞 ${owner.phone}` : "—"}
                    </td>

                    {/* Address */}
                    <td className="py-4 px-6 text-slate-600 max-w-xs truncate">
                      {owner.address || "—"}
                    </td>

                    {/* Registered Pets Tag List */}
                    <td className="py-4 px-6">
                      {owner.pets.length === 0 ? (
                        <span className="text-slate-400 italic">No pets registered</span>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1.5">
                          {owner.pets.map((pet) => (
                            <span
                              key={pet.id}
                              className="inline-flex items-center gap-1 bg-orange-50 text-orange-800 border border-orange-200/80 px-2.5 py-1 rounded-full text-[11px] font-bold"
                            >
                              <span>{getSpeciesIcon(pet.species)}</span>
                              <span>{pet.name}</span>
                              <span className="text-[10px] text-orange-600 font-normal">({pet.species})</span>
                            </span>
                          ))}
                        </div>
                      )}
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedOwner(owner);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-navy-900 hover:bg-orange-500 text-white font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        View Profile ➔
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* DETAILED OWNER PROFILE MODAL (Portal) */}
      {selectedOwner && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="owner-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/75 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setSelectedOwner(null)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-6 my-auto animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-navy-900 to-slate-800 text-white font-extrabold text-xl flex items-center justify-center uppercase shadow-md shrink-0">
                  {selectedOwner.full_name ? selectedOwner.full_name.charAt(0).toUpperCase() : selectedOwner.email.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 id="owner-modal-title" className="text-xl font-extrabold text-navy-900">
                    {selectedOwner.full_name || "Pet Owner Profile"}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Member since {new Date(selectedOwner.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOwner(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {/* Owner Contact Information Summary */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
              <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1.5">
                Primary Contact Details
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-700">
                <div>
                  <span className="text-slate-400 font-medium block">Email Address:</span>
                  <span className="font-bold text-navy-900">{selectedOwner.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 font-medium block">Mobile Contact:</span>
                  <span className="font-bold text-navy-900">📞 {selectedOwner.phone || "N/A"}</span>
                </div>
                <div className="sm:col-span-2">
                  <span className="text-slate-400 font-medium block">Primary Home Address:</span>
                  <span className="font-bold text-navy-900">{selectedOwner.address || "N/A"}</span>
                </div>
              </div>

              {selectedOwner.authorized_handlers && (
                <div className="pt-2 border-t border-slate-200/80">
                  <span className="text-slate-400 font-medium block">Authorized Pet Handlers:</span>
                  <span className="font-bold text-orange-700">{selectedOwner.authorized_handlers}</span>
                </div>
              )}
            </div>

            {/* Linked Pets Section */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-navy-900">
                  Registered Pets ({selectedOwner.pets.length})
                </h3>
              </div>

              {selectedOwner.pets.length === 0 ? (
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 text-center text-xs text-slate-500">
                  No pets registered for this owner.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {selectedOwner.pets.map((pet) => (
                    <div
                      key={pet.id}
                      className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-2xs space-y-2 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getSpeciesIcon(pet.species)}</span>
                          <span className="font-extrabold text-navy-900 text-sm">{pet.name}</span>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-50 text-orange-700 border border-orange-100">
                          {pet.species}
                        </span>
                      </div>

                      <div className="space-y-1 text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <p><span className="font-semibold text-slate-800">Breed:</span> {pet.breed || "Unspecified"}</p>
                        <p><span className="font-semibold text-slate-800">Sex:</span> {pet.sex} {pet.is_neutered ? "(Neutered/Spayed)" : "(Intact)"}</p>
                        <p><span className="font-semibold text-slate-800">DOB:</span> {pet.date_of_birth || "N/A"}</p>
                        <p><span className="font-semibold text-slate-800">Color / Markings:</span> {pet.color_markings || "N/A"}</p>
                        {pet.microchip_no && <p><span className="font-semibold text-slate-800">Microchip #:</span> {pet.microchip_no}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedOwner(null)}
                className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}