import { createClient } from "@/lib/supabase/server";
import { BranchView, type Branch } from "./branch-view";

export default async function AdminBranchesPage() {
  const supabase = await createClient();

  const { data: branches } = await supabase
    .from("branches")
    .select("*")
    .order("created_at", { ascending: true });

  return <BranchView branches={(branches as Branch[]) || []} />;
}