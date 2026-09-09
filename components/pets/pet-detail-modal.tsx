"use client";

import { useState, useTransition, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { DentalChart, type DentalChartState } from "./dental-chart";
import {
  addGroomingLog,
  addVaccinationLog,
  addParasiteLog,
  addMedicalVisitLog,
  addDentalLog,
} from "@/app/admin/patients/actions";

export interface PetFullRecord {
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
}

export interface MedicalLogsData {
  groomingLogs: any[];
  vaccinationLogs: any[];
  parasiteLogs: any[];
  visitLogs: any[];
  dentalLogs: any[];
}

interface PetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  pet: PetFullRecord;
  logs: MedicalLogsData;
  isStaffOrAdmin?: boolean;
}

const emptySubscribe = () => () => {};

export function PetDetailModal({
  isOpen,
  onClose,
  pet,
  logs,
  isStaffOrAdmin = true,
}: PetDetailModalProps) {
  const [activeTab, setActiveTab] = useState<"grooming" | "vaccination" | "parasite" | "visit" | "dental">("grooming");
  const [isPending, startTransition] = useTransition();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!isOpen || !isMounted) return null;

  const handleGroomingSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    formData.append("petId", pet.id);

    startTransition(async () => {
      const res = await addGroomingLog(formData);
      if (!res.success) setErrorMsg(res.error);
      else (e.target as HTMLFormElement).reset();
    });
  };

  const handleVaccinationSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    formData.append("petId", pet.id);

    startTransition(async () => {
      const res = await addVaccinationLog(formData);
      if (!res.success) setErrorMsg(res.error);
      else (e.target as HTMLFormElement).reset();
    });
  };

  const handleParasiteSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    formData.append("petId", pet.id);

    startTransition(async () => {
      const res = await addParasiteLog(formData);
      if (!res.success) setErrorMsg(res.error);
      else (e.target as HTMLFormElement).reset();
    });
  };

  const handleVisitSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);
    const formData = new FormData(e.currentTarget);
    formData.append("petId", pet.id);

    startTransition(async () => {
      const res = await addMedicalVisitLog(formData);
      if (!res.success) setErrorMsg(res.error);
      else (e.target as HTMLFormElement).reset();
    });
  };

  const handleDentalSubmit = (chartData: DentalChartState) => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await addDentalLog(
        pet.id,
        new Date().toISOString().split("T")[0],
        chartData.hasSalivation,
        chartData.hasPeriodontalDisease,
        chartData.toothConditions,
        chartData.notes,
        chartData.veterinarian
      );
      if (!res.success) setErrorMsg(res.error);
    });
  };

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="pet-modal-title"
      className="fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-6 bg-navy-950/75 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative z-10 bg-white rounded-3xl border border-slate-200 shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto space-y-6 p-6 sm:p-8 my-auto animate-in zoom-in-95 duration-200">
        
        {/* Header Bar */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl font-bold shadow-2xs">
              🐾
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 id="pet-modal-title" className="text-xl font-extrabold text-navy-900">
                  {pet.name}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-orange-50 text-orange-700 border border-orange-200">
                  {pet.species} ({pet.sex} • {pet.is_neutered ? "Neutered/Spayed" : "Intact"})
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Breed: <strong>{pet.breed || "N/A"}</strong> | DOB: <strong>{pet.date_of_birth || "N/A"}</strong> | Microchip: <strong>{pet.microchip_no || "N/A"}</strong>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* General Pet & Owner Info Accordion Box */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 text-xs space-y-3">
          <div className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider border-b border-slate-200 pb-1.5">
            General Pet & Owner Information Summary
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-slate-700">
            <div>
              <span className="text-slate-400 font-medium block">Color & Markings:</span>
              <span className="font-bold text-navy-900">{pet.color_markings || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Owner Full Name:</span>
              <span className="font-bold text-navy-900">{pet.owner_name || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Mobile Contact:</span>
              <span className="font-bold text-navy-900">📞 {pet.owner_phone || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Email Address:</span>
              <span className="font-bold text-navy-900">{pet.owner_email || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Home Address:</span>
              <span className="font-bold text-navy-900">{pet.owner_address || "N/A"}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Authorized Handlers:</span>
              <span className="font-bold text-navy-900">{pet.authorized_handlers || "N/A"}</span>
            </div>
          </div>
        </div>

        {errorMsg && (
          <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-bold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Medical History Tabs Header (Cleaned up Tab Titles) */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl overflow-x-auto">
          {[
            { id: "grooming", label: "Grooming & Boarding" },
            { id: "vaccination", label: "Vaccination Log" },
            { id: "parasite", label: "Ecto/Endoparasite" },
            { id: "visit", label: "Vet Visit History" },
            { id: "dental", label: "Dental Records" },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-bold rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                activeTab === tab.id
                  ? "bg-white text-navy-900 shadow-xs"
                  : "text-slate-600 hover:text-navy-900"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: Pet Grooming & Boarding Log */}
        {activeTab === "grooming" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy-900 border-b pb-2">Grooming & Boarding Log</h3>

            {isStaffOrAdmin && (
              <form onSubmit={handleGroomingSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date *</label>
                    <input
                      type="date"
                      name="logDate"
                      required
                      defaultValue={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-navy-900"
                    />
                  </div>
                  <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer pt-6">
                    <input type="checkbox" name="isGrooming" defaultChecked className="w-4 h-4 text-orange-500 rounded" />
                    <span>Grooming</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-navy-900 cursor-pointer pt-6">
                    <input type="checkbox" name="isBoarding" className="w-4 h-4 text-orange-500 rounded" />
                    <span>Boarding</span>
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Medical History</label>
                    <textarea name="medicalHistory" rows={2} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Medications / Supplements</label>
                    <textarea name="medicationsSupplements" rows={2} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Special Needs / Preferences & Notes</label>
                  <textarea name="specialNeedsPreferences" rows={2} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                </div>

                <button type="submit" disabled={isPending} className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer">
                  {isPending ? "Saving..." : "Add Grooming / Boarding Entry"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {logs.groomingLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No grooming or boarding records found.</p>
              ) : (
                logs.groomingLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-navy-900">
                      <span>📅 {log.log_date} ({log.is_grooming ? "✂️ Grooming" : ""} {log.is_boarding ? "🏠 Boarding" : ""})</span>
                    </div>
                    {log.medical_history && <p><strong className="text-slate-500">History:</strong> {log.medical_history}</p>}
                    {log.medications_supplements && <p><strong className="text-slate-500">Meds:</strong> {log.medications_supplements}</p>}
                    {log.special_needs_preferences && <p><strong className="text-slate-500">Special Needs:</strong> {log.special_needs_preferences}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 2: Vaccination Log */}
        {activeTab === "vaccination" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy-900 border-b pb-2">Vaccination Log</h3>

            {isStaffOrAdmin && (
              <form onSubmit={handleVaccinationSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date Given *</label>
                    <input type="date" name="dateGiven" required className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (Kg)</label>
                    <input type="number" step="0.1" name="weightKg" placeholder="e.g. 5.2" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Against Disease *</label>
                    <input type="text" name="againstDisease" required placeholder="e.g. Rabies / DHPP" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Vaccine Used *</label>
                    <input type="text" name="vaccineUsed" required placeholder="e.g. Nobivac" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Lot / Batch No.</label>
                    <input type="text" name="lotBatchNo" placeholder="e.g. LOT-12345" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Next Due Date</label>
                    <input type="date" name="nextDue" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Veterinarian *</label>
                  <input type="text" name="veterinarian" required placeholder="e.g. Dr. John Smith, DVM" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                </div>

                <button type="submit" disabled={isPending} className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer">
                  {isPending ? "Saving..." : "Add Vaccine Entry"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {logs.vaccinationLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No vaccination records found.</p>
              ) : (
                logs.vaccinationLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs flex flex-wrap justify-between gap-2">
                    <div>
                      <div className="font-bold text-navy-900">💉 {log.against_disease} ({log.vaccine_used})</div>
                      <div className="text-slate-500 text-[11px]">Given: {log.date_given} | Weight: {log.weight_kg ? `${log.weight_kg} kg` : "N/A"} | Lot: {log.lot_batch_no || "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">Next Due: {log.next_due || "N/A"}</div>
                      <div className="text-slate-400 text-[11px]">Vet: {log.veterinarian}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 3: Ecto Endoparasite Preventatives */}
        {activeTab === "parasite" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy-900 border-b pb-2">Ecto & Endoparasite Preventatives Log</h3>

            {isStaffOrAdmin && (
              <form onSubmit={handleParasiteSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Date Given *</label>
                    <input type="date" name="dateGiven" required className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (Kg)</label>
                    <input type="number" step="0.1" name="weightKg" placeholder="e.g. 6.0" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Against Parasite *</label>
                    <input type="text" name="againstParasites" required placeholder="e.g. Fleas, Ticks, Heartworm" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Preventative Used *</label>
                    <input type="text" name="preventativeUsed" required placeholder="e.g. NexGard / Simparica" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Next Due Date</label>
                    <input type="date" name="nextDue" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Veterinarian *</label>
                    <input type="text" name="veterinarian" required placeholder="e.g. Dr. Smith" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <button type="submit" disabled={isPending} className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer">
                  {isPending ? "Saving..." : "Add Parasite Preventative"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {logs.parasiteLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No parasite preventative records found.</p>
              ) : (
                logs.parasiteLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs flex flex-wrap justify-between gap-2">
                    <div>
                      <div className="font-bold text-navy-900">🛡️ {log.against_parasites} ({log.preventative_used})</div>
                      <div className="text-slate-500 text-[11px]">Given: {log.date_given} | Weight: {log.weight_kg ? `${log.weight_kg} kg` : "N/A"}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-orange-600">Next Due: {log.next_due || "N/A"}</div>
                      <div className="text-slate-400 text-[11px]">Vet: {log.veterinarian}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 4: Vet Visit / Medical History */}
        {activeTab === "visit" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy-900 border-b pb-2">Vet Visit & Clinical History</h3>

            {isStaffOrAdmin && (
              <form onSubmit={handleVisitSubmit} className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Visit Date *</label>
                    <input type="date" name="visitDate" required defaultValue={new Date().toISOString().split("T")[0]} className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Reason for Visit *</label>
                    <input type="text" name="reasonForVisit" required placeholder="e.g. Lethargy, Vomiting, Checkup" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Clinical Findings *</label>
                  <textarea name="clinicalFindings" required rows={2} placeholder="Examination findings..." className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Vet&apos;s Instructions & Recommendations *</label>
                  <textarea name="vetInstructions" required rows={2} placeholder="Prescribed meds, home care..." className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Follow Up Date</label>
                    <input type="date" name="followUpDate" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Veterinarian *</label>
                    <input type="text" name="veterinarian" required placeholder="e.g. Dr. Jane Doe" className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs" />
                  </div>
                </div>

                <button type="submit" disabled={isPending} className="py-2.5 px-5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs cursor-pointer">
                  {isPending ? "Saving..." : "Add Clinical Visit Record"}
                </button>
              </form>
            )}

            <div className="space-y-3">
              {logs.visitLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No medical visit records found.</p>
              ) : (
                logs.visitLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-bold text-navy-900">
                      <span>🩺 Visit: {log.visit_date} ({log.reason_for_visit})</span>
                      <span className="text-slate-400 text-[11px]">Vet: {log.veterinarian}</span>
                    </div>
                    <p><strong className="text-slate-500">Findings:</strong> {log.clinical_findings}</p>
                    <p><strong className="text-slate-500">Instructions:</strong> {log.vet_instructions}</p>
                    {log.follow_up_date && <p className="font-bold text-orange-600">Follow Up: {log.follow_up_date}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* TAB 5: Dental Records */}
        {activeTab === "dental" && (
          <div className="space-y-6">
            <h3 className="text-sm font-bold text-navy-900 border-b pb-2">Dental Records</h3>

            <DentalChart
              species={pet.species}
              readOnly={!isStaffOrAdmin}
              onSubmitLog={handleDentalSubmit}
              isPending={isPending}
            />

            <div className="space-y-3 pt-4">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Past Dental History Logs</h4>
              {logs.dentalLogs.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No dental logs recorded yet.</p>
              ) : (
                logs.dentalLogs.map((log: any) => (
                  <div key={log.id} className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-1">
                    <div className="flex items-center justify-between font-bold text-navy-900">
                      <span>🪥 Dental Exam: {log.record_date}</span>
                      <span className="text-slate-400 text-[11px]">Vet: {log.veterinarian || "N/A"}</span>
                    </div>
                    <div className="flex gap-3 text-[11px] font-semibold text-slate-600">
                      <span>Salivation: {log.has_salivation ? "Yes" : "No"}</span>
                      <span>Periodontal Disease: {log.has_periodontal_disease ? "Yes" : "No"}</span>
                    </div>
                    {log.notes && <p><strong className="text-slate-500">Notes:</strong> {log.notes}</p>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>,
    document.body
  );
}