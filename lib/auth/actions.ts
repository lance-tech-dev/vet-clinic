"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface RegisterFormState {
  error: string | null;
  success: boolean;
}

export interface PetRegisterInput {
  name: string;
  species?: string;
  breed?: string;
  age?: string;
  notes?: string;
}

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // 1. Basic validation
  if (!email || !password || !fullName || !phone) {
    return { error: "Please fill in all required fields.", success: false };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match.", success: false };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long.", success: false };
  }

  // 2. Extract dynamic pets array from hidden JSON field or form inputs
  const petsRaw = formData.get("petsPayload") as string;
  let petsPayload: PetRegisterInput[] = [];

  if (petsRaw) {
    try {
      petsPayload = JSON.parse(petsRaw);
    } catch {
      petsPayload = [];
    }
  } else {
    // Fallback: Check single pet fields if petsPayload is not provided
    const petName = formData.get("petName") as string;
    const petSpecies = (formData.get("petSpecies") as string) || "Dog";
    const petBreed = formData.get("petBreed") as string;

    if (petName && petName.trim().length > 0) {
      petsPayload.push({
        name: petName.trim(),
        species: petSpecies,
        breed: petBreed,
      });
    }
  }

  // 3. Register user in Supabase Auth with metadata
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        owner_name: fullName,
        phone: phone,
        pets: petsPayload, // Handled automatically by our handle_new_user SQL trigger
      },
    },
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath("/", "layout");
  redirect(ROUTES.PROFILE);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect(ROUTES.LOGIN);
}