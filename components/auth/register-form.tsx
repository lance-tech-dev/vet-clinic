'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { register, type RegisterState } from '@/app/register/actions';
import { ROUTES } from '@/config/constants';
import { PasswordInput } from './password-input';

const registerInitialState: RegisterState = {};

export default function RegisterForm() {
  const [state, formAction, isPending] = useActionState(register, registerInitialState);

  return (
    <form action={formAction} className="space-y-4 w-full max-w-md p-8 bg-surface rounded-2xl shadow-md border border-border">
      <div className="space-y-1 text-left">
        <h2 className="text-2xl font-bold text-navy-900 tracking-tight">Create an Account</h2>
        <p className="text-sm text-foreground-muted">Sign up your pet with vet-clinic</p>
      </div>

      {state?.error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200">
          {state.error}
        </div>
      )}

      {/* Owner Name */}
      <div className="space-y-1.5">
        <label htmlFor="ownerName" className="block text-sm font-semibold text-navy-900">
          Owner Name
        </label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          autoComplete="name"
          disabled={isPending}
          placeholder="Juan Dela Cruz"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all text-sm"
        />
        {state?.fieldErrors?.ownerName && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.ownerName[0]}</p>
        )}
      </div>

      {/* Pet Name */}
      <div className="space-y-1.5">
        <label htmlFor="petName" className="block text-sm font-semibold text-navy-900">
          Pet Name
        </label>
        <input
          id="petName"
          name="petName"
          type="text"
          disabled={isPending}
          placeholder="Buddy"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all text-sm"
        />
        {state?.fieldErrors?.petName && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.petName[0]}</p>
        )}
      </div>

      {/* Phone Number */}
      <div className="space-y-1.5">
        <label htmlFor="phone" className="block text-sm font-semibold text-navy-900">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          disabled={isPending}
          placeholder="+63 917 123 4567"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all text-sm"
        />
        {state?.fieldErrors?.phone && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.phone[0]}</p>
        )}
      </div>

      {/* Email Address */}
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
          placeholder="owner@example.com"
          className="w-full px-3.5 py-2.5 border border-border rounded-lg bg-surface text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all text-sm"
        />
        {state?.fieldErrors?.email && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.email[0]}</p>
        )}
      </div>

      {/* Password */}
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

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-navy-900">
          Confirm Password
        </label>
        <PasswordInput
          id="confirmPassword"
          name="confirmPassword"
          disabled={isPending}
          error={!!state?.fieldErrors?.confirmPassword}
        />
        {state?.fieldErrors?.confirmPassword && (
          <p className="text-xs text-red-500 mt-1">{state.fieldErrors.confirmPassword[0]}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full py-2.5 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:opacity-50 text-sm cursor-pointer mt-2"
      >
        {isPending ? 'Creating Account...' : 'Register'}
      </button>

      <p className="text-center text-sm text-foreground-muted mt-6">
        Already have an account?{' '}
        <Link href={ROUTES.LOGIN ?? '/login'} className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors">
          Sign in here
        </Link>
      </p>
    </form>
  );
}