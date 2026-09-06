import Link from "next/link";
import { logout } from "@/lib/auth/actions";
import { ROUTES } from "@/config/constants";
import type { NavAuthState } from "@/lib/auth/types";

interface AuthNavProps {
  authState: NavAuthState;
  variant?: "desktop" | "mobile";
  onNavigate?: () => void;
}

export function AuthNav({ authState, variant = "desktop", onNavigate }: AuthNavProps) {
  const isMobile = variant === "mobile";

  return (
    <div className={isMobile ? "flex flex-col gap-3 w-full" : "flex items-center gap-3"}>
      {/* 1. Primary CTA: Book Now */}
      <Link
        href={ROUTES.APPOINTMENTS}
        onClick={onNavigate}
        className={
          isMobile
            ? "flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-2.5 text-sm font-bold text-white shadow-xs transition-colors hover:bg-orange-600"
            : "inline-flex items-center justify-center gap-1.5 rounded-full bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-xs transition-all hover:bg-orange-600 hover:shadow-orange-500/20 active:scale-95"
        }
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
        Book Now
      </Link>

      {!isMobile && <div className="h-4 w-[1px] bg-slate-200/80" />}

      {/* 2. Authentication / User Profile Controls */}
      {!authState.isAuthenticated ? (
        <Link
          href={ROUTES.LOGIN}
          onClick={onNavigate}
          className={
            isMobile
              ? "flex min-h-[44px] w-full items-center justify-center rounded-full bg-slate-100 px-4 py-2.5 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-200"
              : "rounded-full bg-slate-100/80 hover:bg-slate-200/80 px-4 py-2 text-xs font-semibold text-slate-800 transition-colors border border-slate-200/60"
          }
        >
          Login
        </Link>
      ) : (
        <div className={isMobile ? "flex flex-col gap-2 w-full" : "flex items-center gap-2"}>
          {/* Profile Badge */}
          <Link
            href={authState.isAdmin ? ROUTES.ADMIN : "/profile"}
            onClick={onNavigate}
            className={
              isMobile
                ? "flex min-h-[44px] w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-2.5 text-sm font-semibold text-navy-900"
                : "inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-slate-50/80 hover:bg-slate-100 px-3 py-1.5 text-xs font-semibold text-navy-900 transition-all shadow-2xs"
            }
            title={authState.displayName ?? "User Profile"}
          >
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-navy-900 text-[10px] font-bold text-white uppercase shadow-xs">
                {authState.displayName ? authState.displayName.charAt(0) : "U"}
              </div>
              <span className="max-w-[110px] truncate text-slate-700 font-medium">
                {authState.displayName ?? "Profile"}
              </span>
            </div>
            {authState.isAdmin && (
              <span className="rounded-full bg-orange-100 px-1.5 py-0.5 text-[9px] font-extrabold text-orange-800 uppercase tracking-wider">
                Admin
              </span>
            )}
          </Link>

          {/* Logout Action */}
          <form action={logout} className={isMobile ? "w-full" : undefined}>
            <button
              type="submit"
              onClick={onNavigate}
              className={
                isMobile
                  ? "flex min-h-[44px] w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-medium text-slate-500 hover:bg-slate-100"
                  : "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              }
              title="Logout"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className={isMobile ? "inline" : "hidden sm:inline"}>Logout</span>
            </button>
          </form>
        </div>
      )}
    </div>
  );
}