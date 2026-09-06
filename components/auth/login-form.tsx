"use client";

import { useActionState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { login, type LoginFormState } from "@/app/login/actions";
import { ROUTES } from "@/config/constants";
import { PasswordInput } from "./password-input";

const initialState: LoginFormState = {};

export function LoginForm() {
  const [state, formAction, pending] = useActionState(login, initialState);
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") ?? "";

  return (
    <form action={formAction} className="w-full max-w-sm space-y-4 rounded-lg border border-navy-100 p-6 shadow-sm">
      <div>
        <h1 className="text-xl font-semibold text-navy-900">Sign In</h1>
        <p className="mt-1 text-sm text-slate-600">Welcome back. Please enter your details.</p>
      </div>

      <input type="hidden" name="redirectTo" value={redirectTo} />

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

      <PasswordInput name="password" label="Password" autoComplete="current-password" />

      {state?.error && (
        <p role="alert" className="text-sm text-red-600">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded bg-navy-900 px-3 py-2 text-white transition hover:bg-navy-800 disabled:opacity-50"
      >
        {pending ? "Logging in..." : "Log In"}
      </button>

      <p className="text-center text-sm text-slate-600">
        Don&apos;t have an account?{" "}
        <Link href={ROUTES.REGISTER} className="font-medium text-navy-900 hover:text-gold-600">
          Register
        </Link>
      </p>
    </form>
  );
}
