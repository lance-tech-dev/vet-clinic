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

  if (!authState.isAuthenticated) {
    return (
      <Link
        href={ROUTES.LOGIN}
        onClick={onNavigate}
        className={
          isMobile
            ? "flex min-h-[48px] items-center justify-center rounded-xl bg-navy-900 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
            : "rounded-lg bg-navy-900 px-3.5 py-2 text-sm font-semibold text-white transition-colors hover:bg-navy-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
        }
      >
        Login
      </Link>
    );
  }

  return (
    <div className={isMobile ? "flex flex-col gap-3" : "flex items-center gap-3"}>
      <span
        className={`truncate text-navy-700 ${isMobile ? "px-4 text-sm" : "max-w-[10rem] text-sm"}`}
        title={authState.displayName ?? undefined}
      >
        {authState.displayName}
      </span>
      <form action={logout} className={isMobile ? "w-full" : undefined}>
        <button
          type="submit"
          onClick={onNavigate}
          className={
            isMobile
              ? "flex min-h-[48px] w-full items-center justify-center rounded-xl px-4 py-3 text-base font-medium text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
              : "rounded-lg px-3.5 py-2 text-sm font-medium text-navy-700 transition-colors hover:bg-navy-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900"
          }
        >
          Logout
        </button>
      </form>
    </div>
  );
}
