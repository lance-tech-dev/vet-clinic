"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NavItem } from "./types";

interface DesktopNavProps {
  items: NavItem[];
}

export function DesktopNav({ items }: DesktopNavProps) {
  const pathname = usePathname();

  return (
    <nav
      className="hidden lg:flex items-center gap-1 bg-slate-100/80 p-1 rounded-full border border-slate-200/60 shadow-inner/5"
      aria-label="Main Navigation"
    >
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
              isActive
                ? "bg-white text-navy-900 font-semibold shadow-xs"
                : "text-slate-600 hover:text-navy-900 hover:bg-white/50"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}