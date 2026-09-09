"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { updateAppointmentStatus, deleteAppointment } from "./actions";

export interface Branch {
  id: string;
  name: string;
  city: string;
}

export interface Appointment {
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
  updated_at: string;
}

interface AppointmentViewProps {
  branches: Branch[];
  appointments: Appointment[];
}

export function AppointmentView({ branches, appointments }: AppointmentViewProps) {
  const [selectedBranchFilter, setSelectedBranchFilter] = useState<string>("ALL");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>("ALL");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const handleStatusChange = (id: string, status: "scheduled" | "completed" | "cancelled") => {
    startTransition(async () => {
      await updateAppointmentStatus(id, status);
    });
  };

  const handleDelete = (id: string, petName: string) => {
    if (confirm(`Are you sure you want to delete the appointment record for ${petName}?`)) {
      startTransition(async () => {
        await deleteAppointment(id);
      });
    }
  };

  // Filter Logic
  const filteredAppointments = appointments.filter((app) => {
    const matchesBranch =
      selectedBranchFilter === "ALL" || app.branch_id === selectedBranchFilter;
    const matchesStatus =
      selectedStatusFilter === "ALL" || app.status === selectedStatusFilter;
    const matchesDate =
      !selectedDateFilter || app.appointment_date === selectedDateFilter;

    return matchesBranch && matchesStatus && matchesDate;
  });

  if (branches.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mx-auto font-bold shadow-2xs">
          🏥
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-navy-900">No Branches Configured</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Please add at least one clinic branch before viewing appointment schedules.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={ROUTES.ADMIN + "/branches"}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md transition-all cursor-pointer"
          >
            + Create Branch
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Expected Patients & Appointments</h1>
        <p className="text-sm text-slate-500">
          Incoming patient arrivals manifest per branch location. Walk-ins and pre-scheduled visits require no manual acceptance.
        </p>
      </div>

      {/* Filter Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          {/* Branch Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-branch" className="text-xs font-bold text-slate-600 shrink-0">
              Branch:
            </label>
            <select
              id="filter-branch"
              value={selectedBranchFilter}
              onChange={(e) => setSelectedBranchFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="ALL">All Branches ({branches.length})</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.city})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-status" className="text-xs font-bold text-slate-600 shrink-0">
              Status:
            </label>
            <select
              id="filter-status"
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
            >
              <option value="ALL">All Statuses</option>
              <option value="scheduled">Scheduled (Expected)</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="flex items-center gap-2">
            <label htmlFor="filter-date" className="text-xs font-bold text-slate-600 shrink-0">
              Date:
            </label>
            <input
              id="filter-date"
              type="date"
              value={selectedDateFilter}
              onChange={(e) => setSelectedDateFilter(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            {selectedDateFilter && (
              <button
                type="button"
                onClick={() => setSelectedDateFilter("")}
                className="text-[11px] font-bold text-slate-400 hover:text-orange-600 underline cursor-pointer"
              >
                Clear Date
              </button>
            )}
          </div>
        </div>

        <span className="text-xs text-slate-400 font-medium">
          Showing {filteredAppointments.length} of {appointments.length} total records
        </span>
      </div>

      {/* Appointments List / Table */}
      {filteredAppointments.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-slate-200/80 shadow-xs text-center space-y-2">
          <p className="text-sm font-bold text-navy-900">No scheduled appointments match the criteria.</p>
          <p className="text-xs text-slate-500">Adjust your branch, status, or date filter above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Scheduled Visit</th>
                  <th className="py-3.5 px-6">Branch</th>
                  <th className="py-3.5 px-6">Pet Patient</th>
                  <th className="py-3.5 px-6">Service Requested</th>
                  <th className="py-3.5 px-6">Owner Contact</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {filteredAppointments.map((app) => {
                  const assignedBranch = branches.find((b) => b.id === app.branch_id);

                  return (
                    <tr key={app.id} className="hover:bg-slate-50/60 transition-colors text-slate-700">
                      {/* Scheduled Date & Time */}
                      <td className="py-4 px-6 font-bold text-navy-900">
                        <div>📅 {app.appointment_date}</div>
                        <div className="text-[11px] font-semibold text-orange-600">⏰ {app.time_slot}</div>
                      </td>

                      {/* Branch Name */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        {assignedBranch ? assignedBranch.name : "Unknown Branch"}
                      </td>

                      {/* Pet Patient & Breed */}
                      <td className="py-4 px-6">
                        <div className="font-bold text-navy-900">🐾 {app.pet_name}</div>
                        <div className="text-[11px] text-slate-400">{app.species_breed}</div>
                      </td>

                      {/* Service Required */}
                      <td className="py-4 px-6 font-semibold text-slate-800">
                        <div>{app.service_name}</div>
                        {app.notes && (
                          <div className="text-[10px] text-slate-500 italic max-w-xs truncate" title={app.notes}>
                            Note: {app.notes}
                          </div>
                        )}
                        {app.reschedule_reason && (
                          <div className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 border border-amber-200 max-w-xs truncate" title={app.reschedule_reason}>
                            ⚠️ Rescheduled: {app.reschedule_reason}
                          </div>
                        )}
                      </td>

                      {/* Owner Contact */}
                      <td className="py-4 px-6 text-slate-600">
                        <div className="font-semibold text-navy-900">{app.owner_name}</div>
                        <div className="text-[11px] text-slate-400">📞 {app.phone}</div>
                      </td>

                      {/* Arrival Status Badge */}
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                            app.status === "scheduled"
                              ? "bg-amber-50 text-amber-800 border-amber-200"
                              : app.status === "completed"
                              ? "bg-emerald-100 text-emerald-800 border-emerald-200"
                              : "bg-red-50 text-red-700 border-red-200"
                          }`}
                        >
                          {app.status === "scheduled" && "⏳ Expected Arrival"}
                          {app.status === "completed" && "✓ Completed Visit"}
                          {app.status === "cancelled" && "✕ Cancelled"}
                        </span>
                      </td>

                      {/* Status Toggle Actions */}
                      <td className="py-4 px-6 text-right space-x-1.5">
                        {app.status !== "completed" && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleStatusChange(app.id, "completed")}
                            className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] transition-colors cursor-pointer"
                            title="Mark patient as completed"
                          >
                            Mark Completed
                          </button>
                        )}

                        {app.status !== "cancelled" && (
                          <button
                            type="button"
                            disabled={isPending}
                            onClick={() => handleStatusChange(app.id, "cancelled")}
                            className="px-2.5 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold text-[11px] transition-colors cursor-pointer"
                            title="Mark as cancelled"
                          >
                            Cancel
                          </button>
                        )}

                        <button
                          type="button"
                          disabled={isPending}
                          onClick={() => handleDelete(app.id, app.pet_name)}
                          className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-bold text-[11px] transition-colors cursor-pointer"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}