"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { HamburgerButton } from "./hamburger-button";
import { MobileDrawer } from "./mobile-drawer";
import { AuthNav } from "./auth-nav";
import { NAV_ITEMS } from "./nav-data";
import { ROUTES } from "@/config/constants";
import type { NavAuthState } from "@/lib/auth/types";

interface NavbarProps {
  authState: NavAuthState;
}

export function Navbar({ authState }: NavbarProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Hide the public navbar on all /admin routes
  if (pathname.startsWith(ROUTES.ADMIN)) {
    return null;
  }

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Left: Logo / Brand */}
            <Logo />

            {/* Right: Desktop Navigation Links (>= 1024px) */}
            <DesktopNav items={NAV_ITEMS} />

            {/* Right: Desktop Auth Controls (>= 1024px) */}
            <div className="hidden lg:flex items-center ml-4">
              <AuthNav authState={authState} />
            </div>

            {/* Right: Mobile/Tablet Hamburger Toggle (< 1024px) */}
            <HamburgerButton
              isOpen={isDrawerOpen}
              onClick={toggleDrawer}
            />
          </div>
        </div>
      </header>

      {/* Off-Canvas Right-Side Navigation Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={NAV_ITEMS}
        authState={authState}
      />
    </>
  );
}