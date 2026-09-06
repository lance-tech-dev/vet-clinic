import { z } from "zod";

/**
 * Public environment schema — accessible on both client and server.
 * Only variables prefixed with NEXT_PUBLIC_ may be included here.
 */
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url("NEXT_PUBLIC_SUPABASE_URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "NEXT_PUBLIC_SUPABASE_ANON_KEY cannot be empty")
    .optional()
    .or(z.literal("")),
  // Public delivery URL for the R2 media bucket. Contains no credentials.
  NEXT_PUBLIC_R2_PUBLIC_URL: z
    .string()
    .url("NEXT_PUBLIC_R2_PUBLIC_URL must be a valid URL")
    .optional()
    .or(z.literal("")),
  NEXT_PUBLIC_SITE_URL: z
    .string()
    .url("NEXT_PUBLIC_SITE_URL must be a valid URL")
    .default("http://localhost:3000"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

/**
 * Server-only environment schema — NEVER exposed to the browser.
 */
const serverEnvSchema = clientEnvSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, "SUPABASE_SERVICE_ROLE_KEY cannot be empty")
    .optional()
    .or(z.literal("")),

  // Cloudflare R2 — object storage for site media.
  R2_ACCOUNT_ID: z.string().optional().or(z.literal("")),
  R2_ACCESS_KEY_ID: z.string().optional().or(z.literal("")),
  R2_SECRET_ACCESS_KEY: z.string().optional().or(z.literal("")),
  R2_BUCKET: z.string().optional().or(z.literal("")),

  // Used only by the one-time admin seed script (scripts/seed-admin.ts).
  ADMIN_EMAIL: z.string().optional().or(z.literal("")),
  ADMIN_INITIAL_PASSWORD: z.string().optional().or(z.literal("")),
});

export type ClientEnv = z.infer<typeof clientEnvSchema>;
export type ServerEnv = z.infer<typeof serverEnvSchema>;

/**
 * Get validated public/client environment variables.
 */
export function getClientEnv(): ClientEnv {
  const result = clientEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
  });

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid client environment configuration:\n${errorDetails}`);
  }

  return result.data;
}

/**
 * Get validated server environment variables.
 * Call this only in server components, server actions, or route handlers.
 */
export function getServerEnv(): ServerEnv {
  if (typeof window !== "undefined") {
    throw new Error("Security Violation: Attempted to access server environment variables from the browser client.");
  }

  const result = serverEnvSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_R2_PUBLIC_URL: process.env.NEXT_PUBLIC_R2_PUBLIC_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    NODE_ENV: process.env.NODE_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    R2_ACCOUNT_ID: process.env.R2_ACCOUNT_ID,
    R2_ACCESS_KEY_ID: process.env.R2_ACCESS_KEY_ID,
    R2_SECRET_ACCESS_KEY: process.env.R2_SECRET_ACCESS_KEY,
    R2_BUCKET: process.env.R2_BUCKET,
    ADMIN_EMAIL: process.env.ADMIN_EMAIL,
    ADMIN_INITIAL_PASSWORD: process.env.ADMIN_INITIAL_PASSWORD,
  });

  if (!result.success) {
    const errorDetails = result.error.issues
      .map((issue) => `  - ${issue.path.join(".")}: ${issue.message}`)
      .join("\n");
    throw new Error(`Invalid server environment configuration:\n${errorDetails}`);
  }

  return result.data;
}

/**
 * Helper to check if Supabase is fully configured.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && anonKey && url.startsWith("http"));
}

/**
 * Helper to check if Supabase Service Role is configured for server-only operations.
 */
export function isSupabaseAdminConfigured(): boolean {
  return isSupabaseConfigured() && Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

/**
 * Helper to check if the R2 media bucket is configured.
 */
export function isR2Configured(): boolean {
  return Boolean(
    process.env.R2_ACCOUNT_ID &&
      process.env.R2_ACCESS_KEY_ID &&
      process.env.R2_SECRET_ACCESS_KEY &&
      process.env.R2_BUCKET
  );
}

/**
 * Helper to check if the one-time admin seed script has its required variables.
 */
export function isAdminSeedConfigured(): boolean {
  return Boolean(process.env.ADMIN_EMAIL && process.env.ADMIN_INITIAL_PASSWORD);
}
