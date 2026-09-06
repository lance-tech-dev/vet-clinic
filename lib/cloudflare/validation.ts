import { MEDIA_CONFIG } from "@/config/constants";
import { FileValidationResult } from "./types";
import path from "path";

/**
 * Sanitizes an untrusted filename to prevent path traversal, XSS, and filesystem injection.
 */
export function sanitizeFilename(rawFilename: string): string {
  // Extract basename to prevent directory traversal
  const basename = path.basename(rawFilename);
  const ext = path.extname(basename).toLowerCase();
  const nameWithoutExt = path.basename(basename, ext);

  // Allow only alphanumeric characters, underscores, and hyphens in the filename
  const cleanName = nameWithoutExt
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 100);

  const safeName = cleanName || "media-upload";
  const safeExt = ext.replace(/[^a-zA-Z0-9.]/g, "").slice(0, 10);

  return `${Date.now()}-${safeName}${safeExt}`;
}

/**
 * Verifies magic number binary signatures to confirm true file format.
 */
function verifyMagicBytes(buffer: Uint8Array, declaredMimeType: string): boolean {
  if (buffer.length < 12) return false;

  // JPEG: FF D8 FF
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return declaredMimeType === "image/jpeg";
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return declaredMimeType === "image/png";
  }

  // WebP: RIFF ... WEBP (52 49 46 46 ... 57 45 42 50)
  if (
    buffer[0] === 0x52 &&
    buffer[1] === 0x49 &&
    buffer[2] === 0x46 &&
    buffer[3] === 0x46 &&
    buffer[8] === 0x57 &&
    buffer[9] === 0x45 &&
    buffer[10] === 0x42 &&
    buffer[11] === 0x50
  ) {
    return declaredMimeType === "image/webp";
  }

  // SVG or other text XML image
  if (declaredMimeType === "image/svg+xml") {
    const textHeader = new TextDecoder("utf-8")
      .decode(buffer.slice(0, 256))
      .trim()
      .toLowerCase();
    return textHeader.includes("<svg") || textHeader.includes("<?xml");
  }

  // AVIF: check for ftyp box
  if (declaredMimeType === "image/avif") {
    const headerStr = new TextDecoder("ascii").decode(buffer.slice(4, 16));
    return headerStr.includes("ftyp");
  }

  return false;
}

/**
 * Comprehensive server-side validation for uploaded media files.
 */
export async function validateMediaFile(
  file: File | { name: string; type: string; size: number; arrayBuffer: () => Promise<ArrayBuffer> }
): Promise<FileValidationResult> {
  // 1. Validate file existence
  if (!file || typeof file.size !== "number" || file.size === 0) {
    return {
      isValid: false,
      error: "Uploaded file is empty or invalid.",
    };
  }

  // 2. Validate file size limits
  if (file.size > MEDIA_CONFIG.MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      error: `File size exceeds the maximum limit of ${MEDIA_CONFIG.MAX_FILE_SIZE_MB}MB.`,
    };
  }

  // 3. Validate declared MIME type
  const mimeType = (file.type || "").toLowerCase();
  const isAllowedMime = MEDIA_CONFIG.ALLOWED_MIME_TYPES.includes(
    mimeType as (typeof MEDIA_CONFIG.ALLOWED_MIME_TYPES)[number]
  );

  if (!isAllowedMime) {
    return {
      isValid: false,
      error: `Unsupported file type "${mimeType}". Allowed types: ${MEDIA_CONFIG.ALLOWED_MIME_TYPES.join(", ")}.`,
    };
  }

  // 4. Validate file extension
  const ext = path.extname(file.name || "").toLowerCase();
  const isAllowedExt = MEDIA_CONFIG.ALLOWED_EXTENSIONS.includes(
    ext as (typeof MEDIA_CONFIG.ALLOWED_EXTENSIONS)[number]
  );

  if (!isAllowedExt) {
    return {
      isValid: false,
      error: `Unsupported file extension "${ext}". Allowed extensions: ${MEDIA_CONFIG.ALLOWED_EXTENSIONS.join(", ")}.`,
    };
  }

  // 5. Inspect binary magic bytes to prevent masqueraded files
  try {
    const buffer = new Uint8Array(await file.arrayBuffer());
    const isSignatureValid = verifyMagicBytes(buffer, mimeType);

    if (!isSignatureValid) {
      return {
        isValid: false,
        error: "File binary content does not match the declared image format.",
      };
    }
  } catch {
    return {
      isValid: false,
      error: "Failed to verify binary file contents.",
    };
  }

  // 6. Generate sanitized filename
  const sanitizedFilename = sanitizeFilename(file.name || "media");

  return {
    isValid: true,
    sanitizedFilename,
    mimeType,
    sizeBytes: file.size,
  };
}
