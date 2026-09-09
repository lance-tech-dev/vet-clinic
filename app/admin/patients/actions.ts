"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface ActionResponse {
  success: boolean;
  error: string | null;
  data?: any;
}

// ============================================================================
// 1. PET GENERAL & OWNER INFO ACTIONS
// ============================================================================

export async function upsertPet(
  petId: string | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: "Unauthenticated session." };
    }

    // Required Pet Info
    const name = (formData.get("name") as string)?.trim();
    const species = (formData.get("species") as string)?.trim();
    const breed = (formData.get("breed") as string)?.trim() || null;
    const sex = (formData.get("sex") as string)?.trim();
    const isNeutered = formData.get("isNeutered") === "true" || formData.get("isNeutered") === "on";
    const dateOfBirth = (formData.get("dateOfBirth") as string)?.trim();
    const microchipNo = (formData.get("microchipNo") as string)?.trim() || null;
    const colorMarkings = (formData.get("colorMarkings") as string)?.trim();

    // Required Owner & Handler Info
    const ownerName = (formData.get("ownerName") as string)?.trim();
    const ownerAddress = (formData.get("ownerAddress") as string)?.trim();
    const ownerPhone = (formData.get("ownerPhone") as string)?.trim();
    const ownerEmail = (formData.get("ownerEmail") as string)?.trim();
    const authorizedHandlers = (formData.get("authorizedHandlers") as string)?.trim();

    const notes = (formData.get("notes") as string)?.trim() || null;
    const targetOwnerId = (formData.get("ownerId") as string)?.trim() || user.id;

    // Strict Validation
    if (!name) return { success: false, error: "Pet's name is required." };
    if (!species) return { success: false, error: "Species is required." };
    if (!sex) return { success: false, error: "Pet sex is required." };
    if (!dateOfBirth) return { success: false, error: "Date of Birth is required." };
    if (!colorMarkings) return { success: false, error: "Color/Markings & Identification details are required." };
    if (!ownerName) return { success: false, error: "Owner full name is required." };
    if (!ownerAddress) return { success: false, error: "Owner home address is required." };
    if (!ownerPhone) return { success: false, error: "Owner mobile number is required." };
    if (!ownerEmail) return { success: false, error: "Owner email address is required." };
    if (!authorizedHandlers) return { success: false, error: "Authorized pet handler details are required." };

    const payload = {
      owner_id: targetOwnerId,
      name,
      species,
      breed,
      sex,
      is_neutered: isNeutered,
      date_of_birth: dateOfBirth,
      microchip_no: microchipNo,
      color_markings: colorMarkings,
      owner_name: ownerName,
      owner_address: ownerAddress,
      owner_phone: ownerPhone,
      owner_email: ownerEmail,
      authorized_handlers: authorizedHandlers,
      notes,
      updated_at: new Date().toISOString(),
    };

    let resultError = null;
    let savedData = null;

    if (petId) {
      const { data, error } = await supabase
        .from("pets")
        .update(payload)
        .eq("id", petId)
        .select()
        .single();

      resultError = error;
      savedData = data;
    } else {
      const { data, error } = await supabase
        .from("pets")
        .insert(payload)
        .select()
        .single();

      resultError = error;
      savedData = data;
    }

    if (resultError) {
      return { success: false, error: resultError.message };
    }

    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.ADMIN + "/patients");
    revalidatePath(ROUTES.ADMIN + "/owners");

    return { success: true, error: null, data: savedData };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Failed to save pet record.",
    };
  }
}

export async function deletePet(petId: string): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase.from("pets").delete().eq("id", petId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath(ROUTES.PROFILE);
  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.ADMIN + "/owners");

  return { success: true, error: null };
}

// ============================================================================
// 2. TAB 1: GROOMING & BOARDING LOG ACTIONS
// ============================================================================

export async function addGroomingLog(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const petId = formData.get("petId") as string;
  const logDate = (formData.get("logDate") as string) || new Date().toISOString().split("T")[0];
  const isGrooming = formData.get("isGrooming") === "true" || formData.get("isGrooming") === "on";
  const isBoarding = formData.get("isBoarding") === "true" || formData.get("isBoarding") === "on";
  const medicalHistory = (formData.get("medicalHistory") as string)?.trim() || null;
  const medicationsSupplements = (formData.get("medicationsSupplements") as string)?.trim() || null;
  const specialNeedsPreferences = (formData.get("specialNeedsPreferences") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  if (!petId) return { success: false, error: "Pet ID is required." };

  const { error } = await supabase.from("pet_grooming_logs").insert({
    pet_id: petId,
    log_date: logDate,
    is_grooming: isGrooming,
    is_boarding: isBoarding,
    medical_history: medicalHistory,
    medications_supplements: medicationsSupplements,
    special_needs_preferences: specialNeedsPreferences,
    notes,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.PROFILE);
  return { success: true, error: null };
}

// ============================================================================
// 3. TAB 2: VACCINATION LOG ACTIONS
// ============================================================================

export async function addVaccinationLog(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const petId = formData.get("petId") as string;
  const dateGiven = formData.get("dateGiven") as string;
  const weightKg = formData.get("weightKg") ? parseFloat(formData.get("weightKg") as string) : null;
  const againstDisease = (formData.get("againstDisease") as string)?.trim();
  const vaccineUsed = (formData.get("vaccineUsed") as string)?.trim();
  const lotBatchNo = (formData.get("lotBatchNo") as string)?.trim() || null;
  const nextDue = (formData.get("nextDue") as string)?.trim() || null;
  const veterinarian = (formData.get("veterinarian") as string)?.trim();

  if (!petId || !dateGiven || !againstDisease || !vaccineUsed || !veterinarian) {
    return { success: false, error: "Please fill in all required vaccination fields." };
  }

  const { error } = await supabase.from("pet_vaccination_logs").insert({
    pet_id: petId,
    date_given: dateGiven,
    weight_kg: weightKg,
    against_disease: againstDisease,
    vaccine_used: vaccineUsed,
    lot_batch_no: lotBatchNo,
    next_due: nextDue,
    veterinarian,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.PROFILE);
  return { success: true, error: null };
}

// ============================================================================
// 4. TAB 3: ECTO/ENDOPARASITE PREVENTATIVES ACTIONS
// ============================================================================

export async function addParasiteLog(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const petId = formData.get("petId") as string;
  const dateGiven = formData.get("dateGiven") as string;
  const weightKg = formData.get("weightKg") ? parseFloat(formData.get("weightKg") as string) : null;
  const againstParasites = (formData.get("againstParasites") as string)?.trim();
  const preventativeUsed = (formData.get("preventativeUsed") as string)?.trim();
  const nextDue = (formData.get("nextDue") as string)?.trim() || null;
  const veterinarian = (formData.get("veterinarian") as string)?.trim();

  if (!petId || !dateGiven || !againstParasites || !preventativeUsed || !veterinarian) {
    return { success: false, error: "Please fill in all required parasite preventative fields." };
  }

  const { error } = await supabase.from("pet_parasite_preventative_logs").insert({
    pet_id: petId,
    date_given: dateGiven,
    weight_kg: weightKg,
    against_parasites: againstParasites,
    preventative_used: preventativeUsed,
    next_due: nextDue,
    veterinarian,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.PROFILE);
  return { success: true, error: null };
}

// ============================================================================
// 5. TAB 4: VET VISIT / MEDICAL HISTORY ACTIONS
// ============================================================================

export async function addMedicalVisitLog(formData: FormData): Promise<ActionResponse> {
  const supabase = await createClient();

  const petId = formData.get("petId") as string;
  const visitDate = (formData.get("visitDate") as string) || new Date().toISOString().split("T")[0];
  const reasonForVisit = (formData.get("reasonForVisit") as string)?.trim();
  const clinicalFindings = (formData.get("clinicalFindings") as string)?.trim();
  const vetInstructions = (formData.get("vetInstructions") as string)?.trim();
  const followUpDate = (formData.get("followUpDate") as string)?.trim() || null;
  const veterinarian = (formData.get("veterinarian") as string)?.trim();

  if (!petId || !reasonForVisit || !clinicalFindings || !vetInstructions || !veterinarian) {
    return { success: false, error: "Please fill in all required medical visit fields." };
  }

  const { error } = await supabase.from("pet_medical_visit_logs").insert({
    pet_id: petId,
    visit_date: visitDate,
    reason_for_visit: reasonForVisit,
    clinical_findings: clinicalFindings,
    vet_instructions: vetInstructions,
    follow_up_date: followUpDate,
    veterinarian,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.PROFILE);
  return { success: true, error: null };
}

// ============================================================================
// 6. TAB 5: DENTAL RECORDS ACTIONS
// ============================================================================

export async function addDentalLog(
  petId: string,
  recordDate: string,
  hasSalivation: boolean,
  hasPeriodontalDisease: boolean,
  toothConditions: Record<string, string>,
  notes: string | null,
  veterinarian: string | null
): Promise<ActionResponse> {
  const supabase = await createClient();

  if (!petId || !recordDate) {
    return { success: false, error: "Pet ID and Record Date are required." };
  }

  const { error } = await supabase.from("pet_dental_logs").insert({
    pet_id: petId,
    record_date: recordDate,
    has_salivation: hasSalivation,
    has_periodontal_disease: hasPeriodontalDisease,
    tooth_conditions: toothConditions,
    notes,
    veterinarian,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.PROFILE);
  return { success: true, error: null };
}