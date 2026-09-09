import { createClient } from "@/lib/supabase/server";
import { OwnerView, type OwnerRecord, type PetSummary } from "./owner-view";

export const dynamic = "force-dynamic";

export default async function AdminOwnersPage() {
  const supabase = await createClient();

  // 1. Query user profiles excluding administrator accounts
  const { data: rawProfiles } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, role, created_at")
    .neq("role", "admin")
    .order("created_at", { ascending: false });

  const profiles = rawProfiles || [];

  // 2. Query all registered pets
  const { data: rawPets } = await supabase
    .from("pets")
    .select("*")
    .order("created_at", { ascending: false });

  const pets = rawPets || [];

  // 3. Aggregate owner data with registered pets & contact details
  const owners: OwnerRecord[] = profiles.map((profile) => {
    // Find pets belonging to this profile
    const ownerPets = pets.filter((p) => p.owner_id === profile.id);

    // Derive latest phone, address, and handlers from linked pet records if missing on profile
    const latestPetWithInfo = ownerPets.find((p) => p.owner_address || p.authorized_handlers);

    const address = latestPetWithInfo?.owner_address || null;
    const phone = profile.phone || latestPetWithInfo?.owner_phone || null;
    const authorizedHandlers = latestPetWithInfo?.authorized_handlers || null;

    const formattedPets: PetSummary[] = ownerPets.map((p) => ({
      id: p.id,
      name: p.name,
      species: p.species,
      breed: p.breed,
      sex: p.sex || "Male",
      is_neutered: Boolean(p.is_neutered),
      date_of_birth: p.date_of_birth,
      microchip_no: p.microchip_no,
      color_markings: p.color_markings,
    }));

    return {
      id: profile.id,
      email: profile.email,
      full_name: profile.full_name,
      phone,
      address,
      authorized_handlers: authorizedHandlers,
      created_at: profile.created_at,
      pets: formattedPets,
    };
  });

  return <OwnerView owners={owners} />;
}