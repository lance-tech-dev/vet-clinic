"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export async function updateAppointmentStatus(
  id: string,
  newStatus: "scheduled" | "completed" | "cancelled"
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("appointments")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (!error) {
    revalidatePath(ROUTES.ADMIN + "/appointments");
    revalidatePath(ROUTES.PROFILE);
  }

  return { success: !error, error: error?.message || null };
}

export async function deleteAppointment(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("appointments").delete().eq("id", id);

  if (!error) {
    revalidatePath(ROUTES.ADMIN + "/appointments");
    revalidatePath(ROUTES.PROFILE);
  }

  return { success: !error, error: error?.message || null };
}