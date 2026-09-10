import { createClient } from "@/lib/supabase/server";
import { ContactView, type BranchContactInfo } from "./contact-view";

export const revalidate = 0;

export default async function ContactPage() {
  const supabase = await createClient();

  // Fetch active clinic branches from Supabase
  const { data: rawBranches } = await supabase
    .from("branches")
    .select("id, name, address, city, phone, operating_hours")
    .eq("is_active", true)
    .order("created_at", { ascending: true });

  const branches = (rawBranches as BranchContactInfo[]) || [];

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16 text-navy-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-navy-900 tracking-tight">
            We&apos;d Love to Hear From You
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            Have questions about our veterinary services, branch schedules, or pet health records? Send us a message or reach out through our official channels.
          </p>
        </div>

        {/* Dynamic Interactive Client View */}
        <ContactView branches={branches} />
      </div>
    </main>
  );
}