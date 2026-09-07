"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";

export interface BranchFormState {
  error: string | null;
  success: boolean;
}

// Internal Zod Schema (NOT exported from a "use server" module)
const branchSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, { message: "Branch name must be at least 2 characters" }),
  city: z.string().min(2, { message: "City name is required" }),
  address: z.string().min(5, { message: "Full address is required" }),
  phone: z.string().min(7, { message: "Contact number is required" }),
  operatingHours: z.string().min(3, { message: "Operating hours are required" }),
  isActive: z.boolean().default(true),
});

/**
 * Server Action to create a new clinic branch.
 */
export async function createBranch(
  prevState: BranchFormState,
  formData: FormData
): Promise<BranchFormState> {
  try {
    await requireAdmin();

    const rawData = {
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      operatingHours: (formData.get("operatingHours") as string) || "8:00 AM - 6:00 PM",
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    };

    const validation = branchSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || "Invalid input parameters.";
      return { error: firstError, success: false };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("branches").insert({
      name: validation.data.name,
      city: validation.data.city,
      address: validation.data.address,
      phone: validation.data.phone,
      operating_hours: validation.data.operatingHours,
      is_active: validation.data.isActive,
    });

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath("/admin/branches");
    revalidatePath("/");
    return { error: null, success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to create branch.";
    return { error: message, success: false };
  }
}

/**
 * Server Action to update an existing clinic branch.
 */
export async function updateBranch(
  prevState: BranchFormState,
  formData: FormData
): Promise<BranchFormState> {
  try {
    await requireAdmin();

    const branchId = formData.get("id") as string;
    if (!branchId) {
      return { error: "Branch ID is required for updates.", success: false };
    }

    const rawData = {
      id: branchId,
      name: formData.get("name") as string,
      city: formData.get("city") as string,
      address: formData.get("address") as string,
      phone: formData.get("phone") as string,
      operatingHours: (formData.get("operatingHours") as string) || "8:00 AM - 6:00 PM",
      isActive: formData.get("isActive") === "true" || formData.get("isActive") === "on",
    };

    const validation = branchSchema.safeParse(rawData);
    if (!validation.success) {
      const fieldErrors = validation.error.flatten().fieldErrors;
      const firstError = Object.values(fieldErrors).flat()[0] || "Invalid input parameters.";
      return { error: firstError, success: false };
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("branches")
      .update({
        name: validation.data.name,
        city: validation.data.city,
        address: validation.data.address,
        phone: validation.data.phone,
        operating_hours: validation.data.operatingHours,
        is_active: validation.data.isActive,
        updated_at: new Date().toISOString(),
      })
      .eq("id", branchId);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath("/admin/branches");
    revalidatePath("/");
    return { error: null, success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to update branch.";
    return { error: message, success: false };
  }
}

/**
 * Toggles a branch's active status (Open/Closed).
 */
export async function toggleBranchStatus(branchId: string, currentStatus: boolean) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from("branches")
      .update({
        is_active: !currentStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("id", branchId);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath("/admin/branches");
    revalidatePath("/");
    return { error: null, success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to toggle branch status.";
    return { error: message, success: false };
  }
}

/**
 * Deletes a branch from the database.
 */
export async function deleteBranch(branchId: string) {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase.from("branches").delete().eq("id", branchId);

    if (error) {
      return { error: error.message, success: false };
    }

    revalidatePath("/admin/branches");
    revalidatePath("/");
    return { error: null, success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to delete branch.";
    return { error: message, success: false };
  }
}