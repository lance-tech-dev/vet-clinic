import { createClient } from "@/lib/supabase/server";
import { PatientView, type PetWithMedicalLogs } from "./patient-view";
import type { PetFullRecord } from "@/components/pets/pet-detail-modal";

export const dynamic = "force-dynamic";

export default async function AdminPatientsPage() {
  const supabase = await createClient();

  // 1. Query all registered pets
  const { data: rawPets } = await supabase
    .from("pets")
    .select("*")
    .order("created_at", { ascending: false });

  const pets = (rawPets as PetFullRecord[]) || [];

  // 2. Pre-fetch all 5 medical logs for each pet
  const patients: PetWithMedicalLogs[] = await Promise.all(
    pets.map(async (pet) => {
      const [
        { data: groomingLogs },
        { data: vaccinationLogs },
        { data: parasiteLogs },
        { data: visitLogs },
        { data: dentalLogs },
      ] = await Promise.all([
        supabase.from("pet_grooming_logs").select("*").eq("pet_id", pet.id).order("log_date", { ascending: false }),
        supabase.from("pet_vaccination_logs").select("*").eq("pet_id", pet.id).order("date_given", { ascending: false }),
        supabase.from("pet_parasite_preventative_logs").select("*").eq("pet_id", pet.id).order("date_given", { ascending: false }),
        supabase.from("pet_medical_visit_logs").select("*").eq("pet_id", pet.id).order("visit_date", { ascending: false }),
        supabase.from("pet_dental_logs").select("*").eq("pet_id", pet.id).order("record_date", { ascending: false }),
      ]);

      return {
        ...pet,
        logs: {
          groomingLogs: groomingLogs || [],
          vaccinationLogs: vaccinationLogs || [],
          parasiteLogs: parasiteLogs || [],
          visitLogs: visitLogs || [],
          dentalLogs: dentalLogs || [],
        },
      };
    })
  );

  return <PatientView patients={patients} />;
}