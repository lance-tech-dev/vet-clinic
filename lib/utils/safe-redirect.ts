/**
 * Validates a user-supplied redirect target so it can only ever be a
 * same-origin relative path — never an absolute URL or protocol-relative
 * URL ("//evil.com") that would send the user off-site after login.
 *
 * Use this on every redirect target that originates from request input
 * (query params, form fields), never trust it unsanitized.
 */
export function sanitizeRedirectTarget(
  value: FormDataEntryValue | string | null | undefined,
  fallback: string
): string {
  if (typeof value !== "string" || value.length === 0) {
    return fallback;
  }

  if (!value.startsWith("/")) {
    return fallback;
  }

  // "//evil.com" and "/\evil.com" are both browser-normalized into
  // protocol-relative URLs by some clients — reject both forms.
  if (value.startsWith("//") || value.startsWith("/\\")) {
    return fallback;
  }

  if (value.includes("://")) {
    return fallback;
  }

  return value;
}
