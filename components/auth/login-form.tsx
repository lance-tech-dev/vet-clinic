'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { loginAction } from '@/app/login/actions';
import { ROUTES } from '@/config/constants';
import { PasswordInput } from './password-input';

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, {});

  return (
    <form action={formAction} className="space-y-5 w-full max-w-md p-8 bg-surface rounded-2xl shadow-md border border-border">
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Welcome back</h2>
        <p className="text-sm text-foreground-muted">Enter your credentials to access vet-clinic</p>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {state.error}
        </div>
      )}

      <div className="space-y-1.5">
        <label htmlFor="email" className="block text-sm font-semibold text-navy-900">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          disabled={isPending}
          placeholder="doctor@vetclinic.com"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all text-sm"
        />
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="password" className="block text-sm font-semibold text-navy-900">
          Password
        </label>
        <PasswordInput
          id="password"
          name="password"
          disabled={isPending}
          error={!!state?.fieldErrors?.password}
        />
        {state?.fieldErrors?.password && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.password[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 text-sm cursor-pointer"
      >
        {isPending ? 'Signing in...' : 'Sign In'}
      </button>

      <p className="text-center text-sm text-foreground-muted mt-6">
        Don&apos;t have an account?{' '}
        <Link href={ROUTES.REGISTER ?? '/register'} className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors">
          Register here
        </Link>
      </p>
    </form>
  );
}