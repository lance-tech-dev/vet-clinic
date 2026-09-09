"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface BookingFormState {
  error: string | null;
  errorCode?: "SAME_DAY_CUTOFF" | "UNAUTHENTICATED" | "VALIDATION_ERROR" | "UNKNOWN";
  success: boolean;
  data?: {
    id: string;
    branchName: string;
    serviceName: string;
    appointmentDate: string;
    timeSlot: string;
    petName: string;
  };
}

/**
 * Helper to check if a booking date is today and within 30 minutes of the branch closing time.
 */
function isSameDayCutoff(operatingHoursStr: string, appointmentDateStr: string): boolean {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const todayStr = `${year}-${month}-${day}`;

  // If the appointment is for a future date, same-day cutoff does not apply
  if (appointmentDateStr !== todayStr) {
    return false;
  }

  // Parse closing time from operating hours string, e.g. "8:00 AM - 6:00 PM"
  const parts = operatingHoursStr.split("-");
  if (parts.length < 2) return false;

  const closingPart = parts[1].trim(); // e.g. "6:00 PM" or "5:00 PM"
  const match = closingPart.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!match) return false;

  let hours = parseInt(match[1], 10);
  const minutes = parseInt(match[2], 10);
  const period = match[3].toUpperCase();

  if (period === "PM" && hours < 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  // Calculate closing time in total minutes from midnight
  const closingInMinutes = hours * 60 + minutes;
  // Cutoff is 30 minutes before closing
  const cutoffInMinutes = closingInMinutes - 30;

  // Calculate current local time in total minutes from midnight
  const currentInMinutes = now.getHours() * 60 + now.getMinutes();

  return currentInMinutes >= cutoffInMinutes;
}

export async function createAppointment(
  prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  try {
    const supabase = await createClient();

    // 1. Verify User Authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return {
        error: "You must be signed in to book an appointment.",
        errorCode: "UNAUTHENTICATED",
        success: false,
      };
    }

    // 2. Extract and sanitize Form Data
    const branchId = (formData.get("branchId") as string)?.trim();
    const serviceName = (formData.get("serviceName") as string)?.trim();
    const appointmentDate = (formData.get("appointmentDate") as string)?.trim();
    const timeSlot = (formData.get("timeSlot") as string)?.trim();
    const ownerName = (formData.get("ownerName") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const petName = (formData.get("petName") as string)?.trim();
    const speciesBreed = (formData.get("speciesBreed") as string)?.trim();
    const notes = (formData.get("notes") as string)?.trim() || null;

    if (
      !branchId ||
      !serviceName ||
      !appointmentDate ||
      !timeSlot ||
      !ownerName ||
      !phone ||
      !petName ||
      !speciesBreed
    ) {
      return {
        error: "Please fill in all required booking fields.",
        errorCode: "VALIDATION_ERROR",
        success: false,
      };
    }

    // 3. Fetch Selected Branch to Validate Operating Hours Cutoff
    const { data: branch, error: branchError } = await supabase
      .from("branches")
      .select("id, name, operating_hours, is_active")
      .eq("id", branchId)
      .single();

    if (branchError || !branch || !branch.is_active) {
      return {
        error: "The selected clinic branch is currently unavailable.",
        errorCode: "VALIDATION_ERROR",
        success: false,
      };
    }

    // 4. Validate Same-Day 30-Minute Operating Hours Cutoff
    if (isSameDayCutoff(branch.operating_hours, appointmentDate)) {
      return {
        error: `Same-day booking for ${branch.name} is closed because the clinic closes in less than 30 minutes (${branch.operating_hours}). Please select tomorrow or a future date.`,
        errorCode: "SAME_DAY_CUTOFF",
        success: false,
      };
    }

    // 5. Insert Appointment into Database (Default Status: 'scheduled')
    const { data: newAppointment, error: insertError } = await supabase
      .from("appointments")
      .insert({
        user_id: user.id,
        branch_id: branchId,
        service_name: serviceName,
        appointment_date: appointmentDate,
        time_slot: timeSlot,
        owner_name: ownerName,
        phone,
        pet_name: petName,
        species_breed: speciesBreed,
        notes,
        status: "scheduled",
      })
      .select()
      .single();

    if (insertError) {
      return {
        error: insertError.message,
        errorCode: "UNKNOWN",
        success: false,
      };
    }

    // 6. Revalidate Cache for Live Syncing Across Admin & Profile Pages
    revalidatePath(ROUTES.APPOINTMENTS);
    revalidatePath(ROUTES.PROFILE);
    revalidatePath(ROUTES.ADMIN + "/appointments");

    return {
      error: null,
      success: true,
      data: {
        id: newAppointment.id,
        branchName: branch.name,
        serviceName,
        appointmentDate,
        timeSlot,
        petName,
      },
    };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create appointment.",
      errorCode: "UNKNOWN",
      success: false,
    };
  }
}