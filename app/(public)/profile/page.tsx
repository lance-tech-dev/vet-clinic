import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import { ProfileView, type UserProfile, type PetData, type UserAppointment, type Branch } from "./profile-view";

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

  // 2. Query user profile safely
  const { data: profileData } = await supabase
    .from("profiles")
    .select("id, email, full_name, phone, role, avatar_url")
    .eq("id", user.id)
    .maybeSingle();

  const userProfile: UserProfile = {
    id: user.id,
    email: user.email || "",
    fullName: profileData?.full_name || null,
    phone: profileData?.phone || null,
    role: profileData?.role || "user",
    createdAt: user.created_at,
    avatarUrl: profileData?.avatar_url || null,
  };

  // 3. Query registered pets for this user
  const { data: rawPets } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  const pets = (rawPets as PetData[]) || [];

  // 4. Query user's appointments
  const { data: rawAppointments } = await supabase
    .from("appointments")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  const appointments = (rawAppointments as UserAppointment[]) || [];

  // 5. Query clinic branches for branch name mapping
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("id, name, city")
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  return (
    <ProfileView
      user={userProfile}
      pets={pets}
      appointments={appointments}
      branches={branches}
    />
  );
}