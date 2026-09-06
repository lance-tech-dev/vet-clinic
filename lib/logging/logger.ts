type LogLevel = "debug" | "info" | "warn" | "error";

const SENSITIVE_KEYS = [
  "password",
  "token",
  "secret",
  "key",
  "service_role",
  "authorization",
  "cookie",
  "api_token",
  "serviceRoleKey",
];

/**
 * Recursively scrubs sensitive credentials from logged objects.
 */
function scrubSensitiveData(data: unknown): unknown {
  if (!data || typeof data !== "object") {
    return data;
  }

  if (Array.isArray(data)) {
    return data.map(scrubSensitiveData);
  }

  const sanitized: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some((sensitive) =>
      key.toLowerCase().includes(sensitive.toLowerCase())
    );

    if (isSensitive) {
      sanitized[key] = "[REDACTED]";
    } else if (typeof value === "object" && value !== null) {
      sanitized[key] = scrubSensitiveData(value);
    } else {
      sanitized[key] = value;
    }
  }

  return sanitized;
}

function logMessage(level: LogLevel, message: string, context?: Record<string, unknown>) {
  const timestamp = new Date().toISOString();
  const sanitizedContext = context ? scrubSensitiveData(context) : undefined;

  const logPayload = {
    timestamp,
    level,
    message,
    ...(sanitizedContext ? { context: sanitizedContext } : {}),
  };

  const output = JSON.stringify(logPayload);

  switch (level) {
    case "error":
      console.error(output);
      break;
    case "warn":
      console.warn(output);
      break;
    case "info":
      console.info(output);
      break;
    case "debug":
      if (process.env.NODE_ENV !== "production") {
        console.debug(output);
      }
      break;
  }
}

export const logger = {
  debug: (message: string, context?: Record<string, unknown>) => logMessage("debug", message, context),
  info: (message: string, context?: Record<string, unknown>) => logMessage("info", message, context),
  warn: (message: string, context?: Record<string, unknown>) => logMessage("warn", message, context),
  error: (message: string, context?: Record<string, unknown>) => logMessage("error", message, context),
};
