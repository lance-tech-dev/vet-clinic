"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { ROUTES } from "@/config/constants";
import { AuthRequiredModal } from "@/components/auth/auth-required-modal";
import type { NavAuthState } from "@/lib/auth/types";

interface AuthNavProps {
  authState: NavAuthState;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function AuthNav({ authState, variant = "desktop", onNavigate }: AuthNavProps) {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const isMobile = variant === "mobile";
  const profileHref = authState.isAdmin ? ROUTES.ADMIN : ROUTES.PROFILE;
  const initialLetter = authState.displayName
    ? authState.displayName.charAt(0).toUpperCase()
    : "U";

  const handleBookNowClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!authState.isAuthenticated) {
      e.preventDefault();
      if (onNavigate) onNavigate(); // Close mobile drawer if open
      setIsAuthModalOpen(true);
    } else if (onNavigate) {
      onNavigate();
    }
  };

  if (isMobile) {
    return (
      <>
        <div className="flex flex-col gap-3 w-full">
          {/* 1. Primary CTA: Book Now Button */}
          <Link
            href={ROUTES.APPOINTMENTS}
            onClick={handleBookNowClick}
            className="flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-white shadow-md transition-all hover:bg-orange-600 active:scale-98 cursor-pointer"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span>Book Now</span>
          </Link>

          {/* 2. User Profile & Auth Controls */}
          {authState.isAuthenticated ? (
            <div className="flex flex-col gap-2.5 w-full pt-2 border-t border-slate-100">
              <Link
                href={profileHref}
                onClick={onNavigate}
                className="flex min-h-[48px] w-full items-center justify-between rounded-xl bg-slate-100/80 px-4 py-2.5 text-sm font-semibold text-navy-900 hover:bg-slate-200/80 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white uppercase shadow-xs">
                    {initialLetter}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-xs font-bold text-navy-900 truncate max-w-[150px]">
                      {authState.displayName ?? "User Profile"}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {authState.isAdmin ? "Administrator" : "Client Profile"}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-bold text-orange-600">View →</span>
              </Link>

              <form action={logout} className="w-full">
                <button
                  type="submit"
                  onClick={onNavigate}
                  className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  <span>Logout</span>
                </button>
              </form>
            </div>
          ) : (
            <Link
              href={ROUTES.LOGIN}
              onClick={onNavigate}
              className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-2xs hover:bg-slate-50 transition-colors"
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Login</span>
            </Link>
          )}
        </div>

        {/* Modal Instance */}
        <AuthRequiredModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </>
    );
  }

  // Desktop Variant
  return (
    <>
      <div className="flex items-center gap-3">
        {/* 1. Book Now CTA Button */}
        <Link
          href={ROUTES.APPOINTMENTS}
          onClick={handleBookNowClick}
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-orange-600 hover:shadow-orange-500/20 active:scale-95 cursor-pointer"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          <span>Book Now</span>
        </Link>

        {/* Separator */}
        <div className="h-4 w-[1px] bg-slate-200/80" />

        {/* 2. User Profile / Auth Controls */}
        {authState.isAuthenticated ? (
          <div className="flex items-center gap-2.5">
            <Link
              href={profileHref}
              className="relative flex h-9 w-9 items-center justify-center rounded-full bg-navy-900 text-xs font-bold text-white ring-2 ring-slate-100 hover:ring-orange-500/50 hover:bg-navy-800 transition-all shadow-2xs cursor-pointer"
              aria-label="User Profile"
              title={authState.displayName ? `${authState.displayName}'s Profile` : "User Profile"}
            >
              <span>{initialLetter}</span>
              {authState.isAdmin && (
                <span className="absolute -top-0.5 -right-0.5 flex h-3 w-3 items-center justify-center rounded-full bg-orange-500 ring-2 ring-white">
                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                </span>
              )}
            </Link>

            <form action={logout}>
              <button
                type="submit"
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-50 hover:bg-red-50 hover:border-red-200 hover:text-red-700 px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-all cursor-pointer"
                title="Logout"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Logout</span>
              </button>
            </form>
          </div>
        ) : (
          <Link
            href={ROUTES.LOGIN}
            className="inline-flex items-center justify-center gap-1.5 rounded-full border border-slate-200/80 bg-slate-100/80 hover:bg-slate-200/80 px-4 py-2 text-xs font-bold text-slate-800 transition-colors"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            <span>Login</span>
          </Link>
        )}
      </div>

      {/* Modal Instance */}
      <AuthRequiredModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
}