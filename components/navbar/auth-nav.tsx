"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ROUTES } from "@/config/constants";
import { logout } from "@/lib/auth/actions";

interface UserSessionInfo {
  id: string;
  email: string;
  fullName?: string | null;
  role?: string;
  avatarUrl?: string | null;
}

interface AuthNavProps {
  user?: UserSessionInfo | null;
}

export function AuthNav({ user }: AuthNavProps) {
  const pathname = usePathname();

  const initialLetter = user?.fullName
    ? user.fullName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";

  const isAdmin = user?.role === "admin";
  const isProfileActive = pathname === ROUTES.PROFILE;

  return (
    <div className="hidden lg:flex items-center gap-3 shrink-0">
      {/* Primary Book Appointment CTA */}
      <Link
        href={ROUTES.APPOINTMENTS}
        className="px-5 py-2.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-bold text-xs shadow-xs shadow-orange-500/20 transition-all duration-200 hover:shadow-md hover:scale-[1.02] flex items-center gap-1.5"
      >
        <span>📅</span>
        <span>Book Now</span>
      </Link>

      {user ? (
        <div className="flex items-center gap-2 bg-slate-100/80 p-1.5 rounded-full border border-slate-200/80">
          {/* User Profile Shortcut */}
          <Link
            href={ROUTES.PROFILE}
            className={`flex items-center gap-2.5 px-3 py-1 rounded-full transition-all ${
              isProfileActive
                ? "bg-white text-orange-600 shadow-2xs font-extrabold"
                : "hover:bg-white/80 text-navy-900"
            }`}
          >
            {user.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={user.avatarUrl}
                alt={user.fullName || "User Avatar"}
                className="w-7 h-7 rounded-full object-cover border border-orange-400 shrink-0"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-navy-900 text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                {initialLetter}
              </div>
            )}
            <span className="text-xs font-bold max-w-[120px] truncate">
              {user.fullName || user.email.split("@")[0]}
            </span>
          </Link>

          {/* Admin Portal Shortcut Badge */}
          {isAdmin && (
            <Link
              href={ROUTES.ADMIN}
              className="px-3 py-1 rounded-full bg-navy-900 hover:bg-navy-800 text-white text-[11px] font-extrabold shadow-2xs transition-colors flex items-center gap-1"
            >
              <span>🛠️</span>
              <span>Admin</span>
            </Link>
          )}

          {/* Logout Button */}
          <form action={logout}>
            <button
              type="submit"
              className="px-3 py-1 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
            >
              Sign Out
            </button>
          </form>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href={ROUTES.LOGIN}
            className="px-4 py-2 rounded-full bg-slate-100 hover:bg-slate-200 text-navy-900 font-bold text-xs transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}
    </div>
  );
}