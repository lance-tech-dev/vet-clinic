import { User } from "@supabase/supabase-js";
import { UserRole } from "@/config/constants";

export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: UserRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthSession {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isStaff: boolean;
}

/**
 * Minimal, display-only auth data for UI like the Navbar. Deliberately excludes
 * the full Supabase User/UserProfile objects (email, metadata, etc.) — this is
 * the only auth shape passed from a Server Component into a Client Component,
 * so it stays small and non-sensitive (a Data Transfer Object).
 */
export interface NavAuthState {
  isAuthenticated: boolean;
  displayName: string | null;
  isAdmin: boolean;
}
