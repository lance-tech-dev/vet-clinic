import RegisterForm from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 py-12 lg:py-16">
      <div className="max-w-xl mx-auto px-4 sm:px-6">
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-600 bg-orange-50 px-3.5 py-1 rounded-full border border-orange-200">
              New Account Registration
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-navy-900 tracking-tight">
              Join VetClinic Family
            </h1>
            <p className="text-slate-500 text-xs sm:text-sm">
              Register yourself and your fur babies to access appointments and online medical records.
            </p>
          </div>

          <RegisterForm />
        </div>
      </div>
    </main>
  );
}