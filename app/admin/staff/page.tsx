import { createClient } from "@/lib/supabase/server";
import { StaffView, type Branch, type StaffMember } from "./staff-view";

export const dynamic = "force-dynamic";

export default async function AdminStaffPage() {
  const supabase = await createClient();

  // Query branches
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("id, name, city, address")
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  // Query staff members
  const { data: rawStaff } = await supabase
    .from("staff_members")
    .select("*")
    .order("created_at", { ascending: true });

  const staffMembers = (rawStaff as StaffMember[]) || [];

  return <StaffView branches={branches} staffMembers={staffMembers} />;
}