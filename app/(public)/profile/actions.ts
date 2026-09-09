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

    const fullName = (formData.get("fullName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();

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

    revalidatePath(ROUTES.PROFILE);
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

    const name = (formData.get("name") as string)?.trim();
    const species = (formData.get("species") as string)?.trim() || "Dog";
    const breed = (formData.get("breed") as string)?.trim() || null;
    const age = (formData.get("age") as string)?.trim() || null;
    const notes = (formData.get("notes") as string)?.trim() || null;

    if (!name) {
      return { error: "Pet name is required.", success: false };
    }

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

    revalidatePath(ROUTES.PROFILE);
    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to add pet.",
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

    // Verify appointment belongs to user and is still scheduled
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

    // Update appointment
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