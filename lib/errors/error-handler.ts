import { AppError } from "./app-error";

export interface SafeErrorResponse {
  success: false;
  error: {
    message: string;
    code: string;
    statusCode: number;
    details?: Record<string, unknown> | Array<unknown>;
  };
}

/**
 * Serializes any caught server error into a safe, production-ready response.
 * Never leaks raw SQL errors, stack traces, or internal server paths in production.
 */
export function handleServerError(error: unknown): SafeErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: {
        message: error.message,
        code: error.code,
        statusCode: error.statusCode,
        details: error.details,
      },
    };
  }

  // Handle standard Error without leaking sensitive details
  const isDev = process.env.NODE_ENV === "development";
  const message = isDev && error instanceof Error ? error.message : "An unexpected server error occurred.";

  return {
    success: false,
    error: {
      message,
      code: "INTERNAL_SERVER_ERROR",
      statusCode: 500,
    },
  };
}
