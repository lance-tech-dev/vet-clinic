"use client";

import { usePathname } from "next/navigation";

interface PublicNavbarWrapperProps {
  children: React.ReactNode;
}

export function PublicNavbarWrapper({ children }: PublicNavbarWrapperProps) {
  const pathname = usePathname();

  // Hide public navbar completely when inside the Admin Portal
  if (pathname.startsWith("/admin")) {
    return null;
  }

  return <>{children}</>;
}