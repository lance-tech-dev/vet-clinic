import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, "Email address is required.")
    .email("Please enter a valid email address."),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters."),
  fullName: z
    .string()
    .min(1, "Owner full name is required."),
  phone: z
    .string()
    .min(1, "Mobile contact number is required."),
  address: z
    .string()
    .min(1, "Home address is required."),
});