export type ErrorCode =
  | "VALIDATION_ERROR"
  | "AUTHENTICATION_ERROR"
  | "FORBIDDEN_ERROR"
  | "NOT_FOUND_ERROR"
  | "CONFLICT_ERROR"
  | "RATE_LIMIT_ERROR"
  | "EXTERNAL_SERVICE_ERROR"
  | "DATABASE_ERROR"
  | "INTERNAL_SERVER_ERROR";

export class AppError extends Error {
  public readonly code: ErrorCode;
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown> | Array<unknown>;

  constructor({
    message,
    code = "INTERNAL_SERVER_ERROR",
    statusCode = 500,
    isOperational = true,
    details,
  }: {
    message: string;
    code?: ErrorCode;
    statusCode?: number;
    isOperational?: boolean;
    details?: Record<string, unknown> | Array<unknown>;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, unknown> | Array<unknown>) {
    super({
      message,
      code: "VALIDATION_ERROR",
      statusCode: 400,
      details,
    });
  }
}

export class AuthenticationError extends AppError {
  constructor(message = "Authentication required to perform this action.") {
    super({
      message,
      code: "AUTHENTICATION_ERROR",
      statusCode: 401,
    });
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to access this resource.") {
    super({
      message,
      code: "FORBIDDEN_ERROR",
      statusCode: 403,
    });
  }
}

export class NotFoundError extends AppError {
  constructor(resource = "Resource", identifier?: string) {
    const message = identifier
      ? `${resource} with identifier "${identifier}" was not found.`
      : `${resource} was not found.`;
    super({
      message,
      code: "NOT_FOUND_ERROR",
      statusCode: 404,
    });
  }
}

export class ExternalServiceError extends AppError {
  constructor(serviceName: string, message: string, details?: Record<string, unknown>) {
    super({
      message: `External service error (${serviceName}): ${message}`,
      code: "EXTERNAL_SERVICE_ERROR",
      statusCode: 502,
      details,
    });
  }
}

export class DatabaseError extends AppError {
  constructor(message = "A database error occurred. Please try again later.") {
    super({
      message,
      code: "DATABASE_ERROR",
      statusCode: 500,
    });
  }
}
