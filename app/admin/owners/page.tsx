import { createClient } from "@/lib/supabase/server";

interface PetSummary {
  id: string;
  name: string;
  species: string;
}

interface OwnerProfile {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  role: string;
  created_at: string;
  pets: PetSummary[] | null;
}

export default async function AdminOwnersPage() {
  const supabase = await createClient();

  // Query profiles with their registered pets
  const { data: rawOwners } = await supabase
    .from("profiles")
    .select(`
      id,
      full_name,
      email,
      phone,
      role,
      created_at,
      pets (
        id,
        name,
        species
      )
    `)
    .eq("role", "user")
    .order("created_at", { ascending: false });

  const owners = (rawOwners as unknown as OwnerProfile[]) || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Pet Owners Directory</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Registered client profiles, contact numbers, and associated fur babies.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 w-fit">
          Total: {owners.length} Clients
        </span>
      </div>

      {owners.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center py-12">
          <p className="text-sm font-medium text-slate-500">No registered client profiles found.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Client Name</th>
                  <th className="py-3.5 px-6">Email Address</th>
                  <th className="py-3.5 px-6">Phone Number</th>
                  <th className="py-3.5 px-6">Registered Pets</th>
                  <th className="py-3.5 px-6">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {owners.map((owner) => {
                  const date = new Date(owner.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  const petNames = owner.pets && owner.pets.length > 0
                    ? owner.pets.map((p) => p.name).join(", ")
                    : "None";

                  return (
                    <tr key={owner.id} className="hover:bg-slate-50/60 transition-colors text-slate-700">
                      <td className="py-4 px-6 font-bold text-navy-900">
                        {owner.full_name || "Valued Client"}
                      </td>
                      <td className="py-4 px-6 text-slate-600">{owner.email}</td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{owner.phone || "—"}</td>
                      <td className="py-4 px-6 text-slate-600 font-semibold">{petNames}</td>
                      <td className="py-4 px-6 text-slate-400">{date}</td>
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