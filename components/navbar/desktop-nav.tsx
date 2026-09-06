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
    <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
      {items.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 ${
              isActive
                ? "text-navy-900 font-semibold bg-navy-50"
                : "text-slate-600 hover:text-navy-900 hover:bg-navy-50/60"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
