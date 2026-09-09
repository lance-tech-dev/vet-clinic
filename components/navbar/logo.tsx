import Link from "next/link";
import Image from "next/image";
import { ROUTES } from "@/config/constants";

export function Logo() {
  return (
    <Link
      href={ROUTES.HOME}
      className="flex items-center shrink-0 transition-opacity hover:opacity-90"
    >
      <Image
        src="/vetclinic-logo.png"
        alt="VetClinic FurBabies & Friends"
        width={160}
        height={44}
        className="h-10 sm:h-11 w-auto object-contain"
        priority
      />
    </Link>
  );
}