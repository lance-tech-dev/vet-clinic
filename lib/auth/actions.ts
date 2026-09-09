"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { registerSchema, loginSchema } from "./validation";
import { ROUTES } from "@/config/constants";

export interface AuthActionResult {
  error: string | null;
  errorStep?: 1 | 2;
  success: boolean;
}

export interface RegistrationPetItem {
  name: string;
  species: string;
  breed?: string | null;
  sex: string;
  isNeutered: boolean;
  dateOfBirth?: string | null;
  microchipNo?: string | null;
  colorMarkings?: string | null;
}

/**
 * Sign In / Login Server Action
 */
export async function signIn(
  prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get("email") as string)?.trim() || "";
  const password = (formData.get("password") as string) || "";

  const validation = loginSchema.safeParse({ email, password });
  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Invalid login credentials.",
      success: false,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  revalidatePath(ROUTES.HOME, "layout");
  return { error: null, success: true };
}

/**
 * Sign Up / Multi-Pet Registration Server Action with Homepage Redirect
 */
export async function signUp(
  prevState: AuthActionResult,
  formData: FormData
): Promise<AuthActionResult> {
  // Page 1 Inputs
  const email = (formData.get("email") as string)?.trim() || "";
  const password = (formData.get("password") as string) || "";
  const fullName = (formData.get("fullName") as string)?.trim() || "";
  const phone = (formData.get("phone") as string)?.trim() || "";
  const address = (formData.get("address") as string)?.trim() || "";

  // Page 1 Handler Inputs
  const handlerName = (formData.get("handlerName") as string)?.trim() || "";
  const handlerRelationship = (formData.get("handlerRelationship") as string)?.trim() || "";
  const handlerPhone = (formData.get("handlerPhone") as string)?.trim() || "";

  const authorizedHandlers = handlerName
    ? `${handlerName}${handlerRelationship ? ` (${handlerRelationship})` : ""}${handlerPhone ? ` - ${handlerPhone}` : ""}`
    : (formData.get("authorizedHandlers") as string)?.trim() || null;

  // Validate Page 1 Credentials
  const validation = registerSchema.safeParse({
    email,
    password,
    fullName,
    phone,
    address,
  });

  if (!validation.success) {
    return {
      error: validation.error.issues[0]?.message || "Please complete all required owner fields on Page 1.",
      errorStep: 1,
      success: false,
    };
  }

  if (!handlerName) {
    return {
      error: "Please enter the name of at least one authorized pet handler on Page 1.",
      errorStep: 1,
      success: false,
    };
  }

  // Page 2 Inputs
  const hasPet = formData.get("hasPet") === "true" || formData.get("hasPet") === "on";
  const petsJsonRaw = (formData.get("petsJson") as string) || "[]";

  let petsToRegister: RegistrationPetItem[] = [];

  if (hasPet) {
    try {
      petsToRegister = JSON.parse(petsJsonRaw);
    } catch {
      return {
        error: "Failed to parse pet registration details. Please check Page 2 inputs.",
        errorStep: 2,
        success: false,
      };
    }

    if (petsToRegister.length === 0) {
      return {
        error: "Please register at least one pet or uncheck 'Register Pet(s) Now' on Page 2.",
        errorStep: 2,
        success: false,
      };
    }

    for (let i = 0; i < petsToRegister.length; i++) {
      const p = petsToRegister[i];
      if (!p.name?.trim()) {
        return { error: `Pet #${i + 1}: Name is required.`, errorStep: 2, success: false };
      }
      if (!p.species?.trim()) {
        return { error: `Pet #${i + 1}: Species is required.`, errorStep: 2, success: false };
      }
      if (!p.sex?.trim()) {
        return { error: `Pet #${i + 1}: Sex is required.`, errorStep: 2, success: false };
      }
      if (!p.dateOfBirth?.trim()) {
        return { error: `Pet #${i + 1}: Date of birth is required.`, errorStep: 2, success: false };
      }
      if (!p.colorMarkings?.trim()) {
        return { error: `Pet #${i + 1}: Color/Markings & Identification are required.`, errorStep: 2, success: false };
      }
    }
  }

  const supabase = await createClient();

  // 1. Create Auth User
  const { data, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
    },
  });

  if (authError) {
    return { error: authError.message, errorStep: 1, success: false };
  }

  if (data.user) {
    // 2. Update Profile record with full owner contact info
    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", data.user.id);

    // 3. Batch Insert All Registered Pets
    if (hasPet && petsToRegister.length > 0) {
      const petPayloads = petsToRegister.map((p) => ({
        owner_id: data.user!.id,
        name: p.name.trim(),
        species: p.species.trim(),
        breed: p.breed?.trim() || null,
        sex: p.sex.trim(),
        is_neutered: Boolean(p.isNeutered),
        date_of_birth: p.dateOfBirth?.trim() || null,
        microchip_no: p.microchipNo?.trim() || null,
        color_markings: p.colorMarkings?.trim() || null,
        owner_name: fullName,
        owner_address: address || null,
        owner_phone: phone || null,
        owner_email: email,
        authorized_handlers: authorizedHandlers,
      }));

      const { error: petInsertError } = await supabase.from("pets").insert(petPayloads);

      if (petInsertError) {
        return {
          error: `Account created, but pet registration failed: ${petInsertError.message}`,
          errorStep: 2,
          success: false,
        };
      }
    }
  }

  // 4. Revalidate cache & Redirect to Landing Page
  revalidatePath(ROUTES.HOME, "layout");
  redirect(ROUTES.HOME);
}

/**
 * Logout / Sign Out Server Action
 */
export async function logout(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath(ROUTES.HOME, "layout");
  redirect(ROUTES.LOGIN);
}