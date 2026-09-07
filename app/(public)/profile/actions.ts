"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface ProfileFormState {
  error: string | null;
  success: boolean;
}

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", success: false };
  }

  const fullName = formData.get("fullName") as string;
  const phone = formData.get("phone") as string;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      phone: phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/profile");
  return { error: null, success: true };
}

export async function addPet(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Not authenticated", success: false };
  }

  const name = formData.get("name") as string;
  const species = (formData.get("species") as string) || "Dog";
  const breed = formData.get("breed") as string;
  const age = formData.get("age") as string;
  const notes = formData.get("notes") as string;

  const { error } = await supabase.from("pets").insert({
    owner_id: user.id,
    name,
    species,
    breed,
    age,
    notes,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/profile");
  return { error: null, success: true };
}