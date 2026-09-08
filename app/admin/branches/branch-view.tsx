"use client";

import { useState, useActionState, useTransition, useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { createBranch, updateBranch, toggleBranchStatus, deleteBranch, type BranchFormState } from "./actions";

export interface Branch {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  operating_hours: string;
  gmap_url?: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface BranchViewProps {
  branches: Branch[];
}

const initialState: BranchFormState = {
  error: null,
  success: false,
};

const emptySubscribe = () => () => {};

export function BranchView({ branches }: BranchViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingBranch, setEditingBranch] = useState<Branch | null>(null);
  const [isPending, startTransition] = useTransition();

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const addFormRef = useRef<HTMLFormElement>(null);
  const editFormRef = useRef<HTMLFormElement>(null);

  const [createState, createAction, isCreatePending] = useActionState(createBranch, initialState);
  const [updateState, updateAction, isUpdatePending] = useActionState(updateBranch, initialState);

  // Auto-close add modal on success
  useEffect(() => {
    if (createState?.success) {
      addFormRef.current?.reset();
      const timer = setTimeout(() => {
        setIsAdding(false);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [createState?.success]);

  // Auto-close edit modal on success
  useEffect(() => {
    if (updateState?.success) {
      editFormRef.current?.reset();
      const timer = setTimeout(() => {
        setEditingBranch(null);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [updateState?.success]);

  const handleToggleStatus = (branch: Branch) => {
    startTransition(async () => {
      await toggleBranchStatus(branch.id, branch.is_active);
    });
  };

  const handleDelete = (branch: Branch) => {
    if (confirm(`Are you sure you want to delete ${branch.name}?`)) {
      startTransition(async () => {
        await deleteBranch(branch.id);
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Clinic Branches</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage physical clinic locations, contact details, operating hours, Google Maps links, and active status.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setIsAdding(true);
            setEditingBranch(null);
          }}
          className="px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm shadow-xs transition-colors cursor-pointer w-fit"
        >
          + Add New Branch
        </button>
      </div>

      {/* 1. Add Branch Modal (Portal) */}
      {isAdding && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="add-branch-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          {/* Backdrop */}
          <div className="fixed inset-0" onClick={() => setIsAdding(false)} aria-hidden="true" />

          {/* Modal Card */}
          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 id="add-branch-modal-title" className="text-lg font-bold text-navy-900">
                Add New Clinic Branch
              </h2>
              <button
                type="button"
                onClick={() => setIsAdding(false)}
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
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-branch-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Name *
                  </label>
                  <input
                    id="add-branch-name"
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. San Pablo Main Branch"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="add-branch-city" className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location *
                  </label>
                  <input
                    id="add-branch-city"
                    type="text"
                    name="city"
                    required
                    placeholder="e.g. San Pablo"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="add-branch-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    id="add-branch-phone"
                    type="text"
                    name="phone"
                    required
                    placeholder="e.g. (049) 501-2345"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="add-branch-hours" className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Hours *
                  </label>
                  <input
                    id="add-branch-hours"
                    type="text"
                    name="operatingHours"
                    defaultValue="8:00 AM - 6:00 PM"
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="add-branch-address" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Address *
                </label>
                <input
                  id="add-branch-address"
                  type="text"
                  name="address"
                  required
                  placeholder="e.g. Maharlika Highway, San Pablo City, Laguna"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label htmlFor="add-branch-gmap" className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Maps Direction Link (URL)
                </label>
                <input
                  id="add-branch-gmap"
                  type="url"
                  name="gmapUrl"
                  placeholder="e.g. https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="add-branch-active"
                  type="checkbox"
                  name="isActive"
                  defaultChecked
                  className="w-4 h-4 text-orange-500 rounded-sm border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="add-branch-active" className="text-xs font-semibold text-slate-700">
                  Mark as Open & Active
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAdding(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatePending}
                  className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                >
                  {isCreatePending ? "Saving Branch..." : "Save New Branch"}
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 2. Edit Branch Modal (Portal) */}
      {editingBranch && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="edit-branch-modal-title"
          className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-navy-950/60 backdrop-blur-xs animate-in fade-in duration-200"
        >
          {/* Backdrop */}
          <div className="fixed inset-0" onClick={() => setEditingBranch(null)} aria-hidden="true" />

          {/* Modal Card */}
          <div className="relative z-10 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto space-y-5 my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 id="edit-branch-modal-title" className="text-lg font-bold text-navy-900">
                Edit Branch Details
              </h2>
              <button
                type="button"
                onClick={() => setEditingBranch(null)}
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
              <input type="hidden" name="id" value={editingBranch.id} />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-branch-name" className="block text-xs font-semibold text-slate-700 mb-1">
                    Branch Name *
                  </label>
                  <input
                    id="edit-branch-name"
                    type="text"
                    name="name"
                    defaultValue={editingBranch.name}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-branch-city" className="block text-xs font-semibold text-slate-700 mb-1">
                    City / Location *
                  </label>
                  <input
                    id="edit-branch-city"
                    type="text"
                    name="city"
                    defaultValue={editingBranch.city}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-branch-phone" className="block text-xs font-semibold text-slate-700 mb-1">
                    Contact Phone Number *
                  </label>
                  <input
                    id="edit-branch-phone"
                    type="text"
                    name="phone"
                    defaultValue={editingBranch.phone}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div>
                  <label htmlFor="edit-branch-hours" className="block text-xs font-semibold text-slate-700 mb-1">
                    Operating Hours *
                  </label>
                  <input
                    id="edit-branch-hours"
                    type="text"
                    name="operatingHours"
                    defaultValue={editingBranch.operating_hours}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="edit-branch-address" className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Address *
                </label>
                <input
                  id="edit-branch-address"
                  type="text"
                  name="address"
                  defaultValue={editingBranch.address}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div>
                <label htmlFor="edit-branch-gmap" className="block text-xs font-semibold text-slate-700 mb-1">
                  Google Maps Direction Link (URL)
                </label>
                <input
                  id="edit-branch-gmap"
                  type="url"
                  name="gmapUrl"
                  defaultValue={editingBranch.gmap_url || ""}
                  placeholder="e.g. https://maps.google.com/?q=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  id="edit-branch-active"
                  type="checkbox"
                  name="isActive"
                  defaultChecked={editingBranch.is_active}
                  className="w-4 h-4 text-orange-500 rounded-sm border-slate-300 focus:ring-orange-500"
                />
                <label htmlFor="edit-branch-active" className="text-xs font-semibold text-slate-700">
                  Mark as Open & Active
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingBranch(null)}
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

      {/* 3. Branches Table */}
      {branches.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center py-12">
          <p className="text-sm font-medium text-slate-500">No clinic branches found in database.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Branch Name</th>
                  <th className="py-3.5 px-6">Location / City</th>
                  <th className="py-3.5 px-6">Address</th>
                  <th className="py-3.5 px-6">Google Maps</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Operating Hours</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-slate-50/60 transition-colors text-slate-700">
                    <td className="py-4 px-6 font-bold text-navy-900">{branch.name}</td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{branch.city}</td>
                    <td className="py-4 px-6 text-slate-500 max-w-xs truncate">{branch.address}</td>
                    <td className="py-4 px-6">
                      {branch.gmap_url ? (
                        <a
                          href={branch.gmap_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-orange-600 hover:text-orange-700 hover:underline"
                        >
                          <span>🗺️ View Map</span>
                        </a>
                      ) : (
                        <span className="text-slate-400 font-normal">Not Set</span>
                      )}
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-800">{branch.phone}</td>
                    <td className="py-4 px-6 text-slate-500">{branch.operating_hours}</td>
                    <td className="py-4 px-6">
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleToggleStatus(branch)}
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold cursor-pointer border transition-colors ${
                          branch.is_active
                            ? "bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200"
                            : "bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200"
                        }`}
                      >
                        {branch.is_active ? "Open" : "Closed"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsAdding(false);
                          setEditingBranch(branch);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => handleDelete(branch)}
                        className="px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs transition-colors cursor-pointer"
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
    </div>
  );
}