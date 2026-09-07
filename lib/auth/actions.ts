"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";
import { registerSchema, petInputSchema, type PetInput } from "./validation";

export interface RegisterFormState {
  error: string | null;
  fieldErrors?: Record<string, string[]>;
  success: boolean;
}

export async function registerUser(
  prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const rawData = {
    fullName: formData.get("fullName") as string,
    phone: formData.get("phone") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
    petsPayload: formData.get("petsPayload") as string,
  };

  // 1. Validate owner profile form fields
  const validation = registerSchema.safeParse(rawData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const firstError =
      Object.values(fieldErrors).flat()[0] || "Please check your input and try again.";
    return { error: firstError, fieldErrors, success: false };
  }

  const { fullName, phone, email, password, petsPayload } = validation.data;

  // 2. Validate multi-pet array payload
  let petsPayloadValidated: PetInput[] = [];
  if (petsPayload) {
    try {
      const parsedPets = JSON.parse(petsPayload);
      const petsValidation = z.array(petInputSchema).safeParse(parsedPets);

      if (!petsValidation.success) {
        return {
          error: "Invalid pet information provided. Please verify pet details.",
          success: false,
        };
      }

      petsPayloadValidated = petsValidation.data;
    } catch {
      return {
        error: "Failed to parse pet registration data.",
        success: false,
      };
    }
  }

  // 3. Submit validated account data to Supabase Auth
  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        owner_name: fullName,
        phone: phone,
        pets: petsPayloadValidated,
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