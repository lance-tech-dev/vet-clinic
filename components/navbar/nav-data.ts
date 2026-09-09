import { ROUTES } from "@/config/constants";

export interface NavLinkItem {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLinkItem[] = [
  {
    label: "Home",
    href: ROUTES.HOME,
  },
  {
    label: "About Us",
    href: ROUTES.ABOUT,
  },
  {
    label: "Services",
    href: ROUTES.SERVICES,
  },
  {
    label: "Branches",
    href: ROUTES.BRANCHES,
  },
  {
    label: "Contact Us",
    href: ROUTES.CONTACT,
  },
];