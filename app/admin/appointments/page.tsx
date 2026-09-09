import { createClient } from "@/lib/supabase/server";
import { AppointmentView, type Branch, type Appointment } from "./appointment-view";

export const dynamic = "force-dynamic";

export default async function AdminAppointmentsPage() {
  const supabase = await createClient();

  // 1. Query branches
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("id, name, city")
    .order("created_at", { ascending: true });

  const branches = (rawBranches as Branch[]) || [];

  // 2. Query appointments
  const { data: rawAppointments } = await supabase
    .from("appointments")
    .select("*")
    .order("appointment_date", { ascending: true })
    .order("time_slot", { ascending: true });

  const appointments = (rawAppointments as Appointment[]) || [];

  return <AppointmentView branches={branches} appointments={appointments} />;
}