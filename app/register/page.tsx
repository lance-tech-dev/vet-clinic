import { Suspense } from 'react';
import RegisterForm from '@/components/auth/register-form';

export default function RegisterPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-foreground-muted">Loading register form...</div>}>
        <RegisterForm />
      </Suspense>
    </main>
  );
}