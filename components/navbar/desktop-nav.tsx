"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_LINKS } from "./nav-data";

export function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/60">
      {NAV_LINKS.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-white text-orange-600 shadow-2xs font-extrabold"
                : "text-slate-600 hover:text-navy-900 hover:bg-white/60"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}