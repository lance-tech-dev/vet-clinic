import { createClient } from "@/lib/supabase/server";
import { ContactView } from "./contact-view";

export default async function ContactPage() {
  const supabase = await createClient();
  const { data: branches } = await supabase
    .from("branches")
    .select("id, name, address, city, phone, operating_hours")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-slate-50 text-slate-800">
      {/* 1. Hero Section (Matched directly to branches/page.tsx) */}
      <section className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-slate-50 py-16 lg:py-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/80 text-orange-800 text-xs font-bold border border-orange-200 shadow-2xs">
            <span>📞</span> Get In Touch
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-navy-900 tracking-tight leading-[1.15]">
            We&apos;d Love to <span className="text-orange-500">Hear From You</span>
          </h1>

          <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-normal">
            Have questions about our veterinary services, branch schedules, or pet health records? Send us a message or reach out through our official channels.
          </p>
        </div>
      </section>

      {/* 2. Main Content Grid Section */}
      <section className="py-12 sm:py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactView branches={branches || []} />
        </div>
      </section>
    </main>
  );
}