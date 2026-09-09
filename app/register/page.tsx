import { RegisterForm } from "@/components/auth/register-form";

export default function RegisterPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mx-auto font-bold">
            🐾
          </div>
          <h1 className="text-2xl font-extrabold text-navy-900 tracking-tight">
            Create Your Account
          </h1>
          <p className="text-xs text-slate-500">
            Register as a pet owner to manage your pets and appointments seamlessly.
          </p>
        </div>

        <RegisterForm />
      </div>
    </main>
  );
}