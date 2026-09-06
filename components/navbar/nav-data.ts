import { NavItem } from "./types";
import { ROUTES } from "@/config/constants";

export const NAV_ITEMS: NavItem[] = [
  { label: "Home", href: ROUTES.HOME },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Services", href: ROUTES.SERVICES },
  { label: "Contact", href: ROUTES.CONTACT },
];