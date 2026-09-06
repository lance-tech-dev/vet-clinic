import { z } from "zod";

/**
 * Client- and server-side validation for auth forms. Supabase Auth remains the
 * final authority (e.g. its own password policy) — this only rejects obviously
 * invalid input before making a network call.
 */

export const loginSchema = z.object({
  email: z.string().min(1, "Email is required.").email("Enter a valid email address."),
  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, "Full name must be at least 2 characters.")
      .max(100, "Full name is too long."),
    email: z
      .string()
      .min(1, "Email is required.")
      .email("Enter a valid email address.")
      .max(254, "Email is too long."),
    // 72 bytes is bcrypt's effective input limit — a sensible upper bound regardless of backend.
    password: z.string().min(8, "Password must be at least 8 characters.").max(72, "Password is too long."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });
