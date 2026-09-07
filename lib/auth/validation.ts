import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(1, { message: "Password is required" }),
});

export const petInputSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Pet name is required" }),
  species: z
    .string()
    .default("Dog"),
  breed: z
    .string()
    .optional()
    .or(z.literal("")),
  age: z
    .string()
    .optional()
    .or(z.literal("")),
  notes: z
    .string()
    .optional()
    .or(z.literal("")),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .min(2, { message: "Full name must be at least 2 characters" }),
    phone: z
      .string()
      .min(7, { message: "Please enter a valid phone number" }),
    email: z
      .string()
      .min(1, { message: "Email is required" })
      .email({ message: "Invalid email address" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirmPassword: z.string(),
    petsPayload: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type PetInput = z.infer<typeof petInputSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;