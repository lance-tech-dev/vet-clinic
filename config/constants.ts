export const USER_ROLES = {
  ADMIN: "admin",
  STAFF: "staff",
  USER: "user",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];

export const MEDIA_CONFIG = {
  MAX_FILE_SIZE_BYTES: 10 * 1024 * 1024, // 10MB
  MAX_FILE_SIZE_MB: 10,
  ALLOWED_MIME_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/avif",
    "image/svg+xml",
  ] as const,
  ALLOWED_EXTENSIONS: [".jpg", ".jpeg", ".png", ".webp", ".avif", ".svg"] as const,
} as const;

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  SERVICES: "/services",
  CONTACT: "/contact",
  APPOINTMENTS: "/appointments",
  PROFILE: "/profile",
  LOGIN: "/login",
  REGISTER: "/register",
  ADMIN: "/admin",
  UNAUTHORIZED: "/unauthorized",
} as const;