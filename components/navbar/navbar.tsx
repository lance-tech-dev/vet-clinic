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

  // Hide public navbar on admin pages
  if (pathname.startsWith(ROUTES.ADMIN)) {
    return null;
  }

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60 transition-colors"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Left: Brand Logo */}
            <Logo />

            {/* Center: Floating Navigation Pills */}
            <DesktopNav items={NAV_ITEMS} />

            {/* Right: Actions & User Menu */}
            <div className="hidden lg:flex items-center">
              <AuthNav authState={authState} />
            </div>

            {/* Mobile Navigation Trigger */}
            <HamburgerButton
              isOpen={isDrawerOpen}
              onClick={toggleDrawer}
            />
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={closeDrawer}
        items={NAV_ITEMS}
        authState={authState}
      />
    </>
  );
}