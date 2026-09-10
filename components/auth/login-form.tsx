"use client";

import { useActionState } from "react";
import Link from "next/link";
import { signIn, type AuthActionResult } from "@/lib/auth/actions";
import { PasswordInput } from "@/components/auth/password-input";
import { ROUTES } from "@/config/constants";

const initialState: AuthActionResult = {
  error: null,
  success: false,
};

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(signIn, initialState);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-orange-700 text-[11px] font-extrabold uppercase tracking-wider">
          <span>🐾</span>
          <span>FurBabies & Friends Portal</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-navy-900 tracking-tight">
          Welcome Back
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Sign in to manage your appointments and pet medical records.
        </p>
      </div>

      {/* Error Alert Banner */}
      {state?.error && (
        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-start gap-2.5 animate-in fade-in duration-200">
          <svg className="w-4 h-4 text-red-500 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{state.error}</span>
        </div>
      )}

      {/* Login Form */}
      <form action={formAction} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1">
          <label htmlFor="email" className="block text-xs font-bold text-slate-700">
            Email Address *
          </label>
          <div className="relative">
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="doctor@vetclinic.com"
              className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-navy-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-xs font-bold text-slate-700">
              Password *
            </label>
          </div>
          <PasswordInput
            id="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-extrabold text-xs shadow-md shadow-orange-500/25 hover:shadow-lg hover:scale-[1.01] active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? (
            <div className="flex items-center gap-2">
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Authenticating...</span>
            </div>
          ) : (
            <>
              <span>Sign In to Account</span>
              <span>➔</span>
            </>
          )}
        </button>
      </form>

      {/* Footer Link */}
      <div className="pt-2 text-center text-xs font-semibold text-slate-500 border-t border-slate-100">
        <span>Don&apos;t have an account? </span>
        <Link
          href={ROUTES.REGISTER}
          className="font-extrabold text-orange-600 hover:text-orange-700 underline underline-offset-4 transition-colors"
        >
          Register as Pet Owner
        </Link>
      </div>
    </div>
  );
}