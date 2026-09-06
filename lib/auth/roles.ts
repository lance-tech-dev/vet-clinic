import { USER_ROLES, UserRole } from "@/config/constants";

/**
 * Validates if the given role matches Admin privileges.
 */
export function isAdmin(role: string | null | undefined): boolean {
  return role === USER_ROLES.ADMIN;
}

/**
 * Validates if the given role matches Staff or Admin privileges.
 */
export function isStaffOrAdmin(role: string | null | undefined): boolean {
  return role === USER_ROLES.ADMIN || role === USER_ROLES.STAFF;
}

/**
 * Checks if a user possesses the minimum required role level.
 * Hierarchy: admin > staff > user
 */
export function hasMinimumRole(userRole: UserRole, requiredRole: UserRole): boolean {
  const hierarchy: Record<UserRole, number> = {
    [USER_ROLES.USER]: 1,
    [USER_ROLES.STAFF]: 2,
    [USER_ROLES.ADMIN]: 3,
  };

  return (hierarchy[userRole] ?? 0) >= (hierarchy[requiredRole] ?? 0);
}
