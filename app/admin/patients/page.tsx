export default function AdminPatientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Fur Patients</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage registered pets, medical histories, and health records.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-sm transition-colors cursor-pointer">
          + Add New Patient
        </button>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center py-12">
        <p className="text-sm font-medium text-slate-500">No fur patients to display yet.</p>
      </div>
    </div>
  );
}