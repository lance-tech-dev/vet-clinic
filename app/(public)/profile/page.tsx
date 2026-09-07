import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import { ProfileView } from "./profile-view";

export interface PetData {
  id: string;
  name: string;
  species: string;
  breed: string | null;
  age: string | null;
  notes: string | null;
  created_at: string;
}

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(ROUTES.LOGIN);
  }

  // Fetch user profile from Supabase 'profiles' table
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch registered pets for this owner from the 'pets' table
  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .eq("owner_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <ProfileView
      user={{
        id: user.id,
        email: user.email ?? "",
        fullName: profile?.full_name ?? null,
        phone: profile?.phone ?? null,
        role: profile?.role ?? "user",
        createdAt: user.created_at,
      }}
      pets={(pets as PetData[]) || []}
    />
  );
}