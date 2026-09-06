export default function AdminInboxPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Inbox</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Inquiries and contact messages submitted by pet owners.
          </p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center py-12">
        <p className="text-sm font-medium text-slate-500">Your inbox is empty.</p>
      </div>
    </div>
  );
}