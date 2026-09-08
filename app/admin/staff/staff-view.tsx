"use client";

import { useState, useActionState, useTransition, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { ROUTES } from "@/config/constants";
import { createStaff, updateStaff, toggleStaffStatus, deleteStaff, type StaffFormState } from "./actions";

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
}

export interface StaffMember {
  id: string;
  branch_id: string;
  full_name: string;
  role_title: string;
  specialization: string | null;
  avatar_url: string | null;
  phone: string | null;
  email: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface StaffViewProps {
  branches: Branch[];
  staffMembers: StaffMember[];
}

const initialState: StaffFormState = {
  error: null,
  success: false,
};

const emptySubscribe = () => () => {};

export function StaffView({ branches, staffMembers }: StaffViewProps) {
  const [addingStaffForBranch, setAddingStaffForBranch] = useState<Branch | null>(null);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);
  const [isPending, startTransition] = useTransition();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const [createState, createAction, isCreatePending] = useActionState(createStaff, initialState);
  const [updateState, updateAction, isUpdatePending] = useActionState(updateStaff, initialState);

  // Auto-close add modal on success
  useEffect(() => {
    if (createState?.success) {
      addFormRef.current?.reset();
      const timer = setTimeout(() => setAddingStaffForBranch(null), 0);
      return () => clearTimeout(timer);
    }
  }, [createState?.success]);

  // Auto-close edit modal on success
  useEffect(() => {
    if (updateState?.success) {
      editFormRef.current?.reset();
      const timer = setTimeout(() => setEditingStaff(null), 0);
      return () => clearTimeout(timer);
    }
  }, [updateState?.success]);

  const handleToggleStatus = (member: StaffMember) => {
    startTransition(async () => {
      await toggleStaffStatus(member.id, member.is_active);
    });
  };

  const handleDelete = (member: StaffMember) => {
    if (confirm(`Are you sure you want to delete ${member.full_name}?`)) {
      startTransition(async () => {
        await deleteStaff(member.id);
      });
    }
  };

  // Requirement Guard: If 0 branches exist, instruct admin to add a branch first
  if (branches.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-slate-200/80 shadow-xs text-center max-w-xl mx-auto space-y-4 my-8">
        <div className="w-16 h-16 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-3xl mx-auto font-bold shadow-2xs">
          🏥
        </div>
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-navy-900">No Clinic Branches Configured</h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Staff members must be assigned to an active clinic branch. Please create at least one clinic branch before configuring staff rosters.
          </p>
        </div>
        <div className="pt-2">
          <Link
            href={ROUTES.ADMIN + "/branches"}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-md shadow-orange-500/20 transition-all cursor-pointer"
          >
            + Create Branch First
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-1">
        <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Clinic Staff Roster</h1>
        <p className="text-sm text-slate-500">
          Configure veterinarians, medical specialists, and groomers per clinic branch.
        </p>
      </div>

      {/* Branch Cards Container */}
      <div className="space-y-8">
        {branches.map((branch) => {
          const branchStaff = staffMembers.filter((s) => s.branch_id === branch.id);

          return (
            <div
              key={branch.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4"
            >
              {/* Branch Header Bar */}
              <div className="bg-slate-50/80 p-6 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg">🏥</span>
                    <h2 className="text-lg font-bold text-navy-900">{branch.name}</h2>
                    <span className="text-[10px] font-extrabold px-2.5 py-0.5 rounded-full bg-navy-900 text-white uppercase tracking-wider">
                      {branch.city}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 pl-7">{branch.address}</p>
                </div>

                {/* Explicit Add Staff Button for THIS Branch */}
                <button
                  type="button"
                  onClick={() => setAddingStaffForBranch(branch)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer shrink-0"
                >
                  + Add Staff to {branch.name}
                </button>
              </div>

              {/* Branch Staff Roster */}
              <div className="p-6 pt-0">
                {branchStaff.length === 0 ? (
                  <div className="bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8 text-center space-y-3">
                    <p className="text-xs font-semibold text-slate-500">
                      No staff members assigned to {branch.name} yet.
                    </p>
                    <button
                      type="button"
                      onClick={() => setAddingStaffForBranch(branch)}
                      className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-navy-900 hover:bg-orange-50 hover:text-orange-600 transition-colors cursor-pointer shadow-2xs"
                    >
                      + Add First Staff Member
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 uppercase tracking-wider font-bold">
                          <th className="pb-3 pr-4">Staff Member</th>
                          <th className="pb-3 px-4">Role / Title</th>
                          <th className="pb-3 px-4">Specialization</th>
                          <th className="pb-3 px-4">Contact Lines</th>
                          <th className="pb-3 px-4">Status</th>
                          <th className="pb-3 pl-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 font-medium">
                        {branchStaff.map((member) => {
                          const initialLetter = member.full_name
                            ? member.full_name.charAt(0).toUpperCase()
                            : "S";

                          return (
                            <tr key={member.id} className="hover:bg-slate-50/60 transition-colors text-slate-700">
                              <td className="py-3.5 pr-4 font-bold text-navy-900">
                                <div className="flex items-center gap-3">
                                  {member.avatar_url ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={member.avatar_url}
                                      alt={member.full_name}
                                      className="w-8 h-8 rounded-full object-cover border border-slate-200 shadow-2xs"
                                    />
                                  ) : (
                                    <div className="w-8 h-8 rounded-full bg-navy-900 text-white font-bold flex items-center justify-center text-xs">
                                      {initialLetter}
                                    </div>
                                  )}
                                  <span className="truncate max-w-xs">{member.full_name}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-4 font-semibold text-orange-600">
                                {member.role_title}
                              </td>

                              <td className="py-3.5 px-4 text-slate-500">
                                {member.specialization || "—"}
                              </td>

                              <td className="py-3.5 px-4 text-slate-500">
                                <div>{member.phone || "—"}</div>
                                {member.email && (
                                  <div className="text-[10px] text-slate-400">{member.email}</div>
                                )}
                              </td>

                              <td className="py-3.5 px-4">
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleToggleStatus(member)}
                                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                                    member.is_active
                                      ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                                      : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                                  }`}
                                >
                                  {member.is_active ? "Active" : "Inactive"}
                                </button>
                              </td>

                              <td className="py-3.5 pl-4 text-right space-x-2">
                                <button
                                  type="button"
                                  onClick={() => setEditingStaff(member)}
                                  className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Edit
                                </button>
                                <button
                                  type="button"
                                  disabled={isPending}
                                  onClick={() => handleDelete(member)}
                                  className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition-colors cursor-pointer"
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
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 1. Add Staff Modal (Locked to Selected Branch) */}
      {addingStaffForBranch && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-staff-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setAddingStaffForBranch(null)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 id="add-staff-modal-title" className="text-lg font-bold text-navy-900">
                  Add Staff Member
                </h2>
                <p className="text-xs text-orange-600 font-bold mt-0.5">
                  Assigned Branch: {addingStaffForBranch.name} ({addingStaffForBranch.city})
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAddingStaffForBranch(null)}
                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {createState?.error && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                ⚠️ {createState.error}
              </div>
            )}

            <form ref={addFormRef} action={createAction} className="space-y-4">
              {/* Bound Branch ID */}
              <input type="hidden" name="branchId" value={addingStaffForBranch.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-staff-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="add-staff-name"
                    type="text"
                    name="fullName"
                    required
                    placeholder="e.g. Dr. Alejandro Ramos, DVM"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="add-staff-role" className="block text-xs font-semibold text-slate-700 mb-1">
                    Role / Position Title *
                  </label>
                  <input
                    id="add-staff-role"
                    type="text"
                    name="roleTitle"
                    required
                    placeholder="e.g. Chief Veterinarian / Senior Groomer"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-staff-specialization" className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Specialization (Optional)
                  </label>
                  <input
                    id="add-staff-specialization"
                    type="text"
                    name="specialization"
                    placeholder="e.g. Soft Tissue Surgery & Radiology"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="add-staff-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone (Optional)
                  </label>
                  <input
                    id="add-staff-phone"
                    type="text"
                    name="phone"
                    placeholder="e.g. 0917-000-1122"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-staff-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address (Optional)
                  </label>
                  <input
                    id="add-staff-email"
                    type="email"
                    name="email"
                    placeholder="e.g. Ramos@vetclinic.ph"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="add-staff-avatar" className="block text-xs font-semibold text-slate-700 mb-1">
                    Avatar Photo URL (Optional)
                  </label>
                  <input
                    id="add-staff-avatar"
                    type="url"
                    name="avatarUrl"
                    placeholder="e.g. https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="add-staff-active"
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="w-4 h-4 text-orange-500 rounded-sm border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="add-staff-active" className="text-xs font-semibold text-slate-700">
                  Mark as Active Staff Member
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddingStaffForBranch(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatePending}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCreatePending ? "Saving..." : `Add to ${addingStaffForBranch.name}`}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 2. Edit Staff Modal */}
      {editingStaff && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-staff-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          <div className="fixed inset-0" onClick={() => setEditingStaff(null)} aria-hidden="true" />

          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 id="edit-staff-modal-title" className="text-lg font-bold text-navy-900">
                Edit Staff Member
              </h2>
              <button
                type="button"
                onClick={() => setEditingStaff(null)}
                className="text-slate-400 hover:text-navy-900 p-1.5 rounded-lg text-sm transition-colors cursor-pointer"
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>

            {updateState?.error && (
              <div role="alert" className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-medium">
                ⚠️ {updateState.error}
              </div>
            )}

            <form ref={editFormRef} action={updateAction} className="space-y-4">
              <input type="hidden" name="id" value={editingStaff.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-staff-branch" className="block text-xs font-semibold text-slate-700 mb-1">
                    Assigned Branch *
                  </label>
                  <select
                    id="edit-staff-branch"
                    name="branchId"
                    required
                    defaultValue={editingStaff.branch_id}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 cursor-pointer"
                  >
                    {branches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.city})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="edit-staff-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    id="edit-staff-name"
                    type="text"
                    name="fullName"
                    defaultValue={editingStaff.full_name}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-staff-role" className="block text-xs font-semibold text-slate-700 mb-1">
                    Role / Position Title *
                  </label>
                  <input
                    id="edit-staff-role"
                    type="text"
                    name="roleTitle"
                    defaultValue={editingStaff.role_title}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-staff-specialization" className="block text-xs font-semibold text-slate-700 mb-1">
                    Clinical Specialization
                  </label>
                  <input
                    id="edit-staff-specialization"
                    type="text"
                    name="specialization"
                    defaultValue={editingStaff.specialization || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-staff-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone
                  </label>
                  <input
                    id="edit-staff-phone"
                    type="text"
                    name="phone"
                    defaultValue={editingStaff.phone || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label htmlFor="edit-staff-email" className="block text-xs font-semibold text-slate-700 mb-1">
                    Email Address
                  </label>
                  <input
                    id="edit-staff-email"
                    type="email"
                    name="email"
                    defaultValue={editingStaff.email || ""}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-staff-avatar" className="block text-xs font-semibold text-slate-700 mb-1">
                  Avatar Photo URL
                </label>
                <input
                  id="edit-staff-avatar"
                  type="url"
                  name="avatarUrl"
                  defaultValue={editingStaff.avatar_url || ""}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="edit-staff-active"
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingStaff.is_active}
                  className="w-4 h-4 text-orange-500 rounded-sm border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="edit-staff-active" className="text-xs font-semibold text-slate-700">
                  Mark as Active Staff Member
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingStaff(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdatePending}
                  className="px-5 py-2 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isUpdatePending ? "Updating..." : "Save Changes"}
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