"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface PatientActionResponse {
  success: boolean;
  error?: string;
  data?: unknown;
}

export async function upsertPet(formData: FormData): Promise<PatientActionResponse> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthenticated session." };

  const id = formData.get("id") as string;
  const ownerIdInput = (formData.get("ownerId") as string) || (formData.get("owner_id") as string);
  const name = (formData.get("name") as string)?.trim();
  const species = (formData.get("species") as string)?.trim();
  const breed = (formData.get("breed") as string)?.trim() || null;
  const sex = (formData.get("sex") as string)?.trim();
  const isNeutered = formData.get("isNeutered") === "true" || formData.get("isNeutered") === "on";
  const dateOfBirth = (formData.get("dateOfBirth") as string)?.trim() || null;
  const microchipNo = (formData.get("microchipNo") as string)?.trim() || null;
  const colorMarkings = (formData.get("colorMarkings") as string)?.trim() || null;

  const ownerName = (formData.get("ownerName") as string)?.trim() || null;
  const ownerAddress = (formData.get("ownerAddress") as string)?.trim() || null;
  const ownerPhone = (formData.get("ownerPhone") as string)?.trim() || null;
  const ownerEmail = (formData.get("ownerEmail") as string)?.trim() || null;
  const authorizedHandlers = (formData.get("authorizedHandlers") as string)?.trim() || null;

  if (!name || !species || !sex) {
    return { success: false, error: "Pet Name, Species, and Sex are required fields." };
  }

  // Fallback to active admin ID if ownerId isn't explicitly provided
  const ownerId = ownerIdInput || user.id;

  let error;
  if (id) {
    const updatePayload = {
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
      updated_at: new Date().toISOString(),
    };
    const res = await supabase.from("pets").update(updatePayload).eq("id", id);
    error = res.error;
  } else {
    const insertPayload = {
      owner_id: ownerId,
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
      updated_at: new Date().toISOString(),
    };
    const res = await supabase.from("pets").insert(insertPayload);
    error = res.error;
  }

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.ADMIN + "/owners");
  return { success: true };
}

export async function deletePet(petId: string): Promise<PatientActionResponse> {
  const supabase = await createClient();

  if (!petId) {
    return { success: false, error: "Pet ID is required for deletion." };
  }

  const { error } = await supabase.from("pets").delete().eq("id", petId);

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  revalidatePath(ROUTES.ADMIN + "/owners");
  return { success: true };
}

export async function addGroomingLog(formData: FormData): Promise<PatientActionResponse> {
  const supabase = await createClient();
  const petId = formData.get("petId") as string;
  const logDate = formData.get("logDate") as string;
  const isGrooming = formData.get("isGrooming") === "true" || formData.get("isGrooming") === "on";
  const isBoarding = formData.get("isBoarding") === "true" || formData.get("isBoarding") === "on";
  const medicalHistory = (formData.get("medicalHistory") as string)?.trim() || null;
  const medicationsSupplements = (formData.get("medicationsSupplements") as string)?.trim() || null;
  const specialNeedsPreferences = (formData.get("specialNeedsPreferences") as string)?.trim() || null;

  if (!petId || !logDate) {
    return { success: false, error: "Pet ID and Log Date are required." };
  }

  const { error } = await supabase.from("pet_grooming_logs").insert({
    pet_id: petId,
    log_date: logDate,
    is_grooming: isGrooming,
    is_boarding: isBoarding,
    medical_history: medicalHistory,
    medications_supplements: medicationsSupplements,
    special_needs_preferences: specialNeedsPreferences,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  return { success: true };
}

export async function addVaccinationLog(formData: FormData): Promise<PatientActionResponse> {
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
    return { success: false, error: "Missing required vaccination details." };
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
  return { success: true };
}

export async function addParasiteLog(formData: FormData): Promise<PatientActionResponse> {
  const supabase = await createClient();
  const petId = formData.get("petId") as string;
  const dateGiven = formData.get("dateGiven") as string;
  const weightKg = formData.get("weightKg") ? parseFloat(formData.get("weightKg") as string) : null;
  const againstParasites = (formData.get("againstParasites") as string)?.trim();
  const preventativeUsed = (formData.get("preventativeUsed") as string)?.trim();
  const nextDue = (formData.get("nextDue") as string)?.trim() || null;
  const veterinarian = (formData.get("veterinarian") as string)?.trim();

  if (!petId || !dateGiven || !againstParasites || !preventativeUsed || !veterinarian) {
    return { success: false, error: "Missing required preventative details." };
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
  return { success: true };
}

export async function addMedicalVisitLog(formData: FormData): Promise<PatientActionResponse> {
  const supabase = await createClient();
  const petId = formData.get("petId") as string;
  const visitDate = formData.get("visitDate") as string;
  const reasonForVisit = (formData.get("reasonForVisit") as string)?.trim();
  const clinicalFindings = (formData.get("clinicalFindings") as string)?.trim();
  const vetInstructions = (formData.get("vetInstructions") as string)?.trim();
  const followUpDate = (formData.get("followUpDate") as string)?.trim() || null;
  const veterinarian = (formData.get("veterinarian") as string)?.trim();

  if (!petId || !visitDate || !reasonForVisit || !clinicalFindings || !vetInstructions || !veterinarian) {
    return { success: false, error: "Missing required clinical visit details." };
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
  return { success: true };
}

export async function addDentalLog(
  petId: string,
  recordDate: string,
  hasSalivation: boolean,
  hasPeriodontalDisease: boolean,
  toothConditions: Record<string, string>,
  notes?: string | null,
  veterinarian?: string | null
): Promise<PatientActionResponse> {
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
    notes: notes || null,
    veterinarian: veterinarian || null,
  });

  if (error) return { success: false, error: error.message };

  revalidatePath(ROUTES.ADMIN + "/patients");
  return { success: true };
}