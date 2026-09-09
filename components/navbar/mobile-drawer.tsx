"use client";

import { useState, useEffect, useSyncExternalStore, useCallback } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-data";
import { ROUTES } from "@/config/constants";
import { logout } from "@/lib/auth/actions";

interface UserSessionInfo {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
  avatarUrl?: string | null;
}

interface MobileDrawerProps {
  user?: UserSessionInfo | null;
}

const emptySubscribe = () => () => {};

export function MobileDrawer({ user }: MobileDrawerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  // Derive/reset state during render when pathname changes (React standard pattern)
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
    }, 300); // Matches 300ms CSS transition duration
    return () => clearTimeout(timer);
  }, []);

  // Trigger entering animation on next animation frame
  useEffect(() => {
    if (!isOpen) return;

    const raf = requestAnimationFrame(() => {
      setIsVisible(true);
    });

    return () => {
      cancelAnimationFrame(raf);
    };
  }, [isOpen]);

  // Lock body scroll safely when drawer is open
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
    : "U";

  const isAdmin = user?.role === "admin";

  return (
    <div className="lg:hidden">
      {/* Hamburger Toggle Button */}
      <button
        type="button"
        onClick={handleOpen}
        className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 active:scale-95 text-navy-900 transition-all duration-200 cursor-pointer border border-slate-200/80"
        aria-label="Open navigation menu"
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

      {/* Drawer Portal */}
      {isOpen && isMounted && createPortal(
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          className="fixed inset-0 z-[9999] flex justify-end"
        >
          {/* Backdrop Overlay with Strict Touch Prevention */}
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
                  <span className="font-extrabold text-navy-900 text-base">Navigation</span>
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

              {/* User Quick Info Card (If Logged In) */}
              {user && (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center gap-3">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={user.avatarUrl}
                        alt={user.fullName || "User Avatar"}
                        className="w-10 h-10 rounded-xl object-cover border border-orange-400 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-xl bg-navy-900 text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        {initialLetter}
                      </div>
                    )}
                    <div className="overflow-hidden">
                      <div className="text-xs font-bold text-navy-900 truncate">
                        {user.fullName || "Pet Parent"}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate">{user.email}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <Link
                      href={ROUTES.PROFILE}
                      className="flex-1 text-center py-1.5 px-3 rounded-xl bg-white border border-slate-200 text-navy-900 font-bold text-xs hover:bg-orange-50 hover:text-orange-600 transition-colors"
                    >
                      My Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        href={ROUTES.ADMIN}
                        className="py-1.5 px-3 rounded-xl bg-navy-900 text-white font-extrabold text-xs shadow-2xs hover:bg-navy-800 transition-colors"
                      >
                        Admin 🛠️
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Navigation Links */}
              <nav className="space-y-1.5">
                {NAV_LINKS.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(link.href);

                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`block px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
                        isActive
                          ? "bg-orange-50 text-orange-600 font-extrabold border border-orange-200/80"
                          : "text-slate-700 hover:bg-slate-50 hover:text-navy-900"
                      }`}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Actions Stack */}
            <div className="space-y-3 pt-6 border-t border-slate-100">
              <Link
                href={ROUTES.APPOINTMENTS}
                className="w-full py-3 px-4 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs text-center shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2"
              >
                <span>📅</span>
                <span>Book Appointment</span>
              </Link>

              {user ? (
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full py-2.5 px-4 rounded-2xl bg-red-50 hover:bg-red-100 text-red-700 font-bold text-xs text-center transition-colors cursor-pointer"
                  >
                    Sign Out
                  </button>
                </form>
              ) : (
                <Link
                  href={ROUTES.LOGIN}
                  className="w-full py-2.5 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs text-center transition-colors block"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}