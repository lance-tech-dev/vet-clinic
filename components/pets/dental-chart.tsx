"use client";

import { useState } from "react";

export type ToothCondition = "normal" | "displaced" | "missing" | "caries";

export interface DentalChartState {
  hasSalivation: boolean;
  hasPeriodontalDisease: boolean;
  toothConditions: Record<string, ToothCondition>;
  notes: string;
  veterinarian: string;
}

interface DentalChartProps {
  species?: string;
  initialData?: DentalChartState;
  onSubmitLog?: (data: DentalChartState) => void;
  isPending?: boolean;
  readOnly?: boolean;
}

// Triadan Tooth Definitions for Small Animals (Canine & Feline)
const CANINE_UPPER = [
  { id: "101", label: "I1" }, { id: "102", label: "I2" }, { id: "103", label: "I3" }, { id: "104", label: "C" },
  { id: "105", label: "P1" }, { id: "106", label: "P2" }, { id: "107", label: "P3" }, { id: "108", label: "P4" },
  { id: "109", label: "M1" }, { id: "110", label: "M2" }, { id: "201", label: "I1" }, { id: "202", label: "I2" },
  { id: "203", label: "I3" }, { id: "204", label: "C" }, { id: "205", label: "P1" }, { id: "206", label: "P2" },
  { id: "207", label: "P3" }, { id: "208", label: "P4" }, { id: "209", label: "M1" }, { id: "210", label: "M2" }
];

const CANINE_LOWER = [
  { id: "401", label: "I1" }, { id: "402", label: "I2" }, { id: "403", label: "I3" }, { id: "404", label: "C" },
  { id: "405", label: "P1" }, { id: "406", label: "P2" }, { id: "407", label: "P3" }, { id: "408", label: "P4" },
  { id: "409", label: "M1" }, { id: "410", label: "M2" }, { id: "411", label: "M3" }, { id: "301", label: "I1" },
  { id: "302", label: "I2" }, { id: "303", label: "I3" }, { id: "304", label: "C" }, { id: "305", label: "P1" },
  { id: "306", label: "P2" }, { id: "307", label: "P3" }, { id: "308", label: "P4" }, { id: "309", label: "M1" },
  { id: "310", label: "M2" }, { id: "311", label: "M3" }
];

export function DentalChart({
  species = "Dog",
  initialData,
  onSubmitLog,
  isPending = false,
  readOnly = false,
}: DentalChartProps) {
  const [hasSalivation, setHasSalivation] = useState(initialData?.hasSalivation || false);
  const [hasPeriodontalDisease, setHasPeriodontalDisease] = useState(
    initialData?.hasPeriodontalDisease || false
  );
  const [toothConditions, setToothConditions] = useState<Record<string, ToothCondition>>(
    initialData?.toothConditions || {}
  );
  const [notes, setNotes] = useState(initialData?.notes || "");
  const [veterinarian, setVeterinarian] = useState(initialData?.veterinarian || "");

  const handleToothClick = (toothId: string) => {
    if (readOnly) return;

    setToothConditions((prev) => {
      const current = prev[toothId] || "normal";
      let next: ToothCondition = "displaced";

      if (current === "normal") next = "displaced";
      else if (current === "displaced") next = "missing";
      else if (current === "missing") next = "caries";
      else if (current === "caries") next = "normal";

      if (next === "normal") {
        const updated = { ...prev };
        delete updated[toothId];
        return updated;
      }

      return { ...prev, [toothId]: next };
    });
  };

  const getConditionSymbol = (condition?: ToothCondition) => {
    switch (condition) {
      case "displaced":
        return "O";
      case "missing":
        return "X";
      case "caries":
        return "/";
      default:
        return "";
    }
  };

  const getConditionColor = (condition?: ToothCondition) => {
    switch (condition) {
      case "displaced":
        return "bg-amber-100 border-amber-400 text-amber-800 font-bold";
      case "missing":
        return "bg-red-100 border-red-400 text-red-800 font-bold";
      case "caries":
        return "bg-purple-100 border-purple-400 text-purple-800 font-bold";
      default:
        return "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmitLog) {
      onSubmitLog({
        hasSalivation,
        hasPeriodontalDisease,
        toothConditions,
        notes,
        veterinarian,
      });
    }
  };

  return (
    <div className="bg-slate-50/80 p-5 sm:p-6 rounded-3xl border border-slate-200/80 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
        <div>
          <h3 className="text-sm font-bold text-navy-900 uppercase tracking-wider">
            Small Animal Dentition Chart ({species.toUpperCase()})
          </h3>
          <p className="text-xs text-slate-500">
            Click on any tooth to toggle condition: <strong className="text-amber-700">O Displaced</strong>,{" "}
            <strong className="text-red-700">X Missing</strong>, or <strong className="text-purple-700">/ Caries/Injury</strong>.
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-[11px] font-bold shrink-0">
          <span className="flex items-center gap-1 text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200">
            <span>O</span> Displaced
          </span>
          <span className="flex items-center gap-1 text-red-800 bg-red-50 px-2 py-1 rounded-md border border-red-200">
            <span>X</span> Missing
          </span>
          <span className="flex items-center gap-1 text-purple-800 bg-purple-50 px-2 py-1 rounded-md border border-purple-200">
            <span>/</span> Caries/Injury
          </span>
        </div>
      </div>

      {/* Teeth Grid Map */}
      <div className="space-y-4">
        {/* Upper Maxilla Arch */}
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Upper Maxillary Arch (Right & Left)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {CANINE_UPPER.map((tooth) => {
              const cond = toothConditions[tooth.id];
              return (
                <button
                  key={tooth.id}
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleToothClick(tooth.id)}
                  className={`w-8 h-10 rounded-lg border flex flex-col items-center justify-center text-[10px] transition-all ${getConditionColor(
                    cond
                  )} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                  title={`Tooth ${tooth.id} (${tooth.label}): ${cond || "Normal"}`}
                >
                  <span className="text-[9px] font-semibold opacity-60">{tooth.id}</span>
                  <span className="font-extrabold text-xs">{getConditionSymbol(cond) || tooth.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Lower Mandible Arch */}
        <div className="space-y-1.5 pt-2 border-t border-slate-200/60">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block text-center">
            Lower Mandibular Arch (Right & Left)
          </span>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {CANINE_LOWER.map((tooth) => {
              const cond = toothConditions[tooth.id];
              return (
                <button
                  key={tooth.id}
                  type="button"
                  disabled={readOnly}
                  onClick={() => handleToothClick(tooth.id)}
                  className={`w-8 h-10 rounded-lg border flex flex-col items-center justify-center text-[10px] transition-all ${getConditionColor(
                    cond
                  )} ${readOnly ? "cursor-default" : "cursor-pointer"}`}
                  title={`Tooth ${tooth.id} (${tooth.label}): ${cond || "Normal"}`}
                >
                  <span className="text-[9px] font-semibold opacity-60">{tooth.id}</span>
                  <span className="font-extrabold text-xs">{getConditionSymbol(cond) || tooth.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Conditions Checkboxes & Notes Form */}
      <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-navy-900 cursor-pointer">
            <input
              type="checkbox"
              checked={hasSalivation}
              disabled={readOnly}
              onChange={(e) => setHasSalivation(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Salivation Present</span>
          </label>

          <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-slate-200 text-xs font-bold text-navy-900 cursor-pointer">
            <input
              type="checkbox"
              checked={hasPeriodontalDisease}
              disabled={readOnly}
              onChange={(e) => setHasPeriodontalDisease(e.target.checked)}
              className="w-4 h-4 rounded text-orange-500 focus:ring-orange-500"
            />
            <span>Periodontal Disease Present</span>
          </label>
        </div>

        <div>
          <label htmlFor="dentalNotes" className="block text-xs font-semibold text-slate-700 mb-1">
            Dental Clinical Notes
          </label>
          <textarea
            id="dentalNotes"
            rows={2}
            disabled={readOnly}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Describe tartar buildup, scaling recommendations, or extractions..."
            className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:bg-slate-100"
          />
        </div>

        {!readOnly && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <div>
              <label htmlFor="dentalVet" className="block text-xs font-semibold text-slate-700 mb-1">
                Attending Veterinarian *
              </label>
              <input
                id="dentalVet"
                type="text"
                required
                value={veterinarian}
                onChange={(e) => setVeterinarian(e.target.value)}
                placeholder="e.g. Dr. Jane Doe, DVM"
                className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-slate-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="w-full py-2.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              {isPending ? "Saving Record..." : "Save Dental Exam Record"}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}