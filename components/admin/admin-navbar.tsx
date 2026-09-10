"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { logout } from "@/lib/auth/actions";

interface AdminUserSession {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
  avatarUrl?: string | null;
}

interface AdminNavbarProps {
  user?: AdminUserSession | null;
}

// Static definition outside component body prevents object re-creation on re-renders
const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
  },
  {
    label: "Fur Patients",
    href: "/admin/patients",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM18 11c0 1.657-1.343 3-3 3s-3-1.343-3-3 1.343-3 3-3 3 1.343 3 3zM8.5 17c0 1.38-1.12 2.5-2.5 2.5S3.5 18.38 3.5 17s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5zM20.5 17c0 1.38-1.12 2.5-2.5 2.5s-2.5-1.12-2.5-2.5 1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5z" />
      </svg>
    ),
  },
  {
    label: "Owners",
    href: "/admin/owners",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
  },
  {
    label: "Inbox",
    href: "/admin/inbox",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8 7V3m8 0v4m-9 4h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    label: "Branches",
    href: "/admin/branches",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M19 21V5a2 2 0 00-2-2H5a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Staff",
    href: "/admin/staff",
    icon: (
      <svg className="w-4 h-4 shrink-0 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 012-2h2a2 2 0 012 2v1m-4 0h4" />
      </svg>
    ),
  },
];

const emptySubscribe = () => () => {};

export function AdminNavbar({ user }: AdminNavbarProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [prevPathname, setPrevPathname] = useState(pathname);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Synchronously reset drawer state when pathname changes during render
  if (prevPathname !== pathname) {
    setPrevPathname(pathname);
    if (isOpen) {
      setIsOpen(false);
      setIsVisible(false);
    }
  }

  const handleOpen = () => {
    setIsOpen(true);
  };

  const handleClose = useCallback(() => {
    setIsVisible(false);
    const timer = setTimeout(() => {
      setIsOpen(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Trigger enter animation on animation frame
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [isOpen]);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const initialLetter = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "A";

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-200/80 shadow-2xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Left: Brand Logo */}
        <div className="flex items-center shrink-0">
          <Link
            href="/admin"
            className="flex items-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/vetclinic-logo.png"
              alt="VetClinic FurBabies & Friends"
              width={160}
              height={44}
              className="h-10 sm:h-11 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* Middle: Modern Desktop Navigation Bar */}
        <nav className="hidden xl:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
          {NAV_ITEMS.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-[color,background-color,border-color,box-shadow] duration-200 ease-out flex items-center gap-1.5 whitespace-nowrap border ${
                  isActive
                    ? "bg-white text-orange-600 shadow-2xs border-slate-200/80"
                    : "border-transparent text-slate-600 hover:text-navy-900 hover:bg-white/60"
                }`}
              >
                <span className={isActive ? "text-orange-500" : "text-slate-400"}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right: Clean User Profile Container */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-white text-navy-900 shadow-2xs">
              {user?.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user.avatarUrl}
                  alt={user.fullName || "Admin Avatar"}
                  className="w-6 h-6 rounded-full object-cover border border-orange-400 shrink-0"
                />
              ) : (
                <div className="w-6 h-6 rounded-full bg-navy-900 text-white font-extrabold text-[11px] flex items-center justify-center shrink-0">
                  {initialLetter}
                </div>
              )}
              <span className="text-xs font-bold text-navy-900 max-w-[120px] truncate">
                {user?.fullName || "System Admin"}
              </span>
            </div>

            <form action={logout}>
              <button
                type="submit"
                className="px-3 py-1 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                Sign Out
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Hamburger Toggle Button */}
        <button
          type="button"
          onClick={handleOpen}
          className="xl:hidden p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-navy-900 transition-all duration-200 cursor-pointer border border-slate-200/80"
          aria-label="Open admin navigation menu"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2.2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Admin Mobile Navigation Drawer Portal */}
      {isOpen && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Admin Navigation"
          className="fixed inset-0 z-[9999] flex justify-end"
        >
          {/* Backdrop Overlay */}
          <div
            className={`fixed inset-0 bg-navy-950/60 backdrop-blur-xs transition-opacity duration-300 ease-out touch-none ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            onClick={handleClose}
            onTouchMove={(e) => e.preventDefault()}
            aria-hidden="true"
          />

          {/* Slide-out Sheet */}
          <div
            className={`relative z-10 w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              isVisible ? "translate-x-0" : "translate-x-full"
            }`}
          >
            <div className="space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🐾</span>
                  <span className="font-extrabold text-navy-900 text-base">Admin Navigation</span>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl text-slate-400 hover:text-navy-900 hover:bg-slate-100 transition-colors cursor-pointer"
                  aria-label="Close menu"
                >
                  ✕
                </button>
              </div>

              {/* Admin User Session Card */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                <div className="flex items-center gap-3">
                  {user?.avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName || "Admin Avatar"}
                      className="w-10 h-10 rounded-xl object-cover border border-orange-400 shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-xl bg-navy-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                      {initialLetter}
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <div className="text-xs font-bold text-navy-900 truncate">
                      {user?.fullName || "System Administrator"}
                    </div>
                    <div className="text-[11px] text-slate-500 truncate">{user?.email}</div>
                  </div>
                </div>
              </div>

              {/* Admin Nav Links */}
              <nav className="space-y-1.5">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-colors ${
                        isActive
                          ? "bg-orange-50 text-orange-600 font-extrabold border border-orange-200/80"
                          : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                      }`}
                    >
                      <span className={isActive ? "text-orange-500" : "text-slate-400"}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout Action */}
            <div className="pt-6 border-t border-slate-100">
              <form action={logout}>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs text-center transition-colors cursor-pointer"
                >
                  Sign Out
                </button>
              </form>
            </div>
          </div>
        </div>,
        document.body
      )}
    </header>
  );
}