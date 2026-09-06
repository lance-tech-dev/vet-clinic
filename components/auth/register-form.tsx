"use client";

import { useActionState } from "react";
import Link from "next/link";
import { register, registerInitialState } from "@/app/register/actions";
import { ROUTES } from "@/config/constants";
import { PasswordInput } from "./password-input";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, registerInitialState);

  if (state.status === "needs_confirmation" || state.status === "already_exists") {
    return (
      <div className="w-full max-w-sm space-y-4 rounded-lg border border-navy-100 p-6 text-center shadow-sm">
        <h1 className="text-xl font-semibold text-navy-900">
          {state.status === "needs_confirmation" ? "Check Your Email" : "Account Registration"}
        </h1>
        <p className="text-sm text-slate-600">{state.message}</p>
        <Link
          href={ROUTES.LOGIN}
          className="inline-block w-full rounded bg-navy-900 px-3 py-2 text-white transition hover:bg-navy-800"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4 rounded-lg border border-navy-100 p-6 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">Create Account</h1>
        <p className="mt-1 text-sm text-slate-600">Register to get started.</p>
      </div>

      <div>
        <label htmlFor="fullName" className="block text-sm text-navy-700">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          required
          autoComplete="name"
          className="mt-1 w-full rounded border border-navy-200 px-3 py-2 text-navy-900 focus:border-navy-500 focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm text-navy-700">
          Email address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className="mt-1 w-full rounded border border-navy-200 px-3 py-2 text-navy-900 focus:border-navy-500 focus:outline-none"
        />
      </div>

      <PasswordInput name="password" label="Password" autoComplete="new-password" minLength={8} />
      <PasswordInput name="confirmPassword" label="Confirm password" autoComplete="new-password" minLength={8} />

      {state.status === "error" && (
        <p role="alert" className="text-sm text-red-600">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-navy-900 px-3 py-2 text-white transition hover:bg-navy-800 disabled:opacity-50"
      >
        {pending ? "Creating account..." : "Create Account"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Already have an account?{" "}
        <Link href={ROUTES.LOGIN} className="font-medium text-navy-900 hover:text-gold-600">
          Log In
        </Link>
      </p>
    </form>
  );
}
