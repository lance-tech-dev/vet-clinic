"use client";

import { MobileDrawer } from "./mobile-drawer";

interface UserSessionInfo {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
  avatarUrl?: string | null;
}

interface HamburgerButtonProps {
  user?: UserSessionInfo | null;
}

export function HamburgerButton({ user }: HamburgerButtonProps) {
  return <MobileDrawer user={user} />;
}