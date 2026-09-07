import { NavItem } from "./types";
import { ROUTES } from "@/config/constants";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.HOME },
  { label: "About Us", href: ROUTES.ABOUT },
  { label: "Services", href: ROUTES.SERVICES },
  { label: "Branches", href: ROUTES.BRANCHES },
  { label: "Contact Us", href: ROUTES.CONTACT },
];