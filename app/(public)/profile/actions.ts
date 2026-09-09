"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface ProfileFormState {
  error: string | null;
  success: boolean;
}

export async function updateProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthenticated session.", success: false };
    }

    const fullName = (formData.get("fullName") as string)?.trim() || "";
    const phone = (formData.get("phone") as string)?.trim() || "";
    const address = (formData.get("address") as string)?.trim() || "";

    // Structured Handler Fields
    const handlerName = (formData.get("handlerName") as string)?.trim() || "";
    const handlerRelationship = (formData.get("handlerRelationship") as string)?.trim() || "";
    const handlerPhone = (formData.get("handlerPhone") as string)?.trim() || "";

    const authorizedHandlers = handlerName
      ? `${handlerName}${handlerRelationship ? ` (${handlerRelationship})` : ""}${handlerPhone ? ` - ${handlerPhone}` : ""}`
      : (formData.get("authorizedHandlers") as string)?.trim() || null;

    if (!fullName) return { error: "Full name is required.", success: false };
    if (!phone) return { error: "Mobile contact number is required.", success: false };
    if (!address) return { error: "Home address is required.", success: false };
    if (!handlerName) return { error: "At least one authorized pet handler name is required.", success: false };

    // 1. Update profiles table
    const { error: profileError } = await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone: phone,
        updated_at: new Date().toISOString(),
      })
      .eq("id", user.id);

    if (profileError) {
      return { error: profileError.message, success: false };
    }

    // 2. Cascade update owner contact info across all pets owned by this user
    await supabase
      .from("pets")
      .update({
        owner_name: fullName,
        owner_phone: phone,
        owner_address: address,
        authorized_handlers: authorizedHandlers,
        updated_at: new Date().toISOString(),
      })
      .eq("owner_id", user.id);

    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.ADMIN + "/patients");
    revalidatePath(ROUTES.ADMIN + "/owners");

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update profile.",
      success: false,
    };
  }
}

export async function addPet(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthenticated session.", success: false };
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

    // Form Validation
    if (!name) return { error: "Pet's name is required.", success: false };
    if (!species) return { error: "Species is required.", success: false };
    if (!sex) return { error: "Pet sex is required.", success: false };
    if (!dateOfBirth) return { error: "Date of Birth is required.", success: false };
    if (!colorMarkings) return { error: "Color/Markings & Identification details are required.", success: false };
    if (!ownerName) return { error: "Owner full name is required.", success: false };
    if (!ownerAddress) return { error: "Owner home address is required.", success: false };
    if (!ownerPhone) return { error: "Owner mobile number is required.", success: false };
    if (!ownerEmail) return { error: "Owner email address is required.", success: false };
    if (!authorizedHandlers) return { error: "Authorized pet handler details are required.", success: false };

    const { error } = await supabase.from("pets").insert({
      owner_id: user.id,
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
    });

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.ADMIN + "/patients");
    revalidatePath(ROUTES.ADMIN + "/owners");

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to register pet.",
      success: false,
    };
  }
}

export async function rescheduleAppointment(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { error: "Unauthenticated session.", success: false };
    }

    const appointmentId = (formData.get("appointmentId") as string)?.trim();
    const newDate = (formData.get("newDate") as string)?.trim();
    const newTimeSlot = (formData.get("newTimeSlot") as string)?.trim();
    const reason = (formData.get("reason") as string)?.trim();

    if (!appointmentId || !newDate || !newTimeSlot || !reason) {
      return {
        error: "Please select a new date, time slot, and state a valid reason for rescheduling.",
        success: false,
      };
    }

    const { data: existingApp, error: fetchErr } = await supabase
      .from("appointments")
      .select("id, status, user_id")
      .eq("id", appointmentId)
      .single();

    if (fetchErr || !existingApp || existingApp.user_id !== user.id) {
      return { error: "Appointment record not found.", success: false };
    }

    if (existingApp.status !== "scheduled") {
      return { error: "Only scheduled appointments can be rescheduled.", success: false };
    }

    const { error: updateError } = await supabase
      .from("appointments")
      .update({
        appointment_date: newDate,
        time_slot: newTimeSlot,
        reschedule_reason: reason,
        updated_at: new Date().toISOString(),
      })
      .eq("id", appointmentId);

    if (updateError) {
      return { error: updateError.message, success: false };
    }

    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.APPOINTMENTS);
    revalidatePath(ROUTES.ADMIN + "/appointments");

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to reschedule appointment.",
      success: false,
    };
  }
}

export async function cancelUserAppointment(appointmentId: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthenticated." };

  const { error } = await supabase
    .from("appointments")
    .update({
      status: "cancelled",
      updated_at: new Date().toISOString(),
    })
    .eq("id", appointmentId)
    .eq("user_id", user.id);

  if (!error) {
    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.APPOINTMENTS);
    revalidatePath(ROUTES.ADMIN + "/appointments");
  }

  return { success: !error, error: error?.message || null };
}