import "server-only";
import { S3Client } from "@aws-sdk/client-s3";
import { getServerEnv, isR2Configured } from "@/config/env";

let r2Client: S3Client | null = null;

/**
 * Creates or returns the singleton S3-compatible client for Cloudflare R2.
 * Server-only: credentials must never reach the browser bundle.
 */
export function getR2Client(): S3Client {
  if (r2Client) return r2Client;

  const env = getServerEnv();

  if (!isR2Configured()) {
    throw new Error(
      "Cloudflare R2 is not configured. Add R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET to .env.local."
    );
  }

  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env.R2_ACCESS_KEY_ID!,
      secretAccessKey: env.R2_SECRET_ACCESS_KEY!,
    },
  });

  return r2Client;
}
