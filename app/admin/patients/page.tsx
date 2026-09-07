import { createClient } from "@/lib/supabase/server";

interface PetPatient {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  notes: string | null;
  created_at: string;
  profiles: {
    full_name: string | null;
    email: string;
    phone: string | null;
  } | null;
}

export default async function AdminPatientsPage() {
  const supabase = await createClient();

  const { data: rawPets } = await supabase
    .from("pets")
    .select(`
      id,
      name,
      species,
      breed,
      age,
      notes,
      created_at,
      profiles (
        full_name,
        email,
        phone
      )
    `)
    .order("created_at", { ascending: false });

  const pets = (rawPets as unknown as PetPatient[]) || [];

  const getSpeciesIcon = (species: string) => {
    const s = species.toLowerCase();
    if (s.includes("dog")) return "🐕";
    if (s.includes("cat")) return "🐈";
    if (s.includes("bird")) return "🦜";
    if (s.includes("rabbit")) return "🐇";
    return "🐾";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <h1 className="text-2xl font-bold text-navy-900 tracking-tight">Fur Patients</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Manage registered pets, medical histories, and client profiles.
          </p>
        </div>
        <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200 w-fit">
          Total: {pets.length} Patients
        </span>
      </div>

      {pets.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200/80 shadow-xs text-center py-12">
          <p className="text-sm font-medium text-slate-500">No fur patients registered yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-bold">
                  <th className="py-3.5 px-6">Patient Name</th>
                  <th className="py-3.5 px-6">Species & Breed</th>
                  <th className="py-3.5 px-6">Owner Name</th>
                  <th className="py-3.5 px-6">Contact Number</th>
                  <th className="py-3.5 px-6">Registered Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {pets.map((pet) => {
                  const owner = pet.profiles;
                  const ownerName = owner?.full_name || owner?.email || "Unknown";
                  const date = new Date(pet.created_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });

                  return (
                    <tr key={pet.id} className="hover:bg-slate-50/60 transition-colors text-slate-700">
                      <td className="py-4 px-6 font-bold text-navy-900 flex items-center gap-2.5">
                        <span className="text-base">{getSpeciesIcon(pet.species)}</span>
                        <span>{pet.name}</span>
                      </td>
                      <td className="py-4 px-6">
                        <span className="font-semibold text-slate-800">{pet.species}</span>
                        {pet.breed && <span className="text-slate-400"> ({pet.breed})</span>}
                      </td>
                      <td className="py-4 px-6 font-semibold text-slate-800">{ownerName}</td>
                      <td className="py-4 px-6 text-slate-500">{owner?.phone || "—"}</td>
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