"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/navbar/logo";
import { logout } from "@/lib/auth/actions";
import type { NavAuthState } from "@/lib/auth/types";

export const ADMIN_NAV_ITEMS = [
  { label: "Dashboard", href: "/admin" },
  { label: "Fur Patients", href: "/admin/patients" },
  { label: "Owners", href: "/admin/owners" },
  { label: "Inbox", href: "/admin/inbox" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Branches", href: "/admin/branches" },
] as const;

interface AdminNavbarProps {
  authState: NavAuthState;
}

export function AdminNavbar({ authState }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  // Close drawer on ESC key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    },
    [closeDrawer]
  );

  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
      setTimeout(() => closeButtonRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isDrawerOpen, handleKeyDown]);

  // Close drawer when screen resizes to desktop (>= 1024px)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isDrawerOpen) closeDrawer();
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isDrawerOpen, closeDrawer]);

  return (
    <>
      <header
        role="banner"
        className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Top-Left: Logo */}
            <Logo />

            {/* Upper-Right: Desktop Tabs & Auth (>= 1024px) */}
            <div className="hidden lg:flex items-center gap-1 xl:gap-2">
              <nav aria-label="Admin Navigation" className="flex items-center gap-1">
                {ADMIN_NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
                        isActive
                          ? "text-orange-600 font-semibold bg-orange-50"
                          : "text-slate-600 hover:text-navy-900 hover:bg-navy-50/60"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="h-5 w-px bg-slate-200 mx-2" aria-hidden="true" />

              {/* User badge & Logout */}
              <div className="flex items-center gap-3 pl-1">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200">
                  Admin
                </span>
                <form action={logout}>
                  <button
                    type="submit"
                    className="rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-navy-900 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
                  >
                    Logout
                  </button>
                </form>
              </div>
            </div>

            {/* Mobile/Tablet Hamburger Toggle (< 1024px) */}
            <button
              type="button"
              onClick={toggleDrawer}
              className="lg:hidden inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-navy-900 hover:bg-navy-50 active:bg-navy-100 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              aria-controls="admin-mobile-drawer"
              aria-expanded={isDrawerOpen}
              aria-label={isDrawerOpen ? "Close navigation menu" : "Open navigation menu"}
            >
              <div className="w-5 h-4 relative flex flex-col justify-between" aria-hidden="true">
                <span
                  className={`h-0.5 w-full bg-navy-900 rounded-full transition-all duration-300 ease-in-out origin-center ${
                    isDrawerOpen ? "rotate-45 translate-y-[7px]" : ""
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-navy-900 rounded-full transition-all duration-200 ease-in-out ${
                    isDrawerOpen ? "opacity-0 scale-x-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`h-0.5 w-full bg-navy-900 rounded-full transition-all duration-300 ease-in-out origin-center ${
                    isDrawerOpen ? "-rotate-45 -translate-y-[7px]" : ""
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Off-Canvas Mobile Drawer */}
      <div
        className={`fixed inset-0 z-50 lg:hidden transition-all duration-300 ${
          isDrawerOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!isDrawerOpen}
      >
        {/* Backdrop Fade */}
        <div
          onClick={closeDrawer}
          className={`fixed inset-0 bg-navy-950/40 backdrop-blur-xs transition-opacity duration-300 ease-in-out ${
            isDrawerOpen ? "opacity-100" : "opacity-0"
          }`}
          aria-hidden="true"
        />

        {/* Sliding Drawer */}
        <div
          id="admin-mobile-drawer"
          ref={drawerRef}
          role="dialog"
          aria-modal="true"
          aria-label="Admin Navigation Menu"
          className={`fixed top-0 right-0 bottom-0 w-[85vw] max-w-sm h-full bg-white shadow-2xl border-l border-slate-200/80 flex flex-col justify-between transition-transform duration-300 ease-out z-50 ${
            isDrawerOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-slate-100">
            <Logo onClick={closeDrawer} />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={closeDrawer}
              className="inline-flex items-center justify-center min-w-[44px] min-h-[44px] p-2.5 rounded-lg text-navy-900 hover:bg-navy-50 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              aria-label="Close navigation menu"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          {/* Tab Links */}
          <nav className="flex-1 overflow-y-auto px-6 py-6" aria-label="Mobile Admin Navigation">
            <ul className="flex flex-col space-y-2">
              {ADMIN_NAV_ITEMS.map((item) => {
                const isActive =
                  item.href === "/admin"
                    ? pathname === "/admin"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={closeDrawer}
                      className={`flex items-center justify-between min-h-[48px] px-4 py-3 text-base font-medium rounded-xl transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
                        isActive
                          ? "text-orange-600 font-semibold bg-orange-50"
                          : "text-slate-700 hover:text-navy-900 hover:bg-slate-50"
                      }`}
                    >
                      <span>{item.label}</span>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Footer Auth Controls */}
          <div className="border-t border-slate-100 px-6 py-6 space-y-3">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm font-medium text-slate-600">
                {authState.displayName ?? "System Admin"}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-800">
                Admin
              </span>
            </div>
            <form action={logout}>
              <button
                type="submit"
                onClick={closeDrawer}
                className="w-full flex items-center justify-center min-h-[48px] rounded-xl bg-slate-100 text-slate-800 font-medium hover:bg-slate-200 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              >
                Logout
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}