"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface BranchFormState {
  error: string | null;
  success: boolean;
}

export async function createBranch(
  prevState: BranchFormState,
  formData: FormData
): Promise<BranchFormState> {
  try {
    const supabase = await createClient();

    const name = (formData.get("name") as string)?.trim();
    const city = (formData.get("city") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const operatingHours = (formData.get("operatingHours") as string)?.trim() || "8:00 AM - 6:00 PM";
    const gmapUrl = (formData.get("gmapUrl") as string)?.trim() || null;
    const isActive = formData.get("isActive") === "on";

    if (!name || !city || !address || !phone) {
      return { error: "Please fill in all required fields (Name, City, Address, Phone).", success: false };
    }

    const { error } = await supabase.from("branches").insert({
      name,
      city,
      address,
      phone,
      operating_hours: operatingHours,
      gmap_url: gmapUrl,
      is_active: isActive,
    });

    if (error) {
      if (error.code === "23505") {
        return { error: "A branch with this name already exists.", success: false };
      }
      return { error: error.message, success: false };
    }

    revalidatePath(ROUTES.ADMIN + "/branches");
    revalidatePath(ROUTES.BRANCHES);
    revalidatePath(ROUTES.HOME);

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to create branch.",
      success: false,
    };
  }
}

export async function updateBranch(
  prevState: BranchFormState,
  formData: FormData
): Promise<BranchFormState> {
  try {
    const supabase = await createClient();

    const id = formData.get("id") as string;
    const name = (formData.get("name") as string)?.trim();
    const city = (formData.get("city") as string)?.trim();
    const address = (formData.get("address") as string)?.trim();
    const phone = (formData.get("phone") as string)?.trim();
    const operatingHours = (formData.get("operatingHours") as string)?.trim() || "8:00 AM - 6:00 PM";
    const gmapUrl = (formData.get("gmapUrl") as string)?.trim() || null;
    const isActive = formData.get("isActive") === "on";

    if (!id || !name || !city || !address || !phone) {
      return { error: "Please fill in all required fields.", success: false };
    }

    const { error } = await supabase
      .from("branches")
      .update({
        name,
        city,
        address,
        phone,
        operating_hours: operatingHours,
        gmap_url: gmapUrl,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath(ROUTES.ADMIN + "/branches");
    revalidatePath(ROUTES.BRANCHES);
    revalidatePath(ROUTES.HOME);

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update branch.",
      success: false,
    };
  }
}

export async function toggleBranchStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("branches")
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (!error) {
    revalidatePath(ROUTES.ADMIN + "/branches");
    revalidatePath(ROUTES.BRANCHES);
    revalidatePath(ROUTES.HOME);
  }
}

export async function deleteBranch(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("branches").delete().eq("id", id);

  if (!error) {
    revalidatePath(ROUTES.ADMIN + "/branches");
    revalidatePath(ROUTES.BRANCHES);
    revalidatePath(ROUTES.HOME);
  }
}