'use client';

import { useState, InputHTMLAttributes } from 'react';

export interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function PasswordInput({ className = '', error, ...props }: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? 'text' : 'password'}
        className={`w-full px-3.5 py-2.5 pr-10 border rounded-lg bg-surface text-foreground placeholder:text-foreground-subtle focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:opacity-50 transition-all text-sm ${
          error ? 'border-red-500' : 'border-border'
        } ${className}`}
        {...props}
      />
      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-foreground-muted hover:text-navy-900 focus:outline-none transition-colors cursor-pointer"
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
}