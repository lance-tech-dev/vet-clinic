"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ROUTES } from "@/config/constants";

export interface StaffFormState {
  error: string | null;
  success: boolean;
}

export async function createStaff(
  prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  try {
    const supabase = await createClient();

    const branchId = (formData.get("branchId") as string)?.trim();
    const fullName = (formData.get("fullName") as string)?.trim();
    const roleTitle = (formData.get("roleTitle") as string)?.trim();
    const specialization = (formData.get("specialization") as string)?.trim() || null;
    const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;
    const phone = (formData.get("phone") as string)?.trim() || null;
    const email = (formData.get("email") as string)?.trim() || null;
    const isActive = formData.get("isActive") === "on";

    if (!branchId || !fullName || !roleTitle) {
      return {
        error: "Please fill in all required fields (Branch, Full Name, Role Title).",
        success: false,
      };
    }

    const { error } = await supabase.from("staff_members").insert({
      branch_id: branchId,
      full_name: fullName,
      role_title: roleTitle,
      specialization,
      avatar_url: avatarUrl,
      phone,
      email,
      is_active: isActive,
    });

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath(ROUTES.ADMIN + "/staff");
    revalidatePath(ROUTES.BRANCHES);

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to add staff member.",
      success: false,
    };
  }
}

export async function updateStaff(
  prevState: StaffFormState,
  formData: FormData
): Promise<StaffFormState> {
  try {
    const supabase = await createClient();

    const id = formData.get("id") as string;
    const branchId = (formData.get("branchId") as string)?.trim();
    const fullName = (formData.get("fullName") as string)?.trim();
    const roleTitle = (formData.get("roleTitle") as string)?.trim();
    const specialization = (formData.get("specialization") as string)?.trim() || null;
    const avatarUrl = (formData.get("avatarUrl") as string)?.trim() || null;
    const phone = (formData.get("phone") as string)?.trim() || null;
    const email = (formData.get("email") as string)?.trim() || null;
    const isActive = formData.get("isActive") === "on";

    if (!id || !branchId || !fullName || !roleTitle) {
      return { error: "Please fill in all required fields.", success: false };
    }

    const { error } = await supabase
      .from("staff_members")
      .update({
        branch_id: branchId,
        full_name: fullName,
        role_title: roleTitle,
        specialization,
        avatar_url: avatarUrl,
        phone,
        email,
        is_active: isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath(ROUTES.ADMIN + "/staff");
    revalidatePath(ROUTES.BRANCHES);

    return { error: null, success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Failed to update staff member.",
      success: false,
    };
  }
}

export async function toggleStaffStatus(id: string, currentStatus: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("staff_members")
    .update({ is_active: !currentStatus, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (!error) {
    revalidatePath(ROUTES.ADMIN + "/staff");
    revalidatePath(ROUTES.BRANCHES);
  }
}

export async function deleteStaff(id: string) {
  const supabase = await createClient();

  const { error } = await supabase.from("staff_members").delete().eq("id", id);

  if (!error) {
    revalidatePath(ROUTES.ADMIN + "/staff");
    revalidatePath(ROUTES.BRANCHES);
  }
}