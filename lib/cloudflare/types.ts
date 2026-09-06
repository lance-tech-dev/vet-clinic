export interface UploadImageOptions {
  filename?: string;
  folder?: string;
  customId?: string;
  metadata?: Record<string, string>;
}

export interface UploadedMedia {
  id: string;
  filename: string;
  storageKey: string;
  url: string;
  mimeType: string;
  sizeBytes: number;
  uploadedAt: string;
}

export interface FileValidationSuccess {
  isValid: true;
  sanitizedFilename: string;
  mimeType: string;
  sizeBytes: number;
}

export interface FileValidationFailure {
  isValid: false;
  error: string;
}

export type FileValidationResult = FileValidationSuccess | FileValidationFailure;
