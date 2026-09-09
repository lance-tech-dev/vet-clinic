import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import {
  ProfileView,
  type UserProfile,
  type PetWithLogs,
  type UserAppointment,
  type Branch,
} from "./profile-view";
import type { PetFullRecord, MedicalLogsData } from "@/components/pets/pet-detail-modal";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const supabase = await createClient();

  // 1. Authenticate user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`${ROUTES.LOGIN}?redirectTo=${ROUTES.PROFILE}`);
  }

  // 2. Query user profile
  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  // 3. Query registered pets for this user
  const { data: rawPets } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const pets = (rawPets as PetFullRecord[]) || [];

  // Derive latest address and authorized handlers from linked pet records
  const latestPetWithInfo = pets.find((p) => p.owner_address || p.authorized_handlers);

  const userProfile: UserProfile = {
    id: user.id,
    email: user.email || "",
    fullName: profileData?.full_name || null,
    phone: profileData?.phone || latestPetWithInfo?.owner_phone || null,
    address: latestPetWithInfo?.owner_address || null,
    authorizedHandlers: latestPetWithInfo?.authorized_handlers || null,
    role: profileData?.role || "user",
    createdAt: user.created_at,
    avatarUrl: profileData?.avatar_url || null,
  };

  // 4. Pre-fetch all 5 medical logs for each pet
  const petsWithLogs: PetWithLogs[] = await Promise.all(
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

      const logs: MedicalLogsData = {
        groomingLogs: groomingLogs || [],
        vaccinationLogs: vaccinationLogs || [],
        parasiteLogs: parasiteLogs || [],
        visitLogs: visitLogs || [],
        dentalLogs: dentalLogs || [],
      };

      return { pet, logs };
    })
  );

  // 5. Query user's appointments
  const { data: rawAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const appointments = (rawAppointments as UserAppointment[]) || [];

  // 6. Query clinic branches for branch name mapping
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("id, name, city")
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  return (
    <ProfileView
      user={userProfile}
      petsWithLogs={petsWithLogs}
      appointments={appointments}
      branches={branches}
    />
  );
}