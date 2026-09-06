import { Suspense } from 'react';
import LoginForm from '@/components/auth/login-form';

export default function LoginPage() {
  return (
    <main className="flex-1 flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <Suspense fallback={<div className="text-sm text-foreground-muted">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}