import "server-only";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getR2Client } from "./r2-client";
import { validateMediaFile } from "./validation";
import { getServerEnv } from "@/config/env";
import { ExternalServiceError, ValidationError } from "@/lib/errors/app-error";
import { logger } from "@/lib/logging/logger";
import type { UploadImageOptions, UploadedMedia } from "./types";

function buildStorageKey(sanitizedFilename: string, folder?: string): string {
  const prefix = folder ? `${folder.replace(/^\/+|\/+$/g, "")}/` : "";
  return `${prefix}${sanitizedFilename}`;
}

function buildPublicUrl(storageKey: string): string {
  const env = getServerEnv();
  const base = (env.NEXT_PUBLIC_R2_PUBLIC_URL || "").replace(/\/+$/, "");
  return `${base}/${storageKey}`;
}

/**
 * Uploads a file to Cloudflare R2 after validating it as untrusted input.
 *
 * Callers are responsible for enforcing authentication/authorization
 * (e.g. requireAdmin()) before invoking this service — it performs no
 * access control of its own.
 */
export async function uploadMediaToR2(
  file: File,
  options: UploadImageOptions = {}
): Promise<UploadedMedia> {
  const validation = await validateMediaFile(file);

  if (!validation.isValid) {
    throw new ValidationError(validation.error);
  }

  const env = getServerEnv();
  const storageKey = options.customId || buildStorageKey(validation.sanitizedFilename, options.folder);
  const client = getR2Client();

  try {
    const buffer = new Uint8Array(await file.arrayBuffer());

    await client.send(
      new PutObjectCommand({
        Bucket: env.R2_BUCKET!,
        Key: storageKey,
        Body: buffer,
        ContentType: validation.mimeType,
        Metadata: options.metadata,
      })
    );
  } catch (err) {
    logger.error("Cloudflare R2 upload failed", { storageKey, error: String(err) });
    throw new ExternalServiceError("Cloudflare R2", "Failed to upload media file.");
  }

  return {
    id: storageKey,
    filename: validation.sanitizedFilename,
    storageKey,
    url: buildPublicUrl(storageKey),
    mimeType: validation.mimeType,
    sizeBytes: validation.sizeBytes,
    uploadedAt: new Date().toISOString(),
  };
}

/**
 * Deletes an object from Cloudflare R2 by its storage key.
 *
 * Used both for explicit media deletion and for orphan cleanup when a
 * paired Supabase metadata write fails after a successful upload.
 */
export async function deleteMediaFromR2(storageKey: string): Promise<void> {
  const env = getServerEnv();
  const client = getR2Client();

  try {
    await client.send(
      new DeleteObjectCommand({
        Bucket: env.R2_BUCKET!,
        Key: storageKey,
      })
    );
  } catch (err) {
    logger.error("Cloudflare R2 delete failed", { storageKey, error: String(err) });
    throw new ExternalServiceError("Cloudflare R2", "Failed to delete media file.");
  }
}
